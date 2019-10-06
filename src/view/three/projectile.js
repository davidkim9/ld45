import React, { useRef } from 'react';
import * as Three from 'three';

import { Cube } from './cube';
import { MaterialFlatColor } from './material-flat-color';

export const Projectile = ({ projectile, time }) => {
  const projectileReference = useRef();

  let deltaTime = time - projectile.time;
  let position = new Three.Vector3();
  position.fromArray(projectile.position);
  let velocity = new Three.Vector3();
  velocity.fromArray(projectile.direction);
  position.addScaledVector(velocity, deltaTime);
  
  return <mesh ref={projectileReference} position={position.toArray()}>
    <Cube size={0.01}/>
    <MaterialFlatColor color={0xFF0000}/>
  </mesh>;
}
