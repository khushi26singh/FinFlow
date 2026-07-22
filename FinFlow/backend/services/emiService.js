// backend/services/emiService.js
class EmiService {
  calculate({ loanAmount, interestRate, tenureMonths }) {
    const monthlyRate = interestRate / 12 / 100;

    let emi;
    if (monthlyRate === 0) {
      emi = loanAmount / tenureMonths;
    } else {
      const growthFactor = Math.pow(1 + monthlyRate, tenureMonths);
      emi = (loanAmount * monthlyRate * growthFactor) / (growthFactor - 1);
    }

    const schedule = this.buildAmortizationSchedule({
      loanAmount,
      monthlyRate,
      tenureMonths,
      emi,
    });

    const totalAmount = schedule.reduce((sum, row) => sum + row.emi, 0);
    const totalInterest = totalAmount - loanAmount;

    return {
      loanAmount: this.round(loanAmount),
      interestRate,
      tenureMonths,
      monthlyEmi: this.round(emi),
      totalInterest: this.round(totalInterest),
      totalAmount: this.round(totalAmount),
      schedule,
    };
  }

  buildAmortizationSchedule({ loanAmount, monthlyRate, tenureMonths, emi }) {
    const schedule = [];
    let balance = loanAmount;

    for (let month = 1; month <= tenureMonths; month += 1) {
      const interestComponent = balance * monthlyRate;
      let principalComponent = emi - interestComponent;
      let emiForMonth = emi;

      // Final month: settle the exact remaining balance to avoid rounding drift
      if (month === tenureMonths) {
        principalComponent = balance;
        emiForMonth = principalComponent + interestComponent;
      }

      balance = Math.max(balance - principalComponent, 0);

      schedule.push({
        month,
        emi: this.round(emiForMonth),
        principal: this.round(principalComponent),
        interest: this.round(interestComponent),
        balance: this.round(balance),
      });
    }

    return schedule;
  }

  round(value) {
    return Math.round(value * 100) / 100;
  }
}

module.exports = new EmiService();
