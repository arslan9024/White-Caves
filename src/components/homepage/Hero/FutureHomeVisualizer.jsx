import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Home, Sun, Moon, Sunset } from 'lucide-react';
import './FutureHomeVisualizer.css';

const COLOR_PALETTES = {
  walls: [
    { name: 'Pearl White', color: '#F5F5F5' },
    { name: 'Cream', color: '#FFF8E7' },
    { name: 'Sand Beige', color: '#E8DCC8' },
    { name: 'Warm Gray', color: '#B8B0A8' },
    { name: 'Terracotta', color: '#C47D5E' },
    { name: 'Sage Green', color: '#A8B5A0' },
    { name: 'Ocean Blue', color: '#7BA3B8' },
    { name: 'Dusty Rose', color: '#D4A5A5' },
  ],
  roof: [
    { name: 'Charcoal', color: '#3D3D3D' },
    { name: 'Slate Gray', color: '#5A5A5A' },
    { name: 'Terra Cotta', color: '#B8614F' },
    { name: 'Deep Brown', color: '#5D4037' },
    { name: 'Navy Blue', color: '#2C3E50' },
    { name: 'Forest Green', color: '#2D4A3E' },
  ],
  accents: [
    { name: 'Dark Wood', color: '#4A3728' },
    { name: 'Light Oak', color: '#C4A77D' },
    { name: 'Black', color: '#1A1A1A' },
    { name: 'Bronze', color: '#8B6914' },
    { name: 'Copper', color: '#B87333' },
    { name: 'Silver', color: '#A8A8A8' },
  ],
  door: [
    { name: 'Rich Mahogany', color: '#4A2C2A' },
    { name: 'Oak', color: '#8B7355' },
    { name: 'Classic Black', color: '#1A1A1A' },
    { name: 'Navy', color: '#1B3A4B' },
    { name: 'Red', color: '#8B2323' },
    { name: 'White', color: '#FFFFFF' },
  ]
};

const PRESETS = [
  { name: 'Modern White', walls: '#F5F5F5', roof: '#3D3D3D', accents: '#1A1A1A', door: '#1A1A1A' },
  { name: 'Earthy Tones', walls: '#E8DCC8', roof: '#5D4037', accents: '#4A3728', door: '#4A2C2A' },
  { name: 'Coastal', walls: '#F5F5F5', roof: '#2C3E50', accents: '#C4A77D', door: '#1B3A4B' },
  { name: 'Mediterranean', walls: '#FFF8E7', roof: '#B8614F', accents: '#B87333', door: '#8B7355' },
];

const ENVIRONMENTS = [
  { name: 'Day', icon: Sun, gradient: 'linear-gradient(180deg, #87CEEB 0%, #E0F7FA 100%)' },
  { name: 'Sunset', icon: Sunset, gradient: 'linear-gradient(180deg, #FF7E5F 0%, #FEB47B 50%, #FFCDD2 100%)' },
  { name: 'Night', icon: Moon, gradient: 'linear-gradient(180deg, #0F2027 0%, #203A43 50%, #2C5364 100%)' },
];

