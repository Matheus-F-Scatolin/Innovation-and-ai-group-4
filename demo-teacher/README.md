# Demo — Teacher: Create a Homework Review

The authoring side of the [student demo](../demo/): Prof. Emiliano turns
today's class into the homework review Alejo experiences. Fully offline,
zero dependencies, zero API keys. Present this **first**, then the
student demo — teacher creates it → student experiences it → dashboard
closes the loop.

## Run it

```bash
cd demo-teacher
python3 -m http.server 8001
```

Open **http://localhost:8001** in **Chrome** and allow microphone access
(the orb reacts to the presenter's voice during the takeaways beat).

## Demo flow (Space bar drives everything)

1. **Class picker** — Prof. Emiliano's class groups. Only the scripted
   class is live (**Grupo 5°B**); the other cards nudge with a hint if
   clicked. `Space` auto-picks it. (The topic comes from the materials
   uploaded next, so there's no topic step here.)
2. **Start screen** — "New homework review". `Space` (or click) to begin.
2. **Upload beat** — a drop zone. Each `Space` press "drops" the next
   pre-named file in with a short upload progress: the class recording
   (Clase 12, 42 min), the book chapter PDF, and the class slides.
   No real file dialogs on stage. After the third file a **Continue**
   button fades in.
3. **Takeaways beat** — the orb turns green and listens: speak the key
   takeaways you want students to leave with, live on stage (same mic
   mechanic as the student flow — nothing is recorded or processed).
   Press `Space` when done; a short **"Takeaways captured ✓"** beat
   confirms it.
4. **Analysis beat** — the orb pulses while insight lines stream in:
   recording transcribed, book and slides indexed, 3 key topics found,
   your takeaways set the priorities.
5. **Generating beat** — "Generating the homework review…" with a
   loading bar for ~2 seconds.
6. **Review & approve (the money moment)** — the generated package,
   shown to the teacher *before* anything reaches students:
   - the **homework brief** (the exact intro the student demo opens with),
   - the **3 oral questions**, each playable in the teacher's voice
     (▶ buttons — the same recordings the student demo plays), each with
     a **"Checks for"** line showing what the gap analysis looks for,
   - the **topic map** (the 3 chips that become the dashboard columns),
   - the **avatar-ready card** (personalized review videos per student).

   Pressing `Space` — or clicking **"Approve & assign to Grupo 5°B"** —
   approves it.
7. **Assigned confirmation** — "Assigned to Grupo 5°B · 31 students will
   get the voice review… Results land in your dashboard." Final screen;
   segue into the student demo.

## Presenter script (takeaways beat)

Speak naturally for ~10 seconds, e.g.:

> "I want them to understand that the Tequila Crisis came from
> historical factors — especially the Tesobonos, Mexico's dollar-linked
> debt. That's the one thing they must leave with."

Naming **Tesobonos** out loud is deliberate: the student demo's flagged
gap is exactly that topic, so the takeaway you speak visibly becomes the
question the student later gets wrong.

## Controls

| Key | Action |
|-----|--------|
| `Space` / `Enter` / `→` / `PageDown` | Advance (presentation clickers work) |
| `←` / `PageUp` | Go back one beat (on the upload screen it removes the last file) |
| `R` | Restart the demo from the start screen |
| Click | Also advances during the upload and takeaways beats |

There are no on-screen key hints — the demo reads as a real product.

## Editing content

Everything shown (file names, takeaways prompt, analysis lines, the
package: brief, questions, checks, topics, avatar card, confirmation)
lives in [config.js](config.js). The question audio in `assets/audio/`
is a copy of the student demo's `q1–q3.m4a` — if you re-record them,
replace the files **in both demos** (same filenames, no code changes).

## Demo-day checklist

- Use **Chrome**, allow microphone access (if the mic fails, the orb
  falls back to a gentle pulse and the demo still works).
- Runs **fully offline** — no wifi, no API keys, no accounts.
- A presentation clicker works: `→` / `PageDown` advance, `←` /
  `PageUp` go back.
- Rehearse the spoken takeaways (mention **Tesobonos**) — it sets up
  the gap the student demo hangs on.
- Run this on port **8001** and the student demo on **8000** so both
  can stay open in adjacent tabs.
