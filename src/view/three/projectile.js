import React from 'react';

import { Cube } from './cube';
import { getProjectilePosition } from '../../util/get-projectile-position';
import { MaterialFlatColor } from './material-flat-color';

export const Projectile = ({ projectile, time }) => {
  let position = getProjectilePosition(projectile, time).toArray();

  return <mesh position={position}>
    <Cube size={0.01}/>
    <MaterialFlatColor color={0xFF0000}/>
  </mesh>;
}
