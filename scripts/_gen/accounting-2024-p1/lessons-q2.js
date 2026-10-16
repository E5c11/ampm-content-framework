'use strict';
// Accounting 2024 Nov P1 — Question 2 (Cash Flow Statement and Financial Indicators) lessons 8–11.
const assert = require('assert');
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-6, `${a} != ${b}`); // float-safe equality for computed amounts
const { mc, ms, mt, ord, fb, ex, fmt, blank } = require('./lib');

const H = (t, i = 0) => ({ k: 'head', c: [t], i });
const LN = (t, a, i = 1) => ({ k: 'line', c: [t, a], i });
const SUBT = (t, a, i = 0) => ({ k: 'sub', c: [t, a], i });

const U_CFS = 'company_financial_statements', U_CF = 'cash_flow_statement', U_FI = 'financial_indicators';
const SK = {
  stmt: 'complete_financial_statement', calc: 'calculate_accounting_amount', term: 'recall_accounting_term',
  cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario',
};

// ── L8: retained income note ──
const ri = { open: 842300, divs: 612000, payout: 45, repShares: 50000, above: 2.4, interim: 270000 };
const npat = ri.divs * 100 / ri.payout, rep = ri.repShares * ri.above, finalDiv = ri.divs - ri.interim;
const riClose = ri.open + npat - rep - ri.divs;
near(npat, 1360000); near(rep, 120000); near(finalDiv, 342000); near(riClose, 1470300);

// ── L9: taxation paid and dividends paid ──
const tx = { openCr: 38200, tax: 415000, closeDr: 21500 }, taxPaid = tx.openCr + tx.tax + tx.closeDr;
const dv = { shares: 1500000, finalCents: 22, interim: 285000 }, divPaid = dv.shares * dv.finalCents / 100 + dv.interim;
near(taxPaid, 474700); near(divPaid, 615000);
near(900000 * 0.15 + 160000, 295000);

// ── L10: financing activities and cash ──
const sh = { open: 2000000, cap: 11600000, issued: 500000, price: 9.2, rep: 60000, above: 1.5 };
const asp = (sh.cap + sh.issued * sh.price) / (sh.open + sh.issued), repAmt = sh.rep * (asp + sh.above);
const ln = { inst: 84500, capInt: 421200 }, loanRepaid = ln.inst * 12 - ln.capInt;
const cash = { bank: 48300, od: 205900, change: 412750 }, cashOpen = cash.bank - cash.od, cashClose = cashOpen + cash.change;
assert.ok(Math.abs(asp - 6.48) < 1e-9); assert.ok(Math.abs(repAmt - 478800) < 1e-6);
near(loanRepaid, 592800); near(cashOpen, -157600); near(cashClose, 255150);

// ── L11: indicators ──
const ind = { sales: 6480000, cos: 4320000, opex: 1101600, stOpen: 256000, stClose: 226000, interim: 336000, sharesAtInterim: 2400000 };
const opexPct = ind.opex / ind.sales * 100, stt = ind.cos / ((ind.stOpen + ind.stClose) / 2), idps = ind.interim / ind.sharesAtInterim * 100;
assert.ok(Math.abs(opexPct - 17) < 1e-9); near(Math.round(stt * 10) / 10, 17.9); near(idps, 14);
near(190000 / 950000 * 100, 20);

// ── exam (memo) figures quoted in the explanations ──
near(744860 * 100 / 40, 1862150);
near(573720 + 1862150 - 34000 * 1.9 - 744860, 1626410);
near(44675 + 462000 + 66650, 573325);
near(1200000 * 0.17 + 416000, 620000);
near((8160000 + 4000000) / 1600000, 7.6);
near(Math.round(34000 * (7.6 + 1.9)), 323000);
near(97120 * 12 - 685440, 480000);
near(36000 - 142680 + 296460, 189780);
near(Math.round(1360950 / 8240600 * 1000) / 10, 16.5);
near(Math.round(5060000 / 183500 * 10) / 10, 27.6);
near(416000 / 1600000 * 100, 26);

