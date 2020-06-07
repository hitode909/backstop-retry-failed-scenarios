const fs = require('fs');
const { extractConfigJs, writeConfigJs } = require('../lib/htmlReportJsParser');
const {copy, resolve} = require('test-fixture')();

describe('extractConfigJs', () => {
  test('it throws error when the target file is missing or broken', async () => {
    await copy();
    expect(() => { extractConfigJs(resolve('notExistFile')) }).toThrow(/no such file or directory/);
    expect(() => { extractConfigJs(resolve('config.js.invalid')) }).toThrow(/Unexpected token/);
  });
  test('it extracts argument from JavaScript string file', async () => {
    await copy();
    expect(extractConfigJs(resolve('config.js.valid'))).toStrictEqual({
      testSuite: 'BackstopJS',
      id: 'backstop_default',
      tests: [
        {
          pair: {
            label: 'a',
          },
          status: 'pass',
        }
      ]
    });
  });
});

describe('writeConfigJs', () => {
  test('it writes config.js to specified path', async () => {
    await copy();
    const tmpPath = resolve('tmp.json');
    writeConfigJs(tmpPath, { tests: [] });
    expect(fs.readFileSync(tmpPath).toString()).toEqual(`report({\n  "tests": []\n});`);
  });
});