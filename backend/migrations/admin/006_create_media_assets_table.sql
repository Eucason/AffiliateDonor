-- Reusable media assets for admin-managed content, campaigns, products, and branding.

CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    file_name TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    mime_type TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'svg', 'video', 'document', 'other')),
    size_bytes INTEGER NOT NULL DEFAULT 0,
    width INTEGER,
    height INTEGER,
    alt_text TEXT NOT NULL DEFAULT '',
    caption TEXT NOT NULL DEFAULT '',
    tags TEXT[] NOT NULL DEFAULT '{}',
    uploaded_by TEXT NOT NULL DEFAULT 'Admin Team',
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived'))
);

CREATE TABLE IF NOT EXISTS media_asset_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    area TEXT NOT NULL CHECK (area IN ('blog', 'content', 'causes', 'products', 'settings')),
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    label TEXT NOT NULL,
    path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_type ON media_assets(type);
CREATE INDEX IF NOT EXISTS idx_media_assets_uploaded_by ON media_assets(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_assets_uploaded_at ON media_assets(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_assets_status ON media_assets(status);
CREATE INDEX IF NOT EXISTS idx_media_assets_tags ON media_assets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_media_asset_usages_asset_id ON media_asset_usages(media_asset_id);
CREATE INDEX IF NOT EXISTS idx_media_asset_usages_area ON media_asset_usages(area);
