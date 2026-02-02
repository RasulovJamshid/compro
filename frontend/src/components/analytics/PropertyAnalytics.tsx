'use client';

import { useEffect, useState } from 'react';
import { analyticsApi, PropertyAnalytics as AnalyticsData } from '@/lib/api/analytics';
import { Eye, MessageSquare, Share2, TrendingUp, Clock, MousePointer } from 'lucide-react';
import ViewsChart from './ViewsChart';
import PriceHistoryChart from './PriceHistoryChart';
import MarketComparables from './MarketComparables';

interface PropertyAnalyticsProps {
  propertyId: string;
}

export default function PropertyAnalytics({ propertyId }: PropertyAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, [propertyId]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await analyticsApi.getPropertyAnalytics(propertyId);
      setAnalytics(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'No analytics data available'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Eye className="w-5 h-5" />}
          label="Total Views"
          value={analytics.totalViews.toLocaleString()}
          subtitle={`${analytics.uniqueViewers} unique viewers`}
          color="blue"
        />
        <MetricCard
          icon={<MessageSquare className="w-5 h-5" />}
          label="Inquiries"
          value={analytics.inquiryCount.toLocaleString()}
          subtitle={`${analytics.conversionRate}% conversion`}
          color="green"
        />
        <MetricCard
          icon={<Share2 className="w-5 h-5" />}
          label="Shares"
          value={analytics.shareCount.toLocaleString()}
          subtitle="Total shares"
          color="purple"
        />
        <MetricCard
          icon={<Clock className="w-5 h-5" />}
          label="Avg. Duration"
          value={`${analytics.avgViewDuration}s`}
          subtitle="Per view"
          color="orange"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity (Last 30 Days)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{analytics.recentViews}</p>
            <p className="text-sm text-gray-600">Recent Views</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {analytics.recentInquiries.length}
            </p>
            <p className="text-sm text-gray-600">New Inquiries</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {analytics.conversionRate}%
            </p>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </div>
        </div>
      </div>

      {/* Views by Source */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
        <div className="space-y-3">
          {Object.entries(analytics.viewsBySource).map(([source, count]) => {
            const total = Object.values(analytics.viewsBySource).reduce((a, b) => a + b, 0);
            const percentage = ((count / total) * 100).toFixed(1);
            
            return (
              <div key={source} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{source}</span>
                    <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Views Over Time Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Views Over Time (Last 30 Days)</h3>
        <ViewsChart data={analytics.viewsOverTime} />
      </div>

      {/* Price History Chart */}
      {analytics.priceHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Price History</h3>
          <PriceHistoryChart data={analytics.priceHistory} />
        </div>
      )}

      {/* Market Comparables */}
      <MarketComparables propertyId={propertyId} />

      {/* Recent Inquiries */}
      {analytics.recentInquiries.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Inquiries</h3>
          <div className="space-y-3">
            {analytics.recentInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium capitalize">{inquiry.status}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    inquiry.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : inquiry.status === 'contacted'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {inquiry.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function MetricCard({ icon, label, value, subtitle, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
