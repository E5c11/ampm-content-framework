#!/usr/bin/env python3
"""Generates scripts/add-english-fal-2025-nov-p2-q<lesson>.js (12 lessons) and updates the seed file."""
import json, os, itertools

ROOT = "/home/emmanuel/WebstormProjects/ampm-content-framework"
BASE = "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2"

# cycle of correct-answer positions for multiple_choice (index 0 used ~10%)
POS = itertools.cycle([1, 2, 3, 1, 3, 2, 0, 2, 1, 3, 2, 1, 3, 1, 2, 3, 0, 1, 2, 3])


def mc(correct, wrong):
    i = next(POS)
    opts = list(wrong)
    opts.insert(i, correct)
    return opts + [""] * (5 - len(opts)), [correct, "", "", "", ""]


def ms(correct, wrong):
    opts = list(correct) + list(wrong)
    # interleave deterministically so correct options are not all first
    order = [opts[i] for i in (0, 2, 1, 3, 4)][: len(opts)] if len(opts) == 5 else opts
    ans = list(correct) + [""] * (5 - len(correct))
    return order, ans


def match(pairs):
    left = [f"{'ABC'[i]} - {p[0]}" for i in range(3) for p in [pairs[i]]]
    right = [f"{i+1} - {p[1]}" for i, p in enumerate(pairs)]
    # rotate right side so numbers do not follow the letters
    right_shuf = [right[1], right[2], right[0]]
    ans = []
    for i in range(3):
        n = right_shuf.index(right[i]) + 1
        ans.append(f"{'ABC'[i]}-{n}")
    right_labelled = [f"{k+1} - {r.split(' - ',1)[1]}" for k, r in enumerate(right_shuf)]
    return left + right_labelled, ans + ["", ""]


def fitb(label, answer):
    return [label, "[ ]"], [answer, "", "", "", ""]


def Q(order, unit, topic, subtopic, skills, question, metadata, answer, pres, diff, w, clues, ctx=None):
    d = dict(order=order, context_text=ctx, question=question, metadata=metadata, answer=answer, presentation=pres,
             type="application", unit=unit, topic=topic, subtopic=subtopic,
             skills=["english_fal_" + s for s in skills], difficulty=diff, exam_weight=w, clues=clues)
    if pres == "fitb":
        d["keyboard_type"] = "text"
    return d


L = []  # lessons


def lesson(order, name, key, unit, label, marks, q_spec, m_spec, tags, header, questions, ai, supp_files):
    L.append(dict(order=order, name=name, key=key, unit=unit, label=label, marks=marks, q=q_spec, memo=m_spec,
                  tags=tags, header=header, questions=questions, ai=ai, supp_files=supp_files))


def ai(*rows):
    return list(rows)


# ──────────────────────────── 1.1 Cry, the Beloved Country — Extract A ────────────────────────────
U, T = "novel", None
qs = []
o, a = match([("Stephen Kumalo", "a priest from Ndotsheni who travels to Johannesburg"),
              ("John Kumalo", "a carpenter who has become a politician"),
              ("Absalom Kumalo", "Stephen's son, found guilty of murdering Arthur Jarvis")])
qs.append(Q(1, U, "character_analysis", "match_characters_to_roles", ["match_characters_to_roles"],
            "Match each character from Cry, the Beloved Country to the description that fits him.", o, a, "match", 2, 2,
            "- Think about where each character lives and works in the novel.\n- Start with the character you know best and remove that pair."))
o, a = mc("personification", ["simile", "hyperbole", "irony"])
qs.append(Q(2, U, "figurative_language", "personification_identification", ["identify_figure_of_speech"],
            "Which figure of speech is used in the sentence below?", o, a, "multiple_choice", 2, 2,
            "- Ask whether a non-living thing is given the actions of a person.\n- Check for the words 'like' or 'as' before choosing.",
            ctx="The silence in the little room reached out and gripped his hand."))
o, a = mc("humble", ["arrogant", "deceitful", "impatient"])
qs.append(Q(3, U, "character_analysis", "character_from_words", ["infer_character_from_words"],
            "What does the sentence below reveal about the speaker's character?", o, a, "multiple_choice", 2, 2,
            "- Look at how the speaker describes himself and his own importance.\n- Consider whether he is boasting or playing himself down.",
            ctx="'I am only a poor country priest,' said the old man, 'and I know nothing of this great city.'"))
o, a = ms(["To find his sister Gertrude, who is reported to be ill", "To find his son Absalom, who has stopped writing"],
          ["To collect payment owed to his church", "To attend a meeting called by the Bishop", "To open a school in the city"])
qs.append(Q(4, U, "plot_structure", "reasons_for_journey", ["identify_stated_reasons"],
            "Select the TWO reasons why Stephen Kumalo travels from Ndotsheni to Johannesburg.", o, a, "multi_select", 2, 2,
            "- Think about which members of his family have not been heard from.\n- The reasons concern family, not church business."))
o, a = mc("Mrs Kumalo comforts Stephen when he is anxious about his journey and cares for Absalom's pregnant wife.",
          ["Mrs Kumalo travels with Stephen to Johannesburg to search for their son.",
           "Mrs Kumalo visits Absalom regularly while he waits on death row.",
           "Mrs Kumalo refuses to take the young girl into her home."])
qs.append(Q(5, U, "theme_identification", "discuss_view_with_evidence", ["substantiate_a_view"],
            "Mrs Kumalo is a supportive person. Which ONE answer is best substantiated by events in the novel?", o, a,
            "multiple_choice", 3, 3,
            "- Check each option against what Mrs Kumalo actually does in the story.\n- A well-substantiated answer refers to specific actions."))
A = ai(
    ("1.1.1", 4, "- Re-read each name in COLUMN A and recall what the character does in the novel.\n- Work from the descriptions you are sure of first.",
     "- Match the characters you know well\n- Use the unused descriptions for the remainder\n- Check each pair against the novel",
     "1. Gertrude is jailed for brewing liquor at home.\n2. James Jarvis arranges for the dam to be built.\n3. Arthur Jarvis is known for his charity work among black people.\n4. Mrs Lithebe provides Stephen with a room in Johannesburg."),
    ("1.1.2", 3, "- Look at what Kumalo's voice is said to do to Msimangu.\n- A voice cannot normally touch a person.",
     "- Name the figure of speech\n- Explain what it is compared to\n- Link it to Msimangu's feelings",
     "1. The line gives a quality of a living being to something that is not, so it is personification (metaphor is also accepted).\n2. Kumalo's humble voice 'touches' Msimangu as a kind act would, showing how deeply he is moved."),
    ("1.1.3", 2, "- Read what Msimangu says about himself.\n- Think about whether it shows pride or honesty.",
     "- Quote the line\n- Name the trait it shows\n- Support the trait with his own words",
     "1. Msimangu admits he is a selfish and sinful man.\n2. This shows he is modest, honest and self-aware."),
    ("1.1.4", 2, "- Think about how Kumalo would react to learning his brother is a politician.\n- The tone is one word; the reason refers to what he has just learned.",
     "- Choose a word for the tone\n- Link it to what Kumalo has just heard",
     "1. The tone is surprise or shock.\n2. Kumalo is in total disbelief that his brother John is into politics."),
    ("1.1.5", 2, "- Irony is a gap between what is said and what is true.\n- Think about John's actions compared with his reputation.",
     "- Give what Msimangu says\n- Give the contrasting reality\n- Link the two parts",
     "1. Msimangu calls John a great man in politics.\n2. In reality John is a powerful speaker who lacks the conviction to take real action, or is afraid of prison."),
    ("1.1.6", 2, "- Think about what has gone wrong in Kumalo's family in Johannesburg.\n- You need two separate points.",
     "- Recall the family's troubles\n- Pick two distinct points",
     "1. John has abandoned the church.\n2. Any other valid point: John lives with a mistress, Gertrude has turned to prostitution, or Gertrude sells illegal liquor."),
    ("1.1.7", 3, "- Decide your view, then support it with events from the whole novel.\n- A bare yes or no earns nothing.",
     "- State your view\n- Give two or three pieces of evidence\n- Link each to Mrs Kumalo's actions",
     "1. Yes: she supports Stephen quietly and patiently, comforts him before his journey and cares for Absalom's wife during her pregnancy.\n2. No: she stays in Ndotsheni when Absalom is arrested, tried and sentenced, and does not visit him on death row.\n3. Either view must be substantiated from the novel."),
)
lesson(1, "Question 1.1: Cry, the Beloved Country", "cry_the_beloved_country", "novel", "Extract A", 18,
       "6:end=746", "3:start=210,4:end=604", ["literary_essay", "character_analysis", "figurative_language", "tone"],
       "Cry, the Beloved Country — Extract A (Kumalo and Msimangu, Book 1 Ch. 5). 1.1.1–1.1.7, 18 marks. Practice covers: matching characters, figure of speech, character from words, stated reasons, evaluating a view.",
       qs, A, [("Extract A", ["annexure_extract_a_1"])])

# ──────────────────────────── 1.2 Cry — Extract B ────────────────────────────
qs = []
qs.append(None)
o, a = mc("a letter written from prison", ["a report from a social worker", "a telegram from the Bishop", "a note from a priest"])
qs[-1] = Q(1, U, "plot_structure", "key_events", ["recall_key_events"],
           "What kind of text is described in the extract?", o, a, "multiple_choice", 2, 2,
           "- Think about who is writing, to whom, and from where.\n- Look at what the writer tells his family.",
           ctx="A young man, locked in a prison cell, writes to his parents to tell them that he is in good health and that he does not expect to see his home again.")
