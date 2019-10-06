import React from 'react';
import ReactDOM from 'react-dom';

import { addShip } from '../action/add-ship';
import { addProjectile } from '../action/add-projectile';
import { removeShip } from '../action/remove-ship';
import { setShips, setTime } from '../action/actions';
import { Logger } from '../util/logger';
import { getShips, getTime } from '../model/selector/selectors';
import { getNewStore, getInitialState } from '../model/store';
import { Root } from '../view/root';
import TimeManager from '../util/time-manager';

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

    // setInterval(()=>{
    //   let ships = [...getShips(this.store.getState())];
    //   for (let i = 0; i < ships.length; i++) {
    //     let ship = {...ships[i]};
    //     let position = [...ship.position];
    //     position[0] += 0.005;
    //     // position[2] += 0.005;
    //     ship.position = position;
    //     ships[i] = ship;
    //   }
    //   this.store.dispatch(setShips(ships));
    // }, 16);

    // setTimeout(()=>{
    //   this.store.dispatch(removeShip(0));
    // }, 2000);

    for (let i = 0; i < 2; i++) {
      this.store.dispatch(addShip({
        id: i,
        position: [Math.random(), Math.random(), Math.random()],
        rotation: 45 * Math.random(),
        schematic: [
          [0, 0, 0, 2, 0, 0, 0],
          [0, 0, 2, 2, 2, 0, 0],
          [0, 0, 2, 1, 2, 0, 0],
          [2, 0, 2, 2, 2, 0, 2],
          [2, 2, 2, 2, 2, 2, 2],
          [0, 2, 2, 2, 2, 2, 0],
        ],
      }));
    }

    // TODO Add type to create non linear projectiles
    this.store.dispatch(addProjectile({
      id: 0,
      position: [0, 0, 0],
      direction: [-0.1, 0, 0],
      speed: 0.1,
      time: getTime(this.store.getState())
    }));
  }

  render() {
    ReactDOM.render(<Root store={this.store}/>, document.getElementById('container'));
  }

  update(dt) {
    let currentTime = getTime(this.store.getState());
    this.store.dispatch(setTime(currentTime + dt));
  }
}
