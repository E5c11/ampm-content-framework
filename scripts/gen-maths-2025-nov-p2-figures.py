#!/usr/bin/env python3
"""Usage: OUT=temp/images/maths-p2-2025/supp python3 scripts/gen-maths-2025-nov-p2-figures.py
Question-level diagrams for DBE Maths Nov 2025 P2, Q8-Q11 practice questions.
Clean exam-style line art. Givens are labelled; the quantity a question asks for is never shown."""
import math, os
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

def q8_2():  # rectangular ramp surface 14 m x 28 m, diagonal
    fig, ax = new()
    A, B, C, D = (0, 2.8), (0, 0), (5.6, 0), (5.6, 2.8)
    poly(ax, [A, B, C, D])
    seg(ax, A, C, ls='--')
    for v in (B, C, D):
        pass
    right(ax, B, A, C, 0.25)
    lbl(ax, A, 'A', (-0.3, 0.25)); lbl(ax, B, 'B', (-0.3, -0.25)); lbl(ax, C, 'C', (0.3, -0.25)); lbl(ax, D, 'D', (0.3, 0.25))
    lbl(ax, mid(A, B), '14 m', (-0.95, 0))
    lbl(ax, mid(B, C), '28 m', (0, -0.4))
    lbl(ax, mid(A, C, 0.55), 'AC', (0.1, 0.38), fs=FS - 2)
    lim(ax, [-1.6, 6.4], [-0.9, 3.4])
    save(fig, ax, 'q8_2.png')


def q8_3():  # triangle PQR, angle Q = 98, angle P = 37, QR = 22 (drawn landscape: PR as the base)
    fig, ax = new()
    k = 7.2 / 36.2                      # scale: PR = 22 sin98 / sin37 = 36.2
    P, R = (0.0, 0.0), (7.2, 0.0)
    QPl = 22 * math.sin(math.radians(45)) / math.sin(math.radians(37)) * k
    Q = (QPl * math.cos(math.radians(37)), QPl * math.sin(math.radians(37)))
    poly(ax, [P, Q, R])
    arc(ax, P, Q, R, 1.1, '37°', 1.9, fs=FS - 6)
    arc(ax, Q, P, R, 0.55, '98°', 1.05, fs=FS - 6)
    lbl(ax, P, 'P', (-0.3, -0.25)); lbl(ax, Q, 'Q', (0, 0.32)); lbl(ax, R, 'R', (0.3, -0.25))
    lbl(ax, mid(Q, R), '22 cm', (1.0, 0.3))
    lim(ax, [-0.7, 7.9], [-0.7, Q[1] + 0.8])
    save(fig, ax, 'q8_3.png')


def q8_4():  # general triangle, sides a b c, theta opposite c
    fig, ax = new()
    A, B, C = (0, 0), (5.2, 0), (1.5, 3.1)
    # c = AB (bottom), theta at C (opposite c); a = BC, b = AC
    poly(ax, [A, B, C])
    arc(ax, C, A, B, 0.7, 'θ', 1.15, fs=FS)
    lbl(ax, mid(A, B), 'c', (0, -0.38), fs=FS)
    lbl(ax, mid(B, C), 'a', (0.35, 0.18), fs=FS)
    lbl(ax, mid(A, C), 'b', (-0.35, 0.18), fs=FS)
    lim(ax, [-0.6, 5.8], [-0.9, 3.7])
    save(fig, ax, 'q8_4.png')


# ───────────────────────────── Q9 ─────────────────────────────

def q9_1():  # circle centre O, A, B on circle, angle OAB = 35
    fig, ax = new()
    O = (0, 0)
    circle(ax, O, 1.0)
    A = on_circle(O, 1, 200)
    B = on_circle(O, 1, 340 - 0)
    # make angle OAB = 35: isosceles OAB => angle AOB = 110; place B at 200-110 = 90 => choose A at 215, B at 325
    A = on_circle(O, 1, 215); B = on_circle(O, 1, 325)
    seg(ax, O, A); seg(ax, O, B); seg(ax, A, B)
    arc(ax, A, O, B, 0.28, '35°', 0.52, fs=FS - 6)
    lbl(ax, O, 'O', (0, 0.18)); lbl(ax, A, 'A', (-0.18, -0.12)); lbl(ax, B, 'B', (0.18, -0.12))
    lim(ax, [-1.2, 1.2], [-1.2, 1.2])
    save(fig, ax, 'q9_1.png')


