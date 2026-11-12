/* ===== KART RUSH DELUXE · VEÍCULOS =====
 Os 6 karts refeitos do zero, cada um com silhueta, peças e animações próprias (mesmos nomes e atributos de antes):
  FOGUETE  · bico de foguete, duas turbinas com hélices que giram e aerofólio que vira freio aerodinâmico
  CAPIVARA · buggy de safári com cara de capivara, gaiola, bagagem que balança, estepe e antena com bandeira
  FANTASMA · lençol assombrado com bracinhos, rabo que abana e lanterna pendurada que balança
  MONSTRO  · caminhão-monstro com boca cheia de dentes que morde, motor que treme e molas gigantes
  NEON     · carro do futuro em cunha, faixas de luz, núcleo de energia girando e luz por baixo
  TURBO    · hot rod com motor V8 de fora, polia girando, escapamentos que cospem fogo e empina no turbo
 Cada kart = carroceria (inclina, afunda e balança sobre a suspensão) + 4 rodas independentes (giram, esterçam e sobem/descem). */
if(window.PHONE)throw new Error('PHONEMODE');
(()=>{const {P,Mt,Gw,Gl,Ha,Sf,lerp,damp}=DX,PI=Math.PI;
const DK=0x1B1D24,D2=0x2C303A,TIRE=0x16171B,WH=0xF4F6FA,RED=0xFF3B30,WARM=0xFFE9A8;
/* roda: pneu gordo (perfil torneado), aro colorido, raios e, se pedir, cravos de terra ou aro de luz */
function wheel(r,w,rim,o){o=o||{};const K=DX.kit(),h=w/2,Z=[0,0,PI/2];
 K.lathe([[r*.55,-h],[r*.86,-h],[r,-h*.55],[r,h*.55],[r*.86,h],[r*.55,h]],TIRE,0,0,0,Z,null,o.knob?14:20);
 K.cyl(r*.6,r*.6,w*.86,o.glow?Gw(rim):o.metal?Mt(rim):P(rim),0,0,0,Z,null,18);
 K.cyl(r*.2,r*.24,w+.06,Mt(0xDDE2EA),0,0,0,Z,null,10);
 for(let i=0;i<5;i++){const a=i/5*PI*2;K.box(w+.02,r*.13,r*.42,D2,0,Math.cos(a)*r*.36,Math.sin(a)*r*.36,[a-PI/2,0,0])}
 if(o.knob)for(let i=0;i<12;i++){const a=i/12*PI*2;K.box(w*.96,.2,r*.34,TIRE,0,Math.cos(a)*r,Math.sin(a)*r,[a,0,0])}
 if(o.ring)for(const s of[-1,1])K.tor(r*.74,.045,Gw(o.ring),s*(h+.01),0,0,[0,PI/2,0]);
 const g=K.build();g.userData.r=r;return g}
/* chama do escapamento (cone com a ponta transparente; cresce com o acelerador e o turbo) */
const flameG=(()=>{const g=new THREE.ConeGeometry(1,1,10,3,true);g.rotateX(-PI/2);g.translate(0,0,-.5);const p=g.attributes.position,c=new Float32Array(p.count*3);
 for(let i=0;i<p.count;i++){const t=clamp(-p.getZ(i),0,1);c[i*3]=1;c[i*3+1]=lerp(.95,.25,t);c[i*3+2]=lerp(.7,.02,t)}g.setAttribute('color',new THREE.BufferAttribute(c,3));return g})();
const flameM=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false});
const flameB=flameM.clone();flameB.color.setRGB(.35,.75,2.2);
const flameV=flameM.clone();flameV.color.setRGB(1.3,.35,2.2);

