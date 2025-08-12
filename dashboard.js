import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";


function App() {
  const [weeklyData, setWeeklyData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5000/weekly-stats");
        const data = await response.json();
        setWeeklyData(data);
      } catch (err) {
        console.error("Error fetching weekly stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p style={{ color: "#fff" }}>Loading...</p>;

  const weeks = Object.keys(weeklyData).sort().reverse().slice(0, 16);

  const chartData = weeks.map((week) => ({
    week,
    distance:weeklyData[week].distance.toFixed(2),
    time: weeklyData[week].time.toFixed(1),
    activities: weeklyData[week].count,
  }));

  const summaryVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  };

  

  return (
    <div
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "#fff",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}

      
    >

    <Link to="/plan" style={{ color: "#fc5200" }}>🧠 Plan My Run</Link>
      <motion.header
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          marginBottom: "2rem",
          fontSize: "1.8rem",
          fontWeight: "bold",
          color: "#fc5200",
          letterSpacing: "1px",
        }}
      >
        Long Beach Marathon Training Dashboard
      </motion.header>

      {/* Summary bar */}
      <motion.div
        initial="hidden"
        animate="visible"
        style={{
          display: "flex",
          gap: "2rem",
          background: "#1e1e1e",
          padding: "1rem 1.5rem",
          borderRadius: "12px",
          marginBottom: "2.5rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        {["miles", "activities", "mins"].map((label, i) => (
          <motion.div
            custom={i}
            variants={summaryVariants}
            key={label}
            style={{
              color: "#fc5200",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            {label === "miles" && `🏃‍♂️ ${chartData.reduce((acc, d) => acc + parseFloat(d.distance), 0).toFixed(1)} miles`}
            {label === "activities" && `📊 ${chartData.reduce((acc, d) => acc + d.activities, 0)} activities`}
            {label === "mins" && `⏱️ ${chartData.reduce((acc, d) => acc + parseFloat(d.time), 0).toFixed(0)} mins`}
          </motion.div>
        ))}
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: "3rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1.5rem",
            alignContent: "start",
          }}
        >
          {weeks.map((week, index) => (
            <motion.div
              key={week}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              style={{
                background: "#1e1e1e",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
              }}
            >
              <h3 style={{ marginBottom: "0.5rem", color: "#fc5200" }}>{week}</h3>
              <p style={{ margin: "0.3rem 0", fontWeight: "bold" }}>
                {chartData.find((d) => d.week === week).distance} miles
              </p>
              <p style={{ margin: "0.2rem 0", color: "#bbb" }}>
                {weeklyData[week].count} activities
              </p>
              <p style={{ margin: "0.2rem 0", color: "#bbb" }}>
                {weeklyData[week].time.toFixed(1)} min
              </p>
            </motion.div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {["distance", "time", "activities"].map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.3, duration: 0.6 }}
              style={{
                background: "#1e1e1e",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
              }}
            >
              <h3 style={{ color: "#fc5200", marginBottom: "1rem" }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="week" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={key}
                    stroke="#fc5200"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
