#!/usr/bin/env python3
"""Generates scripts/add-english-fal-2025-nov-p3-q<1..8>.js (essay + 7 transactional texts) and extends the seed."""
import json, os, sys, itertools

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import new_questions as nq  # helpers: mc, ms, match, fitb, Q

ROOT = "/home/emmanuel/WebstormProjects/ampm-content-framework"
BASE = "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3"
nq.POS = itertools.cycle([1, 2, 3, 0, 2, 3, 1, 2, 3, 1, 2, 0, 3, 1, 2, 3])
mc, ms, match, fitb = nq.mc, nq.ms, nq.match, nq.fitb


def order5(items, shown):
    meta = [items[i] for i in shown]
    meta += [""] * (5 - len(meta))
    return meta, list(items) + [""] * (5 - len(items))


def Q(order, unit, topic, subtopic, skills, question, md, ans, pres, diff, w, clues, basis):
    return nq.Q(order, unit, topic, subtopic, skills, question, md, ans, pres, diff, w, clues, basis)


L = []

# ──────────────── Q1 Essay ────────────────
U = "essay_writing"
q = []
o, a = mc("to generate ideas and put them in a logical order before writing",
          ["to write the whole essay in rough before copying it out", "to count how many words each paragraph will have",
           "to list every difficult word that might be misspelt"])
q.append(Q(1, U, "planning_and_structure", "purpose_of_planning", ["apply_planning_steps"],
           "Why should a candidate plan an essay before writing it?", o, a, "multiple_choice", 1, 2,
           "- Think about what a plan helps you decide before you start.\n- Look for the option about ideas and order.",
           "C: CAPS §3.3 'Planning/pre-writing' (brainstorm ideas, identify main ideas)."))
m, a = order5(["Planning (pre-writing)", "Drafting", "Revising and editing", "Proofreading and presenting"], [2, 0, 3, 1])
q.append(Q(2, U, "planning_and_structure", "writing_process", ["order_events"],
           "Arrange the steps of the writing process in the order in which they are done.", m, a, "ordering", 1, 2,
           "- You cannot edit a piece of writing that has not been drafted.\n- Presenting the final copy comes last.",
           "C: CAPS §3.3 steps in process writing."))
o, a = match([("narrative essay", "a strong storyline and an interesting ending"),
              ("descriptive essay", "a picture in words that uses many of the senses"),
              ("discursive essay", "arguments for and against that are balanced and analysed")])
q.append(Q(3, U, "essay_types", "features_of_essay_types", ["match_essay_types_to_features"],
           "Match each type of essay to the feature the marker expects.", o, a, "match", 2, 2,
           "- Think about what each type is meant to do for the reader.\n- Use the type you know best first.",
           "M: the memo's feature list for narrative, descriptive and discursive essays."))
o, a = ms(["Give the essay a suitable title", "Link the interpretation clearly to the picture"],
          ["Copy the caption printed under the picture", "Write the essay in the present tense only", "Describe the photographer's techniques"])
q.append(Q(4, U, "picture_prompts", "responding_to_a_picture", ["respond_to_picture_prompt"],
           "Select the TWO things a candidate must do when answering a picture topic.", o, a, "multi_select", 2, 2,
           "- The paper tells you to give your own title and to show a link.\n- Reject options that limit the tense or ask for technical detail.",
           "M/P: memo 'Interpretation of pictures' and the paper's instruction for 1.6–1.8."))
o, a = fitb("Words:", "300")
q.append(Q(5, U, "language_style_and_editing", "length_of_the_essay", ["recall_task_requirements"],
           "What is the maximum number of words for the essay in this paper? Write the number.", o, a, "fitb", 1, 1,
           "- The paper states a range of words for the essay.\n- Write digits only.",
           "P: the paper states 250–300 words."))
o, a = mc("content and planning (30 of the 50 marks)", ["structure (30 of the 50 marks)", "spelling and handwriting (30 of the 50 marks)",
                                                        "title and layout (30 of the 50 marks)"])
q.append(Q(6, U, "language_style_and_editing", "how_the_essay_is_marked", ["recall_task_requirements"],
           "Which criterion carries the most marks in the essay rubric?", o, a, "multiple_choice", 2, 2,
           "- The memo lists three criteria with their marks.\n- Ideas and organisation are weighted most heavily.",
           "M: memo — content and planning 30, language/style/editing 15, structure 5."))
