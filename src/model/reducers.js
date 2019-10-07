import * as ActionTypes from './action-types';

export function moveDirection(state, action) {
  switch (action.type) {
    case ActionTypes.MOVE_DIRECTION_DID_CHANGE:
      return action.payload;
    default:
      return state;
  }
}

export function playerShipId(state, action) {
  switch (action.type) {
    case ActionTypes.PLAYER_SHIP_ID_DID_CHANGE:
      return action.payload;
    default:
      return state;
  }
}

export function powerups(state, action) {
  switch (action.type) {
    case ActionTypes.POWERUPS_DID_CHANGE:
      return action.payload;
    default:
      return state;
  }
}

export function projectiles(state, action) {
  switch (action.type) {
    case ActionTypes.PROJECTILES_DID_CHANGE:
      return action.payload;
    default:
      return state;
  }
}

export function ships(state, action) {
  switch (action.type) {
    case ActionTypes.SHIPS_DID_CHANGE:
      return action.payload;
    default:
      return state;
  }
}

export function time(state, action) {
  switch (action.type) {
    case ActionTypes.TIME_DID_CHANGE:
      return action.payload;
    default:
      return state;
  }
}
