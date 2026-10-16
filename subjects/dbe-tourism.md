---
id: AMPM-CONTENT-SUBJ-DBE-TOURISM
type: profile
layer: subjects
related: [AMPM-CONTENT-CLOSED-FORM, AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-APP-VERSIONS, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE, AMPM-CONTENT-SUBJ-DBE-BUSINESS-STUDIES, AMPM-CONTENT-SUBJ-DBE-GEOGRAPHY, AMPM-CONTENT-SUBJ-DBE-ECONOMICS]
tags: [subject, tourism, dbe, profile]
---

# Subject Profile — DBE Tourism (one paper, 200 marks)

**Status (2026-10-16): 2025 Nov authored on dev (24 lessons / 96 q) and emulator-reviewed; 2024 Nov authored on dev (24 lessons / 94 q) and emulator-reviewed. Both are live in prod (2025 gated 2.4.0, pushed 2026-10-15; 2024 no gate, pushed 2026-10-16).** Built from the Nov 2025 and Nov 2024 papers + memos and the CAPS
document (`files/tourism/`). Both years share one layout, so the structure below is the subject's, not a year's quirk.

Loads `shared/closed-form-subjects.md` (`AMPM-CONTENT-CLOSED-FORM`) — the discursive→selection, figure, calculation, typed-answer and formatting rules
are **not repeated here**. This file records only what is specific to Tourism.

**Closest existing profile: Business Studies** — same scenario-led, memo-point-list marking (`✓✓` per point, "Discuss TWO…", "Accept any other
relevant response"), same South African institution/legislation vocabulary, same "Section A mixes the later topics" shell. It differs in two ways that
pull from other profiles: **calculations** (time zones, foreign exchange) behave like Geography/Economics, and **stimulus handling** (infographics, a
world map, cartoons, photographs) behaves like Geography. Read `dbe-business-studies.md` for the mechanics this file does not restate.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / `"tourism"` — expected from the `SubjectMapper.kt` fallback (`displayName.lowercase().replace(" ", "_")`). **Verify against the app source and the dev `subjects` table before any script** (`PIPE-*`; Life Sciences lost a rework to a guessed id). |
| Papers | **One paper only.** `nov_p1` is proposed for the `paper` value (`SCHEMA` `paper` e.g. `"nov_p1"`); confirm the tooling and the app's paper picker cope with a subject that has no P2 before authoring. 2025 and 2024 are on disk; `june_*` presumed if sourced. |
| `subjects` row | Not checked. Needs `sort_order`, `color`, `icon`, `category`, `is_active`, `min_app_version` — owner-gated insert, dev first (`workflows/generate/upload-agricultural-sciences.md` § 0a is the template). |
| **Curriculum document (`DESIGN-UNI-09`)** | `files/tourism/caps/CAPS FET _ TOURISM _ GR 10-12 Web_1FAC.pdf`. Grade 12 term plans from ~p. 34; assessment from Section 4. Required in-session before authoring — Tourism is content-based. |
| **Source files** | `files/tourism/nov_2025/Tourism Nov 2025 {Eng,MG Eng}.pdf` (28 + 14 pp), `files/tourism/nov_2024/Tourism Nov 2024 {Eng,MG Eng}.pdf` (25 + 17 pp). Staged in git, uncommitted. |
| Instructions page | 200 marks, 3 h, non-programmable calculator, "Show ALL calculations", **round Q3.3/3.4 (rand/forex) to TWO decimals**. |
| CAPS vs paper | CAPS Grade 12 external exam is the 200-mark written paper (the PAT is separate); take structure and weights from the paper, scope from CAPS. |

## Paper structure (identical in 2024 and 2025)

| Section | Questions | Marks | CAPS topics (memo codes) |
|---|---|---|---|
| A — Short questions | Q1 | 40 | all nine, mixed |
| B — Map work and tour planning; Foreign exchange | Q2 (37), Q3 (13) | 50 | MTP, FX |
| C — Tourist attractions; Culture and heritage; Marketing | Q4 (30), Q5 (12), Q6 (8) | 50 | TA, CH, M |
| D — Tourism sectors; Sustainable and responsible tourism | Q7 (16), Q8 (14) | 30 | TS, SR |
| E — Domestic, regional and international tourism; Communication and customer care | Q9 (20), Q10 (10) | 30 | DRI, CC |

All ten questions are compulsory (no "answer any N"), so `CLOSED-DISC-05` is unused. The memo tags every line with the CAPS topic code — **TS, MTP, TA, SR, DRI,
CH, FX, CC, M** — which are the nine curriculum units. Use the tag to cluster Section A items into the Section B–E lessons they feed (`DESIGN-UNI-10`).

**Section A (Q1, 40 marks), 2025:** 1.1 twenty A–D multiple choice ×1 · 1.2 five "give ONE word/term" chosen from a printed list · 1.3 five "choose the
correct word(s) from those in brackets" · 1.4 five-item Column A ↔ lettered Column B match (Column B items are **pictures**; 2024 matched World Heritage
Sites) · 1.5 five items answered from an infographic (term from a printed set). Maps to `CLOSED-A-01` (shared).

