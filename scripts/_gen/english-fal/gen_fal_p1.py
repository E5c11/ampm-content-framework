#!/usr/bin/env python3
"""Generates scripts/add-english-fal-2025-nov-p1-q{1..5}.js and the FAL P1 seed additions."""
import json, os

ROOT = "/home/emmanuel/WebstormProjects/ampm-content-framework"
BASE = "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1"
BLANK = ["", "", "", "", ""]


def mc(opts, correct_idx):
    o = list(opts) + [""] * (5 - len(opts))
    ans = [""] * 5
    ans[0] = opts[correct_idx]
    return o, ans


def fitb(label, answer):
    return [label, "[ ]"], [answer, "", "", "", ""]


def q(order, unit, topic, subtopic, skills, question, metadata, answer, presentation,
      difficulty, exam_weight, clues, context_text=None, qtype="application", keyboard=None):
    d = dict(order=order, context_text=context_text, question=question, metadata=metadata, answer=answer,
             presentation=presentation, type=qtype, unit=unit, topic=topic, subtopic=subtopic,
             skills=["english_fal_" + s for s in skills], difficulty=difficulty, exam_weight=exam_weight, clues=clues)
    if presentation == "fitb":
        d["keyboard_type"] = "text"
    return d


LESSONS = {}

# ───────────────────────── Q1 Comprehension ─────────────────────────
Q = []
o, a = mc(["The monthly listener numbers of these artists fell.",
           "Songs can be played soon after they are released.",
           "Some African artists reached cities they had never visited.",
           "Streaming makes it possible to hear music from other countries."], 0)
Q.append(q(1, "comprehension", "literal_comprehension", "identify_false_statement", ["identify_false_statement"],
           "Which ONE of the following statements about the extract is FALSE?", o, a, "multiple_choice", 2, 2,
           "- Check each option against the extract, one at a time.\n- Three options are supported by the extract; look for the one that is not.",
           context_text="Streaming platforms let listeners in any country play a song within seconds of its release. Last year, several African artists reached audiences in cities they had never visited, and their monthly listener counts doubled."))
m, a = fitb("Word:", "huge")
Q.append(q(2, "comprehension", "vocabulary_in_context", "synonym_in_context", ["find_synonym_in_text"],
           "Quote ONE word from the extract that means the same as 'large'.", m, a, "fitb", 2, 2,
           "- Look for an adjective that describes the crowd.\n- Quote a single word only.",
           context_text="The new studio in Soweto has drawn a huge crowd of young producers every weekend."))
Q.append(q(3, "comprehension", "literal_comprehension", "select_stated_reasons", ["identify_stated_reasons"],
           "Select the TWO reasons given in the extract why South Africa is important to the regional music industry.",
           ["It is the largest music market in its region.", "Its artists have won international awards.",
            "It has the most radio stations in Africa.", "Its music is cheaper than music from other countries.",
            "It hosts the largest music festival in the world."],
           ["It is the largest music market in its region.", "Its artists have won international awards.", "", "", ""],
           "multi_select", 3, 2,
           "- Use only what the extract states; do not add facts you know from elsewhere.\n- Two options appear in the extract almost word for word.",
           context_text="South Africa is the largest music market in its region, and its artists have recently won several international awards."))
o, a = mc(["To show that the writer is a member of the board.",
           "To make the statistic more trustworthy.",
           "To advertise the services of the board.",
           "To explain how music is recorded."], 1)
Q.append(q(4, "comprehension", "author_purpose_and_attitude", "purpose_of_source_reference", ["explain_purpose_of_reference"],
           "Why does the writer mention the Global Music Statistics Board?", o, a, "multiple_choice", 2, 3,
           "- Ask what a named, official source adds to a statistic.\n- Think about whether the reader is more or less likely to believe the figure.",
           context_text="According to the Global Music Statistics Board, local streaming income rose by 18% last year."))
o, a = mc(["It is a word that is difficult to pronounce.", "It shows that the word is spelled incorrectly.",
           "It is the writer's own opinion.", "It is the name of a song."], 3)
Q.append(q(5, "comprehension", "text_features_and_visuals", "italics_function", ["explain_function_of_italics"],
           "In the original article, the word 'Ulwandle' is printed in italics. Why?", o, a, "multiple_choice", 2, 2,
           "- Think about what kinds of words are usually set in italics in a news article.\n- Look at the word's position in the sentence.",
           context_text="Her debut single, Ulwandle, mixes gospel harmonies with a modern kwaito beat."))
Q.append(q(6, "comprehension", "vocabulary_in_context", "idioms_and_expressions", ["explain_idiom_meaning"],
           "Match each expression to its meaning.",
           ["A - a household name", "B - to hit the right note", "C - to take centre stage",
            "1 - to say or do something that suits the occasion", "2 - to become the main focus of attention",
            "3 - a person or brand that almost everyone knows"],
           ["A-3", "B-1", "C-2", "", ""], "match", 3, 2,
           "- Try each expression in a sentence and see which meaning fits.\n- Start with the one you are most sure about and remove it."))
o, a = mc(["The title is completely suitable because the extract says that every African artist is now famous abroad.",
           "The title is not suitable because the extract only mentions music from a single country.",
           "The title is partly suitable: many genres find new audiences, but only a handful of acts have reached the charts.",
           "The title is not suitable because the extract is not about music."], 2)
