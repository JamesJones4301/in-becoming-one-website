import test from 'node:test';
import assert from 'node:assert/strict';
import handler from './submit.js';
const valid = {formType:'contact',firstName:'Phase',lastName:'Test',email:'phase1@example.com',interest:'Mentoring',message:'Automated verification',source:'Website'};
async function run(body=valid, method='POST') { const res={code:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(value){this.body=value;return this;}}; await handler({method,body},res); return res; }
test('submission validation and upstream responses', async () => {
 const originalFetch=globalThis.fetch; const originalUrl=process.env.GOOGLE_APPS_SCRIPT_URL;
 try {
 process.env.GOOGLE_APPS_SCRIPT_URL='https://example.com/private-script';
 assert.equal((await run(valid,'GET')).code,405);
 for(const data of [null,{},'{', {...valid,email:'invalid'}, {...valid,message:' '}, {...valid,formType:'unknown'}]) assert.equal((await run(data)).code,400);
 delete process.env.GOOGLE_APPS_SCRIPT_URL; assert.equal((await run()).code,503);
 process.env.GOOGLE_APPS_SCRIPT_URL='https://example.com/private-script';
 for(const result of [new Response('<html>Sign in</html>'),Response.json({}),Response.json({ok:false,message:'secret backend detail'}),Response.json({ok:true},{status:500})]) {
 globalThis.fetch=async()=>result; const res=await run(); assert.equal(res.code,502); assert.doesNotMatch(JSON.stringify(res.body),/secret|private-script|Sign in/);
 }
 globalThis.fetch=async()=>{throw new Error('secret network detail');}; assert.equal((await run()).code,502);
 globalThis.fetch=async(url,options)=>{assert.equal(options.headers['Content-Type'],'text/plain;charset=utf-8');assert.equal(JSON.parse(options.body).email,valid.email);return Response.json({ok:true});};
 assert.equal((await run()).code,200);
 assert.equal((await run({formType:'newsletter',email:valid.email,name:'',source:'Website'})).code,200);
 } finally {globalThis.fetch=originalFetch;if(originalUrl===undefined)delete process.env.GOOGLE_APPS_SCRIPT_URL;else process.env.GOOGLE_APPS_SCRIPT_URL=originalUrl;}
});