### Sub-question shapes and their app answer

| Shape | Examples (2025) | App answer |
|---|---|---|
| A–D recall | 1.1.x (SWIFT, UNESCO, Blue Flag, fringe benefit …) | `multiple_choice` |
| Term from a list / choose in brackets | 1.2, 1.3 | `multiple_choice` (the list or the two bracket words as options) — `CLOSED-A-01` |
| Letter ↔ picture/term | 1.4, 1.5 | `match` (≤ 5 pairs) |
| Time-zone arithmetic | 2.1.1 zones crossed, 2.1.3 arrival time, 2.1.4 live-broadcast time | `fitb` numeric (zones, hours) + time as split blanks (§ Calculations) |
| Foreign-exchange conversion | 3.3 (÷ BSR), 3.4 (× BBR), 3.1 currency code | `fitb` numeric, `standard_math`; code → selection |
| "Name TWO / Identify TWO / List the FOUR" | 2.1.5, 5.2 (four provinces), 9.1.2 | `multi_select` against the memo list (`CLOSED-DISC-02`) |
| "Explain / Discuss TWO ways / reasons" (the bulk of C–E) | 4.1.4(a)–(c), 4.2.4, 5.4, 7.1.3, 7.2.2, 8.1.2–8.1.3, 9.1.3, 9.2.3 | `multi_select`/`multiple_choice` over the memo's points (`CLOSED-DISC-01`) |
| Define a concept | 2.1.2 long-haul, 2.4.2 duty-free, 3.2.1–3.2.2, 6.2 | `multiple_choice` whose distractors are the neighbouring term's definition (`CLOSED-DISC-03`) |
| Identify from a stimulus | 4.1.1 (which mountain), 4.2.1 country/continent, 9.2.1 highest/third-highest source market | `multiple_choice` over a **fresh** stimulus (§ Stimuli) |
| Linked pairs | 2.2.1→2.2.2 (name the condition, then symptoms of it); 4.1.4(b)→(c) ("except litter control"); 5.1→5.2 (2024) | one linked lesson or one self-contained pair (`CLOSED-DISC-04`, `DESIGN-UNI-13`) |
| Customer-care / HR scenario | 7.1 dress code, 7.2 conditions of employment, 10 customer feedback | Business Studies shell: `multi_select` of memo points, distractors from the same family |
| Paragraph with a mark for format (2024 2.3.2: "in a paragraph, discuss THREE ways … (6) + (1)") | | `multi_select` of the three correct ways; the format mark is not testable — say so in the explanation |

No essay, no drawn work, no map the student must mark up. `CLOSED-ESSAY-01` and `CLOSED-FIG-01` are **unused**; the only figures are stimuli.