o, a = mc("accepting of what is going to happen to him", ["furious with the people who convicted him",
                                                          "hopeful that the sentence will be reduced", "indifferent to his parents' feelings"])
qs.append(Q(2, U, "character_analysis", "state_of_mind", ["infer_state_of_mind"],
            "What does the sentence below tell us about the writer's state of mind?", o, a, "multiple_choice", 3, 2,
            "- Look at how he describes his surroundings and how he is treated.\n- Ask whether the tone is angry, hopeful or calm.",
            ctx="This is a quiet place. I am locked in, but the men are not unkind to me, and I have made my peace with it."))
o, a = match([("Absalom", "writes a letter from prison to his parents"),
              ("The priest from Pretoria", "prepares Absalom for his death"),
              ("Stephen Kumalo", "reads the letter at home in Ndotsheni")])
qs.append(Q(3, U, "plot_structure", "key_events", ["match_characters_to_roles"],
            "Match each person in the extract to what he does.", o, a, "match", 2, 2,
            "- Think about who writes, who reads and who ministers to the prisoner.\n- Use the pair you are certain about first."))
o, a = ms(["Drought and poor farming conditions cause suffering in Ndotsheni", "Stephen Kumalo searches for family members he has lost"],
          ["Arthur Jarvis is rewarded for his work", "John Kumalo grows rich through his political speeches", "The Bishop retires from the church"])
qs.append(Q(4, U, "theme_identification", "theme_of_hardship", ["identify_theme_evidence"],
            "Select the TWO events that best show the theme of hardship in the novel.", o, a, "multi_select", 3, 3,
            "- Look for events where characters suffer loss, poverty or fear.\n- Two options describe success or comfort; they do not show hardship."))
o, a = mc("Stephen turns to prayer when Gertrude and Absalom are in trouble, but he also doubts when he discovers Absalom's crime.",
          ["Stephen never prays because he believes the church has failed South Africa.",
           "Stephen's faith is never tested because his family is safe.",
           "Stephen leaves the priesthood as soon as he arrives in Johannesburg."])
qs.append(Q(5, U, "theme_identification", "discuss_view_with_evidence", ["substantiate_a_view"],
            "Stephen Kumalo's faith is what carries him through his sufferings. Which ONE answer is best substantiated by events in the novel?",
            o, a, "multiple_choice", 3, 3,
            "- Look for an option that mentions both his faith and moments of doubt.\n- Rule out options that contradict the novel."))
A = ai(
    ("1.2.1", 2, "- Think about what has just happened at the Kumalo home and what the child brings.\n- Give both a time and a place.",
     "- Identify the event before the extract\n- Name the setting", "1. The scene takes place after a child delivers letters at the Kumalo home.\n2. The place is the Kumalo home in Ndotsheni."),
    ("1.2.2", 1, "- Look at what Absalom is writing about when he says 'the thing that I have done'.\n- Think of the crime in the novel.",
     "- Recall the crime\n- State it briefly", "1. 'The thing' refers to the murder of Arthur Jarvis."),
    ("1.2.3", 2, "- Look at how Absalom describes the prison and the way he is treated.\n- The words are calm, not angry.",
     "- Describe his tone\n- Support it with a detail", "1. Absalom is accepting as he tries to reassure his parents that he has made peace with his fate.\n2. He says he is locked in, can smoke and read, and the white men do not speak badly to him."),
    ("1.2.4", 2, "- Think about what a priest does for a condemned person.\n- Link it to his coming execution.",
     "- Say what the priest does\n- Say what the preparation is for", "1. The priest prays for and ministers to Absalom.\n2. This prepares him spiritually and emotionally for his hanging."),
    ("1.2.5", 2, "- Recall what happens at the retrial of the other two men.\n- Why would a judge order more investigation?",
     "- Identify what the judge instructs\n- State what is investigated", "1. The judge orders further investigation.\n2. It concerns Matthew and Johannes's previous criminal activities."),
    ("1.2.6", 1, "- Recall how Arthur's servant is attacked in the house.\n- One option is a heavy tool, not a household item.",
     "- Remember the attack\n- Choose the weapon", "1. Johannes attacks Arthur's servant with an iron bar, so the answer is A.\n2. A bread knife, milk can and old shovel are not what the novel names."),
    ("1.2.7", 1, "- Look at who sends Stephen to Pietermaritzburg in the story.\n- The correct word is a title of an office in the church.",
     "- Read the statement\n- Find the word that is wrong\n- Replace it with the word that makes the statement true", "1. It is the Bishop, not the policeman, who sends Stephen to Pietermaritzburg."),
    ("1.2.8", 3, "- Think of the different people in the novel who suffer.\n- Give examples from more than one character.",
     "- Define hardship\n- Give two or three examples from the novel\n- Link each to a character", "1. James Jarvis and his wife suffer the loss of their son Arthur.\n2. The Ndotsheni villagers endure droughts and poor farming conditions.\n3. Stephen suffers while searching for his missing family members."),
    ("1.2.9", 3, "- Decide whether his faith carries him or fails him, then support your view.\n- A bare yes or no earns nothing.",
     "- State your view\n- Give evidence of his faith\n- Give evidence of his doubt", "1. Yes: he turns to scripture and prayer, accepts Father Vincent's counsel to pray and rest, and his meetings with Msimangu restore his faith in people.\n2. No: he doubts when Absalom's crime is discovered, is overwhelmed by the city's corruption and directs anger at God."),
)
lesson(2, "Question 1.2: Cry, the Beloved Country", "cry_the_beloved_country", "novel", "Extract B", 17,
       "7:start=430,8", "4:start=632,5", ["literary_essay", "character_analysis", "thematic_analysis"],
       "Cry, the Beloved Country — Extract B (Absalom's letter, Book 3 Ch. 3). 1.2.1–1.2.9, 17 marks.",
       qs, A, [("Extract B", ["annexure_extract_b_1"])])

# ──────────────────────────── 2.1 Jekyll and Hyde — Extract C ────────────────────────────
qs = []
o, a = match([("Mr Utterson", "a lawyer who investigates the mystery of Mr Hyde"),
              ("Mr Enfield", "a relative of Utterson who tells the story of the door"),
              ("Poole", "Dr Jekyll's loyal servant")])
qs.append(Q(1, U, "character_analysis", "match_characters_to_roles", ["match_characters_to_roles"],
            "Match each character from Strange Case of Dr Jekyll and Mr Hyde to the description that fits.", o, a, "match", 2, 2,
            "- Think about who tells the story at the door and who is employed by Jekyll.\n- Use the pair you are sure of to narrow the rest."))
o, a = mc("metaphor", ["simile", "alliteration", "onomatopoeia"])
qs.append(Q(2, U, "figurative_language", "metaphor_identification", ["identify_figure_of_speech"],
            "Which figure of speech is used in the sentence below?", o, a, "multiple_choice", 2, 2,
            "- Look for a direct comparison without 'like' or 'as'.\n- Ask whether the sentence says one thing IS another.",
            ctx="The fog was a grey blanket that smothered the street."))
o, a = ms(["He wants to avoid a confrontation with the bystanders", "He wants to avoid the police becoming involved"],
          ["He wants the girl's family to forgive him because he is sorry", "He wants to buy the house with the door", "He wants to impress Mr Utterson"])
qs.append(Q(3, U, "plot_structure", "motives_in_context", ["identify_stated_reasons"],
            "Select the TWO reasons why Mr Hyde agrees to pay the child's family.", o, a, "multi_select", 3, 2,
            "- Think about who surrounds Hyde when he is caught.\n- Consider what trouble he would face if he refused to pay."))
o, a = mc("confident and sarcastic", ["frightened and apologetic", "sad and ashamed", "excited and eager"])
qs.append(Q(4, U, "tone_and_mood", "tone_identification", ["identify_tone"],
            "What tone would a speaker use for the words below?", o, a, "multiple_choice", 3, 2,
            "- Think about how a person who is sure of himself would say these words.\n- A reassuring promise can also sound mocking.",
            ctx="'You need not worry,' said the stranger coolly. 'The money will be paid in full, and I will wait here while it is fetched.'"))
o, a = mc("Utterson avoids gossip when Enfield tells his story, and only acts to investigate Hyde after the murder.",
          ["Utterson spreads Enfield's story to all his friends.", "Utterson breaks into houses at the start of the book.",
           "Utterson ignores every rumour about Hyde."])
qs.append(Q(5, U, "theme_identification", "discuss_view_with_evidence", ["substantiate_a_view"],
            "Mr Utterson respects boundaries. Which ONE answer is best substantiated by events in the novel?", o, a,
            "multiple_choice", 3, 3,
            "- Look for an option that shows Utterson holding back before he acts.\n- Eliminate options that are not in the novel."))
