/* ===== KART RUSH DELUXE · MAPAS (ferramentas) =====
 As pistas Deluxe usam o construtor de pista 3D do jogo (alturas, ponte, espiral, rampa) e ganham aqui o que faltava:
  · TERRENO com relevo: uma malha facetada que abraça a pista (morros, vales, lagos, mar), em vez de um chão liso;
  · enfeites instanciados pousados no terreno (1 desenho por tipo), túneis temáticos, postes de luz, água animada;
  · OBJETOS INTERATIVOS: bata neles e eles saem voando, quicam e voltam depois;
  · céu próprio (dx-core), neblina, direção do sol e cor da poeira de cada mapa.
 Cada mapa fica num arquivo: dx-map-gelo.js, dx-map-candy.js, dx-map-pirata.js. */
if(window.PHONE)throw new Error('PHONEMODE');
(()=>{const {lerp,sst,damp,V3}=DX,PI=Math.PI,HT=PISTAS.HT,ts=i=>((i%N)+N)%N,LN=DX.lin;
const MAPS={};DX.MAPS=MAPS;

/* ---------- terreno ---------- */
function terrain(d,o){const hw=W/2,cell=o.cell||9,mg=o.margin||520,F=o.fall||70,C=hw+5;let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;
 SP.forEach(p=>{x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);z0=Math.min(z0,p.z);z1=Math.max(z1,p.z)});x0-=mg;x1+=mg;z0-=mg;z1+=mg;
 const nx=Math.ceil((x1-x0)/cell),nz=Math.ceil((z1-z0)/cell),H=new Float32Array((nx+1)*(nz+1)),DM=new Float32Array((nx+1)*(nz+1));
 const BR=new Uint8Array(N),GP=new Uint8Array(N),TN=new Uint8Array(N);
 (d.pon||[]).forEach(([a,b])=>{for(let i=Math.round(a*N)-10;i<=Math.round(b*N)+10;i++)BR[ts(i)]=1});
 d.gI.forEach(g=>{if(HT[ts(g.a)]>4)for(let i=g.a-1;i<=g.b+1;i++)GP[ts(i)]=1});
 (d.dx.tun||[]).forEach(([a,b])=>{for(let i=a;i<=b;i++)TN[ts(i)]=1});
 (d.dx.br||[]).forEach(([a,b])=>{for(let i=a;i<=b;i++)BR[ts(i)]=1});
 const R2=(C+F+40)**2,C2=C*C,bed=o.bed==null?-3:o.bed,TR=hw+5;
 for(let iz=0;iz<=nz;iz++)for(let ix=0;ix<=nx;ix++){const x=x0+ix*cell,z=z0+iz*cell;let dm=1e18,bi=0,low=1e9,ws=0,wh=0;
  for(let j=0;j<N;j+=2){const p=SP[j],dx=p.x-x,dz=p.z-z,d2=dx*dx+dz*dz;if(d2<dm){dm=d2;bi=j}
   if(d2<R2){const hj=HT[j];if(d2<C2&&!BR[j]&&hj<low)low=hj;const w=1/(d2*d2+60);ws+=w;wh+=w*hj}}
  const dmin=Math.sqrt(dm),nat=o.nat(x,z,dmin);let h;
  if(low<1e8)h=low-.3;else if(ws>0)h=lerp(wh/ws-.3,nat,sst(C,C+F,dmin));else h=nat;
  if(BR[bi]&&dmin<hw+60)h=lerp(bed,Math.min(h,low<1e8?h:1e9),sst(hw+40,hw+60,dmin));
  if(GP[bi]&&dmin<hw+34)h=Math.min(h,lerp(HT[bi]-(o.gapDeep||14),h,sst(hw+10,hw+34,dmin)));
  if(TN[bi]&&dmin>=TR)h=Math.max(h,HT[bi]+TR*.66*(1-sst(TR,TR+(o.mound||70),dmin)));
  H[iz*(nx+1)+ix]=h;DM[iz*(nx+1)+ix]=dmin}
 const bil=(A,x,z)=>{const fx=clamp((x-x0)/cell,0,nx-.001),fz=clamp((z-z0)/cell,0,nz-.001),ix=Math.floor(fx),iz=Math.floor(fz),u=fx-ix,v=fz-iz,a=iz*(nx+1)+ix;
  return lerp(lerp(A[a],A[a+1],u),lerp(A[a+nx+1],A[a+nx+2],u),v)};
 const ground=(x,z)=>bil(H,x,z),dist=(x,z)=>bil(DM,x,z);
 /* malha facetada: cada triângulo com a sua cor (pela altura, inclinação e distância da pista) */
 const P=new Float32Array(nx*nz*18),Cc=new Float32Array(nx*nz*18),c=new THREE.Color();let q=0;
 const tri=(ax,az,bx,bz,cx,cz)=>{const ha=H[az*(nx+1)+ax],hb=H[bz*(nx+1)+bx],hc=H[cz*(nx+1)+cx],X=i=>x0+i*cell,Z=i=>z0+i*cell;
  const mx=(X(ax)+X(bx)+X(cx))/3,mz=(Z(az)+Z(bz)+Z(cz))/3,mh=(ha+hb+hc)/3,sl=(Math.max(ha,hb,hc)-Math.min(ha,hb,hc))/cell;
  const col=o.col(mx,mz,mh,sl,(DM[az*(nx+1)+ax]+DM[bz*(nx+1)+bx]+DM[cz*(nx+1)+cx])/3);c.set(col).convertSRGBToLinear();const j=.94+Math.random()*.12;
  [[ax,az,ha],[bx,bz,hb],[cx,cz,hc]].forEach(v=>{P[q]=X(v[0]);P[q+1]=v[2];P[q+2]=Z(v[1]);Cc[q]=c.r*j;Cc[q+1]=c.g*j;Cc[q+2]=c.b*j;q+=3})};
 for(let iz=0;iz<nz;iz++)for(let ix=0;ix<nx;ix++){if((ix+iz)%2){tri(ix,iz,ix,iz+1,ix+1,iz);tri(ix+1,iz,ix,iz+1,ix+1,iz+1)}else{tri(ix,iz,ix,iz+1,ix+1,iz+1);tri(ix,iz,ix+1,iz+1,ix+1,iz)}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('color',new THREE.BufferAttribute(Cc,3));g.computeVertexNormals();
 const mesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,flatShading:true,roughness:o.rough==null?.95:o.rough,metalness:0}));mesh.receiveShadow=true;mesh.userData.dxTerrain=1;
 return{mesh,ground,dist,x0,x1,z0,z1}}

