# =============================================================================
# free-agents-loop.ps1 — White Caves Free Planning Agent Loop (Phase 4)
# =============================================================================
# Run at any time to see which free planning agent is active RIGHT NOW,
# get the exact prompt to paste into the free tool, AND see this agent's
# live queue status from the orchestrator.
#
# Usage: .\scripts\free-agents-loop.ps1
# =============================================================================

$minute = (Get-Date).Minute

# Map of 5-minute slot → agent info
$slots = @{
    0  = @{
        Agent  = "@Annie"
        Tool   = "Google AI Studio"
        URL    = "https://aistudio.google.com/"
        Model  = "Gemini 2.0 Flash"
        Domain = "Tenant portal, document gen, email automation"
        File   = "business_docs/09_crm_features/tenant-portal.md"
        Prompt = "@Annie — DRAFT: tenant-portal.md → spec all 6 tabs: TenantLeaseTab (lease details, start/end, monthly rent, status badge), TenantPaymentHistoryTab (payment records table, overdue detection, PDC status), TenantMaintenanceTab (submit request form, status tracking, contractor updates), TenantDocumentsTab (Ejari cert download, tenancy agreement PDF, NOC request button), TenantProfileTab (personal details, Emirates ID, passport expiry alert), TenantPortalHome (KPI tiles: active lease countdown, next payment due amount, open maintenance count). Include: API endpoint for each tab, authFetch pattern, error states, empty states."
    }
    5  = @{
        Agent  = "@Rachel"
        Tool   = "Google AI Studio"
        URL    = "https://aistudio.google.com/"
        Model  = "Gemini 2.0 Flash"
        Domain = "SEO strategy, marketing, careers"
        File   = "business_docs/09_crm_features/seo-strategy.md"
        Prompt = "@Rachel — EXPAND: seo-strategy.md → add: Dubai property keyword clusters (buy villa Dubai, rent apartment Downtown, off-plan projects Dubai Marina, 2BR apartment JVC), local SEO setup (Google Business Profile for White Caves LLC, RERA agent profile optimization), Core Web Vitals targets (LCP < 2.5s, FID < 100ms, CLS < 0.1 with measurement plan), structured data schemas (RealEstateListing, LocalBusiness, FAQPage JSON-LD examples), Arabic/English multilingual SEO (hreflang tags, Arabic keyword research, RTL meta tags)."
    }
    10 = @{
        Agent  = "@Marissa"
        Tool   = "Google AI Studio"
        URL    = "https://aistudio.google.com/"
        Model  = "Gemini 2.0 Flash"
        Domain = "Luxury CRM, community mgmt, UX spec"
        File   = "business_docs/09_crm_features/luxury-segment.md"
        Prompt = "@Marissa — DRAFT: luxury-segment.md → spec KairosLuxuryCRM module: luxury threshold definition (AED 5M+ sale or AED 30K+/month rent, areas: Palm Jumeirah, DIFC, Emirates Hills, Jumeirah Bay), VIP client profile (concierge service tier, private viewing scheduling with NDA requirement, dedicated agent assignment), white-glove workflow (chauffeur option flag, exclusive access booking log, post-viewing gift coordination), luxury listing requirements (professional photography brief: min 30 photos, Matterport 3D tour mandatory, drone footage), HNWI compliance (source of funds declaration, PEP screening, enhanced due diligence checklist per CBUAE AML guidelines)."
    }
    15 = @{
        Agent  = "@Timnit"
        Tool   = "Google AI Studio"
        URL    = "https://aistudio.google.com/"
        Model  = "Gemini 2.0 Flash"
        Domain = "DLD integration, legal CRM, data privacy"
        File   = "business_docs/09_crm_features/dld-integration.md"
        Prompt = "@Timnit — DRAFT: dld-integration.md → spec DLD API integration: Oqood off-plan registration (required fields: developer ID, project ID, buyer Emirates ID, unit number, sale price AED, SPA date, payment plan type), title deed transfer workflow (application submission, trustee appointment, fee calculation: 4% transfer fee + AED 580 admin + trustee fees), DLD REST API endpoints (POST /oqood/register, GET /titleDeed/{titleDeedNumber}, GET /transactions?propertyId=), error handling for DLD system downtime (queue failed requests, retry with exponential backoff, alert admin), DLD Smart Judge integration for disputes, White Caves as authorized trustee or broker authentication (API key management)."
    }
    20 = @{
        Agent  = "@Hedy"
        Tool   = "Groq Console"
        URL    = "https://console.groq.com/"
        Model  = "Llama 3.1 70B"
        Domain = "Audit trail, activity feed, follow-up automation"
        File   = "business_docs/09_crm_features/audit-trail.md"
        Prompt = "@Hedy — DRAFT: audit-trail.md → spec HenryAuditCRM module: audit log schema (userId, action, entityType: lead/property/lease/user/commission, entityId, oldValue JSON, newValue JSON, ipAddress, userAgent, timestamp — all fields immutable), tracked actions (CREATE, UPDATE, DELETE, STATUS_CHANGE, LOGIN, LOGOUT, EXPORT, PERMISSION_CHANGE), write-once enforcement (append-only MongoDB collection with no updateOne/deleteOne allowed), audit search UI (filter by: user, entity type, action, date range — paginated 50 per page), compliance export (CSV + PDF report for RERA inspector — date-stamped, agent-signed), retention (7 years per UAE Commercial Transactions Law), real-time audit stream via WebSocket for admin live monitoring."
    }
    25 = @{
        Agent  = "@Maya"
        Tool   = "Groq Console"
        URL    = "https://console.groq.com/"
        Model  = "Llama 3.1 70B"
        Domain = "Off-plan projects, handover management"
        File   = "business_docs/09_crm_features/off-plan-projects.md"
        Prompt = "@Maya — DRAFT: off-plan-projects.md → spec AtlasProjectsCRM: project schema (developer, project name, location GeoPoint, launch date, estimated completion, totalUnits, availableUnits, paymentPlanOptions array), unit inventory (unitNumber, floor, type: studio/1BR/2BR/3BR/penthouse, BUA sqft, view, listPrice, status: available/reserved/sold/transferred), buyer reservation workflow (EOI deposit receipt → SPA draft → signing appointment → Oqood DLD registration within 60 days → payment milestone schedule), project milestone tracker (construction % from developer API or manual update, estimated handover countdown, delay flag), ROI projection calculator (inputs: purchase price, expected rent per RERA index, service charge/sqft → outputs: gross yield %, net yield %, payback years)."
    }
    30 = @{
        Agent  = "@Booking"
        Tool   = "Groq Console"
        URL    = "https://console.groq.com/"
        Model  = "Llama 3.1 70B"
        Domain = "Scheduling calendar, viewings"
        File   = "business_docs/09_crm_features/viewings.md"
        Prompt = "@Booking — DRAFT: viewings.md → spec /api/viewings route: viewing schema (propertyId, leadId, agentId, scheduledAt, durationMinutes: default 60, status: scheduled/confirmed/completed/cancelled/no_show, type: in-person/virtual, zoomLink if virtual, notes, feedbackRating 1-5, feedbackText), scheduling flow (lead selects slot from agent availability → confirmation WhatsApp message sent → 24h reminder → post-viewing WhatsApp feedback request), conflict detection (agent double-booking check, property already has confirmed viewing at same time), ICS file generation (.ics export with property address as location), bulk open-house slots (one property, multiple concurrent viewing slots), viewing conversion metric (viewings → offers rate per property, tracked in analytics)."
    }
    35 = @{
        Agent  = "@Jaime"
        Tool   = "Groq Console"
        URL    = "https://console.groq.com/"
        Model  = "Llama 3.1 70B"
        Domain = "Offers workflow, WhatsApp integration"
        File   = "business_docs/09_crm_features/offers.md"
        Prompt = "@Jaime — DRAFT: offers.md → spec /api/offers route: offer schema (propertyId, buyerId or tenantId, agentId, offerPrice AED, offerType: purchase/lease, validUntil date, status: pending/countered/accepted/rejected/expired, conditions: mortgageSubject/cashPurchase/furnitureIncluded/subjectToNOC, counterOfferHistory array of {price, date, fromParty, notes}), offer workflow (buyer submits → agent presents to seller/landlord → counter offer round → acceptance → auto-generate MOU or LOI PDF), offer comparison table (multiple offers on same property: side-by-side price, conditions, buyer profile), automated expiry cron (set status=expired when validUntil passed), offer acceptance triggers (generate MOU PDF, WhatsApp notification to all parties, create RERA form task), offer analytics (average offers per property, average negotiation rounds, price achieved vs asking %)."
    }
    40 = @{
        Agent  = "@Fei-Fei"
        Tool   = "DeepSeek Chat"
        URL    = "https://chat.deepseek.com/"
        Model  = "DeepSeek V3"
        Domain = "Property valuation, market intelligence"
        File   = "business_docs/09_crm_features/property-valuation.md"
        Prompt = "@Fei-Fei — DRAFT: property-valuation.md → spec valuation engine in CipherMarketCRM: AVM inputs (location GeoPoint, BUA sqft, bedrooms, bathrooms, floor number, view type, building age, last transaction price from DLD), AVM output (estimated market value AED, confidence score %, comparable transactions used: min 3, value range +/-10%), manual valuation override (RERA-certified valuer input, override reason required, manager approval workflow), rental yield calculator (gross: annual rent / purchase price x 100; net: (annual rent - service charges) / purchase price x 100), valuation history per property (date, estimated value, method: AVM/manual, valuer name), bank valuation request workflow (for mortgage pre-approval: RERA Form, bank-specific requirements by bank list), monthly bulk valuation refresh (cron job syncs latest DLD comparable data)."
    }
    45 = @{
        Agent  = "@Anima"
        Tool   = "DeepSeek Chat"
        URL    = "https://chat.deepseek.com/"
        Model  = "DeepSeek V3"
        Domain = "Currency mgmt, secondary sales, data pipelines"
        File   = "business_docs/09_crm_features/secondary-sales.md"
        Prompt = "@Anima — DRAFT: secondary-sales.md → spec /api/secondary-sales route and SecondarySalesAgent module: transaction workflow (seller instruction letter → property appraisal booking → listing activation → offer management → MOU signing → bank/cash buyer path split → NOC from developer within 20 days → DLD transfer appointment → commission disbursement to agent and company), dual-agency disclosure (RERA prohibition on undisclosed dual representation: Form A signed by seller, Form B signed by buyer, Form I if dual agent), secondary vs primary distinction (property.transactionType: primary/secondary field — affects DLD fee calculation and required forms), DLD transfer fee breakdown (4% of sale price split buyer/seller, trustee fees AED 4000-10000, DLD admin AED 580), secondary market KPIs (avg days listing to sold, price achieved vs original asking %, commission per deal average AED)."
    }
    50 = @{
        Agent  = "@Mary"
        Tool   = "DeepSeek Chat"
        URL    = "https://chat.deepseek.com/"
        Model  = "DeepSeek V3"
        Domain = "Sentinel property, investment, prospecting"
        File   = "business_docs/09_crm_features/sentinel-property.md"
        Prompt = "@Mary — DRAFT: sentinel-property.md → spec SentinelPropertyCRM module: property lifecycle state machine (Draft → Pending Review → Listed → Under Offer → Reserved → Sold/Leased → Withdrawn → Re-listed — with allowed transitions and required fields per state), RERA mandatory fields before listing (permit number, DED approval for off-plan, NOC from developer if applicable, title deed number for resale, floor plan uploaded), property quality score algorithm (photos count x10pts, description > 100 words x15pts, floor plan x20pts, virtual tour x25pts, 360 video x30pts — max 100pts, score drives portal ranking), duplicate detection (same community + building + unit number = duplicate warning, override with reason), bulk CSV import spec (column mapping: propertyType, area, community, building, unit, bedrooms, bathrooms, BUA, price, agentId — validation rules, error report with row numbers)."
    }
    55 = @{
        Agent  = "@Corinne"
        Tool   = "DeepSeek Chat"
        URL    = "https://chat.deepseek.com/"
        Model  = "DeepSeek V3"
        Domain = "AI chat spec, maintenance, map search"
        File   = "business_docs/09_crm_features/maintenance.md"
        Prompt = "@Corinne — DRAFT: maintenance.md → spec /api/maintenance route: schema (propertyId, tenantId, landlordId, agentId, category: plumbing/electrical/HVAC/structural/appliance/pest/other, priority: emergency/high/medium/low, description, photos array max 5, status: open/assigned/scheduled/in_progress/completed/cancelled, assignedContractorId, scheduledAt, resolvedAt, resolutionNotes, tenantRating 1-5, invoiceAmount AED, invoiceApproved: boolean), tenant submission channels (portal form or WhatsApp bot → auto-priority: 'water leak' = emergency, 'broken AC' = high, 'light bulb' = low), contractor assignment (approved contractor list by category, availability calendar, work order PDF generation), SLA breach alerting (emergency: 4h, high: 24h, medium: 72h, low: 7 days — alert landlord + manager on breach), landlord cost approval (repairs > AED 500 require landlord WhatsApp approval before contractor proceeds), completion invoice attachment, tenant rating prompt after resolution."
    }
}

