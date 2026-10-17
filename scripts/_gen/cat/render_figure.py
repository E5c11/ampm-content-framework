#!/usr/bin/env python3
"""
Render generated CAT practice figures (CLOSED-FIG-04) from JSON specs written by lib.js (writeSpecs).

  python3 scripts/_gen/cat/render_figure.py temp/images/cat/2025/nov_p2/specs temp/images/cat/2025/nov_p2/figs

Kinds
  table : {"kind":"table","label","title"?,"cols":[...],"rows":[[cell,...]],"colw":[rel,...]?,"sheet":bool?,"mono":bool?,"caption"?}
          cell = "text" | {"t":"text","bg":"#hex","b":true,"a":"l|c|r"}; sheet=true adds spreadsheet column letters and row numbers.
  code  : {"kind":"code","label","lines":[...],"title"?}
  chart : {"kind":"chart","label","title"?,"categories":[...],"series":[{"name","values":[...]}],"xlabel"?,"ylabel"?,"legend":bool?,"valuelabels":bool?,"ymax"?}
Palette: dark ink on white, soft grey header, amber (#FFC107) highlight with dark text (readable without colour), series in two validated high-contrast fills.
"""
import json
import os
import sys
import textwrap

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

INK = "#1F2933"
RULE = "#6B7280"
HEAD_BG = "#E8EEF7"
SHEET_BG = "#D9DEE6"
W = 5.4
FS = 12
LINE_H = 0.27
PAD = 0.12
CHAR_W = 0.0079  # inches per char per pt (DejaVu Sans, approx)
MONO_W = 0.0092


def cell_of(c):
    if isinstance(c, dict):
        return c.get("t", ""), c.get("bg"), bool(c.get("b")), c.get("a", "l")
    return str(c), None, False, "l"


def col_letters(n):
    return [chr(ord("A") + i) for i in range(n)]


def draw_table(spec, out):
    cols = list(spec.get("cols", []))
    rows = [list(r) for r in spec["rows"]]
    sheet = spec.get("sheet", False)
    mono = spec.get("mono", False)
    ncol = len(cols) if cols else len(rows[0])
    colw = spec.get("colw") or [1] * ncol
    gutter = 0.38 if sheet else 0.0
    total = sum(colw)
    inner = W - 0.2 - gutter
    widths = [inner * w / total for w in colw]
    cw = (MONO_W if mono else CHAR_W) * FS

    def wrap(txt, width):
        n = max(4, int((width - 2 * PAD) / cw))
        out = []
        for part in str(txt).split("\n"):
            out.extend(textwrap.wrap(part, n) or [""])
        return out

    header = cols if cols else None
    all_rows = ([header] if header else []) + rows
    laid = []
    for ri, r in enumerate(all_rows):
        cells = []
        for ci in range(ncol):
            c = r[ci] if ci < len(r) else ""
            t, bg, b, a = cell_of(c)
            cells.append((wrap(t, widths[ci]), bg, b or (header is not None and ri == 0), a))
        h = max(len(x[0]) for x in cells) * LINE_H + 2 * PAD * 0.6
        laid.append((cells, h))
    title = spec.get("title")
    caption = spec.get("caption")
    top = 0.15 + (0.42 if title else 0) + (0.3 if sheet else 0)
    bottom = 0.15 + (0.4 if caption else 0)
    height = top + sum(h for _, h in laid) + bottom
    fig = plt.figure(figsize=(W, height), dpi=200)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, W)
    ax.set_ylim(height, 0)
    ax.axis("off")
    y = 0.12
    if title:
        ax.text(W / 2, y + 0.2, title, ha="center", va="center", fontsize=FS, fontweight="bold", color=INK)
        y += 0.42
    x0 = 0.1 + gutter
    if sheet:
        letters = col_letters(ncol)
        x = x0
        for i, wdt in enumerate(widths):
            ax.add_patch(Rectangle((x, y), wdt, 0.3, facecolor=SHEET_BG, edgecolor=RULE, linewidth=0.8))
            ax.text(x + wdt / 2, y + 0.15, letters[i], ha="center", va="center", fontsize=FS - 2, color=INK)
            x += wdt
        y += 0.3
    for ri, (cells, h) in enumerate(laid):
        if sheet:
            ax.add_patch(Rectangle((0.1, y), gutter, h, facecolor=SHEET_BG, edgecolor=RULE, linewidth=0.8))
            ax.text(0.1 + gutter / 2, y + h / 2, str(ri + 1), ha="center", va="center", fontsize=FS - 2, color=INK)
        x = x0
        for ci, (lines, bg, b, a) in enumerate(cells):
            face = bg or (HEAD_BG if (header is not None and ri == 0 and not sheet) else "white")
            ax.add_patch(Rectangle((x, y), widths[ci], h, facecolor=face, edgecolor=RULE, linewidth=0.8))
            ty = y + PAD * 0.6 + LINE_H / 2
            for ln in lines:
                if a == "r":
                    tx, ha = x + widths[ci] - PAD, "right"
                elif a == "c":
                    tx, ha = x + widths[ci] / 2, "center"
                else:
                    tx, ha = x + PAD, "left"
                ax.text(tx, ty, ln, ha=ha, va="center", fontsize=FS, color=INK, fontweight="bold" if b else "normal", family="DejaVu Sans Mono" if mono else "DejaVu Sans")
                ty += LINE_H
            x += widths[ci]
        y += h
    if caption:
        ax.text(W / 2, y + 0.25, caption, ha="center", va="center", fontsize=FS - 2, style="italic", color=INK)
    fig.savefig(out, facecolor="white")
    plt.close(fig)


