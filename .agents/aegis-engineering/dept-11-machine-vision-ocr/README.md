# Department 11: Autonomous Machine Vision & Optical Character Recognition

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Rania` — Principal Computer Vision Systems Lead  
> **Tech Stack:** Tesseract.js, Sharp, Multer, TypeScript, PDF-parse, Canvas API  
> **Skill Reference:** [`.agents/skills/aegis-dept-11-vision-ocr/SKILL.md`](../../skills/aegis-dept-11-vision-ocr/SKILL.md)  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility | Config |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **@Rania** *(Director)* | Principal Computer Vision Systems Lead | Owns binary file parsing systems, Live Tesseract OCR structures, and optical ingestion grids. | [`config`](./node-01-rania.agent.json) |
| 2 | **@Dina** | Binary Byte Upload Chloroform Traffic Controller | Manages incoming multi-part byte stream buffers to isolate server memory from upload overflow crashes. | [`config`](./node-02-dina.agent.json) |
| 3 | **@Vesta** | Media Asset Dimension Compression Developer | Scripts automated canvas image scaling filters to truncate binary file weights inside asset pipelines. | [`config`](./node-03-vesta.agent.json) |
| 4 | **@Henry** | PDF Tabular Matrix Data Extraction Specialist | Transforms unstructured document tabular streams into clean relational database array variables. | [`config`](./node-04-henry.agent.json) |
| 5 | **@Fei_Fei_Li** | Image Object Identification Matrix Designer | Programs pattern recognition classification configurations to isolate critical data categories. | [`config`](./node-05-fei-fei-li.agent.json) |
| 6 | **@Carol_Shaw** | Raw Byte Mapping Matrix Programmer | Refines raw byte parsing logic arrays to achieve sub-millisecond data extraction performance. | [`config`](./node-06-carol-shaw.agent.json) |
| 7 | **@Roberta_Williams** | Graphical Boundary Coordinate Mapper | Calculates spatial bounding box dimensions over blueprints to gather listing parameters. | [`config`](./node-07-roberta-williams.agent.json) |
| 8 | **@Mary_Lou_Jepsen_Vision** | Template Image Graphic Layer Projector | Calculates precise coordinate layouts to output system values dynamically over document graphics. | [`config`](./node-08-mary-lou-jepsen-vision.agent.json) |
| 9 | **@Barbara_Grosz** | Natural Language Structural Field Compiler | Normalizes parsed text inputs into validated database configurations before data save updates. | [`config`](./node-09-barbara-grosz.agent.json) |

---

## Key Codebase Ownership

- `server/services/`
- `server/middleware/`
- `src/utils/imageOptimization.ts`

---

## Mandatory Coding Rules

1. File uploads: max 10MB per file, validate MIME type before processing
2. Image processing: use Sharp for resize/compress — never load full-res into memory
3. OCR: Tesseract.js for text extraction from Ejari documents and trade licenses
4. PDF parsing: extract tables into structured JSON arrays for database ingestion
5. Memory safety: stream large files — never buffer entire upload in memory
6. Supported formats: JPEG, PNG, WebP, PDF, TIFF — reject all others
7. Bounding box coordinates: use normalized 0-1 range for resolution independence
8. Error handling: corrupted files must return 422 with clear error message

---

## Operational Procedures

- **Image Optimization Tests:** `npx vitest run src/utils/imageOptimization.test.ts`
- **Upload Stress Test:** `npm run test:upload:stress`
- **OCR Accuracy Test:** `npm run test:ocr:accuracy`

---

## Governance

- Single Purpose File Law (< 350 lines)
- TypeScript Strict (zero warnings)
- Zero Backlog Law
- Continuous Deduplication
- Conventional Commits
