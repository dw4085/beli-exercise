export const PASSWORDS = {
  "Section 1": "BLUEHILL",
  "Section 2": "ISHIKAWA",
  "Section 3": "ATOMIX",
};

const s1Pillars = [
  { label: "Mission & Philosophy", quote: '"Taste is personal, and online reviews should reflect that. When we evaluate anything, we ask: Does it help our mission?"' },
  { label: "What Kind of App", quote: '"We consider ourselves a social restaurant list-keeping app. Our main competitors are Google Maps, Notes, Docs, Excel."' },
  { label: "Engagement Philosophy", quote: '"Beli is not meant to be a place where users are scrolling all day. The app is meant to get you to do things in the real world."' },
  { label: "Community over Marketing", quote: '"The idea was to build a community around this common interest — and actually, not to talk about the app much at all."' },
];
const s1Options = [
  { name: "Palate Twin", desc: "Algorithmically matches you with a stranger whose ranking history mirrors yours — someone whose next restaurant pick you can trust completely." },
  { name: "Table Chemistry", desc: "Solves the group dinner problem: Beli runs a pairwise tournament across everyone's profiles and returns a shortlist the whole group can agree on." },
  { name: "The Blind Spot", desc: "An anti-recommendation engine that identifies cuisines or neighborhoods you've avoided and challenges you to try one. Gamified with a comfort zone score." },
  { name: "Dish-Level Pairwise", desc: "Extends pairwise ranking from restaurants to individual dishes, aggregated into city-wide dish leaderboards as a discovery layer." },
  { name: "Beli for Business", desc: "A private shared workspace for companies to maintain ranked restaurant lists for client dinners and team offsites — with a B2B subscription model." },
  { name: "The Correspondent", desc: "Before visiting a new city, post a dining brief. Local Beli power users respond with personalized picks tailored to your taste profile." },
];

const s2Pillars = [
  { label: "Mission Alignment", quote: '"We look for partnerships that enhance the product in a way that would be very difficult for us to do ourselves."' },
  { label: "User Trust", quote: '"We started Beli because we believe deeply that online reviews are broken. Any monetization strategy will need to clear a high bar."' },
  { label: "Real-World Utility", quote: '"The app is meant to get you to do things in the real world — not to be a place where users are scrolling all day."' },
  { label: "Community Integrity", quote: '"The idea was to build a community around this common interest that people love — and actually, not to talk about the app much at all."' },
];
const s2Options = [
  { name: "Google Maps", desc: "1B+ users. Integration could expand Beli's reach dramatically — but Google is also a potential acquirer and direct competitor." },
  { name: "TikTok / Instagram", desc: "Where Beli's Gen Z users already live. Could turbocharge growth — but risks turning Beli into a content feed rather than a real-world utility." },
  { name: "Resy / OpenTable", desc: "Beli already integrates with OpenTable. Deepening this relationship could close the loop on the dining journey end-to-end." },
  { name: "Uber Eats / DoorDash", desc: "Could extend Beli to at-home dining occasions — but delivery is fundamentally different from the in-person experience Beli was built around." },
  { name: "Airbnb / Travel Platform", desc: "Travelers are high-intent for restaurant discovery. Could unlock a new acquisition channel — but may dilute Beli's local community identity." },
  { name: "Amex / Chase", desc: "A co-branded dining rewards partnership could monetize without advertising — but risks the perception of pay-to-play recommendations." },
];

const s3Pillars = [
  { label: "Core Problem Fit", quote: '"Taste is personal" — does this category suffer from the same consensus-rating problem Beli was built to solve?' },
  { label: "Real-World Behavior", quote: '"The app is meant to get you to do things in the real world." Does this vertical drive frequent, high-intent visits?' },
  { label: "Community & Social Signal", quote: '"Build a community around a common interest that people love." Does this category carry the same identity as food?' },
  { label: "Mission Integrity", quote: '"Does it help our mission?" Would expanding here strengthen or dilute Beli as a trusted discovery platform?' },
];
const s3Options = [
  { name: "Hotels & Boutique Stays", desc: "Same consensus-rating problem as restaurants. Natural adjacency to dining — but risks diluting Beli's tight foodie identity." },
  { name: "Live Music & Concerts", desc: "Taste-driven and underserved. Strong Gen Z resonance. But shows are ephemeral — complicating the pairwise mechanic." },
  { name: "Fitness Studios & Gyms", desc: "High frequency, poor discovery tools. But the psychology is utility over pleasure — conflicting with Beli's hedonic mission." },
  { name: "Travel Experiences & Tours", desc: "Large market, poor ratings, highly personal. But most people take few trips yearly — limiting the pairwise engine's effectiveness." },
  { name: "Spas & Wellness", desc: "Large market, personal preferences, weak discovery tools. But the experience is private — the tell-your-friends impulse may not translate." },
  { name: "Museums & Cultural Institutions", desc: "Taste-driven and underserved. Strong Gen Z culture resonance. Low visit frequency is the main liability." },
];

