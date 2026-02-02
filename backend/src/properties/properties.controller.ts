import { Controller, Get, Post, Delete, Param, Query, UseGuards, Body, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PropertiesService, PropertyFilters } from './properties.service';
import { PropertyComparisonService } from './property-comparison.service';
import { PropertyAnalyticsService } from './property-analytics.service';
import { PropertyDocumentsService } from './property-documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(
    private propertiesService: PropertiesService,
    private comparisonService: PropertyComparisonService,
    private analyticsService: PropertyAnalyticsService,
    private documentsService: PropertyDocumentsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить список объектов с фильтрами' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: any, @Query('page') page = 1, @Query('limit') limit = 20) {
    // Convert string boolean values to actual booleans
    const filters: PropertyFilters = {
      ...query,
      hasCommission: query.hasCommission === 'true' ? true : query.hasCommission === 'false' ? false : undefined,
      hasVideo: query.hasVideo === 'true' ? true : query.hasVideo === 'false' ? false : undefined,
      hasTour360: query.hasTour360 === 'true' ? true : query.hasTour360 === 'false' ? false : undefined,
      isVerified: query.isVerified === 'true' ? true : query.isVerified === 'false' ? false : undefined,
      isTop: query.isTop === 'true' ? true : query.isTop === 'false' ? false : undefined,
      minArea: query.minArea ? +query.minArea : undefined,
      maxArea: query.maxArea ? +query.maxArea : undefined,
      minPrice: query.minPrice ? +query.minPrice : undefined,
      maxPrice: query.maxPrice ? +query.maxPrice : undefined,
    };
    return this.propertiesService.findAll(filters, +page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить детали объекта' })
  async findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Сохранить объект' })
  saveProperty(@Param('id') id: string, @CurrentUser() user: any) {
    return this.propertiesService.saveProperty(user.id, id);
  }

  @Delete(':id/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить из сохраненных' })
  unsaveProperty(@Param('id') id: string, @CurrentUser() user: any) {
    return this.propertiesService.unsaveProperty(user.id, id);
  }

  @Get('saved')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить сохраненные объекты' })
  getSavedProperties(@CurrentUser() user: any) {
    return this.propertiesService.getSavedProperties(user.id);
  }

  // Property Analytics
  @Post(':id/view')
  @ApiOperation({ summary: 'Track property view' })
  async trackView(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() metadata: { duration?: number; source?: string },
    @Req() req: any,
  ) {
    return this.analyticsService.trackView(id, user?.id, {
      ...metadata,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Get(':id/analytics')
  @ApiOperation({ summary: 'Get property analytics' })
  getPropertyAnalytics(@Param('id') id: string) {
    return this.analyticsService.getPropertyAnalytics(id);
  }

  @Get(':id/comparables')
  @ApiOperation({ summary: 'Get market comparables' })
  getMarketComparables(@Param('id') id: string) {
    return this.analyticsService.getMarketComparables(id);
  }

  // Property Documents
  @Get(':id/documents')
  @ApiOperation({ summary: 'Get property documents' })
  getPropertyDocuments(@Param('id') id: string, @CurrentUser() user: any) {
    return this.documentsService.getPropertyDocuments(id, user?.role);
  }

  @Post(':id/documents')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload property document' })
  uploadDocument(
    @Param('id') id: string,
    @Body() data: { type: string; title: string; url: string; fileSize?: number; mimeType?: string },
    @CurrentUser() user: any,
  ) {
    return this.documentsService.uploadDocument(
      id,
      data.type,
      data.title,
      data.url,
      data.fileSize,
      data.mimeType,
      user.id,
    );
  }

  @Get('documents/:docId')
  @ApiOperation({ summary: 'Get document details' })
  getDocument(@Param('docId') docId: string, @CurrentUser() user: any) {
    return this.documentsService.getDocument(docId, user?.role);
  }

  @Delete('documents/:docId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete document' })
  deleteDocument(@Param('docId') docId: string) {
    return this.documentsService.deleteDocument(docId);
  }

  // Property Comparison
  @Post('compare')
  @ApiOperation({ summary: 'Compare properties' })
  compareProperties(@Body() data: { propertyIds: string[] }) {
    return this.comparisonService.compareProperties(data.propertyIds);
  }

  @Get('comparisons')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user comparisons' })
  getUserComparisons(@CurrentUser() user: any) {
    return this.comparisonService.getUserComparisons(user.id);
  }

  @Post('comparisons')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create comparison' })
  createComparison(
    @CurrentUser() user: any,
    @Body() data: { name: string; propertyIds: string[] },
  ) {
    return this.comparisonService.createComparison(user.id, data.name, data.propertyIds);
  }

  @Get('comparisons/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get comparison details' })
  getComparisonDetails(@CurrentUser() user: any, @Param('id') id: string) {
    return this.comparisonService.getComparisonDetails(user.id, id);
  }

  @Delete('comparisons/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete comparison' })
  deleteComparison(@CurrentUser() user: any, @Param('id') id: string) {
    return this.comparisonService.deleteComparison(user.id, id);
  }
}
