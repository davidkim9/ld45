import { setShips } from './actions';
import { getShips } from '../model/selector/selectors';

export function setShip(id, ship) {
  return (dispatch, getState) => {
    let ships = {...getShips(getState())};

    ships[id] = ship;
    dispatch(setShips(ships));
  };
}