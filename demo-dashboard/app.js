// ============================================================
// Teacher dashboard demo — freely clickable, app-like.
// Views: assignments → class → student · trends
// Clicks drive everything; arrow keys / Space also step through
// the scripted order (assignments → class → student → trends)
// so a presentation clicker still works. R restarts.
// ============================================================

const $ = (sel) => document.querySelector(sel);

const views = {
  assignments: $("#view-assignments"),
  class: $("#view-class"),
  student: $("#view-student"),
  trends: $("#view-trends"),
};

// The scripted presentation order for keyboard stepping.
const ORDER = ["assignments", "class", "student", "trends"];
let current = "assignments";

// Breadcrumb labels per view (clicking a crumb navigates back).
const CRUMBS = {
  assignments: [["Assignments", null]],
  class: [["Assignments", "assignments"], ["The Tequila Crisis", null]],
  student: [
    ["Assignments", "assignments"],
    ["The Tequila Crisis", "class"],
    ["Marielle Marasigan", null],
  ],
  trends: [["Assignments", "assignments"], ["Class trends", null]],
};

function go(name) {
  current = name;
  Object.values(views).forEach((v) => v.classList.remove("active"));
  views[name].classList.add("active");
  renderCrumbs();
  window.scrollTo(0, 0);
}

function renderCrumbs() {
  const nav = $("#crumbs");
  nav.innerHTML = "";
  CRUMBS[current].forEach(([label, target], i) => {
    if (i > 0) {
      const sep = document.createElement("span");
      sep.className = "crumb-sep";
      sep.textContent = "›";
      nav.appendChild(sep);
    }
    const el = document.createElement(target ? "button" : "span");
    el.className = "crumb" + (target ? " link" : "");
    el.textContent = label;
    if (target) el.addEventListener("click", () => go(target));
    nav.appendChild(el);
  });
}

// Cards/rows off the scripted path nudge and show a hint, matching
// the picker pattern in the student demo.
function nudge(el, hintEl) {
  el.classList.add("nope");
  hintEl.classList.add("visible");
  setTimeout(() => el.classList.remove("nope"), 400);
}

// ---------- 1. Assignment list ----------

function hydrateAssignments() {
  const cfg = DASH_CONFIG.assignments;
  $("#assign-eyebrow").textContent = cfg.eyebrow;
  $("#assign-title").innerHTML = cfg.title;
  $("#assign-subtitle").textContent = cfg.subtitle;
  $("#assign-hint").textContent = cfg.hint;

  const list = $("#assign-list");
  cfg.items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "assign-card" + (item.live ? " live" : " demo");
    li.innerHTML =
      `<div class="assign-main"><div class="pick-name">${item.name}</div>` +
      `<div class="pick-sub">${item.sub}</div></div>` +
      `<div class="assign-side"><div class="assign-stat">${item.stat}</div>` +
      (item.flag ? `<div class="assign-flag">⚠ ${item.flag}</div>` : "") +
      `</div>`;
    li.addEventListener("click", () => {
      if (item.live) go("class");
      else nudge(li, $("#assign-hint"));
    });
    list.appendChild(li);
  });

  const trends = document.createElement("li");
  trends.className = "assign-card trends";
  trends.innerHTML =
    `<div class="assign-main"><div class="pick-name">📈 ${cfg.trendsCard.name}</div>` +
    `<div class="pick-sub">${cfg.trendsCard.sub}</div></div>` +
    `<div class="assign-side"><div class="assign-stat">View →</div></div>`;
  trends.addEventListener("click", () => go("trends"));
  list.appendChild(trends);
}

// ---------- 2. Class dashboard ----------

