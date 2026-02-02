'use client';

import { useState, useEffect } from 'react';
import { GitCompare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ComparisonButton() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('comparison_ids');
    if (saved) {
      setSelectedIds(JSON.parse(saved));
    }
  }, []);

  const handleCompare = () => {
    if (selectedIds.length >= 2) {
      router.push(`/compare?ids=${selectedIds.join(',')}`);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('comparison_ids');
    setSelectedIds([]);
  };

  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-lg border-2 border-blue-600 p-4 min-w-[200px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">Compare</span>
          </div>
          <button
            onClick={handleClear}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          {selectedIds.length} {selectedIds.length === 1 ? 'property' : 'properties'} selected
        </p>
        <button
          onClick={handleCompare}
          disabled={selectedIds.length < 2}
          className={`w-full px-4 py-2 rounded-lg font-medium ${
            selectedIds.length >= 2
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {selectedIds.length < 2
            ? 'Select 2+ properties'
            : `Compare ${selectedIds.length} properties`}
        </button>
      </div>
    </div>
  );
}

// Hook to manage comparison selection
export function useComparison(propertyId: string) {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('comparison_ids');
    if (saved) {
      const ids = JSON.parse(saved);
      setIsSelected(ids.includes(propertyId));
    }
  }, [propertyId]);

  const toggleSelection = () => {
    const saved = localStorage.getItem('comparison_ids');
    let ids: string[] = saved ? JSON.parse(saved) : [];

    if (ids.includes(propertyId)) {
      ids = ids.filter(id => id !== propertyId);
    } else {
      if (ids.length >= 4) {
        alert('You can compare up to 4 properties at a time');
        return;
      }
      ids.push(propertyId);
    }

    localStorage.setItem('comparison_ids', JSON.stringify(ids));
    setIsSelected(ids.includes(propertyId));
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
  };

  return { isSelected, toggleSelection };
}