A = ai(
    ("2.1.1", 4, "- Think about each character's role in the story of Hyde.\n- Poole is a servant; Lanyon is a doctor.",
     "- Match the characters you know first\n- Use the remaining descriptions for the others",
     "1. Poole is a concerned servant.\n2. Lanyon is the friend whose friendship with Jekyll is broken up.\n3. Enfield witnesses the violent act.\n4. Hyde commits the vicious murder."),
    ("2.1.2", 2, "- Think about what Utterson and Enfield are doing in the opening chapter.\n- Say where they are.",
     "- Give the occasion\n- Give the place", "1. It is during Utterson and Enfield's Sunday walk.\n2. They are in a London street opposite the mysterious door."),
    ("2.1.3", 2, "- Think about the crowd gathered around Hyde.\n- What does Hyde stand to lose if he does not pay?",
     "- Say what Hyde must do\n- Give a reason", "1. Hyde must pay compensation for the injury he caused to the girl.\n2. Or he pays to avoid confrontation with the bystanders and the police."),
    ("2.1.4", 3, "- Look at what the word 'screwed' is usually used for.\n- Link it to the pressure on Hyde.",
     "- Name the figure of speech\n- Explain the comparison", "1. The lines use a metaphor.\n2. As a screw is tightened with pressure, the bystanders pressure Hyde to compensate the child's family."),
    ("2.1.5", 1, "- Think about whose signature is on the cheque.\n- The name belongs to one of Utterson's friends.",
     "- Read the statement\n- Identify the wrong word\n- Replace it", "1. The name that cannot be mentioned is that of Jekyll, not Lanyon."),
    ("2.1.6", 2, "- Think about Hyde's attitude to the cheque.\n- The words are meant to calm the others.",
     "- Name the tone\n- Link it to Hyde's belief about the cheque", "1. The tone is reassuring, confident or sarcastic.\n2. Hyde is certain that the cheque is valid."),
    ("2.1.7", 3, "- Decide whether Utterson stays within limits, then use events from the book.\n- A bare yes or no earns nothing.",
     "- State your view\n- Give two or three examples", "1. Yes: he keeps quiet about the contents of Jekyll's will, avoids gossip when Enfield tells his story and investigates only after Carew's murder.\n2. No: he secretly follows Hyde, breaks down Jekyll's laboratory door and keeps questioning Jekyll despite being told not to."),
)
lesson(3, "Question 2.1: Strange Case of Dr Jekyll and Mr Hyde", "strange_case_of_dr_jekyll_and_mr_hyde", "novel", "Extract C", 17,
       "9:start=510,10:end=386", "6:start=150,7:end=279", ["literary_essay", "character_analysis", "figurative_language"],
       "Strange Case of Dr Jekyll and Mr Hyde — Extract C (Enfield's story, 'Story of the Door'). 2.1.1–2.1.7, 17 marks.",
       qs, A, [("Extract C", ["annexure_extract_c_1"])])

# ──────────────────────────── 2.2 Jekyll — Extract D ────────────────────────────
qs = []
o, a = mc("Utterson fears that Hyde will kill Jekyll, but Jekyll and Hyde are the same person.",
          ["Utterson expects Jekyll to murder Hyde, who is actually his enemy.",
           "Utterson fears Jekyll will leave London, though Jekyll plans to stay.",
           "Utterson believes Poole is lying, but Poole is telling the truth."])
qs.append(Q(1, U, "dramatic_techniques", "irony_in_prose", ["explain_irony"],
            "What is the irony in the speaker's words in the extract?", o, a, "multiple_choice", 3, 3,
            "- Irony is a gap between what a character believes and what the reader knows.\n- Think about the secret the reader already suspects.",
            ctx="'He wishes to kill you,' said Utterson, 'and you are lucky to be alive.'"))
o, a = mc("remorseful", ["cheerful", "bored", "angry at others"])
qs.append(Q(2, U, "character_analysis", "state_of_mind", ["infer_state_of_mind"],
            "What do the lines below reveal about Dr Jekyll's state of mind?", o, a, "multiple_choice", 2, 2,
            "- Look at his gesture and the words about a lesson.\n- Think about how someone speaks after a terrible event.",
            ctx="'God forgive me,' said the doctor, and he sank into a chair with his head in his hands."))
o, a = ms(["It has no return address", "The handwriting is Jekyll's own"],
          ["It was delivered by a messenger Poole could describe", "It arrived with a gift for Utterson", "It was written in a foreign language"])
qs.append(Q(3, U, "plot_structure", "clues_in_letter", ["identify_stated_reasons"],
            "Select the TWO things that are strange about the letter Utterson asks Poole about.", o, a, "multi_select", 3, 2,
            "- Think about how the letter reached the house and who it is addressed to.\n- Two options are about its delivery or contents and are false."))
o, a = mc("rational and careful", ["rash and impulsive", "gullible", "cruel"])
qs.append(Q(4, U, "character_analysis", "character_from_words", ["infer_character_from_words"],
            "What does the passage below reveal about Mr Utterson's character at this point?", o, a, "multiple_choice", 2, 2,
            "- Look at how he reasons from evidence before acting.\n- Consider whether he jumps to conclusions.",
            ctx="Utterson weighed each fact in turn and allowed himself no conclusion that the evidence did not support."))
o, a = fitb("Theme:", "trust")
qs.append(Q(5, U, "theme_identification", "theme_identification", ["identify_theme"],
            "Jekyll shares his will with Utterson and sends Poole for powders. Name the theme these events show. Write one word.",
            *fitb("Theme:", "trust"), "fitb", 2, 2,
            "- Think about what Jekyll must believe about Utterson and Poole.\n- The theme concerns confidence in other people."))
A = ai(
    ("2.2.1", 2, "- Irony is a gap between what a character knows and what is true.\n- Think about who Hyde really is.",
     "- Say what Utterson believes\n- Say what is true", "1. Utterson thinks Hyde wants to murder Jekyll.\n2. Unknown to him, Jekyll and Hyde are the same person."),
    ("2.2.2", 2, "- Think about how Jekyll speaks and what he does with his hands.\n- Link it to the murder.",
     "- Name the state of mind\n- Give the cause", "1. Jekyll is remorseful.\n2. He feels terrible about Hyde's murder of Sir Danvers Carew."),
    ("2.2.3", 4, "- Think about how the letter arrived and what Utterson notices about the handwriting.\n- Why would Jekyll forge a note from Hyde?",
     "- List two strange features\n- State the letter's purpose", "1. (a) The letter has no return address, no envelope, or the handwriting is Jekyll's own.\n2. (b) Jekyll writes it to deceive the police and distance himself from Hyde."),
    ("2.2.4", 2, "- Look at how Utterson works out the letter's source.\n- Is he emotional or careful?",
     "- Name the trait\n- Give the evidence", "1. Utterson is rational, logical or analytical.\n2. He does not make unfounded assumptions."),
    ("2.2.5", 2, "- The newsboys shout about a murder of an MP.\n- Recall the weapon's origin.",
     "- Name the MP\n- Recall who gave the weapon", "1. The MP is Sir Danvers Carew.\n2. The weapon, a cane, was a gift from Mr Utterson, so the answer is B."),
    ("2.2.6", 3, "- Think about who trusts whom in the novel.\n- Give examples from more than one character.",
     "- Define the theme\n- Give two or three examples", "1. Jekyll shares his will with Utterson.\n2. Jekyll trusts Poole to fetch powders from Maw's.\n3. Poole trusts Utterson with the problem of the stranger in the laboratory."),
    ("2.2.7", 3, "- Decide your view, then support it with events in the book.\n- A bare yes or no earns nothing.",
     "- State your view\n- Give evidence for it\n- Consider the opposite", "1. Yes: Hyde beats Carew to death with a cane, strikes a woman without reason and Jekyll fears being trapped as Hyde.\n2. No: Hyde is Jekyll's creation, acts on Jekyll's dark side and Jekyll's guilt makes him stop the potion."),
)
lesson(4, "Question 2.2: Strange Case of Dr Jekyll and Mr Hyde", "strange_case_of_dr_jekyll_and_mr_hyde", "novel", "Extract D", 18,
       "11:start=84:end=750", "7:start=307,8:end=722", ["literary_essay", "thematic_analysis", "irony"],
       "Strange Case of Dr Jekyll and Mr Hyde — Extract D (Utterson visits Jekyll, 'Incident of the Letter'). 2.2.1–2.2.7, 18 marks.",
       qs, A, [("Extract D", ["annexure_extract_d_1"])])

# ──────────────────────────── 3.1 Macbeth — Extract E ────────────────────────────
U = "drama"
qs = []
o, a = match([("Macbeth", "murders the king and is crowned in his place"),
              ("Banquo", "is told his descendants will be kings"),
              ("Macduff", "leaves Scotland to join Malcolm in England")])
qs.append(Q(1, U, "character_analysis", "match_characters_to_roles", ["match_characters_to_roles"],
            "Match each character from Macbeth to the description that fits him.", o, a, "match", 2, 2,
            "- Think about who receives which prophecy and who flees to England.\n- Use the pair you are certain about first."))
o, a = mc("troubled", ["calm", "amused", "bored"])
qs.append(Q(2, U, "character_analysis", "state_of_mind", ["infer_state_of_mind"],
            "What do the lines below tell us about the speaker's state of mind?", o, a, "multiple_choice", 2, 2,
            "- Look at what the speaker fears the ground may reveal.\n- Think about how a person feels before committing a crime.",
            ctx="Is this a dagger which I see before me, the handle toward my hand? Come, let me clutch thee."))
o, a = mc("personification", ["simile", "oxymoron", "onomatopoeia"])
qs.append(Q(3, U, "figurative_language", "personification_identification", ["identify_figure_of_speech"],
            "Which figure of speech is used in the lines below?", o, a, "multiple_choice", 2, 2,
            "- Ask whether an object or animal is given human actions.\n- Look at what the stones are said to do.",
            ctx="Stars, hide your fires; let not light see my black and deep desires."))
