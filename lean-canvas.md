# Lean Canvas — Working Document (Group 4)

> **Status: COMPLETE.** Blocks 1–6, 8, 9 coached ✅. **Block 7 (Cost Structure)
> excluded by team decision (2026-07-20).** 19 assumptions logged (A1–A19); see the
> synthesis at the end for the riskiest ones and the 2-week action list.
> Coaching session run with the prompt in [`prompts/lean-canvas-prompt.md`](prompts/lean-canvas-prompt.md).
> Last updated: 2026-07-20.

---

## 1. Problem ✅

> **P1 (teacher):** Teachers in Mexican private prepas can no longer verify from
> out-of-class work whether a student actually understood anything, because AI produces
> competent-looking submissions.
>
> **P2 (teacher):** Their workaround — moving assessment into class time and oral
> defenses — is free but doesn't scale and cannibalizes teaching hours.
>
> **P3 (director):** If students systematically fake homework, learning outcomes decline,
> which surfaces in university admission results — the metric parents and rankings
> actually judge the school on.

### Decisions made in Block 1

- **Two problem-owners, kept deliberately.** The teacher's pain is pedagogical
  ("I can't tell who learned"); the director's is reputational/commercial. Classic B2B
  school structure: teacher = user and champion, director = buyer. Each gets separate
  problems and separate interview questions.
- **The real pain is the workaround's cost, not "AI cheating."** Teachers already have a
  free fix (in-class work, oral defenses). What that fix costs is teaching time and it
  doesn't scale to 35-student groups. "AI cheating" is the cause; "assessment is eating
  our class time" is the pain a director will pay to fix.
