/* ===== KART RUSH DELUXE · PERSONAGENS =====
 Os 12 pilotos refeitos do zero em código (sem modelos prontos), no estilo cartoon de cabeça grande, cada um com silhueta própria.
 Todos têm o mesmo "esqueleto": quadril · tronco · cabeça · braços de 2 ossos (as mãos seguram o volante de verdade e acompanham
 o giro) · pálpebras que piscam · pupilas que olham para a curva · boca/mandíbula · peças soltas com mola (orelhas, rabos,
 cachecol, barba, antenas, papagaio…). Reagem a tudo: inclinam nas curvas, são jogados para trás na arrancada, levantam os braços
 no pulo, ficam tontos na batida, comemoram na chegada (ou ficam emburrados) e têm vida mesmo parados na garagem e no pódio. */
if(window.PHONE)throw new Error('PHONEMODE');
(()=>{const {P,Mt,Gw,Gl,Ha,Sf,lerp,damp,V3}=DX,PI=Math.PI,PS=1.12;
const WC=[0,.86,1.0],WR=.46,WT=.52,EX=new V3(1,0,0),EY=new V3(0,Math.cos(WT),Math.sin(WT));
const L1=.66,L2=.64;

/* ---------- desenho de cada piloto: body = cores e porte · head(H,B) = cabeça · extra(T,B,R) = roupas e acessórios ---------- */
const CH={
capy:{body:{shirt:0x6F7F3A,chest:0x6F7F3A,sleeve:0xEDE3C8,fore:Sf(0x9B6A43),hand:Sf(0x7A5232),pants:0xB8A47A,shoe:0x5A3A22,skin:Sf(0x9B6A43)},lid:.15,mood:'zen',air:'none',
 head(H,B){const F=Sf(0x9B6A43),Fd=Sf(0x7A5232),Mz=Sf(0xB98A58);
  H.ball(.82,F,0,.62,-.08,[1.02,.9,1.1]);H.rbox(1.05,.78,.95,.36,Mz,0,.46,.62);H.ball(.2,0x3A2618,0,.72,1.08,[1.6,.7,.6]);
  H.mirror((k,s)=>{k.ball(.05,0x2A1A10,.14,.6,1.11);k.rbox(.13,.2,.06,.03,0xFFFFFF,.08,.1,1.02)});
  B.eye(-.5,.86,.42,.17,0x4A2C14,F,{brow:Fd});B.eye(.5,.86,.42,.17,0x4A2C14,F,{brow:Fd});
  B.mouth(0,.2,1.0,.2,0x3A2618);
  for(const s of[-1,1]){const e=H.sub('ear'+s,s*.56,1.18,-.4,[0,0,-s*.35]);e.ball(.19,F,0,.1,0,[1,1.15,.5]);e.ball(.11,Fd,0,.1,.06,[1,1.1,.4]);B.dang.push({n:'ear'+s,sw:.8,pt:.5,k:160,fl:.06})}
  /* chapéu de explorador com a laranja em cima (toda capivara zen tem uma) */
  const T=H.sub('hat',0,1.22,-.06,[-.12,0,.08]);T.cyl(1.0,1.02,.07,0xD8C08A,0,0,0,null,null,22);T.lathe([[.6,0],[.56,.3],[.4,.46],[0,.5]],0xD8C08A,0,.03,0);T.cyl(.61,.62,.11,0x6E4A2E,0,.1,0);B.dang.push({n:'hat',sw:.25,pt:.2,k:120});
  const O=T.sub('orange',0,.5,0);O.ball(.26,P(0xFF9A1F),0,.22,0,[1,.9,1]);O.ball(.08,Sf(0x3FA34D),.06,.46,0,[.5,1.4,.25],[0,0,-.5]);B.dang.push({n:'orange',sw:.5,pt:.4,k:70,d:4})},
 extra(T){T.tor(.4,.1,0xE85D2A,0,1.1,0,[PI/2,0,0]);T.rbox(.3,.26,.12,.05,0xC9A24A,-.3,.5,.5);T.box(.14,1.1,.06,0x5A3A22,.06,.72,.5,[0,0,.6])}},

fox:{body:{shirt:0x8A5A32,chest:0x8A5A32,sleeve:0x8A5A32,fore:Sf(0xF07A1E),hand:0x3A2A22,pants:0x5A4A3A,shoe:0x3A2A22,skin:Sf(0xF07A1E)},lid:-.5,tilt:.2,mood:'cocky',air:'one',
 head(H,B){const O=Sf(0xF07A1E),Cr=Sf(0xFFF1DC),Dk=0x2A1E18;
  H.ball(.76,O,0,.62,0,[1.08,.95,1]);H.mirror((k,s)=>{k.cone(.36,.7,Cr,.62,.38,.2,[0,0,-1.9],[1,1,.6],8);k.cone(.3,.5,Cr,.55,.2,.28,[0,0,-2.3],[1,1,.6],8)});
  H.cone(.4,.85,Cr,0,.42,.82,[PI/2-.12,0,0],[1.05,1,.8],12);H.ball(.12,Dk,0,.5,1.24);
  B.eye(-.3,.74,.58,.2,0x8A4A14,O,{brow:Dk});B.eye(.3,.74,.58,.2,0x8A4A14,O,{brow:Dk});B.mouth(.08,.2,.86,.2,Dk,{smirk:1});
  for(const s of[-1,1]){const e=H.sub('ear'+s,s*.48,1.2,-.1,[0,0,-s*.3]);e.cone(.3,.85,O,0,.36,0,null,[1,1,.55],8);e.cone(.18,.55,Sf(0x3A2A22),0,.36,.07,null,[1,1,.4],8);B.dang.push({n:'ear'+s,sw:.5,pt:.5,wind:.35,k:150,fl:.05})}
  /* touca de aviador com óculos na testa */
  H.half(.79,0x6B3E20,0,.74,-.1,[1.06,.92,1.02],[-.62,0,0]);H.mirror((k,s)=>{k.tor(.17,.04,Mt(0xD5DAE2),.24,1.3,.36,[-1.0,0,0]);k.ball(.15,Gl(0x7FDBFF),.24,1.3,.36,[1,1,.3],[-1.0,0,0])});H.box(.3,.06,.06,0x3A2A22,0,1.3,.38,[-1.0,0,0])},
 extra(T,B){T.tor(.4,.14,0xD9313F,0,1.1,0,[PI/2,0,0]);
  /* cachecol ao vento (2 gomos) e rabo peludo */
  const a=T.sub('sc1',.2,1.08,-.4,[.5,0,0]);a.rbox(.34,.1,.7,.05,0xD9313F,0,0,-.35);const b=a.sub('sc2',0,0,-.68,[.3,0,0]);b.rbox(.3,.09,.62,.04,0xC02A36,0,0,-.3);
  B.dang.push({n:'sc1',sw:.9,wind:-.75,k:60,d:5,fl:.3},{n:'sc2',sw:1.2,wind:-.5,k:50,d:4,fl:.4});
  const t=T.sub('tail',.3,.1,-.5,[-.9,.3,0]);t.ball(.34,Sf(0xF07A1E),0,.5,0,[1,1.7,1]);t.ball(.26,Sf(0xFFF1DC),0,1.02,0,[1,1.2,1]);B.dang.push({n:'tail',sw:1.1,pt:.4,k:55,d:4,fl:.08});
  T.box(.14,1.1,.06,0x3A2A22,-.06,.72,.5,[0,0,-.6]);T.mirror((k,s)=>k.half(.3,Mt(0xC9CED6),.78,.96,0,[1,.7,1]))}},

ricky:{body:{shirt:0xFF8A2A,chest:0xFF8A2A,sleeve:0xFF8A2A,fore:0xFF8A2A,hand:0x2F3138,pants:0xFF8A2A,shoe:0x2F3138,skin:Sf(0x8A8F99)},lid:-.4,tilt:.2,mood:'tricky',air:'both',
 head(H,B){const Gr=Sf(0x8A8F99),Dk=Sf(0x2F3138),Lt=Sf(0xEDEAE4);
  H.ball(.78,Gr,0,.62,0,[1.12,.92,1]);H.mirror((k,s)=>{k.cone(.34,.6,Lt,.72,.4,.1,[0,0,-1.8],[1,1,.6],8);k.ball(.34,Dk,.34,.72,.5,[1.25,.72,.6],[0,0,.3])});
  H.ball(.36,Lt,0,.36,.68,[1,.75,1.05]);H.ball(.12,0x111111,0,.5,1.02);H.rbox(.1,.16,.05,.02,0xFFFFFF,.12,.14,.92);
  B.eye(-.32,.74,.62,.18,0x5A3410,Dk);B.eye(.32,.74,.62,.18,0x5A3410,Dk);B.mouth(.06,.2,.9,.24,0x111111,{smirk:1});
  for(const s of[-1,1]){const e=H.sub('ear'+s,s*.62,1.2,-.14,[0,0,-s*.45]);e.cone(.27,.5,Gr,0,.2,0,null,[1,1,.55],8);e.cone(.16,.32,Dk,0,.2,.06,null,[1,1,.4],8);B.dang.push({n:'ear'+s,sw:.6,pt:.4,k:160,fl:.05})}
  /* boné para trás */
  H.half(.82,P(0xFF7A1A),0,.72,-.04,[1.1,.95,1.06],[-.2,0,0]);H.rbox(.95,.07,.6,.03,P(0xFF7A1A),0,.82,-1.0,[.25,0,0]);H.ball(.09,P(0xFFFFFF),0,1.48,-.2)},
 extra(T,B){T.box(.2,.9,.05,0xFFFFFF,0,.62,.52);T.tor(.36,.09,0xFFFFFF,0,1.08,0,[PI/2,0,0]);
  const t=T.sub('tail',.35,.1,-.5,[-1.0,.3,0]);for(let i=0;i<5;i++)t.ball(.3-i*.025,Sf(i%2?0x2F3138:0x8A8F99),0,.3+i*.26,0,[1,.8,1]);B.dang.push({n:'tail',sw:1.2,pt:.4,k:55,d:4,fl:.1})}},

zorp:{body:{shirt:0x5B2A9A,chest:0x5B2A9A,sleeve:0x5B2A9A,fore:0x5B2A9A,hand:Sf(0x8BE36A),pants:0x3A1E6A,shoe:Mt(0xC9CED6),skin:Sf(0x8BE36A),arm:.14},lid:-.7,mood:'weird',air:'both',
 head(H,B){const Li=Sf(0x8BE36A),Ld=Sf(0x5DB84A),Mg=Gw(0xFF3FA4);
  H.ball(.9,Li,0,.86,-.05,[1.1,1.05,1]);H.ball(.5,Li,0,.3,.22,[1.0,.8,.9]);
  B.eye(-.4,.72,.56,.3,null,Li,{white:P(0x0A0A14),pupil:0x0A0A14,glint:1});B.eye(.4,.72,.56,.3,null,Li,{white:P(0x0A0A14),pupil:0x0A0A14,glint:1});
  B.mouth(0,.18,.62,.13,0x2E6A22);H.ball(.05,Ld,-.06,.42,.68);H.ball(.05,Ld,.06,.42,.68);
  for(const s of[-1,1]){const a=H.sub('ant'+s,s*.3,1.7,-.1,[0,0,-s*.4]);a.limb([0,0,0],[0,.62,0],.04,Ld);a.ball(.13,Mg,0,.7,0);a.ball(.3,Ha(0xFF3FA4),0,.7,0);B.dang.push({n:'ant'+s,sw:1.6,pt:1.2,wind:.5,k:45,d:2.5,fl:.12})}
  /* capacete de vidro */
  H.ball(1.28,Gl(0xBFF3FF),0,.78,0);H.tor(.62,.09,Mt(0xC9CED6),0,-.02,0,[PI/2,0,0])},
 extra(T){T.tor(.38,.07,Gw(0x22D3FF),0,1.08,0,[PI/2,0,0]);T.cyl(.2,.2,.06,Gw(0x22D3FF),0,.74,.5,[PI/2,0,0]);T.ball(.3,Ha(0x22D3FF),0,.74,.56);T.box(.06,.8,.05,Gw(0x9CFF2E),-.32,.6,.47,[0,0,.12]);T.box(.06,.8,.05,Gw(0x9CFF2E),.32,.6,.47,[0,0,-.12]);
  T.rbox(.7,.8,.34,.14,Mt(0x9AA3B5),0,.75,-.5)}},

hammy:{body:{shirt:0xD9313F,chest:Sf(0xE9A65A),sleeve:Sf(0xE9A65A),fore:Sf(0xE9A65A),hand:Sf(0xE9A65A),pants:0x2B3A6A,shoe:0xFFFFFF,skin:Sf(0xE9A65A),w:1.3,arm:.23,bicep:1},lid:-.5,mood:'tough',air:'both',
 head(H,B){const Go=Sf(0xE9A65A),Wh=Sf(0xFFF4E2),Pk=Sf(0xF4A0A8);
  H.ball(.76,Go,0,.64,0,[1.12,.98,1]);H.ball(.56,Wh,0,.42,.38,[1.2,.82,.85]);
  H.mirror((k,s)=>{k.ball(.4,Wh,.56,.36,.36,[1,.95,1]);k.ball(.13,Pk,.72,.4,.66,[1,.6,.4]);k.rbox(.11,.2,.05,.02,0xFFFFFF,.065,.2,.9)});H.ball(.09,Pk,0,.56,.94);
  B.eye(-.3,.82,.62,.13,null,Go,{white:P(0x15121A),pupil:0x15121A,glint:1,brow:0x8A5A2B});B.eye(.3,.82,.62,.13,null,Go,{white:P(0x15121A),pupil:0x15121A,glint:1,brow:0x8A5A2B});
  B.mouth(0,.36,.9,.14,0x8A5A2B);
  for(const s of[-1,1]){const e=H.sub('ear'+s,s*.6,1.22,-.1);e.ball(.24,Go,0,.08,0,[1,1,.45]);e.ball(.15,Pk,0,.08,.05,[1,1,.35]);B.dang.push({n:'ear'+s,sw:.6,pt:.4,k:170,fl:.04})}
  /* faixa de lutador com as pontas soltas */
  H.tor(.74,.11,0xD9313F,0,1.0,-.01,[PI/2+.1,0,0],0,[1.12,1,1]);const k=H.sub('knot',.3,.9,-.8,[.6,0,0]);k.ball(.13,0xD9313F,0,0,0);k.rbox(.16,.06,.6,.03,0xD9313F,-.08,0,-.32,[0,.2,0]);k.rbox(.16,.06,.5,.03,0xB8242F,.1,-.02,-.28,[0,-.25,0]);B.dang.push({n:'knot',sw:1,wind:-.7,k:55,d:4,fl:.35})},
 extra(T){T.ball(.42,Sf(0xFFF4E2),0,.74,.34,[1.2,.75,.55]);T.box(.6,.14,.06,0xFFFFFF,0,.3,.56);T.mirror((k,s)=>k.tor(.2,.06,0xD9313F,.82,.2,.0,[0,0,.3]))}},

ossudo:{body:{shirt:0x2B1E4A,chest:0x2B1E4A,sleeve:0x2B1E4A,fore:0xF2ECDC,hand:0xF2ECDC,pants:0x2B1E4A,shoe:0x18141F,skin:0xF2ECDC,arm:.12},lid:-.9,mood:'goofy',air:'both',jawK:1,
 head(H,B){const Bo=0xF2ECDC,Dk=0x1A1424,Pu=0x8E5BE8;
  H.ball(.76,Bo,0,.72,0,[1.02,1,1]);H.rbox(.86,.3,.6,.12,Bo,0,.34,.36);H.mirror((k,s)=>k.ball(.2,Bo,.4,.46,.44));
  H.cone(.09,.18,Dk,0,.48,.72,[PI,0,0],null,6);for(let i=0;i<5;i++)H.box(.025,.16,.05,Dk,-.24+i*.12,.3,.67);
  B.eye(-.3,.78,.56,.24,null,Dk,{white:Dk,pupil:Gw(0x7CF7FF),big:1});B.eye(.3,.8,.57,.2,null,Dk,{white:Dk,pupil:Gw(0x7CF7FF),big:1});
  const j=H.sub('jaw',0,.24,.1);j.rbox(.74,.22,.62,.1,Bo,0,-.1,.24);for(let i=0;i<5;i++)j.box(.025,.13,.05,Dk,-.24+i*.12,-.02,.56);
  H.box(.03,.3,.03,Dk,.25,1.28,.56,[0,0,.5]);
  /* cartola torta */
  const T=H.sub('hat',.07,1.38,-.05,[0,0,-.25]);T.cyl(.78,.78,.06,0x18141F,0,0,0,null,null,20);T.cyl(.5,.46,.78,0x18141F,0,.4,0,null,null,20);T.cyl(.48,.48,.14,Pu,0,.1,0,null,null,20);B.dang.push({n:'hat',sw:.5,pt:.4,k:80,d:4})},
 extra(T){[0,1,2].forEach(i=>T.tor(.4-i*.05,.05,0xF2ECDC,0,.9-i*.2,.4-i*.02,[0,0,PI],PI));T.box(.08,.6,.05,0xF2ECDC,0,.68,.5);
  T.cone(.14,.28,0x8E5BE8,-.14,1.1,.36,[0,0,PI/2]);T.cone(.14,.28,0x8E5BE8,.14,1.1,.36,[0,0,-PI/2]);T.ball(.07,0x8E5BE8,0,1.1,.4)}},

anne:{body:{shirt:0x2E7F8A,chest:0x2E7F8A,sleeve:0xF4EEDF,fore:0xE7B98E,hand:0xE7B98E,pants:0x7A4A2E,shoe:0x2A1E14,skin:0xE7B98E,w:.92,arm:.15},lid:-.45,tilt:.12,mood:'brave',air:'one',
 head(H,B){const Sk=0xE7B98E,Hr=Sf(0xE2B84A),Rd=0xC0302E;
  H.ball(.74,Sk,0,.62,0,[1,1,.98]);H.half(.79,Hr,0,.68,-.06,[1.05,1,1.08],[-.3,0,0]);H.mirror((k,s)=>{k.ball(.3,Hr,.58,.52,.1,[.6,1.3,.9]);k.ball(.07,0xE89A84,.4,.4,.62,[1,.6,.4])});
  H.ball(.34,Hr,-.3,1.08,.46,[1.4,.6,.8],[0,0,.3]);H.ball(.07,Sk,0,.5,.74);
  B.eye(-.28,.66,.6,.17,0x2E7F4A,Sk,{brow:0x9A7A2A,lash:1});B.eye(.28,.66,.6,.17,0x2E7F4A,Sk,{brow:0x9A7A2A,lash:1});B.mouth(0,.28,.66,.17,0xB8423A);
  H.tor(.76,.1,Rd,0,.98,-.02,[PI/2+.12,0,0],0,[1.02,1,1]);
  const p=H.sub('pony',0,1.0,-.74,[.9,0,0]);p.ball(.14,Rd,0,0,0);p.ball(.3,Hr,0,.34,0,[1,1.4,1]);const p2=p.sub('pony2',0,.66,0,[.5,0,0]);p2.ball(.26,Hr,0,.28,0,[1,1.5,1]);p2.ball(.17,Hr,0,.66,0,[1,1.3,1]);
  B.dang.push({n:'pony',sw:1.1,wind:-.6,pt:.4,k:50,d:4,fl:.12},{n:'pony2',sw:1.4,wind:-.5,k:45,d:3.5,fl:.2});
  const e=H.sub('ring',-.74,.42,.05);e.tor(.14,.03,Mt(0xFFD43B),0,-.14,0,[0,PI/2,0]);B.dang.push({n:'ring',sw:1.8,pt:1.5,k:40,d:2.5})},
 extra(T){T.tor(.36,.1,0xF4EEDF,0,1.08,0,[PI/2,0,0]);T.box(1.1,.16,.1,0x3A2818,0,.3,.5);T.rbox(.24,.22,.12,.04,Mt(0xFFD43B),0,.3,.54);for(let i=0;i<3;i++)T.ball(.055,Mt(0xFFD43B),.16,.5+i*.2,.5);T.mirror((k,s)=>k.rbox(.4,.12,.4,.05,Mt(0xFFD43B),.72,1.0,0,[0,0,-.3]))}},

henry:{body:{shirt:0xF4EEDF,chest:0xF4EEDF,sleeve:0xF4EEDF,fore:0x7A4E30,hand:0x7A4E30,pants:0x35557A,shoe:0x2A1E14,skin:0x7A4E30,w:1.08},lid:-.5,mood:'happy',air:'both',
 head(H,B){const Sk=0x7A4E30,Rd=0xC0302E;
  H.ball(.76,Sk,0,.62,0,[1.03,1,1]);H.ball(.6,Sf(0x4A2E1C),0,.4,.12,[1.12,.72,1.02]);H.ball(.14,0x6A4028,0,.52,.76,[1.1,.9,1]);H.mirror((k,s)=>k.ball(.17,Sk,.76,.6,0,[.5,1,.8]));
  B.eye(-.28,.74,.6,.17,0x3A2414,Sk,{brow:0x2A1A10});B.eye(.28,.74,.6,.17,0x3A2414,Sk,{brow:0x2A1A10});B.mouth(0,.28,.7,.26,0x3A1A14,{teeth:1});
  H.half(.8,Rd,0,.7,-.03,[1.06,.95,1.06],[-.22,0,0]);for(let i=0;i<5;i++)H.ball(.06,0xFFFFFF,Math.sin(i*1.3)*.5,1.22+Math.cos(i*2.1)*.12,Math.cos(i*1.3)*.5-.1);
  const k=H.sub('knot',-.5,.88,-.66,[.7,-.4,0]);k.ball(.14,Rd,0,0,0);k.rbox(.18,.06,.62,.03,Rd,0,0,-.34);k.rbox(.16,.06,.5,.03,0xA0262A,.14,-.03,-.28,[0,-.3,0]);B.dang.push({n:'knot',sw:1,wind:-.7,k:55,d:4,fl:.35});
  const e=H.sub('ring',.78,.44,.02);e.tor(.11,.028,Mt(0xFFD43B),0,-.11,0,[0,PI/2,0]);B.dang.push({n:'ring',sw:1.8,pt:1.5,k:40,d:2.5})},
 extra(T){for(let i=0;i<4;i++)T.tor(.6-(i>2?.1:0),.05,0x24457A,0,.25+i*.2,0,[PI/2,0,0],0,[1.12,.9,1]);T.tor(.36,.09,0xC0302E,0,1.08,0,[PI/2,0,0]);
  /* alaúde nas costas */
  T.ball(.42,Sf(0xB8763A),-.25,.55,-.62,[1,1.25,.5],[0,0,.5]);T.limb([-.1,.8,-.66],[.55,1.75,-.7],.07,0x6B3A22);T.rbox(.2,.3,.1,.04,0x4A2A18,.62,1.86,-.7,[0,0,-.6]);T.cyl(.13,.13,.03,0x2A1A10,-.25,.55,-.4,[PI/2,0,0])}},

barbarossa:{body:{shirt:0x7A1E22,chest:0x7A1E22,sleeve:0x7A1E22,fore:0x7A1E22,hand:0xE7B08A,pants:0x3A2A20,shoe:0x1A1410,skin:0xE7B08A,w:1.28,arm:.21},lid:-.25,tilt:.32,mood:'tough',air:'one',
 head(H,B){const Sk=0xE7B08A,Rb=Sf(0xD0541E),Rd=Sf(0xA83C12),Bk=0x1A1A20,Au=Mt(0xFFD43B);
  H.ball(.76,Sk,0,.64,0,[1.06,1,1]);H.ball(.2,0xD89A74,0,.56,.76,[1.2,1,1]);
  B.eye(-.3,.78,.6,.16,0x3A2618,Sk,{brow:Rd,browS:1.5});B.eye(.3,.78,.6,.16,0x3A2618,Sk,{brow:Rd,browS:1.5});
  H.mirror((k,s)=>{k.ball(.24,Rb,.26,.4,.7,[1.5,.6,.7],[0,0,-.35]);k.ball(.4,Rb,.6,.4,.2,[.7,1.2,1])});
  const b=H.sub('beard',0,.3,.4);b.ball(.56,Rb,0,-.2,.12,[1.25,1.05,.8]);b.ball(.4,Rd,-.3,-.62,.14,[.9,1.1,.8]);b.ball(.4,Rd,.3,-.62,.14,[.9,1.1,.8]);b.ball(.3,Rb,0,-.9,.2,[1,1.2,.8]);B.dang.push({n:'beard',sw:.5,pt:.5,k:70,d:5,fl:.03});
  const mo=H.sub('mO',0,.26,.86);mo.ball(.17,0x2A0F0C,0,0,0,[1.1,1,.5]);
  /* chapéu de capitão (três pontas) com caveira */
  const T=H.sub('hat',0,1.22,-.04,[-.1,0,0]);T.lathe([[.62,0],[.6,.34],[.4,.5],[0,.54]],Bk,0,0,0);T.ext([[-1.25,0],[0,.2],[1.25,0],[.9,.62],[0,.82],[-.9,.62]],.1,Bk,0,-.02,.62,[-.3,0,0]);T.ext([[-1.1,0],[1.1,0],[.8,.5],[-.8,.5]],.1,Bk,0,-.02,-.62,[.3,0,0]);
  T.ext([[-1.25,-.02],[0,.18],[1.25,-.02],[1.25,.06],[0,.26],[-1.25,.06]],.12,Au,0,-.02,.63,[-.3,0,0]);T.ball(.17,0xF4F0E2,0,.42,.6,[1,1,.5]);T.ball(.05,Bk,-.06,.44,.69);T.ball(.05,Bk,.06,.44,.69);
  const f=T.sub('feather',-.6,.5,-.2,[-.5,0,.4]);f.ball(.16,Sf(0xD9313F),0,.4,0,[.5,2.6,1]);B.dang.push({n:'feather',sw:1.5,wind:-.6,k:40,d:3,fl:.25},{n:'hat',sw:.15,pt:.15,k:120})},
 extra(T,B){T.mirror((k,s)=>{k.rbox(.5,.14,.56,.06,Mt(0xFFD43B),.92,1.0,0,[0,0,-.25]);for(let i=0;i<3;i++)k.ball(.06,Mt(0xFFD43B),.2,.42+i*.22,.52)});T.box(1.5,.2,.1,0x1A1410,0,.24,.54);T.rbox(.3,.28,.12,.05,Mt(0xFFD43B),0,.24,.58);
  /* papagaio no ombro: bate as asas no pulo */
  const p=T.sub('parrot',-1.05,1.22,.0);p.ball(.2,Sf(0x2FB35A),0,.22,0,[1,1.3,1]);p.ball(.16,Sf(0xD9313F),0,.52,.04);p.cone(.07,.18,P(0xFFD43B),0,.5,.2,[PI/2+.4,0,0],null,6);p.ball(.035,0x111111,-.08,.56,.14);p.ball(.035,0x111111,.08,.56,.14);p.ball(.1,Sf(0x2E7BE8),0,.02,-.2,[.6,.5,2.2],[.5,0,0]);
  for(const s of[-1,1]){const w=p.sub('wing'+s,s*.17,.3,0);w.ball(.16,Sf(0x23934A),s*.1,-.05,-.05,[.45,1.2,1.3])}B.dang.push({n:'parrot',sw:.8,pt:.6,k:90,d:5})}},

mako:{body:{shirt:0x1E1E24,chest:0x1E1E24,sleeve:Sf(0x7F8FA3),fore:Sf(0x7F8FA3),hand:Sf(0x7F8FA3),pants:0x6A6048,shoe:0x1A1410,skin:Sf(0x7F8FA3),w:1.2,arm:.2,bicep:1},lid:-.1,tilt:.42,mood:'angry',air:'none',jawK:.6,
 head(H,B){const Gy=Sf(0x7F8FA3),Bl=Sf(0xE8EEF2),Dk=0x4A5868;
  H.ball(.78,Gy,0,.66,.05,[1,.92,1.2]);H.cone(.62,1.1,Gy,0,.74,.95,[PI/2,0,0],[1,1,.62],12);H.ball(.5,Bl,0,.34,.3,[.85,.42,1.2]);
  H.mirror((k,s)=>{for(let i=0;i<3;i++)k.box(.03,.3,.12,Dk,.76,.62,-.1-i*.16,[0,0,.2]);k.ball(.04,0x2A3038,.18,.84,1.38)});
  B.eye(-.52,.98,.6,.19,0xE8C01A,Gy,{brow:Dk,browS:1.2});B.eye(.52,.98,.6,.19,0xE8C01A,Gy,{brow:Dk,browS:1.2});
  for(let i=0;i<7;i++)H.cone(.06,.14,0xFFFFFF,-.36+i*.12,.38,.98-Math.abs(i-3)*.04,[PI,0,0],null,4);
  const j=H.sub('jaw',0,.3,.1);j.ball(.46,Sf(0x9AA8B8),0,-.08,.34,[.9,.34,1.25]);for(let i=0;i<6;i++)j.cone(.055,.13,0xFFFFFF,-.3+i*.12,.08,.86-Math.abs(i-2.5)*.04,null,null,4);
  H.box(.04,.3,.04,0xC8606A,-.3,1.12,.7,[.4,0,.5]);
  const f=H.sub('fin',0,1.3,-.2);f.ext([[0,0],[.9,0],[.15,.8]],.12,Gy,0,0,0,[0,PI/2,0],null,.03);B.dang.push({n:'fin',sw:.4,k:140})},
 extra(T,B){T.ball(.5,Sf(0xE8EEF2),0,.62,.2,[1.1,.95,.7]);T.mirror((k,s)=>k.cone(.1,.24,Mt(0xC9CED6),.86,1.1,0,[0,0,-.5],null,5));
  const t=T.sub('tail',0,.2,-.55,[-1.1,0,0]);t.ball(.26,Sf(0x7F8FA3),0,.4,0,[.6,1.8,1]);t.ext([[0,0],[.7,.5],[.2,0],[.6,-.4]],.1,Sf(0x7F8FA3),0,.95,0,[0,PI/2,PI/2]);B.dang.push({n:'tail',sw:1.5,k:50,d:4,fl:.1})}},

sharky:{body:{shirt:0xFFD43B,chest:0xFFD43B,sleeve:Sf(0x4F8FD8),fore:Sf(0x4F8FD8),hand:Sf(0x4F8FD8),pants:0xFF6FA8,shoe:0x2E7BE8,skin:Sf(0x4F8FD8),band:0xFF7A1A},lid:-.75,mood:'happy',air:'both',jawK:.9,
 head(H,B){const Bu=Sf(0x4F8FD8),Wh=Sf(0xF4FAFF),Dk=0x2E5FA0;
  H.ball(.82,Bu,0,.66,.05,[1.05,.98,1.1]);H.ball(.5,Bu,0,.6,.78,[.95,.6,.9]);H.ball(.52,Wh,0,.32,.4,[.92,.46,1.1]);
  H.mirror((k,s)=>{k.ball(.14,Sf(0xFF9AC8),.62,.5,.6,[1,.6,.4]);for(let i=0;i<2;i++)k.box(.03,.24,.1,Dk,.84,.62,-.1-i*.16,[0,0,.2])});
  B.eye(-.42,1.04,.62,.26,0x1A3A7A,Bu);B.eye(.42,1.04,.62,.26,0x1A3A7A,Bu);
  for(let i=0;i<8;i++)H.cone(.055,.12,0xFFFFFF,-.39+i*.11,.4,.94-Math.abs(i-3.5)*.035,[PI,0,0],null,4);
  const j=H.sub('jaw',0,.3,.1);j.ball(.46,Wh,0,-.06,.36,[.95,.32,1.15]);j.ball(.28,Sf(0xFF6F8A),0,.03,.46,[1,.3,1.1]);
  const f=H.sub('fin',0,1.38,-.15);f.ext([[0,0],[.7,0],[.2,.6]],.12,Bu,0,0,0,[0,PI/2,0],null,.03);B.dang.push({n:'fin',sw:.5,k:120,fl:.04});
  /* máscara de mergulho na testa e snorkel */
  H.rbox(.9,.36,.2,.12,P(0xFFD43B),0,1.26,.5,[-.6,0,0]);H.rbox(.74,.24,.06,.08,Gl(0x9FE0FF),0,1.3,.6,[-.6,0,0]);H.tor(.82,.05,0x1A1A20,0,1.08,0,[PI/2+.2,0,0],0,[1.05,1,1]);
  H.tube([[.8,.6,.2],[.95,1.0,.1],[.9,1.75,-.05],[.8,1.9,-.02]],.07,P(0xFF7A1A),false,14)},
 extra(T,B){T.ball(.5,Sf(0xF4FAFF),0,.6,.24,[1.05,.9,.6]);T.tor(.66,.2,P(0xFF7A1A),0,.34,0,[PI/2,0,0],0,[1.1,1,1]);T.ball(.1,P(0xFFFFFF),.5,.42,.5);
  const t=T.sub('tail',0,.2,-.55,[-1.1,0,0]);t.ball(.24,Sf(0x4F8FD8),0,.4,0,[.6,1.8,1]);t.ext([[0,0],[.6,.45],[.2,0],[.5,-.35]],.1,Sf(0x4F8FD8),0,.9,0,[0,PI/2,PI/2]);B.dang.push({n:'tail',sw:1.6,k:45,d:3.5,fl:.2})}},

caveira:{body:{shirt:0x1E2A44,chest:0x1E2A44,sleeve:0x1E2A44,fore:0xD8E8C8,hand:0xD8E8C8,pants:0x3A2A22,shoe:0x18141F,skin:0xD8E8C8,arm:.12},lid:-.9,mood:'spooky',air:'both',jawK:1,
 head(H,B){const Bo=0xD8E8C8,Dk=0x101A14,Gn=Gw(0x7CFF6A);
  H.ball(.76,Bo,0,.72,0,[1.03,1,1]);H.rbox(.84,.3,.6,.12,Bo,0,.34,.36);H.mirror((k,s)=>k.ball(.2,Bo,.4,.46,.44));H.cone(.09,.18,Dk,0,.48,.72,[PI,0,0],null,6);
  for(let i=0;i<5;i++)H.box(.025,.16,.05,Dk,-.24+i*.12,.3,.67);
  B.eye(.3,.78,.56,.23,null,Dk,{white:Dk,pupil:Gn,big:1});
  /* tapa-olho */
  H.ball(.27,0x101014,-.3,.78,.6,[1,1,.4]);H.tor(.78,.035,0x101014,0,.84,0,[PI/2,0,.35],0,[1.02,1,1]);
  const j=H.sub('jaw',0,.24,.1);j.rbox(.74,.22,.62,.1,Bo,0,-.1,.24);for(let i=0;i<5;i++)j.box(.025,.13,.05,Dk,-.24+i*.12,-.02,.56);j.box(.1,.13,.06,Mt(0xFFD43B),.18,-.02,.56);
  H.half(.8,0x101014,0,.8,-.03,[1.06,.95,1.06],[-.25,0,0]);H.ball(.16,0xF4F0E2,0,1.38,.52,[1,1,.4],[-.5,0,0]);
  const k=H.sub('knot',.5,.98,-.66,[.7,.4,0]);k.ball(.14,0x101014,0,0,0);k.rbox(.18,.06,.7,.03,0x101014,0,0,-.38);k.rbox(.16,.06,.56,.03,0x24242C,-.14,-.03,-.3,[0,.3,0]);B.dang.push({n:'knot',sw:1,wind:-.7,k:55,d:4,fl:.35})},
 extra(T,B){[0,1,2].forEach(i=>T.tor(.4-i*.05,.05,0xD8E8C8,0,.9-i*.2,.4-i*.02,[0,0,PI],PI));T.mirror((k,s)=>{k.rbox(.46,.12,.5,.05,Mt(0xC9A84A),.74,1.0,0,[0,0,-.25]);for(let i=0;i<4;i++)k.cone(.14,.4,0x1E2A44,.3+i*.16,.02,-.3+i*.12,[PI,0,0],null,5)});
  T.limb([-.5,1.6,-.5],[.5,.2,-.6],.05,Mt(0xC9CED6));T.rbox(.3,.08,.12,.03,Mt(0xFFD43B),-.42,1.5,-.5,[0,0,.8])}}};

/* ---------- montagem do esqueleto ---------- */
function mkRig(id,pose){id=CH[id]?id:'capy';const def=CH[id],o=def.body,solo=pose==='solo',K=DX.kit(),w=o.w||1,ra=o.arm||.17,hy=solo?1.05:0;
 const B={dang:[],eyes:[],solo},R=K;
 /* quadril e pernas (sentado: joelhos para frente · em pé: retas) */
 K.ball(.52,o.pants,0,hy+.1,0,[1.05*w,.62,.95]);
 K.mirror((k,s)=>{if(solo){k.limb([.27*w,hy+.05,0],[.29*w,.24,.02],.23,o.pants);k.ball(.25,o.shoe,.29*w,.13,.14,[1,.72,1.5])}
  else{k.limb([.27*w,.08,.1],[.32,.16,.85],.23,o.pants);k.limb([.32,.14,.88],[.32,-.26,1.2],.2,o.pants);k.ball(.24,o.shoe,.32,-.34,1.34,[1,.72,1.5])}});
 const T=K.sub('torso',0,hy+.2,-.02);
 T.ball(.6,o.shirt,0,.42,0,[1.08*w,1.05,.86]);T.ball(.52,o.chest,0,.85,0,[1.3*w,.66,.84]);T.cyl(.2,.25,.3,o.skin,0,1.14,0);
 const H=T.sub('head',0,1.2,.02);
 B.eye=(x,y,z,r,iris,lid,e)=>{e=e||{};const s=x<0?'L':'R';H.ball(r,e.white||0xFFFFFF,x,y,z);
  const pu=H.sub('pu'+s,x,y,z);if(iris!=null)pu.ball(r*.62,iris,0,0,r*.5,[1,1,.55]);
  if(e.big)pu.ball(r*.34,e.pupil,0,0,r*.72);else if(!e.glint)pu.ball(r*.36,e.pupil||0x0E0E16,0,0,r*.72,[1,1,.5]);
  pu.ball(r*(e.glint?.2:.14),Gw(0xFFFFFF),r*.22,r*.26,r*(e.glint?.86:.94));if(e.glint)pu.ball(r*.1,Gw(0xFFFFFF),-r*.2,-r*.15,r*.9);
  const ld=H.sub('ld'+s,x,y,z);ld.half(r*1.1,lid,0,0,0);if(e.brow)ld.rbox(r*1.8*(e.browS||1),r*.34*(e.browS||1),r*.4,r*.12,e.brow,0,r*.62,r*1.16,[.55,0,0]);
  if(e.lash)ld.box(r*.5,r*.08,r*.3,0x2A1A10,(x<0?-1:1)*r*.95,r*.1,r*.5,[0,0,(x<0?1:-1)*.5]);
  B.eyes.push({s,r,sg:x<0?-1:1})};
 /* boca: sorriso fechado (mS) e boca aberta (mO) */
 B.mouth=(x,y,z,wd,col,e)=>{e=e||{};const a=H.sub('mS',x,y,z,[0,0,e.smirk?.25:0]);a.tor(wd,wd*.2,col,0,wd*.5,0,[0,0,PI+.35],PI-.7);
  const b=H.sub('mO',x,y,z);b.ball(wd*1.05,0x2A0F0C,0,0,-.02,[1,.85,.5]);b.ball(wd*.6,0xE8627A,0,-wd*.4,.02,[1,.5,.5]);if(e.teeth)b.rbox(wd*1.5,wd*.3,.06,.03,0xFFFFFF,0,wd*.55,.05)};
 def.head(H,B);def.extra&&def.extra(T,B,R);
 /* braços */
 if(solo){for(const s of[-1,1]){const A=T.sub('arm'+s,s*.72*w,.9,0),e=[s*.1,-.6,.05],h=[s*.14,-1.14,.14];A.ball(ra*1.28,o.sleeve,0,0,0);A.limb([0,0,0],e,ra,o.sleeve);A.limb(e,h,ra*.9,o.fore);
   A.ball(ra*1.35,o.hand,h[0],h[1]-.06,h[2],[1,1.1,.9]);if(o.bicep)A.ball(ra*1.6,o.sleeve,e[0]/2,e[1]/2,e[2]/2,[1,1.1,1.1]);if(o.band)A.tor(ra*1.3,ra*.6,P(o.band),e[0]/2,e[1]/2,e[2]/2,[PI/2,0,0])}}
 else{for(const s of[-1,1]){const n=s<0?'L':'R',U=K.sub('ua'+n,0,0,0),F=K.sub('fa'+n,0,0,0),Hd=K.sub('hd'+n,0,0,0);
   U.ball(ra*1.28,o.sleeve,0,0,0);U.limb([0,0,0],[0,L1,0],ra,o.sleeve);if(o.bicep)U.ball(ra*1.6,o.sleeve,0,L1*.5,0,[1,1.15,1.1]);if(o.band)U.tor(ra*1.3,ra*.6,P(o.band),0,L1*.55,0,[PI/2,0,0]);
   F.ball(ra*1.05,o.sleeve,0,0,0);F.limb([0,0,0],[0,L2,0],ra*.9,o.fore);Hd.ball(ra*1.4,o.hand,0,0,0,[1,.95,1.1])}
  /* volante (gira) e coluna */
  K.limb([WC[0],WC[1],WC[2]],[0,.2,WC[2]+.38],.06,0x23262E);const V=K.sub('vol',WC[0],WC[1],WC[2],[WT,0,0]);V.tor(WR,.075,0x23262E,0,0,0);V.cyl(.13,.13,.1,Mt(0xC9CED6),0,0,0,[PI/2,0,0]);V.box(WR*1.9,.07,.05,0x3A3F4A,0,0,0);V.box(.07,WR,.05,0x3A3F4A,0,-WR/2,0);V.box(.12,.08,.06,P(0xFF3B30),0,WR-.02,.02)}
 const g=K.build(),p=g.userData.parts;
 const rig={id,def,g,p,solo,w,eyes:B.eyes,dang:B.dang.filter(d=>p[d.n]).map(d=>({g:p[d.n],bx:p[d.n].rotation.x,bz:p[d.n].rotation.z,ax:0,az:0,vx:0,vz:0,sw:d.sw||0,pt:d.pt||0,wind:d.wind||0,k:d.k||90,d:d.d||7,fl:d.fl||0,ph:Math.random()*9})),
  bl:1+Math.random()*3,blink:0,lid:def.lid==null?-.5:def.lid,tilt:def.tilt||0,sh:[new V3(-.72*w,.9,0),new V3(.72*w,.9,0)],hand:[new V3(),new V3()],mode:[0,0,0],st:0,look:0,lookT:0,ex:{open:0,ang:0,cl:0},t:Math.random()*20,T0:hy+.2};
 if(p.mO)p.mO.visible=false;g.userData.rig=rig;
 if(solo){g.userData.cabeca=p.head;g.userData.bracos=[{g:p['arm-1'],s:-1},{g:p.arm1,s:1}]}
 else{pose0(rig)}
 DX.rigs.push(rig);return rig}

/* ---------- braço de 2 ossos: ombro S → mão Tg, cotovelo para fora e para baixo ---------- */
const _d=new V3(),_e=new V3(),_pl=new V3(),_t=new V3(),_m=new THREE.Matrix4(),UP=new V3(0,1,0),_q=new THREE.Quaternion();
function ik(rig,i,Tg){const n=i?'R':'L',s=i?1:-1,p=rig.p,S=_t.copy(rig.sh[i]).applyMatrix4(p.torso.matrix);
 _d.copy(Tg).sub(S);let d=_d.length();const mx=L1+L2-.02;if(d>mx){_d.multiplyScalar(mx/d);d=mx}_d.multiplyScalar(1/d);
 const a=(L1*L1-L2*L2+d*d)/(2*d),h=Math.sqrt(Math.max(0,L1*L1-a*a));_pl.set(s*.75,-.6,-.25);_pl.addScaledVector(_d,-_pl.dot(_d)).normalize();
 _e.copy(S).addScaledVector(_d,a).addScaledVector(_pl,h);
 const U=p['ua'+n],F=p['fa'+n],Hd=p['hd'+n];U.position.copy(S);U.quaternion.setFromUnitVectors(UP,_pl.copy(_e).sub(S).normalize());
 _pl.copy(S).addScaledVector(_d,d).sub(_e);const fl=_pl.length();F.position.copy(_e);F.quaternion.setFromUnitVectors(UP,_pl.multiplyScalar(1/fl));F.scale.y=fl/L2;
 Hd.position.copy(S).addScaledVector(_d,d);Hd.quaternion.copy(F.quaternion)}
const hw=(out,i,phi)=>{const a=(i?-1.15:1.15)+phi;return out.set(WC[0],WC[1],WC[2]).addScaledVector(EX,Math.sin(a)*WR).addScaledVector(EY,Math.cos(a)*WR)};
function pose0(rig){rig.p.torso.updateMatrix();for(const i of[0,1]){hw(rig.hand[i],i,0);ik(rig,i,rig.hand[i])}}

/* ---------- animação: s={mode:'race'|'idle', steer, roll, acc, f(0-1 veloc.), air, hit, boost, fin, bounce, drift, dt} ---------- */
const _h=new V3(),S0={mode:'idle',steer:0,roll:0,acc:0,f:0,air:false,hit:0,boost:false,fin:0,bounce:0,drift:false,dt:.016};
DX.rigUpdate=function(rig,s){const dt=s.dt,p=rig.p,def=rig.def;rig.t+=dt;const t=rig.t,race=s.mode==='race';
 /* piscar */
 rig.bl-=dt;if(rig.bl<=0){rig.bl=1.6+Math.random()*3.6;rig.blink=.16}rig.blink=Math.max(0,rig.blink-dt);const bk=rig.blink>0?Math.sin(rig.blink/.16*PI):0;
 /* expressão: aberto (grito), bravo, olhos fechados (feliz/tonto) */
 const win=s.fin>0&&s.fin<=3,sad=s.fin>3,dizzy=s.hit>.25,E=rig.ex;
 E.open=damp(E.open,dizzy||s.air||s.boost||win?1:0,14,dt);E.ang=damp(E.ang,sad?-.5:s.boost||s.drift?.35:0,8,dt);E.cl=damp(E.cl,win?.75:dizzy?.55:sad?.35:0,10,dt);
 for(const e of rig.eyes){const ld=p['ld'+e.s],pu=p['pu'+e.s];let a=rig.lid+(s.air?-.3:0);a=lerp(a,1.42,Math.max(bk,E.cl));ld.rotation.x=a;ld.rotation.z=e.sg*(rig.tilt+E.ang)+(dizzy?Math.sin(t*20+e.sg)*.3:0);
  pu.position.x=pu.userData.x0===undefined?(pu.userData.x0=pu.position.x):pu.userData.x0;pu.position.x+=clamp(rig.look*.5+(dizzy?Math.sin(t*22)*.6:0),-.6,.6)*e.r*.4;
  pu.scale.setScalar(s.air||dizzy?.8:1)}
 if(p.jaw){p.jaw.rotation.x=E.open*.42*(def.jawK||1)+(def.jawK&&!E.open?Math.max(0,Math.sin(t*(race?9+s.f*8:3)))*.1*(race?s.f:.6):0)}
 else if(p.mO&&p.mS){const op=E.open>.4;p.mO.visible=op;p.mS.visible=!op;if(op)p.mO.scale.set(1,.5+E.open*.6+Math.sin(t*18)*.06,1)}
 else if(p.mO){p.mO.visible=E.open>.4}
 /* peças soltas com mola */
 const sway=race?-s.roll:Math.sin(t*1.3)*.02,acc=race?s.acc:0;
 for(const d of rig.dang){const tz=clamp(sway*d.sw*4,-.9,.9),tx=clamp(-acc*.006*d.pt+s.f*d.wind,-1.1,1.1)+(s.air?-d.pt*.5:0);
  d.vz+=((tz-d.az)*d.k-d.vz*d.d)*dt;d.az+=d.vz*dt;d.vx+=((tx-d.ax)*d.k-d.vx*d.d)*dt;d.ax+=d.vx*dt;const fl=d.fl*(race?.25+s.f:.25)*Math.sin(t*(6+d.k*.08)+d.ph);
  d.g.rotation.z=d.bz+d.az+fl*.6;d.g.rotation.x=d.bx+d.ax+fl}
 if(p.wing1){const fl=s.air?Math.sin(t*38)*1.1:Math.sin(t*2)*.05;p.wing1.rotation.z=.2+Math.max(0,fl);p['wing-1'].rotation.z=-.2-Math.max(0,fl)}
 if(rig.solo){/* em pé (garagem): o menu já mexe braços e cabeça; aqui só o olhar */rig.lookT-=dt;if(rig.lookT<=0){rig.lookT=1+Math.random()*2.5;rig.lookG=(Math.random()-.5)*1.4}rig.look=damp(rig.look,rig.lookG||0,5,dt);return}
 /* tronco: inclina para DENTRO da curva, é jogado para trás na arrancada e para frente no freio */
 const T=p.torso,Hh=p.head;rig.st=damp(rig.st,s.steer,race?9:4,dt);
 const cheer=win?1:0,wob=dizzy?Math.sin(t*16)*.12:0;
 T.rotation.z=damp(T.rotation.z,clamp(-s.roll*2.4,-.34,.34)+wob+(cheer?Math.sin(t*7)*.06:0),10,dt);
 T.rotation.x=damp(T.rotation.x,clamp(-s.acc*.0042,-.22,.26)+s.f*.07+(s.boost?.16:0)+(sad?.3:0)+(s.air?-.12:0),9,dt);
 T.rotation.y=damp(T.rotation.y,rig.st*.2,8,dt);T.position.y=rig.T0+s.bounce*.35+Math.sin(t*2.2)*.012+(cheer?Math.abs(Math.sin(t*7))*.08:0);T.updateMatrix();
 /* cabeça: olha para a curva, fica mais em pé que o tronco, balança no pouso; cada piloto tem um jeito */
 if(!race){rig.lookT-=dt;if(rig.lookT<=0){rig.lookT=1.2+Math.random()*2.6;rig.lookG=(Math.random()-.5)*1.1}}
 const lg=race?rig.st*.55+(s.drift?rig.st*.25:0):(rig.lookG||0);rig.look=damp(rig.look,lg,race?7:3.5,dt);
 const md=def.mood,nod=md==='happy'||md==='goofy'?Math.sin(t*5)*.07:md==='zen'?Math.sin(t*1.1)*.04:md==='weird'?Math.sin(t*2.3)*.1*Math.sin(t*.7):md==='cocky'?-.06:0;
 Hh.rotation.y=rig.look+(dizzy?Math.sin(t*13)*.4:0);Hh.rotation.z=-T.rotation.z*.55+(md==='weird'?Math.sin(t*.9)*.12:0)+(dizzy?Math.cos(t*13)*.25:0)+(cheer?Math.sin(t*7)*.12:0);
 Hh.rotation.x=-T.rotation.x*.6+nod+s.bounce*.5+(sad?.35:0)+(cheer?-.2:0)+(s.air?-.15:0);
 /* mãos: no volante (0) · para o alto (1) · se debatendo (2) */
 const M=rig.mode,up=s.air&&!dizzy?(def.air==='both'?[1,1]:def.air==='one'?[0,1]:[0,0]):cheer?[1,1]:[0,0],fl=dizzy?1:0;
 p.vol.rotation.z=-rig.st*.75;
 for(const i of[0,1]){const sg=i?1:-1;M[i]=damp(M[i],up[i],10,dt);M[2]=damp(M[2],fl,12,dt);hw(_h,i,rig.st*.75);
  if(sad){_h.y-=.0}
  if(M[i]>.01){const pump=cheer?Math.sin(t*9+i*PI)*.22:Math.sin(t*14+i*2)*.08;_d.set(sg*(.78*rig.w+.1),1.95+pump,.1);_h.lerp(_d,M[i])}
  if(M[2]>.01){_d.set(sg*(1.0+Math.sin(t*17+i)*.2),1.5+Math.sin(t*19+i*2)*.4,.4+Math.cos(t*15+i)*.3);_h.lerp(_d,M[2])}
  rig.hand[i].copy(_h);ik(rig,i,_h)}};

/* ---------- ligação com o jogo: buildChar (no kart), CHB (em pé na garagem), pilotos fora de corrida ganham vida sozinhos ---------- */
const specOf=v=>DX.SPEC[v]||(DX.SPEC[v]=DX.DES[v](DX.kit(),0xFFFFFF));
buildChar=function(id,veh){id=CHARS[id]?id:'capy';const S=specOf(VEH[veh]?veh:VDEF),rig=mkRig(id,'seat'),g=rig.g;g.position.set(S.seat[0],S.seat[1],S.seat[2]);g.scale.setScalar(PS);g.userData.ch=id;return g};
CKEYS.forEach(id=>{delete CHARS[id].pirata;CHB[id]=(g,pe)=>{const rig=mkRig(id,pe==='solo'?'solo':'seat'),m=rig.g;m.scale.setScalar(PS);g.add(m);g.userData.cabeca=m.userData.cabeca||null;g.userData.bracos=m.userData.bracos||[];g.userData.rig=rig}});
DX.mkRig=mkRig;DX.CH=CH;
const inScene=o=>{let n=0;while(o.parent&&n++<12)o=o.parent;return !!o.isScene};
on('visuals',dt=>{if(dt<=0)return;const own=new Set();if(state==='count'||state==='go')for(const k of karts)if(k.dx&&k.dx.pil)own.add(k.dx.pil.userData.rig);
 for(let i=DX.rigs.length-1;i>=0;i--){const r=DX.rigs[i];if(own.has(r))continue;if(!inScene(r.g)){if((r.gone=(r.gone||0)+1)>120)DX.rigs.splice(i,1);continue}r.gone=0;
  S0.dt=dt;S0.fin=state==='end'&&!r.solo?1:0;DX.rigUpdate(r,S0)}});
})();
