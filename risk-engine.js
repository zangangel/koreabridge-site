(function initRiskEngine(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.KoreaBridgeRisk = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildRiskEngine() {
  const riskLevels = [
    { key: "low", label: "Low", min: 0, max: 19, tone: "low" },
    { key: "watch", label: "Watch", min: 20, max: 39, tone: "watch" },
    { key: "high", label: "High", min: 40, max: 69, tone: "high" },
    { key: "critical", label: "Critical", min: 70, max: 100, tone: "critical" }
  ];

  const housingRules = [
    {
      id: "housing_address_registration_no",
      severity: "critical",
      score: 35,
      condition: { field: "addressRegistration", equals: "no" },
      message: "Address registration is not allowed. This can create residence reporting and ARC problems.",
      nextStep: "Confirm address registration before paying if you need ARC or residence reporting."
    },
    {
      id: "housing_address_registration_unsure",
      severity: "high",
      score: 20,
      condition: { field: "addressRegistration", equals: "unsure" },
      message: "Address registration is unclear. Confirm this before paying any deposit.",
      nextStep: "Ask the landlord or agent to confirm address registration in writing."
    },
    {
      id: "housing_no_written_contract",
      severity: "critical",
      score: 35,
      condition: { field: "writtenContract", equals: "none" },
      message: "No written contract. Do not pay or move in without written terms.",
      nextStep: "Request a written contract before payment."
    },
    {
      id: "housing_korean_only_contract",
      severity: "watch",
      score: 10,
      condition: { field: "writtenContract", in: ["korean", "unsure"] },
      message: "Contract language or explanation may be unclear for a first-time foreign tenant.",
      nextStep: "Ask for a translated summary of payment, refund, and move-out terms."
    },
    {
      id: "housing_unknown_signing_party",
      severity: "critical",
      score: 35,
      condition: { field: "signingParty", equals: "unknown" },
      message: "The signing party is unknown. Confirm who receives money and who is legally responsible.",
      nextStep: "Confirm landlord, agent, or property manager identity."
    },
    {
      id: "housing_sublease",
      severity: "high",
      score: 20,
      condition: { field: "signingParty", equals: "tenant" },
      message: "Sublease detected. Confirm landlord permission and refund terms.",
      nextStep: "Ask for written landlord permission and refund terms."
    },
    {
      id: "housing_large_upfront_payment",
      severity: "critical",
      score: 35,
      condition: { field: "upfrontPayment", equals: "large" },
      message: "Large payment requested before verification. This is a serious money-risk signal.",
      nextStep: "Do not pay a large amount before contract and identity checks."
    },
    {
      id: "housing_reservation_fee",
      severity: "watch",
      score: 10,
      condition: { field: "upfrontPayment", equals: "small" },
      message: "Reservation fee requested. Make sure refund terms are written.",
      nextStep: "Ask whether the reservation fee is refundable and when it converts to rent or deposit."
    },
    {
      id: "housing_large_deposit_no_registry_check",
      severity: "high",
      score: 25,
      condition: {
        all: [
          { field: "depositBand", in: ["5m_20m", "over_20m"] },
          { field: "registryChecked", notEquals: "yes" }
        ]
      },
      message: "Large deposit without ownership or registry check.",
      nextStep: "Check property ownership and deposit protection before signing."
    },
    {
      id: "housing_refund_terms_missing",
      severity: "high",
      score: 20,
      condition: { field: "refundTerms", equals: "none" },
      message: "Refund and fee terms are not written.",
      nextStep: "Ask for refund, cancellation, maintenance fee, and move-out terms in writing."
    },
    {
      id: "housing_refund_terms_unclear",
      severity: "watch",
      score: 10,
      condition: { field: "refundTerms", equals: "unclear" },
      message: "Refund and maintenance fee terms are unclear.",
      nextStep: "Ask for a written breakdown of deposit, rent, utilities, maintenance, and penalties."
    }
  ];

  const jobRules = [
    {
      id: "job_tourist_status_work",
      severity: "critical",
      score: 35,
      condition: { field: "visaStatus", equals: "tourist" },
      message: "Tourist or short-term status usually creates serious work permission risk.",
      nextStep: "Confirm work permission with an official or qualified advisor before starting."
    },
    {
      id: "job_unknown_status",
      severity: "high",
      score: 20,
      condition: { field: "visaStatus", equals: "unknown" },
      message: "Visa or status is unclear. Confirm work permission before accepting.",
      nextStep: "Identify your exact status before interviewing or doing a trial shift."
    },
    {
      id: "job_passport_or_arc_holding",
      severity: "critical",
      score: 40,
      condition: { field: "passportArcHolding", equals: "yes" },
      message: "Employer asks to hold passport or ARC. Stop and get help.",
      nextStep: "Do not hand over identity documents for an employer to keep."
    },
    {
      id: "job_permission_ignored",
      severity: "critical",
      score: 35,
      condition: { field: "workPermission", equals: "ignored" },
      message: "Employer says work permission is not important. This is a serious visa risk.",
      nextStep: "Confirm legal work permission before starting."
    },
    {
      id: "job_permission_unclear",
      severity: "watch",
      score: 10,
      condition: { field: "workPermission", equals: "unclear" },
      message: "Work permission has not been discussed.",
      nextStep: "Ask directly whether this work is allowed under your status."
    },
    {
      id: "job_employer_identity_missing",
      severity: "critical",
      score: 35,
      condition: { field: "employerIdentity", equals: "no" },
      message: "Employer name or address is not clear.",
      nextStep: "Ask for company or store name, address, and business identity."
    },
    {
      id: "job_employer_identity_partial",
      severity: "watch",
      score: 10,
      condition: { field: "employerIdentity", equals: "partial" },
      message: "Employer identity is only partly clear.",
      nextStep: "Confirm full workplace address and legal business name."
    },
    {
      id: "job_fee_requested",
      severity: "critical",
      score: 35,
      condition: { field: "jobFees", equals: "yes" },
      message: "Job-related training, placement, or deposit fee requested.",
      nextStep: "Do not pay fees before confirming legality and legitimacy."
    },
    {
      id: "job_no_contract",
      severity: "high",
      score: 25,
      condition: { field: "writtenContract", equals: "no" },
      message: "No written employment contract. Ask for one before starting work.",
      nextStep: "Request written wage, hours, payment date, and work duties."
    },
    {
      id: "job_contract_unclear",
      severity: "watch",
      score: 10,
      condition: { field: "writtenContract", equals: "unsure" },
      message: "Employment contract status is unclear.",
      nextStep: "Ask whether you will receive a written contract before the first shift."
    },
    {
      id: "job_low_pay",
      severity: "high",
      score: 25,
      condition: { field: "payBand", equals: "under_10000" },
      message: "Hourly pay appears below a safe legal threshold. Verify current minimum wage and total pay.",
      nextStep: "Check current minimum wage and ask for total wage calculation."
    },
    {
      id: "job_unstated_pay",
      severity: "high",
      score: 20,
      condition: { field: "payBand", equals: "unstated" },
      message: "Pay is not stated. Ask for exact wage and pay date before any trial shift.",
      nextStep: "Get wage, pay date, and payment method in writing."
    },
    {
      id: "job_cash_only",
      severity: "high",
      score: 20,
      condition: { field: "paymentMethod", equals: "cash" },
      message: "Cash-only payment increases proof and wage dispute risk.",
      nextStep: "Ask for written pay date and keep proof of hours worked."
    },
    {
      id: "job_student_hours_risk",
      severity: "high",
      score: 25,
      condition: {
        all: [
          { field: "visaStatus", in: ["d2", "d4"] },
          { field: "weeklyHours", in: ["20_30", "over_30"] }
        ]
      },
      message: "Weekly hours may conflict with student work permission rules.",
      nextStep: "Confirm allowed hours for your visa/status before accepting."
    }
  ];

  function getRiskLevel(rawScore) {
    const score = clampScore(rawScore);
    return riskLevels.find((level) => score >= level.min && score <= level.max) || riskLevels[0];
  }

  function clampScore(score) {
    return Math.max(0, Math.min(100, Number(score) || 0));
  }

  function matchesCondition(condition, input) {
    if (condition.all) {
      return condition.all.every((item) => matchesCondition(item, input));
    }
    if (condition.any) {
      return condition.any.some((item) => matchesCondition(item, input));
    }
    const value = input[condition.field];
    if (Object.prototype.hasOwnProperty.call(condition, "equals")) {
      return value === condition.equals;
    }
    if (Object.prototype.hasOwnProperty.call(condition, "notEquals")) {
      return value !== condition.notEquals;
    }
    if (Array.isArray(condition.in)) {
      return condition.in.includes(value);
    }
    return false;
  }

  function scoreWithRules(input, rules) {
    const flags = rules
      .filter((rule) => matchesCondition(rule.condition, input))
      .map(({ id, severity, score, message, nextStep }) => ({ id, severity, score, message, nextStep }));
    const score = clampScore(flags.reduce((total, flag) => total + flag.score, 0));
    const nextSteps = Array.from(new Set(flags.map((flag) => flag.nextStep)));
    return {
      score,
      level: getRiskLevel(score),
      flags,
      nextSteps
    };
  }

  function scoreHousing(input) {
    return scoreWithRules(input || {}, housingRules);
  }

  function scoreJob(input) {
    return scoreWithRules(input || {}, jobRules);
  }

  function summarizeChecklistProgress(items) {
    const total = Array.isArray(items) ? items.length : 0;
    const done = Array.isArray(items) ? items.filter(Boolean).length : 0;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return {
      done,
      total,
      percent,
      label: `${done} of ${total} done`
    };
  }

  return {
    riskLevels,
    housingRules,
    jobRules,
    getRiskLevel,
    scoreHousing,
    scoreJob,
    summarizeChecklistProgress
  };
});
