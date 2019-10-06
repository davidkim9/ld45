import { Matrix4, Ray, Vector3 } from 'three';

import { addShip } from '../action/add-ship';
import { changeShip } from '../action/change-ship';
import { addProjectile } from '../action/add-projectile';
import { removeShip } from '../action/remove-ship';
import { setShips, setTime } from '../action/actions';
import { Logger } from '../util/logger';
import { getShips, getTime } from '../model/selector/selectors';
import { Ship } from '../view/three/ship';
import { getShipGeometry } from '../util/get-ship-geometry';

export class GameController {
  constructor(store) {
    this.logger = new Logger('GameController');
    this.store = store;

    this.addListeners();
    this.addScene();

    this.checkCollision();
  }

  addListeners() {
    
  }

  checkCollision(ship, projectile) {
    projectile = {
      position: [1, 0, 0],
      direction: [-1, 0, 0],
      time: 0
    }

    var transform = new Matrix4();
    transform.makeRotationY(45 * Math.PI / 180);
    transform.setPosition(0, 0, -0.1);

    // let position = new Vector3();
    // let rotation = new Vector3();

    let shipSchematic = [
      [0, 0, 0, 2, 0, 0, 0],
      [0, 0, 2, 2, 2, 0, 0],
      [0, 0, 2, 1, 2, 0, 0],
      [2, 0, 2, 2, 2, 0, 2],
      [2, 2, 2, 2, 2, 2, 2],
      [0, 2, 2, 2, 2, 2, 0],
    ];

    let shipGeometry = getShipGeometry(shipSchematic);

    let position = new Vector3();
    position.fromArray(projectile.position);
    
    let direction = new Vector3();
    direction.fromArray(projectile.direction);

    let core = shipGeometry[2][3];
    let target = new Vector3();

    let projectileRay = new Ray(position, direction);

    for (let i = 0; i < shipGeometry.length; i++) {
      for (let j = 0; j < shipGeometry[i].length; j++) {
        let box = shipGeometry[i][j];
        if (box !== null) {
          box.applyMatrix4( transform );
          let ray = projectileRay.intersectBox(box, target);
          if (ray !== null) {
            let diff = position.sub(target);
            console.log('Hit', i, j, diff.length());
            shipSchematic[i][j] = 0;
          }
        }
      }
    }

    this.store.dispatch(changeShip(0, {
      id: 0,
      position: [0, 0, -0.1],
      rotation: 45 * Math.PI / 180,
      schematic: shipSchematic,
    }));

    // TODO Make sure to break off islands of floating ship parts
  }

  addScene() {

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

    this.store.dispatch(addShip({
      id: 0,
      position: [0, 0, -0.1],
      rotation: 45 * Math.PI / 180,
      schematic: [
        [0, 0, 0, 2, 0, 0, 0],
        [0, 0, 2, 2, 2, 0, 0],
        [0, 0, 2, 1, 2, 0, 0],
        [2, 0, 2, 2, 2, 0, 2],
        [2, 2, 2, 2, 2, 2, 2],
        [0, 2, 2, 2, 2, 2, 0],
      ],
    }));

    // TODO Add type to create non linear projectiles
    this.store.dispatch(addProjectile({
      id: 0,
      position: [1, 0, 0],
      direction: [-1, 0, 0],
      time: getTime(this.store.getState())
    }));
  }

  update(time) {

  }
}