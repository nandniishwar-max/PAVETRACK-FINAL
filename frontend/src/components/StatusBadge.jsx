import React from "react";

export const StatusBadge = ({ status, size = "md" }) => {
  const configs = {
    Reported: {
      bg: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    },
    Verified: {
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
    Assigned: {
      bg: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-500",
    },
    "Work Started": {
      bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      dot: "bg-indigo-500",
    },
    "Repair Submitted": {
      bg: "bg-purple-50 text-purple-700 border-purple-200",
      dot: "bg-purple-500",
    },
    "AI Verification": {
      bg: "bg-yellow-100 text-yellow-800 border-yellow-300 font-medium",
      dot: "bg-yellow-600",
    },
    Closed: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold",
      dot: "bg-emerald-500",
    },
  };

  const style = configs[status] || {
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  };

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs sm:text-sm";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${sizeClasses}`}>
      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
