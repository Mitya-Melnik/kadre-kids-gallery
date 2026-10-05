import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
const code = await readFile('src/lib/kindergartenLead.ts', 'utf8');
const js = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { emptyKindergartenLead, normalizeLeadPhone, validateKindergartenLead, buildKindergartenLead } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const value = { ...emptyKindergartenLead, name: ' Тест ', phone: '8 (999) 000-00-00', institution: ' Сад № 108 ', consent: true, albumId: 'ten-pages' };
const context = { page: 'http://127.0.0.1:4173/kindergarten?utm_source=qr&utm_medium=offline&utm_campaign=albums&utm_content=test&utm_term=group&yclid=123', referrer: 'https://example.test/', startedAt: 0, now: 2000, consentVersion: '2026-09-01', privacyPolicyVersion: '2026-09-01', albumTitle: 'История детства — 10 страниц' };
test('three fields and consent required, optional fields stay optional', () => {
  assert.deepEqual(Object.keys(validateKindergartenLead(emptyKindergartenLead)), ['name','phone','institution','consent']);
  assert.deepEqual(validateKindergartenLead(value), {});
  assert.ok(validateKindergartenLead({ ...value, institution: ' ' }).institution);
});
test('phone formats and invalid numbers match current server contract', () => {
  for (const phone of ['8 (999) 000-00-00', '+7 999 0000000', '9990000000']) assert.equal(normalizeLeadPhone(phone), '+79990000000');
  for (const phone of ['123', '+1 999 000 0000', '999000000000']) assert.equal(normalizeLeadPhone(phone), '');
});
test('attribution, consent and album reach existing payload fields', () => {
  const payload = buildKindergartenLead(value, context);
  assert.equal(payload.institution, 'Сад № 108');
  assert.equal(payload.phone, '+79990000000');
  assert.equal(payload.page, context.page);
  assert.equal(payload.tracking.utmSource, 'qr');
  assert.equal(payload.tracking.yclid, '123');
  assert.equal(payload.consent.given, true);
  assert.match(payload.comment, /История детства/);
  assert.equal(payload.formElapsedMs, 2000);
});
test('no invented institution, optional package is not a confirmed order', () => {
  const payload = buildKindergartenLead({ ...value, institution: '', comment: 'x'.repeat(1000) }, { ...context, albumTitle: undefined });
  assert.equal(payload.institution, '');
  assert.match(payload.comment, /нужна консультация/);
  assert.ok(payload.comment.length < 800);
});
test('actual server delivers the album and UTM into mock CRM, not a live account', async () => {
  const calls = [];
  const mock = createServer(async (req,res) => {
    let raw = ''; for await (const chunk of req) raw += chunk;
    calls.push({ url: req.url, method: req.method, body: raw ? JSON.parse(raw) : null });
    const body = req.url.startsWith('/api/v4/contacts?') ? { _embedded: { contacts: [{ id: 11, custom_fields_values: [{ field_code: 'PHONE', values: [{ value: '+79990000000' }] }] }] } }
      : req.url === '/api/v4/leads' ? { _embedded: { leads: [{ id: 22 }] } } : {};
    res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body));
  });
  await new Promise(resolve => mock.listen(0,'127.0.0.1',resolve));
  const free = createServer(); await new Promise(resolve => free.listen(0,'127.0.0.1',resolve)); const port=free.address().port; await new Promise(resolve=>free.close(resolve));
  const child=spawn(process.execPath,['server/index.mjs'], { env: { ...process.env, PORT:String(port), AMO_BASE_URL:`http://127.0.0.1:${mock.address().port}`, AMO_LONG_TOKEN:'local-qa-not-a-secret', ALLOWED_ORIGINS:'http://127.0.0.1:4173' }, stdio:'pipe' });
  try {
    await new Promise((resolve,reject) => { const timer=setTimeout(()=>reject(new Error('server startup timeout')),5000); child.stdout.once('data',()=>{clearTimeout(timer);resolve();}); child.once('error',reject); });
    const payload=buildKindergartenLead(value,context);
    const post=body=>fetch(`http://127.0.0.1:${port}/api/leads`,{method:'POST',headers:{'Content-Type':'application/json',Origin:'http://127.0.0.1:4173'},body:JSON.stringify(body)});
    const invalid=await post({...payload,institution:''}); assert.equal(invalid.status,400); assert.equal(calls.length,0);
    const success=await post(payload);assert.equal(success.status,201);assert.equal((await success.json()).leadId,22);
    assert.match(calls.find(call=>call.url==='/api/v4/leads/22/notes').body[0].params.text,/История детства/);
    assert.ok(calls.find(call=>call.url==='/api/v4/leads').body[0].custom_fields_values.some(field=>field.field_code==='UTM_SOURCE'&&field.values[0].value==='qr'));
  } finally { child.kill(); await new Promise(resolve=>mock.close(resolve)); }
});
