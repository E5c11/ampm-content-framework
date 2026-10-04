#!/usr/bin/env python3
"""
Survey the mathematical / scientific notation in real DBE exam papers and memoranda, to ground the
scientific-keyboard design (AMPM plan `question-keyboards-and-exam-version-gating.md`, item 5c0; Linear
BLA-21). It answers "which symbols, letters, sub/superscripts and tokens do real papers actually use?" so the
keyboard layouts are chosen from evidence, not guesswork.

    python3 tools/survey-exam-notation.py "files/Mathematics P1 Nov 2025 MG Afr & Eng.pdf" [more.pdf ...]
    python3 tools/survey-exam-notation.py --json temp/survey.json files/*MG*.pdf

Needs poppler's `pdftotext` and `pdftohtml`. Works on any PDF with a text layer — **memoranda** are the best
input (they carry the full worked solutions); a scanned question paper (no text layer) yields nothing.

WHAT IT REPORTS, per PDF
  1. Symbol census: every non-alphanumeric character with a count, with Adobe *Symbol*-font private-use glyphs
     (U+F0xx, how Word/Office PDFs encode <, ≤, π, θ, Δ, ∴, brackets, ...) decoded to real characters.
  2. Sub/superscripts: pdftotext flattens them into plain digits ("8x²" -> "8x2"), so they are recovered from the
     PDF's font-size + vertical-position data (pdftohtml -xml) and counted by body (^2, ^-1, _f, _net, _2, ...).
  3. Notation tokens: sin/cos/tan/log/ln/lim, factorials, P(A), (aq)/(s)/(l)/(g), arrows, sqrt...
  4. Single-letter symbols used as variables (prose-heavy lines dropped to cut noise).

CAVEATS (read before trusting a number)
  - A memo shows the WORKING, not just final answers; counts say what notation exists, not what a student would
    be asked to type. Authoring conventions (bare numeric answers, units as given text) shrink the typed need.
  - Sub/superscript detection is geometric and approximate (question-part labels like "(a)" are picked up as
    subscripts; treat small counts with care). Letter counts include some labels (A, B, C, ...).
  - Bilingual memos contribute Afrikaans accents (ë ê ï ŉ) — useful for the `text` keyboard, not a maths need.
"""

import argparse
import collections
import html
import json
import re
import subprocess
import sys

# Adobe Symbol font code -> Unicode, for the glyphs that matter in maths/physics memos. Office PDFs store these
# at U+F000 + code.
SYM = {
    0x3C: '<', 0x3E: '>', 0x3D: '=', 0x2B: '+', 0x2D: '-', 0x5B: '[', 0x5D: ']', 0x5C: '∴', 0x70: 'π', 0x71: 'θ',
    0x61: 'α', 0x62: 'β', 0x67: 'γ', 0x64: 'δ', 0x44: 'Δ', 0x6C: 'λ', 0x6D: 'μ', 0x73: 'σ', 0x53: 'Σ', 0x57: 'Ω',
    0x77: 'ω', 0x65: 'ε', 0x66: 'φ', 0x72: 'ρ', 0x74: 'τ', 0x6E: 'ν', 0x68: 'η', 0x6B: 'κ',
    0xA3: '≤', 0xB3: '≥', 0xB9: '≠', 0xB4: '×', 0xB8: '÷', 0xB1: '±', 0xA5: '∞', 0xD6: '√', 0xC7: '∩', 0xC8: '∪',
    0xCE: '∈', 0xCF: '∉', 0xB6: '∂', 0xB7: '•', 0xD0: '∠', 0xAE: '→', 0xDE: '⇒', 0xDB: '⇔', 0xAB: '↔', 0xBB: '≈',
    0xBA: '≡', 0xB0: '°', 0xA2: '′', 0xB2: '″', 0x7C: '|', 0x28: '(', 0x29: ')', 0x22: '∀', 0x24: '∃', 0xD7: '⋅',
    0xE7: '(bracket piece)', 0xF7: '(bracket piece)', 0xE6: '(bracket piece)', 0xF6: '(bracket piece)',
    0xE8: '(bracket piece)', 0xF8: '(bracket piece)', 0xEA: '(bracket piece)', 0xFA: '(bracket piece)',
    0xE9: '(bracket piece)', 0xF9: '(bracket piece)', 0xEB: '(bracket piece)', 0xFB: '(bracket piece)',
    0x20: ' ',
}
# Marking ticks / bullets etc. that are layout noise, not notation.
NOISE_PUA = {0x50, 0xFC, 0xB7, 0x22}
SKIP = set(' \t\r\n\x0c✓✔☑')

