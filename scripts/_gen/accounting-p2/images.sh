#!/usr/bin/env bash
# usage: scripts/_gen/accounting-p2/images.sh <order> "<question pages>" "<memo pages>"
# Extracts the exam reference pages for a lesson, uploads them (dev), then renders + uploads that lesson's generated figures.
set -euo pipefail
cd "$(dirname "$0")/../../.."
O=$1; QP=$2; MP=$3
NN=$(printf "%02d" "$O")
D=temp/images/accounting/2025/nov_p2/q$NN
mkdir -p "$D"
python3 tools/extract-exam-pages.py --pdf "files/accounting/nov_2025/Accounting P2 Nov 2025 Eng.pdf" --memo-pdf "files/accounting/nov_2025/Accounting P2 Nov 2025 MG Eng.pdf" --order "$O" --question-pages "$QP" --memo-pages "$MP" --out "$D/" >/dev/null 2>&1
echo "extracted: $(ls $D | tr '\n' ' ')"
node tools/upload-exam-images.js --syllabus dbe --subject accounting --year 2025 --paper nov_p2 --order "$O" --dir "$D/" | grep -c "✓" | sed 's/^/uploaded exam images: /'
FIGS=$(ls temp/images/accounting/2025/nov_p2/specs/q${NN}_table_*.json 2>/dev/null | sed 's/.json$//' || true)
if [ -n "$FIGS" ]; then
  python3 scripts/_gen/accounting-p2/render_statement.py temp/images/accounting/2025/nov_p2/specs temp/images/accounting/2025/nov_p2/figs >/dev/null
  FILES=$(for f in $FIGS; do echo "temp/images/accounting/2025/nov_p2/figs/$(basename $f).png"; done | paste -sd, -)
  node tools/upload-question-supplementary.js --subject accounting --year 2025 --paper nov_p2 --order "$O" --type statement --files "$FILES" | grep "✓" | sed 's/^/figure: /'
fi
