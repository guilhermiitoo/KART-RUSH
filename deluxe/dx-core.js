/* ===== KART RUSH DELUXE · NÚCLEO =====
 Base da remasterização. Tudo que os outros arquivos da pasta deluxe/ usam mora aqui:
  · KIT DE MODELAGEM: as peças (bolas, caixas arredondadas, tubos, tornos…) são somadas numa malha só por material,
    com a cor gravada em cada vértice. Um kart inteiro vira ~12 desenhos na placa de vídeo (antes eram mais de 100).
  · MATERIAIS compartilhados (pintura brilhante com reflexo, metal, fosco, luz, vidro) + mapa de reflexo gerado em código.
  · SOMBRAS de verdade: a luz do sol acompanha cada câmera (inclusive na tela dividida).
  · CÉU em degradê com sol, nuvens, estrelas e aurora (shader), preso à câmera.
  · PARTÍCULAS (fumaça, poeira, faíscas, fogo) com tamanho em metros, marcas de pneu e riscos de velocidade.
  · QUALIDADE automática: se a corrida ficar lenta, desliga sombras e reduz partículas. */
if(window.PHONE)throw new Error('PHONEMODE');
window.DX=(()=>{
const V3=THREE.Vector3,M4=THREE.Matrix4,QT=THREE.Quaternion,EU=THREE.Euler,COL=THREE.Color;
const DX={V3,M4,QT,q:2,rigs:[],t:0};
const lin=c=>new COL(c).convertSRGBToLinear();DX.lin=lin;
const lerp=(a,b,t)=>a+(b-a)*t,sst=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};DX.lerp=lerp;DX.sst=sst;
/* amortecimento que não depende da taxa de quadros */
const damp=(a,b,k,dt)=>a+(b-a)*(1-Math.exp(-k*dt));DX.damp=damp;
/* sorteio com semente (cenário sempre igual) e ruído suave 2D */
DX.rng=s=>()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296};
const h2=(x,y)=>{const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s)};
DX.noise=(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
 return lerp(lerp(h2(xi,yi),h2(xi+1,yi),u),lerp(h2(xi,yi+1),h2(xi+1,yi+1),u),v)};
DX.fbm=(x,y,o)=>{let a=.5,f=1,s=0,n=0;for(let i=0;i<(o||4);i++){s+=a*DX.noise(x*f,y*f);n+=a;a*=.5;f*=2.03}return s/n};

/* ---------- reflexo do ambiente (estúdio em degradê + painéis de luz) ---------- */
let ENV=null;
try{const pm=new THREE.PMREMGenerator(R),S=new THREE.Scene();
 const sky=new THREE.Mesh(new THREE.SphereGeometry(50,24,16),new THREE.ShaderMaterial({side:THREE.BackSide,vertexShader:'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'varying vec3 p;void main(){float h=normalize(p).y;vec3 c=mix(vec3(.55,.5,.48),vec3(.75,.88,1.),smoothstep(-.1,.5,h));c=mix(vec3(.16,.15,.2),c,smoothstep(-.35,-.02,h));gl_FragColor=vec4(c,1.);}'}));S.add(sky);
 [[0,40,10,26,9,2.2],[-38,16,-8,10,16,1.5],[36,12,14,8,12,1.2],[0,22,-40,30,6,1.4]].forEach(a=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(a[3],a[4]),new THREE.MeshBasicMaterial({color:new COL(a[5],a[5],a[5]*.97),side:THREE.DoubleSide}));m.position.set(a[0],a[1],a[2]);m.lookAt(0,0,0);S.add(m)});
 ENV=pm.fromScene(S,.03).texture;pm.dispose()}catch(e){console.warn('DX env',e)}
DX.env=ENV;

/* ---------- materiais compartilhados ---------- */
const Std=o=>new THREE.MeshStandardMaterial(Object.assign({vertexColors:true},o));
DX.mats={
 matte:Std({roughness:.72,metalness:0,envMap:ENV,envMapIntensity:.35}),
 soft:Std({roughness:.95,metalness:0}),
 paint:Std({roughness:.2,metalness:.3,envMap:ENV,envMapIntensity:1.15}),
 metal:Std({roughness:.2,metalness:.95,envMap:ENV,envMapIntensity:1.3}),
 glow:new THREE.MeshBasicMaterial({vertexColors:true}),
 glass:Std({roughness:.05,metalness:.4,transparent:true,opacity:.45,envMap:ENV,envMapIntensity:1.6,depthWrite:false}),
 halo:new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.28,blending:THREE.AdditiveBlending,depthWrite:false}),
 flat:Std({roughness:.9,metalness:0,flatShading:true})};
