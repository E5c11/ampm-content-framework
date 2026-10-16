'use strict';
// Accounting 2024 Nov P1 — Question 4 (Corporate Governance: the independent external audit) lessons 17–18.
const { mc, ms, mt, ord, fb, ex } = require('./lib');

const U = 'corporate_governance';
const SK = {
  term: 'recall_accounting_term', cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario',
};

module.exports = [
  // ── L17 ── 4.1–4.3 role of the auditor, type of report, audit evidence ─────
  {
    order: 17, name: 'Question 4.1–4.3: The external auditor and the audit report', marks: 8, qpages: 1, mpages: 1,
    covers: 'Questions 4.1 to 4.3 — the role of the independent external auditor, identifying an unqualified audit report from its wording, and the audit evidence used to verify fixed assets.',
    tags: ['audit_report', 'external_auditor_role'],
    qs: [
      mc('What is the main role of an independent external auditor?',
        'To give an opinion on whether the statements are fairly presented', ['To prepare the financial statements for the directors each year', 'To approve the annual budget and all of the spending of the company', 'To decide on the dividends paid to the shareholders'],
        { unit: U, topic: 'audit_reports', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 2, type: 'definition' }),
      mc('An audit report states: "In our opinion the financial statements present fairly, in all material respects, the financial position of the company." Which type of audit report is this?',
        'Unqualified', ['Qualified', 'Disclaimer of opinion', 'Adverse opinion'],
        { unit: U, topic: 'audit_reports', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
      ms('Select ALL the audit evidence an auditor would examine to verify the fixed assets of a company.',
        ['Inspecting the assets listed in the register', 'Checking the depreciation calculations', 'Checking title deeds and registration papers'],
        ['Checking attendance at the last AGM', 'Counting the cash in the petty cash box'],
        { unit: U, topic: 'audit_reports', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      mt('Match each type of audit report to its meaning.',
        [['Unqualified', 'Statements are fairly presented'], ['Qualified', 'Fair, except for specific problems'], ['Disclaimer', 'Auditor could not form an opinion'], ['Adverse', 'Statements are materially misstated']],
        { unit: U, topic: 'audit_reports', subtopic: 'acc_term_recall', skill: SK.term, diff: 3, w: 2, type: 'definition' }),
    ],
    subs: [
      ex('4.1', 2,
        ['The auditor is independent of the directors and reports to the shareholders.'],
        ['Give ONE point about what the auditor provides to the shareholders.'],
        ['The independent auditor gives an unbiased opinion on whether the financial statements are fairly presented, protecting the interests of the shareholders.']),
      ex('4.2', 2,
        ['The extract says the statements "present fairly, in all material respects".', 'The audit evidence was sufficient and appropriate.'],
        ['Choose the report type, then explain the choice from the wording.'],
        ['Unqualified: no material errors or irregularities were found, and the statements fairly present the financial position of the company.']),
      ex('4.3', 4,
        ['Fixed assets are checked against the Fixed Asset Register and source documents.', 'Ownership and depreciation must also be verified.'],
        ['Give TWO kinds of evidence, each with what it proves.'],
        ['Confirm the physical existence of the items in the Fixed Asset Register, and check that depreciation was calculated at the correct rate.', 'Check invoices against the cost price in the register, and title deeds or registration certificates for ownership (any two).']),
    ],
  },

  // ── L18 ── 4.4–4.5 implications and consequences ───────────────────────────
  {
    order: 18, name: 'Question 4.4–4.5: Implications of the audit report and auditor misconduct', marks: 7, qpages: 1, mpages: 1,
    covers: 'Questions 4.4 and 4.5 — what an unqualified audit report means for directors and shareholders, and the consequences for an auditor who deliberately issues an incorrect report.',
    tags: ['audit_report', 'auditor_misconduct'],
    qs: [
      mc('What is ONE implication of an unqualified audit report for the directors?',
        'They are likely to be re-elected by the shareholders', ['They will have to repay their fees to the company', 'They must resign at the next annual general meeting', 'They will be investigated by the CIPC for fraud'],
        { unit: U, topic: 'audit_reports', subtopic: 'acc_scenario_application', skill: SK.app, diff: 2, w: 2, type: 'application' }),
      mc('What is ONE implication of an unqualified audit report for the shareholders?',
        'They can trust that their investment is safe', ['They will receive a higher dividend this year', 'They must appoint a new auditor next year', 'They lose their voting rights at the AGM'],
        { unit: U, topic: 'audit_reports', subtopic: 'acc_scenario_application', skill: SK.app, diff: 2, w: 2, type: 'application' }),
      ms('Under pressure from the directors, an auditor deliberately gave the shareholders an incorrect audit report. Select ALL the possible consequences for the auditor.',
        ['Being deregistered by IRBA', 'Being sued by the shareholders', 'Being fined or imprisoned'],
        ['Being promoted to a director', 'Receiving a bonus from SARS'],
        { unit: U, topic: 'ethics_and_internal_control', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
      mt('Match each party to its role in the audit of a company.',
        [['Shareholders', 'Appoint the auditor at the AGM'], ['Directors', 'Prepare the financial statements'], ['External auditor', 'Gives an independent opinion'], ['IRBA', 'Regulates registered auditors']],
        { unit: U, topic: 'audit_reports', subtopic: 'acc_term_recall', skill: SK.term, diff: 3, w: 2, type: 'definition' }),
    ],
    subs: [
      ex('4.4', 4,
        ['The report identified in 4.2 is unqualified.', 'Give one implication for the directors and one for the shareholders.'],
        ['Think about the directors\' reputation and re-appointment.', 'Think about the shareholders\' confidence in their investment.'],
        ['Directors: they are likely to be re-appointed, and their reputation improves.', 'Shareholders: they can be satisfied that their investment is safe, which encourages further investment.']),
      ex('4.5', 3,
        ['The auditor acted dishonestly under pressure from the directors.', 'Consequences can be professional, legal and for the audit firm.'],
        ['Give THREE consequences; one-word answers are accepted.'],
        ['Deregistered by IRBA or loss of professional licence.', 'Disciplinary hearing, dismissal, a fine or imprisonment.', 'Sued by shareholders for negligence; the audit firm loses clients and reputation.']),
    ],
  },
];
