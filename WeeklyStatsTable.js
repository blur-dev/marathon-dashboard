import React from "react";

function WeeklyStatsTable({ weeklyData }) {
  const weeks = Object.keys(weeklyData)
    .sort()
    .slice(-16)
    .reverse();

  return (
    <div style={{ width: "45%" }}>
      <h2 style={{ color: "#FC4C02", marginBottom: "1rem" }}>Weekly Stats</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#1c1c1c",
          borderRadius: "10px",
          overflow: "hidden",
          color: "#fff",
          fontSize: "0.9rem"
        }}
      >
        <thead style={{ background: "#2c2c2c" }}>
          <tr>
            <th style={thStyle}>Week</th>
            <th style={thStyle}>Miles</th>
            <th style={thStyle}>Activities</th>
            <th style={thStyle}>Time (min)</th>
          </tr>
        </thead>
        <tbody>
          {weeks.length === 0 ? (
            <tr>
              <td colSpan="4" style={tdStyle}>No data available yet</td>
            </tr>
          ) : (
            weeks.map((week) => (
              <tr key={week}>
                <td style={tdStyle}>{week}</td>
                <td style={tdStyle}>
                  {(weeklyData[week].distance * 0.621371).toFixed(2)}
                </td>
                <td style={tdStyle}>{weeklyData[week].count}</td>
                <td style={tdStyle}>{weeklyData[week].time.toFixed(1)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "10px",
  textAlign: "left",
  color: "#FC4C02",
  fontWeight: "600",
};

const tdStyle = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "1px solid #333",
};

export default WeeklyStatsTable;
