"""Fresh-target practice questions for FAL Nov 2025 P2 (HL pattern: context_text null, fresh targets, no exam items).

BASIS codes (per question, see script header + review sheet):
  BK  = general knowledge of the prescribed text (widely documented plot/character/genre fact) — verify against the book
  P   = verifiable from the printed text of the setwork/poem as shown in the exam paper (extract tab or poem tab)
  PT  = vocabulary / title meaning (language knowledge, not plot)
  M   = established by the memo only
"""
import itertools

POS = itertools.cycle([2, 1, 3, 0, 2, 3, 1, 2, 3, 1, 2, 0, 3, 1, 2, 3, 1, 2, 3, 1])


def mc(correct, wrong):
    i = next(POS)
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


def order_q(items_in_order, shown_order):
    """items_in_order = correct sequence (4 items); shown_order = indexes giving presentation order."""
    meta = [items_in_order[i] for i in shown_order] + [""]
    return meta, list(items_in_order) + [""]


def Q(order, unit, topic, subtopic, skills, question, md, ans, pres, diff, w, clues, basis):
    d = dict(order=order, context_text=None, question=question, metadata=md, answer=ans, presentation=pres,
             type="definition" if pres in ("fitb",) else "application", unit=unit, topic=topic, subtopic=subtopic,
             skills=["english_fal_" + s for s in skills], difficulty=diff, exam_weight=w, clues=clues)
    if pres == "fitb":
        d["keyboard_type"] = "text"
    return d, basis


NEWQ = {}

# ───────────────────────── 1.1 Cry, the Beloved Country ─────────────────────────
U = "novel"
q = []
o, a = match([("Absalom", "Stephen Kumalo's son"), ("John Kumalo", "Stephen Kumalo's brother"), ("Gertrude", "Stephen Kumalo's sister")])
q.append(Q(1, U, "character_analysis", "family_relationships", ["match_characters_to_roles"],
           "Match each character from Cry, the Beloved Country to his or her relationship to Stephen Kumalo.", o, a, "match", 1, 1,
           "- Think about which characters are Stephen's own children and which are his brothers and sisters.\n- Start with the relationship you are most sure of.",
           "BK: Absalom is Stephen's son, John his brother, Gertrude his sister — core family facts of the novel."))
o, a = fitb("Village:", "Ndotsheni")
q.append(Q(2, U, "plot_structure", "setting_of_the_novel", ["recall_key_events"],
           "What is the name of the village in the hills where Stephen Kumalo is a priest? Write one word.", o, a, "fitb", 1, 1,
           "- It is the home of the Kumalo family before the journey to the city.\n- Write one word only.",
           "P/BK: the village name Ndotsheni is printed in the exam extract B and is the setting named throughout the novel."))
o, a = mc("racial injustice and the break-up of family and community life",
          ["a war between two African kingdoms", "a famine caused by an enemy army", "a rivalry between two schools"])
q.append(Q(3, U, "theme_identification", "main_concerns_of_the_novel", ["identify_theme"],
           "Which of the following is the novel mainly concerned with?", o, a, "multiple_choice", 2, 2,
           "- Think about the time and place in which the novel is set.\n- Look for the option that is about people and society.",
           "BK: widely stated as the central concerns of the novel (racial injustice, social breakdown)."))
o, a = ms(["Ndotsheni", "Johannesburg"], ["Cape Town", "Durban", "Kimberley"])
q.append(Q(4, U, "setting_and_atmosphere", "places_in_the_novel", ["identify_setting"],
           "Select the TWO places that are the main settings of the novel.", o, a, "multi_select", 1, 1,
           "- One is a country village and the other is a big city.\n- The other options are real places that are not the main settings.",
           "BK: the novel moves between Ndotsheni and Johannesburg."))
m, a = order_q(["Kumalo receives a letter saying that Gertrude is ill", "Kumalo travels to Johannesburg",
                "Absalom is arrested for a murder", "Absalom is sentenced to death"], [2, 0, 3, 1])
q.append(Q(5, U, "plot_structure", "sequence_of_events", ["order_events"],
           "Arrange these events from the novel in the order in which they happen.", m, a, "ordering", 2, 2,
           "- Decide which event sets the journey in motion.\n- A sentence cannot come before an arrest.",
           "BK: broad plot sequence only (letter → journey → arrest → sentence)."))
