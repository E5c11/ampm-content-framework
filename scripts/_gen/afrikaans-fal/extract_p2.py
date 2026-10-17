#!/usr/bin/env python3
"""Crop plan + extraction for Afrikaans FAL Nov 2025 P2 (18 lessons). Uses tools/extract-exam-pages.py.
Run from repo root. Output: temp/images/afr-p2/q<order>/ (question_*, annexure_*, memo_*). Coordinates came from fitz word positions."""
import subprocess, os, sys
ROOT = "/home/emmanuel/WebstormProjects/ampm-content-framework"
P = f"{ROOT}/files/afrikaans_fal/Afrikaans FAL P2 Nov 2025(R).pdf"
M = f"{ROOT}/files/afrikaans_fal/Afrikaans FAL P2 Nov 2025 MG.pdf"
OUT = f"{ROOT}/temp/images/afr-p2"

def spec(*parts):
    return ",".join(parts)

def span(p1, y1, p2, y2):
    """pages p1..p2 inclusive, from y1 on p1 to y2 on p2 (None = whole)"""
    if p1 == p2:
        a = []
        if y1 is not None: a.append(f"start={y1}")
        if y2 is not None: a.append(f"end={y2}")
        return f"{p1}" + "".join(":" + x for x in a)
    out = [f"{p1}:start={y1}" if y1 is not None else f"{p1}"]
    out += [str(p) for p in range(p1 + 1, p2)]
    out.append(f"{p2}:end={y2}" if y2 is not None else f"{p2}")
    return ",".join(out)

# order: (qspec, annexure, memo, annexure stem)
L = {
 # Q1 Kringe in 'n Bos
 1: (span(5,500,7,470), span(5,193,5,499), span(4,105,5,544), "annexure_teks_a"),
 2: (span(8,78,9,254), span(7,524,7,None), span(5,545,7,526), "annexure_teks_b"),
 # Q2 Hanna Hoekom
 3: (span(10,449,12,388), span(10,147,10,448), span(7,525,9,550), "annexure_teks_c"),
 4: (span(13,83,14,240), span(12,446,12,None), span(9,551,11,360), "annexure_teks_d"),
 # Q3 Meeulanders
 5: (span(15,403,16,764), span(15,138,15,402), span(11,360,13,587), "annexure_teks_e"),
 6: (span(17,459,18,777), span(17,110,17,458), span(13,588,14,194), "annexure_teks_f"),
 # Q4 Lien se Lankstaanskoene
 7: (span(19,401,20,690), span(19,136,19,400), span(14,194,16,176), "annexure_teks_g"),
 8: (span(21,376,22,589), span(21,110,21,375), span(16,177,18,352), "annexure_teks_h"),
 # Q5 Poppie
 9: (span(23,472,24,754), span(23,193,23,471), span(18,406,19,687), "annexure_teks_i"),
 10: (span(25,472,26,765), span(25,110,25,471), span(19,688,21,383), "annexure_teks_j"),
 # Q6 Paljas
 11: (span(27,470,29,218), span(27,138,27,469), span(21,383,23,257), "annexure_teks_k"),
 12: (span(29,647,30,786), span(29,248,29,646), span(23,258,25,422), "annexure_teks_l"),
 # Q7 Fiela se Kind
 13: (span(31,441,32,767), span(31,136,31,440), span(25,422,27,363), "annexure_teks_m"),
 14: (span(33,517,34,653), span(33,113,33,516), span(27,364,29,731), "annexure_teks_n"),

 # Q8 Kortverhale, Q9 Gedigte — each split in two lessons (DESIGN-UNI-17); orders 15-18 reuse earlier keys, so files get a v2_ suffix
 15: (span(35,514,36,414), span(35,221,35,513), span(30,108,30,614), "annexure_teks_o"),
 16: (span(36,414,37,314), span(35,221,35,513), span(30,614,31,622), "annexure_teks_o"),
 17: (span(38,83,38,678), span(37,400,37,716), span(31,623,32,620), "annexure_teks_p"),
 18: (span(38,678,39,330), span(37,400,37,716), span(32,620,33,632), "annexure_teks_p"),
 19: (span(40,491,40,None), span(40,165,40,490), span(34,108,34,661), "annexure_poem"),
 20: (span(41,83,41,573), span(40,165,40,490), span(34,661,35,None), "annexure_poem"),
 21: (span(43,277,43,526), span(42,82,43,272), span(36,82,36,533), "annexure_poem"),
 22: (span(43,526,44,470), span(42,82,43,272), span(36,533,37,616), "annexure_poem"),
}

def run(order, q, a, m, stem):
    d = f"{OUT}/q{order}"
    subprocess.run(["rm", "-rf", d])
    cmd = ["python3", f"{ROOT}/tools/extract-exam-pages.py", "--pdf", P, "--memo-pdf", M, "--order", str(order),
           "--question-pages", q, "--annexure-pages", a, "--memo-pages", m, "--out", d + "/"]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print("FAIL", order, r.stderr[-300:]); return
    src = f"{d}/annexure_1.png"
    # one annexure image per page range part: tool names annexure_1..n
    i = 1
    while os.path.exists(f"{d}/annexure_{i}.png"):
        os.rename(f"{d}/annexure_{i}.png", f"{d}/{stem}_{i}.png"); i += 1
    if order in (15, 16, 17, 18):  # immutable image keys: new names for reused orders
        for f in sorted(os.listdir(d)):
            for kind in ("question_", "memo_"):
                if f.startswith(kind):
                    os.rename(f"{d}/{f}", f"{d}/{kind}v2_{f[len(kind):]}")
            if f.startswith("annexure_"):
                os.rename(f"{d}/{f}", f"{d}/{f[:-6]}_v2_{f[-5:]}")
    print("ok", order, sorted(os.listdir(d)))

if __name__ == "__main__":
    only = [int(x) for x in sys.argv[1:]] or sorted(L)
    for o in only:
        run(o, *L[o])
