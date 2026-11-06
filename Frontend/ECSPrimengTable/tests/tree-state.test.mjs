import '@angular/compiler';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import {
  TreeTableState, ECSPrimengTable, ECSPrimengTableStateService, ECSPrimengTableI18nService,
  createTableOptions, DataType, TableViewSaveMode
} from '../dist/ecs-primeng-table/fesm2022/eternalcodestudio-primeng-table.mjs';

const options = mode => ({ keyExpr: 'id', parentIdExpr: 'parentId', rootValue: 0,
  hasItemsExpr: 'hasChildren', column: 'text', loadMode: mode });
const row = (id, parentId = 0, hasChildren = false) => ({ id, parentId, hasChildren, rowID: id + 1000, text: `Node ${id}` });
const response = (data, total = data.length, page = 0, ancestorKeys = []) =>
  ({ data, totalRecords: total, totalRecordsNotFiltered: total, page, ancestorKeys });
const ids = state => state.visible.filter(item => !state.isMore(item)).map(item => item.id);
const deferred = () => { let resolve; let reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };

test('all mode builds a local hierarchy, pages roots only and preserves nested expansion on collapse', async () => {
  const state = new TreeTableState(options('all'));
  const data = [row(1), row(2, 1), row(3, 2), row(4), row(5, 4)];
  const requests = [];
  const fetch = async request => { requests.push(request); return response(data, 2); };
  await state.load(0, 1, fetch);
  assert.deepEqual(ids(state), [1]);
  await state.toggle(data[0], fetch); await state.toggle(data[1], fetch);
  assert.deepEqual(ids(state), [1, 2, 3]);
  assert.deepEqual(state.visible.map(item => state.depth(item)), [0, 1, 2]);
  await state.toggle(data[0], fetch);
  assert.deepEqual(ids(state), [1]); assert.ok(state.expanded.has(2));
  await state.toggle(data[0], fetch); assert.deepEqual(ids(state), [1, 2, 3]);
  assert.equal(requests.length, 1, 'Local expansion must not fetch children');
  await state.load(1, 1, fetch); assert.deepEqual(ids(state), [4]);
  assert.equal(state.totalRecords, 2);
});

test('onDemand caches nested children and restores them without duplicate child requests', async () => {
  const state = new TreeTableState(options('onDemand'));
  const root = row(1, 0, true); const child = row(2, 1, true); const leaf = row(3, 2);
  const requests = [];
  const fetch = async request => { requests.push(request); return response(request.roots ? [root] : request.parentId === 1 ? [child] : [leaf]); };
  await state.load(0, 10, fetch); await state.toggle(root, fetch); await state.toggle(child, fetch);
  await state.toggle(root, fetch); await state.toggle(root, fetch);
  assert.deepEqual(ids(state), [1, 2, 3]); assert.equal(requests.length, 3);
  const restored = new TreeTableState(options('onDemand'));
  restored.restore([...state.expanded]); await restored.load(0, 10, fetch);
  assert.deepEqual(ids(restored), [1, 2, 3]);
  assert.deepEqual(requests.slice(3).map(request => request.parentId), [0, 1, 2]);
});

test('pagedChildren appends more than ten children and restores loaded child pages', async () => {
  const root = row(1, 0, true); const children = Array.from({ length: 32 }, (_, index) => row(index + 2, 1));
  const fetch = async request => request.roots ? response([root], 1) :
    response(children.slice(request.page * 10, (request.page + 1) * 10), 32, request.page);
  const state = new TreeTableState(options('pagedChildren'));
  await state.load(0, 10, fetch); await state.toggle(root, fetch);
  assert.equal(ids(state).length, 11);
  assert.equal(state.moreParent(state.visible.at(-1)), 1);
  await state.loadMore(state.visible.at(-1), fetch);
  await state.loadMore(state.visible.at(-1), fetch);
  assert.equal(ids(state).length, 31);
  const restored = new TreeTableState(options('pagedChildren'));
  restored.restore([...state.expanded], state.snapshotPages()); await restored.load(0, 10, fetch);
  assert.deepEqual(ids(restored), ids(state));
  await restored.loadMore(restored.visible.at(-1), fetch);
  assert.equal(ids(restored).length, 33);
  assert.ok(restored.visible.every(item => !restored.isMore(item)));
});

