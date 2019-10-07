import React from 'react';
import { connect } from "react-redux";

import Powerup from './powerup';
import { getPowerups } from '../../model/selector/selectors';

export const Powerups = ({ powerups }) => {
  return Object.values(powerups).map(powerup => {
    return <Powerup key={powerup.id} powerupIdentity={powerup.id}/>;
  });
}

export default connect((state, props) => {
  return state => {
    return {
      powerups: getPowerups(state)
    };
  };
})(Powerups);