ai = [
    ("1.1", 50, "- Decide which type of essay you will write; several types are accepted.\n- Link every paragraph to the idea of a smile and its story.",
     "- Choose a type (reflective, narrative, descriptive, discursive or argumentative)\n- Plan beginning, middle and end\n- Keep to 250–300 words",
     "1. A reflective essay conveys feelings and reactions; a narrative needs a strong storyline and interesting ending.\n2. A descriptive essay paints a picture with the senses.\n3. A discursive essay balances arguments; an argumentative essay defends one view.\n4. Mixed types are accepted if relevant."),
    ("1.2", 50, "- 'It gets easier' suggests a process over time.\n- Pick a type that suits your idea.", "- Choose a type\n- Plan a clear development\n- Conclude with a firm point",
     "1. Discursive, reflective, narrative, argumentative and descriptive essays are all acceptable.\n2. Each type must show its own features (balance, feelings, storyline, a stance, or sensory detail)."),
    ("1.3", 50, "- Think of a concrete promise and what stopped you.\n- A narrative would need an interesting ending.", "- Choose a type\n- Plan the sequence\n- Keep to the word limit",
     "1. A narrative essay is a natural fit, but reflective, descriptive, discursive and argumentative essays are all accepted.\n2. Use the features expected for the type chosen."),
    ("1.4", 50, "- 'The mask' is figurative; decide what it stands for.\n- Make that meaning clear early.", "- Choose a type\n- Define the mask\n- Plan a clear ending",
     "1. Reflective, descriptive, narrative, discursive and argumentative responses are all accepted.\n2. The essay should have a clear interpretation of the mask."),
    ("1.5", 50, "- Read the quotation slowly: it is about perception.\n- Decide whether you agree.", "- Choose a type\n- Explain the quotation in your own words\n- Support your view with examples",
     "1. Discursive and argumentative responses suit the quotation, and reflective, descriptive or narrative responses are also accepted.\n2. Use clear examples to support your points."),
    ("1.6", 50, "- Look at the picture and decide what it shows literally and what it suggests.\n- Give your own title and link it clearly.", "- Choose a type\n- Give a title\n- Link your essay to the picture",
     "1. The picture (an old man) can be read literally as ageing or grandparents, or figuratively as wisdom and maturity.\n2. Any appropriate tense and any essay type is accepted if the link to the picture is clear."),
    ("1.7", 50, "- Think about what a snarling animal cub suggests.\n- Give your own title and link it to the picture.", "- Choose a type\n- Give a title\n- Link your essay to the picture",
     "1. The picture (a snarling cub) can be read literally as wild animals or youth, or figuratively as strength and tenacity.\n2. Any appropriate tense and any essay type is accepted if the link is clear."),
    ("1.8", 50, "- Look at what is shown and what it might stand for.\n- Give your own title and link it.", "- Choose a type\n- Give a title\n- Link your essay to the picture",
     "1. The picture (eggs on a cloth) can be read literally as eggs or food, or figuratively as rebirth and fragility.\n2. Any appropriate tense and any essay type is accepted if the link is clear."),
]
L.append(dict(order=1, name="Question 1: Essay", marks=50, q="3,4:end=768", memo="2,3,4,5,10",
              tags=["essay_structure", "planning", "creative_writing", "argumentative_writing"],
              header="Question 1: Essay (order 1) — eight topics (1.1–1.5 written prompts, 1.6–1.8 pictures), 250–300 words, 50-mark rubric. Practice covers essay theory on fresh examples (LANG-WR-02).",
              questions=q, ai=ai))

# ──────────────── 2.1 E-mail ────────────────
U = "transactional_writing"
q = []
o, a = ms(["a subject line", "a greeting", "the sender's name at the end"],
          ["the sender's postal address in the top corner", "a postscript in capital letters"])
q.append(Q(1, U, "email", "format_of_an_email", ["identify_format_features"],
           "Select the THREE parts that must appear in a formal e-mail.", o, a, "multi_select", 1, 2,
           "- Think about what a reader sees first and last in an e-mail.\n- Reject parts that belong to a printed letter.",
           "M: memo lists recipient address, subject, salutation, message, ending, sender's name."))
m, a = order5(["Subject line", "Greeting", "Message", "Suitable ending", "Sender's name"], [3, 0, 4, 2, 1])
q.append(Q(2, U, "email", "format_of_an_email", ["order_events"],
           "Arrange the parts of an e-mail in the order in which they appear.", m, a, "ordering", 1, 2,
           "- The subject appears before the greeting.\n- The sender's name comes after the closing words.",
           "M: order of parts as listed in the memo."))
