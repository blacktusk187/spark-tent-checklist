import Link from 'next/link';
import { getAllTentSizes } from '@/lib/checklist-data';

export default function Home() {
  const tentSizes = getAllTentSizes();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Tent Checklist System
        </h1>
        <p className="text-gray-600 mb-6">
          Select a tent size from the left to load the checklist, or choose one below:
        </p>
        <div className="grid grid-cols-2 gap-3">
          {tentSizes.map((size) => (
            <Link
              key={size}
              href={`/checklist/${size}`}
              className="flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 py-4 text-lg font-semibold text-gray-800 transition-colors"
            >
              {size}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
