'use strict';
// CAT 2025 Nov P2 — Section C, Q10 integrated scenario (lessons 21–24). Practice scenarios are fresh and invented.
const { mc, ms, mt, ord, fb, ex } = require('./lib');
const { U, rec, cls, cau, app, dat } = require('./kit');

module.exports = [
  // ── L21 ── 10.1 ──────────────────────────────────────────────────────────────────────────────
  {
    order: 21, name: 'Question 10.1: Presenting in a hall and updates that must finish', marks: 6, qpages: 1, mpages: 1,
    covers: 'Question 10.1.1, 10.1.2 and 10.1.3 — extra hardware for a presentation, a suitable type of application software and the consequences of switching a laptop off during updates.',
    tags: ['presentation_hardware', 'presentation_software', 'software_updates_risks'],
    qs: [
      ms('A learner will present to a large hall using a laptop. Which TWO additional devices are needed?',
        ['A data projector', 'A microphone'],
        ['A scanner', 'A barcode reader', 'A card reader'],
        app(U.SYS, 'output_devices', { d: 2, w: 2 })),
      mc('A committee wants to show slides with pictures and video clips at an assembly. Which type of application software is most suitable?',
        'Presentation software', ['Spreadsheet software', 'Database software', 'Web browser software'],
        app(U.SYS, 'application_software', { d: 2, w: 1, clues: '- The slides must hold text, images and video.\n- Think about software built for showing slides.' })),
      ms('A laptop is switched off while its updates are still installing. Which TWO consequences can follow?',
        ['The installation is interrupted', 'The software may be left corrupted or with errors'],
        ['The update finishes faster the next time', 'The memory capacity of the laptop increases', 'All the files are backed up automatically'],
        cau(U.SYS, 'software_updates', { d: 3, w: 2 })),
    ],
    subs: [
      ex('10.1.1', 2, ['The chairperson presents in a school hall.', 'Think about what the audience must see and hear.'], ['Name two extra devices.'], ['Any two: data projector, pointing device, smart board, microphone or speakers.']),
      ex('10.1.2', 2, ['Name the type of software and say why it suits.', 'One mark for the type and one for the motivation.'], ['Choose software for showing slides.'], ['1. Presentation software.', '2. It allows visually engaging slides with text, images and multimedia.']),
      ex('10.1.3', 2, ['Updates were installing when the laptop was switched off.', 'Think about what happens to a half-finished installation.'], ['Discuss two consequences.'], ['1. The download or install process is interrupted.', '2. This causes errors or corruption in the software.']),
    ],
  },

  // ── L22 ── 10.2–10.3 ─────────────────────────────────────────────────────────────────────────
  {
    order: 22, name: 'Question 10.2–10.3: Databases, exporting data, mail merge and augmented reality', marks: 7, qpages: 1, mpages: 2,
    covers: 'Question 10.2.1, 10.2.2, 10.2.3 and 10.3 — database objects for capturing data, factors before exporting, generating personalised letters and augmented reality versus virtual reality.',
    tags: ['database_objects', 'exporting_data', 'mail_merge', 'augmented_reality'],
    qs: [
      mt('Match each database object to what it is used for.',
        [['Table', 'Stores the records'],
         ['Form', 'A screen designed for entering one record at a time'],
         ['Query', 'Finds the records that meet given criteria'],
         ['Report', 'Presents selected data in a form that can be printed']],
        cls(U.SD, 'database_design', { d: 2, w: 2 })),
      ms('Which TWO factors should be considered before exporting a database table to a spreadsheet?',
        ['Check that the data types suit a spreadsheet', 'Decide which records must be exported'],
        ['Delete the database once the data has been exported', 'Rename every field to a single letter', 'Give the spreadsheet the same password as the database'],
        app(U.SD, 'database_design', { d: 3, w: 2 })),
      fb('Name the word processing feature that quickly produces a personalised letter for every person in a list. []',
        ['Feature: ', '[ ]'], ['mail merge|mailmerge'], 'text',
        app(U.SD, 'word_processing_features', { d: 2, w: 1 })),
      ms('Which TWO are benefits of using augmented reality (AR) instead of virtual reality (VR) for a guided tour of the school?',
        ['No special headset is needed to use it', 'More learners can join in using their phones'],
        ['It replaces the real world completely', 'It needs no device at all to work properly', 'It only works inside one dedicated room'],
        cau(U.INT, 'emerging_technologies', { d: 3, w: 2 })),
    ],
    subs: [
      ex('10.2.1', 2, ['The learners\' details must be entered into a database.', 'Think about objects used for input.'], ['Name two database objects that can capture data.'], ['1. Table.', '2. Form.']),
      ex('10.2.2', 2, ['A table is moved into a spreadsheet.', 'Think about data types, layout and records.'], ['Name two factors to consider first.'], ['Any two: suitable data types, formatting and layout that display as they are, selecting which records to export, limits for very large numbers of records, or suitability of the data for spreadsheet functions.']),
      ex('10.2.3', 1, ['Each learner receives a personalised letter.', 'Many letters are generated from one document and a list.'], ['Recall the feature that combines a letter with a data source.'], ['Mail merge.']),
      ex('10.3', 2, ['Compare augmented reality with virtual reality.', 'Think about equipment and the real world.'], ['Discuss two benefits of AR.'], ['Any two: no additional equipment such as VR goggles, accessible to more learners, or direct interaction with the real school while receiving digital overlays.']),
    ],
  },

  // ── L23 ── 10.4–10.5 ─────────────────────────────────────────────────────────────────────────
  {
    order: 23, name: 'Question 10.4–10.5: Broadband, bandwidth and gathering reliable data', marks: 8, qpages: 1, mpages: 1,
    covers: 'Question 10.4.1, 10.4.2, 10.5.1 and 10.5.2 — broadband, bandwidth for online gaming, data gathering tools and keeping collected data free from errors.',
    tags: ['broadband_and_bandwidth', 'data_gathering_tools', 'data_accuracy'],
    qs: [
      mc('What is broadband?',
        'A high-speed internet connection that is always on', ['An internet connection that works only at night', 'An internet connection that needs no router at all', 'A dial-up connection that uses a telephone line'],
        rec(U.NET, 'internet_connections', { d: 2, w: 1, type: 'definition' })),
      ms('Which TWO are reasons why the school should have a large bandwidth for online gaming?',
        ['Many learners play at the same time', 'It prevents lagging and buffering during games'],
        ['It makes the computers cheaper to buy', 'It increases the RAM in each computer', 'It lets games run without any computers'],
        cau(U.NET, 'internet_connections', { d: 3, w: 2 })),
      ms('Which TWO tools can be used to gather direct feedback from learners?',
        ['A survey, online or on paper', 'An interview'],
        ['A spreadsheet formula', 'A firewall', 'A scanner'],
        app(U.IM, 'gathering_data', { d: 3, w: 2 })),
      mt('Match each questionnaire feature to its effect on the data collected.',
        [['Drop-down list', 'Limits the answers to a set list of choices'],
         ['Date picker', 'Prevents dates that are typed in the wrong form'],
         ['Open-ended question', 'Lets respondents type anything, so answers vary widely'],
         ['Check box', 'Lets a respondent tick one or more listed options']],
        cls(U.IM, 'gathering_data', { d: 3, w: 2 })),
    ],
    subs: [
      ex('10.4.1', 2, ['Broadband describes a type of connection.', 'Two features are asked for.'], ['Describe its speed and its availability.'], ['1. A high-speed connection.', '2. An always-on internet connection.']),
      ex('10.4.2', 2, ['Many learners will play at the same time.', 'Think about lag and buffering.'], ['Give two reasons for a large bandwidth.'], ['Any two: no lagging or buffering, many learners online at once, online multiplayer play, or a more enjoyable and engaging experience.']),
      ex('10.5.1', 2, ['The committee wants direct feedback from learners.', 'Think about ways of asking people.'], ['Suggest two data gathering tools.'], ['Any two: a survey (online or paper-based), an interview, or a WhatsApp poll.']),
      ex('10.5.2', 2, ['The data must be free from errors before analysis.', 'Think about how respondents answer.'], ['State two ways to prevent errors.'], ['Any two: use controls such as combo boxes, check boxes, drop-down lists or date pickers; avoid open-ended questions; give the survey to the correct or suitable participants.']),
    ],
  },

  // ── L24 ── 10.6–10.7 ─────────────────────────────────────────────────────────────────────────
  {
    order: 24, name: 'Question 10.6–10.7: Drones and distribution lists', marks: 4, qpages: 1, mpages: 2,
    covers: 'Question 10.6 and 10.7 — limitations of drone technology and advantages of an e-mail distribution list.',
    tags: ['drone_technology', 'distribution_lists'],
    qs: [
      ms('Which TWO are limitations of using drones to capture video?',
        ['Battery life is limited', 'Camera quality may be poor'],
        ['Drones cannot fly outdoors', 'Drones cannot record any video', 'Drones need a cable to the ground'],
        cau(U.INT, 'emerging_technologies', { d: 3, w: 2 })),
      mc('What is an e-mail distribution list?',
        'A group of e-mail addresses saved under one name', ['A list of e-mails waiting to be deleted', 'A folder in which all spam messages are stored by the server', 'A schedule showing when e-mails will be sent'],
        rec(U.INT, 'email_features', { d: 2, w: 1, type: 'definition' })),
      ms('Which TWO are advantages of sending a message to a distribution list?',
        ['Time is saved because only the group name is typed', 'There is less chance of leaving out an address'],
        ['The message is hidden from every recipient', 'Attachments automatically become smaller', 'The e-mail never reaches a spam folder'],
        cau(U.INT, 'email_features', { d: 3, w: 2 })),
      mt('Match each term to the description that fits it.',
        [['Drone', 'A remote-controlled flying device that can carry a camera'],
         ['Distribution list', 'A group of addresses used to send one e-mail to many people'],
         ['Augmented reality', 'Digital information shown over a view of the real world'],
         ['Autonomous vehicle', 'A self-driving vehicle that senses its surroundings']],
        rec(U.INT, 'emerging_technologies', { d: 2, w: 2 })),
    ],
    subs: [
      ex('10.6', 2, ['Drones capture video outdoors.', 'Think about power, picture quality and storage.'], ['State two limitations.'], ['Any two: limited battery life, potentially poor camera quality, potentially low storage capacity, or the risk of flying drones over people.']),
      ex('10.7', 2, ['The link is e-mailed to many parents.', 'Think about time and accuracy.'], ['State two advantages of a distribution list.'], ['Any two: saves time by typing only the group name, more accuracy because addresses cannot be left out, or the message is sent to many recipients at once.']),
    ],
  },
];
