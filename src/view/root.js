import React from 'react';
import { Provider } from 'react-redux'
import { Canvas } from 'react-three-fiber';

import { Camera } from './three/camera';
import { Effects } from './three/effects';
import Entities from './three/entities';
import { Lights } from './three/lights';

export class Root extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    let entities = [{}, {}];
    return (
      <Canvas orthographic={true}>
        <Lights/>
        <Provider store={this.props.store}>
          <Entities/>
        </Provider>
        <Camera/>
        <Effects/>
      </Canvas>
    );
  }
}