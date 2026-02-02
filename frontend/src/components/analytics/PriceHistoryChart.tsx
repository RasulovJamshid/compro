'use client';

interface PriceHistoryChartProps {
  data: Array<{
    price: number;
    pricePerMonth?: number;
    pricePerSqm?: number;
    changedAt: string;
    reason?: string;
  }>;
}

export default function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  const sortedData = [...data].sort((a, b) => 
    new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
  );

  const prices = sortedData.map(d => d.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const priceRange = maxPrice - minPrice;

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toString();
  };

  return (
    <div className="w-full">
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>{formatPrice(maxPrice)}</span>
          <span>{formatPrice((maxPrice + minPrice) / 2)}</span>
          <span>{formatPrice(minPrice)}</span>
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="border-t border-gray-200"></div>
            ))}
          </div>

          {/* Line chart */}
          <svg className="absolute inset-0 w-full h-full">
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              points={sortedData
                .map((item, index) => {
                  const x = (index / (sortedData.length - 1)) * 100;
                  const y = 100 - ((item.price - minPrice) / priceRange) * 100;
                  return `${x}%,${y}%`;
                })
                .join(' ')}
            />
            {/* Data points */}
            {sortedData.map((item, index) => {
              const x = (index / (sortedData.length - 1)) * 100;
              const y = 100 - ((item.price - minPrice) / priceRange) * 100;
              
              return (
                <g key={index}>
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4"
                    fill="#3B82F6"
                    className="cursor-pointer hover:r-6 transition-all"
                  />
                  <title>
                    {new Date(item.changedAt).toLocaleDateString()}: {item.price.toLocaleString()} сум
                    {item.reason && `\n${item.reason}`}
                  </title>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="ml-12 mt-2 flex justify-between text-xs text-gray-500">
        {sortedData.map((item, index) => {
          if (index === 0 || index === sortedData.length - 1 || index === Math.floor(sortedData.length / 2)) {
            return (
              <span key={index}>
                {new Date(item.changedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            );
          }
          return null;
        })}
      </div>

      {/* Price change indicator */}
      {sortedData.length >= 2 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {sortedData[sortedData.length - 1].price > sortedData[0].price ? (
            <>
              <span className="text-red-600">↑</span>
              <span className="text-sm text-gray-600">
                Price increased by{' '}
                {(
                  ((sortedData[sortedData.length - 1].price - sortedData[0].price) /
                    sortedData[0].price) *
                  100
                ).toFixed(1)}
                %
              </span>
            </>
          ) : (
            <>
              <span className="text-green-600">↓</span>
              <span className="text-sm text-gray-600">
                Price decreased by{' '}
                {(
                  ((sortedData[0].price - sortedData[sortedData.length - 1].price) /
                    sortedData[0].price) *
                  100
                ).toFixed(1)}
                %
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
