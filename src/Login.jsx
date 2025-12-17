import React, { useState } from "react";

export default function Login({ onLogin, showRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        let msg = text;
        try {
          const json = JSON.parse(text);
          msg = json.message || JSON.stringify(json);
        } catch (e) {}
        throw new Error(msg || `Login failed: ${res.status}`);
      }

      const json = await res.json();
      if (json && json.token) {
        try {
          localStorage.setItem("jwt_token", json.token);
        } catch (e) {}
        onLogin && onLogin(json.token);
      } else {
        throw new Error("Invalid login response: missing token");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }



  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>

      {error && <div style={{ marginTop: 10, color: "#900" }}>{error}</div>}

      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={showRegister} className="link-button">
          Need an account? Register
        </button>
      </div>
    </div>
  );
}
