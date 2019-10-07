import { Matrix4, Ray, Vector2, Vector3 } from 'three';

import { addShip } from '../action/add-ship';
import { addPowerup } from '../action/add-powerup';
import { addProjectile } from '../action/add-projectile';
import { addShipPart } from '../util/add-ship-part';
import { getShipCore } from '../util/get-ship-core';
import { getShipGeometry } from '../util/get-ship-geometry';
import { Logger } from '../util/logger';
import { removePowerup } from '../action/remove-powerup';
import { removeShip } from '../action/remove-ship';
import { removeProjectile } from '../action/remove-projectile';
import { getShips, getTime, getProjectiles, getPlayerShipId, getMoveDirection, getPowerups } from '../model/selector/selectors';
import { setShip } from '../action/set-ship';
import * as ShipPart from '../model/ship-part';

export class GameController {
  constructor(store) {
    this.logger = new Logger('GameController');
    this.store = store;

    this.addScene();
  }

  addPowerup(owner, position, part) {
    this.store.dispatch(addPowerup({
      id: Math.random(),
      owner: owner,
      position: position.toArray(),
      type: part
    }));
  }

  addProjectile(ship, position, direction) {
    this.store.dispatch(addProjectile({
      // TODO Find a better way to get projectile id
      id: Math.random(),
      owner: ship.id,
      position: position.toArray(),
      direction: direction.toArray(),
      time: getTime(this.store.getState())
    }));
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

    for (let i = 1; i < 3; i++) {
      this.store.dispatch(addShip({
        id: i,
        position: [Math.random() * 2, 0, Math.random() * 2],
        velocity: [0, 0, 0],
        acceleration: [0, 0, 0],
        rotation: Math.random() * Math.PI * 2,
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

  collideWithPowerups(ship, shipGeometry) {
    let powerups = getPowerups(this.store.getState());
    let powerupsList = Object.values(powerups);

    for (let i = 0; i < shipGeometry.length; i++) {
      for (let j = 0; j < shipGeometry[i].length; j++) {
        let box = shipGeometry[i][j];
        if (box !== null) {
          // Check Powerup Collision
          for (let powerup of powerupsList) {
            let powerupPoint = new Vector3();
            powerupPoint.fromArray(powerup.position);
            if (powerup.owner != ship.id && box.containsPoint(powerupPoint)) {
              ship.schematic = addShipPart(ship.schematic, powerup.type);
              this.removePowerup(powerup);
            }
          }
        }
      }
    }
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
            let box = shipGeometry[hit.y][hit.x];
            let powerupPosition = new Vector3();
            box.getCenter(powerupPosition);
            let powerupType = ship.schematic[hit.y][hit.x];
            if (powerupType === ShipPart.CORE) {
              powerupType = ShipPart.WEAPON;
            }
            this.addPowerup(ship.id, powerupPosition, powerupType);
          }
        }
        if (shipChanged === true) {
          ship.schematic = newSchematic;
          // TODO The ship should have some acceleration added from the projectile
          this.store.dispatch(removeProjectile(projectile.id));
        }
      }
    }
  }

  createPowerups(ship, shipGeometry) {
    let shipSchematic = ship.schematic;

    for (let i = 0; i < shipGeometry.length; i++) {
      for (let j = 0; j < shipGeometry[i].length; j++) {
        let box = shipGeometry[i][j];
        if (box !== null) {
          let powerupPosition = new Vector3();
          box.getCenter(powerupPosition);
          let powerupType = shipSchematic[i][j];
          if (powerupType === ShipPart.CORE) {
            powerupType = ShipPart.WEAPON;
          }
          this.addPowerup(ship.id, powerupPosition, powerupType);
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

  removePowerup(powerup) {
    this.store.dispatch(removePowerup(powerup.id));
  }

  triggerShipWeapons(time, dt, ship, shipGeometry) {
    // TODO Split this method
    // TODO Register bullets to be processed outside the ship loop all at once so projectiles don't need to be rerendered
    // Weapon Tick
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
                this.addProjectile(ship, weaponPosition, target);
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

    // TODO Find a way to organize this code better
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

      let core = getShipCore(nextShip.schematic);
      if (core === null) {
        this.createPowerups(nextShip, shipGeometry);
        // TODO Add explosion
        this.store.dispatch(removeShip(nextShip.id));
      } else {
        this.collideWithPowerups(nextShip, shipGeometry);
        this.store.dispatch(setShip(nextShip.id, nextShip));
      }
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
    ship.velocity[0] = Math.min(ship.velocity[0], 0.05);
    ship.velocity[1] = Math.min(ship.velocity[1], 0.05);
    ship.velocity[2] = Math.min(ship.velocity[2], 0.05);
    ship.position = [ship.position[0] + ship.velocity[0], ship.position[1] + ship.velocity[1], ship.position[2] + ship.velocity[2]];
    ship.acceleration = [0, 0, 0];
  }

}