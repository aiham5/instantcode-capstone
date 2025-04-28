import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { AiFillHeart } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/posts/${id}`);
      setPost(res.data);
    } catch {
      toast.error("Failed to load post");
    }
    setLoading(false);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const res = await axios.get("http://localhost:3000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchUser();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !comment.trim()) return;

    try {
      await axios.post(
        "http://localhost:3000/api/comments",
        {
          postId: post.id,
          content: comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComment("");
      toast.success("Comment added");
      await fetchPost();
    } catch {
      toast.error("Failed to comment");
    }
  };

  const handleLikeComment = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;

    try {
      await axios.post(
        "http://localhost:3000/api/likes",
        { commentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchPost();
    } catch {
      toast.error("Failed to like comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const route =
      user?.role === "admin"
        ? `/api/comments/admin/${commentId}`
        : `/api/comments/${commentId}`;

    try {
      await axios.delete(`http://localhost:3000${route}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Comment deleted");
      await fetchPost();
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  if (loading) return <Loader />;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="page">
      <div className="post-card">
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
          <img
            src={post.image}
            alt="post"
            className="post-image"
            style={{
              marginTop: "10px",
              width: "100%",
              aspectRatio: "1 / 1",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
          <p style={{ marginTop: "10px" }}>{post.caption}</p>
        </div>

        <div className="post-actions">
          <p className="like-count">
            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
          </p>
        </div>
      </div>

      <div className="post-card" style={{ marginTop: "2rem" }}>
        <h3>Comments</h3>
        {post.comments.length === 0 && <p>No comments yet.</p>}

        {post.comments.map((c) => (
          <div
            key={c.id}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <strong>{c.user.username}:</strong> {c.content}
            <div
              className="comment-actions"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "6px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  minWidth: "80px",
                  color: "var(--icon)",
                }}
              >
                <AiFillHeart
                  color={c.likes.length > 0 ? "red" : "var(--icon)"}
                />
                <span
                  style={{
                    minWidth: "30px",
                    textAlign: "left",
                    color: "var(--subtext)",
                  }}
                >
                  {c.likes.length} {c.likes.length === 1 ? "like" : "likes"}
                </span>
              </div>

              {user && (
                <button
                  className="comment-icon-btn"
                  onClick={() => handleLikeComment(c.id)}
                  title="Like"
                >
                  <AiFillHeart
                    color={
                      c.likes.some((l) => l.userId === user.id)
                        ? "red"
                        : "var(--icon)"
                    }
                  />
                </button>
              )}

              {(user?.id === c.user.id || user?.role === "admin") && (
                <button
                  className="comment-icon-btn"
                  onClick={() => handleDeleteComment(c.id)}
                  title="Delete"
                  style={{ color: "var(--accent)", background: "#2a2a2a" }}
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          </div>
        ))}

        {user && (
          <form
            onSubmit={handleComment}
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}
              required
            />
            <button
              type="submit"
              style={{
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: "var(--accent)",
                color: "white",
                fontWeight: "bold",
                border: "none",
              }}
            >
              Post Comment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
