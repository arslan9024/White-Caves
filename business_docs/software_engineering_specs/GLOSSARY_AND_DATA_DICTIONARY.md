# 📚 Glossary & Data Dictionary — UAE Real Estate & PropTech

**Entity:** WHITE CAVES REAL ESTATE L.L.C  
**Accreditations:** DET `1388443` | RERA ORN `44483`  

---

## 1. Domain Terminology & Government Lexicon

- **DLD (Dubai Land Department):** The government body overseeing all real estate registrations, title deeds, and property transactions in Dubai.
- **RERA (Real Estate Regulatory Agency):** The regulatory arm of DLD governing real estate brokerage licenses, permits, and escrow accounts.
- **Ejari:** The official government system for registering and authenticating lease contracts in Dubai (Law No. 26 of 2007).
- **Trakheesi:** The DLD permit system providing unique QR codes required for advertising any property in print, web, or social media.
- **Form A:** DLD contract between Property Seller and Real Estate Broker (Exclusive or Non-Exclusive Listing Mandate).
- **Form B:** DLD contract between Property Buyer / Tenant and Real Estate Broker.
- **Form F (MOU):** Memorandum of Understanding between Buyer and Seller defining purchase terms, deposit, and transfer timeline.
- **PDC (Post-Dated Cheque):** Standard banking payment method in the UAE for rental installments.
- **UAEDDS (UAE Direct Debit System):** Digital automated recurring payment platform integrated with Central Bank of UAE.

---

## 2. Platform Entity Dictionary

| Entity | Primary Key | Description | Storage |
|---|---|---|---|
| `User` | `id` (UUID / Email) | Single user profile mapped to active `role` in the 14-Role Sovereign Registry. | MongoDB / Redux |
| `Property` | `id` / `code` | Residential / Commercial unit with Trakheesi QR permit & pricing. | MongoDB |
| `Lead` | `id` | Inbound inquiry from Meta, Property Finder, Bayut, or WhatsApp. | MongoDB |
| `TenancyContract` | `contractNumber` | Private lease agreement ready for e-signature with PDC schedule. | Henry Vault |
| `EjariRecord` | `ejariNumber` | Official government Ejari certificate (`0120260721003974`). | Henry Vault |
