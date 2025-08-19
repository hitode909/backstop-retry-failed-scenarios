import { createTestFixture } from './testHelpers';

import fs from 'fs';
import { extractConfigJs, writeConfigJs } from '../lib/htmlReportJsParser';

describe('extractConfigJs', () => {
  const fixture = createTestFixture();
  test('it throws error when the target file is missing or broken', async () => {
    await fixture.copy();
    expect(() => {
      extractConfigJs(fixture.resolve('notExistFile'));
    }).toThrow(/no such file or directory/);
    expect(() => {
      extractConfigJs(fixture.resolve('config.js.invalid'));
    }).toThrow(/Unexpected token/);
  });
  test('it extracts argument from JavaScript string file', async () => {
    await fixture.copy();
    expect(extractConfigJs(fixture.resolve('config.js.valid'))).toStrictEqual({
      testSuite: 'BackstopJS',
      id: 'backstop_default',
      tests: [
        {
          pair: {
            label: 'a',
          },
          status: 'pass',
        },
      ],
    });
  });
});

describe('writeConfigJs', () => {
  const fixture = createTestFixture();
  test('it writes config.js to specified path', async () => {
    await fixture.copy();
    const tmpPath = fixture.resolve('tmp.json');
    writeConfigJs(tmpPath, { tests: [] });
    expect(fs.readFileSync(tmpPath).toString()).toEqual(
      'report({\n  "tests": []\n});'
    );
  });
});
