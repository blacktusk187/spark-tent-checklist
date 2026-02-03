'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';

interface ToastOptions {
  title: string;
  description?: string;
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

  return (
    <ToastContext.Provider value={{ toast }}>
      <Toast.Provider duration={4500} swipeDirection="right">
        {children}
        <Toast.Viewport className="fixed bottom-4 right-4 z-[100] flex max-h-screen w-full max-w-[380px] flex-col gap-2 outline-none" />
        <Toast.Root
          open={toastState.open}
          onOpenChange={handleOpenChange}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full"
        >
          <Toast.Title className="text-sm font-semibold text-gray-900">
            {toastState.title}
          </Toast.Title>
          {toastState.description && (
            <Toast.Description className="mt-1 text-sm text-gray-600">
              {toastState.description}
            </Toast.Description>
          )}
        </Toast.Root>
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
