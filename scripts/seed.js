/**
 * Mini Star Child Care — Neon Database Setup + Seed
 * Run: node scripts/seed.js
 * Env: DATABASE_URL must be set
 */
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_MJklGY3u9KDW@ep-falling-recipe-aisafuim-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })

async function run(sql, params = []) {
  return pool.query(sql, params)
}

async function main() {
  console.log('🔌 Connecting to Neon...')

  // ── DROP everything (fresh start) ───────────────────────────
  console.log('🗑  Dropping existing tables...')
  await run(`
    DROP TABLE IF EXISTS
      notifications, messages, medication_logs, medications,
      portfolio_entries, milestones, incidents, daily_reports,
      attendance, child_parents, enrollments, children,
      users, classrooms, events
    CASCADE
  `)

  // ── SCHEMA ──────────────────────────────────────────────────
  console.log('🏗  Creating schema...')

  await run(`
    CREATE TABLE classrooms (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name        TEXT NOT NULL,
      age_group   TEXT NOT NULL,
      capacity    INTEGER DEFAULT 15,
      teacher_id  UUID,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  await run(`
    CREATE TABLE users (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name          TEXT NOT NULL,
      role          TEXT NOT NULL CHECK (role IN ('admin','teacher','parent')),
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone         TEXT,
      email         TEXT,
      classroom_id  UUID REFERENCES classrooms(id) ON DELETE SET NULL,
      avatar_url    TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      updated_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  await run(`ALTER TABLE classrooms ADD CONSTRAINT fk_classrooms_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL`)

  await run(`
    CREATE TABLE children (
      id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name              TEXT NOT NULL,
      dob               DATE NOT NULL,
      classroom_id      UUID REFERENCES classrooms(id) ON DELETE SET NULL,
      allergies         TEXT,
      food_notes        TEXT,
      medical_notes     TEXT,
      emergency_contact TEXT,
      emergency_phone   TEXT,
      notes             TEXT,
      photo_url         TEXT,
      active            BOOLEAN DEFAULT TRUE,
      created_at        TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  await run(`
    CREATE TABLE child_parents (
      child_id  UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (child_id, parent_id)
    )
  `)

  await run(`
    CREATE TABLE attendance (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      child_id     UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      classroom_id UUID NOT NULL REFERENCES classrooms(id),
      date         DATE NOT NULL,
      status       TEXT NOT NULL CHECK (status IN ('present','absent','late','early_pickup','excused')),
      check_in     TIME,
      check_out    TIME,
      teacher_id   UUID REFERENCES users(id),
      notes        TEXT,
      created_at   TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (child_id, date)
    )
  `)

  await run(`
    CREATE TABLE daily_reports (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      child_id     UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      teacher_id   UUID NOT NULL REFERENCES users(id),
      classroom_id UUID NOT NULL REFERENCES classrooms(id),
      date         DATE NOT NULL DEFAULT CURRENT_DATE,
      mood         TEXT,
      meals        TEXT,
      nap_start    TIME,
      nap_end      TIME,
      activities   TEXT,
      note         TEXT,
      check_in     TIME,
      check_out    TIME,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  await run(`
    CREATE TABLE messages (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      from_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      to_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      child_id   UUID REFERENCES children(id) ON DELETE SET NULL,
      text       TEXT NOT NULL,
      read       BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  await run(`
    CREATE TABLE enrollments (
      id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      parent_name           TEXT NOT NULL,
      parent_phone          TEXT,
      parent_email          TEXT,
      parent_username       TEXT,
      child_name            TEXT NOT NULL,
      child_dob             DATE,
      class_preference      UUID REFERENCES classrooms(id),
      allergies             TEXT,
      food_notes            TEXT,
      medical_notes         TEXT,
      emergency_name        TEXT,
      emergency_phone       TEXT,
      start_date            DATE,
      notes                 TEXT,
      status                TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','waitlist')),
      assigned_classroom_id UUID REFERENCES classrooms(id),
      child_id              UUID REFERENCES children(id),
      parent_id             UUID REFERENCES users(id),
      submitted_at          TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  await run(`
    CREATE TABLE incidents (
      id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      child_id            UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      classroom_id        UUID NOT NULL REFERENCES classrooms(id),
      teacher_id          UUID NOT NULL REFERENCES users(id),
      date                DATE NOT NULL DEFAULT CURRENT_DATE,
      time                TIME,
      location            TEXT,
      description         TEXT NOT NULL,
      injury_type         TEXT,
      first_aid           TEXT,
      parent_notified     BOOLEAN DEFAULT FALSE,
      parent_notified_at  TIMESTAMPTZ,
      severity            TEXT CHECK (severity IN ('minor','moderate','severe')),
      status              TEXT DEFAULT 'open' CHECK (status IN ('open','reviewed','closed')),
      created_at          TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  await run(`
    CREATE TABLE medications (
      id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      child_id          UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      name              TEXT NOT NULL,
      dosage            TEXT NOT NULL,
      frequency         TEXT,
      instructions      TEXT,
      prescribed_by     TEXT,
      parent_authorized BOOLEAN DEFAULT FALSE,
      active            BOOLEAN DEFAULT TRUE,
      created_at        TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  await run(`
    CREATE TABLE medication_logs (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
      child_id      UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      teacher_id    UUID NOT NULL REFERENCES users(id),
      given_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      dosage        TEXT,
      notes         TEXT,
      missed        BOOLEAN DEFAULT FALSE,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  await run(`
    CREATE TABLE milestones (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      child_id    UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      category    TEXT NOT NULL,
      title       TEXT NOT NULL,
      description TEXT,
      status      TEXT DEFAULT 'not_started' CHECK (status IN ('not_started','emerging','developing','proficient','advanced')),
      age_group   TEXT,
      achieved_at DATE,
      noted_by    UUID REFERENCES users(id),
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  await run(`
    CREATE TABLE portfolio_entries (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      child_id      UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      teacher_id    UUID NOT NULL REFERENCES users(id),
      title         TEXT NOT NULL,
      description   TEXT,
      media_url     TEXT,
      media_type    TEXT CHECK (media_type IN ('photo','video','document','note')),
      milestone_id  UUID REFERENCES milestones(id) ON DELETE SET NULL,
      activity_tags TEXT[] DEFAULT '{}',
      liked_by      UUID[] DEFAULT '{}',
      date          DATE DEFAULT CURRENT_DATE,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  await run(`
    CREATE TABLE events (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title        TEXT NOT NULL,
      description  TEXT,
      type         TEXT CHECK (type IN ('holiday','closure','meeting','birthday','school_event','classroom_event')),
      start_date   DATE NOT NULL,
      end_date     DATE,
      start_time   TIME,
      end_time     TIME,
      all_day      BOOLEAN DEFAULT TRUE,
      classroom_id UUID REFERENCES classrooms(id) ON DELETE SET NULL,
      created_by   UUID REFERENCES users(id),
      visible_to   TEXT[] DEFAULT ARRAY['admin','teacher','parent'],
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  await run(`
    CREATE TABLE notifications (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type       TEXT NOT NULL,
      title      TEXT NOT NULL,
      message    TEXT,
      data       JSONB,
      read       BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  console.log('✅ Schema created.')

  // ── SEED DATA ────────────────────────────────────────────────
  console.log('🌱 Seeding data...')

  // Classrooms
  const { rows: classrooms } = await run(`
    INSERT INTO classrooms (id, name, age_group, capacity) VALUES
      ('11111111-0000-0000-0000-000000000001', 'Infants',    '0-12 months', 8),
      ('11111111-0000-0000-0000-000000000002', 'Toddlers',   '1-3 years',  12),
      ('11111111-0000-0000-0000-000000000003', 'Preschool',  '3-5 years',  15),
      ('11111111-0000-0000-0000-000000000004', 'School-Age', '5-12 years', 20)
    RETURNING id, name
  `)
  console.log('  ✓ Classrooms:', classrooms.map(c => c.name).join(', '))

  // Hash passwords
  const adminHash   = await bcrypt.hash('admin123', 10)
  const demoHash    = await bcrypt.hash('demo123',  10)

  // Users
  const { rows: users } = await run(`
    INSERT INTO users (id, name, role, username, password_hash, email, phone, classroom_id) VALUES
      ('22222222-0000-0000-0000-000000000001', 'Admin',         'admin',   'admin',    $1, 'admin@ministar.demo',    '555-0100', NULL),
      ('22222222-0000-0000-0000-000000000002', 'Maria Santos',  'teacher', 'teacher1', $2, 'teacher1@ministar.demo', '555-0201', '11111111-0000-0000-0000-000000000001'),
      ('22222222-0000-0000-0000-000000000003', 'James Lee',     'teacher', 'teacher2', $2, 'teacher2@ministar.demo', '555-0202', '11111111-0000-0000-0000-000000000003'),
      ('22222222-0000-0000-0000-000000000004', 'Sarah Johnson', 'parent',  'parent1',  $2, 'parent1@ministar.demo',  '555-0301', NULL),
      ('22222222-0000-0000-0000-000000000005', 'Carlos Garcia', 'parent',  'parent2',  $2, 'parent2@ministar.demo',  '555-0302', NULL),
      ('22222222-0000-0000-0000-000000000006', 'Amina Hassan',  'parent',  'parent3',  $2, 'parent3@ministar.demo',  '555-0303', NULL)
    RETURNING id, name, role
  `, [adminHash, demoHash])
  console.log('  ✓ Users:', users.map(u => `${u.name} (${u.role})`).join(', '))

  // Assign teachers to classrooms
  await run(`UPDATE classrooms SET teacher_id='22222222-0000-0000-0000-000000000002' WHERE id='11111111-0000-0000-0000-000000000001'`)
  await run(`UPDATE classrooms SET teacher_id='22222222-0000-0000-0000-000000000002' WHERE id='11111111-0000-0000-0000-000000000002'`)
  await run(`UPDATE classrooms SET teacher_id='22222222-0000-0000-0000-000000000003' WHERE id='11111111-0000-0000-0000-000000000003'`)
  await run(`UPDATE classrooms SET teacher_id='22222222-0000-0000-0000-000000000003' WHERE id='11111111-0000-0000-0000-000000000004'`)

  // Children
  const { rows: children } = await run(`
    INSERT INTO children (id, name, dob, classroom_id, allergies, emergency_contact, emergency_phone) VALUES
      ('33333333-0000-0000-0000-000000000001', 'Lily Johnson',  '2022-03-15', '11111111-0000-0000-0000-000000000002', 'Peanuts',  'Sarah Johnson', '555-0301'),
      ('33333333-0000-0000-0000-000000000002', 'Ethan Johnson', '2020-07-22', '11111111-0000-0000-0000-000000000003', NULL,       'Sarah Johnson', '555-0301'),
      ('33333333-0000-0000-0000-000000000003', 'Sofia Garcia',  '2021-11-05', '11111111-0000-0000-0000-000000000002', 'Dairy',    'Carlos Garcia', '555-0302'),
      ('33333333-0000-0000-0000-000000000004', 'Omar Hassan',   '2023-01-18', '11111111-0000-0000-0000-000000000001', NULL,       'Amina Hassan',  '555-0303'),
      ('33333333-0000-0000-0000-000000000005', 'Aisha Hassan',  '2019-09-30', '11111111-0000-0000-0000-000000000004', NULL,       'Amina Hassan',  '555-0303'),
      ('33333333-0000-0000-0000-000000000006', 'Noah Garcia',   '2018-05-12', '11111111-0000-0000-0000-000000000004', 'Bee sting','Carlos Garcia', '555-0302')
    RETURNING id, name
  `)
  console.log('  ✓ Children:', children.map(c => c.name).join(', '))

  // Child-parent links
  await run(`
    INSERT INTO child_parents (child_id, parent_id) VALUES
      ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000004'),
      ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000004'),
      ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000005'),
      ('33333333-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000005'),
      ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000006'),
      ('33333333-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000006')
  `)
  console.log('  ✓ Child-parent links set')

  // Attendance (today + yesterday)
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const t1 = '22222222-0000-0000-0000-000000000002'

  for (const [childId, classId, status] of [
    ['33333333-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'present'],
    ['33333333-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000003', 'present'],
    ['33333333-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002', 'absent'],
    ['33333333-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001', 'present'],
    ['33333333-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000004', 'late'],
    ['33333333-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000004', 'present'],
  ]) {
    await run(`
      INSERT INTO attendance (child_id, classroom_id, date, status, check_in, teacher_id)
      VALUES ($1,$2,$3,$4,'08:30',$5)
      ON CONFLICT (child_id, date) DO NOTHING
    `, [childId, classId, today, status, t1])

    await run(`
      INSERT INTO attendance (child_id, classroom_id, date, status, check_in, teacher_id)
      VALUES ($1,$2,$3,'present','08:15',$4)
      ON CONFLICT (child_id, date) DO NOTHING
    `, [childId, classId, yesterday, t1])
  }
  console.log('  ✓ Attendance records for today + yesterday')

  // Daily reports (today)
  for (const [childId, classId, mood, activities] of [
    ['33333333-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'happy',    'Painting, story time'],
    ['33333333-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000003', 'excited',  'Outdoor play, circle time'],
    ['33333333-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001', 'calm',     'Tummy time, music'],
    ['33333333-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000004', 'energetic', 'Reading, math games'],
  ]) {
    await run(`
      INSERT INTO daily_reports (child_id, teacher_id, classroom_id, date, mood, meals, nap_start, nap_end, activities, note)
      VALUES ($1,$2,$3,$4,$5,'Ate well – finished lunch','12:30','14:00',$6,'Great day overall!')
    `, [childId, t1, classId, today, mood, activities])
  }
  console.log('  ✓ Daily reports for today')

  // Events
  await run(`
    INSERT INTO events (title, type, start_date, all_day, visible_to) VALUES
      ('Fourth of July — Center Closed',  'holiday',      '2026-07-04', TRUE, ARRAY['admin','teacher','parent']),
      ('Labor Day — Center Closed',       'holiday',      '2026-09-07', TRUE, ARRAY['admin','teacher','parent']),
      ('Thanksgiving — Center Closed',    'holiday',      '2026-11-26', TRUE, ARRAY['admin','teacher','parent']),
      ('Christmas Break Begins',          'closure',      '2026-12-24', TRUE, ARRAY['admin','teacher','parent']),
      ('Parent-Teacher Conferences',      'meeting',      '2026-09-15', TRUE, ARRAY['admin','teacher','parent']),
      ('Fall Family Picnic',              'school_event', '2026-09-20', TRUE, ARRAY['admin','teacher','parent']),
      ('Summer Art Show',                 'school_event', '2026-07-15', TRUE, ARRAY['admin','teacher','parent'])
    ON CONFLICT DO NOTHING
  `)
  console.log('  ✓ Events')

  // Medications
  await run(`
    INSERT INTO medications (child_id, name, dosage, frequency, instructions, prescribed_by, parent_authorized) VALUES
      ('33333333-0000-0000-0000-000000000001', 'EpiPen', '0.15mg', 'As needed', 'Use only if severe allergic reaction. Call 911.', 'Dr. Kim', TRUE),
      ('33333333-0000-0000-0000-000000000003', 'Lactase drops', '5 drops', 'With dairy meals', 'Add to milk before feeding', 'Dr. Patel', TRUE)
  `)
  console.log('  ✓ Medications')

  // Portfolio entries
  await run(`
    INSERT INTO portfolio_entries (child_id, teacher_id, title, description, media_type, activity_tags, date) VALUES
      ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'First Letter E!', 'Ethan wrote his first letter today!', 'note', ARRAY['literacy','milestone'], CURRENT_DATE - 2),
      ('33333333-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000003', 'Math Achievement', 'Aisha completed addition up to 20.', 'note', ARRAY['math','milestone'], CURRENT_DATE - 1)
  `)
  console.log('  ✓ Portfolio entries')

  // Notifications
  const adminId = '22222222-0000-0000-0000-000000000001'
  const parent1 = '22222222-0000-0000-0000-000000000004'
  await run(`
    INSERT INTO notifications (user_id, type, title, message) VALUES
      ($1, 'enrollment', 'New Enrollment Request', 'A new enrollment request has been submitted.'),
      ($2, 'report',     'Daily Report Ready',      'Lily''s daily report for today is available.'),
      ($2, 'message',    'New Message',             'You have a new message from Maria Santos.')
  `, [adminId, parent1])
  console.log('  ✓ Notifications')

  console.log('\n🎉 Neon database seeded successfully!')
  console.log('\n📋 Demo credentials:')
  console.log('  admin    / admin123  (Admin)')
  console.log('  teacher1 / demo123   (Maria Santos)')
  console.log('  teacher2 / demo123   (James Lee)')
  console.log('  parent1  / demo123   (Sarah Johnson)')
  console.log('  parent2  / demo123   (Carlos Garcia)')
  console.log('  parent3  / demo123   (Amina Hassan)')
}

main()
  .then(() => process.exit(0))
  .catch((err) => { console.error('❌ Seed failed:', err.message); process.exit(1) })
  .finally(() => pool.end())
