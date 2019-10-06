import { setShips } from './actions';
import { getShips } from '../model/selector/selectors';

export function changeShip(id, ship) {
  return (dispatch, getState) => {
    let ships = [...getShips(getState())];
    let index = -1;

    for (let i = 0; i < ships.length; i++) {
      if (ships[i].id === id) {
        index = i;
        break;
      }
    }
    if (index > -1) {
      ships[index] = ship;
    }

    dispatch(setShips(ships));
  };
}