/* ---------- os 6 projetos: cada função monta as peças e devolve rodas, banco, escapamentos e a animação própria ---------- */
const DES={
foguete(K,C){const Pc=P(C),Wp=P(WH);
 K.rbox(2.3,.28,5.4,.12,DK,0,.55,-.1);
 /* fuselagem torneada: bico comprido de foguete */
 K.lathe([[.0,-2.5],[.62,-2.35],[.9,-1.5],[.98,-.4],[.9,.7],[.68,1.7],[.42,2.5],[.2,3.05],[0,3.25]],Pc,0,1.12,.15,[PI/2,0,0],[1.18,1,.82],20);
 K.lathe([[.44,2.42],[.21,3.02],[0,3.27]],Wp,0,1.12,.15,[PI/2,0,0],[1.2,1,.84],20);K.ball(.14,Gw(RED),0,1.12,3.44);
 K.tor(.93,.07,Wp,0,1.12,1.0,[0,0,0],0,[1.18,.82,1]);K.tor(.72,.13,DK,0,1.82,-.55,[PI/2,0,0],0,[1,1.25,1]);
 /* janelinha de foguete e para-brisa */
 K.ext([[-.7,0],[.7,0],[.5,.5],[-.5,.5]],.05,Gl(0x9FE0FF),0,1.75,.42,[-.5,0,0]);
 K.mirror((k,s)=>{k.rbox(.72,.62,2.7,.3,Pc,1.28,.86,-.55);k.ball(.27,DK,1.28,.9,.78,[1,.85,.5]);k.box(.05,.3,1.8,Wp,1.65,.9,-.6);
  k.limb([.7,.8,2.0],[1.45,.58,2.05],.07,D2);k.limb([.7,.95,1.7],[1.45,.62,1.95],.06,D2);k.limb([.9,.8,-1.8],[1.5,.72,-1.85],.09,D2);
  /* aletas do foguete */
  k.ext([[0,0],[1.5,0],[1.85,.5],[.5,.62]],.1,Wp,1.05,1.2,-2.3,[0,PI/2,-.5]);
  k.ext([[0,0],[.34,0],[.5,.7],[.16,.7]],.08,D2,.86,1.72,-2.86,[0,PI/2,0]);
  /* turbina */
  k.lathe([[.34,-.75],[.5,-.6],[.55,.2],[.48,.75],[.4,.78]],Mt(0xC9CFDA),.62,1.36,-2.55,[PI/2,0,0],null,16);k.cyl(.4,.4,.06,Gw(0xFF7A1A),.62,1.36,-3.2,[PI/2,0,0]);k.ball(.5,Ha(0xFF8A2A),.62,1.36,-3.3,[1,1,.5])});
 /* asa dianteira */
 K.rbox(3.5,.1,.75,.05,Wp,0,.42,3.0);K.mirror((k,s)=>k.ext([[0,0],[.85,0],[.85,.36],[.2,.5]],.08,Pc,1.72,.4,2.62,[0,-PI/2,0]));
 K.ext([[0,0],[1.25,0],[.2,1.05]],.1,Pc,0,1.82,-1.35,[0,PI/2,0],null,.03);
 const f=K.sub('flap',0,2.3,-2.95);f.rbox(3.3,.1,.85,.05,P(C),0,0,0,[.12,0,0]);f.mirror((k,s)=>k.ext([[-.5,-.3],[.5,-.3],[.6,.32],[-.4,.32]],.08,P(WH),1.66,0,0,[0,PI/2,0]));f.box(3.0,.03,.1,Gw(RED),0,-.02,-.42);
 for(const s of[-1,1]){const h=K.sub('fan'+(s>0?'R':'L'),s*.62,1.36,-1.95);for(let i=0;i<6;i++)h.box(.82,.03,.2,Mt(0x8A93A2),0,0,0,[.5,0,i/6*PI]);h.cone(.16,.3,D2,0,0,.1,[PI/2,0,0])}
 return{w:[[1.5,.55,2.0,.55,.5],[1.58,.74,-1.85,.74,.78]],rim:WH,wo:{},seat:[0,1.22,-.78],fl:[[.62,1.36,-3.3,.5],[-.62,1.36,-3.3,.5]],num:[[1.66,.92,-.2,.62]],
  anim(p,s){p.fanL.rotation.z=p.fanR.rotation.z=s.t*(6+s.sp*.5);p.flap.rotation.x=damp(p.flap.rotation.x,s.brake?-.75:s.boost?.18:0,10,s.dt)}}},

capivara(K,C){const Pc=P(C),Fu=Sf(0x9B6A43),Fd=Sf(0x7A5232),Mz=Sf(0xB98A58),Cg=Mt(0x4A505C);
 K.rbox(2.5,.3,5.2,.14,DK,0,.95,0);K.rbox(2.75,1.0,3.3,.42,Pc,0,1.5,-.75);K.rbox(2.2,.12,1.9,.08,DK,0,2.02,-.75);
 /* frente: a cara da capivara (focinho, narinas, dentões, orelhas e faróis-olho sonolentos) */
 K.rbox(2.5,1.15,1.9,.52,Fu,0,1.55,1.75);K.rbox(1.85,.82,.95,.38,Mz,0,1.4,2.7);
 K.mirror((k,s)=>{k.ball(.13,0x3A2618,.38,1.62,3.16,[1,.7,.5]);k.rbox(.3,.42,.12,.06,WH,.17,.98,3.14);
  k.ball(.3,Gw(WARM),.82,2.0,2.5,[1,1,.55]);k.ball(.13,0x2A1A10,.84,2.0,2.66,[1,1.1,.5]);k.half(.33,Fd,.82,2.02,2.48,[1,1,.6],[-.35,0,0]);
  k.ball(.27,Fu,.98,2.32,1.5,[1,1.15,.5],[0,0,-.3]);k.ball(.16,Fd,.98,2.34,1.58,[1,1.1,.3],[0,0,-.3]);
  /* para-lamas */
  k.rbox(1.0,.16,2.1,.08,D2,1.62,1.82,1.85,[.06,0,0]);k.rbox(1.05,.16,2.2,.08,D2,1.66,1.92,-1.85,[-.05,0,0]);
  /* gaiola */
  k.tube([[1.2,1.9,.55],[1.15,3.2,.2],[1.1,4.15,-.5],[1.1,4.2,-1.9],[1.2,3.2,-2.3],[1.25,1.9,-2.4]],.1,Cg,false,26);
  k.ball(.2,Gw(WARM),.6,4.42,-.35,[1,1,.6])});
 K.limb([-1.1,4.17,-.5],[1.1,4.17,-.5],.1,Cg);K.limb([-1.1,4.2,-1.9],[1.1,4.2,-1.9],.1,Cg);K.box(1.9,.2,.25,D2,0,4.38,-.42);
 /* para-choque tubular */
 K.tube([[-1.35,1.0,2.9],[-1.2,.85,3.45],[1.2,.85,3.45],[1.35,1.0,2.9]],.11,Mt(0xC9CFDA),false,18);
 /* snorkel */
 K.tube([[1.3,1.6,1.2],[1.5,2.4,1.1],[1.42,3.6,.6]],.13,DK,false,12);K.cyl(.2,.2,.3,DK,1.42,3.72,.6);
 const r=K.sub('rack',0,4.35,-1.2);r.rbox(1.2,.5,.85,.14,P(0xD9423A),-.35,.3,.1);r.box(1.24,.06,.1,Sf(0x7A4A22),-.35,.36,.1);r.cyl(.26,.26,1.5,Sf(0x3FA36A),.5,.3,-.1,[PI/2,0,.2]);
 r.ball(.36,Sf(0x3E9E4A),-.2,.86,.05);r.tor(.36,.03,Sf(0x1F6A34),-.2,.86,.05,[PI/2,0,0]);r.tor(.3,.03,Sf(0x1F6A34),-.2,.86,.05,[PI/2,0,.9]);
 const sp=K.sub('spare',0,1.9,-2.72);sp.lathe([[.38,-.2],[.62,-.2],[.72,-.1],[.72,.1],[.62,.2],[.38,.2]],TIRE,0,0,0,[PI/2,0,0]);sp.cyl(.4,.4,.3,P(C),0,0,0,[PI/2,0,0]);
 const a=K.sub('ant',-1.2,2.0,-2.3);a.limb([0,0,0],[0,2.9,0],.035,DK);a.ext([[0,0],[.95,.25],[0,.5]],.03,P(C),0,2.4,0,[0,PI/2,0]);a.ball(.09,Gw(RED),0,2.98,0);
 return{w:[[1.62,.88,1.85,.88,.78],[1.66,.95,-1.85,.95,.9]],rim:C,wo:{knob:1},seat:[0,1.62,-.7],fl:[[.7,1.0,-2.95,.34]],num:[[1.39,1.5,-.8,.7]],
  anim(p,s){p.rack.rotation.z=s.sway*.5;p.rack.rotation.x=s.pitch*.6;p.rack.position.y=4.35+s.bounce*.5;p.spare.rotation.z=s.sway*.8;p.spare.position.y=1.9+s.bounce*.3;
   p.ant.rotation.z=s.sway*2.2+Math.sin(s.t*9)*.03*s.f;p.ant.rotation.x=-s.f*.28+s.pitch*2}}},

fantasma(K,C){const Pc=P(C),Sh=Sf(0xF4FAFF),Sd=Sf(0xD5E6F7),Ey=0x151022,Cy=Gw(0x7CF7FF);
 K.rbox(2.3,.25,5.0,.12,0x2B1E4A,0,.55,0);
 /* lençol: cúpula comprida com a barra ondulada */
 K.lathe([[1.42,-.52],[1.52,-.32],[1.42,.2],[1.25,.72],[.95,1.18],[.5,1.44],[0,1.5]],Sh,0,1.02,.25,null,[1.05,1,1.95],22);
 for(let i=0;i<18;i++){const a=i/18*PI*2;K.lowball(.3+(i%2)*.07,i%2?Sh:Sd,Math.cos(a)*1.52,.52+(i%2)*.06,.25+Math.sin(a)*2.85)}
 K.tor(1.36,.11,Pc,0,1.3,.25,[PI/2,0,0],0,[1.05,1.95,1]);
 /* carinha */
 K.mirror((k,s)=>{k.ball(.33,Ey,.5,1.72,2.36,[.85,1.3,.5],[-.25,0,0]);k.ball(.1,Cy,.46,1.86,2.5);k.ball(.2,Ha(0x7CF7FF),.46,1.86,2.52);k.ball(.15,Sf(0xFF9AC8),.92,1.38,2.42,[1,.6,.4])});
 K.ball(.26,Ey,0,1.2,2.72,[1,1.25,.5],[-.2,0,0]);K.ball(.1,Sf(0xFF6FA8),0,1.1,2.8,[1,.7,.5]);
 K.tor(.74,.13,0x2B1E4A,0,2.06,-.5,[PI/2,0,0],0,[1,1.2,1]);
 for(const s of[-1,1]){const a=K.sub('arm'+(s>0?'R':'L'),s*1.32,1.35,1.5);a.limb([0,0,0],[s*.7,.05,.5],.24,Sh);a.ball(.3,Sh,s*.82,.08,.62)}
 const t1=K.sub('tail1',0,1.55,-2.3);t1.ball(.62,Sh,0,0,0,[1,.9,1.1]);const t2=t1.sub('tail2',0,.35,-.62);t2.ball(.46,Sh,0,0,0);const t3=t2.sub('tail3',0,.32,-.48);t3.ball(.32,Sd,0,0,0);t3.ball(.2,P(C),.05,.26,-.26);
 K.tube([[1.0,1.5,-1.9],[1.2,2.9,-2.2],[1.05,3.5,-2.0],[.82,3.42,-1.7]],.06,0x2B1E4A,false,16);
 const l=K.sub('lantern',.82,3.42,-1.7);l.limb([0,0,0],[0,-.3,0],.025,DK);l.cyl(.2,.26,.5,0x5B2A9A,0,-.62,0,null,null,6);l.cone(.3,.24,0x3A1E6A,0,-.28,0,null,null,6);l.ball(.17,Cy,0,-.62,0);l.ball(.55,Ha(0x7CF7FF),0,-.62,0);
 K.lowball(1.9,Ha(0x9FE8FF),0,.3,.2,[1,.12,1.8]);
 return{w:[[1.34,.6,2.0,.6,.5],[1.4,.66,-1.75,.66,.62]],rim:0x7CF7FF,wo:{glow:1},seat:[0,1.5,-.6],fl:[[0,.9,-2.9,.4]],flM:flameB,num:[[1.5,1.05,.3,.58]],float:1,
  anim(p,s){const w=Math.sin(s.t*3.2);p.tail1.rotation.y=s.sway*3+w*.22;p.tail2.rotation.y=s.sway*4+Math.sin(s.t*3.2-.8)*.3;p.tail3.rotation.y=s.sway*4+Math.sin(s.t*3.2-1.6)*.38;p.tail1.rotation.x=-s.f*.35;
   p.lantern.rotation.z=s.sway*5+Math.sin(s.t*2.4)*.12;p.lantern.rotation.x=-s.f*.4+s.pitch*4;p.armL.rotation.z=-.15-w*.12-s.f*.3;p.armR.rotation.z=.15+w*.12+s.f*.3;p.armL.rotation.y=p.armR.rotation.y=0;
   if(s.air){p.armL.rotation.z=-1.1;p.armR.rotation.z=1.1}}}},

monstro(K,C){const Pc=P(C),Or=P(0xFF7A1A),Ch=Mt(0xD5DAE2),Yl=P(0xFFD43B);
 K.rbox(1.7,.4,5.9,.15,D2,0,2.0,0);K.rbox(3.4,1.15,6.0,.5,Pc,0,2.82,-.05);K.rbox(3.05,.5,2.3,.26,Pc,0,3.42,1.75);
 K.rbox(2.5,.14,2.1,.08,DK,0,3.42,-.85);K.rbox(3.3,.55,1.4,.22,D2,0,3.3,-2.45);
 /* boca: dentes de cima, olhos bravos */
 K.rbox(2.7,.5,.3,.12,DK,0,2.72,3.0);for(let i=0;i<6;i++)K.cone(.19,.4,WH,-1.05+i*.42,2.76,3.14,[PI,0,0],null,6);
 K.mirror((k,s)=>{k.ball(.34,Gw(0xFFE14A),1.05,3.3,2.82,[1.1,.8,.5]);k.ball(.14,DK,1.0,3.26,2.98,[1,1,.5]);k.rbox(.95,.22,.3,.1,Pc,1.05,3.58,2.86,[0,0,-.42]);
  /* chamas pintadas na lateral */
  k.ext([[0,0],[2.7,.1],[1.9,.34],[2.4,.6],[1.5,.6],[1.9,.95],[.9,.75],[0,1.0]],.04,Yl,1.72,2.3,2.6,[0,PI/2,0]);k.ext([[0,.14],[1.9,.2],[1.3,.4],[1.6,.58],[.8,.56],[0,.84]],.04,Or,1.75,2.3,2.6,[0,PI/2,0]);
  /* chifres, escapamentos-chaminé e molas */
  k.cone(.24,1.0,P(0xFFF1D6),1.5,3.9,1.2,[0,0,-.6],null,8);k.cyl(.2,.2,2.5,Ch,1.5,4.1,-1.75);k.cyl(.26,.2,.3,Ch,1.5,5.4,-1.75);
  for(const z of[2.25,-2.25]){k.limb([1.0,2.0,z*.9],[1.5,1.35,z],.19,Or);k.tor(.24,.05,Mt(0xFFE08A),1.25,1.68,z*.95,[1.2,0,.6]);k.tor(.24,.05,Mt(0xFFE08A),1.16,1.84,z*.93,[1.2,0,.6])}});
 K.cyl(.17,.17,4.2,D2,0,1.3,2.3,[0,0,PI/2]);K.cyl(.17,.17,4.2,D2,0,1.3,-2.3,[0,0,PI/2]);
 K.limb([-1.2,5.2,-1.75],[1.2,5.2,-1.75],.1,D2);for(let i=0;i<4;i++)K.ball(.2,Gw(WARM),-.9+i*.6,5.42,-1.7,[1,1,.6]);K.mirror((k,s)=>k.limb([1.2,3.3,-1.75],[1.2,5.2,-1.75],.1,D2));
 const j=K.sub('jaw',0,2.4,2.5);j.rbox(2.9,.42,1.0,.18,P(C),0,-.08,.35);for(let i=0;i<5;i++)j.cone(.2,.42,WH,-.84+i*.42,.3,.7,null,null,6);j.limb([-1.45,-.25,.86],[1.45,-.25,.86],.12,Mt(0xD5DAE2));
 const b=K.sub('blower',0,3.7,1.75);b.rbox(1.3,.6,1.5,.16,Mt(0xB8C0CC),0,.2,0);b.rbox(1.0,.5,1.1,.2,Mt(0xE4E8EF),0,.72,.05);for(const x of[-.28,.28])b.cyl(.2,.2,.1,Gw(0xFF4A2A),x,.76,.62,[PI/2,0,0]);b.cyl(.3,.3,.2,DK,0,.2,.8,[PI/2,0,0]);
 return{w:[[2.12,1.3,2.3,1.3,1.1],[2.12,1.3,-2.3,1.3,1.1]],rim:0xFF7A1A,wo:{knob:1},seat:[0,3.22,-.9],fl:[[1.5,5.6,-1.75,.42,1],[-1.5,5.6,-1.75,.42,1]],num:[[1.73,2.95,-1.3,.9]],travel:.34,
  anim(p,s){const ch=Math.max(0,Math.sin(s.t*(4+s.sp*.25)))*clamp(s.sp/30,0,1);p.jaw.rotation.x=damp(p.jaw.rotation.x,.1+ch*.3+(s.boost?.28:0)+s.hit*.5,14,s.dt);
   p.blower.position.x=Math.sin(s.t*61)*.02*(1+s.thr*2);p.blower.position.y=3.7+Math.sin(s.t*47)*.02*(1+s.thr*2);p.blower.rotation.z=Math.sin(s.t*53)*.015*(1+s.thr*3)}}},

neon(K,C){const Pc=P(C),Cy=Gw(0x22D3FF),Mg=Gw(0xFF3FA4),Pu=P(0x2A1650),Bk=P(0x12131A);
 K.lowball(2.1,Ha(C),0,.12,0,[1,.06,1.75]);
 /* cunha: perfil lateral recortado e esticado na largura */
 K.ext([[-3.0,.3],[3.3,.3],[3.45,.5],[1.7,1.0],[.2,1.22],[-.6,1.22],[-3.0,1.42]],2.05,Bk,0,0,0,[0,-PI/2,0],null,.08);
 K.ext([[1.0,.0],[3.38,.0],[3.5,.14],[1.75,.62]],1.3,Pc,0,.42,0,[0,-PI/2,0],null,.04);
 K.rbox(1.5,.1,1.9,.05,DK,0,1.3,-.55);K.ext([[-.75,0],[.75,0],[.55,.42],[-.55,.42]],.05,Gl(0x7CE8FF),0,1.22,.42,[-.75,0,0]);
 K.mirror((k,s)=>{/* para-lamas fechados com faixa de luz */
  k.rbox(.9,.75,2.0,.34,Pc,1.42,.82,2.0);k.rbox(.98,.92,2.35,.4,Pc,1.46,.92,-1.9);k.box(.05,.06,1.7,Cy,1.9,.95,2.0);k.box(.05,.06,2.0,Cy,1.98,1.08,-1.9);
  k.rbox(.5,.4,2.1,.18,Pu,1.2,.72,.0);k.box(.04,.05,5.9,Mg,1.04,1.24,-.9,[.03,0,0]);k.box(.5,.05,.08,Cy,.7,.66,3.42);
  /* barbatanas inclinadas */
  k.ext([[0,0],[1.5,0],[1.9,1.25],[1.2,1.25]],.09,Pc,1.2,1.3,-1.7,[0,PI/2,.3]);k.ext([[1.2,1.2],[1.9,1.2],[1.92,1.3],[1.22,1.3]],.1,Cy,1.2,1.3,-1.7,[0,PI/2,.3]);
  k.cyl(.16,.2,.5,Mt(0x9AA3B5),.55,.7,-3.0,[PI/2,0,0]);k.cyl(.12,.12,.06,Mg,.55,.7,-3.27,[PI/2,0,0])});
 K.box(2.2,.5,.04,Gl(0xFF7CD8),0,2.42,-3.25);K.box(2.3,.05,.06,Mg,0,2.68,-3.25);K.box(2.3,.05,.06,Mg,0,2.16,-3.25);
 const c=K.sub('core',0,1.62,-2.2);c.ico(.3,Gw(0x9CFF2E),0,0,0);c.tor(.46,.04,Cy,0,0,0);c.tor(.46,.04,Mg,0,0,0,[PI/2,0,0]);c.ball(.7,Ha(0x9CFF2E),0,0,0);
 const sc=K.sub('scan',0,.93,2.2);sc.box(.36,.05,.1,Gw(0xFFFFFF),0,0,0,[-.27,0,0]);sc.ball(.25,Ha(0x22D3FF),0,0,0);
 return{w:[[1.46,.52,2.0,.52,.5],[1.5,.62,-1.9,.62,.72]],rim:C,wo:{ring:0x22D3FF},seat:[0,1.12,-.7],fl:[[.55,.7,-3.3,.3],[-.55,.7,-3.3,.3]],flM:flameV,num:[[1.94,.7,-1.9,.5]],travel:.1,
  anim(p,s){p.core.rotation.y=s.t*(3+s.sp*.2);p.core.rotation.x=s.t*1.7;p.core.scale.setScalar(1+Math.sin(s.t*8)*.08+(s.boost?.35:0));p.scan.position.x=Math.sin(s.t*(3+s.sp*.08))*.62}}},

turbo(K,C){const Pc=P(C),Ch=Mt(0xD5DAE2),Yl=P(0xFFD43B),Or=P(0xFF7A1A),Le=Sf(0x6B3A22);
 K.rbox(2.2,.3,5.6,.12,DK,0,.62,0);
 K.rbox(2.75,1.05,3.3,.45,Pc,0,1.3,-1.25);K.rbox(1.95,.85,2.9,.36,Pc,0,1.2,1.7,[.03,0,0]);K.rbox(2.3,.12,1.7,.08,Le,0,1.84,-1.1);
 /* grade cromada */
 K.rbox(1.75,1.15,.32,.14,Ch,0,1.22,3.2);for(let i=0;i<5;i++)K.box(.09,.85,.06,DK,-.5+i*.25,1.22,3.37);
 K.ext([[-.9,0],[.9,0],[.7,.42],[-.7,.42]],.05,Gl(0xA8DAFF),0,1.84,.2,[-.42,0,0]);K.box(1.95,.06,.08,Ch,0,2.22,.02);
 K.rbox(2.75,.14,.7,.06,Pc,0,1.9,-2.85,[.35,0,0]);
 K.mirror((k,s)=>{k.ball(.26,Gw(WARM),1.2,1.3,3.12,[1,1,.6]);k.cyl(.3,.3,.3,Ch,1.2,1.3,3.02,[PI/2,0,0]);
  /* chamas pintadas */
  k.ext([[0,0],[2.5,.08],[1.7,.3],[2.2,.5],[1.3,.5],[1.7,.8],[.7,.62],[0,.8]],.04,Yl,1.0,.86,3.05,[0,PI/2,0]);k.ext([[0,.1],[1.7,.16],[1.1,.34],[1.4,.48],[.6,.46],[0,.7]],.04,Or,1.03,.86,3.05,[0,PI/2,0]);
  /* raio na porta */
  k.ext([[0,.5],[.9,.62],[.65,.36],[1.5,.5],[.5,0],[.75,.28]],.04,P(WH),1.4,1.0,-.5,[0,PI/2,0]);
  /* 4 escapamentos de cada lado */
  for(let i=0;i<4;i++)k.tube([[.7,1.25,2.5-i*.5],[1.25,1.2,2.4-i*.5],[1.6,1.55,2.05-i*.5]],.11,Ch,false,8);
  k.rbox(.5,.2,.08,.04,Gw(RED),.95,1.45,-2.93);k.rbox(1.15,.14,2.2,.07,D2,1.68,1.86,-1.95,[-.04,0,0]);
  k.limb([.8,.6,-2.6],[.6,.34,-3.7],.06,Ch);k.cyl(.2,.2,.14,TIRE,.6,.22,-3.72,[0,0,PI/2])});
 K.limb([-.6,.34,-3.7],[.6,.34,-3.7],.05,Ch);
 const e=K.sub('engine',0,1.72,1.75);e.rbox(1.15,.55,1.7,.14,Mt(0x9AA3B5),0,.05,0);e.rbox(.95,.5,1.15,.2,Ch,0,.55,-.05);e.rbox(1.1,.42,.75,.16,P(C),0,.98,.05,[.12,0,0]);
 for(let i=0;i<3;i++)e.cyl(.15,.15,.1,Gw(0xFF3B30),-.32+i*.32,1.02,.44,[PI/2-.12,0,0]);e.mirror((k,s)=>{for(let i=0;i<4;i++)k.cyl(.11,.11,.2,DK,.6,.2,.6-i*.4,[0,0,PI/2])});
 const pl=e.sub('pulley',0,.3,.92);pl.cyl(.3,.3,.14,DK,0,0,0,[PI/2,0,0]);pl.box(.5,.1,.16,Ch,0,0,0);pl.box(.1,.5,.16,Ch,0,0,0);
 return{w:[[1.42,.52,2.45,.52,.42],[1.68,.9,-1.95,.9,1.05]],rim:0xD5DAE2,wo:{metal:1},seat:[0,1.5,-1.15],fl:[1.9,1.4,.9,.4].map(z=>[1.68,1.6,z+.15,.26,2]).concat([1.9,1.4,.9,.4].map(z=>[-1.68,1.6,z+.15,.26,3])),num:[[1.4,1.45,-1.7,.62]],rake:-.035,wheelie:1,
  anim(p,s){p.pulley.rotation.z=s.t*(14+s.sp*.6);const k=1+s.thr*2.5+(s.boost?3:0);p.engine.position.x=Math.sin(s.t*67)*.012*k;p.engine.position.y=1.72+Math.sin(s.t*51)*.014*k;p.engine.rotation.z=Math.sin(s.t*43)*.012*k}}}};
