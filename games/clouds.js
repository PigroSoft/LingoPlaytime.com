/* LingoPlaytime felt clouds: stitched felt clouds that drift slowly across a game's sky.
   Any game can use them:
     <script src="clouds.js"></script>
     LPClouds.add(el, { count: 4, top: "0", height: "40%" })
   el is the element to float them over (usually the game's .app). They sit behind the game
   (z-index 0) and never catch taps. Returns the cloud layer, so a game can resize it later. */
(function () {
  var css = document.createElement("style");
  css.textContent =
    ".lp-clouds{position:absolute;left:0;right:0;top:0;height:40%;overflow:visible;pointer-events:none;z-index:0;container-type:size}" +
    // stop motion: the cloud jumps a little at a time (about 8 frames a second) and wobbles like a hand-moved puppet
    ".lp-clouds .lp-c{position:absolute;left:0;will-change:transform;animation-name:lp-drift;animation-iteration-count:infinite}" +
    ".lp-clouds img{display:block;width:100%;height:auto;filter:drop-shadow(0 6px 6px rgba(20,40,80,.18));animation:lp-boil .75s steps(1) infinite}" +
    "@keyframes lp-drift{from{transform:translateX(-30vw)}to{transform:translateX(110vw)}}" +
    "@keyframes lp-boil{0%{transform:rotate(-.7deg)}33%{transform:rotate(.5deg) translateY(1px)}66%{transform:rotate(0) translateY(-1px)}}" +
    "@media (prefers-reduced-motion:reduce){.lp-clouds .lp-c,.lp-clouds img{animation-play-state:paused}}";
  document.head.appendChild(css);

  var ART = ["/felt/cloud-1.webp", "/felt/cloud-2.webp", "/felt/cloud-3.webp"];

  function add(el, opts) {
    opts = opts || {};
    var n = opts.count || 4;
    var layer = document.createElement("div");
    layer.className = "lp-clouds";
    if (opts.top != null) layer.style.top = opts.top;
    if (opts.height != null) layer.style.height = opts.height;
    for (var i = 0; i < n; i++) {
      var c = document.createElement("div"), im = document.createElement("img");
      c.className = "lp-c"; c.appendChild(im);
      im.src = ART[i % ART.length]; im.alt = ""; im.draggable = false;
      im.style.animationDelay = (-Math.random() * 0.75) + "s";
      var dur = 110 + Math.random() * 90;                    // seconds to cross: slow and calm
      var size = [18, 14, 10][i % 3] * (0.85 + Math.random() * 0.3);
      // never taller than the sky band, and placed so the whole cloud stays inside it (never over the roofs)
      var wv = "min(" + size + "vw," + Math.round(size * 13) + "px,130cqh)";
      c.style.width = wv;
      c.style.top = "calc((100cqh - " + wv + " * .56) * " + (0.08 + ((i * 37) % 80) / 100).toFixed(2) + ")";
      c.style.animationDuration = dur + "s";
      c.style.animationTimingFunction = "steps(" + Math.round(dur * 8) + ")"; // one small hop per frame
      c.style.animationDelay = (-dur * ((i + Math.random() * 0.5) / n)) + "s"; // already spread across the sky
      layer.appendChild(c);
    }
    el.insertBefore(layer, el.firstChild);
    return layer;
  }
  window.LPClouds = { add: add };
})();
