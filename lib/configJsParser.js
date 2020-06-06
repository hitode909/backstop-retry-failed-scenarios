const { readFileSync } = require('fs');

/**
 *
 * @param {String} configJsPath -  path of config.js
 * @returns {Object} results - argument of report()
 */
const extractConfigJs = (configJsPath) => {
  const content = readFileSync(configJsPath).toString();
  return JSON.parse(content.replace(/^report\(/, '').replace(/\);$/, ''));
};

module.exports.extractConfigJs = extractConfigJs;