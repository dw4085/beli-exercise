const { neon } = require("@neondatabase/serverless");

let client = null;

// Neon serverless (HTTP) client, created lazily from DATABASE_URL
function db() {
  if (!client) client = neon(process.env.DATABASE_URL);
  return client;
}

module.exports = { db };
