#!/usr/bin/env python3
"""Deterministically convert personas.md into an interactive HTML persona board.

Usage:
    python3 md_to_html.py [input.md] [output.html]

Defaults: input = ../personas.md relative to this script, output = ../personas.html.

Produces a single self-contained, theme-aware HTML page that works like a small
site: a HOME index of selectable persona cards, and one full "one-pager" per
persona (plus a Schools page and a Synthesis page). Navigation is hash-based, so
picking a card opens its one-pager and the browser Back button (or the in-page
"All personas" button) returns you home.

No third-party Python packages required. Same input -> same output.
"""

import html
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))

# Group accent system, carried over from md_to_pdf.py and extended for the web.
GROUP_META = {
    "TEACHERS": {"slug": "teachers", "accent": "#2F6B5F", "eyebrow": "Users"},
    "STUDENTS": {"slug": "students", "accent": "#B5730F", "eyebrow": "Problem actors"},
    "DIRECTORS": {"slug": "directors", "accent": "#8A4A68", "eyebrow": "Buyers"},
}


# --------------------------------------------------------------------------- #
# Inline + block markdown rendering
# --------------------------------------------------------------------------- #

_CODE_RE = re.compile(r"`([^`]+)`")
_LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
_BOLD_RE = re.compile(r"\*\*([^*]+)\*\*")
_ITALIC_RE = re.compile(r"(?<!\*)\*([^*]+)\*(?!\*)")


def inline(text):
    """Render inline markdown (code, links, bold, italic) to safe HTML."""
    text = html.escape(text, quote=False)
    text = _CODE_RE.sub(r"<code>\1</code>", text)
    text = _LINK_RE.sub(r'<a href="\2">\1</a>', text)
    text = _BOLD_RE.sub(r"<strong>\1</strong>", text)
    text = _ITALIC_RE.sub(r"<em>\1</em>", text)
    return text


def slugify(text):
    text = re.sub(r"[^\w\s-]", "", text.lower())
    return re.sub(r"[\s_-]+", "-", text).strip("-")


def render_blocks(lines):
    """Render a list of markdown lines (paragraphs, lists, tables, quotes)."""
    out = []
    i = 0
    n = len(lines)
    while i < n:
        line = lines[i]
        stripped = line.strip()
        if not stripped:
            i += 1
            continue

        if stripped.startswith("|"):
            rows = []
            while i < n and lines[i].strip().startswith("|"):
                rows.append(lines[i].strip())
                i += 1
            out.append(render_table(rows))
            continue

        if stripped.startswith(">"):
            buf = []
            while i < n and lines[i].strip().startswith(">"):
                buf.append(lines[i].strip()[1:].strip())
                i += 1
            out.append('<blockquote>%s</blockquote>' % inline(" ".join(buf)))
            continue

        if re.match(r"^\d+\.\s", stripped):
            items = []
            while i < n and re.match(r"^\d+\.\s", lines[i].strip()):
                items.append(re.sub(r"^\d+\.\s", "", lines[i].strip()))
                i += 1
            out.append("<ol>%s</ol>" % "".join(
                "<li>%s</li>" % inline(it) for it in items))
            continue

        if stripped.startswith("- "):
            items = []
            while i < n and lines[i].strip().startswith("- "):
                items.append(lines[i].strip()[2:])
                i += 1
            out.append("<ul>%s</ul>" % "".join(
                "<li>%s</li>" % inline(it) for it in items))
            continue

        buf = []
        while i < n and lines[i].strip() and not lines[i].strip().startswith(
                ("|", ">", "- ")) and not re.match(r"^\d+\.\s", lines[i].strip()):
            buf.append(lines[i].strip())
            i += 1
        out.append("<p>%s</p>" % inline(" ".join(buf)))
    return "\n".join(out)


def render_table(rows):
    cells = [[c.strip() for c in r.strip("|").split("|")] for r in rows]
    cells = [r for r in cells if not all(set(c) <= set("-: ") for c in r)]
    body = []
    for r in cells:
        tds = "".join("<td>%s</td>" % inline(c) for c in r)
        body.append("<tr>%s</tr>" % tds)
    return "<div class='table-wrap'><table>%s</table></div>" % "".join(body)


def parse_snapshot(rows):
    pairs = []
    for r in rows:
        parts = [c.strip() for c in r.strip("|").split("|")]
        if all(set(c) <= set("-: ") for c in parts):
            continue
        if len(parts) >= 2 and parts[0] and parts[1]:
            pairs.append((parts[0], parts[1]))
    return pairs


# --------------------------------------------------------------------------- #
# Document parsing
# --------------------------------------------------------------------------- #

