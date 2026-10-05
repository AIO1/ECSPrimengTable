import '@angular/compiler';
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
 const page = await browser.newPage({ viewport: { width: 1600, height: 844 } });
 const errors = []; page.on('pageerror', error => errors.push(error.message));

 const { DataType } = await import('../dist/ecs-primeng-table/fesm2022/eternalcodestudio-primeng-table.mjs');
 const columnsInfo = [
  {field:'tags', filterPredefinedValuesName:'employmentStatusPredefinedFilterList', dataTooltipCustomColumnSource:'tips'},
  {field:'plain', dataTooltipCustomColumnSource:'tips'},
  {field:'legacy', filterPredefinedValuesName:'employmentStatusPredefinedFilterList'},
  {field:'disabled', dataTooltipCustomColumnSource:'tips', dataTooltipShow:false},
  {field:'missing', dataTooltipCustomColumnSource:'absent'}
 ].map(c => ({dataAlignHorizontal:0,dataAlignVertical:1,frozenColumnAlign:0,cellOverflowBehaviour:0,canBeSorted:true,canBeFiltered:true,canBeResized:true,canBeReordered:true,header:c.field, dataType:DataType.List, dataTooltipShow:true, canBeHidden:false, initialWidth:200, ...c}));
 await page.route('**/Test/**', async route => {
  const url = route.request().url(); let data = [];
  if (url.includes('GetEmploymentStatus')) data = ['A','B'].map(statusName => ({statusName,colorR:0,colorG:100,colorB:0}));
  if (url.includes('GetTableConfiguration')) data = {columnsInfo, allowedItemsPerPage:[10], maxViews:5,dateFormat:'yyyy-MM-dd',dateTimezone:'+00:00',dateCulture:'en-US',exportDateFormat:'yyyy-MM-dd'};
  if (url.includes('GetTableData')) data = {page:0,totalRecords:1,totalRecordsNotFiltered:1,data:[{
   rowID:'1',tags:'A;unknown;A;B;A;A',plain:'A;unknown;A;B;A',legacy:'A;B',disabled:'A',missing:'A',tips:' first ;skipped; third ;;'
  }]};
  await route.fulfill({json:data});
 });
 await page.goto('http://localhost:' + server.address().port + '/home');
 await page.locator('ecs-table-cell').first().waitFor({state:'attached'}).catch(async e => {console.log(errors, await page.locator('body').innerText());throw e;});
 const cells = page.locator('ecs-table-cell');
 async function tooltip(target, expected) {
  await page.mouse.move(0,0);
  await page.getByRole('tooltip').waitFor({state:'hidden'});
  await target.hover();
  await page.getByRole('tooltip').waitFor();
  assert.equal(await page.getByRole('tooltip').innerText(),expected);
 }
 const tags = cells.nth(0).locator('ecs-table-predefined-filters');
 assert.equal(await tags.count(),5);
 await tooltip(tags.nth(0),'first');
 await tooltip(tags.nth(1),'third'); // Hidden unmatched option must not shift indices; duplicate values have distinct tips.
 await page.mouse.move(0,0); await page.getByRole('tooltip').waitFor({state:'hidden'});
 await tags.nth(2).hover(); await page.waitForTimeout(850);
 assert.equal(await page.getByRole('tooltip').count(),0); // Explicit empty tooltip.
 await tooltip(tags.nth(4),'A'); // Short tooltip list falls back per item.
 const plain = cells.nth(1).locator(':scope > span').filter({hasText: /^A$/});
 await tooltip(plain.nth(1),'third');
 await tooltip(cells.nth(2).locator('ecs-table-predefined-filters').nth(1),'B');
 await tooltip(cells.nth(4).locator('span').first(),'A'); // Missing source keeps original tooltip.
 await page.mouse.move(0,0); await page.getByRole('tooltip').waitFor({state:'hidden'});
 await cells.nth(3).hover(); await page.waitForTimeout(850);
 assert.equal(await page.getByRole('tooltip').count(),0);
 assert.deepEqual(errors,[]);
 console.log('List tooltip checks passed: tags, plain lists, duplicate/unmatched values, blank/missing tooltips, disabled and legacy behavior.');
} finally {
 await browser.close();
 await new Promise(resolve => server.close(resolve));
}

