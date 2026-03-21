-- ============================================================
-- PARIKSHA TRACK — Migration v2
-- Run this in Supabase SQL Editor (after the first setup SQL)
-- ============================================================

-- Add remarks table for teacher notes per student
CREATE TABLE IF NOT EXISTS remarks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id  UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  teacher_note TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE remarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "remarks_all" ON remarks FOR ALL USING (true);

CREATE INDEX IF NOT EXISTS idx_remarks_student ON remarks(student_id);

-- ============================================================
-- Done! Remarks table ready.
-- ============================================================
