import React from 'react';
import ReactDOM from 'react-dom';

import { setTime } from '../action/actions';
import { GameController } from './game-controller';
import { Logger } from '../util/logger';
import { getTime } from '../model/selector/selectors';
import { getNewStore, getInitialState } from '../model/store';
import { Root } from '../view/root';

export default class MainController {
  constructor() {
    this.logger = new Logger('MainController');
    Logger.setDebugMode(true);
    
    this.store = getNewStore(getInitialState());
    this.gameController = new GameController(this.store);
  }

  init() {
    this.logger.log('Initialize');
    this.render();
  }

  render() {
    ReactDOM.render(<Root update={dt => this.update(dt)} store={this.store}/>, document.getElementById('container'));
  }

  update(dt) {
    let currentTime = getTime(this.store.getState());
    this.store.dispatch(setTime(currentTime + dt));
  }
}
