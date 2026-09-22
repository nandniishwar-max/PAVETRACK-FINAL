import axios from "axios";

// In development Vite proxies /api and /uploads to FastAPI.
// In production set VITE_API_BASE_URL to the deployed backend URL.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

const toMediaUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return url.startsWith("/") ? url : `/${url}`;
};

const displayStatus = (status) => ({
  reported: "Reported",
  verified: "Verified",
  assigned: "Assigned",
  work_started: "Work Started",
  repair_submitted: "Repair Submitted",
  ai_verified: "AI Verification",
  manual_review: "AI Verification",
  closed: "Closed",
}[status] || status || "Reported");

const displaySeverity = (severity) => {
  if (!severity) return "Medium";
  return String(severity).charAt(0).toUpperCase() + String(severity).slice(1).toLowerCase();
};

const normalizeReport = (report) => {
  if (!report) return null;

  const media = toMediaUrl(report.media_url || report.image_url);
  const location = {
    lat: Number(report.latitude),
    lng: Number(report.longitude),
    address_text: report.address_text || "",
    area: report.area || "Navi Mumbai",
  };

  const repairs = report.repairs || [];
  const latestRepair = repairs.length ? repairs[repairs.length - 1] : null;
  const verification = report.verification || latestRepair?.verification || null;

  return {
    ...report,
    complaint_id: report.complaint_id || report.report_id || report._id,
    status: displayStatus(report.status),
    severity: displaySeverity(report.severity),
    assigned_contractor_id:
      report.assigned_contractor_id || report.assigned_contractor || null,
    location,
    photos_before: media ? [media] : [],
    timestamps: {
      reported_at: report.created_at,
      updated_at: report.updated_at,
      ...(report.timestamps || {}),
    },
    status_history: (report.timeline || report.status_history || []).map((item) => ({item,
    status: displayStatus(item.status),
    })),
        repair_submission: latestRepair
      ? {
          ...latestRepair,
          media_url: toMediaUrl(latestRepair.media_url),
          verification_result: verification
            ? {
                gps_match_pct: verification.gps_match ?? verification.gps_match_pct ?? 0,
                angle_match_pct: verification.angle_match ?? verification.angle_match_pct ?? 0,
                background_match_pct:
                  verification.background_match ?? verification.background_match_pct ?? 0,
                road_region_match_pct:
                  verification.road_region_match ??
                  verification.road_region_match_pct ??
                  0,
                overall_score: verification.overall_score ?? 0,
                verdict:
                  verification.verification_status === "verified"
                    ? "Verified"
                    : verification.verification_status === "manual_review"
                    ? "Manual Review"
                    : verification.verification_status === "rejected"
                    ? "Rejected"
                    : "Pending",
                distance_meters: verification.gps_distance_meters ?? 0,
                keypoints_matched: verification.visual_matches ?? 0,
                total_keypoints: verification.visual_matches ?? 0,
                notes: "Verification calculated by the PaveTrack backend.",
              }
            : null,
        }
      : null,
  };
};

// --------------------------------------------------
// REPORTS
// --------------------------------------------------

export const getComplaints = async (params = {}) => {
  const res = await api.get("/api/reports", { params });
  const reports = Array.isArray(res.data) ? res.data : res.data?.reports || [];
  return reports.map(normalizeReport);
};

export const getComplaint = async (id) => {
  const res = await api.get(`/api/reports/${encodeURIComponent(id)}`);
  return normalizeReport(res.data);
};

export const createComplaint = async (data) => {
  const firstMedia = data?.photos_before?.[0] || null;

  const payload = {
    description: data?.description || "",
    severity: String(data?.severity || "Medium").toLowerCase(),
    latitude: Number(data?.location?.lat),
    longitude: Number(data?.location?.lng),
    media_url: firstMedia,
    media_type: firstMedia
      ? /\.(mp4|mov|webm)$/i.test(firstMedia)
        ? "video"
        : "image"
      : null,
    status: "reported",
    address_text: data?.location?.address_text || "",
    area: data?.location?.area || "Navi Mumbai",
    citizen_id: data?.citizen_id || null,
  };

  const res = await api.post("/api/reports", payload);

  return {
    ...res.data,
    complaint_id: res.data.complaint_id || res.data.report_id || res.data.id || res.data._id,
  };
};

