import * as Three from 'three';

export function createFlatColorMaterial(color) {
  return new Three.MeshBasicMaterial({
    color
  });
}