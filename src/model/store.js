import { applyMiddleware, compose, createStore } from 'redux';
import reduxThunkMiddleware from 'redux-thunk';

import * as Reducers from './reducers';

export function getNewStore(initialState) {
  let globalReducer = (state, action) => {
    let reducers = {};
    for (let reducerKey in Reducers) {
      reducers[reducerKey] = Reducers[reducerKey](state[reducerKey], action);
    }
    return reducers;
  };
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const middleWareEnhancer = applyMiddleware(reduxThunkMiddleware);

  return createStore(globalReducer, initialState, composeEnhancers(middleWareEnhancer));
}

export function getInitialState() {
  let state = {
    time: 0
  };

  return state;
}