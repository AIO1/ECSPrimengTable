import '@angular/compiler';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { of, Subject, throwError } from 'rxjs';
import {
  ECSPrimengTableI18nService, ECSPrimengTable, ECSPrimengTableStateService, createTableOptions, DataType,
  TableViewSaveMode
} from '../dist/ecs-primeng-table/fesm2022/eternalcodestudio-primeng-table.mjs';

test('optional select-all spans pages, preserves outside selections and emits only changed IDs', async () => {
  const parent = scope(); const fixture = list(parent); fixture.start();
  const c = fixture.component;
  assert.equal(c.tableOptions.rows.checkboxSelector.selectAllEnabled, false);
  c.tableOptions.rows.checkboxSelector = { enabled: true, selectAllEnabled: true, urlSelectAll: '/keys' };
  const requests = [];
  c.tableService.fetchSelectionKeys = (url, query) => {
    requests.push({ url, query });
    return of(new HttpResponse({ body: [1, 2, 3, 3] }));
  };
  c.selectedRowsCheckbox = [99, 1];
  const events = []; c.onRowCheckboxChange.subscribe(event => events.push(event));
  await c.toggleAllMatchingRows(true);
  assert.deepEqual(c.selectedRowsCheckbox, [99, 1, 2, 3]);
  assert.deepEqual(events.map(e => e.rowID), [2, 3]);
  assert.equal(c.allMatchingRowsSelected, true);
  c.fetchTableData({ first: 10, rows: 10, filters: {} });
  assert.equal(c.allMatchingRowsSelected, true, 'Paging preserves header state');
  c.onRowChekboxChange({ checked: false }, 2);
  assert.equal(c.matchingRowsPartiallySelected, true);
  await c.toggleAllMatchingRows(false);
  assert.deepEqual(c.selectedRowsCheckbox, [99]);
  assert.equal(c.allMatchingRowsSelected, false);
  assert.equal(c.matchingRowsPartiallySelected, false);
  assert.equal(requests[0].url, '/keys');
  fixture.destroy(); parent.destroy();
});

test('select-all ignores stale filter responses, keeps selections on failure and skips disabled rows', async () => {
  const parent = scope(); const fixture = list(parent); fixture.start(); const c = fixture.component;
  c.tableOptions.rows.checkboxSelector = { enabled: true, selectAllEnabled: true, urlSelectAll: '/keys', enabledCondition: row => row.rowID !== 2 };
  c.tableOptions.data = [{ rowID: 1 }, { rowID: 2 }];
  c.selectedRowsCheckbox = [99];
  let response = new Subject(); c.tableService.fetchSelectionKeys = () => response;
  const pending = c.toggleAllMatchingRows(true);
  c.globalSearchText = 'Ana';
  c.fetchTableData({ first: 0, rows: 10, filters: {} });
  response.next(new HttpResponse({ body: [1, 2] }));
  await pending;
  assert.deepEqual(c.selectedRowsCheckbox, [99]);
  c.tableService.fetchSelectionKeys = () => throwError(() => new Error('offline'));
  await c.toggleAllMatchingRows(true);
  assert.deepEqual(c.selectedRowsCheckbox, [99]);
  assert.equal(c.selectAllLoading, false);
  c.tableOptions.data = [{ rowID: 1 }, { rowID: 2 }];
  c.tableService.fetchSelectionKeys = () => of(new HttpResponse({ body: [1, 2, 3] }));
  await c.toggleAllMatchingRows(true);
  assert.deepEqual(c.selectedRowsCheckbox, [99, 1, 3]);
  fixture.destroy(); parent.destroy();
});

function scope() {
  return createEnvironmentInjector([ECSPrimengTableStateService]);
}

