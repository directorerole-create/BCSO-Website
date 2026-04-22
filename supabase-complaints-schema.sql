-- Run this in your Supabase SQL editor to set up the complaints table

CREATE TABLE IF NOT EXISTS complaints (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  report_no           TEXT        NOT NULL,
  complainant_name    TEXT        NOT NULL,
  website_id          TEXT        NOT NULL,
  profile_link        TEXT,
  officer_name        TEXT        NOT NULL,
  officer_website_id  TEXT,
  subdivision         TEXT,
  date_of_incident    DATE        NOT NULL,
  time_of_incident    TIME        NOT NULL,
  description         TEXT        NOT NULL,
  evidence_name       TEXT,
  status              TEXT        NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','investigating','resolved','dismissed')),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a complaint (public form)
CREATE POLICY "public_insert_complaints" ON complaints
  FOR INSERT TO anon WITH CHECK (true);