o, a = mc("Dear Mr Dlamini, I am writing to thank you for the guidance you gave me in Grade 8.",
          ["Hey Mr D, what's up? Just saying thanks lol!", "Mr Dlamini!! You were the best ever!!!", "To whom it may concern, this is about the school."])
q.append(Q(3, U, "email", "register_and_tone", ["choose_appropriate_register"],
           "Which opening best suits a formal e-mail to a former teacher?", o, a, "multiple_choice", 2, 2,
           "- The e-mail is addressed to a respected adult in a formal tone.\n- Avoid slang and over-excited punctuation.",
           "M: memo — formal tone and register, addressed to the former teacher."))
o, a = mc("Thank you and my plans after Grade 12", ["Hi!!!", "Something for you", "Please read now"])
q.append(Q(4, U, "email", "subject_line", ["write_subject_line"],
           "Which subject line best suits an e-mail of thanks that also shares your future plans?", o, a, "multiple_choice", 2, 2,
           "- A subject line should tell the reader what the e-mail is about.\n- It should be short and clear.",
           "M: the e-mail must include gratitude and future plans."))
o, a = fitb("Word:", "formal")
q.append(Q(5, U, "email", "register_and_tone", ["choose_appropriate_register"],
           "Which one word describes the tone and register of an e-mail to a former teacher? Write one word.", o, a, "fitb", 1, 1,
           "- Think about how you would speak to a respected adult.\n- Write one word.",
           "M: memo 2.1 'tone and register should be formal'."))
ai = [("2.1", 30, "- Plan the order of the parts before you write.\n- Use a formal tone throughout.",
       "- Address the former teacher\n- Include recipient address, subject, greeting, message, ending and your name\n- Thank the teacher and share your future plans, 120–150 words",
       "1. The e-mail must be formal and addressed to the former teacher.\n2. All the format parts must be present.\n3. The message must show gratitude and share future plans.")]
L.append(dict(order=2, name="Question 2.1: E-mail", marks=30, q="5:start=84:end=362", memo="6:start=138:end=568,11",
              tags=["email", "email_structure", "formal_email", "transactional_writing"],
              header="Question 2.1: E-mail (order 2) — thank a retired teacher and share future plans, 120–150 words, 30-mark rubric.",
              questions=q, ai=ai))

# ──────────────── 2.2 Review ────────────────
q = []
o, a = ms(["the name and location of the restaurant", "the atmosphere", "the quality of service"],
          ["the owner's life story", "a recipe for each dish"])
q.append(Q(1, U, "review", "features_of_a_review", ["identify_format_features"],
           "Select the THREE things a restaurant review must include.", o, a, "multi_select", 1, 2,
           "- Think about what a reader would want to know before visiting.\n- Reject details that do not help the reader decide.",
           "M: memo lists name and location, atmosphere, service, food, rating."))
o, a = match([("atmosphere", "soft lighting and quiet music made the room relaxing"),
              ("service", "the waiter greeted us at once and cleared plates promptly"),
              ("rating", "four out of five stars")])
q.append(Q(2, U, "review", "features_of_a_review", ["match_features_to_examples"],
           "Match each feature of a review to the sentence that gives an example of it.", o, a, "match", 2, 2,
           "- Think about what each sentence describes.\n- One example is a score and not a description.",
           "M: features listed in memo 2.2."))
o, a = mc("Last Saturday, my friends and I finally tried the new bistro on Main Road.",
          ["Restaurants are places where people eat.", "I do not think reviews are very important.", "Dear Sir, I write to complain."])
q.append(Q(3, U, "review", "opening_of_a_review", ["write_an_opening"],
           "Which opening best suits a social media review of a restaurant?", o, a, "multiple_choice", 2, 2,
           "- A review begins by placing the writer at the restaurant.\n- It should draw the reader in with a personal voice.",
           "C: CAPS — review is written for readers; personal voice suits social media (task 2.2)."))
o, a = fitb("Word:", "rating")
q.append(Q(4, U, "review", "features_of_a_review", ["identify_format_features"],
           "Which one word names the score you give at the end of a review (such as four out of five stars)? Write one word.", o, a, "fitb", 1, 1,
           "- It tells the reader how good you thought the restaurant was.\n- Write one word.",
           "M: memo 2.2 'Rating'."))
o, a = mc("It should be honest and balanced, giving reasons for the opinion.", ["It should only praise the food.",
                                                                           "It should only list the prices.", "It should be one sentence long."])
