import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('properties')
  @ApiOperation({ summary: 'Создать объект (только админ)' })
  createProperty(@Body() data: any) {
    return this.adminService.createProperty(data);
  }

  @Put('properties/:id')
  @ApiOperation({ summary: 'Обновить объект (только админ)' })
  updateProperty(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateProperty(id, data);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Получить статистику' })
  getStatistics() {
    return this.adminService.getStats();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Получить детальную статистику для dashboard' })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Получить аналитику' })
  getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('users')
  @ApiOperation({ summary: 'Получить всех пользователей' })
  getAllUsers(
    @Query('role') role?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pagination = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    };
    return this.adminService.getAllUsers(role, pagination);
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Изменить роль пользователя' })
  updateUserRole(@Param('id') id: string, @Body() data: { role: string }) {
    return this.adminService.updateUserRole(id, data.role);
  }

  @Patch('properties/:id/status')
  @ApiOperation({ summary: 'Изменить статус объекта' })
  updatePropertyStatus(@Param('id') id: string, @Body() data: { status: string }) {
    return this.adminService.updatePropertyStatus(id, data.status);
  }

  @Delete('properties/:id')
  @ApiOperation({ summary: 'Удалить объект' })
  deletePropertyById(@Param('id') id: string) {
    return this.adminService.deleteProperty(id);
  }

  // ==================== REVIEWS ====================

  @Get('reviews')
  @ApiOperation({ summary: 'Получить все отзывы' })
  getReviews(
    @Query('status') status?: string,
    @Query('rating') rating?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (rating) filters.rating = parseInt(rating);
    const pagination = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    };
    return this.adminService.getReviews(filters, pagination);
  }

  @Get('reviews/stats')
  @ApiOperation({ summary: 'Получить статистику отзывов' })
  getReviewStats() {
    return this.adminService.getReviewStats();
  }

  @Patch('reviews/:id/approve')
  @ApiOperation({ summary: 'Одобрить отзыв' })
  approveReview(@Param('id') id: string, @Body() data: { moderatorId: string }) {
    return this.adminService.approveReview(id, data.moderatorId);
  }

  @Patch('reviews/:id/reject')
  @ApiOperation({ summary: 'Отклонить отзыв' })
  rejectReview(@Param('id') id: string, @Body() data: { moderatorId: string }) {
    return this.adminService.rejectReview(id, data.moderatorId);
  }

  @Delete('reviews/:id')
  @ApiOperation({ summary: 'Удалить отзыв' })
  deleteReview(@Param('id') id: string) {
    return this.adminService.deleteReview(id);
  }

  // ==================== TRANSACTIONS/PAYMENTS ====================

  @Get('transactions')
  @ApiOperation({ summary: 'Получить все транзакции' })
  getTransactions(
    @Query('status') status?: string,
    @Query('method') method?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (method) filters.method = method;
    const pagination = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    };
    return this.adminService.getTransactions(filters, pagination);
  }

  @Get('transactions/stats')
  @ApiOperation({ summary: 'Получить статистику транзакций' })
  getTransactionStats() {
    return this.adminService.getTransactionStats();
  }

  // ==================== REPORTS ====================

  @Post('reports/properties')
  @ApiOperation({ summary: 'Генерировать отчет по объектам' })
  generatePropertiesReport(@Body() data: { startDate: string; endDate: string }) {
    const dateRange = {
      start: new Date(data.startDate),
      end: new Date(data.endDate),
    };
    return this.adminService.generatePropertiesReport(dateRange);
  }

  @Post('reports/users')
  @ApiOperation({ summary: 'Генерировать отчет по пользователям' })
  generateUsersReport(@Body() data: { startDate: string; endDate: string }) {
    const dateRange = {
      start: new Date(data.startDate),
      end: new Date(data.endDate),
    };
    return this.adminService.generateUsersReport(dateRange);
  }

  @Post('reports/revenue')
  @ApiOperation({ summary: 'Генерировать финансовый отчет' })
  generateRevenueReport(@Body() data: { startDate: string; endDate: string }) {
    const dateRange = {
      start: new Date(data.startDate),
      end: new Date(data.endDate),
    };
    return this.adminService.generateRevenueReport(dateRange);
  }

  // ==================== SETTINGS ====================

  @Get('settings')
  @ApiOperation({ summary: 'Получить все настройки' })
  getSettings(@Query('category') category?: string) {
    return this.adminService.getSettings(category);
  }

  @Get('settings/:key')
  @ApiOperation({ summary: 'Получить настройку по ключу' })
  getSetting(@Param('key') key: string) {
    return this.adminService.getSetting(key);
  }

  @Put('settings/:key')
  @ApiOperation({ summary: 'Обновить настройку' })
  updateSetting(
    @Param('key') key: string,
    @Body() data: { value: any; updatedBy?: string }
  ) {
    return this.adminService.updateSetting(key, data.value, data.updatedBy);
  }

  @Put('settings')
  @ApiOperation({ summary: 'Обновить несколько настроек' })
  updateSettings(@Body() data: { settings: Array<{ key: string; value: any }>; updatedBy?: string }) {
    return this.adminService.updateSettings(data.settings, data.updatedBy);
  }
}
