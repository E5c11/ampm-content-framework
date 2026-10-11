#!/usr/bin/env python3
"""English FAL Nov 2024 Paper 3 generator (essay + 7 transactional texts). Conventions-based fresh scenarios (LANG-WR-03)."""
import json
from fal2024_common import *  # noqa

PAPER = "nov_p3"
LS = []
seedp = ROOT + "/tools/seeds/english-fal-curriculum.json"
seed = json.load(open(seedp))
for u in seed["units"]:
    if u["slug"] == "transactional_writing":
        have = {t["slug"] for t in u["topics"]}
        for slug in ("obituary", "poster"):
            if slug not in have:
                u["topics"].append(dict(slug=slug, name=slug.title()))
json.dump(seed, open(seedp, "w"), indent=2, ensure_ascii=False)

counts = json.load(open("/tmp/claude-1000/fal24_p3_counts.json"))


def add(order, name, marks, tags, header, questions, ai):
    c = counts[str(order)]
    LS.append(dict(order=order, name=name, marks=marks, q=c["q"], m=c["m"], tags=tags, questions=questions, ai=ai, header=header))


T = "transactional_writing"
# ───────── Q1 Essay ─────────
U = "essay_writing"
q = []
o, a = mc("Endless choice breeds anxiety, so having fewer options can make people happier.",
          ["In this essay I will talk about choices.", "Choices are a big part of life and everybody makes them.", "Many people have different opinions about choices."])
q.append(Q(1, U, "planning_and_structure", "thesis_statement", ["apply_planning_steps"],
           "For the argumentative topic 'More choice makes people less happy', which sentence is the STRONGEST thesis statement?", o, a, "multiple_choice", 2, 2,
           "- A strong thesis takes a clear stand and gives a reason.\n- Reject sentences that only announce the topic.", None, "C: CAPS §3.3 argumentative writing — a specific viewpoint."))
mm, a = order5(["Exposition: the narrator is introduced", "Rising action: a problem grows", "Climax: the problem reaches its peak", "Resolution: the story ends"], [2, 0, 3, 1])
q.append(Q(2, U, "planning_and_structure", "narrative_structure", ["order_events"],
           "Arrange the stages of a narrative essay in the order in which they occur.", mm, a, "ordering", 2, 2,
           "- A story must be set up before the problem grows.\n- The ending comes last.", None, "M: memo — narrative essay needs a strong storyline and interesting ending."))
o, a = ms(["It is told with a strong storyline and an interesting ending.", "It makes a clear link to the picture when a picture is used."],
          ["It must be written in the second person.", "It must be exactly 500 words long."])
q.append(Q(3, U, "picture_prompts", "responding_to_a_picture", ["respond_to_picture_prompt"],
           "Select the TWO things that are true of a good essay answer.", o, a, "multi_select", 2, 2,
           "- Check each option against the marker's instructions.\n- One option names a length that the paper does not set.", None, "M/P: memo features and the paper's picture instruction."))
o, a = match([("narrative essay", "tells a story with a strong ending"), ("descriptive essay", "paints a picture using the senses"),
              ("argumentative essay", "defends a specific viewpoint with arguments")])
q.append(Q(4, U, "essay_types", "features_of_essay_types", ["match_essay_types_to_features"],
           "Match each type of essay to the feature the marker expects.", o, a, "match", 2, 2,
           "- Think about what each type is meant to do for the reader.\n- Start with the type you know best.", None, "M: memo feature list."))
m, a = fitb("Words:", "250")
q.append(Q(5, U, "language_style_and_editing", "length_of_the_essay", ["recall_task_requirements"],
           "What is the minimum number of words for the essay in this paper? Write the number.", m, a, "fitb", 1, 1,
           "- The paper gives a range.\n- Write digits only.", None, "P: 250–300 words."))
