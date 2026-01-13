import React, { useEffect, useState } from "react";
import { getFriendsPosts, getSavedPosts, savePost, unsavePost } from "../api/api";
import "./FriendsFeed.css";

const API_URL = "http://localhost:3000";

function FriendsFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({}); // track saved status

  // Fetch friends' posts & saved posts
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        // 1️⃣ Fetch friends' posts
        const res = await getFriendsPosts();
        let formattedPosts = [];
        if (res.posts) {
          formattedPosts = res.posts.map((post) => ({
            ...post,
            images: (post.images || []).map((img) => {
              // If it's a data URL (base64), return as-is
              if (img.startsWith("data:")) return img;
              // If it's an http URL, return as-is
              if (img.startsWith("http")) return img;
              // Otherwise, construct the full URL
              return `${API_URL}/${img.replace(/\\/g, "/")}`;
            }),
            profile_image: post.profile_image
              ? post.profile_image.startsWith("data:")
                ? post.profile_image  // Base64 data URL
                : post.profile_image.startsWith("http")
                  ? post.profile_image
                  : `${API_URL}/${post.profile_image.replace(/\\/g, "/")}`
              : `${API_URL}/avatar2.png`,
            reactionsCount: post.reactions ? post.reactions.length : 0,
          }));
        }

        setPosts(formattedPosts);

        // 2️⃣ Initialize liked state
        const initialLikes = {};
        formattedPosts.forEach((p) => {
          initialLikes[p.post_id] = p.userLiked || false;
        });
        setLikedPosts(initialLikes);

        // 3️⃣ Fetch saved posts separately
        const savedRes = await getSavedPosts();
        const savedPostIds = savedRes.map(p => p.original_post_id);
        const initialSaved = {};
        formattedPosts.forEach((p) => {
          initialSaved[p.post_id] = savedPostIds.includes(p.post_id);
        });
        setSavedPosts(initialSaved);

      } catch (err) {
        console.error("Error fetching posts or saved posts:", err);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  // Toggle like
  const toggleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/feed/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id: postId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong!");
      setLikedPosts((prev) => ({ ...prev, [postId]: data.liked }));
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.post_id === postId ? { ...p, reactionsCount: data.totalLikes } : p
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
      alert("Something went wrong!");
    }
  };

  // Save post
  const handleSavePost = async (postId) => {
    try {
      if (savedPosts[postId]) {
        // Unsave
        const res = await unsavePost(postId);
        if (res.message === "Post unsaved successfully") {
          setSavedPosts((prev) => ({ ...prev, [postId]: false }));
        }
      } else {
        // Save
        const res = await savePost(postId);
        if (res.message === "Post saved successfully") {
          setSavedPosts((prev) => ({ ...prev, [postId]: true }));
        }
      }
    } catch (err) {
      console.error("Save/Unsave post error:", err);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading feed...</p>;
  if (!posts.length) return <p style={{ textAlign: "center" }}>No posts to show.</p>;

  return (
    <div className="friendsFeed">
      {posts.map((post) => (
        <div key={post.post_id} className="postCard">
          {/* Header */}
          <div className="postHeader">
            <div className="postHeaderLeft">
              <img src={post.profile_image} alt={post.username} className="postAvatar" />
              <span className="postUsername">{post.username}</span>
            </div>
            <span className="postTime">{new Date(post.created_at).toLocaleString()}</span>
          </div>

          {/* Caption */}
          {post.caption && <p className="postCaption">{post.caption}</p>}

          {/* Images */}
          {post.images?.length > 0 && (
            <div className="postImages">
              {post.images.length === 1 ? (
                <img src={post.images[0]} alt="Post" className="singleImage" />
              ) : (
                <div className="imageCarousel">
                  {post.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`post-${post.post_id}-${idx}`}
                      className="carouselImage"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="postActions">
            <button
              className={likedPosts[post.post_id] ? "reacted" : "like-btn"}
              onClick={() => toggleLike(post.post_id)}
            >
              💜
            </button>
            <span className="like-count">{post.reactionsCount}</span>

            <button
              className={savedPosts[post.post_id] ? "saved-btn" : "save-btn"}
              onClick={() => handleSavePost(post.post_id)}
            >
              {savedPosts[post.post_id] ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FriendsFeed;
