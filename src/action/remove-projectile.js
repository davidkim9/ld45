import { setProjectiles } from './actions';
import { removeById } from '../util/remove-by-id';
import { getProjectiles } from '../model/selector/selectors';

export function removeProjectile(id) {
  return (dispatch, getState) => {
    let projectiles = [...getProjectiles(getState())];

    removeById(projectiles, id);

    dispatch(setProjectiles(projectiles));
  };
}
