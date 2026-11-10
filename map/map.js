"use strict";
/* Standalone PUNCH 'N' GO map UX concept. No game engine, no external scripts. */
(() => {
  const BASE = 390, HEIGHT = 2320;
  const root = document.querySelector(".game");
  const world = document.getElementById("world");
  const mapScroll = document.getElementById("mapScroll");
  const currentNode = document.getElementById("currentStage");
  const jumpButton = document.getElementById("jumpCurrent");
  const shade = document.getElementById("sheetShade");
  const content = document.getElementById("sheetContent");
  const tag = document.getElementById("sheetTag");
  const close = document.getElementById("closeSheet");
  const dockTitle = document.getElementById("currentStageTitle");
  const dockSubtitle = document.getElementById("currentStageSubtitle");
  if (!root || !world || !mapScroll || !shade) return;

  const levels = {
    "1-1": { title:"Каменный завал", objective:"Разбей четыре каменных препятствия", npc:"Лесной страж", short:"Разбей 4 каменных завала", story:"Страж просит расчистить лесную дорогу от магических камней. На пути встречаются гоблины: отбрось их в завалы или разбивай препятствия ударами.", rewards:"Условные награды; точная экономика ещё не утверждена." },
    "1-2": { title:"Камни тролля", objective:"Собери 5 из 8 волшебных камней", npc:"Каменный тролль", short:"Собери 5 волшебных камней", story:"Добродушный тролль растерял волшебные камни. Меняй полосы во время бега, отбивайся от гоблинов и возвращай его находки.", rewards:"Постоянные ресурсы — концепт, цифры не утверждены." },
    "1-3": { title:"Логово Бульдога", objective:"Победи финального босса зоны", npc:"Лесной страж", short:"Победи Бульдога", story:"Пройди через лесные ворота и сразись с Бульдогом. Он использует опасные выпады в две фазы; прерывание атаки требует своевременной контратаки.", rewards:"После победы откроется следующая зона. Звёзды не требуются." },
    "2-1": { title:"Начало следующей зоны", objective:"Новая глава приключения", npc:"Не определён", short:"Новая зона", story:"Это демонстрационный узел продолжения пути. Названия будущих зон, враги и сюжет пока не утверждены.", rewards:"Зона открывается после победы над боссом 1-3." },
    "2-2": { title:"Этап следующей зоны", objective:"Не утверждено", npc:"Не определён", short:"Следующая зона", story:"Сценарий и название этапа пока не утверждены.", rewards:"Пример интерфейса заблокированного этапа." },
    "2-3": { title:"Босс следующей зоны", objective:"Не утверждено", npc:"Не определён", short:"Босс следующей зоны", story:"Следующий босс ещё не утверждён.", rewards:"Пример интерфейса заблокированного этапа." }
  };
  const order = ["1-1","1-2","1-3","2-1","2-2","2-3"];
  const DEMO_STORAGE = "punchngo.v3.map.demo";
  const QUERY = new URLSearchParams(location.search);
  const safeInt=(n,lo,hi)=>Math.min(hi,Math.max(lo,Number.isFinite(n)?n:lo));
  let progress=1,questCount=3, sound=true, reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  try {
    const obj = JSON.parse(sessionStorage.getItem(DEMO_STORAGE) || "null");
    if (obj && typeof obj === "object") {
      progress=safeInt(Number(obj.progress),0,3);
      questCount=safeInt(Number(obj.questCount),0,10);
      sound=obj.sound!==false;
      reducedMotion=obj.reducedMotion===true || reducedMotion;
    }
  } catch (_) { /* storage may be blocked in private mode */ }
  const save=()=>{try{sessionStorage.setItem(DEMO_STORAGE,JSON.stringify({progress,questCount,sound,reducedMotion}))}catch(_){}};
  const h=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
  const btn=(label,action,other=false,disabled=false)=>'<button class="sheet-btn'+(other?" secondary":"")+'" data-do="'+h(action)+'"'+(disabled?" disabled":"")+'>'+h(label)+'</button>';
  const block=(title,txt)=>'<div class="sheet-block"><h3>'+h(title)+'</h3><p>'+h(txt)+'</p></div>';
  const badge=(s,c="")=>'<span class="sheet-tag '+c+'">'+h(s)+'</span>';
  const actions=(str)=>'<div class="sheet-actions">'+str+'</div>';
  const section=(title,body)=>'<h2>'+h(title)+'</h2>'+body;
  let activeKind=null, previousFocused=null;

  function getCurrent(){
    return progress===0?"1-1":progress===1?"1-2":progress===2?"1-3":"2-1";
  }
  function status(id) {
    const i=order.indexOf(id);
    return i<progress?"done":i===progress?"current":"locked";
  }
  function updateMap(){
    const id=getCurrent();
    const cur=levels[id];
    dockTitle.textContent=id+" · "+cur.title;
    dockSubtitle.textContent=cur.short;
    for (const el of root.querySelectorAll(".stage-node")) {
      const level=el.dataset.level;
      const st=status(level);
      el.classList.toggle("stage-node-done",st==="done");
      el.classList.toggle("stage-node-current",st==="current");
      el.classList.toggle("stage-node-locked",st==="locked");
      el.classList.toggle("stage-node-boss",level==="1-3"&&st==="locked");
      el.setAttribute("aria-label",level+" · "+levels[level].title+" · "+(st==="done"?"пройден":st==="current"?"текущий":"закрыт"));
      const medal=el.querySelector(".stage-medal");
      if (st==="done" && medal) medal.innerHTML="✓";
      if (st==="locked" && medal) medal.textContent="🔒";
      if (st==="current" && medal) medal.innerHTML='<svg viewBox="0 0 52 52" aria-hidden="true"><path d="M10 39L41 12M14 13l27 28" stroke="#47334c" stroke-width="6" stroke-linecap="round"/><path d="M10 39L41 12M14 13l27 28" stroke="#fff9d5" stroke-width="2" stroke-linecap="round"/></svg>';
      let star=el.querySelector(".stage-rays");
      if (st==="current" && !star){star=document.createElement("span");star.className="stage-rays";star.textContent="✦";star.setAttribute("aria-hidden","true");el.prepend(star)}
      if (st!=="current" && star)star.remove();
    }
    document.querySelector(".zone-title-two .zone-lock").textContent=progress===3?"✓ Открыта":"🔒 Закрыта";
    document.querySelector(".zone-title-one .last").textContent=progress===3?"ЗОНА ПРОЙДЕНА":"ПРОЙДЕНО "+Math.min(progress,3)+"/3";
    save();
  }
  function positionMapItems() {
    for(const element of world.querySelectorAll("[data-x][data-y]")){
      element.style.left=(Number(element.dataset.x)/BASE*100)+"%";
      element.style.top=(Number(element.dataset.y)/HEIGHT*100)+"%";
    }
  }
  function nodeMidY(id=getCurrent()){
    const el=[...world.querySelectorAll(".stage-node")].find(x=>x.dataset.level===id);
    return el ? Number(el.dataset.y)/HEIGHT*world.clientHeight : 0;
  }
  function focusCurrent(smooth=true){
    const target=nodeMidY();
    const offset=target-mapScroll.clientHeight*.48;
    mapScroll.scrollTo({top:Math.max(0,offset),behavior:smooth&&!reducedMotion?"smooth":"instant"});
  }
  function updateJump(){
    const current=nodeMidY();
    const middle=mapScroll.scrollTop+mapScroll.clientHeight*.5;
    jumpButton.classList.toggle("visible",Math.abs(current-middle)>mapScroll.clientHeight*.34);
  }
  function open(kind, inner, label){
    activeKind=kind;
    previousFocused=document.activeElement;
    tag.textContent=label||"ПРИКЛЮЧЕНИЕ";
    content.innerHTML=inner;
    shade.hidden=false;
    close.focus();
  }
  function closeSheet(){
    activeKind=null;
    shade.hidden=true;
    if(previousFocused?.isConnected)previousFocused.focus();
  }
  function openStage(id){
    const data=levels[id];
    if(!data)return;
    const st=status(id);
    const isBoss=id==="1-3";
    const text=badge(st==="current"?"ТЕКУЩИЙ УРОВЕНЬ":st==="done"?"ПРОЙДЕНО":"ЗАКРЫТО",st==="locked"?"locked":"")+
      section(id+" · "+data.title,
        '<p>'+h(data.story)+'</p>'+
        block("Основная задача",data.objective)+
        block("Сюжетный NPC",data.npc)+
        '<p class="mini">'+h(data.rewards)+'</p>'+
        (st==="locked"?'<p class="note">Откроется после завершения предыдущего сюжетного этапа. Дополнительные звёзды не нужны.</p>':
          '<p class="note">При поражении прогресс основной цели сбрасывается, но ранее пройденные этапы сохраняются.</p>')+
        actions(btn(st==="done"?"↻ Повторить":isBoss?"⚔ К боссу":"▶ В бой!", "brief:"+id,false,st==="locked")+btn("На карту","close",true))
      );
    open("stage:"+id,text,"СЮЖЕТНЫЙ ЭТАП");
  }
  function openBrief(id=getCurrent()){
    const l=levels[id]||levels[getCurrent()];
    open("brief:"+id,
      badge("БРИФИНГ NPC")+
      section(l.npc,'<p>«'+h(id==="1-1"?"Камни перекрыли тропу. Разбей завалы, и путь снова будет открыт!":id==="1-2"?"Все мои камни разлетелись! Помоги собрать хотя бы пять.":id==="1-3"?"Будь осторожен: страж ворот не отступит без боя.":"Впереди новая история.")+'»</p>'+
      block("Задача",l.objective)+
      '<p class="note">Это отдельный UX-прототип карты, не игровая симуляция. Для демонстрации боя открой UX-flow или действующий v2.</p>'+
      actions(btn("Открыть UX-flow боя","ux-run")+btn("Боевая версия v2","game-v2",true))+
      '<p class="note"><a href="../" style="color:#72518b">Главная карта UX-flow v3 ↗</a></p>'
    ),"ДО НАЧАЛА ЗАБЕГА");
  }
  function openNpc(){
    open("npc",badge("ПОБОЧНОЕ ПОРУЧЕНИЕ")+
      section("Каменный тролль",
        '<p>«Ой, снова гоблины! Может, устроишь несколько хороших столкновений? Хочу посмотреть!»</p>'+
        block("Пример поручения","Создай десять столкновений противников в нескольких попытках.")+
        '<p class="mini">Прогресс: <strong>'+questCount+'/10</strong> · накопительный счётчик</p>'+
        '<div class="progress-track"><i style="width:'+(questCount*10)+'%"></i></div>'+
        '<p class="note">Дополнительные поручения не обязательны для кампании. Награды и условия приведены как пример.</p>'+
        actions(btn("Все задания","quests")+btn("На карту","close",true))
      ),"NPC / ПОБОЧНОЕ ЗАДАНИЕ");
  }
  function openQuests(){
    open("quests",badge("ЗАДАНИЯ")+
      section("Журнал приключений",
        block("Главное · "+getCurrent(),levels[getCurrent()].objective)+
        block("🪨 Поручение тролля","Столкновения врагов: "+questCount+"/10. Прогресс сохраняется между забегами.")+
        '<div class="progress-track"><i style="width:'+(questCount*10)+'%"></i></div>'+
        '<p class="note">Прогресс основной сюжетной задачи сбрасывается при поражении. Звёздные условия для открытия зон не нужны.</p>'+
        actions(btn("К поручению NPC","npc")+btn("На карту","close",true))
      ),"НИЖНЯЯ ВКЛАДКА");
  }
  function openArsenal(){
    open("arsenal",badge("КОНЦЕПТ / НЕ УТВЕРЖДЕНО","concept")+
      section("Арсенал",
        '<div class="sheet-block"><span class="placeholder-icon">✊</span><strong>Магические рукавицы</strong><p>Стартовое снаряжение героя. Магические руны, без современных боксёрских перчаток.</p></div>'+
        block("Кузница и Арсенал","Окончательное разделение функций, характеристик, перчаток и экономических улучшений пока не утверждено.")+
        '<p class="note">Пока это UX-макет доступности экипировки из нижней навигации, а не готовая система прокачки.</p>'+
        actions(btn("Карта","close")+btn("Задания","quests",true))
      ),"НИЖНЯЯ ВКЛАДКА");
  }
  function openResources(which){
    open(which, badge("КОНЦЕПТ / ЭКОНОМИКА","concept")+
      section(which==="coins"?"Монеты":"Магические кристаллы",
        '<p>Счётчик валюты в верхней панели нужен для UX-исследования. Приведённые значения — условные.</p>'+
        block("Открытый вопрос","Не утверждены способы заработка, цены, прогрессия, реальное назначение ресурсов и монетизация.")+
        actions(btn("Понятно","close"))
      ),"РЕСУРСЫ");
  }
  function openSettings(){
    open("settings",badge("НАСТРОЙКИ И ТЕСТ")+
      section("Настройки",
        '<div class="sheet-item"><span>Звук</span><button class="switch '+(sound?"on":"")+'" data-do="sound" aria-label="Переключить звук"></button></div>'+
        '<div class="sheet-item"><span>Уменьшить анимации</span><button class="switch '+(reducedMotion?"on":"")+'" data-do="motion" aria-label="Переключить уменьшение анимаций"></button></div>'+
        '<div class="sheet-block"><h3>Проверить состояния карты</h3><p>Эти переключатели меняют только демонстрационные данные страницы /map/, не сохранения боевой игры.</p></div>'+
        '<div class="sheet-list">'+
         ['0','1','2','3'].map(i=>'<button class="'+(Number(i)===progress?"current":"")+'" data-do="demo:'+i+'">'+(i==="0"?"Начать с 1-1":i==="1"?"1-1 пройден → 1-2 текущий":i==="2"?"1-2 пройден → открыт босс":"Босс пройден → зона 2")+'</button>').join("")+
        '</div>'+
        '<div class="sheet-item"><span>Поручение NPC: '+questCount+'/10</span><button class="sheet-btn secondary" data-do="quest-plus">+1</button></div>'+
        '<p class="note">Сохранение — на время текущей вкладки браузера. /map/ не изменяет UX-flow и не использует игровые данные v2.</p>'+
        actions(btn("Закрыть","close"))
      ),"НАСТРОЙКИ");
  }
  function doAction(a){
    if(a==="close"){closeSheet();return}
    if(a.startsWith("brief:")){openBrief(a.slice(6));return}
    if(a==="battle"){openStage(getCurrent());return}
    if(a==="ux-run"){location.href="../#run";return}
    if(a==="game-v2"){window.open("https://artem-chinkov.github.io/punchngo-v2/","_blank","noopener,noreferrer");return}
    if(a==="quests"){openQuests();return}
    if(a==="npc"){openNpc();return}
    if(a==="arsenal"){openArsenal();return}
    if(a==="settings"){openSettings();return}
    if(a==="sound"){sound=!sound;save();openSettings();return}
    if(a==="motion"){reducedMotion=!reducedMotion;document.body.classList.toggle("reduce-motion",reducedMotion);save();openSettings();return}
    if(a==="quest-plus"){questCount=safeInt(questCount+1,0,10);save();openSettings();return}
    if(a.startsWith("demo:")){progress=safeInt(Number(a.slice(5)),0,3);updateMap();openSettings();requestAnimationFrame(()=>focusCurrent(false));return}
  }
  root.addEventListener("click",event=>{
    const button=event.target.closest("button");
    if(!button)return;
    if(button.dataset.level){openStage(button.dataset.level);return}
    if(button.dataset.sheet){
      if(button.dataset.sheet==="npc")openNpc();
      else if(button.dataset.sheet==="quests")openQuests();
      else if(button.dataset.sheet==="arsenal")openArsenal();
      else if(button.dataset.sheet==="settings")openSettings();
      else openResources(button.dataset.sheet);
      return;
    }
    if(button.dataset.action==="focus"){focusCurrent();closeSheet();return}
    if(button.dataset.action==="battle"){openBrief();return}
    if(button.dataset.do){doAction(button.dataset.do);return}
  });
  close.addEventListener("click",closeSheet);
  shade.addEventListener("click",event=>{if(event.target===shade)closeSheet()});
  window.addEventListener("keydown",event=>{if(event.key==="Escape"&&!shade.hidden)closeSheet()});
  jumpButton.addEventListener("click",()=>focusCurrent());
  mapScroll.addEventListener("scroll",updateJump,{passive:true});
  window.addEventListener("resize",()=>{updateJump()},{passive:true});

  positionMapItems();
  updateMap();
  document.body.classList.toggle("reduce-motion",reducedMotion);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{focusCurrent(false);updateJump()}));
  if(QUERY.has("demo"))openSettings();
})();
