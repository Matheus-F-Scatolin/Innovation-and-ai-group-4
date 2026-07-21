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

1. **Start screen** — homework intro. `Space` (or click) to begin.
2. **Voice session** — the tutor asks 3 recorded questions about the
   Tequila Crisis. After each question the orb turns green and listens;
   answer out loud, then press `Space` for the next question.
3. **Analyzing beat** — the orb pulses for ~2s ("Analyzing your answers…"),
   then the review video starts automatically.
4. **Personalized review video** — the teacher's AI avatar (Spanish,
   English captions) reviewing the topics the student missed.
   Auto-advances when it ends; `Space` skips it.
5. **End screen** — session summary.

`Enter`, `→` and `PageDown` also advance (presentation clickers work),
and clicking anywhere during the voice session advances too.

## Editing content

Everything shown (names, topic, questions, summary) lives in
[config.js](config.js). Audio/video files live in `assets/`.
Replace `assets/audio/q1.m4a` … `q3.m4a` with the final recordings —
same filenames, no code changes needed.

The original unprocessed recordings (iPhone HEVC video, raw audio) are
kept locally in `../media-originals/` — not committed; the demo only
needs the web-ready copies in `assets/`.

## Demo-day checklist

- Use **Chrome**, allow microphone access (the orb reacts to the
  presenter's voice; if the mic fails, it falls back to a gentle pulse
  and the demo still works).
- Runs **fully offline** — no wifi needed, no API keys, no accounts.
- A presentation clicker works: `→` / `PageDown` advance like `Space`.
