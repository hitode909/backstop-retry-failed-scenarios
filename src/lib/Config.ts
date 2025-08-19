import path from 'path';
import fs from 'fs';
import {HTMLReport} from './HTMLReport';
import {JSONReport} from './JSONReport';
import {CIReport} from './CIReport';

export class Config {
  readonly rootDir: string;
  readonly configPath: string;
  constructor(rootDir: string, configPath: string) {
    this.rootDir = rootDir;
    this.configPath = configPath;
  }

  get configFullPath() {
    if (path.isAbsolute(this.configPath)) {
      return this.configPath;
    } else {
      return path.join(this.rootDir, this.configPath);
    }
  }

  get rawConfig() {
    return require(this.configFullPath);
  }

  get htmlReport() {
    return new HTMLReport(this.htmlReportPath);
  }

  get jsonReport() {
    if (!fs.existsSync(this.jsonReportPath)) return null;
    return new JSONReport(this.jsonReportPath);
  }

  get ciReport() {
    if (!fs.existsSync(this.ciReportPath)) return null;
    return new CIReport(this.ciReportPath);
  }

  get htmlReportPath() {
    const rawConfig = this.rawConfig;
    return path.join(
      this.rootDir,
      (rawConfig.paths && rawConfig.paths.html_report) ||
        'backstop_data/html_report',
      'config.js'
    );
  }

  get jsonReportPath() {
    const rawConfig = this.rawConfig;
    return path.join(
      this.rootDir,
      (rawConfig.paths && rawConfig.paths.json_report) ||
        'backstop_data/json_report',
      'jsonReport.json'
    );
  }

  get ciReportPath() {
    const rawConfig = this.rawConfig;
    return path.join(
      this.rootDir,
      (rawConfig.paths && rawConfig.paths.ci_report) ||
        'backstop_data/ci_report',
      'xunit.xml'
    );
  }
}