/* atalhos para escolher o material de uma peça: P(cor)=pintura, Mt=metal, Gw=luz, Gl=vidro, Ha=halo, Sf=tecido/pelo, Fl=facetado */
const tag=b=>c=>({c,b});
DX.P=tag('paint');DX.Mt=tag('metal');DX.Gw=tag('glow');DX.Gl=tag('glass');DX.Ha=tag('halo');DX.Sf=tag('soft');DX.Fl=tag('flat');

/* ---------- geometrias-base (em cache) ---------- */
const GC={},G=(k,f)=>GC[k]||(GC[k]=f());
function rboxGeo(w,h,d,r){r=Math.min(r,w/2,h/2,d/2);const H=[w/2,h/2,d/2],pos=[],nor=[],p=[0,0,0],q=new V3();
 const lines=a=>{const x=H[a];return x-r<1e-4?[-x,-x*.71,0,x*.71,x]:[-x,-x+r*.29,-x+r,x-r,x-r*.29,x]};
 const vert=(a,s,u,v,cu,cv)=>{p[a]=s*H[a];p[u]=cu;p[v]=cv;const I=[0,1,2].map(i=>clamp(p[i],-(H[i]-r),H[i]-r));q.set(p[0]-I[0],p[1]-I[1],p[2]-I[2]);const L=q.length();
  if(L>1e-6){q.multiplyScalar(1/L);pos.push(I[0]+q.x*r,I[1]+q.y*r,I[2]+q.z*r);nor.push(q.x,q.y,q.z)}else{pos.push(p[0],p[1],p[2]);nor.push(a===0?s:0,a===1?s:0,a===2?s:0)}};
 for(let a=0;a<3;a++)for(const s of[-1,1]){const u=(a+1)%3,v=(a+2)%3,lu=lines(u),lv=lines(v);
  for(let i=0;i<lu.length-1;i++)for(let j=0;j<lv.length-1;j++){const A=[lu[i],lv[j]],Bq=[lu[i+1],lv[j]],C=[lu[i+1],lv[j+1]],D=[lu[i],lv[j+1]];
   (s>0?[A,Bq,C,A,C,D]:[A,C,Bq,A,D,C]).forEach(c=>vert(a,s,u,v,c[0],c[1]))}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));return g}
DX.rboxGeo=rboxGeo;

