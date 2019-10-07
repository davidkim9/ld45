import { Vector2 } from 'three';

import { setMoveDirection } from '../action/actions';

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
    direction.multiplyScalar(0.0002);

    this.store.dispatch(setMoveDirection({x: direction.x, y: direction.y, rotation: rotate}));
  }
}