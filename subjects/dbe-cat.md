---
id: AMPM-CONTENT-SUBJ-DBE-CAT
type: profile
layer: subjects
related: [AMPM-CONTENT-CLOSED-FORM, AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-KEYBOARD-INPUT, AMPM-CONTENT-APP-VERSIONS, AMPM-CONTENT-AI-EXP, AMPM-CONTENT-PIPELINE, AMPM-CONTENT-SUBJECT-CATALOGUE, AMPM-CONTENT-SUBJ-DBE-TOURISM, AMPM-CONTENT-SUBJ-DBE-BUSINESS-STUDIES, AMPM-CONTENT-SUBJ-DBE-LIFE-SCIENCES]
tags: [subject, cat, computer-applications-technology, dbe, profile, theory-paper]
---

# Subject Profile — DBE Computer Applications Technology (Paper 2 only, 150 marks)

**Status (2026-10-17): profiled from Nov 2024 P2 + memo and the CAPS document (`files/cat/`); nothing authored.** **Paper 1 is deliberately out of scope** (owner,
2026-10-17): it is the 3-hour *practical* paper sat on a computer (word processing, spreadsheet, database, HTML on supplied data files) and cannot be taught or
marked in the app; the little theory it carries is covered by Paper 2. The exam is therefore authored as **Paper 2 only**, like Physical Sciences' Chemistry (`nov_p2`).
**The real exam is Paper 2 (Theory), 2026-11-27 09:00, 180 min** (backend `V92`, DBE and IEB timetables; Paper 1 was 2026-10-16) — 41 days after profiling, so the aim is to
get reviewed content live before then.

Loads `shared/closed-form-subjects.md` (`AMPM-CONTENT-CLOSED-FORM`) — discursive→selection, Section A formats (incl. **modified true/false**, added with this profile),
figures (incl. **`CLOSED-FIG-04` screenshot-type stimuli**, added with this profile), typed answers and formatting are **not repeated here**. This file records only
what is specific to CAT. Procedure: `workflows/generate/upload-cat.md`, which loads `workflows/generate/closed-form-upload-common.md`.

**Closest existing profile: Tourism** (and Business Studies): a memo-marked, "one mark per fact" paper that is mostly "state/give/explain TWO …" against a long
list of accepted answers, a Section A of MC / matching / true-false, and a Section C of integrated scenarios. It differs in four ways that matter:

1. **Subject matter is technology**, so facts age fast and brand names are forbidden in answers (§ Hazards).
2. **Several items depend on a screenshot** of software or data (§ Stimuli) — Tourism's stimuli were photographs, maps and infographics.
3. **Section A includes modified true/false** (correct the underlined word) — the only Tourism-family paper that does.
4. **Practical knowledge in a theory paper**: spreadsheet functions, HTML tags and word-processing features are asked as *knowledge* ("which function…", "which tag…"),
   never as a task to perform.

## Identity

| Field | Value |
|---|---|
| `syllabus` / `subject` | `"dbe"` / **`"cat"`** — the catalogue seed (`ampm-backend` `V85`: `('cat','CAT','Computer Applications Technology','CAT','technology_lessons',164,…,'#7048E8')`). `SubjectMapper.kt`'s fallback would give `computer_applications_technology`; **the seeded `cat` wins**. Verify against the dev `subjects` row before any script (Phase 0a of the common workflow). |
| Papers | **`nov_p2` only** (Theory). `june_p2` presumed if sourced. Confirm the validator, template, `push-paper-to-prod.js` and the app's paper picker cope with a subject whose only authored paper is P2 (same check Tourism made for `nov_p1`). |
| `subjects` row | **Dev** (verified 2026-10-17): seeded, `is_active` true, `is_published` true, `hosted` false, colour `#7048E8`, category `technology_lessons`. `hosted` flips to true by itself on the first published lesson (`V95` triggers are present on dev, `CATALOGUE-01`) — **confirm after the first upload and flip by hand with an `updated_at` bump if it did not** (common workflow Phase 0a). **Prod** (verified 2026-10-17): Flyway V84, **no `hosted` column and no `cat` row** — the row is an owner-approved step at push time, and `hosted` comes with the `V85`–`V95` backend deploy (`V95` sweeps subjects that already have published content). |
| **Curriculum document (`DESIGN-UNI-09`)** | `files/cat/CAPS FET _ COMPUTER APPLICATIONS TECHNOLOGY _ GR 10-12 _ Web_6AC6.pdf`. Grade 12 term plans pp. 39–46; **assessment § 4.4 pp. 51–52 gives the Paper 2 structure**. Required in-session before authoring. |
| **Source files** | `files/cat/Computer Applications Technology P2 Nov 2024 {Eng,MG Eng}.pdf` (17 + 21 pp). The P1 files in the same folder are not used. **Only one year is on disk**: frequency evidence is thin — add other years' P2 as they are sourced and extend § Paper structure. |
| Instructions page | 150 marks, 3 h. "Generally one mark per fact"; answer ONLY what is asked (extra answers unmarked); "Do NOT use brand names unless specifically required"; vague comparatives ("cheaper", "faster") are **not accepted**. |
| CAPS vs paper | CAPS § 4.4 says content and skills of **Grades 10–12** are assessed (Grade 10–11 content such as LAN/WLAN, AUP, intranet, network adapter, RFID, biometrics appears in the 2024 paper); a list of **emerging technologies is issued to schools each year** — **not publicly available (owner, 2026-10-17), so it is not a source**: "new technology" items cover only technologies the CAPS names or the paper evidences (4IR, VR, autonomous vehicles, RFID, NFC, QR codes, biometrics, cloud/grid computing, geotagging), taught at the memo's level of detail. |

