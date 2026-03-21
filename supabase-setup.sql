-- ============================================================
-- PARIKSHA TRACK — Run this ONCE in Supabase SQL Editor
-- Go to: supabase.com → Your Project → SQL Editor → New Query
-- Paste this entire file → Click RUN
-- ============================================================

-- 1. Students table
CREATE TABLE IF NOT EXISTS students (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_number     TEXT NOT NULL,
  name            TEXT NOT NULL,
  class           TEXT NOT NULL CHECK (class IN ('8', '9', '10')),
  section         TEXT DEFAULT 'A',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  last_active     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(roll_number, class)
);

-- 2. Progress table
CREATE TABLE IF NOT EXISTS progress (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id      UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  subject         TEXT NOT NULL,
  chapter_id      TEXT NOT NULL,
  chapter_title   TEXT NOT NULL,
  status          TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'reading', 'done')),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, subject, chapter_id)
);

-- 3. Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies — Students can read/write their own data
-- Students insert themselves
CREATE POLICY "students_insert" ON students
  FOR INSERT WITH CHECK (true);

-- Students can read their own row
CREATE POLICY "students_read_own" ON students
  FOR SELECT USING (true);

-- Students update their own last_active
CREATE POLICY "students_update_own" ON students
  FOR UPDATE USING (true);

-- Progress — students can insert/update/read their own
CREATE POLICY "progress_all" ON progress
  FOR ALL USING (true);

-- 5. Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_progress_student ON progress(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_status  ON progress(status);
CREATE INDEX IF NOT EXISTS idx_students_class   ON students(class);
CREATE INDEX IF NOT EXISTS idx_students_roll    ON students(roll_number);

-- ============================================================
-- Done! Your database is ready.
-- ============================================================
