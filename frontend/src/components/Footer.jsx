import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ShieldCheck, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="text-2xl font-black tracking-tight">
                <span className="text-white">Pave</span>
                <span className="text-[#DC2626]">Track</span>
              </div>
            </div>
            <p className="text-xs uppercase tracking-widest text-[#DC2626] font-bold">
              Report • Verify • Repair • Better Roads
            </p>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              An AI-powered, tamper-resistant complaint-to-repair verification platform that proves
              whether a contractor repaired the exact pothole reported by a citizen — using GPS,
              camera-angle, and computer-vision background matching — rather than photographing a
              different already-fixed road.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
              Platform Views
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition-colors">
                  Report a Pothole
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">
                  Track Complaint
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Citizen Dashboard
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition-colors">
                  Pothole Map & Admin
                </Link>
              </li>
              <li>
                <Link to="/contractor" className="hover:text-white transition-colors">
                  Contractor Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* AI/CV Specs */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
              AI Verification Stack
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                GPS Proximity (30%)
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Camera Angle / Histograms (20%)
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Landmark ORB+BFMatcher (30%)
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Road Crater Defect Contour (20%)
              </li>
              <li className="pt-2 text-slate-500">
                Navi Mumbai Municipal Demonstration Zone
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 PaveTrack Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for safer roads with OpenStreetMap & OpenCV
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