q.append(Q(5, U, "review", "tone_of_a_review", ["choose_appropriate_register"],
           "Which statement best describes the tone and content of a good review?", o, a, "multiple_choice", 2, 2,
           "- Readers trust a review that gives reasons.\n- Reject options that are one-sided or too short.",
           "C: CAPS — evaluative writing gives reasons for opinions."))
ai = [("2.2", 30, "- Include all the required features of a review.\n- Stay within 120–150 words.",
       "- Name and place the restaurant\n- Describe atmosphere, service and food\n- Give a rating, and perhaps comment on value for money",
       "1. The review must name and locate the restaurant.\n2. It must describe atmosphere, quality of service and the type of food.\n3. It must give a rating.\n4. It may discuss specific dishes and value for money.")]
L.append(dict(order=3, name="Question 2.2: Review", marks=30, q="5:start=84:end=236,5:start=364:end=473", memo="6:start=138:end=343,6:start=574:end=766,11",
              tags=["book_review", "evaluative_writing", "transactional_writing", "formal_writing"],
              header="Question 2.2: Review (order 3) — a social-media review of a restaurant, 120–150 words, 30-mark rubric.",
              questions=q, ai=ai))

# ──────────────── 2.3 Dialogue ────────────────
q = []
o, a = mc("A colon after the speaker's name, with a new line for each new speaker.",
          ["A full stop after the speaker's name, with all speakers on one line.", "Quotation marks around the whole conversation.",
           "No names at all, only the words that are spoken."])
q.append(Q(1, U, "dialogue", "layout_of_a_dialogue", ["identify_format_features"],
           "Which statement describes the correct layout of a dialogue?", o, a, "multiple_choice", 1, 2,
           "- Think about how a script shows who is speaking.\n- Each speaker starts on a new line.",
           "M: memo 2.3 format — names on the left, colon, new line for each speaker."))
o, a = mc("SIPHO: (looking at the floor) I'm really sorry about the book.",
          ["Sipho looking at the floor I'm really sorry about the book.", "SIPHO: I'm really sorry about the book, looking at the floor.",
           "Sipho — 'looking at the floor' — I'm really sorry about the book."])
q.append(Q(2, U, "dialogue", "stage_directions", ["format_stage_directions"],
           "Which line shows a stage direction in the correct place and form?", o, a, "multiple_choice", 2, 2,
           "- Actions are given in brackets before the words are spoken.\n- The speaker's name is followed by a colon.",
           "M: memo 2.3 'actions must be given in brackets before the words'."))
m, a = order5(["A brief context", "The first speaker's line", "The second speaker's reply", "Further exchanges"], [1, 3, 0, 2])
q.append(Q(3, U, "dialogue", "layout_of_a_dialogue", ["order_events"],
           "Arrange the parts of a dialogue in the order in which they appear on the page.", m, a, "ordering", 2, 2,
           "- The reader needs the setting before anyone speaks.\n- Replies follow the line they answer.",
           "M: memo 2.3 'a brief context at the beginning'."))
o, a = ms(["the names of the speakers on the left", "a colon after each name"],
          ["a title written after every speech", "all speeches written in one paragraph", "a postal address"])
q.append(Q(4, U, "dialogue", "layout_of_a_dialogue", ["identify_format_features"],
           "Select the TWO format features that a dialogue must have.", o, a, "multi_select", 1, 1,
           "- Think about how a script shows who is speaking.\n- Reject features that belong to other texts.",
           "M: memo 2.3 format features."))
o, a = fitb("Mark:", "colon")
q.append(Q(5, U, "dialogue", "layout_of_a_dialogue", ["identify_format_features"],
           "Which punctuation mark follows the name of the speaker in a dialogue? Write one word.", o, a, "fitb", 1, 1,
           "- It looks like two dots, one above the other.\n- Write one word.",
           "M: memo 2.3 'a colon after the name'."))
ai = [("2.3", 30, "- Begin with a short context line.\n- Show each speaker on a new line with a colon after the name.",
       "- State the setting briefly\n- Use names on the left and colons\n- Put actions in brackets before the words, and keep the tone appropriate",
       "1. The dialogue must begin with a brief context.\n2. Speakers' names are on the left, followed by a colon, with a new line for each new speaker.\n3. Actions, where needed, are given in brackets before the words.\n4. The tone must suit a conversation with a librarian.")]
