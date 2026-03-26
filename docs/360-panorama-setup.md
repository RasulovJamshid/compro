# 360° Panorama System - Setup Guide

## Overview

The system supports optimized 360° equirectangular panorama viewing with automatic tiling for efficient bandwidth usage. Large panoramas are split into a grid of tiles that load on-demand based on the user's viewport.

## Architecture

### Backend Components

1. **Panorama Tiling Service** (`backend/src/panorama/panorama-tile.service.ts`)
   - Uses `sharp` to process large equirectangular images
   - Resizes to tile-aligned dimensions (multiples of tile size)
   - Generates low-res preview for instant display
   - Creates grid of equal-sized JPEG tiles
   - Stores tiles in `uploads/tiles/{panoramaId}/`

2. **Panorama Controller** (`backend/src/panorama/panorama.controller.ts`)
   - `POST /api/panorama/upload` - Upload and auto-tile panorama
   - `GET /api/panorama/:id/config` - Get tile configuration
   - `GET /api/panorama` - List all tiled panoramas
   - `DELETE /api/panorama/:id` - Delete panorama tiles

3. **Database Schema**
   - Added `panorama360Id` field to Property model
   - Links properties to their tiled panoramas

### Frontend Components

1. **Tour360Viewer** (`frontend/src/components/properties/Tour360Viewer.tsx`)
   - Supports both full-image and tiled panoramas
   - Uses `@photo-sphere-viewer/equirectangular-tiles-adapter`
   - Shows low-res preview instantly
   - Streams high-res tiles on demand
   - Falls back gracefully if tiles unavailable

2. **Admin Property Form** (`frontend/src/app/dashboard/properties/new/page.tsx`)
   - Upload 360° panorama during property creation
   - Automatic tiling on upload
   - Preview before submission

## Setup Instructions

### 1. Database Migration

Run the migration to add `panorama360Id` field:

```bash
cd backend
npx prisma migrate deploy
# or for development:
npx prisma migrate dev
```

### 2. Install Dependencies

Backend dependencies (already installed):
- `sharp` - Image processing

Frontend dependencies (already installed):
- `@photo-sphere-viewer/equirectangular-tiles-adapter`

### 3. Directory Structure

The system automatically creates:
```
uploads/
├── images/           # Original uploaded images
├── videos/           # Video files
└── tiles/            # Tiled panoramas
    └── {panoramaId}/
        ├── config.json      # Tile configuration
        ├── low.jpg          # Low-res preview
        ├── 0_0.jpg          # Tile at column 0, row 0
        ├── 0_1.jpg          # Tile at column 0, row 1
        └── ...              # More tiles
```

## Usage

### Option 1: CLI Tiling (For Existing Images)

Tile an existing equirectangular image:

```bash
cd backend
npx ts-node scripts/tile-panorama.ts ../uploads/images/insta360_sample.jpg insta360_sample 512
```

Parameters:
- `<image-path>` - Path to equirectangular image
- `[panorama-id]` - Optional ID (defaults to filename)
- `[tile-size]` - Optional tile size in pixels (default: 512)

Output:
```
📷 Source: 8192×4096 (insta360_sample.jpg)
📐 Aligned: 8192×4096 → 16 cols × 8 rows (tile 512px)
🖼️  Preview: 1024×512 → low.jpg
🔲 Tiles: 128/128
✅ Done! Config → uploads/tiles/insta360_sample/config.json
```

### Option 2: Admin Dashboard Upload

1. Navigate to `/dashboard/properties/new`
2. Fill in property details
3. In the "360° Панорама" section, upload an equirectangular image
4. System automatically tiles the image on upload
5. Submit the form

The property will be created with:
- `hasTour360: true`
- `panorama360Id: "{generated-id}"`
- Tiles stored in `uploads/tiles/{generated-id}/`

### Option 3: API Upload

```bash
curl -X POST http://localhost:3001/api/panorama/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@path/to/panorama.jpg"
```

Response:
```json
{
  "panoramaId": "pano-1234567890-123456789",
  "sourceUrl": "/uploads/images/pano-1234567890-123456789.jpg",
  "tileConfig": {
    "id": "pano-1234567890-123456789",
    "width": 8192,
    "height": 4096,
    "tileSize": 512,
    "cols": 16,
    "rows": 8,
    "baseUrl": "/uploads/tiles/pano-1234567890-123456789/{col}_{row}.jpg",
    "basePanorama": "/uploads/tiles/pano-1234567890-123456789/low.jpg"
  }
}
```

Then update your property:
```bash
curl -X PUT http://localhost:3001/api/admin/properties/{propertyId} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hasTour360": true,
    "panorama360Id": "pano-1234567890-123456789"
  }'
```