/* ---------- caixa de ferramentas de um mapa ---------- */
function tools(d){const X=d.dx,hw=W/2,T=X.T,o3=new THREE.Object3D();
 const B={d,hw,ground:T.ground,dist:T.dist,world,
  /* u (0-1) do ponto de controle k do traçado (conta os pontos extras da espiral) */
  uOf(k){const P=d.P.pts;let e=0;const fl=Math.floor(k);for(let i=0;i<fl;i++)if(P[i%P.length].m==='espiral')e+=15;const a=d.uk[Math.min(d.uk.length-1,fl+e)],b=d.uk[Math.min(d.uk.length-1,fl+e+1)];return a+(b-a)*(k-fl)},
  iOf(k){return ts(Math.round(B.uOf(k)*N))},
  /* ponto ao lado da pista: fora do asfalto pousa no terreno */
  at(u,lat){const p=ptAt(u,lat);if(Math.abs(lat||0)>hw+1)p.y=T.ground(p.x,p.z);return p},
  add(o){world.add(o);return o},
  anim(fn){X.anim.push(fn)},
  /* sorteia n lugares no terreno: fn(x,z,altura,distância da pista) devolve a escala (0 = não serve) */
  scatter(n,fn,area){const r=[],a=area||[T.x0+60,T.x1-60,T.z0+60,T.z1-60];for(let t=0;t<n*14&&r.length<n;t++){const x=a[0]+Math.random()*(a[1]-a[0]),z=a[2]+Math.random()*(a[3]-a[2]),h=T.ground(x,z),s=fn(x,z,h,T.dist(x,z));if(s)r.push({x,y:h,z,s,r:Math.random()*6.283})}return r},
  /* fileira ao longo da pista: de u0 a u1, a cada 'passo' metros, deslocada 'lat' */
  along(u0,u1,passo,lat,fn){const out=[];for(let u=u0;u<u1;u+=passo/LEN){const p=B.at(u,lat);if(!fn||fn(p,u))out.push({x:p.x,y:p.y,z:p.z,s:1,r:p.h})}return out},
  /* o lugar mais livre perto do meio do mapa (para as atrações centrais) */
  centro(rad){let cx=0,cz=0;SP.forEach(p=>{cx+=p.x/N;cz+=p.z/N});let best=null;for(let gx=-10;gx<=10;gx++)for(let gz=-10;gz<=10;gz++){const x=cx+gx*(T.x1-T.x0)/26,z=cz+gz*(T.z1-T.z0)/26,dd=T.dist(x,z),sc=Math.min(dd,rad*1.6)-.15*Math.hypot(x-cx,z-cz);if(!best||sc>best.sc)best={x,z,sc,dd,y:T.ground(x,z)}}d.dx.miolo=best;return best},
  /* espalha um modelo (kit) em vários lugares com 1 desenho por material */
  inst(K,pts,op){op=op||{};const out=[];if(!pts.length)return out;for(const b in K.node.bk){const m=new THREE.InstancedMesh(DX.bake(K.node.bk[b]),op.mat||DX.mats[b]||DX.mats.flat,pts.length);
   pts.forEach((p,i)=>{o3.position.set(p.x,p.y+(op.dy||0),p.z);o3.rotation.set(op.tilt?(Math.random()-.5)*op.tilt:0,p.r||0,op.tilt?(Math.random()-.5)*op.tilt:0);o3.scale.setScalar(p.s||1);o3.updateMatrix();m.setMatrixAt(i,o3.matrix)});
   m.castShadow=op.cast!==false&&b!=='halo'&&b!=='glass';m.frustumCulled=false;if(b==='halo'||b==='glass')m.renderOrder=2;world.add(m);out.push(m)}return out},
  /* peça única (kit montado) no lugar */
  put(K,x,y,z,ry,s){const g=K.build();g.position.set(x,y,z);g.rotation.y=ry||0;if(s)g.scale.setScalar(s);world.add(g);return g},
  /* túnel em arco com cor do mapa, costelas de luz e portais */
  tunnel(i0,i1,op){const R=hw+5,S=10,P2=[],I2=[];let n=0;for(let i=i0;i<=i1;i++){const j=ts(i),p=SP[j],r=RT[j];for(let s=0;s<=S;s++){const an=PI*s/S,l=Math.cos(an)*R,y=HT[j]+Math.sin(an)*R*.66;P2.push(p.x+r.x*l,y,p.z+r.z*l)}
    if(i<i1)for(let s=0;s<S;s++){const A=n*(S+1)+s;I2.push(A,A+S+1,A+1,A+1,A+S+1,A+S+2)}n++}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P2,3));g.setIndex(I2);g.computeVertexNormals();
   const sh=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:LN(op.col),roughness:.85,side:THREE.DoubleSide,flatShading:true,emissive:LN(op.em||0),emissiveIntensity:op.em?.35:0}));world.add(sh);
   const K=DX.kit();for(let i=i0+3;i<i1-1;i+=op.step||7){const j=ts(i),h=Math.atan2(TG[j].x,TG[j].z),k=K.at(SP[j].x,HT[j],SP[j].z,[0,h,0]);k.tor(R-.5,.5,DX.Gw(op.luz),0,0,0,null,PI,[1,.66,1],22)}
   for(const i of[i0,i1]){const j=ts(i),h=Math.atan2(TG[j].x,TG[j].z),k=K.at(SP[j].x,HT[j],SP[j].z,[0,h,0]);k.tor(R+.6,2.2,DX.Fl(op.portal||op.col),0,0,0,null,PI,[1,.66,1],14)}
   const m=K.build({noShadow:true});world.add(m);return sh},
  /* objetos que saem voando quando um kart bate */
  knock(K,pts,op){op=op||{};if(!pts.length)return;const ms=B.inst(K,pts,{cast:true});const L=pts.map(p=>({x:p.x,y:p.y,z:p.z,x0:p.x,y0:p.y,z0:p.z,r:p.r||0,s:p.s||1,vx:0,vy:0,vz:0,rx:0,rz:0,wx:0,wz:0,t:0,fly:false,back:0}));
   X.knock.push({ms,L,rad:op.rad||2.2,dy:op.dy||0,som:op.som||220,cor:op.cor||0xFFFFFF,wob:op.wob||0})}};
 return B}

