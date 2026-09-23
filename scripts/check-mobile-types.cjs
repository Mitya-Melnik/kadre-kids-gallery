// Compare complete TypeScript diagnostics against the unchanged baseline.
// Existing errors remain reported; any new diagnostic fails the check.
const ts = require('typescript');
const path = require('node:path');
const fs = require('node:fs');
const baseline = path.resolve(process.argv[2] || '/tmp/mobile-baseline');
const candidate = process.cwd();
function diagnostics(root) {
  const filename = path.join(root, 'tsconfig.app.json');
  const cfg = ts.readConfigFile(filename, ts.sys.readFile);
  if (cfg.error) throw new Error(ts.flattenDiagnosticMessageText(cfg.error.messageText, '\n'));
  const options = ts.parseJsonConfigFileContent(cfg.config, ts.sys, root);
  const program = ts.createProgram(options.fileNames, {...options.options, noEmit: true});
  return ts.getPreEmitDiagnostics(program).map(d => {
    let message = ts.flattenDiagnosticMessageText(d.messageText, '\n');
    for (const prefix of [baseline, candidate]) message = message.split(prefix).join('<repo>');
    return {file: d.file ? path.relative(root,d.file.fileName) : '<config>', code: d.code, message};
  });
}
const before=diagnostics(baseline), after=diagnostics(candidate);
const counts=new Map();
for (const d of before) {const k=JSON.stringify(d);counts.set(k,(counts.get(k)||0)+1);}
const added=after.filter(d=>{const k=JSON.stringify(d),n=counts.get(k)||0;if(n){counts.set(k,n-1);return false;}return true;});
const report={baselineDiagnostics:before.length,candidateDiagnostics:after.length,newDiagnostics:added.length,existing:before,added};
fs.mkdirSync('mobile-preview-results',{recursive:true});
fs.writeFileSync('mobile-preview-results/types.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
process.exitCode=added.length?1:0;
