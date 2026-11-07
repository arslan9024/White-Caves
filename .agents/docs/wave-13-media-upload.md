# Wave 13 — Media Upload: multer + StorageService Spec

**Drafted by:** @Cloudinary  
**Model:** DeepSeek V3  
**Status:** ✅ READY (retrospective spec for implemented Wave 13)  
**Last Updated:** 2026-05-25  

CONSUMES←@Mira: `server/services/StorageService.ts`  
FEEDS→@Fei-Fei: `business_docs/09_crm_features/sentinel-property.md#media-pipeline`  
FEEDS_ACK←@Katherine: accepted | `business_docs/09_crm_features/wave-13-media-upload.md`

---

## 1. Overview

The Media Upload pipeline handles property image ingestion, validation, optimisation, and local storage. It uses `multer` for multipart form parsing and `sharp` for image transformation, with all assets stored on the filesystem under `server/public/uploads/`.

---

## 2. StorageService (`server/services/StorageService.ts`)

### 2.1 Directory Layout

```
server/public/uploads/properties/
  ├── {original filename}          ← original upload (preserved)
  └── transformed/
      ├── optimized-{filename}     ← WebP-optimised (max 1200×800, quality 80)
      └── thumb-{filename}         ← WebP thumbnail (400×300, quality 70)
```

Directories are auto-created with `fs.mkdir({ recursive: true })` on first use.

### 2.2 Constraints

| Constraint | Value |
|-----------|-------|
| Max file size | 8 MB |
| Allowed MIME types | `image/jpeg`, `image/png`, `image/webp` |
| Max images per property | 20 (enforced at route level) |
| Naming collision | UUID prefix prepended to filename |

### 2.3 `StoredMediaAsset` Return Type

```typescript
interface StoredMediaAsset {
  originalUrl: string;    // /uploads/properties/{filename}
  optimizedUrl: string;   // /uploads/properties/transformed/optimized-{filename}
  thumbnailUrl: string;   // /uploads/properties/transformed/thumb-{filename}
  fileName: string;       // sanitised filename
}
```

### 2.4 Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `validateImage(file)` | `(file: Express.Multer.File): void` | Throws if MIME or size invalid |
| `storeImage(file)` | `(file: Express.Multer.File): Promise<StoredMediaAsset>` | Save + transform; returns URLs |
| `deleteImage(fileName)` | `(fileName: string): Promise<void>` | Removes original + both transforms |

---

## 3. Image Transformation Pipeline

```
Uploaded buffer (multer memStorage)
  → validateImage()           ← throws on bad MIME or size > 8MB
  → save original to disk     ← {BASE_UPLOAD_DIR}/{uuid}-{filename}
  → sharp().resize(1200, 800, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(TRANSFORMED_DIR/optimized-...)
  → sharp().resize(400, 300, { fit: 'cover' })
      .webp({ quality: 70 })
      .toFile(TRANSFORMED_DIR/thumb-...)
  → return StoredMediaAsset
```

---

## 4. multer Configuration

```typescript
const upload = multer({
  storage: multer.memoryStorage(),     // buffer in memory for sharp pipeline
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
    cb(null, allowed.has(file.mimetype));
  },
});
```

---

## 5. HTTP Routes

| Method | Path | Auth | Multer | Description |
|--------|------|------|--------|-------------|
| `POST` | `/api/media/property/:propertyId/images` | `agent` | `upload.array('images', 20)` | Upload 1–20 property images |
| `DELETE` | `/api/media/property/:propertyId/images/:filename` | `agent` | — | Delete one property image |
| `GET` | `/api/media/property/:propertyId/images` | authenticated | — | List all image URLs for a property |

**Upload response:**
```json
{
  "uploaded": [
    {
      "originalUrl": "/uploads/properties/uuid-photo1.jpg",
      "optimizedUrl": "/uploads/properties/transformed/optimized-uuid-photo1.jpg",
      "thumbnailUrl": "/uploads/properties/transformed/thumb-uuid-photo1.jpg",
      "fileName": "uuid-photo1.jpg"
    }
  ]
}
```

---

## 6. Static File Serving

The uploads directory is served as static files via Express:

```typescript
app.use('/uploads', express.static(path.join(process.cwd(), 'server/public/uploads')));
```

---

## 7. Future: Cloudinary Migration Path

> The current implementation uses local filesystem storage. When traffic requires CDN-backed storage, the `storeImage` method can be replaced with a Cloudinary upload call while preserving the `StoredMediaAsset` return contract — no route changes required.

**Migration checklist (future Wave):**
- Add `cloudinary` SDK dependency
- Replace `sharp` + `fs` write calls with `cloudinary.uploader.upload(buffer)`
- Map Cloudinary response to `StoredMediaAsset` URLs
- Remove `server/public/uploads/` from disk

---

## 8. Acceptance Criteria

- [x] JPEG, PNG, WEBP accepted; other types rejected with `400`
- [x] Files > 8MB rejected before hitting the handler
- [x] `optimized` variant is WebP, max 1200×800
- [x] `thumb` variant is WebP, 400×300 (cover crop)
- [x] `deleteImage` removes all 3 files (original + 2 transforms)
- [x] Static `/uploads` route serves images without auth
- [x] Upload limited to 20 images per property per request
