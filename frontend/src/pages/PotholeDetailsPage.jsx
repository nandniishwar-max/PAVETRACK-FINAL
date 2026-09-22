import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  Split,
  ArrowLeft,
  AlertTriangle,
  FileCheck2,
  Wrench,
  Sparkles,
} from "lucide-react";
import { getComplaint } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import SeverityBadge from "../components/SeverityBadge";
import StatusStepper from "../components/StatusStepper";

export const PotholeDetailsPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const data = await getComplaint(id);
        setComplaint(data);
      } catch (err) {
        setErrorMsg(`Failed to load complaint with ID ${id}.`);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !complaint) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Complaint Not Found</h2>
          <p className="text-xs text-slate-500">{errorMsg || "The requested ID does not exist."}</p>
          <Link
            to="/track"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Track
          </Link>
        </div>
      </div>
    );
  }

  const beforePhoto = complaint.photos_before?.[0] || "/uploads/pothole_airoli_sec4_before.jpg";
  const repairSubmission = complaint.repair_submission;

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation & Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to="/track"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500">
              {complaint.complaint_id}
            </span>
            <SeverityBadge severity={complaint.severity} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Top: Large Photo of Pothole as specified in Section 6.5 */}
        <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 mb-8 group">
          <img
            src={beforePhoto}
            alt="Pothole view"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Overlaid metadata */}
          <div className="absolute bottom-4 left-4 right-4 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 backdrop-blur-xs text-[11px] font-bold text-slate-200 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>{complaint.location?.area}, Navi Mumbai</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {complaint.location?.address_text}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-mono">
                GPS: {complaint.location?.lat.toFixed(4)}, {complaint.location?.lng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Grid: Left Info Table + Right Vertical Stepper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Info Table & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Action Buttons: "View Verification Details" & "View Changes" */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
              <Link
                to={`/verify-results/${complaint.complaint_id}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-bold shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>View Verification Details</span>
              </Link>

              <Link
                to={`/compare/${complaint.complaint_id}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
              >
                <Split className="w-4 h-4 text-amber-400" />
                <span>View Changes (Before / After)</span>
              </Link>
            </div>

            {/* Structured Info Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Complaint Record Specifications
                </h3>
                <span className="text-xs font-mono text-slate-400">{complaint.complaint_id}</span>
              </div>

              <table className="w-full text-xs text-left">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-6 py-3 font-semibold text-slate-500 w-1/3">Complaint ID</td>
                    <td className="px-6 py-3 font-mono font-bold text-slate-900">
                      {complaint.complaint_id}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-semibold text-slate-500">Location Area</td>
                    <td className="px-6 py-3 font-semibold text-slate-800">
                      {complaint.location?.area}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-semibold text-slate-500">Full Address</td>
                    <td className="px-6 py-3 text-slate-700">
                      {complaint.location?.address_text}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-semibold text-slate-500">GPS Coordinates</td>
                    <td className="px-6 py-3 font-mono text-slate-700">
                      Lat {complaint.location?.lat}, Lng {complaint.location?.lng}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-semibold text-slate-500">Severity Assessment</td>
                    <td className="px-6 py-3">
                      <SeverityBadge severity={complaint.severity} size="sm" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-semibold text-slate-500">Lifecycle Status</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={complaint.status} size="sm" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-semibold text-slate-500">Assigned Contractor</td>
                    <td className="px-6 py-3 font-semibold text-slate-800">
                      {complaint.contractor_details?.name ||
                        complaint.assigned_contractor_id ||
                        "Pending Municipal Tender Assignment"}
                    </td>
                  </tr>
                  {complaint.description && (
                    <tr>
                      <td className="px-6 py-3 font-semibold text-slate-500">Citizen Remarks</td>
                      <td className="px-6 py-3 text-slate-600 italic">
                        "{complaint.description}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* AI Verification Snapshot if available */}
            {repairSubmission && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-900">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-800">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>AI Verification Score Generated</span>
                  </div>
                  <span className="text-sm font-black font-mono text-emerald-700">
                    {repairSubmission.verification_result?.overall_score}% Match
                  </span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  {repairSubmission.verification_result?.notes ||
                    "GPS distance, camera angle, and background landmark matching completed."}
                </p>
              </div>
            )}
          </div>

          {/* Right: Vertical Progress Tracker (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Progression Tracker
                </h3>
                <span className="text-xs font-semibold text-blue-700">7 Stages</span>
              </div>

              <StatusStepper
                currentStatus={complaint.status}
                statusHistory={complaint.status_history || []}
                timestamps={complaint.timestamps || {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PotholeDetailsPage;