## Allowed presentation types

`multiple_choice`, `multi_select`, `match`, `fitb` (numeric `standard_math`; one-word `text` only per `CLOSED-KB-01`). `ordering` is available and earns its place
for **tour-planning and itinerary sequencing** (CAPS Grade 12: route → transport/accommodation → day-by-day itinerary) and for border-crossing order
(passport control → baggage → customs channel). `steps` is allowed only for a genuine multi-row time-zone or currency derivation (`scientific_math`
declared); `equation`/`fraction` are not used (exchange rates are decimals, not fractions).

## Calculations

Both are in the CAPS and both recur in every paper (≈ 25 of 200 marks, Q2.1 + Q3). `CLOSED-CALC-01` applies (fresh numbers, one unknown, final value
typed, method in the explanation). Tourism specifics:

- **Time zones.** Memo method: offset of each city from UTC → time difference → local time at departure (±) → add flight duration. The result is a
  clock time, and 2024 also asks the **date** and adds a daylight-saving note. Rules: never a single `HH:MM` blank (`SCHEMA-TYPE-04` — two numeric
  blanks around a literal `":"` metadata token, hours and minutes, `standard_math`); ask the **date** as a `multiple_choice` ("same day / next day /
  previous day"); a DST clause goes in the stem as an explicit "+1 h" statement, not an assumption. Give the offsets in the stem (a small
  city→UTC-offset table) — the exam's coloured world time-zone map is not available and a generated one is not trusted (`CLOSED-FIG-02`: a figure
  that is not clearly correct is dropped). Carry the memo's lesson that a crossing count is a number of zones, not hours.
- **Foreign exchange.** The CAPS convention is `1 unit of foreign currency = R x` and the paper prints a **BBR / BSR table**. Memo: tourist *buying*
  foreign currency at SA bank → **divide by the BSR**; selling foreign currency back → **multiply by the BBR**. The direction (which rate, divide or
  multiply) is the real skill and the main distractor source — put the wrong-rate and wrong-operation results in a preceding `multiple_choice`. Typed
  value is the bare 2-dp number (`851.06`, stored with `.`); the currency tag (`GBP`, `R`) is a `metadata` label (`KEYBOARD-02`, `CLOSED-FMT-01`). Use
  invented rates and say they are illustrative (`CLOSED-FIG-02`).
- **Budgets/costs** (CAPS Grade 11–12 tour budgets): the same one-blank final-value pattern.

## Keyboard

Tourism has no keyboard of its own. Every typed row declares one (`KEYBOARD-04`): numbers → `standard_math` (released, **no gate**); the rare
single-term answer → `text`. The `text` keyboard (verified in `core/designsystem/.../TextKeyboard.kt`) types A–Z, digits, `. , ; : ! ? ' " ( ) - / & %` and
space, so it can type the Tourism terms that matter (`GBP`, `SWIFT`, `jet lag`, `Mount Fuji`). It emits uppercase and marking lower-cases, so it is
fine here (no case-bearing answers in Tourism — contrast genotypes). Prefer selection: most Tourism "name…" answers are either one of a printed list
(→ `multiple_choice`) or accept many alternatives (→ `multi_select`). **Declaring `text` gates the exam at 2.4.0 (`VER-09`) — accepted by the owner 2026-10-15; 2.4.0 is released**, so no
prod block. Run `apply-exam-gate.js` after upload anyway.

## Stimuli and facts — the Tourism-specific hazards

1. **Real stimuli are never the practice stimulus** (`DESIGN-UNI-01`/`CLOSED-FIG-02`). The papers' infographics, cartoons, photographs and Column B pictures
   attach to the lesson only as exam reference. Fresh stimuli are generated or described in words; **photographs of real places are not recreated**.
