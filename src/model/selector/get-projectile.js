import { createSelector} from 'reselect';

import { getProjectiles } from './selectors';

export function getProjectile(id) {
  return createSelector(
    getProjectiles,
    projectiles => projectiles[id]
  );
}
