const { extractConfigJs } = require('../lib/configJsParser');

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