export const ACTIVITIES = [
  {
    section: "Section 1", num: "01", title: "Prioritize the Feature Roadmap",
    tag: "Product Strategy",
    accent: "#1A7A5E", heroDark: "#0D2B24", heroLight: "#7ECFB8",
    contentBg: "#EFF8F4", cardBg: "#FFFFFF", border: "#B8E0D2", muted: "#2D6B58",
    context: "Beli's founders evaluate every decision through one lens: Does it help our mission? With a team of 7 and mounting pressure to grow, the product roadmap is a strategic document — not just a technical one. Your job is to bring discipline to that decision.",
    task: "Using Beli's four strategic pillars as your evaluative criteria (weighted equally), rank the six proposed features from highest to lowest priority. Score each feature 1–3 per pillar (1 = conflicts, 2 = neutral, 3 = strongly aligned) and sum the scores. Then discuss: does the highest-scoring feature feel like the right #1 choice? Does the math match your strategic instinct?",
    pillars: s1Pillars, options: s1Options,
    optLabel: "The Six Features to Rank",
    scoring: "1 = conflicts with pillar · 2 = neutral · 3 = strongly aligned · Max score: 12",
    slide: ["Your ranked top 3 with pillar scores", "Where your instinct diverged from the scorecard — and why", "The single strongest argument against your #1 choice"],
  },
  {
    section: "Section 2", num: "02", title: "Choose the Right Partner",
    tag: "Strategic Partnerships",
    accent: "#6C4FC4", heroDark: "#1A1230", heroLight: "#B8A8F0",
    contentBg: "#F2F0FC", cardBg: "#FFFFFF", border: "#D4CEEE", muted: "#4A3A8A",
    context: "Beli has already integrated with OpenTable and SevenRooms. But the founders know they can't build everything. The right partnership could dramatically accelerate growth — the wrong one could compromise integrity or hand leverage to a potential acquirer.",
    task: "Using Beli's four partnership criteria (weighted equally), score each of the six potential partners 1–3 per criterion (1 = conflicts, 2 = neutral, 3 = strongly aligned) and sum the scores. Then discuss: does the top scorer feel like the right choice? What does the scorecard miss that your instinct picks up?",
    pillars: s2Pillars, options: s2Options,
    optLabel: "The Six Potential Partners",
    scoring: "1 = conflicts with criterion · 2 = neutral · 3 = strongly aligned · Max score: 12",
    slide: ["Your top partner pick with criterion scores", "What Beli gains vs. what it risks", "The one guardrail that would make this deal acceptable"],
  },
  {
    section: "Section 3", num: "03", title: "Pick a New Vertical",
    tag: "Market Expansion",
    accent: "#B85010", heroDark: "#2B1508", heroLight: "#F0A070",
    contentBg: "#FDF3EC", cardBg: "#FFFFFF", border: "#EDD0B8", muted: "#8A4010",
    context: "Beli's pairwise ranking engine was built for restaurants. But the founders acknowledge the model could apply to any category where subjective taste matters and aggregate ratings fall short.",
    task: "Using Beli's four expansion criteria (weighted equally), score each of the six candidate verticals 1–3 per criterion (1 = conflicts, 2 = neutral, 3 = strongly aligned) and sum the scores. Then debate: is the highest-scoring vertical actually the right move? What does mission-alignment miss about the market opportunity?",
    pillars: s3Pillars, options: s3Options,
    optLabel: "The Six Candidate Verticals",
    scoring: "1 = conflicts with criterion · 2 = neutral · 3 = strongly aligned · Max score: 12",
    slide: ["Your top vertical with criterion scores", "Why Beli's model solves this category's specific ratings problem", "The single biggest risk — and how you'd mitigate it"],
  },
];
