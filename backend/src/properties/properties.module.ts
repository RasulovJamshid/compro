import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { PropertyComparisonService } from './property-comparison.service';
import { PropertyAnalyticsService } from './property-analytics.service';
import { PropertyDocumentsService } from './property-documents.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PropertiesController],
  providers: [
    PropertiesService,
    PropertyComparisonService,
    PropertyAnalyticsService,
    PropertyDocumentsService,
  ],
  exports: [
    PropertiesService,
    PropertyComparisonService,
    PropertyAnalyticsService,
    PropertyDocumentsService,
  ],
})
export class PropertiesModule {}
