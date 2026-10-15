'use strict';
// Accounting 2025 Nov P1 — Question 3 (Concepts and Interpretation of Financial Information) lessons 13–17.
// Interpretation items follow CLOSED-DISC-01/02: options are indicator + trend + reason; distractors are wrong-indicator or wrong-direction versions.
const assert = require('assert');
const { mc, ms, mt, ord, fb, ex, fmt, blank } = require('./lib');

const LN = (t, a, b, i = 0) => ({ k: 'line', c: [t, a, b], i });

const U = 'interpretation_of_financial_information';
const SK = {
  stmt: 'complete_financial_statement', calc: 'calculate_accounting_amount', term: 'recall_accounting_term',
  cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario', int: 'interpret_financial_indicators',
};

// L13: debtors' collection period improvement
assert.strictEqual(39 - 28, 11);
// L14: repurchase
const cfoShares = 2500000 * 0.38, cfoPct = cfoShares / (2500000 - 600000) * 100, extra = 600000 * (4.2 - 3.8);
assert.strictEqual(cfoShares, 950000); assert.strictEqual(cfoPct, 50); assert.ok(Math.abs(extra - 240000) < 1e-6);
// L15: retained cents
assert.strictEqual(480 - 255, 225); assert.strictEqual(168 / 140 * 100, 120);
// L16: share price
assert.strictEqual(955 - 940, 15); assert.strictEqual(310 - 292, 18);

const marlin = {
  title: 'Financial indicators: Marlin Ltd', subtitle: 'for the years ended 28 February', cols: ['', '2026', '2025'],
  rows: [
    LN('Sales', 'R60 m', 'R44 m'),
    LN('Mark-up %', '40%', '55%'),
    LN('% net profit after tax on sales', '21,5%', '17%'),
    LN('Debtors\' collection period', '28 days', '39 days'),
    LN('Creditors\' payment period', '75 days', '62 days'),
    LN('Current ratio', '2,1 : 1', '1,9 : 1'),
  ],
};

