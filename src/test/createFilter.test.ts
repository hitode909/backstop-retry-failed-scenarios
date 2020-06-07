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
          },
          status: 'fail',
        },
        {
          pair: {
            label: 'b',
            viewportLabel: 'pc',
          },
          status: 'pass',
        },
        {
          pair: {
            label: 'c',
            viewportLabel: 'pc',
          },
          status: 'fail',
        },
        {
          pair: {
            label: 'a',
            viewportLabel: 'pc',
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
        },
        status: 'fail',
      },
      {
        pair: {
          label: '(',
          viewportLabel: 'pc',
        },
        status: 'fail',
      },
    ],
  });
  expect(filter).toStrictEqual('^(\\^|\\()$');
  expect(new RegExp(filter || '')).toStrictEqual(/^(\^|\()$/);
});
