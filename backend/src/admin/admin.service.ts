import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createProperty(propertyData: any) {
    const { images, videos, ...propertyFields } = propertyData;

    // Create property with images and videos
    const property = await this.prisma.property.create({
      data: {
        ...propertyFields,
        images: images && images.length > 0 ? {
          create: images.map((img: any, index: number) => ({
            url: img.url,
            thumbnailUrl: img.thumbnailUrl || img.url,
            watermarkedUrl: img.watermarkedUrl,
            isCover: img.isCover || index === 0,
            order: img.order !== undefined ? img.order : index,
          })),
        } : undefined,
        videos: videos && videos.length > 0 ? {
          create: videos.map((vid: any) => ({
            url: vid.url,
            thumbnailUrl: vid.thumbnailUrl,
            title: vid.title || 'Property Video',
            duration: vid.duration || 0,
          })),
        } : undefined,
      },
      include: {
        images: true,
        videos: true,
      },
    });

    return property;
  }

  async updateProperty(id: string, propertyData: any) {
    const { images, videos, ...propertyFields } = propertyData;

    // Delete existing images and videos if new ones are provided
    if (images !== undefined) {
      await this.prisma.propertyImage.deleteMany({
        where: { propertyId: id },
      });
    }

    if (videos !== undefined) {
      await this.prisma.propertyVideo.deleteMany({
        where: { propertyId: id },
      });
    }

    // Update property with new data
    const property = await this.prisma.property.update({
      where: { id },
      data: {
        ...propertyFields,
        images: images && images.length > 0 ? {
          create: images.map((img: any, index: number) => ({
            url: img.url,
            thumbnailUrl: img.thumbnailUrl || img.url,
            watermarkedUrl: img.watermarkedUrl,
            isCover: img.isCover || index === 0,
            order: img.order !== undefined ? img.order : index,
          })),
        } : undefined,
        videos: videos && videos.length > 0 ? {
          create: videos.map((vid: any) => ({
            url: vid.url,
            thumbnailUrl: vid.thumbnailUrl,
            title: vid.title || 'Property Video',
            duration: vid.duration || 0,
          })),
        } : undefined,
      },
      include: {
        images: true,
        videos: true,
      },
    });

    return property;
  }

  async deleteProperty(id: string) {
    return this.prisma.property.delete({
      where: { id },
    });
  }

  async getStats() {
    const [
      totalProperties,
      activeProperties,
      totalUsers,
      premiumUsers,
      totalSubscriptions,
    ] = await Promise.all([
      this.prisma.property.count(),
      this.prisma.property.count({ where: { status: 'active' } }),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'premium' } }),
      this.prisma.subscription.count({ where: { status: 'active' } }),
    ]);

    return {
      totalProperties,
      activeProperties,
      totalUsers,
      premiumUsers,
      totalSubscriptions,
    };
  }

  async getDashboardStats() {
    const [
      totalProperties,
      activeProperties,
      pendingProperties,
      inactiveProperties,
      totalUsers,
      totalViews,
      verifiedProperties,
      topProperties,
    ] = await Promise.all([
      this.prisma.property.count(),
      this.prisma.property.count({ where: { status: 'active' } }),
      this.prisma.property.count({ where: { status: 'pending' } }),
      this.prisma.property.count({ where: { status: 'inactive' } }),
      this.prisma.user.count(),
      this.prisma.property.aggregate({ _sum: { viewCount: true } }),
      this.prisma.property.count({ where: { isVerified: true } }),
      this.prisma.property.count({ where: { isTop: true } }),
    ]);

    return {
      totalProperties,
      activeProperties,
      pendingProperties,
      rejectedProperties: inactiveProperties, // For backward compatibility
      totalUsers,
      totalViews: totalViews._sum.viewCount || 0,
      verifiedProperties,
      topProperties,
      totalRevenue: 0, // TODO: Calculate from subscriptions
    };
  }

  async getAnalytics() {
    // Get properties by city
    const propertiesByCity = await this.prisma.property.groupBy({
      by: ['city'],
      _count: true,
      orderBy: { _count: { city: 'desc' } },
      take: 10,
    });

    // Get top viewed properties
    const topProperties = await this.prisma.property.findMany({
      select: {
        id: true,
        title: true,
        viewCount: true,
      },
      orderBy: { viewCount: 'desc' },
      take: 10,
    });

    // Get user growth (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newUsersLastWeek = await this.prisma.user.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
    });

    const newPropertiesLastWeek = await this.prisma.property.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
    });

    return {
      viewsToday: 0, // TODO: Implement daily tracking
      viewsYesterday: 0,
      viewsThisWeek: 0,
      viewsLastWeek: 0,
      newPropertiesThisWeek: newPropertiesLastWeek,
      newPropertiesLastWeek: 0, // TODO: Implement weekly comparison
      newUsersThisWeek: newUsersLastWeek,
      newUsersLastWeek: 0,
      revenueThisMonth: 0,
      revenueLastMonth: 0,
      topProperties: topProperties.map(p => ({
        id: p.id,
        title: p.title,
        views: p.viewCount,
      })),
      topCities: propertiesByCity.map(c => ({
        city: c.city,
        count: c._count,
      })),
    };
  }

  async getAllUsers(role?: string, pagination?: { page: number; limit: number }) {
    const where: any = {};
    if (role) {
      where.role = role;
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          phone: true,
          role: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserRole(userId: string, role: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
    });
  }

  async updatePropertyStatus(propertyId: string, status: string) {
    return this.prisma.property.update({
      where: { id: propertyId },
      data: { status: status as any },
    });
  }

  // ==================== REVIEWS ====================
  
  async getReviews(filters?: { status?: string; rating?: number }, pagination?: { page: number; limit: number }) {
    const where: any = {};
    
    if (filters?.status && filters.status !== 'all') {
      where.status = filters.status;
    }
    
    if (filters?.rating) {
      where.rating = filters.rating;
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              title: true,
            },
          },
          user: {
            select: {
              id: true,
              phone: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where }),
    ]);

    // Transform to match expected format
    const data = reviews.map(review => ({
      id: review.id,
      propertyId: review.propertyId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
      status: review.status,
      moderatedBy: review.moderatedBy,
      moderatedAt: review.moderatedAt,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      propertyTitle: review.property?.title || 'N/A',
      userPhone: review.user?.phone || 'N/A',
      userFirstName: review.user?.firstName || '',
      userLastName: review.user?.lastName || '',
      userName: `${review.user?.firstName || ''} ${review.user?.lastName || ''}`.trim() || 'Аноним',
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getReviewStats() {
    const [total, pending, approved, rejected, avgRating] = await Promise.all([
      this.prisma.review.count(),
      this.prisma.review.count({ where: { status: 'pending' } }),
      this.prisma.review.count({ where: { status: 'approved' } }),
      this.prisma.review.count({ where: { status: 'rejected' } }),
      this.prisma.review.aggregate({ _avg: { rating: true } }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
      averageRating: avgRating._avg.rating || 0,
    };
  }

  async approveReview(reviewId: string, moderatorId: string) {
    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        status: 'approved',
        moderatedBy: moderatorId,
        moderatedAt: new Date(),
      },
    });
  }

  async rejectReview(reviewId: string, moderatorId: string) {
    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        status: 'rejected',
        moderatedBy: moderatorId,
        moderatedAt: new Date(),
      },
    });
  }

  async deleteReview(reviewId: string) {
    return this.prisma.review.delete({
      where: { id: reviewId },
    });
  }

  // ==================== TRANSACTIONS/PAYMENTS ====================
  
  async getTransactions(filters?: { status?: string; method?: string }, pagination?: { page: number; limit: number }) {
    const where: any = {};
    
    if (filters?.status && filters.status !== 'all') {
      where.status = filters.status;
    }
    
    if (filters?.method && filters.method !== 'all') {
      where.paymentMethod = filters.method;
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              phone: true,
              firstName: true,
              lastName: true,
            },
          },
          subscription: {
            include: {
              plan: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    // Transform to match expected format
    const data = transactions.map(transaction => ({
      id: transaction.id,
      userId: transaction.userId,
      subscriptionId: transaction.subscriptionId,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      transactionId: transaction.transactionId,
      description: transaction.description,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      userName: `${transaction.user?.firstName || ''} ${transaction.user?.lastName || ''}`.trim() || 'Аноним',
      userPhone: transaction.user?.phone || 'N/A',
      plan: transaction.subscription?.plan?.name || 'N/A',
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionStats() {
    const [total, completed, pending, failed] = await Promise.all([
      this.prisma.transaction.aggregate({ _sum: { amount: true } }),
      this.prisma.transaction.aggregate({
        where: { status: 'completed' },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.transaction.count({ where: { status: 'pending' } }),
      this.prisma.transaction.count({ where: { status: 'failed' } }),
    ]);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const lastMonth = new Date(thisMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [thisMonthRevenue, lastMonthRevenue] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: {
          status: 'completed',
          createdAt: { gte: thisMonth },
        },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: {
          status: 'completed',
          createdAt: { gte: lastMonth, lt: thisMonth },
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalRevenue: total._sum.amount || 0,
      completedRevenue: completed._sum.amount || 0,
      completedCount: completed._count,
      pendingCount: pending,
      failedCount: failed,
      thisMonthRevenue: thisMonthRevenue._sum.amount || 0,
      lastMonthRevenue: lastMonthRevenue._sum.amount || 0,
    };
  }

  // ==================== REPORTS ====================
  
  async generatePropertiesReport(dateRange: { start: Date; end: Date }) {
    const [total, active, sold, rented, pending] = await Promise.all([
      this.prisma.property.count({
        where: { createdAt: { gte: dateRange.start, lte: dateRange.end } },
      }),
      this.prisma.property.count({
        where: {
          status: 'active',
          createdAt: { gte: dateRange.start, lte: dateRange.end },
        },
      }),
      this.prisma.property.count({
        where: {
          status: 'sold',
          createdAt: { gte: dateRange.start, lte: dateRange.end },
        },
      }),
      this.prisma.property.count({
        where: {
          status: 'rented',
          createdAt: { gte: dateRange.start, lte: dateRange.end },
        },
      }),
      this.prisma.property.count({
        where: {
          status: 'pending',
          createdAt: { gte: dateRange.start, lte: dateRange.end },
        },
      }),
    ]);

    return { total, active, sold, rented, pending };
  }

  async generateUsersReport(dateRange: { start: Date; end: Date }) {
    const [total, newUsers, premium, free] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: { createdAt: { gte: dateRange.start, lte: dateRange.end } },
      }),
      this.prisma.user.count({ where: { role: 'premium' } }),
      this.prisma.user.count({ where: { role: 'free' } }),
    ]);

    return { total, newUsers, premium, free };
  }

  async generateRevenueReport(dateRange: { start: Date; end: Date }) {
    const revenue = await this.prisma.transaction.aggregate({
      where: {
        status: 'completed',
        createdAt: { gte: dateRange.start, lte: dateRange.end },
      },
      _sum: { amount: true },
      _avg: { amount: true },
      _count: true,
    });

    const subscriptions = await this.prisma.subscription.count({
      where: {
        status: 'active',
        createdAt: { gte: dateRange.start, lte: dateRange.end },
      },
    });

    return {
      totalRevenue: revenue._sum.amount || 0,
      averageTransaction: revenue._avg.amount || 0,
      transactionCount: revenue._count,
      activeSubscriptions: subscriptions,
    };
  }

  // ==================== SETTINGS ====================
  
  async getSettings(category?: string) {
    const where = category ? { category } : {};
    return this.prisma.systemSettings.findMany({ where });
  }

  async getSetting(key: string) {
    return this.prisma.systemSettings.findUnique({ where: { key } });
  }

  async updateSetting(key: string, value: any, updatedBy?: string) {
    return this.prisma.systemSettings.upsert({
      where: { key },
      update: {
        value,
        updatedBy,
        updatedAt: new Date(),
      },
      create: {
        key,
        value,
        category: this.getCategoryFromKey(key),
        updatedBy,
      },
    });
  }

  async updateSettings(settings: Array<{ key: string; value: any }>, updatedBy?: string) {
    const updates = settings.map(({ key, value }) =>
      this.prisma.systemSettings.upsert({
        where: { key },
        update: {
          value,
          updatedBy,
          updatedAt: new Date(),
        },
        create: {
          key,
          value,
          category: this.getCategoryFromKey(key),
          updatedBy,
        },
      })
    );

    return Promise.all(updates);
  }

  private getCategoryFromKey(key: string): string {
    if (key.startsWith('general_')) return 'general';
    if (key.startsWith('notification_')) return 'notifications';
    if (key.startsWith('security_')) return 'security';
    if (key.startsWith('property_')) return 'properties';
    if (key.startsWith('payment_')) return 'payments';
    return 'general';
  }
}