NEWQ[1] = q

# ───────────────────────── 1.2 Cry ─────────────────────────
q = []
o, a = mc("to teach the villagers better farming methods", ["to start a school for girls", "to build a new church",
                                                            "to collect taxes from the farmers"])
q.append(Q(1, U, "plot_structure", "hope_for_ndotsheni", ["recall_key_events"],
           "Why does the agricultural demonstrator, Napoleon Letsitsi, come to Ndotsheni?", o, a, "multiple_choice", 2, 2,
           "- Think about the problem that has made the valley so poor.\n- His job title tells you what he does.",
           "BK: Napoleon Letsitsi is the agricultural demonstrator who comes to Ndotsheni in Book 3. Verify the name spelling against the book."))
o, a = match([("Msimangu", "a priest who helps Kumalo in Johannesburg"), ("James Jarvis", "a white farmer from the hills above Ndotsheni"),
              ("Father Vincent", "a priest at the Mission House in Johannesburg")])
q.append(Q(2, U, "character_analysis", "match_characters_to_roles", ["match_characters_to_roles"],
           "Match each character from the novel to the description that fits him.", o, a, "match", 2, 2,
           "- Think about who lives in the city and who lives near Ndotsheni.\n- Two of the three are priests; look at where each works.",
           "BK: Msimangu (priest, Johannesburg), James Jarvis (farmer at Ndotsheni hills), Father Vincent (priest at the mission). Memo names Father Vincent."))
o, a = ms(["racial injustice", "the break-up of traditional community life"], ["space exploration", "romantic rivalry between two chiefs", "the power of magic"])
q.append(Q(3, U, "theme_identification", "themes_of_the_novel", ["identify_theme"],
           "Select the TWO themes that are explored in the novel.", o, a, "multi_select", 2, 2,
           "- Think about what happens to families when people leave the villages.\n- Reject themes that do not fit the story's setting.",
           "BK: racial injustice and social/tribal breakdown are standard themes."))
o, a = mc("He climbs a mountain to pray as the hour of Absalom's hanging comes.",
          ["He travels to the court to ask for a pardon.", "He leaves the priesthood and moves to Pretoria.",
           "He goes to the dam to meet James Jarvis."])
q.append(Q(4, U, "plot_structure", "closing_events", ["recall_key_events"],
           "What does Stephen Kumalo do at the time of Absalom's hanging?", o, a, "multiple_choice", 2, 2,
           "- Think about how a priest would spend the last hours before an execution.\n- Look for the option that happens in the hills, close to nature.",
           "BK: Kumalo climbs the mountain and prays at dawn on the day of the hanging (closing chapter of the novel). Verify."))
o, a = fitb("Name:", "Matthew")
q.append(Q(5, U, "plot_structure", "key_characters", ["recall_key_events"],
           "What is the first name of John Kumalo's son, who is tried together with Absalom? Write one word.", o, a, "fitb", 3, 2,
           "- He is Absalom's cousin.\n- Write his first name only.",
           "BK + M: Matthew is John Kumalo's son tried with Absalom (the paper's Q1.2.5 names Matthew and Johannes)."))
NEWQ[2] = q

# ───────────────────────── 2.1 Jekyll and Hyde ─────────────────────────
q = []
o, a = mc("Edward Hyde", ["Mr Utterson", "Dr Lanyon", "Mr Enfield"])
q.append(Q(1, U, "plot_structure", "dr_jekylls_will", ["recall_key_events"],
           "Who does Dr Jekyll's will say will receive all his possessions if he disappears?", o, a, "multiple_choice", 2, 2,
           "- Utterson is troubled by this will because of who is named in it.\n- The person named is not one of Jekyll's friends.",
           "BK: Jekyll's will leaves everything to Hyde; Utterson reads it early in the novel."))
o, a = fitb("District:", "Soho")
q.append(Q(2, U, "setting_and_atmosphere", "places_in_the_novel", ["identify_setting"],
           "In which district of London does Mr Hyde keep his rooms? Write one word.", o, a, "fitb", 3, 2,
           "- Utterson goes there with an inspector after the murder.\n- It is a district known for its fog and narrow streets.",
           "BK: Hyde's rooms are in Soho (Utterson and the police visit them). Verify."))