function list(parent, { enabled = true, key = 'people', views = false, failedViews = false, dataUrl = '/data' } = {}) {
  const injector = createEnvironmentInjector([ECSPrimengTableI18nService], parent);
  const configurations = new Subject();
  const savedViews = new Subject();
  const requests = [];
  const notifications = [];
  const service = {
    fetchTableConfiguration: () => configurations,
    orderColumnsWithFrozens: columns => columns,
    computeColumnWidths: () => '', computeTableWidth: () => '',
    fetchTableData: (_url, request) => {
      requests.push(structuredClone(request));
      return of(new HttpResponse({ body: { page: request.page, data: [{ fresh: requests.length }], totalRecords: 100, totalRecordsNotFiltered: 100 } }));
    },
    fetchTableViews: () => failedViews ? throwError(() => new Error('offline')) : savedViews,
    handleTableError: (...args) => notifications.push(args),
    sortViews: () => {}, updateViewsMenuItems: () => []
  };
  const component = runInInjectionContext(injector, () =>
    new ECSPrimengTable(service, { showToast: (...args) => notifications.push(args) }));
  component.tableOptions = createTableOptions({
    statePersistence: { enabled, key },
    urlTableConfiguration: '/config', urlTableData: dataUrl,
    predefinedFilters: { statuses: [{ value: 0, name: 'Zero' }, { value: 1, name: 'One' }] },
    views: views ? { saveMode: TableViewSaveMode.DatabaseStorage, saveKey: 'views', urlGet: '/views', urlSave: '/views' } : undefined
  });
  let sorts = [];
  component.dt = {
    filters: {}, first: 0, rows: 10,
    get multiSortMeta() { return sorts; },
    set multiSortMeta(value) {
      sorts = value;
      // PrimeNG can emit during restoration: this must not send an early request.
      component.fetchTableData({ first: 0, rows: 10, filters: {}, multiSortMeta: value });
    },
    sortMultiple() {}, restoreColumnWidths() {}, filter() {},
    filterGlobal(value) { this.filters.global = { value, matchMode: 'contains' }; }
  };
  const columns = [
    { field: 'name', header: 'Name', dataType: DataType.String, canBeHidden: false },
    { field: 'birthdate', header: 'Birthdate', dataType: DataType.Date, canBeHidden: true },
    { field: 'status', header: 'Status', filterPredefinedValuesName: 'statuses', canBeHidden: true }
  ];
  const config = { columnsInfo: columns, allowedItemsPerPage: [10, 25], dateFormat: 'yyyy-MM-dd',
    dateTimezone: '+00:00', dateCulture: 'en-US', exportDateFormat: 'yyyy-MM-dd', maxViews: views ? 10 : 0 };
  return {
    component, requests, savedViews, notifications,
    start() { component.ngOnInit(); configurations.next(new HttpResponse({ body: config })); },
    destroy() { component.ngOnDestroy(); injector.destroy(); },
    resetResponse() { configurations.next(new HttpResponse({ body: config })); }
  };
}

function filter(component) {
  component.globalSearchText = 'Ana';
  component.dt.filters = {
    name: [{ value: 'Ana', matchMode: 'contains', operator: 'and' }],
    birthdate: [{ value: new Date(2000, 2, 4), matchMode: 'dateIs', operator: 'and' }],
    status: [{ value: [0], matchMode: 'in', operator: 'and' }],
    selector: [{ value: true, matchMode: 'equals' }]
  };
  component.dt.multiSortMeta = [{ field: 'name', order: -1 }];
  component.currentPage = 2;
  component.currentRowsPerPage = 25;
}

