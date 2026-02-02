'use client';

interface ViewsChartProps {
  data: Array<{ date: string; views: number }>;
}

export default function ViewsChart({ data }: ViewsChartProps) {
  const maxViews = Math.max(...data.map(d => d.views), 1);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between h-64 gap-1">
        {data.map((item, index) => {
          const height = (item.views / maxViews) * 100;
          const date = new Date(item.date);
          const day = date.getDate();
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full group">
                <div
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                ></div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.views} views
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
              {index % 5 === 0 && (
                <span className="text-xs text-gray-500">{day}</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        Last 30 Days
      </div>
    </div>
  );
}
