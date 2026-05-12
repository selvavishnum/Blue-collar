import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { palette } from "../theme";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const DEMO_PROFILE = {
  name: "Murugan K.",
  jobType: "Delivery",
  primarySkill: "Bike Riding / Two-Wheeler",
  experienceYears: "3 years",
  location: "Thuckalay",
  travelRadius: "10 km",
  expectedSalary: "₹12,000 – ₹15,000",
  workType: "Full-time",
  verified: true,
  phone: "+91 98765 43210",
  languages: ["Tamil", "English"],
  trustScore: 82,
  secondarySkills: ["Route Planning", "Customer Handling"],
};

const DEMO_JOBS = [
  {
    id: 1,
    title: "Delivery Partner Needed",
    company: "Udangudi Fast Food",
    location: "Udangudi (6 km)",
    salary: "₹13,000/mo",
    type: "Full-time",
    matchScore: 94,
    posted: "2 hours ago",
    color: palette.green,
  },
  {
    id: 2,
    title: "Bike Delivery – Part Time",
    company: "Thuckalay Sweets",
    location: "Thuckalay (2 km)",
    salary: "₹8,000/mo",
    type: "Part-time",
    matchScore: 88,
    posted: "5 hours ago",
    color: palette.blue,
  },
  {
    id: 3,
    title: "Logistics Driver",
    company: "Nagercoil Traders",
    location: "Nagercoil (14 km)",
    salary: "₹16,000/mo",
    type: "Full-time",
    matchScore: 76,
    posted: "1 day ago",
    color: palette.purple,
  },
];