/* ---------- soma de peças numa malha só (posição, normal e cor por vértice) ---------- */
function bake(list){let n=0;for(const it of list)n+=it[0].index?it[0].index.count:it[0].attributes.position.count;
 const P=new Float32Array(n*3),Nn=new Float32Array(n*3),C=new Float32Array(n*3),v=new V3(),nm=new THREE.Matrix3();let o=0;
 for(const [g,m,col] of list){nm.getNormalMatrix(m);const c=col&&col.isColor?col:lin(col),p=g.attributes.position,nn=g.attributes.normal,ix=g.index,cnt=ix?ix.count:p.count,flip=m.determinant()<0,gc=g.attributes.color;
  for(let i=0;i<cnt;i++){let j=i;if(flip){const t=i%3;j=i-t+(t===1?2:t===2?1:0)}const a=ix?ix.getX(j):j;
   v.fromBufferAttribute(p,a).applyMatrix4(m);P[o]=v.x;P[o+1]=v.y;P[o+2]=v.z;
   v.fromBufferAttribute(nn,a).applyMatrix3(nm).normalize();Nn[o]=v.x;Nn[o+1]=v.y;Nn[o+2]=v.z;
   if(gc){C[o]=gc.getX(a)*c.r;C[o+1]=gc.getY(a)*c.g;C[o+2]=gc.getZ(a)*c.b}else{C[o]=c.r;C[o+1]=c.g;C[o+2]=c.b}o+=3}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('normal',new THREE.BufferAttribute(Nn,3));g.setAttribute('color',new THREE.BufferAttribute(C,3));return g}
DX.bake=bake;

/* ---------- KIT: K.ball/box/rbox/cyl/cone/tor/limb/tube/lathe/ext… · K.sub('nome') cria uma parte móvel · K.at() reposiciona ---------- */
const _e=new EU(),_q=new QT(),_p=new V3(),_s=new V3(),UP=new V3(0,1,0);
function mkKit(node,pre){const K={node};
 const put=(geo,c,x,y,z,s,r,quat)=>{const m=new M4();_p.set(x||0,y||0,z||0);if(quat)_q.copy(quat);else if(r)_q.setFromEuler(_e.set(r[0],r[1],r[2]));else _q.identity();
  if(typeof s==='number')_s.set(s,s,s);else if(s)_s.set(s[0],s[1],s[2]);else _s.set(1,1,1);m.compose(_p,_q,_s);if(pre)m.premultiply(pre);
  let col=c,b=K.def||'matte';if(c&&typeof c==='object'&&!c.isColor){col=c.c;b=c.b}(node.bk[b]||(node.bk[b]=[])).push([geo,m,col]);return K};
 const sc=(r,s)=>s?(typeof s==='number'?[r*s,r*s,r*s]:[r*s[0],r*s[1],r*s[2]]):[r,r,r];
 K.put=put;
 K.ball=(r,c,x,y,z,s,rot)=>put(G('s',()=>new THREE.SphereGeometry(1,16,10)),c,x,y,z,sc(r,s),rot);
 K.lowball=(r,c,x,y,z,s,rot)=>put(G('s8',()=>new THREE.SphereGeometry(1,10,7)),c,x,y,z,sc(r,s),rot);
 K.half=(r,c,x,y,z,s,rot)=>put(G('h',()=>new THREE.SphereGeometry(1,16,6,0,Math.PI*2,0,Math.PI/2)),c,x,y,z,sc(r,s),rot);
 K.ico=(r,c,x,y,z,s,rot,d)=>put(G('i'+(d||0),()=>new THREE.IcosahedronGeometry(1,d||0).toNonIndexed()),c,x,y,z,sc(r,s),rot);
 K.box=(w,h,d,c,x,y,z,rot)=>put(G('b',()=>new THREE.BoxGeometry(1,1,1)),c,x,y,z,[w,h,d],rot);
 K.rbox=(w,h,d,r,c,x,y,z,rot,s)=>put(G('r'+[w,h,d,r],()=>rboxGeo(w,h,d,r)),c,x,y,z,s,rot);
 K.cyl=(rt,rb,h,c,x,y,z,rot,s,seg)=>{const k=Math.round(rt/rb*100)/100;return put(G('c'+k+'|'+(seg||12),()=>new THREE.CylinderGeometry(k,1,1,seg||12)),c,x,y,z,s?[rb*s[0],h*s[1],rb*s[2]]:[rb,h,rb],rot)};
 K.cone=(r,h,c,x,y,z,rot,s,seg)=>put(G('k'+(seg||14),()=>new THREE.ConeGeometry(1,1,seg||14)),c,x,y,z,s?[r*s[0],h*s[1],r*s[2]]:[r,h,r],rot);
 K.tor=(Rr,t,c,x,y,z,rot,arc,s,seg)=>put(G('t'+[Math.round(t/Rr*200),arc||0,seg||0],()=>new THREE.TorusGeometry(1,t/Rr,6,seg||20,arc||Math.PI*2)),c,x,y,z,sc(Rr,s),rot);
 K.limb=(a,b,r,c,r2)=>{const A=new V3(a[0],a[1],a[2]),Bv=new V3(b[0],b[1],b[2]),d=Bv.clone().sub(A),L=Math.max(.01,d.length());_q.setFromUnitVectors(UP,d.normalize());
  const k=Math.round(L/r*10)/10;return put(G('l'+k,()=>new THREE.CapsuleGeometry(1,k,3,10)),c,(A.x+Bv.x)/2,(A.y+Bv.y)/2,(A.z+Bv.z)/2,[r,r,r],null,_q.clone())};
 /* tubo curvo passando pelos pontos (gaiolas, escapamentos, mangueiras) */
 K.tube=(pts,r,c,closed,seg)=>put(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new V3(p[0],p[1],p[2])),!!closed,'catmullrom',.5),seg||pts.length*5,r,6,!!closed),c);
 /* torno: perfil [[raio,altura],…] girado em volta do eixo Y */
 K.lathe=(prof,c,x,y,z,rot,s,seg)=>put(new THREE.LatheGeometry(prof.map(p=>new THREE.Vector2(p[0],p[1])),seg||18),c,x,y,z,s,rot);
 /* chapa recortada: contorno [[x,y],…] com espessura (aerofólios, barbatanas, raios) */
 K.ext=(pts,dep,c,x,y,z,rot,s,bev)=>{const sh=new THREE.Shape();pts.forEach((p,i)=>i?sh.lineTo(p[0],p[1]):sh.moveTo(p[0],p[1]));sh.closePath();
  const g=new THREE.ExtrudeGeometry(sh,{depth:dep,bevelEnabled:!!bev,bevelThickness:bev||0,bevelSize:bev||0,bevelSegments:2,curveSegments:6});g.translate(0,0,-dep/2);return put(g,c,x,y,z,s,rot)};
 K.geo=(g,c,x,y,z,rot,s)=>put(g,c,x,y,z,s,rot);
 K.sub=(name,x,y,z,rot)=>{const n={bk:{},kids:[],name,pos:[x||0,y||0,z||0],rot:rot||null};node.kids.push(n);return mkKit(n)};
 K.at=(x,y,z,rot,s)=>{const m=new M4();_p.set(x||0,y||0,z||0);if(rot)_q.setFromEuler(_e.set(rot[0],rot[1],rot[2]));else _q.identity();if(typeof s==='number')_s.set(s,s,s);else if(s)_s.set(s[0],s[1],s[2]);else _s.set(1,1,1);m.compose(_p,_q,_s);if(pre)m.premultiply(pre);const k=mkKit(node,m);k.def=K.def;return k};
 K.mirror=fn=>{fn(K,1);fn(K.at(0,0,0,null,[-1,1,1]),-1)};
 return K}
