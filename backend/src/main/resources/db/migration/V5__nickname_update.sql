-- Add nickname column to profile table
ALTER TABLE portfolio.profile
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100);
