#!/usr/bin/env python3
"""English FAL Nov 2024 Paper 1 generator (5 lessons). Writes scripts/add-english-fal-2024-nov-p1-q<N>.js.
Shared helpers + emitter: fal2024_common.py."""
from fal2024_common import *  # noqa

PAPER = "nov_p1"
LS = []

# ───────── Q1 Comprehension ─────────
q = []
o, a = mc("They are useful, but they cannot replace human understanding.",
          ["They are useless, so people have stopped using them.", "They can sense a friend's feelings better than people can.",
           "They will soon replace every other device at home."])
q.append(Q(1, "comprehension", "author_purpose_and_attitude", "writers_main_point", ["identify_main_point"],
           "What point is the writer making about voice assistants?", o, a, "multiple_choice", 2, 2,
           "- Notice the word 'yet' in the last sentence: it signals a limit.\n- Decide what the first sentence praises and what the last sentence admits.",
           "Voice assistants can set alarms, play music and answer questions, and each year they understand more of what we say. Yet no assistant can sense when a friend simply needs someone to listen.",
           "P1: fresh stimulus on the exam text's theme (AI)"))
m, a = fitb("Word:", "easy|simple")
q.append(Q(2, "comprehension", "vocabulary_in_context", "synonym_in_context", ["find_synonym_in_text"],
           "Quote ONE word from the extract that means the opposite of 'complicated'.", m, a, "fitb", 2, 2,
           "- Look for an adjective that describes how the device is used.\n- Quote a single word only.",
           "Voice commands make the device easy and simple to use for people of all ages.", "P1: vocabulary in context"))
o, a = ms(["It saves the shop money.", "It keeps customers happy."],
          ["It replaces every worker in the shop.", "It makes the shop larger.", "It slows down service at night."])
q.append(Q(3, "comprehension", "literal_comprehension", "select_stated_reasons", ["identify_stated_reasons"],
           "Select the TWO benefits of chatbots that are stated in the extract.", o, a, "multi_select", 2, 2,
           "- Use only what the extract states.\n- Two options appear in the extract almost word for word.",
           "Many shops now use chatbots to answer customers at night, which saves money and keeps customers happy.", "P1: stated reasons"))
o, a = mc("To show how quickly the use of these tools is growing.", ["To show that learners dislike these tools.",
                                                                    "To prove that the tools are expensive.", "To show how many schools have closed."])
q.append(Q(4, "comprehension", "author_purpose_and_attitude", "purpose_of_a_statistic", ["explain_purpose_of_reference"],
           "Why does the writer mention '60 per cent'?", o, a, "multiple_choice", 2, 3,
           "- A percentage 'since' a period of time shows change.\n- Ask what a rising figure tells the reader.",
           "Within three years, the use of online learning tools among learners has grown by 60 per cent.", "P1: purpose of a statistic"))
o, a = match([("behind the times", "old-fashioned"), ("to cut corners", "to do a job carelessly to save time"),
              ("ahead of the curve", "more advanced than most people")])
q.append(Q(5, "comprehension", "vocabulary_in_context", "idioms_and_expressions", ["explain_idiom_meaning"],
           "Match each expression to its meaning.", o, a, "match", 3, 2,
           "- Try each expression in a sentence and see which meaning fits.\n- Start with the one you are surest about.", None,
           "P1: idioms"))
o, a = mc("Suitable: it shows that reading helps learners concentrate and learn, which anyone can benefit from.",
          ["Not suitable: the passage is about sport.", "Suitable: it says that everyone must read the same book.",
           "Not suitable: a title may never refer to people."])
q.append(Q(6, "comprehension", "evaluative_reading", "title_suitability", ["evaluate_title_suitability"],
           "Discuss the suitability of the title 'READING IS FOR EVERYONE' for a passage that lists four ways in which books help learners to concentrate. Which ONE answer is best substantiated?",
           o, a, "multiple_choice", 3, 3,
           "- Compare the title with what the passage actually lists.\n- A well-substantiated answer gives a reason from the passage.", None,
           "P1: title suitability"))
