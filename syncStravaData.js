// backend/syncStravaData.js
import { refreshToken } from './refreshToken.js';
import fetchStravaActivities from './fetchActivities.js';
import processWeeklyStats from './processWeeklyStats.js';

async function runSyncPipeline() {
  try {
    await refreshToken();
    await fetchStravaActivities();
    await processWeeklyStats();
    console.log("✅ Sync pipeline complete!");
  } catch (err) {
    console.error("❌ Sync pipeline failed:", err);
  }
}

runSyncPipeline();
