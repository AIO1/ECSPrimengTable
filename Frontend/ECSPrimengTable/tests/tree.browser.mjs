import '@angular/compiler';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve, extname, sep, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fullDemoFixture, queryFixture } from './full-demo.fixture.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { DataType, CellDisplay } = await import('../dist/ecs-primeng-table/fesm2022/eternalcodestudio-primeng-table.mjs');
const root = resolve('dist/ECSPrimengTable/browser');
const screenshots = process.env.TREE_SCREENSHOT_DIR || join(tmpdir(), 'ecs-tree-screenshots');
await mkdir(screenshots, { recursive: true });
const server = createServer(async (request, result) => {
  const path = resolve(root, '.' + new URL(request.url, 'http://localhost').pathname);
  if (!path.startsWith(root + sep)) { result.writeHead(403).end(); return; }
  const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json' };
  try { result.setHeader('Content-Type', mime[extname(path)] || 'application/octet-stream'); result.end(await readFile(path)); }
  catch { result.setHeader('Content-Type', 'text/html'); result.end(await readFile(join(root, 'index.html'))); }
});
await new Promise(done => server.listen(0, 'localhost', done));

const records = [];
function add(id, parentId, text) {
  records.push({ id, parentId, text, rowID: id + 10000, hasChildren: false,
    started: '2024-05-10T00:00:00Z', active: id % 2 === 0, budget: id * 12.5, progress: id % 101 });
}
for (let id = 1; id <= 36; id++) {
  add(id, 0, `Root ${String(id).padStart(2, '0')}`);
  for (let child = 0; child < 7; child++) add(100 + (id - 1) * 7 + child, id, `Child ${id}-${child}`);
}
for (let child = 0; child < 25; child++) add(1000 + child, 1, `Wide child ${child}`);
for (let level = 0; level < 4; level++) add(2000 + level, level === 0 ? 100 : 1999 + level,
  level === 3 ? 'Needle deep leaf' : `Deep branch ${level}`);
const byId = new Map(records.map(record => [record.id, record]));
for (const record of records) if (record.parentId) byId.get(record.parentId).hasChildren = true;
assert.equal(records.length, 317);

const columnsInfo = [
  { field: 'text', header: 'Text', dataType: DataType.String, initialWidth: 330 },
  { field: 'started', header: 'Started', dataType: DataType.Date },
  { field: 'active', header: 'Active', dataType: DataType.Boolean },
  { field: 'budget', header: 'Budget', dataType: DataType.Numeric },
  { field: 'progress', header: 'Progress', dataType: DataType.Numeric, cellDisplay: CellDisplay.ProgressBar }
].map(column => ({ dataAlignHorizontal: 0, dataAlignVertical: 1, frozenColumnAlign: 0,
  cellOverflowBehaviour: 0, canBeSorted: true, canBeFiltered: true, canBeResized: true,
  canBeReordered: true, canBeHidden: false, initialWidth: 150, dataTooltipShow: true, ...column }));

function queryTree(request) {
  const keyword = (request.globalFilter || '').toLowerCase();
  const retained = new Set(); const ancestors = new Set();
  for (const record of records) {
    if (keyword && !record.text.toLowerCase().includes(keyword)) continue;
    retained.add(record.id);
    if (keyword) {
      let parent = record.parentId;
      while (parent) { retained.add(parent); ancestors.add(parent); parent = byId.get(parent).parentId; }
    }
  }
  const siblings = parent => records.filter(record => record.parentId === parent && retained.has(record.id));
  const parent = request.roots ? 0 : request.parentId;
  const scope = siblings(parent);
  const page = request.loadMode === 'onDemand' && !request.roots ? 0 :
    Math.min(request.page, Math.max(0, Math.ceil(scope.length / request.pageSize) - 1));
  let data;
  if (request.loadMode === 'all') {
    data = []; const stack = siblings(0).reverse();
    while (stack.length) { const item = stack.pop(); data.push(item); stack.push(...siblings(item.id).reverse()); }
  } else data = request.loadMode === 'onDemand' && !request.roots ? scope :
    scope.slice(page * request.pageSize, (page + 1) * request.pageSize);
  return { data: data.map(item => ({ ...item, hasChildren: siblings(item.id).length > 0 })), page,
    totalRecords: scope.length, totalRecordsNotFiltered: records.filter(item => item.parentId === parent).length,
    ancestorKeys: [...ancestors] };
}

