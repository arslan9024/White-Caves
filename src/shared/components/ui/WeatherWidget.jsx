import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer } from 'lucide-react';
import './WeatherWidget.css';

const WeatherWidget = ({ compact = false, location = 'Dubai', className = '' }) => {
  const [weather, setWeather] = useState({
    temp: 32,
    condition: 'sunny',
    humidity: 45,
    description: 'Sunny'
  });

  useEffect(() => {
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 18;
    
    const conditions = [
      { condition: 'sunny', temp: 35, humidity: 40, description: 'Sunny' },
      { condition: 'partly-cloudy', temp: 32, humidity: 50, description: 'Partly Cloudy' },
      { condition: 'cloudy', temp: 28, humidity: 60, description: 'Cloudy' },
      { condition: 'hot', temp: 42, humidity: 30, description: 'Hot' },
    ];
    
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    setWeather({
      ...randomCondition,
      temp: randomCondition.temp + Math.floor(Math.random() * 5) - 2
    });
  }, []);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
      case 'hot':
        return <Sun size={compact ? 18 : 24} />;
      case 'cloudy':
        return <Cloud size={compact ? 18 : 24} />;
      case 'partly-cloudy':
        return <Cloud size={compact ? 18 : 24} />;
      case 'rainy':
        return <CloudRain size={compact ? 18 : 24} />;
      case 'snowy':
        return <CloudSnow size={compact ? 18 : 24} />;
      case 'windy':
        return <Wind size={compact ? 18 : 24} />;
      default:
        return <Sun size={compact ? 18 : 24} />;
    }
  };

  if (compact) {
    return (
      <div className={`weather-widget compact ${className}`}>
        <span className="weather-icon">{getWeatherIcon(weather.condition)}</span>
        <span className="weather-temp">{weather.temp}°C</span>
      </div>
    );
  }

  return (
    <div className={`weather-widget ${className}`}>
      <div className="weather-main">
        <span className="weather-icon large">{getWeatherIcon(weather.condition)}</span>
        <div className="weather-info">
          <span className="weather-temp">{weather.temp}°C</span>
          <span className="weather-description">{weather.description}</span>
        </div>
      </div>
      <div className="weather-details">
        <span className="weather-location">{location}</span>
        <span className="weather-humidity">
          <Thermometer size={14} />
          {weather.humidity}% humidity
        </span>
      </div>
    </div>
  );
};

export default WeatherWidget;
