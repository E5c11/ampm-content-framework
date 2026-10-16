#!/usr/bin/env python3
"""Generated practice figures for Agricultural Sciences P2 Nov 2024 (CLOSED-FIG-01/02).

Fresh, illustrative data only — never the exam's own values. No value labels on marks the questions ask the student to read.
Palette: blue #2a78d6 / orange #eb6834 on white (validate_palette.js, light: all checks pass); series also differ by marker/line style or hatch.
Output: temp/images/agricultural_sciences/2024/nov_p2/figs/q<order>/<type>_<n>.png
  .venv/bin/python scripts/_gen/agri-2024-p2/figures.py
"""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

BLUE, ORANGE, INK, GRID = "#2a78d6", "#eb6834", "#222222", "#d9d9d9"
ROOT = os.path.join(os.path.dirname(__file__), "..", "..", "..", "temp", "images", "agricultural_sciences", "2024", "nov_p2", "figs")
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 13, "axes.edgecolor": INK, "axes.labelcolor": INK,
                     "xtick.color": INK, "ytick.color": INK, "axes.spines.top": False, "axes.spines.right": False})


def out(order, name):
    d = os.path.join(ROOT, f"q{order}")
    os.makedirs(d, exist_ok=True)
    return os.path.join(d, name)


def demand_graphs():
    """L7: two demand curves — Graph 1 steep (inelastic), Graph 2 flat (elastic). No caption naming the elasticity."""
    fig, axes = plt.subplots(1, 2, figsize=(10, 4.6))
    # (title, curve start, curve end, quantity at the higher price P2 = Q1, quantity at the lower price P1 = Q2)
    specs = [("GRAPH 1", (0.36, 0.95), (0.64, 0.05), 0.44, 0.56), ("GRAPH 2", (0.05, 0.80), (0.95, 0.40), 0.25, 0.80)]
    for ax, (title, p0, p1, q1, q2) in zip(axes, specs):
        slope = (p1[1] - p0[1]) / (p1[0] - p0[0])
        price = lambda q: p0[1] + slope * (q - p0[0])
        ax.plot([p0[0], p1[0]], [p0[1], p1[1]], color=BLUE, lw=2.5)
        for q, lab in ((q1, "P2"), (q2, "P1")):
            pr = price(q)
            ax.plot([0, q], [pr, pr], color=INK, lw=1, ls="--")
            ax.plot([q, q], [0, pr], color=INK, lw=1, ls="--")
            ax.text(-0.03, pr, lab, ha="right", va="center", fontsize=12)
        ax.set_xticks([q1, q2])
        ax.set_xticklabels(["Q1", "Q2"])
        ax.set_yticks([])
        ax.set_xlim(0, 1); ax.set_ylim(0, 1)
        ax.set_xlabel("Quantity demanded"); ax.set_ylabel("Price", labelpad=24)
        ax.set_title(title, fontweight="bold")
    fig.suptitle("Demand for two farm products (illustrative)", fontsize=14)
    fig.tight_layout()
    fig.savefig(out(7, "graph_1.png"), dpi=150, facecolor="white")
    plt.close(fig)


def nitrogen_table():
    """L12: nitrogen applied vs potato yield."""
    rows = [("0", "10"), ("20", "18"), ("40", "24"), ("60", "27"), ("80", "28"), ("100", "28")]
    fig, ax = plt.subplots(figsize=(6.4, 3.6))
    ax.axis("off")
    t = ax.table(cellText=rows, colLabels=["NITROGEN APPLIED (kg/ha)", "POTATO YIELD (t/ha)"], loc="center", cellLoc="center")
    t.auto_set_font_size(False); t.set_fontsize(13); t.scale(1, 1.7)
    for (r, c), cell in t.get_celld().items():
        cell.set_edgecolor(INK)
        if r == 0:
            cell.set_text_props(fontweight="bold"); cell.set_facecolor("#eef3fb")
    ax.set_title("Nitrogen fertiliser and potato yield (illustrative)", fontsize=13, pad=4)
    fig.tight_layout()
    fig.savefig(out(12, "table_1.png"), dpi=150, facecolor="white")
    plt.close(fig)


def income_bars():
    """L15: income and expenses per enterprise; gridlines every R5 000 so each bar top lands on a line."""
    ents = ["Broilers", "Vegetables", "Dairy"]
    income = [45000, 25000, 70000]
    expenses = [35000, 40000, 55000]
    fig, ax = plt.subplots(figsize=(8.2, 5))
    x = range(len(ents)); w = 0.36
    ax.bar([i - w / 2 - 0.01 for i in x], income, w, color=BLUE, label="Total income", zorder=3)
    ax.bar([i + w / 2 + 0.01 for i in x], expenses, w, color=ORANGE, hatch="//", edgecolor="white", label="Total expenses", zorder=3)
    ax.set_xticks(list(x)); ax.set_xticklabels(ents)
    ax.set_yticks(range(0, 80001, 5000))
    ax.set_yticklabels([f"{v:,}".replace(",", " ") for v in range(0, 80001, 5000)], fontsize=11)
    ax.yaxis.grid(True, color=GRID, zorder=0)
    ax.set_ylim(0, 80000)
    ax.set_xlabel("Enterprise"); ax.set_ylabel("Amount (R)")
    ax.set_title("Income and expenses of three enterprises, 2024/25 (illustrative)", fontsize=13)
    ax.legend(frameon=False, loc="upper left")
    fig.tight_layout()
    fig.savefig(out(15, "graph_1.png"), dpi=150, facecolor="white")
    plt.close(fig)


def gm_line_graph():
    """L22: GM vs non-GM soybean yield per region; gridlines every 500 kg/ha."""
    regions = ["P", "Q", "R", "S", "T"]
    non_gm = [2000, 2500, 3500, 3000, 1500]
    gm = [2500, 3500, 4000, 4500, 2500]
    fig, ax = plt.subplots(figsize=(8.2, 5))
    ax.plot(regions, gm, color=BLUE, lw=2.5, marker="s", ms=9, label="GM soybean", zorder=3)
    ax.plot(regions, non_gm, color=ORANGE, lw=2.5, ls="--", marker="D", ms=9, label="Non-GM soybean", zorder=3)
    ax.set_yticks(range(0, 5001, 500))
    ax.set_yticklabels([f"{v:,}".replace(",", " ") for v in range(0, 5001, 500)], fontsize=11)
    ax.yaxis.grid(True, color=GRID, zorder=0)
    ax.set_ylim(0, 5000)
    ax.set_xlabel("Region"); ax.set_ylabel("Yield (kg/ha)")
    ax.set_title("Yield of GM and non-GM soybean in five regions (illustrative)", fontsize=13)
    ax.legend(frameon=False, loc="lower center", ncol=2)
    fig.tight_layout()
    fig.savefig(out(22, "graph_1.png"), dpi=150, facecolor="white")
    plt.close(fig)


if __name__ == "__main__":
    demand_graphs(); nitrogen_table(); income_bars(); gm_line_graph()
    print("figures written to", os.path.normpath(ROOT))
