const { requireUser, outbox } = require("../_lib/auth");

// Activity reports not yet received by the class hub (admin page). Instructors and TAs only.
// GET  /api/hub/outbox — status
// POST /api/hub/outbox — "Send now": deliver everything waiting, then report what's left
module.exports = async (req, res) => {
  if (!(await requireUser(req, res, { staff: true }))) return;
  try {
    if (req.method === "GET") return res.status(200).json(await outbox().status());
    if (req.method === "POST") {
      const result = await outbox().flush();
      return res.status(200).json({ ...result, status: await outbox().status() });
    }
    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
