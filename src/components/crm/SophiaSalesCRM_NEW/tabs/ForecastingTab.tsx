import React from 'react';

const ForecastingTab = () => {
  return (
    <div className="forecasting-view">
      <h3>Sales Forecast</h3>
      <div className="forecast-summary">
        <div className="forecast-card">
          <h4>This Month</h4>
          <div className="forecast-value">AED 28.5M</div>
          <div className="forecast-target">Target: AED 30M</div>
          <div className="forecast-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '95%' }} />
            </div>
            <span>95%</span>
          </div>
        </div>
        <div className="forecast-card">
          <h4>This Quarter</h4>
          <div className="forecast-value">AED 85.2M</div>
          <div className="forecast-target">Target: AED 100M</div>
          <div className="forecast-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '85%' }} />
            </div>
            <span>85%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastingTab;
