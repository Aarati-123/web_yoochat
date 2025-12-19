// src/components/MyPostsFeed.js
import React, { useEffect, useState } from "react";
import { getMyPosts } from "../api/api";
import "./MyPostsFeed.css";

const API_URL = "http://localhost:3000";

function MyPostsFeed() {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await getMyPosts();
        const formatted = (res.posts || []).map((post) => ({
          ...post,
          images: (post.images || []).map((img) =>
            img.startsWith("http") ? img : `${API_URL}/${img.replace(/\\/g, "/")}`
          ),
          profile_image: post.profile_image
            ? post.profile_image.startsWith("http")
              ? post.profile_image
              : `${API_URL}/${post.profile_image.replace(/\\/g, "/")}`
            : `${API_URL}/avatar2.png`,
        }));
        setMyPosts(formatted);
      } catch (err) {
        console.error("MyPostsFeed error:", err);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading your posts...</p>;

  return (
    <div className="myPostsPanel">
      <h2 className="panelTitle">My Posts</h2>
      {myPosts.length === 0 && <p>No posts yet.</p>}
      {myPosts.map((post) => (
        <div key={post.post_id} className="postCard">
          <div className="postHeader">
            <div className="postHeaderLeft">
              <img src={post.profile_image} alt={post.username} className="postAvatar" />
              <span className="postUsername">{post.username}</span>
            </div>
            <span className="postTime">{new Date(post.created_at).toLocaleString()}</span>
          </div>
          {post.caption && <p className="postCaption">{post.caption}</p>}
          {post.images?.length > 0 && (
            <div className="postImages">
              <img src={post.images[0]} alt="Post" className="singleImage" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyPostsFeed;
