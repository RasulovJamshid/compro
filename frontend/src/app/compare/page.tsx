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
import { useTranslations } from 'next-intl';

function ComparePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const t = useTranslations('Compare');
  const tCommon = useTranslations('Common');
  
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
      setError(t('selectProperties'));
    }
  }, [searchParams]);

  const loadComparison = async (ids: string[]) => {
    setLoading(true);
    setError('');
    try {
      const data = await comparisonApi.compareProperties(ids);
      setComparison(data);
    } catch (err: any) {
      setError(err.response?.data?.message || tCommon('error'));
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
      return;
    }

    setSaving(true);
    try {
      await comparisonApi.createComparison(saveName, propertyIds);
      setShowSaveDialog(false);
      setSaveName('');
    } catch (err: any) {
      setError(err.response?.data?.message || tCommon('error'));
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
    return `${formatNumber(price)} UZS`;
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
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">{tCommon('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || t('noData')}</p>
          <Link href="/properties" className="text-primary-600 hover:text-primary-700 font-medium">
            {t('backToProperties')}
          </Link>
        </div>
      </div>
    );
  }

  const { properties, summary } = comparison;

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200 sticky top-16 z-10">
        <div className="container py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <Link href="/properties" className="text-secondary-600 hover:text-secondary-900 transition-colors">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate text-secondary-900">{t('title')}</h1>
                <p className="text-sm text-secondary-600">{t('comparing')} {properties.length} {t('properties')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSaveDialog(true)}
                className="btn btn-sm btn-primary"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">{t('saveComparison')}</span>
                <span className="sm:hidden">{tCommon('save')}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="btn btn-sm btn-outline"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t('export')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="container py-4 sm:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-secondary-200">
            <p className="text-sm text-secondary-600 mb-1">{t('avgPrice')}</p>
            <p className="text-xl sm:text-2xl font-bold text-secondary-900">{formatPrice(summary.avgPrice)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-secondary-200">
            <p className="text-sm text-secondary-600 mb-1">{t('priceRange')}</p>
            <p className="text-lg sm:text-xl font-bold text-secondary-900">
              {formatNumber(summary.lowestPrice)} - {formatNumber(summary.highestPrice)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-secondary-200">
            <p className="text-sm text-secondary-600 mb-1">{t('avgPricePerSqm')}</p>
            <p className="text-xl sm:text-2xl font-bold text-secondary-900">{formatPrice(summary.avgPricePerSqm)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-secondary-200">
            <p className="text-sm text-secondary-600 mb-1">{t('avgArea')}</p>
            <p className="text-xl sm:text-2xl font-bold text-secondary-900">{formatNumber(summary.avgArea)} m²</p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900 w-48">
                    {t('property')}
                  </th>
                  {properties.map((property) => (
                    <th key={property.id} className="px-4 py-3 text-center relative">
                      <button
                        onClick={() => removeProperty(property.id)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title={t('Breadcrumbs.remove')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="pt-6">
                        {property.coverImage && (
                          <img
                            src={property.coverImage}
                            alt={property.title}
                            className="w-full h-32 object-cover rounded-lg mb-2 border border-secondary-200"
                          />
                        )}
                        <Link
                          href={`/properties/${property.id}`}
                          className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
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
                  label={t('type')}
                  icon={<Building2 className="w-4 h-4" />}
                  values={properties.map(p => p.propertyType)}
                />
                <ComparisonRow
                  label={t('dealType')}
                  icon={<DollarSign className="w-4 h-4" />}
                  values={properties.map(p => p.dealType)}
                />
                <ComparisonRow
                  label={t('status')}
                  icon={<Check className="w-4 h-4" />}
                  values={properties.map(p => p.status)}
                />

                {/* Location */}
                <tr className="bg-secondary-50">
                  <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-sm text-secondary-900">
                    {t('location')}
                  </td>
                </tr>
                <ComparisonRow
                  label={t('city')}
                  icon={<MapPin className="w-4 h-4" />}
                  values={properties.map(p => p.city)}
                />
                <ComparisonRow
                  label={t('district')}
                  values={properties.map(p => p.district)}
                />
                <ComparisonRow
                  label={t('address')}
                  values={properties.map(p => p.address || 'N/A')}
                />

                {/* Size & Price */}
                <tr className="bg-secondary-50">
                  <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-sm text-secondary-900">
                    {t('sizePricing')}
                  </td>
                </tr>
                <ComparisonRow
                  label={t('area')}
                  icon={<Ruler className="w-4 h-4" />}
                  values={properties.map(p => `${formatNumber(p.area)} m²`)}
                  numericValues={properties.map(p => p.area)}
                  highlightBest="higher"
                />
                <ComparisonRow
                  label={t('price')}
                  icon={<DollarSign className="w-4 h-4" />}
                  values={properties.map(p => formatPrice(p.price))}
                  numericValues={properties.map(p => p.price)}
                  highlightBest="lower"
                />
                <ComparisonRow
                  label={t('pricePerSqm')}
                  values={properties.map(p => formatPrice(p.pricePerSqm))}
                  numericValues={properties.map(p => p.pricePerSqm)}
                  highlightBest="lower"
                />
                {properties.some(p => p.pricePerMonth) && (
                  <ComparisonRow
                    label={t('monthlyRent')}
                    values={properties.map(p => formatPrice(p.pricePerMonth))}
                    numericValues={properties.map(p => p.pricePerMonth)}
                    highlightBest="lower"
                  />
                )}

                {/* Building Details */}
                <tr className="bg-secondary-50">
                  <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-sm text-secondary-900">
                    {t('buildingDetails')}
                  </td>
                </tr>
                <ComparisonRow
                  label={t('floor')}
                  values={properties.map(p => p.floor ? `${p.floor}/${p.totalFloors || '?'}` : 'N/A')}
                />
                <ComparisonRow
                  label={t('yearBuilt')}
                  icon={<Calendar className="w-4 h-4" />}
                  values={properties.map(p => p.yearBuilt?.toString() || 'N/A')}
                  numericValues={properties.map(p => p.yearBuilt)}
                  highlightBest="higher"
                />
                <ComparisonRow
                  label={t('buildingClass')}
                  values={properties.map(p => p.buildingClass || 'N/A')}
                />
                <ComparisonRow
                  label={t('ceilingHeight')}
                  values={properties.map(p => p.ceilingHeight ? `${p.ceilingHeight}m` : 'N/A')}
                  numericValues={properties.map(p => p.ceilingHeight)}
                  highlightBest="higher"
                />

                {/* Amenities */}
                <tr className="bg-secondary-50">
                  <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-sm text-secondary-900">
                    {t('amenities')}
                  </td>
                </tr>
                <ComparisonRow
                  label={t('parking')}
                  icon={<Car className="w-4 h-4" />}
                  values={properties.map(p => 
                    p.parkingSpaces ? `${p.parkingSpaces} ${t('spaces')}` : p.hasParking ? tCommon('yes') : tCommon('no')
                  )}
                  booleanValues={properties.map(p => p.hasParking)}
                />
                <ComparisonRow
                  label={t('loadingDocks')}
                  values={properties.map(p => p.loadingDocks ? `${p.loadingDocks}` : 'N/A')}
                  numericValues={properties.map(p => p.loadingDocks)}
                  highlightBest="higher"
                />
                <ComparisonRow
                  label={t('hvac')}
                  icon={<Zap className="w-4 h-4" />}
                  values={properties.map(p => p.hvacType || 'N/A')}
                />
                <ComparisonRow
                  label={t('security')}
                  icon={<Shield className="w-4 h-4" />}
                  values={properties.map(p => 
                    p.securityFeatures?.length ? p.securityFeatures.join(', ') : 'N/A'
                  )}
                />

                {/* Financial */}
                {properties.some(p => p.operatingExpenses || p.propertyTax) && (
                  <>
                    <tr className="bg-secondary-50">
                      <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-sm text-secondary-900">
                        {t('financial')}
                      </td>
                    </tr>
                    <ComparisonRow
                      label={t('operatingExpenses')}
                      values={properties.map(p => formatPrice(p.operatingExpenses))}
                      numericValues={properties.map(p => p.operatingExpenses)}
                      highlightBest="lower"
                    />
                    <ComparisonRow
                      label={t('propertyTax')}
                      values={properties.map(p => formatPrice(p.propertyTax))}
                      numericValues={properties.map(p => p.propertyTax)}
                      highlightBest="lower"
                    />
                    <ComparisonRow
                      label={t('occupancyRate')}
                      values={properties.map(p => p.occupancyRate ? `${p.occupancyRate}%` : 'N/A')}
                      numericValues={properties.map(p => p.occupancyRate)}
                      highlightBest="higher"
                    />
                  </>
                )}

                {/* Media & Features */}
                <tr className="bg-secondary-50">
                  <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-sm text-secondary-900">
                    {t('mediaFeatures')}
                  </td>
                </tr>
                <ComparisonRow
                  label={t('video')}
                  values={properties.map(p => p.hasVideo ? tCommon('yes') : tCommon('no'))}
                  booleanValues={properties.map(p => p.hasVideo)}
                />
                <ComparisonRow
                  label={t('tour360')}
                  values={properties.map(p => p.hasTour360 ? tCommon('yes') : tCommon('no'))}
                  booleanValues={properties.map(p => p.hasTour360)}
                />
                <ComparisonRow
                  label={t('verified')}
                  values={properties.map(p => p.isVerified ? tCommon('yes') : tCommon('no'))}
                  booleanValues={properties.map(p => p.isVerified)}
                />

                {/* Stats */}
                <tr className="bg-secondary-50">
                  <td colSpan={properties.length + 1} className="px-4 py-2 font-semibold text-sm text-secondary-900">
                    {t('performance')}
                  </td>
                </tr>
                <ComparisonRow
                  label={t('views')}
                  icon={<Eye className="w-4 h-4" />}
                  values={properties.map(p => formatNumber(p.viewCount))}
                  numericValues={properties.map(p => p.viewCount)}
                  highlightBest="higher"
                />
                <ComparisonRow
                  label={t('inquiries')}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 sm:p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-secondary-900 mb-4">{t('saveComparison')}</h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder={t('saveName')}
              className="w-full px-4 py-2.5 border border-secondary-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleSaveComparison}
                disabled={saving}
                className="flex-1 btn btn-md btn-primary"
              >
                {saving ? t('saving') : tCommon('save')}
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 btn btn-md btn-outline"
              >
                {tCommon('cancel')}
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
    <tr className="hover:bg-secondary-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-secondary-900">
        <div className="flex items-center gap-2">
          {icon && <span className="text-secondary-500">{icon}</span>}
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
              isHighlight ? 'bg-primary-50 font-semibold text-primary-900' : 'text-secondary-700'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              {isHighlight && numericValues && (
                highlightBest === 'higher' ? (
                  <TrendingUp className="w-4 h-4 text-primary-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-primary-600" />
                )
              )}
              {isHighlight && booleanValues && <Check className="w-4 h-4 text-primary-600" />}
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
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading...</p>
        </div>
      </div>
    }>
      <ComparePageContent />
    </Suspense>
  );
}
