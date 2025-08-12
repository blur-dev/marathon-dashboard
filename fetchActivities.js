// backend/fetchActivities.js
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const clientId = process.env.STRAVA_CLIENT_ID;
const clientSecret = process.env.STRAVA_CLIENT_SECRET;

async function refreshToken() {
  const tokens = JSON.parse(fs.readFileSync("tokens.json", "utf8"));

  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
    }),
  });

  const data = await res.json();

  if (data.errors || !data.access_token) {
    console.error("❌ Error refreshing token:", data.errors || data);
    throw new Error("Token refresh failed");
  }

  fs.writeFileSync("tokens.json", JSON.stringify(data, null, 2));
  console.log("✅ Token refreshed successfully!");

  return data.access_token;
}

async function fetchStravaActivities() {
  const accessToken = await refreshToken();

  const response = await fetch(
    "https://www.strava.com/api/v3/athlete/activities?per_page=200",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Strava API error: ${response.status} - ${errorBody}`);
  }

  const activities = await response.json();

  fs.writeFileSync("activities.json", JSON.stringify(activities, null, 2));
  console.log("✅ Activities saved to activities.json");
}

fetchStravaActivities().catch(console.error);
export { fetchStravaActivities };
