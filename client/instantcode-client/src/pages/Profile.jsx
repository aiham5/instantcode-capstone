import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/users/${id}`);
        setProfile(res.data);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("http://localhost:3000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch {
          setUser(null);
        }
      }
    };

    fetchProfile();
    fetchUser();
  }, [id]);

  if (loading) return <Loader />;
  if (!profile) return <p>User not found</p>;

  return (
    <div className="page">
      <div className="post-card" style={{ textAlign: "center" }}>
        <img
          src={profile.image || "/default-pfp.png"}
          alt="User"
          className="pfp"
          style={{ width: "80px", height: "80px" }}
        />
        <h2 style={{ marginTop: "10px" }}>{profile.username}</h2>
        <p>{profile.bio}</p>
        {user?.id === profile.id && (
          <Link to={`/edit-profile`}>
            <button style={{ marginTop: "10px" }}>Edit Profile</button>
          </Link>
        )}
      </div>

      <h3 style={{ marginBottom: "1rem" }}>Posts by {profile.username}</h3>
      <div className="post-feed">
        {profile.posts.length === 0 && <p>No posts yet.</p>}
        {profile.posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-user-info">
                <img
                  src={profile.image || "/default-pfp.png"}
                  alt="pfp"
                  className="pfp"
                />
                <strong>{profile.username}</strong>
              </div>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="post-content">
              <img
                src={post.image}
                alt="Post"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  marginTop: "10px",
                }}
              />
              <p style={{ marginTop: "10px" }}>{post.caption}</p>
            </div>

            <div className="post-actions">
              <Link to={`/posts/${post.id}`}>💬</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
