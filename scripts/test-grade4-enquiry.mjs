import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile('src/lib/kindergartenLead.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const { buildKindergartenLead,validateKindergartenLead,emptyKindergartenLead }=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const values={...emptyKindergartenLead,name:' Тест ',phone:'89990000000',institution:' Школа 129 ',consent:true,albumId:'ten-pages'};
const context={page:'https://example.test/school/4?utm_source=qr&yclid=456',referrer:'https://example.test/',now:2000,startedAt:0,consentVersion:'test',privacyPolicyVersion:'test',albumTitle:'Школьные годы — 10 страниц'};
test('grade4 uses existing school CRM routing with album and attribution',()=>{
 const lead=buildKindergartenLead(values,{...context,audience:'school',schoolLevel:'grade4'});
 assert.equal(lead.audience,'school');assert.equal(lead.schoolLevel,'grade4');assert.equal(lead.institution,'Школа 129');
 assert.equal(lead.tracking.utmSource,'qr');assert.equal(lead.tracking.yclid,'456');assert.match(lead.comment,/Школьные годы/);assert.equal(lead.consent.given,true);
});
test('default kindergarten payload and validation remain unchanged',()=>{
 const lead=buildKindergartenLead(values,context);assert.equal(lead.audience,'kindergarten');assert.equal(lead.schoolLevel,'');
 assert.match(validateKindergartenLead(emptyKindergartenLead).institution,/детского сада/);
 assert.match(validateKindergartenLead(emptyKindergartenLead,'школы').institution,/школы/);
 assert.deepEqual(Object.keys(validateKindergartenLead(emptyKindergartenLead,'школы')),['name','phone','institution','consent']);
});
