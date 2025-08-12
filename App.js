import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard";
import PlanMyRun from "./planRun";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/plan" element={<PlanMyRun />} />
    </Routes>
  );
}

export default App;
