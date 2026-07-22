// ============================================================
// Voice session demo — state machine + audio-reactive orb.
// States: pick-subject → pick-topic → start
//         → speaking(q) ⇄ listening(q) → ack(q) …
//         → analyzing → generating → video → feedback → done → teacher
// Space / → / PageDown advance · ← / PageUp go back · R restarts.
// ============================================================

const $ = (sel) => document.querySelector(sel);

const screens = {
  pick: $("#screen-pick"),
  start: $("#screen-start"),
  voice: $("#screen-voice"),
  video: $("#screen-video"),
  done: $("#screen-done"),
  teacher: $("#screen-teacher"),
};

const orb = $("#orb");
const halo = $("#orb-halo");
const statusEl = $("#status");
const questionEl = $("#question-text");
const insightsEl = $("#insights");
const genLoader = $("#gen-loader");
const progressEl = $("#progress");
const video = $("#review-video");
const feedbackEl = $("#feedback");
const feedbackPrompt = $("#feedback-prompt");
const thumbUp = $("#thumb-up");
const thumbDown = $("#thumb-down");

let state = "start";
let qIndex = 0;
let timers = [];

function later(fn, ms) {
  timers.push(setTimeout(fn, ms));
}

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

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
  const pulse = state === "analyzing" || state === "generating" ? 450 : 900;
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

// ---------- Class / topic picker ----------
// Two quick steps before the homework intro. Only the scripted path
// is live (enabled: true); the other cards nudge and show the hint.
// Space auto-picks the live card so the stage flow stays foolproof.

const pickHint = $("#pick-hint");
let liveCard = null; // the enabled card of the current step

function showPicker(step) {
  clearTimers();
  state = step === "subjects" ? "pick-subject" : "pick-topic";
  const cfg = DEMO_CONFIG.picker[step];

  $("#pick-eyebrow").textContent = cfg.eyebrow;
  $("#pick-title").innerHTML = cfg.title;
  pickHint.textContent = cfg.hint;
  pickHint.classList.remove("visible");

  const list = $("#pick-cards");
  list.innerHTML = "";
  liveCard = null;
  cfg.items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "pick-card" + (item.enabled ? "" : " demo");
    const name = document.createElement("div");
    name.className = "pick-name";
    name.textContent = item.name;
    li.appendChild(name);
    if (item.sub) {
      const sub = document.createElement("div");
      sub.className = "pick-sub";
      sub.textContent = item.sub;
      li.appendChild(sub);
    }
    li.addEventListener("click", (e) => {
      e.stopPropagation();
      if (item.enabled) selectCard(li);
      else nudge(li);
    });
    if (item.enabled) liveCard = li;
    list.appendChild(li);
  });

  // Re-trigger the fade-in between the two steps.
  screens.pick.classList.remove("active");
  void screens.pick.offsetWidth;
  show("pick");
}

// Highlight the card for a beat before moving on, so the choice reads.
function selectCard(li) {
  if (li.classList.contains("selected")) return;
  li.classList.add("selected");
  later(() => {
    if (state === "pick-subject") showPicker("topics");
    else if (state === "pick-topic") showStart();
  }, 350);
}

function nudge(li) {
  li.classList.add("nope");
  pickHint.classList.add("visible");
  setTimeout(() => li.classList.remove("nope"), 400);
}

function showStart() {
  clearTimers();
  state = "start";
  show("start");
}

function begin() {
  if (!audioCtx) setupAudio();
  show("voice");
  renderProgress();
  askQuestion(0);
}

function askQuestion(i) {
  clearTimers();
  qIndex = i;
  state = "speaking";
  show("voice");
  orb.classList.remove("listening");
  halo.classList.remove("listening");
  statusEl.classList.remove("ack");
  statusEl.textContent = "Tutor is speaking…";
  questionEl.textContent = DEMO_CONFIG.questions[i].text;
  insightsEl.innerHTML = "";
  genLoader.classList.remove("active");
  renderProgress();

  // Cache-buster: force a fresh fetch when the .m4a files are replaced
  // without renaming them.
  questionAudio.src = DEMO_CONFIG.questions[i].audio + "?v=" + Date.now();
  questionAudio.play().catch(() => startListening());
}

function startListening() {
  state = "listening";
  orb.classList.add("listening");
  halo.classList.add("listening");
  statusEl.textContent = "Listening — answer in your own words";
}

