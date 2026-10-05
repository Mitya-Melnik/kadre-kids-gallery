import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import ts from 'typescript';
const source=await readFile('src/config/kindergartenLayoutPages.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {kindergartenLayoutPages}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
test('all twelve designs reuse original names and all existing numbered examples',async()=>{
 const old=await readFile('src/components/kindergarten/KindergartenLayouts.tsx','utf8');
 const slugs=[...old.matchAll(/slug: "([^"]+)"/g)].map(x=>x[1]);
 assert.equal(slugs.length,12);assert.deepEqual(Object.keys(kindergartenLayoutPages),slugs);
 for(const slug of slugs){
  const entries=await readdir(`public/layouts/${slug}`);
  const numbers=entries.filter(x=>/^\d+\.webp$/.test(x)).map(x=>Number(x.split('.')[0])).sort((a,b)=>a-b);
  assert.deepEqual(kindergartenLayoutPages[slug],numbers,slug);
  await access(`public/layouts/${slug}/cover.webp`);await access(`public/layouts/${slug}/cover-mobile.webp`);
 }
});
test('mobile order omits only the case; desktop still renders the case and original layouts',async()=>{
 const text=await readFile('src/pages/Kindergarten.tsx','utf8');
 const orders=[...text.matchAll(/\["hero",[^\]]+\]/g)].map(m=>JSON.parse(m[0]));
 assert.equal(orders.length,2);assert(!orders[0].includes('story'));assert(orders[1].includes('story'));
 assert.match(text,/layouts: mobile \? <KindergartenLayoutsMobile \/> : <KindergartenLayouts \/>/);
 assert.match(text,/<Footer kindergartenPage hideKindergartenCase=\{mobile\}/);
});
test('school hero icons are decorative and mapped to the four unchanged benefits',async()=>{
 const text=await readFile('src/components/school/SchoolMobilePage.tsx','utf8');
 assert.match(text,/\["🖼️", "📷", "🎁", "📄"\]/);
 assert.match(text,/className="g4-benefit-icon" aria-hidden="true"/);
 assert(!text.includes('<Check'));
});
