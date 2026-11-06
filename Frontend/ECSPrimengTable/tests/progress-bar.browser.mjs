// Build the library and demo first. PLAYWRIGHT_MODULE/BROWSER_EXECUTABLE may point to installed tools.
import '@angular/compiler';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import assert from 'node:assert/strict';
import { fullDemoFixture, queryFixture } from './full-demo.fixture.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { CellDisplay, DataType } = await import('../dist/ecs-primeng-table/fesm2022/eternalcodestudio-primeng-table.mjs');
const root = resolve('dist/ECSPrimengTable/browser');
const server = createServer(async (req, res) => {
  const path = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!path.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json' };
  try { const data = await readFile(path); res.setHeader('Content-Type', mime[extname(path)] || 'application/octet-stream'); res.end(data); }
  catch { res.setHeader('Content-Type', 'text/html'); res.end(await readFile(resolve(root, 'index.html'))); }
});
await new Promise(resolve => server.listen(0, 'localhost', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: !process.env.PROGRESS_PREVIEW, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const columnsInfo = [
    { field: 'progress', header: 'Progreso (%)', cellDisplay: CellDisplay.ProgressBar },
    { field: 'custom', header: 'Tooltip personalizado', cellDisplay: CellDisplay.ProgressBar, dataTooltipCustomColumnSource: 'tip' },
    { field: 'disabled', header: 'Sin tooltip (desactivado)', cellDisplay: CellDisplay.ProgressBar, dataTooltipShow: false },
    { field: 'plain' }, // Legacy metadata has no cellDisplay.
    { field: 'text', cellDisplay: CellDisplay.ProgressBar, dataType: DataType.Text }
  ].map(c => ({ dataType: DataType.Numeric, header: c.field, dataAlignHorizontal: 0, dataAlignVertical: 1,
    frozenColumnAlign: 0, cellOverflowBehaviour: 0, canBeSorted: true, canBeFiltered: true,
    canBeResized: true, canBeReordered: true, canBeHidden: false, initialWidth: 170, dataTooltipShow: true, ...c }));
  const values = [-10, 0, 15.5, 100, 125, null, '', true, '15'];
  await page.route('**/Test/**', async route => {
    const url = route.request().url(); let data = [];
    const original = fullDemoFixture(DataType);
    if (url.includes('GetEmploymentStatus')) data = original.statuses;
    if (url.includes('GetTableConfiguration')) data = { columnsInfo: original.columnsInfo, allowedItemsPerPage: [10, 25, 50], maxViews: 5,
      dateFormat: 'yyyy-MM-dd', dateTimezone: '+00:00', dateCulture: 'en-US', exportDateFormat: 'yyyy-MM-dd' };
    if (url.includes('GetTableData')) data = queryFixture(original.data, route.request().postDataJSON(),
      original.columnsInfo.filter(col => col.dataType === DataType.List).map(col => col.field));
    await route.fulfill({ json: data });
  });
  await page.route('**/ProgressDemo/**', async route => {
    const url = route.request().url();
    const data = url.includes('GetTableConfiguration') ? { columnsInfo, allowedItemsPerPage: [10], maxViews: 5,
      dateFormat: 'yyyy-MM-dd', dateTimezone: '+00:00', dateCulture: 'en-US', exportDateFormat: 'yyyy-MM-dd' }
      : queryFixture(values.map((v, i) => ({ rowID: String(i), progress: v, custom: v, disabled: v, plain: v, text: 'Text', tip: `Custom ${i}` })), route.request().postDataJSON());
    await route.fulfill({ json: data });
  });
  await page.goto('http://localhost:' + server.address().port + (process.env.PROGRESS_PREVIEW ? '/home' : '/progress'));
  await page.locator('ecs-table-cell').first().waitFor({ state: 'attached' });
  const rows = page.locator('tbody tr').filter({ has: page.locator('ecs-table-cell') });
  // Preview mode leaves the user's mouse alone; run automated hover checks headlessly.
  if (!process.env.PROGRESS_PREVIEW) {
  assert.equal(await rows.count(), values.length);
  for (let i = 0; i < values.length; i++) {
    const cells = rows.nth(i).locator('ecs-table-cell');
    const bar = cells.nth(0).getByRole('progressbar');
    if (typeof values[i] === 'number') {
      const clamped = Math.min(100, Math.max(0, values[i]));
      assert.equal(await bar.getAttribute('aria-valuenow'), String(clamped));
      assert.equal(await bar.getAttribute('aria-valuetext'), `${values[i]} %`);
      assert.equal(await bar.locator('.ecs-progress-bar-fill').evaluate(el => el.style.width), `${clamped}%`);
      const bounds = await bar.boundingBox();
      assert.ok(bounds.width > 50 && bounds.height > 0, 'Bar must be visible at the column width');
    } else {
      assert.equal(await bar.count(), 0, 'Null and nonnumeric values must leave an empty progress cell');
    }
    assert.equal(await cells.nth(3).getByRole('progressbar').count(), 0);
    assert.equal(await cells.nth(4).innerText(), 'Text', 'Presentation must not override nonnumeric types');
  }
  async function tooltip(target, expected) {
    await page.mouse.move(0, 0);
    await page.getByRole('tooltip').waitFor({ state: 'hidden' });
    await target.hover();
    await page.getByRole('tooltip').waitFor();
    assert.equal(await page.getByRole('tooltip').innerText(), expected);
  }
  const cells = rows.nth(2).locator('ecs-table-cell');
  await tooltip(cells.nth(0).getByRole('progressbar'), '15.5 %');
  await tooltip(cells.nth(0).locator('.ecs-progress-bar-fill'), '15.5 %');
  await tooltip(rows.nth(3).locator('ecs-table-cell').nth(0).locator('.ecs-progress-bar-fill'), '100 %');
  await tooltip(cells.nth(1).getByRole('progressbar'), 'Custom 2');
  await tooltip(cells.nth(1).locator('.ecs-progress-bar-fill'), 'Custom 2');
  // Hover the space above the thin bar, as a user approaching the cell would do.
  await page.mouse.move(0, 0);
  await page.getByRole('tooltip').waitFor({ state: 'hidden' });
  await cells.nth(1).locator('.ecs-progress-cell').hover({ position: { x: 20, y: 2 } });
  await page.getByRole('tooltip').waitFor();
  assert.equal(await page.getByRole('tooltip').innerText(), 'Custom 2');
  await tooltip(rows.nth(1).locator('ecs-table-cell').nth(0).getByRole('progressbar'), '0 %');
  await page.mouse.move(0, 0);
  await page.getByRole('tooltip').waitFor({ state: 'hidden' });
  await cells.nth(2).getByRole('progressbar').hover();
  await page.waitForTimeout(850);
  assert.equal(await page.getByRole('tooltip').count(), 0);
  if (process.env.PROGRESS_SCREENSHOT) await page.screenshot({ path: process.env.PROGRESS_SCREENSHOT });
  assert.deepEqual(errors, []);
  await page.getByRole('link', { name: 'Ejemplo completo', exact: true }).click();
  await page.locator('ecs-home ecs-table-cell').first().waitFor();
  assert.ok(await page.locator('ecs-home ecs-table-predefined-filters').count() > 0, 'Full demo must keep its predefined tags');
  assert.equal(await page.locator('ecs-home [role="progressbar"]').count(), 0, 'Full demo must not be replaced by progress fixtures');
  const listHeader = page.locator('th').filter({ hasText: 'Lista de situaciones laborales' });
  await listHeader.locator('p-columnfilter button').click();
  await page.locator('p-multiselect .p-multiselect-dropdown').click();
  const firstFilter = page.waitForResponse(response => response.url().includes('/Test/GetTableData'));
  await page.getByRole('option', { name: 'Full-time', exact: true }).click();
  await firstFilter;
  await page.locator('.p-dialog-mask').waitFor({ state: 'hidden' });
  // Loading the filtered data may close the overlays; reopen them before selecting the next value.
  if (!await page.getByRole('option', { name: 'Student', exact: true }).isVisible()) {
    if (!await page.locator('p-multiselect').isVisible()) await listHeader.locator('p-columnfilter button').click();
    await page.locator('p-multiselect .p-multiselect-dropdown').click();
  }
  const filteredRequest = page.waitForResponse(response => response.url().includes('/Test/GetTableData'));
  await page.getByRole('option', { name: 'Student', exact: true }).click();
  const filtered = await (await filteredRequest).json();
  assert.equal(filtered.totalRecords, 9, 'List selection must keep all rows containing either selected item');
  assert.ok(filtered.data.some(row => row.employmentStatusNameList === 'Full-time;Student'), 'Multi-item rows must remain visible');
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.getByRole('link', { name: 'Barras de progreso', exact: true }).click();
  await page.locator('ecs-progress-demo [role="progressbar"]').first().waitFor();
  console.log('Progress bars passed: numeric/legacy cells, zero, decimals, bounds, invalid values, accessibility and tooltips.');
  }
  if (process.env.PROGRESS_PREVIEW) {
    console.log('Preview open. Close the browser window to stop the local test server.');
    await new Promise(resolve => browser.on('disconnected', resolve));
  }
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
