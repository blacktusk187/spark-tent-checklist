'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import * as Label from '@radix-ui/react-label';
import { ChecklistItem as ChecklistItemType } from '@/types/checklist';

interface ChecklistItemProps {
  item: ChecklistItemType;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  isSubItem?: boolean;
}

export default function ChecklistItem({ item, checked, onCheckedChange, isSubItem = false }: ChecklistItemProps) {
  return (
    <div className={`flex items-start gap-3 min-h-[44px] touch-manipulation ${isSubItem ? 'py-2 px-3 sm:px-4' : 'py-3 px-4 sm:px-5'}`}>
      <Checkbox.Root
        className={`flex shrink-0 items-center justify-center rounded border-2 border-gray-300 bg-white transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E13447] focus:ring-offset-2 data-[state=checked]:bg-[#E13447] data-[state=checked]:border-[#E13447] ${isSubItem ? 'h-5 w-5' : 'h-6 w-6'}`}
        checked={checked}
        onCheckedChange={onCheckedChange}
        id={item.id}
      >
        <Checkbox.Indicator className="text-white">
          <svg
            width={isSubItem ? 12 : 16}
            height={isSubItem ? 12 : 16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 4L6 11.5L2.5 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Checkbox.Indicator>
      </Checkbox.Root>
      <Label.Root
        htmlFor={item.id}
        className={`flex-1 cursor-pointer leading-relaxed text-gray-900 select-none ${isSubItem ? 'text-sm' : 'text-base'}`}
      >
        <span>{item.name}</span>
        {item.note && (
          <span className="block mt-1 text-sm text-gray-600 italic">{item.note}</span>
        )}
      </Label.Root>
    </div>
  );
}
