'use strict';
// Accounting 2025 Nov P1 — Question 2 (Cash Flow Statement and Financial Indicators) lessons 7–12.
const assert = require('assert');
const { mc, ms, mt, ord, fb, ex, fmt, blank } = require('./lib');

const H = (t, i = 0) => ({ k: 'head', c: [t], i });
const LN = (t, a, i = 1) => ({ k: 'line', c: [t, a], i });
const SUBT = (t, a, i = 0) => ({ k: 'sub', c: [t, a], i });
const TOT = (t, a, i = 0) => ({ k: 'total', c: [t, a], i });
const GAP = { k: 'gap' };

const U_CF = 'cash_flow_statement', U_FI = 'financial_indicators';
const SK = {
  stmt: 'complete_financial_statement', calc: 'calculate_accounting_amount', term: 'recall_accounting_term',
  cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario', int: 'interpret_financial_indicators',
};

// L7: working-capital changes
assert.strictEqual(1250000 + 140000 + 96000, 1486000);
const dChg = 560000 - 840000, pChg = (410000 + 22000) - (355000 + 0);
assert.strictEqual(dChg, -280000); assert.strictEqual(pChg, 77000);
const pChg2 = (345000 + 18000) - (280000 + 0); assert.strictEqual(pChg2, 83000);
// L8: tax paid, dividends paid
const taxPaid = -8000 + 120000 - 14000, divPaid = 81000 + 120000, taxPaid2 = 10000 + 150000 + 6000;
assert.strictEqual(taxPaid, 98000); assert.strictEqual(divPaid, 201000); assert.strictEqual(taxPaid2, 166000);
// L9: investing
const veh = 1800000 - 1500000, depSale = 80000 * 0.12 * 5 / 12, cvSale = 31000 - depSale;
assert.strictEqual(veh, 300000); assert.strictEqual(depSale, 4000); assert.strictEqual(cvSale, 27000);
// L10: financing
const repo = 3000 * (8 * 1.25), loanChg = 1640000 - 1900000, closeCash = 95000 - 312000;
assert.strictEqual(repo, 30000); assert.strictEqual(loanChg, -260000); assert.strictEqual(closeCash, -217000);
// L11: indicators
const nav = 6480000 * 100 / 540000, acid = (1530000 + 30000) / 1200000;
assert.strictEqual(nav, 1200); assert.strictEqual(acid, 1.3);
// L12: pay-out
const payout = (60000 + 150000) / 600000 * 100, dps = 210000 / 300000 * 100;
assert.strictEqual(payout, 35); assert.strictEqual(dps, 70);

