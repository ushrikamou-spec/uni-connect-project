"use client";

import { useMemo, useState, useEffect } from "react";
import "./faculty-applications.css";

const initialApplications = [
  {
    id: 1,
    name: "Maya Rahman",
    studentId: "2211458042",
    project: "AI-Powered Student Support",
    status: "Pending",
    cgpa: 3.88,
    match: 94,
    date: 6,
    sop: "I am interested in building practical AI tools that make student support more accessible. My coursework in machine learning and experience with a campus chatbot project have motivated me to contribute to research that connects technical work with real student needs.",
    skills: ["Python", "Machine Learning", "Natural Language Processing", "Research"],
    email: "maya.rahman@example.edu",
    phone: "+880 1711-234567",
    year: "3rd year, Computer Science & Engineering",
    cv: {
      fileName: "Maya_Rahman_CV.txt",
      summary: "Undergraduate CSE researcher specializing in NLP, conversational AI, and educational technology.",
      experience: [
        "Undergraduate Teaching Assistant — CSE225 Data Structures & Algorithms (2025–Present)",
        "Student Developer — Campus FAQ Chatbot Pilot Project (2025)",
      ],
      projects: [
        "Bangla-English Academic Query Classifier (Python, PyTorch, HuggingFace)",
        "Automated Lecture Summarizer Web App (Next.js, OpenAI API)",
      ],
      achievements: "Dean's List (4 Semesters), 1st Runner-Up at Intra-University AI Hackathon",
    },
  },
  {
    id: 2,
    name: "Tanvir Hasan",
    studentId: "2131892042",
    project: "Sustainable Campus Energy Study",
    status: "Under review",
    cgpa: 3.72,
    match: 87,
    date: 5,
    sop: "I would like to explore data-driven ways to reduce energy consumption across campus. I have worked with sensor datasets and enjoy turning analysis into recommendations that can be tested and measured.",
    skills: ["Data Analysis", "Python", "Statistics", "Sustainability"],
    email: "tanvir.hasan@example.edu",
    phone: "+880 1812-345678",
    year: "4th year, Electrical & Electronic Engineering",
    cv: {
      fileName: "Tanvir_Hasan_CV.txt",
      summary: "Final-year EEE student experienced in IoT smart-grid telemetry, energy auditing, and statistical modeling.",
      experience: [
        "Lab Assistant — Power Systems & Renewable Energy Lab (2025–Present)",
        "Intern — Smart Meter Data Analytics Team, Dhaka Power Grid Study (2024)",
      ],
      projects: [
        "Real-Time Classroom HVAC Load Monitoring with ESP32 & Python",
        "Solar Microgrid Feasibility Analysis for Academic Buildings",
      ],
      achievements: "IEEE Student Branch Technical Coordinator",
    },
  },
  {
    id: 3,
    name: "Nadia Islam",
    studentId: "2212045042",
    project: "Accessible Learning Interfaces",
    status: "Shortlisted",
    cgpa: 3.95,
    match: 91,
    date: 4,
    sop: "My goal is to design digital learning experiences that work for students with different accessibility needs. I have conducted usability tests in a student design group and would value the chance to apply user-centred methods in a research setting.",
    skills: ["UI/UX Design", "Accessibility", "Figma", "User Research"],
    email: "nadia.islam@example.edu",
    phone: "+880 1913-456789",
    year: "3rd year, Software Engineering",
    cv: {
      fileName: "Nadia_Islam_CV.txt",
      summary: "Software Engineering scholar focused on WCAG-compliant interfaces, assistive UX, and empirical usability evaluation.",
      experience: [
        "Lead UX Researcher — University HCI & Accessibility Study Group (2025–Present)",
        "Peer Mentor — Software Engineering Design Studio (2024–2025)",
      ],
      projects: [
        "Screen-Reader Friendly Course Portal Prototype (React, ARIA, Figma)",
        "Usability Benchmark Study of University LMS Tools (n = 45 students)",
      ],
      achievements: "Chancellor's Honor Roll, Best UI/UX Design Award 2025",
    },
  },
  {
    id: 4,
    name: "Rafi Ahmed",
    studentId: "2311764042",
    project: "AI-Powered Student Support",
    status: "Pending",
    cgpa: 3.61,
    match: 78,
    date: 3,
    sop: "I am applying because I want to gain hands-on research experience in applied machine learning. I have completed projects involving text classification and am keen to learn more about evaluation, responsible AI, and collaboration.",
    skills: ["Python", "Text Classification", "Git", "Teamwork"],
    email: "rafi.ahmed@example.edu",
    phone: "+880 1614-567890",
    year: "2nd year, Computer Science & Engineering",
    cv: {
      fileName: "Rafi_Ahmed_CV.txt",
      summary: "Motivated 2nd-year CSE student with strong foundations in supervised ML, Python scripting, and version control.",
      experience: [
        "Junior Developer — University Programming Club Automation Team (2025–Present)",
      ],
      projects: [
        "Sentiment & Intent Classifier for Student Feedback Surveys (Scikit-learn)",
        "GitHub Issue Triage Bot in Python",
      ],
      achievements: "Top 10% in Introduction to Artificial Intelligence Course",
    },
  },
  {
    id: 5,
    name: "Sadia Chowdhury",
    studentId: "2121539042",
    project: "Sustainable Campus Energy Study",
    status: "Under review",
    cgpa: 3.84,
    match: 89,
    date: 2,
    sop: "I am excited by research that combines environmental impact with quantitative analysis. My academic projects have focused on interpreting data clearly, and I would like to help identify realistic improvements to campus energy use.",
    skills: ["Excel", "Data Visualization", "Statistics", "Report Writing"],
    email: "sadia.chowdhury@example.edu",
    phone: "+880 1515-678901",
    year: "4th year, Environmental Science",
    cv: {
      fileName: "Sadia_Chowdhury_CV.txt",
      summary: "Environmental Science senior experienced in carbon footprint auditing, quantitative sustainability reporting, and R/Excel modeling.",
      experience: [
        "Research Fellow — Campus Green Audit Initiative (2025–Present)",
      ],
      projects: [
        "Annual Electricity & Water Consumption Trend Report (2022–2025)",
        "Campus Waste & Energy Policy Brief",
      ],
      achievements: "Best Environmental Research Poster 2025",
    },
  },
  {
    id: 6,
    name: "Imran Kabir",
    studentId: "2312198042",
    project: "Accessible Learning Interfaces",
    status: "Pending",
    cgpa: 3.54,
    match: 73,
    date: 1,
    sop: "I hope to contribute front-end development skills while learning how accessibility standards are applied in real products. I have built several small web interfaces and am eager to improve them through feedback and structured testing.",
    skills: ["HTML", "CSS", "JavaScript", "Prototyping"],
    email: "imran.kabir@example.edu",
    phone: "+880 1716-789012",
    year: "2nd year, Information Technology",
    cv: {
      fileName: "Imran_Kabir_CV.txt",
      summary: "Front-end developer passionate about responsive web design, semantic HTML, and interactive prototyping.",
      experience: [
        "Web Volunteer — University Tech Fest Portal Team (2025)",
      ],
      projects: [
        "Keyboard-Navigable Study Planner Web App (HTML, CSS, JavaScript)",
        "High-Contrast Reading Mode Browser Extension",
      ],
      achievements: "Finalist — Web Design Sprint 2025",
    },
  },
];