test('matching ancestor keys open the complete nested filter path in every mode', async () => {
  for (const mode of ['all', 'onDemand', 'pagedChildren']) {
    const state = new TreeTableState(options(mode));
    const data = [row(1, 0, true), row(2, 1, true), row(3, 2)];
    await state.load(0, 10, async request => response(mode === 'all' ? data :
      request.roots ? [data[0]] : data.filter(item => item.parentId === request.parentId), 1, 0, [1, 2]));
    assert.deepEqual(ids(state), [1, 2, 3], mode);
  }
});

test('duplicate IDs, missing parents and disconnected cycles reject all mode', async () => {
  for (const [data, expected] of [
    [[row(1), row(1)], /Duplicate/], [[row(2, 999)], /Missing tree parent/],
    [[row(1, 2), row(2, 1)], /Tree cycle/], [[row(1, 1)], /Tree cycle/]
  ]) {
    const state = new TreeTableState(options('all'));
    await assert.rejects(state.load(0, 10, async () => response(data)), expected);
    assert.equal(state.loading, false);
  }
});

test('a 12000-level hierarchy loads and expands iteratively', async () => {
  const count = 12000;
  const data = Array.from({ length: count }, (_, index) => row(index + 1, index));
  const state = new TreeTableState(options('all'));
  state.restore(data.map(item => item.id));
  await state.load(0, 10, async () => response(data, 1));
  assert.equal(state.visible.length, count); assert.equal(state.depth(state.visible.at(-1)), count - 1);
});

test('stale root and child responses cannot overwrite the current version', async () => {
  const state = new TreeTableState(options('onDemand')); const oldRoot = deferred();
  const pending = state.load(0, 10, () => oldRoot.promise);
  await state.load(0, 10, async () => response([row(2)]));
  oldRoot.resolve(response([row(1)])); assert.equal(await pending, false); assert.deepEqual(ids(state), [2]);
  const root = row(3, 0, true); await state.load(0, 10, async () => response([root]));
  const oldChild = deferred(); const expanding = state.toggle(root, () => oldChild.promise);
  await state.load(0, 10, async () => response([row(4)]));
  oldChild.resolve(response([row(5, 3)])); await expanding; assert.deepEqual(ids(state), [4]);
});

test('rejected root/child/more fetches clear loading and allow retry', async () => {
  const state = new TreeTableState(options('pagedChildren')); const root = row(1, 0, true);
  const fail = async () => { throw new Error('offline'); };
  await assert.rejects(state.load(0, 10, fail), /offline/); assert.equal(state.loading, false);
  await state.load(0, 10, async () => response([root]));
  await assert.rejects(state.toggle(root, fail), /offline/);
  assert.equal(state.isLoading(root), false); assert.equal(state.expanded.has(1), false);
  await state.toggle(root, async () => response([row(2, 1)], 2));
  await assert.rejects(state.loadMore(state.visible.at(-1), fail), /offline/);
  await state.loadMore(state.visible.at(-1), async () => response([row(3, 1)], 2, 1));
  assert.deepEqual(ids(state), [1, 2, 3]);
});

test('remote children reject unexpected parents and duplicate cached IDs', async () => {
  for (const [child, expected] of [[row(2, 99), /Unexpected/], [row(1, 1), /Duplicate/]]) {
    const root = row(1, 0, true); const state = new TreeTableState(options('onDemand'));
    await state.load(0, 10, async () => response([root]));
    await assert.rejects(state.toggle(root, async () => response([child])), expected);
    assert.equal(state.isLoading(root), false);
  }
});

