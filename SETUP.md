# Mini Star Child Care v2 — Setup Guide

## 1. Create Supabase Project

1. Go to https://app.supabase.com → New project
2. Copy your **Project URL** and **anon public key** from Settings → API

## 2. Run SQL Migrations

In Supabase SQL Editor, run in order:
1. `supabase/migrations/001_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_seed_data.sql`

## 3. Create Demo Auth Users

In Supabase Dashboard → Authentication → Users → Invite user:

| Email | Password | Role |
|---|---|---|
| admin@ministar.demo | admin123 | admin |
| teacher1@ministar.demo | demo123 | teacher |
| teacher2@ministar.demo | demo123 | teacher |
| parent1@ministar.demo | demo123 | parent |
| parent2@ministar.demo | demo123 | parent |
| parent3@ministar.demo | demo123 | parent |

Then insert their profiles — get UUIDs from `SELECT id, email FROM auth.users`
and fill in `supabase/migrations/003_seed_data.sql`.

## 4. Configure Environment

```bash
cd client
cp .env.example .env
# Edit .env with your Supabase URL and anon key
```

## 5. Local Development

```bash
npm run dev   # starts Vite dev server on http://localhost:5173
```

## 6. Deploy to fly.io

```bash
# Set secrets on fly.io
fly secrets set VITE_SUPABASE_URL=https://xxx.supabase.co
fly secrets set VITE_SUPABASE_ANON_KEY=your-anon-key

# Deploy (builds React inside Docker)
fly deploy \
  --build-arg VITE_SUPABASE_URL=https://xxx.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 7. Storage (Portfolio Photos)

In Supabase Storage → New bucket → `ministar-media` → Public bucket.
