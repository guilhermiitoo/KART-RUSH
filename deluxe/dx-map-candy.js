/* ===== KART RUSH DELUXE · REINO DOCE =====
 Colinas de glacê em camadas de bolo, rio de chocolate com ponte de biscoito, ESPIRAL em volta do BOLO GIGANTE de aniversário
 (velas acesas), salto lá de cima, arcos de DONUT e floresta de pirulitos.
 Vivo: pirulitos girando, nuvens de algodão-doce flutuando, velas piscando, granulado caindo do céu.
 Interativo: ursinhos de goma e marshmallows na pista saem quicando quando alguém bate. */
if(window.PHONE)throw new Error('PHONEMODE');
(()=>{const {P,Mt,Gw,Gl,Ha,Fl,lerp,sst}=DX,PI=Math.PI;
const PINK=0xFF8FC8,CREAM=0xFFF4E0,CHOC=0x6B3A1E,MINT=0x8FE8C8,CORES=[0xFF4D9A,0xFFD43B,0x4FC8FF,0xB46BFF,0x5FE08A,0xFF7A3A];
const choc=()=>DX.liquid({base:'#5A2E14',luz:'rgba(190,120,70,.7)',rough:.18,metal:.1,env:1.2,rep:28});
DX.addMap({id:'candy',nome:'REINO DOCE',ico:'🍭',tema:'candy',dif:3,espH:30,espR:66,
 sub:'Colinas de glacê, rio de chocolate, espiral no bolo gigante, salto e arcos de donut',menu:'bolo gigante · espiral · rio de chocolate · donuts',
 pts:[[-120,220,3],[10,230,3],[130,210,5],[240,230,9],[320,150,14],[300,40,8,'ponte'],[320,-70,6],[250,-160,4],[140,-200,4,'espiral'],[20,-235,34],[-100,-205,30,'rampa'],
  [-210,-160,20],[-300,-80,12],[-330,30,6],[-250,110,3],[-240,200,3]],
 fog:[0xFFD0E8,300,1300],hemi:[0xFFF0FA,0xE89AC0,.78],sun:[0xFFF2D8,.85],sunDir:[-.5,.75,.4],dust:0xFFE0F0,
 sky:{top:0x5FB0FF,mid:0xFFB8E0,hor:0xFFF0D8,sunC:0xFFF6D0,sunD:[-.5,.75,.4],cloud:.62,cloudC:0xFFE4F4},
 road:['#B86AA8','#FFFFFF','rgba(255,255,255,.9)'],bar:[0xFF4D6D,0xFFFFFF],cone:0x8E5BE8,mm:'#E88AC8',pit:'choc',pitMat:choc,pitCor:'#6B3A1E',saia:0xF4A6C8,
 fallMsg:'🍫 CAIU NO CHOCOLATE! ⏱ 2s',
 ter:{cell:9,fall:75,bed:-4,gapDeep:10,
  nat(x,z,d){const a=DX.fbm(x*.0035+11,z*.0035+5,3);return -1+Math.pow(a,1.4)*70+sst(520,900,d)*40},
  col(x,z,h,sl){if(h<-.2)return 0x7A4424;if(sl>.9)return 0xC98A4A;if(sl>.55)return CREAM;const b=Math.floor(h/9+DX.noise(x*.01,z*.01)*1.2);return[PINK,0xFFB0D8,MINT,0xFFD8A8,0xD8B0FF][((b%5)+5)%5]}},
 placas(B){return[[.014,'LARGADA · REINO DOCE','#FF4D9A','Que delícia!'],[B.uOf(5)-.01,'RIO DE CHOCOLATE','#8A5A2B','Ponte de biscoito'],[B.uOf(8)-.01,'BOLO GIGANTE','#FFD43B','Sobe em espiral!'],
  [B.uOf(10)-.012,'SALTO DA COBERTURA','#8E5BE8','Acelera e pula!'],[B.uOf(12.5),'ARCOS DE DONUT','#FF7A3A','Passe por dentro'],[.95,'RETA FINAL','#FFD43B','Falta pouco!']]},
 cena(B,d){const hw=B.hw;
  DX.sea(B,-.6,choc(),'choc');
  DX.fall(B,{n:700,box:120,col:0xFFFFFF,vy:-3,vx:1,size:.26});
  /* pirulitos (cabo + disco com espiral) */
  const lol=c=>{const K=DX.kit();K.def='flat';K.cyl(.3,.34,9,0xFFFFFF,0,4.5,0,null,null,6);K.cyl(3,3,.8,P(c),0,10.5,0,[PI/2,0,0],null,16);for(const z of[.42,-.42])for(let i=0;i<3;i++)K.tor(.7+i*.8,.2,P(0xFFFFFF),0,10.5,z,[0,z<0?PI:0,i],PI*1.3,null,8);return K};
  CORES.slice(0,4).forEach((c,i)=>B.inst(lol(c),B.scatter(34,(x,z,h,dd)=>dd>hw+10&&dd<330&&h>0&&h<60?.8+Math.random()*.9:0)));
  /* jujubas, cupcakes e bengalas doces */
  CORES.forEach(c=>{const K=DX.kit();K.lowball(2.2,P(c),0,.2,0,[1,1.1,1]);B.inst(K,B.scatter(22,(x,z,h,dd)=>dd>hw+7&&dd<200&&h>0?.5+Math.random()*1.3:0))});
  {const K=DX.kit();K.def='flat';K.cyl(3,2.2,3,0xE8B878,0,1.5,0,null,null,10);K.lowball(3.3,P(PINK),0,3.6,0,[1,.6,1]);K.lowball(2.4,P(CREAM),0,5,0,[1,.6,1]);K.lowball(1.4,P(PINK),0,6.2,0,[1,.7,1]);K.lowball(.7,P(0xE8202A),0,7.3,0);B.inst(K,B.scatter(26,(x,z,h,dd)=>dd>hw+12&&dd<280&&h>0?.9+Math.random()*1.4:0))}
  {const K=DX.kit();
   K.tube([[0,0,0],[0,5,0],[0,8.5,0],[.8,10.2,0],[2.4,10.6,0],[3.6,9.6,0]],.5,P(0xFFFFFF),false,12);for(let i=0;i<6;i++)K.cyl(.53,.53,.5,P(0xE8202A),0,.8+i*1.4,0,null,null,6);
   B.inst(K,B.scatter(40,(x,z,h,dd)=>dd>hw+6&&dd<120&&h>0?.7+Math.random()*.6:0))}
  /* postes: bengala com bola de chiclete acesa */
  {const K=DX.kit();K.def='flat';K.cyl(.25,.3,7,0xFFFFFF,0,3.5,0,null,null,6);for(let i=0;i<6;i++)K.cyl(.27,.27,.4,0xFF4D6D,0,.8+i*1.1,0,null,null,6);K.ball(.9,Gw(0xFFE08A),0,7.6,0);K.lowball(2.6,Ha(0xFF9AD8),0,7.6,0);
   const lp=[];for(let k=0;k<32;k++){const u=k/32+.012;if(nearGap(u,10))continue;const s=k%2?1:-1,p=B.at(u,s*(hw+4));lp.push({x:p.x,y:p.y,z:p.z,s:1,r:0})}B.inst(K,lp,{cast:false})}
  /* BOLO GIGANTE no meio da espiral */
  {const e=(d.esp||[])[0];if(e){let cx=0,cz=0,n=0,ymin=1e9;for(let i=Math.round(e[0]*N);i<=Math.round(e[1]*N);i++){const j=((i%N)+N)%N;cx+=SP[j].x;cz+=SP[j].z;n++;ymin=Math.min(ymin,PISTAS.HT[j])}cx/=n;cz/=n;
    const K=DX.kit(),R0=30;[[R0,20,0xE8B070,PINK],[R0*.78,17,0xD89A5A,CREAM],[R0*.56,15,0xE8B070,MINT]].reduce((y,a,i)=>{K.cyl(a[0],a[0],a[1],Fl(a[2]),0,y+a[1]/2,0,null,null,22);K.cyl(a[0]+.6,a[0]+.6,2.4,P(a[3]),0,y+a[1]-.6,0,null,null,22);
      for(let k=0;k<16;k++){const an=k/16*PI*2;K.lowball(1.9,P(a[3]),Math.cos(an)*(a[0]+.5),y+a[1]-2.4-(k%3)*1.6,Math.sin(an)*(a[0]+.5),[1,1.5+(k%3)*.5,1]);if(i<2)K.lowball(1.5,P(0xFFFFFF),Math.cos(an+.2)*(a[0]-1.6),y+a[1]+1,Math.sin(an+.2)*(a[0]-1.6))}return y+a[1]},0);
    for(let k=0;k<6;k++){const an=k/6*PI*2,x=Math.cos(an)*9,z=Math.sin(an)*9;K.cyl(.7,.7,9,P(CORES[k]),x,56.5,z,null,null,8);K.cone(.9,2.6,Gw(0xFFD43B),x,62.4,z,null,null,6);K.lowball(3,Ha(0xFFB020),x,62.4,z)}
    K.ball(3.4,P(0xE8202A),0,55.4,0);K.limb([0,58,0],[1.5,62,0],.25,Fl(0x3FA34D));const g=B.put(K,cx,ymin-1,cz,0)}}
  /* arcos de donut por cima da pista */
  [12.25,12.75,13.25].forEach((k,i)=>{const p=B.at(B.uOf(k),0),K=DX.kit(),R=hw+9;K.tor(R,6.5,Fl(0xE0A868),0,0,0,null,0,null,22);K.tor(R,6.9,P(CORES[i*2]),0,0,0,[0,0,0],PI,[1,1,1.02],22);
   for(let s=0;s<40;s++){const a=Math.random()*PI,b=(Math.random()-.5)*2;K.box(1.6,.5,.5,P(CORES[s%6]),Math.cos(a)*(R+b*4),Math.sin(a)*(R+b*4)+0,(Math.random()<.5?-1:1)*(6.6-Math.abs(b)*2.6),[0,0,Math.random()*3])}
   const g=B.put(K,p.x,p.y+2,p.z,p.h)});
  /* montanhas de sorvete no horizonte */
  {const K=DX.kit();K.def='flat';K.cone(46,90,0xE8B878,0,45,0,[PI,0,0],null,10);K.ball(48,P(PINK),0,106,0);K.ball(38,P(CREAM),10,150,-4);K.ball(28,P(MINT),-4,186,6);K.ball(7,P(0xE8202A),-4,216,6);
   B.inst(K,B.scatter(7,(x,z,h,dd)=>dd>330&&dd<520?.8+Math.random()*.7:0),{cast:false,dy:-8})}
  /* nuvens de algodão-doce flutuando */
  {const cl=[];for(let i=0;i<12;i++){const K=DX.kit(),c=i%2?0xFFC0E4:0xBFE4FF;for(let k=0;k<6;k++)K.lowball(8+Math.random()*7,c,(k-2.5)*9,Math.sin(k*2)*3,Math.cos(k*3)*5);const u=i/12,p=B.at(u,(i%2?1:-1)*(hw+60+i*9)),g=B.put(K,p.x,p.y+60+(i%4)*14,p.z,i);g.traverse(o=>{o.castShadow=false});cl.push(g)}
   B.anim(t=>cl.forEach((g,i)=>{g.position.y+=Math.sin(t*.5+i)*.012;g.rotation.y+=.0004}))}
  /* cata-ventos de pirulito girando na largada */
  {const gs=[];[.03,.06,.975].forEach((u,i)=>{const K=DX.kit();K.cyl(.6,.8,22,P(0xFFFFFF),0,11,0,null,null,8);const W=K.sub('w',0,23,1);for(let k=0;k<8;k++)W.ext([[0,0],[9,2.4],[9,-2.4]],.5,P(CORES[k%6]),0,0,0,[0,0,k/8*PI*2]);W.cyl(1.6,1.6,1.4,P(0xFFFFFF),0,0,.3,[PI/2,0,0]);
    const p=B.at(u,(i%2?1:-1)*(hw+22));gs.push(B.put(K,p.x,p.y-1,p.z,p.h+(i%2?-1:1)*PI/2).userData.parts.w)});B.anim((t,dt)=>gs.forEach((w,i)=>w.rotation.z+=dt*(1.2+i*.4)))}
  /* RODA-GIGANTE DOCE no meio do mapa: cabines de cupcake com bichinhos de goma acenando */
  {const c=B.centro(70),R=30,Hc=R+8,K=DX.kit();K.def='flat';
   for(const z of[-5,5])for(const s of[-1,1])K.limb([s*18,0,z*2.2],[0,Hc,z],1.1,P(0xFFFFFF));for(const z of[-5,5])for(const s of[-1,1])for(let i=0;i<5;i++)K.cyl(1.2,1.2,1.4,P(0xFF4D6D),s*(18-i*3.6)*.98,1.6+i*7.2,z*(2.2-i*.24),[0,0,s*.45],null,8);
   K.cyl(12,13,2,Fl(0xFFC6E2),0,1,0,null,null,16);K.cyl(1.4,1.4,12,Mt(0xD5DAE2),0,Hc,0,[PI/2,0,0]);
   const Wh=K.sub('roda',0,Hc,0);Wh.tor(R,.9,P(0xFF4D9A),0,0,-4.4,null,0,null,40);Wh.tor(R,.9,P(0x4FC8FF),0,0,4.4,null,0,null,40);Wh.tor(R*.45,.6,P(0xFFD43B),0,0,0,null,0,null,24);Wh.ball(3,P(0xFFFFFF),0,0,0);
   for(let i=0;i<12;i++){const a=i/12*PI*2,x=Math.cos(a)*R,y=Math.sin(a)*R;for(const z of[-4.4,4.4])Wh.limb([0,0,z],[x,y,z],.45,P(0xFFFFFF));Wh.limb([x,y,-4.4],[x,y,4.4],.4,P(0xFFFFFF));
    for(let l=0;l<3;l++){const b=a+(l+.5)/36*PI*2;Wh.lowball(.7,Gw([0xFFE14A,0xFF7CD8,0x7CF7FF][(i+l)%3]),Math.cos(b)*(R+.9),Math.sin(b)*(R+.9),-4.4);Wh.lowball(.7,Gw([0xFFE14A,0xFF7CD8,0x7CF7FF][(i+l+1)%3]),Math.cos(b)*(R+.9),Math.sin(b)*(R+.9),4.4)}}
   const cab=[];for(let i=0;i<10;i++){const a=i/10*PI*2,Cb=Wh.sub('c'+i,Math.cos(a)*R,Math.sin(a)*R,0),cc=CORES[i%6];Cb.limb([0,0,0],[0,-2.4,0],.2,Mt(0xD5DAE2));
    Cb.cyl(2.6,2,3.2,Fl(0xE8B878),0,-5.6,0,null,null,10);Cb.half(2.9,P(cc),0,-2.6,0,[1,.75,1]);Cb.ball(.5,P(0xE8202A),0,-.6,0);
    for(const s of[-1,1]){const bc=CORES[(i+3+(s>0?1:0))%6],Bh=Cb.sub('b'+i+s,s*1,-3.6,0);Bh.ball(.7,P(bc),0,0,0,[1,1.15,.9]);Bh.ball(.62,P(bc),0,1.05,0);Bh.lowball(.26,P(bc),-.42,1.55,0);Bh.lowball(.26,P(bc),.42,1.55,0);Bh.lowball(.09,0x2A1A20,-.22,1.15,.55);Bh.lowball(.09,0x2A1A20,.22,1.15,.55);
     const Ar=Bh.sub('a'+i+s,s*.6,.4,0);Ar.limb([0,0,0],[s*.5,.9,0],.22,P(bc))}cab.push(Cb)}
   const g=B.put(K,c.x,c.y-.5,c.z,Math.random()*PI),q=g.userData.parts;
   B.anim((t,dt)=>{q.roda.rotation.z+=dt*.16;for(let i=0;i<10;i++){const Cb=q['c'+i];Cb.rotation.z=-q.roda.rotation.z+Math.sin(t*1.6+i)*.08;for(const s of[-1,1]){const A=q['a'+i+s];if(A)A.rotation.z=s*(.3+Math.max(0,Math.sin(t*5+i+s))*1.1)}}})}
  /* interativos: ursinhos de goma e marshmallows */
  CORES.slice(0,3).forEach((c,ci)=>{const K=DX.kit();K.ball(1,P(c),0,1.2,0,[1,1.2,.85]);K.ball(.8,P(c),0,2.8,0);for(const s of[-1,1]){K.lowball(.32,P(c),s*.6,3.5,0);K.lowball(.42,P(c),s*1,1.7,.3);K.lowball(.45,P(c),s*.55,.3,.3)}K.lowball(.1,0x2A1A20,-.3,3,.7);K.lowball(.1,0x2A1A20,.3,3,.7);K.lowball(.2,P(0xFFFFFF),0,2.65,.72,[1,.7,.6]);
   const pts=[];[.09,.2,.34,.47,.62,.74,.83,.91].forEach((u,i)=>{if(i%3!==ci||nearGap(u,12))return;for(let q=0;q<2;q++){const p=B.at(u+q*.004,(i%2?1:-1)*(hw-6-q*5));pts.push({x:p.x,y:p.y,z:p.z,s:1,r:p.h+PI})}});B.knock(K,pts,{rad:1.8,cor:c,som:420})});
  {const K=DX.kit();K.cyl(1.3,1.3,1.6,0xFFFFFF,0,.8,0,null,null,12);K.cyl(1.32,1.32,.3,P(PINK),0,.8,0,null,null,12);const pts=[];[.13,.27,.4,.55,.69,.79,.88].forEach((u,i)=>{if(nearGap(u,12))return;for(let q=0;q<3;q++){const p=B.at(u,(i%2?-1:1)*(hw-5-q*3.2));pts.push({x:p.x,y:p.y+(q===2?0:0),z:p.z,s:1,r:q})}});B.knock(K,pts,{rad:1.6,cor:0xFFFFFF,som:260})}
 }});
})();
