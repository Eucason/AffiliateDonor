-- Admin campaign management fields.
-- This migration is written to be safe for databases that already have a causes/campaigns table.

ALTER TABLE IF EXISTS causes
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS main_image_url TEXT,
  ADD COLUMN IF NOT EXISTS gallery_image_urls TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS impact_metric TEXT,
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_causes_admin_status ON causes(status);
CREATE INDEX IF NOT EXISTS idx_causes_admin_featured ON causes(featured);
CREATE INDEX IF NOT EXISTS idx_causes_admin_verified ON causes(verified);
CREATE INDEX IF NOT EXISTS idx_causes_admin_slug ON causes(slug);
