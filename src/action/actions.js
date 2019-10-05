import * as ActionTypes from '../model/action-types';

export function setTime(state) {
  return {
    type: ActionTypes.TIME_DID_CHANGE,
    payload: state
  };
}