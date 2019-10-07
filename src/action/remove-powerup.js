import { setPowerups } from './actions';
import { getPowerups } from '../model/selector/selectors';

export function removePowerup(id) {
  return (dispatch, getState) => {
    let powerups = {...getPowerups(getState())};

    delete powerups[id];
    dispatch(setPowerups(powerups));
  };
}
