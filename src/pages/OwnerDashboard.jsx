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

const TABS = [
  { key: "matches", label: "🎯 Top Matches" },
  { key: "jobs", label: "📋 My Jobs" },
  { key: "search", label: "🔍 Browse Workers" },
];

function RankBadge({ rank }) {
  const map = {
    1: { color: palette.accent, label: "🥇 TOP MATCH" },
    2: { color: palette.muted, label: "🥈 2ND" },
    3: { color: "#CD7F32", label: "🥉 3RD" },
  };
  const { color, label } = map[rank] || map[3];
  return <Badge color={color}>{label}</Badge>;
}

function TrustBar({ score }) {
  const color = score >= 80 ? palette.green : score >= 60 ? palette.accent : palette.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: 4, height: 5 }}>
        <div style={{
          width: `${score}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          borderRadius: 4,
          boxShadow: `0 0 6px ${color}55`,
        }} />
      </div>
      <span style={{ color, fontSize: 10, fontFamily: "'Space Mono', monospace", fontWeight: 800, minWidth: 26 }}>{score}</span>
    </div>
  );
}

const INPUT_STYLE = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10, padding: "10px 12px",
  color: palette.text, fontSize: 13, outline: "none",
  fontFamily: "'Syne', sans-serif",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("matches");
  const [showPostForm, setShowPostForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "", skill: "", salaryMin: "", salaryMax: "",
    type: "Full-time", radius: "10", headcount: "1", description: "",
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

  const handleContact = (workerId) => setContactedWorkers((prev) => [...prev, workerId]);

  return (
    <div style={{ background: palette.bg, minHeight: "100vh" }}>

      {/* Header */}
      <header style={{
        background: "rgba(4,8,15,0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "13px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: palette.muted, fontSize: 16, cursor: "pointer",
            borderRadius: 8, padding: "4px 10px",
          }}
        >←</button>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: palette.accent + "22",
          border: `1.5px solid ${palette.accent}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>🏪</div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 14, margin: 0 }}>Udangudi Tea Shop</p>
          <p style={{ color: palette.muted, fontSize: 9, margin: 0, fontFamily: "'Space Mono', monospace" }}>
            Business Owner · Thuckalay
          </p>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Button size="sm" onClick={() => setShowPostForm(true)}>+ Post Job</Button>
        </div>
      </header>

      {/* Stats Bar */}
      <div style={{
        background: "rgba(13,21,40,0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "14px 20px",
      }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", gap: 32, flexWrap: "wrap" }}>
          {[
            { label: "Active Jobs", value: postedJobs.filter((j) => j.status === "open").length, color: palette.green },
            { label: "Top Matches", value: 3, color: palette.accent },
            { label: "Applicants", value: postedJobs.reduce((s, j) => s + (j.applicants || 0), 0) + 8, color: palette.blue },
            { label: "Hired", value: 0, color: palette.purple },
          ].map((s) => (
            <div key={s.label}>
              <p style={{
                fontSize: 24, fontWeight: 800, margin: "0 0 2px",
                fontFamily: "'Space Mono', monospace",
                color: s.color,
              }}>{s.value}</p>
              <p style={{ color: palette.dim, fontSize: 9, margin: 0, fontFamily: "'Space Mono', monospace", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: "rgba(13,21,40,0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 20px",
      }}>
        <div style={{ display: "flex", maxWidth: 780, margin: "0 auto" }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: "none", border: "none",
                borderBottom: `2px solid ${activeTab === tab.key ? palette.accent : "transparent"}`,
                color: activeTab === tab.key ? palette.accent : palette.dim,
                padding: "12px 20px", fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "'Syne', sans-serif",
                transition: "all 0.2s", whiteSpace: "nowrap",
              }}
            >{tab.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "22px 16px 48px" }}>

        {/* MATCHES TAB */}
        {activeTab === "matches" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 4px" }}>Top 3 Matched Workers</h3>
                <p style={{ color: palette.muted, fontSize: 11, margin: 0, fontFamily: "'Space Mono', monospace" }}>
                  For: "{POSTED_JOBS[0].title}" · AI-scored
                </p>
              </div>
              <Badge color={palette.accent} glow>AI MATCHED</Badge>
            </div>

            {MOCK_MATCHES.map((worker) => (
              <div
                key={worker.id}
                style={{
                  background: worker.rank === 1
                    ? "rgba(245,158,11,0.06)"
                    : "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: `1px solid ${worker.rank === 1 ? palette.accent + "44" : "rgba(255,255,255,0.08)"}`,
                  borderLeft: `3px solid ${worker.rank === 1 ? palette.accent : palette.cardBorder}`,
                  borderRadius: 16,
                  padding: "18px",
                  marginBottom: 14,
                  transition: "all 0.25s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", gap: 12, flex: 1 }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 12,
                      background: palette.blue + "18",
                      border: `1.5px solid ${palette.blue}33`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24, flexShrink: 0,
                    }}>👷</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                        <h4 style={{ fontWeight: 800, fontSize: 15, margin: 0 }}>{worker.name}</h4>
                        <RankBadge rank={worker.rank} />
                        {worker.verified && <Badge color={palette.green} size="xs" glow>✓ Verified</Badge>}
                      </div>
                      <p style={{ color: palette.blue, fontSize: 11, fontFamily: "'Space Mono', monospace", margin: "0 0 10px" }}>
                        {worker.skill}
                      </p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <Badge color={palette.teal} size="xs">📍 {worker.location}</Badge>
                        <Badge color={palette.accent} size="xs">💰 {worker.salary}</Badge>
                        <Badge color={palette.purple} size="xs">⏱ {worker.experience}</Badge>
                        <Badge color={palette.blue} size="xs">🗓 {worker.available}</Badge>
                      </div>
                    </div>
                  </div>

                  <div style={{ flexShrink: 0 }}>
                    <div style={{
                      background: worker.matchScore >= 90 ? palette.green + "18" : palette.accent + "18",
                      border: `1px solid ${worker.matchScore >= 90 ? palette.green : palette.accent}44`,
                      borderRadius: 12, padding: "10px 16px", textAlign: "center",
                    }}>
                      <p style={{
                        color: worker.matchScore >= 90 ? palette.green : palette.accent,
                        fontSize: 24, fontWeight: 800, margin: 0,
                        fontFamily: "'Space Mono', monospace",
                      }}>{worker.matchScore}%</p>
                      <p style={{ color: palette.dim, fontSize: 9, fontFamily: "'Space Mono', monospace", margin: 0, letterSpacing: 0.5 }}>MATCH</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <p style={{ color: palette.dim, fontSize: 9, fontFamily: "'Space Mono', monospace", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Trust Score</p>
                  <TrustBar score={worker.trustScore} />
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 14, paddingTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {contactedWorkers.includes(worker.id) ? (
                    <Badge color={palette.green} glow>✓ Contacted</Badge>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => { handleContact(worker.id); navigate("/chat/" + worker.id); }}>
                        💬 Chat Now
                      </Button>
                      <Button size="sm" variant="success" onClick={() => handleContact(worker.id)}>
                        📱 WhatsApp
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleContact(worker.id)}>
                        📞 Call
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === "jobs" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>My Job Postings</h3>
              <Button size="sm" onClick={() => setShowPostForm(true)}>+ Post New Job</Button>
            </div>

            {postedJobs.map((job) => (
              <Card key={job.id} style={{ borderLeft: `3px solid ${palette.green}`, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h4 style={{ fontWeight: 800, margin: "0 0 8px" }}>{job.title}</h4>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <Badge color={palette.teal} size="xs">📍 {job.radius} radius</Badge>
                      <Badge color={palette.green} size="xs">💰 {job.salary}</Badge>
                      <Badge color={palette.blue} size="xs">{job.type}</Badge>
                      <Badge color={palette.purple} size="xs">👥 {job.headcount} needed</Badge>
                    </div>
                  </div>
                  <Badge color={job.status === "open" ? palette.green : palette.dim} glow={job.status === "open"}>
                    {job.status.toUpperCase()}
                  </Badge>
                </div>

                <div style={{ display: "flex", gap: 24, marginTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: palette.blue, fontSize: 20, fontWeight: 800, margin: 0, fontFamily: "'Space Mono', monospace" }}>{job.applicants}</p>
                    <p style={{ color: palette.dim, fontSize: 9, fontFamily: "'Space Mono', monospace", margin: 0, textTransform: "uppercase" }}>Applicants</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: palette.accent, fontSize: 20, fontWeight: 800, margin: 0, fontFamily: "'Space Mono', monospace" }}>{job.matches}</p>
                    <p style={{ color: palette.dim, fontSize: 9, fontFamily: "'Space Mono', monospace", margin: 0, textTransform: "uppercase" }}>AI Matches</p>
                  </div>
                  <div>
                    <p style={{ color: palette.muted, fontSize: 10, fontFamily: "'Space Mono', monospace", margin: "0 0 1px" }}>{job.posted}</p>
                    <p style={{ color: palette.dim, fontSize: 9, fontFamily: "'Space Mono', monospace", margin: 0 }}>Posted</p>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Button size="sm" onClick={() => setActiveTab("matches")}>View Matches →</Button>
                  </div>
                </div>
              </Card>
            ))}

            {postedJobs.length === 0 && (
              <div style={{ textAlign: "center", padding: "70px 20px" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 20,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 36, margin: "0 auto 18px",
                }}>📋</div>
                <p style={{ color: palette.muted, marginBottom: 18 }}>No jobs posted yet</p>
                <Button onClick={() => setShowPostForm(true)}>Post Your First Job</Button>
              </div>
            )}
          </div>
        )}

        {/* BROWSE WORKERS TAB */}
        {activeTab === "search" && (
          <div className="fade-in">
            <div style={{ marginBottom: 18, display: "flex", gap: 10 }}>
              <input
                placeholder="Search by skill, location..."
                style={{
                  ...INPUT_STYLE,
                  flex: 1,
                  borderRadius: 12,
                  padding: "11px 16px",
                  fontSize: 14,
                }}
              />
              <Button>Search</Button>
            </div>

            {MOCK_MATCHES.map((worker) => (
              <Card key={worker.id} hover onClick={() => navigate("/chat/" + worker.id)} glow={palette.blue}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: palette.blue + "18",
                      border: `1px solid ${palette.blue}33`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22,
                    }}>👷</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <h4 style={{ fontWeight: 700, margin: 0, fontSize: 14 }}>{worker.name}</h4>
                        {worker.verified && <Badge color={palette.green} size="xs">✓</Badge>}
                      </div>
                      <p style={{ color: palette.muted, fontSize: 11, fontFamily: "'Space Mono', monospace", margin: 0 }}>{worker.skill}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); navigate("/chat/" + worker.id); }}>
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
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.78)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
        }}>
          <div style={{
            background: "rgba(13,21,40,0.98)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 22,
            padding: "28px 24px",
            width: "100%", maxWidth: 500,
            maxHeight: "90vh", overflowY: "auto",
            boxShadow: `0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.1)`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: 18, margin: "0 0 3px" }}>Post a New Job</h3>
                <p style={{ color: palette.muted, fontSize: 11, margin: 0, fontFamily: "'Space Mono', monospace" }}>
                  AI will match workers instantly
                </p>
              </div>
              <button
                onClick={() => setShowPostForm(false)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: palette.muted, fontSize: 16, cursor: "pointer",
                  borderRadius: 8, padding: "4px 10px",
                }}
              >✕</button>
            </div>

            {[
              { key: "title", label: "Job Title *", placeholder: "e.g. Delivery Partner Needed" },
              { key: "skill", label: "Required Skill *", placeholder: "e.g. Bike riding, Cooking, Welding" },
              { key: "description", label: "Job Description", placeholder: "Brief job description..." },
            ].map((field) => (
              <div key={field.key} style={{ marginBottom: 14 }}>
                <label style={{ color: palette.muted, fontSize: 10, fontFamily: "'Space Mono', monospace", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {field.label}
                </label>
                {field.key === "description" ? (
                  <textarea
                    value={jobForm[field.key]}
                    onChange={(e) => setJobForm((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={3}
                    style={{
                      ...INPUT_STYLE,
                      border: `1px solid ${formErrors[field.key] ? palette.red + "66" : "rgba(255,255,255,0.1)"}`,
                      resize: "vertical",
                    }}
                  />
                ) : (
                  <input
                    value={jobForm[field.key]}
                    onChange={(e) => setJobForm((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={{
                      ...INPUT_STYLE,
                      border: `1px solid ${formErrors[field.key] ? palette.red + "66" : "rgba(255,255,255,0.1)"}`,
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
              {[
                { key: "salaryMin", label: "Min Salary (₹/mo)", placeholder: "10000", type: "number" },
                { key: "salaryMax", label: "Max Salary (₹/mo)", placeholder: "15000", type: "number" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ color: palette.muted, fontSize: 10, fontFamily: "'Space Mono', monospace", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {f.label}
                  </label>
                  <input
                    value={jobForm[f.key]}
                    onChange={(e) => setJobForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    type={f.type}
                    style={INPUT_STYLE}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 22 }}>
              <div>
                <label style={{ color: palette.muted, fontSize: 10, fontFamily: "'Space Mono', monospace", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Work Type</label>
                <select
                  value={jobForm.type}
                  onChange={(e) => setJobForm((p) => ({ ...p, type: e.target.value }))}
                  style={{ ...INPUT_STYLE, cursor: "pointer" }}
                >
                  {["Full-time", "Part-time", "Contract"].map((t) => <option key={t} style={{ background: "#0D1528" }}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: palette.muted, fontSize: 10, fontFamily: "'Space Mono', monospace", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Radius (km)</label>
                <input
                  value={jobForm.radius}
                  onChange={(e) => setJobForm((p) => ({ ...p, radius: e.target.value }))}
                  type="number" min="1" max="50"
                  style={INPUT_STYLE}
                />
              </div>
              <div>
                <label style={{ color: palette.muted, fontSize: 10, fontFamily: "'Space Mono', monospace", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Headcount</label>
                <input
                  value={jobForm.headcount}
                  onChange={(e) => setJobForm((p) => ({ ...p, headcount: e.target.value }))}
                  type="number" min="1"
                  style={INPUT_STYLE}
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
