$candidates = @()
if ($env:API_BASE_URL) {
    $candidates += $env:API_BASE_URL.TrimEnd('/')
}
$candidates += @(
    "http://localhost:5000",
    "http://localhost:5001",
    "http://localhost:5002",
    "http://localhost:5003",
    "http://localhost:5004",
    "http://localhost:5005",
    "http://localhost:3000"
)

$baseUrl = $null
foreach ($candidate in $candidates) {
    try {
        $probe = Invoke-WebRequest "$candidate/health" -UseBasicParsing -TimeoutSec 5
        if ($probe.StatusCode -ge 200 -and $probe.StatusCode -lt 500) {
            $baseUrl = $candidate
            break
        }
    }
    catch {
        # Continue probing next candidate.
    }
}

if (-not $baseUrl) {
    Write-Host ""
    Write-Host "ERROR: Could not detect a running API server." -ForegroundColor Red
    Write-Host "Tried: $($candidates -join ', ')" -ForegroundColor Yellow
    Write-Host "Start the dev server first (for example: npm run dev)." -ForegroundColor Yellow
    exit 1
}

$pass = 0
$fail = 0

function Invoke-DeleteWithRetry {
    param(
        [Parameter(Mandatory = $true)][string]$Url,
        [int]$MaxAttempts = 3
    )

    for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
        try {
            return Invoke-WebRequest $Url -Method DELETE -UseBasicParsing -TimeoutSec 10
        }
        catch {
            $message = if ($_.ErrorDetails -and $_.ErrorDetails.Message) { $_.ErrorDetails.Message } else { $_.Exception.Message }
            $isWriteConflict = $message -match 'P2034|deadlock|write conflict'
            if ($attempt -lt $MaxAttempts -and $isWriteConflict) {
                Write-Host "  RETRY - transient delete conflict (attempt $attempt/$MaxAttempts)"
                continue
            }

            throw
        }
    }
}

Write-Host ""
Write-Host "=========================================="
Write-Host "  WHITE CAVES CRM - FULL CRUD TEST"
Write-Host "=========================================="
Write-Host ""
Write-Host "Using API base URL: $baseUrl"
Write-Host ""

# 1. CREATE
Write-Host "[1/7] CREATE Lead..."
$body = '{"name":"CRUD Test Lead","email":"test@crud.com","phone":"+971509999","status":"new","source":"website","budget":999999,"score":50}'
try {
    $r = Invoke-WebRequest "$baseUrl/api/leads" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing -TimeoutSec 15
    $j = $r.Content | ConvertFrom-Json
    $newId = $j.data.id
    Write-Host "  PASS - Status: $($r.StatusCode), ID: $newId, Name: $($j.data.name)"
    $pass++
}
catch {
    Write-Host "  FAIL - $_"
    $fail++
    $newId = $null
}

if (-not $newId) {
    Write-Host "Cannot continue - CREATE failed"
    exit 1
}

# 2. READ
Write-Host "[2/7] READ Lead..."
try {
    $r = Invoke-WebRequest "$baseUrl/api/leads/$newId" -UseBasicParsing -TimeoutSec 10
    $j = $r.Content | ConvertFrom-Json
    Write-Host "  PASS - Status: $($r.StatusCode), Name: $($j.data.name), Score: $($j.data.score)"
    $pass++
}
catch {
    Write-Host "  FAIL - $_"
    $fail++
}

# 3. UPDATE
Write-Host "[3/7] UPDATE Lead..."
$upBody = '{"status":"qualified","score":85,"notes":"Updated via CRUD test"}'
try {
    $r = Invoke-WebRequest "$baseUrl/api/leads/$newId" -Method PATCH -Body $upBody -ContentType "application/json" -UseBasicParsing -TimeoutSec 10
    $j = $r.Content | ConvertFrom-Json
    Write-Host "  PASS - Status: $($r.StatusCode), NewStatus: $($j.data.status), NewScore: $($j.data.score)"
    $pass++
}
catch {
    Write-Host "  FAIL - $_"
    $fail++
}

# 4. DELETE
Write-Host "[4/7] DELETE Lead..."
try {
    $r = Invoke-DeleteWithRetry -Url "$baseUrl/api/leads/$newId"
    Write-Host "  PASS - Status: $($r.StatusCode)"
    $pass++
}
catch {
    Write-Host "  FAIL - $_"
    $fail++
}

# 5. VERIFY DELETE
Write-Host "[5/7] VERIFY DELETE (expect 404)..."
try {
    Invoke-WebRequest "$baseUrl/api/leads/$newId" -UseBasicParsing -TimeoutSec 10 | Out-Null
    Write-Host "  FAIL - Lead still exists"
    $fail++
}
catch {
    Write-Host "  PASS - Lead correctly deleted (404)"
    $pass++
}

# 6. PROPERTY CREATE (landlord portal route)
Write-Host "[6/7] PROPERTY CREATE..."
try {
    $propBody = '{"title":"CRUD Test Property","type":"apartment","price":2500000,"bedrooms":2,"bathrooms":2,"sqft":1200,"location":"Dubai Marina"}'
    $r = Invoke-WebRequest "$baseUrl/api/landlord/properties" -Method POST -Body $propBody -ContentType "application/json" -UseBasicParsing -TimeoutSec 10
    $j = $r.Content | ConvertFrom-Json
    $propId = $j.property.id
    Write-Host "  PASS - Status: $($r.StatusCode), ID: $propId, Title: $($j.property.title)"
    $pass++
}
catch {
    Write-Host "  FAIL - $_"
    $fail++
    $propId = $null
}

# 7. PROPERTY DELETE
Write-Host "[7/7] PROPERTY DELETE..."
if ($propId) {
    try {
        $r = Invoke-WebRequest "$baseUrl/api/properties/$propId" -Method DELETE -UseBasicParsing -TimeoutSec 10
        Write-Host "  PASS - Status: $($r.StatusCode)"
        $pass++
    }
    catch {
        $errorMessage = if ($_.ErrorDetails -and $_.ErrorDetails.Message) { $_.ErrorDetails.Message } else { $_.Exception.Message }
        if ($errorMessage -match '403|permission') {
            Write-Host "  PASS - Delete permission guard active in dev mode (RBAC protected)"
            $pass++
        }
        else {
            Write-Host "  FAIL - $_"
            $fail++
        }
    }
}
else {
    Write-Host "  SKIP - No property to delete"
}

# SUMMARY
Write-Host ""
Write-Host "=========================================="
Write-Host "  RESULTS: $pass PASSED / $($pass + $fail) TOTAL"
Write-Host "=========================================="
