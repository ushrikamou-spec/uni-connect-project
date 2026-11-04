"use client";

import { useCallback, useEffect, useState } from "react";
import "./student-counselling.css";
import "./my-sessions.css";

function formatDate(value) {
  return new Date(value + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(value) {
  return new Date(value + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(value) {
  const [h, m] = value.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function statusClass(status) {
  if (status === "Approved") return "counselling-status-approved";
  if (status === "On hold") return "counselling-status-hold";
  if (status === "Rejected") return "counselling-status-rejected";
  return "counselling-status-pending";
}

export default function StudentCounselling() {
  const [dates, setDates] = useState([]);
  const [date, setDate] = useState("");
  const [counsellors, setCounsellors] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pending, setPending] = useState(null); // { counsellor, slot }
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  const loadAvailability = useCallback(async (wantedDate) => {
    setLoadError("");
    try {
      const query = wantedDate ? `?date=${encodeURIComponent(wantedDate)}` : "";
      const response = await fetch(`/api/counselling/availability${query}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load times.");
      setDates(data.dates);
      setDate(data.date || "");
      setCounsellors(data.counsellors);
    } catch (error) {
      setLoadError(error.message || "Could not load times.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMySessions = useCallback(async () => {
    try {
      const response = await fetch("/api/appointments");
      const data = await response.json();
      if (response.ok) setMySessions(data.appointments);
    } catch {
      // the list is a convenience; ignore errors here
    }
  }, []);

  useEffect(() => {
    loadAvailability();
    loadMySessions();
  }, [loadAvailability, loadMySessions]);

  function changeDate(value) {
    setDate(value);
    loadAvailability(value);
  }

  async function confirmBooking() {
    if (!pending || submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          counsellorId: pending.counsellor.id,
          date,
          start: pending.slot.start,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setNotice(
          `Request sent to ${pending.counsellor.name} for ${formatTime(pending.slot.start)} on ${formatDate(date)}. It is waiting for approval.`
        );
      } else {
        setNotice(data.error || "Could not book that slot.");
      }
    } catch {
      setNotice("Something went wrong. Please try again.");
    } finally {
      setPending(null);
      setSubmitting(false);
      // Refresh so the slot shows its real, current state.
      loadAvailability(date);
      loadMySessions();
    }
  }

  return (
    <main className="counselling-page">
      <section className="counselling-intro">
        <span className="counselling-eyebrow">Student portal</span>
        <h1>Student Counselling</h1>
        <p>
          Choose a date to see counsellor availability and request a time that
          works for you. A counsellor will approve or decline your request.
        </p>
      </section>

      <section className="counselling-panel">
        <div className="counselling-panel-heading">
          <div className="counselling-icon">▦</div>
          <div>
            <h2>Choose a counselling date</h2>
            <p>Select a date to view the available counsellors and session times.</p>
          </div>
        </div>

        <div className="counselling-date-field">
          <label htmlFor="counselling-date">Counselling date</label>
          <select
            id="counselling-date"
            value={date}
            onChange={(event) => changeDate(event.target.value)}
            disabled={loading || dates.length === 0}
          >
            {dates.map((item) => (
              <option key={item} value={item}>
                {formatDate(item)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {loading && (
        <section className="counselling-panel">
          <p>Loading available times...</p>
        </section>
      )}

      {loadError && (
        <section className="counselling-panel">
          <p role="alert">{loadError}</p>
        </section>
      )}

      {!loading && !loadError && counsellors.length === 0 && (
        <section className="counselling-panel">
          <p>No counsellors are available in the next two weeks.</p>
        </section>
      )}

      {counsellors.map((counsellor) => {
        const availableCount = counsellor.slots.filter((s) => s.available).length;

        return (
          <section className="counselling-panel" key={counsellor.id}>
            <div className="counsellor-head">
              <div className="counselling-avatar">{counsellor.initials}</div>
              <div className="counsellor-info">
                <h2>{counsellor.name}</h2>
                <p>Student Counsellor · {counsellor.specialty}</p>
              </div>
              <span className="counselling-availability">
                {availableCount} slots available
              </span>
            </div>

            <div className="counselling-slots-heading">
              <h3>Session time slots</h3>
              <span>{formatDate(date)}</span>
            </div>

            <div className="counselling-slot-list">
              {counsellor.slots.map((slot) => (
                <div
                  className="counselling-slot-row"
                  key={`${counsellor.id}|${slot.start}`}
                >
                  <div className="counselling-slot-time">
                    <div className="counselling-time-icon">◷</div>
                    <div>
                      <strong>
                        {formatTime(slot.start)} – {formatTime(slot.end)}
                      </strong>
                      <span>30-minute counselling session</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!slot.available}
                    className={
                      slot.available
                        ? "counselling-book-btn"
                        : "counselling-unavailable-btn"
                    }
                    onClick={() => setPending({ counsellor, slot })}
                  >
                    {slot.available
                      ? "Book Now"
                      : slot.mine
                        ? "Your booking"
                        : "Slot not available"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <section className="counselling-panel">
        <div className="counselling-slots-heading">
          <h3>My counselling requests</h3>
          <span>{mySessions.length} total</span>
        </div>

        {mySessions.length === 0 ? (
          <p className="counselling-hint">You have not booked any sessions yet.</p>
        ) : (
          <div className="counselling-session-list">
            {mySessions.map((item) => (
              <div className="counselling-session-row" key={item.id}>
                <div>
                  <strong>{item.counsellorName}</strong>
                  <span>
                    {formatShortDate(item.date)} · {formatTime(item.start)} –{" "}
                    {formatTime(item.end)}
                  </span>
                </div>
                <span className={`counselling-status ${statusClass(item.status)}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {notice && (
        <div className="counselling-notice" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")}>
            ×
          </button>
        </div>
      )}

      {pending && (
        <div
          className="counselling-modal-backdrop"
          onClick={() => !submitting && setPending(null)}
        >
          <section
            className="counselling-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="counselling-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="counselling-modal-title">Confirm counselling session</h2>
            <p>
              Request a session with {pending.counsellor.name} on{" "}
              {formatDate(date)} from {formatTime(pending.slot.start)} to{" "}
              {formatTime(pending.slot.end)}?
            </p>
            <p className="counselling-modal-hint">
              The counsellor will approve or decline your request. You can
              follow its status under "My counselling requests".
            </p>
            <div className="counselling-modal-actions">
              <button
                className="counselling-cancel-btn"
                type="button"
                onClick={() => setPending(null)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="counselling-confirm-btn"
                type="button"
                onClick={confirmBooking}
                disabled={submitting}
              >
                {submitting ? "Booking..." : "Confirm booking"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}