def split_sections(text, level):
    marker = "#" * level + " "
    sections = []
    current_head = None
    current_body = []
    for line in text.splitlines():
        if line.startswith(marker) and not line.startswith(marker + "#"):
            if current_head is not None or current_body:
                sections.append((current_head, current_body))
            current_head = line[len(marker):].strip()
            current_body = []
        else:
            current_body.append(line)
    if current_head is not None or current_body:
        sections.append((current_head, current_body))
    return sections


def parse_subsections(body):
    subs = []
    title = None
    buf = []
    for line in body:
        if line.startswith("### "):
            if title is not None:
                subs.append((title, buf))
            title = line[4:].strip()
            buf = []
        else:
            buf.append(line)
    if title is not None:
        subs.append((title, buf))
    return subs


def parse_empathy(lines):
    quads = []
    label = None
    items = []
    for line in lines:
        s = line.strip()
        m = re.match(r"^\*\*(.+?)\*\*$", s)
        if m:
            if label is not None:
                quads.append((label, items))
            label = m.group(1)
            items = []
        elif s.startswith("- ") and label is not None:
            items.append(inline(s[2:]))
    if label is not None:
        quads.append((label, items))
    return quads


PERSONA_HEAD_RE = re.compile(r'^(.*?)\s+—\s+"(.+?)"\s+·\s+(.+)$')


def parse_persona_heading(heading):
    m = PERSONA_HEAD_RE.match(heading)
    if not m:
        return {"prefix": "", "name": heading, "archetype": "", "tag": ""}
    prefix, name, rest = m.group(1), m.group(2), m.group(3)
    tag = ""
    pm = re.match(r"^(.*?)\s*\((.+)\)\s*$", rest)
    if pm:
        archetype, tag = pm.group(1).strip(), pm.group(2).strip()
    else:
        archetype = rest.strip()
    return {"prefix": prefix, "name": name, "archetype": archetype, "tag": tag}


def monogram(name):
    tokens = [t for t in re.split(r"\s+", name) if t]
    return (tokens[-1][0] if tokens else "?").upper()


def get_first(sub_map, *keys):
    for k in keys:
        if k in sub_map:
            return sub_map[k]
    return None


def snapshot_pairs(sub_map):
    if "Snapshot" not in sub_map:
        return []
    rows = [l.strip() for l in sub_map["Snapshot"] if l.strip().startswith("|")]
    return parse_snapshot(rows)


def quote_text(sub_map):
    if "Quote" not in sub_map:
        return ""
    return " ".join(l.strip()[1:].strip() for l in sub_map["Quote"]
                    if l.strip().startswith(">"))


def bullets(sub_map, key):
    if key not in sub_map:
        return []
    return [l.strip()[2:] for l in sub_map[key] if l.strip().startswith("- ")]


# --------------------------------------------------------------------------- #
# HTML: persona card (home) + persona one-pager (detail)
# --------------------------------------------------------------------------- #

