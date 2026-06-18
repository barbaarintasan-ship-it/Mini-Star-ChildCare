-- ============================================================
--  Mini Star Child Care — Row Level Security Policies
--  Run AFTER 001_schema.sql
-- ============================================================

-- Helper function: get current user's role
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: check if current user is admin or teacher
CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
  SELECT role IN ('admin','teacher') FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── ENABLE RLS ON ALL TABLES ──────────────────────────────────
ALTER TABLE users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms       ENABLE ROW LEVEL SECURITY;
ALTER TABLE children         ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_parents    ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance       ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports    ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents        ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones       ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;

-- ── USERS ────────────────────────────────────────────────────
-- Anyone authenticated can read all users (for messaging, etc.)
CREATE POLICY "users_read_all" ON users
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE POLICY "users_insert_admin" ON users
  FOR INSERT TO authenticated WITH CHECK (current_user_role() = 'admin');

-- ── CLASSROOMS ───────────────────────────────────────────────
CREATE POLICY "classrooms_read_all" ON classrooms
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "classrooms_write_admin" ON classrooms
  FOR ALL TO authenticated USING (current_user_role() = 'admin')
  WITH CHECK (current_user_role() = 'admin');

-- ── CHILDREN ─────────────────────────────────────────────────
-- Staff sees all children; parent sees only their children
CREATE POLICY "children_staff_all" ON children
  FOR SELECT TO authenticated
  USING (is_staff());

CREATE POLICY "children_parent_own" ON children
  FOR SELECT TO authenticated
  USING (
    current_user_role() = 'parent' AND
    id IN (SELECT child_id FROM child_parents WHERE parent_id = auth.uid())
  );

CREATE POLICY "children_write_staff" ON children
  FOR ALL TO authenticated
  USING (is_staff()) WITH CHECK (is_staff());

-- ── CHILD_PARENTS ────────────────────────────────────────────
CREATE POLICY "child_parents_read_staff" ON child_parents
  FOR SELECT TO authenticated USING (is_staff());

CREATE POLICY "child_parents_read_own" ON child_parents
  FOR SELECT TO authenticated
  USING (parent_id = auth.uid());

CREATE POLICY "child_parents_write_admin" ON child_parents
  FOR ALL TO authenticated
  USING (current_user_role() = 'admin')
  WITH CHECK (current_user_role() = 'admin');

-- ── ATTENDANCE ───────────────────────────────────────────────
CREATE POLICY "attendance_staff_all" ON attendance
  FOR ALL TO authenticated
  USING (is_staff()) WITH CHECK (is_staff());

CREATE POLICY "attendance_parent_own" ON attendance
  FOR SELECT TO authenticated
  USING (
    current_user_role() = 'parent' AND
    child_id IN (SELECT child_id FROM child_parents WHERE parent_id = auth.uid())
  );

-- ── DAILY REPORTS ────────────────────────────────────────────
CREATE POLICY "reports_staff_all" ON daily_reports
  FOR ALL TO authenticated
  USING (is_staff()) WITH CHECK (is_staff());

CREATE POLICY "reports_parent_own" ON daily_reports
  FOR SELECT TO authenticated
  USING (
    current_user_role() = 'parent' AND
    child_id IN (SELECT child_id FROM child_parents WHERE parent_id = auth.uid())
  );

-- ── MESSAGES ─────────────────────────────────────────────────
CREATE POLICY "messages_own" ON messages
  FOR SELECT TO authenticated
  USING (from_id = auth.uid() OR to_id = auth.uid() OR is_staff());

CREATE POLICY "messages_insert_own" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (from_id = auth.uid());

CREATE POLICY "messages_update_own" ON messages
  FOR UPDATE TO authenticated
  USING (to_id = auth.uid());

-- ── ENROLLMENTS ──────────────────────────────────────────────
CREATE POLICY "enrollments_admin_all" ON enrollments
  FOR ALL TO authenticated
  USING (current_user_role() = 'admin')
  WITH CHECK (current_user_role() = 'admin');

-- Anyone (even unauthenticated via anon key) can insert enrollment requests
CREATE POLICY "enrollments_public_insert" ON enrollments
  FOR INSERT TO anon, authenticated WITH CHECK (TRUE);

CREATE POLICY "enrollments_parent_own" ON enrollments
  FOR SELECT TO authenticated
  USING (current_user_role() = 'parent' AND parent_email = (
    SELECT email FROM users WHERE id = auth.uid()
  ));

-- ── INCIDENTS ────────────────────────────────────────────────
CREATE POLICY "incidents_staff_all" ON incidents
  FOR ALL TO authenticated
  USING (is_staff()) WITH CHECK (is_staff());

CREATE POLICY "incidents_parent_own" ON incidents
  FOR SELECT TO authenticated
  USING (
    current_user_role() = 'parent' AND
    child_id IN (SELECT child_id FROM child_parents WHERE parent_id = auth.uid())
  );

-- ── MEDICATIONS ──────────────────────────────────────────────
CREATE POLICY "medications_staff_all" ON medications
  FOR ALL TO authenticated
  USING (is_staff()) WITH CHECK (is_staff());

CREATE POLICY "medications_parent_view" ON medications
  FOR SELECT TO authenticated
  USING (
    current_user_role() = 'parent' AND
    child_id IN (SELECT child_id FROM child_parents WHERE parent_id = auth.uid())
  );

CREATE POLICY "medication_logs_staff_all" ON medication_logs
  FOR ALL TO authenticated
  USING (is_staff()) WITH CHECK (is_staff());

CREATE POLICY "medication_logs_parent_view" ON medication_logs
  FOR SELECT TO authenticated
  USING (
    current_user_role() = 'parent' AND
    child_id IN (SELECT child_id FROM child_parents WHERE parent_id = auth.uid())
  );

-- ── MILESTONES ───────────────────────────────────────────────
CREATE POLICY "milestones_staff_all" ON milestones
  FOR ALL TO authenticated
  USING (is_staff()) WITH CHECK (is_staff());

CREATE POLICY "milestones_parent_view" ON milestones
  FOR SELECT TO authenticated
  USING (
    current_user_role() = 'parent' AND
    child_id IN (SELECT child_id FROM child_parents WHERE parent_id = auth.uid())
  );

-- ── PORTFOLIO ────────────────────────────────────────────────
CREATE POLICY "portfolio_staff_all" ON portfolio_entries
  FOR ALL TO authenticated
  USING (is_staff()) WITH CHECK (is_staff());

CREATE POLICY "portfolio_parent_view" ON portfolio_entries
  FOR SELECT TO authenticated
  USING (
    current_user_role() = 'parent' AND
    child_id IN (SELECT child_id FROM child_parents WHERE parent_id = auth.uid())
  );

-- Parents can like entries (update liked_by array)
CREATE POLICY "portfolio_parent_like" ON portfolio_entries
  FOR UPDATE TO authenticated
  USING (
    child_id IN (SELECT child_id FROM child_parents WHERE parent_id = auth.uid())
  );

-- ── EVENTS ───────────────────────────────────────────────────
CREATE POLICY "events_read_by_role" ON events
  FOR SELECT TO authenticated
  USING (current_user_role() = ANY(visible_to));

CREATE POLICY "events_write_admin" ON events
  FOR ALL TO authenticated
  USING (current_user_role() IN ('admin','teacher'))
  WITH CHECK (current_user_role() IN ('admin','teacher'));

-- ── NOTIFICATIONS ────────────────────────────────────────────
CREATE POLICY "notifications_own" ON notifications
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin/teacher can insert notifications for any user
CREATE POLICY "notifications_staff_insert" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (is_staff());
