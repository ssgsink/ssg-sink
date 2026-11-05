const ts=require('typescript'),vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('app/admin/search-rank/ApiUsage.tsx','utf8');
const fn=source.slice(source.indexOf('export function usageWindow'),source.indexOf('export default')).replace('export ','');
const c={};vm.runInNewContext(ts.transpile(fn+';globalThis.windowFor=usageWindow;'),c);
const before=c.windowFor(new Date('2026-11-30T14:59:59Z')),after=c.windowFor(new Date('2026-11-30T15:00:00Z'));
assert.equal(before.month,'2026-11');assert.equal(after.month,'2026-12');
assert.equal(after.today,'2026-12-01T00:00:00+09:00');
assert.equal(new Date(after.start).toISOString(),'2026-11-30T15:00:00.000Z');
console.log('PASS: Korean midnight/month boundary');
