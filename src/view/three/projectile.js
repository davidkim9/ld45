import React from 'react';
import { connect } from "react-redux";

import { Cube } from './cube';
import { getProjectile } from '../../model/selector/get-projectile';
import { getProjectilePosition } from '../../util/get-projectile-position';
import { getTime } from '../../model/selector/selectors';
import { MaterialFlatColor } from './material-flat-color';

export const Projectile = ({ projectile, time }) => {
  let position = getProjectilePosition(projectile, time).toArray();

  return <mesh position={position}>
    <Cube size={0.01}/>
    <MaterialFlatColor color={0xFF0000}/>
  </mesh>;
}

export default connect((state, props) => {
  let projectileSelector = getProjectile(props.projectileIdentity);
  return state => {
    return {
      projectile: projectileSelector(state),
      time: getTime(state)
    };
  };
})(Projectile);
