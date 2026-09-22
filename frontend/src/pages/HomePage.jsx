import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  PenTool,
  ShieldCheck,
  Eye,
  Award,
  Building2,
  ArrowRight,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { getStats } from "../services/api";

export const HomePage = () => {
  const [stats, setStats] = useState({
    total_complaints: 8,
    in_progress: 5,
    resolved: 1,
  });

  useEffect(() => {
    getStats()
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Realistic road background graphic with dark overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{
            backgroundImage:
              'url("/uploads/pothole_airoli_sec4_before.jpg")',
          }}
        />
        {/* Atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-[#1E3A8A]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.85)_100%)]" />

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white">
          {/* Logo Mark + Brand */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-lg">
            <div className="w-5 h-5 rounded-full bg-[#1E3A8A] flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">
              <span className="text-white">Pave</span>
              <span className="text-[#DC2626]">Track</span>
            </span>
            <span className="text-xs text-slate-300 font-semibold border-l border-white/20 pl-2.5 uppercase tracking-wider">
              AI Verification Platform
            </span>
          </div>

          {/* Tagline */}
          <div className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-[#DC2626] mb-4 drop-shadow-sm">
            REPORT • VERIFY • REPAIR • BETTER ROADS
          </div>

          {/* Quote as specified in Section 6.1 */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight sm:leading-tight mb-6">
            “Don't wait for anyone to report potholes. Detect the potholes nobody reported.”
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal mb-10 leading-relaxed">
            PaveTrack mathematically proves that contractors repaired the exact pothole reported by citizens using multi-factor GPS proximity, camera-angle similarity, and OpenCV background landmark matching.
          </p>

          {/* Side-by-side Pill Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              to="/track"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-base hover:bg-slate-100 shadow-xl hover:shadow-2xl transition-all group"
            >
              <Search className="w-5 h-5 text-blue-700 group-hover:scale-110 transition-transform" />
              <span>Track Complaint</span>
            </Link>

            <Link
              to="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#DC2626] text-white font-bold text-base hover:bg-red-700 shadow-xl hover:shadow-2xl transition-all group"
            >
              <PenTool className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
              <span>Report a Pothole</span>
            </Link>
          </div>

          {/* Live Quick Counter Strip */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div>
              <div className="text-2xl font-black text-white">{stats.total_complaints}</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Total Tracked</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400">{stats.in_progress}</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">{stats.resolved}</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400">AI Verified & Fixed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Below the Fold: 4-Icon Feature Row */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-800 mb-2">
              Why PaveTrack
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              Closing the Accountability Loop in Road Repair
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 1. Safe Roads */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Safe Roads</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Prompt detection and repair of hazardous cratering reduces vehicular accidents and prevents costly tire damages across arterial routes.
              </p>
            </div>

            {/* 2. Transparent Process */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Transparent Process</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                7-stage vertical progress tracking gives citizens real-time transparency into municipal tenders, work orders, and on-site repair timestamps.
              </p>
            </div>

            {/* 3. Accountability */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Accountability</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Stops contractor billing fraud dead. Proves that the repaired spot is the exact reported pothole using OpenCV background landmark matching.
              </p>
            </div>

            {/* 4. Smart Cities */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Cities</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Built on open GIS data (OpenStreetMap) and computer vision, integrating seamlessly with municipal engineering dashboards like NMMC.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Layer Highlight Strip */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#1E3A8A] to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider text-blue-200">
                <Cpu className="w-3.5 h-3.5" />
                Anti-Fraud Innovation
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                How PaveTrack Proves the Repair
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Contractors often photograph a random smooth road instead of repairing the defective spot. PaveTrack's 4-factor OpenCV pipeline verifies:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <strong>GPS Match (30%)</strong> — Haversine &lt;15m
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <strong>Camera Angle (20%)</strong> — Viewpoint & Hough
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <strong>Landmarks (30%)</strong> — ORB background
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <strong>Defect Region (20%)</strong> — Crater contour fix
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Link
                to="/map"
                className="px-6 py-3.5 rounded-xl bg-white text-[#1E3A8A] font-bold text-sm text-center hover:bg-slate-100 transition-colors shadow-md"
              >
                Explore Live Map
              </Link>
              <Link
                to="/about"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm text-center border border-white/20 transition-colors"
              >
                Read Technical Pitch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
