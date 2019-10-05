import * as Three from 'three';
import { BloomEffect, EffectComposer, EffectPass, RenderPass, KernelSize } from "postprocessing";

import { createCube } from '../util/create-cube';
import { createColorMaterial } from '../util/create-color-material';


export class RenderController {
  constructor(canvas, timeManager) {
    this.canvas = canvas;
    this.timeManager = timeManager;
    this.camera = null;
    this.composer = null;
    this.renderer = null;
    this.scene = null;
  }

  addBaseLighting() {
    this.scene.add( new Three.AmbientLight(0x444444) );
    let light = new Three.DirectionalLight(0xFFFFFF);
    light.position.set(10, 20, 15);
    this.scene.add(light);
  }

  addCamera() {
    let aspect = this.canvas.width / this.canvas.height;
    let D = 1;
    this.camera = new Three.OrthographicCamera(-D*aspect, D*aspect, D, -D, 1, 1000);
    this.camera.position.set(20, 20, 20);
    // this.camera.position.set(0, 20, 0);
    this.camera.lookAt(this.scene.position);
  }

  addEffects() {
    this.composer = new EffectComposer(this.renderer);
    const bloomEffect = new BloomEffect({
      luminanceThreshold: 0.7,
      kernelSize: KernelSize.MEDIUM
    });
    const effectPass = new EffectPass(this.camera, bloomEffect);
    effectPass.renderToScreen = true;
    bloomEffect.blendMode.opacity.value = 2.3;
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(effectPass);
  }

  addGeometry() {
    let container = new Three.Group();
    
    this.scene.add(createCube(0.25, createColorMaterial(0x6dd400)));

    this.scene.add(container);
    this.sceneContainer = container;
  }

  init() {
    this.timeManager.register(dt => this.render(dt));
    this.renderer = new Three.WebGLRenderer( { canvas: this.canvas } );
    this.renderer.setSize( this.canvas.width, this.canvas.height );
    this.scene = new Three.Scene();

    this.addBaseLighting();
    this.addCamera();
    this.addEffects();
    this.addGeometry();
  }

  render(dt) {
    this.composer.render(dt);
  }
}