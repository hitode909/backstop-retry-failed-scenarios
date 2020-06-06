const { extractConfigJs } = require('./htmlReportJsParser');
const { createFilter } = require('./createFilter');

module.exports.HTMLReport = class HTMLReport {
  constructor(reportPath) {
    this.reportPath = reportPath;
    this.rawReport = extractConfigJs(this.reportPath);
  }

  get filter() {
    return createFilter(this.rawReport);
  }
}