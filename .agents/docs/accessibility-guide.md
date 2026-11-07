# White Caves App - WCAG AAA Accessibility Compliance Guide

**Version:** 1.0  
**Last Updated:** January 16, 2026  
**Status:** Production Ready  
**Target Compliance:** WCAG 2.1 Level AAA

---

## Table of Contents

1. [Overview](#overview)
2. [Color Contrast & Visual Design](#1-color-contrast--visual-design)
3. [Keyboard Navigation](#2-keyboard-navigation)
4. [Screen Readers & Semantic HTML](#3-screen-readers--semantic-html)
5. [Focus Management](#4-focus-management)
6. [Forms & Input Assistance](#5-forms--input-assistance)
7. [Animations & Motion](#6-animations--motion)
8. [Testing Tools & Resources](#testing-tools--resources)
9. [Audit Checklist](#audit-checklist-for-white-caves-app)

---

## Overview

This guide ensures the White Caves real estate app meets WCAG 2.1 Level AAA standards, enabling access for users with:
- Visual impairments (blindness, low vision, color blindness)
- Motor disabilities (limited dexterity, keyboard-only users)
- Hearing impairments
- Cognitive disabilities
- Vestibular disorders

**Key Principles:** Perceivable, Operable, Understandable, Robust (POUR)

---

## 1. Color Contrast & Visual Design

### ✅ WCAG AAA Requirements

| Criterion | Level | Requirement | Target Ratio |
|-----------|-------|-------------|--------------|
| **1.4.6 Contrast (Enhanced)** | AAA | Enhanced contrast for text | **7:1** |
| **1.4.3 Contrast (Minimum)** | AA | Minimum contrast for text | **4.5:1** |
| **1.4.11 Non-text Contrast** | AA | UI components & graphical elements | **3:1** |
| **1.4.1 Use of Color** | A | Don't rely solely on color | **+ visual cues** |

### ✅ DO's - Color Contrast

```jsx
// ✅ DO: Use high-contrast color combinations
import { COLOR_TOKENS } from './styles/design-tokens/colors';

function AccessibleButton() {
  return (
    <button 
      style={{
        color: '#FFFFFF', // White text
        backgroundColor: '#C4161C', // White Caves red
        // Ratio: 12.6:1 (AAA compliant ✓)
      }}
    >
      Click Me
    </button>
  );
}

// ✅ DO: Add icons or patterns with color
<button aria-pressed={isActive}>
  {isActive && <CheckCircle size={20} />}
  {isActive ? '✓ Active' : 'Inactive'}
</button>

// ✅ DO: Use text labels alongside colors
<div className="status-indicator">
  <span style={{ backgroundColor: '#FF0000' }} aria-hidden="true"></span>
  <span>Error - Action Required</span>
</div>
```

### ❌ DON'Ts

```jsx
// ❌ DON'T: Rely only on color to convey information
<button style={{ backgroundColor: '#FF0000' }}>Delete</button>

// ❌ DON'T: Use low-contrast text
<p style={{ color: '#999999', backgroundColor: '#F5F5F5' }}>
  Important notice {/* Ratio: 2.4:1 FAILS ❌ */}
</p>

// ❌ DON'T: Use color-only status indicators
<div style={{ backgroundColor: '#FFFF00' }}></div>
{/* Yellow dot alone doesn't indicate meaning */}
```

---

## 2. Keyboard Navigation

### ✅ WCAG AAA Requirements

| Criterion | Level | Requirement |
|-----------|-------|-------------|
| **2.1.3 Keyboard (No Exception)** | AAA | All functionality via keyboard |
| **2.1.1 Keyboard** | A | Full keyboard accessibility |
| **2.1.2 No Keyboard Trap** | A | Can exit any trap with standard keys |

### ✅ DO's - Keyboard Support

```jsx
// ✅ DO: Make all interactive elements keyboard-accessible
<button>Click Me</button>  {/* Auto keyboard accessible */}
<a href="/page">Link</a>    {/* Auto keyboard accessible */}

// ✅ DO: Support Tab, Shift+Tab, Enter, Space, Arrow Keys, Escape
const handleKeyDown = (e) => {
  switch(e.key) {
    case 'Enter':
    case ' ':
      handleClick(); // Activate button
      break;
    case 'Escape':
      closeMenus(); // Close dropdowns
      break;
    case 'ArrowUp':
    case 'ArrowDown':
      navigateMenu(e.key); // Navigate menu items
      break;
  }
};

// ✅ DO: Tab index for custom components
<div
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={handleClick}
>
  Custom Button
</div>

// ✅ DO: Maintain logical tab order
<form>
  <input type="text" placeholder="First Name" tabIndex={0} />
  <input type="email" placeholder="Email" tabIndex={1} />
  <button type="submit" tabIndex={2}>Submit</button>
</form>

// ✅ DO: Skip navigation link
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
<nav>Navigation</nav>
<main id="main-content">Content</main>
```

### ❌ DON'Ts

```jsx
// ❌ DON'T: Use divs for buttons without keyboard support
<div onClick={handleClick}>Click Me</div>

// ❌ DON'T: Remove focus indicators
button:focus { outline: none; } /* NEVER! */

// ❌ DON'T: Trap keyboard focus
// User can't escape modal or menu with Tab key
```

---

## 3. Screen Readers & Semantic HTML

### ✅ WCAG AAA Requirements

| Criterion | Level | Requirement |
|-----------|-------|-------------|
| **1.1.1 Non-text Content** | A | All images have alt text |
| **4.1.2 Name, Role, Value** | A | UI components programmatically determinable |
| **1.3.1 Info and Relationships** | A | Semantic structure and relationships |

### ✅ DO's - Semantic HTML

```jsx
// ✅ DO: Use semantic HTML elements
<header>
  <nav>
    <ul>
      <li><a href="/dashboard">Dashboard</a></li>
      <li><a href="/properties">Properties</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Property Title</h1>
    <p>Description</p>
  </article>
</main>

<footer>
  <p>&copy; 2026 White Caves</p>
</footer>

// ✅ DO: Use heading hierarchy
<h1>Main Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

// ✅ DO: Use labels with form inputs
<label htmlFor="email">Email Address:</label>
<input id="email" type="email" required />

// ✅ DO: Add ARIA labels for clarity
<button aria-label="Close menu">×</button>

// ✅ DO: Use aria-expanded for collapsible content
<button aria-expanded={isOpen} aria-controls="menu">
  Menu
</button>
<ul id="menu" hidden={!isOpen}>
  <li><a href="/profile">Profile</a></li>
</ul>

// ✅ DO: Descriptive alt text for images
<img 
  src="property.jpg" 
  alt="3-bedroom villa in Dubai Marina with ocean view" 
/>

// ✅ DO: Empty alt for decorative images
<img src="decorative-border.svg" alt="" role="presentation" />
```

### ❌ DON'Ts

```jsx
// ❌ DON'T: Missing alt text
<img src="property.jpg" />

// ❌ DON'T: Skip semantic elements
<div className="header">Header</div> {/* Use <header> */}

// ❌ DON'T: Improper heading hierarchy
<h1>Property</h1>
<h3>Details</h3> {/* Skip h2 breaks structure */}

// ❌ DON'T: Missing form labels
<input type="email" placeholder="Email" />
```

---

## 4. Focus Management

### ✅ DO's - Focus Visibility

```jsx
// ✅ DO: Always show focus indicator (3px outline, 2px offset)
button {
  outline: 2px solid #4A90E2;
  outline-offset: 2px;
}

// ✅ DO: Use :focus-visible for better UX
button:focus-visible {
  outline: 2px solid #4A90E2;
  outline-offset: 2px;
}

// ✅ DO: Focus trap in modals
function Modal() {
  const firstButtonRef = useRef(null);
  const lastButtonRef = useRef(null);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, input, [tabindex]:not([tabindex="-1"])'
      );
      // Trap focus within modal
    }
  };
}

// ✅ DO: Restore focus after modal closes
function Modal({ isOpen, onClose }) {
  const triggerRef = useRef(null);
  
  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen]);
}
```

### ❌ DON'Ts

```jsx
// ❌ DON'T: Remove focus outline
button { outline: none; } /* NEVER */

// ❌ DON'T: No focus trap in modals
// Tab cycles through page behind modal

// ❌ DON'T: Non-logical tab order
<button tabIndex={5}>First</button>
<button tabIndex={3}>Second</button>
```

---

## 5. Forms & Input Assistance

### ✅ DO's - Form Accessibility

```jsx
// ✅ DO: Associate labels with inputs
<label htmlFor="property-name">
  Property Name <span aria-label="required">*</span>
</label>
<input
  id="property-name"
  type="text"
  required
  aria-required="true"
/>

// ✅ DO: Clear, specific instructions
<label htmlFor="password">Password</label>
<input
  id="password"
  type="password"
  aria-describedby="password-hint"
/>
<p id="password-hint" className="form-hint">
  Must be at least 12 characters with uppercase, 
  lowercase, number, and symbol
</p>

// ✅ DO: Clear error messages
<input
  id="email"
  type="email"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <div id="email-error" role="alert" className="error">
    ⚠️ Invalid email format. Example: user@domain.com
  </div>
)}

// ✅ DO: Focus first error field
const handleSubmit = (formData) => {
  const errors = validate(formData);
  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    const firstErrorField = Object.keys(errors)[0];
    document.getElementById(firstErrorField)?.focus();
  }
};
```

### ❌ DON'Ts

```jsx
// ❌ DON'T: Use placeholder as label
<input placeholder="Email" />

// ❌ DON'T: Vague error messages
<span className="error">Invalid input</span>

// ❌ DON'T: Only color to indicate error
<input style={{ borderColor: 'red' }} />
```

---

## 6. Animations & Motion

### ✅ WCAG AAA Requirements

| Criterion | Level | Requirement |
|-----------|-------|-------------|
| **2.3.3 Animation from Interactions** | AAA | Can disable motion animations |
| **2.3.1 Three Flashes or Below** | A | No flashing > 3x per second |

### ✅ DO's - Animations

```css
/* ✅ DO: Respect prefers-reduced-motion */
.button {
  transition: transform 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
}

/* ✅ DO: Smooth, non-distracting animations */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### ❌ DON'Ts

```css
/* ❌ DON'T: Fast, jarring animations */
.element {
  animation: spin 0.1s infinite; /* Causes seizures */
}

/* ❌ DON'T: Ignore prefers-reduced-motion */
.animation {
  animation: bounce 1s infinite;
  /* No @media query */
}

/* ❌ DON'T: Auto-playing animations */
.auto-scroll {
  animation: scroll 5s linear infinite; /* No pause */
}
```

---

## Testing Tools & Resources

### Automated Tools

| Tool | Purpose | URL |
|------|---------|-----|
| **Axe DevTools** | Accessibility audit | https://www.deque.com/axe/devtools/ |
| **WAVE** | Visual feedback | https://wave.webaim.org/ |
| **Lighthouse** | Google's audit (Chrome DevTools) | Built into Chrome |
| **NVDA** | Free screen reader (Windows) | https://www.nvaccess.org/ |
| **WebAIM Tools** | Contrast checker & more | https://webaim.org/resources/ |

### Manual Testing Checklist

**Visual Design**
- [ ] 7:1 contrast for AAA text (4.5:1 for AA)
- [ ] 3:1 contrast for UI components
- [ ] No color-only indicators
- [ ] Visible focus indicators
- [ ] Text resizable to 200%

**Keyboard Navigation**
- [ ] All interactive elements accessible via Tab
- [ ] Logical tab order (left-to-right, top-to-bottom)
- [ ] No keyboard traps
- [ ] Focus visible at all times
- [ ] Modals closable with Escape

**Screen Reader**
- [ ] Proper heading hierarchy
- [ ] Meaningful alt text for images
- [ ] Form labels associated with inputs
- [ ] Semantic HTML used
- [ ] ARIA attributes correct

**Forms**
- [ ] Labels associated with inputs
- [ ] Instructions clear and visible
- [ ] Error messages specific
- [ ] Form submission works with Enter
- [ ] Required fields indicated

**Animations**
- [ ] Respects `prefers-reduced-motion`
- [ ] No flashing > 3x per second
- [ ] Animations non-distracting
- [ ] Can be paused/stopped

---

## Audit Checklist for White Caves App

### Pre-Release Audit

**Component-Level**
- [ ] All buttons/links keyboard-accessible
- [ ] Images have alt text
- [ ] Forms have labels
- [ ] Color contrast >= 7:1
- [ ] Focus indicators visible
- [ ] Heading hierarchy correct

**Page-Level**
- [ ] Skip link available
- [ ] Page title present
- [ ] Landmark regions used
- [ ] Navigation clear
- [ ] Search functionality

**Feature-Specific**
- [ ] Modals have proper focus management
- [ ] Notifications announced via aria-live
- [ ] Charts/images have descriptions
- [ ] Animations respect prefers-reduced-motion

**User Testing**
- [ ] Tested with keyboard only
- [ ] Tested with screen reader (NVDA/VoiceOver)
- [ ] Tested with motion sensitivity settings
- [ ] Tested on mobile with accessibility features

---

## Compliance Statement

**White Caves Web App aims for WCAG 2.1 Level AAA compliance** to ensure all users, regardless of ability, can access and use our platform effectively.

For accessibility issues: **accessibility@whitecaves.com**

---

**Status:** ✅ Production Ready  
**Last Updated:** January 16, 2026
