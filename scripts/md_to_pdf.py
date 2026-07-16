#!/usr/bin/env python3
"""Deterministically convert personas.md into a card-style PDF (persona board layout).

Usage:
    python3 md_to_pdf.py [input.md] [output.pdf]

Defaults: input = personas.md next to this script, output = personas.pdf.

Parses the persona structure of the markdown (# GROUP sections, ## persona headings,
### subsections) and renders each persona as a card — monogram, archetype eyebrow,
goals/frustrations, quote, chips — matching the HTML persona board. Intro and
synthesis sections are rendered as regular styled pages.

No third-party Python packages required. Rendering uses headless Google Chrome
(standard macOS path, or set the CHROME env var). Same input → same layout.
"""

import html
import os
import re
import subprocess
import sys
import tempfile

CHROME_CANDIDATES = [
    os.environ.get("CHROME", ""),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
]

GROUP_COLORS = [
    ("#2F6B5F", "#E4EFEC"),  # teachers — chalkboard green
    ("#A96F16", "#F6EDDD"),  # students — marigold
    ("#7C4460", "#F1E6EC"),  # directors — plum
]

CSS = """
@page { size: A4 landscape; margin: 8mm 9mm; }
* { box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  color: #232928; font-size: 8.1px; line-height: 1.38; margin: 0;
}
.serif { font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif; }
.page { break-before: page; }
.page:first-child { break-before: auto; }

/* ---- intro / synthesis prose ---- */
.prose h1 { font-size: 26px; margin: 10px 0 12px; max-width: 30ch; }
.prose h2 { font-size: 18px; margin: 14px 0 10px; }
.prose h3 { font-size: 12px; margin: 12px 0 6px; }
.prose p { margin: 0 0 8px; max-width: 78ch; }
.prose ul, .prose ol { margin: 0 0 8px; padding-left: 16px; max-width: 76ch; }
.prose li { margin-bottom: 3px; }
.prose blockquote { margin: 0 0 10px; padding: 8px 12px; background: #F1F4F0; border-radius: 6px; font-style: italic; }
.prose blockquote p { margin: 0; }
.prose table { border-collapse: collapse; margin: 0 0 10px; break-inside: avoid; }
.prose th { text-align: left; font-size: 7.5px; letter-spacing: 0.08em; text-transform: uppercase; color: #5D6866; }
.prose th, .prose td { padding: 4px 12px 4px 0; border-bottom: 0.5px solid #C9CFC7; vertical-align: top; }
.prose hr { border: none; border-top: 0.5px solid #C9CFC7; margin: 12px 0; }
.eyebrow-line { font-size: 8px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #5D6866; margin-bottom: 6px; }

/* ---- group header ---- */
.group-head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 10px; }
.group-head h2 { font-size: 19px; margin: 0; }
.group-head .sub { font-size: 9px; color: #5D6866; }

/* ---- cards ---- */
.cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.card {
  background: #FFFFFF; border: 0.7px solid #C9CFC7; border-radius: 8px;
  padding: 11px 12px 9px; break-inside: avoid;
  display: flex; flex-direction: column; gap: 7px;
}
.group-head .cont { font-size: 8px; color: #5D6866; font-style: italic; }
.id { display: flex; gap: 10px; align-items: flex-start; }
.monogram {
  flex: none; width: 34px; height: 34px; border-radius: 50%;
  display: grid; place-items: center; font-size: 15px; font-weight: 600;
}
.eyebrow { font-size: 7.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
.id h3 { font-size: 14px; font-weight: 600; margin: 0; line-height: 1.15; }

.snapshot { display: grid; grid-template-columns: max-content 1fr; gap: 1px 10px; font-size: 8.6px; }
.snapshot .k { color: #5D6866; font-weight: 600; }

.sec h4 {
  font-size: 7.5px; font-weight: 700; letter-spacing: 0.09em;
  text-transform: uppercase; color: #5D6866; margin: 0 0 3px;
}
.sec.frust h4 { color: #9C3B2E; }
.sec ul, .sec ol { margin: 0; padding-left: 14px; }
.sec li { margin-bottom: 2px; }
.sec p { margin: 0; }

.quote {
  margin: 0; padding: 7px 10px; background: #F1F4F0; border-radius: 6px;
  font-style: italic; font-size: 9.3px; line-height: 1.4;
}
.quote::before { content: "\\201C"; }
.quote::after { content: "\\201D"; }

/* ---- empathy map pages ---- */
.em-head { display: flex; gap: 10px; align-items: center; margin-bottom: 8px; }
.em-head h2 { font-size: 16px; margin: 0; }
.em-head .sub { font-size: 8.5px; color: #5D6866; }
.em-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  grid-template-rows: 1.15fr 1.15fr 1fr; gap: 8px; height: 176mm;
}
.em-panel {
  border: 0.7px solid #C9CFC7; border-radius: 8px; background: #FFFFFF;
  padding: 8px 11px; break-inside: avoid;
}
.em-panel h4 {
  font-size: 8.5px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: #5D6866; margin: 0 0 4px;
}
.em-panel ul { margin: 0; padding-left: 14px; }
.em-panel li { margin-bottom: 3px; font-size: 8.4px; line-height: 1.42; }
.em-panel.pain { background: #FBF0EE; border-color: #DBA89E; }
.em-panel.pain h4 { color: #9C3B2E; }
.em-panel.gain { background: #EEF5EB; border-color: #ABC99C; }
.em-panel.gain h4 { color: #3E6B2F; }
"""


