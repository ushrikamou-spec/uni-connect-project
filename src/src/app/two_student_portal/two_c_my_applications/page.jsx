
"use client";

import { useMemo, useState } from "react";
import "./my-applications.css";

const initialApplications = [
  {
    id: "APP-2026-1042",
    title: "Smart Campus Navigation System",
    initials: "SC",
    category: "CSE499 · Capstone",
    faculty: "AR",
    date: "2026-10-12",
    status: "pending",
    message: "Your application is awaiting review.",
  },
  {
    id: "APP-2026-1036",
    title: "Bangla Natural Language Processing",
    initials: "BN",
    category: "Research",
    faculty: "SN",
    date: "2026-10-08",
    status: "shortlisted",
    message: "Congratulations! Your application has been shortlisted. Watch for further updates.",
  },
  {
    id: "APP-2026-1021",
    title: "Student Wellbeing Companion App",
    initials: "SW",
    category: "CSE499 · Capstone",
    faculty: "FH",
    date: "2026-10-03",
    status: "approved",
    message: "Your application has been approved. Contact the faculty supervisor for next steps.",
  },
  {
    id: "APP-2026-0994",
    title: "Computer Vision Research Assistant",
    initials: "CV",
    category: "Assistantship",
    faculty: "MK",
    date: "2026-09-27",
    status: "rejected",
    message: "This application was not selected. You can explore other opportunities and apply again.",
  },
  {
    id: "APP-2026-0972",
    title: "Smart Energy Monitoring",
    initials: "SE",
    category: "CSE299 · Capstone",
    faculty: "TA",
    date: "2026-09-21",
    status: "pending",
    message: "Your application is awaiting review.",
  },
];

const statusLabels = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  approved: "Approved",
};