Q.append(q(7, "comprehension", "evaluative_reading", "title_suitability", ["evaluate_title_suitability"],
           "Discuss the suitability of the title 'AFRICAN MUSIC TAKES THE WORLD BY STORM' for the extract. Which ONE answer is best substantiated by the extract?",
           o, a, "multiple_choice", 3, 3,
           "- Compare the strength of the title's claim with the facts the extract gives.\n- A well-substantiated answer refers to specific details from the extract.",
           context_text="Local gospel choirs, jazz bands and amapiano producers are all finding new audiences abroad. Yet only a handful of acts have reached the international charts."))

AI1 = [
    ("1.1.1", 1, "- Read the statement, then find what the first paragraph says about revenue in 2023.\n- Think about whether the paragraph describes a gain or a loss.",
     "- Locate the sentence about total revenue in paragraph 1\n- Say what it actually reports\n- Write the correct fact to show why the statement is false",
     "1. Paragraph 1 says the music industry reached its highest total revenue ever in 2023.\n2. The statement claims it suffered a great financial loss, which is the opposite.\n3. So the statement is false: the industry achieved its best income."),
    ("1.1.2", 1, "- You need a single word from paragraph 1.\n- Look for a word describing the music industry's range of genres and regions.",
     "- Find the phrase about the industry in paragraph 1 that describes variety\n- Choose the one word that matches 'varied'\n- Quote it exactly",
     "1. 'Varied' means made up of different kinds.\n2. Paragraph 1 describes the industry as 'global and diverse'.\n3. The word that means the same as 'varied' is 'diverse'."),
    ("1.2.1", 2, "- Use your own words rather than copying from paragraph 2.\n- Look for figures and for words about interest in South African music.",
     "- Find the statistic about South Africa's share of regional earnings\n- Find what is said about interest in local music\n- Rewrite both reasons in your own words",
     "1. Reason one: South Africa makes up most of the regional market, contributing about 77% of earnings.\n2. Reason two: interest in South African music has grown beyond earlier levels.\n3. Each reason must be in your own words for the mark."),
    ("1.2.2", 2, "- Ask what kind of organisation the IFPI is.\n- Think about why a writer quotes an official source.",
     "- Identify the IFPI as an international industry body\n- State what its mention does for the statistics\n- Link this to how convincing the data seems",
     "1. The IFPI is a respected international body for the music industry.\n2. Naming it makes the data on South African music consumption more credible.\n3. Both points (the body's standing and the credibility it lends) earn the marks."),
    ("1.3.1", 2, "- Look at which two words are italicised and what each one names.\n- One is a title; think about what the other is.",
     "- Identify what 'Water' refers to\n- Identify what 'Amapiano' refers to\n- Explain why such words are set apart",
     "1. 'Water' is italicised because it is the title of a song.\n2. 'Amapiano' is italicised because it names a specific music genre / is a non-English word.\n3. Italics mark titles and foreign terms."),
    ("1.3.2", 2, "- Re-read what the paragraph says about the award category and the winner.\n- More than one valid reason is possible.",
     "- Find what is special about this Grammy win\n- Link it to South African music's reputation\n- State one clearly explained point",
     "1. One valid reason: it was the first time the award was presented in this category and a young South African woman won it.\n2. Another: it highlights the growing international influence of South African music.\n3. Any one of the accepted reasons, clearly explained, earns both marks."),
    ("1.4.1", 2, "- 'Making waves' is figurative: think about what waves do.\n- Use the rest of the sentence to see what had already happened.",
     "- Explain the idiom in plain words\n- Link it to what happened before 'Water' was released\n- Give two points",
     "1. 'Making waves' means creating an impact or getting noticed.\n2. Tyla's music was already having an effect on listeners before her hit single 'Water' was released.\n3. Both points are needed for two marks."),
    ("1.4.2", 2, "- Look at which cities are listed and where they are in the world.\n- Ask what the list proves about her listeners.",
     "- Note that the cities are on different continents\n- Link the list to the spread of her audience\n- State the point the writer is proving",
     "1. The cities named are in Africa and in other parts of the world.\n2. The writer uses them as evidence that Tyla's music is enjoyed internationally.\n3. So the mention of cities proves her global popularity."),
    ("1.5.1", 1, "- Look at how 'barriers' is used in the sentence about music rising above them.\n- Try each option in place of the word.",
     "- Read the sentence in context\n- Replace 'barriers' with each option\n- Choose the one that keeps the meaning",
     "1. Music that rises above 'national and global barriers' overcomes things that stand in its way.\n2. The word that fits is 'difficulties'.\n3. 'Predictions', 'allowances' and 'foundations' do not mean obstacles, so they are wrong."),
    ("1.5.2", 2, "- Find Christel Kayibi's name in paragraph 5.\n- Look for what she says drives growth and creativity.",
     "- Locate her statement\n- Pick out the two things she names as the driving force\n- State them briefly",
     "1. Kayibi says a rich blend of genres is behind the creativity.\n2. She also names a blend of cultures.\n3. The two points are a mixture of music types and a mixture of cultures."),
    ("1.6", 2, "- Paragraph 6 describes what record companies now do for artists.\n- Answer in your own words, not by copying.",
     "- Find the 'deliberate strategies' in paragraph 6\n- Identify what the companies do with artists\n- Give two changes in your own words",
     "1. Companies now use deliberate strategies to involve artists, for example partnerships and collaboration.\n2. They also support artists so that they build lasting careers (mentoring and developing them).\n3. Any two of these, in your own words, earn the marks."),
    ("1.7", 1, "- Paragraph 7 is about streaming services and independent artists.\n- The lesson is something other artists can act on.",
     "- Find the sentence linking Tyla's breakthrough to streaming\n- Turn it into a lesson for other artists",
     "1. Paragraph 7 says her breakthrough underlines how critical streaming has become to artistic success.\n2. So other artists can learn that being present on streaming platforms is key to success."),
    ("1.8", 2, "- Decide your view first, then support it with a reason.\n- A bare 'yes' or 'no' earns no mark.",
     "- State your opinion\n- Give a reason linked to the extract's ideas\n- Support it with a short explanation",
     "1. Yes: promoting South African music abroad can showcase local culture and open economic opportunities for artists.\n2. No: international exposure may erode cultural identity and artists should be supported at home.\n3. Either view earns marks when it is substantiated."),
    ("1.9", 2, "- Think about what 'explodes' suggests and whether the article supports it.\n- Both a yes and a no answer can be right if explained.",
     "- Decide whether the title fits the article's content\n- Comment on the word 'explodes'\n- Substantiate with a detail from the article",
     "1. Suitable: the article shows massive growth for South African music abroad and 'explodes' conveys that impact.\n2. Not suitable: the article also covers streaming and only a few artists, and 'explodes' can suggest destruction.\n3. Give reasons for either view to earn the marks."),
    ("1.10", 2, "- Compare the percentages shown for each future plan in TEXT B.\n- Your answer needs the number to back it up.",
     "- Find the plan with the highest percentage\n- Name it\n- Quote the percentage as evidence",
     "1. The highest figure in the visuals is 39%.\n2. That figure belongs to academic studies.\n3. So the most popular plan is to pursue academic studies, as shown by the highest percentage."),
    ("1.11", 2, "- Read '12% FIND WORK' next to the other options in the graphic.\n- Ask what a small figure suggests about employment.",
     "- Interpret what the figure says about work\n- Compare it with the other plans\n- State what the writer suggests",
     "1. Only 12% plan to find work, so work is not the main plan.\n2. This suggests there are other options for learners to consider.\n3. It also suggests that there are limited employment opportunities."),
    ("1.12", 2, "- Look at visual 3 and the plan it sits next to.\n- Decide whether it adds meaning to the graphic.",
     "- Describe what visual 3 shows\n- Link it to the plan it illustrates\n- Give a reasoned verdict",
     "1. Visual 3 depicts a phone and a book near the 'gap year' option.\n2. It is relevant if you argue that a gap year includes activities like these.\n3. It is not relevant if you argue the images do not link to a gap year; either view needs a reason."),
]
LESSONS[1] = dict(
    name="Question 1: Comprehension", marks=30, tags=["comprehension", "literal_comprehension", "inferential_reading", "diction"],
    q=3, memo=3, supp=[("Text A", ["annexure_text_a_1", "annexure_text_a_2"]), ("Text B", ["annexure_text_b_1"])],
    questions=Q, ai=AI1,
    header="""DBE English FAL P1 — November 2025 — Question 1: Comprehension (order 1)
 * TEXT A: article on South African music's global growth through streaming. TEXT B: infographic
 * 'Grade 12's future plans'. Practice set mirrors the text-extractable sub-questions (1.1–1.9: false
 * statement, synonym in text, stated reasons, purpose of a source, italics, expressions, title) with
 * fresh stimulus on the same theme (LANG-EX-01/02, DESIGN-UNI-01). 1.10–1.12 depend on the TEXT B
 * graphic and are skipped for practice (LANG-EX-03); aiExplanation covers every real sub-question
 * 1.1.1–1.12 with its real marks (AIEXP-08).""",
)

