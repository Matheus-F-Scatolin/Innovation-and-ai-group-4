# explAIn — Design System

Visual identity extracted from the Demo Day pitch deck (`ExplAIn_pitch_deck.pdf`, 24 July 2026 · IE × Santander).
Purpose: redesign the prototypes (`demo/` student app, `demo-teacher/` teacher app) to match the brand — **same functionality, new UI/color palette only**. Both prototypes are currently dark-themed; the brand is **light-themed**, so this is a full re-skin.

---

## 1. Brand essence

- **Name:** explAIn — always lowercase `expl`, uppercase `AI`, lowercase `n` ("expl**AI**n"). The AI is the point.
- **Tagline / voice:** "Learning copilot for an AI-reshaped future." · "Make learning visible again." · "Ask the right questions, not just get the right answers."
- **Personality:** confident, institutional, optimistic. Reads like a serious edtech company pitching schools — clean, airy, corporate-modern. Not playful/neon, not dark-mode techy.
- **Logo:** explAIn wordmark in rounded lowercase letterforms, royal blue (`--brand-blue`), with the "AI" in a bright blue gradient (`--brand-gradient`), a thin circular swoosh arc, three sparkles ✦ at the top-right, and an open-book base in two blues. Sits bottom-left on every deck slide; in the apps, place it top-left in the header.
  - **Asset needed:** the logo PNG is not yet in the repo (`demo*/assets/` only contain audio/video). Export it (white and transparent-background versions) to a shared `assets/` location, e.g. `demo/assets/logo.png` and `demo-teacher/assets/logo.png`.
- **Co-branding:** "ie × Santander" appears bottom-right on deck slides. Optional in the app footer for Demo Day.

---

## 2. Color palette

### Core brand colors

| Token | Hex | Usage |
|---|---|---|
| `--brand-blue` | `#2540A5` | The logo wordmark blue. Use where the brand itself appears: header wordmark (if rendered as text), logo-adjacent UI, brand moments |
| `--brand-gradient` | `linear-gradient(135deg, #1E7BF0 0%, #35A8E0 100%)` | The logo's "AI" gradient. **One hero moment per screen max** — the voice orb ring is its natural home. Never on body text or large panels |
| `--navy-900` | `#132A5C` | Headlines, primary text emphasis, revenue line in charts, dark stat panels |
| `--navy-700` | `#1E3A8A` | Secondary headings, icons, table header chips |
| `--yellow-500` | `#F5B90F` | **The** accent. One emphasized word per headline, key highlights, CTAs' secondary accent. Use sparingly — it's a scalpel, not a paint roller |
| `--sky-500` | `#35A8E0` | Primary interactive color: buttons, active states, student-side identity, filled cards (pricing cards, TAM bubble), chart bars |
| `--sky-300` | `#7CC5EA` | Hover states, secondary chart series, soft fills |
| `--blue-600` | `#2F6FE4` | Big stat numbers, links, student-flow step badges |

### Supporting / semantic colors

| Token | Hex | Usage |
|---|---|---|
| `--green-600` | `#1E9E6E` | **Teacher-side identity** (deck slide 6 color-codes teacher = green, student = blue). Success states, confirmed/approve actions |
| `--red-500` | `#D94F3D` | Errors, destructive actions, "schools still optimize for" negative framing |
| `--amber-700` | `#9A6B08` | Warning **text** on white/light backgrounds (gap flags, alerts). `--yellow-500` fails contrast as small text on white — reserve it for headline highlights and badge fills; use amber-700 whenever a warning must be read |
| `--purple-500` | `#7C5CBF` | Tertiary accent (stats variety, mastery/insight tags) |
| `--teal-600` | `#178A80` | Quaternary accent for stat cards when green/blue/purple are taken |

### Neutrals (light theme)

| Token | Hex | Usage |
|---|---|---|
| `--bg-0` | `#F4F6F9` | Page background (near-white, cool gray) |
| `--bg-1` | `#FFFFFF` | Cards, panels, modals |
| `--bg-tint-blue` | `#EFF5FC` | Soft tinted card backgrounds, icon circles |
| `--bg-tint-green` | `#EAF6F0` | Teacher-side tinted fills |
| `--text` | `#1A2233` | Body text (near-navy, not pure black) |
| `--text-dim` | `#5B6472` | Secondary text, captions, chart axis labels |
| `--border` | `#E3E8EF` | Card borders, dividers, table rules |

### Rules of use

