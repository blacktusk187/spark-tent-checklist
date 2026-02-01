'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getTentSizesByGroup } from '@/lib/checklist-data';
import { TentSize } from '@/types/checklist';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { '30x': sizes30x, '40x': sizes40x } = getTentSizesByGroup();
  const currentSize = pathname?.startsWith('/checklist/')
    ? (pathname.replace('/checklist/', '') as TentSize)
    : null;

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* Centered column - 80% width like LinkedIn */}
      <div className="w-[80%] max-w-6xl mx-auto min-h-screen flex flex-col bg-white shadow-sm">
        {/* Logo header */}
        <header className="shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/spark-logo.png"
              alt="Spark Event Rentals"
              width={48}
              height={48}
              className="rounded-full object-contain"
            />
            <span className="font-semibold text-gray-800 hidden sm:inline">Spark Event Rentals</span>
          </Link>
          <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">
            Frame Tent Load Outs
          </h1>
        </header>

        {/* Main: sidebar + content */}
        <div className="flex-1 flex min-h-0 items-start bg-[#f3f2ef]">
          {/* Left sidebar - all corners rounded, matches height of main content */}
          <aside className="w-56 shrink-0 bg-white border border-gray-200 px-4 pt-4 sm:pt-6 pb-4 hidden sm:block rounded-2xl mx-4 sm:mx-6 self-stretch">
            <nav className="space-y-3">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                30x Frame Tent
              </div>
              {sizes30x.map((size) => {
                const href = `/checklist/${size}`;
                const isActive = currentSize === size;
                return (
                  <Link
                    key={size}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{size}</span>
                  </Link>
                );
              })}
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2 pt-2">
                40x Frame Tent
              </div>
              {sizes40x.map((size) => {
                const href = `/checklist/${size}`;
                const isActive = currentSize === size;
                return (
                  <Link
                    key={size}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{size}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Center column - main content */}
          <main className="flex-1 min-w-0 bg-[#f3f2ef] px-4 sm:px-6 pb-4 sm:pb-6 overflow-auto min-h-full">
            {children}
          </main>
        </div>

        {/* Mobile: tent selector at bottom when no sidebar */}
        <div className="sm:hidden bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[...sizes30x, ...sizes40x].map((size) => {
              const isActive = currentSize === size;
              return (
                <Link
                  key={size}
                  href={`/checklist/${size}`}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                    isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {size}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