# ---------- generic markdown (for intro & synthesis sections) ----------

INLINE_RULES = [
    (re.compile(r"\*\*(.+?)\*\*"), r"<strong>\1</strong>"),
    (re.compile(r"(?<!\*)\*([^*]+)\*(?!\*)"), r"<em>\1</em>"),
    (re.compile(r"`([^`]+)`"), r"<code>\1</code>"),
    (re.compile(r"\[([^\]]+)\]\(([^)]+)\)"), r'<a href="\2">\1</a>'),
]


def inline(text):
    out = html.escape(text, quote=False)
    for rx, repl in INLINE_RULES:
        out = rx.sub(repl, out)
    return out


def md_to_html(md):
    lines = md.splitlines()
    out, i, n = [], 0, len(lines)
    while i < n:
        s = lines[i].strip()
        if not s:
            i += 1
            continue
        m = re.match(r"^(#{1,4})\s+(.*)$", s)
        if m:
            lvl = len(m.group(1))
            cls = ' class="serif"' if lvl <= 3 else ""
            out.append(f"<h{lvl}{cls}>{inline(m.group(2))}</h{lvl}>")
            i += 1
            continue
        if re.match(r"^(-{3,}|\*{3,}|_{3,})$", s):
            out.append("<hr>")
            i += 1
            continue
        if s.startswith(">"):
            q = []
            while i < n and lines[i].strip().startswith(">"):
                q.append(lines[i].strip().lstrip(">").strip())
                i += 1
            out.append(f"<blockquote><p>{inline(' '.join(q))}</p></blockquote>")
            continue
        if s.startswith("|"):
            rows = []
            while i < n and lines[i].strip().startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")])
                i += 1
            body = [r for r in rows if not all(re.match(r"^:?-+:?$", c) for c in r if c)]
            has_header = len(body) < len(rows)
            parts = ["<table>"]
            for idx, r in enumerate(body):
                tag = "th" if (has_header and idx == 0) else "td"
                parts.append("<tr>" + "".join(f"<{tag}>{inline(c)}</{tag}>" for c in r) + "</tr>")
            parts.append("</table>")
            out.append("".join(parts))
            continue
        m = re.match(r"^([-*+]|\d+\.)\s+(.*)$", s)
        if m:
            ordered = m.group(1)[0].isdigit()
            items = []
            while i < n:
                t = lines[i].strip()
                m2 = re.match(r"^([-*+]|\d+\.)\s+(.*)$", t)
                if m2 and m2.group(1)[0].isdigit() == ordered:
                    items.append(inline(m2.group(2)))
                    i += 1
                elif t and not re.match(r"^([-*+]|\d+\.)\s+", t) and items and lines[i].startswith(("  ", "\t")):
                    items[-1] += " " + inline(t)
                    i += 1
                else:
                    break
            tag = "ol" if ordered else "ul"
            out.append(f"<{tag}>" + "".join(f"<li>{x}</li>" for x in items) + f"</{tag}>")
            continue
        para = []
        while i < n and lines[i].strip() and not re.match(r"^(#{1,4}\s|>|\||[-*+]\s|\d+\.\s|-{3,}$)", lines[i].strip()):
            para.append(lines[i].strip())
            i += 1
        out.append(f"<p>{inline(' '.join(para))}</p>")
    return "\n".join(out)


# ---------- structural parsing of personas.md ----------

def split_on_headings(md, level):
    """Split markdown into (heading, body) pairs at the given heading level.
    Returns (preamble, [(heading, body), ...])."""
    marker = "#" * level + " "
    parts, current_head, buf, preamble = [], None, [], []
    for line in md.splitlines():
        if line.startswith(marker):
            if current_head is None:
                preamble = buf
            else:
                parts.append((current_head, "\n".join(buf)))
            current_head = line[len(marker):].strip()
            buf = []
        else:
            buf.append(line)
    if current_head is None:
        preamble = buf
    else:
        parts.append((current_head, "\n".join(buf)))
    return "\n".join(preamble), parts


