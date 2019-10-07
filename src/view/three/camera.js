import { connect } from "react-redux";
import { useThree } from 'react-three-fiber';

import { getPlayerShip } from '../../model/selector/get-player-ship';
import { Vector3 } from "three";

export const Camera = ({ playerShip }) => {
  const { camera, scene, viewport } = useThree();
  let playerPosition = new Vector3();
  if (playerShip !== undefined) {
    let playerVelocity = new Vector3();
    playerVelocity.fromArray(playerShip.velocity);
    playerPosition.fromArray(playerShip.position);
    camera.position.set(playerShip.position[0], 2 + playerVelocity.length() * 50, playerShip.position[2]);
    // camera.position.set(playerShip.position[0] + 1, 2, playerShip.position[2] + 1);
  }
  let aspect = viewport.width / viewport.height;
  let D = 1;
  camera.left = -D * aspect;
  camera.right = D * aspect;
  camera.top = D;
  camera.bottom = -D;
  camera.near = 1;
  camera.far = 1000;
  camera.updateProjectionMatrix();
  camera.lookAt(playerPosition);

  return null;
}

export default connect((state, props) => {
  const  playerShipSelector = getPlayerShip();

  return state => {
    return {
      playerShip: playerShipSelector(state)
    };
  };
})(Camera);
