import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const clientId = process.env.STRAVA_CLIENT_ID;
const clientSecret = process.env.STRAVA_CLIENT_SECRET;

export async function refreshToken() {
  const tokens = JSON.parse(fs.readFileSync("tokens.json", "utf8"));


  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
    }),
  });

  const data = await response.json();

  if (data.errors) {
    console.error("❌ Error refreshing token:", data.errors);
    throw new Error("Token refresh failed");
  }

  fs.writeFileSync("tokens.json", JSON.stringify(data, null, 2));
  console.log("✅ Token refreshed successfully!");
}

// 👇 Optional: uncomment this if you want to run standalone
// refreshToken().catch(console.error);

// ✅ Export for use in fetchActivities.js
export { refreshToken };