L.append(dict(order=4, name="Question 2.3: Dialogue", marks=30, q="5:start=84:end=236,5:start=474:end=582", memo="6:start=138:end=343,7:start=83:end=250,11",
              tags=["dialogue", "dialogue_format", "dialogue_structure", "transactional_writing"],
              header="Question 2.3: Dialogue (order 4) — a conversation with a librarian about a damaged book, 120–150 words, 30-mark rubric.",
              questions=q, ai=ai))

# ──────────────── 2.4 Speech ────────────────
q = []
o, a = mc("Good morning, Principal, teachers and fellow learners.", ["Yo, everyone!", "To whom it may concern,", "Dear diary,"])
q.append(Q(1, U, "speech", "salutation_and_tone", ["choose_appropriate_register"],
           "Which salutation best suits a farewell speech at a school assembly?", o, a, "multiple_choice", 1, 2,
           "- A speech opens by greeting the audience in order of importance.\n- Reject greetings that belong to other texts.",
           "M: memo 2.4 'suitable salutation/greeting'."))
m, a = order5(["A greeting to the audience", "An introduction that captures attention", "Well-developed points",
               "A suitable conclusion"], [3, 0, 2, 1])
q.append(Q(2, U, "speech", "structure_of_a_speech", ["order_events"],
           "Arrange the parts of a speech in the order in which they are delivered.", m, a, "ordering", 1, 2,
           "- The audience is greeted before anything else.\n- The conclusion comes last.",
           "M: memo 2.4 introduction, points, conclusion."))
o, a = mc("Have you ever wondered what you will remember about your last day at school?",
          ["My speech is about school.", "I was asked to speak.", "Thank you for listening."])
q.append(Q(3, U, "speech", "introduction_that_captures_attention", ["write_an_opening"],
           "Which opening best captures the attention of the listeners?", o, a, "multiple_choice", 2, 2,
           "- A good opening makes listeners want to hear more.\n- Reject openings that only announce the topic or end the speech.",
           "M: memo 2.4 'introduction that captures the listener's attention'."))
o, a = ms(["a rhetorical question", "direct address to the audience"], ["a long list of dates", "a formal address at the top"])
q.append(Q(4, U, "speech", "speech_techniques", ["identify_persuasive_devices"],
           "Select the TWO techniques that help a speech to hold an audience.", o, a, "multi_select", 2, 2,
           "- Think about how a speaker talks to an audience in the room.\n- Reject features that belong to written letters.",
           "C: CAPS speech features (audience awareness); memo 2.4 'tone and register appropriate for the audience'."))
o, a = fitb("Word:", "conclusion")
q.append(Q(5, U, "speech", "structure_of_a_speech", ["identify_format_features"],
           "What is the name of the final part of a speech that ends the speaker's message? Write one word.", o, a, "fitb", 1, 1,
           "- It follows the main points.\n- Write one word.",
           "M: memo 2.4 'a suitable conclusion'."))
ai = [("2.4", 30, "- Imagine the assembly hall and the audience.\n- Plan introduction, points and conclusion.",
       "- Greet the audience\n- Capture attention at the start\n- Develop your points and end with a suitable conclusion",
       "1. The speech needs a suitable salutation.\n2. The tone and register must suit the audience.\n3. It must have an attention-grabbing introduction, well-developed points and a suitable conclusion.")]
L.append(dict(order=5, name="Question 2.4: Speech", marks=30, q="5:start=84:end=236,5:start=585:end=706", memo="6:start=138:end=343,7:start=292:end=446,11",
              tags=["speech_structure", "formal_writing", "transactional_writing", "register"],
              header="Question 2.4: Speech (order 5) — farewell speech by the outgoing RCL chairperson, 120–150 words, 30-mark rubric.",
              questions=q, ai=ai))

# ──────────────── 3.1 Flyer ────────────────
q = []
o, a = ms(["the date and time of the event", "the venue", "contact details"],
          ["a long history of the organiser", "a full timetable for the whole year"])
q.append(Q(1, U, "flyer", "content_of_a_flyer", ["identify_format_features"],
           "Select the THREE pieces of information a flyer for an event must give.", o, a, "multi_select", 1, 2,
           "- A reader must know when, where and how to find out more.\n- Reject details that are too long for a flyer.",
           "M: memo 3.1 — date, time, venue, contact details."))
