import '@angular/compiler';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { ECSPrimengTable, createTableOptions, DeviceType } from '../dist/ecs-primeng-table/fesm2022/eternalcodestudio-primeng-table.mjs';

function setup(options = {}, width = 1400) {
  const injector = createEnvironmentInjector([]);
  const c = runInInjectionContext(injector, () => new ECSPrimengTable({
    orderColumnsWithFrozens: columns => columns,
    handleButtonsClick: (action, row) => action(row)
  }, { showToast() {} }));
  c.tableOptions = createTableOptions(options);
  globalThis.window = { innerWidth: width };
  c.updateResponsiveViewport();
  const requests = [];
  c.fetchTableData = event => requests.push({ event, fields: c.tableOptions.columns.shown.map(col => col.field) });
  c.initialConfigurationFetched = true;
  c.initialStateApplied = true;
  c.columns = [
    { field: 'required', canBeHidden: false, visibleOnlyIn: [DeviceType.Desktop] },
    { field: 'legacy', canBeHidden: true },
    { field: 'hidden', canBeHidden: true, startHidden: true, visibleOnlyIn: [DeviceType.Mobile] },
    { field: 'desktop', canBeHidden: true, visibleOnlyIn: [DeviceType.Desktop] },
    { field: 'tablet', canBeHidden: true, visibleOnlyIn: [DeviceType.Desktop, DeviceType.Tablet] },
    { field: 'empty', canBeHidden: true, visibleOnlyIn: [] }
  ];
  c.columnsCantBeHidden = c.columns.filter(col => !col.canBeHidden);
  c.columnsSelected = c.columns.filter(col => col.canBeHidden && c.isInitiallyVisible(col));
  c.tableOptions.columns.shown = [...c.columnsCantBeHidden, ...c.columnsSelected];
  return { c, requests, close() { injector.destroy(); delete globalThis.window; } };
}

test('legacy applications keep buttons and widths, including on phones', () => {
  const x = setup({}, 360);
  assert.equal(x.c.compactHeader, false);
  assert.equal(x.c.compactRows, false);
  assert.equal(x.c.actionColumnWidth, 150);
  assert.equal(x.c.isInitiallyVisible({ canBeHidden: true }), true);
  assert.equal(x.c.isInitiallyVisible({ canBeHidden: true, startHidden: true }), false);
  x.close();
});

test('breakpoints are inclusive and independently configurable', () => {
  const x = setup({ responsive: { headerMenu: true, rowMenu: false, tabletMinWidth: 600, desktopMinWidth: 1000 } });
  for (const [width, device] of [[599, DeviceType.Mobile], [600, DeviceType.Tablet], [999, DeviceType.Tablet], [1000, DeviceType.Desktop]]) {
    window.innerWidth = width; x.c.updateResponsiveViewport();
    assert.equal(x.c.deviceType, device);
    assert.equal(x.c.compactHeader, device !== DeviceType.Desktop);
    assert.equal(x.c.compactRows, false);
  }
  x.c.tableOptions.responsive.rowMenu = true;
  window.innerWidth = 360; x.c.updateResponsiveViewport();
  assert.equal(x.c.actionColumnWidth, 56);
  x.close();
});

test('invalid breakpoints fail explicitly; no window uses Desktop', () => {
  const x = setup();
  for (const [tabletMinWidth, desktopMinWidth] of [[0, 1200], [900, 700], [800, 800], [NaN, 1200], [768, Infinity]]) {
    x.c.tableOptions.responsive = { tabletMinWidth, desktopMinWidth };
    assert.throws(() => x.c.updateResponsiveViewport(), /responsive widths/);
  }
  x.c.tableOptions.responsive = undefined; delete globalThis.window;
  x.c.updateResponsiveViewport(); assert.equal(x.c.deviceType, DeviceType.Desktop);
  x.close();
});