DX.DES=DES;

/* ---------- vehBody: mesma assinatura de antes (garagem, pódio e medidas de colisão continuam funcionando) ---------- */
const SPEC={};DX.SPEC=SPEC;
vehBody=function(g,col,v){v=VEH[v]?v:VDEF;const K=DX.kit(),S=DES[v](K,col),ch=K.build(),n=cols.indexOf(col)+1||1;SPEC[v]=S;
 ch.userData.spec=S;g.add(ch);g.userData.dxCh=ch;g.userData.spec=S;
 (S.num||[]).forEach(a=>{for(const s of[-1,1]){const m=new THREE.Mesh(new THREE.PlaneGeometry(a[3],a[3]),vNum(n));m.position.set(s*a[0],a[1],a[2]);m.rotation.y=s*PI/2;m.userData.itx=1;ch.add(m)}});
 /* chamas */
 const fl=ch.userData.flames=[];(S.fl||[]).forEach(a=>{const m=new THREE.Mesh(flameG,S.flM||flameM);m.position.set(a[0],a[1],a[2]);m.userData.s=a[3];m.userData.dir=a[4]||0;m.userData.m0=m.material;m.userData.itx=1;
  if(a[4]===1)m.rotation.x=-PI/2;else if(a[4]===2)m.rotation.set(-.5,-PI/2-.5,0,'YXZ');else if(a[4]===3)m.rotation.set(-.5,PI/2+.5,0,'YXZ');m.scale.set(0,0,0);m.renderOrder=4;ch.add(m);fl.push(m)});
 const R=g.userData.rodas=[];S.w.forEach((a,i)=>{for(const s of[-1,1]){const w=wheel(a[3],a[4],S.rim,S.wo);w.position.set(s*a[0],a[1],a[2]);w.userData.y0=a[1];w.userData.side=s;w.userData.front=i===0;g.add(w);R.push(w)}});
 return ch};

