'use strict';
// Tourism 2024 Nov — Section A (Q1) clustered by memo topic code into lessons 1–6.
// qspec/mspec are the extract-exam-pages.py page specs for the lesson's exam and memo images.
const { mc, ms, mt, fb, ex } = require('../lib');

const U_TS = 'tourism_sectors', U_MTP = 'map_work_tour_planning', U_TA = 'tourist_attractions', U_SR = 'sustainable_responsible_tourism';
const U_DRI = 'domestic_regional_international_tourism', U_CH = 'culture_heritage_tourism', U_FX = 'foreign_exchange', U_CC = 'communication_customer_care', U_M = 'tourism_marketing';

module.exports = [
  // ── L01 ── 1.1.1–1.1.6 ───────────────────────────────────────────────────────
  {
    order: 1, name: 'Question 1: Tour planning, travel health and exchange rates (Section A)', marks: 6, qspec: '3,4', qpages: 2, mspec: '3', mpages: 1,
    covers: 'Section A items 1.1.1–1.1.6 — optional budget expenses, the destination, the International Date Line, cholera and yellow fever precautions, and reading an exchange-rate table.',
    tags: ['travel_budget', 'travel_health', 'international_date_line'],
    qs: [
      mc('Which precaution best protects a traveller against cholera?',
        'Drinking only bottled or boiled water', ['Sleeping under a mosquito net', 'Taking antimalarial tablets every day', 'Wearing a hat in the midday sun'],
        { unit: U_MTP, topic: 'health_and_safety', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 1, type: 'application', clues: '- Cholera spreads through contaminated food and water, not through insect bites.' }),
      mc('Illustrative rates (rand for one unit of foreign currency): Swiss franc R21,40; US dollar R17,90; Australian dollar R11,80; Japanese yen R0,12. For a South African tourist, which country has the most expensive currency to buy?',
        'Switzerland', ['United States', 'Japan', 'Australia'],
        { unit: U_FX, topic: 'tourism_exchange_rates', subtopic: 'tour_data_interpretation', skill: 'interpret_tourism_stimulus', diff: 2, w: 1, type: 'interpretation', clues: '- The more rand one unit costs, the more expensive that currency is for a South African.' }),
      mt('Match each travel term to its meaning.',
        [['Destination', 'The place where a journey ends'], ['Departure point', 'The place where a journey begins'], ['Transit', 'Passing through a place on the way elsewhere'], ['International Date Line', 'Crossing it changes the calendar date']],
        { unit: U_MTP, topic: 'tour_planning', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 2, type: 'definition' }),
      ms('Select ALL the costs that are optional extras in a tourist\'s travel budget.',
        ['Tips for waiters and tour guides', 'Souvenirs bought at a craft market'],
        ['Return flight tickets to the destination', 'Accommodation booked for each night', 'Visa fees for entering the country'],
        { unit: U_MTP, topic: 'tour_budget', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.1.1', 1, ['Tips are not needed to complete the trip.', 'The tourist chooses whether to spend this money.'], ['Sort the budget items into necessary and optional expenses.', 'Decide where tips for waiters belong.'], ['Tips depend on the tourist\'s choice, so they are an optional expense: B.']),
      ex('1.1.2', 1, ['The question is about where a journey ends.'], ['Recall the terms used for the start, middle and end of a journey.', 'Pick the term for the arrival point.'], ['The arrival point of a journey is the destination: A.']),
      ex('1.1.3', 1, ['The line lies at 180° longitude.', 'Time zones are counted from a different line.'], ['Recall what happens when a traveller crosses the International Date Line.', 'Rule out the Equator and the Greenwich Meridian descriptions.'], ['Crossing the International Date Line causes a change of date while travelling: C.']),
      ex('1.1.4', 1, ['Bottled water protects against diseases carried in water.', 'Malaria is spread by mosquitoes.'], ['Link each disease to the way it spreads.', 'Choose the one spread through contaminated water.'], ['Cholera spreads through contaminated water, so bottled water is a precaution against cholera: B.']),
      ex('1.1.5', 1, ['A yellow fever certificate is issued after a vaccination.'], ['Think about where travellers get travel vaccinations.', 'Rule out places that do not give vaccinations.'], ['A travel clinic gives the vaccination and issues the yellow fever certificate: B.']),
      ex('1.1.6', 1, ['The table shows how many rand one unit of each currency costs.', 'The highest figure is the most expensive.'], ['Find the currency with the highest rate.', 'Link that currency to its country.'], ['The British pound costs the most rand (23,68), so England is the most expensive destination: D.']),
    ],
  },

  // ── L02 ── 1.1.7–1.1.12 ──────────────────────────────────────────────────────
  {
    order: 2, name: 'Question 1: World icons, access and South Africa\'s brand (Section A)', marks: 6, qspec: '4,5', qpages: 2, mspec: '3', mpages: 1,
    covers: 'Section A items 1.1.7–1.1.12 — the Black Forest, the Great Wall of China, Niagara Falls, universal access, South Africa\'s brand slogan and SATourism campaigns.',
    tags: ['tourist_icons', 'icon_location', 'universal_access'],
    qs: [
      mt('Match each attraction to the country or countries where it is found.',
        [['Niagara Falls', 'Canada and the USA'], ['The Great Wall', 'China'], ['The Black Forest', 'Germany'], ['Victoria Falls', 'Zambia and Zimbabwe']],
        { unit: U_TA, topic: 'world_icons', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 2, type: 'application' }),
      mc('A museum installs ramps, lifts and braille signs throughout its building. What does this provide?',
        'Universal access for all visitors', ['Extra security for valuable displays', 'Cheaper entry for school groups', 'Faster queues at the ticket office'],
        { unit: U_TA, topic: 'attraction_success_factors', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 1, type: 'application' }),
      ms('Select ALL the ways an attraction can cater for visitors with disabilities.',
        ['Wheelchair ramps at entrances', 'Audio guides for blind visitors', 'Accessible toilets on each floor'],
        ['Higher entry fees for all visitors', 'Steep stairs to every viewing deck'],
        { unit: U_TA, topic: 'attraction_success_factors', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 2, type: 'application' }),
      mc('Brand South Africa\'s logo usually carries which slogan?',
        'Inspiring new ways', ['Proudly South African', 'Simply the best', 'Africa starts here'],
        { unit: U_M, topic: 'destination_marketing', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 3, w: 1, type: 'definition' }),
    ],
    subs: [
      ex('1.1.7', 1, ['The Black Forest is a mountain forest region in Europe.'], ['Recall which European country the Black Forest is in.', 'Rule out the countries outside Europe.'], ['The Black Forest is in south-western Germany: B.']),
      ex('1.1.8', 1, ['The structure was built for protection.', 'It is thousands of kilometres long.'], ['Think about which icon was built as a defence wall.', 'Compare its length with the other options.'], ['The Great Wall of China was built to protect the country and is over 6 000 km long: A.']),
      ex('1.1.9', 1, ['The waterfall is in North America.', 'It lies on the border of two countries.'], ['Recall where each waterfall in the options is found.', 'Pick the one between Canada and the USA.'], ['Niagara Falls lies on the border between Canada and the USA: C.']),
      ex('1.1.10', 1, ['Think about visitors who use wheelchairs or cannot see well.'], ['Look for the option that removes barriers for these visitors.', 'Rule out options that have nothing to do with access.'], ['Universal access makes an attraction usable by visitors with disabilities: B.']),
      ex('1.1.11', 1, ['The logo is South Africa\'s country brand.'], ['Recall the slogan that appears with the Brand South Africa logo.', 'Do not confuse it with a campaign for local products.'], ['The brand logo displays the slogan \'Inspiring new ways\': A.']),
      ex('1.1.12', 1, ['The question asks about a SATourism campaign.'], ['Recall the campaign slogans used by SATourism.', 'Note that the memo accepts two options here.'], ['The memo accepts A (\'Live South Africa!\') and also C (\'Alive with possibility\').']),
    ],
  },

  // ── L03 ── 1.1.13, 1.4.1–1.4.5 ───────────────────────────────────────────────
  {
    order: 3, name: 'Question 1: South African World Heritage Sites (Section A)', marks: 6, qspec: '5,8', qpages: 2, mspec: '3', mpages: 1,
    covers: 'Section A items 1.1.13 and 1.4.1–1.4.5 — the ǂKhomani Cultural Landscape and matching World Heritage Sites to their descriptions and provinces.',
    tags: ['world_heritage_sites', 'south_african_heritage'],
    qs: [
      mt('Match each World Heritage Site to the province where it is found.',
        [['Mapungubwe Cultural Landscape', 'Limpopo'], ['Richtersveld Cultural Landscape', 'Northern Cape'], ['iSimangaliso Wetland Park', 'KwaZulu-Natal'], ['Barberton Makhonjwa Mountains', 'Mpumalanga']],
        { unit: U_CH, topic: 'south_african_world_heritage', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
      mc('Which World Heritage Site preserves the remains of a huge meteorite impact?',
        'Vredefort Dome', ['Robben Island', 'Richtersveld', 'Mapungubwe'],
        { unit: U_CH, topic: 'south_african_world_heritage', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
      mc('The ǂKhomani Cultural Landscape in the Kalahari is linked to the traditional way of life of which people?',
        'The San', ['The Nama', 'The Zulu', 'The Xhosa'],
        { unit: U_CH, topic: 'south_african_world_heritage', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 3, w: 1, type: 'definition', clues: '- Think of the hunter-gatherers known for hunting with a bow and arrow.' }),
      ms('Select ALL the sites that are cultural (not natural) World Heritage Sites.',
        ['Robben Island', 'Mapungubwe Cultural Landscape', 'ǂKhomani Cultural Landscape'],
        ['iSimangaliso Wetland Park', 'Vredefort Dome'],
        { unit: U_CH, topic: 'world_heritage_sites', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.1.13', 1, ['The ǂKhomani are San people of the Kalahari.'], ['Recall the traditional skills of the San.', 'Rule out the options linked to other heritage sites.'], ['The ǂKhomani Cultural Landscape is associated with hunting with a bow and arrow: B.']),
      ex('1.4.1', 1, ['The site shows the remains of an ancient kingdom.', 'It is in Limpopo.'], ['Find the site in Column B that lies in Limpopo.', 'Check that it is a cultural site with ancient remains.'], ['Mapungubwe Cultural Landscape: B.']),
      ex('1.4.2', 1, ['A meteorite struck the Earth here.', 'It spans the Free State and North West.'], ['Find the site in Column B formed by a meteorite impact.', 'Check that it spans the two provinces.'], ['Vredefort Dome: D.']),
      ex('1.4.3', 1, ['The site is in Mpumalanga.', 'It has the Geotrail and very old rock formations.'], ['Find the site in Column B that lies in Mpumalanga.', 'Check that it is known for ancient rocks.'], ['Barberton Makhonjwa Mountains: F.']),
      ex('1.4.4', 1, ['The site is an estuary in KwaZulu-Natal.', 'It is popular for scuba diving.'], ['Find the site in Column B on the KwaZulu-Natal coast.', 'Check that it includes a river mouth.'], ['iSimangaliso Wetland Park: C.']),
      ex('1.4.5', 1, ['The Sterkfontein Caves are in Gauteng.', 'Early human fossils were found there.'], ['Find the site in Column B linked to early human fossils.', 'Check that it lies in Gauteng.'], ['Fossil Hominid Sites of South Africa: A.']),
    ],
  },

  // ── L04 ── 1.1.14, 1.1.15, 1.3.1–1.3.5 ───────────────────────────────────────
  {
    order: 4, name: 'Question 1: Sustainable and responsible tourism (Section A)', marks: 7, qspec: '6,8', qpages: 2, mspec: '3', mpages: 1,
    covers: 'Section A items 1.1.14, 1.1.15 and 1.3.1–1.3.5 — responsible practices, work ethics, carbon footprint, FTT, CSI, refillable bottles and the triple bottom line.',
    tags: ['environmental_practices', 'tourism_certification', 'corporate_social_investment'],
    qs: [
      mc('Which organisation certifies that tourism businesses pay fair wages and provide good working conditions?',
        'FTT', ['SAHRA', 'TGCSA', 'UNESCO'],
        { unit: U_SR, topic: 'tourism_certification', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
      mt('Match each sustainability term to its example or meaning.',
        [['Corporate social investment', 'A hotel funds bursaries for local learners'], ['Triple bottom line', 'Balancing people, planet and profit'], ['Carbon footprint', 'Greenhouse gases caused by an activity'], ['Responsible practice', 'Switching off lights in empty rooms']],
        { unit: U_SR, topic: 'three_pillars', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'definition' }),
      ms('A conference centre wants to run a sustainable event. Select ALL the sustainable practices.',
        ['Water stations for refillable glass bottles', 'Digital programmes instead of printed ones', 'Recycling bins in every conference hall'],
        ['Single-use plastic bottles at each seat', 'Air conditioning left on in empty rooms'],
        { unit: U_SR, topic: 'environmental_practices', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 2, type: 'application' }),
      mc('Which behaviour shows good work ethics in a tourism business?',
        'Taking care of company equipment', ['Gossiping about fellow workers', 'Taking long breaks during shifts', 'Accepting gifts from clients'],
        { unit: U_SR, topic: 'responsible_tourist', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 1, type: 'application' }),
    ],
    subs: [
      ex('1.1.14', 1, ['Saving electricity uses fewer resources.'], ['Decide whether the practice helps or harms the environment.', 'Pick the positive term.'], ['Saving electricity is a responsible practice: B.']),
      ex('1.1.15', 1, ['Good work ethics means behaving honestly and professionally.'], ['Rule out the options that show poor behaviour.', 'Pick the option that shows respect.'], ['Respect for company property is an example of good work ethics: A.']),
      ex('1.3.1', 1, ['Recycled material saves new raw materials and energy.'], ['Decide whether this raises or lowers greenhouse gas emissions.', 'Choose the matching word.'], ['Buying products made from recyclable material results in a reduced carbon footprint.']),
      ex('1.3.2', 1, ['The question is about fair wages and working conditions.', 'SAHRA deals with heritage.'], ['Recall which body certifies fair practices in tourism.', 'Choose between the two bodies given.'], ['FTT (Fair Trade Tourism) ensures fair wages and good working conditions.']),
      ex('1.3.3', 1, ['Internships help people in the local community.'], ['Recall the term for a company\'s social development projects.', 'Choose between CBR and CSI.'], ['Offering internships to local school-leavers is a CSI (corporate social investment) initiative.']),
      ex('1.3.4', 1, ['A sustainable choice can be reused many times.'], ['Compare the two bottle materials.', 'Choose the one that avoids single-use waste.'], ['Delegates should refill glass bottles at the water station.']),
      ex('1.3.5', 1, ['Respecting local customs is part of the social pillar.'], ['Recall the term for balancing people, planet and profit.', 'Rule out the term about market share.'], ['Acknowledging local customs is part of practising the triple bottom line.']),
    ],
  },

  // ── L05 ── 1.1.16–1.1.20, 1.2.1–1.2.5 ────────────────────────────────────────
  {
    order: 5, name: 'Question 1: Global events, occurrences and arrivals (Section A)', marks: 10, qspec: '6,7', qpages: 2, mspec: '3', mpages: 1,
    covers: 'Section A items 1.1.16–1.1.20 and 1.2.1–1.2.5 — global sports events, acts of terror, Stats SA, purpose of visit, web-based feedback, political situations, recession, expenditure, publicity and land markets.',
    tags: ['unforeseen_occurrences', 'foreign_arrivals', 'feedback_methods'],
    qs: [
      mt('Match each event to the type of unforeseen occurrence it is.',
        [['A tsunami floods a coastal resort', 'Natural disaster'], ['A bomb explodes at a busy airport', 'Act of terror'], ['Mass protests close a capital city', 'Political unrest'], ['Jobs and spending fall across a country', 'Economic recession']],
        { unit: U_DRI, topic: 'global_events_and_occurrences', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 2, type: 'application' }),
      mc('Tourists from Lesotho who drive into South Africa through the Maseru Bridge border post form part of which market?',
        'The land market', ['The air market', 'The sea market', 'The long-haul market'],
        { unit: U_DRI, topic: 'foreign_arrivals', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 1, type: 'application' }),
      mc('Illustrative data — purpose of visit of foreign arrivals: visiting friends and relatives (VFR) 38%, holiday 25%, shopping 22%, business 9%, other 6%. Which purpose is the second most popular?',
        'Holiday', ['Shopping', 'Business', 'VFR'],
        { unit: U_DRI, topic: 'foreign_arrivals', subtopic: 'tour_data_interpretation', skill: 'interpret_tourism_stimulus', diff: 2, w: 1, type: 'interpretation' }),
      ms('A tour company collects feedback through an online form. Select ALL the disadvantages of this method.',
        ['Customers need internet access and data', 'Customers without a device are left out'],
        ['Responses can be collected very quickly', 'Results can be analysed electronically', 'Customers can respond from anywhere'],
        { unit: U_CC, topic: 'feedback_methods', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.1.16', 1, ['The question asks about the most recent Rugby World Cup.', 'The final was held in France in 2023.'], ['Recall which team won the 2023 Rugby World Cup.', 'Choose that country.'], ['South Africa won the 2023 Rugby World Cup: D.']),
      ex('1.1.17', 1, ['The event was deliberate violence against civilians.'], ['Rule out natural disasters and civil war.', 'Choose the term for deliberate attacks that spread fear.'], ['A mass shooting is an act of terror: B.']),
      ex('1.1.18', 1, ['The organisation collects national statistics.'], ['Recall which body publishes tourism data such as length of stay.', 'Rule out the tax, rail and tour-operator bodies.'], ['Stats SA collects information on tourists\' length of stay: C.']),
      ex('1.1.19', 1, ['Read the percentages on the graph.', 'Find the bar just below the highest one.'], ['Rank the four purposes by percentage.', 'Pick the second-highest.'], ['VFR is highest (41,4%) and shopping is second (22,9%): B.']),
      ex('1.1.20', 1, ['A disadvantage is a problem with the method.'], ['Rule out the options that describe benefits.', 'Choose the option that limits who can respond.'], ['Web-based feedback needs an internet connection and data: C.']),
      ex('1.2.1', 1, ['The Israel-Gaza War is a conflict between governments and groups.'], ['Choose the term from the list for a conflict situation.', 'Rule out natural disasters.'], ['The Israel-Gaza War is an example of a political situation.']),
      ex('1.2.2', 1, ['Fewer tourists means less money in the economy.'], ['Choose the term for a period of economic decline.', 'Use the word from the list.'], ['It can lead to a recession.']),
      ex('1.2.3', 1, ['Expenditure is about spending.'], ['Choose between days spent and money spent.', 'Use the word from the list.'], ['Expenditure refers to the money spent while travelling.']),
      ex('1.2.4', 1, ['A serious accident is reported in the media.'], ['Choose the term for media coverage.', 'Use the word from the list.'], ['It will lead to negative publicity.']),
      ex('1.2.5', 1, ['Beit Bridge is a road border post.'], ['Decide how the tourists entered South Africa.', 'Choose between air and land.'], ['Tourists entering at Beit Bridge form part of land markets.']),
    ],
  },

  // ── L06 ── 1.5.1–1.5.5 ───────────────────────────────────────────────────────
  {
    order: 6, name: 'Question 1.5: Hotel staff and their uniforms (Section A)', marks: 5, qspec: '9', qpages: 1, mspec: '4', mpages: 1,
    covers: 'Section A items 1.5.1–1.5.5 — matching hotel staff to their duties: housekeeper, maintenance, chef, doorman and security manager.',
    tags: ['hotel_staff_roles', 'professional_image'],
    qs: [
      mt('Match each hotel staff member to the main duty of the job.',
        [['Housekeeper', 'Keeps guest rooms clean and tidy'], ['Maintenance worker', 'Repairs leaking taps and pipes'], ['Chef', 'Plans and prepares meals'], ['Doorman', 'Welcomes guests at the entrance']],
        { unit: U_TS, topic: 'hotel_staff_roles', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 2, type: 'application' }),
      mc('A guest steps out of a taxi at a five-star hotel and is greeted and helped with luggage before reaching the lobby. Which staff member is this?',
        'The doorman', ['The chef', 'The housekeeper', 'The night auditor'],
        { unit: U_TS, topic: 'hotel_staff_roles', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 1, type: 'application' }),
      ms('Select ALL the reasons why hotel staff wear uniforms.',
        ['Guests can easily identify staff', 'It creates a professional image'],
        ['It allows staff to skip grooming', 'It means staff need no training', 'It replaces the need for name badges'],
        { unit: U_TS, topic: 'professional_image', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 2, w: 2, type: 'application' }),
      mc('Which staff member leads the team that keeps all hotel guests safe?',
        'Security manager', ['Front office manager', 'Food and beverage manager', 'Housekeeping manager'],
        { unit: U_TS, topic: 'hotel_staff_roles', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
    ],
    subs: [
      ex('1.5.1', 1, ['This person keeps the hotel clean.', 'Look for an apron and a cleaning spray.'], ['Match the cleaning duty to a picture.', 'Check the uniform details.'], ['The housekeeper is picture H.']),
      ex('1.5.2', 1, ['Plumbing means pipes and taps.', 'Look for work clothes and a tool.'], ['Match the repair duty to a picture.', 'Check the uniform details.'], ['The maintenance worker with a spanner is picture B.']),
      ex('1.5.3', 1, ['A culinary specialist works in the kitchen.', 'Look for the chef\'s hat.'], ['Match the cooking duty to a picture.', 'Check the uniform details.'], ['The chef is picture G.']),
      ex('1.5.4', 1, ['This person meets guests as they arrive at the door.', 'Look for a long uniform coat and a cap.'], ['Match the welcome duty to a picture.', 'Check the uniform details.'], ['The doorman is picture E.']),
      ex('1.5.5', 1, ['This person manages security staff.', 'Look for a dark suit and a badge.'], ['Match the safety duty to a picture.', 'Check the uniform details.'], ['The security manager is picture D.']),
    ],
  },
];