def parse_persona(heading, body):
    m = re.match(r'^(.*?)\s+\d+\s+—\s+[«"“]?(.+?)[»"”]?\s+·\s+(.+)$', heading)
    if m:
        kind, name, archetype = m.group(1), m.group(2), m.group(3)
    else:
        kind, name, archetype = "", heading, ""
    _, subs = split_on_headings(body, 3)
    sections = {}
    for h, b in subs:
        lines = [l for l in b.splitlines() if not re.match(r"^-{3,}$", l.strip())]
        sections[h.lower()] = "\n".join(lines).strip()
    return {"kind": kind, "name": name, "archetype": archetype, "sections": sections}


def snapshot_html(md_table):
    rows = []
    for line in md_table.splitlines():
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if all(re.match(r"^:?-+:?$", c) for c in cells if c):
            continue
        if len(cells) >= 2 and (cells[0] or cells[1]):
            rows.append(cells[:2])
    cells_html = "".join(
        f'<div class="k">{inline(k)}</div><div>{inline(v)}</div>' for k, v in rows if k
    )
    return f'<div class="snapshot">{cells_html}</div>'


def find_section(sections, *keywords):
    for key, val in sections.items():
        if any(kw in key for kw in keywords):
            return val
    return ""


def card_html(persona, color, tint):
    s = persona["sections"]
    name = html.escape(persona["name"])
    monogram = html.escape(persona["name"].split()[-1][0] if persona["name"] else "?")
    eyebrow = html.escape(f'{persona["kind"]} · {persona["archetype"]}'.strip(" ·"))

    parts = [f'<article class="card">']
    parts.append(
        f'<div class="id"><div class="monogram" style="background:{tint};color:{color}">{monogram}</div>'
        f'<div><div class="eyebrow" style="color:{color}">{eyebrow}</div>'
        f'<h3 class="serif">{name}</h3></div></div>'
    )

    snap = find_section(s, "snapshot")
    if snap:
        parts.append(snapshot_html(snap))

    def sec(title, content, cls="", as_is=False):
        if not content:
            return
        body = content if as_is else md_to_html(content)
        parts.append(f'<div class="sec {cls}"><h4>{title}</h4>{body}</div>')

    sec("Context", find_section(s, "context"))
    sec("Goals", find_section(s, "goals"))
    sec("Frustrations", find_section(s, "frustration", "pains"), cls="frust")
    sec("Current behavior / workarounds", find_section(s, "behavior", "beliefs"))
    sec("Tech &amp; influence", find_section(s, "tech stack", "buying"))

    quote = find_section(s, "quote")
    if quote:
        text = " ".join(l.lstrip("> ").strip() for l in quote.splitlines() if l.strip())
        text = text.strip('"“”')
        parts.append(f'<blockquote class="quote">{inline(text)}</blockquote>')

    sec("Assumptions to validate", find_section(s, "assumption"))
    parts.append("</article>")
    return "".join(parts)


EM_PANEL_ORDER = [
    ("think", "🧠 What do they think &amp; feel?", ""),
    ("hear", "👂 What do they hear?", ""),
    ("see", "👀 What do they see?", ""),
    ("say", "🗣️ What do they say &amp; do?", ""),
    ("pain", "🛑 Pain", "pain"),
    ("gain", "🏆 Gain", "gain"),
]


def parse_empathy_blocks(em_md):
    """Split the '### Empathy Map' body into blocks keyed by their bold headers."""
    blocks, current, buf = {}, None, []
    for line in em_md.splitlines():
        s = line.strip()
        m = re.match(r"^\*\*(.+?)\*\*$", s)
        if m:
            if current is not None:
                blocks[current] = "\n".join(buf).strip()
            current, buf = m.group(1).lower(), []
        elif current is not None:
            buf.append(line)
    if current is not None:
        blocks[current] = "\n".join(buf).strip()
    return blocks