o, a = mc("Show the reader how a character feels through what he or she does.", ["Tell the reader every feeling in one sentence.", "Avoid dialogue and description.", "Use only very short words."])
q.append(Q(6, U, "language_style_and_editing", "show_dont_tell", ["apply_planning_steps"],
           "Which advice describes 'show, don't tell' in narrative writing?", o, a, "multiple_choice", 3, 3,
           "- A character's actions can reveal feelings.\n- Reject advice that removes detail.", None, "C: CAPS §3.3 — word choice, voice."))
ESS = [
 ("1.1", ["It's my life …"]), ("1.2", ["Small steps; big changes"]), ("1.3", ["Allow your silence to speak for you."]),
 ("1.4", ["That was unexpected!"]), ("1.5", ["'Comparison is the thief of joy.' – Theodore Roosevelt"]),
]
types = {"1.1": "narrative, reflective, descriptive, discursive or argumentative", "1.2": "discursive, argumentative, narrative, reflective or descriptive",
         "1.3": "discursive, reflective, descriptive, argumentative or narrative", "1.4": "narrative, descriptive, reflective, discursive or argumentative",
         "1.5": "discursive, argumentative, reflective, narrative or descriptive"}
AI = []
for num, title in ESS:
    AI.append((num, 50, ["Decide what the topic means to you before choosing a type of essay."],
               ["Choose a type; mixed types are accepted if relevant", "Plan beginning, middle and end", "Keep to 250–300 words"],
               [f"1. The memo lists {types[num]} responses as acceptable for '{title[0]}'.", "2. Each type must show its features: narrative needs a strong storyline and interesting ending; reflective conveys feelings; descriptive uses the senses; discursive balances both sides; argumentative defends a view.", "3. The essay is marked on content and planning (30), language, style and editing (15) and structure (5)."]))
for num, pic, lit, fig in [("1.6", "a child on a swing", "playing, childhood", "innocence, being carefree"), ("1.7", "a robot cooking", "artificial intelligence, cooking", "the future, time travel"),
                          ("1.8", "a galloping horse", "a horse, transport", "strength, freedom")]:
    AI.append((num, 50, ["Look closely at the picture and decide what it shows and what it might stand for."], ["Choose a type", "Give your own title", "Link your essay clearly to the picture"],
               [f"1. The picture shows {pic}: literal readings include {lit}; figurative readings include {fig}.", "2. Any essay type and any suitable tense is accepted, provided the link to the picture is clear and the essay has a suitable title."]))
add(1, "Question 1: Essay", 50, ["essay_structure", "planning", "creative_writing", "argumentative_writing"],
    "Question 1: Essay (order 1) — eight topics (1.1–1.5 written prompts, 1.6–1.8 pictures: child on a swing, robot cooking, galloping horse), 250–300 words, 50-mark rubric. Practice covers essay theory on fresh examples (LANG-WR-02).", q, AI)
LS[-1]["questions"] = [(x, b) for x, b in q]

# ───────── 2.1 Letter of application ─────────
U = T
q = []
o, a = ms(["the sender's address", "the date", "a subject line"], ["a postscript in capital letters", "an emoji at the top"])
q.append(Q(1, U, "formal_letter", "format_of_a_letter", ["identify_format_features"],
           "Select the THREE parts that must appear in a formal letter of application.", o, a, "multi_select", 1, 2,
           "- Think about what a reader needs to answer you and see when it was written.\n- Reject parts that do not belong to a formal letter.", None,
           "M: memo 2.1 lists sender's address, date, recipient, greeting, subject line, ending, signature."))
mm, a = order5(["Address of sender and date", "Recipient's name and address", "Greeting and subject line", "Introduction, body and conclusion", "Suitable ending and signature"], [3, 0, 4, 2, 1])
q.append(Q(2, U, "formal_letter", "format_of_a_letter", ["order_events"],
           "Arrange the parts of a formal letter in the order in which they appear.", mm, a, "ordering", 1, 2,
           "- The sender's details come first.\n- The signature comes last.", None, "M: memo 2.1 format list."))