test('global search requires trimmed minimum length and restarts its debounce after each letter', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const parent = scope(); const f = list(parent); f.start(); const c = f.component;
  c.tableOptions.globalFilter = { enabled: true, minLength: 3, debounceTime: 400 };
  f.requests.length = 0;
  c.onGlobalSearchInput(' D '); t.mock.timers.tick(1000);
  c.onGlobalSearchInput('Da'); t.mock.timers.tick(1000);
  assert.equal(f.requests.length, 0);
  c.onGlobalSearchInput('Dan'); t.mock.timers.tick(399);
  c.onGlobalSearchInput('Dani'); t.mock.timers.tick(399);
  assert.equal(f.requests.length, 0);
  c.onGlobalSearchInput('Daniel');
  c.fetchTableData({ first: 20, rows: 10, filters: {} });
  assert.equal(f.requests.at(-1).globalFilter, null, 'Other actions must not leak pending input');
  f.requests.length = 0;
  t.mock.timers.tick(400);
  assert.equal(f.requests.length, 1);
  assert.equal(f.requests[0].globalFilter, 'Daniel');
  assert.equal(f.requests[0].page, 0);
  c.onGlobalSearchInput(' Daniel '); t.mock.timers.tick(1000);
  assert.equal(f.requests.length, 1, 'Equivalent trimmed text must not query again');
  c.onGlobalSearchInput('Da');
  assert.equal(f.requests.length, 2, 'Dropping below minimum removes the old query immediately');
  assert.equal(f.requests.at(-1).globalFilter, null);
  c.onGlobalSearchInput('D'); c.onGlobalSearchInput(''); t.mock.timers.tick(1000);
  assert.equal(f.requests.length, 2);
  f.destroy(); parent.destroy();
});

test('global search properties can be used independently and defaults retain PrimeNG filtering', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const parent = scope(); const f = list(parent); f.start(); const c = f.component;
  assert.equal(c.tableOptions.globalFilter.minLength, 0);
  assert.equal(c.tableOptions.globalFilter.debounceTime, 0);
  const nativeCalls = []; c.dt.filterGlobal = (...args) => nativeCalls.push(args);
  c.onGlobalSearchInput('D');
  assert.deepEqual(nativeCalls, [['D', 'contains']]);
  c.tableOptions.globalFilter = { minLength: 3 };
  c.onGlobalSearchInput('Dan');
  assert.equal(f.requests.at(-1).globalFilter, 'Dan');
  c.tableOptions.globalFilter = { debounceTime: 400 };
  const count = f.requests.length; c.onGlobalSearchInput('A');
  t.mock.timers.tick(399); assert.equal(f.requests.length, count);
  t.mock.timers.tick(1); assert.equal(f.requests.at(-1).globalFilter, 'A');
  c.onGlobalSearchInput('');
  assert.equal(f.requests.at(-1).globalFilter, null);
  f.destroy(); parent.destroy();
});

test('clear, view restore and destruction cancel pending global searches', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const parent = scope(); const f = list(parent); f.start(); const c = f.component;
  c.tableOptions.globalFilter = { minLength: 3, debounceTime: 400 };
  c.onGlobalSearchInput('Daniel'); c.clearFilters(c.dt, true, true);
  let count = f.requests.length; t.mock.timers.tick(1000);
  assert.equal(f.requests.length, count); assert.equal(c.globalSearchText, null);
  c.tableViewsList = [{ viewAlias: 'saved', viewData: {
    columnsShown: c.columns, currentPage: 2, currentRowsPerPage: 10,
    globalSearchText: 'saved search', multiSortMeta: [], filters: {}, tableWidth: '', columnsWidth: ''
  } }];
  c.onGlobalSearchInput('Daniel'); c.viewLoad('saved');
  count = f.requests.length; t.mock.timers.tick(1000);
  assert.equal(f.requests.length, count);
  assert.equal(f.requests.at(-1).globalFilter, 'saved search');
  assert.equal(f.requests.at(-1).page, 2, 'Restoring a view preserves its page');
  c.onGlobalSearchInput('Daniel'); f.destroy();
  count = f.requests.length; t.mock.timers.tick(1000);
  assert.equal(f.requests.length, count);
  assert.equal(parent.get(ECSPrimengTableStateService).get('people').globalSearchText, 'saved search');
  parent.destroy();
});