# ───────────────────────── Q2 Summary ─────────────────────────
Q = []
Q.append(q(1, "summary", "main_vs_supporting_points", "select_main_points", ["select_relevant_points"],
           "The passage lists ways to prepare for a new institution. Select the THREE sentences that are ways to prepare.",
           ["Learn your way around the campus before classes start.", "Save money each month for textbooks and transport.",
            "Many first-year students feel nervous at the start.", "Join a study group in your first week.",
            "Some institutions were founded more than a century ago."],
           ["Learn your way around the campus before classes start.", "Save money each month for textbooks and transport.",
            "Join a study group in your first week.", "", ""],
           "multi_select", 3, 3,
           "- A way to prepare is an action a student can take.\n- Sentences that only describe or give background are not ways to prepare.",
           context_text="Starting at a new institution is easier when you plan ahead. Learn your way around the campus before classes start. Save money each month for textbooks and transport. Many first-year students feel nervous at the start, and some institutions were founded more than a century ago. Join a study group in your first week so that you are not studying alone."))
o, a = mc(["Define clear academic goals for your first year.",
           "Decide what you want to achieve in your studies during your first year.",
           "Write down your timetable for the whole year.",
           "Set goals for your social life in your first year."], 1)
Q.append(q(2, "summary", "paraphrase_and_own_words", "best_paraphrase", ["rewrite_in_own_words"],
           "Which ONE sentence best expresses the meaning of the sentence below in your OWN words?",
           o, a, "multiple_choice", 2, 3,
           "- The best rewording keeps the meaning but changes the words.\n- Watch for options that copy the original or change what it means.",
           context_text="Define clear academic goals for your first year."))
m, a = fitb("Point number:", "3")
Q.append(q(3, "summary", "main_vs_supporting_points", "repeated_points", ["identify_repeated_point"],
           "Which numbered point repeats the idea in point 1? Write only the number.", m, a, "fitb", 2, 2,
           "- Decide what point 1 is really about, ignoring the exact words.\n- Look for the point that says the same thing differently.",
           context_text="1. Pack your stationery and laptop.\n2. Pay your registration fees early.\n3. Make sure you have the equipment you need for your studies.\n4. Visit the library to learn about its services."))
