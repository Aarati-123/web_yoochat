-- Migration to add image data storage
-- This allows images to be stored directly in the database instead of file paths

-- Add image_data column to post_images table to store base64 encoded images
ALTER TABLE post_images 
ADD COLUMN IF NOT EXISTS image_data TEXT,
ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100);

-- Add image_data column to users table for profile images
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_image_data TEXT,
ADD COLUMN IF NOT EXISTS profile_image_mime_type VARCHAR(100);

-- Update existing records note: run this manually if you have existing data
-- This is commented out because it requires manual review
-- UPDATE post_images SET image_url = NULL WHERE image_data IS NOT NULL;