function statusClass(status) {
  if (status === "Shortlisted") return "fa-shortlisted";
  if (status === "Under review") return "fa-review";
  if (status === "Rejected") return "fa-rejected";
  return "fa-pending";
}

export default function FacultyApplicationsPage() {
  const [applications, setApplications] = useState(initialApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selected, setSelected] = useState(null);
  const [showCvPreview, setShowCvPreview] = useState(true);
  const [minMatchThreshold, setMinMatchThreshold] = useState(85);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3200);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!selected) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") setSelected(null);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  const counts = useMemo(
    () => ({
      pending: applications.filter((a) => a.status === "Pending").length,
      shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
      review: applications.filter((a) => a.status === "Under review").length,
    }),
    [applications]
  );

  // Preview how many non-rejected candidates qualify at the chosen threshold
  const eligibleCount = useMemo(
    () =>
      applications.filter(
        (a) => a.status !== "Rejected" && a.match >= Number(minMatchThreshold)
      ).length,
    [applications, minMatchThreshold]
  );

  const visibleApplications = useMemo(() => {
    const term = search.trim().toLowerCase();

    const filtered = applications.filter((a) => {
      const matchesStatus =
        statusFilter === "all" || a.status === statusFilter;

      const searchable = [
        a.name,
        a.studentId,
        a.project,
        a.sop,
        a.email,
        a.year,
        ...a.skills,
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!term || searchable.includes(term));
    });

    return filtered.sort((a, b) => {
      if (sortBy === "cgpa") return b.cgpa - a.cgpa;
      if (sortBy === "match") return b.match - a.match;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return a.date - b.date;
    });
  }, [applications, search, statusFilter, sortBy]);

  function handleAutoShortlist() {
    const threshold = Math.max(0, Math.min(100, Number(minMatchThreshold) || 0));
    let shortlistedCount = 0;

    setApplications((previous) =>
      previous.map((app) => {
        if (app.status === "Rejected") return app;

        if (app.match >= threshold) {
          shortlistedCount += 1;
          return { ...app, status: "Shortlisted" };
        }

        
        if (app.status === "Shortlisted") {
          return { ...app, status: "Pending" };
        }

        return app;
      })
    );

    setStatusFilter("Shortlisted");
    setSortBy("match");
    setNotice(
      `Updated shortlist: ${shortlistedCount} applicant(s) matched ≥ ${threshold}% skill requirement.`
    );
  }

  function changeStatus(id, newStatus) {
    const application = applications.find((a) => a.id === id);
    if (!application) return;

    if (application.status === newStatus) {
      setNotice(
        `${application.name} is already marked ${newStatus.toLowerCase()}.`
      );
      return;
    }

    setApplications((previous) =>
      previous.map((a) =>
        a.id === id ? { ...a, status: newStatus } : a
      )
    );

    if (selected?.id === id) {
      setSelected({ ...application, status: newStatus });
    }

    setNotice(
      `${application.name}'s application marked ${newStatus.toLowerCase()}.`
    );
  }

  function handleDownloadCv(applicant) {
    const cvContent = [
      `CURRICULUM VITAE — ${applicant.name.toUpperCase()}`,
      `Student ID: ${applicant.studentId}`,
      `Program: ${applicant.year}`,
      `Email: ${applicant.email} | Phone: ${applicant.phone}`,
      `CGPA: ${applicant.cgpa.toFixed(2)} / 4.00 | Skill Match: ${applicant.match}%`,
      `Applied Project: ${applicant.project}`,
      `------------------------------------------------------------`,
      `SUMMARY`,
      applicant.cv.summary,
      ``,
      `KEY SKILLS`,
      applicant.skills.join(", "),
      ``,
      `EXPERIENCE`,
      ...applicant.cv.experience.map((item) => `• ${item}`),
      ``,
      `SELECTED PROJECTS`,
      ...applicant.cv.projects.map((item) => `• ${item}`),
      ``,
      `HONORS & ACHIEVEMENTS`,
      applicant.cv.achievements,
    ].join("\n");

    const blob = new Blob([cvContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = applicant.cv.fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="faculty-applications-page">
      <main className="fa-main">
        <section className="fa-intro">
          <span className="fa-eyebrow">Faculty portal</span>
          <h1>Review Applications</h1>
          <p>
            Review student applications, auto-shortlist candidates by skill match
            percentage, and inspect shortlisted applicants&apos; details and CVs.
          </p>
        </section>

        <section className="fa-stats" aria-label="Application status summary">
          <div className="fa-stat">
            <div className="fa-stat-top">
              <span>Pending</span>
              <span className="fa-dot fa-dot-pending" />
            </div>
            <div className="fa-stat-number">{counts.pending}</div>
          </div>

          <div
            className="fa-stat"
            style={{ cursor: "pointer" }}
            onClick={() => setStatusFilter("Shortlisted")}
            title="Click to view all shortlisted applicants"
          >
            <div className="fa-stat-top">
              <span>Shortlisted</span>
              <span className="fa-dot fa-dot-shortlisted" />
            </div>
            <div className="fa-stat-number">{counts.shortlisted}</div>
          </div>

          <div className="fa-stat">
            <div className="fa-stat-top">
              <span>Under review</span>
              <span className="fa-dot fa-dot-review" />
            </div>
            <div className="fa-stat-number">{counts.review}</div>
          </div>
        </section>

        {/* Auto-Shortlist by Skill Match Panel */}
        <section
          aria-label="Auto shortlist by skill match"
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "16px 20px",
            marginBottom: "20px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.98rem", color: "#0f172a" }}>
              Auto-Shortlist by Skill Match
            </div>
            <div style={{ fontSize: "0.86rem", color: "#475569", marginTop: "2px" }}>
              Select minimum skill match percentage ({eligibleCount} applicant
              {eligibleCount === 1 ? "" : "s"} qualify at ≥ {minMatchThreshold}%).
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
            <label
              htmlFor="skill-threshold-select"
              style={{ fontSize: "0.86rem", fontWeight: 600, color: "#334155" }}
            >
              Min Skill Match:
            </label>
            <select
              id="skill-threshold-select"
              className="fa-select"
              value={minMatchThreshold}
              onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
            >
              <option value={70}>70% or higher</option>
              <option value={75}>75% or higher</option>
              <option value={80}>80% or higher</option>
              <option value={85}>85% or higher</option>
              <option value={90}>90% or higher</option>
            </select>

            <button
              type="button"
              className="fa-approve-btn"
              onClick={handleAutoShortlist}
            >
              Auto-Shortlist (≥ {minMatchThreshold}%)
            </button>

            {statusFilter === "Shortlisted" && (
              <button
                type="button"
                className="fa-view-btn"
                onClick={() => setStatusFilter("all")}
              >
                Show All
              </button>
            )}
          </div>
        </section>

        <section className="fa-applications-section">
          <div className="fa-toolbar">
            <div className="fa-results-label" aria-live="polite">
              Showing {visibleApplications.length} of {applications.length} applications
            </div>

            <div className="fa-toolbar-controls">
              <input
                className="fa-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students, IDs, or projects..."
                aria-label="Search applications"
              />

              <select
                className="fa-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by application status"
              >
                <option value="all">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Under review">Under review</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                className="fa-select"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort applications"
              >
                <option value="recent">Sort: Most recent</option>
                <option value="cgpa">Sort: Highest CGPA</option>
                <option value="match">Sort: Best skill match</option>
                <option value="name">Sort: Student name</option>
              </select>
            </div>
          </div>

          <div className="fa-application-list" aria-live="polite">
            {visibleApplications.length === 0 ? (
              <div className="fa-empty">
                <div className="fa-empty-icon">⌕</div>
                <h2>No applications found</h2>
                <p>
                  Try changing your search or status filter.
                </p>
                <button
                  className="fa-reset-btn"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              visibleApplications.map((application) => (
                <article className="fa-application-card" key={application.id}>
                  <div className="fa-card-head">
                    <div>
                      <h2 className="fa-student-name">
                        {application.name}{" "}
                        <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "#64748b" }}>
                          ({application.studentId})
                        </span>
                      </h2>
                      <div className="fa-project-name">
                        Applied to: {application.project}
                      </div>
                      <div className="fa-status-row">
                        <span
                          className={`fa-status ${statusClass(application.status)}`}
                        >
                          {application.status}
                        </span>
                      </div>
                    </div>

                    <button
                      className="fa-view-btn"
                      onClick={() => {
                        setSelected(application);
                        setShowCvPreview(true);
                      }}
                    >
                      {application.status === "Shortlisted"
                        ? "View Details & CV ↗"
                        : "View details ↗"}
                    </button>
                  </div>

                  <span className="fa-sop-label">Statement of purpose</span>
                  <p className="fa-sop">{application.sop}</p>

                  <div className="fa-metrics">
                    <div className="fa-metric">
                      <span className="fa-metric-label">Student CGPA</span>
                      <span className="fa-metric-value">
                        {application.cgpa.toFixed(2)} / 4.00
                      </span>
                    </div>

                    <div className="fa-metric">
                      <span className="fa-metric-label">Skill match</span>
                      <span className="fa-metric-value fa-match-value">
                        {application.match}%
                      </span>
                    </div>
                  </div>

                  <div className="fa-card-footer">
                    <span className="fa-submitted">
                      Submitted {application.date}{" "}
                      {application.date === 1 ? "day" : "days"} ago
                    </span>

                    <div className="fa-decision-actions">
                      <button
                        className="fa-approve-btn"
                        onClick={() => changeStatus(application.id, "Shortlisted")}
                      >
                        {application.status === "Shortlisted" ? "Shortlisted ✓" : "Shortlist"}
                      </button>

                      <button
                        className="fa-reject-btn"
                        onClick={() => changeStatus(application.id, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="fa-footer">
        © 2026 uni-connect · Bringing campus communities together
      </footer>

      {notice && (
        <div className="fa-notice" role="status" aria-live="polite">
          <span className="fa-notice-check">✓</span>
          {notice}
        </div>
      )}

      {selected && (
        <div
          className="fa-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <section
            className="fa-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fa-modal-title"
          >
            <div className="fa-modal-header">
              <div>
                <span className="fa-modal-eyebrow">
                  {selected.status === "Shortlisted"
                    ? "Shortlisted Candidate Profile & CV"
                    : "Application details"}
                </span>
                <h2 id="fa-modal-title">
                  {selected.name} ({selected.studentId})
                </h2>
                <p className="fa-project-name">
                  Applied to: {selected.project}
                </p>
              </div>

              <button
                className="fa-close-btn"
                onClick={() => setSelected(null)}
                aria-label="Close details"
                autoFocus
              >
                ×
              </button>
            </div>

            <div className="fa-modal-section">
              <h3>Student profile</h3>
              <p>{selected.year}</p>
              <p>
                <a href={`mailto:${selected.email}`}>{selected.email}</a> · {selected.phone}
              </p>
              <p>
                <strong>CGPA:</strong> {selected.cgpa.toFixed(2)} / 4.00
                {" · "}
                <strong>Skill match:</strong> {selected.match}%
              </p>
            </div>

            <div className="fa-modal-section">
              <h3>Statement of purpose</h3>
              <p>{selected.sop}</p>
            </div>

            <div className="fa-modal-section">
              <h3>Relevant skills</h3>
              <div className="fa-skill-list">
                {selected.skills.map((skill) => (
                  <span className="fa-skill-chip" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Curriculum Vitae (CV) Preview & Download Section */}
            <div className="fa-modal-section">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <h3 style={{ margin: 0 }}>Curriculum Vitae (CV)</h3>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className="fa-view-btn"
                    onClick={() => setShowCvPreview((prev) => !prev)}
                  >
                    {showCvPreview ? "Hide CV" : "View CV"}
                  </button>
                  <button
                    type="button"
                    className="fa-approve-btn"
                    onClick={() => handleDownloadCv(selected)}
                  >
                    Download CV
                  </button>
                </div>
              </div>

              {showCvPreview && selected.cv && (
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    fontSize: "0.88rem",
                    lineHeight: 1.55,
                    color: "#1e293b",
                  }}
                >
                  <p style={{ marginBottom: "8px" }}>
                    <strong>Academic Summary:</strong> {selected.cv.summary}
                  </p>

                  <div style={{ marginBottom: "8px" }}>
                    <strong>Experience:</strong>
                    <ul style={{ margin: "4px 0 0 18px" }}>
                      {selected.cv.experience.map((exp) => (
                        <li key={exp}>{exp}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginBottom: "8px" }}>
                    <strong>Key Projects:</strong>
                    <ul style={{ margin: "4px 0 0 18px" }}>
                      {selected.cv.projects.map((proj) => (
                        <li key={proj}>{proj}</li>
                      ))}
                    </ul>
                  </div>

                  <p style={{ margin: 0 }}>
                    <strong>Honors & Achievements:</strong> {selected.cv.achievements}
                  </p>
                </div>
              )}
            </div>

            <div className="fa-modal-section">
              <h3>Application status</h3>
              <span
                className={`fa-status ${statusClass(selected.status)}`}
              >
                {selected.status}
              </span>
            </div>

            {selected.status !== "Rejected" && (
              <div className="fa-modal-actions">
                <button
                  className="fa-approve-btn"
                  onClick={() => changeStatus(selected.id, "Shortlisted")}
                >
                  Shortlist candidate
                </button>
                <button
                  className="fa-reject-btn"
                  onClick={() => changeStatus(selected.id, "Rejected")}
                >
                  Reject application
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}