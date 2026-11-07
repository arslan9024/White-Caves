# Wave 12: Document Engine Specifications

## 1. Overview
The `DocumentService` handles the generation and templating of massive data exports, including PDFs via `pdf-lib` and Excel spreadsheets via `exceljs`.

## 2. API Contracts

### `GET /api/v1/documents/export/leads`
- **Response Type**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (XLSX) or `text/csv`.
- **Payload**: Streams an Excel file containing up to 5,000 leads, formatted with custom column widths.

### `GET /api/v1/documents/export/properties`
- **Response Type**: XLSX / CSV.
- **Payload**: Streams a full property pipeline export.

### `GET /api/v1/documents/export/pnl`
- **Params**: `?year=2026&month=9`
- **Response Type**: `application/pdf`
- **Payload**: A formatted PDF summarizing gross income, VAT collected (5%), and net operating income.

## 3. Streaming Behavior
To avoid Node.js memory pressure when generating 10,000+ row exports:
- Uses `exceljs` streaming buffers.
- Sends chunks directly to the HTTP response stream rather than caching the full buffer in RAM.
