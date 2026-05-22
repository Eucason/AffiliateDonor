CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor TEXT NOT NULL,
  actor_role TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_label TEXT NOT NULL DEFAULT '',
  entity_id TEXT NOT NULL DEFAULT '',
  ip_address TEXT NOT NULL DEFAULT '',
  device TEXT NOT NULL DEFAULT '',
  severity TEXT NOT NULL DEFAULT 'info',
  before_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  after_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT admin_audit_logs_severity_check CHECK (severity IN ('info', 'warning', 'critical'))
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_actor
  ON admin_audit_logs (actor);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action
  ON admin_audit_logs (action);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_entity
  ON admin_audit_logs (entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at
  ON admin_audit_logs (created_at DESC);

CREATE TABLE IF NOT EXISTS admin_approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'normal',
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  requested_by TEXT NOT NULL,
  related_entity_id TEXT NOT NULL DEFAULT '',
  related_entity_label TEXT NOT NULL DEFAULT '',
  related_entity_path TEXT NOT NULL DEFAULT '',
  impact TEXT NOT NULL DEFAULT '',
  reviewer TEXT,
  reviewed_at TIMESTAMPTZ,
  comments JSONB NOT NULL DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT admin_approval_requests_status_check CHECK (status IN ('pending', 'approved', 'rejected', 'changes_requested')),
  CONSTRAINT admin_approval_requests_priority_check CHECK (priority IN ('normal', 'high', 'urgent'))
);

CREATE INDEX IF NOT EXISTS idx_admin_approval_requests_status
  ON admin_approval_requests (status);

CREATE INDEX IF NOT EXISTS idx_admin_approval_requests_type
  ON admin_approval_requests (type);

CREATE INDEX IF NOT EXISTS idx_admin_approval_requests_submitted_at
  ON admin_approval_requests (submitted_at DESC);
