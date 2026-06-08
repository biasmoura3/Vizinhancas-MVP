import { WorldFragment } from '../types';

export interface MapPosition {
  x: number;
  y: number;
}

const INITIAL_FRAGMENT_POSITIONS: Record<string, MapPosition> = {
  'alti-1': { x: 30, y: 25 },
  'poet-2': { x: 74, y: 35 },
  'memb-3': { x: 50, y: 64 },
  'mang-4': { x: 18, y: 72 },
  'flor-5': { x: 82, y: 75 },
  'vale-6': { x: 46, y: 42 },
  'linc-7': { x: 88, y: 55 },
  'vento-8': { x: 14, y: 40 }
};

const MIN_NODE_DISTANCE = 12;
const GRID_X = [12, 26, 40, 54, 68, 82, 94];
const GRID_Y = [16, 30, 44, 58, 72, 86];

const distanceBetween = (a: MapPosition, b: MapPosition) => {
  return Math.hypot(a.x - b.x, a.y - b.y);
};

const isBreathingRoomAvailable = (position: MapPosition, occupied: MapPosition[]) => {
  return occupied.every((existing) => distanceBetween(position, existing) >= MIN_NODE_DISTANCE);
};

const buildCandidatePositions = (): MapPosition[] => {
  return GRID_Y.flatMap((y, rowIndex) => {
    const row = rowIndex % 2 === 0 ? GRID_X : [...GRID_X].reverse();
    return row.map((x) => ({ x, y }));
  });
};

export const getFragmentMapPosition = (fragment: WorldFragment): MapPosition => {
  return fragment.mapPosition ?? INITIAL_FRAGMENT_POSITIONS[fragment.id] ?? { x: 50, y: 50 };
};

export const findOpenMapPosition = (occupied: MapPosition[]): MapPosition => {
  const candidates = buildCandidatePositions();
  const openCandidate = candidates.find((candidate) => isBreathingRoomAvailable(candidate, occupied));

  if (openCandidate) {
    return openCandidate;
  }

  const fallbackIndex = occupied.length;
  const angle = fallbackIndex * 2.399963229728653;
  const radius = 28 + fallbackIndex * 1.4;

  return {
    x: Math.max(8, Math.min(92, 50 + Math.cos(angle) * radius)),
    y: Math.max(12, Math.min(88, 50 + Math.sin(angle) * radius * 0.72))
  };
};

export const ensureFixedMapPositions = (fragments: WorldFragment[]): WorldFragment[] => {
  const occupied: MapPosition[] = [];

  return fragments.map((fragment) => {
    const mapPosition = fragment.mapPosition
      ?? INITIAL_FRAGMENT_POSITIONS[fragment.id]
      ?? findOpenMapPosition(occupied);

    occupied.push(mapPosition);

    if (fragment.mapPosition) {
      return fragment;
    }

    return {
      ...fragment,
      mapPosition
    };
  });
};
