'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';

export type ToastVariant = 'reset' | 'complete';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

const variantStyles: Record<
  ToastVariant,
  { root: string; title: string; description: string }
> = {
  reset: {
    root: 'rounded-2xl border border-red-200 bg-red-50 p-4 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full',
    title: 'text-sm font-semibold text-[#E13447]',
    description: 'mt-1 text-sm text-red-700/80',
  },
  complete: {
    root: 'rounded-2xl border border-green-200 bg-green-50 p-4 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full',
    title: 'text-sm font-semibold text-green-700',
    description: 'mt-1 text-sm text-green-800/80',
  },
};

const defaultStyles = {
  root: 'rounded-2xl border border-gray-200 bg-white p-4 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full',
  title: 'text-sm font-semibold text-gray-900',
  description: 'mt-1 text-sm text-gray-600',
};

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastState, setToastState] = useState<ToastOptions & { open: boolean }>({
    title: '',
    open: false,
  });

  const toast = useCallback((options: ToastOptions) => {
    setToastState({ ...options, open: true });
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) setToastState((prev) => ({ ...prev, open: false }));
  }, []);

  const styles = toastState.variant ? variantStyles[toastState.variant] : defaultStyles;

  return (
    <ToastContext.Provider value={{ toast }}>
      <Toast.Provider duration={4500} swipeDirection="right">
        {children}
        <Toast.Viewport className="fixed bottom-4 right-4 z-[100] flex max-h-screen w-full max-w-[380px] flex-col gap-2 outline-none" />
        <Toast.Root
          open={toastState.open}
          onOpenChange={handleOpenChange}
          className={styles.root}
        >
          <Toast.Title className={styles.title}>
            {toastState.title}
          </Toast.Title>
          {toastState.description && (
            <Toast.Description className={styles.description}>
              {toastState.description}
            </Toast.Description>
          )}
        </Toast.Root>
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
