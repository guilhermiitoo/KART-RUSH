/* ===== KART RUSH DELUXE · BAÍA DO KRAKEN =====
 Ilha tropical cercada de mar turquesa. Largada na vila do cais, píer sobre a lagoa, subida do penhasco até o FAROL,
 salto sobre a enseada, CAVERNA DA CAVEIRA (a pista entra pela boca) e descida pela mata até a praia.
 Vivo: galeão balançando e atirando, tentáculos do Kraken saindo do mar, farol girando, gaivotas, bandeiras.
 Interativo: barris e caixotes na pista saem voando quando alguém bate. */
if(window.PHONE)throw new Error('PHONEMODE');
(()=>{const {P,Mt,Gw,Gl,Ha,Fl,lerp,sst}=DX,PI=Math.PI;
const SAND=0xEED9A0,GRASS=0x4FB85A,ROCK=0x8A8478,WOOD=0x8A5A2E,WD2=0x6B4226;
const mar=()=>DX.liquid({base:'#18A8C8',luz:'rgba(190,250,255,.6)',rough:.1,metal:.3,env:1.5,rep:40,alpha:.9});
DX.addMap({id:'pirata',nome:'BAÍA DO KRAKEN',ico:'🏴‍☠️',tema:'pirata',dif:4,
 sub:'Vila do cais, píer na lagoa, farol no penhasco, salto na enseada e a caverna da caveira',menu:'caverna da caveira · farol · kraken · galeão',
 pts:[[-140,230,2],[-20,240,2],[100,220,2],[210,240,4,'ponte'],[310,190,4],[340,90,9],[290,0,16],[320,-100,24],[250,-190,24,'rampa'],[130,-220,18],[20,-180,13],
  [-70,-230,11],[-180,-200,8],[-280,-140,5],[-330,-40,3],[-270,40,2],[-320,130,2],[-260,210,2]],
 tuneis:[[10.1,10.95]],
 fog:[0xBFE8F4,320,1500],hemi:[0xFFFFFF,0x7FC8B8,.72],sun:[0xFFF4D8,1],sunDir:[.55,.7,-.4],dust:0xE8D8A8,
 sky:{top:0x1F7FE8,mid:0x6FC4FF,hor:0xDFF6FF,sunC:0xFFF6D8,sunD:[.55,.7,-.4],cloud:.5,cloudC:0xFFFFFF},
 road:['#B89A68','#F2E2BC','rgba(255,255,255,.85)'],bar:[0xC0302E,0xF2E2BC],cone:0xC0302E,mm:'#C8A870',pit:'agua',pitMat:mar,pitCor:'#18A8C8',saia:0x8A7A5A,
 fallMsg:'🌊 CAIU NO MAR! ⏱ 2s',
 ter:{cell:9,fall:70,bed:-5,gapDeep:34,margin:560,
  nat(x,z,d){const n=DX.fbm(x*.004+2,z*.004+9,4);let h=-7+n*26*sst(360,60,d)+sst(330,60,d)*5;h+=Math.exp(-(((x-470)/150)**2+((z+60)/200)**2))*70*sst(40,120,d);return Math.max(h,-9)},
  col(x,z,h,sl){if(h<-.6)return 0xC8B880;if(h<2.8)return DX.noise(x*.05,z*.05)>.6?0xE4CC90:SAND;if(sl>.85)return ROCK;if(sl>.55)return 0x9A9078;return DX.noise(x*.02,z*.02)>.5?GRASS:0x43A850}},
 placas(B){return[[.014,'LARGADA · BAÍA DO KRAKEN','#C0302E','Içar velas!'],[B.uOf(3)-.012,'PÍER DA LAGOA','#258BFF','Cuidado com os tentáculos'],[B.uOf(6),'SUBIDA DO FAROL','#FFD43B','Pé no fundo!'],
  [B.uOf(8)-.012,'SALTO DA ENSEADA','#22D3FF','Acelera e pula!'],[B.uOf(10)-.012,'CAVERNA DA CAVEIRA','#8E5BE8','Entra pela boca!'],[.95,'RETA FINAL','#FFD43B','Falta pouco!']]},
 cena(B,d){const hw=B.hw,X=d.dx,HT=PISTAS.HT;
  DX.sea(B,0,mar(),'agua');
  /* palmeiras (tronco curvo + folhas) e arbustos */
  {const K=DX.kit();K.def='flat';K.tube([[0,0,0],[.6,4,0],[1.8,8,0],[3.6,11.5,0]],.5,0xA87848,false,10);for(let i=0;i<7;i++){const a=i/7*PI*2;K.ext([[0,-.9],[3.5,-1.2],[7,0],[3.5,1.2],[0,.9]],.2,i%2?0x2FA84F:0x3BBF5C,3.6+Math.cos(a)*.4,11.6,Math.sin(a)*.4,[PI/2+.5,0,-a],null)}
   for(let i=0;i<3;i++)K.lowball(.55,0x6B4226,3.4+Math.cos(i*2)*.5,11,Math.sin(i*2)*.5);
   B.inst(K,B.scatter(150,(x,z,h,dd)=>dd>hw+9&&dd<340&&h>1.2&&h<40?.8+Math.random()*.7:0),{tilt:.1})}
  {const K=DX.kit();K.def='flat';K.ico(2.6,0x2F9A4A,0,1.6,0,[1.2,.8,1.1]);K.ico(1.8,0x3BBF5C,1.6,1.4,.8);K.ico(1.6,0x268A40,-1.5,1.2,-.6);B.inst(K,B.scatter(110,(x,z,h,dd)=>dd>hw+7&&dd<300&&h>3?.6+Math.random()*1.2:0))}
  {const K=DX.kit();K.def='flat';K.ico(3,ROCK,0,1.2,0,[1.3,.8,1.1]);K.ico(1.8,0x9A9488,2.2,.8,1);B.inst(K,B.scatter(70,(x,z,h,dd)=>dd>hw+8&&dd<380&&h>-3?.6+Math.random()*2:0))}
  /* tochas ao longo da pista */
  {const K=DX.kit();K.def='flat';K.cyl(.22,.3,5,WD2,0,2.5,0,null,null,6);K.cyl(.5,.3,.8,0x3A2A1A,0,5.3,0,null,null,6);K.cone(.5,1.6,Gw(0xFFB020),0,6.4,0,null,null,6);K.lowball(2.4,Ha(0xFF8A20),0,6.2,0);
   const lp=[];for(let k=0;k<34;k++){const u=k/34+.012;if(nearGap(u,10))continue;const s=k%2?1:-1,p=B.at(u,s*(hw+4));if(p.y<.5)continue;lp.push({x:p.x,y:p.y,z:p.z,s:1,r:0})}B.inst(K,lp,{cast:false})}
  /* vila do cais: cabanas de palha sobre estacas, com lanterna */
  {const K=DX.kit();K.def='flat';for(const a of[[-3,-3],[3,-3],[-3,3],[3,3]])K.cyl(.35,.4,5,WD2,a[0],2.5,a[1],null,null,6);K.box(8.5,.5,8.5,WOOD,0,5,0);K.box(7,4.4,7,0xC89A5A,0,7.4,0);K.cone(6.6,5,0xD8B860,0,12,0,null,null,4,);K.box(1.8,2.8,.2,WD2,0,6.6,3.55);K.box(1.6,1.4,.2,Gw(0xFFD27A),2.2,7.8,3.55);K.lowball(3,Ha(0xFFB020),2.2,7.8,4);
   K.limb([-4.2,5,4.2],[-6.5,0,6.5],.2,WD2);B.inst(K,[.025,.055,.085,.965,.935,.905].map((u,i)=>{const s=i%2?1:-1,p=B.at(u,s*(hw+17+(i%3)*5));return{x:p.x,y:Math.max(p.y,.2)-.4,z:p.z,s:1.1,r:p.h+(s>0?-PI/2:PI/2)+PI/4*0}}))}
  /* FAROL no penhasco, com facho girando */
  {const p=B.at(B.uOf(7.1),hw+38),K=DX.kit();K.lathe([[7,0],[6.2,10],[5.2,24],[4.6,36]],Fl(0xFFFFFF),0,0,0,null,null,12);for(let i=0;i<3;i++)K.lathe([[6.75-i*.82,3+i*12],[6.3-i*.8,9+i*12]],Fl(0xD9313F),0,0,0,null,[1.03,1,1.03],12);
   K.cyl(6,6,1,Fl(0x3A3F4A),0,36.5,0);K.cyl(3.4,3.4,5,Gl(0xFFF6C0),0,39.5,0);K.ball(2,Gw(0xFFF2A0),0,39.5,0);K.cone(4.6,4,Fl(0xD9313F),0,44,0,null,null,10);
   const L=K.sub('luz',0,39.5,0);L.cone(9,90,Ha(0xFFF2A0),0,0,45,[-PI/2,0,0],null,10);L.cone(9,90,Ha(0xFFF2A0),0,0,-45,[PI/2,0,0],null,10);
   const g=B.put(K,p.x,p.y-1,p.z,0);B.anim(t=>{g.userData.parts.luz.rotation.y=t*.7})}
  /* CAVEIRA GIGANTE: a pista entra pela boca */
  X.tun.forEach(([i0,i1])=>{B.tunnel(i0,i1,{col:0x5A5048,luz:0xFF8A20,portal:0x8A8070,step:8});
   const j=((i0%N)+N)%N,h=Math.atan2(TG[j].x,TG[j].z),K=DX.kit(),R=hw+5,Rk=Fl(0xA8A090),Dk=Fl(0x2A2620);
   K.ico(R*1.45,Rk,0,R*1.15,8,[1.05,.95,1],null,2);K.ico(R*.8,Rk,-R*.75,R*.5,6,[.8,1,1],null,1);K.ico(R*.8,Rk,R*.75,R*.5,6,[.8,1,1],null,1);
   for(const s of[-1,1]){K.ball(R*.36,Dk,s*R*.5,R*1.35,-R*1.12,[1,1.1,.6]);K.ball(R*.16,Gw(0xFF7A1A),s*R*.5,R*1.33,-R*1.2);K.lowball(R*.36,Ha(0xFF7A1A),s*R*.5,R*1.33,-R*1.3)}
   K.cone(R*.12,R*.3,Dk,0,R*.98,-R*1.3,[.3,0,0],null,5);
   for(let t=0;t<9;t++){const a=PI*(t+.5)/9,x=Math.cos(a)*(R+1),y=Math.sin(a)*(R+1)*.66;K.cone(2.6,7.5,Fl(0xF2ECDC),x,y-1.5,-R*.12+.5,[PI,0,0],null,5)}
   B.put(K,SP[j].x,HT[j],SP[j].z,h);
   const j2=((i1%N)+N)%N,K2=DX.kit();K2.ico(R*1.3,Rk,0,R*.7,-6,[1.1,.9,.7],null,1);B.put(K2,SP[j2].x,HT[j2],SP[j2].z,Math.atan2(TG[j2].x,TG[j2].z))});
  /* GALEÃO ancorado: balança no mar e dispara os canhões */
  {const a=B.at(B.uOf(1.5),hw+105),K=DX.kit();K.def='flat';
   K.ext([[-22,0],[-24,9],[-17,10],[16,8],[26,11],[20,0],[10,-5],[-14,-5]],15,WOOD,0,2,0,null,null,1.5);K.ext([[-23,9],[-17,10],[16,8],[25,10.6],[25,12],[16,9.5],[-17,11.5],[-23,10.5]],15.6,0x6B4226,0,2,0);
   K.box(9,5,13,0x9A6A3A,-18,14.5,0);K.box(40,.5,14,0xC89A5A,0,10.4,0);for(let i=0;i<5;i++)for(const s of[-1,1]){K.cyl(.7,.8,2.6,0x1E1E24,-12+i*6,7.5,s*8.2,[PI/2,0,0],null,8)}
   [[-6,34],[8,40],[19,28]].forEach((m,i)=>{K.cyl(.6,.8,m[1],WD2,m[0],10+m[1]/2,0,null,null,8);K.box(.5,.5,20-i*3,WD2,m[0],10+m[1]*.86,0);K.box(.5,.5,16-i*2,WD2,m[0],10+m[1]*.45,0);
    K.rbox(1.6,m[1]*.36,18-i*3,.6,P(0xF4EEDF),m[0]+1.2,10+m[1]*.66,0);K.rbox(1.8,m[1]*.26,14-i*2,.6,P(0xF4EEDF),m[0]+1.4,10+m[1]*.3,0)});
   K.box(.2,4,6,P(0x14141C),8,52,0);K.ball(1.1,P(0xFFFFFF),8.2,52.4,0,[.3,1,1]);K.tube([[26,11,0],[34,13,0],[38,16,0]],.4,WD2,false,6);
   const g=B.put(K,a.x,-1.5,a.z,a.h+.4);B.anim(t=>{g.rotation.z=Math.sin(t*.8)*.035;g.rotation.x=Math.sin(t*.6+1)*.02;g.position.y=-1.5+Math.sin(t*.9)*.5});
   let cd=3;B.anim((t,dt)=>{cd-=dt;if(cd>0||!(state==='go'||state==='count'))return;cd=3+Math.random()*4;const s=Math.sin(g.rotation.y),c=Math.cos(g.rotation.y),o=(Math.random()-.5)*24,px=g.position.x+c*o-s*9,pz=g.position.z-s*o-c*9;
    DX.burst('spark',px,7,pz,14,{sp:10,up:3,col:[0xFFD43B,0xFF7A1A],s0:1.6,s1:.2,life:.35});DX.burst('smoke',px,7,pz,10,{sp:7,up:3,col:0xE8E8E8,s0:2,s1:7,life:1.4,a:.6});
    const tx=px-s*(40+Math.random()*30),tz=pz-c*(40+Math.random()*30);setTimeout(()=>DX.burst('smoke',tx,1,tz,16,{sp:6,up:16,col:[0xFFFFFF,0xBFEFFF],s0:1.4,s1:4,life:1,g:22,a:.8}),700)})}
  /* tentáculos do KRAKEN ao lado do píer */
  {const e=(d.pon||[])[0];if(e){const um=(e[0]+e[1])/2,ts=[];[[-.012,1],[.0,-1],[.012,1],[.02,-1]].forEach((q,i)=>{const p=B.at(um+q[0],q[1]*(hw+16+i*4)),K=DX.kit();let k=K.sub('s0',0,0,0);
     for(let s=0;s<7;s++){const r=2.6-s*.32;k.cyl(r*.86,r,5.2,P(0x8A3FA8),0,2.6,0,null,null,8);k.lowball(r*.5,P(0xF4A0C8),0,1.6,r*.8);k.lowball(r*.45,P(0xF4A0C8),0,3.8,r*.75);if(s<6)k=k.sub('s'+(s+1),0,5,0)}
     const g=B.put(K,p.x,-4,p.z,p.h+(q[1]>0?-PI/2:PI/2));ts.push(g)});
    B.anim(t=>ts.forEach((g,i)=>{const q=g.userData.parts;for(let s=0;s<7;s++){const n=q['s'+s];if(n){n.rotation.x=Math.sin(t*1.4+i*1.7-s*.5)*.2+(s>2?.16:0);n.rotation.z=Math.cos(t*1.1+i-s*.4)*.1}}g.position.y=-4+Math.sin(t*.7+i)*1.5}))}}
  /* gaivotas em círculo */
  {const gs=[];for(let i=0;i<8;i++){const K=DX.kit();K.ball(.6,0xFFFFFF,0,0,0,[.6,.5,1.6]);for(const s of[-1,1]){const w=K.sub('w'+s,s*.3,0,0);w.ext([[0,-.5],[2.6*s,-.2],[3.2*s,.3],[0,.5]],.08,0xF4F4F4,0,0,0,[PI/2,0,0])}gs.push(B.put(K,0,0,0,0,1.6))}
   const c=B.at(B.uOf(2),hw+80);B.anim(t=>gs.forEach((g,i)=>{const a=t*.35+i*.8,r=60+i*9;g.position.set(c.x+Math.cos(a)*r,46+i*3+Math.sin(t+i)*3,c.z+Math.sin(a)*r);g.rotation.y=-a;const f=Math.sin(t*6+i)*.6;g.userData.parts.w1.rotation.z=f;g.userData.parts['w-1'].rotation.z=-f}))}
  /* baús de tesouro brilhando */
  {const K=DX.kit();K.rbox(3,1.6,2,.2,Fl(WOOD),0,.8,0);K.half(1.5,Fl(WD2),0,1.6,0,[1,.7,.66]);K.box(3.1,.25,2.1,Mt(0xFFD43B),0,1.5,0);K.lowball(1.1,Gw(0xFFD43B),0,1.9,.3,[1.2,.5,.8]);K.lowball(3,Ha(0xFFC020),0,2,0);
   B.inst(K,B.scatter(16,(x,z,h,dd)=>dd>hw+6&&dd<40&&h>1?1+Math.random()*.4:0),{cast:false})}
  /* interativos: barris e caixotes */
  {const K=DX.kit();K.lathe([[1,0],[1.25,1],[1,2.2]],Fl(WOOD),0,0,0,null,null,10);K.cyl(1.02,1.02,.1,Fl(WD2),0,2.2,0);for(const y of[.5,1.7])K.tor(1.14,.09,Mt(0x8A8F99),0,y,0,[PI/2,0,0]);
   const pts=[];[.1,.19,.3,.44,.56,.7,.8,.88].forEach((u,i)=>{if(nearGap(u,12))return;for(let q=0;q<2;q++){const p=B.at(u+q*.003,(i%2?1:-1)*(hw-6-q*4));pts.push({x:p.x,y:p.y,z:p.z,s:1,r:q})}});B.knock(K,pts,{rad:1.8,cor:0xC89A5A,som:180})}
  {const K=DX.kit();K.def='flat';K.box(2.4,2.4,2.4,0xC89A5A,0,1.2,0);for(const a of[[0,0],[PI/2,0]]){K.box(2.6,.3,.3,WD2,0,2.25,0,[0,a[0],0]);K.box(2.6,.3,.3,WD2,0,.15,0,[0,a[0],0])}
   const pts=[];[.14,.25,.38,.5,.64,.76,.92].forEach((u,i)=>{if(nearGap(u,12))return;for(let q=0;q<2;q++){const p=B.at(u,(i%2?-1:1)*(hw-5-q*3));pts.push({x:p.x,y:p.y+0,z:p.z,s:1,r:p.h+q})}});B.knock(K,pts,{rad:1.9,cor:0xC89A5A,som:150})}
 }});
/* ordem no menu: do mais fácil para o mais difícil */
{const v=STAGES.vulcao;if(v){delete STAGES.vulcao;STAGES.vulcao=v}}
})();
