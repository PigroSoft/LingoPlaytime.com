/* LingoPlaytime learning memory: shared by every game and the site.
   Remembers, on this device only, which words the child has met and how they answered when asked.
   Games use it to pick words that still need practice and to skip ones that are solid.
   Concept ids are the English noun without an article ("apple", "dog"), so a word met in the farm
   counts in the sky game too. Stored under lingoplaytime.words.v1 and wiped with "Forget everything". */
(function () {
  var KEY = "lingoplaytime.words.v1", db = null, timer = 0;
  function load() {
    if (db) return db;
    try { db = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { db = {}; }
    return db;
  }
  function save() {
    clearTimeout(timer);
    timer = setTimeout(function () { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} }, 400);
  }
  function id(c) { return String(c || "").toLowerCase().replace(/^(the|a|an)\s+/, "").trim(); }
  function lg(l) { return String(l || window.LP_LANG || "en").slice(0, 2); }
  function rec(c, l, make) {
    var d = load(), L = d[lg(l)] || (make ? (d[lg(l)] = {}) : null);
    if (!L) return null;
    return L[id(c)] || (make ? (L[id(c)] = [0, 0, 0, 0]) : null); // heard, asked, right, last seen
  }
  var recent = {}; // session only: stops the same word coming round twice in a minute

  var LPLearn = {
    id: id,
    /* the child heard this word (tapped it, was told it) */
    heard: function (c, l) { var r = rec(c, l, 1); r[0]++; r[3] = Date.now(); recent[lg(l) + id(c)] = Date.now(); save(); },
    /* the child was asked for this word and answered right or wrong */
    asked: function (c, l, ok) { var r = rec(c, l, 1); r[1]++; if (ok) r[2]++; r[3] = Date.now(); recent[lg(l) + id(c)] = Date.now(); save(); },
    /* 0 new, 1 met, 2 shaky, 3 solid */
    level: function (c, l) {
      var r = rec(c, l, 0); if (!r || (r[0] + r[1]) === 0) return 0;
      if (r[1] >= 3 && r[2] / r[1] >= 0.8) return 3;
      if (r[1] >= 2 && r[2] / r[1] < 0.6) return 2;
      return 1;
    },
    /* how much a word deserves to come up next: new and shaky words first, solid ones rarely */
    weight: function (c, l) {
      var w = [3, 1.6, 2.6, 0.35][LPLearn.level(c, l)];
      var t = recent[lg(l) + id(c)];
      if (t && Date.now() - t < 60000) w *= 0.25;
      return w;
    },
    /* choose n of items by weight, without repeats. key(item) gives the concept id. */
    pick: function (items, key, n, l) {
      var pool = items.map(function (it) { return { it: it, w: LPLearn.weight(key(it), l) * (0.6 + Math.random() * 0.8) }; });
      var out = [];
      while (out.length < n && pool.length) {
        var tot = pool.reduce(function (s, x) { return s + x.w; }, 0), r = Math.random() * tot, i = 0;
        for (; i < pool.length - 1; i++) { r -= pool[i].w; if (r <= 0) break; }
        out.push(pool.splice(i, 1)[0].it);
      }
      return out;
    },
    /* how many words are met and solid in a language, for the parent's summary */
    summary: function (l) {
      var L = load()[lg(l)] || {}, met = 0, solid = 0;
      Object.keys(L).forEach(function (c) { var v = LPLearn.level(c, l); if (v > 0) met++; if (v === 3) solid++; });
      return { met: met, solid: solid };
    },
    langs: function () { return Object.keys(load()); },
    wipe: function () { db = {}; try { localStorage.removeItem(KEY); } catch (e) {} }
  };
  window.LPLearn = LPLearn;
})();
