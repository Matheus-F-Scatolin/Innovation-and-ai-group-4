// ============================================================
// Teacher demo — state machine + audio-reactive orb.
// States: start → upload (3 staged drops) → takeaways ⇄ ack
//         → analyzing → generating → package → assigned
// Space / → / PageDown advance · ← / PageUp go back · R restarts.
// Same control scheme and visual language as ../demo (the
// student flow) so the two read as one product.
// ============================================================

const $ = (sel) => document.querySelector(sel);

const screens = {
  start: $("#screen-start"),
  upload: $("#screen-upload"),
  voice: $("#screen-voice"),
  package: $("#screen-package"),
  assigned: $("#screen-assigned"),
};

const orb = $("#orb");
const halo = $("#orb-halo");
const statusEl = $("#status");
const promptEl = $("#prompt-text");
const insightsEl = $("#insights");
const genLoader = $("#gen-loader");
const fileList = $("#file-list");
const dropZone = $("#drop-zone");
const dropHint = $("#drop-hint");
const readyNote = $("#ready-note");
const continueBtn = $("#continue-btn");
const approveBtn = $("#approve-btn");

let state = "start";
let uploadedCount = 0;
let timers = [];

function later(fn, ms) {
  timers.push(setTimeout(fn, ms));
}

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

// ---------- Audio plumbing ----------
// Only the mic matters here: the orb reacts to the presenter's
// voice during the takeaways beat. If the mic fails, the orb
// falls back to a gentle pulse and the demo continues.

let audioCtx = null;
let micAnalyser = null;

function setupAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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
  if (state === "takeaways") level = levelFrom(micAnalyser);

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

function begin() {
  if (!audioCtx) setupAudio();
  state = "upload";
  show("upload");
}

// Each advance "drops" the next pre-named file into the zone —
// a card appears with a short fake upload progress, then a ✓.
function uploadNext() {
  const files = TEACHER_CONFIG.upload.files;
  const file = files[uploadedCount];
  uploadedCount++;

  dropZone.classList.add("has-files");

  const li = document.createElement("li");
  li.className = "file-card";
  li.innerHTML =
    `<span class="icon"></span>` +
    `<div class="info"><div class="fname"></div>` +
    `<div class="fprogress"><span class="fill"></span></div>` +
    `<div class="fmeta"></div></div>` +
    `<span class="fcheck">✓</span>`;
  li.querySelector(".icon").textContent = file.icon;
  li.querySelector(".fname").textContent = file.name;
  fileList.appendChild(li);

  // Progress fills for ~0.8s, then the card flips to "uploaded".
  later(() => {
    li.classList.add("uploaded");
    li.querySelector(".fmeta").textContent = file.meta;
    if (uploadedCount === files.length) {
      dropZone.classList.add("complete");
      readyNote.classList.add("visible");
      continueBtn.classList.add("ready");
    }
  }, 850);
}

function removeLastUpload() {
  uploadedCount--;
  const last = fileList.lastElementChild;
  if (last) last.remove();
  dropZone.classList.remove("complete");
  readyNote.classList.remove("visible");
  continueBtn.classList.remove("ready");
  if (uploadedCount === 0) dropZone.classList.remove("has-files");
}

// Return to the upload screen with all files intact (back-nav).
function showUpload() {
  clearTimers();
  state = "upload";
  orb.classList.remove("listening");
  halo.classList.remove("listening");
  show("upload");
}

// ---------- Takeaways beat (presenter speaks live) ----------

function startTakeaways() {
  clearTimers();
  state = "takeaways";
  show("voice");
  orb.classList.add("listening");
  halo.classList.add("listening");
  statusEl.classList.remove("ack");
  statusEl.textContent = TEACHER_CONFIG.takeaways.status;
  promptEl.textContent = TEACHER_CONFIG.takeaways.prompt;
  insightsEl.innerHTML = "";
  genLoader.classList.remove("active");
}

