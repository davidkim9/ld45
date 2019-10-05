import * as ActionTypes from './action-types';

export function time(state, action) {
  switch (action.type) {
    case ActionTypes.TIME_DID_CHANGE:
      return action.payload;
    default:
      return state;
  }
}