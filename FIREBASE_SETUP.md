# Firebase Setup Guide for White Caves Real Estate Platform

This guide will walk you through setting up Firebase Authentication for the White Caves luxury real estate application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Create Firebase Project](#create-firebase-project)
3. [Enable Authentication Methods](#enable-authentication-methods)
4. [Get Firebase Configuration](#get-firebase-configuration)
5. [Configure Environment Variables](#configure-environment-variables)
6. [Testing Authentication](#testing-authentication)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- A Google account
- Access to the [Firebase Console](https://console.firebase.google.com/)
- Your Replit project open and ready

---

## Create Firebase Project

### Step 1: Go to Firebase Console

1. Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**

### Step 2: Project Setup

1. **Enter project name**: `white-caves-real-estate` (or your preferred name)
2. Click **"Continue"**
3. **Google Analytics** (Optional): 
   - You can disable this for now or enable it if you want analytics
4. Click **"Create project"**
5. Wait for the project to be created (this takes a few seconds)
6. Click **"Continue"** when ready

---

## Enable Authentication Methods

### Step 1: Navigate to Authentication

1. In your Firebase project dashboard, click **"Authentication"** in the left sidebar
2. Click **"Get started"** button

### Step 2: Enable Sign-in Methods

#### Google Sign-In (Required)
1. Click on the **"Sign-in method"** tab
2. Click on **"Google"**
3. Toggle the **"Enable"** switch
4. **Project support email**: Select your email from the dropdown
5. Click **"Save"**

#### Facebook Sign-In (Required)
1. Click **"Add new provider"**
2. Select **"Facebook"**
3. Toggle the **"Enable"** switch
4. You'll need a **Facebook App ID** and **App Secret**:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app or use an existing one
   - In your Facebook App settings, find **App ID** and **App Secret**
   - Copy the OAuth redirect URI from Firebase and add it to your Facebook App settings
5. Paste the **App ID** and **App Secret** into Firebase
6. Click **"Save"**

#### Apple Sign-In (Required)
1. Click **"Add new provider"**
2. Select **"Apple"**
3. Toggle the **"Enable"** switch
4. You'll need an **Apple Developer account** (paid membership required)
5. Follow Firebase's instructions to configure Apple Sign-In
6. Click **"Save"**

#### Email/Password Sign-In (Required)
1. Click **"Add new provider"**
2. Select **"Email/Password"**
3. Toggle the **"Enable"** switch for **Email/Password**
4. You can optionally enable **Email link (passwordless sign-in)** if desired
5. Click **"Save"**

#### Phone Sign-In (Required)
1. Click **"Add new provider"**
2. Select **"Phone"**
3. Toggle the **"Enable"** switch
4. **Test phone numbers** (Optional for development):
   - Add test phone numbers with verification codes (e.g., +971501234567 with code 123456)
   - This allows testing without sending real SMS messages
5. Click **"Save"**

---

## Get Firebase Configuration

### Step 1: Register Your Web App

1. In the Firebase Console, click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (`</>`) to add a web app
5. **Register app**:
   - **App nickname**: `White Caves Web App`
   - **Firebase Hosting**: Leave unchecked (we're using Replit)
6. Click **"Register app"**

### Step 2: Copy Configuration

You'll see a code snippet like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**Important**: Copy these values! You'll need them in the next step.

### Step 3: Click "Continue to console"

---

## Configure Environment Variables

### Method 1: Using Replit Secrets (Recommended)

1. In your Replit project, click the **"Tools"** button in the left sidebar
2. Select **"Secrets"**
3. Add the following secrets (click "+ New Secret" for each):

| Secret Key | Value | Example |
|------------|-------|---------|
| `VITE_FIREBASE_API_KEY` | Your Firebase API Key | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your Auth Domain | `your-project-id.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Your Project ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your Storage Bucket | `your-project-id.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your Messaging Sender ID | `123456789012` |
| `VITE_FIREBASE_APP_ID` | Your App ID | `1:123456789012:web:abcdef1234567890` |

**Note**: All keys must start with `VITE_` to be accessible in the frontend (Vite requirement).

### Method 2: Using .env File (Development Only)

If you prefer a `.env` file for local development:

1. Create a file named `.env` in your project root
2. Add the following (replace with your actual values):

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

3. Make sure `.env` is in your `.gitignore` file (it should already be there)

**Important**: Never commit the `.env` file to Git. Always use Replit Secrets for production.

---

## Testing Authentication

### Step 1: Restart Your Application

After adding the environment variables, restart your Replit application:
- Click the **"Stop"** button if running
- Click **"Run"** to start again

### Step 2: Test Each Authentication Method

#### Google Sign-In
1. Open your application
2. Click on the **"Social Login"** tab
3. Click **"Sign in with Google"**
4. You should see a Google sign-in popup
5. Select your Google account
6. Grant permissions
7. You should be redirected back and logged in

#### Facebook Sign-In
1. Click **"Sign in with Facebook"**
2. Follow the Facebook authentication flow
3. Grant permissions
4. Verify you're logged in

#### Apple Sign-In
1. Click **"Sign in with Apple"**
2. Follow the Apple authentication flow
3. Verify you're logged in

#### Email/Password
1. Click on the **"Email"** tab
2. Click **"Sign Up"** toggle
3. Enter an email and password
4. Click **"Sign Up"**
5. Try logging in with the same credentials

#### Mobile/Phone
1. Click on the **"Mobile"** tab
2. Enter a phone number (use test numbers if configured)
3. Click **"Send OTP"**
4. Enter the verification code
5. Click **"Verify & Sign In"**

### Step 3: Check Browser Console

Open your browser's Developer Tools (F12) and check the Console tab:
- **No errors**: Firebase is working correctly
- **Errors**: See the Troubleshooting section below

---

## Troubleshooting

### Issue: "Firebase: Error (auth/configuration-not-found)"

**Solution**: Your environment variables are not set correctly.
- Double-check that all `VITE_` prefixed variables are added to Replit Secrets
- Restart your application after adding secrets

### Issue: "Firebase app named '[DEFAULT]' already exists"

**Solution**: Firebase is being initialized multiple times.
- This is usually harmless but indicates a code issue
- Check that `firebase.js` only initializes once
- Clear your browser cache and reload

### Issue: Google Sign-In Popup Blocked

**Solution**: 
- Allow popups for your Replit domain
- Check your browser's popup blocker settings
- Make sure you're using HTTPS (Replit does this automatically)

### Issue: "This domain is not authorized"

**Solution**: Add your Replit domain to Firebase authorized domains.
1. Go to Firebase Console > Authentication > Settings
2. Scroll to **"Authorized domains"**
3. Click **"Add domain"**
4. Add your Replit domain (e.g., `your-project.repl.co`)
5. Click **"Add"**

### Issue: Facebook/Apple Sign-In Not Working

**Solution**: 
- Verify you've completed the Facebook/Apple Developer setup
- Check that redirect URLs match exactly
- Ensure App IDs and Secrets are correct
- Check Firebase Console for any error messages

### Issue: Phone Authentication Not Sending SMS

**Solution**:
- For development, use test phone numbers in Firebase Console
- For production, you may need to enable billing in Firebase (free tier has limits)
- Verify phone number format (E.164 format: +971501234567)

### Issue: Environment Variables Not Loading

**Solution**:
1. Restart the Replit application completely
2. Check that variable names are exactly as shown (case-sensitive)
3. Verify secrets are added to the correct Replit project
4. Check browser console for specific error messages

---

## Security Best Practices

### 1. Never Commit Secrets
- Always use Replit Secrets or `.env` files
- Add `.env` to `.gitignore`
- Never hardcode API keys in your code

### 2. Configure Firebase Security Rules
Once you start using Firebase Firestore or Storage:
1. Go to Firebase Console > Firestore Database > Rules
2. Set up proper security rules based on user authentication
3. Never use `allow read, write: if true;` in production

### 3. Enable App Check (Optional but Recommended)
1. Go to Firebase Console > App Check
2. Follow the setup wizard
3. This prevents unauthorized access to your Firebase resources

### 4. Monitor Usage
1. Go to Firebase Console > Usage
2. Set up budget alerts
3. Monitor authentication metrics

---

## Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Facebook Developer Console](https://developers.facebook.com/)
- [Apple Developer Console](https://developer.apple.com/)
- [Replit Secrets Documentation](https://docs.replit.com/programming-ide/workspace-features/secrets)

---

## Need Help?

If you encounter issues not covered in this guide:
1. Check the browser console for specific error messages
2. Review Firebase Console > Authentication > Users to see if sign-ups are recorded
3. Verify all environment variables are set correctly
4. Clear browser cache and cookies
5. Try authentication in an incognito/private window

---

**Last Updated**: November 3, 2025  
**Version**: 1.0  
**Application**: White Caves Real Estate Platform
