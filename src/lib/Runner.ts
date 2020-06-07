import child_process from 'child_process';

import {Config} from './Config';

export const Runner = class Runner {
  rootDir: string;
  retryCount: number;
  configPath: string;
  command: string;
  retriedCount: number;
  exitCode: number;
  constructor(
    options: Partial<{
      rootDir: string;
      retry: number;
      config: string;
      command: string;
    }>
  ) {
    this.rootDir = options.rootDir || process.cwd();
    this.retryCount = options.retry || 3;
    this.configPath = options.config || 'backstop.json';
    this.command = options.command || 'backstop test';
    this.retriedCount = 0;
    this.exitCode = 1;
  }

  get config() {
    return new Config(this.rootDir, this.configPath);
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
      console.log(
        `Running(${this.retriedCount}/${this.retryCount}) ${command}`
      );
      const runResult = await this.runOnce(command);
      if (reports) {
        if (reports.htmlReport) {
          reports.htmlReport.notifyNewReport(config.htmlReport);
          reports.htmlReport.write();
        }
        if (reports.jsonReport && config.jsonReport) {
          reports.jsonReport.notifyNewReport(config.jsonReport);
          reports.jsonReport.write();
        }
        if (reports.ciReport && config.ciReport) {
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

  async runOnce(command: string): Promise<boolean> {
    return new Promise(resolve => {
      let child;
      try {
        child = child_process.spawn(command, {shell: true});
      } catch (error) {
        console.warn(error.replace(/^/gm, '#  '));
        resolve(false);
        return;
      }
      child.stdout.on('data', data => {
        process.stdout.write(data.toString().replace(/^/gm, '#  '));
      });
      child.stderr.on('data', data => {
        process.stderr.write(data.toString().replace(/^/gm, '#  '));
      });
      child.on('close', code => {
        this.exitCode = code;
        resolve(code === 0);
      });
    });
  }

  get filter() {
    return this.config.htmlReport.filter;
  }
};