function TrustMeter({ score }) {
  const color = score >= 80 ? palette.green : score >= 60 ? palette.accent : palette.red;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ color: palette.muted, fontSize: 11, fontFamily: "'Space Mono', monospace" }}>Trust Score</span>
        <span style={{ color, fontSize: 12, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>{score}/100</span>
      </div>
      <div style={{ background: palette.cardBorder, borderRadius: 4, height: 6 }}>
        <div style={{
          width: `${score}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          borderRadius: 4,
          transition: "width 0.8s ease",
        }} />
      </div>
    </div>
  );
}

function MatchScoreBadge({ score }) {
  const color = score >= 90 ? palette.green : score >= 75 ? palette.accent : palette.blue;
  return (
    <div style={{
      background: color + "22",
      border: `1px solid ${color}44`,
      borderRadius: 8,
      padding: "4px 10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minWidth: 60,
    }}>
      <span style={{ color, fontSize: 16, fontWeight: 800 }}>{score}%</span>
      <span style={{ color: palette.dim, fontSize: 9, fontFamily: "'Space Mono', monospace" }}>MATCH</span>
    </div>
  );
}

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const { state: routeState } = useLocation();
  const profile = routeState?.profile ? { ...DEMO_PROFILE, ...routeState.profile } : DEMO_PROFILE;
  const [activeTab, setActiveTab] = useState("profile");
  const [appliedJobs, setAppliedJobs] = useState([]);

  const handleApply = (jobId) => {
    setAppliedJobs((prev) => [...prev, jobId]);
  };

  return (
    <div style={{ background: palette.bg, minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        background: "#050C1A",
        borderBottom: `1px solid ${palette.cardBorder}`,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: palette.muted, fontSize: 20, cursor: "pointer" }}>←</button>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: palette.blue + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👷</div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 14, margin: 0 }}>{profile.name || "Worker"}</p>
          <p style={{ color: palette.muted, fontSize: 10, margin: 0, fontFamily: "'Space Mono', monospace" }}>{profile.primarySkill} · {profile.location}</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {profile.verified && <Badge color={palette.green}>✓ Verified</Badge>}
          <Badge color={palette.accent}>{profile.workType || "Full-time"}</Badge>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ background: "#0D1528", borderBottom: `1px solid ${palette.cardBorder}`, padding: "0 20px" }}>
        <div style={{ display: "flex", gap: 0, maxWidth: 780, margin: "0 auto" }}>
          {[
            { key: "profile", label: "👤 My Profile" },
            { key: "jobs", label: "💼 Job Matches" },
            { key: "applications", label: "📋 Applications" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: "none",
                border: "none",
                borderBottom: `2px solid ${activeTab === tab.key ? palette.accent : "transparent"}`,
                color: activeTab === tab.key ? palette.accent : palette.dim,
                padding: "12px 18px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Syne', sans-serif",
                transition: "color 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "20px 16px 40px" }}>
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="fade-in">
            {/* Worker Card */}
            <Card style={{ background: "linear-gradient(135deg, #0D1B35, #111827)", border: `1px solid ${palette.blue}33`, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 12,
                    background: palette.blue + "33",
                    border: `2px solid ${palette.blue}55`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28,
                  }}>👷</div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>{profile.name || "Worker"}</h2>
                    <p style={{ color: palette.blue, fontSize: 13, fontFamily: "'Space Mono', monospace", margin: "0 0 8px" }}>
                      {profile.primarySkill || profile.jobType}
                    </p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {profile.verified && <Badge color={palette.green} size="xs">✓ Verified</Badge>}
                      <Badge color={palette.accent} size="xs">{profile.experienceYears}</Badge>
                      <Badge color={palette.blue} size="xs">📍 {profile.location}</Badge>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: palette.accent, fontWeight: 800, fontSize: 18, margin: "0 0 2px" }}>{profile.expectedSalary}</p>
                  <p style={{ color: palette.muted, fontSize: 11, fontFamily: "'Space Mono', monospace", margin: 0 }}>expected / month</p>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${palette.cardBorder}`, marginTop: 16, paddingTop: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Work Type", value: profile.workType },
                    { label: "Travel Radius", value: profile.travelRadius },
                    { label: "Languages", value: (profile.languages || ["Tamil", "English"]).join(", ") },
                    { label: "Phone", value: profile.phone || "+91 XXXXX XXXXX" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p style={{ color: palette.dim, fontSize: 10, fontFamily: "'Space Mono', monospace", margin: "0 0 2px" }}>{item.label}</p>
                      <p style={{ color: palette.text, fontSize: 12, fontWeight: 600, margin: 0 }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <TrustMeter score={profile.trustScore || 65} />
            </Card>

            {/* Secondary Skills */}
            {profile.secondarySkills?.length > 0 && (
              <Card>
                <h3 style={{ color: palette.teal, fontSize: 13, fontWeight: 800, marginBottom: 10 }}>Additional Skills</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {profile.secondarySkills.map((s) => (
                    <Badge key={s} color={palette.teal}>{s}</Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* AI Summary */}
            <Card style={{ borderColor: palette.accent + "33" }}>
              <h3 style={{ color: palette.accent, fontSize: 13, fontWeight: 800, marginBottom: 8 }}>🤖 AI-Generated Summary</h3>
              <p style={{ color: palette.muted, fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                {profile.primarySkill || profile.jobType} position-la {profile.experienceYears} experience உள்ள worker.
                {profile.location} area-la available, {profile.travelRadius} radius-la travel பண்ண ready.
                {profile.expectedSalary} salary expect பண்றாங்க. {profile.workType} basis-la வேலை தேடுகிறாங்க.
                {profile.verified ? " ✅ Verified profile — high trust score." : ""}
              </p>
            </Card>

            <Button variant="outline" full onClick={() => navigate("/worker/onboard")}>
              ✏️ Update Profile via Chatbot
            </Button>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === "jobs" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Top Matches For You</h3>
              <Badge color={palette.green}>{DEMO_JOBS.length} Jobs Found</Badge>
            </div>

            {DEMO_JOBS.map((job) => (
              <Card key={job.id} style={{ borderLeft: `3px solid ${job.color}`, padding: 16 }} hover onClick={() => {}}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 800, fontSize: 15, margin: "0 0 4px" }}>{job.title}</h4>
                    <p style={{ color: palette.muted, fontSize: 12, margin: "0 0 10px", fontFamily: "'Space Mono', monospace" }}>
                      🏪 {job.company}
                    </p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <Badge color={palette.teal} size="xs">📍 {job.location}</Badge>
                      <Badge color={palette.green} size="xs">💰 {job.salary}</Badge>
                      <Badge color={job.color} size="xs">{job.type}</Badge>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <MatchScoreBadge score={job.matchScore} />
                    <p style={{ color: palette.dim, fontSize: 9, fontFamily: "'Space Mono', monospace", margin: 0 }}>{job.posted}</p>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${palette.cardBorder}`, marginTop: 12, paddingTop: 12, display: "flex", gap: 8 }}>
                  {appliedJobs.includes(job.id) ? (
                    <Badge color={palette.green}>✓ Applied</Badge>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => handleApply(job.id)}>Quick Apply</Button>
                      <Button size="sm" variant="ghost" onClick={() => navigate("/chat/1")}>
                        💬 Chat with Owner
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === "applications" && (
          <div className="fade-in">
            {appliedJobs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>📋</div>
                <p style={{ color: palette.muted, fontSize: 14, marginBottom: 16 }}>No applications yet</p>
                <Button onClick={() => setActiveTab("jobs")}>Browse Job Matches</Button>
              </div>
            ) : (
              DEMO_JOBS.filter((j) => appliedJobs.includes(j.id)).map((job) => (
                <Card key={job.id} style={{ borderLeft: `3px solid ${palette.green}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ fontWeight: 800, margin: "0 0 4px" }}>{job.title}</h4>
                      <p style={{ color: palette.muted, fontSize: 12, margin: 0, fontFamily: "'Space Mono', monospace" }}>{job.company}</p>
                    </div>
                    <Badge color={palette.accent}>Pending</Badge>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Button size="sm" variant="ghost" onClick={() => navigate("/chat/1")}>💬 Message Owner</Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
