import React from 'react';
import { FrontSide } from 'three';

export const MaterialColor = ({color}) => {
  return <meshLambertMaterial args={[{color, side: FrontSide}]} attach="material" />
}
