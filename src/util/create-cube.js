import * as Three from 'three';

export function createCube(cubeSize, material) {
  let geometry = new Three.BoxGeometry(cubeSize, cubeSize, cubeSize);
  let cube = new Three.Mesh(geometry, material);
  
  return cube;
}