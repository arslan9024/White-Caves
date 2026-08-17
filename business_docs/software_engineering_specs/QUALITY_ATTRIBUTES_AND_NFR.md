# 🛡️ Quality Attributes & Non-Functional Requirements (NFR)

**System:** White Caves Real Estate Platform  
**Company:** WHITE CAVES REAL ESTATE L.L.C  

---

## 1. Performance & Latency Budgets
- **First Contentful Paint (FCP):** < 1.2s on standard UAE 4G/5G connections.
- **Client-Side Tab Switching:** < 50ms transition across all 15 CRM department views.
- **PDF Compilation & Print Preview Generation:** < 300ms in Henry Document Studio.
- **Real-Time Telemetry Latency:** < 100ms via WebSocket telemetry bridge.

## 2. Security & Compliance
- **Authentication & RBAC:** Single-Role Context identity model with zero data leakage between client and internal tiers.
- **Data Protection:** Compliance with UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL).
- **Cryptographic Watermarking:** Automated injection of White Caves Red Insignia, RERA ORN `44483`, and DET License `1388443` on all exported PDF documents.

## 3. Reliability & Recovery
- **99.9% Uptime SLA:** Dual-instance hosting with automated failover and daily encrypted S3 cold backups (`DatabaseBackupSyncService.ts`).
