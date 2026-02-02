'use client';

import { useEffect, useState } from 'react';
import { analyticsApi, MarketComparables as ComparablesData } from '@/lib/api/analytics';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Link from 'next/link';

interface MarketComparablesProps {
  propertyId: string;
}

export default function MarketComparables({ propertyId }: MarketComparablesProps) {
  const [data, setData] = useState<ComparablesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComparables();
  }, [propertyId]);

  const loadComparables = async () => {
    setLoading(true);
    try {
      const result = await analyticsApi.getMarketComparables(propertyId);
      setData(result);
    } catch (err) {
      console.error('Failed to load comparables:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Market Comparables</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { comparables, marketStats } = data;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Market Comparables</h3>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Market Listings</p>
          <p className="text-2xl font-bold">{marketStats.totalListings}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Avg. Price</p>
          <p className="text-2xl font-bold">
            {marketStats.avgPrice.toLocaleString()} сум
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Price Position</p>
          <div className="flex items-center gap-2">
            {marketStats.pricePosition === 'above' && (
              <>
                <TrendingUp className="w-5 h-5 text-red-600" />
                <span className="text-lg font-bold text-red-600">
                  +{marketStats.priceDifference}%
                </span>
              </>
            )}
            {marketStats.pricePosition === 'below' && (
              <>
                <TrendingDown className="w-5 h-5 text-green-600" />
                <span className="text-lg font-bold text-green-600">
                  {marketStats.priceDifference}%
                </span>
              </>
            )}
            {marketStats.pricePosition === 'average' && (
              <>
                <Minus className="w-5 h-5 text-gray-600" />
                <span className="text-lg font-bold text-gray-600">Average</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comparable Properties */}
      {comparables.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comparables.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {property.coverImage && (
                <img
                  src={property.coverImage}
                  alt={property.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                  {property.title}
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>{property.area} m²</p>
                  <p className="font-semibold text-gray-900">
                    {property.price.toLocaleString()} сум
                  </p>
                  {property.pricePerSqm && (
                    <p className="text-xs">
                      {property.pricePerSqm.toLocaleString()} сум/m²
                    </p>
                  )}
                  <p className="text-xs">{property.district}</p>
                  {property.buildingClass && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Class {property.buildingClass}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">
          No comparable properties found
        </p>
      )}
    </div>
  );
}
