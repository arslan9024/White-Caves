# Quick Integration Guide - Phase 2 Components

## 🚀 Quick Start

### 1. Using LoadingSkeleton

```jsx
import LoadingSkeleton from '@/components/LoadingSkeleton';

// In your component
if (loading) {
  return <LoadingSkeleton variant="card" count={4} height={120} />;
}
```

### 2. Using Form Validators

```jsx
import { validateEmail, validatePhone, validateForm } from '@/utils/validators';

// Single field validation
const emailResult = validateEmail(email);
if (!emailResult.valid) {
  setEmailError(emailResult.error);
}

// Full form validation
const schema = {
  email: val => validateEmail(val),
  phone: val => validatePhone(val),
  emiratesId: val => validateEmiratesId(val),
};

const { isValid, errors } = validateForm(formData, schema);
```

### 3. Error Boundaries

ErrorBoundary is already configured globally. For specific sections:

```jsx
<ErrorBoundary>
  <CriticalComponent />
</ErrorBoundary>
```

### 4. Monitoring Errors

```javascript
// Get recent errors
fetch('/api/errors/list?days=7')
  .then(res => res.json())
  .then(data => console.log(data.errors));

// Get error statistics
fetch('/api/errors/stats?days=7')
  .then(res => res.json())
  .then(data => console.log(data.stats));
```

---

## 🎯 Next Integration Tasks

### Priority 1: Dashboard Loading States (2 hours)

Apply LoadingSkeleton to:

1. `BuyerDashboardPage.jsx`
2. `SellerDashboardPage.jsx`
3. `TenantDashboardPage.jsx`
4. Any other dashboard with loading state

**Template:**

```jsx
if (loading) {
  return (
    <RolePageLayout...>
      <LoadingSkeleton variant="card" count={4} height={120} />
      <div style={{ marginTop: '20px' }}>
        <LoadingSkeleton variant="table" />
      </div>
    </RolePageLayout>
  );
}
```

### Priority 2: Form Validation Integration (3 hours)

Update these forms with validators:

1. `ContactForm.jsx` - Email, phone, required fields
2. `CreateTenancyAgreement.jsx` - Emirates ID, dates, price
3. `ProfilePage.jsx` - Email, phone, password

**Template:**

```jsx
import { validateEmail, validateRequired, validatePassword } from '@/utils/validators';

const [errors, setErrors] = useState({});

const handleValidation = (field, value) => {
  let result;
  switch (field) {
    case 'email':
      result = validateEmail(value);
      break;
    case 'phone':
      result = validatePhone(value);
      break;
    default:
      result = validateRequired(value, field);
  }

  setErrors(prev => ({
    ...prev,
    [field]: result.error || '',
  }));
};
```

### Priority 3: Error Boundaries on Pages (2 hours)

Wrap major pages with ErrorBoundary for stability:

```jsx
<ErrorBoundary>
  <PropertyDetailPage />
</ErrorBoundary>
```

Apply to:

- `PropertyDetailPage.jsx`
- `PropertySearchPage.jsx`
- All role-specific dashboard pages
- Admin pages

---

## 📋 Validator Reference

### Email

```javascript
validateEmail('test@example.com') → { valid: true }
validateEmail('invalid') → { valid: false, error: '...' }
```

### Phone (UAE Format)

Accepts: `+971501234567`, `00971501234567`, `0501234567`

```javascript
validatePhone('0501234567') → { valid: true }
validatePhone('123456') → { valid: false, error: '...' }
```

### Emirates ID

Format: `784-XXXX-XXXXXXX-X`

```javascript
validateEmiratesId('784-1234-1234567-8') → { valid: true }
```

### Password

Min 8 chars + uppercase + lowercase + number + special char

```javascript
validatePassword('Pass123!') → { valid: true }
validatePassword('weak') → { valid: false, error: '...' }
```

### Price

```javascript
validatePrice('5000') → { valid: true }
validatePrice('-100') → { valid: false, error: '...' }
validatePrice('0') → { valid: false, error: '...' }
```

### Date

```javascript
validateDate('2026-01-16') → { valid: true }
validateFutureDate('2026-12-31') → { valid: true }
validatePastDate('2025-01-01') → { valid: true }
```

---

## 🔍 Monitoring & Debugging

### View Error Logs

```bash
# See recent errors
ls -la server/logs/

# View today's errors
cat server/logs/errors-2026-01-16.log

# Get error count
wc -l server/logs/errors-2026-01-16.log
```

### API Endpoints for Admins

```javascript
// Get all errors from past 7 days
GET /api/errors/list?days=7

// Get error statistics
GET /api/errors/stats?days=7

// Expected response
{
  stats: {
    totalErrors: 24,
    errorsByEnvironment: { production: 15, development: 9 },
    errorsByPage: { '/dashboard': 8, '/search': 6, ... },
    errorsByMessage: { TypeError: 5, ReferenceError: 3, ... },
    recentErrors: [...]
  }
}
```

---

## 🎨 LoadingSkeleton Variants

### Card Skeleton

Perfect for stat cards, property cards, data cards

```jsx
<LoadingSkeleton variant="card" count={4} height={120} />
```

### List Skeleton

Perfect for list items with avatar + text

```jsx
<LoadingSkeleton variant="list" count={5} />
```

### Table Skeleton

Perfect for data tables

```jsx
<LoadingSkeleton variant="table" count={1} />
```

---

## ⚠️ Common Mistakes to Avoid

1. **Don't forget cleanup in useEffect:**

   ```jsx
   // ❌ Wrong - Memory leak
   useEffect(() => {
     window.addEventListener('scroll', handler);
   }, []);

   // ✅ Correct
   useEffect(() => {
     window.addEventListener('scroll', handler);
     return () => window.removeEventListener('scroll', handler);
   }, []);
   ```

2. **Don't skip error boundary wrapping:**

   ```jsx
   // ❌ Wrong - Entire app crashes
   <App>
     <CrashyComponent />
   </App>

   // ✅ Correct
   <App>
     <ErrorBoundary>
       <CrashyComponent />
     </ErrorBoundary>
   </App>
   ```

3. **Always check validator result:**

   ```jsx
   // ❌ Wrong
   const valid = validateEmail(email);

   // ✅ Correct
   const { valid, error } = validateEmail(email);
   if (!valid) setError(error);
   ```

---

## 📞 Support

For questions about:

- **ErrorBoundary**: See `src/components/ErrorBoundary.jsx`
- **LoadingSkeleton**: See `src/components/LoadingSkeleton.jsx` and `.css`
- **Validators**: See `src/utils/validators.js`
- **Error Logging**: See `server/routes/errors.js`

All files include detailed comments and examples.

---

## ✅ Checklist Before Going to Production

- [ ] All dashboards have loading states
- [ ] All forms validated with proper error messages
- [ ] Major pages wrapped with ErrorBoundary
- [ ] Error logging tested in development
- [ ] `/api/errors/stats` endpoint working
- [ ] No console warnings about missing props
- [ ] LoadingSkeleton shimmer animation smooth
- [ ] Validators tested with edge cases
- [ ] Error logs directory created at startup
- [ ] Rate limiting added to `/api/errors/log` if needed