o, a = mc("Discover your future: Career Exhibition!", ["Notice", "An exhibition is a place where things are shown", "Please read this paper"])
q.append(Q(2, U, "flyer", "headline_or_slogan", ["write_headline"],
           "Which headline is most eye-catching for a career exhibition flyer?", o, a, "multiple_choice", 2, 2,
           "- A headline should grab attention and suit the event.\n- Reject headlines that are dull or off-topic.",
           "M: memo 3.1 'eye-catching headline, slogan or logo'."))
o, a = mc("Come and meet people who will help you plan your career!", ["The exhibition was held last year.",
                                                                   "Careers are described in many books.", "The school has a hall."])
q.append(Q(3, U, "flyer", "speaking_to_the_reader", ["choose_appropriate_register"],
           "Which sentence speaks directly to the reader of a flyer?", o, a, "multiple_choice", 2, 2,
           "- Look for an invitation that uses 'you' or a command.\n- Reject sentences that only report facts.",
           "M: memo 3.1 'language must speak directly to the reader'."))
o, a = fitb("Words:", "100")
q.append(Q(4, U, "flyer", "length_of_the_text", ["recall_task_requirements"],
           "What is the maximum number of words for the body of a shorter transactional text in this paper? Write the number.", o, a, "fitb", 1, 1,
           "- The paper states a range for Section C.\n- Write digits only.",
           "P: the paper states 80–100 words for Question 3."))
o, a = mc("No marks are given for illustrations or drawings.", ["Illustrations earn extra marks.",
                                                               "A flyer without a drawing fails.", "Only drawings are marked."])
q.append(Q(5, U, "flyer", "what_is_marked", ["recall_task_requirements"],
           "What does the marking guideline say about illustrations on a flyer?", o, a, "multiple_choice", 1, 1,
           "- The task says not to include illustrations.\n- The marker marks the words only.",
           "P/M: the task note and memo 3.1 note."))
ai = [("3.1", 20, "- List the details a visitor needs before you write.\n- Keep to 80–100 words.",
       "- Write an eye-catching headline, slogan or logo\n- Give date, time, venue and contact details\n- Use catchy words that speak to the reader",
       "1. The flyer needs an eye-catching headline, slogan or logo.\n2. It needs enough event details (date, time, venue) and contact details.\n3. Its language may be formal or informal but must speak directly to the reader.\n4. No marks are given for drawings.")]
L.append(dict(order=6, name="Question 3.1: Flyer", marks=20, q="6:start=84:end=360", memo="8:start=138:end=343,8:start=349:end=540,12",
              tags=["advertising", "headline", "transactional_writing", "media_writing"],
              header="Question 3.1: Flyer (order 6) — promoting a career exhibition, 80–100 words, 20-mark rubric.",
              questions=q, ai=ai))

# ──────────────── 3.2 WhatsApp message ────────────────
q = []
o, a = mc("Hi everyone, how about a comedy for movie night? Vote below!", ["Dear Sir/Madam, I respectfully suggest a film.",
                                                                          "Yo guys lol u want a movie or wat??", "Movie."])
q.append(Q(1, U, "whatsapp_message", "tone_of_a_message", ["choose_appropriate_register"],
           "Which message best suits a class group chat when slang must be avoided?", o, a, "multiple_choice", 2, 2,
           "- The tone is informal but clear and polite.\n- Reject options that are too formal, too slangy or too short.",
           "M/P: memo 3.2 informal tone, clear and concise; the paper's note 'avoid slang'."))
o, a = ms(["an informal tone", "clear and concise wording"], ["a formal closing such as 'Yours faithfully'", "a postal address", "long paragraphs"])
q.append(Q(2, U, "whatsapp_message", "features_of_a_message", ["identify_format_features"],
           "Select the TWO features of a WhatsApp message to a classmates' group.", o, a, "multi_select", 1, 1,
           "- Think about how you would write to friends.\n- Reject features that belong to formal letters.",
           "M: memo 3.2."))
o, a = mc("Hi everyone,", ["Dear Principal,", "To whom it may concern,", "Yours sincerely,"])
q.append(Q(3, U, "whatsapp_message", "addressing_recipients", ["choose_appropriate_register"],
           "Which greeting suits a message sent to the whole class group?", o, a, "multiple_choice", 1, 1,
           "- A formal salutation is not needed, but the recipients should be addressed.\n- Reject greetings meant for one formal reader.",
           "M: memo 3.2 'recipients should be addressed appropriately'."))
o, a = fitb("Word:", "concise")
q.append(Q(4, U, "whatsapp_message", "features_of_a_message", ["identify_format_features"],
           "Which one word describes a message that gets to the point in few words? Write one word.", o, a, "fitb", 2, 2,
           "- It means short and clear.\n- Write one word.",
           "M: memo 3.2 'clear and concise'."))
