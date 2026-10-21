// Collects every phrase the DATA-based games can say in one language, plus the shared "not quite" line.
// Usage: node tools/phrases.js <lang> > phrases.<lang>.json
const fs = require("fs"), path = require("path");
const LANG = process.argv[2] || "de";
const DIR = path.join(__dirname, "..", "games");
function grab(src, name) {
  const start = src.search(new RegExp("const " + name + "\\s*=")); if (start < 0) throw new Error("missing " + name);
  let i = src.indexOf("=", start) + 1, depth = 0, inStr = null;
  for (; i < src.length; i++) { const c = src[i];
    if (inStr) { if (c === "\\") { i++; continue; } if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if ("{[(".includes(c)) depth++; else if ("}])".includes(c)) depth--;
    else if ((c === ";" || c === "\n") && depth === 0) break; }
  return Function("return (" + src.slice(src.indexOf("=", start) + 1, i) + ");")();
}
const read = g => fs.readFileSync(path.join(DIR, g + ".html"), "utf8");
const out = {}, add = (g, t) => { if (t) (out[g] = out[g] || new Set()).add(t); };
const NQ = grab(fs.readFileSync(path.join(DIR, "kit.js"), "utf8").replace(/^[\s\S]*?(?=var NQ)/, "").replace("var NQ", "const NQ"), "NQ");
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith(".html"))) {
  const game = f.replace(".html", ""), s = read(game);
  if (!/const DATA\s*=/.test(s)) continue;
  const D = grab(s, "DATA");
  const base = w => typeof w[LANG] === "string" ? w[LANG] : (w[LANG] && w[LANG].w);
  for (const w of D.words) { const v = w[LANG]; if (!v) continue;
    if (typeof v === "string") add(game, v); else Object.values(v).forEach(t => add(game, t)); }
  const lines = (D.lines || {})[LANG] || {};
  for (const t of Object.values(lines)) {
    if (t.includes("{w}")) D.words.forEach(w => base(w) && add(game, t.replace("{w}", base(w)))); else add(game, t); }
  if (/notQuite/.test(s)) add(game, NQ[LANG]);
}
const res = {}; for (const k in out) res[k] = [...out[k]];
process.stdout.write(JSON.stringify({ lang: LANG, name: "Zzname", games: res }, null, 1));
