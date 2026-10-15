'use strict';
// Accounting 2025 Nov P2 — Question 2 (Stock Valuation) lessons 6–9. Fresh numbers; every figure computed and asserted.
const assert = require('assert');
const { mc, ms, mt, ord, fb, ex, fmt, blank } = require('./lib');

const LN = (t, ...c) => ({ k: 'line', c: [t, ...c] });
const TOT = (t, ...c) => ({ k: 'total', c: [t, ...c] });

const U = 'stock_valuation';
const SK = { stmt: 'complete_financial_statement', calc: 'calculate_accounting_amount', term: 'recall_accounting_term', cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario', int: 'interpret_financial_indicators' };

// L6: FIFO
const units = 400 + 5000 + 2000 + 800 - 25, sold = 7275, closeU = units - sold;
const decNet = 800 - 25, novInClose = closeU - decNet, closeV = decNet * 24 + novInClose * 21;
assert.strictEqual(units, 8175); assert.strictEqual(closeU, 900); assert.strictEqual(novInClose, 125); assert.strictEqual(closeV, 21225);
assert.strictEqual(125 * 21, 2625); assert.strictEqual(90 * 27, 2430);
// L7: specific identification and stockholding
const trailClose = 20 + 60 - 55, trailVal = trailClose * 9000, roadSold = 15 + 50 - 10, roadCos = roadSold * 12000;
assert.strictEqual(trailVal, 225000); assert.strictEqual(roadCos, 660000);
const stockPeriod = 120000 / roadCos * 365; assert.ok(Math.abs(stockPeriod - 66.36) < 0.01);
assert.ok(Math.abs(90000 / 540000 * 365 - 60.83) < 0.01);
// L8: new model
assert.ok(Math.abs(60 / 70 * 100 - 85.71) < 0.01); assert.strictEqual(60 / 5, 12); assert.strictEqual(72 / 12, 6); assert.strictEqual(90 / 12, 7.5);
// L9: management of inventories
assert.strictEqual(600 * 340, 204000); assert.strictEqual(600 * 250, 150000); assert.strictEqual(600 * 140, 84000); assert.strictEqual(600 * 50, 30000);
assert.strictEqual(190 * 1800, 342000); assert.strictEqual(360 * 1900, 684000); assert.strictEqual(500 - 190, 310);

module.exports = [
  // ── L06 ── 2.1 FIFO ─────────────────────────────────────────────────────────
  {
    order: 6, name: 'Question 2.1: FIFO closing stock and shelf life', marks: 13, qpages: 1, mpages: 1,
    covers: 'Question 2.1 — closing stock under FIFO, the value of stock past its shelf life, and managing stock to avoid losses.',
    tags: ['fifo_stock_valuation', 'stock_shelf_life'],
    info: [
      'The first-in-first-out (FIFO) method is used. Stock on 1 March 2025 was 400 bottles.',
      'Returns of 25 bottles were made from the December purchase.',
      '7 275 bottles were sold during the year.',
      'Closing stock on 28 February 2026 is made up of the latest purchases first.',
    ],
    figs: [{
      title: 'FIFO stock record: Sunrise Mart', subtitle: 'tinned tomatoes, year ended 28 February 2026', cols: ['', 'Units', 'Unit price', 'Total'],
      rows: [
        LN('Purchases Mar to Oct', fmt(5000), 'R18', fmt(90000)),
        LN('Purchases Nov', fmt(2000), 'R21', fmt(42000)),
        LN('Purchases Dec', fmt(800), 'R24', fmt(19200)),
        LN('Returns (Dec stock)', '(25)', 'R24', '(600)'),
        LN('Closing units from Dec', fmt(775), 'R24', fmt(18600)),
        LN('Closing units from Nov', blank('A'), 'R21', ''),
        TOT('Closing stock at FIFO', fmt(900), '', blank('B')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate A (the units of the November purchase still in stock) and B (the value of the closing stock).',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(novInClose), String(closeV)], 'standard_math',
        { fig: 0, unit: U, topic: 'fifo_stock_valuation', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Closing units are the most recent purchases first.\n- Use the unit price of each layer.' }),
      fb('Closing stock is 400 units: 150 from the latest purchase at R30 and 250 from the earlier purchase at R27. Under FIFO, 90 of the earlier units have passed their sell-by date. Calculate the value of stock that has passed its sell-by date.',
        ['Value = R ', '[ ]'], ['2430'], 'standard_math',
        { unit: U, topic: 'fifo_stock_valuation', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      mc('Which units make up the closing stock when FIFO is used?',
        'The most recently purchased units', ['The oldest units still in the shop', 'Units priced at the average cost', 'Units from the largest purchase'],
        { unit: U, topic: 'fifo_stock_valuation', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 1, type: 'definition' }),
      ms('Select the TWO ways to avoid losses on stock that is close to its sell-by date.',
        ['Buy stock more often in smaller amounts', 'Offer old stock at a reduced price'],
        ['Buy all the stock for the year in one order', 'Place new stock in front of old stock', 'Stop checking the sell-by dates'],
        { unit: U, topic: 'inventory_management_decisions', subtopic: 'acc_scenario_application', skill: SK.app, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('2.1.1', 7, ['FIFO values the closing stock at the latest purchase prices.', 'Returns reduce the units of the layer they came from.'],
        ['Work out the units left from the last purchases.', 'Multiply each layer by its unit price and add them.'],
        ['Closing units 980 are made up of 818 February units (R850 − 32 returned) and 162 January units: 818 × R42 = R34 356 and 162 × R37 = R5 994.', 'Closing stock = R40 350.']),
      ex('2.1.2', 2, ['Stock past its sell-by date is the oldest stock still on hand.', 'Under FIFO this is the earliest layer in closing stock.'],
        ['Find the oldest layer in the closing stock.', 'Multiply its units by its price.'], ['12 units × R37 = R444.']),
      ex('2.1.3', 4, ['Think about how much stock is bought and how it is rotated.', 'Give two different ideas.'],
        ['Suggest buying more often and managing expiry dates.'], ['Buy stock more frequently instead of in bulk, offer old stock at a reduced price or use inventory software, and train staff to rotate stock.']),
    ],
  },

  // ── L07 ── 2.2.1–2.2.2 specific identification and stockholding period ──────
  {
    order: 7, name: 'Question 2.2.1–2.2.2: Specific identification and stockholding period', marks: 11, qpages: 2, mpages: 1,
    covers: 'Questions 2.2.1 and 2.2.2 — closing stock under the specific identification method, the stockholding period, and what a change in it shows.',
    tags: ['specific_identification', 'stockholding_period'],
    info: [
      'Paragon Cycles values its bicycles by specific identification. Opening stock: 20 Trail bicycles and 15 Road bicycles. Purchases: 60 Trail and 50 Road.',
      '55 Trail and 55 Road bicycles were sold. Trail bicycles cost R9 000 each and Road bicycles R12 000 each.',
      'Round the stockholding period to ONE decimal place.',
    ],
    figs: [{
      title: 'Bicycle stock: Paragon Cycles', subtitle: 'year ended 30 June 2026', cols: ['', 'Trail', 'Road'],
      rows: [
        LN('Units sold', '55', '55'),
        LN('Closing stock (units)', fmt(trailClose), '10'),
        LN('Closing stock (R)', blank('A'), fmt(120000)),
        LN('Cost of sales (R)', fmt(495000), fmt(roadCos)),
        TOT('Stockholding period (days)', '', blank('B')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate A (closing stock of the Trail model) and B (the stockholding period of the Road model).',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(trailVal), '66.4|66'], 'standard_math',
        { fig: 0, unit: U, topic: 'stockholding_period', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- The stockholding period uses the closing stock and the cost of sales.\n- Multiply by 365 days.' }),
      fb('Closing stock is R90 000 and cost of sales is R540 000. Calculate the stockholding period in days, to ONE decimal place.',
        ['Stockholding period = ', '[ ]', ' days'], ['60.8|61'], 'standard_math',
        { unit: U, topic: 'stockholding_period', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      mc('The stockholding period increased from 48 days to 66 days. What does this show?',
        'Stock is moving more slowly and cash is tied up', ['Stock is being sold faster than before', 'The business is buying less stock for cash', 'Cost of sales has decreased'],
        { unit: U, topic: 'stockholding_period', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
      ms('Select the TWO possible reasons for a longer stockholding period.',
        ['A new model has made older models outdated', 'Stock is piling up because of delayed sales'],
        ['Customers are buying faster than before', 'The business reduced its storage costs', 'Stock was sold at a lower price'],
        { unit: U, topic: 'stockholding_period', subtopic: 'acc_interpretation', skill: SK.int, diff: 4, w: 2, type: 'interpretation' }),
    ],
    subs: [
      ex('2.2.1', 4, ['Specific identification values each unit at its own cost.', 'Closing units = opening + purchases − sold.'],
        ['Find the closing units, then multiply by the cost of each unit.'], ['Closing units = 30 + 90 − 79 = 41; closing stock = 41 × R15 500 = R635 500.']),
      ex('2.2.2', 7, ['The formula uses closing stock and cost of sales.', 'The comment compares with the previous year.'],
        ['Calculate cost of sales = opening stock + purchases − closing stock, then closing stock ÷ cost of sales × 365.', 'Say whether the period increased or decreased and why this is a concern.'],
        ['Cost of sales = R557 500 + R2 453 000 − R780 500 = R2 230 000; period = 780 500 ÷ 2 230 000 × 365 = 127,8 days.', 'It increased from 69 days to 127,8 days, so stock is moving slowly and cash is tied up.']),
    ],
  },

  // ── L08 ── 2.2.3 a new model ────────────────────────────────────────────────
  {
    order: 8, name: 'Question 2.2.3: Introducing a new model', marks: 6, qpages: 2, mpages: 2,
    covers: 'Question 2.2.3 — quoting figures to show why a new model was a good decision, and reducing returns to the supplier.',
    tags: ['new_product_performance', 'returns_to_suppliers'],
    figs: [{
      title: 'Model performance: Paragon Cycles', subtitle: 'year ended 30 June 2026', cols: ['', 'Aero (5 months)', 'Alpha', 'Beta'],
      rows: [
        LN('Units sold', '60', '72', '90'),
        LN('Units available for sale', '70', '105', '110'),
        LN('Gross profit per unit', 'R11 000', 'R6 500', 'R5 200'),
        LN('Months on sale', '5', '12', '12'),
      ],
    }],
    qs: [
      ms('The owner is pleased with the new Aero model. Select the TWO statements, with figures, that explain why.',
        ['Gross profit per unit is R11 000, higher than the others', 'It sold 12 units a month, more than the other models'],
        ['It sold fewer units in total than the other models', 'Its gross profit per unit is below Beta\'s', 'It was on sale for fewer months than Beta'],
        { fig: 0, unit: U, topic: 'inventory_management_decisions', subtopic: 'acc_interpretation', skill: SK.int, diff: 4, w: 3, type: 'interpretation' }),
      fb('Calculate the percentage of the available Aero units that were sold, to ONE decimal place (without the % sign).',
        ['Percentage sold = ', '[ ]', ' %'], ['85.7|86'], 'standard_math',
        { fig: 0, unit: U, topic: 'inventory_management_decisions', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      fb('Calculate the average number of Aero units sold per month.',
        ['Average = ', '[ ]', ' units'], ['12'], 'standard_math',
        { fig: 0, unit: U, topic: 'inventory_management_decisions', subtopic: 'acc_calculation', skill: SK.calc, diff: 1, w: 1, type: 'calc' }),
      mc('Which suggestion would best reduce the number of units returned to the supplier?',
        'Ask the supplier for a guarantee or warranty', ['Order twice as many units each month', 'Stop recording returns in the books', 'Lower the selling price of every model'],
        { unit: U, topic: 'inventory_management_decisions', subtopic: 'acc_scenario_application', skill: SK.app, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('2.2.3', 6, ['Compare the new model with the other two, using figures.', 'The returns suggestion must be about faulty stock.'],
        ['Use profit per unit, units sold per month, the percentage of stock sold or the stockholding period.', 'Suggest a way to reduce faulty units.'],
        ['Each Clear View printer earns R14 000 profit, higher than the other two, and 13 printers a month were sold against 7 and 8.', 'It sold 86,7% of the available printers and its stockholding period is 23,1 days.', 'A suggestion: ask for a guarantee, change supplier or check printers on arrival.']),
    ],
  },

  // ── L09 ── 2.3 management of inventories ────────────────────────────────────
  {
    order: 9, name: 'Question 2.3: Management of inventories', marks: 5, qpages: 1, mpages: 1,
    covers: 'Question 2.3 — identifying a pricing decision, the figures showing its result, and a decision that was not a good idea.',
    tags: ['inventory_management', 'pricing_decision_effect'],
    figs: [
      { title: 'Kettles: Madrid Supplies', subtitle: 'years ended 30 September', cols: ['', '2026', '2025'],
        rows: [LN('Total sales', 'R204 000', 'R150 000'), LN('Gross profit', 'R84 000', 'R30 000'), LN('Selling price per unit', 'R340', 'R250'), LN('Cost price per unit', 'R200', 'R200'), LN('Units sold', '600', '600'), LN('Mark-up %', '70%', '25%')] },
      { title: 'Heaters: Madrid Supplies', subtitle: 'years ended 30 September', cols: ['', '2026', '2025'],
        rows: [LN('Total sales', 'R342 000', 'R684 000'), LN('Selling price per unit', 'R1 800', 'R1 900'), LN('Cost price per unit', 'R1 200', 'R1 250'), LN('Units available', '500', '420'), LN('Units sold', '190', '360')] },
    ],
    qs: [
      mc('Which decision did the owner make about the kettles?',
        'He increased the mark-up percentage', ['He reduced the cost price per unit', 'He sold fewer units than before', 'He lowered the selling price'],
        { fig: 0, unit: U, topic: 'inventory_management_decisions', subtopic: 'acc_interpretation', skill: SK.int, diff: 2, w: 1, type: 'interpretation' }),
      ms('Select the TWO figures that show the decision on the kettles had a positive result.',
        ['Gross profit rose from R30 000 to R84 000', 'Sales rose from R150 000 to R204 000, same units'],
        ['Units sold rose from 360 to 600 during the year', 'The cost price per unit fell from R250 to R200', 'The mark-up fell from 70% to 25% over the year'],
        { fig: 0, unit: U, topic: 'inventory_management_decisions', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
      fb('Calculate the number of heaters that were not sold in 2026.',
        ['Unsold heaters = ', '[ ]'], ['310'], 'standard_math',
        { fig: 1, unit: U, topic: 'inventory_management_decisions', subtopic: 'acc_calculation', skill: SK.calc, diff: 1, w: 1, type: 'reading' }),
      mc('The owner changed the brand of heater he sold. Which figure shows this was not a good idea?',
        'Units sold fell from 360 to 190', ['The selling price fell from R1 900 to R1 800', 'The cost price fell from R1 250 to R1 200', 'The units available rose from 420 to 500'],
        { fig: 1, unit: U, topic: 'inventory_management_decisions', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
    ],
    subs: [
      ex('2.3.1', 3, ['Compare the mark-up and the selling price with the previous year.', 'Quote figures for the result.'],
        ['Say what changed, then quote one improvement with figures.'], ['The mark-up % increased from 60% to 80% (the selling price rose from R200 to R270).', 'Gross profit increased from R42 000 to R61 200 even though fewer units were sold.']),
      ex('2.3.2', 2, ['Compare units, sales and profit with the previous year.', 'One figure is enough.'],
        ['Find a figure that got worse after the brand changed.'], ['Units sold decreased from 740 to 430; sales fell from R5 161 500 to R2 418 750 and gross profit from R1 720 500 to R806 250.']),
    ],
  },
];
