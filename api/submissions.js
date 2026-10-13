const { waitUntil } = require("@vercel/functions");
const { db } = require("./_lib/db");
const { requireUser, isStaff, outbox } = require("./_lib/auth");
const { byName, ensureStudent } = require("./_lib/sections");
const { rankingSubmitted } = require("./_lib/rankingEvents");

// Identity comes from the class hub cookie, never the request. Students work in their own section;
// instructors and TAs may view (and try out) any section.
//
// GET  /api/submissions?section=x                — all rankings for a section (class averages)
// GET  /api/submissions?section=x&mine=1         — the signed-in person's submission (or null)
// GET  /api/submissions?section=x&student=<id>   — staff: one student's submission, by hub person id
// POST /api/submissions { section, rankings }    — upsert the signed-in person's submission
module.exports = async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  const staff = isStaff(user);

  const sql = db();
  try {
    if (req.method === "GET") {
      const { section, mine, student } = req.query;
      if (!byName(section)) return res.status(400).json({ error: "section required" });

      if (student) {
        if (!staff) return res.status(403).json({ error: "Instructors only" });
        const [row] = await sql`
          SELECT s.rankings, st.name FROM students st
          LEFT JOIN submissions s ON s.student_id = st.id AND s.section = ${section}
          WHERE st.student_id = ${student}
        `;
        return res.status(200).json({
          submission: row?.rankings ? { rankings: row.rankings } : null,
          name: row?.name ?? null,
        });
      }

      if (!staff) {
        const me = await ensureStudent(sql, user, null);
        if (me?.section !== section) return res.status(403).json({ error: "Not your section" });
      }

      if (mine) {
        const [submission] = await sql`
          SELECT s.rankings FROM submissions s JOIN students st ON st.id = s.student_id
          WHERE st.student_id = ${user.id} AND s.section = ${section}
        `;
        return res.status(200).json({ submission: submission ?? null });
      }

      const submissions = await sql`SELECT rankings FROM submissions WHERE section = ${section}`;
      return res.status(200).json({ submissions });
    }

    if (req.method === "POST") {
      const { section, rankings } = req.body || {};
      if (!byName(section) || !validRankings(rankings)) {
        return res.status(400).json({ error: "section and rankings required" });
      }
      const me = await ensureStudent(sql, user, staff ? section : null);
      if (!me || (!staff && me.section !== section)) return res.status(403).json({ error: "Not your section" });

      const [saved] = await sql`
        INSERT INTO submissions (student_id, section, rankings)
        VALUES (${me.id}, ${section}, ${JSON.stringify(rankings)}::jsonb)
        ON CONFLICT (student_id, section) DO UPDATE SET rankings = EXCLUDED.rankings
        RETURNING id, (xmax = 0) AS inserted
      `;

      const host = req.headers["x-forwarded-host"] || req.headers.host;
      const link = `https://${host}/?${new URLSearchParams({ section, student: user.id })}`;
      const ob = outbox();
      await ob.enqueue(rankingSubmitted({
        actorId: user.id,
        submissionId: saved.id,
        section,
        rankings,
        revised: !saved.inserted,
        link,
      }));
      waitUntil(ob.flush());
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// { "Option name": rank, … } with ranks 1..n, each once.
function validRankings(r) {
  if (!r || typeof r !== "object" || Array.isArray(r)) return false;
  const ranks = Object.values(r);
  if (ranks.length < 1 || ranks.length > 20) return false;
  const seen = new Set(ranks);
  return seen.size === ranks.length && ranks.every((n) => Number.isInteger(n) && n >= 1 && n <= ranks.length);
}
