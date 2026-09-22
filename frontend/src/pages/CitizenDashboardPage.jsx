import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle2,
  Bell,
  MapPin,
  Calendar,
  ArrowRight,
  Filter,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getComplaints, getStats } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import SeverityBadge from "../components/SeverityBadge";
import LeafletMap from "../components/LeafletMap";

export const CitizenDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_complaints: 0,
    in_progress: 0,
    resolved: 0,
    announcements_count: 3,
    announcements: [],
  });
  const [complaints, setComplaints] = useState([]);
  const [selectedArea, setSelectedArea] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, complaintsData] = await Promise.all([
          getStats(),
          getComplaints(selectedArea !== "All" ? { area: selectedArea } : {}),
        ]);
        setStats(statsData);
        setComplaints(complaintsData);
      } catch (err) {
        console.error("Error loading citizen dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedArea]);

  const formatDate = (isoStr) => {
    if (!isoStr) return "";
    return new Date(isoStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header: Hello, {Name}! */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-800">
              Civic Engagement Hub
            </div>
            <h1 className="text-3xl font-black text-slate-900 mt-1">
              Hello, {user?.name || "Citizen"}!
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Track local road defects, view municipal assignments, and report new road hazards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Your Area Selector */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <MapPin className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-semibold text-slate-700">Area:</span>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="text-xs font-bold bg-transparent text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="All">All Navi Mumbai</option>
                <option value="Airoli">Airoli</option>
                <option value="Ghansoli">Ghansoli</option>
                <option value="Koparkhairane">Koparkhairane</option>
              </select>
            </div>

            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Pothole</span>
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Complaints */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.total_complaints}</div>
              <div className="text-xs font-medium text-slate-500">Total Complaints</div>
            </div>
          </div>

          {/* Card 2: In Progress */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-600">{stats.in_progress}</div>
              <div className="text-xs font-medium text-slate-500">In Progress</div>
            </div>
          </div>

          {/* Card 3: Resolved */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600">{stats.resolved}</div>
              <div className="text-xs font-medium text-slate-500">Resolved & Verified</div>
            </div>
          </div>

          {/* Card 4: Announcements */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-purple-600">{stats.announcements_count}</div>
              <div className="text-xs font-medium text-slate-500">Announcements</div>
            </div>
          </div>
        </div>

        {/* Content Row: Recent Complaints (Left) + Embedded Map (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Recent Complaints List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Recent Complaints</h2>
              <Link
                to="/map"
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {complaints.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">
                  No complaints found for selected area.
                </div>
              ) : (
                complaints.slice(0, 6).map((c) => (
                  <Link
                    key={c.complaint_id}
                    to={`/details/${c.complaint_id}`}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors block"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {c.complaint_id}
                        </span>
                        <SeverityBadge severity={c.severity} size="sm" />
                      </div>
                      <p className="text-xs font-medium text-slate-600 truncate max-w-sm">
                        {c.location?.address_text || c.location?.area}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {c.location?.area}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(c.timestamps?.reported_at)}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <StatusBadge status={c.status} size="sm" />
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Municipal Announcements Card */}
            {stats.announcements && stats.announcements.length > 0 && (
              <div className="bg-gradient-to-br from-slate-900 to-[#1E3A8A] rounded-2xl p-5 text-white shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-200 mb-3">
                  <Bell className="w-4 h-4" />
                  <span>Municipal Roadworks Notice</span>
                </div>
                <div className="space-y-2.5">
                  {stats.announcements.map((a) => (
                    <div
                      key={a.id}
                      className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold">{a.title}</div>
                        <div className="text-[11px] text-blue-200">{a.area}</div>
                      </div>
                      <span className="text-[10px] text-slate-300 font-mono">{a.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Embedded Map with User's / Local Complaints (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Navi Mumbai Map Preview</h2>
              <span className="text-xs text-slate-400 font-medium">Color-coded Pins</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <LeafletMap
                complaints={complaints}
                height="450px"
                center={[19.135, 72.998]}
                zoom={12}
              />
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                  <span>High Priority / Reported</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                  <span>AI Verification / Pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                  <span>Assigned / Work Started</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                  <span>Repaired & Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboardPage;
