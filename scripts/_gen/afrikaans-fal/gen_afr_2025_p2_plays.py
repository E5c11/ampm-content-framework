#!/usr/bin/env python3
"""Afrikaans FAL Nov 2025 Paper 2 — Section B dramas (lessons 9-14). Same two-lesson pattern as the novels
(see gen_afr_2025_p2_novels.py): Part 1 = fill-in · tone · inner conflict · match · identify;
Part 2 = device/term · meaning · order · false statement · themes. Facts only from extract tabs, the exam paper and the memo."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from afr_common import *  # noqa

PAPER = "nov_p2"
LS = []
DRAMA_TAGS = ["dramatic_techniques", "character_analysis", "contextual_questions"]


def lesson(order, text_key, name, header, marks, qn, mn, stem, qs, ai):
    LS.append(dict(order=order, name=name, header=header, marks=marks, q=qn, m=mn, supp=[(stem[0], 1, stem[1])],
                   text_key=text_key, tags=DRAMA_TAGS, questions=qs, ai=ai))


def q_fact(prompt, ans, label, basis, clue, unit="drama", ctx=None, order=1, topic="intrige_en_gebeure", weight=3):
    m, a = fitb(label, ans)
    return Q(order, unit, topic, "feit_uit_die_drama", ["voltooi_feit_uit_teks"], prompt, m, a, "fitb", 2, weight, clue, ctx, basis)


# ═══════════════ Vraag 5: Poppie — Die Drama ═══════════════
P = "poppie_die_drama"
q = []
q.append(q_fact("Wat was Bonsile se Engelse naam? Skryf net die naam.", "Stanford", "Naam:", "P: Teks I l.11",
                "- Die naam kom in Plank se woorde voor.\n- Skryf een woord."))
o, a = mc("liefdevol", ["kwaad", "onverskillig", "bang"])
q.append(Q(2, "drama", "toon_en_stylmiddele", "toon_van_'n_aanhaling", ["bepaal_toon"],
           "Watter woord beskryf die toon in Poppie se woorde: \"My klonkie!\"?", o, a, "multiple_choice", 2, 2,
           "- Poppie sê dit wanneer sy by haar seun is.\n- Let op die uitroepteken en die woord \"my\".", None, "P: Teks I l.12-13"))
o, a = mc("Sy verlang na haar ma en wil haar kind by haar ma kry.",
          ["Sy wil by haar man bly, maar hy stuur haar weg.", "Sy is bly oor die swangerskap en wil dit vir niemand sê.", "Sy wil nie hê haar ma moet by die geboorte wees nie."])
q.append(Q(3, "drama", "karakter_en_verhoudings", "innerlike_konflik", ["verklaar_innerlike_konflik"],
           "Waarom ervaar Poppie innerlike konflik voor haar eerste kind se geboorte (reël 1 en 2)?", o, a, "multiple_choice", 3, 3,
           "- Poppie is getroud en het baie verlang.\n- Waarheen wil sy gaan as dit tyd word om haar kind te kry?", None, "P: Teks I l.1-3"))
m, a = match([("Tata-ka-Bonsile", "beteken pa van Bonsile"), ("Bonsile", "beteken ons het iets gewys, iets het reggekom"), ("My klonkie", "wat Poppie vir haar seun sê as sy alleen by hom is")])
q.append(Q(4, "drama", "karakter_en_verhoudings", "betekenis_van_name", ["pas_gebeure_by_persone"],
           "Pas elke naam of benaming by wat dit in die uittreksel beteken.", m, a, "match", 2, 2,
           "- Plank vertel wat die name beteken.\n- Begin met die een wat jy die mees seker is van.", None, "P: Teks I l.10-15"))
o, a = mc("Mense kan hartseer wees oor 'n verlies en tog hoop behou.",
          ["Hartseer beteken jy moet nooit weer hoop hê nie.", "Mense voel nie hartseer as hulle genoeg kinders het nie.", "Verliese maak dat jy die lewe haat."])
q.append(Q(5, "drama", "karakter_en_verhoudings", "identifiseer_met_karakter", ["identifiseer_met_karakter"],
           "Poppie verloor haar eerste kind, maar gee haar seun 'n positiewe naam. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
           o, a, "multiple_choice", 2, 2, "- Dink aan hoe mense na 'n verlies kan voortgaan.\n- Gee 'n rede.", None, "L: identify (mirror 5.8)"))
AI = [
 A("5.1", 4, "Lees die paragraaf en dink aan Poppie se familie.", "Soek elke woord in die drama", "5.1.1: Hannie.", "5.1.2: Upington.", "5.1.3: lorriedrywer.", "5.1.4: Rachel."),
 A("5.2", 1, "Hoe spreek Poppie haar man aan?", "Gee een rede", "1. Poppie het so respek teenoor Stone getoon; in haar kultuur het jy jou man so aangespreek."),
 A("5.3", 1, "Hoe het Stone se familie oor Poppie gevoel?", "Gee een rede", "1. Stone se familie het van Poppie gehou en haar deel van die familie gemaak."),
 A("5.4", 2, "Dink aan wat Poppie in Herschel geleer het.", "Soek twee voorbeelde", "1. Poppie het die vrou se rol as ma en vrou leer ken.", "2. Sy het geleer om suurpap te maak of die mielies fyn te maal."),
 A("5.5.1", 1, "Hoe voel Poppie oor die swangerskap?", "Kies die opsie tussen hakies", "1. was onseker of dit die regte tyd was om 'n kind te hê."),
 A("5.5.2", 1, "Wat sê haar omstandighede?", "Motiveer jou antwoord op 5.5.1", "1. Poppie was nog baie jonk, pas getroud en het nog nie haar eie huis gehad nie."),
 A("5.6", 1, "Let op die woorde \"Ek kan nie sê nie\".", "Toets elke opsie by Poppie se woorde", "1. B (onseker)."),
 A("5.7.1", 1, "Wie moet gaan waarnatoe hulle wil?", "Soek na wie \"ons\" verwys", "1. Die Xhosa-mense (Stone en sy gesin)."),
 A("5.7.2", 1, "Waarvandaan moes hulle weggaan?", "Verduidelik die aanhaling", "1. Hulle moes van Lambertsbaai af weggaan."),
 A("5.8", 1, "Hoe reageer Poppie op haar eerste kind se dood?", "Gee 'n rede waarom jy goed voel", "1. Poppie het nie negatief geraak nie en het haar seun steeds 'n positiewe naam gegee."),
 A("5.9", 4, "Pas elke gebeurtenis by die gevolg.", "Dink aan wat uit elke gebeurtenis gevolg het", "5.9.1: D.", "5.9.2: A.", "5.9.3: E.", "5.9.4: B."),
]
lesson(9, P, "Vraag 5: Poppie – Die Drama (5.1–5.9)", "Vraag 5.1–5.9: Poppie — Die Drama — Teks I", 18, 2, 2, ("Teks I", "annexure_teks_i"), q, AI)

q = []
o, a = mc("personifikasie", ["vergelyking", "hiperbool", "klanknabootsing"])
q.append(Q(1, "drama", "toon_en_stylmiddele", "identifiseer_stylfiguur", ["identifiseer_stylfiguur"],
           "Watter stylfiguur kom voor in: \"Kort daarna het moeilikheid by Poppie se deur kom aanklop\"?", o, a, "multiple_choice", 2, 3,
           "- Moeilikheid kan nie werklik aanklop nie.\n- Aan wat word 'n menslike handeling gegee?", None, "P: Teks J l.8"))
o, a = mc("Poppie het baie alleen gevoel en haar gesin gemis.",
          ["Poppie het gevoel sy het te veel mense om haar.", "Poppie het gevoel sy moet haar kinders straf.", "Poppie het gevoel sy het haar huis verloor."])
q.append(Q(2, "drama", "toon_en_stylmiddele", "betekenis_van_'n_aanhaling", ["verklaar_betekenis_in_konteks"],
           "Wat beteken: \"daar het hierdie tyd 'n groot eensaamheid en verlange in Poppie se hart gekom\"?", o, a, "multiple_choice", 2, 2,
           "- Dink aan hoe Poppie ver van haar gesin bly.\n- Wat voel 'n mens as jy iemand mis?", None, "P: Teks J l.17-18"))
items = ["Poppie praat met bitterheid dat almal huise het.", "Stone gaan na twee weke weer huis toe.", "Stone ontvang en lees Poppie se brief.", "Tata-ka-Bonsile stuur veertig rand."]
m, a = order5(items, [2, 3, 0, 1])
q.append(Q(3, "drama", "intrige_en_gebeure", "volgorde_in_die_uittreksel", ["rangskik_gebeure"],
           "Rangskik die gebeure in die volgorde waarin dit in die uittreksel voorkom.", m, a, "ordering", 2, 2,
           "- Volg die uittreksel van bo na onder.\n- Die geld word aan die einde genoem.", None, "P: Teks J"))
o, a = mc("Bonsile en die meisie was saam in st. 10.",
          ["Die meisie is 'n weeskind.", "Die mense het damage-geld gevra.", "Tata-ka-Bonsile het veertig rand gestuur."])
q.append(Q(4, "drama", "intrige_en_gebeure", "onwaar_stelling", ["onderskei_waar_van_onwaar"],
           "Watter stelling oor die uittreksel is ONWAAR?", o, a, "multiple_choice", 2, 2,
           "- In watter standerd was Bonsile en die meisie?\n- Toets elke stelling teen Stone se woorde.", None, "P: Teks J l.14-19"))
o, a = ms(["Eensaamheid en verlange na familie", "Ouers se verantwoordelikheid vir hulle kinders se dade"],
          ["Die voordele van sportdeelname vir jong mense by die skool", "Hoe om 'n huis te bou en dit mooi te versier"])
q.append(Q(5, "drama", "tema_en_boodskap", "temas_in_die_uittreksel", ["identifiseer_temas"],
           "Kies TWEE temas wat in die uittreksel na vore kom.", o, a, "multi_select", 2, 3,
           "- Hoe voel Poppie, en wat gebeur met Bonsile?\n- Twee opsies pas by die uittreksel.", None, "P: Teks J"))
AI = [
 A("5.10", 4, "Dink aan hoe Poppie se werk in die Kaap verloop het.", "Rangskik die vier gebeure", "1. Poppie het by die garage gewerk en by die Union Kollege geleer (dit kan eerste of laaste wees).", "2. Poppie het inslaapwerk by die kwekery gekry.", "3. Poppie het agt pond 'n maand by Mrs Scobie verdien.", "4. Mrs Swanepoel het Poppie gehelp om haar pas reg te kry."),
 A("5.11", 1, "Dink aan Stone se werk en blyplek.", "Soek een gebeurtenis", "1. Stone het in 'n steenhuis in die bachelor-quarters gaan bly of nagskof begin werk."),
 A("5.12", 1, "By wie het Kindjie en Fezi gaan bly?", "Gee 'n feit wat die stelling weerlê", "1. Hulle het by Mosie gaan bly."),
 A("5.13", 1, "Hoe voel Poppie oor die ander se lewens?", "Verduidelik hoekom jy jammer voel", "1. Dit is hartseer as jy voel niemand mis jou nie; Poppie is eensaam terwyl almal sonder haar regkom."),
 A("5.14", 1, "Wat beteken dit om jou eie pad te loop?", "Toets elke opsie", "1. B (hy het sy eie reëls gemaak en gevolg)."),
 A("5.15", 1, "Wie moet help as 'n kind iemand skade berokken?", "Verduidelik waarom jy kan identifiseer", "1. As jou kind skade berokken het, moet jy help; jou familie se naam en eer is op die spel."),
 A("5.16.1", 1, "Waarvoor staan die mans op?", "Kies die opsie tussen hakies", "1. partydig vir die meisie omdat haar geleenthede weggeneem is."),
 A("5.16.2", 1, "Wie praat vir die meisie?", "Gee een rede", "1. Iemand moes namens haar praat want sy was 'n weeskind en niemand anders sou vir haar veg nie."),
 A("5.17.1", 1, "Kan 'n spoor loop?", "Kies die stylfiguur", "1. personifikasie."),
 A("5.17.2", 1, "Wat beteken die vetgedrukte woorde?", "Verduidelik in jou eie woorde", "1. Die skuldige (die pa van die kind) bly in Poppie se huis; dit is haar seun."),
 A("5.18", 1, "Wat moes Poppie na Stone se dood doen?", "Soek die direkte gevolg", "1. Poppie moes gaan werk en alleenouer wees."),
 A("5.19", 2, "Wat het Poppie besef?", "Soek twee positiewe gevolge", "1. Haar kinders moes nou hulle eie keuses maak.", "2. Sy het besef sy kon nie meer doen nie en dat alles die Here se wil is."),
 A("5.20", 1, "Hoe het familiebesluite Poppie beïnvloed?", "Verduidelik hoekom die tema pas", "1. Jakkie se verkeerde dade het Poppie se kinders en ma betrek."),
]
lesson(10, P, "Vraag 5: Poppie – Die Drama (5.10–5.20)", "Vraag 5.10–5.20: Poppie — Die Drama — Teks J", 17, 2, 3, ("Teks J", "annexure_teks_j"), q, AI)

# ═══════════════ Vraag 6: Paljas ═══════════════
J = "paljas"
q = []
q.append(q_fact("Op watter dans het die dorpsmense die McDonalds weggejaag? Skryf een woord.", "Volstruisdans", "Dans:", "X: Teks L l.21-22 (other half)",
                "- Die naam van die dans kom in Emma se woorde voor.\n- Skryf een woord."))
o, a = mc("skertsend", ["hartseer", "bang", "moedeloos"])
q.append(Q(2, "drama", "toon_en_stylmiddele", "toon_van_'n_aanhaling", ["bepaal_toon"],
           "Watter woord beskryf Hendrik se toon in: \"Hoe gaan sy getroud kom as sy so hol vir al wat 'n broek is!\"?", o, a, "multiple_choice", 2, 2,
           "- Let op die toneelaanwysing voor sy woorde (met 'n laggie).\n- Hy meen dit nie ernstig nie.", None, "P: Teks K l.1-5"))
o, a = mc("Die musiek maak hom bly oor herinneringe, maar ook hartseer.",
          ["Die musiek maak hom kwaad omdat Katrien dit nooit speel nie.", "Die musiek herinner hom dat hy 'n nuwe liedjie moet leer.", "Die musiek maak hom bang vir al die dorpsmense in die omgewing."])
q.append(Q(3, "drama", "karakter_en_verhoudings", "innerlike_konflik", ["verklaar_innerlike_konflik"],
           "Waarom kan 'n mens sê Hendrik ervaar innerlike konflik as hy na die musiek luister (reël 11 tot 14)?", o, a, "multiple_choice", 3, 3,
           "- Die musiek is \"melancholies\" en hy is \"half aangedaan\".\n- Watter twee gevoelens is saam in hom?", None, "P: Teks K l.11-14"))
m, a = match([("Willem", "gebruik handgebare omdat hy nie praat nie"), ("Katrien", "staan in die kombuis en stryk"), ("Hendrik", "luister op die stoep na grammofoonmusiek")])
q.append(Q(4, "drama", "karakter_en_verhoudings", "wie_doen_wat", ["pas_gebeure_by_persone"],
           "Pas elke persoon by wat hy of sy in die uittreksel doen.", m, a, "match", 2, 2,
           "- Dink aan wie wys eerder as praat en wie by die stoof staan.\n- Begin met die een wat jy die mees seker is van.", None, "P: Teks K"))
o, a = mc("Mense luister soms na musiek om hulle eensame gevoelens te versag.",
          ["Musiek maak mense altyd kwaad.", "Eensame mense hou nie van musiek nie.", "Jy hoef nie na musiek te luister as jy hartseer is nie."])
q.append(Q(5, "drama", "karakter_en_verhoudings", "identifiseer_met_karakter", ["identifiseer_met_karakter"],
           "Hendrik luister na musiek as hy eensaam voel. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
           o, a, "multiple_choice", 2, 2, "- Dink aan 'n liedjie wat jou al beter laat voel het.\n- Gee 'n rede.", None, "L: identify (mirror 6.9)"))
AI = [
 A("6.1", 4, "Lees die paragraaf en dink aan die nar se aankoms.", "Soek elke woord in die drama", "6.1.1: Manuel.", "6.1.2: skuur.", "6.1.3: brood.", "6.1.4: fiets."),
 A("6.2", 1, "Wat het tussen Nollie en Emma gebeur?", "Soek een gebeurtenis", "1. Nollie en Emma was saam in die veld en daar was 'n ongelukkie; Emma het geval en seergekry."),
 A("6.3", 1, "Hoe klink Nollie as hy praat?", "Toets elke opsie by Nollie se woorde", "1. A (moedeloos)."),
 A("6.4", 1, "Hoekom praat Willem nie?", "Gee een rede", "1. Willem het 'n spraakprobleem gehad en het voor niemand gepraat nie."),
 A("6.5.1", 1, "Is musiek werklik salf?", "Kies die stylfiguur", "1. metafoor."),
 A("6.5.2", 1, "Wat doen die musiek vir Hendrik?", "Verduidelik die vetgedrukte woorde", "1. Hendrik het na musiek geluister as hy eensaam gevoel het; dit het hom beter laat voel."),
 A("6.6.1", 1, "Waarna verwys \"die ou dingetjie\"?", "Soek wat Hendrik wou hê gespeel moes word", "1. Die romantiese liedjie of plaat waarna hy geluister het."),
 A("6.6.2", 1, "Wat het Hendrik vir Katrien aangevra?", "Verduidelik die aanhaling", "1. Hendrik het die liedjie vroeër vir Katrien oor die radio aangevra; hulle verhouding was toe beter."),
 A("6.7", 4, "Pas elke gebeurtenis by die gevolg.", "Dink aan wat uit elke gebeurtenis gevolg het", "6.7.1: E.", "6.7.2: A.", "6.7.3: D.", "6.7.4: C."),
 A("6.8", 2, "Wat het die stoep vir Nollie beteken?", "Soek twee positiewe voorbeelde", "1. Nollie en Hendrik kon 'n goeie verhouding bou.", "2. Nollie het deel van die gesin geword of hulle liefde vir musiek gedeel."),
 A("6.9", 1, "Dink aan Emma se keuses oor trou.", "Verduidelik waarom jy kan identifiseer", "1. Emma moes haar eie keuses kon maak en wou nie hê ouers moet vir haar besluit nie."),
]
lesson(11, J, "Vraag 6: Paljas (6.1–6.9)", "Vraag 6.1–6.9: Paljas — Teks K", 18, 3, 3, ("Teks K", "annexure_teks_k"), q, AI)

q = []
o, a = mc("retoriese vraag", ["vergelyking", "personifikasie", "hiperbool"])
q.append(Q(1, "drama", "toon_en_stylmiddele", "identifiseer_stylfiguur", ["identifiseer_stylfiguur"],
           "Watter stylfiguur kom voor in Emma se woorde: \"Ek moet my loop mooimaak? Om te wat?\"?", o, a, "multiple_choice", 2, 3,
           "- Emma verwag nie werklik 'n antwoord nie.\n- Sy gebruik 'n vraag om haar woede te wys.", None, "P: Teks L l.13-15"))
o, a = mc("Almal is so geskok dat niemand kan praat nie.",
          ["Almal is so moeg dat hulle wil gaan slaap.", "Almal is so bly dat hulle nie kan ophou lag nie.", "Almal is so kwaad dat hulle begin baklei."])
q.append(Q(2, "drama", "toon_en_stylmiddele", "betekenis_van_'n_aanhaling", ["verklaar_betekenis_in_konteks"],
           "Wat beteken: \"Dis duidelik almal is nog stom van skok\"?", o, a, "multiple_choice", 2, 2,
           "- Wat doen jy as jy so geskok is dat jy niks kan sê nie?\n- Dink aan wat net by die Volstruisdans gebeur het.", None, "P: Teks L l.2"))
items = ["Katrien sê sy gaan slaap.", "Hendrik sê Nollie moet 'n plaat opsit.", "Emma word ontsteld oor die opdrag om haar mooi te maak.", "Emma vra hoekom hulle op die stasietjie bly."]
m, a = order5(items, [3, 0, 2, 1])
q.append(Q(3, "drama", "intrige_en_gebeure", "volgorde_in_die_uittreksel", ["rangskik_gebeure"],
           "Rangskik die gebeure in die volgorde waarin dit in die uittreksel voorkom.", m, a, "ordering", 2, 2,
           "- Volg die gesprek reël vir reël.\n- Emma se vraag oor die stasietjie kom aan die einde.", None, "P: Teks L"))
o, a = mc("Katrien het gesê sy wil die aand saam dans.",
          ["Katrien het gesê sy gaan slaap.", "Hendrik het gesê Nollie moet 'n plaat opsit.", "Emma het gevra waarom hulle op die stasietjie bly."])
q.append(Q(4, "drama", "intrige_en_gebeure", "onwaar_stelling", ["onderskei_waar_van_onwaar"],
           "Watter stelling oor die uittreksel is ONWAAR?", o, a, "multiple_choice", 2, 2,
           "- Wat wil Katrien aan die begin van die uittreksel doen?\n- Toets elke stelling teen die uittreksel.", None, "P: Teks L"))
o, a = ms(["Gesinskonflik en kommunikasie", "Vooroordeel van die dorpsmense"],
          ["Sportprestasies by die skool en die dorp se klub", "Hoe om 'n boerdery te bestuur en diere te versorg"])
q.append(Q(5, "drama", "tema_en_boodskap", "temas_in_die_uittreksel", ["identifiseer_temas"],
           "Kies TWEE temas wat in die uittreksel na vore kom.", o, a, "multi_select", 2, 3,
           "- Waaroor baklei Emma en Hendrik, en hoe word die gesin behandel?\n- Twee opsies pas by die uittreksel.", None, "P: Teks L"))
AI = [
 A("6.10", 4, "Dink aan die volgorde van die gebeure in die drama.", "Rangskik die vier gebeure", "1. Emma het Willem op die stoep gekry waar hy gelê en slaap het.", "2. Willem het die nar vermaak en probeer om hom te laat lag.", "3. Emma het gesê die gesin moet praat oor dinge wat belangrik is.", "4. Die dorpsmense het vir die McDonalds om verskoning gaan vra."),
 A("6.11.1", 1, "Hoe voel Katrien?", "Kies die opsie tussen hakies", "1. sy het nie geweet wat hulle nog moes doen om aanvaar te word nie."),
 A("6.11.2", 1, "Wat doen Katrien?", "Motiveer jou antwoord op 6.11.1", "1. Katrien wou nie verder aan die aand deelneem nie en het haar onttrek."),
 A("6.12", 1, "Wat sê Hendrik oor Emma se gedrag?", "Toets elke opsie", "1. C (van die probleem weghardloop)."),
 A("6.13", 1, "Wat doen Hendrik as pa?", "Gee een rede", "1. Hendrik is die pa wat vir sy gesin moes opstaan en wou dinge beter maak."),
 A("6.14.1", 1, "Hoe behandel die dorpsmense die McDonalds?", "Kies die opsie tussen hakies", "1. bevooroordeeld is teenoor mense wat anders as hulle is."),
 A("6.14.2", 1, "Wat het die dorpsmense gedink?", "Gee een rede", "1. Die dorpsmense het gedink die McDonalds was besig met duiwelsgoed en het die stories geglo."),
 A("6.15", 1, "Wie was eerste om verskoning te vra?", "Gee 'n feit wat die stelling weerlê", "1. Sakkie du Toit; Jan Mol het nooit om verskoning gevra nie."),
 A("6.16", 1, "Wat het by die Volstruisdans met Nollie en Emma gebeur?", "Soek die direkte gevolg", "1. Emma het Nollie toegelaat om by haar te sit en aan haar te vat."),
 A("6.17", 1, "Let op hoe Emma praat.", "Soek een aanduiding van Emma se woede", "1. Emma stel retoriese vrae en herhaal dinge wat Hendrik sê."),
 A("6.18", 1, "Wat gebeur nadat Emma praat?", "Gee 'n rede waarom jy goed voel", "1. Die gesin het met mekaar begin praat en na mekaar geluister."),
 A("6.19", 2, "Wat het Willem by Manuel geleer?", "Soek twee positiewe gevolge", "1. Willem kon sy toertjies vir die partytjiegangers wys.", "2. Hy kon sy gesin vermaak of weer begin praat."),
 A("6.20", 1, "Wat gebeur aan die einde met Hendrik en Katrien?", "Verduidelik hoekom die tema pas", "1. Hendrik en Katrien het saam gedans en gelag; Willem het hulle liefde gesien."),
]
lesson(12, J, "Vraag 6: Paljas (6.10–6.20)", "Vraag 6.10–6.20: Paljas — Teks L", 17, 2, 3, ("Teks L", "annexure_teks_l"), q, AI)

# ═══════════════ Vraag 7: Fiela se Kind — Die Drama ═══════════════
F = "fiela_se_kind_die_drama"
q = []
q.append(q_fact("Watter man het namens die magistraat by Elias-hulle gekom? Skryf net die van.", "Kapp", "Van:", "P: Teks M (mister Kapp)",
                "- Elias noem hom \"mister\".\n- Skryf een woord."))
o, a = mc("ontwykend", ["opgewonde", "hartseer", "dankbaar"])
q.append(Q(2, "drama", "toon_en_stylmiddele", "toon_van_'n_aanhaling", ["bepaal_toon"],
           "Watter woord beskryf Elias se toon in: \"Weet nie wanneer hulle weer huis kry nie. Hang af\"?", o, a, "multiple_choice", 2, 2,
           "- Kapp vra waar die kinders is, maar Elias gee nie 'n reguit antwoord nie.\n- Hy praat om die vraag te omseil.", None, "P: Teks M l.7-8"))
o, a = mc("Sy weet Elias lieg, maar is bang om iets te sê.",
          ["Sy wil Kapp vertel waar die kinders is, maar Elias stop haar.", "Sy is bly dat Kapp gekom het en wil langer gesels.", "Sy glo alles wat Elias vir Kapp sê."])
q.append(Q(3, "drama", "karakter_en_verhoudings", "innerlike_konflik", ["verklaar_innerlike_konflik"],
           "Waarom ervaar Barta innerlike konflik terwyl Elias met Kapp praat?", o, a, "multiple_choice", 3, 3,
           "- Barta se laaste sin is onvoltooid.\n- Watter twee dinge wil sy tegelyk doen?", None, "P: Teks M l.19"))
m, a = match([("Elias", "vra Kapp om vir die meisiekind kinderwagterwerk te soek"), ("Kapp", "bring 'n boodskap van die magistraat"), ("Barta", "sê as Lukas vandag hier was, was jy in die moeilikheid")])
q.append(Q(4, "drama", "karakter_en_verhoudings", "wie_doen_wat", ["pas_gebeure_by_persone"],
           "Pas elke persoon by wat hy of sy in die uittreksel sê of doen.", m, a, "match", 2, 2,
           "- Dink aan wie die magistraat se boodskap bring.\n- Begin met die een wat jy die mees seker is van.", None, "P: Teks M"))
o, a = mc("Mense kan bang wees om 'n leuen teenoor ander reg te stel.",
          ["Mense hoef nooit bang te wees om die waarheid te praat nie.", "'n Leuen is altyd makliker om reg te stel as die waarheid.", "Mense wat swyg, verstaan nooit wat aangaan nie."])
q.append(Q(5, "drama", "karakter_en_verhoudings", "identifiseer_met_karakter", ["identifiseer_met_karakter"],
           "Barta bly stil terwyl Elias lieg. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
           o, a, "multiple_choice", 2, 2, "- Dink aan 'n keer toe jy bang was om iets te sê.\n- Gee 'n rede.", None, "L: identify (mirror 7.7)"))
AI = [
 A("7.1", 4, "Lees die paragraaf en dink aan Benjamin se tyd by Fiela.", "Soek elke woord in die drama", "7.1.1: nege (9).", "7.1.2: geskop.", "7.1.3: Gertjie.", "7.1.4: bottels (soetoliebottel)."),
 A("7.2", 1, "Wat het Barta geweet?", "Soek een rede", "1. Barta het geweet Lukas was nie hulle kind nie en was bang vir moeilikheid met die gereg."),
 A("7.3", 1, "Let op hoe Elias praat.", "Toets elke opsie by Elias se woorde", "1. B (aggressief)."),
 A("7.4.1", 1, "Wie kan moeilikheid kom maak?", "Soek na wie \"sy\" verwys", "1. Na Fiela (Komoetie)."),
 A("7.4.2", 1, "Wat het die magistraat gesê?", "Verduidelik die aanhaling", "1. Die Van Rooyens moes die magistraat laat weet as Fiela hier moeilikheid kom maak."),
 A("7.5.1", 1, "Let op die woord \"nes\".", "Kies die stylfiguur", "1. vergelyking."),
 A("7.5.2", 1, "Hoe is Nina in die Bos?", "Verduidelik die vetgedrukte woorde", "1. Nina was baie lief vir die Bos en rats daarin."),
 A("7.6", 1, "Watter werk het Nina later gekry?", "Gee 'n feit wat die stelling bevestig", "1. Nina het die skoolmeester se kinders gaan oppas."),
 A("7.7", 1, "Hoekom swyg Barta?", "Verduidelik waarom jy kan identifiseer", "1. Barta was bang vir Elias en bang dat sy uitgevang sou word omdat sy in die hof gelieg het."),
 A("7.8", 1, "Wat het by Elias-hulle gebeur voordat Lukas en Nina terugkom?", "Soek een gebeurtenis", "1. Fiela was by die Van Rooyens om Benjamin se goed te bring en Elias het haar weggejaag."),
 A("7.9", 1, "Hoe praat en optree Elias?", "Gee een rede", "1. Elias het gelieg en was dreigend en aggressief teenoor Kapp en Fiela."),
 A("7.10", 4, "Pas elke gebeurtenis by die gevolg.", "Dink aan wat uit elke gebeurtenis gevolg het", "7.10.1: E.", "7.10.2: D.", "7.10.3: A.", "7.10.4: B."),
]
lesson(13, F, "Vraag 7: Fiela se Kind – Die Drama (7.1–7.10)", "Vraag 7.1–7.10: Fiela se Kind — Die Drama — Teks M", 18, 2, 3, ("Teks M", "annexure_teks_m"), q, AI)

q = []
o, a = mc("toneelaanwysings", ["monoloë", "subplotte", "epiloë"])
q.append(Q(1, "drama", "dramatiese_tegnieke", "toneelaanwysings", ["identifiseer_dramatiese_tegniek"],
           "Wat noem ons die woorde tussen hakies soos (Pouse.) en (kwaai) in 'n drama?", o, a, "multiple_choice", 2, 3,
           "- Hierdie woorde word nie hardop gesê nie.\n- Hulle vertel die akteur hoe om te praat of op te tree.", None, "P: Teks N (Pouse.), (kwaai)"))
o, a = mc("Lukas het Nina met haar werk in die Bos gehelp.",
          ["Lukas het Nina se huis in die Bos gebou.", "Lukas het vir Nina hout gekoop.", "Lukas het Nina se baas geword."])
q.append(Q(2, "drama", "toon_en_stylmiddele", "betekenis_van_'n_aanhaling", ["verklaar_betekenis_in_konteks"],
           "Wat beteken Lukas se woorde: \"vir al die bas wat ek vir jou help afkap het\"?", o, a, "multiple_choice", 2, 2,
           "- Dink aan die werk wat Bosmense in die Bos gedoen het.\n- Lukas noem al die keer wat hy vir Nina gehelp het.", None, "P: Teks N l.22-23"))
items = ["Weatherbury vra waarom Lukas Nina se geld wil kom haal.", "Nina verskyn agter miss Weatherbury.", "Nina sê Lukas moet nie sê waar sy is nie.", "Lukas vra dat Nina vir Pa sê hy kom nie terug nie."]
m, a = order5(items, [1, 3, 0, 2])
q.append(Q(3, "drama", "intrige_en_gebeure", "volgorde_in_die_uittreksel", ["rangskik_gebeure"],
           "Rangskik die gebeure in die volgorde waarin dit in die uittreksel voorkom.", m, a, "ordering", 2, 2,
           "- Volg die gesprek reël vir reël.\n- Lukas se versoek kom aan die einde.", None, "P: Teks N"))
o, a = mc("Nina wou haar geld nog altyd vir Pa gee.",
          ["Miss Weatherbury was agterdogtig oor Lukas se doel.", "Lukas het gesê hy wil een guns vra.", "Nina het gesê Lukas moet nie sê waar sy is nie."])
q.append(Q(4, "drama", "intrige_en_gebeure", "onwaar_stelling", ["onderskei_waar_van_onwaar"],
           "Watter stelling oor die uittreksel is ONWAAR?", o, a, "multiple_choice", 2, 2,
           "- Wat sê Nina oor haar geld?\n- Toets elke stelling teen die uittreksel.", None, "P: Teks N"))
o, a = ms(["Die verskil tussen boslewe en dorpslewe", "Lojaliteit tussen broer en suster"],
          ["Die voordele van moderne tegnologie in die huis", "Sportprestasies by die skool en in die dorp"])
q.append(Q(5, "drama", "tema_en_boodskap", "temas_in_die_uittreksel", ["identifiseer_temas"],
           "Kies TWEE temas wat in die uittreksel na vore kom.", o, a, "multi_select", 2, 3,
           "- Waarom is Lukas by miss Weatherbury, en wat sê hy oor Bosmense?\n- Twee opsies pas by die uittreksel.", None, "P: Teks N"))
AI = [
 A("7.11", 4, "Dink aan die volgorde van die gebeure in die drama.", "Rangskik die vier gebeure", "1. Lukas het vir Kaliel gevra om hom van die see te leer.", "2. Lukas het vir Fiela van sy liefde vir Nina vertel.", "3. Terwyl Elias siek gelê het, het Barta erken dat sy in die hof gelieg het.", "4. Die Komoeties het vir Lukas 'n brief geskryf om te sê hulle bid vir hom."),
 A("7.12.1", 1, "Hoe gaan Bosmense met geld om?", "Kies die opsie tussen hakies", "1. gestereotipeer word omdat hulle anders werk met hulle geld."),
 A("7.12.2", 1, "Wie beheer die geld in 'n Bosgesin?", "Gee een rede", "1. Die Bosmense het volgens hulle eie reëls gelewe en die pa was in beheer van die geld."),
 A("7.13.1", 1, "Waaroor is Lukas onseker?", "Kies die opsie tussen hakies", "1. was nie seker of hy vir Nina moes vra om na Elias-hulle toe te gaan nie."),
 A("7.13.2", 1, "Wat vra Lukas vir Nina?", "Motiveer jou antwoord op 7.13.1", "1. Hy het Nina gevra om hom te help en was bang Elias sou haar nie terug laat kom nie."),
 A("7.14", 1, "Wat beteken Nina se woorde oor haar pa?", "Toets elke opsie", "1. B (Elias moet ophou verwag dat sy kinders al sy werk doen)."),
 A("7.15", 1, "Wat het Nina gedoen toe sy terug was?", "Soek die direkte gevolg", "1. Nina het die ou plekke besoek en haar werk by miss Weatherbury verloor omdat sy so lank weggebly het."),
 A("7.16", 2, "Wat het die dorp vir Nina gegee?", "Soek twee positiewe voorbeelde", "1. Nina kon haar eie geld verdien en nuwe klere dra.", "2. Sy kon selfstandig wees of goeie maniere leer."),
 A("7.17", 1, "Wat sê Lukas in reël 22 tot 24?", "Verduidelik hoekom jy goed voel", "1. Lukas het nog altyd vir Nina beskerm en vra nou net een keer sy hulp."),
 A("7.18", 2, "Wat het Fiela gekry deur na die waarheid te soek?", "Soek twee positiewe gevolge", "1. Fiela het haar hanskind teruggekry.", "2. Sy het uitgevind by wie haar kind geplaas was."),
 A("7.19", 1, "Hoekom wou miss Weatherbury vir Nina beskerm?", "Gee een rede", "1. Nina was nog jonk en onervare en miss Weatherbury wou verhoed dat mense haar uitbuit."),
 A("7.20", 1, "Wat gebeur aan die einde van die drama?", "Verduidelik hoekom die tema pas", "1. Barta het die kans gekry om die waarheid te praat en Benjamin kon self oor sy toekoms besluit."),
]
lesson(14, F, "Vraag 7: Fiela se Kind – Die Drama (7.11–7.20)", "Vraag 7.11–7.20: Fiela se Kind — Die Drama — Teks N", 17, 2, 3, ("Teks N", "annexure_teks_n"), q, AI)

if __name__ == "__main__":
    emit(2025, PAPER, LS)
