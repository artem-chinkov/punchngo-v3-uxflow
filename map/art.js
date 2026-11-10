"use strict";
/* Illustrated SVG environment; deliberately separate from the UI and interaction layer. */
(() => {
  const svg = document.getElementById("worldIllustration");
  if (!svg) return;
  const O = "#40334d", D = "#587c58";
  let seed=83147;
  const rand=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  const R=(n)=>Math.round(n*10)/10;
  const path=(d,fill,stroke=O,w=2)=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linejoin="round" stroke-linecap="round"/>';
  const tree=(x,y,s=1,type="round",color="#6fba68")=>{
    const shape=type==="pine"?
      '<path d="M0 -66 -22 -30 -11 -30 -28 -9 -13 -9 -34 14 34 14 13 -9 28 -9 11 -30 22 -30Z" fill="'+color+'" stroke="'+O+'" stroke-width="3.4" stroke-linejoin="round"/><path d="m-6-43-9 12m20-8-10 10m-5 15-8 10" stroke="#b8df86" stroke-width="4" stroke-linecap="round" fill="none"/>':
      '<path d="M-22 -17Q-54-22-42-43Q-54-68-25-70Q-10-94 11-77Q32-84 37-58Q63-37 37-21Q24-3-1-17Q-14 0-29-15Z" fill="'+color+'" stroke="'+O+'" stroke-width="3.8" stroke-linejoin="round"/><path d="M-32-48Q-16-68 1-62m16-3q12-2 16 13M-6-29q-8 10-20 4" fill="none" stroke="#b4df7a" stroke-width="4" stroke-linecap="round"/>';
    return '<g transform="translate('+R(x)+' '+R(y)+') scale('+R(s)+')"><ellipse cy="18" rx="31" ry="9" fill="#4d995c" opacity=".22"/><path d="M-6-22 8-24 8 19 -9 19Z" fill="#ad7b57" stroke="'+O+'" stroke-width="3"/>'+shape+'</g>';
  };
  const bush=(x,y,s=1,c="#8bc26a")=>'<g transform="translate('+R(x)+' '+R(y)+') scale('+R(s)+')"><path d="M-25 9Q-37-11-16-21Q-8-41 8-24Q34-29 30-5Q42 12 12 15H-24Z" fill="'+c+'" stroke="'+O+'" stroke-width="2.8" stroke-linejoin="round"/><path d="M-20-7q7-8 14-4M10-19q7-4 14 3" stroke="#cae391" fill="none" stroke-width="3" stroke-linecap="round"/></g>';
  const flower=(x,y,s=1)=>'<g transform="translate('+R(x)+' '+R(y)+') scale('+R(s)+')"><path d="M0 0v10" stroke="#577f52" stroke-width="2"/>'+[0,72,144,216,288].map(a=>'<ellipse transform="rotate('+a+')" cx="0" cy="-4" rx="2.9" ry="5.5" fill="'+(rand()>.3?"#ffe6a5":"#ffb4c0")+'" stroke="'+O+'" stroke-width=".7"/>').join("")+'<circle r="2.6" fill="#f6b74b" stroke="'+O+'" stroke-width=".8"/></g>';
  const mushroom=(x,y,s=1)=>'<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M-4 0V-15H5V1Z" fill="#ffe2b0" stroke="'+O+'" stroke-width="2"/><path d="M-14-13Q-9-36 0-35Q12-35 16-13Z" fill="#e76d70" stroke="'+O+'" stroke-width="2.4"/><circle cx="-4" cy="-22" r="3" fill="#fff2d7"/><circle cx="7" cy="-19" r="2.6" fill="#fff2d7"/></g>';
  const rock=(x,y,s=1,c="#a8a0b6")=>'<g transform="translate('+R(x)+' '+R(y)+') scale('+R(s)+')"><path d="M-23 5-20-14-8-29 14-25 29-5 23 12-13 13Z" fill="'+c+'" stroke="'+O+'" stroke-width="3.5" stroke-linejoin="round"/><path d="m-7-26-8 20 7 15m19-32 6 16-4 17" fill="none" stroke="#e3d5e5" stroke-width="3"/><path d="m-15-5 13 4" stroke="#716d8d" stroke-width="2.5"/></g>';
  const crystal=(x,y,s=1,c="#a789e5")=>'<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M0-34 16-15 9 12-8 14-17-10Z" fill="'+c+'" stroke="'+O+'" stroke-width="3" stroke-linejoin="round"/><path d="M0-34 1 13 16-15m-17-16-14 20 15 4" fill="#d6b6ff" stroke="'+O+'" stroke-width="1.5"/></g>';
  const house=(x,y,s=1)=>'<g transform="translate('+x+' '+y+') scale('+s+')"><ellipse cx="0" cy="13" rx="43" ry="12" fill="#4d995c" opacity=".23"/><path d="M-30-35h57v52h-57Z" fill="#f6d3a5" stroke="'+O+'" stroke-width="4"/><path d="m-40-31 41-38 38 38Z" fill="#e4aa58" stroke="'+O+'" stroke-width="4" stroke-linejoin="round"/><path d="M-12 17V-12h22v29" fill="#936b5d" stroke="'+O+'" stroke-width="3"/><circle cx="5" cy="6" r="2" fill="#f9db6b"/><path d="M-23-14h11v13h-11Z" fill="#93d9eb" stroke="'+O+'" stroke-width="2.2"/><path d="M-30-33h57" stroke="#fff0b1" stroke-width="4"/></g>';
  const rubble=(x,y,s=1)=>'<g transform="translate('+x+' '+y+') scale('+s+')">'+rock(-29,1,1.05,"#9c95aa")+rock(20,0,.85,"#b7aebd")+rock(0,15,.69,"#918ba6")+'<path d="M-4-15 9-8 3 4 18 11" fill="none" stroke="#7ef4dd" stroke-width="4"/></g>';
  const runeRock=(x,y,s=1)=>'<g transform="translate('+x+' '+y+') scale('+s+')">'+rock(0,0,1.3,"#aba3be")+'<path d="M-5-18 7-11 1-1 10 6-6 13" stroke="#80eee5" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>';
  const sign=(x,y,rot=0,text1="ЗОНА 1")=>'<g transform="translate('+x+' '+y+') rotate('+rot+')"><path d="M-3 0V64" stroke="'+O+'" stroke-width="10"/><path d="M-3 0V64" stroke="#b77e52" stroke-width="5"/><path d="M-61-9Q-18-15 60-8l-3 40q-65 12-119 1Z" fill="#efc37e" stroke="'+O+'" stroke-width="4" stroke-linejoin="round"/><text x="0" y="17" font-size="13" font-family="Nunito, sans-serif" font-weight="1000" text-anchor="middle" fill="#513846">'+text1+'</text></g>';
  let out = '<defs><pattern id="tinyDots" width="70" height="70" patternUnits="userSpaceOnUse"><circle cx="14" cy="9" r="1.8" fill="#e3ffd3" opacity=".4"/><path d="m43 31 4-7 3 9m-12 27 3-6" fill="none" stroke="#5c9b66" stroke-width="1.2" opacity=".4"/></pattern></defs>';
  out+= '<rect x="0" y="0" width="390" height="980" fill="#b4abda"/><rect x="0" y="930" width="390" height="1390" fill="#9ccb7c"/>';
  // Ice zone: decorative layered snowy mountains, flat vector contour.
  out+=path("M-10 155 39 65 92 152 145 36 195 147 260 56 327 154 384 83 405 160V0H-10Z","#807bb9",O,3);
  out+=path("M-10 284 56 208 107 265 174 148 225 271 305 160 401 269V325H-10Z","#aaa3d5",O,3);
  out+=path("M-10 284 56 208l27 40-29-9-30 42Zm147-65 37-71 35 76-28-16-15 17Z","#f0ebff","#cac0e7",1.2);
  out+=path("M269 220 305 160l33 61-22-14-16 16Z","#efeaff","#cac0e7",1);
  out+=path("M-10 318 Q83 287 147 313T400 301V945H-10Z","#c3badf",O,3);
  for(let i=0;i<25;i++){const x=R(rand()*390),y=R(320+rand()*590),rx=R(10+rand()*24);out+='<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+R(rx*.35)+'" fill="#e2d8f4" opacity=".8"/>'}
  out+=path("M-10 706Q85 664 147 720T403 678V918H-10Z","#acc9ba",O,2.2);
  // Transition, forest foundations and patterned clearings.
  out+=path("M-10 925 Q75 895 133 930Q240 966 410 896V2320H-10Z","#a7d17d",O,3);
  out+=path("M0 990Q104 949 189 1014T390 970V1124Q255 1173 154 1131T0 1180Z","#b4d88a","none",0);
  out+=path("M0 1285Q72 1223 162 1290T390 1309V1569Q284 1557 201 1582T0 1530Z","#9bcb76","none",0);
  out+=path("M0 1763Q136 1741 186 1778T390 1754V2095Q258 2055 149 2104T0 2073Z","#b0d985","none",0);
  out+=path("M-10 2170Q65 2121 144 2183T398 2154V2320H-10Z","#90c372","none",0);
  out+='<rect width="390" height="2320" fill="url(#tinyDots)" opacity=".7"/>';
  // River down left, with banks and water streaks.
  out+=path("M-46 1711Q103 1763 47 1888Q-8 1998 68 2101T50 2315", "none", O,85);
  out+=path("M-46 1711Q103 1763 47 1888Q-8 1998 68 2101T50 2315", "none","#d2d6ab",78);
  out+=path("M-46 1711Q103 1763 47 1888Q-8 1998 68 2101T50 2315", "none","#4baed4",62);
  out+=path("M-46 1711Q103 1763 47 1888Q-8 1998 68 2101T50 2315", "none","#8de3ed",49);
  for(let i=0;i<13;i++){const x=R(rand()*40+6),y=R(1770+rand()*490);out+='<path d="M'+x+' '+y+'q10-3 21 1" stroke="#fffaf0" stroke-width="3" stroke-linecap="round" fill="none"/>'}
  // Central winding road linking all zones, with dark edge and golden interior.
  const road="M151 2350C245 2210 71 2132 114 1971S264 1790 159 1672S307 1472 253 1384S66 1225 154 1106S251 930 93 833S284 682 272 500S84 386 161 246S206 91 135-35";
  out+='<path d="'+road+'" fill="none" stroke="'+O+'" stroke-width="53" stroke-linecap="round" stroke-linejoin="round"/>';
  out+='<path d="'+road+'" fill="none" stroke="#eacb92" stroke-width="47" stroke-linecap="round" stroke-linejoin="round"/>';
  out+='<path d="'+road+'" fill="none" stroke="#ffefbd" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>';
  out+='<path d="'+road+'" fill="none" stroke="#deb988" stroke-width="1.7" stroke-dasharray="2 22" stroke-linecap="round" opacity=".7"/>';
  // Large landform embellishments, not on the route.
  out+=path("M-20 1078Q59 1057 72 1127T10 1222H-20Z","#6fa867",O,3);
  out+=path("M300 1047Q351 1031 410 1070V1208Q362 1189 329 1145T300 1047Z","#80b56c",O,3);
  out+=path("M-20 1315Q23 1252 70 1286L74 1373 0 1431Z","#71b869",O,2.5);
  out+=path("M320 1747Q383 1725 420 1770V1944Q373 1860 317 1850Z","#7eb76c",O,2);
  // Tree and bush distribution, restrained center keeps path and targets legible.
  for(let i=0;i<31;i++){let x= i%2===0?R(-15+rand()*75):R(329+rand()*73),y=R(1020+rand()*1280),s=R(.52+rand()*.45);out+=tree(x,y,s,rand()>.68?"pine":"round",["#5ba869","#73bc64","#85c76e","#5eae75"][Math.floor(rand()*4)])}
  for(let i=0;i<18;i++){let x=i%2===0?R(7+rand()*54):R(335+rand()*45),y=R(230+rand()*620);out+=tree(x,y,R(.5+rand()*.54),"pine",["#799fa7","#8ba9b2","#747bac","#789b9d"][Math.floor(rand()*4)])}
  // Snow boulders and crystals.
  for(let i=0;i<19;i++){let x=i%2?R(332+rand()*47):R(rand()*55),y=R(210+rand()*670);out+=rock(x,y,R(.6+rand()*.56),"#c5bfd9");if(i%4===0)out+=crystal(x+18,y-25,.65)}
  for(let i=0;i<28;i++){let x=i%2?R(323+rand()*68):R(-10+rand()*67),y=R(1160+rand()*1070);out+=bush(x,y,R(.55+rand()*.48),["#9ccd69","#86bb68","#7dbb6f"][Math.floor(rand()*3)])}
  for(let i=0;i<63;i++){let x=R(rand()*390),y=R(1110+rand()*1200);if(x>75&&x<315&&((y>1290&&y<1450)||(y>1570&&y<1750)||(y>1890&&y<2050)))continue;out+=flower(x,y,R(.6+rand()*.6))}
  for(let i=0;i<16;i++){let x=i%2?R(310+rand()*55):R(14+rand()*50),y=R(1170+rand()*1120);out+=mushroom(x,y,R(.6+rand()*.6))}
  // A small river bridge.
  out+='<g transform="translate(52 2087) rotate(-14)"><path d="M-40-25H38L49-12V21H-51V-12Z" fill="#c3905c" stroke="'+O+'" stroke-width="4"/><path d="M-40-20H40m-38 4V18m13-33V17m14-33V17" stroke="#7d5d51" stroke-width="3"/><path d="M-50-38V20m94-58V20m-94-58H44" stroke="'+O+'" stroke-width="4" fill="none"/></g>';
  // Stone rubble - completed first milestone.
  out+=rubble(302,1919,.94)+rubble(328,1959,.57);
  out+='<path d="M267 1927L280 1890m42 76 22-21" stroke="#ae8561" stroke-width="8" stroke-linecap="round"/>';
  // Tiny settlement: cabin plus flags and fence.
  out+=house(52,1505,.68);
  out+='<g transform="translate(15 1578)"><path d="M0 0H73m-63-16v44m49-44v44" stroke="'+O+'" stroke-width="5" stroke-linecap="round"/><path d="M0 0H73m-63-16v44m49-44v44" stroke="#c29065" stroke-width="2.4" stroke-linecap="round"/></g>';
  out+=sign(83,2140,-5,"СТАРТ");
  // Glowing rune rocks clustered near the main stage.
  out+=runeRock(70,1613,.95)+runeRock(109,1646,.7)+runeRock(286,1730,.55);
  out+='<g opacity=".9">'+[[-20,-38],[31,-27],[-35,11],[47,1]].map(([dx,dy])=>'<path d="M'+(70+dx)+' '+(1613+dy)+'l0-10m-5 5h10" fill="none" stroke="#b4fcf4" stroke-width="2"/>').join("")+'</g>';
  // Happy quirky troll NPC on the side of the active stage.
  out+='<g transform="translate(326 1696)"><ellipse cx="0" cy="3" rx="36" ry="12" fill="#5d995c" opacity=".3"/><path d="M-20-55Q-40-25-34-7H29Q41-34 20-55Z" fill="#a19bb4" stroke="'+O+'" stroke-width="3.5"/><path d="M-29-64Q-36-94 0-100Q31-98 31-69L24-48Q3-36-24-51Z" fill="#a6a0b7" stroke="'+O+'" stroke-width="3.5"/><path d="M-26-90Q-12-116 12-101l18 9-7 9-18-5-15 8Z" fill="#8fbd67" stroke="'+O+'" stroke-width="3"/><circle cx="-10" cy="-72" r="4" fill="'+O+'"/><circle cx="13" cy="-72" r="4" fill="'+O+'"/><path d="M-12-57Q2-46 15-58" stroke="'+O+'" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M-30-35Q-45-56-50-41L-42-15M28-35Q48-55 50-33L41-10" stroke="#a8a2b9" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M-17-43 15-43 15-23 -17-23Z" fill="#c5996c" stroke="'+O+'" stroke-width="2.5"/><path d="M-17-43 15-23" stroke="#ebc77c" stroke-width="2"/></g>';
  // Fantasy boss gate, readable even with a stage node in front.
  out+='<g transform="translate(253 1308)"><path d="M-67 28V-50Q-68-119 0-129Q66-119 67-50V28Z" fill="#aaa3bc" stroke="'+O+'" stroke-width="5"/><path d="M-53 24V-45Q-54-103 0-108Q51-104 52-43V24Z" fill="#d0c5ca" stroke="'+O+'" stroke-width="3.5"/><path d="M-37 23V-39Q-34-80 0-82Q34-80 37-39V23Z" fill="#99685a" stroke="'+O+'" stroke-width="4"/><path d="m-18-78 0 98M0-79v101M19-77v100M-37-30h74" stroke="#684b53" stroke-width="2.5"/><path d="M-58-67Q-54-121-10-131L-26-148Q-50-164-60-139M58-67Q54-121 10-131L26-148Q50-164 60-139" fill="#b6adc2" stroke="'+O+'" stroke-width="4"/><circle cx="-42" cy="-88" r="4" fill="#efc081"/><circle cx="42" cy="-88" r="4" fill="#efc081"/><path d="M-43-10 44-30" stroke="#4c3748" stroke-width="7"/><path d="M-43-30 44-10" stroke="#4c3748" stroke-width="7"/><rect x="-12" y="-28" width="24" height="28" rx="5" fill="#cfcbd3" stroke="'+O+'" stroke-width="3"/><path d="M-7-26v-9a7 7 0 0 1 14 0v9" fill="none" stroke="'+O+'" stroke-width="4"/></g>';
  out+='<g transform="translate(203 1278)"><path d="M0 0V-56" stroke="'+O+'" stroke-width="5"/><path d="M0-56Q22-67 31-48L0-33Z" fill="#e98779" stroke="'+O+'" stroke-width="3"/></g>';
  out+='<g transform="translate(313 1277)"><path d="M0 0V-56" stroke="'+O+'" stroke-width="5"/><path d="M0-56Q22-67 31-48L0-33Z" fill="#e98779" stroke="'+O+'" stroke-width="3"/></g>';
  // Icy zone bridge and distant portal.
  out+='<g transform="translate(163 221)"><path d="M-59 16V-41H-41V-72h23v31h35v-31h23v31h19V16Z" fill="#9b8ab6" stroke="'+O+'" stroke-width="4"/><path d="M-34 16v-31q34-35 68 0v31Z" fill="#594767" stroke="'+O+'" stroke-width="4"/><path d="M-22 16V-12Q0-34 23-12V16" fill="#c1aed4" stroke="'+O+'" stroke-width="2"/>'+crystal(0,-92,.67,"#c784f2")+'</g>';
  out+='<g transform="translate(93 798)">'+path("M-42-5Q0-38 42-5V36H-42Z","#899baf",O,4)+path("M-27 34V0Q0-27 27 0v34Z","#6e647f",O,3)+'<path d="M-27 31H27" stroke="#ded7e2" stroke-width="5"/></g>';
  out+=crystal(355,780,.85)+crystal(32,553,.63)+crystal(327,296,.8);
  out+=rock(347,1095,.76)+rock(37,1255,.66)+bush(328,2077,.97)+bush(50,2217,.84)+tree(331,2203,.74,"round","#63af67");
  svg.innerHTML=out;
})();