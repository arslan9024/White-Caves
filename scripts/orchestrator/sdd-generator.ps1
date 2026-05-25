# sdd-generator.ps1 -- Generates WAVE_0N_SDD.md (System Design Document)
# One section per agent with 10-evidence-layer stubs pulled from task queue + business_docs.
param(
  [string]$WorkspaceRoot = ".",
  [int]$WaveNumber = 1
)

$queueFile = Join-Path $WorkspaceRoot "logs\orchestrator\task-queue.json"
$wavesDir  = Join-Path $WorkspaceRoot "plans\waves"
$today     = (Get-Date).ToString("yyyy-MM-dd")
$waveLabel = "WAVE_$('{0:D2}' -f $WaveNumber)"
$outFile   = Join-Path $wavesDir "$waveLabel`_SDD.md"

# Load policy-defined approval phrase (fallback to known default)
$_policyFile = Join-Path $WorkspaceRoot "scripts\orchestrator\policy.json"
$approvalPhrase  = "@Ada — Context Ready (60% Readiness) — Coding Phase Approved"
$readinessPct    = 60
if (Test-Path $_policyFile) {
  try {
    $_pol = Get-Content $_policyFile -Raw | ConvertFrom-Json
    if ($_pol.approvalPhrase)       { $approvalPhrase = [string]$_pol.approvalPhrase }
    if ($_pol.readinessThresholdPct){ $readinessPct   = [int]$_pol.readinessThresholdPct }
  } catch { <# keep defaults #> }
}

if (-not (Test-Path $wavesDir)) { New-Item $wavesDir -ItemType Directory -Force | Out-Null }

if (-not (Test-Path $queueFile)) {
  Write-Host "[ERROR] Queue file not found: $queueFile" -ForegroundColor Red; exit 1
}

$q      = Get-Content $queueFile -Raw | ConvertFrom-Json
$rootTasks = @($q.tasks | Where-Object { -not ($_.taskId -match "b$|c$") } | Sort-Object taskId)

$apiMap = @{
  "@Sofia"    = "/api/compliance"
  "@Timnit"   = "/api/dld"
  "@Victoria" = "/api/tenancy"
  "@Annie"    = "/api/tenant-portal"
  "@Marissa"  = "/api/luxury"
  "@Rachel"   = "/api/seo"
  "@Joelle"   = "/api/ai-assistants"
  "@Fei-Fei"  = "/api/valuations"
  "@Anima"    = "/api/secondary-sales"
  "@Mary"     = "/api/properties"
  "@Invoice"  = "/api/finance"
  "@Booking"  = "/api/viewings"
  "@Maya"     = "/api/off-plan"
  "@Hedy"     = "/api/audit"
  "@Cassie"   = "/api/analytics"
  "@Jaime"    = "/api/offers"
  "@Corinne"  = "/api/ai-chat"
}

$docMap = @{
  "@Sofia"    = "business_docs/05_requirements/compliance-requirements.md"
  "@Timnit"   = "business_docs/09_crm_features/dld-integration.md"
  "@Victoria" = "business_docs/09_crm_features/tenancy-ejari.md"
  "@Annie"    = "business_docs/09_crm_features/tenant-portal.md"
  "@Marissa"  = "business_docs/09_crm_features/luxury-segment.md"
  "@Rachel"   = "business_docs/09_crm_features/seo-strategy.md"
  "@Joelle"   = "business_docs/03_ai_assistants/README.md"
  "@Fei-Fei"  = "business_docs/09_crm_features/property-valuation.md"
  "@Anima"    = "business_docs/09_crm_features/secondary-sales.md"
  "@Mary"     = "business_docs/09_crm_features/sentinel-property.md"
  "@Invoice"  = "business_docs/09_crm_features/financial-reporting.md"
  "@Booking"  = "business_docs/09_crm_features/viewings.md"
  "@Maya"     = "business_docs/09_crm_features/off-plan-projects.md"
  "@Hedy"     = "business_docs/09_crm_features/audit-trail.md"
  "@Cassie"   = "business_docs/09_crm_features/analytics-dashboard.md"
  "@Jaime"    = "business_docs/09_crm_features/offers.md"
  "@Corinne"  = "business_docs/09_crm_features/ai-chat.md"
}

$laneNames = @{ A="Compliance/Legal/UX/AI"; B="Valuation/Market/Finance"; C="Schedule/Off-plan/Analytics"; D="Offers/WhatsApp/AI-Chat" }

function Get-TopSections([string]$relPath, [string]$root, [int]$max = 5) {
  $abs = Join-Path $root $relPath
  if (-not (Test-Path $abs)) { return @() }
  $lines = Get-Content $abs
  $h2 = @($lines | Where-Object { $_ -match "^##\s" } | ForEach-Object { $_ -replace "^##\s+","" } | Select-Object -First $max)
  return $h2
}

$fence = '```'
$L = [System.Collections.Generic.List[string]]::new()
$L.Add("# $waveLabel -- System Design Document (SDD)")
$L.Add("")
$L.Add("> **Status:** DRAFT | Generated: $today | Modules: $($rootTasks.Count) | Rule 18: 10 evidence layers per module")
$L.Add("> Expand each section with full evidence before requesting @Ada coding authorization.")
$L.Add("")
$L.Add("## Evidence Layer Reference")
$L.Add("")
$L.Add("| # | Layer | Required Content |")
$L.Add("|---|-------|-----------------|")
$L.Add("| 1 | Business Rule | Core business logic, acceptance criteria |")
$L.Add("| 2 | API Contract | Endpoint list, request/response JSON schema |")
$L.Add("| 3 | Data Schema | Prisma model with all fields, types, relations |")
$L.Add("| 4 | Validation Rules | Zod schema, field constraints, error messages |")
$L.Add("| 5 | Failure/Edge Handling | All error scenarios and HTTP codes |")
$L.Add("| 6 | Security/Compliance | RBAC roles, PII handling, RERA/DLD rules |")
$L.Add("| 7 | UX States | Loading/empty/error states at 375/768/1440px + RTL |")
$L.Add("| 8 | Tests | Unit, integration, E2E file paths and scenario list |")
$L.Add("| 9 | Observability | Metrics, logging, alert thresholds |")
$L.Add("| 10 | Rollback/Migration | Prisma migration name, rollback trigger + procedure |")
$L.Add("")

foreach ($lane in @("A","B","C","D")) {
  $laneMods = @($rootTasks | Where-Object { $_.lane -eq $lane })
  if ($laneMods.Count -eq 0) { continue }
  $L.Add("---")
  $L.Add("")
  $L.Add("## Lane $lane -- $($laneNames[$lane])")
  $L.Add("")

  foreach ($m in $laneMods) {
    $a       = $m.agent
    $apiBase = if ($apiMap.ContainsKey($a)) { $apiMap[$a] } else { "/api/module" }
    $docFile = if ($docMap.ContainsKey($a)) { $docMap[$a] } else { "" }
    $sects   = if ($docFile -ne "") { Get-TopSections $docFile $WorkspaceRoot 5 } else { @() }
    $modelName = ($a -replace "@","").Replace("-","")

    $L.Add("### $a -- $($m.title)")
    $L.Add("")
    $L.Add("| Field | Value |")
    $L.Add("|-------|-------|")
    $L.Add("| Task | $($m.taskId) |")
    $L.Add("| Lane | $lane |")
    $L.Add("| API Base | ``$apiBase`` |")
    $L.Add("| Business Doc | ``$docFile`` |")
    $L.Add("| Evidence Layers Complete | 0/10 (DRAFT) |")
    $L.Add("")

    $L.Add("#### Layer 1 -- Business Rule")
    $L.Add("")
    if ($sects.Count -gt 0) {
      $L.Add("> Source: ``$docFile`` -- Top sections: " + ($sects -join " | "))
    } else {
      $L.Add("> [PENDING] Business doc below target depth. Free agents must expand before coding.")
    }
    $L.Add("")
    $L.Add("- Core rule: [expand from business doc]")
    $L.Add("- Acceptance criteria: [expand from business doc]")
    $L.Add("- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]")
    $L.Add("")

    $L.Add("#### Layer 2 -- API Contract")
    $L.Add("")
    $L.Add("| Method | Route | Auth | Description |")
    $L.Add("|--------|-------|------|-------------|")
    $L.Add("| GET | ``$apiBase`` | JWT | List (paginated, ?page=&limit=) |")
    $L.Add("| GET | ``$apiBase/:id`` | JWT | Get single record |")
    $L.Add("| POST | ``$apiBase`` | JWT + role | Create |")
    $L.Add("| PUT | ``$apiBase/:id`` | JWT + owner | Update |")
    $L.Add("| DELETE | ``$apiBase/:id`` | JWT + admin | Soft-delete |")
    $L.Add("")
    $L.Add("${fence}json")
    $L.Add("// POST $apiBase -- request body (expand with real fields)")
    $L.Add("{}")
    $L.Add("")
    $L.Add("// Response 201")
    $L.Add('{ "id": "cuid", "createdAt": "ISO8601" }')
    $L.Add($fence)
    $L.Add("")

    $L.Add("#### Layer 3 -- Data Schema")
    $L.Add("")
    $L.Add("${fence}prisma")
    $L.Add("model $modelName {")
    $L.Add("  id         String   @id @default(cuid())")
    $L.Add("  createdAt  DateTime @default(now())")
    $L.Add("  updatedAt  DateTime @updatedAt")
    $L.Add("  // TODO: expand from business doc $docFile")
    $mn = $modelName.ToLower()
    $L.Add("  @@map(`"${mn}s`")")
    $L.Add("}")
    $L.Add($fence)
    $L.Add("")

    $L.Add("#### Layer 4 -- Validation Rules")
    $L.Add("")
    $L.Add("${fence}typescript")
    $mn2 = $modelName.ToLower()
    $L.Add("// src/validators/${mn2}.validator.ts")
    $L.Add("import { z } from 'zod';")
    $L.Add("export const Create${modelName}Schema = z.object({")
    $L.Add("  // TODO: add fields from Layer 3 schema")
    $L.Add("});")
    $L.Add($fence)
    $L.Add("")

    $L.Add("#### Layer 5 -- Failure / Edge Handling")
    $L.Add("")
    $L.Add("| Scenario | HTTP | Response |")
    $L.Add("|----------|------|----------|")
    $L.Add("| Not found | 404 | ``{ error: 'NOT_FOUND', message: '...' }`` |")
    $L.Add("| Validation error | 422 | ``{ error: 'VALIDATION', fields: [...] }`` |")
    $L.Add("| Unauthorized | 401 | ``{ error: 'UNAUTHORIZED' }`` |")
    $L.Add("| Forbidden (RBAC) | 403 | ``{ error: 'FORBIDDEN' }`` |")
    $L.Add("| DB timeout | 503 | ``{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }`` |")
    $L.Add("| Upstream API down | 503 | Queue + exponential backoff (3 retries) |")
    $L.Add("")

    $L.Add("#### Layer 6 -- Security / Compliance")
    $L.Add("")
    $L.Add("| Control | Implementation |")
    $L.Add("|---------|---------------|")
    $L.Add("| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint] |")
    $L.Add("| PII fields | Encrypt at rest (AES-256), mask in logs |")
    $L.Add("| Input sanitization | Zod parse before any DB write |")
    $L.Add("| Audit trail | Every mutation -> audit_trail collection (@Hedy) |")
    $L.Add("| RERA compliance | Rules from compliance-requirements.md Section [TBD] |")
    $L.Add("| Rate limit | 100 req/min per user (Express rate-limiter middleware) |")
    $L.Add("")

    $L.Add("#### Layer 7 -- UX States")
    $L.Add("")
    $L.Add("| State | 375px (Mobile) | 768px (Tablet) | 1440px (Desktop) | RTL |")
    $L.Add("|-------|---------------|----------------|-----------------|-----|")
    $L.Add("| Loading | Skeleton card | Skeleton grid | Skeleton table | Mirror |")
    $L.Add("| Empty | Icon + msg + CTA | Same | Same | Mirrored |")
    $L.Add("| Error | Toast + retry | Toast + retry | Inline alert | Mirrored |")
    $L.Add("| Success | Toast green 3s | Same | Same | Mirrored |")
    $L.Add("| Offline | Banner + queue | Same | Same | Mirrored |")
    $L.Add("")

    $L.Add("#### Layer 8 -- Tests")
    $L.Add("")
    $L.Add("| Type | File | Key Scenarios |")
    $L.Add("|------|------|--------------|")
    $L.Add("| Unit | ``src/services/$($modelName.ToLower()).test.ts`` | CRUD happy path, validation, auth |")
    $L.Add("| Integration | ``test/$($modelName.ToLower()).integration.test.ts`` | DB round-trip, RERA rules |")
    $L.Add("| E2E | ``e2e/$($modelName.ToLower()).spec.ts`` | Full flow: UI -> API -> DB |")
    $L.Add("")
    $L.Add("> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths")
    $L.Add("")

    $L.Add("#### Layer 9 -- Observability")
    $L.Add("")
    $L.Add("| Metric | Type | Alert |")
    $L.Add("|--------|------|-------|")
    $L.Add("| p95 response time | Histogram | > 500ms |")
    $L.Add("| Error rate | Counter | > 1%/min |")
    $L.Add("| DB query time | Histogram | > 200ms |")
    $L.Add("| Auth failures | Counter | > 10/min |")
    $L.Add("| Queue depth | Gauge | > 100 pending |")
    $L.Add("")
    $L.Add("> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode")
    $L.Add("")

    $L.Add("#### Layer 10 -- Rollback / Migration")
    $L.Add("")
    $L.Add("- Migration name: ``$(Get-Date -Format 'yyyyMMdd')_add_$($modelName.ToLower())``")
    $L.Add("- Rollback trigger: error rate > 5% sustained for 5 minutes")
    $L.Add("- Rollback procedure:")
    $L.Add("  1. ``prisma migrate resolve --rolled-back <migration-name>``")
    $L.Add("  2. Redeploy previous Docker image tag")
    $L.Add("  3. Verify health endpoint returns 200")
    $L.Add("- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas")
    $L.Add("- Feature flag: ``ENABLE_$($modelName.ToUpper())`` env var for gradual rollout")
    $L.Add("")
  }
}

$L.Add("---")
$L.Add("")
$L.Add("## Sign-off Required Before Coding")
$L.Add("")
$L.Add("| Role | Agent | Status | Date | Notes |")
$L.Add("|------|-------|--------|------|-------|")
$L.Add("| Chief Architect | @Ada | PENDING | | Must declare: $approvalPhrase |")
$L.Add("| Project Manager | @Margaret | PENDING | | Sprint table updated + daily sync run |")
$L.Add("| QA Lead | @Katherine | PENDING | | Test scenarios reviewed |")
$L.Add("| Compliance | @Sofia | PENDING | | RERA/DLD rules verified |")
$L.Add("")
$L.Add("> When ALL sign-offs are APPROVED and readiness-packet.ps1 reports >= ${readinessPct}%:")
$L.Add("> ``$approvalPhrase``")
$L.Add("")
$L.Add("---")
$L.Add("*Auto-generated by sdd-generator.ps1 on $today -- expand all DRAFT sections with free agent output*")

$content = $L -join "`n"
[System.IO.File]::WriteAllText($outFile, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "[WRITTEN] $outFile  ($($L.Count) lines)" -ForegroundColor Green
