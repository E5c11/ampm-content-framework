#!/usr/bin/env python3
"""English FAL Nov 2024 Paper 2 generator (12 lessons). Fresh-target practice sets (SETWORK-LES-05); aiExplanation per real printed number."""
from fal2024_common import *  # noqa

PAPER = "nov_p2"
LS = []
CRY, JH, MAC, MCMA, TRI, WIND, SLAVE, HARD = ("cry_the_beloved_country", "strange_case_of_dr_jekyll_and_mr_hyde", "macbeth", "my_children_my_africa",
                                              "triumph_in_the_face_of_adversity", "the_wind_and_a_boy", "the_slave_dealer", "hard_to_find")


def lesson(order, name, key, marks, qn, mn, extract, pages, tags, header, questions, ai):
    LS.append(dict(order=order, name=name, text_key=key, marks=marks, q=qn, m=mn, supp=[(extract, pages, f"a{order}")], tags=tags,
                   questions=questions, ai=ai, header=header))


# ═════════ 1.1 Cry — Extract A (the letter) ═════════
U = "novel"
q = []
o, a = match([("Mrs Lithebe", "gives Kumalo a room in Johannesburg"), ("Gertrude", "Stephen Kumalo's sister, who is lost in the city"),
              ("James Jarvis", "the white farmer whose son is murdered")])
q.append(Q(1, U, "character_analysis", "match_characters_to_roles", ["match_characters_to_roles"],
           "Match each character from Cry, the Beloved Country to the description that fits.", o, a, "match", 2, 2,
           "- Think about who lives in the city and who lives above Ndotsheni.\n- Use the pair you are surest of first.", None,
           "BK/M: Mrs Lithebe lodges Kumalo (2025 memo 1.1.1), Gertrude is his sister, James Jarvis's son Arthur is murdered."))
m, a = fitb("City:", "Johannesburg")
q.append(Q(2, U, "setting_and_atmosphere", "places_in_the_novel", ["identify_setting"],
           "In which city does Stephen Kumalo search for his sister and his son? Write one word.", m, a, "fitb", 1, 1,
           "- It is the big city that the villagers call a place of danger and gold.\n- Write one word.", None,
           "BK: the novel's city setting is Johannesburg (named in the 2024 and 2025 memos)."))
o, a = mc("He joins a robbery and a gun he carries is used to kill Arthur Jarvis.",
          ["He is blamed for a crime that he did not witness.", "He sets fire to a church in Ndotsheni.", "He steals from his own father in the village."])
q.append(Q(3, U, "plot_structure", "key_events", ["recall_key_events"],
           "What does Absalom do that leads to his death sentence?", o, a, "multiple_choice", 2, 2,
           "- Think about the crime for which Absalom is tried.\n- It is committed in a house in a white suburb.", None,
           "M: 2024 memo 1.2.7 — he agrees to carry the gun that kills Arthur Jarvis."))
mm, a = order5(["Kumalo receives a letter from Johannesburg", "Kumalo finds Gertrude in the city", "Absalom is arrested for murder",
                "Kumalo returns to Ndotsheni"], [2, 0, 3, 1])
q.append(Q(4, U, "plot_structure", "sequence_of_events", ["order_events"],
           "Arrange these events from the novel in the order in which they happen.", mm, a, "ordering", 2, 2,
           "- The letter is what sets the journey in motion.\n- Kumalo comes back home after the trial.", None, "BK: broad plot order."))
o, a = ms(["Gertrude's small son", "Absalom's pregnant wife"], ["Absalom himself", "John Kumalo", "Gertrude"])
q.append(Q(5, U, "plot_structure", "key_events", ["identify_stated_reasons"],
           "Select the TWO people Kumalo brings back to Ndotsheni.", o, a, "multi_select", 3, 2,
           "- Think about who is left in the city and who can travel home.\n- Gertrude disappears before the return.", None,
           "BK: Kumalo returns with Absalom's wife and Gertrude's child; 2025 memo 1.1.7 confirms Absalom's wife is cared for in Ndotsheni."))
AI = [
 ("1.1.1", 4, ["Recall each character's role in the novel."], ["Match the characters you know first", "Use the remaining descriptions for the others"],
  ["1. Msimangu accompanies Stephen to his brother's shop.", "2. Arthur Jarvis writes The Truth About Native Crime.", "3. Absalom becomes head boy of the reformatory.", "4. Father Vincent finds Stephen a pro deo lawyer."]),
 ("1.1.2", 1, ["Replace the one wrong word with the correct title."], ["Read the statement", "Identify what John became"], ["1. John Kumalo is a carpenter who turned politician, not pastor."]),
 ("1.1.3", 2, ["Think about how Mrs Kumalo feels when asked about the letter."], ["Name the tone", "Say why she uses it"], ["1. The tone is confused, questioning or nervous.", "2. She is as baffled and anxious as her husband about the letter."]),
 ("1.1.4", 2, ["Think about who the letter is not from."], ["Say what Stephen feels", "Give the reason"], ["1. Stephen is despondent or disappointed.", "2. The letter is not from Absalom, who has not written for a long time."]),
 ("1.1.5", 2, ["Irony is a gap between what is said and what is done."], ["State what he says", "State what he does"], ["1. Stephen asks who is afraid, pretending he is not.", "2. Yet he avoids opening the letter and tells his wife to open it."]),
 ("1.1.6", 2, ["Look at how she opens and reads the letter."], ["Name a trait", "Support it from the lines"], ["1. She is brave to open an unknown letter, or sensitive because she reads slowly to soften the impact."]),
 ("1.1.7", 2, ["Think about what the letter makes him do about Gertrude."], ["Say what he decides", "Say what he uses"], ["1. It encourages him to use his savings and travel to Johannesburg.", "2. He goes to find Gertrude, who is unwell."]),
 ("1.1.8", 3, ["Decide how you feel about Gertrude, then use events from the whole novel."], ["State your view", "Give two or three pieces of evidence"],
  ["1. Yes: her husband goes to Johannesburg and she never hears from him; she is left alone with an infant and drifts into the city's social ills.", "2. No: she could have returned to Ndotsheni, where her brother and his wife would support her, and she chooses a life of immorality.", "3. Either view must be substantiated."]),
]
lesson(1, "Question 1.1: Cry, the Beloved Country", CRY, 18, 1, 2, "Extract A", 1, ["literary_essay", "character_analysis", "thematic_analysis"],
       "Cry, the Beloved Country — Extract A (the letter, Book 1 Ch. 2). 1.1.1–1.1.8, 18 marks.", q, AI)

# ═════════ 1.2 Cry — Extract B (Jarvis in mourning) ═════════
q = []
o, a = mc("He arranges for a dam to be built to help the village.", ["He moves his family permanently to Johannesburg.", "He sells his farm and leaves the country.",
                                                                      "He opens a bank in Ndotsheni."])
q.append(Q(1, U, "plot_structure", "hope_for_ndotsheni", ["recall_key_events"],
           "How does James Jarvis help the people of Ndotsheni?", o, a, "multiple_choice", 2, 2,
           "- Think about the great need of the valley in the hills.\n- Water is scarce there.", None, "M: 2025 memo 1.1.1 — James Jarvis arranges for the dam to be built."))
