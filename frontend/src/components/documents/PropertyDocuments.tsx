'use client';

import { useEffect, useState } from 'react';
import { documentsApi, PropertyDocument, DocumentsByType } from '@/lib/api/documents';
import { FileText, Download, Lock, Upload, X } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';

interface PropertyDocumentsProps {
  propertyId: string;
}

export default function PropertyDocuments({ propertyId }: PropertyDocumentsProps) {
  const { user } = useAuthStore();
  const [documents, setDocuments] = useState<DocumentsByType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [propertyId]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await documentsApi.getPropertyDocuments(propertyId);
      setDocuments(data);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: PropertyDocument) => {
    if (doc.isRestricted && user?.role !== 'premium' && user?.role !== 'admin') {
      alert('Premium subscription required to access this document');
      return;
    }

    try {
      const document = await documentsApi.getDocument(doc.id);
      window.open(document.url, '_blank');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to download document');
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentsApi.deleteDocument(docId);
      loadDocuments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete document');
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';
  const isPremium = user?.role === 'premium' || user?.role === 'admin' || user?.role === 'moderator';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!documents || documents.total === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">No documents available</p>
        {isAdmin && (
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upload Document
          </button>
        )}
      </div>
    );
  }

  const documentTypes = documentsApi.getDocumentTypes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Property Documents</h3>
          <p className="text-sm text-gray-600">{documents.total} documents available</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        )}
      </div>

      {/* Premium Upgrade Banner */}
      {!isPremium && Object.keys(documents.byType).some(type => 
        documentTypes.find(dt => dt.value === type)?.restricted
      ) && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                Unlock Premium Documents
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Get access to floor plans, site plans, financial statements, and more with a premium subscription.
              </p>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Upgrade to Premium
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Documents by Type */}
      {Object.entries(documents.byType).map(([type, docs]) => {
        const typeInfo = documentTypes.find(dt => dt.value === type);
        const isRestricted = typeInfo?.restricted && !isPremium;

        return (
          <div key={type} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold">{typeInfo?.label || type}</h4>
              {typeInfo?.restricted && (
                <Lock className="w-4 h-4 text-gray-400" />
              )}
              <span className="ml-auto text-sm text-gray-500">
                {docs.length} {docs.length === 1 ? 'file' : 'files'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {docs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  isRestricted={!!isRestricted}
                  onDownload={handleDownload}
                  onDelete={isAdmin ? handleDelete : undefined}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          propertyId={propertyId}
          onClose={() => setShowUpload(false)}
          onSuccess={() => {
            setShowUpload(false);
            loadDocuments();
          }}
        />
      )}
    </div>
  );
}

interface DocumentCardProps {
  document: PropertyDocument;
  isRestricted: boolean;
  onDownload: (doc: PropertyDocument) => void;
  onDelete?: (docId: string) => void;
}

function DocumentCard({ document, isRestricted, onDownload, onDelete }: DocumentCardProps) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`border rounded-lg p-4 ${isRestricted ? 'opacity-60' : 'hover:shadow-md'} transition-shadow`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-50 rounded">
          {isRestricted ? (
            <Lock className="w-5 h-5 text-blue-600" />
          ) : (
            <FileText className="w-5 h-5 text-blue-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-medium text-sm truncate">{document.title}</h5>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            {document.fileSize && <span>{formatFileSize(document.fileSize)}</span>}
            <span>•</span>
            <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => onDownload(document)}
              disabled={isRestricted}
              className={`flex items-center gap-1 px-3 py-1 text-xs rounded ${
                isRestricted
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {isRestricted ? <Lock className="w-3 h-3" /> : <Download className="w-3 h-3" />}
              {isRestricted ? 'Premium Only' : 'Download'}
            </button>
            {onDelete && !isRestricted && (
              <button
                onClick={() => onDelete(document.id)}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <X className="w-3 h-3" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface UploadModalProps {
  propertyId: string;
  onClose: () => void;
  onSuccess: () => void;
}

function UploadModal({ propertyId, onClose, onSuccess }: UploadModalProps) {
  const [type, setType] = useState('brochure');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const documentTypes = documentsApi.getDocumentTypes();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !url) {
      alert('Please fill in all fields');
      return;
    }

    setUploading(true);
    try {
      await documentsApi.uploadDocument(propertyId, {
        type,
        title,
        url,
      });
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Document Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {documentTypes.map((dt) => (
                <option key={dt.value} value={dt.value}>
                  {dt.label} {dt.restricted && '(Premium)'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Property Brochure 2024"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Document URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/document.pdf"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload your file to a cloud storage and paste the URL here
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
