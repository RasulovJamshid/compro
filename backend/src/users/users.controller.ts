import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  getProfile(@CurrentUser() user: any) {
    // Add computed fields for frontend compatibility
    return {
      ...user,
      isPremium: user.role === 'premium' || user.role === 'admin' || user.role === 'moderator',
      isAdmin: user.role === 'admin',
    };
  }

  @Put('me')
  @ApiOperation({ summary: 'Обновить профиль' })
  updateProfile(@CurrentUser() user: any, @Body() updateData: any) {
    return this.usersService.updateProfile(user.id, updateData);
  }
}
