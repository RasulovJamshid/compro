import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface PropertyFilters {
  dealType?: string;
  propertyType?: string;
  city?: string;
  district?: string;
  minArea?: number;
  maxArea?: number;
  minPrice?: number;
  maxPrice?: number;
  hasCommission?: boolean;
  hasVideo?: boolean;
  hasTour360?: boolean;
  isVerified?: boolean;
  isTop?: boolean;
}

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: PropertyFilters, page = 1, limit = 20) {
    const where: any = {
      status: 'active',
    };

    if (filters.dealType) where.dealType = filters.dealType;
    if (filters.propertyType) where.propertyType = filters.propertyType;
    if (filters.city) where.city = filters.city;
    if (filters.district) where.district = filters.district;
    if (filters.hasCommission !== undefined) where.hasCommission = filters.hasCommission;
    if (filters.hasVideo !== undefined) where.hasVideo = filters.hasVideo;
    if (filters.hasTour360 !== undefined) where.hasTour360 = filters.hasTour360;
    if (filters.isVerified !== undefined) where.isVerified = filters.isVerified;
    if (filters.isTop !== undefined) where.isTop = filters.isTop;

    if (filters.minArea || filters.maxArea) {
      where.area = {};
      if (filters.minArea) where.area.gte = filters.minArea;
      if (filters.maxArea) where.area.lte = filters.maxArea;
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        include: {
          images: { orderBy: { order: 'asc' } },
          videos: true,
        },
        orderBy: [
          { isTop: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      data: properties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        videos: true,
      },
    });

    if (property) {
      // Increment view count
      await this.prisma.property.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return property;
  }

  async saveProperty(userId: string, propertyId: string) {
    // Check if already saved
    const existing = await this.prisma.savedProperty.findFirst({
      where: {
        userId,
        propertyId,
      },
    });

    if (existing) {
      return existing;
    }

    // Create new saved property
    return this.prisma.savedProperty.create({
      data: {
        userId,
        propertyId,
      },
    });
  }

  async unsaveProperty(userId: string, propertyId: string) {
    return this.prisma.savedProperty.deleteMany({
      where: {
        userId,
        propertyId,
      },
    });
  }

  async getSavedProperties(userId: string) {
    const saved = await this.prisma.savedProperty.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            images: { orderBy: { order: 'asc' }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return saved.map(s => s.property);
  }
}
