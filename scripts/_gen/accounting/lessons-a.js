'use strict';
// Accounting 2025 Nov P1 — Question 1 (Company Financial Statements) lessons 1–6.
const { mc, ms, mt, ord, fb, ex, fmt, blank } = require('./lib');
const assert = require('assert');

// statement row helpers (figures are rendered by render_statement.py)
const H = (t, i = 0) => ({ k: 'head', c: [t], i });
const LN = (t, a, i = 1) => ({ k: 'line', c: [t, a], i });
const SUBT = (t, a, i = 0) => ({ k: 'sub', c: [t, a], i });
const TOT = (t, a, i = 0) => ({ k: 'total', c: [t, a], i });
const GAP = { k: 'gap' };

const U_CFS = 'company_financial_statements';
const SK = {
  stmt: 'complete_financial_statement', calc: 'calculate_accounting_amount', term: 'recall_accounting_term',
  cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario', int: 'interpret_financial_indicators',
};

module.exports = [
  // ── L02 ── 1.2 Ordinary share capital note (pilot) ──────────────────────────
  {
    order: 2, name: 'Question 1.2: Ordinary share capital note', marks: 8, qpages: 3, mpages: 2,
    covers: 'Question 1.2 — the Ordinary Share Capital note: shares in issue at the beginning, shares issued, shares repurchased at the average share price (ASP), and shares in issue at the end.',
    tags: ['ordinary_share_capital_note', 'share_repurchase', 'average_share_price'],
    figs: [
      {
        title: 'Ordinary Share Capital Note: Kestrel Ltd',
        subtitle: 'for the year ended 28 February 2026',
        cols: ['', 'Number', 'Amount (R)'],
        rows: [
          { k: 'line', c: ['Shares in issue at beginning', blank('A'), fmt(8800000)] },
          { k: 'line', c: ['Shares issued during year', fmt(400000), blank('B')] },
          { k: 'line', c: ['Shares repurchased (ASP: R5,80)', fmt(-100000), fmt(-580000)] },
          { k: 'total', c: ['Shares in issue at end', fmt(1900000), fmt(11020000)] },
        ],
      },
    ],
    qs: [
      fb('The Ordinary Share Capital note of Kestrel Ltd is shown. The shares in issue at the end of the year and the amounts for the repurchase are correct. A is a number of shares and B is an amount in rand. Calculate the missing amounts.',
        ['A = ', '[ ]', '   B = ', '[ ]'], ['1600000', '2800000'], 'standard_math',
        { fig: 0, unit: U_CFS, topic: 'share_capital_note', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 3, w: 3, type: 'calc',
          clues: '- Work backwards from the closing balances.\n- Add back what was repurchased and subtract what was issued.' }),
      fb('Mabu Ltd had 2 000 000 ordinary shares in issue and share capital of R9 000 000 at the beginning of the year. During the year 500 000 new shares were issued for R4 000 000. Calculate the average share price (ASP) at which a share repurchase after the issue will be recorded.',
        ['ASP = R ', '[ ]', ' per share'], ['5.2'], 'standard_math',
        { unit: U_CFS, topic: 'share_capital_note', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc',
          clues: '- Use all the shares in issue and all the share capital after the new issue.' }),
      mc('At what value is a share repurchase recorded in the Ordinary Share Capital note?',
        'The average price of all shares in issue', ['The price the company paid to the shareholders', 'The issue price of the most recent new shares', 'The market price quoted on the JSE that day'],
        { unit: U_CFS, topic: 'share_capital_note', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 1, type: 'definition' }),
      ms('A company repurchases shares for more than the average share price. Select ALL the correct effects.',
        ['The number of shares in issue decreases', 'Share capital decreases by the ASP of the shares bought back', 'The extra amount paid above the ASP is deducted from retained income'],
        ['Share capital decreases by the full price paid to shareholders', 'Retained income increases by the extra amount paid'],
        { unit: U_CFS, topic: 'share_capital_note', subtopic: 'acc_classification', skill: SK.cls, diff: 4, w: 3, type: 'application' }),
    ],
    subs: [
      ex('1.2', 8,
        ['The closing balances are given, so work backwards to the opening and issue figures.', 'Repurchased shares are recorded at the average share price (ASP).'],
        ['Find the opening number of shares from the closing number, the issue and the repurchase.', 'Find the amount issued from the change in share capital, then calculate the ASP and the repurchase amount.'],
        ['Shares in issue at the beginning: 2 750 000 – 750 000 + 150 000 = 2 150 000 shares; the opening amount is R11 395 000.',
          'Shares issued: R17 875 000 – R11 395 000 + R975 000 = R7 455 000 for 750 000 shares.',
          'ASP = (R11 395 000 + R7 455 000) ÷ (2 150 000 + 750 000) = R6,50 per share.',
          'Shares repurchased: 150 000 × R6,50 = R975 000, recorded as a negative; shares in issue at the end = 2 750 000 shares and R17 875 000.']),
    ],
  },
];
