# Cloudflare Tunnel Setup — Bridging Vercel to the Local Backend

The live Vercel deployment serves the frontend and a thin serverless API
(`api/index.js`). The **full backend** (`server/index.ts` — auth, CRM, Socket.io,
cron schedulers, WhatsApp engine) runs as a long-lived process and is exposed to
the internet through a Cloudflare Tunnel. The tunnel is outbound-only: no router
ports are opened and the machine's IP stays hidden.

## Modes

| Mode   | Command                | URL                                                      | Use for                          |
| ------ | ---------------------- | -------------------------------------------------------- | -------------------------------- |
| Quick  | `npm run tunnel:quick` | random `https://*.trycloudflare.com` (changes every run) | one-off demos/tests              |
| Named  | `npm run tunnel:named` | `https://api.whitecaves.com` (stable)                    | daily bridge operation           |
| Bridge | `npm run serve:bridge` | backend + named tunnel + watchdog in one terminal        | the normal way to run everything |

## One-time named tunnel setup

Requires the `whitecaves.com` DNS zone to be managed by Cloudflare.

```powershell
cloudflared tunnel login                                   # opens browser; pick the whitecaves.com zone
cloudflared tunnel create white-caves-api                  # creates tunnel + credentials JSON
cloudflared tunnel route dns white-caves-api api.whitecaves.com
```

Credentials are stored in `C:\Users\<you>\.cloudflared\` (`cert.pem` and
`<TUNNEL-UUID>.json`). **Never copy them into the repository.**

Optional `C:\Users\<you>\.cloudflared\config.yml` (declarative port mapping):

```yaml
tunnel: white-caves-api
credentials-file: C:\Users\<you>\.cloudflared\<TUNNEL-UUID>.json
ingress:
  - hostname: api.whitecaves.com
    service: http://localhost:5001
  - service: http_status:404
```

### Survive reboots (recommended)

```powershell
cloudflared service install
```

Installs the named tunnel as a Windows service: starts at boot, restarts on
failure, reconnects after any network change. With the service installed you
only need `npm run dev` (or `dev:server`) — skip `tunnel:named`.

## Wiring the Vercel frontend

1. Vercel → Project → Settings → Environment Variables
2. Set `VITE_API_URL` to the tunnel origin (`https://api.whitecaves.com`, or the
   printed `https://*.trycloudflare.com` URL in quick mode)
3. **Redeploy** — Vite bakes env vars at build time.

CORS and Socket.io origins for the tunnel/preview domains are already allowed in
`server/config/cors.ts` (static origins + `.trycloudflare.com` and
project-scoped `-arslan-maliks-projects.vercel.app` suffixes).

## Resilience behavior

- `scripts/start-tunnel.ps1` auto-installs cloudflared (winget), auto-detects the
  live backend port by probing `/api/health` (ports 5001–5021, handles fallback
  drift), and supervises the tunnel with an exponential-backoff restart loop.
- `scripts/server-watchdog.ps1` probes `/api/health` every 30 s and relaunches
  `npm run dev:server` if the backend dies.
- `cloudflared` itself reconnects automatically after ISP hiccups; a named
  tunnel keeps the same URL across reconnects and restarts.

## Limitations (read this)

- The CRM is only reachable while this machine is on and online. This is a
  bridge/staging setup, not a production substitute — see the Wave 53 plan for
  the server-hosting decision (Oracle Always Free VM / Hetzner / Render).
- Quick-tunnel URLs rotate every run and require a Vercel env update + redeploy;
  prefer the named tunnel.
