/* LingoPlaytime bridge: connects a game to the site's settings bar.
   Loaded at the very top of each game, before the game's own script.
   Settings arrive in the ?lp= query on load, and as postMessage while playing. */
(function () {
  var GAME = window.LP_GAME;
  var S = null;
  try { S = JSON.parse(new URLSearchParams(location.search).get("lp")); } catch (e) {}
  if (!S) { try { var p = JSON.parse(localStorage.getItem("lingoplaytime.profile.v1")); if (p) S = { name: p.name, age: p.age, home: p.home, learn: p.learn, active: p.active || p.learn[0] }; } catch (e) {} }
  if (!S) S = { name: "", age: 0, home: "en", learn: ["en"], active: "en" };

  window.LP_SETTINGS = S;

  /* iPad and iPhone: the ringer switch silences Web Audio unless the page's audio session is "playback".
     Newer Safari has navigator.audioSession; older ones need a silent looping <audio> element to be playing. */
  (function () {
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
    var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (!ios || navigator.audioSession) return;
    var started = false;
    function start() {
      if (started) return; started = true;
      try {
        var a = document.createElement("audio"); a.setAttribute("playsinline", ""); a.loop = true; a.volume = 0.01;
        a.src = "data:audio/wav;base64,UklGRsQPAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YaAPAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA";
        var p = a.play(); if (p && p.catch) p.catch(function () { started = false; });
        window.LP_KEEPALIVE = a;
      } catch (e) { started = false; }
    }
    ["touchend", "click", "keydown"].forEach(function (ev) { window.addEventListener(ev, start, { capture: true, passive: true }); });
  })();

  /* Master mute, shared with the site's sound button (localStorage + postMessage "lp-mute").
     Web Audio: every context's destination is a master gain. Recorded clips and browser speech
     are skipped while muted, and speech still reports start and end so games keep their rhythm. */
  var MKEY = "lingoplaytime.muted", muted = false, ctxs = [], allCtx = [];
  /* Games start straight away, with no "tap to play" screen. Browsers keep sound locked until the
     first touch or key, so that first gesture resumes every audio context, and any line a game tried
     to say before it (the opening question) is played then, unless the tap itself said something. */
  var gestured = false, pending = [];
  try { gestured = !!(navigator.userActivation && navigator.userActivation.hasBeenActive); } catch (e) {}
  /* Safari on iPad and iPhone only unlocks sound when a finger lifts (touchend, click), not when it
     lands, so the unlock listens for those too and wakes each context with a silent blip. */
  function wake(c) {
    try { if (c.state === "suspended") c.resume(); var b = c.createBuffer(1, 1, 22050), s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0); } catch (e) {}
  }
  function firstGesture(e) {
    var t = e.type;
    if (t === "touchstart" || (t === "pointerdown" && e.pointerType !== "mouse") || (t === "pointerup" && e.pointerType === "mouse")) return;
    allCtx.forEach(wake);
    if (gestured) return;
    gestured = true;
    if (window.LP_primeSpeech) window.LP_primeSpeech();
    // replay the latest line the game tried to say while sound was locked (the tap's own line if it said one)
    var u = pending.pop(); pending = [];
    if (u && window.speechSynthesis) window.speechSynthesis.speak(u);
  }
  ["pointerdown", "pointerup", "touchend", "mousedown", "click", "keydown"].forEach(function (ev) { window.addEventListener(ev, firstGesture, { capture: true, passive: true }); });
  try { muted = localStorage.getItem(MKEY) === "1"; } catch (e) {}
  window.LP_MUTED = function () { return muted; };
  ["AudioContext", "webkitAudioContext"].forEach(function (n) {
    var O = window[n]; if (!O) return;
    var W = function () {
      var c = new (Function.prototype.bind.apply(O, [null].concat([].slice.call(arguments))))();
      allCtx.push(c);
      try { var g = c.createGain(), real = c.destination; g.gain.value = muted ? 0 : 1; g.connect(real); Object.defineProperty(c, "destination", { value: g }); ctxs.push(g); } catch (e) {}
      return c;
    };
    W.prototype = O.prototype; window[n] = W;
  });
  (function () {
    var pl = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { this.muted = muted; return pl.apply(this, arguments); };
  })();
  function applyMute() {
    ctxs.forEach(function (g) { try { g.gain.value = muted ? 0 : 1; } catch (e) {} });
    Array.prototype.forEach.call(document.querySelectorAll("audio,video"), function (m) { m.muted = muted; });
    if (muted) { try { window.speechSynthesis.cancel(); } catch (e) {} }
  }
  window.addEventListener("message", function (e) {
    var d = e.data; if (!d || d.type !== "lp-mute" || e.source !== window.parent) return;
    muted = !!d.muted; applyMute();
  });

  /* Speech layer: every game's speechSynthesis.speak goes through here.
     1. If the phrase has a recording (games/audio/<game>.<lang>.js), play the recording.
        Recordings come from a native voice model, so pronunciation is the same on every device.
     2. Otherwise use a real native browser voice for the language (or the one chosen in Settings),
        at natural pitch, and stay quiet rather than let another language's voice read the word.
     Utterances queue like the browser's own, and cancel() stops both kinds. */
  var RECORDED = { de: 1, en: 1, es: 1, fr: 1, it: 1, pt: 1, nl: 1, pl: 1, sv: 1, el: 1, zh: 1, ru: 1 };
  (function () {
    var ss = window.speechSynthesis;
    if (!ss || !window.LPVoice) return;
    [S.home].concat(S.learn || []).forEach(function (l) {
      if (!RECORDED[l]) return;
      var sc = document.createElement("script"); sc.src = "audio/" + GAME + "." + l + ".js";
      sc.onload = function () { if (window.LP_warm) window.LP_warm(); };
      (document.head || document.documentElement).appendChild(sc);
    });
    var origSpeak = ss.speak.bind(ss), origCancel = ss.cancel.bind(ss);
    var q = [], cur = null, audio = null, gen = 0; var curAt = 0; window.LP_busy = function () { return (!!cur || q.length > 0) && Date.now() - curAt < 5000; };
    function fire(u, ev) { try { if (u["on" + ev]) u["on" + ev](new Event(ev)); } catch (e) {} }
    function langOf(u) { return (u.lang || (u.voice && u.voice.lang) || "").replace("_", "-"); }
    function clipFor(u) {
      var lc = langOf(u).slice(0, 2).toLowerCase();
      if ((S.voices || {})[lc]) return null; // a voice picked in Settings replaces the recordings
      var bank = (window.LP_CLIPS || {})[lc];
      return bank ? bank[window.LPVoice.key(u.text, S.name)] || null : null;
    }
    function advance(my) { if (my !== gen) return; cur = null; next(); }
    /* Recordings play through Web Audio: each clip is decoded to a buffer ahead of time (in small
       idle slices, active language first), so a tap starts its sound on the same frame instead of
       building a data-URL audio element first. HTMLAudio stays as the fallback. */
    var ac = null, bufs = {}, decoding = {}, srcNow = null, warmed = {};
    /* Decoded audio is big (a few minutes of speech is over 100 MB as float samples), and an iPad tab that
       holds too much gets killed or silently fails to decode. So keep a budget, drop the least recently used
       clips when it is full, and decode again on demand. */
    var BUDGET = 40 * 1024 * 1024, used = 0;
    function sz(b) { return b.length * b.numberOfChannels * 4; }
    function keep(id, b) {
      if (bufs[id]) used -= sz(bufs[id]);
      delete bufs[id]; bufs[id] = b; used += sz(b);
      var ks = Object.keys(bufs);
      for (var i = 0; i < ks.length - 1 && used > BUDGET; i++) { used -= sz(bufs[ks[i]]); delete bufs[ks[i]]; }
    }
    function getAC() {
      if (ac) return ac;
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      try { ac = new AC(); } catch (e) { ac = null; }
      return ac;
    }
    function unlock() { var c = getAC(); if (c && c.state === "suspended") { try { c.resume(); } catch (e) {} } }
    ["pointerdown", "touchstart", "touchend", "mousedown", "click", "keydown"].forEach(function (ev) { window.addEventListener(ev, unlock, { capture: true, passive: true }); });
    // iOS keeps browser speech locked until something is spoken inside a tap: say a silent space then
    window.LP_primeSpeech = function () { unlock(); try { var u = new SpeechSynthesisUtterance(" "); u.volume = 0; origSpeak(u); } catch (e) {} };
    function toBuf(b64) {
      var bin = atob(b64), n = bin.length, a = new Uint8Array(n);
      for (var i = 0; i < n; i++) a[i] = bin.charCodeAt(i);
      return a.buffer;
    }
    function decode(lc, key, cb) {
      var id = lc + "|" + key;
      if (bufs[id]) { var hit = bufs[id]; keep(id, hit); cb && cb(hit); return; }
      var c = getAC(), bank = (window.LP_CLIPS || {})[lc];
      if (!c || !bank || !bank[key]) { cb && cb(null); return; }
      if (decoding[id]) { if (cb) decoding[id].push(cb); return; }
      decoding[id] = cb ? [cb] : [];
      var done = function (b) { if (b) keep(id, b); var l = decoding[id] || []; delete decoding[id]; l.forEach(function (f) { f(b || null); }); };
      try {
        var p = c.decodeAudioData(toBuf(bank[key]), done, function () { done(null); });
        if (p && p.catch) p.catch(function () {});
      } catch (e) { done(null); }
    }
    function warm(lc) {
      var bank = (window.LP_CLIPS || {})[lc]; if (!bank || warmed[lc] || !getAC()) return;
      warmed[lc] = 1;
      var keys = Object.keys(bank), i = 0, busy = 0;
      // two decodes at a time, so a tap's own clip never waits behind a long queue
      function pump() {
        while (busy < 2 && i < keys.length && used < BUDGET * 0.5) {
          busy++;
          decode(lc, keys[i++], function () { busy--; (window.requestIdleCallback ? requestIdleCallback(pump, { timeout: 300 }) : setTimeout(pump, 10)); });
        }
      }
      pump();
    }
    window.LP_warm = function () { [window.LP_LANG].concat([S.active, S.home], S.learn || []).forEach(function (l) { if (l) warm(String(l).slice(0, 2)); }); };
    function note() { window.LP_LASTPLAY = performance.now(); }
    function playBuf(b, u, my) {
      var c = ac, src = c.createBufferSource(), finished = false;
      src.buffer = b; src.connect(c.destination); srcNow = src;
      src.onended = function () { if (finished || my !== gen) return; finished = true; srcNow = null; fire(u, "end"); advance(my); };
      fire(u, "start"); note(); src.start(0);
    }
    function playClip(u, my, lc, key, clip) {
      if (getAC()) {
        unlock();
        decode(lc, key, function (b) {
          if (my !== gen) return;
          if (b) playBuf(b, u, my); else htmlAudio(u, my, clip);
        });
        return;
      }
      htmlAudio(u, my, clip);
    }
    function htmlAudio(u, my, clip) {
      audio = new Audio("data:audio/mpeg;base64," + clip);
      var finished = false;
      var end = function () { if (finished || my !== gen) return; finished = true; fire(u, "end"); advance(my); };
      audio.onended = end;
      audio.onerror = function () { if (finished || my !== gen) return; finished = true; tts(u, my); };
      audio.onplaying = note;
      fire(u, "start");
      var p = audio.play(); if (p && p.catch) p.catch(end);
    }
    function next() {
      if (cur || !q.length) return;
      var u = q.shift(), my = gen; cur = u; curAt = Date.now();
      if (muted) { fire(u, "start"); setTimeout(function () { if (my !== gen) return; fire(u, "end"); advance(my); }, 450); return; }
      var clip = clipFor(u);
      if (clip) {
        var lc = langOf(u).slice(0, 2).toLowerCase(), k = window.LPVoice.key(u.text, S.name);
        var go = function () { if (my === gen) playClip(u, my, lc, k, clip); };
        // names are never recorded, so say the child's name with the browser voice, then play the clip
        if (S.name && k !== window.LPVoice.key(u.text, "")) { sayName(u, my, go); return; }
        go(); return;
      }
      tts(u, my);
    }
    function sayName(u, my, done) {
      var n = new SpeechSynthesisUtterance(S.name), fin = false;
      var f = function () { if (fin) return; fin = true; done(); };
      window.LPVoice.ready(function () {
        if (my !== gen) return;
        var code = langOf(u), v = code ? window.LPVoice.best(code, (S.voices || {})[code.slice(0, 2).toLowerCase()]) : null;
        if (!v) { f(); return; }
        n.voice = v; n.lang = v.lang; n.rate = 0.9; n.onend = f; n.onerror = f;
        setTimeout(f, 2500);
        origSpeak(n);
      });
    }
    function tts(u, my) { window.LPVoice.ready(function () { if (my === gen) ttsGo(u, my); }); }
    function ttsGo(u, my) {
      var code = langOf(u);
      var v = code ? window.LPVoice.best(code, (S.voices || {})[code.slice(0, 2).toLowerCase()]) : null;
      if (code && !v) { setTimeout(function () { if (my !== gen) return; fire(u, "end"); advance(my); }, 300); return; }
      if (v) { u.voice = v; u.lang = v.lang; }
      u.pitch = 1;
      if (!(u.rate >= 0.75 && u.rate <= 1.05)) u.rate = 0.9;
      u.addEventListener("end", function () { advance(my); });
      u.addEventListener("error", function () { advance(my); });
      origSpeak(u);
    }
    ss.speak = function (u) {
      if (!gestured) { pending.push(u); return; } // sound is still locked: hold the line for the first tap
      q.push(u); next(); // recordings never wait for the voice list
    };
    ss.cancel = function () {
      gen++; q = []; cur = null; if (!gestured) pending = [];
      if (audio) { try { audio.pause(); } catch (e) {} audio = null; }
      if (srcNow) { try { srcNow.onended = null; srcNow.stop(); } catch (e) {} srcNow = null; }
      origCancel();
    };
  })();

  function set(k, v) { try { localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v)); } catch (e) {} }
  function get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function css(t) { var s = document.createElement("style"); s.textContent = t; (document.head || document.documentElement).appendChild(s); }
  function ready(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }

  var ALL = window.ALLLANGS = ["en", "de", "es", "fr", "it", "pt", "nl", "pl", "sv", "el", "zh", "ar", "ja", "ko", "ru", "tr", "hi"];
  var NAMES = { en: "English", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", pt: "Português", nl: "Nederlands", pl: "Polski", sv: "Svenska", el: "Ελληνικά", zh: "中文", ar: "العربية", ja: "日本語", ko: "한국어", ru: "Русский", tr: "Türkçe", hi: "हिन्दी" };

  var A = {
    farm: {
      langs: ALL,
      hide: ".langs,#nameGate{display:none!important}#doors:not(.open) .open-btn{opacity:1!important;pointer-events:auto!important}",
      pre: function (s, l) { set("farm-lang", l); set("farm-child-name", s.name || ""); },
      live: function (s, l) { var b = document.querySelector('.lang[data-lang="' + l + '"]'); if (b) b.click(); return true; }
    },
    sky: {
      langs: ALL,
      go: function () { var b = document.getElementById("go"); if (b) b.click(); },
      hide: ".langs,#levels{display:none!important}",
      pre: function (s, l) { set("skyLang", l); set("skyLevel", ["easy", "hard", "big"][s.age] || "easy"); },
      live: function (s, l) {
        var b = document.getElementById("lang-" + l); if (b) b.click();
        var v = document.getElementById("lvl-" + (["easy", "hard", "big"][s.age] || "easy")); if (v && !v.classList.contains("on")) v.click();
        return true;
      }
    },
    drum: {
      langs: ALL,
      go: function () { var b = document.getElementById("go"); if (b) b.click(); },
      hide: "#langs{display:none!important}",
      pre: function () {},
      live: function (s, l) {
        var chips = document.querySelectorAll("#langs .chip");
        for (var i = 0; i < chips.length; i++) if (chips[i].textContent === NAMES[l] && !chips[i].classList.contains("on")) chips[i].click();
        return true;
      }
    },
    train: {
      langs: ALL,
      go: function () { var o = document.getElementById("overlay"), b = document.getElementById("start"); if (b) b.click(); if (o) o.hidden = true; },
      hide: "#langsel{display:none!important}",
      pre: function () {},
      live: function (s, l) {
        var sel = document.getElementById("langsel");
        if (sel && sel.value !== l) { sel.value = l; sel.dispatchEvent(new Event("change")); }
        return true;
      }
    },
    flappy: {
      langs: ALL,
      hide: "#lang,#lang2,#mode,label:has(#lang),label:has(#lang2){display:none!important}",
      second: function (s, l) {
        var pool = [s.home].concat(s.learn).filter(function (c) { return c !== l && A.flappy.langs.indexOf(c) > -1; });
        return pool[0] || (l === "en" ? "de" : "en");
      },
      pre: function (s, l) { set("fw-lang", l); set("fw-lang2", A.flappy.second(s, l)); },
      live: function (s, l) {
        var a = document.getElementById("lang"), b = document.getElementById("lang2");
        if (a && a.value !== l) { a.value = l; a.dispatchEvent(new Event("change")); }
        var two = A.flappy.second(s, l);
        if (b && b.value !== two) { b.value = two; b.dispatchEvent(new Event("change")); }
        var m = document.getElementById("mode");
        if (m) { var toddler = m.getAttribute("aria-pressed") === "true"; if (toddler !== (s.age < 2)) m.click(); }
        return true;
      }
    },
    soup: {
      langs: ALL,
      go: function () { var f = document.getElementById("form"); if (!f) return; if (f.requestSubmit) f.requestSubmit(); else f.dispatchEvent(new Event("submit", { cancelable: true })); },
      hide: "#gear,#form .lbl,#form #name,#form .chips{display:none!important}",
      pre: function (s, l) {
        var old = get("soupPot") || {};
        set("soupPot", { name: s.name || "", langs: [l], mode: s.age >= 1 ? "order" : "free", stickers: old.stickers || [] });
      },
      live: null
    }
  };

  // Games built on kit.js handle settings themselves through window.LP_onSettings.
  var a = A[GAME] || {
    langs: ALL, hide: "", pre: function () {},
    live: function (s) { if (window.LP_onSettings) window.LP_onSettings(s); return true; }
  };

  function pick(s) {
    var order = [s.active].concat(s.learn || [], [s.home, "en"]);
    for (var i = 0; i < order.length; i++) if (a.langs.indexOf(order[i]) > -1) return order[i];
    return a.langs[0];
  }

  var lang = pick(S);
  function announce(l) { window.LP_LANG = l; if (window.LP_warm) setTimeout(window.LP_warm, 0); try { dispatchEvent(new CustomEvent("lp-lang", { detail: l })); } catch (e) {} }
  announce(lang);
  a.pre(S, lang);
  css(a.hide);
  ready(function () { if (a.live) a.live(S, lang); });
  // older games with their own start button: press it once the loading screen has let go of clicks
  if (a.go) { if (document.readyState === "complete") setTimeout(a.go, 0); else window.addEventListener("load", function () { setTimeout(a.go, 0); }); }

  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || d.type !== "lp-settings" || e.source !== window.parent) return;
    var s = d.settings, l = pick(s);
    var nameOrAgeChanged = s.name !== S.name || s.age !== S.age;
    S = s; window.LP_SETTINGS = s;
    if (!nameOrAgeChanged && a.live) { lang = l; a.live(s, l); announce(l); return; }
    // Games that can't switch mid-play restart with the new settings.
    var u = new URL(location.href); u.searchParams.set("lp", JSON.stringify(s)); u.searchParams.set("name", s.name || "");
    location.replace(u.toString());
  });

  // tell the site which language this game ended up using
  try { window.parent.postMessage({ type: "lp-game-ready", game: GAME, lang: lang, langs: a.langs }, "*"); } catch (e) {}
})();
