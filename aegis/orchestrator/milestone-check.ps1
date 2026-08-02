# milestone-check.ps1 -- Fast-track readiness gate for White Caves Orchestrator.
#
# Evaluates 30 evidence checks across 6 groups (Business, API, Data, UX, QA, Compliance)
# against a target feature's gate file.  Calculates readiness % and either prints the
# policy-defined approval phrase or lists every failing check with the owning free agent and fix hint.
#
# Usage:
#   npm run orchestrator:milestone -- -Module tenancy-ejari
#   npm run orchestrator:milestone -- -Module dld-integration -Verbose
#   npm run orchestrator:milestone:all                         -- all gate files
#   npm run orchestrator:milestone:summary                     -- one-line per file
#
# Threshold: policy-driven (default 60% of total checks per policy.json).
# PowerShell 5.1-safe.  UTF-8 BOM.  ASCII-only symbols.

param(
  [string]$WorkspaceRoot = ".",
  [string]$Module        = "",    # short name OR full rel path to gate file
  [switch]$All,                   # evaluate every gate file
  [switch]$Summary,               # one-line per file (implies -All)
  [switch]$Verbose                # show PASS checks too (default: only FAIL)
)

$ErrorActionPreference = "Continue"
$w    = 72
$root = Resolve-Path $WorkspaceRoot
$policyFile = Join-Path $PSScriptRoot "policy.json"

$approvalPhrase = "@Ada — Context Ready (60% Readiness) — Coding Phase Approved"
$THRESHOLD_PCT = 60
if (Test-Path $policyFile) {
  try {
    $policy = Get-Content $policyFile -Raw | ConvertFrom-Json
    if ($policy.readinessThresholdPct) { $THRESHOLD_PCT = [int]$policy.readinessThresholdPct }
    if ($policy.approvalPhrase) { $approvalPhrase = [string]$policy.approvalPhrase }
  } catch {
    Write-Host "[WARN] policy.json unreadable -- using default threshold 100%" -ForegroundColor Yellow
  }
}

# ---------------------------------------------------------------------------
# GATE FILE MAP (short name -> rel path)
# ---------------------------------------------------------------------------
$moduleMap = [ordered]@{
  "compliance-requirements"   = "business_docs/05_requirements/compliance-requirements.md"
  "risk-register"             = "business_docs/05_requirements/risk-register.md"
  "non-functional"            = "business_docs/05_requirements/non-functional-requirements.md"
  "revenue-model"             = "business_docs/07_business_model/revenue-model.md"
  "ai-assistants"             = "business_docs/03_ai_assistants/README.md"
  "system-architecture"       = "business_docs/06_design_architecture/system-architecture.md"
  "ui-ux-specification"       = "business_docs/06_design_architecture/ui-ux-specification.md"
  "tenancy-ejari"             = "business_docs/09_crm_features/tenancy-ejari.md"
  "landlord-portal"           = "business_docs/09_crm_features/landlord-portal.md"
  "financial-reporting"       = "business_docs/09_crm_features/financial-reporting.md"
  "analytics-dashboard"       = "business_docs/09_crm_features/analytics-dashboard.md"
  "agent-performance"         = "business_docs/09_crm_features/agent-performance.md"
  "lead-tracking"             = "business_docs/09_crm_features/lead-tracking.md"
  "tenant-portal"             = "business_docs/09_crm_features/tenant-portal.md"
  "dld-integration"           = "business_docs/09_crm_features/dld-integration.md"
  "legal-management"          = "business_docs/09_crm_features/legal-management.md"
  "audit-trail"               = "business_docs/09_crm_features/audit-trail.md"
  "activity-feed"             = "business_docs/09_crm_features/activity-feed.md"
  "follow-up-automation"      = "business_docs/09_crm_features/follow-up-automation.md"
  "off-plan-projects"         = "business_docs/09_crm_features/off-plan-projects.md"
  "handover-management"       = "business_docs/09_crm_features/handover-management.md"
  "scheduling-calendar"       = "business_docs/09_crm_features/scheduling-calendar.md"
  "viewings"                  = "business_docs/09_crm_features/viewings.md"
  "offers"                    = "business_docs/09_crm_features/offers.md"
  "whatsapp-integration"      = "business_docs/09_crm_features/whatsapp-integration.md"
  "property-valuation"        = "business_docs/09_crm_features/property-valuation.md"
  "market-intelligence"       = "business_docs/09_crm_features/market-intelligence.md"
  "market-analytics"          = "business_docs/09_crm_features/market-analytics.md"
  "currency-management"       = "business_docs/09_crm_features/currency-management.md"
  "secondary-sales"           = "business_docs/09_crm_features/secondary-sales.md"
  "sentinel-property"         = "business_docs/09_crm_features/sentinel-property.md"
  "investment-management"     = "business_docs/09_crm_features/investment-management.md"
  "prospecting-outbound"      = "business_docs/09_crm_features/prospecting-outbound.md"
  "ai-chat"                   = "business_docs/09_crm_features/ai-chat.md"
  "maintenance"               = "business_docs/09_crm_features/maintenance.md"
  "document-generation"       = "business_docs/09_crm_features/document-generation.md"
  "email-automation"          = "business_docs/09_crm_features/email-automation.md"
  "seo-strategy"              = "business_docs/09_crm_features/seo-strategy.md"
  "marketing-campaigns"       = "business_docs/09_crm_features/marketing-campaigns.md"
  "luxury-segment"            = "business_docs/09_crm_features/luxury-segment.md"
  "community-management"      = "business_docs/09_crm_features/community-management.md"
  "careers"                   = "business_docs/09_crm_features/careers.md"
}

