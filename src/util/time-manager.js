import RollingAverage from './rolling-average';

export default class TimeManager {
  constructor() {
    this.playing = false;
    this.timeLast = Date.now();
    this.routines = [];
    this.fps = 0;
    this.time = 0;
    this.rollingAverage = new RollingAverage(60);
  }

  getRoutines() {
    return this.routines;
  }

  getFps() {
    return Math.floor(this.rollingAverage.getAverage());
  }

  getTime() {
    return Math.floor(this.time * 1000) / 1000;
  }

  register(routine) {
    this.routines.push(routine);
  }

  start() {
    this.playing = true;
    this.timeLast = Date.now();
    window.requestAnimationFrame(() => this.tick());
  }

  stop() {
    this.playing = false;
  }

  tick() {
    let timeNow = Date.now();
    let dt = (timeNow- this.timeLast) / 1000;

    this.fps = Math.floor(1 / dt);
    this.rollingAverage.addStat(this.fps);
    this.timeLast = timeNow;
    this.time += dt;
    for (let i = 0; i < this.routines.length; i++) {
      this.routines[i](dt);
    }

    if (this.playing === true) {
      window.requestAnimationFrame(() => this.tick());
    }
  }

  unregister(routine) {
    let index = this.routines.indexOf(routine);
    let routineRemoved = false;

    if (index > -1){
      this.routines.splice(index, 1);
      routineRemoved = true;
    }

    return routineRemoved;
  }
}
