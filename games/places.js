/* LingoPlaytime places: flat landmark silhouettes along the horizon for the language being played,
   rotating between countries that speak it, plus the sky colors for the time of day.
   Original simplified shapes. Loaded by look.js users after look.js. */
(function () {
  /* each landmark is drawn standing on y=0, growing upward (negative y), about 100 units tall */
  var L = {
    tvtower: '<rect x="-3" y="-120" width="6" height="120"/><rect x="-1" y="-140" width="2" height="22"/><circle cy="-78" r="15"/><rect x="-7" y="-60" width="14" height="6"/>',
    gate: '<rect x="-46" y="-62" width="92" height="12"/><rect x="-40" y="-70" width="80" height="9"/><path d="M-10-70h20l-4-10h-12Z"/>' + cols(-40, -50, 6, 16, 50, 8),
    alps: '<path d="M-150 0 -90-90-60-60-20-120 30-50 60-80 120 0Z"/><path d="M-20-120-34-98-24-102-12-92-6-104Z M-90-90-102-72-92-76-82-68Z" fill="#fff" opacity=".85"/>',
    bigben: '<rect x="-12" y="-110" width="24" height="110"/><path d="M-14-110 0-145 14-110Z"/><circle cy="-92" r="8" fill="#fff" opacity=".6"/>',
    eye: '<circle cy="-62" r="56" fill="none" stroke="currentColor" stroke-width="5"/><path d="M0-62-40 0M0-62 40 0" stroke="currentColor" stroke-width="5"/>' + (function () { var s = ""; for (var i = 0; i < 12; i++) { var a = i / 12 * Math.PI * 2; s += '<circle cx="' + (Math.cos(a) * 56).toFixed(1) + '" cy="' + (-62 + Math.sin(a) * 56).toFixed(1) + '" r="5"/>'; } return s; })(),
    liberty: '<rect x="-22" y="-26" width="44" height="26"/><path d="M-10-26c0-30 4-50 10-58 6 8 10 28 10 58Z"/><circle cy="-90" r="7"/><path d="M4-92l10-30 4 2-8 30Z"/><path d="M12-124c0-6 8-6 8 0 0 4-8 4-8 0Z"/><path d="M-7-96l-2-8M0-98v-9M7-96l2-8" stroke="currentColor" stroke-width="2.5"/>',
    opera: '<rect x="-80" y="-10" width="160" height="10"/><path d="M-70-10c0-40 20-60 40-64-6 22-6 44 0 64Z M-30-10c0-46 22-68 46-72-8 26-8 48-2 72Z M14-10c0-36 18-54 38-58-6 20-6 40 0 58Z"/>',
    colosseum: '<path d="M-90 0v-70c30-12 150-12 180 0V0Z"/><g fill="#fff" opacity=".35">' + arches(-80, -52, 8, 20, 18, 9) + arches(-80, -26, 8, 20, 18, 9) + '</g>',
    pisa: '<g transform="rotate(5)"><rect x="-16" y="-110" width="32" height="110" rx="4"/><rect x="-12" y="-122" width="24" height="12" rx="3"/><path d="M-16-90h32M-16-70h32M-16-50h32M-16-30h32" stroke="#fff" stroke-width="2" opacity=".35"/></g>',
    cypress: '<ellipse cx="-24" cy="-44" rx="9" ry="44"/><ellipse cx="0" cy="-58" rx="10" ry="58"/><ellipse cx="22" cy="-40" rx="8" ry="40"/>',
    sagrada: '<rect x="-56" y="-40" width="112" height="40"/>' + spire(-44, -110) + spire(-20, -132) + spire(20, -132) + spire(44, -110) + spire(0, -150),
    windmill: '<path d="M-14 0-9-60h18L14 0Z"/><path d="M-12-60 0-74 12-60Z"/><g transform="translate(0 -66) rotate(20)"><rect x="-2" y="-46" width="4" height="92"/><rect x="-46" y="-2" width="92" height="4"/><rect x="2" y="-44" width="10" height="34" opacity=".8"/><rect x="-12" y="10" width="10" height="34" opacity=".8"/><rect x="10" y="2" width="34" height="10" opacity=".8"/><rect x="-44" y="-12" width="34" height="10" opacity=".8"/></g>',
    pyramid: '<path d="M-80 0h160l-14-16h-132Z M-66-16h132l-14-16h-104Z M-52-32h104l-14-16h-76Z M-38-48h76l-14-16h-48Z"/><rect x="-12" y="-80" width="24" height="16"/><rect x="-5" y="-64" width="10" height="64" fill="#fff" opacity=".25"/>',
    andes: '<path d="M-160 0-100-70-70-40-30-100 10-55 40-75 90-20 150 0Z"/><path d="M-30-100-42-82-32-86-22-78-16-90Z" fill="#fff" opacity=".85"/>',
    eiffel: '<path d="M-36 0C-20-30-8-70-4-120h8C8-70 20-30 36 0h-12C14-18 6-24 0-24S-14-18-24 0Z"/><rect x="-22" y="-44" width="44" height="6"/><rect x="-12" y="-80" width="24" height="5"/><rect x="-1.5" y="-140" width="3" height="22"/>',
    baobab: '<path d="M-8 0c2-30 0-50-6-64h28c-6 14-8 34-6 64Z"/><path d="M-14-64c-20-6-30-14-34-22 14 2 24 6 34 10 0-12-6-20-10-26 12 6 18 14 20 22 6-10 14-16 24-18-4 8-10 14-14 22 10-4 22-6 32-6-8 10-20 16-34 18Z"/>',
    christ: '<path d="M-70 0c20-40 40-60 70-64 30 4 50 24 70 64Z"/><rect x="-3" y="-96" width="6" height="34"/><rect x="-26" y="-90" width="52" height="5"/><circle cy="-100" r="4"/>',
    sugarloaf: '<path d="M-60 0c0-60 20-100 40-100s36 40 36 100Z M20 0c4-30 16-46 30-46s26 16 30 46Z"/>',
    belem: '<rect x="-22" y="-80" width="44" height="80"/><rect x="-26" y="-86" width="52" height="8"/><rect x="-10" y="-104" width="20" height="18"/><path d="M-10-104 0-116 10-104Z"/><g fill="#fff" opacity=".3"><rect x="-6" y="-70" width="12" height="18" rx="6"/><rect x="-6" y="-40" width="12" height="18" rx="6"/></g>',
    tulips: (function () { var s = ""; for (var i = 0; i < 9; i++) { var x = -80 + i * 20; s += '<rect x="' + (x - 1.5) + '" y="-30" width="3" height="30"/><path d="M' + (x - 7) + ' -30c0-12 3-16 7-16s7 4 7 16Z"/>'; } return s; })(),
    palace: '<rect x="-40" y="-40" width="80" height="40"/><rect x="-26" y="-80" width="52" height="40"/><rect x="-16" y="-110" width="32" height="30"/><path d="M-8-110 0-150 8-110Z"/>',
    cottages: '<path d="M-90 0v-30l20-18 20 18V0Z M-40 0v-36l24-22 24 22V0Z M14 0v-28l18-16 18 16V0Z"/><g fill="#fff" opacity=".35"><rect x="-76" y="-22" width="10" height="10"/><rect x="-24" y="-28" width="12" height="12"/><rect x="26" y="-20" width="10" height="10"/></g>',
    parthenon: '<path d="M-80-74 0-100 80-74Z"/><rect x="-80" y="-74" width="160" height="8"/><rect x="-86" y="-8" width="172" height="8"/>' + cols(-76, -66, 9, 17.5, 58, 8),
    pagoda: '<rect x="-8" y="-130" width="16" height="130"/>' + [0, 1, 2, 3].map(function (i) { var y = -26 - i * 26, w = 52 - i * 8; return '<path d="M' + (-w) + ' ' + y + 'q' + w + ' -14 ' + (w * 2) + ' 0l-8 -8h' + (-(w * 2 - 16)) + 'Z"/>'; }).join("") + '<rect x="-1.5" y="-150" width="3" height="22"/>',
    wall: '<path d="M-160 0c40-30 80-46 120-40s80-30 120-40 60 10 80 20V0Z"/><path d="M-40-44l14-4v-10l10-3v10l14-4" fill="none" stroke="currentColor" stroke-width="5"/><rect x="38" y="-96" width="22" height="22"/>',
    onion: '<rect x="-60" y="-50" width="120" height="50"/>' + dome(-36, -50, 14) + dome(0, -70, 20) + dome(36, -50, 14) + '<rect x="-12" y="-70" width="24" height="22"/>',
    fuji: '<path d="M-150 0-40-90h40l110 90Z"/><path d="M-40-90h40l18 15-12-4-10 8-8-8-10 8-10-8-14 4Z" fill="#fff" opacity=".9"/>',
    torii: '<rect x="-30" y="-70" width="7" height="70"/><rect x="23" y="-70" width="7" height="70"/><path d="M-46-84q46-8 92 0l-4 8q-42-6-84 0Z"/><rect x="-38" y="-66" width="76" height="6"/>',
    namsan: '<path d="M-90 0c20-30 50-44 90-44s70 14 90 44Z"/><rect x="-3" y="-120" width="6" height="80"/><rect x="-10" y="-108" width="20" height="14" rx="4"/><rect x="-1" y="-140" width="2" height="22"/>',
    domes: '<rect x="-60" y="-34" width="120" height="34"/>' + dome(0, -34, 30, true) + '<rect x="-80" y="-100" width="10" height="100"/><path d="M-80-100h10l-5-12Z"/><rect x="70" y="-100" width="10" height="100"/><path d="M70-100h10l-5-12Z"/>',
    palms: palm(-40, 70) + palm(10, 90) + palm(50, 64),
    giza: '<path d="M-110 0-50-62 10 0Z M-10 0 40-50 90 0Z M70 0l26-26L122 0Z"/>',
    galata: '<rect x="-14" y="-90" width="28" height="90"/><path d="M-18-90 0-130 18-90Z"/><rect x="-16" y="-96" width="32" height="6"/><g fill="#fff" opacity=".3"><rect x="-4" y="-80" width="8" height="12" rx="4"/></g>',
    taj: '<rect x="-60" y="-50" width="120" height="50"/>' + dome(0, -50, 28, true) + '<rect x="-80" y="-90" width="8" height="90"/><rect x="72" y="-90" width="8" height="90"/><circle cx="-76" cy="-92" r="6"/><circle cx="76" cy="-92" r="6"/><rect x="-14" y="-40" width="28" height="40" rx="14" fill="#fff" opacity=".3"/>'
  };
  function cols(x0, y, w, gap, h, n) { var s = ""; for (var i = 0; i < n; i++) s += '<rect x="' + (x0 + i * gap) + '" y="' + y + '" width="' + w + '" height="' + h + '"/>'; return s; }
  function arches(x0, y, n, gap, h, w) { var s = ""; for (var i = 0; i < n; i++) s += '<rect x="' + (x0 + i * gap + 2) + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (w / 2) + '"/>'; return s; }
  function spire(x, top) { return '<path d="M' + (x - 9) + ' -40V' + (top + 40) + 'L' + x + ' ' + top + 'L' + (x + 9) + ' ' + (top + 40) + 'V-40Z"/>'; }
  function dome(x, base, r, flat) { return '<path d="M' + (x - r) + ' ' + base + 'c0-' + (r * 1.4) + ' ' + r + '-' + (r * 1.6) + ' ' + r + '-' + (r * 2.2) + 'c0 ' + (r * .6) + ' ' + r + ' ' + (r * .8) + ' ' + r + ' ' + (r * 2.2) + 'Z"/><rect x="' + (x - 1.5) + '" y="' + (base - r * 2.2 - 12) + '" width="3" height="12"/>'; }
  function palm(x, h) { return '<path d="M' + (x - 3) + ' 0q6-' + (h / 2) + ' 2-' + h + 'h4q-2 ' + (h / 2) + ' 0 ' + h + 'Z"/><path d="M' + x + ' -' + h + 'c-14-10-30-6-38 2 14-4 26-2 38-2c-10-14-6-26 0-32 0 10 2 22 0 32 8-12 22-16 34-12-12 2-24 8-34 12 14-2 28 4 34 14-12-6-24-10-34-14Z"/>'; }

  /* scenes per language: each scene is [landmark, x position 0-1000, scale] */
  var S = {
    de: [[["tvtower", 300, 1], ["gate", 520, .9]], [["alps", 520, 1.2], ["cottages", 200, .8]]],
    en: [[["bigben", 330, 1], ["eye", 600, .9]], [["liberty", 420, 1.1]], [["opera", 560, 1]]],
    it: [[["colosseum", 440, 1], ["cypress", 760, 1]], [["pisa", 360, 1], ["cypress", 600, .9]]],
    es: [[["sagrada", 380, 1], ["windmill", 700, .9]], [["pyramid", 460, 1], ["andes", 760, .9]]],
    fr: [[["eiffel", 420, 1.1], ["cottages", 700, .8]], [["baobab", 380, 1], ["baobab", 640, .8]]],
    pt: [[["christ", 380, 1.1], ["sugarloaf", 640, 1]], [["belem", 460, 1], ["cottages", 700, .8]]],
    nl: [[["windmill", 300, 1], ["windmill", 560, .8], ["tulips", 760, 1]]],
    pl: [[["palace", 440, 1], ["cottages", 700, .8]]],
    sv: [[["cottages", 380, 1], ["cottages", 620, .8]]],
    el: [[["parthenon", 460, 1]]],
    zh: [[["pagoda", 360, 1], ["wall", 640, .9]]],
    ru: [[["onion", 460, 1]]],
    ja: [[["fuji", 520, 1.2], ["torii", 260, 1]]],
    ko: [[["namsan", 460, 1]]],
    ar: [[["domes", 380, 1], ["palms", 660, 1]], [["giza", 520, 1], ["palms", 260, .9]]],
    tr: [[["galata", 340, 1], ["domes", 600, .9]]],
    hi: [[["taj", 460, 1], ["palms", 740, .8]]],
    cs: [[["palace", 440, 1], ["cottages", 700, .8]]]
  };
  var pickIdx = {};
  function strip(lang) {
    var sc = S[lang]; if (!sc) return "";
    if (pickIdx[lang] == null) pickIdx[lang] = Math.floor(Math.random() * sc.length);
    var g = sc[pickIdx[lang]].map(function (it) { return '<g transform="translate(' + it[1] + ' 150) scale(' + it[2] + ')">' + L[it[0]] + "</g>"; }).join("");
    return '<svg viewBox="0 0 1000 150" preserveAspectRatio="xMidYMax meet" aria-hidden="true" fill="currentColor">' + g + "</svg>";
  }

  /* time of day from the child's own clock */
  function tod() { var h = new Date().getHours(); return h >= 6 && h < 10 ? "morning" : h >= 10 && h < 17 ? "day" : h >= 17 && h < 20 ? "evening" : "night"; }

  window.LPPlaces = { strip: strip, tod: tod, has: function (l) { return !!S[l]; } };
})();