def q9_2():  # tangent XY at X, centre O
    fig, ax = new()
    O = (0, 0)
    circle(ax, O, 1.0)
    X = on_circle(O, 1, 90)
    Xp, Y = (-1.8, 1.0), (1.8, 1.0)
    seg(ax, Xp, Y)
    seg(ax, O, X)
    lbl(ax, O, 'O', (0.18, -0.1)); lbl(ax, X, 'X', (-0.0, 0.25)); lbl(ax, Y, 'Y', (0.2, 0.0))
    lim(ax, [-2.1, 2.1], [-1.25, 1.5])
    save(fig, ax, 'q9_2.png')


def q9_3():  # cyclic quad ABCD, centre O, OA and OC joined
    fig, ax = new()
    O = (0, 0)
    circle(ax, O, 1.0)
    A, B, C, D = on_circle(O, 1, 215), on_circle(O, 1, 285), on_circle(O, 1, 25), on_circle(O, 1, 120)
    poly(ax, [A, B, C, D])
    seg(ax, O, A); seg(ax, O, C)
    lbl(ax, A, 'A', (-0.2, -0.1)); lbl(ax, B, 'B', (0.0, -0.25)); lbl(ax, C, 'C', (0.22, 0.05)); lbl(ax, D, 'D', (-0.05, 0.25))
    lbl(ax, O, 'O', (0.12, -0.2), fs=FS - 2)
    lim(ax, [-1.3, 1.3], [-1.35, 1.35])
    save(fig, ax, 'q9_3.png')


def q9_4():  # diameter XOY, tangent at Y with Z, OZ cuts circle at W, angle WXY = 24
    fig, ax = new()
    O = (0, 0)
    circle(ax, O, 1.0)
    X, Y = (0, 1), (0, -1)
    yz = 1 / math.tan(math.radians(42))
    Z = (yz, -1)
    d = math.hypot(*Z)
    W = (Z[0] / d, Z[1] / d)
    seg(ax, X, Y)
    seg(ax, (-1.5, -1), (2.0, -1))
    seg(ax, O, Z)
    seg(ax, X, W)
    arc(ax, X, Y, W, 0.32)
    lbl(ax, (0.47, 0.6), '24°', fs=FS - 6)
    lbl(ax, X, 'X', (0, 0.22)); lbl(ax, Y, 'Y', (-0.2, -0.2)); lbl(ax, Z, 'Z', (0.15, -0.25))
    lbl(ax, W, 'W', (0.25, 0.08)); lbl(ax, O, 'O', (-0.2, 0.0))
    lim(ax, [-1.7, 2.2], [-1.45, 1.4])
    save(fig, ax, 'q9_4.png')


# ───────────────────────────── Q10 ────────────────────────────

def quad(ax, degs, names='ABCD', offs=None):
    O = (0, 0)
    circle(ax, O, 1.0, dot=False)
    pts = [on_circle(O, 1, d) for d in degs]
    poly(ax, pts)
    for p, n_, o in zip(pts, names, offs):
        lbl(ax, p, n_, o)
    return pts


def q10_1():  # cyclic quad, angle ABC = 112
    fig, ax = new()
    pts = quad(ax, [202, 270, 338, 90], offs=[(-0.2, -0.05), (0, -0.25), (0.2, -0.05), (0, 0.25)])
    A, B, C, D = pts
    arc(ax, B, A, C, 0.28, '112°', 0.62, fs=FS - 6)
    lim(ax, [-1.3, 1.3], [-1.4, 1.4])
    save(fig, ax, 'q10_1.png')


def q10_3():  # AB diameter, C, D on circle, AB produced to E
    fig, ax = new()
    O = (0, 0)
    circle(ax, O, 1.0, dot=False)
    A, B = (-1, 0), (1, 0)
    C, D = on_circle(O, 1, 55), on_circle(O, 1, 125)
    poly(ax, [A, B, C, D])
    seg(ax, A, C); seg(ax, B, D)
    seg(ax, B, (1.85, 0))
    lbl(ax, A, 'A', (-0.2, -0.05)); lbl(ax, B, 'B', (0.12, -0.27)); lbl(ax, C, 'C', (0.2, 0.12)); lbl(ax, D, 'D', (-0.2, 0.12)); lbl(ax, (1.85, 0), 'E', (0.22, 0))
    lim(ax, [-1.3, 2.3], [-1.3, 1.35])
    save(fig, ax, 'q10_3.png')


