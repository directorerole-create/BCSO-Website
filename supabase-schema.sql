-- ============================================
-- MIKES DEPARTMENT WEBSITE — SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================

-- ROSTER TABLE
-- Populated from Google Sheets via Apps Script webhook
CREATE TABLE IF NOT EXISTS public.roster (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  rank        TEXT NOT NULL,
  badge_number TEXT,
  callsign    TEXT,
  division    TEXT,
  status      TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'LOA')),
  avatar_url  TEXT,
  joined_date DATE,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- POLICIES TABLE
-- Populated from Google Docs via Apps Script webhook
CREATE TABLE IF NOT EXISTS public.policies (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT 'General',
  content       TEXT NOT NULL,
  doc_id        TEXT,
  policy_number TEXT,
  last_updated  TIMESTAMPTZ DEFAULT NOW()
);

-- STAFF TABLE
-- Populated from Google Sheets via Apps Script webhook
CREATE TABLE IF NOT EXISTS public.staff (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  rank            TEXT NOT NULL,
  role            TEXT NOT NULL,
  bio             TEXT,
  avatar_url      TEXT,
  badge_number    TEXT,
  division        TEXT,
  join_date       DATE,
  contact_discord TEXT,
  display_order   INT DEFAULT 0
);

-- Enable Row Level Security (read-only public access)
ALTER TABLE public.roster   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff    ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read roster"   ON public.roster   FOR SELECT USING (true);
CREATE POLICY "Public read policies" ON public.policies FOR SELECT USING (true);
CREATE POLICY "Public read staff"    ON public.staff    FOR SELECT USING (true);

-- Service role can write (used by sync webhooks)
CREATE POLICY "Service write roster"   ON public.roster   FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write policies" ON public.policies FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write staff"    ON public.staff    FOR ALL USING (auth.role() = 'service_role');

-- Indexes for fast search
CREATE INDEX IF NOT EXISTS idx_roster_name     ON public.roster   (name);
CREATE INDEX IF NOT EXISTS idx_roster_status   ON public.roster   (status);
CREATE INDEX IF NOT EXISTS idx_roster_division ON public.roster   (division);
CREATE INDEX IF NOT EXISTS idx_policies_cat    ON public.policies (category);
CREATE INDEX IF NOT EXISTS idx_staff_order     ON public.staff    (display_order);

-- ============================================
-- SAMPLE DATA (optional — delete before prod)
-- ============================================

INSERT INTO public.roster (name, rank, badge_number, callsign, division, status, joined_date) VALUES
  ('James Hargrove',  'Sheriff',              '001', 'ALPHA-1',   'Command',      'Active', '2022-01-15'),
  ('Maria Castillo',  'Undersheriff',         '002', 'ALPHA-2',   'Command',      'Active', '2022-02-20'),
  ('Derek Weston',    'Captain',              '010', 'BRAVO-1',   'Patrol',       'Active', '2022-03-10'),
  ('Tanya Brooks',    'Lieutenant',           '020', 'CHARLIE-1', 'Patrol',       'Active', '2022-04-05'),
  ('Sam Rivera',      'Sergeant',             '030', 'DELTA-1',   'Patrol',       'Active', '2022-05-12'),
  ('Chris Park',      'Senior Deputy',        '040', 'ECHO-1',    'Patrol',       'Active', '2022-06-18'),
  ('Alex Nguyen',     'Deputy',               '050', 'FOXTROT-1', 'Patrol',       'Active', '2022-07-22'),
  ('Jordan Lee',      'Deputy',               '051', 'FOXTROT-2', 'Patrol',       'LOA',    '2022-08-01'),
  ('Maya Singh',      'Detective',            '060', 'GOLF-1',    'Investigations','Active', '2022-09-14'),
  ('Tom Kazinski',    'Probationary Deputy',  '099', 'HOTEL-1',   'Patrol',       'Active', '2023-01-10');

INSERT INTO public.policies (title, category, content, policy_number) VALUES
  ('Use of Force Policy', 'Operations',
   E'## Use of Force Policy\n\n### 1. Purpose\nThis policy establishes guidelines for the use of force by all personnel of the department.\n\n### 2. Scope\nApplies to all sworn and non-sworn personnel during the performance of official duties.\n\n### 3. Policy\nForce shall only be used when necessary and proportional to the threat presented. Deputies shall use the minimum amount of force necessary to accomplish a lawful objective.\n\n### 4. Levels of Force\n- **Presence** — The mere presence of an officer may deter criminal activity.\n- **Verbal Commands** — Clear, direct instructions.\n- **Soft Techniques** — Escort holds, joint manipulation.\n- **Hard Techniques** — Punches, kicks, takedowns.\n- **Intermediate Weapons** — Tasers, batons, OC spray.\n- **Deadly Force** — Firearms. Only when there is an imminent threat of death or serious bodily injury.',
   'SOP-001'),

  ('Traffic Stop Procedures', 'Patrol',
   E'## Traffic Stop Procedures\n\n### 1. Initiating a Stop\nActivate emergency lights prior to initiating the traffic stop. Select a safe location with adequate visibility and space.\n\n### 2. Approach\nExit the vehicle using tactical approach methods. Stand to the rear of the B-pillar.\n\n### 3. Contact\nGreet the driver professionally. Request license, registration, and proof of insurance.\n\n### 4. Documentation\nAll stops must be logged in CAD with: unit number, location, plate, reason for stop, and disposition.',
   'SOP-002'),

  ('Radio Communications', 'Communications',
   E'## Radio Communications\n\n### Standard Callouts\n- **10-4** — Acknowledged\n- **10-6** — Busy\n- **10-7** — Out of Service\n- **10-8** — In Service\n- **10-20** — Location\n- **10-97** — Arrived on scene\n- **10-98** — Assignment complete\n\n### Phonetic Alphabet\nAlpha, Bravo, Charlie, Delta, Echo, Foxtrot, Golf, Hotel, India, Juliet, Kilo, Lima, Mike, November, Oscar, Papa, Quebec, Romeo, Sierra, Tango, Uniform, Victor, Whiskey, X-ray, Yankee, Zulu',
   'SOP-003');

INSERT INTO public.staff (name, rank, role, bio, badge_number, division, join_date, display_order) VALUES
  ('James Hargrove', 'Sheriff', 'Department Head',
   'Sheriff Hargrove has led the department since its founding, bringing over a decade of law enforcement roleplay experience. Known for his dedication to realistic procedures and community engagement.',
   '001', 'Command', '2022-01-15', 1),
  ('Maria Castillo', 'Undersheriff', 'Second in Command',
   'Undersheriff Castillo oversees day-to-day operations and manages department-wide policy implementation. She is the primary point of contact for inter-agency relations.',
   '002', 'Command', '2022-02-20', 2),
  ('Derek Weston', 'Captain', 'Patrol Division Commander',
   'Captain Weston commands the Patrol Division, ensuring all units operate within departmental guidelines. He runs weekly training scenarios for new deputies.',
   '010', 'Patrol', '2022-03-10', 3),
  ('Maya Singh', 'Detective', 'Lead Investigator',
   'Detective Singh heads the Investigations unit, specializing in complex multi-session casework. Her attention to detail has closed numerous high-profile investigations.',
   '060', 'Investigations', '2022-09-14', 4);
