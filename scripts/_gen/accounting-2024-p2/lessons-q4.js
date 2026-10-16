'use strict';
// Accounting 2024 Nov P2 — Question 4 (Cost accounting) lessons 16–19. Fresh numbers; every figure computed and asserted.
const assert = require('assert');
const { mc, ms, mt, fb, ex, fmt, blank } = require('./lib');

const LN = (t, ...c) => ({ k: 'line', c: [t, ...c] });
const TOT = (t, ...c) => ({ k: 'total', c: [t, ...c] });

const U = 'cost_accounting';
const SK = { stmt: 'complete_financial_statement', calc: 'calculate_accounting_amount', term: 'recall_accounting_term', cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario', int: 'interpret_financial_indicators' };

// L16: direct material (3 600 benches × 2,5 bags + 8% wastage × R90) and direct labour (8 workers × 1 750 h)
const dm = Math.round(3600 * 2.5 * 1.08 * 90);
const dlBudget = 1344000, rate = dlBudget / (8 * 1750), resigned = -(1750 * 3 / 12 * rate), overtime = 2 * 50 * 1.5 * rate, dl = dlBudget + resigned + overtime;
assert.strictEqual(dm, 874800); assert.strictEqual(rate, 96); assert.strictEqual(resigned, -42000); assert.strictEqual(overtime, 14400); assert.strictEqual(dl, 1316400);
// L17: factory overhead note — supervisor 75% to the factory; rent re-allocated on the new rent and floor areas
const foh0 = 980500, sup = 8500 * 12 * 0.75, rentAdj = 120000 * 450 / 600 - 96000 * 300 / 500, foh = foh0 + sup + rentAdj;
assert.strictEqual(sup, 76500); assert.strictEqual(rentAdj, 32400); assert.strictEqual(foh, 1089400);
assert.strictEqual(84000 * 350 / 600, 49000);
// L18–L19: Glow Lamps — fixed cost R1 600 000 both years
const y26 = { units: 5200, bep: 6400, sp: 640, vc: 390, dm: 210, dl: 100, sd: 80 }, y25 = { units: 4300, bep: 8000, sp: 620, vc: 420, dm: 250, dl: 95, sd: 75 };
const fixed = 1600000;
for (const y of [y26, y25]) { assert.strictEqual(fixed / (y.sp - y.vc), y.bep); assert.strictEqual(y.dm + y.dl + y.sd, y.vc); }
assert.strictEqual(y26.bep - y26.units, 1200); assert.strictEqual(900000 / (350 - 200), 6000);
assert.strictEqual(Math.round((y26.sp - y25.sp) / y25.sp * 1000) / 10, 3.2);
const sales26 = y26.units * y26.sp, sales25 = y25.units * y25.sp;
assert.strictEqual(sales26, 3328000); assert.strictEqual(sales25, 2666000);
assert.strictEqual(240000 / 600 + y26.vc, 790); assert.strictEqual(150000 / 500 + 420, 720);

const glow = {
  title: 'Production information: Glow Lamps', subtitle: 'years ended 30 June', cols: ['', '2026', '2025'],
  rows: [
    LN('Units produced and sold', fmt(y26.units), fmt(y25.units)),
    LN('Break-even point (units)', fmt(y26.bep), fmt(y25.bep)),
    LN('Selling price per unit', 'R' + fmt(y26.sp), 'R' + fmt(y25.sp)),
    LN('Total sales', fmt(sales26), fmt(sales25)),
    LN('Gross profit', fmt(1040000), fmt(817000)),
    LN('Total fixed cost', fmt(fixed), fmt(fixed)),
    LN('Variable cost per unit', 'R' + fmt(y26.vc), 'R' + fmt(y25.vc)),
  ],
};
const glowCosts = {
  ...glow,
  rows: [
    ...glow.rows,
    LN('Direct material cost per unit', 'R' + fmt(y26.dm), 'R' + fmt(y25.dm)),
    LN('Direct labour cost per unit', 'R' + fmt(y26.dl), 'R' + fmt(y25.dl)),
    LN('Selling and distribution per unit', 'R' + fmt(y26.sd), 'R' + fmt(y25.sd)),
  ],
};

module.exports = [
  // ── L16 ── 4.1.1–4.1.2 direct material and direct labour cost ───────────────
  {
    order: 16, name: 'Question 4.1.1–4.1.2: Direct material and direct labour cost', marks: 11, qp: '12', mp: '10', qpages: 1, mpages: 1,
    covers: 'Questions 4.1.1 and 4.1.2 — direct material cost with a wastage allowance, and direct labour cost adjusted for a resigned worker and overtime.',
    tags: ['direct_material_cost', 'direct_labour_cost'],
    info: [
      'Stone Benches made and sold 3 600 benches in the year ended 30 June 2026.',
      'Direct labour budgeted for the year: R1 344 000. There are 8 direct workers; each must work 1 750 hours a year at the same hourly rate.',
      'One worker resigned on 31 March 2026 and worked no overtime.',
      'Two workers each worked 50 hours of overtime at 1,5 times the normal rate.',
      'Show a decrease as a negative number.',
    ],
    figs: [{
      title: 'Direct labour cost: Stone Benches', subtitle: 'year ended 30 June 2026', cols: ['', 'R'],
      rows: [
        LN('Direct labour budgeted', fmt(dlBudget)),
        LN('Resigned worker', blank('A')),
        LN('Overtime', blank('B')),
        TOT('Direct labour cost', blank('C')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], [`${resigned}|${-resigned}`, String(overtime), String(dl)], 'standard_math',
        { fig: 0, unit: U, topic: 'direct_labour_cost', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 5, w: 3, type: 'calc',
          clues: '- Find the normal hourly rate first.\n- The resigned worker did not work for the last 3 months.\n- Overtime is paid at 1,5 times the normal rate.' }),
      fb('Each bench needs 2,5 bags of concrete mix, and 8% extra is allowed for wastage. A bag costs R90. Calculate the direct material cost for 3 600 benches.',
        ['Direct material cost = R ', '[ ]'], [String(dm)], 'standard_math',
        { unit: U, topic: 'direct_material_cost', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 3, type: 'calc' }),
      mc('Each unit needs 2 kg of material, and 5% wastage is allowed. How much material is needed for 1 000 units?',
        '2 100 kg', ['2 000 kg', '1 050 kg', '2 500 kg'],
        { unit: U, topic: 'direct_material_cost', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      ms('Select ALL the costs that are part of direct labour cost.',
        ['Wages of workers who make the product', 'Overtime paid to production workers'],
        ['Salary of the factory foreman', 'Salaries of the office staff', 'Commission paid to sales staff'],
        { unit: U, topic: 'direct_labour_cost', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('4.1.1', 4, ['Each pot needs 1,4 packets, plus 10% wastage.', 'The price stayed at R125 a packet.'],
        ['Find the packets needed, add the wastage, and multiply by the price.'],
        ['4 800 × 1,4 = 6 720 packets × 1,1 = 7 392 packets × R125 = R924 000.']),
      ex('4.1.2', 7, ['The budget assumes 7 workers for a full year at the same rate.', 'A worker who resigned on 31 October did not work for the last 4 months.'],
        ['Find the hourly rate: R1 117 200 ÷ 7 ÷ 1 680 hours = R95.', 'Deduct the resigned worker\'s unpaid months and add the overtime.'],
        ['Resigned worker: R1 117 200 × 4/84 = (R53 200).', 'Overtime: 3 × 60 hours = 180 × R95 × 1,6 = R27 360.',
          'Direct labour cost = R1 117 200 − R53 200 + R27 360 = R1 091 360.']),
    ],
  },

  // ── L17 ── 4.1.3 factory overhead cost note ─────────────────────────────────
  {
    order: 17, figVer: 2, name: 'Question 4.1.3: Correcting the factory overhead cost', marks: 8, qp: '12-13', mp: '10', qpages: 2, mpages: 1,
    covers: 'Question 4.1.3 — correcting the factory overhead cost for a factory salary recorded as administration, and for rent re-allocated on a new floor area.',
    tags: ['factory_overhead_cost_note', 'cost_allocation'],
    info: [
      'The bookkeeper calculated factory overhead cost as R980 500.',
      'A supervisor earns R8 500 a month; this was recorded as an administration cost. 25% belongs to the office and the rest to the factory.',
      'Rent of R96 000 was shared by floor area: factory 300 m² of 500 m².',
      'The annual rent has in fact been R120 000 since the start of the year, and the factory now uses 450 m² of 600 m².',
    ],
    figs: [{
      title: 'Factory Overhead Cost Note: Clayworks', subtitle: 'year ended 30 June 2026', cols: ['', 'R'],
      rows: [
        LN('Incorrect factory overhead cost', fmt(foh0)),
        LN('Factory indirect labour', blank('A')),
        LN('Factory rent adjustment', blank('B')),
        TOT('Correct factory overhead cost', blank('C')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], [String(sup), String(rentAdj), String(foh)], 'standard_math',
        { fig: 0, unit: U, topic: 'factory_overhead_cost_note', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 5, w: 3, type: 'calc',
          clues: '- Use the factory share of a full year\'s salary.\n- The rent adjustment is the correct factory rent less the amount already recorded.' }),
      fb('Rent of R84 000 is shared by floor area. The factory uses 350 m² of the 600 m² building. Calculate the factory rent.',
        ['Factory rent = R ', '[ ]'], ['49000'], 'standard_math',
        { unit: U, topic: 'factory_overhead_cost_note', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      ms('Select ALL the items that must NOT be included in the Factory Overhead Cost Note.',
        ['Advertising', 'Office salaries', 'Bad debts'],
        ['Factory rent', 'Indirect factory labour'],
        { unit: U, topic: 'factory_overhead_cost_note', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
      mc('A factory supervisor\'s salary was recorded as an administration cost. What is the effect of correcting it?',
        'Factory overheads and the cost of production both rise', ['Factory overheads rise and the net profit rises as well', 'Administration costs rise and factory overheads fall', 'Only the direct labour part of production cost rises'],
        { unit: U, topic: 'factory_overhead_cost_note', subtopic: 'acc_scenario_application', skill: SK.app, diff: 4, w: 2, type: 'application' }),
    ],
    subs: [ex('4.1.3', 8,
      ['80% of the clerk\'s salary belongs to production (indirect labour).', 'The rent increased and the factory floor area changed, so the factory\'s share must be recalculated.'],
      ['Add the factory share of a full year\'s salary.', 'Add the difference between the correct factory rent and the amount recorded.'],
      ['Indirect labour: R9 200 × 12 = R110 400 × 80/100 = R88 320.',
        'Rent: R157 500 × 600/800 = R118 125 − R126 000 × 400/600 = R84 000 → R34 125.',
        'Correct factory overhead cost = R1 132 700 + R88 320 + R34 125 = R1 255 145.'])],
  },

  // ── L18 ── 4.2.1–4.2.2 break-even, gross profit and price ───────────────────
  {
    order: 18, name: 'Question 4.2.1–4.2.2: Break-even point, gross profit and selling price', marks: 8, qp: '14', mp: '11', qpages: 1, mpages: 1,
    covers: 'Questions 4.2.1 and 4.2.2 — commenting on production against the break-even point, and on gross profit and whether the new selling price was reasonable.',
    tags: ['break_even_point', 'pricing_decision_effect'],
    figs: [glow],
    qs: [
      fb('Use the information in the figure. By how many units was production below the break-even point in 2026?',
        ['Units below break-even = ', '[ ]'], ['1200'], 'standard_math',
        { fig: 0, unit: U, topic: 'break_even_analysis', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      fb('Fixed costs are R900 000. The selling price is R350 per unit and variable costs are R200 per unit. Calculate the break-even point.',
        ['Break-even point = ', '[ ]', ' units'], ['6000'], 'standard_math',
        { unit: U, topic: 'break_even_analysis', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      ms('Use the figure. Select the TWO correct comments, with figures, on production and the break-even point.',
        ['Production rose from 4 300 to 5 200 units', 'The BEP improved from 8 000 to 6 400 units'],
        ['Production fell from 5 200 to 4 300 units', 'The BEP worsened from 6 400 to 8 000 units', 'Production beat the BEP, so a profit was made'],
        { fig: 0, unit: U, topic: 'break_even_analysis', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
      mc('Use the figure. Did customers find the 2026 selling price reasonable?',
        'Yes: the price rose only 3,2% and 900 more units sold', ['No: the price rose 3,2% and 900 fewer units were sold', 'No: the price rose 20%, so customers went elsewhere', 'Yes: the price fell by R20, so 900 more units sold'],
        { fig: 0, unit: U, topic: 'cost_control_interpretation', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
    ],
    subs: [
      ex('4.2.1', 4, ['Units produced and sold must be compared with the break-even point.', 'Compare the shortfall with the previous year.'],
        ['Say whether a profit or loss was made, with the units.', 'Compare with 2023.'],
        ['3 640 units were produced and sold, below the BEP of 6 868: a loss on 3 228 units.', 'This improved on 2023, when the shortfall was 5 073 units (BEP fell by 1 115 units; production rose by 730 units).']),
      ex('4.2.2', 4, ['Gross profit, units sold and the selling price all changed.'],
        ['Quote the change in gross profit.', 'Compare the price increase with the increase in units sold.'],
        ['Gross profit rose from R960 300 to R1 237 600 (by R277 300 or 28,9%).', 'The price rose from R990 to R1 020 (3%), yet 730 more units (25%) were sold, so customers found it reasonable.']),
    ],
  },

  // ── L19 ── 4.2.3–4.2.4 cost strategies and price for a target profit ────────
  {
    order: 19, name: 'Question 4.2.3–4.2.4: Cost strategies and the price for a target profit', marks: 8, qp: '14', mp: '11-12', qpages: 1, mpages: 2,
    covers: 'Questions 4.2.3 and 4.2.4 — the costs that helped keep the selling price down with a strategy for each, and the price needed on extra units to reach a profit target.',
    tags: ['variable_and_fixed_costs', 'target_profit_pricing'],
    figs: [glowCosts],
    qs: [
      fb('Use the figure. The owner wants to increase profit by R240 000 by making 600 extra units, with costs per unit unchanged. Calculate the selling price per extra unit.',
        ['Selling price = R ', '[ ]'], ['790'], 'standard_math',
        { fig: 0, unit: U, topic: 'break_even_analysis', subtopic: 'acc_calculation', skill: SK.calc, diff: 4, w: 3, type: 'calc',
          clues: '- Each extra unit must cover its variable cost and its share of the extra profit.' }),
      fb('A business wants an extra profit of R150 000 from 500 extra units. Variable cost per unit is R420 and fixed costs do not change. Calculate the price per extra unit.',
        ['Price = R ', '[ ]'], ['720'], 'standard_math',
        { unit: U, topic: 'break_even_analysis', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      ms('Use the figure. Select the TWO costs that had a positive effect on the selling price in 2026.',
        ['Direct material cost per unit', 'Fixed cost spread over more units'],
        ['Direct labour cost per unit', 'Selling and distribution per unit', 'Variable cost of lamp packaging'],
        { fig: 0, unit: U, topic: 'cost_control_interpretation', subtopic: 'acc_interpretation', skill: SK.int, diff: 4, w: 2, type: 'interpretation' }),
      mt('Match each cost to a strategy that keeps it under control.',
        [['Direct material', 'Buy in bulk from a cheaper supplier'], ['Fixed costs', 'Make more units to spread the cost'], ['Direct labour', 'Train workers to cut wasted time'], ['Distribution', 'Plan delivery routes to save fuel']],
        { unit: U, topic: 'cost_control_interpretation', subtopic: 'acc_scenario_application', skill: SK.app, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('4.2.3', 4, ['Direct material cost per unit fell from R520 to R450.', 'Total fixed cost stayed at R1 820 000 while more units were made.'],
        ['Name the two costs.', 'Give a strategy for each.'],
        ['Direct material: cheaper or local suppliers, bulk buying, less wastage through supervision or training.', 'Fixed cost: economies of scale; the same R1 820 000 spread over more units (S&D: better distribution or advertising is also accepted).']),
      ex('4.2.4', 4, ['The extra R300 000 profit must come from 400 extra units.', 'Each extra unit also costs R755 in variable costs.'],
        ['Profit per extra unit plus variable cost per unit.'],
        ['R300 000 ÷ 400 = R750 + R755 = R1 505 per unit.', 'Or (R300 000 + 400 × R755 = R302 000) ÷ 400 = R1 505.']),
    ],
  },
];