m, a = fitb("Name:", "Arthur|Arthur Jarvis")
q.append(Q(2, U, "character_analysis", "family_relationships", ["recall_key_events"],
           "What is the name of James Jarvis's son, who is murdered? Write his first name.", m, a, "fitb", 1, 1,
           "- He is a white man who works for justice in Johannesburg.\n- Write his first name.", None, "M: Arthur Jarvis is James Jarvis's son (2024 memo 1.2.1)."))
o, a = match([("Ndotsheni", "a village in the hills where Kumalo is a priest"), ("Johannesburg", "the big city with its crime and gold"),
              ("Sophiatown", "the area where Mrs Lithebe lives")])
q.append(Q(3, U, "setting_and_atmosphere", "places_in_the_novel", ["identify_setting"],
           "Match each place in the novel to its description.", o, a, "match", 2, 2,
           "- Think about the village and the city first.\n- One place is a suburb of Johannesburg.", None,
           "BK: Ndotsheni, Johannesburg and Sophiatown (Mrs Lithebe's home). Verify the Sophiatown detail."))
o, a = ms(["Stephen Kumalo", "James Jarvis"], ["Msimangu", "John Kumalo", "Mrs Lithebe"])
q.append(Q(4, U, "theme_identification", "themes_of_the_novel", ["identify_theme_evidence"],
           "Select the TWO characters who each lose a son in the novel.", o, a, "multi_select", 2, 2,
           "- One son is murdered and one son is hanged.\n- The fathers meet again at the end of the story.", None,
           "BK/M: Arthur Jarvis is killed (James Jarvis); Absalom is sentenced to death (Kumalo)."))
mm, a = order5(["James Jarvis learns of his son's murder", "James Jarvis travels to Johannesburg", "James Jarvis reads his son's books and writings",
                "James Jarvis helps Ndotsheni"], [3, 0, 2, 1])
q.append(Q(5, U, "plot_structure", "sequence_of_events", ["order_events"],
           "Arrange these events in James Jarvis's story in the order in which they happen.", mm, a, "ordering", 3, 3,
           "- He cannot read his son's writings before he arrives in the city.\n- His help for the village comes last.", None,
           "BK/M: broad order; the writings are read in Johannesburg (Extract B setting)."))
AI = [
 ("1.2.1", 2, ["Think about what James Jarvis is looking at in the study."], ["Say what happens", "Give the place"], ["1. It takes place when James Jarvis discovers the large number of books and papers.", "2. He is in Arthur's study or home."]),
 ("1.2.2", 1, ["Think about what the book was about."], ["Say why he takes it"], ["1. He wanted to read more about the Gettysburg speech, Abraham Lincoln or his son."]),
 ("1.2.3", 1, ["Think about the stain on the floor of the passage."], ["Use the context", "Choose the best option"], ["1. The 'dark stain' is blood: B."]),
 ("1.2.4", 4, ["Look at how the memory comes unasked."], ["Name his state of mind", "Say what the boy later does"],
  ["1. (a) Jarvis is nostalgic; the memory of his son's childhood comes to mind unasked.", "2. (b) 'The small boy', Arthur, runs a boys' club in Claremont and fights for justice for black South Africans."]),
 ("1.2.5", 3, ["Death is given a human action."], ["Name the figure of speech", "Explain it"], ["1. (a) Personification.", "2. (b) As death rushes through a door like a person, Arthur's sudden death is emphasised."]),
 ("1.2.6", 3, ["Think about who feels regret in the novel."], ["Define the theme", "Give two or three examples"],
  ["1. James Jarvis regrets not getting to know his adult son better.", "2. Gertrude regrets falling into disrepute.", "3. Absalom regrets joining the cousin and friend who abandon him in court."]),
 ("1.2.7", 3, ["Decide whether Absalom is to blame, then use events."], ["State your view", "Give evidence"],
  ["1. Yes: he leaves a stable factory job, joins a bad crowd and carries the gun.", "2. No: he is timid, manipulated by his cousin and friend, unprepared for the city and away from his parents."]),
]
lesson(2, "Question 1.2: Cry, the Beloved Country", CRY, 17, 2, 2, "Extract B", 1, ["literary_essay", "character_analysis", "thematic_analysis"],
       "Cry, the Beloved Country — Extract B (James Jarvis in mourning, Book 2 Ch. 3). 1.2.1–1.2.7, 17 marks.", q, AI)

# ═════════ 2.1 Jekyll — Extract C ═════════
q = []
o, a = mc("A man tramples a child in the street and pays her family with a cheque.", ["A servant steals a bottle from a laboratory.",
                                                                                     "A doctor refuses to attend a dying patient.", "A lawyer is tricked by a stranger at a station."])
q.append(Q(1, "novel", "plot_structure", "key_events", ["recall_key_events"],
           "Which story does Mr Enfield tell Mr Utterson?", o, a, "multiple_choice", 2, 2,
           "- It is told on a Sunday walk and is about the door.\n- A child is hurt in it.", None, "M: 2024 memo 2.1.5 — the cheque paid to the trampled girl's family is signed by Jekyll."))
m, a = fitb("Profession:", "lawyer")
q.append(Q(2, "novel", "character_analysis", "character_from_words", ["recall_key_events"],
           "What is Mr Utterson's profession? Write one word.", m, a, "fitb", 1, 1,
           "- He deals with wills and legal papers.\n- Write one word.", None, "P: Utterson is called 'the lawyer' in the extract."))
o, a = match([("Poole", "Jekyll's butler or servant"), ("Dr Lanyon", "Jekyll's old friend who is a doctor"), ("Mr Guest", "Utterson's clerk who knows handwriting")])
q.append(Q(3, "novel", "character_analysis", "match_characters_to_roles", ["match_characters_to_roles"],
           "Match each character from the novel to the description that fits.", o, a, "match", 3, 2,
           "- Think about who works for Jekyll and who works for Utterson.\n- One character is a doctor.", None,
           "M: Mr Guest and the handwriting are in 2024 memo 2.1.6; Poole is Jekyll's servant (2025 memo 2.2.5)."))
mm, a = order5(["Story of the Door", "Search for Mr Hyde", "The Carew Murder Case", "Incident of the Letter"], [2, 0, 3, 1])
q.append(Q(4, "novel", "plot_structure", "sequence_of_events", ["order_events"],
           "Arrange these chapters of the novel in the order in which they appear.", mm, a, "ordering", 3, 3,
           "- The story starts at the door.\n- The letter comes after the murder.", None,
           "P/BK: chapter titles printed in the 2024 and 2025 papers; order as in the novel."))
o, a = ms(["He tramples a child.", "He murders Sir Danvers Carew."], ["He robs a bank.", "He burns Utterson's house.", "He poisons Dr Lanyon."])
q.append(Q(5, "novel", "plot_structure", "key_events", ["identify_stated_reasons"],
           "Select the TWO violent acts that Mr Hyde commits.", o, a, "multi_select", 2, 2,
           "- One happens in a back street and one in a lane at night.\n- Reject crimes that the novel does not describe.", None,
           "P/M: the trampling (2025 Extract C) and the Carew murder (2025 memo 2.2.5)."))
