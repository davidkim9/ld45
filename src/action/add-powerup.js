import { setPowerups } from './actions';
import { getPowerups } from '../model/selector/selectors';

export function addPowerup(projectile) {
  return (dispatch, getState) => {
    let projectiles = {...getPowerups(getState())};
    
    projectiles[projectile.id] = projectile;
    dispatch(setPowerups(projectiles));
  };
}
