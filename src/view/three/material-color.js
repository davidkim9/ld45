import React from 'react';
import * as Three from 'three';

export const MaterialColor = ({color}) => {
  return <meshLambertMaterial args={[{color, side: Three.FrontSide}]} attach="material" />
}