o, a = mc("slang", ["punctuation", "paragraphs", "full stops"])
q.append(Q(5, U, "whatsapp_message", "tone_of_a_message", ["choose_appropriate_register"],
           "Which of these should the writer avoid in this message, according to the task note?", o, a, "multiple_choice", 1, 1,
           "- The task note says what kind of language to avoid.\n- It is informal language used among friends.",
           "P: the paper's note on 3.2."))
ai = [("3.2", 20, "- Think of a few clear ideas for the movie night.\n- Write in an informal tone without slang.",
       "- Address the group\n- Share your ideas clearly and briefly\n- Keep to 80–100 words",
       "1. The tone and register must be informal.\n2. The text must be clear and concise.\n3. A formal salutation is not necessary, but the recipients should be addressed appropriately.\n4. Avoid slang.")]
L.append(dict(order=7, name="Question 3.2: WhatsApp Message", marks=20, q="6:start=84:end=222,6:start=363:end=486", memo="8:start=138:end=343,8:start=545:end=680,12",
              tags=["digital_communication", "register", "language_register", "transactional_writing"],
              header="Question 3.2: WhatsApp Message (order 7) — ideas for a class movie night, 80–100 words, 20-mark rubric.",
              questions=q, ai=ai))

# ──────────────── 3.3 Instructions ────────────────
q = []
o, a = mc("Wipe the surface with a damp cloth.", ["You should wipe the surface with a damp cloth.", "The surface was wiped with a damp cloth.",
                                                 "Wiping the surface is important."])
q.append(Q(1, U, "instructions", "imperative_mood", ["use_the_imperative"],
           "Which sentence is written in the imperative, as instructions should be?", o, a, "multiple_choice", 1, 2,
           "- An imperative sentence gives a command and starts with the verb.\n- Reject sentences that describe or advise.",
           "M: memo 3.3 'must be written in the imperative'."))
m, a = order5(["Fill the kettle with water", "Switch the kettle on", "Wait until the water boils", "Pour the water into the cup"], [2, 0, 3, 1])
q.append(Q(2, U, "instructions", "logical_order", ["order_events"],
           "Arrange these instructions for making a cup of tea in a logical order.", m, a, "ordering", 1, 2,
           "- Each step depends on the one before it.\n- Pouring comes after the water is ready.",
           "M: memo 3.3 'must be logical'."))
o, a = ms(["They must be logical.", "They must be written in the imperative."], ["They must be written in the past tense.",
                                                                                   "They must include a drawing.", "They must be one long sentence."])
q.append(Q(3, U, "instructions", "features_of_instructions", ["identify_format_features"],
           "Select the TWO things that instructions must be.", o, a, "multi_select", 1, 1,
           "- Think about what makes instructions easy to follow.\n- Reject options the task forbids or that confuse the reader.",
           "M: memo 3.3."))
o, a = fitb("Word:", "imperative")
q.append(Q(4, U, "instructions", "imperative_mood", ["use_the_imperative"],
           "What name is given to the form of the verb used to give commands? Write one word.", o, a, "fitb", 2, 2,
           "- It is the form that starts a sentence such as 'Close the door'.\n- Write one word.",
           "M: memo 3.3."))
o, a = mc("First, Next, Then, Finally", ["However, Although, Because, Unless", "Yesterday, Today, Tomorrow", "Maybe, Perhaps, Possibly"])
q.append(Q(5, U, "instructions", "sequencing_words", ["use_sequencing_words"],
           "Which set of words helps a writer to show the order of steps in instructions?", o, a, "multiple_choice", 1, 1,
           "- Think of words that mark the order of actions.\n- Reject words that show contrast, time in general or doubt.",
           "C: CAPS §3.3 transitional/sequencing words for procedural texts."))
ai = [("3.3", 20, "- List the steps in the order a person would do them.\n- Begin each step with a verb.",
       "- Put the steps in a logical order\n- Write each step in the imperative\n- Use point or paragraph form within 80–100 words",
       "1. The instructions may be in point or paragraph form.\n2. They must be logical in sequence.\n3. They must be written in the imperative.\n4. No marks are given for drawings.")]
L.append(dict(order=8, name="Question 3.3: Instructions", marks=20, q="6:start=84:end=222,6:start=487:end=622", memo="8:start=138:end=343,9:start=83:end=205,12",
              tags=["following_instructions", "transactional_writing", "sentence_construction"],
              header="Question 3.3: Instructions (order 8) — how to clean white sneakers, 80–100 words, 20-mark rubric.",
              questions=q, ai=ai))

