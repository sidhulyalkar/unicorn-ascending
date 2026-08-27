import {readFile} from 'node:fs/promises';
const html=await readFile('src/index.html','utf8'),js=await readFile('src/game.js','utf8');
const must=[/UNICORN ASCENDING/,/nearestHook/,/hookReady/,/SPECTRUM/,/localStorage\.uaBest/,/window\.UA/,/ShiftLeft/,/ArrowRight/,/function cancelHook\(\)/,/function suspend\(\)/,/visibilitychange/,/suspended/,/STEP=1\/120/,/MAX_STEPS=8/,/while\(acc>=STEP&&n<MAX_STEPS\)/,/fixedHz:120/,/droppedFrames/];for(const x of must)if(!x.test(js))throw Error(`missing gameplay contract ${x}`);
if(/addEventListener\('blur',\(\)=>[^\n]*release\(\)/.test(js))throw Error('focus loss must cancel Horn Hook without a scored release');
if(/function frame\([^)]*\)\{[^}]*update\(dt\)/.test(js))throw Error('render-frame dt must not directly own gameplay simulation');
if(/https?:\/\//.test(html+js)||/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(js))throw Error('contest build must be offline and self-contained');
if(!/canvas id="c"/.test(html)||!/game\.js/.test(html))throw Error('entry shell contract missing');
console.log('Unicorn Ascending source contracts OK');
