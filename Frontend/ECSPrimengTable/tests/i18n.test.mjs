import '@angular/compiler';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createEnvironmentInjector } from '@angular/core';
import { TranslateService, TranslateDefaultParser } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { Subject } from 'rxjs';
import { ECSPrimengTableI18nService } from '../dist/ecs-primeng-table/fesm2022/eternalcodestudio-primeng-table.mjs';

test('missing providers retain English and interpolate counter defaults', () => {
 const injector = createEnvironmentInjector([ECSPrimengTableI18nService]);
 const ui = injector.get(ECSPrimengTableI18nService);
 assert.equal(ui.text('Showing {{count}} records', {count: 7}), 'Showing 7 records');
 assert.equal(ui.text('Unknown key'), 'Unknown key');
 assert.equal(ui.text(null), '');
 injector.destroy();
});

test('PrimeNG locale updates preserve unspecified configuration and clean up subscriptions', () => {
 const changes = new Subject();
 let dictionary = {};
 const translate = {onLangChange: changes, onTranslationChange: new Subject(), onFallbackLangChange: new Subject(),
 instant: (key, params) => typeof dictionary[key] === 'string' ? new TranslateDefaultParser().interpolate(dictionary[key], params) : dictionary[key] ?? key};
 const prime = {translation: {accept:'Accept', dateFormat:'yy-mm-dd', aria:{close:'Close', next:'Next'}},
 setTranslation(value) {this.translation = value;}};
 const injector = createEnvironmentInjector([ECSPrimengTableI18nService, {provide:TranslateService,useValue:translate}, {provide:PrimeNG,useValue:prime}]);
 const ui = injector.get(ECSPrimengTableI18nService);
 ui.connectPrimeNG(); ui.connectPrimeNG();
 dictionary = {primeng:{accept:'Aceptar', aria:{close:'Cerrar'}}, 'View {{name}}':'Vista {{name}}'};
 changes.next({});
 assert.equal(prime.translation.accept, 'Aceptar');
 assert.equal(prime.translation.dateFormat, 'yy-mm-dd');
 assert.deepEqual(prime.translation.aria, {close:'Cerrar',next:'Next'});
 assert.equal(ui.text('View {{name}}', {name:'{{count}}'}), 'Vista {{count}}');
 dictionary = {}; changes.next({});
 assert.equal(prime.translation.accept, 'Accept');
 injector.destroy();
 assert.equal(changes.observers.length, 0);
});

test('four dictionaries preserve interpolation placeholders and PrimeNG calendar array lengths', () => {
 const dictionaries = ['en','es','fr','it'].map(lang => JSON.parse(readFileSync(new URL('../src/assets/i18n/' + lang + '.json', import.meta.url), 'utf8')));
 const keys = Object.keys(dictionaries[0]).sort();
 for (const dictionary of dictionaries) {
  assert.deepEqual(Object.keys(dictionary).sort(), keys);
  for (const key of keys) {
   if (typeof dictionary[key] !== 'string') continue;
   assert.deepEqual((dictionary[key].match(/{{[^}]+}}/g) || []).sort(), (key.match(/{{[^}]+}}/g) || []).sort(), key);
  }
  assert.equal(dictionary.primeng.dayNames.length, 7);
  assert.equal(dictionary.primeng.monthNames.length, 12);
 }
});
