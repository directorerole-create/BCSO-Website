-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS sop_sections (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number       TEXT NOT NULL,
  title        TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sop_subsections (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id    UUID NOT NULL REFERENCES sop_sections(id) ON DELETE CASCADE,
  number        TEXT NOT NULL,
  title         TEXT NOT NULL,
  content       TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL
);

ALTER TABLE sop_sections    ENABLE ROW LEVEL SECURITY;
ALTER TABLE sop_subsections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_sop_sections"
  ON sop_sections FOR SELECT TO anon USING (true);

CREATE POLICY "public_read_sop_subsections"
  ON sop_subsections FOR SELECT TO anon USING (true);