function buildNode(node,parts,opt){const g=new THREE.Group();if(node.pos)g.position.set(node.pos[0],node.pos[1],node.pos[2]);if(node.rot)g.rotation.set(node.rot[0],node.rot[1],node.rot[2]);
 for(const b in node.bk){const m=new THREE.Mesh(bake(node.bk[b]),(opt&&opt.mats&&opt.mats[b])||DX.mats[b]||DX.mats.matte);m.castShadow=b!=='halo'&&b!=='glass'&&!(opt&&opt.noShadow);m.receiveShadow=!!(opt&&opt.receive);if(b==='halo'||b==='glass')m.renderOrder=2;m.userData.dxb=b;g.add(m)}
 node.kids.forEach(k=>{const c=buildNode(k,parts,opt);g.add(c);if(k.name)parts[k.name]=c});return g}
DX.kit=()=>{const K=mkKit({bk:{},kids:[]});K.build=opt=>{const parts={},g=buildNode(K.node,parts,opt);g.userData.parts=parts;return g};
 /* só a geometria somada (para peças instanciadas do cenário) */
 K.merged=()=>{const all=[];for(const b in K.node.bk)all.push(...K.node.bk[b]);return bake(all)};return K};

/* ---------- SOMBRAS: o sol acompanha a câmera que está desenhando ---------- */
const SH={on:false,size:2048,half:62,dir:new V3(80,150,60).normalize()};DX.SH=SH;
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
scene.add(sun.target);sun.shadow.mapSize.set(SH.size,SH.size);sun.shadow.bias=-.0006;sun.shadow.normalBias=.35;
{const c=sun.shadow.camera;c.left=c.bottom=-SH.half;c.right=c.top=SH.half;c.near=20;c.far=520;c.updateProjectionMatrix()}
const _f=new V3(),_c=new V3(),_vp=new THREE.Vector4();
DX.setShadows=on=>{on=!!on&&DX.q>0;if(SH.on===on)return;SH.on=on;sun.castShadow=on};
DX.setShadowSize=s=>{if(SH.size===s)return;SH.size=s;sun.shadow.mapSize.set(s,s);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}};
/* ganchos por câmera (ex.: neblina azul debaixo d'água); o que mudarem é desfeito depois do desenho */
DX.camHooks=[];const CS={fog:new COL(),bg:new COL(),n:0,f:0,sky:false,on:false};
scene.onAfterRender=()=>{if(!CS.on)return;CS.on=false;scene.fog.color.copy(CS.fog);scene.fog.near=CS.n;scene.fog.far=CS.f;scene.background.copy(CS.bg);sky.visible=CS.sky};
DX.camSave=()=>{if(CS.on)return;CS.on=true;CS.fog.copy(scene.fog.color);CS.n=scene.fog.near;CS.f=scene.fog.far;CS.bg.copy(scene.background);CS.sky=sky.visible};
scene.onBeforeRender=(r,s,cam)=>{
 for(const h of DX.camHooks)h(cam);
 r.getCurrentViewport(_vp);const hpx=_vp.w;FXU.uH.value=hpx*cam.projectionMatrix.elements[5]*.5;
 if(!SH.on)return;cam.getWorldDirection(_f);_f.y=0;const L=_f.length();if(L>1e-3)_f.multiplyScalar(1/L);
 const far=cam===menuCam?0:34;_c.copy(cam.position).addScaledVector(_f,far);_c.y=Math.max(0,cam.position.y-12);
 if(cam.userData.dxFocus)_c.copy(cam.userData.dxFocus);
 /* encaixa no "pixel" do mapa de sombra para a sombra não tremer */
 const tx=SH.half*2/SH.size;_c.x=Math.round(_c.x/tx)*tx;_c.y=Math.round(_c.y/tx)*tx;_c.z=Math.round(_c.z/tx)*tx;
 sun.target.position.copy(_c);sun.position.copy(_c).addScaledVector(SH.dir,260);sun.updateMatrixWorld();sun.target.updateMatrixWorld()};
