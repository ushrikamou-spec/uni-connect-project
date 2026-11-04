"use client";

import { useEffect, useState } from "react";
import "./apply-modal.css";

export default function ApplyModal({ opportunity, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [skills, setSkills] = useState("");
  const [error, setError] = useState("");

  // Close with the Escape key.
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();
    if (reason.trim().length < 20) {
      setError("Please write at least 20 characters about why you are interested.");
      return;
    }
    onSubmit({ reason: reason.trim(), skills: skills.trim() });
  }

  return (
    <div className="student-modal-backdrop" onClick={onClose}>
      <section
        className="student-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="student-modal-top">
          <span className="student-tag">{opportunity.tag}</span>
          <button
            className="student-modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close application form"
          >
            ×
          </button>
        </div>

        <h2 id="apply-modal-title">Apply: {opportunity.title}</h2>

        <p className="student-faculty">
          Faculty: <strong>{opportunity.faculty}</strong>
        </p>

        <form className="apply-form" onSubmit={handleSubmit} noValidate>
          <label className="apply-label" htmlFor="apply-reason">
            Why are you interested?
          </label>
          <textarea
            id="apply-reason"
            className="apply-input"
            rows={4}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            placeholder="Tell the faculty member why you are a good fit..."
          />

          <label className="apply-label" htmlFor="apply-skills">
            Relevant skills <span className="apply-optional">(optional)</span>
          </label>
          <input
            id="apply-skills"
            className="apply-input"
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. Python, React, data analysis"
          />

          {error && (
            <p className="apply-error" role="alert">
              {error}
            </p>
          )}

          <div className="apply-actions">
            <button
              className="student-details-button"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="student-apply-button" type="submit">
              Submit application
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}