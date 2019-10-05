export default class RollingAverage {
  constructor(sampleCount = 10) {
    this.sampleCount = sampleCount;
    this.pointer = 0;
    this.stats = [];
  }

  addStat(value) {
    this.stats[this.pointer] = value;
    this.pointer = (this.pointer + 1) % this.sampleCount;
  }

  getAverage() {
    let sum = 0;

    for (let i = 0; i < this.stats.length; i++) {
      sum += this.stats[i];
    }

    return sum / this.stats.length;
  }
}