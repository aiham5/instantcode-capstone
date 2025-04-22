import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", {
        username,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      toast.success("Registered!");
      window.location.href = "/";
    } catch {
      toast.error("Register failed");
    }
  };

  return (
    <div className="page">
      <div
        className="post-card"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <h2 style={{ textAlign: "center" }}>Register</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "var(--accent)",
              color: "white",
            }}
          >
            Register
          </button>
        </form>
        <hr style={{ margin: "20px 0" }} />
        <a href="http://localhost:3000/api/auth/google">
          <button style={{ width: "100%" }}>Register with Google</button>
        </a>
      </div>
    </div>
  );
}
