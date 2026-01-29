'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import { ChecklistSection as ChecklistSectionType, ChecklistState } from '@/types/checklist';
import ChecklistItem from './ChecklistItem';

interface ChecklistSectionProps {
  section: ChecklistSectionType;
  state: ChecklistState;
  onItemCheckedChange: (itemId: string, checked: boolean) => void;
  onSectionCheckAll?: (checked: boolean) => void;
}

export default function ChecklistSection({
  section,
  state,
  onItemCheckedChange,
  onSectionCheckAll,
}: ChecklistSectionProps) {
  const itemIds = section.items.map((i) => i.id);
  const checkedCount = itemIds.filter((id) => state[id]).length;
  const allChecked = itemIds.length > 0 && checkedCount === itemIds.length;
  const someChecked = checkedCount > 0;

  const handleSectionCheckChange = (checked: boolean) => {
    onSectionCheckAll?.(checked);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Section header with "Check all section" */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-gray-100 bg-gray-50/80">
        <h2 className="text-base font-semibold text-gray-900 truncate">
          {section.title}
        </h2>
        {onSectionCheckAll && section.items.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <Checkbox.Root
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-gray-300 bg-white transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E13447] focus:ring-offset-1 data-[state=checked]:bg-[#E13447] data-[state=checked]:border-[#E13447] data-[state=indeterminate]:bg-[#E13447] data-[state=indeterminate]:border-[#E13447]"
              checked={allChecked ? true : someChecked ? 'indeterminate' : false}
              onCheckedChange={(value) => handleSectionCheckChange(value === true)}
              id={`section-${section.id}`}
            >
              <Checkbox.Indicator className="text-white flex items-center justify-center">
                {allChecked ? (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
                    <rect width="10" height="2" rx="1" />
                  </svg>
                )}
              </Checkbox.Indicator>
            </Checkbox.Root>
            <label
              htmlFor={`section-${section.id}`}
              className="text-xs font-medium text-gray-600 cursor-pointer select-none"
            >
              {allChecked ? 'All done' : someChecked ? `${checkedCount}/${section.items.length}` : 'Check all'}
            </label>
          </div>
        )}
      </div>
      <div className="divide-y divide-gray-100">
        {section.items.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            checked={state[item.id] || false}
            onCheckedChange={(checked) => onItemCheckedChange(item.id, checked)}
          />
        ))}
      </div>
    </div>
  );
}
