
"use client";

import { useEffect, useState } from "react";
import "./faculty-portal.css";

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: "Smart Campus Navigation System",
    type: "CSE499 · Capstone",
    domain: "Web & Accessibility",
    status: "ongoing",
    description:
      "Develop an accessible campus navigation system to help students navigate campus facilities.",
    applicants: 12,
  },
  {
    id: 2,
    title: "Bangla Natural Language Processing",
    type: "Research opening",
    domain: "AI & Machine Learning",
    status: "pending",
    description:
      "Explore language models and natural language processing techniques for Bangla.",
    applicants: 8,
  },
  {
    id: 3,
    title: "Student Wellbeing Companion App",
    type: "CSE499 · Capstone",
    domain: "Web Development",
    status: "complete",
    description:
      "Create a companion application that connects students with wellbeing resources and support.",
    applicants: 16,
  },
  {
    id: 4,
    title: "Computer Vision Research Assistant",
    type: "Research assistantship",
    domain: "AI & Machine Learning",
    status: "ongoing",
    description:
      "Assist with image classification research, dataset preparation, and model evaluation.",
    applicants: 5,
  },
  {
    id: 5,
    title: "Smart Energy Monitoring",
    type: "CSE299 · Capstone",
    domain: "IoT & Embedded Systems",
    status: "pending",
    description:
      "Build an IoT-based system to monitor energy usage and visualize consumption patterns.",
    applicants: 9,
  },
  {
    id: 6,
    title: "Phishing Detection and Cybersecurity",
    type: "Research opening",
    domain: "Cybersecurity",
    status: "ongoing",
    description:
      "Investigate techniques for identifying phishing links and suspicious messages.",
    applicants: 7,
  },
];

const STATUS_LABELS = {
  pending: "Pending",
  ongoing: "Ongoing",
  complete: "Complete",
};

const PROJECT_TYPES = [
  "CSE499 · Capstone",
  "CSE299 · Capstone",
  "Research opening",
  "Research assistantship",
];

const DOMAINS = [
  "Web & Accessibility",
  "Web Development",
  "AI & Machine Learning",
  "Cybersecurity",
  "IoT & Embedded Systems",
  "Other",
];

const EMPTY_FORM = {
  title: "",
  type: "Research opening",
  domain: "AI & Machine Learning",
  status: "pending",
  description: "",
};