o, a = fitb("Name:", "Fleance")
qs.append(Q(4, U, "plot_structure", "key_events", ["recall_key_events"],
            "Which character, Banquo's son, escapes when the murderers attack his father?", *fitb("Name:", "Fleance"), "fitb", 2, 2,
            "- Think about the banquet scene and who is missing from it.\n- Write a single name.",
            ctx="Banquo is murdered on the road to the banquet, but his son manages to flee."))
o, a = mc("Macbeth and Macduff are in conflict because Macbeth murders Duncan and Macduff's family, so Macduff must challenge him.",
          ["Macbeth and Macduff are in conflict because Macduff plots to kill Duncan himself.",
           "Macbeth and Macduff are rivals only because they both love Lady Macbeth.",
           "Macbeth and Macduff never meet because Macduff is not in Scotland."])
qs.append(Q(5, U, "theme_identification", "discuss_view_with_evidence", ["substantiate_a_view"],
            "The conflict between Macbeth and Macduff is necessary in the play. Which ONE answer is best substantiated by events in the play?",
            o, a, "multiple_choice", 3, 3,
            "- Think about what Macbeth does that Macduff must answer.\n- Reject options that are not in the play."))
A = ai(
    ("3.1.1", 4, "- Think about what each character does or is told in the play.\n- Match the ones you are sure of first.",
     "- Match Malcolm, Fleance, Ross and Macbeth to their descriptions\n- Check each pair against the play",
     "1. Malcolm seeks the help of King Edward the Confessor.\n2. Fleance is predicted to become the king of Scotland (through Banquo's line).\n3. Ross tries to save the lives of Macduff's family.\n4. Macbeth is Thane of Glamis when the play opens."),
    ("3.1.2", 2, "- Look at what Macbeth does not want the earth to hear.\n- What feeling comes with such fear?",
     "- Name the state of mind\n- Support it with his words", "1. Macbeth is anxious or nervous.\n2. He agonises over his footsteps being heard."),
    ("3.1.3", 3, "- The bell is a signal; think about the plan for the night.\n- Use the stage direction for the place.",
     "- Say what the bell signals\n- Place the scene", "1. (a) The bell signals that Macbeth should go and kill Duncan, as the guards are drugged and all is ready.\n2. (b) It takes place after Macbeth's vision of a dagger, in the courtyard of his castle, before he kills Duncan."),
    ("3.1.4", 3, "- An owl and a bellman are given roles beyond their usual ones.\n- Link the owl's shriek to death.",
     "- Name the figure of speech\n- Explain the comparison", "1. The lines use metaphor or personification.\n2. The owl's shriek is like a bellman's final good-night to a condemned man, foreshadowing Duncan's murder."),
    ("3.1.5", 1, "- Think about who watches over a king while he sleeps.\n- Rule out options that are not people.",
     "- Read the word 'grooms' in context\n- Choose the best meaning", "1. The grooms are Duncan's guards, so the answer is C."),
    ("3.1.6", 2, "- Think about what Lady Macbeth says about the attempt and the deed.\n- Is she afraid of the murder itself or of being caught?",
     "- State her fear\n- Link it to the lines", "1. She fears that they might be caught out in the attempt to kill Duncan.\n2. She fears being found out more than the deed itself."),
    ("3.1.7", 3, "- Decide your view, then support it with events from the whole play.\n- A bare yes or no earns nothing.",
     "- State your view\n- Give evidence\n- Link to the conflict's consequences", "1. Yes: Macduff acts against Macbeth the perpetrator, is not 'born of woman' and must heal Scotland by killing the tyrant.\n2. No: the conflict would not exist if Macbeth had not believed the witches or murdered Macduff's family."),
)
lesson(5, "Question 3.1: Macbeth", "macbeth", "drama", "Extract E", 18,
       "13,14:end=141", "9:start=221,10:end=532", ["literary_essay", "character_analysis", "figurative_language", "dramatic_techniques"],
       "Macbeth — Extract E (Macbeth and Lady Macbeth before and after the murder, Act 2 Sc 1–2). 3.1.1–3.1.7, 18 marks.",
       qs, A, [("Extract E", ["annexure_extract_e_1"])])

# ──────────────────────────── 3.2 Macbeth — Extract F ────────────────────────────
qs = []
o, a = fitb("Word:", "Cawdor")
qs.append(Q(1, U, "plot_structure", "key_events", ["recall_key_events"],
            "After the battle, Duncan makes Macbeth Thane of …", *fitb("Word:", "Cawdor"), "fitb", 2, 2,
            "- Think about the traitor whose title is given to Macbeth.\n- Write only the single word.",
            ctx="The title once held by a traitor is taken from him and given to Macbeth as a reward."))
o, a = mc("He wants the Doctor to find and cure the illness that is troubling the land and his queen.",
          ["He wants the Doctor to leave the castle at once.", "He wants the Doctor to help the English army.",
           "He wants the Doctor to write a letter to Malcolm."])
qs.append(Q(2, U, "plot_structure", "key_events", ["explain_reason_in_context"],
            "What does Macbeth ask the Doctor to do in the lines below?", o, a, "multiple_choice", 2, 2,
            "- Look at the words 'cure' and 'disease' in the speech.\n- Think about whom and what he wants healed.",
            ctx="MACBETH: Canst thou not minister to a mind diseased, pluck from the memory a rooted sorrow, and cleanse the stuffed bosom of that perilous stuff?"))
o, a = mc("principled", ["greedy", "cowardly but honest", "loyal to Macbeth"])
qs.append(Q(3, U, "character_analysis", "character_from_words", ["infer_character_from_words"],
            "What do the Doctor's words below reveal about his character?", o, a, "multiple_choice", 2, 2,
            "- Look at what the Doctor refuses to be tempted by.\n- Consider whether he is loyal to Macbeth or to what is right.",
            ctx="DOCTOR: I will not stay in this house for any price; I fear for my conscience."))
o, a = mc("Each soldier should cut a branch and carry it in front of him as camouflage.",
          ["Each soldier should burn the wood before the attack.", "Each soldier should hide in the wood until dark.",
           "Each soldier should leave his weapon in the forest."])
qs.append(Q(4, U, "plot_structure", "key_events", ["explain_reason_in_context"],
            "What does Malcolm instruct his soldiers to do in the extract?", o, a, "multiple_choice", 2, 2,
            "- Think about how an army could hide its numbers from an enemy.\n- Link it to the wood the soldiers are standing in.",
            ctx="MALCOLM: Let each man cut a branch and march behind it, that the enemy may not count our host."))
o, a = ms(["Macbeth and Banquo are praised for their courage in battle", "Macbeth's honour is corrupted as his ambition grows"],
          ["Macbeth refuses every reward Duncan offers him", "Duncan loses his honour by murdering Macbeth", "Lady Macbeth leads the army against Malcolm"])
qs.append(Q(5, U, "theme_identification", "theme_of_honour", ["identify_theme_evidence"],
            "Select the TWO statements that best show the theme of honour in the play.", o, a, "multi_select", 3, 3,
            "- Think about how Macbeth is first praised and what happens later.\n- Rule out statements that are not in the play."))
A = ai(
    ("3.2.1", 1, "- Think about who held the title before Macbeth and what happened to him.\n- Replace the underlined word.",
     "- Identify the wrong word\n- Replace it", "1. Duncan bestows the title Thane of Cawdor, not Fife."),
    ("3.2.2", 2, "- Irony is a gap between what Macbeth asks and what is true.\n- Who made the land ill?",
     "- State what Macbeth asks for\n- State the truth about the illness", "1. Macbeth pleads with the Doctor to heal Scotland.\n2. He himself is the cause of its suffering (or no medicine can cure Lady Macbeth's mental state)."),
    ("3.2.3", 2, "- Look at what the Doctor says he would not do even for money.\n- Think about his values.",
     "- Name the trait\n- Support it", "1. The Doctor is principled or ethical.\n2. He says not even money will draw him back to Macbeth's 'sick' castle."),
    ("3.2.4", 2, "- Menteith is answering Malcolm's hope for safety.\n- Think about how sure he is.",
     "- Name the tone\n- Give the reason", "1. The tone is confident or assured.\n2. He is convinced Scotland will be restored."),
    ("3.2.5", 2, "- Look at what the soldiers must cut and carry.\n- Name the action in your own words.",
     "- Describe the instruction\n- Say how it is carried out", "1. Each soldier must cut a branch.\n2. He must hold it in front of himself."),
    ("3.2.6", 2, "- Think about gestures that show the enemy waiting in the castle.\n- Give two actions.",
     "- Choose two stage actions\n- Link each to the lines", "1. Siward could move his outstretched hands from left to right, or simulate a circle around the castle.\n2. He could shift his eyes from the people to the castle."),
    ("3.2.7", 3, "- Think about how Macbeth's honour changes during the play.\n- Use examples from more than one scene.",
     "- Define honour\n- Give two or three examples", "1. Macbeth and Banquo are praised for valour in battle.\n2. Macbeth fights heroically for Duncan and Scotland.\n3. His honour is corrupted as ambition grows."),
    ("3.2.8", 3, "- Decide your view of Duncan, then support it with events in the play.\n- A bare yes or no earns nothing.",
     "- State your view\n- Give evidence", "1. Yes: Duncan acts decisively on Cawdor's treason, rewards Macbeth's bravery and praises Banquo.\n2. No: he trusts Macbeth too easily, misjudges character as Lady Macbeth shows and fails to protect himself."),
)
lesson(6, "Question 3.2: Macbeth", "macbeth", "drama", "Extract F", 17,
       "14:start=728,15", "10:start=560,11,12", ["literary_essay", "thematic_analysis", "irony"],
       "Macbeth — Extract F (Macbeth prepares for battle; Malcolm's army, Act 5 Sc 3–4). 3.2.1–3.2.8, 17 marks.",
       qs, A, [("Extract F", ["annexure_extract_f_1"])])

