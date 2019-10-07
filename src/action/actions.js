import * as ActionTypes from '../model/action-types';

export function setMoveDirection(state) {
  return {
    type: ActionTypes.MOVE_DIRECTION_DID_CHANGE,
    payload: state
  };
}

export function setPlayerShipId(state) {
  return {
    type: ActionTypes.PLAYER_SHIP_ID_DID_CHANGE,
    payload: state
  };
}

export function setPowerups(state) {
  return {
    type: ActionTypes.POWERUPS_DID_CHANGE,
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
