'use strict';
// Tourism 2025 Nov — Section A (Q1) clustered by memo topic code into lessons 1–7.
const { mc, ms, mt, ord, fb, ex } = require('./lib');

const U_TS = 'tourism_sectors', U_MTP = 'map_work_tour_planning', U_TA = 'tourist_attractions', U_SR = 'sustainable_responsible_tourism';
const U_DRI = 'domestic_regional_international_tourism', U_CH = 'culture_heritage_tourism', U_FX = 'foreign_exchange', U_CC = 'communication_customer_care', U_M = 'tourism_marketing';

module.exports = [
  // ── L01 ── 1.1.1, 1.1.2, 1.1.11 ───────────────────────────────────────────────
  {
    order: 1, name: 'Question 1: Tourism sectors and employment (Section A)', marks: 3, qpages: 2, mpages: 1,
    covers: 'Section A items 1.1.1, 1.1.2 and 1.1.11 — travel budget items, the national tourism department and fringe benefits.',
    tags: ['travel_budget', 'fringe_benefits_tourism', 'tourism_policy_department'],
    qs: [
      mc('A tour group sets aside money at the end of its trip to thank the guide and the coach driver for excellent service. Which item in the tour budget is this?',
        'Gratuities', ['Insurance premium', 'Visa fees', 'Airport departure tax'],
        { unit: U_MTP, topic: 'tour_budget', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 1, type: 'application' }),
      mc('A hotel group lets all its employees stay at its other hotels at a heavily reduced rate, on top of their monthly salary. What is this advantage called?',
        'A fringe benefit', ['Basic salary', 'Overtime pay', 'Leave pay'],
        { unit: U_TS, topic: 'conditions_of_employment', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 1, type: 'application' }),
      ms('Select ALL the items that are fringe benefits an airline might offer its staff.',
        ['Discounted flight tickets for staff', 'Free meals while on duty', 'Reduced-rate hotel rooms on layovers'],
        ['Basic monthly salary', 'Payment for extra hours worked'],
        { unit: U_TS, topic: 'conditions_of_employment', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
      mt('Match each tourism body to the task it performs.',
        [['Department of Tourism', 'Develops national tourism policy'], ['UNESCO', 'Declares World Heritage Sites'], ['TOMSA', 'Collects the levy for marketing South Africa'], ['SATourism', 'Markets South Africa as a destination']],
        { unit: U_TS, topic: 'tourism_bodies_and_roles', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.1.1', 1, ['A travel budget lists the expected costs of a trip.', 'Which item shows thanks for good service?'], ['Think about the extra amount paid to people who serve you.', 'Compare each option with that purpose.'], ['Gratuities (tips) show appreciation for good service, so the answer is C.']),
      ex('1.1.2', 1, ['The White Paper is tourism policy.', 'Which national department is responsible for tourism?'], ['Recall which department develops and promotes tourism in South Africa.', 'Note that the memo accepts two forms of the name.'], ['The Department of Tourism is responsible for the White Paper on the Development and Promotion of Tourism, so B is correct.', 'The memo also accepts A (National Department of Tourism) because the industry still uses that name.']),
      ex('1.1.11', 1, ['The benefit is not part of the salary.', 'It is linked to the industry the employee works in.'], ['Recall the benefits that come with a job besides salary and leave.', 'Match discounted flight tickets with the correct category.'], ['Discounted flight tickets are a fringe benefit, so the answer is B.']),
    ],
  },

  // ── L02 ── 1.1.3, 1.1.4, 1.1.5, 1.2.2, 1.2.5 ─────────────────────────────────
  {
    order: 2, name: 'Question 1: Travel documents and borders (Section A)', marks: 5, qpages: 3, mpages: 1,
    covers: 'Section A items 1.1.3, 1.1.4, 1.1.5, 1.2.2 and 1.2.5 — the international date line, driving permit, documents for foreign currency, health certificates and customs regulations.',
    tags: ['travel_documents', 'international_date_line', 'customs_regulations'],
    qs: [
      mc('A traveller crosses the line of longitude where the calendar date changes by one day. What is this line called?',
        'International Date Line', ['Greenwich Meridian', 'Tropic of Capricorn', 'Equator'],
        { unit: U_MTP, topic: 'world_time_zones', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition', clues: '- This line lies roughly opposite the line that marks the starting point of the time zones.' }),
      mc('A South African wants to hire a car and drive in a foreign country. Which organisation issues the document that allows this?',
        'Automobile Association', ['Department of Health', 'Airports Company South Africa', 'South African Revenue Service'],
        { unit: U_MTP, topic: 'travel_documentation', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
      ms('A bank in South Africa will sell foreign currency for an overseas trip only when the customer can show proof of travelling. Select ALL the documents the bank asks for.',
        ['A paid flight ticket', 'A valid passport'],
        ['A letter from the employer', 'A parental consent form', 'A hotel breakfast voucher'],
        { unit: U_MTP, topic: 'travel_documentation', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
      mt('Match each travel concept to its description.',
        [['Health certificate', 'Proves the traveller received required vaccinations'], ['Customs regulations', 'Rules on the items that may be brought into a country'], ['Visa', 'Permission to enter a country for a set purpose and time'], ['Travel allowance', 'The amount of money a traveller may take out per year']],
        { unit: U_MTP, topic: 'travel_documentation', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 3, w: 2, type: 'definition' }),
    ],
    subs: [
      ex('1.1.3', 1, ['The line is at 180° longitude.', 'The date changes when it is crossed.'], ['Recall the important lines of longitude.', 'Pick the one linked to a change in calendar date.'], ['The 180° line is the International Date Line, so the answer is D.']),
      ex('1.1.4', 1, ['The permit is for driving abroad.', 'Think about the motoring organisation in South Africa.'], ['Recall who issues an international driving permit.', 'Rule out the health and airport bodies.'], ['The Automobile Association issues the international driving permit in South Africa, so the answer is C.']),
      ex('1.1.5', 1, ['Foreign currency is bought for travel abroad.', 'Banks need proof that you are really travelling.'], ['Recall the documents a bank asks for when selling foreign currency.', 'Check which pair contains both items.'], ['A paid flight ticket and a valid passport are needed, so the answer is C.']),
      ex('1.2.2', 1, ['The document is linked to vaccinations.', 'It is shown on entry to certain countries.'], ['Pick the term from the list that proves vaccination.'], ['A health certificate verifies that vaccinations were received.']),
      ex('1.2.5', 1, ['The rules control items brought into a country.', 'Alcohol, tobacco and currency are examples.'], ['Pick the term from the list that describes the rules.'], ['Customs regulations control the movement of items such as alcohol, tobacco and currency into a country.']),
    ],
  },

  // ── L03 ── 1.2.3, 1.2.4, 1.3.1, 1.5.1–1.5.5 ──────────────────────────────────
  {
    order: 3, name: 'Question 1: Health, allowances and tour planning (Section A)', marks: 8, qpages: 2, mpages: 2,
    covers: 'Section A items 1.2.3, 1.2.4, 1.3.1 and 1.5.1–1.5.5 — health precautions, travel allowances, flying time and the aspects of tour planning.',
    tags: ['health_precautions', 'tour_planning', 'flying_time'],
    qs: [
      ms('A family is travelling to a region where malaria occurs. Select ALL the health precautions that would reduce their risk.',
        ['Taking preventative medicine', 'Using insect repellent', 'Sleeping under a treated net'],
        ['Skipping meals during the day', 'Swimming in untreated fresh water'],
        { unit: U_MTP, topic: 'health_and_safety', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
      mc('Airlines describe the time an aircraft spends in the air between take-off and landing in one way. What is it called?',
        'Flying time', ['Layover time', 'Check-in time', 'Boarding time'],
        { unit: U_MTP, topic: 'world_time_zones', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition', clues: '- Layovers and check-in happen before or between flights, not in the air.' }),
      mt('Match each aspect of tour planning to the question it helps a planner answer.',
        [['Route planning', 'How will we travel from one stop to the next?'], ['Accommodation', 'Where will we sleep, and must we pay a deposit?'], ['Luggage rules', 'How heavy may our bags be on the plane?'], ['Budget', 'Can we afford the services and products on the trip?']],
        { unit: U_MTP, topic: 'tour_planning', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
      ord('Arrange these steps of planning a tour in a logical order.',
        ['Decide on the traveller profile and budget', 'Choose the route and transport', 'Book accommodation along the route', 'Draw up the day-by-day itinerary'],
        { unit: U_MTP, topic: 'tour_planning', subtopic: 'tour_process_sequence', skill: 'sequence_tourism_process', diff: 3, w: 2, type: 'ordering' }),
    ],
    subs: [
      ex('1.2.3', 1, ['The measures keep the traveller well.', 'They include medicine, repellent and sunblock.'], ['Choose the term that covers preventing illness while travelling.'], ['Health precautions are the use of preventative medication, insect repellents and sunblock.']),
      ex('1.2.4', 1, ['The amount is limited per year.', 'It is for foreign currency on overseas trips.'], ['Choose the term that describes a permitted yearly amount.'], ['Travel allowances are the amount a traveller may exchange annually when travelling overseas.']),
      ex('1.3.1', 1, ['The time is between departure and arrival.', 'It excludes waiting between flights.'], ['Compare flying time with layover time.'], ['The time in the air between departure and arrival is flying time.']),
      ex('1.5.1', 1, ['The aspect helps you find a logical route.'], ['Look at the infographic for the item used to plan a route.'], ['A map helps with planning a logical route.']),
      ex('1.5.2', 1, ['A deposit secures a reservation.'], ['Find the facility where you stay.'], ['A hotel may require a deposit to secure a reservation.']),
      ex('1.5.3', 1, ['Airlines limit weight and size.'], ['Find the item that is carried onboard.'], ['Luggage is limited by airlines in weight and size.']),
      ex('1.5.4', 1, ['They are the must-see places at a destination.'], ['Find the aspect that stands for famous sights.'], ['Icons are the must-see places visited at a destination.']),
      ex('1.5.5', 1, ['Services and products are bought before or during a trip.'], ['Find what a traveller needs to pay for them.'], ['Travellers must have money to acquire services and products.']),
    ],
  },

  // ── L04 ── 1.1.7, 1.1.8, 1.3.2, 1.3.3, 1.4.1–1.4.5 ───────────────────────────
  {
    order: 4, name: 'Question 1: Attractions and what makes them succeed (Section A)', marks: 9, qpages: 3, mpages: 2,
    covers: 'Section A items 1.1.7, 1.1.8, 1.3.2, 1.3.3 and 1.4.1–1.4.5 — famous icons and the factors that contribute to a successful attraction.',
    tags: ['tourist_icons', 'attraction_success_factors', 'universal_access'],
    qs: [
      mt('Match each icon to the country where it is found.',
        [['Machu Picchu', 'Peru'], ['Taj Mahal', 'India'], ['Colosseum', 'Italy'], ['Windmills', 'The Netherlands']],
        { unit: U_TA, topic: 'world_icons', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 1, type: 'application' }),
      ms('Select ALL the signs that an attraction is successful.',
        ['Visitor numbers exceed the target', 'Many visitors come back again', 'Income is above the target figure'],
        ['Fewer visitors than the business expected', 'Complaints from the local community about damage'],
        { unit: U_TA, topic: 'attraction_success_factors', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
      mt('Match each management action to the success factor it improves.',
        [['Security cameras and guards', 'Crime prevention'], ['Ramps and wide doorways', 'Universal access'], ['Painting and gardening each week', 'Appearance and upkeep'], ['Friendly, honest and punctual guides', 'Ethical behaviour of staff']],
        { unit: U_TA, topic: 'attraction_success_factors', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
      mc('A mountain village hosts more visitors, and the visitors stay longer. What is the most likely result for the attraction?',
        'Income that exceeds its targeted figures', ['Fewer repeat visits to the destination', 'Lower than expected visitor numbers', 'Exploitation of the local community'],
        { unit: U_TA, topic: 'attraction_success_factors', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.1.7', 1, ['The city is in the Middle East.', 'It is an archaeological site.'], ['Recall the world icons on the CAPS list.', 'Match the desert city with its site.'], ['Petra in Jordan is one of the richest and largest archaeological sites, so the answer is D.']),
      ex('1.1.8', 1, ['More visitors and more time spent means more spending.'], ['Link visitor numbers to income.'], ['Income exceeding the targeted figures is the result, so the answer is B.']),
      ex('1.3.2', 1, ['The coastline is in France.', 'Nice and Cannes are on it.'], ['Choose between the two bracketed coasts.'], ['The French Riviera is the Mediterranean coast with Nice and Cannes.']),
      ex('1.3.3', 1, ['The attraction is a windmill landscape.'], ['Choose the country linked to windmills.'], ['Windmills are a popular attraction in the Netherlands.']),
      ex('1.4.1', 1, ['Look at the picture showing cameras.'], ['Match the success factor with the picture.'], ['Crime prevention is matched to F (security cameras).']),
      ex('1.4.2', 1, ['Look at the picture showing gardening.'], ['Match the success factor with the picture.'], ['Appearance and upkeep is matched to E.']),
      ex('1.4.3', 1, ['Look at the picture linked to a travel trade show.'], ['Match the success factor with the picture.'], ['Marketing the attraction is matched to B.']),
      ex('1.4.4', 1, ['Look at the picture of a facility open to all visitors.'], ['Match the success factor with the picture.'], ['Universal access is matched to A.']),
      ex('1.4.5', 1, ['Look at the picture of staff serving visitors.'], ['Match the success factor with the picture.'], ['Efficient and ethical behaviour of staff is matched to D.']),
    ],
  },

  // ── L05 ── 1.1.12–1.1.15, 1.3.4 ──────────────────────────────────────────────
  {
    order: 5, name: 'Question 1: Sustainable and responsible tourism (Section A)', marks: 5, qpages: 3, mpages: 1,
    covers: 'Section A items 1.1.12–1.1.15 and 1.3.4 — Blue Flag, certification, the three pillars, sustainable practices and CSI.',
    tags: ['three_pillars', 'tourism_certification', 'corporate_social_investment'],
    qs: [
      mt('Match each sustainable-tourism pillar to an example of a good practice.',
        [['Environmental (planet)', 'Recycling waste at a lodge'], ['Economic (profit)', 'Buying food from local farmers'], ['Social (people)', 'Funding a school sports project']],
        { unit: U_SR, topic: 'three_pillars', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
      mc('A coastal town wants its beaches and marinas recognised for high management and sustainability standards. Which certification should it work towards?',
        'Blue Flag', ['Green Key', 'Grading star rating', 'World Heritage listing'],
        { unit: U_SR, topic: 'tourism_certification', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
      mc('A guest lodge pays for new classroom desks at a nearby school as part of its community programme. What is this kind of support called?',
        'Corporate social investment', ['Green-washing campaigns', 'Resource management plans', 'Product packaging design'],
        { unit: U_SR, topic: 'corporate_social_investment', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the practices that reduce the environmental impact of tourism.',
        ['Re-using towels and linen', 'Controlling alien invasive plants', 'Managing water and energy use'],
        ['Advertising green claims with no action behind them', 'Leaving litter bins unemptied'],
        { unit: U_SR, topic: 'environmental_practices', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.1.12', 1, ['The certification is linked to water.', 'It rates marine management and sustainability.'], ['Recall the certification linked to beaches.'], ['Blue Flag recognises beaches and marinas that meet high standards, so the answer is B.']),
      ex('1.1.13', 1, ['The organisation certifies responsible businesses.', 'Its name begins with Fair.'], ['Recall the body linked to fair and responsible practice.'], ['Fair Trade Tourism (FTT) encourages and certifies responsible and sustainable practices, so the answer is A.']),
      ex('1.1.14', 1, ['WESSA is a wildlife and environmental society.'], ['Link its focus to one of the three pillars.'], ['WESSA subscribes to the environmental pillar, so the answer is C.']),
      ex('1.1.15', 1, ['The practice must reduce environmental impact.', 'Two options are tricks or cosmetic.'], ['Rule out green-washing and white-washing.'], ['Resource management reduces the environmental impact of tourism, so the answer is D.']),
      ex('1.3.4', 1, ['The initiative goes beyond the core business.', 'It contributes to social development.'], ['Choose between BSR and CSI.'], ['CSI (corporate social investment) refers to initiatives that support social development beyond core business activities.']),
    ],
  },

  // ── L06 ── 1.1.6, 1.1.16, 1.1.18, 1.1.19, 1.1.20, 1.3.5 ──────────────────────
  {
    order: 6, name: 'Question 1: Domestic, regional and international tourism (Section A)', marks: 6, qpages: 4, mpages: 1,
    covers: 'Section A items 1.1.6, 1.1.16, 1.1.18, 1.1.19, 1.1.20 and 1.3.5 — the Indaba, car-rental payment, global events, SWIFT, unforeseen occurrences and foreign arrivals.',
    tags: ['global_events', 'unforeseen_occurrences', 'payment_methods'],
    qs: [
      mc('A traveller hires a car abroad and is asked to leave a guarantee that the company can charge for damage. Which form of payment is most widely accepted for this?',
        'Credit card', ['Traveller\'s cheque', 'Cash only', 'Bank draft'],
        { unit: U_DRI, topic: 'forms_of_payment', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
      mt('Match each event or occurrence to the category it belongs to.',
        [['The Olympic Games', 'Global sporting event'], ['An earthquake that damages hotels', 'Natural disaster'], ['A civil war closing airports', 'Political situation'], ['A virus that spreads across borders', 'Disease outbreak']],
        { unit: U_DRI, topic: 'global_events_and_occurrences', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the unforeseen occurrences that can reduce international arrivals to a country.',
        ['A tsunami', 'A global recession', 'A disease outbreak'],
        ['A new airport terminal opening', 'A national public holiday'],
        { unit: U_DRI, topic: 'global_events_and_occurrences', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 2, type: 'application' }),
      mc('Banks that send money between countries use a code to identify each bank in the transaction. What is this system called?',
        'SWIFT', ['EFT', 'Snapscan', 'Bank draft'],
        { unit: U_DRI, topic: 'forms_of_payment', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 3, w: 2, type: 'definition' }),
    ],
    subs: [
      ex('1.1.6', 1, ['The Indaba promotes South Africa to domestic and regional markets.', 'It is held every year in one city.'], ['Recall where the Africa Travel Indaba takes place.'], ['The Africa Travel Indaba is held in Durban, so the answer is C.']),
      ex('1.1.16', 1, ['A vehicle hire company wants a guarantee.', 'It must be easy to charge.'], ['Compare cash, cheques and EFT with cards.'], ['A credit card is the most accepted form of payment when renting a vehicle, so the answer is B.']),
      ex('1.1.18', 1, ['The event is athletics.', 'It brings visitors to Budapest.'], ['Decide what category a sports championship belongs to.'], ['The World Athletics Championships are a sporting event, so the answer is A.']),
      ex('1.1.19', 1, ['The codes are used between banks.', 'They are for international transactions.'], ['Recall the names of the payment systems.'], ['SWIFT codes are required for international financial transactions between banks, so the answer is B.']),
      ex('1.1.20', 1, ['Earthquakes are not caused by people.'], ['Decide whether the cause is natural or political.'], ['Earthquakes are natural disasters, so the answer is D.']),
      ex('1.3.5', 1, ['The statistic counts inbound travellers.', 'The period is measured, for example a year.'], ['Choose between immigration and foreign arrivals.'], ['Foreign arrivals measures the number of inbound travellers who visit a country in a given period.']),
    ],
  },

  // ── L07 ── 1.1.9, 1.1.10, 1.1.17, 1.2.1 ──────────────────────────────────────
  {
    order: 7, name: 'Question 1: Heritage, marketing, customer care and currency (Section A)', marks: 4, qpages: 3, mpages: 1,
    covers: 'Section A items 1.1.9, 1.1.10, 1.1.17 and 1.2.1 — UNESCO, travel trade shows, QR codes and the euro.',
    tags: ['world_heritage_sites', 'trade_shows', 'customer_care_tools'],
    qs: [
      mc('Which organisation decides that a place has outstanding universal value and declares it a World Heritage Site?',
        'UNESCO', ['SAHRA', 'ACSA', 'TBCSA'],
        { unit: U_CH, topic: 'world_heritage_sites', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
      mt('Match each travel trade show or market to what it does for tourism.',
        [['Meetings Africa', 'Attracts business and conference travellers'], ['Africa Travel Indaba', 'Promotes South Africa to domestic and regional markets'], ['World Travel Market', 'Lets SA promote itself to international buyers in London'], ['ITB Berlin', 'Lets SA promote itself to international buyers in Germany']],
        { unit: U_M, topic: 'travel_trade_shows', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
      mc('A guest lodge prints a square code at reception. Guests scan it with their phones to read the lodge\'s menu, rules and website. What is this tool mainly used for?',
        'Giving access to the business website', ['Retraining and upskilling staff', 'Collecting customers\' personal particulars', 'Advising the guests on dress codes'],
        { unit: U_CC, topic: 'customer_communication_tools', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
      ms('Germany\'s official currency is the euro. Select ALL the currencies that are officially used in European countries.',
        ['The euro', 'The pound sterling', 'The Swiss franc'],
        ['The Japanese yen', 'The Mexican peso'],
        { unit: U_FX, topic: 'currencies_and_codes', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 1, type: 'application' }),
    ],
    subs: [
      ex('1.1.9', 1, ['The organisation declares World Heritage Sites.'], ['Rule out the South African and airport bodies.'], ['UNESCO is responsible for declaring World Heritage Sites, so the answer is A.']),
      ex('1.1.10', 1, ['Meetings Africa is a trade show.', 'It attracts a particular kind of tourist.'], ['Recall the abbreviation for business tourists.'], ['Meetings Africa attracts MESE (meetings, exhibitions, incentive and events) tourists, so the answer is A.']),
      ex('1.1.17', 1, ['A QR code is scanned with a phone.'], ['Think about what a scanned code opens.'], ['The QR code is used to get access to the website of the business, so the answer is A.']),
      ex('1.2.1', 1, ['The currency is the official money of Germany.'], ['Pick the currency from the list.'], ['The euro is the official currency of Germany.']),
    ],
  },
];
