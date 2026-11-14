"use strict";
(() => {
  const $ = (s) => document.querySelector(s);
  const root = $("#game"), mapScroll = $("#mapScroll"), dialog = $("#sheetDialog"), sheetBody = $("#sheetBody");
  if (!root || !mapScroll || !dialog || !sheetBody) return;

  const KEY = "punchngo.v3.map2.demo.1";
  const WEAPONS = [
    {id:"gloves",name:"Магические перчатки",short:"Перчатки",icon:"🥊",detail:"Быстрые серии · супер-рывок · пружинный апперкот",from:0},
    {id:"sword",name:"Меч и щит",short:"Меч + щит",icon:"⚔️",detail:"Блок · парирование · щитовой натиск",from:4},
    {id:"staff",name:"Магический посох",short:"Посох",icon:"🪄",detail:"Дальняя магия · заряд · контроль полос",from:7},
    {id:"hammer",name:"Двуручный молот",short:"Молот",icon:"🔨",detail:"Мощный замах · удар о землю · отбрасывание",from:10}
  ];
  // Original illustrated weapon icons in the same outlined cartoon-fantasy language as the map.
  function weaponSvg(id){
    const o="#47344e",g="#ffd868";
    let shape="";
    if(id==="gloves")shape='<g stroke="'+o+'" stroke-width="4" stroke-linejoin="round"><path d="M14 72 10 43Q6 30 18 26L18 13Q20 5 28 12L33 20Q34 10 42 13L48 25Q54 19 60 26L61 49L54 77Z" fill="#e6a49b"/><path d="M14 57L57 57L55 79L17 79Z" fill="'+g+'"/><path d="M26 22V38M40 25V40" stroke="#f8d2c4"/><path d="M68 43Q68 23 81 28Q92 34 89 51L86 78H68Z" fill="#9e87c8"/><path d="M66 68H89V81H66Z" fill="'+g+'"/></g>';
    if(id==="sword")shape='<g stroke="'+o+'" stroke-width="4" stroke-linejoin="round"><path d="M10 12L23 7L64 58L56 67Z" fill="#b4bacf"/><path d="M17 13L60 63" stroke="#faf8eb" stroke-width="3"/><path d="M49 66L70 45" stroke="'+g+'" stroke-width="9" stroke-linecap="round"/><path d="M62 62L83 87" stroke="#ae8061" stroke-width="9"/><path d="M69 14L92 25L86 64L64 79L48 57L49 29Z" fill="#9bc4d1"/><path d="M62 31L79 31L76 62L62 65Z" fill="#f6ecd0" opacity=".7"/></g>';
    if(id==="staff")shape='<g stroke="'+o+'" stroke-width="4" stroke-linejoin="round"><path d="M25 93L71 16" stroke="#a47757" stroke-width="12" stroke-linecap="round"/><path d="M28 91L73 15" stroke="#e3b87c" stroke-width="4"/><path d="M51 17L65 5L83 13L90 30L71 49L54 43Z" fill="#997cc2"/><path d="M67 16L80 28L69 40L57 28Z" fill="#78e5e5"/><path d="M25 69L41 77" stroke="'+g+'" stroke-width="6"/></g>';
    if(id==="hammer")shape='<g stroke="'+o+'" stroke-width="4" stroke-linejoin="round"><path d="M26 93L72 20" stroke="#986749" stroke-width="12" stroke-linecap="round"/><path d="M30 88L75 18" stroke="#e8b976" stroke-width="4"/><path d="M17 19L66 6L91 40L54 63L29 46Z" fill="#bbb3c3"/><path d="M19 19L37 15L60 52L49 61Z" fill="#ede6ee"/><path d="M60 11L85 41" stroke="'+g+'" stroke-width="8"/></g>';
    return '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">'+shape+'</svg>';
  }
  const COLORS = ["red","blue","green"];
  const COLOR = {red:{label:"Красный",type:"Натиск",icon:"🔴"},blue:{label:"Синий",type:"Защита",icon:"🔵"},green:{label:"Зелёный",type:"Контроль",icon:"🟢"}};
  const STONES = {
    gloves:{red:{name:"Разгона",effect:"Удар во время тарана позволяет направленно выбить врага из цепочки.",next:"После успешного столкновения выбитого врага ускоряется восстановление тарана."},blue:{name:"Отпора",effect:"После своевременной контратаки герой получает короткое окно защитного манёвра.",next:"Следующий ручной удар после успешной контратаки выполняет защитное отбрасывание."},green:{name:"Вектора",effect:"Апперкот позволяет менять направление полёта подброшенной цели.",next:"Удачный боковой запуск открывает дополнительную направленную комбинацию."}},
    sword:{red:{name:"Рассечения",effect:"Боковой удар клинком подготавливает особый выпад.",next:"Успешная связка меча создаёт направленное дополнительное отбрасывание."},blue:{name:"Бастиона",effect:"Точный блок подготавливает отдельный щитовой толчок.",next:"Успешное парирование усиливает контроль противника без автоматической контратаки."},green:{name:"Манёвра",effect:"Щитовой толчок меняет направление отбрасывания.",next:"Удачный манёвр создаёт дополнительную возможность боковой комбинации."}},
    staff:{red:{name:"Эха",effect:"Заряженное попадание открывает возможность ручного повторного выстрела.",next:"Повторный выстрел можно направить в соседнюю полосу."},blue:{name:"Завесы",effect:"Подтверждённое заклинание создаёт краткую область защиты.",next:"После успешной защиты открывается короткое окно ответного заклинания."},green:{name:"Призмы",effect:"Позволяет изменить траекторию заряженного магического снаряда.",next:"При точном попадании доступно дополнительное управляемое преломление."}},
    hammer:{red:{name:"Разлома",effect:"Удар по земле запускает направленную трещину по текущей полосе.",next:"Последовательные подтверждённые попадания создают более интересную линию контроля."},blue:{name:"Опоры",effect:"Позволяет устойчивее выдерживать тяжёлый замах.",next:"После выдержанного замаха доступен защитный ответ молотом."},green:{name:"Отскока",effect:"Меняет траекторию отбитого врага для физических столкновений.",next:"Правильно направленный отскок открывает новую комбинацию столкновений."}}
  };
  const SKINS = [{id:"base",name:"Обычный",icon:"✨",cost:0},{id:"forest",name:"Лесной",icon:"🌿",cost:350},{id:"ember",name:"Огненный",icon:"🔥",cost:500}];
  const STAGES = [
    {id:"0-1",name:"За воротами крепости",goal:"Обучение ударам и управлению",x:230,y:4490,icon:"⚔"},
    {id:"1-1",name:"Каменный завал",goal:"Разбей четыре проклятых завала",x:113,y:4291,icon:"✦"},
    {id:"1-2",name:"Камни тролля",goal:"Собери пять магических камней",x:159,y:3992,icon:"◆"},
    {id:"1-3",name:"Логово Бульдога",goal:"Победи Бульдога и открой меч со щитом",x:253,y:3704,icon:"♜",boss:true},
    {id:"2-1",name:"Скользкий перевал",goal:"Сними замораживающие опоры",x:93,y:3153,icon:"✦"},
    {id:"2-2",name:"Эхо шахт",goal:"Отключи кристальные резонаторы",x:272,y:2820,icon:"◆"},
    {id:"2-3",name:"Кристальное сердце",goal:"Одолей Зеркального Стража и получи посох",x:161,y:2566,icon:"♜",boss:true},
    {id:"3-1",name:"Нижние ворота",goal:"Активируй магические маяки",x:257,y:2070,icon:"✦"},
    {id:"3-2",name:"Три ложных звона",goal:"Отключи питающие башню устройства",x:107,y:1770,icon:"◆"},
    {id:"3-3",name:"Чёрная звонница",goal:"Победи Звонаря и получи молот",x:240,y:1470,icon:"♜",boss:true},
    {id:"4-1",name:"Пепельная дорога",goal:"Пройди опасные преграды",x:96,y:1110,icon:"✦"},
    {id:"4-2",name:"Старая цитадель",goal:"Обезвредь механизмы цитадели",x:271,y:770,icon:"◆"},
    {id:"4-3",name:"Последний рубеж",goal:"Победи босса финальной зоны",x:170,y:440,icon:"♜",boss:true}
  ];
  const ZONES=[
    {title:"ЗОНА 1",name:"Лесные тропы",x:159,y:4155,cls:""},
    {title:"ЗОНА 2",name:"Ледяные вершины",x:206,y:3425,cls:"zone-title-two"},
    {title:"ЗОНА 3",name:"Земли звонницы",x:175,y:2200,cls:""},
    {title:"ЗОНА 4",name:"Пепельные рубежи",x:204,y:930,cls:"zone-title-two"}
  ];
  const DAYS = [
    {title:"День тарана",icon:"💥",rule:"Плотные группы врагов. Больше очков за реальные цепные столкновения.",objective:"Победи босса, используя ритм супер-рывка."},
    {title:"Боковой ветер",icon:"🍃",rule:"Быстрые враги чаще заранее обозначают смену полосы.",objective:"Победи босса; не теряй из виду фланги."},
    {title:"Охота за контратаками",icon:"🛡️",rule:"Противники чаще используют телеграфируемые опасные атаки.",objective:"Победи босса, набирая очки за ручные контратаки."},
    {title:"Разбитый строй",icon:"🪨",rule:"Диагональные построения создают больше шансов для столкновений.",objective:"Заверши забег и собери лучший результат."},
    {title:"Арена громил",icon:"🔨",rule:"Меньше мелких врагов, больше тяжёлых противников.",objective:"Победи босса в условиях медленного темпа."}
  ];

  const initial = () => ({
    progress:2, view:"map",weapon:"gloves",coins:1250,
    owned:{gloves:["red","blue"],sword:["red"],staff:["red"],hammer:["red"]},
    slots:{gloves:["red","blue"],sword:["red"],staff:["red"],hammer:["red"]},
    mastery:{}, awakened:{}, cosmetics:{}, skin:{gloves:"base",sword:"base",staff:"base",hammer:"base"},
    npcDone:{}, npcCount:2, dailyDayOffset:0,inviteDismissed:"", dailyDone:{}, dailyRecords:{},
    dailyWins:[], dailyAttempt:0, leaderboardOpen:false, taskFilter:"all", demoAll:false,
    completed:[], tutorialHintSeen:true
  });
  let state=initial();
  try{
    const loaded=JSON.parse(sessionStorage.getItem(KEY)||"null");
    if(loaded && typeof loaded==="object"){
      const defaults=initial();state={...defaults,...loaded,
        owned:{...defaults.owned,...loaded.owned},slots:{...defaults.slots,...loaded.slots},mastery:{...defaults.mastery,...loaded.mastery},
        awakened:{...defaults.awakened,...loaded.awakened},cosmetics:{...defaults.cosmetics,...loaded.cosmetics},
        skin:{...defaults.skin,...loaded.skin},npcDone:{...defaults.npcDone,...loaded.npcDone},
        dailyDone:{...defaults.dailyDone,...loaded.dailyDone},dailyRecords:{...defaults.dailyRecords,...loaded.dailyRecords}};
      state.progress=Math.max(0,Math.min(13,Number(state.progress)||0));
      if(!WEAPONS.some(x=>x.id===state.weapon))state.weapon="gloves";
    }
  }catch(e){state=initial();}
  const save = () => {try{sessionStorage.setItem(KEY,JSON.stringify(state));}catch(e){}};
  const esc = (v) => String(v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const stoneKey = (w,c)=>w+":"+c;
  const weapon = (id)=>WEAPONS.find(w=>w.id===id)||WEAPONS[0];
  const dateKey = () => new Date(Date.now()+state.dailyDayOffset*86400000).toISOString().slice(0,10);
  const daily = ()=>DAYS[(Math.floor(Date.parse(dateKey()+"T00:00:00Z")/86400000)%DAYS.length+DAYS.length)%DAYS.length];
  const isUnlocked=(w)=>state.demoAll || state.progress>=weapon(w).from;
  const owned = (w,c)=>state.demoAll || (state.owned[w]||[]).includes(c);
  const twoSlots = (w)=>state.slots[w]||[];
  const mastery = (w,c)=>Math.min(5,Number(state.mastery[stoneKey(w,c)])||0);
  const awakened = (w,c)=>!!state.awakened[stoneKey(w,c)];
  const ownSkin = (w,id)=>id==="base" || state.demoAll || !!state.cosmetics[w+":"+id];
  const dailyAvailable = ()=>state.demoAll||state.progress>=4;
  const firstDayWin = ()=>!!state.dailyDone[dateKey()];
  const pct=(v,total)=>Math.max(0,Math.min(100,Math.round(v/total*100)));
  const button=(action,label,cls="primary-btn",disabled=false,extra="")=>'<button class="'+cls+'" data-action="'+esc(action)+'" '+(disabled?"disabled":"")+extra+'>'+label+'</button>';
  const price=(n)=>'<span class="money">'+n.toLocaleString("ru-RU")+'</span>';
  const notice=(s)=>{
    const node=$("#toast");node.textContent=s;node.classList.add("visible");
    clearTimeout(notice.timer);notice.timer=setTimeout(()=>node.classList.remove("visible"),2500);
  };
  function runic(w,c){
    const s=STONES[w][c];return "Руна "+s.name;
  }
  function questBonus(){
    if(state.npcDone.forge)return true;return false;
  }
  function renderHeader(){
    const coin=$(".resource-coin span");if(coin)coin.textContent=state.coins.toLocaleString("ru-RU");
    const emblem=$(".hero-level");if(emblem)emblem.textContent=state.progress>=10?"4":state.progress>=7?"3":state.progress>=4?"2":"1";
    document.querySelectorAll(".bottom-tabs [data-view]").forEach(b=>{
      b.classList.toggle("selected",b.dataset.view===state.view);
      b.setAttribute("aria-current",b.dataset.view===state.view?"page":"false");
    });
  }
  function paintView(){
    ["hero","map","quests"].forEach(v=>{
      const el=$("#"+v+"View");if(el)el.hidden=state.view!==v;
    });
    renderHeader();
    if(state.view==="hero")renderHero();
    if(state.view==="map")renderMap();
    if(state.view==="quests")renderQuests();
  }
  function selectView(view){
    if(!["hero","map","quests"].includes(view))return;
    state.view=view;save();paintView();
    if(view==="map")requestAnimationFrame(()=>updateJump());
  }

  function renderHero(){
    const w=state.weapon,W=weapon(w),el=$("#heroScroll");
    const canEquip=isUnlocked(w);
    const slots=twoSlots(w);
    const options=WEAPONS.map(item=>'<button class="weapon-option '+(item.id===w?"is-selected ":"")+(isUnlocked(item.id)?"":"is-locked")+'" data-action="weapon:'+item.id+'" aria-label="'+esc(item.name)+'">'+(isUnlocked(item.id)?"":'<span class="lock-flag">🔒</span>')+'<span class="weapon-emoji">'+weaponSvg(item.id)+'</span>'+esc(item.short)+'</button>').join("");
    const slotCards=[0,1].map(i=>{
      const c=slots[i];return c?'<button class="stone-slot stone-'+c+'" data-action="stone:'+w+':'+c+'" aria-label="Свойства и огранка камня '+esc(STONES[w][c].name)+'"><span class="slot-label">ГНЕЗДО '+(i+1)+'</span><span class="big-gem">'+COLOR[c].icon+'</span><strong>'+esc(runic(w,c))+'</strong><p>'+esc(STONES[w][c].effect)+'</p><span class="slot-footer">'+(awakened(w,c)?"Пробуждён · II": "Мастерство "+mastery(w,c)+"/5 · I")+' ›</span></button>':
        '<button class="stone-slot" data-action="empty-slot:'+w+'" aria-label="Выбрать камень в пустой слот"><span class="slot-label">ГНЕЗДО '+(i+1)+'</span><span class="big-gem">◇</span><strong>Пусто</strong><p>Выбери камень из коллекции</p><span class="slot-footer">+ Установить</span></button>';
    }).join("");
    const tray=COLORS.map(c=>{
      const has=owned(w,c);const installed=slots.includes(c);
      return '<button class="tray-stone '+(installed?"active":"")+'" data-action="tray:'+w+':'+c+'" aria-label="'+esc(runic(w,c))+(has?"":" ещё не получена")+'"><span class="gem-mini">'+COLOR[c].icon+'</span><strong>'+esc(STONES[w][c].name)+'</strong><small>'+(has?(installed?"Установлена":"Заменить камень"):"🔒 Не получена")+'</small></button>';
    }).join("");
    const skins=SKINS.map(s=>'<button class="skin-option '+(state.skin[w]===s.id?"selected ":"")+(ownSkin(w,s.id)?"":"locked")+'" data-action="skin:'+w+':'+s.id+'"><span style="font-size:27px">'+s.icon+'</span><span>'+esc(s.name)+(ownSkin(w,s.id)?"":" 🔒")+'</span></button>').join("");
    el.innerHTML='<h1 class="screen-heading">Герой и оружие</h1><p class="sub-heading">Подготовка к следующему приключению</p>'+
      '<div class="weapon-row">'+options+'</div>'+
      '<section class="parchment-card weapon-showcase"><div class="weapon-stage"><span class="weapon-art">'+weaponSvg(w)+'</span></div>'+
      '<h2 class="weapon-title">'+esc(W.name)+'</h2><p class="weapon-desc">'+esc(W.detail)+'</p>'+
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:10px"><span class="status-chip '+(canEquip?"":"locked")+'">'+(canEquip?"✓ "+(w==="gloves"?"Начальное оружие":"Открыто"):"🔒 Открывается после босса "+(W.from===4?"1-3":W.from===7?"2-3":"3-3"))+'</span>'+button("equip:"+w,w===state.equipped||(!state.equipped&&w==="gloves")?"Выбрано ✓":"Выбрать","small-btn",!canEquip||state.equipped===w||(!state.equipped&&w==="gloves"))+'</div></section>'+
      '<div class="section-top"><h2>Камни оружия</h2><span class="hint">Установлено '+slots.length+'/2</span></div>'+
      '<div class="stone-slots">'+slotCards+'</div>'+
      '<div class="section-top"><h3>Коллекция</h3><span class="hint">3 уникальных камня</span></div>'+
      '<div class="stone-tray">'+tray+'</div>'+
      '<p class="hint-card">Тап по установленному камню открывает его свойства и огранку. В коллекции можно заменить камень в одном из двух гнёзд. Новые камни дают сюжет и NPC.</p>'+
      '<div class="section-top"><h2>Облики оружия</h2><span class="hint">Только внешний вид</span></div>'+
      '<div class="skin-list">'+skins+'</div>'+
      '<p class="hint-card">Монеты — постоянная игровая валюта для огранки и обликов. Камни не являются премиальной валютой. Все цены и свойства в этом прототипе условные.</p>';
  }
  function tilePos(x,y){return 'left:'+(x/390*100).toFixed(3)+'%;top:'+(y/4640*100).toFixed(3)+'%';}
  function renderMap(){
    const nodes=STAGES.map((s,i)=>{
      const current=i===state.progress && state.progress<13;
      const done=i<state.progress || (state.progress>=13);
      const locked=i>state.progress && !state.demoAll;
      const cls=(current?"is-current ":"")+(done?"is-done ":"")+(locked?"is-locked ":"")+(s.boss?"stage-node-boss ":"")+(i===0?"is-training":"");
      const ico=locked?"🔒":done?"✓":s.icon;
      return '<button class="stage-node '+cls+'" data-action="stage:'+i+'" style="'+tilePos(s.x,s.y)+'" aria-label="'+esc(s.id+" "+s.name)+(locked?" закрыт":"")+'"><span class="stage-medal">'+ico+'</span><span class="stage-ribbon">'+s.id+'</span><span class="stage-name">'+esc(s.name)+'</span></button>';
    }).join("");
    const zones=ZONES.map(z=>'<div class="zone-title map-zone-title '+z.cls+'" style="'+tilePos(z.x,z.y)+'"><span class="small">'+z.title+'</span><strong>'+z.name+'</strong><span class="small">3 СЮЖЕТНЫХ ЭТАПА</span></div>').join("");
    const npc=[
      {id:"brina",x:325,y:4200,label:"Каменщица Брина",need:2},
      {id:"rum",x:327,y:3880,label:"Тролль Рум",need:3},
      {id:"forge",x:61,y:3560,label:"Мастер Кузни",need:3},
      {id:"miner",x:315,y:2900,label:"Шахтёр Корн",need:5},
      {id:"scribe",x:325,y:1650,label:"Писарь Нел",need:8},
      {id:"mason",x:60,y:720,label:"Хранитель цитадели",need:11}
    ].map(n=>'<button class="npc-hit" data-action="npc:'+n.id+'" style="'+tilePos(n.x,n.y)+'" aria-label="'+esc(n.label)+'">'+(state.progress>=n.need||state.demoAll?"🧙":"🔒")+'</button>').join("");
    const available=dailyAvailable();
    const portal='<button class="daily-portal '+(available?"":"is-locked")+'" data-action="daily" style="'+tilePos(330,3560)+'" aria-label="Ежедневное испытание">'+(available?"⚡":"🔒")+'<span class="portal-label">Испытание дня</span></button>';
    $("#mapNodes").innerHTML=zones+nodes+npc+portal;
    const s=STAGES[Math.min(state.progress,12)];
    $("#currentStageTitle").textContent=state.progress>=13?"Кампания завершена!":s.id+" · "+s.name;
    $("#currentStageSubtitle").textContent=state.progress>=13?"Повтори этапы и испытания":s.goal;
    const dock=$("#battleDock").querySelector("[data-action='current-stage']");
    dock.textContent=state.progress>=13?"ПОВТОР":"В БОЙ!";
    renderInvite();
    updateJump();
  }
  function renderInvite(){
    const el=$("#dailyInvite"),key=dateKey();
    if(!dailyAvailable() || state.inviteDismissed===key || firstDayWin()){el.hidden=true;el.innerHTML="";return;}
    const d=daily();el.hidden=false;
    el.innerHTML='<div class="invite-panel"><span class="invite-art">'+d.icon+'</span><div class="invite-info"><strong>Испытание дня</strong><small>'+esc(d.title)+' · новая миссия</small></div><button class="invite-go" data-action="daily">Открыть</button><button class="invite-x" data-action="dismiss-daily" aria-label="Закрыть приглашение до завтра">✕</button></div>';
  }
  function updateJump(){
    if(state.view!=="map")return;
    const s=STAGES[Math.min(state.progress,12)];
    const pos=$("#world").clientHeight*s.y/4640;
    const mid=mapScroll.scrollTop+mapScroll.clientHeight/2;
    $("#jumpCurrent").classList.toggle("visible",Math.abs(pos-mid)>mapScroll.clientHeight*.5);
  }
  function focusCurrent(smooth=true){
    const s=STAGES[Math.min(state.progress,12)];
    const pos=$("#world").clientHeight*s.y/4640-mapScroll.clientHeight*.53;
    mapScroll.scrollTo({top:Math.max(0,pos),behavior:smooth&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches?"smooth":"instant"});
  }
  function renderQuests(){
    const all=[
      {filter:"story",icon:"📜",title:"Основной сюжет",text:state.progress>=13?"Все 12 этапов завершены":STAGES[Math.min(state.progress,12)].id+" · "+STAGES[Math.min(state.progress,12)].goal,bottom:"Следующая награда: "+(state.progress<4?"меч и щит":state.progress<7?"посох":state.progress<10?"молот":"завершение кампании"),action:"current-stage"},
      {filter:"npc",icon:"🧙",title:"Каменщица Брина",text:"Попросила найти инструменты на старой дороге.",bottom:state.npcDone.brina?"✓ Поручение выполнено":"Награда: Синяя руна перчаток",action:"npc:brina"},
      {filter:"npc",icon:"🪨",title:"Тролль Рум",text:"Выполни три настоящих столкновения врагов.",bottom:state.npcDone.rum?"✓ Зелёный камень получен":"Прогресс: "+Math.min(3,state.npcCount)+"/3 · Награда: Руна Вектора",action:"npc:rum"},
      {filter:"npc",icon:"🔨",title:"Мастер Кузни",text:"Разблокировка второго гнезда для оружия.",bottom:state.npcDone.forge?"✓ Второе гнездо доступно":"Условное поручение мастера",action:"npc:forge"},
      {filter:"mastery",icon:"💎",title:"Мастерство камней",text:"Развивай установленные камни через реальные столкновения и контратаки.",bottom:"Активно: "+twoSlots(state.equipped||"gloves").map(c=>runic(state.equipped||"gloves",c)+" "+mastery(state.equipped||"gloves",c)+"/5").join(" · "),action:"go-hero"},
      {filter:"daily",icon:"⚡",title:"Испытание дня",text:dailyAvailable()?daily().title+" · "+daily().objective:"Открывается после победы над 1-3.",bottom:"Накопленные победы: "+state.dailyWins.length+" · следующая косметика за "+([3,7,15,30].find(n=>n>state.dailyWins.length)||30),action:"daily"},
      {filter:"daily",icon:"🏆",title:"Коллекционные достижения",text:"Побеждай в ежедневных испытаниях. Пропущенные дни не сбрасывают прогресс.",bottom:"Пороги косметики: 3 / 7 / 15 / 30 побед",action:"daily"}
    ];
    const filters=[["all","Все"],["story","Сюжет"],["npc","NPC"],["mastery","Камни"],["daily","Ежедневные"]];
    const boxes=all.filter(x=>state.taskFilter==="all"||x.filter===state.taskFilter).map(q=>'<article class="task-row"><span class="task-emoji">'+q.icon+'</span><div class="task-body"><h3>'+esc(q.title)+'</h3><p>'+esc(q.text)+'</p><div class="task-bottom">'+esc(q.bottom)+'</div><div style="margin-top:8px">'+button(q.action,"Подробнее ›","small-btn")+'</div></div></article>').join("");
    $("#questScroll").innerHTML='<h1 class="screen-heading">Журнал заданий</h1><p class="sub-heading">Сюжет, поручения, мастерство и испытания</p>'+
      '<div class="quest-filter">'+filters.map(f=>button("filter:"+f[0],f[1],state.taskFilter===f[0]?"small-btn":"subtle-btn")).join("")+'</div>'+boxes+
      '<div class="hint-card">Основные этапы открываются по сюжету. NPC-поручения необязательны, а постоянное мастерство камней сохраняется между попытками. Данные демонстрационные.</div>';
  }

  function showSheet(label,body,title){
    $("#sheetLabel").textContent=label;sheetBody.innerHTML=body;
    if(title)dialog.setAttribute("aria-label",title);
    if(!dialog.open)dialog.showModal();
    root.classList.add("modal-open");
    dialog.scrollTop=0;
  }
  function closeSheet(){
    if(dialog.open)dialog.close();
    root.classList.remove("modal-open");
  }
  function stoneSheet(w,c){
    const stone=STONES[w][c],m=mastery(w,c),done=awakened(w,c),has=owned(w,c);
    const fullName=runic(w,c);
    let content='<h2 id="sheetTitle">'+esc(fullName)+'</h2><span class="mini-tag">'+COLOR[c].type+' · '+COLOR[c].label+' камень</span>'+
      '<div class="dialog-art">'+COLOR[c].icon+'</div>'+
      '<div class="dialog-panel"><h3>Текущий эффект · '+(done?"II":"I")+' ступень</h3><p>'+esc(stone.effect)+'</p></div>'+
      '<div class="dialog-panel good"><h3>'+(done?"✓ Пробуждение завершено":"Следующий эффект · II ступень")+'</h3><p>'+esc(stone.next)+'</p></div>'+
      '<div class="dialog-panel"><div class="row"><h3>Испытание мастерства</h3><strong>'+m+'/5</strong></div><div class="progress-track"><i style="width:'+pct(m,5)+'%"></i></div><p>'+ (done?"Камень уже пробуждён.": "Выполни 5 подходящих боевых действий с установленным камнем. Прогресс сохраняется между попытками.") +'</p></div>'+
      '<div class="dialog-panel"><div class="row"><h3>Стоимость огранки</h3>'+price(200)+'</div><p>'+(done?"Никаких дальнейших покупок пока нет.":m<5?"Огранка станет доступна после выполнения испытания.":state.coins<200?"Не хватает монет. Заработай их в заданиях.":"Условие выполнено, можно пробудить камень.")+'</p></div>'+
      '<div class="action-row">'+button("close-sheet","Назад","subtle-btn")+
      button("forge:"+w+":"+c,done?"Пробуждён ✓":"Огранить · 200", "primary-btn",done||!has||m<5||state.coins<200)+'</div>';
    if(!has)content='<h2 id="sheetTitle">'+esc(fullName)+'</h2><div class="dialog-art">'+COLOR[c].icon+'</div><div class="dialog-panel"><h3>Камень ещё не получен</h3><p>Ищи новые камни в сюжетных наградах и поручениях NPC.</p></div>'+button("close-sheet","Понятно");
    showSheet("КУЗНИЦА · ОГРАНКА КАМНЯ",content,fullName);
  }
  function traySheet(w,c){
    if(!owned(w,c)){stoneSheet(w,c);return;}
    const slots=twoSlots(w),installed=slots.includes(c),s=STONES[w][c];
    const content='<h2 id="sheetTitle">'+runic(w,c)+'</h2><div class="dialog-art">'+COLOR[c].icon+'</div>'+
      '<div class="dialog-panel"><h3>Эффект</h3><p>'+esc(s.effect)+'</p></div>'+
      '<div class="dialog-panel"><h3>Гнёзда оружия</h3><p>'+(installed?"Этот камень уже установлен в сборку.":"В MVP одновременно можно использовать только 2 из 3. Выбери гнездо, которое хочешь заменить.")+'</p></div>'+
      (installed?button("stone:"+w+":"+c,"Свойства и огранка","primary-btn"):
      '<div class="action-row">'+button("install:"+w+":"+c+":0","В гнездо 1","subtle-btn")+button("install:"+w+":"+c+":1","В гнездо 2","primary-btn")+'</div>');
    showSheet("ГЕРОЙ · КАМНИ ОРУЖИЯ",content,runic(w,c));
  }
  function stageSheet(i){
    const s=STAGES[i];
    if(i>state.progress && !state.demoAll){notice("Сначала пройди предыдущий сюжетный этап");return;}
    const done=i<state.progress || state.progress===13;
    const content='<h2 id="sheetTitle">'+s.id+' · '+esc(s.name)+'</h2>'+
      '<div class="dialog-art">'+(s.boss?"👹":i===0?"🥊":"⚔️")+'</div>'+
      '<span class="mini-tag '+(done?"ok":"")+'">'+(done?"✓ Этап пройден":"СЮЖЕТНЫЙ ЭТАП")+'</span>'+
      '<div class="dialog-panel"><h3>Цель</h3><p>'+esc(s.goal)+'</p></div>'+
      '<div class="dialog-panel"><h3>Награды</h3><p>Монеты за победу. '+(i===3?"Новое оружие: меч и щит.":i===6?"Новое оружие: посох.":i===9?"Новое оружие: молот.":i===1?"Первая руна перчаток.":"Побочные поручения могут появляться после уровня.")+'</p></div>'+
      '<p class="debug-note">Прототип интерфейса не содержит реального боя: победа/поражение ниже симулируется для проверки переходов, наград и карты.</p>'+
      '<div class="action-row">'+button("stage-loss:"+i,"Демо: поражение","subtle-btn")+button("stage-win:"+i,"Демо: победа","primary-btn")+'</div>'+
      '<div style="margin-top:10px">'+button("external-battle","Боевой прототип v2 ↗","subtle-btn")+'</div>';
    showSheet("КАРТА · СЮЖЕТНАЯ МИССИЯ",content,s.name);
  }
  function npcSheet(id){
    const npc={
      brina:{name:"Каменщица Брина",icon:"🛠️",text:"Инструменты пропали среди старых завалов. Помоги вернуть их.",reward:"Руна Отпора для перчаток",min:2},
      rum:{name:"Тролль Рум",icon:"🪨",text:"Покажи, что умеешь сталкивать противников. Нужно три настоящих столкновения.",reward:"Руна Вектора для перчаток",min:3},
      forge:{name:"Мастер Кузни",icon:"🔨",text:"Помоги открыть второе гнездо в оружии. В этом UX-демо два гнезда уже доступны для теста.",reward:"Обучение огранке и 150 монет",min:3},
      miner:{name:"Шахтёр Корн",icon:"⛏️",text:"Кристаллические резонаторы нарушают работу шахты.",reward:"Монеты и камень для меча",min:5},
      scribe:{name:"Писарь Нел",icon:"📜",text:"Найди магические записи в третьей зоне.",reward:"Косметика и дополнительные монеты",min:8},
      mason:{name:"Хранитель цитадели",icon:"🏰",text:"Отыщи потерянную печать цитадели.",reward:"Косметический облик и монеты",min:11}
    }[id];
    if(!npc)return;
    if(state.progress<npc.min&&!state.demoAll){notice("Этот персонаж появится после прохождения следующих уровней");return;}
    const completed=!!state.npcDone[id];
    const requirement=id==="rum" && state.npcCount<3;
    const content='<h2 id="sheetTitle">'+npc.icon+' '+npc.name+'</h2>'+
      '<div class="dialog-panel"><h3>Поручение</h3><p>'+npc.text+'</p></div>'+
      '<div class="dialog-panel good"><h3>Награда</h3><p>'+npc.reward+'</p></div>'+
      (id==="rum"?'<div class="dialog-panel"><div class="row"><span>Цепные столкновения</span><strong>'+Math.min(3,state.npcCount)+'/3</strong></div><div class="progress-track"><i style="width:'+pct(state.npcCount,3)+'%"></i></div></div>':"")+
      '<p class="debug-note">Действие ниже имитирует выполнение поручения. В игре понадобится отдельная механика отслеживания событий.</p>'+
      '<div class="action-row">'+button("close-sheet","Закрыть","subtle-btn")+
      button("npc-claim:"+id,completed?"Получено ✓":requirement?"Нужно 3/3":"Получить награду","primary-btn",completed||requirement)+'</div>';
    showSheet("NPC · ПОБОЧНОЕ ПОРУЧЕНИЕ",content,npc.name);
  }
  function dailySheet(){
    if(!dailyAvailable()){notice("Арена откроется после победы над 1-3");return;}
    const d=daily(),win=firstDayWin(),records=state.dailyRecords[dateKey()],wins=state.dailyWins.length;
    const threshold=[3,7,15,30].find(n=>n>wins);
    const leaders=[
      {name:"MoonKnight",score:52850},{name:"RunicFox",score:51120},{name:"StoneDash",score:49560}
    ];
    const table=state.leaderboardOpen?'<div class="leaderboard">'+leaders.map((v,i)=>'<div class="leader-row"><span>#'+(i+1)+'</span><span>'+v.name+'</span><span>'+v.score.toLocaleString("ru-RU")+'</span></div>').join("")+
      (records?'<div class="leader-row self"><span>—</span><span>Вы (демо)</span><span>'+records.toLocaleString("ru-RU")+'</span></div>':"")+'</div>':"";
    const content='<h2 id="sheetTitle">'+d.icon+' '+esc(d.title)+'</h2>'+
      '<span class="mini-tag">ИСПЫТАНИЕ ДНЯ · '+dateKey()+'</span>'+
      '<div class="dialog-panel"><h3>Правила сегодня</h3><p>'+esc(d.rule)+'</p><p>'+esc(d.objective)+'</p></div>'+
      '<div class="dialog-panel good"><h3>Награды</h3><p>🟡 '+(win?"Награда за первую победу получена":"150 монет за первую победу дня")+'</p><p>💎 Прогресс мастерства установленных камней</p><p>🎨 Новые облики за 3 / 7 / 15 / 30 суммарных побед</p></div>'+
      '<div class="dialog-panel blue"><div class="row"><h3>Личный рекорд</h3><strong>'+(records?records.toLocaleString("ru-RU"):"—")+'</strong></div>'+
      '<p>'+(records?"Можно повторить испытание и улучшить результат.":"Ещё нет результатов за сегодня.")+'</p>'+
      '<div class="row"><span class="mini-label">Накопительные победы</span><strong>'+wins+(threshold?"/"+threshold:"")+'</strong></div>'+
      '<div class="progress-track"><i style="width:'+pct(wins,threshold||30)+'%"></i></div>'+
      '<p>'+(threshold?"Следующая косметическая награда — за "+threshold+" побед.":"Первые коллекционные награды получены.")+'</p></div>'+
      '<div class="dialog-panel"><div class="row"><div><h3>Мировой рейтинг</h3><p>Демонстрационные результаты, не реальные игроки</p></div>'+
      button("toggle-leader",state.leaderboardOpen?"Свернуть ▲":"Показать ▼","small-btn")+'</div>'+table+'</div>'+
      '<p class="debug-note">В этой версии нет сервера или реального боя. Кнопки ниже имитируют исход ежедневной миссии, чтобы проверить экономику и UX.</p>'+
      '<div class="action-row">'+button("daily-loss","Демо: поражение","subtle-btn")+button("daily-win","Демо: победа","primary-btn")+'</div>';
    showSheet("АРЕНА · ЕЖЕДНЕВНОЕ ИСПЫТАНИЕ",content,d.title);
  }
  function settingsSheet(){
    const states=[["0","До обучения"],["2","Текущий 1-2"],["4","После босса 1-3"],["7","После босса 2-3"],["10","После босса 3-3"],["13","Кампания завершена"]];
    const content='<h2 id="sheetTitle">Деморежим UX</h2><p>Переключай состояния, чтобы проверить интерфейс без 12 реальных забегов. Изменения сохраняются только в текущей вкладке браузера.</p>'+
      '<div class="dialog-panel"><h3>Прогресс кампании</h3><div class="sheet-list">'+states.map(s=>'<button class="'+(Number(s[0])===state.progress?"current":"")+'" data-action="demo-progress:'+s[0]+'">'+s[1]+'</button>').join("")+'</div></div>'+
      '<div class="dialog-panel"><h3>Коллекция и экономика</h3><p>Показать все оружия, камни и косметику для проверки макета.</p>'+
      button("demo-all",state.demoAll?"Отключить все разблокировки":"Показать все разблокировки","small-btn")+
      '<div style="height:8px"></div>'+button("demo-mastery","Мастерство всех камней: 5/5","small-btn")+
      '<div style="height:8px"></div>'+button("demo-coins","Добавить 500 монет","small-btn")+
      '<div style="height:8px"></div>'+button("demo-npc","+1 столкновение для поручения","small-btn")+'</div>'+
      '<div class="dialog-panel"><h3>Ежедневная арена</h3><p>Игровой день: '+dateKey()+'. Смена демонстрационного дня покажет новую миссию, возвращает приглашение и позволяет накопить несколько побед.</p>'+button("demo-next-day","Перейти к следующему дню","small-btn")+'</div>'+
      '<div class="dialog-panel"><h3>Сброс UX-данных</h3><p>Вернуть прототип в исходное состояние без воздействия на старый /map/ и боевую игру.</p>'+button("demo-reset","Сбросить текущий прототип","subtle-btn")+'</div>';
    showSheet("НАСТРОЙКИ · ДЕМОПРОГРЕСС",content,"Деморежим");
  }
  function coinSheet(){
    showSheet("ЭКОНОМИКА · МОНЕТЫ",'<h2 id="sheetTitle">Монеты</h2><div class="dialog-art">🪙</div><div class="dialog-panel"><h3>Баланс: '+state.coins.toLocaleString("ru-RU")+'</h3><p>Монеты зарабатываются за прохождение уровней, поручения NPC и первую ежедневную победу. Их можно тратить на огранку и облики.</p></div><p>В MVP нет премиальной валюты и покупки монет за реальные деньги. Все числа демонстрационные.</p>'+button("close-sheet","Понятно"),"Монеты");
  }
  function skinSheet(w,id){
    const s=SKINS.find(x=>x.id===id);
    if(!s)return;
    const own=ownSkin(w,id);
    const content='<h2 id="sheetTitle">'+esc(s.name)+' облик</h2><div class="dialog-art">'+s.icon+' '+weapon(w).icon+'</div>'+
      '<div class="dialog-panel"><h3>'+esc(weapon(w).name)+'</h3><p>Этот облик изменяет только оформление оружия, но не его урон или свойства камней.</p></div>'+
      (own?'<p>Облик доступен и может быть выбран бесплатно.</p>':
      '<div class="dialog-panel"><div class="row"><h3>Цена</h3>'+price(s.cost)+'</div><p>Покупка за игровые монеты — демонстрация. В настоящем MVP условия получения будут сбалансированы.</p></div>')+
      '<div class="action-row">'+button("close-sheet","Назад","subtle-btn")+
      button(own?"skin-equip:"+w+":"+id:"skin-buy:"+w+":"+id,own?"Выбрать облик":"Получить · "+s.cost,"primary-btn",!own&&state.coins<s.cost)+'</div>';
    showSheet("ГЕРОЙ · ОБЛИКИ",content,s.name+" облик");
  }

  function incrementMastery(){
    const w=state.equipped||"gloves";
    for(const c of twoSlots(w)){
      const k=stoneKey(w,c);
      state.mastery[k]=Math.min(5,(state.mastery[k]||0)+1);
    }
  }
  function stageWin(i){
    if(i>state.progress && !state.demoAll)return;
    if(i===state.progress)state.progress=Math.min(13,state.progress+1);
    state.coins+=i===0?0:100;
    if(i===2)state.npcCount=Math.min(3,state.npcCount+1);
    incrementMastery();
    if(i===3||i===6||i===9){const w=i===3?"sword":i===6?"staff":"hammer";state.owned[w]=["red"];}
    save();closeSheet();paintView();
    notice(i===0?"Обучение завершено · карта открыта":"Демо: победа! +100 монет");
    if(state.view==="map")requestAnimationFrame(()=>focusCurrent(true));
  }
  function dailyWin(){
    const key=dateKey(),first=!firstDayWin();
    if(first){state.coins+=150;state.dailyDone[key]=true;state.dailyWins=[...new Set([...state.dailyWins,key])];}
    state.dailyAttempt=(state.dailyAttempt||0)+1;
    const score=26000+state.dailyAttempt*850+(state.progress*220)+(state.dailyWins.length*165);
    state.dailyRecords[key]=Math.max(state.dailyRecords[key]||0,score);
    incrementMastery();state.npcCount=Math.min(3,state.npcCount+1);
    for(const milestone of [3,7,15,30]){
      if(state.dailyWins.length>=milestone){state.cosmetics["gloves:"+ (milestone===3?"forest":"ember")]=true;}
    }
    save();renderMap();renderHeader();dailySheet();
    notice(first?"Демо: первая победа +150 монет!":"Рекорд обновлён, награда дня уже получена");
  }
  function handle(action){
    if(!action)return;
    const p=action.split(":"),kind=p[0];
    if(kind==="close-sheet"){closeSheet();return;}
    if(kind==="coins"){coinSheet();return;}
    if(kind==="settings"){settingsSheet();return;}
    if(kind==="weapon"){state.weapon=p[1];save();renderHero();return;}
    if(kind==="equip"){
      if(!isUnlocked(p[1]))return;
      state.equipped=p[1];save();renderHero();notice("Выбрано: "+weapon(p[1]).name);return;
    }
    if(kind==="stone"){stoneSheet(p[1],p[2]);return;}
    if(kind==="tray"){traySheet(p[1],p[2]);return;}
    if(kind==="empty-slot"){notice("Выбери камень в коллекции ниже");return;}
    if(kind==="install"){
      const [w,c,index]=[p[1],p[2],Number(p[3])];
      if(!owned(w,c)||index<0||index>1)return;
      const arr=twoSlots(w).slice(),other=arr.indexOf(c);
      if(other!==-1)arr.splice(other,1);
      if(index>=arr.length)arr.push(c);else arr[index]=c;
      state.slots[w]=[...new Set(arr)].slice(0,2);save();closeSheet();renderHero();notice("Камень установлен в сборку");return;
    }
    if(kind==="forge"){
      const [w,c]=[p[1],p[2]],key=stoneKey(w,c);
      if(state.coins<200||mastery(w,c)<5||awakened(w,c)||!owned(w,c))return;
      state.coins-=200;state.awakened[key]=true;save();renderHeader();if(state.view==="hero")renderHero();stoneSheet(w,c);notice("Камень пробуждён!");return;
    }
    if(kind==="skin"){skinSheet(p[1],p[2]);return;}
    if(kind==="skin-buy"){
      const [w,id]=[p[1],p[2]],s=SKINS.find(x=>x.id===id);
      if(!s||state.coins<s.cost)return;
      state.coins-=s.cost;state.cosmetics[w+":"+id]=true;state.skin[w]=id;save();renderHeader();renderHero();skinSheet(w,id);notice("Облик получен");return;
    }
    if(kind==="skin-equip"){state.skin[p[1]]=p[2];save();renderHero();skinSheet(p[1],p[2]);notice("Облик выбран");return;}
    if(kind==="stage"){stageSheet(Number(p[1]));return;}
    if(kind==="current-stage"){stageSheet(Math.min(12,state.progress));return;}
    if(kind==="stage-win"){stageWin(Number(p[1]));return;}
    if(kind==="stage-loss"){closeSheet();notice("Демо: поражение. Сюжетный прогресс сохранён.");return;}
    if(kind==="npc"){npcSheet(p[1]);return;}
    if(kind==="npc-claim"){
      const id=p[1];if(state.npcDone[id]||(id==="rum"&&state.npcCount<3))return;
      state.npcDone[id]=true;
      if(id==="brina"&&!state.owned.gloves.includes("blue"))state.owned.gloves.push("blue");
      if(id==="rum"&&!state.owned.gloves.includes("green"))state.owned.gloves.push("green");
      if(id==="forge")state.coins+=150;
      if(id==="miner"){state.coins+=100;state.owned.sword=[...new Set([...state.owned.sword,"blue"])];}
      if(id==="scribe"){state.coins+=120;state.cosmetics["staff:forest"]=true;}
      if(id==="mason"){state.coins+=120;state.cosmetics["hammer:forest"]=true;}
      save();closeSheet();paintView();notice("Награда NPC получена");return;
    }
    if(kind==="daily"){dailySheet();return;}
    if(kind==="dismiss-daily"){state.inviteDismissed=dateKey();save();renderInvite();notice("Приглашение скрыто до следующего дня");return;}
    if(kind==="toggle-leader"){state.leaderboardOpen=!state.leaderboardOpen;save();dailySheet();return;}
    if(kind==="daily-win"){dailyWin();return;}
    if(kind==="daily-loss"){closeSheet();notice("Демо: поражение. Миссию можно повторить.");return;}
    if(kind==="filter"){state.taskFilter=p[1];save();renderQuests();return;}
    if(kind==="go-hero"){closeSheet();selectView("hero");return;}
    if(kind==="demo-progress"){state.progress=Number(p[1]);save();closeSheet();paintView();requestAnimationFrame(()=>focusCurrent(false));notice("Демопрогресс обновлён");return;}
    if(kind==="demo-all"){state.demoAll=!state.demoAll;save();closeSheet();paintView();notice("Доступность предметов переключена");return;}
    if(kind==="demo-mastery"){
      for(const w of WEAPONS)for(const c of COLORS)state.mastery[stoneKey(w.id,c)]=5;
      save();settingsSheet();notice("Мастерство всех камней: 5/5");return;
    }
    if(kind==="demo-coins"){state.coins+=500;save();renderHeader();settingsSheet();notice("+500 условных монет");return;}
    if(kind==="demo-npc"){state.npcCount=Math.min(3,state.npcCount+1);save();settingsSheet();notice("Счётчик столкновений увеличен");return;}
    if(kind==="demo-next-day"){state.dailyDayOffset++;state.leaderboardOpen=false;save();closeSheet();paintView();notice("Новый игровой день · новое испытание");return;}
    if(kind==="demo-reset"){state=initial();save();closeSheet();paintView();requestAnimationFrame(()=>focusCurrent(false));notice("Демонстрационный прогресс сброшен");return;}
    if(kind==="external-battle"){window.open("https://artem-chinkov.github.io/punchngo-v2/","_blank","noopener,noreferrer");return;}
  }
  root.addEventListener("click",e=>{
    const viewBtn=e.target.closest("[data-view]");
    if(viewBtn){selectView(viewBtn.dataset.view);return;}
    const btn=e.target.closest("[data-action]");
    if(btn){e.preventDefault();handle(btn.dataset.action);}
  });
  dialog.addEventListener("click",e=>{
    if(e.target===dialog){closeSheet();return;}
    const b=e.target.closest("[data-action]");
    if(b){e.preventDefault();e.stopPropagation();handle(b.dataset.action);}
  });
  dialog.addEventListener("close",()=>root.classList.remove("modal-open"));
  dialog.addEventListener("cancel",()=>root.classList.remove("modal-open"));
  $("#closeSheet").addEventListener("click",closeSheet);
  $("#jumpCurrent").addEventListener("click",()=>focusCurrent(true));
  mapScroll.addEventListener("scroll",updateJump,{passive:true});
  let touchStart=null;
  dialog.addEventListener("touchstart",e=>{if(e.target.closest(".dialog-handle,.dialog-header"))touchStart=e.touches[0].clientY;},{passive:true});
  dialog.addEventListener("touchend",e=>{if(touchStart!==null){const delta=e.changedTouches[0].clientY-touchStart;if(delta>90&&dialog.scrollTop<=0)closeSheet();touchStart=null;}},{passive:true});
  paintView();
  requestAnimationFrame(()=>requestAnimationFrame(()=>focusCurrent(false)));
})();