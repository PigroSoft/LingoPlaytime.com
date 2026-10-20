/* LingoPlaytime game kit, for games built for the site.
   Load after bridge.js. Gives a game: the language and age from the settings bar,
   speech (recordings first, via the bridge), real and synthesized sounds, a tap-anywhere
   start screen, keyboard mashing, the big pointing-finger cursor and a star burst. */
(function () {
  var LP = window.LP = { lang: "en", age: 0, name: "", langs: ["en"] };
  var TAGS = { en: "en-GB", de: "de-DE", es: "es-ES", fr: "fr-FR", it: "it-IT", pt: "pt-PT", nl: "nl-NL", pl: "pl-PL", sv: "sv-SE", el: "el-GR", zh: "zh-CN", ar: "ar-SA", ja: "ja-JP", ko: "ko-KR", ru: "ru-RU", tr: "tr-TR", hi: "hi-IN" };
  var START = { en: "Tap to play", de: "Tippen zum Spielen", es: "Toca para jugar", fr: "Touche pour jouer", it: "Tocca per giocare", pt: "Toca para jogar", nl: "Tik om te spelen", pl: "Dotknij, aby zagrać", sv: "Tryck för att spela", el: "Άγγιξε για να παίξεις", zh: "点一下开始玩", ar: "المس للعب", ja: "タップして あそぼう", ko: "눌러서 놀아요", ru: "Нажми, чтобы играть", tr: "Oynamak için dokun", hi: "खेलने के लिए छुओ" };
  var onLang = function () {}, onAge = function () {};

  function pick(s) {
    var order = [s.active].concat(s.learn || [], [s.home, "en"]);
    for (var i = 0; i < order.length; i++) if (LP.langs.indexOf(order[i]) > -1) return order[i];
    return LP.langs[0];
  }
  function apply(s) {
    if (!s) return;
    LP.name = s.name || ""; LP.home = s.home || "en"; LP.learn = s.learn || [];
    var l = pick(s), a = s.age || 0, lc = l !== LP.lang, ac = a !== LP.age;
    LP.lang = l; LP.age = a;
    document.documentElement.lang = l;
    if (lc) onLang(l);
    if (ac) onAge(a);
  }

  LP.init = function (o) {
    LP.langs = o.langs || ["en", "de", "es", "fr", "it", "pt"];
    var s = window.LP_SETTINGS || { age: 0, home: "en", learn: ["en"], active: "en" };
    LP.name = s.name || ""; LP.age = s.age || 0; LP.lang = pick(s);
    LP.home = s.home || "en"; LP.learn = s.learn || [];
    document.documentElement.lang = LP.lang;
    onLang = o.onLang || onLang; onAge = o.onAge || onAge;
    window.LP_onSettings = function (s2) { apply(s2); };
  };

  /* text for the current language: a string table or {en:..., de:...} */
  LP.t = function (d) { return d ? (d[LP.lang] != null ? d[LP.lang] : d.en) : ""; };

  /* speech: the bridge plays a recording when there is one */
  LP.say = function (text, queue, lang) {
    if (!text || !window.speechSynthesis) return;
    try {
      if (!queue) speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = TAGS[lang || LP.lang] || lang || LP.lang; u.rate = 0.9;
      speechSynthesis.speak(u);
    } catch (e) {}
  };
  LP.hush = function () { try { speechSynthesis.cancel(); } catch (e) {} };

  /* audio */
  var ctx = null, master = null, buffers = {};
  LP.ac = function () {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.8;
      var comp = ctx.createDynamicsCompressor(); master.connect(comp).connect(ctx.destination);
      var S = window.LP_SAMPLES || {};
      Object.keys(S).forEach(function (k) {
        try {
          var bin = atob(S[k]), arr = new Uint8Array(bin.length);
          for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
          ctx.decodeAudioData(arr.buffer, function (b) { buffers[k] = b; }, function () {});
        } catch (e) {}
      });
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };
  LP.sample = function (k, max) {
    var a = LP.ac(); if (!a || !buffers[k]) return false;
    var src = a.createBufferSource(), g = a.createGain(), t = a.currentTime, len = Math.min(buffers[k].duration, max || 1.8);
    src.buffer = buffers[k]; g.gain.setValueAtTime(1, t); g.gain.setValueAtTime(1, t + len - 0.08); g.gain.linearRampToValueAtTime(0, t + len);
    src.connect(g).connect(master); src.start(t); src.stop(t + len + 0.02);
    return true;
  };
  LP.tone = function (f, d, type, vol, at, f2) {
    var a = LP.ac(); if (!a) return;
    var t = a.currentTime + (at || 0), o = a.createOscillator(), g = a.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(master); o.start(t); o.stop(t + d + 0.05);
    return o;
  };
  var nbuf = null;
  LP.noise = function (d, vol, type, freq, q, at, f2) {
    var a = LP.ac(); if (!a) return;
    if (!nbuf) { nbuf = a.createBuffer(1, a.sampleRate * 2, a.sampleRate); var c = nbuf.getChannelData(0); for (var i = 0; i < c.length; i++) c[i] = Math.random() * 2 - 1; }
    var t = a.currentTime + (at || 0), s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = nbuf; f.type = type || "lowpass"; f.frequency.setValueAtTime(freq || 1000, t); f.Q.value = q || 1;
    if (f2) f.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(f).connect(g).connect(master); s.start(t, Math.random()); s.stop(t + d + 0.05);
  };
  LP.sfx = {
    pop: function () { LP.tone(520, 0.12, "sine", 0.25, 0, 900); },
    boing: function () { LP.tone(220, 0.35, "triangle", 0.22, 0, 520); },
    whoosh: function () { LP.noise(0.35, 0.12, "bandpass", 600, 1.2, 0, 2400); },
    chime: function () { [523, 659, 784, 1047].forEach(function (f, i) { LP.tone(f, 0.5, "triangle", 0.16, i * 0.09); }); },
    twinkle: function () { [1319, 1568, 1760].forEach(function (f, i) { LP.tone(f, 0.35, "sine", 0.07, i * 0.07); }); },
    soft: function () { LP.tone(392, 0.6, "sine", 0.12); LP.tone(587, 0.6, "sine", 0.06, 0.05); }
  };

  /* start: games begin at once. The first touch or key unlocks sound (see bridge.js),
     and also counts as a normal tap in the game. */
  LP.start = function (title, cb) {
    LP._started = 0;
    function unlock() { LP.ac(); }
    ["pointerdown", "touchend", "click", "keydown"].forEach(function (ev) { addEventListener(ev, unlock, { capture: true, passive: true }); });
    LP.ac();
    cb();
  };

  /* mash: every tap and every key does something. fn(event, x, y) */
  /* mashing rotates: LP.next(key, list) returns the item picked longest ago (ties random), so no repeats until all have had a turn */
  var hist = {}, nTick = 0;
  LP.next = function (key, list) {
    var h = hist[key] || (hist[key] = new Map()), best = null, bt = Infinity;
    list.slice().sort(function () { return Math.random() - 0.5; }).forEach(function (x) { var t = h.get(x) || 0; if (t < bt) { bt = t; best = x; } });
    h.set(best, ++nTick); return best;
  };

  LP.mash = function (fn) {
    // every tap and key shows a little sparkle straight away, whatever the game does next
    addEventListener("pointerdown", function (e) { if (document.querySelector(".lp-start") || Date.now() - (LP._started || 0) < 350) return; LP.burst(e.clientX, e.clientY, 6); fn(e, e.clientX, e.clientY); });
    addEventListener("keydown", function (e) {
      if (document.querySelector(".lp-start") || e.repeat || e.metaKey || e.ctrlKey || e.altKey || e.key === "Tab") return;
      if (!(e.target.closest && e.target.closest("button"))) e.preventDefault();
      var x = innerWidth * (0.2 + Math.random() * 0.6), y = innerHeight * (0.3 + Math.random() * 0.4);
      LP.burst(x, y, 6); fn(e, x, y);
    });
  };

  /* star burst at a point */
  var cv = null, g2 = null, parts = [], raf = 0;
  LP.burst = function (x, y, n) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!cv) {
      cv = document.createElement("canvas"); cv.className = "lp-fx"; document.body.appendChild(cv); g2 = cv.getContext("2d");
      var size = function () { var d = Math.min(2, devicePixelRatio || 1); cv.width = innerWidth * d; cv.height = innerHeight * d; g2.setTransform(d, 0, 0, d, 0, 0); };
      size(); addEventListener("resize", size);
    }
    var cols = ["#F6C033", "#E5553B", "#1E9A8F", "#7A68D9", "#3B8BD4"];
    for (var i = 0; i < (n || 14); i++) parts.push({ x: x, y: y, vx: (Math.random() - 0.5) * 9, vy: -Math.random() * 9 - 2, r: 5 + Math.random() * 7, a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3, c: cols[i % cols.length], life: 60 });
    if (!raf) raf = requestAnimationFrame(tick);
  };
  function star(x, y, r, a) { g2.save(); g2.translate(x, y); g2.rotate(a); g2.beginPath(); for (var i = 0; i < 10; i++) { var rr = i % 2 ? r * 0.45 : r, t = i * Math.PI / 5 - Math.PI / 2; g2.lineTo(Math.cos(t) * rr, Math.sin(t) * rr); } g2.closePath(); g2.fill(); g2.restore(); }
  function tick() {
    g2.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(function (p) { return --p.life > 0; });
    parts.forEach(function (p) { p.vy += 0.3; p.x += p.vx; p.y += p.vy; p.a += p.va; g2.fillStyle = p.c; g2.globalAlpha = Math.min(1, p.life / 30); star(p.x, p.y, p.r, p.a); });
    g2.globalAlpha = 1; raf = parts.length ? requestAnimationFrame(tick) : 0;
  }

  /* big pointing-finger cursor (project convention), mouse only */
  function cursor() {
    if (!matchMedia("(pointer:fine)").matches) return;
    var c = document.createElement("div"); c.className = "lp-cursor"; c.hidden = true; c.setAttribute("aria-hidden", "true");
    document.body.appendChild(c); document.documentElement.classList.add("lp-nocursor");
    addEventListener("pointermove", function (e) { if (e.pointerType !== "mouse") return; c.hidden = false; c.style.left = e.clientX + "px"; c.style.top = e.clientY + "px"; c.classList.toggle("over", !!(e.target.closest && e.target.closest("button,[data-tap]"))); });
    addEventListener("pointerdown", function () { c.classList.add("tap"); setTimeout(function () { c.classList.remove("tap"); }, 150); });
    document.addEventListener("mouseleave", function () { c.hidden = true; });
  }

  var css = document.createElement("style");
  css.textContent =
    ".lp-start{position:fixed;inset:0;z-index:40;display:grid;place-items:center;background:#18264ab3;padding:24px}" +
    ".lp-go{display:grid;justify-items:center;gap:6px;font-family:'Fredoka','Baloo 2',system-ui,sans-serif;font-weight:600;font-size:clamp(30px,6vw,52px);color:#18264A;background:#F6C033;border:6px solid #fff;border-radius:999px;padding:22px 48px;box-shadow:0 10px 0 #b8861a;cursor:pointer;animation:lp-nudge 2.2s ease-in-out infinite}" +
    ".lp-go small{font-family:'Atkinson Hyperlegible',system-ui,sans-serif;font-weight:700;font-size:16px;letter-spacing:.04em}" +
    ".lp-go:focus-visible{outline:4px solid #3B8BD4;outline-offset:4px}" +
    "@keyframes lp-nudge{50%{transform:scale(1.05)}}" +
    ".lp-fx{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:30}" +
    ".lp-nocursor,.lp-nocursor *{cursor:none!important}" +
    ".lp-cursor{position:fixed;left:0;top:0;z-index:50;width:40px;height:51px;background:url(../felt/cursor-felt.svg) center/contain no-repeat;margin:-3px 0 0 -4px;pointer-events:none;filter:drop-shadow(0 0 3px #fff) drop-shadow(0 0 3px #fff) drop-shadow(0 4px 6px #12345a66);transition:transform .15s;transform-origin:4px 3px}" +
    ".lp-cursor.over{transform:scale(1.25) rotate(-8deg)}.lp-cursor.tap{transform:scale(.85)}" +
    "@media (prefers-reduced-motion:reduce){.lp-go{animation:none}}";
  (document.head || document.documentElement).appendChild(css);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cursor); else cursor();
})();