o, a = mc(["Register early and find accommodation.", "Registering, accommodation.",
           "Find suitable accommodation before the term starts.",
           "Register early, and then, when that is done, find accommodation and pay fees."], 2)
Q.append(q(4, "summary", "point_form_conventions", "one_point_per_sentence", ["apply_point_form_rules"],
           "A summary must be written in point form: ONE point per sentence, in a full sentence. Which ONE sentence follows these instructions?",
           o, a, "multiple_choice", 2, 2,
           "- Count the separate ideas in each option.\n- A fragment is not a full sentence."))

AI2 = [("2", 10,
        "- Find the actions the writer tells learners to take, one per paragraph or sentence.\n- Ignore advice that only repeats an earlier action.",
        "- Underline each action in TEXT C (requirements, funding, fees, housing, documents, items, services, goals, time management)\n- Choose seven distinct actions\n- Rewrite each as one full sentence in your own words, with a word count at the end",
        "1. Accepted points include: explore course requirements; consider how to fund studies; pay registration fees; find accommodation; have documents ready; obtain necessary items; explore student services; set academic goals; improve time management.\n2. Seven of these nine earn one mark each (7 marks).\n3. Three marks are for language: 1–3 correct points earn 1, 4–5 earn 2, 6–7 earn 3, and copying sentences word for word loses language marks.\n4. Write seven numbered sentences, one point each, within 70 words.")]
LESSONS[2] = dict(
    name="Question 2: Summary", marks=10, tags=["summary", "paraphrase", "main_points"],
    q=1, memo=2, supp=[("Text C", ["annexure_text_c_1"])], questions=Q, ai=AI2,
    header="""DBE English FAL P1 — November 2025 — Question 2: Summary (order 2)
 * TEXT C: how to prepare for tertiary education (list SEVEN points, ≤70 words). Practice tests the
 * sub-skills — selecting valid points, paraphrase, spotting repeated points, point-form conventions —
 * not the written summary (LANG-SEC-02). aiExplanation: one entry for the whole question, 10 marks.""",
)

# ───────────────────────── Q3 Advertisement ─────────────────────────
AD = "NEW & IMPROVED! SPARKLE PLUS dishwashing liquid. Now with TRI-POWER cleaning. Cuts grease fast. Protects your family's hands. Fresh lemon scent."
Q = []
o, a = mc(["the need to save money", "the need for a clean, hygienic home", "the need to travel", "the need for entertainment"], 1)
Q.append(q(1, "visual_texts", "advertising_language", "appeal_to_need", ["identify_need_appealed_to"],
           "Which need does the advertiser mainly appeal to?", o, a, "multiple_choice", 2, 2,
           "- Think about what a dishwashing product is for.\n- Ask what the reader would fear or want to avoid.", context_text=AD))
o, a = mc(["to form the plural of 'family'", "to replace missing letters", "to introduce a quotation",
           "to show that the hands belong to the family"], 3)
Q.append(q(2, "language", "punctuation_and_spelling", "apostrophe_of_possession", ["identify_apostrophe_function"],
           "What is the function of the apostrophe in 'family's' in the advertisement?", o, a, "multiple_choice", 2, 2,
           "- Read the phrase aloud: whose hands are protected?\n- Compare the apostrophe's job here with its job in contractions.",
           context_text="Protects your family's hands."))
m, a = fitb("Meaning:", "three")
Q.append(q(3, "language", "word_level_vocabulary", "prefix_meaning", ["explain_prefix_meaning"],
           "The prefix 'tri' in 'TRI-POWER' means …", m, a, "fitb", 2, 2,
           "- Think of other words that begin with 'tri', such as 'triangle' and 'tricycle'.\n- Write the number the prefix stands for as a word.",
           context_text="Now with TRI-POWER cleaning."))
Q.append(q(4, "visual_texts", "advertising_language", "persuasive_devices", ["identify_persuasive_devices"],
           "Select the TWO ways in which the advertiser tries to persuade the reader to buy the product.",
           ["The words 'NEW & IMPROVED' suggest that the product is better than before.",
            "The slogan 'Protects your family's hands' appeals to the reader's care for the family.",
            "The advertisement lists the ingredients in scientific terms.",
            "The advertisement compares its price with three rival brands.",
            "The advertisement includes a map showing where to buy the product."],
           ["The words 'NEW & IMPROVED' suggest that the product is better than before.",
            "The slogan 'Protects your family's hands' appeals to the reader's care for the family.", "", "", ""],
           "multi_select", 3, 3,
           "- Only choose features that actually appear in the advertisement.\n- Persuasion often works through words that suggest an advantage or an emotion.",
           context_text=AD))
