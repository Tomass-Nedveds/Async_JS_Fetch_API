const TOKEN_KEY = "jwt_token";

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.warn("Failed to save token:", e);
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export function removeToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.warn("Failed to remove token:", e);
  }
}

export function decodeToken(token) {
  if (!token) throw new Error("No token");
  const parts = token.split(".");
  if (parts.length < 2) throw new Error("Invalid token");
  try {
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    try {
      const json = atob(parts[1]);
      return JSON.parse(json);
    } catch (err) {
      throw new Error("Failed to decode token payload");
    }
  }
}

export async function register({ name, email, password, url = "/api/register" }) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try {
      const json = JSON.parse(text);
      msg = json.message || JSON.stringify(json);
    } catch (e) {}
    throw new Error(msg || `Request failed: ${res.status}`);
  }

  const json = await res.json();
  return json;
}

export default {
  setToken,
  getToken,
  removeToken,
  decodeToken,
  register,
};
