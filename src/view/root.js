import React from 'react';
import { Provider } from 'react-redux'
import { Canvas, useFrame } from 'react-three-fiber';

import Camera from './three/camera';
import { Debris } from './three/debris';
import { Effects } from './three/effects';
import { Lights } from './three/lights';
import Powerups from './three/powerups';
import Projectiles from './three/projectiles';
import Ships from './three/ships';
import { Stars } from './three/stars';

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
      <div id="root" onKeyDown={this.props.keyHandler} onKeyUp={this.props.keyHandler} tabIndex="0">
        <Canvas orthographic={false}>
          <Lights/>
          <Provider store={this.props.store}>
            <Ships/>
            <Powerups/>
            <Projectiles/>
            <Stars/>
            <Debris/>
            <Camera/>
          </Provider>
          <Effects/>
          <TimeKeeper/>
        </Canvas>
      </div>
    );
  }
}
