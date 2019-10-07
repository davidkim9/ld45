// import { getShipCore } from './get-ship-core';

export function addShipPart(schematic, part) {
  // let core = getShipCore(schematic);
  // TODO Find a better way to add ship parts, it should build up from the core
  let partX = -1;
  let partY = -1;
  for (let i = 0; i < schematic.length; i++) {
    for (let j = 0; j < schematic[i].length; j++) {
      if (schematic[i][j] === 0) {
        partX = j;
        partY = i;
        break;
      }
    }
  }

  if (partX !== -1) {
    schematic[partY][partX] = part;
  } else {
    let newRow = new Array(schematic[0].length);
    for (let i = 0; i < schematic[0].length; i++) {
      newRow[i] = 0;
    }
    newRow[Math.floor(schematic[0].length/2)] = part;
    schematic.push(newRow);
  }

  return schematic;
}
