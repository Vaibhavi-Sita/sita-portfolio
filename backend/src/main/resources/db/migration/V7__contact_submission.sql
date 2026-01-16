CREATE TABLE IF NOT EXISTS portfolio.contact_message (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status VARCHAR(30) NOT NULL DEFAULT 'new',
  user_agent TEXT,
  ip_address VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS idx_contact_message_created_at
ON portfolio.contact_message(created_at DESC);
