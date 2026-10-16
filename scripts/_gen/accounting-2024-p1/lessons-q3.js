'use strict';
// Accounting 2024 Nov P1 — Question 3 (Interpretation of Financial Information) lessons 12–16.
// Interpretation items follow CLOSED-DISC-01/02: options are indicator + trend + reason; distractors are wrong-indicator or wrong-direction versions.
const assert = require('assert');
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-6, `${a} != ${b}`); // float-safe equality for computed amounts
const { mc, ms, mt, ord, fb, ex, fmt, blank } = require('./lib');

const LN = (t, a, b, i = 0) => ({ k: 'line', c: [t, a, b], i });

const U = 'interpretation_of_financial_information';
const SK = {
  calc: 'calculate_accounting_amount', term: 'recall_accounting_term', cls: 'classify_accounting_concept',
  app: 'apply_accounting_concept_to_scenario', int: 'interpret_financial_indicators', stmt: 'complete_financial_statement',
};

// ── L12/L13 Baobab Ltd indicators ──
near(Math.round(68 / 124 * 100), 55); near(Math.round(78 / 98 * 100), 80);
near(21 - 15, 6);
near(Math.round((124 - 98) / 98 * 1000) / 10, 26.5);
near(2160000 / ((11200000 + 12800000) / 2) * 100, 18);
// ── L14 financing ──
const fin = { capNow: 36400000, capPrev: 32900000, loanNow: 14250000, loanPrev: 10150000 };
const sharesRaised = fin.capNow - fin.capPrev, loanInc = fin.loanNow - fin.loanPrev;
near(sharesRaised, 3500000); near(loanInc, 4100000);
// ── L15 rights issue (3 for every 20; all shareholders take up their rights) ──
const rt = { inIssue: 4500000, thandi: 2340000, per: 3, every: 20, capRaised: 3712500 };
const rightsTotal = rt.inIssue * rt.per / rt.every, thandiRights = rt.thandi * rt.per / rt.every;
const price = rt.capRaised / rightsTotal, thandiPct = (rt.thandi + thandiRights) / (rt.inIssue + rightsTotal) * 100, thandiPaid = thandiRights * price;
near(rightsTotal, 675000); near(thandiRights, 351000); near(price, 5.5);
assert.ok(Math.abs(thandiPct - 52) < 1e-9); near(thandiPaid, 1930500);
near(Math.round(rt.thandi / (rt.inIssue + rightsTotal) * 1000) / 10, 45.2);
near(Math.round((rt.thandi + thandiRights) / rt.inIssue * 1000) / 10, 59.8);
near(Math.round(thandiRights / (rt.inIssue + rightsTotal) * 1000) / 10, 6.8);
// ── L16 ──
near(1100 - 610, 490);
// ── exam (memo) figures quoted in the explanations ──
near(1620000 * 10 / 50, 324000);
near((1620000 + 324000) / (3000000 + 600000) * 100, 54);
near((31770000 - 28800000) / 600000, 4.95);
near(Math.round(324000 * 4.95), 1603800);
near(31770000 - 28800000, 2970000); near(12913000 - 9400000, 3513000);

const baobab = {
  title: 'Financial indicators: Baobab Ltd', subtitle: 'for the years ended 28 February', cols: ['', '2025', '2024'],
  rows: [
    LN('Mark-up %', '48%', '42%'),
    LN('% operating expenses on sales', '15%', '21%'),
    LN('% operating profit on sales', '17%', '11%'),
    LN('% net profit before tax on sales', '16%', '10%'),
    LN('Earnings per share', '124 cents', '98 cents'),
    LN('Dividends per share', '68 cents', '78 cents'),
    LN('Dividend pay-out rate', '55%', '80%'),
    LN('% return on average shareholders\' equity', '18%', '9%'),
    LN('Interest rate on fixed deposits', '8%', '7%'),
  ],
};