AI = [
 ("1.1.1", 1, ["Look for what the first paragraph says about how far AI reaches into daily life."], ["Find the sentence about its importance", "State the reason in one short point"],
  ["1. AI has a wide-ranging impact on many aspects of our lives and is part of our routines."]),
 ("1.1.2", 2, ["Think about what 'fantasies' suggests about how real these ideas are."], ["Explain the words", "Say what they suggest about people's view of AI"],
  ["1. 'Science fiction fantasies' suggest that people imagine AI as made up, based on imagination.", "2. They also suggest futuristic ideas such as robots taking over the world."]),
 ("1.2.1", 2, ["Use your own words: do not copy the sentence."], ["Find the definition in paragraph 2", "Rewrite two points"],
  ["1. AI is a branch of computer science.", "2. In it machines copy how people think and make decisions."]),
 ("1.2.2", 2, ["Look at what paragraph 2 says AI does for industries."], ["Find the benefits", "State two"],
  ["1. Tasks are completed faster or more accurately.", "2. Efficiency is improved and processes are streamlined."]),
 ("1.3", 2, ["Look for the sentence that begins 'In Africa'."], ["Find the list", "Choose two"],
  ["1. Access to healthcare, financial services or education (any two)."]),
 ("1.4.1", 1, ["Compare the false statement with what paragraph 4 says about skills."], ["Find the correct fact in paragraph 4", "State it"],
  ["1. AI's impact on businesses has caused a shift in the type of skills needed for economic change, so skills are still needed."]),
 ("1.4.2", 2, ["Think about what a large percentage shows about growth."], ["Find the figure's context", "Give two reasons"],
  ["1. It shows the rapid growth of AI.", "2. It shows how important AI is in businesses."]),
 ("1.5.1", 2, ["Think about the feeling carried by 'exciting' and 'transforms'."], ["Interpret both words", "Link them to AI"],
  ["1. The words suggest that AI brings amazing change.", "2. They suggest innovation and reform."]),
 ("1.5.2", 2, ["Re-read the sentences about the ADI platform."], ["Find the two steps", "Say them in your own words"],
  ["1. You give the platform information about the website you want.", "2. It produces a well-designed website in a short time."]),
 ("1.6", 2, ["Look at the word 'human-like' and the quotation marks around 'conversations'."], ["Interpret the words", "State two points"],
  ["1. ChatGPT makes communication seem natural, like talking to a person.", "2. It can give answers or guidance when you ask."]),
 ("1.7", 1, ["Compare the bold glamour filter with 'past social media filters'."], ["Find the contrast in paragraph 7", "State one difference"],
  ["1. It keeps working well when a face moves in a video, creating a new flawless face from a database of faces."]),
 ("1.8.1", 1, ["Look for a single word that means a shortcoming."], ["Scan the first sentence of paragraph 8", "Quote one word"],
  ["1. The word is 'limitations'."]),
 ("1.8.2", 2, ["Look at the advice that begins 'It is also worth noting'."], ["Find the two pieces of advice", "State them"],
  ["1. AI should not be used to deceive or take shortcuts.", "2. It should be used to improve existing systems and make them more effective."]),
 ("1.9", 2, ["Decide whether the title fits the whole passage, then give a reason."], ["State your view", "Support it from the passage"],
  ["1. Suitable: the passage discusses AI's importance, impact and uses, and shows it is being welcomed.", "2. Not suitable: not everyone welcomes AI and there are concerns.", "3. A bare yes or no earns no mark."]),
 ("1.10", 2, ["Look at the picture in visual 1 and read what it suggests."], ["Say what benefit it shows", "Give a reason from the visual"],
  ["1. Reading is good exercise for your brain.", "2. The picture of a brain lifting weights or wearing running shoes shows the importance of training your brain."]),
 ("1.11", 2, ["Think about what a light bulb usually stands for."], ["Say what it suggests", "Give a reason"],
  ["1. Reading gives people new ideas.", "2. The light bulb represents creativity, bright ideas or solutions."]),
 ("1.12", 2, ["Decide which is easier for you and say why."], ["State your view", "Support it"],
  ["1. Visuals are easy to understand because you do not have to work out the meaning of words.", "2. Or written text is easier because the visuals may be confusing.", "3. A bare view earns no mark."]),
]
LS.append(dict(order=1, name="Question 1: Comprehension", marks=30, q=3, m=2, supp=[("Text A", 2, "q1_texta"), ("Text B", 1, "q1_textb")],
               tags=["comprehension", "literal_comprehension", "inferential_reading", "diction"], questions=q, ai=AI,
               header="Question 1: Comprehension (order 1) — TEXT A article on embracing artificial intelligence; TEXT B infographic on the benefits of reading. Practice mirrors the text-extractable sub-questions (1.1–1.9) on a fresh AI/technology theme; 1.10–1.12 depend on the TEXT B graphic and are skipped (LANG-EX-03)."))

