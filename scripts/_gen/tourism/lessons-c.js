'use strict';
// Tourism 2025 Nov — Section C (Q4–Q6), Section D (Q7–Q8), Section E (Q9–Q10): lessons 14–24.
const { mc, ms, mt, ord, fb, ex } = require('./lib');

const U_TS = 'tourism_sectors', U_TA = 'tourist_attractions', U_SR = 'sustainable_responsible_tourism', U_DRI = 'domestic_regional_international_tourism';
const U_CH = 'culture_heritage_tourism', U_CC = 'communication_customer_care', U_M = 'tourism_marketing';

module.exports = [
  // ── L14 ── 4.1 ───────────────────────────────────────────────────────────────
  {
    order: 14, name: 'Question 4.1: Mountain icons and sustainable management', marks: 18, qpages: 2, mpages: 1,
    covers: 'Question 4.1.1–4.1.4 — naming natural icons, the tourists they attract and sustainable and responsible management of a mountain.',
    tags: ['natural_icons', 'tourist_types', 'sustainable_management'],
    qs: [
      mt('Match each natural icon to the country where it is found.',
        [['Mount Fuji', 'Japan'], ['Mount Everest', 'Nepal'], ['Swiss Alps (Jungfrau-Aletsch)', 'Switzerland'], ['Uluru', 'Australia']],
        { unit: U_TA, topic: 'world_icons', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 1, type: 'application' }),
      ms('Uluru is a natural landmark that is also sacred to the Anangu people. Select ALL the types of tourist it is likely to attract.',
        ['Cultural tourists', 'Leisure tourists', 'Special-interest tourists'],
        ['Business tourists attending conferences', 'Medical tourists'],
        { unit: U_TA, topic: 'tourist_types', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the ways a mountain destination can manage visitors sustainably and responsibly.',
        ['Keeping visitors to designated trails', 'Limiting climber numbers with permits in peak season', 'Training and fairly paying local guides'],
        ['Allowing camping anywhere on the slopes', 'Removing all rules to attract more visitors'],
        { unit: U_SR, topic: 'sustainable_management', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 3, type: 'application' }),
      mc('Which is the best reason why a mountain icon needs sustainable and responsible practices?',
        'They protect the environment for future visitors', ['They make climbing permits unnecessary', 'They remove the need for local guides', 'They allow unlimited growth in visitor numbers'],
        { unit: U_SR, topic: 'sustainable_management', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('4.1.1', 2, ['Use the banners to find the countries.', 'Match each country with its famous mountain.'], ['Read the countries on banners A and C.', 'Recall the icon for each country.'], ['Banner A is Mount Fuji (Japan) and banner C is Mount Everest (Nepal).']),
      ex('4.1.2', 2, ['Think about what both mountains have in common.'], ['Compare their status and type.'], ['Both mountains are natural attractions and UNESCO World Heritage Sites; other similarities are accepted.']),
      ex('4.1.3', 2, ['Think about the reason people travel to country B.'], ['Name a tourist type linked to its icons.'], ['A religious, cultural, leisure or special-interest tourist would visit the icons.']),
      ex('4.1.4(a)', 4, ['Think about what makes this mountain special.'], ['Give two reasons the icon is unique.'], ['1. It is the highest mountain in the world.', '2. It is sacred to local communities.']),
      ex('4.1.4(b)', 4, ['The memo excludes litter control.', 'Two management practices are needed.'], ['Discuss two ways to manage the mountain responsibly.'], ['1. Use only designated trails to protect the ecosystems.', '2. Enforce permits at different times for different trails to limit climbers in peak season.']),
      ex('4.1.4(c)', 4, ['Think about the impact of too many climbers.'], ['Explain two reasons for sustainable practice.'], ['1. It helps to reduce pollution on the climbing trails.', '2. It helps protect the natural environment.']),
    ],
  },

  // ── L15 ── 4.2 ───────────────────────────────────────────────────────────────
  {
    order: 15, name: 'Question 4.2: A New 7 Wonders icon and its success', marks: 12, qpages: 1, mpages: 1,
    covers: 'Question 4.2.1–4.2.4 — locating an icon, the advantage of New 7 Wonders status and how transport adds to an attraction\'s success.',
    tags: ['new_seven_wonders', 'icon_location', 'attraction_transport'],
    qs: [
      mt('Match each icon to the continent where it is found.',
        [['Machu Picchu', 'South America'], ['The Great Wall of China', 'Asia'], ['The Colosseum', 'Europe'], ['The Statue of Liberty', 'North America']],
        { unit: U_TA, topic: 'world_icons', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 1, type: 'application' }),
      mc('Machu Picchu is one of the New 7 Wonders of the World. What is one advantage of this status for the icon?',
        'It can use the status to market the icon', ['It no longer needs a management plan', 'Entry becomes free for all tourists', 'Visitors can no longer damage it in any way'],
        { unit: U_TA, topic: 'icon_success', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 2, type: 'application' }),
      ms('A tourist train now links a major city to a world-famous ruin. Select ALL the ways the train can add to the success of the ruin as an attraction.',
        ['It brings more visitors to the area', 'It makes the site easier to reach', 'It reduces road traffic to the site'],
        ['It lowers the income of nearby businesses', 'It makes the ruin harder to reach'],
        { unit: U_TA, topic: 'icon_success', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 3, type: 'application' }),
      mc('A tourist train is named after the ancient civilisation that built the ruin it serves. Why is the name closely linked to the icon?',
        'The name links the train to the culture and history of the icon', ['Trains are always named after countries', 'The name shows that the train is cheaper than the buses and taxis', 'The name tells passengers which platform to use'],
        { unit: U_TA, topic: 'icon_success', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('4.2.1(a)', 2, ['Read the infographic for the location.'], ['Name the country where Chichen Itza is found.'], ['Chichen Itza is in Mexico.']),
      ex('4.2.1(b)', 2, ['Think about the country\'s position on the world map.'], ['Name the continent of that country.'], ['Mexico is in North America.']),
      ex('4.2.2', 2, ['Look at the name of the train.'], ['Link the name to the history of the site.'], ['The Maya train is named after the ancient Mayan civilisation of Chichen Itza.']),
      ex('4.2.3', 2, ['Think about how status helps marketing.'], ['Explain one advantage of being one of the New 7 Wonders.'], ['The status can be used in its marketing strategy and creates awareness that attracts more tourists.']),
      ex('4.2.4', 4, ['Think about access and visitor numbers.'], ['Discuss two ways the train adds to success.'], ['1. The train brings more tourists to the area.', '2. More tourists bring more income for the area.']),
    ],
  },

  // ── L16 ── 5 ─────────────────────────────────────────────────────────────────
  {
    order: 16, name: 'Question 5: World Heritage Sites in South Africa', marks: 12, qpages: 1, mpages: 1,
    covers: 'Question 5.1–5.4 — types of World Heritage Site, where the sites are, and why UNESCO declares them.',
    tags: ['world_heritage_sites', 'unesco_role', 'south_african_heritage'],
    qs: [
      mt('Match each South African World Heritage Site to its province.',
        [['Vredefort Dome', 'Free State'], ['Mapungubwe Cultural Landscape', 'Limpopo'], ['Robben Island', 'Western Cape'], ['uKhahlamba-Drakensberg Park', 'KwaZulu-Natal']],
        { unit: U_CH, topic: 'south_african_world_heritage', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
      mc('iSimangaliso Wetland Park is recognised for its outstanding natural beauty and ecosystems. What type of World Heritage Site is it?',
        'A natural site', ['A cultural site', 'A historical site', 'An industrial site'],
        { unit: U_CH, topic: 'south_african_world_heritage', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
      ms('Robben Island was declared a World Heritage Site. Select ALL the reasons for protecting a site like this.',
        ['To preserve where prisoners were held', 'To acknowledge the liberation struggle', 'To keep its story for future generations'],
        ['To allow any business to build on the island', 'To make entry free for every visitor'],
        { unit: U_CH, topic: 'unesco_role', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 3, type: 'application' }),
      mc('What is the main role of UNESCO in relation to World Heritage Sites?',
        'To declare and help protect valuable sites', ['To market the sites at travel trade shows', 'To collect the tourism levy for the sites', 'To grade all the accommodation near the sites'],
        { unit: U_CH, topic: 'unesco_role', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
    ],
    subs: [
      ex('5.1', 2, ['The extract says the sites relate to the liberation struggle.'], ['Decide whether the sites are natural or cultural.'], ['They are a cultural World Heritage Site.']),
      ex('5.2', 4, ['The extract names some component sites.', 'Think about where they are located.'], ['List the four provinces from the extract and your knowledge.'], ['The provinces are Gauteng, Free State, Eastern Cape and KwaZulu-Natal.']),
      ex('5.3', 2, ['Think about where Mr Mandela was held.'], ['Name another World Heritage Site linked to him.'], ['Robben Island is another site associated with Mr Mandela.']),
      ex('5.4', 4, ['Think about preservation and acknowledgement.'], ['Discuss two reasons UNESCO declared the sites.'], ['1. To protect and preserve sites related to the establishment of our democracy.', '2. To acknowledge Mandela\'s contribution to the liberation struggle.']),
    ],
  },

  // ── L17 ── 6 ─────────────────────────────────────────────────────────────────
  {
    order: 17, name: 'Question 6: Marketing South Africa and TOMSA', marks: 8, qpages: 2, mpages: 1,
    covers: 'Question 6.1–6.3 — how TOMSA is funded, a destination of choice, the fund administrator and the marketing body.',
    tags: ['tomsa_levy', 'destination_of_choice', 'satourism'],
    qs: [
      mc('How does TOMSA raise the money used to market South Africa?',
        'By collecting a 1% levy from contributing tourism businesses', ['By charging a tax on every tourist at the border', 'By selling airline tickets', 'By receiving yearly grants from the Department of Tourism only'],
        { unit: U_M, topic: 'tomsa_funding', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 3, w: 2, type: 'definition' }),
      mc('South Africa is marketed as a destination of choice. What does this mean?',
        'Tourists prefer to visit it rather than other destinations', ['It is the cheapest destination in the world', 'It has no other tourists', 'It only welcomes tourists who have been chosen by the government'],
        { unit: U_M, topic: 'destination_marketing', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
      ms('Select ALL the core functions of SATourism.',
        ['Marketing South Africa abroad', 'Maintaining facility standards', 'Coordinating industry marketing'],
        ['Collecting customs duty at airports', 'Issuing visas to foreign tourists'],
        { unit: U_M, topic: 'satourism_functions', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
      mt('Match each marketing term to its meaning.',
        [['TOMSA', 'Provides extra funding to market South Africa'], ['TBCSA', 'Administers the tourism levy fund'], ['SATourism', 'Markets South Africa locally and internationally'], ['Branding', 'Gives the destination a recognisable identity and logo']],
        { unit: U_M, topic: 'satourism_functions', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'definition' }),
    ],
    subs: [
      ex('6.1', 2, ['Read block B of the TOMSA information.', 'Think about who contributes.'], ['Explain where the funding comes from.'], ['TOMSA collects the tourism levy (1%) from contributors.']),
      ex('6.2', 2, ['Think about tourists choosing between destinations.'], ['Explain the meaning of destination of choice.'], ['South Africa must be marketed so international tourists choose it as a holiday destination.']),
      ex('6.3.1', 2, ['It is a business council.'], ['Name the administrator of the fund.'], ['The Tourism Business Council of South Africa (TBCSA) administers the fund.']),
      ex('6.3.2', 2, ['Its core business is marketing.'], ['Name the body that markets South Africa.'], ['South African Tourism (SATourism) markets South Africa locally and internationally.']),
    ],
  },

  // ── L18 ── 7.1 ───────────────────────────────────────────────────────────────
  {
    order: 18, name: 'Question 7.1: Dress code and professional image', marks: 10, qpages: 2, mpages: 1,
    covers: 'Question 7.1.1–7.1.4 — breaking a dress code, dress to impress, advantages for the business and guiding an employee.',
    tags: ['dress_code', 'professional_image', 'staff_grooming'],
    qs: [
      ms('A lodge\'s dress code states: closed shoes only; clean uniform shirt; name badge worn on the shirt; no caps indoors; hair neat. Jabu arrives for work in sandals, with her name badge in her bag and a cap on. Select ALL the rules she has broken.',
        ['She wears sandals', 'She does not wear her name badge', 'She wears a cap indoors'],
        ['She wears a clean uniform shirt', 'Her hair is neat'],
        { unit: U_TS, topic: 'professional_image', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
      mc('A manager tells new staff to dress to impress. What does the manager mean?',
        'Dress to suit the position and build confidence', ['Wear the most expensive clothes you own', 'Copy the clothes that the guests wear', 'Dress casually so that every guest feels relaxed'],
        { unit: U_TS, topic: 'professional_image', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 2, w: 1, type: 'definition' }),
      ms('Select ALL the advantages for a business when all staff follow the dress code.',
        ['It creates a professional and trustworthy image', 'It helps customers to identify staff easily', 'It sets a standard of hygiene and cleanliness'],
        ['It allows the business to pay staff less', 'It removes the need for staff training'],
        { unit: U_TS, topic: 'professional_image', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 3, type: 'application' }),
      ord('Arrange these actions a manager can take when an employee ignores the dress code, from first to last.',
        ['Remind the employee of the dress code policy', 'Explain why the dress code matters to the business', 'Help the employee find the correct uniform', 'Take further action if the rules continue to be ignored'],
        { unit: U_TS, topic: 'professional_image', subtopic: 'tour_process_sequence', skill: 'sequence_tourism_process', diff: 3, w: 2, type: 'ordering' }),
    ],
    subs: [
      ex('7.1.1', 2, ['Compare the cartoon employee with the dress code list.'], ['Find two items the employee wears that are not allowed.'], ['He is wearing sports or casual shoes and excessive jewellery.']),
      ex('7.1.2', 2, ['Think about the position you work in.'], ['Explain what dress to impress means.'], ['Dress appropriately for the position you are employed for, so customers feel confident about the business.']),
      ex('7.1.3', 4, ['Think about image and identification.'], ['Discuss two advantages.'], ['1. It creates a professional and trustworthy image of the company.', '2. It helps customers easily identify staff members.']),
      ex('7.1.4', 2, ['Think about how to guide, not punish.'], ['Suggest one way a manager can guide the employee.'], ['Remind the employee of the dress code policy.']),
    ],
  },

  // ── L19 ── 7.2 ───────────────────────────────────────────────────────────────
  {
    order: 19, name: 'Question 7.2: Conditions of employment', marks: 6, qpages: 1, mpages: 1,
    covers: 'Question 7.2.1 and 7.2.2 — the core duty in a tourism job and why clear conditions of employment matter.',
    tags: ['conditions_of_employment', 'tourism_employment_contract', 'core_duties'],
    qs: [
      mc('Which is the core (most important) duty of a tour guide?',
        'Guiding visitors safely with accurate facts', ['Selling souvenirs to every visitor on the tour', 'Booking flights for the guests in the group', 'Cleaning the tour coach after every trip'],
        { unit: U_TS, topic: 'conditions_of_employment', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the items that belong in a contract of employment.',
        ['Working hours', 'Annual leave', 'Salary and deductions'],
        ['The employer\'s profit forecast', 'The menu for the staff party'],
        { unit: U_TS, topic: 'conditions_of_employment', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 2, type: 'application' }),
      ms('Select ALL the reasons why an employer should set out clear conditions of employment.',
        ['The daily operations run efficiently', 'Staff behave professionally', 'Employer and employee are both protected'],
        ['Staff can choose their own working hours', 'A written contract is no longer needed'],
        { unit: U_TS, topic: 'conditions_of_employment', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 3, type: 'application' }),
      mt('Match each employment term to its meaning.',
        [['Remuneration', 'Payment received for the work done'], ['Deductions', 'Amounts taken off pay, such as tax and pension'], ['Fringe benefit', 'A non-cash advantage that comes with the job'], ['Termination of service', 'The ending of the contract of employment']],
        { unit: U_TS, topic: 'conditions_of_employment', subtopic: 'tour_term_recall', skill: 'recall_tourism_term', diff: 3, w: 2, type: 'definition' }),
    ],
    subs: [
      ex('7.2.1', 2, ['Think about what a cabin crew member is there to do first.'], ['Identify the most important duty in the extract.'], ['The core duty is ensuring the safety of passengers on board.']),
      ex('7.2.2', 4, ['Think about the airline and the crew.'], ['Give two reasons for clear conditions of employment.'], ['1. To ensure efficiency in the airline\'s daily operations.', '2. To ensure that cabin crew show professionalism.']),
    ],
  },

  // ── L20 ── 8.1 ───────────────────────────────────────────────────────────────
  {
    order: 20, name: 'Question 8.1: Responsible tourist behaviour', marks: 10, qpages: 1, mpages: 1,
    covers: 'Question 8.1.1–8.1.3 — being a responsible tourist, using litter bins and alternatives to single-use plastic bottles.',
    tags: ['responsible_tourist', 'litter_control', 'single_use_plastic'],
    qs: [
      mc('Four tourists picnic at a national park viewpoint. Which one is behaving responsibly?',
        'The one who bins the rubbish and stays on marked paths', ['The one who feeds the baboons for closer photos', 'The one who picks wild flowers as souvenirs', 'The one who plays loud music at the quiet viewpoint all day'],
        { unit: U_SR, topic: 'responsible_tourist', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 2, w: 1, type: 'application' }),
      ms('Select ALL the advantages of putting litter into the bins provided.',
        ['It keeps paths clean and safe for hikers', 'It protects wildlife from litter', 'It makes recycling easier'],
        ['It makes the trail longer for hikers', 'It lets the park stop providing bins'],
        { unit: U_SR, topic: 'litter_control', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 3, type: 'application' }),
      ms('Select ALL the alternatives to carrying water in single-use plastic bottles on a hike.',
        ['A refillable metal bottle', 'A hydration pack that can be refilled', 'Refilling at the park\'s water stations'],
        ['Buying many plastic bottles and leaving them at rest stops', 'Using disposable plastic cups'],
        { unit: U_SR, topic: 'single_use_plastic', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 3, type: 'application' }),
      mt('Match each responsible action to its benefit for the environment.',
        [['Using a refillable bottle', 'Less plastic waste'], ['Staying on marked trails', 'Plants and soil are protected'], ['Taking litter to the bins', 'Wildlife is kept safe from litter'], ['Not feeding animals', 'Animals stay wild and healthy']],
        { unit: U_SR, topic: 'responsible_tourist', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('8.1.1', 2, ['Think about the natural environment and the rules.'], ['Explain what being responsible means.'], ['A responsible tourist respects the natural environment, follows the rules and considers the impact of their actions.']),
      ex('8.1.2', 4, ['Think about hikers and wildlife.'], ['State two advantages of using the bins.'], ['1. It keeps hiking paths and the environment beautiful and safe for other hikers.', '2. It protects wildlife that may swallow the litter.']),
      ex('8.1.3', 4, ['Think about carrying water that can be reused.'], ['Suggest two alternatives to single-use plastic bottles.'], ['1. Use eco-friendly, refillable bottles.', '2. Use water stations provided by some parks.']),
    ],
  },

  // ── L21 ── 8.2 ───────────────────────────────────────────────────────────────
  {
    order: 21, name: 'Question 8.2: Controlling alien invasive plants', marks: 4, qpages: 1, mpages: 1,
    covers: 'Question 8.2.1 and 8.2.2 — the impact of alien plants and the benefit of removing them.',
    tags: ['alien_invasive_plants', 'environmental_practices', 'biodiversity'],
    qs: [
      mc('Alien plants are left to grow uncontrolled in a nature reserve. What is a likely negative impact?',
        'They compete with indigenous plants and upset nature', ['They lower the temperature of the reserve', 'They increase the number of indigenous plant species there', 'They reduce the risk of veld fires there'],
        { unit: U_SR, topic: 'environmental_practices', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the benefits for a nature reserve when a community project removes invasive plants.',
        ['Indigenous plants flourish again', 'Biodiversity is restored faster', 'Positive publicity attracts more visitors'],
        ['The invasive plants use more water', 'The risk of veld fires rises'],
        { unit: U_SR, topic: 'environmental_practices', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 2, type: 'application' }),
      mt('Match each environmental practice to the area it improves.',
        [['Removing alien invasive plants', 'Protecting indigenous biodiversity'], ['Reduce, re-use and recycle', 'Waste management'], ['Fitting water-saving taps', 'Resource management'], ['Placing bins along trails', 'Litter control']],
        { unit: U_SR, topic: 'environmental_practices', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('8.2.1', 2, ['Think about how alien plants affect indigenous plants.'], ['State one negative impact on nature.'], ['Alien plants harm local ecosystems by competing with indigenous species and disrupting the balance of nature.']),
      ex('8.2.2', 2, ['Think about the benefits of a healthy ecosystem.'], ['Discuss one benefit for the reserve.'], ['Removing invasive plants helps preserve the natural biodiversity of the area.']),
    ],
  },

  // ── L22 ── 9.1 ───────────────────────────────────────────────────────────────
  {
    order: 22, name: 'Question 9.1: How an unforeseen event disrupts global tourism', marks: 10, qpages: 1, mpages: 1,
    covers: 'Question 9.1.1–9.1.3 — locating a global event, disruptions to airline operations and the economic impact on tourism businesses.',
    tags: ['unforeseen_occurrences', 'airline_disruption', 'economic_impact_tourism'],
    qs: [
      mc('A severe snowstorm closes a major hub airport for two days. Which category of occurrence is this?',
        'An unforeseen occurrence caused by nature', ['A planned global sporting event abroad', 'A political situation in the host country', 'A marketing campaign by the airline'],
        { unit: U_DRI, topic: 'global_events_and_occurrences', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 1, type: 'application' }),
      ms('Select ALL the disruptions to airline operations that the closure of a hub airport can cause.',
        ['Delayed flights', 'Cancelled flights', 'Diverted flights'],
        ['Lower ticket taxes', 'More empty seats on every route'],
        { unit: U_DRI, topic: 'airline_disruption', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 3, type: 'application' }),
      ms('Select ALL the economic impacts on global tourism businesses after a hub airport closes for two days.',
        ['Airlines pay extra costs to reroute planes', 'Hotels and car hire firms lose bookings', 'Stranded passengers need accommodation'],
        ['Airlines save money on fuel and staff', 'Demand for travel rises worldwide'],
        { unit: U_DRI, topic: 'airline_disruption', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 3, type: 'application' }),
      ord('Arrange these events in the order in which they follow one another.',
        ['A storm closes a hub airport', 'Flights are cancelled or diverted', 'Passengers are stranded and need accommodation', 'Hotels and tour operators lose bookings'],
        { unit: U_DRI, topic: 'airline_disruption', subtopic: 'tour_process_sequence', skill: 'sequence_tourism_process', diff: 3, w: 2, type: 'ordering' }),
    ],
    subs: [
      ex('9.1.1', 2, ['Heathrow is in London.'], ['Name the continent of London.'], ['The event happened in Europe.']),
      ex('9.1.2', 4, ['Read what happened to flights.'], ['Identify two disruptions to airline operations.'], ['1. Delays in flights.', '2. Cancelled flights.']),
      ex('9.1.3', 4, ['Answer for global tourism businesses, not the UK economy.'], ['Discuss two economic impacts.'], ['1. Airports and airlines incurred extra costs to reroute planes.', '2. Stranded passengers needed accommodation.']),
    ],
  },

  // ── L23 ── 9.2 ───────────────────────────────────────────────────────────────
  {
    order: 23, name: 'Question 9.2: Foreign arrivals and source markets', marks: 10, qpages: 1, mpages: 1,
    covers: 'Question 9.2.1–9.2.3 — reading source-market statistics, geographical spread and why African land markets are largest.',
    tags: ['source_markets', 'foreign_arrivals', 'geographical_spread'],
    qs: [
      mc('Illustrative foreign arrivals in a year (thousands): Lesotho 1 620; Mozambique 1 410; United States 410; United Kingdom 380; Germany 270; Netherlands 140. Which source market has the highest number of arrivals?',
        'Lesotho', ['Mozambique', 'United States', 'United Kingdom'],
        { unit: U_DRI, topic: 'foreign_arrivals', subtopic: 'tour_data_interpretation', skill: 'interpret_tourism_stimulus', diff: 2, w: 1, type: 'interpretation' }),
      ord('Illustrative foreign arrivals (thousands): Mozambique 1 410; United States 410; United Kingdom 380; Germany 270. Arrange these markets from the highest to the lowest number of arrivals.',
        ['Mozambique', 'United States', 'United Kingdom', 'Germany'],
        { unit: U_DRI, topic: 'foreign_arrivals', subtopic: 'tour_data_interpretation', skill: 'interpret_tourism_stimulus', diff: 3, w: 2, type: 'interpretation' }),
      ms('Select ALL the reasons why African land markets contribute the largest share of arrivals to South Africa.',
        ['Visa requirements are favourable', 'Land routes are short and transport is affordable', 'Many travel to shop or visit friends and relatives'],
        ['Flights from these countries are very long', 'Visa fees are higher than for long-haul markets'],
        { unit: U_DRI, topic: 'foreign_arrivals', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 3, type: 'application' }),
      mc('A country\'s tourist arrivals become spread over more provinces instead of one. What is one advantage for the tourism industry?',
        'Quiet provinces gain income from more visitors', ['All visitors will choose a single province', 'Provinces will no longer need any marketing', 'Visitor spending falls in every province'],
        { unit: U_DRI, topic: 'foreign_arrivals', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('9.2.1(a)', 2, ['Read the table for the largest figure.'], ['Identify the highest source market.'], ['Zimbabwe, with 2 183 260 arrivals, is the top source market.']),
      ex('9.2.1(b)', 2, ['Order the figures from largest to smallest.'], ['Find the third largest.'], ['The United Kingdom is the third highest source market.']),
      ex('9.2.2', 2, ['Think about provinces that are visited less.'], ['Explain one advantage of a wider geographical spread.'], ['The lesser visited provinces gain economically from the increase.']),
      ex('9.2.3', 4, ['Think about access and reasons for travelling.'], ['Suggest two reasons.'], ['1. Favourable visa requirements allow easier access into South Africa.', '2. Tourists come mainly for shopping and to visit friends and relatives.']),
    ],
  },

  // ── L24 ── 10 ────────────────────────────────────────────────────────────────
  {
    order: 24, name: 'Question 10: Customer feedback', marks: 10, qpages: 2, mpages: 1,
    covers: 'Question 10.1 and 10.2 — why feedback is valuable, winning back an unhappy customer and methods of collecting feedback.',
    tags: ['customer_feedback', 'feedback_methods', 'customer_care'],
    qs: [
      mc('Why can customer feedback be seen as a gift to a business?',
        'It shows how to improve services and keep customers', ['It guarantees that every guest returns again', 'It replaces the need for any staff training', 'It automatically lowers all of the business\'s running costs'],
        { unit: U_CC, topic: 'customer_feedback', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the ways a business can turn an unhappy customer into a happy one.',
        ['Listen so that the customer feels heard', 'Apologise for the poor service', 'Offer an immediate solution'],
        ['Argue about who is right', 'Ask the customer to complain in writing next week'],
        { unit: U_CC, topic: 'customer_feedback', subtopic: 'tour_scenario_application', skill: 'apply_tourism_concept_to_scenario', diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the methods a business can use to collect customer feedback.',
        ['Online surveys', 'Follow-up phone calls', 'SMS or e-mail questionnaires'],
        ['Counting the number of staff on duty', 'Printing prices on a notice board'],
        { unit: U_CC, topic: 'feedback_methods', subtopic: 'tour_classification', skill: 'classify_tourism_concept', diff: 2, w: 2, type: 'application' }),
      mt('Match each feedback method to a benefit or drawback.',
        [['Real-time feedback', 'Lets the business act immediately on a problem'], ['Handwritten survey', 'Can delay the business\'s response'], ['Online survey', 'Reaches many customers quickly'], ['Follow-up phone call', 'Feels personal to the customer']],
        { unit: U_CC, topic: 'feedback_methods', subtopic: 'tour_cause_and_effect', skill: 'explain_tourism_cause_and_effect', diff: 3, w: 3, type: 'application' }),
    ],
    subs: [
      ex('10.1.1', 2, ['Think about what a business learns from complaints.'], ['Explain one reason feedback is a gift.'], ['The business can maintain or improve its services to retain and increase its customer base.']),
      ex('10.1.2', 2, ['Think about how an unhappy customer wants to be treated.'], ['Suggest one way to change the customer\'s mood.'], ['Listen attentively so that the customer feels heard and valued.']),
      ex('10.2.1', 4, ['The diagram already names two methods.'], ['State two other methods.'], ['1. Online surveys that capture customer responses.', '2. Employing people to gather feedback through one-on-one interviews.']),
      ex('10.2.2', 2, ['Compare real-time feedback with a written survey.'], ['Explain one benefit of real-time feedback.'], ['Real-time feedback allows immediate action on the issue while handwritten surveys may delay the process.']),
    ],
  },
];