AI3 = [
    ("3.1", 1, "- Think about what the product does and what it protects against.\n- The need is about health or cleanliness.",
     "- Identify what the product claims to do\n- Link this to a need of the buyer\n- Name the need",
     "1. The product promises protection against germs.\n2. The advertiser therefore appeals to the need to avoid the spread of germs / to be clean."),
    ("3.2", 1, "- Think about what 'improved' suggests compared with other brands.\n- Consider the advertiser's goal.",
     "- Say what the word implies about the product\n- Link it to competition or persuasion",
     "1. 'IMPROVED' creates a competitive advantage over other products.\n2. It suggests advancement of the product and helps to convince the reader to buy it. Any one valid reason earns the mark."),
    ("3.3.1", 1, "- Look at where the apostrophe sits in 'family's'.\n- Ask what relationship it shows.",
     "- Locate the apostrophe\n- Say what the 's' stands for",
     "1. The apostrophe shows possession: the skin belongs to the family."),
    ("3.3.2", 2, "- Describe what the visual shows above the words.\n- Link what you see to the word 'family'.",
     "- Describe the visual\n- Connect it to the idea of the whole family using the product\n- Mention the feeling it suggests",
     "1. The visual shows the whole family, which suggests the product is safe for everyone.\n2. The heart suggests the family loves the product. Both points earn the two marks."),
    ("3.4", 1, "- Break the word 'multivitamins' into 'multi' and the rest.\n- Think of words such as 'multicoloured'.",
     "- Isolate the prefix\n- Compare it with other 'multi' words\n- Choose the meaning that fits",
     "1. 'Multi' means many, as in multicoloured.\n2. 'Few', 'none' and 'some' do not give the idea of a large number, so they are wrong.\n3. The answer is D, many."),
    ("3.5", 2, "- Think about what a shield does and what is shown inside it.\n- Connect the blank space to the claim beside it.",
     "- Describe the shield's usual meaning\n- Explain why it is blank\n- Link it to the 100% protection claim",
     "1. A shield protects, so it suggests the soap defends you against germs.\n2. The blank shield also suggests an absence of germs, matching the claim of 100% protection.\n3. Either idea, explained, earns the two marks."),
    ("3.6", 2, "- Decide whether the advertisement is convincing, then justify.\n- Refer to specific features such as the words, the visuals and the claims.",
     "- State your view\n- Give a reason referring to the claims or visuals\n- Support it with a detail",
     "1. Yes: the claim of scientific improvement and the happy family make the product seem credible and desirable.\n2. No: 'new and improved' is an overused claim, and no evidence is provided for the benefits.\n3. A bare yes or no earns nothing; a substantiated view earns the marks."),
]
LESSONS[3] = dict(
    name="Question 3: Analysing an Advertisement", marks=10, tags=["advertising", "advertising_language", "media_analysis"],
    q=1, memo=2, supp=[("Text D", ["annexure_text_d_1", "annexure_text_d_2"])], questions=Q, ai=AI3,
    header="""DBE English FAL P1 — November 2025 — Question 3: Analysing an Advertisement (order 3)
 * TEXT D: Lifebuoy advertisement (visual, with a packaging-text note). Practice uses fresh written ad
 * copy as context_text on the same theme (hygiene / family protection), text-extractable sub-questions
 * only (3.1–3.4, 3.6 type); 3.3.2 and 3.5 depend on the visuals and are skipped (LANG-EX-03). aiExplanation
 * covers all real sub-questions 3.1–3.6 with real marks (AIEXP-08).""",
)

# ───────────────────────── Q4 Cartoon ─────────────────────────
Q = []
o, a = mc(["a question", "a statement", "a command", "a reprimand"], 2)
Q.append(q(1, "language", "sentence_construction", "sentence_types", ["identify_sentence_type"],
           "'Thabo, come and look at this!' is an example of a …", o, a, "multiple_choice", 2, 2,
           "- Decide whether the speaker is asking, telling a fact or telling someone to do something.\n- A reprimand also scolds; check the tone of the words.",
           context_text="[Frame 1] Lerato (speech bubble): 'Thabo, come and look at this!'"))
Q.append(q(2, "visual_texts", "cartoon_analysis", "speech_and_thought_bubbles", ["explain_cartoon_conventions"],
           "Match each cartoon feature to what it shows.",
           ["A - a speech bubble", "B - a thought bubble", "C - capital letters",
            "1 - what a character thinks but does not say", "2 - a loud or excited voice", "3 - what a character says aloud"],
           ["A-3", "B-1", "C-2", "", ""], "match", 2, 2,
           "- Bubbles show how words reach the reader; think about who can 'hear' them.\n- Changes in letter style show how something is said.",
           context_text="[Frame 2] Thabo (thought bubble): 'Not another one of her ideas...'\n[Frame 3] Lerato (speech bubble): 'I'm going to be a SINGING STAR!'"))
o, a = mc(["Famous singers were recording their songs in studios.", "Famous singers have recorded their songs in studios.",
           "Their songs recorded famous singers in studios.", "Their songs are recorded in studios by famous singers."], 3)
Q.append(q(3, "language", "passive_and_reported_speech", "passive_voice", ["change_to_passive_voice"],
           "Which sentence is the passive voice of the sentence in the extract?", o, a, "multiple_choice", 3, 3,
           "- In the passive voice the object of the active sentence becomes the subject.\n- Keep the same tense as the original.",
           context_text="[Frame 6] Lerato: 'Famous singers record their songs in studios.'"))
Q.append(q(4, "visual_texts", "cartoon_analysis", "creating_humour", ["explain_how_humour_is_created"],
           "Select the TWO statements that best explain how humour is created in these frames.",
           ["Lerato's excitement is contrasted with Thabo's private thought, which reveals the truth.",
            "The capital letters show that Lerato is carried away by her imagination.",
            "The cartoon is humorous because it describes a real concert.",
            "Thabo is shown to be angry at the pigeons.",
            "The fans are described in a serious news report."],
           ["Lerato's excitement is contrasted with Thabo's private thought, which reveals the truth.",
            "The capital letters show that Lerato is carried away by her imagination.", "", "", ""],
           "multi_select", 3, 3,
           "- Humour often comes from a gap between what is said and what is true.\n- Check each option against the words in the frames.",
           context_text="[Frame 7] Lerato (speech bubble, shouting): 'FANS! I can hear my FANS!'\n[Frame 8] Thabo (thought bubble): 'That is a flock of pigeons.'"))
