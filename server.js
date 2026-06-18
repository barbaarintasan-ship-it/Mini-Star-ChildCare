const express = require('express')
const { Pool } = require('pg')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const path = require('path')

const PORT = process.env.PORT || 8080
const JWT_SECRET = process.env.JWT_SECRET || 'ministar-dev-secret-change-in-prod'
const DATABASE_URL = process.env.DATABASE_URL

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 10 })

const app = express()
app.use(express.json({ limit: '10mb' }))

// ── Auth middleware ──────────────────────────────────────────
function auth(req, res, next) {
  const h = req.headers.authorization
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  try { req.user = jwt.verify(h.slice(7), JWT_SECRET); next() }
  catch { res.status(401).json({ error: 'Invalid token' }) }
}

function role(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}

async function parentChildIds(parentId) {
  const { rows } = await pool.query('SELECT child_id FROM child_parents WHERE parent_id=$1', [parentId])
  return rows.map(r => r.child_id)
}

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' })
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE lower(username)=lower($1)', [username])
    const u = rows[0]
    if (!u) return res.status(401).json({ error: 'Wrong username or password' })
    const ok = await bcrypt.compare(password, u.password_hash)
    if (!ok) return res.status(401).json({ error: 'Wrong username or password' })
    const token = jwt.sign({ id: u.id, role: u.role, name: u.name }, JWT_SECRET, { expiresIn: '7d' })
    const { password_hash, ...safe } = u
    res.json({ token, user: safe })
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }) }
})

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id,name,role,username,email,phone,classroom_id,avatar_url,created_at FROM users WHERE id=$1',
      [req.user.id]
    )
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

// ═══════════════════════════════════════════════════════════
// CLASSROOMS
// ═══════════════════════════════════════════════════════════

app.get('/api/classrooms', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT c.*,
        CASE WHEN u.id IS NOT NULL THEN json_build_object('id',u.id,'name',u.name) ELSE NULL END AS teacher
      FROM classrooms c LEFT JOIN users u ON u.id=c.teacher_id ORDER BY c.name
    `)
    res.json(rows)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/classrooms', auth, role('admin'), async (req, res) => {
  const { name, age_group, capacity, teacher_id } = req.body
  try {
    const { rows } = await pool.query(
      'INSERT INTO classrooms (name,age_group,capacity,teacher_id) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, age_group, capacity ?? 15, teacher_id ?? null]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.patch('/api/classrooms/:id', auth, role('admin'), async (req, res) => {
  const fields = ['name','age_group','capacity','teacher_id']
  const updates = []; const vals = []; let i = 1
  for (const f of fields) if (req.body[f] !== undefined) { updates.push(`${f}=$${i++}`); vals.push(req.body[f]) }
  if (!updates.length) return res.json({ ok: true })
  vals.push(req.params.id)
  try {
    const { rows } = await pool.query(`UPDATE classrooms SET ${updates.join(',')} WHERE id=$${i} RETURNING *`, vals)
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

// ═══════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════

app.get('/api/users', auth, role('admin','teacher'), async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id,name,role,username,email,phone,classroom_id,avatar_url FROM users ORDER BY name')
    res.json(rows)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.get('/api/users/staff', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT u.id,u.name,u.role,u.username,u.email,u.phone,u.classroom_id,u.avatar_url,
        CASE WHEN c.id IS NOT NULL THEN json_build_object('id',c.id,'name',c.name) ELSE NULL END AS classroom
      FROM users u LEFT JOIN classrooms c ON c.id=u.classroom_id
      WHERE u.role IN ('admin','teacher') ORDER BY u.name
    `)
    res.json(rows)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.get('/api/users/parents', auth, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id,name,role,username,email,phone,avatar_url FROM users WHERE role='parent' ORDER BY name")
    res.json(rows)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/users', auth, role('admin'), async (req, res) => {
  const { name, role: r, username, email, phone, classroom_id, password } = req.body
  if (!password) return res.status(400).json({ error: 'Password required' })
  try {
    const hash = await bcrypt.hash(password, 10)
    const { rows } = await pool.query(
      'INSERT INTO users (name,role,username,email,phone,classroom_id,password_hash) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id,name,role,username,email,phone,classroom_id',
      [name, r, username, email, phone, classroom_id ?? null, hash]
    )
    res.json(rows[0])
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Username already taken' })
    res.status(500).json({ error: 'Server error' })
  }
})

