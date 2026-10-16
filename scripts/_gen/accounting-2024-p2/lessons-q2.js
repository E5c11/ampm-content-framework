'use strict';
// Accounting 2024 Nov P2 — Question 2 (Stock valuation) lessons 6–10. Fresh numbers; every figure computed and asserted.
const assert = require('assert');
const { mc, ms, mt, fb, ex, fmt, blank } = require('./lib');

const LN = (t, ...c) => ({ k: 'line', c: [t, ...c] });
const TOT = (t, ...c) => ({ k: 'total', c: [t, ...c] });

const U = 'stock_valuation';
const SK = { stmt: 'complete_financial_statement', calc: 'calculate_accounting_amount', term: 'recall_accounting_term', cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario', int: 'interpret_financial_indicators' };

// L6: weighted average and stolen units (Sole Sneakers)
const open6 = { u: 400, r: 400 * 2400 };
const buys6 = [['April 2025 (R2 600 each)', 600, 2600], ['July 2025 (R2 860 each)', 500, 2860], ['October 2025 (R3 000 each)', 730, 3000], ['Returns: November 2025 (R3 000 each)', -30, 3000]];
const pu6 = buys6.reduce((a, b) => a + b[1], 0), pr6 = buys6.reduce((a, b) => a + b[1] * b[2], 0);
const wa6 = (open6.r + pr6) / (open6.u + pu6), sold6 = 1650, count6 = 480, stolen6 = open6.u + pu6 - sold6 - count6;
assert.strictEqual(pu6, 1800); assert.strictEqual(pr6, 5090000); assert.strictEqual(wa6, 2750); assert.strictEqual(stolen6, 70); assert.strictEqual(stolen6 * wa6, 192500);
// L7: FIFO (Pebble Bags) — closing 420 = 280 from September (net of returns) + 140 from June
const sepNet = 300 - 20, fA = sepNet * 960, fB = 420 - sepNet, fC = fA + fB * 900;
assert.strictEqual(fA, 268800); assert.strictEqual(fB, 140); assert.strictEqual(fC, 394800);
assert.strictEqual(180 * 120 + 70 * 110, 29300);
// L9: mark-up
const jk = { cost: 600, sp: 1080, sold: 540 }, ts = { cost: 250, sp: 390, sold: 1400 };
assert.strictEqual((jk.sp - jk.cost) / jk.cost * 100, 80); assert.strictEqual((ts.sp - ts.cost) * 100 / ts.cost, 56);
assert.strictEqual(((jk.sp - jk.cost) * jk.sold) / (jk.cost * jk.sold) * 100, 80);
assert.strictEqual((720 - 450) / 450 * 100, 60);
// L10: stockholding period of a product sold for 90 days (1 Dec 2025 – 28 Feb 2026)
const days10 = 31 + 31 + 28;
assert.strictEqual(days10, 90); assert.strictEqual(80 / 600 * days10, 12); assert.strictEqual((80 * 900) / (600 * 900) * days10, 12);
assert.strictEqual(Math.round(150 / 1200 * 365 * 10) / 10, 45.6);

module.exports = [
  // ── L06 ── 2.1.1–2.1.2 weighted average and stolen stock ────────────────────
  {
    order: 6, figVer: 2, name: 'Question 2.1.1–2.1.2: Weighted-average cost and stolen stock', marks: 11, qp: '6', mp: '4', qpages: 1, mpages: 1,
    covers: 'Questions 2.1.1 and 2.1.2 — the weighted-average cost of one unit, the number of units stolen and their value.',
    tags: ['weighted_average_stock_valuation', 'stock_theft'],
    info: [
      'Sole Sneakers sells one type of sneaker. The financial year ended on 28 February 2026.',
      'Opening stock on 1 March 2025: 400 pairs costing R960 000.',
      'Sales: 1 650 pairs were sold during the year at R4 200 per pair.',
      'A physical stock count on 28 February 2026 found 480 pairs on hand.',
    ],
    figs: [{
      title: 'Purchases: Sole Sneakers', subtitle: 'year ended 28 February 2026', cols: ['', 'Units', 'Total (R)'],
      rows: [
        ...buys6.map(([t, u, p]) => LN(t, u < 0 ? `(${-u})` : fmt(u), fmt(u * p))),
        TOT('Net purchases', fmt(pu6), fmt(pr6)),
      ],
    }],
    qs: [
      fb('Use the information in the figure. Calculate the weighted-average cost of ONE pair of sneakers.',
        ['Weighted-average cost = R ', '[ ]'], [String(wa6)], 'standard_math',
        { fig: 0, unit: U, topic: 'closing_stock_valuation', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 3, type: 'calc',
          clues: '- Include the opening stock with the purchases.\n- Returns have already been deducted from the purchases.' }),
      fb('Use the information in the figure. Calculate the number of pairs that were stolen during the year.',
        ['Pairs stolen = ', '[ ]'], [String(stolen6)], 'standard_math',
        { fig: 0, unit: U, topic: 'closing_stock_valuation', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc',
          clues: '- Start with all the pairs available for sale.' }),
      mc('Which calculation gives the number of units stolen during the year?',
        'Units available for sale − units sold − units counted', ['Units purchased − units sold − units counted', 'Units available for sale − units sold + units counted', 'Opening units + units sold − units counted'],
        { unit: U, topic: 'closing_stock_valuation', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the items used to calculate the weighted-average cost of one unit.',
        ['Opening stock units and cost', 'Purchases during the year', 'Returns to the supplier, deducted'],
        ['Units sold at the selling price', 'Units counted at the year-end'],
        { unit: U, topic: 'closing_stock_valuation', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('2.1.1', 5, ['Weighted average uses the total cost of all units available for sale.', 'Opening stock and net purchases (after returns) are both included.'],
        ['Add the cost of opening stock and purchases.', 'Divide by the total number of units available.'],
        ['(R1 719 000 + R8 781 000) ÷ (620 + 2 380) = R10 500 000 ÷ 3 000 = R3 500 per pair.']),
      ex('2.1.2', 6, ['Units available minus units sold should equal the units counted.', 'The difference is the number stolen.'],
        ['Subtract the units sold and the units counted from the units available.', 'Value the stolen units at the weighted-average cost.'],
        ['Units stolen: 3 000 − 2 050 − 840 = 110 pairs.', 'Value: 110 × R3 500 = R385 000.']),
    ],
  },

  // ── L07 ── 2.1.3 FIFO closing stock ─────────────────────────────────────────
  {
    order: 7, name: 'Question 2.1.3: Closing stock using FIFO', marks: 5, qp: '6', mp: '4', qpages: 1, mpages: 1,
    covers: 'Question 2.1.3 — valuing closing stock with the first-in-first-out method, working back from the latest purchases (net of returns).',
    tags: ['fifo_stock_valuation', 'stock_valuation_methods'],
    info: [
      'Pebble Bags uses the FIFO method. Closing stock on 31 December 2025: 420 bags.',
      'Purchases: March 400 bags at R850; June 350 bags at R900; September 300 bags at R960.',
      '20 bags from the September purchase were returned to the supplier.',
    ],
    figs: [{
      title: 'Closing stock (FIFO): Pebble Bags', subtitle: 'on 31 December 2025', cols: ['', 'Units', 'R'],
      rows: [
        LN('From September purchases (net)', fmt(sepNet), blank('A')),
        LN('From June purchases', blank('B'), ''),
        TOT('Closing stock', fmt(420), blank('C')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], [String(fA), String(fB), String(fC)], 'standard_math',
        { fig: 0, unit: U, topic: 'fifo_stock_valuation', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Under FIFO the latest purchases are still on hand.\n- B is in units; A and C are in rand.' }),
      fb('A business has 250 units in closing stock. Its last purchase was 180 units at R120 each; the one before was 300 units at R110 each. Calculate closing stock using FIFO.',
        ['Closing stock = R ', '[ ]'], ['29300'], 'standard_math',
        { unit: U, topic: 'fifo_stock_valuation', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      mc('Under the FIFO method, which units are assumed to remain in closing stock?',
        'The units that were purchased most recently', ['The units that were purchased earliest in the year', 'An average of all the units bought in the year', 'The units that had the lowest cost price'],
        { unit: U, topic: 'fifo_stock_valuation', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 1, type: 'definition' }),
      ms('Select ALL the statements that are TRUE of the FIFO method.',
        ['Closing stock is valued at the latest prices', 'Cost of sales uses the earliest prices'],
        ['Closing stock is valued at an average price', 'Each item is tagged with its own cost', 'Returns are valued at the opening price'],
        { unit: U, topic: 'fifo_stock_valuation', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [ex('2.1.3', 5,
      ['FIFO assumes the oldest stock is sold first, so closing stock comes from the latest purchases.', 'Deduct the returns from the purchase they came from.'],
      ['Take units from the latest purchase first, then the one before, until 840 units are reached.', 'Value each batch at its own unit price.'],
      ['November: (745 − 20) = 725 × R4 200 = R3 045 000.', 'August: (840 − 725) = 115 × R3 750 = R431 250.', 'Closing stock (FIFO) = R3 476 250.'])],
  },

  // ── L08 ── 2.1.4 stock theft ────────────────────────────────────────────────
  {
    order: 8, name: 'Question 2.1.4: Proving stock theft and acting against the culprits', marks: 6, qp: '6', mp: '5', qpages: 1, mpages: 1,
    covers: 'Question 2.1.4 — how the owner could prove that a salesperson and a supplier\'s driver stole stock, and the action to take against each.',
    tags: ['stock_theft', 'ethics_and_whistle_blowing'],
    qs: [
      mc('A salesperson and a supplier\'s driver sold stock cheaply. The stock was invoiced to the business but never reached the shelves. Which evidence would best prove this?',
        'Compare supplier invoices with delivery notes and counts', ['Compare this year\'s sales total with last year\'s total', 'Compare the selling prices with those at competitors', 'Compare the cash in the till with the cash budget'],
        { unit: U, topic: 'inventory_management_decisions', subtopic: 'acc_scenario_application', skill: SK.app, diff: 3, w: 2, type: 'application' }),
      ms('Select the TWO suitable actions against the salesperson who took part in the theft.',
        ['Hold a fair disciplinary hearing', 'Recover the losses from his salary'],
        ['Move him to the stockroom without a hearing', 'Let him keep working with the same driver', 'Wait for the supplier to discipline him'],
        { unit: U, topic: 'inventory_management_decisions', subtopic: 'acc_scenario_application', skill: SK.app, diff: 3, w: 2, type: 'application' }),
      mt('Match each person or party to a suitable action.',
        [['The salesperson', 'Hold a disciplinary hearing'], ['The supplier\'s driver', 'Bar him from the premises'], ['The whistle-blower', 'Protect his identity'], ['The supplier', 'Add penalties to the contract']],
        { unit: U, topic: 'inventory_management_decisions', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      mc('Why is a whistle-blower\'s report on its own not enough to dismiss an employee?',
        'The facts must first be confirmed in a fair hearing', ['Whistle-blowers may not report on fellow employees', 'Only the external auditor may report stock theft', 'Stock theft is not a valid reason for a dismissal'],
        { unit: U, topic: 'inventory_management_decisions', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [ex('2.1.4', 6,
      ['The stock was invoiced to the business but sold by Micha and Jack at a reduced price.', 'A whistle-blower reported it, and the stock was confirmed missing.'],
      ['Find evidence that links the delivery to the missing stock.', 'Give one action for the employee (Micha) and one for the supplier\'s driver (Jack).'],
      ['Proof (any one): the whistle-blower\'s statement confirmed by findings; compare invoices with orders and delivery notes; count stock on delivery; tracking records; CCTV footage.',
        'Micha: disciplinary hearing or suspension, criminal charges, or recovering the loss from his salary.',
        'Jack: report him to the supplier, bar him from the premises, lay criminal charges, or claim compensation.'])],
  },

  // ── L09 ── 2.2.1–2.2.2 mark-up and returns ──────────────────────────────────
  {
    order: 9, name: 'Question 2.2.1–2.2.2: Mark-up percentage and customer returns', marks: 7, qp: '7', mp: '5-6', qpages: 1, mpages: 2,
    covers: 'Questions 2.2.1 and 2.2.2 — the mark-up achieved on trousers and whether it benefits the business, and the negative effect of high returns.',
    tags: ['mark_up_percentage', 'pricing_decision_effect'],
    figs: [{
      title: 'Product information: Fit-Wear Boutique', subtitle: 'year ended 28 February 2026', cols: ['', 'Jackets', 'T-shirts'],
      rows: [
        LN('Units sold', fmt(jk.sold), fmt(ts.sold)),
        LN('Returns by customers', '10', '150'),
        LN('Stockholding period', '172 days', '31 days'),
        LN('Cost price per item', 'R' + fmt(jk.cost), 'R' + fmt(ts.cost)),
        LN('Selling price per item', 'R' + fmt(jk.sp), 'R' + fmt(ts.sp)),
        LN('Mark-up percentage', blank('A'), '56%'),
        LN('Cost of sales', fmt(jk.cost * jk.sold), fmt(ts.cost * ts.sold)),
      ],
    }],
    qs: [
      fb('Use the information in the figure. Calculate the mark-up percentage A achieved on jackets.',
        ['A = ', '[ ]', ' %'], ['80'], 'standard_math',
        { fig: 0, unit: U, topic: 'mark_up_and_pricing', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 3, type: 'calc',
          clues: '- Mark-up is calculated on cost price, not on selling price.' }),
      fb('A pair of trousers costs R450 and sells for R720. Calculate the mark-up percentage.',
        ['Mark-up = ', '[ ]', ' %'], ['60'], 'standard_math',
        { unit: U, topic: 'mark_up_and_pricing', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      mc('Jackets cost R600 and sell for R1 080 (a high mark-up), and their stockholding period is 172 days. What is the most likely effect on the business?',
        'Customers buy elsewhere, so jackets sell slowly and date', ['Customers buy more jackets because the price shows quality', 'The business sells its jackets faster than its T-shirts', 'Cash flow improves because every jacket earns more profit'],
        { unit: U, topic: 'mark_up_and_pricing', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
      ms('Customers returned 150 T-shirts. Select the TWO negative effects on the business.',
        ['Lower sales revenue and gross profit', 'Damage to the business\'s reputation'],
        ['A higher mark-up on each T-shirt sold', 'A lower cost price from the supplier', 'Faster payment by credit customers'],
        { unit: U, topic: 'mark_up_and_pricing', subtopic: 'acc_interpretation', skill: SK.int, diff: 2, w: 2, type: 'interpretation' }),
    ],
    subs: [
      ex('2.2.1', 5, ['Mark-up % = (selling price − cost price) ÷ cost price × 100.', 'A high mark-up must be judged against how fast the stock sells.'],
        ['Calculate the mark-up on one pair of trousers (or on total sales and cost of sales).', 'Link the mark-up to the stockholding period of 186 days.'],
        ['(R920 − R500) ÷ R500 × 100 = 84% (or (R515 200 − R280 000) ÷ R280 000 × 100).',
          'Not beneficial: price-sensitive customers buy elsewhere; the 186-day stockholding period shows slow sales and stock going out of fashion.']),
      ex('2.2.2', 2, ['120 of the casual shirts sold came back.'], ['Give one negative effect of high returns.'],
        ['Lost revenue and lower gross profit, damage to the business\'s reputation, or extra cost to prepare returned shirts for resale.']),
    ],
  },

  // ── L10 ── 2.2.3 stockholding period of a new product ───────────────────────
  {
    order: 10, name: 'Question 2.2.3: Stockholding period of a new product', marks: 6, qp: '7', mp: '6', qpages: 1, mpages: 1,
    covers: 'Question 2.2.3 — the number of days needed to sell the closing stock of a product sold for part of the year, and one other concern about it.',
    tags: ['stockholding_period', 'new_product_performance'],
    info: [
      'Fit-Wear Boutique started selling formal dresses on 1 December 2025. The financial year ended on 28 February 2026.',
      'Dresses are sold in the shop only; other items are also sold online.',
    ],
    figs: [{
      title: 'Formal dresses: Fit-Wear Boutique', subtitle: '1 December 2025 to 28 February 2026', cols: ['', 'Dresses'],
      rows: [
        LN('Units purchased', fmt(680)),
        LN('Units sold', fmt(600)),
        LN('Closing stock (units)', fmt(80)),
        LN('Cost price per dress', 'R' + fmt(900)),
        LN('Selling price per dress', 'R' + fmt(1080)),
        LN('Mark-up percentage', '20%'),
        LN('Cost of sales', fmt(540000)),
      ],
    }],
    qs: [
      fb('Use the information in the figure. Calculate how many days it will take to sell the closing stock of dresses.',
        ['Days = ', '[ ]'], ['12'], 'standard_math',
        { fig: 0, unit: U, topic: 'stockholding_period', subtopic: 'acc_calculation', skill: SK.calc, diff: 4, w: 3, type: 'calc',
          clues: '- The dresses were only sold for part of the year.\n- Count the days from 1 December to 28 February.' }),
      fb('A product sold 1 200 units during a 365-day year. Closing stock is 150 units. Calculate the stockholding period in days, to ONE decimal place.',
        ['Stockholding period = ', '[ ]', ' days'], ['45.6|46'], 'standard_math',
        { unit: U, topic: 'stockholding_period', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      ms('Select the TWO other points that might concern the owner about the dresses.',
        ['No dresses are sold online', 'The low mark-up leaves little room if costs rise'],
        ['Too many dresses are left in closing stock', 'The dresses sell more slowly than other items', 'The price is far above competitors\' prices'],
        { fig: 0, unit: U, topic: 'stockholding_period', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
      mc('Why must the stockholding period of the dresses be based on 90 days and not 365 days?',
        'They were only on sale for the last three months', ['Dresses are seasonal and always sell within 90 days', 'The supplier delivers new dresses every 90 days', 'Customers who buy dresses get 90 days\' credit'],
        { unit: U, topic: 'stockholding_period', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
    ],
    subs: [ex('2.2.3', 6,
      ['Formal shirts were sold only from 1 November 2023 to 29 February 2024 (120 or 121 days).', 'Use units or rand, but do not mix them.'],
      ['Closing stock ÷ units sold × number of days on sale.', 'Give one other concern, such as no online sales or a low mark-up.'],
      ['125 ÷ 855 × 120 days = 17,5 days (17,7 days on 121 days; 18 days accepted).', 'Or (R680 × 125) R85 000 ÷ R581 400 × 120 days.',
        'Concern: no online sales of formal shirts; the low 25% mark-up; or stock running out quickly.'])],
  },
];
