const { db } = require("./_lib/db");

// GET  /api/submissions?section=x               — all rankings for a section (class averages)
// GET  /api/submissions?section=x&student_id=y  — one student's submission (or null)
// POST /api/submissions { student_id, section, rankings } — upsert a submission
module.exports = async (req, res) => {
  const sql = db();
  try {
    if (req.method === "GET") {
      const { section, student_id } = req.query;
      if (!section) return res.status(400).json({ error: "section required" });

      if (student_id) {
        const [submission] = await sql`
          SELECT rankings FROM submissions WHERE student_id = ${student_id} AND section = ${section}
        `;
        return res.status(200).json({ submission: submission ?? null });
      }

      const submissions = await sql`SELECT rankings FROM submissions WHERE section = ${section}`;
      return res.status(200).json({ submissions });
    }

    if (req.method === "POST") {
      const { student_id, section, rankings } = req.body || {};
      if (!student_id || !section || !rankings) {
        return res.status(400).json({ error: "student_id, section and rankings required" });
      }
      await sql`
        INSERT INTO submissions (student_id, section, rankings)
        VALUES (${student_id}, ${section}, ${JSON.stringify(rankings)}::jsonb)
        ON CONFLICT (student_id, section) DO UPDATE SET rankings = EXCLUDED.rankings
      `;
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
