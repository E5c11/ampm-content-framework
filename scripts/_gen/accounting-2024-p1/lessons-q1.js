'use strict';
// Accounting 2024 Nov P1 — Question 1 (Company Financial Statements) lessons 1–7: fixed assets (1.1) and the Statement of Comprehensive Income (1.2).
const assert = require('assert');
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-6, `${a} != ${b}`); // float-safe equality for computed amounts
const { mc, ms, mt, ord, fb, ex, fmt, blank } = require('./lib');

const H = (t, i = 0) => ({ k: 'head', c: [t], i });
const LN = (t, a, i = 1) => ({ k: 'line', c: [t, a], i });
const LN2 = (t, a, b, i = 0) => ({ k: 'line', c: [t, a, b], i });
const SUBT = (t, a, i = 0) => ({ k: 'sub', c: [t, a], i });
const TOT = (t, a, i = 0) => ({ k: 'total', c: [t, a], i });

const U = 'company_financial_statements';
const SK = {
  stmt: 'complete_financial_statement', calc: 'calculate_accounting_amount', term: 'recall_accounting_term',
  cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario',
};
const T_FA = 'fixed_asset_depreciation', T_SCI = 'statement_of_comprehensive_income';

// ── L1: equipment depreciation and vehicle cost ──
const eq = { cost: 640000, adOpen: 212000, rate: 20 };
const eqDep = (eq.cost - eq.adOpen) * eq.rate / 100, eqAdClose = eq.adOpen + eqDep;
const veh = { open: 980000, sold: 210000, bought: 350000 };
const vehClose = veh.open - veh.sold + veh.bought;
near(eqDep, 85600); near(eqAdClose, 297600); near(vehClose, 1120000);
near((500000 - 180000) * 0.15, 48000);

// ── L2: vehicle traded in (bought 1 June 2022, year end end-Feb, traded 1 Sept 2024, 20% diminishing balance) ──
const tv = { cost: 180000, tradeIn: 104000, newCost: 350000, remaining: 118400 };
const d23 = tv.cost * 0.2 * 9 / 12, d24 = (tv.cost - d23) * 0.2, ad24 = d23 + d24;
const dNow = (tv.cost - ad24) * 0.2 * 6 / 12, adNow = ad24 + dNow, cvNow = tv.cost - adNow, pl = tv.tradeIn - cvNow;
const dNew = tv.newCost * 0.2 * 6 / 12, vehDep = dNew + dNow + tv.remaining;
near(d23, 27000); near(d24, 30600); near(ad24, 57600);
near(dNow, 12240); near(adNow, 69840); near(cvNow, 110160); near(pl, -6160);
near(dNew, 35000); near(vehDep, 165640);
// distractors: no current-year depreciation → loss 18 400; full year → profit 6 080
near(tv.tradeIn - (tv.cost - ad24), -18400);
near(Math.round(tv.tradeIn - (tv.cost - ad24 - (tv.cost - ad24) * 0.2)), 6080);

// ── L3: sales with a staff discount ──
const s = { cos: 3250000, mu: 50, staffCost: 80000, staffMu: 30 };
const sales = s.cos * (100 + s.mu) / 100 - s.staffCost * (s.mu - s.staffMu) / 100;
near(sales, 4859000);
near(1800000 * 0.6, 1080000);

// ── L4: rent income (10% increase on 1 Nov 2024, received up to 31 Mar 2025) and provision for bad debts ──
const rentBooks = 162000, rentOld = rentBooks / (8 + 5 * 1.1), rentNew = rentOld * 1.1;
const rentIncome = rentBooks - rentNew;
const pbd = { debtors: 384000, pct: 4, open: 18200 }, pbdClose = pbd.debtors * pbd.pct / 100, pbdAdj = pbd.open - pbdClose;
assert.ok(Math.abs(rentOld - 12000) < 1e-6); assert.ok(Math.abs(rentIncome - 148800) < 1e-6);
near(pbdClose, 15360); near(pbdAdj, 2840);

// ── L5: packing material, stock deficit, insurance ──
const pk = { books: 48300, onHand: 6900 }, packUsed = pk.books - pk.onHand;
const stk = { books: 512800, count: 508650 }, deficit = stk.books - stk.count;
const ins = { paid: 73500, months: 15 }, insExp = ins.paid / ins.months * 12;
near(packUsed, 41400); near(deficit, 4150); near(insExp, 58800);
near(18600 - 2450, 16150);

