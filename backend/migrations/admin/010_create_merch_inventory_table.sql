-- Merchandise inventory fields for admin-managed products.

CREATE TABLE IF NOT EXISTS merch_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL UNIQUE REFERENCES admin_products(id) ON DELETE CASCADE,
    inventory_quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER NOT NULL DEFAULT 10,
    updated_by TEXT NOT NULL DEFAULT 'Admin Team',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS merch_product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES admin_products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sku TEXT NOT NULL,
    inventory_quantity INTEGER NOT NULL DEFAULT 0,
    price NUMERIC(12, 2),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(product_id, sku)
);

CREATE INDEX IF NOT EXISTS idx_merch_inventory_product_id ON merch_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_merch_inventory_low_stock
    ON merch_inventory(product_id)
    WHERE inventory_quantity <= low_stock_threshold;
CREATE INDEX IF NOT EXISTS idx_merch_product_variants_product_id ON merch_product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_merch_product_variants_sku ON merch_product_variants(sku);