TOKENS = {
    'sin': r'\bsin\b', 'cos': r'\bcos\b', 'tan': r'\btan\b', 'log': r'\blog\b', 'ln': r'\bln\b', 'lim': r'\blim\b',
    'factorial !': r'\d!|\)!|\bn!', 'P(A) probability': r'\bP\s*\(\s*[A-Z]', 'sqrt √': r'√', 'sigma/sum': r'Σ|σ',
    'caret ^': r'\^', '(aq)': r'\(aq\)', '(s)': r'\(s\)', '(l)': r'\(l\)', '(g)': r'\(g\)', 'equilibrium ⇌': r'⇌',
    'arrow →': r'→', 'degree °': r'°|º',
}
SMALL_BODY = re.compile(r'[0-9A-Za-z+\-−=()ⁿ.,/]+')


def norm(ch):
    o = ord(ch)
    if 0xF000 <= o <= 0xF0FF:
        code = o - 0xF000
        return None if code in NOISE_PUA else SYM.get(code, f'<Symbol 0x{code:02X}?>')
    return ch


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True, errors='replace').stdout


def census(text):
    c = collections.Counter()
    for ch in text:
        if ch in SKIP:
            continue
        n = norm(ch)
        if n is None or (n.isalnum() and ord(n[0]) < 128):
            continue
        c[n] += 1
    return c


def tokens(text):
    out = {}
    for name, pat in TOKENS.items():
        n = len(re.findall(pat, text))
        if n:
            out[name] = n
    return out


def letters(text):
    lines = [l for l in text.split('\n') if len(re.findall(r'[A-Za-z]{4,}', l)) <= 2]
    return collections.Counter(m.group(1) for m in re.finditer(r'(?<![A-Za-z])([A-Za-z])(?![A-Za-z])', '\n'.join(lines)))


def sup_sub(pdf):
    xml = run(['pdftohtml', '-xml', '-i', '-q', '-stdout', pdf])
    sizes = {m.group(1): int(m.group(2)) for m in re.finditer(r'<fontspec id="(\d+)" size="(\d+)"', xml)}
    sup, sub = collections.Counter(), collections.Counter()
    for page in re.split(r'<page ', xml)[1:]:
        nodes = []
        for m in re.finditer(r'<text top="(\d+)" left="(\d+)" width="(\d+)" height="(\d+)" font="(\d+)">(.*?)</text>', page, re.S):
            top, left, w, h, font, body = m.groups()
            nodes.append(dict(top=int(top), left=int(left), w=int(w), h=int(h), size=sizes.get(font, 0),
                              t=html.unescape(re.sub(r'<[^>]+>', '', body))))
        for i, n in enumerate(nodes):
            t = n['t'].strip()
            if not t or len(t) > 5 or not SMALL_BODY.fullmatch(t):
                continue
            best = None
            for j in range(max(0, i - 6), i):
                m = nodes[j]
                if (abs((m['left'] + m['w']) - n['left']) <= 4
                        and abs((m['top'] + m['h'] / 2) - (n['top'] + n['h'] / 2)) <= 12
                        and m['size'] >= n['size'] + 3 and m['t'].strip()):
                    best = m
            if not best:
                continue
            dy = (n['top'] + n['h'] / 2) - (best['top'] + best['h'] / 2)
            if dy < -1:
                sup[t] += 1
            elif dy > 1:
                sub[t] += 1
    return sup, sub


def survey(pdf):
    text = run(['pdftotext', '-layout', pdf, '-'])
    if len(text.strip()) < 200:
        return {'pdf': pdf, 'error': 'no usable text layer (scanned PDF?) — use the memorandum instead'}
    sup, sub = sup_sub(pdf)
    return {'pdf': pdf, 'symbols': census(text), 'tokens': tokens(text), 'letters': letters(text),
            'superscripts': sup, 'subscripts': sub}


def show(r, top=40):
    print(f"\n=== {r['pdf']}")
    if 'error' in r:
        print('  ', r['error'])
        return
    sym = [(k, v) for k, v in r['symbols'].most_common(top) if 'piece' not in k]
    print('  symbols      :', ' '.join(f'{k}×{v}' for k, v in sym))
    print('  superscripts :', sum(r['superscripts'].values()), '|', ' '.join(f'{k}×{v}' for k, v in r['superscripts'].most_common(12)))
    print('  subscripts   :', sum(r['subscripts'].values()), '|', ' '.join(f'{k}×{v}' for k, v in r['subscripts'].most_common(14)))
    print('  tokens       :', ' '.join(f'{k}×{v}' for k, v in r['tokens'].items()))
    print('  letters      :', ' '.join(f'{k}×{v}' for k, v in r['letters'].most_common(28)))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('pdfs', nargs='+')
    ap.add_argument('--json', help='also write the raw counts to this file')
    args = ap.parse_args()
    results = [survey(p) for p in args.pdfs]
    for r in results:
        show(r)
    if args.json:
        ser = [{k: (dict(v) if isinstance(v, collections.Counter) else v) for k, v in r.items()} for r in results]
        with open(args.json, 'w', encoding='utf-8') as f:
            json.dump(ser, f, ensure_ascii=False, indent=1)
        print(f'\nraw counts written: {args.json}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
