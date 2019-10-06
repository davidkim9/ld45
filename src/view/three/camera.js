import { useThree } from 'react-three-fiber';

export const Camera = () => {
  const { camera, scene, viewport } = useThree();
  // camera.position.set(20, 20, 20);
  camera.position.set(1, 1, 1);
  // camera.position.set(0, 2, 0);
  let aspect = viewport.width / viewport.height;
  let D = 1;
  camera.left = -D * aspect;
  camera.right = D * aspect;
  camera.top = D;
  camera.bottom = -D;
  camera.near = 1;
  camera.far = 1000;
  camera.updateProjectionMatrix();
  camera.lookAt(scene.position);
  return null;
}