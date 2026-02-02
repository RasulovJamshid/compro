import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PropertyAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackView(propertyId: string, userId?: string, metadata?: {
    duration?: number;
    source?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    // Create view record
    await this.prisma.propertyView.create({
      data: {
        propertyId,
        userId,
        duration: metadata?.duration,
        source: metadata?.source,
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
      },
    });

    // Increment view count
    await this.prisma.property.update({
      where: { id: propertyId },
      data: { viewCount: { increment: 1 } },
    });
  }

  async getPropertyAnalytics(propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        views: {
          orderBy: { viewedAt: 'desc' },
          take: 100,
        },
        priceHistory: {
          orderBy: { changedAt: 'desc' },
        },
        inquiries: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Calculate analytics
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recentViews = property.views.filter(v => v.viewedAt >= last30Days);
    const uniqueViewers = new Set(property.views.filter(v => v.userId).map(v => v.userId)).size;
    const avgDuration = property.views
      .filter(v => v.duration)
      .reduce((sum, v) => sum + (v.duration || 0), 0) / property.views.filter(v => v.duration).length || 0;

    // Views by source
    const viewsBySource = property.views.reduce((acc, view) => {
      const source = view.source || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Views over time (last 30 days)
    const viewsOverTime = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = property.views.filter(v => 
        v.viewedAt >= date && v.viewedAt < nextDate
      ).length;
      
      return {
        date: date.toISOString().split('T')[0],
        views: count,
      };
    });

    return {
      propertyId: property.id,
      totalViews: property.viewCount,
      uniqueViewers,
      recentViews: recentViews.length,
      avgViewDuration: Math.round(avgDuration),
      inquiryCount: property.inquiryCount,
      shareCount: property.shareCount,
      conversionRate: property.viewCount > 0 ? (property.inquiryCount / property.viewCount * 100).toFixed(2) : 0,
      
      viewsBySource,
      viewsOverTime,
      
      priceHistory: property.priceHistory.map(ph => ({
        price: ph.price,
        pricePerMonth: ph.pricePerMonth,
        pricePerSqm: ph.pricePerSqm,
        changedAt: ph.changedAt,
        reason: ph.reason,
      })),
      
      recentInquiries: property.inquiries.slice(0, 10).map(inq => ({
        id: inq.id,
        status: inq.status,
        createdAt: inq.createdAt,
      })),
    };
  }

  async getMarketComparables(propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Find similar properties
    const comparables = await this.prisma.property.findMany({
      where: {
        id: { not: propertyId },
        propertyType: property.propertyType,
        dealType: property.dealType,
        city: property.city,
        status: 'active',
        area: {
          gte: property.area * 0.7,
          lte: property.area * 1.3,
        },
      },
      include: {
        images: {
          where: { isCover: true },
          take: 1,
        },
      },
      take: 6,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate market statistics
    const allSimilar = await this.prisma.property.findMany({
      where: {
        propertyType: property.propertyType,
        dealType: property.dealType,
        city: property.city,
        district: property.district,
        status: 'active',
      },
    });

    const avgPrice = allSimilar.reduce((sum, p) => sum + p.price, 0) / allSimilar.length;
    const avgPricePerSqm = allSimilar
      .filter(p => p.pricePerSqm)
      .reduce((sum, p) => sum + (p.pricePerSqm || 0), 0) / allSimilar.filter(p => p.pricePerSqm).length;

    return {
      comparables: comparables.map(c => ({
        id: c.id,
        title: c.title,
        area: c.area,
        price: c.price,
        pricePerSqm: c.pricePerSqm,
        district: c.district,
        yearBuilt: c.yearBuilt,
        buildingClass: c.buildingClass,
        coverImage: c.images[0]?.url,
      })),
      
      marketStats: {
        totalListings: allSimilar.length,
        avgPrice: Math.round(avgPrice),
        avgPricePerSqm: Math.round(avgPricePerSqm),
        pricePosition: property.price < avgPrice ? 'below' : property.price > avgPrice ? 'above' : 'average',
        priceDifference: Math.round(((property.price - avgPrice) / avgPrice) * 100),
      },
    };
  }

  async trackPriceChange(propertyId: string, newPrice: number, newPricePerMonth?: number, reason?: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Only create history if price actually changed
    if (property.price !== newPrice || property.pricePerMonth !== newPricePerMonth) {
      await this.prisma.priceHistory.create({
        data: {
          propertyId,
          price: newPrice,
          pricePerMonth: newPricePerMonth,
          pricePerSqm: newPrice / property.area,
          reason,
        },
      });
    }
  }
}
