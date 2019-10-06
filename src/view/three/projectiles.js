import React from 'react';
import { connect } from "react-redux";

import { getProjectiles, getTime } from '../../model/selector/selectors';
import { Projectile } from './projectile';

export const Projectiles = ({ projectiles, time }) => {
  let elements = [];

  for (let i = 0; i < projectiles.length; i++) {
    let projectile = projectiles[i];
    let element = <Projectile key={projectile.id} projectile={projectile} time={time}/>;
    elements.push(element);
  }

  return elements;
}

export default connect((state, props) => {
  return state => {
    return {
      projectiles: getProjectiles(state),
      time: getTime(state)
    };
  };
})(Projectiles);
