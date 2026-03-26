import { Module } from '@nestjs/common';
import { PanoramaTileService } from './panorama-tile.service';
import { PanoramaController } from './panorama.controller';

@Module({
  controllers: [PanoramaController],
  providers: [PanoramaTileService],
  exports: [PanoramaTileService],
})
export class PanoramaModule {}
