export type TentSize =
  | '30x30'
  | '30x45'
  | '30x60'
  | '30x75'
  | '40x40'
  | '40x60'
  | '40x80'
  | '40x100';

export interface ChecklistItem {
  id: string;
  name: string;
  note?: string; // Optional note like "*Charge Battery*"
  subItems?: ChecklistItem[]; // Optional nested sub-checkboxes
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