// The acknowledgement beat: a short "Got it ✓" before moving on,
// so the tutor visibly registers the answer.
function acknowledge() {
  state = "ack";
  statusEl.classList.add("ack");
  statusEl.textContent = DEMO_CONFIG.acknowledgement;
  later(() => {
    statusEl.classList.remove("ack");
    if (qIndex + 1 < DEMO_CONFIG.questions.length) {
      askQuestion(qIndex + 1);
    } else {
      startAnalysis();
    }
  }, 750);
}

// The money moment between the last answer and the review video:
// the orb pulses while insight lines stream in one by one,
// flagging the gap the review video will address.
function startAnalysis() {
  clearTimers();
  state = "analyzing";
  qIndex = DEMO_CONFIG.questions.length;
  show("voice");
  video.pause();
  orb.classList.remove("listening");
  halo.classList.remove("listening");
  statusEl.classList.remove("ack");
  statusEl.textContent = DEMO_CONFIG.analysis.status;
  questionEl.textContent = "";
  insightsEl.innerHTML = "";
  genLoader.classList.remove("active");
  renderProgress();

  const lines = DEMO_CONFIG.analysis.insights;
  lines.forEach((line, i) => {
    later(() => {
      const li = document.createElement("li");
      li.className = line.ok ? "ok" : "gap";
      li.textContent = line.text;
      insightsEl.appendChild(li);
    }, 900 + i * 1100);
  });
  later(startGenerating, 900 + lines.length * 1100 + 1500);
}

// 2-second loading beat: the insights stay on screen while the
// personalized review video is "generated".
function startGenerating() {
  clearTimers();
  state = "generating";
  show("voice");
  statusEl.textContent = DEMO_CONFIG.generating.status;
  genLoader.classList.add("active");
  later(startVideo, 2000);
}

function startVideo() {
  clearTimers();
  state = "video";
  genLoader.classList.remove("active");
  hideFeedback();
  show("video");
  video.currentTime = 0;
  video.play().catch(() => {});
}

// When the video ends the flow FREEZES on its last frame and asks
// the student for feedback; only Space moves on to the summary.
video.addEventListener("ended", () => {
  if (state === "video") enterFeedback();
});

function enterFeedback() {
  clearTimers();
  state = "feedback";
  show("video");
  video.pause();
  feedbackPrompt.textContent = DEMO_CONFIG.feedback.prompt;
  thumbUp.classList.remove("selected");
  thumbDown.classList.remove("selected");
  feedbackEl.classList.add("active");
  screens.video.classList.add("feedback-open");
}

function hideFeedback() {
  feedbackEl.classList.remove("active");
  screens.video.classList.remove("feedback-open");
  thumbUp.classList.remove("selected");
  thumbDown.classList.remove("selected");
}

function finish() {
  clearTimers();
  video.pause();
  hideFeedback();
  state = "done";
  show("done");
}

function showTeacher() {
  state = "teacher";
  show("teacher");
}

