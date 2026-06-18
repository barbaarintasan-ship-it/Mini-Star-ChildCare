-- ============================================================
--  Mini Star Child Care — Demo Seed Data
--  NOTE: Auth users must be created FIRST via Supabase Dashboard
--  or via the seed script. Then run this to insert profile rows.
--
--  Demo credentials (create these in Supabase Auth first):
--    admin@ministar.demo      → admin123
--    teacher1@ministar.demo   → demo123
--    teacher2@ministar.demo   → demo123
--    parent1@ministar.demo    → demo123
--    parent2@ministar.demo    → demo123
--    parent3@ministar.demo    → demo123
--
--  After creating auth users, replace the UUIDs below with the
--  actual UUIDs from auth.users table, then run this script.
-- ============================================================

-- ── CLASSROOMS ───────────────────────────────────────────────
INSERT INTO classrooms (id, name, age_group, capacity) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Infants',    '0-12 months', 8),
  ('11111111-0000-0000-0000-000000000002', 'Toddlers',   '1-3 years',   12),
  ('11111111-0000-0000-0000-000000000003', 'Preschool',  '3-5 years',   15),
  ('11111111-0000-0000-0000-000000000004', 'School-Age', '5-12 years',  20)
ON CONFLICT (id) DO NOTHING;

-- ── USERS (replace auth_uid_* with real Supabase Auth UUIDs) ─
-- Example: after creating auth users, get their UUIDs from
-- SELECT id, email FROM auth.users;
-- Then replace the placeholders below.

-- INSERT INTO users (id, name, role, username, email, classroom_id) VALUES
--   ('ADMIN_AUTH_UUID',    'Admin',         'admin',   'admin',    'admin@ministar.demo',    NULL),
--   ('TEACHER1_AUTH_UUID', 'Maria Santos',  'teacher', 'teacher1', 'teacher1@ministar.demo', '11111111-0000-0000-0000-000000000001'),
--   ('TEACHER2_AUTH_UUID', 'James Lee',     'teacher', 'teacher2', 'teacher2@ministar.demo', '11111111-0000-0000-0000-000000000003'),
--   ('PARENT1_AUTH_UUID',  'Sarah Johnson', 'parent',  'parent1',  'parent1@ministar.demo',  NULL),
--   ('PARENT2_AUTH_UUID',  'Carlos Garcia', 'parent',  'parent2',  'parent2@ministar.demo',  NULL),
--   ('PARENT3_AUTH_UUID',  'Amina Hassan',  'parent',  'parent3',  'parent3@ministar.demo',  NULL);

-- ── HELPER: CREATE DEMO USERS VIA AUTH ADMIN API ─────────────
-- If using Supabase CLI, use: supabase seed
-- Or create users manually in Dashboard → Authentication → Users

-- ── EVENTS (sample) ──────────────────────────────────────────
INSERT INTO events (title, type, start_date, all_day, visible_to) VALUES
  ('Fourth of July — Center Closed',  'holiday',      '2026-07-04', TRUE, ARRAY['admin','teacher','parent']),
  ('Labor Day — Center Closed',       'holiday',      '2026-09-07', TRUE, ARRAY['admin','teacher','parent']),
  ('Thanksgiving — Center Closed',    'holiday',      '2026-11-26', TRUE, ARRAY['admin','teacher','parent']),
  ('Christmas Break Begins',          'closure',      '2026-12-24', TRUE, ARRAY['admin','teacher','parent']),
  ('Parent-Teacher Conferences',      'meeting',      '2026-09-15', TRUE, ARRAY['admin','teacher','parent']),
  ('Fall Family Picnic',              'school_event', '2026-09-20', TRUE, ARRAY['admin','teacher','parent'])
ON CONFLICT DO NOTHING;
