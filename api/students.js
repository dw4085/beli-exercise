const { db } = require("./_lib/db");

// POST /api/students { name, section } — find or create a student
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, section } = req.body || {};
  if (!name || !section) return res.status(400).json({ error: "name and section required" });

  try {
    const sql = db();
    // No-op update on conflict so RETURNING yields the existing row too
    const [student] = await sql`
      INSERT INTO students (name, section) VALUES (${name}, ${section})
      ON CONFLICT (name, section) DO UPDATE SET name = EXCLUDED.name
      RETURNING *
    `;
    res.status(200).json({ student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
