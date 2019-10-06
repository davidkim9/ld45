import { setShips } from './actions';
import { removeById } from '../util/remove-by-id';
import { getShips } from '../model/selector/selectors';

export function removeShip(id) {
  return (dispatch, getState) => {
    let ships = [...getShips(getState())];

    removeById(ships, id);

    dispatch(setShips(ships));
  };
}
