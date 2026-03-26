import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * Ensure upload directories exist
 * Call this on application startup
 */
export function ensureUploadDirectories() {
  const uploadDir = join(process.cwd(), 'uploads');
  const imagesDir = join(uploadDir, 'images');
  const videosDir = join(uploadDir, 'videos');
  const tilesDir = join(uploadDir, 'tiles');

  // Create main uploads directory
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Created uploads directory');
  }

  // Create images directory
  if (!existsSync(imagesDir)) {
    mkdirSync(imagesDir, { recursive: true });
    console.log('✅ Created uploads/images directory');
  }

  // Create videos directory
  if (!existsSync(videosDir)) {
    mkdirSync(videosDir, { recursive: true });
    console.log('✅ Created uploads/videos directory');
  }

  // Create tiles directory (for tiled 360° panoramas)
  if (!existsSync(tilesDir)) {
    mkdirSync(tilesDir, { recursive: true });
    console.log('✅ Created uploads/tiles directory');
  }

  console.log('📁 Upload directories ready');
}
