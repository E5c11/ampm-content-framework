#!/usr/bin/env bash
# usage: scripts/_gen/cat/images.sh <order> "<question pages>" "<memo pages>" [year]
# Extracts the exam reference pages for a lesson, uploads them (dev), then renders + uploads that lesson's generated figures.
set -euo pipefail
cd "$(dirname "$0")/../../.."
O=$1; QP=$2; MP=$3; Y=${4:-2025}
NN=$(printf "%02d" "$O")
D=temp/images/cat/$Y/nov_p2/q$NN
mkdir -p "$D"
python3 tools/extract-exam-pages.py --pdf "files/cat/Computer Applications Technology P2 Nov $Y Eng.pdf" --memo-pdf "files/cat/Computer Applications Technology P2 Nov $Y MG Eng.pdf" --order "$O" --question-pages "$QP" --memo-pages "$MP" --out "$D/" >/dev/null 2>&1
echo "extracted: $(ls $D | tr '\n' ' ')"
node tools/upload-exam-images.js --syllabus dbe --subject cat --year "$Y" --paper nov_p2 --order "$O" --dir "$D/" | grep -c "✓" | sed 's/^/uploaded exam images: /'
SPECS=temp/images/cat/$Y/nov_p2/specs
FIGS=$(ls $SPECS/q${NN}_figure_*.json 2>/dev/null | sed 's/.json$//' || true)
if [ -n "$FIGS" ]; then
  python3 scripts/_gen/cat/render_figure.py $SPECS temp/images/cat/$Y/nov_p2/figs "q${NN}_" >/dev/null
  FILES=$(for f in $FIGS; do echo "temp/images/cat/$Y/nov_p2/figs/$(basename $f).png"; done | paste -sd, -)
  node tools/upload-question-supplementary.js --subject cat --year "$Y" --paper nov_p2 --order "$O" --type figure --files "$FILES" | grep "✓" | sed 's/^/figure: /'
fi
