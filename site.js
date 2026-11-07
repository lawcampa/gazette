(function(){
var API='https://oetparthway--ece311aecdf411f1b8951607ee4eb77e.web.val.run';
function $(i){return document.getElementById(i)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function tok(){try{return localStorage.getItem('studentToken')||''}catch(e){return ''}}
function setTok(t){try{if(t)localStorage.setItem('studentToken',t);else localStorage.removeItem('studentToken')}catch(e){}}
var tt;
function toast(m,bad){var t=$('lcToast');if(!t){t=el('div','toast');t.id='lcToast';document.body.appendChild(t)}t.textContent=m;t.className='toast show'+(bad?' bad':'');clearTimeout(tt);tt=setTimeout(function(){t.className='toast'+(bad?' bad':'')},3600)}
function call(path,method,body){
  var h={'Content-Type':'application/json'};if(tok())h['Authorization']='Bearer '+tok();
  return fetch(API+path,{method:method,headers:h,body:body?JSON.stringify(body):undefined}).then(function(r){return r.json().catch(function(){return {ok:false,error:'Unexpected reply. Try again.'}}).then(function(j){j._s=r.status;return j})}).catch(function(){return {ok:false,error:'No connection. Check your internet and try again.'}})
}
function modal(build){var m=el('div','mdl'),b=el('div','mbox');m.appendChild(b);document.body.appendChild(m);var close=function(){if(m.parentNode)m.parentNode.removeChild(m)};build(b,close);return close}
function info(title,text,btn,cb){modal(function(b,close){b.appendChild(el('h3',null,title));b.appendChild(el('p',null,text));var o=el('button','btn',btn||'OK');o.onclick=function(){close();if(cb)cb()};b.appendChild(o)})}
var page=document.body.getAttribute('data-page')||'';
var base=(function(){var s=document.currentScript;return s&&s.src?s.src.replace(/site[.]js([?].*)?$/,''):'/'})();
(function nav(){
  var links=document.querySelectorAll('.nv a');
  for(var i=0;i<links.length;i++){if(links[i].getAttribute('data-p')===page)links[i].className='on'}
  var l=$('nvl');
  if(l&&tok()){l.textContent='Log out';l.removeAttribute('href');l.style.cursor='pointer';l.onclick=function(e){e.preventDefault();call('/logout','POST').then(function(){});setTok('');try{localStorage.removeItem('lcDraft')}catch(x){}location.href=base+'login.html'}}
})();
function nextOk(){var m=/[?&]next=([^&]+)/.exec(location.search);return m&&decodeURIComponent(m[1])==='write.html'?'write.html':''}

if(page==='login'){
  var f=$('lf');if(!f)return;
  if(tok()){info('You are logged in','Open the writing page to start a post.','Write',function(){location.href=base+'write.html'})}
  f.onsubmit=function(e){e.preventDefault();var b=$('lb');b.disabled=true;b.textContent='Logging in...';
    call('/login','POST',{email:$('le').value.trim(),password:$('lp').value}).then(function(j){
      b.disabled=false;b.textContent='Log in';
      if(!j.ok||!j.token){toast(j.error||'Could not log in.',true);return}
      setTok(j.token);location.href=base+(nextOk()||'write.html')})};
}

if(page==='write'){
  var G=$('wGate'),BI=$('wBio'),ED=$('wEd');if(!G)return;
  var tags=[];
  var show=function(w){G.hidden=w!=='g';BI.hidden=w!=='b';ED.hidden=w!=='e'};
  if(!tok()){show('g')}else{
    call('/wiki/me','GET').then(function(j){
      if(j.login||j._s===401){setTok('');show('g');return}
      if(!j.ok){toast(j.error||'Could not load your account.',true);show('g');return}
      var p=j.profile||{};$('bnm').textContent=(p.name||'Your name')+(p.institution?' - '+p.institution:'');
      if(j.bio){show('e')}else{show('b')}
    })
  }
  $('bgo').onclick=function(){var bio=$('btx').value.trim(),lk=$('blk').value.trim();
    if(bio.length<10){toast('Write a short bio (at least 10 letters).',true);return}
    if(!/^https:[/][/](www[.]|m[.]|web[.])?(linkedin[.]com|facebook[.]com|fb[.]com|fb[.]me)[/]/i.test(lk)){toast('Add your LinkedIn or Facebook link, starting with https://',true);return}
    $('bgo').disabled=true;
    call('/wiki/bio','POST',{bio:bio,link:lk}).then(function(j){$('bgo').disabled=false;if(!j.ok){toast(j.error||'Could not save.',true);return}toast('Bio saved');show('e')})};
  $('btx').oninput=function(){$('bct').textContent=$('btx').value.length+'/150'};

  var E=$('ebody'),T=$('etitle'),TG=$('etags');
  function words(){var t=(E.innerText||'').replace(/\s+/g,' ').trim();return t?t.split(' ').length:0}
  function count(){$('ewc').textContent=words()+' words (min 100)';save()}
  function save(){try{localStorage.setItem('lcDraft',JSON.stringify({t:T.value,g:TG.value,b:E.innerHTML,k:$('ekind').value}))}catch(e){}}
  try{var d=JSON.parse(localStorage.getItem('lcDraft')||'null');if(d){T.value=d.t||'';TG.value=d.g||'';E.innerHTML=cleanH(d.b||'');if(d.k)$('ekind').value=d.k}}catch(e){}
  function cleanH(h){var D=document.createElement('div');D.innerHTML=h;var ok={P:1,H2:1,H3:1,H4:1,BLOCKQUOTE:1,UL:1,OL:1,LI:1,B:1,STRONG:1,I:1,EM:1,U:1,S:1,STRIKE:1,BR:1};
    (function w(n){var c=[].slice.call(n.childNodes);c.forEach(function(x){if(x.nodeType===1){if(!ok[x.tagName]){if(/^(SCRIPT|STYLE|IFRAME|OBJECT|IMG)$/.test(x.tagName)){n.removeChild(x);return}w(x);while(x.firstChild)n.insertBefore(x.firstChild,x);n.removeChild(x)}else{while(x.attributes.length)x.removeAttribute(x.attributes[0].name);w(x)}}else if(x.nodeType!==3)n.removeChild(x)})})(D);return D.innerHTML}
  E.addEventListener('paste',function(e){e.preventDefault();var t=(e.clipboardData||window.clipboardData).getData('text/plain');document.execCommand('insertText',false,t)});
  E.addEventListener('input',count);T.addEventListener('input',save);TG.addEventListener('input',save);$('ekind').onchange=save;
  var cmds=document.querySelectorAll('[data-c]');
  for(var i=0;i<cmds.length;i++){(function(b){b.onmousedown=function(e){e.preventDefault()};b.onclick=function(){E.focus();document.execCommand(b.getAttribute('data-c'),false,null);count()}})(cmds[i])}
  $('eblk').onchange=function(){E.focus();document.execCommand('formatBlock',false,$('eblk').value);count()};
  count();

  function body(){return cleanH(E.innerHTML)}
  function tagList(){return TG.value.split(',').map(function(x){return x.trim()}).filter(Boolean)}
  function check(){
    if(T.value.trim().length<5){toast('Give the post a title of at least 5 letters.',true);return false}
    if(words()<100){toast('A post needs at least 100 words. You have '+words()+'.',true);return false}
    if(!tagList().length){toast('Add at least one tag, separated by commas.',true);return false}
    return true}
  function payload(sub){return {kind:$('ekind').value,title:T.value.trim(),tags:tagList(),body:body(),submit:sub,accept:sub?true:undefined}}
  function done(sub){
    if(sub){try{localStorage.removeItem('lcDraft')}catch(e){}
      info('Sent for review','Your post has been sent to the Law Companion team. If it is accepted and gazetted, you will get a message with its link.','Write another',function(){T.value='';TG.value='';E.innerHTML='';$('etm').checked=false;count()})}
    else toast('Draft saved')}
  $('esave').onclick=function(){if(T.value.trim().length<1){toast('Add a title first.',true);return}
    call('/wiki/save','POST',payload(false)).then(function(j){if(j.login||j._s===401){setTok('');toast('Please log in again.',true);setTimeout(function(){location.href=base+'login.html?next=write.html'},900);return}if(!j.ok){toast(j.error||'Could not save.',true);return}done(false)})};
  function fixBox(j){return new Promise(function(res){modal(function(b,close){
    b.appendChild(el('h3',null,'This post needs changes'));if(j.summary)b.appendChild(el('p',null,j.summary));
    (j.flags||[]).forEach(function(f){var d=el('div','fl'),h=el('b',null,f.type||'Issue');h.appendChild(el('em',null,f.kind==='fact'?'Fact check':f.kind==='platform'?'Platform':'Policy'));d.appendChild(h);
      if(f.quote)d.appendChild(el('q',null,f.quote));if(f.why)d.appendChild(el('p',null,f.why));
      if(f.suggestion){var p=el('p');p.appendChild(el('b',null,'Suggestion: '));p.appendChild(document.createTextNode(f.suggestion));d.appendChild(p)}b.appendChild(d)});
    var row=el('div','row'),ed=el('button','btn','Edit post');ed.onclick=function(){close();res(false)};row.appendChild(ed);b.appendChild(row);
    if(j.appealable){var ap=el('button','btn alt','Appeal'),box=el('div');box.hidden=true;box.style.marginTop='12px';
      var ta=el('textarea');ta.rows=3;ta.maxLength=600;ta.placeholder='Why is this allowed? For example, it reports the facts of a case.';
      var go=el('button','btn','Send appeal');go.style.marginTop='8px';
      go.onclick=function(){go.disabled=true;call('/wiki/appeal','POST',{title:T.value.trim(),body:body(),reason:ta.value}).then(function(a){go.disabled=false;if(!a.ok){toast(a.error||'Could not send the appeal.',true);return}close();res(true)})};
      box.appendChild(ta);box.appendChild(go);ap.onclick=function(){box.hidden=false;ap.hidden=true;ta.focus()};row.appendChild(ap);b.appendChild(box)}
    else b.appendChild(el('p',null,'This cannot be appealed. Please rewrite the marked parts.'))})})}
  $('esub').onclick=function(){
    if(!check())return;if(!$('etm').checked){toast('Please tick the box to accept the terms.',true);return}
    var btn=$('esub');btn.disabled=true;btn.textContent='Checking...';
    var reset=function(){btn.disabled=false;btn.textContent='Submit for review'};
    call('/wiki/precheck','POST',{title:T.value.trim(),body:body(),tags:tagList()}).then(function(j){
      if(j.login||j._s===401){reset();setTok('');toast('Please log in again.',true);setTimeout(function(){location.href=base+'login.html?next=write.html'},900);return}
      if(!j.ok){reset();toast(j.error||'Could not check your post. Try again.',true);return}
      var go=(j.verdict!=='fix'||j.appealed)?Promise.resolve(true):fixBox(j);
      go.then(function(ok){if(!ok){reset();return}
        call('/wiki/save','POST',payload(true)).then(function(r){reset();
          if(!r.ok){toast(r.error||'Could not submit.',true);return}done(true)})})})};
}
})();