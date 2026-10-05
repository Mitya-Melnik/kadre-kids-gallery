import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
async function load(path) {
 const source=await readFile(path,'utf8');
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
}
const {albumOrderRules,schoolMinimumAnswer}=await load('src/config/albumOrderRules.ts');
const {buildKindergartenLead,emptyKindergartenLead}=await load('src/lib/kindergartenLead.ts');
test('school minimum is ten TOTAL, and 6/10 page formats mix in any ratio',()=>{
 assert.equal(albumOrderRules.minimum,10);
 assert.match(schoolMinimumAnswer,/10 альбомов/);
 assert.match(schoolMinimumAnswer,/в любом соотношении/);
 assert.match(schoolMinimumAnswer,/суммарно на класс/);
 assert.match(schoolMinimumAnswer,/не отдельно по каждому формату/);
 assert.match(albumOrderRules.otherFormats,/согласовываем отдельно/);
});
test('all school order surfaces use the shared rule, not the old 15-album exception',async()=>{
 for (const file of ['AlbumCatalog.tsx','KindergartenCatalog.tsx','KindergartenFAQ.tsx']) {
  const text=await readFile(`src/components/kindergarten/${file}`,'utf8');
  assert.match(text,/albumOrderRules|schoolMinimumAnswer/);
  assert.doesNotMatch(text,/15 альбомов одного выбранного формата|isSchool \? (15|"15")/);
 }
});
test('senior enquiry preserves the existing school CRM route and attribution',()=>{
 const values={...emptyKindergartenLead,name:'Тест',phone:'89990000000',institution:'Школа 129',consent:true,albumId:'ten-pages'};
 const payload=buildKindergartenLead(values,{page:'https://example.test/school/9-11?utm_source=qr&yclid=456',referrer:'https://example.test/',startedAt:0,now:2000,consentVersion:'test',privacyPolicyVersion:'test',albumTitle:'Школьные годы — 10 страниц',audience:'school',schoolLevel:'grade9_11'});
 assert.equal(payload.audience,'school');assert.equal(payload.schoolLevel,'grade9_11');
 assert.equal(payload.tracking.utmSource,'qr');assert.equal(payload.tracking.yclid,'456');
 assert.match(payload.comment,/Школьные годы/);assert.equal(payload.consent.given,true);
});
