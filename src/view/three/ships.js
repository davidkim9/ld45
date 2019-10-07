import React from 'react';
import { connect } from "react-redux";

import { getShips } from '../../model/selector/selectors';
import Ship from './ship';

export const Ships = ({ ships }) => {
  return Object.values(ships).map(ship => {
    return <Ship key={ship.id} shipIdentity={ship.id}/>;
  });
}

export default connect((state, props) => {
  return state => {
    return {
      ships: getShips(state)
    };
  };
})(Ships);