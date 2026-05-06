# test-rollout-generator.ps1 -- Generates WAVE_0N_TEST_ROLLOUT.md
# Per-module test plan (unit/integration/E2E) + staged rollout gate table.
param(
  [string]$WorkspaceRoot = ".",
  [int]$WaveNumber = 1
)

$queueFile = Join-Path $WorkspaceRoot "logs\orchestrator\task-queue.json"
$wavesDir  = Join-Path $WorkspaceRoot "plans\waves"
$today     = (Get-Date).ToString("yyyy-MM-dd")
$waveLabel = "WAVE_$('{0:D2}' -f $WaveNumber)"
$outFile   = Join-Path $wavesDir "$waveLabel`_TEST_ROLLOUT.md"

if (-not (Test-Path $wavesDir)) { New-Item $wavesDir -ItemType Directory -Force | Out-Null }
if (-not (Test-Path $queueFile)) {
  Write-Host "[ERROR] Queue file not found: $queueFile" -ForegroundColor Red; exit 1
}

$q         = Get-Content $queueFile -Raw | ConvertFrom-Json
$rootTasks = @($q.tasks | Where-Object { -not ($_.taskId -match "b$|c$") } | Sort-Object taskId)

$laneNames = @{
  A = "Compliance / Legal / UX / AI"
  B = "Valuation / Market / Finance"
  C = "Schedule / Off-plan / Analytics"
  D = "Offers / WhatsApp / AI-Chat"
}

# E2E critical path scenarios per agent
$e2eScenarios = @{
  "@Sofia"    = "compliance rule is enforced on property listing creation"
  "@Timnit"   = "DLD transaction flow submits and returns case number"
  "@Victoria" = "tenancy contract is generated with correct RERA fields"
  "@Annie"    = "tenant can log in, view lease, and submit maintenance request"
  "@Marissa"  = "luxury property listing triggers VIP concierge workflow"
  "@Rachel"   = "SEO meta tags render correctly for property detail page"
  "@Joelle"   = "AI assistant responds within 3s and falls back on timeout"
  "@Fei-Fei"  = "AVM valuation returns estimate with confidence score"
  "@Anima"    = "secondary sale creates DLD transaction record"
  "@Mary"     = "property CSV bulk import completes with error report"
  "@Invoice"  = "VAT invoice is generated with correct TRN and 5% calculation"
  "@Booking"  = "viewing is scheduled, confirmed, and ICS file downloaded"
  "@Maya"     = "off-plan unit reservation creates Oqood DLD record"
  "@Hedy"     = "audit trail records every CREATE/UPDATE/DELETE with immutable log"
  "@Cassie"   = "analytics dashboard loads with correct KPI tiles in < 2s"
  "@Jaime"    = "offer is submitted, countered, and accepted with MOU PDF generated"
  "@Corinne"  = "AI chat responds via streaming SSE and persists conversation"
}

$out = New-Object System.Text.StringBuilder
function Add([string]$line) { [void]$out.AppendLine($line) }

Add "# $waveLabel -- Test Plan and Staged Rollout"
Add ""
Add "> **Generated:** $today  |  Modules: $($rootTasks.Count)  |  Framework: Vitest (unit/integration) + Playwright (E2E)"
Add "> Coverage targets: Unit >= 90% | Integration >= 80% | E2E >= critical paths"
Add ""
Add "---"
Add ""
Add "## Test Infrastructure"
Add ""
Add "| Layer | Framework | Config File | Run Command |"
Add "|-------|-----------|-------------|-------------|"
Add "| Unit | Vitest | vitest.config.js | npm run test:unit |"
Add "| Integration | Vitest | vitest.config.js | npm run test:integration |"
Add "| E2E | Playwright | playwright.config.ts | npm run test:e2e |"
Add "| Coverage | Vitest + c8 | vitest.config.js | npm run test:coverage |"
Add ""
Add "---"
Add ""

