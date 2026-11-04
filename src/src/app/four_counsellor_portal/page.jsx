"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./counsellor-dashboard.css";

function formatDate(value) {
  return new Date(value + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value) {
  const [h, m] = value.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function statusClass(status) {
  if (status === "Approved") return "cd-approved";
  if (status === "On hold") return "cd-hold";
  if (status === "Rejected") return "cd-rejected";
  return "cd-pending";
}

export default function CounsellorDashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("soonest");
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Load this counsellor's appointment requests from the database.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/appointments");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load appointments.");
        if (!cancelled) setAppointments(data.appointments);
      } catch (error) {
        if (!cancelled) setLoadError(error.message || "Could not load appointments.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function showToast(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2800);
  }

  async function updateStatus(appointment, status) {
    const previous = appointment.status;

    // Show the change straight away, then confirm it with the database.
    setAppointments((current) =>
      current.map((item) =>
        item.id === appointment.id ? { ...item, status } : item
      )
    );

    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save the change.");

      showToast(`${appointment.name}'s appointment marked ${status.toLowerCase()}.`);
    } catch (error) {
      // Put the old status back if the database did not accept the change.
      setAppointments((current) =>
        current.map((item) =>
          item.id === appointment.id ? { ...item, status: previous } : item
        )
      );
      showToast(error.message || "Could not save the change.");
    }
  }

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = appointments.filter(
      (a) =>
        [a.name, a.studentId, a.department, a.cgpa, formatDate(a.date)].some(
          (value) => value.toLowerCase().includes(q)
        ) &&
        (statusFilter === "all" || a.status === statusFilter)
    );

    const key = (a) => a.date + a.start;
    if (sortBy === "latest") {
      filtered.sort((a, b) => key(b).localeCompare(key(a)));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered.sort((a, b) => key(a).localeCompare(key(b)));
    }
    return filtered;
  }, [appointments, query, statusFilter, sortBy]);

  const approvedCount = appointments.filter((a) => a.status === "Approved").length;
  const pendingCount = appointments.filter((a) => a.status === "Pending").length;

  return (
    <div className="cd-page">
      <header className="cd-page-heading">
        <div>
          <div className="cd-eyebrow">Counsellor portal</div>
          <h1>Appointments</h1>
          <p className="cd-subtitle">
            Review student counselling requests and manage your appointment
            schedule.
          </p>
        </div>
        <div className="cd-count-pill">
          {items.length} appointment{items.length === 1 ? "" : "s"}
        </div>
      </header>

      <section className="cd-summary" aria-label="Appointment summary">
        <div className="cd-summary-card">
          <div className="cd-summary-icon">▦</div>
          <div>
            <div className="cd-summary-label">Total requests</div>
            <div className="cd-summary-value">{appointments.length}</div>
          </div>
        </div>
        <div className="cd-summary-card">
          <div className="cd-summary-icon">✓</div>
          <div>
            <div className="cd-summary-label">Approved</div>
            <div className="cd-summary-value">{approvedCount}</div>
          </div>
        </div>
        <div className="cd-summary-card">
          <div className="cd-summary-icon">◷</div>
          <div>
            <div className="cd-summary-label">Awaiting review</div>
            <div className="cd-summary-value">{pendingCount}</div>
          </div>
        </div>
      </section>

      <section aria-label="Appointment requests">
        <div className="cd-toolbar">
          <div className="cd-search-wrap">
            <span aria-hidden="true">⌕</span>
            <input
              className="cd-search"
              type="search"
              placeholder="Search student, ID, or department..."
              aria-label="Search appointments"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="cd-filters">
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="On hold">On hold</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              aria-label="Sort appointments"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="soonest">Soonest first</option>
              <option value="latest">Latest first</option>
              <option value="name">Student name A–Z</option>
            </select>
          </div>
        </div>

        <p className="cd-list-meta">
          Showing {items.length} of {appointments.length} appointment requests
        </p>

        <div className="cd-appointment-list">
          {loading ? (
            <div className="cd-empty-state">
              <strong>Loading appointments...</strong>
            </div>
          ) : loadError ? (
            <div className="cd-empty-state" role="alert">
              <strong>Could not load appointments</strong>
              {loadError}
            </div>
          ) : items.length === 0 ? (
            <div className="cd-empty-state">
              <strong>No appointments found</strong>
              {appointments.length === 0
                ? "Student requests will appear here."
                : "Try changing your search or status filter."}
            </div>
          ) : (
            items.map((a) => (
              <article className="cd-appointment" key={a.id}>
                <div className="cd-appointment-main">
                  <div className="cd-appointment-top">
                    <div className="cd-date-icon" aria-hidden="true">▦</div>
                    <div>
                      <div className="cd-slot-time">
                        {formatTime(a.start)} – {formatTime(a.end)}
                      </div>
                      <div className="cd-slot-date">{formatDate(a.date)}</div>
                    </div>
                    <span className={`cd-status ${statusClass(a.status)}`}>
                      {a.status}
                    </span>
                  </div>

                  <div className="cd-student-panel">
                    <div className="cd-student-name">{a.name}</div>
                    <div className="cd-student-details">
                      <div>
                        <div className="cd-detail-label">Student ID</div>
                        <div className="cd-detail-value">{a.studentId}</div>
                      </div>
                      <div>
                        <div className="cd-detail-label">Department</div>
                        <div className="cd-detail-value">{a.department}</div>
                      </div>
                      <div>
                        <div className="cd-detail-label">CGPA</div>
                        <div className="cd-detail-value">{a.cgpa}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="cd-actions" aria-label={`Actions for ${a.name}`}>
                  <button
                    type="button"
                    className="cd-btn-reject"
                    onClick={() => updateStatus(a, "Rejected")}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="cd-btn-hold"
                    onClick={() => updateStatus(a, "On hold")}
                  >
                    Hold
                  </button>
                  <button
                    type="button"
                    className="cd-btn-approve"
                    onClick={() => updateStatus(a, "Approved")}
                  >
                    Approve
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <div
        className={`cd-toast${toast ? " cd-show" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </div>
  );
}