/* tudo que é chão/pista/cenário recebe sombra */
DX.receive=w=>w.traverse(o=>{if(o.isMesh&&o.material&&!o.material.transparent&&(o.material.isMeshStandardMaterial||o.material.isMeshLambertMaterial))o.receiveShadow=true});
on('construido',(d,w)=>DX.receive(w));

/* ---------- CÉU (domo preso à câmera) ---------- */
const skyU={top:{value:lin(0x2E7BE8)},mid:{value:lin(0x8FC8FF)},hor:{value:lin(0xE8F4FF)},sunC:{value:lin(0xFFF4D0)},sunD:{value:new V3(.4,.75,.3).normalize()},cloud:{value:.5},cloudC:{value:lin(0xFFFFFF)},stars:{value:0},aur:{value:0},t:{value:0}};
const skyM=new THREE.ShaderMaterial({uniforms:skyU,side:THREE.BackSide,depthWrite:false,depthTest:false,fog:false,
 vertexShader:'varying vec3 d;void main(){d=position;vec4 p=projectionMatrix*vec4(mat3(viewMatrix)*position,1.);gl_Position=p.xyww;}',
 fragmentShader:`precision mediump float;varying vec3 d;uniform vec3 top,mid,hor,sunC,sunD,cloudC;uniform float cloud,stars,aur,t;
 float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
 float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}
 void main(){vec3 v=normalize(d);float y=v.y;vec3 c=mix(hor,mid,smoothstep(0.,.22,y));c=mix(c,top,smoothstep(.15,.8,y));c=mix(c,hor*.82,smoothstep(0.,-.25,y));
  float sd=max(dot(v,sunD),0.);c+=sunC*(pow(sd,900.)*3.+pow(sd,28.)*.45+pow(sd,5.)*.16);
  if(stars>0.&&y>0.){vec2 g=v.xz/(y+.35)*90.;vec2 gi=floor(g);float s=h(gi);vec2 o=fract(g)-.5-(vec2(h(gi+3.1),h(gi+7.7))-.5)*.6;c+=stars*smoothstep(.12,0.,length(o))*step(.93,s)*(.6+.4*sin(t*2.+s*40.));}
  if(aur>0.&&y>.02){float a=0.;vec2 q=v.xz/(y+.25);for(int i=0;i<3;i++){float fi=float(i);float w=fbm(vec2(q.x*1.3+fi*3.7+t*.03,q.y*.35-t*.02+fi));a+=smoothstep(.5,.72,w)*(1.-fi*.25);}
   vec3 ac=mix(vec3(.1,1.,.55),vec3(.55,.3,1.),clamp(y*1.6+.2*sin(q.x*2.+t*.2),0.,1.));c+=aur*a*ac*smoothstep(.02,.25,y)*smoothstep(1.,.45,y)*.55;}
  if(cloud>0.&&y>-.02){vec2 q=v.xz/(y+.18)*1.15+vec2(t*.008,t*.004);float w=fbm(q*1.4);float m=smoothstep(1.-cloud*.62,1.-cloud*.62+.22,w)*smoothstep(-.02,.12,y);
   vec3 cc=mix(cloudC*.72,cloudC,smoothstep(.45,.9,fbm(q*2.6+3.)))+sunC*pow(sd,6.)*.25;c=mix(c,cc,m*.92);}
  gl_FragColor=vec4(c,1.);}`});
