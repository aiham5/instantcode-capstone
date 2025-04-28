import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaHeart, FaRegCommentDots, FaShareAlt, FaTrash } from "react-icons/fa";
import axios from "axios";

export default function PostCard({ post }) {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    try {
      await axios.post(`http://localhost:3000/api/posts/${post.id}/like`);
      setLiked(!liked);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/posts/${post.id}`);
      window.location.reload();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={post.author.profilePic} alt="pfp" className="pfp" />
        <div className="post-user-info">
          <span className="username">{post.author.username}</span>
          <span className="timestamp">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="post-content">{post.content}</div>

      <div className="post-actions">
        <button
          className={`heart-btn ${liked ? "liked" : ""}`}
          onClick={handleLike}
        >
          <FaHeart />
        </button>
        <button className="comment-btn">
          <FaRegCommentDots />
        </button>
        <button className="share-btn">
          <FaShareAlt />
        </button>
        {isAdmin && (
          <button className="delete-btn" onClick={handleDelete}>
            <FaTrash />
          </button>
        )}
      </div>
    </div>
  );
}
