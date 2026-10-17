#!/usr/bin/env python3
"""Afrikaans FAL Nov 2025 Paper 2 — Section A novels (lessons 1-8). Writes scripts/add-afrikaans-fal-2025-nov-p2-q<N>.js.
Pattern per exam question (two extracts = two lessons, DESIGN-UNI-17 skill inventory split across both):
  Part 1 lesson: fill-in fact (fitb) · tone (MC) · inner conflict (MC) · match persons/deeds (match) · identify (MC)
  Part 2 lesson: stylistic device (MC) · meaning in context (MC) · order of events (ordering) · false statement (MC) · themes (multi_select)
Targets are fresh (SETWORK-LES-05): lines of the extract the exam did not ask about, or facts from the other half; no memo answer is reused as an item.
Facts come only from the extract/poem tabs, the exam paper and the memo (P/M/X); nothing from book knowledge."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from afr_common import *  # noqa

PAPER = "nov_p2"
LS = []
NOV_TAGS = ["character_analysis", "contextual_questions", "literary_analysis"]


def part1(order, text_key, name, header, marks, qn, mn, stem, qs, ai):
    LS.append(dict(order=order, name=name, header=header, marks=marks, q=qn, m=mn, supp=[(stem[0], 1, stem[1])],
                   text_key=text_key, tags=NOV_TAGS, questions=qs, ai=ai))


# ═══════════════ Vraag 1: Kringe in 'n Bos — Dalene Matthee ═══════════════
K = "kringe_in_n_bos"
q = []
m, a = fitb("Van:", "Barkley")
q.append(Q(1, "roman", "intrige_en_gebeure", "feit_uit_die_roman", ["voltooi_feit_uit_teks"],
           "Aan wie het Saul sy goud verkoop? Skryf net die van.", m, a, "fitb", 2, 3,
           "- Dink aan wat Saul gedoen het nadat hy die goud uitgewas het.\n- Skryf een woord.", None, "X: Q1.11 (other half), fresh angle"))
o, a = mc("onvriendelik", ["vriendelik", "opgewonde", "bang"])
q.append(Q(2, "roman", "toon_en_stylmiddele", "toon_van_'n_aanhaling", ["bepaal_toon"],
           "Watter woord beskryf die toon van oom Wiljam se woorde: \"As jy kom spaai het of ek tande onder die hout het, kan jy maar omdraai!\"?",
           o, a, "multiple_choice", 2, 2,
           "- Let op hoe die uittreksel sê dat hy dit gesê het.\n- Dink aan hoe 'n mens sou praat as jy iemand nie welkom wil laat voel nie.", None, "P: Teks A l.17-18 (stuurs)"))
o, a = mc("Hy wil graag glo dat die goud bestaan, maar vrees wat dit aan die Bos sal doen.",
          ["Hy is kwaad vir Kate omdat sy weer 'n storie vir hom vertel het.", "Hy wil dadelik vir sy pa gaan vertel dat hy goud gaan soek.", "Hy voel niks, want hy dink dit is net weer 'n bosstorie."])
q.append(Q(3, "roman", "karakter_en_verhoudings", "innerlike_konflik", ["verklaar_innerlike_konflik"],
           "Waarom ervaar Saul innerlike konflik as hy dink: \"Maar die hoop het skielik soos vrees in hom gelê\"?", o, a, "multiple_choice", 3, 3,
           "- Innerlike konflik is 'n stryd tussen twee gevoelens in dieselfde mens.\n- Watter twee gevoelens bots hier?", None, "P: Teks A l.11-12"))
m, a = match([("Kate", "vertel vir Saul die nuus oor die goud"), ("Oom Wiljam", "bring die eerste hout van die week met sy wa"), ("Saul", "werk by MacDonald nadat hy en sy pa baklei het")])
q.append(Q(4, "roman", "karakter_en_verhoudings", "wie_doen_wat", ["pas_gebeure_by_persone"],
           "Pas elke persoon by wat hy of sy in die roman doen.", m, a, "match", 2, 2,
           "- Dink aan wie die nuus bring en wie die hout bring.\n- Begin met die een wat jy die mees seker is van.", None, "P: Teks A + exam 1.1/1.2 facts"))
o, a = mc("Mense voel dikwels bang as nuus alles kan verander wat hulle ken.",
          ["Almal hou daarvan as hulle lewe skielik heeltemal verander.", "Jy hoef nooit oor groot nuus bekommerd of bang te wees nie.", "Nuus is altyd net 'n storie wat iemand sommer opmaak om te pla."])
q.append(Q(5, "roman", "karakter_en_verhoudings", "identifiseer_met_karakter", ["identifiseer_met_karakter"],
           "Saul bly onseker wanneer hy die gerugte oor goud hoor. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
           o, a, "multiple_choice", 2, 2, "- Dink aan 'n keer toe slegte of groot nuus jou bang gemaak het.\n- 'n Goeie motivering gee 'n rede.", None, "L: identify with character (mirror 1.9)"))
AI = [
 A("1.1", 4, "Lees die paragraaf en dink aan die gebeure waaroor dit gaan.|Elke blanko vra een woord uit die roman.", "Soek elke gebeurtenis in die roman|Skryf net die woord of woorde",
   "1.1.1: twee.", "1.1.2: Osborne.", "1.1.3: Knysna.", "1.1.4: apteek (apotheek)."),
 A("1.2", 1, "Dink aan Saul se verhouding met sy pa.", "Soek een rede|Skryf dit in 'n volsin",
   "1. Saul en sy pa het baklei en Saul wou nie langer hout kap en 'n pad loop wat nêrens uitkom nie.", "2. MacDonald het vir hom werk, 'n blyplek en kos aangebied."),
 A("1.3", 1, "Wat weet Kate werklik van die Bos?", "Dink aan hoe Kate die Bos beleef|Gee een rede",
   "1. Kate het die Bos nie regtig geken nie en het net stories gehoor of opgemaak wat vir haar mooi was."),
 A("1.4.1", 1, "Lees die aanhaling weer: waaroor is Saul bang?", "Kies die opsie tussen hakies wat by die aanhaling pas", "1. oor wat dit aan die Bos sou doen."),
 A("1.4.2", 1, "Dink aan wat Saul se grootste bekommernis is.", "Gee 'n rede wat by jou antwoord op 1.4.1 pas",
   "1. Saul wou die Bos altyd beskerm en was bang die gerugte oor goud sou mense lok wat olifante, bloubokkies en bome sou uitroei."),
 A("1.5.1", 1, "Wie wil in die uittreksel vinnig geld maak?", "Let op wie met \"hulle\" bedoel word", "1. Almal wat goud wou uithaal of ryk wou word, soos die houtkappers."),
 A("1.5.2", 1, "Wat sal mense doen as daar geld te maak is?", "Verduidelik die aanhaling in jou eie woorde", "1. Mense sal enigiets doen, selfs met kaal hande grawe, om geld te maak."),
 A("1.6", 1, "Kate klink onrustig in die reëls.", "Toets elke opsie by Kate se woorde", "1. C (onseker)."),
 A("1.7", 2, "Dink aan wat Kate vir Saul beteken het.", "Soek twee voordele|Skryf kort volsinne",
   "1. Saul kon op Kate verlief raak of Engels leer lees en praat.", "2. Hy kon Sondae iemand hê om mee te praat of by Kate boeke kry."),
 A("1.8", 4, "Pas elke gebeurtenis by die gevolg wat in die roman volg.", "Dink aan wat in die roman gebeur het|Pas een vir een",
   "1.8.1: C (Kate is met die Venice na die Kaap gestuur).", "1.8.2: A (Saul kon leer hoe om meubels te maak).", "1.8.3: D (Saul kon die nuus oor Joram se dood kry).", "1.8.4: B (Saul het Kate na 'n lang tyd weer gesien)."),
 A("1.9", 1, "Dink aan 'n keer toe mense verkeerde dinge oor jou gesê het.", "Gee 'n eie ervaring of gevoel|Verduidelik jou rede",
   "1. Byvoorbeeld: dit maak ook seer as mense onwaarhede van jou sê of jou onregverdig behandel."),
]
part1(1, K, "Vraag 1: Kringe in 'n Bos (1.1–1.9)", "Vraag 1.1–1.9: Kringe in 'n Bos — Teks A", 18, 3, 2, ("Teks A", "annexure_teks_a"), q, AI)

q = []
o, a = mc("personifikasie", ["vergelyking", "hiperbool", "klanknabootsing"])
q.append(Q(1, "roman", "toon_en_stylmiddele", "identifiseer_stylfiguur", ["identifiseer_stylfiguur"],
           "Watter stylfiguur kom voor in: \"Die vuur het lui gebrand\"?", o, a, "multiple_choice", 2, 3,
           "- 'n Vuur kan nie werklik lui wees nie.\n- Wat word aan die vuur gegee wat net mense het?", None, "P: Teks B l.13 (device question, not the exam's line)"))
o, a = mc("Dit het geen nut om te probeer nie, want niemand sal luister nie.",
          ["Hy wil na die maan toe gaan en vir altyd daar gaan bly.", "Hy moet die maan se baan deeglik bestudeer voordat hy kan skree.", "Dit is 'n baie goeie plan wat hy so gou moontlik moet uitvoer."])
q.append(Q(2, "roman", "toon_en_stylmiddele", "betekenis_van_'n_aanhaling", ["verklaar_betekenis_in_konteks"],
           "Wat beteken: \"Dis net so goed jy skree vir die maan\"?", o, a, "multiple_choice", 2, 3,
           "- Dink aan wat die maan sal doen as jy op hom skree.\n- Die woorde is figuurlik bedoel.", None, "P: Teks B l.8-9"))
items = ["Hy gooi hout op die kole.", "Hy sien sy kos is op.", "Hy wonder of hulle hom sal glo as hy die goud wys.", "Hy dink aan die kinders en aan Izak."]
m, a = order5(items, [2, 0, 3, 1])
q.append(Q(3, "roman", "intrige_en_gebeure", "volgorde_in_die_uittreksel", ["rangskik_gebeure"],
           "Rangskik die gebeure in die volgorde waarin dit in die uittreksel voorkom.", m, a, "ordering", 2, 2,
           "- Volg die uittreksel reël vir reël.\n- Wat doen Saul met die vuur voordat hy begin dink?", None, "P: Teks B l.1-13"))
o, a = mc("Saul se kos was nog nie op nie.",
          ["Saul het onder 'n krans geskuil.", "Saul het aan die kinders en aan Izak gedink.", "Saul wou die vreemde delwers uit die Bos jaag."])
q.append(Q(4, "roman", "intrige_en_gebeure", "onwaar_stelling", ["onderskei_waar_van_onwaar"],
           "Watter stelling oor die uittreksel is ONWAAR?", o, a, "multiple_choice", 2, 2,
           "- Toets elke stelling teen die uittreksel.\n- Net een stelling stem nie met die teks ooreen nie.", None, "P: Teks B"))
o, a = ms(["Die beskerming van die Bos en die natuur", "Die swaarkry van die houtkappers"],
          ["Die voordele van moderne tegnologie", "Sportprestasies by die skool"])
q.append(Q(5, "roman", "tema_en_boodskap", "temas_in_die_uittreksel", ["identifiseer_temas"],
           "Kies TWEE temas wat in die uittreksel na vore kom.", o, a, "multi_select", 2, 3,
           "- Waaroor dink Saul die meeste in die uittreksel?\n- Twee van die opsies kom in die uittreksel voor.", None, "P: Teks B"))
AI = [
 A("1.10", 4, "Dink aan die volgorde waarin Saul se ervarings in die roman plaasvind.", "Rangskik die vier gebeure|Gee elkeen op sy regte plek",
   "1. Saul se ma en suster is oorlede aan die godsiekte.", "2. Saul het Oupoot vir die eerste keer gesien.", "3. Saul het ontdek dat die bloubokkie se gal nie in sy kop sit nie.", "4. Saul het besef dat die dorp nie in die Bos is nie."),
 A("1.11", 1, "Aan wie het Saul sy goud verkoop?", "Gee 'n feit uit die roman wat die stelling weerlê", "1. Saul het sy goud aan Barkley verkoop; hy sou nooit besigheid met MacDonald doen nie."),
 A("1.12", 1, "Dink aan wat Saul by die rivier gesien het.", "Soek wat hy die oggend gesien het", "1. Hy het drie delwers gesien, van wie twee gedelf het terwyl een wag gehou het."),
 A("1.13", 1, "Waarom moet die Bos \"sy wonde gesond kry\"?", "Toets elke opsie|Kies die een wat by die konteks pas", "1. B (die Bos is vernietig en moes kans kry om te herstel)."),
 A("1.14.1", 1, "Waarom dink Saul dat die Engelse reg kan wees?", "Kies die opsie tussen hakies wat by die aanhaling pas", "1. die Bosmense gestereotipeer het omdat die meeste nie kon lees en skryf nie."),
 A("1.14.2", 1, "Wat was die verskil tussen die Engelse en die Bosmense?", "Gee een rede wat binne die roman geloofwaardig is", "1. Die meeste Engelse kon lees en skryf, daar was klasseverskille en die houtkopers het die Bosmense verneuk."),
 A("1.15.1", 1, "Let op die woord \"soos\".", "Kies tussen vergelyking en metafoor", "1. vergelyking."),
 A("1.15.2", 1, "Wat beteken die vetgedrukte woorde?", "Verduidelik in jou eie woorde", "1. Swaarkry was so deel van hulle lewe soos asemhaal; hulle het gedink dit is normaal."),
 A("1.16", 1, "Dink aan hoe Saul oor sy familie voel.", "Gee 'n rede waarom jy goed voel", "1. Saul het nie van sy familie vergeet nie en was steeds bekommerd oor Jozef se kinders."),
 A("1.17", 1, "Wat het Saul se besluit om goud te delf vir hom moontlik gemaak?", "Soek die direkte gevolg", "1. Saul het geld gehad om sy familie te help en kon eiendom bekostig."),
 A("1.18", 2, "Dink aan wat Kate gedoen het omdat sy self besluit het wat reg is.", "Soek twee positiewe gevolge vir Kate", "1. Kate kon 'n bydrae maak tot die opvoeding van arm kinders.", "2. Sy kon teen haar pa se geldmag opstaan of die skewe sirkel verbreek."),
 A("1.19", 1, "Let op die vrae wat Saul vra.", "Verduidelik hoe die skrywer jou bekommerd laat voel", "1. Saul vra baie retoriese vrae en klink wrewelrig oor die houtkappers."),
 A("1.20", 1, "Wat gebeur met die skewe sirkel aan die einde?", "Verduidelik hoekom die tema pas", "1. Saul het bewys dat jy die skewe sirkel kan verbreek en sy vergifnis het dit vir sy familie gebreek."),
]
part1(2, K, "Vraag 1: Kringe in 'n Bos (1.10–1.20)", "Vraag 1.10–1.20: Kringe in 'n Bos — Teks B", 17, 2, 3, ("Teks B", "annexure_teks_b"), q, AI)

# ═══════════════ Vraag 2: Die Ongelooflike Avonture van Hanna Hoekom — Marita van der Vyver ═══════════════
H = "die_ongelooflike_avonture_van_hanna_hoekom"
q = []
m, a = fitb("Naam:", "Ditjie")
q.append(Q(1, "roman", "intrige_en_gebeure", "feit_uit_die_roman", ["voltooi_feit_uit_teks"],
           "Watter naam het Mana vir die nuwe baba gegee? Skryf net die naam.", m, a, "fitb", 2, 3,
           "- Die naam het iets met water te doen gehad.\n- Skryf een woord.", None, "X: Q2.13 (other half), fresh angle"))
o, a = mc("vermaaklik", ["kwaad", "hartseer", "bang"])
q.append(Q(2, "roman", "toon_en_stylmiddele", "toon_van_'n_aanhaling", ["bepaal_toon"],
           "Watter woord beskryf Sharon se toon in: \"Wel, ek sal haar nou nie as 'n deftige dame beskryf nie\"?", o, a, "multiple_choice", 2, 2,
           "- Let op wat die uittreksel sê Sharon met haar kop doen terwyl sy dit sê.\n- Sy probeer nie lag nie.", None, "P: Teks C l.13-14"))
o, a = mc("Sy kritiseer Margot se voorkoms, maar besef sy word self ook so beoordeel.",
          ["Sy wil graag soos Margot lyk en probeer dit voor Sharon verberg.", "Sy wil Sharon se vriendskap beëindig omdat Sharon haar reghelp.", "Sy besef Margot is glad nie die persoon waarvan sy gehoor het nie."])
q.append(Q(3, "roman", "karakter_en_verhoudings", "innerlike_konflik", ["verklaar_innerlike_konflik"],
           "Waarom ervaar Hanna innerlike konflik as sy dink: \"As Sharon my moes oordeel aan hoe ek lyk ... sou ons seker nooit maats geword het nie\"?", o, a,
           "multiple_choice", 3, 3, "- Hanna oordeel Margot oor haar voorkoms.\n- Wat besef sy oor haarself?", None, "P: Teks C l.16-17"))
m, a = match([("Mana", "gee geboorte aan Hanna se sussie"), ("Margot", "staan Mana by tydens die geboorte"), ("Sharon", "is Hanna se ware vriendin")])
q.append(Q(4, "roman", "karakter_en_verhoudings", "wie_doen_wat", ["pas_gebeure_by_persone"],
           "Pas elke persoon by haar rol in die roman.", m, a, "match", 2, 2,
           "- Dink aan wie op die berg die baba gebore laat word het en wie gehelp het.\n- Begin met die een wat jy die mees seker is van.", None, "X: Q2.2/2.7/2.12 facts"))
o, a = mc("Mense vorm soms 'n mening oor iemand voordat hulle haar werklik ken.",
          ["Jy leer iemand beter ken deur net na haar kleredrag te kyk.", "Mense verander nooit hulle mening oor ander nie.", "Dit is altyd beter om niks oor ander te dink nie."])
q.append(Q(5, "roman", "karakter_en_verhoudings", "identifiseer_met_karakter", ["identifiseer_met_karakter"],
           "Hanna is negatief teenoor Margot voordat sy haar ontmoet het. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
           o, a, "multiple_choice", 2, 2, "- Dink aan 'n keer toe jy iemand beoordeel het voordat jy haar geken het.\n- Gee 'n rede, nie net 'n gevoel nie.", None, "L: identify (mirror 2.2.2)"))
AI = [
 A("2.1", 4, "Lees die paragraaf en dink aan Hanna se lewe.|Elke blanko vra een woord uit die roman.", "Soek elke gebeurtenis in die roman|Skryf net die woord",
   "2.1.1: hoekom (hoetom).", "2.1.2: Tibo.", "2.1.3: ingewikkelde (komplekse, aangelapte).", "2.1.4: Bitterberg."),
 A("2.2.1", 1, "Wat het Hanna van Margot gehoor?", "Kies die opsie tussen hakies wat by die uittreksel pas", "1. was bevooroordeeld omdat sy dinge van Margot gehoor het."),
 A("2.2.2", 1, "Het Hanna Margot reeds ontmoet?", "Gee een rede binne die konteks van die roman", "1. Hanna het by Beyers gehoor Margot is gemaksugtig en het haar kinders agtergelaat, nog voordat sy haar ontmoet het."),
 A("2.3", 1, "Hoe het Hanna gevoel toe Sharon so laat kom?", "Soek een rede", "1. Hanna was jaloers op Sharon en Margot se kuier en het gevoel Sharon moes saam met haar kamer toe gegaan het."),
 A("2.4", 1, "Dink aan die reën en die pad na die berg.", "Soek wat Amos bekommer het", "1. Hy was bekommerd dat Margot nie in die reën sou uitkom nie of sou verdwaal."),
 A("2.5.1", 1, "Waarom kritiseer Hanna haar ma?", "Kies die opsie tussen hakies", "1. is vreemd en dink anders oor dinge."),
 A("2.5.2", 1, "Gee 'n voorbeeld van hoe Hanna se ma anders is.", "Motiveer jou antwoord op 2.5.1", "1. Haar ma het met verfkwaste in haar hare rondgeloop en was 'n eksentrieke kunstenaar."),
 A("2.6", 1, "Let op die woorde \"goedkoop\" en \"vals\".", "Toets elke opsie", "1. C (negatief)."),
 A("2.7", 2, "Dink aan wat Hanna op die berg oor haar gesin geleer het.", "Soek twee positiewe voorbeelde", "1. Hanna kon Yann beter verstaan of die baba se geboorte saam met die gesin beleef.", "2. Sy het Gavin leer ken en waardeer of haar verjaarsdag saam met die gesin geniet."),
 A("2.8", 1, "Wat het Sharon vir Hanna gewys?", "Gee een rede", "1. Dat daar twee kante aan 'n saak is en dat Hanna nie so maklik moet oordeel nie."),
 A("2.9", 4, "Pas elke gebeurtenis by die gevolg.", "Dink aan wat Gavin op die berg gedoen het",
   "2.9.1: B (Gavin het klere aangetrek wat hom soos 'n bosbouer laat lyk).", "2.9.2: C (Gavin het 'n diskodans op die tafel gedoen).", "2.9.3: A (Gavin het almal laat lag en van die reën laat vergeet).", "2.9.4: E (Gavin het geleer dat mense se behoeftes verskil)."),
]
part1(3, H, "Vraag 2: Hanna Hoekom (2.1–2.9)", "Vraag 2.1–2.9: Die Ongelooflike Avonture van Hanna Hoekom — Teks C", 18, 3, 3, ("Teks C", "annexure_teks_c"), q, AI)

q = []
o, a = mc("metafoor", ["klanknabootsing", "personifikasie", "ironie"])
q.append(Q(1, "roman", "toon_en_stylmiddele", "identifiseer_stylfiguur", ["identifiseer_stylfiguur"],
           "Watter stylfiguur kom voor in: \"Iets wat my binnegoed laat saamtrek in 'n knoop\"?", o, a, "multiple_choice", 3, 3,
           "- Hanna se gevoel word as 'n ding beskryf.\n- Daar is nie 'n woord soos \"soos\" of \"nes\" nie.", None, "P: Teks D l.14-16"))
o, a = mc("Hanna se ma het vir 'n oomblik vergeet dat Hanna in die kamer is.",
          ["Hanna se ma het nie gesien dat Hanna in die kamer was nie.", "Hanna het die kamer verlaat sonder dat haar ma dit gemerk het.", "Hanna se ma was kwaad omdat Hanna teen die muur gestaan het."])
q.append(Q(2, "roman", "toon_en_stylmiddele", "betekenis_van_'n_aanhaling", ["verklaar_betekenis_in_konteks"],
           "Wat beteken: \"asof sy nou eers besef dat ek ook in die kamer is\"?", o, a, "multiple_choice", 2, 2,
           "- Hanna staan steeds verstar teen die muur.\n- Wie het eers net op die baba gefokus?", None, "P: Teks D l.7-8"))
items = ["Mana bedank Margot.", "Mana vra wat Hanna van haar sussie sê.", "Hanna fluister dat sy nie wil hê haar sussie moet seerkry nie.", "Mana sê die baba moet 'n naam met water in kry."]
m, a = order5(items, [3, 1, 0, 2])
q.append(Q(3, "roman", "intrige_en_gebeure", "volgorde_in_die_uittreksel", ["rangskik_gebeure"],
           "Rangskik die gebeure in die volgorde waarin dit in die uittreksel voorkom.", m, a, "ordering", 2, 2,
           "- Volg die gesprek reël vir reël.\n- Die naam word die volgende oggend bespreek.", None, "P: Teks D l.3-17"))
o, a = mc("Hanna het Margot gehelp om die naelstring te sny.",
          ["Mana het Margot bedank vir haar hulp.", "Hanna het gefluister dat sy nie wil hê haar sussie moet seerkry nie.", "Mana wou die baba 'n naam gee wat met water te doen het."])
q.append(Q(4, "roman", "intrige_en_gebeure", "onwaar_stelling", ["onderskei_waar_van_onwaar"],
           "Watter stelling oor die uittreksel is ONWAAR?", o, a, "multiple_choice", 2, 2,
           "- Wat doen Hanna toe Margot die groot skêr optel?\n- Toets elke stelling teen die uittreksel.", None, "P: Teks D l.10-17"))
o, a = ms(["Die waarde van gesinsondersteuning in 'n krisis", "Hoe 'n nuwe baba mense nader aan mekaar bring"],
          ["Hoe gevaarlik berge vir toeriste en ander besoekers is", "Die voordele van duur motors vir mense wat gaan reis"])
q.append(Q(5, "roman", "tema_en_boodskap", "temas_in_die_uittreksel", ["identifiseer_temas"],
           "Kies TWEE temas wat in die uittreksel na vore kom.", o, a, "multi_select", 2, 3,
           "- Kyk na hoe almal na die baba se geboorte reageer.\n- Twee opsies pas by die uittreksel.", None, "P: Teks D"))
AI = [
 A("2.10", 4, "Dink aan die volgorde waarin die gebeure op die berg plaasvind.", "Rangskik die vier gebeure", "1. Hanna het na Pampoen en Patat gaan soek.", "2. Sharon se pa het haar met 'n nuwe 4x4 kom aflaai.", "3. Tibo en Amos het Hanna se gedig gelees.", "4. Margot het Hanna mooigemaak vir haar verjaarsdag."),
 A("2.11.1", 1, "Let op die woord \"soos\".", "Kies die stylfiguur", "1. 'n vergelyking."),
 A("2.11.2", 1, "Hoe voel almal oor die baba se geboorte?", "Verduidelik die vergelyking", "1. Hulle was baie bly en opgewonde dat alles goed afgeloop het; dit was vir hulle 'n oorwinning."),
 A("2.12.1", 1, "Waarna verwys \"die ding\"?", "Soek wat Margot deurgepraat het", "1. Die baba se geboorte (die geboorteproses)."),
 A("2.12.2", 1, "Wat het Margot vir Mana gedoen?", "Gee een rede wat geloofwaardig is", "1. Margot het Mana bygestaan tydens die geboorte terwyl die ander bang was."),
 A("2.13", 1, "Dink aan die baba se naam en waarom dit gekies is.", "Soek die naam of rede", "1. Mana het die baba Ditjie genoem; hulle wou 'n naam met water in hê."),
 A("2.14", 1, "Hoe voel Hanna oor haar sussie?", "Kies die opsie wat by die uittreksel pas", "1. C (sy het dadelik lief geraak vir haar sussie)."),
 A("2.15", 1, "Wat doen Hanna toe sy haar sussie sien?", "Verduidelik hoe die skrywer jou opgewonde laat voel", "1. Hanna kon nie ophou kyk nie en wou nie hê haar sussie moet ooit seerkry nie."),
 A("2.16", 1, "Hoe voel die gesin om Mana se bed?", "Gee 'n rede waarom jy goed voel", "1. Die familie is saam en almal ondersteun mekaar; 'n nuwe lewe bring hoop."),
 A("2.17", 1, "Dink aan 'n krisis in jou eie lewe.", "Verduidelik waarom jy kan identifiseer", "1. Almal het soms hulp nodig en 'n krisis bring mense nader aan mekaar."),
 A("2.18", 1, "Wat gebeur tussen Gavin en Hanna na die geboorte?", "Soek die direkte gevolg", "1. Hulle kon gesels oor haar geboorte en Hanna het gehoor Gavin wou haar Fabienne noem."),
 A("2.19", 2, "Dink aan wat Margot op die berg gedoen en geleer het.", "Soek twee positiewe gevolge", "1. Margot kon by haar seuns wees en haar verhouding met Yann verbeter.", "2. Sy kon bewys dat sy van hulp kan wees of betyds in Johannesburg wees vir haar rol."),
 A("2.20", 1, "Wat besluit Hanna aan die einde van die roman?", "Verduidelik hoekom die tema pas", "1. Hanna het besef sy het Fabienne nie nodig nie en besluit om haar boek oor haar werklike lewe te skryf."),
]
part1(4, H, "Vraag 2: Hanna Hoekom (2.10–2.20)", "Vraag 2.10–2.20: Die Ongelooflike Avonture van Hanna Hoekom — Teks D", 17, 2, 3, ("Teks D", "annexure_teks_d"), q, AI)

# ═══════════════ Vraag 3: Meeulanders — Esta Steyn ═══════════════
M = "meeulanders"
q = []
m, a = fitb("Woord:", "kusvoëls")
q.append(Q(1, "roman", "intrige_en_gebeure", "feit_uit_die_roman", ["voltooi_feit_uit_teks"],
           "Waaroor het Ryna se boek gehandel wat bekendgestel is? Skryf net een woord.", m, a, "fitb", 2, 3,
           "- Dink aan die diere naby Salamanderbaai.\n- Skryf een woord.", None, "X: Q3.11 (other half), fresh angle"))
o, a = mc("geskok", ["vrolik", "spottend", "onverskillig"])
q.append(Q(2, "roman", "toon_en_stylmiddele", "toon_van_'n_aanhaling", ["bepaal_toon"],
           "Watter woord beskryf Jacob se toon in: \"My God, Ryna. Hoekom het jy nie lankal gepraat nie?\"?", o, a, "multiple_choice", 2, 2,
           "- Let op hoe die uittreksel Jacob se stilte beskryf voordat hy praat.\n- Hy het Ryna se storie net gehoor.", None, "P: Teks E l.13-14"))
o, a = mc("Sy het die trauma weggebêre, maar die vuur het dit weer opgeroep.",
          ["Sy wil graag oor die verlede praat, maar Jacob wil nie luister nie.", "Sy is bly dat die vuur weg is en wil dadelik kuier.", "Sy het vergeet wat in die verlede gebeur het."])
q.append(Q(3, "roman", "karakter_en_verhoudings", "innerlike_konflik", ["verklaar_innerlike_konflik"],
           "Waarom ervaar Ryna innerlike konflik as sy sê: \"Ek wou nie daaroor praat nie. Ek wil ook nooit weer daaroor praat nie\"?", o, a,
           "multiple_choice", 3, 3, "- Ryna het so pas vir Jacob haar verlede vertel.\n- Wat het die vuur by haar laat gebeur?", None, "P: Teks E l.16-17"))
m, a = match([("Ryna", "het 'n boek oor kusvoëls geskryf"), ("Attie", "het in Windhoek gaan werk"), ("Jacob", "het Meeuland toe gevlug")])
q.append(Q(4, "roman", "karakter_en_verhoudings", "wie_doen_wat", ["pas_gebeure_by_persone"],
           "Pas elke persoon by wat hy of sy in die roman doen.", m, a, "match", 2, 2,
           "- Dink aan wie skryf, wie werk en wie vlug.\n- Begin met die een wat jy die mees seker is van.", None, "X: Q3.7/3.11 facts"))
o, a = mc("Mense wat 'n trauma beleef het, wil dit dikwels nie weer oproep nie.",
          ["Almal praat graag onmiddellik oor hulle seerste ervarings.", "Jy kan nooit iemand verstaan wat 'n trauma beleef het nie.", "Mense wat vroeër seergekry het, voel nooit weer bang nie."])
q.append(Q(5, "roman", "karakter_en_verhoudings", "identifiseer_met_karakter", ["identifiseer_met_karakter"],
           "Ryna wil nie oor haar verlede praat nie. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
           o, a, "multiple_choice", 2, 2, "- Dink aan hoe mense na 'n baie seer ervaring voel.\n- 'n Goeie motivering gee 'n rede.", None, "L: identify (mirror 3.9)"))
AI = [
 A("3.1", 4, "Lees die paragraaf en dink aan Ryna se nuwe lewe.", "Soek elke woord in die roman", "3.1.1: Kaapstad.", "3.1.2: Februarie.", "3.1.3: Mama-Meeu.", "3.1.4: trommeltjie."),
 A("3.2", 1, "Hoe praat Jacob met Ryna na die vuur?", "Toets elke opsie by Jacob se woorde", "1. C (rustig)."),
 A("3.3.1", 1, "Hoekom is Ryna in konflik met haarself?", "Kies die opsie tussen hakies", "1. die vuur het haar aan dinge laat dink wat sy liewer wou vergeet."),
 A("3.3.2", 1, "Wat het die vuur by haar opgeroep?", "Motiveer jou antwoord op 3.3.1", "1. Die vuur het die trauma oor Vincent en Ronnie se dood laat terugkom en die wonde van die verlede oopgemaak."),
 A("3.4", 1, "Hoe goed ken Attie vir Ryna?", "Gee een rede", "1. Jacob het gedink Ryna het alles met Attie gedeel en Attie was haar vertroueling."),
 A("3.5", 1, "Wat het Ryna die aand voor die brand vir Jacob en Janka gedoen?", "Soek wat sy gemaak het", "1. Hulle het by Ryna gaan eet; sy het smoorsnoek gemaak."),
 A("3.6", 1, "Wat het met Ryna gebeur na die dood van Vincent en Ronnie?", "Soek die direkte gevolg", "1. Ryna is vir trauma-behandeling in 'n kliniek opgeneem."),
 A("3.7", 4, "Pas elke gebeurtenis by die gevolg.", "Dink aan wat uit elke gebeurtenis gevolg het", "3.7.1: D.", "3.7.2: A.", "3.7.3: B.", "3.7.4: E."),
 A("3.8", 1, "Hoe tree Jacob hier teenoor Ryna op?", "Verduidelik hoekom dit jou goed laat voel", "1. Jacob het gewys dat hy simpatie het en gehelp het toe Ryna hom nodig gehad het."),
 A("3.9", 1, "Let op wat Ryna se liggaam en stem doen.", "Soek een aanduiding van haar skok", "1. Haar liggaam het geruk, sy het op 'n klein hopie gaan sit en haar stem was doods."),
 A("3.10", 2, "Dink aan wat die huis vir Ryna beteken het.", "Soek twee positiewe voorbeelde", "1. Ryna kon haar eie plekkie inrig soos sy wou.", "2. Sy kon 'n tuiste vir Janka skep of uiteindelik met Jacob oor haar verlede praat."),
]
part1(5, M, "Vraag 3: Meeulanders (3.1–3.10)", "Vraag 3.1–3.10: Meeulanders — Teks E", 18, 2, 3, ("Teks E", "annexure_teks_e"), q, AI)

q = []
o, a = mc("hiperbool", ["vergelyking", "personifikasie", "ironie"])
q.append(Q(1, "roman", "toon_en_stylmiddele", "identifiseer_stylfiguur", ["identifiseer_stylfiguur"],
           "Watter stylfiguur kom voor in: \"My aarde, man, waar in die wêreld is jy?\"?", o, a, "multiple_choice", 2, 3,
           "- Die woorde oordryf hoe ver Ryna weg was.\n- Dit is 'n uitroep, nie 'n letterlike vraag nie.", None, "P: Teks F l.5-6"))
o, a = mc("Sy voel dat hy haar noukeurig dophou.",
          ["Sy voel dat hy haar wil laat bly.", "Sy voel dat hy haar nie wil sien nie.", "Sy voel dat hy haar tee wil laat drink."])
q.append(Q(2, "roman", "toon_en_stylmiddele", "betekenis_van_'n_aanhaling", ["verklaar_betekenis_in_konteks"],
           "Wat beteken: \"Sy voel dat hy haar dophou\"?", o, a, "multiple_choice", 2, 2,
           "- Wat doen jy met jou oë as jy iemand dophou?\n- Die woorde staan na die tee gekom het.", None, "P: Teks F l.8"))
items = ["Henning bestel tee vir twee.", "Ryna sê sy hou skool op Salamanderbaai.", "Ryna vra of die naam Schalk Blanckenberg bekend klink.", "Henning sê die naam lui geen klokkie nie."]
m, a = order5(items, [3, 0, 2, 1])
q.append(Q(3, "roman", "intrige_en_gebeure", "volgorde_in_die_uittreksel", ["rangskik_gebeure"],
           "Rangskik die gebeure in die volgorde waarin dit in die uittreksel voorkom.", m, a, "ordering", 2, 2,
           "- Volg die gesprek tussen Ryna en Henning reël vir reël.\n- Hulle drink tee voor Ryna die naam noem.", None, "P: Teks F l.4-22"))
o, a = mc("Henning het die naam Schalk Blanckenberg dadelik herken.",
          ["Ryna het vir Henning gesê dat sy skool op Salamanderbaai hou.", "Henning het by sy kantoor tee vir hulle albei bestel.", "Ryna het Henning gevra om haar met 'n saak te help."])
q.append(Q(4, "roman", "intrige_en_gebeure", "onwaar_stelling", ["onderskei_waar_van_onwaar"],
           "Watter stelling oor die uittreksel is ONWAAR?", o, a, "multiple_choice", 2, 2,
           "- Wat sê Henning toe hy die naam hoor?\n- Toets elke stelling teen die uittreksel.", None, "P: Teks F"))
o, a = ms(["Die soeke na die waarheid oor 'n misdaad", "Die gevolge van geheime uit die verlede"],
          ["Die voordele van onderwys op die platteland", "Hoe om 'n boek te skryf"])
q.append(Q(5, "roman", "tema_en_boodskap", "temas_in_die_uittreksel", ["identifiseer_temas"],
           "Kies TWEE temas wat in die uittreksel na vore kom.", o, a, "multi_select", 2, 3,
           "- Waarvoor gaan Ryna na Henning se kantoor?\n- Twee opsies pas by die uittreksel.", None, "P: Teks F"))
AI = [
 A("3.11", 4, "Dink aan die volgorde van die gebeure in die roman.", "Rangskik die vier gebeure", "1. Ryna se boek oor kusvoëls is bekendgestel.", "2. Attie het in Windhoek gaan werk.", "3. Jacob het Skalla doodgesteek.", "4. Ryna het vir Fred vertel dat Janka sy kind is."),
 A("3.12.1", 1, "Let op die woord \"soos\".", "Kies tussen hiperbool en vergelyking", "1. vergelyking."),
 A("3.12.2", 1, "Wat beteken dit as iemand soos 'n speld verdwyn?", "Verduidelik die vetgedrukte woorde", "1. Niemand het geweet waar sy was nie; sy het net verdwyn."),
 A("3.13", 1, "Wat sê Henning se woorde oor sy geheue?", "Toets elke opsie", "1. B (hy kon glad nie die naam onthou nie)."),
 A("3.14.1", 1, "Hoe het Henning vir Ryna geken?", "Soek na wie \"Camilla\" verwys", "1. Na Ryna (van Rensburg)."),
 A("3.14.2", 1, "Wat het Henning nie geweet nie?", "Verduidelik die aanhaling", "1. Henning het haar net as Camilla geken en het nie geweet sy is nou Ryna nie."),
 A("3.15", 1, "Wat het Skalla op sy arm gehad?", "Gee 'n feit wat die stelling weerlê", "1. Skalla het 'n tatoeëermerk van 'n slang (of 'n anker met 'n slang) op sy arm gehad."),
 A("3.16.1", 1, "Wat dink Ryna oor wat Henning weet?", "Kies die opsie tussen hakies", "1. die aanname gemaak dat Henning weet."),
 A("3.16.2", 1, "Wat was Henning se rol in die saak?", "Gee een rede", "1. Henning en Vincent was vriende en Henning was die prokureur wat aan die saak gewerk het."),
 A("3.17", 1, "Wat sou Henning verloor as die waarheid uitkom?", "Gee een rede", "1. Henning was deel van die skelmstreke en sou sy werk en status verloor het."),
 A("3.18", 1, "Dink aan wat met Janka gebeur het.", "Verduidelik waarom jy kan identifiseer", "1. Ryna wou geregtigheid vir Janka en Jacob hê en keer dat Skalla nog mense seermaak."),
 A("3.19", 2, "Wat kon Fred erken?", "Soek twee positiewe gevolge", "1. Fred kon erken dat hy Jacob se lewe ontwrig het en 'n leuenaar was.", "2. Hy kon erken dat hy die vrouens in sy lewe sleg behandel het."),
 A("3.20", 1, "Wie word aan die einde soos familie vir mekaar?", "Verduidelik hoekom die tema pas", "1. Ryna het vir Jannerik blyplek gegee en kon met Doreen en Ousanna alles deel."),
]
part1(6, M, "Vraag 3: Meeulanders (3.11–3.20)", "Vraag 3.11–3.20: Meeulanders — Teks F", 17, 2, 2, ("Teks F", "annexure_teks_f"), q, AI)

# ═══════════════ Vraag 4: Lien se Lankstaanskoene — Derick van der Walt ═══════════════
L = "lien_se_lankstaanskoene"
q = []
m, a = fitb("Naam:", "Weird Maria")
q.append(Q(1, "roman", "intrige_en_gebeure", "feit_uit_die_roman", ["voltooi_feit_uit_teks"],
           "Watter rol speel Lien in die skooltoneelstuk? Skryf die naam van die rol.", m, a, "fitb", 2, 3,
           "- Die naam kom in die uittreksel voor.\n- Dit bestaan uit twee woorde.", None, "P: Teks G l.14-16"))
o, a = mc("dankbaar", ["bitter", "spottend", "verveeld"])
q.append(Q(2, "roman", "toon_en_stylmiddele", "toon_van_'n_aanhaling", ["bepaal_toon"],
           "Watter woord beskryf Lien se gevoel in: \"Wat sou hulle sonder tannie Bets gedoen het?\"?", o, a, "multiple_choice", 2, 2,
           "- Let op wat Lien in die glasbak sien.\n- Sy sê dit met 'n warm gevoel.", None, "P: Teks G l.5-6"))
o, a = mc("Sy voel ongemaklik by Miemie, maar is dankbaar vir die rit huis toe.",
          ["Sy is baie bang vir Miemie en wil nooit weer by haar saamry nie.", "Sy wil dadelik by Miemie en haar familie gaan woon.", "Sy is kwaad dat Miemie elke dag vir haar by die skool wag."])
q.append(Q(3, "roman", "karakter_en_verhoudings", "innerlike_konflik", ["verklaar_innerlike_konflik"],
           "Waarom ervaar Lien innerlike konflik as sy saam met Miemie ry (reël 1 en 2)?", o, a, "multiple_choice", 3, 3,
           "- Die uittreksel sê sy ry \"gewoonlik ongemaklik, maar dikwels dankbaar\".\n- Watter twee gevoelens bots hier?", None, "P: Teks G l.1-2"))
m, a = match([("Lien", "speel Weird Maria in die toneelstuk"), ("Tannie Bets", "sorg dat daar kos in die kombuis is"), ("Juffrou Breytenbach", "wil hê hulle moet Saterdae ook repeteer")])
q.append(Q(4, "roman", "karakter_en_verhoudings", "wie_doen_wat", ["pas_gebeure_by_persone"],
           "Pas elke persoon by wat hy of sy in die uittreksel doen.", m, a, "match", 2, 2,
           "- Dink aan wie die toneelstuk reël en wie vetkoeke gebring het.\n- Begin met die een wat jy die mees seker is van.", None, "P: Teks G"))
o, a = mc("Mense is trots as hulle hard werk en 'n doel bereik.",
          ["Mense is trots as iemand anders hulle werk doen.", "Trots beteken jy hoef nie meer te werk nie.", "Geld maak mense altyd ongelukkig."])
q.append(Q(5, "roman", "karakter_en_verhoudings", "identifiseer_met_karakter", ["identifiseer_met_karakter"],
           "Lien tel haar geld en voel dis haar beste middag nog. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
           o, a, "multiple_choice", 2, 2, "- Dink aan 'n keer toe jy iets bereik het waarvoor jy hard gewerk het.\n- Gee 'n rede.", None, "L: identify (mirror 4.5)"))
AI = [
 A("4.1", 4, "Lees die paragraaf en dink aan Lien se besige dae.", "Soek elke woord in die roman", "4.1.1: twaalf.", "4.1.2: (straat)hoek.", "4.1.3: toneelopvoering (skoolkonsert).", "4.1.4: Miemie (Spies)."),
 A("4.2", 1, "Wat het by die pawiljoen gebeur?", "Soek een gebeurtenis", "1. Lien het met Hein gesels of geluister hoe hy mondfluitjie speel."),
 A("4.3.1", 1, "Is die berg vetkoeke letterlik 'n berg?", "Kies die stylfiguur", "1. hiperbool."),
 A("4.3.2", 1, "Wat wil die woorde sê oor die hoeveelheid vetkoeke?", "Verduidelik die vetgedrukte woorde", "1. Daar was baie vetkoeke, genoeg vir Lien-hulle om te eet."),
 A("4.4", 1, "Waarvoor spaar Lien haar geld?", "Soek een rede", "1. Lien wou oorsee gaan of 'n vliegtuigkaartjie koop."),
 A("4.5", 1, "Hoe voel Lien oor haar ma se toe deur?", "Verduidelik waarom jy kan identifiseer", "1. Dis nie lekker om 'n ma te sien as sy dronk is nie en 'n mens wil soms rus."),
 A("4.6", 1, "Wat beteken \"kop uittrek\"?", "Toets elke opsie", "1. A (soms wil sy nie langer deel van die toneel wees nie)."),
 A("4.7", 1, "Wat het tannie Bets vir Lien gedoen?", "Gee 'n rede waarom jy goed voel", "1. Lien was nog 'n kind en tannie Bets het gesorg dat daar kos is en 'n ogie oor haar gehou."),
 A("4.8", 2, "Dink aan wat die toneelstuk vir Lien beteken het.", "Soek twee positiewe voorbeelde", "1. Lien het Miemie en Hein beter leer ken.", "2. Sy kon haar ware talent uitleef en haar omstandighede vir 'n rukkie vergeet."),
 A("4.9", 1, "Hoe lyk die woonstel as Lien daar aankom?", "Soek een aanduiding van eensaamheid", "1. Die woonstel is donker, Braam slaap al en sy eet alleen."),
 A("4.10", 4, "Pas elke gebeurtenis by die gevolg.", "Dink aan wat daaruit gevolg het", "4.10.1: E.", "4.10.2: C.", "4.10.3: A.", "4.10.4: B."),
]
part1(7, L, "Vraag 4: Lien se Lankstaanskoene (4.1–4.10)", "Vraag 4.1–4.10: Lien se Lankstaanskoene — Teks G", 18, 2, 3, ("Teks G", "annexure_teks_g"), q, AI)

q = []
o, a = mc("vergelyking", ["klanknabootsing", "personifikasie", "ironie"])
q.append(Q(1, "roman", "toon_en_stylmiddele", "identifiseer_stylfiguur", ["identifiseer_stylfiguur"],
           "Watter stylfiguur kom voor in: \"asof sy pas van Mars geland het\"?", o, a, "multiple_choice", 2, 3,
           "- Let op die woord \"asof\".\n- Twee dinge word met mekaar vergelyk.", None, "P: Teks H l.10"))
o, a = mc("Hy wil nie sinlose praatjies hoor nie en wil kortliks weet wat sy wil hê.",
          ["Hy het baie tyd en wil graag lank en gemaklik met haar gesels.", "Hy wil graag 'n lang storie oor haar vakansie en familie hoor.", "Hy is baie jammer vir haar en wil haar dadelik met geld help."])
q.append(Q(2, "roman", "toon_en_stylmiddele", "betekenis_van_'n_aanhaling", ["verklaar_betekenis_in_konteks"],
           "Wat beteken: \"Dié man het nie tyd vir warra-warra nie\"?", o, a, "multiple_choice", 2, 2,
           "- Dink aan hoe die man op sy horlosie kyk.\n- Lien besef sy moet gou praat.", None, "P: Teks H l.5-6"))
items = ["Lien sê Tibbey wil weer daar kom bly en werk.", "Lien sê Tibbey se bene is af.", "Lien sê hulle gaan vir hom 'n fluitjie koop.", "Die man sê dis nie die Welsyn dié nie."]
m, a = order5(items, [2, 0, 3, 1])
q.append(Q(3, "roman", "intrige_en_gebeure", "volgorde_in_die_uittreksel", ["rangskik_gebeure"],
           "Rangskik die gebeure in die volgorde waarin dit in die uittreksel voorkom.", m, a, "ordering", 2, 2,
           "- Volg die gesprek reël vir reël.\n- Die man se laaste sin kom heel aan die einde.", None, "P: Teks H l.1-16"))
o, a = mc("Tibbey sal in die week op dieselfde plek werk.",
          ["Tibbey sal die karre naweke oppas.", "Tibbey het net 'n dak oor sy kop nodig.", "Hulle gaan vir Tibbey 'n fluitjie koop."])
q.append(Q(4, "roman", "intrige_en_gebeure", "onwaar_stelling", ["onderskei_waar_van_onwaar"],
           "Watter stelling oor die uittreksel is ONWAAR?", o, a, "multiple_choice", 2, 2,
           "- Wat sê Lien oor waar Tibbey in die week werk?\n- Toets elke stelling teen die uittreksel.", None, "P: Teks H l.7-9"))
o, a = ms(["Vriendskap en omgee vir iemand in nood", "Om vir ander op te staan"],
          ["Die voordele van duur motors", "Hoe om 'n toneelstuk te skryf"])
q.append(Q(5, "roman", "tema_en_boodskap", "temas_in_die_uittreksel", ["identifiseer_temas"],
           "Kies TWEE temas wat in die uittreksel na vore kom.", o, a, "multi_select", 2, 3,
           "- Waarom gaan Lien met die man praat?\n- Twee opsies pas by die uittreksel.", None, "P: Teks H"))
AI = [
 A("4.11", 4, "Dink aan die volgorde van die gebeure in die roman.", "Rangskik die vier gebeure", "1. Lien het die jong dominee vir die eerste keer ontmoet.", "2. Lien het haar verjaardag saam met vriende geniet.", "3. Sproet het Lien na sy woonstel geneem.", "4. Dirkie het gebel om uit te vind in watter hospitaal Tibbey was."),
 A("4.12.1", 1, "Vir wie praat Lien?", "Soek na wie \"hy\" verwys", "1. Na Tibbey."),
 A("4.12.2", 1, "Wat het met Tibbey gebeur?", "Verduidelik die aanhaling", "1. Tibbey het sy bene verloor na 'n ongeluk en kan nie meer loop nie."),
 A("4.13", 1, "Let op hoe die man oor die rystoel praat.", "Toets elke opsie", "1. C (sarkasties)."),
 A("4.14", 1, "Wie het Lien met die karretjie gehelp?", "Gee 'n feit wat die stelling weerlê", "1. Hein het Lien gehelp om die karretjie te bou."),
 A("4.15.1", 1, "Hoe voel Meneer Van Biljon?", "Kies die opsie tussen hakies", "1. weet nie wat die regte ding is om te doen nie."),
 A("4.15.2", 1, "Wat bekommer hom?", "Motiveer jou antwoord", "1. Hy voel jammer vir Tibbey, maar is bang Tibbey kan nie die werk doen nie."),
 A("4.16.1", 1, "Wat probeer Lien doen?", "Kies die opsie tussen hakies", "1. oorreed om Tibbey se situasie en goeie kwaliteite te verstaan."),
 A("4.16.2", 1, "Hoe goed ken Lien vir Tibbey?", "Gee een rede", "1. Lien ken Tibbey en weet hy sal die beste van die kans maak."),
 A("4.17", 1, "Wat het die samewerking vir Lien en Hein se verhouding beteken?", "Soek die direkte gevolg", "1. Daar was 'n meer vaste verhouding en hulle het goeie vriende geword."),
 A("4.18", 1, "Wat het Roos met Johnny se hoek gedoen?", "Gee een rede", "1. Tibbey sou nie gou weer terugkom nie en Roos was bevooroordeel omdat Johnny drink."),
 A("4.19", 2, "Dink aan wat Tibbey se vriende vir hom gedoen het.", "Soek twee positiewe gevolge", "1. Danksy die karretjie kon hy weer sy werk doen.", "2. Sy vriende se ondersteuning het gekeer dat hy in depressie verval."),
 A("4.20", 1, "Waarop fokus Lien aan die einde?", "Verduidelik hoekom die tema pas", "1. Lien besluit om haar passie te volg en haar ma en pa te vergewe."),
]
part1(8, L, "Vraag 4: Lien se Lankstaanskoene (4.11–4.20)", "Vraag 4.11–4.20: Lien se Lankstaanskoene — Teks H", 17, 2, 3, ("Teks H", "annexure_teks_h"), q, AI)

if __name__ == "__main__":
    emit(2025, PAPER, LS)
