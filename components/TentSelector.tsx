'use client';

import Link from 'next/link';
import { getAllTentSizes } from '@/lib/checklist-data';
import { TentSize } from '@/types/checklist';

export default function TentSelector() {
  const tentSizes = getAllTentSizes();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
      {tentSizes.map((size) => (
        <Link
          key={size}
          href={`/checklist/${size}`}
          className="group relative overflow-hidden rounded-lg border-2 border-gray-300 bg-white p-6 text-center transition-all hover:border-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {size}
          </div>
          <div className="mt-2 text-sm text-gray-600">Frame Tent</div>
          <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
        </Link>
      ))}
    </div>
  );
}
