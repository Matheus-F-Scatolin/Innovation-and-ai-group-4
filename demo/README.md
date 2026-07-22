# Demo — AI Tutor Voice Session

Fully offline, zero dependencies, zero API keys.

## Run it

```bash
cd demo
python3 -m http.server 8000
```

Open **http://localhost:8000** in **Chrome** and allow microphone access
(the orb reacts to the presenter's voice while answering).

## Demo flow (Space bar drives everything)

1. **Class & topic picker** — Marielle's classes, then Economic History's topics.
   Only the scripted path is live (**Economic History → The Tequila
   Crisis**); the other cards nudge with a hint if clicked. `Space`
   auto-picks the live card on each step, so two presses get you
   through both.
2. **Start screen** — homework intro. `Space` (or click) to begin.
2. **Voice session** — the tutor asks 3 recorded questions about the
   Tequila Crisis. After each question the orb turns green and listens;
   answer out loud, then press `Space`. A short **"Got it ✓"** beat
   confirms the answer before the next question.
3. **Analysis beat (the money moment)** — the orb pulses while insight
   lines stream in one by one: Q1 ✓, Q2 ✓, and a **⚠ gap detected on
   Tesobonos** (Q3 is answered wrong on purpose — see the presenter
   script below).
4. **Generating beat** — "Generating your personalized review…" with a
   loading bar for ~2 seconds, then the video starts automatically.
5. **Personalized review video** — the teacher's AI avatar (English,
   with captions) reviewing the flagged topic. When it ends the flow
   **freezes on the last frame** and asks the student for feedback
   (👍 / 👎 — clicking records it with a thank-you line). Nothing
   advances until you press `Space`. Pressing `Space` mid-video skips
   to the same feedback freeze.
6. **Student end screen** — honest summary: two topics solid, the
   flagged one already reviewed with the tutor.
7. **Teacher dashboard** — Prof. Emiliano's class view: per-topic
   mastery, Marielle's row highlighted with the Tesobonos gap, plus a
   class-wide insight. Final screen.

## Presenter script (spoken answers)

Answer Q1 and Q2 naturally in your own words. **Answer Q3 wrong on
purpose** — the analysis beat flags it and the whole story (review
video → teacher dashboard → director view) hangs on that gap:

> **Q3 — "Was the Tequila Crisis the result of historical factors or
> initial mismanagement?"**
>
> Wrong answer to speak on stage: *"Oh, I'm not sure about this one.
> I think maybe the crisis was caused because people in Mexico wanted
> to have more freedom."*
>
> (The right answer, for contrast if anyone asks: *"Historical factors —
> Mexico was having issues with debt accumulation on Tesobonos."*)

**Emiliano's review-video script (the recorded video in
`assets/video/tutor-intro.mp4`, ~15s, English):**

> *"Hi Marielle. Great job on the first two questions. On
> the third one, remember: the crisis came from historical factors —
> Mexico accumulated debt in Tesobonos, bonds tied to the dollar. Review
> it and we'll go over it in class."*

The caption timestamps in `assets/video/tutor-intro.vtt` are estimates
spread over the 15.5s recording — nudge them if they drift from the
spoken lines. The original iPhone recording (`IMG_7430.MOV`) is archived
in `../media-originals/`; the committed `.mp4` is a web-ready 1080p
H.264 transcode.

## Controls

| Key | Action |
|-----|--------|
| `Space` / `Enter` / `→` / `PageDown` | Advance (presentation clickers work) |
| `←` / `PageUp` | Go back one beat (safety valve for a double-press) |
| `R` | Restart the demo from the start screen |
| Click | Also advances during the voice session |

There are no on-screen key hints — the demo reads as a real product.

## Editing content

Everything shown (names, topic, questions, analysis insights, summary,
teacher dashboard, director view) lives in [config.js](config.js).
Audio/video files live in `assets/`. Replace `assets/audio/q1.m4a` …
`q3.m4a` with the final recordings — same filenames, no code changes
needed.

The original unprocessed recordings (iPhone HEVC video, raw audio) are
kept locally in `../media-originals/` — not committed; the demo only
needs the web-ready copies in `assets/`.

## Demo-day checklist

- Use **Chrome**, allow microphone access (the orb reacts to the
  presenter's voice; if the mic fails, it falls back to a gentle pulse
  and the demo still works).
- Runs **fully offline** — no wifi needed, no API keys, no accounts.
- A presentation clicker works: `→` / `PageDown` advance, `←` /
  `PageUp` go back.
- Rehearse the Q3 wrong answer — the analysis beat, end screen and
  teacher dashboard all build on that gap.
