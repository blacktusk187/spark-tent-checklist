'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getChecklist, getAllTentSizes } from '@/lib/checklist-data';
import { loadChecklistState, saveChecklistState, clearChecklistState } from '@/lib/storage';
import { TentSize, ChecklistState, ChecklistItem, ChecklistSection as ChecklistSectionType } from '@/types/checklist';
import ChecklistSection from '@/components/ChecklistSection';
import ProgressBar from '@/components/ProgressBar';

function flattenSectionItems(items: ChecklistItem[]): ChecklistItem[] {
  return items.flatMap((item) => [item, ...(item.subItems ?? [])]);
}

const WALLS_SECTION: ChecklistSectionType = {
  id: 'walls',
  title: 'Walls',
  items: [
    { id: 'walls-item-walls', name: 'Walls' },
    { id: 'walls-ladders-x2', name: 'Ladders x2' },
    { id: 'walls-tarp-20x20-x2', name: 'Tarp 20x20 x2' },
    { id: 'walls-gorilla-tape', name: 'White / Clear Gorilla Tape' },
  ],
};

const LIGHTING_SECTION: ChecklistSectionType = {
  id: 'lighting',
  title: 'Lighting',
  items: [
    { id: 'lighting-item', name: 'Lighting' },
    { id: 'lighting-power-cables', name: 'Power Extension Cables' },
    { id: 'lighting-dimmer', name: 'Dimmer - if ordered' },
    { id: 'lighting-ladders-x2', name: 'Ladders x2' },
    { id: 'lighting-dongles', name: 'Dongles' },
    { id: 'lighting-electrical-tape', name: 'White Electrical Tape' },
    { id: 'lighting-zip-ties', name: 'White Zip Ties' },
    { id: 'lighting-cutters', name: 'Cutters' },
  ],
};