# ──────────────────────────── 4.1 My Children! My Africa! — Extract G ────────────────────────────
qs = []
o, a = match([("Mr M", "is a teacher who dreams of the one special pupil"),
              ("Thami Mbikwana", "is a gifted pupil and Mr M's protégé"),
              ("Isabel Dyson", "is a girl from another school who takes part in the quiz")])
qs.append(Q(1, U, "character_analysis", "match_characters_to_roles", ["match_characters_to_roles"],
            "Match each character from My Children! My Africa! to the description that fits.", o, a, "match", 2, 2,
            "- Think about who teaches, who is taught and who comes from the other school.\n- Use the pair you are sure of first."))
o, a = mc("honest", ["boastful", "secretive", "uncaring"])
qs.append(Q(2, U, "character_analysis", "character_from_words", ["infer_character_from_words"],
            "What do the words below reveal about the speaker's character?", o, a, "multiple_choice", 2, 2,
            "- Look at what the speaker admits about himself.\n- Think about whether he hides the truth.",
            ctx="MR M: I have no better pupil than Thami, young lady, and I will not pretend otherwise."))
o, a = fitb("Figure:", "metaphor")
qs.append(Q(3, U, "figurative_language", "metaphor_identification", ["identify_figure_of_speech"],
            "Name the figure of speech used in the sentence below. Write one word.", *fitb("Figure:", "metaphor"), "fitb", 2, 2,
            "- Look for a direct comparison between a mind and something that holds seeds.\n- Check for 'like' or 'as' before you decide.",
            ctx="A teacher plants seeds in a young mind and waits patiently for them to grow."))
o, a = mc("Thami wants to learn more than other boys want to play, yet he later leaves school to join the Struggle.",
          ["Thami hates school, yet he is the best pupil in the class.",
           "Thami loves sport, yet he never plays with other boys.", "Thami wants to leave Brakwater, yet he never does."])
qs.append(Q(4, U, "dramatic_techniques", "irony_in_drama", ["explain_irony"],
            "What is ironic about Mr M's words below?", o, a, "multiple_choice", 3, 3,
            "- Irony is a gap between what is said and what happens later.\n- Think about what Thami does in the play.",
            ctx="MR M: He is the best pupil I have ever had; he will go far in his studies."))
o, a = mc("Yes: the Bantu Education system angers the students, and they kill Mr M because they see him as an informer.",
          ["Yes: Mr M is killed because he joins the comrades.", "No: Mr M dies of an illness unrelated to the unrest.",
           "No: the apartheid government never affects the students' school."])
qs.append(Q(5, U, "theme_identification", "discuss_view_with_evidence", ["substantiate_a_view"],
            "The apartheid system is responsible for Mr M's death. Which ONE answer is best substantiated by events in the play?",
            o, a, "multiple_choice", 3, 3,
            "- Look for an option that connects the school system with the students' reaction.\n- Reject options that are not in the play."))
A = ai(
    ("4.1.1", 4, "- Think about each person's job or role in the play.\n- Match the ones you know best first.",
     "- Match Amos, Thami, Isabel and Sipho\n- Check each pair against the play", "1. Amos Mbikwana works at the railway.\n2. Thami is a teacher's protégé.\n3. Isabel is a victorious debater.\n4. Sipho Fondini writes on the wall."),
    ("4.1.2", 2, "- Think about what Mr M has come to ask Isabel.\n- Give the place.",
     "- Say what happens\n- Say where", "1. Mr M has come to ask Isabel to form a team with Thami for the literature quiz.\n2. This is at Camdeboo High School."),
    ("4.1.3", 4, "- Think about what an actor could do to show shock.\n- Consider what Mr M's words say about him.",
     "- Give two actions\n- Name a trait with evidence", "1. (a) Mr M could raise his eyebrows, cover his mouth or place both hands on his head.\n2. (b) He is honest or truthful as he admits his favouritism towards Thami."),
    ("4.1.4", 3, "- A head is used to stand for a pupil; liquid is poured in.\n- Think about the teacher's wish.",
     "- Name the figure of speech\n- Explain the comparison", "1. Metaphor or synecdoche.\n2. The pupil is like a vessel into which the teacher pours knowledge, or the head stands for the whole pupil, Thami."),
    ("4.1.5", 2, "- Irony is a gap between what is said and what happens.\n- What does Thami finally choose?",
     "- State what Mr M says\n- State what Thami does", "1. Mr M says Thami is focused on learning.\n2. Yet Thami later drops out of school to join the Struggle."),
    ("4.1.6", 3, "- Decide whether the system is to blame, then support it with events.\n- A bare yes or no earns nothing.",
     "- State your view\n- Give evidence", "1. Yes: apartheid imposes Bantu Education, the students revolt against it and kill Mr M as a police informer.\n2. No: Mr M refuses to join the comrades, knows what giving names to the police means and keeps ringing the bell."),
)
lesson(7, "Question 4.1: My Children! My Africa!", "my_children_my_africa", "drama", "Extract G", 18,
       "16:start=548,17:end=515", "13:start=160,14:end=488", ["literary_essay", "character_analysis", "irony"],
       "My Children! My Africa! — Extract G (Mr M on the qualities of a good teacher, Act 1 Sc 3). 4.1.1–4.1.6, 18 marks.",
       qs, A, [("Extract G", ["annexure_extract_g_1"])])

# ──────────────────────────── 4.2 My Children! My Africa! — Extract H ────────────────────────────
qs = []
o, a = mc("assumed names", ["last names", "real names", "first names"])
qs.append(Q(1, U, "figurative_language", "vocabulary_in_context", ["explain_word_in_context"],
            "In the sentence below, what are 'noms-de-plume'?", o, a, "multiple_choice", 2, 2,
            "- Think about why an author might publish under another name.\n- The phrase comes from French and means 'pen name'.",
            ctx="Several novels were published under the nom-de-plume of the writer's sister."))
o, a = ms(["He is afraid of hurting Isabel", "He is afraid she will misunderstand why he is leaving"],
          ["He is afraid of failing the literature quiz", "He is afraid that Mr M will find out", "He is afraid of the headmaster"])
qs.append(Q(2, U, "character_analysis", "state_of_mind", ["infer_state_of_mind"],
            "Select the TWO things that make Thami hesitate when he speaks to Isabel in the lines below.", o, a, "multi_select", 2, 2,
            "- Look at the words 'carefully' and 'hurt'.\n- Think about what he does not want Isabel to believe.",
            ctx="THAMI: I must choose my words slowly, Isabel; I do not want to hurt you."))
o, a = mc("sarcastic", ["delighted", "frightened", "affectionate"])
qs.append(Q(3, U, "tone_and_mood", "tone_identification", ["identify_tone"],
            "What tone would the speaker use for the line below?", o, a, "multiple_choice", 3, 2,
            "- Think about how someone sounds when she already knows the answer.\n- She is losing patience.",
            ctx="ISABEL: Well, that is wonderful news, isn't it? Please, tell me more."))
o, a = fitb("Career:", "journalist")
qs.append(Q(4, U, "plot_structure", "key_events", ["recall_key_events"],
            "Which career does Isabel hope to follow? Write one word.", *fitb("Career:", "journalist"), "fitb", 2, 2,
            "- Think about what she says about writing and telling stories about people's lives.\n- Write a single word.",
            ctx="Isabel prepares for the literature quiz and later tells her story to the world through her writing."))
o, a = mc("Thami represents hope because he is gifted and gives up his own plans for his people, though his future is uncertain.",
          ["Thami represents despair because he never studies.", "Thami represents hope because he joins the police.",
           "Thami represents nothing because he leaves the story early."])
qs.append(Q(5, U, "theme_identification", "discuss_view_with_evidence", ["substantiate_a_view"],
            "Thami represents hope for the future. Which ONE answer is best substantiated by events in the play?", o, a,
            "multiple_choice", 3, 3,
            "- Look for an option that mentions both his talent and the cost of his choice.\n- Reject options that are not in the play."))
