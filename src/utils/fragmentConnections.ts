import { WorldFragment } from '../types';

const MAX_CONNECTIONS = 5;

export const sanitizeConnectedFragmentIds = (
  connectedFragmentIds: string[] | undefined,
  fragmentId: string | undefined,
  allowedFragmentIds: Iterable<string>,
) => {
  const allowedIds = new Set(allowedFragmentIds);
  const sanitizedIds: string[] = [];

  for (const connectedId of connectedFragmentIds ?? []) {
    if (
      !connectedId ||
      connectedId === fragmentId ||
      !allowedIds.has(connectedId) ||
      sanitizedIds.includes(connectedId)
    ) {
      continue;
    }

    sanitizedIds.push(connectedId);
    if (sanitizedIds.length >= MAX_CONNECTIONS) break;
  }

  return sanitizedIds;
};

export const sanitizeFragmentConnections = (fragments: WorldFragment[]) => {
  const fragmentIds = new Set(fragments.map((fragment) => fragment.id));

  return fragments.map((fragment) => ({
    ...fragment,
    connectedFragmentIds: sanitizeConnectedFragmentIds(
      fragment.connectedFragmentIds,
      fragment.id,
      fragmentIds,
    ),
  }));
};