m, a = order_q(["Utterson searches for Mr Hyde", "Sir Danvers Carew is murdered", "Dr Lanyon dies after a shock",
                "Poole asks Utterson for help"], [3, 1, 0, 2])
q.append(Q(3, U, "plot_structure", "sequence_of_events", ["order_events"],
           "Arrange these events from the novel in the order in which they happen.", m, a, "ordering", 3, 3,
           "- Start with the event that comes from Utterson's first suspicion.\n- The servant's request comes near the end of the story.",
           "BK: chapters 'Search for Mr Hyde' → 'The Carew Murder Case' → 'Remarkable Incident of Dr Lanyon' → 'The Last Night' (Poole)."))
o, a = match([("Dr Lanyon", "a doctor who is horrified by what he sees Hyde do"), ("Poole", "the butler who fears for his master's safety"),
              ("Sir Danvers Carew", "a respected gentleman beaten to death by Hyde")])
q.append(Q(4, U, "character_analysis", "match_characters_to_roles", ["match_characters_to_roles"],
           "Match each character from the novel to the description that fits.", o, a, "match", 2, 2,
           "- Think about who is a servant, who is a doctor and who is a victim.\n- One character is killed in the story.",
           "BK: Lanyon (doctor, dies after the transformation), Poole (butler), Carew (murdered by Hyde)."))
o, a = ms(["the duality of human nature", "the struggle between good and evil"], ["the joys of foreign travel", "ambition for political power", "love between two families"])
q.append(Q(5, U, "theme_identification", "themes_of_the_novel", ["identify_theme"],
           "Select the TWO themes that are explored in the novel.", o, a, "multi_select", 2, 2,
           "- Think about what Jekyll's experiment reveals about people.\n- Reject themes that are not about the double life in the story.",
           "BK: duality and good vs evil are standard themes."))
NEWQ[3] = q

# ───────────────────────── 2.2 Jekyll and Hyde ─────────────────────────
q = []
o, a = mc("a written statement left by Dr Jekyll", ["a confession made by Mr Utterson", "a letter from Sir Danvers Carew",
                                                    "a newspaper report about Mr Hyde"])
q.append(Q(1, U, "plot_structure", "how_the_truth_is_revealed", ["recall_key_events"],
           "How is the full truth about Jekyll and Hyde finally revealed to Mr Utterson and the reader?", o, a, "multiple_choice", 3, 2,
           "- Think about the last chapter of the novel.\n- It is written by the person who knows the whole secret.",
           "BK: the novel ends with 'Henry Jekyll's Full Statement of the Case'."))
o, a = fitb("Word:", "door")
q.append(Q(2, U, "plot_structure", "key_events", ["recall_key_events"],
           "What do Utterson and Poole break down to get into Jekyll's cabinet? Write one word.", o, a, "fitb", 2, 2,
           "- It is the barrier that Poole's servants have been unable to open.\n- Write one word.",
           "BK: Utterson and Poole break down the cabinet door in 'The Last Night'. Verify."))
o, a = mc("He is found dead in Jekyll's cabinet.", ["He sails away to a distant country.", "He is sent to prison for life.",
                                                   "He is made Jekyll's heir and lives in comfort."])
q.append(Q(3, U, "plot_structure", "closing_events", ["recall_key_events"],
           "What happens to Mr Hyde at the end of the novel?", o, a, "multiple_choice", 2, 2,
           "- Think about where Utterson and Poole find him.\n- Reject options in which Hyde escapes or is rewarded.",
           "BK: Hyde's body is found in the cabinet (apparent suicide)."))
o, a = match([("Dr Lanyon", "dies after seeing the transformation"), ("Poole", "helps Utterson break down the cabinet door"),
              ("Mr Utterson", "reads Lanyon's sealed letter after his death")])
q.append(Q(4, U, "character_analysis", "match_characters_to_roles", ["match_characters_to_roles"],
           "Match each character from the novel to the event that involves him.", o, a, "match", 3, 2,
           "- Think about which character is a doctor and which is a servant.\n- One character reads a document after another man's death.",
           "BK: Lanyon dies after witnessing Hyde change; Poole and Utterson break the door; Utterson reads Lanyon's narrative."))
