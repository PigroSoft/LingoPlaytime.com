# Records the greeting each street person says, in the place's own language and accent (not the child's).
# Writes games/hello.js, which adds clips named hello_<place> to window.LP_SAMPLES.  Run from the repo root.
import json, os, wave, base64, subprocess, tempfile, glob
import soundfile as sf
from kokoro_onnx import Kokoro
from piper import PiperVoice
V = os.environ["LP_VOICES"]
K = Kokoro(os.path.join(V, "kokoro-v1.0.onnx"), os.path.join(V, "voices-v1.0.bin"))
tmp = tempfile.mkdtemp(); wav, mp3 = os.path.join(tmp, "a.wav"), os.path.join(tmp, "a.mp3")
def piper(d):
    m = glob.glob(os.path.join(V, d, "*.onnx"))[0]; pv = PiperVoice.load(m)
    def f(t):
        with wave.open(wav, "wb") as w:
            try: pv.synthesize_wav(t, w)
            except AttributeError: pv.synthesize(t, w)
    return f
def kok(voice, lang, speed=0.95):
    def f(t):
        s, sr = K.create(t, voice=voice, speed=speed, lang=lang); sf.write(wav, s, sr)
    return f
PLAN = {
 "town":     ("Hello!",      kok("am_liam", "en-us")),
 "country":  ("Hello!",      kok("am_adam", "en-us")),
 "site":     ("Hello!",      kok("am_michael", "en-us")),
 "berlin":   ("Hallo!",      piper("de-thorsten-low"), 1.3),   # a woman: the only German voice here is male, so it is pitched up
 "austin":   ("Alright, alright, alright!", kok("am_onyx", "en-us", 0.82)),
 "sicily":   ("Ciao!",       kok("if_sara", "it")),
 "london":   ("Hello!",      kok("bf_emma", "en-gb")),
 "paris":    ("Bonjour!",    kok("ff_siwis", "fr-fr")),
 "barcelona":("¡Hola!",      kok("ef_dora", "es", 0.95)),
 "lisbon":   ("Olá!",        kok("pf_dora", "pt-br")),
 "rome":     ("Ciao!",       kok("im_nicola", "it")),
 "newyork":  ("Hey! I am walking here!", kok("am_michael", "en-us", 1.0)),
 "soldier":  ("Andiamo!",    kok("im_nicola", "it", 0.9)),
 "bear":     ("Hallöchen!",  piper("de-thorsten-low")),
}
out = {}
for place, (text, synth, *pitch) in PLAN.items():
    synth(text)
    subprocess.run(["ffmpeg","-y","-loglevel","error","-i",wav,"-af",("rubberband=pitch=%s:formant=shifted," % pitch[0] if pitch else "") + "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-18:TP=-2","-ar","24000","-ac","1","-b:a","48k",mp3], check=True)
    out["hello_" + place] = base64.b64encode(open(mp3, "rb").read()).decode()
    print(place, text, len(out["hello_" + place]), flush=True)
open("games/hello.js", "w").write("window.LP_SAMPLES=Object.assign(window.LP_SAMPLES||{},%s);\n" % json.dumps(out))
