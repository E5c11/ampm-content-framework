#!/usr/bin/env python3
"""Usage: OUT=temp/images/maths-2024-p2/supp python3 scripts/gen-maths-2024-nov-p2-figures.py
Question-level diagrams for DBE Maths Nov 2024 P2, Q8-Q11 practice questions.
Clean exam-style line art. Givens are labelled; the quantity a question asks for is never shown."""
import math, sys, os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Arc, Polygon
from matplotlib import rcParams

rcParams['font.family'] = 'serif'
rcParams['mathtext.fontset'] = 'stix'
OUT = os.environ.get('OUT', 'supp')
os.makedirs(OUT, exist_ok=True)
FS = 24
LW = 2.0


def new(w=7.0, h=5.2):
    fig, ax = plt.subplots(figsize=(w, h), dpi=200)
    ax.set_aspect('equal')
    ax.axis('off')
    return fig, ax


def save(fig, ax, name, pad=0.35):
    fig.savefig(os.path.join(OUT, name), bbox_inches='tight', pad_inches=pad, facecolor='white')
    plt.close(fig)


def seg(ax, a, b, ls='-', lw=LW, color='black'):
    ax.plot([a[0], b[0]], [a[1], b[1]], ls, color=color, lw=lw, solid_capstyle='round')


def poly(ax, pts, **kw):
    for i in range(len(pts)):
        seg(ax, pts[i], pts[(i + 1) % len(pts)], **kw)


def lbl(ax, p, text, d=(0, 0), ha='center', va='center', fs=FS):
    ax.text(p[0] + d[0], p[1] + d[1], text, fontsize=fs, ha=ha, va=va)


def mid(a, b, t=0.5):
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


def ang(p, q):
    return math.degrees(math.atan2(q[1] - p[1], q[0] - p[0]))


def arc(ax, v, p1, p2, r, text=None, rt=None, n=1, gap=0.0, fs=FS - 4):
    a1, a2 = ang(v, p1), ang(v, p2)
    d = (a2 - a1 + 540) % 360 - 180   # signed smaller angle
    lo, hi = (a1, a1 + d) if d >= 0 else (a1 + d, a1)
    for k in range(n):
        ax.add_patch(Arc(v, 2 * (r + k * gap), 2 * (r + k * gap), theta1=lo, theta2=hi, lw=LW * 0.85, color='black'))
    if text:
        bis = math.radians(a1 + d / 2)
        rr = rt if rt else r * 1.9
        ax.text(v[0] + rr * math.cos(bis), v[1] + rr * math.sin(bis), text, fontsize=fs, ha='center', va='center')


def right(ax, v, p1, p2, s=0.35):
    u1 = ((p1[0] - v[0]), (p1[1] - v[1])); n1 = math.hypot(*u1); u1 = (u1[0] / n1, u1[1] / n1)
    u2 = ((p2[0] - v[0]), (p2[1] - v[1])); n2 = math.hypot(*u2); u2 = (u2[0] / n2, u2[1] / n2)
    a = (v[0] + u1[0] * s, v[1] + u1[1] * s)
    c = (v[0] + u2[0] * s, v[1] + u2[1] * s)
    b = (a[0] + u2[0] * s, a[1] + u2[1] * s)
    ax.plot([a[0], b[0], c[0]], [a[1], b[1], c[1]], color='black', lw=LW * 0.85)


def tick(ax, a, b, n=1, size=0.16, t=0.5, sp=0.14):
    m = mid(a, b, t)
    th = math.atan2(b[1] - a[1], b[0] - a[0])
    for k in range(n):
        off = (k - (n - 1) / 2) * sp
        cx, cy = m[0] + off * math.cos(th), m[1] + off * math.sin(th)
        ax.plot([cx - size * math.sin(th), cx + size * math.sin(th)], [cy + size * math.cos(th), cy - size * math.cos(th)], 'k-', lw=LW * 0.9)


