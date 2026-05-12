# Blue Collar Job — வேலை வாய்ப்பு

AI-powered hyper-local job connect platform for blue-collar workers in Tamil Nadu.

## Features

- **AI Chatbot Onboarding** — Tamil/Tanglish conversational bot builds worker profile (no resume needed)
- **Hyper-Local Matching** — Jobs within 5–10 km radius using location-based scoring
- **Owner Dashboard** — Post jobs, view Top 3 AI-matched workers, contact via chat/WhatsApp/call
- **Worker Dashboard** — Profile card, trust score, AI-matched job listings, application tracking
- **Direct Chat** — Owner ↔ Worker real-time messaging with AI quick-reply suggestions

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 |
| Routing | React Router v6 |
| Fonts | Syne + Space Mono |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Routes

| Path | Description |
|---|---|
| `/` | Landing page — role selection |
| `/worker/onboard` | AI chatbot onboarding (8-step) |
| `/worker/dashboard` | Worker profile + job matches |
| `/owner/dashboard` | Owner dashboard + job posting |
| `/chat/:workerId` | Direct owner ↔ worker chat |

## Project Structure

```
src/
├── App.jsx                    # Router setup
├── theme.js                   # Design tokens
├── index.css                  # Global styles + animations
├── components/ui/             # Badge, Button, Card, SectionTitle
└── pages/
    ├── LandingPage.jsx        # Hero + role selection
    ├── WorkerOnboard.jsx      # Velai Bot chatbot flow
    ├── WorkerDashboard.jsx    # Worker profile card + job list
    ├── OwnerDashboard.jsx     # Job posting + match results
    └── ChatPage.jsx           # Real-time messaging
```

## Roadmap

- [ ] Connect to real AI (GPT-4o / Gemini) for chatbot
- [ ] Supabase backend with PostGIS geo-matching
- [ ] Firebase Realtime DB for live chat
- [ ] Twilio OTP verification
- [ ] WhatsApp Business API integration
- [ ] React Native mobile app
