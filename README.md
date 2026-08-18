# SnapLink — URL Shortener

A full-stack URL shortener built with React + Tailwind, Node + Express, and Supabase.

## Features
- Shorten any URL to a clean short code
- No duplicate short codes for the same URL
- Custom alias support
- Link expiry (1h, 24h, 7d, 30d)
- Click analytics per link
- QR code generation
- Dashboard with search & sort
- Delete links
- Input validation & error handling

## Setup

### 1. Supabase
Create a project at https://supabase.com and run this SQL:

```sql
CREATE TABLE urls (
  id BIGSERIAL PRIMARY KEY,
  shortcode TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
CREATE INDEX idx_shortcode ON urls(shortcode);
CREATE INDEX idx_original_url ON urls(original_url);
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in SUPABASE_URL and SUPABASE_KEY in .env
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173