/* ---------- registro de um mapa ---------- */
DX.addMap=function(m){const P={id:m.id,nome:m.nome,tema:m.tema,espH:m.espH,espR:m.espR,pts:m.pts.map(a=>({x:a[0],z:a[1],h:a[2],m:a[3]||''}))};
 const d=Object.assign(PISTAS.defPista(P),{cenV:m.cenV||'dx2',neg:!!m.neg,id:m.id,nome:m.nome,ico:m.ico,dif:m.dif,esc:ESC*.85,editavel:false,sub:m.sub,menu:m.menu,saia:m.saia,pit:m.pit,pitMat:m.pitMat,fallMsg:m.fallMsg,pitCor:m.pitCor,
  sky:m.fog[0],fogC:m.fog[0],fogN:m.fog[1]/1.3,fogF:m.fog[2]/1.3,hemi:m.hemi,sun:m.sun,road:m.road,bar:m.bar,cone:m.cone,mm:m.mm,slipTex:m.slipTex,dx:{def:m,sky:m.sky,dust:m.dust,sunDir:m.sunDir,anim:[],knock:[],tun:[]},
  build(dd){const X=dd.dx;X.anim=[];X.knock=[];X.T=terrain(dd,m.ter);X.ground=X.T.ground;world.add(X.T.mesh);const B=tools(dd);m.cena(B,dd);dd.arches=m.placas?m.placas(B):[]}});
 STAGES[m.id]=d;MAPS[m.id]=d;return d};
