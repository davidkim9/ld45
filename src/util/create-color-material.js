import * as Three from 'three';

export function createColorMaterial(color) {
  return new Three.MeshLambertMaterial({
    color,
    side: Three.FrontSide,
    // opacity: 1,
    // transparent: true
  });
}