A = ai(
    ("4.2.1", 2, "- 'Nom-de-plume' is French; think of a writer's assumed name.\n- Why would Isabel mention novels?",
     "- Choose the meaning\n- Give the reason", "1. (a) 'Nom-de-plumes' are assumed names, so the answer is A.\n2. (b) Isabel is preparing for a literature quiz."),
    ("4.2.2", 4, "- Look at how carefully Thami speaks and what he fears.\n- Then say what he is going to tell her.",
     "- Name the state of mind\n- Say what news he gives", "1. (a) Thami is conflicted or concerned as he does not know how to break the news without hurting her.\n2. (b) He is withdrawing from the literature quiz and cannot see her any more as he joins the Struggle or boycott."),
    ("4.2.3", 2, "- Think about what Isabel learns about South Africa through Thami.\n- 'Important' here is not casual.",
     "- Say why the time was important\n- Link to apartheid", "1. Isabel says her time with Thami was life-changing.\n2. She gained a deeper understanding of the realities of apartheid."),
    ("4.2.4", 2, "- Think about how someone sounds when she suspects the cause already.\n- What does Isabel want Thami to admit?",
     "- Name the tone\n- Give the reason", "1. The tone is sarcastic, frustrated or impatient.\n2. Isabel wants Thami to admit the comrades are pressuring him or she is angry that they interfere with their friendship."),
    ("4.2.5", 1, "- Think about the career Isabel talks about wanting.\n- Replace the underlined word.",
     "- Find the wrong word\n- Replace it", "1. Isabel aspires to become a journalist, not a doctor."),
    ("4.2.6", 3, "- Think about conversations that start or change events in the play.\n- Use two or three examples.",
     "- Define the theme\n- Give examples", "1. Mr M's communication with Miss Brockway starts the debating contest.\n2. Thami and Isabel talk to get to know each other.\n3. Isabel converses with Thami to understand the political tension."),
    ("4.2.7", 3, "- Decide your view of Thami, then support it with events.\n- A bare yes or no earns nothing.",
     "- State your view\n- Give evidence", "1. Yes: Thami excels academically, is passionate about social issues, joins the boycott and gives up his own aspirations for his people.\n2. No: he abandons his education, rejects Mr M's guidance, causes destruction and Mr M's death, and flees with no clear plan."),
)
lesson(8, "Question 4.2: My Children! My Africa!", "my_children_my_africa", "drama", "Extract H", 17,
       "18:start=526,19:end=545", "14:start=517,15:end=760", ["literary_essay", "character_analysis", "tone"],
       "My Children! My Africa! — Extract H (Thami and Isabel in conversation, Act 2 Sc 1). 4.2.1–4.2.7, 17 marks.",
       qs, A, [("Extract H", ["annexure_extract_h_1"])])

# ──────────────────────────── 5.1 Triumph in the Face of Adversity — Extract I ────────────────────────────
U = "short_stories"
qs = []
o, a = match([("Mme Sadike", "comforts Thulisile and advises her where to find help"),
              ("Thembekile", "stays in her marriage despite the abuse"),
              ("Thulisile", "the narrator who later succeeds against the odds")])
qs.append(Q(1, U, "character_analysis", "match_characters_to_roles", ["match_characters_to_roles"],
            "Match each character from 'Triumph in the Face of Adversity' to the description that fits.", o, a, "match", 2, 2,
            "- Think about who narrates and who gives advice in the extract.\n- Use the pair you are sure of first."))
o, a = mc("caring", ["strict", "indifferent", "boastful"])
qs.append(Q(2, U, "character_analysis", "character_from_words", ["infer_character_from_words"],
            "What does the action below reveal about the character who does it?", o, a, "multiple_choice", 2, 2,
            "- Look at what she does when the girl cries.\n- Think about whether she is gentle or cold.",
            ctx="The woman held the crying girl in her arms and let her speak until she had finished."))
o, a = mc("Thulisile thinks she cannot rise above her troubles, but she later becomes successful.",
          ["Thulisile thinks she will succeed, and she does so at once.",
           "Thulisile thinks she will fail, and she never recovers.", "Thulisile has no troubles, yet she complains."])
qs.append(Q(3, U, "dramatic_techniques", "irony_in_prose", ["explain_irony"],
            "What is ironic about the narrator's words below?", o, a, "multiple_choice", 3, 3,
            "- Irony is a gap between what is said and what happens later.\n- Think about how her life turns out.",
            ctx="'I cannot imagine how a girl like me will ever finish school,' she said."))
o, a = ms(["A social worker will give her counselling and emotional support", "The police will protect her family from her father's violence"],
          ["The school will give her a new uniform", "The church will pay her school fees", "A neighbour will give her a job"])
qs.append(Q(4, U, "plot_structure", "reasons_for_events", ["identify_stated_reasons"],
            "Select the TWO reasons why Mme Sadike suggests that Thulisile goes to a social worker or the police.", o, a, "multi_select", 3, 2,
            "- Think about what each of the two offices can do for a child in danger.\n- Reject options about school or church."))
o, a = mc("Yes: Thembekile stays loyal to her vows and respects her cruel mother-in-law, but she gives up her dream to please her husband.",
          ["Yes: Thembekile leaves her husband immediately and moves to a new city.",
           "No: Thembekile has no problems and lives happily.", "No: Thembekile is never mentioned in the story."])
qs.append(Q(5, U, "theme_identification", "discuss_view_with_evidence", ["substantiate_a_view"],
            "Thembekile deserves to be praised. Which ONE answer is best substantiated by events in the story?", o, a,
            "multiple_choice", 3, 3,
            "- Look for an option that is supported by specific actions in the story.\n- Reject options that contradict the story."))
A = ai(
    ("5.1.1", 4, "- Think about each character's role in Thulisile's story.\n- Match the ones you are sure of first.",
     "- Match Jabulani, Mr Rathebe, Bongani and Mr Nkwane\n- Check each pair", "1. Jabulani is an abusive and drunken man.\n2. Mr Rathebe owns a fish and chips shop.\n3. Bongani is upset about not receiving bread.\n4. Mr Nkwane appears to be a concerned teacher."),
    ("5.1.2", 2, "- Recall how Thulisile comes to Mme Sadike's house.\n- Give the occasion and the place.",
     "- Say what Thulisile was doing\n- Name the place", "1. Thulisile is begging for bread or looking for a job.\n2. This is at Mme Sadike's house."),
    ("5.1.3", 2, "- Think about what Mr Nkwane might share and what Thulisile fears.\n- Give two points.",
     "- State the first cause\n- State the second", "1. Thulisile is embarrassed that Mr Nkwane would share her personal life with everyone.\n2. She fears that people might pity her."),
    ("5.1.4", 2, "- Look at what Mme Sadike does when Thulisile cries.\n- What trait does it show?",
     "- Name the trait\n- Support it", "1. Mme Sadike is sympathetic or caring.\n2. She comforts Thulisile when she cries and confides in her."),
    ("5.1.5", 2, "- Irony is a gap between what is said and what happens.\n- Think about how Thulisile's life ends up.",
     "- State what she says\n- State what happens", "1. Thulisile doubts that she can overcome her struggles.\n2. Later she becomes a success, for example a television presenter with a house."),
    ("5.1.6", 2, "- Think about what each office can do.\n- Link each to Thulisile's problem.",
     "- State what a social worker does\n- State what the police do", "1. A social worker provides counselling or emotional support.\n2. The police protect Thulisile and her siblings from their father's violence."),
    ("5.1.7", 3, "- Decide your view, then support it with events in the story.\n- A bare yes or no earns nothing.",
     "- State your view\n- Give evidence", "1. Yes: Thembekile honours her marriage vows, respects her cruel mother-in-law and stops visiting her parents so they do not see the abuse.\n2. No: she gives up her dream of acting, tolerates abuse that her children witness and declines Thulisile's offer of a home."),
)
lesson(9, "Question 5.1: 'Triumph in the Face of Adversity'", "triumph_in_the_face_of_adversity", "short_stories", "Extract I", 17,
       "21:start=84:end=665", "16:start=200,17:end=330", ["literary_essay", "character_analysis", "irony"],
       "'Triumph in the Face of Adversity' — Extract I (Thulisile and Mme Sadike). 5.1.1–5.1.7, 17 marks.",
       qs, A, [("Extract I", ["annexure_extract_i_1"])])

# ──────────────────────────── 5.2 Eveline — Extract J ────────────────────────────
qs = []
o, a = ms(["anxious", "conflicted"], ["delighted", "bored", "furious"])
qs.append(Q(1, U, "character_analysis", "state_of_mind", ["infer_state_of_mind"],
            "Select the TWO words that best describe Eveline's state of mind in the lines below.", o, a, "multi_select", 2, 2,
            "- Look at what she asks herself about staying or going.\n- Think about whether she seems sure of her choice.",
            ctx="Eveline stared at the water and wondered whether her duty was to stay or to go."))
o, a = fitb("Figure:", "personification")
qs.append(Q(2, U, "figurative_language", "personification_identification", ["identify_figure_of_speech"],
            "Name the figure of speech used in the line below. Write one word.", *fitb("Figure:", "personification"), "fitb", 2, 2,
            "- Ask whether the wind is given a human feeling.\n- Look at the word 'wept'.",
            ctx="The wind wept through the rigging of the ships."))
o, a = mc("persuasive and urgent", ["gentle and sleepy", "cold and uncaring", "amused"])
qs.append(Q(3, U, "tone_and_mood", "tone_identification", ["identify_tone"],
            "What tone would Frank use when he says the word below?", o, a, "multiple_choice", 3, 2,
            "- Think about how someone sounds when he wants another person to follow him.\n- Frank sees that Eveline is hesitating.",
            ctx="'Quick, they are boarding!' he said, pulling at her sleeve."))
o, a = fitb("Nickname:", "Poppens|Evvy")
qs.append(Q(4, U, "plot_structure", "key_events", ["recall_key_events"],
            "What nickname does Frank use for Eveline? Write one word.", *fitb("Nickname:", "Poppens|Evvy"), "fitb", 2, 2,
            "- Think about the affectionate name Frank uses for her.\n- Write one word.",
            ctx="Frank is affectionate towards Eveline and uses a pet name when he is with her."))
o, a = mc("She remembers the promise she made to her dying mother to keep the home together.",
          ["She has decided that she does not love Frank.", "She is afraid of the ship's captain.",
           "She cannot leave because she has no money."])
