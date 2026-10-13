// The exercise's sections, one activity each. Keep in sync with src/data/activities.js
// (section names and titles); the functions are CommonJS and can't import that file.
const SECTIONS = [
  { section: "Section 1", title: "Prioritize the Feature Roadmap" },
  { section: "Section 2", title: "Choose the Right Partner" },
  { section: "Section 3", title: "Pick a New Vertical" },
];

const byName = (name) => SECTIONS.find((s) => s.section === name) || null;

// The app section for a roster section from the class hub ("Section 2", "section 2", "2",
// "Sec. 02" …), or null when it doesn't name one of this exercise's sections.
function matchSection(rosterSection) {
  if (!rosterSection) return null;
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const exact = SECTIONS.find((s) => norm(s.section) === norm(rosterSection));
  if (exact) return exact.section;
  const m = String(rosterSection).match(/(\d+)\s*$/);
  return m ? byName(`Section ${parseInt(m[1], 10)}`)?.section ?? null : null;
}

// The signed-in person's students row (keyed by hub person id), created or refreshed with their
// hub name. Section: the roster's (hub claim) when it matches, else the one already on file, else
// `picked` (chosen once by the student, or the section a staff member is working in).
// Returns null when no section is known yet.
async function ensureStudent(sql, user, picked) {
  const [existing] = await sql`SELECT * FROM students WHERE student_id = ${user.id}`;
  const section = matchSection(user.section) || existing?.section || (byName(picked) ? picked : null);
  if (!section) return null;
  const [row] = await sql`
    INSERT INTO students (student_id, email, name, section)
    VALUES (${user.id}, ${user.email}, ${user.name || user.email}, ${section})
    ON CONFLICT (student_id) DO UPDATE
      SET email = EXCLUDED.email, name = EXCLUDED.name, section = EXCLUDED.section
    RETURNING *
  `;
  return row;
}

module.exports = { SECTIONS, byName, matchSection, ensureStudent };
