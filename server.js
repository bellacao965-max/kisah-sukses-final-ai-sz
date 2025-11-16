import express from "express";
import Groq from "groq-sdk";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// GROQ client
const client = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

// AI endpoint
app.post("/api/ai", async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });
    if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY not configured" });
    const completion = await client.chat.completions.create({
      model: process.env.MODEL || "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are Kisah Sukses Pro assistant that replies concisely in Indonesian." },
        { role: "user", content: prompt }
      ],
      max_tokens: 600
    });
    res.json({ reply: completion.choices?.[0]?.message?.content || "(no reply)" });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI processing failed" });
  }
});

// Quotes
const QUOTES = [
  "Jangan menyerah — langkah kecil hari ini adalah kemenangan besar esok.",
  "Kesuksesan datang kepada mereka yang tak takut mencoba lagi.",
  "Dream big. Work hard. Stay humble.",
  "Belajar dari kemarin, hidup untuk hari ini, berharap untuk besok.",
  "Kerja keras + konsistensi = hasil."
];
app.get("/api/quote", (req, res) => {
  res.json({ quote: QUOTES[Math.floor(Math.random()*QUOTES.length)] });
});

// Weather proxy (uses OpenWeatherMap API key in OPENWEATHER_KEY)
app.get("/api/weather", async (req, res) => {
  try {
    const key = process.env.OPENWEATHER_KEY || "";
    if (!key) return res.status(500).json({ error: "OPENWEATHER_KEY not configured" });
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Missing query param q (city name)" });
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=metric&appid=${key}`;
    const r = await fetch(url);
    const j = await r.json();
    res.json(j);
  } catch (e) {
    console.error("Weather error:", e);
    res.status(500).json({ error: "Weather failed" });
  }
});

// Fallback to index.html for SPA routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port", PORT));
