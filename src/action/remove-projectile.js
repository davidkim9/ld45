import { setProjectiles } from './actions';
import { getProjectiles } from '../model/selector/selectors';

export function removeProjectile(id) {
  return (dispatch, getState) => {
    let projectiles = {...getProjectiles(getState())};

    delete projectiles[id];
    dispatch(setProjectiles(projectiles));
  };
}
