# Renders only the phrases that have no clip yet and merges them into games/audio/<game>.<lang>.js.
# Usage: python3 tools/fill.py <lang> <piper.onnx | kokoro> [game,game]   (run from the repo root)
import json, re, sys, os, wave, base64, subprocess, tempfile
lang, model = sys.argv[1], sys.argv[2]
ONLY = set(sys.argv[3].split(",")) if len(sys.argv) > 3 else None
VOICES = os.environ.get("LP_VOICES", "")
P = json.loads(subprocess.check_output(["node", "tools/phrases.js", lang]))
NAME = P["name"]
def clean(t):
    t = re.sub(re.escape(NAME), "", t, flags=re.I)
    t = re.sub(r"\s*,\s*(?=[!?.]|$)", "", t); t = re.sub(r"^\s*,\s*", "", t)
    return re.sub(r"\s+", " ", t).strip()
tmp = tempfile.mkdtemp(); wav, mp3 = os.path.join(tmp, "a.wav"), os.path.join(tmp, "a.mp3")
if model == "kokoro":
    import soundfile as sf
    from kokoro_onnx import Kokoro
    K = Kokoro(os.path.join(VOICES, "kokoro-v1.0.onnx"), os.path.join(VOICES, "voices-v1.0.bin"))
    def synth(text):
        s, sr = K.create(text, voice="af_heart", speed=0.92, lang="en-us"); sf.write(wav, s, sr)
else:
    from piper import PiperVoice
    V = PiperVoice.load(model)
    def synth(text):
        with wave.open(wav, "wb") as f:
            try: V.synthesize_wav(text, f)
            except AttributeError: V.synthesize(text, f)
def encode():
    subprocess.run(["ffmpeg","-y","-loglevel","error","-i",wav,"-af","silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse","-ac","1","-b:a","48k",mp3], check=True)
    return base64.b64encode(open(mp3,"rb").read()).decode()
rx = re.compile(r'Object\.assign\(window\.LP_CLIPS\[[^\]]*\]\|\|\{\},(\{.*\})\);', re.S)
cache = {}; made = 0
for game, phrases in P["games"].items():
    if ONLY and game not in ONLY: continue
    fn = os.path.join("games", "audio", f"{game}.{lang}.js")
    bank = json.loads(rx.search(open(fn, encoding="utf-8").read()).group(1)) if os.path.exists(fn) else {}
    new = 0
    for t in phrases:
        sp = clean(t)
        if not sp: continue
        k = sp.lower()
        if k in bank: continue
        if k not in cache:
            synth(sp[0].upper() + sp[1:]); cache[k] = encode(); made += 1
        bank[k] = cache[k]; new += 1
    if new:
        js = "(window.LP_CLIPS=window.LP_CLIPS||{});window.LP_CLIPS[%s]=Object.assign(window.LP_CLIPS[%s]||{},%s);\n" % (json.dumps(lang), json.dumps(lang), json.dumps(bank, ensure_ascii=False))
        open(fn, "w", encoding="utf-8").write(js)
    print(lang, game, "+%d" % new, flush=True)
print(lang, "rendered", made)