o, a = ms(["a mysterious London setting", "a secret and a double identity"], ["a cheerful comic servant", "a long sea voyage"])
q.append(Q(5, U, "setting_and_atmosphere", "features_of_the_genre", ["identify_genre_features"],
           "Select the TWO features that make the novel a gothic story.", o, a, "multi_select", 3, 2,
           "- Think about fog, dark streets and secrets.\n- Gothic stories are not about comedy or voyages.",
           "BK: gothic features (fog/London, double identity) are standard commentary on the novella."))
NEWQ[4] = q

# ───────────────────────── 3.1 Macbeth ─────────────────────────
U = "drama"
q = []
m, a = order_q(["The witches greet Macbeth with their prophecies", "Duncan is murdered", "Macbeth is crowned king",
                "Banquo is murdered"], [3, 1, 0, 2])
q.append(Q(1, U, "plot_structure", "sequence_of_events", ["order_events"],
           "Arrange these events from Macbeth in the order in which they happen.", m, a, "ordering", 2, 2,
           "- The prophecies are what start Macbeth's ambition.\n- Macbeth must be king before he orders more killings.",
           "BK: Act 1.3 → 2.2 → 2.4 (crowning at Scone) → 3.3."))
o, a = fitb("Name:", "Macbeth")
q.append(Q(2, U, "plot_structure", "key_events", ["recall_key_events"],
           "To whom does the ghost of Banquo appear at the banquet? Write one word.", o, a, "fitb", 1, 1,
           "- Only one person at the banquet can see the ghost.\n- Write one word.",
           "BK: Banquo's ghost appears to Macbeth (Act 3, Scene 4)."))
o, a = mc("She tries to wash imagined blood from her hands.", ["She orders more soldiers to defend the castle.",
                                                              "She laughs and dances with the doctor.", "She reads a letter from Duncan."])
q.append(Q(3, U, "character_analysis", "lady_macbeth", ["recall_key_events"],
           "What does Lady Macbeth do in the sleepwalking scene?", o, a, "multiple_choice", 2, 2,
           "- Think about what she feels guilty about.\n- She is seen at night, in her nightgown.",
           "BK: sleepwalking scene Act 5.1 ('Out, damned spot')."))
o, a = match([("Lady Macbeth", "urges her husband to kill the king"), ("Macduff", "kills Macbeth at the end of the play"),
              ("Duncan", "the king who is murdered at Macbeth's castle")])
q.append(Q(4, U, "character_analysis", "match_characters_to_roles", ["match_characters_to_roles"],
           "Match each character from Macbeth to the description that fits.", o, a, "match", 2, 2,
           "- Think about who is married to Macbeth and who ends the play as Macbeth's enemy.\n- One character is already dead before the final act.",
           "BK: core plot facts."))
o, a = ms(["ambition", "guilt"], ["friendship and travel", "wealth through trade"])
q.append(Q(5, U, "theme_identification", "themes_of_the_play", ["identify_theme"],
           "Select the TWO themes that are explored in the play.", o, a, "multi_select", 1, 1,
           "- Think about what drives Macbeth and what haunts him afterwards.\n- The other options do not fit the play's story.",
           "BK: ambition and guilt are standard themes."))
NEWQ[5] = q

# ───────────────────────── 3.2 Macbeth ─────────────────────────
q = []
o, a = mc("He says that life is 'a tale told by an idiot, signifying nothing'.", ["He prays for forgiveness and gives up the crown.",
                                                                                "He orders a great funeral for the queen.",
                                                                                "He blames Malcolm for her death."])
q.append(Q(1, U, "character_analysis", "macbeth_reaction", ["recall_key_events"],
           "How does Macbeth react when he hears that Lady Macbeth is dead?", o, a, "multiple_choice", 3, 2,
           "- Think about his famous speech that begins with 'Tomorrow'.\n- He is no longer able to feel hope.",
           "BK: Act 5.5 'She should have died hereafter … Tomorrow and tomorrow … a tale told by an idiot'."))