/* ---------- makeKart: monta kart + piloto e guarda as peças que se mexem ---------- */
makeKart=function(i,label,veh,ch){const g=new THREE.Group(),col=cols[i];g.rotation.order='YXZ';
 const body=vehBody(g,col,veh),pil=buildChar(ch,veh);body.add(pil);
 const cargo=new THREE.Group();cargo.position.set(0,1.6,-3.2);g.add(cargo);const fire=new THREE.Group();g.add(fire);
 const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:nameTex(label,'#'+col.toString(16).padStart(6,'0')),depthTest:false,fog:false}));spr.scale.set(4,1,1);spr.position.y=6.4+((VEH[veh]||{}).sy||0)*1.6;g.add(spr);
 scene.add(g);const sh=new THREE.Mesh(new THREE.PlaneGeometry(8,10),new THREE.MeshBasicMaterial({map:shTex,transparent:true,depthWrite:false}));sh.rotation.x=-PI/2;sh.position.y=.09;scene.add(sh);
 g.userData.cabeca=null;g.userData.pil=pil;
 return{g,cargo,fire,sh,body,dx:{ch:body,spec:body.userData.spec,pil,roll:0,rollV:0,pit:0,pitV:0,by:0,bv:0,sq:0,pv:0,wy:[0,0,0,0],wv:[0,0,0,0],hit:0,steer:0}}};

