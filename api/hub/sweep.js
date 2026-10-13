const { isCronRequest } = require("../_lib/hub");
const { outbox } = require("../_lib/auth");

// Daily sweep (Vercel Cron, see vercel.json): resend activity reports the class hub hasn't received.
module.exports = async (req, res) => {
  if (!isCronRequest(req.headers.authorization || null)) return res.status(401).json({ error: "Unauthorized" });
  res.status(200).json(await outbox().flush());
};