def parallel(ax, a, b, n=1, size=0.2, t=0.5):
    """arrow head(s) on segment a-b marking parallel lines"""
    th = math.atan2(b[1] - a[1], b[0] - a[0])
    for k in range(n):
        m = mid(a, b, t + (k - (n - 1) / 2) * 0.07)
        tip = (m[0] + size * math.cos(th), m[1] + size * math.sin(th))
        l = (m[0] - size * math.cos(th) - size * 0.7 * math.sin(th), m[1] - size * math.sin(th) + size * 0.7 * math.cos(th))
        r_ = (m[0] - size * math.cos(th) + size * 0.7 * math.sin(th), m[1] - size * math.sin(th) - size * 0.7 * math.cos(th))
        ax.add_patch(Polygon([tip, l, r_], closed=True, fc='black', ec='black'))


def on_circle(c, r, deg):
    return (c[0] + r * math.cos(math.radians(deg)), c[1] + r * math.sin(math.radians(deg)))


def circle(ax, c=(0, 0), r=1.0, dot=True):
    ax.add_patch(Circle(c, r, fill=False, lw=LW, ec='black'))
    if dot:
        ax.plot(*c, 'ko', ms=5)


def lim(ax, xs, ys, m=0.3):
    ax.set_xlim(min(xs) - m, max(xs) + m)
    ax.set_ylim(min(ys) - m, max(ys) + m)


# ───────────────────────────── Q8 ─────────────────────────────

def q8_1():  # mast PQ 24 m, elevation 38 deg from R
    fig, ax = new()
    Q, P, R = (0, 0), (0, 2.4), (3.07, 0)
    poly(ax, [P, Q, R])
    right(ax, Q, P, R, 0.22)
    arc(ax, R, P, Q, 0.55, '38°', rt=1.05)
    lbl(ax, P, 'P', (-0.25, 0.1)); lbl(ax, Q, 'Q', (-0.25, -0.2)); lbl(ax, R, 'R', (0.25, -0.2))
    lbl(ax, mid(P, Q), '24 m', (-0.55, 0), fs=FS - 4)
    lim(ax, [-0.8, 3.4], [-0.5, 2.7])
    save(fig, ax, 'q8_1.png')


def q8_2():  # triangle KLM, KM = 7, KL = 13, angle M = 60
    fig, ax = new()
    M, L = (0, 0), (4.5, 0)
    K = (0.7 * math.cos(math.radians(60)) * 3, 0.7 * math.sin(math.radians(60)) * 3)
    poly(ax, [K, L, M])
    arc(ax, M, K, L, 0.35, '60°', rt=0.75)
    lbl(ax, K, 'K', (0, 0.25)); lbl(ax, L, 'L', (0.25, -0.2)); lbl(ax, M, 'M', (-0.25, -0.2))
    lbl(ax, mid(K, M), '7', (-0.3, 0.1), fs=FS - 4)
    lbl(ax, mid(K, L), '13', (0.3, 0.2), fs=FS - 4)
    lbl(ax, mid(M, L), 'x', (0, -0.3), fs=FS - 4)
    lim(ax, [-0.5, 4.8], [-0.6, 2.2])
    save(fig, ax, 'q8_2.png')


