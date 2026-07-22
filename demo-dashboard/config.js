// ============================================================
// DASHBOARD DEMO CONTENT — edit this file to change everything
// shown. No other file needs to be touched for content changes.
// This demo is freely clickable (a "real product" feel), unlike
// the linear student/teacher demos.
// ============================================================

const DASH_CONFIG = {
  teacher: "Prof. Emiliano",
  group: "Grupo 5°B",
  course: "Economic History of Latin America",

  // ---------- 1. Assignment list (landing) ----------
  assignments: {
    eyebrow: "Teacher dashboard",
    title: 'Prof. Emiliano — <span class="hl">Grupo 5°B</span>.',
    subtitle: "Historia Económica · 31 students · Click an assignment to see results.",
    hint: "This demo follows the Tequila Crisis — open that one.",
    // The first card is the scripted path; the others show past
    // results and the trends card opens the trends view.
    items: [
      {
        id: "tequila",
        name: "The Tequila Crisis",
        sub: "Homework review · closed yesterday",
        stat: "28 of 31 completed",
        flag: "1 class-wide gap",
        live: true,
      },
      {
        id: "import-sub",
        name: "Import Substitution",
        sub: "Homework review · last week",
        stat: "31 of 31 completed",
        flag: null,
        live: false,
      },
      {
        id: "lost-decade",
        name: "The Lost Decade",
        sub: "Homework review · two weeks ago",
        stat: "29 of 31 completed",
        flag: null,
        live: false,
      },
    ],
    trendsCard: {
      name: "Class trends",
      sub: "Mastery across the last three assignments",
    },
  },

  // ---------- 2. Class dashboard (Tequila Crisis) ----------
  classView: {
    eyebrow: "Homework review",
    title: 'The <span class="hl">Tequila</span> Crisis.',
    subtitle: "Grupo 5°B · 28 of 31 students completed · avg. session 9 min",
    hint: "This demo follows Alejo — click his row.",
    columns: ["Daily-life consequences", "Rescue package", "Tesobonos & debt"],
    students: [
      { name: "Alejo Ramírez", cells: ["ok", "ok", "gap"], highlight: true, live: true },
      { name: "Camila Torres", cells: ["ok", "ok", "ok"] },
      { name: "Diego Fuentes", cells: ["ok", "gap", "ok"] },
      { name: "Mariana López", cells: ["ok", "ok", "ok"] },
      { name: "Santiago Vera", cells: ["gap", "ok", "gap"] },
      { name: "Lucía Herrera", cells: ["ok", "ok", "gap"] },
      { name: "Tomás Aguilar", cells: ["ok", "ok", "ok"] },
      { name: "Valentina Cruz", cells: ["ok", "gap", "gap"] },
    ],
    insight:
      "Class-wide gap: 11 of 28 students struggled with Tesobonos and Mexico's debt accumulation.",
    actionsTitle: "Suggested actions",
    actions: [
      {
        icon: "🕑",
        title: "10-minute recap next class",
        text: "Tesobonos & debt accumulation — a short walkthrough would close the gap for 11 students.",
      },
      {
        icon: "👤",
        title: "Check in with Santiago",
        text: "Two gaps this week and a shorter-than-usual session — a quick 1:1 could help.",
      },
      {
        icon: "✉️",
        title: "Nudge 3 students",
        text: "Ana, Bruno and Sofía haven't completed the review yet. Send a reminder.",
      },
    ],
  },

  // ---------- 3. Student profile (Alejo) ----------
  studentView: {
    eyebrow: "Student profile",
    name: "Alejo Ramírez",
    initials: "AR",
    sub: "Grupo 5°B · Historia Económica · last session yesterday, 7:42 pm",
    stats: [
      { value: "12", label: "sessions completed" },
      { value: "9 min", label: "avg. session length" },
      { value: "4-week", label: "streak" },
      { value: "👍 92%", label: "found reviews helpful" },
    ],
    masteryTitle: "Topic mastery",
    mastery: [
      { ok: true, topic: "Daily-life consequences of the crisis", note: "Strong across 3 sessions" },
      { ok: true, topic: "The US rescue package and sovereignty", note: "Solid — argued both sides" },
      { ok: false, topic: "Tesobonos & Mexico's debt accumulation", note: "Gap — reviewed with tutor yesterday, recheck next week" },
      { ok: true, topic: "Import substitution (last week)", note: "Solid" },
    ],
    styleTitle: "How Alejo learns best",
    styleNotes: [
      "Responds well to real-life, day-to-day examples — abstract financial terms need grounding.",
      "Answers get stronger when asked to argue a position rather than recall facts.",
      "Tends to rush the first answer; a follow-up question usually surfaces real understanding.",
    ],
    quotesTitle: "From the tutor session",
    quotes: [
      {
        tag: "gap",
        label: "Where he struggled",
        text: "“The tesobonos were like… normal government bonds? I don't remember why they were different.”",
        note: "Tutor re-explained dollar-indexing with a household-debt analogy — Alejo restated it correctly after.",
      },
      {
        tag: "ok",
        label: "Strong reasoning",
        text: "“The rescue package saved the banks but ordinary people still lost their savings — that's why it felt like a loss of sovereignty.”",
        note: "Connected two topics unprompted.",
      },
    ],
  },

  // ---------- 4. Class trends ----------
  trendsView: {
    eyebrow: "Class trends",
    title: 'Grupo 5°B — <span class="hl">three</span> assignments.',
    subtitle: "Average topic mastery per assignment, from the tutor sessions.",
    bars: [
      { label: "The Lost Decade", sub: "two weeks ago", pct: 64 },
      { label: "Import Substitution", sub: "last week", pct: 78 },
      { label: "The Tequila Crisis", sub: "yesterday", pct: 84 },
    ],
    insight:
      "Mastery is trending up — +20 pts in two weeks. Students who watched their personalized review closed 3× more gaps than those who skipped it.",
  },
};
