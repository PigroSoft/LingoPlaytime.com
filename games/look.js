/* LingoPlaytime look: flat, chubby, geometric shapes on a deep indigo night,
   lit from the top left (lighter top, darker shade side), soft glows, dot eyes.
   Original art. Load after kit.js. Gives:
   - LPLook.sky(el): starry gradient sky with layered hills behind a game
   - LPLook.animal(id): an SVG string for cow, pig, duck, sheep, horse, chicken, cat, dog, mouse, rabbit, frog, teddy
   - gradients usable as fill="url(#k-<name>)" in any inline SVG on the page */
(function () {
  var C = {
    night: "#1d4690", night2: "#2a5fb0", night3: "#3d86d8", hill1: "#2f6bc0", hill2: "#3f84d6", hill3: "#58a0e6",
    yellow: "#ffd23f", orange: "#ff8a3d", pink: "#ff4f8b", red: "#ff4d5e", teal: "#20c9b0", green: "#58d26b",
    blue: "#3aa0ff", violet: "#8b5cf6", cream: "#fff2d8", white: "#f7f4ff", brown: "#b96a3c", grey: "#9aa3c7", ink: "#1a1440"
  };
  // each gradient: light at the top-left, base in the middle, shade at the bottom-right
  var G = {
    yellow: ["#fff2a6", "#ffd23f", "#f2a81d"], orange: ["#ffc08a", "#ff8a3d", "#e2602a"], pink: ["#ff9fc0", "#ff4f8b", "#d9306c"],
    red: ["#ff9aa3", "#ff4d5e", "#d22f44"], teal: ["#8cf2e1", "#20c9b0", "#119a8a"], green: ["#a8f0a0", "#58d26b", "#33a24f"],
    blue: ["#9dd2ff", "#3aa0ff", "#2273d6"], violet: ["#c3a8ff", "#8b5cf6", "#6439d1"], cream: ["#ffffff", "#fff2d8", "#efd3a8"],
    white: ["#ffffff", "#f7f4ff", "#d7d2f0"], brown: ["#e3a274", "#b96a3c", "#8a4724"], dark: ["#4a3f8f", "#2c2468", "#1a1440"],
    grey: ["#d4daf3", "#9aa3c7", "#6f789f"], skin: ["#ffd9c4", "#f4b898", "#d98e6c"], gold: ["#fff0a0", "#ffc83d", "#e09a12"]
  };
  function defsInner() {
    var s = '';
    Object.keys(G).forEach(function (k) {
      var g = G[k];
      s += '<linearGradient id="k-' + k + '" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="' + g[0] + '"/><stop offset=".45" stop-color="' + g[1] + '"/><stop offset="1" stop-color="' + g[2] + '"/></linearGradient>';
    });
    s += '<radialGradient id="k-glow"><stop offset="0" stop-color="#fff6c8" stop-opacity=".95"/><stop offset=".35" stop-color="#ffd23f" stop-opacity=".45"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></radialGradient>';
    s += '<radialGradient id="k-glowcool"><stop offset="0" stop-color="#c9f6ff" stop-opacity=".8"/><stop offset="1" stop-color="#3aa0ff" stop-opacity="0"/></radialGradient>';
    return s;
  }
  function defs() {
    var d = document.createElement("div"); d.innerHTML = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' + defsInner() + "</defs></svg>"; document.body.prepend(d.firstChild);
  }

  /* dot eyes with a glint; r = size */
  function eye(x, y, r) { r = r || 5; return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r * .8 + '" ry="' + r + '" fill="#1a1440"/><circle cx="' + (x + r * .3) + '" cy="' + (y - r * .35) + '" r="' + r * .3 + '" fill="#fff"/>'; }
  function eyes(cx, y, gap, r) { return '<g class="k-eyes">' + eye(cx - gap, y, r) + eye(cx + gap, y, r) + '</g>'; }
  function cheeks(cx, y, gap) { return '<ellipse cx="' + (cx - gap) + '" cy="' + y + '" rx="6" ry="3.5" fill="#ff4f8b" opacity=".35"/><ellipse cx="' + (cx + gap) + '" cy="' + y + '" rx="6" ry="3.5" fill="#ff4f8b" opacity=".35"/>'; }
  function shine(x, y, rx, ry) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="#fff" opacity=".28" transform="rotate(-28 ' + x + ' ' + y + ')"/>'; }
  function floorShadow() { return '<ellipse cx="50" cy="95" rx="30" ry="4" fill="#000" opacity=".25"/>'; }

  var A = {
    cow: floorShadow() +
      '<path d="M30 30c-10-6-14-16-10-22 6 4 10 10 14 16Z M70 30c10-6 14-16 10-22-6 4-10 10-14 16Z" fill="url(#k-cream)"/>' +
      '<ellipse cx="18" cy="44" rx="13" ry="7" fill="url(#k-white)" transform="rotate(-20 18 44)"/><ellipse cx="82" cy="44" rx="13" ry="7" fill="url(#k-white)" transform="rotate(20 82 44)"/>' +
      '<rect x="22" y="26" width="56" height="64" rx="28" fill="url(#k-white)"/>' +
      '<path d="M24 46c4-14 14-18 24-14-2 10-12 18-24 14Z" fill="#2c2468"/>' +
      '<ellipse cx="50" cy="76" rx="24" ry="15" fill="url(#k-pink)"/><ellipse cx="42" cy="76" rx="3" ry="4" fill="#9e1f4d"/><ellipse cx="58" cy="76" rx="3" ry="4" fill="#9e1f4d"/>' +
      eyes(50, 52, 11, 5) + shine(36, 36, 9, 5),
    pig: floorShadow() +
      '<path d="M26 34 22 14 40 26Z M74 34 78 14 60 26Z" fill="url(#k-pink)"/>' +
      '<circle cx="50" cy="58" r="36" fill="url(#k-pink)"/>' +
      '<ellipse cx="50" cy="70" rx="15" ry="11" fill="#ffb3cc"/><ellipse cx="45" cy="70" rx="2.6" ry="4.5" fill="#9e1f4d"/><ellipse cx="55" cy="70" rx="2.6" ry="4.5" fill="#9e1f4d"/>' +
      eyes(50, 50, 13, 5) + cheeks(50, 64, 24) + shine(34, 36, 10, 6),
    duck: floorShadow() +
      '<path d="M48 22c-4-10 4-16 10-12-4 2-4 6-2 12Z" fill="url(#k-yellow)"/>' +
      '<circle cx="50" cy="58" r="35" fill="url(#k-yellow)"/>' +
      '<ellipse cx="22" cy="66" rx="9" ry="15" fill="#f2a81d" transform="rotate(20 22 66)"/><ellipse cx="78" cy="66" rx="9" ry="15" fill="#f2a81d" transform="rotate(-20 78 66)"/>' +
      '<ellipse cx="50" cy="68" rx="17" ry="8" fill="url(#k-orange)"/><path d="M34 68h32" stroke="#c24d1c" stroke-width="2" stroke-linecap="round"/><ellipse cx="44" cy="64" rx="5" ry="2" fill="#fff" opacity=".35"/>' +
      eyes(50, 50, 13, 5) + cheeks(50, 58, 25) + shine(34, 38, 10, 6),
    sheep: floorShadow() +
      (function () { var s = ""; for (var i = 0; i < 10; i++) { var a = i / 10 * Math.PI * 2; s += '<circle cx="' + (50 + Math.cos(a) * 30).toFixed(1) + '" cy="' + (56 + Math.sin(a) * 28).toFixed(1) + '" r="14" fill="url(#k-cream)"/>'; } return s; })() +
      '<circle cx="50" cy="56" r="30" fill="url(#k-cream)"/>' +
      '<ellipse cx="22" cy="58" rx="10" ry="5" fill="#2c2468" transform="rotate(18 22 58)"/><ellipse cx="78" cy="58" rx="10" ry="5" fill="#2c2468" transform="rotate(-18 78 58)"/>' +
      '<ellipse cx="50" cy="64" rx="18" ry="22" fill="url(#k-dark)"/>' +
      '<g class="k-eyes"><ellipse cx="43" cy="60" rx="4" ry="5" fill="#fff"/><ellipse cx="57" cy="60" rx="4" ry="5" fill="#fff"/><circle cx="44" cy="61" r="2.4" fill="#1a1440"/><circle cx="58" cy="61" r="2.4" fill="#1a1440"/></g>' +
      '<circle cx="40" cy="36" r="9" fill="#fff" opacity=".5"/>',
    horse: floorShadow() +
      '<path d="M34 28 30 8 46 22Z M66 28 70 8 54 22Z" fill="url(#k-brown)"/>' +
      '<rect x="26" y="20" width="48" height="74" rx="24" fill="url(#k-brown)"/>' +
      '<path d="M38 18c6-8 18-8 24 0-4 8-8 10-12 22-4-12-8-14-12-22Z" fill="#4a2a5e"/>' +
      '<ellipse cx="50" cy="80" rx="20" ry="13" fill="#e3a274"/><ellipse cx="43" cy="82" rx="2.6" ry="4" fill="#5a2c1a"/><ellipse cx="57" cy="82" rx="2.6" ry="4" fill="#5a2c1a"/>' +
      eyes(50, 52, 12, 5) + shine(36, 34, 8, 5),
    chicken: floorShadow() +
      '<circle cx="40" cy="22" r="8" fill="url(#k-red)"/><circle cx="51" cy="17" r="9" fill="url(#k-red)"/><circle cx="62" cy="22" r="8" fill="url(#k-red)"/>' +
      '<circle cx="50" cy="58" r="34" fill="url(#k-white)"/>' +
      '<path d="M42 60h16l-8 12Z" fill="url(#k-yellow)"/><ellipse cx="50" cy="78" rx="4" ry="6" fill="url(#k-red)"/>' +
      eyes(50, 50, 13, 5) + cheeks(50, 62, 24) + shine(34, 40, 10, 6),
    cat: floorShadow() +
      '<path d="M22 46 24 14 44 32Z M78 46 76 14 56 32Z" fill="url(#k-orange)"/><path d="M27 38 28 21 39 31Z M73 38 72 21 61 31Z" fill="#ffb3cc"/>' +
      '<ellipse cx="50" cy="60" rx="36" ry="32" fill="url(#k-orange)"/>' +
      '<path d="M50 30v10M42 31l2 9M58 31l-2 9" stroke="#e2602a" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M46 66h8l-4 4Z" fill="#9e1f4d"/><path d="M50 70c-2 4-6 4-8 2M50 70c2 4 6 4 8 2" stroke="#1a1440" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M20 64h14M20 70l14-2M80 64H66M80 70l-14-2" stroke="#fff" stroke-width="1.6" opacity=".7" stroke-linecap="round"/>' +
      eyes(50, 56, 13, 5) + shine(34, 42, 9, 5),
    dog: floorShadow() +
      '<ellipse cx="20" cy="54" rx="11" ry="22" fill="#7a3f22" transform="rotate(14 20 54)"/><ellipse cx="80" cy="54" rx="11" ry="22" fill="#7a3f22" transform="rotate(-14 80 54)"/>' +
      '<ellipse cx="50" cy="58" rx="32" ry="34" fill="url(#k-brown)"/>' +
      '<ellipse cx="62" cy="46" rx="11" ry="9" fill="#e3a274"/>' +
      '<ellipse cx="50" cy="74" rx="16" ry="12" fill="#e3a274"/><ellipse cx="50" cy="68" rx="6" ry="4.5" fill="#1a1440"/><path d="M46 82c2 6 6 6 8 0Z" fill="url(#k-pink)"/>' +
      eyes(50, 52, 12, 5) + shine(36, 38, 8, 5),
    mouse: floorShadow() +
      '<circle cx="22" cy="34" r="17" fill="url(#k-grey)"/><circle cx="78" cy="34" r="17" fill="url(#k-grey)"/><circle cx="22" cy="34" r="10" fill="#ffb3cc"/><circle cx="78" cy="34" r="10" fill="#ffb3cc"/>' +
      '<ellipse cx="50" cy="64" rx="28" ry="28" fill="url(#k-grey)"/>' +
      '<circle cx="50" cy="74" r="4" fill="url(#k-pink)"/><path d="M28 72h14M28 78l14-3M72 72H58M72 78l-14-3" stroke="#fff" stroke-width="1.4" opacity=".7" stroke-linecap="round"/>' +
      eyes(50, 60, 10, 4.5) + shine(38, 48, 7, 4),
    rabbit: floorShadow() +
      '<ellipse cx="37" cy="24" rx="8" ry="22" fill="url(#k-white)" transform="rotate(-8 37 24)"/><ellipse cx="63" cy="24" rx="8" ry="22" fill="url(#k-white)" transform="rotate(8 63 24)"/>' +
      '<ellipse cx="37" cy="26" rx="4" ry="15" fill="#ffb3cc" transform="rotate(-8 37 26)"/><ellipse cx="63" cy="26" rx="4" ry="15" fill="#ffb3cc" transform="rotate(8 63 26)"/>' +
      '<ellipse cx="50" cy="66" rx="30" ry="27" fill="url(#k-white)"/>' +
      '<path d="M46 70h8l-4 4Z" fill="url(#k-pink)"/><rect x="46" y="76" width="8" height="7" rx="2" fill="#fff" stroke="#d7d2f0"/>' +
      eyes(50, 62, 11, 4.5) + cheeks(50, 74, 20) + shine(38, 52, 8, 5),
    frog: floorShadow() +
      '<circle cx="32" cy="36" r="14" fill="url(#k-green)"/><circle cx="68" cy="36" r="14" fill="url(#k-green)"/>' +
      '<ellipse cx="50" cy="66" rx="38" ry="27" fill="url(#k-green)"/>' +
      '<circle cx="32" cy="35" r="8" fill="#fff"/><circle cx="68" cy="35" r="8" fill="#fff"/><g class="k-eyes"><circle cx="33" cy="36" r="4.5" fill="#1a1440"/><circle cx="69" cy="36" r="4.5" fill="#1a1440"/></g>' +
      '<path d="M30 68c10 10 30 10 40 0" stroke="#1a1440" stroke-width="3" fill="none" stroke-linecap="round"/>' + cheeks(50, 64, 28) + shine(34, 54, 9, 5),
    teddy: floorShadow() +
      '<circle cx="24" cy="30" r="13" fill="url(#k-gold)"/><circle cx="76" cy="30" r="13" fill="url(#k-gold)"/><circle cx="24" cy="30" r="6" fill="#e09a12"/><circle cx="76" cy="30" r="6" fill="#e09a12"/>' +
      '<circle cx="50" cy="58" r="34" fill="url(#k-gold)"/>' +
      '<ellipse cx="50" cy="70" rx="15" ry="11" fill="#fff0c8"/><ellipse cx="50" cy="65" rx="6" ry="4" fill="#1a1440"/><path d="M50 69v5M45 76c3 2 7 2 10 0" stroke="#1a1440" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
      eyes(50, 50, 12, 4.5) + shine(34, 38, 9, 5)
  };


  /* objects for word pictures, same light-from-top-left style */
  var T = {
    apple: sh(30) + '<path d="M50 30c-6-12-2-20 6-22-1 8-2 14-6 22Z" fill="#8a4724"/><path d="M54 24c6-10 18-10 22-4-8 6-14 6-22 4Z" fill="url(#k-green)"/><path d="M50 32c-16-10-38-2-36 24 2 22 18 36 36 32 18 4 34-10 36-32 2-26-20-34-36-24Z" fill="url(#k-red)"/>' + shine(32, 44, 7, 11),
    banana: sh(34) + '<path d="M18 30c4 36 30 56 66 44 6-2 6-8 0-8-30 6-48-12-54-38-2-8-12-6-12 2Z" fill="url(#k-yellow)"/><path d="M14 26l6-2 2 6-6 2Z" fill="#8a4724"/><path d="M30 40c6 16 18 26 34 28" stroke="#fff" stroke-width="4" opacity=".35" fill="none" stroke-linecap="round"/>',
    unicorn: floorShadow() +
      '<ellipse cx="24" cy="48" rx="13" ry="20" fill="url(#k-pink)" transform="rotate(14 24 48)"/><ellipse cx="22" cy="68" rx="9" ry="14" fill="url(#k-violet)" transform="rotate(8 22 68)"/><ellipse cx="78" cy="46" rx="11" ry="17" fill="url(#k-violet)" transform="rotate(-14 78 46)"/><ellipse cx="80" cy="66" rx="8" ry="12" fill="url(#k-teal)" transform="rotate(-8 80 66)"/>' +
      '<path d="M32 36 30 14 46 28Z M68 36 70 14 54 28Z" fill="url(#k-white)"/><path d="M33 33 32 21 41 29Z M67 33 68 21 59 29Z" fill="#ff9fc0"/>' +
      '<circle cx="50" cy="60" r="32" fill="url(#k-white)"/>' +
      '<path d="M50 -2 39 36h22Z" fill="url(#k-gold)"/><path d="M43.5 24h13M46.5 13h7" stroke="#e09a12" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M36 36c4-10 10-12 14-8-2 6-8 10-14 8Z" fill="url(#k-violet)"/>' +
      '<ellipse cx="50" cy="76" rx="11" ry="7" fill="#ffe0ec"/><circle cx="46.5" cy="76" r="1.6" fill="#d9306c"/><circle cx="53.5" cy="76" r="1.6" fill="#d9306c"/><path d="M45 82q5 3 10 0" stroke="#d9306c" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      eyes(50, 54, 13, 5) + cheeks(50, 66, 24) + shine(34, 44, 9, 5),
    crocodile: sh(34) +
      '<circle cx="34" cy="30" r="12" fill="url(#k-green)"/><circle cx="66" cy="30" r="12" fill="url(#k-green)"/>' +
      '<rect x="14" y="30" width="72" height="58" rx="28" fill="url(#k-green)"/>' +
      '<ellipse cx="50" cy="70" rx="30" ry="18" fill="#a8f0a0"/>' +
      '<path d="M26 72c8 8 40 8 48 0" stroke="#1a1440" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M32 74l3 6 3-5.5 M44 77l3 6 3-6 M58 76l3 5.5 3-6" stroke="#fff" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<ellipse cx="42" cy="58" rx="2.4" ry="2.8" fill="#1a1440"/><ellipse cx="58" cy="58" rx="2.4" ry="2.8" fill="#1a1440"/>' +
      '<g class="k-eyes">' + eye(34, 30, 6) + eye(66, 30, 6) + '</g>' + shine(32, 46, 8, 4),
    penguin: sh(30) +
      '<ellipse cx="22" cy="62" rx="9" ry="20" fill="url(#k-dark)" transform="rotate(14 22 62)"/><ellipse cx="78" cy="62" rx="9" ry="20" fill="url(#k-dark)" transform="rotate(-14 78 62)"/>' +
      '<ellipse cx="38" cy="92" rx="11" ry="5" fill="url(#k-orange)"/><ellipse cx="62" cy="92" rx="11" ry="5" fill="url(#k-orange)"/>' +
      '<ellipse cx="50" cy="56" rx="30" ry="36" fill="url(#k-dark)"/><ellipse cx="50" cy="66" rx="20" ry="26" fill="url(#k-white)"/>' +
      '<ellipse cx="50" cy="44" rx="20" ry="14" fill="url(#k-white)"/>' +
      '<path d="M43 50h14l-7 10Z" fill="url(#k-orange)"/>' +
      eyes(50, 42, 10, 4.5) + cheeks(50, 50, 17) + shine(34, 34, 7, 4),
    snake: sh(32) +
      '<path d="M24 84H66a12 12 0 0 0 0-24H34a12 12 0 0 1 0-24H56" fill="none" stroke="#33a24f" stroke-width="17" stroke-linecap="round"/>' +
      '<path d="M24 84H66a12 12 0 0 0 0-24H34a12 12 0 0 1 0-24H56" fill="none" stroke="#58d26b" stroke-width="12" stroke-linecap="round"/>' +
      '<g fill="#ffd23f"><circle cx="40" cy="84" r="3"/><circle cx="58" cy="84" r="3"/><circle cx="46" cy="60" r="3"/><circle cx="52" cy="36" r="0"/></g>' +
      '<circle cx="64" cy="36" r="16" fill="url(#k-green)"/><path d="M80 36h10m0 0 4-3m-4 3 4 3" stroke="#ff4d5e" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
      eyes(64, 31, 7, 4) + shine(58, 28, 6, 3.5),
    lion: sh(34) +
      (function () { var m = ""; for (var i = 0; i < 12; i++) { var a = i / 12 * Math.PI * 2; m += '<circle cx="' + (50 + Math.cos(a) * 29).toFixed(1) + '" cy="' + (54 + Math.sin(a) * 29).toFixed(1) + '" r="14" fill="url(#k-brown)"/>'; } return m; })() +
      '<circle cx="50" cy="54" r="31" fill="url(#k-orange)"/>' +
      '<circle cx="27" cy="28" r="9" fill="url(#k-yellow)"/><circle cx="73" cy="28" r="9" fill="url(#k-yellow)"/>' +
      '<circle cx="50" cy="56" r="25" fill="url(#k-yellow)"/>' +
      '<ellipse cx="50" cy="68" rx="14" ry="10" fill="url(#k-cream)"/><path d="M44 62h12l-6 7Z" fill="#d9306c"/><path d="M50 69v4M44 74c3 3 9 3 12 0" stroke="#8a4724" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      eyes(50, 50, 12, 4.6) + cheeks(50, 60, 21) + shine(36, 40, 8, 5),
    turtle: sh(36) +
      '<ellipse cx="26" cy="84" rx="11" ry="8" fill="url(#k-teal)"/><ellipse cx="62" cy="86" rx="11" ry="7" fill="url(#k-teal)"/>' +
      '<circle cx="82" cy="56" r="14" fill="url(#k-teal)"/>' +
      '<path d="M8 78C8 44 26 28 46 28s36 16 36 50Z" fill="url(#k-green)"/>' +
      '<path d="M46 30v46M26 44c8 6 12 18 12 32M66 44c-8 6-12 18-12 32" stroke="#33a24f" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M8 78h74" stroke="#2c6a3a" stroke-width="5" stroke-linecap="round"/>' +
      eye(86, 52, 4.2) + '<path d="M84 62q4 3 8 0" stroke="#119a8a" stroke-width="2.2" fill="none" stroke-linecap="round"/>' + shine(30, 42, 9, 5),
    parrot: sh(28) +
      '<path d="M42 78 36 98 46 94 50 100 54 94 64 98 58 78Z" fill="url(#k-teal)"/>' +
      '<ellipse cx="50" cy="66" rx="26" ry="28" fill="url(#k-red)"/><ellipse cx="50" cy="72" rx="15" ry="19" fill="url(#k-yellow)"/>' +
      '<ellipse cx="22" cy="68" rx="9" ry="20" fill="url(#k-blue)" transform="rotate(10 22 68)"/><ellipse cx="78" cy="68" rx="9" ry="20" fill="url(#k-blue)" transform="rotate(-10 78 68)"/>' +
      '<path d="M44 16c-2-8 6-12 10-8-4 0-4 4-2 8Z" fill="url(#k-red)"/>' +
      '<circle cx="50" cy="36" r="23" fill="url(#k-red)"/>' +
      '<circle cx="39" cy="34" r="8.5" fill="#fff"/><circle cx="61" cy="34" r="8.5" fill="#fff"/>' +
      '<circle cx="40" cy="35" r="4.4" fill="#1a1440"/><circle cx="62" cy="35" r="4.4" fill="#1a1440"/><circle cx="41.4" cy="33.4" r="1.5" fill="#fff"/><circle cx="63.4" cy="33.4" r="1.5" fill="#fff"/>' +
      '<path d="M42 42c0-6 16-6 16 0 0 10-5 18-8 18s-8-8-8-18Z" fill="url(#k-orange)"/>' + shine(36, 24, 7, 4),
    ball: sh(30) + '<circle cx="50" cy="54" r="34" fill="url(#k-white)"/><path d="M50 20c-14 12-14 56 0 68M16 54h68" stroke="#ff4f8b" stroke-width="7" fill="none"/><path d="M26 30c16 10 32 10 48 0M26 78c16-10 32-10 48 0" stroke="#3aa0ff" stroke-width="6" fill="none"/>' + shine(36, 36, 8, 5),
    car: sh(40) + '<path d="M12 74V58l12-4 10-18h30l14 18 10 4v16Z" fill="url(#k-red)"/><path d="M38 40h12v14H30Z M54 40h8l10 14H54Z" fill="#bfe6fb"/><circle cx="30" cy="76" r="10" fill="#1a1440"/><circle cx="72" cy="76" r="10" fill="#1a1440"/><circle cx="30" cy="76" r="4" fill="#9aa3c7"/><circle cx="72" cy="76" r="4" fill="#9aa3c7"/><rect x="84" y="60" width="6" height="5" rx="2" fill="#ffd23f"/>',
    bus: sh(40) + '<rect x="10" y="26" width="80" height="52" rx="10" fill="url(#k-yellow)"/><g fill="#bfe6fb"><rect x="16" y="34" width="16" height="16" rx="3"/><rect x="36" y="34" width="16" height="16" rx="3"/><rect x="56" y="34" width="16" height="16" rx="3"/><rect x="76" y="34" width="9" height="24" rx="3"/></g><rect x="10" y="60" width="80" height="6" fill="#f2a81d"/><circle cx="28" cy="80" r="9" fill="#1a1440"/><circle cx="72" cy="80" r="9" fill="#1a1440"/>',
    house: sh(36) + '<rect x="22" y="46" width="56" height="42" fill="url(#k-cream)"/><path d="M14 50 50 18l36 32Z" fill="url(#k-red)"/><rect x="44" y="62" width="14" height="26" rx="3" fill="url(#k-brown)"/><rect x="28" y="56" width="12" height="12" rx="2" fill="#7ec8ff"/><rect x="64" y="56" width="10" height="12" rx="2" fill="#7ec8ff"/><rect x="64" y="22" width="8" height="16" fill="url(#k-brown)"/>',
    tree: sh(30) + '<rect x="44" y="58" width="12" height="32" rx="4" fill="url(#k-brown)"/><circle cx="50" cy="40" r="26" fill="url(#k-green)"/><circle cx="32" cy="54" r="16" fill="url(#k-green)"/><circle cx="68" cy="54" r="16" fill="#33a24f"/>' + shine(40, 26, 8, 5),
    sun: '<circle cx="50" cy="50" r="46" fill="url(#k-glow)"/><g stroke="#ffd23f" stroke-width="6" stroke-linecap="round"><path d="M50 8v10M50 82v10M8 50h10M82 50h10M20 20l7 7M73 73l7 7M80 20l-7 7M27 73l-7 7"/></g><circle cx="50" cy="50" r="24" fill="url(#k-yellow)"/>' + shine(42, 40, 7, 4),
    moon: '<circle cx="50" cy="50" r="46" fill="url(#k-glow)" opacity=".7"/><path d="M60 14a36 36 0 1 0 26 52A30 30 0 0 1 60 14Z" fill="url(#k-gold)"/><circle cx="40" cy="52" r="5" fill="#e09a12" opacity=".5"/><circle cx="52" cy="72" r="4" fill="#e09a12" opacity=".5"/>',
    star: '<circle cx="50" cy="52" r="44" fill="url(#k-glow)" opacity=".6"/><path d="M50 12l11 24 26 3-19 18 5 26-23-13-23 13 5-26-19-18 26-3Z" fill="url(#k-yellow)" stroke="#f2a81d" stroke-width="3" stroke-linejoin="round"/>',
    fish: sh(34) + '<path d="M70 52 92 36v34Z" fill="url(#k-orange)"/><ellipse cx="46" cy="52" rx="32" ry="22" fill="url(#k-orange)"/><path d="M38 34c6 6 6 30 0 36" stroke="#fff" stroke-width="4" opacity=".4" fill="none"/>' + eye(28, 48, 4.5),
    flower: sh(30) + '<path d="M50 56v34" stroke="#33a24f" stroke-width="6"/><path d="M50 80c-10-10-22-8-24-2 8 4 16 6 24 2Z" fill="url(#k-green)"/>' + (function () { var p = ""; for (var i = 0; i < 6; i++) { var a = i / 6 * Math.PI * 2; p += '<circle cx="' + (50 + Math.cos(a) * 18).toFixed(1) + '" cy="' + (38 + Math.sin(a) * 18).toFixed(1) + '" r="13" fill="url(#k-pink)"/>'; } return p; })() + '<circle cx="50" cy="38" r="11" fill="url(#k-yellow)"/>',
    book: sh(36) + '<path d="M14 26c12-4 24-4 36 4v58c-12-8-24-8-36-4Z" fill="url(#k-blue)"/><path d="M86 26c-12-4-24-4-36 4v58c12-8 24-8 36-4Z" fill="url(#k-violet)"/><path d="M20 30c10-2 20-2 28 4v50c-8-5-18-6-28-4ZM80 30c-10-2-20-2-28 4v50c8-5 18-6 28-4Z" fill="#fffdf6"/><path d="M26 44h16M26 52h16M58 44h16M58 52h16" stroke="#c9c2e8" stroke-width="3"/>',
    shoe: sh(38) + '<path d="M12 74V48c10 0 14-8 16-16h22c0 14 8 20 22 22 12 2 18 8 18 20Z" fill="url(#k-blue)"/><rect x="10" y="72" width="82" height="10" rx="5" fill="url(#k-white)"/><path d="M34 42l8 6M30 50l8 6M28 58l8 6" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
    cake: sh(34) + '<rect x="18" y="50" width="64" height="38" rx="6" fill="url(#k-pink)"/><path d="M18 58c8 8 12-6 20 0s12-6 20 0 12-6 24 0V50H18Z" fill="url(#k-cream)"/><rect x="46" y="28" width="8" height="22" rx="3" fill="url(#k-blue)"/><path d="M50 14c-6 8-6 12 0 14 6-2 6-6 0-14Z" fill="url(#k-yellow)"/><circle cx="50" cy="20" r="14" fill="url(#k-glow)" opacity=".7"/>',
    cookie: sh(32) + '<circle cx="50" cy="52" r="34" fill="url(#k-gold)"/><g fill="#6b3a1e"><circle cx="38" cy="40" r="5"/><circle cx="60" cy="38" r="4"/><circle cx="62" cy="60" r="5"/><circle cx="40" cy="64" r="4"/><circle cx="52" cy="52" r="3.5"/></g>' + shine(36, 32, 8, 4),
    milk: sh(26) + '<path d="M30 30h40v58H30Z" fill="url(#k-white)"/><path d="M30 30 40 14h20l10 16Z" fill="url(#k-blue)"/><rect x="30" y="46" width="40" height="22" fill="url(#k-blue)"/><path d="M38 56c4-6 8-6 12 0s8 6 12 0" stroke="#fff" stroke-width="3" fill="none"/>',
    balloon: '<path d="M50 72c-2 8 4 12 0 22" stroke="#fff" stroke-width="2" fill="none"/><ellipse cx="50" cy="40" rx="26" ry="31" fill="url(#k-red)"/><path d="M46 70h8l-4 6Z" fill="#d22f44"/>' + shine(40, 26, 6, 9),
    elephant: sh(36) + '<ellipse cx="22" cy="46" rx="16" ry="20" fill="url(#k-grey)"/><ellipse cx="78" cy="46" rx="16" ry="20" fill="url(#k-grey)"/><circle cx="50" cy="48" r="28" fill="url(#k-grey)"/><path d="M44 62c0 14 2 24 10 28 6 2 8-4 4-6-4-2-4-10-4-22Z" fill="url(#k-grey)"/>' + eyes(50, 44, 11, 4.5) + cheeks(50, 56, 20) + shine(38, 30, 8, 5),
    bear: '',
    umbrella: sh(26) + '<path d="M50 50v32c0 8-10 8-10 0" stroke="#1a1440" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M8 52c0-24 18-40 42-40s42 16 42 40c-7-6-14-6-21 0-7-6-14-6-21 0-7-6-14-6-21 0-7-6-14-6-21 0Z" fill="url(#k-blue)"/><path d="M50 12c-10 10-14 24-14 40M50 12c10 10 14 24 14 40" stroke="#2273d6" stroke-width="3" fill="none"/>',
    rainbow: '<path d="M10 78a40 40 0 0 1 80 0" stroke="#ff4d5e" stroke-width="9" fill="none"/><path d="M19 78a31 31 0 0 1 62 0" stroke="#ffd23f" stroke-width="9" fill="none"/><path d="M28 78a22 22 0 0 1 44 0" stroke="#20c9b0" stroke-width="9" fill="none"/><path d="M37 78a13 13 0 0 1 26 0" stroke="#8b5cf6" stroke-width="9" fill="none"/><ellipse cx="14" cy="80" rx="12" ry="7" fill="#fff"/><ellipse cx="86" cy="80" rx="12" ry="7" fill="#fff"/>',
    butterfly: '<ellipse cx="32" cy="38" rx="18" ry="22" fill="url(#k-pink)" transform="rotate(-20 32 38)"/><ellipse cx="68" cy="38" rx="18" ry="22" fill="url(#k-pink)" transform="rotate(20 68 38)"/><ellipse cx="34" cy="68" rx="13" ry="15" fill="url(#k-violet)"/><ellipse cx="66" cy="68" rx="13" ry="15" fill="url(#k-violet)"/><rect x="46" y="28" width="8" height="52" rx="4" fill="#1a1440"/><path d="M48 28c-4-10-10-14-14-14M52 28c4-10 10-14 14-14" stroke="#1a1440" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="32" cy="36" r="5" fill="url(#k-yellow)"/><circle cx="68" cy="36" r="5" fill="url(#k-yellow)"/>',
    train: sh(40) + '<rect x="40" y="34" width="50" height="42" rx="6" fill="url(#k-red)"/><rect x="10" y="48" width="36" height="28" rx="6" fill="url(#k-red)"/><rect x="54" y="42" width="24" height="16" rx="3" fill="#bfe6fb"/><rect x="16" y="30" width="10" height="20" rx="3" fill="url(#k-dark)"/><circle cx="20" cy="22" r="7" fill="#fff" opacity=".8"/><circle cx="28" cy="14" r="5" fill="#fff" opacity=".6"/><circle cx="26" cy="80" r="9" fill="#1a1440"/><circle cx="72" cy="80" r="9" fill="#1a1440"/><circle cx="50" cy="82" r="7" fill="#1a1440"/>',
    rocket: '<path d="M50 8c16 12 22 36 16 62H34C28 44 34 20 50 8Z" fill="url(#k-white)"/><circle cx="50" cy="38" r="9" fill="#3aa0ff" stroke="#9aa3c7" stroke-width="3"/><path d="M34 52 20 70l14 2Z M66 52l14 18-14 2Z" fill="url(#k-red)"/><path d="M40 70h20l-4 10h-12Z" fill="url(#k-grey)"/><path d="M44 80c0 10 6 14 6 14s6-4 6-14Z" fill="url(#k-orange)"/>',
    strawberry: sh(30) + '<path d="M50 30c-24-2-34 14-28 30 6 16 20 28 28 30 8-2 22-14 28-30 6-16-4-32-28-30Z" fill="url(#k-red)"/><path d="M34 26l16 8 16-8-8 10H42Z" fill="url(#k-green)"/><g fill="#ffe58a"><circle cx="38" cy="50" r="2"/><circle cx="52" cy="46" r="2"/><circle cx="64" cy="54" r="2"/><circle cx="44" cy="64" r="2"/><circle cx="58" cy="70" r="2"/></g>'
  };
  T.bear = A.teddy;
  function sh(rx) { return '<ellipse cx="50" cy="94" rx="' + rx + '" ry="4" fill="#000" opacity=".22"/>'; }
  /* emoji used by the older games, mapped to drawings */
  var EMO = { "🍎": "apple", "🍌": "banana", "⚽": "ball", "🚗": "car", "🚌": "bus", "🏠": "house", "🌳": "tree", "🌞": "sun", "☀️": "sun", "🌙": "moon", "⭐": "star", "🐟": "fish", "🌸": "flower", "📖": "book", "👟": "shoe", "🎂": "cake", "🍪": "cookie", "🥛": "milk", "🎈": "balloon", "🐘": "elephant", "🐻": "bear", "🧸": "teddy", "☂️": "umbrella", "🌈": "rainbow", "🦋": "butterfly", "🚂": "train", "🚀": "rocket", "🍓": "strawberry",
    "🐶": "dog", "🐱": "cat", "🐮": "cow", "🐷": "pig", "🦆": "duck", "🐑": "sheep", "🐴": "horse", "🐔": "chicken", "🐭": "mouse", "🐰": "rabbit", "🐸": "frog" };
  function art(id) { return A[id] || T[id] || ""; }
  /* backdrop behind a game. mode: "night" (indigo, stars, moon) or "day" (blue sky, clouds, sun, green hills).
     opts.hills / opts.moon / opts.sun / opts.clouds = false to leave one out; opts.ground = "grass" | "none" */
  function sky(el, opts) {
    opts = opts || {};
    var t = window.LPPlaces ? LPPlaces.tod() : "day";
    var outdoor = opts.mode === "day";
    // outdoor games follow the child's clock; after dark they become the night sky
    var day = outdoor && t !== "night";
    el.classList.add("k-sky"); if (day) el.classList.add("k-day", "k-" + t); if (outdoor && t === "night") el.classList.add("k-outnight");
    skies.push({ el: el, opts: opts });
    var hills = document.createElement("div"); hills.className = "k-hills"; hills.setAttribute("aria-hidden", "true");
    var h = !outdoor ? [C.hill1, C.hill2, C.hill3] : t === "night" ? ["#1f3d5c", "#26506b", "#2f6279"] : t === "evening" ? ["#3f7a5e", "#4f8f68", "#5fa070"] : ["#3fae6a", "#4fc777", "#68dc87"];
    hills.innerHTML = '<svg viewBox="0 0 1000 300" preserveAspectRatio="none"><path d="M0 120C160 40 300 60 420 110S700 40 1000 90V300H0Z" fill="' + h[0] + '"/><path d="M0 180C200 110 340 140 520 170S820 110 1000 150V300H0Z" fill="' + h[1] + '"/><path d="M0 240C220 190 420 210 600 230S860 200 1000 220V300H0Z" fill="' + h[2] + '"/></svg>';
    if (opts.hills !== false) { el.prepend(hills); var pl = document.createElement("div"); pl.className = "k-places"; pl.setAttribute("aria-hidden", "true"); el.prepend(pl); renderPlaces(pl); }
    if (day) {
      if (opts.clouds !== false) {
        var cl = document.createElement("div"); cl.className = "k-clouds"; cl.setAttribute("aria-hidden", "true");
        var seed = 3; function r() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
        for (var i = 0; i < 5; i++) {
          var c = document.createElement("div"); c.className = "k-cloud";
          c.style.left = (i * 22 + r() * 10 - 6) + "%"; c.style.top = (6 + r() * 30) + "%"; c.style.setProperty("--s", (.6 + r() * .7).toFixed(2)); c.style.animationDuration = (60 + r() * 50) + "s"; c.style.animationDelay = (-r() * 60) + "s";
          c.innerHTML = '<svg viewBox="0 0 160 70"><path d="M20 62h124a18 18 0 0 0 0-36 26 26 0 0 0-48-12 22 22 0 0 0-38 10 18 18 0 0 0-38 38Z" fill="#fff"/><path d="M20 62h124a18 18 0 0 0 10-6H8a18 18 0 0 0 12 6Z" fill="#cfe6ff"/></svg>';
          cl.appendChild(c);
        }
        el.prepend(cl);
      }
      if (opts.sun !== false) { var sn = document.createElement("div"); sn.className = "k-sun"; sn.setAttribute("aria-hidden", "true"); el.prepend(sn); }
      return;
    }
    var cv = document.createElement("canvas"); cv.className = "k-stars"; el.prepend(cv);
    if (opts.moon !== false) { var m = document.createElement("div"); m.className = "k-moon"; m.setAttribute("aria-hidden", "true"); el.prepend(m); }
    function draw() {
      var d = Math.min(2, devicePixelRatio || 1), w = el.clientWidth, hh = el.clientHeight;
      cv.width = w * d; cv.height = hh * d; var g = cv.getContext("2d"); if (!g) return; g.setTransform(d, 0, 0, d, 0, 0);
      var n = Math.round(w * hh / 9000), seed = 7;
      function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
      for (var i = 0; i < n; i++) { var x = rnd() * w, y = rnd() * hh * .7, rr = rnd() < .9 ? rnd() * 1.2 + .4 : 2; g.globalAlpha = .35 + rnd() * .6; g.fillStyle = rnd() < .2 ? "#ffd23f" : "#ffffff"; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); }
    }
    draw(); addEventListener("resize", draw);
  }

  var skies = [];
  function lang() { return window.LP_LANG || (window.LP && window.LP.lang) || "en"; }
  function renderPlaces(pl) { pl.innerHTML = window.LPPlaces ? LPPlaces.strip(lang()) : ""; }
  function refreshPlaces() { document.querySelectorAll(".k-places").forEach(renderPlaces); }
  addEventListener("lp-lang", refreshPlaces);
  // places.js sits next to this file; load it and draw the landmarks once it arrives
  (function () {
    if (window.LPPlaces) return;
    var me = document.currentScript && document.currentScript.src;
    var sc = document.createElement("script"); sc.src = me ? me.replace(/look\.js(\?.*)?$/, "places.js") : "places.js";
    sc.onload = function () { refreshPlaces(); skies.splice(0).forEach(function (k) { if (k.el.dataset.kRedone) return; k.el.dataset.kRedone = 1; k.el.querySelectorAll(".k-hills,.k-places,.k-clouds,.k-sun,.k-moon,.k-stars").forEach(function (n) { n.remove(); }); k.el.classList.remove("k-day", "k-morning", "k-day", "k-evening", "k-outnight"); sky(k.el, k.opts); }); };
    (document.head || document.documentElement).appendChild(sc);
  })();

  /* a flat button/panel look for game UI */
  var css = document.createElement("style");
  css.textContent =
    ".k-sky{position:relative;isolation:isolate;background:radial-gradient(120% 90% at 20% 0%," + C.night3 + " 0%," + C.night2 + " 45%," + C.night + " 100%)}" +
    ".k-stars{position:absolute;inset:0;width:100%;height:100%;z-index:-2;pointer-events:none}" +
    ".k-hills{position:absolute;left:0;right:0;bottom:0;height:38%;z-index:-1;pointer-events:none}.k-hills svg{width:100%;height:100%;display:block}" +
    ".k-moon{position:absolute;left:4%;top:3%;width:min(8vw,64px);aspect-ratio:1;border-radius:50%;z-index:-1;pointer-events:none;background:radial-gradient(circle at 38% 34%,#fffbe6,#ffe58a 55%,#f2b938);box-shadow:0 0 40px 14px #ffd23f55,0 0 120px 50px #ffd23f22}" +
    ".k-bubble{unicode-bidi:plaintext;font-family:'Fredoka','Baloo 2',system-ui,sans-serif;font-weight:600;color:#1c3f4a;background:#f6ead0;border:2px dashed #b8401f88;border-radius:26px;padding:8px 28px;text-align:center;box-shadow:0 4px 0 #c9b583,0 10px 20px #0004}" +
    ".k-day{background:linear-gradient(#2f6fe8 0%,#4f9cff 45%,#9fdcff 100%)}" +
    ".k-morning{background:linear-gradient(#5b6ee8 0%,#f08fb0 55%,#ffd29a 100%)}" +
    ".k-evening{background:linear-gradient(#3a2a86 0%,#d9607e 55%,#ffad66 100%)}" +
    ".k-morning .k-sun{left:8%;right:auto;top:30%;background:radial-gradient(circle at 38% 34%,#fffbe6,#ffd27a 55%,#ff9a52)}" +
    ".k-evening .k-sun{right:10%;top:34%;background:radial-gradient(circle at 38% 34%,#fff1d6,#ffb36b 55%,#ff6b4a);box-shadow:0 0 60px 24px #ff8a3d77}" +
    ".k-morning .k-cloud path:first-child,.k-evening .k-cloud path:first-child{fill:#fff3f6}" +
    ".k-places{position:absolute;left:0;right:0;bottom:22%;height:26%;z-index:-1;pointer-events:none;color:rgba(30,40,120,.28)}.k-places svg{width:100%;height:100%;display:block}" +
    ".k-sky:not(.k-day) .k-places{color:rgba(160,150,255,.22)}" +
    ".k-evening .k-places{color:rgba(60,20,90,.35)}" +
    ".k-clouds{position:absolute;inset:0 0 30% 0;z-index:-1;pointer-events:none;overflow:hidden}" +
    ".k-cloud{position:absolute;width:calc(160px*var(--s,1));opacity:.95;animation:k-drift linear infinite}.k-cloud svg{width:100%;display:block}" +
    "@keyframes k-drift{from{transform:translateX(-30vw)}to{transform:translateX(130vw)}}" +
    ".k-sun{position:absolute;right:6%;top:6%;width:min(10vw,84px);aspect-ratio:1;border-radius:50%;z-index:-1;pointer-events:none;background:radial-gradient(circle at 38% 34%,#fffbe6,#ffe066 50%,#ffb000);box-shadow:0 0 50px 20px #ffe06688,0 0 140px 60px #ffd23f33}" +
    ".k-day .k-bubble{background:#f6ead0;border-color:#b8401f88}" +
    ".k-btn{font-family:'Fredoka','Baloo 2',system-ui,sans-serif;font-weight:600;color:#fff;background:#ffffff22;border:2px solid #ffffff44;border-radius:999px;padding:8px 18px;cursor:pointer;box-shadow:0 6px 16px #0003}" +
    ".k-btn.on,.k-btn[aria-pressed=true]{background:linear-gradient(#ffe27a,#ffc23d);color:#1a1440;border-color:#fff8}" +
    "@media (prefers-reduced-motion:reduce){.k-cloud{animation:none}}" +
    ".lp-go{background:linear-gradient(#ffe27a,#ffc23d)!important;border-color:#fff8!important;box-shadow:0 10px 0 #c98a12,0 0 60px #ffd23f66!important}" +
    ".lp-start{background:#140f3acc!important}";
  (document.head || document.documentElement).appendChild(css);

  var cache = {};
  function svg(id) { var a = art(id); return a ? '<svg viewBox="0 0 100 100" aria-hidden="true">' + a + "</svg>" : ""; }
  window.LPLook = { C: C, sky: sky, animal: svg, pic: svg, has: function (id) { return !!art(id); },
    /* an Image of a drawing, for canvas games (null if there is no drawing) */
    image: function (key) {
      var id = EMO[key] || EMO[String(key).replace(/\uFE0F/g, "")] || key, a = art(id); if (!a) return null;
      cache[id] = cache[id] || (function () { var im = new Image(); im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200"><defs>' + defsInner() + "</defs>" + a + "</svg>"); return im; })();
      return cache[id];
    },
    fromEmoji: function (e) { var id = EMO[e] || EMO[String(e).replace(/\uFE0F/g, "")]; return id ? svg(id) : ""; },
    eye: eye, eyes: eyes, shine: shine, defs: defsInner };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", defs); else defs();
})();

/* One look for every game: a stitched-paper title tag ("Charlie's" big, the game's name small)
   and the same white stitched paper for every spoken line. */
(function () {
  var G = (location.pathname.match(/([a-z]+)\.html/) || [])[1] || "";
  var TITLES = { ark: "Noah's Ark", dress: "Get dressed", drum: "Drum Parade", face: "Where's your nose?", farm: "Old MacDonald's Farm",
    flappy: "Flappy Words", market: "At the market", munch: "Munch Munch", night: "Goodnight room", paint: "Paint the World",
    pairs: "Pairs", peek: "Peekaboo", sky: "Sky Words", soup: "Little Soup Pot", street: "Street sounds", train: "Word Train" };
  var title = TITLES[G] || document.title;
  var PAPER = "background:#fffdf6!important;color:#1c3f4a!important;text-shadow:none!important;-webkit-text-stroke:0!important;border:0!important;border-radius:22px!important;" +
    "outline:2px dashed #b8401f99;outline-offset:-6px;box-shadow:0 4px 0 #d9c9a2,0 10px 18px #0004!important;backdrop-filter:none!important;" +
    "font-family:'Fredoka','Baloo 2',system-ui,sans-serif;font-weight:600;padding:8px 28px!important;";
  var s = document.createElement("style");
  s.textContent =
    ":root{--lp-top:72px}" +
    "#lpTitle{position:fixed;top:max(8px,env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%) rotate(-.5deg);z-index:900;pointer-events:none;white-space:nowrap;" +
    "background:#fffdf6;border-radius:18px;padding:6px 28px 7px;text-align:center;line-height:1;outline:2px dashed #b8401f99;outline-offset:-6px;" +
    "box-shadow:0 4px 0 #d9c9a2,0 10px 18px #0004;font-family:'Fredoka','Baloo 2',system-ui,sans-serif;color:#1c3f4a;max-width:92vw}" +
    "#lpTitle b{display:block;font-size:clamp(22px,4vw,34px);font-weight:700;overflow:hidden;text-overflow:ellipsis}" +
    "#lpTitle small{display:block;font-size:clamp(13px,1.9vw,17px);font-weight:600;opacity:.75;margin-top:3px;letter-spacing:.02em}" +
    "html.lp-intro #lpTitle{display:none}" +
    /* spoken lines */
    "#bubble,.k-bubble,body.lp-drum #word,body.lp-sky #prompt,body.lp-soup .word,body.lp-soup .bubble-say,body.lp-farm #lyric,body.lp-flappy #word{" + PAPER + "}" +
    "#bubble:empty,body.lp-drum #word:empty{visibility:hidden}" +
    "body.lp-farm #lyric{width:max-content!important;max-width:94%!important;margin:0 auto!important;flex:none!important}body.lp-farm .ribbon{display:flex!important;justify-content:center;background:none!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important}" +
    "body.lp-farm #lyric .tok{opacity:.55}body.lp-farm #lyric .tok.done,body.lp-farm #lyric .tok.on{opacity:1}" +
    "body.lp-drum #word{font-size:clamp(34px,8vw,76px)!important;display:inline-block;padding:6px 34px!important;line-height:1.15}" +
    "body.lp-drum header,body.lp-farm header h1,body.lp-farm .eio,body.lp-train .top h1,body.lp-sky header h1,body.lp-flappy #intro h1{display:none}" +
    /* make room under the title tag */
    "body.lp-ark .top,body.lp-market .top,body.lp-paint .top,body.lp-pairs .top,body.lp-street .top{margin-top:var(--lp-top)}" +
    "body.lp-dress .top,body.lp-face .top,body.lp-night .top,body.lp-peek .top{top:calc(var(--lp-top) + max(0px,env(safe-area-inset-top,0px)))!important}" +
    "body.lp-drum .wrap{padding-top:var(--lp-top)}body.lp-farm header{padding-top:var(--lp-top)}" +
    "body.lp-sky #prompt{margin:0 auto}body.lp-sky header,body.lp-soup header{padding-top:var(--lp-top)!important}" +
    "body.lp-flappy #bar{top:calc(var(--lp-top) + 4px)!important}" +
    "body.lp-munch #bd{top:0}";
  (document.head || document.documentElement).appendChild(s);

  function poss(n) { return /s$/i.test(n) ? n + "’" : n + "’s"; }
  function build() {
    if (!document.body) return setTimeout(build, 30);
    document.body.classList.add("lp-" + G);
    var el = document.createElement("div"); el.id = "lpTitle"; el.setAttribute("aria-hidden", "true");
    el.innerHTML = "<b></b><small></small>";
    document.body.appendChild(el);
    var last = null;
    function upd() {
      var n = ((window.LP && window.LP.name) || (window.LP_SETTINGS && window.LP_SETTINGS.name) || "").trim();
      var home = (window.LP && window.LP.home) || (window.LP_SETTINGS && window.LP_SETTINGS.home) || "en";
      var big = n ? (home === "en" ? poss(n) : n) : title, small = n ? title : "";
      var k = big + "|" + small; if (k === last) return; last = k;
      el.firstChild.textContent = big; el.lastChild.textContent = small; el.lastChild.style.display = small ? "" : "none";
    }
    upd(); setInterval(upd, 800);
  }
  build();
})();
