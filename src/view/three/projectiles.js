import React from 'react';
import { connect } from "react-redux";

import { getProjectiles } from '../../model/selector/selectors';
import Projectile from './projectile';

export const Projectiles = ({ projectiles }) => {
  return Object.values(projectiles).map(projectile => {
    return <Projectile key={projectile.id} projectileIdentity={projectile.id}/>;
  });
}

export default connect((state, props) => {
  return state => {
    return {
      projectiles: getProjectiles(state)
    };
  };
})(Projectiles);