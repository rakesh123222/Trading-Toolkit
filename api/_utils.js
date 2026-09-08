const crypto=require('crypto');
const fs=require('fs');
const path=require('path');
const RAZORPAY_BASE='https://api.razorpay.com/v1';
function auth(){return 'Basic '+Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}
async function razor(pathname,options={}){const r=await fetch(RAZORPAY_BASE+pathname,{...options,headers:{'Content-Type':'application/json',Authorization:auth(),...(options.headers||{})}});const t=await r.text();let j;try{j=JSON.parse(t)}catch{j={raw:t}}if(!r.ok)throw new Error(j.error?.description||'Razorpay API error');return j}
function hmac(message,secret){return crypto.createHmac('sha256',secret).update(message).digest('hex')}
function makeToken(orderId,email){const payload=Buffer.from(JSON.stringify({orderId,email,exp:Date.now()+1000*60*60*24})).toString('base64url');return payload+'.'+hmac(payload,process.env.DOWNLOAD_SECRET)}
function readToken(token){const [payload,sig]=String(token||'').split('.');if(!payload||!sig)throw new Error('Invalid token');if(!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(hmac(payload,process.env.DOWNLOAD_SECRET))))throw new Error('Invalid token');const data=JSON.parse(Buffer.from(payload,'base64url').toString());if(Date.now()>data.exp)throw new Error('Download link expired');return data}
function downloadUrl(orderId,email){const base=process.env.SITE_URL||'';return `${base}/api/download?token=${encodeURIComponent(makeToken(orderId,email))}`}
async function sendEmail({to,name,orderId}){
 const url=downloadUrl(orderId,to);
 if(!process.env.RESEND_API_KEY) return {skipped:true,url};
 const html=`<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto"><h2 style="color:#15883a">GAIN YOURSELF</h2><h1>Your Trading Beginner Toolkit is ready.</h1><p>Hi ${String(name||'there').replace(/[<>]/g,'')},</p><p>Your payment was verified successfully. Use the button below to access your files.</p><p><a href="${url}" style="background:#55e878;color:#06110c;padding:14px 22px;border-radius:10px;text-decoration:none;font-weight:bold;display:inline-block">Download My Toolkit</a></p><p>This secure link expires in 24 hours. You can request support if you have an issue.</p><hr><small>Educational product only. Trading involves risk; no profit is guaranteed.</small></div>`;
 const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.RESEND_API_KEY}`},body:JSON.stringify({from:process.env.FROM_EMAIL||'Gain Yourself <onboarding@resend.dev>',to:[to],subject:'Your Gain Yourself Trading Beginner Toolkit',html})});
 if(!r.ok) throw new Error('Email delivery failed'); return {skipped:false,url};
}
function rawBody(req){return new Promise((resolve,reject)=>{let d='';req.on('data',c=>d+=c);req.on('end',()=>resolve(d));req.on('error',reject)})}
module.exports={razor,hmac,makeToken,readToken,downloadUrl,sendEmail,rawBody};
