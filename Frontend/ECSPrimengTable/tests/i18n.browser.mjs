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
 await page.route('**/assets/i18n/*.json', async route => {
   const lang = new URL(route.request().url()).pathname.split('/').pop();
   const dictionary = JSON.parse(await readFile(resolve('src/assets/i18n', lang), 'utf8'));
   await route.fulfill({ json: {...dictionary, Ana: 'DO NOT TRANSLATE ANA', Luis: 'DO NOT TRANSLATE LUIS'} });
 });
 await page.goto('http://localhost:' + server.address().port + '/home');
 await page.locator('select').selectOption('en');

 const dictionaries = {};
 for (const lang of ['es', 'en', 'fr', 'it']) dictionaries[lang] = JSON.parse(await readFile(resolve('src/assets/i18n', lang + '.json'), 'utf8'));
 const language = page.locator('select');
 for (const lang of ['es', 'fr', 'it', 'en']) {
   await language.selectOption(lang);
   const d = dictionaries[lang];
   await page.getByRole('button', { name: d['Table actions'], exact: true }).waitFor();
   assert.equal(await page.locator('th#username-header').innerText(), d.Username);
   assert.equal(await page.getByText('Ana', { exact: true }).count(), 1);
   assert.equal(await page.getByText('Luis', { exact: true }).count(), 1);
   await page.getByRole('button', { name: d['Table actions'], exact: true }).click();
   await page.getByRole('menuitem', { name: d['Modify columns'], exact: true }).waitFor();
   await page.keyboard.press('Escape');
 }
 // Open menu updates without reopening it.
 await page.getByRole('button', { name: 'Table actions', exact: true }).click();
 await language.selectOption('fr');
 await page.getByRole('menuitem', { name: dictionaries.fr['Modify columns'], exact: true }).click();
 const dialog = page.getByRole('dialog');
 await dialog.getByText(dictionaries.fr['MODIFY COLUMNS'], { exact: true }).waitFor();
 // Programmatic language change simulates application settings while the modal remains open.
 await language.selectOption('it', { force: true });
 await dialog.getByText(dictionaries.it['MODIFY COLUMNS'], { exact: true }).waitFor();
 await dialog.getByRole('button', { name: dictionaries.it['Cancel changes'], exact: true }).click();
 await page.setViewportSize({ width: 1400, height: 1000 });
 await language.selectOption('es');
 await page.getByPlaceholder(dictionaries.es['Search keyword'], { exact: true }).waitFor();
 await page.getByRole('button', { name: dictionaries.es.CREATE, exact: true }).waitFor();
 assert.equal(await page.getByText('Ana', { exact: true }).count(), 1);
 await page.locator('th#username-header .p-datatable-column-filter-button').click();
 await page.getByRole('button', { name: dictionaries.es.primeng.apply, exact: true }).waitFor();
 await page.keyboard.press('Escape');
 assert.deepEqual(errors, []);
 console.log('UI i18n browser checks passed: four languages, live menu/dialog updates, custom buttons, unchanged row values.');
} finally {
 await browser.close();
 await new Promise(resolve => server.close(resolve));
}
