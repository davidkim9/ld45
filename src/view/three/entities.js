import React from 'react';
import { connect } from "react-redux";

import { Cube } from './cube';
import { MaterialColor } from './material-color';
import { getEntities } from '../../model/selector/selectors';

export const Entities = ({ entities }) => {
  let items = [];

  for (let i = 0; i < entities.length; i++) {
    let item = (<mesh key={i} position={[i * 0.2, 0, 0]}>
      <Cube size={0.1}/>
      <MaterialColor color={0x6dd400}/>
    </mesh>);
    items.push(item);
  }

  return (<group>{items}</group>);
}

export default connect((state, props) => {
  return state => {
    return {
      entities: getEntities(state)
    };
  };
})(Entities);