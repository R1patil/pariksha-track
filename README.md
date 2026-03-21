# 📚 Pariksha Track | ಪರೀಕ್ಷಾ ಟ್ರ್ಯಾಕ್

> English chapter progress tracker for Karnataka Government School students  
> Teacher dashboard to monitor all students in real-time

## Setup in 5 steps

### Step 1 — Create Supabase project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy `Project URL` and `anon key`
3. Paste into `.env.local`

### Step 2 — Run the database SQL
1. Supabase → SQL Editor → New Query
2. Paste entire `supabase-setup.sql` → Click RUN

### Step 3 — Install and run
```bash
npm install
npm run dev
```

### Step 4 — Change admin password
In `.env.local`, change `NEXT_PUBLIC_ADMIN_PASSWORD=teacher123` to any password

### Step 5 — Deploy to Vercel
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github-r1:R1patil/pariksha-track.git
git push -u origin main
```
Then import on vercel.com → add env variables

## URLs
- Student login: `/login`
- Student dashboard: `/student`
- Teacher login: `/admin`
- Teacher dashboard: `/admin/dashboard`
- Student detail: `/admin/student/[id]`
