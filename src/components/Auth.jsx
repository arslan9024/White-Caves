
import React, { useState } from 'react';
import './Auth.css';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import Profile from './Profile';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  appId: process.env.FIREBASE_APP_ID
};

initializeApp(firebaseConfig);

export default function Auth({ onLogin }) {
  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setCurrentUser(result.user);
      onLogin(result.user);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleAppleSignIn = () => {
    // TODO: Implement Apple sign-in
    console.log('Apple sign in clicked');
  };

  const [currentUser, setCurrentUser] = useState(null);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return currentUser ? (
    <Profile user={currentUser} onLogout={handleLogout} />
  ) : (
    <div className="auth-container">
      <div className="auth-methods">
        <script
          src="https://auth.util.repl.co/script.js"
          authed="location.reload()"
        ></script>
        <button className="auth-btn google" onClick={handleGoogleSignIn}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
          Sign in with Google
        </button>
        <button className="auth-btn apple" onClick={handleAppleSignIn}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
          Sign in with Apple
        </button>
      </div>
    </div>
  );
}
