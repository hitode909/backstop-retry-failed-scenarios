const fs = require('fs');

/**
 * Extract argument object from config.js file.
 * report(HERE);
 * @param {String} configJsPath -  path of config.js
 * @returns {Object} results - argument of report()
 */
module.exports.extractConfigJs = (configJsPath) => {
  const content = fs.readFileSync(configJsPath).toString();
  return JSON.parse(content.replace(/^report\(/, '').replace(/\);$/, ''));
};

/**
 * Write report object to file.
 * @param {String} configJsPath -  path of config.js to write
 * @param {Object} reportObject - report object
 */
module.exports.writeConfigJs = (targetPath, reportObject) => {
  const reportContent = `report(${JSON.stringify(reportObject, null, '  ').toString()});`;
  fs.writeFileSync(targetPath, reportContent);
};

