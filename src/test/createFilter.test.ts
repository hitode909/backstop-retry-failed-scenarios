import {createFilter} from '../lib/createFilter';

test('it returns null for empty input', () => {
  expect(createFilter({tests: []})).toStrictEqual(null);
});

test('returns empty string when all tests succeed', () => {
  expect(
    createFilter({
      tests: [
        {
          pair: {
            label: 'a',
            viewportLabel: 'pc',
            fileName: 'a-pc.png',
          },
          status: 'pass',
        },
      ],
    })
  ).toStrictEqual(null);
});

test('returns filter string from failed tests', () => {
  expect(
    createFilter({
      tests: [
        {
          pair: {
            label: 'a',
            viewportLabel: 'pc',
            fileName: 'a-pc.png',
          },
          status: 'fail',
        },
        {
          pair: {
            label: 'b',
            viewportLabel: 'pc',
            fileName: 'b-pc.png',
          },
          status: 'pass',
        },
        {
          pair: {
            label: 'c',
            viewportLabel: 'pc',
            fileName: 'c-pc.png',
          },
          status: 'fail',
        },
        {
          pair: {
            label: 'a',
            viewportLabel: 'pc',
            fileName: 'a-pc.png',
          },
          status: 'fail',
        },
      ],
    })
  ).toStrictEqual('^(a|c)$');
});

test('it escapes string for RegExp', () => {
  const filter = createFilter({
    tests: [
      {
        pair: {
          label: '^',
          viewportLabel: 'pc',
          fileName: '^.png',
        },
        status: 'fail',
      },
      {
        pair: {
          label: '(',
          viewportLabel: 'pc',
          fileName: '(.png',
        },
        status: 'fail',
      },
    ],
  });
  expect(filter).toStrictEqual('^(\\^|\\()$');
  expect(new RegExp(filter || '')).toStrictEqual(/^(\^|\()$/);
});
