const escapeStringRegexp = require('escape-string-regexp');

/**
 *
 * @param {Object} report
 * @returns {(String|null)} filter string for failed tests
 */
module.exports.createFilter = (report) => {
  if (!report.tests) return null

  const failedTests = report.tests.filter(t => t.status === 'fail');
  if (failedTests.length === 0) return null;
  return `^(${failedTests.map(t => escapeStringRegexp(t.pair.label)).join('|')})$`;
};