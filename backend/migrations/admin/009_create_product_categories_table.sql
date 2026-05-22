-- Product commerce taxonomy and admin product catalog fields.

CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL DEFAULT 'all' CHECK (type IN ('affiliate', 'merch', 'all')),
    description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('affiliate', 'merch')),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    brand TEXT NOT NULL DEFAULT '',
    sku TEXT,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    image_url TEXT NOT NULL DEFAULT '',
    gallery_images TEXT[] NOT NULL DEFAULT '{}',
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    affiliate_url TEXT,
    linked_cause_id TEXT,
    linked_cause_name TEXT NOT NULL DEFAULT '',
    allocation_percent NUMERIC(5, 2) NOT NULL DEFAULT 0,
    description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'disabled')),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    click_count INTEGER NOT NULL DEFAULT 0,
    conversion_count INTEGER NOT NULL DEFAULT 0,
    estimated_contribution NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT admin_products_affiliate_url_required
        CHECK (type <> 'affiliate' OR affiliate_url IS NOT NULL),
    CONSTRAINT admin_products_sku_for_merch
        CHECK (type <> 'merch' OR sku IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS product_conversion_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES admin_products(id) ON DELETE CASCADE,
    source TEXT NOT NULL CHECK (source IN ('affiliate_click', 'affiliate_conversion', 'merch_purchase')),
    label TEXT NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,
    conversions INTEGER NOT NULL DEFAULT 0,
    estimated_contribution NUMERIC(12, 2) NOT NULL DEFAULT 0,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_categories_type ON product_categories(type);
CREATE INDEX IF NOT EXISTS idx_product_categories_status ON product_categories(status);
CREATE INDEX IF NOT EXISTS idx_admin_products_type ON admin_products(type);
CREATE INDEX IF NOT EXISTS idx_admin_products_status ON admin_products(status);
CREATE INDEX IF NOT EXISTS idx_admin_products_category_id ON admin_products(category_id);
CREATE INDEX IF NOT EXISTS idx_admin_products_linked_cause_id ON admin_products(linked_cause_id);
CREATE INDEX IF NOT EXISTS idx_admin_products_featured ON admin_products(featured);
CREATE INDEX IF NOT EXISTS idx_admin_products_updated_at ON admin_products(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_conversion_events_product_id ON product_conversion_events(product_id);
CREATE INDEX IF NOT EXISTS idx_product_conversion_events_source ON product_conversion_events(source);
CREATE INDEX IF NOT EXISTS idx_product_conversion_events_occurred_at ON product_conversion_events(occurred_at DESC);
