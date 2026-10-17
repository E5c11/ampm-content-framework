"""Shared helpers + emitter for the Afrikaans FAL generators (gen_afr_2025_p1.py ...).
Run from anywhere: python3 scripts/_gen/afrikaans-fal/gen_afr_2025_p1.py. Writes scripts/add-afrikaans-fal-<year>-nov-p<N>-q<n>.js
and appends the subtopics/skills it uses to tools/seeds/afrikaans-fal-curriculum.json."""
import itertools, json, os

ROOT = "/home/emmanuel/WebstormProjects/ampm-content-framework"
SUBJECT = "afrikaans_fal"
# correct-answer slot for multiple_choice: index 0 is capped at ~10% (DESIGN-UNI-06)
POS = itertools.cycle([2, 1, 3, 2, 1, 3, 0, 2, 3, 1, 2, 1, 3, 2, 3, 1, 2, 3, 1, 2, 0, 3, 2, 1])


def mc(correct, wrong):
    i = next(POS) % (len(wrong) + 1)
    opts = list(wrong)
    opts.insert(i, correct)
    return opts + [""] * (5 - len(opts)), [correct, "", "", "", ""]


def ms(correct, wrong):
    opts = list(correct) + list(wrong)
    idx = [i for i in (0, 2, 1, 3, 4) if i < len(opts)]
    order = [opts[i] for i in idx]
    order += [""] * (5 - len(order))
    return order, list(correct) + [""] * (5 - len(correct))


def match(pairs):
    left = [f"{'ABC'[i]} - {pairs[i][0]}" for i in range(3)]
    rights = [p[1] for p in pairs]
    shuf = [rights[1], rights[2], rights[0]]
    right = [f"{k+1} - {r}" for k, r in enumerate(shuf)]
    ans = [f"{'ABC'[i]}-{shuf.index(rights[i]) + 1}" for i in range(3)]
    return left + right, ans + ["", ""]


def fitb(label, answer):
    return [label, "[ ]"], [answer, "", "", "", ""]


def order5(items, shown):
    meta = [items[i] for i in shown] + [""] * (5 - len(items))
    return meta, list(items) + [""] * (5 - len(items))


def Q(order, unit, topic, subtopic, skills, question, md, ans, pres, diff, w, clues, ctx, basis, text_key=None):
    d = dict(order=order, context_text=ctx, question=question, metadata=md, answer=ans, presentation=pres,
             type="definition" if pres == "fitb" else "application", unit=unit, topic=topic, subtopic=subtopic,
             skills=[SUBJECT + "_" + s for s in skills], difficulty=diff, exam_weight=w, clues=clues)
    if pres == "fitb":
        d["keyboard_type"] = "text"
    return d, basis


def js(v):
    return json.dumps(v, ensure_ascii=False, indent=2)


def bullets(lines):
    return "\n".join("- " + l for l in lines)


def emit(year, paper, lessons):
    base_url = f"https://media-dev.askmoreprepmore.app/exam_papers/dbe/{SUBJECT}/{year}/{paper}"
    pn = paper.split("_")[1]
    tail = open(os.path.join(ROOT, "scripts/add-english-fal-2025-nov-p1-q1.js")).read()
    tail = tail[tail.index("// ─── Upload ─"):]
    seed_path = os.path.join(ROOT, "tools/seeds/afrikaans-fal-curriculum.json")
    seed = json.load(open(seed_path))
    have = {k["id"] for k in seed["skills"]}
    for les in lessons:
        n = les["order"]
        fname = f"add-afrikaans-fal-{year}-nov-{pn}-q{n}.js"
        base = f"{base_url}/q{n}"
        supp = None
        if les.get("supp"):
            supp = [dict(type="annexure", label=label, image_urls=[f"{base}/{stem}_{i}.png" for i in range(1, pages + 1)])
                    for label, pages, stem in les["supp"]]
        video = dict(name=les["name"], syllabus="dbe", subject=SUBJECT, year=year, paper=paper, order=n,
                     content_tier="free", has_video=False, xp=50, tags=les["tags"])
        if les.get("text_key"):
            video["text_key"] = les["text_key"]
        video.update(dict(question_image_urls=[f"{base}/question_{i}.png" for i in range(1, les["q"] + 1)],
                          memo_image_urls=[f"{base}/memo_{i}.png" for i in range(1, les["m"] + 1)],
                          exam_question_marks=les["marks"], supplementary_materials=supp))
        qs, basis = [], []
        for x, b in les["questions"]:
            d = dict(xp=10, syllabus="dbe", subject=SUBJECT, year=year, paper=paper, name=f"Vraag {x['order']}")
            if les.get("text_key"):
                d["text_key"] = les["text_key"]
            d.update(x)
            qs.append(d)
            basis.append(b)
        ai = dict(sub_questions=[dict(number=a_[0], marks=a_[1], clues=bullets(a_[2]), approach=bullets(a_[3]), solution="\n".join(a_[4]))
                                 for a_ in les["ai"]],
                  model="claude-sonnet-5-5", generated_at="__NOW__", version=2, reviewed=False, input_tokens=0, output_tokens=0,
                  avg_rating=None, rating_count=None)
        assert sum(a_[1] for a_ in les["ai"]) == les["marks"], (fname, "aiExplanation marks != exam_question_marks")
        basis_block = "\n".join(f" *   Q{i+1}: {b}" for i, b in enumerate(basis))
        body = f"""#!/usr/bin/env node
/**
 * DBE Afrikaans FAL {pn.upper()} — November {year} — {les['header']}
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P1 language-paper skill / theme, C CAPS:
{basis_block}
 *
 *   node tools/validate-questions.js --script scripts/{fname} --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/{fname} --dry-run
 *   node scripts/{fname}
 */

'use strict';

const {{ getPool, closePool }} = require('../tools/lib/postgres');
const {{ upsertRow }} = require('../tools/lib/upsert');
const {{ buildContentRows, referenceIdsUsed }} = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Lesson document ─────────────────────────────────────────────────────────

const video = {js(video)};

// ─── Practice questions ──────────────────────────────────────────────────────

const questions = {js(qs)};

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {js(ai).replace('"__NOW__"', 'Date.now()')};

{tail}"""
        open(os.path.join(ROOT, "scripts", fname), "w").write(body)
        print("wrote", fname, len(qs), "questions,", len(les["ai"]), "ai")
        for x, _b in les["questions"]:
            for u in seed["units"]:
                if u["slug"] != x["unit"]:
                    continue
                for t in u["topics"]:
                    if t["slug"] == x["topic"]:
                        st = t.setdefault("subtopics", [])
                        if x["subtopic"] not in {s["slug"] for s in st}:
                            st.append(dict(slug=x["subtopic"], name=x["subtopic"].replace("_", " ").capitalize()))
            for s in x["skills"]:
                if s not in have:
                    seed["skills"].append(dict(id=s, name=s[len(SUBJECT) + 1:].replace("_", " ").capitalize()))
                    have.add(s)
    json.dump(seed, open(seed_path, "w"), indent=2, ensure_ascii=False)
