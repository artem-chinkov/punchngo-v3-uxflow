"use strict";

/* PUNCH ’N’ GO v3 — UX map and 25 interactive wireframes.
   Zero dependencies. This is a clickable specification, not the Phaser game. */
const GROUPS = [
  { id:"entry", label:"Вход", note:"ONBOARDING" },
  { id:"hub", label:"Навигация", note:"WORLD / LEVEL" },
  { id:"story", label:"Сюжет", note:"MISSION / NPC" },
  { id:"run", label:"Забег", note:"COMBAT LOOP" },
  { id:"result", label:"Результат", note:"SUCCESS / RETRY" },
  { id:"meta", label:"Метаигра", note:"CONCEPT / PROGRESS" }
];
const NODES = [
  {id:"splash",title:"Первый запуск",group:"entry",status:"D",desc:"Титульный экран и старт",purpose:"Быстро войти в игру и понять формат короткой аркады.",notes:["Сразу показываем основное действие: «Начать».","Первый запуск направляет в обучение; повторный — на карту.","Нет регистрации, магазина и обязательного выбора персонажа."],next:["tutorial","hub"]},
  {id:"tutorial",title:"Обучение",group:"entry",status:"R",desc:"Тап, удержание, свайпы и контратака",purpose:"Дать освоить базовые жесты и предупреждения врагов.",notes:["Геймплейная система обучения есть в v2, wireframe — целевое представление.","Удержание: первый удар 100%, повторные — 80% (новое согласованное правило).","Контратака выполняется вручную по жёлтому сигналу; показ безопасного окна."],next:["hub","run"]},
  {id:"hub",title:"Главный экран",group:"hub",status:"D",desc:"Продолжить приключение, герой",purpose:"Предложить очевидный следующий шаг и быстрые точки входа в метаигру.",notes:["Главный CTA — продолжить сюжет.","Кузница и Арсенал — отдельные места в прототипе, функции не утверждены.","Сюжетный прогресс и рекорды не смешиваем."],next:["world","forge","arsenal","records"]},
  {id:"world",title:"Карта мира",group:"hub",status:"D",desc:"Зоны и направление истории",purpose:"Показать открытые зоны и следующую цель путешествия.",notes:["Количество и названия реальных зон не утверждены.","Следующая зона открывается после победы над боссом предыдущей.","Ни звёзды, ни S-ранг не нужны для сюжетного прохождения."],next:["zone","hub"]},
  {id:"zone",title:"Карта зоны",group:"hub",status:"D",desc:"Три сюжетных этапа",purpose:"Объединить три коротких этапа в одну историю.",notes:["Три последовательных этапа: постановка → осложнение → развязка.","Состояния «открыт / пройден / закрыт» видны сразу.","Подзаголовки «Каменный завал» и другие — примеры, не утверждённый лор."],next:["level1","level2","level3","npcquest"]},
  {id:"level1",title:"Этап 1 · Каменный завал",group:"hub",status:"H",desc:"Пример основной миссии: разрушение",purpose:"Прочитать цель и перейти к краткому брифингу.",notes:["Условная задача: разбить четыре препятствия.","После провала счётчик препятствий сбрасывается.","Сюжетные названия и награды — демонстрационные."],next:["npcintro","prep","zone"]},
  {id:"level2",title:"Этап 2 · Камни тролля",group:"hub",status:"H",desc:"Пример миссии: сбор предметов",purpose:"Показать иной тип задачи в той же зоне.",notes:["Пример: собрать пять камней; на маршруте восемь.","Игрок меняет полосы для подбора; доступность целей необходимо обеспечить.","Открывается после прохождения первого этапа."],next:["npcintro","prep","zone"]},
  {id:"level3",title:"Этап 3 · Логово Бульдога",group:"hub",status:"H",desc:"Финал зоны, встреча с боссом",purpose:"Подготовить игрока к итоговому столкновению.",notes:["Бульдог в v2 — функциональный референс; внешний вид в фэнтези ещё открыт.","Этап иллюстрирует необходимость победы над боссом.","Открывается после выполнения предыдущих сюжетных этапов."],next:["npcintro","prep","boss"]},
  {id:"npcintro",title:"Брифинг NPC",group:"story",status:"D",desc:"1–2 реплики и цель этапа",purpose:"Объяснить проблему и её игровую цель без долгого диалога.",notes:["Портрет NPC, одна-две короткие реплики.","После первого просмотра брифинг можно пропускать.","Реплики не должны прерывать ритм повтора."],next:["prep","zone"]},
  {id:"npcquest",title:"Карточка поручения NPC",group:"story",status:"D",desc:"Необязательная задача и награда",purpose:"Показать отдельный слой повторных задач.",notes:["Накопительные поручения сохраняют прогресс между попытками.","Поручения не блокируют следующую зону.","Примеры наград и ресурсов в UX-flow не являются утверждёнными."],next:["questlog","zone","prep"]},
  {id:"questlog",title:"Журнал поручений",group:"story",status:"D",desc:"Активные и выполненные просьбы",purpose:"Дать игроку следить за побочными целями вне основного HUD.",notes:["Не показывать на дороге множество NPC-индикаторов.","Дополнительные задачи отделены от основных.","Не вводить ежедневные задания в базовый UX-flow."],next:["npcquest","zone","hub"]},
  {id:"prep",title:"Подготовка к забегу",group:"story",status:"D",desc:"Цель, правила, начать",purpose:"Подтвердить цель этапа и быстро начать играть.",notes:["Не превращать подготовку в тяжёлый экран экипировки.","Показывать выбранный этап, основную задачу и доступные сведения.","Кузница/Арсенал — необязательные выходы на концептуальные экраны."],next:["run","forge","arsenal","zone"]},
  {id:"run",title:"Забег · HUD",group:"run",status:"R",desc:"Три полосы, HP, опыт, цель",purpose:"Игрок вручную атакует, меняет полосы и отслеживает задачу.",notes:["Интерактивная мини-симуляция, не встроенный Phaser v2.","Тап — полноценный удар с рывком; удержание — 100% первый удар, 80% следующие.","Удержание замедляет бег, супер-рывок собирает врагов, апперкот пружинный."],next:["encounter","levelup","stagewin","defeat"]},
  {id:"encounter",title:"Постановочное событие",group:"run",status:"D",desc:"Засада / сюжетная реплика",purpose:"Добавить изменение событий внутри короткого забега.",notes:["Событие определяется этапом, а не длинной кат-сценой.","Короткая реплика не закрывает телеграфы атак.","Пример засады после разрушения второго завала — гипотеза."],next:["run","levelup"]},
  {id:"levelup",title:"Повышение уровня",group:"run",status:"R",desc:"Пауза и выбор 1 из 3",purpose:"Выбрать одно временное улучшение текущего забега.",notes:["На время выбора симуляция останавливается.","Улучшения не сохраняются между попытками.","Всего 12 типов улучшений в v2; здесь демонстрационный набор из трёх."],next:["run"]},
  {id:"boss",title:"Бульдог · две фазы",group:"run",status:"R",desc:"Телеграфы, контратака, финал",purpose:"Показать вершину сложности зоны и ценность мастерства.",notes:["Босс не захватывается супер-рывком; бой не обходится тараном.","Контратака прерывает опасный выпад, обычный удар — нет.","Визуальная адаптация Бульдога к фэнтези ещё не утверждена."],next:["stagewin","defeat","run"]},
  {id:"stagewin",title:"Успех этапа",group:"result",status:"D",desc:"Главная цель выполнена",purpose:"Зафиксировать сюжетное достижение и объяснить следующий шаг.",notes:["Успех открывает следующий этап, победа над боссом — следующую зону.","S/A/B/C и рекорд — необязательное мастерство.","Три обязательные звезды не вводим."],next:["loot","zoneclear","zone"]},
  {id:"defeat",title:"Поражение",group:"result",status:"D",desc:"Повторить попытку, без чекпоинта",purpose:"Мотивировать повтор, чётко объяснить потерю прогресса.",notes:["Основная цель текущей попытки сбрасывается.","Накопительная дополнительная задача NPC может сохраняться.","Пройденные ранее этапы не теряются."],next:["prep","zone","questlog"]},
  {id:"loot",title:"Награды и прогресс",group:"result",status:"H",desc:"Условные ресурсы и статистика",purpose:"Подвести итог и направить к карте или развитию героя.",notes:["Монеты и расход ресурсов — проектные числа.","Постоянную экономику не считать утверждённой.","Рекорды и ранги уже существуют в v2."],next:["zone","hub","forge","records"]},
  {id:"zoneclear",title:"Зона завершена",group:"result",status:"D",desc:"История продвинулась, путь открыт",purpose:"Наглядно показать изменение мира после победы.",notes:["Визуальное изменение карты — важная сюжетная награда.","Новая зона открывается без звёзд и обязательных поручений.","Название следующей зоны оставлено намеренно нейтральным."],next:["world","npcquest","hub"]},
  {id:"forge",title:"Кузница",group:"meta",status:"O",desc:"Концепт постоянных улучшений",purpose:"Исследовать UX роста героя между забегами.",notes:["Разделение функций Кузницы и Арсенала не утверждено.","Здесь показан вариант с улучшением характеристик, а не окончательное решение.","Любые уровни, стоимости и монеты условны."],next:["arsenal","hub","prep"]},
  {id:"arsenal",title:"Арсенал",group:"meta",status:"O",desc:"Концепт перчаток и экипировки",purpose:"Исследовать UX выбора предметов и внешнего вида.",notes:["Роль экипировки и отличие от Кузницы — открытый вопрос.","Предметы и свойства перчаток ниже демонстрационные.","Не создавать обязательный выбор экипировки перед каждым забегом."],next:["forge","hub","prep"]},
  {id:"achievements",title:"Достижения",group:"meta",status:"D",desc:"Боевые вызовы без звёзд",purpose:"Предложить необязательные долгосрочные цели.",notes:["Достижения — отдельная мотивация к повторению боевых ситуаций.","Не создавать обязательный «трёхмедальный» проход.","Конкретные достижения и награды в макете — примеры."],next:["hub","records","questlog"]},
  {id:"records",title:"Рекорды и статистика",group:"meta",status:"R",desc:"Счёт, лучший ранг, победы",purpose:"Показать результаты и повод перепройти этап.",notes:["В v2 хранятся best/runs/victories/totalKills.","Для отдельных сюжетных этапов рекорды — будущая адаптация.","Ранги не открывают сюжетный контент."],next:["hub","achievements","zone"]},
  {id:"settings",title:"Настройки",group:"meta",status:"R",desc:"Звук, подсказки, доступность",purpose:"Сделать основные настройки доступными без перегрузки навигации.",notes:["Существующие настройки звука и обучения есть в v2.","Новые элементы в wireframe — ориентиры UX, а не обещание реализации.","Визуальные эффекты должны учитывать reduced motion."],next:["hub","tutorial"]}
];
const byId = Object.fromEntries(NODES.map(n=>[n.id,n]));
const STATES = {R:"Есть в v2",D:"Утверждено",H:"Пример / гипотеза",O:"Открытый вопрос"};
const initial = () => ({stage:1,goal:0,maxGoal:4,completed:[],xp:0,hp:100,bossHp:100,quest:0,questDone:false,coins:120,level:1,kills:0,attacks:0,combo:0,hitLog:"Проверь управление и начни забег.",selectedUpgrade:"",visited:[],didIntro:false,mode:"play"});
let state=initial(), selected=null, activeFilter="all", searchText="", connectionsShown=true;
const app=document.getElementById("app");
const titles=["Каменный завал","Камни тролля","Логово Бульдога"];
const objectives=["Разбей 4 каменных завала","Собери 5 из 8 магических камней","Победи Бульдога"];
const E = str=>String(str??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const B=(text,action,cls="")=>'<button type="button" class="ph-btn '+cls+'" data-action="'+E(action)+'">'+E(text)+'</button>';
const G=(text,id,cls="")=>'<button type="button" class="ph-btn '+cls+'" data-go="'+E(id)+'">'+E(text)+'</button>';
const BADGE=(s,c="")=>'<span class="ph-badge '+c+'">'+E(s)+'</span>';
const BOX=(inner,cls="")=>'<section class="ph-box '+cls+'">'+inner+'</section>';
const TXT=(t)=>'<div class="ph-card-sub">'+E(t)+'</div>';
const TITLE=(t)=>'<div class="ph-card-title">'+E(t)+'</div>';
const GRID=(x,cols="")=>'<div class="ph-grid '+cols+'">'+x.join("")+'</div>';
const PROGRESS=(v,max)=>'<div class="ph-progress" role="progressbar" aria-valuenow="'+v+'" aria-valuemax="'+max+'"><i style="width:'+Math.max(0,Math.min(100,Math.round(v/max*100)))+'%"></i></div>';
const A=(content)=>'<div class="ph-body">'+content+'</div>';
const D=(content)=>'<div class="ph-bottom">'+content+'</div>';
const HEADER=(title,sub="")=>'<div class="ph-head"><div><div class="ph-sub">'+E(sub)+'</div><div class="ph-title">'+E(title)+'</div></div><span class="ph-badge">v3</span></div>';
function stageLabel(){return "1-"+state.stage+" · "+titles[state.stage-1]}
function objective(){return objectives[state.stage-1]}
function maxGoal(){return state.stage===1?4:state.stage===2?5:100}
function setupStage(s){state.stage=s;state.goal=0;state.maxGoal=maxGoal();state.hp=100;state.bossHp=100;state.xp=0;state.level=1;state.selectedUpgrade="";state.hitLog="Цель: "+objective()+". Первое действие за тобой.";state.attacks=0;state.combo=0}
function currentLevelId(){return "level"+state.stage}
function isDone(s){return state.completed.includes(s)}
function levelUnlocked(s){return s===1||isDone(s-1)}
function scrollNotice(){return state.completed.length+" / 3 этапов"}
function backButton(){return '<button class="ph-btn secondary mini-btn" data-go="zone">← К карте</button>'}
function npc(name,emoji,msg){return '<div class="ph-message"><div class="ph-avatar" aria-hidden="true">'+emoji+'</div><div><strong>'+E(name)+'</strong><p>'+E(msg)+'</p></div></div>'}
function topHUD(){return '<div class="ph-hud"><span>❤️ '+state.hp+'/100</span><strong>'+Math.max(0,Math.round(state.goal/maxGoal()*100))+'% · '+stageLabel().slice(0,3)+'</strong><span>✦ '+state.xp+' XP</span></div>'}
function footButtons(x){return D(x)}
function navBar(){return D('<div class="ph-btn-row">'+G("Карта","world","secondary")+G("Играть","zone")+G("Герой","forge","secondary")+'</div>')}
function stageCards(){return [1,2,3].map(s=>BOX('<div class="ph-row"><div><div class="ph-card-title">1-'+s+' · '+titles[s-1]+'</div>'+TXT(isDone(s)?"Пройдено":levelUnlocked(s)?"Доступно":"Закрыто до прохождения предыдущего этапа")+'</div>'+BADGE(isDone(s)?"✓":levelUnlocked(s)?"→":"🔒",isDone(s)?"":"info")+'</div><div style="margin-top:8px">'+G(isDone(s)?"Перепройти":levelUnlocked(s)?"Открыть этап":"Закрыто","level"+s,"mini-btn"+(!levelUnlocked(s)?" locked":""))+'</div>',"")).join("")}
function makePhone(id){
 const n=byId[id];let body="",bottom="",title=n.title,sub="PUNCH ’N’ GO · UX";
 if(id==="splash"){
  body=A('<div style="padding:15px 0 0;text-align:center">'+BADGE("FIRST SESSION · концепт")+'<div style="font-size:31px;font-weight:800;letter-spacing:-.085em;margin:21px 0 6px">PUNCH<br>’N’ GO</div><div class="ph-small">Фэнтезийное приключение.<br>Три полосы. Магические кулаки.<br>Твоя история начинается здесь.</div></div><div class="ph-scene" style="height:180px;margin-top:15px"><span class="castle">🏰</span><span class="hill"></span><span class="hill right"></span><span class="fists">✊　✊</span></div>');
  bottom=D(B("Начать приключение","start-adventure")+G("Пропустить обучение","hub","secondary"));
 }else if(id==="tutorial"){
  body=A('<div class="ph-kicker">Обучение · 4 жеста</div>'+BOX('👊 '+TITLE("Тап — прямой удар с рывком")+TXT("Удержание: первый удар обычный, следующие — 80% урона."))+BOX('↔️ '+TITLE("Свайп влево / вправо")+TXT("Смена полосы и боковой удар."))+BOX('⬆️ '+TITLE("Свайп вверх")+TXT("Супер-рывок собирает врагов перед героем."))+BOX('⬇️ '+TITLE("Свайп вниз")+TXT("Пружинный апперкот: шаг назад и резкий выпад."))+BOX('🟡 '+TITLE("Жёлтый телеграф")+TXT("Точный тап позволяет контратаковать."),"chosen"));
  bottom=D(B("Понятно, к карте","finish-tutorial")+G("Попробовать бой","run","secondary"));
 }else if(id==="hub"){
  body=A(BOX('<div class="ph-row"><div>'+TITLE("Искатель приключений")+TXT("HP 100 · Прогресс зоны "+scrollNotice())+'</div><span class="ph-avatar">🧤</span></div>')+BOX(TITLE("Продолжить историю")+TXT(stageLabel())+G("Карта путешествия","world"),"chosen")+GRID([BOX(TITLE("Кузница")+TXT("Концепт"))+ "",BOX(TITLE("Арсенал")+TXT("Концепт"))])+GRID([G("Поручения","questlog","secondary"),G("Достижения","achievements","secondary"),G("Рекорды","records","secondary"),G("Настройки","settings","secondary")]));
  bottom=D(G("Продолжить приключение","zone")+BADGE("Без обязательных звёзд"));
 }else if(id==="world"){
  body=A('<div class="ph-kicker">Карта кампании · названия условны</div><div class="ph-scene" style="height:170px"><span class="castle">🏰</span><span class="hill"></span><span class="hill right"></span></div>'+BOX(TITLE("Зона 1 · Лесные тропы")+TXT("3 этапа · "+scrollNotice()+" · пример биома")+'<div style="margin-top:9px">'+G("Открыть зону","zone")+'</div>',"chosen")+BOX(TITLE("Следующая зона")+TXT(isDone(3)?"Открыта после победы над боссом":"Закрыта до победы над боссом 1-3"),isDone(3)?"":"locked"));
  bottom=navBar();
 }else if(id==="zone"){
  body=A('<div class="ph-kicker">Пример первой сюжетной зоны</div><div class="ph-scene" style="height:105px"><span class="hill"></span><span class="castle">🏰</span></div>'+stageCards()+BOX('<div class="ph-row">'+TITLE("Дополнительная просьба тролля")+BADGE(state.quest+"/10")+'</div>'+TXT("Догони врагов и нанеси десять попаданий. Прогресс между попытками.")+G("Поручение NPC","npcquest","mini-btn secondary"),"dotted"));
  bottom=D(G("Карта мира","world","secondary"));
 }else if(id==="level1"||id==="level2"||id==="level3"){
  const s=Number(id.slice(-1)),unlocked=levelUnlocked(s);
  body=A('<div class="ph-kicker">Сюжетный этап 1-'+s+'</div><div class="ph-scene"><span class="castle">🏰</span><span class="hill"></span><span class="hill right"></span><span class="fists">✊　✊</span></div>'+BOX(TITLE("Главная задача")+TXT(objectives[s-1]))+BOX(TITLE("Контекст")+TXT(["Страж просит расчистить путь сквозь камни.","Каменный тролль потерял волшебные камни.","У ворот логова ждёт финальный противник."][s-1]))+(!unlocked?'<div class="ph-notice">Этап закрыт до прохождения предыдущего.</div>':"")+BADGE("Сюжет — демонстрационный","warn"));
  bottom=D(unlocked?B("Начать брифинг","open-brief-"+s)+G("Карта зоны","zone","secondary"):G("Вернуться к этапам","zone","secondary"));
 }else if(id==="npcintro"){
  let line=state.stage===1?"Камни перекрыли дорогу. Разбей четыре завала и открой тропу.":state.stage===2?"Мои камни разбросаны по дороге. Верни пять, и я тебе помогу.":"За воротами опасный страж. Останови его и освободи путь.";
  body=A('<div class="ph-kicker">Перед забегом · 1–2 реплики</div>'+npc(state.stage===2?"Каменный тролль":"Лесной страж",state.stage===2?"🪨":"🧙",line)+BOX(TITLE("Твоя цель")+TXT(objective()),"chosen")+TXT("При повторном прохождении диалог можно пропустить."));
  bottom=D(G("Продолжить","prep")+G("Назад к этапу",currentLevelId(),"secondary"));
 }else if(id==="prep"){
  body=A('<div class="ph-kicker">'+stageLabel()+'</div>'+BOX(TITLE("Основная задача")+TXT(objective())+PROGRESS(0,maxGoal()))+BOX(TITLE("Доступные действия")+TXT("Тап · удержание · свайпы · контратака · супер-рывок · апперкот"))+BOX(TITLE("При поражении")+TXT("Основной прогресс текущего забега обнулится. Накопительное поручение NPC сохранится."),"dotted")+GRID([G("Кузница","forge","secondary"),G("Арсенал","arsenal","secondary")])+BADGE("Срез геймплея — интерактивная симуляция","warn"));
  bottom=D(B("В бой!","start-run")+G("Назад","zone","secondary"));
 }else if(id==="run"||id==="encounter"){
  const isEvent=id==="encounter";
  body=A(topHUD()+'<div class="ph-small">Основная цель: '+E(objective())+'</div>'+PROGRESS(state.goal,maxGoal())+'<div class="ph-scene"><span class="castle">🏰</span><span class="hill"></span><span class="hill right"></span><span class="enemy">'+(state.stage===2?"🪨":state.stage===3?"🐺":"👹")+'</span><span class="fists">✊　✊</span><span class="indicator'+(state.combo>=2?" ready":"")+'">'+(state.combo>=2?"ЖЁЛТЫЙ СИГНАЛ":"ТЕЛЕГРАФ")+'</span></div>'+BOX(TITLE(isEvent?"Сюжетное событие":"Боевые действия")+TXT(isEvent?"Засада! Новая группа выходит из-за завала. NPC предупреждает короткой репликой.":state.hitLog),isEvent?"chosen":"")+'<div class="ph-small">Комбо: '+state.combo+' · Нокауты: '+state.kills+' · Уровень: '+state.level+'</div>'+GRID([B("👊 Тап","hit-tap","mini-btn"),B("✊ Удержание","hit-hold","mini-btn"),B("↔️ Боковой","hit-side","mini-btn"),B("🟡 Контратака","hit-counter","mini-btn"),B("⬆️ Супер-рывок","hit-super","mini-btn"),B("⬇️ Апперкот","hit-upper","mini-btn")])+'</div>'+(state.stage===2?B("Подобрать камень","collect-stone","secondary"):"")+'<div class="ph-notice">Это UX-симуляция состояний, не боевая физика Phaser.</div>');
  bottom=D('<div class="ph-btn-row">'+B(state.stage===3?"Перейти к боссу":"Сюжетное событие","show-event","secondary")+B("Завершить этап","complete-stage")+'</div><div class="ph-btn-row">'+B("Повышение уровня","show-levelup","secondary")+B("Поражение","simulate-defeat","danger")+'</div>');
 }else if(id==="levelup"){
  body=A('<div class="ph-kicker">Симуляция на паузе</div>'+BOX(TITLE("Уровень "+(state.level+1)+" · выбери 1 из 3")+TXT("Выбранное усиление действует только в текущем забеге."),"chosen")+[
  ["Стальные кулаки","+20% урона ударов"],
  ["Шквал ударов","+15% к частоте ударов"],
  ["Второе дыхание","+25 HP, не выше максимума"]
 ].map((x,i)=>BOX('<div class="ph-row"><div>'+TITLE(x[0])+TXT(x[1])+'</div><button class="ph-btn mini-btn" data-action="choose-upgrade-'+i+'">Выбрать</button></div>')).join("")+BADGE("12 типов улучшений в v2"));
  bottom=D('<div class="ph-small">Улучшения не являются постоянной экипировкой и не переносятся в новый забег.</div>');
 }else if(id==="boss"){
  body=A(topHUD()+BOX(TITLE("БУЛЬДОГ · ФАЗА "+(state.bossHp<=50?"2":"1"))+PROGRESS(state.bossHp,100)+TXT("Босс перехватывает героя. Прерывание опасного выпада — только контратакой."),"dark")+'<div class="ph-scene"><span class="hill"></span><span class="enemy" style="width:79px;height:90px;top:55px">🐺</span><span class="fists">✊　✊</span><span class="indicator warning">ОПАСНАЯ АТАКА</span></div>'+BOX(TITLE("Бой с боссом")+TXT(state.hitLog))+GRID([B("👊 Тап","boss-tap"),B("🟡 Контратака","boss-counter"),B("⬆️ Таран","boss-super","secondary"),B("⬇️ Апперкот","boss-upper","secondary")]));
  bottom=D('<div class="ph-btn-row">'+B("Победить","boss-win")+B("Поражение","simulate-defeat","danger")+'</div>');
 }else if(id==="stagewin"){
  body=A('<div style="text-align:center;padding:18px 0 9px;font-size:44px">🏆</div><div style="text-align:center">'+TITLE("Этап выполнен!")+'<div class="ph-small">'+E(stageLabel())+'</div></div>'+BOX(TITLE("Основная цель")+TXT(objective())+BADGE("Выполнено"))+GRID([BOX(TITLE("Ранг")+ '<div class="ph-number">A</div>'+TXT("Демонстрационный ранг")),BOX(TITLE("Комбо")+'<div class="ph-number">'+state.combo+'</div>'+TXT("Личный результат"))])+BOX(TITLE("Прогресс")+TXT(state.stage===3?"Победа над боссом открывает следующую зону.":"Открывается следующий этап.")+BADGE("Без звёзд")));
  bottom=D(B("Получить награду","collect-rewards")+G("К карте","zone","secondary"));
 }else if(id==="defeat"){
  body=A('<div style="text-align:center;padding:20px 0;font-size:46px">💔</div><div style="text-align:center">'+TITLE("Забег завершён")+TXT("Основная цель не выполнена")+'</div>'+BOX(TITLE("Сюжетная задача")+TXT("Прогресс текущей попытки сброшен. При повторе начнётся сначала."),"dotted")+BOX(TITLE("Поручение NPC")+TXT(state.quest+" / 10 попаданий. Накопительный прогресс сохраняется между попытками."),"chosen")+BOX(TITLE("Ранее пройденные этапы")+TXT(scrollNotice()+". Они не теряются.")));
  bottom=D(B("Повторить попытку","retry-run")+G("К карте зоны","zone","secondary"));
 }else if(id==="loot"){
  body=A('<div style="text-align:center;padding:18px 0;font-size:42px">🎁</div><div style="text-align:center">'+TITLE("Награды за забег")+TXT("Демонстрационная экономика")+'</div>'+GRID([BOX(TITLE("Монеты")+"<div class=\"ph-number\">+35</div>"),BOX(TITLE("Прогресс")+ '<div class="ph-number">'+scrollNotice()+'</div>')])+BOX(TITLE("Статистика")+TXT("Нокаутов: "+state.kills+" · Комбо: "+state.combo+" · XP: "+state.xp))+BOX(TITLE("Важно")+TXT("Монеты, цены Кузницы и Арсенала, состав наград пока не утверждены."),"dotted"));
  bottom=D('<div class="ph-btn-row">'+G("Карта","zone")+G("Кузница","forge","secondary")+'</div>');
 }else if(id==="zoneclear"){
  body=A('<div class="ph-kicker">История зоны завершена</div><div class="ph-scene"><span class="castle">🏰</span><span class="hill"></span><span class="hill right"></span></div>'+BOX(TITLE("Путь открыт!")+TXT("Бульдог побеждён. Препятствие на карте исчезло; путь к следующей зоне доступен."),"chosen")+BOX(TITLE("Что дальше")+TXT("Исследование следующей зоны или повтор этапов ради поручений, достижений и рекордов."))+BADGE("Количество и названия зон не зафиксированы","warn"));
  bottom=D(G("Карта мира","world")+G("Поручения","questlog","secondary"));
 }else if(id==="npcquest"){
  body=A(npc("Каменный тролль","🪨","Если столкнёшь десять разбойников друг с другом, поделись историей. Я буду считать твои успехи!")+BOX(TITLE("Попадания по врагам · условное поручение")+PROGRESS(state.quest,10)+TXT(state.quest+" из 10 · прогресс сохраняется между забегами."),"chosen")+BOX(TITLE("Награда")+TXT("50 монет — демонстрационное значение, экономический баланс не утверждён."),"dotted")+B("Проверить поручение","check-quest","secondary"));
  bottom=D(G("К журналу поручений","questlog")+G("К карте зоны","zone","secondary"));
 }else if(id==="questlog"){
  body=A('<div class="ph-kicker">Основные задачи ≠ поручения</div>'+BOX(TITLE("🪨 Просьба тролля")+PROGRESS(state.quest,10)+TXT(state.quest+"/10 · накопительная")+G("Открыть поручение","npcquest","mini-btn secondary"))+BOX(TITLE("🧙 Просьба стража")+TXT("Найти пропавшего разведчика · пример будущего поручения")+BADGE("Пример","warn"),"dotted")+BOX(TITLE("Выполненные")+TXT(state.questDone?"Просьба тролля выполнена.":"Здесь появятся завершённые поручения.")));
  bottom=D(G("К карте зоны","zone"));
 }else if(id==="forge"){
  body=A('<div class="ph-notice">КОНЦЕПТ — функции Кузницы и Арсенала не распределены окончательно.</div>'+BOX(TITLE("Кузница · пример структуры")+TXT("Условное развитие постоянных характеристик. Это не принятое решение."),"dotted")+GRID([BOX(TITLE("Монеты")+'<div class="ph-number">'+state.coins+'</div>'),BOX(TITLE("Уровень кузницы")+'<div class="ph-number">1</div>')])+BOX(TITLE("Усилить кулаки")+TXT("Демонстрация UX: +5% урона · стоимость 100 монет")+B("Показать покупку","mock-forge","secondary"))+BOX(TITLE("Что нужно решить")+TXT("Какие свойства улучшаем постоянно? Где граница с Арсеналом? Как избежать pay-to-win?")));
  bottom=D('<div class="ph-btn-row">'+G("Арсенал","arsenal","secondary")+G("К герою","hub")+'</div>');
 }else if(id==="arsenal"){
  body=A('<div class="ph-notice">КОНЦЕПТ — свойства перчаток и получение экипировки не утверждены.</div>'+BOX(TITLE("Перчатки героя")+TXT("Пример структуры выбора, не финальные предметы."),"chosen")+BOX('<div class="ph-row"><div>'+TITLE("🧤 Стартовые перчатки")+TXT("Экипировано · без особых свойств")+'</div>'+BADGE("✓")+'</div>')+BOX('<div class="ph-row"><div>'+TITLE("⚡ Искровые перчатки")+TXT("Пример эффекта: шанс разряда")+'</div>'+BADGE("Пример","warn")+'</div>',"dotted")+BOX(TITLE("Открытый вопрос")+TXT("Роль экипировки, уровни качества и взаимодействие с Кузницей требуют отдельного решения.")));
  bottom=D('<div class="ph-btn-row">'+G("Кузница","forge","secondary")+G("Главная","hub")+'</div>');
 }else if(id==="achievements"){
  body=A('<div class="ph-kicker">Необязательное мастерство</div>'+BOX(TITLE("Цепная реакция")+TXT("Создай цепочку из пяти столкновений — пример достижения.")+PROGRESS(Math.min(5,state.combo),5))+BOX(TITLE("Идеальная контратака")+TXT("Выполни несколько идеальных контратак — пример."))+BOX(TITLE("Мастер тарана")+TXT("Толкни большую группу врагов — пример."))+BOX(TITLE("Сюжет отдельно")+TXT("Достижения не блокируют следующий этап и зону."),"chosen"));
  bottom=D('<div class="ph-btn-row">'+G("Рекорды","records","secondary")+G("Главная","hub")+'</div>');
 }else if(id==="records"){
  body=A('<div class="ph-kicker">Статистика героя</div>'+GRID([BOX(TITLE("Лучший ранг")+'<div class="ph-number">S</div>'),BOX(TITLE("Лучший счёт")+'<div class="ph-number">39k</div>'),BOX(TITLE("Победы")+'<div class="ph-number">'+state.completed.length+'</div>'),BOX(TITLE("Нокауты")+'<div class="ph-number">'+state.kills+'</div>')])+BOX(TITLE("Рекорды отдельных уровней")+TXT("Предусмотрено на перспективу; текущий v2 хранит глобальные счёт, забеги, победы и нокауты."),"dotted"));
  bottom=D('<div class="ph-btn-row">'+G("Достижения","achievements","secondary")+G("Главная","hub")+'</div>');
 }else if(id==="settings"){
  body=A(BOX(TITLE("Звук")+TXT("Музыка: вкл · эффекты: вкл"))+BOX(TITLE("Обучение")+TXT("Показывать контекстные подсказки: вкл"))+BOX(TITLE("Доступность")+TXT("Уважать системную настройку уменьшения движения."))+BOX(TITLE("Сброс демоданных")+TXT("Сбросит состояние только этого UX-прототипа, не v2.")+B("Сбросить демо","reset-demo","secondary"),"dotted"));
  bottom=D(G("Главная","hub"));
 }
 return '<div class="phone-status"><span>9:41</span><span>●●● ◖▰</span></div><div class="phone-content">'+HEADER(title,sub)+body+bottom+'</div>';
}
function drawApp(){
 app.innerHTML='<main class="shell"><header class="topbar"><div><div class="overline">PUNCH ’N’ GO / PRODUCT DESIGN / 2026</div><h1 class="brand">UX FLOW <em>v3.0</em></h1><p class="lead">Карта пользовательского пути и интерактивные мобильные wireframe-экраны. Выбери узел, затем переходи по кнопкам внутри телефона. Демо показывает согласованные механики и отдельно помечает концепты.</p></div><div class="top-actions"><a class="button ghost" target="_blank" rel="noopener noreferrer" href="https://github.com/artem-chinkov/punchngo-v3-uxflow">GitHub ↗</a><a class="button ghost" target="_blank" rel="noopener noreferrer" href="https://drive.google.com/file/d/13WvV2JswRXiwyhn6abzHh1W22E1zoHnd/view">GDD ↗</a><button class="button primary" data-quick="splash">▶ Играть сценарий</button></div></header>'+
 '<section class="info-strip"><div class="stat"><b>25</b><span>экранов / состояний</span></div><div class="stat"><b>3</b><span>сюжетных этапа</span></div><div class="stat"><b>2</b><span>связанных окна</span></div><div class="stat"><b>0</b><span>внешних зависимостей</span></div></section>'+
 '<div class="section-head"><h2 class="section-title">Карта UX-flow</h2><div class="section-caption">Сплошные линии — основной переход · пунктир — дополнительный</div></div>'+
 '<section class="toolbar"><input id="search" class="search" placeholder="Найти экран или действие…" aria-label="Поиск по узлам"><div class="filters">'+[["all","Все"],["R","Есть в v2"],["D","Утверждено"],["H","Пример"],["O","Открыто"]].map(v=>'<button class="filter '+(activeFilter===v[0]?"active":"")+'" data-filter="'+v[0]+'">'+v[1]+'</button>').join("")+'</div><div class="legend">'+[["done","R"],["","D"],["hyp","H"],["open","O"]].map(v=>'<span><i class="dot '+v[0]+'"></i>'+v[1]+'</span>').join("")+'</div></section>'+
 '<section class="flow-viewport" id="flow-viewport"><div class="flow-content" id="flow-content"><svg class="flow-connections" id="flow-connections" aria-hidden="true"></svg><div class="flow-columns">'+GROUPS.map((group,index)=>'<div class="flow-col"><div class="column-head"><div class="column-num">0'+(index+1)+' / '+group.note+'</div><div class="column-name">'+E(group.label)+'</div><div class="column-note">'+NODES.filter(n=>n.group===group.id).length+' узлов</div></div>'+NODES.filter(n=>n.group===group.id).map(n=>'<button type="button" id="node-'+n.id+'" class="node" data-go="'+n.id+'"><span class="node-top"><span class="node-num">#'+String(NODES.indexOf(n)+1).padStart(2,"0")+'</span><span class="status '+n.status+'">'+n.status+'</span></span><span class="node-name">'+E(n.title)+'</span><span class="node-sub">'+E(n.desc)+'</span></button>').join("")+'</div>').join("")+'</div></div></section>'+
 '<div class="flow-footer">R = реализованная система в v2 (wireframe не копия игрового UI) · D = согласовано · H = условный пример · O = открытый вопрос.</div>'+
 '<div class="section-head"><h2 class="section-title">Быстрые сценарии</h2><span class="section-caption">Нажми, чтобы перейти к ключевой ветке</span></div><nav class="quicklinks" aria-label="Быстрые сценарии">'+[["tutorial","Первый запуск"],["zone","Карта трёх этапов"],["run","Бой и HUD"],["levelup","1 из 3 улучшений"],["defeat","Поражение / сброс"],["stagewin","Успех"],["npcquest","Поручения"],["forge","Кузница / Арсенал"]].map(x=>'<button class="pill" data-quick="'+x[0]+'">'+x[1]+'</button>').join("")+'</nav><div class="flow-footer">Цель: wireframe-исследование информационной архитектуры и пользовательских сценариев. Это не замена боевого прототипа v2.</div></main><div id="modal-root"></div>';
 document.getElementById("search").value=searchText;
 document.getElementById("search").addEventListener("input",e=>{searchText=e.target.value;filterNodes()});
 requestAnimationFrame(drawConnections);
 filterNodes();
}
function renderModal(){
 let root=document.getElementById("modal-root");if(!root)return;
 if(!selected){root.innerHTML="";document.body.style.overflow="";document.title="PUNCH ’N’ GO · UX FLOW v3";return}
 document.body.style.overflow="hidden";
 let n=byId[selected];document.title=n.title+" · PUNCH ’N’ GO UX";
 const idx=NODES.indexOf(n);
 root.innerHTML='<div class="dialog-layer" id="dialog-layer" data-close-layer="1"><div class="dialog-shell" role="dialog" aria-modal="true" aria-label="Wireframe '+E(n.title)+'"><header class="dialog-head"><div><div class="overline">Экран #'+String(idx+1).padStart(2,"0")+' / 25 · '+E(n.group)+'</div><h2 class="dialog-title">'+E(n.title)+'</h2><div class="dialog-sub">Два связанных окна: wireframe + описание решения</div></div><div class="top-actions"><button class="button ghost tiny" data-action="reset-demo">↻ Сброс демо</button><button class="icon-button" data-close="1" aria-label="Закрыть">✕</button></div></header><div class="dialog-body"><section class="modal-pane phone-pane"><div class="phone-label"><span>MOBILE WIREFRAME · 354×670</span><span>PORTRAIT</span></div><div class="phone">'+makePhone(selected)+'</div></section><section class="modal-pane details"><div class="ph-row"><span class="status '+n.status+'">'+n.status+' · '+STATES[n.status]+'</span><span class="mini" style="color:#9fbbc4;font-size:10px">UX SCENARIO</span></div><h2>'+E(n.title)+'</h2><p>'+E(n.purpose)+'</p><div class="detail-block"><h4>UX-правила и решения</h4><ul class="detail-list">'+n.notes.map(x=>'<li>'+E(x)+'</li>').join("")+'</ul></div><div class="detail-block"><h4>Связанные экраны</h4><div class="detail-links">'+n.next.map(id=>'<button class="button ghost" data-go="'+id+'"><small>#'+String(NODES.indexOf(byId[id])+1).padStart(2,"0")+' · '+STATES[byId[id].status]+'</small>'+E(byId[id].title)+'</button>').join("")+'</div></div><div class="detail-block"><h4>Состояние демонстрации</h4><p>Этап: '+E(stageLabel())+' · Цель: '+state.goal+'/'+maxGoal()+' · Поручение: '+state.quest+'/10 · Пройдено: '+state.completed.length+'/3. Демо-числа не заменяют баланс GDD.</p></div><div class="detail-nav"><button class="button ghost" data-go="'+NODES[(idx+NODES.length-1)%NODES.length].id+'">← Предыдущий</button><button class="button primary" data-go="'+NODES[(idx+1)%NODES.length].id+'">Следующий →</button></div></section></div><footer class="footline"><span>Нажми <kbd>ESC</kbd> для выхода · <kbd>←</kbd> / <kbd>→</kbd> для соседних узлов</span><span>GDD v1.0 / UX FLOW v3 / демонстрационный прототип</span></footer></div></div>';
}
function show(id){if(!byId[id])return;selected=id;renderModal();window.location.hash=id;let f=document.querySelector(".node.is-highlighted");if(f)f.classList.remove("is-highlighted");const n=document.getElementById("node-"+id);if(n)n.classList.add("is-highlighted")}
function close(){selected=null;renderModal();history.replaceState(null,"",location.pathname+location.search)}
function filterNodes(){
 const q=searchText.toLocaleLowerCase("ru");document.querySelectorAll(".node").forEach(el=>{const n=byId[el.dataset.go],match=(activeFilter==="all"||n.status===activeFilter)&&(!q||[n.title,n.desc,n.purpose,...n.notes].join(" ").toLocaleLowerCase("ru").includes(q));el.classList.toggle("is-muted",!match)});requestAnimationFrame(drawConnections)
}
function drawConnections(){
 const svg=document.getElementById("flow-connections"),wrap=document.getElementById("flow-content");if(!svg||!wrap)return;
 const bounds=wrap.getBoundingClientRect(),edges=[];
 svg.setAttribute("viewBox","0 0 "+wrap.scrollWidth+" "+wrap.scrollHeight);
 const seen=new Set();
 NODES.forEach(n=>n.next.slice(0,3).forEach((dest,i)=>{
   const from=document.getElementById("node-"+n.id),to=document.getElementById("node-"+dest);
   if(!from||!to)return;
   const a=from.getBoundingClientRect(),b=to.getBoundingClientRect();const right=b.left>=a.right-30;
   if(!right&&i>0)return;
   const x1=(right?a.right:a.left+a.width/2)-bounds.left;const y1=a.top+a.height*.50-bounds.top;
   const x2=(right?b.left:b.left+b.width/2)-bounds.left;const y2=(right?b.top+b.height*.5:b.top)-bounds.top;
   if(Math.abs(x1-x2)<2&&Math.abs(y1-y2)<2)return;
   let key=n.id+"_"+dest;if(seen.has(key))return;seen.add(key);
   let d=right?"M "+x1+" "+y1+" C "+(x1+Math.max(18,(x2-x1)*.45))+" "+y1+", "+(x2-Math.max(18,(x2-x1)*.45))+" "+y2+", "+x2+" "+y2:
      "M "+x1+" "+y1+" C "+x1+" "+(y1+28)+", "+x2+" "+(y2-26)+", "+x2+" "+y2;
   let klass=dest==="defeat"?"danger":i>0?"secondary":"";
   edges.push('<path d="'+d+'" class="'+klass+'"/>');
 }));
 svg.innerHTML=edges.join("");
}
function completeStage(){
 if(state.stage===3){if(state.bossHp>0){state.hitLog="Для финала сначала победи Бульдога.";show("boss");return}}
 else if(state.goal<maxGoal()){state.hitLog="Задача ещё не выполнена: "+state.goal+"/"+maxGoal()+". Продолжай бой или сбор предметов.";show("run");return}
 if(!isDone(state.stage))state.completed.push(state.stage);state.coins+=35;show("stagewin")
}
function doHit(which){
 state.attacks++;state.combo++;state.xp+=which==="hold"?14:which==="counter"?25:18;
 const descriptions={tap:"Полноценный удар + рывок. Урон 100%.",hold:"Первый удар 100%, следующие джебы 80%.",side:"Смена полосы и боковая дуга удара.",counter:"Ручная контратака по жёлтому сигналу.",super:"Супер-рывок: толкаемая цепочка без лимита.",upper:"Пружинный апперкот: короткий откат и выпад."};
 state.hitLog=descriptions[which]||"Удар";
 if(state.stage===1&&["tap","hold","upper","super"].includes(which))state.goal=Math.min(4,state.goal+1);
 if(state.stage===2&&which==="super")state.hitLog="Супер-рывок разгоняет врагов, камни нужно подобрать отдельно.";
 if(state.stage===3)state.bossHp=Math.max(0,state.bossHp-(which==="counter"?18:which==="upper"?15:which==="hold"?8:12));
 state.quest=Math.min(10,state.quest+1);
 if(state.attacks%3===0)state.kills++;
 if(state.stage===3&&state.bossHp<=0){state.goal=100;show("boss");return}
 if(state.stage===1&&state.goal===2&&state.attacks===2){show("encounter");return}
 if(state.xp>=100){state.xp=0;show("levelup");return}
 renderModal();
}
function runAction(action){
 if(action==="start-adventure"){show("tutorial");return}
 if(action==="finish-tutorial"){show("hub");return}
 if(action.startsWith("open-brief-")){setupStage(Number(action.slice(-1)));show("npcintro");return}
 if(action==="start-run"){state.goal=0;state.maxGoal=maxGoal();state.xp=0;state.combo=0;state.attacks=0;state.hp=100;state.bossHp=100;state.level=1;state.selectedUpgrade="";state.hitLog="Начало этапа. Выполни основную задачу.";show(state.stage===3?"boss":"run");return}
 if(action.startsWith("hit-")){doHit(action.slice(4));return}
 if(action==="collect-stone"){if(state.stage===2){state.goal=Math.min(5,state.goal+1);state.quest=Math.min(10,state.quest+1);state.hitLog="Камень найден. Собрано: "+state.goal+"/5."}renderModal();return}
 if(action==="show-event"){show(state.stage===3?"boss":"encounter");return}
 if(action==="show-levelup"){show("levelup");return}
 if(action.startsWith("choose-upgrade-")){const which=Number(action.slice(-1));state.selectedUpgrade=["Стальные кулаки","Шквал ударов","Второе дыхание"][which];state.level++;if(which===2)state.hp=Math.min(100,state.hp+25);state.hitLog="Выбрано: "+state.selectedUpgrade+" (только на эту попытку).";show(state.stage===3?"boss":"run");return}
 if(action==="complete-stage"){completeStage();return}
 if(action==="simulate-defeat"){state.goal=0;state.maxGoal=maxGoal();state.hp=0;state.xp=0;state.combo=0;show("defeat");return}
 if(action==="retry-run"){state.goal=0;state.hp=100;state.combo=0;state.xp=0;state.bossHp=100;show("prep");return}
 if(action.startsWith("boss-")){const kind=action.slice(5);if(kind==="win"){state.bossHp=0;state.goal=100;completeStage();return}const delta={tap:12,counter:30,upper:19,super:9}[kind]||0;state.bossHp=Math.max(0,state.bossHp-delta);state.quest=Math.min(10,state.quest+1);state.combo++;state.hitLog=kind==="counter"?"Успешная контратака прерывает опасную атаку.":kind==="super"?"Таран не захватывает босса.":kind==="upper"?"Апперкот наносит урон, но не прерывает выпад.":"Обычный удар по боссу.";if(state.bossHp===0)state.goal=100;renderModal();return}
 if(action==="collect-rewards"){show(state.stage===3?"zoneclear":"loot");return}
 if(action==="check-quest"){if(state.quest>=10){state.questDone=true;state.hitLog="Поручение выполнено. Награда демонстрационная."}renderModal();return}
 if(action==="mock-forge"){state.hitLog="Покупка в прототипе не проводится: экономика не утверждена.";show("forge");return}
 if(action==="reset-demo"){state=initial();show(selected||"hub");return}
}
document.addEventListener("click",e=>{
 const target=e.target.closest("button,a");if(!target)return;
 if(target.dataset.close){close();return}
 if(target.dataset.go){const id=target.dataset.go;if(id==="level1"||id==="level2"||id==="level3"){const s=Number(id.slice(-1));if(levelUnlocked(s))setupStage(s)}show(id);return}
 if(target.dataset.quick){show(target.dataset.quick);return}
 if(target.dataset.filter){activeFilter=target.dataset.filter;document.querySelectorAll(".filter").forEach(el=>el.classList.toggle("active",el.dataset.filter===activeFilter));filterNodes();return}
 if(target.dataset.action){runAction(target.dataset.action);return}
});
document.addEventListener("mousedown",e=>{if(e.target&&e.target.dataset.closeLayer){close()}});
document.addEventListener("keydown",e=>{
 if(e.key==="Escape"&&selected){close();return}
 if(selected&&e.key==="ArrowRight"&&!e.target.closest("input")){show(NODES[(NODES.indexOf(byId[selected])+1)%NODES.length].id)}
 if(selected&&e.key==="ArrowLeft"&&!e.target.closest("input")){show(NODES[(NODES.indexOf(byId[selected])+NODES.length-1)%NODES.length].id)}
});
window.addEventListener("resize",()=>requestAnimationFrame(drawConnections));
window.addEventListener("hashchange",()=>{const id=location.hash.slice(1);if(byId[id])show(id);else if(selected)close()});
drawApp();if(byId[location.hash.slice(1)])show(location.hash.slice(1));