module.exports = [
  // ── L08 ── 2.1 retained income note ────────────────────────────────────────
  {
    order: 8, name: 'Question 2.1: Retained income note', marks: 8, qpages: 2, mpages: 1,
    info: ['Total dividends for the year (interim and final) were R612 000.', 'The dividend pay-out rate was 45%.', '50 000 shares were repurchased at R2,40 per share above the average share price.', 'Enter amounts that are subtracted as negative numbers.'],
    covers: 'Question 2.1 — the Retained Income Note: net profit after tax worked back from the dividend pay-out rate, the amount paid above the average share price on a repurchase, and the interim and final dividends.',
    tags: ['retained_income', 'dividend_payout_rate', 'share_repurchase'],
    figs: [{
      title: 'Retained Income Note: Eland Ltd', subtitle: 'for the year ended 28 February 2025', cols: ['', 'R'],
      rows: [
        LN('Balance at the beginning of the year', fmt(ri.open), 0),
        LN('Net profit after tax', blank('A'), 0),
        LN('Repurchase of shares', blank('B'), 0),
        LN('Ordinary share dividends', fmt(-ri.divs), 0),
        LN('Interim dividends', fmt(ri.interim), 1),
        LN('Final dividends', blank('C'), 1),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], [String(npat), `-${rep}|${rep}`, String(finalDiv)], 'standard_math',
        { fig: 0, unit: U_CFS, topic: 'retained_income_note', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- The pay-out rate compares the dividends for the year with net profit after tax.\n- Only the amount above the ASP comes out of retained income.' }),
      fb('Use the figure and your answers. Calculate the balance of retained income at the end of the year.',
        ['Closing balance = R ', '[ ]'], [String(riClose)], 'standard_math',
        { fig: 0, unit: U_CFS, topic: 'retained_income_note', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      mc('Shares were repurchased above the average share price. Where is the amount paid above the ASP recorded?',
        'Deducted from retained income', ['Deducted from ordinary share capital', 'Shown as an operating expense', 'Added to shareholders for dividends'],
        { unit: U_CFS, topic: 'retained_income_note', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the items that appear in the Retained Income Note.',
        ['Net profit after tax', 'Ordinary share dividends', 'Amount paid above the ASP on repurchase'],
        ['New shares issued at the issue price', 'Provisional income tax paid'],
        { unit: U_CFS, topic: 'retained_income_note', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
    ],
    subs: [
      ex('2.1', 8,
        ['Total dividends of R744 860 were 40% of net profit after tax.', '34 000 shares were repurchased at R1,90 above the average share price.'],
        ['Divide the dividends by the pay-out rate to find net profit after tax.', 'Subtract the amount above the ASP and the dividends from the opening balance plus profit.'],
        ['Net profit after tax = R744 860 × 100/40 = R1 862 150.', 'Repurchase of shares = 34 000 × R1,90 = R64 600 (subtracted).', 'Dividends R744 860: interim R416 000 and final R328 860 (R744 860 – R416 000).', 'Closing balance = R573 720 + R1 862 150 – R64 600 – R744 860 = R1 626 410.']),
    ],
  },

  // ── L09 ── 2.2 cash flow: operating activities ─────────────────────────────
  {
    order: 9, name: 'Question 2.2: Cash flow statement — taxation and dividends paid', marks: 8, qpages: 2, mpages: 1,
    info: ['SARS: Income tax at the start of the year: R38 200 Cr (owed to SARS).', 'Income tax for the year: R415 000.', 'SARS: Income tax at the end of the year: R21 500 Dr (SARS owes a refund).', 'Last year\'s final dividend of 22 cents per share on 1 500 000 shares was paid this year.', 'An interim dividend of R285 000 was paid this year.', 'Enter cash outflows as negative numbers.'],
    covers: 'Question 2.2 (operating activities) — taxation paid from the SARS balances and the tax for the year, and dividends paid (last year\'s final dividend plus this year\'s interim dividend).',
    tags: ['taxation_paid', 'dividends_paid', 'company_cash_flow_statement'],
    figs: [{
      title: 'Cash Flow Statement (extract): Eland Ltd', subtitle: 'for the year ended 28 February 2025', cols: ['', 'R'],
      rows: [
        H('Cash flow from operating activities'),
        LN('Cash generated from operations', fmt(1284600)),
        LN('Interest paid', fmt(-96400)),
        LN('Taxation paid', blank('A')),
        LN('Dividends paid', blank('B')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A and B.',
        ['A = ', '[ ]', '   B = ', '[ ]'], [`-${taxPaid}`, `-${divPaid}`], 'standard_math',
        { fig: 0, unit: U_CF, topic: 'cash_flow_operating_activities', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Tax paid covers last year\'s debt, this year\'s tax and any overpayment.\n- Dividends paid are last year\'s final plus this year\'s interim.' }),
      mc('At the end of the year SARS owes the company a refund. How does this affect the taxation paid calculation?',
        'It is added, as the company paid more than the tax due', ['It is subtracted, as SARS will refund the amount later', 'It is ignored, as no cash has been received for it yet', 'It is added to cash generated from operations instead'],
        { unit: U_CF, topic: 'cash_flow_operating_activities', subtopic: 'acc_classification', skill: SK.cls, diff: 4, w: 2, type: 'application' }),
      fb('A company had 900 000 shares in issue when it declared a final dividend of 15 cents per share at the end of last year. This year it paid an interim dividend of R160 000 and declared a final dividend of R210 000. Calculate the dividends paid this year (enter as a negative number).',
        ['Dividends paid = R ', '[ ]'], ['-295000'], 'standard_math',
        { unit: U_CF, topic: 'cash_flow_operating_activities', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      ms('Select ALL the items shown under cash flow from operating activities.',
        ['Cash generated from operations', 'Interest paid', 'Dividends paid'],
        ['Proceeds from shares issued', 'Purchase of fixed assets'],
        { unit: U_CF, topic: 'cash_flow_operating_activities', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
    ],
    subs: [
      ex('2.2', 8,
        ['SARS was owed R44 675 at the start (Cr) and owed the company R66 650 at the end (Dr); income tax was R462 000.', 'Last year\'s final dividend was 17 cents on 1 200 000 shares; the interim dividend was R416 000.'],
        ['Add the amount owed at the start, the tax for the year and the overpayment at the end.', 'Dividends paid = last year\'s final dividend + this year\'s interim dividend; show both as outflows.'],
        ['Taxation paid = R44 675 + R462 000 + R66 650 = (R573 325).', 'Dividends paid = (1 200 000 × 17 cents = R204 000) + R416 000 = (R620 000).']),
    ],
  },

  // ── L10 ── 2.2 cash flow: financing activities and cash ─────────────────────
  {
    order: 10, name: 'Question 2.2: Cash flow statement — financing activities and cash', marks: 9, qpages: 2, mpages: 1,
    info: ['On 1 March 2024 there were 2 000 000 shares in issue; share capital was R11 600 000.', '500 000 shares were then issued at R9,20 each.', 'Later, 60 000 shares were repurchased at R1,50 per share above the average share price.', 'Loan: monthly instalments of R84 500 (including interest); interest capitalised R421 200.', 'At the start of the year: bank R48 300; bank overdraft R205 900.', 'Enter outflows and negative balances as negative numbers.'],
    covers: 'Question 2.2 (financing activities and cash) — new shares issued, shares repurchased at the average share price plus the premium, the loan repaid, and the opening and closing cash and cash equivalents.',
    tags: ['financing_activities', 'average_share_price', 'cash_and_cash_equivalents'],
    figs: [{
      title: 'Cash Flow Statement (extract): Eland Ltd', subtitle: 'for the year ended 28 February 2025', cols: ['', 'R'],
      rows: [
        H('Cash flow from financing activities'),
        LN('Proceeds of shares issued', fmt(sh.issued * sh.price)),
        LN('Shares repurchased', blank('A')),
        LN('Loan repaid', blank('B')),
        { k: 'gap' },
        SUBT('Net change in cash and cash equivalents', fmt(cash.change)),
        LN('Cash and cash equivalents: beginning', blank('C'), 0),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], [`-${Math.round(repAmt)}`, `-${loanRepaid}`, String(cashOpen)], 'standard_math',
        { fig: 0, unit: U_CF, topic: 'cash_flow_financing_activities', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 5, w: 3, type: 'calc',
          clues: '- Find the ASP after the new issue, then add the premium.\n- The capitalised interest is not a repayment of the loan.' }),
      fb('Use the figure and your answer for C. Calculate cash and cash equivalents at the end of the year.',
        ['Closing cash = R ', '[ ]'], [String(cashClose)], 'standard_math',
        { fig: 0, unit: U_CF, topic: 'cash_flow_financing_activities', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      mc('Loan instalments include interest. Why is the capitalised interest subtracted from the instalments to find the loan repaid?',
        'The interest part of each payment does not reduce the loan', ['The interest was already shown as an investing outflow', 'The interest is paid by shareholders, not by the company', 'The interest is only payable once the whole loan has been settled'],
        { unit: U_CF, topic: 'cash_flow_financing_activities', subtopic: 'acc_classification', skill: SK.cls, diff: 4, w: 2, type: 'application' }),
      ms('Select ALL the items shown under cash flow from financing activities.',
        ['Proceeds of shares issued', 'Shares repurchased', 'Loan repaid'],
        ['Interest paid on the loan', 'Fixed deposit invested'],
        { unit: U_CF, topic: 'cash_flow_financing_activities', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
    ],
    subs: [
      ex('2.2', 9,
        ['400 000 shares were issued at R10 after 1 200 000 shares (R8 160 000) were in issue; 34 000 were repurchased at R1,90 above the ASP.', 'Monthly instalments of R97 120 include interest; R685 440 interest was capitalised.'],
        ['Find the ASP after the new issue, then the repurchase at ASP plus R1,90.', 'Subtract the capitalised interest from 12 instalments; work out opening cash from the bank and overdraft balances.'],
        ['New shares issued = 400 000 × R10 = R4 000 000.', 'ASP = (R8 160 000 + R4 000 000) ÷ 1 600 000 = R7,60; shares repurchased = 34 000 × R7,60 + 34 000 × R1,90 = R258 400 + R64 600 = (R323 000).', 'Loan repaid = (R97 120 × 12) – R685 440 = (R480 000).', 'Opening cash = R36 000 – R142 680 = (R106 680); closing cash = –R106 680 + R296 460 = R189 780.']),
    ],
  },

  // ── L11 ── 2.3 financial indicators ────────────────────────────────────────
  {
    order: 11, name: 'Question 2.3: Operating expenses on sales, stock turnover and interim dividend per share', marks: 10, qpages: 2, mpages: 1,
    info: ['Sales R6 480 000; cost of sales R4 320 000; operating expenses R1 101 600.', 'Trading stock: R256 000 at the start and R226 000 at the end of the year.', 'An interim dividend of R336 000 was paid when 2 400 000 shares were in issue.', '60 000 shares were repurchased after the interim dividend was paid.', 'Give A and B to ONE decimal place; C is in cents.'],
    covers: 'Question 2.3 — % operating expenses on sales, the stock turnover rate and the interim dividend per share, using the Financial Indicator Formula Sheet.',
    tags: ['financial_indicators_calculation', 'stock_turnover_rate', 'dividends_per_share'],
    figs: [{
      title: 'Financial indicators: Eland Ltd', subtitle: 'for the year ended 28 February 2025', cols: ['', 'Result'],
      rows: [
        LN('% operating expenses on sales', blank('A'), 0),
        LN('Stock turnover rate (times)', blank('B'), 0),
        LN('Interim dividend per share (cents)', blank('C'), 0),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate A as a percentage, B in times and C in cents.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], ['17|17.0', '17.9|18', '14'], 'standard_math',
        { fig: 0, unit: U_FI, topic: 'financial_indicator_calculations', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 3, type: 'ratio',
          clues: '- Use AVERAGE trading stock for the stock turnover rate.\n- Use the shares in issue when the interim dividend was paid.' }),
      mc('Which formula gives the stock turnover rate?',
        'Cost of sales ÷ average trading stock', ['Sales ÷ average trading stock', 'Average trading stock ÷ cost of sales', 'Gross profit ÷ average trading stock'],
        { unit: U_FI, topic: 'financial_indicator_calculations', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 1, type: 'definition' }),
      fb('A company paid an interim dividend of R190 000 when 950 000 shares were in issue. Later that year 50 000 shares were repurchased. Calculate the interim dividend per share.',
        ['Interim DPS = ', '[ ]', ' cents'], ['20'], 'standard_math',
        { unit: U_FI, topic: 'financial_indicator_calculations', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'ratio' }),
      ms('Select ALL the correct statements about the stock turnover rate.',
        ['A higher rate means stock sells faster', 'It uses the average of opening and closing stock'],
        ['It is calculated using sales at selling price', 'A higher rate means more stock is kept on hand', 'It is expressed as a percentage of sales'],
        { unit: U_FI, topic: 'financial_indicator_calculations', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('2.3', 10,
        ['Formula Sheet: Operating expenses × 100 / Sales; Cost of sales / Average trading stock; Interim dividends × 100 / Number of issued shares.', 'The interim dividend was paid when 1 600 000 shares were in issue (before the repurchase).'],
        ['Use the figures from Information A and B; average the opening and closing trading stock.', 'Give each answer to ONE decimal place; the dividend per share is in cents.'],
        ['% operating expenses on sales = R1 360 950 ÷ R8 240 600 × 100 = 16,5% (17% accepted).', 'Stock turnover rate = R5 060 000 ÷ ½ (R174 000 + R193 000) = R5 060 000 ÷ R183 500 = 27,6 times (28 accepted).', 'Interim dividend per share = R416 000 ÷ (1 200 000 + 400 000) × 100 = 26 cents.']),
    ],
  },
];