// ── L6: omitted employee and directors' fees ──
const emp = { net: 16470, dedPct: 30, med: 1800, employerPct: 12, books: 1186400 };
const gross = (emp.net + emp.med) / (1 - emp.dedPct / 100), employer = gross * emp.employerPct / 100, salaries = emp.books + gross + employer;
assert.ok(Math.abs(gross - 26100) < 1e-6); assert.ok(Math.abs(employer - 3132) < 1e-6); assert.ok(Math.abs(salaries - 1215632) < 1e-6);
const dir = { combined3: 1620000, inc: 4000 }; // increase on 1 June: 3 months old fee + 9 months new fee, per director
const oldFee = (dir.combined3 / 3 - 9 * dir.inc) / 12, newFee = oldFee + dir.inc, dirFees = dir.combined3 + 3 * newFee;
near(oldFee, 42000); near(dirFees, 1758000);
near((14400 + 1350) / 0.75, 21000);

// ── L7: bottom of the statement ──
const b = { npat: 1152000, taxPct: 28, intExp: 186500, opProfit: 1694300 };
const npbt = b.npat * 100 / (100 - b.taxPct), tax = b.npat * b.taxPct / (100 - b.taxPct), intInc = npbt + b.intExp - b.opProfit;
near(npbt, 1600000); near(tax, 448000); near(intInc, 92200);

// ── exam (memo) figures quoted in the explanations — checked so the explanation text cannot drift ──
near(472500 - 344700, 127800);
near(1250000 - 240000 + 320000, 1330000);
near(320000 * 0.2 * 6 / 12 + (240000 - 73600) * 0.2 * 6 / 12 + 132720, 181360);
near(153660 - (240000 - 73600 - 16640), 3900);
near(Math.round(4780900 * 1.6 - 115000 * 0.2), 7626440);
near(1757700 + 3900 + (158100 - 2 * 10695) + (29520 - 516600 * 0.05), 1902000);
near(158100 / 13.6 * 0.92, 10695);
near(100800 / 15 * 12, 80640);
near((19340 + 2500) / 0.65, 33600);
near((1065200 / 2 - 7 * 5800) / 12, 41000);
near(992160 * 100 / 72, 1378000);
near(1378000 + 149400 - (4747540 - 3371340), 151200);

