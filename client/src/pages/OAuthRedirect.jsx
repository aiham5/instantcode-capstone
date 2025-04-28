import { useEffect } from "react";

export default function OAuthRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.location.href = "/";
    }
  }, []);

  return <p>Redirecting...</p>;
}
