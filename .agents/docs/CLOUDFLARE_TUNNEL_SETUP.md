# Cloudflare Tunnel Setup — Bridging Vercel to the Local Backend

The live Vercel deployment serves the frontend and a thin serverless API
(`api/index.ts`). The **full backend** (`server/index.ts` — auth, CRM, Socket.io,
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
winget install --id Cloudflare.cloudflared -e              # install explicitly, then reopen terminal
cloudflared tunnel login                                   # opens browser; pick the whitecaves.com zone
cloudflared tunnel create white-caves-api                  # creates tunnel + credentials JSON
cloudflared tunnel route dns white-caves-api api.whitecaves.com
```

Credentials are stored in `C:\Users\<you>\.cloudflared\` (`cert.pem` and
`<TUNNEL-UUID>.json`). **Never copy them into the repository.**

Required for the locally managed named tunnel:
`C:\Users\<you>\.cloudflared\config.yml` (declarative port mapping):

```yaml
tunnel: white-caves-api
credentials-file: C:\Users\<you>\.cloudflared\<TUNNEL-UUID>.json
ingress:
  - hostname: api.whitecaves.com
    service: http://localhost:5001
  - service: http_status:404
```

### Reboots and service accounts

The bridge command runs in the current terminal; it does not install a Windows
service and does not survive reboots. Service installation needs a separate
operator-managed account, explicit configuration/credential paths and startup
configuration for **both** the backend and tunnel. A tunnel service alone does
not start the backend. Do not copy credentials into this repository or assume
the service account can read your user profile.

## Wiring the Vercel frontend

1. Vercel → Project → Settings → Environment Variables
2. Set `VITE_API_URL` to the tunnel origin (`https://api.whitecaves.com`, or the
   printed `https://*.trycloudflare.com` URL in quick mode)
3. Set the server-only `BACKEND_API_ORIGIN` to the same tunnel origin. The
   Vercel `/api/auth/*` route proxies authentication requests server-to-server;
   refresh and CSRF cookies therefore remain same-origin with the frontend.
4. **Redeploy** — Vite bakes `VITE_API_URL` at build time.

Production frontend origins are explicitly allowed. Add exact frontend preview
origins to backend `CORS_ORIGIN` when the browser calls the backend directly;
arbitrary `trycloudflare.com` and account-suffix Vercel origins are **not**
trusted. CORS is not authentication. The API tunnel address is a request
destination, not the browser's frontend origin. Authentication uses the
same-origin Vercel proxy and does not require adding the Vercel frontend origin
to CORS for that proxied flow.

The frontend CSP permits HTTPS and WebSocket connections to `api.whitecaves.com`.
A different tunnel hostname also requires an explicit CSP change before use.

The optional Vercel serverless API also protects private inventory routes with
the shared JWT/RBAC middleware. These unscoped private reads require manager-level
access; mutations additionally require property edit permission and use the authenticated
actor for audit attribution. Its shared configuration loads at startup, including
for health checks: configure server-only `JWT_SECRET` and `DATABASE_URL` in Vercel
when deploying this API; never expose them as `VITE_*` variables. A frontend-only
deployment should send private requests to the full
backend configured through `VITE_API_URL`.

## Resilience behavior

- The bridge supervisor runs the backend in **production** mode with development
  authentication bypass disabled. Configure a strong `JWT_SECRET`, `DATABASE_URL`
  and required integrations outside the repository before starting it. Missing
  required configuration fails startup; it is not replaced with development secrets.
- `scripts/start-tunnel.ps1` waits for the explicit port (default 5001) to return
  `status: "OK"`, `service: "white-caves-api"` and `authenticationRequired: true`
  from `/api/health`. A development server with authentication bypass cannot
  pass this check. It never scans
  or exposes another port and does not install tools automatically.
- Named mode reads external cloudflared ingress configuration. Its configured
  service port must match the backend port. Native command failures stop with an
  actionable error instead of endlessly retrying bad credentials.
- `scripts/server-watchdog.ps1` owns one direct Node backend process, waits up to
  90 seconds for startup, restarts after process exit, and warns on transient
  unhealthy probes without killing a live process. An occupied port fails
  explicitly; unrelated processes are never terminated.
- `serve:bridge` starts only one backend supervisor and one tunnel process.
- `cloudflared` itself reconnects automatically after ISP hiccups; a named
  tunnel keeps the same URL across reconnects and restarts.

## Limitations (read this)

- The CRM is only reachable while this machine is on and online. This is a
  bridge/staging setup, not a production substitute — see the Wave 53 plan for
  the server-hosting decision (Oracle Always Free VM / Hetzner / Render).
- Quick-tunnel URLs rotate every run and require a Vercel env update + redeploy;
  prefer the named tunnel.
- Cloudflare login, DNS, external credentials/configuration, Vercel environment,
  live REST/Socket.io connectivity and restart behavior require operator testing.
  Script parsing and local tests alone do not prove internet connectivity.