// --------------------------------------------------
// FILE UPLOAD
// --------------------------------------------------

export const uploadComplaintPhoto = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/api/upload", formData);
  return {
    ...res.data,
    url: toMediaUrl(res.data.file_url),
  };
};

// --------------------------------------------------
// REPAIR + AI VERIFICATION
// --------------------------------------------------

export const submitRepair = async (complaintId, formData) => {
  // ContractorDashboard sends FormData. Upload the evidence first, then
  // create the repair record using the backend's actual JSON schema.
  let mediaUrl = formData?.media_url || null;
  let mediaType = formData?.media_type || null;

  if (formData instanceof FormData) {
    const file = formData.get("file");
    if (file instanceof File && file.size > 0) {
      const uploaded = await uploadComplaintPhoto(file);
      mediaUrl = uploaded.url;
      mediaType = uploaded.media_type;
    }

    const payload = {
      pothole_id: complaintId,
      media_url: mediaUrl,
      media_type: mediaType || "image",
      latitude: Number(formData.get("lat")),
      longitude: Number(formData.get("lng")),
      repair_description:
        formData.get("repair_description") ||
        "Repair evidence submitted by contractor.",
      verification_status: "pending",
    };

    const repairRes = await api.post("/api/repairs/verify", payload);

    // The contractor flow goes straight to the AI results page, so run the
    // backend verification immediately after saving the repair evidence.
    const verificationRes = await api.post(`/api/verification/${encodeURIComponent(complaintId)}`);

    return {
      ...repairRes.data,
      verification: verificationRes.data,
    };
  }

  const res = await api.post("/api/repairs/verify", {
    pothole_id: complaintId,
    ...formData,
  });
  return res.data;
};

export const getRepairs = async (complaintId) => {
  const res = await api.get(`/api/repairs/${encodeURIComponent(complaintId)}`);
  return res.data;
};

// --------------------------------------------------
// AI VERIFICATION
// --------------------------------------------------

export const verifyRepair = async (complaintId) => {
  const res = await api.post(`/api/verification/${encodeURIComponent(complaintId)}`);
  return res.data;
};

export const getVerification = async (complaintId) => {
  const res = await api.get(`/api/verification/${encodeURIComponent(complaintId)}`);
  return res.data;
};

// --------------------------------------------------
// STATUS / APPROVAL
// --------------------------------------------------

export const updateComplaintStatus = async (complaintId, status, note = "") => {
  const res = await api.patch(`/api/reports/${encodeURIComponent(complaintId)}/status`, {
    status,
    note,
  });
  return res.data;
};

export const assignContractor = async (complaintId, contractorId) => {
  const res = await api.patch(`/api/reports/${encodeURIComponent(complaintId)}/status`, {
    status: "assigned",
    note: `Contractor assigned: ${contractorId}`,
    assigned_contractor: contractorId,
  });
  return res.data;
};

export const closeComplaint = async (complaintId) => {
  const res = await api.post(`/api/approval/${encodeURIComponent(complaintId)}`, {
    citizen_approved: true,
    authority_approved: true,
  });
  return res.data;
};

// --------------------------------------------------
// MAP / DASHBOARD
// --------------------------------------------------

export const getMapReports = async () => {
  const res = await api.get("/api/map/reports");
  return res.data;
};

export const getStats = async () => {
  const res = await api.get("/api/dashboard/stats");
  return res.data;
};

export const healthCheck = async () => {
  const res = await api.get("/health");
  return res.data;
};

export const getContractors = async () => {
  return [
    {
      contractor_id: "CON-001",
      name: "Apex Infrastructure",
      phone: "+91 98765 43210",
    },
    {
      contractor_id: "CON-002",
      name: "Navi Mumbai Roadworks",
      phone: "+91 98765 12345",
    },
    {
      contractor_id: "CON-003",
      name: "Urban Roads Pvt. Ltd.",
      phone: "+91 98765 67890",
    },
  ];
};

export default api;
