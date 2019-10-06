import * as ActionTypes from '../model/action-types';

export function setEffects(state) {
  return {
    type: ActionTypes.EFFECTS_DID_CHANGE,
    payload: state
  };
}

export function setProjectiles(state) {
  return {
    type: ActionTypes.PROJECTILES_DID_CHANGE,
    payload: state
  };
}

export function setShips(state) {
  return {
    type: ActionTypes.SHIPS_DID_CHANGE,
    payload: state
  };
}

export function setTime(state) {
  return {
    type: ActionTypes.TIME_DID_CHANGE,
    payload: state
  };
}
