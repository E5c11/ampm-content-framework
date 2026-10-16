'use strict';
// Accounting 2024 Nov P2 — Question 3 (Budgeting) lessons 11–15. Fresh numbers; every figure computed and asserted.
const assert = require('assert');
const { mc, ms, mt, fb, ex, fmt, blank } = require('./lib');

const LN = (t, ...c) => ({ k: 'line', c: [t, ...c] });
const TOT = (t, ...c) => ({ k: 'total', c: [t, ...c] });

const U = 'budgeting';
const SK = { stmt: 'complete_financial_statement', calc: 'calculate_accounting_amount', term: 'recall_accounting_term', cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario', int: 'interpret_financial_indicators' };

// L11: cash budget vs projected income statement
const fdIn = 194400, fdCap = 180000, fdInt = fdIn - fdCap;
assert.strictEqual(fdInt, 14400); assert.strictEqual(162000 - 150000, 12000);
// L12: credit purchases and creditors' payment schedule — 40% cash sales, 50% mark-up, 60% next month less 5% discount, 40% month after
const cashNov = 72000, salesNov = cashNov * 100 / 40, purNov = salesNov * 100 / 150;
const purSep = 100000, purOct = 110000;
const novCol = { sep: purSep * 0.4, oct: purOct * 0.6 * 0.95 }, decCol = { oct: purOct * 0.4, nov: purNov * 0.6 * 0.95 };
assert.strictEqual(salesNov, 180000); assert.strictEqual(purNov, 120000);
assert.strictEqual(novCol.sep, 40000); assert.strictEqual(novCol.oct, 62700); assert.strictEqual(decCol.oct, 44000); assert.strictEqual(decCol.nov, 68400);
assert.strictEqual(50000 * 100 / 25 * 100 / 160, 125000); assert.ok(Math.abs(80000 * 0.75 * 0.97 - 58200) < 1e-6);
// L13: rent +8%, loan interest after a part repayment
const rentNov = 24000, rentDec = rentNov * 1.08, intNov = 4000, loan = intNov * 12 / 0.12, intDec = (loan - 100000) * 0.12 / 12;
assert.ok(Math.abs(rentDec - 25920) < 1e-6); assert.ok(Math.abs(loan - 400000) < 1e-6); assert.ok(Math.abs(intDec - 3000) < 1e-6);
assert.ok(Math.abs(18500 * 1.06 - 19610) < 1e-6); assert.ok(Math.abs((5000 * 12 / 0.15 - 80000) * 0.15 / 12 - 4000) < 1e-6);
// L14: equipment deposit, insurance and salaries
const inst = 6300, depo = inst * 24 / 0.75 * 0.25, insNov = 15200, insDec = insNov + 3800 * 0.25, salDec = 120000, salNov = salDec / (8 + 4 * 0.5) * 8;
assert.ok(Math.abs(depo - 50400) < 1e-6); assert.strictEqual(insDec, 16150); assert.strictEqual(salNov, 96000);
assert.strictEqual(115200 / (6 + 4 * 0.5), 14400); assert.ok(Math.abs(5000 * 36 / 0.8 * 0.2 - 45000) < 1e-6);
// L15: sales policy and expense control
const sep = { sales: 120000, cash: 48000, credit: 72000 }, ob = { cust: 500, sales: 150000, cash: 90000, credit: 60000, gp: 50000, del: 18000, pack: 9000 }, oa = { cust: 700, sales: 210000, cash: 63000, credit: 147000, gp: 70000, del: 25200, pack: 18900 };
assert.strictEqual(sep.cash + sep.credit, sep.sales); assert.strictEqual(ob.cash + ob.credit, ob.sales); assert.strictEqual(oa.cash + oa.credit, oa.sales);
assert.strictEqual(sep.cash / sep.sales, 0.4); assert.strictEqual(ob.cash / ob.sales, 0.6);
assert.strictEqual(ob.del / ob.sales, 0.12); assert.strictEqual(oa.del / oa.sales, 0.12); assert.strictEqual(ob.pack / ob.sales, 0.06); assert.strictEqual(oa.pack / oa.sales, 0.09);
assert.strictEqual((oa.pack - ob.pack) * 100 / ob.pack, 110);

module.exports = [
  // ── L11 ── 3.1 cash budget or projected income statement ────────────────────
  {
    order: 11, name: 'Question 3.1: Cash Budget or Projected Statement of Comprehensive Income', marks: 6, qp: '8', mp: '7', qpages: 1, mpages: 1,
    covers: 'Question 3.1 — placing cash sales and cost of sales, drawings, and a maturing fixed deposit in the Cash Budget and/or the Projected Statement of Comprehensive Income.',
    tags: ['cash_budget_vs_income_statement', 'fixed_deposit_maturity'],
    info: [
      'Expected cash sales for January 2026, R96 000. Cost of sales, R72 000.',
      'Drawings by the owner, R30 000: R26 000 in cash and the rest in merchandise.',
      'A fixed deposit of R180 000 matures on 31 January 2026. R194 400, including interest, is deposited into the current account. Interest is not capitalised.',
    ],
    figs: [{
      title: 'Budget items: Thabo\'s Hardware', subtitle: 'January 2026', cols: ['', 'Cash Budget', 'Income stmt'],
      rows: [
        LN('1. Cash sales', fmt(96000), fmt(96000)),
        LN('1. Cost of sales', '—', fmt(72000)),
        LN('2. Drawings', blank('A'), '—'),
        LN('3. Fixed deposit matures', blank('B'), blank('C')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the amounts A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], ['26000', String(fdIn), String(fdInt)], 'standard_math',
        { fig: 0, unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Only the cash part of drawings is a payment.\n- The income statement shows only the interest earned, not the capital returned.' }),
      mc('Which item appears in the Cash Budget but NOT in the Projected Statement of Comprehensive Income?',
        'Drawings by the owner', ['Depreciation on equipment', 'Interest on a fixed deposit', 'Cost of sales'],
        { unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the items that appear in the Projected Statement of Comprehensive Income only.',
        ['Depreciation on vehicles', 'Bad debts written off', 'Cost of sales'],
        ['Loan repayment to the bank', 'Capital contributed by the owner'],
        { unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      fb('A fixed deposit of R150 000 matures and R162 000, including interest, is paid into the bank. Calculate the interest income shown in the Projected Statement of Comprehensive Income.',
        ['Interest income = R ', '[ ]'], ['12000'], 'standard_math',
        { unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
    ],
    subs: [ex('3.1', 6,
      ['The Cash Budget shows cash received and paid; the projected income statement shows income and expenses.', 'Cost of sales is not a cash flow, and drawings are not an expense.'],
      ['Decide for each item which statement(s) it belongs in.', 'Split a fixed-deposit receipt into capital and interest.'],
      ['3.1.1: Cash sales R132 000 in receipts and income; cost of sales R101 000 as an expense only.',
        '3.1.2: R34 000 cash drawings as a payment only.',
        '3.1.3: R264 600 as a receipt; interest income R19 600 (R264 600 − R245 000).'])],
  },

  // ── L12 ── 3.2.1 credit purchases and creditors' payment schedule ───────────
  {
    order: 12, name: 'Question 3.2.1: Credit purchases and the creditors\' payment schedule', marks: 9, qp: '8-9', mp: '7', qpages: 2, mpages: 1,
    covers: 'Question 3.2.1 — working back from cash sales to the month\'s credit purchases, and completing the Creditors\' Payment Schedule with a settlement discount.',
    tags: ['creditors_payment_schedule', 'supplier_payment_benefits'],
    info: [
      'Cash sales are 40% of total sales. Budgeted cash sales for November 2025: R72 000.',
      'Goods are sold at a mark-up of 50% on cost. Stock is replaced monthly, and all stock is bought on credit.',
      'Creditors are paid 60% in the month after purchase, less 5% discount, and the balance in the month after that.',
    ],
    figs: [{
      title: 'Creditors\' Payment Schedule: Spares Hub', subtitle: 'for December 2025', cols: ['Month', 'Purchases', 'November', 'December'],
      rows: [
        LN('September', fmt(purSep), fmt(novCol.sep), ''),
        LN('October', fmt(purOct), fmt(novCol.oct), blank('A')),
        LN('November', blank('B'), '', blank('C')),
        TOT('Total', '', fmt(novCol.sep + novCol.oct), ''),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], [String(decCol.oct), String(purNov), String(decCol.nov)], 'standard_math',
        { fig: 0, unit: U, topic: 'creditors_payment_schedule', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 5, w: 3, type: 'calc',
          clues: '- Find total sales from cash sales, then remove the mark-up.\n- The discount applies only to the part paid in the month after purchase.' }),
      fb('Cash sales are 25% of total sales and goods are sold at a mark-up of 60% on cost. Budgeted cash sales are R50 000. Stock is replaced monthly. Calculate the credit purchases.',
        ['Credit purchases = R ', '[ ]'], ['125000'], 'standard_math',
        { unit: U, topic: 'creditors_payment_schedule', subtopic: 'acc_calculation', skill: SK.calc, diff: 4, w: 2, type: 'calc' }),
      mc('Creditors are paid 75% in the month after purchase to earn a 3% discount. March purchases are R80 000. How much is paid in April for March purchases?',
        'R58 200', ['R60 000', 'R61 800', 'R20 000'],
        { unit: U, topic: 'creditors_payment_schedule', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      ms('Select the TWO benefits of paying creditors within the discount period.',
        ['The business saves on the cost of its purchases', 'It builds a good relationship with the supplier'],
        ['The business earns interest on the amount owed', 'The mark-up on goods sold rises automatically', 'The business may pay the full invoice later'],
        { unit: U, topic: 'creditors_payment_schedule', subtopic: 'acc_interpretation', skill: SK.int, diff: 2, w: 2, type: 'interpretation' }),
    ],
    subs: [ex('3.2.1', 9,
      ['Cash sales are 60% of total sales, and goods are sold at cost plus 25%.', 'Stock is replaced monthly, so purchases equal cost of sales.'],
      ['Gross up cash sales to total sales, then remove the mark-up to find credit purchases.', 'In the schedule, apply the 3% discount only to the 75% paid in the month after purchase.'],
      ['November credit purchases: R103 200 × 100/60 × 100/125 = R137 600.',
        'December: October R132 800 × 25% = R33 200; November R137 600 × 75% × 97% = R100 104.',
        'Total payments in December = R133 304.'])],
  },

  // ── L13 ── 3.2.2 (i)–(ii) rent and interest on loan ─────────────────────────
  {
    order: 13, name: 'Question 3.2.2 (i)–(ii): Rent and interest on loan', marks: 6, qp: '8-10', mp: '8', qpages: 3, mpages: 1,
    covers: 'Question 3.2.2 (i) and (ii) — rent after a percentage increase, and monthly interest after part of a loan is repaid.',
    tags: ['budgeted_expenses', 'loan_interest'],
    info: [
      'Rent increases by 8% from December 2025.',
      'R100 000 of the bank loan will be repaid on 1 December 2025.',
      'Interest on the loan is 12% p.a., paid at the end of each month. Interest is not capitalised.',
    ],
    figs: [{
      title: 'Cash Budget extract: Spares Hub', subtitle: 'November and December 2025', cols: ['', 'Nov (R)', 'Dec (R)'],
      rows: [
        LN('Rent expense', fmt(rentNov), blank('A')),
        LN('Loan repayment', '', fmt(100000)),
        LN('Interest on loan (12% p.a.)', fmt(intNov), blank('B')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the amounts A and B for December.',
        ['A = ', '[ ]', '   B = ', '[ ]'], ['25920', '3000'], 'standard_math',
        { fig: 0, unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Work out the loan balance from November\'s interest first.\n- December interest is on the balance after the repayment.' }),
      fb('Monthly rent of R18 500 will increase by 6% from January. Calculate the rent for January.',
        ['Rent = R ', '[ ]'], ['19610'], 'standard_math',
        { unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      mc('November interest on a loan at 15% p.a. was R5 000. R80 000 of the loan is repaid on 1 December. What is the interest for December?',
        'R4 000', ['R5 000', 'R1 000', 'R4 800'],
        { unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_calculation', skill: SK.calc, diff: 4, w: 2, type: 'calc' }),
      mt('Match each budget amount to the way it is calculated.',
        [['Rent after an 8% increase', 'Old rent × 1,08'], ['One month\'s interest', 'Loan balance × rate ÷ 12'], ['The rent increase only', 'Old rent × 0,08'], ['A full year\'s interest', 'Loan balance × rate']],
        { unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('3.2.2 (i)', 2, ['Rent increases by 6% in December.'], ['Multiply November rent by 106%.'], ['R29 000 × 106/100 = R30 740.']),
      ex('3.2.2 (ii)', 4, ['November interest of R3 500 at 14% p.a. means the loan was R300 000.', 'R60 000 is repaid on 1 December.'],
        ['Find the reduced loan balance.', 'Calculate one month\'s interest on it.'],
        ['(R300 000 − R60 000) × 14/100 × 1/12 = R2 800.', 'Or R3 500 − (R60 000 × 14/100 × 1/12 = R700) = R2 800.']),
    ],
  },

  // ── L14 ── 3.2.2 (iii)–(v) equipment deposit, insurance, salaries ───────────
  {
    order: 14, name: 'Question 3.2.2 (iii)–(v): Equipment deposit, insurance and salaries', marks: 9, qp: '8-10', mp: '8', qpages: 3, mpages: 1,
    covers: 'Question 3.2.2 (iii)–(v) — the deposit on equipment bought on instalments, insurance after a premium increase, and salaries before a December bonus.',
    tags: ['budgeted_expenses', 'employee_remuneration'],
    info: [
      'New equipment: a 25% cash deposit is paid on 30 November 2025; the balance is paid in 24 equal monthly instalments from 31 December 2025.',
      'The monthly premium on the vehicles, R3 800, increases by 25% from 1 December. Other premiums do not change.',
      'The business has 8 employees who earn the same monthly salary. In December, 4 of them receive a bonus of 50% of a normal monthly salary.',
    ],
    figs: [{
      title: 'Cash Budget extract: Spares Hub', subtitle: 'November and December 2025', cols: ['', 'Nov (R)', 'Dec (R)'],
      rows: [
        LN('Deposit and instalments: equipment', blank('A'), fmt(inst)),
        LN('Insurance', fmt(insNov), blank('B')),
        LN('Salaries', blank('C'), fmt(salDec)),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the amounts A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], [String(depo), String(insDec), String(salNov)], 'standard_math',
        { fig: 0, unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 5, w: 3, type: 'calc',
          clues: '- The instalments repay 75% of the cost.\n- Only the vehicle premium increases.\n- December salaries include the bonuses.' }),
      fb('Six employees earn the same monthly salary. In December, four of them receive a bonus of 50% of a monthly salary. December salaries total R115 200. Calculate one employee\'s normal monthly salary.',
        ['Monthly salary = R ', '[ ]'], ['14400'], 'standard_math',
        { unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_calculation', skill: SK.calc, diff: 4, w: 2, type: 'calc' }),
      mc('Equipment is bought with a 20% deposit and the balance in 36 equal instalments of R5 000. What is the deposit?',
        'R45 000', ['R36 000', 'R180 000', 'R225 000'],
        { unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      mt('Match each payment to how it is worked out in this scenario.',
        [['Deposit on the equipment', '25% of the full cost'], ['Monthly instalment', 'Balance ÷ 24 months'], ['December bonus', '50% of one salary'], ['New vehicle premium', 'Old premium × 125%']],
        { unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('3.2.2 (iii)', 3, ['36 instalments of R9 800 repay 80% of the cost.'], ['Find the balance, then the deposit as 20/80 of it.'],
        ['R9 800 × 36 = R352 800 × 20/80 = R88 200 (or R441 000 × 20%).']),
      ex('3.2.2 (iv)', 3, ['Only the R4 500 premium on the computers increases, by 28%.'], ['Add the increase to November\'s insurance.'],
        ['R17 500 + (R4 500 × 28%) R1 260 = R18 760.']),
      ex('3.2.2 (v)', 3, ['December salaries include a 70% bonus for 5 of the 9 employees, i.e. 12,5 salaries.'], ['Find one salary, then multiply by 9.'],
        ['R143 750 ÷ 12,5 = R11 500 × 9 = R103 500 (or R143 750 − R40 250).']),
    ],
  },

  // ── L15 ── 3.2.3 sales policy and expense control ───────────────────────────
  {
    order: 15, name: 'Question 3.2.3: Sales policy and control over expenses', marks: 10, qp: '8,10', mp: '9', qpages: 2, mpages: 1,
    covers: 'Question 3.2.3 — the change in the cash/credit sales policy, why higher actual credit sales need not concern the owner, and control over delivery and packing costs.',
    tags: ['sales_policy', 'budget_variance', 'cost_control_interpretation'],
    figs: [{
      title: 'Budget and actual: Gear Stop', subtitle: 'September and October 2025', cols: ['', 'Sep budget', 'Oct budget', 'Oct actual'],
      rows: [
        LN('Number of customers', '480', fmt(ob.cust), fmt(oa.cust)),
        LN('Sales', fmt(sep.sales), fmt(ob.sales), fmt(oa.sales)),
        LN('Cash sales', fmt(sep.cash), fmt(ob.cash), fmt(oa.cash)),
        LN('Credit sales', fmt(sep.credit), fmt(ob.credit), fmt(oa.credit)),
        LN('Gross profit', fmt(40000), fmt(ob.gp), fmt(oa.gp)),
        LN('Delivery expenses', fmt(14400), fmt(ob.del), fmt(oa.del)),
        LN('Packing materials', fmt(7200), fmt(ob.pack), fmt(oa.pack)),
      ],
    }],
    qs: [
      mc('Use the figure. What change did the owner make to the sales policy when budgeting for October?',
        'Cash sales rose from 40% to 60% of total sales', ['Credit sales rose from 40% to 60% of total sales', 'Cash sales fell from 60% to 40% of total sales', 'Credit sales stayed at 60% of total sales'],
        { fig: 0, unit: U, topic: 'budget_variance_interpretation', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
      ms('Use the figure. Actual credit sales in October were far above budget. Select the TWO reasons, with figures, why the owner should NOT be concerned.',
        ['Customers rose from 500 to 700 (by 40%)', 'Gross profit rose from R50 000 to R70 000'],
        ['Credit sales were R87 000 above budget', 'Cash sales were R27 000 below budget', 'October sales beat September\'s budget'],
        { fig: 0, unit: U, topic: 'budget_variance_interpretation', subtopic: 'acc_interpretation', skill: SK.int, diff: 4, w: 2, type: 'interpretation' }),
      fb('Use the figure. Calculate the percentage by which actual packing materials in October exceeded the budgeted amount.',
        ['Over budget by ', '[ ]', ' %'], ['110'], 'standard_math',
        { fig: 0, unit: U, topic: 'budget_variance_interpretation', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      mc('Use the figure. Which statement best describes the control over these two expenses in October?',
        'Delivery stayed at 12% of sales; packing rose from 6% to 9%', ['Packing stayed at 6% of sales; delivery rose from 12% to 15%', 'Both expenses rose faster than sales and were poorly controlled', 'Both expenses stayed at their budgeted percentage of sales'],
        { fig: 0, unit: U, topic: 'budget_variance_interpretation', subtopic: 'acc_interpretation', skill: SK.int, diff: 4, w: 2, type: 'interpretation' }),
    ],
    subs: [ex('3.2.3', 10,
      ['Compare October\'s budget with September\'s to see the policy change, and October\'s actual with its budget for control.', 'Expenses must be judged against the change in sales, not against September.'],
      ['Express cash and credit sales as percentages of total sales.', 'Compare the growth in customers, sales and gross profit with budget.', 'Express each expense as a percentage of sales, budget and actual.'],
      ['Policy: cash sales changed from 40% to 60% (R58 000 to R96 000); credit sales from 60% to 40%.',
        'Not concerned: customers rose from 540 to 729 (35%); gross profit from R60 000 to R82 875 (38,1%); sales from R160 000 to R221 000.',
        'Delivery: 15% of sales in budget and actual, well controlled. Packing: budget 9% of sales but actual 12%; overspent by R12 120 (84,2%) while sales rose only 38,1%.'])],
  },
];
