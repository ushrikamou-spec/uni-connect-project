"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./student-materials.css";
import {
    ALLOWED_EXTENSIONS,
    MAX_FILE_BYTES,
    formatSize,
    isAllowedFile,
} from "../../../lib/materials";

function formatDate(value) {
    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function StudentMaterials() {
    const [materials, setMaterials] = useState([]);
    const [courses, setCourses] = useState([]);
    const [query, setQuery] = useState("");
    const [courseFilter, setCourseFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [title, setTitle] = useState("");
    const [course, setCourse] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [formError, setFormError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [notice, setNotice] = useState("");
    const fileInput = useRef(null);

    const loadMaterials = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (query.trim()) params.set("q", query.trim());
            if (courseFilter !== "all") params.set("course", courseFilter);

            const response = await fetch(`/api/materials?${params.toString()}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not load materials.");

            setMaterials(data.materials);
            setCourses(data.courses);
            setLoadError("");
        } catch (error) {
            setLoadError(error.message || "Could not load materials.");
        } finally {
            setLoading(false);
        }
    }, [query, courseFilter]);

    // Reload when the search or course filter changes (with a short delay while typing).
    useEffect(() => {
        const timer = setTimeout(loadMaterials, 250);
        return () => clearTimeout(timer);
    }, [loadMaterials]);

    function chooseFile(event) {
        const chosen = event.target.files[0] || null;
        setFormError("");

        if (chosen && !isAllowedFile(chosen.name)) {
            setFormError(`That file type is not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}.`);
            event.target.value = "";
            setFile(null);
            return;
        }
        if (chosen && chosen.size > MAX_FILE_BYTES) {
            setFormError("That file is larger than 10 MB.");
            event.target.value = "";
            setFile(null);
            return;
        }
        setFile(chosen);
    }

    async function handleUpload(event) {
        event.preventDefault();
        setFormError("");

        if (!title.trim()) return setFormError("Please enter a title.");
        if (!course.trim()) return setFormError("Please enter a course code, for example CSE327.");
        if (!file) return setFormError("Please choose a file to upload.");

        const form = new FormData();
        form.append("title", title.trim());
        form.append("course", course.trim());
        form.append("description", description.trim());
        form.append("file", file);

        setUploading(true);
        try {
            const response = await fetch("/api/materials", { method: "POST", body: form });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Upload failed.");

            setNotice(`"${title.trim()}" was uploaded.`);
            setTitle("");
            setCourse("");
            setDescription("");
            setFile(null);
            if (fileInput.current) fileInput.current.value = "";
            loadMaterials();
        } catch (error) {
            setFormError(error.message || "Upload failed.");
        } finally {
            setUploading(false);
        }
    }

    async function handleDelete(item) {
        if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;

        try {
            const response = await fetch(`/api/materials/${item.id}`, { method: "DELETE" });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not delete.");

            setNotice(`"${item.title}" was deleted.`);
            loadMaterials();
        } catch (error) {
            setNotice(error.message || "Could not delete.");
        }
    }

    return (
        <div className="sm-page">
            <section className="sm-intro">
                <span className="sm-eyebrow">Student portal</span>
                <h1>Course Materials</h1>
                <p>
                    Share notes, slides and past papers with other students, and download
                    what others have uploaded.
                </p>
            </section>

            <section className="sm-panel">
                <h2>Upload a material</h2>
                <p className="sm-hint">
                    Allowed: {ALLOWED_EXTENSIONS.join(", ")} · up to {formatSize(MAX_FILE_BYTES)}.
                </p>

                <form className="sm-form" onSubmit={handleUpload} noValidate>
                    <div className="sm-row">
                        <div className="sm-field">
                            <label htmlFor="sm-title">Title</label>
                            <input
                                id="sm-title"
                                type="text"
                                value={title}
                                maxLength={120}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Week 5 lecture notes"
                            />
                        </div>
                        <div className="sm-field sm-field-small">
                            <label htmlFor="sm-course">Course code</label>
                            <input
                                id="sm-course"
                                type="text"
                                value={course}
                                maxLength={20}
                                onChange={(e) => setCourse(e.target.value)}
                                placeholder="e.g. CSE327"
                            />
                        </div>
                    </div>

                    <div className="sm-field">
                        <label htmlFor="sm-description">
                            Description <span className="sm-optional">(optional)</span>
                        </label>
                        <textarea
                            id="sm-description"
                            rows={2}
                            maxLength={500}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is in this file?"
                        />
                    </div>

                    <div className="sm-field">
                        <label htmlFor="sm-file">File</label>
                        <input
                            id="sm-file"
                            type="file"
                            ref={fileInput}
                            accept={ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
                            onChange={chooseFile}
                        />
                        {file && (
                            <span className="sm-file-info">
                                {file.name} · {formatSize(file.size)}
                            </span>
                        )}
                    </div>

                    {formError && (
                        <p className="sm-error" role="alert">
                            {formError}
                        </p>
                    )}

                    <div className="sm-actions">
                        <button className="sm-primary" type="submit" disabled={uploading}>
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                </form>
            </section>

            <section className="sm-panel">
                <div className="sm-library-head">
                    <h2>Shared materials</h2>
                    <span className="sm-count">{materials.length} files</span>
                </div>

                <div className="sm-toolbar">
                    <input
                        className="sm-search"
                        type="search"
                        placeholder="Search title, course or file name..."
                        aria-label="Search materials"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <select
                        className="sm-select"
                        aria-label="Filter by course"
                        value={courseFilter}
                        onChange={(e) => setCourseFilter(e.target.value)}
                    >
                        <option value="all">All courses</option>
                        {courses.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <p className="sm-hint">Loading materials...</p>
                ) : loadError ? (
                    <p className="sm-error" role="alert">
                        {loadError}
                    </p>
                ) : materials.length === 0 ? (
                    <p className="sm-hint">
                        {query || courseFilter !== "all"
                            ? "No materials match your search."
                            : "Nothing has been shared yet. Be the first to upload!"}
                    </p>
                ) : (
                    <div className="sm-list">
                        {materials.map((item) => (
                            <article className="sm-card" key={item.id}>
                                <div className="sm-card-main">
                                    <div className="sm-card-top">
                                        <span className="sm-tag">{item.course}</span>
                                        <h3>{item.title}</h3>
                                    </div>
                                    {item.description && (
                                        <p className="sm-description">{item.description}</p>
                                    )}
                                    <p className="sm-meta">
                                        {item.fileName} · {formatSize(item.size)} · Uploaded by{" "}
                                        {item.mine ? "you" : item.uploadedBy} on{" "}
                                        {formatDate(item.uploadedAt)} · {item.downloads}{" "}
                                        {item.downloads === 1 ? "download" : "downloads"}
                                    </p>
                                </div>

                                <div className="sm-card-actions">
                                    <a
                                        className="sm-primary"
                                        href={`/api/materials/${item.id}/download`}
                                    >
                                        Download
                                    </a>
                                    {item.mine && (
                                        <button
                                            className="sm-danger"
                                            type="button"
                                            onClick={() => handleDelete(item)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {notice && (
                <div className="sm-notice" role="status">
                    <span>{notice}</span>
                    <button type="button" onClick={() => setNotice("")} aria-label="Dismiss">
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}