def build_persona(sub_heading, body, group_slug, accent, eyebrow):
    info = parse_persona_heading(sub_heading)
    sub_map = {t: lines for t, lines in parse_subsections(body)}
    pid = "p-" + slugify(info["name"])
    mono = monogram(info["name"])
    pairs = snapshot_pairs(sub_map)
    quote = quote_text(sub_map)
    school = ""
    for k, v in pairs:
        if k.lower() == "school":
            school = v
            break

    eyebrow_parts = [p for p in [info["archetype"], info["tag"]] if p]
    eyebrow_html = " · ".join(inline(p) for p in eyebrow_parts)
    search_blob = html.escape(sub_heading + " " + " ".join(body), quote=True).lower()[:4000]

    # ---- Home card --------------------------------------------------------
    card = """
<a class="card" href="#{pid}" data-group="{group}" data-name="{search}" style="--accent:{accent};">
  <div class="card-top">
    <div class="mono">{mono}</div>
    <span class="card-arrow" aria-hidden="true">→</span>
  </div>
  <div class="eyebrow">{eyebrow}</div>
  <h3>{name}</h3>
  <p class="card-school">{school}</p>
  <p class="card-quote">{quote}</p>
</a>""".format(
        pid=pid, group=group_slug, search=search_blob, accent=accent, mono=mono,
        eyebrow=eyebrow_html, name=inline(info["name"]),
        school=inline(school), quote=inline(quote))

    # ---- One-pager --------------------------------------------------------
    facts_html = ""
    if pairs:
        chips = "".join(
            "<div class='fact'><dt>%s</dt><dd>%s</dd></div>" % (inline(k), inline(v))
            for k, v in pairs)
        facts_html = "<dl class='facts'>%s</dl>" % chips

    quote_block = ""
    if quote:
        quote_block = "<blockquote class='pull'>%s</blockquote>" % inline(quote)

    def bullet_block(title, key, cls):
        items = bullets(sub_map, key)
        if not items:
            return ""
        lis = "".join("<li>%s</li>" % inline(it) for it in items)
        return "<div class='col %s'><h4>%s</h4><ul>%s</ul></div>" % (cls, title, lis)

    goals = bullet_block("Goals", "Goals", "goals")
    frustr = bullet_block("Frustrations", "Frustrations", "frustrations")
    gf_html = ("<div class='gf'>%s%s</div>" % (goals, frustr)) if (goals or frustr) else ""

    blocks = []
    ctx = get_first(sub_map, "Context")
    if ctx:
        blocks.append("<div class='block'><h4>Context</h4>%s</div>" % render_blocks(ctx))
    beh = get_first(sub_map, "Current behavior / workarounds", "Current behavior")
    if beh:
        blocks.append("<div class='block'><h4>Current behavior &amp; workarounds</h4>%s</div>"
                      % render_blocks(beh))
    tech_key = "Tech stack & influence" if "Tech stack & influence" in sub_map \
        else ("Tech stack & buying behavior" if "Tech stack & buying behavior" in sub_map else None)
    if tech_key:
        blocks.append("<div class='block'><h4>%s</h4>%s</div>"
                      % (inline(tech_key), render_blocks(sub_map[tech_key])))
    if "Assumptions to validate" in sub_map:
        blocks.append("<div class='block assumptions'><h4>Assumptions to validate</h4>%s</div>"
                      % render_blocks(sub_map["Assumptions to validate"]))

    empathy_html = ""
    if "Empathy Map" in sub_map:
        cells = []
        for label, items in parse_empathy(sub_map["Empathy Map"]):
            lis = "".join("<li>%s</li>" % it for it in items)
            cells.append("<div class='quad'><h5>%s</h5><ul>%s</ul></div>"
                         % (inline(label), lis))
        empathy_html = ("<div class='block empathy'><h4>Empathy map</h4>"
                        "<div class='empathy-grid'>%s</div></div>" % "".join(cells))

    full_eyebrow = " · ".join(inline(p) for p in eyebrow_parts + [eyebrow])

    page = """
<article class="view page persona-page" id="{pid}" data-group="{group}" style="--accent:{accent};" hidden>
  <a class="back" href="#home">&larr; All personas</a>
  <header class="page-head">
    <div class="mono big">{mono}</div>
    <div class="page-title">
      <div class="eyebrow">{eyebrow}</div>
      <h1>{name}</h1>
      <p class="page-school">{school}</p>
    </div>
  </header>
  {quote}
  {facts}
  {gf}
  <div class="detail-blocks">{blocks}{empathy}</div>
  <a class="back back-bottom" href="#home">&larr; Back to all personas</a>
</article>""".format(
        pid=pid, group=group_slug, accent=accent, mono=mono,
        eyebrow=full_eyebrow, name=inline(info["name"]),
        school=inline(school) if school else "",
        quote=quote_block, facts=facts_html, gf=gf_html,
        blocks="".join(blocks), empathy=empathy_html)

    return {"card": card, "page": page, "group": group_slug}


# --------------------------------------------------------------------------- #
# HTML: schools + synthesis one-pagers, hero
# --------------------------------------------------------------------------- #

def build_schools(body):
    schools = split_sections("\n".join(body), 2)
    intro_lines = []
    cards = []
    for head, sbody in schools:
        if head is None:
            intro_lines = sbody
            continue
        name, note = head, ""
        m = re.match(r"^(.*?)\s*\((.+)\)\s*$", head)
        if m:
            name, note = m.group(1).strip(), m.group(2).strip()
        note_html = ("<span class='school-note'>%s</span>" % inline(note)) if note else ""
        cards.append("<article class='school'><h3>%s</h3>%s%s</article>"
                     % (inline(name), note_html, render_blocks(sbody)))
    intro_html = render_blocks(intro_lines) if intro_lines else ""
    page = """
<article class="view page doc-page" id="schools" hidden>
  <a class="back" href="#home">&larr; All personas</a>
  <div class="section-head"><span class="section-eyebrow">Setting</span><h1>The three schools</h1></div>
  <div class="prose">{intro}</div>
  <div class="school-grid">{cards}</div>
  <a class="back back-bottom" href="#home">&larr; Back to home</a>
</article>""".format(intro=intro_html, cards="".join(cards))
    return page