function hydrateClass() {
  const cfg = DASH_CONFIG.classView;
  $("#class-eyebrow").textContent = cfg.eyebrow;
  $("#class-title").innerHTML = cfg.title;
  $("#class-subtitle").textContent = cfg.subtitle;
  $("#class-insight").textContent = cfg.insight;
  $("#class-hint").textContent = cfg.hint;
  $("#actions-title").textContent = cfg.actionsTitle;

  const table = $("#class-table");
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
    tr.className = "clickable" + (s.highlight ? " highlight" : "");
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
    tr.addEventListener("click", () => {
      if (s.live) go("student");
      else nudge(tr, $("#class-hint"));
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  const cards = $("#action-cards");
  cfg.actions.forEach((a) => {
    const li = document.createElement("li");
    li.className = "action-card";
    li.innerHTML =
      `<div class="action-icon">${a.icon}</div>` +
      `<div><div class="action-title">${a.title}</div>` +
      `<div class="action-text">${a.text}</div></div>`;
    cards.appendChild(li);
  });
}

// ---------- 3. Student profile ----------

function hydrateStudent() {
  const cfg = DASH_CONFIG.studentView;
  $("#student-eyebrow").textContent = cfg.eyebrow;
  $("#student-avatar").textContent = cfg.initials;
  $("#student-name").textContent = cfg.name;
  $("#student-sub").textContent = cfg.sub;
  $("#mastery-title").textContent = cfg.masteryTitle;
  $("#style-title").textContent = cfg.styleTitle;
  $("#quotes-title").textContent = cfg.quotesTitle;

  const stats = $("#student-stats");
  cfg.stats.forEach((s) => {
    const li = document.createElement("li");
    li.className = "stat";
    li.innerHTML = `<div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div>`;
    stats.appendChild(li);
  });

  const mastery = $("#mastery-list");
  cfg.mastery.forEach((m) => {
    const li = document.createElement("li");
    li.className = m.ok ? "ok" : "gap";
    li.innerHTML = `<div class="mastery-topic">${m.topic}</div><div class="mastery-note">${m.note}</div>`;
    mastery.appendChild(li);
  });

  const style = $("#style-list");
  cfg.styleNotes.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    style.appendChild(li);
  });

  const quotes = $("#quote-cards");
  cfg.quotes.forEach((q) => {
    const li = document.createElement("li");
    li.className = "quote-card " + q.tag;
    li.innerHTML =
      `<div class="quote-label">${q.label}</div>` +
      `<blockquote>${q.text}</blockquote>` +
      `<div class="quote-note">${q.note}</div>`;
    quotes.appendChild(li);
  });
}

// ---------- 4. Class trends ----------

function hydrateTrends() {
  const cfg = DASH_CONFIG.trendsView;
  $("#trends-eyebrow").textContent = cfg.eyebrow;
  $("#trends-title").innerHTML = cfg.title;
  $("#trends-subtitle").textContent = cfg.subtitle;
  $("#trends-insight").textContent = cfg.insight;

  const bars = $("#trend-bars");
  cfg.bars.forEach((b) => {
    const li = document.createElement("li");
    li.innerHTML =
      `<div class="trend-meta"><span class="trend-label">${b.label}</span>` +
      `<span class="trend-sub">${b.sub}</span></div>` +
      `<div class="trend-track"><span class="trend-fill" style="width:0%"></span></div>` +
      `<div class="trend-pct">${b.pct}%</div>`;
    bars.appendChild(li);
    // Animate the fill on first paint.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        li.querySelector(".trend-fill").style.width = b.pct + "%";
      })
    );
  });
}

// ---------- Keyboard: clicker-friendly stepping ----------

const ADVANCE_KEYS = ["Space", "Enter", "ArrowRight", "PageDown"];
const BACK_KEYS = ["ArrowLeft", "PageUp"];

document.addEventListener("keydown", (e) => {
  if (e.code === "KeyR") {
    e.preventDefault();
    return go("assignments");
  }
  const i = ORDER.indexOf(current);
  if (ADVANCE_KEYS.includes(e.code)) {
    e.preventDefault();
    if (i < ORDER.length - 1) go(ORDER[i + 1]);
  } else if (BACK_KEYS.includes(e.code)) {
    e.preventDefault();
    if (i > 0) go(ORDER[i - 1]);
  }
});

hydrateAssignments();
hydrateClass();
hydrateStudent();
hydrateTrends();
go("assignments");
