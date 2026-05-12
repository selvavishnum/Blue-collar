import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import WorkerOnboard from "./pages/WorkerOnboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import ChatPage from "./pages/ChatPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/worker/onboard" element={<WorkerOnboard />} />
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/chat/:workerId" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
