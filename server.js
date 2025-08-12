import dotenv from "dotenv";
dotenv.config(); 
console.log("✅ OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import planRunRoute from "./planRunRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); 

app.use(cors());
app.use(express.json()); 
app.use(planRunRoute);   


// Route for weekly stats
app.get("/weekly-stats", (req, res) => {
  const filePath = path.join(__dirname, "weeklyStats.json");
  const stats = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(stats);
});

// Strava auth redirect
app.get("/auth/strava", (req, res) => {
  res.redirect(
    `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&approval_prompt=force&scope=activity:read_all`
  );
});

app.post("/plan-run", async (req, res) => {
  const { distance, pace } = req.body;

  if (!distance || !pace) {
    return res.status(400).json({ error: "Missing distance or pace" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Create a marathon training plan for someone running ${distance} miles at a pace of ${pace} per mile.`,
        },
      ],
    });

    const planText = completion.choices[0]?.message?.content || "No plan generated.";
    res.json({ plan: planText });
  } catch (err) {
  console.error("❌ OpenAI Error:", err);
  res.status(500).json({ error: "Failed to generate run plan" });
}
});



// Exchange token
app.get("/exchange_token", async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post("https://www.strava.com/oauth/token", {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    });

    const { access_token, refresh_token, expires_at, athlete } = response.data;

    const tokenData = {
      access_token,
      refresh_token,
      expires_at,
      athlete,
    };

    fs.writeFileSync("tokens.json", JSON.stringify(tokenData, null, 2));
    console.log("Access Token:", access_token);

    res.send("✅ Authorization successful. You can close this tab now.");
  } catch (err) {
    console.error("Error exchanging token:", err.response?.data || err);
    res.status(500).send("❌ Failed to exchange token.");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