o, a = mc("Dear Sir/Madam, I am writing to apply for the part-time post advertised in your window.",
          ["Hey boss, I want your job lol!", "To whom it may concern, bookshops are nice.", "Hi, I saw a sign, can I work there?"])
q.append(Q(3, U, "formal_letter", "register_and_tone", ["choose_appropriate_register"],
           "Which opening best suits a letter of application?", o, a, "multiple_choice", 2, 2,
           "- The tone must be formal and clear.\n- It should state the purpose of the letter.", None, "M: memo 2.1 'tone and register must be formal'."))
o, a = mc("Application for the part-time position of shop assistant", ["Job", "Please read this", "Hello!"])
q.append(Q(4, U, "formal_letter", "subject_line", ["write_subject_line"],
           "Which subject line best suits a letter applying for a job?", o, a, "multiple_choice", 2, 2,
           "- A subject line names the purpose in a few words.\n- It should be specific.", None, "M: memo 2.1 subject line."))
m, a = fitb("Word:", "conclusion")
q.append(Q(5, U, "formal_letter", "format_of_a_letter", ["identify_format_features"],
           "A letter must have an introduction, a body and a … Write one word.", m, a, "fitb", 1, 1,
           "- It is the last part of the letter's content.\n- Write one word.", None, "M: memo 2.1 'introduction, a body and a conclusion'."))
add(2, "Question 2.1: Letter of Application", 30, ["formal_letter", "letter_format", "formal_writing", "transactional_writing"],
    "Question 2.1: Letter of Application (order 2) — apply for a part-time bookshop post, 120–150 words, 30-mark rubric.", q,
    [("2.1", 30, ["Plan the order of the parts before you write."], ["Write a formal letter to the owner or manager", "Include all format parts", "Mention relevant qualities, availability and an attached CV"],
      ["1. The tone and register must be formal and the letter must have an introduction, body and conclusion.", "2. Format: sender's address, date, recipient (the manager or owner), bookshop name and address, greeting, subject line, suitable ending, signature and name.", "3. May include personal qualities, start date and that a CV is attached."])])

# ───────── 2.2 Magazine article ─────────
q = []
o, a = mc("Switch off, slow down: simple ways to enjoy your free time", ["Article", "Leisure time report 2024", "Why this magazine exists"])
q.append(Q(1, U, "magazine_article", "headline", ["write_headline"],
           "Which heading is most suitable for an advice article for teenagers about leisure time?", o, a, "multiple_choice", 2, 2,
           "- A heading should attract the reader and suit the topic.\n- Reject headings that are dull or off-topic.", None, "M: memo 2.2 'suitable heading'."))
o, a = ms(["a suitable heading", "short paragraphs"], ["a postal address", "a legal disclaimer"])
q.append(Q(2, U, "magazine_article", "features_of_an_article", ["identify_format_features"],
           "Select the TWO features an article for a teenage magazine should have.", o, a, "multi_select", 1, 1,
           "- Think about how a magazine page is laid out.\n- Reject features that belong to other texts.", None, "M: memo 2.2 heading and paragraphs not too long."))
o, a = mc("Ever finished a free afternoon and wondered where the time went?", ["This article is about time.", "Time is a topic.", "In conclusion, leisure matters."])
q.append(Q(3, U, "magazine_article", "opening_hook", ["write_an_opening"],
           "Which opening best draws a teenage reader into an advice article?", o, a, "multiple_choice", 2, 2,
           "- A hook speaks directly to the reader.\n- Reject openings that only announce the topic or end the article.", None, "M: memo 2.2 'addressing the reader directly', 'stimulate interest'."))
o, a = mc("personal, speaking directly to the reader", ["cold and legal", "written only in the past tense", "full of long technical words"])
q.append(Q(4, U, "magazine_article", "style_of_an_article", ["choose_appropriate_register"],
           "Which description best fits the style of the article?", o, a, "multiple_choice", 2, 2,
           "- Think about how a teenage magazine talks to its readers.\n- The style is friendly.", None, "M: memo 2.2 style."))