o, a = fitb("Surname:", "Macduff")
q.append(Q(2, U, "plot_structure", "closing_events", ["recall_key_events"],
           "Which character kills Macbeth at the end of the play? Write one name.", o, a, "fitb", 1, 1,
           "- He is a Scottish thane whose family Macbeth had killed.\n- Write one name.",
           "BK: Macduff kills Macbeth (Act 5.8)."))
o, a = mc("He was not born in the usual way, as he was 'untimely ripped' from his mother.",
          ["He is a ghost who cannot be harmed.", "He was born in England, so Scottish law does not apply.",
           "He carries a magic sword given by the witches."])
q.append(Q(3, U, "plot_structure", "the_prophecies", ["explain_reason_in_context"],
           "Macbeth believes that no man born of woman can harm him. Why can Macduff?", o, a, "multiple_choice", 3, 3,
           "- Think about the exact words of the prophecy and how Macduff was born.\n- The answer is about his birth, not a weapon.",
           "BK: Macduff was 'from his mother's womb untimely ripp'd' (Act 5.8)."))
m, a = order_q(["Malcolm orders his soldiers to carry branches", "Lady Macbeth's death is announced",
                "Macduff kills Macbeth", "Malcolm is hailed as king"], [2, 0, 3, 1])
q.append(Q(4, U, "plot_structure", "sequence_of_events", ["order_events"],
           "Arrange these events from the end of the play in the order in which they happen.", m, a, "ordering", 3, 3,
           "- Think about the order of the final act: the plan, the news, the fight and the crowning.\n- The new king is named last.",
           "BK: Act 5.4 → 5.5 → 5.8 (fight) → 5.8 (Malcolm proclaimed)."))
o, a = ms(["No man born of woman can harm him", "He will not be defeated until Birnam Wood comes to Dunsinane"],
          ["He will die at sea", "Macduff will become king of Scotland"])
q.append(Q(5, U, "plot_structure", "the_prophecies", ["identify_stated_reasons"],
           "Select the TWO prophecies that give Macbeth a false sense of safety.", o, a, "multi_select", 3, 3,
           "- Think about the second set of apparitions Macbeth sees.\n- One prophecy is about birth and one is about a forest.",
           "BK + P: prophecies of the apparitions (Act 4.1); the Birnam Wood line is also printed in Extract F."))
NEWQ[6] = q

# ───────────────────────── 4.1 My Children! My Africa! ─────────────────────────
q = []
o, a = fitb("Surname:", "Fugard")
q.append(Q(1, U, "plot_structure", "text_information", ["recall_key_events"],
           "Who wrote the play My Children! My Africa!? Write the surname.", o, a, "fitb", 1, 1,
           "- The playwright is one of South Africa's best-known dramatists.\n- Write the surname only.",
           "P: the author is printed in the exam paper (Athol Fugard)."))
o, a = mc("the education Mr M believes in and the boycott that the comrades demand",
          ["two schools that compete for a sports trophy", "a rich family and a poor family", "two brothers who share a farm"])
q.append(Q(2, U, "plot_structure", "central_conflict", ["identify_theme"],
           "Which of the following is the main conflict in the play?", o, a, "multiple_choice", 3, 3,
           "- Think about what Mr M wants for his pupils and what the comrades want.\n- Look for the option that concerns education and politics.",
           "BK + M: Mr M's belief in education vs the boycott (memo mentions boycott and Mr M's death)."))
o, a = ms(["Thami", "Isabel"], ["Mr M", "Miss Brockway", "the police inspector"])
q.append(Q(3, U, "character_analysis", "characters_and_roles", ["match_characters_to_roles"],
           "Select the TWO characters who are pupils at their schools.", o, a, "multi_select", 1, 1,
           "- Two of the options are teachers.\n- One option is a policeman.",
           "P + M: Thami and Isabel are pupils; Mr M and Miss Brockway are teachers (memo 4.2.6)."))
o, a = match([("Mr M", "a teacher who believes in the power of education"), ("Thami", "a gifted pupil who joins the boycott"),
              ("Isabel", "a girl from another school who becomes Thami's friend")])
q.append(Q(4, U, "character_analysis", "match_characters_to_roles", ["match_characters_to_roles"],
           "Match each character from the play to the description that fits.", o, a, "match", 2, 2,
           "- Think about who teaches, who is taught and who comes from the other school.\n- Start with the pair you know best.",
           "P + M: roles as printed in the exam extracts and memo."))
