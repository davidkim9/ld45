import * as Three from 'three';
import { BloomEffect, EffectComposer, EffectPass, c, RenderPass, KernelSize } from "postprocessing";

import { PerlinBox, RenderController } from './render-controller';
import TimeManager from '../util/time-manager';

export default class MainController {
  constructor(canvas) {
    this.timeManager = new TimeManager();
    this.renderController = new RenderController(canvas, this.timeManager);
  }

  init() {
    this.renderController.init();
  }
}
