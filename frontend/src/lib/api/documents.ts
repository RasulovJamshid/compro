import { apiClient } from './client';

export interface PropertyDocument {
  id: string;
  propertyId: string;
  type: string;
  title: string;
  url: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt: string;
  uploadedBy?: string;
  isRestricted?: boolean;
}

export interface DocumentsByType {
  total: number;
  byType: Record<string, PropertyDocument[]>;
  documents: PropertyDocument[];
}

export interface DocumentType {
  value: string;
  label: string;
  restricted: boolean;
}

export const documentsApi = {
  // Get property documents
  getPropertyDocuments: async (propertyId: string): Promise<DocumentsByType> => {
    const { data } = await apiClient.get(`/properties/${propertyId}/documents`);
    return data;
  },

  // Upload document
  uploadDocument: async (
    propertyId: string,
    document: {
      type: string;
      title: string;
      url: string;
      fileSize?: number;
      mimeType?: string;
    }
  ): Promise<PropertyDocument> => {
    const { data } = await apiClient.post(`/properties/${propertyId}/documents`, document);
    return data;
  },

  // Get document details
  getDocument: async (documentId: string): Promise<PropertyDocument> => {
    const { data } = await apiClient.get(`/properties/documents/${documentId}`);
    return data;
  },

  // Delete document
  deleteDocument: async (documentId: string): Promise<void> => {
    await apiClient.delete(`/properties/documents/${documentId}`);
  },

  // Get document types
  getDocumentTypes: (): DocumentType[] => {
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
  },
};