# ───────── Q2 Summary ─────────
q = []
o, a = ms(["Turn off taps while you brush your teeth.", "Fix any dripping tap at home.", "Collect rainwater in a bucket."],
          ["Many families in towns pay water bills.", "Some dams are very large."])
q.append(Q(1, "summary", "main_vs_supporting_points", "select_main_points", ["select_relevant_points"],
           "The passage lists ways to save water at home. Select the THREE sentences that are ways to save water.", o, a, "multi_select", 3, 3,
           "- A way to save water is something a person can do.\n- Sentences that only give background are not ways to save.",
           "Water is precious, and everyone can help to save it. Turn off taps while you brush your teeth. Many families in towns pay water bills, and some dams are very large. Fix any dripping tap at home, and collect rainwater in a bucket for the garden.",
           "P1: select valid summary points"))
o, a = mc("Switch off lights that nobody is using.", ["Switch off all lights in your home.", "Leave a light on in every room.",
                                                    "Buy bulbs that use a lot of power."])
q.append(Q(2, "summary", "paraphrase_and_own_words", "best_paraphrase", ["rewrite_in_own_words"],
           "Which ONE sentence best expresses the meaning of the sentence below in your OWN words?", o, a, "multiple_choice", 2, 3,
           "- The best rewording keeps the meaning but changes the words.\n- Watch for options that change what is said.",
           "Turn off the lights in rooms that nobody is using.", "P1: paraphrase"))
m, a = fitb("Point number:", "2")
q.append(Q(3, "summary", "main_vs_supporting_points", "repeated_points", ["identify_repeated_point"],
           "Which numbered point repeats the idea in point 4? Write only the number.", m, a, "fitb", 2, 2,
           "- Decide what point 4 is really about, ignoring the exact words.\n- Look for the point that says the same thing differently.",
           "1. Walk to school.\n2. Take a shower instead of a bath.\n3. Switch off the TV when you leave the room.\n4. Use less water when you wash.",
           "P1: repeated point"))
o, a = mc("Walk to school to stay healthy.", ["Walk to school, cycle and also jog.", "Walking, cycling.", "Walk to school and then, after that, jog home and rest."])
q.append(Q(4, "summary", "point_form_conventions", "one_point_per_sentence", ["apply_point_form_rules"],
           "A summary must be written in point form: ONE point per sentence, in a full sentence. Which ONE sentence follows these instructions?",
           o, a, "multiple_choice", 2, 2,
           "- Count the separate ideas in each option.\n- A fragment is not a full sentence.", None, "P1: point-form rules"))
AI = [("2", 10, ["Find the actions the writer recommends, one per paragraph.", "Ignore sentences that only give background."],
       ["Underline each action: walk, move around, cycle, take the stairs, jog, do housework, stretch, dance", "Choose seven distinct actions", "Write each as one full sentence in your own words, with a word count"],
       ["1. The memo accepts eight points: walk regularly; move at every opportunity; cycle to your destination; climb stairs; jog; do housework; stretch and walk every half hour; dance.", "2. Seven of these earn one mark each (7 marks).", "3. Three marks are for language: 1–3 correct points earn 1, 4–5 earn 2, 6–7 earn 3; verbatim quotes lose language marks.", "4. Write seven numbered sentences, one point each, within 70 words."])]
