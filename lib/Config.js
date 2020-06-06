const path = require('path');

module.exports.Config = class Config {
  constructor(rootDir, configPath) {
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

  get htmlReportPath() {
    const rawConfig = this.rawConfig;
    return path.join(this.rootDir, (rawConfig.paths && rawConfig.paths.html_report) || 'backstop_data/html_report', 'config.js');
  }
}