module.exports = [
  // ── L07 ── 2.1 change in receivables / payables ─────────────────────────────
  {
    order: 7, name: 'Question 2.1: Change in receivables and payables', marks: 7, qpages: 3, mpages: 2,
    info: ['Debtors\' control: R840 000 (2026) and R560 000 (2025).', 'Creditors\' control: R410 000 and R355 000.', 'Accrued expenses: R22 000 and nil.', 'Shareholders for dividends: R90 000 and R81 000.', 'Show an outflow of cash as a negative number.'],
    covers: 'Question 2.1 — the changes in receivables and payables in the Reconciliation of Profit before Taxation and Cash Generated from Operations note, with inflow or outflow.',
    tags: ['cash_generated_from_operations', 'change_in_receivables', 'change_in_payables'],
    figs: [{
      title: 'Cash generated from operations (extract): Pike Ltd', subtitle: 'for the year ended 28 February 2026', cols: ['', 'R'],
      rows: [
        LN('Net profit before tax', fmt(1250000), 0),
        LN('Depreciation', fmt(140000), 0),
        LN('Interest expense', fmt(96000), 0),
        SUBT('Operating profit before working capital changes', fmt(1486000)),
        LN('Change in inventories', fmt(-60000), 0),
        LN('Change in receivables', blank('A'), 0),
        LN('Change in payables', blank('B'), 0),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A and B in the statement.',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(dChg), String(pChg)], 'standard_math',
        { fig: 0, unit: U_CF, topic: 'cash_generated_from_operations', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Compare this year\'s balances with last year\'s.\n- Payables here are creditors and accrued expenses only.' }),
      mc('The debtors\' balance increased by R90 000 during the year. What is the effect on cash generated from operations?',
        'A cash outflow, because more was owed than was collected', ['A cash inflow, because sales increased during the year', 'No effect, because debtors are not a cash item', 'A cash inflow, because more credit was given to customers'],
        { unit: U_CF, topic: 'cash_generated_from_operations', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the items included in the change in trade and other payables for the cash flow note.',
        ['Creditors\' control', 'Accrued expenses'],
        ['Shareholders for dividends', 'SARS: income tax', 'Mortgage loan'],
        { unit: U_CF, topic: 'cash_generated_from_operations', subtopic: 'acc_classification', skill: SK.cls, diff: 4, w: 2, type: 'application' }),
      fb('Creditors\' control was R345 000 (2026) and R280 000 (2025). Accrued expenses were R18 000 and nil. Shareholders for dividends were R60 000 and R50 000. Calculate the change in payables (an inflow is positive).',
        ['Change in payables = R ', '[ ]'], [String(pChg2)], 'standard_math',
        { unit: U_CF, topic: 'cash_generated_from_operations', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
    ],
    subs: [
      ex('2.1', 7,
        ['Receivables and payables are compared year on year, and the note asks for inflow or outflow.', 'Taxation and dividends are dealt with elsewhere in the cash flow statement.'],
        ['Subtract the opening balance from the closing balance of each item.', 'Decide whether cash came in or went out: an increase in receivables is an outflow, an increase in payables an inflow.'],
        ['Receivables: R3 167 000 – R1 303 500 = R1 863 500, an outflow because more is owed to the company.',
          'Payables: (R1 450 000 + R14 600) – R1 323 500 = R141 100, an inflow because more is owed to creditors.']),
    ],
  },

  // ── L08 ── 2.2 CFS operating activities ─────────────────────────────────────
  {
    order: 8, name: 'Question 2.2: Cash flow statement — operating activities', marks: 8, qpages: 3, mpages: 2,
    info: ['The tax expense was R120 000.', 'SARS: income tax was a receivable of R8 000 at the beginning and a payable of R14 000 at the end.', 'An interim dividend of R120 000 was paid.', 'Shareholders for dividends: R81 000 at the beginning and R90 000 at the end.', 'Show an outflow of cash as a negative number.'],
    covers: 'Question 2.2 (operating) — taxation paid and dividends paid in the Cash Flow Statement.',
    tags: ['company_cash_flow_statement', 'taxation_paid', 'dividends_paid'],
    figs: [{
      title: 'Cash Flow Statement (extract): Pike Ltd', subtitle: 'OPERATING ACTIVITIES for the year ended 28 February 2026', cols: ['', 'R'],
      rows: [
        H('Cash flow from operating activities'),
        LN('Cash generated from operations', fmt(1410000)),
        LN('Interest paid', fmt(-96000)),
        LN('Taxation paid', blank('A')),
        LN('Dividends paid', blank('B')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A and B in the statement.',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(-taxPaid), String(-divPaid)], 'standard_math',
        { fig: 0, unit: U_CF, topic: 'cash_flow_operating_activities', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Last year\'s final dividend is paid this year.\n- A receivable and a payable at SARS work in opposite directions.' }),
      fb('The tax expense was R150 000. SARS: income tax was a payable of R10 000 at the beginning and a receivable of R6 000 at the end. Calculate the taxation paid (enter an outflow as a negative number).',
        ['Taxation paid = R ', '[ ]'], [String(-taxPaid2)], 'standard_math',
        { unit: U_CF, topic: 'cash_flow_operating_activities', subtopic: 'acc_calculation', skill: SK.calc, diff: 4, w: 2, type: 'calc' }),
      mc('Under which heading of the Cash Flow Statement are dividends paid shown?',
        'Cash flow from operating activities', ['Cash flow from investing activities', 'Cash flow from financing activities', 'Net change in cash and cash equivalents'],
        { unit: U_CF, topic: 'cash_flow_operating_activities', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 1, type: 'definition' }),
      ms('Select ALL the items shown under operating activities.',
        ['Cash generated from operations', 'Interest paid', 'Taxation paid'],
        ['Sale of fixed assets', 'Shares repurchased'],
        { unit: U_CF, topic: 'cash_flow_operating_activities', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
    ],
    subs: [
      ex('2.2', 8,
        ['Taxation paid depends on the tax expense and on the SARS balances at the beginning and end.', 'The dividends paid are given in the information.'],
        ['Work out how much was paid to SARS from the expense and both balances.', 'Show every amount paid as a negative number.'],
        ['Taxation paid = R201 600 – R32 000 – R15 300 = R154 300, shown as (154 300).', 'Dividends paid are R252 000 from the information, shown as (252 000); interest paid is (316 250).']),
    ],
  },

  // ── L09 ── 2.2 CFS investing activities ─────────────────────────────────────
  {
    order: 9, name: 'Question 2.2: Cash flow statement — investing activities', marks: 8, qpages: 3, mpages: 2,
    info: ['Vehicles at cost: R1 800 000 (2026) and R1 500 000 (2025). No vehicles were sold.', 'A machine with a cost of R80 000 and a carrying value of R31 000 on 1 March 2025 was sold for cash at carrying value on 31 July 2025.', 'Equipment is depreciated at 12% p.a. on cost.', 'Show an outflow of cash as a negative number.'],
    covers: 'Question 2.2 (investing) — fixed assets purchased and the sale of a fixed asset at carrying value.',
    tags: ['company_cash_flow_statement', 'fixed_assets_purchased', 'sale_of_fixed_assets'],
    figs: [{
      title: 'Cash Flow Statement (extract): Pike Ltd', subtitle: 'INVESTING ACTIVITIES for the year ended 28 February 2026', cols: ['', 'R'],
      rows: [
        H('Cash flow from investing activities'),
        LN('Fixed assets purchased', blank('A')),
        LN('Sale of fixed assets', blank('B')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A and B in the statement.',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(-veh), String(cvSale)], 'standard_math',
        { fig: 0, unit: U_CF, topic: 'cash_flow_investing_activities', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Depreciate the machine up to the date it was sold.\n- It was sold at its carrying value.' }),
      fb('An asset with a cost of R80 000 is depreciated at 12% p.a. on cost. Calculate the depreciation for the five months before it is sold.',
        ['Depreciation = R ', '[ ]'], [String(depSale)], 'standard_math',
        { unit: U_CF, topic: 'cash_flow_investing_activities', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      mc('Where is the cash received from selling a fixed asset shown?',
        'Cash flow from investing activities', ['Cash flow from operating activities', 'Cash flow from financing activities', 'Cash generated from operations'],
        { unit: U_CF, topic: 'cash_flow_investing_activities', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 1, type: 'definition' }),
      ms('Select ALL the items shown under investing activities.',
        ['Fixed assets purchased', 'Sale of fixed assets', 'Change in a fixed deposit'],
        ['Dividends paid', 'Shares issued'],
        { unit: U_CF, topic: 'cash_flow_investing_activities', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
    ],
    subs: [
      ex('2.2', 8,
        ['A new vehicle was bought during the year and no vehicles were sold.', 'The old fridge was sold for cash at its carrying value.'],
        ['Find the cost of the vehicle bought from the change in the cost balance.', 'Calculate depreciation up to the date of sale, then reduce the carrying value.'],
        ['Fixed asset purchased = R2 900 000 – R2 520 000 = R380 000, shown as an outflow.',
          'Sale of fixed asset: depreciation R55 000 × 15% × 4 ÷ 12 = R2 750, so the carrying value is R16 000 – R2 750 = R13 250 received in cash.']),
    ],
  },

  // ── L10 ── 2.2 CFS financing activities and cash at end ─────────────────────
  {
    order: 10, name: 'Question 2.2: Cash flow statement — financing and closing cash', marks: 7, qpages: 3, mpages: 2,
    info: ['3 000 shares were repurchased at 25% more than the average share price of R8 per share.', 'The loan was R1 900 000 at the beginning and R1 640 000 at the end of the year.', 'Show an outflow of cash as a negative number.'],
    covers: 'Question 2.2 (financing) — shares repurchased, the change in the loan, the net change in cash and the closing cash and cash equivalents.',
    tags: ['company_cash_flow_statement', 'financing_activities', 'cash_and_cash_equivalents'],
    figs: [{
      title: 'Cash Flow Statement (extract): Pike Ltd', subtitle: 'FINANCING ACTIVITIES for the year ended 28 February 2026', cols: ['', 'R'],
      rows: [
        H('Cash flow from financing activities'),
        LN('Sale of shares', fmt(720000)),
        LN('Shares repurchased', blank('A')),
        LN('Change in loan', blank('B')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A and B in the statement.',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(-repo), String(loanChg)], 'standard_math',
        { fig: 0, unit: U_CF, topic: 'cash_flow_financing_activities', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- The price paid is above the average share price.\n- A smaller loan means cash was repaid.' }),
      fb('The net change in cash and cash equivalents was a decrease of R312 000. Cash and cash equivalents at the beginning of the year were R95 000. Calculate the cash and cash equivalents at the end of the year (an overdraft is negative).',
        ['Closing balance = R ', '[ ]'], [String(closeCash)], 'standard_math',
        { unit: U_CF, topic: 'cash_flow_financing_activities', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      mc('At the end of the year the cash and cash equivalents are an unfavourable balance. What does this mean?',
        'The company has a bank overdraft', ['The company has surplus cash in its bank account', 'The company has repaid its mortgage loan in full', 'The company has declared a final dividend'],
        { unit: U_CF, topic: 'cash_flow_financing_activities', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 1, type: 'definition' }),
      ms('Select ALL the items shown under financing activities.',
        ['Shares issued', 'Shares repurchased', 'Loan repaid'],
        ['Interest paid', 'Fixed assets purchased'],
        { unit: U_CF, topic: 'cash_flow_financing_activities', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
    ],
    subs: [
      ex('2.2', 7,
        ['Shares sold bring cash in and shares repurchased take cash out at the price paid.', 'The loan balance changed during the year.'],
        ['Multiply the number of shares by the price for each share transaction.', 'Subtract the opening balance from the closing balance to find the change in the loan, then add the net change to the opening cash.'],
        ['Sale of shares = 50 000 × R20 = R1 000 000; shares repurchased = 2 000 × R15,40 = (R30 800), because R11 + 40% = R15,40.',
          'Change in loan = R2 880 000 – R3 300 000 = (R420 000); net change in cash = (R1 172 000).', 'Closing cash = R415 000 – R1 172 000 = (R757 000), an unfavourable balance.']),
    ],
  },

  // ── L11 ── 2.3 NAV per share and acid-test ratio ────────────────────────────
  {
    order: 11, name: 'Question 2.3: Net asset value per share and acid-test ratio', marks: 8, qpages: 3, mpages: 2,
    covers: 'Question 2.3 — net asset value per share and the acid-test ratio.',
    tags: ['net_asset_value_per_share', 'acid_test_ratio'],
    qs: [
      fb('Shareholders\' equity is R6 480 000 and there are 540 000 shares in issue. Calculate the net asset value (NAV) per share.',
        ['NAV per share = ', '[ ]', ' cents'], [String(nav)], 'standard_math',
        { unit: U_FI, topic: 'financial_indicator_calculations', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 3, type: 'calc',
          clues: '- Convert the answer from rand to cents.' }),
      fb('Trade and other receivables are R1 530 000, cash and cash equivalents R30 000, and current liabilities R1 200 000. Calculate the acid-test ratio, as the first number of x : 1 to ONE decimal place.',
        ['Acid-test ratio = ', '[ ]', ' : 1'], [String(acid)], 'standard_math',
        { unit: U_FI, topic: 'financial_indicator_calculations', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 3, type: 'calc' }),
      mc('Why are inventories left out of the acid-test ratio?',
        'They cannot be turned into cash as quickly as debtors', ['They are not owned by the company at year-end', 'They are shown as a non-current asset', 'They are always sold below their cost price'],
        { unit: U_FI, topic: 'financial_indicator_calculations', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 1, type: 'definition' }),
      ms('Select ALL the items in the numerator of the acid-test ratio.',
        ['Trade and other receivables', 'Cash and cash equivalents'],
        ['Inventories held for resale', 'Current liabilities of the company', 'Fixed assets at carrying value'],
        { unit: U_FI, topic: 'financial_indicator_calculations', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
    ],
    subs: [
      ex('2.3', 8,
        ['The formula sheet gives both formulae.', 'Net asset value per share is shown in cents.'],
        ['Divide shareholders\' equity by the number of shares and multiply by 100.', 'For the acid-test ratio, add receivables and cash, then divide by current liabilities.'],
        ['NAV per share = R7 140 120 ÷ 498 000 × 100 = 1 433,8 cents.',
          'Acid-test ratio = (R3 167 000 + R18 000) : (R1 609 380 + R775 000) = R3 185 000 : R2 384 380 = 1,3 : 1.']),
    ],
  },

  // ── L12 ── 2.3 dividend pay-out rate and 2.4 cash resources ─────────────────
  {
    order: 12, name: 'Question 2.3–2.4: Dividend pay-out rate and cash resources', marks: 7, qpages: 3, mpages: 2,
    covers: 'Questions 2.3 and 2.4 — the dividend pay-out rate and a reason, with figures, for concern about cash resources.',
    tags: ['dividend_payout_rate', 'cash_resources_interpretation'],
    qs: [
      fb('Interim dividends were R60 000 and the final dividend was R150 000. The net profit after tax was R600 000. Calculate the dividend pay-out rate as a percentage.',
        ['Pay-out rate = ', '[ ]', ' %'], [String(payout)], 'standard_math',
        { unit: U_FI, topic: 'financial_indicator_calculations', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 3, type: 'calc',
          clues: '- Use ALL the dividends for the year.' }),
      fb('Dividends for the year were R210 000 and there were 300 000 shares in issue. Calculate the dividends per share.',
        ['Dividends per share = ', '[ ]', ' cents'], [String(dps)], 'standard_math',
        { unit: U_FI, topic: 'financial_indicator_calculations', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      mc('Cash and cash equivalents were a favourable R210 000 last year. Which statement gives a valid reason, with figures, for concern about cash resources this year?',
        'Cash fell from a favourable R210 000 to an overdraft of R145 000', ['Sales increased by R355 000 compared with the previous financial year', 'Dividends paid were lower than the profit earned during the year', 'Fixed assets were bought for cash instead of being financed by a loan'],
        { unit: U_FI, topic: 'interpretation_of_cash_resources', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
      ms('A company\'s dividend pay-out rate rose from 49% to 125%. Select ALL the correct conclusions.',
        ['It paid out more than it earned during the year', 'No profit was retained for expansion', 'Reserves from earlier years were used'],
        ['It retained more profit than before', 'Shareholders received less than the year before'],
        { unit: U_FI, topic: 'interpretation_of_cash_resources', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
    ],
    subs: [
      ex('2.3', 5,
        ['The pay-out rate compares all dividends for the year with the profit after tax.', 'Interim and final dividends both count.'],
        ['Add the interim dividends and the final dividends.', 'Divide by the net profit after tax and multiply by 100.'],
        ['Dividends for the year = R90 000 + R129 480 = R219 480.', 'Dividend pay-out rate = R219 480 ÷ R518 400 × 100 = 42,3%.']),
      ex('2.4', 2,
        ['Look at the cash and cash equivalents at the beginning and end of the year.', 'The reason must contain figures.'],
        ['Compare the opening and closing balances from the cash flow statement.', 'Say what the movement shows about the cash from operations.'],
        ['Cash and cash equivalents changed from a favourable R415 000 to an unfavourable R757 000.', 'The net cash outflow of R1 172 000 shows that the operations did not generate enough cash for the needs of the company.']),
    ],
  },
];
