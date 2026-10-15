'use strict';
// Accounting 2025 Nov P2 — Question 3 (Cost Accounting) lessons 10–12. Fresh numbers; every figure computed and asserted.
const assert = require('assert');
const { mc, ms, mt, ord, fb, ex, fmt, blank } = require('./lib');

const LN = (t, ...c) => ({ k: 'line', c: [t, ...c] });
const TOT = (t, ...c) => ({ k: 'total', c: [t, ...c] });

const U = 'cost_accounting';
const SK = { stmt: 'complete_financial_statement', calc: 'calculate_accounting_amount', term: 'recall_accounting_term', cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario', int: 'interpret_financial_indicators' };

// L10: factory overhead cost note
const water = 640000 * 0.8, prepaid = 14400 * 9 / 12, insTotal = 96000 - prepaid, insFactory = insTotal * 3 / 4;
const rentUnit = 267000 / (180 * 7 + 210 * 5 + 30 * 12), rentFactory = rentUnit * (180 * 7 + 210 * 5);
const depOpen = (3720000 - 1200000) * 0.15, depNew = 480000 * 0.15 * 4 / 12, dep = depOpen + depNew;
const foh = water + insFactory + rentFactory + dep + 512300, cop = 4850000 + foh + (110000 - 84000);
assert.strictEqual(water, 512000); assert.strictEqual(prepaid, 10800); assert.strictEqual(insFactory, 63900);
assert.strictEqual(rentUnit, 100); assert.strictEqual(rentFactory, 231000);
assert.strictEqual(depOpen, 378000); assert.strictEqual(depNew, 24000); assert.strictEqual(dep, 402000);
assert.strictEqual(foh, 1721200); assert.strictEqual(cop, 6597200);
// L11: break-even
const bep26 = 31000 * 70 / (280 - 155), bep25 = 27000 * 85 / (260 - 140);
assert.strictEqual(bep26, 17360); assert.strictEqual(bep25, 19125); assert.strictEqual(31000 - bep26, 13640); assert.strictEqual(28000 - 21500, 6500);
// L12: cost control
assert.strictEqual(50 - 41, 9); assert.ok(Math.abs((61 - 48) / 48 * 100 - 27.08) < 0.01); assert.strictEqual(34 - 30, 4);

module.exports = [
  // ── L10 ── 3.1 factory overhead cost note ───────────────────────────────────
  {
    order: 10, name: 'Question 3.1: Factory overhead cost note and cost of production', marks: 20, qpages: 2, mpages: 1,
    covers: 'Question 3.1 — the Factory Overhead Cost Note (allocations, prepaid insurance, floor space, depreciation) and the cost of production of finished goods.',
    tags: ['factory_overhead_cost_note', 'cost_of_production'],
    info: [
      '80% of water and electricity (R640 000) is allocated to the factory.',
      'Insurance, R96 000, includes an additional premium of R14 400 for 1 December 2025 to 30 November 2026. The expense is shared between the factory and the sales department in the ratio 3 : 1.',
      'Rent expense, R267 000, is charged at a fixed rate per m². Factory space: 180 m² for 7 months, 210 m² for 5 months. Other departments: 30 m² for all 12 months.',
      'Depreciation on factory equipment is 15% p.a. on the diminishing-balance method. Equipment at cost R3 720 000 with accumulated depreciation R1 200 000 at the start of the year; new equipment of R480 000 was installed on 1 November 2025.',
    ],
    figs: [{
      title: 'Factory overhead cost note: Steelcraft Manufacturers', subtitle: 'year ended 28 February 2026', cols: ['', 'R'],
      rows: [
        LN('Water and electricity', fmt(water)),
        LN('Insurance', blank('A')),
        LN('Rent expense', blank('B')),
        LN('Depreciation: factory equipment', blank('C')),
        LN('Other factory expenses', fmt(512300)),
        TOT('Total factory overhead cost', fmt(foh)),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], [String(insFactory), String(rentFactory), String(dep)], 'standard_math',
        { fig: 0, unit: U, topic: 'factory_overhead_cost_note', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 5, w: 3, type: 'calc',
          clues: '- Only the part of the extra premium already used is an expense.\n- Rent is shared by m² and months.\n- Depreciation covers the old and the new equipment.' }),
      fb('Prime cost is R4 850 000 and total factory overhead cost is R1 721 200. Work-in-progress was R110 000 at the beginning and R84 000 at the end. Calculate the cost of production of finished goods.',
        ['Cost of production = R ', '[ ]'], [String(cop)], 'standard_math',
        { unit: U, topic: 'cost_of_production', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 3, type: 'calc',
          clues: '- Opening work-in-progress is added and closing work-in-progress is deducted.' }),
      mc('An additional insurance premium covers 12 months, but only 3 months of it have passed by the year-end. How is the remaining part treated?',
        'It is prepaid and not a cost of this year', ['It is an expense of the current year in full', 'It is part of the cost of production now', 'It is added to the factory depreciation'],
        { unit: U, topic: 'factory_overhead_cost_note', subtopic: 'acc_classification', skill: SK.cls, diff: 4, w: 2, type: 'application' }),
      ms('Select ALL the items that belong in the Factory Overhead Cost Note.',
        ['The factory share of water and electricity', 'Depreciation on factory equipment', 'Rent for the factory floor space'],
        ['Advertising costs', 'Rent for the sales department floor space'],
        { unit: U, topic: 'factory_overhead_cost_note', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('3.1.1', 16, ['Allocate each cost between departments before adding it to the note.', 'Prepaid amounts are removed from the expense.'],
        ['Work out the factory share of each item.', 'Add the items, including other factory expenses, but not advertising.'],
        ['Water and electricity: R915 000 × 75% = R686 250; insurance: R69 900 × 3/5 = R41 940.', 'Rent: R240 400 × 2 525 ÷ 3 005 = R202 000; depreciation R652 800 (R45 600 + R607 200).', 'Total factory overhead cost = R2 320 000 including other factory expenses of R737 010.']),
      ex('3.1.2', 4, ['Cost of production = prime cost + factory overhead cost, adjusted for work-in-progress.'],
        ['Add the opening work-in-progress and deduct the closing work-in-progress.'], ['R6 025 000 + R2 320 000 + (R125 000 − R93 000) = R8 377 000.']),
    ],
  },

  // ── L11 ── 3.2.1–3.2.2 break-even ───────────────────────────────────────────
  {
    order: 11, name: 'Question 3.2.1–3.2.2: Break-even point', marks: 6, qpages: 2, mpages: 1,
    covers: 'Questions 3.2.1 and 3.2.2 — the break-even point and whether the units produced and sold are satisfactory.',
    tags: ['break_even_point', 'units_above_break_even'],
    figs: [{
      title: 'Phone cases: Zenith Manufacturers', subtitle: 'years ended 31 August', cols: ['', '2026', '2025'],
      rows: [
        LN('Units produced and sold', fmt(31000), fmt(27000)),
        LN('Selling price per unit', 'R280', 'R260'),
        LN('Total fixed cost per unit', 'R70', 'R85'),
        LN('Total variable cost per unit', 'R155', 'R140'),
        TOT('Break-even point (units)', blank('A'), fmt(bep25)),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate A, the break-even point for 2026.',
        ['A = ', '[ ]', ' units'], [String(bep26)], 'standard_math',
        { fig: 0, unit: U, topic: 'break_even_analysis', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Total fixed cost = units × fixed cost per unit.\n- Divide by the contribution per unit.' }),
      fb('A business produces and sells 28 000 units. Its break-even point is 21 500 units. How many units earn a profit?',
        ['Units earning a profit = ', '[ ]'], ['6500'], 'standard_math',
        { unit: U, topic: 'break_even_analysis', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      mc('Which statement shows the owner should be satisfied with the units produced and sold in 2026?',
        'Units produced of 31 000 are above the break-even point of 17 360', ['Units produced of 31 000 are below the break-even point of 17 360', 'The selling price rose from R260 to R280 so profit is certain', 'The fixed cost per unit rose from R70 to R85'],
        { fig: 0, unit: U, topic: 'break_even_analysis', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
      ms('Select the TWO correct statements about the break-even point.',
        ['At the break-even point there is no profit and no loss', 'Units above the break-even point earn a profit'],
        ['Units below the break-even point earn a profit', 'The break-even point is the number of units sold at cost price', 'It equals the total fixed cost in rand'],
        { unit: U, topic: 'break_even_analysis', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('3.2.1', 4, ['Break-even point = total fixed cost ÷ (selling price − variable cost) per unit.', 'The formula sheet gives it.'],
        ['Work out the total fixed cost, then divide by the contribution per unit.'], ['Total fixed cost = 28 750 × R80 = R2 300 000; contribution = R265 − R146 = R119.', 'Break-even point = R2 300 000 ÷ R119 = 19 328 units.']),
      ex('3.2.2', 2, ['Compare units produced and sold with the break-even point.', 'Quote figures.'],
        ['Say how far above break-even the business is.'], ['Units produced of 28 750 are above the break-even point of 19 328, so a profit is made on 9 422 units.']),
    ],
  },

  // ── L12 ── 3.2.3–3.2.4 cost control ─────────────────────────────────────────
  {
    order: 12, name: 'Question 3.2.3–3.2.4: Control over fixed and variable costs', marks: 9, qpages: 3, mpages: 1,
    covers: 'Questions 3.2.3 and 3.2.4 — spotting poorly and well controlled cost items with figures, with reasons and advice.',
    tags: ['cost_control_interpretation', 'variable_and_fixed_costs'],
    figs: [{
      title: 'Cost per unit: Brightway Chargers', subtitle: 'years ended 31 August', cols: ['', '2026', '2025'],
      rows: [
        LN('Factory overhead cost', 'R30', 'R44'),
        LN('Administration cost', 'R50', 'R41'),
        LN('Total fixed cost per unit', 'R80', 'R85'),
        LN('Direct material cost', 'R61', 'R48'),
        LN('Direct labour cost', 'R30', 'R34'),
        LN('Selling and distribution cost', 'R12', 'R11'),
      ],
    }],
    qs: [
      mc('Which fixed-cost item was poorly controlled, even though the total fixed cost per unit decreased?',
        'Administration cost, which rose from R41 to R50', ['Factory overhead cost, which fell from R44 to R30', 'Direct material cost, which rose from R48 to R61', 'Direct labour cost, which fell from R34 to R30'],
        { fig: 0, unit: U, topic: 'cost_control_interpretation', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 3, type: 'interpretation' }),
      fb('By what percentage did the direct material cost per unit increase? Round off to ONE decimal place (without the % sign).',
        ['Increase = ', '[ ]', ' %'], ['27.1'], 'standard_math',
        { fig: 0, unit: U, topic: 'cost_control_interpretation', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      mc('Which variable-cost item was well controlled?',
        'Direct labour cost, which fell from R34 to R30', ['Direct material cost, which fell from R61 to R48', 'Selling cost, which fell from R12 to R11', 'Administration cost, which fell from R50 to R41'],
        { fig: 0, unit: U, topic: 'cost_control_interpretation', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
      ms('Select the TWO pieces of advice that would help to control the direct material cost.',
        ['Train workers to reduce wastage', 'Buy from a cheaper supplier or in bulk for a discount'],
        ['Employ more workers for overtime', 'Lower the selling price of the product', 'Increase the number of administration staff'],
        { unit: U, topic: 'cost_control_interpretation', subtopic: 'acc_scenario_application', skill: SK.app, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('3.2.3', 3, ['Look for a fixed-cost item that went up while the total went down.', 'Give a possible reason.'],
        ['Compare each fixed-cost item between the two years.'], ['Administration cost per unit increased from R42 to R46 (by R4).', 'A possible reason is abuse of administration items or more administrative staff.']),
      ex('3.2.4', 6, ['Find the variable-cost item that increased most and the one that decreased.', '"No overtime" and "no retrenchment" are not accepted as reasons.'],
        ['Quote each item with its trend, then give advice or a reason.'],
        ['Direct material cost increased from R24 to R38 (by R14); advice: train workers to minimise wastage or buy from a cheaper supplier.', 'Direct labour cost decreased from R22 to R20 (by R2); reason: better supervision or better-trained workers.']),
    ],
  },
];