## Paper structure (Nov 2024, matches CAPS § 4.4 apart from numbering)

| Section | Question | Marks | CAPS topic |
|---|---|---|---|
| A — Short questions (25) | Q1 multiple choice (10) · Q2 matching, 10 descriptions against a 20-item Column B (10) · Q3 modified true/false (5) | 25 | all topics, mixed |
| B (75) | Q4 Systems Technologies | 25 | Systems Technologies |
| | Q5 Internet and Network Technologies | 15 | Internet + Network |
| | Q6 Information Management | 10 | Information Management |
| | Q7 Social Implications | 10 | Social Implications |
| | Q8 Solution Development (knowledge behind the practical skills) | 15 | Solution Development |
| C — Integrated scenarios (50) | Q9 (school e-magazine) · Q10 (school triathlon), 25 marks each | 50 | all topics, mixed |

All ten questions are compulsory (no "answer any N"): `CLOSED-DISC-05` unused. CAPS describes Section C as **one** 50-mark scenario; 2024 split it into two 25-mark
scenarios — author each as the paper has it, and do not assume one scenario per paper. Nov 2024 is the only paper seen: **a 2025 paper may re-number Section A
(CAPS's own table numbers Systems Technologies as Q3)**; the lesson names follow the real paper's numbering.

CAPS topic weights (Grades 10–12, whole subject): Solution Development 60 %, Systems Technologies 13 %, Information Management 12 %, Network 5 %, Internet 5 %,
Social Implications 5 %. **Paper 2 weights differ** (Systems ≈ 25, Internet+Network ≈ 15, Info Mgmt ≈ 10, Social ≈ 10, Solution Dev ≈ 15 of Section B, plus Section A and the
scenarios mixing everything) — use the paper's, not the subject's.

### Section A topic clusters (author's assignment — the memo does not tag items)

Cluster Section A items into the lesson of the Section B topic they feed (`DESIGN-UNI-10`, `CLOSED-A-01`).

| Topic | Q1 | Q2 | Q3 |
|---|---|---|---|
| Systems Technologies | 1.1 touchpad, 1.3 power user, 1.5 compression, 1.10 inkjet | 2.1 convergence, 2.5 GB, 2.7 plug-and-play, 2.10 drivers | 3.1 CPU, 3.2 braille keyboard, 3.3 secondary memory |
| Internet / Network | 1.4 caching, 1.7 network purpose | 2.6 geotagging / location sharing | — |
| Information Management | 1.6 citing sources | 2.4 objectivity | 3.5 research question |
| Social Implications | 1.2 digital divide | 2.8 digital footprint | 3.4 virtual reality |
| Solution Development | 1.8 browser/HTML, 1.9 drop cap | 2.2 watermark, 2.3 default value, 2.9 #Value! | — |

### Sub-question shapes and their app answer

| Shape | Examples (2024) | App answer |
|---|---|---|
| A–D recall | Q1.1–1.10 | `multiple_choice` (`CLOSED-A-01`) |
| Description ↔ term (Q2, 10 items) | 2.1–2.10 | Per topic: a `match` of ≤ 4 same-topic pairs (e.g. convergence / GB / plug-and-play / drivers), or `multiple_choice` with Column B's **other** terms as distractors — the paper's own confusable pairs: `#Value!`↔`#Name!`, watermark↔WordArt, GB↔GHz, geotagging↔location sharing, drivers↔utility (`CLOSED-DISC-03`) |
| Modified true/false | 3.1–3.5 | `multiple_choice`, four options: `True as written` + three replacements (`CLOSED-A-01`) |
| "State / Give / Name / Identify TWO (or N)" — the bulk | 4.1, 4.4–4.6, 4.8, 4.9.2, 5.4, 5.6, 5.7, 6.1, 6.3, 7.1.2, 7.4.2, 9.1, 9.2.3, 9.3.1, 9.3.3, 9.5, 9.6.1, 9.7.2, 10.1.2, 10.4.1, 10.4.2, 10.5.2, 10.7.2 | `multi_select` against the memo list (`CLOSED-DISC-02`, with its open-ended-memo audit) |
| "Give ONE …" with a long list | 4.2 (device), 4.7.2, 4.9.1, 5.1, 5.3, 6.2, 6.5.2, 7.3.2, 9.3.2, 9.4.3, 10.2.1, 10.3.2 | `multiple_choice`, or `multi_select` if the learning is "which of these qualify"; a memo that accepts a brand example (10.3.2 platforms) keeps brands only because the memo lists them |
| Explain / Describe / Motivate / Differentiate | 4.2, 4.3, 4.7.1, 4.10, 4.11, 5.2, 5.5, 5.8.2, 6.4, 7.1.1, 7.3.1, 8.2.2, 8.3.2, 8.4, 8.5.1, 9.2.2, 9.7.1, 10.1.1, 10.2.2, 10.6, 10.7.1 | `multiple_choice` whose distractors are the neighbouring concept's explanation (`CLOSED-DISC-01`/`03`); two-fact explanations may be a `multi_select` of the two facts |
| One canonical term | 7.2 social engineering, 8.1 Styles, 8.3.1 multilevel list, 9.2.1 AUP, 9.4.1 megapixel, 9.6.2 text wrapping, 9.6.3 `href`, 10.3.1 crowdfunding | `multiple_choice`, **or** a `text` `fitb` (§ Keyboard) |
| Read a screenshot / dataset | 4.11 (utility), 5.8 (e-mail), 6.6 (report), 8.3 (list), 8.6 (formula), 10.5 (network), 10.8 (spreadsheet) | `multiple_choice`/`multi_select` over a **regenerated** figure, or words only (`CLOSED-FIG-04`) |
| Which function(s) / tag(s) | 8.6 (LEFT/MID + LEN + FIND), 10.8.2 (name + random integers), 8.4 (`<th>`/`<td>`) | `multi_select` (the combination) or `multiple_choice`; formulas live in options, never typed |
| Sequence | none in 2024; CAPS "starting the computer", mail merge, NFC payment, safe-disposal | `ordering` only where CAPS content is a real sequence (`DESIGN-UNI-15`) |

No essay, no drawn work, no calculation. `CLOSED-ESSAY-01`, `CLOSED-FIG-01` and `CLOSED-CALC-01` are **unused**. (CAPS names data-transmission speed in kbps/Mbps
and storage capacity; if a later paper evidences an arithmetic item, `CLOSED-CALC-01` applies with `standard_math` and the unit in the label.)

## Allowed presentation types

`multiple_choice`, `multi_select`, `match` (≤ 4 pairs, `MATCH-01`), `ordering` (real sequences only), `fitb` (`text` for one canonical term, § Keyboard). `steps`, `equation`
and `fraction` are not used. The app-side check is the Tourism one: all eight presentations and all five keyboard values resolve on 2.4.0+, so no app change is needed.

## Keyboard

Every typed row declares `keyboard_type: 'text'` (`KEYBOARD-04`); **2.4.0 is the baseline, so `text` is simply used where it is the better question** (`VER-11`,
`CLOSED-KB-01`) — the derived gate is written by the tooling. What `TextKeyboard.kt` actually types (re-read 2026-10-17): `A–Z` (keys emit upper case, marking
lower-cases), `0–9`, `. , ; : ! ? ' " ( )`, `- / & %` and space. **It cannot type `= < > # @ +`.** In CAT that rules out, as *typed* answers: error values
(`#Value!`, `#Name!`), formulas (`=LEFT(A2;…)`), HTML tags with angle brackets (`<a>`, `<th>`), e-mail addresses and anything with `+`. Those stay selection. HTML
attribute and tag **names without brackets** (`href`, `th`) are typeable — the stem says "give the attribute name only".

Candidates that justify a typed row (single canonical term; list every memo form with `|`; UK spelling; no case reliance): *Styles* (`styles|style`), *Social
engineering*, *Multilevel list* (`multilevel list|multi-level list`), *AUP* (`aup`), *Megapixel*, *Text wrapping*, *Crowdfunding*, `href`. Keep to **one** typed row per
lesson at most unless the lesson is about terminology: exact-string marking gives no synonym credit, so every typed row is a bet that the student writes the textbook form.
"Any 1 of N" and slash answers (`Click-jacking/Pharming`, `WLAN/LAN/WAN`, `Bookmarks/Favourites/Caching`) are selection, never typed.

## Stimuli and facts — the CAT-specific hazards

1. **Real screenshots are never the practice stimulus** (`CLOSED-FIG-04`). The 2024 screenshots (Optimise-drive dialog, e-mail header, database report, numbered list,
   spreadsheet fragments, track layout) attach to the lesson only as exam reference. Data-shaped ones are regenerated as plain table figures with fresh values; dialogs
   are described by function in words. A figure that is not clearly right on inspection is dropped.
2. **Brand names.** The paper forbids them in answers unless the question requires one. Options and correct answers use the *category* ("word processing software",
   "web browser", "cloud storage service"), never a product. Brands appear only where the memo itself lists them (10.3.2: Kickstarter, GoFundMe …; 9.7.2 PayPal) — and then as
   options for that exact question. CAPS also names dated products (MySpace, Second Life, Encarta): teach the **concept**, never the product.
3. **Technology facts age.** Phrase facts at the level CAPS and the memo state them (NFC = contactless tap-to-pay; RFID = radio waves; 4IR = integration of technologies across
   the physical, digital and biological worlds). Do not invent "latest" specifications, version numbers, prices, speeds or statistics. The official emerging-technologies list is not
   publicly available, so emerging-technology items stay within what the CAPS names or a paper evidences (§ Identity); never guess at what a future list contains.
4. **Open-ended memos make distractor validity the main risk.** "Accept any valid answer" is the norm (4.8, 7.4.2, 9.3.2, 10.3.2). `CLOSED-DISC-02`'s open-ended audit is mandatory
   here: e.g. for "energy saving" a distractor like "use an SSD" is **correct** per the memo (7.3.2 (5)), "increase screen brightness" is plainly wrong. Check every distractor against
   the full memo list, then against "would a marker accept it?".
5. **Memo accepts several answers to a single-answer item** (1.4: A/B/C — bookmarks, favourites and caching are all marked; 1.7: A/C; 2.6: T/G; 7.4.1: click-jacking/pharming;
   10.5.1: WLAN/LAN/WAN). A `multiple_choice` must have exactly one correct option: use one and drop the others from the option set, or re-word the stem so only one is right
   (`1.4` as "which feature stores copies of pages for faster reloading" is *caching* alone). Where the ambiguity came from an unclear picture (10.5.1), the regenerated figure must be unambiguous.
6. **Software-specific vocabulary differs between products and versions** (ribbon names, "Optimize" vs "Defragment", the function-argument separator `;` vs `,` by regional
   setting). Use the memo's feature names; write formulas in options with `;` argument separators (South African regional setting, matching the Maths `;` coordinate convention) —
   *recommended, unverified against a DBE practical memo; confirm with the owner before the first function item*. Never write a click path.
7. **The paper tests practical knowledge, the app tests recognition.** Never ask the student to "type the formula" or "create the table": ask which function combines, which
   feature produced the result, why a soft line break kept the date in the list item (8.3.2). Lessons state this once and move on.
8. **Scenario stems (Q9/Q10) must not be reused.** The school e-magazine and triathlon are exam reference only; practice lessons use fresh, clearly invented scenarios (a school
   fund-raising fair, a community radio station, a sports-day results desk …) and never an invented organisation presented as real.
9. **Two-mark and three-mark items test several facts at once.** "Explain X" (2) is two facts; as `multiple_choice` test one fact per question and split, or as `multi_select` of the two
   facts — do not collapse two facts into one option (`DESIGN-UNI-02`).

## Curriculum units (CAPS topics)

Names are CAPS's; slugs are flat per the vocabulary dump, which is always run first (`PIPE-08`). Check each for a clash with another subject (`information_management`,
`social_implications` could plausibly exist); prefix with `cat_` when a clash has a different meaning.