AI = [
 ("2.1.1", 4, ["Recall what each man does in the story."], ["Match the names you know first", "Use the unused descriptions"],
  ["1. Carew is murdered by Hyde.", "2. Jekyll transforms and shocks friends.", "3. Enfield minds his own business.", "4. Utterson recognises the murder weapon."]),
 ("2.1.2", 2, ["Think about what Lanyon's anger is about."], ["Say why Utterson is relieved", "Link it to Hyde"], ["1. He sees Lanyon's anger at Jekyll's scientific beliefs as a sign that there is no sinister link between Hyde and Jekyll."]),
 ("2.1.3", 3, ["(a) Change the one wrong word. (b) Think about the sleepless night."], ["Fix the statement", "Name his state of mind"],
  ["1. (a) Hyde's dwelling is in Soho, or Utterson's dwelling is in London/Gaunt Street.", "2. (b) Utterson is confused or troubled, struggling to piece together the puzzle."]),
 ("2.1.4", 3, ["A mind is described as held captive."], ["Name the figure of speech", "Explain it"], ["1. (a) Metaphor or personification.", "2. (b) As a slave is controlled by his owner, Utterson's mind is occupied by the mystery."]),
 ("2.1.5", 3, ["(a) Look for details of Enfield's story. (b) Recall their relationship."], ["Give two details", "Choose the relationship"],
  ["1. (a) The cheque is signed by Jekyll; Enfield sees Hyde enter Jekyll's laboratory; the figure has control over Jekyll (any two).", "2. (b) Enfield is a distant relative of Utterson: C."]),
 ("2.1.6", 3, ["Decide whether Utterson helps Jekyll hide his double life, then use events."], ["State your view", "Give evidence"],
  ["1. Yes: Utterson does not confront Jekyll about the murder weapon or Hyde's key, and stays silent when Mr Guest confirms the handwriting is similar.", "2. No: he is unaware of the experiment, trusts his friend and tries to help him."]),
]
lesson(3, "Question 2.1: Strange Case of Dr Jekyll and Mr Hyde", JH, 18, 2, 2, "Extract C", 1, ["literary_essay", "character_analysis", "figurative_language"],
       "Strange Case of Dr Jekyll and Mr Hyde — Extract C ('Search for Mr Hyde'). 2.1.1–2.1.6, 18 marks.", q, AI)

# ═════════ 2.2 Jekyll — Extract D (Lanyon's narrative) ═════════
q = []
o, a = mc("It changes him into Mr Hyde.", ["It makes him invisible.", "It makes him forget his work.", "It cures his friends' illnesses."])
q.append(Q(1, "novel", "plot_structure", "how_the_truth_is_revealed", ["recall_key_events"],
           "What does Dr Jekyll's mixture do to him?", o, a, "multiple_choice", 1, 1,
           "- Think about the experiment at the heart of the novel.\n- Hyde appears when Jekyll drinks it.", None, "BK: the potion transforms Jekyll into Hyde (2024 memo 2.2.5)."))
m, a = fitb("Name:", "Lanyon")
q.append(Q(2, "novel", "plot_structure", "key_events", ["recall_key_events"],
           "Which doctor dies after seeing Hyde's transformation? Write the surname.", m, a, "fitb", 2, 2,
           "- He is one of Jekyll's oldest friends.\n- Write one name.", None, "BK: Dr Lanyon dies after witnessing the transformation (2025 Q1 practice and chapter title)."))
o, a = ms(["Dr Lanyon's Narrative", "Henry Jekyll's Full Statement of the Case"], ["Mr Utterson's will", "Poole's diary", "Mr Enfield's letter"])
q.append(Q(3, "novel", "plot_structure", "how_the_truth_is_revealed", ["identify_stated_reasons"],
           "Select the TWO documents that reveal the truth about Jekyll and Hyde.", o, a, "multi_select", 3, 2,
           "- Both are written by the men who know the secret.\n- Reject documents that do not exist in the novel.", None,
           "P/BK: 'Dr Lanyon's Narrative' is printed in the paper; Jekyll's Full Statement is the final chapter."))
mm, a = order5(["Jekyll sends a desperate letter to Lanyon", "Lanyon collects the drawer from the laboratory", "A messenger arrives at midnight",
                "The messenger drinks the mixture"], [2, 3, 0, 1])
q.append(Q(4, "novel", "plot_structure", "sequence_of_events", ["order_events"],
           "Arrange these events from Lanyon's narrative in the order in which they happen.", mm, a, "ordering", 3, 3,
           "- Lanyon cannot collect the drawer before he is asked.\n- The transformation happens last.", None, "P/BK: order follows the letter and Lanyon's narrative."))
o, a = mc("Dr Lanyon, in the first person", ["Mr Utterson, in the third person", "Mr Enfield, in the first person", "Poole, in the third person"])
q.append(Q(5, "novel", "figurative_language", "point_of_view", ["identify_narrative_voice"],
           "Whose point of view tells the events in 'Dr Lanyon's Narrative'?", o, a, "multiple_choice", 2, 2,
           "- Look at the pronoun in 'I made sure my colleague was insane'.\n- The writer is part of the story.", None, "P: the extract says 'I made sure my colleague was insane'."))
AI = [
 ("2.2.1", 2, ["Think about what Utterson is reading and where."], ["Say what is happening", "Give the place"], ["1. It takes place when Utterson reads Lanyon's letter.", "2. He is at home or in his office."]),
 ("2.2.2", 1, ["Look at where Jekyll says he is hiding."], ["Name the place"], ["1. It is the hotel or inn in Portland Street where Jekyll hides."]),
 ("2.2.3", 2, ["Think about how someone writes when they need rescue."], ["Name the tone", "Say why"], ["1. The tone is pleading or desperate.", "2. Jekyll urgently needs Lanyon to rescue him."]),
 ("2.2.4", 2, ["Think about their friendship and Lanyon's profession."], ["Give two reasons"], ["1. Lanyon is one of Jekyll's oldest friends.", "2. Jekyll trusts him with his life; as a scientist he will recognise the drawer's contents (any two)."]),
 ("2.2.5", 2, ["Irony is a gap between what is said and the truth."], ["State what Jekyll says", "State the truth"], ["1. Jekyll says a messenger will come.", "2. In fact Jekyll, in Hyde's body, will collect the drawer himself."]),
 ("2.2.6", 2, ["Look at how Lanyon decides to help."], ["Name a trait", "Support it"], ["1. Lanyon is dutiful, helping despite the strange request.", "2. Or he is rational and cautious: he does not dismiss it as insane but investigates."]),
 ("2.2.7", 3, ["Think about who is in conflict in the novel."], ["Define conflict", "Give examples"],
  ["1. Lanyon and Jekyll clash over science.", "2. Jekyll is in conflict with Hyde when he cannot control him.", "3. Utterson and Hyde clash when Utterson confronts him."]),
 ("2.2.8", 3, ["Decide whether Jekyll enjoys being Hyde, then use events."], ["State your view", "Give evidence"],
  ["1. Yes: as Hyde he indulges in immoral acts, keeps up his experiments and ignores the wish to stop.", "2. No: he shows remorse after the Carew murder, tries to stop drinking the potion and admits Hyde is monstrous."]),
]
lesson(4, "Question 2.2: Strange Case of Dr Jekyll and Mr Hyde", JH, 17, 2, 3, "Extract D", 1, ["literary_essay", "thematic_analysis", "irony"],
       "Strange Case of Dr Jekyll and Mr Hyde — Extract D ('Dr Lanyon's Narrative'). 2.2.1–2.2.8, 17 marks.", q, AI)