def q10_4():  # cyclic quad, angle ABC = 3x, ADC = 2x + 20
    fig, ax = new()
    pts = quad(ax, [186, 270, 354, 100], offs=[(-0.2, -0.05), (0, -0.25), (0.2, -0.05), (-0.05, 0.25)])
    A, B, C, D = pts
    arc(ax, B, A, C, 0.28, '3x', 0.62, fs=FS - 4)
    arc(ax, D, A, C, 0.28, '(2x + 20)°', 0.85, fs=FS - 8)
    lim(ax, [-1.3, 1.3], [-1.4, 1.4])
    save(fig, ax, 'q10_4.png')


# ───────────────────────────── Q11 ────────────────────────────

def q11_1():  # triangle ABC, DE || BC, AD=6, DB=4, AE=9
    fig, ax = new()
    A, B, C = (0.2, 4.0), (-2.8, 0), (2.8, 0)
    D = mid(A, B, 0.6); E = mid(A, C, 0.6)
    poly(ax, [A, B, C])
    seg(ax, D, E)
    parallel(ax, D, E, 1, 0.14); parallel(ax, B, C, 1, 0.14)
    lbl(ax, A, 'A', (0, 0.3)); lbl(ax, B, 'B', (-0.3, -0.25)); lbl(ax, C, 'C', (0.3, -0.25))
    lbl(ax, D, 'D', (-0.3, 0.05)); lbl(ax, E, 'E', (0.3, 0.05))
    lbl(ax, mid(A, D), '6 cm', (-0.7, 0.1), fs=FS - 4)
    lbl(ax, mid(D, B), '4 cm', (-0.7, 0.0), fs=FS - 4)
    lbl(ax, mid(A, E), '9 cm', (0.75, 0.15), fs=FS - 4)
    lim(ax, [-3.8, 3.8], [-0.8, 4.6])
    save(fig, ax, 'q11_1.png')


def q11_2():  # triangle PQR, ST || QR
    fig, ax = new()
    P, Q, R = (0.4, 4.0), (-2.8, 0), (3.0, 0)
    S = mid(P, Q, 0.55); T = mid(P, R, 0.55)
    poly(ax, [P, Q, R])
    seg(ax, S, T)
    parallel(ax, S, T, 1, 0.14); parallel(ax, Q, R, 1, 0.14)
    lbl(ax, P, 'P', (0, 0.3)); lbl(ax, Q, 'Q', (-0.3, -0.25)); lbl(ax, R, 'R', (0.3, -0.25))
    lbl(ax, S, 'S', (-0.3, 0.05)); lbl(ax, T, 'T', (0.3, 0.05))
    lim(ax, [-3.4, 3.6], [-0.8, 4.6])
    save(fig, ax, 'q11_2.png')


def q11_3():  # two similar triangles, areas
    fig, ax = new(8.0, 4.4)
    A, B, C = (0, 0), (3.6, 0), (1.2, 2.4)
    k = 5 / 3
    off = 5.6
    P, Q, R = (off, 0), (off + 3.6 * k, 0), (off + 1.2 * k, 2.4 * k)
    poly(ax, [A, B, C]); poly(ax, [P, Q, R])
    for pt, n_, o in ((A, 'A', (-0.3, -0.25)), (B, 'B', (0.3, -0.25)), (C, 'C', (0, 0.28)),
                      (P, 'P', (-0.3, -0.25)), (Q, 'Q', (0.3, -0.25)), (R, 'R', (0, 0.28))):
        lbl(ax, pt, n_, o)
    lbl(ax, (1.65, 0.55), '27 cm²', (0, 0), fs=FS - 8)
    lbl(ax, (off + 1.9 * k, 1.1), 'Area = ?', (0, 0), fs=FS - 4)
    lim(ax, [-0.6, off + 3.6 * k + 0.6], [-0.8, 2.4 * k + 0.6])
    save(fig, ax, 'q11_3.png')


if __name__ == '__main__':
    for f in (q8_2, q8_3, q8_4, q9_1, q9_2, q9_3, q9_4, q10_1, q10_3, q10_4, q11_1, q11_2, q11_3):
        f()
    print('ok', sorted(os.listdir(OUT)))