def build_synthesis(body):
    return """
<article class="view page doc-page" id="synthesis" hidden>
  <a class="back" href="#home">&larr; All personas</a>
  <div class="section-head"><span class="section-eyebrow">Synthesis</span><h1>How the nine personas interlock</h1></div>
  <div class="prose">{body}</div>
  <a class="back back-bottom" href="#home">&larr; Back to home</a>
</article>""".format(body=render_blocks(body))


def build_hero(title, body):
    highlights = []
    for line in body:
        s = line.strip()
        m = re.match(r"^\*\*(.+?):\*\*\s*(.+)$", s)
        if m:
            highlights.append((m.group(1), m.group(2)))
    hi_html = "".join(
        "<div class='hi'><span class='hi-k'>%s</span><p>%s</p></div>"
        % (inline(k), inline(v)) for k, v in highlights)
    return """
<header class="hero">
  <span class="kicker">Innovation &amp; AI · Santander Open Academy · Group 4</span>
  <h1>{title}</h1>
  <p class="lede">Nine assumption-based proto-personas mapping the people caught in the
  AI-and-homework-integrity problem. Pick a card to open its one-pager.</p>
  <div class="highlights">{hi}</div>
</header>""".format(title=inline(title), hi=hi_html)


# --------------------------------------------------------------------------- #
# Page assembly
# --------------------------------------------------------------------------- #

def build_page(md_text):
    h1_sections = split_sections(md_text, 1)

    intro_title = "Proto-Personas"
    hero_html = ""
    schools_page = ""
    synthesis_page = ""
    schools_present = False
    synthesis_present = False
    group_blocks = []   # (label_title, slug, [card_html]) for home
    persona_pages = []
    toc_groups = []

    for head, body in h1_sections:
        if head is None:
            continue
        if head.startswith("Proto-Personas"):
            intro_title = head
            hero_html = build_hero(head, body)
        elif head.upper().startswith("THE SCHOOLS"):
            schools_page = build_schools(body)
            schools_present = True
        elif head.upper().startswith("GROUP"):
            gm = re.match(r"GROUP\s+\d+\s+—\s+(.+?)\s+\((.+)\)", head)
            if gm:
                label = gm.group(1).strip().upper()
                eyebrow = gm.group(2).strip()
            else:
                label, eyebrow = head.upper(), ""
            meta = GROUP_META.get(label, {"slug": slugify(label), "accent": "#2F6B5F"})
            slug, accent = meta["slug"], meta["accent"]
            personas = split_sections("\n".join(body), 2)
            cards = []
            for ph, pbody in personas:
                if ph is None:
                    continue
                built = build_persona(ph, pbody, slug, accent, eyebrow)
                cards.append(built["card"])
                persona_pages.append(built["page"])
            group_blocks.append((label.title(), slug, accent, cards))
            toc_groups.append((label.title(), slug))
        elif head.upper().startswith("SYNTHESIS"):
            synthesis_page = build_synthesis(body)
            synthesis_present = True

    # Home: grouped card sections
    home_groups = []
    for title, slug, accent, cards in group_blocks:
        home_groups.append(
            "<section class='group' data-group='{slug}' style='--accent:{accent};'>"
            "<div class='group-head'><span class='group-eyebrow'>{eyebrow}</span>"
            "<h2>{title}</h2></div>"
            "<div class='board'>{cards}</div></section>".format(
                slug=slug, accent=accent, title=title,
                eyebrow=GROUP_META.get(slug.upper(), {}).get(
                    "eyebrow", dict(zip(["teachers", "students", "directors"],
                                        ["Users", "Problem actors", "Buyers"])).get(slug, "")),
                cards="".join(cards)))

    # Extra "document" cards (schools / synthesis)
    doc_cards = []
    if schools_present:
        doc_cards.append(
            "<a class='doc-card' href='#schools'><span class='doc-eyebrow'>Setting</span>"
            "<h3>The three schools</h3><p>Where the nine personas live — the segment they "
            "span, and how each school shapes its people.</p><span class='card-arrow'>&rarr;</span></a>")
    if synthesis_present:
        doc_cards.append(
            "<a class='doc-card' href='#synthesis'><span class='doc-eyebrow'>Synthesis</span>"
            "<h3>How it all interlocks</h3><p>The classroom &amp; buying triangles, the strategic "
            "hypothesis, and the Round-1 discovery interview plan.</p><span class='card-arrow'>&rarr;</span></a>")
    doc_section = ""
    if doc_cards:
        doc_section = ("<section class='group docs'><div class='group-head'>"
                       "<span class='group-eyebrow'>Context</span><h2>Setting &amp; synthesis</h2>"
                       "</div><div class='doc-grid'>%s</div></section>" % "".join(doc_cards))

    # Filter pills
    pills = ['<button class="pill is-active" data-filter="all">All</button>']
    for title, slug in toc_groups:
        pills.append('<button class="pill" data-filter="%s">%s</button>' % (slug, title))
    pills_html = "".join(pills)

    home_html = """
<section class="view" id="home">
  {hero}
  <div class="home-controls">
    <div class="pills">{pills}</div>
    <label class="search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      <input id="search-input" type="search" placeholder="Search personas..." aria-label="Search personas">
    </label>
  </div>
  {groups}
  <div id="no-results" class="no-results">No personas match your search.</div>
  {docs}
</section>""".format(hero=hero_html, pills=pills_html,
                     groups="".join(home_groups), docs=doc_section)

    return PAGE_TEMPLATE.format(
        title=html.escape(intro_title),
        css=CSS, js=JS,
        home=home_html,
        pages="".join(persona_pages) + schools_page + synthesis_page,
    )


