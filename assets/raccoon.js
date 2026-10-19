/* LingoPlaytime raccoon host.
   One felt raccoon per age group (0 = 1-2 mustard, 1 = 3-4 teal, 2 = 5-7 rust), six poses each:
   0 neutral, 1 blink, 2 speaking, 3 wave A, 4 wave B, 5 delighted.
   Poses are finite reactions on a held neutral, never one long loop, with no crossfades.
   Reduced motion keeps the neutral still. Everything pauses offscreen and when the tab is hidden.

   var r = LPRaccoon.create(el, {age:0, label:"optional alt text"});
   r.setAge(2);  r.wave();  r.speak(1800);  r.speak(false);  r.delight();  r.destroy();  */
(function () {
  var src = (document.currentScript && document.currentScript.src) || "";
  var BASE = src.replace(/assets\/raccoon\.js.*$/, "felt/");
  var SETS = [{ n: "mustard", s: 0.8 }, { n: "teal", s: 0.9 }, { n: "rust", s: 1 }];
  var rm = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var cache = {};
  function preload(i) { if (!cache[i]) { cache[i] = new Image(); cache[i].src = BASE + "raccoon-" + SETS[i].n + ".webp"; } return cache[i].src; }
  (function css() {
    var s = document.createElement("style");
    s.textContent = ".lp-raccoon{display:block;width:100%;aspect-ratio:1;background-size:300% 200%;background-repeat:no-repeat;transform-origin:50% 96%;filter:drop-shadow(0 6px 6px #0004);pointer-events:none;user-select:none;-webkit-user-select:none}";
    document.head.appendChild(s);
  })();
  function group(age) { age = +age || 0; return age < 0 ? 0 : age > 2 ? 2 : age; }

  function create(el, o) {
    o = o || {};
    var age = group(o.age), timer = 0, blinkT = 0, speaking = 0, busy = false, seen = true, dead = false;
    el.classList.add("lp-raccoon");
    if (o.label) { el.setAttribute("role", "img"); el.setAttribute("aria-label", o.label); } else el.setAttribute("aria-hidden", "true");
    function frame(n) { el.style.backgroundPosition = (n % 3) * 50 + "% " + Math.floor(n / 3) * 100 + "%"; }
    function look() { el.style.backgroundImage = "url('" + preload(age) + "')"; el.style.transform = "scale(" + SETS[age].s + ")"; frame(0); }
    function cancel() { clearTimeout(timer); clearInterval(speaking); speaking = 0; busy = false; }
    function active() { return !dead && seen && !document.hidden && !rm.matches; }
    function play(frames, delay, then) {
      cancel(); if (!active()) { frame(0); return; }
      busy = true; var i = 0;
      (function next() {
        frame(frames[i++]);
        if (i < frames.length) timer = setTimeout(next, delay);
        else timer = setTimeout(function () { busy = false; frame(0); then && then(); }, delay);
      })();
    }
    function blink() {
      clearTimeout(blinkT);
      blinkT = setTimeout(function () { if (!busy && active()) play([1, 0], 120); blink(); }, 4000 + Math.random() * 3000);
    }
    var api = {
      setAge: function (a) { age = group(a); cancel(); look(); },
      wave: function () { play([0, 3, 4, 3, 4, 0], 180); },
      delight: function () { play([5], 700); },
      /* speak(ms): talk for ms milliseconds; speak(false) stops */
      speak: function (ms) {
        cancel(); if (ms === false || !active()) { frame(0); return; }
        busy = true; var open = false, t0 = Date.now();
        frame(2); open = true;
        speaking = setInterval(function () {
          if (Date.now() - t0 > ms || !active()) { cancel(); frame(0); return; }
          open = !open; frame(open ? 2 : 0);
        }, 200);
      },
      still: function () { cancel(); frame(0); },
      destroy: function () { dead = true; cancel(); clearTimeout(blinkT); document.removeEventListener("visibilitychange", vis); io && io.disconnect(); }
    };
    function vis() { if (document.hidden) { cancel(); frame(0); } }
    document.addEventListener("visibilitychange", vis);
    var io = null;
    if (window.IntersectionObserver) { io = new IntersectionObserver(function (e) { seen = e[e.length - 1].isIntersecting; if (!seen) { cancel(); frame(0); } }); io.observe(el); }
    look(); blink();
    return api;
  }
  window.LPRaccoon = { create: create, group: group, names: ["mustard", "teal", "rust"] };
})();