# ═════════ 3.1 Macbeth — Extract E (banquet) ═════════
U = "drama"
q = []
mm, a = order5(["Macbeth sees a dagger before Duncan's murder", "Macbeth sees Banquo's ghost at the feast", "Lady Macbeth sleepwalks", "Macbeth fights Macduff"], [3, 1, 0, 2])
q.append(Q(1, U, "plot_structure", "sequence_of_events", ["order_events"],
           "Arrange these events from Macbeth in the order in which they happen.", mm, a, "ordering", 2, 2,
           "- The dagger comes before the murder.\n- The final fight is the last event.", None, "BK: Act 2.1 → 3.4 → 5.1 → 5.8."))
m, a = fitb("Hill:", "Dunsinane")
q.append(Q(2, U, "plot_structure", "places_in_the_play", ["identify_setting"],
           "At which castle does Macbeth make his last stand? Write one word.", m, a, "fitb", 2, 2,
           "- The forest is said to come to this place.\n- Write one word.", None, "P: Dunsinane is printed in the 2025 and 2024 extracts."))
o, a = match([("Duncan", "the king who is murdered in Macbeth's castle"), ("Banquo", "Macbeth's friend whose descendants the witches say will be kings"),
              ("Lady Macduff", "Macduff's wife, killed with her children")])
q.append(Q(3, U, "character_analysis", "match_characters_to_roles", ["match_characters_to_roles"],
           "Match each character from Macbeth to the description that fits.", o, a, "match", 2, 2,
           "- Think about who is king when the play begins.\n- One woman is not Macbeth's wife.", None, "BK: core plot facts."))
o, a = ms(["He orders Banquo's murder.", "He has Macduff's family killed."], ["He gives his crown to Malcolm.", "He sails to England.", "He frees the witches."])
q.append(Q(4, U, "plot_structure", "key_events", ["identify_stated_reasons"],
           "Select the TWO crimes that Macbeth orders after he becomes king.", o, a, "multi_select", 3, 3,
           "- Both are meant to remove threats to his rule.\n- Reject actions that do not appear in the play.", None, "BK/M: Banquo (Act 3) and Macduff's family (2024 memo 3.2.1)."))
o, a = mc("That he will be king in the future.", ["That he will die in battle at once.", "That he will lose his castle.", "That he will marry a queen."])
q.append(Q(5, U, "plot_structure", "the_prophecies", ["recall_key_events"],
           "What do the witches promise Macbeth when he first meets them?", o, a, "multiple_choice", 1, 1,
           "- They greet him with titles that he does not yet hold.\n- The last title is the greatest.", None, "BK: Act 1.3 — 'that shalt be king hereafter'; 2024 memo 3.1.9 refers to the prediction."))
AI = [
 ("3.1.1", 4, ["Recall each man's role in the play."], ["Match what you know", "Eliminate descriptions"],
  ["1. Macduff is Thane of Fife.", "2. Macbeth is King Duncan's cousin.", "3. Fleance is Banquo's teenage son.", "4. Malcolm is King Duncan's heir."]),
 ("3.1.2", 2, ["Think about the feast and Banquo's ghost."], ["Say what happens", "Give the place"], ["1. It is when Macbeth sees Banquo's ghost during the feast.", "2. It is in the banqueting hall of the palace at Forres."]),
 ("3.1.3", 2, ["Think about gestures of defiance."], ["Choose two actions"], ["1. Beat his chest; approach the ghost; pace up and down; throw his hands in the air (any two)."]),
 ("3.1.4", 2, ["Look at what worries Lady Macbeth about the evening."], ["Name a trait", "Support it"], ["1. She is insensitive or selfish because she cares more about the mood of the feast.", "2. Or she is well-composed, staying calm despite his behaviour."]),
 ("3.1.5", 1, ["Think about what only Macbeth can see."], ["Use the context"], ["1. 'Such sights' refers to Banquo's ghost: D."]),
 ("3.1.6", 1, ["Think about what she fears Ross might learn."], ["Say why"], ["1. She does not want Ross to question Macbeth, who might reveal their secret."]),
 ("3.1.7", 2, ["Look at Lennox's wish for Macbeth."], ["Name a state of mind"], ["1. Lennox is concerned about Macbeth's well-being, or hopeful of a speedy recovery."]),
 ("3.1.8", 1, ["Replace the wrong place."], ["Find the wrong word"], ["1. Macbeth's coronation takes place at Scone."]),
 ("3.1.9", 3, ["Decide whether unnatural events matter, then use events."], ["State your view", "Give evidence"],
  ["1. Yes: the witches' prediction drives the plot, Banquo's ghost unnerves Macbeth, and Duncan's murder leads to Lady Macbeth's madness.", "2. No: Macbeth's ambition fuels his actions and the guilt of Macbeth and his wife has the dire consequences."]),
]
lesson(5, "Question 3.1: Macbeth", MAC, 18, 2, 2, "Extract E", 2, ["literary_essay", "character_analysis", "dramatic_techniques"],
       "Macbeth — Extract E (the banquet and Banquo's ghost, Act 3 Sc 4). 3.1.1–3.1.9, 18 marks.", q, AI)

# ═════════ 3.2 Macbeth — Extract F (last fight) ═════════
q = []
o, a = mc("Malcolm", ["Banquo", "Fleance", "Macduff"])
q.append(Q(1, U, "plot_structure", "closing_events", ["recall_key_events"],
           "Who is made king of Scotland at the end of the play?", o, a, "multiple_choice", 1, 1,
           "- He is Duncan's elder son and heir.\n- He leads the army against Macbeth.", None, "M: 2024 memo 3.2.7 — Malcolm takes his rightful seat as king."))
m, a = fitb("Wood:", "Birnam")
q.append(Q(2, U, "plot_structure", "the_prophecies", ["recall_key_events"],
           "Which wood does Malcolm's army use as camouflage? Write one word.", m, a, "fitb", 2, 2,
           "- Macbeth was told he is safe until a wood moves.\n- Write one word.", None, "P: Birnam Wood is printed in the 2025 and 2024 extracts."))
o, a = mc("He wants to learn more about his future and whether he is safe.", ["He wants to ask them to leave Scotland.", "He wants them to crown Banquo.", "He wants to thank them for Duncan's death."])
q.append(Q(3, U, "plot_structure", "the_prophecies", ["explain_reason_in_context"],
           "Why does Macbeth go back to the witches in the middle of the play?", o, a, "multiple_choice", 2, 2,
           "- By now he is king but afraid.\n- He wants more certainty.", None, "BK: Act 4.1."))
