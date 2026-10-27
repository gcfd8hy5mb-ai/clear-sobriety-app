import { DatabaseSync } from 'node:sqlite';
import {randomBytes,createCipheriv,createDecipheriv,createHash} from 'node:crypto';
const key=process.env.CLEAR_STORAGE_KEY ? Buffer.from(process.env.CLEAR_STORAGE_KEY,'base64') : null;
if(!key || key.length!==32) throw Error('Set CLEAR_STORAGE_KEY to a private base64-encoded 32-byte key');
const db=new DatabaseSync(process.env.CLEAR_DB_PATH || './clear-private.sqlite');
db.exec(`CREATE TABLE IF NOT EXISTS devices (
id TEXT PRIMARY KEY, encrypted TEXT NOT NULL, updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS deliveries(
device_id TEXT NOT NULL, window_key TEXT NOT NULL, sent_at INTEGER NOT NULL,
PRIMARY KEY(device_id,window_key));`);
export const deviceId=token=>createHash('sha256').update(token).digest('hex');
function enc(o){const nonce=randomBytes(12);const cipher=createCipheriv('aes-256-gcm',key,nonce);const ct=Buffer.concat([cipher.update(JSON.stringify(o)),cipher.final()]);return Buffer.concat([nonce,cipher.getAuthTag(),ct]).toString('base64')}
function dec(v){const b=Buffer.from(v,'base64');const decipher=createDecipheriv('aes-256-gcm',key,b.subarray(0,12));decipher.setAuthTag(b.subarray(12,28));return JSON.parse(Buffer.concat([decipher.update(b.subarray(28)),decipher.final()]).toString())}
export function saveDevice(id,record){db.prepare('INSERT INTO devices VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET encrypted=excluded.encrypted,updated_at=excluded.updated_at').run(id,enc(record),Date.now())}
export function getDevice(id){const row=db.prepare('SELECT encrypted FROM devices WHERE id=?').get(id);return row?dec(row.encrypted):null}
export function deleteDevice(id){db.prepare('DELETE FROM deliveries WHERE device_id=?').run(id);db.prepare('DELETE FROM devices WHERE id=?').run(id)}
export function allDevices(){return db.prepare('SELECT id,encrypted FROM devices').all().map(r=>({id:r.id,...dec(r.encrypted)}))}
export function sent(id,key){return !!db.prepare('SELECT 1 FROM deliveries WHERE device_id=? AND window_key=?').get(id,key)}
export function markSent(id,key){db.prepare('INSERT OR IGNORE INTO deliveries VALUES(?,?,?)').run(id,key,Date.now())}
export function prune(){db.prepare("DELETE FROM deliveries WHERE sent_at < ?").run(Date.now()-35*86400000)}
