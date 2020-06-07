import fs from 'fs';
import {JSONRawReport} from './Types';

/**
 * Extract argument object from JSON file.
 * report(HERE);
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
 */
export const extractConfigJs = (configJsPath: string): JSONRawReport => {
  return extractConfigJson(configJsPath, /^report\(/, /\);$/);
};

/**
 * Extract argument object from JSON file.
 * report(HERE);
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
 */
export const writeConfigJs = (
  targetPath: string,
  reportObject: JSONRawReport
) => {
  writeConfigJson(targetPath, reportObject, 'report(', ');');
};
