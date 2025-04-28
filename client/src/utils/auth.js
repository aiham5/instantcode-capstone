import toast from "react-hot-toast";

export const handleAuthError = (error, navigate) => {
  if (error?.response?.status === 401) {
    toast.error("Session expired or account deleted");
    localStorage.removeItem("token");
    navigate("/login");
  }
};
