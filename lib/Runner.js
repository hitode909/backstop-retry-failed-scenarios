const path = require('path');
const child_process = require('child_process');

module.exports.Runner = class Runner {
  constructor(options) {
    this.retryCount = options.retry;
    this.configPath = options.config;
    this.command = options.command;
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
}