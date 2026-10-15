'use strict';
// Accounting 2025 Nov P1 — Question 4 (Corporate Governance) lessons 18–19.
const assert = require('assert');
const { mc, ms, mt, ord, fb, ex } = require('./lib');

const U = 'corporate_governance';
const SK = {
  calc: 'calculate_accounting_amount', term: 'recall_accounting_term', cls: 'classify_accounting_concept', app: 'apply_accounting_concept_to_scenario',
  int: 'interpret_financial_indicators',
};

assert.strictEqual(20 * 0.75, 15);

module.exports = [
  // ── L18 ── 4.1 donations, 4.2 reporting unethical behaviour ─────────────────
  {
    order: 18, name: 'Question 4.1–4.2: Donations and ethical behaviour', marks: 6, qpages: 2, mpages: 2,
    covers: 'Questions 4.1 and 4.2 — why corporate donations are important, why employees should report unethical behaviour, and actions to prevent it.',
    tags: ['corporate_donations', 'ethics_and_whistle_blowing'],
    qs: [
      mc('Some shareholders do not want the company to donate to community projects. Which point best explains why donations are important to the company?',
        'It builds a good image and community goodwill', ['It increases the directors\' bonuses in the same year', 'It reduces the number of shares in issue', 'It guarantees a higher dividend for shareholders'],
        { unit: U, topic: 'corporate_social_responsibility', subtopic: 'acc_scenario_application', skill: SK.app, diff: 3, w: 2, type: 'application' }),
      ms('Select the TWO reasons why it is important for employees to report unethical behaviour.',
        ['Misconduct is detected and dealt with early', 'It protects the reputation and finances of the company'],
        ['It increases the profit of the company', 'It reduces the tax paid by the company', 'It allows managers to keep their positions'],
        { unit: U, topic: 'ethics_and_internal_control', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      ms('Select the TWO actions a company could take to prevent similar incidents in future.',
        ['Give ethics training to all employees', 'Protect employees who report misconduct'],
        ['Reduce the number of directors', 'Stop reporting to the shareholders', 'Remove the internal audit function'],
        { unit: U, topic: 'ethics_and_internal_control', subtopic: 'acc_classification', skill: SK.cls, diff: 3, w: 2, type: 'application' }),
      mt('Match each control measure to its purpose.',
        [['Whistle-blowing channel', 'Lets employees report misconduct safely'], ['Internal audit', 'Finds irregularities early'], ['Code of conduct', 'Sets rules and consequences'], ['Ethics training', 'Teaches acceptable behaviour']],
        { unit: U, topic: 'ethics_and_internal_control', subtopic: 'acc_classification', skill: SK.cls, diff: 2, w: 2, type: 'application' }),
    ],
    subs: [
      ex('4.1', 2,
        ['Donations support the community and the company\'s image.', 'Think about governance and tax.'],
        ['Give two valid benefits of donations to the company.', 'Link each benefit to the company, not only the community.'],
        ['Donations reflect good governance and contribute to the well-being of the community.', 'They give good publicity that improves the company\'s image and can reduce taxable income.']),
      ex('4.2', 4,
        ['The manager mismanaged funds and intimidated employees.', 'Think about detecting problems early and prevention.'],
        ['Explain why employees must report the behaviour.', 'Suggest actions that make a repeat less likely.'],
        ['Reporting promotes accountability and helps the company to detect and solve problems early.', 'The company could improve internal financial controls and audits, give regular ethics training, protect whistle-blowers and set clear rules with consequences.']),
    ],
  },

  // ── L19 ── 4.3–4.5 insolvency and the rights issue ──────────────────────────
  {
    order: 19, name: 'Question 4.3–4.5: Insolvency and the rights issue', marks: 9, qpages: 2, mpages: 1,
    covers: 'Questions 4.3 to 4.5 — the meaning of insolvent, how a rights issue improves solvency, and why shareholders take part.',
    tags: ['insolvency', 'rights_issue'],
    qs: [
      mc('What does it mean when a company is insolvent?',
        'Its liabilities are greater than its assets', ['Its assets are greater than its liabilities', 'Its sales are lower than the year before', 'It has no cash on hand at the end of the month'],
        { unit: U, topic: 'solvency_and_rights_issue', subtopic: 'acc_term_recall', skill: SK.term, diff: 2, w: 2, type: 'definition' }),
      fb('A company offers shares to existing shareholders only, at a 25% discount on the market price of R20 per share. Calculate the price per share in the rights issue.',
        ['Price = R ', '[ ]', ' per share'], ['15'], 'standard_math',
        { unit: U, topic: 'solvency_and_rights_issue', subtopic: 'acc_calculation', skill: SK.calc, diff: 2, w: 2, type: 'calc' }),
      ms('A rights issue is made when the company\'s bank balance is favourable. Select the THREE correct effects on the company.',
        ['Assets increase because cash is received', 'Equity increases because shares are issued', 'Liabilities remain unchanged'],
        ['Liabilities increase by the cash received', 'Equity decreases because shares are sold cheaply'],
        { unit: U, topic: 'solvency_and_rights_issue', subtopic: 'acc_interpretation', skill: SK.int, diff: 3, w: 3, type: 'interpretation' }),
      mc('Which is a valid reason why existing shareholders take part in a rights issue?',
        'They buy the shares below the market price', ['They are forced to sell their existing shares', 'They receive a higher salary as directors', 'They avoid paying tax on the shares'],
        { unit: U, topic: 'solvency_and_rights_issue', subtopic: 'acc_scenario_application', skill: SK.app, diff: 3, w: 2, type: 'application' }),
    ],
    subs: [
      ex('4.3', 2,
        ['Insolvent describes the relationship between assets and liabilities.'],
        ['Say which is larger, the assets or the liabilities.', 'Say what the company cannot do as a result.'],
        ['A company is insolvent when its liabilities exceed its assets, so it has negative equity.', 'It would be unable to settle its liabilities from its assets if it were liquidated.']),
      ex('4.4', 3,
        ['New shares were issued to existing shareholders for cash.', 'Look at assets, equity and liabilities separately.'],
        ['Say what happens to each of assets, equity and liabilities.', 'Link the changes to solvency.'],
        ['Assets increase because more cash is received.', 'Equity increases because more shares are issued, and liabilities remain unchanged, which improves solvency.']),
      ex('4.5', 4,
        ['The shares were offered at R27 when the market price was R39.', 'Think about the shareholders\' investment and the company\'s survival.'],
        ['Give reasons that show the benefit to the shareholder.', 'Use the figures from the information.'],
        ['They buy shares at a 30% discount and can resell them at the market price to make a profit.', 'They safeguard their existing investment and show confidence in the recovery of the company, which minimises the chance of liquidation.']),
    ],
  },
];
