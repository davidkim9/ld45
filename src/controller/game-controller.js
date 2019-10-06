import { Matrix4, Ray, Vector3 } from 'three';

import { addShip } from '../action/add-ship';
import { changeShip } from '../action/change-ship';
import { addProjectile } from '../action/add-projectile';
import { removeShip } from '../action/remove-ship';
import { setShips, setTime } from '../action/actions';
import { Logger } from '../util/logger';
import { getShips, getTime, getProjectiles } from '../model/selector/selectors';
import { Ship } from '../view/three/ship';
import { getShipGeometry } from '../util/get-ship-geometry';
import { storeObserver } from '../util/store-observer';
import { getProjectilePosition } from '../util/get-projectile-position';

export class GameController {
  constructor(store) {
    this.logger = new Logger('GameController');
    this.store = store;

    this.addScene();
  }

  checkCollision(ship, projectile) {
    let transform = new Matrix4();
    transform.makeRotationY(ship.rotation);
    transform.setPosition(ship.position[0], ship.position[1], ship.position[2]);

    let shipSchematic = ship.schematic;
    let shipGeometry = getShipGeometry(shipSchematic);

    let position = new Vector3();
    position.fromArray(projectile.position);
    
    let direction = new Vector3();
    direction.fromArray(projectile.direction);

    let target = new Vector3();

    let projectileRay = new Ray(position, direction);
    let hitTiles = [];

    for (let i = 0; i < shipGeometry.length; i++) {
      for (let j = 0; j < shipGeometry[i].length; j++) {
        let box = shipGeometry[i][j];
        if (box !== null) {
          box.applyMatrix4( transform );
          let ray = projectileRay.intersectBox(box, target);
          if (ray !== null) {
            let distance = position.clone().sub(target);
            hitTiles.push({
              x: j,
              y: i,
              t: distance.length()
            });
          }
        }
      }
    }

    // TODO Make sure to break off islands of floating ship parts
    return hitTiles;
  }

  addScene() {

    setInterval(()=>{
      let ships = [...getShips(this.store.getState())];
      for (let i = 0; i < ships.length; i++) {
        let ship = {...ships[i]};
        let position = [...ship.position];
        position[0] -= 0.005;
        position[2] += 0.005;
        ship.position = position;
        ships[i] = ship;
      }
      this.store.dispatch(setShips(ships));
    }, 16);

    // setTimeout(()=>{
    //   this.store.dispatch(removeShip(0));
    // }, 2000);

    this.store.dispatch(addShip({
      id: 0,
      position: [1, 0, -1],
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
      position: [3.1, 0, 0],
      direction: [-1, 0, 0],
      time: getTime(this.store.getState())
    }));
  }

  update(dt) {
    let time = getTime(this.store.getState());
    let ships = getShips(this.store.getState());
    let projectiles = getProjectiles(this.store.getState());
    for (let ship of ships) {
      for (let projectile of projectiles) {
        let hitTiles = this.checkCollision(ship, projectile, time);
        ship.schematic = [...ship.schematic];
        let newSchematic = ship.schematic.map(arr => [...arr]);
        let shipChanged = false;
        for (let i = 0; i < hitTiles.length; i++) {
          let hit = hitTiles[i];
          hit.t - dt
          if (hit.t < time && hit.t > time - dt) {
            shipChanged = true;
            newSchematic[hit.y][hit.x] = 0;
          }
        }
        ship.schematic = newSchematic;

        if (shipChanged === true) {
          this.store.dispatch(changeShip(ship.id, ship));
        }
      }
    }
  }
}