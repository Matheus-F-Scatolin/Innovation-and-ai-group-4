// ============================================================
// Voice session demo — state machine + audio-reactive orb.
// States: start → speaking(q) ⇄ listening(q) → analyzing
//         → video (personalized review) → done
// Space advances everything.
// ============================================================

const $ = (sel) => document.querySelector(sel);

const screens = {
  start: $("#screen-start"),
  video: $("#screen-video"),
  voice: $("#screen-voice"),
  done: $("#screen-done"),
};

const orb = $("#orb");
const halo = $("#orb-halo");
const statusEl = $("#status");
const questionEl = $("#question-text");
const hintEl = $("#hint");
const progressEl = $("#progress");
const video = $("#review-video");

let state = "start";
let qIndex = 0;
let analysisTimer = null;

// ---------- Audio plumbing ----------

let audioCtx = null;
let playbackAnalyser = null; // reacts to the tutor's voice
let micAnalyser = null; // reacts to the student's voice
let questionAudio = null;

function setupAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  questionAudio = new Audio();
  const src = audioCtx.createMediaElementSource(questionAudio);
  playbackAnalyser = audioCtx.createAnalyser();
  playbackAnalyser.fftSize = 512;
  src.connect(playbackAnalyser);
  playbackAnalyser.connect(audioCtx.destination);

  questionAudio.addEventListener("ended", () => {
    if (state === "speaking") startListening();
  });

  // Mic is optional: if it fails, the orb falls back to a gentle
  // idle pulse while listening and the demo continues.
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const micSrc = audioCtx.createMediaStreamSource(stream);
      micAnalyser = audioCtx.createAnalyser();
      micAnalyser.fftSize = 512;
      micSrc.connect(micAnalyser);
    })
    .catch(() => {
      micAnalyser = null;
    });
}

function levelFrom(analyser) {
  if (!analyser) return 0;
  const data = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(data);
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const v = (data[i] - 128) / 128;
    sum += v * v;
  }
  return Math.sqrt(sum / data.length); // RMS, ~0..0.5
}

// ---------- Orb animation ----------

let smooth = 0;

function animate() {
  let level = 0;
  if (state === "speaking") level = levelFrom(playbackAnalyser);
  else if (state === "listening") level = levelFrom(micAnalyser);

  // Fallback breathing when there's no signal to react to.
  const pulse = state === "analyzing" ? 450 : 900;
  const breath = 0.03 * (1 + Math.sin(performance.now() / pulse));
  const target = Math.min(1, level * 5.5) + breath;

  // Faster attack than release — reactive but not jittery.
  smooth += (target - smooth) * (target > smooth ? 0.28 : 0.14);
  const scale = 1 + smooth * 0.65;
  orb.style.transform = `scale(${scale})`;
  halo.style.transform = `scale(${1 + smooth * 1.25})`;

  requestAnimationFrame(animate);
}

// ---------- Screens & state transitions ----------

function show(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function begin() {
  setupAudio();
  show("voice");
  renderProgress();
  askQuestion(0);
}

function askQuestion(i) {
  qIndex = i;
  state = "speaking";
  orb.classList.remove("listening");
  halo.classList.remove("listening");
  statusEl.textContent = "Tutor is speaking…";
  questionEl.textContent = DEMO_CONFIG.questions[i].text;
  hintEl.innerHTML = "";
  renderProgress();

  questionAudio.src = DEMO_CONFIG.questions[i].audio;
  questionAudio.play().catch(() => startListening());
}

function startListening() {
  state = "listening";
  orb.classList.add("listening");
  halo.classList.add("listening");
  statusEl.textContent = "Listening — answer in your own words";
  hintEl.innerHTML = "Press <kbd>Space</kbd> when you're done";
}

function nextStep() {
  if (qIndex + 1 < DEMO_CONFIG.questions.length) {
    askQuestion(qIndex + 1);
  } else {
    startAnalysis();
  }
}

// Scripted beat between the last answer and the review video:
// the orb pulses while "analyzing", then the video takes over.
function startAnalysis() {
  state = "analyzing";
  qIndex = DEMO_CONFIG.questions.length;
  orb.classList.remove("listening");
  halo.classList.remove("listening");
  statusEl.textContent = DEMO_CONFIG.analysis.status;
  questionEl.textContent = "";
  hintEl.innerHTML = "";
  renderProgress();
  analysisTimer = setTimeout(startVideo, 2400);
}

function startVideo() {
  clearTimeout(analysisTimer);
  state = "video";
  show("video");
  video.currentTime = 0;
  video.play().catch(() => {});
}

video.addEventListener("ended", finish);

function finish() {
  state = "done";
  show("done");
}

function renderProgress() {
  progressEl.innerHTML = "";
  DEMO_CONFIG.questions.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "dot" + (i < qIndex ? " done" : i === qIndex ? " current" : "");
    progressEl.appendChild(dot);
  });
}

// ---------- Controls ----------

// Space is the primary control; Enter / ArrowRight / PageDown also work
// so a presentation clicker can drive the demo.
const ADVANCE_KEYS = ["Space", "Enter", "ArrowRight", "PageDown"];

function advance() {
  if (state === "start") return begin();
  if (state === "speaking") {
    // Skip straight to listening mid-question if needed.
    questionAudio.pause();
    return startListening();
  }
  if (state === "listening") return nextStep();
  if (state === "analyzing") return startVideo();
  if (state === "video") {
    // Safety valve: skip the video if playback misbehaves on stage.
    video.pause();
    return finish();
  }
}

document.addEventListener("keydown", (e) => {
  if (!ADVANCE_KEYS.includes(e.code)) return;
  e.preventDefault();
  advance();
});

$("#start-btn").addEventListener("click", () => {
  if (state === "start") begin();
});

// Click-anywhere fallback during the voice session, in case the
// keyboard misbehaves on stage.
screens.voice.addEventListener("click", () => {
  if (state === "speaking" || state === "listening") advance();
});

// ---------- Populate static content from config ----------

function hydrate() {
  $("#course").textContent = DEMO_CONFIG.course;
  $("#topic-title").textContent = DEMO_CONFIG.topic;
  $("#homework-intro").textContent = DEMO_CONFIG.homeworkIntro;
  $("#voice-topic").textContent = DEMO_CONFIG.topic;
  $("#summary-title").textContent = DEMO_CONFIG.summary.title;
  $("#summary-message").textContent = DEMO_CONFIG.summary.message;
  $("#summary-footer").textContent = DEMO_CONFIG.summary.footer;

  const list = $("#summary-topics");
  DEMO_CONFIG.summary.topics.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    list.appendChild(li);
  });

  $("#video-eyebrow").textContent = DEMO_CONFIG.reviewVideo.eyebrow;
  $("#video-lead").textContent = DEMO_CONFIG.reviewVideo.lead;
  video.querySelector("source").src = DEMO_CONFIG.reviewVideo.src;
  video.querySelector("track").src = DEMO_CONFIG.reviewVideo.captions;
  video.load();
  const track = video.textTracks[0];
  if (track) track.mode = "showing";
}

hydrate();
show("start");
animate();
