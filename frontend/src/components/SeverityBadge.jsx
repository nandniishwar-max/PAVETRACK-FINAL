import React from "react";

export const SeverityBadge = ({ severity, size = "md" }) => {
  const configs = {
    Low: {
      bg: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-500",
    },
    Medium: {
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
    High: {
      bg: "bg-orange-50 text-orange-700 border-orange-200",
      dot: "bg-orange-500",
    },
    Critical: {
      bg: "bg-red-100 text-red-800 border-red-300 font-bold animate-pulse",
      dot: "bg-red-600",
    },
  };

  const style = configs[severity] || configs.Medium;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs sm:text-sm";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {severity}
    </span>
  );
};

export default SeverityBadge;