AI4 = [
    ("4.1", 1, "- Look at what is in front of Garfield in Frame 1.\n- Think about what these items suggest about his eating habits.",
     "- Describe what is in front of Garfield\n- Link it to health-consciousness",
     "1. Garfield has two trays of junk or fast food in front of him.\n2. This shows he is not health-conscious."),
    ("4.2", 1, "- Decide what Jon wants Garfield to do.\n- Compare a command with a question or statement.",
     "- Read the sentence in context\n- Decide what kind of act it is\n- Eliminate the wrong options",
     "1. 'Garfield, come here!' tells Garfield to do something, so it is a command.\n2. It is not a question or a plain statement, and it is not scolding, so B is right."),
    ("4.3", 2, "- Look at the shape of each bubble and who it belongs to.\n- One shows speech and the other something different.",
     "- Identify the two bubble types\n- Say what each represents",
     "1. The speech bubble shows that Jon is talking.\n2. The thought bubble shows that Garfield is thinking."),
    ("4.4", 2, "- Compare Garfield's eyes, paws and posture in the two frames.\n- You need a contrast, not two separate descriptions.",
     "- Describe Frame 4\n- Describe Frame 5\n- Make the contrast clear",
     "1. In Frame 4 his eyes are half closed and he sits relaxed; in Frame 5 his eyes are wide open.\n2. Other clear contrasts in paws or posture are also accepted; the contrast must be clear."),
    ("4.5", 1, "- Think about how the word would sound if it were spoken.\n- Consider Jon's mood.",
     "- Say what bold lettering suggests\n- Link it to Jon's feeling",
     "1. The bold lettering shows that Jon is excited and shouting."),
    ("4.6", 1, "- Move the object of the active sentence to the front.\n- Use 'are' plus the past participle and add 'by'.",
     "- Identify the subject and object\n- Switch them\n- Adjust the verb for the passive voice",
     "1. 'Famous people wear sunglasses' has 'sunglasses' as the object.\n2. In the passive voice this becomes 'Sunglasses are worn by famous people.'"),
    ("4.7", 2, "- Decide whether the cartoon is funny to you, then give reasons from the frames.\n- Consider Jon's idea and what happens to him.",
     "- State your opinion\n- Refer to what happens in the frames\n- Explain why that is or is not humorous",
     "1. Yes: it is funny that Jon thinks sunglasses will make him famous but the sunglasses make him fall into the manhole.\n2. No: it is not funny that he could hurt himself, and fame is not as simple as wearing sunglasses.\n3. A bare yes or no earns nothing; substantiate your view."),
]
LESSONS[4] = dict(
    name="Question 4: Analysing a Cartoon", marks=10, tags=["cartoons", "dialogue", "passive_voice"],
    q=2, memo=1, supp=[("Text E", ["annexure_text_e_1"])], questions=Q, ai=AI4,
    header="""DBE English FAL P1 — November 2025 — Question 4: Analysing a Cartoon (order 4)
 * TEXT E: Garfield cartoon (eight frames). Practice uses fresh written frame dialogue as context_text on
 * the same theme (wanting to be famous), text-extractable sub-questions only: sentence type, bubble
 * conventions, passive voice, creating humour (LANG-SEC-04). 4.1, 4.4 and 4.5 depend on the drawings
 * and are skipped (LANG-EX-03). aiExplanation covers all real sub-questions 4.1–4.7 (AIEXP-08).""",
)

# ───────────────────────── Q5 Language ─────────────────────────
Q = []
m, a = fitb("Corrected word:", "is")
Q.append(q(1, "language", "concord", "subject_verb_concord", ["correct_concord_error"],
           "Correct the SINGLE concord error in the sentence. Write only the corrected word.", m, a, "fitb", 2, 3,
           "- Find the subject of the sentence and decide whether it names one thing or several.\n- Check that the verb agrees with the subject.",
           context_text="Each of the rangers are trained to handle emergencies."))
m, a = fitb("Missing words:", "wasn't it|was it not")
Q.append(q(2, "language", "sentence_construction", "tag_questions", ["complete_tag_question"],
           "Complete the tag question. Write down only the missing words.", m, a, "fitb", 2, 2,
           "- A tag question uses the opposite of the main sentence: positive becomes negative.\n- The tag repeats the verb and refers back to the subject with a pronoun.",
           context_text="The trail was closed after the storm, ...?"))
m, a = fitb("Correct form:", "shorter")
Q.append(q(3, "language", "parts_of_speech", "degrees_of_comparison", ["use_degrees_of_comparison"],
           "Provide the correct degree of comparison of the word in brackets.", m, a, "fitb", 2, 2,
           "- Notice the word 'than': it signals a comparison of two things.\n- For a short adjective, add the ending used for the comparative degree.",
           context_text="This route is (short) than the old one."))
Q.append(q(4, "language", "parts_of_speech", "identify_part_of_speech", ["identify_parts_of_speech"],
           "State the part of speech of each word as used in the sentence.",
           ["A - old", "B - slowly", "C - through", "1 - adverb", "2 - preposition", "3 - adjective"],
           ["A-3", "B-1", "C-2", "", ""], "match", 2, 2,
           "- Ask what each word does: describes a noun, describes a verb, or shows a relationship.\n- A word's function in the sentence decides its part of speech.",
           context_text="The old guide walked slowly through the gate."))
