class Logger {
  constructor(tag) {
    this.tag = tag;
  }

  dispose() {
    this.tag = null;
  }

  error(...args) {
    this.writeTransport('error', args);
  }

  log(...args) {
    this.writeTransport('log', args);
  }

  warn(...args) {
    this.writeTransport('warn', args);
  }

  writeTransport(level, args) {
    console[level].apply(console, [`[${this.tag}]`, ...args]);
  }

  /**
   * Toggle logger functionality.
   * By default all logging is disabled in the project.
   * You should explicitly enable logger if you are interested in the logging messages.
   *
   * @param {boolean} state enable flag
   */
  static setDebugMode(state) {
    Logger.debugMode = state;
  }
}

Logger.debugMode = false;
export { Logger };