def draw_code(spec, out):
    lines = spec["lines"]
    cw = MONO_W * (FS - 1)
    n = max(10, int((W - 0.5) / cw))
    wrapped = []
    for ln in lines:
        wrapped.extend(textwrap.wrap(ln, n, subsequent_indent="  ") or [""])
    title = spec.get("title")
    height = 0.3 + (0.4 if title else 0) + len(wrapped) * 0.25 + 0.25
    fig = plt.figure(figsize=(W, height), dpi=200)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, W)
    ax.set_ylim(height, 0)
    ax.axis("off")
    y = 0.12
    if title:
        ax.text(W / 2, y + 0.18, title, ha="center", va="center", fontsize=FS, fontweight="bold", color=INK)
        y += 0.4
    ax.add_patch(Rectangle((0.1, y), W - 0.2, len(wrapped) * 0.25 + 0.2, facecolor="#F3F4F6", edgecolor=INK, linewidth=1.2))
    ty = y + 0.2
    for ln in wrapped:
        ax.text(0.25, ty, ln, ha="left", va="center", fontsize=FS - 1, family="DejaVu Sans Mono", color=INK)
        ty += 0.25
    fig.savefig(out, facecolor="white")
    plt.close(fig)


def draw_chart(spec, out):
    cats = ["\n".join(textwrap.wrap(c, 16)) for c in spec["categories"]]
    series = spec["series"]
    n = len(series)
    fig, ax = plt.subplots(figsize=(W, 3.6), dpi=200)
    fills = ["#9AA5B1", "#1F2933", "#F59E0B"]
    hatches = ["", "//", ".."]
    width = 0.8 / n
    for i, s in enumerate(series):
        xs = [k + (i - (n - 1) / 2) * width for k in range(len(cats))]
        bars = ax.bar(xs, s["values"], width=width * 0.92, color=fills[i % 3], edgecolor=INK, hatch=hatches[i % 3] if n > 1 and i > 0 else "", label=s["name"])
        if spec.get("valuelabels"):
            for b, v in zip(bars, s["values"]):
                ax.text(b.get_x() + b.get_width() / 2, v, str(v), ha="center", va="bottom", fontsize=FS - 3, color=INK)
    ax.set_xticks(range(len(cats)))
    ax.set_xticklabels(cats, fontsize=FS - 4, color=INK)
    ax.tick_params(axis="y", labelsize=FS - 3, colors=INK)
    if spec.get("ymax"):
        ax.set_ylim(0, spec["ymax"])
    if spec.get("title"):
        ax.set_title(spec["title"], fontsize=FS, fontweight="bold", color=INK)
    if spec.get("xlabel"):
        ax.set_xlabel(spec["xlabel"], fontsize=FS - 2, color=INK)
    if spec.get("ylabel"):
        ax.set_ylabel(spec["ylabel"], fontsize=FS - 2, color=INK)
    if spec.get("legend", True):
        ax.legend(fontsize=FS - 3, frameon=False, loc="upper center", bbox_to_anchor=(0.5, -0.28 if not spec.get("xlabel") else -0.38), ncol=n)
    for sp in ("top", "right"):
        ax.spines[sp].set_visible(False)
    ax.yaxis.grid(True, color="#D1D5DB", linewidth=0.6)
    ax.set_axisbelow(True)
    fig.tight_layout()
    fig.savefig(out, facecolor="white")
    plt.close(fig)


def main():
    src, dst = sys.argv[1], sys.argv[2]
    os.makedirs(dst, exist_ok=True)
    only = sys.argv[3:]
    for f in sorted(os.listdir(src)):
        if not f.endswith(".json"):
            continue
        if only and not any(f.startswith(o) for o in only):
            continue
        spec = json.load(open(os.path.join(src, f)))
        out = os.path.join(dst, f.replace(".json", ".png"))
        {"table": draw_table, "code": draw_code, "chart": draw_chart}[spec["kind"]](spec, out)
        print("rendered", out)


if __name__ == "__main__":
    main()