// Short "Takeaways captured ✓" beat before the analysis, so the
// tutor visibly registers what the teacher said.
function acknowledge() {
  state = "ack";
  statusEl.classList.add("ack");
  statusEl.textContent = TEACHER_CONFIG.takeaways.ack;
  later(() => {
    statusEl.classList.remove("ack");
    startAnalysis();
  }, 750);
}

// The orb pulses while insight lines stream in one by one —
// the "your materials are being understood" moment.
function startAnalysis() {
  clearTimers();
  state = "analyzing";
  show("voice");
  orb.classList.remove("listening");
  halo.classList.remove("listening");
  statusEl.classList.remove("ack");
  statusEl.textContent = TEACHER_CONFIG.analysis.status;
  promptEl.textContent = "";
  insightsEl.innerHTML = "";
  genLoader.classList.remove("active");

  const lines = TEACHER_CONFIG.analysis.insights;
  lines.forEach((line, i) => {
    later(() => {
      const li = document.createElement("li");
      li.textContent = line.text;
      insightsEl.appendChild(li);
    }, 900 + i * 1100);
  });
  later(startGenerating, 900 + lines.length * 1100 + 1500);
}

// 2-second loading beat: the insights stay on screen while the
// homework package is "generated".
function startGenerating() {
  clearTimers();
  state = "generating";
  show("voice");
  statusEl.textContent = TEACHER_CONFIG.generating.status;
  genLoader.classList.add("active");
  later(showPackage, 2000);
}

// ---------- Review & approve package ----------

function showPackage() {
  clearTimers();
  stopPreview();
  genLoader.classList.remove("active");
  approveBtn.classList.remove("busy");
  approveBtn.textContent = TEACHER_CONFIG.package.approveLabel;
  state = "package";

  // Re-trigger the staggered card animation on every entry.
  const cards = screens.package.querySelectorAll(".pkg-card, .btn.approve");
  cards.forEach((c) => {
    c.style.animation = "none";
    void c.offsetWidth; // reflow to restart the CSS animation
    c.style.animation = "";
  });

  show("package");
}

function approve() {
  if (state !== "package") return;
  stopPreview();
  state = "approving";
  approveBtn.classList.add("busy");
  approveBtn.textContent = TEACHER_CONFIG.package.approvingLabel;
  later(() => {
    state = "assigned";
    show("assigned");
  }, 900);
}

// ---------- Question audio previews ----------
// One shared player; clicking a play button stops any other.

const previewAudio = new Audio();
let playingBtn = null;

function stopPreview() {
  previewAudio.pause();
  if (playingBtn) {
    playingBtn.classList.remove("playing");
    playingBtn.textContent = "▶";
    playingBtn = null;
  }
}

previewAudio.addEventListener("ended", stopPreview);

function togglePreview(btn, src) {
  if (playingBtn === btn) return stopPreview();
  stopPreview();
  // Cache-buster: force a fresh fetch when the .m4a files are
  // replaced without renaming them (same trick as the student demo).
  previewAudio.src = src + "?v=" + Date.now();
  previewAudio.play().catch(() => {});
  playingBtn = btn;
  btn.classList.add("playing");
  btn.textContent = "❚❚";
}

// ---------- Controls ----------

// Space is the primary control; Enter / ArrowRight / PageDown also
// advance and ArrowLeft / PageUp go back, so a presentation clicker
// can drive the demo in both directions. R restarts from the top.
const ADVANCE_KEYS = ["Space", "Enter", "ArrowRight", "PageDown"];
const BACK_KEYS = ["ArrowLeft", "PageUp"];

function advance() {
  if (state === "start") return begin();
  if (state === "upload") {
    if (uploadedCount < TEACHER_CONFIG.upload.files.length) return uploadNext();
    return startTakeaways();
  }
  if (state === "takeaways") return acknowledge();
  if (state === "ack") return; // let the beat finish on its own
  if (state === "analyzing") return startGenerating();
  if (state === "generating") return showPackage();
  if (state === "package") return approve();
  if (state === "approving") return; // let the beat finish on its own
  // "assigned" is the final screen.
}

