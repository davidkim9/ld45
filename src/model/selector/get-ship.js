import { createSelector} from 'reselect';

import { getShips } from './selectors';

export function getShip(id) {
  return createSelector(
    getShips,
    ships => ships[id]
  );
}
