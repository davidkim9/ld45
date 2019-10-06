import { Vector2 } from 'three';

import { changeShip } from '../action/change-ship';
import { getShips } from '../model/selector/selectors';

export class PlayerController {
  constructor(store) {
    this.store = store;
    this.keyState = {};
  }

  keyHandler(event) {
    // console.log(event.keyCode);
    this.keyState[event.keyCode] = event.type === 'keydown';
  }

  update(dt) {
    let direction = new Vector2();
    let rotate = 0;
    if (this.keyState['38'] === true) {
      // Up
      direction.y -= 1;
    }
    if (this.keyState['40'] === true) {
      // Down
      direction.y += 1;
    }
    if (this.keyState['37'] === true) {
      // Left
      rotate += 1 * Math.PI / 180;
    }
    if (this.keyState['39'] === true) {
      // Right
      rotate -= 1 * Math.PI / 180;
    }
    direction.normalize();
    direction.multiplyScalar(0.00005);

    let ships = getShips(this.store.getState());
    let playerShip = {...ships[0]};
    let acceleration = [...playerShip.acceleration];
    direction.rotateAround(new Vector2(), -playerShip.rotation);
    acceleration[0] += direction.x;
    acceleration[2] += direction.y;
    playerShip.acceleration = acceleration;
    playerShip.rotation += rotate;
    this.store.dispatch(changeShip(playerShip.id, playerShip));
  }
}