foreach ($lane in @("A","B","C","D")) {
  $laneMods = @($rootTasks | Where-Object { $_.lane -eq $lane })
  if ($laneMods.Count -eq 0) { continue }

  Add "## Lane $lane -- $($laneNames[$lane])"
  Add ""

  foreach ($m in $laneMods) {
    $a       = $m.agent
    $name    = ($a -replace "@","").Replace("-","").ToLower()
    $nameTitle = ($a -replace "@","").Replace("-","")
    $e2eDesc = if ($e2eScenarios.ContainsKey($a)) { $e2eScenarios[$a] } else { "full CRUD flow end-to-end" }

    Add "### $a -- $($m.title)"
    Add ""

    # Unit tests
    Add "#### Unit Tests"
    Add ""
    Add "- **File:** ``src/services/$name.service.test.ts``"
    Add "- **Framework:** Vitest"
    Add "- **Coverage target:** >= 90%"
    Add ""
    Add "| Scenario | Test Type | Expected |"
    Add "|----------|-----------|----------|"
    Add "| Create $nameTitle -- valid data | Happy path | Returns created entity with id |"
    Add "| Create $nameTitle -- missing required field | Validation | Throws ZodError |"
    Add "| Get $nameTitle by id -- exists | Happy path | Returns full entity |"
    Add "| Get $nameTitle by id -- not found | Error | Throws NotFoundError (404) |"
    Add "| Update $nameTitle -- valid data | Happy path | Returns updated entity |"
    Add "| Update $nameTitle -- unauthorized role | Auth | Throws ForbiddenError (403) |"
    Add "| Delete $nameTitle -- admin role | Happy path | Soft-deletes, returns 204 |"
    Add "| Delete $nameTitle -- non-admin | Auth | Throws ForbiddenError (403) |"
    Add "| List $nameTitle -- paginated | Pagination | Returns page=1 limit=10 with total |"
    Add "| List $nameTitle -- invalid filter | Validation | Throws ZodError |"
    Add ""

    # Integration tests
    Add "#### Integration Tests"
    Add ""
    Add "- **File:** ``test/$name.integration.test.ts``"
    Add "- **Framework:** Vitest + MongoDB in-memory"
    Add "- **Coverage target:** >= 80%"
    Add ""
    Add "| Scenario | Setup | Expected |"
    Add "|----------|-------|----------|"
    Add "| DB round-trip: create and retrieve | Seed test DB | Persisted data matches input |"
    Add "| RERA/DLD validation roundtrip | Compliance rules active | Rule violations rejected |"
    Add "| Audit trail written on mutation | Mutation triggered | audit_trail doc exists |"
    Add "| Concurrent update handled | Two simultaneous updates | One wins, no data corruption |"
    Add "| Pagination returns correct cursor | 25 docs seeded | Page 1 = 10, page 3 = 5 |"
    Add "| Soft-delete excludes from list | Delete then list | Deleted doc not in results |"
    Add ""

    # E2E tests
    Add "#### E2E Tests"
    Add ""
    Add "- **File:** ``e2e/$name.spec.ts``"
    Add "- **Framework:** Playwright (Chromium)"
    Add "- **Critical path:** $e2eDesc"
    Add ""
    Add "| Scenario | Steps | Pass Criteria |"
    Add "|----------|-------|--------------|"
    Add "| Critical path | $e2eDesc | No errors, correct data displayed |"
    Add "| Mobile (375px) | Repeat critical path at 375px viewport | Layout intact, no overflow |"
    Add "| RTL (Arabic) | Set lang=ar, repeat critical path | Correct right-to-left layout |"
    Add "| Error state | Submit invalid form | Inline error message visible |"
    Add "| Empty state | Load with no data | Empty state UI + CTA visible |"
    Add ""

    # Rollout gate
    Add "#### Rollout Gate"
    Add ""
    Add "| Gate | Requirement | Status |"
    Add "|------|-------------|--------|"
    Add "| Unit coverage | >= 90% | PENDING |"
    Add "| Integration coverage | >= 80% | PENDING |"
    Add "| E2E critical path | PASS | PENDING |"
    Add "| TypeScript errors | 0 | PENDING |"
    Add "| ESLint errors | 0 | PENDING |"
    Add "| Lighthouse perf | >= 90 | PENDING |"
    Add "| WCAG AA | 0 violations | PENDING |"
    Add "| @Katherine sign-off | Reviewed | PENDING |"
    Add ""
  }
}

Add "---"
Add ""
Add "## Staged Rollout Plan"
Add ""
Add "> Each stage gates the next. No stage can begin until ALL checks in the previous stage pass."
Add ""
Add "| Stage | Modules | Audience | Success Metric | Rollback Trigger |"
Add "|-------|---------|----------|----------------|-----------------|"
Add "| Alpha (internal) | All 17 modules | Dev team only | 0 critical bugs in 48h | Any critical bug |"
Add "| Beta (staff) | All 17 modules | White Caves staff (< 10 users) | 0 data integrity issues | Data loss or corruption |"
Add "| Soft launch | All 17 modules | 5% of real users | Error rate < 0.5% | Error rate > 1% |"
Add "| General availability | All 17 modules | All users | p95 response < 500ms | p95 > 1500ms for 5min |"
Add ""
Add "---"
Add ""
Add "## Test Commands Quick Reference"
Add ""
Add "    npm run test:unit                    # run all Vitest unit tests"
Add "    npm run test:integration             # run integration tests"
Add "    npm run test:coverage                # run coverage report"
Add "    npm run test:e2e                     # run all Playwright E2E tests"
Add "    npx vitest run src/services/NAME.service.test.ts   # single unit file"
Add "    npx playwright test e2e/NAME.spec.ts               # single E2E file"
Add "    npx playwright test --project=chromium --grep 'critical path'  # filter tests"
Add ""
Add "---"
Add ""
Add "*Auto-generated by test-rollout-generator.ps1 on $today*"

$content = $out.ToString()
[System.IO.File]::WriteAllText($outFile, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "[WRITTEN] $outFile  ($($content.Split("`n").Count) lines)" -ForegroundColor Green
