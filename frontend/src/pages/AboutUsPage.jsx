import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Target,
  Compass,
  Mail,
  Phone,
  Building,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Lock,
} from "lucide-react";

export const AboutUsPage = () => {
  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section with City-Skyline / Road Illustration */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl">
          {/* Background Illustration & Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
            style={{
              backgroundImage: 'url("/uploads/pothole_airoli_sec4_before.jpg")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-[#1E3A8A]/80 to-slate-900/90" />

          {/* Hero Content */}
          <div className="relative z-10 p-8 sm:p-14 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest text-[#DC2626] border border-white/10">
              Civic Infrastructure AI
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              About <span className="text-[#1E3A8A] bg-white px-2 py-0.5 rounded-lg">Pave</span>
              <span className="text-[#DC2626]">Track</span>
            </h1>

            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-300">
              REPORT • VERIFY • REPAIR • BETTER ROADS
            </p>

            {/* Mandatory One-Line Pitch from Section 1 */}
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed pt-2 font-medium">
              “An AI-powered, tamper-resistant complaint-to-repair verification platform that proves
              whether a contractor repaired the exact pothole reported by a citizen — using GPS,
              camera-angle, and computer-vision background matching — rather than photographing a
              different already-fixed road.”
            </p>
          </div>
        </div>

        {/* 3 Core Rows: Our Mission, Our Vision, Contact Us (each with an icon) */}
        <div className="space-y-6">
          {/* Row 1: Our Mission */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start gap-6 group hover:border-blue-300 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <Target className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To eliminate fraudulent road repair billing, enforce accountability across municipal
                contractors, and empower citizens with real-time transparent tracking. By replacing
                vague paperwork with immutable computer vision evidence, PaveTrack ensures public
                infrastructure funds actually fix the roads citizens travel every day.
              </p>
            </div>
          </div>

          {/* Row 2: Our Vision */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start gap-6 group hover:border-amber-300 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <Compass className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A nationwide zero-pothole urban transit ecosystem where every civic grievance triggers
                an automated, verified workflow. We envision cities powered by open spatial data
                (OpenStreetMap) and edge AI, cutting the pothole resolution lifecycle from weeks down
                to 48 hours while ensuring complete civic trust.
              </p>
            </div>
          </div>

          {/* Row 3: Contact Us */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start gap-6 group hover:border-emerald-300 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <Building className="w-7 h-7" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-black text-slate-900">Contact & Civic Governance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                PaveTrack Demonstration Operations — Navi Mumbai Municipal Corporation (NMMC) Sector Desk.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>support@pavetrack.gov.in</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>+91 022-2756-7070 (NMMC Control)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>CBD Belapur, Navi Mumbai 400614</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-600" />
                  <span>SHA-256 Anti-Fraud Integrity Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Architecture Breakdown Box */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300">
            <Cpu className="w-4 h-4" />
            <span>OpenCV Multi-Factor Formula (Hackathon Reference)</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black">
              Score = 0.30 × GPS + 0.20 × Angle + 0.30 × Background + 0.20 × RoadRegion
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When a contractor captures an AFTER photo, PaveTrack extracts the GPS distance,
              vanishing-line angle histogram, masks out the road surface to compute ORB feature matches
              on background buildings, and evaluates the reduction in crater contour area on the road surface.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-emerald-400 font-bold text-sm mb-1">≥ 85% Score</div>
              <div className="text-slate-300">
                <strong>VERIFIED:</strong> Auto-approve eligible. Matched location & surroundings.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-amber-400 font-bold text-sm mb-1">60% – 84% Score</div>
              <div className="text-slate-300">
                <strong>MANUAL REVIEW:</strong> Discrepancy flagged for municipal inspector field check.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-red-400 font-bold text-sm mb-1">&lt; 60% Score</div>
              <div className="text-slate-300">
                <strong>REJECTED:</strong> Suspected fraud. Geofence violation or different road photo.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
