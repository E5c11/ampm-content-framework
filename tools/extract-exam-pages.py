#!/usr/bin/env python3
"""
Extract question, annexure, and memo images from a scanned exam paper PDF.

Usage:
  # Inspect a page — ruler overlay saved + band scan printed to stdout
  python tools/extract-exam-pages.py --pdf temp/nov_p1_2016.pdf --inspect 7

  # Extract images for one question group
  python tools/extract-exam-pages.py \
    --pdf temp/nov_p1_2016.pdf \
    --memo-pdf temp/nov_p1_2016_memo.pdf \
    --order 3 \
    --question-pages "7:end=480" \
    --annexure-pages "12" \
    --memo-pages "8" \
    --out temp/images/q3_1/

Page spec format:
  "3"              Full page 3 (header/footer stripped)
  "3-4"            Pages 3 and 4, each full
  "7:end=480"      Page 7, from header down to 480pt
  "7:start=487"    Page 7, from 487pt to footer
  "7:start=472:end=480"  Page 7, custom both ends

Cutting rule (for within-page crops):
  Top section  y_end  : just ABOVE the next question heading  → heading_top_pt - small margin
  Bottom section y_start: just BELOW the last mark allocation → mark_bottom_pt + small margin
  Use --inspect to find these pt values via the band scan.
"""

import argparse
import json
import os
import sys
from pathlib import Path

import fitz
from PIL import Image, ImageDraw

# DBE paper constants (pt)
HEADER_PT = 56
FOOTER_PT = 52
DPI = 150
SCALE = DPI / 72


# ── Page spec parsing ────────────────────────────────────────────────────────

def parse_page_spec(spec: str) -> list[dict]:
    """
    Parse a page spec string into a list of crop descriptors.

    Returns a list of dicts: {"page": int (0-indexed), "y_start": float|None, "y_end": float|None}
    """
    parts = spec.strip().split(":")
    page_part = parts[0]
    overrides = {}
    for part in parts[1:]:
        k, v = part.split("=")
        overrides[k.strip()] = float(v.strip())

    # Page range (e.g. "3-4") → multiple full pages
    if "-" in page_part and ":" not in spec:
        start, end = page_part.split("-")
        return [
            {"page": int(p) - 1, "y_start": None, "y_end": None}
            for p in range(int(start), int(end) + 1)
        ]

    return [{
        "page": int(page_part) - 1,
        "y_start": overrides.get("start"),
        "y_end":   overrides.get("end"),
    }]


def parse_pages(spec: str) -> list[dict]:
    """Parse a comma-separated page spec (e.g. "3-4" or "7:end=480")."""
    if not spec:
        return []
    results = []
    for part in spec.split(","):
        results.extend(parse_page_spec(part.strip()))
    return results


# ── Rendering ────────────────────────────────────────────────────────────────

def render_full_page(doc: fitz.Document, page_idx: int) -> Image.Image:
    """Render a full page as a PIL image at DPI resolution."""
    page = doc[page_idx]
    pix = page.get_pixmap(matrix=fitz.Matrix(SCALE, SCALE))
    return Image.frombytes("RGB", [pix.width, pix.height], pix.samples)


def crop_image(img: Image.Image, y_start_pt: float | None, y_end_pt: float | None) -> Image.Image:
    """
    Crop a full-page PIL image to the specified pt range.
    None values default to HEADER_PT (top) and page_bottom - FOOTER_PT (bottom).
    """
    page_height_pt = img.height / SCALE
    top_pt  = y_start_pt if y_start_pt is not None else HEADER_PT
    bot_pt  = y_end_pt   if y_end_pt   is not None else (page_height_pt - FOOTER_PT)

    top_px = int(top_pt * SCALE)
    bot_px = int(bot_pt * SCALE)
    return img.crop((0, top_px, img.width, bot_px))


# ── Inspect mode ─────────────────────────────────────────────────────────────

