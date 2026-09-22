import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { getComplaint } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import SeverityBadge from "../components/SeverityBadge";
import StatusStepper from "../components/StatusStepper";

export const TrackComplaintPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get("id") || "PTH-2026-00102";

  const [inputVal, setInputVal] = useState(initialId);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const sampleIds = [
    "PTH-2026-00101", // Closed
    "PTH-2026-00102", // AI Verification
    "PTH-2026-00103", // Repair Submitted
    "PTH-2026-00104", // Work Started
    "PTH-2026-00106", // Critical Verified
  ];

  const handleFetch = async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await getComplaint(idToFetch.trim());
      setComplaint(data);
      setSearchParams({ id: idToFetch.trim() });
    } catch (err) {
      setErrorMsg(`Complaint with ID "${idToFetch}" not found.`);
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      handleFetch(initialId);
    }
  }, [initialId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFetch(inputVal);
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return "N/A";
    return new Date(isoStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="mb-6 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-800">
            Real-time Status Tracking
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Track your Complaint
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Check the multi-stage repair pipeline, municipal tender assignment, and AI verification results.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Complaint ID (e.g. PTH-2026-00102)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono text-sm uppercase font-semibold"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? "Tracking..." : "Track"}
            </button>
          </form>

          {/* Quick chips for seed complaints */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Quick Demo Samples:</span>
            {sampleIds.map((sid) => (
              <button
                key={sid}
                type="button"
                onClick={() => {
                  setInputVal(sid);
                  handleFetch(sid);
                }}
                className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-colors ${
                  complaint?.complaint_id === sid
                    ? "bg-blue-100 text-blue-900 border-blue-300 font-bold"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {sid}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Result Container: Left Card + Right Stepper */}
        {complaint && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            {/* Left Result Card (5 cols) */}
            <div className="md:col-span-5 space-y-5 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Complaint ID
                </span>
                <div className="text-2xl font-black font-mono text-slate-900 mt-0.5">
                  {complaint.complaint_id}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={complaint.status} />
                <SeverityBadge severity={complaint.severity} />
              </div>

              {/* Pothole Photo Thumbnail */}
              {complaint.photos_before && complaint.photos_before[0] && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-900">
                  <img
                    src={complaint.photos_before[0]}
                    alt="Pothole"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider">
                    Original Report
                  </div>
                </div>
              )}

              {/* Location & Reported date */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">{complaint.location?.area}</div>
                    <div>{complaint.location?.address_text}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Reported on: {formatDate(complaint.timestamps?.reported_at)}</span>
                </div>
              </div>

              {/* View Details Link */}
              <div className="pt-3">
                <Link
                  to={`/details/${complaint.complaint_id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1E3A8A] font-bold text-xs transition-colors"
                >
                  <span>View Details & Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Vertical 7-Stage Stepper (7 cols) */}
            <div className="md:col-span-7 md:pl-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Repair Progression Timeline
                </h3>
                <span className="text-xs text-slate-400 font-medium">7 Stage Audit</span>
              </div>

              <StatusStepper
                currentStatus={complaint.status}
                statusHistory={complaint.status_history || []}
                timestamps={complaint.timestamps || {}}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackComplaintPage;
