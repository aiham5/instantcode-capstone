import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { handleAuthError } from "../utils/auth";
import { AiFillHeart } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdReportGmailerrorred } from "react-icons/md";

export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/posts/all");
        setPosts(res.data);

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const userRes = await axios.get(
              "http://localhost:3000/api/users/me",
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setUser(userRes.data);
          } catch (err) {
            handleAuthError(err, navigate);
          }
        }

        setLoading(false);
      } catch {
        toast.error("Failed to load posts.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        "http://localhost:3000/api/likes",
        { postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      reloadPosts();
    } catch {
      toast.error("Failed to toggle like.");
    }
  };

  const handleDelete = async (postId) => {
    const token = localStorage.getItem("token");
    const isAdmin = user?.role === "admin";
    const route = isAdmin
      ? `/api/posts/admin/${postId}`
      : `/api/posts/${postId}`;

    try {
      await axios.delete(`http://localhost:3000${route}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted post");
      reloadPosts();
    } catch {
      toast.error("Failed to delete post.");
    }
  };

  const handleReport = async (postId) => {
    const reason = prompt("Why are you reporting this post?");
    if (!reason) return;

    try {
      await axios.post(
        "http://localhost:3000/api/reports",
        { postId, reason },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Post reported");
    } catch {
      toast.error("Failed to report post.");
    }
  };

  const reloadPosts = async () => {
    const res = await axios.get("http://localhost:3000/api/posts/all");
    setPosts(res.data);
  };

  const filtered = posts.filter(
    (post) =>
      post.caption.toLowerCase().includes(search.toLowerCase()) ||
      post.user.username.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="page">
      <h2>Latest Posts</h2>
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "6px",
          marginBottom: "20px",
        }}
      />

      {filtered.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <div className="post-user-info">
              <img
                src={post.user.image || "/default-pfp.png"}
                alt="pfp"
                className="pfp"
              />
              <strong>{post.user.username}</strong>
            </div>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="post-content">
            <div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                backgroundColor: "#111",
                borderRadius: "10px",
                overflow: "hidden",
                marginTop: "10px",
              }}
            >
              <img
                src={post.image}
                alt="post"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <p style={{ marginTop: "10px" }}>{post.caption}</p>
          </div>
          <div className="post-actions">
            <button
              className={`like-btn ${
                post.likes.some((l) => l.userId === user?.id) ? "liked" : ""
              }`}
              onClick={() => handleLike(post.id)}
              title="Like"
            >
              <AiFillHeart />
            </button>

            <Link to={`/posts/${post.id}`}>
              <button title="Comment">
                <FaRegCommentDots />
              </button>
            </Link>

            <button
              onClick={() =>
                navigator.share?.({ url: window.location.href }) || null
              }
              title="Share"
            >
              <IoMdShareAlt />
            </button>

            {user?.id === post.user.id || user?.role === "admin" ? (
              <button onClick={() => handleDelete(post.id)} title="Delete">
                <RiDeleteBin6Line />
              </button>
            ) : (
              <button onClick={() => handleReport(post.id)} title="Report">
                <MdReportGmailerrorred />
              </button>
            )}
          </div>

          <p className="like-count">
            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
          </p>
        </div>
      ))}
    </div>
  );
}