2. **Current-affairs scenarios are an accuracy hazard.** CAPS Grade 12 explicitly tells teachers to take global events and unforeseen occurrences "from
   the media", and the papers do (2026 FIFA World Cup, Heathrow substation fire 2025, Thailand earthquakes 2025, Budapest World Athletics 2026,
   TOMSA's 1 % levy). Practice items must use **CAPS-named examples** (2010 FIFA World Cup, Olympic Games, Wimbledon, Comrades, Tour de France; civil
   war, terrorism, tsunamis, earthquakes, recession, disease) or clearly invented, labelled-illustrative scenarios. Never invent a real-sounding
   statistic, quote or news attribution. Anything dated or institutional (department names, abbreviations, levy rates, World Heritage listings) is
   checked against the memo or CAPS before it becomes a correct option.
3. **Memo accepts both of two near-identical answers** (2025 1.1.2: A *National Department of Tourism* and B *Department of Tourism* both marked
   correct). A `multiple_choice` must have exactly one correct option: use one of the two and drop the other, never both.
4. **The sustainable-tourism pillars** (economic / social / environmental) and body names (UNESCO, SAHRA, TBCSA, SATourism, FTT, ACSA, TGCSA, WESSA) are the
   confusable pairs for `CLOSED-DISC-03`; keep distractors within the same family and length.
5. **Map items (2024 Q5, the Western Cape World Heritage map; 2025 Q2 time-zone map)** cannot reuse the exam image. Teach by describing the location
   or giving the offsets in text — the Geography "maps are not available" rule applies (no question may depend on a sheet the student cannot see).

## Curriculum units (CAPS topics, Grade 12)

One unit per memo topic code. Names are CAPS's; slugs are flat per the vocabulary dump, which is always run first (`PIPE-08`).

| Memo code | Unit | Grade 12 CAPS content worth a topic node |
|---|---|---|
| TS | `tourism_sectors` | tourism industry sectors, employment conditions, fringe benefits, dress code / professionalism |
| MTP | `map_work_tour_planning` | time zones, flight times, travel documents (passport, visa, IDP), health & safety, customs/duty-free, tour plans, route planning, itineraries |
| TA | `tourist_attractions` | characteristics of a successful attraction, icons and wonders, visitor numbers/targets |
| SR | `sustainable_responsible_tourism` | three pillars, certification (Blue Flag, FTT), CSI, green-washing, resource management |
| DRI | `domestic_regional_international_tourism` | global events, unforeseen occurrences, source markets, foreign arrivals, SWIFT/payment methods |
| CH | `culture_heritage_tourism` | World Heritage Sites (UNESCO), SAHRA, SA sites |
| FX | `foreign_exchange` | GDP, multiplier effect, BBR/BSR, strong/weak rand, conversion, fluctuation |
| CC | `communication_customer_care` | customer feedback/surveys, complaints, digital tools (e.g. QR codes) |
| M | `tourism_marketing` | TOMSA/TBCSA/SATourism, trade shows (Indaba, Meetings Africa), marketing mix |

**Scope guard.** A topic absent from one paper is not out of scope; CAPS defines scope, the paper defines emphasis. Use both papers to see what recurs.

## App-side status (verified 2026-10-15, AMPM checkout `~/StudioProjects/AMPM`, `version.name=2.4.1`)

- **Presentations:** all eight — `multiple_choice`, `multi_select`, `fitb`, `ordering`, `fraction`, `match`, `equation`, `steps` (`PresentationTypes.kt`;
  `PresentationComponent.kt` renders each). Tourism uses the first five.
- **Keyboards:** all five declarable values resolve — `standard_math`, `scientific_math`, `physics`, `chemistry`, `text` (`KeyboardResolver.fromDeclared`);
  the resolver is total (undeclared → `Text`, or `ScientificMath` for `steps`/`equation`; `none` and unknown values are skipped). Tourism uses two.
- No app change is needed to author Tourism.

## Completed papers ledger

