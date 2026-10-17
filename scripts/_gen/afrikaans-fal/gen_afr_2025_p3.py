#!/usr/bin/env python3
"""Afrikaans FAL Nov 2025 Paper 3 — Skryf (9 lessons). Writes scripts/add-afrikaans-fal-2025-nov-p3-q<N>.js.
Lessons: the essay split along its own sub-question ranges (1.1-1.5 title topics, 1.6-1.8 picture topics; DESIGN-UNI-17) and one lesson per
text type (2.1-2.4, 3.1-3.3), named as the paper names them (LANG-WR-01). Practice questions test text-type CONVENTIONS on facts printed in the
paper's instructions and the memo's marking guidelines (LANG-WR-03); nothing is invented. supplementary_materials is null; the question image is the
task, the memo images are that task's marking points plus the rubric page."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from afr_common import *  # noqa

PAPER = "nov_p3"
LS = []


def lesson(order, name, header, marks, qn, mn, qs, ai, tags, ai_choice=False):
    LS.append(dict(order=order, name=name, header=header, marks=marks, q=qn, m=mn, supp=None, tags=tags, questions=qs, ai=ai, ai_choice=ai_choice))


ESSAY_TAGS = ["essay_writing_skills", "essay_structure", "narrative_writing"]

# ═══════════ Vraag 1: Opstel (1.1–1.5) ═══════════
q = []
m, a = match([("Argumenterende opstel", "neem reg van die begin af 'n standpunt in en motiveer dit"),
              ("Beredeneerde opstel", "beredeneer die onderwerp in 'n gebalanseerde opstel"),
              ("Bespiegelende opstel", "bespiegel of wonder oor die onderwerp")])
q.append(Q(1, "opstel", "opsteltipes", "beskrywing_van_opsteltipes", ["pas_opsteltipe_by_beskrywing"],
           "Pas elke opsteltipe by sy beskrywing.", m, a, "match", 2, 3,
           "- Dink aan wat die kandidaat in elke tipe doen.\n- Begin met die een wat jy die mees seker is van.", None, "M: memo 1.3-1.5 type descriptions"))
items = ["Kies 'n onderwerp", "Beplan met 'n kopkaart of sleutelwoorde", "Skryf die opstel", "Redigeer en proeflees die opstel"]
m, a = order5(items, [2, 0, 3, 1])
q.append(Q(2, "opstel", "beplanning", "volgorde_van_die_skryfproses", ["rangskik_skryfproses"],
           "Rangskik die stappe van die skryfproses in die volgorde waarin jy dit uitvoer.", m, a, "ordering", 2, 3,
           "- Die paper se instruksies sê beplanning kom voordat jy die finale produk skryf.\n- Na die skryf kom nog 'n stap.", None, "P: paper instruction 5"))
m, a = fitb("Getal:", "250")
q.append(Q(3, "opstel", "struktuur", "woordelengte_van_die_opstel", ["voltooi_feit_uit_teks"],
           "Hoeveel woorde moet jou opstel minstens hê? Skryf net die getal.", m, a, "fitb", 1, 2,
           "- Die paper vra vir 'n opstel van tussen twee getalle.\n- Skryf die kleinste getal.", None, "P: Teks Vraag 1 (250–300 woorde)"))
o, a = mc("argumenterende opstel", ["verhalende opstel", "beskrywende opstel", "bespiegelende opstel"])
q.append(Q(4, "opstel", "opsteltipes", "opsteltipe_by_onderwerp", ["kies_opsteltipe_by_onderwerp"],
           "Watter opsteltipe pas by \"'Nee' is die moeilikste woord om te sê\" as jy reg van die begin af 'n standpunt wil inneem?", o, a, "multiple_choice", 2, 3,
           "- Die tipe waar jy 'n standpunt inneem en motiveer.\n- Die memo noem dit by onderwerp 1.4.", None, "M: memo 1.4"))
o, a = mc("Die opstel kan elemente van verskillende tipes opstelle bevat.",
          ["Jy mag net een opsteltipe in die hele opstel gebruik.", "Jy moet altyd 'n argumenterende opstel skryf.", "Verskillende tipes opstelle word nie aanvaar nie."])
q.append(Q(5, "opstel", "opsteltipes", "kombinasie_van_opsteltipes", ["onderskei_waar_van_onwaar"],
           "Wat sê die memo oor die opsteltipes wat 'n onderwerp toelaat?", o, a, "multiple_choice", 2, 2,
           "- Die memo sê wat die nasiener oor 'n kombinasie van tipes onthou.\n- Dit staan by elke onderwerp.", None, "M: memo 1.1-1.5"))
AI = [
 A("1.1", 50, "Dink aan wat jy van jou maat(s) geleer het.", "Kies verhalend of beskrywend|Beplan en skryf 250–300 woorde", "1. Verhalende opstel: vertel lewendig wat jy by jou maat(s) geleer het.", "2. Beskrywende opstel: beskryf dit lewendig."),
 A("1.2", 50, "Dink aan die huis op die hoek van die straat.", "Kies beskrywend, verhalend of bespiegelend", "1. Beskrywend: beskryf die huis.", "2. Verhalend: vertel van die huis.", "3. Bespiegelend: wonder oor die huis."),
 A("1.3", 50, "Wat hou 2026 vir jou in?", "Kies bespiegelend, beredeneerd of beskrywend", "1. Bespiegelend: wonder oor wat 2026 inhou.", "2. Beredeneerd: beredeneer of jy uitsien na 2026 of nie.", "3. Beskrywend: beskryf hoe jy uitsien na 2026."),
 A("1.4", 50, "Is \"nee\" regtig die moeilikste woord om te sê?", "Neem 'n standpunt in of beredeneer", "1. Argumenterend: neem reg van die begin 'n standpunt in en motiveer dit.", "2. Beredeneerd, verhalend, beskrywend of bespiegelend is ook moontlik."),
 A("1.5", 50, "Wat beteken vryheid vir jou?", "Kies bespiegelend, verhalend, beskrywend of argumenterend", "1. Bespiegelend: wonder oor die idee van vryheid.", "2. Argumenterend: neem 'n standpunt in dat vryheid bestaan al dan nie."),
]
lesson(1, "Vraag 1: Opstel (1.1–1.5)", "Vraag 1.1–1.5: Opstel", 50, 1, 4, q, AI, ESSAY_TAGS, ai_choice=True)

# ═══════════ Vraag 1: Opstel (1.6–1.8) ═══════════
q = []
o, a = mc("Die titel en die visuele prikkel moet by mekaar aansluit.",
          ["Die titel hoef niks met die prent te doen te hê nie.", "Die prent moet net oorgeskryf word as 'n sin.", "Die titel moet altyd uit die woorde 'prent' en 'opstel' bestaan."])
q.append(Q(1, "opstel", "prikkels_en_titel", "titel_en_prikkel", ["onderskei_waar_van_onwaar"],
           "Waaraan moet die titel en die visuele prikkel voldoen?", o, a, "multiple_choice", 2, 3,
           "- Die memo sê wat die nasiener oor titel en prent onthou.\n- Dit gaan oor hoe die twee verband hou.", None, "M: memo general 9 (Vraag 1.6-1.8)"))
o, a = ms(["Letterlik: wat jy op die prent sien", "Figuurlik: wat die prent simboliseer"], ["Deur die prent net oor te skryf soos dit is", "Deur die prent heeltemal te ignoreer"])
q.append(Q(2, "opstel", "prikkels_en_titel", "prent_letterlik_en_figuurlik", ["interpreteer_visuele_prikkel"],
           "Kies TWEE maniere waarop jy 'n prent in 'n opstel kan interpreteer.", o, a, "multi_select", 2, 3,
           "- Die memo gee 'n letterlike en 'n figuurlike interpretasie by elke prent.\n- Twee opsies pas by die memo.", None, "M: memo 1.6-1.8"))
items = ["Die inleiding", "Die liggaam van die opstel", "Die samevatting of slot"]
m, a = order5(items, [1, 2, 0])
q.append(Q(3, "opstel", "struktuur", "dele_van_die_opstel", ["rangskik_dele_van_teksvorm"],
           "Rangskik die dele van 'n opstel in die volgorde waarin hulle voorkom.", m, a, "ordering", 1, 3,
           "- Dink aan hoe 'n opstel van begin tot einde opgebou word.\n- Elke deel het sy eie taak.", None, "M: rubric (inleiding, liggaam, samevatting/slot)"))
m, a = fitb("Getal:", "30")
q.append(Q(4, "opstel", "taal_en_beoordeling", "puntetoekenning", ["voltooi_feit_uit_teks"],
           "Uit hoeveel punte word Inhoud en Beplanning in die opstelrubriek nagesien? Skryf net die getal.", m, a, "fitb", 2, 2,
           "- Die opstel is uit 50 punte nagesien.\n- Inhoud en beplanning dra die meeste punte.", None, "M: memo 'Neerskryf van punte' (30/15/5)"))
o, a = mc("Die kandidaat verdien geen punte nie.",
          ["Die kandidaat verdien net die struktuurpunte.", "Die kandidaat verdien half punte vir die inhoud.", "Die kandidaat verdien vol punte vir die taal."])
q.append(Q(5, "opstel", "taal_en_beoordeling", "opstel_in_engels", ["onderskei_waar_van_onwaar"],
           "Wat gebeur as 'n opstel heeltemal in Engels geskryf is?", o, a, "multiple_choice", 2, 2,
           "- Die opstel moet in die taal wat geassesseer word geskryf wees.\n- Die memo se algemene reël sê wat dan gebeur.", None, "M: memo general 3"))
AI = [
 A("1.6", 50, "Kyk na die prent: iemand wat vasgeketting is wat 'n selfoon vashou.", "Interpreteer letterlik en figuurlik", "1. Letterlik: mense gebruik tegnologie vir alles of sit lang ure voor skerms.", "2. Figuurlik: tegnologie maak jou 'n slaaf en beperk jou lewe tot 'n skerm."),
 A("1.7", 50, "Kyk na die prent: 'n verfkwas wat 'n pad oopverf en 'n figuur wat die pad volg.", "Interpreteer letterlik en figuurlik", "1. Letterlik: iemand verf 'n pad of leef sy talent uit.", "2. Figuurlik: 'n lewensreis, 'n skoon begin; ek verf my eie pad oop."),
 A("1.8", 50, "Kyk na die prent: 'n kind alleen op 'n swaai.", "Interpreteer letterlik en figuurlik", "1. Letterlik: 'n kind wat buite speel of vir iemand wag.", "2. Figuurlik: eensaamheid, verwaarlosing of ontvlugting."),
]
lesson(2, "Vraag 1: Opstel (1.6–1.8)", "Vraag 1.6–1.8: Opstel — visuele prikkels", 50, 2, 4, q, AI, ESSAY_TAGS, ai_choice=True)

# ═══════════ helper for transactional lessons ═══════════
TX = "transaksionele_tekste"


def tx(order, name, header, marks, qn, mn, qs, ai_entry, tags):
    lesson(order, name, header, marks, qn, mn, qs, [ai_entry], tags)


# ═══════════ Vraag 2.1: Vriendskaplike brief ═══════════
q = []
items = ["Die skrywer se adres regs bo", "Die datum voluit geskryf", "Die aanhef teen die linkerkantlyn", "Die groet en naam aan die einde"]
m, a = order5(items, [3, 1, 0, 2])
q.append(Q(1, TX, "vriendskaplike_brief", "formaat_van_die_brief", ["rangskik_dele_van_teksvorm"],
           "Rangskik die dele van 'n vriendskaplike brief van bo na onder.", m, a, "ordering", 2, 3,
           "- Die adres en datum staan eerste.\n- Die groet kom aan die einde.", None, "M: memo 2.1 format"))
m, a = fitb("Woord:", "leestekens")
q.append(Q(2, TX, "vriendskaplike_brief", "leestekens_in_die_brief", ["voltooi_feit_uit_teks"],
           "Watter ding word NIE in die adres, aanhef of slot van die brief gebruik nie? Skryf een woord.", m, a, "fitb", 2, 3,
           "- Dit gaan oor punte en kommas.\n- Skryf een woord.", None, "M: memo 2.1 Leestekens"))
o, a = mc("Beste Thandi", ["Geagte mevrou Cona", "Aan wie dit mag aangaan", "Hooggeagte meneer Dickson"])
q.append(Q(3, TX, "vriendskaplike_brief", "aanhef_en_register", ["kies_gepaste_register"],
           "Watter aanhef pas by 'n vriendskaplike brief aan 'n maat?", o, a, "multiple_choice", 1, 3,
           "- 'n Vriendskaplike brief is informeel.\n- Die memo noem \"Beste\" of \"Liewe\".", None, "M: memo 2.1 Aanhef"))
o, a = ms(["Die aanslag is informeel", "Die inhoud word in paragrawe aangebied"], ["Die doel word in hoofletters geskryf", "Die brief word met Die uwe afgesluit"])
q.append(Q(4, TX, "vriendskaplike_brief", "kenmerke_van_die_brief", ["identifiseer_kenmerke_van_teksvorm"],
           "Kies TWEE kenmerke van 'n vriendskaplike brief.", o, a, "multi_select", 2, 3,
           "- Dink aan hoe jy met 'n maat praat.\n- Hoofletters vir die doel en Die uwe pas by 'n ander soort brief.", None, "M: memo 2.1 Kenmerke"))
o, a = mc("120–150 woorde", ["80–100 woorde", "250–300 woorde", "50–70 woorde"])
q.append(Q(5, TX, "vriendskaplike_brief", "woordelengte", ["voltooi_feit_uit_teks"],
           "Hoeveel woorde behoort 'n lang transaksionele teks soos hierdie brief te hê?", o, a, "multiple_choice", 1, 2,
           "- Dit is nie die opstel nie.\n- Afdeling B se lengte staan by die opdrag.", None, "P: paper Vraag 2 (120–150)"))
AI = A("2.1", 30, "Jy skryf 'n vriendskaplike brief aan jou maat oor 'n lekker musiekkonsert.", "Gebruik die regte formaat, 'n informele toon en paragrawe|Hou by 120–150 woorde",
       "1. Formaat: adres regs bo, datum voluit, aanhef (Beste of Liewe) teen die linkerkantlyn, geen leestekens in adres, aanhef of slot.", "2. Inhoud: die doel is om te vertel van die konsert en waarom jy dit baie geniet het.", "3. Taal: informeel, vriendelik en waarderend, korrekte spelling en sinne.")
tx(3, "Vraag 2.1: Vriendskaplike brief", "Vraag 2.1: Vriendskaplike brief", 30, 1, 3, q, AI, ["letter_format", "transactional_writing", "language_register"])

# ═══════════ Vraag 2.2: Dekbrief ═══════════
q = []
items = ["Die skrywer se adres en die datum", "Die ontvanger se adres teen die linkerkantlyn", "Die formele aanhef", "Die doel van die brief in hoofletters"]
m, a = order5(items, [2, 0, 3, 1])
q.append(Q(1, TX, "formele_brief", "formaat_van_die_brief", ["rangskik_dele_van_teksvorm"],
           "Rangskik die dele van 'n dekbrief van bo na onder.", m, a, "ordering", 2, 3,
           "- Die skrywer se adres kom voor die ontvanger s'n.\n- Die doel kom na die aanhef.", None, "M: memo 2.2 format"))
m, a = fitb("Woord:", "uwe")
q.append(Q(2, TX, "formele_brief", "formele_afsluiting", ["voltooi_feit_uit_teks"],
           "Voltooi die formele afsluiting van die brief met een woord: Die ...", m, a, "fitb", 2, 3,
           "- Dit is die formele slot voor jou naam.\n- Geen leesteken word daarna gebruik nie.", None, "M: memo 2.2 (Die uwe)"))
o, a = mc("Met \"u\" omdat die brief formeel is", ["Met \"jy\" en sleng", "Net met sy voornaam", "Met \"ons\" asof hy 'n maat is"])
q.append(Q(3, TX, "formele_brief", "aanspreekvorm", ["kies_gepaste_register"],
           "Hoe spreek jy die hoof in 'n dekbrief aan?", o, a, "multiple_choice", 2, 3,
           "- 'n Dekbrief is formeel.\n- Die memo sê die hoof word as 'u' aangespreek.", None, "M: memo 2.2 Taal en styl"))
o, a = ms(["Die doel van die brief (die aansoek vir die pos)", "Motivering waarom jy in diens geneem moet word"], ["Jou volledige CV woord vir woord oorgeskryf", "'n Grap om die hoof te laat lag"])
q.append(Q(4, TX, "formele_brief", "kenmerke_van_die_brief", ["identifiseer_kenmerke_van_teksvorm"],
           "Kies TWEE dinge wat in 'n dekbrief moet wees.", o, a, "multi_select", 2, 3,
           "- Die dekbrief ondersteun die aansoek.\n- Dit herhaal nie die CV nie.", None, "M: memo 2.2 Inhoud"))
o, a = mc("Om die aansoek met nuwe inligting buite die CV te ondersteun.",
          ["Om die CV in 'n ander volgorde oor te skryf vir die hoof.", "Om die hoof persoonlik te vermaak en te laat lag.", "Om die kandidaat se naam in die koerant bekend te maak."])
q.append(Q(5, TX, "formele_brief", "doel_van_die_dekbrief", ["identifiseer_doel_van_teksvorm"],
           "Wat is die doel van 'n dekbrief?", o, a, "multiple_choice", 2, 2,
           "- Die dekbrief gaan saam met 'n CV.\n- Wat voeg dit by die CV?", None, "M: memo 2.2 Kenmerke"))
AI = A("2.2", 30, "Jy skryf 'n dekbrief aan meneer Dickson, hoof van Laerskool Sonskyn, vir die pos as onderwysassistent.", "Gebruik die formele formaat en 'u'|Motiveer waarom jy in diens geneem moet word",
       "1. Formaat: skrywer se adres regs bo, datum voluit, ontvanger se adres links, formele aanhef, doel in hoofletters (of onderstreep), Die uwe sonder leesteken.", "2. Inhoud: ondersteun die aansoek met persoonlikheidseienskappe en vaardighede wat nie in die CV is nie.", "3. Taal: formeel en hoopvol; 120–150 woorde.")
tx(4, "Vraag 2.2: Dekbrief", "Vraag 2.2: Dekbrief (formele brief)", 30, 2, 3, q, AI, ["formal_letter", "letter_format", "formal_register"])

# ═══════════ Vraag 2.3: Huldeblyk ═══════════
q = []
items = ["Die inleiding met die groet en die rede vir die samekoms", "Die oom se naam en 'n oorsig oor sy lewe", "Staaltjies uit die tyd toe jy hom geken het", "Die slot met waardering en bemoediging vir die familie"]
m, a = order5(items, [3, 1, 0, 2])
q.append(Q(1, TX, "huldeblyk", "struktuur_van_die_huldeblyk", ["rangskik_dele_van_teksvorm"],
           "Rangskik die dele van 'n huldeblyk in die volgorde waarin hulle voorkom.", m, a, "ordering", 2, 3,
           "- Die huldeblyk begin met 'n groet.\n- Die familie word aan die einde bemoedig.", None, "M: memo 2.3 Formaat"))
m, a = fitb("Woord:", "verlede|verlede tyd")
q.append(Q(2, TX, "huldeblyk", "tyd_in_die_huldeblyk", ["voltooi_feit_uit_teks"],
           "In watter tyd word die huldeblyk hoofsaaklik geskryf? Skryf een of twee woorde.", m, a, "fitb", 2, 3,
           "- Die oom is reeds dood.\n- Die vertroosting staan in 'n ander tyd.", None, "M: memo 2.3 Kenmerke"))
o, a = mc("waarderend en respekvol", ["spottend en grappig", "kwaad en beskuldigend", "onverskillig en kortaf"])
q.append(Q(3, TX, "huldeblyk", "toon_van_die_huldeblyk", ["kies_gepaste_register"],
           "Watter toon pas by 'n huldeblyk by 'n gedenkdiens?", o, a, "multiple_choice", 1, 3,
           "- Jy praat oor iemand wat gesterf het en eer sy lewe.\n- Dink aan die gevoel by 'n gedenkdiens.", None, "M: memo 2.3 Kenmerke"))
o, a = ms(["'n Opskrif", "Bemoediging vir die familie"], ["Die oom se skuldbrief", "Instruksies om by die gedenkdiens uit te kom"])
q.append(Q(4, TX, "huldeblyk", "kenmerke_van_die_huldeblyk", ["identifiseer_kenmerke_van_teksvorm"],
           "Kies TWEE dinge wat 'n huldeblyk moet bevat.", o, a, "multi_select", 2, 3,
           "- Die memo se Formaat noem 'n opskrif.\n- Dink aan wie jy wil bemoedig.", None, "M: memo 2.3 Formaat/Inhoud"))
o, a = mc("Om hulde te bring en die familie te bemoedig.",
          ["Om die familie se skuld by die kerk te bespreek.", "Om die gedenkdiens se hele program voor te lees.", "Om 'n lang toespraak oor skoolwerk te lewer."])
q.append(Q(5, TX, "huldeblyk", "doel_van_die_huldeblyk", ["identifiseer_doel_van_teksvorm"],
           "Wat is die doel van 'n huldeblyk?", o, a, "multiple_choice", 2, 2,
           "- Die huldeblyk eer iemand.\n- Wie moet ook bemoedig word?", None, "M: memo 2.3 Kenmerke"))
AI = A("2.3", 30, "Jy skryf die huldeblyk vir jou oom by wie jy baie van kultuur en tradisies geleer het.", "Skryf in die verlede tyd met 'n opskrif|Bemoedig die familie",
       "1. Formaat: opskrif, inleidende paragraaf met groet en rede, paragraaf 2 met naam en oorsig, volgende paragrawe met staaltjies, slotparagraaf met waardering.", "2. Toon: waarderend, liefdevol, vertroostend en taktvol.", "3. Lengte 120–150 woorde.")
tx(5, "Vraag 2.3: Huldeblyk", "Vraag 2.3: Huldeblyk", 30, 2, 3, q, AI, ["obituary", "transactional_writing", "language_register"])

# ═══════════ Vraag 2.4: Informele toespraak ═══════════
q = []
items = ["Die groet", "Die rede vir die toespraak", "Hoogtepunte en laagtepunte van die jare", "Motivering en voorspoedwense aan die einde"]
m, a = order5(items, [2, 3, 0, 1])
q.append(Q(1, TX, "toespraak", "struktuur_van_die_toespraak", ["rangskik_dele_van_teksvorm"],
           "Rangskik die dele van 'n toespraak in die volgorde waarin hulle voorkom.", m, a, "ordering", 2, 3,
           "- Die toespraak begin met 'n groet.\n- Die voorspoedwense sluit af.", None, "M: memo 2.4 Inhoud/Formaat"))
m, a = fitb("Woord:", "groet")
q.append(Q(2, TX, "toespraak", "begin_van_die_toespraak", ["voltooi_feit_uit_teks"],
           "Waarmee begin 'n toespraak volgens die memo? Skryf een woord.", m, a, "fitb", 1, 3,
           "- Dit is wat jy eerste vir jou gehoor sê.\n- Skryf een woord.", None, "M: memo 2.4 Formaat"))
o, a = mc("informeel en gemaklik", ["streng formeel", "kwaad en aanvallend", "kortaf soos 'n kennisgewing"])
q.append(Q(3, TX, "toespraak", "aanspreekvorm_en_styl", ["kies_gepaste_register"],
           "Watter aanspreekvorm en styl pas by 'n informele toespraak?", o, a, "multiple_choice", 1, 3,
           "- Jy praat met jou mede-graad 12-leerders.\n- Die toespraak is informeel.", None, "M: memo 2.4 Taal en styl"))
o, a = ms(["'n Inleiding met die groet en die rede", "'n Slot met motivering en voorspoedwense"], ["Die adres van die ontvanger onder die datum", "'n Datum regs bo teen die kantlyn"])
q.append(Q(4, TX, "toespraak", "kenmerke_van_die_toespraak", ["identifiseer_kenmerke_van_teksvorm"],
           "Kies TWEE dele wat in 'n toespraak hoort.", o, a, "multi_select", 2, 3,
           "- 'n Toespraak het 'n inleiding, liggaam en slot.\n- 'n Adres en datum pas by 'n brief.", None, "M: memo 2.4 Formaat"))
o, a = mc("sms-taal", ["volsinne", "'n positiewe toon", "paragrawe"])
q.append(Q(5, TX, "toespraak", "taal_wat_vermy_moet_word", ["identifiseer_kenmerke_van_teksvorm"],
           "Watter taalgebruik moet jy in die skryfstuk vermy volgens die vraestel se instruksies?", o, a, "multiple_choice", 1, 2,
           "- Die instruksie sê iets oor 'n kort manier van skryf op die selfoon.\n- Dit pas nie by 'n skryfstuk nie.", None, "P: paper instruction 3"))
AI = A("2.4", 30, "Jy skryf 'n informele toespraak oor die vyf jaar wat die graad 12-leerders saam op skool was.", "Begin met die groet en stel die rede dadelik|Sluit af met motivering en voorspoedwense",
       "1. Formaat: groet, inleiding, liggaam in paragrawe, slot.", "2. Inhoud: wat saam beleef is, hoogte- en laagtepunte, wat die jare spesiaal gemaak het, motivering en voorspoedwense.", "3. Taal: informeel en gemaklik, positief; geen sms-taal.")
tx(6, "Vraag 2.4: Informele toespraak", "Vraag 2.4: Informele toespraak", 30, 2, 2, q, AI, ["speech_structure", "transactional_writing", "language_register"])

# ═══════════ Vraag 3.1: Uitnodigingskaartjie ═══════════
q = []
o, a = ms(["Wanneer en waar die partytjie gehou word", "Hoe gaste moet laat weet of hulle kom"], ["Die gasheer se laaste skoolrapport en punte", "Lang paragrawe oor sy kinderjare"])
q.append(Q(1, TX, "uitnodiging", "inhoud_van_die_uitnodiging", ["identifiseer_kenmerke_van_teksvorm"],
           "Kies TWEE dinge wat op 'n uitnodigingskaartjie moet staan.", o, a, "multi_select", 2, 3,
           "- Gaste moet weet wanneer en waar.\n- Hulle moet kan antwoord.", None, "M: memo 3.1 Inhoud"))
m, a = fitb("Getal:", "80")
q.append(Q(2, TX, "uitnodiging", "woordelengte", ["voltooi_feit_uit_teks"],
           "'n Kort transaksionele teks behoort tussen ... en 100 woorde te hê. Skryf die ondergrens as 'n getal.", m, a, "fitb", 1, 2,
           "- Die vraestel noem twee getalle vir Afdeling C.\n- Skryf die kleinste.", None, "P: paper Vraag 3 (80–100)"))
o, a = mc("uitnodigend en vriendelik", ["streng en baie bevelend", "skerp en sarkasties", "kwaad en ongeduldig"])
q.append(Q(3, TX, "uitnodiging", "toon_van_die_uitnodiging", ["kies_gepaste_register"],
           "Watter toon pas by 'n uitnodigingskaartjie?", o, a, "multiple_choice", 1, 3,
           "- Jy nooi jou maats na jou partytjie.\n- Die toon spreek die leser direk aan.", None, "M: memo 3.1 Taal en styl"))
o, a = mc("Die belangrikste inligting trek dadelik die leser se aandag.",
          ["Die inligting word in lang, omslagtige paragrawe geskryf.", "Net een lettertipe en een lettergrootte word gebruik.", "Die kaartjie het nie inligting oor die tyd nie."])
q.append(Q(4, TX, "uitnodiging", "formaat_van_die_uitnodiging", ["identifiseer_kenmerke_van_teksvorm"],
           "Watter stelling oor die formaat van 'n uitnodigingskaartjie is korrek?", o, a, "multiple_choice", 2, 3,
           "- Die kaartjie moet leservriendelik wees.\n- Dink aan lettertipes en lettergroottes.", None, "M: memo 3.1 Formaat"))
o, a = mc("Inligting kan puntsgewys gegee word.", ["Elke sin moet 'n volle paragraaf wees.", "Daar mag geen opskrif wees nie.", "Alle inligting moet in hoofletters wees."])
q.append(Q(5, TX, "uitnodiging", "uitleg_van_die_uitnodiging", ["identifiseer_kenmerke_van_teksvorm"],
           "Hoe mag die inligting op die kaartjie uiteengesit word?", o, a, "multiple_choice", 1, 2,
           "- Geen omslagtige paragrawe nie.\n- Kort reëls maak dit leservriendelik.", None, "M: memo 3.1 Formaat"))
AI = A("3.1", 20, "Jy skryf 'n uitnodigingskaartjie om jou maats na jou 18de verjaardagpartytjie uit te nooi.", "Gee wie, wanneer, waar, kleredrag en kontakbesonderhede|Maak die belangrikste inligting opvallend",
       "1. Inhoud: teikengroep, dag, datum en tyd, plek, kleredrag, kontakbesonderhede en hoe gaste laat weet.", "2. Formaat: belangrike inligting trek aandag, verskillende lettertipes, geen omslagtige paragrawe, kan puntsgewys wees.", "3. Taal: uitnodigend, informeel en gemaklik; 80–100 woorde.")
tx(7, "Vraag 3.1: Uitnodigingskaartjie", "Vraag 3.1: Uitnodigingskaartjie", 20, 1, 2, q, AI, ["transactional_writing", "language_register"])

# ═══════════ Vraag 3.2: Dagboekinskrywings ═══════════
q = []
m, a = fitb("Woord:", "datum|dag")
q.append(Q(1, TX, "dagboekinskrywing", "formaat_van_die_inskrywing", ["voltooi_feit_uit_teks"],
           "Wat moet boaan elke dagboekinskrywing geskryf word? Skryf een woord.", m, a, "fitb", 1, 3,
           "- Elke inskrywing word aan 'n dag gekoppel.\n- Skryf een woord.", None, "M: memo 3.2 Formaat"))
o, a = mc("Hom- of haarself", ["Die onderwyser", "Die klasmaats", "Die hoof"])
q.append(Q(2, TX, "dagboekinskrywing", "aanspreekvorm", ["kies_gepaste_register"],
           "Aan wie skryf 'n mens in 'n dagboek?", o, a, "multiple_choice", 1, 3,
           "- 'n Dagboek is persoonlik.\n- Die toon is persoonlik.", None, "M: memo 3.2 Taal en styl"))
o, a = ms(["hartseer", "dankbaar"], ["padteken", "straatnaam"])
q.append(Q(3, TX, "dagboekinskrywing", "woordkeuse_vir_gevoelens", ["identifiseer_kenmerke_van_teksvorm"],
           "Kies TWEE woorde wat gevoelens beskryf, soos in 'n dagboekinskrywing.", o, a, "multi_select", 1, 3,
           "- Die memo noem woorde soos ongelukkig en hoopvol.\n- Die ander twee woorde gaan oor rigtings.", None, "M: memo 3.2 Taal en styl"))
o, a = mc("Twee, vir twee verskillende dae", ["Een inskrywing vir die hele week lank", "Drie inskrywings, vir drie klasse", "Net een kort sin oor jou dag"])
q.append(Q(4, TX, "dagboekinskrywing", "aantal_inskrywings", ["voltooi_feit_uit_teks"],
           "Hoeveel dagboekinskrywings moet die kandidaat maak?", o, a, "multiple_choice", 1, 3,
           "- Die opdrag noem twee aande.\n- Elke inskrywing het sy eie dag.", None, "P: paper 3.2"))
o, a = mc("Nee, dit is nie verpligtend nie.", ["Ja, anders kry jy geen punte nie.", "Ja, maar net by die eerste inskrywing.", "Nee, want 'n dagboek mag nie 'n aanhef hê nie."])
q.append(Q(5, TX, "dagboekinskrywing", "aanhef_in_die_dagboek", ["onderskei_waar_van_onwaar"],
           "Moet jy elke inskrywing met \"Liewe Dagboek\" begin?", o, a, "multiple_choice", 2, 2,
           "- Die memo sê iets oor 'n aanhef in 'n dagboek.\n- Dit is 'n opsie, nie 'n vereiste nie.", None, "M: memo 3.2 Formaat"))
AI = A("3.2", 20, "Jy maak twee dagboekinskrywings: die aand na jou gunstelingonderwyser weg is en die aand na jou eerste les by die nuwe onderwyser.", "Skryf elke inskrywing met die dag of datum boaan|Beskryf jou gevoelens met fyn gekose woorde",
       "1. Formaat: twee inskrywings vir twee dae, die dag of datum boaan, geen verpligte aanhef.", "2. Inhoud: jou gevoelens en gedagtes oor die vorige en die nuwe onderwyser.", "3. Taal: persoonlik en informeel; vermy sleng en sms-taal; 80–100 woorde.")
tx(8, "Vraag 3.2: Dagboekinskrywings", "Vraag 3.2: Dagboekinskrywings", 20, 2, 3, q, AI, ["diary_entry", "transactional_writing", "language_register"])

# ═══════════ Vraag 3.3: Rigtingaanwysings ═══════════
q = []
items = ["Vertrek by die taxi-staanplek", "Draai links in Kerkstraat", "Ry verby die garage", "Die skool is aan jou regterkant"]
m, a = order5(items, [2, 0, 3, 1])
q.append(Q(1, TX, "rigtingaanwysings", "chronologiese_volgorde", ["rangskik_dele_van_teksvorm"],
           "Rangskik hierdie rigtingaanwysings in 'n logiese volgorde van die begin tot die skool.", m, a, "ordering", 2, 3,
           "- Rigtingaanwysings word chronologies gegee.\n- Die bestemming kom laaste.", None, "M: memo 3.3 Inhoud (chronologies)"))
m, a = fitb("Woord:", "bevelsin|bevelsinne")
q.append(Q(2, TX, "rigtingaanwysings", "sinstruktuur", ["voltooi_feit_uit_teks"],
           "Watter tipe sin begin rigtingaanwysings gewoonlik met 'n werkwoord (bv. Draai links)? Skryf een woord.", m, a, "fitb", 2, 3,
           "- Hierdie sin gee 'n opdrag.\n- Skryf een woord.", None, "M: memo 3.3 Kenmerke/Taal"))
o, a = mc("die teenwoordige tyd", ["die verlede tyd", "die toekomende tyd", "enige tyd wat jy wil"])
q.append(Q(3, TX, "rigtingaanwysings", "tyd_in_rigtingaanwysings", ["kies_gepaste_register"],
           "In watter tyd word rigtingaanwysings geskryf?", o, a, "multiple_choice", 2, 3,
           "- Die persoon volg die aanwysings terwyl hy ry.\n- Die memo noem die tyd.", None, "M: memo 3.3 Taal en styl"))
o, a = ms(["Padtekens en bakens", "Woorde wat rigting aandui"], ["Lang beskrywings van jou gevoelens", "Onnodige detail oor jou dag"])
q.append(Q(4, TX, "rigtingaanwysings", "inhoud_van_rigtingaanwysings", ["identifiseer_kenmerke_van_teksvorm"],
           "Kies TWEE dinge wat in rigtingaanwysings gebruik word.", o, a, "multi_select", 2, 3,
           "- Die teks leen hom nie tot onnodige detail nie.\n- Dink aan wat 'n vreemdeling nodig het.", None, "M: memo 3.3 Inhoud"))
o, a = mc("Puntsgewys, onder mekaar en in volsinne", ["In een lang paragraaf sonder punte", "Slegs as 'n lys van straatname", "In die verlede tyd as 'n storie"])
q.append(Q(5, TX, "rigtingaanwysings", "uitleg_van_rigtingaanwysings", ["identifiseer_kenmerke_van_teksvorm"],
           "Hoe moet die aanwysings volgens die opdrag neergeskryf word?", o, a, "multiple_choice", 1, 2,
           "- Die opdrag sê hoe die aanwysings uiteengesit moet word.\n- Dit staan aan die einde van die opdrag.", None, "P: paper 3.3"))
AI = A("3.3", 20, "Jy gee 'n onderwyser van 'n ander skool rigtingaanwysings van die taxi-staanplek tot by jou skool.", "Skryf puntsgewys, onder mekaar en in volsinne|Gee die aanwysings in chronologiese volgorde",
       "1. Formaat: genommer of met kolpunte, onder mekaar en in volsinne.", "2. Inhoud: 'n reeks aanwysings met woorde wat rigting aandui, padtekens en bakens, in volgorde.", "3. Taal: bevelsinne in die teenwoordige tyd, min detail; 80–100 woorde.")
tx(9, "Vraag 3.3: Rigtingaanwysings", "Vraag 3.3: Rigtingaanwysings", 20, 2, 3, q, AI, ["direction", "transactional_writing", "language_register"])

if __name__ == "__main__":
    emit(2025, PAPER, LS)
