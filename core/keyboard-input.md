---
id: AMPM-CONTENT-KEYBOARD-INPUT
type: reference
layer: core
related: [AMPM-CONTENT-SCHEMA, AMPM-CONTENT-DESIGN, AMPM-CONTENT-MATHTEXT, AMPM-CONTENT-PRES-FITB, AMPM-CONTENT-PRES-STEPS, AMPM-CONTENT-PRES-EQUATION]
tags: [content, keyboard, input, steps, fitb, equation, physics]
provenance: created 2026-09-10, after a physics `steps` question shipped with blanks the
  in-app keyboard could not actually produce — see `subjects/dbe-physics.md`'s "steps"
  correction note for the incident.
---

# Keyboard Input — What A Student Can Actually Type

## Purpose

`core/mathtext.md` governs how question/metadata text **renders** (fractions, roots).
This doc governs the opposite direction: what characters a student can **type** into a
blank (`fitb`, `steps`, `equation`), sourced directly from the app's custom keyboard
components — not assumed. **Any expected typed-answer value must be composable entirely
from the resolved keyboard's character set below.** Authoring an answer that requires a
character the keyboard doesn't have makes the question unanswerable, and no render-only
screenshot review will ever catch it (`presentations/steps.md`'s pitfalls section, the
`review-paper.md` Phase 3 completability check).

The app never falls back to the system IME for `fitb`/`steps`/`equation`/`fraction`
blanks — these are custom Compose keyboards that only emit the exact key labels defined
in their source. If a label isn't listed below, it cannot be typed, full stop.

## Source of truth

Re-verify against these files if this doc and the app ever disagree — the app wins:

- `AMPM/feature/watch/.../questions/ui/KeyboardResolver.kt` — subject × presentation →
  keyboard type routing.
- `AMPM/core/designsystem/.../components/SubjectKeyboard.kt` — `StandardMathKeyboard`.
- `AMPM/core/designsystem/.../components/MathsKeyboard.kt` — `ScientificMathKeyboard`.
- `AMPM/core/designsystem/.../components/EnglishKeyboard.kt` — `EnglishKeyboard`.
- `AMPM/feature/watch/.../questions/utils/QuestionsValidator.kt` — how a typed value is
  compared against the stored `answer` (`normalizeNumericString` etc.).

## Routing (`KeyboardResolver.resolve`)

| Subject | Presentation | Keyboard |
|---|---|---|
| `english_hl` | any | `English` |
| `math_lit` | any | `StandardMath` |
| `maths`, `physics` | `equation`, `steps` | `ScientificMath` |
| `maths`, `physics` | anything else (`fitb`, `fraction`) | `StandardMath` |
| any other subject | any | `None` — **no custom keyboard, system IME never shown
  either** (`QuestionKeyboardType.None` renders nothing; only affects blanks a subject
  actually has — most presentations for e.g. `geography` are select-from-options, not
  typed). Confirm before authoring a typed blank for a subject not in this table. |

## Character inventories

### `StandardMath`

`0`–`9`, `.`, `-` (ASCII hyphen-minus, U+002D). No parentheses, no operators, no letters.
Purely a decimal-number pad — this is why `fitb`/`fraction` blanks should always be bare
numbers (`DESIGN-PHYS-02`'s unit-as-separate-token pattern exists specifically to keep
the blank itself in this alphabet).

### `ScientificMath` (Numbers tab)

`0`–`9`, `.`, `-` (ASCII, fixed 2026-09-10 — see Gotcha below), `+`, `×`, `÷`, `(`, `)`,
`=`, plus an `a/b` mode key that opens a structural fraction sub-input (not a literal `/`
character).

### `ScientificMath` (Symbols tab)

`sin` `cos` `tan` `π` `θ` `√` `log` `|x|` `≤` `≥` `∴` `∵` `≠` `∈` `ℤ` `x` `y` `^` `%`,
plus the same `a/b` mode key. The last row (`x`/`y`/`^`/`%`) was added 2026-09-10 — before
that there was no way to type *any* variable letter or a power at all (`x²`/`x³`/`xⁿ`
exist only in the separate scratch-calculator tool, which does not write into the answer
field). `x`/`y` are the only two variable letters available — author algebra with these
names, not `r`/`v`/`m`/`E`/`F`/etc., if the value must be typed rather than given.
`^` is a literal caret, typed as `x^2` — there is no way to type a true Unicode
superscript digit, so an expected typed answer must spell exponents this way even where
*given/display* text elsewhere in the same question uses a real superscript character
(`10¹⁴`) for readability; those are different things (rendered label vs. typed value) and
don't need to match glyph-for-glyph.

