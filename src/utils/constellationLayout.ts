import { WorldFragment } from '../types';

export interface MapPosition {
  x: number;
  y: number;
}

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
  return fragment.mapPosition ?? { x: 50, y: 50 };
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
    const mapPosition = fragment.mapPosition ?? findOpenMapPosition(occupied);

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
