import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function WeeklyMileageChart({ data }) {
  const chartData = Object.keys(data)
    .sort()
    .slice(-16)
    .reverse()
    .map((week) => ({
      week,
      miles: (data[week].distance * 0.621371).toFixed(2),
    }));

  return (
    <div style={{ width: "50%" }}>
      <h2 style={{ color: "#FC4C02", marginBottom: "1rem" }}>Weekly Mileage</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#333" strokeDasharray="4 4" />
          <XAxis dataKey="week" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#222",
              border: "none",
              color: "#fff",
            }}
          />
          <Line
            type="monotone"
            dataKey="miles"
            stroke="#FC4C02"
            strokeWidth={3}
            dot={{ fill: "#FC4C02", r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeeklyMileageChart;