LS.append(dict(order=2, name="Question 2: Summary", marks=10, q=1, m=2, supp=[("Text C", 1, "q2_textc")], tags=["summary", "paraphrase", "main_points"],
               questions=q, ai=AI, header="Question 2: Summary (order 2) — TEXT C how to be active in everyday life (list SEVEN points, ≤70 words). Practice tests sub-skills, not the written summary (LANG-SEC-02)."))

# ───────── Q3 Advertisement ─────────
AD = "FRESHFIT trainers. Feel light. Run far. Your comfort, your way. For tired, aching feet after a long day."
q = []
o, a = mc("the need for comfortable feet", ["the need to save money", "the need to travel", "the need for entertainment"])
q.append(Q(1, "visual_texts", "advertising_language", "appeal_to_need", ["identify_need_appealed_to"],
           "Which need does the advertiser mainly appeal to?", o, a, "multiple_choice", 2, 2,
           "- Think about what the product is for and which problem it solves.\n- Read the last line of the copy.", AD, "P1: appeal to a need"))
o, a = mc("To speak directly to the reader and personalise the message.", ["To show that the writer owns the shoes.",
                                                                          "To make the words rhyme.", "To show that the shoes are cheap."])
q.append(Q(2, "visual_texts", "advertising_language", "persuasive_devices", ["identify_persuasive_devices"],
           "What is the advertiser's intention in using the word 'your' in 'Your comfort, your way'?", o, a, "multiple_choice", 2, 3,
           "- Think about who the word 'your' refers to.\n- Advertisers often talk to one reader.", AD, "P1: possessive address"))
m, a = fitb("Word:", "weary|exhausted")
q.append(Q(3, "language", "word_level_vocabulary", "synonym_in_context", ["find_synonym_in_text"],
           "Provide a synonym for the word 'tired' in: For tired feet, wear FreshFit.", m, a, "fitb", 2, 2,
           "- Think of a word you could use instead of 'tired' that means the same.\n- Write one word.", None, "P1: synonym"))
o, a = ms(["It shows what the shoe looks like.", "A smiling runner captures the reader's attention."],
          ["It lists the price of every shoe.", "It shows where the shoes are made.", "It gives the shop's opening hours."])
q.append(Q(4, "visual_texts", "advertising_language", "persuasive_devices", ["identify_persuasive_devices"],
           "Select the TWO reasons why an advertiser includes a picture of the product and a smiling runner.", o, a, "multi_select", 3, 3,
           "- Think about what a picture adds that words cannot.\n- Reject reasons that the picture cannot give.", AD, "P1: purpose of visuals"))
AI = [
 ("3.1", 1, ["Think about what the symbol next to a brand name tells the buyer."], ["Recall the meaning of the ® symbol", "Choose the best option"],
  ["1. The ® symbol shows the name is a registered trademark, so the answer is C.", "2. 'Recorded', 'renewing' and 'recovering' are not what ® stands for."]),
 ("3.2.1", 1, ["Look at the headline and the problem it names."], ["Find the problem", "Name the need"],
  ["1. The advertiser appeals to the need to be free from nasal discomfort or congestion."]),
 ("3.2.2", 2, ["Think about who 'yourself' refers to."], ["Say who the word speaks to", "Say what it suggests"],
  ["1. It speaks directly to the target audience and personalises the message.", "2. It shows that you can treat yourself (self-medicate)."]),
 ("3.3", 2, ["Think about what a picture of the product shows."], ["Give two reasons", "Link each to the reader"],
  ["1. It shows how the product looks and that it is a nasal spray.", "2. The picture of the face on the box captures attention (any two)."]),
 ("3.4", 1, ["Find two words next to each other that say how the product is used."], ["Scan the packaging text", "Quote two consecutive words"],
  ["1. The words are 'Nasal spray'."]),
 ("3.5", 1, ["Think of another word for 'blocked'."], ["Understand the underlined word", "Choose a synonym that fits"],
  ["1. 'Blocked' means closed up; synonyms are 'congested' or 'clogged'."]),
 ("3.6", 2, ["Decide whether the curved arrow helps the message, then give a reason."], ["State your view", "Refer to the arrow and the number"],
  ["1. Yes: the curved arrow and the number 2 look like a clock, showing the product works in 2 minutes and lasts for 10 hours.", "2. No: the link between the arrow, the number and the message is unclear.", "3. A bare yes or no earns no mark."]),
]
LS.append(dict(order=3, name="Question 3: Analysing an Advertisement", marks=10, q=1, m=2, supp=[("Text D", 2, "q3_textd")],
               tags=["advertising", "advertising_language", "media_analysis"], questions=q, ai=AI,
               header="Question 3: Analysing an Advertisement (order 3) — TEXT D Sinutab nasal spray advertisement. Practice uses fresh written ad copy on a similar theme (comfort/health); text-extractable sub-questions only (LANG-SEC-03)."))

