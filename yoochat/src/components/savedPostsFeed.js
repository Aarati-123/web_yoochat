// src/components/SavedPostsFeed.js
import React, { useEffect, useState } from "react";
import { getSavedPosts, unsavePost } from "../api/api";
import "./savedPostsFeed.css";

const API_URL = "http://localhost:3000";

function SavedPostsFeed() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      setLoading(true);
      try {
        const res = await getSavedPosts();
        const formatted = (res || []).map((post) => ({
          ...post,
          images: (post.images || []).map((img) =>
            img.startsWith("http") ? img : `${API_URL}/${img.replace(/\\/g, "/")}`
          ),
          profile_image: post.post_owner_profile_image
            ? post.post_owner_profile_image.startsWith("http")
              ? post.post_owner_profile_image
              : `${API_URL}/${post.post_owner_profile_image.replace(/\\/g, "/")}`
            : `${API_URL}/avatar2.png`,
        }));
        setSavedPosts(formatted);
      } catch (err) {
        console.error("SavedPostsFeed error:", err);
      }
      setLoading(false);
    }
    fetchSaved();
  }, []);

  const handleUnsave = async (postId) => {
    const res = await unsavePost(postId);
    if (res.message === "Post unsaved successfully") {
      setSavedPosts((prev) =>
        prev.filter((p) => p.original_post_id !== postId)
      );
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading saved posts...</p>;

  return (
    <div className="savedPanel">
      <h2 className="panelTitle">Saved Posts</h2>
      {savedPosts.length === 0 && <p>No saved posts.</p>}
      {savedPosts.map((post) => (
        <div key={post.original_post_id} className="postCard">
          <div className="postHeader">
            <div className="postHeaderLeft">
              <img src={post.profile_image} alt="" className="postAvatar" />
              <span className="postUsername">{post.post_owner_username}</span>
            </div>
            <span className="postTime">
              {new Date(post.post_created_at).toLocaleString()}
            </span>
          </div>
          {post.caption && <p className="postCaption">{post.caption}</p>}
          {post.images?.length > 0 && (
            <div className="postImages">
              <img src={post.images[0]} alt="Saved" className="singleImage" />
            </div>
          )}
          <div className="postActions">
            <button className="saved-btn" onClick={() => handleUnsave(post.original_post_id)}>
              Saved
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SavedPostsFeed;