test('resize applies defaults, requests visible fields and preserves query state', () => {
  const x = setup();
  const query = { first: 20, rows: 10, filters: { legacy: { value: 'Ana' } }, multiSortMeta: [{ field: 'legacy', order: 1 }] };
  x.c.tableLazyLoadEventInformation = query;
  window.innerWidth = 800; x.c.updateResponsiveViewport();
  assert.deepEqual(x.requests.at(-1).fields, ['required', 'legacy', 'tablet', 'empty']);
  window.innerWidth = 360; x.c.updateResponsiveViewport();
  assert.deepEqual(x.requests.at(-1).fields, ['required', 'legacy', 'empty']);
  assert.equal(x.requests.at(-1).event, query);
  assert.equal(x.c.columns.length, 6); // Hidden columns remain available to the selector.
  window.innerWidth = 1400; x.c.updateResponsiveViewport();
  assert.ok(x.requests.at(-1).fields.includes('desktop'));
  x.close();
});

test('manual column selection survives resizing; saved view takes precedence', () => {
  const x = setup({}, 360);
  x.c.dt = { columns: x.c.tableOptions.columns.shown };
  x.c.columnModalData = [];
  // Applying an unchanged selection is still an explicit user preference.
  x.c.applyColumnModalChanges(x.c.columnsSelected);
  const shown = x.c.tableOptions.columns.shown;
  window.innerWidth = 1400; x.c.updateResponsiveViewport();
  assert.equal(x.c.tableOptions.columns.shown, shown);
  assert.equal(x.requests.length, 0);
  // Exercise the real view loader without depending on PrimeNG DOM rendering.
  x.c.tableViewsList = [{ viewAlias: 'custom', viewData: { columnsShown: [{ field: 'desktop' }], filters: {}, multiSortMeta: [], currentPage: 0, currentRowsPerPage: 10 } }];
  Object.assign(x.c.dt, { sortMultiple() {}, filters: {} });
  x.c.viewLoad('custom');
  window.innerWidth = 360; x.c.updateResponsiveViewport();
  assert.deepEqual(x.c.tableOptions.columns.shown.map(c => c.field), ['required', 'desktop']);
  x.close();
});

test('menu preserves visibility/disabled rules and dispatches to the correct row', () => {
  const clicked = [];
  const x = setup({ rows: { action: { buttons: [
    { tooltip: 'Edit', icon: 'pi pi-pencil', action: row => clicked.push(row.id) },
    { label: 'Disabled', enabledCondition: () => false, action: () => assert.fail('disabled action') },
    { label: 'Hidden', visibleCondition: () => false },
    { label: 'Hidden by condition', enabledCondition: () => false, conditionFailHide: true }
  ] } } });
  x.c.responsiveRowMenu = { hide() {}, show() {} };
  const event = { stopPropagation() {} };
  x.c.openRowMenu(event, { id: 1 });
  assert.deepEqual(x.c.rowMenuItems.map(i => i.label), ['Edit', 'Disabled']);
  assert.equal(x.c.rowMenuItems[1].disabled, true);
  x.c.rowMenuItems[1].command();
  x.c.openRowMenu(event, { id: 2 }); x.c.rowMenuItems[0].command();
  assert.deepEqual(clicked, [2]);
  const row = { allowed: true };
  const item = x.c.buttonMenuItems([{ enabledCondition: r => r.allowed, action: () => assert.fail('stale permission') }], row)[0];
  row.allowed = false; item.command();
  x.close();
});

test('header menu includes built-in actions and custom actions with null row', () => {
  let clicked;
  const x = setup({ header: { buttons: [{ label: 'Create', action: row => { clicked = row; } }] }, excelReport: { url: '/excel' } });
  x.c.dt = { filters: {}, multiSortMeta: [] };
  x.c.responsiveHeaderMenu = { toggle() {} };
  x.c.openHeaderMenu({});
  const labels = x.c.headerMenuItems.map(i => i.label);
  for (const label of ['Modify columns', 'Clear sorts', 'Clear filters', 'Export to Excel', 'Reset table view', 'Refresh data', 'Create']) assert.ok(labels.includes(label));
  x.c.headerMenuItems.find(i => i.label === 'Create').command();
  assert.equal(clicked, null);
  x.close();
});
