import {readFile} from 'node:fs/promises';
const html=await readFile('src/index.html','utf8'),js=await readFile('src/game.js','utf8');
const must=[/UNICORN ASCENDING/,/nearestHook/,/hookReady/,/SPECTRUM/,/localStorage\.uaBest/,/window\.UA/,/ShiftLeft/,/ArrowRight/];for(const x of must)if(!x.test(js))throw Error(`missing gameplay contract ${x}`);
if(/https?:\/\//.test(html+js)||/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(js))throw Error('contest build must be offline and self-contained');
if(!/canvas id="c"/.test(html)||!/game\.js/.test(html))throw Error('entry shell contract missing');
console.log('Unicorn Ascending source contracts OK');
