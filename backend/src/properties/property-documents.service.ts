import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PropertyDocumentsService {
  constructor(private prisma: PrismaService) {}

  async uploadDocument(
    propertyId: string,
    type: string,
    title: string,
    url: string,
    fileSize?: number,
    mimeType?: string,
    uploadedBy?: string,
  ) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return this.prisma.propertyDocument.create({
      data: {
        propertyId,
        type,
        title,
        url,
        fileSize,
        mimeType,
        uploadedBy,
      },
    });
  }

  async getPropertyDocuments(propertyId: string, userRole?: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const documents = await this.prisma.propertyDocument.findMany({
      where: { propertyId },
      orderBy: { uploadedAt: 'desc' },
    });

    // Group documents by type
    const grouped = documents.reduce((acc, doc) => {
      if (!acc[doc.type]) {
        acc[doc.type] = [];
      }
      acc[doc.type].push({
        id: doc.id,
        title: doc.title,
        url: doc.url,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        uploadedAt: doc.uploadedAt,
        // Hide URL for non-premium users on certain document types
        isRestricted: this.isDocumentRestricted(doc.type, userRole),
      });
      return acc;
    }, {} as Record<string, any[]>);

    return {
      total: documents.length,
      byType: grouped,
      documents: documents.map(doc => ({
        ...doc,
        isRestricted: this.isDocumentRestricted(doc.type, userRole),
      })),
    };
  }

  async getDocument(documentId: string, userRole?: string) {
    const document = await this.prisma.propertyDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Check if user has access
    if (this.isDocumentRestricted(document.type, userRole)) {
      throw new ForbiddenException('Premium subscription required to access this document');
    }

    return document;
  }

  async deleteDocument(documentId: string) {
    const document = await this.prisma.propertyDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return this.prisma.propertyDocument.delete({
      where: { id: documentId },
    });
  }

  private isDocumentRestricted(documentType: string, userRole?: string): boolean {
    // Premium-only document types
    const restrictedTypes = ['floor_plan', 'site_plan', 'zoning', 'inspection', 'financial'];
    
    if (!restrictedTypes.includes(documentType)) {
      return false;
    }

    // Allow access for premium, moderator, and admin users
    const allowedRoles = ['premium', 'moderator', 'admin'];
    return !userRole || !allowedRoles.includes(userRole);
  }

  async getDocumentTypes() {
    return [
      { value: 'brochure', label: 'Brochure', restricted: false },
      { value: 'floor_plan', label: 'Floor Plan', restricted: true },
      { value: 'site_plan', label: 'Site Plan', restricted: true },
      { value: 'zoning', label: 'Zoning Document', restricted: true },
      { value: 'permit', label: 'Building Permit', restricted: false },
      { value: 'inspection', label: 'Inspection Report', restricted: true },
      { value: 'financial', label: 'Financial Statement', restricted: true },
      { value: 'lease', label: 'Lease Agreement', restricted: false },
      { value: 'other', label: 'Other', restricted: false },
    ];
  }
}
