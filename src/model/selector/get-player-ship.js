import { createSelector} from 'reselect';

import { getShips } from './selectors';

export function getPlayerShip() {
  return createSelector(
    getShips,
    (ships) => {
      return ships[0];
    }
  );
}