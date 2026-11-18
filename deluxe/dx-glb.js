/* ===== KART RUSH DELUXE · PILOTOS EM MODELO 3D (.glb) =====
 Personagens que já têm modelo novo em modelos/personagens_v2/<id>.glb (feitos no Meshy e preparados pelos scripts
 blender/meshy_prepara.py + blender/meshy_rig.py). Enquanto o arquivo não carrega — ou abrindo o jogo direto do computador
 (file://) — continua o boneco feito em código.
  · no kart: animação "Sentado" + volante; o tronco inclina nas curvas, a cabeça vira para a curva, pulinho no pouso,
    tremedeira na batida e comemoração (pulinhos) na chegada;
  · na garagem: "Parado", "Acenar" ao escolher e "Vitoria" ao confirmar; no pódio: sentado no kart. */
if(window.PHONE)throw new Error('PHONEMODE');
(()=>{const LISTA=['capy','zorp'],T={},PI=Math.PI;DX.glbT=T;
const DIR='modelos/personagens_v2/',ALT_KART=3.3,ALT_PE=2.9;
function carrega(){if(location.protocol==='file:')return;glbLib(()=>{if(!THREE.GLTFLoader)return;LISTA.forEach(id=>new THREE.GLTFLoader().load(DIR+id+'.glb',g=>{
 g.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.frustumCulled=false;const m=o.material;if(m&&m.map)m.map.anisotropy=4}});T[id]=g;garagem(id,g);
 /* refaz o que já foi desenhado com o boneco antigo */
 try{if(typeof SRV!=='undefined')SRV.key=''}catch(e){}const GA=window.RMENU&&RMENU.GA;if(GA){if(GA.port)delete GA.port[id];(GA.P||[]).forEach(p=>{if(p&&p.S&&p.S.ch===id)p.S.ch=null})}
 console.log('[KART RUSH] modelo 3D novo:',id)},undefined,()=>{}))})}
carrega();
const clip=(id,n)=>T[id].animations.find(a=>a.name===n);
function instancia(id,anim,alt){const g=T[id],o=THREE.SkeletonUtils.clone(g.scene),mx=new THREE.AnimationMixer(o),ac={};
 g.animations.forEach(c=>ac[c.name]=mx.clipAction(c));if(ac[anim]){ac[anim].play()}mx.update(0);
 const ossos={};o.traverse(b=>{if(b.isBone)ossos[b.name.replace(/[^A-Za-z]/g,'')]=b});
 const w=new THREE.Group();w.add(o);o.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(o),s=alt/Math.max(.01,bb.max.y-bb.min.y);o.scale.setScalar(s);
 return{w,o,mx,ac,ossos,s}}
/* ---------- piloto no kart ---------- */
{const _bc=buildChar;buildChar=function(id,veh){id=CHARS[id]?id:'capy';if(!T[id]||!THREE.SkeletonUtils)return _bc(id,veh);
 const S=DX.SPEC[veh]||DX.DES[VEH[veh]?veh:VDEF](DX.kit(),0xFFFFFF),I=instancia(id,'Sentado',ALT_KART),g=new THREE.Group();
 /* quadril no banco */
 I.o.updateMatrixWorld(true);const q=I.ossos.Quadril,hp=q?new THREE.Vector3().setFromMatrixPosition(q.matrixWorld):new THREE.Vector3();I.o.position.sub(hp).add(new THREE.Vector3(0,.15,-.1));g.add(I.w);
 g.position.set(S.seat[0],S.seat[1],S.seat[2]);
 /* volante */
 const K=DX.kit();K.tor(.42,.065,0x23262E,0,0,0,null,0,null,20);K.cyl(.11,.11,.1,DX.Mt(0xC9CED6),0,0,0,[PI/2,0,0]);K.box(.8,.06,.05,0x3A3F4A,0,0,0);K.box(.12,.07,.06,DX.P(0xFF3B30),0,.38,.02);
 const vol=K.build();vol.position.set(0,1.0,1.25);vol.rotation.x=-.5;vol.scale.setScalar(1.3);g.add(vol);
 // Usa os punhos da pose exportada para encaixar o volante de cada modelo.
 const left=I.ossos.MaoL,right=I.ossos.MaoR;
 if(left&&right){
  g.updateMatrixWorld(true);
  const a=left.getWorldPosition(new THREE.Vector3()),b=right.getWorldPosition(new THREE.Vector3());
  const span=a.distanceTo(b);
  if(span>.25&&span<2.4){g.worldToLocal(vol.position.copy(a).lerp(b,.5));vol.scale.setScalar(span/.84)}
 }
 const rig={glb:true,id,g,I,vol,p:{},st:0,look:0,hop:0,t:Math.random()*9,base:{}};
 for(const n of['Peito','Cabeca','Coluna'])if(I.ossos[n]){rig.base[n]=I.ossos[n];I.ossos[n].userData.q0=I.ossos[n].quaternion.clone()}
 g.userData.rig=rig;g.userData.ch=id;DX.rigs.push(rig);return g}}
/* ---------- em pé (garagem): usa o caminho dos modelos animados da garagem (Idle / Wave / Yes) ---------- */
function garagem(id,g){const key='personagens/'+id,ren=(c,n)=>{if(!c)return null;const k=c.clone();k.name=n;return k};
 GLB.tpl[key]=g.scene;GLB.an[key]=[ren(clip(id,'Parado'),'Idle'),ren(clip(id,'Acenar'),'Wave'),ren(clip(id,'Vitoria'),'Yes')].filter(Boolean);CHARS[id].pirata=1}
/* ---------- vida no kart ---------- */
const _q=new THREE.Quaternion(),_e=new THREE.Euler(),X=new THREE.Vector3(1,0,0),Y=new THREE.Vector3(0,1,0),Z=new THREE.Vector3(0,0,1);
{const _ru=DX.rigUpdate;DX.rigUpdate=function(rig,s){if(!rig.glb)return _ru(rig,s);const dt=s.dt;rig.t+=dt;
 /* o exportador tira as trilhas que não mudam: volta à pose base antes de somar a inclinação (senão acumula) */
 for(const n in rig.base){const b=rig.base[n];b.quaternion.copy(b.userData.q0)}rig.I.mx.update(dt);
 const race=s.mode==='race',win=s.fin>0&&s.fin<=3,sad=s.fin>3,dizzy=s.hit>.25;
 rig.st=DX.damp(rig.st,race?s.steer:Math.sin(rig.t*.6)*.25,race?9:3,dt);rig.vol.rotation.z=-rig.st*.75;
 const P=rig.base.Peito,C=rig.base.Cabeca,t=rig.t;
 if(P){_q.setFromAxisAngle(Z,clamp(s.roll*2.2,-.3,.3)+(dizzy?Math.sin(t*16)*.12:0));P.quaternion.premultiply(_q);_q.setFromAxisAngle(X,clamp(-s.acc*.003,-.18,.2)+(sad?.25:0));P.quaternion.premultiply(_q)}
 if(C){rig.look=DX.damp(rig.look,race?rig.st*.5:Math.sin(t*.5)*.35,race?7:3,dt);_q.setFromAxisAngle(Y,-rig.look+(dizzy?Math.sin(t*13)*.4:0));C.quaternion.premultiply(_q);
  _q.setFromAxisAngle(X,(win?-.15:0)+(s.air?-.12:0)+Math.sin(t*2.2)*.03);C.quaternion.premultiply(_q)}
 /* pulinhos na vitória, afunda no pouso */
 rig.I.w.position.y=(win?Math.abs(Math.sin(t*7))*.18:0)+s.bounce*.35+Math.sin(t*2.2)*.012}}
})();
