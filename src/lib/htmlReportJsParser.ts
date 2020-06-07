import fs from 'fs';
import {JSONRawReport} from './Types';

/**
 * Extract argument object from JSON file.
 * report(HERE);
 * @param {String} configJsPath - path of config.js
 * @param {RegExp} prefixRule - trimming rule for prefix
 * @param {RegExp} suffixRule - trimming rule for suffix
 * @returns {Object} results - argument of report()
 */
export function extractConfigJson(
  configJsPath: string,
  prefixRule?: string | RegExp | undefined,
  suffixRule?: string | RegExp | undefined
): JSONRawReport {
  if (!prefixRule) prefixRule = '';
  if (!suffixRule) suffixRule = '';
  const content = fs.readFileSync(configJsPath).toString();
  return JSON.parse(content.replace(prefixRule, '').replace(suffixRule, ''));
}

/**
 * Extract argument object from config.js file.
 * report(HERE);
 * @param {String} configJsPath -  path of config.js
 * @returns {Object} results - argument of report()
 */
export const extractConfigJs = (configJsPath: string): JSONRawReport => {
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
export const writeConfigJson = (
  targetPath: string,
  reportObject: JSONRawReport,
  prefix: string | undefined,
  suffix: string | undefined
) => {
  if (!prefix) prefix = '';
  if (!suffix) suffix = '';
  const reportContent = `${prefix}${JSON.stringify(
    reportObject,
    null,
    '  '
  ).toString()}${suffix}`;
  fs.writeFileSync(targetPath, reportContent);
};

/**
 * Write report object to file.
 * @param {String} configJsPath -  path of config.js to write
 * @param {Object} reportObject - report object
 */
export const writeConfigJs = (
  targetPath: string,
  reportObject: JSONRawReport
) => {
  writeConfigJson(targetPath, reportObject, 'report(', ');');
};
