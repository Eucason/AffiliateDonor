-- Analytics event capture for admin reporting and exports.

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    source_type TEXT NOT NULL,
    source_id TEXT,
    actor_id TEXT,
    actor_email TEXT,
    campaign_id TEXT,
    product_id TEXT,
    content_id TEXT,
    amount NUMERIC(12, 2),
    currency TEXT NOT NULL DEFAULT 'USD',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_source ON analytics_events(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_campaign_id ON analytics_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_product_id ON analytics_events(product_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_content_id ON analytics_events(content_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_occurred_at ON analytics_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_metadata ON analytics_events USING GIN(metadata);
