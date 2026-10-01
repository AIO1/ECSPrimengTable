// Run after building the library and the demo in development mode.
// Requires Playwright (or PLAYWRIGHT_MODULE pointing to its installed module).
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = resolve('dist/ECSPrimengTable/browser');
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const path = resolve(root, '.' + pathname);
  if (!path.startsWith(root)) { res.writeHead(403).end(); return; }
  const mime = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.html': 'text/html', '.woff2': 'font/woff2' };
  try { const data = await readFile(path); res.setHeader('Content-Type', mime[extname(path)] || 'application/octet-stream'); res.end(data); }
  catch { res.setHeader('Content-Type', 'text/html'); res.end(await readFile(resolve(root, 'index.html'))); }
});
await new Promise(resolve => server.listen(0, 'localhost', resolve));
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
try {
 const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
 const errors = []; page.on('pageerror', error => errors.push(error.message));
 const fields = [
   { field: 'username', header: 'Username', canBeHidden: false },
   { field: 'age', header: 'Age', canBeHidden: true, visibleOnlyIn: [1, 2] },
   { field: 'email', header: 'Email', canBeHidden: true, visibleOnlyIn: [2] }
 ];
 const columnsInfo = fields.map(c => ({ dataType: 0, dataAlignHorizontal: 0, dataAlignVertical: 1,
   frozenColumnAlign: 0, cellOverflowBehaviour: 0, initialWidth: 120, canBeSorted: true,
   canBeFiltered: true, canBeGlobalFiltered: true, canBeResized: true, canBeReordered: true, ...c }));
 await page.route('**/Test/**', async route => {
   const url = route.request().url();
   let data = [];
   if (url.includes('GetTableConfiguration')) data = { columnsInfo, allowedItemsPerPage: [10, 25], maxViews: 5, dateFormat: 'yyyy-MM-dd', dateTimezone: '+00:00', dateCulture: 'en-US', exportDateFormat: 'yyyy-MM-dd' };
   if (url.includes('GetTableData')) data = { page: 0, totalRecords: 2, totalRecordsNotFiltered: 2, data: [
     { rowID: '1', username: 'Ana', age: 32, email: 'ana@example.test', canBeDeleted: false },
     { rowID: '2', username: 'Luis', age: 41, email: 'luis@example.test', canBeDeleted: true }
   ] };
   await route.fulfill({ json: data });
 });
 await page.goto('http://localhost:' + server.address().port + '/home');
 const hamburger = page.getByRole('button', { name: 'Table actions', exact: true });
 await hamburger.waitFor();
 await page.getByRole('button', { name: 'Row actions', exact: true }).first().waitFor();
 assert.equal(await page.locator('th#age-header').count(), 0);
 assert.equal(await page.locator('th#email-header').count(), 0);
 assert.equal(await page.locator('ecs-table-button button').filter({ hasText: 'CREATE' }).count(), 0);
 await hamburger.click();
 await page.getByRole('menuitem', { name: 'Modify columns', exact: true }).waitFor();
 await page.screenshot({ path: resolve(process.env.TEMP || '.', 'ecs-responsive-mobile.png'), fullPage: true, animations: 'disabled' });
 const bounds = await page.locator('.ecs-responsive-menu:visible').boundingBox();
 assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 391, 'Header menu clips viewport');
 await page.keyboard.press('Escape');
 await page.getByRole('button', { name: 'Row actions', exact: true }).first().click();
 const disabledDelete = page.getByRole('menuitem', { name: 'Delete record', exact: true });
 assert.equal(await disabledDelete.getAttribute('aria-disabled'), 'true');
 await page.keyboard.press('Escape');
 await page.getByRole('button', { name: 'Row actions', exact: true }).nth(1).click();
 await page.getByRole('menuitem', { name: 'Edit record', exact: true }).click();
 await page.waitForURL('**/home/2/edit');
 await page.getByRole('link', { name: 'Volver al listado de personas' }).click();
 await hamburger.waitFor();
 await page.setViewportSize({ width: 900, height: 1000 });
 await page.locator('th#age-header').waitFor();
 assert.equal(await page.locator('th#email-header').count(), 0);
 await hamburger.waitFor();
 await page.setViewportSize({ width: 1400, height: 1000 });
 await page.locator('ecs-table-button button').filter({ hasText: 'CREATE' }).waitFor();
 await page.locator('th#email-header').waitFor();
 assert.equal(await hamburger.count(), 0);
 assert.equal(await page.getByRole('button', { name: 'Row actions', exact: true }).count(), 0);
 await page.setViewportSize({ width: 390, height: 844 });
 await hamburger.click();
 await page.getByRole('menuitem', { name: 'Modify columns', exact: true }).click();
 await page.getByRole('dialog').waitFor();
 assert.ok(await page.getByRole('dialog').getByText('Email', { exact: true }).count(), 'Hidden column missing from selector');
 assert.deepEqual(errors, []);
 console.log('Browser checks passed: mobile/tablet/desktop, overlays, disabled actions, row navigation, column selector.');
} finally {
 await browser.close();
 await new Promise(resolve => server.close(resolve));
}