const FutureHomeVisualizer = () => {
  const [colors, setColors] = useState({
    walls: '#F5F5F5',
    roof: '#3D3D3D',
    accents: '#1A1A1A',
    door: '#4A2C2A'
  });
  const [activeSection, setActiveSection] = useState('walls');
  const [environment, setEnvironment] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleColorChange = (color) => {
    setColors(prev => ({ ...prev, [activeSection]: color }));
  };

  const applyPreset = (preset) => {
    setColors({
      walls: preset.walls,
      roof: preset.roof,
      accents: preset.accents,
      door: preset.door
    });
  };

  const sections = [
    { key: 'walls', label: 'Walls', icon: '🏠' },
    { key: 'roof', label: 'Roof', icon: '🔺' },
    { key: 'accents', label: 'Trim', icon: '✨' },
    { key: 'door', label: 'Door', icon: '🚪' },
  ];

  return (
    <motion.div 
      className={`home-visualizer ${isExpanded ? 'expanded' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="visualizer-header">
        <motion.div 
          className="visualizer-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Palette size={20} />
          <span>Visualize Your Future Home</span>
        </motion.div>
        <button 
          className="expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Minimize' : 'Expand'}
        </button>
      </div>

      <div className="visualizer-content">
        <motion.div 
          className="home-display"
          style={{ background: ENVIRONMENTS[environment].gradient }}
          animate={{ background: ENVIRONMENTS[environment].gradient }}
          transition={{ duration: 0.8 }}
        >
          <motion.svg
            viewBox="0 0 400 300"
            className="home-svg"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="3" dy="5" stdDeviation="5" floodOpacity="0.3"/>
              </filter>
              <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7CB342"/>
                <stop offset="100%" stopColor="#558B2F"/>
              </linearGradient>
              <linearGradient id="windowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E3F2FD"/>
                <stop offset="50%" stopColor="#BBDEFB"/>
                <stop offset="100%" stopColor="#90CAF9"/>
              </linearGradient>
            </defs>

            <rect x="0" y="240" width="400" height="60" fill="url(#grassGradient)"/>
            
            <motion.g filter="url(#shadow)">
              <motion.rect
                x="80" y="140" width="240" height="100"
                fill={colors.walls}
                animate={{ fill: colors.walls }}
                transition={{ duration: 0.5 }}
              />
              
              <motion.polygon
                points="200,60 50,140 350,140"
                fill={colors.roof}
                animate={{ fill: colors.roof }}
                transition={{ duration: 0.5 }}
              />
              
              <motion.rect
                x="80" y="135" width="240" height="8"
                fill={colors.accents}
                animate={{ fill: colors.accents }}
                transition={{ duration: 0.5 }}
              />
              <motion.rect
                x="80" y="232" width="240" height="8"
                fill={colors.accents}
                animate={{ fill: colors.accents }}
                transition={{ duration: 0.5 }}
              />
              <motion.rect
                x="78" y="140" width="6" height="100"
                fill={colors.accents}
                animate={{ fill: colors.accents }}
                transition={{ duration: 0.5 }}
              />
              <motion.rect
                x="316" y="140" width="6" height="100"
                fill={colors.accents}
                animate={{ fill: colors.accents }}
                transition={{ duration: 0.5 }}
              />
              
              <rect x="100" y="160" width="50" height="40" fill="url(#windowGradient)" rx="2"/>
              <rect x="100" y="160" width="50" height="40" fill="none" stroke={colors.accents} strokeWidth="3" rx="2"/>
              <line x1="125" y1="160" x2="125" y2="200" stroke={colors.accents} strokeWidth="2"/>
              <line x1="100" y1="180" x2="150" y2="180" stroke={colors.accents} strokeWidth="2"/>
              
              <rect x="250" y="160" width="50" height="40" fill="url(#windowGradient)" rx="2"/>
              <rect x="250" y="160" width="50" height="40" fill="none" stroke={colors.accents} strokeWidth="3" rx="2"/>
              <line x1="275" y1="160" x2="275" y2="200" stroke={colors.accents} strokeWidth="2"/>
              <line x1="250" y1="180" x2="300" y2="180" stroke={colors.accents} strokeWidth="2"/>
              
              <motion.rect
                x="175" y="180" width="50" height="60"
                fill={colors.door}
                animate={{ fill: colors.door }}
                transition={{ duration: 0.5 }}
                rx="3"
              />
              <circle cx="215" cy="212" r="4" fill="#CFD8DC"/>
              
              <rect x="140" y="90" width="35" height="25" fill="url(#windowGradient)" rx="2"/>
              <rect x="140" y="90" width="35" height="25" fill="none" stroke={colors.accents} strokeWidth="2" rx="2"/>
              
              <rect x="225" y="90" width="35" height="25" fill="url(#windowGradient)" rx="2"/>
              <rect x="225" y="90" width="35" height="25" fill="none" stroke={colors.accents} strokeWidth="2" rx="2"/>
              
              <rect x="190" y="50" width="20" height="30" fill="#78909C"/>
              <rect x="190" y="50" width="20" height="5" fill="#607D8B"/>
            </motion.g>

            <ellipse cx="50" cy="200" rx="30" ry="40" fill="#4CAF50" opacity="0.9"/>
            <ellipse cx="55" cy="195" rx="25" ry="35" fill="#66BB6A" opacity="0.8"/>
            
            <ellipse cx="350" cy="210" rx="25" ry="30" fill="#4CAF50" opacity="0.9"/>
            <ellipse cx="355" cy="205" rx="20" ry="25" fill="#66BB6A" opacity="0.8"/>

            {environment === 2 && (
              <>
                <circle cx="350" cy="50" r="20" fill="#FFFDE7" opacity="0.9"/>
                <circle cx="80" cy="40" r="2" fill="#FFF" opacity="0.8"/>
                <circle cx="120" cy="60" r="1.5" fill="#FFF" opacity="0.6"/>
                <circle cx="300" cy="35" r="1" fill="#FFF" opacity="0.7"/>
                <circle cx="250" cy="55" r="1.5" fill="#FFF" opacity="0.5"/>
                <circle cx="150" cy="45" r="2" fill="#FFF" opacity="0.7"/>
              </>
            )}
          </motion.svg>
        </motion.div>

        <div className="visualizer-controls">
          <div className="section-tabs">
            {sections.map(section => (
              <button
                key={section.key}
                className={`section-tab ${activeSection === section.key ? 'active' : ''}`}
                onClick={() => setActiveSection(section.key)}
              >
                <span className="tab-icon">{section.icon}</span>
                <span className="tab-label">{section.label}</span>
              </button>
            ))}
          </div>

          <div className="color-palette">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                className="color-grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {COLOR_PALETTES[activeSection].map((item, index) => (
                  <motion.button
                    key={item.name}
                    className={`color-swatch ${colors[activeSection] === item.color ? 'selected' : ''}`}
                    style={{ backgroundColor: item.color }}
                    onClick={() => handleColorChange(item.color)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    title={item.name}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="presets-row">
            <span className="presets-label">Presets:</span>
            <div className="preset-buttons">
              {PRESETS.map(preset => (
                <button
                  key={preset.name}
                  className="preset-btn"
                  onClick={() => applyPreset(preset)}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="environment-toggle">
            {ENVIRONMENTS.map((env, index) => {
              const Icon = env.icon;
              return (
                <button
                  key={env.name}
                  className={`env-btn ${environment === index ? 'active' : ''}`}
                  onClick={() => setEnvironment(index)}
                  title={env.name}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FutureHomeVisualizer;
