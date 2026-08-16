# Universal White Caves Single-CSV System Specification

> **Document Version:** 2.0.26  
> **System Architecture:** RUP Master Model  
> **Brand Palette:** Red (`#EF4444`) | White (`#FFFFFF`) | Slate (`#1E293B`)  
> **Hierarchy Rules:** 1 Managing Director (Arsalan Malik) | 12 Department Managers | 108 Supervisors  

---

## 🏛️ Master System Specification Matrix (CSV Table Standard)

| Layer_Type | Identifier | Attribute_A_Name | Attribute_B_Config | Attribute_C_Directive | Component_Target_Mapping |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **LEGAL_CORE** | `DET_Profile` | License_No | `"1388443"` | Register_No | `"2365938 (DCCI No. 553199)"` · `src/mocks/companyMasterLedger.json` |
| **LEGAL_CORE** | `DET_Profile` | Corporate_Title | `"WHITE CAVES REAL ESTATE L.L.C"` | Legal_Form | `"Limited Liability Company - Single Owner (LLC - SO)"` · `src/mocks/companyMasterLedger.json` |
| **LEGAL_CORE** | `DET_Profile` | Managing_Director | `"ARSLAN MALIK BASHIR AHMAD"` | MD_Superuser_Email | `"the.white.caves@gmail.com / arslanmalikgoraha@gmail.com"` · `src/config/rbacConfiguration.ts` |
| **REGULATORY_CORE** | `RERA_Profile` | RERA_ORN | `"44483"` | Office_Classification | `"General"` · `software_docs/01_requirements_engineering/` |
| **REGULATORY_CORE** | `ICP_Profile` | Est_Card_MOL_No | `"2/1/1192499"` | ICP_Region | `"Abu Hail, Dubai"` · `software_docs/01_requirements_engineering/` |
| **TENANCY** | `EJARI_Core` | Contract_No | `"0120250814005322"` | Registration_Date | `"14-08-2025 (Valid to 13-08-2026)"` · `business_docs/02_leasing_property_management/` |
| **METADATA** | `Project_Env` | System_Version | `"2.0.26"` | Tech_Stack | `"React 19, Next.js 15, RTK, Node, Express, Prisma Singleton, Nodemon"` · `package.json` |
| **METADATA** | `Project_Env` | Brand_Palette | `"Red (#EF4444) \| White (#FFFFFF) \| Slate (#1E293B)"` | Forbidden_Colors | `"emerald_green \| metallic_gold \| obsidian_black"` · `src/styles/global.css` |
| **METADATA** | `Project_Env` | Hierarchy_Rules | `"1_MD \| 12_Managers \| 108_Supervisors"` | Access_Control | `"Level 5 (MD Override Bypass) to Level 1 (Intern Fallback)"` · `src/config/rbacConfiguration.ts` |
| **MD_CREDENTIAL** | `DET_License` | Document_No | `"1388443"` | Expiry_Date | `"30-07-2026"` (90-Day Alert: 01-05-2026, 30-Day Alert: 30-06-2026, Authority: DET) |
| **MD_CREDENTIAL** | `RERA_ORN` | Document_No | `"44483"` | Expiry_Date | `"30-07-2026"` (90-Day Alert: 01-05-2026, 30-Day Alert: 30-06-2026, Authority: RERA) |
| **MD_CREDENTIAL** | `HQ_Ejari` | Document_No | `"0120250814005322"` | Expiry_Date | `"13-08-2026"` (90-Day Alert: 15-05-2026, 30-Day Alert: 14-07-2026, Authority: DLD) |
| **MD_CREDENTIAL** | `ICP_Card` | Document_No | `"2/1/1192499"` | Expiry_Date | `"31-08-2026"` (90-Day Alert: 02-06-2026, 30-Day Alert: 01-08-2026, Authority: ICP) |
| **INTERFACE** | `SHELL_01` | Element | `TopNavbar` | Coordinates | `fixed top-0 left-0 w-full h-16 z-1000 bg-white border-b-2 border-red-500` · `src/components/navigation/TopNavbar.tsx` |
| **INTERFACE** | `SHELL_02` | Element | `UnifiedSidebar` | Coordinates | `fixed top-16 left-0 h-[calc(100vh-64px)] w-[280px] z-900 bg-white border-r` · `src/layouts/UnifiedWorkspaceLayout.tsx` |
| **INTERFACE** | `WIDGET_01` | Element | `caves_floating_search` | Coordinates | `fixed bottom-6 left-6 z-2000 bg-white border-red-500 glassmorphic pill` · `src/components/shared/CavesFloatingSearch.tsx` |
| **INTERFACE** | `WIDGET_02` | Element | `whatsapp_floating` | Coordinates | `fixed bottom-6 right-6 z-2000 corporate red/white contact marker token` · `src/components/shared/WhatsAppWidget.tsx` |
