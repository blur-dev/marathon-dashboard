// backend/processWeeklyStats.js
import fs from "fs";
import { parseISO, startOfWeek, format } from "date-fns";

const activities = JSON.parse(fs.readFileSync("activities.json", "utf8"));

const weeklyStats = {};

activities.forEach((activity) => {
  const date = parseISO(activity.start_date);
  const week = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd"); // Monday-based week

  if (!weeklyStats[week]) {
    weeklyStats[week] = { distance: 0, time: 0, count: 0 };
  }

  weeklyStats[week].distance += activity.distance / 1000 * 0.621371; // convert meters to miles
  weeklyStats[week].time += activity.moving_time / 60; // seconds to minutes
  weeklyStats[week].count += 1;
});

// Optional: round values
for (const week in weeklyStats) {
  weeklyStats[week].distance = parseFloat(weeklyStats[week].distance.toFixed(2));
  weeklyStats[week].time = parseFloat(weeklyStats[week].time.toFixed(1));
}

fs.writeFileSync("weeklyStats.json", JSON.stringify(weeklyStats, null, 2));
console.log("✅ Weekly stats saved to weeklyStats.json");
