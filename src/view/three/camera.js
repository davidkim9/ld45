import { useThree } from 'react-three-fiber';

export const Camera = () => {
  const { camera, scene, viewport } = useThree();
  camera.position.set(20, 20, 20);
  let aspect = viewport.width / viewport.height;
  console.log(viewport.width, viewport.height);
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