m, a = order_q(["Thami and Isabel are paired for the quiz", "Thami and Isabel become friends",
                "Thami withdraws and joins the boycott", "Mr M is killed"], [3, 0, 2, 1])
q.append(Q(5, U, "plot_structure", "sequence_of_events", ["order_events"],
           "Arrange these events from the play in the order in which they happen.", m, a, "ordering", 3, 3,
           "- Start with how the two pupils first meet.\n- Mr M's death is the tragic climax.",
           "M + BK: memo 4.2.2(b) and 4.1.6; broad plot order."))
NEWQ[7] = q

# ───────────────────────── 4.2 My Children! My Africa! ─────────────────────────
q = []
o, a = fitb("Subject:", "English")
q.append(Q(1, U, "character_analysis", "mr_m", ["recall_key_events"],
           "Which school subject does Mr M teach? Write one word.", o, a, "fitb", 2, 2,
           "- The literature quiz is based on this subject.\n- Write one word.",
           "BK: Mr M teaches English (the literature quiz and debates are in English). Verify."))
o, a = mc("his stubborn commitment to education and to order in the school",
          ["his wish to become the school's headmaster", "his love of music", "his fear of the sea"])
q.append(Q(2, U, "dramatic_techniques", "symbols_in_the_play", ["explain_symbol"],
           "What does the ringing of the school bell show about Mr M?", o, a, "multiple_choice", 3, 3,
           "- Think about what he keeps doing even when the situation is dangerous.\n- Look for the option about duty and education.",
           "M: memo 4.1.6 'refuses to stop ringing the bell even though the situation is volatile'."))
o, a = ms(["He feels loyalty to the struggle of his community", "He is pressured by the comrades"],
          ["He has failed his school exams", "He wants to become a teacher like Mr M", "He has moved to another town"])
q.append(Q(3, U, "character_analysis", "thami_motives", ["identify_stated_reasons"],
           "Select the TWO reasons why Thami joins the boycott.", o, a, "multi_select", 3, 3,
           "- Think about the pressure around him and what he feels for his community.\n- Reject reasons that contradict the play.",
           "M: memo 4.2.4(b) (pressure by the comrades) and 4.2.7 (commitment to the Struggle)."))
o, a = ms(["education", "friendship across barriers"], ["magic and witchcraft", "a long sea voyage"])
q.append(Q(4, U, "theme_identification", "themes_of_the_play", ["identify_theme"],
           "Select the TWO themes that are explored in the play.", o, a, "multi_select", 2, 2,
           "- Think about what happens between Thami and Isabel and what Mr M cares about.\n- Reject themes that are not in the story.",
           "BK: education and friendship across racial lines are standard themes."))
NEWQ[8] = q

# ───────────────────────── 5.1 Triumph in the Face of Adversity ─────────────────────────
U = "short_stories"
q = []
o, a = mc("first-person narrator", ["third-person narrator", "an unnamed observer", "a narrator who is a teacher"])
q.append(Q(1, U, "narrative_voice_and_setting", "point_of_view", ["identify_narrative_voice"],
           "From whose point of view is 'Triumph in the Face of Adversity' told in the extract?", o, a, "multiple_choice", 2, 2,
           "- Look at the pronoun the narrator uses for herself.\n- Think about who 'I' is in the passage.",
           "P: the extract is narrated with 'I' (Thulisile)."))
o, a = mc("a great victory or success", ["a sad ending", "a hard lesson", "a long journey"])
q.append(Q(2, U, "figurative_language", "word_meaning_in_context", ["explain_word_in_context"],
           "What does the word 'triumph' mean in the title?", o, a, "multiple_choice", 1, 1,
           "- Think of a person who 'triumphs' in a contest.\n- It is a positive word.",
           "PT: vocabulary meaning of 'triumph'."))
o, a = fitb("Name:", "Thulisile")
q.append(Q(3, U, "character_analysis", "narrator", ["recall_key_events"],
           "What is the first name of the girl who tells the story in the extract? Write one word.", o, a, "fitb", 1, 1,
           "- Her friends call her by a shorter name, but write her full first name.\n- Write one word.",
           "P: the narrator's name Thulisile is printed in the extract."))
