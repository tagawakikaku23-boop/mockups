document.body.insertAdjacentHTML('beforeend','<button class="em-btn" type="button" id="emBtn">✎ 修正を書き込む</button><div class="em-bar" id="emBar" role="toolbar" aria-label="修正モード"><b>修正モード</b><span id="emHint">直したい場所を押してください</span><button type="button" id="emShow">一覧（<span id="emCount">0</span>）</button><button type="button" id="emCopy">修正リストをコピー</button><button type="button" class="em-end" id="emEnd">終了</button></div><div class="em-pop" id="emPop" role="dialog" aria-label="修正コメント"><p class="t" id="emTarget"></p><textarea id="emText" placeholder="例）この文章をもう少し短く／写真を差し替えたい"></textarea><div class="acts"><button type="button" id="emCancel">やめる</button><button type="button" class="ok" id="emSave">追加する</button></div></div><div class="em-list" id="emList"><h4>修正リスト</h4><ol id="emOl"></ol></div><div class="em-toast" id="emToast"></div>');

(function(){
  var KEY='niisma-edit-v1',items=[],on=false,pending=null;
  function load(){try{var s=JSON.parse(sessionStorage.getItem(KEY)||'{}');items=s.items||[];on=!!s.on}catch(e){}}
  function save(){try{sessionStorage.setItem(KEY,JSON.stringify({items:items,on:on}))}catch(e){}}
  var $=function(id){return document.getElementById(id)};
  function where(el){
    var c=el.closest('.catch,h1,h2,h3,p,li,button,a,td,th');if(c&&el.tagName!=='IMG')el=c;
    for(var k=0;k<3&&el.tagName!=='IMG'&&(el.innerText||'').trim().length<6&&el.parentElement;k++)el=el.parentElement;
    var sec=el.closest('section[id],section[aria-label],header,footer');
    var name=sec?(sec.id?sec.id.toUpperCase():(sec.getAttribute('aria-label')||sec.tagName.toLowerCase())):'ページ';
    var map={ABOUT:'協会について',STRENGTH:'選ばれる3つの理由',SERVICE:'サービス紹介',PRICE:'料金',FLOW:'ご相談の流れ',CASE:'事例紹介',MESSAGE:'代表あいさつ',COMPANY:'協会概要',CONTACT:'お問い合わせ',header:'ヘッダー',footer:'フッター'};
    var txt=(el.getAttribute('alt')||el.innerText||el.textContent||'').replace(/\s+/g,' ').trim();
    if(el.tagName==='IMG')txt='画像：'+(el.alt||'');
    if(txt.length>34)txt=txt.slice(0,34)+'…';
    return (document.body.dataset.page||'')+'｜'+(map[name]||name)+'｜'+(txt||el.tagName.toLowerCase());
  }
  function renderPins(){
    document.querySelectorAll('.em-pin').forEach(function(p){p.remove()});
    items.forEach(function(it,i){if(it.path&&it.path!==location.pathname)return;var p=document.createElement('div');p.className='em-pin';p.textContent=i+1;p.style.left=it.x+'px';p.style.top=it.y+'px';document.body.appendChild(p)});
    $('emCount').textContent=items.length;
    var ol=$('emOl');ol.innerHTML='';
    if(!items.length){ol.innerHTML='<p class="empty">まだありません</p>';return}
    items.forEach(function(it,i){var li=document.createElement('li');var b=document.createElement('button');b.type='button';b.textContent='削除';b.onclick=function(){items.splice(i,1);save();renderPins()};
      var sm=document.createElement('small');sm.textContent=it.where;li.appendChild(b);li.appendChild(sm);li.appendChild(document.createTextNode(it.text));ol.appendChild(li)});
  }
  function setOn(v){on=v;document.body.classList.toggle('em-on',v);if(!v){$('emList').classList.remove('show');$('emPop').classList.remove('show')}save();renderPins()}
  function toast(m){var t=$('emToast');t.textContent=m;t.style.display='block';clearTimeout(t._t);t._t=setTimeout(function(){t.style.display='none'},2200)}
  document.addEventListener('click',function(e){
    if(!on)return;
    if(e.target.closest('.em-bar,.em-pop,.em-list,.em-btn,.em-toast'))return;
    e.preventDefault();e.stopPropagation();
    var el=e.target;pending={x:e.pageX,y:e.pageY,path:location.pathname,where:where(el)};
    $('emTarget').textContent='場所：'+pending.where;$('emText').value='';$('emPop').classList.add('show');setTimeout(function(){$('emText').focus()},30);
  },true);
  document.addEventListener('submit',function(e){if(on){e.preventDefault();e.stopImmediatePropagation()}},true);
  $('emBtn').onclick=function(){setOn(true);toast('直したい場所を押してください')};
  $('emEnd').onclick=function(){setOn(false)};
  $('emCancel').onclick=function(){$('emPop').classList.remove('show');pending=null};
  $('emSave').onclick=function(){var t=$('emText').value.trim();if(!t||!pending){$('emPop').classList.remove('show');return}pending.text=t;items.push(pending);pending=null;save();renderPins();$('emPop').classList.remove('show');toast((items.length)+'件目を追加しました')};
  $('emShow').onclick=function(){$('emList').classList.toggle('show')};
  $('emCopy').onclick=function(){
    if(!items.length){toast('まだ修正がありません');return}
    var txt='【NIISMA HP 修正リスト】\n'+items.map(function(it,i){return (i+1)+'. ['+it.where+']\n   → '+it.text}).join('\n');
    function fb(){var ta=document.createElement('textarea');ta.value=txt;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast('コピーしました')}catch(e){toast('コピーできませんでした')}ta.remove()}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(function(){toast('コピーしました')},fb)}else fb();
  };
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){$('emPop').classList.remove('show');$('emList').classList.remove('show')}});
  load();
  if(/[?&]edit\b/.test(location.search))on=true;
  setOn(on);
})();
