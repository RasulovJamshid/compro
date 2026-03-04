'use client';

import { useState, useEffect } from 'react';
import { GitCompare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function ComparisonButton() {
  const router = useRouter();
  const t = useTranslations('Compare');
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
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
      <div className="bg-white rounded-xl shadow-xl border-2 border-primary-600 p-4 min-w-[220px] max-w-[280px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-primary-600" />
            <span className="font-bold text-secondary-900">{t('compareButton')}</span>
          </div>
          <button
            onClick={handleClear}
            className="text-sm text-secondary-500 hover:text-secondary-700 font-medium transition-colors"
          >
            {t('clear')}
          </button>
        </div>
        <p className="text-sm text-secondary-600 mb-3">
          {selectedIds.length} {t('properties')} {t('selected')}
        </p>
        <button
          onClick={handleCompare}
          disabled={selectedIds.length < 2}
          className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all ${
            selectedIds.length >= 2
              ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
              : 'bg-secondary-200 text-secondary-500 cursor-not-allowed'
          }`}
        >
          {selectedIds.length < 2
            ? t('selectMore')
            : `${t('compareButton')} ${selectedIds.length}`}
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
