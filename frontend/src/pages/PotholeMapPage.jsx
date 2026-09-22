import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  MapPin,
  Shield,
  Layers,
  CheckCircle,
  Clock,
  ArrowRight,
  UserCheck,
  X,
  ExternalLink,
} from "lucide-react";
import LeafletMap from "../components/LeafletMap";
import StatusBadge from "../components/StatusBadge";
import SeverityBadge from "../components/SeverityBadge";
import { getComplaints, getContractors, assignContractor } from "../services/api";

export const PotholeMapPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");

  // Selected Pin Side Drawer
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Assign Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [targetComplaint, setTargetComplaint] = useState(null);
  const [selectedContractorId, setSelectedContractorId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [compData, contData] = await Promise.all([
        getComplaints(),
        getContractors(),
      ]);
      setComplaints(compData);
      setContractors(contData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (selectedArea !== "All" && c.location?.area !== selectedArea) return false;
    if (selectedStatus !== "All" && c.status !== selectedStatus) return false;
    if (selectedSeverity !== "All" && c.severity !== selectedSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesId = c.complaint_id.toLowerCase().includes(q);
      const matchesAddr = c.location?.address_text.toLowerCase().includes(q);
      const matchesArea = c.location?.area.toLowerCase().includes(q);
      if (!matchesId && !matchesAddr && !matchesArea) return false;
    }
    return true;
  });

  const handleOpenAssignModal = (comp) => {
    setTargetComplaint(comp);
    setSelectedContractorId(contractors[0]?.contractor_id || "CON-001");
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = async () => {
    if (!targetComplaint || !selectedContractorId) return;
    setAssigning(true);
    try {
      await assignContractor(targetComplaint.complaint_id, selectedContractorId);
      setAssignModalOpen(false);
      fetchData(); // Refresh list
    } catch (err) {
      alert("Failed to assign contractor.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="py-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
              <Shield className="w-4 h-4" />
              <span>Municipal Engineering Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Navi Mumbai Pothole GIS Map & Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Real-time geospatial monitoring, contractor assignment, and AI verification oversight.
            </p>
          </div>

          {/* Quick Legend Chips */}
          <div className="flex flex-wrap items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
              <span className="text-slate-600 font-medium">High Priority</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
              <span className="text-slate-600 font-medium">Pending Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
              <span className="text-slate-600 font-medium">Assigned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
              <span className="text-slate-600 font-medium">Repaired</span>
            </div>
          </div>
        </div>

        {/* Location Search & Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Location Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, landmark or PTH-ID..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Area Filter */}
          <div>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white text-slate-700 focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Areas (Navi Mumbai)</option>
              <option value="Airoli">Airoli</option>
              <option value="Ghansoli">Ghansoli</option>
              <option value="Koparkhairane">Koparkhairane</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white text-slate-700 focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Verified">Verified</option>
              <option value="Assigned">Assigned</option>
              <option value="Work Started">Work Started</option>
              <option value="Repair Submitted">Repair Submitted</option>
              <option value="AI Verification">AI Verification</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white text-slate-700 focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Map Container + Side Drawer on Pin Click */}
        <div className="relative bg-white p-3 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <LeafletMap
            complaints={filteredComplaints}
            height="500px"
            center={[19.135, 72.998]}
            zoom={13}
            onMarkerClick={(c) => setSelectedComplaint(c)}
          />

          {/* Pin Click Side Drawer Overlay */}
          {selectedComplaint && (
            <div className="absolute top-4 right-4 bottom-4 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-5 z-20 flex flex-col justify-between animate-in slide-in-from-right duration-200">
              <div className="space-y-3 overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {selectedComplaint.complaint_id}
                  </span>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <SeverityBadge severity={selectedComplaint.severity} size="sm" />
                  <StatusBadge status={selectedComplaint.status} size="sm" />
                </div>

                {selectedComplaint.photos_before?.[0] && (
                  <div className="rounded-xl overflow-hidden aspect-video border border-slate-200 bg-slate-900">
                    <img
                      src={selectedComplaint.photos_before[0]}
                      alt="Pothole"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-1.5 text-xs">
                  <div className="font-semibold text-slate-900">
                    {selectedComplaint.location?.area}
                  </div>
                  <div className="text-slate-600 text-[11px] leading-tight">
                    {selectedComplaint.location?.address_text}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Lat {selectedComplaint.location?.lat.toFixed(4)}, Lng {selectedComplaint.location?.lng.toFixed(4)}
                  </div>
                </div>

                {selectedComplaint.description && (
                  <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    "{selectedComplaint.description}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                {!selectedComplaint.assigned_contractor_id && (
                  <button
                    onClick={() => handleOpenAssignModal(selectedComplaint)}
                    className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Assign Contractor
                  </button>
                )}

                <Link
                  to={`/details/${selectedComplaint.complaint_id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <span>Open Full Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Companion Admin Dashboard Table View */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Municipal Complaint Master Register
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {filteredComplaints.length} of {complaints.length} registered grievances
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Location & Area</th>
                  <th className="px-5 py-3">Severity</th>
                  <th className="px-5 py-3">Assigned Contractor</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.map((c) => (
                  <tr key={c.complaint_id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      {c.complaint_id}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{c.location?.area}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {c.location?.address_text}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <SeverityBadge severity={c.severity} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">
                      {c.assigned_contractor_id ? (
                        <span className="font-medium text-slate-800">
                          {c.assigned_contractor_id === "CON-001"
                            ? "Apex Infra (CON-001)"
                            : c.assigned_contractor_id === "CON-002"
                            ? "NM InfraTech (CON-002)"
                            : "Thane-Belapur (CON-003)"}
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      {!c.assigned_contractor_id && (
                        <button
                          onClick={() => handleOpenAssignModal(c)}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-300 transition-colors"
                        >
                          Assign
                        </button>
                      )}

                      <Link
                        to={`/details/${c.complaint_id}`}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 transition-colors inline-block"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assign Contractor Modal */}
        {assignModalOpen && targetComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Assign Contractor to Complaint
                </h3>
                <button
                  onClick={() => setAssignModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div>
                  <strong>ID:</strong> <span className="font-mono">{targetComplaint.complaint_id}</span>
                </div>
                <div>
                  <strong>Location:</strong> {targetComplaint.location?.address_text}, {targetComplaint.location?.area}
                </div>
                <div>
                  <strong>Severity:</strong> <SeverityBadge severity={targetComplaint.severity} size="sm" />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-900">
                  Select Registered Road Contractor
                </label>
                <select
                  value={selectedContractorId}
                  onChange={(e) => setSelectedContractorId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                >
                  {contractors.map((c) => (
                    <option key={c.contractor_id} value={c.contractor_id}>
                      {c.name} ({c.contractor_id}) — {c.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={assigning}
                  onClick={handleConfirmAssign}
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-sm"
                >
                  {assigning ? "Assigning..." : "Confirm Tender Assignment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PotholeMapPage;