test('A -> detail -> A restores before its first fresh query, including dates and predefined values', () => {
  const parent = scope();
  const a = list(parent); a.start(); filter(a.component); a.destroy();
  const back = list(parent); back.start();
  assert.equal(back.requests.length, 1);
  const request = back.requests[0];
  assert.equal(request.globalFilter, 'Ana');
  assert.equal(request.filter.name[0].value, 'Ana');
  assert.equal(request.page, 2);
  assert.equal(request.pageSize, 25);
  assert.deepEqual(request.sort, [{ field: 'name', order: -1 }]);
  assert.equal(request.filter.selector, undefined);
  assert.equal(request.filter.rowID, undefined);
  assert.ok(back.component.dt.filters.birthdate[0].value instanceof Date);
  assert.equal(back.component.dt.filters.birthdate[0].value.getDate(), 4);
  assert.deepEqual(back.component.predefinedFiltersSelectedValuesCollection.statuses.map(x => x.value), [0]);
  assert.deepEqual(back.component.tableOptions.data, [{ fresh: 1 }]);
  back.destroy(); parent.destroy();
});

test('A -> detail -> B -> A gets a fresh scope with no old filters', () => {
  const firstScope = scope();
  const a = list(firstScope); a.start(); filter(a.component); a.destroy();
  const discarded = firstScope.get(ECSPrimengTableStateService);
  firstScope.destroy();
  assert.equal(discarded.get('people'), undefined);
  const bScope = scope();
  const b = list(bScope); b.start(); filter(b.component); b.destroy(); bScope.destroy();
  const newAScope = scope();
  const back = list(newAScope); back.start();
  assert.equal(back.requests[0].globalFilter, null);
  assert.equal(back.requests[0].page, 0);
  assert.deepEqual(back.requests[0].filter, {});
  back.destroy(); newAScope.destroy();
});

test('disabled persistence requires no provider and never restores saved state', () => {
  assert.equal(createTableOptions().statePersistence.enabled, false);
  const noProvider = createEnvironmentInjector([ECSPrimengTableI18nService]);
  const standalone = list(noProvider, { enabled: false }); standalone.start(); standalone.destroy(); noProvider.destroy();
  const parent = scope();
  const a = list(parent); a.start(); filter(a.component); a.destroy();
  const disabled = list(parent, { enabled: false }); disabled.start();
  assert.equal(disabled.requests[0].globalFilter, null);
  disabled.destroy();
  assert.equal(parent.get(ECSPrimengTableStateService).get('people'), undefined);
  parent.destroy();
});

test('keys and different endpoints cannot mix queries', () => {
  const parent = scope();
  const a = list(parent); a.start(); filter(a.component); a.destroy();
  const other = list(parent, { key: 'invoices' }); other.start();
  assert.equal(other.requests[0].globalFilter, null); other.destroy();
  const newEndpoint = list(parent, { dataUrl: '/other-data' }); newEndpoint.start();
  assert.equal(newEndpoint.requests[0].globalFilter, null); newEndpoint.destroy(); parent.destroy();
});

test('scope destruction cannot be undone by a late table destruction', () => {
  const parent = scope();
  const a = list(parent); a.start(); filter(a.component);
  const service = parent.get(ECSPrimengTableStateService);
  parent.destroy(); a.destroy();
  assert.equal(service.get('people'), undefined);
});

test('startup waits for saved views; transient state takes precedence without early unfiltered requests', () => {
  const parent = scope();
  const a = list(parent); a.start(); filter(a.component); a.destroy();
  const back = list(parent, { views: true }); back.start();
  back.component.fetchTableData({ first: 0, rows: 10 });
  assert.equal(back.requests.length, 0);
  back.savedViews.next(new HttpResponse({ body: [{
    viewAlias: 'default', lastActive: true, viewData: JSON.stringify({})
  }] }));
  assert.equal(back.requests.length, 1);
  assert.equal(back.requests[0].globalFilter, 'Ana');
  back.destroy(); parent.destroy();
});

