const CLAUDE_KEY = process.env.CLAUDE_KEY;
exports.handler = async (event) => {
  const CORS = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'POST, OPTIONS','Content-Type':'application/json'};
  if (event.httpMethod === 'OPTIONS') return {statusCode:200,headers:CORS,body:''};
  if (event.httpMethod !== 'POST') return {statusCode:405,headers:CORS,body:'{}'};
  try {
    const body = JSON.parse(event.body||'{}');
    const payload = {model:'claude-sonnet-4-20250514',max_tokens:body.max_tokens||2000,system:body.system||'',messages:body.messages||[]};
    if(body.tools) payload.tools = body.tools;
    const r = await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':CLAUDE_KEY,'anthropic-version':'2023-06-01'},body:JSON.stringify(payload)});
    const data = await r.json();
    return {statusCode:r.ok?200:r.status,headers:CORS,body:JSON.stringify(data)};
  } catch(err) {return {statusCode:500,headers:CORS,body:JSON.stringify({error:err.message})};}
};