o, a = mc(["more tourists would visited it.", "more tourists will visit it.", "more tourists visited it.",
           "more tourists would have visited it."], 1)
Q.append(q(5, "language", "modals_and_conditionals", "first_conditional", ["complete_conditional_sentence"],
           "Choose the correct ending to complete the conditional sentence: 'If the reserve offers cheaper tickets, …'",
           o, a, "multiple_choice", 3, 3,
           "- The 'if' clause is in the simple present, so the possibility is real.\n- Match the main clause to the pattern for a real possibility.",
           context_text="Many tourists visit the reserve in winter."))
o, a = mc(["The ranger said that we will close the gates at six.", "The ranger said that they will close the gates at six.",
           "The ranger said that they would close the gates at six.", "The ranger said that we would close the gates at six."], 2)
Q.append(q(6, "language", "passive_and_reported_speech", "reported_statements", ["change_to_reported_speech"],
           "Which sentence is the correct reported speech of the sentence in the extract?", o, a, "multiple_choice", 3, 3,
           "- Reported speech moves the verb one step back in time.\n- Pronouns change to fit the person reporting.",
           context_text="'We will close the gates at six,' said the ranger."))
m, a = fitb("Word:", "decade")
Q.append(q(7, "language", "word_level_vocabulary", "one_word_for_phrase", ["use_one_word_for_phrase"],
           "Give ONE word for the phrase 'a period of ten years'.", m, a, "fitb", 2, 2,
           "- Think of a word you could use to count years in groups.\n- You need a single word.",
           context_text="The park has been open for a period of ten years."))
AI5 = [
    ("5.1.1(a)", 1, "- Read the sentence and find a word that is spelled almost like a different word.\n- Think about what the park event offers.", "- Find the word that does not fit the meaning\n- Replace it with the correct word", "1. 'Excess' is the wrong word: the event offers free admission.\n2. The correct word is 'access'."),
    ("5.1.1(b)", 1, "- Look at the preposition after 'promotion'.\n- Ask which preposition normally follows this noun.", "- Check the word after 'promotion'\n- Replace it with the preposition that fits", "1. 'Promotion for conservation' is incorrect.\n2. The correct preposition is 'of'."),
    ("5.1.1(c)", 1, "- Find the subject of the sentence and decide if it is singular or plural.\n- Compare it with the verb.", "- Identify the subject: two things joined\n- Decide on the verb form", "1. 'Cultural heritage and biological diversity' is plural.\n2. The verb must be 'are', not 'is'."),
    ("5.1.1(d)", 1, "- One word in this sentence is misspelled.\n- Check the long word at the end.", "- Find the misspelled word\n- Write it correctly", "1. 'Enviroment' is spelled incorrectly.\n2. The correct spelling is 'environment'."),
    ("5.1.2", 1, "- Look at the verb and the tense of the main sentence.\n- The tag uses the opposite polarity.", "- Identify the verb 'was'\n- Make the tag negative", "1. The main sentence is positive, so the tag is negative.\n2. The answer is 'wasn't it' (or 'was it not')."),
    ("5.1.3", 1, "- Look at the word 'than' that follows.\n- Add a degree of comparison for a longer adjective.", "- Recognise a comparison between two times\n- Use 'more' with the adjective", "1. 'Than' signals the comparative degree.\n2. For 'popular' the comparative is 'more popular'."),
    ("5.1.4", 1, "- Identify the underlined noun.\n- Change its ending for more than one.", "- Identify the noun\n- Apply the rule for words ending in a consonant plus y", "1. 'Community' ends in a consonant plus y.\n2. The plural is 'communities'."),
    ("5.1.5", 1, "- Find a word with a similar meaning to 'encourage'.\n- It must fit the sentence grammatically.", "- Understand the underlined word\n- Choose a synonym that fits", "1. 'Encourage' means to give support or confidence.\n2. Suitable synonyms are 'motivate', 'inspire' or 'urge'."),
    ("5.1.6", 2, "- Consider what each underlined word does in the sentence.\n- One describes a noun; the other shows a relationship.", "- Look at 'national' before 'parks'\n- Look at 'to' before the verb phrase\n- State the part of speech for each", "1. 'National' describes 'parks', so it is an adjective.\n2. 'To' links to a place or relationship here: it is a preposition."),
    ("5.1.7", 1, "- The 'if' clause states a real possibility.\n- Complete it with the likely result.", "- Use the first conditional pattern\n- State a result linked to the sentence before", "1. A first conditional uses a present tense 'if' clause and 'will' in the result.\n2. Example: '…then many adventurers will visit.'"),
    ("5.1.8", 3, "- Change the pronoun and the verb tense as needed.\n- Do not forget the correct punctuation.", "- Identify the reporting verb\n- Change 'I am' to the third person\n- Check punctuation", "1. The minister says that she is pleased to note the success of National Parks Week.\n2. Or in the past tense: said that she was pleased.\n3. One mark each for the change of pronoun and verb, and one for punctuation."),
    ("5.2.1", 2, "- You must start with 'Apart from'.\n- Join the two benefits of setting your mind free.", "- Start with 'Apart from' plus an -ing form\n- Keep both ideas\n- Check that the sentence is complete", "1. Example: 'Apart from allowing you to explore new ideas, setting your mind free also helps you overcome self-doubt.'\n2. The other order is also accepted."),
    ("5.2.2", 1, "- A homonym sounds and is spelled the same but has a different meaning.\n- 'Mind' can be a verb as well as a noun.", "- Think of another meaning of 'mind'\n- Use it correctly in a sentence", "1. In the extract 'mind' means the brain.\n2. As a verb it means to care or be careful, e.g. 'Children must mind their manners.'"),
    ("5.2.3", 1, "- Think of how birds are described when they fly together.\n- Test each option as a collective noun.", "- Recall collective nouns for animals\n- Match 'birds' with the right one", "1. A group of birds is a flock.\n2. 'Pride' is for lions, and 'crowd' and 'swarm' are for people and insects, so they are wrong."),
    ("5.2.4", 1, "- Count the weeks in the phrase.\n- Find a single word that means this period.", "- Interpret the phrase\n- Choose the one word that means the same", "1. 'Every two weeks' is a fortnight.\n2. The answer is 'fortnight'."),
    ("5.2.5", 1, "- The brackets give the base word.\n- The sentence needs an adjective after 'is'.", "- Identify the part of speech needed\n- Form it from the base word", "1. After 'is' we need an adjective.\n2. The adjective from 'benefit' is 'beneficial'."),
]
LESSONS[5] = dict(
    name="Question 5: Language and Editing Skills", marks=20, tags=["grammar_editing", "editing", "parts_of_speech", "reported_speech"],
    q=4, memo=1, supp=[("Text F", ["annexure_text_f_1"]), ("Text G", ["annexure_text_g_1"])], questions=Q, ai=AI5,
    header="""DBE English FAL P1 — November 2025 — Question 5: Language and Editing Skills (order 5)
 * TEXT F: National Parks Week passage with deliberate errors. TEXT G: 'Set your mind free!' poster.
 * Practice mirrors the grammar skills tested (concord, tag question, degrees of comparison, parts of
 * speech, conditional, reported speech, one word for a phrase) on a fresh national-parks theme
 * (LANG-SEC-05, LANG-EX-01/02). aiExplanation covers every real sub-question 5.1.1(a)–5.2.5 with real
 * marks (AIEXP-08).""",
)

