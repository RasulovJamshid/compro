/**
 * CLI script to tile an equirectangular 360° image.
 *
 * Usage:
 *   npx ts-node scripts/tile-panorama.ts <source-image> [panorama-id] [tile-size]
 *
 * Examples:
 *   npx ts-node scripts/tile-panorama.ts ../uploads/images/insta360_sample.jpg insta360_sample
 *   npx ts-node scripts/tile-panorama.ts ../uploads/images/insta360_sample.jpg insta360_sample 512
 */

import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

interface TileConfig {
  id: string;
  originalWidth: number;
  originalHeight: number;
  width: number;
  height: number;
  tileSize: number;
  cols: number;
  rows: number;
  baseUrl: string;
  basePanorama: string;
}

async function tilePanorama(
  sourcePath: string,
  panoramaId: string,
  tileSize: number,
): Promise<TileConfig> {
  const tilesBaseDir = path.join(process.cwd(), 'uploads', 'tiles');
  const outputDir = path.join(tilesBaseDir, panoramaId);

  if (fs.existsSync(path.join(outputDir, 'config.json'))) {
    console.log(`⚠️  Tiles already exist for "${panoramaId}". Delete the folder to re-tile.`);
    const existing = JSON.parse(
      fs.readFileSync(path.join(outputDir, 'config.json'), 'utf-8'),
    );
    return existing;
  }

  fs.mkdirSync(outputDir, { recursive: true });

  // 1. Read source
  const meta = await sharp(sourcePath).metadata();
  if (!meta.width || !meta.height) {
    throw new Error('Cannot read image dimensions');
  }

  const origW = meta.width;
  const origH = meta.height;
  console.log(`📷 Source: ${origW}×${origH} (${path.basename(sourcePath)})`);

  // 2. Snap to tile-aligned dimensions
  const cols = Math.max(1, Math.round(origW / tileSize));
  const rows = Math.max(1, Math.round(origH / tileSize));
  const alignedW = cols * tileSize;
  const alignedH = rows * tileSize;

  console.log(`📐 Aligned: ${alignedW}×${alignedH} → ${cols} cols × ${rows} rows (tile ${tileSize}px)`);

  // 3. Resize into raw buffer
  const { data: pixels, info } = await sharp(sourcePath)
    .resize(alignedW, alignedH, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;

  // 4. Low-res preview
  const previewW = Math.min(1024, alignedW);
  const previewH = Math.round(previewW * (alignedH / alignedW));

  await sharp(pixels, { raw: { width: alignedW, height: alignedH, channels } })
    .resize(previewW, previewH)
    .jpeg({ quality: 70, mozjpeg: true })
    .toFile(path.join(outputDir, 'low.jpg'));

  console.log(`🖼️  Preview: ${previewW}×${previewH} → low.jpg`);

  // 5. Generate tiles in batches
  const totalTiles = cols * rows;
  const batchSize = 8;
  let processed = 0;

  for (let batchStart = 0; batchStart < totalTiles; batchStart += batchSize) {
    const promises: Promise<void>[] = [];

    for (
      let idx = batchStart;
      idx < Math.min(batchStart + batchSize, totalTiles);
      idx++
    ) {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const left = col * tileSize;
      const top = row * tileSize;

      promises.push(
        sharp(pixels, {
          raw: { width: alignedW, height: alignedH, channels },
        })
          .extract({ left, top, width: tileSize, height: tileSize })
          .jpeg({ quality: 85, mozjpeg: true })
          .toFile(path.join(outputDir, `${col}_${row}.jpg`))
          .then(() => {
            processed++;
          }),
      );
    }

    await Promise.all(promises);
    process.stdout.write(`\r🔲 Tiles: ${processed}/${totalTiles}`);
  }

  console.log(''); // newline after progress

  // 6. Save config
  const config: TileConfig = {
    id: panoramaId,
    originalWidth: origW,
    originalHeight: origH,
    width: alignedW,
    height: alignedH,
    tileSize,
    cols,
    rows,
    baseUrl: `/uploads/tiles/${panoramaId}/{col}_{row}.jpg`,
    basePanorama: `/uploads/tiles/${panoramaId}/low.jpg`,
  };

  fs.writeFileSync(
    path.join(outputDir, 'config.json'),
    JSON.stringify(config, null, 2),
  );

  console.log(`✅ Done! Config → uploads/tiles/${panoramaId}/config.json`);
  console.log(JSON.stringify(config, null, 2));

  return config;
}

// ── CLI entry ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: npx ts-node scripts/tile-panorama.ts <image-path> [panorama-id] [tile-size]');
  console.log('Example: npx ts-node scripts/tile-panorama.ts ../uploads/images/insta360_sample.jpg insta360_sample 512');
  process.exit(1);
}

const srcPath = path.resolve(args[0]);
if (!fs.existsSync(srcPath)) {
  console.error(`❌ File not found: ${srcPath}`);
  process.exit(1);
}

const panoId = args[1] || path.basename(srcPath, path.extname(srcPath));
const tileSz = parseInt(args[2] || '512', 10);

tilePanorama(srcPath, panoId, tileSz).catch((err) => {
  console.error('❌ Tiling failed:', err);
  process.exit(1);
});
