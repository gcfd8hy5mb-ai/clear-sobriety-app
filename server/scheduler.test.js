import test from 'node:test';
import assert from 'node:assert/strict';
import {parts,nextOccurrence,dueWindows} from './scheduler.js';
const time=(s)=>Date.parse(s);
test('recognizes local times in a timezone',()=>{
 assert.deepEqual(parts(time('2026-10-27T23:00:00Z'),'America/Chicago'),{day:2,date:'2026-10-27',hour:18,minute:0});
});
test('schedules 30 minutes before a recurring window',()=>{
 const x=nextOccurrence({weekday:2,hour:18,minute:0},'America/Chicago',time('2026-10-27T20:00:00Z'),30);
 assert.equal(x.sendAt,time('2026-10-27T22:30:00Z'));
});
test('adjusts offsets after fall DST transition',()=>{
 const x=nextOccurrence({weekday:0,hour:18},'America/Chicago',time('2026-10-31T20:00:00Z'),30);
 assert.equal(x.sendAt,time('2026-11-01T23:30:00Z'));
});
test('skips nonexistent spring DST local time',()=>{
 const x=nextOccurrence({weekday:0,hour:2,minute:30},'America/Chicago',time('2026-03-07T10:00:00Z'),30);
 assert.equal(x.sendAt,time('2026-03-15T07:00:00Z'));
});
test('reports due windows within grace interval only',()=>{
 const windows=[{weekday:2,hour:18}];
 assert.equal(dueWindows(windows,'America/Chicago',time('2026-10-27T22:30:45Z')).length,1);
 assert.equal(dueWindows(windows,'America/Chicago',time('2026-10-27T22:36:00Z')).length,0);
});
