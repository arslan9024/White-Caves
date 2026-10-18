import React, { useEffect, useRef, useState } from 'react';
import { driveRequest } from '../../services/henryDrive';

export default function HenryDriveCallback() {
  const started = useRef(false);
  const [message, setMessage] = useState('Completing separate-account Drive authorization…');
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code'), state = query.get('state');
    // Remove authorization codes before rendering links, loading further resources or making API calls.
    window.history.replaceState(null, '', '/henry-drive-callback');
    if (query.has('error') || !code || !state) {
      setMessage('Google authorization was not completed. Close this window and reconnect from Henry.');
      return;
    }
    void driveRequest('finish', { code, state }).then(() => {
      setMessage('Drive connected. Close this window, then reload Drive status in Henry and explicitly approve folders.');
      window.opener?.postMessage({ type: 'henry-drive-connected' }, window.location.origin);
    }).catch(() => setMessage('Drive authorization failed or expired. Close this window and reconnect from the same signed-in Henry session.'));
  }, []);
  return <main><h1>Henry Drive connection</h1><p role="status">{message}</p>
    <p>No access tokens are placed in this URL. No files are indexed until folders are explicitly approved.</p></main>;
}