- **RIMA fact-check (correction).** RIMA (*Recopilación de Información para la Mejora de
  los Aprendizajes*) is real but is a **Guanajuato-state diagnostic exam**, explicitly
  designed **not** to rank schools. The reputation levers that actually move a private
  prepa director: the Reforma/El Norte "Mejores Prepas" ranking (a peer-opinion survey of
  directors, not a learning measure) and **university admission outcomes** (Tec, UNAM,
  IPN). The causal chain that survives scrutiny: *students fake homework with AI → they
  underperform on university entrance exams → admission results drop → that's the number
  parents actually check.* This chain is now P3.
  - Sources: [RIMA – SEG Guanajuato](https://www.seg.guanajuato.gob.mx/RIMA/SitePages/RIMA_EMS.aspx),
    [~200k students took RIMA 2026](https://boletines.guanajuato.gob.mx/2026/05/19/participan-cerca-de-200-mil-estudiantes-de-preparatoria-en-prueba-rima-2026/),
    [Mejores prepas ranking](https://mextudia.com/cuales-son-las-mejores-preparatorias-en-mexico/)

### How Might We (problem framing) — chosen by the group

> **HOW MIGHT WE** help teachers to understand their student's learning progress based
> on out-of-class work
>
> **FOR** high-school teachers at private schools in Mexico
>
> **SO THAT** they can catch learning gaps early and address accordingly

Also recorded in the [README](README.md).

### Key assumptions in this block

- **A1:** Teachers actually experience P1 weekly, not occasionally.
- **A2:** The in-class workaround is felt as costly (time, scale) rather than as a fine
  permanent solution.
- **A3:** Directors believe AI-faked homework will eventually show up in admission
  results — a multi-year lag they may not connect on their own.
- **A4:** "Teachers think this is a big problem" survives an interview where we don't
  mention AI first.

### Evidence so far

| Claim | Evidence | Strength |
|---|---|---|
| Teachers think AI-homework is a big problem | Emiliano (Mexican teacher, in our network) says so — **n=1** | Weak signal, not validation |
| Teachers' current workaround is in-class work + oral defenses; no budget for tools like Turnitin | Team knowledge / Emiliano | Anecdotal |
| Everything else | Proto-personas in [`personas.md`](personas.md) | Assumptions only |

### Evidence still needed

- ≥10 discovery interviews where a teacher, **unprompted**, describes P1 or P2 in their
  own words.
- ≥1 director who connects AI homework → admission outcomes **without us drawing the
  line for them**.
- **Kill criterion:** if teachers say "in-class assessment solved it, we're fine," P2
  dies and most of the business dies with it.

---

## 2. Customer Segments ✅ (coached 2026-07-20)

> **Early segment (beachhead):** growth-oriented, tech-forward ("Fernando-type") private
> preparatorias in **León, Guanajuato** — ~10 such schools identified, reachable through
> Emiliano's network (~50 teachers, ~10 directors within reach).
>
> **User (early):** both Renata-type embracer teachers (champions/design partners) and
> Andrés-type pragmatist teachers (largest population, purest HMW pain) — recruited from
> day one, screened by attitude, not just subject.
>
> **Buyer:** the Director General — first pitch designed for the Fernando (innovator)
> archetype.

### Decisions made in Block 2

- **Beachhead buyer = Fernando-type innovator.** Fastest sales cycle, real budget, and
  the "learning made visible" story is exactly the parent-legible evidence he lacks.
  Patricia-type skeptics are customers #3–5, approached only once month-six usage data
  and local references exist. Known risk to manage: Fernando buys shelf-ware and churns
  if teachers don't adopt — every sale must be paired with a champion teacher.
- **Early users = both embracers and pragmatists.** The group chose not to pick a single
  teacher wedge yet; discovery data decides. Consequence: the 6–8 teacher interviews must
  deliberately cover both archetypes (≥3 each) or neither gets validated.
- **Geographic bound = León first.** Directors watch and copy local competitors, so one
  city gives referral loops and in-person interviews. Expand after the first pilot.
- **Exclusion list:** public schools (no discretionary budget, government procurement)
  and universities (different buying process and stakes). **Kept in-segment:**
  elite/international schools and Beatriz-type traditional schools — which means the
  Block 3 UVP must not alienate enforcement-minded buyers even though the first pitch
  targets innovators (the "sharpest cross-persona tension" from the personas synthesis,
  deliberately left open).
- **RIMA is back in play.** León is in Guanajuato, so the RIMA state diagnostic —
  fact-checked in Block 1 as *not* a ranking — is nonetheless an exam these specific
  directors know and may reference. Useful interview vocabulary, not a reputation lever.

### Key assumptions in this block

- **A9:** Emiliano's network genuinely reaches ~50 teachers and ~10 directors in León —
  verify by listing actual names this week, before the interview plan depends on it.
- **A10:** ~10 Fernando-type prepas exist in León and are identifiable from the outside
  (marketing, bilingual/tech positioning) — the count is currently the team's estimate.
- **A11:** Splitting the teacher interview pool across two archetypes still yields
  enough signal per archetype to pick a wedge afterwards.

### Evidence still needed

- Named list: the 10 schools, plus the first 15 interview targets (teachers + directors).
- Booked interviews within 30 days: 6–8 teachers (≥3 embracer-type, ≥3 pragmatist-type),
  3–4 directors (≥2 innovator-type).
- **Kill criterion:** if the named-list exercise shows the network actually reaches
  <15 teachers or <3 directors, the segment definition (or the channel) must change.

## 3. Unique Value Proposition ✅ (coached 2026-07-20)

Two linked promises — one per problem-owner — both on the **learning-visibility shelf,
never the anti-cheating/detector shelf** (settled by the personas synthesis: detection is
adversarial vs. Santiago, legally radioactive vs. Rodrigo, distrusted by every buyer).

> **Teacher UVP:** We help private-prepa teachers **see which students are actually
> learning from out-of-class work — catching gaps before the exam exposes them** —
> without giving up class time to in-class-only assessment.
>
> **Director UVP:** We help directors of growth-oriented private prepas **show parents
> verifiable evidence that students are actually learning in the AI era** — without
> detector tools that produce false accusations and parent conflicts.
>
> **Why now (chosen by the group):** the first-mover window — ~10 competing
> Fernando-type prepas in León; the first school to credibly claim "we guarantee
> learning in the AI era" takes founding-school status and forces the rest to respond.

### Decisions made in Block 3

- **Teacher outcome = early visibility of learning gaps.** It is the HMW verbatim,
  Andrés' stated goal ("early warning, not autopsy"), and the thing Renata can't scale
  by hand — so it serves both chosen archetypes. **"Time back" is demoted to proof
  point #2** until the concierge pilot can quantify actual minutes saved; the platform
  adds a workflow before it saves one, so leading with time savings is a claim we can't
  yet back.
- **Director outcome = parent-legible proof, not admission-outcomes protection.** P3's
  admission chain is real but takes 2–3 years to show and can't be attributed to the
  product by renewal time. Parent-facing evidence (dashboards, open-house artifacts) is
  verifiable within one semester and maps to enrollment — the number Fernando's
  investors read. Admission outcomes stay as backdrop narrative.
- **Why-now = first-mover scarcity, with a guardrail.** The group chose the León
  first-mover window over "parents are already asking." Coach's caveat, accepted: the
  window only exists if parents genuinely ask about AI — logged as A12 and tested
  directly in director interviews. If A12 fails, the why-now collapses back to
  teacher-side pain and the sales cycle lengthens.
- **Beatriz-compatibility check:** "see who is actually learning" is language an
  enforcement-minded buyer can live with (it implies evidence without promising
  policing). We do not promise enforcement — that would drag the product onto the
  detector shelf.

### Key assumptions in this block

- **A12:** Parents of prospective students actually ask León directors about AI
  (this is what makes the first-mover window real).
- **A13:** "See who's actually learning" resonates with teachers unprompted — they
  don't immediately reframe it as "so it catches cheaters."
- **A14:** Directors accept learning-visibility dashboards as parent-legible proof,
  rather than demanding integrity/enforcement features once they understand the product.

### Evidence still needed

- ≥2 of 4 interviewed directors recall a *specific* parent asking about AI in the last
  six months (tests A12 / the first-mover window).
- Pitch-back test: after hearing one UVP sentence, teachers and directors restate the
  promise in their own words — what they *say back* reveals which shelf they put us on
  (tests A13/A14).
- **Kill criterion:** if directors consistently translate the pitch into "so you catch
  the cheaters," the learning-visibility positioning fails with buyers and Block 3 must
  be redone (or the Beatriz segment dropped for real).

## 4. Solution ✅ (group draft coached 2026-07-20)

**Core concept (unchanged from the group's converged draft):** a platform where students
assess their own knowledge of what is actually being taught in their classes; the
platform generates **varied assessment types designed to mitigate AI doing the work for
the student**; teachers get a reliable read on each student's learning progress from
out-of-class work (closes the loop with P1/P2 and the HMW).

### Decisions made in Block 4

- **V1 input is radically cut: the teacher states the week's topics** (types them,
  voice-notes them, or forwards the existing planeación — two minutes of effort).
  Full course-document upload is deferred to a later convenience feature. This defuses
  A5 (upload willingness) as a v1 barrier — in a concierge setting the team can read any
  materials themselves.
- **MVP sequence (chosen by the group, gap made explicit by coaching):**
  1. **Now — clickable prototype + landing page**, used in discovery interviews and for
     Demo Day. Tests demand-side assumptions only (A13, A14, A15): what teachers and
     directors *say* and sign up for.
  2. **Immediately after discovery interviews — concierge pilot** with 1–2 teachers from
     Emiliano's network: one unit's topics, hand-crafted assessments (AI-assisted
     internally), delivered via Google Forms/WhatsApp, teacher receives a weekly
     one-page progress read. This is where A6 and A7 first meet real students.
- **Coach's challenge, accepted:** a prototype cannot test A6 (formats resist AI) or A7
  (honest engagement) because those live in what students *do*, not what adults say.
  A format only counts as AI-resistant after real Santiagos have tried to beat it —
  "if he beats it, the whole class knows by Friday." A6/A7 are therefore marked
  **untested until the concierge pilot**, dated, not forgotten.
- **Grading-load guardrail:** the teacher-facing output is a short progress read
  (who's on track, who's stuck, on what), never a stack of raw student answers to
  review. If the teacher spends >30 min/week per group on the tool, we have recreated
  P2's cost and violated our own Block 1 logic.

### Assumptions in this block

- **A5:** *(deferred, not deleted)* Teachers will eventually upload course materials to
  a third-party platform — not required for v1.
- **A6:** AI-resistant assessment formats exist that (a) students can't trivially
  outsource to AI and (b) don't recreate P2's cost in teacher time. **Untested until
  concierge pilot.**
- **A7:** Students will engage with the assessments honestly enough for the progress
  signal to be meaningful. **Untested until concierge pilot.**
- **A15:** A clickable prototype + landing page produces measurable *commitment*
  (sign-ups, pilot requests) rather than polite interest.
- **A16:** A teacher's two-minute "this week we covered X, Y, Z" gives enough context to
  generate assessments the teacher recognizes as relevant to their class.

### Evidence still needed

- Landing-page threshold (define before launch): e.g., ≥5 teacher sign-ups or ≥2
  director pilot requests from León traffic — anything less means A15 fails.
- Concierge pilot booked with 1–2 named teachers within 2 weeks of finishing discovery
  interviews.
- From the pilot: (a) can students beat each format with ChatGPT in <10 minutes?
  (A6); (b) do ≥70% of students complete assessments without grade coercion? (A7);
  (c) teacher time spent per week (the P2 guardrail).
- **Kill criteria:** every format broken quickly by students → A6 dies and the product
  concept needs redesign; teacher review time >30 min/week/group → the solution
  recreates the problem it sells against.

## 5. Channels ✅ (coached 2026-07-20)

> **Validation channel (next 30 days):** Emiliano's warm intros in León — ~50 teachers,
> ~10 directors claimed (A9's name-the-names check pending). **Plan B** if the named
> list under-delivers (<15 teachers / <3 directors): online teacher communities
> (TESOL/edu groups where Renata-types live) plus the mini-report below.
>
> **Sales motion:** **director-blessed teacher pilot.** Use director access to open the
> door, but keep the ask small — "give us your most AI-curious teacher for a free
> 4-week pilot." The champion teacher runs it; we return to the director with pilot
> data to close the school-level subscription.
>
> **First growth channel (<$500):** publish **"The state of AI & homework in León's
> private prepas"** — an anonymized mini-report from the ~20 discovery interviews.
> Gives every director a reason to take our call ("see how your school compares"),
> feeds the first-mover narrative (Block 3), and doubles as the credibility asset the
> Unfair Advantage block currently lacks (Block 9).

### Decisions made in Block 5

- **Not director-first subscription selling:** pitching a paid deal on vision alone
  invites the Fernando shelf-ware-and-churn pattern, and in a ~10-school city one
  churned school becomes every director's cautionary tale.
- **Not pure bottom-up either:** teacher-first-only under-uses a rare asset — direct
  warm access to innovator directors — and is too slow for the program timeline. The
  blessed-pilot motion uses the access without over-asking.
- **The pilot is also the evidence engine:** its usage data is exactly what
  Patricia-type skeptics (customers #3–5) will demand, so the motion compounds.

### Key assumptions in this block

- **A17:** A warm-introduced Fernando-type director says yes to a free four-week,
  single-teacher pilot within one meeting (it is the cheapest possible ask — if this
  fails, the motion or the beachhead is wrong).
- **A18:** The León mini-report generates director conversations beyond Emiliano's
  network (target: ≥3 new meetings within a month of publication).

### Evidence still needed

- The A9 named list (first 15 interview targets) — precondition for everything above.
- ≥2 directors verbally agree to pilot terms during discovery interviews.
- Report published within 2 weeks of finishing the interview round; meetings generated
  tracked against the ≥3 target.
- **Kill criterion:** zero directors accept a *free* pilot → the sales motion (or the
  Fernando-type beachhead itself) is wrong; revisit Blocks 2 and 5 before any build.

## 6. Revenue Streams ✅ (group draft coached 2026-07-20)

> **Model:** annual **school-level subscription, tiered by *preparatoria* enrollment**
> (indicative tiers: <200 / 200–300 / 300+ prepa students). The school pays;
> director = buyer (fits the Block 1 constraint: teachers don't control budget).

### Decisions made in Block 6

- **Tier on prepa enrollment, not the whole campus.** Your composite schools run
  700–1,100 total students but only 180–320 in prepa — pricing on primaria kids who
  never touch the product is the line-item a board strikes out. Secundaria expansion
  stays available as a clean upsell later.
- **Deliberately left open (group decision — keep it simple for now):** price points
  per tier, and the exact step where money first changes hands after the free pilot.
  These get designed from pilot results and interview price anchors, not guessed now.
- **Coach's note, accepted as a standing caveat:** the free 4-week pilot (Block 5)
  tests adoption, **not** willingness to pay. A8 stays untested until either a paid
  step exists or director interviews produce hard price-anchor reactions — so the
  interviews must carry that weight for now.

### Assumptions in this block

- **A8:** Directors will pay a recurring per-school subscription (sized by prepa
  enrollment) for visibility into learning progress, rather than expecting a free tool
  or a one-off purchase. **Untested by the free pilot — needs a price conversation.**

### Evidence still needed

- Price anchor: what a León private prepa currently pays per student/year for its
  existing software (LMS, admin ERP, platforms) — ask Emiliano and the first directors
  interviewed; this bounds the tiers.
- Which budget line would pay (technology vs. academic quality vs. marketing) and when
  the buying window falls in the Aug–Jul school cycle.
- ≥1 director reacts to a concrete price range in an interview without reframing the
  product as something that should be free.

## 7. Cost Structure — 🚫 excluded (team decision 2026-07-20)

The group decided to leave Cost Structure out of this canvas for now. Revisit if/when a
paid pilot is being scoped (the concierge-MVP unit economics question will resurface
there).

## 8. Key Metrics ✅ (coached 2026-07-20)

> **Discovery north star (next ~30 days): pilot commitments** — number of schools where
> a director blessed a pilot AND a named teacher committed to run it.
> **Strong signal: 2–3 by day 30. Zero = stop and revisit Blocks 2/5 before building
> anything.**
>
> **Pilot-phase "aha" metric: the teacher acts on a flagged gap** — at least once per
> week the pilot teacher does something differently because of the progress read
> (reteaches a topic, pulls a student aside, adjusts the next class). This is the HMW
> outcome — "catch gaps early *and address accordingly*" — made observable.

### Supporting metrics (tracked as inputs, never celebrated as outcomes)

- Unprompted P1/P2 mentions in teacher interviews (Block 1 gate: ≥8 of ~12).
- Landing-page conversions against the pre-declared A15 threshold (Block 4).
- Director price-anchor reactions collected (Block 6's willingness-to-pay proxy).
- In the pilot: ≥70% student completion without grade coercion (A7) and teacher time
  on the tool <30 min/week/group (the P2 guardrail).

### Vanity metrics — named now so nobody celebrates them later

Social impressions; "very interesting" comments after interviews; sign-ups with no
school name attached; LOIs without a pilot start date; Demo Day applause.

## 9. Unfair Advantage ✅ (coached 2026-07-20)

> **Today, honestly: a head start, not a moat.** Warm access to ~50 teachers and ~10
> directors in León via Emiliano is real and rare — but a funded competitor hires two
> Mexican ex-teachers and has the equivalent within months. We do not claim it as a
> moat (including at Demo Day).
>
> **What the head start lets us build (the actual advantage, 12-month horizon):**
> 1. **Per-school data corpus:** topics → generated assessments → student responses,
>    accumulating weekly. Assessments become locally calibrated and measurably better
>    with use — quality moat plus switching cost.
> 2. **León lighthouse credibility:** the mini-report plus first pilot references, in a
>    market where the hardest buyers (Patricia-types) decide on references and
>    month-six data that no outside vendor can show.

### Key assumption in this block

- **A19:** Schools will consent to us retaining and learning from assessment/response
  data (minors' data — same concern family as A5). **If consent fails, the data moat
  dies** and the advantage reverts to head-start-only.

### Evidence still needed

- Data-use terms accepted by the first pilot school (tests A19 at small scale).
- First demonstrable case of accumulated data improving assessment relevance —
  the moat's proof of concept.

---

## Synthesis — riskiest assumptions & next two weeks (2026-07-20)

**The five riskiest assumptions** (kill the business fastest if false, least evidence
today):

1. **A6 — AI-resistant formats actually resist AI** without eating teacher time. The
   product concept lives or dies here; untested until the concierge pilot.
2. **A8 — directors will pay** a recurring subscription. The free pilot doesn't touch
   this; only price conversations do.
3. **A2/A4 — the problem survives an unprompted interview.** If teachers say "in-class
   assessment solved it," P2 dies and most of the business with it (Block 1 kill
   criterion).
4. **A9 — the network is as deep as claimed.** Every channel and interview plan sits on
   "~50 teachers, ~10 directors" that hasn't been named yet.
5. **A7 — students engage honestly** enough for the signal to mean anything; Santiago
   gets a vote no adult can cast.

**Verdict at this stage:** persevere, with discovery as the gate — nothing built beyond
prototype + landing page until the north-star metric (2–3 pilot commitments by day 30)
says the market wants it.

**Next two weeks:**

1. Name the names (A9): list the 10 schools + first 15 interview targets — this week.
2. Book interviews: 6–8 teachers (≥3 embracer, ≥3 pragmatist), 3–4 directors.
3. Build the clickable prototype + landing page; pre-declare the A15 threshold.
4. Draft the 3 assessment formats for the future pilot (A6 candidates) while
   interviewing.
5. Collect price anchors in every director interview (A8 proxy).
6. After the interview round: publish the León mini-report; convert the warmest school
   into the first director-blessed concierge pilot.

---

## Handoff prompt

Paste everything below into a fresh session (together with the full coach prompt from
`prompts/lean-canvas-prompt.md`) to resume exactly where we left off:

```text
You are resuming a Lean Canvas coaching session with our MBA group (Group 4, Innovation
& AI Program, Santander Open Academy). Follow the Lean Canvas Step-by-Step Startup Coach
Prompt we are also pasting (one section at a time, 3–5 sharp questions, challenge vague
answers, rewrite, extract assumptions, list missing evidence, then ask "Are you ready to
move to the next Lean Canvas block?").

CONTEXT — our venture:
- Problem space: high-school students using AI to bypass the cognitive effort of
  out-of-class work; teachers can't verify comprehension.
- Market scope: good private preparatorias/bachilleratos in Mexico (ages 15–18), not
  necessarily elite, reached through a teammate's network.
- We have nine assumption-based proto-personas across three groups: teachers (users),
  students (problem actors), directors (buyers). None validated yet.

PROGRESS — THE CANVAS IS COMPLETE. Blocks 1–6, 8, 9 are coached and closed. Block 7
(Cost Structure) is EXCLUDED by team decision — skip it entirely.

The agreed Key Metrics box:
- Discovery north star: pilot commitments (director blessed + named teacher committed).
  Strong signal = 2–3 by day 30; zero = stop and revisit Blocks 2/5.
- Pilot "aha" metric: teacher acts on a flagged gap ≥1×/week (the HMW made observable).
- Supporting: unprompted P1/P2 mentions ≥8/12; A15 landing threshold; ≥70% student
  completion without coercion; teacher time <30 min/week/group.
- Declared vanity metrics: impressions, "interesting" comments, nameless sign-ups,
  LOIs without pilot dates, Demo Day applause.

The agreed Unfair Advantage box:
- Today: honestly a head start (Emiliano's León network), NOT claimed as a moat.
- Building toward: per-school data corpus (topics → assessments → responses, locally
  calibrated) + León lighthouse credibility (mini-report, first references).
- A19: schools must consent to data retention/learning, or the moat dies.

The agreed Revenue Streams box:
- Annual school-level subscription tiered by PREPA enrollment (<200 / 200–300 / 300+),
  not whole-campus; secundaria is a later upsell.
- Price points and the first paid step are deliberately open — to be designed from
  interview price anchors and pilot results, not guessed.
- Standing caveat: the free pilot does NOT test A8; director interviews must carry the
  willingness-to-pay evidence (price-anchor questions) until a paid step exists.

The agreed Channels box:
- Validation: Emiliano's warm intros in León; plan B = online teacher communities +
  mini-report if the named list under-delivers (<15 teachers / <3 directors).
- Sales motion: director-blessed teacher pilot — director opens the door, champion
  teacher runs a free 4-week pilot, pilot data closes the school subscription.
- First growth channel: publish "The state of AI & homework in León's private prepas"
  from the ~20 discovery interviews (also the Block 9 credibility asset).

The agreed Solution box:
- Core: platform where students assess their knowledge of what their class actually
  covered; generates varied AI-resistant assessment formats; teacher gets a short
  weekly progress read (never raw answers to grade — >30 min/week/group recreates P2).
- V1 input: teacher states the week's topics in two minutes; document upload deferred
  (A5 deferred, not deleted).
- MVP sequence: clickable prototype + landing page NOW (demand-side tests only), then a
  concierge pilot with 1–2 teachers immediately after discovery interviews — A6 and A7
  are explicitly UNTESTED until that pilot.

The agreed UVP box (learning-visibility positioning, never anti-cheating/detection):
- Teacher UVP: we help private-prepa teachers see which students are actually learning
  from out-of-class work — catching gaps before the exam exposes them — without giving
  up class time to in-class-only assessment.
- Director UVP: we help directors of growth-oriented private prepas show parents
  verifiable evidence that students are actually learning in the AI era — without
  detector tools that produce false accusations.
- Why now: first-mover window among ~10 competing Fernando-type prepas in León
  ("founding school" scarcity) — contingent on A12 (parents actually ask about AI).
- "Time back" is deliberately demoted to proof point #2 until a pilot quantifies it.

The agreed Customer Segments box:
- Beachhead: growth-oriented, tech-forward ("Fernando-type") private prepas in León,
  Guanajuato (~10 schools; Emiliano's network reaches ~50 teachers and ~10 directors).
- User (early): BOTH Renata-type embracers (champions) and Andrés-type pragmatists,
  screened by attitude in interviews (≥3 each).
- Buyer: Director General; first pitch designed for the innovator (Fernando) archetype;
  Patricia-type skeptics deferred to customers #3–5.
- Excluded: public schools, universities. Kept in-segment: elite and Beatriz-type
  traditional schools (so the UVP must not alienate enforcement-minded buyers).
- Note: León is in Guanajuato, so RIMA applies to these schools — interview vocabulary,
  not a reputation lever.

The agreed Problem box:
- P1 (teacher): Teachers in Mexican private prepas can no longer verify from
  out-of-class work whether a student actually understood anything, because AI produces
  competent-looking submissions.
- P2 (teacher): Their workaround — moving assessment into class time and oral defenses —
  is free but doesn't scale and cannibalizes teaching hours.
- P3 (director): If students systematically fake homework, learning outcomes decline,
  which surfaces in university admission results — the metric parents and rankings judge
  the school on.

KEY DECISIONS ALREADY MADE (do not relitigate):
- We keep BOTH problem-owners: teacher = user/champion (pedagogical pain), director =
  buyer (reputational/commercial pain). Separate problems, separate interview questions.
- The monetizable pain is the workaround's cost ("assessment is eating class time"), not
  "AI cheating" itself.
- FACT-CHECK ALREADY DONE: Mexico's RIMA exam is a Guanajuato-only diagnostic explicitly
  NOT used to rank schools. The reputation levers for private prepas are the
  Reforma/El Norte "Mejores Prepas" peer-opinion ranking and university admission
  outcomes (Tec, UNAM, IPN). P3 is built on the admission-outcomes chain.

ASSUMPTIONS LOGGED (A1–A19):
A1 teachers hit P1 weekly; A2 the in-class workaround feels costly, not fine;
A3 directors connect AI homework to admission results; A4 "big problem" survives an
interview where we don't mention AI first; A5 teachers will upload course materials to
a third-party platform; A6 AI-resistant assessment formats exist that don't recreate
P2's time cost; A7 students engage honestly enough for the progress signal to mean
something; A8 directors will pay a recurring per-school subscription sized by
enrollment; A9 Emiliano's network really reaches ~50 teachers / ~10 directors in León
(verify by naming names); A10 ~10 Fernando-type prepas exist in León; A11 a two-archetype
teacher interview pool still yields enough signal per archetype; A12 parents actually
ask León directors about AI (makes the first-mover window real); A13 "see who's actually
learning" resonates with teachers unprompted; A14 directors accept learning-visibility
dashboards as parent-legible proof rather than demanding enforcement features;
A15 a prototype + landing page produces measurable commitment (sign-ups, pilot
requests), not polite interest; A16 a teacher's two-minute topic list is enough context
to generate assessments the teacher recognizes as relevant; A17 a warm-introduced
innovator director accepts a free 4-week single-teacher pilot within one meeting;
A18 the León mini-report generates ≥3 director meetings beyond the network; A19 schools
consent to us retaining and learning from assessment/response data (minors' data — else
the data moat dies). NOTE: A5 is deferred (v1 needs no document upload); A6/A7 are
explicitly untested until the concierge pilot; A8 is untested by the free pilot and
needs price conversations.

EVIDENCE SO FAR: one teacher in our network (Emiliano) says it's a big problem — n=1,
weak signal only. Everything else is assumption. Kill criterion: if teachers say
"in-class assessment solved it, we're fine," P2 dies.

YOUR NEXT ACTION: The canvas is done — we are now in the VALIDATION phase. Our 2-week
plan: (1) name the names behind A9 (10 schools, 15 interview targets); (2) book 6–8
teacher interviews (≥3 embracer-type, ≥3 pragmatist-type) and 3–4 director interviews;
(3) build the clickable prototype + landing page and pre-declare the A15 threshold;
(4) draft 3 candidate AI-resistant assessment formats (A6); (5) collect price anchors
in every director interview (A8); (6) then publish the León mini-report and convert the
warmest school into the first director-blessed concierge pilot. Help us execute and
review evidence against the kill criteria — challenge us if we celebrate vanity
metrics or dodge a failed assumption. Be direct, skeptical, and practical.
```
