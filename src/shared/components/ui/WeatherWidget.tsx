import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer } from 'lucide-react';
import * as S from './WeatherWidget.styles';

const WeatherWidget = ({ compact = false, location = 'Dubai', className = '' }) => {
  const [weather, setWeather] = useState({
    temp: 32,
    condition: 'sunny',
    humidity: 45,
    description: 'Sunny'
  });

  useEffect(() => {
    // Use Dubai time (UTC+4) to deterministically select weather
    const dubaiHour = parseInt(
      new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dubai', hour: 'numeric', hour12: false }).format(new Date()),
      10
    );
    const hour = dubaiHour;
    
    // Deterministic time-of-day-based weather (no random)
    let condition: { condition: string; temp: number; humidity: number; description: string };
    if (hour >= 6 && hour < 10) {
      condition = { condition: 'partly-cloudy', temp: 30, humidity: 55, description: 'Partly Cloudy' };
    } else if (hour >= 10 && hour < 15) {
      condition = { condition: 'hot', temp: 40, humidity: 30, description: 'Hot' };
    } else if (hour >= 15 && hour < 18) {
      condition = { condition: 'sunny', temp: 36, humidity: 35, description: 'Sunny' };
    } else {
      condition = { condition: 'cloudy', temp: 28, humidity: 55, description: 'Clear Night' };
    }
    setWeather(condition);
  }, []);

  const getWeatherIcon = (condition: string) => {
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
      <S.WeatherWidgetContainer $compact={compact} className={className} role="region" aria-label={`Weather in ${location}: ${weather.description}, ${weather.temp}°C`}>
        <S.WeatherIcon>{getWeatherIcon(weather.condition)}</S.WeatherIcon>
        <S.WeatherTemp $compact={compact}>{weather.temp}°C</S.WeatherTemp>
      </S.WeatherWidgetContainer>
    );
  }

  return (
    <S.WeatherWidgetContainer className={className} role="region" aria-label={`Current weather in ${location}: ${weather.description}, ${weather.temp}°C, ${weather.humidity}% humidity`}>
      <S.WeatherMain>
        <S.WeatherIcon $large>{getWeatherIcon(weather.condition)}</S.WeatherIcon>
        <S.WeatherInfo>
          <S.WeatherTemp>{weather.temp}°C</S.WeatherTemp>
          <S.WeatherDescription>{weather.description}</S.WeatherDescription>
        </S.WeatherInfo>
      </S.WeatherMain>
      <S.WeatherDetails>
        <S.WeatherLocation>{location}</S.WeatherLocation>
        <S.WeatherHumidity>
          <Thermometer size={14} />
          {weather.humidity}% humidity
        </S.WeatherHumidity>
      </S.WeatherDetails>
    </S.WeatherWidgetContainer>
  );
};

export default WeatherWidget;
