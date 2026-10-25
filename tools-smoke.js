// Render smoke test: load index.html from disk with Firebase stubbed, check the calendar draws.
const { chromium } = require('playwright'); const fs=require('fs'); const path=process.argv[2];
(async()=>{ const html=fs.readFileSync(path,'utf8').replace(/<script src="https:\/\/www\.gstatic\.com[^>]*><\/script>/g,'');
  const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1200,height:900}}); const errs=[];
  pg.on('pageerror',e=>errs.push(e.message)); pg.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); });
  await pg.addInitScript(()=>{ window.firebase={ initializeApp(){}, firestore(){ throw new Error('no firebase in smoke test'); } }; });
  await pg.setContent(html,{waitUntil:'load'}); await pg.waitForTimeout(800);
  const r=await pg.evaluate(()=>({cells:document.querySelectorAll('.cell').length, bands:document.querySelectorAll('.grid .wkband').length, rows:document.querySelectorAll('.row').length, legend:document.getElementById('legend').textContent.trim().slice(0,60)}));
  await b.close(); const bad=errs.filter(e=>!/firebase|gstatic|net::ERR|Failed to load resource/i.test(e));
  console.log(JSON.stringify(r), bad.length?('ERRORS: '+bad.join(' | ')):'no page errors');
  process.exit(r.cells>=28 && !bad.length ? 0 : 1); })();
