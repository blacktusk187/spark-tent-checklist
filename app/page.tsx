import Link from 'next/link';
import { getTentSizesByGroup } from '@/lib/checklist-data';

export default function Home() {
  const { '30x': sizes30x, '40x': sizes40x } = getTentSizesByGroup();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Tent Checklist System
        </h1>
        <p className="text-gray-600 mb-6">
          Select a tent size from the left to load the checklist, or choose one below:
        </p>

        {/* 30x Frame Tent box */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-3">30x Frame Tent</h2>
          <div className="grid grid-cols-2 gap-3">
            {sizes30x.map((size) => (
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

        {/* 40x Frame Tent box */}
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3">40x Frame Tent</h2>
          <div className="grid grid-cols-2 gap-3">
            {sizes40x.map((size) => (
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
    </div>
  );
}
