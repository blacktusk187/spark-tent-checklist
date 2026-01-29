import { TentSize, ChecklistState } from '@/types/checklist';

const STORAGE_PREFIX = 'spark-checklist-';

export const getStorageKey = (size: TentSize): string => {
  return `${STORAGE_PREFIX}${size}`;
};

export const loadChecklistState = (size: TentSize): ChecklistState => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = localStorage.getItem(getStorageKey(size));
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading checklist state:', error);
  }

  return {};
};

export const saveChecklistState = (size: TentSize, state: ChecklistState): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(getStorageKey(size), JSON.stringify(state));
  } catch (error) {
    console.error('Error saving checklist state:', error);
  }
};

export const clearChecklistState = (size: TentSize): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(getStorageKey(size));
  } catch (error) {
    console.error('Error clearing checklist state:', error);
  }
};