# Find the current 5-minute slot (floor to nearest 5)
$slotKey = [math]::Floor($minute / 5) * 5

# Make sure the key exists in our map (handle edge cases)
if (-not $slots.ContainsKey($slotKey)) {
    $sortedKeys = $slots.Keys | Sort-Object -Descending
    $slotKey = ($sortedKeys | Where-Object { $_ -le $slotKey } | Select-Object -First 1)
    if ($null -eq $slotKey) { $slotKey = 55 }
}

$current = $slots[$slotKey]
$nextSlotKey = ($slotKey + 5) % 60
if (-not $slots.ContainsKey($nextSlotKey)) { $nextSlotKey = 0 }
$next = $slots[$nextSlotKey]
$minutesUntilNext = 5 - ($minute % 5)
if ($minutesUntilNext -eq 5) { $minutesUntilNext = 0 }

# ─── Output ───────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  WHITE CAVES — Free Planning Agent Loop  🔄" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host ("  Time  : " + (Get-Date -Format "HH:mm") + "  |  Current slot: :" + $slotKey + "  |  Next slot in: " + $minutesUntilNext + " min") -ForegroundColor White
Write-Host ""
Write-Host "  ┌─ ACTIVE AGENT ────────────────────────────────────────" -ForegroundColor Yellow
Write-Host ("  │  Agent  : " + $current.Agent) -ForegroundColor Yellow
Write-Host ("  │  Tool   : " + $current.Tool + " (" + $current.Model + ")") -ForegroundColor Green
Write-Host ("  │  Domain : " + $current.Domain) -ForegroundColor White
Write-Host ("  │  File   : " + $current.File) -ForegroundColor Gray
Write-Host "  └───────────────────────────────────────────────────────" -ForegroundColor Yellow
Write-Host ""
Write-Host "  ┌─ TASK PROMPT (copy this into the free tool) ──────────" -ForegroundColor Magenta
Write-Host ""

