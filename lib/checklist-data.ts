import { TentChecklist, TentSize } from '@/types/checklist';

// Common items for all 30' wide tents
const commonSections = [
  {
    id: 'common-equipment',
    title: 'FOR ALL 30\' WIDE TENTS',
    items: [
      { id: 'top-tension-straps', name: 'Top Tension Straps' },
      { id: 'ballast-tension-straps', name: 'Ballast Tension Straps' },
      { id: 'ladders', name: 'Ladders - min 2, 4 if walls' },
      { id: 'tarp-20x16', name: 'Tarp: 20x16 white' },
      {
        id: 'pulling-bag',
        name: 'Pulling Bag',
        subItems: [
          { id: 'ropes-2x', name: '2x ropes w/ carabiners' },
          { id: 'track-guides-2x', name: '2x track guides' },
          { id: 'keder-feeders-2x', name: '2x keder feeders' },
          { id: 'track-handles-2x', name: '2x track handles' },
        ],
      },
      { id: 'cleaning-products', name: 'Cleaning products' },
      { id: 'towels', name: 'Towels' },
    ],
  },
  {
    id: 'stakes',
    title: 'Stakes',
    items: [
      { id: 'stake-driver', name: 'Stake driver', note: '*Charge and bring both batteries*' },
      { id: 'stake-puller', name: 'Stake Puller' },
      { id: 'sledge-hammer', name: 'Sledge hammer' },
      { id: 'big-blue-wrench', name: 'Big Blue Wrench' },
      { id: 'stake-caps', name: 'Stake Caps' },
    ],
  },
  {
    id: 'concrete',
    title: 'Concrete / Water Barrels',
    items: [
      { id: 'concrete-dolly', name: 'Concrete dolly w/ chain & hook' },
      { id: 'electric-pallet-jack', name: 'Electric pallet jack', note: '*Charge Battery*' },
      { id: 'ice-torch', name: 'Possible Ice: Torch' },
    ],
  },
];

// Size-specific hardware sections
const getSpecificHardware = (size: TentSize): { id: string; title: string; items: Array<{ id: string; name: string }> } => {
  const sizeMap: Record<TentSize, { length: number; hipEnds: number; hipCorners: number; hipMids: number; rafters: number; eaves: number; legs: number; ridgeConnectors: number; cornerConnectors: number; perimeterConnectors: number; braceBars: number; tensioningStraps: number; ballastingStraps: number; stakes: number; concrete: number }> = {
    '30x30': { length: 30, hipEnds: 2, hipCorners: 4, hipMids: 2, rafters: 2, eaves: 8, legs: 8, ridgeConnectors: 1, cornerConnectors: 4, perimeterConnectors: 4, braceBars: 5, tensioningStraps: 8, ballastingStraps: 8, stakes: 16, concrete: 8 },
    '30x45': { length: 45, hipEnds: 2, hipCorners: 4, hipMids: 4, rafters: 4, eaves: 12, legs: 12, ridgeConnectors: 1, cornerConnectors: 4, perimeterConnectors: 6, braceBars: 7, tensioningStraps: 12, ballastingStraps: 12, stakes: 24, concrete: 12 },
    '30x60': { length: 60, hipEnds: 2, hipCorners: 4, hipMids: 6, rafters: 6, eaves: 16, legs: 16, ridgeConnectors: 1, cornerConnectors: 4, perimeterConnectors: 8, braceBars: 9, tensioningStraps: 16, ballastingStraps: 16, stakes: 32, concrete: 16 },
    '30x75': { length: 75, hipEnds: 2, hipCorners: 4, hipMids: 8, rafters: 8, eaves: 20, legs: 20, ridgeConnectors: 1, cornerConnectors: 4, perimeterConnectors: 10, braceBars: 11, tensioningStraps: 20, ballastingStraps: 20, stakes: 40, concrete: 20 },
  };

  const config = sizeMap[size];

  return {
    id: 'specific-hardware',
    title: `${size} FRAME SPECIFIC HARDWARE`,
    items: [
      { id: 'hip-end-tops', name: `${config.hipEnds}x hip end 15' wide tops` },
      { id: 'hip-corner-rafters', name: `${config.hipCorners}x hip corner rafters` },
      { id: 'hip-mid-rafters', name: `${config.hipMids}x hip mid rafters` },
      { id: 'rafters', name: `${config.rafters}x rafters` },
      { id: 'eaves', name: `${config.eaves}x eaves` },
      { id: 'legs-base-plates', name: `${config.legs}x legs with base plates (feet)` },
      { id: 'ridge-connector', name: `${config.ridgeConnectors}x 8 way ridge connector` },
      { id: 'corner-connectors', name: `${config.cornerConnectors}x corner connectors` },
      { id: 'perimeter-connectors', name: `${config.perimeterConnectors}x perimeter connectors` },
      { id: 'brace-bars', name: `${config.braceBars}x brace bars` },
      { id: 'tensioning-straps', name: `${config.tensioningStraps}x Tensioning straps` },
      { id: 'ballasting-straps', name: `${config.ballastingStraps}x Ballasting Straps (max)` },
    ],
  };
};

export const getChecklist = (size: TentSize): TentChecklist => {
  return {
    size,
    commonSections,
    specificSections: [getSpecificHardware(size)],
  };
};

export const getAllTentSizes = (): TentSize[] => {
  return ['30x30', '30x45', '30x60', '30x75'];
};
