/* ===== KART RUSH DELUXE · VULCÃO MALUCO: MODO INFERNO =====
 O Vulcão vira um mapa assustador (sem ser pesado): céu vermelho-sangue com raios e trovões, um DEMÔNIO GIGANTE saindo do
 mar de lava no meio do mapa (olhos que seguem os karts e boca que cospe fogo), fantasmas rodeando a pista, mãos que saem
 da lava e tentam agarrar, gaiolas com esqueletos balançando, ilhotas de cemitério com velas, morcegos e gêiseres de fogo
 que avisam antes de explodir. Interativo: abóboras-lanterna na beira da pista saem voando quando alguém bate.
 Tudo é acrescentado DEPOIS do cenário original (o Editor de Cenário continua achando os objetos antigos no mesmo lugar). */
if(window.PHONE)throw new Error('PHONEMODE');
(()=>{const d=STAGES.vulcao;if(!d)return;const {P,Mt,Gw,Ha,Sf,Fl,lerp}=DX,PI=Math.PI,HT=PISTAS.HT,ts=i=>((i%N)+N)%N;
Object.assign(d,{sky:0x1A0505,fogC:0x2A0A08,fogN:150,fogF:780,hemi:[0xFF8A6A,0x2A0606,.6],sun:[0xFF5A2A,.75],
 sub:'Modo inferno: demônio gigante, fantasmas, mãos na lava, gaiolas, túnel de lava, espiral e ponte que desmorona',menu:'demônio gigante · fantasmas · túnel de lava · ponte'});
const near=(x,z)=>{let b=0,bd=1e18;for(let i=0;i<N;i+=2){const q=(SP[i].x-x)**2+(SP[i].z-z)**2;if(q<bd){bd=q;b=i}}return{i:b,d:Math.sqrt(bd)}};
d.dx={sky:{top:0x080102,mid:0x3A0606,hor:0x9A2A0A,sunC:0xFF4A1A,sunD:[-.3,.25,.9],cloud:.75,cloudC:0x4A1410,stars:.25},sunDir:[-.4,.75,.5],dust:0x5A3A34,anim:[],knock:[],
 ground:(x,z)=>{const n=near(x,z);return n.d<W/2+3?HT[n.i]:-.4}};
const X=d.dx;
on('build',(dd,w)=>{if(dd!==d)return;X.anim=[];X.knock=[];const hw=W/2;
 let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;SP.forEach(p=>{x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);z0=Math.min(z0,p.z);z1=Math.max(z1,p.z)});
 X.T={ground:X.ground,dist:(x,z)=>near(x,z).d,x0,x1,z0,z1};const B=DX.mapKit.tools(d);
 const lado=(u,l)=>{const i=ts(Math.round(u*N)),ll=lx(i,l);return{x:SP[i].x+RT[i].x*ll,z:SP[i].z+RT[i].z*ll,y:HT[i],h:Math.atan2(TG[i].x,TG[i].z),i}};

 /* ---------- DEMÔNIO GIGANTE no meio do mapa ---------- */
 {const cx=(x0+x1)/2,cz=(z0+z1)/2;let best=null;for(let gx=-8;gx<=8;gx++)for(let gz=-8;gz<=8;gz++){const x=cx+gx*(x1-x0)/18,z=cz+gz*(z1-z0)/18,dd=near(x,z).d,sc=dd-.25*Math.hypot(x-cx,z-cz);if(!best||sc>best.sc)best={x,z,sc,dd}}
  const S=clamp((best.dd-30)/62,.55,1.25),K=DX.kit(),Rd=Fl(0x4A0E0C),Dk=Fl(0x1A0606),Hn=Fl(0x2A1A16),Ey=Gw(0xFFB020);K.def='flat';
  /* ombros e garras agarrando a beira da lava */
  K.ico(26,Rd,-34,4,6,[1,.7,.9],null,1);K.ico(26,Rd,34,4,6,[1,.7,.9],null,1);
  for(const s of[-1,1]){K.ico(9,Rd,s*40,1,32,[1.3,.5,1.2],null,1);for(let f=0;f<4;f++)K.cone(2.2,10,Hn,s*(32+f*5.5),2,40+Math.abs(f-1.5)*1.5,[PI/2+.5,0,0],null,5)}
  const H=K.sub('head',0,30,0);H.ico(24,Rd,0,12,0,[1,1.05,.95],null,2);H.ico(10,Rd,0,4,18,[1.6,.5,.7],null,1);
  /* chifres curvos (segmentos), olhos acesos, nariz e sobrancelha */
  for(const s of[-1,1]){let x=s*15,y=26,z=-2,r=5.5;for(let k=0;k<6;k++){const nx=x+s*(5-k*.3),ny=y+5+k*1.5,nz=z-1.5;H.limb([x,y,z],[nx,ny,nz],r,Hn);x=nx;y=ny;z=nz;r*=.78}H.cone(r*1.3,7,Hn,x+s*1,y+3,z,[0,0,-s*.4],null,6);
   H.ball(5.5,Dk,s*9,13,19,[1.2,.9,.6]);H.ball(3,Ey,s*9,13,21.5,[1.2,.9,.6]);H.lowball(9,Ha(0xFF7A1A),s*9,13,22);H.rbox(12,3,5,1.2,Rd,s*8.5,18.5,18,[.3,0,s*-.35])}
  H.cone(2.5,5,Dk,-1.6,7,22,[-.5,0,.3],null,4);H.cone(2.5,5,Dk,1.6,7,22,[-.5,0,-.3],null,4);
  for(let t=0;t<8;t++)H.cone(1.6,5,Fl(0xF2E8D0),-9.8+t*2.8,1.6,20.5-Math.abs(t-3.5)*.6,[PI,0,0],null,4);
  const J=H.sub('jaw',0,1,4);J.ico(14,Rd,0,-5,8,[1.25,.55,1.1],null,1);J.ball(9,Gw(0xFF5A1A),0,-2,10,[1.2,.4,1]);for(let t=0;t<7;t++)J.cone(1.5,4.6,Fl(0xF2E8D0),-8.4+t*2.8,-.5,19-Math.abs(t-3)*.8,null,null,4);
  const g=B.put(K,best.x,-14,best.z,0,S),q=g.userData.parts;let fogo=6,abre=0;
  X.anim.push((t,dt)=>{/* olha para o kart humano mais perto */let tg=null,bd=1e18;for(const k of (typeof humans!=='undefined'&&humans.length?humans:karts)){const dq=(k.x-g.position.x)**2+(k.z-g.position.z)**2;if(dq<bd){bd=dq;tg=k}}
   if(tg){const a=Math.atan2(tg.x-g.position.x,tg.z-g.position.z);q.head.rotation.y+=wrap(a-q.head.rotation.y)*(1-Math.exp(-1.2*dt))}
   q.head.rotation.x=Math.sin(t*.7)*.04;q.head.position.y=30+Math.sin(t*.9)*1.2;
   fogo-=dt;if(fogo<0){abre=Math.min(1,abre+dt*2.5);if(fogo<-2.2){fogo=5+Math.random()*4}}else abre=Math.max(0,abre-dt*1.5);q.jaw.rotation.x=abre*.55+Math.sin(t*3)*.03;
   if(abre>.6&&state!=='menu'){q.jaw.updateWorldMatrix(true,false);const p=new THREE.Vector3(0,-1,22).applyMatrix4(q.jaw.matrixWorld),dir=new THREE.Vector3(0,-.3,1).transformDirection(q.head.matrixWorld);
    for(let n=0;n<6;n++)DX.spark({x:p.x,y:p.y,z:p.z,vx:dir.x*48+(Math.random()-.5)*10,vy:dir.y*48+(Math.random()-.2)*10,vz:dir.z*48+(Math.random()-.5)*10,life:.9,s0:5*S,s1:1,col:n%2?0xFF7A1A:0xFFD43B,g:-4,d:.8})}})}

 /* ---------- fantasmas rodeando a pista ---------- */
 {const Gh=DX.kit();Gh.lathe([[0,4],[1.6,3.6],[2.4,2],[2.6,0],[2.2,-1.2],[2.8,-2.2]],Sf(0xEFF4FF),0,0,0,null,null,14);for(let i=0;i<7;i++){const a=i/7*PI*2;Gh.lowball(.8,Sf(0xEFF4FF),Math.cos(a)*2.5,-2.2,Math.sin(a)*2.5)}
  Gh.ball(.55,0x111018,-.8,2.2,2.1,[.8,1.3,.4]);Gh.ball(.55,0x111018,.8,2.2,2.1,[.8,1.3,.4]);Gh.ball(.7,0x111018,0,.8,2.3,[.8,1.1,.4]);Gh.lowball(4.5,Ha(0x9FD8FF),0,1,0);
  for(const s of[-1,1]){const a=Gh.sub('b'+s,s*2.2,1,0);a.limb([0,0,0],[s*1.8,1.4,.8],.55,Sf(0xEFF4FF))}
  const gs=[];for(let i=0;i<10;i++){const g=B.put(Gh,0,0,0,0,1.4);gs.push({g,u:i/10,lat:(i%2?1:-1)*(hw+12+(i%3)*8),ph:i*1.7})}
  X.anim.push(t=>{for(const o of gs){const u=(o.u+t*.004)%1,cross=Math.max(0,Math.sin(t*.35+o.ph)),p=lado(u,o.lat*(1-cross*1.2));o.g.position.set(p.x,p.y+10+Math.sin(t*2+o.ph)*2+cross*4,p.z);o.g.rotation.y=p.h+PI/2*(o.lat>0?-1:1)+Math.sin(t+o.ph)*.4;
   const q=o.g.userData.parts;q['b-1'].rotation.z=Math.sin(t*3+o.ph)*.5;q.b1.rotation.z=-Math.sin(t*3+o.ph+1)*.5}})}

 /* ---------- mãos saindo da lava ---------- */
 {const Hd=DX.kit();const C=Fl(0x8A9A7A);Hd.limb([0,-6,0],[0,0,0],1.1,C);Hd.rbox(2.6,2.6,1.2,.4,C,0,1.2,0);const fg=[];
  for(let f=0;f<5;f++){const x=f<4?-1+f*.66:1.6,y=f<4?2.5:1.2,F=Hd.sub('f'+f,x,y,0,f<4?null:[0,0,-.9]);F.limb([0,0,0],[0,1.4,0],.3,C);const F2=F.sub('g'+f,0,1.5,0);F2.limb([0,0,0],[0,1.1,0],.26,C);F2.cone(.25,.5,Fl(0x2A2A1A),0,1.4,0,null,null,4)}
  const ms=[];[.08,.17,.29,.37,.46,.58,.66,.74,.83,.9].forEach((u,i)=>{if(nearGap(u,10))return;const s=i%2?1:-1,p=lado(u,s*(hw+9));const g=B.put(Hd,p.x,-8,p.z,p.h+(s>0?-PI/2:PI/2),1.4);ms.push({g,ph:i*1.9,y:p.y})});
  X.anim.push((t,dt)=>{for(const m of ms){const c=(t*.32+m.ph)%3.2,up=c<.5?c/.5:c<2.2?1:c<2.7?1-(c-2.2)/.5:0,grab=c>1.2&&c<2?Math.sin((c-1.2)/.8*PI):0;m.g.position.y=-9+up*(m.y+9);m.g.rotation.z=Math.sin(t*2+m.ph)*.15;
   const q=m.g.userData.parts;for(let f=0;f<5;f++){q['f'+f].rotation.x=grab*1.1;q['g'+f].rotation.x=grab*1.3}
   if(up>.95&&c<.55)DX.burst('spark',m.g.position.x,0,m.g.position.z,2,{sp:4,up:6,col:[0xFF7A1A,0xFFD43B],s0:.8,s1:.1,life:.5})}})}

 /* ---------- forcas com gaiolas e esqueletos balançando sobre a lava ---------- */
 {const ms=[];[.12,.33,.52,.7,.87].forEach((u,i)=>{if(nearGap(u,12))return;const s=i%2?-1:1,p=lado(u,s*(hw+10)),K=DX.kit();K.def='flat';
   K.cyl(4,5,6,Fl(0x2A1E1C),0,-2,0,null,null,6);K.cyl(.7,.9,22,0x3A2A22,0,12,0,null,null,6);K.box(13,.9,.9,0x3A2A22,-6,22.5,0);K.limb([0,17,0],[-4,22.3,0],.35,0x3A2A22);
   const C=K.sub('cage',-11,22,0);C.limb([0,0,0],[0,-4,0],.12,Mt(0x5A5A60));C.cyl(2.2,2.2,.3,Mt(0x3A3A40),0,-4.2,0,null,null,10);C.cyl(2.2,2.2,.3,Mt(0x3A3A40),0,-11,0,null,null,10);for(let b=0;b<8;b++){const a=b/8*PI*2;C.cyl(.1,.1,6.8,Mt(0x3A3A40),Math.cos(a)*2.1,-7.6,Math.sin(a)*2.1,null,null,4)}
   C.ball(.9,0xEDE6D6,0,-6.4,0);C.lowball(.25,0x111111,-.35,-6.3,.75);C.lowball(.25,0x111111,.35,-6.3,.75);for(let r=0;r<3;r++)C.tor(.65-r*.08,.08,0xEDE6D6,0,-7.8-r*.45,0,[PI/2,0,0]);C.limb([-.4,-8.2,0],[-1.6,-6.6,.4],.12,0xEDE6D6);C.limb([.4,-8.2,0],[1.5,-9.6,.3],.12,0xEDE6D6);
   const g=B.put(K,p.x,0,p.z,p.h+(s>0?0:PI));ms.push({c:g.userData.parts.cage,ph:i*2.3})});
  X.anim.push(t=>{for(const m of ms){m.c.rotation.z=Math.sin(t*1.3+m.ph)*.18;m.c.rotation.x=Math.cos(t*1.1+m.ph)*.1;m.c.rotation.y=Math.sin(t*.4+m.ph)*.6}})}

 /* ---------- ilhotas de cemitério com lápides, cruzes e velas ---------- */
 {const K=DX.kit();K.def='flat';K.cyl(9,11,4,Fl(0x2A2020),0,-1,0,null,null,8);for(let i=0;i<4;i++){const a=i/4*PI*2+.4,x=Math.cos(a)*5,z=Math.sin(a)*5;if(i%2){K.rbox(2.4,3.6,.7,.5,0x6A6670,x,2.8,z,[0,a,(i-1.5)*.08]);K.box(1.4,.2,.1,0x3A3640,x,3.2,z+.36,[0,a,0])}else{K.box(.6,4.6,.6,0x5A5660,x,3.3,z,[0,a,.12]);K.box(2.6,.6,.6,0x5A5660,x,4.2,z,[0,a,.12])}}
  for(let i=0;i<3;i++){K.cyl(.25,.25,1,0xEDE6D6,-2+i*2,1.5,-1,null,null,6);K.cone(.22,.6,Gw(0xFFC060),-2+i*2,2.3,-1,null,null,5);K.lowball(1.4,Ha(0xFFA040),-2+i*2,2.3,-1)}
  const pts=[];[.05,.22,.41,.62,.79,.95].forEach((u,i)=>{const s=i%2?1:-1,p=lado(u,s*(hw+26));if(near(p.x,p.z).d>hw+14)pts.push({x:p.x,y:0,z:p.z,s:1,r:i})});B.inst(K,pts)}

 /* ---------- morcegos ---------- */
 {const K=DX.kit();K.ball(.6,0x14080A,0,0,0,[.8,.8,1.3]);K.ext([[0,0],[2.4,.6],[3,-.4],[2,-.2],[1.4,-.8],[.6,-.3]],.08,0x2A0E10,0,0,0,[PI/2,0,0]);K.ext([[0,0],[-2.4,.6],[-3,-.4],[-2,-.2],[-1.4,-.8],[-.6,-.3]],.08,0x2A0E10,0,0,0,[PI/2,0,0]);K.lowball(.12,Gw(0xFF3030),-.25,.3,.6);K.lowball(.12,Gw(0xFF3030),.25,.3,.6);
  const n=36,im=new THREE.InstancedMesh(K.merged(),DX.mats.matte,n),o=new THREE.Object3D(),cs=[.15,.45,.75].map(u=>lado(u,0));im.frustumCulled=false;w.add(im);
  X.anim.push(t=>{for(let i=0;i<n;i++){const c=cs[i%3],a=t*(.6+(i%5)*.07)+i*.9,r=40+(i%7)*9;o.position.set(c.x+Math.cos(a)*r,c.y+26+Math.sin(t*1.7+i)*6+(i%4)*3,c.z+Math.sin(a)*r);o.rotation.set(0,-a,0);o.scale.set(1+Math.sin(t*22+i)*.6,1,1);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.instanceMatrix.needsUpdate=true})}

 /* ---------- gêiseres de fogo: brilham antes e explodem ---------- */
 {const gs=[];[.1,.27,.44,.6,.77,.93].forEach((u,i)=>{if(nearGap(u,10))return;const s=i%2?-1:1,p=lado(u,s*(hw+6)),K=DX.kit();K.def='flat';K.tor(3.4,1.2,Fl(0x2A1E1C),0,.2,0,[PI/2,0,0]);K.cyl(3,3,.3,Gw(0xFF5A1A),0,.3,0,null,null,12);
   const g=B.put(K,p.x,-.2,p.z,0),hm=new THREE.Mesh(new THREE.SphereGeometry(6,12,8),new THREE.MeshBasicMaterial({color:0xFF5A1A,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));hm.scale.y=.4;g.add(hm);gs.push({g,hm,t:i*1.3,x:p.x,z:p.z,y:p.y})});
  X.anim.push((t,dt)=>{for(const o of gs){o.t+=dt;const c=o.t%7;o.hm.material.opacity=c>4.5&&c<6?(c-4.5)/1.5*.6*(.7+.3*Math.sin(t*20)):c>=6?.5:0;
   if(c>=6&&c<6.9){for(let n=0;n<4;n++)DX.spark({x:o.x+(Math.random()-.5)*3,y:.5,z:o.z+(Math.random()-.5)*3,vx:(Math.random()-.5)*5,vy:32+Math.random()*16,vz:(Math.random()-.5)*5,life:.9,s0:3.4,s1:.6,col:n%2?0xFF7A1A:0xFFD43B,g:30,d:.5});
    if(typeof humans!=='undefined')for(const k of humans)if(Math.hypot(k.x-o.x,k.z-o.z)<hw*.6&&Math.random()<dt*4){k.shake=Math.max(k.shake||0,.35);rumble(k,.3)}}}})}

 /* ---------- abóboras-lanterna na beira da pista (batem e voam) ---------- */
 {const K=DX.kit();K.def='flat';for(let i=0;i<6;i++){const a=i/6*PI*2;K.ball(1.05,P(0xFF7A1A),Math.cos(a)*.75,1.1,Math.sin(a)*.75,[.7,.9,.7])}K.ball(1.2,P(0xFF8A2A),0,1.1,0,[1,.9,1]);K.cyl(.18,.25,.8,0x3A5A22,0,2.2,0,null,null,5);
  K.cone(.32,.5,Gw(0xFFE14A),-.45,1.35,1.5,[PI/2,0,0],null,3);K.cone(.32,.5,Gw(0xFFE14A),.45,1.35,1.5,[PI/2,0,0],null,3);K.box(1.2,.3,.2,Gw(0xFFE14A),0,.75,1.55);K.lowball(2.6,Ha(0xFF8A20),0,1.2,0);
  const pts=[];[.06,.15,.24,.34,.43,.55,.64,.73,.84,.92].forEach((u,i)=>{if(nearGap(u,12))return;for(let q=0;q<2;q++){const p=lado(u+q*.004,(i%2?1:-1)*(hw-5-q*3.5));pts.push({x:p.x,y:p.y,z:p.z,s:1.3,r:p.h+PI})}});B.knock(K,pts,{rad:1.8,cor:0xFF8A2A,som:200})}

 /* ---------- raios e trovões ---------- */
 {let next=4,fl=0;X.anim.push((t,dt)=>{next-=dt;if(next<0){next=5+Math.random()*7;fl=1;if(state==='go'){sfx(48,1.4,'sawtooth',.05);setTimeout(()=>sfx(36,1.6,'triangle',.08),180)}}
  fl=Math.max(0,fl-dt*3.2);const f=fl>.6||(fl>.2&&fl<.4)?fl:0;hemi.intensity=d.hemi[2]+f*1.4})}
});
})();
