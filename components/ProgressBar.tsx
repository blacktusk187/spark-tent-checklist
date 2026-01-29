'use client';

import * as Progress from '@radix-ui/react-progress';

interface ProgressBarProps {
  value: number; // 0-100
  total: number;
  completed: number;
}

export default function ProgressBar({ value, total, completed }: ProgressBarProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">Progress</span>
        <span className="text-gray-600">
          {completed} / {total} items
        </span>
      </div>
      <Progress.Root
        className="relative h-10 w-full overflow-hidden rounded-full bg-gray-200"
        value={value}
      >
        <Progress.Indicator
          className="h-full w-full bg-[#E13447] transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${100 - value}%)` }}
        />
        {value >= 100 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white drop-shadow-sm">
              100% Complete
            </span>
          </div>
        )}
      </Progress.Root>
    </div>
  );
}
