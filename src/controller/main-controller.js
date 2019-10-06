import React from 'react';
import ReactDOM from 'react-dom';

import { setEntities } from '../action/actions';
import { Logger } from '../util/logger';
import { getTime } from '../model/selector/selectors';
import { getNewStore, getInitialState } from '../model/store';
import TimeManager from '../util/time-manager';
import { Root } from '../view/root';

export default class MainController {
  constructor() {
    this.logger = new Logger('MainController');
    Logger.setDebugMode(true);
    
    this.store = getNewStore(getInitialState());
    this.timeManager = new TimeManager();
  }

  init() {
    this.logger.log('Initialize');
    this.timeManager.register(dt => this.update(dt));
    this.timeManager.start();
    this.render();

    setTimeout(()=>{
this.store.dispatch(setEntities([{}]));
    }, 2000);
  }

  render() {
    ReactDOM.render(<Root store={this.store}/>, document.getElementById('container'));
  }

  update(dt) {
    let currentTime = getTime(this.store.getState());
    // this.store.dispatch(setTime(currentTime + dt));
  }
}
