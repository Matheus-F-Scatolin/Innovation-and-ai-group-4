# explAIn — Teacher Dashboard demo

The teacher's post-session view: what the system learned about the class
and each student from the tutor sessions. Third demo in the set
(`demo/` = student session, `demo-teacher/` = content creation).

Open `index.html` via any static server (browsers block some features on
`file://`), e.g.:

```
python3 -m http.server 8123
# → http://localhost:8123/demo-dashboard/
```

## Views

1. **Assignments** — landing page for Prof. Emiliano / Group 5B.
   Only "The Tequila Crisis" is live; the other cards nudge.
2. **Class dashboard** — students × topics grid, class-wide gap insight,
   and AI-suggested actions. Click Alejo's row for the profile.
3. **Student profile (Alejo Ramírez)** — engagement stats, topic mastery,
   learning-style observations, and highlights quoted from the tutor session.
4. **Class trends** — average mastery across the last three assignments.

## Controls

Freely clickable (breadcrumbs navigate back). For a presentation clicker,
Space / → / PageDown step through the scripted order
(assignments → class → student → trends), ← / PageUp step back, R restarts.

All content lives in `config.js` — edit it to change everything shown.
