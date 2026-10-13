const { db } = require("./_lib/db");
const { requireUser, isStaff } = require("./_lib/auth");
const { ensureStudent } = require("./_lib/sections");

// The signed-in person (class hub cookie) and their section.
// GET  /api/students              — { name, section, staff }; section is null until known
// POST /api/students { section }  — choose a section once, when the roster doesn't give one
module.exports = async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const sql = db();
    if (req.method === "GET" || req.method === "POST") {
      const picked = req.method === "POST" ? (req.body || {}).section : null;
      const student = await ensureStudent(sql, user, picked);
      return res.status(200).json({
        name: user.name || user.email,
        section: student?.section ?? null,
        staff: isStaff(user),
      });
    }
    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