qs.append(Q(5, U, "theme_identification", "reasons_for_events", ["explain_reason_in_context"],
            "Why is it 'impossible' for Eveline to leave with Frank?", o, a, "multiple_choice", 3, 3,
            "- Think about a promise Eveline made earlier in her life.\n- Reject options that are not in the story."))
A = ai(
    ("5.2.1", 1, "- Think about what makes Eveline's home life hard.\n- Check each option against the story.",
     "- Recall Frank's role\n- Choose what he saves her from", "1. Frank would save her from her father's verbal abuse, so the answer is A."),
    ("5.2.2", 2, "- Look at what she asks God to do.\n- Think about her uncertainty.",
     "- Name the state of mind\n- Give the reason", "1. Eveline is conflicted, anxious or distressed.\n2. She calls on God for guidance on whether to stay with her family or leave with Frank."),
    ("5.2.3", 3, "- A whistle is given a human quality.\n- Link it to how Eveline feels about leaving.",
     "- Name the figure of speech\n- Explain it", "1. Personification or alliteration.\n2. The whistle's mournful sound emphasises Eveline's sadness about leaving the familiar behind."),
    ("5.2.4", 2, "- Think about how Frank sounds when he sees Eveline hesitate.\n- He wants her to follow.",
     "- Name the tone\n- Give the reason", "1. The tone is persuasive, commanding or desperate.\n2. Frank sees Eveline is hesitant and pleads or orders her to board."),
    ("5.2.5", 1, "- Recall the pet name Frank uses for her.\n- Write the name.",
     "- Recall the story\n- State the name", "1. Frank calls her Poppens or Evvy."),
    ("5.2.6", 2, "- Think about a promise from her past.\n- Link it to her family.",
     "- State the promise\n- Link it to leaving", "1. She holds on to the promise she made to her mother to keep the family together as long as she can."),
    ("5.2.7", 1, "- Think about her workplace and who corrects her there.\n- Replace the underlined word.",
     "- Find the wrong name\n- Replace it", "1. It is Miss Gavan, not Miss Hill, who reprimands Eveline."),
    ("5.2.8", 3, "- Think about what freedom means for Eveline.\n- Use two or three events.",
     "- Define freedom\n- Give examples", "1. Frank offers freedom through Buenos Ayres and marriage.\n2. She could be free from disputes with her father.\n3. She sacrifices that freedom when she decides not to leave."),
    ("5.2.9", 3, "- Decide your view of Frank, then support it with events.\n- A bare yes or no earns nothing.",
     "- State your view\n- Give evidence", "1. Yes: Frank brings stories of faraway places, music and culture and wants to take her to Buenos Ayres.\n2. No: he does not stand up to her father, does not persuade her to leave and does not fully prove his love."),
)
lesson(10, "Question 5.2: 'Eveline'", "eveline", "short_stories", "Extract J", 18,
       "22:start=474,23:end=480", "17:start=358,18:end=762", ["literary_essay", "character_analysis", "figurative_language"],
       "'Eveline' — Extract J (Eveline at the North Wall, hesitating). 5.2.1–5.2.9, 18 marks.",
       qs, A, [("Extract J", ["annexure_extract_j_1"])])

# ──────────────────────────── 6.1 Inversnaid ────────────────────────────
U = "poetry"
qs = []
o, a = mc("Degged with dew, dappled with dew", ["A windpuff-bonnet of fawn-froth", "Of a pool so pitchblack, fell-frowning",
                                               "Wiry heathpacks, flitches of fern"])
qs.append(Q(1, U, "poetic_devices", "alliteration_identification", ["identify_sound_devices"],
            "Which line from 'Inversnaid' repeats the same consonant sound at the start of its words?", o, a, "multiple_choice", 2, 2,
            "- Read each line aloud and listen for the first sounds of the words.\n- Look for a repeated 'd' or 'f' at the start of several words."))
o, a = mc("It suggests that the pool is very dark and dangerous.", ["It suggests that the pool is clean and shallow.",
                                                                  "It suggests that the pool is warm and welcoming.", "It suggests that the pool is full of fish."])
qs.append(Q(2, U, "imagery", "colour_imagery", ["explain_imagery"],
            "What does the word 'pitchblack' suggest about the pool?", o, a, "multiple_choice", 2, 2,
            "- Think about the colour of pitch and what darkness suggests.\n- Look at the word 'féll-frówning' beside it.",
            ctx="Of a pool so pitchblack, féll-frówning, it rounds and rounds Despair to drowning."))
o, a = fitb("Word:", "Despair")
qs.append(Q(3, U, "poetic_devices", "personification_identification", ["identify_figure_of_speech"],
            "In the lines below, which word is given the actions of a person who can drown? Write one word.",
            *fitb("Word:", "Despair"), "fitb", 3, 2,
            "- Look for an abstract idea (a feeling) that is made to act like a person.\n- It starts with a capital letter in the middle of the line.",
            ctx="It rounds and rounds Despair to drowning."))
o, a = ms(["rollrock", "roaring"], ["beadbonny", "dappled", "dew"])
qs.append(Q(4, U, "theme_identification", "theme_of_wildness", ["identify_theme_evidence"],
            "Select the TWO words from the poem that best show the wildness of the stream.", o, a, "multi_select", 3, 3,
            "- Think about words that suggest noise and force.\n- Three of the options describe gentle or pretty things."))
o, a = mc("Yes: 'treads' and 'dew' suggest quiet movement, but 'pitchblack' and 'Despair' bring a threatening mood.",
          ["No: every word in the poem describes a calm and cheerful scene.",
           "Yes: the poem has no descriptive words at all.", "No: the poem describes a city street."])
qs.append(Q(5, U, "theme_identification", "discuss_view_with_evidence", ["substantiate_a_view"],
            "The speaker's use of descriptive words creates a peaceful atmosphere. Which ONE answer is best substantiated by the poem?",
            o, a, "multiple_choice", 3, 3,
            "- Look for an option that refers to specific words in the poem.\n- Reject options that deny the poem's content."))
A = ai(
    ("6.1.1", 4, "- Count the lines and look at the end rhymes.\n- Use the words in the list for each blank.",
     "- Fill each blank with the best word\n- Check the rhyme scheme against the lines", "1. The poem is divided into four-line sets called quatrains.\n2. Each set is a stanza.\n3. The scheme is aabb ccdd eeff gghh."),
    ("6.1.2", 1, "- Think about the colour of a horse's back.\n- What does it say about the water?",
     "- Name the colour\n- Link it to the stream", "1. The water is dark brown, perhaps with dirt or mud."),
    ("6.1.3", 2, "- Look at stanza 3: dew, the slopes and the stream.\n- Give one time and one place.",
     "- Name the place\n- Name the time", "1. The place is the hillside, the slopes ('braes') beside the stream at Inversnaid.\n2. The time is early morning (dew) or autumn."),
    ("6.1.4", 1, "- Look at the repeated sounds in 'coop' and 'comb'.\n- Replace the underlined word.",
     "- Identify the device\n- Replace the wrong term", "1. The sound device is alliteration (or assonance), not the underlined word."),
    ("6.1.5", 2, "- Look at the question and the plea in lines 13–15.\n- What does the speaker care about?",
     "- Name the trait\n- Support it", "1. The speaker is passionate and caring about nature.\n2. He pleads with mankind to protect it."),
    ("6.1.6", 2, "- Think about how people usually see weeds.\n- Link it to the speaker's wish.",
     "- State the usual view\n- State the speaker's view", "1. Weeds are usually unwanted.\n2. The speaker sees them as part of nature's wild beauty worth keeping."),
    ("6.1.7", 3, "- Look at words that suggest an untamed nature.\n- Use two or three examples.",
     "- Define the theme\n- Give words and meaning", "1. 'Rollrock' suggests an untamed horse galloping over rocks.\n2. 'Féll-frówning' suggests fierce, threatening hills.\n3. 'Wiry' suggests strong, dangerous ferns."),
    ("6.1.8", 3, "- Decide your view, then support it with words from the poem.\n- A bare yes or no earns nothing.",
     "- State your view\n- Give evidence", "1. Yes: 'Degged with dew' suggests serenity, 'treads' suggests slow movement and the ash tree is 'beadbonny'.\n2. No: 'twindles' suggests a whirlpool, 'pitchblack' is ominous and Despair is personified."),
)
lesson(11, "Question 6.1: 'Inversnaid'", "inversnaid", "poetry", "Poem", 18,
       "24:start=610,25:end=455", "19:start=192,20:end=517", ["poetry_analysis", "poetic_devices", "imagery"],
       "'Inversnaid' by Gerard Manley Hopkins. 6.1.1–6.1.8, 18 marks.",
       qs, A, [("Poem", ["annexure_poem_1_1"])])

# ──────────────────────────── 6.2 Sonnet 73 ────────────────────────────
qs = []
o, a = ms(["the twilight after sunset", "a fire dying down"], ["a river in flood", "a flower in full bloom", "a ship at sea"])
qs.append(Q(1, U, "imagery", "time_imagery", ["explain_imagery"],
            "Select the TWO things the speaker compares his old age to in the poem.", o, a, "multi_select", 2, 2,
            "- Look at the images in the second and third quatrains.\n- One image is about light at the end of the day and one is about something that burns.",
            ctx="In me thou seest the twilight of such day as after sunset fadeth in the west; in me thou seest the glowing of such fire that on the ashes of his youth doth lie."))
o, a = mc("that the speaker is old and near the end of his life", ["that the speaker is a young man in love",
                                                                   "that a great storm is coming", "that the harvest was plentiful"])