export default function ChecklistPage() {
  const params = useParams();
  const size = params.size as string;

  const validSizes = getAllTentSizes();
  const tentSize = validSizes.includes(size as TentSize) ? (size as TentSize) : null;

  const checklist = tentSize ? getChecklist(tentSize) : null;
  const [state, setState] = useState<ChecklistState>({});
  const [ballastType, setBallastType] = useState<'stakes' | 'concrete' | null>(null);
  const [wallsOption, setWallsOption] = useState<'yes' | 'no' | null>(null);
  const [lightingOption, setLightingOption] = useState<'yes' | 'no' | null>(null);

  useEffect(() => {
    if (tentSize) {
      const savedState = loadChecklistState(tentSize);
      setState(savedState);
      const savedBallastType = localStorage.getItem(`spark-checklist-ballast-${tentSize}`) as 'stakes' | 'concrete' | null;
      if (savedBallastType === 'stakes' || savedBallastType === 'concrete') {
        setBallastType(savedBallastType);
      }
      const savedWalls = localStorage.getItem(`spark-checklist-walls-${tentSize}`) as 'yes' | 'no' | null;
      if (savedWalls === 'yes' || savedWalls === 'no') {
        setWallsOption(savedWalls);
      }
      const savedLighting = localStorage.getItem(`spark-checklist-lighting-${tentSize}`) as 'yes' | 'no' | null;
      if (savedLighting === 'yes' || savedLighting === 'no') {
        setLightingOption(savedLighting);
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
    const section = sectionId === 'walls'
      ? WALLS_SECTION
      : sectionId === 'lighting'
        ? LIGHTING_SECTION
        : [...(checklist?.commonSections ?? []), ...(checklist?.specificSections ?? [])].find((s) => s.id === sectionId);
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
    if (tentSize && confirm('Are you sure you want to reset all checkmarks, ballast type, walls, and lighting?')) {
      clearChecklistState(tentSize);
      setState({});
      setBallastType(null);
      setWallsOption(null);
      setLightingOption(null);
      localStorage.removeItem(`spark-checklist-ballast-${tentSize}`);
      localStorage.removeItem(`spark-checklist-walls-${tentSize}`);
      localStorage.removeItem(`spark-checklist-lighting-${tentSize}`);
    }
  };

  const handleBallastTypeChange = (type: 'stakes' | 'concrete') => {
    setBallastType(type);
    if (tentSize) localStorage.setItem(`spark-checklist-ballast-${tentSize}`, type);
  };

  const handleWallsChange = (value: 'yes' | 'no') => {
    setWallsOption(value);
    if (tentSize) localStorage.setItem(`spark-checklist-walls-${tentSize}`, value);
  };

  const handleLightingChange = (value: 'yes' | 'no') => {
    setLightingOption(value);
    if (tentSize) localStorage.setItem(`spark-checklist-lighting-${tentSize}`, value);
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
    
    // Start with common sections (excluding stakes and concrete)
    const sections = checklist.commonSections.filter(
      s => s.id !== 'stakes' && s.id !== 'concrete'
    );

    const sizeMap: Record<TentSize, { stakes: number; concrete: number }> = {
      '30x30': { stakes: 16, concrete: 8 },
      '30x45': { stakes: 24, concrete: 12 },
      '30x60': { stakes: 32, concrete: 16 },
      '30x75': { stakes: 40, concrete: 20 },
      '40x40': { stakes: 20, concrete: 10 },
      '40x60': { stakes: 28, concrete: 14 },
      '40x80': { stakes: 36, concrete: 18 },
      '40x100': { stakes: 44, concrete: 22 },
    };
    const config = sizeMap[tentSize];

    // Add specific hardware section (30x FRAME SPECIFIC HARDWARE) before ballast
    const specificSection = checklist.specificSections[0];
    if (specificSection) {
      sections.push(specificSection);
    }

    // Add ballast section (Stakes or Concrete / Water Barrels) below specific hardware, with size-based max item
    if (ballastType === 'stakes') {
      const stakesSection = checklist.commonSections.find(s => s.id === 'stakes');
      if (stakesSection) {
        sections.push({
          ...stakesSection,
          items: [
            ...stakesSection.items,
            { id: 'stakes-max', name: `${config.stakes}x stakes (max)` },
          ],
        });
      }
    } else if (ballastType === 'concrete') {
      const concreteSection = checklist.commonSections.find(s => s.id === 'concrete');
      if (concreteSection) {
        sections.push({
          ...concreteSection,
          items: [
            { id: 'concrete-max', name: `${config.concrete}x concrete / water barrels (max)` },
            ...concreteSection.items,
          ],
        });
      }
    }

    // Add Walls section when Walls = Yes
    if (wallsOption === 'yes') {
      sections.push(WALLS_SECTION);
    }

    // Add Lighting section when Lighting = Yes
    if (lightingOption === 'yes') {
      sections.push(LIGHTING_SECTION);
    }
    
    return sections;
  }, [checklist, ballastType, tentSize, wallsOption, lightingOption]);

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
            className="rounded-full bg-[#E13447] px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
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
            Concrete / Water Barrels
          </button>
        </div>
      </div>

      {/* Walls selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="mb-2">
          <label className="text-sm font-semibold text-gray-700">Walls</label>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleWallsChange('yes')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
              wallsOption === 'yes'
                ? 'bg-[#E13447] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => handleWallsChange('no')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
              wallsOption === 'no'
                ? 'bg-[#E13447] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            No
          </button>
        </div>
      </div>

      {/* Lighting selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="mb-2">
          <label className="text-sm font-semibold text-gray-700">Lighting</label>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleLightingChange('yes')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
              lightingOption === 'yes'
                ? 'bg-[#E13447] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => handleLightingChange('no')}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
              lightingOption === 'no'
                ? 'bg-[#E13447] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            No
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
          <p className="text-gray-600">Please select a ballast type (Stakes or Concrete / Water Barrels) to view the checklist.</p>
        </div>
      )}
    </div>
  );
}
