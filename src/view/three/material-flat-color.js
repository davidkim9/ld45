import React from 'react';

export const MaterialFlatColor = ({color}) => {
  return <meshBasicMaterial args={[{color}]} attach="material" />
}
