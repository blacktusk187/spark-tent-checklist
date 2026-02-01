'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getChecklist, getAllTentSizes } from '@/lib/checklist-data';
import { loadChecklistState, saveChecklistState, clearChecklistState } from '@/lib/storage';
import { TentSize, ChecklistState, ChecklistItem } from '@/types/checklist';
import ChecklistSection from '@/components/ChecklistSection';
import ProgressBar from '@/components/ProgressBar';

function flattenSectionItems(items: ChecklistItem[]): ChecklistItem[] {
  return items.flatMap((item) => [item, ...(item.subItems ?? [])]);
}

export default function ChecklistPage() {
  const params = useParams();
  const size = params.size as string;

  const validSizes = getAllTentSizes();
  const tentSize = validSizes.includes(size as TentSize) ? (size as TentSize) : null;

  const checklist = tentSize ? getChecklist(tentSize) : null;
  const [state, setState] = useState<ChecklistState>({});
  const [ballastType, setBallastType] = useState<'stakes' | 'concrete' | null>(null);

  useEffect(() => {
    if (tentSize) {
      const savedState = loadChecklistState(tentSize);
      setState(savedState);
      // Load ballast type preference
      const savedBallastType = localStorage.getItem(`spark-checklist-ballast-${tentSize}`) as 'stakes' | 'concrete' | null;
      if (savedBallastType === 'stakes' || savedBallastType === 'concrete') {
        setBallastType(savedBallastType);
      }
    }
  }, [tentSize]);

  useEffect(() => {
    if (tentSize && Object.keys(state).length > 0) {
      saveChecklistState(tentSize, state);
    }
  }, [state, tentSize]);

  const handleItemCheckedChange = (itemId: string, checked: boolean) => {
    setState((prev) => ({ ...prev, [itemId]: checked }));
  };

  const handleSectionCheckChange = (sectionId: string, checked: boolean) => {
    if (!checklist) return;
    const allSections = [...checklist.commonSections, ...checklist.specificSections];
    const section = allSections.find((s) => s.id === sectionId);
    if (!section) return;
    const flatItems = flattenSectionItems(section.items);
    setState((prev) => {
      const next = { ...prev };
      flatItems.forEach((item) => {
        next[item.id] = checked;
      });
      return next;
    });
  };

  const handleReset = () => {
    if (tentSize && confirm('Are you sure you want to reset all checkmarks and ballast type?')) {
      clearChecklistState(tentSize);
      setState({});
      setBallastType(null);
      localStorage.removeItem(`spark-checklist-ballast-${tentSize}`);
    }
  };

  const handleBallastTypeChange = (type: 'stakes' | 'concrete') => {
    setBallastType(type);
    if (tentSize) {
      localStorage.setItem(`spark-checklist-ballast-${tentSize}`, type);
    }
  };

  if (!tentSize || !checklist) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Invalid Tent Size</h1>
          <p className="text-gray-600 mb-4">The tent size &quot;{size}&quot; is not available.</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Filter sections based on ballast type selection
  const filteredSections = useMemo(() => {
    if (!checklist || !ballastType) return [];
    
    // Filter out stakes and concrete sections, then add the selected one
    const sections = checklist.commonSections.filter(
      s => s.id !== 'stakes' && s.id !== 'concrete'
    );
    
    // Add the selected ballast section
    if (ballastType === 'stakes') {
      const stakesSection = checklist.commonSections.find(s => s.id === 'stakes');
      if (stakesSection) sections.push(stakesSection);
    } else if (ballastType === 'concrete') {
      const concreteSection = checklist.commonSections.find(s => s.id === 'concrete');
      if (concreteSection) sections.push(concreteSection);
    }
    
    // Add specific hardware section with updated ballast item
    const specificSection = checklist.specificSections[0];
    if (specificSection) {
      const sizeMap: Record<TentSize, { stakes: number; concrete: number }> = {
        '30x30': { stakes: 16, concrete: 8 },
        '30x45': { stakes: 24, concrete: 12 },
        '30x60': { stakes: 32, concrete: 16 },
        '30x75': { stakes: 40, concrete: 20 },
      };
      const config = sizeMap[tentSize];
      
      const updatedSpecificSection = {
        ...specificSection,
        items: specificSection.items.map(item => {
          if (item.id === 'stakes-max') {
            if (ballastType === 'stakes') {
              return { ...item, name: `${config.stakes}x stakes (max)` };
            } else if (ballastType === 'concrete') {
              return { ...item, name: `${config.concrete}x concrete (max)` };
            }
          }
          return item;
        }),
      };
      sections.push(updatedSpecificSection);
    }
    
    return sections;
  }, [checklist, ballastType, tentSize]);

  const { totalItems, completedItems, progress } = useMemo(() => {
    if (!ballastType || filteredSections.length === 0) {
      return { totalItems: 0, completedItems: 0, progress: 0 };
    }
    const allItems = filteredSections.flatMap((section) => flattenSectionItems(section.items));
    const total = allItems.length;
    const completed = allItems.filter((item) => state[item.id]).length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return { totalItems: total, completedItems: completed, progress: percentage };
  }, [filteredSections, state, ballastType]);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Progress card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">{tentSize} Frame Tent</h2>
          <button
            onClick={handleReset}
            className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
          >
            Reset all
          </button>
        </div>
        <ProgressBar value={progress} total={totalItems} completed={completedItems} />
      </div>

      {/* Ballast type selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="mb-2">
          <label className="text-sm font-semibold text-gray-700">Ballast Type</label>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleBallastTypeChange('stakes')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
              ballastType === 'stakes'
                ? 'bg-[#E13447] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Stakes
          </button>
          <button
            onClick={() => handleBallastTypeChange('concrete')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
              ballastType === 'concrete'
                ? 'bg-[#E13447] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Concrete
          </button>
        </div>
      </div>

      {/* Checklist sections in rounded boxes */}
      {ballastType && (
        <div className="space-y-4">
          {filteredSections.map((section) => (
            <ChecklistSection
              key={section.id}
              section={section}
              state={state}
              onItemCheckedChange={handleItemCheckedChange}
              onSectionCheckAll={(checked) => handleSectionCheckChange(section.id, checked)}
            />
          ))}
        </div>
      )}
      
      {!ballastType && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Please select a ballast type (Stakes or Concrete) to view the checklist.</p>
        </div>
      )}
    </div>
  );
}
