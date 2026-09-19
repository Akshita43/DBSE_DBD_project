import React from "react";

function StatCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  trendType = "positive",
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-icon">
          {icon}
        </div>

        {trend && (
          <span className={`stat-trend ${trendType}`}>
            {trend}
          </span>
        )}
      </div>

      <div className="stat-card-content">
        <p>{title}</p>
        <h3>{value}</h3>

        {subtitle && (
          <span className="stat-subtitle">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;