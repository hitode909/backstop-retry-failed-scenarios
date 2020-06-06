const escapeStringRegexp = require('escape-string-regexp');

/**
 *
 * @param {Object} report
 * @returns {(String|null)} filter string for failed tests
 */
module.exports.createFilter = (report) => {
  if (!report.tests) return null

  const failedTestLabels = [... new Set(report.tests.filter(t => t.status === 'fail').map(t => t.pair.label))];
  if (failedTestLabels.length === 0) return null;
  return `^(${failedTestLabels.map(label => escapeStringRegexp(label)).join('|')})$`;
};