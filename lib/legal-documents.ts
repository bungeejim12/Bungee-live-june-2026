export type LegalAudience = "business" | "bungee"

export interface LegalDocument {
  key: string
  title: string
  version: string
  audience: LegalAudience
  summary: string
  /** Plain-text sections rendered in the review pane. */
  sections: { heading: string; body: string }[]
  /** Wording shown next to the acknowledgment checkbox. */
  acknowledgment: string
}

const EFFECTIVE = "Effective June 2026"

export const BUSINESS_DOCUMENTS: LegalDocument[] = [
  {
    key: "business_service_agreement",
    title: "Service Agreement",
    version: "v1.0",
    audience: "business",
    summary: "Governs how your business uses the Bungee platform to source and pay for referrals.",
    acknowledgment:
      "I have read and agree to the Service Agreement, and I am authorized to bind this business to its terms.",
    sections: [
      {
        heading: "1. Overview",
        body: `${EFFECTIVE}. This Service Agreement ("Agreement") is entered into between your business ("Business", "you") and Bungee ("Bungee", "we", "us"). By signing, you agree to use the Bungee platform to post bounties, receive referrals, and compensate referrers in accordance with these terms.`,
      },
      {
        heading: "2. Platform Role",
        body: "Bungee provides a marketplace connecting your business with independent referrers ('Bungees'). Bungee is not a party to the underlying transaction between your business and any customer and does not guarantee any particular outcome, sale, or conversion.",
      },
      {
        heading: "3. Bounties & Payments",
        body: "You agree to fund and honor the bounty amounts you publish. Once a referral meets the criteria you define, the associated bounty becomes payable. You authorize Bungee to facilitate payouts to referrers and to deduct applicable platform fees.",
      },
      {
        heading: "4. Compliance",
        body: "You are responsible for ensuring that the products, services, and offers you promote comply with all applicable laws, including consumer-protection, advertising, and tax regulations in your jurisdiction.",
      },
      {
        heading: "5. Term & Termination",
        body: "This Agreement remains in effect until terminated by either party. Outstanding bounties earned prior to termination remain payable. Bungee may suspend access for violations of these terms or applicable law.",
      },
    ],
  },
  {
    key: "business_referral_terms",
    title: "Referral Program Terms",
    version: "v1.0",
    audience: "business",
    summary: "Defines how referrals are tracked, attributed, and qualified for payout.",
    acknowledgment: "I have read and agree to the Referral Program Terms.",
    sections: [
      {
        heading: "1. Attribution",
        body: `${EFFECTIVE}. Referrals are attributed to a Bungee based on the tracking links, codes, and verification methods provided by the platform. You agree to honor attribution as recorded by Bungee absent clear evidence of fraud.`,
      },
      {
        heading: "2. Qualification",
        body: "You define the criteria a referral must meet to qualify for a bounty (for example, a completed booking, signed contract, or first purchase). Criteria must be lawful, objective, and applied consistently.",
      },
      {
        heading: "3. Anti-Fraud",
        body: "Self-referrals, fabricated leads, and incentivized fake activity are prohibited. Bungee may withhold or claw back payouts associated with fraudulent activity.",
      },
      {
        heading: "4. Disputes",
        body: "Payout disputes must be raised within 30 days of a referral being marked qualified. Bungee may mediate disputes but is not obligated to resolve them in either party's favor.",
      },
    ],
  },
  {
    key: "business_privacy_policy",
    title: "Privacy Policy",
    version: "v1.0",
    audience: "business",
    summary: "Explains how Bungee collects and processes business and referral data.",
    acknowledgment: "I acknowledge that I have read and understand the Privacy Policy.",
    sections: [
      {
        heading: "1. Data We Collect",
        body: `${EFFECTIVE}. We collect business profile information, bounty configurations, referral records, and payment details necessary to operate the platform.`,
      },
      {
        heading: "2. How We Use Data",
        body: "Data is used to facilitate referrals, process payouts, prevent fraud, provide analytics in your dashboard, and meet legal obligations.",
      },
      {
        heading: "3. Sharing",
        body: "Limited data is shared with referrers for attribution and with payment processors and tax authorities as required. We do not sell your data.",
      },
      {
        heading: "4. Your Choices",
        body: "You may request access to or deletion of your data subject to legal retention requirements. Contact privacy@bungee.example to make a request.",
      },
    ],
  },
]

