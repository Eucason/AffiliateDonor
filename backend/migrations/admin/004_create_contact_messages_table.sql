-- Contact message inbox foundation.

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread'
    CHECK (status IN ('unread', 'read', 'pending', 'replied', 'resolved', 'archived', 'spam')),
  severity TEXT NOT NULL DEFAULT 'normal'
    CHECK (severity IN ('normal', 'priority', 'urgent')),
  assigned_admin TEXT NOT NULL DEFAULT 'Unassigned',
  source TEXT NOT NULL DEFAULT 'contact_form',
  related_user_id UUID,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_assigned_admin ON contact_messages(assigned_admin);
CREATE INDEX IF NOT EXISTS idx_contact_messages_sender_email ON contact_messages(sender_email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_received_at ON contact_messages(received_at DESC);

CREATE TABLE IF NOT EXISTS contact_message_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES contact_messages(id) ON DELETE CASCADE,
  author_id UUID,
  author_name TEXT NOT NULL DEFAULT 'Admin Team',
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_message_notes_message_id ON contact_message_notes(message_id);
