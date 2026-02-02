'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { comparisonApi, ComparisonResult } from '@/lib/api/comparison';
import { 
  ArrowLeft, 
  Download, 
  Save, 
  X, 
  Check, 
  Minus,
  MapPin,
  Building2,
  Ruler,
  DollarSign,
  Calendar,
  Car,
  Zap,
  Shield,
  Eye,
  MessageSquare,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';

function ComparePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [propertyIds, setPropertyIds] = useState<string[]>([]);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveName, setSaveName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];
    if (ids.length >= 2 && ids.length <= 4) {
      setPropertyIds(ids);
      loadComparison(ids);
    } else {
      setError('Please select 2-4 properties to compare');
    }
  }, [searchParams]);

  const loadComparison = async (ids: string[]) => {
    setLoading(true);
    setError('');
    try {
      const data = await comparisonApi.compareProperties(ids);
      setComparison(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load comparison');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveComparison = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!saveName.trim()) {
      alert('Please enter a name for this comparison');
      return;
    }

    setSaving(true);
    try {
      await comparisonApi.createComparison(saveName, propertyIds);
      setShowSaveDialog(false);
      setSaveName('');
      alert('Comparison saved successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save comparison');
    } finally {
      setSaving(false);
    }
  };

  const removeProperty = (id: string) => {
    const newIds = propertyIds.filter(pid => pid !== id);
    if (newIds.length >= 2) {
      router.push(`/compare?ids=${newIds.join(',')}`);
    } else {
      router.push('/properties');
    }
  };

  const formatNumber = (num?: number) => {
    if (!num) return 'N/A';
    return new Intl.NumberFormat('uz-UZ').format(num);
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return `${formatNumber(price)} сум`;
  };

  const getBestValue = (values: (number | null | undefined)[], higher = false) => {
    const validValues = values.filter(v => v != null) as number[];
    if (validValues.length === 0) return null;
    return higher ? Math.max(...validValues) : Math.min(...validValues);
  };

  const isHighlighted = (value: number | null | undefined, bestValue: number | null, higher = false) => {
    if (!value || !bestValue) return false;
    return value === bestValue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'No comparison data'}</p>
          <Link href="/properties" className="text-blue-600 hover:underline">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const { properties, summary } = comparison;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/properties" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Property Comparison</h1>
                <p className="text-sm text-gray-600">Comparing {properties.length} properties</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSaveDialog(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Save Comparison
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Average Price</p>
            <p className="text-2xl font-bold">{formatPrice(summary.avgPrice)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Price Range</p>
            <p className="text-2xl font-bold">
              {formatNumber(summary.lowestPrice)} - {formatNumber(summary.highestPrice)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Avg Price/m²</p>
            <p className="text-2xl font-bold">{formatPrice(summary.avgPricePerSqm)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Average Area</p>
            <p className="text-2xl font-bold">{formatNumber(summary.avgArea)} m²</p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-48">
                    Property
                  </th>
                  {properties.map((property) => (
                    <th key={property.id} className="px-4 py-3 text-center relative">
                      <button
                        onClick={() => removeProperty(property.id)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="pt-6">
                        {property.coverImage && (
                          <img
                            src={property.coverImage}
                            alt={property.title}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                        )}
                        <Link
                          href={`/properties/${property.id}`}
                          className="text-sm font-semibold text-blue-600 hover:underline"
                        >
                          {property.title}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {/* Basic Info */}
                <ComparisonRow
                  label="Type"
                  icon={<Building2 className="w-4 h-4" />}
                  values={properties.map(p => p.propertyType)}
                />
                <ComparisonRow
                  label="Deal Type"
                  icon={<DollarSign className="w-4 h-4" />}
                  values={properties.map(p => p.dealType)}
                />
                <ComparisonRow
                  label="Status"
                  icon={<Check className="w-4 h-4" />}
                  values={properties.map(p => p.status)}
                />

                {/* Location */}
                <tr className="bg-gray-50">
                  <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-sm">
                    Location
                  </td>
                </tr>
                <ComparisonRow
                  label="City"
                  icon={<MapPin className="w-4 h-4" />}
                  values={properties.map(p => p.city)}
                />
                <ComparisonRow
                  label="District"
                  values={properties.map(p => p.district)}
                />
                <ComparisonRow
                  label="Address"
                  values={properties.map(p => p.address || 'N/A')}
                />

                {/* Size & Price */}
                <tr className="bg-gray-50">
                  <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-sm">
                    Size & Pricing
                  </td>
                </tr>
                <ComparisonRow
                  label="Area"
                  icon={<Ruler className="w-4 h-4" />}
                  values={properties.map(p => `${formatNumber(p.area)} m²`)}
                  numericValues={properties.map(p => p.area)}
                  highlightBest="higher"
                />
                <ComparisonRow
                  label="Price"
                  icon={<DollarSign className="w-4 h-4" />}
                  values={properties.map(p => formatPrice(p.price))}
                  numericValues={properties.map(p => p.price)}
                  highlightBest="lower"
                />
                <ComparisonRow
                  label="Price per m²"
                  values={properties.map(p => formatPrice(p.pricePerSqm))}
                  numericValues={properties.map(p => p.pricePerSqm)}
                  highlightBest="lower"
                />
                {properties.some(p => p.pricePerMonth) && (
                  <ComparisonRow
                    label="Monthly Rent"
                    values={properties.map(p => formatPrice(p.pricePerMonth))}
                    numericValues={properties.map(p => p.pricePerMonth)}
                    highlightBest="lower"
                  />
                )}

                {/* Building Details */}
                <tr className="bg-gray-50">
                  <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-sm">
                    Building Details
                  </td>
                </tr>
                <ComparisonRow
                  label="Floor"
                  values={properties.map(p => p.floor ? `${p.floor}/${p.totalFloors || '?'}` : 'N/A')}
                />
                <ComparisonRow
                  label="Year Built"
                  icon={<Calendar className="w-4 h-4" />}
                  values={properties.map(p => p.yearBuilt?.toString() || 'N/A')}
                  numericValues={properties.map(p => p.yearBuilt)}
                  highlightBest="higher"
                />
                <ComparisonRow
                  label="Building Class"
                  values={properties.map(p => p.buildingClass || 'N/A')}
                />
                <ComparisonRow
                  label="Ceiling Height"
                  values={properties.map(p => p.ceilingHeight ? `${p.ceilingHeight}m` : 'N/A')}
                  numericValues={properties.map(p => p.ceilingHeight)}
                  highlightBest="higher"
                />

                {/* Amenities */}
                <tr className="bg-gray-50">
                  <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-sm">
                    Amenities
                  </td>
                </tr>
                <ComparisonRow
                  label="Parking"
                  icon={<Car className="w-4 h-4" />}
                  values={properties.map(p => 
                    p.parkingSpaces ? `${p.parkingSpaces} spaces` : p.hasParking ? 'Yes' : 'No'
                  )}
                  booleanValues={properties.map(p => p.hasParking)}
                />
                <ComparisonRow
                  label="Loading Docks"
                  values={properties.map(p => p.loadingDocks ? `${p.loadingDocks}` : 'N/A')}
                  numericValues={properties.map(p => p.loadingDocks)}
                  highlightBest="higher"
                />
                <ComparisonRow
                  label="HVAC"
                  icon={<Zap className="w-4 h-4" />}
                  values={properties.map(p => p.hvacType || 'N/A')}
                />
                <ComparisonRow
                  label="Security"
                  icon={<Shield className="w-4 h-4" />}
                  values={properties.map(p => 
                    p.securityFeatures?.length ? p.securityFeatures.join(', ') : 'N/A'
                  )}
                />

                {/* Financial */}
                {properties.some(p => p.operatingExpenses || p.propertyTax) && (
                  <>
                    <tr className="bg-gray-50">
                      <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-sm">
                        Financial
                      </td>
                    </tr>
                    <ComparisonRow
                      label="Operating Expenses"
                      values={properties.map(p => formatPrice(p.operatingExpenses))}
                      numericValues={properties.map(p => p.operatingExpenses)}
                      highlightBest="lower"
                    />
                    <ComparisonRow
                      label="Property Tax"
                      values={properties.map(p => formatPrice(p.propertyTax))}
                      numericValues={properties.map(p => p.propertyTax)}
                      highlightBest="lower"
                    />
                    <ComparisonRow
                      label="Occupancy Rate"
                      values={properties.map(p => p.occupancyRate ? `${p.occupancyRate}%` : 'N/A')}
                      numericValues={properties.map(p => p.occupancyRate)}
                      highlightBest="higher"
                    />
                  </>
                )}

                {/* Media & Features */}
                <tr className="bg-gray-50">
                  <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-sm">
                    Media & Features
                  </td>
                </tr>
                <ComparisonRow
                  label="Video"
                  values={properties.map(p => p.hasVideo ? 'Yes' : 'No')}
                  booleanValues={properties.map(p => p.hasVideo)}
                />
                <ComparisonRow
                  label="360° Tour"
                  values={properties.map(p => p.hasTour360 ? 'Yes' : 'No')}
                  booleanValues={properties.map(p => p.hasTour360)}
                />
                <ComparisonRow
                  label="Verified"
                  values={properties.map(p => p.isVerified ? 'Yes' : 'No')}
                  booleanValues={properties.map(p => p.isVerified)}
                />

                {/* Stats */}
                <tr className="bg-gray-50">
                  <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-sm">
                    Performance
                  </td>
                </tr>
                <ComparisonRow
                  label="Views"
                  icon={<Eye className="w-4 h-4" />}
                  values={properties.map(p => formatNumber(p.viewCount))}
                  numericValues={properties.map(p => p.viewCount)}
                  highlightBest="higher"
                />
                <ComparisonRow
                  label="Inquiries"
                  icon={<MessageSquare className="w-4 h-4" />}
                  values={properties.map(p => formatNumber(p.inquiryCount))}
                  numericValues={properties.map(p => p.inquiryCount)}
                  highlightBest="higher"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Save Comparison</h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Enter comparison name"
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveComparison}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ComparisonRowProps {
  label: string;
  icon?: React.ReactNode;
  values: string[];
  numericValues?: (number | null | undefined)[];
  booleanValues?: boolean[];
  highlightBest?: 'higher' | 'lower';
}

function ComparisonRow({ label, icon, values, numericValues, booleanValues, highlightBest }: ComparisonRowProps) {
  const bestValue = numericValues && highlightBest
    ? getBestValue(numericValues, highlightBest === 'higher')
    : null;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        <div className="flex items-center gap-2">
          {icon}
          {label}
        </div>
      </td>
      {values.map((value, index) => {
        const isHighlight = numericValues && bestValue
          ? numericValues[index] === bestValue
          : booleanValues
          ? booleanValues[index]
          : false;

        return (
          <td
            key={index}
            className={`px-4 py-3 text-sm text-center ${
              isHighlight ? 'bg-green-50 font-semibold text-green-900' : 'text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              {isHighlight && numericValues && (
                highlightBest === 'higher' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-600" />
                )
              )}
              {isHighlight && booleanValues && <Check className="w-4 h-4 text-green-600" />}
              {value}
            </div>
          </td>
        );
      })}
    </tr>
  );
}

function getBestValue(values: (number | null | undefined)[], higher = false) {
  const validValues = values.filter(v => v != null) as number[];
  if (validValues.length === 0) return null;
  return higher ? Math.max(...validValues) : Math.min(...validValues);
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading comparison...</p>
        </div>
      </div>
    }>
      <ComparePageContent />
    </Suspense>
  );
}
