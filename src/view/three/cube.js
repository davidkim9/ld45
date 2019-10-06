import React from 'react';

export const Cube = ({size}) => {
  return <boxGeometry args={[size, size, size]} attach="geometry"/>;
}
