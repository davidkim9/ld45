import * as Three from 'three';

export class Geometry {
  constructor() {
    this.mesh = new Three.Group();
  }

  getMesh() {
    return this.mesh;
  }

  render(dt) {
  }
}