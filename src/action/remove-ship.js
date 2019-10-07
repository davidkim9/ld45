import { setShips } from './actions';
import { getShips } from '../model/selector/selectors';

export function removeShip(id) {
  return (dispatch, getState) => {
    let ships = {...getShips(getState())};

    delete ships[id];
    dispatch(setShips(ships));
  };
}