module.exports = [
  // ── L13 ── 3.1, 3.2.1, 3.2.2 ────────────────────────────────────────────────
  {
    order: 13, name: 'Question 3.1–3.2.2: Company terms, pricing policy and liquidity', marks: 11, qpages: 4, mpages: 1,
    covers: 'Questions 3.1, 3.2.1 and 3.2.2 — company terms (IFRS, director, CIPC), and quoting indicators with trends for pricing policy and credit policy.',
    tags: ['company_terms', 'pricing_policy_indicators', 'credit_policy_liquidity'],
    figs: [marlin],
    qs: [
      mt('Match each company term to its description.',
        [['IFRS', 'Guidelines that keep financial statements consistent'], ['CIPC', 'Registers companies and keeps their records'], ['Director', 'Elected to run the company and apply its policy'], ['Internal auditor', 'Checks internal controls and reports on them']],
        { unit: U, topic: 'company_terms_and_roles', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 2, type: 'definition' }),
      ms('The CEO of Marlin Ltd says the company\'s pricing policy is well managed. Select the TWO indicators that support this.',
        ['Sales grew from R44 m to R60 m', '% net profit after tax on sales rose from 17% to 21,5%'],
        ['The debtors\' collection period fell from 39 days to 28 days', 'The creditors\' payment period rose from 62 days to 75 days', 'The current ratio improved from 1,9 : 1 to 2,1 : 1'],
        { fig: 0, unit: U, topic: 'interpreting_operating_efficiency', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 3, type: 'interpretation' }),
      ms('The credit policy of Marlin Ltd improved its liquidity. Select the TWO indicators that show this.',
        ['The debtors\' collection period fell from 39 to 28 days', 'The creditors\' payment period rose from 62 to 75 days'],
        ['The current ratio improved from 1,9 : 1 to 2,1 : 1', 'The mark-up % decreased from 55% to 40% this year', 'Sales grew from R44 m to R60 m during the year'],
        { fig: 0, unit: U, topic: 'interpreting_liquidity', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 3, type: 'interpretation' }),
      fb('By how many days did the debtors\' collection period of Marlin Ltd improve?',
        ['Improvement = ', '[ ]', ' days'], ['11'], 'standard_math',
        { fig: 0, unit: U, topic: 'interpreting_liquidity', subtopic: 'acc_calculation', skill: SK.calc, diff: 1, w: 1, type: 'reading' }),
    ],
    subs: [
      ex('3.1', 3,
        ['Each description matches one body or role in a company.', 'The financial statements follow international standards.'],
        ['Read each description and link it to the list of terms.', 'Check who runs the company and who registers it.'],
        ['3.1.1: International Financial Reporting Standards (IFRS) are the guidelines for preparing consistent financial statements.', '3.1.2: A director is an elected board member who runs the company and applies its policy.', '3.1.3: The Companies and Intellectual Properties Commission (CIPC) maintains company records and controls registration.']),
      ex('3.2.1', 4,
        ['Choose indicators about price and profit, not expenses.', 'Quote each indicator with its trend.'],
        ['Look at mark-up %, net profit after tax on sales and sales.', 'Give the previous and current figures.'],
        ['The mark-up % decreased from 65% to 50%, so prices were lower.', 'The % net profit after tax on sales increased from 22% to 26,4%.', 'Sales improved from R48 m to R77 m (any two indicators earn the marks).']),
      ex('3.2.2', 4,
        ['The credit policy covers how fast debtors pay and how long creditors wait.', 'Do not use the current ratio or acid-test ratio.'],
        ['Look at the debtors\' collection period and the creditors\' payment period.', 'Say how each trend improves liquidity.'],
        ['The debtors\' collection period improved from 42 days to 31 days, so cash is received sooner.', 'The creditors\' payment period improved from 71 days to 90 days, so cash is kept longer.']),
    ],
  },

  // ── L14 ── 3.2.3 share repurchase by the CFO ────────────────────────────────
  {
    order: 14, name: 'Question 3.2.3: Share repurchase and shareholding', marks: 10, qpages: 4, mpages: 1,
    info: ['The CFO persuaded the board to repurchase 600 000 shares at R4,20 each.', 'The market price of a share on the JSE was R3,80.', 'A is the CFO\'s % shareholding (no % sign); B is the extra amount in rand.'],
    covers: 'Question 3.2.3 — the effect of a share repurchase on a shareholder\'s % holding, the concerns of the internal auditor, and the extra amount paid compared with the JSE price.',
    tags: ['share_repurchase_effect', 'percentage_shareholding', 'corporate_ethics'],
    figs: [{
      title: 'Share capital (extract): Marlin Ltd', subtitle: 'for the years ended 28 February', cols: ['', '2026', '2025'],
      rows: [
        LN('Authorised shares', '4 000 000', '4 000 000'),
        LN('Repurchase of shares', '(600 000)', '0'),
        LN('Shares in issue', '1 900 000', '2 500 000'),
        LN('CFO: % shareholding', blank('A'), '38%'),
        LN('Extra paid vs JSE price (R)', blank('B'), ''),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A and B in the statement.',
        ['A = ', '[ ]', '   B = ', '[ ]'], ['50', '240000'], 'standard_math',
        { fig: 0, unit: U, topic: 'share_repurchase_and_ethics', subtopic: 'acc_calculation', skill: SK.calc, diff: 4, w: 3, type: 'calc',
          clues: '- The CFO\'s number of shares does not change.\n- The extra amount is paid on every share repurchased.' }),
      ms('The internal auditor is concerned about the CFO persuading the board to repurchase shares. Select the TWO valid reasons.',
        ['The CFO becomes the majority shareholder', 'The company paid more than the JSE price'],
        ['The number of shares in issue decreased', 'The company has authorised more shares', 'The shares were repurchased from a shareholder'],
        { unit: U, topic: 'share_repurchase_and_ethics', subtopic: 'acc_interpretation', skill: SK.int, diff: 4, w: 3, type: 'interpretation' }),
      mc('A shareholder sells nothing when a company repurchases shares from another shareholder. What happens to that shareholder\'s % holding?',
        'It increases, because fewer shares are in issue', ['It stays the same, because the number of shares held is unchanged', 'It decreases, because the company paid more than the market price', 'It increases only if the shareholder buys more shares'],
        { unit: U, topic: 'share_repurchase_and_ethics', subtopic: 'acc_term_recall', skill: SK.term, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('3.2.3', 10,
        ['Lewis\'s own number of shares did not change, but the total number of shares fell.', 'The extra amount is compared with the JSE price on every share repurchased.'],
        ['Find his shares before the repurchase, then divide by the new total.', 'Subtract the market price from the price paid and multiply by the number of shares.'],
        ['Lewis\'s shares = 1 783 250 × 40% = 713 300; new % = 713 300 ÷ 1 383 250 × 100 = 51,6%.',
          'Concerns (any two): he is now the majority shareholder; he acted for personal gain just before the final dividend; using company funds to enrich himself; the price was above the NAV and the market price.',
          'Additional amount = 400 000 × (R3,00 – R2,56) = R176 000.']),
    ],
  },

  // ── L15 ── 3.3.1 returns and dividend pay-out policy ────────────────────────
  {
    order: 15, name: 'Question 3.3.1: Returns and dividend pay-out policy', marks: 8, qpages: 4, mpages: 1,
    covers: 'Question 3.3.1 — comparing the % return on shareholders\' equity with a fixed deposit, and comparing dividend pay-out policies.',
    tags: ['return_on_shareholders_equity', 'dividend_payout_policy'],
    figs: [{
      title: 'Financial indicators for 2026', subtitle: 'Marlin Ltd and Sable Ltd', cols: ['', 'Marlin', 'Sable'],
      rows: [
        LN('% return on shareholders\' equity', '5%', '17,4%'),
        LN('Earnings per share', '140 c', '480 c'),
        LN('Dividends per share', '168 c', '255 c'),
        LN('Dividend pay-out rate', '120%', '53,1%'),
        LN('Interest on fixed deposit', '6,8%', '6,8%'),
      ],
    }],
    qs: [
      ms('Select the TWO correct statements about the % return on shareholders\' equity.',
        ['Marlin\'s return of 5% is less than the 6,8% earned on a fixed deposit', 'Sable\'s return of 17,4% is more than the 6,8% earned on a fixed deposit'],
        ['Sable\'s return of 17,4% is less than the 6,8% earned on a fixed deposit', 'Marlin\'s return of 5% is better than Sable\'s return of 17,4%', 'Both companies earn less than a fixed deposit would pay'],
        { fig: 0, unit: U, topic: 'interpreting_returns_and_dividends', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 3, type: 'interpretation' }),
      mc('Which statement describes the dividend policy of Marlin Ltd?',
        'It paid out more than it earned and kept no profit for growth', ['It kept more than half of its earnings for future expansion', 'It paid out less than half of its earnings to shareholders', 'It paid no dividends because its profit was too low'],
        { fig: 0, unit: U, topic: 'interpreting_returns_and_dividends', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
      fb('How many cents of earnings per share did Sable Ltd retain?',
        ['Retained = ', '[ ]', ' cents'], ['225'], 'standard_math',
        { fig: 0, unit: U, topic: 'interpreting_returns_and_dividends', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
    ],
    subs: [
      ex('3.3.1', 8,
        ['Compare each company\'s return with the interest on a fixed deposit.', 'Dividends per share and earnings per share show how much of the profit is paid out.'],
        ['Quote the % return and the trend for one company, then comment on it.', 'For pay-out policy, compare the pay-out rates and what is retained.'],
        ['Shorts Ltd: the % return on shareholders\' equity decreased from 14,7% to 6%, which is less than the fixed deposit rate of 7,1%.',
          'Lynn Ltd: the return increased from 14,5% to 16,1%, above its fixed deposit rate of 6,7%.',
          'Lynn kept 46,1% of its earnings (235c of 510c) for expansion, while Shorts paid out 124,6% of its earnings.']),
    ],
  },

  // ── L16 ── 3.3.2 share price and 3.4 gearing ────────────────────────────────
  {
    order: 16, name: 'Question 3.3.2–3.4: Share price and gearing', marks: 7, qpages: 4, mpages: 2,
    covers: 'Questions 3.3.2 and 3.4 — comparing net asset value with the market price, and judging a decision to borrow using the return on total capital employed.',
    tags: ['share_price_interpretation', 'gearing_and_loans'],
    figs: [{
      title: 'Share information for 2026', subtitle: 'Marlin Ltd and Sable Ltd', cols: ['', 'Marlin', 'Sable'],
      rows: [
        LN('Net asset value per share', '310 c', '940 c'),
        LN('Market price on last day', '292 c', '955 c'),
      ],
    }],
    qs: [
      mc('How does the market price of Marlin Ltd compare with its net asset value?',
        'The shares are undervalued because the price is below the NAV', ['The shares are overvalued because the price is below the NAV', 'The shares are undervalued because the price is above the NAV', 'The shares are fairly valued because the price equals the NAV'],
        { fig: 0, unit: U, topic: 'interpreting_share_price', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
      fb('By how many cents is the market price of Sable Ltd above its net asset value?',
        ['Difference = ', '[ ]', ' cents'], ['15'], 'standard_math',
        { fig: 0, unit: U, topic: 'interpreting_share_price', subtopic: 'acc_calculation', skill: SK.calc, diff: 1, w: 1, type: 'reading' }),
      mc('The % return on total capital employed of a company rose from 19,2% to 21,8%. It pays 12,5% interest on its loans. What does this show?',
        'The loans earn more than they cost, so the company is positively geared', ['The loans earn less than they cost, so the company is negatively geared', 'The loans were repaid in full during the financial year', 'The company paid more in interest than it earned'],
        { unit: U, topic: 'interpreting_gearing', subtopic: 'acc_interpretation', skill: SK.int, diff: 4, w: 3, type: 'interpretation' }),
      ms('Select the TWO statements that support the directors\' decision to take up more loans.',
        ['The return on total capital employed increased', 'The return is higher than the interest rate on loans'],
        ['The debt-equity ratio increased', 'The interest on loans is more than the return', 'The company paid out all of its profit as dividends'],
        { unit: U, topic: 'interpreting_gearing', subtopic: 'acc_interpretation', skill: SK.int, diff: 4, w: 3, type: 'interpretation' }),
    ],
    subs: [
      ex('3.3.2', 4,
        ['Compare the net asset value with the market price for each company.', 'Say whether the shares are undervalued or overvalued.'],
        ['Subtract one from the other for Shorts Ltd and for Lynn Ltd.', 'Decide what the difference shows about shareholders\' satisfaction.'],
        ['Shorts Ltd: NAV of 270 cents is higher than the market price of 256 cents, so the shares are undervalued by 14 cents.', 'Lynn Ltd: the market price of 976 cents is higher than the NAV of 958 cents, so the shares are overvalued by 18 cents.']),
      ex('3.4', 3,
        ['A larger debt-equity ratio means more loans.', 'Compare the return on total capital employed with the interest rate on loans.'],
        ['Quote the trend in the % return on total capital employed.', 'Compare it with the interest rate to judge whether borrowing paid off.'],
        ['The return on total capital employed increased from 19,2% to 21,8%.', 'It is higher than the interest rate of 12,5%, so the company is positively geared and used the loans effectively.']),
    ],
  },

  // ── L17 ── 3.5 audit report ─────────────────────────────────────────────────
  {
    order: 17, name: 'Question 3.5: Audit report', marks: 4, qpages: 4, mpages: 1,
    covers: 'Question 3.5 — why shareholders should be concerned about a qualified audit report and the decisions they could make.',
    tags: ['audit_report', 'shareholder_decisions'],
    qs: [
      mc('An auditor reports that the statements fairly represent the company, except that supporting documents for some expenses could not be traced. What kind of audit opinion is this?',
        'A qualified audit opinion', ['An unqualified audit opinion', 'A disclaimer of any opinion', 'A favourable audit opinion'],
        { unit: U, topic: 'audit_reports', subtopic: 'acc_term_recall', skill: SK.term, diff: 3, w: 2, type: 'definition' }),
      ms('Select the TWO reasons why shareholders should be concerned about this audit report.',
        ['Poor records suggest weak internal control', 'Money may have been mismanaged or lost to fraud'],
        ['The profit of the company is guaranteed to rise', 'Dividends will be paid earlier than usual', 'The directors will be paid a smaller salary'],
        { unit: U, topic: 'audit_reports', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 3, type: 'interpretation' }),
      ms('Select the TWO decisions shareholders could make because of this audit report.',
        ['Vote against re-appointing the directors', 'Demand improved internal controls'],
        ['Buy more shares immediately', 'Approve a higher salary for the directors', 'Ignore the report until next year'],
        { unit: U, topic: 'audit_reports', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
    ],
    subs: [
      ex('3.5', 4,
        ['The auditor could not trace the supporting documents for some expenses.', 'Think about what poor recording means for control and trust.'],
        ['Say what the qualified report shows about the company.', 'Suggest what shareholders could do about it.'],
        ['Shareholders should be concerned because this is a qualified report, it suggests poor internal control, possible mismanagement or fraud, and it can hurt the share price and reputation.',
          'They could investigate the financial practices, vote against reappointing the directors, demand improved internal controls, or sell their shares.']),
    ],
  },
];
