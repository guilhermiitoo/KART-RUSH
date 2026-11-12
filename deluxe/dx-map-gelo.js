/* ===== KART RUSH DELUXE · PICO GELADO =====
 Noite polar com aurora boreal. Largada na vila dos iglus, subida pela montanha, CAVERNA DE CRISTAL, salto sobre a fenda,
 descida até o LAGO CONGELADO (escorrega!), ponte sobre a água e volta pela floresta de pinheiros.
 Vivo: boneco de neve gigante acenando, teleférico passando por cima da pista, cristais pulsando, neve caindo.
 Interativo: bonecos de neve e pinguins na beira da pista saem voando quando alguém bate. */
if(window.PHONE)throw new Error('PHONEMODE');
(()=>{const {P,Mt,Gw,Gl,Ha,Fl,lerp,sst}=DX,PI=Math.PI;
const SNOW=0xF2F8FF,ICE=0x9FD8F0;
DX.addMap({id:'gelo',nome:'PICO GELADO',ico:'❄️',tema:'gelo',dif:2,
 sub:'Vila dos iglus, caverna de cristal, salto na fenda, lago congelado e aurora boreal',menu:'caverna de cristal · lago congelado · aurora',
 pts:[[-160,230,2],[-40,240,2],[80,225,2],[190,235,4],[290,180,9],[320,80,16],[280,-20,22],[300,-120,22],[230,-200,16,'rampa'],[110,-225,10],[-10,-190,4],
  [-90,-110,1],[-170,-180,1],[-270,-150,4,'ponte'],[-320,-50,6],[-250,30,8],[-310,120,5],[-270,200,3]],
 gelo:[[10,11,-20,20],[11,12,-24,24]],tuneis:[[6.05,6.95]],
 fog:[0x5B7FC0,260,1250],hemi:[0xBFD8FF,0x40507A,.72],sun:[0xCFE0FF,.8],sunDir:[.45,.8,.35],dust:0xF4FAFF,
 sky:{top:0x060B2A,mid:0x1B3A80,hor:0x6FA8D8,sunC:0xDDEBFF,sunD:[.45,.8,.35],cloud:.25,cloudC:0x8FA8D8,stars:1,aur:1},
 road:['#5A6F86','#7FDBFF','rgba(255,255,255,.9)'],bar:[0x7FDBFF,0xFFFFFF],cone:0xFF7A00,mm:'#8FB3C7',pit:'agua',saia:0x8FA8C8,
 fallMsg:'💧 CAIU NA ÁGUA GELADA! ⏱ 2s',
 ter:{cell:9,fall:80,bed:-4,gapDeep:16,
  nat(x,z,d){let h=5+DX.fbm(x*.004+3,z*.004+7,4)*46;const pk=Math.exp(-(((x-520)/190)**2+((z+90)/210)**2));h+=pk*150;
   const lk=Math.exp(-(((x+250)/170)**2+((z+210)/130)**2));h=lerp(h,-4,Math.min(1,lk*1.5));return h+sst(500,900,d)*60},
  col(x,z,h,sl){if(h<.2)return 0x7FB8D8;if(sl>.95)return 0x6C7F9C;if(sl>.6)return 0xB8CCE4;return h>70?0xFFFFFF:(DX.noise(x*.03,z*.03)>.55?0xE4EEFA:SNOW)}},
 placas(B){return[[.014,'LARGADA · PICO GELADO','#258BFF','Bem-vindo ao frio!'],[B.uOf(5.6),'CAVERNA DE CRISTAL','#8E5BE8','Segue as luzes'],[B.uOf(8)-.01,'SALTO DA FENDA','#22D3FF','Acelera e pula!'],
  [B.uOf(10),'LAGO CONGELADO','#47D7A0','Escorrega: vire com calma'],[.95,'RETA FINAL','#FFD43B','Falta pouco!']]},
 cena(B,d){const hw=B.hw,X=d.dx;
  /* lago: gelo liso que reflete a aurora */
  DX.sea(B,.35,DX.liquid({base:'#5FA8D0',luz:'rgba(235,250,255,.75)',risco:'rgba(255,255,255,.8)',rough:.06,metal:.5,env:1.6,rep:26}),'agua',false);
  DX.fall(B,{n:1500,box:130,col:0xFFFFFF,vy:-7,vx:2,size:.34});
  /* pinheiros nevados (2 tamanhos) */
  const pine=()=>{const K=DX.kit();K.def='flat';K.cyl(.5,.7,2.4,0x5A3E2A,0,1.2,0,null,null,6);[[4,5,3.6,0x1F6A4A],[3.1,4.4,6.2,0x237A54],[2.1,3.8,8.6,0x2A8A60]].forEach((a,i)=>{K.cone(a[0],a[1],a[3],0,a[2],0,null,null,7);K.cone(a[0]*.74,a[1]*.5,SNOW,0,a[2]+a[1]*.27,0,null,null,7)});return K};
  B.inst(pine(),B.scatter(230,(x,z,h,dd)=>dd>hw+12&&dd<420&&h>1&&h<70?.8+Math.random()*.9:0),{tilt:.08});
  /* pedras com capa de neve e cristais de gelo que brilham */
  const rock=DX.kit();rock.def='flat';rock.ico(3,0x6C7F9C,0,1.4,0,[1.3,.8,1.1]);rock.ico(2.4,SNOW,.2,2.5,0,[1.2,.45,1]);
  B.inst(rock,B.scatter(70,(x,z,h,dd)=>dd>hw+9&&dd<300&&h>0?.7+Math.random()*1.8:0));
  const cris=DX.kit();[[0,0,0,1,0],[1.2,0,.5,.6,.5],[-.9,0,.8,.7,-.4],[.3,0,-1,.5,.3]].forEach(a=>{cris.cone(.9*a[3],6*a[3],Gw(0x7FE8FF),a[0],3*a[3],a[1]+a[2],[a[4]*.4,0,a[4]],null,5);cris.cone(.9*a[3],1.6*a[3],Gw(0x7FE8FF),a[0],-.2,a[1]+a[2],[PI+a[4]*.4,0,a[4]],null,5)});cris.lowball(4.5,Ha(0x4FC8FF),0,2.5,0);
  const cp=B.scatter(46,(x,z,h,dd)=>dd>hw+7&&dd<90&&h>0?.6+Math.random()*1.1:0);const cm=B.inst(cris,cp,{cast:false});
  B.anim(t=>{DX.mats.halo.opacity=.24+Math.sin(t*2)*.06});
  /* postes com lanterna quente ao longo da pista */
  const lamp=DX.kit();lamp.def='flat';lamp.cyl(.22,.3,7,0x3A4660,0,3.5,0,null,null,6);lamp.box(2,.25,.25,0x3A4660,.8,7,0);lamp.cyl(.5,.35,.9,Gw(0xFFD27A),1.6,6.4,0,null,null,6);lamp.cone(.7,.5,0x3A4660,1.6,7.1,0,null,null,6);lamp.lowball(2.6,Ha(0xFFB84A),1.6,6.4,0);
  const lp=[];for(let k=0;k<34;k++){const u=k/34+.01;if(nearGap(u,10))continue;const s=k%2?1:-1,p=B.at(u,s*(hw+4));lp.push({x:p.x,y:p.y,z:p.z,s:1,r:p.h+(s>0?PI/2:-PI/2)})}B.inst(lamp,lp,{cast:false});
  /* vila dos iglus na largada */
  const ig=DX.kit();ig.def='flat';ig.half(6,SNOW,0,0,0);ig.cyl(2.4,2.4,4,0xE4EEFA,0,1.2,5.2,[PI/2,0,0],null,8);ig.cyl(1.7,1.7,.3,Gw(0xFFC060),0,1.3,7.2,[PI/2,0,0],null,8);ig.lowball(4,Ha(0xFFA030),0,1.5,8);
  for(let i=0;i<7;i++){ig.box(1.6,.12,.12,0xC9D8EA,Math.cos(i)*4.6,2+i*.5%3,Math.sin(i)*4.6,[0,-i,0])}
  B.inst(ig,[.02,.05,.08,.97,.94].map((u,i)=>{const s=i%2?1:-1,p=B.at(u,s*(hw+16+i*2));return{x:p.x,y:p.y-.3,z:p.z,s:1+i*.08,r:p.h+(s>0?PI/2:-PI/2)}}),{cast:true});
  /* boneco de neve gigante que acena */
  {const K=DX.kit();K.ball(7,SNOW,0,6,0);K.ball(5.2,SNOW,0,15,0);K.tor(4.2,1.1,P(0xD9313F),0,18.6,0,[PI/2,0,0]);K.rbox(1.8,5,.8,.3,P(0xB8242F),3.4,15.6,3.2,[.2,0,-.2]);for(let i=0;i<3;i++)K.ball(.6,0x1A1A22,0,11+i*2.4,4.8-i*.4);
   const H=K.sub('head',0,21,0);H.ball(3.8,SNOW,0,2,0);H.cone(.7,3.6,P(0xFF7A1A),0,2,4.6,[PI/2,0,0]);H.ball(.55,0x14141C,-1.3,3,3.3);H.ball(.55,0x14141C,1.3,3,3.3);for(let i=0;i<5;i++)H.ball(.3,0x14141C,-1.4+i*.7,.6-Math.sin(i/4*PI)*.6,3.5);
   H.cyl(4.2,4.2,.4,0x14141C,0,5.2,0);H.cyl(2.8,2.8,3.6,0x14141C,0,7,0);H.cyl(2.85,2.85,.8,P(0xD9313F),0,5.9,0);
   const A=K.sub('arm',5,16.5,0);A.limb([0,0,0],[6,4,0],.4,0x5A3E2A);A.limb([6,4,0],[7.5,6.5,.5],.3,0x5A3E2A);A.limb([6,4,0],[8.2,4.4,-.4],.3,0x5A3E2A);K.limb([-5,16.5,0],[-10.5,13,1],.4,0x5A3E2A);
   const p=B.at(.035,-(hw+34)),g=B.put(K,p.x,p.y-1,p.z,p.h+PI/2+.5,1.15),q=g.userData.parts;B.anim(t=>{q.arm.rotation.z=.3+Math.sin(t*3.2)*.45;q.head.rotation.z=Math.sin(t*1.1)*.08;q.head.rotation.y=Math.sin(t*.6)*.4})}
  /* teleférico cruzando por cima da pista */
  {const a=B.at(B.uOf(2.4),hw+60),b=B.at(B.uOf(2.4),-(hw+60)),ya=a.y+38,yb=b.y+46,K=DX.kit();K.def='flat';
   for(const e of[[a,ya],[b,yb]]){K.cyl(1,1.6,e[1]-e[0].y+2,0x4A5878,e[0].x,(e[1]+e[0].y)/2,e[0].z,null,null,6);K.box(7,1,2,0x3A4660,e[0].x,e[1],e[0].z,[0,a.h,0])}
   K.limb([a.x,ya,a.z],[b.x,yb,b.z],.14,0x1A1A22);B.add(K.build());
   const gk=()=>{const G=DX.kit();G.limb([0,0,0],[0,-4,0],.1,0x1A1A22);G.rbox(4.4,3.6,3.2,.8,P(0xD9313F),0,-5.8,0);G.rbox(4.5,1.4,3.3,.3,Gl(0xBFE8FF),0,-5.2,0);G.box(4.6,.3,3.4,P(0xFFFFFF),0,-7,0);G.lowball(1,Gw(0xFFD27A),0,-7.9,0);return G};
   const gs=[0,1,2,3].map(()=>B.put(gk(),0,0,0,a.h));B.anim(t=>gs.forEach((g,i)=>{const u=((t*.035+i/4)%1),w=u<.5?u*2:2-u*2;g.position.set(lerp(a.x,b.x,w),lerp(ya,yb,w),lerp(a.z,b.z,w));g.rotation.z=Math.sin(t*1.3+i)*.06}))}
  /* caverna de cristal */
  X.tun.forEach(([i0,i1])=>{B.tunnel(i0,i1,{col:0x3E5E9A,em:0x2A6AD8,luz:0x7FE8FF,portal:0xCFE8FF,step:6});
   const K=DX.kit();for(let i=i0+2;i<i1;i+=5){const j=((i%N)+N)%N,s=(i%2?1:-1)*(hw+1.5),x=SP[j].x+RT[j].x*s,z=SP[j].z+RT[j].z*s,y=PISTAS.HT[j];K.cone(1.1,6,Gw(i%3?0x7FE8FF:0xC66BFF),x,y+3,z,[0,0,-Math.sign(s)*.35],null,5);K.cone(.7,3.4,Gw(0xFFFFFF),x+RT[j].x*-Math.sign(s)*1.5,y+1.7,z+RT[j].z*-Math.sign(s)*1.5,null,null,5)}B.add(K.build({noShadow:true}))});
  /* castelo de gelo no morro */
  {const p=B.at(B.uOf(15.2),-(hw+70)),K=DX.kit();const tw=(x,z,r,h)=>{K.cyl(r*.85,r,h,Gl(0xBFEFFF),x,h/2,z,null,null,8);K.cyl(r*.85,r,h,Fl(0x9FD8F0),x,h/2,z,null,[.9,1,.9],8);K.cone(r*1.2,r*2.6,Gw(0x7FE8FF),x,h+r*1.3,z,null,null,8)};
   tw(0,0,7,34);tw(-13,4,4.5,22);tw(13,4,4.5,24);tw(-7,-9,3.5,28);tw(8,-9,3.5,18);K.box(26,10,3,Fl(0xBFE4F8),0,5,6);K.lowball(26,Ha(0x4FC8FF),0,16,0);B.put(K,p.x,p.y-1,p.z,p.h)}
  /* interativos: bonecos de neve e pinguins na beira da pista */
  const sm=DX.kit();sm.ball(1.3,SNOW,0,1.2,0);sm.ball(.95,SNOW,0,2.9,0);sm.cone(.2,.9,P(0xFF7A1A),0,2.95,1,[PI/2,0,0],null,6);sm.lowball(.13,0x14141C,-.35,3.2,.8);sm.lowball(.13,0x14141C,.35,3.2,.8);sm.cyl(.7,.7,.9,0x14141C,0,4,0,null,null,8);sm.cyl(1,1,.12,0x14141C,0,3.6,0,null,null,8);sm.tor(.75,.22,P(0x34C759),0,2.2,0,[PI/2,0,0]);
  const sp=[];[.1,.16,.22,.3,.42,.52,.8,.86,.9].forEach((u,i)=>{if(nearGap(u,12))return;const p=B.at(u,(i%2?1:-1)*(hw-7-i%3*3));sp.push({x:p.x,y:p.y,z:p.z,s:1,r:p.h+PI})});B.knock(sm,sp,{rad:2,cor:0xFFFFFF,som:300});
  const pg=DX.kit();pg.ball(.9,0x1E2430,0,1.1,0,[1,1.35,1]);pg.ball(.7,0xFFFFFF,0,1,.35,[.9,1.25,.7]);pg.ball(.6,0x1E2430,0,2.5,0);pg.cone(.2,.5,P(0xFFB020),0,2.45,.65,[PI/2,0,0],null,5);pg.lowball(.1,0xFFFFFF,-.25,2.7,.5);pg.lowball(.1,0xFFFFFF,.25,2.7,.5);pg.ball(.3,P(0xFFB020),-.4,.12,.35,[1,.4,1.5]);pg.ball(.3,P(0xFFB020),.4,.12,.35,[1,.4,1.5]);pg.ball(.3,0x1E2430,-.95,1.3,0,[.4,1.5,.8]);pg.ball(.3,0x1E2430,.95,1.3,0,[.4,1.5,.8]);
  const pp=[];for(let k=0;k<12;k++){const u=B.uOf(10.3)+k*(B.uOf(12.6)-B.uOf(10.3))/12,p=B.at(u,(k%2?1:-1)*(hw-5-(k%4)*4));pp.push({x:p.x,y:p.y,z:p.z,s:1,r:p.h+PI+(k%3-1)*.6})}B.knock(pg,pp,{rad:1.7,cor:0xDFF4FF,som:520});
 }});
})();
