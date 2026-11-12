/* ===== KART RUSH DELUXE · BAÍA DO KRAKEN =====
 Ilha tropical cercada de mar turquesa. Largada na vila do cais, píer sobre a lagoa, subida do penhasco até o FAROL,
 salto sobre a enseada, CAVERNA DA CAVEIRA (a pista entra pela boca) e descida pela mata até a praia.
 Vivo: galeão balançando e atirando, tentáculos do Kraken saindo do mar, farol girando, gaivotas, bandeiras.
 Interativo: barris e caixotes na pista saem voando quando alguém bate. */
if(window.PHONE)throw new Error('PHONEMODE');
(()=>{const {P,Mt,Gw,Gl,Ha,Fl,lerp,sst}=DX,PI=Math.PI,LN=DX.lin;
const SAND=0xEED9A0,GRASS=0x4FB85A,ROCK=0x8A8478,WOOD=0x8A5A2E,WD2=0x6B4226;
const mar=()=>DX.liquid({base:'#18A8C8',luz:'rgba(190,250,255,.6)',rough:.1,metal:.3,env:1.5,rep:40,alpha:.9});
DX.addMap({id:'pirata',nome:'BAÍA DO KRAKEN',ico:'🏴‍☠️',tema:'pirata',dif:4,neg:true,cenV:'dx3',
 sub:'Píer na lagoa, TÚNEL DE VIDRO no fundo do mar, rampa até o CONVÉS DO NAVIO, farol no penhasco e a caverna da caveira',menu:'túnel no fundo do mar · convés do navio · caveira · kraken',
 pts:[[-140,230,2],[-20,240,2],[100,220,2],[210,240,4,'ponte'],[310,190,4],[285,115,2],[200,100,-6],[110,90,-20],[10,60,-20],[-90,30,-20],[-160,-25,-10],[-130,-85,2],
  [-60,-95,11],[60,-95,11],[150,-65,8],[250,-20,12],[320,-100,24],[250,-190,24,'rampa'],[130,-220,18],[20,-180,13],
  [-70,-230,11],[-180,-200,8],[-280,-140,5],[-330,-40,3],[-270,40,2],[-320,130,2],[-260,210,2]],
 tuneis:[[19.1,19.95]],pontes:[[10.7,14.6]],
 fog:[0xBFE8F4,320,1500],hemi:[0xFFFFFF,0x7FC8B8,.72],sun:[0xFFF4D8,1],sunDir:[.55,.7,-.4],dust:0xE8D8A8,
 sky:{top:0x1F7FE8,mid:0x6FC4FF,hor:0xDFF6FF,sunC:0xFFF6D8,sunD:[.55,.7,-.4],cloud:.5,cloudC:0xFFFFFF},
 road:['#B89A68','#F2E2BC','rgba(255,255,255,.85)'],bar:[0xC0302E,0xF2E2BC],cone:0xC0302E,mm:'#C8A870',pit:'agua',pitMat:mar,pitCor:'#18A8C8',saia:0x8A7A5A,
 fallMsg:'🌊 CAIU NO MAR! ⏱ 2s',
 ter:{cell:9,fall:70,bed:-9,gapDeep:34,margin:560,
  nat(x,z,d){const n=DX.fbm(x*.004+2,z*.004+9,4);let h=-7+n*26*sst(360,60,d)+sst(330,60,d)*5;h+=Math.exp(-(((x-470)/150)**2+((z+60)/200)**2))*70*sst(40,120,d);
   /* enseada no meio da ilha: é por baixo dela que passa o túnel de vidro */
   const e=((x-27)/315)**2+(z/205)**2;h=lerp(-16+n*5,h,sst(.72,1.08,e));return Math.max(h,-22)},
  col(x,z,h,sl){if(h<-9)return DX.noise(x*.04,z*.04)>.55?0xC8A878:0xD8C090;if(h<-.6)return 0xC8B880;if(h<2.8)return DX.noise(x*.05,z*.05)>.6?0xE4CC90:SAND;if(sl>.85)return ROCK;if(sl>.55)return 0x9A9078;return DX.noise(x*.02,z*.02)>.5?GRASS:0x43A850}},
 placas(B){return[[.014,'LARGADA · BAÍA DO KRAKEN','#C0302E','Içar velas!'],[B.uOf(3)-.012,'PÍER DA LAGOA','#258BFF','Cuidado com os tentáculos'],[B.uOf(5.5),'TÚNEL DO FUNDO DO MAR','#22D3FF','Prenda a respiração!'],
  [B.uOf(11.4),'CONVÉS DO NAVIO','#FFD43B','A tripulação torce por você!'],[B.uOf(15.5),'SUBIDA DO FAROL','#FF7A1A','Pé no fundo!'],
  [B.uOf(17)-.012,'SALTO DA ENSEADA','#22D3FF','Acelera e pula!'],[B.uOf(19)-.012,'CAVERNA DA CAVEIRA','#8E5BE8','Entra pela boca!'],[.95,'RETA FINAL','#FFD43B','Falta pouco!']]},
 cena(B,d){const hw=B.hw,X=d.dx,HT=PISTAS.HT;
  /* tentáculo do Kraken (usado no píer e em volta do túnel) */
  const tent=(x,y,z,ry,sc)=>{const K=DX.kit();let k=K.sub('s0',0,0,0);for(let s=0;s<7;s++){const r=2.6-s*.32;k.cyl(r*.86,r,5.2,P(0x8A3FA8),0,2.6,0,null,null,8);k.lowball(r*.5,P(0xF4A0C8),0,1.6,r*.8);k.lowball(r*.45,P(0xF4A0C8),0,3.8,r*.75);if(s<6)k=k.sub('s'+(s+1),0,5,0)}
   return B.put(K,x,y,z,ry,sc)};
  const tentAnim=(gs,y0)=>B.anim(t=>gs.forEach((g,i)=>{const q=g.userData.parts;for(let s=0;s<7;s++){const n=q['s'+s];if(n){n.rotation.x=Math.sin(t*1.4+i*1.7-s*.5)*.2+(s>2?.16:0);n.rotation.z=Math.cos(t*1.1+i-s*.4)*.1}}g.position.y=y0[i]+Math.sin(t*.7+i)*1.5}));
  const seaMesh=DX.sea(B,0,mar(),'agua');
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
  {const p=B.at(B.uOf(16.1),hw+38),K=DX.kit();K.lathe([[7,0],[6.2,10],[5.2,24],[4.6,36]],Fl(0xFFFFFF),0,0,0,null,null,12);for(let i=0;i<3;i++)K.lathe([[6.75-i*.82,3+i*12],[6.3-i*.8,9+i*12]],Fl(0xD9313F),0,0,0,null,[1.03,1,1.03],12);
   K.cyl(6,6,1,Fl(0x3A3F4A),0,36.5,0);K.cyl(3.4,3.4,5,Gl(0xFFF6C0),0,39.5,0);K.ball(2,Gw(0xFFF2A0),0,39.5,0);K.cone(4.6,4,Fl(0xD9313F),0,44,0,null,null,10);
   const L=K.sub('luz',0,39.5,0);L.cone(9,90,Ha(0xFFF2A0),0,0,45,[-PI/2,0,0],null,10);L.cone(9,90,Ha(0xFFF2A0),0,0,-45,[PI/2,0,0],null,10);
   const g=B.put(K,p.x,p.y-1,p.z,0);B.anim(t=>{g.userData.parts.luz.rotation.y=t*.7})}
  /* CAVEIRA GIGANTE: a pista entra pela BOCA; o crânio fica todo por cima e por trás do túnel (nada invade a pista) */
  X.tun.forEach(([i0,i1])=>{B.tunnel(i0,i1,{col:0x5A5048,luz:0xFF8A20,portal:0x8A8070,step:8});
   const j=((i0%N)+N)%N,h=Math.atan2(TG[j].x,TG[j].z),K=DX.kit(),R=hw+5,top=R*.66,Rc=R*1.2,cy=top+3+Rc*.85,cz=Rc*.5,Rk=Fl(0xB8B0A0),Dk=Fl(0x1E1A16);
   K.ico(Rc,Rk,0,cy,cz,[1,.85,1],null,2);
   /* olhos fundos com fogo dentro, nariz e maçãs do rosto */
   for(const s of[-1,1]){const ex=s*Rc*.38,ey=cy-Rc*.05,ez=cz-Rc*.86;K.ball(Rc*.27,Dk,ex,ey,ez,[1,1.1,.55]);K.ball(Rc*.11,Gw(0xFF7A1A),ex,ey-1,ez-Rc*.12);K.lowball(Rc*.3,Ha(0xFF5A1A),ex,ey,ez-Rc*.2);
    K.ico(R*.5,Rk,s*(R+R*.5+2),R*.42,-2,[1,1.15,1.1],null,1);K.ico(R*.36,Rk,s*(R+R*.3),top+R*.2,0,[1.3,.8,1],null,1)}
   K.cone(Rc*.12,Rc*.28,Dk,0,cy-Rc*.42,cz-Rc*.8,[-.35,0,0],null,5);
   /* dentes pendurados na beira da boca (por fora do arco do túnel) */
   for(let t=0;t<11;t++){const a=PI*(t+.5)/11,x=Math.cos(a)*(R+2.2),y=Math.sin(a)*(R+2.2)*.66;if(y<6)continue;K.cone(2.4,6.5,Fl(0xF4EEDC),x,y-1.5,-1.2,[PI,0,0],null,5)}
   B.put(K,SP[j].x,HT[j],SP[j].z,h);
   /* saída: arco de pedra fora da pista */
   const j2=((i1%N)+N)%N,K2=DX.kit();for(const s of[-1,1])K2.ico(R*.55,Rk,s*(R+R*.5),R*.4,0,[1,1.2,1],null,1);K2.ico(R*.6,Rk,0,top+R*.55,2,[1.6,.5,1],null,1);
   B.put(K2,SP[j2].x,HT[j2],SP[j2].z,Math.atan2(TG[j2].x,TG[j2].z))});
  /* GALEÃO ancorado: balança no mar e dispara os canhões */
  {const a={x:58,z:-4,h:.08},K=DX.kit();K.def='flat';
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
  {const e=(d.pon||[])[0];if(e){const um=(e[0]+e[1])/2,gs=[],ys=[];[[-.012,1],[.0,-1],[.012,1],[.02,-1]].forEach((q,i)=>{const p=B.at(um+q[0],q[1]*(hw+16+i*4));gs.push(tent(p.x,-4,p.z,p.h+(q[1]>0?-PI/2:PI/2)));ys.push(-4)});tentAnim(gs,ys)}}
  /* gaivotas em círculo */
  {const gs=[];for(let i=0;i<8;i++){const K=DX.kit();K.ball(.6,0xFFFFFF,0,0,0,[.6,.5,1.6]);for(const s of[-1,1]){const w=K.sub('w'+s,s*.3,0,0);w.ext([[0,-.5],[2.6*s,-.2],[3.2*s,.3],[0,.5]],.08,0xF4F4F4,0,0,0,[PI/2,0,0])}gs.push(B.put(K,0,0,0,0,1.6))}
   const c=B.at(B.uOf(2),hw+80);B.anim(t=>gs.forEach((g,i)=>{const a=t*.35+i*.8,r=60+i*9;g.position.set(c.x+Math.cos(a)*r,46+i*3+Math.sin(t+i)*3,c.z+Math.sin(a)*r);g.rotation.y=-a;const f=Math.sin(t*6+i)*.6;g.userData.parts.w1.rotation.z=f;g.userData.parts['w-1'].rotation.z=-f}))}
  /* baús de tesouro brilhando */
  {const K=DX.kit();K.rbox(3,1.6,2,.2,Fl(WOOD),0,.8,0);K.half(1.5,Fl(WD2),0,1.6,0,[1,.7,.66]);K.box(3.1,.25,2.1,Mt(0xFFD43B),0,1.5,0);K.lowball(1.1,Gw(0xFFD43B),0,1.9,.3,[1.2,.5,.8]);K.lowball(3,Ha(0xFFC020),0,2,0);
   B.inst(K,B.scatter(16,(x,z,h,dd)=>dd>hw+6&&dd<40&&h>1?1+Math.random()*.4:0),{cast:false})}
  /* ====== FUNDO DO MAR: túnel de vidro por baixo da enseada ====== */
  {const R=hw+5,HH=R*.42,T=X.T;let i0=-1,i1=-1;for(let i=0;i<N;i++){const a=HT[i]<.6,pv=HT[(i-1+N)%N]<.6,nx=HT[(i+1)%N]<.6;if(a&&!pv)i0=i;if(a&&!nx)i1=i}
   if(i0>=0&&i1>=0){if(i1<i0)i1+=N;i0-=3;i1+=3;const ts=i=>((i%N)+N)%N;
    /* vidro */
    const S=16,P2=[],I2=[];let n=0;for(let i=i0;i<=i1;i++){const j=ts(i),p=SP[j],r=RT[j];for(let s=0;s<=S;s++){const an=PI*s/S,l=Math.cos(an)*R,y=HT[j]+Math.sin(an)*HH;P2.push(p.x+r.x*l,y,p.z+r.z*l)}
     if(i<i1)for(let s=0;s<S;s++){const A=n*(S+1)+s;I2.push(A,A+S+1,A+1,A+1,A+S+1,A+S+2)}n++}
    const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute(P2,3));gg.setIndex(I2);gg.computeVertexNormals();
    const glass=new THREE.Mesh(gg,new THREE.MeshStandardMaterial({color:LN(0xA8F0FF),transparent:true,opacity:.2,roughness:.05,metalness:.3,envMap:DX.env,envMapIntensity:1.4,side:THREE.DoubleSide,depthWrite:false}));glass.renderOrder=3;B.add(glass);
    /* costelas de metal com luzes */
    const K=DX.kit();for(let i=i0+2;i<i1;i+=9){const j=ts(i),h=Math.atan2(TG[j].x,TG[j].z),k=K.at(SP[j].x,HT[j],SP[j].z,[0,h,0]);k.tor(R,.55,Mt(0x5F7A8A),0,0,0,null,PI,[1,HH/R,1],18);
     for(const a of[.5,1.57,2.64])k.lowball(.7,Gw(0x9FFFF0),Math.cos(a)*R*.985,Math.sin(a)*HH*.985,0)}
    for(const i of[i0,i1]){const j=ts(i),h=Math.atan2(TG[j].x,TG[j].z),k=K.at(SP[j].x,HT[j],SP[j].z,[0,h,0]);k.tor(R+.8,2,Mt(0x8A9AA6),0,0,0,null,PI,[1,HH/R,1],18)}
    B.add(K.build({noShadow:true}));
    /* o mar não "corta" o túnel: onde o vidro sai da água, a superfície do mar fica de fora do tubo */
    const Wd=1024,dx=T.x1-T.x0,dz=T.z1-T.z0,mc=cv(Wd,Wd,g=>{g.fillStyle='#000';g.fillRect(0,0,Wd,Wd);g.fillStyle='#fff';for(let i=i0;i<=i1;i++){const j=ts(i);if(HT[j]+HH<-.6)continue;
      g.beginPath();g.arc((SP[j].x-T.x0)/dx*Wd,(1-(SP[j].z-T.z0)/dz)*Wd,(R-.5)/dx*Wd,0,7);g.fill()}}),mt=new THREE.CanvasTexture(mc);
    const mask=m=>{m.onBeforeCompile=sh=>{sh.uniforms.uMask={value:mt};sh.uniforms.uMB={value:new THREE.Vector4(T.x0,T.z0,dx,dz)};
      sh.vertexShader='varying vec2 vWxz;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvWxz=(modelMatrix*vec4(transformed,1.)).xz;');
      sh.fragmentShader='uniform sampler2D uMask;uniform vec4 uMB;varying vec2 vWxz;\n'+sh.fragmentShader.replace('void main() {','void main() {\nvec2 mu=(vWxz-uMB.xy)/uMB.zw;if(mu.x>0.&&mu.x<1.&&mu.y>0.&&mu.y<1.&&texture2D(uMask,mu).r>.5)discard;')};
     m.customProgramCacheKey=()=>'dxmask';m.needsUpdate=true};
    mask(seaMesh.material);
    /* teto de água visto de baixo */
    const ce=new THREE.Mesh(new THREE.PlaneGeometry(dx,dz),new THREE.MeshBasicMaterial({color:LN(0x2AA8C8),transparent:true,opacity:.6,depthWrite:false}));ce.rotation.x=PI/2;ce.position.set((T.x0+T.x1)/2,-.05,(T.z0+T.z1)/2);mask(ce.material);B.add(ce);
    /* debaixo d'água: neblina azul (só para a câmera que está lá embaixo) */
    const fc=new THREE.Color(0x1478A0);DX.camHooks.push(cam=>{if(ST!==d||cam.position.y>-.3)return;DX.camSave();scene.fog.color.copy(fc);scene.fog.near=4;scene.fog.far=230;scene.background.copy(fc);DX.skyMesh.visible=false});
    DX.fall(B,{n:600,box:80,col:0xE8FFFF,vy:5,size:.4,maxY:-.4});
    /* algas e corais no fundo */
    {const A=DX.kit();A.tube([[0,0,0],[.8,4,0],[-.6,8,.3],[.7,12,0],[0,15,-.3]],.45,0x2E9A5A,false,14);A.tube([[1.2,0,.4],[2.2,4,.6],[1,8,1],[2,10,.4]],.35,0x3FBF6A,false,10);
     B.inst(A,B.scatter(140,(x,z,h,dd)=>h<-11&&dd>hw+10?Math.min(.75,(-h-3)/16)*(.7+Math.random()*.3):0,[T.x0+200,T.x1-200,T.z0+200,T.z1-200]),{cast:false})}
    [0xFF6F8A,0xFFB020,0xB46BFF,0x4FC8FF].forEach(c=>{const C=DX.kit();C.def='flat';C.ico(1.6,c,0,1,0,[1,1.4,1]);C.ico(1.1,c,1.3,.8,.4);C.cone(.5,3,c,-1,1.5,.4,[0,0,.4],null,5);C.cone(.4,2.4,c,.4,1.8,-.9,[.3,0,0],null,5);
     B.inst(C,B.scatter(40,(x,z,h,dd)=>h<-8&&dd>hw+7?.8+Math.random()*1.4:0,[T.x0+200,T.x1-200,T.z0+200,T.z1-200]),{cast:false})});
    /* cardumes nadando em volta do túnel */
    {const F=DX.kit();F.ball(1,0xFFFFFF,0,0,0,[.45,.7,1.3]);F.ext([[0,0],[.9,.7],[.9,-.7]],.12,0xFFFFFF,0,0,-1.2,[0,-PI/2,0]);F.lowball(.13,0x111111,.3,.25,.75);F.lowball(.13,0x111111,-.3,.25,.75);
     const nF=48,im=new THREE.InstancedMesh(F.merged(),DX.mats.matte,nF),o=new THREE.Object3D(),FC=[0xFFB020,0x4FC8FF,0xFF6F8A,0xFFFFFF],sc=[];im.frustumCulled=false;
     for(let q=0;q<4;q++){const j=ts(i0+Math.round((i1-i0)*(q+.5)/4)),s=q%2?1:-1,l=s*(R+14);sc.push({x:SP[j].x+RT[j].x*l,z:SP[j].z+RT[j].z*l,y:HT[j]+6})}
     for(let i=0;i<nF;i++)im.setColorAt(i,new THREE.Color(FC[i%4]).convertSRGBToLinear());B.add(im);
     B.anim(t=>{for(let i=0;i<nF;i++){const c=sc[i%4],a=t*(.5+(i%4)*.08)+i*.37,r=9+(i%5)*2.2;o.position.set(c.x+Math.cos(a)*r,c.y+Math.sin(t*1.3+i)*2.5+(i%3)*1.5,c.z+Math.sin(a)*r);o.rotation.set(0,-a,Math.sin(t*6+i)*.15);o.scale.setScalar(.9+(i%3)*.35);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.instanceMatrix.needsUpdate=true})}
    /* tubarão rondando */
    {const S2=DX.kit();S2.ball(3,P(0x7F8FA3),0,0,0,[.8,.8,2.4]);S2.ball(2.5,P(0xE8EEF2),0,-.8,.4,[.7,.5,2]);S2.ext([[0,0],[2.6,0],[.6,3.6]],.4,P(0x7F8FA3),0,2,-.5,[0,PI/2,0]);
     for(const s of[-1,1])S2.ext([[0,0],[3,-1.4],[1,.4]],.3,P(0x7F8FA3),s*2,-.6,1,[0,0,s*.4]);S2.lowball(.35,0x111111,-1.2,.8,5.4);S2.lowball(.35,0x111111,1.2,.8,5.4);
     for(let i=0;i<5;i++)S2.cone(.25,.6,0xFFFFFF,-.8+i*.4,-.6,6.4,[PI,0,0],null,4);const tl=S2.sub('cauda',0,0,-6.6);tl.ext([[0,0],[2.4,3.6],[1.2,0],[2.4,-3]],.35,P(0x7F8FA3),0,0,-1,[0,PI/2,0]);
     const j=ts(Math.round((i0+i1)/2)),sh=B.put(S2,0,0,0,0),cx=SP[j].x,cz=SP[j].z,cyy=HT[j]+8;B.anim(t=>{const a=t*.3;sh.position.set(cx+Math.cos(a)*(R+26),cyy+Math.sin(t*.8)*3,cz+Math.sin(a)*(R+26));sh.rotation.y=-a;sh.userData.parts.cauda.rotation.y=Math.sin(t*5)*.4})}
    /* tesouro afundado e âncora perto do vidro */
    {const j=ts(i0+Math.round((i1-i0)*.35)),l=R+9,x=SP[j].x+RT[j].x*l,z=SP[j].z+RT[j].z*l,K3=DX.kit();K3.rbox(4,2.4,2.8,.3,Fl(0x8A5A2E),0,1.2,0);K3.half(2,Fl(0x6B4226),0,2.4,0,[1,.6,.7]);K3.lowball(1.6,Gw(0xFFD43B),0,2.8,.4,[1.2,.4,.8]);K3.lowball(4,Ha(0xFFC020),0,3,0);B.put(K3,x,T.ground(x,z),z,.6)}
    {const j=ts(i0+Math.round((i1-i0)*.62)),l=-(R+10),x=SP[j].x+RT[j].x*l,z=SP[j].z+RT[j].z*l,K4=DX.kit();K4.cyl(.6,.6,10,Mt(0x5A646E),0,5,0);K4.tor(4,.6,Mt(0x5A646E),0,1.6,0,null,PI,[1,1,1]);K4.tor(1.2,.4,Mt(0x5A646E),0,10.6,0,[PI/2,0,0]);
     K4.box(5,.7,.7,Mt(0x5A646E),0,8.4,0);B.put(K4,x,T.ground(x,z)-1,z,1.1).rotation.z=.5}
   }}
  {const gs=[],ys=[];[[.25,1],[.45,-1],[.7,1]].forEach(([f,s])=>{let i0=-1,i1=-1;for(let i=0;i<N;i++){if(HT[i]<-12){if(i0<0)i0=i;i1=i}}if(i0<0)return;const j=Math.round(i0+(i1-i0)*f),l=s*(hw+22),x=SP[j].x+RT[j].x*l,z=SP[j].z+RT[j].z*l,y=X.T.ground(x,z);
    gs.push(tent(x,y,z,Math.atan2(TG[j].x,TG[j].z)+(s>0?-PI/2:PI/2),1.5));ys.push(y)});tentAnim(gs,ys)}
  /* ====== NAVIO: a pista passa pelo convés, com a tripulação torcendo ====== */
  {const a=B.iOf(12),b=B.iOf(13),i0=a-3,i1=b+3,ts=i=>((i%N)+N)%N,yD=i=>HT[ts(i)];
   const plank=new THREE.CanvasTexture(cv(256,256,(g,w,h)=>{for(let y=0;y<h;y+=32){g.fillStyle=['#9A6A3A','#8A5A2E','#A87644'][(y/32)%3];g.fillRect(0,y,w,30);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,y+30,w,2);for(let x=(y/32%2)*64;x<w;x+=128)g.fillRect(x,y,2,30)}}));
   plank.wrapS=plank.wrapT=THREE.RepeatWrapping;plank.encoding=THREE.sRGBEncoding;
   B.add(ribbon(i0,i1,-hw,hw,.08,new THREE.MeshStandardMaterial({map:plank,roughness:.85,polygonOffset:true,polygonOffsetFactor:-2}),10));
   /* casco: passarela de cada lado, amurada, barriga e a linha d'água */
   const prof=[[hw,.07,0x8A5A2E],[hw+7.2,.07,0x8A5A2E],[hw+7.2,3.6,0x6B4226],[hw+8.2,3.8,0xD9B23A],[hw+8.6,0,0x6B4226],[hw+12.6,-4,0x7A4A26],[hw+12.4,-8,0x5A3418],[hw+11.6,-9,0xF4EEDF],[hw+6,-15,0x3A2416]];
   const pos=[],col=[],idx=[],c=new THREE.Color();let v=0;const put=(x,y,z,cc)=>{pos.push(x,y,z);c.set(cc).convertSRGBToLinear();col.push(c.r,c.g,c.b);return v++};
   for(const s of[-1,1]){const base=v,L=prof.length;for(let i=i0;i<=i1;i++){const j=ts(i),p=SP[j],r=RT[j],e=Math.min(1,(i-i0)/6,(i1-i)/6),y=yD(i);
     prof.forEach(q=>{const l=s*(hw+(q[0]-hw)*(.55+.45*e));put(p.x+r.x*l,y+q[1],p.z+r.z*l,q[2])})}
    for(let i=0;i<i1-i0;i++)for(let k=0;k<L-1;k++){const A=base+i*L+k,B2=A+L;idx.push(A,B2,A+1,A+1,B2,B2+1)}
    /* tampas da proa e da popa */
    for(const e of[0,i1-i0]){const A=base+e*L,j=ts(i0+e),y=yD(i0+e),q=put(SP[j].x+RT[j].x*s*hw,y-15,SP[j].z+RT[j].z*s*hw,0x3A2416);for(let k=0;k<L-1;k++)idx.push(q,A+k,A+k+1)}}
   const hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));hg.setAttribute('color',new THREE.Float32BufferAttribute(col,3));hg.setIndex(idx);hg.computeVertexNormals();
   const hull=new THREE.Mesh(hg,new THREE.MeshStandardMaterial({vertexColors:true,flatShading:true,roughness:.85,side:THREE.DoubleSide}));hull.castShadow=hull.receiveShadow=true;B.add(hull);
   /* mastros nas amuradas, vergas e velas por cima da pista, bandeira de caveira, canhões e lanternas */
   const K=DX.kit();K.def='flat';const hd=i=>Math.atan2(TG[ts(i)].x,TG[ts(i)].z);
   [.22,.55,.85].forEach((f,m)=>{const i=Math.round(a+(b-a)*f),j=ts(i),y=yD(i),k=K.at(SP[j].x,y,SP[j].z,[0,hd(i),0]),H=[40,48,36][m];
    for(const s of[-1,1]){k.cyl(.8,1.1,H,0x6B4226,s*(hw+4),H/2,0,null,null,8);k.cyl(2.2,1.6,1.6,0x5A3418,s*(hw+4),H*.8,0,null,null,8);for(let r=0;r<4;r++)k.limb([s*(hw+7.6),3.6,-3+r*2],[s*(hw+4),H*.78,0],.07,0x3A2A1A)}
    k.box(2*hw+12,1,1,0x6B4226,0,H*.5,0);k.box(2*hw+10,.9,.9,0x6B4226,0,H*.78,0);k.ball(1,P(0xF4EEDF),0,H*.64,.6,[hw+4,H*.13,1.6]);k.ball(1,P(0xC0302E),0,H*.64,.62,[hw*.5,H*.05,1.62]);
    k.box(.2,6,9,P(0x14141C),hw+4,H+3,-4.5);if(m===1){k.lowball(2,P(0xFFFFFF),hw+4,H+3.6,-4.5,[.2,1,1]);k.box(.25,.6,3.4,P(0xFFFFFF),hw+4,H+1.6,-4.5,[.6,0,0]);k.box(.25,.6,3.4,P(0xFFFFFF),hw+4,H+1.6,-4.5,[-.6,0,0])}});
   for(let i=a+4;i<b;i+=5){const j=ts(i),y=yD(i),k=K.at(SP[j].x,y,SP[j].z,[0,hd(i),0]);for(const s of[-1,1])k.cyl(.9,1.1,4,0x1E1E24,s*(hw+13),-2.2,0,[0,0,PI/2],null,8)}
   for(const i of[a,b])for(const s of[-1,1]){const j=ts(i),y=yD(i),k=K.at(SP[j].x,y,SP[j].z,[0,hd(i),0]);k.cyl(.3,.3,9,0x3A2A1A,s*(hw+7.6),4.5,0,null,null,6);k.cyl(1,.8,1.8,Gw(0xFFC860),s*(hw+7.6),9.4,0,null,null,6);k.lowball(3.4,Ha(0xFFA030),s*(hw+7.6),9.4,0)}
   /* figura de proa: sereia dourada saindo pela frente do casco */
   {const j=ts(i1),y=yD(i1),k=K.at(SP[j].x,y,SP[j].z,[0,hd(i1),0]);for(const s of[-1,1]){k.ball(1.6,Mt(0xFFD43B),s*(hw+8),2,6,[.8,1.6,.8]);k.ball(1.1,Mt(0xFFD43B),s*(hw+8),5,6.6);k.limb([s*(hw+8),-1,5],[s*(hw+8),-4,9],.9,Mt(0xFFD43B))}}
   B.add(K.build());
   /* tripulação torcendo nas passarelas */
   const crew=[],CC=[[0xC0302E,0xE7B98E],[0x2E7BE8,0x7A4E30],[0xFFD43B,0xE7B08A],[0x34C759,0xD89A74],[0xE84393,0xE7B98E],[0x14141C,0xF2ECDC]];
   for(let q=0;q<12;q++){const s=q%2?1:-1,f=.08+.84*(Math.floor(q/2)/5),i=Math.round(a+(b-a)*f),j=ts(i),l=s*(hw+3.8),cc=CC[q%6],Kp=DX.kit();
    Kp.limb([-.35,0,0],[-.35,1.2,0],.3,0x3A2A22);Kp.limb([.35,0,0],[.35,1.2,0],.3,0x3A2A22);Kp.ball(.85,P(cc[0]),0,1.9,0,[1,1.1,.8]);Kp.ball(.72,cc[1],0,3.1,0);Kp.half(.75,P(cc[0]),0,3.25,0,[1,.8,1]);
    Kp.lowball(.12,0x111111,-.25,3.2,.62);Kp.lowball(.12,0x111111,.25,3.2,.62);Kp.ball(.18,0x3A1A14,0,2.85,.62,[1.3,.6,.5]);if(q%3===0){Kp.ball(.18,0x111111,.25,3.2,.66);Kp.box(1.5,.08,.08,0x111111,0,3.3,.55)}
    for(const t of[-1,1]){const A=Kp.sub('a'+t,t*.85,2.3,0);A.limb([0,0,0],[t*.2,1.2,0],.22,P(cc[0]));A.lowball(.28,cc[1],t*.22,1.35,0);if(t>0&&q%4===1){A.limb([t*.22,1.3,0],[t*.22,3.4,0],.06,0x6B4226);A.box(.05,1,1.6,P(cc[0]),t*.22,3,.8)}}
    const g=B.put(Kp,SP[j].x+RT[j].x*l,yD(i),SP[j].z+RT[j].z*l,hd(i)+(s>0?-PI/2:PI/2),1.5);crew.push(g)}
   B.anim(t=>{let perto=0;if(typeof karts!=='undefined')for(const k of karts){const di=((k.idx-a)%N+N)%N;if(di<b-a+60||((a-k.idx)%N+N)%N<60)perto=1}
    crew.forEach((g,i)=>{const e=perto?1:.35,ph=t*(perto?9:3)+i*1.3,u=g.userData.parts;g.position.y=yD(Math.round(a+(b-a)*(.08+.84*(Math.floor(i/2)/5))))+Math.max(0,Math.sin(ph))*1.6*e;
     if(u['a-1'])u['a-1'].rotation.z=.3+Math.sin(ph*1.1)*.6*e+.4*e;if(u.a1)u.a1.rotation.z=-.3-Math.sin(ph*1.1+1)*.6*e-.4*e})})}
  /* interativos: barris e caixotes */
  {const K=DX.kit();K.lathe([[1,0],[1.25,1],[1,2.2]],Fl(WOOD),0,0,0,null,null,10);K.cyl(1.02,1.02,.1,Fl(WD2),0,2.2,0);for(const y of[.5,1.7])K.tor(1.14,.09,Mt(0x8A8F99),0,y,0,[PI/2,0,0]);
   const pts=[];[.1,.19,.3,.44,.56,.7,.8,.88].forEach((u,i)=>{if(nearGap(u,12))return;for(let q=0;q<2;q++){const p=B.at(u+q*.003,(i%2?1:-1)*(hw-6-q*4));pts.push({x:p.x,y:p.y,z:p.z,s:1,r:q})}});B.knock(K,pts,{rad:1.8,cor:0xC89A5A,som:180})}
  {const K=DX.kit();K.def='flat';K.box(2.4,2.4,2.4,0xC89A5A,0,1.2,0);for(const a of[[0,0],[PI/2,0]]){K.box(2.6,.3,.3,WD2,0,2.25,0,[0,a[0],0]);K.box(2.6,.3,.3,WD2,0,.15,0,[0,a[0],0])}
   const pts=[];[.14,.25,.38,.5,.64,.76,.92].forEach((u,i)=>{if(nearGap(u,12))return;for(let q=0;q<2;q++){const p=B.at(u,(i%2?-1:1)*(hw-5-q*3));pts.push({x:p.x,y:p.y+0,z:p.z,s:1,r:p.h+q})}});B.knock(K,pts,{rad:1.9,cor:0xC89A5A,som:150})}
 }});
/* ordem no menu: do mais fácil para o mais difícil */
{const v=STAGES.vulcao;if(v){delete STAGES.vulcao;STAGES.vulcao=v}}
})();
