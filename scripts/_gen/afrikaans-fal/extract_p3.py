#!/usr/bin/env python3
"""Crop plan + extraction for Afrikaans FAL Nov 2025 P3 (9 lessons). Question image = section instructions + the task; memo images = that
task's marking points + the matching rubric page(s). Coordinates from fitz word positions. Output: temp/images/afr-p3/q<order>/."""
import subprocess, os, sys
ROOT = "/home/emmanuel/WebstormProjects/ampm-content-framework"
P = f"{ROOT}/files/afrikaans_fal/Afrikaans FAL P3 Nov 2025.pdf"
M = f"{ROOT}/files/afrikaans_fal/Afrikaans FAL P3 Nov 2025 MG.pdf"
OUT = f"{ROOT}/temp/images/afr-p3"
L = {
 1: ("3:start=83:end=386", "5,6:end=640,19,20"),
 2: ("3:start=386,4:end=732", "6:start=640,7:end=713,19,20"),
 3: ("5:start=83:end=278", "8:start=83,9,21"),
 4: ("5:start=83:end=182,5:start=278:end=543", "10:start=83,11,21"),
 5: ("5:start=83:end=182,5:start=543:end=626", "12:start=255,13,21"),
 6: ("5:start=83:end=182,5:start=626:end=736", "14:start=83:end=696,21"),
 7: ("6:start=83:end=292", "15:start=83,22"),
 8: ("6:start=83:end=182,6:start=292:end=431", "16:start=83,17:end=385,22"),
 9: ("6:start=83:end=182,6:start=431:end=606", "17:start=385,18:end=425,22"),
}
for o in ([int(x) for x in sys.argv[1:]] or sorted(L)):
    q, m = L[o]
    d = f"{OUT}/q{o}"
    subprocess.run(["rm", "-rf", d])
    r = subprocess.run(["python3", f"{ROOT}/tools/extract-exam-pages.py", "--pdf", P, "--memo-pdf", M, "--order", str(o),
                        "--question-pages", q, "--memo-pages", m, "--out", d + "/"], capture_output=True, text=True)
    print("ok" if r.returncode == 0 else "FAIL " + r.stderr[-200:], o, sorted(os.listdir(d)) if r.returncode == 0 else "")
