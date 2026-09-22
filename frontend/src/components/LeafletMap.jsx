import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import SeverityBadge from "./SeverityBadge";

// Helper to create color-coded SVG pin markers
const createPinIcon = (color, isSelected = false) => {
  const pinSvg = `
    <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16C0 26.5 16 42 16 42C16 42 32 26.5 32 16C32 7.163 24.837 0 16 0Z" fill="${color}"/>
      <circle cx="16" cy="15" r="7" fill="white"/>
      <circle cx="16" cy="15" r="3.5" fill="${color}"/>
      ${isSelected ? '<circle cx="16" cy="15" r="9" stroke="#DC2626" stroke-width="2.5" fill="none"/>' : ""}
    </svg>
  `;

  return L.divIcon({
    className: "custom-map-pin",
    html: pinSvg,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -38],
  });
};

const getColorForStatus = (status, severity) => {
  if (severity === "Critical") return "#DC2626"; // Critical Red
  if (status === "Closed") return "#059669"; // Green
  if (status === "AI Verification" || status === "Verified") return "#D97706"; // Yellow/Amber
  if (status === "Assigned" || status === "Work Started") return "#2563EB"; // Blue
  return "#DC2626"; // Red (Reported / Default)
};

// Component to handle map clicks for picking location
const LocationPicker = ({ onSelect, position }) => {
  useMapEvents({
    click(e) {
      if (onSelect) {
        onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });

  if (!position) return null;

  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={createPinIcon("#DC2626", true)}
    >
      <Popup>
        <div className="text-xs font-semibold">Selected Pothole Location</div>
        <div className="text-[11px] text-slate-500 font-mono">
          {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
        </div>
      </Popup>
    </Marker>
  );
};

// Component to recenter map when center prop updates
const ChangeMapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  return null;
};

export const LeafletMap = ({
  complaints = [],
  center = [19.135, 72.998], // Navi Mumbai centroid
  zoom = 13,
  height = "420px",
  interactivePick = false,
  selectedLocation = null,
  onLocationSelect = null,
  onMarkerClick = null,
}) => {
  return (
    <div style={{ height, width: "100%" }} className="rounded-xl overflow-hidden border border-slate-200 shadow-inner relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeMapView center={center} zoom={zoom} />

        {/* OpenStreetMap Standard Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Interactive Location Picking */}
        {interactivePick && (
          <LocationPicker onSelect={onLocationSelect} position={selectedLocation} />
        )}

        {/* Render Complaint Markers */}
        {complaints.map((c) => {
          const lat = c?.location?.lat;
          const lng = c?.location?.lng;
          if (!lat || !lng) return null;

          const color = getColorForStatus(c.status, c.severity);
          const icon = createPinIcon(color);

          return (
            <Marker
              key={c.complaint_id}
              position={[lat, lng]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onMarkerClick) onMarkerClick(c);
                },
              }}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {c.complaint_id}
                    </span>
                    <SeverityBadge severity={c.severity} size="sm" />
                  </div>

                  <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-2">
                    {c.location?.address_text || c.location?.area}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <StatusBadge status={c.status} size="sm" />
                    <Link
                      to={`/details/${c.complaint_id}`}
                      className="text-xs text-blue-700 font-semibold hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
