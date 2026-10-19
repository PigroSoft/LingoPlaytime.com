"""Writes the big cardboard footer into every static page (blog, 404, legal notice).
The home page and the game pages are built from index.html, which carries its own copy.
Run from the repo root: python3 tools/footers.py"""
import re, pathlib, html
LABELS = {  # games, blog, app, privacy, legal notice, privacy policy, tagline, no ads, educator, questions, support
 "en": ("Games","Blog","iPad app","Privacy","Legal notice","Privacy policy","Little games, lots of languages","No ads, no accounts","By a parent and educator","Questions or problems?","Get support from Pigrosoft"),
 "de": ("Spiele","Blog","iPad-App","Datenschutz","Impressum","Datenschutzerklärung","Kleine Spiele, viele Sprachen","Keine Werbung, keine Konten","Von einem Vater und Pädagogen","Fragen oder Probleme?","Hilfe von Pigrosoft"),
 "es": ("Juegos","Blog","App para iPad","Privacidad","Aviso legal","Política de privacidad","Juegos pequeños, muchos idiomas","Sin anuncios, sin cuentas","Hecho por un padre y educador","¿Preguntas o problemas?","Ayuda de Pigrosoft"),
 "fr": ("Jeux","Blog","App iPad","Confidentialité","Mentions légales","Politique de confidentialité","Petits jeux, plein de langues","Sans pub, sans compte","Par un parent et éducateur","Des questions ou un problème ?","Aide de Pigrosoft"),
 "it": ("Giochi","Blog","App per iPad","Privacy","Note legali","Informativa sulla privacy","Piccoli giochi, tante lingue","Niente pubblicità, niente account","Da un genitore ed educatore","Domande o problemi?","Assistenza da Pigrosoft"),
 "pt": ("Jogos","Blog","App para iPad","Privacidade","Aviso legal","Política de privacidade","Pequenos jogos, muitas línguas","Sem anúncios, sem contas","Feito por um pai e educador","Dúvidas ou problemas?","Ajuda da Pigrosoft"),
}
def footer(lang):
    L = LABELS[lang]; p = "" if lang == "en" else "/" + lang
    return (f'<footer><div class="bf"><img class="bf-logo" src="/felt/logo.webp" alt="LingoPlaytime" width="200" height="46">'
      f'<div class="bf-nav"><a href="/">{L[0]}</a><a href="{p}/blog/">{L[1]}</a><a href="/#app">{L[2]}</a><a href="/#privacy">{L[3]}</a></div>'
      f'<p class="bf-tag">{L[6]}<span class="sep"> · </span>{L[7]}</p><p>{L[8]}</p>'
      f'<p>{L[9]} <a href="https://pigrosoft.com" target="_blank" rel="noopener">{L[10]}</a></p>'
      f'<p class="bf-legal"><a href="/impressum.html">{L[4]}</a><span class="sep"> · </span><a href="/#privacy">{L[5]}</a></p></div></footer>')
root = pathlib.Path(".")
n = 0
for f in root.rglob("*.html"):
    parts = f.parts
    if parts[0] in ("games", "tools", "node_modules") or f.name == "index.html" and len(parts) == 1:
        continue
    txt = f.read_text(encoding="utf-8")
    if "<footer>" not in txt and f.name != "impressum.html":
        continue
    lang = parts[0] if parts[0] in LABELS and len(parts) > 1 else "en"
    if f.name == "impressum.html":
        txt = re.sub(r"<footer.*?</footer>", "", txt, flags=re.S)
        txt = txt.replace("</main>\n</body>", "</main>\n<div style=\"max-width:960px;margin:0 auto;padding:0 16px\">" + footer("en") + "</div>\n</body>")
    else:
        new = re.sub(r"<footer>.*?</footer>", lambda m: footer(lang), txt, flags=re.S)
        # folder pages (game pages) are copies of index.html and are rebuilt by game-pages.py
        if new == txt: continue
        txt = new
    f.write_text(txt, encoding="utf-8"); n += 1
print("footers written:", n)
