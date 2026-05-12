import "dotenv/config";
import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Middleware
app.use(cors({
  origin: [FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Blue Collar Job API",
    aiProvider: "openai/gpt-4o",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/chat", chatRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ error: "Internal server error", detail: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Blue Collar Job API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Chat:   POST http://localhost:${PORT}/api/chat/start\n`);

  if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️  OPENAI_API_KEY not set — AI responses will fail.");
    console.warn("   Copy server/.env.example → server/.env and add your key.\n");
  }
});

export default app;
