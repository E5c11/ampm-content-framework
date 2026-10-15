#!/usr/bin/env python3
"""
Render generated Accounting statements (CLOSED-FIG-03) from JSON specs written by lib.js.

  python3 scripts/_gen/accounting/render_statement.py temp/images/accounting/2025/nov_p1/specs temp/images/accounting/2025/nov_p1

Spec: {"id", "title", "subtitle", "cols": ["", "Note", "R"], "rows": [{"k": "head|line|sub|total|gap|text", "c": ["label", "note", "amount"], "i": 0}]}
A cell that is {"blank": "A"} renders as a high-contrast amber box carrying the letter (readable without colour).
Palette: amber #FFC107 box + near-black letter (contrast ~12:1), dark-ink text on white; rules in mid grey.
"""
import json
import os
import sys
import textwrap

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

INK = "#1F2933"
RULE = "#6B7280"
HEAD_BG = "#E8EEF7"
BLANK_BG = "#FFC107"
W = 5.4            # inches; large type so the figure stays legible when scaled to phone width
FS = 12
ROW_H = 0.36
CHAR_W = 0.0078    # inches per character per point of font size (DejaVu Sans, approx)


def draw(spec, out):
    rows = spec["rows"]
    cols = spec["cols"]
    n = len(cols)
    amt_w = 1.12
    label_x = 0.18
    n_amt = n - 1
    label_w = W - 0.18 - n_amt * (amt_w + 0.08) - label_x - 0.1
    wrapped = []
    total_rows = 0.0
    for r in rows:
        if r.get("k") == "gap":
            wrapped.append([]); total_rows += 0.5; continue
        text = r["c"][0] if r.get("c") else ""
        indent = 0.2 * r.get("i", 0)
        full = r.get("k") in ("text", "band")
        width_chars = max(8, int((W - 0.4 - indent) / (0.0064 * FS)) if full else int((label_w - indent) / (CHAR_W * FS)))
        lines = textwrap.wrap(text, width_chars) or [""]
        wrapped.append(lines)
        total_rows += (0.19 * len(lines) + 0.1) / ROW_H if r.get('k') == 'text' else 1 + 0.62 * (len(lines) - 1)
    title_h = 0.55 + (0.3 if spec.get("subtitle") else 0)
    has_hdr = not (rows and rows[0].get('k') == 'band')
    h = title_h + ROW_H * (total_rows + (1 if has_hdr else 0)) + 0.25
    fig = plt.figure(figsize=(W, h), dpi=220)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, W)
    ax.set_ylim(h, 0)
    ax.axis("off")
    fig.patch.set_facecolor("white")

    # column x positions: label | (notes) | amounts right-aligned
    right = W - 0.18
    if n not in (2, 3, 4):
        raise ValueError("2-4 columns")
    xs = [right - (n_amt - 1 - i) * (amt_w + 0.08) for i in range(n_amt)]

    y = 0.12
    ax.text(W / 2, y + 0.18, spec["title"], ha="center", va="center", fontsize=min(FS + 1, (FS + 1) * 38 / max(len(spec["title"]), 1)), fontweight="bold", color=INK)
    y += 0.42
    if spec.get("subtitle"):
        ax.text(W / 2, y + 0.04, spec["subtitle"], ha="center", va="center", fontsize=FS - 2, color=INK)
        y += 0.3
    # header band (skipped when the figure opens with an INFORMATION band)
    if has_hdr:
        ax.add_patch(plt.Rectangle((0.06, y), W - 0.12, ROW_H, color=HEAD_BG, lw=0))
        ax.text(label_x, y + ROW_H / 2, cols[0], ha="left", va="center", fontsize=FS - 1, fontweight="bold", color=INK)
        for xi, name in zip(xs, cols[1:]):
            ax.text(xi, y + ROW_H / 2, name, ha="right", va="center", fontsize=FS - 1, fontweight="bold", color=INK)
        y += ROW_H

    for r, lines in zip(rows, wrapped):
        k = r.get("k", "line")
        cells = r.get("c", [])
        indent = 0.2 * r.get("i", 0)
        if k == "gap":
            y += ROW_H * 0.5
            continue
        row_h = (0.19 * len(lines) + 0.1) if k == "text" else ROW_H * (1 + 0.62 * (len(lines) - 1))
        if k == "band":
            ax.add_patch(plt.Rectangle((0.06, y), W - 0.12, ROW_H, color=HEAD_BG, lw=0))
            ax.text(label_x, y + ROW_H / 2, cells[0], ha="left", va="center", fontsize=FS - 1, fontweight="bold", color=INK)
            y += ROW_H
            continue
        if k == "text":
            ax.text(label_x + indent, y + row_h / 2, "\n".join(lines), ha="left", va="center", fontsize=FS - 1, color=INK, linespacing=1.2)
            y += row_h
            continue
        weight = "bold" if k in ("sub", "total", "head") else "normal"
        ax.text(label_x + indent, y + row_h / 2, "\n".join(lines), ha="left", va="center", fontsize=FS, fontweight=weight, color=INK,
                linespacing=1.15)
        for xi, val in zip(xs, cells[1:]):
            if val is None or val == "":
                continue
            if isinstance(val, dict) and "blank" in val:
                bw, bh = amt_w - 0.1, ROW_H - 0.06
                ax.add_patch(FancyBboxPatch((xi - bw, y + row_h / 2 - bh / 2), bw, bh, boxstyle="round,pad=0,rounding_size=0.05",
                                            fc=BLANK_BG, ec=INK, lw=1.4))
                ax.text(xi - bw / 2, y + row_h / 2 + 0.01, val["blank"], ha="center", va="center", fontsize=FS + 1,
                        fontweight="bold", color=INK)
            else:
                weight = "bold" if k in ("sub", "total") else "normal"
                ax.text(xi - 0.04, y + row_h / 2, str(val), ha="right", va="center", fontsize=FS, fontweight=weight, color=INK)
        if k in ("sub", "total"):
            for xi in xs:
                ax.plot([xi - amt_w + 0.12, xi], [y + 0.02, y + 0.02], color=RULE, lw=0.8)
                if k == "total":
                    ax.plot([xi - amt_w + 0.12, xi], [y + row_h - 0.02, y + row_h - 0.02], color=RULE, lw=0.8)
                    ax.plot([xi - amt_w + 0.12, xi], [y + row_h - 0.05, y + row_h - 0.05], color=RULE, lw=0.8)
        y += row_h

    fig.savefig(out, facecolor="white")
    plt.close(fig)


def main():
    spec_dir, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)
    for f in sorted(os.listdir(spec_dir)):
        if not f.endswith(".json"):
            continue
        spec = json.load(open(os.path.join(spec_dir, f)))
        out = os.path.join(out_dir, f.replace(".json", ".png"))
        draw(spec, out)
        print("wrote", out)


if __name__ == "__main__":
    main()
