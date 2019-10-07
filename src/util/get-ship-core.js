import * as ShipPart from '../model/ship-part';

export function getShipCore(schematic) {
  let core = null;
  for (let i = 0; i < schematic.length; i++) {
    for (let j = 0; j < schematic[i].length; j++) {
      if (schematic[i][j] === ShipPart.CORE) {
        core = {x: j, y: i};
        break;
      }
    }
  }
  return core;
}