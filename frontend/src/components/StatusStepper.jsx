import React from "react";
import { Check, Clock, AlertCircle, ShieldCheck } from "lucide-react";

export const STAGES = [
  { id: "Reported", label: "Reported", desc: "Citizen complaint registered" },
  { id: "Verified", label: "Verified", desc: "Municipal desk verified location & severity" },
  { id: "Assigned", label: "Assigned", desc: "Contractor assigned for roadworks" },
  { id: "Work Started", label: "Work Started", desc: "On-site repair & cold-mix asphalt laid" },
  { id: "Repair Submitted", label: "Repair Submitted", desc: "Contractor submitted AFTER photo + GPS" },
  { id: "AI Verification", label: "AI Verification", desc: "OpenCV multi-factor verification check" },
  { id: "Closed", label: "Closed", desc: "Admin approved & marked resolved" },
];

export const StatusStepper = ({ currentStatus, statusHistory = [], timestamps = {} }) => {
  // Find index of current status
  const currentIndex = STAGES.findIndex((s) => s.id === currentStatus);
  const activeIdx = currentIndex !== -1 ? currentIndex : 0;

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return null;
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  // Find history note and timestamp for a stage
  const getStageInfo = (stageId) => {
    const historyItem = statusHistory.find((h) => h.status === stageId);
    let time = historyItem?.timestamp;
    if (!time && timestamps) {
      const keyMap = {
        Reported: "reported_at",
        Verified: "verified_at",
        Assigned: "assigned_at",
        "Work Started": "work_started_at",
        "Repair Submitted": "repair_submitted_at",
        "AI Verification": "ai_verified_at",
        Closed: "closed_at",
      };
      time = timestamps[keyMap[stageId]];
    }
    return {
      time: formatDate(time),
      note: historyItem?.note,
    };
  };

  return (
    <div className="py-2">
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIdx || (currentStatus === "Closed" && idx === STAGES.length - 1);
          const isCurrent = idx === activeIdx && currentStatus !== "Closed";
          const isUpcoming = idx > activeIdx;
          const { time, note } = getStageInfo(stage.id);

          return (
            <div key={stage.id} className="relative flex items-start gap-4">
              {/* Node indicator */}
              <div
                className={`absolute -left-6 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                  isCompleted
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : isCurrent
                    ? "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 animate-pulse"
                    : "bg-white border-slate-300 text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                )}
              </div>

              {/* Stage content */}
              <div className="flex-1 -mt-0.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? "text-blue-900"
                        : isCompleted
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {stage.label}
                  </h4>
                  {time && (
                    <span className="text-xs font-mono text-slate-500">
                      {time}
                    </span>
                  )}
                </div>

                <p
                  className={`text-xs mt-0.5 ${
                    isCurrent
                      ? "text-blue-700 font-medium"
                      : isCompleted
                      ? "text-slate-600"
                      : "text-slate-400"
                  }`}
                >
                  {note || stage.desc}
                </p>

                {isCurrent && stage.id === "AI Verification" && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-yellow-600" />
                    AI CV analysis in progress / pending sign-off
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusStepper;
