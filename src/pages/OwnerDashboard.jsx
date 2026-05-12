import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { palette } from "../theme";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const MOCK_MATCHES = [
  {
    id: 1,
    name: "Murugan K.",
    skill: "Delivery / Two-Wheeler",
    experience: "3 years",
    location: "Thuckalay (2 km)",
    salary: "₹12,000 – ₹15,000",
    workType: "Full-time",
    verified: true,
    trustScore: 82,
    matchScore: 94,
    rank: 1,
    languages: ["Tamil", "English"],
    phone: "+91 98765 43210",
    available: "Immediately",
  },
  {
    id: 2,
    name: "Rajan S.",
    skill: "Delivery / Logistics",
    experience: "5 years",
    location: "Udangudi (6 km)",
    salary: "₹14,000 – ₹18,000",
    workType: "Full-time",
    verified: true,
    trustScore: 91,
    matchScore: 88,
    rank: 2,
    languages: ["Tamil"],
    phone: "+91 94321 87654",
    available: "1 week",
  },
  {
    id: 3,
    name: "Karthik M.",
    skill: "Delivery / Route Planning",
    experience: "1 year",
    location: "Thuckalay (3 km)",
    salary: "₹10,000 – ₹13,000",
    workType: "Part-time",
    verified: false,
    trustScore: 55,
    matchScore: 76,
    rank: 3,
    languages: ["Tamil", "English"],
    phone: "+91 88001 23456",
    available: "2 weeks",
  },
];

const POSTED_JOBS = [
  {
    id: 1,
    title: "Delivery Partner Needed",
    skill: "Delivery",
    salary: "₹12,000 – ₹15,000",
    type: "Full-time",
    radius: "10 km",
    headcount: 2,
    status: "open",
    applicants: 8,
    matches: 3,
    posted: "2 hours ago",
  },
];

function MatchRankBadge({ rank }) {
  const colors = { 1: palette.accent, 2: palette.muted, 3: "#CD7F32" };
  const labels = { 1: "🥇 TOP MATCH", 2: "🥈 2ND", 3: "🥉 3RD" };
  return (
    <Badge color={colors[rank]}>{labels[rank]}</Badge>
  );
}