## How It Works

### Tiling Process

1. **Read source dimensions** - Get original image size
2. **Snap to tile-aligned dimensions** - Round to nearest multiple of tile size
3. **Resize once** - Single resize operation to aligned dimensions
4. **Generate preview** - Create 1024px wide low-res JPEG
5. **Extract tiles** - Slice into grid of equal-sized tiles (processed in batches)
6. **Save config** - Write metadata JSON for frontend

### Frontend Loading

1. **Initial load** - Show low-res preview instantly (1024px, ~50-100KB)
2. **Viewport detection** - Photo Sphere Viewer calculates visible tiles
3. **On-demand fetching** - Only load tiles in current viewport
4. **Progressive enhancement** - Replace preview tiles with high-res as they load
5. **Smooth panning** - Preload adjacent tiles for seamless navigation

### Performance Benefits

| Scenario | Full Image | Tiled (512px) |
|----------|-----------|---------------|
| Initial load | 8192×4096 (~5-10MB) | 1024×512 (~50-100KB) |
| Viewport tiles | N/A | ~8-12 tiles (~400-600KB) |
| Total bandwidth | 5-10MB | ~500KB-1MB |
| Time to interactive | 3-5s | <1s |

## Configuration

### Tile Size

Default: 512px. Adjust based on your needs:

- **256px** - More tiles, smaller files, more HTTP requests
- **512px** - Balanced (recommended)
- **1024px** - Fewer tiles, larger files, fewer requests

### Quality Settings

In `panorama-tile.service.ts`:

```typescript
// Preview quality (line ~76)
.jpeg({ quality: 70, mozjpeg: true })

// Tile quality (line ~109)
.jpeg({ quality: 85, mozjpeg: true })
```

## Troubleshooting

### Tiles not loading

1. Check tile config exists:
   ```bash
   curl http://localhost:3001/api/panorama/{panoramaId}/config
   ```

2. Verify tiles directory:
   ```bash
   ls -la backend/uploads/tiles/{panoramaId}/
   ```

3. Check CORS headers in `backend/src/main.ts` (already configured)

### Image quality issues

- Increase tile quality in `panorama-tile.service.ts`
- Use larger tile size (1024px)
- Ensure source image is high quality

### Memory issues during tiling

- Reduce batch size in `panorama-tile.service.ts` (line 86)
- Process smaller images
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096`

## API Reference

### GET /api/panorama/:id/config

Get tile configuration for a panorama.

**Response:**
```json
{
  "id": "insta360_sample",
  "originalWidth": 8192,
  "originalHeight": 4096,
  "width": 8192,
  "height": 4096,
  "tileSize": 512,
  "cols": 16,
  "rows": 8,
  "baseUrl": "/uploads/tiles/insta360_sample/{col}_{row}.jpg",
  "basePanorama": "/uploads/tiles/insta360_sample/low.jpg"
}
```

### POST /api/panorama/upload

Upload and tile a 360° panorama.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (image file, max 80MB)

**Response:**
```json
{
  "panoramaId": "pano-1234567890-123456789",
  "sourceUrl": "/uploads/images/pano-1234567890-123456789.jpg",
  "tileConfig": { ... }
}
```

### DELETE /api/panorama/:id

Delete all tiles for a panorama.

**Response:**
```json
{
  "message": "Tiles for \"pano-123\" deleted"
}
```

## Best Practices

1. **Source Images**
   - Use equirectangular format (2:1 aspect ratio)
   - Minimum resolution: 4096×2048
   - Recommended: 8192×4096 or higher
   - Format: JPEG, PNG, or WebP

2. **Storage**
   - Tiled panoramas use ~20-30% more disk space than originals
   - Consider cleanup strategy for unused tiles
   - Use CDN for production deployments

3. **User Experience**
   - Always provide fallback for non-tiled mode
   - Show loading states during tile fetching
   - Preload adjacent tiles for smooth panning

4. **Production Deployment**
   - Serve tiles from CDN
   - Enable HTTP/2 for parallel tile loading
   - Configure aggressive caching (tiles never change)
   - Consider WebP format for smaller file sizes

## Example Property with 360° Panorama

```typescript
const property = {
  title: "Modern Office Space",
  // ... other fields
  hasTour360: true,
  panorama360Id: "insta360_sample",
  // Optional: fallback URL for non-tiled viewers
  tour360Url: "/uploads/images/insta360_sample.jpg"
}
```

The frontend automatically:
1. Fetches tile config from `/api/panorama/insta360_sample/config`
2. Loads low-res preview instantly
3. Streams high-res tiles as user navigates
4. Falls back to `tour360Url` if tiles unavailable