# ───────── Q4 Cartoon ─────────
q = []
o, a = mc("question mark", ["exclamation mark", "comma", "full stop"])
q.append(Q(1, "language", "punctuation_and_spelling", "end_punctuation", ["identify_punctuation_function"],
           "Which punctuation mark follows the word 'Really' in the frame below?", o, a, "multiple_choice", 1, 2,
           "- Think about what a speaker is doing when the word is a query.\n- The speaker is asking, not shouting.",
           "[Frame 2] Mia (speech bubble): 'Really?'", "P1: punctuation in cartoons"))
o, a = match([("frame", "one box of the cartoon strip"), ("speech bubble", "words a character says aloud"),
              ("caption", "a short line of text that explains or titles a frame")])
q.append(Q(2, "visual_texts", "cartoon_analysis", "cartoon_conventions", ["explain_cartoon_conventions"],
           "Match each cartoon feature to what it is.", o, a, "match", 2, 2,
           "- Think about how a cartoon strip is built.\n- One feature is text outside the bubbles.", None, "P1: conventions"))
o, a = mc("Many messages are sent by teenagers.", ["Teenagers were sending many messages.", "Many messages send teenagers.", "Teenagers are sent by many messages."])
q.append(Q(3, "language", "passive_and_reported_speech", "passive_voice", ["change_to_passive_voice"],
           "Which sentence is the passive voice of the sentence in the frame?", o, a, "multiple_choice", 3, 3,
           "- In the passive voice the object of the active sentence becomes the subject.\n- Keep the same tense.",
           "[Frame 4] Mia: 'Teenagers send many messages.'", "P1: passive voice"))
o, a = ms(["A character's words contradict what the picture shows.", "A character exaggerates an everyday habit."],
          ["The cartoon explains a real news story.", "Every frame shows the same drawing."])
q.append(Q(4, "visual_texts", "cartoon_analysis", "creating_humour", ["explain_how_humour_is_created"],
           "Select the TWO ways in which humour can be created in a cartoon.", o, a, "multi_select", 3, 3,
           "- Humour often comes from a gap between what is said and what is shown.\n- Check each option against how cartoons work.", None,
           "P1: humour techniques"))
AI = [
 ("4.1.1", 1, ["Think about what 'finally gave in' says about how easily Mr Wilson agrees."], ["Read the phrase in context", "Eliminate options"],
  ["1. 'Finally gave in' suggests Mr Wilson does not give in easily, so he is stubborn: B."]),
 ("4.1.2", 1, ["Look at the mark after 'Wow'."], ["Find the mark", "Name it"], ["1. It is an exclamation mark."]),
 ("4.2", 2, ["Think about what a silhouette does to a face."], ["Describe the visual", "Say why it is used"],
  ["1. The outline focuses on Dennis' message.", "2. It shows facial expressions are not important when texting, or that the Wilsons are detached from their surroundings (any two)."]),
 ("4.3", 2, ["You need one verbal clue and one visual clue."], ["Find what Mr Wilson says", "Find what his face shows"],
  ["1. Verbal: he says 'That seems like a lot of work'.", "2. Visual: his mouth is turned down or he is frowning."]),
 ("4.4", 2, ["Look at the hair, eyes and glasses of each person."], ["Describe Mr Wilson", "Describe Mrs Wilson"],
  ["1. Mr Wilson is bald with wrinkles or bags under his eyes.", "2. Mrs Wilson has an old-fashioned hairstyle and glasses."]),
 ("4.5", 2, ["Decide if the comment is funny, then give a reason."], ["State your view", "Refer to Mrs Wilson's words"],
  ["1. Yes: she teases her husband lovingly about his unfriendly nature.", "2. No: calling him grumpy is disrespectful and embarrasses him in front of Dennis.", "3. A bare yes or no earns no mark."]),
]
LS.append(dict(order=4, name="Question 4: Analysing a Cartoon", marks=10, q=1, m=1, supp=[("Text E", 2, "q4_texte")],
               tags=["cartoons", "dialogue", "passive_voice"], questions=q, ai=AI,
               header="Question 4: Analysing a Cartoon (order 4) — TEXT E Dennis the Menace (seven frames, texting). Practice uses fresh written frame dialogue; text-extractable items only (LANG-SEC-04); drawing-dependent items are skipped."))