# ──────────────── emit ────────────────
def js(v):
    return json.dumps(v, ensure_ascii=False, indent=2)


TAIL = open(os.path.join(ROOT, "scripts/add-english-fal-2025-nov-p1-q1.js")).read()
TAIL = TAIL[TAIL.index("// ─── Upload ─"):]
counts = json.load(open("/tmp/claude-1000/fal_p3_counts.json")) if os.path.exists("/tmp/claude-1000/fal_p3_counts.json") else None

for les in L:
    n = les["order"]
    fname = f"add-english-fal-2025-nov-p3-q{n}.js"
    base = f"{BASE}/q{n}"
    c = counts[str(n)] if counts else {"q": 1, "m": 1}
    video = dict(name=les["name"], syllabus="dbe", subject="english_fal", year=2025, paper="nov_p3", order=n,
                 content_tier="free", has_video=False, xp=50, tags=les["tags"],
                 question_image_urls=[f"{base}/question_{i}.png" for i in range(1, c["q"] + 1)],
                 memo_image_urls=[f"{base}/memo_{i}.png" for i in range(1, c["m"] + 1)],
                 exam_question_marks=les["marks"], supplementary_materials=None)
    qs, basis = [], []
    for x, b in les["questions"]:
        d = dict(xp=10, syllabus="dbe", subject="english_fal", year=2025, paper="nov_p3", name=f"Question {x['order']}")
        d.update(x)
        qs.append(d)
        basis.append(b)
    aiobj = dict(sub_questions=[dict(number=a_[0], marks=a_[1], clues=a_[2], approach=a_[3], solution=a_[4]) for a_ in les["ai"]],
                 model="claude-sonnet-5-5", generated_at="__NOW__", version=2, reviewed=False, input_tokens=0, output_tokens=0,
                 avg_rating=None, rating_count=None)
    basis_block = "\n".join(f" *   Q{i+1}: {b}" for i, b in enumerate(basis))
    body = f"""#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2025 — {les['header']}
 * Practice questions test the conventions and criteria of the text type on FRESH scenarios (LANG-WR-01/03); they never
 * reuse the real task's content (DESIGN-UNI-01). aiExplanation: one entry per REAL task with its real marks (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * BASIS per practice question — M = marking guideline, P = printed in the paper, C = CAPS §3.3/§3.4:
{basis_block}
 *
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

// ─── Lesson document ─────────────────────────────────────────────────────────

const video = {js(video)};

// ─── Practice questions ──────────────────────────────────────────────────────

const questions = {js(qs)};

// ─── AI explanation — one entry per REAL task, real marks (AIEXP-08) ─────────

const aiExplanation = {js(aiobj).replace('"__NOW__"', 'Date.now()')};

{TAIL}"""
    open(os.path.join(ROOT, "scripts", fname), "w").write(body)
    print("wrote", fname, len(qs), "questions,", len(les["ai"]), "ai")

# seed
seedp = os.path.join(ROOT, "tools/seeds/english-fal-curriculum.json")
seed = json.load(open(seedp))
NEED = {"transactional_writing": ["review"]}
for u in seed["units"]:
    for t in NEED.get(u["slug"], []):
        if t not in {x["slug"] for x in u["topics"]}:
            u["topics"].append(dict(slug=t, name=t.replace("_", " ").title()))
have = {k["id"] for k in seed["skills"]}
for les in L:
    for x, _b in les["questions"]:
        for u in seed["units"]:
            if u["slug"] != x["unit"]:
                continue
            for t in u["topics"]:
                if t["slug"] == x["topic"]:
                    st = t.setdefault("subtopics", [])
                    if x["subtopic"] not in {s["slug"] for s in st}:
                        st.append(dict(slug=x["subtopic"], name=x["subtopic"].replace("_", " ").title()))
        for s in x["skills"]:
            if s not in have:
                seed["skills"].append(dict(id=s, name=s[len("english_fal_"):].replace("_", " ").capitalize()))
                have.add(s)
json.dump(seed, open(seedp, "w"), indent=2, ensure_ascii=False)
json.dump({str(l["order"]): {"q": l["q"], "memo": l["memo"]} for l in L}, open("/tmp/claude-1000/fal_p3_specs.json", "w"))
print("seed skills", len(seed["skills"]))
