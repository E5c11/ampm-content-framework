---
id: AMPM-CONTENT-KEYBOARD-INPUT
type: reference
layer: core
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-APP-VERSIONS, AMPM-CONTENT-PRES-FITB, AMPM-CONTENT-PRES-STEPS, AMPM-CONTENT-PRES-EQUATION]
tags: [content, keyboard, input, steps, fitb, equation, physics, chemistry, text, keyboard-type]
provenance: created 2026-09-10 after a physics `steps` question shipped with blanks the in-app keyboard
  could not produce (see `subjects/dbe-physics.md`'s "steps" correction note). Rewritten 2026-10-04 around the
  per-question `keyboard_type` field (Linear BLA-20; keyboards BLA-21 Physics/Chemistry/Maths-completeness,
  BLA-58 Text) and the exam version gate (`core/app-feature-versions.md`).
---

# Keyboard Input — What A Student Can Actually Type

## Purpose

`core/mathtext.md` governs how question/metadata text **renders** (fractions, roots). This doc
governs the opposite direction: what characters a student can **type** into a blank (`fitb`,
`steps`, `equation`, `fraction`), sourced from the app's custom keyboard components — not assumed.
**Any expected typed-answer value must be composable entirely from the keyboard that question
resolves to.** An answer needing a character that keyboard lacks makes the question unanswerable,
and no render-only screenshot review will ever catch it.

The app never falls back to the system IME for `steps`/`equation` blanks, and for `fitb`/`fraction`
only when no custom keyboard applies (see § Routing). The custom Compose keyboards emit exactly the
key labels in their source. If a label isn't listed below, it cannot be typed, full stop.

## Source of truth

If this doc and the app ever disagree, **the app wins** — re-verify, then fix this doc and
`tools/lib/feature-versions.js` (the validator's copy of every table below) together:

- `AMPM/feature/watch/.../questions/ui/KeyboardResolver.kt` — declared `keyboard_type` + subject × presentation → keyboard.
- `AMPM/core/designsystem/.../components/SubjectKeyboard.kt` — `StandardMathKeyboard`.
- `AMPM/core/designsystem/.../components/MathsKeyboard.kt` — `ScientificMathKeyboard`.
- `AMPM/core/designsystem/.../components/EnglishKeyboard.kt` — `EnglishKeyboard`.
- `AMPM/feature/watch/.../questions/utils/QuestionsValidator.kt` — how a typed value is compared with the stored `answer`.

## Declaring a keyboard — `keyboard_type` (per question)

Each question may carry `keyboard_type`, stored in `questions.keyboard_type` (nullable; backend V80,
`ampm-contracts` 0.39.0). It exists because **subject is the wrong key**: `physics` is the subject id
for **Physical Sciences** — Paper 1 is Physics, Paper 2 is Chemistry — so one subject needs
different keyboards for different papers, and future subjects can hit the same problem.

**`null` / omitted** = "infer from subject and presentation" (the table in § Routing). This is
the state of every question published before this field existed, and it must keep working.

Closed value set (owned by `tools/lib/feature-versions.js` `DECLARABLE_KEYBOARDS`; the DB has no
CHECK on purpose, so adding a keyboard needs no migration):

| `keyboard_type` | Status | What it is |
|---|---|---|
| `none` | **released** | No custom keyboard. |
| `standard_math` | **released** | Numeric pad (`StandardMath`). |
| `scientific_math` | **released** | Two-tab symbolic keyboard (`ScientificMath`). |
| `physics` | **built, dev-only until the next release** (initiative 4d) | The Physics variant of `ScientificKeyboard`. Numbers = Maths. Symbols: `Δ θ µ ε Ω / ° ± · × ÷ / < > √ α β / x₂ xⁿ λ ρ σ`. ABC = Maths (a–z, one-shot shift, `sin cos tan log`). `x₂` / `xⁿ` open a **flat** `_{…}` / `^{…}` group, left with the exit arrow; the output is MathText markup, so author answers as `F_{net}`, `10^{-19}`, `kg·m·s^{-1}`. `µ` is U+00B5 (micro sign), **not** Greek mu U+03BC; `·` is U+00B7. Reached **only** by declaring it. |
| `chemistry` | **built, dev-only until the next release** (initiative 4e) | The Chemistry variant of `ScientificKeyboard`. Numbers and ABC = Maths (`+` `-` are the charge keys; one-shot shift gives `Co` vs `CO`). Middle tab `Formula`: `x₂ xⁿ → ⇌ Δ / (aq) (s) (l) (g) ℓ / [ ] · ° ,`. Author answers as stored markup: `H_{2}O`, `Fe^{3+}`, `SO_{4}^{2-}`, `NaCl(aq)` (**no spaces** — there is no space key). `ℓ` is U+2113 (the memo's `HCℓ`). Set `case_sensitive: true` on formula answers. Reached **only** by declaring it. On a released build a plain `fitb` box shows the markup raw (`H_{2}O`); from the next release it renders it. |
| `text` | **planned** (BLA-58) | Free-text QWERTY with a second screen for punctuation, digits and (Afrikaans only) accented letters. |

Released clients honour only the first three; any other value (or one added later) makes them fall
back to subject inference. **Planned values are valid to author and store now** — the validator accepts
them and models their key sets (the `text`, `physics`, `chemistry` and extended `scientific_math` inventories in
`tools/lib/feature-versions.js`; `KEYBOARD-01` rejects an answer that needs a key they lack). Content that depends on
one is marked `2.4.0` and is **dev-only** until that release is tagged (`VER-05`,
`core/app-feature-versions.md`): the prod push is refused (until `LATEST_RELEASED` reaches 2.4.0), and until the keyboard exists in a build the
question falls back to subject inference and may not be answerable on a device.

## Routing — what a question resolves to

Resolution order (`KeyboardResolver.resolve`): **declared `keyboard_type` (released values only) →
else the subject table below.**

| Subject | Presentation | Keyboard |
|---|---|---|
| `english_hl` | any | `English` (legacy; QWERTY + `'` + space) |
| `math_lit` | any | `StandardMath` |
| `maths`, `physics` | `equation`, `steps` | `ScientificMath` |
| `maths`, `physics` | anything else (`fitb`, `fraction`) | `StandardMath` |
| any other subject | `fitb`, `fraction` | `None` — **not unanswerable**: `LessonView.kt` sets `suppressSystemKeyboard = false` for `None`, and `DynamicTextInput`/`RoundedTextBox` fall back to a real focusable `BasicTextField`, so the device's system keyboard opens. But `FillInTheBlank.kt` never overrides the `keyboardType` param, so the field always requests `KeyboardType.Decimal`: a bare-numeric answer is fully typeable; a free-text answer depends on whether the device's decimal-mode IME exposes a letters toggle (inconsistent across devices — not something to author against). |
| any other subject | `steps`, `equation` | `None`, and this **is** genuinely unanswerable — `EquationInput.kt` has no system-IME fallback ("driven entirely by the [custom] keyboard via ViewModel"; `LessonView.kt`'s `None -> { /* no custom keyboard */ }`). The validator errors on it. |

`physics` is therefore resolved identically for Physics (P1) and Chemistry (P2) today; they only
diverge once a question declares `physics` / `chemistry`.

## Character inventories (released keyboards)

Every row's "first release" is in `core/app-feature-versions.md`; the validator uses the same data
to compute the minimum build an answer needs.

### `StandardMath` (`standard_math`)

`0`–`9`, `.`, `-` (ASCII hyphen-minus U+002D). No parentheses, operators or letters — a decimal
number pad. This is why `fitb`/`fraction` blanks should be bare numbers (`DESIGN-PHYS-02`'s
unit-as-separate-token pattern exists to keep the blank itself in this alphabet).

### `ScientificMath` (`scientific_math`) — Numbers tab

`0`–`9`, `.`, `-` (ASCII — **only from 2.2.0**, see Gotcha), `+`, `×`, `÷`, `(`, `)`, `=`, plus an
`a/b` mode key that opens a structural fraction sub-input (not a literal `/`). The grid is 4×5 with
**one free slot** (row 4 ends in an empty spacer; an earlier version of this doc wrongly said the tab
was full).

### `ScientificMath` — Symbols tab

`sin` `cos` `tan` `π` `θ` `√` `log` `|x|` `≤` `≥` `∴` `∵` `≠` `∈` `ℤ` `x` `y` `^` `%`, plus the same
`a/b` key. The last row (`x y ^ %`) shipped in **2.2.0**; before it there was no way to type any
variable letter or a power. `x`/`y` are the only variable letters — author algebra with these names,
not `r v m E F n t …`, if the value must be typed. `^` is a literal caret typed as `x^2`; a true
Unicode superscript cannot be typed, so a typed expected value spells exponents with `^` even where
*given/display* text in the same question uses real superscripts (`10¹⁴`) — those are different
things (rendered label vs typed value) and needn't match glyph-for-glyph. This tab is **full**.

### `ScientificMath` — the Maths variant coming in the next release (planned; AMPM `dev`, unreleased)

Decisions D13/D14, built as initiative 4a on the evidence in AMPM `plan/active/scientific-keyboard-survey.md`
(five Maths memos including both Paper 2s). Three tabs — **Numbers · Symbols · ABC**:

- **Numbers:** the existing grid plus `;` in the free slot (Paper 2 uses `;` for coordinates ~70–80 times a paper).
- **Symbols (4 rows of 5, in evidence order):** `< > ≤ ≥ ≠` / `° ∠ Δ θ π` / `, ! ∞ → ±` / `∈ √ ^ ∴ %`. `°`, `∠` and `Δ` are the
  Paper 2 staples (`°` 150–180 times a paper). Removed from this tab: `sin cos tan log` (moved to ABC), `|x|`, `∵`, `ℤ`,
  `x`, `y` (now ordinary letters) and the duplicate `a/b` key (still on Numbers).
- **ABC:** a top row of whole-token keys `sin` `cos` `tan` `log`, then QWERTY a–z with a **one-shot shift** (tap → the next
  letter is upper case → back to lower; tapping shift twice cancels). Upper case matters: Paper 2 labels points and shapes
  (`R S A B M O D …`), and `steps`/`equation` marking is case-sensitive.

The validator's `scientific_math` inventory (`tools/lib/feature-versions.js`) now matches this exactly; every new key is `NEXT`
(dev-only until the release is tagged). Not on this keyboard: `[ ]`, `'`, `∩ ∪ Σ σ`, Greek beyond `θ Δ`, `ln lim nCr nPr`
(type `ln`/`lim` as letters), sub/superscript mode keys — those belong to the Physics/Chemistry variants (4d/4e).

### `English` (legacy, subject-inferred; not declarable)

Letters `A`–`Z`, `'` and space. Keys emit upper case; marking lower-cases both sides (see § Marking),
so case never decides correctness. **No digits, no punctuation of any kind** — a stored answer
containing `, . - ? ! : ; " ( )` or a digit cannot be typed on it. `text` (BLA-58) supersedes it.

## Known gaps — what the released keyboards cannot type

Nothing below blocks current prod content (Maths 2019 is numeric `fitb`/`fraction`/MC/ordering only);
it blocks **authoring** the question shapes that need it. The validator turns each into an error on
the specific answer (`KEYBOARD-01`).

**`ScientificMath` for a Grade 12 Maths paper** is not complete. Missing: `<` and `>` (only `≤ ≥ ≠`),
every variable letter except `x y θ` (sequences need `a r d n k T`, finance `A P i n`, functions
`f g h`, geometry `m c`), `;` and `[` `]` (SA coordinates are `(2;3)`, intervals `[1;5)`), the degree
sign `°`, `ln`, `e`, `∞`, `±`, `∩ ∪`, `!`, `nCr`/`nPr`, `x̄ σ`, the prime `'`, `lim`, `Σ`, and any
subscript (`Tₙ`, `log₂`). Tracked as BLA-21 (plan item 5c0): configurable tabs
(`Numbers | Symbols | Letters`) so Maths, Physics and Chemistry share one component. **Survey real DBE
Grade 12 Maths P1/P2 papers before designing it.**

**Physics** and **Chemistry**: the released keyboards cannot type the letters `r v m E F n t`, `Δ Ω μ ε`, a comma, sub/superscripts
(`H₂O`, `Fe³⁺`), `→`, `⇌` or `(aq)(s)(l)(g)`. The `physics` / `chemistry` keyboards (next release) can — see § Declaring a keyboard.
Until that release is tagged, a typed answer needing them is dev-only.

**Text / Afrikaans** (`text`, BLA-58) is specified, not built: QWERTY plus a second screen for
punctuation, digits and — shown only for Afrikaans questions — `ê ë é è ô ö û ü î ï ä ŉ`. No
long-press, no shift key. Until it ships, free-text answers for `english_hl` are limited to letters,
apostrophe and space, and for the `None`-routed subjects (life_science, geography, history,
business_studies) to bare numerics.

## Marking — how a typed value is compared (affects what you can store)

From `QuestionsValidator.kt` (App wins if this drifts):

- `fitb` (and `steps`): both sides trimmed and **lower-cased**; `,` → `.`; numeric strings normalised
  (`540` = `540.00`); stored `|` separates accepted alternatives; U+2212 `−` → `-` (**from 2.2.0**,
  `fitb`/`steps` only — `fraction` only maps `,` → `.`).
- **Punctuation is not stripped.** A student who types a trailing `.` on a text answer is currently
  marked wrong. When `text` ships, marking must ignore a trailing `. , ; ! ?` (BLA-58); accents stay
  significant (`leë` ≠ `lee`).
- Case never matters for `fitb` **unless the question sets `case_sensitive: true`** (`SCHEMA-CS-01`, D15), which makes `fitb`
  compare exactly — Chemistry formulae (`Co` ≠ `CO`) are the intended use. It is only valid on a keyboard that can type both
  cases (the scientific variants' ABC tab has a one-shot shift); the Text keyboard still has no shift, so its answers stay
  case-insensitive.

## Retrofitting `keyboard_type` onto already-uploaded content

**`KEYBOARD-06`** — `enforced_by: human-review`. For rows already on dev (`KEYBOARD-04` covers *new* content):

0. **Is the paper/exam in prod?** If any paper of it is live in prod, do not add a not-yet-released feature to it (step 4). Check read-only; the
   framework has no tool that answers this directly (`backfill-keyboard-types.js --env prod` reports by subject/paper/presentation, not by year).
   Start the prod Cloud SQL Auth Proxy (`cloud-sql-proxy <PROD_PROJECT>:us-central1:ampm-backend --port 15433`; the `PG_*_PROD` block must be in
   `.env` — credentials are never written in docs or chat) and run a SELECT only, e.g.
   `node -e "const {getPool,closePool}=require('./tools/lib/postgres');getPool('prod').query(\"SELECT year_id, paper_id, count(*) AS questions, count(*) FILTER (WHERE is_published) AS published FROM questions WHERE subject_id='physics' AND NOT is_deleted GROUP BY 1,2 ORDER BY 1,2\").then(r=>{console.table(r.rows);return closePool()})"`.
   Current status per paper is recorded in the subject profile (`subjects/dbe-physics.md`, "Prod status").
   `push-paper-to-prod.js` also checks this itself, exam-wide, before any write: it prints each paper's dev/prod presence and derived minimum plus the exam-level
   minimum and `LATEST_RELEASED`, and refuses an unreleased exam or a partial one (`VER-08`). 2023 Nov P2 being in prod without P1 predates that rule.
   **Retrofit decision.** What "works with the new keyboards" means depends on the content:
   - **Every typed answer is bare numeric and no label needs markup** → the retrofit is only an **explicit `keyboard_type`** per `KEYBOARD-04`
     (`standard_math` for `fitb`, `scientific_math` for `steps`/`equation`). Do **not** add `physics`/`chemistry` or `_{…}`; the exam stays releasable at its
     floor — do not force it to `2.4.0`. (2023 Nov P1 is this case.)
   - **A label or given text needs markup, or an answer needs a key only the new keyboards have** → declare `physics`/`chemistry` only where an
     *answer* needs it (`KEYBOARD-04`), use `_{…}` per `MATHTEXT-11`, and accept that the exam becomes `2.4.0` / dev-only. (2024 Nov P1 is this case.)
1. **Check what the database holds.** `tools/backfill-keyboard-types.js` already wrote `standard_math` / `scientific_math` / etc. on existing rows, and
   an upload script that never declared `keyboard_type` knows nothing about it (omitted = the database value is left alone on re-upload). Compare
   script vs rows before assuming anything.
   **If the dev rows already hold the intended value** (the backfill usually wrote `standard_math`/`scientific_math`), only edit the script so it declares
   it — no fix script, no database write.
2. **Edit the upload script** (the source of truth) *and*, when the rows differ, update the dev rows with a one-off fix script in the style of
   `scripts/fix-keyboard-defects-2026-10-04.js` / `scripts/fix-keyboard-retrofit-physics-2024-2026-10-05.js`: match rows by (paper, question text), refuse any
   row that no longer looks as expected, run `fv.analyzeQuestion` on the new row, **dry-run first**, write only the changed columns, and
   **bump `updated_at`** (`VER-04` — clients delta-sync on it). Do not re-run the whole upload script for this: it rewrites the lesson and
   explanation rows too.
3. Run `validate-questions.js` per script and `derive-exam-min.js` on the exam; then `node tools/apply-exam-gate.js --env dev --subject <id> --year <YYYY> --session <session>` (dry run, then `--apply`) writes the derived gate — the gate is per exam, so it also gates the sibling paper (`VER-01`/`VER-09`); a `physics`/`chemistry` keyboard or `_{…}` markup makes it `2.4.0`.
4. **Never push content that needs an unreleased version (2.4.0 today) to prod** (`push-paper-to-prod.js` refuses it — the whole exam, `VER-08`), and **do not retrofit an exam that is already live in prod**
   with a not-yet-released feature until the release is tagged — the prod devices that already synced it would receive markup / a keyboard they cannot render.
5. TODO (follow-up, not built): a generic `tools/set-question-keyboard-type.js` (exam + question filter → keyboard, dry-run, `updated_at` bump) would replace the
   per-retrofit fix scripts.

## Rules

**`KEYBOARD-01`** — A typed-answer value must use only characters the resolved keyboard can
produce. Resolve (declared `keyboard_type` → subject, presentation) against § Routing, then check
every character of every accepted alternative against that keyboard's inventory.
`enforced_by: validator` for `fitb`, `steps`, `fraction` answers (`validate-questions.js`);
`human-review` for `equation` (canonical serialization, not typed characters — `SCHEMA-TYPE-03`).

**`KEYBOARD-02`** — Prefer bare numeric blanks (digits, `.`, optional leading `-`) for
`steps`/`fitb`/`equation` wherever the subject allows. It is the only shape that is fully typeable on
both custom keyboards *and* gets `normalizeNumericString`'s tolerance instead of exact-string match.
Get the unit/label text out of the blank without inflating the row count — how differs by presentation:
- `fitb`: split into a separate **given** `metadata` token around the blank (`DESIGN-PHYS-02`) — `fitb`
  doesn't number rows, so extra tokens are free: `metadata: ['a = ', '[ ]', ' m·s⁻²']`.
- `steps`: **do not** split into a separate row — every `metadata` row gets its own numbered "Step N"
  (`StepsPresentation.kt`), so a label/unit row becomes a spurious extra step. Fold the label/unit into
  the *end of the preceding given row's text* instead; end that row with a colon, not `=`, if it already
  contains an equation:
  ```js
  metadata: ['ε = I(R + r)', '20 = 5(3.8 + r), so r (in Ω):', '[ ]'],
  answer: ['0.2'],
  ```
  `enforced_by: human-review`

**`KEYBOARD-03`** — For `steps`: give the *entire* derivation as read-only rows and leave one
well-defined blank per unknown, matching the Maths precedent — not "one given row, then everything
else blank", and not one artificial extra row per blank for its label/unit either (`KEYBOARD-02`).
See `presentations/steps.md`. `enforced_by: human-review`

**`KEYBOARD-04`** — Declare `keyboard_type` **only where subject inference would pick the wrong keyboard, or where the answer or its label
needs something the basic keyboards cannot type** — letters, `_{…}`/`^{…}` markup, Greek, `→ ⇌ Δ`, state symbols, charges. In
Physical Sciences (`physics`) that means: Paper 1 → `physics`, Paper 2 → `chemistry`, **but a bare-numeric answer stays on the basic
keyboard** — declare `standard_math` (`fitb`/`fraction`) or `scientific_math` (`steps`/`equation`) explicitly, as `backfill-keyboard-types.js`
did, so a script and its database row agree. (Decision 2026-10-05, the 2024 Nov P1/P2 retrofit: a `physics` keyboard on a number-only blank
replaced the number pad with a bigger keyboard for no benefit.) Presentation-specific: a `fitb` with markup only in its *label* does not
need `physics` either — labels are rendered, not typed. Until a release carries the new keyboards, content that declares them is dev-only
(`KEYBOARD-05`). Worked cases: Physical Sciences 2023 and 2024 Nov P1 — every `fitb` is `standard_math`, every `steps` is `scientific_math`
(the 2024 `steps` rows carry `_{…}` markup in their given text, which is rendered, not typed, so they still do not need `physics`).
`validate-questions.js` **warns** (non-blocking) when a `fitb`/`steps`/`equation`/`fraction` question has no `keyboard_type` declared.
`enforced_by: human-review` (the missing-declaration warning is `validator`)

**`KEYBOARD-05`** — Planned keyboards and keys (`physics`, `chemistry`, `text`, the extended
`scientific_math` letters/symbols) are **valid to author** but content that uses them is **dev-only until the
release carrying them is tagged**: its derived minimum is `2.4.0`, `push-paper-to-prod.js` refuses it
(the whole exam, `VER-08`), and `set-exam-gate.js` writes it to prod only once it is `<= LATEST_RELEASED`. On dev the exam gate is
derived and written for you (`tools/apply-exam-gate.js`, `VER-09`). When the release is tagged, bump `LATEST_RELEASED` in
`tools/lib/feature-versions.js` (`VER-06`). `enforced_by: tooling`

## Gotcha: the two custom keyboards used different minus-sign glyphs

Caught 2026-09-10 by direct user testing (a render-only screenshot comparison cannot see it — `-` and
`−` look nearly identical). Until **2.2.0**, `ScientificMathKeyboard`'s minus key emitted `−` (U+2212)
while `StandardMathKeyboard`'s emitted `-` (U+002D). `normalizeNumericString` calls `toDoubleOrNull()`,
which only recognises the ASCII form, so a negative number typed on `ScientificMath` silently failed to
parse and fell through to exact-string match against a stored (ASCII) answer. **A correctly typed
negative answer was marked wrong.**

Fixed at the root in 2.2.0 (the key now emits ASCII `-`) plus a defensive `−` → `-` normalisation on
the comparison. Two consequences that still matter:

- On builds **below 2.2.0** a negative answer typed on `ScientificMath` is still wrong. Physics 2025
  Nov P1 (`add-physics-2025-nov-p1-q4.js`, answer `-3`) is such a question, in a subject whose gate is
  2.1.2 — see `core/app-feature-versions.md`'s findings.
- Store negative answers with ASCII `-`. A stored `−` only works through the 2.2.0 normalisation
  (and not at all for `fraction`).

The takeaway: **the custom keyboards are not guaranteed to use the same glyph for a concept that looks
the same to a human.** When adding a keyboard or key, check it against this doc (and update the
inventory in `tools/lib/feature-versions.js`) rather than assuming consistency.
