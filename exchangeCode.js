// exchangeCode.js
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const clientId = process.env.STRAVA_CLIENT_ID;
const clientSecret = process.env.STRAVA_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const code = "37b4671d27135e5fcfac83c082cfec4bf653e65a"; // from browser URL after reauth

async function exchangeCode() {
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json();

  if (data.errors) {
    console.error("❌ Error exchanging code:", data.errors);
    return;
  }

  console.log("✅ Access token received and saved.");
  fs.writeFileSync("tokens.json", JSON.stringify(data, null, 2));
}

exchangeCode();
