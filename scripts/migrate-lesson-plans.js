/* Migration: lesson_plans, child_milestones, week_themes */
const { Pool } = require('pg')

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_MJklGY3u9KDW@ep-falling-recipe-aisafuim-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })

async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lesson_plans (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      classroom_id UUID NOT NULL,
      date        DATE NOT NULL,
      age_key     TEXT NOT NULL DEFAULT 'preschool',
      theme       TEXT NOT NULL DEFAULT 'All About Me',
      activities  JSONB NOT NULL DEFAULT '[]',
      schedule    JSONB NOT NULL DEFAULT '[]',
      generated_at TIMESTAMPTZ DEFAULT NOW(),
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(classroom_id, date)
    )
  `)
  console.log('lesson_plans table ready')

  await pool.query(`
    CREATE TABLE IF NOT EXISTS child_milestones (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      child_id   UUID NOT NULL,
      skill_id   TEXT NOT NULL,
      level      TEXT NOT NULL DEFAULT 'Beginning',
      updated_by UUID,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(child_id, skill_id)
    )
  `)
  console.log('child_milestones table ready')

  await pool.query(`
    CREATE TABLE IF NOT EXISTS week_themes (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      classroom_id UUID NOT NULL,
      week_start   DATE NOT NULL,
      theme        TEXT NOT NULL DEFAULT 'All About Me',
      updated_at   TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(classroom_id, week_start)
    )
  `)
  console.log('week_themes table ready')

  console.log('Migration complete.')
  await pool.end()
}

run().catch(e => { console.error(e); process.exit(1) })