**Still not available anywhere in `ScientificMath`:** any letter beyond `x`/`y`/`θ` (no
`r`, `v`, `m`, `E`, `F`, `n`, `t`, …), subscript digits, `Ω`, `Δ`, `μ`, `ε`, comma, space.
A typed blank cannot be a subscripted expression or a full sentence — only a numeric or
`x`/`y`-based algebraic expression built from the tokens above. If a future paper needs a
third variable or a currently-missing symbol, the keyboard has no open slots left (Numbers
tab is full at 4×5, Symbols tab is now full at 4×5 too) — adding one means either dropping
an existing key or growing the layout, a deliberate choice, not a silent one.

### `English`

Full QWERTY letters + apostrophe + space (`EnglishKeyboard.kt`) — free text, not
constrained the way the maths keyboards are.

## Rules

**`KEYBOARD-01`** — `enforced_by: human-review`. A typed-answer value (`answer` for
`fitb`/`steps`/`equation`, or a `steps` blank specifically) must use only characters the
resolved keyboard can produce. Before writing an expected typed value, resolve
(subject, presentation) against the routing table above, then check every character
against that keyboard's inventory.

**`KEYBOARD-02`** — Prefer bare numeric blanks (digits, `.`, optional leading `-`) for
`steps`/`fitb`/`equation` wherever the subject allows it. This is the only shape that (a)
is fully typeable on both custom keyboards and (b) gets `normalizeNumericString`'s
tolerance (comma→period, `9.8`==`9.80`) instead of falling back to fragile exact-string
match. Get the unit/label text out of the blank without inflating the row count —
**how** differs by presentation:
- `fitb`: split into a separate **given** `metadata` token around the blank
  (`DESIGN-PHYS-02`) — `fitb` doesn't number rows, so extra tokens are free:
  `metadata: ['a = ', '[ ]', ' m·s⁻²']`.
- `steps`: **do not** split into a separate row — every `metadata` row gets its own
  numbered "Step N" (`StepsPresentation.kt`), so a separate label/unit row becomes a
  spurious extra step (caught 2026-09-10 — see `presentations/steps.md`'s pitfalls
  section for the incident). Fold the label/unit into the *end of the preceding given
  row's text* instead, so the row count matches the real step count:
  ```js
  metadata: ['ε = I(R + r)', '20 = 5(3.8 + r), so r (in Ω) =', '[ ]'],
  answer: ['0.2'],
  ```

**`KEYBOARD-03`** — For `steps` specifically: give the *entire* derivation as read-only
rows and leave one well-defined blank per unknown, matching the Maths precedent — not "one
given row, then everything else blank," and not one artificial extra row per blank for its
label/unit either (`KEYBOARD-02`). See `presentations/steps.md`'s pitfalls section; this
was the physics incident's other half (a scaffolding defect, independent of the
character-set one, but the two compound — see Gotcha).

## Gotcha: the two custom keyboards used different minus-sign glyphs

Caught 2026-09-10, by direct user testing (not the automated review agent — a
render-only screenshot comparison can't see this class of bug at all, since `-` and `−`
look nearly identical). `ScientificMathKeyboard`'s minus key emitted `−` (U+2212 MINUS
SIGN); `StandardMathKeyboard`'s emitted `-` (U+002D ASCII hyphen-minus).
`QuestionsValidator.kt`'s `normalizeNumericString` calls Kotlin's `toDoubleOrNull()`,
which only recognizes the ASCII form — so a student typing a negative number via
`ScientificMathKeyboard` (any physics/maths `equation`/`steps` blank) would produce a
string that silently failed to parse as numeric, falling through to exact-string match
against a stored answer that (being authored as a plain string literal) was always ASCII.
**A correctly-typed negative answer was being marked wrong.**

Fixed at the root — `MathsKeyboard.kt`'s minus key now emits ASCII `-`, matching
`StandardMathKeyboard` — plus a defensive `−`→`-` normalization added to
`normalizeNumericString` itself as a safety net for any legacy content. Both changes are
in `AMPM` (uncommitted attribution — see git log for the commit once made). The takeaway
for this doc: **the two custom keyboards are not guaranteed to use the same glyph for a
concept that looks the same to a human reader.** When adding a new keyboard or key, check
it against this doc (and update this doc) rather than assuming consistency.
