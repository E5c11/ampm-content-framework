'use strict';
// Accounting 2024 Nov P2 — Question 1 (Debtors' reconciliation, age analysis and VAT) lessons 1–5. Fresh numbers; every figure computed and asserted.
const assert = require('assert');
const { mc, ms, mt, fb, ex, fmt, blank } = require('./lib');

const LN = (t, ...c) => ({ k: 'line', c: [t, ...c] });
const TOT = (t, ...c) => ({ k: 'total', c: [t, ...c] });

const U = 'reconciliations';
const UV = 'vat_and_salaries';
const SK = { stmt: 'complete_financial_statement', calc: 'calculate_accounting_amount', term: 'recall_accounting_term', cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario', int: 'interpret_financial_indicators' };

// L1: VAT on a bad debt written off
assert.strictEqual(4600 * 15 / 115, 600);
// L2: Debtors' Control — (i) unrecorded invoice +3 800, (iii) allowances column overcast +6 000, (v) sale R6 800 recorded as R8 600 −1 800
const ctlOpen = 284600, e1 = 3800, e3 = 6000, e5 = 6800 - 8600;
const ctl = ctlOpen + e1 + e3 + e5;
assert.strictEqual(e5, -1800); assert.strictEqual(ctl, 292600);
assert.strictEqual(150000 + 2400 - 900, 151500);
// L3: Debtors' List — must agree with the corrected control balance
const before = { Mokoena: 48000, Botha: 72500, Pillay: 96000, Dlamini: 70100, Fourie: 9200 };
const after = {
  Mokoena: before.Mokoena + 3800,                 // (i) invoice not recorded
  Botha: before.Botha + 12000,                    // (ii) sale posted to Pillay instead
  Pillay: before.Pillay - 12000 + (6800 - 8600),  // (ii) and (v)
  Dlamini: before.Dlamini - 2150 * 2,             // (vi) returns on the wrong side
  Fourie: before.Fourie + 3400 - 4300,            // (iv) EFT R4 300 posted as R3 400
};
const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
assert.strictEqual(sum(before), 295800); assert.strictEqual(sum(after), ctl);
assert.deepStrictEqual(after, { Mokoena: 51800, Botha: 84500, Pillay: 82200, Dlamini: 65800, Fourie: 8300 });
assert.strictEqual(12400 - 1150 * 2, 10100);
// L4: age analysis (30-day terms, current + 30 days are within terms)
const age = [81000, 63000, 21600, 9000, 5400];
assert.strictEqual(age.reduce((a, b) => a + b, 0), 180000); assert.strictEqual((81000 + 63000) / 180000 * 100, 80);
assert.strictEqual((25000 + 20000) / 250000 * 100, 18); assert.strictEqual(120000 + 50000 + 35000 + 25000 + 20000, 250000);
// L5: VAT
const vA = 6900 * 15 / 115, vB = (84000 - 6000) * 15 / 100, vC = 13800 * 80 / 100 * 15 / 115;
assert.strictEqual(vA, 900); assert.strictEqual(vB, 11700); assert.ok(Math.abs(vC - 1440) < 1e-9);
assert.strictEqual(2400 * 15 / 100, 360); assert.strictEqual((46000 - 12000) * 15 / 100, 5100);

module.exports = [
  // ── L01 ── 1.1 recording debtors' EFTs and VAT concepts ────────────────────
  {
    order: 1, name: 'Question 1.1: Recording debtors\' EFTs and VAT concepts', marks: 3, qp: '4', mp: '2', qpages: 1, mpages: 1,
    covers: 'Question 1.1 — true/false items on recording EFTs from debtors, the nature of output VAT and VAT on bad debts.',
    tags: ['vat_payable', 'internal_control_cash'],
    qs: [
      mc('When should an EFT payment received from a debtor be recorded in the Cash Receipts Journal?',
        'Once there is proof of payment or a bank statement entry', ['As soon as the debtor phones to say it was paid', 'When the debtor\'s next monthly statement is sent', 'At month-end, together with all the other EFT receipts'],
        { unit: U, topic: 'cash_journal_adjustments', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 1, type: 'definition' }),
      mc('How is output VAT classified in the books of a VAT vendor?',
        'As a liability, because it is owed to SARS', ['As an asset, because it is claimed from SARS', 'As income, because it is earned on sales', 'As an expense, because it raises selling prices'],
        { unit: UV, topic: 'vat_calculations', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 1, type: 'definition' }),
      fb('A debtor who owes R4 600 (including 15% VAT) is written off as irrecoverable. Calculate the amount by which the VAT payable to SARS decreases.',
        ['Decrease = R ', '[ ]'], ['600'], 'standard_math',
        { unit: UV, topic: 'vat_calculations', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc',
          clues: '- The amount written off already includes VAT.\n- The VAT part of a VAT-inclusive amount is 15/115 of it.' }),
      ms('Select ALL the transactions that INCREASE the VAT payable to SARS.',
        ['Goods sold on credit at the standard rate', 'Discount received from a creditor', 'Stock taken by the owner for own use'],
        ['Goods returned by a debtor for a credit note', 'Bad debts written off on a debtor\'s account'],
        { unit: UV, topic: 'vat_calculations', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.1.1', 1, ['An EFT from a debtor is only certain once the money has reached the bank.', 'Recording it earlier risks recording money that never arrived.'],
        ['Decide whether the statement describes good internal control over cash.'], ['True: record the EFT only after proof of payment or the bank statement entry is received.']),
      ex('1.1.2', 1, ['Output VAT is charged on sales and collected on behalf of SARS.', 'Money owed to someone else is a liability.'],
        ['Ask who the VAT belongs to.'], ['False: output VAT is a liability (owed to SARS), not an asset.']),
      ex('1.1.3', 1, ['Output VAT was paid over on the original sale.', 'When the debt is written off, that VAT can be claimed back.'],
        ['Decide whether SARS owes the business, or the business owes SARS, on a bad debt.'], ['True: VAT on bad debts reduces the VAT payable to SARS.']),
    ],
  },

  // ── L02 ── 1.2.1 Debtors' Control account ──────────────────────────────────
  {
    order: 2, name: 'Question 1.2.1: Correct balance of the Debtors\' Control account', marks: 5, qp: '4', mp: '2', qpages: 1, mpages: 1,
    covers: 'Question 1.2.1 — the effect of each error and omission on the Debtors\' Control account, and its correct balance.',
    tags: ['debtors_control_account', 'debtors_reconciliation'],
    info: [
      'Debtors\' Control balance before corrections: R284 600.',
      '(i) No entry was made for a credit sale invoice to P Mokoena, R3 800.',
      '(ii) A credit sale to T Botha, R12 000, was posted to R Pillay\'s account.',
      '(iii) The debtors\' allowances column in the Debtors\' Allowances Journal was overcast by R6 000.',
      '(iv) An EFT of R4 300 from L Fourie was recorded correctly in the journal but posted as R3 400 to his account.',
      '(v) A credit sale to R Pillay, R6 800, was recorded as R8 600 in the Debtors\' Journal and posted from there.',
      '(vi) Goods returned by K Dlamini, R2 150, were posted to the wrong side of his account.',
      'Show a decrease as a negative number.',
    ],
    figs: [{
      title: 'Debtors\' Control: Lindiwe Traders', subtitle: 'on 31 July 2026', cols: ['', 'R'],
      rows: [
        LN('Balance before corrections', fmt(ctlOpen)),
        LN('(i)', '+' + fmt(e1)),
        LN('(ii)', '0'),
        LN('(iii)', blank('A')),
        LN('(iv)', '0'),
        LN('(v)', blank('B')),
        LN('(vi)', '0'),
        TOT('Correct balance', blank('C')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], [String(e3), String(e5), String(ctl)], 'standard_math',
        { fig: 0, unit: U, topic: 'debtors_reconciliation', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- An overcast allowances total took too much off the control account.\n- Errors made only in the Debtors\' Ledger do not change the control account.' }),
      fb('The Debtors\' Control balance is R150 000. The Debtors\' Journal was undercast by R2 400, and a credit note of R900 was never recorded. Calculate the correct balance.',
        ['Correct balance = R ', '[ ]'], ['151500'], 'standard_math',
        { unit: U, topic: 'debtors_reconciliation', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      mc('A credit sale was posted to the wrong debtor\'s account in the Debtors\' Ledger. What is the effect on the Debtors\' Control account?',
        'No effect; only the two debtors\' accounts change', ['It increases by the amount of the credit sale', 'It decreases by the amount of the credit sale', 'It increases by twice the amount of the sale'],
        { unit: U, topic: 'debtors_reconciliation', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the errors that change the balance of the Debtors\' Control account.',
        ['An invoice that was never entered in the Debtors\' Journal', 'An undercast total in the Debtors\' Allowances Journal'],
        ['A receipt posted at the wrong amount in the Debtors\' Ledger', 'An allowance posted to the wrong side of a debtor\'s account', 'A sale posted to the account of the wrong debtor'],
        { unit: U, topic: 'debtors_reconciliation', subtopic: 'acc_classification', skill: SK.cls, diff: 4, w: 2, type: 'application' }),
    ],
    subs: [ex('1.2.1', 5,
      ['Only errors in the journals or in the General Ledger change the control account.', 'Errors made only in individual debtors\' accounts leave it unchanged (0).'],
      ['Give each item a + or − sign, or 0 if there is no change.', 'Add the corrections to the balance before errors and omissions.'],
      ['R359 100 + R4 500 (i) − R11 000 (iii) + R2 700 (v: R5 200 − R2 500); items (ii), (iv) and (vi) are 0.',
        'Correct balance of the Debtors\' Control account = R355 300.'])],
  },

  // ── L03 ── 1.2.2 Debtors' List ─────────────────────────────────────────────
  {
    order: 3, figVer: 2, name: 'Question 1.2.2: Correcting the Debtors\' List', marks: 14, qp: '4', mp: '2', qpages: 1, mpages: 1,
    covers: 'Question 1.2.2 — correcting each debtor\'s balance in the Debtors\' List so that its total agrees with the Debtors\' Control account.',
    tags: ['debtors_list', 'debtors_reconciliation'],
    info: [
      '(i) No entry was made for a credit sale invoice to P Mokoena, R3 800. (iii) An allowances column was overcast (control account only).',
      '(ii) The R12 000 sale to T Botha was posted to R Pillay. (v) Pillay\'s sale of R6 800 was recorded as R8 600.',
      '(iv) L Fourie paid R4 300 by EFT; it was posted as R3 400 to his account.',
      '(vi) K Dlamini returned goods of R2 150; this was posted to the wrong side of his account.',
      'The corrected total must agree with the corrected Debtors\' Control balance, R292 600.',
    ],
    figs: [{
      title: 'Debtors\' List: Lindiwe Traders', subtitle: 'on 31 July 2026', cols: ['', 'Before', 'Correct'],
      rows: [
        LN('P Mokoena', fmt(before.Mokoena), fmt(after.Mokoena)),
        LN('T Botha', fmt(before.Botha), fmt(after.Botha)),
        LN('R Pillay', fmt(before.Pillay), blank('A')),
        LN('K Dlamini', fmt(before.Dlamini), blank('B')),
        LN('L Fourie', fmt(before.Fourie), blank('C')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the correct balances A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], [String(after.Pillay), String(after.Dlamini), String(after.Fourie)], 'standard_math',
        { fig: 0, unit: U, topic: 'debtors_reconciliation', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 5, w: 3, type: 'calc',
          clues: '- Pillay is affected by two errors.\n- A posting on the wrong side must be reversed and then posted correctly.\n- Fourie was credited with too little.' }),
      fb('A debtor\'s account shows a balance of R12 400. Goods returned of R1 150 were debited to the account instead of credited. Calculate the correct balance.',
        ['Correct balance = R ', '[ ]'], ['10100'], 'standard_math',
        { unit: U, topic: 'debtors_reconciliation', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc',
          clues: '- The wrong debit must be cancelled and the correct credit made.' }),
      mt('Match each error in a debtor\'s account to its correction.',
        [['Returns of R500 posted on the wrong side', 'Decrease by R1 000'], ['Invoice of R500 not posted', 'Increase by R500'], ['Receipt of R500 posted as R50', 'Decrease by R450'], ['Receipt of R300 posted twice', 'Increase by R300']],
        { unit: U, topic: 'debtors_reconciliation', subtopic: 'acc_classification', skill: SK.cls, diff: 4, w: 2, type: 'application' }),
      mc('A credit sale of R9 000 to debtor J was posted to the account of debtor K. How is the Debtors\' List corrected?',
        'Add R9 000 to J and deduct R9 000 from K', ['Add R9 000 to K and deduct R9 000 from J', 'Add R18 000 to J and deduct R9 000 from K', 'Add R9 000 to J and leave K\'s balance as it is'],
        { unit: U, topic: 'debtors_reconciliation', subtopic: 'acc_scenario_application', skill: SK.app, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [ex('1.2.2', 14,
      ['Only errors in the Debtors\' Ledger change individual balances.', 'The corrected total must agree with the corrected control balance.'],
      ['Work through each debtor and apply every error that touches that account.', 'Add the corrected balances and compare with 1.2.1.'],
      ['N Naidoo R63 000 + R4 500 = R67 500; S Sibiya R69 000 + R18 000 = R87 000.',
        'V Esterhuizen R114 000 − R18 000 + R2 700 = R98 700; J Nyoka R95 700 − R6 900 (R3 450 × 2) = R88 800.',
        'W du Plessis R11 500 + R7 500 − R5 700 = R13 300.',
        'Correct total of the Debtors\' List = R355 300 (agrees with the control account).'])],
  },

  // ── L04 ── 1.3 Debtors' age analysis ───────────────────────────────────────
  {
    order: 4, name: 'Question 1.3: Debtors\' age analysis', marks: 8, qp: '5', mp: '3', qpages: 1, mpages: 1,
    covers: 'Question 1.3 — using the age analysis to test the 90% target for credit terms, and advice to improve collection from debtors.',
    tags: ['debtors_age_analysis', 'credit_control'],
    info: [
      'Credit terms are 30 days. At least 90% of debtors are expected to keep to the terms.',
      'Accounts in the Current and 30-days columns are within the terms.',
      'Maximum discount is already given for early payment, and interest is already charged on overdue accounts.',
    ],
    figs: [{
      title: 'Debtors\' Age Analysis: Kgosi Traders', subtitle: 'on 31 July 2026', cols: ['', 'R'],
      rows: [
        LN('Current month', fmt(age[0])),
        LN('30 days', fmt(age[1])),
        LN('60 days', fmt(age[2])),
        LN('90 days', fmt(age[3])),
        LN('More than 90 days', fmt(age[4])),
        TOT('Total', fmt(180000)),
      ],
    }],
    qs: [
      fb('Use the age analysis in the figure. Calculate the percentage of debtors\' balances that are within the credit terms.',
        ['Within terms = ', '[ ]', ' %'], ['80'], 'standard_math',
        { fig: 0, unit: U, topic: 'debtors_age_analysis', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 3, type: 'calc',
          clues: '- Add the columns that are within 30 days.\n- Divide by the total and multiply by 100.' }),
      fb('A business allows 60 days\' credit. Its age analysis shows: total R250 000; current R120 000; 30 days R50 000; 60 days R35 000; 90 days R25 000; more than 90 days R20 000. Calculate the percentage of balances that are NOT within the terms.',
        ['Outside terms = ', '[ ]', ' %'], ['18'], 'standard_math',
        { unit: U, topic: 'debtors_age_analysis', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      ms('Discounts and interest are already used. Select the TWO pieces of advice that will improve the collection from debtors.',
        ['Send automated reminders before accounts fall due', 'Check credit history before granting credit'],
        ['Offer bigger discounts for paying early', 'Charge a higher interest rate on late accounts', 'Extend the credit terms from 30 to 60 days'],
        { unit: U, topic: 'debtors_age_analysis', subtopic: 'acc_scenario_application', skill: SK.app, diff: 3, w: 2, type: 'application' }),
      mc('Which action is most suitable for debtors whose accounts are more than 90 days overdue?',
        'Hand the accounts over to a debt collector', ['Raise their credit limits to keep their custom', 'Allow them a further 60 days to settle in full', 'Offer them a further discount on new purchases'],
        { unit: U, topic: 'debtors_age_analysis', subtopic: 'acc_scenario_application', skill: SK.app, diff: 2, w: 2, type: 'application' }),
    ],
    subs: [
      ex('1.3.1', 4, ['Credit terms are 60 days, so Current, 30 days and 60 days are within the terms.', 'The target is at least 90% within the terms.'],
        ['Add the balances within the terms and express them as a percentage of the total.', 'Compare the result with the 90% target.'],
        ['(R118 000 + R36 000 + R38 000) ÷ R240 000 × 100 = 80%, which is 10% below the 90% target.',
          'OR (R29 200 + R18 800) ÷ R240 000 × 100 = 20% of debtors are outside the terms.']),
      ex('1.3.2', 4, ['Discounts and interest are already in place, so they are not accepted as advice.'],
        ['Give two different, practical credit-control measures.'],
        ['Any two: debit orders; automated SMS/e-mail reminders; screening and credit checks before granting credit; lowering credit limits of slow payers; payment plans; suspending accounts; handing over to debt collectors.']),
    ],
  },

  // ── L05 ── 1.4 VAT ─────────────────────────────────────────────────────────
  {
    order: 5, figVer: 2, name: 'Question 1.4: VAT amounts and their effect on VAT payable', marks: 10, qp: '5', mp: '3', qpages: 1, mpages: 1,
    covers: 'Question 1.4 — calculating the VAT amount on a discount received, credit sales with zero-rated items and an incorrect supplier invoice, and the effect on the amount payable to SARS.',
    tags: ['vat_payable', 'vat_calculation'],
    info: [
      'VAT is 15%. Some items are zero-rated.',
      'Example: the owner took stock for own use, cost price R2 400 (excluding VAT).',
      'A: Discount received of R6 900 when settling a supplier\'s account.',
      'B: Credit sales of R84 000 (excluding VAT), which include zero-rated items of R6 000.',
      'C: An invoice for goods bought on credit totalled R13 800 (VAT inclusive). A trade discount of 20% was left off the invoice.',
    ],
    figs: [{
      title: 'VAT analysis: Musa Stores', subtitle: 'VAT period ended 31 July 2026', cols: ['', 'VAT (R)'],
      rows: [
        LN('Example: stock taken by the owner', fmt(360)),
        LN('A: Discount received', blank('A')),
        LN('B: Credit sales', blank('B')),
        LN('C: Corrected supplier invoice', blank('C')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the VAT amounts A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], [String(vA), String(vB), '1440'], 'standard_math',
        { fig: 0, unit: UV, topic: 'vat_calculations', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- A VAT-inclusive amount uses 15/115; a VAT-exclusive amount uses 15/100.\n- Zero-rated items carry no VAT.\n- Apply the trade discount before working out the VAT.' }),
      mc('What is the effect of a discount received from a supplier on the VAT payable to SARS?',
        'It increases, as input VAT claimed is now less', ['It decreases, as the cost of purchases is lower', 'It decreases, as the business saves on the invoice', 'It has no effect, as the supplier was already paid'],
        { unit: UV, topic: 'vat_calculations', subtopic: 'acc_classification', skill: SK.cls, diff: 4, w: 2, type: 'application' }),
      ms('Select ALL the transactions that DECREASE the VAT payable to SARS.',
        ['Bad debts written off', 'Goods returned by debtors', 'Credit purchases of trading stock'],
        ['Stock taken by the owner for own use', 'Discount received from a creditor'],
        { unit: UV, topic: 'vat_calculations', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      fb('Credit sales of R46 000 (excluding VAT) include zero-rated goods of R12 000. Calculate the output VAT on these sales.',
        ['Output VAT = R ', '[ ]'], ['5100'], 'standard_math',
        { unit: UV, topic: 'vat_calculations', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
    ],
    subs: [ex('1.4', 10,
      ['Use 15/115 for VAT-inclusive amounts and 15/100 for VAT-exclusive amounts.', 'Zero-rated sales carry no VAT; a trade discount reduces the invoice before VAT.'],
      ['Calculate the VAT on each transaction.', 'Decide whether it increases (output VAT, or less input VAT) or decreases (input VAT) the amount payable to SARS.'],
      ['A: R17 250 × 15/115 = R2 250, increase.',
        'B: (R139 200 − R9 200) × 15/100 = R19 500, increase.',
        'C: R23 000 × 90/100 × 15/115 = R2 700, decrease.'])],
  },
];