1. **Navy headlines + one yellow word.** Every major heading is navy with exactly one emphasized word/phrase in yellow (`The gap is already <span class="hl">there</span>.`). Headlines end with a period.
2. **Blue = student, green = teacher.** Carry this through both apps: `demo/` leans sky/blue for its primary actions; `demo-teacher/` leans green for approve/confirm actions while keeping sky-blue for shared informational UI.
3. **Yellow never carries large surfaces.** It highlights words, small badges, and underlines only. Large filled surfaces are sky-blue, navy, or white.
4. **Backgrounds stay light.** No dark app chrome. The one sanctioned dark surface is a navy panel used to spotlight a key stat block (as in the appendix market-sizing card).
5. **The brand gradient is a spotlight, not a paint.** `--brand-gradient` echoes the logo's "AI" — use it on exactly one hero element per screen (voice orb ring, a key progress bar). Everything else gets flat fills.

### Mapping from current prototype tokens

Both `demo/styles.css` and `demo-teacher/styles.css` share these variables — remap rather than rename so `app.js` needs no changes:

| Existing token | Old (dark) | New value |
|---|---|---|
| `--bg-0` | `#07090f` | `#F4F6F9` |
| `--bg-1` | `#0d1220` | `#FFFFFF` |
| `--text` | `#e8ecf4` | `#1A2233` |
| `--text-dim` | `#8a93a6` | `#5B6472` |
| `--accent` | `#6ea8ff` | `#35A8E0` (student app) / `#1E9E6E` (teacher app primary actions — or keep `#35A8E0` and use green only for approve states) |
| `--accent-soft` | `rgba(110,168,255,.35)` | `rgba(53,168,224,.25)` |
| `--listen` | `#7fe3b0` | `#1E9E6E` |
| `--listen-soft` | `rgba(127,227,176,.35)` | `rgba(30,158,110,.22)` |
| `--warn` | `#ffcf7d` | `#F5B90F` |
| `--warn-soft` | `rgba(255,207,125,.16)` | `rgba(245,185,15,.15)` |
| `--card` | `rgba(255,255,255,.045)` | `#FFFFFF` |
| `--card-border` | `rgba(255,255,255,.09)` | `#E3E8EF` |

Anything that relied on glow/dark-mode contrast (orb glows, soft neon shadows) should switch to the light-theme shadow recipe in §5.

---

## 3. Typography

The deck uses a plain grotesque sans (Arial/Helvetica family) for headlines and body, plus a letter-spaced monospace for eyebrow labels.

- **Headings & body:** system sans stack — `-apple-system, "Segoe UI", Helvetica, Arial, sans-serif`. Headlines are **bold (700–800)**, tight leading, sentence case, ending with a period.
- **Eyebrow labels (section kickers):** the deck's signature detail. Monospace, uppercase, wide tracking, sky/navy blue:
  ```css
  .eyebrow {
    font-family: "Courier New", ui-monospace, monospace;
    font-size: 12px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--sky-500);
    font-weight: 600;
  }
  ```
  Examples from the deck: `PROBLEM`, `THE SOLUTION`, `MARKET SIZE`, `BUSINESS MODEL`, `TEAM`. Use these above every screen title in the apps (e.g. `VOICE SESSION`, `HOMEWORK REVIEW`, `TEACHER DASHBOARD`).
- **Headline pattern:**
  ```html
  <p class="eyebrow">HOMEWORK REVIEW</p>
  <h1>Turn any lesson into <span class="hl">proof of learning</span>.</h1>
  ```
  `.hl { color: var(--yellow-500); }` — navy heading, one yellow phrase, closing period.
- **Big stats:** oversized bold numbers (48–72px) in `--blue-600` or `--navy-900`, with a small `%`/unit and a short caption in `--text-dim` below. Deck examples: **79%**, **91%**, **76%**, **€50**, **€9**.
- **Body:** 16px, `--text`, regular weight, generous line-height (1.55). Secondary text in `--text-dim`.

---

## 4. Layout & spacing

- **Airy and generous.** The deck leaves lots of whitespace; screens should feel like slides — one clear idea per view, big margins (32–48px page padding on desktop).
- **Background texture (optional but on-brand):** the deck background is near-white with faint diagonal geometric panels and soft light streaks. Approximate with a very subtle diagonal linear-gradient overlay or leave flat `--bg-0`; do not use imagery that competes with content.
- **Cards:** white, radius **16–20px**, 24–32px internal padding, soft shadow (§5). Stat cards use a tinted icon circle (56px, `--bg-tint-blue`/`--bg-tint-green`) top-left, then number, then caption, with a thin divider before a supporting line.
- **Two-column duality:** when showing teacher vs student anything, mirror the deck's solution slide — teacher column headed by a green pill badge, student column by a blue pill badge, numbered circular step icons connected by arrows.
- **Numbered steps:** filled circles (green teacher / blue student) with white numerals, 32px, label to the right.
- **Footer:** slim, letter-spaced monospace caption centered (e.g. `TEAM 4 · SANTANDER × IE INNOVATION & AI · 2026`), logo left, `ie × Santander` right.

---

## 5. Elevation & effects

