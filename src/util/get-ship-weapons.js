export function getShipWeapons(schematic) {
  let weapons = [];
  for (let i = 0; i < schematic.length; i++) {
    for (let j = 0; j < schematic[i].length; j++) {
      let part = schematic[i][j];
      if (part === 3) {
        weapons.push({x: i, y: j, part});
      }
    }
  }
  return weapons;
}