m, a = fitb("Word:", "advice")
q.append(Q(5, U, "magazine_article", "purpose_of_an_article", ["recall_task_requirements"],
           "What must the article give the reader on how to manage leisure time effectively? Write one word.", m, a, "fitb", 1, 1,
           "- The reader wants help.\n- Write one word.", None, "M: memo 2.2 'provide advice to the reader'."))
add(3, "Question 2.2: Magazine Article", 30, ["magazine_article", "magazine_article_structure", "transactional_writing", "language_register"],
    "Question 2.2: Magazine Article (order 3) — 'How to manage your leisure time effectively', 120–150 words, 30-mark rubric.", q,
    [("2.2", 30, ["Plan three or four pieces of advice before you write."], ["Write a suitable heading", "Speak directly to the reader", "Give advice on managing leisure time"],
      ["1. The article needs a suitable heading and paragraphs that are not too long.", "2. The style is personal, can be descriptive and figurative, and keeps the reader engaged.", "3. It must give advice on managing leisure time effectively."])])

# ───────── 2.3 Obituary ─────────
q = []
o, a = ms(["full name of the person", "date of birth", "date of death"], ["the writer's favourite colour", "a list of prices"])
q.append(Q(1, U, "obituary", "format_of_an_obituary", ["identify_format_features"],
           "Select the THREE details that must appear in an obituary.", o, a, "multi_select", 1, 2,
           "- An obituary announces a death and gives basic facts.\n- Reject details that do not belong.", None, "M: memo 2.3 format list."))
o, a = match([("survivors", "the spouse and children who are left"), ("funeral details", "the date, time and place of the funeral"), ("tribute", "kind words about the person's character")])
q.append(Q(2, U, "obituary", "format_of_an_obituary", ["match_features_to_examples"],
           "Match each part of an obituary to what it contains.", o, a, "match", 2, 2,
           "- Think about what each heading means.\n- One part contains the writer's own words of praise.", None, "M: memo 2.3 key survivors, funeral, tribute."))
o, a = mc("It is with great sadness that we announce the passing of our beloved captain, Thandi Mokoena.",
          ["Guess what? Our captain is gone lol.", "Thandi died, big deal.", "Our captain's boots are red."])
q.append(Q(3, U, "obituary", "tone_of_an_obituary", ["choose_appropriate_register"],
           "Which opening has the right tone for an obituary?", o, a, "multiple_choice", 2, 2,
           "- The tone must be formal and respectful.\n- Reject casual or careless openings.", None, "M: memo 2.3 'tone must be formal'."))
m, a = fitb("Word:", "formal")
q.append(Q(4, U, "obituary", "tone_of_an_obituary", ["choose_appropriate_register"],
           "Which one word describes the tone of an obituary? Write one word.", m, a, "fitb", 1, 1,
           "- Think about how you speak at a funeral.\n- Write one word.", None, "M: memo 2.3."))
o, a = mc("She led the team with courage and kindness, and every player learned from her.", ["She had red hair.", "The team lost on Friday.", "The club has a new sponsor."])
q.append(Q(5, U, "obituary", "tribute", ["write_an_opening"],
           "Which sentence is the best tribute to the person in an obituary?", o, a, "multiple_choice", 3, 3,
           "- A tribute praises character and influence.\n- Reject sentences that are only facts.", None, "M: memo 2.3 'a tribute to the deceased'."))
add(4, "Question 2.3: Obituary", 30, ["obituary", "formal_writing", "transactional_writing", "register"],
    "Question 2.3: Obituary (order 4) — a tribute to a sports captain who has died, 120–150 words, 30-mark rubric.", q,
    [("2.3", 30, ["Gather the facts first, then write a respectful tribute."], ["Include the required details", "Keep the tone formal", "End with a tribute"],
      ["1. The tone must be formal.", "2. Format: full name, date of birth, date of death, birthplace, where the person lived, key survivors, funeral date/time/place and a tribute.", "3. May include biographical information and cause of death."])])