def empathy_page_html(persona, em_md, color, tint):
    blocks = parse_empathy_blocks(em_md)
    name = html.escape(persona["name"])
    monogram = html.escape(persona["name"].split()[-1][0] if persona["name"] else "?")
    eyebrow = html.escape(f'{persona["kind"]} · {persona["archetype"]}'.strip(" ·"))
    panels = []
    for key, title, cls in EM_PANEL_ORDER:
        body = next((v for k, v in blocks.items() if key in k), "")
        if body:
            panels.append(f'<div class="em-panel {cls}"><h4>{title}</h4>{md_to_html(body)}</div>')
    head = (
        f'<div class="em-head"><div class="monogram" style="background:{tint};color:{color}">{monogram}</div>'
        f'<div><div class="eyebrow" style="color:{color}">{eyebrow} · Empathy Map</div>'
        f'<h2 class="serif">{name}</h2></div></div>'
    )
    return f'<section class="page">{head}<div class="em-grid">{"".join(panels)}</div></section>'


def build_document(md):
    preamble, h1_sections = split_on_headings(md, 1)
    pages = []

    # intro: preamble plus any leading h1s that are not groups/synthesis
    intro_md, groups, synthesis = preamble, [], []
    for head, body in h1_sections:
        upper = head.upper()
        if upper.startswith("GROUP"):
            groups.append((head, body))
        elif "SYNTHESIS" in upper:
            synthesis.append((head, body))
        elif not groups and not synthesis:
            intro_md += f"\n# {head}\n{body}"
        else:
            synthesis.append((head, body))

    pages.append(f'<section class="page prose">{md_to_html(intro_md)}</section>')

    for gi, (head, body) in enumerate(groups):
        color, tint = GROUP_COLORS[gi % len(GROUP_COLORS)]
        group_pre, personas_raw = split_on_headings(body, 2)
        m = re.match(r"^GROUP\s*\d*\s*—?\s*(.*?)\s*(?:\((.*)\))?$", head, re.I)
        title = (m.group(1) if m else head).title()
        sub = m.group(2) if m and m.group(2) else ""
        intro_note = " ".join(
            l.strip() for l in group_pre.splitlines() if l.strip() and not l.strip().startswith("-")
        )
        personas = [
            parse_persona(h, b)
            for h, b in personas_raw
            if "interlock" not in h.lower()
        ]
        cards = [card_html(p, color, tint) for p in personas]
        # two cards per page, each pair followed by its empathy-map pages
        for pi in range(0, len(cards), 2):
            cont = '<span class="cont">continued</span>' if pi else ""
            header = (
                f'<div class="group-head"><h2 class="serif" style="color:{color}">{html.escape(title)}</h2>'
                f'<span class="sub">{html.escape(sub)}</span>{cont}</div>'
            )
            pair = "".join(cards[pi:pi + 2])
            pages.append(f'<section class="page">{header}<div class="cards">{pair}</div></section>')
            for p in personas[pi:pi + 2]:
                em = find_section(p["sections"], "empathy")
                if em:
                    pages.append(empathy_page_html(p, em, color, tint))
        # any trailing non-persona h2 (e.g. old interlock notes) is appended as prose
        extras = [(h, b) for h, b in personas_raw if "interlock" in h.lower()]
        for h, b in extras:
            pages.append(f'<section class="page prose"><h2 class="serif">{inline(h)}</h2>{md_to_html(b)}</section>')

    for head, body in synthesis:
        _, subs = split_on_headings(body, 2)
        pre, _ = split_on_headings(body, 2)
        first = f'<section class="page prose"><h1 class="serif">{inline(head.title())}</h1>{md_to_html(pre)}'
        if subs:
            first += f'<h2 class="serif">{inline(subs[0][0])}</h2>{md_to_html(subs[0][1])}'
        first += "</section>"
        pages.append(first)
        for h, b in subs[1:]:
            pages.append(f'<section class="page prose"><h2 class="serif">{inline(h)}</h2>{md_to_html(b)}</section>')

    return "".join(pages)


def find_chrome():
    for path in CHROME_CANDIDATES:
        if path and os.path.exists(path):
            return path
    sys.exit("Chrome not found. Install Google Chrome or set the CHROME env var to its binary.")


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, "personas.md")
    dst = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(src)[0] + ".pdf"

    with open(src, encoding="utf-8") as f:
        md = f.read()

    title = html.escape(os.path.splitext(os.path.basename(src))[0])
    doc = (
        "<!doctype html><html><head><meta charset='utf-8'>"
        f"<title>{title}</title><style>{CSS}</style></head><body>"
        + build_document(md)
        + "</body></html>"
    )

    with tempfile.TemporaryDirectory() as tmp:
        html_path = os.path.join(tmp, "doc.html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(doc)
        subprocess.run(
            [find_chrome(), "--headless", "--disable-gpu", "--no-pdf-header-footer",
             f"--print-to-pdf={os.path.abspath(dst)}", f"file://{html_path}"],
            check=True, capture_output=True,
        )
    print(f"Wrote {dst}")


if __name__ == "__main__":
    main()
