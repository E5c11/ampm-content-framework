'use strict';
// Tourism 2025 Nov — Section B (Q2 map work and tour planning, Q3 foreign exchange): lessons 8–13.
const { mc, ms, mt, ord, fb, ex } = require('./lib');

const U_MTP = 'map_work_tour_planning', U_FX = 'foreign_exchange';
const TM = ['HH ', '[ ]', ' : ', 'MM ', '[ ]'];

module.exports = [
  // ── L08 ── 2.1.1–2.1.4 ─────────────────────────────────────────────────────
  {
    order: 8, name: 'Question 2.1: Time zones and flight times', marks: 13, qpages: 2, mpages: 1,
    covers: 'Question 2.1.1–2.1.4 — time zones crossed, long-haul flights, arrival time and the time of a live broadcast.',
    tags: ['time_zones', 'flight_time_calculation', 'long_haul_flight'],
    qs: [
      fb('A traveller flies from Johannesburg (UTC+2) to Lima (UTC-5). How many time zones does the traveller cross? []',
        ['Time zones: ', '[ ]'], ['7'], 'standard_math',
        { unit: U_MTP, topic: 'world_time_zones', subtopic: 'tour_calculation', skill: 'convert_time_zones', diff: 2, w: 2, type: 'calc', clues: '- Each time zone is one hour wide.\n- Find the gap between the two UTC offsets.' }),
      ms('Select ALL the statements that describe a long-haul flight.',
        ['It covers a long distance', 'It lasts six hours or longer', 'It often crosses several time zones'],
        ['It always has no layover', 'It only operates inside one country'],
        { unit: U_MTP, topic: 'world_time_zones', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
      fb('Sipho leaves Johannesburg (UTC+2) at 21:00 on Monday. His direct flight to Singapore (UTC+8) lasts 11 hours. What is the local arrival time in Singapore (24-hour clock)? []',
        TM, ['14', '00'], 'standard_math',
        { unit: U_MTP, topic: 'world_time_zones', subtopic: 'tour_calculation', skill: 'convert_time_zones', diff: 4, w: 3, type: 'calc', clues: '- First convert the Johannesburg departure time to Singapore time, then add the flying time.' }),
      mc('Sipho left Johannesburg on Monday at 21:00. On which day does he land in Singapore?',
        'Tuesday', ['Monday', 'Wednesday', 'Sunday'],
        { unit: U_MTP, topic: 'world_time_zones', subtopic: 'tour_calculation', skill: 'convert_time_zones', diff: 3, w: 2, type: 'calc' }),
      fb('A match in Lima starts at 20:00 local time (UTC-5). At what time can viewers in Johannesburg (UTC+2) watch it live (24-hour clock)? []',
        TM, ['03', '00'], 'standard_math',
        { unit: U_MTP, topic: 'world_time_zones', subtopic: 'tour_calculation', skill: 'convert_time_zones', diff: 4, w: 3, type: 'calc', clues: '- Johannesburg is ahead of Lima, so its clock shows a later time.' }),
    ],
    subs: [
      ex('2.1.1', 2, ['Use the time zone map.', 'Count the zones between the two cities.'], ['Read the UTC offsets of Johannesburg and Mexico City.', 'Find the difference between them.'], ['Johannesburg is UTC+2 and Mexico City is UTC-6, so 2 + 6 = 8 time zones are crossed.']),
      ex('2.1.2', 2, ['The flight covers a long distance.', 'The memo wants the number of hours.'], ['Recall the minimum duration of a long-haul flight.'], ['A long-haul flight covers long distances and lasts six hours or longer.']),
      ex('2.1.3', 5, ['Work out the time difference first.', 'Convert the departure time to local time, then add the flying time.'], ['Find the time difference using the offsets.', 'Subtract it from the departure time to get the local time in Mexico.', 'Add the flying time of 18 hours.'], ['1. Mexico City is UTC-6 and Johannesburg is UTC+2, so the difference is 8 hours.', '2. Local time in Mexico at departure is 22:00 - 8 hours = 14:00.', '3. Arrival time is 14:00 + 18 hours = 08:00.']),
      ex('2.1.4', 4, ['Mexico City is behind Johannesburg.', 'Add the time difference to the local time.'], ['Use the same 8-hour time difference.', 'Add it to the Mexico City time.'], ['1. The ceremony is at 20:00 in Mexico City.', '2. Johannesburg is 8 hours ahead, so 20:00 + 8 hours = 04:00.']),
    ],
  },

  // ── L09 ── 2.1.5, 2.2.1, 2.2.2 ───────────────────────────────────────────────
  {
    order: 9, name: 'Question 2.1.5–2.2: Entry documents and jet lag', marks: 8, qpages: 2, mpages: 1,
    covers: 'Question 2.1.5, 2.2.1 and 2.2.2 — documents needed to enter a country and the condition and symptoms caused by crossing time zones.',
    tags: ['travel_documents', 'jet_lag', 'jet_lag_symptoms'],
    qs: [
      mt('Match each travel document to what it does.',
        [['Passport', 'Proves identity and nationality'], ['Visa', 'Gives permission to enter a country for a set purpose'], ['Health certificate', 'Proves that required vaccinations were received'], ['International driving permit', 'Allows driving in a foreign country']],
        { unit: U_MTP, topic: 'travel_documentation', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 1, type: 'application' }),
      mc('After crossing eight time zones, a traveller feels exhausted, cannot sleep at the right times and struggles to concentrate. What is this condition called?',
        'Jet lag', ['Altitude sickness', 'Motion sickness', 'Heat stroke'],
        { unit: U_MTP, topic: 'jet_lag', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
      ms('Select ALL the symptoms that can be caused by jet lag.',
        ['Confusion and disorientation', 'Indigestion', 'Swollen feet'],
        ['Sunburn', 'A rash from insect bites'],
        { unit: U_MTP, topic: 'jet_lag', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the actions that can ease the effects of jet lag.',
        ['Drinking plenty of water', 'Adjusting sleeping times before the trip', 'Spending time in daylight at the destination'],
        ['Drinking coffee and alcohol throughout the flight', 'Staying in a dark room all day after arrival'],
        { unit: U_MTP, topic: 'jet_lag', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('2.1.5', 2, ['Think about what a country checks on entry.', 'Two documents are asked for.'], ['Recall the documents required to enter a foreign country.'], ['A valid passport and a valid visa are required.']),
      ex('2.2.1', 2, ['The condition follows crossing many time zones.', 'It leaves the traveller exhausted.'], ['Recall the name given to this condition.'], ['The condition is jet lag.']),
      ex('2.2.2', 4, ['The memo excludes symptoms that only mean exhaustion.', 'Two other symptoms are needed.'], ['List symptoms linked to jet lag.', 'Choose two that are not just tiredness.'], ['1. Thabo would have felt dehydrated.', '2. He would have had swollen feet.', '3. Confusion, disorientation and indigestion are also accepted.']),
    ],
  },

  // ── L10 ── 2.3 ───────────────────────────────────────────────────────────────
  {
    order: 10, name: 'Question 2.3: Health and safety abroad', marks: 10, qpages: 1, mpages: 1,
    covers: 'Question 2.3.1–2.3.3 — recommended and compulsory vaccinations, tap water, taxi safety and local language.',
    tags: ['vaccinations', 'tourist_safety', 'travel_health'],
    qs: [
      mt('Match each health term to its meaning.',
        [['Compulsory vaccination', 'Legally required to enter certain countries'], ['Recommended vaccination', 'Advised for the destination but not required by law'], ['Travel clinic', 'Gives vaccinations and health advice before a trip'], ['Health certificate', 'Proves that vaccinations were received']],
        { unit: U_MTP, topic: 'health_and_safety', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
      mc('Why should a tourist avoid drinking tap water in a destination where the water is not treated?',
        'It can carry waterborne diseases that cause stomach infections', ['It always tastes too salty for foreign visitors to drink', 'It stains the teeth of tourists who drink it every day of the trip', 'It costs far more than bottled water in most hotels'],
        { unit: U_MTP, topic: 'health_and_safety', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 2, w: 1, type: 'application' }),
      ms('Select ALL the ways a tourist can stay safe when using taxis in a foreign city.',
        ['Use a registered, trackable taxi', 'Check the car and the driver rating', 'Keep valuables out of sight'],
        ['Accept a lift from an unmarked car', 'Leave the hotel key with the driver'],
        { unit: U_MTP, topic: 'health_and_safety', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
      mc('Why is it useful for a tourist to learn a few phrases of the local language before the trip?',
        'They can communicate quickly and clearly in an emergency', ['It replaces the need for travel insurance on a trip', 'It lets them skip the customs check on arrival', 'It guarantees lower prices in every shop and market they visit'],
        { unit: U_MTP, topic: 'health_and_safety', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 2, w: 1, type: 'application' }),
    ],
    subs: [
      ex('2.3.1', 4, ['One type is legal entry requirement.', 'The other is advice based on the destination.'], ['Define compulsory and recommended vaccinations separately.', 'State the difference.'], ['1. A recommended vaccination is advised for travellers based on the destination but is not legally required for entry.', '2. A compulsory vaccination is legally required for entry into certain countries to prevent the spread of disease.']),
      ex('2.3.2', 2, ['Think about what water can carry.'], ['Link tap water to health risks.'], ['Tap water can cause stomach infections because it may carry waterborne diseases.']),
      ex('2.3.3(a)', 2, ['Think about registered and trackable services.'], ['Suggest one safe way to use a taxi.'], ['Use only registered or app-based taxi services that can be tracked.']),
      ex('2.3.3(b)', 2, ['Think about emergencies.'], ['Link language to communication.'], ['A few phrases help Thabo to communicate quickly with locals or authorities in an emergency.']),
    ],
  },

  // ── L11 ── 2.4 ───────────────────────────────────────────────────────────────
  {
    order: 11, name: 'Question 2.4: Returning home through customs', marks: 6, qpages: 1, mpages: 1,
    covers: 'Question 2.4.1–2.4.3 — passport control, duty-free goods and the customs channels.',
    tags: ['passport_control', 'duty_free_goods', 'customs_channels'],
    qs: [
      mc('A South African arrives home on an international flight. At which point must the traveller first present a passport?',
        'Passport control', ['Baggage reclaim', 'The green channel', 'A duty-free shop'],
        { unit: U_MTP, topic: 'travel_documentation', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
      mc('What does duty-free mean for a traveller?',
        'Goods brought in without paying customs duty, within limits', ['Goods that the shop gives away free to every traveller', 'Goods that customs officers keep for their own use', 'Goods that are sold only to citizens and permanent residents'],
        { unit: U_MTP, topic: 'customs_regulations', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
      mt('Match each customs term to its meaning.',
        [['Green channel', 'For travellers with nothing to declare'], ['Red channel', 'For travellers with goods to declare'], ['To declare', 'To tell customs about goods in your luggage'], ['Prohibited goods', 'Items that may not be brought in at all']],
        { unit: U_MTP, topic: 'customs_regulations', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
      ord('Arrange these steps for a returning traveller in the correct order.',
        ['Present the passport at passport control', 'Collect the checked luggage', 'Choose a customs channel', 'Leave the arrivals hall'],
        { unit: U_MTP, topic: 'customs_regulations', subtopic: 'tour_process_sequence', skill: 'sequence_tourism_process', diff: 3, w: 2, type: 'ordering' }),
    ],
    subs: [
      ex('2.4.1', 2, ['It is the first point after arrival.'], ['Think about who checks your passport.'], ['The first point of entry is passport control (immigration).']),
      ex('2.4.2', 2, ['Goods are bought in special shops.'], ['Explain what happens to customs duty.'], ['Duty-free goods do not incur customs duty when they are within permissible limits.']),
      ex('2.4.3', 2, ['Thabo has nothing above his allowance to declare.'], ['Choose the channel for goods within the limits.'], ['He proceeds through the green channel.']),
    ],
  },

  // ── L12 ── 3.1, 3.2 ──────────────────────────────────────────────────────────
  {
    order: 12, name: 'Question 3.1–3.2: Exchange rates and key terms', marks: 5, qpages: 1, mpages: 1,
    covers: 'Question 3.1 and 3.2 — currency codes, fluctuation and the bank buying rate.',
    tags: ['rand_exchange_rates', 'bank_buying_rate', 'bank_selling_rate'],
    qs: [
      fb('What is the three-letter currency code for the Japanese yen? []',
        ['Code: ', '[ ]'], ['jpy'], 'text',
        { unit: U_FX, topic: 'currencies_and_codes', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
      mc('A tourist notices that the number of rand needed for one euro changes from week to week. What is this continuous rise and fall called?',
        'Fluctuation of exchange rates', ['Inflation of consumer prices', 'Rounding off of all exchange rates', 'A fixed exchange rate system'],
        { unit: U_FX, topic: 'tourism_exchange_rates', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
      mt('Match each exchange-rate term to its meaning.',
        [['Bank buying rate', 'The rate at which the bank buys foreign currency from you'], ['Bank selling rate', 'The rate at which the bank sells foreign currency to you'], ['Strong rand', 'One rand buys more foreign currency than before'], ['Weak rand', 'One rand buys less foreign currency than before']],
        { unit: U_FX, topic: 'tourism_exchange_rates', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'definition' }),
      mc('A tourist at a South African bank wants to buy US dollars for a trip. Which rate does the bank use?',
        'The bank selling rate', ['The bank buying rate', 'The average of the two rates', 'A rate chosen by the tourist'],
        { unit: U_FX, topic: 'tourism_exchange_rates', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('3.1', 1, ['Currency codes have three letters.', 'The first two letters usually refer to the country.'], ['Recall the code for the Great British pound.'], ['The currency code for the Great British pound is GBP.']),
      ex('3.2.1', 2, ['Think of the rate going up and down.'], ['Explain the term in your own words.'], ['Fluctuation refers to the continuous rise and fall in the exchange rate, the changing value of one currency against another.']),
      ex('3.2.2', 2, ['The bank is the buyer.'], ['State the rate at which the bank buys foreign currency.'], ['The bank buying rate is the rate at which the bank buys foreign currency.']),
    ],
  },

  // ── L13 ── 3.3, 3.4, 3.5 ─────────────────────────────────────────────────────
  {
    order: 13, name: 'Question 3.3–3.5: Converting currency', marks: 8, qpages: 1, mpages: 1,
    covers: 'Question 3.3, 3.4 and 3.5 — converting rand to foreign currency and back, and comparing forex kiosks.',
    tags: ['forex_conversion', 'forex_kiosks', 'bank_selling_rate'],
    qs: [
      mc('Illustrative rates: euro BBR R18,40, BSR R19,30. A tourist wants to buy euros with R15 000 at the bank. Which calculation gives the number of euros?',
        'R15 000 ÷ 19,30', ['R15 000 × 19,30', 'R15 000 ÷ 18,40', 'R15 000 × 18,40'],
        { unit: U_FX, topic: 'currency_conversion', subtopic: 'tour_calculation', skill: 'convert_foreign_currency', diff: 3, w: 2, type: 'conversion' }),
      fb('Illustrative rates: euro BBR R18,40, BSR R19,30. How many euros does a tourist receive for R15 000? Round off to TWO decimal places. []',
        ['€ ', '[ ]'], ['777.20|777.2'], 'standard_math',
        { unit: U_FX, topic: 'currency_conversion', subtopic: 'tour_calculation', skill: 'convert_foreign_currency', diff: 3, w: 3, type: 'conversion', clues: '- The bank is selling euros to the tourist.\n- Divide by the rate, then round off.' }),
      fb('Illustrative rates: US dollar BBR R16,80, BSR R17,70. A tourist returns with USD350 and sells it to the bank. How many rand does the tourist receive? []',
        ['R ', '[ ]'], ['5880|5880.00'], 'standard_math',
        { unit: U_FX, topic: 'currency_conversion', subtopic: 'tour_calculation', skill: 'convert_foreign_currency', diff: 3, w: 3, type: 'conversion', clues: '- The bank is buying dollars from the tourist.\n- Multiply by the matching rate.' }),
      ms('Select ALL the reasons why a tourist should compare the rates of different forex kiosks.',
        ['To find the best rate on offer', 'To avoid high fees', 'To get more foreign currency per rand'],
        ['To avoid showing a passport', 'To avoid paying for a flight ticket'],
        { unit: U_FX, topic: 'forex_kiosks', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('3.3', 3, ['The tourist is buying pounds.', 'Use the bank selling rate.'], ['Divide the rand amount by the rate.', 'Round off to two decimals.'], ['R20 000 ÷ 23,50 = GBP851,06.']),
      ex('3.4', 3, ['The tourist is selling pounds to the bank.', 'Use the bank buying rate.'], ['Multiply the pounds by the rate.'], ['GBP200 × 22,50 = R4 500,00.']),
      ex('3.5', 2, ['Think about cost and value.'], ['Link comparing rates to getting the best value.'], ['A tourist should compare rates to avoid high fees and unfavourable exchange rates and so get the best value for the money.']),
    ],
  },
];
