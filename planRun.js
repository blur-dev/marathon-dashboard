// src/PlanMyRun.js
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function PlanMyRun() {
  const [distance, setDistance] = useState("");
  const [paceMinutes, setPaceMinutes] = useState("");
  const [paceSeconds, setPaceSeconds] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedPace = `${paceMinutes}:${paceSeconds.padStart(2, "0")}`;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/plan-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ distance, pace: formattedPace }),
      });

      const data = await res.json();
      setPlan(data.plan);
    } catch (err) {
      setPlan("⚠️ Failed to fetch plan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
    
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
      <motion.h1
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          marginBottom: "1.5rem",
          fontSize: "1.8rem",
          fontWeight: "bold",
          color: "#fc5200",
        }}
      >
        🛠️ Plan My Run
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
          alignItems: "center",
          background: "#1e1e1e",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "2rem",
        }}
      >
        <label>
          Distance (mi):<br />
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
            style={inputStyle}
          />
        </label>

        <label>
          Pace (min : sec):<br />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="number"
              value={paceMinutes}
              onChange={(e) => setPaceMinutes(e.target.value)}
              required
              placeholder="Min"
              style={inputStyle}
            />
            <input
              type="number"
              value={paceSeconds}
              onChange={(e) => setPaceSeconds(e.target.value)}
              required
              placeholder="Sec"
              style={inputStyle}
            />
          </div>
        </label>

        <button
          type="submit"
          style={{
            background: "#fc5200",
            border: "none",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Generate Plan
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: plan ? 1 : 0 }}
        transition={{ delay: 0.4 }}
        style={{
          whiteSpace: "pre-wrap",
          background: "#1e1e1e",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        {loading ? "Generating plan..." : plan}
      </motion.div>
    </div>
  );
}

const inputStyle = {
  padding: "0.5rem",
  borderRadius: "6px",
  border: "1px solid #444",
  background: "#2a2a2a",
  color: "#fff",
  width: "100px",
};