def inspect_page(doc: fitz.Document, page_idx: int, out_dir: str):
    """
    Save a ruler overlay image and print a pixel-density band scan to stdout.
    Use this to find the exact pt values for within-page cuts.
    """
    os.makedirs(out_dir, exist_ok=True)
    img = render_full_page(doc, page_idx)
    page_height_pt = img.height / SCALE

    # ── Band scan ────────────────────────────────────────────────────────────
    print(f"\nBand scan — page {page_idx + 1} ({img.width}x{img.height}px, {page_height_pt:.0f}pt)")
    print(f"{'pt range':<14} {'dark%':>6}  content")
    print("-" * 40)
    band_pt = 5
    for start_pt in range(0, int(page_height_pt), band_pt):
        end_pt  = min(start_pt + band_pt, page_height_pt)
        top_px  = int(start_pt * SCALE)
        bot_px  = int(end_pt   * SCALE)
        band    = img.crop((0, top_px, img.width, bot_px)).convert("L")
        pixels  = list(band.getdata())
        dark    = sum(1 for p in pixels if p < 128)
        pct     = 100 * dark // len(pixels) if pixels else 0
        bar     = "█" * min(pct, 20)
        marker  = " ◄" if pct > 0 else ""
        print(f"  {start_pt:>4}–{end_pt:<4}pt   {pct:>3}%  {bar}{marker}")

    # ── Ruler overlay ────────────────────────────────────────────────────────
    RULER_W = 65
    canvas  = Image.new("RGB", [img.width + RULER_W, img.height], (240, 240, 240))
    canvas.paste(img, (RULER_W, 0))
    draw    = ImageDraw.Draw(canvas)
    draw.line([(RULER_W - 1, 0), (RULER_W - 1, img.height)], fill=(180, 180, 180), width=1)

    for pt in range(0, int(page_height_pt) + 1, 5):
        y_px     = int(pt * SCALE)
        is_major = (pt % 40 == 0)
        tick_len = RULER_W - 4 if is_major else RULER_W // 2
        color    = (180, 0, 0) if is_major else (160, 160, 160)
        draw.line([(RULER_W - tick_len, y_px), (RULER_W - 1, y_px)], fill=color, width=1)
        if is_major:
            draw.text((2, y_px - 7), str(pt), fill=(180, 0, 0))

    ruler_path = os.path.join(out_dir, f"inspect_page{page_idx + 1}.png")
    canvas.save(ruler_path)
    print(f"\nRuler saved → {ruler_path}")


# ── Extraction ───────────────────────────────────────────────────────────────

def extract_images(
    doc: fitz.Document,
    page_specs: list[dict],
    prefix: str,
    out_dir: str,
) -> list[str]:
    """
    Render and save images for the given page specs.
    Returns the list of saved file paths.
    """
    paths = []
    for i, spec in enumerate(page_specs, start=1):
        img     = render_full_page(doc, spec["page"])
        cropped = crop_image(img, spec["y_start"], spec["y_end"])
        filename = f"{prefix}_{i}.png"
        path     = os.path.join(out_dir, filename)
        cropped.save(path)
        print(f"  {filename}: {cropped.width}x{cropped.height}px")
        paths.append(path)
    return paths


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Extract exam page images from a scanned PDF.")
    parser.add_argument("--pdf",             required=True,  help="Path to question paper PDF")
    parser.add_argument("--memo-pdf",                        help="Path to memo PDF (optional)")
    parser.add_argument("--order",           type=int,       help="Question group order number (used in output dir naming)")
    parser.add_argument("--question-pages",                  help="Page spec for question images")
    parser.add_argument("--annexure-pages",                  help="Page spec for annexure images")
    parser.add_argument("--memo-pages",                      help="Page spec for memo images (uses --memo-pdf if provided)")
    parser.add_argument("--out",             default="temp/images/", help="Output directory")
    parser.add_argument("--inspect",         type=int,       help="Inspect mode: show ruler + band scan for this page number (1-indexed)")
    args = parser.parse_args()

    doc = fitz.open(args.pdf)

    # ── Inspect mode ─────────────────────────────────────────────────────────
    if args.inspect is not None:
        inspect_page(doc, args.inspect - 1, args.out)
        return

    # ── Extract mode ─────────────────────────────────────────────────────────
    if not any([args.question_pages, args.annexure_pages, args.memo_pages]):
        print("Error: provide at least one of --question-pages, --annexure-pages, --memo-pages")
        sys.exit(1)

    os.makedirs(args.out, exist_ok=True)
    report = {"order": args.order, "pdf": args.pdf, "images": {}}

    if args.question_pages:
        specs = parse_pages(args.question_pages)
        print(f"question ({len(specs)} page(s)):")
        paths = extract_images(doc, specs, "question", args.out)
        report["images"]["question"] = paths

    if args.annexure_pages:
        specs = parse_pages(args.annexure_pages)
        print(f"annexure ({len(specs)} page(s)):")
        paths = extract_images(doc, specs, "annexure", args.out)
        report["images"]["annexure"] = paths

    if args.memo_pages:
        memo_doc = fitz.open(args.memo_pdf) if args.memo_pdf else doc
        specs    = parse_pages(args.memo_pages)
        print(f"memo ({len(specs)} page(s)):")
        paths = extract_images(memo_doc, specs, "memo", args.out)
        report["images"]["memo"] = paths

    report_path = os.path.join(args.out, "crop_report.json")
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"\ncrop_report.json → {report_path}")


if __name__ == "__main__":
    main()
