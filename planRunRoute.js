import express from "express";
import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/plan-run", async (req, res) => {
  const { distance, pace } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a marathon coach who gives detailed, evidence-based running advice.",
        },
        {
          role: "user",
          content: `I want to run ${distance} miles at a pace of ${pace} per mile. Give me insights on how I can achieve this: 
            1. Pre-run carb intake (in grams)
            2. Suggested warm-up
            3. Breakdown of each mile (what pace should I aim for per mile and any strategy changes)
            4. Mental strategy tips.
          `,
        },
      ],
    });

    const message = response.choices[0].message.content;
    res.json({ plan: message });
  } catch (err) {
    console.error("❌ OpenAI error:", err);
    res.status(500).json({ error: "Failed to generate run plan" });
  }
});

export default router;
