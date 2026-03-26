import { Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

export interface TileConfig {
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

@Injectable()
export class PanoramaTileService {
  private readonly logger = new Logger(PanoramaTileService.name);
  private readonly tilesBaseDir = path.join(process.cwd(), 'uploads', 'tiles');

  constructor() {
    if (!fs.existsSync(this.tilesBaseDir)) {
      fs.mkdirSync(this.tilesBaseDir, { recursive: true });
    }
  }

  /**
   * Tile an equirectangular panorama image into a grid of JPEG chunks
   * plus a low-res preview for instant display.
   *
   * The source image is resized so that both dimensions are exact multiples
   * of TILE_SIZE, guaranteeing every tile is the same pixel size – which is
   * what Photo Sphere Viewer's EquirectangularTilesAdapter expects.
   */
  async tileImage(
    sourcePath: string,
    panoramaId: string,
    tileSize = 512,
  ): Promise<TileConfig> {
    const outputDir = path.join(this.tilesBaseDir, panoramaId);

    if (fs.existsSync(path.join(outputDir, 'config.json'))) {
      this.logger.log(`Tiles already exist for ${panoramaId}, returning cached config`);
      return this.getConfig(panoramaId)!;
    }

    fs.mkdirSync(outputDir, { recursive: true });

    // ── 1. Read source dimensions ───────────────────────────────────
    const meta = await sharp(sourcePath).metadata();
    if (!meta.width || !meta.height) {
      throw new Error('Cannot read image dimensions');
    }

    const origW = meta.width;
    const origH = meta.height;
    this.logger.log(`Source panorama ${panoramaId}: ${origW}×${origH}`);

    // ── 2. Snap to nearest tile-aligned dimensions ──────────────────
    const cols = Math.max(1, Math.round(origW / tileSize));
    const rows = Math.max(1, Math.round(origH / tileSize));
    const alignedW = cols * tileSize;
    const alignedH = rows * tileSize;

    this.logger.log(
      `Aligned to ${alignedW}×${alignedH} (${cols} cols × ${rows} rows, tile ${tileSize}px)`,
    );

    // ── 3. Resize once into a raw pixel buffer ──────────────────────
    const resizedBuf = await sharp(sourcePath)
      .resize(alignedW, alignedH, { fit: 'fill' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data: pixels, info } = resizedBuf;
    const channels = info.channels; // 3 (RGB) or 4 (RGBA)

    // ── 4. Generate low-res preview ─────────────────────────────────
    const previewW = Math.min(1024, alignedW);
    const previewH = Math.round(previewW * (alignedH / alignedW));

    await sharp(pixels, { raw: { width: alignedW, height: alignedH, channels } })
      .resize(previewW, previewH)
      .jpeg({ quality: 70, mozjpeg: true })
      .toFile(path.join(outputDir, 'low.jpg'));

    this.logger.log(`Preview: ${previewW}×${previewH}`);

    // ── 5. Extract each tile ────────────────────────────────────────
    const batchSize = 8; // process tiles in parallel batches to limit memory
    const totalTiles = cols * rows;
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
    }

    this.logger.log(`Generated ${processed} tiles`);

    // ── 6. Write config.json ────────────────────────────────────────
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

    return config;
  }

  /** Return the cached tile config for a panorama, or null. */
  getConfig(panoramaId: string): TileConfig | null {
    const cfgPath = path.join(this.tilesBaseDir, panoramaId, 'config.json');
    if (!fs.existsSync(cfgPath)) return null;
    return JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
  }

  /** List all panorama IDs that have been tiled. */
  listPanoramas(): string[] {
    if (!fs.existsSync(this.tilesBaseDir)) return [];
    return fs.readdirSync(this.tilesBaseDir).filter((name) => {
      return fs.existsSync(
        path.join(this.tilesBaseDir, name, 'config.json'),
      );
    });
  }

  /** Delete all tiles for a given panorama. */
  deleteTiles(panoramaId: string): boolean {
    const dir = path.join(this.tilesBaseDir, panoramaId);
    if (!fs.existsSync(dir)) return false;
    fs.rmSync(dir, { recursive: true, force: true });
    return true;
  }
}
