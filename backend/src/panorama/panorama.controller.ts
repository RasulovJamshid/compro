import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PanoramaTileService } from './panorama-tile.service';

@ApiTags('panorama')
@Controller('panorama')
export class PanoramaController {
  constructor(private readonly tileService: PanoramaTileService) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload an equirectangular 360° image and generate tiles',
  })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `pano-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Only image files (jpg/png/webp) are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 80 * 1024 * 1024 }, // 80 MB – 360 images are large
    }),
  )
  async uploadPanorama(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const panoramaId = file.filename.replace(extname(file.filename), '');
    const config = await this.tileService.tileImage(file.path, panoramaId);

    return {
      panoramaId,
      sourceUrl: `/uploads/images/${file.filename}`,
      tileConfig: config,
    };
  }

  @Get(':id/config')
  @ApiOperation({ summary: 'Get tile configuration for a panorama' })
  @ApiParam({ name: 'id', description: 'Panorama ID' })
  getConfig(@Param('id') id: string) {
    const config = this.tileService.getConfig(id);
    if (!config) {
      throw new NotFoundException(`Panorama "${id}" not found or not yet tiled`);
    }
    return config;
  }

  @Get()
  @ApiOperation({ summary: 'List all tiled panoramas' })
  listPanoramas() {
    return this.tileService.listPanoramas().map((id) => ({
      id,
      configUrl: `/api/panorama/${id}/config`,
    }));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tiles for a panorama' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Panorama ID' })
  deletePanorama(@Param('id') id: string) {
    const deleted = this.tileService.deleteTiles(id);
    if (!deleted) {
      throw new NotFoundException(`Panorama "${id}" not found`);
    }
    return { message: `Tiles for "${id}" deleted` };
  }
}
