'use strict';
// Accounting 2025 Nov P1 — Question 1 lessons 1 and 3–6 (lesson 2 is the pilot in lessons-a.js).
const assert = require('assert');
const { mc, ms, mt, ord, fb, ex, fmt, blank } = require('./lib');

const H = (t, i = 0) => ({ k: 'head', c: [t], i });
const LN = (t, a, i = 1) => ({ k: 'line', c: [t, a], i });
const SUBT = (t, a, i = 0) => ({ k: 'sub', c: [t, a], i });
const TOT = (t, a, i = 0) => ({ k: 'total', c: [t, a], i });
const GAP = { k: 'gap' };

const U = 'company_financial_statements';
const SK = {
  stmt: 'complete_financial_statement', calc: 'calculate_accounting_amount', term: 'recall_accounting_term',
  cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario',
};

// ── L1 numbers (weighted-average closing stock) ──
const w = { oU: 400, oC: 78000, pU: 3600, pC: 780000, rU: 200, rC: 41000, close: 700, fifo: 158000 };
const wUnits = w.oU + w.pU - w.rU, wCost = w.oC + w.pC - w.rC, wUnit = wCost / wUnits;
assert.strictEqual(wUnit, 215); assert.strictEqual(wUnit * w.close, 150500);
// ── L3 numbers ──
const d = { fa: 2640000, cur: 150000, share: 25, inv: 612000, rec: 438000, cash: 95000 };
const ncFD = d.cur / d.share * (100 - d.share), curTot = d.inv + d.rec + d.cur + d.cash;
assert.strictEqual(ncFD, 450000); assert.strictEqual(curTot, 1295000);
// ── L4 numbers ──
const r = { dc: 520000, over: 6000, provPct: 5, accrued: 4200, sars: 18000, stock: 1130000, dmg: 8200, cash: 95000 };
const debAfter = r.dc + r.over, prov = debAfter * r.provPct / 100, recv = debAfter - prov + r.accrued + r.sars, invCorr = r.stock - r.dmg;
assert.strictEqual(prov, 26300); assert.strictEqual(recv, 521900); assert.strictEqual(invCorr, 1121800);
const caTot = invCorr + recv + r.cash; assert.strictEqual(caTot, 1738700);
// ── L5 numbers ──
const e = { npat: 3360000, roshe: 28, open: 10500000, osc: 9000000 };
const avgShe = e.npat * 100 / e.roshe, closeShe = avgShe * 2 - e.open, ri = closeShe - e.osc;
assert.strictEqual(closeShe, 13500000); assert.strictEqual(ri, 4500000);
// ── L6 numbers ──
const l = { bal: 2400000, monthly: 30000, nextInt: 180000 };
const curLoan = l.monthly * 12 - l.nextInt, ncLoan = l.bal - curLoan;
assert.strictEqual(curLoan, 180000); assert.strictEqual(ncLoan, 2220000);