/* trechos próprios (gelo escorregadio, túnel) dependem do traçado pronto */
{const _st=setTrack;setTrack=function(d){_st(d);if(!d.dx||!d.dx.def)return;const m=d.dx.def,P=d.P.pts,uO=k=>{let e=0;for(let i=0;i<k;i++)if(P[i].m==='espiral')e+=15;return d.uk[k+e]};
 d.iI=(m.gelo||[]).map(g=>({a:Math.round(uO(g[0])*N),b:Math.round(uO(g[1])*N),l0:g[2],l1:g[3]}));
 const R0=t=>Math.round(lerp(uO(Math.floor(t)),uO(Math.floor(t)+1),t%1)*N);d.dx.br=(m.pontes||[]).map(t=>[R0(t[0]),R0(t[1])]);
 d.dx.tun=(m.tuneis||[]).map(t=>[Math.round(lerp(uO(Math.floor(t[0])),uO(Math.floor(t[0])+1),t[0]%1)*N),Math.round(lerp(uO(Math.floor(t[1])),uO(Math.floor(t[1])+1),t[1]%1)*N)])}}

/* ---------- troca de mapa: céu, sol e neblina ---------- */
const SUN0=new V3(80,150,60).normalize();
on('stage',d=>{const X=d.dx;DX.sky(X&&X.sky?X.sky:null);if(X&&X.sunDir)DX.SH.dir.set(X.sunDir[0],X.sunDir[1],X.sunDir[2]).normalize();else DX.SH.dir.copy(SUN0)});