```css
--shadow-card: 0 2px 8px rgba(19, 42, 92, 0.06), 0 12px 32px rgba(19, 42, 92, 0.08);
--shadow-lift: 0 4px 12px rgba(19, 42, 92, 0.10), 0 20px 48px rgba(19, 42, 92, 0.12); /* hover */
```

- Shadows are navy-tinted, soft and wide — never hard or dark.
- No glows, no neon, no dark-mode bloom. Replace the current orb glow with a **`--brand-gradient` ring + soft navy-tinted shadow** on a white/tinted circle (sparkle ✦ accents in `--sky-500` are on-brand, echoing the logo's stars).
- Borders: 1px `--border` on cards sitting on `--bg-0`; the highlighted/selected card gets a 2px `--sky-500` border (as in the deck's competitor table where the explAIn column is outlined in blue).

---

## 6. Components

### Buttons
- **Primary:** filled `--sky-500`, white text, radius 12px, weight 700; hover darken ~8% + `--shadow-lift`. In `demo-teacher/`, approval/confirm buttons use `--green-600`.
- **Secondary:** white bg, 1.5px `--navy-700` border, navy text.
- **Danger/quiet destructive:** white bg, `--red-500` border + text.
- **Text/tertiary:** `--blue-600` text link, no border.

### Pills & badges
- Role badges as filled rounded rectangles: `TEACHER` on `--green-600`, `STUDENT` on `--blue-600` (white uppercase text) — straight from the solution slide.
- Status tags: tinted background + strong text of the same hue (e.g. `#EAF6F0` bg / `--green-600` text for "approved").

### Stat cards
White card → tinted icon circle → big colored number → caption → divider → supporting insight line with a small filled icon circle. Rotate accent hues across a row (teal, blue, purple) as the evidence slide does.

### Charts (if any)
- Bars/fills: `--sky-500` (secondary series `--sky-300`, neutral `#C9D4E3`).
- Lines: `--navy-900`, 3px.
- Axis text `--text-dim`; no gridline clutter.
- Donut: navy → blue → light-blue → gray ordering.

### Dark spotlight panel (optional)
One navy (`--navy-900`) rounded panel per screen max, white text, for the single most important number/summary. Everything else stays light.

### Voice-session UI (student `demo/`)
- Keep the orb interaction; restyle: white/`--bg-tint-blue` circle, `--brand-gradient` animated ring while speaking (the screen's one gradient moment, echoing the logo's "AI"), `--green-600` ring while listening, `--yellow-500` ring for warnings. Sparkle accents allowed.
- Transcript bubbles: student messages white card with border; AI messages `--bg-tint-blue`.

### Teacher review UI (`demo-teacher/`)
- Upload/dropzone: dashed 2px `--sky-300` border on `--bg-tint-blue`, navy icon.
- "Takeaways" live cards: white cards appearing with a subtle rise animation, green check icons.
- Approve = `--green-600` primary button; Edit = secondary; Reject = danger-quiet.

---

## 7. Motion

- Subtle and quick: 150–250ms ease-out transitions on hover/appear.
- Cards enter with 8px rise + fade.
- The only sustained animation is the voice orb ring pulse (2s ease-in-out loop).
- No parallax, no large-scale movement — the brand is calm and institutional.

---

## 8. Copy & tone in UI

- Headlines: short declarative sentences with a period, one yellow-highlighted word.
- Eyebrow context labels everywhere (monospace tracking, see §3).
- Prefer the deck's framing vocabulary: "proof of learning", "make learning visible", "ask anything", "act & intervene", "learn in their way", "track progress".
- Numbers do the talking: surface a big stat wherever the UI has a metric.

---

## 9. Do / Don't

| Do | Don't |
|---|---|
| Light backgrounds, white cards, navy text | Dark backgrounds, glassmorphism, neon glow |
| One yellow highlight per heading | Yellow buttons or yellow surfaces |
| Green = teacher, blue = student, consistently | Mixing role colors arbitrarily |
| Monospace letter-spaced eyebrows | Decorative display fonts |
| Big bold stat numbers in blue | Small timid metrics |
| Soft navy-tinted shadows | Hard black shadows or flat borderless cards on white |
| Sparkle ✦ accents nodding to the logo | Emoji as UI iconography |
| Brand gradient on one hero element per screen | Gradient text, gradient panels, gradient buttons |

---

## 10. Prototype migration plan

Verified against the current code: neither `demo/app.js` nor `demo-teacher/app.js` hardcodes colors (only `transform`/`animation` inline styles), and all theming flows through the `:root` variables and class styles in each `styles.css`. **The re-skin is a CSS rewrite plus small HTML/copy additions — no JS logic changes.**

### Step 0 — assets
- Export the logo (transparent PNG or SVG) into `demo/assets/` and `demo-teacher/assets/`. Nothing brand-visual exists in the repo today.

### Both apps — `styles.css`
1. **`:root` swap** per the mapping table in §2, plus the new tokens (`--brand-blue`, `--brand-gradient`, `--amber-700`, tints, shadows).
2. **`body`**: replace the dark radial gradient with flat `--bg-0` (optionally the faint diagonal texture, §4). Body text color → `--text`.
3. **`.eyebrow`** (both apps' screen kickers): restyle from dim gray to the deck's signature — monospace, `letter-spacing: 0.35em`, `--sky-500` (§3).
4. **`h1`**: `--navy-900`; add the `.hl { color: var(--yellow-500) }` rule so config copy can highlight one word.
5. **`.btn`**: currently a white pill with dark text → filled `--sky-500`, white text, radius 12px, `--shadow-lift` on hover. (Teacher app: see below for the approve variant.)
6. **Orb + halo** (identical block in both files): swap the dark radial orb for a white/`--bg-tint-blue` circle with a `--brand-gradient` ring (e.g. padded `background: var(--brand-gradient)` wrapper or `border-image`); replace the `blur(50px)` glow halo with the soft navy shadow recipe (§5). `.listening` state → `--green-600` ring + `--bg-tint-green` fill. Keep all `transform`-based scaling untouched — `app.js` drives it.
7. **`.gen-loader`**: track → `--border`; bar → `--brand-gradient` (replaces the old `#4f86e8 → #6ea8ff`).
8. **`.check`** (done screens): `--bg-tint-green` circle, `--green-600` glyph.
9. **Warning styling** (`.insights li.gap`, `.topics li.gap`, `.dash-insight`): text in `--amber-700` (not `--yellow-500` — contrast, §2); icon can stay yellow.
10. **`✓` markers** (`.insights li.ok`, `.topics li.ok`, `.fcheck`, `.q-checks .checks-label`): `--green-600`.
11. **Screen-transition/`riseIn` animations**: keep as-is — already match §7.

### Student app — `demo/`
- **`index.html`**: add a slim header (logo top-left) and the co-brand footer strip (§4); retitle from "AI Tutor — Homework Review" to "explAIn — Homework Review".
- **`.progress .dot`**: base `#C9D4E3`, `.current` `--navy-900`, `.done` `--sky-500`.
- **`#screen-video video`**: shadow → `--shadow-card` (navy-tinted, not black); keep black letterbox background.
- **`.thumb`** feedback buttons: white card + `--border`; `.selected` → `--bg-tint-green` + `--green-600` border.
- **`.dash-card` / `.dash-table`** (teacher-dashboard screen): white card + `--shadow-card`; header cells `--text-dim`; `tr.highlight` → `--bg-tint-blue`; `.cell-dot.ok` green tint / `.cell-dot.gap` amber tint (`rgba(245,185,15,.15)` bg, `--amber-700` text).
- **`config.js` copy (optional but recommended)**: wrap one word per headline in `<span class="hl">…</span>` and end headlines with a period, matching the deck's headline pattern (§3). Requires the corresponding elements to be set via `innerHTML` — verify per string before converting.

### Teacher app — `demo-teacher/`
- **`index.html`**: same header/footer/title treatment ("explAIn — Create Homework Review").
- **Role color**: teacher = green (§2). `.btn.approve` → filled `--green-600`; the generic `.btn` (start/continue) can stay `--sky-500` since those steps are informational.
- **`.drop-zone`**: dashed 2px `--sky-300` on `--bg-tint-blue`; `.complete` → solid `--green-600` border.
- **`.file-card`**: white, `--border`, `--shadow-card`; progress `.fill` → `--brand-gradient`.
- **`.ready-note`**: `--green-600`.
- **`.pkg-card`**: white + `--border` + `--shadow-card`; `.card-label` `--text-dim`, `.card-label.ok` `--green-600`.
- **`.voice-badge`**: `--blue-600` text on `--bg-tint-blue`, `--sky-300` border.
- **`.topic-chips li`**: `--bg-tint-blue` bg, `--navy-700` text, `--sky-300` border.
- **`.play-btn`**: `--sky-500` border/tint; `.playing` → filled `--sky-500`, white glyph.
- **`.question-list li + li` divider**: `--border`.

### Verification checklist (run both apps in the browser preview after the re-skin)
- [ ] No remaining dark-theme surfaces or white-on-dark text (search CSS for `rgba(255, 255, 255` and the old hexes).
- [ ] Orb speaking = gradient ring, listening = green — states still driven correctly by `app.js` class toggles.
- [ ] Gap/warning lines legible on white (amber-700, not raw yellow).
- [ ] Buttons: student flows sky-blue; teacher approve green.
- [ ] Logo renders in both headers; footer co-brand line present.
- [ ] Screens still transition and stream (riseIn/stagger) as before — functionality unchanged.
