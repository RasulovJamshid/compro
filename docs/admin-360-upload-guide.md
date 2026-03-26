# Admin Guide: Uploading 360° Panoramas

## Quick Start

1. **Navigate to Property Creation**
   - Go to `/dashboard/properties`
   - Click **"Добавить объект"** (Add Property) button
   - You'll be redirected to `/dashboard/properties/new`

2. **Fill in Property Details**
   - Complete all required fields (title, description, type, price, location, etc.)
   - Upload regular property images in the "Фотографии" section

3. **Upload 360° Panorama**
   - Scroll to the **"360° Панорама"** section
   - Click the upload area or drag and drop your panorama image
   - Supported formats: JPG, PNG, WEBP (max 80MB)
   - The image must be equirectangular format (2:1 aspect ratio)

4. **Submit**
   - Click **"Создать объект"** (Create Property)
   - The system will:
     - Upload your panorama to the server
     - Automatically tile it into optimized chunks
     - Generate a low-res preview for instant loading
     - Create the property with `hasTour360: true`

## What Happens Behind the Scenes

When you upload a 360° panorama:

1. **File Upload** → Image sent to `/api/panorama/upload`
2. **Automatic Tiling** → Backend processes the image:
   - Resizes to tile-aligned dimensions
   - Creates a 1024px low-res preview (`low.jpg`)
   - Slices into 512px tiles (e.g., `0_0.jpg`, `0_1.jpg`, etc.)
   - Stores in `uploads/tiles/{panoramaId}/`
3. **Property Creation** → Property saved with:
   - `hasTour360: true`
   - `panorama360Id: "{generated-id}"`
4. **User Experience** → When users view the property:
   - Low-res preview loads instantly (<1 second)
   - High-res tiles stream as they navigate
   - Smooth, optimized viewing experience

## Image Requirements

### Format
- **Equirectangular projection** (360° × 180° spherical panorama)
- **Aspect ratio**: 2:1 (width is exactly 2× height)
- **Examples**: 
  - 4096 × 2048
  - 8192 × 4096
  - 16384 × 8192

### Quality
- **Minimum resolution**: 4096 × 2048
- **Recommended**: 8192 × 4096 or higher
- **File format**: JPEG (best compatibility), PNG, or WebP
- **File size**: Up to 80MB

### How to Get Equirectangular Images

1. **360° Cameras**: Insta360, Ricoh Theta, GoPro MAX
2. **Photo Stitching**: Hugin, PTGui, Adobe Photoshop
3. **3D Rendering**: Blender, 3ds Max, V-Ray
4. **Stock Photos**: Poly Haven, HDRi Haven, Unsplash 360

## Troubleshooting

### "Не удалось загрузить 360° панораму" (Upload Failed)

**Possible causes:**
- File too large (>80MB) → Compress or resize
- Wrong format → Use JPG, PNG, or WEBP
- Network timeout → Try again with smaller file
- Server error → Check backend logs

**Solutions:**
1. Compress image using tools like TinyPNG or ImageOptim
2. Resize to 8192×4096 or smaller
3. Convert to JPEG format
4. Check network connection

### Image Loads But Looks Distorted

**Cause:** Image is not equirectangular format

**Solution:**
- Verify aspect ratio is exactly 2:1
- Use proper 360° camera or stitching software
- Don't use regular photos or fisheye images

### Preview Shows But Tiles Don't Load

**Cause:** Tiling process failed

**Check:**
1. Backend logs for errors
2. `uploads/tiles/{panoramaId}/` directory exists
3. `config.json` file is present
4. Individual tile files exist (e.g., `0_0.jpg`)

**Fix:**
- Re-upload the panorama
- Check backend has write permissions to `uploads/` directory
- Verify `sharp` package is installed

### Default Fallback Image Shows Instead

**Causes:**
- Property doesn't have `panorama360Id` set
- Tile config not found
- Network error fetching tiles

