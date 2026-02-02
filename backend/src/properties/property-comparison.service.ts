import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PropertyComparisonService {
  constructor(private prisma: PrismaService) {}

  async createComparison(userId: string, name: string, propertyIds: string[]) {
    if (propertyIds.length < 2 || propertyIds.length > 4) {
      throw new BadRequestException('You can compare between 2 and 4 properties');
    }

    // Verify all properties exist
    const properties = await this.prisma.property.findMany({
      where: { id: { in: propertyIds } },
    });

    if (properties.length !== propertyIds.length) {
      throw new NotFoundException('One or more properties not found');
    }

    return this.prisma.propertyComparison.create({
      data: {
        userId,
        name,
        propertyIds,
      },
    });
  }

  async getUserComparisons(userId: string) {
    return this.prisma.propertyComparison.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getComparisonDetails(userId: string, comparisonId: string) {
    const comparison = await this.prisma.propertyComparison.findFirst({
      where: { id: comparisonId, userId },
    });

    if (!comparison) {
      throw new NotFoundException('Comparison not found');
    }

    const properties = await this.prisma.property.findMany({
      where: { id: { in: comparison.propertyIds } },
      include: {
        images: {
          where: { isCover: true },
          take: 1,
        },
      },
    });

    return {
      ...comparison,
      properties,
    };
  }

  async updateComparison(userId: string, comparisonId: string, data: { name?: string; propertyIds?: string[]; notes?: string }) {
    const comparison = await this.prisma.propertyComparison.findFirst({
      where: { id: comparisonId, userId },
    });

    if (!comparison) {
      throw new NotFoundException('Comparison not found');
    }

    if (data.propertyIds && (data.propertyIds.length < 2 || data.propertyIds.length > 4)) {
      throw new BadRequestException('You can compare between 2 and 4 properties');
    }

    return this.prisma.propertyComparison.update({
      where: { id: comparisonId },
      data,
    });
  }

  async deleteComparison(userId: string, comparisonId: string) {
    const comparison = await this.prisma.propertyComparison.findFirst({
      where: { id: comparisonId, userId },
    });

    if (!comparison) {
      throw new NotFoundException('Comparison not found');
    }

    return this.prisma.propertyComparison.delete({
      where: { id: comparisonId },
    });
  }

  async compareProperties(propertyIds: string[]) {
    if (propertyIds.length < 2 || propertyIds.length > 4) {
      throw new BadRequestException('You can compare between 2 and 4 properties');
    }

    const properties = await this.prisma.property.findMany({
      where: { id: { in: propertyIds } },
      include: {
        images: {
          where: { isCover: true },
          take: 1,
        },
        priceHistory: {
          orderBy: { changedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (properties.length !== propertyIds.length) {
      throw new NotFoundException('One or more properties not found');
    }

    // Calculate comparison metrics
    const comparison = {
      properties: properties.map(p => ({
        id: p.id,
        title: p.title,
        propertyType: p.propertyType,
        dealType: p.dealType,
        
        // Location
        city: p.city,
        district: p.district,
        address: p.address,
        
        // Size & Price
        area: p.area,
        price: p.price,
        pricePerMonth: p.pricePerMonth,
        pricePerSqm: p.pricePerSqm,
        
        // Building
        floor: p.floor,
        totalFloors: p.totalFloors,
        yearBuilt: p.yearBuilt,
        yearRenovated: p.yearRenovated,
        buildingClass: p.buildingClass,
        
        // Amenities
        parkingSpaces: p.parkingSpaces,
        hasParking: p.hasParking,
        loadingDocks: p.loadingDocks,
        ceilingHeight: p.ceilingHeight,
        hvacType: p.hvacType,
        
        // Financial
        operatingExpenses: p.operatingExpenses,
        propertyTax: p.propertyTax,
        maintenanceFee: p.maintenanceFee,
        occupancyRate: p.occupancyRate,
        
        // Media
        hasVideo: p.hasVideo,
        hasTour360: p.hasTour360,
        coverImage: p.images[0]?.url,
        
        // Status
        isVerified: p.isVerified,
        status: p.status,
        
        // Stats
        viewCount: p.viewCount,
        inquiryCount: p.inquiryCount,
        
        // Price history
        priceHistory: p.priceHistory,
      })),
      
      // Comparison summary
      summary: {
        avgPrice: properties.reduce((sum, p) => sum + p.price, 0) / properties.length,
        avgPricePerSqm: properties.filter(p => p.pricePerSqm).reduce((sum, p) => sum + (p.pricePerSqm || 0), 0) / properties.filter(p => p.pricePerSqm).length,
        avgArea: properties.reduce((sum, p) => sum + p.area, 0) / properties.length,
        lowestPrice: Math.min(...properties.map(p => p.price)),
        highestPrice: Math.max(...properties.map(p => p.price)),
      },
    };

    return comparison;
  }
}
