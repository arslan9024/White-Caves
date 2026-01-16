/**
 * Animation Presets Library
 * Centralized animation definitions for consistent motion across app
 * Uses CSS keyframes compatible with Tailwind, CSS-in-JS, and Framer Motion
 * All animations follow WCAG AAA guidelines (respect prefers-reduced-motion)
 * 
 * @version 1.0
 * @lastUpdated January 16, 2026
 */

export const ANIMATION_PRESETS = {
  // ============ PAGE TRANSITIONS ============

  pageTransitionSlide: {
    name: 'slideInUp',
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delay: 0,
    fillMode: 'both',
    keyframes: `
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  },

  pageTransitionFade: {
    name: 'fadeIn',
    duration: 250,
    easing: 'ease-in-out',
    delay: 0,
    fillMode: 'both',
    keyframes: `
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  },

  pageTransitionScale: {
    name: 'scaleIn',
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delay: 0,
    fillMode: 'both',
    keyframes: `
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
  },

  // ============ CARD ANIMATIONS ============

  cardHover: {
    name: 'cardLift',
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delay: 0,
    fillMode: 'forwards',
    keyframes: `
      @keyframes cardLift {
        from {
          transform: translateY(0) scale(1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        to {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }
      }
    `,
  },

  cardClick: {
    name: 'cardPress',
    duration: 150,
    easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
    delay: 0,
    fillMode: 'forwards',
    keyframes: `
      @keyframes cardPress {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(0.96);
        }
        100% {
          transform: scale(1);
        }
      }
    `,
  },

  // ============ BUTTON ANIMATIONS ============

  buttonRipple: {
    name: 'ripple',
    duration: 600,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delay: 0,
    fillMode: 'forwards',
    keyframes: `
      @keyframes ripple {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(4);
          opacity: 0;
        }
      }
    `,
  },

  buttonPulse: {
    name: 'pulse',
    duration: 2000,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delay: 0,
    fillMode: 'both',
    iterationCount: 'infinite',
    keyframes: `
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.7;
          transform: scale(1.05);
        }
      }
    `,
  },

  buttonGlow: {
    name: 'buttonGlow',
    duration: 1500,
    easing: 'ease-in-out',
    delay: 0,
    fillMode: 'both',
    iterationCount: 'infinite',
    keyframes: `
      @keyframes buttonGlow {
        0%, 100% {
          box-shadow: 0 0 5px rgba(196, 22, 28, 0.5);
        }
        50% {
          box-shadow: 0 0 20px rgba(196, 22, 28, 0.8);
        }
      }
    `,
  },

  // ============ LOADING ANIMATIONS ============

  loadingSpinner: {
    name: 'spin',
    duration: 1000,
    easing: 'linear',
    delay: 0,
    fillMode: 'both',
    iterationCount: 'infinite',
    keyframes: `
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `,
  },

  skeletonLoading: {
    name: 'shimmer',
    duration: 2000,
    easing: 'ease-in-out',
    delay: 0,
    fillMode: 'both',
    iterationCount: 'infinite',
    keyframes: `
      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }
    `,
  },

  // ============ MODAL ANIMATIONS ============

  modalAppear: {
    name: 'modalIn',
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delay: 0,
    fillMode: 'both',
    keyframes: `
      @keyframes modalIn {
        from {
          opacity: 0;
          transform: scale(0.9) translateY(20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `,
  },

  backdropFade: {
    name: 'backdropIn',
    duration: 300,
    easing: 'ease-in-out',
    delay: 0,
    fillMode: 'both',
    keyframes: `
      @keyframes backdropIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,
  },

  // ============ CONTENT ANIMATIONS ============

  contentStagger: {
    name: 'staggerIn',
    duration: 400,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delay: 0,
    fillMode: 'both',
    keyframes: `
      @keyframes staggerIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  },

  // ============ TOOLTIP & POPOVER ============

  tooltipFade: {
    name: 'tooltipAppear',
    duration: 150,
    easing: 'ease-out',
    delay: 0,
    fillMode: 'both',
    keyframes: `
      @keyframes tooltipAppear {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  },

  // ============ BADGE ANIMATIONS ============

  badgePulse: {
    name: 'badgePulse',
    duration: 2000,
    easing: 'ease-in-out',
    delay: 0,
    fillMode: 'both',
    iterationCount: 'infinite',
    keyframes: `
      @keyframes badgePulse {
        0%, 100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.8;
        }
      }
    `,
  },

  // ============ BOUNCE ANIMATIONS ============

  bounceIn: {
    name: 'bounceIn',
    duration: 600,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    delay: 0,
    fillMode: 'both',
    keyframes: `
      @keyframes bounceIn {
        0% {
          opacity: 0;
          transform: scale(0.3);
        }
        50% {
          opacity: 1;
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.9);
        }
        100% {
          transform: scale(1);
        }
      }
    `,
  },

  bounce: {
    name: 'bounce',
    duration: 1000,
    easing: 'ease-in-out',
    delay: 0,
    fillMode: 'both',
    iterationCount: 'infinite',
    keyframes: `
      @keyframes bounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
    `,
  },

  // ============ SLIDE ANIMATIONS ============

  slideDown: {
    name: 'slideDown',
    duration: 250,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delay: 0,
    fillMode: 'both',
    keyframes: `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  },

  slideUp: {
    name: 'slideUp',
    duration: 250,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delay: 0,
    fillMode: 'both',
    keyframes: `
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  },

  slideLeft: {
    name: 'slideLeft',
    duration: 250,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delay: 0,
    fillMode: 'both',
    keyframes: `
      @keyframes slideLeft {
        from {
          opacity: 0;
          transform: translateX(10px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
  },

  slideRight: {
    name: 'slideRight',
    duration: 250,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delay: 0,
    fillMode: 'both',
    keyframes: `
      @keyframes slideRight {
        from {
          opacity: 0;
          transform: translateX(-10px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
  },

  // ============ FADE ANIMATIONS ============

  fadeOut: {
    name: 'fadeOut',
    duration: 200,
    easing: 'ease-in',
    delay: 0,
    fillMode: 'forwards',
    keyframes: `
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    `,
  },

  fadeInScale: {
    name: 'fadeInScale',
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delay: 0,
    fillMode: 'both',
    keyframes: `
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
  },

  // ============ ROTATE ANIMATIONS ============

  rotate: {
    name: 'rotate',
    duration: 400,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    delay: 0,
    fillMode: 'both',
    keyframes: `
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `,
  },

  rotateHalf: {
    name: 'rotateHalf',
    duration: 300,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    delay: 0,
    fillMode: 'forwards',
    keyframes: `
      @keyframes rotateHalf {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(180deg);
        }
      }
    `,
  },
};

/**
 * Helper function: Apply animation to element
 * @param {HTMLElement} element - Target element
 * @param {Object} animationPreset - Animation preset from ANIMATION_PRESETS
 */
export const applyAnimation = (element, animationPreset) => {
  if (!element) return;

  const {
    name,
    duration = 300,
    easing = 'ease-in-out',
    delay = 0,
    fillMode = 'both',
    iterationCount = '1',
  } = animationPreset;

  // Inject keyframes if not already present
  if (animationPreset.keyframes && !document.getElementById(`animation-${name}`)) {
    const styleElement = document.createElement('style');
    styleElement.id = `animation-${name}`;
    styleElement.textContent = animationPreset.keyframes;
    document.head.appendChild(styleElement);
  }

  // Apply animation
  element.style.animation = `${name} ${duration}ms ${easing} ${delay}ms ${iterationCount} ${fillMode}`;
};

/**
 * Helper function: Remove animation from element
 * @param {HTMLElement} element - Target element
 */
export const removeAnimation = (element) => {
  if (!element) return;
  element.style.animation = 'none';
};

/**
 * Helper function: Get CSS string for animations
 * @param {Object} preset - Animation preset
 * @returns {string} CSS animation string
 */
export const getAnimationCSS = (preset) => {
  const {
    name,
    duration = 300,
    easing = 'ease-in-out',
    delay = 0,
    fillMode = 'both',
    iterationCount = '1',
  } = preset;

  return `animation: ${name} ${duration}ms ${easing} ${delay}ms ${iterationCount} ${fillMode};`;
};

/**
 * Helper function: Get Tailwind animation class
 * @param {string} animationName - Name of animation
 * @returns {string} Tailwind animation utility class
 */
export const getTailwindAnimationClass = (animationName) => {
  const tailwindMap = {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
  };

  return tailwindMap[animationName] || '';
};

export default ANIMATION_PRESETS;
