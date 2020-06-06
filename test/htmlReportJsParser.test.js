const os = require('os');
const fs = require('fs');
const path = require('path');
const { extractConfigJs, writeConfigJs } = require('../lib/htmlReportJsParser');

describe('extractConfigJs', () => {
  test('it throws error when the target file is missing or broken', () => {
    expect(() => { extractConfigJs('test/fixtures/notExistFile') }).toThrow(/no such file or directory/);
    expect(() => { extractConfigJs('test/fixtures/config.js.invalid') }).toThrow(/Unexpected token/);
  });
  test('it extracts argument from JavaScript string', () => {
    expect(extractConfigJs('test/fixtures/config.js.valid')).toStrictEqual({
      testSuite: 'BackstopJS',
      id: 'backstop_default',
      tests: [
        {
          pair: {
            label: 'a',
          },
          status: 'success',
        }
      ]
    });
  });
});

describe('writeConfigJs', () => {
  test('it writes config.js to specified path', () => {
    const tmpPath = path.join(os.tmpdir(), Math.random().toString());
    writeConfigJs(tmpPath, { tests: [] });
    expect(fs.readFileSync(tmpPath).toString()).toEqual(`report({\n  "tests": []\n});`);
  });
});