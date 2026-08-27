import {mkdir,readFile,writeFile,rm,cp} from 'node:fs/promises';
import {deflateRawSync} from 'node:zlib';
import {join} from 'node:path';
const ROOT=new URL('..',import.meta.url).pathname,D=join(ROOT,'dist');
await rm(D,{recursive:true,force:true});await mkdir(D,{recursive:true});
for(const f of ['index.html','game.js'])await cp(join(ROOT,'src',f),join(D,f));
let table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;table[n]=c>>>0}
const crc=b=>{let c=0xffffffff;for(const x of b)c=table[(c^x)&255]^(c>>>8);return(c^0xffffffff)>>>0};
const files=[];let off=0,locals=[],centrals=[];
for(const name of ['index.html','game.js']){const raw=await readFile(join(D,name)),zip=deflateRawSync(raw,{level:9}),nb=Buffer.from(name),cr=crc(raw),l=Buffer.alloc(30);l.writeUInt32LE(0x04034b50);l.writeUInt16LE(20,4);l.writeUInt16LE(8,6);l.writeUInt16LE(8,8);l.writeUInt32LE(cr,14);l.writeUInt32LE(zip.length,18);l.writeUInt32LE(raw.length,22);l.writeUInt16LE(nb.length,26);locals.push(l,nb,zip);const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(8,8);c.writeUInt16LE(8,10);c.writeUInt32LE(cr,16);c.writeUInt32LE(zip.length,20);c.writeUInt32LE(raw.length,24);c.writeUInt16LE(nb.length,28);c.writeUInt32LE(off,42);centrals.push(c,nb);files.push({name,raw:raw.length,deflated:zip.length});off+=l.length+nb.length+zip.length}
const central=Buffer.concat(centrals),body=Buffer.concat(locals),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(central.length,12);end.writeUInt32LE(body.length,16);const archive=Buffer.concat([body,central,end]);await writeFile(join(D,'unicorn-ascending.zip'),archive);const limit=13*1024;const report={limitBytes:limit,zipBytes:archive.length,remainingBytes:limit-archive.length,files};await writeFile(join(D,'size.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(archive.length>limit){console.error(`js13k budget exceeded by ${archive.length-limit} bytes`);process.exit(1)}