module.exports = [
  // ── L01 ── 1.1.1–1.1.2 equipment depreciation and cost of vehicles ──────────
  {
    order: 1, name: 'Question 1.1.1–1.1.2: Depreciation on equipment and cost of vehicles', marks: 6, qpages: 2, mpages: 1,
    info: ['No equipment was bought or sold during the year.', 'A vehicle costing R210 000 was traded in for a new vehicle costing R350 000.', 'A is the depreciation on equipment for the year; B is the cost of vehicles at the end of the year.'],
    covers: 'Questions 1.1.1 and 1.1.2 — depreciation on equipment from the change in accumulated depreciation, and the cost of vehicles after a trade-in.',
    tags: ['fixed_asset_depreciation', 'vehicles_at_cost'],
    figs: [{
      title: 'Fixed assets (extract): Kudu Ltd', subtitle: 'balances in the books', cols: ['', '28 Feb 2025', '29 Feb 2024'],
      rows: [
        LN2('Equipment at cost', fmt(eq.cost), fmt(eq.cost)),
        LN2('Accumulated depreciation on equipment', fmt(eqAdClose), fmt(eq.adOpen)),
        LN2('Depreciation on equipment for the year', blank('A'), ''),
        LN2('Vehicles at cost', blank('B'), fmt(veh.open)),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A and B.',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(eqDep), String(vehClose)], 'standard_math',
        { fig: 0, unit: U, topic: T_FA, subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 2, w: 3, type: 'calc',
          clues: '- Compare the accumulated depreciation at the two dates.\n- Remove the cost of the old vehicle and add the cost of the new one.' }),
      fb('Machinery costs R500 000 and its accumulated depreciation at the start of the year is R180 000. It is depreciated at 15% p.a. on the diminishing-balance method. Nothing was bought or sold. Calculate the depreciation for the year.',
        ['Depreciation = R ', '[ ]'], ['48000'], 'standard_math',
        { unit: U, topic: T_FA, subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      mc('An old vehicle is traded in for a new one. Which amount is removed from the Vehicles (at cost) account?',
        'The original cost price of the old vehicle', ['The carrying value of the old vehicle', 'The trade-in value received for the vehicle', 'The accumulated depreciation of the vehicle'],
        { unit: U, topic: T_FA, subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 1, type: 'application' }),
      mt('Match each fixed-asset term to its meaning.',
        [['Cost price', 'Amount paid to acquire the asset'], ['Carrying value', 'Cost less accumulated depreciation'], ['Diminishing balance', 'Rate applied to the carrying value'], ['Straight line', 'Rate applied to the cost price']],
        { unit: U, topic: T_FA, subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 2, type: 'definition' }),
    ],
    subs: [
      ex('1.1.1', 2,
        ['No equipment was bought or sold, so the only change in accumulated depreciation is this year\'s depreciation.', 'Both balances are given in Information A.'],
        ['Subtract the opening accumulated depreciation from the closing accumulated depreciation.'],
        ['Depreciation on equipment = R472 500 – R344 700 = R127 800.']),
      ex('1.1.2', 4,
        ['The vehicle traded in leaves the account at its cost price.', 'The new vehicle enters the account at its cost price.'],
        ['Start with the opening cost, subtract the cost of the vehicle traded in and add the new vehicle.'],
        ['Vehicles at cost = R1 250 000 – R240 000 + R320 000 = R1 330 000.']),
    ],
  },

  // ── L02 ── 1.1.3–1.1.4 vehicle depreciation and the trade-in ───────────────
  {
    order: 2, name: 'Question 1.1.3–1.1.4: Depreciation on vehicles and the trade-in', marks: 10, qpages: 2, mpages: 1,
    info: ['Cost price of the vehicle: R180 000, bought on 1 June 2022. The financial year ends on the last day of February.', 'Depreciation: 20% p.a. on the diminishing-balance method.', 'The vehicle was traded in on 1 September 2024 for R104 000.', 'A is the depreciation for the current year up to the trade-in date.'],
    covers: 'Questions 1.1.3 and 1.1.4 — depreciation on vehicles (new vehicle, vehicle traded in, remaining vehicles) and the profit or loss on the vehicle traded in.',
    tags: ['fixed_asset_depreciation', 'asset_disposal', 'fixed_asset_register'],
    figs: [{
      title: 'Fixed Asset Register (extract): Kudu Ltd', subtitle: 'vehicle traded in', cols: ['Financial year end', 'Depreciation', 'Accumulated'],
      rows: [
        LN2('28 February 2023', fmt(d23), fmt(d23)),
        LN2('29 February 2024', fmt(d24), fmt(ad24)),
        LN2('1 September 2024', blank('A'), ''),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amount A.',
        ['A = ', '[ ]'], [String(dNow)], 'standard_math',
        { fig: 0, unit: U, topic: T_FA, subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 3, w: 3, type: 'calc',
          clues: '- Use the carrying value at the start of the year.\n- Count the months from 1 March to the trade-in date.' }),
      mc('The vehicle in the figure was traded in for R104 000. What is the result on disposal?',
        'A loss of R6 160', ['A profit of R6 160', 'A loss of R18 400', 'A profit of R6 080'],
        { fig: 0, unit: U, topic: T_FA, subtopic: 'acc_calculation', skill: SK.calc, diff: 4, w: 3, type: 'calc' }),
      fb('Kudu Ltd bought a new vehicle for R350 000 on 1 September 2024. Depreciation on the vehicle traded in was R12 240 and on the remaining old vehicles R118 400. Depreciation is 20% p.a. on the diminishing-balance method. Calculate the total depreciation on vehicles for the year ended 28 February 2025.',
        ['Depreciation = R ', '[ ]'], [String(vehDep)], 'standard_math',
        { unit: U, topic: T_FA, subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      ord('Arrange the steps to find the profit or loss on a vehicle traded in.',
        ['Find the accumulated depreciation at the last year end', 'Calculate depreciation up to the date of disposal', 'Subtract total accumulated depreciation from cost', 'Compare the carrying value with the trade-in value'],
        { unit: U, topic: T_FA, subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'ordering' }),
    ],
    subs: [
      ex('1.1.3', 5,
        ['Three parts make up the depreciation on vehicles: the new vehicle, the vehicle traded in and the remaining vehicles.', 'The new vehicle and the old vehicle were each used for six months of the year.'],
        ['Use 6/12 of a year for both the new vehicle and the vehicle traded in.', 'For the diminishing-balance method, apply the rate to the carrying value.'],
        ['New vehicle: R320 000 × 20% × 6/12 = R32 000.', 'Vehicle traded in: (R240 000 – R73 600) × 20% × 6/12 = R166 400 × 10% = R16 640.', 'Total = R32 000 + R16 640 + R132 720 = R181 360.']),
      ex('1.1.4', 5,
        ['The accumulated depreciation at the trade-in date includes this year\'s R16 640.', 'Compare the carrying value with the trade-in value received.'],
        ['Add this year\'s depreciation to the accumulated depreciation at the last year end.', 'Subtract it from the cost, then compare the result with the trade-in value.'],
        ['Accumulated depreciation = R73 600 + R16 640 = R90 240.', 'Carrying value = R240 000 – R90 240 = R149 760.', 'Trade-in value R153 660 – R149 760 = R3 900 profit on the vehicle traded in.']),
    ],
  },

  // ── L03 ── 1.2 sales and gross profit ──────────────────────────────────────
  {
    order: 3, name: 'Question 1.2: Statement of Comprehensive Income — sales and gross profit', marks: 6, qpages: 2, mpages: 1,
    info: ['The company uses a mark-up of 50% on cost.', 'Goods costing R80 000 (included in cost of sales) were sold to employees at a mark-up of 30% on cost.'],
    covers: 'Question 1.2 (sales and gross profit) — sales worked out from the cost of sales and the mark-up, with goods sold to employees at a lower mark-up.',
    tags: ['statement_of_comprehensive_income', 'mark_up_and_sales'],
    figs: [{
      title: 'Statement of Comprehensive Income (extract): Impala Ltd', subtitle: 'for the year ended 28 February 2025', cols: ['', 'R'],
      rows: [
        LN('Sales', blank('A'), 0),
        LN('Cost of sales', fmt(-s.cos), 0),
        SUBT('Gross profit', ''),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amount A.',
        ['A = ', '[ ]'], [String(sales)], 'standard_math',
        { fig: 0, unit: U, topic: T_SCI, subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Work out sales as if every item had the normal mark-up.\n- Then remove the mark-up the employees did not pay.' }),
      fb('A shop\'s cost of sales was R1 800 000. All goods were sold at a mark-up of 60% on cost. Calculate the gross profit.',
        ['Gross profit = R ', '[ ]'], ['1080000'], 'standard_math',
        { unit: U, topic: T_SCI, subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      mc('Goods costing R10 000, normally sold at a 50% mark-up, were sold to staff at a 30% mark-up. By how much are sales lower than normal?',
        'R2 000', ['R3 000', 'R5 000', 'R1 300'],
        { unit: U, topic: T_SCI, subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      ms('A business uses a mark-up of 50% on cost. Select ALL the true statements.',
        ['Selling price is 150% of the cost price', 'Gross profit is 50% of the cost of sales'],
        ['Gross profit is 50% of the sales amount', 'Selling price is 50% of the cost price', 'Cost price is 50% of the selling price'],
        { unit: U, topic: T_SCI, subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.2', 6,
        ['The mark-up is 60% on cost, but goods costing R115 000 were sold to employees at only 40%.', 'Cost of sales of R4 780 900 is given in the answer book.'],
        ['Work out sales at the normal mark-up on the full cost of sales.', 'Subtract the 20% mark-up the employees did not pay, then find the gross profit.'],
        ['Sales = R4 780 900 × 1,6 = R7 649 440 – (R115 000 × 0,2 = R23 000) = R7 626 440.', 'Alternative: (R4 665 900 × 1,6) + (R115 000 × 1,4) = R7 465 440 + R161 000 = R7 626 440.', 'Gross profit = R7 626 440 – R4 780 900 = R2 845 540.']),
    ],
  },

  // ── L04 ── 1.2 other income ─────────────────────────────────────────────────
  {
    order: 4, name: 'Question 1.2: Statement of Comprehensive Income — other income', marks: 9, qpages: 2, mpages: 1,
    info: ['Rent income in the books is R162 000. Rent has been received up to 31 March 2025.', 'The monthly rent was increased by 10% on 1 November 2024.', 'Debtors\' control is R384 000. The provision for bad debts must be 4% of debtors; it was R18 200 at the start of the year.'],
    covers: 'Question 1.2 (other income) — rent income after an amount received in advance and a change in the rent, the provision for bad debts adjustment, and the profit on the asset disposed of.',
    tags: ['income_received_in_advance', 'provision_for_bad_debts', 'statement_of_comprehensive_income'],
    figs: [{
      title: 'Statement of Comprehensive Income (extract): Impala Ltd', subtitle: 'for the year ended 28 February 2025', cols: ['', 'R'],
      rows: [
        H('Other income'),
        LN('Commission income', fmt(286400)),
        LN('Rent income', blank('A')),
        LN('Provision for bad debts adjustment', blank('B')),
        LN('Profit on sale of asset', fmt(5200)),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A and B.',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(rentIncome), String(pbdAdj)], 'standard_math',
        { fig: 0, unit: U, topic: T_SCI, subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Find the old monthly rent from the total: count the months at each rate.\n- Compare the new provision with the old one.' }),
      fb('A business receives rent of R9 500 per month. Rent has been received up to 30 April 2025. Its financial year ended on 28 February 2025. Calculate the rent received in advance.',
        ['Received in advance = R ', '[ ]'], ['19000'], 'standard_math',
        { unit: U, topic: T_SCI, subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      mc('The provision for bad debts decreased during the year. Where is this adjustment shown?',
        'As other income in the Statement of Comprehensive Income', ['As an operating expense in the Statement of Comprehensive Income', 'As a current liability in the Statement of Financial Position', 'As a deduction from sales in the Statement of Comprehensive Income'],
        { unit: U, topic: T_SCI, subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the items that are shown under other income.',
        ['Rent income', 'Profit on sale of an asset', 'Decrease in provision for bad debts'],
        ['Loss on sale of an asset', 'Bad debts written off'],
        { unit: U, topic: T_SCI, subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.2', 9,
        ['Rent was received up to 30 April 2024, two months past the year end, and the rent dropped by 8% on 1 December 2023.', 'The provision must be 5% of debtors of R516 600; it was R29 520.'],
        ['Find the monthly rent from 9 months at the old rate plus 5 months at 92%, then remove the two months received in advance.', 'Compare the new provision with the old one; a decrease is income.'],
        ['Rent: R158 100 ÷ 13,6 = R11 625 a month before the decrease; R11 625 × 0,92 = R10 695 after it.', 'Rent income = R158 100 – (R10 695 × 2 = R21 390) = R136 710.', 'Provision adjustment = R29 520 – (R516 600 × 5% = R25 830) = R3 690 income.', 'Other income = R1 757 700 + R3 900 (profit, 1.1.4) + R136 710 + R3 690 = R1 902 000; gross operating income = R4 747 540.']),
    ],
  },

  // ── L05 ── 1.2 operating expenses: packing, stock deficit, insurance ────────
  {
    order: 5, name: 'Question 1.2: Statement of Comprehensive Income — stock, packing and insurance', marks: 9, qpages: 2, mpages: 1,
    info: ['Packing material in the books is R48 300. Packing material on hand at the end of the year is R6 900.', 'Trading stock in the books is R512 800; a physical stocktaking showed R508 650.', 'Insurance of R73 500 has been paid up to 31 May 2025. The monthly premium did not change.'],
    covers: 'Question 1.2 (operating expenses) — packing material used, the trading stock deficit, insurance with an amount prepaid, and depreciation from Question 1.1.',
    tags: ['prepaid_expenses', 'trading_stock_deficit', 'statement_of_comprehensive_income'],
    figs: [{
      title: 'Statement of Comprehensive Income (extract): Impala Ltd', subtitle: 'for the year ended 28 February 2025', cols: ['', 'R'],
      rows: [
        H('Operating expenses'),
        LN('Audit fees', fmt(64000)),
        LN('Packing material', blank('A')),
        LN('Trading stock deficit', blank('B')),
        LN('Insurance', blank('C')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], [String(packUsed), String(deficit), String(insExp)], 'standard_math',
        { fig: 0, unit: U, topic: T_SCI, subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 3, w: 3, type: 'calc',
          clues: '- Only what was used is an expense.\n- Count how many months the insurance payment covers.' }),
      mc('Trading stock in the books is higher than the physical stock count. How is the difference shown?',
        'As a trading stock deficit under operating expenses', ['As a trading stock surplus under other operating income', 'As a current liability on the financial position', 'As a deduction from sales above gross profit'],
        { unit: U, topic: T_SCI, subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
      ms('Insurance was paid up to three months after the year end. Select ALL the correct statements.',
        ['The amount paid covers 15 months', 'Three months are an expense prepaid'],
        ['The expense for the year is 15 months', 'The prepaid part is shown as income', 'The prepaid part is a current liability'],
        { unit: U, topic: T_SCI, subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      fb('Stationery in the books is R18 600. Stationery on hand at the end of the year is R2 450. Calculate the stationery expense for the year.',
        ['Stationery = R ', '[ ]'], ['16150'], 'standard_math',
        { unit: U, topic: T_SCI, subtopic: 'acc_calculation', skill: SK.calc, diff: 1, w: 1, type: 'calc' }),
    ],
    subs: [
      ex('1.2', 9,
        ['Stocktaking gave the packing material used and the physical trading stock.', 'Insurance was paid up to 31 May 2024 at a fixed monthly premium, so 3 months are prepaid.'],
        ['Use the packing material used, and the difference between book stock and physical stock as a deficit.', 'Divide the insurance by 15 months and keep 12 months as the expense.'],
        ['Packing material = R58 700 (the amount used); trading stock deficit = R654 500 – R647 100 = R7 400.', 'Insurance = R100 800 – (R100 800 × 3/15 = R20 160) = R80 640.', 'Depreciation = R127 800 (1.1.1) + R181 360 (1.1.3) = R309 160.']),
    ],
  },

  // ── L06 ── 1.2 operating expenses: salaries and directors' fees ─────────────
  {
    order: 6, name: 'Question 1.2: Statement of Comprehensive Income — salaries and directors\' fees', marks: 9, qpages: 2, mpages: 1,
    info: ['Salaries and wages in the books are R1 186 400.', 'An employee was left out of the February salaries journal: net salary R16 470 after deductions of 30% (pension and PAYE) and R1 800 for medical aid.', 'The employer contributes 12% of gross salary to the pension fund.', 'Three directors earned a combined R1 620 000. Each fee rose by R4 000 a month on 1 June 2024.', 'A fourth director joined on 1 December 2024 at the new monthly fee.'],
    covers: 'Question 1.2 (operating expenses) — salaries and wages with an omitted employee and the employer\'s contribution, and directors\' fees with an increase and a new director.',
    tags: ['salaries_and_deductions', 'directors_fees', 'statement_of_comprehensive_income'],
    figs: [{
      title: 'Statement of Comprehensive Income (extract): Impala Ltd', subtitle: 'for the year ended 28 February 2025', cols: ['', 'R'],
      rows: [
        H('Operating expenses'),
        LN('Audit fees', fmt(64000)),
        LN('Salaries and wages', blank('A')),
        LN('Directors\' fees', blank('B')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A and B.',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(salaries), String(dirFees)], 'standard_math',
        { fig: 0, unit: U, topic: T_SCI, subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 5, w: 3, type: 'calc',
          clues: '- Add the medical aid back to the net salary before grossing up.\n- Find one director\'s old monthly fee first: 3 months old, 9 months new.' }),
      fb('An employee\'s net salary is R14 400 after deductions of 25% (pension and PAYE) and R1 350 for medical aid. Calculate the gross salary.',
        ['Gross salary = R ', '[ ]'], ['21000'], 'standard_math',
        { unit: U, topic: T_SCI, subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      mc('An employee was left out of the salaries journal. Which amounts are added to the salaries expense?',
        'Gross salary plus the employer\'s contributions', ['Net salary plus the employer\'s contributions', 'Gross salary less the employee\'s deductions', 'Net salary plus the employee\'s deductions'],
        { unit: U, topic: T_SCI, subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the items that are an extra cost to the employer.',
        ['Employer\'s pension fund contribution', 'Employer\'s UIF contribution'],
        ['PAYE deducted from the salary', 'Employee\'s medical aid deduction', 'Employee\'s pension contribution'],
        { unit: U, topic: T_SCI, subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.2', 9,
        ['The employee\'s net salary is after 35% deductions and R2 500 medical aid; the employer adds 10% for pension.', 'Two directors\' fees rose by R5 800 a month each on 1 August 2023; a third joined on 1 November 2023 without the increase.'],
        ['Add the medical aid back, then divide by 65% to find the gross salary.', 'Find one director\'s old monthly fee from the combined fee, then add four months for the new director.'],
        ['Gross salary = (R19 340 + R2 500) ÷ 65% = R33 600; employer pension = R3 360.', 'Salaries and wages = R1 425 600 + R33 600 + R3 360 = R1 462 560.', 'Old fee: (R1 065 200 ÷ 2 – 7 × R5 800) ÷ 12 = R41 000; new director = 4 × R41 000 = R164 000.', 'Directors\' fees = R1 065 200 + R164 000 = R1 229 200.']),
    ],
  },

  // ── L07 ── 1.2 operating profit to net profit after tax ─────────────────────
  {
    order: 7, name: 'Question 1.2: Statement of Comprehensive Income — interest and income tax', marks: 6, qpages: 2, mpages: 1,
    info: ['Net profit after tax is R1 152 000.', 'Income tax is 28% of the net profit before tax.', 'Brackets on the statement show an amount that is subtracted.'],
    covers: 'Question 1.2 (bottom section) — operating profit, interest income as a balancing figure, net profit before tax and income tax worked back from the net profit after tax.',
    tags: ['income_tax_calculation', 'statement_of_comprehensive_income'],
    figs: [{
      title: 'Statement of Comprehensive Income (extract): Impala Ltd', subtitle: 'for the year ended 28 February 2025', cols: ['', 'R'],
      rows: [
        SUBT('Operating profit', fmt(b.opProfit)),
        LN('Interest income', ''),
        SUBT('Profit before interest expense', ''),
        LN('Interest expense', fmt(-b.intExp), 0),
        SUBT('Net profit before tax', blank('A')),
        LN('Income tax', blank('B'), 0),
        TOT('Net profit after tax', fmt(b.npat)),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A and B.',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(npbt), `${tax}|-${tax}`], 'standard_math',
        { fig: 0, unit: U, topic: T_SCI, subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 3, w: 3, type: 'calc',
          clues: '- Net profit after tax is 72% of the net profit before tax.' }),
      fb('Use the figure and your answer for A. Calculate the interest income.',
        ['Interest income = R ', '[ ]'], [String(intInc)], 'standard_math',
        { fig: 0, unit: U, topic: T_SCI, subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      mc('Net profit after tax is R720 000 and income tax is 28% of net profit before tax. Which calculation gives the income tax?',
        'R720 000 × 28 ÷ 72', ['R720 000 × 28 ÷ 100', 'R720 000 × 72 ÷ 28', 'R720 000 × 100 ÷ 128'],
        { unit: U, topic: T_SCI, subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      ord('Arrange these lines of the Statement of Comprehensive Income from top to bottom.',
        ['Gross profit', 'Gross operating income', 'Operating profit', 'Net profit before tax', 'Net profit after tax'],
        { unit: U, topic: T_SCI, subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 1, type: 'ordering' }),
    ],
    subs: [
      ex('1.2', 6,
        ['Net profit after tax of R992 160 is given, and income tax is 28% of net profit.', 'Interest income is the balancing figure between operating profit and profit before interest expense.'],
        ['Work back from net profit after tax to net profit before tax and income tax.', 'Add back the interest expense, then subtract the operating profit to find interest income.'],
        ['Operating profit = R4 747 540 – R3 371 340 = R1 376 200.', 'Net profit before tax = R992 160 × 100/72 = R1 378 000; income tax = R992 160 × 28/72 = R385 840.', 'Profit before interest expense = R1 378 000 + R149 400 = R1 527 400; interest income = R1 527 400 – R1 376 200 = R151 200.']),
    ],
  },
];