app.patch('/api/users/:id', auth, async (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Forbidden' })
  const fields = ['name','phone','email','classroom_id','role','avatar_url']
  const updates = []; const vals = []; let i = 1
  for (const f of fields) if (req.body[f] !== undefined) { updates.push(`${f}=$${i++}`); vals.push(req.body[f]) }
  if (!updates.length) return res.json({ ok: true })
  vals.push(req.params.id)
  try {
    const { rows } = await pool.query(
      `UPDATE users SET ${updates.join(',')} WHERE id=$${i} RETURNING id,name,role,username,email,phone,classroom_id,avatar_url`,
      vals
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

// ═══════════════════════════════════════════════════════════
// CHILDREN
// ═══════════════════════════════════════════════════════════

app.get('/api/children', auth, async (req, res) => {
  try {
    let filter = ''; const params = []
    if (req.user.role === 'parent') {
      const ids = await parentChildIds(req.user.id)
      if (!ids.length) return res.json([])
      filter = 'AND ch.id = ANY($1::uuid[])'; params.push(ids)
    }
    const { rows } = await pool.query(`
      SELECT ch.*,
        CASE WHEN cl.id IS NOT NULL THEN json_build_object('id',cl.id,'name',cl.name,'age_group',cl.age_group) ELSE NULL END AS classroom,
        COALESCE(json_agg(json_build_object('parent',json_build_object('id',u.id,'name',u.name,'email',u.email,'phone',u.phone)))
          FILTER (WHERE u.id IS NOT NULL),'[]') AS parents
      FROM children ch
      LEFT JOIN classrooms cl ON cl.id=ch.classroom_id
      LEFT JOIN child_parents cp ON cp.child_id=ch.id
      LEFT JOIN users u ON u.id=cp.parent_id
      WHERE ch.active=true ${filter}
      GROUP BY ch.id,cl.id ORDER BY ch.name
    `, params)
    res.json(rows)
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }) }
})

app.get('/api/children/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT ch.*,
        CASE WHEN cl.id IS NOT NULL THEN row_to_json(cl.*) ELSE NULL END AS classroom,
        COALESCE(json_agg(json_build_object('parent',json_build_object('id',u.id,'name',u.name,'email',u.email,'phone',u.phone,'username',u.username)))
          FILTER (WHERE u.id IS NOT NULL),'[]') AS parents
      FROM children ch
      LEFT JOIN classrooms cl ON cl.id=ch.classroom_id
      LEFT JOIN child_parents cp ON cp.child_id=ch.id
      LEFT JOIN users u ON u.id=cp.parent_id
      WHERE ch.id=$1 GROUP BY ch.id,cl.id
    `, [req.params.id])
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/children', auth, role('admin','teacher'), async (req, res) => {
  const { name,dob,classroom_id,allergies,food_notes,medical_notes,emergency_contact,emergency_phone,notes } = req.body
  try {
    const { rows } = await pool.query(
      'INSERT INTO children (name,dob,classroom_id,allergies,food_notes,medical_notes,emergency_contact,emergency_phone,notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [name,dob,classroom_id??null,allergies,food_notes,medical_notes,emergency_contact,emergency_phone,notes]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.patch('/api/children/:id', auth, role('admin','teacher'), async (req, res) => {
  const fields = ['name','dob','classroom_id','allergies','food_notes','medical_notes','emergency_contact','emergency_phone','notes','active','photo_url']
  const updates = []; const vals = []; let i = 1
  for (const f of fields) if (req.body[f] !== undefined) { updates.push(`${f}=$${i++}`); vals.push(req.body[f]) }
  if (!updates.length) return res.status(400).json({ error: 'Nothing to update' })
  vals.push(req.params.id)
  try {
    const { rows } = await pool.query(`UPDATE children SET ${updates.join(',')} WHERE id=$${i} RETURNING *`, vals)
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/children/:id/link-parent', auth, role('admin'), async (req, res) => {
  try {
    await pool.query('INSERT INTO child_parents (child_id,parent_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [req.params.id, req.body.parent_id])
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.delete('/api/children/:id/unlink-parent/:parentId', auth, role('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM child_parents WHERE child_id=$1 AND parent_id=$2', [req.params.id, req.params.parentId])
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

// ═══════════════════════════════════════════════════════════
// ATTENDANCE
// ═══════════════════════════════════════════════════════════

app.get('/api/attendance', auth, async (req, res) => {
  const { date, classroom_id, child_id, from, to } = req.query
  try {
    const conds = ['1=1']; const vals = []; let i = 1
    if (date) { conds.push(`a.date=$${i++}`); vals.push(date) }
    if (classroom_id) { conds.push(`a.classroom_id=$${i++}`); vals.push(classroom_id) }
    if (child_id) { conds.push(`a.child_id=$${i++}`); vals.push(child_id) }
    if (from) { conds.push(`a.date>=$${i++}`); vals.push(from) }
    if (to) { conds.push(`a.date<=$${i++}`); vals.push(to) }
    if (req.user.role === 'parent') {
      const ids = await parentChildIds(req.user.id)
      if (!ids.length) return res.json([])
      conds.push(`a.child_id=ANY($${i++}::uuid[])`); vals.push(ids)
    }
    const { rows } = await pool.query(`
      SELECT a.*,
        json_build_object('id',ch.id,'name',ch.name,'photo_url',ch.photo_url,'dob',ch.dob) AS child,
        CASE WHEN u.id IS NOT NULL THEN json_build_object('id',u.id,'name',u.name) ELSE NULL END AS teacher
      FROM attendance a
      LEFT JOIN children ch ON ch.id=a.child_id
      LEFT JOIN users u ON u.id=a.teacher_id
      WHERE ${conds.join(' AND ')} ORDER BY a.created_at DESC
    `, vals)
    res.json(rows)
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }) }
})

app.get('/api/attendance/stats/:childId', auth, async (req, res) => {
  const { year, month } = req.query
  const from = `${year}-${String(month).padStart(2,'0')}-01`
  const to   = `${year}-${String(month).padStart(2,'0')}-31`
  try {
    const { rows } = await pool.query('SELECT date,status FROM attendance WHERE child_id=$1 AND date>=$2 AND date<=$3', [req.params.childId,from,to])
    const r = { present:0,absent:0,late:0,early_pickup:0,excused:0,total:rows.length,records:rows }
    rows.forEach(x => { if(r[x.status]!==undefined) r[x.status]++ })
    res.json(r)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/attendance', auth, role('admin','teacher'), async (req, res) => {
  const records = Array.isArray(req.body) ? req.body : [req.body]
  const todayStr = new Date().toISOString().slice(0,10)
  try {
    for (const r of records) {
      await pool.query(`
        INSERT INTO attendance (child_id,classroom_id,date,status,check_in,check_out,teacher_id,notes)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT (child_id,date) DO UPDATE SET
          status=EXCLUDED.status,check_in=EXCLUDED.check_in,check_out=EXCLUDED.check_out,
          teacher_id=EXCLUDED.teacher_id,notes=EXCLUDED.notes
      `, [r.child_id,r.classroom_id,r.date||todayStr,r.status,r.check_in??null,r.check_out??null,req.user.id,r.notes??null])
    }
    res.json({ ok: true })
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }) }
})

// ═══════════════════════════════════════════════════════════
// DAILY REPORTS
// ═══════════════════════════════════════════════════════════

app.get('/api/reports', auth, async (req, res) => {
  const { date, classroom_id, child_id, from, to } = req.query
  try {
    const conds = ['1=1']; const vals = []; let i = 1
    if (date) { conds.push(`r.date=$${i++}`); vals.push(date) }
    if (classroom_id) { conds.push(`r.classroom_id=$${i++}`); vals.push(classroom_id) }
    if (child_id) { conds.push(`r.child_id=$${i++}`); vals.push(child_id) }
    if (from) { conds.push(`r.date>=$${i++}`); vals.push(from) }
    if (to) { conds.push(`r.date<=$${i++}`); vals.push(to) }
    if (req.user.role === 'parent') {
      const ids = await parentChildIds(req.user.id)
      if (!ids.length) return res.json([])
      conds.push(`r.child_id=ANY($${i++}::uuid[])`); vals.push(ids)
    }
    const { rows } = await pool.query(`
      SELECT r.*,
        json_build_object('id',ch.id,'name',ch.name,'photo_url',ch.photo_url,'dob',ch.dob,'classroom_id',ch.classroom_id) AS child,
        json_build_object('id',u.id,'name',u.name) AS teacher
      FROM daily_reports r
      LEFT JOIN children ch ON ch.id=r.child_id
      LEFT JOIN users u ON u.id=r.teacher_id
      WHERE ${conds.join(' AND ')} ORDER BY r.date DESC,r.created_at DESC
    `, vals)
    res.json(rows)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/reports', auth, role('admin','teacher'), async (req, res) => {
  const { child_id,classroom_id,date,mood,meals,nap_start,nap_end,activities,note,check_in,check_out } = req.body
  try {
    const { rows } = await pool.query(
      'INSERT INTO daily_reports (child_id,teacher_id,classroom_id,date,mood,meals,nap_start,nap_end,activities,note,check_in,check_out) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',
      [child_id,req.user.id,classroom_id,date??new Date().toISOString().slice(0,10),mood,meals,nap_start??null,nap_end??null,activities,note,check_in??null,check_out??null]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.patch('/api/reports/:id', auth, role('admin','teacher'), async (req, res) => {
  const fields = ['mood','meals','nap_start','nap_end','activities','note','check_in','check_out']
  const updates = []; const vals = []; let i = 1
  for (const f of fields) if (req.body[f] !== undefined) { updates.push(`${f}=$${i++}`); vals.push(req.body[f]) }
  if (!updates.length) return res.json({ ok: true })
  vals.push(req.params.id)
  try {
    const { rows } = await pool.query(`UPDATE daily_reports SET ${updates.join(',')} WHERE id=$${i} RETURNING *`, vals)
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.delete('/api/reports/:id', auth, role('admin','teacher'), async (req, res) => {
  try { await pool.query('DELETE FROM daily_reports WHERE id=$1',[req.params.id]); res.json({ ok:true }) }
  catch (e) { res.status(500).json({ error: 'Server error' }) }
})

// ═══════════════════════════════════════════════════════════
// INCIDENTS
// ═══════════════════════════════════════════════════════════

app.get('/api/incidents', auth, async (req, res) => {
  const { child_id } = req.query
  try {
    const conds = ['1=1']; const vals = []; let i = 1
    if (child_id) { conds.push(`i.child_id=$${i++}`); vals.push(child_id) }
    if (req.user.role === 'parent') {
      const ids = await parentChildIds(req.user.id)
      if (!ids.length) return res.json([])
      conds.push(`i.child_id=ANY($${i++}::uuid[])`); vals.push(ids)
    }
    const { rows } = await pool.query(`
      SELECT i.*,
        json_build_object('id',ch.id,'name',ch.name,'photo_url',ch.photo_url) AS child,
        json_build_object('id',u.id,'name',u.name) AS teacher,
        json_build_object('id',cl.id,'name',cl.name) AS classroom
      FROM incidents i
      LEFT JOIN children ch ON ch.id=i.child_id
      LEFT JOIN users u ON u.id=i.teacher_id
      LEFT JOIN classrooms cl ON cl.id=i.classroom_id
      WHERE ${conds.join(' AND ')} ORDER BY i.date DESC,i.created_at DESC
    `, vals)
    res.json(rows)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/incidents', auth, role('admin','teacher'), async (req, res) => {
  const { child_id,classroom_id,date,time,location,description,injury_type,first_aid,severity } = req.body
  try {
    const { rows } = await pool.query(
      'INSERT INTO incidents (child_id,classroom_id,teacher_id,date,time,location,description,injury_type,first_aid,severity) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
      [child_id,classroom_id,req.user.id,date??new Date().toISOString().slice(0,10),time??null,location,description,injury_type,first_aid,severity]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.patch('/api/incidents/:id', auth, role('admin','teacher'), async (req, res) => {
  const { status, parent_notified } = req.body
  try {
    const updates = []; const vals = []; let i = 1
    if (status) { updates.push(`status=$${i++}`); vals.push(status) }
    if (parent_notified !== undefined) {
      updates.push(`parent_notified=$${i++}`); vals.push(parent_notified)
      if (parent_notified) { updates.push(`parent_notified_at=$${i++}`); vals.push(new Date().toISOString()) }
    }
    if (!updates.length) return res.json({ ok: true })
    vals.push(req.params.id)
    const { rows } = await pool.query(`UPDATE incidents SET ${updates.join(',')} WHERE id=$${i} RETURNING *`, vals)
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

// ═══════════════════════════════════════════════════════════
// MEDICATIONS
// ═══════════════════════════════════════════════════════════

app.get('/api/medications', auth, async (req, res) => {
  const { child_id } = req.query
  try {
    const conds = ['m.active=true']; const vals = []; let i = 1
    if (child_id) { conds.push(`m.child_id=$${i++}`); vals.push(child_id) }
    if (req.user.role === 'parent') {
      const ids = await parentChildIds(req.user.id)
      if (!ids.length) return res.json([])
      conds.push(`m.child_id=ANY($${i++}::uuid[])`); vals.push(ids)
    }
    const { rows } = await pool.query(`
      SELECT m.*,json_build_object('id',ch.id,'name',ch.name,'classroom_id',ch.classroom_id) AS child
      FROM medications m LEFT JOIN children ch ON ch.id=m.child_id
      WHERE ${conds.join(' AND ')} ORDER BY m.name
    `, vals)
    res.json(rows)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/medications', auth, role('admin','teacher'), async (req, res) => {
  const { child_id,name,dosage,frequency,instructions,prescribed_by,parent_authorized } = req.body
  try {
    const { rows } = await pool.query(
      'INSERT INTO medications (child_id,name,dosage,frequency,instructions,prescribed_by,parent_authorized) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [child_id,name,dosage,frequency,instructions,prescribed_by,parent_authorized??false]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.patch('/api/medications/:id', auth, role('admin','teacher'), async (req, res) => {
  const { active } = req.body
  try {
    const { rows } = await pool.query('UPDATE medications SET active=$1 WHERE id=$2 RETURNING *', [active, req.params.id])
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.get('/api/medication-logs', auth, async (req, res) => {
  const { child_id, date } = req.query
  try {
    const conds = ['1=1']; const vals = []; let i = 1
    if (child_id) { conds.push(`ml.child_id=$${i++}`); vals.push(child_id) }
    if (date) { conds.push(`ml.given_at>=$${i++} AND ml.given_at<=$${i++}`); vals.push(`${date}T00:00:00`,`${date}T23:59:59`); i++ }
    const { rows } = await pool.query(`
      SELECT ml.*,
        json_build_object('id',u.id,'name',u.name) AS teacher,
        json_build_object('id',med.id,'name',med.name,'dosage',med.dosage) AS medication
      FROM medication_logs ml
      LEFT JOIN users u ON u.id=ml.teacher_id
      LEFT JOIN medications med ON med.id=ml.medication_id
      WHERE ${conds.join(' AND ')} ORDER BY ml.given_at DESC
    `, vals)
    res.json(rows)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/medication-logs', auth, role('admin','teacher'), async (req, res) => {
  const { medication_id,child_id,dosage,notes,missed } = req.body
  try {
    const { rows } = await pool.query(
      'INSERT INTO medication_logs (medication_id,child_id,teacher_id,given_at,dosage,notes,missed) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [medication_id,child_id,req.user.id,new Date().toISOString(),dosage,notes,missed??false]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

// ═══════════════════════════════════════════════════════════
// PORTFOLIO
// ═══════════════════════════════════════════════════════════

app.get('/api/portfolio', auth, async (req, res) => {
  const { child_id } = req.query
  try {
    const conds = ['1=1']; const vals = []; let i = 1
    if (child_id) { conds.push(`p.child_id=$${i++}`); vals.push(child_id) }
    if (req.user.role === 'parent') {
      const ids = await parentChildIds(req.user.id)
      if (!ids.length) return res.json([])
      conds.push(`p.child_id=ANY($${i++}::uuid[])`); vals.push(ids)
    }
    const { rows } = await pool.query(`
      SELECT p.*,
        json_build_object('id',ch.id,'name',ch.name) AS child,
        json_build_object('id',u.id,'name',u.name) AS teacher
      FROM portfolio_entries p
      LEFT JOIN children ch ON ch.id=p.child_id
      LEFT JOIN users u ON u.id=p.teacher_id
      WHERE ${conds.join(' AND ')} ORDER BY p.date DESC,p.created_at DESC
    `, vals)
    res.json(rows)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/portfolio', auth, role('admin','teacher'), async (req, res) => {
  const { child_id,title,description,media_url,media_type,milestone_id,activity_tags,date } = req.body
  try {
    const { rows } = await pool.query(
      'INSERT INTO portfolio_entries (child_id,teacher_id,title,description,media_url,media_type,milestone_id,activity_tags,date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [child_id,req.user.id,title,description,media_url,media_type,milestone_id??null,activity_tags??[],date??new Date().toISOString().slice(0,10)]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.delete('/api/portfolio/:id', auth, role('admin','teacher'), async (req, res) => {
  try { await pool.query('DELETE FROM portfolio_entries WHERE id=$1',[req.params.id]); res.json({ ok:true }) }
  catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/portfolio/:id/like', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT liked_by FROM portfolio_entries WHERE id=$1',[req.params.id])
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    const likedBy = rows[0].liked_by ?? []
    const already = likedBy.includes(req.user.id)
    const next = already ? likedBy.filter(id => id !== req.user.id) : [...likedBy, req.user.id]
    await pool.query('UPDATE portfolio_entries SET liked_by=$1 WHERE id=$2',[next,req.params.id])
    res.json({ liked_by: next })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

// ═══════════════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════════════

app.get('/api/events', auth, async (req, res) => {
  const { from, to, upcoming, limit } = req.query
  try {
    const conds = [`$1=ANY(visible_to)`]; const vals = [req.user.role]; let i = 2
    if (from) { conds.push(`start_date>=$${i++}`); vals.push(from) }
    if (to)   { conds.push(`start_date<=$${i++}`); vals.push(to) }
    if (upcoming) { conds.push(`start_date>=$${i++}`); vals.push(new Date().toISOString().slice(0,10)) }
    const lim = limit ? `LIMIT ${parseInt(limit)}` : ''
    const { rows } = await pool.query(`
      SELECT e.*,CASE WHEN c.id IS NOT NULL THEN json_build_object('id',c.id,'name',c.name) ELSE NULL END AS classroom
      FROM events e LEFT JOIN classrooms c ON c.id=e.classroom_id
      WHERE ${conds.join(' AND ')} ORDER BY e.start_date ${lim}
    `, vals)
    res.json(rows)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/events', auth, role('admin','teacher'), async (req, res) => {
  const { title,description,type,start_date,end_date,start_time,end_time,all_day,classroom_id,visible_to } = req.body
  try {
    const { rows } = await pool.query(
      'INSERT INTO events (title,description,type,start_date,end_date,start_time,end_time,all_day,classroom_id,created_by,visible_to) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
      [title,description,type,start_date,end_date??null,start_time??null,end_time??null,all_day??true,classroom_id??null,req.user.id,visible_to??['admin','teacher','parent']]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.patch('/api/events/:id', auth, role('admin','teacher'), async (req, res) => {
  const fields = ['title','description','type','start_date','end_date','start_time','end_time','all_day','classroom_id','visible_to']
  const updates = []; const vals = []; let i = 1
  for (const f of fields) if (req.body[f] !== undefined) { updates.push(`${f}=$${i++}`); vals.push(req.body[f]) }
  if (!updates.length) return res.json({ ok: true })
  vals.push(req.params.id)
  try {
    const { rows } = await pool.query(`UPDATE events SET ${updates.join(',')} WHERE id=$${i} RETURNING *`, vals)
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.delete('/api/events/:id', auth, role('admin'), async (req, res) => {
  try { await pool.query('DELETE FROM events WHERE id=$1',[req.params.id]); res.json({ ok:true }) }
  catch (e) { res.status(500).json({ error: 'Server error' }) }
})

// ═══════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════

app.get('/api/notifications', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50',[req.user.id])
    res.json(rows)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.get('/api/notifications/unread-count', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM notifications WHERE user_id=$1 AND read=false',[req.user.id])
    res.json({ count: parseInt(rows[0].count) })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.patch('/api/notifications/read-all', auth, async (req, res) => {
  try { await pool.query('UPDATE notifications SET read=true WHERE user_id=$1 AND read=false',[req.user.id]); res.json({ ok:true }) }
  catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.patch('/api/notifications/:id/read', auth, async (req, res) => {
  try { await pool.query('UPDATE notifications SET read=true WHERE id=$1',[req.params.id]); res.json({ ok:true }) }
  catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/notifications', auth, role('admin','teacher'), async (req, res) => {
  const { user_id,type,title,message,data } = req.body
  try {
    const { rows } = await pool.query(
      'INSERT INTO notifications (user_id,type,title,message,data) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [user_id,type,title,message,data??null]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

// ═══════════════════════════════════════════════════════════
// MESSAGES
// ═══════════════════════════════════════════════════════════

app.get('/api/messages/conversations', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT ON (LEAST(m.from_id::text,m.to_id::text),GREATEST(m.from_id::text,m.to_id::text))
        m.from_id,m.to_id,
        json_build_object('id',f.id,'name',f.name,'role',f.role,'avatar_url',f.avatar_url) AS "from",
        json_build_object('id',t.id,'name',t.name,'role',t.role,'avatar_url',t.avatar_url) AS "to",
        m.created_at
      FROM messages m
      LEFT JOIN users f ON f.id=m.from_id
      LEFT JOIN users t ON t.id=m.to_id
      WHERE m.from_id=$1 OR m.to_id=$1
      ORDER BY LEAST(m.from_id::text,m.to_id::text),GREATEST(m.from_id::text,m.to_id::text),m.created_at DESC
    `, [req.user.id])
    res.json(rows)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.get('/api/messages/unread-count', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM messages WHERE to_id=$1 AND read=false',[req.user.id])
    res.json({ count: parseInt(rows[0].count) })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.get('/api/messages', auth, async (req, res) => {
  const { with: withUser } = req.query
  try {
    let q, vals
    if (withUser) {
      q = `SELECT m.*,
        json_build_object('id',f.id,'name',f.name,'role',f.role,'avatar_url',f.avatar_url) AS "from",
        json_build_object('id',t.id,'name',t.name,'role',t.role,'avatar_url',t.avatar_url) AS "to"
        FROM messages m LEFT JOIN users f ON f.id=m.from_id LEFT JOIN users t ON t.id=m.to_id
        WHERE (m.from_id=$1 AND m.to_id=$2) OR (m.from_id=$2 AND m.to_id=$1)
        ORDER BY m.created_at ASC`
      vals = [req.user.id, withUser]
    } else {
      q = `SELECT m.*,
        json_build_object('id',f.id,'name',f.name,'role',f.role,'avatar_url',f.avatar_url) AS "from",
        json_build_object('id',t.id,'name',t.name,'role',t.role,'avatar_url',t.avatar_url) AS "to"
        FROM messages m LEFT JOIN users f ON f.id=m.from_id LEFT JOIN users t ON t.id=m.to_id
        WHERE m.from_id=$1 OR m.to_id=$1 ORDER BY m.created_at ASC`
      vals = [req.user.id]
    }
    const { rows } = await pool.query(q, vals)
    res.json(rows)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/messages', auth, async (req, res) => {
  const { to_id, child_id, text } = req.body
  try {
    const { rows } = await pool.query(
      'INSERT INTO messages (from_id,to_id,child_id,text) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.user.id,to_id,child_id??null,text]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.patch('/api/messages/mark-read', auth, async (req, res) => {
  const { from_user_id } = req.body
  try {
    await pool.query('UPDATE messages SET read=true WHERE to_id=$1 AND from_id=$2 AND read=false',[req.user.id,from_user_id])
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

// ═══════════════════════════════════════════════════════════
// ENROLLMENTS
// ═══════════════════════════════════════════════════════════

app.get('/api/enrollments', auth, role('admin','teacher'), async (req, res) => {
  const { status } = req.query
  try {
    const vals = []; let where = '1=1'
    if (status) { where += ' AND e.status=$1'; vals.push(status) }
    const { rows } = await pool.query(`
      SELECT e.*,CASE WHEN c.id IS NOT NULL THEN json_build_object('id',c.id,'name',c.name) ELSE NULL END AS preferred_classroom
      FROM enrollments e LEFT JOIN classrooms c ON c.id=e.class_preference
      WHERE ${where} ORDER BY e.submitted_at DESC
    `, vals)
    res.json(rows)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/enrollments', async (req, res) => {
  const { parent_name,parent_phone,parent_email,parent_username,child_name,child_dob,
          class_preference,allergies,food_notes,medical_notes,emergency_name,emergency_phone,start_date,notes } = req.body
  try {
    const { rows } = await pool.query(
      `INSERT INTO enrollments (parent_name,parent_phone,parent_email,parent_username,child_name,child_dob,
        class_preference,allergies,food_notes,medical_notes,emergency_name,emergency_phone,start_date,notes,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'pending') RETURNING *`,
      [parent_name,parent_phone,parent_email,parent_username,child_name,child_dob??null,class_preference??null,
       allergies,food_notes,medical_notes,emergency_name,emergency_phone,start_date??null,notes]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.patch('/api/enrollments/:id', auth, role('admin'), async (req, res) => {
  const { status, assigned_classroom_id } = req.body
  try {
    const { rows } = await pool.query(
      'UPDATE enrollments SET status=$1,assigned_classroom_id=$2 WHERE id=$3 RETURNING *',
      [status,assigned_classroom_id??null,req.params.id]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

// ═══════════════════════════════════════════════════════════
// CURRICULUM
// ═══════════════════════════════════════════════════════════

app.get('/api/curriculum/units', auth, async (req, res) => {
  try {
    const { rows: units } = await pool.query('SELECT * FROM curriculum_units ORDER BY sort_order,created_at')
    const { rows: acts } = await pool.query('SELECT * FROM curriculum_activities ORDER BY created_at')
    const map = {}
    for (const u of units) map[u.id] = { ...u, activities: [] }
    for (const a of acts) if (map[a.unit_id]) map[a.unit_id].activities.push(a)
    res.json(Object.values(map))
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/curriculum/units', auth, role('admin','teacher'), async (req, res) => {
  const { week, theme, color, sort_order } = req.body
  try {
    const { rows } = await pool.query(
      'INSERT INTO curriculum_units (week,theme,color,sort_order) VALUES ($1,$2,$3,$4) RETURNING *',
      [week, theme, color ?? 'bg-teal/10 text-teal', sort_order ?? 99]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.delete('/api/curriculum/units/:id', auth, role('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM curriculum_units WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.post('/api/curriculum/activities', auth, role('admin','teacher'), async (req, res) => {
  const { unit_id, title, description, age_group, area, duration } = req.body
  if (!unit_id || !title) return res.status(400).json({ error: 'unit_id and title required' })
  try {
    const { rows } = await pool.query(
      'INSERT INTO curriculum_activities (unit_id,title,description,age_group,area,duration,created_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [unit_id, title, description ?? '', age_group ?? '3-5 years', area ?? 'Other', duration ?? '20 min', req.user.id]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.patch('/api/curriculum/activities/:id', auth, role('admin','teacher'), async (req, res) => {
  const fields = ['title','description','age_group','area','duration','unit_id']
  const updates = []; const vals = []; let i = 1
  for (const f of fields) if (req.body[f] !== undefined) { updates.push(`${f}=$${i++}`); vals.push(req.body[f]) }
  if (!updates.length) return res.json({ ok: true })
  vals.push(req.params.id)
  try {
    const { rows } = await pool.query(`UPDATE curriculum_activities SET ${updates.join(',')} WHERE id=$${i} RETURNING *`, vals)
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

app.delete('/api/curriculum/activities/:id', auth, role('admin','teacher'), async (req, res) => {
  try {
    await pool.query('DELETE FROM curriculum_activities WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

// ── Static files ─────────────────────────────────────────────
const STATIC_DIR = path.join(__dirname, 'public_react')
app.use(express.static(STATIC_DIR, { maxAge: '1h', index: 'index.html' }))
app.get('*', (_req, res) => res.sendFile(path.join(STATIC_DIR, 'index.html')))

app.listen(PORT, '0.0.0.0', () => {
  console.log('Mini Star Child Care v2 running on port ' + PORT)
})
