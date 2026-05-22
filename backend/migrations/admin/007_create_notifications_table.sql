CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  severity TEXT NOT NULL DEFAULT 'info',
  source_label TEXT NOT NULL DEFAULT '',
  source_path TEXT NOT NULL DEFAULT '',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT admin_notifications_status_check CHECK (status IN ('unread', 'read', 'archived')),
  CONSTRAINT admin_notifications_severity_check CHECK (severity IN ('info', 'success', 'warning', 'critical'))
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_status
  ON admin_notifications (status);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_type
  ON admin_notifications (type);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at
  ON admin_notifications (created_at DESC);

CREATE TABLE IF NOT EXISTS admin_notification_preferences (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  email_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
