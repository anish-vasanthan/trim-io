require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const validUrl = require('valid-url');

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// ── In-memory storage ──────────────────────────────────────────
// urlMap: shortcode → { originalUrl, clicks, createdAt, expiresAt }
// reverseMap: originalUrl → shortcode  (for duplicate prevention)
const urlMap = {};
const reverseMap = {};

// ── Middleware ─────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman) or from allowed origins
    if (!origin || allowedOrigins.includes(origin) || process.env.FRONTEND_URL === '*') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// ── POST /api/shorten ──────────────────────────────────────────
app.post('/api/shorten', (req, res) => {
  const { originalUrl, customAlias, expiresIn } = req.body;

  // Validate input
  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }
  if (!validUrl.isWebUri(originalUrl)) {
    return res.status(400).json({ error: 'Invalid URL. Please include http:// or https://' });
  }

  // Custom alias validation
  if (customAlias) {
    const aliasRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!aliasRegex.test(customAlias)) {
      return res.status(400).json({
        error: 'Custom alias must be 3-20 characters, letters/numbers/hyphens/underscores only'
      });
    }
    if (urlMap[customAlias]) {
      return res.status(409).json({ error: 'Custom alias is already taken. Choose a different one.' });
    }
  }

  // No duplicates — same URL returns existing short code
  if (reverseMap[originalUrl] && !customAlias) {
    const existingCode = reverseMap[originalUrl];
    const existing = urlMap[existingCode];
    return res.status(200).json({
      shortUrl: `${BASE_URL}/${existingCode}`,
      shortcode: existingCode,
      originalUrl,
      clicks: existing.clicks,
      createdAt: existing.createdAt,
      expiresAt: existing.expiresAt,
      alreadyExists: true
    });
  }

  // Generate shortcode
  const shortcode = customAlias || nanoid(6);

  // Calculate expiry
  let expiresAt = null;
  if (expiresIn && !isNaN(expiresIn) && Number(expiresIn) > 0) {
    const d = new Date();
    d.setHours(d.getHours() + Number(expiresIn));
    expiresAt = d.toISOString();
  }

  // Store
  const createdAt = new Date().toISOString();
  urlMap[shortcode] = { originalUrl, clicks: 0, createdAt, expiresAt };
  reverseMap[originalUrl] = shortcode;

  return res.status(201).json({
    shortUrl: `${BASE_URL}/${shortcode}`,
    shortcode,
    originalUrl,
    clicks: 0,
    createdAt,
    expiresAt,
    alreadyExists: false
  });
});

// ── GET /api/urls ──────────────────────────────────────────────
app.get('/api/urls', (req, res) => {
  const urls = Object.entries(urlMap).map(([shortcode, data]) => ({
    shortUrl: `${BASE_URL}/${shortcode}`,
    shortcode,
    originalUrl: data.originalUrl,
    clicks: data.clicks,
    createdAt: data.createdAt,
    expiresAt: data.expiresAt
  }));

  // Newest first
  urls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return res.status(200).json({ urls });
});

// ── DELETE /api/urls/:shortcode ────────────────────────────────
app.delete('/api/urls/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  if (!urlMap[shortcode]) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  const { originalUrl } = urlMap[shortcode];
  delete urlMap[shortcode];
  delete reverseMap[originalUrl];
  return res.status(200).json({ message: 'Deleted successfully' });
});

// ── GET /:shortcode  → redirect ────────────────────────────────
app.get('/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  const entry = urlMap[shortcode];

  if (!entry) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  // Check expiry
  if (entry.expiresAt && new Date(entry.expiresAt) < new Date()) {
    return res.status(410).json({ error: 'This short URL has expired' });
  }

  // Increment click count
  entry.clicks += 1;

  return res.redirect(entry.originalUrl);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