CSS = r"""
:root{
  --bg:#EDF1EE; --surface:#FBFCFB; --surface-2:#F1F5F1;
  --ink:#18231E; --muted:#5B665F; --line:#D8E0DA;
  --accent:#2F6B5F; --accent-ink:#20514A;
  --shadow:0 1px 2px rgba(20,40,30,.05), 0 8px 24px rgba(20,40,30,.06);
  --shadow-lg:0 4px 12px rgba(20,40,30,.08), 0 20px 48px rgba(20,40,30,.12);
  --radius:16px;
  --serif:"Fraunces",Georgia,"Times New Roman",serif;
  --sans:"Public Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  --mono:"IBM Plex Mono",ui-monospace,"SF Mono",Menlo,monospace;
}
@media (prefers-color-scheme: dark){
  :root{
    --bg:#15201C; --surface:#1C2823; --surface-2:#213029;
    --ink:#ECF2ED; --muted:#9CA9A1; --line:#2C3B34;
    --accent:#6FC0AE; --accent-ink:#8ED3C3;
    --shadow:0 1px 2px rgba(0,0,0,.3), 0 10px 30px rgba(0,0,0,.35);
    --shadow-lg:0 6px 18px rgba(0,0,0,.4), 0 24px 60px rgba(0,0,0,.5);
  }
}
:root[data-theme="light"]{
  --bg:#EDF1EE; --surface:#FBFCFB; --surface-2:#F1F5F1;
  --ink:#18231E; --muted:#5B665F; --line:#D8E0DA;
  --accent:#2F6B5F; --accent-ink:#20514A;
  --shadow:0 1px 2px rgba(20,40,30,.05), 0 8px 24px rgba(20,40,30,.06);
  --shadow-lg:0 4px 12px rgba(20,40,30,.08), 0 20px 48px rgba(20,40,30,.12);
}
:root[data-theme="dark"]{
  --bg:#15201C; --surface:#1C2823; --surface-2:#213029;
  --ink:#ECF2ED; --muted:#9CA9A1; --line:#2C3B34;
  --accent:#6FC0AE; --accent-ink:#8ED3C3;
  --shadow:0 1px 2px rgba(0,0,0,.3), 0 10px 30px rgba(0,0,0,.35);
  --shadow-lg:0 6px 18px rgba(0,0,0,.4), 0 24px 60px rgba(0,0,0,.5);
}

*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  margin:0; background:var(--bg); color:var(--ink);
  font-family:var(--sans); font-size:16px; line-height:1.6; -webkit-font-smoothing:antialiased;
}
@media (prefers-reduced-motion: reduce){ html{scroll-behavior:auto} *{transition:none!important} }
.wrap{max-width:1200px; margin:0 auto; padding:0 24px}
a{color:var(--accent-ink)}
[hidden]{display:none!important}

/* ---- Command bar ---- */
.topbar{position:sticky; top:0; z-index:50; background:var(--bg); border-bottom:1px solid var(--line)}
.topbar-inner{max-width:1200px; margin:0 auto; padding:12px 24px;
  display:flex; align-items:center; gap:14px}
.brand{font-family:var(--serif); font-weight:600; font-size:18px; letter-spacing:-.01em;
  white-space:nowrap; display:flex; align-items:center; gap:9px; text-decoration:none; color:var(--ink)}
.brand .dot{width:11px;height:11px;border-radius:3px;background:var(--accent);
  box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 22%, transparent)}
.topbar .back{margin-left:4px}
.topbar-spacer{margin-left:auto}
.theme-toggle{margin-left:auto; border:1px solid var(--line); background:var(--surface); color:var(--ink);
  width:36px;height:36px;border-radius:10px;cursor:pointer; font-size:16px; line-height:1; display:grid; place-items:center}

/* Back buttons */
.back{display:inline-flex; align-items:center; gap:6px; font-family:var(--mono); font-size:12px;
  letter-spacing:.04em; text-transform:uppercase; color:var(--accent-ink); text-decoration:none;
  border:1px solid var(--line); background:var(--surface); padding:7px 13px; border-radius:999px}
.back:hover{border-color:var(--accent)}
.back-bottom{margin-top:8px}

/* ---- Home controls ---- */
.home-controls{display:flex; align-items:center; gap:14px; flex-wrap:wrap; margin:8px 0 30px}
.pills{display:flex; gap:6px; flex-wrap:wrap}
.pill{font-family:var(--mono); font-size:11.5px; letter-spacing:.04em; text-transform:uppercase;
  color:var(--muted); background:transparent; border:1px solid var(--line);
  padding:6px 12px; border-radius:999px; cursor:pointer; transition:.15s}
.pill:hover{color:var(--ink); border-color:var(--accent)}
.pill.is-active{background:var(--accent); color:#fff; border-color:var(--accent)}
.search{margin-left:auto; display:flex; align-items:center; gap:8px; background:var(--surface);
  border:1px solid var(--line); border-radius:999px; padding:6px 14px; min-width:220px}
.search input{border:0; background:transparent; color:var(--ink); font-family:var(--sans);
  font-size:14px; outline:none; width:100%}
.search svg{flex:none; opacity:.5}

/* ---- Hero ---- */
.hero{padding:56px 0 20px}
.kicker{font-family:var(--mono); font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--accent-ink)}
.hero h1{font-family:var(--serif); font-weight:600; font-size:clamp(32px,5.4vw,56px);
  line-height:1.03; letter-spacing:-.02em; margin:.35em 0 .3em; text-wrap:balance; max-width:17ch}
.lede{font-size:clamp(16px,2.1vw,19px); color:var(--muted); max-width:60ch; margin:0}
.highlights{display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:14px; margin-top:32px}
.hi{background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:16px 18px; box-shadow:var(--shadow)}
.hi-k{font-family:var(--mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--accent-ink); display:block; margin-bottom:6px}
.hi p{margin:0; font-size:14.5px; line-height:1.5}

/* ---- Home groups + cards ---- */
.group{margin:40px 0}
.group-head{margin:0 0 18px}
.group-eyebrow{font-family:var(--mono); font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:var(--accent)}
.group-head h2{font-family:var(--serif); font-weight:600; font-size:clamp(24px,3.6vw,34px); letter-spacing:-.015em; margin:.12em 0 0}
.board{display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:18px}
.card{display:flex; flex-direction:column; gap:8px; background:var(--surface);
  border:1px solid var(--line); border-top:3px solid var(--accent); border-radius:var(--radius);
  padding:20px; text-decoration:none; color:var(--ink); box-shadow:var(--shadow);
  transition:transform .15s, box-shadow .15s, border-color .15s}
.card:hover{transform:translateY(-3px); box-shadow:var(--shadow-lg)}
.card-top{display:flex; align-items:center; justify-content:space-between}
.mono{width:46px;height:46px;flex:none; border-radius:12px; display:grid; place-items:center;
  font-family:var(--serif); font-weight:600; font-size:21px; color:#fff; background:var(--accent);
  box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 16%, transparent)}
.card-arrow{font-size:20px; color:var(--muted); transition:transform .15s, color .15s}
.card:hover .card-arrow{transform:translateX(4px); color:var(--accent)}
.eyebrow{font-family:var(--mono); font-size:11px; letter-spacing:.04em; text-transform:uppercase; color:var(--accent-ink)}
.card h3{font-family:var(--serif); font-size:21px; font-weight:600; letter-spacing:-.01em; margin:2px 0 0}
.card-school{margin:0; font-size:13px; color:var(--muted)}
.card-quote{margin:4px 0 0; font-family:var(--serif); font-style:italic; font-size:14.5px; line-height:1.45;
  color:var(--ink); display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden}
.card.is-hidden{display:none}

/* Doc cards */
.doc-grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:18px}
.doc-card{position:relative; display:block; background:var(--surface); border:1px solid var(--line);
  border-radius:var(--radius); padding:22px; text-decoration:none; color:var(--ink);
  box-shadow:var(--shadow); transition:transform .15s, box-shadow .15s}
.doc-card:hover{transform:translateY(-3px); box-shadow:var(--shadow-lg)}
.doc-eyebrow{font-family:var(--mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--accent-ink)}
.doc-card h3{font-family:var(--serif); font-size:22px; font-weight:600; margin:6px 0 8px; letter-spacing:-.01em}
.doc-card p{margin:0; font-size:14px; color:var(--muted); max-width:44ch}
.doc-card .card-arrow{position:absolute; top:22px; right:22px}

/* ---- One-pager (persona-page) ---- */
.page{padding:28px 0 60px; display:flex; flex-direction:column; gap:22px}
.page-head{display:flex; align-items:center; gap:18px}
.mono.big{width:72px;height:72px;border-radius:18px;font-size:34px}
.page-title .eyebrow{color:var(--accent-ink)}
.page-title h1{font-family:var(--serif); font-weight:600; font-size:clamp(30px,5vw,46px);
  letter-spacing:-.02em; margin:4px 0 0; line-height:1.02}
.page-school{margin:6px 0 0; color:var(--muted); font-size:15px}

.facts{display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:1px; margin:0;
  background:var(--line); border:1px solid var(--line); border-radius:14px; overflow:hidden}
.fact{background:var(--surface); padding:11px 14px}
.fact dt{font-family:var(--mono); font-size:10px; letter-spacing:.05em; text-transform:uppercase; color:var(--muted); margin:0}
.fact dd{margin:3px 0 0; font-size:14px; line-height:1.4}

.pull{margin:0; padding:20px 24px; border-left:3px solid var(--accent); background:var(--surface-2);
  border-radius:0 12px 12px 0; font-family:var(--serif); font-size:clamp(18px,2.4vw,22px);
  font-style:italic; line-height:1.45; color:var(--ink)}

.gf{display:grid; grid-template-columns:1fr 1fr; gap:20px}
@media (max-width:640px){.gf{grid-template-columns:1fr}}
.col h4{font-family:var(--mono); font-size:11px; letter-spacing:.06em; text-transform:uppercase; margin:0 0 8px; color:var(--muted)}
.col ul{margin:0; padding-left:18px; font-size:15px}
.col li{margin:.4em 0}
.goals li::marker{color:var(--accent)}
.frustrations li::marker{color:#c2603f}

.detail-blocks{display:grid; grid-template-columns:1fr 1fr; gap:20px}
.detail-blocks .empathy{grid-column:1 / -1}
.detail-blocks .assumptions{grid-column:1 / -1}
@media (max-width:760px){.detail-blocks{grid-template-columns:1fr}}
.block{background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:18px 20px}
.block h4{font-family:var(--mono); font-size:11px; letter-spacing:.06em; text-transform:uppercase; color:var(--accent-ink); margin:0 0 10px}
.block p{margin:0 0 10px; font-size:15px}
.block p:last-child{margin-bottom:0}
.block ul,.block ol{margin:0; padding-left:20px; font-size:15px}
.block li{margin:.4em 0}
.block.assumptions{background:var(--surface-2)}
.block.assumptions ol li::marker{font-family:var(--mono); color:var(--accent); font-size:12px}

.empathy-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--line);
  border:1px solid var(--line); border-radius:12px; overflow:hidden; margin-top:2px}
@media (max-width:720px){.empathy-grid{grid-template-columns:1fr 1fr}}
@media (max-width:460px){.empathy-grid{grid-template-columns:1fr}}
.quad{background:var(--surface); padding:14px 15px}
.quad h5{margin:0 0 7px; font-family:var(--mono); font-size:11px; letter-spacing:.03em; color:var(--accent-ink)}
.quad ul{margin:0; padding-left:16px; font-size:13px; line-height:1.5}
.quad li{margin:.35em 0}
.quad li em{color:var(--muted); font-style:italic}

/* ---- Doc pages (schools / synthesis) ---- */
.doc-page{max-width:100%}
.section-head h1{font-family:var(--serif); font-weight:600; font-size:clamp(28px,4.4vw,42px); letter-spacing:-.02em; margin:.12em 0 0}
.section-eyebrow{font-family:var(--mono); font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:var(--accent-ink)}
.prose{max-width:74ch}
.prose p{margin:0 0 14px}
.prose ul,.prose ol{padding-left:20px}
.prose blockquote{margin:16px 0; padding:14px 18px; border-left:3px solid var(--accent); background:var(--surface);
  border-radius:0 12px 12px 0; font-family:var(--serif); font-style:italic}
.school-grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(290px,1fr)); gap:18px; margin-top:6px}
.school{background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:22px; box-shadow:var(--shadow)}
.school h3{font-family:var(--serif); font-size:20px; margin:0 0 4px; letter-spacing:-.01em}
.school-note{font-family:var(--mono); font-size:11px; letter-spacing:.03em; text-transform:uppercase; color:var(--accent-ink); display:block; margin-bottom:12px}
.school ul{margin:0; padding-left:18px; font-size:14px}
.school li{margin:.35em 0}
.school li::marker{color:var(--accent)}
.table-wrap{overflow-x:auto; margin:14px 0}
.prose table{border-collapse:collapse; width:100%; font-size:13.5px}
.prose td{border:1px solid var(--line); padding:8px 11px; vertical-align:top}
.prose tr:first-child td{background:var(--surface-2); font-weight:600}

.no-results{display:none; text-align:center; color:var(--muted); padding:30px 0; font-family:var(--mono); font-size:13px}
.no-results.show{display:block}

footer{padding:34px 0 60px; color:var(--muted); font-size:13px; text-align:center; border-top:1px solid var(--line)}
footer .mono-note{font-family:var(--mono); font-size:11px; letter-spacing:.04em}
"""

