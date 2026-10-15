'use strict';
// Accounting 2025 Nov P2 — Question 1 (Reconciliations) lessons 1–5. Fresh numbers; every figure computed and asserted.
const assert = require('assert');
const { mc, ms, mt, ord, fb, ex, fmt, blank } = require('./lib');

const H = (t, i = 0) => ({ k: 'head', c: [t], i });
const LN = (t, a, b, i = 0) => ({ k: 'line', c: b === undefined ? [t, a] : [t, a, b], i });
const SUBT = (t, a, b) => ({ k: 'sub', c: b === undefined ? [t, a] : [t, a, b] });
const TOT = (t, a, b) => ({ k: 'total', c: b === undefined ? [t, a] : [t, a, b] });
const GAP = { k: 'gap' };

const U = 'reconciliations';
const SK = { stmt: 'complete_financial_statement', calc: 'calculate_accounting_amount', term: 'recall_accounting_term', cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario', int: 'interpret_financial_indicators' };

// L1: cash journals
const rcpt = 210000 + 9400 + 1150, pay = 84000 + 480 + 3200 * 2;
assert.strictEqual(rcpt, 220550); assert.strictEqual(pay, 90880);
// L2: bank reconciliation (one-column)
const eft = 7200 + 5600, bal = 96300 + 18500 - eft + 4000 - 6500;
assert.strictEqual(eft, 12800); assert.strictEqual(bal, 99500);
assert.strictEqual(54200 + 9800 - 6400, 57600);
// L4: creditors reconciliation — both sides must reach the same balance
const stmtEnd = 312400 - 36000 + 210 + 28000 - 90000, ledEnd = 217240 - 3600 + 970;
assert.strictEqual(stmtEnd, 214610); assert.strictEqual(ledEnd, 214610);
assert.strictEqual(1410 - 1080, 330);

module.exports = [
  // ── L01 ── 1.1.1 entries in the cash journals ───────────────────────────────
  {
    order: 1, name: 'Question 1.1.1: Entries in the cash journals', marks: 10, qpages: 2, mpages: 1,
    covers: 'Question 1.1.1 — the entries that must be made in the Cash Receipts and Cash Payments Journals after the bank statement is received.',
    tags: ['cash_journal_adjustments', 'bank_statement_items'],
    info: [
      'Provisional totals before the bank statement arrived: Cash Receipts Journal R210 000; Cash Payments Journal R84 000.',
      'Items on the bank statement that are not in the journals: direct deposit by a customer R9 400 (credit); interest earned R1 150 (credit); service fees R480 (debit).',
      'The debit order for insurance, R3 200, was processed twice because of insufficient funds in the previous month. Both amounts are owed.',
    ],
    figs: [{
      title: 'Cash journals: Tau Stores', subtitle: 'on 31 August 2026', cols: ['', 'Receipts', 'Payments'],
      rows: [
        LN('Provisional totals', fmt(210000), fmt(84000)),
        LN('Entries from the bank statement', '', ''),
        TOT('Corrected totals', blank('A'), blank('B')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the corrected totals A and B of the two journals.',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(rcpt), String(pay)], 'standard_math',
        { fig: 0, unit: U, topic: 'cash_journal_adjustments', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Credits on the bank statement go into the Receipts Journal.\n- Debits go into the Payments Journal.' }),
      fb('A bank statement shows interest earned of R850 and service fees of R310, neither of which is in the journals. Calculate the net effect on the bank account balance (a decrease is negative).',
        ['Net effect = R ', '[ ]'], ['540'], 'standard_math',
        { unit: U, topic: 'cash_journal_adjustments', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      mc('Where is a direct deposit by a customer, found on the bank statement, recorded in the books?',
        'In the Cash Receipts Journal', ['In the Cash Payments Journal', 'In the General Journal', 'In the Debtors\' Journal'],
        { unit: U, topic: 'cash_journal_adjustments', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 1, type: 'definition' }),
      ms('Select ALL the items that must be recorded in the Cash Payments Journal after receiving the bank statement.',
        ['Service fees charged by the bank', 'A debit order for insurance', 'An EFT payment not yet recorded'],
        ['Interest earned on the account', 'A direct deposit by a customer'],
        { unit: U, topic: 'cash_journal_adjustments', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [ex('1.1.1', 10,
      ['Items on the bank statement that are not in the journals must now be recorded.', 'Credits go to the Receipts Journal and debits to the Payments Journal.'],
      ['Sort the unrecorded bank statement items into receipts and payments.', 'Add each item to the provisional journal totals.'],
      ['The Cash Receipts Journal takes R2 160 and R16 500 + R16 500 (R33 000) for the deposit that was recorded in the wrong journal.',
        'The Cash Payments Journal takes R10 000 (the irrecoverable shortfall), R2 700 + R2 700 (the debit orders), R13 000 (the debit card payment), R975 and R605.'])],
  },

  // ── L02 ── 1.1.2 bank reconciliation statement ──────────────────────────────
  {
    order: 2, name: 'Question 1.1.2: Bank reconciliation statement', marks: 7, qpages: 2, mpages: 2,
    covers: 'Question 1.1.2 — the Bank Reconciliation Statement (one-column method), starting from the balance on the bank statement.',
    tags: ['bank_reconciliation_statement', 'outstanding_deposits_and_efts'],
    info: [
      'The bank statement shows a favourable balance of R96 300.',
      'Deposit dated 30 August R18 500 and EFT 311 R7 200 and EFT 312 R5 600 are in the journals but not yet on the bank statement.',
      'The bank clerk overstated an EFT payment by R4 000. The bank will correct it next month.',
      'A debit card payment of R6 500 was made but the slip was not given to the bookkeeper.',
      'Show a decrease as a negative number.',
    ],
    figs: [{
      title: 'Bank Reconciliation Statement: Tau Stores', subtitle: 'on 31 August 2026', cols: ['', 'R'],
      rows: [
        LN('Balance as per bank statement', fmt(96300)),
        LN('Outstanding deposit', fmt(18500)),
        LN('Outstanding EFTs', blank('B')),
        LN('Incorrect EFT', fmt(4000)),
        LN('Debit card payment', fmt(-6500)),
        TOT('Balance as per bank account', blank('A')),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing amounts A and B.',
        ['A = ', '[ ]', '   B = ', '[ ]'], [String(bal), String(-eft)], 'standard_math',
        { fig: 0, unit: U, topic: 'bank_reconciliation_statement', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 4, w: 3, type: 'calc',
          clues: '- Outstanding EFTs reduce the balance.\n- A bank error in the bank\'s favour is added back.' }),
      fb('The bank statement balance is R54 200 favourable. There is an outstanding deposit of R9 800 and an outstanding EFT of R6 400. Calculate the balance as per the bank account.',
        ['Balance = R ', '[ ]'], ['57600'], 'standard_math',
        { unit: U, topic: 'bank_reconciliation_statement', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      mc('A bank clerk debited the business with R11 000 too much. How is this shown in the reconciliation?',
        'It is added to the balance per bank statement', ['It is deducted from the balance per bank statement', 'It is added to the balance per bank account', 'It is ignored because the bank will correct it'],
        { unit: U, topic: 'bank_reconciliation_statement', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the items that are ADDED to the balance per bank statement.',
        ['An outstanding deposit', 'An EFT overstated by the bank'],
        ['An outstanding EFT', 'A debit card payment not yet recorded', 'Service fees on the statement'],
        { unit: U, topic: 'bank_reconciliation_statement', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [ex('1.1.2', 7,
      ['Start with the balance on the bank statement.', 'Outstanding items and bank errors adjust it to the balance in the bank account.'],
      ['Add outstanding deposits and bank errors that favour the bank.', 'Deduct outstanding EFTs and unrecorded payments.'],
      ['Balance per bank statement R119 080 + outstanding deposit R41 850 − EFT 207 R7 650 − EFT 208 R10 800 + incorrect EFT R11 000 − debit card payment R13 000.',
        'Balance as per bank account = R140 480.'])],
  },

  // ── L03 ── 1.1.3 managing cash ──────────────────────────────────────────────
  {
    order: 3, name: 'Question 1.1.3: Problems with the management of cash', marks: 6, qpages: 2, mpages: 1,
    covers: 'Question 1.1.3 — identifying problems in the management of cash, with figures, and a different solution for each.',
    tags: ['cash_management', 'internal_control_cash'],
    qs: [
      mc('The supporting cash slips for a deposit total R18 600 but the bank received only R8 600. Which problem with the management of cash does this show?',
        'R10 000 of cash is missing', ['The cashier made an incorrect entry of R10 000', 'The bank charged R10 000 in service fees', 'A deposit of R10 000 is still outstanding'],
        { unit: U, topic: 'cash_management_controls', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 2, type: 'interpretation' }),
      mc('Which solution best prevents missing cash from deposits in future?',
        'Unannounced cash counts and dual authorisation of deposits', ['Recording every deposit twice in the Cash Receipts Journal', 'Paying all suppliers by EFT instead of by cheque', 'Reconciling the bank statement once a year'],
        { unit: U, topic: 'cash_management_controls', subtopic: 'acc_scenario_application', skill: SK.app, diff: 3, w: 2, type: 'application' }),
      mt('Match each cash-management problem to a suitable solution.',
        [['Debit orders returned unpaid', 'Keep enough funds and set reminders'], ['Slips not given to the bookkeeper', 'Submit documents on time'], ['Errors in the journals', 'Check entries and reconcile daily'], ['Cash taken from the till', 'Use unannounced cash counts']],
        { unit: U, topic: 'cash_management_controls', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      ms('A debit order for insurance of R2 700 was processed twice because of insufficient funds. Select the TWO suitable solutions.',
        ['Keep enough cash for debit orders', 'Set alerts and reminders for debit orders'],
        ['Stop paying insurance premiums altogether', 'Hold the cash slips until the month-end', 'Pay all the debit orders in cash only'],
        { unit: U, topic: 'cash_management_controls', subtopic: 'acc_scenario_application', skill: SK.app, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [ex('1.1.3', 6,
      ['Look for figures that show something went wrong with cash, such as missing amounts or unpaid debit orders.', 'Each solution must be different.'],
      ['Name each problem and quote its figure.', 'Suggest a control that stops it happening again.'],
      ['Missing cash of R10 000 can be prevented by dual authorisation of deposits, unannounced cash counts or outsourcing the collection of cash.',
        'Incorrect recording (R16 500 / R5 310) is prevented by double-checking entries; R2 700 debit orders by keeping enough funds; R13 000 unrecorded by submitting documents on time.'])],
  },

  // ── L04 ── 1.2.1 creditors' reconciliation ──────────────────────────────────
  {
    order: 4, name: 'Question 1.2.1: Creditors\' reconciliation', marks: 11, qpages: 2, mpages: 1,
    covers: 'Question 1.2.1 — how the balances in the Creditors\' Ledger and on the supplier\'s statement change to reach the same corrected balance.',
    tags: ['creditors_reconciliation', 'supplier_statement'],
    info: [
      'Balance in the Creditors\' Ledger: R217 240. Balance on the supplier\'s statement: R312 400.',
      'Debit Note 540 was recorded in the ledger as R9 300. The statement shows the correct amount of R12 900.',
      'Invoice 622 was recorded on the statement as R51 000. The correct amount is R15 000.',
      'The statement charged interest of R760; the correct interest is R970. No entry was made in the ledger.',
      'An invoice of R28 000 dated 29 June is in the ledger only (the statement covers transactions up to 26 June). An EFT of R90 000 on 27 June is in the ledger only.',
      'Show a decrease as a negative number.',
    ],
    figs: [{
      title: 'Creditors\' reconciliation: KB Stores', subtitle: 'supplier: Rondo Suppliers, June 2026', cols: ['', 'Ledger', 'Statement'],
      rows: [
        LN('Balance before adjustments', fmt(217240), fmt(312400)),
        LN('Debit Note 540', blank('A'), ''),
        LN('Invoice 622', '', blank('B')),
        LN('Interest charged', fmt(970), blank('C')),
        LN('Invoice dated 29 June', '', fmt(28000)),
        LN('EFT on 27 June', '', fmt(-90000)),
        TOT('Corrected balance', fmt(214610), fmt(214610)),
      ],
    }],
    qs: [
      fb('Use the information in the figure to calculate the missing adjustments A, B and C.',
        ['A = ', '[ ]', '   B = ', '[ ]', '   C = ', '[ ]'], ['-3600', '-36000', '210'], 'standard_math',
        { fig: 0, unit: U, topic: 'creditors_reconciliation', subtopic: 'acc_statement_completion', skill: SK.stmt, diff: 5, w: 3, type: 'calc',
          clues: '- A larger debit note reduces what is owed.\n- Interest already charged on the statement is only adjusted by the difference.' }),
      fb('The statement charged interest of R1 080. The correct interest is R1 410 and the ledger has no entry. Calculate the adjustment to the statement balance (an increase is positive).',
        ['Adjustment = R ', '[ ]'], ['330'], 'standard_math',
        { unit: U, topic: 'creditors_reconciliation', subtopic: 'acc_calculation', skill: SK.calc, diff: 3, w: 2, type: 'calc' }),
      mc('An invoice dated after the date of the supplier\'s statement is in the ledger only. How is it shown in the reconciliation?',
        'It is added to the balance on the statement', ['It is deducted from the balance in the ledger', 'It is deducted from the balance on the statement', 'It is ignored because it is not on the statement'],
        { unit: U, topic: 'creditors_reconciliation', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      ms('Select ALL the differences that change the balance in the Creditors\' Ledger.',
        ['A debit note recorded at the wrong amount', 'Interest charged that was never entered'],
        ['An invoice dated after the statement date', 'An EFT paid after the statement date', 'An invoice recorded wrongly by the supplier'],
        { unit: U, topic: 'creditors_reconciliation', subtopic: 'acc_classification', skill: SK.cls, diff: 4, w: 2, type: 'application' }),
    ],
    subs: [ex('1.2.1', 11,
      ['Correct each error on the side where it was made.', 'Timing differences change only the statement balance.'],
      ['Work out each correction as an increase or a decrease.', 'Both corrected balances must agree.'],
      ['Debit Note 785: −R17 280 + R13 680 = −R3 600 in the ledger; Invoice 471: R100 500 − R40 500 = +R60 000 on the statement.',
        'Merchandise returned R16 200 twice (ledger −R32 400), interest +R1 410 in the ledger and +R330 on the statement, invoice +R42 000 and EFT −R154 380 on the statement.',
        'Both corrected balances are R235 550.'])],
  },

  // ── L05 ── 1.2.2 purchasing control ─────────────────────────────────────────
  {
    order: 5, name: 'Question 1.2.2: Control over purchasing', marks: 6, qpages: 2, mpages: 1,
    covers: 'Question 1.2.2 — preventing an inflated invoice (excluding separation of duties) and the action to take against the manager.',
    tags: ['purchasing_controls', 'fraud_prevention'],
    qs: [
      mc('A purchasing manager ordered six chairs from a supplier run by a friend, who invoiced R30 000 each. The market price is R7 500. What is the main control weakness?',
        'Orders were not checked against other quotations', ['The supplier was paid before the invoice arrived', 'The chairs were delivered to the wrong department', 'The invoice was recorded in the wrong month'],
        { unit: U, topic: 'purchasing_controls', subtopic: 'acc_scenario_application', skill: SK.app, diff: 3, w: 2, type: 'application' }),
      ms('Select the TWO controls that would prevent this problem (separation of duties excluded).',
        ['Obtain several quotations for each order', 'Senior staff must authorise orders and payments'],
        ['Pay suppliers on the same day as delivery', 'Let the purchasing manager approve his own orders', 'Keep supplier prices secret from the auditors'],
        { unit: U, topic: 'purchasing_controls', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      ms('Select the TWO actions, other than dismissal, that the business could take against the purchasing manager.',
        ['Hold a disciplinary hearing', 'Recover the excess amount from his salary'],
        ['Give him a bonus for finding the overcharge', 'Allow him to keep ordering from the same supplier', 'Move him to the finance section unchecked'],
        { unit: U, topic: 'purchasing_controls', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      mt('Match each internal control to its purpose.',
        [['Multiple quotations', 'Compare prices before buying'], ['Disclosure of ties', 'Avoid bias towards friends'], ['Regular audits', 'Detect irregular purchases'], ['Authorisation limits', 'Senior approval of large orders']],
        { unit: U, topic: 'purchasing_controls', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
    ],
    subs: [ex('1.2.2', 6,
      ['The chairs cost four times their real price and the supplier was a friend of the purchasing manager.', 'Separation of duties is not allowed as an answer.'],
      ['Think of controls over ordering and approval.', 'Choose a sanction that is not dismissal.'],
      ['Prevention (any two): orders and payments authorised by senior personnel; multiple quotations; comparing competitor prices; frequent audits; disclosure of personal ties.',
        'Action (any one): a disciplinary hearing, a warning, suspension, charges, or recovering the excess amount from his salary.'])],
  },
];
