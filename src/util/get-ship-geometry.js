import { Box3, Vector3 } from 'three';

import { getShipCore } from '../util/get-ship-core';

export function getShipGeometry(schematic, transform) {
  let geometry = [];
  let gridSize = 0.03;
  let halfGridSize = gridSize / 2;
  let core = getShipCore(schematic);
  let partBox, type, x, y;

  for (let i = 0; i < schematic.length; i++) {
    let geometryRow = [];
    for (let j = 0; j < schematic[i].length; j++) {
      type = schematic[i][j];
      x = j - core.x;
      y = i - core.y;
      partBox = null;
      if (type !== 0) {
        let min = new Vector3(-halfGridSize, -halfGridSize, -halfGridSize);
        let max = new Vector3(halfGridSize, halfGridSize, halfGridSize);
        let position = new Vector3(gridSize * x, 0, gridSize * y);
        min.add(position);
        max.add(position);
        partBox = new Box3(min, max);
        // Transform to world coordinates
        partBox.applyMatrix4(transform);
      }
      geometryRow[j] = partBox;
    }
    geometry[i] = geometryRow;
  }

  return geometry;
}