# ───────────────────────── emit ─────────────────────────
TAIL = open(os.path.join(ROOT, "scripts/add-english-hl-2025-nov-p1-q1.js")).read()
TAIL = TAIL[TAIL.index("// ─── Upload ─"):]


def js(v):
    return json.dumps(v, ensure_ascii=False, indent=2)


def indent(s, n):
    pad = " " * n
    return "\n".join(pad + l if i else l for i, l in enumerate(s.split("\n")))


for n, L in LESSONS.items():
    fname = f"add-english-fal-2025-nov-p1-q{n}.js"
    base = f"{BASE}/q{n}"
    supp = [dict(type="annexure", label=lab, image_urls=[f"{base}/{f}.png" for f in files]) for lab, files in L["supp"]]
    video = dict(name=L["name"], syllabus="dbe", subject="english_fal", year=2025, paper="nov_p1", order=n,
                 content_tier="free", has_video=False, xp=50, tags=L["tags"],
                 question_image_urls=[f"{base}/question_{i}.png" for i in range(1, L["q"] + 1)],
                 memo_image_urls=[f"{base}/memo_{i}.png" for i in range(1, L["memo"] + 1)],
                 exam_question_marks=L["marks"], supplementary_materials=supp)
    qs = []
    for x in L["questions"]:
        d = dict(xp=10, syllabus="dbe", subject="english_fal", year=2025, paper="nov_p1", name=f"Question {x['order']}")
        d.update(x)
        qs.append(d)
    ai = dict(sub_questions=[dict(number=num, marks=m_, clues=c, approach=ap, solution=so) for num, m_, c, ap, so in L["ai"]],
              model="claude-sonnet-5-5", generated_at="__NOW__", version=2, reviewed=False, input_tokens=0, output_tokens=0,
              avg_rating=None, rating_count=None)
    ai_js = js(ai).replace('"__NOW__"', "Date.now()")
    body = f"""#!/usr/bin/env node
/**
 * {L['header']}
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video. Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *   node tools/validate-questions.js --script scripts/{fname} --curriculum temp/curriculum-vocab-english-fal.json
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

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {js(video)};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = {js(qs)};

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {ai_js};

{TAIL}"""
    body = body.replace("const video = {", "const video = {", 1)
    open(os.path.join(ROOT, "scripts", fname), "w").write(body)
    print("wrote", fname, len(qs), "questions,", len(L["ai"]), "ai entries")

# seed additions
seed = json.load(open(os.path.join(ROOT, "tools/seeds/english-fal-curriculum.json")))
subs = {}
skills = {}
for L in LESSONS.values():
    for x in L["questions"]:
        subs.setdefault((x["unit"], x["topic"]), set()).add(x["subtopic"])
        for s in x["skills"]:
            skills[s] = s[len("english_fal_"):].replace("_", " ").capitalize()
for u in seed["units"]:
    for t in u["topics"]:
        st = sorted(subs.get((u["slug"], t["slug"]), []))
        if st:
            t["subtopics"] = [dict(slug=s, name=s.replace("_", " ").title()) for s in st]
seed["skills"] = [dict(id=k, name=v) for k, v in sorted(skills.items())]
json.dump(seed, open(os.path.join(ROOT, "tools/seeds/english-fal-curriculum.json"), "w"), indent=2, ensure_ascii=False)
print(len(skills), "skills,", sum(len(v) for v in subs.values()), "subtopics")
