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

// Root — shows API is live (visible when visiting the Render URL directly)
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Blue Collar Job API</title>
      <style>
        body { font-family: monospace; background: #0A0F1E; color: #F1F5F9; padding: 40px; }
        h1 { color: #F59E0B; } a { color: #3B82F6; }
        .badge { background: #10B98133; color: #10B981; border: 1px solid #10B98155;
                 padding: 2px 10px; border-radius: 6px; font-size: 12px; }
        .route { background: #111827; border: 1px solid #1F2D45; border-radius: 8px;
                 padding: 10px 16px; margin: 8px 0; }
        code { color: #F59E0B; }
      </style>
    </head>
    <body>
      <h1>👷 Blue Collar Job API</h1>
      <p><span class="badge">🟢 SERVER RUNNING</span></p>
      <p>வேலை வாய்ப்பு — AI-powered job connect for Tamil Nadu</p>
      <h3>Endpoints</h3>
      <div class="route"><code>GET  /health</code> — Server status</div>
      <div class="route"><code>POST /api/chat/start</code> — Start chatbot session</div>
      <div class="route"><code>POST /api/chat/message</code> — Send message</div>
      <div class="route"><code>POST /api/chat/extract-profile</code> — Generate worker profile</div>
      <div class="route"><code>POST /api/chat/verify-otp</code> — Verify worker OTP</div>
    </body>
    </html>
  `);
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Blue Collar Job API",
    aiProvider: "openai/gpt-4o",
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

  if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️  OPENAI_API_KEY not set — chatbot will use demo mode.");
    console.warn("   Add it in Render: Dashboard → blue-collar-api → Environment\n");
  }
});

export default app;
