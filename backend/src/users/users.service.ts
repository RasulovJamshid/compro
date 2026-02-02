import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateProfile(userId: string, updateData: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }
}