o, a = ms(["overcoming hardship", "perseverance"], ["revenge", "the joy of wealth"])
q.append(Q(4, U, "theme_identification", "themes_suggested_by_the_title", ["identify_theme"],
           "Select the TWO themes that the title of the story suggests.", o, a, "multi_select", 2, 2,
           "- Think about what 'triumph' and 'adversity' mean together.\n- Reject themes that are not about success after difficulty.",
           "PT: derived from the words of the title only."))
m, a = order_q(["The narrator tells the woman her name", "She says where she stays", "She admits that she stayed away from school",
                "The woman advises her to see a social worker or the police"], [3, 1, 0, 2])
q.append(Q(5, U, "plot_structure", "sequence_of_events", ["order_events"],
           "Arrange these parts of the conversation in the extract in the order in which they happen.", m, a, "ordering", 2, 2,
           "- Start with how two people usually begin a conversation.\n- The advice comes after the problem is explained.",
           "P: order as printed in Extract I."))
NEWQ[9] = q

# ───────────────────────── 5.2 Eveline ─────────────────────────
q = []
o, a = fitb("City:", "Dublin")
q.append(Q(1, U, "narrative_voice_and_setting", "setting_of_the_story", ["identify_setting"],
           "In which city does Eveline live? Write one word.", o, a, "fitb", 1, 1,
           "- Joyce's collection of stories is named after the people of this city.\n- Write one word.",
           "BK: Eveline lives in Dublin; the story is from Joyce's Dubliners."))
o, a = fitb("Collection:", "Dubliners")
q.append(Q(2, U, "plot_structure", "text_information", ["recall_key_events"],
           "'Eveline' is a story in which collection by James Joyce? Write one word.", o, a, "fitb", 2, 2,
           "- The title is the name for people from a certain city.\n- Write one word.",
           "BK: 'Eveline' is from Dubliners (1914)."))
o, a = mc("He has died.", ["He has become a sailor.", "He has moved to Buenos Ayres.", "He has become a priest."])
q.append(Q(3, U, "plot_structure", "eveline_family", ["recall_key_events"],
           "What has happened to Eveline's brother Ernest?", o, a, "multiple_choice", 2, 2,
           "- Eveline remembers him when she thinks of her family.\n- One of her brothers is no longer alive.",
           "BK: Ernest is dead; Harry works away. Verify."))
o, a = ms(["paralysis (being unable to act)", "escape"], ["revenge", "ambition for wealth"])
q.append(Q(4, U, "theme_identification", "themes_of_the_story", ["identify_theme"],
           "Select the TWO themes that are explored in the story.", o, a, "multi_select", 2, 2,
           "- Think about what Eveline wants and what stops her from acting.\n- Reject themes that do not appear in the story.",
           "BK: paralysis and escape are the standard readings."))
m, a = order_q(["Eveline remembers her promise to her mother", "Frank urges her to board", "Eveline grips the railing",
                "Eveline lets Frank go on alone"], [2, 0, 3, 1])
q.append(Q(5, U, "plot_structure", "sequence_of_events", ["order_events"],
           "Arrange these events from the end of the story in the order in which they happen.", m, a, "ordering", 3, 3,
           "- Her memory comes before Frank's call.\n- The last event is what Frank does alone.",
           "BK + P: closing sequence as in the story's ending (Extract J covers the call and the railing)."))
NEWQ[10] = q

# ───────────────────────── 6.1 Inversnaid ─────────────────────────
U = "poetry"
q = []
o, a = fitb("Lines:", "16")
q.append(Q(1, U, "structure_and_form", "poem_form", ["identify_poem_structure"],
           "How many lines are there in the poem 'Inversnaid'? Write the number.", o, a, "fitb", 1, 1,
           "- Count the numbers printed in the margin of the poem.\n- Write digits only.",
           "P: the poem is printed with 16 numbered lines."))