mm, a = order5(["Malcolm's army cuts branches from Birnam Wood", "Macbeth hears that Lady Macbeth is dead", "Macbeth and Macduff fight", "Malcolm is hailed as king"], [2, 0, 3, 1])
q.append(Q(4, U, "plot_structure", "sequence_of_events", ["order_events"],
           "Arrange these events from the end of the play in the order in which they happen.", mm, a, "ordering", 3, 3,
           "- The army hides its numbers before the battle.\n- The new king is named last.", None, "BK: Act 5.4 → 5.5 → 5.8 → 5.8."))
o, a = ms(["Duncan", "Banquo"], ["Macbeth", "Malcolm", "Macduff"])
q.append(Q(5, U, "plot_structure", "closing_events", ["recall_key_events"],
           "Select the TWO characters who are dead before the final act begins.", o, a, "multi_select", 3, 2,
           "- Both are killed by Macbeth's orders or hand.\n- The others are alive in the last battle.", None, "BK: Duncan (Act 2) and Banquo (Act 3) die before Act 5."))
AI = [
 ("3.2.1", 3, ["Macbeth speaks of his soul as if it carried a load."], ["Name the figure", "Explain it"], ["1. (a) Metaphor.", "2. (b) As a sinner feels guilty, Macbeth feels guilty for killing Macduff's family and is unwilling to kill again."]),
 ("3.2.2", 2, ["Macduff answers with action, not talk."], ["Say what he means"], ["1. He does not want to answer Macbeth; his answer will be shown in his sword."]),
 ("3.2.3", 2, ["Irony is the gap between belief and outcome."], ["State Macbeth's belief", "State the outcome"], ["1. Macbeth thinks he cannot be killed by a man born naturally.", "2. Macduff, born unnaturally, kills him."]),
 ("3.2.4", 2, ["Think about double-talk."], ["Say why they are called fiends"], ["1. The witches lie or manipulate, deceiving him with double meanings."]),
 ("3.2.5", 2, ["Think about how Macduff taunts him."], ["Name the tone", "Say why"], ["1. The tone is sarcastic or mocking.", "2. Macduff wants Macbeth to feel inadequate."]),
 ("3.2.6", 3, ["Think about who questions manhood."], ["Define manhood", "Give examples"], ["1. Lady Macbeth challenges Macbeth's manhood.", "2. Lady Macduff questions Macduff's priorities.", "3. Banquo stays principled."]),
 ("3.2.7", 3, ["Decide whether the ending is positive, then use events."], ["State your view", "Give evidence"],
  ["1. Yes: Malcolm becomes king, order is restored and Macduff helps Malcolm.", "2. No: many people are killed, Lady Macbeth suffers and the witches face no consequences."]),
]
lesson(6, "Question 3.2: Macbeth", MAC, 17, 1, 2, "Extract F", 2, ["literary_essay", "thematic_analysis", "irony"],
       "Macbeth — Extract F (Macbeth's last fight, Act 5 Sc 8). 3.2.1–3.2.7, 17 marks.", q, AI)

# ═════════ 4.1 My Children! My Africa! — Extract G ═════════
q = []
m, a = fitb("School:", "Zolile")
q.append(Q(1, U, "plot_structure", "places_in_the_play", ["identify_setting"],
           "What is the name of the township school where Thami studies? Write one word.", m, a, "fitb", 2, 2,
           "- It is the school of the boy, not the girl.\n- Write one word.", None, "M: 2024 memo 4.2.7 names Zolile High and Camdeboo Girls' High."))
o, a = mc("a debating competition between their schools", ["a football match at the township", "a church choir competition", "a political rally"])
q.append(Q(2, U, "plot_structure", "central_conflict", ["recall_key_events"],
           "What event first brings Thami and Isabel together?", o, a, "multiple_choice", 2, 2,
           "- The two schools are arranged by their teachers.\n- Words and arguments are involved.", None, "M: 2024 memo 4.2.7/4.2.8 — the debating contest."))
mm, a = order5(["Thami and Isabel are chosen as a team", "They talk and get to know each other", "Thami withdraws from the quiz", "Mr M is killed"], [1, 3, 0, 2])
q.append(Q(3, U, "plot_structure", "sequence_of_events", ["order_events"],
           "Arrange these events from the play in the order in which they happen.", mm, a, "ordering", 3, 3,
           "- The pupils must be paired before they can talk.\n- Mr M's death is the tragic end.", None, "M: 2025 memo 4.2.2(b) and 4.1.6; broad order."))
o, a = mc("to protest against Bantu Education", ["to celebrate the end of the school year", "to demand longer school holidays", "to support the police"])
q.append(Q(4, U, "theme_identification", "themes_of_the_play", ["identify_theme_evidence"],
           "Why do the Comrades boycott classes?", o, a, "multiple_choice", 2, 2,
           "- Think about the education system at the time of the play.\n- It is described as inferior.", None, "M: 2024 memo 4.1.6 — Bantu Education and the revolt against it."))
AI = [
 ("4.1.1", 4, ["Recall each person's role in the play."], ["Match what you know first", "Use the remaining descriptions"],
  ["1. Mrs Makatini is the vetkoek seller.", "2. Mr Myalatya organises a debating competition.", "3. Thami Mbikwana abandons the literature quiz.", "4. Isabel Dyson wins the debating competition."]),
 ("4.1.2", 2, ["Think about what the characters are doing."], ["Say the time", "Give the place"], ["1. It takes place after the debating contest.", "2. It is at Zolile High School, in Number One Classroom."]),
 ("4.1.3", 1, ["Look at what Thami says about sport."], ["Name the sport"], ["1. Thami's favourite sport is soccer."]),
 ("4.1.4", 1, ["Think about where Isabel lives."], ["Choose the town"], ["1. Auntie lives in Brakwater: B."]),
 ("4.1.5", 2, ["Look at how proudly Thami says his name."], ["Name the tone", "Say why"], ["1. The tone is confident or boastful.", "2. Thami is proud of his ancestry."]),
 ("4.1.6", 2, ["Re-read what Thami says about the family."], ["Say what the father does", "Say what the mother does"], ["1. Isabel's father is a chemist who owns the Karoo Pharmacy.", "2. Her mother works in the pharmacy."]),
 ("4.1.7", 2, ["Irony: safe place versus what happens."], ["State the plan", "State the result"], ["1. Thami's parents send him to Brakwater to keep him safe.", "2. Yet he experiences unrest and boycotts there."]),
 ("4.1.8", 3, ["Decide if Thami is exemplary, then use events."], ["State your view", "Give evidence"],
  ["1. Yes: he works hard, represents his school, lets Mr M guide him and perseveres to Standard 10.", "2. No: his political involvement interrupts his learning, he challenges Mr M and does not entice pupils back."]),
]
lesson(7, "Question 4.1: My Children! My Africa!", MCMA, 17, 1, 2, "Extract G", 1, ["literary_essay", "character_analysis", "irony"],
       "My Children! My Africa! — Extract G (Thami and Isabel relaxed, Act 1 Sc 1). 4.1.1–4.1.8, 17 marks.", q, AI)

