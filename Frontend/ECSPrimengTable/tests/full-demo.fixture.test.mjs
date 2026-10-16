import { test } from 'node:test';
import assert from 'node:assert/strict';
import { queryFixture } from './full-demo.fixture.mjs';

const rows = [
  { rowID: 1, statuses: 'Full-time;Student', status: 'Full-time' },
  { rowID: 2, statuses: 'Student', status: 'Student' },
  { rowID: 3, statuses: 'Freelance;Student', status: 'Freelance' },
  { rowID: 4, statuses: 'Freelance', status: 'Freelance' },
  { rowID: 5, statuses: null, status: null },
  { rowID: 6, statuses: '', status: '' }
];
const request = (key, value) => ({ filter: { [key]: [{ value, matchMode: 'in', operator: 'or' }] }, pageSize: 10 });

test('list IN keeps rows containing any selected item, including multi-item rows', () => {
  const result = queryFixture(rows, request('statuses', ['Full-time', 'Student']), ['statuses']);
  assert.deepEqual(result.data.map(row => row.rowID), [1, 2, 3]);
  assert.equal(result.totalRecords, 3);
});

test('list IN matches whole trimmed items, excludes null/empty and ignores empty selection', () => {
  assert.deepEqual(queryFixture(rows, request('statuses', ['Full-time']), ['statuses']).data.map(row => row.rowID), [1]);
  assert.equal(queryFixture(rows, request('statuses', []), ['statuses']).totalRecords, rows.length);
  assert.equal(queryFixture([{ statuses: ' Full-time ; Student ' }, { statuses: 'StudentExtra' }],
    request('statuses', ['Student']), ['statuses']).totalRecords, 1);
});

test('ordinary predefined-value columns keep scalar IN matching', () => {
  assert.deepEqual(queryFixture(rows, request('status', ['Full-time', 'Student']), ['statuses']).data.map(row => row.rowID), [1, 2]);
});