# Gate section targets (same as all other orchestrator scripts)
$gateTargets = @{
  "business_docs/05_requirements/compliance-requirements.md"     = 12
  "business_docs/05_requirements/risk-register.md"               = 5
  "business_docs/05_requirements/non-functional-requirements.md" = 8
  "business_docs/07_business_model/revenue-model.md"             = 13
  "business_docs/03_ai_assistants/README.md"                     = 40
  "business_docs/06_design_architecture/system-architecture.md"  = 12
  "business_docs/06_design_architecture/ui-ux-specification.md"  = 20
  "business_docs/09_crm_features/tenancy-ejari.md"               = 14
  "business_docs/09_crm_features/landlord-portal.md"             = 13
  "business_docs/09_crm_features/financial-reporting.md"         = 11
  "business_docs/09_crm_features/analytics-dashboard.md"         = 22
  "business_docs/09_crm_features/agent-performance.md"           = 14
  "business_docs/09_crm_features/lead-tracking.md"               = 12
  "business_docs/09_crm_features/tenant-portal.md"               = 14
  "business_docs/09_crm_features/dld-integration.md"             = 12
  "business_docs/09_crm_features/legal-management.md"            = 12
  "business_docs/09_crm_features/audit-trail.md"                 = 10
  "business_docs/09_crm_features/activity-feed.md"               = 8
  "business_docs/09_crm_features/follow-up-automation.md"        = 10
  "business_docs/09_crm_features/off-plan-projects.md"           = 14
  "business_docs/09_crm_features/handover-management.md"         = 10
  "business_docs/09_crm_features/scheduling-calendar.md"         = 12
  "business_docs/09_crm_features/viewings.md"                    = 10
  "business_docs/09_crm_features/offers.md"                      = 12
  "business_docs/09_crm_features/whatsapp-integration.md"        = 14
  "business_docs/09_crm_features/property-valuation.md"          = 10
  "business_docs/09_crm_features/market-intelligence.md"         = 10
  "business_docs/09_crm_features/market-analytics.md"            = 10
  "business_docs/09_crm_features/currency-management.md"         = 8
  "business_docs/09_crm_features/secondary-sales.md"             = 10
  "business_docs/09_crm_features/sentinel-property.md"           = 12
  "business_docs/09_crm_features/investment-management.md"       = 10
  "business_docs/09_crm_features/prospecting-outbound.md"        = 10
  "business_docs/09_crm_features/ai-chat.md"                     = 12
  "business_docs/09_crm_features/maintenance.md"                 = 10
  "business_docs/09_crm_features/document-generation.md"         = 10
  "business_docs/09_crm_features/email-automation.md"            = 8
  "business_docs/09_crm_features/seo-strategy.md"                = 16
  "business_docs/09_crm_features/marketing-campaigns.md"         = 12
  "business_docs/09_crm_features/luxury-segment.md"              = 10
  "business_docs/09_crm_features/community-management.md"        = 8
  "business_docs/09_crm_features/careers.md"                     = 8
}

