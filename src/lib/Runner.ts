import child_process from 'child_process';
import fs from 'fs';

import {Config} from './Config';
import {TraceProfiler} from './TraceProfiler';

// 0 means not run, 1 means just run once, 2 is meaningful minimum count.
const MINIMUM_RETRY_COUNT = 2;

export class Runner {
  rootDir: string;
  retryCount: number;
  configPath: string;
  command: string;
  referenceCommand?: string;
  outputProfile?: string;
  traceProfiler: TraceProfiler;
  retriedCount: number;
  exitCode: number;
  constructor(
    options: Partial<{
      rootDir: string;
      retry: number;
      config: string;
      command: string;
      referenceCommand: string;
      outputProfile: string;
    }>
  ) {
    this.rootDir = options.rootDir || process.cwd();
    this.retryCount = Math.max(
      options.retry || MINIMUM_RETRY_COUNT,
      MINIMUM_RETRY_COUNT
    );
    this.configPath = options.config || 'backstop.json';
    this.command = options.command || 'backstop test';
    this.referenceCommand = options.referenceCommand;
    this.outputProfile = options.outputProfile;
    this.traceProfiler = new TraceProfiler();
    this.retriedCount = 0;
    this.exitCode = 1;
  }

  get config() {
    return new Config(this.rootDir, this.configPath);
  }

  async run() {
    this.traceProfiler.start('run');

    this.retriedCount = 0;
    const baseCommand = this.command;
    let filterOption = '';
    const config = this.config;
    let reports;

    while (this.retriedCount < this.retryCount) {
      this.retriedCount++;
      if (this.referenceCommand) {
        const referenceCommand = `${this.referenceCommand} ${filterOption}`;
        console.log(
          `Running(${this.retriedCount}/${this.retryCount}) ${referenceCommand}`
        );
        this.traceProfiler.start(`${this.retriedCount}.reference`);
        await this.runOnce(referenceCommand);
        this.traceProfiler.end(`${this.retriedCount}.reference`);
      }
      const testCommand = `${baseCommand} ${filterOption}`;
      console.log(
        `Running(${this.retriedCount}/${this.retryCount}) ${testCommand}`
      );
      this.traceProfiler.start(`${this.retriedCount}.test`);
      const runResult = await this.runOnce(testCommand);
      this.traceProfiler.end(`${this.retriedCount}.test`);
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
      if (runResult) {
        this.traceProfiler.end('run');
        this.writeProfile();
        return true;
      }
      filterOption = `--filter '${this.filter}'`;
      if (!reports) {
        reports = {
          htmlReport: config.htmlReport,
          jsonReport: config.jsonReport,
          ciReport: config.ciReport,
        };
      }
    }
    this.traceProfiler.end('run');
    this.writeProfile();
    return false;
  }

  async runOnce(command: string): Promise<boolean> {
    return new Promise(resolve => {
      let child;
      try {
        child = child_process.spawn(command, {shell: true});
      } catch (error) {
        console.warn(`${error}`.replace(/^/gm, '#  '));
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
        this.exitCode = code || 0;
        resolve(code === 0);
      });
    });
  }

  get filter() {
    return this.config.htmlReport.filter;
  }

  private writeProfile() {
    if (!this.outputProfile) return;
    const traceProfile = this.traceProfiler.generateReport();
    fs.writeFileSync(
      this.outputProfile,
      JSON.stringify(traceProfile, null, '  ')
    );
  }
}
