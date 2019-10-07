import { createSelector} from 'reselect';

import { getShips, getPlayerShipId } from './selectors';

export function getPlayerShip() {
  return createSelector(
    getShips, getPlayerShipId,
    (ships, playerShipId) => ships[playerShipId]
  );
}