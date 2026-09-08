const modal=document.getElementById('checkoutModal');
const statusEl=document.getElementById('payStatus');
document.getElementById('menuBtn').addEventListener('click',()=>document.getElementById('navLinks').classList.toggle('open'));
function openCheckout(){modal.classList.add('show');modal.setAttribute('aria-hidden','false')}
function closeCheckout(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');statusEl.textContent=''}
async function startPayment(){
 const name=document.getElementById('customerName').value.trim();
 const email=document.getElementById('customerEmail').value.trim();
 if(!name||!email||!email.includes('@')){statusEl.textContent='Please enter your name and a valid email.';return}
 statusEl.textContent='Creating secure payment…';
 try{
  const r=await fetch('/api/create-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email})});
  const data=await r.json(); if(!r.ok) throw new Error(data.error||'Unable to create order');
  const options={key:data.keyId,amount:data.amount,currency:data.currency,name:'Gain Yourself',description:'Trading Beginner Toolkit',order_id:data.orderId,prefill:{name,email},theme:{color:'#55e878'},handler:async function(resp){
    statusEl.textContent='Verifying payment…';
    const vr=await fetch('/api/verify-payment',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(resp)});
    const vd=await vr.json();
    if(vr.ok){statusEl.innerHTML='Payment verified. <b>Check your email for the secure download link.</b>';setTimeout(()=>{window.location.href='/success.html'},1800)} else {statusEl.textContent=vd.error||'Verification failed. Please contact support.'}
  },modal:{ondismiss:()=>{statusEl.textContent='Payment window closed.'}}};
  const rzp=new Razorpay(options); rzp.on('payment.failed',e=>{statusEl.textContent=e.error?.description||'Payment failed. Please try again.'}); rzp.open();
 }catch(e){statusEl.textContent=e.message}
}
window.addEventListener('click',e=>{if(e.target===modal)closeCheckout()});
