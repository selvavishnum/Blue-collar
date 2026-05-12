import "dotenv/config";
import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS — allow the Render frontend URL + local dev
const allowedOrigins = [
  process.env.FRONTEND_URL,          // set in Render dashboard
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman) and all allowed origins
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".onrender.com")) {
      cb(null, true);
    } else {
      cb(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Blue Collar Job API",
    aiProvider: "google/gemini-1.5-flash",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/chat", chatRouter);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ error: "Internal server error", detail: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Blue Collar Job API running on port ${PORT}`);
  console.log(`   Health:   GET  /health`);
  console.log(`   Chat API: POST /api/chat/start`);
  console.log();

  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  GEMINI_API_KEY not set — chatbot will use demo mode.");
    console.warn("   Add it in Render: Dashboard → blue-collar-api → Environment\n");
  }
});

export default app;