test('saved-view failure does not prevent restoring navigation filters', () => {
  const parent = scope();
  const a = list(parent); a.start(); filter(a.component); a.destroy();
  const back = list(parent, { views: true, failedViews: true }); back.start();
  assert.equal(back.requests.length, 1);
  assert.equal(back.requests[0].globalFilter, 'Ana');
  assert.equal(back.notifications.length, 1);
  back.destroy(); parent.destroy();
});

test('reset discards remembered filters and requests default data', () => {
  const parent = scope();
  const a = list(parent); a.start(); filter(a.component); a.destroy();
  const back = list(parent); back.start();
  back.component.resetTableView(); back.resetResponse();
  assert.equal(back.requests.at(-1).globalFilter, null);
  assert.equal(back.requests.at(-1).page, 0);
  back.destroy();
  const again = list(parent); again.start();
  assert.equal(again.requests[0].globalFilter, null);
  again.destroy(); parent.destroy();
});

test('enabled persistence requires an explicit scope and a non-empty key', () => {
  const parent = createEnvironmentInjector([ECSPrimengTableI18nService]);
  const missingScope = list(parent);
  assert.throws(() => missingScope.start(), /parent scope component/);
  missingScope.destroy(); parent.destroy();
  const validScope = scope();
  const noKey = list(validScope, { key: ' ' });
  assert.throws(() => noKey.start(), /non-empty key/);
  noKey.destroy(); validScope.destroy();
});

test('destroying a list with pending startup views cancels restoration and data loading', () => {
  const parent = scope();
  const a = list(parent, { views: true }); a.start(); a.destroy();
  a.savedViews.next(new HttpResponse({ body: [] }));
  assert.equal(a.requests.length, 0);
  parent.destroy();
});

test('startup saved view still loads when automatic persistence is disabled, with one correctly paged request', () => {
  const parent = scope();
  const a = list(parent, { enabled: false, views: true }); a.start();
  a.savedViews.next(new HttpResponse({ body: [{
    viewAlias: 'saved', lastActive: true, viewData: JSON.stringify({
      columnsShown: [{ field: 'name' }], currentPage: 2, currentRowsPerPage: 25,
      globalSearchText: 'saved search', multiSortMeta: [{ field: 'name', order: -1 }],
      filters: { name: [{ value: 'saved', matchMode: 'contains' }] },
      tableWidth: '', columnsWidth: ''
    })
  }] }));
  assert.equal(a.requests.length, 1);
  assert.equal(a.requests[0].page, 2);
  assert.equal(a.requests[0].pageSize, 25);
  assert.equal(a.requests[0].globalFilter, 'saved search');
  assert.equal(a.requests[0].filter.name[0].value, 'saved');
  a.destroy(); parent.destroy();
});

test('state cloning prevents date conversion and later edits from changing the stored snapshot', () => {
  const parent = scope();
  const a = list(parent); a.start(); filter(a.component); a.destroy();
  const service = parent.get(ECSPrimengTableStateService);
  const before = service.get('people');
  const b = list(parent); b.start();
  b.component.dt.filters.name[0].value = 'changed';
  assert.equal(service.get('people').filters.name[0].value, 'Ana');
  assert.equal(service.get('people').filters.birthdate[0].value.getTime(), before.filters.birthdate[0].value.getTime());
  b.destroy(); parent.destroy();
});

test('deferred initialization restores after updateData enables the table', () => {
  const parent = scope();
  const a = list(parent); a.start(); filter(a.component); a.destroy();
  const back = list(parent);
  back.component.tableOptions.isActive = false;
  back.start();
  assert.equal(back.requests.length, 0);
  back.component.updateData();
  back.resetResponse();
  assert.equal(back.requests.length, 1);
  assert.equal(back.requests[0].globalFilter, 'Ana');
  back.destroy(); parent.destroy();
});
