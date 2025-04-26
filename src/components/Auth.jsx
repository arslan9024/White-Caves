
import React from 'react';

export default function Auth({ onLogin }) {
  return (
    <div className="auth-container">
      <script
        src="https://auth.util.repl.co/script.js"
        authed="location.reload()"
      ></script>
    </div>
  );
}
