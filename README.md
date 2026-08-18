# Trim.io — URL Shortener

A full-stack URL shortener built with React, Node.js, and Express.

## Live Demo
> Backend: https://trim-io.onrender.com

---

## Features

| Feature | Description |
|---|---|
| Shorten URL | Convert any long URL into a 6-character short code |
| Redirect | Visiting the short code redirects to the original URL |
| No Duplicates | Same URL always returns the same short code |
| Custom Alias | Pick your own shortcode e.g. `trim.io/my-link` |
| Link Expiry | Set links to expire after 1h / 24h / 7d / 30d |
| Click Analytics | Track how many times each link was visited |
| QR Code | Auto-generate a QR code for any short URL |
| Dashboard | View, search, sort and delete all links |
| Input Validation | Handles bad URLs, empty input, invalid aliases |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Backend | Node.js + Express |
| Storage | In-memory (JavaScript object) |
| Short Code | nanoid (6 chars) |
| URL Validation | valid-url |
| QR Code | qrcode.react |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/shorten` | Create a short URL |
| GET | `/api/urls` | List all URLs |
| DELETE | `/api/urls/:shortcode` | Delete a URL |
| GET | `/:shortcode` | Redirect to original URL |

---

## Run Locally

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## Project Structure

```
trim-io/
├── backend/
│   ├── server.js          # Express server + all routes
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Hero.jsx
│   │   │   ├── ShortenForm.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   ├── StatsTable.jsx
│   │   │   └── Toast.jsx
│   │   └── index.css
│   └── package.json
├── package.json            # Root package.json for Render deployment
└── .gitignore
```

---

Built for the URL Shortener challenge — 60 minutes, 6 requirements, 1 app.
