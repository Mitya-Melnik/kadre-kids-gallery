import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile('src/config/albumCommercial.ts', 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { albumCommercial: offer } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
test('owner removed the separate quantity threshold, not the album/prepayment requirement', () => {
  assert.equal(Object.hasOwn(offer, 'historyMinimum'), false);
  assert.doesNotMatch(offer.historyEligibility + offer.historySummary, /15/);
  assert.match(offer.historyEligibility, /История детства/);
  assert.match(offer.historyEligibility, /предоплаты/);
  assert.match(offer.historyScope, /Отдельного порога количества альбомов для этой скидки нет/);
  assert.match(offer.historyScope, /общий минимальный заказ альбомов сохраняется/);
});
test('approved prices, gifts and exclusions remain unchanged', () => {
  assert.match(offer.historyPhoto, /8 000 ₽ вместо 10 000 ₽/);
  assert.match(offer.historyVideo, /12 000 ₽ вместо 15 000 ₽/);
  assert.match(offer.historyPackage, /20 000 ₽ вместо 25 000 ₽/);
  assert.match(offer.bigVideo, /15 000 ₽/);
  assert.match(offer.gifts, /грамота 21×30 см включена/);
  assert.match(offer.historyScope, /Reels не входит/);
});
async function files(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const name = `${dir}/${entry.name}`;
    if (entry.isDirectory()) result.push(...await files(name));
    else if (/\.(ts|tsx|js|jsx|json)$/.test(name)) result.push(name);
  }
  return result;
}
test('no active source retains the removed History offer threshold', async () => {
  for (const name of await files('src')) {
    const text = await readFile(name, 'utf8');
    assert.doesNotMatch(text, /historyMinimum|(?:от|менее|минимум за)\s+15\s+альбомов\s+[«"']История детства/, name);
  }
  const faq = await readFile('src/components/FAQ.tsx', 'utf8');
  assert.match(faq, /Минимальный общий заказ — 10 альбомов/);
});
