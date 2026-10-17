/* Real recordings for games that run their own Web Audio (drum, train, soup).
   Clips in window.LP_SAMPLES are decoded once at load (an AudioBuffer works in any AudioContext),
   so they are ready by the first tap. play() returns false if a clip is missing,
   and the game falls back to its synthesized sound. Kit-based games use LP.sample instead. */
window.LPS = (function () {
  var bufs = {};
  function decodeAll() {
    var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OAC) return;
    var dec; try { dec = new OAC(1, 1, 44100); } catch (e) { return; }
    var S = window.LP_SAMPLES || {};
    Object.keys(S).forEach(function (k) {
      try {
        var bin = atob(S[k]), arr = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        var p = dec.decodeAudioData(arr.buffer, function (b) { bufs[k] = b; }, function () {});
        if (p && p.catch) p.catch(function () {});
      } catch (e) {}
    });
  }
  decodeAll();
  return {
    warm: function () {},
    play: function (ac, key, max, gain) {
      if (!ac || !bufs[key]) return false;
      try {
        var src = ac.createBufferSource(), g = ac.createGain(), t = ac.currentTime;
        var len = Math.min(bufs[key].duration, max || 5), v = gain == null ? 1 : gain;
        src.buffer = bufs[key]; g.gain.setValueAtTime(v, t); g.gain.setValueAtTime(v, t + Math.max(0, len - 0.08)); g.gain.linearRampToValueAtTime(0, t + len);
        src.connect(g); g.connect(ac.destination); src.start(t); src.stop(t + len + 0.02);
        return true;
      } catch (e) { return false; }
    }
  };
})();
