const path = require('path');
const child_process = require('child_process');

const { Config } = require('./Config');
module.exports.Runner = class Runner {
  constructor(options) {
    this.retryCount = options.retry;
    this.configPath = options.config;
    this.command = options.command;
    this.retriedCount = 0;
    this.exitCode = 1;
  }

  get config() {
    return new Config(process.cwd(), this.configPath);
  }

  async run() {
    this.retriedCount = 0;
    const baseCommand = this.command;
    let filterOption = '';
    const config = this.config;
    let reports;
    while (this.retriedCount < this.retryCount) {
      this.retriedCount++;
      const command = `${baseCommand} ${filterOption}`;
      console.log(`Running(${this.retriedCount}/${this.retryCount}) ${command}`);
      const runResult = await this.runOnce(command);
      if (reports) {
        if (reports.htmlReport) {
          reports.htmlReport.notifyNewReport(config.htmlReport);
          reports.htmlReport.write();
        }
        if (reports.jsonReport) {
          reports.jsonReport.notifyNewReport(config.jsonReport);
          reports.jsonReport.write();
        }
        if (reports.ciReport) {
          reports.ciReport.notifyNewReport(config.ciReport);
          reports.ciReport.write();
        }
      }
      if (runResult) return true;
      filterOption = `--filter '${this.filter}'`;
      if (!reports) {
        reports = {
          htmlReport: config.htmlReport,
          jsonReport: config.jsonReport,
          ciReport: config.ciReport,
        };
      }
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
        process.stdout.write(data.toString().replace(/^/gm, '#  '));
      });
      child.stderr.on('data', function (data) {
        process.stderr.write(data.toString().replace(/^/gm, '#  '));
      });
      child.on('close', (code) => {
        this.exitCode = code;
        resolve(code === 0);
      });
    });
  }

  get filter() {
    return this.config.htmlReport.filter;
  }
}