def q8_4():  # pole GH 18 m, K on GH, L 14 m from H, elevation of K 25 deg
    fig, ax = new()
    H, G, L = (0, 0), (0, 3.6), (2.8, 0)
    K = (0, 2.8 * math.tan(math.radians(25)))
    seg(ax, H, G); seg(ax, H, L); seg(ax, L, K)
    right(ax, H, G, L, 0.2)
    arc(ax, L, K, H, 0.55, '25°', rt=1.05)
    ax.plot(*K, 'ko', ms=5)
    lbl(ax, G, 'G', (-0.25, 0.1)); lbl(ax, H, 'H', (-0.25, -0.2)); lbl(ax, K, 'K', (-0.3, 0)); lbl(ax, L, 'L', (0.25, -0.2))
    lbl(ax, mid(H, L), '14 m', (0, -0.3), fs=FS - 4)
    # dimension line for the full height GH, drawn to the left of the pole
    dx = -0.85
    ax.annotate('', xy=(dx, G[1]), xytext=(dx, H[1]), arrowprops=dict(arrowstyle='<->', lw=LW * 0.8, color='black'))
    seg(ax, (dx - 0.08, G[1]), (-0.05, G[1]), lw=LW * 0.5); seg(ax, (dx - 0.08, H[1]), (-0.05, H[1]), lw=LW * 0.5)
    lbl(ax, (dx, mid(G, H)[1]), '18 m', (-0.45, 0), fs=FS - 6)
    lim(ax, [-1.9, 3.2], [-0.6, 3.9])
    save(fig, ax, 'q8_4.png')


# ───────────────────────────── Q9 ─────────────────────────────

def q9_1():  # cyclic quad PQRS, QR produced to T, angle SRT = 77
    fig, ax = new()
    O = (0, 0)
    circle(ax, O, 1.0, dot=False)
    P, Q, R, S = (on_circle(O, 1, d) for d in (150, 215, 300, 50))
    poly(ax, [P, Q, R, S])
    T = (R[0] + (R[0] - Q[0]) * 0.7, R[1] + (R[1] - Q[1]) * 0.7)
    seg(ax, R, T)
    arc(ax, R, S, T, 0.18, '77°', rt=0.62, fs=FS - 8)
    for p, n_, o in ((P, 'P', (-0.15, 0.12)), (Q, 'Q', (-0.17, -0.1)), (R, 'R', (0.0, -0.2)), (S, 'S', (0.13, 0.12)), (T, 'T', (0.15, -0.08))):
        lbl(ax, p, n_, o)
    lim(ax, [-1.3, 1.6], [-1.4, 1.25])
    save(fig, ax, 'q9_1.png')


def q9_3():  # cyclic quad ABCD, angle ABC = 64, angle DAC = 32, AC drawn
    fig, ax = new()
    O = (0, 0)
    circle(ax, O, 1.0, dot=False)
    A, B, C, D = (on_circle(O, 1, d) for d in (160, 250, 340, 70))
    poly(ax, [A, B, C, D]); seg(ax, A, C)
    arc(ax, B, A, C, 0.2, '64°', rt=0.42, fs=FS - 6)
    arc(ax, A, D, C, 0.3, '32°', rt=0.55, fs=FS - 6)
    for p, n_, o in ((A, 'A', (-0.15, 0.05)), (B, 'B', (-0.08, -0.17)), (C, 'C', (0.15, -0.05)), (D, 'D', (0.05, 0.15))):
        lbl(ax, p, n_, o)
    lim(ax, [-1.3, 1.3], [-1.3, 1.3])
    save(fig, ax, 'q9_3.png')


def q9_4():  # A, B, C, D on circle, chords AC and BD, angle BAC = 2x + 5, angle BDC = 3x - 25
    fig, ax = new()
    O = (0, 0)
    circle(ax, O, 1.0, dot=False)
    A, D, B, C = (on_circle(O, 1, d) for d in (150, 30, 215, 325))
    seg(ax, B, C); seg(ax, A, B); seg(ax, A, C); seg(ax, D, B); seg(ax, D, C)
    # labels sit inside the (widened) angles, clear of both arms
    arc(ax, A, B, C, 0.22, '2x + 5°', rt=0.62, fs=FS - 12)
    arc(ax, D, B, C, 0.22, '3x − 25°', rt=0.66, fs=FS - 12)
    for p, n_, o in ((A, 'A', (-0.15, 0.08)), (B, 'B', (-0.12, -0.13)), (C, 'C', (0.12, -0.13)), (D, 'D', (0.15, 0.08))):
        lbl(ax, p, n_, o)
    lim(ax, [-1.3, 1.3], [-1.3, 1.3])
    save(fig, ax, 'q9_4.png')


