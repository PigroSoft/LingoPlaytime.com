/* LingoPlaytime voice picker, shared by the site and every game.
   Browsers offer dozens of voices per language, and many are joke or robot voices
   (macOS ships "Grandpa", "Bubbles", "Zarvox"...). Picking the first match is how
   German ends up sounding wrong. This ranks real voices and never lets a voice
   from another language read the words. */
(function () {
  // Novelty voices and Apple's low-fidelity "Eloquence" voices: never use these.
  var BAD = /\b(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|ralph|fred|kathy|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|deranged|hysterical|pipe organ)\b/i;
  // Signs of a higher-quality voice.
  var GOOD = /(premium|enhanced|natural|neural|siri|online)/i;
  // Known solid default voices per language, used to break ties.
  var KNOWN = {
    de: /anna|petra|helena|markus|yannick|katja|conrad|hedda|stefan/i,
    en: /samantha|daniel|karen|serena|kate|moira|aria|jenny|guy|libby|sonia/i,
    it: /alice|federica|paola|luca|elsa|isabella|diego/i,
    es: /m[oó]nica|jorge|paulina|marisol|elvira|alvaro|helena/i,
    fr: /am[eé]lie|thomas|audrey|aurelie|denise|henri|julie/i,
    pt: /luciana|joana|catarina|francisca|raquel|duarte/i
  };

  function norm(v) { return (v.lang || "").replace("_", "-").toLowerCase(); }
  function all() { try { return window.speechSynthesis ? speechSynthesis.getVoices() : []; } catch (e) { return []; } }

  function score(v, code) {
    var two = code.slice(0, 2), s = 0;
    if (BAD.test(v.name)) return -1;
    if (norm(v) === code.toLowerCase()) s += 4;
    if (GOOD.test(v.name)) s += 6;
    if (KNOWN[two] && KNOWN[two].test(v.name)) s += 3;
    if (v.localService) s += 1;
    return s;
  }

  // Voices for one language, best first. Junk voices are dropped.
  function list(code) {
    var two = code.slice(0, 2).toLowerCase();
    return all()
      .filter(function (v) { return norm(v).slice(0, 2) === two; })
      .map(function (v) { return { v: v, s: score(v, code) }; })
      .filter(function (x) { return x.s >= 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .map(function (x) { return x.v; });
  }

  function best(code, preferredName) {
    var vs = list(code);
    if (preferredName) for (var i = 0; i < vs.length; i++) if (vs[i].name === preferredName) return vs[i];
    return vs[0] || null;
  }

  // Voices arrive a moment after the page loads; wait for them (at most a second).
  function ready(cb) {
    var done = false;
    function go() { if (!done) { done = true; cb(); } }
    if (all().length) return go();
    try { speechSynthesis.addEventListener("voiceschanged", go, { once: true }); } catch (e) {}
    setTimeout(go, 1000);
  }

  var TAGS = { en: "en-GB", de: "de-DE", es: "es-ES", fr: "fr-FR", it: "it-IT", pt: "pt-PT", nl: "nl-NL", pl: "pl-PL", sv: "sv-SE", el: "el-GR", zh: "zh-CN", ar: "ar-SA", ja: "ja-JP", ko: "ko-KR", ru: "ru-RU", tr: "tr-TR", hi: "hi-IN" };

  // Lookup key for recorded clips: the child's name is taken out (it is never recorded),
  // leftover commas tidied, case ignored. tools/render.py uses the same rules.
  function key(t, name) {
    t = String(t || "");
    if (name) t = t.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "");
    t = t.replace(/\s*,\s*(?=[!?.]|$)/g, "").replace(/^\s*,\s*/, "").replace(/\s+/g, " ").trim();
    return t.toLowerCase();
  }

  window.LPVoice = { list: list, best: best, ready: ready, key: key, tag: function (c) { return TAGS[c] || c; } };
})();
