import { Vector3 } from 'three';

export function getProjectilePosition(projectile, time) {
  let position = new Vector3();
  let velocity = new Vector3();
  let deltaTime = time - projectile.time;
  // TODO Add a way to vary the speed on projectile type
  let speed = 1;

  position.fromArray(projectile.position);
  velocity.fromArray(projectile.direction);
  velocity.normalize();
  position.addScaledVector(velocity, deltaTime * speed);

  return position.toArray();
}
