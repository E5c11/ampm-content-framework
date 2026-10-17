#!/usr/bin/env python3
"""Afrikaans FAL Nov 2025 Paper 1 generator (7 lessons). Writes scripts/add-afrikaans-fal-2025-nov-p1-q<N>.js.
Helpers + emitter: afr_common.py. Images: temp/images/afr-p1/q<N>/ (uploaded to dev; annexure stems below)."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from afr_common import *  # noqa

PAPER = "nov_p1"
LS = []

# ═══════════ Vraag 1: Leesbegrip — Teks A (1.1–1.16, 24 punte) ═══════════
q = []
m, a = fitb("Woord:", "kanaalnaam")
q.append(Q(1, "leesbegrip", "letterlike_begrip", "voltooi_sin_uit_teks", ["voltooi_sin_met_woord_uit_teks"],
           "VOLTOOI die sin met EEN woord uit die uittreksel. Koekie-Thando is Thando se ... op TikTok.", m, a, "fitb", 1, 3,
           "- Soek die woord wat sê hoe haar bladsy op TikTok genoem word.\n- Skryf net EEN woord.",
           "Thando is 'n sestienjarige leerder van Paarl. Sy bak koekies en wys dit aan duisende volgelinge op TikTok. Haar kanaalnaam is Koekie-Thando.",
           "P1: letterlike begrip (mirror 1.1)"))
o, a = mc("gereël en laat plaasvind",
          ["met baie moeite vervoer", "skielik beëindig", "deur 'n ander groep oorgeneem"])
q.append(Q(2, "leesbegrip", "woordeskat_in_konteks", "idioom_in_konteks", ["verklaar_idioom_in_konteks"],
           "Wat beteken \"op die been gebring\" in hierdie sin?", o, a, "multiple_choice", 2, 2,
           "- Dink aan wat leerders moet doen voordat 'n fees kan begin.\n- Toets elke opsie in die sin.",
           "Die leerders het 'n liefdadigheidsfees op die been gebring om geld vir die dierehawe in te samel.", "P1: idioom (mirror 1.3)"))
o, a = mc("Die aantal volgelinge het baie vinnig gegroei.",
          ["Die kanaal het vir die kykers gevaarlik geword.", "Al die volgelinge het skielik van die kanaal verdwyn.", "Thando se kanaal gaan nou net oor vuurpyle en ruimtevaart."])
q.append(Q(3, "leesbegrip", "figuurlike_taal", "vergelyking", ["verklaar_vergelyking"],
           "Wat beteken hierdie vergelyking?", o, a, "multiple_choice", 2, 2,
           "- Dink aan hoe 'n vuurpyl beweeg.\n- Dit is figuurlike taal: die woorde beteken nie letterlik wat hulle sê nie.",
           "Die aantal volgelinge op Thando se kanaal het die afgelope maand soos 'n vuurpyl gegroei.", "P1: figuurlike taal (mirror 1.4)"))
m, a = match([("Die dierehawe", "versorg honde en katte sonder 'n huis"), ("Die leesklub", "help kinders om beter te leer lees"),
              ("Die saailingprojek", "plant bome in die dorp")])
q.append(Q(4, "leesbegrip", "letterlike_begrip", "pas_inligting_by_omskrywing", ["pas_plek_by_omskrywing"],
           "Pas elke projek by sy doel.", m, a, "match", 1, 3,
           "- Dink aan wat die naam van elke projek vir jou sê.\n- Begin met die een wat jy die mees seker is van.", None,
           "P1: matching KOLOM A/B (mirror 1.10)"))
o, a = mc("Sy help ander met haar sukses, al vra niemand haar nie.",
          ["Sy het baie geld en is daarom by almal baie gewild.", "Sy plaas gereeld nuwe video's vir haar volgelinge.", "Sy kan goed bak en verkoop haar koekies aan almal."])
q.append(Q(5, "leesbegrip", "afleidende_begrip", "motiveer_afleiding", ["motiveer_afleiding"],
           "Waarom kan 'n mens sê Thando is 'n goeie voorbeeld vir ander?", o, a, "multiple_choice", 3, 2,
           "- Soek die antwoord wat sê wat sy met haar sukses doen.\n- 'n Goeie motivering gee 'n rede, nie net 'n feit nie.",
           "Thando koop met haar inkomste van TikTok kos vir die skool se naskoolprogram, al het niemand haar daarvoor gevra nie.",
           "P1: motivering (mirror 1.7/1.14/1.15)"))
AI = [
 ("1.1", 3, ["Lees paragraaf 2 weer en soek die getalle en die naam.", "Skryf EEN of TWEE woorde per blanko."],
  ["Soek elke blanko se antwoord in paragraaf 2", "Skryf net die woorde wat in die teks staan"],
  ["1.1.1: 27 (sewe-en-twintig).", "1.1.2: aanlyn naam (of net naam).", "1.1.3: meer."]),
 ("1.2", 1, ["Kyk na die opskrif: watter woord wys op 'n leier of 'n koning?", "Lees reël 6 tot 10."],
  ["Soek die woord in reël 6 tot 10", "Haal EEN woord aan"], ["1. \"nommer-een-inhoudskepper\" wys dat hy bo almal staan."]),
 ("1.3", 1, ["Lees die sin en die woorde rondom \"op eie stoom\"."], ["Toets elke opsie in die sin", "Kies die een wat by die konteks pas"],
  ["1. D is korrek: Jimmy het nie op ander staatgemaak om sukses te behaal nie.", "2. A, B en C sê iets wat nie in die teks staan nie."]),
 ("1.4", 1, ["\"Kwaai\" beteken hier nie boos nie."], ["Lees die sin in sy konteks", "Kies die opsie wat by die figuurlike betekenis pas"],
  ["1. Dit is nie maklik om sukses te behaal nie."]),
 ("1.5", 1, ["Lees paragraaf 4."], ["Soek die naam van die skool"], ["1. Greenville Christian Academy."]),
 ("1.6", 1, ["Lees paragraaf 4 weer: hoe oud was hy toe hy begin het?"], ["Soek die ouderdom in paragraaf 4"], ["1. Dertien (13) jaar oud."]),
 ("1.7", 1, ["Soek wat Jimmy wil hê mense moet doen as hulle sy video's kyk (paragraaf 5)."], ["Vind die stelling in paragraaf 5", "Gee EEN rede in jou eie woorde"],
  ["1. Hy wil hê mense moet wonder en vrae vra.", "2. Of: hulle moet iets voel, van sy video's hou of sy kanaal volg (enige een)."]),
 ("1.8", 1, ["Lees die eerste sin van paragraaf 6."], ["Soek die wilde video in paragraaf 6"], ["1. Die video waar hy homself lewend laat begrawe het."]),
 ("1.9", 2, ["Lees paragraaf 6 en soek twee punte van kritiek."], ["Soek die twee kritiekpunte", "Skryf hulle in jou eie woorde neer"],
  ["1. Mense is ongelukkig oor die onsensitiewe taal wat hy soms gebruik.", "2. Die plekke waar sy video's gemaak word, is nie altyd veilig nie."]),
 ("1.10", 5, ["Lees paragraaf 7 tot 10 en soek elke plek.", "Pas die plek by die korrekte omskrywing."],
  ["Vind elke plek in die teks", "Kies die omskrywing wat by die projek in die plek pas"],
  ["1.10.1 Die see: D (veg teen besoedeling).", "1.10.2 Jamaika: E (blyplek vir mense wat swaarkry).", "1.10.3 Dorpie in Zambië: F (hoef nie meer kerse te gebruik nie).",
   "1.10.4 Khayelitsha: C (veilige plek vir kinders sonder ouers).", "1.10.5 Oor die hele wêreld: B (herstel skade aan die plantegroei)."]),
 ("1.11", 1, ["Lees paragraaf 10: aan wie of wat is hy in Suid-Afrika verbind?"], ["Soek die verbinding", "Skryf dit in 'n verduidelikende volsin"],
  ["1. Sy verloofde is Suid-Afrikaans, hy het 'n liefdadigheidsprojek hier, of hy help 'n kinderhuis in Khayelitsha (enige een, in 'n volsin)."]),
 ("1.12", 1, ["Soek die jaartal van sy besoek in paragraaf 10."], ["Soek die jaartal"], ["1. In 2022."]),
 ("1.13", 1, ["Lees paragraaf 11."], ["Soek wat hy nog wil doen"],
  ["1. Hy hoop om wêreldvrede te bring, 'n einde te maak aan hongersnood of nog nuwe dinge te leer (enige een)."]),
 ("1.14", 1, ["Wat doen 'n \"good guy\" in vergelyking met mense wat lelik is?"], ["Dink aan hoe Jimmy anders is as ander", "Gee EEN rede uit die teks"],
  ["1. Hy is nie lelik met ander op sosiale media nie.", "2. Of: hy help mense, diere en die natuur met sy eie geld."]),
 ("1.15", 2, ["Kyk na paragraaf 5 en 10: wat doen hulle, en hoe voel hulle oor leer?"], ["Gee een rede oor hulle werk", "Gee een rede oor leer"],
  ["1. Werk: albei is bekende internetpersoonlikhede wat inhoud maak.", "2. Leer: albei hou daarvan om te leer of nuwe dinge te ken."]),
 ("1.16", 1, ["Kyk na die foto en dink aan wat dit wys van sy bekendheid."], ["Beskryf wat die foto wys", "Verbind dit met paragraaf 2"],
  ["1. Die foto wys hoe baie volgelinge of views hy het, of wie hy is."]),
]
LS.append(dict(order=1, name="Vraag 1: Leesbegrip (Teks A)", header="Vraag 1 (1.1–1.16): Leesbegrip — Teks A artikel", marks=24, q=3, m=3,
               supp=[("Teks A", 2, "annexure_teks_a")], tags=["comprehension", "figurative_language", "inferential_reading"], questions=q, ai=AI))

# ═══════════ Vraag 1: Leesbegrip — Teks B (1.17–1.22, 6 punte) ═══════════
q = []
DATA = "Sport by graad 12-leerders (eie opname, 2024): Sokker 40%, Netbal 30%, Atletiek 20%, Swem 10%."
m, a = fitb("Getal:", "20")
q.append(Q(1, "leesbegrip", "grafiese_tekste", "lees_syfer_uit_data", ["lees_syfer_uit_data"],
           "Watter persentasie leerders neem aan atletiek deel? Skryf net die getal.", m, a, "fitb", 1, 1,
           "- Soek atletiek in die lys.\n- Lees die syfer langsaan.", DATA, "P1: lees data (mirror 1.17)"))
m, a = fitb("Woord:", "sokker")
q.append(Q(2, "leesbegrip", "grafiese_tekste", "vergelyk_data", ["identifiseer_hoogste_waarde"],
           "In watter sportsoort neem die meeste leerders deel? Skryf EEN woord.", m, a, "fitb", 1, 1,
           "- Vergelyk al vier syfers.\n- Die grootste syfer wys die gewildste sportsoort.", DATA, "P1: lees data (mirror 1.19)"))
o, a = ms(["Netbal is gewilder as atletiek.", "Swem het die minste deelnemers."],
          ["Sokker het meer as die helfte van die leerders.", "Atletiek is gewilder as netbal."])
q.append(Q(3, "leesbegrip", "grafiese_tekste", "ware_stellings_oor_data", ["kies_ware_stellings_oor_data"],
           "Kies TWEE stellings wat volgens die opname waar is.", o, a, "multi_select", 2, 1,
           "- Toets elke stelling teen die syfers.\n- Twee stellings is waar.", DATA, "P1: interpreteer data (mirror 1.18/1.20)"))
o, a = mc("Die inligting kom uit 2024 en is dalk verouderd.",
          ["Die opname vra net vrae oor een sportsoort, naamlik sokker.", "Die syfers in die opname tel nie op tot 100% nie.", "Dit is 'n opname wat net volwassenes se sport wys."])
q.append(Q(4, "leesbegrip", "grafiese_tekste", "betroubaarheid_van_inligting", ["beoordeel_betroubaarheid_van_bron"],
           "Waarom sal hierdie opname jou nie help om 'n taak oor sportdeelname in 2030 te voltooi nie?", o, a, "multiple_choice", 3, 1,
           "- Kyk na die jaar van die opname.\n- Dink daaraan hoe inligting oor tyd verander.", DATA, "P1: evalueer bron (mirror 1.22)"))
AI = [
 ("1.17", 1, ["Soek huiswerker in die grafiek.", "Kyk na die kolom vir mans."], ["Soek die beroep", "Lees die persentasie vir mans"], ["1. 3%."]),
 ("1.18", 1, ["Kyk na wat die prentjie van 'n tegnikus wys."], ["Dink aan wat 'n tegnikus doen", "Kies die opsie wat by die prentjie pas"],
  ["1. Hulle maak stukkende goed reg."]),
 ("1.19", 1, ["Soek twee balkies waar die persentasies byna gelyk is.", "Vergelyk die vroue- en manskolomme."], ["Vind die beroepe met byna gelyke syfers", "Noem EEN"],
  ["1. Beroepslui (49% en 51%) of verkope en dienste (48% en 52%)."]),
 ("1.20", 1, ["Wat sê die statistiek oor landbou (geskool)?"], ["Dink aan wat die woord \"geskool\" aandui", "Kies die opsie"], ["1. Verder studeer het."]),
 ("1.21", 1, ["Dink aan waarom die werk dalk nie vir vroue aanloklik of beskikbaar is nie."], ["Gee EEN rede met 'n verduideliking"],
  ["1. Dit word tradisioneel as 'n manswerk gesien.", "2. Of: dit is gevaarlik, of daar is nie genoeg opleiding vir vroue nie (enige een)."]),
 ("1.22", 1, ["Kyk na die jaar van die bron."], ["Soek die datum van die statistiek", "Verduidelik waarom dit 'n probleem is"],
  ["1. Die inligting is uit 2018 en is verouderd."]),
]
LS.append(dict(order=2, name="Vraag 1: Leesbegrip (Teks B)", header="Vraag 1 (1.17–1.22): Leesbegrip — Teks B grafiese teks", marks=6, q=2, m=1,
               supp=[("Teks B", 1, "annexure_teks_b")], tags=["comprehension", "graph_interpretation", "interpretation"], questions=q, ai=AI))

# ═══════════ Vraag 2: Opsomming (10 punte) ═══════════
q = []
o, a = ms(["Begin vroeg met leer.", "Maak 'n leerrooster."],
          ["Jou jonger broer het gesê dit is te moeilik.", "Dit was 'n warm Dinsdag."])
q.append(Q(1, "opsomming", "hoofgedagtes_en_wenke", "kies_wenke_uit_teks", ["kies_wenke_uit_teks"],
           "Kies die TWEE sinne wat wenke vir 'n goeie toetsvoorbereiding gee.", o, a, "multi_select", 2, 3,
           "- 'n Wenk sê vir die leser wat hy of sy moet doen.\n- Sinne oor wat iemand anders gesê het of oor die weer is nie wenke nie.",
           "Begin vroeg met leer, want dan het jy tyd om alles te hersien. Jou jonger broer het gesê dit is te moeilik. Maak 'n leerrooster sodat jy weet wat om wanneer te leer.",
           "P1: select tips (mirror Q2, 7 wenke)"))
o, a = mc("Slaap genoeg, want dit help jou om te onthou.",
          ["Probeer om elke aand goed te slaap, want 'n rustige brein onthou beter.", "Gaan laat slaap, want dan hoef jy nie te leer nie.",
           "Slaap net wanneer jy moeg is, want leer is nie belangrik nie."])
q.append(Q(2, "opsomming", "eie_woorde", "herformuleer_in_eie_woorde", ["herformuleer_wenk_in_eie_woorde"],
           "Watter sin gee die wenk in EIE WOORDE weer?", o, a, "multiple_choice", 2, 3,
           "- 'n Direkte aanhaling kry geen punt nie.\n- Die sin moet dieselfde idee uitdruk, maar met ander woorde.",
           "Probeer om elke aand goed te slaap, want 'n rustige brein onthou beter.", "P1: own-words (instruction 1: EIE VOLSINNE)"))
o, a = mc("Verlede jaar het ek gedruip omdat ek laat begin leer het.",
          ["Begin so vroeg moontlik met jou leerwerk vir die toets.", "Maak 'n leerrooster sodat jy jou tyd goed kan indeel.", "Slaap genoeg voor die toets sodat jy kan konsentreer."])
q.append(Q(3, "opsomming", "hoofgedagtes_en_wenke", "herken_oortollige_inligting", ["herken_oortollige_inligting"],
           "Watter sin sal jy NIE in 'n opsomming van die wenke insluit nie?", o, a, "multiple_choice", 2, 3,
           "- Soek die sin wat 'n ervaring vertel, nie 'n wenk gee nie.\n- Wenke is opdragte aan die leser.",
           "Begin vroeg met leer. Ek het verlede jaar my toets gedruip omdat ek te laat begin leer het. Maak 'n leerrooster. Slaap genoeg voor die toets.",
           "P1: select main points vs example"))
items = ["Begin vroeg met leer.", "Maak 'n leerrooster.", "Slaap genoeg.", "Hersien alles weer."]
m, a = order5(items, [2, 0, 3, 1])
q.append(Q(4, "opsomming", "puntvorm_en_volgorde", "rangskik_wenke_volgens_teks", ["rangskik_wenke_in_teksvolgorde"],
           "Rangskik die wenke in die volgorde waarin die teks hulle noem.", m, a, "ordering", 2, 3,
           "- Lees die teks en let op die volgorde van die woorde \"eerste\", \"dan\" en \"laastens\".\n- Die eerste wenk kom ná die titel.",
           "Eerstens moet jy vroeg begin leer. Dan moet jy 'n leerrooster maak. Slaap voor die toets ook genoeg. Laastens moet jy alles weer hersien.",
           "P1: point-form order"))
AI = [
 ("2", 10, ["Lees die hele teks en onderstreep die wenke.", "Skryf sewe wenke in EIE volsinne, in puntvorm en genommer 1 tot 7.", "Bly onder 70 woorde en dui die getal woorde aan."],
  ["Merk die wenke: kalm bly, leestyd benut, tyd bestuur, instruksies volg, vrae versigtig lees, sleutelwoorde uitlig, langer vrae beplan, oor tyd gebruik om na te gaan",
   "Kies sewe", "Herskryf elk in 'n eie volsin sonder om aan te haal", "Tel die woorde"],
  ["1. Sewe feite = 7 punte (een punt per feit); die taal gee nog 3 punte as die opsomming nie 'n direkte aanhaling het nie.",
   "2. Voorbeelde: Bly kalm. Gebruik die leestyd sinvol. Bestuur jou tyd goed. Volg al die instruksies. Lees alle vrae versigtig. Onderstreep sleutelwoorde. Beplan langer vrae.",
   "3. Een direkte aanhaling kos jou die taalpunte."]),
]
LS.append(dict(order=3, name="Vraag 2: Opsomming", header="Vraag 2: Opsomming — Teks C", marks=10, q=1, m=2,
               supp=[("Teks C", 1, "annexure_teks_c")], tags=["summary", "main_points", "paraphrase"], questions=q, ai=AI))

# ═══════════ Vraag 3: Advertensie (10 punte) ═══════════
q = []
m, a = fitb("Woord:", "prys")
q.append(Q(1, "woordeskat", "klankleer_en_spelling", "verbeter_spelfout", ["verbeter_spelfout"],
           "Verbeter die SPELFOUT in die sin. Skryf net die woord wat verkeerd gespel is, korrek.", m, a, "fitb", 1, 2,
           "- Lees elke woord stadig.\n- Een woord het 'n letter te veel.", "Wil jy jou fotovaardighede wys en 'n pryss van R5 000 wen?", "P1: spelling (mirror 3.1)"))
o, a = mc("Hulle trek die leser se aandag en maak hom nuuskierig.",
          ["Hulle gee reeds al die antwoorde op die vrae vir die leser.", "Hulle toets die leser se kennis oor fotografie en kameras.", "Hulle verduidelik stap vir stap hoe om vir die kompetisie in te skryf."])
q.append(Q(2, "kritiese_taalbewustheid", "doel_van_taalgebruik", "doel_van_retoriese_vrae", ["verklaar_doel_van_retoriese_vraag"],
           "Wat is die doel van die twee vrae bo-aan die advertensie?", o, a, "multiple_choice", 2, 2,
           "- Die adverteerder verwag nie dat jy sal antwoord nie.\n- Dink aan wat die vrae met die leser doen.",
           "Is jy lief vir fotografie? Wil jy jou werk aan die wêreld wys?", "P1: rhetorical questions (mirror 3.2)"))
m, a = fitb("Woord:", "veertien")
q.append(Q(3, "woordeskat", "klankleer_en_spelling", "skryf_getal_in_woorde", ["skryf_getal_in_woorde"],
           "Skryf die GETAL in woorde.", m, a, "fitb", 1, 2,
           "- Skryf een woord.\n- Let op die spelling van die tiental.", "Die kompetisie sluit oor (14) dae.", "P1: number in words (mirror 3.6)"))
o, a = ms(["Die kompetisie is die beste in die land!", "Almal sal hou van hierdie kompetisie."],
          ["Inskrywings moet voor 30 Junie ingestuur word.", "Die foto's word deur 'n paneel beoordeel."])
q.append(Q(4, "kritiese_taalbewustheid", "feit_en_mening", "onderskei_feit_van_mening", ["onderskei_feit_van_mening"],
           "Kies TWEE stellings wat MENINGS is.", o, a, "multi_select", 2, 2,
           "- 'n Feit kan bewys word; 'n mening is wat iemand dink.\n- Woorde soos \"beste\" en \"almal\" wys dikwels op 'n mening.",
           "'n Foto kan duisend woorde sê. Die kompetisie is die beste in die land! Inskrywings moet voor 30 Junie ingestuur word. Almal sal hou van hierdie kompetisie. Die foto's word deur 'n paneel beoordeel.",
           "P1: fact vs opinion (mirror 3.3/3.5)"))
AI = [
 ("3.1", 1, ["Vergelyk die spelling van \"voetspoor\" met die woord in die sin."], ["Lees die sin woord vir woord", "Verbeter die woord wat verkeerd gespel is"], ["1. voetspore (nie \"voetspoore\" nie)."]),
 ("3.2", 1, ["Wat doen retoriese vrae met 'n leser?"], ["Dink aan wat die vrae vir die leser doen", "Kies EEN doel"],
  ["1. Hulle trek die leser se aandag of prikkel sy belangstelling.", "2. Of: hulle gee die leser kans om na te dink of maak die advertensie persoonlik."]),
 ("3.3", 1, ["Is dit wat die adverteerder sê, iets wat almal sal glo?"], ["Motiveer waarom dit 'n mening is", "Gee 'n rede, nie net MENING nie"],
  ["1. Nie almal hou van kompetisies nie, of party mense verkies ander dinge om te skep.", "2. Dit is die adverteerder se opinie en is nie bewys nie."]),
 ("3.4", 1, ["Kyk na hoe die pryse uitgelê is."], ["Dink aan wat blokkies met inligting doen", "Gee EEN rede"],
  ["1. Dit beklemtoon die pryse of groepeer die inligting oor elke prys.", "2. Dit trek die leser se oog na die pryse toe."]),
 ("3.5", 1, ["Soek in die advertensie na enige ouderdomsbeperking."], ["Lees die hele advertensie", "Motiveer waarom die stelling ONWAAR is"],
  ["1. Die advertensie noem geen ouderdomsbeperking nie, dus kan almal deelneem."]),
 ("3.6", 1, ["Skryf die getal 20 as 'n woord."], ["Skryf die getal voluit", "Let op die spelling"], ["1. twintig."]),
 ("3.7.1", 1, ["Kyk na die stappe onder die opskrif \"Hoe skryf jy in?\"."], ["Lees die stappe", "Verduidelik waarom dit maklik is"],
  ["1. Die instruksies is duidelik en in stappe verduidelik.", "2. Of: daar is nie baie stappe om te volg nie."]),
 ("3.7.2", 1, ["Hoe moet jy inskryf?"], ["Dink aan wat jy vir die inskrywing nodig het", "Gee EEN rede"],
  ["1. Die inskrywings is elektronies; nie almal het 'n rekenaar of internet nie."]),
 ("3.8", 1, ["Dink aan wat jy nog wil weet voordat jy inskryf."], ["Kyk wat ontbreek", "Noem EEN ding"],
  ["1. Die inskrywingsfooi, kontakbesonderhede, die aanvangsdatum, wanneer die uitslae bekend gemaak word of die lengte van die stuk (enige een)."]),
 ("3.9", 1, ["Kyk na die drie prentjies en hoe elkeen by skryf pas."], ["Kies EEN prentjie", "Gee 'n rede wat by 'n skryfkompetisie pas"],
  ["1. Die hand met die potlood: jy hou 'n potlood vas as jy skryf.", "2. Die veertjie: stories is vroeër met 'n veer geskryf.", "3. Die boek met potlood en uitveër: mense beplan en skryf in boeke."]),
]
LS.append(dict(order=4, name="Vraag 3: Advertensie", header="Vraag 3: Advertensie — Teks D", marks=10, q=2, m=3,
               supp=[("Teks D", 1, "annexure_teks_d")], tags=["advertising", "grammar", "language"], questions=q, ai=AI))

# ═══════════ Vraag 4: Strokiesprent (10 punte) ═══════════
q = []
o, a = mc("Ma sê vir Pieter dat dit Lize se afstandbeheer is.",
          ["Ma sê vir Pieter dat dit is Lize se afstandbeheer.", "Ma sê vir Pieter dat dit Lize se afstandbeheer was.", "Ma sê vir Pieter dit is Lize se afstandbeheer dat."])
q.append(Q(1, "sinstrukture", "direkte_en_indirekte_rede", "stelsin_in_indirekte_rede", ["skryf_in_indirekte_rede"],
           "Watter sin gee Ma se woorde in die INDIREKTE REDE weer? Begin só: Ma sê ...", o, a, "multiple_choice", 3, 2,
           "- In die indirekte rede gebruik jy \"dat\" en die werkwoord skuif na die einde van die bysin.\n- Ma se uitspraak gebeur nou: die tyd verander nie.",
           "Ma sê: \"Pieter, dit is Lize se afstandbeheer.\"", "P1: indirect speech (mirror 4.5)"))
o, a = mc("Dis nie nodig om met hom te baklei nie!",
          ["Dis nie nodig om te met hom baklei nie!", "Dis nie nodig om met hom baklei nie!", "Dis nie nodig met hom te baklei nie!"])
q.append(Q(2, "sinstrukture", "werkwoorde", "infinitief", ["vorm_infinitief"],
           "Watter sin gee die gedeelte tussen hakies in die INFINITIEF?", o, a, "multiple_choice", 3, 1,
           "- Die infinitief gebruik \"om ... te\" voor die werkwoord.\n- Die \"te\" staan reg voor die werkwoord.",
           "Dis nie nodig (met hom baklei) nie!", "P1: infinitive (mirror 4.6)"))
m, a = fitb("Term:", "klanknabootsing|onomatopee")
q.append(Q(3, "visuele_tekste", "strokiesprent", "klanknabootsing", ["identifiseer_klanknabootsing"],
           "Watter stylfiguur is BOEM en KRAAK? Skryf net die term.", m, a, "fitb", 2, 2,
           "- Hierdie woorde boots 'n geluid na.\n- Skryf een woord.", "BOEM! 'n Bord val van die rak en breek met 'n harde KRAAK.",
           "P1: sound words / technique (mirror 4.2.1)"))
o, a = mc("Dit gebeur gereeld tussen broers en susters.",
          ["Broers en susters baklei nooit oor sulke klein dingetjies nie.", "Net hierdie twee kinders in die hele wêreld baklei so.", "Ouers skree altyd op hulle kinders as daar 'n probleem is."])
q.append(Q(4, "leesbegrip", "evaluerende_lees", "geloofwaardigheid", ["verklaar_geloofwaardigheid"],
           "Waarom is hierdie situasie geloofwaardig?", o, a, "multiple_choice", 2, 1,
           "- Dink aan wat in baie huise gebeur.\n- 'n Geloofwaardige situasie klink soos die werklike lewe.",
           "Twee broers baklei oor die afstandbeheer terwyl Ma kombuis toe stap.", "P1: believability (mirror 4.7)"))
items = ["Pieter sit sy hand op die afstandbeheer.", "Lize gryp dit.", "Pieter skree.", "Ma praat rustig."]
m, a = order5(items, [3, 1, 0, 2])
q.append(Q(5, "visuele_tekste", "strokiesprent", "volgorde_van_gebeure", ["rangskik_gebeure_in_strokiesprent"],
           "Rangskik die gebeure in die korrekte volgorde.", m, a, "ordering", 2, 2,
           "- Dink aan wat eerste gebeur voordat die kinders baklei.\n- Die rustige reaksie kom laaste.",
           "Pieter sit sy hand op die afstandbeheer. Lize gryp dit. Pieter skree. Ma kom in en praat rustig.", "P1: order of events (cf. 4.2.2)"))
AI = [
 ("4.1", 1, ["Kyk na Anna se hande en gesig in raampie 2."], ["Kyk na wat Anna doen of sê", "Gee EEN bewys"], ["1. Haar hande is in die lug, of sy skree \"JIPPIE\", of sy glimlag breed."]),
 ("4.2.1", 1, ["Vergelyk die woorde en leestekens in raampie 1 tot 3."], ["Kyk na die grootte en die uitroeptekens", "Noem EEN tegniek"],
  ["1. Daar is al meer uitroeptekens, of die woorde word al groter en meer hoofletters."]),
 ("4.2.2", 2, ["Vergelyk wat Sara in raampie 1 en 3 doen."], ["Beskryf Sara in raampie 1", "Beskryf Sara in raampie 3"],
  ["1. Raampie 1: sy lê en teken, of sy praat hard.", "2. Raampie 3: sy gryp haar goed of sy skree vir Anna."]),
 ("4.3", 1, ["Wat wys 'n bewegingslyn?"], ["Dink aan wat die lyn en die woord GRYP wys", "Kies tussen vinnig en stadig"], ["1. vinnig."]),
 ("4.4.1", 1, ["Kyk na hoe Ma praat en na die grootte van haar woorde."], ["Kyk na Ma se stemtoon", "Gee EEN bewys"], ["1. Sy praat rustig, haar woorde het geen uitroeptekens nie, of sy neem Sara se goed rustig."]),
 ("4.4.2", 1, ["Wat doen 'n kind wat WAAAHHH skree?"], ["Dink aan wat die klank beteken"], ["1. Anna huil of skree baie hard, of sy is hartseer."]),
 ("4.5", 1, ["Begin met \"Ma sê\" en gebruik \"dat\"."], ["Verander na indirekte rede", "Let op voornaamwoorde en woordorde"], ["1. Ma sê vir Anna dat dit Sara se goed is."]),
 ("4.6", 1, ["Gebruik \"om ... te\" en skryf die hele sin."], ["Maak die infinitief", "Skryf die hele sin"], ["1. Dis nie nodig om met haar te raas nie."]),
 ("4.7", 1, ["Dink aan jou eie huis of aan hoe susters en broers is."], ["Dink aan die gewone lewe", "Gee EEN rede"], ["1. Dit gebeur gereeld tussen susters of broers dat hulle baklei oor goed."]),
]
LS.append(dict(order=5, name="Vraag 4: Strokiesprent", header="Vraag 4: Strokiesprent — Teks E", marks=10, q=3, m=3,
               supp=[("Teks E", 1, "annexure_teks_e")], tags=["cartoons", "direct_and_indirect_speech", "grammar"], questions=q, ai=AI))

# ═══════════ Vraag 5.1: Artikel — gesplit in drie lesse (14 punte; DESIGN-UNI-14) ═══════════
AI_ALL = [
 ("5.1.1", 1, ["Wie doen die werk van 'n inwoon?"], ["Dink aan die agtervoegsel -er", "Let op die spelling"], ["1. inwoner."]),
 ("5.1.2", 1, ["Een woord vir \"elke jaar\"."], ["Dink aan 'n bywoord van tyd", "Skryf een woord"], ["1. jaarliks."]),
 ("5.1.3", 1, ["Gebruik die verlede tyd met \"het\" en die voltooide deelwoord."], ["Verander die werkwoord", "Hou die woordorde korrek"], ["1. In 2024 het hy drie ton hondekos deur die Kersliggie-projek ontvang."]),
 ("5.1.4", 1, ["Die trappe van vergelyking van \"baie\" is onreëlmatig."], ["Dink aan die oortreffende trap", "Skryf een woord"], ["1. meeste."]),
 ("5.1.5", 1, ["Wie se gesin is dit?"], ["Kyk na die onderwerp \"Hy\"", "Kies die voornaamwoord wat by hom pas"], ["1. sy."]),
 ("5.1.6", 1, ["Hoe maak jy meer as een skenking?"], ["Voeg die meervoudsuitgang by"], ["1. skenkings."]),
 ("5.1.7", 1, ["Voeg die twee woorde saam en let op die verbindingsklank."], ["Plak aflewering en wa saam", "Voeg die verbindingsklank by"], ["1. afleweringswa."]),
 ("5.1.8", 1, ["Onthou: tyd, wyse, plek."], ["Rangskik die bepalings", "Skryf die hele sin"], ["1. Luhan het die kos vroeg die oggend vinnig op die perseel afgelaai."]),
 ("5.1.9", 1, ["Wat sê mens met \"trots\"?"], ["Dink aan die vaste verbinding", "Skryf een woord"], ["1. op."]),
 ("5.1.10", 1, ["Die woord staan voor \"maand\" en moet verbuig word."], ["Voeg die buigings-e by"], ["1. moeilike."]),
 ("5.1.11", 1, ["Die persoon of ding wat iets doen, word die onderwerp."], ["Plaas die doener voor in die sin", "Gebruik \"het\" met die voltooide deelwoord"], ["1. Die gemeenskap se bydrae het die projek moontlik gemaak."]),
 ("5.1.12", 1, ["Verdeel die woord in klankgroepe."], ["Skei die woord volgens klanke", "Gebruik koppeltekens"], ["1. dank-baar-heid."]),
 ("5.1.13", 1, ["Wat staan \"gr.\" voluit?"], ["Skryf die woord voluit"], ["1. graad."]),
 ("5.1.14", 1, ["\"Daarom\" is 'n voegwoord wat die woordorde verander."], ["Verbind die twee sinne", "Plaas die werkwoord reg ná \"daarom\""], ["1. ODIN ontvang geen staatshulp nie; daarom is hulle afhanklik van die publiek se hulp."]),
]
def ai_slice(a, b):
    return [e for e in AI_ALL if a <= int(e[0].split(".")[-1]) <= b]

# ── 5.1.1–5.1.5 ──
q = []
m, a = fitb("Woord:", "skrywer")
q.append(Q(1, "sinstrukture", "selfstandige_naamwoorde", "selfstandige_naamwoord_van_werkwoord", ["vorm_selfstandige_naamwoord"],
           "Vorm 'n SELFSTANDIGE NAAMWOORD van die werkwoord tussen hakies.", m, a, "fitb", 2, 1,
           "- Die persoon wat die werkwoord doen, kry 'n -er-einde.\n- Let op die spelling van die stam.", "Pieter is 'n gewilde (skryf) van kinderstories.",
           "P1: noun from verb (mirror 5.1.1)"))
m, a = fitb("Woord:", "maandeliks")
q.append(Q(2, "woordeskat", "betekenisleer", "een_woord_vir_omskrywing", ["gee_een_woord_vir_omskrywing"],
           "Gee EEN WOORD vir die woorde tussen hakies.", m, a, "fitb", 2, 1,
           "- Dink aan 'n bywoord van tyd wat uit een woord bestaan.\n- Dit eindig op -liks.", "Die biblioteek word (elke maand) skoongemaak.",
           "P1: one word for a phrase (mirror 5.1.2)"))
o, a = mc("Die leerders het die pryse by die skool ontvang.",
          ["Die leerders ontvang die pryse by die skool gister.", "Die leerders sal die pryse by die skool ontvang.", "Die leerders het die pryse by die skool ontvang het."])
q.append(Q(3, "sinstrukture", "werkwoorde", "verlede_tyd", ["kies_sin_in_verlede_tyd"],
           "Watter sin is die korrekte VERLEDE TYD van: Die leerders ontvang die pryse by die skool?", o, a, "multiple_choice", 2, 1,
           "- Die verlede tyd gebruik \"het\" voor die werkwoord.\n- Die werkwoord self kom aan die einde van die sin.", None,
           "P1: past tense (mirror 5.1.3)"))
m, a = fitb("Woord:", "beste")
q.append(Q(4, "sinstrukture", "byvoeglike_naamwoorde", "trappe_van_vergelyking", ["vorm_oortreffende_trap"],
           "Gee die OORTREFFENDE TRAP van die woord tussen hakies.", m, a, "fitb", 2, 1,
           "- Die woord \"goed\" volg 'n onreëlmatige patroon.\n- Skryf net die oortreffende trap.", "Dit is die (goed) kos wat ons nog ooit geproe het.",
           "P1: superlative (mirror 5.1.4)"))
o, a = ms(["Thabo het sy fiets verloor.", "Annelie het haar tas by die huis gelos."],
          ["Thabo het haar fiets verloor.", "Annelie het sy tas by die huis gelos."])
q.append(Q(5, "sinstrukture", "selfstandige_naamwoorde", "besitlike_voornaamwoord", ["kies_korrekte_voornaamwoord"],
           "Kies TWEE sinne waarin die VOORNAAMWOORD korrek gebruik is.", o, a, "multi_select", 2, 1,
           "- Die voornaamwoord moet by die geslag van die persoon pas.\n- Twee sinne is korrek.", None,
           "P1: pronoun (mirror 5.1.5)"))
LS.append(dict(order=6, name="Vraag 5.1: Artikel (5.1.1–5.1.5)", header="Vraag 5.1.1–5.1.5: Artikel — Teks F", marks=5, q=3, m=1, sfx="v2_",
               supp=[("Teks F", 1, "annexure_teks_f_v2")], tags=["grammar", "editing", "sentence_construction"], questions=q, ai=ai_slice(1, 5)))

# ── 5.1.6–5.1.10 ──
q = []
m, a = fitb("Woord:", "kliënte")
q.append(Q(1, "sinstrukture", "selfstandige_naamwoorde", "meervoud", ["vorm_meervoud"],
           "Gee die MEERVOUD van die woord tussen hakies.", m, a, "fitb", 2, 1,
           "- Die meervoud kry 'n -e-einde.\n- Onthou die tekens op die e wat die uitspraak aandui.", "Die winkel het gister baie (kliënt) gehad.",
           "P1: plural (mirror 5.1.6)"))
m, a = fitb("Woord:", "verjaarsdag")
q.append(Q(2, "woordeskat", "woordvorming", "samestelling_met_verbindingsklank", ["vorm_samestelling"],
           "Gee die korrekte SAMESTELLING van die woorde tussen hakies.", m, a, "fitb", 3, 1,
           "- Plak die twee woorde aanmekaar tot een woord.\n- Dink aan die verbindingsklank wat tussen die twee dele hoort.", "Ons vier Pa se (verjaar + dag) met 'n braai.",
           "P1: compound with linking sound (mirror 5.1.7)"))
items = ["gistermiddag", "stil", "in die biblioteek"]
m, a = order5(items, [1, 2, 0])
q.append(Q(3, "sinstrukture", "woordorde", "tyd_wyse_plek", ["rangskik_bepalings_in_woordorde"],
           "Rangskik die dele in die korrekte WOORDORDE (tyd, wyse, plek) om die sin te voltooi: Hulle het ... gewerk.", m, a, "ordering", 3, 1,
           "- Onthou die volgorde: eers WANNEER, dan HOE, dan WAAR.\n- Die werkwoord \"gewerk\" kom heel laaste.", "Hulle het gistermiddag stil in die biblioteek gewerk.",
           "P1: word order (mirror 5.1.8)"))
m, a = fitb("Woord:", "vir")
q.append(Q(4, "sinstrukture", "woordorde", "voorsetsel_in_vaste_verbinding", ["vul_voorsetsel_in"],
           "Vul die ontbrekende VOORSETSEL in.", m, a, "fitb", 2, 1,
           "- Dink aan die voorsetsel wat gewoonlik na \"bang\" kom.\n- Skryf een woord.", "Sy is baie bang (...) die donker.",
           "P1: preposition (mirror 5.1.9)"))
o, a = mc("Dit is 'n moeilike vraag.", ["Dit is 'n moeilik vraag.", "Dit is 'n moeilikke vraag.", "Dit is 'n moeilikes vraag."])
q.append(Q(5, "sinstrukture", "byvoeglike_naamwoorde", "verboe_vorm", ["kies_korrekte_verboe_vorm"],
           "Watter sin gebruik die KORREKTE VORM van die woord \"moeilik\"?", o, a, "multiple_choice", 2, 1,
           "- 'n Byvoeglike naamwoord voor 'n selfstandige naamwoord kry gewoonlik 'n -e.\n- Let op hoeveel letters bygevoeg word.", None,
           "P1: inflected form (mirror 5.1.10)"))
LS.append(dict(order=7, name="Vraag 5.1: Artikel (5.1.6–5.1.10)", header="Vraag 5.1.6–5.1.10: Artikel — Teks F", marks=5, q=2, m=2, sfx="v2_",
               supp=[("Teks F", 1, "annexure_teks_f_v2")], tags=["grammar", "editing", "sentence_construction"], questions=q, ai=ai_slice(6, 10)))

# ── 5.1.11–5.1.14 ──
q = []
o, a = mc("Die bakker het die brood gebak.",
          ["Die brood het die bakker gebak.", "Die bakker is die brood gebak.", "Die bakker bak die brood."])
q.append(Q(1, "sinstrukture", "aktief_en_passief", "lydende_na_bedrywende_vorm", ["skryf_in_bedrywende_vorm"],
           "Watter sin is die BEDRYWENDE VORM van die gegewe sin?", o, a, "multiple_choice", 3, 1,
           "- In die bedrywende vorm is die persoon wat iets doen die onderwerp.\n- Die tyd van die sin verander nie.", "Die brood is deur die bakker gebak.",
           "P1: active form (mirror 5.1.11)"))
m, a = fitb("Woord:", "va-kan-sie")
q.append(Q(2, "woordeskat", "klankleer_en_spelling", "lettergrepe", ["verdeel_woord_in_lettergrepe"],
           "Verdeel die woord tussen hakies korrek in LETTERGREPE. Skei die lettergrepe met koppeltekens.", m, a, "fitb", 2, 1,
           "- Klap die woord: elke klap is een lettergreep.\n- Skryf al die lettergrepe met 'n koppelteken tussen elk.", "Ons gaan in die (vakansie) see toe.",
           "P1: syllables (mirror 5.1.12)"))
m, a = match([("mev.", "mevrou"), ("dr.", "dokter"), ("mnr.", "meneer")])
q.append(Q(3, "woordeskat", "klankleer_en_spelling", "afkortings", ["skryf_afkorting_voluit"],
           "Pas elke AFKORTING by die woord wat dit voluit beteken.", m, a, "match", 1, 1,
           "- Dink aan hoe jy iemand met sy of haar titel aanspreek.\n- Begin met die een wat jy die mees seker is van.", None,
           "P1: abbreviation (mirror 5.1.13)"))
o, a = mc("Dit het gereën; daarom het ons binne gebly.",
          ["Dit het gereën; daarom ons het binne gebly.", "Dit het gereën daarom; het ons binne gebly.", "Dit het gereën; ons daarom het binne gebly."])
q.append(Q(4, "sinstrukture", "woordorde", "voegwoordelike_bywoord", ["verbind_sinne_met_voegwoord"],
           "Watter sin verbind \"Dit het gereën. Ons het binne gebly.\" korrek met die voegwoord \"daarom\"?", o, a, "multiple_choice", 3, 1,
           "- Na \"daarom\" kom die werkwoord voor die onderwerp.\n- Die twee sinne word met 'n kommapunt of komma verbind.", None,
           "P1: conjunction/word order (mirror 5.1.14)"))
LS.append(dict(order=8, name="Vraag 5.1: Artikel (5.1.11–5.1.14)", header="Vraag 5.1.11–5.1.14: Artikel — Teks F", marks=4, q=2, m=2,
               supp=[("Teks F", 1, "annexure_teks_f")], tags=["grammar", "editing", "sentence_construction"], questions=q, ai=ai_slice(11, 14)))

# ═══════════ Vraag 5.2: Prent (6 punte) ═══════════
q = []
o, a = mc("Skryf op 'n skoon blad papier.",
          ["Die groen blad het in die wind gewaai.", "Die blad van die plant is groen.", "Die kind het 'n blad aan die tak gesien."])
q.append(Q(1, "woordeskat", "betekenisleer", "homonieme", ["gebruik_homoniem_in_sin"],
           "In watter sin het \"blad\" 'n ANDER betekenis as in: Die blad het van die boom geval?", o, a, "multiple_choice", 2, 1,
           "- Een betekenis is die deel van 'n plant.\n- Soek die sin waar \"blad\" iets anders is.", None, "P1: homonym (mirror 5.2.1)"))
m, a = fitb("Woord:", "hondjie")
q.append(Q(2, "sinstrukture", "selfstandige_naamwoorde", "verkleinwoord", ["vorm_verkleinwoord"],
           "Gee die VERKLEINWOORD van die woord tussen hakies.", m, a, "fitb", 2, 1,
           "- Die verkleinwoord kry die agtervoegsel -jie.\n- Let op die lettergroep voor die agtervoegsel.", "Daar is 'n (hond) langs die pad.", "P1: diminutive (mirror 5.2.3)"))
m, a = fitb("Woord:", "yskoud|bitterkoud|vrieskoud")
q.append(Q(3, "sinstrukture", "byvoeglike_naamwoorde", "intensiewe_vorm", ["vorm_intensiewe_vorm"],
           "Gee die INTENSIEWE VORM van die woord tussen hakies.", m, a, "fitb", 2, 1,
           "- 'n Intensiewe vorm is een woord wat die betekenis versterk.\n- Plak 'n versterkende woord voor die byvoeglike naamwoord.", "Die water in die dam is (koud).",
           "P1: intensive form (mirror 5.2.4)"))
m, a = fitb("Woord:", "koekies")
q.append(Q(4, "woordeskat", "betekenisleer", "regte_afrikaanse_woord", ["gee_korrekte_afrikaans"],
           "Gee die KORREKTE AFRIKAANS vir die woord tussen hakies.", m, a, "fitb", 2, 1,
           "- Skryf die Afrikaanse woord, nie die Engelse een nie.\n- Dink aan wat jy by 'n teepartytjie eet.", "Die kinders eet graag (cookies).", "P1: correct Afrikaans (mirror 5.2.5)"))
o, a = ms(["Niemand hou van sjokolade nie.", "Nie almal hou van sjokolade nie."],
          ["Almal hou van sjokolade nie.", "Niemand hou van sjokolade."])
q.append(Q(5, "sinstrukture", "ontkenning", "dubbele_ontkenning", ["kies_korrekte_ontkenning"],
           "Kies TWEE korrekte ONTKENNINGS van die sin: Almal hou van sjokolade.", o, a, "multi_select", 3, 1,
           "- Afrikaans gebruik gewoonlik twee \"nie\"s in 'n ontkenning.\n- Maak seker dat elke sin 'n ontkenning én 'n slot-\"nie\" het.", None,
           "P1: negation (mirror 5.2.6)"))
AI = [
 ("5.2.1", 1, ["\"Vlieg\" kan 'n insek of 'n werkwoord wees."], ["Dink aan 'n ander betekenis van die woord", "Skryf 'n sin wat die betekenis duidelik maak"],
  ["1. Daar sit 'n vlieg op die tafel.", "2. Of: Hy vlieg by die deur uit (enige sin met 'n ander betekenis)."]),
 ("5.2.2", 1, ["Wat doen mens met 'n foto: vat of neem?"], ["Dink aan die korrekte werkwoord by \"foto\"", "Kies een"], ["1. neem."]),
 ("5.2.3", 1, ["Voeg 'n agtervoegsel by wat \"klein\" aandui."], ["Vorm die verkleinwoord", "Let op die spelling"], ["1. blommetjie."]),
 ("5.2.4", 1, ["Plak 'n versterkende deel voor \"nat\"."], ["Dink aan wat nog natter as nat is", "Skryf een woord"], ["1. papnat, sopnat, waternat, druipnat of deurnat (enige een)."]),
 ("5.2.5", 1, ["Dink aan die Afrikaanse woord vir 'n boodskap."], ["Vervang die Engelse woord met Afrikaans"], ["1. boodskap."]),
 ("5.2.6", 1, ["Gebruik \"nie ... nie\" of \"niemand\"."], ["Maak die sin ontkennend", "Maak seker die slot-\"nie\" is daar"],
  ["1. Niemand is bang vir die haai nie.", "2. Of: Nie almal is bang vir die haai nie."]),
]
LS.append(dict(order=9, name="Vraag 5.2: Prent", header="Vraag 5.2: Prent — Teks G", marks=6, q=2, m=1,
               supp=[("Teks G", 1, "annexure_teks_g")], tags=["grammar", "homophones", "language"], questions=q, ai=AI))

if __name__ == "__main__":
    emit(2025, PAPER, LS)
