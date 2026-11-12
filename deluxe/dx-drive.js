/* ===== KART RUSH DELUXE · PILOTAGEM, CÂMERA E EFEITOS =====
 FÍSICA: arrancada forte que vai "pesando" perto da velocidade máxima · volante com inércia (kart pesado responde mais devagar) ·
  DRIFT de fliperama: aperte o drift virando → o kart dá um pulinho, trava o lado da curva e DESLIZA de verdade (a traseira
  escapa); o volante só abre ou fecha a curva; soltar dá o turbo (azul → laranja → roxo, como antes).
  Paredes soltam faíscas. Todo o resto (itens, moedas, atalhos, rampas, robôs) segue as mesmas regras.
 CÂMERA: mola suave atrás do kart, abre nas curvas e no drift, afasta e abre o campo de visão com a velocidade, acompanha
  morros e pulos sem dar tranco, treme de leve nas batidas (sem pular de posição), gira em volta do kart na largada e na chegada.
 EFEITOS: fumaça de pneu na arrancada, poeira da pista (cor de cada mapa), fumaça e faíscas coloridas no drift, marcas de pneu,
  fogo no escapamento, anel de poeira no pouso, estrelas na batida, brilho ao pegar item, confete na chegada, riscos de velocidade. */
if(window.PHONE)throw new Error('PHONEMODE');
(()=>{const {damp,lerp,V3}=DX,PI=Math.PI;
const DRC=[0xBFD3E6,0x4FB8FF,0xFF9A1F,0xC66BFF];
const dust=()=>(ST&&ST.dx&&ST.dx.dust)||(ST&&ST.pit==='lava'?0x6A5A52:0xC9C2B4);
/* ponto do kart no mundo: lx para o lado (esquerda +), lz para frente */
const wp=(k,lx,lz,o)=>{const s=Math.sin(k.h),c=Math.cos(k.h);o.x=k.x+s*lz+c*lx;o.z=k.z+c*lz-s*lx;return o},_w={x:0,z:0};

/* ---------- FÍSICA ---------- */
{const _v=vertical;vertical=function(k,dt){k.dxVy=k.vy;_v(k,dt)}}
stepKart=function(k,inp,dt){
 if(k.fallT>0){k.fallT-=dt;k.v=0;k.y=Math.max(-9,k.y-dt*6);if(k.fallT<=0)respawn(k);return}
 const go=state==='go'||k.fin;let thr=go?inp.thr:0;
 if(k.spin>0){k.spin-=dt;k.h+=dt*11;k.v*=Math.pow(.15,dt);thr=0}
 k.slow=Math.max(0,k.slow-dt);k.boost=Math.max(0,k.boost-dt);k.ghost=Math.max(0,k.ghost-dt);if(k.boost<=0)k.dxBoostLv=0;
 const ice=!k.air&&onIce(k),peso=VEH[k.veh].peso||1;k.thrIn=thr;k.dxIce=ice;
 const maxV=((k.slow>0?24:58)+(k.boost>0?38:0))*mulOf('speed',k);
 if(!k.air){const u=clamp(k.v/maxV,0,1);
  if(thr>0)k.v+=thr*(k.boost>0?80:54-28*u*u)*(ice?.7:1)*mulOf('accel',k)*dt;else if(thr<0)k.v+=thr*(k.v>0?78:26)*dt;else k.v-=Math.sign(k.v)*Math.min(Math.abs(k.v),(ice?5:12)*dt);
  if(k.v>maxV)k.v=Math.max(maxV,k.v-90*dt);k.v=Math.max(-18,k.v)}
 const sp=Math.abs(k.v);
 /* volante com inércia */
 k.stS=damp(k.stS||0,inp.st,17/(.55+.45*peso),dt);let st=k.stS;
 /* drift */
 const quer=!k.air&&inp.drift&&sp>24&&k.spin<=0;
 if(quer&&!k.dOn&&Math.abs(inp.st)>.35){k.dOn=true;k.dDir=Math.sign(inp.st);k.drift=0;if(k.dx){k.dx.bv+=7;k.dx.sq=-.25}if(k.human)sfx(260,.08,'triangle',.05)}
 if(k.dOn){if(quer){k.drift+=dt;st=k.dDir*clamp(.62+.55*inp.st*k.dDir,.1,1.15)}
  else if(!k.air){const lv=k.drift>=2?3:k.drift>=1.2?2:k.drift>=.6?1:0;if(lv){k.boost=Math.max(k.boost,[0,.7,1.2,1.9][lv]);k.dxBoostLv=lv;sfx([0,480,600,760][lv],.3,'sawtooth');if(lv>1)rumble(k,.5);emit('driftboost',k,lv)}k.dOn=false;k.drift=0}}
 if(k.spin<=0)k.h+=st*mulOf('steer',k)*(1.55+(k.dOn?.95:0))*(ice?1.15:1)*(k.air?.35:1)*clamp(sp/22,0,1)*(1.25-sp/150)*(k.v<0?-1:1)*dt;
 /* direção do movimento: no drift a traseira escapa (o kart aponta mais para dentro do que anda); no gelo escorrega */
 if(!k.air&&k.spin<=0){const gr=ice?1.6:k.dOn?5.2:16;k.mh+=wrap(k.h-k.mh)*(1-Math.exp(-gr*dt))}
 k.x+=Math.sin(k.mh)*k.v*dt;k.z+=Math.cos(k.mh)*k.v*dt;
 colideKarts(k,dt);
 obst.forEach(o=>{if(o.t>0&&!k.air&&Math.hypot(k.x-o.x,k.z-o.z)<3.2){o.t=0;hitKart(k,{spin:1,vmul:.3,msg:'💣 BUM! PASSOU NA MINA!',kind:'caixa'});sfx(120,.3,'square')}});
 /* pista */
 let best=k.idx,bd=1e9;for(let o=-14;o<=14;o++){const j=(k.idx+o+N)%N,dx=k.x-SP[j].x,dz=k.z-SP[j].z,d=dx*dx+dz*dz;if(d<bd){bd=d;best=j}}
 let di=best-k.idx;if(di>N/2)di-=N;if(di<-N/2)di+=N;k.prog+=di;k.idx=best;
 const r=RT[best],t=TG[best],ox=k.x-SP[best].x,oz=k.z-SP[best].z,lat=ox*r.x+oz*r.z,lim=(lat>=0?EP[best]:EN[best])-1.5;k.fi=best+(ox*t.x+oz*t.z)/SEG;
 k.wallCd=Math.max(0,(k.wallCd||0)-dt);
 if(Math.abs(lat)>lim&&!ask('offroad',k,lat)){const sg=Math.sign(lat),ps=lat-sg*(lim-.1);k.x-=r.x*ps;k.z-=r.z*ps;
  const sv=k.v<0?-1:1,dx=Math.sin(k.mh)*sv,dz=Math.cos(k.mh)*sv,into=(dx*r.x+dz*r.z)*sg;
  if(into>0){let nx=dx-into*sg*r.x,nz=dz-into*sg*r.z;const forte=into>.55;
   if(forte){nx-=sg*r.x*into*.35;nz-=sg*r.z*into*.35}else{nx-=sg*r.x*.07;nz-=sg*r.z*.07}
   const nh=Math.atan2(nx*sv,nz*sv);k.mh=nh;k.h+=wrap(nh-k.h)*(forte?.6:1);k.v*=1-into*(forte?.5:.15)/Math.sqrt(peso);
   if(into>.2&&k.wallCd<=0&&Math.abs(k.v)>12){k.wallCd=.45;rumble(k,Math.min(1,into+.2));if(k.human)k.shake=Math.max(k.shake||0,into*.7);
    if(k.dx){k.dx.hit=Math.max(k.dx.hit,into);k.dx.rollV-=sg*into*9}
    DX.burst('spark',k.x+r.x*sg*1.6,k.y+.9,k.z+r.z*sg*1.6,Math.round(8+into*16),{sp:9+into*8,up:5,col:[0xFFE08A,0xFF9A2E,0xFFFFFF],s0:.35,s1:.05,life:.45})}}
  /* raspando: fio de faíscas */
  if(sp>20&&Math.random()<dt*40)DX.spark({x:k.x+r.x*sg*1.6,y:k.y+.5,z:k.z+r.z*sg*1.6,vx:-Math.sin(k.mh)*sp*.3+(Math.random()-.5)*5,vy:2+Math.random()*4,vz:-Math.cos(k.mh)*sp*.3+(Math.random()-.5)*5,life:.3,s0:.3,s1:.05,col:0xFFC04A,g:22,d:1});
  k.v*=1-dt*.5}
 k.lat=clamp(lat,-lim,lim);
 vertical(k,dt);if(k.fallT>0)return;
 ibs.forEach(b=>{if(b.cd<=0&&!k.item&&Math.abs(k.y-k.gy)<3&&Math.hypot(k.x-b.x,k.z-b.z)<3.6){b.cd=5;k.item=rollItem(k);sfx(900,.15,'triangle');
  DX.burst('spark',b.x,k.y+2.2,b.z,18,{sp:9,up:6,col:[0xFFD43B,0xFF6B22,0xE84393,0xFFFFFF],s0:.5,s1:.08,life:.55,g:10})}});
 if(!k.fin&&k.prog>=LAPS*N){k.fin=true;k.place=++finCount;say(k,k.place+'º LUGAR!','#0A84FF');sfx(500,.8,'triangle');emit('chegou',k)}
 emit('kart',k,inp,dt)};

/* ---------- EFEITOS presos à física ---------- */
const rate=(k,n,r,dt)=>{k[n]=(k[n]||0)+r*dt;let c=0;while(k[n]>=1){k[n]-=1;c++}return c};
on('kart',(k,inp,dt)=>{if(k.fallT>0||!k.dx)return;const S=k.dx.spec,rw=S.w[1],sp=Math.abs(k.v),f=Math.min(1,sp/58),thr=k.thrIn||0,bx=-Math.sin(k.mh),bz=-Math.cos(k.mh),gy=k.y;
 if(k.air){k.dxSk=0;return}
 /* arrancada: pneu patinando */
 if(thr>0&&sp<24&&sp>.5&&state==='go'){for(let n=rate(k,'fxL',34*(1-sp/24),dt);n>0;n--)for(const s of[-1,1]){wp(k,s*rw[0],rw[2]-.4,_w);
  DX.smoke({x:_w.x,y:gy+.4,z:_w.z,vx:bx*(4+Math.random()*5)+(Math.random()-.5)*2,vy:1.5+Math.random()*2,vz:bz*(4+Math.random()*5)+(Math.random()-.5)*2,life:.7+Math.random()*.4,s0:.9,s1:3.2,col:0xE8E8EC,a:.55,d:2})}}
 /* poeira da pista em velocidade (cor do mapa); no gelo vira lasca de gelo */
 if(sp>30){for(let n=rate(k,'fxD',(k.dxIce?26:9)*f,dt);n>0;n--){const s=Math.random()<.5?-1:1;wp(k,s*rw[0],rw[2]-.6,_w);
  DX.smoke({x:_w.x,y:gy+.3,z:_w.z,vx:bx*sp*.12+(Math.random()-.5)*3,vy:.8+Math.random()*1.6,vz:bz*sp*.12+(Math.random()-.5)*3,life:.5+Math.random()*.3,s0:.6,s1:2.4,col:k.dxIce?0xDFF4FF:dust(),a:k.dxIce?.6:.32,d:1.5})}}
 /* drift: fumaça na cor do nível + faíscas + marcas no chão */
 if(k.dOn){const lv=k.drift>=2?3:k.drift>=1.2?2:k.drift>=.6?1:0,col=DRC[lv];
  for(let n=rate(k,'fxR',30,dt);n>0;n--)for(const s of[-1,1]){wp(k,s*rw[0],rw[2]-.3,_w);
   DX.smoke({x:_w.x,y:gy+.35,z:_w.z,vx:bx*3+(Math.random()-.5)*4,vy:1+Math.random()*2.5,vz:bz*3+(Math.random()-.5)*4,life:.55+Math.random()*.3,s0:.9,s1:3,col:lv?col:0xDADDE4,a:lv?.5:.42,d:2});
   if(lv)DX.spark({x:_w.x,y:gy+.25,z:_w.z,vx:bx*6+(Math.random()-.5)*9,vy:3+Math.random()*6,vz:bz*6+(Math.random()-.5)*9,life:.35+Math.random()*.2,s0:.34+lv*.08,s1:.04,col,g:22,d:.5})}
  k.dxSk=(k.dxSk||0)+sp*dt;if(k.dxSk>1.5){k.dxSk=0;for(const s of[-1,1]){wp(k,s*rw[0],rw[2],_w);DX.skid(_w.x,gy,_w.z,k.mh,rw[4]*.8,2.1,-Math.atan(k.slope||0))}}}
 /* freada forte */
 else if(thr<0&&k.v>26){k.dxSk=(k.dxSk||0)+sp*dt;if(k.dxSk>1.6){k.dxSk=0;for(const s of[-1,1]){wp(k,s*rw[0],rw[2],_w);DX.skid(_w.x,gy,_w.z,k.mh,rw[4]*.7,2,-Math.atan(k.slope||0));
   DX.smoke({x:_w.x,y:gy+.3,z:_w.z,vy:1.5,life:.5,s0:.7,s1:2.2,col:0xD8D8DE,a:.4,d:2})}}}
 /* turbo: labaredas saindo do escapamento */
 if(k.boost>0){const lv=k.dxBoostLv||0,cs=lv===3?[0xC66BFF,0xFFFFFF]:lv===1?[0x4FB8FF,0xFFFFFF]:[0xFFD43B,0xFF7A1A,0xFF3B30];
  for(let n=rate(k,'fxB',55,dt);n>0;n--){wp(k,(Math.random()-.5)*1.6,-3.3,_w);
   DX.spark({x:_w.x,y:gy+1+Math.random()*.6,z:_w.z,vx:bx*(8+Math.random()*10)+(Math.random()-.5)*4,vy:(Math.random()-.3)*4,vz:bz*(8+Math.random()*10)+(Math.random()-.5)*4,life:.3+Math.random()*.25,s0:1.1,s1:.1,col:cs[n%cs.length],g:-2,d:2})}}});
on('land',k=>{if(!k.dx||k.fallT>0)return;const v=Math.abs(k.dxVy||0);if(v<6)return;const n=Math.round(clamp(v*.9,8,28));
 for(let i=0;i<n;i++){const a=i/n*PI*2,s=5+v*.25;DX.smoke({x:k.x+Math.cos(a)*1.5,y:k.y+.3,z:k.z+Math.sin(a)*1.5,vx:Math.cos(a)*s,vy:1+Math.random()*2,vz:Math.sin(a)*s,life:.6+Math.random()*.3,s0:.9,s1:3.4,col:dust(),a:.5,d:3})}});
on('hit',k=>{DX.burst('spark',k.x,k.y+2,k.z,26,{sp:14,up:9,col:[0xFFD43B,0xFFFFFF,0xFF6B22],s0:.6,s1:.08,life:.6});DX.burst('smoke',k.x,k.y+1,k.z,10,{sp:6,up:3,col:0x4A4A55,s0:1.2,s1:4,life:.8,a:.5})});
on('bump',(k,o,forte)=>DX.burst('spark',(k.x+o.x)/2,Math.max(k.y,o.y)+1.2,(k.z+o.z)/2,Math.round(8+forte*18),{sp:8+forte*10,up:6,col:[0xFFE08A,0xFF9A2E,0xFFFFFF],s0:.4,s1:.05,life:.4}));
on('driftboost',(k,lv)=>DX.burst('spark',k.x-Math.sin(k.h)*2.5,k.y+1,k.z-Math.cos(k.h)*2.5,12+lv*8,{sp:10+lv*3,up:5,col:[DRC[lv],0xFFFFFF],s0:.6,s1:.06,life:.45}));
on('respawn',k=>{for(let i=0;i<22;i++){const a=i/22*PI*2;DX.spark({x:k.x+Math.cos(a)*2.4,y:k.y+.4,z:k.z+Math.sin(a)*2.4,vx:Math.cos(a)*2,vy:7+Math.random()*4,vz:Math.sin(a)*2,life:.7,s0:.5,s1:.05,col:i%2?0x7FDBFF:0xFFFFFF,g:6})}});
on('fall',k=>{const lava=ST&&ST.pit==='lava';DX.burst(lava?'spark':'smoke',k.x,k.y+.5,k.z,24,{sp:9,up:12,col:lava?[0xFF7A1A,0xFFD43B]:[0xCFEFFF,0xFFFFFF],s0:lava?.7:1.2,s1:lava?.1:3,life:.8,g:lava?20:14,a:.7})});
const CONF=[0xFF3B30,0xFFD43B,0x34C759,0x0A84FF,0xE84393,0xFFFFFF];
on('chegou',k=>{if(!k.human&&k.place>1)return;for(let i=0;i<70;i++){const a=Math.random()*PI*2,s=4+Math.random()*10;
 DX.smoke({x:k.x+Math.sin(k.h)*4,y:k.y+3+Math.random()*2,z:k.z+Math.cos(k.h)*4,vx:Math.cos(a)*s,vy:8+Math.random()*10,vz:Math.sin(a)*s,life:1.6+Math.random(),s0:.42,s1:.34,col:CONF[i%6],a:1,g:9,d:1.6})}});

/* ---------- CÂMERA ---------- */
const _p=new V3(),_l=new V3(),nz=(t,s)=>Math.sin(t*s)+Math.sin(t*s*1.37+1.3)+Math.sin(t*s*2.11+4.1)*.6;
const gAt=(x,z)=>ST&&ST.dx&&ST.dx.ground?ST.dx.ground(x,z):-1e9;
function camera(k,dt){const c=k.cam;if(!c)return;const D=k.dxc||(k.dxc={h:k.h,pos:new V3(),look:new V3(),cl:0,y:k.y,fov:66,tr:0,orb:0,init:0,air:0}),sp=Math.abs(k.v),f=Math.min(1,sp/58),bst=k.boost>0;
 /* tranco das batidas vira tremor suave (some rápido) */
 D.tr=Math.max(D.tr*Math.exp(-3.2*dt),Math.min(1,(k.shake||0)*.85));k.shake=0;
 const alvoH=k.dOn?k.mh+wrap(k.h-k.mh)*.35:k.h;D.h+=wrap(alvoH-D.h)*(1-Math.exp(-(k.dOn?3.4:5)*dt));k.camH=D.h;
 D.cl=damp(D.cl,clamp((k.yr||0)*sp*.011,-1,1),3,dt);D.air=damp(D.air,k.air?1:0,6,dt);
 /* largada: a câmera vem da frente e dá a volta até ficar atrás; chegada: fica de frente, girando devagar */
 const cnt=state==='count'?clamp(stT/3.4,0,1):0,ci=cnt*cnt*(3-2*cnt);D.orb=damp(D.orb,k.fin?1:0,1.6,dt);
 const ang=D.h+ci*2.7+D.orb*(2.55+Math.sin(DX.t*.35)*.35),dist=lerp(lerp(15.5+f*3.5+(bst?2.5:0),10.5,ci),12.5,D.orb),alt=lerp(lerp(7.4+f*1.1,3.6,ci),4.6,D.orb);
 const sx=Math.sin(ang),sz=Math.cos(ang),rx=Math.cos(D.h),rz=-Math.sin(D.h),side=D.cl*3.2*(1-ci)*(1-D.orb);
 const chao=Math.max(0,k.gy>-1?k.gy:(D.lastG||0));if(k.gy>-1)D.lastG=k.gy;D.y=damp(D.y,chao+Math.max(0,k.y-chao)*.55,k.air?5:9,dt);
 let tx=k.x-sx*dist-rx*side,tz=k.z-sz*dist-rz*side,ty=D.y+alt;
 const hb=window.PISTAS&&!ci&&!D.orb?PISTAS.hAt(k.fi-dist/SEG,0):-1e9;ty=Math.max(ty,hb+alt*.55,gAt(tx,tz)+2.6);
 _p.set(tx,ty,tz);if(!D.init){D.init=1;D.pos.copy(_p)}else{const a=1-Math.exp(-11*dt);D.pos.x+=(tx-D.pos.x)*a;D.pos.z+=(tz-D.pos.z)*a;D.pos.y+=(ty-D.pos.y)*(1-Math.exp(-7*dt))}
 const la=(9+f*5)*(1-ci)*(1-D.orb);_l.set(k.x+Math.sin(D.h)*la+rx*D.cl*4*(1-ci),lerp(D.y+2.2+(k.y-D.y)*.5,k.y+2.4,Math.max(ci,D.orb)),k.z+Math.cos(D.h)*la+rz*D.cl*4*(1-ci));
 D.look.lerp(_l,D.init===1?(D.init=2,1):1-Math.exp(-14*dt));
 c.position.copy(D.pos);c.lookAt(D.look);
 const t=DX.t+k.i*7,q=D.tr*D.tr;c.rotateZ(D.cl*.045+nz(t,31)*q*.022);c.rotateX(nz(t,27)*q*.016);c.rotateY(nz(t,23)*q*.012);
 D.fov=damp(D.fov,Math.min(98,64+f*15+(bst?13:0)+D.air*4-ci*10-D.orb*14),bst?9:5,dt);k.fov=c.fov=D.fov;
 /* riscos de velocidade */
 const sk=k.dxStreak;if(sk){sk.position.copy(c.position);sk.quaternion.copy(c.quaternion);const o=clamp((sp-48)/34,0,.42)+(bst?.4:0);sk.material.opacity=damp(sk.material.opacity,DX.q>0?o:o*.5,6,dt);sk.visible=sk.material.opacity>.01;sk.userData.tex.offset.y-=dt*(1.5+f*2.5+(bst?2:0))}}

/* ---------- a cada quadro: vida dos karts, pilotos e câmera ---------- */
const rs={mode:'race',steer:0,roll:0,acc:0,f:0,air:false,hit:0,boost:false,fin:0,bounce:0,drift:false,dt:0};
on('visuals',dt=>{if(dt<=0||!(state==='count'||state==='go'))return;
 for(const k of karts){if(!k.dx)continue;
  /* inclinação nos morros sem tranco; o balanço do drift agora é da suspensão */
  const D=k.dx;D.rx=damp(D.rx==null?k.g.rotation.x:D.rx,k.g.rotation.x,k.air?8:14,dt);k.g.rotation.x=D.rx;if(k.dOn)k.g.rotation.z-=.08;
  DX.kartVis(k,dt);
  if(DX.SH.on)k.sh.visible=false;
  const rig=D.pil.userData.rig;rs.mode=state==='count'?'idle':'race';rs.steer=k.spin>0?0:(k.dOn?k.dDir*.9:(k.stS||0));rs.roll=D.roll;rs.acc=D.acc||0;rs.f=Math.min(1,Math.abs(k.v)/58);rs.air=k.air&&k.fallT<=0;
  rs.hit=Math.max(k.spin>0?1:0,D.hit,k.fallT>0?1:0);rs.boost=k.boost>0;rs.fin=k.fin?(k.place<=Math.max(1,Math.floor(karts.length/2))?1:9):0;rs.bounce=D.by;rs.drift=k.dOn;rs.dt=dt;DX.rigUpdate(rig,rs);
  if(k.cam&&k.human)camera(k,dt)}});
on('start',()=>{scene.children.filter(o=>o.userData.dxStreak).forEach(o=>scene.remove(o));
 humans.forEach((k,i)=>{const m=DX.streak(i+1);m.userData.dxStreak=1;scene.add(m);k.dxStreak=m;k.cam.layers.enable(i+1);k.cam.far=1900});karts.forEach(k=>{k.dxc=null;k.stS=0})});

/* ---------- transição menu → corrida: cortina diagonal ---------- */
{const st=document.createElement('style');st.textContent='#dxWipe{position:fixed;inset:-10vh -30vw;z-index:40;pointer-events:none;display:none;transform:skewX(-14deg)}'+
 '#dxWipe i{position:absolute;top:0;bottom:0;width:21%;background:linear-gradient(180deg,#FFD43B,#FF6B22 55%,#E84393);animation:dxW .75s cubic-bezier(.6,0,.3,1) both}'+
 '#dxWipe i:nth-child(2n){background:linear-gradient(180deg,#2A1A55,#10182E)}@keyframes dxW{0%{transform:translateX(0)}35%{transform:translateX(0)}100%{transform:translateX(160vw)}}';document.head.appendChild(st);
 const w=document.createElement('div');w.id='dxWipe';for(let i=0;i<5;i++){const b=document.createElement('i');b.style.left=i*20+'%';b.style.animationDelay=i*.05+'s';w.appendChild(b)}document.body.appendChild(w);
 on('start',()=>{w.style.display='none';void w.offsetWidth;w.style.display='block';clearTimeout(w._t);w._t=setTimeout(()=>w.style.display='none',1100)})}
})();
