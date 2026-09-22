import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  UploadCloud,
  Crosshair,
  AlertTriangle,
  CheckCircle,
  Plus,
  Loader2,
  FileText,
} from "lucide-react";
import LeafletMap from "../components/LeafletMap";
import { createComplaint, uploadComplaintPhoto } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const ReportPotholePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form State
  const [addressText, setAddressText] = useState("Sector 4, Near Airoli Station Road");
  const [area, setArea] = useState("Airoli");
  const [locationCoords, setLocationCoords] = useState({ lat: 19.1558, lng: 72.9986 });
  const [severity, setSeverity] = useState("Medium");
  const [description, setDescription] = useState("");
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successInfo, setSuccessInfo] = useState(null); // { complaintId, isDuplicate }

  // Belt-and-braces guard against double submission (fast double-clicks /
  // double Enter-presses can fire before the `submitting` state re-renders
  // the disabled button), on top of the disabled attribute below.
  const submitLockRef = useRef(false);

  // Auto-detect location
  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      setDetectingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setAddressText(`Detected GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
          setDetectingGps(false);
        },
        (err) => {
          console.warn("Geolocation denied/unavailable, keeping default Navi Mumbai location.");
          setDetectingGps(false);
        }
      );
    }
  };

  // Handle Photo selection
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setPhotoFiles((prev) => [...prev, ...files].slice(0, 3));
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPhotoPreviews((prev) => [...prev, ...newPreviews].slice(0, 3));
  };

  const handleMapLocationSelect = (coords) => {
    setLocationCoords(coords);
    setAddressText(`Pinned Location (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
  };

  const validateBeforeSubmit = () => {
    if (!addressText.trim()) {
      return "Please enter a location, landmark or street name for the pothole.";
    }
    if (
      typeof locationCoords.lat !== "number" ||
      typeof locationCoords.lng !== "number" ||
      Number.isNaN(locationCoords.lat) ||
      Number.isNaN(locationCoords.lng) ||
      Math.abs(locationCoords.lat) > 90 ||
      Math.abs(locationCoords.lng) > 180
    ) {
      return "We couldn't determine a valid location. Please pin it on the map or use Auto-Detect GPS.";
    }
    if (!["Low", "Medium", "High", "Critical"].includes(severity)) {
      return "Please select a severity level.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitLockRef.current) return;

    const validationError = validateBeforeSubmit();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    submitLockRef.current = true;
    setSubmitting(true);
    setErrorMsg("");
    setSuccessInfo(null);

    try {
      let uploadedPhotoUrls = [];
      let photoUploadFailed = false;

      // If user uploaded files, upload them. A single failed upload
      // shouldn't block the whole complaint — we fall back to the demo
      // photo below — but we do surface it so the citizen knows.
      if (photoFiles.length > 0) {
        for (const file of photoFiles) {
          try {
            const res = await uploadComplaintPhoto(file);
            if (res?.url) {
              uploadedPhotoUrls.push(res.url);
            }
          } catch (uploadErr) {
            console.error("Photo upload failed:", uploadErr);
            photoUploadFailed = true;
          }
        }
      }

      // If no photos uploaded (none selected, or all uploads failed),
      // fall back to a default demo photo so the AI verification step
      // later still has a BEFORE image to compare against.
      if (uploadedPhotoUrls.length === 0) {
        throw new Error("Please upload at least one pothole photo.");
      }

      const payload = {
        citizen_id: user?.id || "citizen-demo",
        location: {
          address_text: addressText.trim(),
          area: area,
          lat: locationCoords.lat,
          lng: locationCoords.lng,
        },
        photos_before: uploadedPhotoUrls,
        description: description,
        severity: severity,
      };

      const created = await createComplaint(payload);

      if (!created?.complaint_id) {
        throw new Error("The server did not return a valid Complaint ID.");
      }

      setSuccessInfo({
        complaintId: created.complaint_id,
        isDuplicate: Boolean(created._duplicate_of_recent_submission),
        photoWarning: photoUploadFailed,
      });

      // Show the confirmation with the Complaint ID first, then move on
      // to the tracking page — so submission never *looks* like it failed
      // just because the follow-up page takes a moment to load.
      setTimeout(() => {
        navigate(`/track?id=${created.complaint_id}`);
      }, 1600);
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      const backendDetail = err?.response?.data?.detail;

      if (status === 422 || status === 400) {
        setErrorMsg(
          typeof backendDetail === "string"
            ? backendDetail
            : "Please check the details you entered and try again."
        );
      } else if (err?.request && !err?.response) {
        setErrorMsg(
          "Could not reach the PaveTrack server. Please check your connection and try again."
        );
      } else if (status >= 500) {
        setErrorMsg(
          typeof backendDetail === "string"
            ? backendDetail
            : "The server had a problem registering your complaint. Please try again in a moment."
        );
      } else {
        setErrorMsg("Failed to register complaint. Please verify your details and try again.");
      }
    } finally {
      setSubmitting(false);
      submitLockRef.current = false;
    }
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#DC2626]">
            Citizen Civic Action
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Report a Pothole
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Help municipal engineers detect and verify dangerous road cratering before it causes accidents.
          </p>
        </div>

        {successInfo && (
          <div className="mb-6 p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-black">
                {successInfo.isDuplicate
                  ? "This complaint was already registered a moment ago."
                  : "Complaint registered successfully!"}
              </p>
              <p className="text-sm mt-1">
                Your Complaint ID is{" "}
                <span className="font-mono font-black text-base bg-white px-2 py-0.5 rounded border border-emerald-300">
                  {successInfo.complaintId}
                </span>
                . Save this ID to track your repair status. Redirecting you to the tracking page…
              </p>
              {successInfo.photoWarning && (
                <p className="text-xs mt-2 text-emerald-700">
                  Note: one or more photos failed to upload, so a default reference photo was used instead.
                </p>
              )}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* 1. Location and Area */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-900">
              Pothole Location & Area
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 relative">
                <input
                  type="text"
                  required
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  placeholder="Enter landmark, street name or sector"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm font-medium"
                />
              </div>

              <div>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 text-sm font-medium text-slate-700"
                >
                  <option value="Airoli">Airoli</option>
                  <option value="Ghansoli">Ghansoli</option>
                  <option value="Koparkhairane">Koparkhairane</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Pinpoint location: Click anywhere on the map or auto-detect GPS.
              </span>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingGps}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
              >
                {detectingGps ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Crosshair className="w-3.5 h-3.5" />
                )}
                <span>Auto-Detect GPS</span>
              </button>
            </div>

            {/* Embedded Small Map Preview beneath location */}
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner">
              <LeafletMap
                height="220px"
                center={[locationCoords.lat, locationCoords.lng]}
                zoom={14}
                interactivePick={true}
                selectedLocation={locationCoords}
                onLocationSelect={handleMapLocationSelect}
              />
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Coordinates: {locationCoords.lat.toFixed(5)}, {locationCoords.lng.toFixed(5)}
            </div>
          </div>

          {/* 2. Photo/Video Upload with Placeholder Tiles */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-900">
              Pothole Photos / Video Evidence
            </label>
            <p className="text-xs text-slate-500">
              Clear photos showing the road crater and surrounding buildings/poles help our AI verify the repair later.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {/* Main Tile with Choose File */}
              <label className="relative flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 cursor-pointer transition-colors p-2 text-center group">
                <UploadCloud className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-xs font-bold text-blue-900">Choose File</span>
                <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG, MP4</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>

              {/* Placeholder Tile 1 */}
              <div className="relative flex items-center justify-center h-32 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden">
                {photoPreviews[0] ? (
                  <img
                    src={photoPreviews[0]}
                    alt="Preview 1"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-slate-100 transition-colors">
                    <Plus className="w-6 h-6 text-slate-400" />
                    <span className="text-[11px] text-slate-400 mt-1">Photo 2</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Placeholder Tile 2 */}
              <div className="relative flex items-center justify-center h-32 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden">
                {photoPreviews[1] ? (
                  <img
                    src={photoPreviews[1]}
                    alt="Preview 2"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-slate-100 transition-colors">
                    <Plus className="w-6 h-6 text-slate-400" />
                    <span className="text-[11px] text-slate-400 mt-1">Photo 3</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* 3. Severity Selector (4 Pill / Segmented Buttons) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-900">
              Severity Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "Low", desc: "Surface wear", color: "peer-checked:bg-blue-600 peer-checked:text-white" },
                { id: "Medium", desc: "Moderate bump", color: "peer-checked:bg-amber-600 peer-checked:text-white" },
                { id: "High", desc: "Deep rim hazard", color: "peer-checked:bg-orange-600 peer-checked:text-white" },
                { id: "Critical", desc: "Accident danger", color: "peer-checked:bg-red-600 peer-checked:text-white font-bold" },
              ].map((sev) => (
                <label key={sev.id} className="relative cursor-pointer select-none">
                  <input
                    type="radio"
                    name="severity"
                    value={sev.id}
                    checked={severity === sev.id}
                    onChange={() => setSeverity(sev.id)}
                    className="sr-only peer"
                  />
                  <div
                    className={`p-3 rounded-xl border border-slate-200 text-center transition-all peer-checked:border-transparent peer-checked:shadow-md ${sev.color} hover:bg-slate-100`}
                  >
                    <div className="text-sm font-bold">{sev.id}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{sev.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Optional Description Textarea */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-900">
              Additional Details (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Near the bus stop, pothole is submerged after rain, causes heavy lane swerving..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm font-medium"
            />
          </div>

          {/* 5. Full-width Submit Button */}
          <button
            type="submit"
            disabled={submitting || Boolean(successInfo)}
            className="w-full py-4 rounded-xl bg-[#1E3A8A] hover:bg-blue-900 text-white font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Registering Complaint & Geocoding...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Submit Complaint</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportPotholePage;
