
"use client";

import { useEffect, useRef, useState } from "react";
import "./faculty-profile.css";

const INITIAL_PROFILE = {
  name: "Alex Morgan",
  gender: "Not provided",
  initials: "AM",
  email: "faculty@example.edu",
  department: "Computer Science & Engineering",
  departmentDescription:
    "Teaching, research, and academic advising within the department.",
  contact: "01700000000",
  officeHours: "Sun–Thu, 10:00 AM–12:00 PM",
};

export default function FacultyProfilePage() {
  const [profileImage, setProfileImage] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [contactVisible, setContactVisible] = useState(false);
  const [notice, setNotice] = useState("");
  const fileInputRef = useRef(null);
  const noticeTimerRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(noticeTimerRef.current);
  }, []);

  function showNotice(message) {
    window.clearTimeout(noticeTimerRef.current);
    setNotice(message);

    noticeTimerRef.current = window.setTimeout(() => {
      setNotice("");
    }, 3000);
  }

  function handlePhoto(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotice("Please choose an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
        setPhotoName(file.name);
        showNotice("Profile picture preview updated in this browser.");
      }
    };

    reader.onerror = () => {
      showNotice("Could not read this image. Please try another file.");
    };

    reader.readAsDataURL(file);
  }

  function handleFileChange(event) {
    handlePhoto(event.target.files?.[0]);
  }

  function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove("fprof-dragover");
    handlePhoto(event.dataTransfer.files?.[0]);
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add("fprof-dragover");
  }

  function handleDragLeave(event) {
    event.currentTarget.classList.remove("fprof-dragover");
  }

  function resetDemo() {
    setProfileImage("");
    setPhotoName("");
    setContactVisible(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    showNotice("Faculty profile demo reset.");
  }

  function saveProfile() {
    showNotice(
      "Profile preview is ready. Saving to an account requires a backend."
    );
  }

  function handleCreateProject() {
    showNotice("The Create Project page can be connected when it is ready.");
  }

  function handleApplications() {
    showNotice("The Applications page can be connected when it is ready.");
  }

  function handleLogout() {
    showNotice("Sign-out will work when authentication is connected.");
  }

  return (
    <div className="faculty-profile-page">
      <main className="fprof-main">
        <section className="fprof-intro">
          <div className="fprof-eyebrow">Faculty portal</div>

          <h1>Faculty Profile</h1>

          <p className="fprof-intro-text">
            Share your academic background and contact information with
            the uni-connect community.
          </p>
        </section>

        <div className="fprof-layout">
          <aside className="fprof-sidebar">
            <section className="fprof-panel">
              <h2>Profile picture</h2>

              <p className="fprof-panel-subtitle">
                Add a photo so students and colleagues can recognize you.
              </p>

              <div
                className="fprof-dropzone"
                role="button"
                tabIndex={0}
                aria-label="Upload profile picture"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="fprof-avatar">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile preview" />
                  ) : (
                    <span>{INITIAL_PROFILE.initials}</span>
                  )}
                </div>

                <strong>
                  {photoName || "Drop your photo here"}
                </strong>

                <span>or choose a picture from your device</span>

                <span className="fprof-upload-btn">Upload picture</span>
              </div>

              <input
                ref={fileInputRef}
                className="fprof-hidden-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                aria-label="Choose a profile picture"
              />

              <p className="fprof-helper fprof-centered">
                JPG, PNG, or WEBP · Preview stays in this browser.
              </p>
            </section>
          </aside>

          <div className="fprof-content">
            <section className="fprof-panel">
              <div className="fprof-section-heading">
                <h2>Personal information</h2>
              </div>

              <div className="fprof-grid">
                <div className="fprof-field">
                  <span className="fprof-field-label">Full name</span>
                  <div className="fprof-field-value">
                    {INITIAL_PROFILE.name}
                  </div>
                </div>

                <div className="fprof-field">
                  <span className="fprof-field-label">Gender</span>
                  <div className="fprof-field-value">
                    {INITIAL_PROFILE.gender}
                  </div>
                </div>

                <div className="fprof-field">
                  <span className="fprof-field-label">Faculty Initial</span>
                  <div className="fprof-field-value">
                    {INITIAL_PROFILE.initials}
                  </div>
                </div>

                <div className="fprof-field">
                  <span className="fprof-field-label">Email address</span>
                  <div className="fprof-field-value">
                    {INITIAL_PROFILE.email}
                  </div>
                </div>

                <div className="fprof-field">
                  <span className="fprof-field-label">Department</span>
                  <div className="fprof-field-value">
                    {INITIAL_PROFILE.department}
                  </div>

                  <p className="fprof-field-description">
                    {INITIAL_PROFILE.departmentDescription}
                  </p>
                </div>

                <div className="fprof-field">
                  <span className="fprof-field-label">
                    Contact number
                  </span>

                  <div className="fprof-contact-line">
                    <span className="fprof-field-value">
                      {contactVisible
                        ? INITIAL_PROFILE.contact
                        : "••••••••••"}
                    </span>

                    <button
                      className="fprof-visibility-toggle"
                      type="button"
                      aria-pressed={contactVisible}
                      onClick={() =>
                        setContactVisible((previous) => !previous)
                      }
                    >
                      <span aria-hidden="true">
                        {contactVisible ? "◎" : "◉"}
                      </span>
                      {contactVisible ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="fprof-field">
                  <span className="fprof-field-label">Office hours</span>
                  <div className="fprof-field-value">
                    {INITIAL_PROFILE.officeHours}
                  </div>
                </div>
              </div>

              <p className="fprof-helper fprof-info-note">
                Sample profile information for the prototype. Faculty
                account data can be connected later.
              </p>
            </section>

            <div className="fprof-save-row">
              <button
                className="fprof-secondary-btn"
                type="button"
                onClick={resetDemo}
              >
                Reset demo
              </button>

              <button
                className="fprof-primary-btn"
                type="button"
                onClick={saveProfile}
              >
                Save profile
              </button>
            </div>
          </div>
        </div>

        <section className="fprof-prototype-links">
          <span>Faculty quick links</span>

          <button type="button" onClick={handleCreateProject}>
            Create new project
          </button>

          <button type="button" onClick={handleApplications}>
            Applications
          </button>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </section>
      </main>

      {notice && (
        <div className="fprof-notice" role="status" aria-live="polite">
          <span className="fprof-notice-check" aria-hidden="true">
            ✓
          </span>

          <span>{notice}</span>

          <button
            type="button"
            className="fprof-notice-close"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