# ═════════ 4.2 My Children! My Africa! — Extract H ═════════
q = []
o, a = mc("the headmistress at Camdeboo Girls' High who works with Mr M", ["a Comrade at Zolile High", "Isabel's cousin in Cape Town", "the township police officer"])
q.append(Q(1, U, "character_analysis", "characters_and_roles", ["match_characters_to_roles"],
           "Who is Miss Brockway?", o, a, "multiple_choice", 3, 2,
           "- She works for Isabel's school.\n- She and Mr M arrange the contest.", None, "M/BK: memo 2024 4.2.7 names Miss Brockway; 'headmistress' is book knowledge — verify."))
m, a = fitb("Name:", "Mr M")
q.append(Q(2, U, "plot_structure", "closing_events", ["recall_key_events"],
           "Whose death ends the play? Write the name.", m, a, "fitb", 2, 2,
           "- He is a teacher who keeps ringing the school bell.\n- Write the name.", None, "M: 2025 memo 4.1.6 — the pupils kill Mr M."))
o, a = ms(["a belief in education", "a refusal to join the Comrades"], ["a plan to leave the country", "a wish to become a politician", "a fear of books"])
q.append(Q(3, U, "character_analysis", "mr_m", ["identify_stated_reasons"],
           "Select the TWO things that Mr M stands for.", o, a, "multi_select", 3, 3,
           "- Think about what he keeps doing even when it is dangerous.\n- He does not give in to pressure.", None, "M: 2025 memo 4.1.6 and 2024 memo 4.2.5."))
o, a = match([("Zolile High", "Thami's township school"), ("Camdeboo Girls' High", "Isabel's school"), ("Grahamstown", "where the literature quiz is held")])
q.append(Q(4, U, "plot_structure", "places_in_the_play", ["identify_setting"],
           "Match each place from the play to its description.", o, a, "match", 2, 2,
           "- Two are schools and one is a town.\n- Use the pair you are certain about first.", None, "M: 2024 memo 4.2.7 and 4.2.8."))
AI = [
 ("4.2.1", 2, ["Think about what an empty classroom means to Mr M."], ["Say why the silence is heavy"], ["1. The learners' absence leaves him without a purpose, depressed."]),
 ("4.2.2", 2, ["Think about gestures of despair."], ["Choose two actions"], ["1. Throw his hands in the air; stamp his foot; bang on the table (any two)."]),
 ("4.2.3", 2, ["Think about who may be listening to the bell."], ["Name his state of mind", "Say why"], ["1. Thami is fearful or anxious.", "2. The bell may alert the Comrades to Mr M's whereabouts and they might kill him."]),
 ("4.2.4", 3, ["The bell is compared to music."], ["Name the figure", "Explain it"], ["1. (a) Simile.", "2. (b) It shows how Thami once loved the bell, which is symbolic of his love of education."]),
 ("4.2.5", 2, ["Look at how he answers the warning."], ["Name a trait", "Support it"], ["1. Mr M is fearless or defiant because he refuses to walk away from danger."]),
 ("4.2.6", 1, ["Replace the relationship."], ["Find the wrong word"], ["1. Lucille is Isabel's sister; Renee is her friend."]),
 ("4.2.7", 3, ["Think about who works together."], ["Define teamwork", "Give examples"], ["1. Isabel and Thami work towards the literature quiz.", "2. Mr M and Miss Brockway foster relations between the schools.", "3. Isabel and her teammates work for victory."]),
 ("4.2.8", 3, ["Decide whether the contest is a good idea, then use events."], ["State your view", "Give evidence"],
  ["1. Yes: it leads to the literature quiz, shows township pupils can compete and teaches Isabel about Black people's reality.", "2. No: it may be unsafe, Zolile pupils are inexperienced and English is their second language."]),
]
lesson(8, "Question 4.2: My Children! My Africa!", MCMA, 18, 2, 2, "Extract H", 1, ["literary_essay", "character_analysis", "tone"],
       "My Children! My Africa! — Extract H (Mr M in the empty classroom, Act 2 Sc 3). 4.2.1–4.2.8, 18 marks.", q, AI)

# ═════════ 5.1 Triumph — Extract I ═════════
U = "short_stories"
q = []
o, a = mc("Thulisile's teacher", ["Thulisile's father", "a shopkeeper in the village", "a social worker"])
q.append(Q(1, U, "character_analysis", "characters_and_roles", ["match_characters_to_roles"],
           "Who is Mr Nkwane in the story?", o, a, "multiple_choice", 1, 1,
           "- She goes to speak to him at school.\n- He advises her about her studies.", None, "M: 2024 memo 5.1.2 — Mr Nkwane is Thulisile's teacher."))
o, a = mc("a television presenter", ["a doctor", "a police officer", "a bus driver"])
q.append(Q(2, U, "plot_structure", "closing_events", ["recall_key_events"],
           "What does Thulisile eventually become?", o, a, "multiple_choice", 2, 2,
           "- She is successful and well known in the end.\n- She works on screen.", None, "M: 2025 memo 5.1.5 and 2024 memo 5.1.7 — a famous television presenter."))
o, a = match([("Mme Sadike", "comforts Thulisile and gives her bread"), ("Mr Rathebe", "owns a fish and chips shop"), ("Mr Nkwane", "calls Thulisile in at school")])
q.append(Q(3, U, "character_analysis", "match_characters_to_roles", ["match_characters_to_roles"],
           "Match each character from the story to the description that fits.", o, a, "match", 2, 2,
           "- Think about who is a teacher and who owns a shop.\n- One woman helps Thulisile at her home.", None, "M: 2025 memo 5.1.4/5.1.1; 2024 memo 5.1.2."))
o, a = ms(["poverty", "pride"], ["revenge", "magic"])
q.append(Q(4, U, "theme_identification", "themes_suggested_by_the_title", ["identify_theme"],
           "Select the TWO ideas that are explored in the extract.", o, a, "multi_select", 2, 2,
           "- Think about what Thulisile says she has even though she has little.\n- Reject ideas that are not in the extract.", None, "P: the extract ends with 'I was poor … I didn't have pride'."))
o, a = mc("hardship or difficulty", ["great success", "a happy holiday", "a school prize"])
q.append(Q(5, U, "figurative_language", "word_meaning_in_context", ["explain_word_in_context"],
           "What does the word 'adversity' mean in the title?", o, a, "multiple_choice", 2, 2,
           "- The title pairs it with 'triumph'.\n- It is the opposite of an easy life.", None, "PT: vocabulary."))
