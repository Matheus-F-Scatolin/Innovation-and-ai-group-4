# AI & Homework Integrity — Group 4

Customer-discovery research for a venture built during the **Innovation & AI Program at
Santander Open Academy**. This repository holds the assumption-based **proto-personas**
our team created to understand everyone caught in the AI-and-homework problem, plus the
prompts and scripts we used to produce them.

> ⚠️ These are **proto-personas** — assumption-based, not validated. Every claim in
> `personas.md` is a hypothesis to be confirmed or killed in customer-discovery interviews.
> Do not treat them as market facts.

---

## How might we

> **HOW MIGHT WE** help teachers to understand their student's learning progress based
> on out-of-class work
>
> **FOR** high-school teachers at private schools in Mexico
>
> **SO THAT** they can catch learning gaps early and address accordingly

## The problem we chose

> High school teachers who assign out-of-class work **struggle with** students bypassing the
> cognitive effort required for learning, **because** AI allows them to submit work without
> real comprehension, **and want to** ensure students are actually learning.

**Market scope (team decision):** Mexico first — good private *preparatorias / bachilleratos*
(ages 15–18), not necessarily elite, reached through a teammate's network.

To map the problem from every angle, we built **nine personas** across three groups:

| Group | Role in the problem | Personas |
|-------|---------------------|----------|
| 👩‍🏫 **Teachers** | Users — they assign the work | Lourdes (resister) · Andrés (pragmatist) · Renata (embracer) |
| 🎒 **Students** | Problem actors — they route around it | Santiago (heavy bypasser) · Valeria (selective) · Rodrigo (honest low-user) |
| 🏫 **Directors** | Buyers — they buy or veto the fix | Beatriz (prohibitionist) · Fernando (innovator) · Patricia (edtech-burned skeptic) |

All nine live in one of three fictional-but-composite schools, so their incentives collide
in realistic ways. The document ends with a **synthesis** of how the personas interlock and a
**Round-1 discovery interview plan** with kill criteria.

---

## What each file means

### Deliverables

| File | What it is |
|------|-----------|
| [`personas.md`](personas.md) | **The source of truth.** The full write-up: the three schools, all nine personas (snapshot, context, goals, frustrations, behavior, tech/influence, a quote, assumptions to validate, and an empathy map each), and the closing synthesis + interview plan. |
| [`personas.html`](personas.html) | **Interactive view of `personas.md`.** A single, self-contained web page that works like a small site: a **home index** of persona cards — pick one to open its full **one-pager** (snapshot, quote, goals, frustrations, behavior, assumptions, and a six-quadrant empathy map), then use the **back button** (or the browser Back) to return home. Also has a Schools page, a Synthesis page, group filtering, live search, and light/dark ("chalkboard") themes. Open it in any browser; nothing to install. |
| [`personas.pdf`](personas.pdf) | **Print/share view of `personas.md`** — the same content rendered as a card-style persona board for slides and handouts. |

### Prompts — how the content was generated

The `prompts/` folder holds the LLM prompts behind the work, so the process is reproducible.

| File | What it is |
|------|-----------|
| [`prompts/team_prompt.md`](prompts/team_prompt.md) | The master context prompt: who is on the team and the exact problem statement. Prepended to give the model our situation. |
| [`prompts/persona-prompt.md`](prompts/persona-prompt.md) | A reusable "buyer persona generator" prompt — turns a problem into distinct, prioritized customer segments. |
| [`prompts/empathy-map-prompt.md`](prompts/empathy-map-prompt.md) | A reusable empathy-map prompt — produces the Say / Do / Think / Feel / Pain / Gain map for a given persona, separating evidence from assumption. |

**Phase-tutor prompts** — AI coaches for the later phases of the sprint. Each *guides, never
solves*: Socratic questioning, honest feedback, and a strict "coaching, not production" line.

| File | What it is |
|------|-----------|
| [`prompts/validation-tutor-prompt.md`](prompts/validation-tutor-prompt.md) | Coaches teams through validating their riskiest assumptions with real evidence, then deciding to persevere / pivot / refine. |
| [`prompts/prototype-tutor-prompt.md`](prompts/prototype-tutor-prompt.md) | Coaches teams to build the lowest-fidelity prototype that tests a specific assumption. |
| [`prompts/pitch-tutor-prompt.md`](prompts/pitch-tutor-prompt.md) | Coaches teams toward a rehearsed Demo Day pitch, including a jury-simulation mode. |

### Scripts — how the views are built

The `scripts/` folder regenerates the HTML and PDF deterministically from `personas.md`, so
those views never drift from the source.

| File | What it is |
|------|-----------|
| [`scripts/md_to_html.py`](scripts/md_to_html.py) | Parses `personas.md` and writes `personas.html`. |
| [`scripts/md_to_pdf.py`](scripts/md_to_pdf.py) | Parses `personas.md` and writes `personas.pdf` (renders via headless Chrome). |

---

## Regenerating the views

`personas.md` is the single source. After editing it, rebuild the views:

```bash
# Interactive HTML  (personas.md -> personas.html)
python3 scripts/md_to_html.py

# Persona-board PDF (personas.md -> personas.pdf; needs Google Chrome installed)
python3 scripts/md_to_pdf.py
```

Both scripts are pure standard-library Python 3 (the PDF script shells out to Chrome for
rendering) and take optional `[input.md] [output]` arguments.