JS = r"""
(function(){
  var root=document.documentElement;
  var btn=document.getElementById('theme-toggle');
  function setLabel(){
    var dark = root.getAttribute('data-theme')==='dark' ||
      (!root.getAttribute('data-theme') && matchMedia('(prefers-color-scheme:dark)').matches);
    btn.textContent = dark ? '☀' : '☾';
  }
  btn.addEventListener('click', function(){
    var cur=root.getAttribute('data-theme');
    var dark = cur ? cur==='dark' : matchMedia('(prefers-color-scheme:dark)').matches;
    root.setAttribute('data-theme', dark ? 'light':'dark'); setLabel();
  });
  setLabel();

  // ---- Hash router ----
  var views=[].slice.call(document.querySelectorAll('.view'));
  var home=document.getElementById('home');
  function route(){
    var id=(location.hash||'').replace(/^#/,'') || 'home';
    var target=document.getElementById(id);
    if(!target || views.indexOf(target)<0) target=home;
    views.forEach(function(v){ v.hidden = (v!==target); });
    document.body.classList.toggle('is-detail', target!==home);
    window.scrollTo(0,0);
  }
  window.addEventListener('hashchange', route);
  route();

  // ---- Filter + search (home only) ----
  var cards=[].slice.call(document.querySelectorAll('.card'));
  var groups=[].slice.call(document.querySelectorAll('#home .group[data-group]'));
  var pills=[].slice.call(document.querySelectorAll('.pill'));
  var search=document.getElementById('search-input');
  var noResults=document.getElementById('no-results');
  var filter='all', query='';
  function apply(){
    var any=false;
    cards.forEach(function(c){
      var okG = filter==='all' || c.getAttribute('data-group')===filter;
      var okQ = !query || c.getAttribute('data-name').indexOf(query)>-1;
      var show = okG && okQ;
      c.classList.toggle('is-hidden', !show);
      if(show) any=true;
    });
    groups.forEach(function(g){
      var vis=g.querySelectorAll('.card:not(.is-hidden)').length;
      g.style.display = vis? '':'none';
    });
    noResults.classList.toggle('show', !any);
  }
  pills.forEach(function(pill){
    pill.addEventListener('click', function(){
      pills.forEach(function(x){x.classList.remove('is-active')});
      pill.classList.add('is-active');
      filter=pill.getAttribute('data-filter'); apply();
    });
  });
  if(search){ search.addEventListener('input', function(){ query=search.value.trim().toLowerCase(); apply(); }); }
})();
"""

PAGE_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..500&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>{css}</style>
</head>
<body>
<div class="topbar">
  <div class="topbar-inner">
    <a class="brand" href="#home"><span class="dot"></span>Persona Board</a>
    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">&#9790;</button>
  </div>
</div>

<main class="wrap">
  {home}
  {pages}
</main>

<footer class="wrap">
  <p>Innovation &amp; AI Program · Santander Open Academy · Group 4</p>
  <p class="mono-note">Proto-personas — assumption-based. Every claim is a hypothesis to validate in customer discovery.</p>
</footer>

<script>{js}</script>
</body>
</html>
"""


def main():
    args = sys.argv[1:]
    in_path = args[0] if len(args) > 0 else os.path.join(HERE, "..", "personas.md")
    out_path = args[1] if len(args) > 1 else os.path.join(HERE, "..", "personas.html")
    in_path = os.path.abspath(in_path)
    out_path = os.path.abspath(out_path)
    with open(in_path, "r", encoding="utf-8") as f:
        md_text = f.read()
    page = build_page(md_text)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(page)
    print("Wrote %s (%d bytes)" % (out_path, len(page)))


if __name__ == "__main__":
    main()