# ───────── 2.4 Dialogue ─────────
q = []
o, a = mc("A colon after the name, with each speaker on a new line.", ["A full stop after the name, all speakers on one line.", "Quotation marks around the whole conversation.", "No names at all."])
q.append(Q(1, U, "dialogue", "layout_of_a_dialogue", ["identify_format_features"],
           "Which statement describes the correct layout of a dialogue?", o, a, "multiple_choice", 1, 2,
           "- Think about how a script shows who is speaking.\n- Each speaker starts a new line.", None, "M: memo 2.4."))
o, a = mc("DAD: (folding his arms) Why do you want to leave?", ["Dad folding his arms Why do you want to leave?", "DAD: Why do you want to leave, folding his arms?", "Dad — 'folding his arms' — Why do you want to leave?"])
q.append(Q(2, U, "dialogue", "stage_directions", ["format_stage_directions"],
           "Which line shows a stage direction in the correct place and form?", o, a, "multiple_choice", 2, 2,
           "- Actions are given in brackets before the words are spoken.\n- The speaker's name is followed by a colon.", None, "M: memo 2.4."))
mm, a = order5(["A brief context", "The first speaker's line", "The second speaker's reply", "Further exchanges"], [1, 3, 0, 2])
q.append(Q(3, U, "dialogue", "layout_of_a_dialogue", ["order_events"],
           "Arrange the parts of a dialogue in the order in which they appear.", mm, a, "ordering", 2, 2,
           "- The setting must come before anyone speaks.\n- Replies follow the line they answer.", None, "M: memo 2.4 'a brief context at the beginning'."))
o, a = ms(["an informal tone", "the names of the speakers on the left"], ["a title after every speech", "a postal address"])
q.append(Q(4, U, "dialogue", "tone_of_a_dialogue", ["identify_format_features"],
           "Select the TWO features that suit a conversation between father and child.", o, a, "multi_select", 1, 1,
           "- Think about how family members talk.\n- Reject features that belong to formal letters.", None, "M: memo 2.4 informal tone."))
m, a = fitb("Mark:", "colon")
q.append(Q(5, U, "dialogue", "layout_of_a_dialogue", ["identify_format_features"],
           "Which punctuation mark follows the name of the speaker? Write one word.", m, a, "fitb", 1, 1,
           "- It looks like two dots, one above the other.\n- Write one word.", None, "M: memo 2.4."))
add(5, "Question 2.4: Dialogue", 30, ["dialogue", "dialogue_format", "dialogue_structure", "transactional_writing"],
    "Question 2.4: Dialogue (order 5) — a conversation with a father about spending the holidays elsewhere, 120–150 words, 30-mark rubric.", q,
    [("2.4", 30, ["Begin with a short context line."], ["State the setting", "Use names and colons with a new line per speaker", "Keep the tone informal"],
      ["1. A brief context opens the dialogue.", "2. The tone is informal between father and child.", "3. Names or references on the left, a colon after the name and a new line for each speaker; actions in brackets before the words."])])

# ───────── 3.1 Poster ─────────
q = []
o, a = mc("Visit our town: sun, sea and a warm welcome!", ["Notice", "Towns exist in every province", "Please read this paper"])
q.append(Q(1, U, "poster", "headline", ["write_headline"],
           "Which headline is most eye-catching for a tourism poster?", o, a, "multiple_choice", 2, 2,
           "- A headline must grab attention and suit the message.\n- Reject headlines that are dull or off-topic.", None, "M: memo 3.1 eye-catching headline."))
o, a = ms(["what visitors can do in the town", "contact details"], ["a long history of the municipality", "a list of every road"])
q.append(Q(2, U, "poster", "content_of_a_poster", ["identify_format_features"],
           "Select the TWO things a tourism poster should include.", o, a, "multi_select", 1, 1,
           "- Visitors need a reason to come and a way to find out more.\n- Reject details that are too long for a poster.", None, "M: memo 3.1 sufficient details and contact details."))
