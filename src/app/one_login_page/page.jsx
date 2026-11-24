"use client";

import { useState } from "react";
import Link from "next/link";
import "./login.css";

export default function OneLoginPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: form.get("identifier"), // Email অথবা University ID দুটোই নেবে
          password: form.get("password"),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // Full page load so the top bar picks up the new login cookie.
      window.location.href = data.redirect;
    } catch {
      setMessage("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <main className="login-main">
        <section className="login-card" aria-labelledby="login-title">
          <div className="login-eyebrow">Welcome back</div>

          <h1 id="login-title">Login to UniConnect</h1>

          <p className="login-subtitle">
            Enter your University ID or Email to continue to your community.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="identifier">University ID or Email</label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                placeholder="e.g., 2222587042 or you@example.com"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
            </div>

            <button className="login-submit-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="login-form-message" role="status" aria-live="polite">
              {message}
            </p>
          </form>

          <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup_page" style={{ color: "#2563eb", fontWeight: 600 }}>
              Sign up here
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}