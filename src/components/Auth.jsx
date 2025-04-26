
import React from 'react';
import './Auth.css';

export default function Auth({ onLogin }) {
  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign-in
    console.log('Google sign in clicked');
  };

  const handleAppleSignIn = () => {
    // TODO: Implement Apple sign-in
    console.log('Apple sign in clicked');
  };

  return (
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
