/**
 * Mini Star — Curriculum tables migration
 * Run: node scripts/migrate-curriculum.js
 */
const { Pool } = require('pg')

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_MJklGY3u9KDW@ep-falling-recipe-aisafuim-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })

async function main() {
  console.log('Connecting to Neon...')

  await pool.query(`
    CREATE TABLE IF NOT EXISTS curriculum_units (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      week       TEXT NOT NULL,
      theme      TEXT NOT NULL,
      color      TEXT NOT NULL DEFAULT 'bg-teal/10 text-teal',
      sort_order INTEGER DEFAULT 99,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)
  console.log('curriculum_units table ready')

  await pool.query(`
    CREATE TABLE IF NOT EXISTS curriculum_activities (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      unit_id     UUID NOT NULL REFERENCES curriculum_units(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      age_group   TEXT NOT NULL DEFAULT '3-5 years',
      area        TEXT NOT NULL DEFAULT 'Other',
      duration    TEXT NOT NULL DEFAULT '20 min',
      created_by  UUID,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `)
  console.log('curriculum_activities table ready')

  // Seed only if empty
  const { rows: existing } = await pool.query('SELECT COUNT(*) FROM curriculum_units')
  if (parseInt(existing[0].count) > 0) {
    console.log('Data already exists — skipping seed')
    await pool.end()
    return
  }

  console.log('Seeding curriculum data...')

  const units = [
    { week: 'Week 1-2',   theme: 'All About Me',       color: 'bg-coral/10 text-coral', sort_order: 1 },
    { week: 'Week 3-4',   theme: 'Colors & Shapes',    color: 'bg-teal/10 text-teal',   sort_order: 2 },
    { week: 'Week 5-6',   theme: 'Animals & Nature',   color: 'bg-gold/10 text-gold',   sort_order: 3 },
    { week: 'Week 7-8',   theme: 'Numbers & Counting', color: 'bg-night/10 text-night', sort_order: 4 },
    { week: 'Week 9-10',  theme: 'Community Helpers',  color: 'bg-coral/10 text-coral', sort_order: 5 },
    { week: 'Week 11-12', theme: 'Weather & Seasons',  color: 'bg-teal/10 text-teal',   sort_order: 6 },
  ]

  const unitIds = {}
  for (const u of units) {
    const { rows } = await pool.query(
      'INSERT INTO curriculum_units (week,theme,color,sort_order) VALUES ($1,$2,$3,$4) RETURNING id',
      [u.week, u.theme, u.color, u.sort_order]
    )
    unitIds[u.theme] = rows[0].id
  }

  const activities = [
    // All About Me
    { theme: 'All About Me', title: 'My Family Portrait', description: 'Children draw their family and share with classmates.', age_group: '3-5 years', area: 'Social-Emotional', duration: '30 min' },
    { theme: 'All About Me', title: 'Name Recognition', description: 'Practice writing first name with large letter cards.', age_group: '3-5 years', area: 'Literacy', duration: '20 min' },
    { theme: 'All About Me', title: 'Body Tracing', description: 'Trace body outlines on large paper, label body parts.', age_group: '1-3 years', area: 'Science', duration: '25 min' },
    // Colors & Shapes
    { theme: 'Colors & Shapes', title: 'Shape Sorting', description: 'Sort everyday objects by shape — circle, square, triangle.', age_group: '1-3 years', area: 'Math', duration: '20 min' },
    { theme: 'Colors & Shapes', title: 'Rainbow Mixing', description: 'Explore color mixing with finger paints.', age_group: '0-12 months', area: 'Sensory', duration: '15 min' },
    { theme: 'Colors & Shapes', title: 'Shape Hunt', description: 'Find shapes hidden around the classroom.', age_group: '3-5 years', area: 'Math', duration: '25 min' },
    // Animals & Nature
    { theme: 'Animals & Nature', title: 'Animal Sounds', description: 'Listen to animal sounds, match to picture cards.', age_group: '0-12 months', area: 'Language', duration: '15 min' },
    { theme: 'Animals & Nature', title: 'Bug Safari', description: 'Outdoor exploration with magnifying glasses.', age_group: '3-5 years', area: 'Science', duration: '30 min' },
    { theme: 'Animals & Nature', title: 'Pet Story Time', description: 'Read "The Very Hungry Caterpillar," act out the story.', age_group: '1-3 years', area: 'Literacy', duration: '25 min' },
    // Numbers & Counting
    { theme: 'Numbers & Counting', title: 'Counting Bears', description: 'Count and group colorful bears by number and color.', age_group: '1-3 years', area: 'Math', duration: '20 min' },
    { theme: 'Numbers & Counting', title: 'Number Songs', description: 'Sing counting songs (5 Little Monkeys, 10 in the Bed).', age_group: '0-12 months', area: 'Music', duration: '15 min' },
    { theme: 'Numbers & Counting', title: 'Number Writing', description: 'Trace numbers 1-10, count matching dot patterns.', age_group: '3-5 years', area: 'Math', duration: '25 min' },
    // Community Helpers
    { theme: 'Community Helpers', title: 'Dress-Up Roles', description: 'Dramatic play with costumes: doctor, firefighter, chef.', age_group: '3-5 years', area: 'Social-Emotional', duration: '30 min' },
    { theme: 'Community Helpers', title: 'Thank You Cards', description: 'Create cards for community helpers in the neighborhood.', age_group: '5-12 years', area: 'Literacy', duration: '25 min' },
    { theme: 'Community Helpers', title: 'Build a Town', description: 'Use blocks to build roads, fire stations, and schools.', age_group: '3-5 years', area: 'STEM', duration: '35 min' },
    // Weather & Seasons
    { theme: 'Weather & Seasons', title: 'Weather Chart', description: 'Daily weather journal — draw sun, clouds, rain, or snow.', age_group: '3-5 years', area: 'Science', duration: '10 min' },
    { theme: 'Weather & Seasons', title: 'Season Collages', description: 'Create seasonal artwork with nature materials.', age_group: '1-3 years', area: 'Art', duration: '30 min' },
    { theme: 'Weather & Seasons', title: 'Rain Experiment', description: 'Water cycle in a bag: tape a zip-lock to a sunny window.', age_group: '5-12 years', area: 'Science', duration: '20 min' },
  ]

  for (const a of activities) {
    await pool.query(
      'INSERT INTO curriculum_activities (unit_id,title,description,age_group,area,duration) VALUES ($1,$2,$3,$4,$5,$6)',
      [unitIds[a.theme], a.title, a.description, a.age_group, a.area, a.duration]
    )
  }

  console.log('Seeded', activities.length, 'activities across', units.length, 'units')
  await pool.end()
  console.log('Done.')
}

main().catch((e) => { console.error(e); process.exit(1) })