function restart() {
  clearTimers();
  if (questionAudio) questionAudio.pause();
  video.pause();
  orb.classList.remove("listening");
  halo.classList.remove("listening");
  statusEl.classList.remove("ack");
  genLoader.classList.remove("active");
  hideFeedback();
  qIndex = 0;
  showPicker("subjects");
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

// Space is the primary control; Enter / ArrowRight / PageDown also
// advance and ArrowLeft / PageUp go back, so a presentation clicker
// can drive the demo in both directions. R restarts from the top.
const ADVANCE_KEYS = ["Space", "Enter", "ArrowRight", "PageDown"];
const BACK_KEYS = ["ArrowLeft", "PageUp"];

function advance() {
  // Space auto-picks the scripted card on the picker steps.
  if (state === "pick-subject" || state === "pick-topic") {
    if (liveCard) selectCard(liveCard);
    return;
  }
  if (state === "start") return begin();
  if (state === "speaking") {
    // Skip straight to listening mid-question if needed.
    questionAudio.pause();
    return startListening();
  }
  if (state === "listening") return acknowledge();
  if (state === "ack") return; // let the beat finish on its own
  if (state === "analyzing") return startGenerating();
  if (state === "generating") return startVideo();
  if (state === "video") return enterFeedback(); // skip to the freeze
  if (state === "feedback") return finish();
  if (state === "done") return showTeacher();
}

// Step one beat backwards — the safety valve for an accidental
// double-press on stage.
function goBack() {
  if (state === "pick-topic") return showPicker("subjects");
  if (state === "start") return showPicker("topics");
  if (state === "speaking" || state === "listening" || state === "ack") {
    if (qIndex > 0) return askQuestion(qIndex - 1);
    return showStart();
  }
  if (state === "analyzing") return askQuestion(DEMO_CONFIG.questions.length - 1);
  // From the generating beat or the video, go back to the analysis
  // beat itself (stepping "back" into an auto-advancing 2s loader
  // would just bounce forward again).
  if (state === "generating" || state === "video") return startAnalysis();
  if (state === "feedback") return startVideo(); // replay the review
  if (state === "done") return enterFeedback();
  if (state === "teacher") return finish();
}

document.addEventListener("keydown", (e) => {
  if (e.code === "KeyR") {
    e.preventDefault();
    return restart();
  }
  if (BACK_KEYS.includes(e.code)) {
    e.preventDefault();
    return goBack();
  }
  if (ADVANCE_KEYS.includes(e.code)) {
    e.preventDefault();
    return advance();
  }
});

$("#start-btn").addEventListener("click", () => {
  if (state === "start") begin();
});

// Click-anywhere fallback during the voice session, in case the
// keyboard misbehaves on stage.
screens.voice.addEventListener("click", () => {
  if (state === "speaking" || state === "listening") advance();
});

// Thumbs record the choice and thank the student; the flow still
// waits for Space so the moment can breathe on stage.
function pickThumb(btn, other) {
  if (state !== "feedback") return;
  btn.classList.add("selected");
  other.classList.remove("selected");
  feedbackPrompt.textContent = DEMO_CONFIG.feedback.thanks;
}

thumbUp.addEventListener("click", () => pickThumb(thumbUp, thumbDown));
thumbDown.addEventListener("click", () => pickThumb(thumbDown, thumbUp));

// ---------- Populate static content from config ----------

function hydrate() {
  $("#course").textContent = DEMO_CONFIG.course;
  // Headlines carry the brand's one-yellow-word markup (config-owned
  // trusted strings), so they hydrate as HTML.
  $("#topic-title").innerHTML = DEMO_CONFIG.topicHeadline;
  $("#homework-intro").textContent = DEMO_CONFIG.homeworkIntro;
  $("#voice-topic").textContent = DEMO_CONFIG.topic;
  $("#summary-title").innerHTML = DEMO_CONFIG.summary.title;
  $("#summary-message").textContent = DEMO_CONFIG.summary.message;
  $("#summary-footer").textContent = DEMO_CONFIG.summary.footer;

  const list = $("#summary-topics");
  DEMO_CONFIG.summary.topics.forEach((t) => {
    const li = document.createElement("li");
    li.className = t.ok ? "ok" : "gap";
    li.textContent = t.text;
    list.appendChild(li);
  });

  $("#video-eyebrow").textContent = DEMO_CONFIG.reviewVideo.eyebrow;
  $("#video-lead").textContent = DEMO_CONFIG.reviewVideo.lead;
  // Cache-buster: force a fresh fetch when the media files are
  // replaced without renaming them (same trick as the question audio).
  video.querySelector("source").src = DEMO_CONFIG.reviewVideo.src + "?v=" + Date.now();
  video.querySelector("track").src = DEMO_CONFIG.reviewVideo.captions + "?v=" + Date.now();
  video.load();
  const track = video.textTracks[0];
  if (track) track.mode = "showing";

  hydrateTeacher();
}

function hydrateTeacher() {
  const cfg = DEMO_CONFIG.teacherView;
  $("#teacher-eyebrow").textContent = cfg.eyebrow;
  $("#teacher-title").innerHTML = cfg.title;
  $("#teacher-subtitle").textContent = cfg.subtitle;
  $("#teacher-insight").textContent = cfg.insight;

  const table = $("#teacher-table");
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  ["Student", ...cfg.columns].forEach((col) => {
    const th = document.createElement("th");
    th.textContent = col;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  cfg.students.forEach((s) => {
    const tr = document.createElement("tr");
    if (s.highlight) tr.className = "highlight";
    const name = document.createElement("td");
    name.className = "name";
    name.textContent = s.name;
    tr.appendChild(name);
    s.cells.forEach((cell) => {
      const td = document.createElement("td");
      const dot = document.createElement("span");
      dot.className = "cell-dot " + cell;
      dot.textContent = cell === "ok" ? "✓" : "!";
      td.appendChild(dot);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

hydrate();
showPicker("subjects");
animate();
