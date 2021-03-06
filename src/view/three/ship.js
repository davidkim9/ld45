import React from 'react';
import { connect } from "react-redux";

import { Cube } from './cube';
import { getShip } from '../../model/selector/get-ship';
import { getShipCore } from '../../util/get-ship-core';
import { MaterialColor } from './material-color';
import { MaterialFlatColor } from './material-flat-color';

const ShipSize = {
  CONNECTOR: 0.02,
  GRID: 0.03,
  PART: 0.025
};

function getShipConnector(type) {
  return (
    <>
      <Cube size={ShipSize.CONNECTOR}/>
      <MaterialFlatColor color={0xFFFFFF}/>
    </>
  );
}

function getShipPart(type) {
  if (type === 1) 
    return (
      <>
        <Cube size={ShipSize.PART}/>
        <MaterialFlatColor color={0xffa880}/>
      </>
    );
  if (type === 2) 
    return (
      <>
        <Cube size={ShipSize.PART}/>
        <MaterialColor color={0x23232B}/>
      </>
    );
  if (type === 3) 
    return (
      <>
        <Cube size={ShipSize.PART}/>
        <MaterialColor color={0x00dd00}/>
      </>
    );
}

export const Ship = ({ ship }) => {
  let schematic = ship.schematic;
  let gridSize = 0.03;
  let core = getShipCore(schematic);
  let shipParts = [];
  let top, left, connector, connectorMesh, part, partMesh, type, x, y;

  for (let i = 0; i < schematic.length; i++) {
    for (let j = 0; j < schematic[i].length; j++) {
      type = schematic[i][j];
      x = j - core.x;
      y = i - core.y;

      if (type !== 0) {
        part = getShipPart(type);
        partMesh = <mesh key={`part_${i}_${j}`} position={[gridSize * x, 0, gridSize * y]}>{part}</mesh>
        shipParts.push(partMesh);
      }

      // Add Connectors
      if (i > 0) {
        top = schematic[i-1][j];
        if (top !== 0 && type !== 0) {
          connector = getShipConnector();
          connectorMesh = <mesh key={`connector_top_${i}_${j}`} position={[gridSize * x, 0, gridSize * y - ShipSize.CONNECTOR]}>{connector}</mesh>
          shipParts.push(connectorMesh);
        }
      }
      if (j > 0) {
        left = schematic[i][j-1];
        if (left !== 0 && type !== 0) {
          connector = getShipConnector();
          let connectorMesh = <mesh key={`connector_left_${i}_${j}`} position={[gridSize * x - ShipSize.CONNECTOR, 0, gridSize * y]}>{connector}</mesh>
          shipParts.push(connectorMesh);
        }
      }
    }
  }

  return (<group rotation={[0, ship.rotation, 0]} position={ship.position}>
    {shipParts}
  </group>);
}

export default connect((state, props) => {
  let shipSelector = getShip(props.shipIdentity);

  return state => {
    return {
      ship: shipSelector(state)
    };
  };
})(Ship);