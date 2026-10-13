const { byName } = require("./sections");

// What the Beli exercise reports to the class hub's activity log: a student submitted (or revised)
// their ranking for their section's activity. One run per student per section (the submission's
// id), so the hub shows the latest ranking.

// Ranks in order, e.g. [{ rank: 1, option: "Palate Twin" }, …]
function orderedRanking(rankings) {
  return Object.entries(rankings)
    .sort((a, b) => a[1] - b[1])
    .map(([option, rank]) => ({ rank, option }));
}

// `link` reopens the ranking in the app: the student's own page, or for instructors a read-only
// view of this student's ranking.
function rankingSubmitted({ actorId, submissionId, section, rankings, revised, link }) {
  const ranking = orderedRanking(rankings);
  const activity = byName(section)?.title ?? section;
  return {
    actorId,
    type: "run.submitted",
    title: `${revised ? "Updated" : "Submitted"} a ranking: 1. ${ranking[0]?.option ?? ""}`.trim(),
    // Field order is the order shown in the class activity log.
    snapshot: {
      activity,
      section,
      ranking,
    },
    runId: submissionId,
    link,
  };
}

module.exports = { rankingSubmitted, orderedRanking };
