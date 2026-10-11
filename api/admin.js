const { db, isAdmin } = require("./_lib/db");

// GET    /api/admin            — all submissions and students
// DELETE /api/admin?section=x  — clear a section's submissions and students
module.exports = async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: "Unauthorized" });

  const sql = db();
  try {
    if (req.method === "GET") {
      const [submissions, students] = await Promise.all([
        sql`SELECT * FROM submissions`,
        sql`SELECT * FROM students`,
      ]);
      return res.status(200).json({ submissions, students });
    }

    if (req.method === "DELETE") {
      const { section } = req.query;
      if (!section) return res.status(400).json({ error: "section required" });
      // Submissions first (FK constraint), then students
      await sql.transaction([
        sql`DELETE FROM submissions WHERE section = ${section}`,
        sql`DELETE FROM students WHERE section = ${section}`,
      ]);
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