const sky=new THREE.Mesh(new THREE.SphereGeometry(1,32,20),skyM);sky.frustumCulled=false;sky.renderOrder=-1000;sky.visible=false;scene.add(sky);DX.skyMesh=sky;
DX.sky=o=>{sky.visible=!!o;if(!o)return;const s=(k,v)=>{if(v!=null)skyU[k].value.copy(lin(v))};s('top',o.top);s('mid',o.mid);s('hor',o.hor);s('sunC',o.sunC);s('cloudC',o.cloudC||0xFFFFFF);
 if(o.sunD)skyU.sunD.value.set(o.sunD[0],o.sunD[1],o.sunD[2]).normalize();skyU.cloud.value=o.cloud==null?.5:o.cloud;skyU.stars.value=o.stars||0;skyU.aur.value=o.aur||0};

/* ---------- PARTÍCULAS ---------- */
const FXU={uH:{value:400}};
function pool(n,add){const P=new Float32Array(n*3),C=new Float32Array(n*4),S=new Float32Array(n),g=new THREE.BufferGeometry(),L=[];
 for(let i=0;i<n;i++){L.push({l:0,m:1,x:0,y:0,z:0,vx:0,vy:0,vz:0,g:0,d:0,s0:1,s1:1,r:1,gg:1,b:1,a:1});P[i*3+1]=-9999}
 g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('aCol',new THREE.BufferAttribute(C,4));g.setAttribute('aSize',new THREE.BufferAttribute(S,1));
 const m=new THREE.ShaderMaterial({uniforms:FXU,transparent:true,depthWrite:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending,
  vertexShader:'attribute vec4 aCol;attribute float aSize;uniform float uH;varying vec4 c;void main(){c=aCol;vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=min(420.,aSize*uH/max(.1,-mv.z));}',
  fragmentShader:add?'varying vec4 c;void main(){float d=length(gl_PointCoord-.5)*2.;float a=smoothstep(1.,.0,d);gl_FragColor=vec4(c.rgb*(a*a*1.6+pow(a,6.)*2.),c.a*a);}'
   :'varying vec4 c;void main(){vec2 q=gl_PointCoord-.5;float d=length(q)*2.;float a=smoothstep(1.,.35,d);float sh=.78+.22*smoothstep(.5,-.5,q.y);gl_FragColor=vec4(c.rgb*sh,c.a*a);}'});
 const pts=new THREE.Points(g,m);pts.frustumCulled=false;pts.renderOrder=add?6:5;scene.add(pts);return{L,P,C,S,g,i:0,n,live:0}}
