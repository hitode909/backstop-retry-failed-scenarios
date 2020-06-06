const fs = require('fs');

/**
 * Extract argument object from JSON file.
 * report(HERE);
 * @param {String} configJsPath - path of config.js
 * @param {RegExp} prefixRule - trimming rule for prefix
 * @param {RegExp} suffixRule - trimming rule for suffix
 * @returns {Object} results - argument of report()
 */
const extractConfigJson = (configJsPath, prefixRule, suffixRule) => {
  if (!prefixRule) prefixRule = '';
  if (!suffixRule) suffixRule = '';
  const content = fs.readFileSync(configJsPath).toString();
  return JSON.parse(content.replace(prefixRule, '').replace(suffixRule, ''));
};

module.exports.extractConfigJson = extractConfigJson;

/**
 * Extract argument object from config.js file.
 * report(HERE);
 * @param {String} configJsPath -  path of config.js
 * @returns {Object} results - argument of report()
 */
module.exports.extractConfigJs = (configJsPath) => {
  return extractConfigJson(configJsPath, /^report\(/, /\);$/);
};

/**
 * Extract argument object from JSON file.
 * report(HERE);
 * @param {String} targetPath -  path of config.js
 * @param {Object} reportObject - report object
 * @param {String} prefix - prefix string
 * @param {String} suffix - suffix string
 * @returns {Object} results - argument of report()
 */
const writeConfigJson = (targetPath, reportObject, prefix, suffix) => {
  if (!prefix) prefix = '';
  if (!suffix) suffix = '';
  const reportContent = `${prefix}${JSON.stringify(reportObject, null, '  ').toString()}${suffix}`;
  fs.writeFileSync(targetPath, reportContent);
};

module.exports.writeConfigJson = writeConfigJson;

/**
 * Write report object to file.
 * @param {String} configJsPath -  path of config.js to write
 * @param {Object} reportObject - report object
 */
module.exports.writeConfigJs = (targetPath, reportObject) => {
  writeConfigJson(targetPath, reportObject, 'report(', ');');
};