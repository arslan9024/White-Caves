# White Caves Web App - User Training Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Property Management](#property-management)
4. [Smart Mary Import System](#smart-mary-import-system)
5. [Admin Features](#admin-features)
6. [Best Practices](#best-practices)
7. [FAQ](#faq)
8. [Support](#support)

---

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- JavaScript enabled
- Screen resolution: 1024x768 or higher

### First Login
1. Navigate to the application URL (provided by your administrator)
2. Enter your email and password
3. Click "Login"
4. Accept any required permissions

### Changing Password
1. Click on your profile icon (top-right corner)
2. Select "Settings"
3. Click "Change Password"
4. Enter current password and new password
5. Click "Update"

### User Roles & Permissions
- **Viewer**: Can view properties and reports (read-only)
- **Agent**: Can manage properties and create listings
- **Admin**: Full system access including user management and imports
- **Super Admin**: All permissions plus system configuration

---

## Dashboard Overview

### Main Dashboard Features

#### Key Metrics Cards
- **Total Properties**: Count of all properties in system
- **Available Properties**: Properties ready for sale/rent
- **Pending Listings**: Properties awaiting activation
- **Recent Imports**: Latest import summary

#### Property Map
- **Interactive Map**: Visual representation of property locations
- **Filter by Status**: Show/hide properties by status
- **Quick Info**: Hover to see basic property information

#### Recent Activity Feed
- **Import History**: Latest file uploads and processing status
- **Property Updates**: Recently added or modified properties
- **System Notifications**: Important announcements

### Dashboard Navigation
- **Left Sidebar**: Main menu with sections
- **Top Bar**: Search, notifications, profile
- **Breadcrumbs**: Current location in app
- **Footer**: Help, documentation links

---

## Property Management

### Adding a New Property (Manual Entry)

1. **Navigate to Properties**
   - Click "Properties" in main menu
   - Click "Add New Property" button

2. **Basic Information**
   - **Location**: Enter street address or building name
   - **Property Type**: Select (Apartment, Villa, Commercial, etc.)
   - **Status**: Choose status (Available, Rented, Sold, etc.)

3. **Details**
   - **Bedrooms**: Number of bedrooms
   - **Bathrooms**: Number of bathrooms
   - **Area**: Property size in sq.ft. or sq.m.
   - **Floor**: Building floor (if applicable)

4. **Financial Information**
   - **Price**: Sale/rental price
   - **Currency**: Select currency (AED, USD, etc.)
   - **Payment Terms**: Monthly, annual, one-time

5. **Owner Information**
   - **Select Owner**: Choose existing owner or create new
   - **Owner Name**: Full name
   - **Contact Number**: Phone number
   - **Email**: Contact email

6. **Description & Amenities**
   - **Description**: Detailed property description
   - **Amenities**: Check relevant amenities (Pool, Gym, etc.)

7. **Media Upload**
   - **Photos**: Click to upload property images
   - **Video Tour**: Add YouTube or custom video link
   - **Floor Plan**: Upload floor plan document

8. **Review & Save**
   - Review all information
   - Click "Save Property"
   - Confirmation message appears

### Editing an Existing Property

1. Open the property detail page
2. Click "Edit" button (top-right)
3. Make necessary changes
4. Click "Save Changes"
5. Changes are saved automatically

### Viewing Property Details

1. **Property Card Click**: Click any property card to open details
2. **Full View Includes**:
   - High-resolution images gallery
   - Complete property specifications
   - Owner contact information
   - Listing price and terms
   - Activity history
   - Interested buyers/renters list

### Filtering & Searching Properties

**Quick Search**
```
Search bar at top of Properties page
Enter property name, location, or owner name
Results appear as you type
```

**Advanced Filters**
1. Click "Filters" button
2. Filter by:
   - Location/City
   - Property Type
   - Price Range
   - Bedrooms/Bathrooms
   - Status
   - Date Added
3. Click "Apply" to see results

### Bulk Actions
1. Select multiple properties with checkboxes
2. Click "Bulk Actions" dropdown
3. Available actions:
   - Change Status
   - Delete Properties
   - Export Selected
   - Change Owner

---

## Smart Mary Import System

### What is Smart Mary?
Smart Mary is an intelligent system that automatically:
- Validates Excel/CSV data quality
- Separates properties and owners
- Detects and resolves duplicates
- Maps columns intelligently
- Handles data errors

### Importing Properties Step-by-Step

#### Step 1: Upload File
1. Click "Import" → "New Import"
2. Click "Upload File" or drag-and-drop
3. Select Excel (.xlsx) or CSV (.csv) file
4. File validation happens automatically
5. See validation results:
   - Total rows
   - Valid rows
   - Rows with issues
   - Common errors found

#### Step 2: Review & Map Columns
1. **Preview Data**: See first 5 rows of your file
2. **Auto-Mapping**: System suggests column mappings
3. **Manual Mapping** (if needed):
   - Click column header dropdown
   - Select correct field name
   - Common fields:
     - Location, Address
     - Property Type, Type
     - Bedrooms, Beds, BR
     - Price, Cost, Value
     - Owner Name, Owner
     - Contact, Phone, Number

4. **Identify Data Type**:
   - Text (Location, Owner names)
   - Number (Bedrooms, Price)
   - Currency (Price, Rent)
   - Date (Created, Updated)

#### Step 3: Duplicate Detection & Resolution
1. **Potential Duplicates** are identified
2. For each duplicate:
   - **Keep Original**: Keep existing data
   - **Use New**: Replace with imported data
   - **Merge**: Combine information from both
3. View side-by-side comparison
4. Make selection for each

#### Step 4: Status & Category Mapping
1. **Status Mapping**: Map your status values to system values
   - Your value → System status
   - Example: "Active" → "Available"
   - "Rented" → "Rented"

2. **Review Examples**: See 3-5 examples of how data will be mapped

#### Step 5: Owner Management
1. **Owner Handling**:
   - **Link to Existing**: Link imported data to existing owner
   - **Create New**: Create new owner record
   - **Auto-Link**: System suggests matches

2. **Owner Information Extracted**:
   - Name
   - Phone number
   - Email
   - Address (optional)

#### Step 6: Review & Confirm
1. **Import Summary**:
   - Total properties to import
   - New properties
   - Properties to update
   - Potential issues

2. **Action Review**:
   - Scroll through preview
   - Verify everything looks correct
   - Check for any warnings

3. **Final Confirmation**:
   - Click "Confirm Import"
   - Processing begins
   - Real-time progress shown

#### Step 7: Import Completion
1. **Success Message**: Shows:
   - Imported count
   - Updated count
   - Failed count (if any)

2. **View Results**:
   - Click "View Imported Properties"
   - Click "View Report" for detailed log

### File Format Requirements

#### Excel File Format
```
Row 1: Headers (Location, Type, Bedrooms, Price, Owner, etc.)
Row 2+: Data rows with property information
```

#### CSV File Format
```
location,propertyType,bedrooms,bathrooms,area,price,owner,phone
Dubai Marina,Apartment,2,2,1500,1500000,Ahmed Al Mansouri,0501234567
JBR,Apartment,3,3,2000,2000000,Fatima Al Zahra,0509876543
```

### Supported Column Names
- **Location**: Address, Location, Building, Street
- **Type**: Property Type, Type, Category, Unit Type
- **Bedrooms**: Bedrooms, Beds, BR, B/R, Bed
- **Bathrooms**: Bathrooms, Baths, WC, Bath
- **Area**: Area, Size, Sq Ft, Sq Meter, Area (sqft)
- **Price**: Price, Cost, Value, Rate, Amount
- **Status**: Status, State, Availability
- **Owner**: Owner, Owner Name, Agent, Seller
- **Phone**: Phone, Phone Number, Contact, Mobile

### Data Quality Standards

**Required Fields**:
- Location
- Property Type
- Bedrooms
- Bathrooms
- Price
- Owner Name
- Owner Contact

**Recommended Fields**:
- Area
- Currency
- Status
- Owner Email
- Description

### Tips for Successful Imports

1. **Consistent Formatting**
   - Use same status values throughout
   - Consistent number format (1500000 not 15,00,000)
   - Proper phone number format with country codes

2. **Clean Data**
   - Remove duplicate rows before importing
   - Fix obvious spelling errors
   - Remove empty rows

3. **Complete Information**
   - Fill required fields before exporting from source
   - Include owner contact information
   - Specify property status

4. **Test First**
   - Import small subset first
   - Verify results
   - Then import full dataset

5. **Keep Backup**
   - Keep original Excel file
   - Export data regularly
   - Maintain import history

---

## Admin Features

### User Management

#### Add New User
1. Go to Admin → Users
2. Click "Add New User"
3. Enter email address
4. Select role (Viewer, Agent, Admin)
5. Click "Create User"
6. User receives invitation email with login instructions

#### Edit User Permissions
1. Find user in list
2. Click "Edit" button
3. Change role or permissions
4. Click "Save"
5. Changes take effect immediately

#### Deactivate User
1. Find user in list
2. Click "Deactivate"
3. Confirm action
4. User cannot login anymore

### System Settings

#### General Settings
- Application name
- Logo and branding
- Default currency
- Timezone
- Language (English, Arabic)

#### Property Type Configuration
1. Go to Admin → Settings → Property Types
2. Add custom types:
   - Click "Add Type"
   - Enter type name
   - Click "Save"

#### Status Configuration
1. Go to Admin → Settings → Statuses
2. Customize status values:
   - Add, edit, or remove statuses
   - Assign colors for visual identification
   - Mark as active/inactive

### Import History & Analytics

#### View All Imports
1. Click Admin → Import History
2. See all import sessions with:
   - File name
   - Date imported
   - Status (Success, Partial, Failed)
   - Import count
   - User who performed import

#### Filter Imports
- By date range
- By status
- By user
- By result count

#### Export Import Report
1. Click import session
2. Click "Download Report"
3. CSV/Excel file with:
   - Each property imported
   - Success/failure status
   - Any errors encountered
   - Owner information

### Monitoring & Alerts

#### System Health
- Monitor active users
- Track storage usage
- View recent errors
- API status

#### Performance Metrics
- Average response time
- Successful imports (%)
- Error rate
- Database size

---

## Best Practices

### Property Management
1. **Consistent Naming**: Use consistent naming for locations
2. **Complete Information**: Always fill required fields
3. **Regular Updates**: Keep prices and status current
4. **Photo Guidelines**: Use high-quality, well-lit photos
5. **Description Quality**: Write clear, accurate descriptions

### Importing Data
1. **Test Imports**: Always test with small dataset first
2. **Verify Mapping**: Confirm column mappings are correct
3. **Resolve Duplicates**: Check duplicate detection carefully
4. **Keep History**: Maintain records of all imports
5. **Schedule Imports**: Import during off-peak hours for performance

### User Management
1. **Principle of Least Privilege**: Give minimum necessary permissions
2. **Regular Audits**: Review user access quarterly
3. **Deactivate Unused**: Remove access for inactive users
4. **Strong Passwords**: Encourage complex passwords
5. **Backup Users**: Designate backup administrators

### Data Security
1. **Regular Backups**: System automatically backs up daily
2. **Sensitive Data**: Don't include private information
3. **HTTPS Only**: Always use encrypted connections
4. **Logout Reminder**: Logout when leaving computer
5. **Report Issues**: Report suspicious activity immediately

---

## FAQ

### General Questions

**Q: How do I reset my password?**
A: Click "Forgot Password" on login screen, enter email, follow reset link.

**Q: Can I change my email address?**
A: Go to Settings → Account, click "Change Email", verify new address.

**Q: How many properties can I import at once?**
A: No limit, but recommended max 10,000 rows per file for optimal performance.

**Q: Who can see my property listings?**
A: Depends on visibility setting - Private (you only), Private Link (with link), or Public.

### Import Questions

**Q: What file formats are supported?**
A: Excel (.xlsx) and CSV (.csv) files. Maximum file size 50MB.

**Q: How long does import take?**
A: Typically 1-5 minutes depending on file size and system load.

**Q: What if import fails?**
A: Check error report for specific issues. Fix data and retry, or contact support.

**Q: Can I cancel an import in progress?**
A: No, but can undo imported properties from import history if needed.

**Q: How are duplicates determined?**
A: By matching location, property type, bedrooms, bathrooms, and owner name.

### Admin Questions

**Q: How many users can I add?**
A: Unlimited users on Professional and Enterprise plans.

**Q: Can users have multiple roles?**
A: No, each user has single primary role. Contact support for custom permissions.

**Q: How long is import history kept?**
A: All imports kept indefinitely. Can be searched and filtered.

**Q: Can I bulk delete properties?**
A: Yes, select properties, click "Delete" - 30-day trash retention.

### Technical Questions

**Q: Is my data secure?**
A: Yes, encrypted in transit (HTTPS) and at rest. Regular security audits performed.

**Q: What's the system uptime?**
A: 99.9% guaranteed uptime with redundant servers.

**Q: Can I export all my data?**
A: Yes, Admin → Export Data. Exports all properties and owners in CSV/Excel.

**Q: Are there API options?**
A: Yes, contact us for API access documentation and rate limits.

---

## Support

### Getting Help

**In-App Help**
- Click ? icon in top-right corner
- Browse contextual help articles
- Search knowledge base

**Email Support**
- support@whitecaves.com
- Response time: 2-4 hours (business days)

**Phone Support**
- +971 4 XXX XXXX
- Hours: Saturday-Thursday, 9 AM - 6 PM UAE time

**Live Chat**
- Available on website during business hours
- Instant help for urgent issues

### Reporting Issues

1. Click "Report Issue" in help menu
2. Describe the problem in detail
3. Include:
   - What you were trying to do
   - What happened instead
   - Error message (if any)
   - Screenshots helpful
4. Submit and track via ticket number

### Feature Requests

1. Click "Feature Requests" in help menu
2. Describe desired feature
3. Explain how it would help
4. Vote on existing requests
5. Most voted features prioritized

### Training Resources

- **Video Tutorials**: Learn.whitecaves.com
- **Knowledge Base**: Help.whitecaves.com  
- **Webinars**: Monthly training sessions (registration required)
- **PDF Guides**: Downloadable quick-start guides

### Contact Information

**Main Office**
White Caves Real Estate
Dubai, UAE
Phone: +971 4 XXX XXXX
Email: info@whitecaves.com

**Support Team**
Email: support@whitecaves.com
Portal: support.whitecaves.com

---

**Last Updated**: January 2024
**Version**: 1.0
**Questions?** Contact support@whitecaves.com