export const BUNGEE_DOCUMENTS: LegalDocument[] = [
  {
    key: "bungee_contractor_acknowledgment",
    title: "Independent Contractor Acknowledgment",
    version: "v1.0",
    audience: "bungee",
    summary: "Confirms you are an independent referrer and not an employee of Bungee.",
    acknowledgment:
      "I acknowledge and agree that I am an independent contractor and NOT an employee, agent, partner, or joint venturer of Bungee.",
    sections: [
      {
        heading: "1. Independent Status",
        body: `${EFFECTIVE}. You acknowledge that participating as a Bungee referrer does not create an employment relationship. You are an independent contractor. Nothing in your use of the platform shall be construed to create an employer-employee, agency, partnership, or joint-venture relationship between you and Bungee.`,
      },
      {
        heading: "2. No Employee Benefits",
        body: "As an independent contractor, you are not entitled to employee benefits, including but not limited to health insurance, paid leave, workers' compensation, unemployment insurance, or retirement contributions from Bungee.",
      },
      {
        heading: "3. Taxes",
        body: "You are solely responsible for reporting and paying all federal, state, and local taxes on any bounties or earnings you receive. Bungee does not withhold taxes on your behalf and may issue tax forms (such as a 1099) where required by law.",
      },
      {
        heading: "4. Control of Work",
        body: "You control how, when, and whether you make referrals. Bungee does not set your hours, require exclusivity, or direct the manner in which you perform referral activities.",
      },
    ],
  },
  {
    key: "bungee_ground_rules",
    title: "Ground Rules & Code of Conduct",
    version: "v1.0",
    audience: "bungee",
    summary: "The conduct standards every Bungee must follow.",
    acknowledgment: "I have read and agree to follow the Ground Rules & Code of Conduct.",
    sections: [
      {
        heading: "1. Honesty",
        body: `${EFFECTIVE}. Always represent businesses and their offers truthfully. Do not make false claims, guarantees, or promises on behalf of a business.`,
      },
      {
        heading: "2. No Spam or Harassment",
        body: "Do not use spam, harassment, deceptive messaging, or prohibited channels to source referrals. Respect the communication preferences of the people you refer.",
      },
      {
        heading: "3. Respect Attribution",
        body: "Do not attempt to manipulate tracking, create fake leads, self-refer, or otherwise game the bounty system. Violations may result in forfeited earnings and removal from the platform.",
      },
      {
        heading: "4. Professionalism",
        body: "Represent the Bungee community with integrity. Unlawful, discriminatory, or abusive behavior will not be tolerated.",
      },
    ],
  },
  {
    key: "bungee_referral_bounty_terms",
    title: "Referral & Bounty Terms",
    version: "v1.0",
    audience: "bungee",
    summary: "How you earn, qualify for, and receive bounty payouts.",
    acknowledgment: "I have read and agree to the Referral & Bounty Terms.",
    sections: [
      {
        heading: "1. Earning Bounties",
        body: `${EFFECTIVE}. You earn a bounty when a referral you originate meets the qualifying criteria defined by the business. Criteria and amounts are shown before you accept a bounty.`,
      },
      {
        heading: "2. Payouts",
        body: "Qualified bounties are paid through the platform's payout system. You must complete any required identity and tax verification before receiving payouts.",
      },
      {
        heading: "3. Clawbacks",
        body: "Bungee may reverse or withhold payouts associated with fraud, chargebacks, refunds, or referrals later found not to qualify.",
      },
      {
        heading: "4. No Guarantee",
        body: "Bungee does not guarantee any minimum number of bounties, earnings, or that any referral will qualify.",
      },
    ],
  },
  {
    key: "bungee_privacy_policy",
    title: "Privacy Policy",
    version: "v1.0",
    audience: "bungee",
    summary: "How Bungee collects and processes your personal and referral data.",
    acknowledgment: "I acknowledge that I have read and understand the Privacy Policy.",
    sections: [
      {
        heading: "1. Data We Collect",
        body: `${EFFECTIVE}. We collect your profile information, referral activity, payout details, and verification data necessary to operate the platform and pay you.`,
      },
      {
        heading: "2. How We Use Data",
        body: "Your data is used to attribute referrals, process payouts, prevent fraud, and meet legal and tax obligations.",
      },
      {
        heading: "3. Sharing",
        body: "We share limited data with businesses for attribution and with payment processors and tax authorities as required by law. We do not sell your data.",
      },
      {
        heading: "4. Your Choices",
        body: "You may request access to or deletion of your data subject to legal retention requirements. Contact privacy@bungee.example to make a request.",
      },
    ],
  },
]

export function getDocumentsForAudience(audience: LegalAudience): LegalDocument[] {
  return audience === "business" ? BUSINESS_DOCUMENTS : BUNGEE_DOCUMENTS
}

export const ALL_LEGAL_DOCUMENTS: LegalDocument[] = [...BUSINESS_DOCUMENTS, ...BUNGEE_DOCUMENTS]