function TrustBar({ score }) {
  const color = score >= 80 ? palette.green : score >= 60 ? palette.accent : palette.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ flex: 1, background: palette.cardBorder, borderRadius: 4, height: 4 }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 4 }} />
      </div>
      <span style={{ color, fontSize: 10, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{score}</span>
    </div>
  );
}

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("matches");
  const [showPostForm, setShowPostForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    skill: "",
    salaryMin: "",
    salaryMax: "",
    type: "Full-time",
    radius: "10",
    headcount: "1",
    description: "",
  });
  const [postedJobs, setPostedJobs] = useState(POSTED_JOBS);
  const [contactedWorkers, setContactedWorkers] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const handlePostJob = () => {
    const errors = {};
    if (!jobForm.title.trim()) errors.title = "Job title is required";
    if (!jobForm.skill.trim()) errors.skill = "Required skill is needed";
    if (Object.keys(errors).length) { setFormErrors(errors); return; }

    const newJob = {
      id: Date.now(),
      title: jobForm.title,
      skill: jobForm.skill,
      salary: `₹${jobForm.salaryMin || "10,000"} – ₹${jobForm.salaryMax || "15,000"}`,
      type: jobForm.type,
      radius: `${jobForm.radius} km`,
      headcount: parseInt(jobForm.headcount) || 1,
      status: "open",
      applicants: 0,
      matches: 3,
      posted: "Just now",
    };
    setPostedJobs((prev) => [newJob, ...prev]);
    setShowPostForm(false);
    setJobForm({ title: "", skill: "", salaryMin: "", salaryMax: "", type: "Full-time", radius: "10", headcount: "1", description: "" });
    setFormErrors({});
    setActiveTab("jobs");
  };

  const handleContact = (workerId) => {
    setContactedWorkers((prev) => [...prev, workerId]);
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
        <div style={{ width: 36, height: 36, borderRadius: 8, background: palette.accent + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏪</div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 14, margin: 0 }}>Udangudi Tea Shop</p>
          <p style={{ color: palette.muted, fontSize: 10, margin: 0, fontFamily: "'Space Mono', monospace" }}>Business Owner · Thuckalay</p>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Button size="sm" onClick={() => setShowPostForm(true)}>+ Post Job</Button>
        </div>
      </header>

      {/* Stats Bar */}
      <div style={{ background: "#0D1528", borderBottom: `1px solid ${palette.cardBorder}`, padding: "12px 20px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", gap: 28, flexWrap: "wrap" }}>
          {[
            { label: "Active Jobs", value: postedJobs.filter((j) => j.status === "open").length, color: palette.green },
            { label: "Top Matches", value: 3, color: palette.accent },
            { label: "Total Applicants", value: postedJobs.reduce((s, j) => s + (j.applicants || 0), 0) + 8, color: palette.blue },
            { label: "Hired", value: 0, color: palette.purple },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ color: s.color, fontSize: 22, fontWeight: 800, margin: 0 }}>{s.value}</p>
              <p style={{ color: palette.dim, fontSize: 10, margin: 0, fontFamily: "'Space Mono', monospace" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "#0D1528", borderBottom: `1px solid ${palette.cardBorder}`, padding: "0 20px" }}>
        <div style={{ display: "flex", maxWidth: 780, margin: "0 auto" }}>
          {[
            { key: "matches", label: "🎯 Top Matches" },
            { key: "jobs", label: "📋 My Jobs" },
            { key: "search", label: "🔍 Browse Workers" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: "none", border: "none",
                borderBottom: `2px solid ${activeTab === tab.key ? palette.accent : "transparent"}`,
                color: activeTab === tab.key ? palette.accent : palette.dim,
                padding: "12px 18px", fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "'Syne', sans-serif",
                transition: "color 0.2s", whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "20px 16px 40px" }}>
        {/* MATCHES TAB */}
        {activeTab === "matches" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 4px" }}>Top 3 Matched Workers</h3>
                <p style={{ color: palette.muted, fontSize: 11, margin: 0, fontFamily: "'Space Mono', monospace" }}>
                  For: "{POSTED_JOBS[0].title}" · AI-scored matches
                </p>
              </div>
              <Badge color={palette.accent}>AI MATCHED</Badge>
            </div>

            {MOCK_MATCHES.map((worker) => (
              <Card key={worker.id} style={{ borderLeft: `3px solid ${worker.rank === 1 ? palette.accent : palette.cardBorder}`, padding: 16, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", gap: 12, flex: 1 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 10,
                      background: palette.blue + "22",
                      border: `1.5px solid ${palette.blue}44`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                      flexShrink: 0,
                    }}>👷</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <h4 style={{ fontWeight: 800, fontSize: 15, margin: 0 }}>{worker.name}</h4>
                        <MatchRankBadge rank={worker.rank} />
                        {worker.verified && <Badge color={palette.green} size="xs">✓ Verified</Badge>}
                      </div>
                      <p style={{ color: palette.blue, fontSize: 12, fontFamily: "'Space Mono', monospace", margin: "0 0 8px" }}>{worker.skill}</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <Badge color={palette.teal} size="xs">📍 {worker.location}</Badge>
                        <Badge color={palette.accent} size="xs">💰 {worker.salary}</Badge>
                        <Badge color={palette.purple} size="xs">⏱ {worker.experience}</Badge>
                        <Badge color={palette.blue} size="xs">🗓 Available: {worker.available}</Badge>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{
                      background: worker.matchScore >= 90 ? palette.green + "22" : palette.accent + "22",
                      border: `1px solid ${worker.matchScore >= 90 ? palette.green : palette.accent}44`,
                      borderRadius: 10, padding: "8px 14px",
                    }}>
                      <p style={{ color: worker.matchScore >= 90 ? palette.green : palette.accent, fontSize: 22, fontWeight: 800, margin: 0 }}>
                        {worker.matchScore}%
                      </p>
                      <p style={{ color: palette.dim, fontSize: 9, fontFamily: "'Space Mono', monospace", margin: 0 }}>MATCH SCORE</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <p style={{ color: palette.dim, fontSize: 10, fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>Trust Score</p>
                  <TrustBar score={worker.trustScore} />
                </div>

                <div style={{ borderTop: `1px solid ${palette.cardBorder}`, marginTop: 12, paddingTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {contactedWorkers.includes(worker.id) ? (
                    <Badge color={palette.green}>✓ Contacted</Badge>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => { handleContact(worker.id); navigate("/chat/" + worker.id); }}>
                        💬 Chat Now
                      </Button>
                      <Button size="sm" variant="success" onClick={() => handleContact(worker.id)}>
                        📱 WhatsApp Connect
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleContact(worker.id)}>
                        📞 Call
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === "jobs" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>My Job Postings</h3>
              <Button size="sm" onClick={() => setShowPostForm(true)}>+ Post New Job</Button>
            </div>

            {postedJobs.map((job) => (
              <Card key={job.id} style={{ borderLeft: `3px solid ${palette.green}`, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h4 style={{ fontWeight: 800, margin: "0 0 6px" }}>{job.title}</h4>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <Badge color={palette.teal} size="xs">📍 {job.radius} radius</Badge>
                      <Badge color={palette.green} size="xs">💰 {job.salary}</Badge>
                      <Badge color={palette.blue} size="xs">{job.type}</Badge>
                      <Badge color={palette.purple} size="xs">👥 {job.headcount} needed</Badge>
                    </div>
                  </div>
                  <Badge color={job.status === "open" ? palette.green : palette.dim}>
                    {job.status.toUpperCase()}
                  </Badge>
                </div>

                <div style={{ display: "flex", gap: 20, marginTop: 12, borderTop: `1px solid ${palette.cardBorder}`, paddingTop: 12 }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: palette.blue, fontSize: 18, fontWeight: 800, margin: 0 }}>{job.applicants}</p>
                    <p style={{ color: palette.dim, fontSize: 9, fontFamily: "'Space Mono', monospace", margin: 0 }}>Applicants</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: palette.accent, fontSize: 18, fontWeight: 800, margin: 0 }}>{job.matches}</p>
                    <p style={{ color: palette.dim, fontSize: 9, fontFamily: "'Space Mono', monospace", margin: 0 }}>AI Matches</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: palette.muted, fontSize: 11, fontFamily: "'Space Mono', monospace", margin: 0 }}>{job.posted}</p>
                    <p style={{ color: palette.dim, fontSize: 9, fontFamily: "'Space Mono', monospace", margin: 0 }}>Posted</p>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Button size="sm" onClick={() => setActiveTab("matches")}>View Matches →</Button>
                  </div>
                </div>
              </Card>
            ))}

            {postedJobs.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>📋</div>
                <p style={{ color: palette.muted, marginBottom: 16 }}>No jobs posted yet</p>
                <Button onClick={() => setShowPostForm(true)}>Post Your First Job</Button>
              </div>
            )}
          </div>
        )}

        {/* BROWSE WORKERS TAB */}
        {activeTab === "search" && (
          <div className="fade-in">
            <div style={{ marginBottom: 16, display: "flex", gap: 10 }}>
              <input
                placeholder="Search by skill, location..."
                style={{
                  flex: 1, background: palette.surface,
                  border: `1px solid ${palette.cardBorder}`,
                  borderRadius: 10, padding: "10px 14px",
                  color: palette.text, fontSize: 13, outline: "none",
                }}
              />
              <Button>Search</Button>
            </div>

            {MOCK_MATCHES.map((worker) => (
              <Card key={worker.id} style={{ padding: 16 }} hover>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 8,
                      background: palette.blue + "22",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                    }}>👷</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <h4 style={{ fontWeight: 700, margin: "0 0 3px", fontSize: 14 }}>{worker.name}</h4>
                        {worker.verified && <Badge color={palette.green} size="xs">✓</Badge>}
                      </div>
                      <p style={{ color: palette.muted, fontSize: 11, fontFamily: "'Space Mono', monospace", margin: 0 }}>{worker.skill}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => navigate("/chat/" + worker.id)}>
                    💬 Message
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      {showPostForm && (
        <div style={{
          position: "fixed", inset: 0, background: "#000000cc", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
        }}>
          <div style={{
            background: palette.card,
            border: `1px solid ${palette.cardBorder}`,
            borderRadius: 18, padding: 28,
            width: "100%", maxWidth: 500,
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: 18, margin: 0 }}>Post a New Job</h3>
              <button
                onClick={() => setShowPostForm(false)}
                style={{ background: "none", border: "none", color: palette.muted, fontSize: 20, cursor: "pointer" }}
              >✕</button>
            </div>

            {[
              { key: "title", label: "Job Title *", placeholder: "e.g. Delivery Partner Needed" },
              { key: "skill", label: "Required Skill *", placeholder: "e.g. Bike riding, Cooking, Welding" },
              { key: "description", label: "Job Description", placeholder: "Brief job description..." },
            ].map((field) => (
              <div key={field.key} style={{ marginBottom: 14 }}>
                <label style={{ color: palette.muted, fontSize: 11, fontFamily: "'Space Mono', monospace", display: "block", marginBottom: 6 }}>
                  {field.label}
                </label>
                {field.key === "description" ? (
                  <textarea
                    value={jobForm[field.key]}
                    onChange={(e) => setJobForm((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={3}
                    style={{
                      width: "100%", background: palette.surface,
                      border: `1px solid ${formErrors[field.key] ? palette.red : palette.cardBorder}`,
                      borderRadius: 8, padding: "10px 12px",
                      color: palette.text, fontSize: 13, outline: "none", resize: "vertical",
                    }}
                  />
                ) : (
                  <input
                    value={jobForm[field.key]}
                    onChange={(e) => setJobForm((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%", background: palette.surface,
                      border: `1px solid ${formErrors[field.key] ? palette.red : palette.cardBorder}`,
                      borderRadius: 8, padding: "10px 12px",
                      color: palette.text, fontSize: 13, outline: "none",
                    }}
                  />
                )}
                {formErrors[field.key] && (
                  <p style={{ color: palette.red, fontSize: 10, margin: "4px 0 0", fontFamily: "'Space Mono', monospace" }}>
                    {formErrors[field.key]}
                  </p>
                )}
              </div>
            ))}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ color: palette.muted, fontSize: 11, fontFamily: "'Space Mono', monospace", display: "block", marginBottom: 6 }}>Min Salary (₹/mo)</label>
                <input
                  value={jobForm.salaryMin}
                  onChange={(e) => setJobForm((p) => ({ ...p, salaryMin: e.target.value }))}
                  placeholder="e.g. 10000"
                  type="number"
                  style={{ width: "100%", background: palette.surface, border: `1px solid ${palette.cardBorder}`, borderRadius: 8, padding: "10px 12px", color: palette.text, fontSize: 13, outline: "none" }}
                />
              </div>
              <div>
                <label style={{ color: palette.muted, fontSize: 11, fontFamily: "'Space Mono', monospace", display: "block", marginBottom: 6 }}>Max Salary (₹/mo)</label>
                <input
                  value={jobForm.salaryMax}
                  onChange={(e) => setJobForm((p) => ({ ...p, salaryMax: e.target.value }))}
                  placeholder="e.g. 15000"
                  type="number"
                  style={{ width: "100%", background: palette.surface, border: `1px solid ${palette.cardBorder}`, borderRadius: 8, padding: "10px 12px", color: palette.text, fontSize: 13, outline: "none" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              <div>
                <label style={{ color: palette.muted, fontSize: 11, fontFamily: "'Space Mono', monospace", display: "block", marginBottom: 6 }}>Work Type</label>
                <select
                  value={jobForm.type}
                  onChange={(e) => setJobForm((p) => ({ ...p, type: e.target.value }))}
                  style={{ width: "100%", background: palette.surface, border: `1px solid ${palette.cardBorder}`, borderRadius: 8, padding: "10px 8px", color: palette.text, fontSize: 12, outline: "none" }}
                >
                  {["Full-time", "Part-time", "Contract"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: palette.muted, fontSize: 11, fontFamily: "'Space Mono', monospace", display: "block", marginBottom: 6 }}>Radius (km)</label>
                <input
                  value={jobForm.radius}
                  onChange={(e) => setJobForm((p) => ({ ...p, radius: e.target.value }))}
                  type="number" min="1" max="50"
                  style={{ width: "100%", background: palette.surface, border: `1px solid ${palette.cardBorder}`, borderRadius: 8, padding: "10px 8px", color: palette.text, fontSize: 13, outline: "none" }}
                />
              </div>
              <div>
                <label style={{ color: palette.muted, fontSize: 11, fontFamily: "'Space Mono', monospace", display: "block", marginBottom: 6 }}>Headcount</label>
                <input
                  value={jobForm.headcount}
                  onChange={(e) => setJobForm((p) => ({ ...p, headcount: e.target.value }))}
                  type="number" min="1"
                  style={{ width: "100%", background: palette.surface, border: `1px solid ${palette.cardBorder}`, borderRadius: 8, padding: "10px 8px", color: palette.text, fontSize: 13, outline: "none" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="ghost" full onClick={() => setShowPostForm(false)}>Cancel</Button>
              <Button full onClick={handlePostJob}>Post Job 🚀</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