function formatDate(dateString) {
  return new Date(dateString + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState(initialApplications);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications
      .filter((app) => {
        const matchesSearch = [
          app.title,
          app.id,
          app.category,
          app.faculty,
          app.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

        return matchesSearch && (status === "all" || app.status === status);
      })
      .sort((a, b) => {
        if (sort === "title") return a.title.localeCompare(b.title);
        if (sort === "oldest") return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date);
      });
  }, [applications, search, status, sort]);

  function closeModal() {
    setShowModal(false);
    setTitle("");
    setNote("");
  }

  function clearFilters() {
    setSearch("");
    setStatus("all");
    setSort("recent");
  }

  function createApplication(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    const today = new Date();
    const isoDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    const initials = cleanTitle
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    const newApplication = {
      id: `APP-${Date.now().toString().slice(-7)}`,
      title: cleanTitle,
      initials,
      category: "New application",
      faculty: "Not assigned",
      date: isoDate,
      status: "pending",
      message: note.trim()
        ? `Your note: ${note.trim()}. Your application is awaiting review.`
        : "Your application is awaiting review.",
    };

    setApplications((previous) => [newApplication, ...previous]);
    clearFilters();
    closeModal();
    setNotice("Application created in this demo. It has not been saved to a database.");
  }

  return (
    <main className="my-applications-page">
      <section className="applications-heading">
        <div>
          <span className="applications-eyebrow">Student portal</span>
          <h1>My Applications</h1>
          <p>Track your applications and stay up to date on every decision.</p>
        </div>

        <div className="applications-count">
          {filteredApplications.length}{" "}
          {filteredApplications.length === 1 ? "application" : "applications"}
        </div>
      </section>

      <section className="applications-search-panel">
        <div className="applications-search-wrap">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search applications..."
            aria-label="Search applications"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <button
          type="button"
          className="applications-filter-button"
          aria-expanded={showFilters}
          onClick={() => setShowFilters((value) => !value)}
        >
          ☷ Filter
        </button>

        <button
          type="button"
          className="applications-primary-button"
          onClick={() => setShowModal(true)}
        >
          ＋ New application
        </button>
      </section>

      {showFilters && (
        <section className="applications-filters">
          <div>
            <label htmlFor="application-status">Application status</label>
            <select
              id="application-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="approved">Approved</option>
            </select>
          </div>

          <div>
            <label htmlFor="application-sort">Sort by</label>
            <select
              id="application-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="recent">Most recent</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Application name</option>
            </select>
          </div>

          <button
            type="button"
            className="applications-clear-button"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        </section>
      )}

      <section className="applications-list" aria-label="Student applications">
        {filteredApplications.map((app) => (
          <article className="application-card" key={app.id}>
            <div className="application-card-icon">{app.initials}</div>

            <div className="application-card-info">
              <div className="application-card-meta">
                <span className="application-category">{app.category}</span>
                <span className="application-submitted">
                  Submitted {formatDate(app.date)}
                </span>
              </div>

              <h2>{app.title}</h2>

              <p>
                Faculty: <strong>{app.faculty}</strong>
                <span className="application-meta-dot"> · </span>
                Application ID: <strong>{app.id}</strong>
              </p>
            </div>

            <div className="application-card-side">
              <span className={`application-status ${app.status}`}>
                <span />
                {statusLabels[app.status]}
              </span>

              <button
                type="button"
                className="application-details-button"
                onClick={() => setSelectedApplication(app)}
              >
                View details
              </button>
            </div>
          </article>
        ))}

        {filteredApplications.length === 0 && (
          <div className="applications-empty-state">
            <strong>No applications found</strong>
            <p>Try another search or adjust your filters.</p>
            <button
              type="button"
              className="applications-clear-button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {showModal && (
        <div
          className="applications-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="applications-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-application-title"
          >
            <button
              type="button"
              className="applications-modal-close"
              aria-label="Close dialog"
              onClick={closeModal}
            >
              ×
            </button>

            <span className="applications-eyebrow">Student portal</span>
            <h2 id="new-application-title">New application</h2>
            <p className="applications-modal-intro">
              Start an application by choosing an opportunity and adding a short note.
            </p>

            <form onSubmit={createApplication}>
              <label htmlFor="opportunity-name">Opportunity name</label>
              <input
                id="opportunity-name"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                placeholder="e.g. Research assistantship"
              />

              <label htmlFor="application-note">
                Why are you interested?{" "}
                <span className="applications-optional">(optional)</span>
              </label>
              <textarea
                id="application-note"
                rows={3}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Briefly describe your interest..."
              />

              <div className="applications-modal-actions">
                <button
                  type="button"
                  className="applications-clear-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="applications-primary-button">
                  Create application
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {selectedApplication && (
        <div
          className="applications-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedApplication(null);
            }
          }}
        >
          <section
            className="applications-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-details-title"
          >
            <button
              type="button"
              className="applications-modal-close"
              aria-label="Close dialog"
              onClick={() => setSelectedApplication(null)}
            >
              ×
            </button>

            <span className="applications-eyebrow">Application details</span>
            <h2 id="application-details-title">
              {selectedApplication.title}
            </h2>
            <p className="applications-modal-intro">
              Application ID: {selectedApplication.id}
            </p>

            <div className="application-detail-row">
              <strong>Status</strong>
              <span className={`application-status ${selectedApplication.status}`}>
                <span />
                {statusLabels[selectedApplication.status]}
              </span>
            </div>

            <div className="application-detail-row">
              <strong>Submitted</strong>
              <span>{formatDate(selectedApplication.date)}</span>
            </div>

            <div className="application-detail-row">
              <strong>Faculty</strong>
              <span>{selectedApplication.faculty}</span>
            </div>

            <p className="application-detail-message">
              {selectedApplication.message}
            </p>

            <div className="applications-modal-actions">
              <button
                type="button"
                className="applications-primary-button"
                onClick={() => setSelectedApplication(null)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}

      {notice && (
        <div className="applications-notice" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notice">
            ×
          </button>
        </div>
      )}
    </main>
  );
}
