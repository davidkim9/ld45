import * as ActionTypes from './action-types';

export function entities(state, action) {
  switch (action.type) {
    case ActionTypes.ENTITIES_DID_CHANGE:
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