import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);

    if (token) {
      axios
        .get("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }

    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.body.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <header className="header">
      <Link to="/">
        <img src="/logo.png" alt="InstantCode Logo" className="logo" />
      </Link>

      <div className="center-logo">
        <div className="center-logo-img" />
      </div>

      <div className="header-buttons">
        <button onClick={toggleTheme}>
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </button>

        {loggedIn ? (
          <>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
            {user && (
              <Link to={`/profile/${user.id}`}>
                <img
                  src={user.image || "/default-pfp.png"}
                  alt="My PFP"
                  className="pfp"
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid var(--accent)",
                    marginLeft: "10px",
                  }}
                />
              </Link>
            )}
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="login-btn">Login</button>
            </Link>
            <Link to="/register">
              <button className="register-btn">Register</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
