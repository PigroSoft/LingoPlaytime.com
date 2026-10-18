#!/usr/bin/env python3
"""Make one page per game, so every game has its own address: lingoplaytime.com/<slug>/.

Each page is a copy of index.html with that game's title, description and links in the head;
the page's own script sees the path and opens the game. Run this after any change to index.html:

    python3 tools/game-pages.py

It rewrites the game folders and the game entries in sitemap.xml.
"""
import html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://lingoplaytime.com"
src = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()

slugs = json.loads(re.sub(r"(\w+):", r'"\1":', re.search(r"const SLUG=(\{.*?\});", src).group(1)))
games = {m.group(1): (m.group(2), m.group(3)) for m in
         re.finditer(r'\{id:"(\w+)",name:"((?:[^"\\]|\\.)*)",blurb:"((?:[^"\\]|\\.)*)"', src)}

def sub(pattern, value, text):
    out, n = re.subn(pattern, lambda m: m.group(1) + value + m.group(2), text, count=1)
    assert n == 1, pattern
    return out

for gid, slug in slugs.items():
    name, blurb = games[gid]
    title = html.escape(f"{name}: a free language game for toddlers | LingoPlaytime", quote=True)
    desc = html.escape(f"{blurb} Plays in up to four languages, with your child's name. Free, no ads, no account.", quote=True)
    url = f"{SITE}/{slug}/"
    page = src
    page = sub(r"(<title>).*?(</title>)", title, page)
    page = sub(r'(<meta name="description" content=")[^"]*(")', desc, page)
    page = sub(r'(<link rel="canonical" href=")[^"]*(")', url, page)
    page = sub(r'(<meta property="og:title" content=")[^"]*(")', title, page)
    page = sub(r'(<meta property="og:description" content=")[^"]*(")', desc, page)
    page = sub(r'(<meta property="og:url" content=")[^"]*(")', url, page)
    page = page.replace("<head>", "<head>\n<!-- made by tools/game-pages.py from index.html; edit index.html, not this file -->", 1) if "<head>" in page \
        else "<!-- made by tools/game-pages.py from index.html; edit index.html, not this file -->\n" + page
    os.makedirs(os.path.join(ROOT, slug), exist_ok=True)
    open(os.path.join(ROOT, slug, "index.html"), "w", encoding="utf-8").write(page)

# sitemap: replace the game block
sm_path = os.path.join(ROOT, "sitemap.xml")
sm = open(sm_path, encoding="utf-8").read()
sm = re.sub(r"<!-- games -->.*?<!-- /games -->\n?", "", sm, flags=re.S)
block = "<!-- games -->\n" + "".join(
    f"<url><loc>{SITE}/{s}/</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>\n" for s in slugs.values()
) + "<!-- /games -->\n"
sm = sm.replace("</urlset>", block + "</urlset>")
open(sm_path, "w", encoding="utf-8").write(sm)
print(f"wrote {len(slugs)} game pages")