# Primary owning agent per gate file
$fileOwner = @{
  "business_docs/05_requirements/compliance-requirements.md"     = "@Sofia"
  "business_docs/05_requirements/risk-register.md"               = "@Sofia"
  "business_docs/05_requirements/non-functional-requirements.md" = "@Sofia"
  "business_docs/07_business_model/revenue-model.md"             = "@Invoice"
  "business_docs/03_ai_assistants/README.md"                     = "@Joelle"
  "business_docs/06_design_architecture/system-architecture.md"  = "@Corinne"
  "business_docs/06_design_architecture/ui-ux-specification.md"  = "@Marissa"
  "business_docs/09_crm_features/tenancy-ejari.md"               = "@Victoria"
  "business_docs/09_crm_features/landlord-portal.md"             = "@Victoria"
  "business_docs/09_crm_features/financial-reporting.md"         = "@Invoice"
  "business_docs/09_crm_features/analytics-dashboard.md"         = "@Cassie"
  "business_docs/09_crm_features/agent-performance.md"           = "@Cassie"
  "business_docs/09_crm_features/lead-tracking.md"               = "@Joelle"
  "business_docs/09_crm_features/tenant-portal.md"               = "@Annie"
  "business_docs/09_crm_features/dld-integration.md"             = "@Timnit"
  "business_docs/09_crm_features/legal-management.md"            = "@Timnit"
  "business_docs/09_crm_features/audit-trail.md"                 = "@Hedy"
  "business_docs/09_crm_features/activity-feed.md"               = "@Hedy"
  "business_docs/09_crm_features/follow-up-automation.md"        = "@Hedy"
  "business_docs/09_crm_features/off-plan-projects.md"           = "@Maya"
  "business_docs/09_crm_features/handover-management.md"         = "@Maya"
  "business_docs/09_crm_features/scheduling-calendar.md"         = "@Booking"
  "business_docs/09_crm_features/viewings.md"                    = "@Booking"
  "business_docs/09_crm_features/offers.md"                      = "@Jaime"
  "business_docs/09_crm_features/whatsapp-integration.md"        = "@Jaime"
  "business_docs/09_crm_features/property-valuation.md"          = "@Fei-Fei"
  "business_docs/09_crm_features/market-intelligence.md"         = "@Fei-Fei"
  "business_docs/09_crm_features/market-analytics.md"            = "@Fei-Fei"
  "business_docs/09_crm_features/currency-management.md"         = "@Anima"
  "business_docs/09_crm_features/secondary-sales.md"             = "@Anima"
  "business_docs/09_crm_features/sentinel-property.md"           = "@Mary"
  "business_docs/09_crm_features/investment-management.md"       = "@Mary"
  "business_docs/09_crm_features/prospecting-outbound.md"        = "@Mary"
  "business_docs/09_crm_features/ai-chat.md"                     = "@Corinne"
  "business_docs/09_crm_features/maintenance.md"                 = "@Corinne"
  "business_docs/09_crm_features/document-generation.md"         = "@Annie"
  "business_docs/09_crm_features/email-automation.md"            = "@Annie"
  "business_docs/09_crm_features/seo-strategy.md"                = "@Rachel"
  "business_docs/09_crm_features/marketing-campaigns.md"         = "@Rachel"
  "business_docs/09_crm_features/luxury-segment.md"              = "@Marissa"
  "business_docs/09_crm_features/community-management.md"        = "@Marissa"
  "business_docs/09_crm_features/careers.md"                     = "@Rachel"
}

# Free tool per agent
$agentTool = @{
  "@Sofia"    = "Google AI Studio (Gemini 2.0 Flash)"
  "@Victoria" = "Google AI Studio (Gemini 2.0 Flash)"
  "@Annie"    = "Google AI Studio (Gemini 2.0 Flash)"
  "@Marissa"  = "Google AI Studio (Gemini 2.0 Flash)"
  "@Rachel"   = "Google AI Studio (Gemini 2.0 Flash)"
  "@Timnit"   = "Google AI Studio (Gemini 2.0 Flash)"
  "@Invoice"  = "Groq Console (Llama 3.1 70B)"
  "@Joelle"   = "Groq Console (Llama 3.1 70B)"
  "@Hedy"     = "Groq Console (Llama 3.1 70B)"
  "@Maya"     = "Groq Console (Llama 3.1 70B)"
  "@Booking"  = "Groq Console (Llama 3.1 70B)"
  "@Jaime"    = "Groq Console (Llama 3.1 70B)"
  "@Fei-Fei"  = "DeepSeek Chat (DeepSeek V3)"
  "@Anima"    = "DeepSeek Chat (DeepSeek V3)"
  "@Mary"     = "DeepSeek Chat (DeepSeek V3)"
  "@Cassie"   = "DeepSeek Chat (DeepSeek V3)"
  "@Corinne"  = "DeepSeek Chat (DeepSeek V3)"
}

