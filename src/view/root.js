import React from 'react';
import { Provider } from 'react-redux'
import { Canvas, useFrame } from 'react-three-fiber';

import { Camera } from './three/camera';
import { Effects } from './three/effects';
import { Lights } from './three/lights';
import Projectiles from './three/projectiles';
import Ships from './three/ships';

export class Root extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    let TimeKeeper = () => {
      useFrame((state, dt) => this.props.update(dt));
      return null;
    }
    
    return (
      <Canvas orthographic={false}>
        <Lights/>
        <Provider store={this.props.store}>
          <Ships/>
          <Projectiles/>
        </Provider>
        <Camera/>
        <Effects/>
        <TimeKeeper/>
      </Canvas>
    );
  }
}
