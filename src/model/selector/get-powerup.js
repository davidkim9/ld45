import { createSelector} from 'reselect';

import { getPowerups } from './selectors';

export function getPowerup(id) {
  return createSelector(
    getPowerups,
    powerups => powerups[id]
  );
}
