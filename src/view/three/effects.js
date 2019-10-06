import { BloomEffect, BlurPass, EffectComposer, EffectPass, RenderPass, KernelSize } from "postprocessing";
import { extend, useFrame, useThree } from 'react-three-fiber';

extend({BlurPass, EffectComposer, EffectPass, RenderPass});

export const Effects = () => {
  const { gl, scene, camera } = useThree();

  const composer = new EffectComposer(gl);
  const bloomEffect = new BloomEffect({
    luminanceThreshold: 0.7,
    kernelSize: KernelSize.MEDIUM,
    height: BlurPass.AUTO_SIZE,
    width: BlurPass.AUTO_SIZE,
  });
  let renderPass = new RenderPass(scene, camera);
  const effectPass = new EffectPass(camera, bloomEffect);
  effectPass.renderToScreen = true;
  bloomEffect.blendMode.opacity.value = 2;
  composer.addPass(renderPass);
  composer.addPass(effectPass);
  // useFrame(() => {
  //   composer.render();
  // }, 1);

  return null;
};