let browser;
try {
  browser = await chromium.launch({ headless: true,
    ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const errors = []; const requests = []; const flatRequests = []; let databaseViews = []; const savedRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/TreeDemo/**', async route => {
    const url = route.request().url(); const request = route.request().postDataJSON();
    let data = [];
    if (url.includes('GetTableConfiguration')) data = { columnsInfo, allowedItemsPerPage: [10, 25, 50], maxViews: 10,
      dateFormat: 'yyyy-MM-dd', dateTimezone: '+00:00', dateCulture: 'en-US', exportDateFormat: 'yyyy-MM-dd' };
    if (url.includes('GetTableData')) { requests.push(request); data = queryTree(request); }
    if (url.includes('GetSelectionKeys')) data = queryTree({ ...request, loadMode: 'all', roots: true }).data.map(row => row.rowID);
    if (url.includes('GetViews')) { assert.equal(request.tableViewSaveKey, 'TreeDemo'); data = databaseViews; }
    if (url.includes('SaveViews')) { savedRequests.push(request); databaseViews = structuredClone(request.views); data = {}; }
    await route.fulfill({ json: data });
  });
  await page.route('**/Test/**', async route => {
    const fixture = fullDemoFixture(DataType); const url = route.request().url(); let data = [];
    if (url.includes('GetEmploymentStatus')) data = fixture.statuses;
    if (url.includes('GetTableConfiguration')) data = { columnsInfo: fixture.columnsInfo,
      allowedItemsPerPage: [10, 25, 50], maxViews: 5, dateFormat: 'yyyy-MM-dd', dateTimezone: '+00:00', dateCulture: 'en-US', exportDateFormat: 'yyyy-MM-dd' };
    if (url.includes('GetTableData')) {
      const request = route.request().postDataJSON(); flatRequests.push(request);
      data = queryFixture(fixture.data, request,
        fixture.columnsInfo.filter(column => column.dataType === DataType.List).map(column => column.field));
    }
    await route.fulfill({ json: data });
  });
  const base = 'http://localhost:' + server.address().port;
  await page.goto(base + '/tree');
  await page.locator('ecs-tree-demo ecs-table-cell').first().waitFor();
  await page.locator('nav select').selectOption('en');
  await page.getByRole('heading', { name: 'Tree grid', exact: true }).waitFor();
  assert.match(await page.getByTestId('row-retrieval-time').innerText(), /Last row retrieval: [\d,.]+ ms/);
  const rows = page.locator('ecs-tree-demo tbody tr[aria-level]');
  const node = text => rows.filter({ has: page.getByText(text, { exact: true }) });
  assert.equal(requests.filter(request => request.roots).length, 1, 'Initial route must load roots once');
  const selectAll = page.getByRole('checkbox', { name: 'Select all filtered rows', exact: true });
  await selectAll.check();
  await page.waitForFunction(() => [...document.querySelectorAll('ecs-tree-demo tbody tr[aria-level] input[type=checkbox]')].every(input => input.checked));
  assert.equal(await selectAll.isChecked(), true);
  const nextPage = page.locator('ecs-tree-demo .p-paginator-next');
  await nextPage.click();
  await node('Root 11').waitFor();
  assert.equal(await node('Root 11').getByRole('checkbox').isChecked(), true, 'Unloaded pages must be selected');
  await selectAll.uncheck();
  await page.waitForFunction(() => [...document.querySelectorAll('ecs-tree-demo tbody tr[aria-level] input[type=checkbox]')].every(input => !input.checked));
  await page.locator('ecs-tree-demo .p-paginator-first').click();
  await node('Root 01').waitFor();
  assert.equal(await node('Root 01').getByRole('checkbox').isChecked(), false);
  const viewsDialog = page.getByRole('dialog').filter({ has: page.getByText('Table views', { exact: true }) });
  async function count(expected) { await page.waitForFunction(expected =>
    document.querySelectorAll('ecs-tree-demo tbody tr[aria-level]').length === expected, expected); }
  async function choose(id, label) {
    const previousTable = await page.locator('ecs-tree-demo ecs-primeng-table').elementHandle();
    const rootResponse = page.waitForResponse(response => response.url().includes('/TreeDemo/GetTableData') &&
      response.request().postDataJSON()?.roots === true);
    await page.locator('#' + id).click(); await page.getByRole('option').filter({ hasText: label }).click();
    await page.waitForFunction(element => !element.isConnected, previousTable);
    await (await rootResponse).finished();
    await page.locator('ecs-tree-demo ecs-table-cell').first().waitFor();
  }
  async function expand(text) { await node(text).getByRole('button', { name: 'Expand node', exact: true }).click(); }
  async function collapse(text) { await node(text).getByRole('button', { name: 'Collapse node', exact: true }).click(); }
  async function openViews() {
    const actions = page.getByRole('button', { name: 'Table actions', exact: true });
    if (await actions.count()) {
      await actions.click();
      await page.getByRole('menuitem').filter({ has: page.locator('.pi-bookmark') }).click();
    } else await page.locator('ecs-tree-demo .viewButton').click();
  }
  async function saveView(alias) {
    await openViews();
    await page.getByRole('button').filter({ hasText: 'New view' }).click();
    await page.getByRole('textbox', { name: 'View alias' }).fill(alias);
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await page.getByRole('dialog').filter({ has: page.getByText('CREATE NEW VIEW', { exact: true }) }).waitFor({ state: 'hidden' });
    await viewsDialog.waitFor({ state: 'hidden' });
  }
  async function restoreView(alias) {
    await openViews();
    const view = viewsDialog.locator('tbody tr').filter({ hasText: alias });
    await view.waitFor();
    await view.locator('button:has(.pi-upload)').click();
    await viewsDialog.waitFor({ state: 'hidden' });
  }

  for (const [mode, label] of [['onDemand', 'On demand'], ['all', 'All nodes'], ['pagedChildren', 'Paged children']]) {
    if (mode !== 'onDemand') await choose('tree-mode', label);
    await count(10);
    const before = requests.length;
    await expand('Root 01'); await count(mode === 'pagedChildren' ? 20 : 42);
    assert.equal(requests.length - before, mode === 'all' ? 0 : 1,
      `Unexpected expansion requests for ${mode}: ${JSON.stringify(requests.slice(before))}`);
    if (mode === 'pagedChildren') {
      for (const expected of [30, 40, 42]) { await page.getByRole('button').filter({ hasText: 'Load more children' }).click(); await count(expected); }
      assert.equal(await page.getByRole('button').filter({ hasText: 'Load more children' }).count(), 0);
    }
    await expand('Child 1-0'); await count(43);
    await expand('Deep branch 0'); await count(44);
    await collapse('Root 01'); await count(10);
    await expand('Root 01'); await count(44);
    const lastChild = node('Wide child 24'); await lastChild.scrollIntoViewIfNeeded();
    const bounds = await lastChild.boundingBox(); assert.ok(bounds.width > 100 && bounds.height > 10, 'Child beyond ten must have a visible row');
    await node('Root 01').locator('input[type=checkbox]').check();
    assert.equal(await rows.locator('input[type=checkbox]:checked').count(), 1, 'Parent checkbox must not select descendants');
    await node('Root 01').locator('input[type=checkbox]').uncheck();
    await node('Root 01').getByRole('button', { name: 'Edit record', exact: true }).click();
    await page.waitForURL('**/tree/1/edit');
    await page.getByRole('link', { name: 'Back to tree', exact: true }).click(); await count(44);
    assert.equal(await page.locator('#tree-mode').innerText(), label, 'Mode must survive detail navigation');
    await collapse('Root 01'); await count(10);
    const search = page.getByPlaceholder('Search keyword', { exact: true });
    const beforeSearch = requests.length;
    await search.fill('N'); await page.waitForTimeout(450);
    await search.fill('Ne'); await page.waitForTimeout(450);
    assert.equal(requests.length, beforeSearch, 'Short input must not query in any tree mode');
    await search.fill('Nee'); await page.waitForTimeout(200);
    await search.fill('Needle'); await page.waitForTimeout(250);
    assert.equal(requests.length, beforeSearch, 'Each keystroke must restart the configured delay');
    await search.fill('Needle deep leaf'); await node('Needle deep leaf').waitFor(); await count(6);
    assert.equal(await node('Needle deep leaf').getAttribute('aria-level'), '6');
    assert.equal(await rows.locator('button[aria-expanded=true]').count(), 5);
    await search.fill(''); await node('Root 02').waitFor();
    await collapse('Root 01'); await count(10);
    console.log(`Tree browser mode ${mode}: roots, wide/deep expansion, collapse, filter ancestors, independent checkbox and detail restore passed.`);
  }

  await choose('tree-mode', 'On demand');
  if (await node('Root 01').getByRole('button', { name: 'Collapse node', exact: true }).count()) await collapse('Root 01');
  await count(10);
  await expand('Root 01');
  await node('Wide child 24').waitFor();
  if (await node('Child 1-0').getByRole('button', { name: 'Collapse node', exact: true }).count()) await collapse('Child 1-0');
  await count(42);
  await saveView('Database tree');
  assert.equal(savedRequests.at(-1).tableViewSaveKey, 'TreeDemo');
  assert.ok(JSON.parse(databaseViews[0].viewData).treeExpandedKeys.includes(1));
  await collapse('Root 01'); await count(10); await restoreView('Database tree'); await count(42);
  await choose('tree-storage', 'This browser'); await count(10);
  await expand('Root 01'); await count(42); await saveView('Local tree');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('TreeDemo-onDemand')));
  assert.ok(stored[0].viewData.treeExpandedKeys.includes(1));
  await collapse('Root 01'); await count(10); await restoreView('Local tree'); await count(42);
  await page.locator('.p-dialog-mask').waitFor({ state: 'hidden' });
  await page.waitForFunction(() => !document.querySelector('.p-toast-message'));
  await page.screenshot({ path: join(screenshots, 'tree-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Table actions', exact: true }).waitFor();
  assert.ok(await page.getByRole('button', { name: 'Row actions', exact: true }).count() > 0);
  const controls = await page.locator('ecs-tree-demo > section > div p-select').evaluateAll(elements => elements.map(element => {
    const bounds = element.getBoundingClientRect(); return { left: bounds.left, right: bounds.right, width: bounds.width }; }));
  assert.ok(controls.every(bounds => bounds.left >= 0 && bounds.right <= 391 && bounds.width > 0), 'Mode/storage controls must fit mobile');
  await page.screenshot({ path: join(screenshots, 'tree-mobile.png'), fullPage: true });
  const mobileSearch = page.getByPlaceholder('Search keyword', { exact: true });
  const mobileBefore = requests.length;
  await mobileSearch.fill('Ne'); await page.waitForTimeout(450);
  assert.equal(requests.length, mobileBefore, 'Mobile must enforce the same minimum');
  await mobileSearch.fill('Needle deep leaf'); await node('Needle deep leaf').waitFor();
  assert.equal(requests.at(-1).globalFilter, 'Needle deep leaf');
  await mobileSearch.fill('N'); await node('Root 02').waitFor();
  assert.equal(requests.at(-1).globalFilter, null, 'Below minimum must remove the applied query');
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.getByRole('link', { name: 'Full example', exact: true }).click();
  await page.locator('ecs-home ecs-table-cell').first().waitFor();
  assert.ok(await page.locator('ecs-home ecs-table-predefined-filters').count() > 0, 'Flat demo retains predefined filters');
  assert.equal(await page.locator('ecs-home .ecs-tree-toggle').count(), 0, 'Flat grid must remain opt-out');
  const flatSearch = page.getByPlaceholder('Search keyword', { exact: true });
  const flatBefore = flatRequests.length;
  await flatSearch.fill('Da'); await page.waitForTimeout(450);
  assert.equal(flatRequests.length, flatBefore, 'Flat grid must enforce the minimum');
  const flatResponse = page.waitForResponse(response => response.url().includes('/Test/GetTableData') && response.request().postDataJSON()?.globalFilter === 'Daniel');
  await flatSearch.fill('Daniel'); await flatResponse;
  assert.equal(flatRequests.length, flatBefore + 1, 'Flat search must send only the final query');
  assert.deepEqual(errors, []);
  console.log('Tree browser passed: three modes, local/mocked database views, navigation, desktop/mobile controls and preserved flat demo.');
  console.log('Screenshots: ' + screenshots);
} finally {
  await browser?.close(); await new Promise(done => server.close(done));
}
