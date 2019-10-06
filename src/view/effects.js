import { BloomEffect, BlurPass, EffectComposer, EffectPass, RenderPass, KernelSize } from "postprocessing";
import React, { useRef } from 'react';
import { extend, useFrame, useThree } from 'react-three-fiber';

extend({BlurPass, EffectComposer, EffectPass, RenderPass});

export const Effects = () => {
  const { gl, scene, camera } = useThree();

  const composer = new EffectComposer(gl);
  const bloomEffect = new BloomEffect({
    luminanceThreshold: 0.7,
    kernelSize: KernelSize.MEDIUM
  });
  const effectPass = new EffectPass(camera, bloomEffect);
  effectPass.renderToScreen = true;
  bloomEffect.blendMode.opacity.value = 2.3;
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(effectPass);
  useFrame(() => {
    composer.render();
  }, 1);

  return null;
};