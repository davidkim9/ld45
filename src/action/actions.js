import * as ActionTypes from '../model/action-types';

export function setEntities(state) {
  return {
    type: ActionTypes.ENTITIES_DID_CHANGE,
    payload: state
  };
}

export function setTime(state) {
  return {
    type: ActionTypes.TIME_DID_CHANGE,
    payload: state
  };
}