export default function FacultyPortalPage() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [archivedProjects, setArchivedProjects] = useState([]);

  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return undefined;

    const timer = window.setTimeout(() => {
      setNotice("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!showModal) return undefined;

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showModal]);

  const filteredProjects = projects.filter((project) => {
    const searchableContent = [
      project.title,
      project.type,
      project.domain,
      project.description,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableContent.includes(
      search.trim().toLowerCase()
    );

    const matchesDomain =
      domainFilter === "all" || project.domain === domainFilter;

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    return matchesSearch && matchesDomain && matchesStatus;
  });

  function openCreateModal() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  }

  function openEditModal(project) {
    setEditingId(project.id);

    setForm({
      title: project.title,
      type: project.type,
      domain: project.domain,
      status: project.status,
      description: project.description,
    });

    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSaveProject(event) {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      setNotice("Please enter a project title.");
      return;
    }

    if (editingId !== null) {
      setProjects((previous) =>
        previous.map((project) =>
          project.id === editingId
            ? { ...project, ...form, title }
            : project
        )
      );

      setNotice("Project updated successfully.");
    } else {
      const newProject = {
        ...form,
        title,
        id: Date.now(),
        applicants: 0,
      };

      setProjects((previous) => [newProject, ...previous]);
      setNotice("Project created successfully.");
    }

    closeModal();
  }

  function archiveProject(project) {
    const confirmed = window.confirm(
      `Are you sure you want to archive "${project.title}"?`
    );

    if (!confirmed) return;

    setProjects((previous) =>
      previous.filter((item) => item.id !== project.id)
    );

    setArchivedProjects((previous) => [
      project,
      ...previous.filter((item) => item.id !== project.id),
    ]);

    setNotice("Project moved to archived projects.");
  }

  function restoreProject(project) {
    setArchivedProjects((previous) =>
      previous.filter((item) => item.id !== project.id)
    );

    setProjects((previous) => [project, ...previous]);

    setNotice("Project restored successfully.");
  }

  function clearFilters() {
    setSearch("");
    setDomainFilter("all");
    setStatusFilter("all");
  }

  return (
    <div className="faculty-portal-page">
      <main className="fp-main">
        <div className="fp-eyebrow">Faculty portal</div>

        <header className="fp-heading">
          <div className="fp-heading-copy">
            <h1>My Projects &amp; Research</h1>
            <p>
              Manage the projects, research openings, and opportunities
              under your supervision.
            </p>
          </div>

          <button
            type="button"
            className="fp-primary"
            onClick={openCreateModal}
          >
            <span aria-hidden="true">＋</span> Create new project
          </button>
        </header>

        <section className="fp-toolbar" aria-label="Project search">
          <div className="fp-search-wrap">
            <span className="fp-search-icon" aria-hidden="true">
              ⌕
            </span>

            <input
              className="fp-search"
              type="search"
              placeholder="Search projects..."
              aria-label="Search projects"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <button
            type="button"
            className="fp-secondary"
            onClick={() => setShowFilters((previous) => !previous)}
            aria-expanded={showFilters}
          >
            <span aria-hidden="true">☷</span> Filters
            {(domainFilter !== "all" || statusFilter !== "all") && (
              <span className="fp-filter-count">Active</span>
            )}
          </button>
        </section>

        {showFilters && (
          <section className="fp-filters">
            <label>
              <span>Domain</span>
              <select
                value={domainFilter}
                onChange={(event) => setDomainFilter(event.target.value)}
              >
                <option value="all">All domains</option>
                {DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Project status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All statuses</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="fp-clear"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </section>
        )}

        <section className="fp-project-section">
          <div className="fp-section-heading">
            <div>
              <h2>Projects</h2>
              <p>Manage your active and completed opportunities.</p>
            </div>

            <span className="fp-total">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "project" : "projects"}
            </span>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="fp-grid">
              {filteredProjects.map((project) => (
                <article className="fp-card" key={project.id}>
                  <div className="fp-card-top">
                    <span className="fp-tag">{project.type}</span>

                    <button
                      type="button"
                      className="fp-archive"
                      onClick={() => archiveProject(project)}
                      aria-label={`Archive ${project.title}`}
                    >
                      Archive
                    </button>
                  </div>

                  <h3>{project.title}</h3>

                  <span className={`fp-status ${project.status}`}>
                    <span className="fp-status-dot" aria-hidden="true" />
                    {STATUS_LABELS[project.status]}
                  </span>

                  <p className="fp-description">
                    {project.description}
                  </p>

                  <div className="fp-meta">
                    <div>
                      <small>Domain</small>
                      <span>{project.domain}</span>
                    </div>

                    <div>
                      <small>Applicants</small>
                      <span className="fp-applicant-count">
                        <span aria-hidden="true">♙</span>{" "}
                        {project.applicants}
                      </span>
                    </div>
                  </div>

                  <div className="fp-card-actions">
                    <button
                      type="button"
                      className="fp-secondary fp-edit"
                      onClick={() => openEditModal(project)}
                    >
                      Edit project
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="fp-empty">
              <div className="fp-empty-icon" aria-hidden="true">
                ⌕
              </div>
              <h3>No matching projects found</h3>
              <p>
                Try a different search term or change your filters.
              </p>
              <button
                type="button"
                className="fp-secondary"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {archivedProjects.length > 0 && (
          <section className="fp-archived">
            <div className="fp-section-heading">
              <div>
                <h2>Archived projects</h2>
                <p>Projects you have archived.</p>
              </div>
              <span className="fp-total">
                {archivedProjects.length} archived
              </span>
            </div>

            <div className="fp-grid">
              {archivedProjects.map((project) => (
                <article className="fp-card fp-card-archived" key={project.id}>
                  <div className="fp-card-top">
                    <span className="fp-tag">Archived</span>
                  </div>

                  <h3>{project.title}</h3>
                  <p className="fp-description">
                    {project.description}
                  </p>

                  <button
                    type="button"
                    className="fp-secondary fp-edit"
                    onClick={() => restoreProject(project)}
                  >
                    Restore project
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {showModal && (
        <div
          className="fp-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            className="fp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fp-modal-title"
          >
            <button
              type="button"
              className="fp-modal-close"
              onClick={closeModal}
              aria-label="Close dialog"
            >
              ×
            </button>

            <div className="fp-modal-heading">
              <span className="fp-modal-icon" aria-hidden="true">
                {editingId !== null ? "✎" : "＋"}
              </span>

              <div>
                <h2 id="fp-modal-title">
                  {editingId !== null
                    ? "Edit project"
                    : "Create new project"}
                </h2>
                <p className="fp-modal-description">
                  {editingId !== null
                    ? "Update your project information below."
                    : "Add a project or research opportunity for students."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProject}>
              <label className="fp-form-field">
                <span>Project title <span className="fp-required">*</span></span>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  placeholder="Enter project title"
                  required
                  autoFocus
                />
              </label>

              <label className="fp-form-field">
                <span>Project type</span>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                >
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="fp-form-field">
                <span>Domain</span>
                <select
                  name="domain"
                  value={form.domain}
                  onChange={handleInputChange}
                >
                  {DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </label>

              <label className="fp-form-field">
                <span>Status</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="fp-form-field">
                <span>Description</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Describe the project and its objectives..."
                  rows={4}
                />
              </label>

              <div className="fp-modal-actions">
                <button
                  type="button"
                  className="fp-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="fp-primary">
                  {editingId !== null ? "Save changes" : "Create project"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {notice && (
        <div className="fp-notice" role="status" aria-live="polite">
          <span className="fp-notice-icon" aria-hidden="true">
            ✓
          </span>
          {notice}
          <button
            type="button"
            className="fp-notice-close"
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
