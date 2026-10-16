#!/bin/zsh
# Exam reference crops for Agricultural Sciences P2 Nov 2024 (one folder per lesson order). Page specs from fitz label positions.
cd "$(dirname "$0")/../../.."
P="files/agricultural_sciences/nov_2024/Agricultural Sciences P2 Nov 2024 Eng.pdf"
M="files/agricultural_sciences/nov_2024/Agricultural Sciences P2 Nov 2024 MG Eng.pdf"
B=temp/images/agricultural_sciences/2024/nov_p2
run() { # order qspec mspec
  rm -rf $B/q$1; mkdir -p $B/q$1
  .venv/bin/python tools/extract-exam-pages.py --pdf "$P" --memo-pdf "$M" --order $1 --question-pages "$2" --memo-pages "$3" --out $B/q$1/ >/dev/null 2>&1 || echo FAIL $1
}
M11="2:start=136:end=286"; M12="2:start=290:end=398"; M13="2:start=404:end=512"; M14="2:start=518:end=626"   # Section A memo blocks
T12="5:start=81:end=472"
run 1 "3:start=118:end=358,$T12" "$M11,$M12"
run 2 "3:start=460:end=677,$T12,6:start=82:end=178" "$M11,$M12,$M14"
run 3 "3:start=677:end=778,4:start=74:end=365,5:start=472:end=527,5:start=568:end=596" "$M11,$M13"
run 4 "4:start=365:end=453,$T12,5:start=472:end=568,6:start=82:end=137,6:start=178:end=206" "$M11,$M12,$M13,$M14"
run 5 "4:start=453:end=778,$T12,6:start=82:end=137,6:start=206:end=247" "$M11,$M12,$M14"
run 6 "5:start=472:end=527,5:start=596:end=730,6:start=82:end=137,6:start=247:end=345" "$M13,$M14"
run 7 "7:start=142:end=790" "3:start=131:end=778"
run 8 "8:start=81:end=452" "4:start=76:end=464"
run 9 "8:start=452:end=790" "4:start=464:end=778"
run 10 "9:start=71:end=622" "5:start=76:end=565"
run 11 "9:start=622:end=790" "5:start=565:end=778,6:start=76:end=461"
run 12 "10:start=127:end=523" "6:start=486:end=778,7:start=64:end=158"
run 13 "10:start=523:end=790,11:start=71:end=413" "7:start=158:end=659"
run 14 "11:start=413:end=790,12:start=459:end=569" "7:start=659:end=778,8:start=74:end=240,8:start=423:end=499"
run 15 "12:start=71:end=459" "8:start=240:end=423"
run 16 "12:start=569:end=790" "8:start=499:end=778,9:start=76:end=187"
run 17 "13:start=136:end=362" "9:start=187:end=422"
run 18 "13:start=362:end=720,14:start=82:end=249" "9:start=422:end=679"
run 19 "14:start=249:end=592" "9:start=679:end=778,10:start=65:end=202"
run 20 "14:start=590:end=790" "10:start=202:end=491"
run 21 "15:start=80:end=622" "10:start=491:end=778"
run 22 "16:start=80:end=742" "11:start=76:end=725"
for d in $B/q*(n); do echo "$d $(ls $d | tr '\n' ' ')"; done
