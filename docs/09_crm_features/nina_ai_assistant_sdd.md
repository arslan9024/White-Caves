# System Design Document (SDD) — Nina AI Assistant (Desk 3.2)

**Document Owner:** @Ada (Chief Architect) & Executive Council  
**System Target:** Desk 3.2 — Nina AI Master WhatsApp Bot Developer & Campaign Engine  
**Version:** 4.0.0  
**Status:** ✅ ARCHITECTURAL SPECIFICATION APPROVED  

---

## 1. System Architecture Overview

Nina AI Assistant (`Desk 3.2`) implements a 3-tier event-driven architecture combining a **React Frontend Command Center**, a **Node.js Express Server**, and the **`whatsapp-web.js` (v1.34.4) LocalAuth Engine**.

```
+-----------------------------------------------------------------------+
|                        REACT FRONTEND VIEWPORT                        |
|                                                                       |
|  +---------------------------------+  +----------------------------+  |
|  | Main System Viewport            |  | Nina 320px Right Panel     |  |
|  | - Stage 1: Device Link Portal   |  | - Character Sprite Avatar  |  |
|  | - Live Conversations Inbox      |  | - Web Speech API Subtitles |  |
|  | - DAMAC Hills 2 Auto-Reply DB   |  | - Gateway Status Card      |  |
|  +---------------------------------+  +----------------------------+  |
+-----------------------------------------------------------------------+
                                   |
                         WebSockets / HTTP REST API
                                   |
+-----------------------------------------------------------------------+
|                      NODE.JS EXPRESS BACKEND SERVER                   |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  | LindaClient (whatsapp-web.js LocalAuth Singleton)               |  |
|  | - STATE 0: DISCONNECTED                                         |  |
|  | - STATE 1: .on('qr')                                            |  |
|  | - STATE 2: .on('authenticated')                                 |  |
|  | - STATE 3: .on('ready') -> LIVE_CONNECTED_STREAM                |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
```

---

## 2. Hardware Session Lifecycle State Machine

1. **STATE 0 (DISCONNECTED)**: Private state `clientAuthenticated = false`.
2. **STATE 1 (QR_RECEIVED)**: Server catches `.on('qr', (qrStr) => ...)` and emits QR string to client. Nina announces: *"DEVICE LINK REQUIRED! SCAN THE QR MATRIX NOW!"*.
3. **STATE 2 (AUTHENTICATED)**: Server catches `.on('authenticated', () => ...)` and sets `clientAuthenticated = true`. Nina announces: *"AUTHENTICATION CONFIRMED!"*.
4. **STATE 3 (READY)**: Server catches `.on('ready', () => ...)` and emits `status: 'LIVE_CONNECTED_STREAM'`. Nina announces: *"GATEWAY CONNECTED! LINK STABILIZED!"*.

---

## 3. Web Speech API Synthesizer Architecture (`ninaSpeak`)

```ts
export function ninaTekkenAnnouncerSpeak(commandPhrase: string): void {
  window.speechSynthesis.cancel();
  const verbalUtterance = new SpeechSynthesisUtterance(commandPhrase.toUpperCase() + '!');
  verbalUtterance.rate = 1.12;
  verbalUtterance.pitch = 1.05;
  verbalUtterance.volume = 1.0;
  
  const femaleVoice = getFemaleSystemVoice();
  if (femaleVoice) verbalUtterance.voice = femaleVoice;
  
  window.speechSynthesis.speak(verbalUtterance);
}
```

---

## 4. Database Matcher Architecture (9,210 DAMAC Hills 2 Properties)

When an incoming message contains `"villa"`, `"DAMAC Hills 2"`, or `"price"`, Nina queries `TWELVE_CORPORATE_DEPARTMENTS` Department 7 master inventory and returns available listings matching buyer specifications.