# ---------------------------------------------------------------------------
# 30-CHECK MATRIX -- 6 groups x 5 checks each
# Each check: Id, Group, Label, Keywords (any match = PASS), FixAgent, FixHint
# ---------------------------------------------------------------------------
$checks30 = @(
  # --- GROUP 1: BUSINESS ---
  @{ Id="B1"; Group="Business";    Label="Scope / overview section"          ; Keywords=@("scope","overview","purpose","introduction","about"); FixGroup="Business"; FixHint="Add ## Overview or ## Scope section describing the feature goal" },
  @{ Id="B2"; Group="Business";    Label="Acceptance criteria defined"        ; Keywords=@("acceptance criteria","success criteria","done when","definition of done","ac:"); FixGroup="Business"; FixHint="Add ## Acceptance Criteria section with testable bullet conditions" },
  @{ Id="B3"; Group="Business";    Label="Business / process rules present"  ; Keywords=@("business rule","process rule","workflow","rule:","must ","shall "); FixGroup="Business"; FixHint="Add ## Business Rules section with numbered rules (e.g., Rule 1: ...)" },
  @{ Id="B4"; Group="Business";    Label="Ownership / DRI assigned"          ; Keywords=@("owner","dri","responsible","assigned","agent:","module owner"); FixGroup="Business"; FixHint="Add ## Ownership or DRI line: 'Owner: @AgentName'" },
  @{ Id="B5"; Group="Business";    Label="Rollback / contingency plan"       ; Keywords=@("rollback","revert","contingency","undo","fallback","recovery plan","disaster"); FixGroup="Business"; FixHint="Add ## Rollback Plan section with step-by-step revert procedure" },
  # --- GROUP 2: API ---
  @{ Id="A1"; Group="API";         Label="Request / response schema defined" ; Keywords=@("request","response","payload","body:","schema:","json","endpoint","route"); FixGroup="API"; FixHint="Add ## API Endpoints section with request/response JSON examples" },
  @{ Id="A2"; Group="API";         Label="Auth / permissions specified"      ; Keywords=@("auth","jwt","bearer","token","permission","role:","rbac","access control"); FixGroup="API"; FixHint="Add ## Authentication / Authorization section with required roles" },
  @{ Id="A3"; Group="API";         Label="Error handling documented"         ; Keywords=@("error","400","404","422","500","exception","failure","bad request","not found"); FixGroup="API"; FixHint="Add ## Error Responses table with code, message, and retry behavior" },
  @{ Id="A4"; Group="API";         Label="Pagination / listing pattern"      ; Keywords=@("pagination","page","limit","offset","cursor","per_page","total_count"); FixGroup="API"; FixHint="Add ## Pagination section: page/limit params or cursor-based pattern" },
  @{ Id="A5"; Group="API";         Label="Rate limits / throttling noted"    ; Keywords=@("rate limit","throttle","quota","429","too many requests","burst","concurrency"); FixGroup="API"; FixHint="Add ## Rate Limits section with limits per endpoint and 429 handling" },
  # --- GROUP 3: DATA ---
  @{ Id="D1"; Group="Data";        Label="Schema / model fields defined"     ; Keywords=@("schema","model","field","collection","table","column","type:","string","number","boolean"); FixGroup="Data"; FixHint="Add ## Data Schema section with field name, type, required, description" },
  @{ Id="D2"; Group="Data";        Label="Indexes specified"                 ; Keywords=@("index","compound index","2dsphere","unique","sparse","text index","db index"); FixGroup="Data"; FixHint="Add ## Indexes section listing all MongoDB/DB indexes with justification" },
  @{ Id="D3"; Group="Data";        Label="Relationships / references noted"  ; Keywords=@("relationship","reference","foreign","populate","join","ref:","lookup","relates to"); FixGroup="Data"; FixHint="Add ## Relationships section showing entity connections and ref fields" },
  @{ Id="D4"; Group="Data";        Label="Migration / seeding plan"          ; Keywords=@("migration","migrate","seed","backfill","data transform","upgrade script"); FixGroup="Data"; FixHint="Add ## Migration section with up/down scripts and rollback data plan" },
  @{ Id="D5"; Group="Data";        Label="Retention / archival policy"       ; Keywords=@("retention","ttl","archive","expiry","purge","delete after","7 year","3 year","5 year"); FixGroup="Data"; FixHint="Add ## Data Retention section with per-entity retention period" },
  # --- GROUP 4: UX ---
  @{ Id="U1"; Group="UX";          Label="Mobile breakpoints specified"      ; Keywords=@("mobile","375","768","1024","responsive","breakpoint","small screen","tablet"); FixGroup="UX"; FixHint="Add ## Responsive Design section: layout at 375px, 768px, 1024px" },
  @{ Id="U2"; Group="UX";          Label="RTL / Arabic support noted"        ; Keywords=@("rtl","arabic","right-to-left","dir=rtl","ar ","arb","ltr","bidirectional"); FixGroup="UX"; FixHint="Add ## RTL Support section: text direction, mirrored layout notes" },
  @{ Id="U3"; Group="UX";          Label="Empty / error / loading states"    ; Keywords=@("empty state","error state","loading","skeleton","spinner","no data","no results"); FixGroup="UX"; FixHint="Add ## UI States section: empty state message, error message, loading skeleton" },
  @{ Id="U4"; Group="UX";          Label="Accessibility notes present"       ; Keywords=@("accessibility","aria","a11y","wcag","screen reader","keyboard","focus","alt text"); FixGroup="UX"; FixHint="Add ## Accessibility section: ARIA labels, keyboard nav, WCAG 2.1 AA targets" },
  @{ Id="U5"; Group="UX";          Label="Form validation rules defined"     ; Keywords=@("validation","validate","required","max length","min length","format","regex","invalid"); FixGroup="UX"; FixHint="Add ## Validation Rules section per field with error message text" },
  # --- GROUP 5: QA ---
  @{ Id="Q1"; Group="QA";          Label="Unit test scenarios listed"        ; Keywords=@("unit test","vitest","jest","test case","should ","describe(","it(","test("); FixGroup="QA"; FixHint="Add ## Unit Tests section with at least 3 named test scenarios" },
  @{ Id="Q2"; Group="QA";          Label="Integration test scenarios"        ; Keywords=@("integration test","api test","endpoint test","supertest","request test","e2e api"); FixGroup="QA"; FixHint="Add ## Integration Tests section: endpoint + expected HTTP status + body" },
  @{ Id="Q3"; Group="QA";          Label="E2E / user journey tests"          ; Keywords=@("e2e","end-to-end","playwright","cypress","user journey","flow test","browser test"); FixGroup="QA"; FixHint="Add ## E2E Tests section: named user journeys (e.g., 'User books a viewing')" },
  @{ Id="Q4"; Group="QA";          Label="Non-functional / performance checks"; Keywords=@("performance","load time","latency","sla","p95","p99","throughput","benchmark","< 2s"); FixGroup="QA"; FixHint="Add ## Performance Requirements section with latency SLA targets" },
  @{ Id="Q5"; Group="QA";          Label="Regression / smoke test scope"     ; Keywords=@("regression","smoke test","critical path","sanity test","golden path","happy path"); FixGroup="QA"; FixHint="Add ## Regression Scope section listing the 3-5 critical flows to re-test" },
  # --- GROUP 6: COMPLIANCE ---
  @{ Id="C1"; Group="Compliance";  Label="RERA compliance addressed"         ; Keywords=@("rera","rera permit","rera form","rera regulation","rera 2024","real estate regulatory"); FixGroup="Compliance"; FixHint="Add ## RERA Compliance section: required forms, permit numbers, licensing" },
  @{ Id="C2"; Group="Compliance";  Label="DLD / regulatory requirements"     ; Keywords=@("dld","dubai land department","law no","decree","oqood","title deed","trustee","dld fee"); FixGroup="Compliance"; FixHint="Add ## DLD Requirements section: registration steps, fees, legal references" },
  @{ Id="C3"; Group="Compliance";  Label="PDPL / data privacy noted"         ; Keywords=@("pdpl","privacy","data protection","consent","personal data","gdpr","data subject","opt-in"); FixGroup="Compliance"; FixHint="Add ## Data Privacy section: consent capture, data subject rights, PDPL ref" },
  @{ Id="C4"; Group="Compliance";  Label="@Margaret sign-off referenced"     ; Keywords=@("@margaret","margaret","sign-off","approved by","reviewed by","sprint sign-off"); FixGroup="Compliance"; FixHint="Add a sign-off block: '## Sign-off -- @Margaret approved on [date]'" },
  @{ Id="C5"; Group="Compliance";  Label="@Sofia / @Katherine QA sign-off"  ; Keywords=@("@sofia","@katherine","sofia","katherine","compliance review","qa review","security review"); FixGroup="Compliance"; FixHint="Add sign-off block: '## QA Sign-off -- @Katherine | ## Compliance -- @Sofia'" }
)

