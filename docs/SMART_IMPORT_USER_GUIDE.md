# Smart Mary Data Import System - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Step-by-Step Walkthrough](#step-by-step-walkthrough)
3. [Column Mapping](#column-mapping)
4. [Data Validation](#data-validation)
5. [Duplicate Resolution](#duplicate-resolution)
6. [Status Mapping](#status-mapping)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## Getting Started

### Accessing the Import Wizard

1. Navigate to the Mary Dashboard
2. Click on **📤 Data Import** in the main menu
3. You'll see the Smart Mary Data Import wizard

### Supported File Formats

✅ **Supported:**
- Microsoft Excel 2007+ (.xlsx)
- Microsoft Excel 97-2003 (.xls)
- Comma-Separated Values (.csv)

❌ **Not Supported:**
- Google Sheets (download as Excel/CSV first)
- PDF
- JSON/XML
- Proprietary formats

### File Requirements

- **Maximum size:** 500 MB
- **Maximum rows:** 1,000,000
- **Character encoding:** UTF-8, UTF-16, or Latin-1
- **Column headers:** Required in first row
- **Sheet name:** Maximum 31 characters

---

## Step-by-Step Walkthrough

### Step 1: 📤 Upload Your File

#### Method 1: Drag & Drop
1. Click the upload area
2. Drag your Excel/CSV file into the highlighted zone
3. Release to upload

#### Method 2: Browse
1. Click the upload area
2. Select your file from your computer
3. Click "Open"

#### What Happens During Upload
- File is validated for format and size
- First 10 rows are extracted for preview
- All sheet names are detected
- Column headers are analyzed
- Initial column mapping is attempted

**Expected Upload Time:**
- < 100 KB: < 1 second
- 1-10 MB: 2-5 seconds
- 10-100 MB: 10-30 seconds

#### Example Upload Success
```
✅ File uploaded successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
File Name: properties_2025.xlsx
File Size: 2.5 MB
Total Rows: 1,250
Columns Found: 15
Upload Time: 3.2 seconds
```

---

### Step 2: 👀 Preview Your Data

This step shows you exactly what will be imported.

#### Preview Table
- Shows first 10 rows
- Displays all columns from your file
- Helps verify file was uploaded correctly

#### For Multi-Sheet Files
If your Excel has multiple sheets:
1. Click the **Sheet Selection** dropdown
2. Choose which sheet to import
3. Preview updates to show selected sheet data

#### What to Check
- ✅ Data looks correct
- ✅ All necessary columns present
- ✅ No corrupted or unreadable content
- ✅ Row count matches expectations

**Example:**
```
Sheet1: Properties
┌─────┬──────────────┬────────────┬─────────┐
│ #   │ Ref Number   │ Area       │ Bedrooms│
├─────┼──────────────┼────────────┼─────────┤
│ 1   │ P-001        │ Downtown   │ 3       │
│ 2   │ P-002        │ Marina     │ 2       │
│ 3   │ P-003        │ JBR        │ 1       │
└─────┴──────────────┴────────────┴─────────┘

✅ Preview looks good - 1,250 rows total
```

---

### Step 3: 🔗 Configure Column Mapping

This is where you tell the system which Excel columns map to database fields.

#### Understanding Column Mapping

**What it does:**
- Maps Excel columns to property/owner database fields
- Separates property data from owner information
- Ensures correct data placement in database

**Key Concepts:**
```
Excel Column          →    Database Field
─────────────────────────────────────────────
Property Number      →    referenceNo (Property)
Area Name           →    area (Property)
Owner Name          →    ownerName (Owner)
Phone Number        →    phone (Owner)
```

#### Auto-Detection

The system automatically suggests mappings. To use them:

1. Click **🔍 Auto-Detect Mapping** button
2. System analyzes columns and suggests mappings
3. Review suggestions (confidence scores shown)
4. Accept or manually adjust

**Auto-Detection Success Rate:** 85-95% for standard columns

#### Manual Mapping

To manually map a column:

1. Find the column in the table
2. Click the dropdown under "Map To Field"
3. Select the appropriate database field
4. Field category (Property/Owner) updates automatically

**Available Property Fields:**
- referenceNo - Unique property identifier
- projectName - Project or development name
- area - Geographic area/location
- plotNo - Plot number
- building - Building name/number
- unit - Unit/apartment number
- bedrooms - Number of bedrooms
- bathrooms - Number of bathrooms
- type - Property type (villa, apartment, etc.)
- status - Current status
- price - Sale price
- rentPriceAnnual - Annual rental price
- furnishing - Furnishing level
- amenities - Available amenities
- description - Property description
- legalStatus - Legal/registration status

**Available Owner Fields:**
- name - Owner's full name
- email - Email address
- phone - Phone number
- nationality - Nationality
- emiratesID - UAE ID number
- passportNo - Passport number
- address - Physical address
- city - City
- country - Country
- companyName - Company name (if business)
- companyRegistration - Company registration number
- companyTRN - Tax registration number
- contactPerson - Primary contact person

#### Mapping Progress

Watch the progress bar fill as you map columns:
```
✓ Mapped Columns: 8 of 15
████████░░ 53%

Property Fields: 5 mapped
Owner Fields: 3 mapped
Unmapped: 7 columns
```

#### Mapping Tips

**Do's:**
- ✅ Map all essential fields (referenceNo, name)
- ✅ Be specific with field selection
- ✅ Use exact column names
- ✅ Verify mappings before proceeding

**Don'ts:**
- ❌ Skip required fields
- ❌ Map unrelated columns
- ❌ Use "unmapped" for important data
- ❌ Guess field meanings

**Example Correct Mapping:**
```
Excel Header          →    Database Field       Category
─────────────────────────────────────────────────────────
Ref No               →    referenceNo           Property
Property Area        →    area                  Property
Beds                 →    bedrooms              Property
Owner Full Name      →    name                  Owner
Owner Mobile         →    phone                 Owner
Owner Email          →    email                 Owner
```

---

### Step 4: ✅ Validate Data Quality

The system checks your data for errors and issues before import.

#### Import Strategies

Choose how strictly to validate data:

**🔒 Strict Mode**
- Rejects entire import if any errors found
- Requires all mapped fields present
- Best for: Critical, clean data
- Success Rate: Highest standards
- Risk: May reject if minor issues exist

**⚖️ Balanced Mode (Recommended)**
- Uses intelligent judgment
- Flags warnings but allows import
- Best for: Most real-world scenarios
- Success Rate: 98-99% of data imported
- Risk: Low - minimal data loss

**🔓 Lenient Mode**
- Imports all valid data
- Flags warnings for review
- Best for: Messy, legacy data
- Success Rate: Highest import volume
- Risk: May import incomplete records

#### Running Validation

1. Select your import strategy
2. Click **Run Validation**
3. System analyzes all rows against rules
4. Results display with statistics

#### Understanding Results

**✅ Validation Passed**
```
Status: PASSED
Valid Rows: 1,240 / 1,250 (99.2%)
Errors: 8
Warnings: 12
Action: Proceed to next step
```

**⚠️ Validation Issues**
```
Status: WARNINGS
Valid Rows: 1,180 / 1,250 (94.4%)
Errors: 8
Warnings: 62
Action: Review errors, adjust data if needed
```

**❌ Validation Failed**
```
Status: FAILED
Valid Rows: 1,100 / 1,250 (88%)
Errors: 150
Warnings: 0
Action: Fix errors in source file and re-upload
```

#### Common Validation Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid email format | Email doesn't match standard format | Correct email address in source |
| Missing required field | Mapped field is empty | Map to different column or fill values |
| Invalid phone format | Phone doesn't match validation rules | Use proper phone format: +971XXXXXXXXX |
| Duplicate reference | Same reference appears multiple times | Check for actual duplicates or use different field |
| Invalid date format | Date in wrong format | Use ISO format: YYYY-MM-DD |

#### Data Quality Tips

Before importing, ensure:
- ✅ Email addresses are valid
- ✅ Phone numbers have country codes
- ✅ Required fields are not empty
- ✅ No leading/trailing spaces
- ✅ Consistent formatting
- ✅ No special characters in key fields

---

### Step 5: ⚠️ Review & Resolve Duplicates

The system checks for potential duplicate records.

#### Understanding Duplicates

**What is a duplicate?**
- Same property listed multiple times
- Same owner listed multiple times
- Identical or very similar records

**Why it matters:**
- Prevents duplicate database entries
- Maintains data integrity
- Improves reporting accuracy

#### Duplicate Detection

The system analyzes all rows and shows:

```
Duplicates Found: 24
━━━━━━━━━━━━━━━━━━━━━━━━
Exact Matches: 18
Fuzzy Matches: 6
Requires Review: 2

Progress: 0 of 24 resolved
```

#### Resolution Strategies

For each duplicate, choose one action:

**✓ Keep Existing (Recommended for clean imports)**
- Keep current database record
- Skip the duplicate from import
- Best for: Updating only new records
- Loss: None

**↻ Overwrite Existing**
- Replace current record with new data
- Recommended only for major updates
- Best for: Complete data refresh
- Loss: Old data is replaced

**⑂ Keep Both Versions**
- Create version history
- Keep old as archived version
- Keep new as current version
- Best for: Historical tracking
- Loss: None (all data preserved)

**✋ Manual Review**
- Flag for administrator approval
- Import is paused until resolved
- Best for: Critical duplicates
- Loss: None until reviewed

#### Reviewing a Duplicate

**Duplicate Details:**
```
Row 45 - Potential Duplicate
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Confidence: 98% match

Field              Existing Value    New Value
──────────────────────────────────────────────
Property Number    ✓ P-001          P-001
Area               ✓ Downtown       Downtown
Owner Name         Ahmed Al M.      Ahmed Al Mansouri
Phone              ✓ +971501...     +971501234567
Status             ✓ Vacant         Vacant
```

**Decision Options:**
1. ✓ **Keep Existing** - Skip this new record
2. ↻ **Overwrite** - Use new record instead
3. ⑂ **Keep Both** - Create version
4. ✋ **Manual Review** - Flag for approval

#### Bulk Resolution

For duplicates with same characteristics:

1. Click **Apply "Keep" to All** (or other strategy)
2. Applies selected strategy to all pending duplicates
3. Speeds up process for large imports

#### Tips for Handling Duplicates

- 📋 Review matched fields - they're likely correct
- 🔍 Check confidence score - higher = more likely duplicate
- ⏱️ "Keep Existing" is safest for first imports
- 👤 Manual Review for important property owners
- 📊 Use bulk actions when all duplicates are same type

---

### Step 6: 📊 Map Status Values

Configure how legacy status values map to the new system.

#### Understanding Status Mapping

The new system uses **5 dimensions** for status instead of single value:

```
Legacy Status        New Multi-Dimensional System
─────────────────────────────────────────────────────
"Vacant"    →    Occupancy: empty
                 Market: ready
                 Construction: ready
                 Furnishing: unknown
                 Legal: registered
```

#### The 5 Status Dimensions

**1️⃣ Occupancy** - Is the property occupied?
- **empty** - No one lives/works there
- **occupied** - Owner/occupant lives there
- **tenanted** - Rented to tenant

**2️⃣ Market** - Market availability status
- **ready** - Available for sale/lease
- **pipeline** - Will be available soon
- **unavailable** - Not for sale/lease now
- **under-negotiation** - Active deal ongoing

**3️⃣ Construction** - Construction status
- **ready** - Completed and ready
- **under-construction** - Still being built
- **planning** - In planning phase

**4️⃣ Furnishing** - How is it furnished?
- **furnished** - All furniture included
- **semi-furnished** - Partial furniture
- **unfurnished** - No furniture

**5️⃣ Legal** - Legal/registration status
- **registered** - Officially registered
- **processing** - Registration in progress
- **pending** - Waiting for registration
- **unregistered** - Not yet registered

#### Reviewing Auto-Detected Mappings

System automatically suggests mappings:

```
Status Value: "Vacant" (Found in 245 rows)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dimension              Suggested Value
─────────────────────────────────────────
Occupancy              empty ✓
Market                 ready ✓
Construction           ready ✓
Furnishing             unknown
Legal                  registered ✓

✅ Auto-mapped confidence: 92%
```

#### Adjusting Mappings

If auto-detection isn't perfect:

1. Click on the status value (e.g., "Vacant")
2. Review suggested mappings
3. Click dropdown to change any dimension
4. Corrections apply to all rows with that status

**Example Adjustment:**
```
Status: "Vacant"
Dimension    Current         New Selection
─────────────────────────────────────────
Furnishing   unknown    →    semi-furnished
             (for partially furnished vacant units)
```

#### Common Status Examples

**Scenario: "For Rent - Occupied"**
```
Occupancy: occupied
Market: ready
Construction: ready
Furnishing: furnished
Legal: registered
```

**Scenario: "Under Maintenance"**
```
Occupancy: empty
Market: unavailable
Construction: under-construction
Furnishing: unknown
Legal: registered
```

**Scenario: "Pending Legal Registration"**
```
Occupancy: empty
Market: pipeline
Construction: ready
Furnishing: furnished
Legal: processing
```

#### Status Mapping Tips

- 🔍 Review sample data preview before confirming
- 📋 Check each dimension makes sense
- 🤔 When unsure, use "unknown"
- ✏️ Can be adjusted in system later
- 📊 These fields enable better reporting

---

### Step 7: 📋 Review Import Settings

Final check before executing import.

#### Review Checklist

Before clicking "Start Import", verify:

**File Information**
- ✅ Correct file selected
- ✅ Expected number of rows
- ✅ All necessary columns present

**Import Settings**
- ✅ Correct import strategy chosen
- ✅ Deduplication strategy appropriate
- ✅ Validation passed or acceptable warnings

**Data Mapping**
- ✅ All essential fields mapped
- ✅ Property fields configured
- ✅ Owner fields configured
- ✅ Status mappings reviewed

#### Import Summary

Review displays:
```
📊 IMPORT SUMMARY
═══════════════════════════════════════════

File: properties_2025.xlsx (2.5 MB, 1,250 rows)
Columns: 15 identified, 14 mapped

Strategy: Balanced (Smart judgment)
Deduplication: Keep existing records
Status Mapping: 5 dimensions configured

Validation: ✅ Passed (99.2% valid rows)
Duplicates: 24 found (auto-resolved)

Estimated Results:
  • Properties created: ~850
  • Properties updated: ~380
  • Owners created: ~620
  • Relationships: ~1,200
  • Processing time: ~5 minutes
```

#### Ready to Import?

If everything looks correct:
✅ Proceed to Step 8: Execute Import

If you need changes:
← Click "Back" to adjust settings

---

### Step 8: ▶️ Execute Import

Final step - import your data into the system.

#### Starting Import

1. Click **Start Import** button
2. Progress bar shows completion
3. Real-time statistics display

#### Progress Display

```
▶️ IMPORT IN PROGRESS
═════════════════════════════════════════

████████░░ 42% Complete

Elapsed: 2m 30s
Remaining: ~3m
Processing: ~7 rows/second

Progress:
  ✓ Properties created: 356
  ✓ Owners created: 289
  ✓ Relationships: 525
  ⏳ Current row: 512 of 1,250
```

#### What Happens During Import

1. **Validation** - Final data check
2. **Deduplication** - Apply duplicate strategy
3. **Mapping** - Separate property/owner data
4. **Status Mapping** - Apply multi-dimensional status
5. **Database Insert** - Create records
6. **Relationship Links** - Connect properties to owners
7. **Indexing** - Update search indexes

**Estimated Time:**
- 1,000 rows: 2-3 minutes
- 10,000 rows: 10-15 minutes
- 100,000 rows: 1-2 hours

#### Import Completion

**Success Screen:**
```
✅ IMPORT SUCCESSFUL!
═════════════════════════════════════════

Duration: 5m 45s
Status: Completed (100%)

Results:
  ✓ Properties Created: 850
  ✓ Properties Updated: 380
  ✓ Owners Created: 620
  ✓ Owners Updated: 65
  ✓ Relationships Created: 1,200

Success Rate: 98.4%
Failed Records: 20 (review available)
Warnings: 12 (non-critical)

Next Steps:
  → View detailed report
  → Verify imported data
  → Import another file
  → Return to dashboard
```

#### If Import Fails

**Partial Failure (most data imported):**
```
⚠️ IMPORT COMPLETED WITH ISSUES
═════════════════════════════════════════

Status: Partial Success (94%)
Properties Created: 820
Failed Records: 20

Issues:
  1. Row 45: Invalid phone format
  2. Row 128: Missing required field
  3. Row 234: Database constraint error

Action:
  → Fix failed records in source file
  → Re-upload and import fixed rows
  → Or manually create missing records
```

**Complete Failure:**
```
❌ IMPORT FAILED
═════════════════════════════════════════

Error: Validation errors detected
No data was imported (database rollback)

Issues Found:
  • 150 rows with invalid data
  • 23 missing required fields
  • 8 duplicate reference errors

Action:
  → Review error details
  → Correct issues in source file
  → Re-upload and try again
```

---

## Column Mapping

### Mapping Best Practices

#### Property vs Owner Separation

The system automatically separates data:

**Property Fields** (about the building/unit):
- Reference number
- Location/area
- Project name
- Unit number
- Bedroom/bathroom count
- Property type
- Construction status

**Owner Fields** (about the person/company):
- Name
- Contact information
- ID documents
- Company details
- Registration numbers

**Result in Database:**
```
Property Record (P-001)
├─ Area: Downtown
├─ Bedrooms: 3
├─ Status: Vacant
└─ Owner Link: Owner-123

Owner Record (Owner-123)
├─ Name: Ahmed Al Mansouri
├─ Phone: +971501234567
└─ Email: ahmed@example.com
```

#### Common Mapping Scenarios

**Scenario 1: Standard Real Estate Spreadsheet**
```
Your Columns                →    Mapped To
─────────────────────────────────────────
Unit ID                    →    referenceNo (Property)
Building Name              →    building (Property)
Area Name                  →    area (Property)
Bedrooms                   →    bedrooms (Property)
Owner Full Name            →    name (Owner)
Owner Phone                →    phone (Owner)
Owner Email                →    email (Owner)
```

**Scenario 2: Legacy System Export**
```
Your Columns                →    Mapped To
─────────────────────────────────────────
PROP_ID                    →    referenceNo
PROP_TYPE                  →    type
LOC                        →    area
BED_COUNT                  →    bedrooms
OWNER_DETAILS_NAME         →    name
OWNER_DETAILS_MOBILE       →    phone
OWNER_COMPANY_NAME         →    companyName
```

**Scenario 3: Minimal Data**
```
Your Columns                →    Mapped To
─────────────────────────────────────────
PropertyNum                →    referenceNo (required)
Location                   →    area
OwnerName                  →    name (required)
Phone                      →    phone
(Leave unmapped: optional fields)
```

### Handling Unmapped Columns

**What happens to unmapped columns?**
- They are ignored during import
- Not saved to database
- No error or warning
- Data is lost

**Should I map everything?**
- Only map columns you need
- Mapping to wrong field causes issues
- Better to skip unneeded data
- Quality over quantity

**Required Mappings (Minimum):**
- At least one property identifier (referenceNo or projectName + area)
- At least owner name OR company name

---

## Data Validation

### Validation Rules by Field

**Property Fields:**
- **referenceNo**: Must be unique, alphanumeric
- **area**: Must match known Dubai areas (checked against list)
- **bedrooms**: Must be numeric 0-10+
- **bathrooms**: Must be numeric 0-10+
- **price**: Must be numeric, non-negative
- **phone**: Must start with +971, 7-15 digits total

**Owner Fields:**
- **name**: Must not be empty, 2-100 characters
- **email**: Must be valid email format
- **phone**: Must be valid phone format
- **emiratesID**: Must be 15 digits if provided
- **passportNo**: Must be 6-9 alphanumeric characters

### Data Quality Issues

**Critical (Blocks Import):**
- Empty required fields
- Invalid data format
- Duplicate references in strict mode

**Major (Warning):**
- Invalid email format
- Phone number without country code
- Unknown area name
- Future dates

**Minor (Info only):**
- Extra spaces
- Inconsistent formatting
- Partial phone number
- Missing optional field

---

## Duplicate Resolution

### Duplicate Detection Strategy

**Exact Matching:**
- All specified fields must match exactly
- No typo tolerance
- Fast, conservative

**Fuzzy Matching:**
- Allows minor typos and variations
- Handles name variations
- Slower but more comprehensive

**Smart Matching (Default):**
- Combines exact and fuzzy
- Confidence scores calculated
- Balances accuracy and catch rate

### When to Use Each Strategy

| Strategy | Use When | Result |
|----------|----------|--------|
| Keep Existing | First-time import | No overwrites, adds new only |
| Overwrite | Data refresh needed | All data replaced |
| Version | Historical tracking | Both versions preserved |
| Manual | High-value properties | Admin reviews each duplicate |

---

## Status Mapping

### Multi-Dimensional Status Benefits

**Old system (Single status):**
```
Status: "Vacant"
❌ What does it mean exactly?
❌ No rental status info
❌ No construction status
❌ Poor reporting capability
```

**New system (5 dimensions):**
```
Occupancy: empty (nobody living there)
Market: ready (available for rent)
Construction: ready (completed)
Furnishing: unknown (not specified)
Legal: registered (officially registered)

✅ Clear, unambiguous status
✅ Enables detailed reporting
✅ Better decision-making
```

### Reporting Benefits

With multi-dimensional status, you can now:

```
Reports Examples:
─────────────────────────────────────────
"Show all empty, ready-for-rental properties"
"List under-construction projects"
"Find registered but tenanted units"
"Identify furnishing status of available properties"
"Properties needing legal registration"
```

---

## Best Practices

### Before You Import

1. **Clean your data:**
   - Remove duplicates manually
   - Fix formatting inconsistencies
   - Remove test/dummy records
   - Verify email addresses

2. **Organize your file:**
   - Place headers in row 1
   - Use consistent naming
   - One data type per column
   - Remove empty rows/columns

3. **Validate source:**
   - Spot-check 10 random rows
   - Verify critical fields complete
   - Check phone numbers valid
   - Confirm email addresses correct

### During Import

1. **Don't close browser** - Will interrupt import
2. **Don't navigate away** - May lose progress
3. **Check progress bar** - Should steadily advance
4. **Note any warnings** - May need review

### After Import

1. **Review import summary** - Check statistics
2. **View failed records** - Fix and re-import if needed
3. **Spot-check results** - Verify data looks correct
4. **Check relationships** - Ensure owners linked properly
5. **Update status** - Manually adjust if needed

### Data Quality Checklist

```
Before Import:
□ All phone numbers have +971 country code
□ Email addresses are valid and complete
□ No leading/trailing spaces in names
□ Property reference numbers are unique
□ Area names match system options
□ No duplicate rows

After Import:
□ Property count matches expected
□ Owner count is reasonable
□ No obvious data corruption
□ Relationships are correct
□ Status values are reasonable
```

---

## Troubleshooting

### Common Issues & Solutions

**Issue: "Invalid file format" error**
```
❌ Error: Invalid file format. Supported: .xlsx, .xls, .csv

Solutions:
1. Check file extension (.xlsx, .xls, or .csv)
2. Try saving as .xlsx from Excel
3. Convert Google Sheets to Excel first
4. Repair Excel file if corrupted
5. Try with smaller sample first
```

**Issue: "File is too large"**
```
❌ Error: File exceeds maximum size (500 MB)

Solutions:
1. Split file into multiple smaller files
2. Remove unnecessary columns
3. Delete test/blank rows
4. Archive old data to separate file
5. Compress file if possible
```

**Issue: "Column mapping incomplete"**
```
❌ Error: Required fields not mapped

Solutions:
1. Map at least referenceNo or projectName + area
2. Map at least one owner name field
3. Check spelling of field names
4. Review "Available Fields" list
5. Skip unmapped optional columns
```

**Issue: "Validation failed - too many errors"**
```
❌ Error: 150 rows have validation errors

Solutions:
1. Review error details (which rows, which fields)
2. Fix issues in source file
3. Try lenient validation strategy
4. Check phone number format (+971...)
5. Verify email address format
6. Ensure no duplicate references
```

**Issue: "Duplicates found - import paused"**
```
⚠️ 24 duplicate records detected

Solutions:
1. Review duplicate details
2. Choose resolution strategy (keep, overwrite, etc.)
3. Use bulk resolution for similar cases
4. Manual review for critical records
5. Proceed with chosen strategy
```

**Issue: "Import taking too long"**
```
⏳ Import running longer than expected

Solutions:
1. Wait - large imports take time (normal)
2. Don't close browser/navigate away
3. Check internet connection is stable
4. If > 1 hour, contact support
5. Can resume from same session if interrupted
```

**Issue: "Import failed - database error"**
```
❌ Error: Database operation failed

Solutions:
1. Check database connection
2. Try importing again (may be temporary)
3. Contact system administrator
4. Report error with session ID: sess_xxx
5. Check server status page
```

### Error Code Reference

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad request | Check request format and parameters |
| 401 | Not authorized | Login required or token expired |
| 403 | Forbidden | Don't have permission for this action |
| 404 | Not found | Session ID invalid or expired |
| 413 | File too large | File exceeds size limit (500 MB) |
| 415 | Invalid format | File format not supported |
| 429 | Rate limited | Too many requests - wait a moment |
| 500 | Server error | Contact administrator |

---

## FAQ

### General Questions

**Q: How long does an import take?**
A: Typical time is 0.3-1 second per 100 rows. A 1,000-row file usually takes 3-5 minutes.

**Q: Can I import multiple files at once?**
A: No, imports are sequential. Wait for one to complete before starting another.

**Q: What happens if import fails halfway?**
A: The system rolls back all changes. No data is partially imported.

**Q: Can I undo an import?**
A: Not automatically. Contact your administrator if a rollback is needed.

**Q: How are property-owner relationships created?**
A: System matches based on mapping. Each property linked to mapped owner.

### Data Questions

**Q: What if I have multiple owners for one property?**
A: Create separate rows for each owner, reference same property number.

**Q: Can I update existing properties?**
A: Yes - use "overwrite" or "version" deduplication strategy.

**Q: How are duplicate owners handled?**
A: Same as properties - apply chosen deduplication strategy.

**Q: Can I import to multiple projects?**
A: Yes - include project field in mapping.

**Q: What about sensitive data (IDs, emails)?**
A: Encrypted at rest, access-controlled, audit logged.

### Technical Questions

**Q: What's the API endpoint for imports?**
A: POST `/api/inventory/import/upload` - see API documentation.

**Q: Can I schedule automatic imports?**
A: Not yet - contact your administrator for enterprise solution.

**Q: Is there an import limit?**
A: No hard limit, but very large imports (>1M rows) may require splitting.

**Q: Can I customize validation rules?**
A: Contact administrator to adjust validation strictness.

**Q: How do I export import history?**
A: Download from import tracking page (coming soon).

### Support Questions

**Q: Where can I get help?**
A: See troubleshooting section or contact your administrator.

**Q: How do I report a bug?**
A: Note session ID and error message, contact support.

**Q: Can I get a sample import file?**
A: Download template from import page (coming soon).

**Q: Is there training available?**
A: Yes - admin dashboard has video tutorials and guides.

---

## Next Steps

### After Successful Import

1. ✅ **Verify Data** - Check imported properties and owners
2. 🔍 **Review Status** - Verify status mappings applied correctly
3. 📊 **Check Relationships** - Ensure owners linked to properties
4. 🏷️ **Adjust Status** - Manually fix if needed using system
5. 📋 **Create Report** - Generate import summary report
6. 📧 **Notify Team** - Share updated property count with team

### Ongoing Maintenance

- 📅 Schedule regular imports
- 🔄 Keep data synchronized
- ✅ Monitor data quality
- 📊 Review reports regularly
- 🔐 Backup important data

### Related Features

- 📈 Analytics & Reporting
- 🔗 Bulk Operations
- 🔄 Data Synchronization
- 📧 Automated Notifications
- 🗂️ Property Management

---

**Questions? Need help?** Contact your system administrator or visit the help center.

**Last Updated:** January 18, 2025
**Version:** 1.0
