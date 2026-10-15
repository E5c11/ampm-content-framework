'use strict';
// Accounting 2025 Nov P2 — Question 4 (Budgeting and Problem-solving) lessons 13–17. Fresh numbers; every figure computed and asserted.
const assert = require('assert');
const { mc, ms, mt, ord, fb, ex, fmt, blank } = require('./lib');

const LN = (t, ...c) => ({ k: 'line', c: [t, ...c] });
const H = (t) => ({ k: 'head', c: [t], i: 0 });
const TOT = (t, ...c) => ({ k: 'total', c: [t, ...c] });

const U = 'budgeting';
const SK = { stmt: 'complete_financial_statement', calc: 'calculate_accounting_amount', term: 'recall_accounting_term', cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario', int: 'interpret_financial_indicators' };

// L13: debtors' collection schedule (March receipts)
const cs = { jan: 800000 * 0.7, feb: 840000 * 0.7, mar: 880000 * 0.7 };
const rJan = cs.jan * 0.10, rFeb = cs.feb * 0.45, rMar = cs.mar * 0.40 * 0.95;
assert.strictEqual(cs.jan, 560000); assert.strictEqual(cs.feb, 588000); assert.strictEqual(cs.mar, 616000);
assert.strictEqual(rJan, 56000); assert.strictEqual(rFeb, 264600); assert.ok(Math.abs(rMar - 234080) < 1e-6);
assert.ok(Math.abs(rJan + rFeb + rMar - 554680) < 1e-6);
assert.strictEqual(950000 * 0.7, 665000); assert.strictEqual(100000 * 0.4 * 0.95, 38000); assert.strictEqual(cs.jan * 0.05, 28000);
// L14: projected statement of comprehensive income
const mgrJan = 32000 / 20 * 15, asstDec = 66000 * 100 / 110 * 1.5, advDec = 1450000 * (135000 / 1500000);
assert.strictEqual(mgrJan, 24000); assert.strictEqual(asstDec, 90000); assert.ok(Math.abs(advDec - 130500) < 1e-6);
assert.strictEqual(900000 * 0.06, 54000);
// L15: cash purchases, creditors, fixed deposit
const cosJan = 1920000 / 1.6, cashPur = cosJan * 0.25, cosNov = 1760000 / 1.6, payCred = cosNov * 0.75, deposit = 7200 * 4 / 0.09;
assert.strictEqual(cosJan, 1200000); assert.strictEqual(cashPur, 300000); assert.strictEqual(cosNov, 1100000); assert.strictEqual(payCred, 825000); assert.ok(Math.abs(deposit - 320000) < 1e-6);
assert.strictEqual(1360000 / 1.6, 850000); assert.ok(Math.abs(3000 * 4 / 0.12 - 100000) < 1e-6);
// L16: budget variance
const lost = (110 - 52) * 2900;
assert.strictEqual(lost, 168200); assert.strictEqual((2900 - 2000) / 2000 * 100, 45);
// L17: remuneration
const sepTot = 36000 + 4400, octTot = 24000 + 4000;
assert.strictEqual(sepTot - octTot, 12400); assert.strictEqual(36000 / 3, 12000);

const budget = (title, rows) => ({ title, subtitle: 'September and October 2026', cols: ['', 'Budget', 'Actual'], rows });
const bRows = [
  LN('Sept: units sold', '80', '110'),
  LN('Oct: units sold', '80', '52'),
  LN('Sept: selling price', 'R2 000', 'R2 000'),
  LN('Oct: selling price', 'R2 000', 'R2 900'),
  LN('Sept: payments to creditors', 'R250 000', 'R240 000'),
  LN('Oct: payments to creditors', 'R240 000', 'R48 000'),
  LN('Sept: salaries', 'R36 000', 'R36 000'),
  LN('Oct: salaries', 'R24 000', 'R24 000'),
  LN('Sept: commission', 'R0', 'R4 400'),
  LN('Oct: commission', 'R4 000', 'R4 000'),
];

module.exports = [
  // ── L13 ── 4.1.1 debtors' collection schedule ───────────────────────────────
  {
    order: 13, name: 'Question 4.1.1: Debtors\' collection schedule', marks: 6, qpages: 2, mpages: 1,
    covers: 'Question 4.1.1 — receipts from debtors in a month from credit sales of the current and previous two months.',
    tags: ['debtors_collection_schedule', 'budgeted_receipts'],
    info: [
      'Total sales: January R800 000, February R840 000, March R880 000. Credit sales are 70% of total sales.',
      'Debtors pay 40% in the month of sale (subject to a 5% discount), 45% in the next month and 10% two months after the sale. The rest is written off as irrecoverable.',
    ],
    figs: [{
      title: 'Debtors\' collection schedule: Ntuli Traders', subtitle: 'receipts in March 2027', cols: ['Month of credit sales', 'Credit sales', 'Receipts'],
      rows: [
        LN('January', fmt(cs.jan), blank('A')),
        LN('February', fmt(cs.feb), blank('B')),
        LN('March', fmt(cs.mar), blank('C')),
        TOT('Receipts from debtors', '', fmt(554680)),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing receipts A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], [String(rJan), String(rFeb), String(rMar)], 'standard_math',
        { fig: 0, unit: U, topic: 'debtors_collection_schedule', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Each month of sales is collected over three months.\n- The discount applies only to the payment in the month of sale.' }),
      fb('Total sales are R950 000 and 70% of them are credit sales. Calculate the credit sales.',
        ['Credit sales = R ', '[ ]'], ['665000'], 'standard_math',
        { unit: U, topic: 'debtors_collection_schedule', subtopic: 'acc_calculation', skill: SK.calc, diff: 1, w: 1, type: 'calc' }),
      mc('Credit sales of R100 000 are paid 40% in the month of sale with a 5% discount. How much cash is received in that month?',
        'R38 000', ['R40 000', 'R35 000', 'R42 000'],
        { unit: U, topic: 'debtors_collection_schedule', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      ms('Select the TWO correct statements about the schedule.',
        ['The discount applies only to the payment in the month of sale', 'The unpaid remainder is written off as bad debts'],
        ['The discount applies to every payment from debtors', 'Bad debts equal 10% of the credit sales', 'Cash sales are included in the schedule'],
        { unit: U, topic: 'debtors_collection_schedule', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [ex('4.1.1', 6, ['Credit sales are 75% of sales and are collected over three months.', 'Only the first payment earns the discount.'],
      ['Work out credit sales for each month.', 'Multiply each month by the right percentage for the receipts column.'],
      ['Credit sales: December R1 496 250 and January R1 522 500; receipts in January come from November (R202 125), December (R748 125) and January (R438 480 after the discount).', 'Receipts from debtors in January = R1 388 730.'])],
  },

  // ── L14 ── 4.1.2 projected statement of comprehensive income ────────────────
  {
    order: 14, name: 'Question 4.1.2: Projected statement of comprehensive income', marks: 13, qpages: 2, mpages: 1,
    covers: 'Question 4.1.2 — working out bad debts, a salary reduced by unpaid leave, a salary with a bonus and an increase, and advertising as a percentage of sales.',
    tags: ['projected_income_statement', 'budgeted_expenses'],
    info: [
      'The sales manager is paid for 20 days a month at a fixed daily rate. She takes 5 days of unpaid leave in January.',
      'The assistants receive a 50% bonus in December and their annual increase of 10% on 1 January. January salaries are R66 000.',
      'Advertising is budgeted at a fixed percentage of monthly sales.',
    ],
    figs: [{
      title: 'Projected income statement (extract): Mkhize Traders', subtitle: 'December 2026 and January 2027', cols: ['', 'Dec 2026', 'Jan 2027'],
      rows: [
        LN('Sales', fmt(1450000), fmt(1500000)),
        LN('Salary: sales manager', fmt(32000), blank('C')),
        LN('Salaries: assistants', blank('A'), fmt(66000)),
        LN('Advertising', blank('B'), fmt(135000)),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], [String(asstDec), String(advDec), String(mgrJan)], 'standard_math',
        { fig: 0, unit: U, topic: 'projected_income_statement', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 5, w: 3, type: 'calc',
          clues: '- Take the increase out of January\'s salary before adding the bonus.\n- Advertising is the same percentage of sales every month.' }),
      fb('6% of the credit sales of R900 000 is written off as irrecoverable. Calculate the bad debts.',
        ['Bad debts = R ', '[ ]'], ['54000'], 'standard_math',
        { unit: U, topic: 'projected_income_statement', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      mc('An employee takes unpaid leave. How does this affect the salary budget for that month?',
        'Salary is reduced for the days not worked', ['The salary stays exactly the same as usual', 'The salary is paid twice in that month', 'The days are paid at a higher daily rate'],
        { unit: U, topic: 'projected_income_statement', subtopic: 'acc_scenario_application', skill: SK.app, diff: 2, w: 1, type: 'application' }),
      ms('Select ALL the items that appear as expenses in a projected statement of comprehensive income.',
        ['Bad debts', 'Advertising', 'Salaries'],
        ['Cash purchases of stock', 'Payments to creditors'],
        { unit: U, topic: 'projected_income_statement', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [ex('4.1.2', 13, ['Each item has its own rule: percentage of credit sales, days of unpaid leave, bonus and increase, percentage of sales.', 'Work from the given month to the missing month.'],
      ['Bad debts: the unpaid share of credit sales.', 'Salary: scale by days worked; assistants: remove the increase, then add the bonus; advertising: use the percentage of sales.'],
      ['(i) Bad debts = R1 417 500 × 6% = R85 050; (ii) sales manager = R29 000 ÷ 20 × 4 = R23 200 (memo adjustment for the leave).', '(iii) Assistants in December = R80 000 + R48 000 = R128 000; (iv) advertising = R1 995 000 × 9% = R179 550.'])],
  },

  // ── L15 ── 4.1.3–4.1.4 purchases, payments and fixed deposit ────────────────
  {
    order: 15, name: 'Question 4.1.3–4.1.4: Purchases, payments to creditors and fixed deposit', marks: 9, qpages: 2, mpages: 2,
    covers: 'Questions 4.1.3 and 4.1.4 — cash purchases of trading stock, payments to creditors and the fixed deposit that matures.',
    tags: ['cash_purchases_budget', 'fixed_deposit_maturity'],
    info: [
      'Sales: November R1 760 000 and January R1 920 000. The mark-up is 60% on cost.',
      'Stock is replaced in the month of sales. 25% of the stock is bought for cash. Creditors are paid in full in the second month after the purchase.',
      'A fixed deposit matures on 31 January. It earns interest at 9% p.a., receivable quarterly, and January\'s quarterly interest is R7 200. Interest is not capitalised.',
    ],
    figs: [{
      title: 'Budget amounts: Ntuli Traders', subtitle: 'January 2027', cols: ['', 'R'],
      rows: [
        LN('Cash purchases of trading stock', blank('A')),
        LN('Payments to creditors', blank('B')),
        LN('Fixed deposit maturing', blank('C')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], [String(cashPur), String(payCred), String(deposit)], 'standard_math',
        { fig: 0, unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 5, w: 3, type: 'calc',
          clues: '- Cost of sales = sales ÷ 1,6.\n- January payments are for stock bought two months earlier.' }),
      fb('Sales are R1 360 000 and the mark-up is 60% on cost. Calculate the cost of sales.',
        ['Cost of sales = R ', '[ ]'], ['850000'], 'standard_math',
        { unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      mc('Creditors are paid in the second month after purchase. Which purchases do the January payments relate to?',
        'The credit purchases made in November', ['The cash purchases made in January', 'The credit purchases made in December', 'The credit purchases made in January'],
        { unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      ms('Select the TWO correct statements about the budget.',
        ['Cash purchases are paid in the month of purchase', 'Payments to creditors exclude cash purchases'],
        ['Cash purchases are included in payments to creditors', 'Creditors are paid in the month of purchase', 'All purchases are made for cash'],
        { unit: U, topic: 'cash_budget_calculations', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('4.1.3', 5, ['Sales include a 60% mark-up on cost.', 'Cash and credit purchases are treated separately.'],
        ['Find the cost of sales, then split it into cash and credit.'], ['Cash purchases in January = R2 030 000 × 20/160 = R253 750.', 'Payments to creditors in January = R1 203 125 × 80% = R962 500.']),
      ex('4.1.4', 4, ['The interest is quarterly and the rate is per year.', 'Interest is not added to the deposit.'],
        ['Annualise the quarterly interest, then divide by the rate.'], ['R5 440 × 12/3 × 100/8 = R272 000.']),
    ],
  },

  // ── L16 ── 4.2.1–4.2.2 budget comparison and lost sales ─────────────────────
  {
    order: 16, name: 'Question 4.2.1–4.2.2: Comparing budgets and lost sales', marks: 6, qpages: 2, mpages: 1,
    covers: 'Questions 4.2.1 and 4.2.2 — why budgeted and actual figures are compared, a reason for lower sales with figures, and cash lost.',
    tags: ['budget_variance', 'lost_sales_calculation'],
    info: [
      'Kwezi Traders sells water tanks. Its only competitor closed in September.',
      'The business budgets to sell 80 tanks per month.',
    ],
    figs: [budget('Budget and actual: Kwezi Traders', bRows)].map((f) => ({ ...f, rows: [...bRows, LN('Cash lost in October sales (R)', '', blank('A')), LN('Price increase in October (%)', '', blank('B'))] })),
    qs: [
      fb('Use the information in the figure to calculate A (the cash lost in October sales compared with September) and B (the percentage increase in the actual selling price).',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(lost), '45'], 'standard_math',
        { fig: 0, unit: U, topic: 'budget_variance_interpretation', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Lost sales are the fewer units multiplied by the October price.' }),
      mc('Why is it important to compare budgeted figures with actual figures?',
        'To find variances and improve future budgets', ['To prove that the owner is always right', 'To increase the number of staff needed', 'To avoid having to record transactions'],
        { unit: U, topic: 'budget_variance_interpretation', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 1, type: 'definition' }),
      ms('Select the TWO statements that explain the fall in the number of units sold in October.',
        ['The actual selling price rose from R2 000 to R2 900', 'Units sold fell from 110 to 52 as the price rose'],
        ['The competitor opened a second shop', 'The budgeted salaries were lower in October', 'Payments to creditors were higher in October'],
        { fig: 0, unit: U, topic: 'budget_variance_interpretation', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
      fb('Calculate the percentage increase in the selling price from R2 000 to R2 900 (without the % sign).',
        ['Increase = ', '[ ]', ' %'], ['45'], 'standard_math',
        { unit: U, topic: 'budget_variance_interpretation', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 1, type: 'calc' }),
    ],
    subs: [
      ex('4.2.1', 2, ['A budget is a plan; actual figures show what really happened.'], ['Give one valid reason for comparing the two.'], ['It shows whether the budget was realistic and helps to create better budgets in future.']),
      ex('4.2.2', 4, ['Look at the selling price and the units sold.', 'Cash lost uses the fall in units and the October price.'],
        ['Quote the price increase as the reason for the fall in sales.', 'Multiply the units lost by the October price.'], ['The selling price increased from R1 600 to R2 480 (by R880).', 'Cash lost = (124 − 61) × R2 480 = R156 240.']),
    ],
  },

  // ── L17 ── 4.2.3–4.2.4 supplier benefits and remuneration ───────────────────
  {
    order: 17, name: 'Question 4.2.3–4.2.4: Supplier benefits and remuneration', marks: 6, qpages: 2, mpages: 1,
    covers: 'Questions 4.2.3 and 4.2.4 — benefits lost by not paying suppliers, and why commission was introduced and why employees will be dissatisfied.',
    tags: ['supplier_payment_benefits', 'employee_remuneration'],
    info: [
      'Creditors are paid one month after purchase, subject to a 4% discount. The business has three employees.',
      'From October the owner introduced commission on sales and a reduced monthly salary.',
    ],
    figs: [{ ...budget('Budget and actual: Kwezi Traders', bRows), rows: [...bRows, LN('Fall in total earnings (R)', '', blank('A'))] }],
    qs: [
      ms('The business paid only R48 000 of the R240 000 budgeted for creditors in October. Select the TWO benefits it loses.',
        ['The early-payment discount', 'A good credit rating with suppliers'],
        ['The right to sell at a higher price', 'Discounts from its own customers', 'The need to keep a cash budget'],
        { fig: 0, unit: U, topic: 'budget_variance_interpretation', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
      mc('Which figures best explain why the owner introduced commission in September?',
        'Units sold rose from the budget of 80 to 110', ['Salaries stayed at R36 000 in September', 'Payments to creditors were below the budget', 'The selling price stayed at R2 000 a tank'],
        { fig: 0, unit: U, topic: 'budget_variance_interpretation', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
      fb('In September, total salaries and commission were R36 000 + R4 400. In October they were R24 000 + R4 000. Calculate A, the fall in total earnings.',
        ['A = ', '[ ]'], [String(sepTot - octTot)], 'standard_math',
        { fig: 0, unit: U, topic: 'budget_variance_interpretation', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 3, w: 2, type: 'calc' }),
      ms('Select the TWO reasons the employees will not be satisfied with the revised remuneration.',
        ['Total pay fell from R40 400 to R28 000', 'Each employee earns about R4 133 less'],
        ['Commission rose from R0 to R4 000 a month', 'The business now has fewer employees', 'Units sold fell from 110 to 52 in October'],
        { fig: 0, unit: U, topic: 'budget_variance_interpretation', subtopic: 'acc_interpretation', skill: SK.int, diff: 4, w: 3, type: 'interpretation' }),
    ],
    subs: [
      ex('4.2.3', 2, ['Think about what suppliers give for paying on time.'], ['Name two benefits that are lost.'], ['The business forfeits the early repayment discount and its credit rating or credit limit with suppliers is affected.']),
      ex('4.2.4', 4, ['Compare September with October for sales, salaries and commission.', 'Use figures in each answer.'],
        ['Say why commission suited September, then why October pay is lower.'], ['Units sold increased from 90 to 124 in September, so commission rewarded the extra sales.', 'October earnings of R31 500 are less than September salaries of R38 400, so employees will be dissatisfied.']),
    ],
  },
];
