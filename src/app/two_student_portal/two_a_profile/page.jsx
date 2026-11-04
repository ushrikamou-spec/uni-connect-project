
"use client";

import { useRef, useState } from "react";

const initialSkills = [
  "Python",
  "UI/UX Design",
  "Data Analysis",
  "Teamwork",
];

export default function StudentProfile() {
  const [photo, setPhoto] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [contactVisible, setContactVisible] = useState(false);
  const [skills, setSkills] = useState(initialSkills);
  const [skillInput, setSkillInput] = useState("");
  const [cv, setCv] = useState(null);
  const [notice, setNotice] = useState("");

  const photoRef = useRef(null);
  const cvRef = useRef(null);
  const noticeTimer = useRef(null);

  function showNotice(message) {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 3000);
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
      setPhotoName(file.name);
      showNotice("Profile picture preview updated.");
    };
    reader.readAsDataURL(file);
  }

  function handleCv(file) {
    if (!file) return;

    if (!/\.(pdf|doc|docx|ppt|pptx|zip|txt)$/i.test(file.name)) {
      showNotice("Please choose a supported CV or portfolio file.");
      return;
    }

    setCv(file);
    showNotice("File selected for local preview.");
  }

  function addSkill(event) {
    event.preventDefault();
    const value = skillInput.trim();

    if (!value) return;

    if (skills.some((skill) => skill.toLowerCase() === value.toLowerCase())) {
      showNotice("That skill is already on your profile.");
      return;
    }

    setSkills((previous) => [...previous, value]);
    setSkillInput("");
    showNotice("Skill tag added.");
  }

  function resetDemo() {
    setPhoto("");
    setPhotoName("");
    setContactVisible(false);
    setSkills(initialSkills);
    setSkillInput("");
    setCv(null);

    if (photoRef.current) photoRef.current.value = "";
    if (cvRef.current) cvRef.current.value = "";

    showNotice("Demo profile reset.");
  }

  return (
    <main className="student-profile-page profile-page">
      <section className="intro">
        <span className="eyebrow">Student portal</span>
        <h1>Student Profile</h1>
        <p>
          Showcase your background, skills, and experience to help
          faculty discover the right fit.
        </p>
      </section>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <section className="panel">
            <h2>Profile picture</h2>
            <p className="subtitle">
              Add a photo so faculty can recognize you.
            </p>

            <label className="dropzone" htmlFor="photo-input">
              <div className="avatar">
                {photo ? (
                  <img src={photo} alt="Profile preview" />
                ) : (
                  <span>ST</span>
                )}
              </div>

              <strong>{photoName || "Drop your photo here"}</strong>
              <span>Or choose a picture from your device</span>
              <span className="upload-btn">Upload picture</span>
            </label>

            <input
              ref={photoRef}
              className="hidden-input"
              id="photo-input"
              type="file"
              accept="image/*"
              onChange={(event) => handlePhoto(event.target.files?.[0])}
            />

            <p className="helper">
              JPG, PNG, or WEBP. Preview stays in this browser.
            </p>
          </section>
        </aside>

        <div className="profile-content">
          <section className="panel">
            <h2>Personal information</h2>

            <div className="profile-grid">
              <Field label="Full name" value="Alex Morgan" />
              <Field label="Gender" value="Not provided" />
              <Field label="Student ID" value="231-XX-XXXX" />
              <Field label="Email address" value="student@example.edu" />

              <div className="field">
                <span className="field-label">Contact number</span>
                <div className="contact-line">
                  <span className="field-value">
                    {contactVisible ? "01700000000" : "••••••••••"}
                  </span>
                  <button
                    type="button"
                    className="visibility-toggle"
                    onClick={() => setContactVisible((value) => !value)}
                    aria-pressed={contactVisible}
                  >
                    {contactVisible ? "◎ Hide" : "◉ Show"}
                  </button>
                </div>
              </div>

              <div className="field">
                <span className="field-label">CGPA</span>
                <div className="cgpa-value">
                  <span className="field-value">3.78</span>
                  <span className="cgpa-badge">/ 4.00</span>
                </div>
              </div>
            </div>

            <p className="helper left">
              Sample profile information for the prototype. Real student data
              will be connected later.
            </p>
          </section>

          <section className="panel">
            <div className="section-heading">
              <h2>Skills</h2>
              <span className="eyebrow">
                {skills.length} {skills.length === 1 ? "skill" : "skills"}
              </span>
            </div>

            <p className="subtitle">
              Add skill tags or remove existing ones at any time.
            </p>

            <form className="skill-entry" onSubmit={addSkill}>
              <input
                type="text"
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                placeholder="e.g. Python, UI/UX design, Data analysis"
                maxLength={40}
                aria-label="New skill"
              />
              <button className="primary-btn" type="submit">
                + Add skill
              </button>
            </form>

            <div className="skill-tags" aria-live="polite">
              {skills.length ? (
                skills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                    <button
                      type="button"
                      aria-label={`Remove ${skill}`}
                      onClick={() =>
                        setSkills((previous) =>
                          previous.filter((item) => item !== skill)
                        )
                      }
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <p className="subtitle">
                  No skills added yet. Add your first skill above.
                </p>
              )}
            </div>
          </section>

          <section className="panel">
            <h2>Portfolio / CV</h2>
            <p className="subtitle">
              Upload a CV or portfolio so faculty can learn more about your
              work.
            </p>

            <label className="dropzone cv-dropzone" htmlFor="cv-input">
              <div className="file-symbol">↥</div>
              <strong>Choose your CV or portfolio</strong>
              <span>PDF, DOC, DOCX, PPT, or ZIP</span>
              <span className="upload-btn">Upload file</span>
            </label>

            <input
              ref={cvRef}
              className="hidden-input"
              id="cv-input"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.txt"
              onChange={(event) => handleCv(event.target.files?.[0])}
            />

            {cv && (
              <div className="file-selected">
                <div className="file-symbol">▤</div>
                <div className="file-meta">
                  <strong>{cv.name}</strong>
                  <span>
                    {cv.size < 1048576
                      ? `${Math.max(1, Math.round(cv.size / 1024))} KB`
                      : `${(cv.size / 1048576).toFixed(2)} MB`}
                  </span>
                </div>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => {
                    setCv(null);
                    if (cvRef.current) cvRef.current.value = "";
                    showNotice("Selected file removed.");
                  }}
                >
                  Remove
                </button>
              </div>
            )}

            <p className="helper left">
              The selected file is only shown as a local preview. It is not
              uploaded to a server.
            </p>
          </section>

          <div className="save-row">
            <button type="button" className="secondary-btn" onClick={resetDemo}>
              Reset demo
            </button>
            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                showNotice(
                  "Profile preview is ready. Saving requires a backend."
                )
              }
            >
              Save profile
            </button>
          </div>
        </div>
      </div>

      {notice && (
        <div className="notice" role="status" aria-live="polite">
          {notice}
        </div>
      )}

      <style>{`
        .student-profile-page {
          --navy: #102a43;
          --blue: #2563eb;
          --pale: #eff6ff;
          --ink: #172b4d;
          --muted: #71839a;
          --line: #e2ebf7;

          box-sizing: border-box;
          width: 100%;
          min-width: 0;
          flex: 1 0 auto;
          color: var(--ink);
          background: #f8fbff;
          padding: 42px clamp(16px, 4vw, 42px) 60px;
          font-family: Inter, system-ui, sans-serif;
        }

        .student-profile-page *,
        .student-profile-page *::before,
        .student-profile-page *::after {
          box-sizing: border-box;
        }

        .student-profile-page .intro,
        .student-profile-page .profile-layout {
          width: 100%;
          max-width: 1120px;
          margin-left: auto;
          margin-right: auto;
        }

        .student-profile-page .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border: 1px solid #dbeafe;
          border-radius: 99px;
          color: #1d4ed8;
          background: white;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .student-profile-page .intro h1 {
          margin: 14px 0 8px;
          color: var(--navy);
          font-size: clamp(2rem, 4vw, 2.65rem);
          letter-spacing: -1.5px;
        }

        .student-profile-page .intro > p {
          margin: 0 0 26px;
          color: var(--muted);
          line-height: 1.65;
        }

        .student-profile-page .profile-layout {
          display: grid;
          grid-template-columns: 290px minmax(0, 1fr);
          gap: 22px;
          align-items: start;
        }

        .student-profile-page .profile-sidebar,
        .student-profile-page .profile-content {
          min-width: 0;
        }

        .student-profile-page .panel {
          min-width: 0;
          margin-bottom: 22px;
          padding: 24px;
          background: white;
          border: 1px solid var(--line);
          border-radius: 18px;
          box-shadow: 0 8px 28px #1d4e8c0b;
        }

        .student-profile-page .panel h2 {
          margin: 0 0 8px;
          color: var(--navy);
          font-size: 1.1rem;
        }

        .student-profile-page .subtitle {
          margin: 0 0 18px;
          color: var(--muted);
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .student-profile-page .dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 218px;
          padding: 20px;
          text-align: center;
          border: 1.5px dashed #b9cbe2;
          border-radius: 15px;
          background: #fbfdff;
          cursor: pointer;
          overflow-wrap: anywhere;
        }

        .student-profile-page .dropzone:hover {
          border-color: var(--blue);
          background: #f1f7ff;
        }

        .student-profile-page .avatar {
          display: grid;
          place-items: center;
          width: 96px;
          height: 96px;
          flex-shrink: 0;
          overflow: hidden;
          border: 3px solid white;
          border-radius: 50%;
          background: #eaf2ff;
          color: var(--blue);
          box-shadow: 0 0 0 1px #dbeafe;
          font-size: 2rem;
          font-weight: 800;
        }

        .student-profile-page .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .student-profile-page .dropzone strong {
          color: var(--navy);
          font-size: 0.94rem;
        }

        .student-profile-page .dropzone > span:not(.upload-btn) {
          color: var(--muted);
          font-size: 0.82rem;
          line-height: 1.45;
        }

        .student-profile-page .upload-btn,
        .student-profile-page .primary-btn,
        .student-profile-page .secondary-btn,
        .student-profile-page .remove-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 10px;
          padding: 10px 15px;
          font: inherit;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
        }

        .student-profile-page .upload-btn,
        .student-profile-page .primary-btn {
          color: white;
          background: var(--blue);
        }

        .student-profile-page .secondary-btn {
          color: #1d4ed8;
          background: var(--pale);
          border: 1px solid #dbeafe;
        }

        .student-profile-page .hidden-input {
          display: none;
        }

        .student-profile-page .helper {
          margin: 12px 0 0;
          text-align: center;
          color: #8392a6;
          font-size: 0.78rem;
          line-height: 1.5;
        }

        .student-profile-page .helper.left {
          text-align: left;
          margin-top: 14px;
        }

        .student-profile-page .profile-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .student-profile-page .field {
          min-width: 0;
          padding: 14px 15px;
          border: 1px solid #e6edf6;
          border-radius: 12px;
          background: #fcfdff;
        }

        .student-profile-page .field-label {
          display: block;
          margin-bottom: 7px;
          color: var(--muted);
          font-size: 0.79rem;
          font-weight: 650;
        }

        .student-profile-page .field-value {
          color: var(--navy);
          font-size: 0.96rem;
          font-weight: 650;
          overflow-wrap: anywhere;
        }

        .student-profile-page .contact-line,
        .student-profile-page .cgpa-value,
        .student-profile-page .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .student-profile-page .visibility-toggle {
          padding: 7px 9px;
          border: 1px solid #dbeafe;
          border-radius: 8px;
          background: var(--pale);
          color: #1d4ed8;
          font: inherit;
          font-size: 0.77rem;
          font-weight: 700;
          cursor: pointer;
        }

        .student-profile-page .cgpa-value {
          justify-content: flex-start;
        }

        .student-profile-page .cgpa-badge {
          padding: 5px 9px;
          border-radius: 8px;
          background: #ecfdf5;
          color: #16805d;
          font-size: 0.8rem;
          font-weight: 800;
        }

        .student-profile-page .section-heading {
          margin-bottom: 12px;
        }

        .student-profile-page .section-heading h2 {
          margin: 0;
        }

        .student-profile-page .skill-entry {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .student-profile-page .skill-entry input {
          flex: 1;
          min-width: 0;
          height: 44px;
          padding: 0 13px;
          border: 1px solid #d8e2ef;
          border-radius: 10px;
          background: #fbfdff;
          color: var(--ink);
          font: inherit;
        }

        .student-profile-page .skill-entry input:focus {
          outline: 2px solid #bfdbfe;
          border-color: var(--blue);
        }

        .student-profile-page .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .student-profile-page .skill-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px 8px 12px;
          border: 1px solid #dbeafe;
          border-radius: 9px;
          background: var(--pale);
          color: #1d4ed8;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .student-profile-page .skill-tag button {
          border: 0;
          background: transparent;
          color: #5c7cb2;
          font-size: 1.1rem;
          cursor: pointer;
        }

        .student-profile-page .cv-dropzone {
          min-height: 165px;
        }

        .student-profile-page .file-symbol {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 12px;
          background: #eaf2ff;
          color: var(--blue);
          font-size: 1.4rem;
        }

        .student-profile-page .file-selected {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 14px;
          padding: 13px;
          border: 1px solid #dbeafe;
          border-radius: 12px;
          background: #f8fbff;
        }

        .student-profile-page .file-meta {
          flex: 1;
          min-width: 0;
        }

        .student-profile-page .file-meta strong {
          display: block;
          color: var(--navy);
          font-size: 0.88rem;
          overflow-wrap: anywhere;
        }

        .student-profile-page .file-meta span {
          display: block;
          margin-top: 4px;
          color: var(--muted);
          font-size: 0.78rem;
        }

        .student-profile-page .remove-btn {
          padding: 7px 9px;
          background: #fff1f2;
          color: #be123c;
        }

        .student-profile-page .save-row {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 22px;
        }

        .student-profile-page .notice {
          position: fixed;
          z-index: 100;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          max-width: calc(100% - 30px);
          padding: 13px 18px;
          border-radius: 12px;
          background: var(--navy);
          color: white;
          text-align: center;
          box-shadow: 0 12px 35px #102a4333;
        }

        @media (max-width: 820px) {
          .student-profile-page .profile-layout {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 560px) {
          .student-profile-page.profile-page {
            padding: 28px 14px 40px;
          }

          .student-profile-page .profile-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .student-profile-page .panel {
            padding: 18px;
          }

          .student-profile-page .skill-entry {
            flex-direction: column;
          }

          .student-profile-page .contact-line {
            align-items: flex-start;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </main>
  );
}

function Field({ label, value }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="field-value">{value}</div>
    </div>
  );
}
