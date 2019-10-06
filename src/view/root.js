import React from 'react';
import { Canvas } from 'react-three-fiber';
import * as Three from 'three';

import { Camera } from './camera';
import { Effects } from './effects';
import { Lights } from './lights';

export class Root extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <Canvas orthographic={true}>
        <Lights/>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} attach="geometry"/>
          <meshLambertMaterial args={[{color: 0x6dd400, side: Three.FrontSide}]} attach="material" />
        </mesh>
        <Camera/>
        <Effects/>
      </Canvas>
    );
  }
}
