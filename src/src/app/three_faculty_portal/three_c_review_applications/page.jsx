
"use client";

import { useMemo, useState, useEffect } from "react";
import "./faculty-applications.css";

const initialApplications = [
  {
    id: 1,
    name: "Maya Rahman",
    project: "AI-Powered Student Support",
    status: "Pending",
    cgpa: 3.88,
    match: 94,
    date: 6,
    sop: "I am interested in building practical AI tools that make student support more accessible. My coursework in machine learning and experience with a campus chatbot project have motivated me to contribute to research that connects technical work with real student needs.",
    skills: ["Python", "Machine Learning", "Natural Language Processing", "Research"],
    email: "maya.rahman@example.edu",
    year: "3rd year, Computer Science & Engineering",
  },
  {
    id: 2,
    name: "Tanvir Hasan",
    project: "Sustainable Campus Energy Study",
    status: "Under review",
    cgpa: 3.72,
    match: 87,
    date: 5,
    sop: "I would like to explore data-driven ways to reduce energy consumption across campus. I have worked with sensor datasets and enjoy turning analysis into recommendations that can be tested and measured.",
    skills: ["Data Analysis", "Python", "Statistics", "Sustainability"],
    email: "tanvir.hasan@example.edu",
    year: "4th year, Electrical & Electronic Engineering",
  },
  {
    id: 3,
    name: "Nadia Islam",
    project: "Accessible Learning Interfaces",
    status: "Shortlisted",
    cgpa: 3.95,
    match: 91,
    date: 4,
    sop: "My goal is to design digital learning experiences that work for students with different accessibility needs. I have conducted usability tests in a student design group and would value the chance to apply user-centred methods in a research setting.",
    skills: ["UI/UX Design", "Accessibility", "Figma", "User Research"],
    email: "nadia.islam@example.edu",
    year: "3rd year, Software Engineering",
  },
  {
    id: 4,
    name: "Rafi Ahmed",
    project: "AI-Powered Student Support",
    status: "Pending",
    cgpa: 3.61,
    match: 78,
    date: 3,
    sop: "I am applying because I want to gain hands-on research experience in applied machine learning. I have completed projects involving text classification and am keen to learn more about evaluation, responsible AI, and collaboration.",
    skills: ["Python", "Text Classification", "Git", "Teamwork"],
    email: "rafi.ahmed@example.edu",
    year: "2nd year, Computer Science & Engineering",
  },
  {
    id: 5,
    name: "Sadia Chowdhury",
    project: "Sustainable Campus Energy Study",
    status: "Under review",
    cgpa: 3.84,
    match: 89,
    date: 2,
    sop: "I am excited by research that combines environmental impact with quantitative analysis. My academic projects have focused on interpreting data clearly, and I would like to help identify realistic improvements to campus energy use.",
    skills: ["Excel", "Data Visualization", "Statistics", "Report Writing"],
    email: "sadia.chowdhury@example.edu",
    year: "4th year, Environmental Science",
  },
  {
    id: 6,
    name: "Imran Kabir",
    project: "Accessible Learning Interfaces",
    status: "Pending",
    cgpa: 3.54,
    match: 73,
    date: 1,
    sop: "I hope to contribute front-end development skills while learning how accessibility standards are applied in real products. I have built several small web interfaces and am eager to improve them through feedback and structured testing.",
    skills: ["HTML", "CSS", "JavaScript", "Prototyping"],
    email: "imran.kabir@example.edu",
    year: "2nd year, Information Technology",
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
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2800);
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

  const visibleApplications = useMemo(() => {
    const term = search.trim().toLowerCase();

    const filtered = applications.filter((a) => {
      const matchesStatus =
        statusFilter === "all" || a.status === statusFilter;

      const searchable = [
        a.name,
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

  return (
    <div className="faculty-applications-page">
      <main className="fa-main">
        <section className="fa-intro">
          <span className="fa-eyebrow">Faculty portal</span>
          <h1>Review Applications</h1>
          <p>
            Review student applications, compare their experience and fit,
            and decide who moves forward.
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

          <div className="fa-stat">
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
                placeholder="Search students or projects..."
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
                        {application.name}
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
                      onClick={() => setSelected(application)}
                    >
                      View details ↗
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
                        Approve
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
                <span className="fa-modal-eyebrow">Application details</span>
                <h2 id="fa-modal-title">{selected.name}</h2>
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
              <h3>Statement of purpose</h3>
              <p>{selected.sop}</p>
            </div>

            <div className="fa-modal-section">
              <h3>Student profile</h3>
              <p>{selected.year}</p>
              <p>
                <a href={`mailto:${selected.email}`}>{selected.email}</a>
              </p>
              <p>
                CGPA: {selected.cgpa.toFixed(2)} / 4.00
                {" · "}
                Skill match: {selected.match}%
              </p>
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
                  Approve application
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
