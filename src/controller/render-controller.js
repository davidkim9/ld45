export class RenderController {
  constructor(canvas, timeManager) {
    this.canvas = canvas;
    this.timeManager = timeManager;

    this.timeManager.register(dt => this.render(dt));
    this.timeManager.start();
  }

  init() {

  }

  render(dt) {
  }
}