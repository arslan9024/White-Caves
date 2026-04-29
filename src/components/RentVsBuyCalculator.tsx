import React, { useState, useMemo } from 'react';
import './RentVsBuyCalculator.css';

const RentVsBuyCalculator = () => {
  const [inputs, setInputs] = useState({
    propertyPrice: 2000000,
    downPayment: 20,
    mortgageRate: 4.5,
    mortgageTerm: 25,
    monthlyRent: 10000,
    rentIncrease: 5,
    propertyAppreciation: 3,
    maintenanceCost: 1,
    investmentReturn: 7,
    yearsToCompare: 10
  });

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: Math.max(0, parseFloat(value) || 0)
    }));
  };

  const calculations = useMemo(() => {
    const {
      propertyPrice,
      downPayment,
      mortgageRate,
      mortgageTerm,
      monthlyRent,
      rentIncrease,
      propertyAppreciation,
      maintenanceCost,
      investmentReturn,
      yearsToCompare
    } = inputs;

    const downPaymentAmount = propertyPrice * (downPayment / 100);
    const loanAmount = propertyPrice - downPaymentAmount;
    const monthlyRate = mortgageRate / 100 / 12;
    const safeTerm = Math.max(1, mortgageTerm);
    const totalPayments = safeTerm * 12;

    // Guard against division by zero when mortgage rate is 0 (cash purchase)
    // or loan amount is 0 (100% down payment)
    let monthlyMortgage: number;
    if (loanAmount <= 0 || monthlyRate <= 0) {
      monthlyMortgage = loanAmount > 0 ? loanAmount / totalPayments : 0;
    } else {
      monthlyMortgage = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
    }

    const dldFee = propertyPrice * 0.04;
    const agencyFee = propertyPrice * 0.02;
    const mortgageRegistration = loanAmount * 0.0025;
    const trusteeeFee = 4000;
    const totalBuyingCosts = dldFee + agencyFee + mortgageRegistration + trusteeeFee;

    let buyingTotalCost = downPaymentAmount + totalBuyingCosts;
    let rentingTotalCost = 0;
    let propertyValue = propertyPrice;
    let currentRent = monthlyRent;
    let investmentValue = downPaymentAmount + totalBuyingCosts;

    const yearlyComparison = [];

    for (let year = 1; year <= yearsToCompare; year++) {
      const yearlyMortgage = monthlyMortgage * 12;
      const yearlyMaintenance = propertyPrice * (maintenanceCost / 100);
      const yearlyServiceCharge = propertyPrice * 0.01;
      
      buyingTotalCost += yearlyMortgage + yearlyMaintenance + yearlyServiceCharge;

      const yearlyRent = currentRent * 12;
      rentingTotalCost += yearlyRent;
      
      investmentValue = investmentValue * (1 + investmentReturn / 100);
      
      propertyValue = propertyValue * (1 + propertyAppreciation / 100);
      
      currentRent = currentRent * (1 + rentIncrease / 100);

      const equityBuilt = propertyValue - loanAmount + (downPaymentAmount * year / safeTerm);
      
      yearlyComparison.push({
        year,
        buyingCost: buyingTotalCost,
        rentingCost: rentingTotalCost,
        propertyValue,
        investmentValue,
        equityBuilt,
        // Net worth = equity in the home (asset minus remaining debt) minus non-equity costs
        // equityBuilt already includes propertyValue, so do NOT add propertyValue again
        netWorthBuying: equityBuilt - (buyingTotalCost - downPaymentAmount),
        netWorthRenting: investmentValue - rentingTotalCost
      });
    }

    const finalBuyingNetWorth = propertyValue - buyingTotalCost;
    const finalRentingNetWorth = investmentValue - rentingTotalCost;
    const recommendation = finalBuyingNetWorth > finalRentingNetWorth ? 'buy' : 'rent';
    const breakEvenYear = yearlyComparison.find(
      (y, i, arr) => i > 0 && 
      y.netWorthBuying > y.netWorthRenting && 
      arr[i-1].netWorthBuying <= arr[i-1].netWorthRenting
    )?.year || null;

    return {
      monthlyMortgage,
      totalBuyingCosts,
      downPaymentAmount,
      yearlyComparison,
      finalBuyingNetWorth,
      finalRentingNetWorth,
      recommendation,
      breakEvenYear,
      propertyValue,
      investmentValue
    };
  }, [inputs]);

  return (
    <div className="rent-vs-buy-calculator">
      <div className="calculator-header">
        <h2>Smart Rent vs. Buy Calculator</h2>
        <p>Make an informed decision for your Dubai property investment</p>
      </div>

      <div className="calculator-content">
        <div className="inputs-section">
          <div className="input-group">
            <h3>Property Details</h3>
            <div className="input-field">
              <label htmlFor="calc-property-price">Property Price (AED)</label>
              <input
                id="calc-property-price"
                type="number"
                value={inputs.propertyPrice}
                onChange={(e) => handleInputChange('propertyPrice', e.target.value)}
              />
            </div>
            <div className="input-field">
              <label htmlFor="calc-down-payment">Down Payment (%)</label>
              <input
                id="calc-down-payment"
                type="number"
                value={inputs.downPayment}
                onChange={(e) => handleInputChange('downPayment', e.target.value)}
                min="0"
                max="100"
              />
            </div>
            <div className="input-field">
              <label htmlFor="calc-mortgage-rate">Mortgage Rate (%)</label>
              <input
                id="calc-mortgage-rate"
                type="number"
                value={inputs.mortgageRate}
                onChange={(e) => handleInputChange('mortgageRate', e.target.value)}
                step="0.1"
              />
            </div>
            <div className="input-field">
              <label htmlFor="calc-mortgage-term">Mortgage Term (years)</label>
              <input
                id="calc-mortgage-term"
                type="number"
                value={inputs.mortgageTerm}
                onChange={(e) => handleInputChange('mortgageTerm', e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <h3>Rental Comparison</h3>
            <div className="input-field">
              <label htmlFor="calc-monthly-rent">Monthly Rent (AED)</label>
              <input
                id="calc-monthly-rent"
                type="number"
                value={inputs.monthlyRent}
                onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
              />
            </div>
            <div className="input-field">
              <label htmlFor="calc-rent-increase">Annual Rent Increase (%)</label>
              <input
                id="calc-rent-increase"
                type="number"
                value={inputs.rentIncrease}
                onChange={(e) => handleInputChange('rentIncrease', e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <h3>Growth Assumptions</h3>
            <div className="input-field">
              <label htmlFor="calc-property-appreciation">Property Appreciation (%/year)</label>
              <input
                id="calc-property-appreciation"
                type="number"
                value={inputs.propertyAppreciation}
                onChange={(e) => handleInputChange('propertyAppreciation', e.target.value)}
              />
            </div>
            <div className="input-field">
              <label htmlFor="calc-investment-return">Investment Return (%/year)</label>
              <input
                id="calc-investment-return"
                type="number"
                value={inputs.investmentReturn}
                onChange={(e) => handleInputChange('investmentReturn', e.target.value)}
              />
            </div>
            <div className="input-field">
              <label htmlFor="calc-maintenance-cost">Maintenance Cost (%/year)</label>
              <input
                id="calc-maintenance-cost"
                type="number"
                value={inputs.maintenanceCost}
                onChange={(e) => handleInputChange('maintenanceCost', e.target.value)}
              />
            </div>
            <div className="input-field">
              <label htmlFor="calc-years-compare">Years to Compare</label>
              <input
                id="calc-years-compare"
                type="number"
                value={inputs.yearsToCompare}
                onChange={(e) => handleInputChange('yearsToCompare', e.target.value)}
                min="1"
                max="30"
              />
            </div>
          </div>
        </div>

        <div className="results-section">
          <div className={`recommendation-card ${calculations.recommendation}`}>
            <div className="recommendation-icon">
              {calculations.recommendation === 'buy' ? '🏠' : '🔑'}
            </div>
            <h3>
              {calculations.recommendation === 'buy' 
                ? 'Buying is Better!' 
                : 'Renting is Better!'}
            </h3>
            <p>
              After {inputs.yearsToCompare} years, you'll be AED{' '}
              {Math.abs(calculations.finalBuyingNetWorth - calculations.finalRentingNetWorth).toLocaleString()}{' '}
              better off {calculations.recommendation === 'buy' ? 'buying' : 'renting'}.
            </p>
            {calculations.breakEvenYear && (
              <p className="break-even">
                Break-even point: Year {calculations.breakEvenYear}
              </p>
            )}
          </div>

          <div className="summary-cards">
            <div className="summary-card buying">
              <h4>Buying Summary</h4>
              <div className="summary-item">
                <span>Monthly Mortgage</span>
                <strong>AED {calculations.monthlyMortgage.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong>
              </div>
              <div className="summary-item">
                <span>Down Payment</span>
                <strong>AED {calculations.downPaymentAmount.toLocaleString()}</strong>
              </div>
              <div className="summary-item">
                <span>Buying Costs (DLD, Agency)</span>
                <strong>AED {calculations.totalBuyingCosts.toLocaleString()}</strong>
              </div>
              <div className="summary-item highlight">
                <span>Property Value (Year {inputs.yearsToCompare})</span>
                <strong>AED {calculations.propertyValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong>
              </div>
            </div>

            <div className="summary-card renting">
              <h4>Renting Summary</h4>
              <div className="summary-item">
                <span>Monthly Rent (Current)</span>
                <strong>AED {inputs.monthlyRent.toLocaleString()}</strong>
              </div>
              <div className="summary-item">
                <span>Initial Investment</span>
                <strong>AED {(calculations.downPaymentAmount + calculations.totalBuyingCosts).toLocaleString()}</strong>
              </div>
              <div className="summary-item highlight">
                <span>Investment Value (Year {inputs.yearsToCompare})</span>
                <strong>AED {calculations.investmentValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong>
              </div>
            </div>
          </div>

          <div className="comparison-chart">
            <h4>Year-by-Year Comparison</h4>
            <div className="chart-container">
              {calculations.yearlyComparison.map((year) => (
                <div key={year.year} className="chart-bar-group">
                  <div className="chart-bars">
                    <div 
                      className="chart-bar buying"
                      style={{ 
                        height: `${(year.buyingCost / (calculations.yearlyComparison[calculations.yearlyComparison.length-1]?.buyingCost || 1)) * 150}px` 
                      }}
                      title={`Buying: AED ${year.buyingCost.toLocaleString(undefined, {maximumFractionDigits: 0})}`}
                    />
                    <div 
                      className="chart-bar renting"
                      style={{ 
                        height: `${(year.rentingCost / (calculations.yearlyComparison[calculations.yearlyComparison.length-1]?.buyingCost || 1)) * 150}px` 
                      }}
                      title={`Renting: AED ${year.rentingCost.toLocaleString(undefined, {maximumFractionDigits: 0})}`}
                    />
                  </div>
                  <span className="chart-label">Y{year.year}</span>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <span className="legend-item buying">Buying Costs</span>
              <span className="legend-item renting">Renting Costs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentVsBuyCalculator;
