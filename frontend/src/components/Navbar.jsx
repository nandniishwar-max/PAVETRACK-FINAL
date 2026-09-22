import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Shield,
  Wrench,
  ChevronDown,
  MapPin,
  Home,
  PlusCircle,
  Search,
  LayoutDashboard,
  Map as MapIcon,
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const { user, role, switchRole } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/report", label: "Report a Pothole", icon: PlusCircle },
    { to: "/track", label: "Track Complaint", icon: Search },
    { to: "/dashboard", label: "Citizen Dashboard", icon: LayoutDashboard },
    { to: "/map", label: "Pothole Map (Admin)", icon: MapIcon },
    { to: "/contractor", label: "Contractor Dashboard", icon: Wrench },
    { to: "/about", label: "About Us", icon: Info },
  ];

  const roleConfigs = {
    citizen: { label: "Citizen", color: "bg-blue-100 text-blue-800 border-blue-300", icon: User },
    municipal_admin: { label: "Municipal Admin", color: "bg-amber-100 text-amber-900 border-amber-300", icon: Shield },
    contractor: { label: "Contractor", color: "bg-purple-100 text-purple-900 border-purple-300", icon: Wrench },
  };

  const currentRoleConfig = roleConfigs[role] || roleConfigs.citizen;
  const RoleIcon = currentRoleConfig.icon;

  const handleRoleSelect = (targetRole) => {
    switchRole(targetRole);
    setRoleDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        {/* Sub-tagline top strip */}
        <div className="bg-slate-900 text-white text-[11px] tracking-widest font-semibold py-1 text-center uppercase">
          Report • Verify • Repair • Better Roads
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger button */}
            <div className="flex items-center">
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Center: PaveTrack Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              {/* Stylized road & pin icon */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-slate-900 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <div className="relative flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                  <div className="absolute w-1.5 h-1.5 bg-[#DC2626] rounded-full top-1.5" />
                </div>
              </div>
              {/* Wordmark: Pave in Navy, Track in Red */}
              <div className="text-2xl font-black tracking-tight select-none">
                <span className="text-[#1E3A8A]">Pave</span>
                <span className="text-[#DC2626]">Track</span>
              </div>
            </Link>

            {/* Right: User / Role Switcher */}
            <div className="relative flex items-center gap-2">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors shadow-sm"
              >
                <div className={`p-1 rounded-full border ${currentRoleConfig.color}`}>
                  <RoleIcon className="w-3.5 h-3.5" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {user?.name || "Demo User"}
                  </div>
                  <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                    {currentRoleConfig.label}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Switcher Dropdown */}
              {roleDropdownOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Switch Role (Hackathon Demo)
                    </p>
                  </div>
                  <button
                    onClick={() => handleRoleSelect("citizen")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left hover:bg-slate-50 ${
                      role === "citizen" ? "bg-blue-50 text-blue-900 font-semibold" : "text-slate-700"
                    }`}
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <div>
                      <div>Citizen</div>
                      <div className="text-[10px] text-slate-400 font-normal">Rahul Sharma (Airoli)</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSelect("municipal_admin")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left hover:bg-slate-50 ${
                      role === "municipal_admin" ? "bg-amber-50 text-amber-900 font-semibold" : "text-slate-700"
                    }`}
                  >
                    <Shield className="w-4 h-4 text-amber-600" />
                    <div>
                      <div>Municipal Admin</div>
                      <div className="text-[10px] text-slate-400 font-normal">Dr. Arvind Kadam (NMMC)</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSelect("contractor")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left hover:bg-slate-50 ${
                      role === "contractor" ? "bg-purple-50 text-purple-900 font-semibold" : "text-slate-700"
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-purple-600" />
                    <div>
                      <div>Contractor</div>
                      <div className="text-[10px] text-slate-400 font-normal">Pramod Patil (Apex Infra)</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Navigation Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="text-xl font-black">
                  <span className="text-[#1E3A8A]">Pave</span>
                  <span className="text-[#DC2626]">Track</span>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
                Navigation
              </div>
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-[#1E3A8A] font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-[#1E3A8A]" : "text-slate-400"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Role switch in drawer footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Active Perspective
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleRoleSelect("citizen")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                    role === "citizen"
                      ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Citizen
                </button>
                <button
                  onClick={() => handleRoleSelect("municipal_admin")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                    role === "municipal_admin"
                      ? "bg-amber-600 border-amber-600 text-white shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => handleRoleSelect("contractor")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                    role === "contractor"
                      ? "bg-purple-600 border-purple-600 text-white shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Contractor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