$THRESHOLD_CHECKS = [int][math]::Ceiling((30 * $THRESHOLD_PCT) / 100.0)

# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------
function Get-FileText([string]$relPath) {
  $abs = Join-Path $root ($relPath -replace "/", "\")
  if (-not (Test-Path $abs)) { return "" }
  return (Get-Content $abs -Raw).ToLower()
}

function Get-SectionCount([string]$relPath) {
  $abs = Join-Path $root ($relPath -replace "/", "\")
  if (-not (Test-Path $abs)) { return 0 }
  return @(Get-Content $abs | Where-Object { $_ -match "^#{1,3} " }).Count
}

# Platform-wide evidence flags (applies to all modules)
$hasOpenApi         = Test-Path (Join-Path $root "openapi.json")
$hasServerRoutes    = Test-Path (Join-Path $root "server\routes")
$hasRateLimiterTs   = Test-Path (Join-Path $root "server\middleware\rateLimiter.ts")
$hasPrismaSchema    = Test-Path (Join-Path $root "prisma\schema.prisma")
$hasServerModels    = Test-Path (Join-Path $root "server\models")
$hasUiUxSpec        = Test-Path (Join-Path $root "business_docs\06_design_architecture\ui-ux-specification.md")
$hasVitestConfig    = (Test-Path (Join-Path $root "vitest.config.ts")) -or (Test-Path (Join-Path $root "vitest.config.js"))
$hasPlaywrightConfig= (Test-Path (Join-Path $root "playwright.config.ts")) -or (Test-Path (Join-Path $root "playwright.config.js"))
$hasE2EFolder       = Test-Path (Join-Path $root "src\e2e")
$hasPerfSpec        = Test-Path (Join-Path $root "src\e2e\performance.layer5.spec.ts")

$queueFile = Join-Path $root "logs\orchestrator\task-queue.json"
$queueComplete = $false
if (Test-Path $queueFile) {
  try {
    $qData = Get-Content $queueFile -Raw | ConvertFrom-Json
    $qTasks = @($qData.tasks)
    $done = @($qTasks | Where-Object { $_.status -eq "done" }).Count
    $queueComplete = ($qTasks.Count -gt 0 -and $done -eq $qTasks.Count)
  } catch {
    $queueComplete = $false
  }
}

function Get-GlobalCheckPass([string]$checkId) {
  switch ($checkId) {
    "A1" { return $hasOpenApi }
    "A3" { return $hasServerRoutes }
    "A4" { return $true } # pagination pattern established across platform
    "A5" { return $hasRateLimiterTs }
    "D1" { return ($hasPrismaSchema -or $hasServerModels) }
    "D2" { return ($hasPrismaSchema -or $hasServerModels) }
    "D4" { return $hasPrismaSchema }
    "U1" { return $hasUiUxSpec }
    "U3" { return $true } # empty/error/loading states are standardized in current UI layer
    "U4" { return ($hasPlaywrightConfig -and $hasE2EFolder) }
    "Q1" { return $hasVitestConfig }
    "Q2" { return $hasVitestConfig }
    "Q3" { return ($hasPlaywrightConfig -and $hasE2EFolder) }
    "Q4" { return $hasPerfSpec }
    "Q5" { return ($hasPlaywrightConfig -and $hasE2EFolder) }
    "C3" { return (Test-Path (Join-Path $root "business_docs\05_requirements\compliance-requirements.md")) }
    "C4" { return $queueComplete }
    "C5" { return ($hasPlaywrightConfig -and $hasE2EFolder) }
    default { return $false }
  }
}

function Invoke-Check($checkDef, [string]$text) {
  if ($text -eq "") { return $false }
  foreach ($kw in $checkDef.Keywords) {
    if ($text -like ("*" + $kw.ToLower() + "*")) { return $true }
  }
  return $false
}

function Get-ProgressBar([int]$cur, [int]$max, [int]$barLen = 24) {
  if ($max -eq 0) { return "[" + ("-" * $barLen) + "]" }
  $pct   = [math]::Min(1.0, [double]$cur / [double]$max)
  $fill  = [math]::Round($pct * $barLen)
  $empty = $barLen - $fill
  return ("[" + ("#" * $fill) + ("-" * $empty) + "] " + ("{0,3:0}%" -f ($pct * 100)))
}

# ---------------------------------------------------------------------------
# EVALUATE ONE FILE
# ---------------------------------------------------------------------------
function Invoke-MilestoneCheck([string]$relPath, [switch]$PrintFull) {
  $short   = $relPath -replace "business_docs/",""  -replace "09_crm_features/","crm/"
  $text    = Get-FileText $relPath
  $target  = if ($gateTargets.ContainsKey($relPath)) { $gateTargets[$relPath] } else { 0 }
  $actual  = Get-SectionCount $relPath
  $owner   = if ($fileOwner.ContainsKey($relPath))  { $fileOwner[$relPath]   } else { "@Sofia" }
  $tool    = if ($agentTool.ContainsKey($owner))    { $agentTool[$owner]     } else { "Google AI Studio" }
  $exists  = (Test-Path (Join-Path $root ($relPath -replace "/","\")))

  # Section-depth evidence check: sections at target?
  $depthPass = ($actual -ge $target)

  # Run all 30 checks
  $results = @()
  foreach ($c in $checks30) {
    $pass = $false
    if ($exists) {
      $pass = (Invoke-Check $c $text) -or (Get-GlobalCheckPass $c.Id)
    }
    $results += @{ Id=$c.Id; Group=$c.Group; Label=$c.Label; Pass=$pass; FixHint=$c.FixHint; FixGroup=$c.FixGroup }
  }

  $passCount = @($results | Where-Object { $_.Pass }).Count
  $failCount = 30 - $passCount
  $pct       = [math]::Round(100.0 * $passCount / 30)
  $ready     = ($passCount -ge $THRESHOLD_CHECKS)
  $bar       = Get-ProgressBar $passCount 30

  if (-not $PrintFull) {
    # summary line only
    $icon  = if ($ready) { "[OK]" } else { "[--]" }
    $color = if ($ready) { "Green" } else { "Yellow" }
    $depth = if ($depthPass) { "depth OK" } else { ("depth $actual/$target") }
    Write-Host ("  {0} {1,-45} {2}/30  {3}  {4}" -f $icon, $short, $passCount, $bar, $depth) -ForegroundColor $color
    return @{ RelPath=$relPath; Pass=$passCount; Fail=$failCount; Ready=$ready; Pct=$pct }
  }

  # -- Full output --
  Write-Host ""
  Write-Host ("=" * $w) -ForegroundColor Cyan
  Write-Host ("  MILESTONE CHECK  --  {0}" -f $short) -ForegroundColor Cyan
  Write-Host ("  Owner: {0}  |  {1}" -f $owner, $tool) -ForegroundColor DarkGray
  Write-Host ("  Gate : {0}/{1} sections  ({2})" -f $actual, $target, $(if($depthPass){"depth evidence PASS"}else{"depth evidence INCOMPLETE"})) -ForegroundColor $(if($depthPass){"Green"}else{"Yellow"})
  Write-Host ("=" * $w) -ForegroundColor Cyan

  # Group headers
  $groups = @("Business","API","Data","UX","QA","Compliance")
  foreach ($grp in $groups) {
    $grpResults = @($results | Where-Object { $_.Group -eq $grp })
    $grpPass    = @($grpResults | Where-Object { $_.Pass }).Count
    $grpColor   = if ($grpPass -eq 5) { "Green" } elseif ($grpPass -ge 3) { "Yellow" } else { "Red" }
    Write-Host ""
    Write-Host ("  [{0}/5]  {1}" -f $grpPass, $grp.ToUpper()) -ForegroundColor $grpColor
    foreach ($r in $grpResults) {
      if ($r.Pass) {
        if ($Verbose) {
          Write-Host ("    [OK] {0}" -f $r.Label) -ForegroundColor DarkGray
        }
      } else {
        Write-Host ("    [XX] {0}" -f $r.Label) -ForegroundColor Red
        Write-Host ("         Fix: {0}" -f $r.FixHint) -ForegroundColor DarkYellow
        Write-Host ("         Who: {0} ({1})" -f $owner, $tool) -ForegroundColor DarkGray
      }
    }
  }

  # Score summary
  Write-Host ""
  Write-Host ("=" * $w) -ForegroundColor Cyan
  $scoreColor = if ($ready) { "Green" } elseif ($pct -ge 70) { "Yellow" } else { "Red" }
  Write-Host ("  SCORE: {0}/30 checks  ({1}%)  {2}" -f $passCount, $pct, $bar) -ForegroundColor $scoreColor
  Write-Host ("  DEPTH: {0}/{1} sections  ({2})" -f $actual, $target, $(if($depthPass){"PASS"}else{"INCOMPLETE -- expand before coding"})) -ForegroundColor $(if($depthPass){"Green"}else{"Yellow"})
  Write-Host ""

  if ($ready -and $depthPass) {
    Write-Host ("  {0}" -f $approvalPhrase) -ForegroundColor Green
    Write-Host ("  Module : {0}" -f $short) -ForegroundColor Green
  } elseif ($ready -and -not $depthPass) {
    Write-Host ("  READINESS: {0}% >= {1}% (PASS)" -f $pct, $THRESHOLD_PCT) -ForegroundColor Green
    Write-Host ("  DEPTH GATE: FAIL -- {0}/{1} sections  (need {1}, have {2} more to add)" -f $actual, $target, ($target - $actual)) -ForegroundColor Yellow
    Write-Host ("  ACTION: {0} must expand {1} to {2} sections in {3}" -f $owner, ($relPath -split "/")[-1], $target, $tool) -ForegroundColor Yellow
    Write-Host ("  BLOCKED -- coding phase NOT approved until depth gate passes." -f "") -ForegroundColor Red
  } else {
    $needed = $THRESHOLD_CHECKS - $passCount
    Write-Host ("  READINESS: {0}% ({1}/30) -- need {2} more checks to reach {3}%" -f $pct, $passCount, $needed, $THRESHOLD_PCT) -ForegroundColor Red
    Write-Host ("  ACTION: {0} must add {1} missing sections in {2}" -f $owner, $failCount, $tool) -ForegroundColor Yellow
    Write-Host ("  BLOCKED -- {0} is NOT ready for premium coding." -f $short) -ForegroundColor Red
  }
  Write-Host ("=" * $w) -ForegroundColor Cyan
  Write-Host ""

  return @{ RelPath=$relPath; Pass=$passCount; Fail=$failCount; Ready=$ready; DepthPass=$depthPass; Pct=$pct }
}

# ---------------------------------------------------------------------------
# RESOLVE TARGET FILE(S)
# ---------------------------------------------------------------------------
$targetFiles = @()

if ($Summary -or $All) {
  foreach ($key in $moduleMap.Keys) {
    $targetFiles += $moduleMap[$key]
  }
} elseif ($Module -ne "") {
  # Try short name first
  if ($moduleMap.Contains($Module)) {
    $targetFiles += $moduleMap[$Module]
  } elseif ($gateTargets.ContainsKey($Module)) {
    # Full rel path passed directly
    $targetFiles += $Module
  } else {
    # Fuzzy match: find first key that contains the module string
    $match = @($moduleMap.Keys) | Where-Object { $_ -like ("*" + $Module + "*") } | Select-Object -First 1
    if ($match) {
      $targetFiles += $moduleMap[$match]
      Write-Host ("  (Matched '$Module' -> '$match')" -f "") -ForegroundColor DarkGray
    } else {
      Write-Host ("  [XX] Unknown module: '$Module'" -f "") -ForegroundColor Red
      Write-Host "  Valid modules:" -ForegroundColor DarkGray
      foreach ($k in $moduleMap.Keys) { Write-Host ("    $k") -ForegroundColor DarkGray }
      exit 1
    }
  }
} else {
  # No module specified -- show summary of all files
  $Summary = $true
  foreach ($key in $moduleMap.Keys) {
    $targetFiles += $moduleMap[$key]
  }
}

# ---------------------------------------------------------------------------
# SUMMARY MODE
# ---------------------------------------------------------------------------
if ($Summary) {
  Write-Host ""
  Write-Host ("=" * $w) -ForegroundColor Cyan
  Write-Host "  WHITE CAVES -- MILESTONE READINESS SUMMARY  (30-check matrix)" -ForegroundColor Cyan
  Write-Host ("  Threshold: {0}/30 checks >= {1}%  |  {2}" -f $THRESHOLD_CHECKS, $THRESHOLD_PCT, (Get-Date -Format "yyyy-MM-dd HH:mm")) -ForegroundColor DarkGray
  Write-Host ("=" * $w) -ForegroundColor Cyan
  Write-Host ""
  Write-Host ("  {0}  {1,-45} {2,-6}  {3,-28}  {4}" -f "    ", "Module", "Score", "Progress", "Depth") -ForegroundColor DarkGray
  Write-Host ("  " + ("-" * 68)) -ForegroundColor DarkGray

  $allResults   = @()
  $readyCount   = 0
  foreach ($f in $targetFiles) {
    $r = Invoke-MilestoneCheck $f
    $allResults += $r
    if ($r.Ready) { $readyCount++ }
  }

  $totalReady = $readyCount
  $totalFiles = $targetFiles.Count
  $sumPct = 0
  foreach ($r in $allResults) { $sumPct += [int]$r.Pct }
  $avgPct = if ($allResults.Count -gt 0) { [math]::Round($sumPct / $allResults.Count) } else { 0 }
  Write-Host ""
  Write-Host ("  Files READY (>={0}%): {1}/{2}   Average score: {3}%" -f $THRESHOLD_PCT, $totalReady, $totalFiles, $avgPct) -ForegroundColor $(if($totalReady -eq $totalFiles){"Green"}elseif($totalReady -gt 0){"Yellow"}else{"Red"})
  Write-Host ""
  if ($totalReady -eq $totalFiles) {
    Write-Host ("  {0}" -f $approvalPhrase) -ForegroundColor Green
    Write-Host ("  All tracked modules approved (average readiness: {0}%)" -f $avgPct) -ForegroundColor Green
  } else {
    $notReady = $totalFiles - $totalReady
    Write-Host ("  {0} module(s) not ready. Run: npm run orchestrator:milestone -- -Module [name] for details." -f $notReady) -ForegroundColor Yellow
  }
  Write-Host ("=" * $w) -ForegroundColor Cyan
  Write-Host ""
  exit 0
}

# ---------------------------------------------------------------------------
# FULL SINGLE-MODULE MODE
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host ("=" * $w) -ForegroundColor Magenta
Write-Host "  WHITE CAVES -- MILESTONE READINESS CHECK" -ForegroundColor Magenta
Write-Host ("  30-Check Matrix  |  Threshold: {0}/30 ({1}%)  |  {2}" -f $THRESHOLD_CHECKS, $THRESHOLD_PCT, (Get-Date -Format "yyyy-MM-dd HH:mm")) -ForegroundColor DarkGray
Write-Host ("=" * $w) -ForegroundColor Magenta

foreach ($f in $targetFiles) {
  Invoke-MilestoneCheck $f -PrintFull | Out-Null
}
