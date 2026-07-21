// ============================================================
// TEACHER DEMO CONTENT — edit this file to change everything
// shown. No other file needs to be touched for content changes.
// Mirrors demo/config.js so the two demos read as one product.
// ============================================================

const TEACHER_CONFIG = {
  teacher: "Prof. Emiliano",
  course: "Economic History of Latin America",
  topic: "The Tequila Crisis",
  group: "Grupo 5°B",
  students: 31,

  // Shown on the start screen.
  intro:
    "Turn today's class into a homework review. Upload your class " +
    "materials, tell the tutor what matters most, and approve what it builds.",

  // ---------- 1. Upload beat ----------
  // Each advance "drops" the next file into the zone — no real
  // file dialogs on stage. Progress is faked per card.
  upload: {
    title: "New homework review",
    hint: "Add your class materials",
    files: [
      {
        icon: "🎙️",
        name: "Clase 12 — La Crisis del Tequila.m4a",
        meta: "Class recording · 42 min",
      },
      {
        icon: "📕",
        name: "Historia Económica de América Latina — Cap. 8.pdf",
        meta: "Course book · 34 pages",
      },
      {
        icon: "📊",
        name: "Clase 12 — Slides.pdf",
        meta: "Class slides · 18 slides",
      },
    ],
    ready: "Materials ready",
    continueLabel: "Continue",
  },

  // ---------- 2. Takeaways beat (presenter speaks live) ----------
  // The orb goes green and reacts to the real mic, exactly like
  // the student flow. Nothing is recorded or processed.
  takeaways: {
    status: "Listening — speak naturally",
    prompt:
      "Optional: tell the tutor the key takeaways you want your " +
      "students to leave with.",
    ack: "Takeaways captured ✓",
  },

  // ---------- 3. Analysis + generation beat ----------
  analysis: {
    status: "Analyzing your class materials…",
    insights: [
      { text: "Class recording transcribed — 42 minutes" },
      { text: "Book chapter and slides indexed" },
      { text: "3 key topics identified across your materials" },
      { text: "Your takeaways set the priorities" },
    ],
  },
  generating: {
    status: "Generating the homework review…",
  },

  // ---------- 4. Review & approve package ----------
  // The centerpiece: everything the student session consumes,
  // shown to the teacher BEFORE it ships. Question audio is the
  // same three recordings the student demo plays.
  package: {
    eyebrow: "Review & approve",
    title: "Homework review — The Tequila Crisis",
    subtitle:
      "Generated from your class. Nothing reaches students until you approve it.",
    brief: {
      label: "Homework brief",
      text:
        "You've finished your homework on the 1994 Mexican peso crisis. " +
        "Your tutor will now ask you a few questions out loud — answer " +
        "in your own words.",
    },
    voiceBadge: "Voice: Prof. Emiliano",
    questionsLabel: "Oral questions",
    checksLabel: "Checks for",
    questions: [
      {
        audio: "assets/audio/q1.m4a",
        text: "What were the consequences in the day-to-day life of the average Mexican during the crisis?",
        checks: "Inflation, unemployment and household debt in daily life",
      },
      {
        audio: "assets/audio/q2.m4a",
        text: "Was the US financial rescue package a lifeline or a loss of sovereignty?",
        checks: "The rescue package and the sovereignty trade-off",
      },
      {
        audio: "assets/audio/q3.m4a",
        text: "Was the Tequila Crisis the result of historical factors or initial mismanagement?",
        checks: "Tesobonos — Mexico's dollar-linked debt accumulation",
      },
    ],
    topics: {
      label: "Topic map",
      note: "These become the columns of your class dashboard.",
      items: ["Daily-life consequences", "Rescue package", "Tesobonos & debt"],
    },
    avatar: {
      label: "Avatar ready",
      text:
        "Your AI avatar will record a personalized review video for " +
        "each student who shows a gap.",
    },
    approveLabel: "Approve & assign to Grupo 5°B",
    approvingLabel: "Assigning…",
  },

  // ---------- 5. Assigned confirmation ----------
  assigned: {
    title: "Assigned to Grupo 5°B",
    message:
      "31 students will get the voice review on their devices. " +
      "Results land in your dashboard as they finish.",
    footer: "Next: the student experience.",
  },
};
