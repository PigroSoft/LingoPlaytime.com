/* A little felt raccoon that stands on the soil line of the footer and does small tricks now and then. */
(function () {
  var f = document.querySelector("footer"); if (!f || !f.querySelector(".bf")) return;
  var s = document.createElement("style");
  s.textContent = "footer .frac{position:absolute;left:clamp(16px,13%,260px);top:calc(var(--rs) * -.94);width:var(--rs);z-index:1;cursor:pointer;-webkit-tap-highlight-color:transparent;--rs:clamp(84px,9vw,160px)}";
  document.head.appendChild(s);
  var d = document.createElement("div"); d.className = "frac"; d.setAttribute("aria-hidden", "true"); f.appendChild(d);
  function boot() {
    var r = LPRaccoon.create(d, { age: Math.floor(Math.random() * 3) }), vis = true;
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; if (vis) setTimeout(function () { r.wave(); }, 400); }).observe(d);
    d.addEventListener("pointerenter", function () { r.wave(); });
    d.addEventListener("pointerdown", function () { r.trick(); });
    var acts = ["peekaboo", "clap", "wave", "listen", "point"], i = 0;
    (function loop() { setTimeout(function () { if (vis && !document.hidden) { var a = acts[i++ % acts.length]; try { r[a](); } catch (e) {} } loop(); }, 6000 + Math.random() * 5000); })();
  }
  if (window.LPRaccoon) boot();
  else { var sc = document.createElement("script"); sc.src = "/assets/raccoon.js"; sc.onload = boot; document.head.appendChild(sc); }
})();