o, a = mc("Taste, see, enjoy — come and discover our beaches today!", ["The town is in the province.", "Tourism is a word.", "Beaches are sandy."])
q.append(Q(3, U, "poster", "catchy_phrases", ["write_an_opening"],
           "Which phrase is the catchiest for a tourism poster?", o, a, "multiple_choice", 2, 2,
           "- Catchy words are short, lively and speak to the reader.\n- Reject plain statements of fact.", None, "M: memo 3.1 'catchy words and phrases must be credited'."))
m, a = fitb("Words:", "80")
q.append(Q(4, U, "poster", "length_of_the_text", ["recall_task_requirements"],
           "What is the minimum number of words for the body of a shorter transactional text in this paper? Write the number.", m, a, "fitb", 1, 1,
           "- The paper gives a range for Section C.\n- Write digits only.", None, "P: 80–100 words."))
o, a = mc("No marks are given for illustrations or drawings.", ["Illustrations earn extra marks.", "A poster without a drawing fails.", "Only drawings are marked."])
q.append(Q(5, U, "poster", "what_is_marked", ["recall_task_requirements"],
           "What does the marking guideline say about illustrations on a poster?", o, a, "multiple_choice", 1, 1,
           "- The task says not to include illustrations.\n- The marker marks the words only.", None, "P/M: task note and memo 3.1 note."))
add(6, "Question 3.1: Poster", 20, ["advertising", "headline", "transactional_writing", "media_writing"],
    "Question 3.1: Poster (order 6) — a poster to promote tourism in the learner's hometown, 80–100 words, 20-mark rubric.", q,
    [("3.1", 20, ["List what visitors should know before you write."], ["Write an eye-catching headline", "Give enough details to encourage a visit", "Add contact details and catchy phrases"],
      ["1. The poster must have an eye-catching headline.", "2. It needs sufficient details to encourage people to visit the town or enter the competition.", "3. Contact details may be provided and catchy words and phrases are credited; no marks for drawings."])])

# ───────── 3.2 Diary entries ─────────
q = []
o, a = ms(["two entries", "the dates or times"], ["a formal salutation", "a postal address"])
q.append(Q(1, U, "diary_entry", "features_of_a_diary", ["identify_format_features"],
           "Select the TWO features that this task requires.", o, a, "multi_select", 1, 2,
           "- Re-read what the task asks you to write.\n- Reject features that belong to letters.", None, "M: memo 3.2 two entries, dates/times."))
o, a = mc("Friday 5 July, 8 p.m. Dear Diary, I can't wait for tomorrow!", ["Dear Sir, I write to tell you about my holiday.", "To the editor: holidays are good.", "Re: complaint about weather"])
q.append(Q(2, U, "diary_entry", "opening_of_a_diary_entry", ["write_an_opening"],
           "Which opening best suits a diary entry?", o, a, "multiple_choice", 2, 2,
           "- A diary entry is personal and informal.\n- It usually shows a date.", None, "M: memo 3.2 dates/times reflected; simple informal language."))
m, a = fitb("Number:", "2")
q.append(Q(3, U, "diary_entry", "features_of_a_diary", ["recall_task_requirements"],
           "How many diary entries must the candidate write? Write the number.", m, a, "fitb", 1, 1,
           "- One is for before the holiday and one for after.\n- Write digits only.", None, "P/M: task says TWO entries."))
o, a = mc("first person", ["third person", "second person", "no person at all"])
q.append(Q(4, U, "diary_entry", "person_and_tone", ["choose_appropriate_register"],
           "In which person must a diary entry be written?", o, a, "multiple_choice", 1, 1,
           "- The writer talks about himself or herself.\n- Think of the pronoun 'I'.", None, "M: memo 3.2 first person."))
