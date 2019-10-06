import { createCube } from '../util/create-cube';
import { createColorMaterial } from '../util/create-color-material';
import { Geometry } from './geometry';

export class Ship extends Geometry {
  constructor() {
    super();
    this.mesh.add(createCube(0.25, createColorMaterial(0x6dd400)));
  }
}