AI = [
 ("5.1.1", 4, ["Recall each woman's role in the story."], ["Match what you know", "Use the remaining descriptions"],
  ["1. MaDlamini is an old-fashioned woman.", "2. Nthabiseng is a thoughtful friend.", "3. Zanele is a younger sister.", "4. Thembekile is an abused daughter-in-law."]),
 ("5.1.2", 2, ["Think about why she is called in."], ["Say when", "Say where"], ["1. It takes place after she fails a class test, when Mr Nkwane calls her in.", "2. It is in the staff room at school."]),
 ("5.1.3", 2, ["Think about her father and money."], ["Give two challenges"], ["1. Her father abuses her mother and siblings and drinks the little money.", "2. They have no food, live in a squatter camp or her mother does not protect the children (any two)."]),
 ("5.1.4", 2, ["Think about how she feels about his advice."], ["Say why she is upset"], ["1. She is upset or humiliated because Mr Nkwane does not seem to understand her situation."]),
 ("5.1.5", 2, ["Irony: what she says versus what she does."], ["State the wish", "State what she does"], ["1. She says she does not want the school's pity.", "2. Yet she goes begging door to door in her neighbourhood."]),
 ("5.1.6", 3, ["Think about who shows kindness."], ["Define kindness", "Give examples"], ["1. Mme Sadike gives hope and bread.", "2. Her grandmother lends money without expecting repayment.", "3. Mr Rathebe gives her a job and leftovers."]),
 ("5.1.7", 3, ["Decide whether she is a good role model, then use events."], ["State your view", "Give evidence"],
  ["1. Yes: she saves her school lunch for her siblings, starts a sweets business and becomes a famous presenter.", "2. No: she is jealous of Ntombi, questions her mother and ignores Mr Nkwane's advice."]),
]
lesson(9, "Question 5.1: 'Triumph in the Face of Adversity'", TRI, 18, 1, 2, "Extract I", 1, ["literary_essay", "character_analysis", "irony"],
       "'Triumph in the Face of Adversity' — Extract I (the narrator stands up for herself). 5.1.1–5.1.7, 18 marks.", q, AI)

# ═════════ 5.2 The Wind and a Boy — Extract J ═════════
q = []
m, a = fitb("Surname:", "Head")
q.append(Q(1, U, "plot_structure", "text_information", ["recall_key_events"],
           "Who wrote 'The Wind and a Boy'? Write the surname.", m, a, "fitb", 1, 1,
           "- The author is printed under the title in the paper.\n- Write one word.", None, "P: Bessie Head is printed in the 2024 paper."))
o, a = mc("Sejosenye is Friedman's grandmother.", ["Sejosenye is Friedman's teacher.", "Sejosenye is Friedman's sister.", "Sejosenye is a stranger who visits the village."])
q.append(Q(2, U, "character_analysis", "family_relationships", ["match_characters_to_roles"],
           "What is the relationship between Sejosenye and Friedman?", o, a, "multiple_choice", 2, 2,
           "- The extract says Friedman is 'like the grandmother'.\n- Her daughter is his mother.", None, "P/M: extract and 2024 memo 5.2.8."))
o, a = ms(["She left her own ward to live with a married man.", "She won him from his wife and married him."],
          ["She was sent away from the country.", "She became the village chief."])
q.append(Q(3, U, "character_analysis", "backstory_in_the_extract", ["identify_stated_reasons"],
           "Select the TWO things that the extract tells us about Sejosenye's past.", o, a, "multi_select", 2, 2,
           "- Look at the sentences about Ga-Sefete-Molemo ward.\n- Reject claims that the extract does not make.", None, "P: extract J lines 11–14."))
o, a = mc("shocked the village by behaving in a way people thought improper", ["pleased the village with her kindness", "frightened the village with a loud noise", "taught the village a new song"])
q.append(Q(4, U, "figurative_language", "word_meaning_in_context", ["explain_word_in_context"],
           "What does the word 'scandalised' mean in 'Sejosenye had scandalised the whole village'?", o, a, "multiple_choice", 3, 2,
           "- The village reacts to something she did.\n- A scandal is something shocking.", None, "PT: vocabulary from the extract."))
AI = [
 ("5.2.1", 2, ["Look at how she answers about Friedman."], ["Name her state of mind", "Support it"], ["1. Sejosenye is content, as she does not see Friedman as a burden as the others do."]),
 ("5.2.2", 1, ["Think about who laughs at him."], ["Say who 'they' are"], ["1. 'They' are the villagers, the people of the ward or the women."]),
 ("5.2.3", 1, ["The second phase comes before the third."], ["Use the context", "Choose"], ["1. Friedman was a toddler in his second phase: A."]),
 ("5.2.4", 3, ["The boy's movement is compared to an animal."], ["Name the figure", "Explain it"], ["1. (a) Simile.", "2. (b) As a cobra's movement signals danger, his movements show he is about to commit naughty acts."]),
 ("5.2.5", 2, ["Think about how the narrator feels about the wire cars."], ["Name the tone", "Say why"], ["1. The tone is admiring or approving.", "2. The narrator is impressed by his talent and innovation."]),
 ("5.2.6", 2, ["Think about the foreign doctor."], ["Give the source of the name"], ["1. He is named after a foreign doctor called Dr Friedman.", "2. The doctor was friendly to her and admired her commitment to the unborn baby."]),
 ("5.2.7", 2, ["Look at how she sails through the village."], ["Name a trait", "Support it"], ["1. Sejosenye is confident or proud as she lives with no regrets and is not troubled by what villagers think."]),
 ("5.2.8", 1, ["Replace the wrong daughter."], ["Find the wrong word"], ["1. Friedman is the son of Sejosenye's youngest or last-born daughter."]),
 ("5.2.9", 3, ["Decide whether his childhood is wonderful, then use events."], ["State your view", "Give evidence"],
  ["1. Yes: he can play, explore and is the only child in the village with a bicycle.", "2. No: he does not experience his mother's love, has many errands and dies tragically young."]),
]
lesson(10, "Question 5.2: 'The Wind and a Boy'", WIND, 17, 2, 2, "Extract J", 1, ["literary_essay", "character_analysis", "figurative_language"],
       "'The Wind and a Boy' — Extract J (Friedman's third phase). 5.2.1–5.2.9, 17 marks.", q, AI)

# ═════════ 6.1 The Slave Dealer ═════════
U = "poetry"
q = []
m, a = fitb("Stanzas:", "8")
q.append(Q(1, U, "structure_and_form", "poem_form", ["identify_poem_structure"],
           "How many stanzas does 'The slave dealer' have? Write the number.", m, a, "fitb", 1, 1,
           "- Each stanza has six lines.\n- Count the sets in the poem.", None, "P: 48 lines in six-line stanzas."))
o, a = mc("the slave dealer returning home", ["a fisherman", "a priest", "a soldier"])
q.append(Q(2, U, "poetic_devices", "speaker_and_subject", ["identify_speaker_and_audience"],
           "Who is the 'Wanderer' in the first line?", o, a, "multiple_choice", 1, 1,
           "- He comes from the ocean's wave to his mother's door.\n- The title gives the answer.", None, "P: title and stanza 1."))
o, a = mc("ababab", ["aabbcc", "abcabc", "abccba"])
q.append(Q(3, U, "structure_and_form", "rhyme_scheme", ["identify_poem_structure"],
           "What is the rhyme scheme of the first stanza?", o, a, "multiple_choice", 3, 3,
           "- Compare the last words of lines 1–6: came, dun, name, son, frame, run.\n- Rhymes alternate.", None, "P: came/name/frame (a), dun/son/run (b)."))
