'use strict';
// Tourism 2024 Nov — Section B (Q2 map work and tour planning, Q3 foreign exchange): lessons 7–12.
const { mc, ms, mt, ord, fb, ex } = require('../lib');

const U_MTP = 'map_work_tour_planning', U_FX = 'foreign_exchange';
const TM = ['HH ', '[ ]', ' : ', 'MM ', '[ ]'];

module.exports = [
  // ── L07 ── 2.1.1–2.1.4 ─────────────────────────────────────────────────────
  {
    order: 7, name: 'Question 2.1: Time zones, daylight saving and jet fatigue', marks: 12, qspec: '10,11,12', qpages: 3, mspec: '5', mpages: 1,
    covers: 'Question 2.1.1–2.1.4 — time difference with daylight saving time, arrival time and date, adjusting watches, and jet fatigue on a flight that crosses few time zones.',
    tags: ['time_zones', 'daylight_saving_time', 'jet_fatigue'],
    qs: [
      fb('In July, New York is UTC-5 and uses daylight saving time (+1 hour). Johannesburg is UTC+2 and does not use daylight saving time. What is the time difference between the two cities in July, in hours? []',
        ['Hours: ', '[ ]'], ['6'], 'standard_math',
        { unit: U_MTP, topic: 'world_time_zones', subtopic: 'tour_calculation', skill: 'convert_time_zones', diff: 3, w: 2, type: 'calc', clues: '- Apply daylight saving time to New York\'s offset first.\n- Then find the gap between the two offsets.' }),
      fb('A school choir leaves Cape Town (UTC+2) at 22:00 on 14 June. London is UTC+0 but uses daylight saving time (+1 hour) in June. The flight lasts 12 hours. What is the local arrival time in London (24-hour clock)? []',
        TM, ['09|9', '00|0'], 'standard_math',
        { unit: U_MTP, topic: 'world_time_zones', subtopic: 'tour_calculation', skill: 'convert_time_zones', diff: 4, w: 3, type: 'calc', clues: '- Convert the Cape Town departure time to London time first, then add the flying time.' }),
      mc('The choir left Cape Town at 22:00 on 14 June and flew for 12 hours. On which date did it land in London (local time)?',
        '15 June', ['14 June', '16 June', '13 June'],
        { unit: U_MTP, topic: 'world_time_zones', subtopic: 'tour_calculation', skill: 'convert_time_zones', diff: 3, w: 2, type: 'calc' }),
      mc('When the choir lands in London in June, how must the members adjust watches still set to South African time?',
        'Set them one hour back', ['Set them one hour forward', 'Set them two hours back', 'Leave them unchanged'],
        { unit: U_MTP, topic: 'world_time_zones', subtopic: 'tour_scenario_application', skill: 'convert_time_zones', diff: 3, w: 2, type: 'application' }),
      ms('A traveller flies 10 hours overnight from Johannesburg to Stockholm in July, when both cities show the same clock time. She feels tired and stiff on arrival. Select ALL the reasons why this is jet fatigue and not jet lag.',
        ['She crossed almost no time zones', 'Her tiredness comes from the long flight'],
        ['She crossed many time zones', 'Her body clock is far out of step', 'She flew across the date line'],
        { unit: U_MTP, topic: 'jet_lag', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('2.1.1', 2, ['Both cities use daylight saving time during the Olympic Games.', 'Add one hour to each offset.'], ['Write the UTC offset of each city with DST added.', 'Subtract the smaller offset from the larger one.'], ['London: 0 + 1 (DST) = +1.', 'Paris: +1 + 1 (DST) = +2.', 'Time difference = 1 hour.']),
      ex('2.1.2', 4, ['France uses DST, so Paris is at UTC+2.', 'Johannesburg is also UTC+2.'], ['Find the time difference between Johannesburg and Paris.', 'Convert the departure time to Paris time.', 'Add the flying time and check whether the date changes.'], ['Johannesburg: +2. Paris: +1 + 1 (DST) = +2, so the time difference is 0 hours.', 'Local time in Paris at departure = 20:00 + 0 hours = 20:00.', 'Arrival = 20:00 + 11 hours = 07:00.', 'The time passes midnight, so they arrived at 07:00 on 19 July 2024.']),
      ex('2.1.3', 2, ['Compare the time in South Africa with the time in Paris.', 'The memo accepts two answers.'], ['Use the time difference you worked out in 2.1.2.', 'Decide whether the watches must change.'], ['There was no time difference, so the team had no need to adjust their watches.', 'The memo also accepts adjusting the watches one hour forward.']),
      ex('2.1.4', 4, ['The flight lasted 11 hours.', 'It crossed almost no time zones.'], ['Name the condition caused by a long flight that does not cross many time zones.', 'Give the reason by referring to the time zones crossed.'], ['(a) Jet fatigue.', '(b) The flight did not cross many time zones; there is only one time zone between Johannesburg and Paris.']),
    ],
  },

  // ── L08 ── 2.2.1–2.2.3 ───────────────────────────────────────────────────────
  {
    order: 8, name: 'Question 2.2: The Schengen visa', marks: 7, qspec: '12', qpages: 1, mspec: '5', mpages: 1,
    covers: 'Question 2.2.1–2.2.3 — naming the Schengen visa, where to apply for it, and its advantages.',
    tags: ['schengen_visa', 'travel_documents'],
    qs: [
      mc('A South African tourist plans to visit Spain, Portugal and Germany on one trip. Which visa allows travel between all three countries?',
        'A Schengen visa', ['A transit visa', 'A work visa', 'A student visa'],
        { unit: U_MTP, topic: 'travel_documentation', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 1, type: 'application' }),
      ms('Select ALL the advantages of a Schengen visa for a tourist visiting several European countries.',
        ['One application covers all the countries', 'Only one visa fee has to be paid', 'Biometrics are taken only once'],
        ['No passport is needed at the border', 'It allows the tourist to work in Europe'],
        { unit: U_MTP, topic: 'travel_documentation', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
      ord('Put the steps for getting a Schengen visa in a sensible order.',
        ['Decide which country is the main destination', 'Complete the online visa application form', 'Book an appointment at the visa centre', 'Hand in documents and give biometrics'],
        { unit: U_MTP, topic: 'travel_documentation', subtopic: 'tour_process_sequence', skill: 'sequence_tourism_process', diff: 3, w: 2, type: 'ordering' }),
      mt('Match each type of visa to its purpose.',
        [['Schengen visa', 'Travel between several European countries'], ['Transit visa', 'Passing through a country on the way elsewhere'], ['Work visa', 'Taking up a job in another country'], ['Study visa', 'Attending a university abroad']],
        { unit: U_MTP, topic: 'travel_documentation', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 2, type: 'definition' }),
    ],
    subs: [
      ex('2.2.1', 1, ['France, Italy and Spain are all European countries.', 'One visa covers all of them.'], ['Recall the visa that allows travel across many European countries.', 'Name it in full.'], ['A Schengen visa.']),
      ex('2.2.2', 2, ['The team entered Europe in France.', 'France is also where they spent most of their time.'], ['Recall the rule for which country\'s embassy handles a Schengen application.', 'Link it to France.'], ['France was the first country of entry into Europe.', 'France is also where they spent most of their time.']),
      ex('2.2.3', 4, ['Think about time and money saved.', 'One visa covers three countries.'], ['List the benefits of applying once instead of three times.', 'Explain each one in a full sentence.'], ['The visa grants access to all the countries to be visited.', 'It is convenient to apply for one visa for the three countries.', 'It also saves time and money, and biometrics are done only once.']),
    ],
  },

  // ── L09 ── 2.3.1–2.3.3 ───────────────────────────────────────────────────────
  {
    order: 9, name: 'Question 2.3: Safety at the beach and in the city', marks: 13, qspec: '12', qpages: 1, mspec: '6', mpages: 1,
    covers: 'Question 2.3.1–2.3.3 — valuables for the hotel safe, protection from the sun, and safety while exploring a city at night.',
    tags: ['tourist_safety', 'sun_protection'],
    qs: [
      ms('Before going to the beach, select ALL the items a tourist should lock in the hotel-room safe.',
        ['Passport', 'Spare cash and bank cards', 'Expensive jewellery'],
        ['Sunscreen', 'Beach towel'],
        { unit: U_MTP, topic: 'health_and_safety', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 1, type: 'application' }),
      ms('Select ALL the ways a tourist can protect against too much sun at the beach.',
        ['Apply sunscreen with a high SPF', 'Wear a wide-brimmed hat and sunglasses', 'Stay in the shade at midday'],
        ['Swim during the hottest hours', 'Use baby oil to tan faster'],
        { unit: U_MTP, topic: 'health_and_safety', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 2, type: 'application' }),
      mc('Which advice will best keep a group safe while exploring a city at night?',
        'Stay together in well-lit, busy streets', ['Ask strangers for directions when lost', 'Hold your phone out to navigate on foot', 'Take shortcuts through quiet alleys'],
        { unit: U_MTP, topic: 'health_and_safety', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 2, type: 'application' }),
      mt('Match each safety measure to the risk it reduces.',
        [['Hotel-room safe', 'Theft of passports and valuables'], ['High-SPF sunscreen', 'Sunburn'], ['Walking in a group', 'Being targeted by criminals'], ['Drinking enough water', 'Dehydration in the heat']],
        { unit: U_MTP, topic: 'health_and_safety', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 2, w: 2, type: 'application' }),
    ],
    subs: [
      ex('2.3.1', 2, ['Think about items that are valuable or hard to replace.'], ['List items that should not be taken to the beach.', 'Choose two of them.'], ['Official travel documents, e.g. passports and flight tickets.', 'Money (cash or cards); valuables, medication and electronic devices are also accepted.']),
      ex('2.3.2', 7, ['Think about skin, eyes and the hottest hours.', 'One mark is for writing a paragraph in full sentences.'], ['Choose three ways to protect against the sun.', 'Write them as full sentences in one paragraph.'], ['Use sunblock with a high sun protection factor (SPF).', 'Wear protective hats, clothing and sunglasses.', 'Take personal responsibility: limit time in the sun in the hottest part of the day, use umbrellas or shade and stay hydrated.', 'The paragraph mark cannot be tested in the app; write full sentences in the exam.']),
      ex('2.3.3', 4, ['Think about walking around a city after dark.', 'Avoid situations where criminals target tourists.'], ['Suggest two safety measures.', 'Explain each one briefly.'], ['Do not walk alone; stay in groups.', 'Avoid poorly lit or isolated areas; also keep valuables and cell phones out of sight.']),
    ],
  },

  // ── L10 ── 2.4 ───────────────────────────────────────────────────────────────
  {
    order: 10, name: 'Question 2.4: Duty-free allowances and the red channel', marks: 4, qspec: '12', qpages: 1, mspec: '6', mpages: 1,
    covers: 'Question 2.4 — why a returning traveller whose goods exceed the duty-free allowances must use the red channel.',
    tags: ['customs_channels', 'duty_free_goods'],
    qs: [
      ms('Duty-free allowances for a traveller entering South Africa include 2 litres of wine, 20 cigars and 50 mℓ of perfume. Thandi\'s luggage holds the items below. Select ALL the items that exceed the allowance.',
        ['3 litres of wine', '30 cigars'],
        ['50 mℓ of perfume', 'One pair of sneakers', 'A box of chocolates'],
        { unit: U_MTP, topic: 'customs_regulations', subtopic: 'tour_data_interpretation', skill: 'interpret_tourism_stimulus', diff: 3, w: 2, type: 'interpretation' }),
      mc('Thandi\'s goods exceed the duty-free allowance. Which customs channel must she use?',
        'The red channel', ['The green channel', 'The transit channel', 'The crew channel'],
        { unit: U_MTP, topic: 'customs_regulations', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 1, type: 'application' }),
      ord('Put the steps a returning traveller follows after landing at OR Tambo International Airport in order.',
        ['Leave the aircraft', 'Passport control', 'Collect baggage at the carousel', 'Pass through the customs channel'],
        { unit: U_MTP, topic: 'customs_regulations', subtopic: 'tour_process_sequence', skill: 'sequence_tourism_process', diff: 2, w: 2, type: 'ordering' }),
      mc('Why does a traveller go through the red channel?',
        'They carry goods that must be declared', ['They carry only items within the allowance', 'They are only passing through in transit', 'They have no checked baggage with them'],
        { unit: U_MTP, topic: 'customs_regulations', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
    ],
    subs: [
      ex('2.4', 4, ['Compare each item with the duty-free allowances.', 'The red channel is for goods to declare.'], ['Check which items are over the allowance.', 'Explain what that means at customs.'], ['He carried items that had to be declared.', 'The items exceeded the duty-free allowances (e.g. 30 cigars, 3 litres of wine), so he had to pay tax on them.']),
    ],
  },

  // ── L11 ── 3.1–3.3 ───────────────────────────────────────────────────────────
  {
    order: 11, name: 'Question 3.1–3.3: Currency codes and converting currency', marks: 8, qspec: '13', qpages: 1, mspec: '7', mpages: 1,
    covers: 'Question 3.1–3.3 — currency codes for the pound and the euro, converting rand to euro with the bank selling rate, and euro back to rand with the bank buying rate.',
    tags: ['forex_conversion', 'bank_selling_rate', 'bank_buying_rate'],
    qs: [
      mt('Match each currency to its three-letter code.',
        [['British pound', 'GBP'], ['Euro', 'EUR'], ['Australian dollar', 'AUD'], ['Swiss franc', 'CHF']],
        { unit: U_FX, topic: 'currencies_and_codes', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
      mc('Illustrative rates: US dollar BBR R17,60, BSR R17,85. A tourist converts R40 000 into US dollars at a South African bank. Which calculation is correct?',
        'R40 000 ÷ 17,85', ['R40 000 × 17,85', 'R40 000 ÷ 17,60', 'R40 000 × 17,60'],
        { unit: U_FX, topic: 'currency_conversion', subtopic: 'tour_calculation', skill: 'convert_foreign_currency', diff: 3, w: 2, type: 'conversion' }),
      fb('Illustrative rates: US dollar BBR R17,60, BSR R17,85. How many US dollars does a tourist receive for R40 000? Round off to TWO decimal places. []',
        ['USD ', '[ ]'], ['2240.90|2240.9'], 'standard_math',
        { unit: U_FX, topic: 'currency_conversion', subtopic: 'tour_calculation', skill: 'convert_foreign_currency', diff: 3, w: 3, type: 'conversion', clues: '- The bank is selling dollars to the tourist.\n- Divide by the matching rate, then round off.' }),
      fb('Illustrative rates: US dollar BBR R17,60, BSR R17,85. A tourist returns with USD120 and sells it to the bank. How many rand does the tourist receive? []',
        ['R ', '[ ]'], ['2112|2112.00|2112.0'], 'standard_math',
        { unit: U_FX, topic: 'currency_conversion', subtopic: 'tour_calculation', skill: 'convert_foreign_currency', diff: 3, w: 3, type: 'conversion', clues: '- The bank is buying dollars from the tourist.\n- Multiply by the matching rate.' }),
    ],
    subs: [
      ex('3.1.1', 1, ['Currency codes have three letters.', 'The first two letters stand for the country.'], ['Recall the code for the British pound.', 'Write it in capital letters.'], ['GBP.']),
      ex('3.1.2', 1, ['The euro is shared by many countries.', 'Its code starts with EU.'], ['Recall the code for the euro.', 'Write it in capital letters.'], ['EUR.']),
      ex('3.2', 3, ['The team is buying euro from the bank.', 'Use the bank selling rate.'], ['Divide the rand amount by the BSR.', 'Round off to two decimal places.'], ['R50 000 ÷ 20,55 = €2 433,09.']),
      ex('3.3', 3, ['Cheslin is selling euro back to the bank.', 'Use the bank buying rate.'], ['Multiply the euro amount by the BBR.', 'Write the answer in rand to two decimal places.'], ['€75 × 20,52 = R1 539,00.']),
    ],
  },

  // ── L12 ── 3.4.1–3.4.2 ───────────────────────────────────────────────────────
  {
    order: 12, name: 'Question 3.4: GDP and hosting a global event', marks: 6, qspec: '13', qpages: 1, mspec: '7', mpages: 1,
    covers: 'Question 3.4.1–3.4.2 — the meaning of gross domestic product and how hosting the Olympic Games increases a country\'s GDP.',
    tags: ['gross_domestic_product', 'multiplier_effect', 'economic_impact_tourism'],
    qs: [
      mc('What does gross domestic product (GDP) measure?',
        'The total value of goods and services produced in a country in a year', ['The value of a country\'s exports minus the value of its imports in a year', 'The total amount of money that foreign tourists spend in a country', 'The average income earned by each person living in a country per year'],
        { unit: U_FX, topic: 'gross_domestic_product', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 3, w: 2, type: 'definition' }),
      ms('A city hosts a major international sports event. Select ALL the ways this can increase the host country\'s GDP.',
        ['Visitors spend money on tourism services', 'New jobs are created for local people', 'Businesses expand to meet extra demand'],
        ['Local residents travel abroad during the event', 'Foreign teams bring all their own supplies'],
        { unit: U_FX, topic: 'gross_domestic_product', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 2, type: 'application' }),
      ord('Put this chain of tourist spending in order.',
        ['A tourist pays a guesthouse for a night\'s stay', 'The guesthouse pays wages to its cleaning staff', 'The staff buy groceries at a local shop', 'The shop orders more stock from a local farmer'],
        { unit: U_FX, topic: 'gross_domestic_product', subtopic: 'tour_process_sequence', skill: 'sequence_tourism_process', diff: 3, w: 2, type: 'ordering' }),
      mc('Tourist money passes from the guesthouse to its staff, then to a shop and a farmer. What is this called?',
        'The multiplier effect', ['Foreign exchange leakage', 'Seasonal demand', 'Price inflation'],
        { unit: U_FX, topic: 'gross_domestic_product', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
    ],
    subs: [
      ex('3.4.1', 2, ['GDP measures a country\'s production.', 'It is usually measured over one year.'], ['State what is counted.', 'Say over which period.'], ['GDP is a measure of all the goods and services produced domestically over a specific time, usually a year.']),
      ex('3.4.2', 4, ['The Games brought many foreign tourists to France.', 'Think about spending, jobs and businesses.'], ['Explain how tourist spending adds to production.', 'Link it to jobs and the multiplier effect.'], ['The Games brought many tourists, which increased foreign income earnings.', 'Tourists used tourism products and services, which generated income.', 'Demand created jobs and business opportunities and set the multiplier effect in motion.']),
    ],
  },
];
