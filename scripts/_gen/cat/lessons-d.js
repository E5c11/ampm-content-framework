'use strict';
// CAT 2025 Nov P2 — Section C, Q9 integrated scenario (lessons 17–20). Practice scenarios are fresh and invented; brand names never appear in options.
const { mc, ms, mt, ord, ex } = require('./lib');
const { U, rec, cls, cau, app, dat } = require('./kit');

module.exports = [
  // ── L17 ── 9.1 ───────────────────────────────────────────────────────────────────────────────
  {
    order: 17, name: 'Question 9.1: Comparing laptop quotations and operating systems', marks: 7, qpages: 1, mpages: 1,
    covers: 'Question 9.1.1–9.1.5 — the installed operating system, functions of an operating system, comparing two quotations, the 802.11 specification and free antivirus software.',
    tags: ['operating_systems', 'comparing_quotations', 'wireless_standards', 'free_antivirus'],
    figs: [{
      kind: 'table', label: 'Two laptop quotations', title: 'Laptop quotations', cols: ['', 'Laptop A', 'Laptop B'], colw: [1.1, 1.6, 1.8],
      rows: [[{ t: 'Display', b: true }, '15.6" Full HD', '14" OLED'], [{ t: 'RAM', b: true }, '8 GB', '16 GB'],
        [{ t: 'Storage', b: true }, '1 TB hard disk (HDD)', '512 GB solid-state drive (SSD)'], [{ t: 'Processor', b: true }, '4 cores, 2.2 to 3.9 GHz', '8 cores, 1.8 to 4.5 GHz'],
        [{ t: 'Wireless', b: true }, '802.11 b/g/n', '802.11 b/g/n'], [{ t: 'Warranty', b: true }, '2 years', '2 years'], [{ t: 'Antivirus', b: true }, 'Free version', 'Free version']],
    }],
    qs: [
      ms('Study the quotations. Which TWO are reasons why Laptop B is the better choice?',
        ['It has more RAM, so programs run more smoothly', 'It uses an SSD, which is faster than a hard disk'],
        ['It has a larger screen than the other laptop', 'It has a longer warranty than the other laptop', 'It uses a faster wireless standard than the other laptop'],
        dat(U.SYS, 'buying_decisions', { d: 3, w: 3, fig: 0, clues: '- Compare the two columns row by row.\n- Only a difference counts as a reason.' })),
      mt('Match each type of software to its description.',
        [['Operating system', 'Manages the hardware and provides the user interface'],
         ['Application software', 'Programs used for tasks such as writing or calculating'],
         ['Utility program', 'A maintenance tool such as a backup or disk clean-up program'],
         ['Driver', 'Lets the operating system communicate with a hardware device']],
        cls(U.SYS, 'system_software', { d: 2, w: 2 })),
      mc('What is the purpose of the 802.11 specification listed for both laptops?',
        'It lets the laptop connect to a wireless network', ['It sets the screen resolution of the laptop display', 'It states the processor speed of the laptop', 'It gives the battery capacity of the laptop'],
        rec(U.NET, 'wireless_technologies', { d: 3, w: 2, fig: 0 })),
      mc('Which disadvantage can come with using a free antivirus program?',
        'It may offer only limited technical support', ['It can only scan one single file at a time', 'It always halves the speed of the network connection', 'It works only when the computer is offline'],
        cau(U.SOC, 'malware_and_threats', { d: 3, w: 2 })),
    ],
    subs: [
      ex('9.1.1', 1, ['Look at the software listed for both laptops.', 'The question asks for the operating system.'], ['Find the item that is system software, not an application.'], ['Windows.']),
      ex('9.1.2', 2, ['The operating system controls the computer.', 'Give TWO functions.'], ['Think about hardware, software, the interface, files, security and memory.'], ['Any two of: manages and controls the hardware, manages and controls the software, provides a user interface, organises files and folders, provides basic security, input and output, memory and device management.']),
      ex('9.1.3', 2, ['Compare the two quotations row by row.', 'Look for hardware that makes Quotation 2 stronger.'], ['Compare RAM, storage, number of cores and software.'], ['Any two: more primary memory, an SSD that is faster because it is electronic, more cores to process instructions, or Office 365 with the latest features.']),
      ex('9.1.4', 1, ['802.11 is a networking specification.', 'Both laptops list it.'], ['Recall which kind of network 802.11 belongs to.'], ['The laptops can connect to a wireless network.']),
      ex('9.1.5', 1, ['The antivirus is free.', 'Think about what a free product may lack or include.'], ['Give one disadvantage.'], ['Any one: limited technical support, many different versions, may contain malware in certain versions, no guarantee it will not harm the system, or additional pop-up advertisements.']),
    ],
  },

  // ── L18 ── 9.2–9.3 ───────────────────────────────────────────────────────────────────────────
  {
    order: 18, name: 'Question 9.2–9.3: Networks, ethical use, BYOD and a video that will not open', marks: 9, qpages: 2, mpages: 2,
    covers: 'Question 9.2.1–9.2.3 and 9.3.1–9.3.2 — choosing a network type and medium, ethical use of a network, disadvantages of BYOD and fixing a video that does not respond.',
    tags: ['network_types', 'network_media', 'ethical_network_use', 'byod', 'video_file_problems'],
    qs: [
      mt('Match each network type to the description that fits it.',
        [['LAN', 'Computers in a small area such as a lab or a school'],
         ['WAN', 'Computers spread over a large geographic area, such as the internet'],
         ['PAN', 'Devices around one person, such as a phone and earphones'],
         ['WLAN', 'A local network in which devices connect wirelessly']],
        cls(U.NET, 'network_types', { d: 2, w: 2, clues: '- Think about how far apart the computers are.\n- The first letter of each term is a clue.' })),
      mc('A lab has ten computers in a room with a lot of electrical interference. Which connection medium is best and why?',
        'Fibre optic cable, because electrical interference does not affect it', ['Wi-Fi, because it is not affected by electrical interference', 'Radio waves, because they never lose their signal strength over distance', 'Copper cable, because it cannot be affected by any interference'],
        app(U.NET, 'network_media', { d: 4, w: 3 })),
      ms('Which TWO actions help a club make sure that its network is used ethically?',
        ['Give each user a unique log-in and a strong password', 'Set different access rights for different users'],
        ['Share one password with all club members', 'Give every member full administrator access', 'Keep the network policy secret from members'],
        app(U.NET, 'network_policies', { d: 3, w: 2 })),
      ms('Which TWO are disadvantages of letting learners bring their own devices (BYOD)?',
        ['Personal devices may be stolen', 'Devices may not work with the club\'s software'],
        ['Every learner gets faster internet automatically', 'The school has to buy every device itself', 'Viruses cannot spread over the network'],
        cau(U.NET, 'byod', { d: 3, w: 2 })),
      ms('A video file does not respond when a learner opens it. Which TWO actions could solve the problem?',
        ['Update or reinstall the video player', 'Convert the file to another video format'],
        ['Delete the operating system and start again', 'Disconnect the monitor cable and reconnect it', 'Increase the screen brightness to the maximum'],
        app(U.SYS, 'troubleshooting', { d: 3, w: 2 })),
    ],
    subs: [
      ex('9.2.1', 1, ['A WAN covers a large area.', 'The computers are in a school lab.'], ['Compare the area of the computers with the area a WAN serves.'], ['The computers are in a small geographic area (the school lab).']),
      ex('9.2.2', 2, ['Choose a medium and give a reason.', 'One mark for the medium and one for the motivation.'], ['Pick wireless or wired and justify it.'], ['1. Name a wired or wireless connection.', '2. Give a reason: wireless gives less clutter, easy addition of devices and mobility; wired is less prone to interference, stable in speed, and fibre optic has no electrical interference.']),
      ex('9.2.3', 2, ['Ethical use means using the network responsibly.', 'Think about log-ins and policies.'], ['Explain two ways to ensure it.'], ['Any two: unique log-in with strong passwords, different access rights or reviewed permissions, regular password changes, clearly informing members of network policies and data usage.']),
      ex('9.3.1', 2, ['BYOD means learners bring their own devices.', 'Think about security and compatibility.'], ['State two disadvantages for the club.'], ['Any two: devices can be stolen, compatibility problems, distractions from apps or games, malware spreading over the network, difficulty controlling data usage, not all learners have a device, security cannot be enforced on all devices, network bottleneck, access to sensitive data.']),
      ex('9.3.2', 2, ['The video file does not respond.', 'Think about the software that plays it and the file format.'], ['State two ways to resolve it.'], ['Any two: update or re-install software, close unused tasks, restart the device, use another video player, update codecs, or convert to another video format.']),
    ],
  },

  // ── L19 ── 9.4–9.5 ───────────────────────────────────────────────────────────────────────────
  {
    order: 19, name: 'Question 9.4–9.5: Spreadsheet errors, fitting a table in a document and the body tag', marks: 4, qpages: 1, mpages: 1,
    covers: 'Question 9.4.1, 9.4.2 and 9.5 — the #NAME? error, fitting all columns of a table on a page and the purpose of the body tag.',
    tags: ['spreadsheet_errors', 'table_formatting', 'html_body_tag'],
    figs: [{
      kind: 'table', label: 'Hours trained per day', sheet: true, cols: ['Day', 'Hours'], colw: [1.8, 1.2],
      rows: [['Monday', { t: '2', a: 'r' }], ['Tuesday', { t: '3', a: 'r' }], ['Wednesday', { t: '1', a: 'r' }], ['Thursday', { t: '2', a: 'r' }], [{ t: 'Total', b: true }, { t: '#NAME?', a: 'r', bg: '#FFE8A3' }]],
    }],
    qs: [
      mc('A learner typed =SUMM(B2:B5) in cell B6 and the cell shows #NAME?. What does this error mean?',
        'The function name was spelled incorrectly', ['The range contains text instead of numbers', 'The formula is dividing a number by zero', 'The cell reference is no longer valid'],
        dat(U.SD, 'spreadsheet_errors', { d: 3, w: 2, fig: 0, clues: '- Look at the function name in the formula.\n- Compare it with the real function name.' })),
      mt('Match each spreadsheet error value to what it means.',
        [['#NAME?', 'The function name was not recognised'],
         ['#DIV/0!', 'The formula divides a number by zero'],
         ['#REF!', 'A cell reference is no longer valid'],
         ['#VALUE!', 'The wrong type of data is used in the formula']],
        rec(U.SD, 'spreadsheet_errors', { d: 3, w: 2 })),
      ms('A spreadsheet table is pasted into a word processing document, but some columns do not fit on the page. Without changing the font size, which TWO actions can make all columns fit?',
        ['Adjust the column widths', 'Use AutoFit to the contents of the table'],
        ['Make the font size larger instead', 'Add more columns to the table', 'Change the page colour to a lighter shade'],
        app(U.SD, 'word_processing_features', { d: 3, w: 2 })),
      mc('What is the purpose of the body tag in HTML?',
        'It holds the content shown in the browser window', ['It holds the title shown on the browser tab', 'It defines the style rules for the whole web page', 'It links the page to another website'],
        rec(U.SD, 'html_basics', { d: 3, w: 1 })),
    ],
    subs: [
      ex('9.4.1', 1, ['The function was typed as SUMS.', 'Look at what #NAME? tells the user.'], ['Compare the typed function with a real function name.'], ['The function is typed incorrectly: there is a spelling error in cell B7.']),
      ex('9.4.2', 2, ['The table is wider than the page.', 'The font size must stay the same.'], ['Think about the table, not the text.'], ['1. Adjust the column widths.', '2. Use AutoFit to the contents.']),
      ex('9.5', 1, ['An HTML document has a head and a body.', 'The spreadsheet data goes in the body.'], ['Recall what the body tag contains.'], ['The body tag contains the content that is displayed in the browser window.']),
    ],
  },

  // ── L20 ── 9.6–9.7 ───────────────────────────────────────────────────────────────────────────
  {
    order: 20, name: 'Question 9.6–9.7: Social networks, cybersecurity and plagiarism', marks: 5, qpages: 1, mpages: 1,
    covers: 'Question 9.6.1, 9.6.2 and 9.7 — advantages of online social networks, why cybersecurity matters and the meaning of plagiarism.',
    tags: ['online_social_networks', 'cybersecurity', 'plagiarism'],
    qs: [
      ms('Which TWO are advantages of learners using online social networks to research and solve problems?',
        ['They can reach people with a wide range of expertise', 'They can get quick feedback on a question'],
        ['Everything posted is guaranteed to be accurate', 'No account or sign-up is needed to take part', 'Learners can never be distracted by them'],
        cau(U.SOC, 'social_networking', { d: 3, w: 2 })),
      mc('Why is cybersecurity important while learners use online social networks?',
        'It protects devices and data from malware and hacking', ['It makes the posts load faster on every device', 'It increases the number of followers each learner has', 'It removes the need to use passwords on any account'],
        cau(U.SOC, 'online_safety', { d: 3, w: 1 })),
      mc('Which situation is plagiarism?',
        'Copying a paragraph from a website into an assignment without crediting the source', ['Quoting a sentence and listing the source in the bibliography', 'Summarising a chapter in your own words and referencing it', 'Using a picture under a Creative Commons licence and crediting its original creator'],
        cls(U.SOC, 'legal_and_ethical_issues', { d: 3, w: 2, clues: '- Plagiarism is about presenting someone else\'s work as your own.\n- Giving credit is the opposite.' })),
    ],
    subs: [
      ex('9.6.1', 2, ['Online social networks connect many people.', 'Think about expertise, feedback and teamwork.'], ['State two advantages for learners.'], ['Any two: a wide range of expertise, immediate feedback, or enhanced collaborative problem solving.']),
      ex('9.6.2', 1, ['Learners share information on the networks.', 'Think about what could happen to devices and data.'], ['Give one reason cybersecurity matters.'], ['Any one: protects devices from malware and hacking, safeguards sensitive data, or prevents unauthorised access.']),
      ex('9.7', 2, ['Plagiarism leads to disqualification.', 'It concerns someone else\'s work.'], ['Explain what is used and what is missing.'], ['1. Using someone else\'s work or ideas.', '2. Presenting them as your own without giving proper credit.']),
    ],
  },
];