function componentHarness(parent, { mode = 'onDemand', key = mode, storage, savedView } = {}) {
  const injector = createEnvironmentInjector([ECSPrimengTableI18nService], parent);
  const configuration = new Subject(); const requests = []; const errors = []; const root = row(1, 0, true);
  const service = {
    fetchTableConfiguration: () => configuration,
    orderColumnsWithFrozens: columns => columns, computeColumnWidths: () => '', computeTableWidth: () => '',
    fetchTableData: (_url, request) => { requests.push(structuredClone(request));
      return of(new HttpResponse({ body: response(request.roots ? [root] : [row(2, 1)], 1) })); },
    fetchTableViews: () => storage === TableViewSaveMode.DatabaseStorage ?
      of(new HttpResponse({ body: savedView ? [{ viewAlias: 'saved', lastActive: true, viewData: JSON.stringify(savedView) }] : [] })) :
      savedView ? [{ viewAlias: 'saved', lastActive: true, viewData: savedView }] : [],
    sortViews() {}, updateViewsMenuItems: () => [], handleTableError: (...args) => errors.push(args),
    viewGenerateData: (_table, search, page, size) => ({ columnsShown: [{ field: 'text' }], globalSearchText: search,
      currentPage: page, currentRowsPerPage: size, filters: {}, multiSortMeta: [], tableWidth: '', columnsWidth: '' })
  };
  const component = runInInjectionContext(injector, () => new ECSPrimengTable(service, { showToast() {} }));
  component.tableOptions = createTableOptions({ tree: options(mode), statePersistence: { enabled: true, key },
    urlTableConfiguration: '/tree/config', urlTableData: '/tree/data',
    rows: { checkboxSelector: { enabled: true }, singleSelector: { enabled: true } },
    views: storage ? { saveMode: storage, saveKey: 'TreeDemo', urlGet: '/views', urlSave: '/views' } : undefined });
  component.dt = { filters: {}, first: 0, rows: 10, multiSortMeta: [], sortMultiple() {}, restoreColumnWidths() {}, filter() {},
    filterGlobal(value) { this.filters.global = { value, matchMode: 'contains' }; } };
  return { component, requests, errors,
    async start() {
      component.ngOnInit(); configuration.next(new HttpResponse({ body: {
        columnsInfo: [{ field: 'text', header: 'Text', dataType: DataType.String, canBeHidden: false }],
        allowedItemsPerPage: [10, 25], maxViews: storage ? 10 : 0,
        dateFormat: 'yyyy-MM-dd', dateTimezone: '+00:00', dateCulture: 'en-US', exportDateFormat: 'yyyy-MM-dd'
      } })); await settle(component);
    },
    destroy() { component.ngOnDestroy(); injector.destroy(); }
  };
}

async function settle(component) {
  for (let turn = 0; turn < 30; turn++) await Promise.resolve();
  assert.equal(component.treeState.loading, false, 'Synchronous mock responses must finish');
}

test('component navigation restores expanded rows before querying, with one root load and no selection cascade', async () => {
  const parent = createEnvironmentInjector([ECSPrimengTableStateService]);
  const first = componentHarness(parent); await first.start();
  await first.component.toggleTreeRow({ stopPropagation() {} }, first.component.tableOptions.data[0]);
  first.component.selectedRowsCheckbox = [1001];
  assert.deepEqual(first.component.selectedRowsCheckbox, [1001]);
  first.destroy();
  const back = componentHarness(parent); await back.start();
  assert.deepEqual(ids(back.component.treeState), [1, 2]);
  assert.equal(back.requests.filter(request => request.roots).length, 1);
  assert.equal(back.requests.filter(request => !request.roots).length, 1);
  assert.deepEqual(back.component.selectedRowsCheckbox, []);
  assert.ok(back.requests[0].columns.includes('id')); assert.ok(back.requests[0].columns.includes('parentId'));
  assert.deepEqual(back.errors, []); back.destroy(); parent.destroy();
});

test('component mode keys keep independent navigation state', async () => {
  const parent = createEnvironmentInjector([ECSPrimengTableStateService]);
  const demand = componentHarness(parent); await demand.start();
  await demand.component.toggleTreeRow({ stopPropagation() {} }, demand.component.tableOptions.data[0]); demand.destroy();
  const paged = componentHarness(parent, { mode: 'pagedChildren' }); await paged.start();
  assert.deepEqual(ids(paged.component.treeState), [1]); assert.equal(paged.requests.length, 1);
  paged.destroy(); const back = componentHarness(parent); await back.start();
  assert.deepEqual(ids(back.component.treeState), [1, 2]); back.destroy(); parent.destroy();
});

for (const storage of [TableViewSaveMode.LocalStorage, TableViewSaveMode.DatabaseStorage]) {
  test(`component saved views round-trip expansion for storage ${storage}`, async () => {
    const parent = createEnvironmentInjector([ECSPrimengTableStateService]);
    const first = componentHarness(parent, { storage }); await first.start();
    await first.component.toggleTreeRow({ stopPropagation() {} }, first.component.tableOptions.data[0]);
    const saved = first.component.generateViewData();
    assert.deepEqual(saved.treeExpandedKeys, [1]); first.destroy(); parent.get(ECSPrimengTableStateService).clear('onDemand');
    const restored = componentHarness(parent, { storage, savedView: saved }); await restored.start();
    assert.deepEqual(ids(restored.component.treeState), [1, 2]); assert.equal(restored.requests.length, 2);
    assert.deepEqual(restored.errors, []); restored.destroy(); parent.destroy();
  });
}