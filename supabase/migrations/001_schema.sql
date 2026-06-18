-- ============================================================
--  Mini Star Child Care — Database Schema v2.0
--  Run this in: Supabase → SQL Editor
-- ============================================================

-- ── 1. CLASSROOMS (no FK to users yet) ──────────────────────
CREATE TABLE IF NOT EXISTS classrooms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  age_group   TEXT NOT NULL,
  capacity    INTEGER DEFAULT 15,
  teacher_id  UUID,  -- FK added after users table
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. USERS (profile linked to auth.users) ─────────────────
CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  role         TEXT NOT NULL CHECK (role IN ('admin','teacher','parent')),
  username     TEXT UNIQUE NOT NULL,
  phone        TEXT,
  email        TEXT,
  classroom_id UUID REFERENCES classrooms(id) ON DELETE SET NULL,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Now add FK from classrooms → users
ALTER TABLE classrooms
  ADD CONSTRAINT fk_classrooms_teacher
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL;

-- ── 3. CHILDREN ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS children (
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
);

-- ── 4. CHILD ↔ PARENT LINK ──────────────────────────────────
CREATE TABLE IF NOT EXISTS child_parents (
  child_id  UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (child_id, parent_id)
);

-- ── 5. ATTENDANCE ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
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
);

-- ── 6. DAILY REPORTS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_reports (
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
);

-- ── 7. MESSAGES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id   UUID REFERENCES children(id) ON DELETE SET NULL,
  text       TEXT NOT NULL,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 8. ENROLLMENTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name          TEXT NOT NULL,
  parent_phone         TEXT,
  parent_email         TEXT,
  parent_username      TEXT,
  child_name           TEXT NOT NULL,
  child_dob            DATE,
  class_preference     UUID REFERENCES classrooms(id),
  allergies            TEXT,
  food_notes           TEXT,
  medical_notes        TEXT,
  emergency_name       TEXT,
  emergency_phone      TEXT,
  start_date           DATE,
  notes                TEXT,
  status               TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','waitlist')),
  assigned_classroom_id UUID REFERENCES classrooms(id),
  child_id             UUID REFERENCES children(id),
  parent_id            UUID REFERENCES users(id),
  submitted_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ── 9. INCIDENTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS incidents (
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
);

-- ── 10. MEDICATIONS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS medications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id        UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  dosage          TEXT NOT NULL,
  frequency       TEXT,
  instructions    TEXT,
  prescribed_by   TEXT,
  parent_authorized BOOLEAN DEFAULT FALSE,
  active          BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medication_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  child_id      UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  teacher_id    UUID NOT NULL REFERENCES users(id),
  given_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  dosage        TEXT,
  notes         TEXT,
  missed        BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 11. MILESTONES ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS milestones (
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
);

-- ── 12. PORTFOLIO ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio_entries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id      UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  teacher_id    UUID NOT NULL REFERENCES users(id),
  title         TEXT NOT NULL,
  description   TEXT,
  media_url     TEXT,
  media_type    TEXT CHECK (media_type IN ('photo','video','document','note')),
  milestone_id  UUID REFERENCES milestones(id) ON DELETE SET NULL,
  activity_tags TEXT[],
  liked_by      UUID[] DEFAULT '{}',
  date          DATE DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 13. EVENTS (CALENDAR) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
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
);

-- ── 14. NOTIFICATIONS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  message    TEXT,
  data       JSONB,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 15. UPDATED_AT TRIGGER ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