const FX={smoke:pool(900,false),spark:pool(1100,true)};DX.FX=FX;
/* emite 1 partícula: o={x,y,z,vx,vy,vz,life,s0,s1,col,a,g(gravidade),d(arrasto)} */
const _pc=new COL();
function emitP(pl,o){if(DX.q<1&&Math.random()<.5)return;const p=pl.L[pl.i];pl.i=(pl.i+1)%pl.n;p.l=p.m=o.life||.6;p.x=o.x;p.y=o.y;p.z=o.z;p.vx=o.vx||0;p.vy=o.vy||0;p.vz=o.vz||0;p.g=o.g||0;p.d=o.d||0;p.s0=o.s0||1;p.s1=o.s1==null?p.s0:o.s1;
 _pc.set(o.col==null?0xFFFFFF:o.col).convertSRGBToLinear();p.r=_pc.r;p.gg=_pc.g;p.b=_pc.b;p.a=o.a==null?1:o.a}
DX.smoke=o=>emitP(FX.smoke,o);DX.spark=o=>emitP(FX.spark,o);
/* rajada: n partículas saindo em todas as direções */
DX.burst=(kind,x,y,z,n,o)=>{o=o||{};const sp=o.sp||8,up=o.up==null?4:o.up;for(let i=0;i<n;i++){const a=Math.random()*6.283,r=Math.random();
 emitP(FX[kind],{x:x+(Math.random()-.5)*(o.r||.6),y:y+Math.random()*(o.h||.4),z:z+(Math.random()-.5)*(o.r||.6),vx:Math.cos(a)*sp*(.3+r*.7),vy:up*(.4+Math.random()*.8),vz:Math.sin(a)*sp*(.3+r*.7),
  life:(o.life||.6)*(.6+Math.random()*.6),s0:o.s0||.5,s1:o.s1==null?(o.s0||.5)*2:o.s1,col:Array.isArray(o.col)?o.col[i%o.col.length]:o.col,a:o.a,g:o.g==null?(kind==='spark'?24:-1):o.g,d:o.d||1.5})}};
