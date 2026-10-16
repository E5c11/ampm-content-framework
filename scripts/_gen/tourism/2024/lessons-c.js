'use strict';
// Tourism 2024 Nov — Sections C–E (Q4–Q10): lessons 13–24.
const { mc, ms, mt, ord, fb, ex } = require('../lib');

const U_TS = 'tourism_sectors', U_TA = 'tourist_attractions', U_SR = 'sustainable_responsible_tourism';
const U_DRI = 'domestic_regional_international_tourism', U_CH = 'culture_heritage_tourism', U_CC = 'communication_customer_care', U_M = 'tourism_marketing';

module.exports = [
  // ── L13 ── 4.1.1–4.1.4 ───────────────────────────────────────────────────────
  {
    order: 13, name: 'Question 4.1: Four world icons', marks: 21, qspec: '14', qpages: 1, mspec: '8,9', mpages: 2,
    covers: 'Question 4.1.1–4.1.4 — identifying Christ the Redeemer, the Great Pyramids of Giza, Uluru and the Sydney Opera House, their countries, the icon linked to music, facts about the African icon, and sacred sites.',
    tags: ['tourist_icons', 'icon_location'],
    qs: [
      mt('Match each world icon to the country where it is found.',
        [['Christ the Redeemer', 'Brazil'], ['Uluru (Ayers Rock)', 'Australia'], ['Great Pyramids of Giza', 'Egypt'], ['Taj Mahal', 'India']],
        { unit: U_TA, topic: 'world_icons', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 2, type: 'application' }),
      mc('A performing-arts centre on a harbour has a roof of white, sail-shaped shells and hosts operas and concerts. Which icon is this?',
        'Sydney Opera House', ['Burj Khalifa', 'Eiffel Tower', 'Colosseum'],
        { unit: U_TA, topic: 'world_icons', subtopic: 'tour_data_interpretation', skill: 'interpret_tourism_stimulus', diff: 2, w: 1, type: 'interpretation' }),
      ms('Select ALL the correct facts about the Great Pyramids of Giza.',
        ['They were built as tombs for pharaohs', 'Pharaohs were buried with valuables'],
        ['They were palaces for living kings', 'They were carved from one red rock', 'They stand on an island in the Nile'],
        { unit: U_TA, topic: 'world_icons', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the icons that tourists interested in sacred or religious sites would visit.',
        ['Uluru (Ayers Rock)', 'Christ the Redeemer', 'Great Pyramids of Giza'],
        ['Sydney Opera House', 'Niagara Falls'],
        { unit: U_TA, topic: 'world_icons', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('4.1.1', 7, ['Look at each of the four puzzle pictures.', 'Give the full names of the icons.'], ['(a) Name the four icons in full.', '(b) Name the three countries; two icons share one country.'], ['(a) The Statue of Christ the Redeemer, the Great Pyramids of Giza, Ayers Rock/Uluru and the Sydney Opera House.', '(b) Brazil, Egypt and Australia (Uluru and the Sydney Opera House are both in Australia).']),
      ex('4.1.2', 4, ['One of the icons is a performing-arts venue.'], ['Identify the icon linked to music.', 'Give a reason based on what happens there.'], ['(a) The Sydney Opera House.', '(b) Operas and music concerts and shows are held in the building.']),
      ex('4.1.3', 6, ['The African icon is in Egypt.', 'Think about location, age and purpose.'], ['Identify the icon in Africa.', 'Write three facts about its location, history or purpose.'], ['The Great Pyramids of Giza are on the outskirts of Giza, Egypt.', 'They were built as tombs for the pharaohs, who were buried with their valuable possessions.', 'They were built more than 1 200 years before the rule of King Tutankhamen; the Great Pyramid is about 147 m tall.']),
      ex('4.1.4', 4, ['Some icons have spiritual meaning for people.', 'Any two icons may be used.'], ['Choose two icons with religious or sacred meaning.', 'Give a reason for each.'], ['The Statue of Christ the Redeemer is a symbolic protector of the people of Rio de Janeiro.', 'Uluru/Ayers Rock is a sacred place with spiritual meaning for the indigenous people.', 'The Great Pyramids of Giza are burial sites of pharaohs who were revered as gods.']),
    ],
  },

  // ── L14 ── 4.2.1–4.2.2 ───────────────────────────────────────────────────────
  {
    order: 14, name: 'Question 4.2: How Italy\'s icons were built', marks: 9, qspec: '15', qpages: 1, mspec: '9', mpages: 1,
    covers: 'Question 4.2.1–4.2.2 — identifying the Colosseum, the Leaning Tower of Pisa and Venice, and how each was designed and built.',
    tags: ['tourist_icons', 'icon_design'],
    qs: [
      mt('Match each icon to a fact about how it was designed or built.',
        [['Colosseum', 'Amphitheatre for up to 80 000 spectators'], ['Leaning Tower of Pisa', 'Tilts because of soft, unstable soil'], ['Venice', 'City on wooden poles, linked by canals'], ['Eiffel Tower', 'Iron tower built for a world fair']],
        { unit: U_TA, topic: 'world_icons', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
      mc('Why does the Leaning Tower of Pisa lean?',
        'It was built on soft, unstable soil', ['An earthquake damaged its foundations', 'It was designed to tilt on purpose', 'Strong sea winds pushed it over time'],
        { unit: U_TA, topic: 'world_icons', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 2, w: 1, type: 'application' }),
      ms('Select ALL the facts about how Venice was built.',
        ['Wooden poles were driven deep into the ground', 'Canals and bridges link the buildings'],
        ['It was built on a high mountain plateau', 'Its buildings stand on solid granite rock', 'It was carved out of one large rock face'],
        { unit: U_TA, topic: 'world_icons', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 3, w: 2, type: 'application' }),
      mc('The Colosseum, the Leaning Tower of Pisa and the canals of Venice are all in which country?',
        'Italy', ['Spain', 'Greece', 'France'],
        { unit: U_TA, topic: 'world_icons', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 1, w: 1, type: 'definition' }),
    ],
    subs: [
      ex('4.2.1', 3, ['All three icons are in Italy.', 'Look at the shape of each picture.'], ['Identify the ancient amphitheatre, the tilted tower and the city on water.', 'Match each to its label.'], ['A – Colosseum.', 'B – Leaning Tower of Pisa.', 'C – Venice.']),
      ex('4.2.2', 6, ['Think about the shape and building materials of each icon.', 'Give one fact for each icon.'], ['Describe one design or building fact for each icon.', 'Write a full sentence for each.'], ['Colosseum: an ancient amphitheatre with many levels and arches that seated 50 000 to 80 000 spectators.', 'Leaning Tower of Pisa: it tilts because it was built on unstable soil; it is mainly white marble.', 'Venice: a city built on water on long wooden poles driven into hard clay, with canals and bridges linking the buildings.']),
    ],
  },

  // ── L15 ── 5.1–5.3 ───────────────────────────────────────────────────────────
  {
    order: 15, name: 'Question 5: World Heritage Sites in the Western Cape', marks: 10, qspec: '16', qpages: 1, mspec: '10', mpages: 1,
    covers: 'Question 5.1–5.3 — Robben Island and the Cape Floral Region Protected Areas, why Robben Island attracts history tourists, and the role of UNESCO.',
    tags: ['world_heritage_sites', 'unesco_role', 'south_african_heritage'],
    qs: [
      mc('Which TWO World Heritage Sites are found in the Western Cape?',
        'Robben Island and the Cape Floral Region', ['Robben Island and the Vredefort Dome', 'iSimangaliso and the Cape Floral Region', 'Mapungubwe and the Cape Floral Region'],
        { unit: U_CH, topic: 'south_african_world_heritage', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 2, type: 'definition' }),
      ms('Select ALL the reasons why Robben Island attracts tourists interested in South African history.',
        ['Nelson Mandela was imprisoned there', 'It held political prisoners under apartheid'],
        ['It is the site of a huge meteorite crater', 'It has the oldest human fossils on Earth', 'It is famous for ancient San rock art'],
        { unit: U_CH, topic: 'south_african_world_heritage', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 2, w: 2, type: 'application' }),
      mt('Match each organisation to its role.',
        [['UNESCO', 'Declares World Heritage Sites'], ['SAHRA', 'Protects heritage resources in South Africa'], ['TGCSA', 'Awards star grading to accommodation'], ['SATourism', 'Markets South Africa internationally']],
        { unit: U_CH, topic: 'unesco_role', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
      mc('The Cape Floral Region Protected Areas are listed for their rich plant life. What kind of World Heritage Site is this?',
        'A natural site', ['A cultural site', 'A mixed site', 'A man-made site'],
        { unit: U_CH, topic: 'world_heritage_sites', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 1, type: 'application' }),
    ],
    subs: [
      ex('5.1', 4, ['A is an island off Cape Town.', 'B covers protected areas of unique plants.'], ['Name the island site.', 'Name the natural site in full.'], ['A: Robben Island.', 'B: Cape Floral Region Protected Areas.']),
      ex('5.2', 4, ['The cultural site is Robben Island.', 'Think about apartheid and political prisoners.'], ['Link the site to South African history.', 'Give two reasons.'], ['Nelson Mandela was imprisoned on Robben Island as a political prisoner.', 'It served as South Africa\'s maximum-security political prison from the 1960s to 1991.']),
      ex('5.3', 2, ['UNESCO is the United Nations body for culture and heritage.'], ['Explain what UNESCO does for sites of outstanding value.', 'Give one role.'], ['UNESCO encourages the identification of global sites of outstanding value to humanity; it also declares, protects and monitors them.']),
    ],
  },

  // ── L16 ── 6.1.1–6.2.2 ───────────────────────────────────────────────────────
  {
    order: 16, name: 'Question 6: Marketing South Africa abroad', marks: 10, qspec: '17,18', qpages: 2, mspec: '11', mpages: 1,
    covers: 'Question 6.1–6.2 — a sports star as SATourism brand ambassador, why SATourism markets South Africa internationally, the ITB trade show and the role of the TBCSA.',
    tags: ['satourism', 'trade_shows', 'tomsa_levy', 'brand_ambassador'],
    qs: [
      ms('Select ALL the reasons why SATourism markets South Africa internationally.',
        ['To increase the number of foreign arrivals', 'To grow awareness of SA as a destination'],
        ['To set the wages paid in the hotel sector', 'To issue visas to foreign travellers', 'To grade the quality of guesthouses'],
        { unit: U_M, topic: 'satourism_functions', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 2, type: 'application' }),
      mt('Match each travel trade show to the city where it is held.',
        [['ITB', 'Berlin'], ['World Travel Market', 'London'], ['Africa\'s Travel Indaba', 'Durban'], ['Meetings Africa', 'Johannesburg']],
        { unit: U_M, topic: 'travel_trade_shows', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 3, w: 2, type: 'definition' }),
      ord('Put the steps in the flow of the tourism marketing levy in order.',
        ['Tourism businesses add a 1% levy to customer bills', 'TOMSA collects the levy from the businesses', 'TBCSA administers the levy funds', 'SATourism uses the funds to market South Africa'],
        { unit: U_M, topic: 'tomsa_funding', subtopic: 'tour_process_sequence', skill: 'sequence_tourism_process', diff: 3, w: 2, type: 'ordering' }),
      mc('Why would a tourism marketing body choose a famous national sports captain as a brand ambassador?',
        'He is recognised and admired worldwide', ['He can issue visas to foreign fans', 'He sets the prices of tourism products', 'He grades hotels for the tourism council'],
        { unit: U_M, topic: 'destination_marketing', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 1, type: 'application' }),
    ],
    subs: [
      ex('6.1.1', 2, ['Siya Kolisi is a well-known sports star.', 'Think about why people around the world know him.'], ['Link his fame to marketing South Africa.', 'Give one reason.'], ['He is a well-known rugby player and captain of the Springbok rugby team; after the World Cup success he became recognisable across the world.']),
      ex('6.1.2', 4, ['SATourism markets South Africa abroad.', 'Think about arrivals and awareness.'], ['Give two goals of international marketing.', 'Link each to the economy or to awareness.'], ['To increase the annual number of foreign arrivals, resulting in economic growth.', 'To increase international awareness of South Africa as a destination of choice.']),
      ex('6.2.1', 2, ['The trade show is held in Berlin, Germany.'], ['Recall the name of the large travel trade show in Berlin.', 'Write its abbreviation or full name.'], ['ITB (Internationale Tourismus-Börse), Berlin.']),
      ex('6.2.2', 2, ['Three bodies handle the marketing levy: TOMSA, TBCSA and SATourism.'], ['Describe the flow of the levy.', 'State what the TBCSA does with it.'], ['TOMSA collects the 1% levy and hands it to the TBCSA, which administers it and makes the funds available to SATourism for international marketing.']),
    ],
  },

  // ── L17 ── 7.1.1–7.1.2 ───────────────────────────────────────────────────────
  {
    order: 17, name: 'Question 7.1: Employment contracts, hours and overtime', marks: 6, qspec: '19', qpages: 1, mspec: '12', mpages: 1,
    covers: 'Question 7.1.1–7.1.2 — the contract of employment, working hours in the BCEA and the rules for overtime.',
    tags: ['tourism_employment_contract', 'conditions_of_employment'],
    qs: [
      mc('Which document sets out a crew member\'s duties, pay and working hours, and is signed before work starts?',
        'A contract of employment', ['A code of conduct policy', 'A job advertisement form', 'A visa application form'],
        { unit: U_TS, topic: 'conditions_of_employment', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
      fb('Under the BCEA, an employee who works a five-day week may work at most how many ordinary hours per day? []',
        ['Hours: ', '[ ]'], ['9'], 'standard_math',
        { unit: U_TS, topic: 'conditions_of_employment', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 3, w: 2, type: 'application', clues: '- The BCEA limits ordinary hours to 45 per week.' }),
      fb('A travel agent earns R80 per hour. Overtime is paid at 1,5 times the normal rate. How much does she earn for 2 hours of overtime? []',
        ['R ', '[ ]'], ['240|240.00'], 'standard_math',
        { unit: U_TS, topic: 'conditions_of_employment', subtopic: 'tour_calculation', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 2, type: 'calc' }),
      ms('Select ALL the BCEA rules about overtime.',
        ['Overtime must be agreed to by the employee', 'Overtime is paid at 1,5 times the normal rate'],
        ['Overtime may be ordered without any agreement', 'Overtime is never paid on normal weekdays', 'Overtime hours have no weekly limit at all'],
        { unit: U_TS, topic: 'conditions_of_employment', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('7.1.1', 2, ['The agreement is signed before reporting for duty.', 'It sets out the terms of the job.'], ['Recall the name of the written agreement between employer and employee.', 'Name it in full.'], ['A contract of employment.']),
      ex('7.1.2', 4, ['Lydia works Monday to Friday.', 'The BCEA sets 45 ordinary hours per week.'], ['(a) Divide the weekly hours over five days.', '(b) State one overtime rule from the BCEA.'], ['(a) 9 hours per day (45 hours per week); any 9-hour time frame is accepted.', '(b) She must be paid 1,5 times her normal rate for overtime; overtime must also be agreed upon.']),
    ],
  },

  // ── L18 ── 7.2.1–7.2.3 ───────────────────────────────────────────────────────
  {
    order: 18, name: 'Question 7.2: A code of conduct for cruise staff', marks: 6, qspec: '20', qpages: 1, mspec: '12', mpages: 1,
    covers: 'Question 7.2.1–7.2.3 — why a cruise line needs a code of conduct, the consequence of disrespecting cultural differences, and how a code creates a good working environment.',
    tags: ['code_of_conduct', 'professional_image'],
    qs: [
      ms('Select ALL the reasons why a cruise line has a code of conduct for its staff.',
        ['It sets out how staff should behave', 'It guides staff in sensitive situations', 'It protects the company\'s reputation'],
        ['It lists the ship\'s ports of call', 'It sets the prices of the cabins'],
        { unit: U_TS, topic: 'tourism_code_of_conduct', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 2, type: 'application' }),
      mc('A crew member keeps mocking passengers\' religious customs. What is the most likely consequence?',
        'Disciplinary action, possibly dismissal', ['A promotion to a senior position', 'A bonus for good customer service', 'Extra paid leave days'],
        { unit: U_TS, topic: 'tourism_code_of_conduct', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 2, w: 1, type: 'application' }),
      mt('Match each value in a code of conduct to an example of it.',
        [['Respect privacy', 'Not sharing guests\' cabin numbers'], ['Act with integrity', 'Handing in a wallet found on deck'], ['Work as a team', 'Helping a colleague on a busy shift'], ['Respect cultures', 'Learning greetings in guests\' languages']],
        { unit: U_TS, topic: 'tourism_code_of_conduct', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 2, type: 'application' }),
      mc('How does respecting a code of conduct create a good working environment?',
        'Clear rules build trust and reduce conflict', ['Staff may ignore the rules they dislike', 'Managers no longer need to supervise', 'Breaks become longer for all the staff'],
        { unit: U_TS, topic: 'tourism_code_of_conduct', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 2, w: 1, type: 'application' }),
    ],
    subs: [
      ex('7.2.1', 2, ['A code of conduct is a set of rules for behaviour.'], ['Explain what the code does for staff behaviour.', 'Give one reason.'], ['The code of conduct regulates how staff should behave while working on a cruise ship; it also guides staff in sensitive situations.']),
      ex('7.2.2', 2, ['Disrespect breaks the code of conduct.'], ['Think about what the employer can do.', 'State one consequence.'], ['The crew member could face disciplinary action, such as a warning or even dismissal.']),
      ex('7.2.3', 2, ['Think about teamwork and rules everyone knows.'], ['Link clear rules to how staff work together.', 'Explain the effect on the workplace.'], ['Respecting the code encourages teamwork by setting clear rules for behaviour, which builds trust and reduces conflict.']),
    ],
  },

  // ── L19 ── 8.1.1–8.1.3 ───────────────────────────────────────────────────────
  {
    order: 19, name: 'Question 8.1: Solar-powered airports', marks: 10, qspec: '21', qpages: 1, mspec: '13', mpages: 1,
    covers: 'Question 8.1.1–8.1.3 — the meaning of solar power, the pillars of sustainability, and the advantages of solar power for airports.',
    tags: ['solar_power', 'three_pillars'],
    qs: [
      mc('What is solar power?',
        'Electricity generated from the energy of sunlight', ['Electricity generated from the movement of wind', 'Electricity generated from burning coal or gas', 'Electricity generated from fast-flowing water'],
        { unit: U_SR, topic: 'environmental_practices', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 1, w: 1, type: 'definition' }),
      mc('An airport switches to solar power and so cuts air pollution. Which pillar of sustainability does this mainly support?',
        'Environmental', ['Social', 'Political', 'Cultural'],
        { unit: U_SR, topic: 'three_pillars', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 1, type: 'application' }),
      mt('Match each pillar of sustainability to an example at a solar-powered airport.',
        [['Economic pillar', 'Lower electricity costs for the airport'], ['Social pillar', 'Training local people as solar technicians'], ['Environmental pillar', 'Less air pollution from coal power']],
        { unit: U_SR, topic: 'three_pillars', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the advantages for an airport of using solar power.',
        ['Operations continue during load shedding', 'It lowers the airport\'s carbon footprint'],
        ['It increases the airport\'s use of coal', 'It works best at night when it is dark', 'It raises the monthly electricity bill'],
        { unit: U_SR, topic: 'environmental_practices', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 2, w: 2, type: 'application' }),
    ],
    subs: [
      ex('8.1.1', 2, ['Think about where the energy comes from.'], ['Name the energy source.', 'Say what it is turned into.'], ['Solar power uses sunlight to generate electricity; solar panels capture sunlight and convert it into electricity.']),
      ex('8.1.2', 4, ['There are three pillars: people, planet and profit.', 'Do not repeat the pillar from (a) in (b).'], ['(a) Choose the pillar that solar power supports.', '(b) Name the other two pillars.'], ['(a) Environmental (planet); economic (profit) is also accepted.', '(b) Social (people) and economic (profit), or social and environmental if (a) was economic.']),
      ex('8.1.3', 4, ['Think about the environment and electricity supply.', 'Solar energy is renewable.'], ['Give two advantages of solar power for airports.', 'Explain each one.'], ['It reduces the impact on the environment and the carbon footprint.', 'Sunlight is a vast, renewable and cost-effective resource; operations are not affected by load shedding.']),
    ],
  },

  // ── L20 ── 8.2.1–8.2.2 ───────────────────────────────────────────────────────
  {
    order: 20, name: 'Question 8.2: Sustainable airport management', marks: 8, qspec: '22', qpages: 1, mspec: '14', mpages: 1,
    covers: 'Question 8.2.1–8.2.2 — how a sustainable airport strategy benefits business operations and shows responsibility for climate change.',
    tags: ['sustainable_management', 'environmental_practices'],
    qs: [
      ms('Select ALL the ways a sustainable airport strategy can benefit business operations.',
        ['Less reliance on fossil fuels', 'Lower energy costs over time', 'A better public image'],
        ['Longer queues at check-in counters', 'More fuel imported every year'],
        { unit: U_SR, topic: 'sustainable_management', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the actions that show an airport taking responsibility for climate change.',
        ['Electric vehicles on the airside', 'Energy-saving lighting in terminals'],
        ['Diesel generators running all day', 'Extra lighting in empty car parks', 'Burning waste on the airport site'],
        { unit: U_SR, topic: 'sustainable_management', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 2, type: 'application' }),
      mc('An airport advertises itself as \'green\' but makes no real changes to how it uses energy. What is this called?',
        'Greenwashing', ['Carbon offsetting', 'Recycling', 'Eco-certification'],
        { unit: U_SR, topic: 'environmental_practices', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 3, w: 1, type: 'definition' }),
    ],
    subs: [
      ex('8.2.1', 4, ['Think about costs, energy supply and reputation.'], ['Give two ways the strategy helps the business.', 'Explain each one.'], ['It reduces the business\'s reliance on fossil fuels through sustainable practices.', 'Operations become cost-effective and partnerships with like-minded businesses can be built; load shedding no longer affects operations.']),
      ex('8.2.2', 4, ['Think about technology and fuel use at airports.'], ['Give two ways the strategy addresses climate change.', 'Explain each one.'], ['Airports can use efficient technology that supports green initiatives.', 'They can use alternative fuels and electric vehicles on the tarmac and elsewhere.']),
    ],
  },

  // ── L21 ── 9.1.1–9.1.2 ───────────────────────────────────────────────────────
  {
    order: 21, name: 'Question 9.1: Summits and international cooperation', marks: 6, qspec: '23', qpages: 1, mspec: '15', mpages: 1,
    covers: 'Question 9.1.1–9.1.2 — classifying a BRICS meeting as a summit and how BRICS cooperation can help South Africa manage its energy crisis.',
    tags: ['global_events', 'summits'],
    qs: [
      mc('Leaders of several countries meet to discuss trade, investment and climate change. What type of global event is this?',
        'A summit', ['A trade show', 'A sports event', 'A cultural festival'],
        { unit: U_DRI, topic: 'global_events_and_occurrences', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 1, type: 'application' }),
      ms('Select ALL the ways cooperation between BRICS members can help South Africa manage its energy crisis.',
        ['Trade with oil-rich member countries', 'Access to experts and new skills', 'Funding from the BRICS development bank'],
        ['Closing all of its power stations', 'Banning foreign energy companies'],
        { unit: U_DRI, topic: 'global_events_and_occurrences', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 2, type: 'application' }),
      mt('Match each global event to its type.',
        [['G20 meeting', 'Summit of world leaders'], ['Olympic Games', 'Global sports event'], ['ITB Berlin', 'Travel trade show'], ['Climate change conference', 'Talks on cutting emissions']],
        { unit: U_DRI, topic: 'global_events_and_occurrences', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 2, type: 'definition' }),
    ],
    subs: [
      ex('9.1.1', 2, ['BRICS leaders meet to discuss cooperation and trade.'], ['Decide which word describes a meeting of country leaders.', 'Choose between the two words in brackets.'], ['BRICS can be classified as a summit.']),
      ex('9.1.2', 4, ['BRICS includes oil-rich nations.', 'Think about trade, investment and skills.'], ['Give two ways cooperation can help with energy.', 'Explain each one.'], ['South Africa can develop trade relations with oil-rich nations, contributing to economic growth.', 'These countries can help reduce South Africa\'s reliance on fossil fuels; investment, expert knowledge and BRICS bank funding are also accepted.']),
    ],
  },

  // ── L22 ── 9.2.1–9.2.2 ───────────────────────────────────────────────────────
  {
    order: 22, name: 'Question 9.2: Floods and damaged infrastructure', marks: 6, qspec: '24', qpages: 1, mspec: '15', mpages: 1,
    covers: 'Question 9.2.1–9.2.2 — classifying a storm flood as an unforeseen occurrence and how damaged infrastructure affects clean water and emergency aid.',
    tags: ['unforeseen_occurrences', 'natural_disasters'],
    qs: [
      mc('Heavy rain from a storm makes rivers burst their banks and wash away roads. What type of unforeseen occurrence is this?',
        'A natural disaster', ['An act of terror', 'Political unrest', 'An economic recession'],
        { unit: U_DRI, topic: 'global_events_and_occurrences', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 1, w: 1, type: 'application' }),
      ms('Select ALL the ways flood damage to infrastructure affects access to clean water.',
        ['Broken pipes interrupt the water supply', 'Debris and soil contaminate drinking water'],
        ['Treatment works produce more clean water', 'Tap water becomes safer to drink', 'Water pressure in every pipe increases'],
        { unit: U_DRI, topic: 'global_events_and_occurrences', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 2, w: 2, type: 'application' }),
      mc('Why does a washed-away bridge delay emergency aid to a flooded town?',
        'Relief trucks cannot reach the town', ['Aid workers are no longer needed', 'The town has enough clean water', 'Emergency supplies arrive too early'],
        { unit: U_DRI, topic: 'global_events_and_occurrences', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 2, w: 1, type: 'application' }),
    ],
    subs: [
      ex('9.2.1', 2, ['Read what Storm Daniel caused.'], ['Name the type of event described.', 'Use the word in the article.'], ['Flooding (a storm or natural disaster is also accepted).']),
      ex('9.2.2', 4, ['Think about water treatment, pipes, roads and communication.'], ['(a) Explain how damage affects clean water.', '(b) Explain how damage affects emergency aid.'], ['(a) Damage to water treatment or distribution facilities can contaminate drinking water, and broken pipes interrupt the supply.', '(b) Damage to infrastructure delays emergency response, disrupts communication and blocks the delivery of supplies.']),
    ],
  },

  // ── L23 ── 9.3.1–9.3.2 ───────────────────────────────────────────────────────
  {
    order: 23, name: 'Question 9.3: Digital wallets and cash', marks: 8, qspec: '24', qpages: 1, mspec: '16', mpages: 1,
    covers: 'Question 9.3.1–9.3.2 — advantages of digital wallets for paying for tourism products and why cash is no longer preferred.',
    tags: ['payment_methods', 'digital_wallets'],
    qs: [
      ms('Select ALL the advantages of paying for tourism services with a digital wallet.',
        ['Payments are quick and contactless', 'No physical bank card is needed', 'Spending is easy to keep track of'],
        ['It works without any phone or device', 'It never needs a network connection'],
        { unit: U_DRI, topic: 'forms_of_payment', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 2, type: 'application' }),
      ms('Select ALL the reasons why cash is no longer a preferred method of payment.',
        ['Cash can be lost or stolen', 'Lost cash cannot be replaced'],
        ['Every online shop accepts cash', 'Stolen cash is easy to trace', 'Cash has no handling costs'],
        { unit: U_DRI, topic: 'forms_of_payment', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 2, w: 2, type: 'application' }),
      mt('Match each payment method to its description.',
        [['Digital wallet', 'Pays with a tap of a smartphone'], ['Credit card', 'Borrows money to repay later'], ['Debit card', 'Takes money straight from an account'], ['Cash', 'Notes and coins handed over in person']],
        { unit: U_DRI, topic: 'forms_of_payment', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 2, type: 'definition' }),
      mc('Which is a disadvantage of paying with a digital wallet while travelling?',
        'It needs a charged phone and a network', ['It is slower than counting out cash', 'It cannot be used in other countries', 'It needs a paper receipt for each sale'],
        { unit: U_DRI, topic: 'forms_of_payment', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 1, type: 'application' }),
    ],
    subs: [
      ex('9.3.1', 4, ['Think about convenience and safety.', 'A smartphone replaces the card.'], ['Give two advantages of digital wallets.', 'Explain each one.'], ['The need for physical cards is removed, so payment is convenient, quick and easy.', 'Digital wallets allow contactless and paperless payments around the world.']),
      ex('9.3.2', 4, ['Think about security when carrying cash.'], ['Give two reasons why cash is less popular.', 'Explain each one.'], ['Cash is a security risk because it can be stolen or lost.', 'Once lost or stolen it cannot be replaced; cash handling fees are also high.']),
    ],
  },

  // ── L24 ── 10.1–10.3 ─────────────────────────────────────────────────────────
  {
    order: 24, name: 'Question 10: Customer surveys', marks: 10, qspec: '25', qpages: 1, mspec: '17', mpages: 1,
    covers: 'Question 10.1–10.3 — the meaning of a customer survey, managing customer responses, and how surveys improve customer satisfaction.',
    tags: ['customer_surveys', 'customer_feedback'],
    qs: [
      mc('What is a customer survey?',
        'A method of collecting feedback from customers', ['A method of advertising products to customers', 'A method of recruiting new staff members', 'A method of tracking the monthly sales figures'],
        { unit: U_CC, topic: 'customer_feedback', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 1, w: 1, type: 'definition' }),
      ord('Put the steps for managing customer survey responses in order.',
        ['Collect the completed customer surveys', 'Capture and analyse the responses', 'Group common complaints into problem areas', 'Draw up and carry out an action plan'],
        { unit: U_CC, topic: 'customer_feedback', subtopic: 'tour_process_sequence', skill: 'sequence_tourism_process', diff: 3, w: 2, type: 'ordering' }),
      ms('Select ALL the ways customer surveys can improve customer satisfaction.',
        ['They show where service must improve', 'They guide an action plan for change', 'They build loyalty and repeat visits'],
        ['They replace the need for staff training', 'They stop all customer complaints'],
        { unit: U_CC, topic: 'customer_feedback', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 2, w: 2, type: 'application' }),
      mc('A manager files every survey without reading it. What is the main problem with this?',
        'Chances to improve service are missed', ['Customers receive refunds too quickly', 'Staff spend too long with each guest', 'The survey forms become too costly'],
        { unit: U_CC, topic: 'customer_feedback', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 2, w: 1, type: 'application' }),
    ],
    subs: [
      ex('10.1', 2, ['A survey asks customers questions.'], ['Explain what a survey collects.', 'Say why a business uses it.'], ['A customer survey is a method of collecting customer feedback; it measures customer satisfaction after a product or service has been used.']),
      ex('10.2', 4, ['Filing responses is not enough.', 'Think about analysing and acting on them.'], ['Suggest two steps to manage responses.', 'Explain each one.'], ['Analyse and capture the feedback to determine the level of service.', 'Group common complaints to identify problem areas, then implement an action plan.']),
      ex('10.3', 4, ['Think about how findings lead to change.'], ['Give two ways surveys improve satisfaction.', 'Explain each one.'], ['Analysing survey responses helps the company improve service delivery.', 'The findings help develop an action plan to correct or improve products and services.']),
    ],
  },
];
