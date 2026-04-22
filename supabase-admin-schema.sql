-- Run this in your Supabase SQL editor

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  username      TEXT        UNIQUE NOT NULL,
  display_name  TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'moderator')),
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  token         TEXT        PRIMARY KEY,
  admin_user_id UUID        REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Lock down both tables — only service_role (server API routes) can access them
ALTER TABLE admin_users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
-- No public policies = anon/authenticated users get zero access

-- Create your first superadmin account
-- Password below is SHA-256("changeme") — CHANGE THIS after first login by recreating via the UI
-- To generate a hash: run this in browser console:
--   crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourpassword'))
--     .then(b => [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join(''))

INSERT INTO admin_users (username, display_name, role, password_hash)
VALUES (
  'admin',
  'Administrator',
  'superadmin',
  -- SHA-256 of "changeme"
  '057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86'
)
ON CONFLICT (username) DO NOTHING;