# ───────────────────────────── Q10 ─────────────────────────────

def q10_1():  # triangle PQR, ST || QR
    fig, ax = new()
    P, Q, R = (1.8, 3.0), (0, 0), (4.0, 0)
    S, T = mid(P, Q, 0.42), mid(P, R, 0.42)
    poly(ax, [P, Q, R]); seg(ax, S, T)
    parallel(ax, S, T, size=0.12); parallel(ax, Q, R, size=0.12)
    for p, n_, o in ((P, 'P', (0, 0.25)), (Q, 'Q', (-0.25, -0.2)), (R, 'R', (0.25, -0.2)), (S, 'S', (-0.28, 0)), (T, 'T', (0.28, 0))):
        lbl(ax, p, n_, o)
    lim(ax, [-0.5, 4.5], [-0.5, 3.4])
    save(fig, ax, 'q10_1.png')


def q10_2():  # triangle KLM, NP || LM, KN = 8, NL = 6, KP = 12
    fig, ax = new()
    K, L, M = (1.6, 3.2), (0, 0), (4.4, 0)
    t = 8 / 14
    N, P = mid(K, L, t), mid(K, M, t)
    poly(ax, [K, L, M]); seg(ax, N, P)
    parallel(ax, N, P, size=0.12); parallel(ax, L, M, size=0.12)
    for p, n_, o in ((K, 'K', (0, 0.25)), (L, 'L', (-0.25, -0.2)), (M, 'M', (0.25, -0.2)), (N, 'N', (-0.3, 0)), (P, 'P', (0.3, 0))):
        lbl(ax, p, n_, o)
    lbl(ax, mid(K, N), '8', (-0.3, 0.05), fs=FS - 4)
    lbl(ax, mid(N, L), '6', (-0.3, 0.05), fs=FS - 4)
    lbl(ax, mid(K, P), '12', (0.35, 0.05), fs=FS - 4)
    lim(ax, [-0.5, 4.8], [-0.5, 3.6])
    save(fig, ax, 'q10_2.png')


def q10_3():  # centre O, OM perpendicular to chord AB
    fig, ax = new()
    O = (0, 0)
    circle(ax, O, 1.0)
    A, B = on_circle(O, 1, 200), on_circle(O, 1, 320)
    M = mid(A, B)
    seg(ax, A, B); seg(ax, O, M)
    right(ax, M, O, B, 0.1)
    for p, n_, o in ((O, 'O', (0, 0.15)), (A, 'A', (-0.15, -0.05)), (B, 'B', (0.15, -0.05)), (M, 'M', (0, -0.17))):
        lbl(ax, p, n_, o)
    lim(ax, [-1.3, 1.3], [-1.3, 1.3])
    save(fig, ax, 'q10_3.png')


def q10_4():  # triangle ABC, M and N midpoints of AB and AC, MN = 7.5
    fig, ax = new()
    A, B, C = (1.4, 3.0), (0, 0), (4.2, 0)
    M, N = mid(A, B), mid(A, C)
    poly(ax, [A, B, C]); seg(ax, M, N)
    tick(ax, A, M, 1); tick(ax, M, B, 1); tick(ax, A, N, 2); tick(ax, N, C, 2)
    for p, n_, o in ((A, 'A', (0, 0.25)), (B, 'B', (-0.25, -0.2)), (C, 'C', (0.25, -0.2)), (M, 'M', (-0.3, 0)), (N, 'N', (0.3, 0))):
        lbl(ax, p, n_, o)
    lbl(ax, mid(M, N), '7.5', (0, 0.22), fs=FS - 4)
    lim(ax, [-0.5, 4.6], [-0.5, 3.4])
    save(fig, ax, 'q10_4.png')


# ───────────────────────────── Q11 ─────────────────────────────

