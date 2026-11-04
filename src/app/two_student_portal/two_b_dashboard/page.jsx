
"use client";

import { useMemo, useState } from "react";
import "./student-dashboard.css";
import ApplyModal from "../two_d_apply_modal/ApplyModal";

const opportunities = [
  {
    type: "capstone",
    faculty: "AR",
    tag: "CSE499 · Capstone",
    title: "Smart Campus Navigation System",
    description:
      "Build an accessible campus navigation tool with interactive maps and location-aware guidance.",
    details:
      "Build an accessible campus navigation tool with interactive maps and location-aware guidance.",
  },
  {
    type: "research",
    faculty: "SN",
    tag: "Research",
    title: "Bangla Natural Language Processing",
    description:
      "Explore language models and practical NLP methods for Bangla text understanding.",
    details:
      "Explore language models and practical NLP methods for Bangla text understanding.",
  },
  {
    type: "capstone",
    faculty: "FH",
    tag: "CSE499 · Capstone",
    title: "Student Wellbeing Companion App",
    description:
      "Design a student-centered app for wellbeing resources, habits, and supportive check-ins.",
    details:
      "Design an app focused on wellbeing resources, healthy habits, and supportive check-ins.",
  },
  {
    type: "assistantship",
    faculty: "MK",
    tag: "Assistantship",
    title: "Computer Vision Research Assistant",
    description:
      "Assist with image classification experiments, dataset preparation, and model evaluation.",
    details:
      "Help conduct image classification experiments, prepare datasets, and evaluate models.",
  },
  {
    type: "capstone",
    faculty: "TA",
    tag: "CSE299 · Capstone",
    title: "Smart Energy Monitoring",
    description:
      "Prototype an IoT-based system to monitor energy use and visualize consumption patterns.",
    details:
      "Prototype an IoT-based energy monitoring system and visualize consumption patterns.",
  },
  {
    type: "research",
    faculty: "NS",
    tag: "Research",
    title: "Phishing Detection and Cybersecurity",
    description:
      "Investigate practical techniques for identifying phishing links and suspicious messages.",
    details:
      "Investigate techniques for identifying phishing links and suspicious messages.",
  },
  {
    type: "assistantship",
    faculty: "AR",
    tag: "Assistantship",
    title: "Learning Analytics Research",
    description:
      "Help analyze anonymized learning data to understand student engagement and outcomes.",
    details:
      "Analyze anonymized learning data to understand student engagement and outcomes.",
  },
  {
    type: "capstone",
    faculty: "SN",
    tag: "CSE299 · Capstone",
    title: "Peer Notes Sharing Platform",
    description:
      "Create a well-organized space for students to share, discover, and review course resources.",
    details:
      "Create a platform where students can share, discover, and review course resources.",
  },
  {
    type: "research",
    faculty: "FH",
    tag: "Research",
    title: "Accessible Web Design Study",
    description:
      "Evaluate usability and accessibility patterns to make web experiences more inclusive.",
    details:
      "Evaluate usability and accessibility patterns to create more inclusive web experiences.",
  },
];

const typeLabels = {
  capstone: "Capstone project",
  research: "Research",
  assistantship: "Research assistantship",
};

export default function StudentDashboard() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [faculty, setFaculty] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState(null);
  const [applying, setApplying] = useState(null);
  const [notice, setNotice] = useState("");

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return opportunities.filter((item) => {
      const searchableText = [
        item.title,
        item.description,
        item.faculty,
        item.tag,
        item.type,
      ]
        .join(" ")
        .toLowerCase();

      return (
        searchableText.includes(query) &&
        (type === "all" || item.type === type) &&
        (faculty === "all" || item.faculty === faculty)
      );
    });
  }, [search, type, faculty]);

  function clearFilters() {
    setSearch("");
    setType("all");
    setFaculty("all");
  }

  return (
    <div className="student-dashboard">
      <main className="student-main">
        <section className="student-heading">
          <div>
            <span className="student-eyebrow">Student portal</span>
            <h1>Student Dashboard</h1>
            <p className="student-intro">
              Explore research opportunities, discover capstone projects,
              and find your next collaboration.
            </p>
          </div>

          <div className="student-count">
            {filteredOpportunities.length}{" "}
            {filteredOpportunities.length === 1
              ? "opportunity"
              : "opportunities"}
          </div>
        </section>

        <section className="student-search-panel">
          <div className="student-search-wrap">
            <span className="student-search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects or research..."
              aria-label="Search projects or research"
            />
          </div>

          <button
            className="student-filter-button"
            type="button"
            onClick={() => setShowFilters((previous) => !previous)}
            aria-expanded={showFilters}
          >
            <span aria-hidden="true">☷</span> Filter
          </button>
        </section>

        {showFilters && (
          <section className="student-filter-options">
            <div>
              <label htmlFor="student-type-filter">
                Opportunity type
              </label>
              <select
                id="student-type-filter"
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <option value="all">All opportunities</option>
                <option value="capstone">Capstone project</option>
                <option value="research">Research</option>
                <option value="assistantship">
                  Research assistantship
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="student-faculty-filter">
                Faculty initials
              </label>
              <select
                id="student-faculty-filter"
                value={faculty}
                onChange={(event) => setFaculty(event.target.value)}
              >
                <option value="all">All faculty</option>
                {["AR", "SN", "FH", "MK", "TA", "NS"].map((initial) => (
                  <option key={initial} value={initial}>
                    {initial}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="student-clear-button"
              type="button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </section>
        )}

        <section className="student-cards-grid">
          {filteredOpportunities.map((item) => (
            <article className="student-project-card" key={item.title}>
              <div className="student-card-top">
                <span className="student-tag">{item.tag}</span>
                <span className="student-status">Open</span>
              </div>

              <h2>{item.title}</h2>

              <p className="student-faculty">
                Faculty: <strong>{item.faculty}</strong>
              </p>

              <p className="student-description">{item.description}</p>

              <div className="student-card-actions">
                <button
                  className="student-details-button"
                  type="button"
                  onClick={() => setSelected(item)}
                >
                  Details
                </button>

                <button
                  className="student-apply-button"
                  type="button"
                  onClick={() => setApplying(item)}
                >
                  Apply
                </button>
              </div>
            </article>
          ))}
        </section>

        {filteredOpportunities.length === 0 && (
          <div className="student-empty-state">
            <strong>No matching opportunities found</strong>
            <p>Try a different search term or clear your filters.</p>
            <button
              className="student-details-button"
              type="button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      <footer className="student-footer">
        © 2026 uni-connect · Bringing campus communities together
      </footer>

      {selected && (
        <div
          className="student-modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <section
            className="student-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="student-modal-top">
              <span className="student-tag">{selected.tag}</span>
              <button
                className="student-modal-close"
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            <h2 id="student-modal-title">{selected.title}</h2>

            <p className="student-faculty">
              Faculty: <strong>{selected.faculty}</strong>
            </p>

            <p className="student-description">{selected.details}</p>

            <p className="student-modal-type">
              Opportunity type: {typeLabels[selected.type]}
            </p>

            <button
              className="student-apply-button"
              type="button"
              onClick={() => {
                setApplying(selected);
                setSelected(null);
              }}
            >
              Apply for opportunity
            </button>
          </section>
        </div>
      )}

      {applying && (
        <ApplyModal
          opportunity={applying}
          onClose={() => setApplying(null)}
          onSubmit={() => {
            setNotice(`Your application for "${applying.title}" was submitted.`);
            setApplying(null);
          }}
        />
      )}

      {notice && (
        <div className="student-toast" role="status" aria-live="polite">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}