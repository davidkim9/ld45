import { setShips } from './actions';
import { getShips } from '../model/selector/selectors';

export function addShip(ship) {
  return (dispatch, getState) => {
    let ships = {...getShips(getState())};
    
    ships[ship.id] = ship;
    dispatch(setShips(ships));
  };
}