| Paper | Lessons / questions | Status |
|---|---|---|
| 2025 Nov (`nov_p1`) | 24 lessons / 96 q (200 marks): L1–7 Section A by topic code, L8–13 Q2–Q3, L14–17 Q4–Q6, L18–21 Q7–Q8, L22–24 Q9–Q10. 36 mc / 29 ms / 20 match / 5 ordering / 6 fitb | on dev 2026-10-15, gated 2.4.0 (`text` row in L12), validator + `audit-answer-cues` clean, MC index-0 2.8%. Emulator review on 2.4.1-dev01: no defects; 6 typed answers (8 attempts incl. `\|` alternatives) all PASS. Lessons 15, 17–22, 24 screenshots not individually viewed. **Live in prod** (pushed 2026-10-15, prod gate 2.4.0). Subject-expert check owed. |
| 2024 Nov (`nov_p1`) | 24 lessons / 94 q (200 marks): L1–6 Section A by topic code (L6 = 1.5 hotel staff), L7–12 Q2–Q3, L13–16 Q4–Q6, L17–20 Q7–Q8, L21–24 Q9–Q10. 39 mc / 27 ms / 17 match / 5 ordering / 6 fitb | on dev 2026-10-16, **no gate** (all 6 typed rows `standard_math`, derived 2.0.0), validator (`--curriculum` + `--ai-exp`) + `audit-answer-cues` clean, MC index-0 2.6%, correct-longest 10%. L7 has 5 questions (clock time + date pair). 57 page images, all resolve. Emulator review 2026-10-16 on 2.4.0-dev01: 2 render fixes (U+00A0 in `R40 000` L11 Q2–3 and `80 000` L14 Q1 — numbers wrapped mid-group), 0 flags; Phase 5 11/11 (6 typed rows, every `\|` alternative, incl. the two-blank L7 clock time). **Live in prod 2026-10-16** (pushed unpublished, prod = dev field by field incl. 89 explanation / 58 tag / 94 skill rows, 57 prod image URLs 200, no gate, then published). Subject-expert check owed. |

Authoring lives in `scripts/_gen/tourism/` (`lessons-{a,b,c}.js` data, `lib.js` helpers, `gen.js` emits the `scripts/add-tourism-<YEAR>-nov-p1-lNN.js` files, `taxonomy.js` creates vocabulary). The `YEAR` env var selects the paper: 2025 data sits beside `lib.js`, 2024 in `2024/` (`YEAR=2024 node scripts/_gen/tourism/gen.js`). Lesson objects carry `qspec`/`mspec` (the `extract-exam-pages.py` page specs) — 2024 used full pages per lesson, like 2025, with no `supplementary_materials`.

**Lessons learned (2025):** `subjects` row `tourism` already existed on dev (seeded, `services_lessons`, sort 179). Global ids clashed with other subjects (`exchange_rates`, `currency_conversion`, `employment_contract`) — renamed `tourism_exchange_rates`, `rand_exchange_rates`, `forex_conversion`, `tourism_employment_contract`; `taxonomy.js` reports clashes. Practice time-zone/forex items use invented, labelled-illustrative data; the exam's world map is only lesson reference. The validator's `DESIGN-UNI-16` length rule fired on ~25 MC/multi-select sets — write distractors the same length up front. Text-keyboard review needs `text_key_<LETTER>`/`text_key_done` and two-blank answers need per-blank typing (a Tourism copy of `review-capture-answers.js` was used from the scratchpad, not committed to AMPM). **2024 review:** spaced thousands in stems and match chips (`R40 000`, `80 000`) wrap mid-number — author them with U+00A0 between groups.

## Still open

- Subject-expert check of both papers (both already live in prod).
- Decide fresh-stimulus sourcing for the Column B picture matches (1.4) — text-described items, or generated simple icons.
- Mark the time-zone offset table as the standard stem aid so lessons stay consistent.
