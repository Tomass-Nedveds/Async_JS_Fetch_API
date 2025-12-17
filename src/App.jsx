import { useEffect, useState } from "react";
import Posts from "./Posts";
import DogGenerator from "./DogGenerator";
import Register from "./Register";
import Login from "./Login";
import { getToken, decodeToken, removeToken } from "./auth";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const t = getToken();
    if (t) {
      setToken(t);
      try {
        const payload = decodeToken(t);
        setUser(payload);
      } catch (e) {
        console.warn("Failed to decode token:", e);
      }
    }
  }, []);

  function handleLogin(t) {
    setToken(t);
    try {
      setUser(decodeToken(t));
    } catch (e) {
      setUser(null);
    }
  }

  function handleLogout() {
    removeToken();
    setToken(null);
    setUser(null);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>React Uzdevumi</h1>

      {!token || !user ? (
        <div style={{ marginBottom: 20 }}>
          {showRegister ? (
            <Register onLogin={handleLogin} onCancel={() => setShowRegister(false)} />
          ) : (
            <Login onLogin={handleLogin} showRegister={() => setShowRegister(true)} />
          )}
        </div>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <strong>Logged in:</strong> {user.email || user.sub || "user"}
          <button style={{ marginLeft: 12 }} onClick={handleLogout}>
            Logout
          </button>

          <div style={{ marginTop: 20 }}>
            <Posts />

            <hr style={{ margin: "40px 0" }} />

            <DogGenerator />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
