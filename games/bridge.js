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
      (document.head || document.documentElement).appendChild(sc);
    });
    var origSpeak = ss.speak.bind(ss), origCancel = ss.cancel.bind(ss);
    var q = [], cur = null, audio = null, gen = 0;
    function fire(u, ev) { try { if (u["on" + ev]) u["on" + ev](new Event(ev)); } catch (e) {} }
    function langOf(u) { return (u.lang || (u.voice && u.voice.lang) || "").replace("_", "-"); }
    function clipFor(u) {
      var bank = (window.LP_CLIPS || {})[langOf(u).slice(0, 2).toLowerCase()];
      return bank ? bank[window.LPVoice.key(u.text, S.name)] || null : null;
    }
    function advance(my) { if (my !== gen) return; cur = null; next(); }
    function next() {
      if (cur || !q.length) return;
      var u = q.shift(), my = gen; cur = u;
      var clip = clipFor(u);
      if (clip) {
        audio = new Audio("data:audio/mpeg;base64," + clip);
        var finished = false;
        var end = function () { if (finished || my !== gen) return; finished = true; fire(u, "end"); advance(my); };
        audio.onended = end;
        audio.onerror = function () { if (finished || my !== gen) return; finished = true; tts(u, my); };
        fire(u, "start");
        var p = audio.play(); if (p && p.catch) p.catch(end);
        return;
      }
      tts(u, my);
    }
    function tts(u, my) {
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
    ss.speak = function (u) { q.push(u); window.LPVoice.ready(next); };
    ss.cancel = function () {
      gen++; q = []; cur = null;
      if (audio) { try { audio.pause(); } catch (e) {} audio = null; }
      origCancel();
    };
  })();

  function set(k, v) { try { localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v)); } catch (e) {} }
  function get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function css(t) { var s = document.createElement("style"); s.textContent = t; (document.head || document.documentElement).appendChild(s); }
  function ready(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }

  var NAMES = { en: "English", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", pt: "Português" };

  var A = {
    farm: {
      langs: ["en", "de", "it", "es", "pt", "fr"],
      hide: ".langs,#nameGate{display:none!important}#doors:not(.open) .open-btn{opacity:1!important;pointer-events:auto!important}",
      pre: function (s, l) { set("farm-lang", l); set("farm-child-name", s.name || ""); },
      live: function (s, l) { var b = document.querySelector('.lang[data-lang="' + l + '"]'); if (b) b.click(); return true; }
    },
    sky: {
      langs: ["en", "de", "es", "fr", "it"],
      hide: ".langs,#levels{display:none!important}",
      pre: function (s, l) { set("skyLang", l); set("skyLevel", ["easy", "hard", "big"][s.age] || "easy"); },
      live: function (s, l) {
        var b = document.getElementById("lang-" + l); if (b) b.click();
        var v = document.getElementById("lvl-" + (["easy", "hard", "big"][s.age] || "easy")); if (v && !v.classList.contains("on")) v.click();
        return true;
      }
    },
    drum: {
      langs: ["en", "de", "es", "it", "fr"],
      hide: "#langs{display:none!important}",
      pre: function () {},
      live: function (s, l) {
        var chips = document.querySelectorAll("#langs .chip");
        for (var i = 0; i < chips.length; i++) if (chips[i].textContent === NAMES[l] && !chips[i].classList.contains("on")) chips[i].click();
        return true;
      }
    },
    train: {
      langs: ["en", "de", "es", "fr", "it", "pt", "nl", "pl", "sv", "el", "zh", "ar", "ja", "ko", "ru", "tr", "hi"],
      hide: "#langsel{display:none!important}",
      pre: function () {},
      live: function (s, l) {
        var sel = document.getElementById("langsel");
        if (sel && sel.value !== l) { sel.value = l; sel.dispatchEvent(new Event("change")); }
        return true;
      }
    },
    flappy: {
      langs: ["en", "de", "es", "fr", "it", "pt", "nl", "tr", "ja", "zh", "ar", "hi"],
      hide: "#lang,#lang2,#mode{display:none!important}",
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
      langs: ["en", "de", "es", "fr", "it"],
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
    langs: ["en", "de", "es", "fr", "it", "pt"], hide: "", pre: function () {},
    live: function (s) { if (window.LP_onSettings) window.LP_onSettings(s); return true; }
  };

  function pick(s) {
    var order = [s.active].concat(s.learn || [], [s.home, "en"]);
    for (var i = 0; i < order.length; i++) if (a.langs.indexOf(order[i]) > -1) return order[i];
    return a.langs[0];
  }

  var lang = pick(S);
  function announce(l) { window.LP_LANG = l; try { dispatchEvent(new CustomEvent("lp-lang", { detail: l })); } catch (e) {} }
  announce(lang);
  a.pre(S, lang);
  css(a.hide);
  ready(function () { if (a.live) a.live(S, lang); });

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
