/* ===== Wedding RSVP API ======================================================
   Minimal Express + Postgres backend for the wedding site's RSVP form.
   Deployed on Railway; expects DATABASE_URL to be injected automatically by
   the attached Postgres plugin. Creates its own table on boot (idempotent),
   so there is no separate migration step to run manually. ============ */
'use strict';

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || '';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL is not set. Attach a Postgres plugin on Railway (it injects this automatically) or set it manually for local dev.');
  process.exit(1);
}

// Railway's managed Postgres requires SSL for external connections but not
// for the internal/private network the service itself runs on; either way
// `rejectUnauthorized:false` is the standard safe default for Railway's
// self-signed setup and works in both cases.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
});

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rsvp (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      contact    TEXT NOT NULL,
      attend     TEXT NOT NULL CHECK (attend IN ('yes', 'no')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  // one submission per contact — resubmitting the form updates the existing
  // row instead of piling up duplicates (mirrors the old "rsvp_mine" UX,
  // where reopening the form and sending again just updates your answer).
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS rsvp_contact_key ON rsvp (lower(contact));
  `);
}

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(cors({
  origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(',').map((s) => s.trim()),
  methods: ['GET', 'POST'],
}));

/* ---------- validation helpers ---------- */
const NAME_MAX = 120;
const CONTACT_MAX = 120;

function validateRsvpPayload(body) {
  const errors = [];
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const contact = typeof body.contact === 'string' ? body.contact.trim() : '';
  const attend = body.attend;

  if (!name) errors.push('name is required');
  else if (name.length > NAME_MAX) errors.push(`name must be at most ${NAME_MAX} characters`);

  if (!contact) errors.push('contact is required');
  else if (contact.length > CONTACT_MAX) errors.push(`contact must be at most ${CONTACT_MAX} characters`);

  if (attend !== 'yes' && attend !== 'no') errors.push('attend must be "yes" or "no"');

  return { errors, clean: { name, contact, attend } };
}

/* ---------- routes ---------- */
app.get('/health', (req, res) => res.json({ ok: true }));

// POST /api/rsvp — create or update (by contact) a guest's RSVP.
app.post('/api/rsvp', async (req, res) => {
  const { errors, clean } = validateRsvpPayload(req.body || {});
  if (errors.length) {
    return res.status(400).json({ ok: false, errors });
  }
  try {
    const result = await pool.query(
      `INSERT INTO rsvp (name, contact, attend)
       VALUES ($1, $2, $3)
       ON CONFLICT (lower(contact))
       DO UPDATE SET name = EXCLUDED.name, attend = EXCLUDED.attend, updated_at = now()
       RETURNING id, name, contact, attend, created_at, updated_at`,
      [clean.name, clean.contact, clean.attend]
    );
    res.status(201).json({ ok: true, rsvp: result.rows[0] });
  } catch (err) {
    console.error('POST /api/rsvp failed:', err);
    res.status(500).json({ ok: false, errors: ['internal server error'] });
  }
});

// GET /api/rsvp — list all submissions, newest first. Protected by a shared
// secret header so the guest list isn't publicly readable by anyone with the
// site's URL — this is intentionally simple (no user accounts needed for a
// two-person guest-list dashboard).
app.get('/api/rsvp', async (req, res) => {
  if (!ADMIN_KEY || req.get('x-admin-key') !== ADMIN_KEY) {
    return res.status(401).json({ ok: false, errors: ['unauthorized'] });
  }
  try {
    const result = await pool.query(
      `SELECT id, name, contact, attend, created_at, updated_at
       FROM rsvp ORDER BY created_at DESC`
    );
    res.json({ ok: true, count: result.rows.length, rsvps: result.rows });
  } catch (err) {
    console.error('GET /api/rsvp failed:', err);
    res.status(500).json({ ok: false, errors: ['internal server error'] });
  }
});

ensureSchema()
  .then(() => {
    app.listen(PORT, () => console.log(`RSVP API listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('FATAL: failed to initialize database schema:', err);
    process.exit(1);
  });