// Step one beat backwards — the safety valve for an accidental
// double-press on stage.
function goBack() {
  if (state === "upload") {
    if (uploadedCount > 0) return removeLastUpload();
    return restart();
  }
  if (state === "takeaways" || state === "ack") return showUpload();
  if (state === "analyzing") return startTakeaways();
  // From the generating beat, go back to the analysis beat itself
  // (stepping "back" into an auto-advancing 2s loader would just
  // bounce forward again).
  if (state === "generating") return startAnalysis();
  if (state === "package") return startAnalysis();
  if (state === "assigned") return showPackage();
}

function restart() {
  clearTimers();
  stopPreview();
  orb.classList.remove("listening");
  halo.classList.remove("listening");
  statusEl.classList.remove("ack");
  genLoader.classList.remove("active");
  fileList.innerHTML = "";
  uploadedCount = 0;
  dropZone.classList.remove("has-files", "complete");
  readyNote.classList.remove("visible");
  continueBtn.classList.remove("ready");
  approveBtn.classList.remove("busy");
  approveBtn.textContent = TEACHER_CONFIG.package.approveLabel;
  state = "start";
  show("start");
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

continueBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (state === "upload" && uploadedCount === TEACHER_CONFIG.upload.files.length) {
    startTakeaways();
  }
});

approveBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  approve();
});

// Click-anywhere fallback during the upload and takeaways beats,
// in case the keyboard misbehaves on stage.
screens.upload.addEventListener("click", () => {
  if (state === "upload" && uploadedCount < TEACHER_CONFIG.upload.files.length) {
    uploadNext();
  }
});

screens.voice.addEventListener("click", () => {
  if (state === "takeaways") advance();
});

// ---------- Populate static content from config ----------

function hydrate() {
  const cfg = TEACHER_CONFIG;

  $("#course").textContent = cfg.course;
  $("#topic-title").textContent = cfg.upload.title;
  $("#intro").textContent = cfg.intro;

  $("#upload-eyebrow").textContent = cfg.teacher + " · " + cfg.group;
  $("#upload-title").textContent = cfg.topic;
  $("#drop-hint").textContent = cfg.upload.hint;
  $("#ready-note").textContent = cfg.upload.ready;
  continueBtn.textContent = cfg.upload.continueLabel;

  $("#voice-topic").textContent = cfg.topic;

  const pkg = cfg.package;
  $("#pkg-eyebrow").textContent = pkg.eyebrow;
  $("#pkg-title").textContent = pkg.title;
  $("#pkg-subtitle").textContent = pkg.subtitle;
  $("#brief-label").textContent = pkg.brief.label;
  $("#brief-text").textContent = pkg.brief.text;
  $("#questions-label").textContent = pkg.questionsLabel;
  $("#voice-badge").textContent = pkg.voiceBadge;

  const qList = $("#question-list");
  pkg.questions.forEach((q) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "play-btn";
    btn.textContent = "▶";
    btn.setAttribute("aria-label", "Play question");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePreview(btn, q.audio);
    });
    const body = document.createElement("div");
    body.className = "q-body";
    const text = document.createElement("div");
    text.className = "q-text";
    text.textContent = q.text;
    const checks = document.createElement("div");
    checks.className = "q-checks";
    const label = document.createElement("span");
    label.className = "checks-label";
    label.textContent = pkg.checksLabel + ": ";
    checks.appendChild(label);
    checks.appendChild(document.createTextNode(q.checks));
    body.appendChild(text);
    body.appendChild(checks);
    li.appendChild(btn);
    li.appendChild(body);
    qList.appendChild(li);
  });

  $("#topics-label").textContent = pkg.topics.label;
  $("#topics-note").textContent = pkg.topics.note;
  const chips = $("#topic-chips");
  pkg.topics.items.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    chips.appendChild(li);
  });

  $("#avatar-label").textContent = pkg.avatar.label;
  $("#avatar-text").textContent = pkg.avatar.text;
  approveBtn.textContent = pkg.approveLabel;

  $("#assigned-title").textContent = cfg.assigned.title;
  $("#assigned-message").textContent = cfg.assigned.message;
  $("#assigned-footer").textContent = cfg.assigned.footer;
}

hydrate();
show("start");
animate();
