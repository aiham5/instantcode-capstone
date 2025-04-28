import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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
  }, []);

  return (
    <header className="header">
      <Link to="/">
        <img src="/logo.png" alt="InstantCode Logo" className="logo" />
      </Link>

      <div className="center-logo">
        <div className="center-logo-img" />
      </div>

      <div className="header-buttons">
        {loggedIn ? (
          user && (
            <Link to={`/profile/${user.id}`}>
              <img
                src={user.image || "/default-pfp.png"}
                alt="My PFP"
                className="pfp"
              />
            </Link>
          )
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
