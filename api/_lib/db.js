const { neon } = require("@neondatabase/serverless");

let client = null;

// Neon serverless (HTTP) client, created lazily from DATABASE_URL
function db() {
  if (!client) client = neon(process.env.DATABASE_URL);
  return client;
}

// Admin endpoints require the admin password in the x-admin-password header
// (compared case-insensitively, matching the admin login screen)
function isAdmin(req) {
  const expected = process.env.ADMIN_PASSWORD || process.env.REACT_APP_ADMIN_PASSWORD || "BELIADMIN";
  const given = req.headers["x-admin-password"] || "";
  return given.trim().toUpperCase() === expected.toUpperCase();
}

module.exports = { db, isAdmin };