| Unit | CAPS Grade 10–12 content worth a topic node (Grade 12 shown; the paper draws on all three grades) |
|---|---|
| `systems_technologies` | user types (personal/SOHO/mobile/power), convergence, data→information→knowledge, input/output/storage/processing devices, ergonomics and accessibility, wireless vs wired, printers, scanners/cameras/OCR/resolution, CPU/RAM/storage specs, buying decisions, biometrics/UPS/security hardware; system software: OS role, single/multi-user, multitasking, file attributes (read-only/hidden) and metadata, utilities (defragmenter, backup, compression), drivers, plug-and-play, performance factors, flawed software, patches/updates, application and web-based software |
| `network_technologies` | LAN/WLAN/WAN, AUP, intranet, network adapter/access point/router, bandwidth, congestion, cloud and grid computing, VoIP/FTP/file sharing, network security, Internet connection choices (ADSL, wireless, CAP, bundle) |
| `internet_technologies` | web browser features (bookmarks, caching, history, plug-ins, pop-up blocker, tabs), e-mail (priority, flag, subject), video conferencing, geotagging/GPS, RSS/blogs/wikis/podcasts, NFC/online payments, QR codes, crowdfunding, 4IR and emerging technologies |
| `information_management` | data vs information, research question, questionnaires/interviews, sources and referencing (citation, caption, bibliography), objectivity, currency of sources, databases vs spreadsheets for research, presenting results, electronic forms |
| `social_implications` | digital divide, digital footprint, viruses/malware and symptoms, social engineering, phishing/pharming/click-jacking, green computing, ergonomics and health, VR/autonomous vehicles, copyright/plagiarism, privacy, tele-working, information overload |
| `solution_development` | word processing (styles, tab stops and leader lines, multilevel lists, line breaks, drop cap, watermark, text wrapping, mail merge, tracking changes), spreadsheet (error values, text/lookup/logical functions, conditional formatting, import/export), database (data types, OLE object, default value, required field, reports, queries), HTML (`<a href>`, tables `<th>`/`<td>`) |

