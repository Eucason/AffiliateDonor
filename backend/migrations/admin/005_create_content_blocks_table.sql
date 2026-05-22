-- Structured website content blocks for admin-managed public content.

CREATE TABLE IF NOT EXISTS content_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area TEXT NOT NULL CHECK (area IN (
        'homepage',
        'banners',
        'impact-stories',
        'testimonials',
        'about',
        'footer'
    )),
    type TEXT NOT NULL CHECK (type IN (
        'homepage_hero',
        'announcement',
        'banner',
        'impact_story',
        'testimonial',
        'about_section',
        'footer_group',
        'featured_section'
    )),
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    summary TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    media_url TEXT,
    cta_label TEXT,
    cta_target TEXT,
    link_label TEXT,
    link_target TEXT,
    linked_entity_id TEXT,
    linked_entity_label TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    sort_order INTEGER NOT NULL DEFAULT 0,
    start_at TIMESTAMP WITH TIME ZONE,
    end_at TIMESTAMP WITH TIME ZONE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    updated_by TEXT NOT NULL DEFAULT 'Admin Team',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(area, slug)
);

CREATE INDEX IF NOT EXISTS idx_content_blocks_area ON content_blocks(area);
CREATE INDEX IF NOT EXISTS idx_content_blocks_type ON content_blocks(type);
CREATE INDEX IF NOT EXISTS idx_content_blocks_status ON content_blocks(status);
CREATE INDEX IF NOT EXISTS idx_content_blocks_scheduled_at ON content_blocks(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_content_blocks_updated_at ON content_blocks(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_blocks_metadata ON content_blocks USING GIN(metadata);