module.exports = [
  // ── L01 ── 1.1 closing stock under weighted average ─────────────────────────
  {
    order: 1, name: 'Question 1.1: Closing stock at weighted average cost', marks: 6, qpages: 3, mpages: 2,
    covers: 'Question 1.1 — correcting the closing stock from FIFO to the weighted-average method using opening stock, purchases and returns.',
    tags: ['weighted_average_stock_valuation', 'closing_stock_correction'],
    qs: [
      fb('A shop recorded this for one brand of jackets. Stock on 1 March: 400 units costing R78 000 in total. Purchases: 3 600 units costing R780 000 in total. Returns to the supplier: 200 units costing R41 000 in total. Calculate the weighted-average cost per unit.',
        ['Cost per unit = R ', '[ ]'], ['215'], 'standard_math',
        { unit: U, topic: 'closing_stock_valuation', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 3, type: 'calc',
          clues: '- Returns reduce both the total cost and the number of units.' }),
      fb('The shop above has 700 units on hand at the end of the year. Its closing stock was valued at R158 000 using FIFO. It must be corrected to the weighted-average cost of R215 per unit. Calculate the adjustment to inventories (enter a decrease as a negative number).',
        ['Adjustment = R ', '[ ]'], ['-7500'], 'standard_math',
        { unit: U, topic: 'closing_stock_valuation', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      mc('How is the weighted-average cost per unit calculated?',
        'Total cost of stock available ÷ total units available', ['Cost of the most recent purchase ÷ units in that purchase', 'Cost of the oldest stock on hand ÷ units of that oldest stock', 'Total purchases at cost ÷ number of units sold in the year'],
        { unit: U, topic: 'closing_stock_valuation', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 1, type: 'definition' }),
      ms('Select ALL the statements that are true about the weighted-average method.',
        ['Returns to the supplier reduce both total cost and total units', 'One unit cost is applied to all units on hand', 'Opening stock is included in the calculation'],
        ['Only the most recent purchase price is used', 'Returns to the supplier are ignored in the calculation'],
        { unit: U, topic: 'closing_stock_valuation', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.1', 6,
        ['The closing stock was valued on FIFO but the method used must be weighted average.', 'Returns reduce both the cost and the quantity.'],
        ['Add opening stock and purchases, then subtract returns, for both cost and units.', 'Divide total cost by total units, then multiply by the closing units.'],
        ['Total cost = R97 500 + R1 605 000 – R42 500 = R1 660 000.', 'Total units = 300 + 4 800 – 100 = 5 000, so the weighted-average cost is R1 660 000 ÷ 5 000 = R332 per unit.',
          'Correct closing stock = R332 × 820 units = R272 240 (the figure given was R285 500, so inventories are reduced by R13 260).']),
    ],
  },

  // ── L03 ── 1.3 SOFP: non-current assets and the fixed deposit ───────────────
  {
    order: 3, name: 'Question 1.3: Statement of Financial Position — assets', marks: 4, qpages: 3, mpages: 2,
    info: ['25% of the fixed deposit with Eden Bank matures within the next financial year; this current portion is shown.', 'The rest of the deposit matures in 2029.'],
    covers: 'Question 1.3 (assets) — the fixed deposit split into current and non-current portions and the total of current assets.',
    tags: ['statement_of_financial_position', 'fixed_deposit', 'current_and_non_current_assets'],
    figs: [{
      title: 'Statement of Financial Position (extract): Eden Ltd', subtitle: 'ASSETS on 28 February 2026', cols: ['', 'R'],
      rows: [
        H('Non-current assets'),
        LN('Fixed assets at carrying value', fmt(d.fa)),
        LN('Fixed deposit: Eden Bank', blank('A')),
        GAP,
        H('Current assets'),
        LN('Inventories', fmt(d.inv)),
        LN('Trade and other receivables', fmt(d.rec)),
        LN('Fixed deposit: current portion', fmt(d.cur)),
        LN('Cash and cash equivalents', fmt(d.cash)),
        TOT('Total current assets', blank('B')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A and B in the statement.',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(ncFD), String(curTot)], 'standard_math',
        { fig: 0, unit: U, topic: 'statement_of_financial_position', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 3, w: 3, type: 'calc',
          clues: '- The current portion is 25% of the whole deposit.\n- Only the part maturing after 12 months is non-current.' }),
      fb('35% of a fixed deposit matures within the year and is R175 000. The rest matures in three years. Calculate the non-current portion of the deposit.',
        ['Non-current portion = R ', '[ ]'], ['325000'], 'standard_math',
        { unit: U, topic: 'statement_of_financial_position', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      mc('A fixed deposit matures in eight months\' time. How is it shown on the Statement of Financial Position?',
        'As a current asset', ['As a non-current asset', 'As a current liability', 'As part of shareholders\' equity'],
        { unit: U, topic: 'statement_of_financial_position', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 1, type: 'application' }),
      ms('Select ALL the items that are shown under NON-current assets.',
        ['Fixed assets at carrying value', 'Deposit maturing in four years'],
        ['Inventories held for resale', 'Trade and other receivables', 'Deposit maturing in six months'],
        { unit: U, topic: 'statement_of_financial_position', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.3', 4,
        ['Part of the fixed deposit matured on 31 July 2025, within a year of the reporting date.', 'The remaining 60% matures in 2028.'],
        ['Work out the whole deposit from the matured part and its percentage.', 'Show the part maturing after 12 months as non-current and the rest as current.'],
        ['The matured 40% is R320 000, so the remaining 60% is R320 000 × 60 ÷ 40 = R480 000.', 'R480 000 is shown under non-current assets as the fixed deposit: Time Bank; the R320 000 that matured is a current asset.']),
    ],
  },

  // ── L04 ── 1.3 SOFP: inventories and trade and other receivables ────────────
  {
    order: 4, name: 'Question 1.3: Statement of Financial Position — current assets', marks: 8, qpages: 3, mpages: 2,
    info: ['Closing stock was recorded as R1 130 000, but stock costing R8 200 was damaged and must be written off.', 'Debtors\' control is R520 000 and includes a debtor who overpaid by R6 000. Transfer this credit balance to the creditors ledger.', 'The provision for bad debts must be 5% of the outstanding debtors.', 'Commission of R4 200 is still owed to the company.', 'SARS owes the company a refund of R18 000.'],
    covers: 'Question 1.3 (current assets) — inventories after the stock correction, and trade and other receivables with the debtor transfer, the provision for bad debts, accrued income and the SARS refund.',
    tags: ['trade_and_other_receivables', 'provision_for_bad_debts', 'statement_of_financial_position'],
    figs: [{
      title: 'Statement of Financial Position (extract): Roan Ltd', subtitle: 'CURRENT ASSETS on 28 February 2026', cols: ['', 'R'],
      rows: [
        H('Current assets'),
        LN('Inventories', blank('A')),
        LN('Trade and other receivables', blank('B')),
        LN('Cash and cash equivalents', fmt(r.cash)),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A and B in the statement.',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(invCorr), String(recv)], 'standard_math',
        { fig: 0, unit: U, topic: 'statement_of_financial_position', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Take the overpaid debtor out before calculating the provision.\n- Add every amount owed to the company and deduct the provision.' }),
      fb('Debtors\' control is R380 000 after all transfers. The provision for bad debts must be adjusted to 6% of the outstanding debtors. Calculate the closing provision for bad debts.',
        ['Provision = R ', '[ ]'], ['22800'], 'standard_math',
        { unit: U, topic: 'statement_of_financial_position', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      mc('How is the provision for bad debts shown on the Statement of Financial Position?',
        'It is deducted from debtors in trade and other receivables', ['It is added to the creditors as a current liability', 'It is shown as an expense under shareholders\' equity', 'It is added to cash and cash equivalents'],
        { unit: U, topic: 'statement_of_financial_position', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 1, type: 'application' }),
      ms('Select ALL the items that INCREASE trade and other receivables.',
        ['Commission income that is still outstanding', 'An expense paid in advance', 'A refund due from SARS'],
        ['The provision for bad debts', 'A debtor\'s balance written off as irrecoverable'],
        { unit: U, topic: 'statement_of_financial_position', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.3', 8,
        ['Inventories must reflect the correction from question 1.1.', 'Trade and other receivables include more than the debtors\' control account.'],
        ['Adjust the inventories by the difference found in 1.1.', 'Build up receivables from the debtors\' control account, the transfer, the provision and each amount owed to the company.'],
        ['Inventories: R4 598 000 – R13 260 = R4 584 740.',
          'Trade and other receivables: R735 000 + R5 000 (transfer of the overpaid balance) – R29 600 (4% provision) + R6 400 (commission) + R48 750 (fees paid in advance) + R70 000 (SARS refund) = R835 550.']),
    ],
  },

  // ── L05 ── 1.3 SOFP: shareholders' equity ───────────────────────────────────
  {
    order: 5, name: 'Question 1.3: Statement of Financial Position — equity', marks: 10, qpages: 3, mpages: 2,
    info: ['Net profit after tax was R3 360 000.', 'The % return on average shareholders\' equity was 28%.', 'Shareholders\' equity at the beginning of the year was R10 500 000.'],
    covers: 'Question 1.3 (equity) — closing shareholders\' equity found from the % return on average shareholders\' equity, and the retained income.',
    tags: ['shareholders_equity', 'return_on_average_equity', 'retained_income'],
    figs: [{
      title: 'Statement of Financial Position (extract): Tern Ltd', subtitle: 'EQUITY on 28 February 2026', cols: ['', 'R'],
      rows: [
        H('Equity and liabilities'),
        SUBT('Ordinary shareholders\' equity', fmt(closeShe)),
        LN('Ordinary share capital', fmt(e.osc)),
        LN('Retained income', blank('A')),
      ],
    }],
    qs: [
      fb('Tern Ltd earned a net profit after tax of R3 360 000. The % return on average shareholders\' equity was 28%. Shareholders\' equity at the beginning of the year was R10 500 000. Calculate the shareholders\' equity at the end of the year.',
        ['Closing equity = R ', '[ ]'], [String(closeShe)], 'standard_math',
        { unit: U, topic: 'shareholders_equity', subtopic: 'acc_calculation', skill: SK.calc, diff: 4, w: 3, type: 'calc',
          clues: '- Use the return on AVERAGE equity first, then work out the closing figure.' }),
      fb('Use the information in the figure to calculate the missing amounts A in the statement.',
        ['A = ', '[ ]'], [String(ri)], 'standard_math',
        { fig: 0, unit: U, topic: 'shareholders_equity', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 2, w: 2, type: 'calc' }),
      mc('Which formula is used to calculate the % return on average shareholders\' equity?',
        'Net income after tax ÷ average shareholders\' equity × 100', ['Net income after tax ÷ closing shareholders\' equity × 100', 'Net income before tax ÷ average total assets × 100', 'Dividends for the year ÷ average shareholders\' equity × 100'],
        { unit: U, topic: 'shareholders_equity', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 1, type: 'definition' }),
      ms('Select ALL the items that form part of ordinary shareholders\' equity.',
        ['Ordinary share capital', 'Retained income'],
        ['Mortgage loan', 'Shareholders for dividends', 'Bank overdraft'],
        { unit: U, topic: 'shareholders_equity', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.3', 10,
        ['The % return on average equity links profit to the average of the opening and closing equity.', 'Retained income is what remains of equity after the share capital.'],
        ['Divide the net profit after tax by the return to find the average equity.', 'Double the average, subtract the opening equity, then subtract the share capital.'],
        ['Average equity = R4 721 700 × 100 ÷ 24 = R19 673 750.', 'Closing equity = R19 673 750 × 2 – R16 200 000 = R23 147 500.', 'Retained income = R23 147 500 – R17 875 000 (ordinary share capital from 1.2) = R5 272 500.']),
    ],
  },

  // ── L06 ── 1.3 SOFP: liabilities ────────────────────────────────────────────
  {
    order: 6, name: 'Question 1.3: Statement of Financial Position — liabilities', marks: 14, qpages: 3, mpages: 2,
    info: ['The mortgage loan balance is R2 400 000.', 'Fixed monthly repayments of R30 000, including interest, continue next year.', 'Interest for the next financial year is expected to be R180 000.'],
    covers: 'Question 1.3 (liabilities) — the mortgage loan split into current and non-current portions, trade and other payables, shareholders for dividends and the bank overdraft.',
    tags: ['mortgage_loan', 'current_portion_of_loan', 'shareholders_for_dividends'],
    figs: [{
      title: 'Statement of Financial Position (extract): Wren Ltd', subtitle: 'LIABILITIES on 28 February 2026', cols: ['', 'R'],
      rows: [
        H('Non-current liabilities'),
        LN('Mortgage loan: Delta Bank', blank('A')),
        GAP,
        H('Current liabilities'),
        LN('Trade and other payables', fmt(410000)),
        LN('Current portion of loan', blank('B')),
        LN('Shareholders for dividends', fmt(90000)),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A and B in the statement.',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(ncLoan), String(curLoan)], 'standard_math',
        { fig: 0, unit: U, topic: 'statement_of_financial_position', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- The current portion is the capital repaid within the next year.\n- Repayments include interest.' }),
      fb('The directors declared a final dividend of 45 cents per share on 3 200 000 ordinary shares in issue. Calculate the amount for shareholders for dividends.',
        ['Shareholders for dividends = R ', '[ ]'], ['1440000'], 'standard_math',
        { unit: U, topic: 'statement_of_financial_position', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      mc('A company received rent for the first two months of the next financial year. How is this amount shown?',
        'A current liability within trade and other payables', ['A current asset within trade and other receivables', 'A non-current liability within the mortgage loan', 'Part of retained income within shareholders\' equity'],
        { unit: U, topic: 'statement_of_financial_position', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the items that are current liabilities.',
        ['The part of the loan repayable within the next year', 'Shareholders for dividends', 'A bank overdraft'],
        ['The part of the loan repayable after four years', 'Retained income'],
        { unit: U, topic: 'statement_of_financial_position', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.3', 14,
        ['Repayments of R45 000 a month include interest, and next year\'s interest is given.', 'Rent received in advance and the transfer of the debtor\'s overpayment both increase what the company owes.'],
        ['Work out the capital repaid next year, which is the current portion.', 'Build up payables, the dividend and the overdraft from the information.'],
        ['Current portion of the loan = R45 000 × 12 – R290 000 = R250 000; non-current loan = R3 200 000 – R250 000 = R2 950 000.',
          'Trade and other payables = R878 500 + R5 000 (transfer) + R77 000 (rent received in advance) = R960 500.',
          'Shareholders for dividends = 2 750 000 × 90c = R2 475 000, and the bank overdraft is the balancing figure of R774 500.']),
    ],
  },
];