qs.append(Q(2, U, "imagery", "season_imagery", ["explain_imagery"],
            "What do the few yellow leaves on the branches suggest about the speaker?", o, a, "multiple_choice", 2, 2,
            "- Think about what happens to leaves late in the year.\n- The speaker compares the season to himself.",
            ctx="When yellow leaves, or none, or few, do hang upon those boughs which shake against the cold."))
o, a = fitb("Word:", "death")
qs.append(Q(3, U, "poetic_devices", "word_meaning_in_context", ["explain_word_in_context"],
            "What does 'black night' stand for in the lines below? Write one word.", *fitb("Word:", "death"), "fitb", 3, 2,
            "- Look at the words that follow: 'Death's second self'.\n- Night is compared to something final.",
            ctx="Which by and by black night doth take away, death's second self, that seals up all in rest."))
o, a = mc("It urges the listener to love more strongly because their time together is short.",
          ["It tells the listener to forget the speaker.", "It describes a cheerful day at the sea.",
           "It asks the listener to leave at once."])
qs.append(Q(4, U, "structure_and_form", "couplet_function", ["explain_effect_of_structure"],
            "What is the effect of the final couplet of the sonnet?", o, a, "multiple_choice", 3, 2,
            "- Read the last two lines as one idea: what does the speaker ask?\n- A couplet often draws the poem together.",
            ctx="This thou perceiv'st, which makes thy love more strong, to love that well which thou must leave ere long."))
o, a = mc("Yes: the speaker's ageing is shown by few leaves and a fading sunset, and he is helpless as death is inevitable.",
          ["No: the speaker is young and strong.", "Yes: the speaker has just won a great victory.",
           "No: the poem is only about a garden."])
qs.append(Q(5, U, "theme_identification", "discuss_view_with_evidence", ["substantiate_a_view"],
            "The speaker in this poem can be pitied. Which ONE answer is best substantiated by the poem?", o, a,
            "multiple_choice", 3, 3,
            "- Look for an option that refers to images in the poem.\n- Reject options that contradict the poem."))
A = ai(
    ("6.2.1", 1, "- Think about the season in which branches are bare and cold.\n- Look at the leaves in line 2.",
     "- Read lines 1–3\n- Choose the season", "1. The yellow, few leaves and the cold show winter is coming, so the answer is D."),
    ("6.2.2", 3, "- Bare branches are compared to a ruined choir.\n- Link the comparison to the speaker's ageing.",
     "- Name the figure of speech\n- Explain the comparison", "1. Metaphor or personification.\n2. As branches become bare and weak with the seasons, the speaker's body grows fragile with age (or there are no birds singing, as in an empty cathedral)."),
    ("6.2.3", 2, "- Think of what 'seals up all' suggests.\n- Death's second self is something else.",
     "- Give the first meaning\n- Give the second", "1. 'Rest' describes sleep.\n2. It also refers to death."),
    ("6.2.4", 2, "- Look at the fire image and what it stands for.\n- Link to the speaker's life.",
     "- Interpret the fire\n- Link it to the speaker", "1. The glowing fire refers to the speaker's remaining life, vitality or passion.\n2. It is slowly fading as he ages."),
    ("6.2.5", 2, "- Think of a fire that has burned down to ashes.\n- Link it to youth.",
     "- Describe the fire\n- Link it to the speaker", "1. The coals or logs burn out in the flames.\n2. The speaker's life or youth is used up by time and ageing."),
    ("6.2.6", 2, "- Think about what the listener realises.\n- Link it to loving more.",
     "- Name the state of mind\n- Support it", "1. The person is appreciative or understanding.\n2. He realises he should love the speaker more because he is growing old."),
    ("6.2.7", 2, "- Think about how the speaker asks to be loved while time is short.\n- Name the tone.",
     "- Name the tone\n- Give the reason", "1. The tone is urgent, appealing or resigned.\n2. The speaker asks them to intensify their love as their time is limited."),
    ("6.2.8", 3, "- Decide your view, then support it with images from the poem.\n- A bare yes or no earns nothing.",
     "- State your view\n- Give evidence", "1. Yes: the few withering leaves, the fading sunset and the helplessness before death evoke pity.\n2. No: the speaker sees ageing as natural and a reason for deeper love."),
)
lesson(12, "Question 6.2: 'Sonnet 73'", "sonnet_73", "poetry", "Poem", 17,
       "26:start=84:end=765", "20:start=544,21:end=705", ["poetry_analysis", "poetic_devices", "imagery"],
       "'Sonnet 73' by William Shakespeare. 6.2.1–6.2.8, 17 marks.",
       qs, A, [("Poem", ["annexure_poem_2_1"])])


import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from new_questions import NEWQ
for _les in L:
    _pairs = NEWQ[_les["order"]]
    _les["questions"] = [p[0] for p in _pairs]
    _les["basis"] = [p[1] for p in _pairs]


def js(v):
    return json.dumps(v, ensure_ascii=False, indent=2)


TAIL = open(os.path.join(ROOT, "scripts/add-english-fal-2025-nov-p1-q1.js")).read()
TAIL = TAIL[TAIL.index("// ─── Upload ─"):]

for les in L:
    n = les["order"]
    fname = f"add-english-fal-2025-nov-p2-q{n}.js"
    base = f"{BASE}/q{n}"
    nq = len(les["q"].split(","))
    nm = len(les["memo"].split(","))
    # image counts are filled in after extraction (image_counts.json)
    counts = json.load(open("/tmp/claude-1000/fal_p2_counts.json"))[str(n)]
    video = dict(name=les["name"], syllabus="dbe", subject="english_fal", year=2025, paper="nov_p2", order=n,
                 content_tier="free", has_video=False, xp=50, tags=les["tags"], text_key=les["key"],
                 question_image_urls=[f"{base}/question_{i}.png" for i in range(1, counts["q"] + 1)],
                 memo_image_urls=[f"{base}/memo_{i}.png" for i in range(1, counts["m"] + 1)],
                 exam_question_marks=les["marks"],
                 supplementary_materials=[dict(type="annexure", label=lab,
                                               image_urls=[f"{base}/{f}.png" for f in files]) for lab, files in les["supp_files"]])
    # annexure files may be several pages
    fixed = []
    for sm in video["supplementary_materials"]:
        k = counts["a"]
        stem = sm["image_urls"][0].rsplit("_1.png", 1)[0]
        sm["image_urls"] = [f"{stem}_{i}.png" for i in range(1, k + 1)]
        fixed.append(sm)
    qs = []
    for x in les["questions"]:
        d = dict(xp=10, syllabus="dbe", subject="english_fal", year=2025, paper="nov_p2", name=f"Question {x['order']}",
                 text_key=les["key"])
        d.update(x)
        qs.append(d)
    aiobj = dict(sub_questions=[dict(number=a_[0], marks=a_[1], clues=a_[2], approach=a_[3], solution=a_[4]) for a_ in les["ai"]],
                 model="claude-sonnet-5-5", generated_at="__NOW__", version=2, reviewed=False, input_tokens=0, output_tokens=0,
                 avg_rating=None, rating_count=None)
    ai_js = js(aiobj).replace('"__NOW__"', "Date.now()")
    basis_block = "\n".join(f" *   Q{i+1}: {b}" for i, b in enumerate(les["basis"]))
    body = f"""#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — {les['header']}
 * Practice questions follow the HL Paper 2 pattern: context_text null, FRESH targets from elsewhere in the text, never the
 * exam's own statements or the memo's answers (DESIGN-UNI-01); they carry text_key "{les['key']}" on lesson and every
 * question (SETWORK-LES-01). aiExplanation: one entry per REAL exam sub-question with its real marks, derived from the
 * memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * FACTUAL BASIS per practice question — BK = book knowledge (verify against the text), P = printed in the exam paper's
 * extract/poem, M = established by the memo, PT = vocabulary/title meaning:
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

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {ai_js};

{TAIL}"""
    open(os.path.join(ROOT, "scripts", fname), "w").write(body)
    print("wrote", fname, len(qs), "questions,", len(les["ai"]), "ai entries")

# seed: subtopics + skills for FAL P2
seedp = os.path.join(ROOT, "tools/seeds/english-fal-curriculum.json")
seed = json.load(open(seedp))
NEED = {'novel': ['dramatic_techniques'], 'drama': ['figurative_language'], 'short_stories': ['dramatic_techniques', 'tone_and_mood']}
for u in seed['units']:
    for tslug in NEED.get(u['slug'], []):
        if tslug not in {t['slug'] for t in u['topics']}:
            u['topics'].append(dict(slug=tslug, name=tslug.replace('_', ' ').title()))
have_sk = {k["id"] for k in seed.get("skills", [])}
for les in L:
    for x in les["questions"]:
        for u in seed["units"]:
            if u["slug"] != x["unit"]:
                continue
            for t in u["topics"]:
                if t["slug"] == x["topic"]:
                    st = t.setdefault("subtopics", [])
                    if x["subtopic"] not in {s["slug"] for s in st}:
                        st.append(dict(slug=x["subtopic"], name=x["subtopic"].replace("_", " ").title()))
        for s in x["skills"]:
            if s not in have_sk:
                seed["skills"].append(dict(id=s, name=s[len("english_fal_"):].replace("_", " ").capitalize()))
                have_sk.add(s)
json.dump(seed, open(seedp, "w"), indent=2, ensure_ascii=False)
print("seed skills now", len(seed["skills"]))
