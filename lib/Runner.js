const path = require('path');
const child_process = require('child_process');

module.exports.Runner = class Runner {
  constructor(options) {
    this.retryCount = options.retry;
    this.configPath = options.config;
    this.command = options.command;
    this.retriedCount = 0;
  }

  get configFullPath() {
    if (path.isAbsolute(this.configPath)) {
      return this.configPath;
    } else {
      return path.join(process.cwd(), this.configPath);
    }
  }

  get configObject() {
    return require(this.configFullPath);
  }

  run() {
    this.retriedCount = 0;
    while (this.retriedCount < this.retryCount) {
      this.retriedCount++;
      const runResult = this.runOnce();
      if (runResult) return true;
    }
    return false;
  }

  runOnce() {
    try {
      child_process.execSync(this.command);
      return true;
    } catch(error) {
      return false;
    }
  }
}