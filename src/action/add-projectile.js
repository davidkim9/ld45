import { setProjectiles } from './actions';
import { getProjectiles } from '../model/selector/selectors';

export function addProjectile(projectile) {
  return (dispatch, getState) => {
    let projectiles = [...getProjectiles(getState()), projectile];
    
    dispatch(setProjectiles(projectiles));
  };
}