function stepPool(pl,dt){const {L,P,C,S}=pl;let live=0;for(let i=0;i<pl.n;i++){const p=L[i];if(p.l<=0)continue;p.l-=dt;if(p.l<=0){P[i*3+1]=-9999;S[i]=0;continue}live++;
  const f=Math.exp(-p.d*dt);p.vx*=f;p.vz*=f;p.vy=p.vy*f-p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;const u=1-p.l/p.m;
  P[i*3]=p.x;P[i*3+1]=p.y;P[i*3+2]=p.z;S[i]=p.s0+(p.s1-p.s0)*u;C[i*4]=p.r;C[i*4+1]=p.gg;C[i*4+2]=p.b;C[i*4+3]=p.a*Math.min(1,u*8)*(1-u*u)}
 if(live||pl.live){pl.g.attributes.position.needsUpdate=true;pl.g.attributes.aCol.needsUpdate=true;pl.g.attributes.aSize.needsUpdate=true}pl.live=live}

/* ---------- marcas de pneu (faixas escuras que somem depois de um tempo) ---------- */
const SKN=420,skG=new THREE.PlaneGeometry(1,1);skG.rotateX(-Math.PI/2);
const skid=new THREE.InstancedMesh(skG,new THREE.MeshBasicMaterial({color:0x101014,transparent:true,opacity:.34,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3}),SKN);
skid.frustumCulled=false;skid.renderOrder=1;scene.add(skid);let ski=0;const _o=new THREE.Object3D();
{_o.scale.set(0,0,0);_o.updateMatrix();for(let i=0;i<SKN;i++)skid.setMatrixAt(i,_o.matrix)}
DX.skid=(x,y,z,h,w,len,pitch)=>{_o.position.set(x,y+.07,z);_o.rotation.set(pitch||0,h,0,'YXZ');_o.scale.set(w,1,len);_o.updateMatrix();skid.setMatrixAt(ski,_o.matrix);ski=(ski+1)%SKN;skid.instanceMatrix.needsUpdate=true};
DX.clearSkids=()=>{_o.scale.set(0,0,0);_o.updateMatrix();for(let i=0;i<SKN;i++)skid.setMatrixAt(i,_o.matrix);skid.instanceMatrix.needsUpdate=true};

/* ---------- riscos de velocidade: um túnel de riscos em volta de cada câmera (cada jogador só vê o seu) ---------- */
const stT=new THREE.CanvasTexture(cv(256,256,(g,w,h)=>{g.clearRect(0,0,w,h);for(let i=0;i<22;i++){const x=Math.random()*w,y=Math.random()*h,L=40+Math.random()*120,gr=g.createLinearGradient(0,y,0,y+L);
 gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,'+(.2+Math.random()*.35)+')');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(x,y,.8+Math.random()*.8,L);g.fillRect(x,y-h,1,L)}}));
stT.wrapS=stT.wrapT=THREE.RepeatWrapping;
DX.streak=layer=>{const t=stT.clone();t.needsUpdate=true;t.repeat.set(3,1);const g=new THREE.CylinderGeometry(5.5,8,40,20,1,true);g.rotateX(Math.PI/2);
 const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.BackSide,fog:false}));m.frustumCulled=false;m.renderOrder=7;m.layers.set(layer);m.userData.tex=t;return m};

/* ---------- qualidade automática ---------- */
const QA={t:0,n:0};
DX.mobile=!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<900);
DX.applyQ=()=>{const nh=(typeof humans!=='undefined'&&humans.length)||1;DX.setShadowSize(DX.q>=2&&nh<=2?2048:1024);DX.setShadows(DX.q>0&&nh<=4)};
on('start',()=>{DX.q=DX.mobile?0:(DX.q0==null?2:DX.q0);if(humans.length>4)DX.q=Math.min(DX.q,1);QA.t=QA.n=0;DX.applyQ();DX.clearSkids()});
on('visuals',dt=>{DX.t+=dt;skyU.t.value=DX.t;stepPool(FX.smoke,dt);stepPool(FX.spark,dt);
 if(state!=='go'){QA.t=QA.n=0;return}QA.t+=dt;QA.n++;if(QA.t<3)return;const m=QA.t/QA.n;QA.t=QA.n=0;
 if(m>1/36&&DX.q>0){DX.q--;DX.q0=DX.q;DX.applyQ()}});
DX.applyQ();
return DX})();
