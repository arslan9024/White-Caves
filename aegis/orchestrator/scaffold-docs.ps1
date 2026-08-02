# scaffold-docs.ps1 -- Creates stub markdown files for every MISSING gate-check target.
# Moves gate-check status from MISSING to BLOCKED so free agents have real files to expand.
#
# Each stub contains:
#   - A title + agent ownership header
#   - 2 meaningful placeholder sections (so the file exists and is non-empty)
#   - A clear "TODO: expand" instruction pointing to the owning agent
#
# Run: npm run orchestrator:scaffold-docs
# After running: npm run orchestrator:gate-check (MISSING count drops to 0)
param(
  [string]$WorkspaceRoot = ".",
  [switch]$DryRun
)

$crmDir = Join-Path $WorkspaceRoot "business_docs/09_crm_features"
New-Item -ItemType Directory -Force -Path $crmDir | Out-Null

# Stubs: [relPath, agent, title, section1, section2, section3]
# Sections are H2 (##) headings -- gate-check counts these.
# 2-3 stubs per file keeps them clearly BLOCKED (not passing), leaving room for agent expansion.
$stubs = @(
  @{
    rel     = "business_docs/09_crm_features/activity-feed.md"
    agent   = "@Hedy"
    tool    = "Groq Console (Llama 3.1 70B)"
    title   = "Activity Feed"
    purpose = "CRM activity timeline showing all agent and system events in real time."
    sects   = @(
      "## 1. Overview",
      "## 2. Activity Event Types and Display Templates",
      "## 3. Activity Card Component Spec"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/ai-chat.md"
    agent   = "@Corinne"
    tool    = "DeepSeek Chat (DeepSeek V3)"
    title   = "AI Chat"
    purpose = "Context-aware AI chat API powering all 40 White Caves AI assistant personas."
    sects   = @(
      "## 1. Overview",
      "## 2. API Endpoint Spec (POST /api/ai-chat)",
      "## 3. Context Injection Strategy"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/audit-trail.md"
    agent   = "@Hedy"
    tool    = "Groq Console (Llama 3.1 70B)"
    title   = "Audit Trail"
    purpose = "Immutable, append-only audit log for all CRM actions. Required for RERA compliance."
    sects   = @(
      "## 1. Overview",
      "## 2. Audit Log Schema",
      "## 3. Tracked Action Types"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/community-management.md"
    agent   = "@Marissa"
    tool    = "Google AI Studio (Gemini 2.0 Flash)"
    title   = "Community Management"
    purpose = "JunoCommunity module for building announcements, facility bookings and service charges."
    sects   = @(
      "## 1. Overview",
      "## 2. Announcement Board Spec",
      "## 3. Facility Booking Workflow"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/currency-management.md"
    agent   = "@Anima"
    tool    = "DeepSeek Chat (DeepSeek V3)"
    title   = "Currency Management"
    purpose = "Multi-currency support with live exchange rates (AED base + 8 currencies)."
    sects   = @(
      "## 1. Overview",
      "## 2. Supported Currencies and ISO Codes",
      "## 3. Live Rate Source and Cache Strategy"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/document-generation.md"
    agent   = "@Annie"
    tool    = "Google AI Studio (Gemini 2.0 Flash)"
    title   = "Document Generation"
    purpose = "PDF generation for Ejari certificates, tenancy agreements, NOC letters and receipts."
    sects   = @(
      "## 1. Overview",
      "## 2. Document Types and Template Variables",
      "## 3. Template Engine Selection (Puppeteer vs PDFKit)"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/email-automation.md"
    agent   = "@Annie"
    tool    = "Google AI Studio (Gemini 2.0 Flash)"
    title   = "Email Automation"
    purpose = "Automated email triggers via Resend API for lease reminders, rent due alerts and maintenance updates."
    sects   = @(
      "## 1. Overview",
      "## 2. Automated Email Triggers",
      "## 3. Resend API Integration and Retry Logic"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/follow-up-automation.md"
    agent   = "@Hedy"
    tool    = "Groq Console (Llama 3.1 70B)"
    title   = "Follow-Up Automation"
    purpose = "Automated sequence engine for lead nurture, lease renewal reminders and post-viewing flows."
    sects   = @(
      "## 1. Overview",
      "## 2. Sequence Builder (Triggers and Actions)",
      "## 3. Execution Engine and Opt-Out Rules"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/handover-management.md"
    agent   = "@Maya"
    tool    = "Groq Console (Llama 3.1 70B)"
    title   = "Handover Management"
    purpose = "VestaHandover module for snagging checklists, punch list tracking and keys issuance log."
    sects   = @(
      "## 1. Overview",
      "## 2. Snagging Checklist Template",
      "## 3. Punch List Tracking and Sign-Off Workflow"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/investment-management.md"
    agent   = "@Mary"
    tool    = "DeepSeek Chat (DeepSeek V3)"
    title   = "Investment Management"
    purpose = "MavenInvestment module for investor profiles, portfolio dashboards and deal flow pipeline."
    sects   = @(
      "## 1. Overview",
      "## 2. Investor Profile Fields",
      "## 3. Portfolio Dashboard KPIs"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/luxury-segment.md"
    agent   = "@Marissa"
    tool    = "Google AI Studio (Gemini 2.0 Flash)"
    title   = "Luxury Segment CRM"
    purpose = "KairosLuxury module for HNWI clients, VIP viewings and white-glove concierge workflows."
    sects   = @(
      "## 1. Overview",
      "## 2. Luxury Threshold Definition (AED 5M+ sale)",
      "## 3. VIP Client Profile and White-Glove Workflow"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/maintenance.md"
    agent   = "@Corinne"
    tool    = "DeepSeek Chat (DeepSeek V3)"
    title   = "Maintenance Management"
    purpose = "Tenant maintenance request system with contractor assignment, SLA tracking and landlord approval."
    sects   = @(
      "## 1. Overview",
      "## 2. Maintenance Request Schema",
      "## 3. Contractor Assignment and SLA Breach Alerts"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/market-analytics.md"
    agent   = "@Fei-Fei"
    tool    = "DeepSeek Chat (DeepSeek V3)"
    title   = "Market Analytics Dashboard"
    purpose = "KPI tiles, Recharts visualisations and Dubai area heatmap for market intelligence."
    sects   = @(
      "## 1. Overview",
      "## 2. KPI Tiles and Metrics",
      "## 3. Chart Library and Heatmap Spec"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/market-intelligence.md"
    agent   = "@Fei-Fei"
    tool    = "DeepSeek Chat (DeepSeek V3)"
    title   = "Market Intelligence"
    purpose = "CipherMarket module for Dubai area price index, transaction volumes and RERA rental index."
    sects   = @(
      "## 1. Overview",
      "## 2. Dubai Area Price Index",
      "## 3. RERA Rental Index Integration"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/property-valuation.md"
    agent   = "@Fei-Fei"
    tool    = "DeepSeek Chat (DeepSeek V3)"
    title   = "Property Valuation"
    purpose = "AVM engine, rental yield calculator and bank valuation request workflow."
    sects   = @(
      "## 1. Overview",
      "## 2. AVM Inputs and Output Schema",
      "## 3. Rental Yield Calculator"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/prospecting-outbound.md"
    agent   = "@Mary"
    tool    = "DeepSeek Chat (DeepSeek V3)"
    title   = "Prospecting and Outbound"
    purpose = "HunterProspecting module for cold-call campaigns, click-to-call logging and DNC registry."
    sects   = @(
      "## 1. Overview",
      "## 2. Prospect Database Fields",
      "## 3. Prospecting Campaign Workflow"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/scheduling-calendar.md"
    agent   = "@Booking"
    tool    = "Groq Console (Llama 3.1 70B)"
    title   = "Scheduling and Calendar"
    purpose = "Agent availability config, appointment types and Google/Outlook two-way calendar sync."
    sects   = @(
      "## 1. Overview",
      "## 2. Availability Configuration and Appointment Types",
      "## 3. Google Calendar and Outlook Sync Spec"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/secondary-sales.md"
    agent   = "@Anima"
    tool    = "DeepSeek Chat (DeepSeek V3)"
    title   = "Secondary Sales"
    purpose = "Secondary market transaction workflow, dual-agency disclosure and DLD transfer fee breakdown."
    sects   = @(
      "## 1. Overview",
      "## 2. Transaction Workflow (Seller Instruction to Commission Disbursement)",
      "## 3. Dual Agency Disclosure (RERA Form A, B, I)"
    )
  },
  @{
    rel     = "business_docs/09_crm_features/seo-strategy.md"
    agent   = "@Rachel"
    tool    = "Google AI Studio (Gemini 2.0 Flash)"
    title   = "SEO Strategy"
    purpose = "Dubai property keyword clusters, Core Web Vitals targets and structured data schemas."
    sects   = @(
      "## 1. Overview",
      "## 2. Dubai Keyword Clusters",
      "## 3. Core Web Vitals Targets"
    )
  }
)

$created = 0
$skipped = 0

foreach ($s in $stubs) {
  $absPath = Join-Path $WorkspaceRoot $s.rel
  if (Test-Path $absPath) {
    Write-Host ("  [SKIP] already exists: {0}" -f $s.rel) -ForegroundColor DarkGray
    $skipped++
    continue
  }

  $sectionsText = $s.sects -join "`n`n> _TODO: expand this section with full spec._`n`n"

  $body = @"
# $($s.title)

> **Owner:** $($s.agent) | **Tool:** $($s.tool)
> **Purpose:** $($s.purpose)
> **Status:** Stub -- awaiting expansion by $($s.agent).

---

$sectionsText

> _TODO: expand this section with full spec._

---

_This file was scaffolded by `scripts/orchestrator/scaffold-docs.ps1`.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
"@

  if (-not $DryRun) {
    $dir = Split-Path $absPath -Parent
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    [System.IO.File]::WriteAllText($absPath, $body, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host ("  [CREATE] {0}" -f $s.rel) -ForegroundColor Green
    $created++
  } else {
    Write-Host ("  [DRY]    would create: {0}  ({1} sections)" -f $s.rel, $s.sects.Count) -ForegroundColor Cyan
    $created++
  }
}

Write-Host ""
$label = if ($DryRun) { "[DRY RUN] " } else { "" }
Write-Host ("{0}Done: {1} created, {2} skipped." -f $label, $created, $skipped) -ForegroundColor Yellow
if (-not $DryRun -and $created -gt 0) {
  Write-Host ""
  Write-Host "Run 'npm run orchestrator:gate-check' to see MISSING -> BLOCKED improvements." -ForegroundColor White
}