/* ---------- objetos interativos ---------- */
const o3=new THREE.Object3D();
function setK(g,i,p,dy){o3.position.set(p.x,p.y+dy,p.z);o3.rotation.set(p.rx,p.r,p.rz);o3.scale.setScalar(p.s*(p.back>0?1-p.back:1));o3.updateMatrix();for(const m of g.ms){m.setMatrixAt(i,o3.matrix);m.instanceMatrix.needsUpdate=true}}
on('kart',k=>{const X=ST&&ST.dx;if(!X||!X.knock||k.fallT>0)return;const sp=Math.abs(k.v);if(sp<8)return;
 for(const g of X.knock)for(let i=0;i<g.L.length;i++){const p=g.L[i];if(p.fly||p.back>0)continue;const dx=p.x-k.x,dz=p.z-k.z;if(dx*dx+dz*dz>(g.rad+1.6)**2||Math.abs(p.y-k.y)>4)continue;
  p.fly=true;p.t=0;const a=k.mh+(Math.random()-.5)*.9;p.vx=Math.sin(a)*sp*.85;p.vz=Math.cos(a)*sp*.85;p.vy=9+sp*.16;p.wx=(Math.random()-.5)*14;p.wz=(Math.random()-.5)*14;
  k.v*=.95;if(k.dx){k.dx.hit=Math.max(k.dx.hit,.4);k.dx.bv+=2}if(k.human){sfx(g.som+Math.random()*60,.12,'square',.05);rumble(k,.3);k.shake=Math.max(k.shake||0,.25)}
  DX.burst('smoke',p.x,p.y+1,p.z,8,{sp:6,up:4,col:g.cor,s0:.7,s1:2.2,life:.5,a:.6})}});
on('update',dt=>{const X=ST&&ST.dx;if(!X||!X.knock)return;for(const g of X.knock)for(let i=0;i<g.L.length;i++){const p=g.L[i];
 if(p.fly){p.t+=dt;p.vy-=38*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.rx+=p.wx*dt;p.rz+=p.wz*dt;const gy=X.ground(p.x,p.z);
  if(p.y<gy&&p.vy<0){if(Math.abs(p.vy)>7&&p.t<4){p.y=gy;p.vy*=-.45;p.vx*=.6;p.vz*=.6;p.wx*=.6;p.wz*=.6}else{p.y=gy;p.fly=false;p.back=-3}}
  if(p.t>6){p.fly=false;p.back=-.01}setK(g,i,p,g.dy)}
 else if(p.back<0){p.back+=dt;if(p.back>=0){p.back=1;p.x=p.x0;p.y=p.y0;p.z=p.z0;p.rx=p.rz=0;DX.burst('spark',p.x,p.y+1,p.z,8,{sp:4,up:5,col:0xFFFFFF,s0:.4,s1:.05,life:.4,g:8})}}
 else if(p.back>0){p.back=Math.max(0,p.back-dt*2.5);setK(g,i,p,g.dy)}}});
on('start',()=>{const X=ST&&ST.dx;if(!X||!X.knock)return;for(const g of X.knock)g.L.forEach((p,i)=>{p.x=p.x0;p.y=p.y0;p.z=p.z0;p.rx=p.rz=0;p.fly=false;p.back=0;setK(g,i,p,g.dy)})});
on('visuals',dt=>{const X=ST&&ST.dx;if(!X||!X.anim||dt<=0)return;const t=DX.t;for(const f of X.anim)f(t,dt)});