# ───────── Q5 Language ─────────
q = []
m, a = fitb("Corrected word:", "They're")
q.append(Q(1, "language", "punctuation_and_spelling", "contractions_and_homophones", ["correct_spelling_error"],
           "Correct the SINGLE error in the sentence. Write only the corrected word.", m, a, "fitb", 2, 3,
           "- Say the sentence aloud: which two words are being joined?\n- The word shown is a different word that sounds the same.",
           "Their going to the match tonight.", "P1: contraction error"))
m, a = fitb("Corrected word:", "restaurant")
q.append(Q(2, "language", "punctuation_and_spelling", "spelling", ["correct_spelling_error"],
           "Correct the SINGLE spelling error in the sentence. Write only the corrected word.", m, a, "fitb", 2, 2,
           "- The word is a place where meals are served.\n- Check each letter after the 'a'.",
           "The new restaurent on Main Road was full on Saturday.", "P1: spelling"))
o, a = mc("Thabo said that he would call me the next day.", ["Thabo said that he will call me tomorrow.", "Thabo said that I would call him the next day.",
                                                            "Thabo said, that he would call me tomorrow."])
q.append(Q(3, "language", "passive_and_reported_speech", "reported_statements", ["change_to_reported_speech"],
           "Which sentence is the correct reported speech of the sentence in the extract?", o, a, "multiple_choice", 3, 3,
           "- Reported speech moves the verb one step back in time.\n- Pronouns and time words change.",
           "Thabo said, 'I will call you tomorrow.'", "P1: reported speech"))
o, a = mc("The shop does not open on Sundays.", ["The shop opens not on Sundays.", "The shop no opens on Sundays.", "The shop did not open on Sundays."])
q.append(Q(4, "language", "sentence_construction", "negative_form", ["rewrite_in_negative_form"],
           "Which sentence is the negative form of the sentence in the extract?", o, a, "multiple_choice", 2, 2,
           "- Use 'do' or 'does' with 'not' in the simple present.\n- Keep the same tense.",
           "The shop opens on Sundays.", "P1: negative form"))
m, a = fitb("Correct form:", "decision")
q.append(Q(5, "language", "word_level_vocabulary", "word_formation", ["use_word_formation"],
           "Give the correct form of the word in brackets in the sentence.", m, a, "fitb", 2, 2,
           "- The sentence needs a noun.\n- Add the ending that turns the verb into a noun.",
           "Choosing a career was a difficult (decide) for her.", "P1: word formation"))
o, a = match([("quickly", "adverb"), ("beautiful", "adjective"), ("under", "preposition")])
q.append(Q(6, "language", "parts_of_speech", "identify_part_of_speech", ["identify_parts_of_speech"],
           "State the part of speech of each word as used in the sentence.", o, a, "match", 2, 2,
           "- Ask what each word does: describes a verb, describes a noun, or shows a relationship.\n- Function decides the part of speech.",
           "The beautiful bird flew quickly under the bridge.", "P1: parts of speech"))
