// backend/services/eligibilityService.js
const creditScoreService = require('./creditScoreService');
const emiService = require('./emiService');

const ELIGIBILITY_RULES = {
  minAge: 21,
  maxAge: 55,
  minMonthlyIncome: 15000,
  minExperienceMonths: 3,
  minCreditScore: 650,
  maxDtiPercent: 50,
};

class EligibilityService {
  calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
    }
    return age;
  }

  // application must have personalDetails, employmentDetails, requestedAmount,
  // tenureMonths, applicant, and loanProduct populated with at least `interestRate`
  async evaluateApplication(application) {
    const checks = [];

    const age = this.calculateAge(application.personalDetails.dateOfBirth);
    checks.push({
      rule: 'age',
      label: `Age between ${ELIGIBILITY_RULES.minAge}-${ELIGIBILITY_RULES.maxAge}`,
      value: age,
      passed: age >= ELIGIBILITY_RULES.minAge && age <= ELIGIBILITY_RULES.maxAge,
    });

    const monthlyIncome = Number(application.employmentDetails.monthlyIncome);
    checks.push({
      rule: 'salary',
      label: `Monthly income above ₹${ELIGIBILITY_RULES.minMonthlyIncome}`,
      value: monthlyIncome,
      passed: monthlyIncome > ELIGIBILITY_RULES.minMonthlyIncome,
    });

    const experienceMonths = Number(application.employmentDetails.experienceMonths);
    checks.push({
      rule: 'experience',
      label: `Work experience above ${ELIGIBILITY_RULES.minExperienceMonths} months`,
      value: experienceMonths,
      passed: experienceMonths > ELIGIBILITY_RULES.minExperienceMonths,
    });

    const applicantId = application.applicant?._id || application.applicant;
    const creditProfile = await creditScoreService.getOrCreateProfile(applicantId);
    checks.push({
      rule: 'creditScore',
      label: `Credit score above ${ELIGIBILITY_RULES.minCreditScore}`,
      value: creditProfile.score,
      passed: creditProfile.score > ELIGIBILITY_RULES.minCreditScore,
    });

    const interestRate = application.loanProduct?.interestRate ?? 0;
    const { monthlyEmi } = emiService.calculate({
      loanAmount: Number(application.requestedAmount),
      interestRate,
      tenureMonths: Number(application.tenureMonths),
    });
    const totalMonthlyObligation = (creditProfile.existingDebt || 0) + monthlyEmi;
    const dtiPercent = monthlyIncome > 0 ? (totalMonthlyObligation / monthlyIncome) * 100 : 100;
    checks.push({
      rule: 'dti',
      label: `Debt-to-income ratio below ${ELIGIBILITY_RULES.maxDtiPercent}%`,
      value: Math.round(dtiPercent * 100) / 100,
      passed: dtiPercent < ELIGIBILITY_RULES.maxDtiPercent,
    });

    const isEligible = checks.every((check) => check.passed);

    return {
      isEligible,
      checks,
      evaluatedAt: new Date(),
    };
  }
}

module.exports = new EligibilityService();