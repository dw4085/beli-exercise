const { hubCookieName, verifyHubToken, canUseThisApp, isStaff, hubOutbox } = require("./hub");
const { db } = require("./db");

// The signed-in person, from the class hub's session cookie only (never the request body).
async function getHubUser(req) {
  const header = req.headers.cookie || "";
  const name = hubCookieName();
  let token = null;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) token = decodeURIComponent(part.slice(i + 1).trim());
  }
  const user = await verifyHubToken(token);
  return user && canUseThisApp(user) ? user : null;
}

// The signed-in person, or null after answering 401 (signed out) / 403 (staff-only route).
async function requireUser(req, res, { staff = false } = {}) {
  const user = await getHubUser(req);
  if (!user) {
    res.status(401).json({ error: "Sign in through the class hub" });
    return null;
  }
  if (staff && !isStaff(user)) {
    res.status(403).json({ error: "Instructors only" });
    return null;
  }
  return user;
}

// Activity reports for the class hub, held in hub_outbox until the hub has them.
const outbox = () => hubOutbox(db());

module.exports = { getHubUser, requireUser, isStaff, outbox };
