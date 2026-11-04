
"use client";

import { useEffect, useState } from "react";
import "./create-project.css";

const initialForm = {
  projectTitle: "",
  projectDescription: "",
  course: "",
  minCgpa: "",
  availableSlots: "1",
};

const courses = [
  "Introduction to Programming",
  "Data Structures and Algorithms",
  "Database Management Systems",
  "Artificial Intelligence",
  "Machine Learning",
  "Software Engineering",
  "Computer Networks",
  "Human-Computer Interaction",
];

export default function CreateNewProjectPage() {
  const [form, setForm] = useState(initialForm);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function addSkill() {
    const skill = skillInput.trim().replace(/\s+/g, " ");

    if (!skill) {
      setNotice("Enter a skill before adding it.");
      return;
    }

    if (skills.some((item) => item.toLowerCase() === skill.toLowerCase())) {
      setNotice("That skill has already been added.");
      return;
    }

    setSkills((previous) => [...previous, skill]);
    setSkillInput("");
    setNotice("");
  }

  function removeSkill(skillToRemove) {
    setSkills((previous) =>
      previous.filter((skill) => skill !== skillToRemove)
    );
  }

  function handleSkillKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  }

  function clearForm() {
    setForm(initialForm);
    setSkills([]);
    setSkillInput("");
    setPreview(null);
    setNotice("Form cleared.");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const cgpa = Number(form.minCgpa);
    const slots = Number(form.availableSlots);

    if (!form.projectTitle.trim() || !form.projectDescription.trim()) {
      setNotice("Please complete all required fields.");
      return;
    }

    if (!form.course) {
      setNotice("Please select a course.");
      return;
    }

    if (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 4) {
      setNotice("Minimum CGPA must be between 0.00 and 4.00.");
      return;
    }

    if (!Number.isInteger(slots) || slots < 1 || slots > 999) {
      setNotice("Available slots must be between 1 and 999.");
      return;
    }

    const project = {
      title: form.projectTitle.trim(),
      description: form.projectDescription.trim(),
      course: form.course,
      requiredSkills: [...skills],
      minCgpa: cgpa,
      availableSlots: slots,
    };

    setPreview(project);
    setNotice(
      "Project details validated. Connect a backend to publish this project."
    );
  }

  return (
    <div className="create-project-page">
      <main className="cp-main">
        <section className="cp-intro">
          <span className="cp-eyebrow">Faculty portal</span>
          <h1>Create New Project</h1>
          <p>
            Share a new opportunity with students. Add the project details,
            choose its course, and describe the skills and eligibility
            requirements.
          </p>
        </section>

        <form className="cp-form-card" onSubmit={handleSubmit}>
          <section className="cp-form-section">
            <h2 className="cp-section-heading">Project details</h2>
            <p className="cp-section-help">
              Start with a clear title and a description of the work students
              will contribute to.
            </p>

            <div className="cp-field-grid">
              <div className="cp-field cp-full">
                <label htmlFor="projectTitle">
                  Project title <span className="cp-required">*</span>
                </label>
                <input
                  id="projectTitle"
                  name="projectTitle"
                  type="text"
                  maxLength={120}
                  placeholder="e.g. AI-Powered Student Support"
                  value={form.projectTitle}
                  onChange={updateField}
                  required
                />
                <span className="cp-hint">
                  Use a concise title that helps students understand the
                  opportunity.
                </span>
              </div>

              <div className="cp-field cp-full">
                <label htmlFor="projectDescription">
                  Project description <span className="cp-required">*</span>
                </label>
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  maxLength={3000}
                  placeholder="Describe the project's goals, what students will work on, and any useful context..."
                  value={form.projectDescription}
                  onChange={updateField}
                  required
                />
                <span className="cp-hint">
                  Include the main objectives, expected contributions, and
                  relevant background.
                </span>
              </div>

              <div className="cp-field cp-full">
                <label htmlFor="course">
                  Course <span className="cp-required">*</span>
                </label>
                <select
                  id="course"
                  name="course"
                  value={form.course}
                  onChange={updateField}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                <span className="cp-hint">
                  These are sample course options. Replace them with courses
                  assigned to your faculty account.
                </span>
              </div>
            </div>
          </section>

          <section className="cp-form-section">
            <h2 className="cp-section-heading">Required skills</h2>
            <p className="cp-section-help">
              Add the skills you would like students to bring to this project.
              You can remove any skill before submitting.
            </p>

            <div className="cp-field">
              <label htmlFor="skillInput">Add a skill</label>

              <div className="cp-skill-entry">
                <input
                  id="skillInput"
                  type="text"
                  maxLength={40}
                  placeholder="e.g. Python, UI/UX Design, Data Analysis"
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={handleSkillKeyDown}
                />
                <button
                  className="cp-secondary-btn"
                  type="button"
                  onClick={addSkill}
                >
                  <span aria-hidden="true">+</span> Add skill
                </button>
              </div>

              <div className="cp-skill-tags" aria-live="polite">
                {skills.length === 0 ? (
                  <span className="cp-skill-empty">
                    No skills added yet.
                  </span>
                ) : (
                  skills.map((skill) => (
                    <span className="cp-skill-tag" key={skill}>
                      <span>{skill}</span>
                      <button
                        type="button"
                        className="cp-remove-skill"
                        aria-label={`Remove ${skill}`}
                        onClick={() => removeSkill(skill)}
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>

              <span className="cp-hint">
                Press Enter or select “Add skill”. Duplicate skills are
                ignored.
              </span>
            </div>
          </section>

          <section className="cp-form-section">
            <h2 className="cp-section-heading">
              Eligibility and capacity
            </h2>
            <p className="cp-section-help">
              Set the minimum academic requirement and the number of students
              you can accommodate.
            </p>

            <div className="cp-field-grid">
              <div className="cp-field">
                <label htmlFor="minCgpa">
                  Minimum CGPA requirement{" "}
                  <span className="cp-required">*</span>
                </label>

                <div className="cp-inline-unit">
                  <input
                    id="minCgpa"
                    name="minCgpa"
                    type="number"
                    min="0"
                    max="4"
                    step="0.01"
                    placeholder="e.g. 3.00"
                    value={form.minCgpa}
                    onChange={updateField}
                    required
                  />
                  <span className="cp-unit">/ 4.00</span>
                </div>

                <span className="cp-hint">
                  Enter a value from 0.00 to 4.00.
                </span>
              </div>

              <div className="cp-field">
                <label htmlFor="availableSlots">
                  Available slots <span className="cp-required">*</span>
                </label>
                <input
                  id="availableSlots"
                  name="availableSlots"
                  type="number"
                  min="1"
                  max="999"
                  step="1"
                  value={form.availableSlots}
                  onChange={updateField}
                  required
                />
                <span className="cp-hint">
                  How many students can join this project?
                </span>
              </div>
            </div>
          </section>

          <div className="cp-form-footer">
            <p className="cp-footer-note">
              <span className="cp-required">*</span> Required fields.
              This prototype validates your form but does not publish it to
              a server.
            </p>

            <div className="cp-actions">
              <button
                className="cp-btn cp-btn-secondary"
                type="button"
                onClick={clearForm}
              >
                Clear form
              </button>
              <button className="cp-btn cp-btn-primary" type="submit">
                Create project <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </form>

        {preview && (
          <section className="cp-preview" aria-live="polite">
            <div className="cp-preview-header">
              <span className="cp-preview-icon">✓</span>
              <div>
                <h2>Project preview</h2>
                <p>Your form has passed validation.</p>
              </div>
            </div>

            <h3>{preview.title}</h3>
            <p className="cp-preview-description">{preview.description}</p>

            <div className="cp-preview-grid">
              <div>
                <span>Course</span>
                <strong>{preview.course}</strong>
              </div>
              <div>
                <span>Minimum CGPA</span>
                <strong>{preview.minCgpa.toFixed(2)} / 4.00</strong>
              </div>
              <div>
                <span>Available slots</span>
                <strong>{preview.availableSlots}</strong>
              </div>
            </div>

            <div className="cp-preview-skills">
              <span>Required skills</span>
              <div className="cp-skill-tags">
                {preview.requiredSkills.length ? (
                  preview.requiredSkills.map((skill) => (
                    <span className="cp-skill-tag" key={skill}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="cp-skill-empty">
                    No specific skills added.
                  </span>
                )}
              </div>
            </div>

            <p className="cp-preview-warning">
              This is a local preview only. The project has not been saved to
              your database or published to students.
            </p>
          </section>
        )}
      </main>

      <footer className="cp-footer">
        © 2026 uni-connect · Bringing campus communities together
      </footer>

      {notice && (
        <div className="cp-notice" role="status" aria-live="polite">
          <span className="cp-notice-check">✓</span>
          {notice}
        </div>
      )}
    </div>
  );
}
