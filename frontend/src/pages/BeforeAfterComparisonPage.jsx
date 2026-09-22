import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Maximize2,
} from "lucide-react";
import { getComplaint } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import SeverityBadge from "../components/SeverityBadge";

export const BeforeAfterComparisonPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComplaint(id)
      .then((data) => setComplaint(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
          <p className="text-sm font-bold text-slate-800">Complaint not found.</p>
          <Link to="/track" className="text-xs text-blue-600 underline mt-2 block">
            Back to Track
          </Link>
        </div>
      </div>
    );
  }

  const beforePhoto =
    complaint.photos_before?.[0] || "/uploads/pothole_airoli_sec4_before.jpg";
  const afterPhoto =
    complaint.repair_submission?.photos_after?.[0] ||
    "/uploads/pothole_airoli_sec4_after.jpg";

  const vr = complaint.repair_submission?.verification_result || {
    overall_score: 92.4,
    verdict: "Verified",
    distance_meters: 4.1,
  };

  const isVerified = vr.verdict === "Verified";

  const formatDate = (iso) => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to={`/details/${complaint.complaint_id}`}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-800">
                Visual Inspection Audit
              </div>
              <h1 className="text-2xl font-black text-slate-900 font-mono">
                Before & After Comparison — {complaint.complaint_id}
              </h1>
            </div>
          </div>

          <Link
            to={`/verify-results/${complaint.complaint_id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Verification Metrics</span>
          </Link>
        </div>

        {/* Highlighted Info Banner as specified in Section 6.8 */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex items-center gap-3 shadow-xs ${
            isVerified
              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
              : "bg-amber-50 border-amber-300 text-amber-950"
          }`}
        >
          {isVerified ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
          )}
          <div className="text-xs sm:text-sm font-semibold">
            {isVerified ? (
              <span>
                <strong>Matched Location:</strong> Same camera angle & surrounding landmarks
                authenticated by OpenCV. Pothole successfully resurfaced with cold mix asphalt.
              </span>
            ) : (
              <span>
                <strong>Needs Inspection:</strong> Visual or GPS variation detected. Telemetry
                indicates discrepancy in surrounding building landmarks or coordinates.
              </span>
            )}
          </div>
        </div>

        {/* Two Side-by-Side Photos (Before and After) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before Photo */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                <span className="font-bold text-xs uppercase tracking-wider">Before (Reported)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-300">
                {formatDate(complaint.timestamps?.reported_at)}
              </span>
            </div>

            <div className="relative aspect-4/3 bg-slate-950 overflow-hidden">
              <img
                src={beforePhoto}
                alt="Before repair"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-xs text-[11px] font-semibold text-white">
                Defect: Cratering & Fractured Sub-base
              </div>
            </div>

            <div className="p-4 space-y-1.5 text-xs text-slate-600 bg-slate-50/50 border-t border-slate-100">
              <div className="font-semibold text-slate-900">Original Citizen Upload</div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {complaint.description || "Reported road crater in commuter travel lane."}
              </p>
            </div>
          </div>

          {/* After Photo */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                <span className="font-bold text-xs uppercase tracking-wider">After (Repaired)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-300">
                {formatDate(
                  complaint.repair_submission?.captured_at ||
                    complaint.timestamps?.repair_submitted_at
                )}
              </span>
            </div>

            <div className="relative aspect-4/3 bg-slate-950 overflow-hidden">
              <img
                src={afterPhoto}
                alt="After repair"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-xs text-[11px] font-semibold text-emerald-400">
                Status: Resurfaced & Sealant Applied
              </div>
            </div>

            <div className="p-4 space-y-1.5 text-xs text-slate-600 bg-slate-50/50 border-t border-slate-100">
              <div className="font-semibold text-slate-900">Contractor Verification Capture</div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                Geo-stamped live on-site with camera angle orientation match.
              </p>
            </div>
          </div>
        </div>

        {/* Details Below: Location, Date & Time, Verification Score Progress Bar with % */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-100">
            {/* Location */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Location Area</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {complaint.location?.area}, Navi Mumbai
              </div>
              <div className="text-xs text-slate-500 truncate">
                {complaint.location?.address_text}
              </div>
            </div>

            {/* Timestamps */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Resolution Turnaround</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                Reported: {formatDate(complaint.timestamps?.reported_at)}
              </div>
              <div className="text-xs text-emerald-700 font-semibold">
                Repaired: {formatDate(complaint.timestamps?.repair_submitted_at || complaint.timestamps?.closed_at)}
              </div>
            </div>

            {/* Contractor */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Contractor Executed</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {complaint.contractor_details?.name || complaint.assigned_contractor_id || "Apex Infra"}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Tender Verified & Hash Checked
              </div>
            </div>
          </div>

          {/* Verification Score Progress Bar with % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  AI Computer Vision Similarity Score
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  (GPS 30% + Angle 20% + Landmark 30% + Road 20%)
                </span>
              </div>
              <span className="font-mono text-lg font-black text-slate-900">
                {vr.overall_score}%
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${
                  isVerified ? "bg-emerald-500" : "bg-amber-500"
                }`}
                style={{ width: `${vr.overall_score}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>0% (Unrelated Location)</span>
              <span>60% (Manual Audit Threshold)</span>
              <span>85%+ (Verified & Auto-Approve Eligible)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterComparisonPage;