module.exports = [
  // ── L12 ── 3.1–3.2 profitability and dividend pay-out policy ──────────────
  {
    order: 12, name: 'Question 3.1–3.2: Profitability and dividend pay-out policy', marks: 7, qpages: 3, mpages: 1,
    covers: 'Questions 3.1 and 3.2 — quoting indicators with figures and trends to show that expenses are well managed, and commenting on a change in the dividend pay-out policy.',
    tags: ['profitability_indicators', 'dividend_payout_policy'],
    figs: [baobab],
    qs: [
      ms('Select the TWO indicators that show Baobab Ltd is managing its expenses well.',
        ['% operating expenses on sales fell from 21% to 15%', '% operating profit on sales rose from 11% to 17%'],
        ['Mark-up % increased from 42% to 48%', 'Dividends per share fell from 78 to 68 cents', '% operating expenses on sales rose from 15% to 21%'],
        { fig: 0, unit: U, topic: 'interpreting_operating_efficiency', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 3, type: 'interpretation' }),
      mc('Which comment on the dividend pay-out policy of Baobab Ltd is correct?',
        'Pay-out fell from 80% to 55%, so more profit is kept for growth', ['Pay-out rose from 55% to 80%, so shareholders received more of the profit', 'Pay-out fell from 80% to 55%, so the company made less profit this year', 'Pay-out fell from 80% to 55%, so shareholders received more dividends'],
        { fig: 0, unit: U, topic: 'interpreting_returns_and_dividends', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 3, type: 'interpretation' }),
      fb('By how many percentage points did the % operating expenses on sales of Baobab Ltd improve?',
        ['Improvement = ', '[ ]', ' percentage points'], ['6'], 'standard_math',
        { fig: 0, unit: U, topic: 'interpreting_operating_efficiency', subtopic: 'acc_calculation', skill: SK.calc, diff: 1, w: 1, type: 'reading' }),
      mc('Why is the mark-up % NOT accepted as evidence that a company controls its expenses?',
        'It reflects the pricing policy, not expenses', ['It is calculated on sales, not on cost of sales', 'It only changes when the expenses change', 'It is the same for all companies in a sector'],
        { unit: U, topic: 'interpreting_operating_efficiency', subtopic: 'acc_term_recall', skill: SK.term, diff: 3, w: 2, type: 'interpretation' }),
    ],
    subs: [
      ex('3.1', 4,
        ['Choose indicators that are about expenses and operating profit, not the mark-up %.', 'Quote each indicator with both years\' figures and the trend.'],
        ['Look at % operating expenses on sales, % operating profit on sales and % net profit before tax on sales.', 'Give any TWO with figures and the direction of change.'],
        ['% operating expenses on sales decreased from 19% to 14% (by 5 percentage points).', '% operating profit on sales increased from 12% to 18%; % net profit before tax on sales increased from 11% to 19% (any two).']),
      ex('3.2', 3,
        ['The dividend pay-out rate fell from 86% to 60%.', 'A lower pay-out rate means more profit is retained.'],
        ['Quote the trend with figures.', 'Explain why keeping more profit in the company is responsible.'],
        ['The pay-out rate decreased from 86% to 60% (by 26 percentage points).', 'Funds are retained for future expansion, which protects cash flow and benefits shareholders later.']),
    ],
  },

  // ── L13 ── 3.3 earnings and returns ───────────────────────────────────────
  {
    order: 13, name: 'Question 3.3: Earnings and returns', marks: 4, qpages: 3, mpages: 1,
    covers: 'Question 3.3 — whether shareholders should be satisfied with earnings per share and the % return on average shareholders\' equity, compared with the interest on fixed deposits.',
    tags: ['earnings_per_share', 'return_on_average_equity'],
    figs: [baobab],
    qs: [
      ms('Shareholders of Baobab Ltd are satisfied with their earnings and returns. Select the TWO statements that support this.',
        ['EPS increased from 98 cents to 124 cents', 'ROSHE of 18% beats the 8% fixed deposit rate'],
        ['EPS decreased from 124 cents to 98 cents', 'DPS fell from 78 cents to 68 cents this year', 'ROSHE of 9% is below the 8% deposit rate'],
        { fig: 0, unit: U, topic: 'interpreting_returns_and_dividends', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 3, type: 'interpretation' }),
      fb('By what percentage did the earnings per share of Baobab Ltd increase? Give the answer to ONE decimal place.',
        ['Increase = ', '[ ]', ' %'], ['26.5'], 'standard_math',
        { fig: 0, unit: U, topic: 'interpreting_returns_and_dividends', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      mc('Why do shareholders compare the ROSHE with the interest rate on fixed deposits?',
        'To see if the return beats a low-risk alternative investment', ['To see if the company can repay all of its loans on time each year', 'To see if the company has enough cash to pay dividends', 'To see if the share price is above the net asset value'],
        { unit: U, topic: 'interpreting_returns_and_dividends', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 2, type: 'interpretation' }),
      fb('Net income after tax was R2 160 000. Shareholders\' equity was R11 200 000 at the start and R12 800 000 at the end of the year. Calculate the % return on average shareholders\' equity.',
        ['ROSHE = ', '[ ]', ' %'], ['18|18.0'], 'standard_math',
        { unit: U, topic: 'interpreting_returns_and_dividends', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'ratio' }),
    ],
    subs: [
      ex('3.3', 4,
        ['Earnings per share rose from 104 cents to 112 cents.', 'ROSHE rose from 11% to 20%, against a fixed-deposit rate of 7,5%.'],
        ['Quote both indicators with figures and trends.', 'Compare ROSHE with the interest on a fixed deposit to judge the return.'],
        ['EPS increased from 104 cents to 112 cents (by 8 cents), so profitability improved and shareholders should be satisfied.', 'ROSHE increased from 11% to 20%, which is higher than the 7,5% interest on fixed deposits, so shareholders should be satisfied.']),
    ],
  },

  // ── L14 ── 3.4 financing strategies and gearing ───────────────────────────
  {
    order: 14, name: 'Question 3.4: Financing strategies and gearing', marks: 10, qpages: 3, mpages: 1,
    covers: 'Question 3.4 — identifying the two main sources used to finance new fixed assets, and explaining the effect on risk and gearing with the debt-equity ratio and the return on capital employed.',
    tags: ['financing_strategies', 'gearing_and_loans'],
    figs: [{
      title: 'Notes and financial indicators: Baobab Ltd', subtitle: 'for the years ended 28 February', cols: ['', '2025', '2024'],
      rows: [
        LN('Fixed assets purchased', 'R9 460 000', 'R3 200 000'),
        LN('Fixed assets sold', 'R480 000', '0'),
        LN('Fixed deposit', 'R620 000', 'R300 000'),
        LN('Ordinary share capital', 'R36 400 000', 'R32 900 000'),
        LN('Loan: Ubuntu Bank', 'R14 250 000', 'R10 150 000'),
        LN('Debt-equity ratio', '0,3 : 1', '0,6 : 1'),
        LN('% return on average capital employed', '22%', '14%'),
        LN('Interest rate on loans', '11%', '11%'),
      ],
    }],
    qs: [
      fb('Use the figure. Calculate the increase in the loan and the amount raised from new shares issued.',
        ['Loan = R ', '[ ]', '   Shares = R ', '[ ]'], [String(loanInc), String(sharesRaised)], 'standard_math',
        { fig: 0, unit: U, topic: 'interpreting_gearing', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      ms('Select the TWO main sources (over R1 m) used to finance the new fixed assets of Baobab Ltd.',
        ['Issuing new shares', 'Increasing the loan'],
        ['Selling fixed assets', 'Using the fixed deposit', 'Using cash and cash equivalents'],
        { fig: 0, unit: U, topic: 'interpreting_gearing', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 3, type: 'interpretation' }),
      mc('How did the financing decisions affect the risk of Baobab Ltd?',
        'Debt-equity fell to 0,3 : 1, so the financial risk stays low', ['Debt-equity fell to 0,3 : 1, so the company is now highly geared', 'Debt-equity rose to 0,6 : 1, so the financial risk has increased', 'Debt-equity fell to 0,3 : 1, so the loan has been fully repaid'],
        { fig: 0, unit: U, topic: 'interpreting_gearing', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 3, type: 'interpretation' }),
      mc('Is Baobab Ltd positively geared?',
        'Yes, its ROTCE of 22% is above the 11% loan interest rate', ['No, its ROTCE of 22% is below the cost of the new shares', 'Yes, because its debt-equity ratio fell from 0,6 : 1', 'No, because the loan rose by more than R4 m this year'],
        { fig: 0, unit: U, topic: 'interpreting_gearing', subtopic: 'acc_interpretation', skill: SK.int, diff: 4, w: 2, type: 'interpretation' }),
    ],
    subs: [
      ex('3.4', 10,
        ['Compare share capital and the loan in the two years; sale of fixed assets and cash are not accepted as main sources.', 'Use the debt-equity ratio and the return on capital employed against the loan interest rate.'],
        ['Find the increase in share capital and in the loan.', 'Quote the debt-equity ratio for risk and ROTCE against the 12% interest rate for gearing.'],
        ['Shares issued: R2 970 000 (from R28 800 000 to R31 770 000); increase in loan: R3 513 000 (from R9 400 000 to R12 913 000).', 'Debt-equity ratio decreased from 0,5 : 1 to 0,2 : 1, so the company still has a low financial risk.', 'ROTCE increased from 15% to 24%, which is higher than the 12% interest on loans, so the company is positively geared.']),
    ],
  },

  // ── L15 ── 3.5 rights issue and % shareholding ────────────────────────────
  {
    order: 15, name: 'Question 3.5: Rights issue and % shareholding', marks: 12, qpages: 3, mpages: 1,
    info: ['4 500 000 shares were in issue on 1 March 2024. Thandi owned 2 340 000 of them.', 'Rights issue: each shareholder was offered 3 shares for every 20 shares owned. All shareholders took up their rights.', 'Share capital increased by R3 712 500 because of the rights issue. No other shares were issued or repurchased.', 'A is a number of shares; B is a price in rand.'],
    covers: 'Question 3.5 — the shares a shareholder bought through a rights issue, the % shareholding after the issue, and the amount spent on the rights shares.',
    tags: ['rights_issue', 'percentage_shareholding'],
    figs: [{
      title: 'Rights issue: Marula Ltd', subtitle: 'for the year ended 28 February 2025', cols: ['', 'Result'],
      rows: [
        LN('Shares Thandi bought in the rights issue', blank('A')),
        LN('Price per rights share (R)', blank('B')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A and B.',
        ['A = ', '[ ]', '   B = R ', '[ ]'], [String(thandiRights), '5.5|5.50'], 'standard_math',
        { fig: 0, unit: U, topic: 'solvency_and_rights_issue', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 3, type: 'calc',
          clues: '- Thandi gets 3 shares for every 20 she owns.\n- All the new shares together raised the increase in share capital.' }),
      mc('What is Thandi\'s % shareholding after the rights issue?',
        '52,0%', ['45,2%', '59,8%', '6,8%'],
        { fig: 0, unit: U, topic: 'solvency_and_rights_issue', subtopic: 'acc_calculation', skill: SK.calc, diff: 4, w: 3, type: 'calc' }),
      fb('Use your answers for A and B. Calculate the total amount Thandi paid for her rights shares.',
        ['Amount paid = R ', '[ ]'], [String(thandiPaid)], 'standard_math',
        { fig: 0, unit: U, topic: 'solvency_and_rights_issue', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      ms('Select ALL the true statements about this rights issue.',
        ['Existing shareholders were offered the shares first', 'Each shareholder\'s % holding stayed the same'],
        ['New investors could buy the shares first', 'The shares were offered above market price', 'Thandi lost her majority after the issue'],
        { unit: U, topic: 'solvency_and_rights_issue', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('3.5', 12,
        ['Grant owned 1 620 000 of the 3 000 000 shares; the offer was 10 shares for every 50, and everyone took it up.', 'Share capital rose from R28 800 000 to R31 770 000 because of the rights issue.'],
        ['Apply the 10-for-50 ratio to Grant\'s shares and to all shares in issue.', 'Divide the increase in share capital by the rights shares to find the price, then multiply by Grant\'s rights shares.'],
        ['Rights shares bought by Grant = 1 620 000 × 10/50 = 324 000 shares.', '% shareholding = (1 620 000 + 324 000) ÷ (3 000 000 + 600 000) × 100 = 54%.', 'Price per rights share = R2 970 000 ÷ 600 000 = R4,95; Grant spent 324 000 × R4,95 = R1 603 800.']),
    ],
  },

  // ── L16 ── 3.5 repurchase proposal and 3.6 role of the CEO ────────────────
  {
    order: 16, name: 'Question 3.5–3.6: Repurchase proposal and the role of the CEO', marks: 12, qpages: 3, mpages: 2,
    covers: 'Questions 3.5 (last part) and 3.6 — why directors would reject a repurchase above the market price and NAV, the characteristics of a good CEO, and other indicators that show good management.',
    tags: ['share_repurchase', 'role_of_the_ceo', 'liquidity_indicators'],
    figs: [{
      title: 'Financial indicators: Marula Ltd', subtitle: 'for the years ended 28 February', cols: ['', '2025', '2024'],
      rows: [
        LN('Market price per share', '880 cents', '760 cents'),
        LN('Net asset value per share', '610 cents', '540 cents'),
        LN('Solvency ratio', '3,2 : 1', '2,4 : 1'),
        LN('Current ratio', '2,2 : 1', '1,4 : 1'),
        LN('Acid-test ratio', '1,6 : 1', '0,9 : 1'),
        LN('Thandi\'s % shareholding', '52%', '52%'),
      ],
    }],
    qs: [
      ms('Thandi wants Marula Ltd to buy back her shares at R11 each. Select the TWO reasons why the other directors would vote against it.',
        ['R11 is well above the 880 cents market price', 'R11 is far more than the NAV of 610 cents'],
        ['R11 is below the 880 cents market price', 'The company has no shares left to buy back', 'Thandi owns less than half of the shares'],
        { fig: 0, unit: U, topic: 'share_repurchase_and_ethics', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 3, type: 'interpretation' }),
      fb('By how many cents does a price of R11 per share exceed the 2025 NAV per share of Marula Ltd?',
        ['Difference = ', '[ ]', ' cents'], ['490'], 'standard_math',
        { fig: 0, unit: U, topic: 'share_repurchase_and_ethics', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 1, type: 'calc' }),
      ms('Select the TWO characteristics shareholders would expect of a good CEO.',
        ['Sets and communicates a clear vision', 'Acts ethically and with integrity'],
        ['Owns most of the company\'s shares', 'Approves the audit report alone', 'Keeps information from the staff'],
        { unit: U, topic: 'company_terms_and_roles', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
      mc('Apart from profit and returns, which point shows that the CEO manages Marula Ltd well?',
        'Acid-test ratio rose from 0,9 : 1 to 1,6 : 1, so debts can be met', ['Acid-test ratio fell from 1,6 : 1 to 0,9 : 1, so debts can be met', 'Current ratio rose to 2,2 : 1, so too much cash is now idle', 'Solvency ratio fell from 3,2 : 1, so the position is stronger'],
        { fig: 0, unit: U, topic: 'interpreting_liquidity', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 3, type: 'interpretation' }),
    ],
    subs: [
      ex('3.5', 4,
        ['Grant wants the company to buy his shares at R12 (1 200 cents).', 'Compare the price with the market price (950 cents) and NAV (564 cents); he holds 54%.'],
        ['Give TWO points, each with figures.', 'Think about overpaying and about a majority shareholder enriching himself.'],
        ['R12 is above the market price of 950 cents (by 250 cents).', 'R12 is above the NAV of 564 cents (by 636 cents); as a 54% majority shareholder he would be enriching himself.']),
      ex('3.6', 8,
        ['Shareholders expect vision, transparency, ethics and sound financial management from a CEO.', 'Use indicators not quoted earlier: solvency, current and acid-test ratios.'],
        ['Explain TWO qualities of a good CEO.', 'Quote TWO other indicators with figures and trends and explain each.'],
        ['A good CEO sets and communicates a clear vision, is transparent, and is committed to ethical practice (any two, explained).', 'Solvency ratio improved from 2,8 : 1 to 3,8 : 1, so the financial position is stronger.', 'Current ratio improved from 1,6 : 1 to 2,5 : 1 and the acid-test ratio from 1,2 : 1 to 1,9 : 1, so short-term debts can be paid.']),
    ],
  },
];
