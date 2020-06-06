const path = require('path');
const child_process = require('child_process');

const { extractConfigJs } = require('./htmlReportJsParser');
const { createFilter } = require('./createFilter');

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

  async run() {
    this.retriedCount = 0;
    while (this.retriedCount < this.retryCount) {
      this.retriedCount++;
      console.log(`Running(${this.retriedCount}/${this.retryCount}) ${this.command}`);
      const runResult = await this.runOnce(this.command);
      if (runResult) return true;
    }
    return false;
  }

  async runOnce(command) {
    return new Promise((resolve) => {
      let child;
      try {
        child = child_process.spawn(command, { shell: true });
      } catch (error) {
        console.warn(error.replace(/^/gm, '#  '));
        resolve(false);
        return;
      };
      child.stdout.on('data', function (data) {
        console.log(data.toString().replace(/^/gm, '#  '));
      });
      child.stderr.on('data', function (data) {
        console.error(data.toString().replace(/^/gm, '#  '));
      });
      child.on('close', (code) => {
        resolve(code === 0);
      });
    });
  }

  get filter() {
    const config = this.configObject;
    const htmlReportPath = path.join(process.cwd(), (config.paths && config.paths.html_report) || 'backstop_data/html_report', 'config.js');
    const htmlReportObject = extractConfigJs(htmlReportPath);
    return createFilter(htmlReportObject);
  }
}