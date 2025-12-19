-- YooChat Database Schema Migration
-- Version: 001
-- Description: Initial database schema setup

-- =================== USERS TABLE ===================
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================== FRIENDSHIP TABLE ===================
CREATE TABLE IF NOT EXISTS friendship (
  friendship_id SERIAL PRIMARY KEY,
  user1_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  user2_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT no_self_friendship CHECK (user1_id != user2_id)
);

-- =================== BLOCKED USERS TABLE ===================
CREATE TABLE IF NOT EXISTS blockeduser (
  block_id SERIAL PRIMARY KEY,
  blocker_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  blocked_user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(blocker_id, blocked_user_id),
  CONSTRAINT no_self_block CHECK (blocker_id != blocked_user_id)
);

-- =================== MESSAGES TABLE ===================
CREATE TABLE IF NOT EXISTS message (
  message_id SERIAL PRIMARY KEY,
  sender_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  receiver_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_media BOOLEAN DEFAULT FALSE,
  message_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================== POSTS TABLE ===================
CREATE TABLE IF NOT EXISTS posts (
  post_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  caption TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================== POST IMAGES TABLE ===================
CREATE TABLE IF NOT EXISTS post_images (
  image_id SERIAL PRIMARY KEY,
  post_id INT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================== POST REACTIONS TABLE ===================
CREATE TABLE IF NOT EXISTS post_reactions (
  reaction_id SERIAL PRIMARY KEY,
  post_id INT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

-- =================== SAVED POSTS TABLE ===================
CREATE TABLE IF NOT EXISTS saved_posts (
  saved_id SERIAL PRIMARY KEY,
  original_post_id INT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
  saved_by_user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(original_post_id, saved_by_user_id)
);

-- =================== NOTIFICATIONS TABLE ===================
CREATE TABLE IF NOT EXISTS notifications (
  notification_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  actor_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================== INDEXES FOR PERFORMANCE ===================
-- Friendship indexes
CREATE INDEX IF NOT EXISTS idx_friendship_user1_id ON friendship(user1_id);
CREATE INDEX IF NOT EXISTS idx_friendship_user2_id ON friendship(user2_id);
CREATE INDEX IF NOT EXISTS idx_friendship_status ON friendship(status);

-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Post reactions indexes
CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_id ON post_reactions(user_id);

-- Saved posts indexes
CREATE INDEX IF NOT EXISTS idx_saved_posts_user_id ON saved_posts(saved_by_user_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_post_id ON saved_posts(original_post_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_message_sender_receiver ON message(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_message_time ON message(message_time DESC);
