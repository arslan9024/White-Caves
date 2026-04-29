/**
 * Transitions and Animations
 * Timing functions and duration constants for consistent motion
 */

export const transitions = {
  // Duration presets (in milliseconds)
  durations: {
    shortest: '150ms',
    shorter: '200ms',
    short: '250ms',
    standard: '300ms',
    complex: '375ms',
    enteringScreen: '225ms',
    leavingScreen: '195ms',
  },

  // Easing functions
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    linear: 'linear',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },

  // Preset transitions
  create: (props = 'all', duration = '300ms', easing = 'cubic-bezier(0.4, 0, 0.2, 1)') =>
    `${props} ${duration} ${easing}`,

  // Common transitions
  background: `background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)`,
  color: `color 300ms cubic-bezier(0.4, 0, 0.2, 1)`,
  transform: `transform 300ms cubic-bezier(0.4, 0, 0.2, 1)`,
  opacity: `opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)`,
  shadow: `box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)`,
  all: `all 300ms cubic-bezier(0.4, 0, 0.2, 1)`,

  // Component-specific
  hover: `all 200ms cubic-bezier(0.4, 0, 0.2, 1)`,
  focus: `all 250ms cubic-bezier(0.4, 0, 0.2, 1)`,
  active: `all 150ms cubic-bezier(0.4, 0, 0.2, 1)`,
};

export const keyframes = {
  // Fade animations
  fadeIn: `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,

  fadeOut: `
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `,

  // Scale animations
  scaleIn: `
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

  // Slide animations
  slideInLeft: `
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,

  slideInRight: `
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,

  slideInUp: `
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

  slideOutDown: `
    @keyframes slideOutDown {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(20px);
      }
    }
  `,

  // Spin animation
  spin: `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,

  // Pulse animation
  pulse: `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `,
};

export type Transitions = typeof transitions;
export type Keyframes = typeof keyframes;