def q11_1():  # tangent TA at A, chord AB, C in alternate segment, angle TAB = 58
    fig, ax = new()
    O = (0, 0)
    circle(ax, O, 1.0, dot=False)
    A = on_circle(O, 1, 270)
    B, C = on_circle(O, 1, 26), on_circle(O, 1, 150)
    T, X = (A[0] + 1.6, A[1]), (A[0] - 1.4, A[1])
    seg(ax, X, T); seg(ax, A, B); seg(ax, A, C); seg(ax, C, B)
    arc(ax, A, T, B, 0.3, '58°', rt=0.6, fs=FS - 6)
    for p, n_, o in ((A, 'A', (0, -0.18)), (B, 'B', (0.15, 0.05)), (C, 'C', (-0.15, 0.08)), (T, 'T', (0.15, 0))):
        lbl(ax, p, n_, o)
    lim(ax, [-1.5, 1.8], [-1.3, 1.2])
    save(fig, ax, 'q11_1.png')


def q11_2():  # tangents EA, EC from E, angle AEC = 48
    fig, ax = new()
    O = (0, 0)
    circle(ax, O, 1.0, dot=False)
    d = 1 / math.sin(math.radians(24))
    E = (-d, 0)
    A, C = on_circle(O, 1, 180 - 66), on_circle(O, 1, 180 + 66)
    seg(ax, E, A); seg(ax, E, C); seg(ax, A, C)
    arc(ax, E, A, C, 0.6, '48°', rt=0.95, fs=FS - 6)
    for p, n_, o in ((E, 'E', (-0.18, 0)), (A, 'A', (0, 0.17)), (C, 'C', (0, -0.18))):
        lbl(ax, p, n_, o)
    lim(ax, [-d - 0.4, 1.2], [-1.3, 1.3])
    save(fig, ax, 'q11_2.png')


def chords(ax, names):  # two chords meeting at E inside the circle
    O = (0, 0)
    circle(ax, O, 1.0, dot=False)
    p1, p2, p3, p4 = (on_circle(O, 1, d) for d in (150, 330 - 25, 60, 230))
    seg(ax, p1, p2); seg(ax, p3, p4)
    # intersection
    x1, y1 = p1; x2, y2 = p2; x3, y3 = p3; x4, y4 = p4
    den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / den
    py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / den
    E = (px, py)
    offs = ((-0.15, 0.08), (0.12, -0.12), (0.1, 0.13), (-0.12, -0.12))
    for p, n_, o in zip((p1, p2, p3, p4), names[:4], offs):
        lbl(ax, p, n_, o)
    lbl(ax, E, names[4], (0.0, 0.17))
    return p1, p2, p3, p4, E


def q11_3():  # chords AB and CD meet at E; join AC and DB
    fig, ax = new()
    A, B, C, D, E = chords(ax, 'ABCDE')
    seg(ax, A, C); seg(ax, D, B)
    lim(ax, [-1.3, 1.3], [-1.3, 1.3])
    save(fig, ax, 'q11_3.png')


def q11_4():  # chords PQ and RS meet at T; PT = 4, TQ = 9, RT = 3
    fig, ax = new()
    P, Q, R, S, T = chords(ax, 'PQRST')
    seg(ax, P, R); seg(ax, S, Q)
    lbl(ax, mid(P, T), '4', (0, 0.12), fs=FS - 6)
    lbl(ax, mid(T, Q), '9', (0, 0.12), fs=FS - 6)
    lbl(ax, mid(R, T), '3', (0.12, 0), fs=FS - 6)
    lim(ax, [-1.3, 1.3], [-1.3, 1.3])
    save(fig, ax, 'q11_4.png')


if __name__ == '__main__':
    only = sys.argv[1:]
    for f in (q8_1, q8_2, q8_4, q9_1, q9_3, q9_4, q10_1, q10_2, q10_3, q10_4, q11_1, q11_2, q11_3, q11_4):
        if not only or f.__name__ in only:
            f()
    print('ok', sorted(os.listdir(OUT)))