mm, a = order5(["The Wanderer returns home", "He tries to pray but visions drive good thoughts away", "He confesses that there is blood on his hands",
                "His mother cries that he could not have done such a murder"], [2, 0, 3, 1])
q.append(Q(4, U, "structure_and_form", "progression_of_ideas", ["order_events"],
           "Arrange these parts of the poem in the order in which they occur.", mm, a, "ordering", 3, 3,
           "- The poem begins with his arrival.\n- The mother speaks near the end.", None, "P: stanzas 1, 3, 4, 7."))
o, a = ms(["remorse", "fear"], ["pride", "joy"])
q.append(Q(5, U, "imagery", "emotions_in_the_poem", ["explain_imagery"],
           "Select the TWO feelings that torment the Wanderer.", o, a, "multi_select", 2, 2,
           "- Look at the words describing his mood in stanza 2 and the last line.\n- Reject feelings the poem does not show.", None, "P: lines 12 and 48."))
AI = [
 ("6.1.1", 4, ["Read the sentence and fit the word that suits each blank."], ["Use the context for each blank", "Check the word list"],
  ["1. (a) physically.", "2. (b) pray.", "3. (c) visions.", "4. (d) violently."]),
 ("6.1.2", 2, ["Think about the Wanderer's journey home."], ["Say when", "Say where"], ["1. It happens after he returns from his aimless travels.", "2. It is at his mother's home."]),
 ("6.1.3", 2, ["Irony: what 'tanned' suggests versus what he did."], ["Explain both parts"], ["1. He abused black people for their dark skin, yet he now resembles them as he is sunburnt.", "2. Or he went to make money by tormenting others and returns spiritually tormented."]),
 ("6.1.4", 1, ["Fever is compared to blood."], ["Name the figure"], ["1. Metaphor."]),
 ("6.1.5", 2, ["Think about what he sees and hears."], ["Give two reasons"], ["1. The woman's cries still haunt him.", "2. He remembers the look on her face."]),
 ("6.1.6", 1, ["Replace the wrong promise."], ["Find the wrong word"], ["1. The dying woman told him that God will punish him."]),
 ("6.1.7", 3, ["Think about what torments the dealer."], ["Define guilt", "Give examples"], ["1. He is plagued by what he made others endure.", "2. No amount of water can wash the blood from his hands.", "3. The woman's cry is like a refrain in his ears."]),
 ("6.1.8", 3, ["Decide whether the mother can be pitied, then use the poem."], ["State your view", "Give evidence"],
  ["1. Yes: she is a widow whose only son goes astray, does not recognise him on his return and nurses him in vain.", "2. No: she tries to convince him he is not guilty and exonerates him despite his confession."]),
]
lesson(11, "Question 6.1: 'The Slave Dealer'", SLAVE, 18, 1, 2, "Poem", 2, ["poetry_analysis", "poetic_devices", "imagery"],
       "'The Slave Dealer' by Thomas Pringle. 6.1.1–6.1.8, 18 marks.", q, AI)

# ═════════ 6.2 Hard to Find ═════════
q = []
m, a = fitb("Lines:", "15")
q.append(Q(1, U, "structure_and_form", "poem_form", ["identify_poem_structure"],
           "How many lines does 'Hard to find' have? Write the number.", m, a, "fitb", 1, 1,
           "- Count the numbers printed in the margin.\n- Write digits only.", None, "P: 15 numbered lines."))
o, a = mc("free verse: one stanza with no fixed rhyme scheme", ["a sonnet with a final couplet", "a ballad with regular rhyme", "a poem with four equal stanzas"])
q.append(Q(2, U, "structure_and_form", "poem_form", ["identify_poem_structure"],
           "How is 'Hard to find' written?", o, a, "multiple_choice", 3, 2,
           "- Look at the line lengths and the end words.\n- There is no pattern of rhyme.", None, "P: printed layout of the poem."))
o, a = mc("The speaker feels shut out from life, watching it through a barrier.", ["The speaker is happily walking in the rain.", "The speaker is repairing a window.", "The speaker is calling for help from a roof."])
q.append(Q(3, U, "imagery", "window_and_rain_imagery", ["explain_imagery"],
           "What does the image of the speaker looking 'through the glass windows' suggest?", o, a, "multiple_choice", 3, 3,
           "- Glass lets you see but not touch.\n- The mood is sad.", None, "P: lines 10–13 (interpretive — verify)."))
mm, a = order5(["Words are everywhere", "Words fly out when we are provoked", "Words hide when the heart feels", "The speaker hopes words will understand her heart"], [2, 0, 3, 1])
q.append(Q(4, U, "structure_and_form", "progression_of_ideas", ["order_events"],
           "Arrange these ideas from the poem in the order in which they appear.", mm, a, "ordering", 3, 3,
           "- The poem opens with a general statement.\n- The last idea is a hope.", None, "P: lines 1, 3–4, 7–9, 14–15."))
m, a = fitb("Surname:", "Jojo")
q.append(Q(5, U, "poetic_devices", "text_information", ["recall_key_events"],
           "Who wrote 'Hard to find'? Write the surname.", m, a, "fitb", 1, 1,
           "- The poet's name is printed under the title.\n- Write one word.", None, "P: Sinesipo Jojo."))
AI = [
 ("6.2.1", 3, ["Think about whether words literally have wings."], ["Decide literal or figurative", "Explain the meaning"], ["1. (a) Figuratively.", "2. (b) The words are uttered quickly without thought or consideration."]),
 ("6.2.2", 1, ["Think about the effect of being provoked."], ["Explain the phrase"], ["1. We are upset, angered or incited by someone or something."]),
 ("6.2.3", 2, ["Think about how someone sounds who cannot find words."], ["Name the tone", "Say why"], ["1. The tone is frustrated or despondent.", "2. She feels helpless, unable to find the words to express her feelings."]),
 ("6.2.4", 3, ["Words are given a human action."], ["Name the figure", "Explain it"], ["1. (a) Personification.", "2. (b) As a person does not want to be found, words too can be elusive."]),
 ("6.2.5", 2, ["Think about what the words do to people."], ["Give two points"], ["1. The words used are malicious or cruel.", "2. They cause pain or hurt."]),
 ("6.2.6", 1, ["Look at the repeated sound at the start of the words."], ["Identify the device"], ["1. 'Slowly slide' repeats 's': alliteration: B."]),
 ("6.2.7", 2, ["Think about what a cloudy lifetime suggests."], ["Name her state of mind", "Support it"], ["1. The speaker is depressed or sad as she experiences a turbulent time."]),
 ("6.2.8", 3, ["Decide if the title suits the poem, then use lines."], ["State your view", "Give evidence"],
  ["1. Yes: she struggles to find words for her innermost feelings and admits some things are hard to understand.", "2. No: the poem also says words are everywhere and fly out freely when we are angry."]),
]
lesson(12, "Question 6.2: 'Hard to Find'", HARD, 17, 2, 2, "Poem", 1, ["poetry_analysis", "poetic_devices", "imagery"],
       "'Hard to Find' by Sinesipo Jojo. 6.2.1–6.2.8, 17 marks.", q, AI)

emit(2024, PAPER, LS, "temp/images/fal24-p2")
