import "dotenv/config";
import express from "express";
import cors from "cors";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import chatRouter from "./routes/chat.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const IS_PROD = process.env.NODE_ENV === "production";

// In production the React build is at project root /dist
// In dev the frontend runs separately on :5173
const DIST_DIR = join(__dirname, "../../dist");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// CORS — only needed in dev (prod serves from same origin)
if (!IS_PROD) {
  app.use(cors({
    origin: [FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
}

app.use(express.json());

// Serve React static files in production
if (IS_PROD && existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Blue Collar Job API",
    aiProvider: "openai/gpt-4o",
    environment: IS_PROD ? "production" : "development",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/chat", chatRouter);

// In production: serve React app for all non-API routes (SPA fallback)
if (IS_PROD && existsSync(DIST_DIR)) {
  app.get("*", (req, res) => {
    res.sendFile(join(DIST_DIR, "index.html"));
  });
} else {
  // Dev: 404 for unknown routes
  app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
  });
}

// Global error handler
app.use((err, req, res, _next) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ error: "Internal server error", detail: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Blue Collar Job running on http://localhost:${PORT}`);
  console.log(`   Health:   GET  http://localhost:${PORT}/health`);
  console.log(`   Chat API: POST http://localhost:${PORT}/api/chat/start`);
  if (IS_PROD) {
    console.log(`   Frontend: Serving React build from /dist`);
  }
  console.log();

  if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️  OPENAI_API_KEY not set — chatbot will use demo mode.");
    console.warn("   Set it in Railway: Settings → Variables → OPENAI_API_KEY\n");
  }
});

export default app;
