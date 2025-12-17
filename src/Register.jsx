import React, { useState } from "react";
import { register as registerRequest, setToken } from "./auth";

export default function Register({ onLogin, onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await registerRequest({ name, email, password });
      if (res && res.token) {
        setToken(res.token);
        onLogin && onLogin(res.token);
      } else {
        setError("Registration failed: invalid response from server");
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      <h2>Register</h2>
      <div style={{ marginBottom: 8 }}>
        <label>
          Name
          <br />
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
          />
        </label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>
          Email
          <br />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>
          Password
          <br />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>
      </div>

      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 10, color: "#900" }}>Error: {error}</div>
      )}

      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={onCancel} className="link-button">
          Back to login
        </button>
      </div>
    </form>
  );
}
