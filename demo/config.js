// ============================================================
// DEMO CONTENT — edit this file to change everything shown.
// No other file needs to be touched for content changes.
// ============================================================

const DEMO_CONFIG = {
  student: "Alejo",
  teacher: "Prof. Emiliano",
  course: "Economic History of Latin America",
  topic: "The Tequila Crisis",
  // Start-screen headline (rendered as HTML): navy with one yellow
  // highlight word, per the brand headline pattern.
  topicHeadline: 'The <span class="hl">Tequila</span> Crisis.',

  // Shown on the start screen (the "homework starts with one or
  // two sentences" part of the flow).
  homeworkIntro:
    "You've finished your homework on the 1994 Mexican peso crisis. " +
    "Your tutor will now ask you a few questions out loud — answer in your own words.",

  // Short confirmation flashed after each answer, before the next
  // question (the "acknowledgement beat").
  acknowledgement: "Got it ✓",

  // The oral questions. Audio is played as "the AI tutor speaking"
  // (recorded by the teacher); text is displayed while it plays.
  // In the demo script, Q3 is answered WRONG — the analysis flags it.
  questions: [
    {
      audio: "assets/audio/q1.m4a",
      text: "What were the consequences in the day-to-day life of the average Mexican during the crisis?",
    },
    {
      audio: "assets/audio/q2.m4a",
      text: "Was the US financial rescue package a lifeline or a loss of sovereignty?",
    },
    {
      audio: "assets/audio/q3.m4a",
      text: "Was the Tequila Crisis the result of historical factors or initial mismanagement?",
    },
  ],

  // The "money moment": insight lines streamed one by one while
  // the orb pulses, connecting the spoken answers to the review.
  analysis: {
    status: "Analyzing your answers…",
    insights: [
      { ok: true, text: "Strong answer — daily-life consequences of the crisis" },
      { ok: true, text: "Clear reasoning — the US rescue package and sovereignty" },
      { ok: false, text: "Gap detected — Tesobonos and Mexico's debt accumulation" },
    ],
  },

  // Short loading beat between the analysis and the review video.
  generating: {
    status: "Generating your personalized review…",
  },

  // Played AFTER the analysis: the teacher's AI avatar reviewing
  // the topics the student missed, generated from their answers.
  reviewVideo: {
    src: "assets/video/tutor-intro.mp4",
    captions: "assets/video/tutor-intro.vtt",
    eyebrow: "Personalized review",
    lead: "Based on your answers, your teacher's AI avatar prepared a short review of the topics to reinforce.",
  },

  // Asked when the review video ends (the flow freezes there until
  // Space is pressed).
  feedback: {
    prompt: "Was this review helpful?",
    thanks: "Thanks, Alejo — feedback sent to Prof. Emiliano.",
  },

  // Student end screen — honest, not all-green: two topics solid,
  // the flagged one already reviewed with the tutor.
  summary: {
    title: 'Session <span class="hl">complete</span>.',
    message:
      "Good session, Alejo. Two topics are solid — your tutor just reviewed the one that needs work.",
    topics: [
      { ok: true, text: "Hyperinflation, unemployment and household debt" },
      { ok: true, text: "The US rescue package and sovereignty" },
      { ok: false, text: "Tesobonos and Mexico's debt accumulation — reviewed with your tutor" },
    ],
    footer: "Results shared with Prof. Emiliano's dashboard.",
  },

  // What the teacher sees after the session (next beat in the flow).
  teacherView: {
    eyebrow: "Teacher dashboard",
    title: 'Prof. Emiliano — <span class="hl">Grupo 5°B</span>.',
    subtitle: "Homework review: The Tequila Crisis · 28 of 31 students completed",
    columns: ["Daily-life consequences", "Rescue package", "Tesobonos & debt"],
    students: [
      { name: "Alejo Ramírez", cells: ["ok", "ok", "gap"], highlight: true },
      { name: "Camila Torres", cells: ["ok", "ok", "ok"] },
      { name: "Diego Fuentes", cells: ["ok", "gap", "ok"] },
      { name: "Mariana López", cells: ["ok", "ok", "ok"] },
      { name: "Santiago Vera", cells: ["gap", "ok", "gap"] },
    ],
    insight:
      "Class-wide gap: 11 of 28 students struggled with Tesobonos — suggested: a 10-minute recap next class.",
  },
};