o, a = mc("The feelings should change to suit what happened.", ["Both entries must express exactly the same feeling.", "The entries must use only questions.", "Only facts are allowed."])
q.append(Q(5, U, "diary_entry", "person_and_tone", ["choose_appropriate_register"],
           "What should the tone of the two entries show?", o, a, "multiple_choice", 2, 2,
           "- The task says the holiday turned out differently.\n- Feelings before and after differ.", None, "M: memo 3.2 'tone must reflect suitable emotions'."))
add(7, "Question 3.2: Diary Entries", 20, ["diary_entry", "creative_writing", "transactional_writing", "language_register"],
    "Question 3.2: Diary Entries (order 7) — two entries before and after a holiday that turned out differently, 80–100 words, 20-mark rubric.", q,
    [("3.2", 20, ["Decide how you felt before and how you felt after."], ["Write two dated entries", "Use the first person", "Show suitable emotions in simple, informal language"],
      ["1. There must be two diary entries with dates or times.", "2. The entries express feelings before and after the holiday and are written in the first person.", "3. The language is simple and informal; the tone reflects suitable emotions."])])

# ───────── 3.3 Instructions ─────────
q = []
o, a = mc("Choose a date and set a budget.", ["You should choose a date and set a budget.", "A date was chosen and a budget was set.", "Choosing a date is important."])
q.append(Q(1, U, "instructions", "imperative_mood", ["use_the_imperative"],
           "Which sentence is written in the imperative, as instructions should be?", o, a, "multiple_choice", 1, 2,
           "- An imperative sentence gives a command and starts with the verb.\n- Reject sentences that describe or advise.", None, "M: memo 3.3 'must be written in the imperative'."))
mm, a = order5(["Choose a date and set a budget", "Make a guest list", "Send the invitations", "Prepare the food and decorations"], [2, 0, 3, 1])
q.append(Q(2, U, "instructions", "logical_order", ["order_events"],
           "Arrange these instructions for planning a party in a logical order.", mm, a, "ordering", 1, 2,
           "- Each step depends on the one before it.\n- The food is prepared near the date.", None, "M: memo 3.3 'clear and in a logical sequence'."))
o, a = ms(["They must be clear and in a logical sequence.", "They must be written in the imperative."], ["They must be written in the past tense.", "They must include a drawing.", "They must be one long sentence."])
q.append(Q(3, U, "instructions", "features_of_instructions", ["identify_format_features"],
           "Select the TWO things that instructions must be.", o, a, "multi_select", 1, 1,
           "- Think about what makes instructions easy to follow.\n- Reject options the task forbids.", None, "M: memo 3.3."))
m, a = fitb("Word:", "imperative")
q.append(Q(4, U, "instructions", "imperative_mood", ["use_the_imperative"],
           "What name is given to the form of the verb used to give commands? Write one word.", m, a, "fitb", 2, 2,
           "- It starts a sentence such as 'Close the door'.\n- Write one word.", None, "M: memo 3.3."))
o, a = mc("First, Next, Then, Finally", ["However, Although, Because, Unless", "Yesterday, Today, Tomorrow", "Maybe, Perhaps, Possibly"])
q.append(Q(5, U, "instructions", "sequencing_words", ["use_sequencing_words"],
           "Which set of words helps a writer to show the order of steps?", o, a, "multiple_choice", 1, 1,
           "- Think of words that mark the order of actions.\n- Reject words for contrast, general time or doubt.", None, "C: CAPS §3.3 sequence words."))
add(8, "Question 3.3: Instructions", 20, ["following_instructions", "transactional_writing", "sentence_construction"],
    "Question 3.3: Instructions (order 8) — how to plan a birthday party, 80–100 words, 20-mark rubric.", q,
    [("3.3", 20, ["List the steps in the order a person would do them."], ["Put the steps in logical order", "Write each in the imperative", "Use point or paragraph form within 80–100 words"],
      ["1. The instructions may be in point or paragraph form.", "2. They must be clear and in a logical sequence.", "3. They must be written in the imperative; no marks for drawings."])])

emit(2024, PAPER, LS, "temp/images/fal24-p3")