**Check:**
1. Property has `hasTour360: true`
2. Property has valid `panorama360Id`
3. Run: `curl http://localhost:3001/api/panorama/{panoramaId}/config`
4. Verify response contains tile configuration

## Best Practices

### Image Preparation
1. **Optimize before upload** - Compress to reasonable file size (2-10MB)
2. **Use appropriate resolution** - 8192×4096 is usually sufficient
3. **Check exposure** - Ensure image is well-lit and balanced
4. **Remove artifacts** - Clean up stitching errors or tripod shadows

### Property Management
1. **One panorama per property** - Currently supports single 360° view
2. **Update carefully** - Re-uploading creates new tiles (old ones remain)
3. **Test before publishing** - Preview the 360° view before making property active
4. **Delete unused panoramas** - Clean up old tiles to save disk space

### Performance Tips
1. **Smaller files load faster** - Compress images appropriately
2. **Higher quality = larger tiles** - Balance quality vs. bandwidth
3. **Preview is crucial** - Low-res preview ensures instant loading
4. **CDN recommended** - For production, serve tiles from CDN

## Example Workflow

```
1. Prepare panorama
   ├─ Capture with 360° camera (Insta360 ONE X2)
   ├─ Export as equirectangular JPG (8192×4096)
   └─ Compress to ~5MB using ImageOptim

2. Upload to dashboard
   ├─ Navigate to /dashboard/properties/new
   ├─ Fill in property details
   ├─ Upload panorama in "360° Панорама" section
   └─ Wait for preview to appear

3. Submit property
   ├─ Click "Создать объект"
   ├─ System tiles image automatically
   └─ Redirects to properties list

4. Verify
   ├─ Find property in list
   ├─ Click to view detail page
   ├─ Click "Виртуальный тур 360°" button
   └─ Confirm panorama loads smoothly
```

## Technical Details

### Upload Endpoint
```
POST /api/panorama/upload
Content-Type: multipart/form-data
Body: file (image file)

Response:
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

### File Structure
```
uploads/
└── tiles/
    └── pano-1234567890-123456789/
        ├── config.json          # Tile configuration
        ├── low.jpg              # 1024px preview (~50-100KB)
        ├── 0_0.jpg              # Top-left tile
        ├── 0_1.jpg              # Second row, first column
        ├── ...
        └── 15_7.jpg             # Bottom-right tile (16×8 grid)
```

### Property Data
```json
{
  "id": "prop-123",
  "title": "Modern Office Space",
  "hasTour360": true,
  "panorama360Id": "pano-1234567890-123456789",
  "tour360Url": null  // Optional fallback URL
}
```

## FAQ

**Q: Can I upload multiple 360° panoramas per property?**
A: Currently, only one panorama per property is supported. For virtual tours with multiple rooms, use the `virtualTourConfig` field (advanced feature).

**Q: What happens to the original uploaded image?**
A: It's stored in `uploads/images/` and can be used as a fallback if tiles fail to load.

**Q: Can I delete tiles after uploading?**
A: Yes, use `DELETE /api/panorama/{panoramaId}` endpoint or manually delete the `uploads/tiles/{panoramaId}/` directory.

**Q: How much disk space do tiles use?**
A: Approximately 20-30% more than the original image. An 8192×4096 image (~5MB) generates ~6-7MB of tiles.

**Q: Can I use regular photos instead of 360° panoramas?**
A: No, the viewer expects equirectangular format. Regular photos will appear distorted.

**Q: Does it work on mobile devices?**
A: Yes! The tiled viewer works on all devices and is optimized for mobile bandwidth.

**Q: Can I customize tile size or quality?**
A: Yes, but requires backend code changes in `panorama-tile.service.ts`. Default is 512px tiles at 85% quality.

## Support

If you encounter issues:
1. Check this guide first
2. Verify image format and size requirements
3. Check browser console for errors
4. Review backend logs
5. Contact technical support with error details
