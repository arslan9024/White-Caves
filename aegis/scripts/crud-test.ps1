$baseUrl = "http://localhost:3000"
$pass = 0
$fail = 0

Write-Host ""
Write-Host "=========================================="
Write-Host "  WHITE CAVES CRM - FULL CRUD TEST"
Write-Host "=========================================="
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
$upBody = '{"status":"hot","score":85,"notes":"Updated via CRUD test"}'
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
    $r = Invoke-WebRequest "$baseUrl/api/leads/$newId" -Method DELETE -UseBasicParsing -TimeoutSec 10
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

# 6. PROPERTY CREATE
Write-Host "[6/7] PROPERTY CREATE..."
try {
    $agR = Invoke-WebRequest "$baseUrl/api/users?role=agent" -UseBasicParsing -TimeoutSec 10
    $agJ = $agR.Content | ConvertFrom-Json
    $agentId = $agJ.data[1].id
    $propBody = '{"title":"CRUD Test Property","type":"apartment","status":"available","price":2500000,"bedrooms":2,"bathrooms":2,"sqft":1200,"location":"Dubai Marina","userId":"' + $agentId + '"}'
    $r = Invoke-WebRequest "$baseUrl/api/properties" -Method POST -Body $propBody -ContentType "application/json" -UseBasicParsing -TimeoutSec 10
    $j = $r.Content | ConvertFrom-Json
    $propId = $j.data.id
    Write-Host "  PASS - Status: $($r.StatusCode), ID: $propId, Title: $($j.data.title)"
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
        Write-Host "  FAIL - $_"
        $fail++
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
