"use client";

import { useEffect, useRef, useState } from "react";
import "./counsellor-profile.css";

const CONTACT_NUMBER = "01700000000";
const DEFAULT_PHOTO_TITLE = "Drop your photo here";

export default function CounsellorProfilePage() {
  const [photo, setPhoto] = useState(null); // data URL of the chosen picture
  const [photoTitle, setPhotoTitle] = useState(DEFAULT_PHOTO_TITLE);
  const [dragOver, setDragOver] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef(null);
  const photoInput = useRef(null);

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  function showNotice(message) {
    setNotice(message);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 3000);
  }

  function handlePhoto(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showNotice("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
      setPhotoTitle(file.name);
      showNotice("Profile picture preview updated in this browser.");
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) handlePhoto(file);
  }

  function resetDemo() {
    if (photoInput.current) photoInput.current.value = "";
    setPhoto(null);
    setPhotoTitle(DEFAULT_PHOTO_TITLE);
    setContactVisible(false);
    showNotice("Counsellor profile demo reset.");
  }

  return (
    <div className="cp-page">
      <section>
        <div className="cp-eyebrow">Counsellor portal</div>
        <h1>Counsellor Profile</h1>
        <p className="cp-intro">
          Share your academic background and contact information with the
          uni-connect community.
        </p>
      </section>

      <div className="cp-profile-layout">
        <aside>
          <section className="cp-panel">
            <h2>Profile picture</h2>
            <p className="cp-panel-subtitle">
              Add a photo so students and colleagues can recognize you.
            </p>

            <label
              className={`cp-dropzone${dragOver ? " cp-dragover" : ""}`}
              htmlFor="photo-input"
              tabIndex={0}
              role="button"
              aria-label="Upload profile picture"
              onDragEnter={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragOver(false);
              }}
              onDrop={handleDrop}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  photoInput.current?.click();
                }
              }}
            >
              <div className="cp-avatar">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt="Selected profile picture preview" />
                ) : (
                  <span>AM</span>
                )}
              </div>
              <strong>{photoTitle}</strong>
              <span>or choose a picture from your device</span>
              <span className="cp-upload-btn">Upload picture</span>
            </label>

            <input
              className="cp-hidden-input"
              type="file"
              id="photo-input"
              accept="image/*"
              ref={photoInput}
              onChange={(e) => handlePhoto(e.target.files[0])}
            />
            <p className="cp-helper">
              JPG, PNG, or WEBP · Preview stays in this browser.
            </p>
          </section>
        </aside>

        <div>
          <section className="cp-panel">
            <div className="cp-section-heading">
              <h2>Personal information</h2>
            </div>

            <div className="cp-profile-grid">
              <div className="cp-field">
                <span className="cp-field-label">Full name</span>
                <div className="cp-field-value">Alex Morgan</div>
              </div>
              <div className="cp-field">
                <span className="cp-field-label">Gender</span>
                <div className="cp-field-value">Not provided</div>
              </div>
              <div className="cp-field">
                <span className="cp-field-label">Counsellor Initial</span>
                <div className="cp-field-value">AM</div>
              </div>
              <div className="cp-field">
                <span className="cp-field-label">Email address</span>
                <div className="cp-field-value">Counsellor@example.edu</div>
              </div>
              <div className="cp-field">
                <span className="cp-field-label">Department</span>
                <div className="cp-field-value">
                  Computer Science &amp; Engineering
                </div>
                <p className="cp-field-description">
                  Teaching, research, and academic advising within the
                  department.
                </p>
              </div>
              <div className="cp-field">
                <span className="cp-field-label">Contact number</span>
                <div className="cp-contact-line">
                  <span className="cp-field-value">
                    {contactVisible ? CONTACT_NUMBER : "••••••••••"}
                  </span>
                  <button
                    className="cp-visibility-toggle"
                    type="button"
                    aria-pressed={contactVisible}
                    onClick={() => setContactVisible((v) => !v)}
                  >
                    <span>{contactVisible ? "◎" : "◉"}</span>
                    <span>{contactVisible ? "Hide" : "Show"}</span>
                  </button>
                </div>
              </div>
              <div className="cp-field">
                <span className="cp-field-label">Office hours</span>
                <div className="cp-field-value">Sun–Thu, 10:00 AM–12:00 PM</div>
              </div>
            </div>

            <p className="cp-helper" style={{ textAlign: "left", marginTop: 14 }}>
              Sample profile information for the prototype. Counsellor account
              data can be connected later.
            </p>
          </section>

          <div className="cp-save-row">
            <button
              className="cp-secondary-btn"
              type="button"
              onClick={resetDemo}
            >
              Reset demo
            </button>
            <button
              className="cp-primary-btn"
              type="button"
              onClick={() =>
                showNotice(
                  "Profile preview is ready. Saving to an account requires a backend."
                )
              }
            >
              Save profile
            </button>
          </div>
        </div>
      </div>

      <div
        className={`cp-notice${notice ? " cp-show" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice}
      </div>
    </div>
  );
}
