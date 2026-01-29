export type TentSize = '30x30' | '30x45' | '30x60' | '30x75';

export interface ChecklistItem {
  id: string;
  name: string;
  note?: string; // Optional note like "*Charge Battery*"
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface TentChecklist {
  size: TentSize;
  commonSections: ChecklistSection[];
  specificSections: ChecklistSection[];
}

export interface ChecklistState {
  [itemId: string]: boolean;
}