# Word-wrap the prompt at ~80 chars for readability
$words = $current.Prompt -split ' '
$line = "  │  "
foreach ($word in $words) {
    if (($line + $word).Length -gt 85) {
        Write-Host $line -ForegroundColor White
        $line = "  │  "
    }
    $line += $word + " "
}
if ($line.Trim() -ne "│") { Write-Host $line -ForegroundColor White }

Write-Host ""
Write-Host "  └───────────────────────────────────────────────────────" -ForegroundColor Magenta
Write-Host ""
Write-Host "  ┌─ NEXT AGENT (slot :" + $nextSlotKey + ") ─────────────────────────" -ForegroundColor DarkCyan
Write-Host ("  │  " + $next.Agent + " → " + $next.Tool + " → " + $next.Domain) -ForegroundColor DarkCyan
Write-Host "  └───────────────────────────────────────────────────────" -ForegroundColor DarkCyan
Write-Host ""
Write-Host "  STEPS:" -ForegroundColor Cyan
Write-Host "  1. Open the free tool (opening in browser now...)" -ForegroundColor White
Write-Host "  2. Set model: $($current.Model)" -ForegroundColor White
Write-Host "  3. Paste the prompt above" -ForegroundColor White
Write-Host "  4. Paste AI output into: $($current.File)" -ForegroundColor White
Write-Host ('  5. git add ' + $current.File + ' && git commit -m "docs(' + $current.Agent + '): Task 1 expansion"') -ForegroundColor White
Write-Host "  6. Run this script again for the next agent" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Open the free tool URL in the default browser
try {
    Start-Process $current.URL
    Write-Host "  ✅ Opened: $($current.URL)" -ForegroundColor Green
} catch {
    Write-Host "  Could not open browser automatically. Navigate to: $($current.URL)" -ForegroundColor Yellow
}

