import React from 'react';
import { connect } from "react-redux";

import { getShips } from '../../model/selector/selectors';
import { Ship } from './ship';

export const Ships = ({ ships }) => {
  let shipElements = [];

  for (let i = 0; i < ships.length; i++) {
    let ship = ships[i];
    let shipElement = <group key={ship.id} rotation={[0, ship.rotation, 0]} position={ship.position}><Ship ship={ship}/></group>;
    shipElements.push(shipElement);
  }

  return shipElements;
}

export default connect((state, props) => {
  return state => {
    return {
      ships: getShips(state)
    };
  };
})(Ships);