import { Matrix4, Ray, Vector2, Vector3 } from 'three';

import { addShip } from '../action/add-ship';
import { setShip } from '../action/set-ship';
import { addProjectile } from '../action/add-projectile';
import { removeProjectile } from '../action/remove-projectile';
import { Logger } from '../util/logger';
import { getShips, getTime, getProjectiles, getPlayerShipId, getMoveDirection } from '../model/selector/selectors';
import { getShipGeometry } from '../util/get-ship-geometry';

export class GameController {
  constructor(store) {
    this.logger = new Logger('GameController');
    this.store = store;

    this.addScene();
  }

  addScene() {
    this.store.dispatch(addShip({
      id: 0,
      position: [0, 0, 0],
      velocity: [0.001, 0, 0],
      acceleration: [0, 0, 0],
      rotation: 0,
      schematic: [
        [0, 0, 0, 2, 0, 0, 0],
        [0, 0, 2, 2, 2, 0, 0],
        [0, 0, 2, 1, 2, 0, 0],
        [3, 0, 2, 2, 2, 0, 3],
        [2, 2, 2, 2, 2, 2, 2],
        [0, 2, 2, 2, 2, 2, 0],
      ],
    }));

    this.store.dispatch(addShip({
      id: 1,
      position: [2, 0, 0],
      velocity: [0, 0, 0],
      acceleration: [0, 0, 0],
      rotation: 0,
      schematic: [
        [0, 0, 0, 2, 0, 0, 0],
        [0, 0, 2, 2, 2, 0, 0],
        [0, 0, 2, 1, 2, 0, 0],
        [3, 0, 2, 2, 2, 0, 3],
        [2, 2, 2, 2, 2, 2, 2],
        [0, 2, 2, 2, 2, 2, 0],
      ],
    }));
  }

  applyMotionControls(ship) {
    let playerMoveDirection = getMoveDirection(this.store.getState());
    let direction = new Vector2(playerMoveDirection.x, playerMoveDirection.y);
    let acceleration = [...ship.acceleration];
    direction.rotateAround(new Vector2(), -ship.rotation);
    acceleration[0] += direction.x;
    acceleration[2] += direction.y;
    ship.acceleration = acceleration;
    ship.rotation += playerMoveDirection.rotation;
  }

  checkCollision(shipGeometry, projectile) {
    let hitTiles = [];
    
    // TODO Add a way to check bounding box of ship schematic before performing independent collision checks
    let position = new Vector3();
    let direction = new Vector3();
    position.fromArray(projectile.position);
    direction.fromArray(projectile.direction);

    let target = new Vector3();
    let projectileRay = new Ray(position, direction);

    for (let i = 0; i < shipGeometry.length; i++) {
      for (let j = 0; j < shipGeometry[i].length; j++) {
        let box = shipGeometry[i][j];
        if (box !== null) {
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

  collideWithProjectiles(time, dt, ship, shipGeometry) {
    let projectiles = getProjectiles(this.store.getState());
    let projectileList = Object.values(projectiles);
    // Check Projectile Collision
    for (let projectile of projectileList) {
      if (projectile.owner !== ship.id) {
        let hitTiles = this.checkCollision(shipGeometry, projectile);
        // Copy 2D Array
        let newSchematic = ship.schematic.map(arr => [...arr]);
        let shipChanged = false;
        for (let i = 0; i < hitTiles.length; i++) {
          let hit = hitTiles[i];
          let hitTime = projectile.time + hit.t;
          // Register hits if it lands between the last frame and this frame
          if (hitTime < time && hitTime > time - dt) {
            shipChanged = true;
            newSchematic[hit.y][hit.x] = 0;
            // TODO Add a way to drop powerups for other ships
          }
        }
        if (shipChanged === true) {
          ship.schematic = newSchematic;
          this.store.dispatch(removeProjectile(projectile.id));
        }
      }
    }
  }

  findTarget(attackerShip, weaponPosition) {
    let ships = getShips(this.store.getState());
    let position = new Vector3();
    let targetPosition = null;

    // TODO Find a way to shoot away from the ship
    let shipList = Object.values(ships);
    for (let ship of shipList) {
      if (ship.id !== attackerShip.id) {
        position.fromArray(ship.position);
        let diff = position.clone().sub(weaponPosition);
        if (diff.length() < 1) {
          targetPosition = position.clone();
          break;
        }
      }
    }

    return targetPosition;
  }

  triggerShipWeapons(time, dt, ship, shipGeometry) {
    // Weapon Tick
    // TODO Register bullets to be processed outside the ship loop
    let tickTime = 1;
    if (Math.floor(time / tickTime) !== Math.floor((time - dt)/ tickTime)){
      let weaponPosition = new Vector3();
      let shipSchematic = ship.schematic;
      for (let i = 0; i < shipGeometry.length; i++) {
        for (let j = 0; j < shipGeometry[i].length; j++) {
          if (shipSchematic[i][j] === 3) {
            let box = shipGeometry[i][j];
            if (box !== null) {
              box.getCenter(weaponPosition);
              let target = this.findTarget(ship, weaponPosition);
              if (target !== null) {
                target.sub(weaponPosition);
                target.normalize();
                this.store.dispatch(addProjectile({
                  // TODO Find a better way to get projectile id
                  id: Math.random(),
                  owner: ship.id,
                  position: weaponPosition.toArray(),
                  direction: target.toArray(),
                  time: getTime(this.store.getState())
                }));
              }
            }
          }
        }
      }
    }
  }

  // Game Loop
  update(dt) {
    let state = this.store.getState();
    let time = getTime(state);
    let projectiles = getProjectiles(state);
    let playerShipId = getPlayerShipId(state);
    let ships = getShips(state);

    // TODO Add AI loop

    let shipList = Object.values(ships);
    for (let ship of shipList) {
      // Handle Ship Movement
      let nextShip = {...ship};
      if (nextShip.id === playerShipId) {
        // Apply Motion Controls
        this.applyMotionControls(nextShip);
      }
      this.updateShipPosition(nextShip);
      let transform = new Matrix4();
      transform.makeRotationY(nextShip.rotation);
      transform.setPosition(nextShip.position[0], nextShip.position[1], nextShip.position[2]);
      let shipGeometry = getShipGeometry(nextShip.schematic, transform);

      this.collideWithProjectiles(time, dt, nextShip, shipGeometry);
      this.triggerShipWeapons(time, dt, nextShip, shipGeometry);

      // TODO Check if this ship has a core
      // TODO Add a way to pick up powerups
      this.store.dispatch(setShip(nextShip.id, nextShip));
    }
    
    // Remove expired projectiles
    let projectileList = Object.values(projectiles);
    for (let projectile of projectileList) {
      if (time - projectile.time > 5) {
        this.store.dispatch(removeProjectile(projectile.id));
      }
    }
  }

  updateShipPosition(ship) {
    ship.velocity = [ship.velocity[0] + ship.acceleration[0], ship.velocity[1] + ship.acceleration[1], ship.velocity[2] + ship.acceleration[2]];
    ship.velocity[0] = Math.min(ship.velocity[0], 1);
    ship.velocity[1] = Math.min(ship.velocity[1], 1);
    ship.velocity[2] = Math.min(ship.velocity[2], 1);
    ship.position = [ship.position[0] + ship.velocity[0], ship.position[1] + ship.velocity[1], ship.position[2] + ship.velocity[2]];
    ship.acceleration = [0, 0, 0];
  }

}