# ─── Queue status for this agent ─────────────────────────────────────────────
$queueFile = Join-Path $PSScriptRoot "..\logs\orchestrator\task-queue.json"
if (Test-Path $queueFile) {
  try {
    $raw   = Get-Content $queueFile -Raw
    $queue = $raw | ConvertFrom-Json
    $tasks = @($queue.tasks) | Where-Object { $_.agent -eq $current.Agent }

    if ($tasks.Count -gt 0) {
      Write-Host ""
      Write-Host "  ┌─ ORCHESTRATOR QUEUE (tasks for $($current.Agent)) ──────────" -ForegroundColor DarkCyan
      foreach ($t in $tasks) {
        $statusColor = switch ($t.status) {
          "done"        { "Green"   }
          "running"     { "Cyan"    }
          "waiting_ack" { "Yellow"  }
          "queued"      { "White"   }
          "retrying"    { "Magenta" }
          "failed"      { "Red"     }
          "escalated"   { "Red"     }
          default       { "Gray"    }
        }
        $statusPad = $t.status.PadRight(13)
        $titleShort = if ($t.title.Length -gt 42) { $t.title.Substring(0,39) + "..." } else { $t.title }
        Write-Host ("  |  [$statusPad] $($t.taskId)  $titleShort") -ForegroundColor $statusColor
      }
      Write-Host "  └───────────────────────────────────────────────────────" -ForegroundColor DarkCyan

      $running     = @($tasks | Where-Object { $_.status -eq "running"     })
      $waitingAck  = @($tasks | Where-Object { $_.status -eq "waiting_ack" })
      $escalated   = @($tasks | Where-Object { $_.status -eq "escalated"   })

      if ($running.Count -gt 0) {
        Write-Host ""
        Write-Host ("  [RUNNING] Task $($running[0].taskId) is in progress by a background worker.") -ForegroundColor Cyan
        Write-Host "  Paste AI output into the target file and run:" -ForegroundColor White
        Write-Host ("  npm run orchestrator:queue:ack -- -TaskId $($running[0].taskId) -AgentName '$($running[0].feedsAckBy)'") -ForegroundColor Gray
      }
      if ($waitingAck.Count -gt 0) {
        Write-Host ""
        Write-Host ("  [ACTION] Task $($waitingAck[0].taskId) is waiting for FEEDS_ACK from: $($waitingAck[0].feedsAckBy)") -ForegroundColor Yellow
        Write-Host ("  npm run orchestrator:queue:ack -- -TaskId $($waitingAck[0].taskId) -AgentName $($waitingAck[0].feedsAckBy)") -ForegroundColor Gray
      }
      if ($escalated.Count -gt 0) {
        Write-Host ""
        Write-Host ("  [ESCALATED] $($escalated.Count) task(s) stuck. See DAILY_MILESTONE_TRACKER.md for @Margaret alert.") -ForegroundColor Red
      }
    }
    else {
      Write-Host ""
      Write-Host "  [QUEUE] No tasks assigned to $($current.Agent) yet." -ForegroundColor DarkGray
    }
  }
  catch {
    Write-Host ""
    Write-Host "  [QUEUE] Could not read queue: $($_.Exception.Message)" -ForegroundColor DarkGray
  }
}

Write-Host ""