o, a = mc("a small stream", ["a mountain", "a type of bird", "a rock formation"])
q.append(Q(2, U, "figurative_language", "word_meaning_in_context", ["explain_word_in_context"],
           "What is a 'burn' in the poem 'Inversnaid'?", o, a, "multiple_choice", 2, 2,
           "- The poet uses it for the water he is describing.\n- It is a Scots word.",
           "P + BK: 'burn' = stream (Scots); poem is about a stream."))
o, a = mc("a bonnet blown by the wind", ["a mountain peak", "a fisherman's net", "a sleeping animal"])
q.append(Q(3, U, "imagery", "comparison_in_context", ["explain_imagery"],
           "In the phrase 'a windpuff-bonnet of fáwn-fróth', what is the foam compared to?", o, a, "multiple_choice", 3, 3,
           "- A bonnet is something worn on the head.\n- The first part of the compound tells you what moves it.",
           "P: line 5 of the poem (compound image)."))
o, a = ms(["a stream (burn)", "a pool"], ["a desert", "a snow-capped mountain", "a busy city street"])
q.append(Q(4, U, "imagery", "natural_features", ["explain_imagery"],
           "Select the TWO natural features that are described in the poem.", o, a, "multi_select", 1, 1,
           "- Read the first stanzas: what is the poet looking at?\n- Reject features that do not appear in the poem.",
           "P: stream and pool are printed in lines 1–8."))
o, a = mc("It stresses the speaker's plea for wild places to be left as they are.",
          ["It shows that the poet cannot think of anything new to say.", "It makes the poem sound like a cheerful nursery rhyme.",
           "It shows that the poet has forgotten the earlier lines."])
q.append(Q(5, U, "poetic_devices", "repetition", ["explain_effect_of_structure"],
           "What is the effect of the poet's repetition of 'let them be left' and 'wildness and wet' in the last stanza?",
           o, a, "multiple_choice", 3, 3,
           "- Repeated words often show how strongly the speaker feels.\n- Think about what the speaker wants to happen to these places.",
           "P: repetition printed in lines 14–15."))
NEWQ[11] = q

# ───────────────────────── 6.2 Sonnet 73 ─────────────────────────
q = []
o, a = fitb("Lines:", "14")
q.append(Q(1, U, "structure_and_form", "poem_form", ["identify_poem_structure"],
           "How many lines does a sonnet have? Write the number.", o, a, "fitb", 1, 1,
           "- Count the lines printed for 'Sonnet 73'.\n- Write digits only.",
           "P + BK: the poem has 14 numbered lines; a sonnet is a 14-line form."))
o, a = mc("three quatrains followed by a couplet", ["four stanzas of four lines each", "two octaves", "six couplets"])
q.append(Q(2, U, "structure_and_form", "poem_form", ["identify_poem_structure"],
           "How is 'Sonnet 73' arranged?", o, a, "multiple_choice", 2, 2,
           "- Count the lines in each part and look at the last two lines.\n- A quatrain is a set of four lines.",
           "P: 12 lines in three groups of four, then two lines (printed layout)."))
o, a = mc("a loved one", ["a king", "the sea", "a stranger in a crowd"])
q.append(Q(3, U, "poetic_devices", "addressee", ["identify_speaker_and_audience"],
           "Who is the speaker addressing in the poem?", o, a, "multiple_choice", 2, 2,
           "- The word 'thou' appears again and again.\n- Think about the last two lines, which talk about love.",
           "P: 'thou' and 'thy love' are printed in the poem."))
o, a = ms(["cold", "bare"], ["warm", "green", "singing"])
q.append(Q(4, U, "imagery", "season_imagery", ["explain_imagery"],
           "Select the TWO words from the first four lines that show the poem is about the end of a year.", o, a, "multi_select", 2, 2,
           "- Think about words that describe winter branches without leaves.\n- Reject words that describe spring or summer.",
           "P: 'cold' and 'bare' are printed in lines 3–4."))
o, a = mc("soon", ["slowly", "never", "yesterday"])
q.append(Q(5, U, "figurative_language", "word_meaning_in_context", ["explain_word_in_context"],
           "What does 'ere long' mean in the last line of the poem?", o, a, "multiple_choice", 2, 2,
           "- 'Ere' is an old word for 'before'.\n- Think of what 'before a long time' would mean.",
           "PT: vocabulary meaning of 'ere long'."))
NEWQ[12] = q
