const API_AI = location.origin + '/api/ai';
const API_QUOTE = '/api/quote';
const API_WEATHER = '/api/weather';

// YouTube search opens results in new tab; random playlist
const sampleYt = ['dQw4w9WgXcQ','3JZ_D3ELwOQ','kXYiU_JCYtU','9bZkp7q19f0','fJ9rUzIMcZQ'];
document.getElementById('ytRandom').onclick = ()=>{ const id=sampleYt[Math.floor(Math.random()*sampleYt.length)]; document.getElementById('ytPlayer').src='https://www.youtube.com/embed/'+id; };
document.getElementById('ytSearch').onclick = ()=>{ const q=document.getElementById('ytQuery').value.trim(); if(!q) return window.open('https://www.youtube.com/results?search_query='+encodeURIComponent(q),'_blank'); };

// Social buttons
document.getElementById('btnTik').onclick = ()=> window.open('https://www.tiktok.com','_blank');
document.getElementById('btnIg').onclick = ()=> window.open('https://www.instagram.com','_blank');
document.getElementById('btnFb').onclick = ()=> window.open('https://www.facebook.com','_blank');

// Google search
document.getElementById('searchBtn').onclick = ()=>{ const q=document.getElementById('googleSearch').value.trim(); if(!q) return; window.open('https://www.google.com/search?q='+encodeURIComponent(q),'_blank'); };

// Quote
async function loadQuote(){ try{ const r=await fetch(API_QUOTE); const j=await r.json(); document.getElementById('quoteBox').innerText=j.quote; }catch(e){ document.getElementById('quoteBox').innerText='Error'; } }
document.getElementById('quoteBtn').onclick = loadQuote; loadQuote();

// Weather
document.getElementById('cityBtn').onclick = async ()=>{
  const city = document.getElementById('cityInput').value.trim();
  if(!city){ alert('Masukkan nama kota'); return; }
  const r = await fetch(API_WEATHER + '?q=' + encodeURIComponent(city));
  if(!r.ok){ document.getElementById('weatherResult').innerText = 'Weather API key missing or error'; return; }
  const j = await r.json();
  document.getElementById('weatherResult').innerHTML = `<strong>${j.name}</strong><div>${j.weather?.[0]?.description || ''}, ${j.main?.temp}°C</div><div>Wind: ${j.wind?.speed} m/s</div>`;
};

// AI
function appendMsg(role, text){ const wrap=document.getElementById('aiMessages'); const div=document.createElement('div'); div.style.textAlign = role==='user'?'right':'left'; div.style.margin='6px 0'; div.innerHTML = `<div style="display:inline-block;padding:8px;border-radius:8px;background:${role==='user'?'#dff8ff':'#ffffff'}">${text}</div>`; wrap.appendChild(div); wrap.scrollTop = wrap.scrollHeight; }
document.getElementById('sendAI').onclick = async ()=>{
  const prompt = document.getElementById('prompt').value.trim(); if(!prompt) return;
  appendMsg('user', prompt); appendMsg('ai','Loading...');
  try{
    const res = await fetch(API_AI, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt })});
    const d = await res.json();
    const msgs = document.getElementById('aiMessages').children;
    if(msgs.length) msgs[msgs.length-1].innerHTML = `<div style="display:inline-block;padding:8px;border-radius:8px;background:#ffffff">${d.reply||d.error||'No reply'}</div>`;
  }catch(e){ appendMsg('ai','Error: '+e.message); }
  document.getElementById('prompt').value='';
};

// RPS game
document.querySelectorAll('.rps').forEach(b=> b.onclick = ()=>{
  const user = b.dataset.choice;
  const opts = ['rock','paper','scissors'];
  const comp = opts[Math.floor(Math.random()*3)];
  let result = 'Seri';
  if(user==='rock' && comp==='scissors') result='Menang'; if(user==='paper' && comp==='rock') result='Menang'; if(user==='scissors' && comp==='paper') result='Menang';
  if(user===comp) result='Seri'; else if(result!=='Menang') result='Kalah';
  document.getElementById('rpsResult').innerText = `Kamu: ${user} — Komputer: ${comp} — Hasil: ${result}`;
});