o, a = mc("wasn't it", ["didn't it", "isn't it", "weren't it"])
q.append(Q(7, "language", "sentence_construction", "tag_questions", ["complete_tag_question"],
           "Complete the tag question.", o, a, "multiple_choice", 2, 2,
           "- Use the opposite polarity to the main sentence.\n- Repeat the verb 'was'.",
           "The match was cancelled, ...?", "P1: tag question"))
AI = [
 ("5.1.1(a)", 1, ["Look at the first word and ask whether it should be a contraction."], ["Spot the error", "Correct it"], ["1. 'Its' should be 'It's' (it is)."]),
 ("5.1.1(b)", 1, ["Check the word after 'flavour'."], ["Find the wrong preposition"], ["1. 'A flavour in chips' is wrong: the correct preposition is 'of' (a flavour of chips)."]),
 ("5.1.1(c)", 1, ["One word is misspelt."], ["Find it", "Spell it correctly"], ["1. 'essense' should be 'essence'."]),
 ("5.1.1(d)", 1, ["Check the verb against the subject."], ["Find the subject", "Fix the verb"], ["1. 'Chef Benny' is singular, so the verb is 'believes'."]),
 ("5.1.2", 1, ["Use the opposite polarity of the main sentence."], ["Identify 'is'", "Make the tag negative"], ["1. The answer is 'isn't it' or 'is it not'."]),
 ("5.1.3", 1, ["Find the word that does not fit after 'describes this taste'."], ["Find the wrong word", "Replace it"], ["1. 'He describes this taste as a smoky beef flavour with sweet barbecue notes.'"]),
 ("5.1.4", 3, ["Change the pronouns and the verb tense; check punctuation."], ["Change 'they' and 'me'", "Move the tense back", "Check punctuation"],
  ["1. Chef Benny said (that) they had roped him in as a chef who is synonymous with braai.", "2. One mark each for the changed tense, the pronoun change and correct punctuation."]),
 ("5.1.5", 1, ["A homophone sounds the same but is spelled differently."], ["Think of a word that sounds like 'new'", "Use it in a sentence"], ["1. 'Knew' is a homophone: 'He knew he was in trouble.'"]),
 ("5.1.6", 1, ["Move the object to the front and use 'has been' plus the past participle."], ["Identify subject and object", "Switch and adjust the verb"], ["1. A delicious braai companion has been created by Simba."]),
 ("5.1.7", 2, ["Think about what each underlined word does."], ["Look at 'the'", "Look at 'flavour'"], ["1. 'The' is an article (definite determiner).", "2. 'Flavour' is a noun."]),
 ("5.1.8", 1, ["Use 'does not' with the base form of the verb."], ["Find the verb", "Add the negative"], ["1. The new Steakhouse Beef does not stand out as distinct."]),
 ("5.2.1", 2, ["Join both facts using 'as well as'."], ["Keep both ideas", "Check the sentence is complete"],
  ["1. Google is the most visited website as well as the most popular search engine.", "2. The other order is accepted; award 2 or 0 marks."]),
 ("5.2.2", 1, ["The sentence needs a noun after 'the'."], ["Identify the part of speech needed", "Form it from the verb"], ["1. 'Create' becomes 'creation'."]),
 ("5.2.3", 1, ["Look at the word 'than'."], ["Recognise the comparison", "Choose the form"], ["1. 'Many' becomes 'more'."]),
 ("5.2.4", 1, ["Write the numeral in words."], ["Think of the word for 0"], ["1. 'Zero' (or nought or nil)."]),
 ("5.2.5", 1, ["Use 'am', 'is' or 'are' plus the -ing form."], ["Change the tense", "Keep the meaning"], ["1. I am using Google for my research."]),
]
LS.append(dict(order=5, name="Question 5: Language and Editing Skills", marks=20, q=3, m=1,
               supp=[("Text F", 1, "q5_textf"), ("Text G", 1, "q5_textg")], tags=["grammar_editing", "editing", "parts_of_speech", "reported_speech"],
               questions=q, ai=AI,
               header="Question 5: Language and Editing Skills (order 5) — TEXT F braai passage with errors; TEXT G Google poster. Practice mirrors the grammar skills on fresh sentences (LANG-SEC-05)."))

emit(2024, PAPER, LS, "temp/images/fal24-p1")
