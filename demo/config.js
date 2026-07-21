// ============================================================
// DEMO CONTENT — edit this file to change everything shown.
// No other file needs to be touched for content changes.
// ============================================================

const DEMO_CONFIG = {
  student: "Alejo",
  teacher: "Prof. Emiliano",
  course: "Economic History of Latin America",
  topic: "The Tequila Crisis",

  // Shown on the start screen (the "homework starts with one or
  // two sentences" part of the flow).
  homeworkIntro:
    "You've finished your homework on the 1994 Mexican peso crisis. " +
    "Your tutor will now ask you a few questions out loud — answer in your own words.",

  // Played AFTER the questions: the teacher's AI avatar reviewing
  // the topics the student missed, generated from their answers.
  reviewVideo: {
    src: "assets/video/tutor-intro.mp4",
    captions: "assets/video/tutor-intro.vtt",
    eyebrow: "Personalized review",
    lead: "Based on your answers, your teacher's AI avatar prepared a short review of the topics to reinforce.",
  },

  // Shown between the last answer and the video.
  analysis: {
    status: "Analyzing your answers…",
  },

  // The oral questions. Audio is played as "the AI tutor speaking"
  // (recorded by the teacher); text is displayed while it plays.
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

  // End screen content.
  summary: {
    title: "Session complete",
    message: "Great work, Alejo. You explained the key ideas in your own words.",
    topics: [
      "Hyperinflation, unemployment and household debt",
      "The US rescue package and sovereignty",
      "Tesobonos and Mexico's debt accumulation",
    ],
    footer: "Results shared with Prof. Emiliano's dashboard.",
  },
};
