import React from 'react';
import { connect } from "react-redux";

import { Cube } from './cube';
import { getPowerup } from '../../model/selector/get-powerup';
import { MaterialFlatColor } from './material-flat-color';

export const Powerup = ({ powerup }) => {
  return <mesh position={powerup.position}>
    <Cube size={0.03}/>
    <MaterialFlatColor color={0x00FF00}/>
  </mesh>;
}

export default connect((state, props) => {
  let powerupSelector = getPowerup(props.powerupIdentity);
  return state => {
    return {
      powerup: powerupSelector(state)
    };
  };
})(Powerup);