/* ---------- vida do kart a cada quadro: suspensão, inclinação, peso, rodas, chamas e peças próprias ---------- */
const st={};
DX.kartVis=function(k,dt){const D=k.dx;if(!D||dt<=0)return;const S=D.spec,ch=D.ch,sp=Math.abs(k.v),f=Math.min(1,sp/58),ph=k.i*1.7,t=DX.t;
 const dead=k.fallT>0,yr=k.yr||0;
 /* aceleração para frente (afunda a traseira / mergulha no freio) e para o lado (rola para fora da curva) */
 const acc=clamp((k.v-D.pv)/dt,-90,90);D.pv=k.v;D.acc=damp(D.acc||0,acc,8,dt);
 const lat=clamp(yr*sp*.0042,-.2,.2)*(k.air?.3:1)+(k.dOn?-(k.dDir||0)*.07:0);
 D.rollV+=((lat-D.roll)*120-D.rollV*11)*dt;D.roll=clamp(D.roll+D.rollV*dt,-.3,.3);
 const pt=clamp(-D.acc*.0021,-.09,.11)+(S.rake||0)+(S.wheelie&&k.boost>0&&!k.air?-.13:0)+(k.boost>0?-.03:0);
 D.pitV+=((pt-D.pit)*110-D.pitV*10)*dt;D.pit=clamp(D.pit+D.pitV*dt,-.3,.3);
 /* mola vertical da carroceria (pouso afunda, pulo estica) */
 D.bv+=(-D.by*150-D.bv*9)*dt;D.by=clamp(D.by+D.bv*dt,-.55,.45);
 D.sq=damp(D.sq,0,7,dt);D.hit=damp(D.hit,0,5,dt);
 const idle=.012+.02*f,eng=(Math.sin(t*37+ph)+Math.sin(t*53+ph*2))*idle*.5,flt=S.float?Math.sin(t*2.6+ph)*.1+.12:0;
 ch.position.y=D.by+eng*.6+flt;ch.rotation.z=D.roll+eng*.12+(k.spin>0?Math.sin(t*30)*.06:0);ch.rotation.x=D.pit+(Math.sin(t*41+ph*3))*idle*.1;
 const q=1-D.sq*.22+(k.air?.04:0);ch.scale.set(1+D.sq*.12,q,1+D.sq*.08);
 /* rodas: cada uma com sua mola; a de fora da curva afunda, no ar todas pendem */
 const R=k.g.userData.rodas,tv=S.travel||.16,bump=k.air?0:(Math.sin(t*23+ph)+Math.sin(t*31.7+ph*2))*.02*f;
 for(let i=0;i<R.length;i++){const w=R[i],u=w.userData,tg=k.air?-tv:clamp(-D.roll*u.side*1.6+(u.front?-D.pit:D.pit)*2.2,-tv,tv)+bump*(i%2?1:-1)-D.by*.5;
  D.wv[i]+=((tg-D.wy[i])*190-D.wv[i]*14)*dt;D.wy[i]=clamp(D.wy[i]+D.wv[i]*dt,-tv*1.4,tv*1.4);w.position.y=u.y0+D.wy[i];
  if(S.float)w.position.y+=Math.sin(t*2.6+ph+i)*.03}
 /* chamas: tamanho pelo acelerador e pelo turbo, tremendo */
 const thr=k.thrIn||0,bst=k.boost>0,fm=bst?(k.dxBoostLv>=3?flameV:k.dxBoostLv===2?flameM:flameB):null;
 for(const m of ch.userData.flames){const s0=m.userData.s,fl=.75+Math.random()*.5,L=dead?0:bst?(3.6+Math.random()*1.2):thr>0?(.5+f*.9)*fl:0,w=dead?0:bst?1.25:thr>0?.7:0;
  m.scale.set(s0*w*fl,s0*w*fl,s0*L*(m.userData.dir?.65:1));m.visible=L>0;m.material=bst&&k.dxBoostLv?fm:m.userData.m0}
 /* peças próprias do veículo */
 st.t=t+ph;st.dt=dt;st.sp=sp;st.f=f;st.thr=Math.max(0,thr);st.brake=thr<0&&k.v>8;st.boost=bst;st.air=k.air;st.sway=-D.roll;st.pitch=D.pit-(S.rake||0);st.bounce=-D.by;st.hit=D.hit;
 if(S.anim)S.anim(ch.userData.parts,st)};
on('land',k=>{if(k.dx){k.dx.bv-=clamp(4+Math.abs(k.dxVy||0)*.22,4,11);k.dx.sq=Math.min(1,.5+Math.abs(k.dxVy||0)*.03)}});
on('jump',k=>{if(k.dx){k.dx.bv+=5;k.dx.sq=-.4}});
on('hit',k=>{if(k.dx){k.dx.hit=1;k.dx.bv+=6;k.dx.rollV+=(Math.random()-.5)*8}});
on('bump',(k,o,forte)=>{for(const q of[k,o])if(q.dx){q.dx.hit=Math.max(q.dx.hit,forte);q.dx.rollV+=(Math.random()-.5)*10*forte;q.dx.bv+=3*forte}});
})();
