const { db } = require("./_lib/db");
const { requireUser } = require("./_lib/auth");

// GET    /api/admin            — all submissions and students
// DELETE /api/admin?section=x  — clear a section's submissions and students
// Instructors and TAs only (class hub cookie).
module.exports = async (req, res) => {
  if (!(await requireUser(req, res, { staff: true }))) return;

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
      // Submissions first (FK constraint), then the section's students (who pick up their section
      // again on their next visit); staff who tried other sections keep those rankings
      await sql.transaction([
        sql`DELETE FROM submissions WHERE section = ${section}`,
        sql`DELETE FROM students st WHERE st.section = ${section}
            AND NOT EXISTS (SELECT 1 FROM submissions s WHERE s.student_id = st.id)`,
      ]);
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