**Scope guard.** A topic absent from the one paper on disk is not out of scope; CAPS defines scope, the paper defines emphasis. Solution Development is 60 % of the *subject* but 15 of
150 marks of *this paper* — keep the lesson weight on the paper.

## Proposed lesson plan (Nov 2024 P2, ≈ 21 lessons / ≈ 80 questions)

One lesson per real sub-theme, Section A clustered by topic into the lesson it feeds; adjust when the analysis (Phase 1) says otherwise.

| Lessons | Source | Content |
|---|---|---|
| L1–L5 | Q1–Q3 clustered | Systems / Internet+Network / Information Management / Social / Solution Development Section A clusters |
| L6–L8 | Q4 | 4.1–4.6 hardware and peripherals · 4.7–4.8 operating system and GUI · 4.9–4.11 flawed software, file attributes, utilities |
| L9–L10 | Q5 | 5.1–5.4 network media, access point, security, intranet · 5.5–5.8 4IR, browsing, speed, e-mail |
| L11 | Q6 | information management, referencing, regenerated report |
| L12–L13 | Q7 | 7.1–7.2 viruses and social engineering · 7.3–7.4 green computing and safe downloading |
| L14–L15 | Q8 | 8.1–8.3 word processing (+ regenerated list figure) · 8.4–8.6 HTML, database data types, text functions (+ regenerated cell figure) |
| L16–L18 | Q9 | 9.1–9.3 e-magazine, network policy, video conferencing/interviews · 9.4–9.5 scanning, OCR, cloud · 9.6–9.7 software, hyperlinks, payments |
| L19–L21 | Q10 | 10.1–10.3 forms, QR, crowdfunding · 10.4–10.6 cameras, RFID/network (+ figure), autonomous car · 10.7–10.8 ergonomics, spreadsheet analysis (+ figure) |

## Completed papers ledger

| Paper | Lessons / questions | Status |
|---|---|---|
| — | — | Nothing authored. Run the **pilot lesson** first (`upload-cat.md`): one Section A cluster lesson (Systems, with a 4-pair `match` and a modified true/false) and one `text` `fitb` question, through the validator and an emulator look. |

## Still open

- **Owner**: the argument-separator convention for formulas (hazard 6), and whether 2025 / earlier P2 papers can be sourced (only 2024 is on disk).
- **Tooling**: confirm P2-only subjects work end-to-end (picker, push partial-exam check); the stimulus renderer for table figures (Accounting's `render_statement.py` is statement-shaped — record the choice before the pilot, `CLOSED-FIG-02`/`04`).
- **Reconcile** the older subject upload workflows with `closed-form-upload-common.md` when next edited (extracted, not yet repointed).
