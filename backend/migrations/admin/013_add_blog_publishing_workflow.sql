-- Adds richer admin publishing workflow fields for blog posts.

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS read_time_minutes INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unique_visitors INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS average_read_seconds INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS conversion_assist_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMP WITH TIME ZONE;

DO $$
BEGIN
  ALTER TABLE blog_posts DROP CONSTRAINT IF EXISTS blog_posts_status_check;
  ALTER TABLE blog_posts
    ADD CONSTRAINT blog_posts_status_check
    CHECK (status IN ('draft', 'published', 'archived', 'scheduled'));
END $$;

CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled_at ON blog_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_archived_at ON blog_posts(archived_at);
