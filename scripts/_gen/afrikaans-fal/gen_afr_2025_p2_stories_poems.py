#!/usr/bin/env python3
"""Afrikaans FAL Nov 2025 Paper 2 — Section C short stories (lessons 15-18) and Section D poems (lessons 19-22).
Each story/poem is split in two lessons along the exam's own sub-question ranges (DESIGN-UNI-17: about nine distinct skills per item).
Facts come only from the extract/poem tabs, the exam paper and the memo."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from afr_common import *  # noqa

PAPER = "nov_p2"
LS = []
STORY_TAGS = ["narrative_structure", "character_analysis", "theme_identification"]
POEM_TAGS = ["poetry_analysis", "poetic_devices", "tone_and_mood"]


def lesson(order, text_key, name, header, marks, qn, mn, stem, qs, ai, tags, sfx=None):
    d = dict(order=order, name=name, header=header, marks=marks, q=qn, m=mn, supp=[(stem[0], stem[2] if len(stem) > 2 else 1, stem[1])],
             text_key=text_key, tags=tags, questions=qs, ai=ai)
    if sfx:
        d["sfx"] = sfx
    LS.append(d)


def fact(order, unit, topic, prompt, ans, label, basis, clue, weight=3, sub="feit_uit_die_teks"):
    m, a = fitb(label, ans)
    return Q(order, unit, topic, sub, ["voltooi_feit_uit_teks"], prompt, m, a, "fitb", 2, weight, clue, None, basis)


# ═══════════════ Vraag 8.1: "Kom ons stuur vir Tasu" — Maretha Maartens ═══════════════
T = "kom_ons_stuur_vir_tasu"
q = []
q.append(fact(1, "kortverhale", "intrige_en_gebeure", "Hoeveel botteltjies vol tieroogklippe het Tasu gehad? Skryf net die getal.", "57", "Getal:", "P: Teks O l.7",
              "- Die getal kom in die woorde \"sewe-en-vyftig\" voor.\n- Skryf die syfers."))
o, a = ms(["Geld by iemand leen", "Eiers verkoop"], ["'n Ander taxi bel", "Ouma se kruie verkoop"])
q.append(Q(2, "kortverhale", "intrige_en_gebeure", "voorstelle_in_die_uittreksel", ["onderskei_waar_van_onwaar"],
           "Kies TWEE maniere waarop Tasu eerste voorstel dat hulle aan die sestig rand kan kom.", o, a, "multi_select", 2, 2,
           "- Tasu vra eers of hulle nie iewers kan kry nie.\n- Ma sê hulle eet self die eiers.", None, "P: Teks O l.1-6"))
o, a = mc("Hy het baie hard gewerk om die botteltjies vol te maak.",
          ["Hy wil al sy klippe vir Sterkman gaan gee.", "Hy dink die klippe is glad nie die moeite werd nie.", "Hy het vergeet waar hy die botteltjies gebêre het."])
q.append(Q(3, "kortverhale", "karakter_en_verhoudings", "motief_van_karakter", ["verklaar_karakter_se_keuse"],
           "Waarom wil Tasu sy tieroogklippe in die begin nie verkoop nie?", o, a, "multiple_choice", 2, 2,
           "- Dink aan wat Tasu en Sterkman gedoen het om die klippe te slyp.\n- Tasu dink: \"Ek het te hard gewerk\".", None, "P: Teks O l.7-11"))
o, a = mc("beslis", ["twyfelend", "spottend", "vrolik"])
q.append(Q(4, "kortverhale", "toon_en_stylmiddele", "toon_van_'n_aanhaling", ["bepaal_toon"],
           "Watter woord beskryf die toon van Ma se woorde: \"Ek leen by niemand geld nie\"?", o, a, "multiple_choice", 2, 2,
           "- Die uittreksel sê Ma se kop ruk.\n- Sy bly by haar besluit.", None, "P: Teks O l.4"))
o, a = mc("Hy wil sy tieroë hou, maar sy liefde vir Ouma wen.",
          ["Hy wil sy tieroë verkoop, maar Ma laat hom nie.", "Hy wil by die petrolpomp gaan werk, maar Ma verbied dit.", "Hy wil sy ouma se geld hê, maar skaam hom daaroor."])
q.append(Q(5, "kortverhale", "karakter_en_verhoudings", "innerlike_konflik", ["verklaar_innerlike_konflik"],
           "Waarom kan 'n mens sê Tasu ervaar innerlike konflik as sy mond \"die dinge wat sy hart nie wil sê nie\" sê?", o, a, "multiple_choice", 3, 3,
           "- Sy hart en sy mond sê verskillende dinge.\n- Wie is hy baie lief vir?", None, "P: Teks O l.12-15"))
AI = [
 A("8.1.1", 4, "Lees die paragraaf en dink aan Tasu se familie.", "Soek elke woord in die kortverhaal", "(a) Griekwastad.", "(b) gehuil.", "(c) (kruie)medisyne.", "(d) Jollyman."),
 A("8.1.2", 1, "Waarmee was Sterkman besig?", "Gee een rede", "1. Sterkman was besig met sy matriekeksamen en moes leer."),
 A("8.1.3", 1, "Let op hoe Tasu se ma praat.", "Toets elke opsie by haar woorde", "1. A (ernstig)."),
 A("8.1.4", 1, "Wat het Sterkman vir Tasu gesê voordat hy weg is?", "Soek wat hy gesê het", "1. Tasu moenie sy babagesig opsit nie; hy moenie wys dat hy bang is nie."),
 A("8.1.5(a)", 1, "Waaraan dink Tasu terwyl hy in die taxi ry?", "Kies die opsie tussen hakies", "1. hy het onthou van die slegte ervaring toe daar baie mense saam met hom was."),
 A("8.1.5(b)", 1, "Wat onthou Tasu?", "Motiveer jou antwoord op 8.1.5(a)", "1. Tasu onthou die taxi-ongeluk waarin baie mense seergekry het en iemand gesterf het."),
]
lesson(15, T, "Vraag 8.1: Kom ons stuur vir Tasu (8.1.1–8.1.5)", "Vraag 8.1.1–8.1.5: Kom ons stuur vir Tasu — Teks O", 9, 2, 1, ("Teks O", "annexure_teks_o_v2"), q, AI, STORY_TAGS, "v2_")

q = []
m, a = match([("Tasu", "bied aan om sy tieroë by die petrolpomp te verkoop"), ("Ma", "sê sy leen by niemand geld nie"), ("Sterkman", "het Tasu laat werk voordat hy sy slypsteen kon gebruik")])
q.append(Q(1, "kortverhale", "karakter_en_verhoudings", "wie_doen_wat", ["pas_gebeure_by_persone"],
           "Pas elke persoon by wat hy of sy in die uittreksel sê of doen.", m, a, "match", 2, 2,
           "- Dink aan wie die tieroë wil verkoop en wie nie wil leen nie.\n- Begin met die een wat jy die mees seker is van.", None, "P: Teks O"))
o, a = ms(["opofferend", "liefdevol"], ["gierig", "onverskillig"])
q.append(Q(2, "kortverhale", "karakter_en_verhoudings", "eienskappe_van_karakter", ["identifiseer_eienskappe"],
           "Kies TWEE eienskappe wat Tasu in die uittreksel toon.", o, a, "multi_select", 2, 2,
           "- Wat gee Tasu op, en vir wie?\n- Twee eienskappe pas by sy optrede.", None, "P: Teks O l.7-15"))
o, a = mc("Sy wil nie skuld maak nie en sorg dat die gesin kos het.",
          ["Sy wil net haar eie geld bêre en niks deel nie.", "Sy dink skuld maak is 'n manier om vinnig ryk te word.", "Sy wil die eiers verkoop sodat Tasu kan gaan werk."])
q.append(Q(3, "kortverhale", "karakter_en_verhoudings", "motief_van_karakter", ["verklaar_karakter_se_keuse"],
           "Waarom kan 'n mens sê Tasu se ma is 'n verantwoordelike mens?", o, a, "multiple_choice", 2, 2,
           "- Sy leen nie en verkoop nie die eiers nie.\n- Dink aan waarvoor die eiers gebruik word.", None, "P: Teks O l.1-6"))
o, a = mc("Mense gee soms iets kosbaars op om iemand lief te help.",
          ["Mense gee net iets op as hulle dit nie meer wil hê nie.", "Jy hoef nooit iets op te offer vir iemand anders nie.", "Kosbare besittings is altyd belangriker as jou familie."])
q.append(Q(4, "kortverhale", "karakter_en_verhoudings", "identifiseer_met_karakter", ["identifiseer_met_karakter"],
           "Tasu bied aan om sy tieroë te verkoop. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
           o, a, "multiple_choice", 2, 2, "- Dink aan 'n keer toe jy iets prysgegee het vir iemand wat jy liefhet.\n- Gee 'n rede.", None, "L: identify (mirror 8.1.9)"))
o, a = mc("Opoffering uit liefde vir familie.", ["Wraak teenoor iemand wat jou seergemaak het.", "Die voordele van 'n goeie opvoeding.", "Hoe om vinnig ryk te word."])
q.append(Q(5, "kortverhale", "tema_en_boodskap", "tema_van_die_kortverhaal", ["identifiseer_temas"],
           "Watter tema kom die sterkste in die uittreksel na vore?", o, a, "multiple_choice", 2, 3,
           "- Waarvoor is Tasu bereid om sy skatte op te gee?\n- Kyk na sy verhouding met sy ouma.", None, "P: Teks O"))
AI = [
 A("8.1.6", 4, "Pas elke gebeurtenis by die gevolg.", "Dink aan wat uit elke gebeurtenis gevolg het", "(a) D.", "(b) A.", "(c) E.", "(d) B."),
 A("8.1.7", 2, "Dink aan hoe Tasu sy verlede hanteer het.", "Soek twee positiewe gevolge", "1. Tasu het besluit sy verlede sal nie sy lewe bepaal nie.", "2. Hy het sy vrees oorkom om in 'n taxi vol mense te ry."),
 A("8.1.8", 1, "Wat wou Tasu se ma nie doen nie?", "Gee een rede", "1. Sy wou nie by mense geld leen nie en het nie die eiers verkoop nie, want dis die gesin se kos."),
 A("8.1.9", 1, "Wat het Tasu prysgegee?", "Verduidelik waarom jy kan identifiseer", "1. Ek het ook my droom prysgegee om vir my familie te help; familie is belangriker as drome."),
 A("8.1.10", 1, "Hoe het Tasu verander?", "Verduidelik hoekom die tema pas", "1. Tasu kon sy vrese oorwin en verantwoordelikheid namens sy gesin neem."),
]
lesson(16, T, "Vraag 8.1: Kom ons stuur vir Tasu (8.1.6–8.1.10)", "Vraag 8.1.6–8.1.10: Kom ons stuur vir Tasu — Teks O", 9, 2, 2, ("Teks O", "annexure_teks_o_v2"), q, AI, STORY_TAGS, "v2_")

# ═══════════════ Vraag 8.2: "Opdrag" — Rieke Olivier ═══════════════
O = "opdrag"
q = []
items = ["Sarah skryf dat sy sewentien is.", "Sy noem dat haar ouma op sestien getroud is.", "Sy sê sy is bang vir die seer van \"ghoebaai\".", "Sy skryf 'n aanbeveling vir die boek."]
m, a = order5(items, [3, 1, 0, 2])
q.append(Q(1, "kortverhale", "intrige_en_gebeure", "volgorde_in_die_uittreksel", ["rangskik_gebeure"],
           "Rangskik die dele in die volgorde waarin hulle in die uittreksel voorkom.", m, a, "ordering", 2, 2,
           "- Volg Sarah se brief van bo na onder.\n- Die aanbeveling kom aan die einde.", None, "P: Teks P"))
q.append(fact(2, "kortverhale", "intrige_en_gebeure", "Hoeveel kinders het Sarah se ouma later gehad? Skryf die getal in woorde.", "agt", "Getal:", "P: Teks P l.5",
              "- Die getal staan in woorde in die uittreksel.\n- Skryf een woord.", 2))
o, a = mc("Sy is bang dat sy en Gerrie eendag uit mekaar sal groei.",
          ["Sy is bang dat Gerrie haar vir iemand anders sal los.", "Sy is bang dat sy haar ouma se pad moet volg.", "Sy is bang dat die paaie na die skool te gevaarlik is."])
q.append(Q(3, "kortverhale", "toon_en_stylmiddele", "betekenis_van_'n_aanhaling", ["verklaar_betekenis_in_konteks"],
           "Wat beteken: \"Ek is bang dat jou en my paadjies anderdag nie meer sal saamloop nie\"?", o, a, "multiple_choice", 2, 2,
           "- Paadjies is hier figuurlik bedoel.\n- Sarah skryf aan Gerrie.", None, "P: Teks P l.8"))
o, a = mc("Sy het gaan leer.", ["Sy was sestien toe sy getroud is.", "Sy het later agt kinders gehad.", "Haar oupa was haar eerste kêrel."])
q.append(Q(4, "kortverhale", "intrige_en_gebeure", "onwaar_stelling", ["onderskei_waar_van_onwaar"],
           "Watter stelling oor Sarah se ouma is ONWAAR?", o, a, "multiple_choice", 2, 2,
           "- Wat sê die uittreksel oor leer en studeer?\n- Toets elke stelling teen die uittreksel.", None, "P: Teks P l.3-6"))
o, a = mc("Sarah beveel aan dat die boek vir voorligtingsklasse aangekoop word.",
          ["Sarah beveel aan dat die boek uit die biblioteek verwyder word.", "Sarah beveel aan dat die boek nie in die skool gelees word nie.", "Sarah beveel aan dat Gerrie die boek vir haar skryf."])
q.append(Q(5, "kortverhale", "tema_en_boodskap", "doel_van_die_aanbeveling", ["verklaar_betekenis_in_konteks"],
           "Wat word in die uittreksel onder AANBEVELING gesê?", o, a, "multiple_choice", 2, 2,
           "- Kyk wat Sarah onder die woord AANBEVELING skryf.\n- Dit gaan oor die biblioteek en voorligting.", None, "P: Teks P l.14-16"))
AI = [
 A("8.2.1", 4, "Dink aan die volgorde van Sarah se gedagtes.", "Rangskik die vier gebeure", "1. Jordaantjie het altyd gesorg vir iets wat anders is.", "2. Sarah het haar feite met E se situasie begin.", "3. Sarah het besef sy worstel eintlik met haar gevoelens vir Gerrie.", "4. Sarah het gehoop Jordaantjie sou tussen die reëls kon lees."),
 A("8.2.2(a)", 1, "Wat sê die ouma se verhaal oor vroue?", "Kies die opsie tussen hakies", "1. gestereotipeer is om jonk te trou en kinders te hê."),
 A("8.2.2(b)", 1, "Hoe oud was Sarah se ouma toe sy getroud is?", "Motiveer jou antwoord", "1. Vroeër is vroue op sestien getroud; as Ouma sestien was en Sarah is al sewentien, moes sy eintlik al getroud gewees het."),
 A("8.2.3", 1, "Wat sê die woorde oor verhoudings?", "Toets elke opsie", "1. C (jy moet nie dinge doen wat 'n verhouding benadeel nie)."),
 A("8.2.4", 1, "Wat het Sarah reeds gedoen?", "Gee 'n feit wat die stelling weerlê", "1. Sarah het tot 'n gevolgtrekking gekom en 'n aanbeveling gemaak."),
 A("8.2.5(a)", 1, "Waarna verwys P v W?", "Soek die titel van die boek", "1. Na die boek 'n Pot vol winter, wat Sarah vir haar boekverslag gekies het."),
 A("8.2.5(b)", 1, "Wat het Sarah uit die boek geleer?", "Gee een rede", "1. Sarah het haar eie idees gevorm en besluit dat dit nie deel van haar verhouding moet wees nie; sy het die boek vir voorligtingsklasse aanbeveel."),
]
lesson(17, O, "Vraag 8.2: Opdrag (8.2.1–8.2.5)", "Vraag 8.2.1–8.2.5: Opdrag — Teks P", 10, 1, 2, ("Teks P", "annexure_teks_p_v2"), q, AI, STORY_TAGS, "v2_")

q = []
o, a = mc("retoriese vraag", ["vergelyking", "personifikasie", "hiperbool"])
q.append(Q(1, "kortverhale", "toon_en_stylmiddele", "identifiseer_stylfiguur", ["identifiseer_stylfiguur"],
           "Watter stylfiguur kom voor in: \"Wat maak ek met hierdie verskriklike lief wees vir jou as ek my nie kan commit nie?\"?", o, a, "multiple_choice", 2, 3,
           "- Sarah verwag nie werklik 'n antwoord van Gerrie nie.\n- Dit is 'n vraag wat 'n punt maak.", None, "P: Teks P l.7-8"))
o, a = ms(["Liefde vir Gerrie", "Vrees dat hulle paadjies uit mekaar sal gaan"], ["Haat teenoor haar ouma", "Blydskap oor die boekverslag"])
q.append(Q(2, "kortverhale", "karakter_en_verhoudings", "gevoelens_van_karakter", ["identifiseer_eienskappe"],
           "Kies TWEE gevoelens wat Sarah in haar brief uitspreek.", o, a, "multi_select", 2, 2,
           "- Waaroor skryf Sarah in haar brief aan Gerrie?\n- Twee gevoelens pas by die brief.", None, "P: Teks P l.7-10"))
o, a = mc("Baie tieners voel onseker oor verhoudings en keuses.",
          ["Tieners voel nooit onseker oor verhoudings nie.", "Almal weet presies hoe om 'n verhouding te hanteer.", "Onsekerheid beteken dat 'n verhouding noodwendig verby is."])
q.append(Q(3, "kortverhale", "karakter_en_verhoudings", "identifiseer_met_karakter", ["identifiseer_met_karakter"],
           "Waarom kan baie tieners met Sarah se onsekerheid identifiseer?", o, a, "multiple_choice", 2, 2,
           "- Dink aan 'n keer toe jy onseker was oor 'n belangrike besluit.\n- Gee 'n rede.", None, "L: identify (mirror 8.2.10)"))
m, a = match([("Gerrie", "is die persoon aan wie Sarah skryf"), ("Ouma", "was sestien toe sy getroud is"), ("Sarah se ma", "vertel dat Oupa Ouma se eerste kêrel was")])
q.append(Q(4, "kortverhale", "karakter_en_verhoudings", "wie_doen_wat", ["pas_gebeure_by_persone"],
           "Pas elke persoon by wat in die uittreksel van hom of haar gesê word.", m, a, "match", 2, 2,
           "- Dink aan wie die brief ontvang en wie van Oupa vertel het.\n- Begin met die een wat jy die mees seker is van.", None, "P: Teks P"))
o, a = mc("Verantwoordelike keuses begin by nadink oor die gevolge.",
          ["Jy kan aan jou gevoelens toegee sonder om te dink.", "Daar is net een manier om 'n verhouding te hanteer.", "Jy moet altyd doen wat ander van jou verwag."])
q.append(Q(5, "kortverhale", "tema_en_boodskap", "lewensles", ["identifiseer_temas"],
           "Watter lewensles kan Sarah uit haar opdrag leer?", o, a, "multiple_choice", 2, 3,
           "- Sarah dink noukeurig oor haar besluit.\n- Watter les geld vir enige keuse wat 'n verhouding kan raak?", None, "P: Teks P + memo 8.2.9"))
AI = [
 A("8.2.6(a)", 1, "Let op die woord \"soos\".", "Kies tussen metafoor en vergelyking", "1. vergelyking."),
 A("8.2.6(b)", 1, "Wat beteken die vetgedrukte woorde letterlik en figuurlik?", "Verduidelik albei betekenisse", "1. Letterlik: haar aanbeveling is kort, duidelik en saaklik.", "2. Figuurlik: Sarah besluit om nie as tiener seksueel aktief te wees nie."),
 A("8.2.7", 1, "Wat was die direkte gevolg van die opdrag?", "Soek een gevolg", "1. Dit het Sarah onder druk geplaas om haar huiswerk te voltooi en sy het haar besluit geneem."),
 A("8.2.8", 1, "Wat wys die gesprek oor tieners?", "Verduidelik hoekom jy goed voel", "1. Dit wys tieners het emosionele begrip en 'n sin vir verantwoordelikheid."),
 A("8.2.9", 2, "Wat het Sarah uit die boek geleer?", "Soek twee positiewe gevolge", "1. Sarah het haarself beter leer ken.", "2. Sy het geleer om haar emosies te beheer en besef sy is verantwoordelik vir haar eie keuses."),
 A("8.2.10", 1, "Met wie kon Sarah praat?", "Verduidelik hoekom jy jammer voel", "1. Dit was 'n taboe-onderwerp en sy moes haar antwoorde uit 'n boek kry omdat sy niemand gehad het om mee te praat nie."),
]
lesson(18, O, "Vraag 8.2: Opdrag (8.2.6–8.2.10)", "Vraag 8.2.6–8.2.10: Opdrag — Teks P", 7, 2, 2, ("Teks P", "annexure_teks_p_v2"), q, AI, STORY_TAGS, "v2_")

# ═══════════════ Vraag 9.1: "Krisis" — Elizabeth Eybers ═══════════════
K = "krisis"
q = []
q.append(fact(1, "gedigte", "spreker_en_inhoud", "Wie word in die gedig \"Krisis\" aangespreek? Skryf een woord.", "Hart", "Woord:", "P: Krisis l.1",
              "- Die spreker praat met \"jy\".\n- Die naam staan in reël 1.", sub="aangesprokene"))
o, a = mc("ongeduldig", ["speels", "bang", "verward"])
q.append(Q(2, "gedigte", "toon_en_stemming", "toon_van_'n_reel", ["bepaal_toon"],
           "Watter woord beskryf die toon van die laaste twee reëls: \"Kyk, dit word laat, die kermis is verby, kan jy dit nie begryp? Hier moet ons skei.\"?",
           o, a, "multiple_choice", 2, 2, "- Die spreker vra of die Hart dit nie kan begryp nie.\n- Hy wil nie langer wag nie.", None, "P: Krisis l.13-14"))
o, a = ms(["seremoniemeester", "nar"], ["kok", "musikant"])
q.append(Q(3, "gedigte", "spreker_en_inhoud", "rolle_in_die_gedig", ["voltooi_feit_uit_teks"],
           "Kies TWEE rolle wat die Hart by die fees gespeel het.", o, a, "multi_select", 2, 2,
           "- Kyk na reël 9 en 10.\n- Twee rolle pas by die gedig.", None, "P: Krisis l.9-10"))
o, a = mc("Dit verwys na die verhouding van die Hoof en die Hart.",
          ["Dit verwys na 'n werklike pad in die veld naby die fees.", "Dit verwys na die Hart se pad terug na sy huis toe.", "Dit verwys na die pad wat na die kermis toe lei."])
q.append(Q(4, "gedigte", "beeldspraak_en_stylmiddele", "figuurlike_betekenis", ["verklaar_betekenis_in_konteks"],
           "In watter sin gebruik die digter \"weg\" in \"Die weg was lieflik waarlangs jy geleit het\"?", o, a, "multiple_choice", 2, 3,
           "- Die Hoof en die Hart stap nie werklik langs 'n pad nie.\n- Waarvoor staan die pad?", None, "P: Krisis l.3"))
AI = [
 A("9.1.1", 1, "Wie praat in die gedig?", "Soek wie die spreker is", "1. Die Hoof (die verstand of kop)."),
 A("9.1.2", 1, "Wat sê reël 2 oor die skeiding?", "Haal een woord uit strofe 1 aan", "1. \"onvoorbereid\"."),
 A("9.1.3", 2, "Hoe beskryf die Hoof die Hart?", "Gee twee redes", "1. Die Hart is voortvarend, 'n lafaard, besluiteloos of siek.", "2. Die Hart gee dwase raad en verwar net die Hoof."),
 A("9.1.4(a)", 1, "Waarna kyk die Hart terug?", "Kies tussen onthou en vergeet", "1. onthou."),
 A("9.1.4(b)", 1, "Hoe praat die Hoof met die Hart?", "Kies tussen rustig en ongeduldig", "1. ongeduldig."),
 A("9.1.5", 1, "Hoe stel die digter die Hoof en die Hart as mense voor?", "Soek die tegniek", "1. Personifikasie: hulle het hoofletters, word met \"ek\" en \"jy\" aangespreek en word as persone beskryf."),
 A("9.1.6", 1, "Wat het die Hart vir die Hoof gedoen?", "Verduidelik in jou eie woorde", "1. Die Hoof kon nie goeie besluite neem nie en was verward deur die Hart."),
]
lesson(19, K, "Vraag 9.1: Krisis (9.1.1–9.1.6)", "Vraag 9.1.1–9.1.6: Krisis — Elizabeth Eybers", 8, 1, 1, ("Poem", "annexure_poem"), q, AI, POEM_TAGS)

q = []
q.append(fact(1, "gedigte", "spreker_en_inhoud", "Noem EEN van die gevaarlike plekke langs die pad in reël 5. Skryf een woord.", "klowe|afgrond|moeras", "Woord:", "P: Krisis l.4-5",
              "- Die pad strek langs drie gevaarlike plekke.\n- Skryf een woord.", sub="feit_uit_die_gedig"))
o, a = mc("onbesonne en roekeloos", ["rustig en versigtig", "stadig en moeg", "bang en nederig"])
q.append(Q(2, "gedigte", "beeldspraak_en_stylmiddele", "betekenis_van_'n_woord", ["verklaar_betekenis_in_konteks"],
           "Wat beteken \"voortvarend\" in reël 6?", o, a, "multiple_choice", 2, 2,
           "- Die woord staan langs \"lafaard\" en \"nooit in staat tot enige besluit\".\n- Dink aan iemand wat sonder om te dink vooruit gaan.", None, "P: Krisis l.6"))
items = ["Die Hoof sê dis hier waar hulle skei.", "Die pad strek langs klowe, afgrond en moeras.", "Die Hart was die gas en gasheer by die fees.", "Die Hoof sê die kermis is verby."]
m, a = order5(items, [3, 1, 0, 2])
q.append(Q(3, "gedigte", "spreker_en_inhoud", "volgorde_in_die_gedig", ["rangskik_gebeure"],
           "Rangskik die dele in die volgorde waarin hulle in die gedig voorkom.", m, a, "ordering", 2, 2,
           "- Volg die gedig reël vir reël.\n- Die kermis kom in strofe 2 voor.", None, "P: Krisis l.1-13"))
o, a = mc("Dit bevestig die Hoof se besluit om te skei.", ["Dit wys dat die Hoof van plan verander het.", "Dit vra die Hart om te bly.", "Dit beskryf die begin van die fees."])
q.append(Q(4, "gedigte", "toon_en_stemming", "effek_van_die_slot", ["verklaar_betekenis_in_konteks"],
           "Wat is die effek van die laaste reël: \"Hier moet ons skei\"?", o, a, "multiple_choice", 2, 2,
           "- Die gedig begin ook met die skeiding.\n- Wat wys die herhaling oor die besluit?", None, "P: Krisis l.14"))
o, a = mc("Die stryd tussen verstand en emosie.", ["Die voordele van 'n fees.", "Die skoonheid van die natuur.", "Die gevare van die see."])
q.append(Q(5, "gedigte", "spreker_en_inhoud", "tema_van_die_gedig", ["identifiseer_temas"],
           "Watter tema kom in die gedig voor?", o, a, "multiple_choice", 2, 3,
           "- Wie praat met wie in die gedig?\n- Die Hoof en die Hart stry met mekaar.", None, "P: Krisis"))
AI = [
 A("9.1.7", 1, "Waarom stem die Hoof nie altyd met die Hart saam nie?", "Haal TWEE opeenvolgende woorde aan", "1. \"dwase raad\" of \"hoof verwar\"."),
 A("9.1.8", 1, "Wat beteken \"die kermis is verby\"?", "Toets elke opsie", "1. B (die spreker wil nie meer konflik hê nie)."),
 A("9.1.9", 4, "Volg die pad wat die Hoof en die Hart saam geloop het.", "Rangskik die vier gebeure", "1. Die pad wat die Hoof en die Hart saamgeloop het, was mooi.", "2. Die pad saam het sleg begin word.", "3. Die Hoof het die Hart nie meer nodig nie.", "4. Hulle het aan die einde van hulle pad saam gekom."),
 A("9.1.10", 1, "Waar begin en eindig die gedig?", "Verduidelik die effek van die herhaling", "1. Die herhaling bind die gedig tot 'n geheel en beklemtoon dat hulle moet skei."),
 A("9.1.11", 1, "Dink aan 'n keer toe jou kop en hart verskil het.", "Verduidelik hoe jy identifiseer", "1. My verstand baklei ook dikwels met my hart en dit is moeilik om die regte besluit te neem."),
 A("9.1.12", 1, "Waaroor gaan die gedig?", "Verduidelik hoekom die titel pas", "1. Die inhoud wys die krisis of stryd tussen die Hoof en die Hart."),
]
lesson(20, K, "Vraag 9.1: Krisis (9.1.7–9.1.12)", "Vraag 9.1.7–9.1.12: Krisis — Elizabeth Eybers", 9, 1, 2, ("Poem", "annexure_poem"), q, AI, POEM_TAGS)

# ═══════════════ Vraag 9.2: "Ken jy die see ..." — Uys Krige ═══════════════
S = "ken_jy_die_see"
q = []
q.append(fact(1, "gedigte", "spreker_en_inhoud", "Voltooi die refrein met een woord: \"Dan sê jy nog, Meneer, die vis is ...\"", "duur", "Woord:", "P: Ken jy die see l.5",
              "- Die refrein herhaal aan die einde van elke strofe.\n- Skryf een woord.", sub="refrein"))
o, a = mc("'n Meneer wat kla dat die vis duur is.", ["'n Visserman wat sy vangs verkoop.", "Mevrou Mathee wat oor die see tuur.", "Die see self."])
q.append(Q(2, "gedigte", "spreker_en_inhoud", "aangesprokene_in_die_gedig", ["voltooi_feit_uit_teks"],
           "Wie word in die gedig as \"Meneer\" aangespreek?", o, a, "multiple_choice", 2, 2,
           "- Die spreker sê aan die einde van elke strofe wat Meneer nog sê.\n- Dink aan wie die vis koop.", None, "P: Ken jy die see l.1 en refrein"))
o, a = mc("vergelyking", ["metafoor", "personifikasie", "klanknabootsing"])
q.append(Q(3, "gedigte", "beeldspraak_en_stylmiddele", "identifiseer_stylfiguur", ["identifiseer_stylfiguur"],
           "Watter stylfiguur kom voor in: \"Hy lyk nou soos jou voorstoep blinkgeskuur\"?", o, a, "multiple_choice", 2, 3,
           "- Let op die woord \"soos\".\n- Die see word met 'n voorstoep vergelyk.", None, "P: Ken jy die see l.2"))
o, a = ms(["Storms wat nooit ophou raas", "Golwe so hoog soos 'n tronk se muur"], ["Haaie wat die bootjies aanval", "Mis wat die hawe toemaak"])
q.append(Q(4, "gedigte", "spreker_en_inhoud", "gevare_van_die_see", ["voltooi_feit_uit_teks"],
           "Kies TWEE gevare van die see wat in die gedig genoem word.", o, a, "multi_select", 2, 2,
           "- Kyk in strofe 4 en 5 na wat die see doen.\n- Twee opsies kom in die gedig voor.", None, "P: Ken jy die see l.16-22"))
AI = [
 A("9.2.1", 4, "Lees die paragraaf en dink aan die vissermanne se lewe.", "Soek elke woord in die gedig", "(a) hulp (redmiddel, kuur).", "(b) pal.", "(c) bootjie(s).", "(d) duur."),
 A("9.2.2", 2, "Vergelyk hoe die see lyk met wat hy werklik is.", "Verduidelik die kontras in eie woorde", "1. Die see lyk rustig en kalm, maar is eintlik baie gevaarlik en bedrieglik."),
 A("9.2.3", 1, "Let op die rym.", "Gee een rede", "1. Die woord \"buur\" pas in by die kruisrym van die gedig en behou die ritme."),
 A("9.2.4", 1, "Wie praat in reël 23?", "Verduidelik die effek van direkte rede", "1. Dit maak die woorde persoonlik en betrek die vissermanne direk; dit beklemtoon dat die see lewens neem."),
]
lesson(21, S, "Vraag 9.2: Ken jy die see ... (9.2.1–9.2.4)", "Vraag 9.2.1–9.2.4: Ken jy die see ... — Uys Krige", 8, 1, 1, ("Poem", "annexure_poem", 2), q, AI, POEM_TAGS)

q = []
o, a = mc("Die verkleinwoord wys sy dink die wind is sag en onskadelik.",
          ["Die verkleinwoord wys dat die wind baie sterk waai.", "Die verkleinwoord wys dat die vissermanne bang is.", "Die verkleinwoord wys dat die see vandag glad nie visse het nie."])
q.append(Q(1, "gedigte", "beeldspraak_en_stylmiddele", "effek_van_die_verkleinwoord", ["verklaar_betekenis_in_konteks"],
           "Wat is die effek van die verkleinwoord \"briesie\" in: \"Sy dink dié briesie bring haar seuns betyds vir tee\"?", o, a, "multiple_choice", 3, 3,
           "- 'n Briesie is 'n klein, sagte wind.\n- Wat dink mevrou Mathee oor die wind?", None, "P: Ken jy die see l.38"))
m, a = match([("Die Dood staan voor die deur.", "personifikasie"), ("soos 'n veer gevee", "vergelyking"), ("die swart, swart wind", "herhaling")])
q.append(Q(2, "gedigte", "beeldspraak_en_stylmiddele", "identifiseer_stylfiguur", ["identifiseer_stylfiguur"],
           "Pas elke woordgroep by die stylfiguur wat dit is.", m, a, "match", 3, 3,
           "- Let op die woord \"soos\" en op woorde wat herhaal word.\n- Aan wie word 'n menslike handeling gegee?", None, "P: Ken jy die see l.11, 13, 21"))
o, a = mc("'n Ou vroutjie wie se drie seuns op see gesterf het.",
          ["'n Jong meisie wat elke dag op die kaai haar pa wag.", "'n Visserman wat sy bootjie en al sy vangs verloor het.", "Die eienaar van die visswinkel in die hawe by die dorp."])
q.append(Q(3, "gedigte", "spreker_en_inhoud", "karakter_in_die_gedig", ["voltooi_feit_uit_teks"],
           "Wie is mevrou Mathee in die gedig?", o, a, "multiple_choice", 2, 2,
           "- Kyk na reël 36 tot 39.\n- Wat sê reël 39 oor haar seuns?", None, "P: Ken jy die see l.36-39"))
items = ["Die spreker sê die see lyk kalm.", "Die wind word 'n bulderende wind.", "Die Dood staan voor die deur.", "Die spreker wys na mevrou Mathee."]
m, a = order5(items, [2, 3, 0, 1])
q.append(Q(4, "gedigte", "spreker_en_inhoud", "volgorde_in_die_gedig", ["rangskik_gebeure"],
           "Rangskik die dele in die volgorde waarin hulle in die gedig voorkom.", m, a, "ordering", 2, 2,
           "- Volg die gedig strofe vir strofe.\n- Mevrou Mathee kom in die laaste strofe.", None, "P: Ken jy die see l.3-36"))
o, a = mc("Die gevare van die see vir vissermanne.", ["Die voordele van goedkoop kos vir elke gesin.", "Die skoonheid van 'n kalm see en blink strand.", "Hoe om 'n bootjie sterk genoeg te bou."])
q.append(Q(5, "gedigte", "spreker_en_inhoud", "tema_van_die_gedig", ["identifiseer_temas"],
           "Watter tema kom in die gedig voor?", o, a, "multiple_choice", 2, 3,
           "- Waarom sê die spreker die vis is nie te duur nie?\n- Dink aan mevrou Mathee se seuns.", None, "P: Ken jy die see"))
AI = [
 A("9.2.5", 1, "Wat beteken \"misstappie\" met 'n verkleinwoord?", "Toets elke opsie", "1. D (die kleinste foutjie kan die vissermanne laat sterf)."),
 A("9.2.6", 3, "Hoe voel die spreker oor Meneer se klagte?", "Kies tussen elke opsie tussen hakies", "(a) ontevrede.", "(b) onregverdig.", "(c) beklemtoon."),
 A("9.2.7", 3, "Pas elke aanhaling by die stylfiguur.", "Let op klanke, mense en vergelykings", "(a) B (personifikasie).", "(b) A (alliterasie).", "(c) D ('n vergelyking)."),
 A("9.2.8", 1, "Wat leer jy by die meneer wat kla?", "Gee een les", "1. Ek moet die konteks van iets verstaan voordat ek kla; vissermanne doen gevaarlike werk."),
 A("9.2.9", 1, "Lees reël 37 en 38.", "Motiveer hoekom jy simpatie het", "1. Mevrou Mathee het haar seuns verloor en tuur nog met verlange oor die see."),
 A("9.2.10", 1, "Wat is die doel van die laaste strofe?", "Verduidelik waarom die storie 'n gepaste slot is", "1. Die vertelling van die gevare bereik 'n hoogtepunt met die dood van die Mathee-seuns en bevestig dat die see jou lewe kan neem."),
]
lesson(22, S, "Vraag 9.2: Ken jy die see ... (9.2.5–9.2.10)", "Vraag 9.2.5–9.2.10: Ken jy die see ... — Uys Krige", 10, 2, 2, ("Poem", "annexure_poem", 2), q, AI, POEM_TAGS)

if __name__ == "__main__":
    emit(2025, PAPER, LS)
