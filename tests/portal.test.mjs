import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const require=createRequire(import.meta.url),{normalizeModules,normalizeStudy,safeImage,safeLink}=require('../core.js');
const root=new URL('../',import.meta.url),source=await readFile(new URL('data.js',root),'utf8');
const data=JSON.parse(source.slice(source.indexOf('=')+1).trim().replace(/;$/,'')),modules=normalizeModules(data);
test('preserva os oito temas, simulado, exemplos, atividades e ilustrações da apostila',async()=>{
 assert.equal(modules.length,10);assert.equal(modules.reduce((n,m)=>n+m.quiz.length,0),136);assert.equal(modules.reduce((n,m)=>n+m.written.length,0),24);assert.equal(modules.reduce((n,m)=>n+m.examples.length,0),24);
 assert.equal(modules.reduce((n,m)=>n+m.images.length,0),29);
 for(const m of modules)for(const image of m.images)await access(new URL(image.src,root));
 for(const m of modules.slice(1,-1)){assert.equal(m.quiz.length,15);assert.equal(m.written.length,3);assert.equal(m.examples.length,3);assert.deepEqual(m.written.map(q=>q.number),['4','7','10']);assert.equal(new Set([...m.quiz.map(q=>q.sourceNumber),...m.written.map(q=>q.number)]).size,18)}
 assert.equal(modules.at(-1).quiz.length,16);assert.ok(modules.every(m=>m.videos.length===0));
});
test('gabaritos mantêm a associação entre número da apostila e alternativa correta',()=>{
 const first=modules[1];assert.equal(first.quiz.find(q=>q.sourceNumber==='1').options[first.quiz.find(q=>q.sourceNumber==='1').answer],'−5');
 const simulation=modules.at(-1);assert.deepEqual(simulation.quiz.map(q=>'ABCD'[q.answer]),['A','A','B','B','B','C','B','B','A','C','B','D','A','C','B','B']);
 assert.ok(first.written.find(q=>q.number==='7').answer.includes('12'));
});
test('respostas discursivas persistem e são invalidadas quando o exercício muda',()=>{
 const m=modules[1],q=m.written[0],key=m.id+'/'+q.id;let study=normalizeStudy({},modules);study.writtenAnswers[key]='Minha conta: 2x+6=14, x=4.';
 const restored=normalizeStudy(JSON.parse(JSON.stringify(study)),modules);assert.equal(restored.writtenAnswers[key],study.writtenAnswers[key]);
 const revised=structuredClone(modules);revised[1].written[0].q+=' Alterada';assert.equal(normalizeStudy(restored,revised).writtenAnswers[key],undefined);
});
test('checklists, respostas objetivas e tentativas mantêm progresso individual',()=>{
 const m=modules[1],key=m.id+'/main';const study=normalizeStudy({checks:{[m.id]:{teoria:true,video:'true'}},answers:{[key]:{0:m.quiz[0].answer}},grades:{[key]:{at:'2026-10-27T12:00:00Z'}},attempts:[{moduleId:m.id,key,total:15,correct:10,at:'2026-10-27T12:00:00Z'}]},modules);
 assert.equal(study.checks[m.id].teoria,true);assert.equal(study.checks[m.id].video,false);assert.equal(study.grades[key].correct,1);assert.equal(study.attempts[0].percent,67);assert.deepEqual(normalizeStudy(JSON.parse(JSON.stringify(study)),modules),study);
});
test('recusa backups malformados e endereços executáveis',()=>{
 assert.throws(()=>normalizeModules([]));const invalid=structuredClone(modules);invalid[1].quiz[0].answer=9;assert.throws(()=>normalizeModules(invalid));
 assert.equal(safeImage('javascript:alert(1)'), '');assert.equal(safeLink('javascript:alert(1)'), '');assert.equal(safeImage('assets/../hidden.png'),'');
 const unsafe=structuredClone(modules);unsafe[1].written[0].id='__proto__';assert.throws(()=>normalizeModules(unsafe));
});
test('conteúdo e progresso de Matemática não usam as chaves de Português',async()=>{
 const app=await readFile(new URL('app.js',root),'utf8');assert.match(app,/invest_math_v2_content/);assert.match(app,/invest_math_v2_progress/);assert.doesNotMatch(app,/invest_pt_v2/);
 const published=await readFile(new URL('published.js',root),'utf8');assert.match(published,/portal-invest-2027-matematica-editor/);assert.doesNotMatch(published,/portal-invest-2027-admin\./);
});
test('pacote do Pages contém somente a área de estudos e acesso ao editor protegido',async()=>{
 execFileSync(process.execPath,['scripts/build.mjs'],{cwd:root,stdio:'pipe'});const html=await readFile(new URL('dist/index.html',root),'utf8');
 assert.match(html,/Portal INVEST 2027 — Matemática/);assert.match(html,/onlineEditorLink/);assert.doesNotMatch(html,/editor\.js|id="adminScreen"|data-editor=/);assert.equal((await readdir(new URL('dist/',root))).includes('published.js'),true);
 for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(/^https:\/\//.test(match[1]))continue;assert.equal(match[1].startsWith('/'),false);await access(new URL('dist/'+match[1],root))}
});
