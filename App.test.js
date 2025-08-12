import React, { useEffect, useState } from "react";
import WeeklyStatsTable from "./WeeklyStatsTable";
import WeeklyMileageChart from "./WeeklyMileageChart";

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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* New chart */}
      <WeeklyMileageChart data={weeklyData} />
      
      {/* Existing table */}
      <WeeklyStatsTable weeklyData={weeklyData} />
    </div>
  );
}

export default App;
