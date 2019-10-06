import { Matrix4, Ray, Vector3 } from 'three';

import { addShip } from '../action/add-ship';
import { changeShip } from '../action/change-ship';
import { addProjectile } from '../action/add-projectile';
import { removeShip } from '../action/remove-ship';
import { removeProjectile } from '../action/remove-projectile';
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
    let hitTiles = [];
    let transform = new Matrix4();
    transform.makeRotationY(ship.rotation);
    transform.setPosition(ship.position[0], ship.position[1], ship.position[2]);

    // TODO Add a way to check bounding box of ship schematic before performing independent collision checks
    let position = new Vector3();
    position.fromArray(projectile.position);
    
    let direction = new Vector3();
    direction.fromArray(projectile.direction);

    let target = new Vector3();
    let shipSchematic = ship.schematic;
    let shipGeometry = getShipGeometry(shipSchematic);
    let projectileRay = new Ray(position, direction);

    for (let i = 0; i < shipGeometry.length; i++) {
      for (let j = 0; j < shipGeometry[i].length; j++) {
        let box = shipGeometry[i][j];
        if (box !== null) {
          box.applyMatrix4( transform );
          if (projectileRay.intersectBox(box, target) !== null) {
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
        ship.rotation += 0.05;
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
      position: [3.2, 0, 0],
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
        let hitTiles = this.checkCollision(ship, projectile);
        let newSchematic = ship.schematic.map(arr => [...arr]);
        let shipChanged = false;
        for (let i = 0; i < hitTiles.length; i++) {
          let hit = hitTiles[i];
          // Register hits if it lands between the last frame and this frame
          if (hit.t < time && hit.t > time - dt) {
            shipChanged = true;
            newSchematic[hit.y][hit.x] = 0;
          }
        }
        if (shipChanged === true) {
          ship.schematic = newSchematic;
          this.store.dispatch(changeShip(ship.id, ship));
        }
      }
    }

    for (let projectile of projectiles) {
      if (time - projectile.time > 5) {
        this.store.dispatch(removeProjectile(projectile.id));
      }
    }
  }
}