/* ---------- água/gelo/chocolate: plano grande com textura que desliza e reflexo ---------- */
DX.liquid=function(o){const t=new THREE.CanvasTexture(cv(256,256,(g,w,h)=>{g.fillStyle=o.base;g.fillRect(0,0,w,h);for(let i=0;i<(o.n||60);i++){const x=Math.random()*w,y=Math.random()*h,r=8+Math.random()*30,gr=g.createRadialGradient(x,y,1,x,y,r);gr.addColorStop(0,o.luz);gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;
   for(const ox of[-w,0,w])for(const oy of[-h,0,h])g.fillRect(x-r+ox,y-r+oy,2*r,2*r)}if(o.risco){g.strokeStyle=o.risco;g.lineWidth=1.5;for(let i=0;i<16;i++){g.beginPath();let x=Math.random()*w,y=Math.random()*h;g.moveTo(x,y);for(let s=0;s<4;s++){x+=(Math.random()-.5)*60;y+=(Math.random()-.5)*60;g.lineTo(x,y)}g.stroke()}}}));
 t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.repeat.set(o.rep||30,o.rep||30);
 return new THREE.MeshStandardMaterial({map:t,roughness:o.rough==null?.12:o.rough,metalness:o.metal==null?.25:o.metal,envMap:DX.env,envMapIntensity:o.env==null?1:o.env,transparent:!!o.alpha,opacity:o.alpha||1,emissive:LN(o.em||0),emissiveIntensity:o.em?.35:0})};
DX.sea=function(B,y,mat,kind,flow){const T=B.d.dx.T,m=new THREE.Mesh(new THREE.PlaneGeometry(T.x1-T.x0+1600,T.z1-T.z0+1600),mat);m.rotation.x=-PI/2;m.position.set((T.x0+T.x1)/2,y,(T.z0+T.z1)/2);m.receiveShadow=true;if(flow!==false){m.userData.pit=kind||'agua';pitMeshes.push(m)}B.world.add(m);return m};

/* ---------- neve/pétalas/cinzas caindo em volta de qualquer câmera (custo zero no processador) ---------- */
DX.fall=function(B,o){const n=o.n||1400,P=new Float32Array(n*3),S=new Float32Array(n);for(let i=0;i<n;i++){P[i*3]=Math.random()*o.box;P[i*3+1]=Math.random()*o.box;P[i*3+2]=Math.random()*o.box;S[i]=.5+Math.random()}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('aS',new THREE.BufferAttribute(S,1));
 const u={t:{value:0},uH:{value:400},col:{value:LN(o.col)},box:{value:o.box},vel:{value:new V3(o.vx||0,o.vy||-6,o.vz||0)},sz:{value:o.size||.3},maxY:{value:o.maxY==null?1e5:o.maxY}};
 const m=new THREE.Points(g,new THREE.ShaderMaterial({uniforms:u,transparent:true,depthWrite:false,
  vertexShader:'attribute float aS;uniform float t,uH,box,sz,maxY;uniform vec3 vel;varying float a;void main(){vec3 p=position+vel*t*aS+vec3(sin(t*.7+position.y)*1.5,0.,cos(t*.6+position.x)*1.5);p=mod(p-cameraPosition,box)-box*.5+cameraPosition;vec4 mv=viewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;float dd=-mv.z;a=smoothstep(box*.5,box*.3,dd)*smoothstep(1.,6.,dd)*step(p.y,maxY);gl_PointSize=sz*aS*uH/max(.1,dd);}',
  fragmentShader:'uniform vec3 col;varying float a;void main(){float d=length(gl_PointCoord-.5)*2.;gl_FragColor=vec4(col,a*smoothstep(1.,.3,d)*.9);}'}));
 m.frustumCulled=false;m.renderOrder=5;m.onBeforeRender=(r,s,cam)=>{const v=new THREE.Vector4();r.getCurrentViewport(v);u.uH.value=v.w*cam.projectionMatrix.elements[5]*.5};B.world.add(m);B.anim(t=>u.t.value=t);return m};
DX.mapKit={terrain,tools};
})();
