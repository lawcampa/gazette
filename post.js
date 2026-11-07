(function(){var R=document.getElementById('rel');if(!R)return;var B=R.getAttribute('data-base'),S=R.getAttribute('data-s'),A=R.getAttribute('data-a'),T=(R.getAttribute('data-t')||'').split('|').filter(Boolean);
function e(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function dt(s){try{return new Date(s).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}catch(x){return ''}}
function card(p){return '<a class="it" href="'+B+'/posts/'+e(p.s)+'.html"><div class="k">'+(p.k==='wiki'?'Law Wiki':'Magazine')+'</div><b>'+e(p.t)+'</b><p>'+e(p.x)+'</p><small>By '+e(p.n)+' · '+e(dt(p.d))+'</small></a>'}
fetch(B+'/posts.json').then(function(r){return r.json()}).then(function(L){
var by=L.filter(function(p){return p.a===A&&p.s!==S}).sort(function(a,b){return a.d<b.d?1:-1});
var sim=L.filter(function(p){return p.s!==S}).map(function(p){var n=0;(p.g||[]).forEach(function(t){if(T.indexOf(t)>-1)n++});return {p:p,n:n}}).filter(function(o){return o.n>0}).sort(function(a,b){return b.n-a.n||(a.p.d<b.p.d?1:-1)}).slice(0,3);
var h='';
if(sim.length)h+='<section class="rel"><h2>Similar posts</h2>'+sim.map(function(o){return card(o.p)}).join('')+'</section>';
if(by.length){h+='<section class="rel"><h2>More by '+e(R.getAttribute('data-n'))+'</h2><div id="byl">'+by.map(function(p,i){return '<div'+(i>4?' class="xtra" hidden':'')+'>'+card(p)+'</div>'}).join('')+'</div>'+(by.length>5?'<button class="more" id="vall" type="button">View all ('+by.length+')</button>':'')+'</section>'}
R.innerHTML=h;
var b=document.getElementById('vall');if(b)b.onclick=function(){var x=document.querySelectorAll('#byl .xtra'),open=b.getAttribute('data-o')==='1';x.forEach(function(d){d.hidden=open});b.setAttribute('data-o',open?'0':'1');b.textContent=open?'View all ('+by.length+')':'Show less'}
}).catch(function(){})})();