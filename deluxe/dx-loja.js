/* ===== KART RUSH DELUXE · CONTA, LOJA, PASSE, MISSÕES E TROFÉUS =====
 ECONOMIA (2 moedas):
  🪙 MOEDAS — ganhas jogando (corrida, posição, moedas da pista, acertos, drift roxo, missões, troféus, login diário).
  💎 GEMAS  — a moeda "paga": vem dos pacotes em dinheiro, mas também sai (pouca) de troféus, missões e do passe.
 Tudo o que se compra é VISUAL ou GRAÇA (gadget engraçado de efeito fraco e 1 uso por volta). Nada vende velocidade.
 Itens: PINTURAS (material do kart) · RASTROS (partículas atrás do kart) · ACESSÓRIOS (na cabeça do piloto) · GADGETS (Q / Ctrl dir. / botão Y).
 Preço: cada raridade tem preço em 🪙 (esforço) e em 💎 (atalho). Alguns itens só existem no PASSE DA TEMPORADA.
 PASSE: 30 níveis (300 XP cada), trilha grátis + trilha premium (950 💎). XP vem das corridas e das missões.
 Pagamento em dinheiro: os pacotes de 💎 já têm preço e tela, mas o checkout (Mercado Pago/Stripe) precisa de um servidor —
 o ponto de ligação é LOJA.checkout(pacote). Sem servidor, nada é creditado.
 Dados: localStorage 'kr_conta' (por aparelho/TV). Para vender de verdade, a conta precisa ir para um servidor (senão dá para editar). */
if(window.PHONE)throw new Error('PHONEMODE');
(()=>{const {P,Mt,Gw,Ha,Sf,Fl,damp}=DX,PI=Math.PI;
/* ---------- catálogo ---------- */
const RAR={comum:{n:'COMUM',c:'#9FB0D9',co:400,ge:40},raro:{n:'RARO',c:'#2E9BFF',co:1200,ge:120},epico:{n:'ÉPICO',c:'#B46BFF',co:3000,ge:300},lend:{n:'LENDÁRIO',c:'#FFB020',co:6000,ge:600}};
const TIPOS={pintura:{n:'PINTURAS',ico:'🎨'},rastro:{n:'RASTROS',ico:'✨'},chapeu:{n:'ACESSÓRIOS',ico:'🎩'},gadget:{n:'GADGETS',ico:'🧰'}};
const IT=[
 /* pinturas */
 {id:'p_doce',t:'pintura',nm:'Algodão Doce',rar:'comum',sw:'linear-gradient(135deg,#FFB8DE,#FF8AC8)',d:'Rosa pastel macio, cara de doce.'},
 {id:'p_carbono',t:'pintura',nm:'Fibra de Carbono',rar:'comum',sw:'linear-gradient(135deg,#3A3E48,#16181D)',d:'Preto com verniz brilhante de carro de corrida.'},
 {id:'p_cromo',t:'pintura',nm:'Cromado',rar:'raro',sw:'linear-gradient(135deg,#FFFFFF,#9AA6B6 45%,#F4F7FA 55%,#7E8898)',d:'Espelho puro: reflete a pista toda.'},
 {id:'p_neon',t:'pintura',nm:'Neon Pulsante',rar:'raro',sw:'radial-gradient(circle,#9FF4FF,#22D3FF 60%,#0A6A9A)',d:'Brilha no escuro e pulsa com a batida.'},
 {id:'p_gelo',t:'pintura',nm:'Cristal de Gelo',rar:'raro',sw:'linear-gradient(135deg,#E8FCFF,#9FE8FF 50%,#5FB8E0)',d:'Azul gelado com brilho de cristal.'},
 {id:'p_ouro',t:'pintura',nm:'Ouro 24k',rar:'epico',sw:'linear-gradient(135deg,#FFF1A8,#FFC83A 45%,#B8860B)',d:'Dourado de campeão. Todo mundo vai olhar.'},
 {id:'p_lava',t:'pintura',nm:'Lava Viva',rar:'epico',sw:'radial-gradient(circle,#FFB020,#FF4A1A 40%,#2A0A06 80%)',d:'Rocha escura com lava pulsando por dentro.'},
 {id:'p_arco',t:'pintura',nm:'Arco-Íris',rar:'lend',sw:'linear-gradient(135deg,#FF3B30,#FFD43B,#34C759,#2E9BFF,#B46BFF)',d:'Troca de cor o tempo todo.'},
 {id:'p_galaxia',t:'pintura',nm:'Galáxia',rar:'lend',so:'passe',sw:'radial-gradient(circle at 30% 30%,#FF7CD8,#5B2A9A 40%,#0A0626 80%)',d:'Exclusiva do Passe: muda de cor conforme a luz.'},
 /* rastros */
 {id:'r_bolhas',t:'rastro',nm:'Bolhas',rar:'comum',ico:'🫧',d:'Bolhinhas de sabão saindo do escapamento.'},
 {id:'r_fogo',t:'rastro',nm:'Fogo',rar:'comum',ico:'🔥',d:'Labaredas atrás do kart.'},
 {id:'r_coracao',t:'rastro',nm:'Purpurina Rosa',rar:'raro',ico:'💖',d:'Um rastro de purpurina fofa.'},
 {id:'r_estrelas',t:'rastro',nm:'Estrelas',rar:'raro',ico:'⭐',d:'Estrelinhas douradas piscando.'},
 {id:'r_arco',t:'rastro',nm:'Arco-Íris',rar:'epico',ico:'🌈',d:'Um arco-íris inteiro atrás de você.'},
 {id:'r_raios',t:'rastro',nm:'Raios',rar:'epico',ico:'⚡',d:'Faíscas elétricas estalando.'},
 {id:'r_moedas',t:'rastro',nm:'Chuva de Ouro',rar:'lend',so:'passe',ico:'🪙',d:'Exclusivo do Passe: você deixa ouro pelo caminho.'},
 /* acessórios */
 {id:'c_festa',t:'chapeu',nm:'Chapéu de Festa',rar:'comum',ico:'🥳',d:'Toda corrida é uma festa.'},
 {id:'c_gato',t:'chapeu',nm:'Orelhas de Gato',rar:'comum',ico:'🐱',d:'Miau na pista.'},
 {id:'c_helice',t:'chapeu',nm:'Boné de Hélice',rar:'raro',ico:'🧢',d:'A hélice gira mais rápido quanto mais você corre.'},
 {id:'c_chifres',t:'chapeu',nm:'Chifrinhos',rar:'raro',ico:'😈',d:'Para os pilotos mais malvados.'},
 {id:'c_aureola',t:'chapeu',nm:'Auréola',rar:'raro',ico:'😇',d:'Um anjinho... até jogar a gosma.'},
 {id:'c_viking',t:'chapeu',nm:'Capacete Viking',rar:'epico',ico:'⚔️',d:'Para conquistar a pista.'},
 {id:'c_coroa',t:'chapeu',nm:'Coroa Real',rar:'epico',ico:'👑',d:'O rei (ou a rainha) da corrida.'},
 {id:'c_pirata',t:'chapeu',nm:'Chapéu de Capitão',rar:'comum',so:'passe',ico:'🏴‍☠️',d:'Do Passe (grátis): içar velas!'},
 {id:'c_cartola',t:'chapeu',nm:'Cartola de Ouro',rar:'lend',so:'passe',ico:'🎩',d:'Exclusiva do Passe: elegância de milionário.'},
 /* gadgets: graça, efeito fraco, 1 uso por volta */
 {id:'g_buzina',t:'gadget',nm:'Buzina Maluca',rar:'comum',so:'gratis',ico:'📯',d:'FOOOM! Quem está na sua frente leva um susto e balança.'},
 {id:'g_luva',t:'gadget',nm:'Luva de Boxe',rar:'raro',ico:'🥊',d:'Uma luva sai da lateral e empurra quem estiver colado em você.'},
 {id:'g_oleo',t:'gadget',nm:'Gota de Óleo',rar:'raro',ico:'🛢️',d:'Deixa uma pocinha de óleo atrás. Escorrega!'},
 {id:'g_gancho',t:'gadget',nm:'Corrente com Gancho',rar:'epico',ico:'⛓️',d:'Engancha no kart da frente: você ganha um puxão e ele perde um pouco.'},
 {id:'g_rede',t:'gadget',nm:'Rede de Pesca',rar:'raro',so:'passe',ico:'🎣',d:'Do Passe: arremesse a rede bem na frente. Difícil de mirar, mas quem for pescado fica lento.'}];
const ITH={};IT.forEach(i=>ITH[i.id]=i);
/* pacotes em dinheiro (preços sugeridos) */
const PACOTES=[{id:'g120',ge:120,rs:'R$ 4,90',nm:'Punhado de Gemas'},{id:'g650',ge:650,bonus:50,rs:'R$ 19,90',nm:'Saco de Gemas'},{id:'g1400',ge:1400,bonus:150,rs:'R$ 39,90',nm:'Baú de Gemas',top:1},{id:'g3000',ge:3000,bonus:500,rs:'R$ 79,90',nm:'Tesouro de Gemas'}];
/* passe da temporada */
const SEASON={id:'T1',nm:'TEMPORADA 1 · FESTA PIRATA',fim:'2026-12-31',tier:300,prem:950,nivel:150};
const PASSE=[];{const F=[[200],['c_pirata'],[250],[20,'ge'],[300],['r_bolhas'],[350],[30,'ge'],[400],['p_doce'],[450],[40,'ge'],[500],['c_gato'],[550],[50,'ge'],[600],['g_oleo'],[650],[60,'ge'],[700],['r_fogo'],[750],[80,'ge'],[800],[1000]];
 const Pm=[[100,'ge'],['g_rede'],[500],['r_coracao'],[100,'ge'],['p_neon'],[600],['c_helice'],[100,'ge'],['c_cartola'],[700],['r_estrelas'],[100,'ge'],['p_ouro'],[800],['c_viking'],[150,'ge'],['r_arco'],[900],['c_coroa'],[150,'ge'],['r_raios'],[1000],['p_lava'],[150,'ge'],['r_moedas'],[1500],[200,'ge'],['p_arco'],['p_galaxia']];
 const rw=a=>typeof a[0]==='string'?{it:a[0]}:a[1]==='ge'?{ge:a[0]}:{co:a[0]};for(let i=0;i<30;i++)PASSE.push({f:F[i]?rw(F[i]):null,p:rw(Pm[i])})}
/* missões do dia */
const MISS=[{id:'corr',nm:'Termine 3 corridas',g:3,k:'corr'},{id:'podio',nm:'Fique no pódio 2 vezes',g:2,k:'podio'},{id:'vit',nm:'Vença 1 corrida',g:1,k:'vit'},{id:'drift',nm:'Solte 4 turbos roxos de drift',g:4,k:'drift3'},
 {id:'moed',nm:'Pegue 25 moedas na pista',g:25,k:'moedas'},{id:'acer',nm:'Acerte 3 rivais com itens',g:3,k:'acertos'},{id:'gad',nm:'Use seu gadget 4 vezes',g:4,k:'gadgets'},{id:'pulo',nm:'Faça 3 manobras no ar',g:3,k:'manobras'}];
/* troféus */
const TROF=[
 {id:'t1',ico:'🏁',nm:'Primeira Largada',d:'Termine 1 corrida',k:'corr',g:1,co:100},
 {id:'t2',ico:'🥇',nm:'Primeira Vitória',d:'Vença 1 corrida',k:'vit',g:1,co:200,ge:10},
 {id:'t3',ico:'🏎️',nm:'Piloto de Verdade',d:'Termine 25 corridas',k:'corr',g:25,co:500,ge:20},
 {id:'t4',ico:'🏆',nm:'Lenda da Pista',d:'Vença 25 corridas',k:'vit',g:25,co:1500,ge:50},
 {id:'t5',ico:'🥉',nm:'Sempre no Pódio',d:'Fique no pódio 15 vezes',k:'podio',g:15,co:600,ge:20},
 {id:'t6',ico:'💨',nm:'Rei do Drift',d:'Solte 50 turbos roxos',k:'drift3',g:50,co:800,ge:30},
 {id:'t7',ico:'🪙',nm:'Catador de Moedas',d:'Pegue 500 moedas na pista',k:'moedas',g:500,co:700,ge:20},
 {id:'t8',ico:'🎯',nm:'Mira Certeira',d:'Acerte 50 rivais com itens',k:'acertos',g:50,co:800,ge:30},
 {id:'t9',ico:'🤸',nm:'Acrobata',d:'Faça 40 manobras no ar',k:'manobras',g:40,co:600,ge:20},
 {id:'t10',ico:'🌊',nm:'Mergulhador',d:'Caia 10 vezes (acontece!)',k:'quedas',g:10,co:150},
 {id:'t11',ico:'❄️',nm:'Campeão do Gelo',d:'Vença no Pico Gelado',k:'v_gelo',g:1,co:300,ge:10},
 {id:'t12',ico:'🍭',nm:'Campeão Doce',d:'Vença no Reino Doce',k:'v_candy',g:1,co:300,ge:10},
 {id:'t13',ico:'🏴‍☠️',nm:'Capitão da Baía',d:'Vença na Baía do Kraken',k:'v_pirata',g:1,co:300,ge:10},
 {id:'t14',ico:'🌋',nm:'Sobrevivente do Inferno',d:'Vença no Vulcão',k:'v_vulcao',g:1,co:300,ge:10},
 {id:'t15',ico:'🧼',nm:'Corrida Limpa',d:'Vença sem cair nenhuma vez',k:'limpa',g:1,co:400,ge:15},
 {id:'t16',ico:'🎣',nm:'Pescador',d:'Pesque 5 rivais com a Rede',k:'pescados',g:5,co:500,ge:20},
 {id:'t17',ico:'🛍️',nm:'Colecionador',d:'Tenha 10 itens da loja',k:'itens',g:10,co:800,ge:40},
 {id:'t18',ico:'📅',nm:'Fiel à Pista',d:'Jogue 7 dias seguidos',k:'seq',g:7,co:1000,ge:50}];

/* ---------- conta ---------- */
const LS='kr_conta',hoje=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const novo=()=>({v:1,co:300,ge:0,own:{g_buzina:1},eq:[0,1,2,3].map(()=>({gadget:'g_buzina'})),st:{},trof:{},passe:{s:SEASON.id,xp:0,prem:false,f:{},p:{}},miss:{dia:'',l:[]},login:{dia:'',seq:0},vitDia:''});
let C;try{C=Object.assign(novo(),JSON.parse(localStorage.getItem(LS)||'null')||{})}catch(e){C=novo()}
if(!C.passe||C.passe.s!==SEASON.id)C.passe={s:SEASON.id,xp:0,prem:false,f:{},p:{}};
const salva=()=>{try{localStorage.setItem(LS,JSON.stringify(C))}catch(e){}};
const tem=id=>!!C.own[id];
const eqOf=s=>C.eq[s]||(C.eq[s]={gadget:'g_buzina'});
const fmt=n=>Math.round(n).toLocaleString('pt-BR');
/* missões novas a cada dia + prêmio de dias seguidos */
function diaNovo(){const d=hoje();if(C.miss.dia!==d){const pool=MISS.slice();const l=[];while(l.length<3&&pool.length)l.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0].id);C.miss={dia:d,l:l.map(id=>({id,n:0,ok:false,pego:false})),bonus:false}}
 if(C.login.dia!==d){const ont=new Date(Date.now()-864e5),od=ont.getFullYear()+'-'+String(ont.getMonth()+1).padStart(2,'0')+'-'+String(ont.getDate()).padStart(2,'0');
  C.login.seq=C.login.dia===od?C.login.seq+1:1;C.login.dia=d;C.st.seq=Math.max(C.st.seq||0,C.login.seq);const s=C.login.seq,pr=s%7===0?{ge:20}:{co:50+25*Math.min(s-1,5)};C.login.pend=pr;salva();return true}return false}
const addSt=(k,n)=>{C.st[k]=(C.st[k]||0)+n;for(const m of C.miss.l){const M=MISS.find(x=>x.id===m.id);if(M&&M.k===k&&!m.ok){m.n=Math.min(M.g,m.n+n);if(m.n>=M.g)m.ok=true}}};
const tierOf=xp=>Math.min(30,Math.floor(xp/SEASON.tier));

/* ---------- PINTURAS: material do kart (nas peças de "pintura") ---------- */
const PMAT={};const envI=1.3;
const PAINT={
 p_doce:{base:0xFF9AD0,mk:()=>new THREE.MeshStandardMaterial({vertexColors:true,roughness:.55,metalness:0,envMap:DX.env,envMapIntensity:.5})},
 p_carbono:{base:0x2A2D33,mk:()=>new THREE.MeshPhysicalMaterial({vertexColors:true,roughness:.45,metalness:.3,clearcoat:1,clearcoatRoughness:.05,envMap:DX.env,envMapIntensity:1})},
 p_cromo:{base:0xE6EBF2,mk:()=>new THREE.MeshStandardMaterial({vertexColors:true,roughness:.06,metalness:1,envMap:DX.env,envMapIntensity:1.8})},
 p_neon:{base:0x22D3FF,mk:()=>new THREE.MeshStandardMaterial({vertexColors:true,roughness:.3,metalness:.2,emissive:new THREE.Color(0x22D3FF),emissiveIntensity:.6,envMap:DX.env}),an:(m,t)=>m.emissiveIntensity=.35+.45*(.5+.5*Math.sin(t*5))},
 p_gelo:{base:0xBFF3FF,mk:()=>new THREE.MeshPhysicalMaterial({vertexColors:true,roughness:.08,metalness:.1,clearcoat:1,emissive:new THREE.Color(0x5FC8FF),emissiveIntensity:.18,envMap:DX.env,envMapIntensity:1.6})},
 p_ouro:{base:0xFFC83A,mk:()=>new THREE.MeshStandardMaterial({vertexColors:true,roughness:.18,metalness:1,envMap:DX.env,envMapIntensity:1.6})},
 p_lava:{base:0x3A0E08,mk:()=>new THREE.MeshStandardMaterial({vertexColors:true,roughness:.7,metalness:.1,emissive:new THREE.Color(0xFF4A1A),emissiveIntensity:.5}),an:(m,t)=>m.emissiveIntensity=.25+.5*(.5+.5*Math.sin(t*2.3))},
 p_arco:{base:0xFFFFFF,mk:()=>new THREE.MeshStandardMaterial({vertexColors:true,roughness:.2,metalness:.35,envMap:DX.env,envMapIntensity:1.2}),an:(m,t)=>m.color.setHSL((t*.12)%1,.85,.55)},
 p_galaxia:{base:0x3A1A8A,mk:()=>new THREE.MeshPhysicalMaterial({vertexColors:true,roughness:.15,metalness:.6,iridescence:1,iridescenceIOR:1.6,clearcoat:1,envMap:DX.env,envMapIntensity:1.6,emissive:new THREE.Color(0x2A0A5A),emissiveIntensity:.4})}};
const pmat=id=>PMAT[id]||(PMAT[id]=PAINT[id].mk());
on('visuals',()=>{for(const id in PMAT){const P2=PAINT[id];if(P2.an)P2.an(PMAT[id],DX.t)}});
/* qual visual vale para quem: humano local na corrida, palco da garagem e prévia da loja */
const L={on:false,prev:null};DX.loja=L;
const loadFor=ci=>{if(DX.prevLoad)return DX.prevLoad;if(!(ci>=0&&ci<4)||mode==='online')return null;if(DX.curHuman)return eqOf(ci);if(state==='menu'&&window.RMENU&&RMENU.scr==='garage')return eqOf(ci);return null};
{const _vb=vehBody;vehBody=function(g,col,v){const ld=loadFor(cols.indexOf(col)),p=ld&&ld.pintura&&PAINT[ld.pintura]?ld.pintura:null;const ch=_vb(g,p?PAINT[p].base:col,v);
 if(p)ch.traverse(o=>{if(o.isMesh&&o.userData.dxb==='paint')o.material=pmat(p)});return ch}}

/* ---------- ACESSÓRIOS na cabeça ---------- */
const HAT={
 c_festa:K=>{K.cone(.55,1.4,P(0xFF4D9A),0,.7,0,null,null,16);for(let i=0;i<3;i++)K.tor(.48-i*.14,.06,P(0xFFD43B),0,.25+i*.38,0,[PI/2,0,0]);K.ball(.2,P(0x2E9BFF),0,1.45,0)},
 c_gato:K=>{for(const s of[-1,1]){K.cone(.36,.75,Sf(0x2A2A30),s*.48,.25,0,[0,0,-s*.3],[1,1,.5],8);K.cone(.22,.5,Sf(0xFF9AC8),s*.48,.22,.06,[0,0,-s*.3],[1,1,.4],8)}K.tor(.62,.06,P(0x2A2A30),0,-.05,0,[0,0,0],PI,null,16)},
 c_helice:K=>{K.half(.66,P(0xFF3B30),0,-.12,0,[1,.7,1]);K.half(.67,P(0x2E9BFF),0,-.12,0,[1,.7,1],[0,PI/2,0]);K.box(.9,.06,.5,P(0xFFD43B),0,-.1,.62);K.cyl(.05,.05,.3,Mt(0xD5DAE2),0,.4,0);
  const H=K.sub('helice',0,.56,0);H.box(1.5,.04,.22,P(0xFFD43B),0,0,0,[0,0,.12]);H.box(1.5,.04,.22,P(0x34C759),0,0,0,[0,PI/2,-.12]);H.ball(.09,P(0xFF3B30),0,.04,0)},
 c_chifres:K=>{for(const s of[-1,1]){K.limb([s*.38,-.1,0],[s*.52,.25,0],.16,P(0xE8202A));K.cone(.14,.4,P(0xE8202A),s*.6,.5,0,[0,0,-s*.5],null,8)}},
 c_aureola:K=>{K.tor(.5,.07,Gw(0xFFE680),0,.55,0,[PI/2,0,0],0,null,24);K.tor(.5,.2,Ha(0xFFD43B),0,.55,0,[PI/2,0,0],0,null,24)},
 c_viking:K=>{K.half(.72,Mt(0xB8C0CC),0,-.15,0,[1,.85,1]);K.tor(.7,.08,Mt(0xC9A84A),0,-.12,0,[PI/2,0,0]);K.box(.12,.6,.1,Mt(0xC9A84A),0,.15,.66,[-.3,0,0]);
  for(const s of[-1,1]){K.limb([s*.62,.1,0],[s*1.0,.45,0],.13,Sf(0xF4EEDF));K.limb([s*1.0,.45,0],[s*1.05,.9,0],.09,Sf(0xF4EEDF))}},
 c_coroa:K=>{K.cyl(.55,.5,.4,Mt(0xFFC83A),0,.05,0,null,null,16);for(let i=0;i<6;i++){const a=i/6*PI*2;K.cone(.14,.4,Mt(0xFFC83A),Math.cos(a)*.5,.42,Math.sin(a)*.5,null,null,6);K.ball(.07,Gw(i%2?0xFF3B30:0x2E9BFF),Math.cos(a)*.56,.1,Math.sin(a)*.56)}},
 c_pirata:K=>{K.lathe([[.5,0],[.48,.3],[.3,.42],[0,.45]],P(0x1A1A20),0,-.05,0);K.ext([[-.95,0],[0,.15],[.95,0],[.7,.45],[0,.6],[-.7,.45]],.08,P(0x1A1A20),0,-.06,.45,[-.3,0,0]);K.ball(.12,P(0xF4F0E2),0,.3,.48,[1,1,.4])},
 c_cartola:K=>{K.cyl(.75,.75,.06,Mt(0xFFC83A),0,0,0,null,null,20);K.cyl(.48,.45,.9,Mt(0xFFC83A),0,.48,0,null,null,20);K.cyl(.5,.5,.16,P(0x14141C),0,.15,0,null,null,20);K.lowball(.12,Gw(0xFFFFFF),.2,.75,.42)}};
const _bx=new THREE.Box3(),_m4=new THREE.Matrix4(),_inv=new THREE.Matrix4();
function poeChapeu(rig,id,hp){if(!rig||!HAT[id])return null;const H=rig.p.head;if(!H)return null;
 if(rig.p.hat)rig.p.hat.visible=false;let top=rig.g;while(top.parent)top=top.parent;top.updateMatrixWorld(true);const inv=_inv.copy(H.matrixWorld).invert(),bb=new THREE.Box3();
 H.traverse(o=>{if(!o.isMesh||!o.visible||o.userData.dxb==='halo'||o.userData.dxb==='glass')return;let v=o,ok=true;while(v&&v!==H){if(!v.visible)ok=false;v=v.parent}if(!ok)return;if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();
  _bx.copy(o.geometry.boundingBox).applyMatrix4(_m4.copy(inv).multiply(o.matrixWorld));bb.union(_bx)});
 if(bb.isEmpty())bb.set(new THREE.Vector3(-.8,-.6,-.8),new THREE.Vector3(.8,1.4,.8));const K=DX.kit();HAT[id](K);const g=K.build();g.position.set((bb.min.x+bb.max.x)/2,bb.max.y-.12,(bb.min.z+bb.max.z)/2);g.scale.setScalar(clamp((bb.max.x-bb.min.x)/1.5,.8,1.6));g.userData.dxHat=id;H.add(g);
 if(hp)hp.push(g.userData.parts.helice);return g}
const HELICES=[];on('visuals',dt=>{for(let i=HELICES.length-1;i>=0;i--){const h=HELICES[i];if(!h||!h.parent){HELICES.splice(i,1);continue}h.rotation.y+=dt*(6+(h.userData.sp||0)*.4)}});

/* ---------- RASTROS ---------- */
const TR={
 r_bolhas:(x,y,z,bx,bz)=>DX.smoke({x:x+(Math.random()-.5),y:y+.6,z:z+(Math.random()-.5),vx:bx*3+(Math.random()-.5)*2,vy:2+Math.random()*2,vz:bz*3+(Math.random()-.5)*2,life:1.2,s0:.5,s1:.9,col:0xDFF8FF,a:.55,g:-1,d:1.5}),
 r_fogo:(x,y,z,bx,bz)=>DX.spark({x,y:y+.8,z,vx:bx*6+(Math.random()-.5)*3,vy:1+Math.random()*2,vz:bz*6+(Math.random()-.5)*3,life:.45,s0:1.4,s1:.2,col:Math.random()<.5?0xFF7A1A:0xFFD43B,g:-3,d:2}),
 r_coracao:(x,y,z,bx,bz)=>DX.spark({x:x+(Math.random()-.5)*1.4,y:y+.8+Math.random(),z:z+(Math.random()-.5)*1.4,vx:bx*2,vy:.5+Math.random(),vz:bz*2,life:.9,s0:.7,s1:.1,col:Math.random()<.5?0xFF6FB8:0xFFB8E0,g:-1,d:1}),
 r_estrelas:(x,y,z,bx,bz)=>DX.spark({x:x+(Math.random()-.5)*2,y:y+.6+Math.random()*1.5,z:z+(Math.random()-.5)*2,vx:bx*2,vy:.4,vz:bz*2,life:.8,s0:.9,s1:0,col:0xFFE14A,g:0,d:2}),
 r_arco:(x,y,z,bx,bz)=>{const t=DX.t;for(let i=0;i<2;i++)DX.smoke({x,y:y+.7,z,vx:bx*4,vy:.3,vz:bz*4,life:.8,s0:1,s1:1.6,col:new THREE.Color().setHSL((t*.5+i*.2)%1,.9,.6).getHex(),a:.75,d:1.5})},
 r_raios:(x,y,z,bx,bz)=>DX.spark({x:x+(Math.random()-.5)*2,y:y+.5+Math.random(),z:z+(Math.random()-.5)*2,vx:(Math.random()-.5)*10,vy:(Math.random()-.5)*6,vz:(Math.random()-.5)*10,life:.18,s0:.6,s1:.1,col:Math.random()<.5?0x9FF4FF:0xFFFFFF,g:0,d:0}),
 r_moedas:(x,y,z,bx,bz)=>DX.spark({x,y:y+1,z,vx:bx*4+(Math.random()-.5)*3,vy:4+Math.random()*3,vz:bz*4+(Math.random()-.5)*3,life:.7,s0:.8,s1:.5,col:0xFFC21A,g:18,d:.5})};
on('kart',(k,inp,dt)=>{const id=k.loja&&k.loja.rastro;if(!id||!TR[id]||k.fallT>0||k.air)return;const sp=Math.abs(k.v);if(sp<20)return;k.trA=(k.trA||0)+dt*(14+sp*.3);
 const bx=-Math.sin(k.mh),bz=-Math.cos(k.mh);while(k.trA>=1){k.trA--;TR[id](k.x+bx*3,k.y,k.z+bz*3,bx,bz)}});

/* ---------- GADGETS ---------- */
const GX={fx:[]};const snd=(f,d,tp,v)=>{try{sfx(f,d,tp,v)}catch(e){}};
const frente=(k,max,cone)=>{let best=null,bd=1e9;for(const o of karts){if(o===k||o.fallT>0)continue;const dx=o.x-k.x,dz=o.z-k.z,d=Math.hypot(dx,dz);if(d>max)continue;const a=Math.abs(wrap(Math.atan2(dx,dz)-k.h));if(a<cone&&d<bd){bd=d;best=o}}return best};
const GAD={
 g_buzina:{use(k){snd(220,.35,'sawtooth',.09);snd(165,.4,'square',.06);let n=0;for(const o of karts){if(o===k)continue;const dx=o.x-k.x,dz=o.z-k.z,d=Math.hypot(dx,dz);if(d<30&&Math.abs(wrap(Math.atan2(dx,dz)-k.h))<.9){o.gSusto=.7;if(o.dx)o.dx.hit=Math.max(o.dx.hit,.5);say(o,'📯 FOOOM! QUE SUSTO!','#FFD43B');n++}}
  for(let i=0;i<14;i++){const a=k.h+(Math.random()-.5)*.8;DX.smoke({x:k.x+Math.sin(k.h)*3,y:k.y+2,z:k.z+Math.cos(k.h)*3,vx:Math.sin(a)*14,vy:1,vz:Math.cos(a)*14,life:.5,s0:.6,s1:2.6,col:0xFFF2C0,a:.45,d:3})}return n?'📯 '+n+' ASSUSTADO'+(n>1?'S':'')+'!':'📯 FOOOM!'}},
 g_luva:{use(k){let alvo=null,bd=9;for(const o of karts){if(o===k||o.fallT>0)continue;const d=Math.hypot(o.x-k.x,o.z-k.z);if(d<bd&&Math.abs(o.y-k.y)<3){bd=d;alvo=o}}
  const rx=Math.cos(k.h),rz=-Math.sin(k.h),s=alvo?Math.sign((alvo.x-k.x)*rx+(alvo.z-k.z)*rz)||1:1;
  const K=DX.kit();K.ball(.9,P(0xE8202A),0,0,0,[1,1,1.2]);K.ball(.45,P(0xE8202A),.3,.2,.5);K.cyl(.5,.5,.6,P(0xFFFFFF),0,0,-1,[PI/2,0,0]);K.limb([0,0,-1.2],[0,0,-3.4],.12,Mt(0xD5DAE2));const g=K.build();g.rotation.y=-s*PI/2;g.position.set(s*1.6,1.5,0);k.g.add(g);GX.fx.push({t:.45,tp:'luva',g,k,s});snd(140,.15,'square',.08);
  if(alvo){alvo.bx=(alvo.bx||0)+rx*s*24;alvo.bz=(alvo.bz||0)+rz*s*24;alvo.v*=.92;if(alvo.dx){alvo.dx.hit=1;alvo.dx.rollV+=s*10}rumble(alvo,.6);say(alvo,'🥊 LEVOU UMA LUVADA!','#FF6B6B');
   DX.burst('spark',(k.x+alvo.x)/2,k.y+1.5,(k.z+alvo.z)/2,16,{sp:8,up:5,col:[0xFFFFFF,0xFFD43B],s0:.5,s1:.05,life:.4});return '🥊 POW! EM '+alvo.name+'!'}return '🥊 SOCO NO AR!'}},
 g_oleo:{use(k){if(ITEMS.oleo){ITEMS.oleo.use(k);return null}return '🛢️'}},
 g_gancho:{use(k){const o=frente(k,45,.5);if(!o)return '⛓️ NINGUÉM NA FRENTE...';const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),ln=new THREE.Line(geo,new THREE.LineBasicMaterial({color:0xC9CED6}));scene.add(ln);
  GX.fx.push({t:.8,tp:'gancho',ln,k,o});k.boost=Math.max(k.boost,.8);o.v*=.85;say(o,'⛓️ '+k.name+' TE ENGANCHOU!','#FFB27A');snd(520,.12,'square',.06);setTimeout(()=>snd(300,.2,'sawtooth',.06),120);return '⛓️ ENGANCHOU '+o.name+'!'}},
 g_rede:{use(k){const K=DX.kit();K.tor(2.2,.12,Sf(0x8A5A2E),0,0,0,[PI/2,0,0],0,null,20);for(let i=-3;i<=3;i++){K.box(4.2,.05,.05,Sf(0xE8DCC0),0,0,i*.6);K.box(.05,.05,4.2,Sf(0xE8DCC0),i*.6,0,0)}for(let i=0;i<6;i++){const a=i/6*PI*2;K.ball(.18,P(0xFF6B22),Math.cos(a)*2.2,0,Math.sin(a)*2.2)}
  const g=K.build({noShadow:true});scene.add(g);GX.fx.push({t:0,tp:'rede',g,k,x:k.x+Math.sin(k.h)*4,z:k.z+Math.cos(k.h)*4,y:k.y+2.5,vx:Math.sin(k.h)*(Math.abs(k.v)+38),vz:Math.cos(k.h)*(Math.abs(k.v)+38),vy:10});snd(400,.2,'triangle',.06);return '🎣 REDE LANÇADA!'}}};
DX.GAD=GAD;
function usaGadget(k){if(!k.gadId||!GAD[k.gadId]||k.gadN<=0||k.fallT>0||state!=='go')return;k.gadN--;const msg=GAD[k.gadId].use(k);if(msg&&k.human)say(k,msg,'#FFD43B');if(k.human)LR.gad++;}
on('update',dt=>{for(let i=GX.fx.length-1;i>=0;i--){const f=GX.fx[i];f.t+=f.tp==='rede'?dt:-dt;let fim=false;
 if(f.tp==='luva'){const u=Math.max(0,f.t)/.45;f.g.position.x=f.s*(1.6+Math.sin((1-u)*PI)*3.2);if(f.t<=0){f.k.g.remove(f.g);fim=true}}
 else if(f.tp==='gancho'){const p=f.ln.geometry.attributes.position;p.setXYZ(0,f.k.x,f.k.y+2,f.k.z);p.setXYZ(1,f.o.x,f.o.y+2,f.o.z);p.needsUpdate=true;if(f.t<=0){scene.remove(f.ln);fim=true}}
 else if(f.tp==='rede'){if(!f.preso){f.vy-=26*dt;f.x+=f.vx*dt;f.z+=f.vz*dt;f.y+=f.vy*dt;f.g.position.set(f.x,f.y,f.z);f.g.rotation.y+=dt*6;
   for(const o of karts){if(o===f.k||o.fallT>0)continue;if(Math.hypot(o.x-f.x,o.z-f.z)<4.2&&Math.abs(o.y+2-f.y)<4){f.preso=o;f.t=0;o.v*=.6;o.gRede=1.6;if(o.dx)o.dx.hit=1;say(o,'🎣 PESCADO POR '+f.k.name+'!','#FF6B6B');rumble(o,.7);if(f.k.human){say(f.k,'🎣 PESCOU '+o.name+'!','#47D7A0');LR.pesc++}break}}
   const gy=window.PISTAS?PISTAS.hAt(f.k.fi,0):0;if(!f.preso&&(f.y<gy-1||f.t>1.6)){scene.remove(f.g);fim=true}}
  else{const o=f.preso;f.g.position.set(o.x,o.y+3.2,o.z);f.g.rotation.set(0,DX.t*.5,0);f.g.scale.setScalar(1.3);if(f.t>1.6){scene.remove(f.g);fim=true}}}
 if(fim)GX.fx.splice(i,1)}
 for(const k of karts){if(k.gSusto>0)k.gSusto=Math.max(0,k.gSusto-dt);if(k.gRede>0){k.gRede=Math.max(0,k.gRede-dt);k.v=Math.min(k.v,40*(DX.SPD||1))}}});
/* susto: o volante treme um pouco */
on('kart',(k,inp,dt)=>{if(k.gSusto>0)k.h+=Math.sin(DX.t*38)*.9*dt;
 /* recarrega o gadget a cada volta nova */
 const lap=Math.floor(k.prog/N);if(lap>(k.gadLap==null?0:k.gadLap)){k.gadLap=lap;k.gadN=1}
 /* robôs também usam (com calma) */
 if(!k.human&&k.gadId&&k.gadN>0&&state==='go'&&Math.random()<dt*.25){const o=frente(k,k.gadId==='g_luva'?8:28,k.gadId==='g_luva'?PI:.6);if(o||k.gadId==='g_oleo')usaGadget(k)}});

/* ---------- entrada: Q (P1), Ctrl direito ou ponto (P2), botão Y do controle ---------- */
{const _hi=humanInput;humanInput=function(k){const r=_hi(k);if(k.ctrl==='phone'||!k.gadId)return r;const hi=humans.indexOf(k),one=humans.length===1;let g=false;
 if(one||hi===0)g=g||!!keys.KeyQ;if(one||hi===1)g=g||!!keys.ControlRight||!!keys.Period;
 const ps=pads(),p=humans.length>=3?(typeof padFor==='function'?padFor(hi):null):(one?ps[0]:(hi===1?ps[0]:ps[1]));
 if(p&&p.buttons[3]&&p.buttons[3].pressed){g=true;if(!(p.buttons[2]&&p.buttons[2].pressed)&&!(keys.Space&&(one||hi===0))&&!((keys.Enter||keys.NumpadEnter)&&(one||hi===1)))r.item=false}
 if(g&&!k.gadHeld)usaGadget(k);k.gadHeld=g;return r}}

/* ---------- na largada: visual e gadget de cada kart ---------- */
{const _nk=newKart;newKart=function(slot,o){DX.curHuman=!!(o.human&&o.ctrl==='local');const k=_nk(slot,o);const ld=DX.curHuman?eqOf(o.ci):null;DX.curHuman=false;
 k.loja=ld;k.gadId=ld?(ld.gadget||'g_buzina'):(o.human?null:['g_buzina','g_luva','g_oleo'][Math.floor(Math.random()*3)]);k.gadN=1;k.gadLap=0;
 if(ld&&ld.chapeu){const rig=k.dx&&k.dx.pil&&k.dx.pil.userData.rig;const h=poeChapeu(rig,ld.chapeu,HELICES);if(h&&h.userData.parts.helice)k.helice=h.userData.parts.helice}return k}}
on('visuals',()=>{for(const k of karts)if(k.helice)k.helice.userData.sp=Math.abs(k.v)});
on('start',()=>{GX.fx.forEach(f=>{if(f.g&&f.g.parent)f.g.parent.remove(f.g);if(f.ln)scene.remove(f.ln)});GX.fx.length=0;LR.reset()});

/* ---------- HUD: casa do gadget ---------- */
{const s=document.createElement('style');s.textContent=`.dxg{position:relative;flex:none;width:7.6vh;height:7.6vh;border-radius:50%;margin-bottom:1vh;background:rgba(16,24,46,.86);border:.35vh solid #FFD43B;display:flex;align-items:center;justify-content:center;font-size:3.8vh;box-shadow:0 0 2vh rgba(255,212,59,.5);transition:filter .2s,opacity .2s}
.dxg.off{filter:grayscale(1);opacity:.45;box-shadow:none;border-color:rgba(255,255,255,.3)}.dxg i{position:absolute;bottom:-1.2vh;left:50%;transform:translateX(-50%);font-style:normal;font-family:Oxanium,sans-serif;font-weight:800;font-size:1.1vh;color:#2A1A55;background:#FFD43B;border-radius:.5vh;padding:0 .5vw;white-space:nowrap}
.dxg.off i{display:none}body.dxN .dxg{width:5.2vh;height:5.2vh;font-size:2.6vh;margin:0}body.dxN .dxg.off{display:none}body.dxN .dxg i{font-size:.9vh;bottom:-.9vh}`;document.head.appendChild(s)}
const tg=k=>{if(k.ctrl==='phone')return'';const hi=humans.indexOf(k),np=pads().length;if(np&&(humans.length===1||hi<np))return'Y';return humans.length===1||hi===0?'Q':hi===1?'CTRL':''};
on('hudbuild',(k,el)=>{if(!k.gadId)return;const d=document.createElement('div');d.className='dxg';d.innerHTML=(ITH[k.gadId]||{}).ico+'<i>'+tg(k)+'</i>';el.querySelector('.bl').appendChild(d);k.gadEl=d});
on('hud',()=>{for(const k of humans)if(k.gadEl)k.gadEl.classList.toggle('off',!(k.gadN>0))});

/* ---------- placar da corrida (só humanos) e recompensas ---------- */
const LR={reset(){this.moedas=0;this.drift3=0;this.acertos=0;this.gad=0;this.manobras=0;this.quedas=0;this.pesc=0}};LR.reset();
on('kart',k=>{if(!k.human)return;const c=k.coins||0;if(c>(k.lrC||0))LR.moedas+=c-(k.lrC||0);k.lrC=c});
on('driftboost',(k,lv)=>{if(k.human&&lv>=3)LR.drift3++});
on('hit',(k,o)=>{const s=o&&o.src;if(s&&s!==k&&s.human)LR.acertos++});
on('fall',k=>{if(k.human)LR.quedas++});
on('kart',k=>{if(!k.human)return;if(k.trick&&!k.lrTr)LR.manobras++;k.lrTr=!!k.trick});
let ULT=null;
on('finish',(rank,info)=>{if(!humans.length)return;diaNovo();const hs=rank.filter(k=>k.human),best=hs[0],pos=rank.indexOf(best);
 const r={co:0,xp:0,ge:0,lin:[],trof:[]};const add=(t,co,xp)=>{if(co||xp)r.lin.push([t,co,xp]);r.co+=co;r.xp+=xp};
 add('Corrida concluída',20,60);add((pos+1)+'º lugar',[70,45,30,18,12,10][pos]||8,[50,35,25,15,10,5][pos]||5);
 if(LR.moedas)add('Moedas da pista ×'+LR.moedas,LR.moedas*2,0);if(LR.acertos)add('Acertos com itens ×'+LR.acertos,LR.acertos*6,LR.acertos*5);if(LR.drift3)add('Turbos roxos ×'+LR.drift3,Math.min(30,LR.drift3*5),LR.drift3*5);
 if(pos===0&&C.vitDia!==hoje()){C.vitDia=hoje();add('1ª vitória do dia (bônus)',100,100)}
 addSt('corr',1);if(pos<3)addSt('podio',1);if(pos===0){addSt('vit',1);addSt('v_'+(ST.id||''),1);if(!LR.quedas)addSt('limpa',1)}
 ['moedas','drift3','acertos','manobras','quedas'].forEach(k=>{if(LR[k])addSt(k,LR[k])});if(LR.gad)addSt('gadgets',LR.gad);if(LR.pesc)addSt('pescados',LR.pesc);
 C.st.itens=Object.keys(C.own).filter(id=>ITH[id]&&ITH[id].so!=='gratis').length;
 const t0=tierOf(C.passe.xp);C.co+=r.co;C.passe.xp+=r.xp;r.tier=[t0,tierOf(C.passe.xp)];
 TROF.forEach(t=>{if(!C.trof[t.id]&&(C.st[t.k]||0)>=t.g){C.trof[t.id]={ok:true,pego:false};r.trof.push(t)}});
 salva();ULT=r;mostraRecompensa(r)});

/* ---------- interface ---------- */
const css=document.createElement('style');css.textContent=`
#dxBar{position:absolute;right:2.4vw;top:2.4vh;display:flex;gap:.8vw;align-items:center;z-index:3;font-family:Oxanium,sans-serif}
#dxBar .w{display:flex;gap:.6vw;background:rgba(16,10,50,.82);border:.25vh solid rgba(255,255,255,.25);border-radius:99px;padding:.6vh 1.2vw;font-weight:800;font-size:2.1vh;color:#fff}
#dxBar .w b{color:#FFD43B}#dxBar .w b.g{color:#7CE8FF}
#dxBar .bt{position:relative;cursor:pointer;background:linear-gradient(180deg,#FFB052,#FF6B22);border:.3vh solid #FFD43B;border-radius:1.4vh;padding:.7vh 1.1vw;font-family:Bungee,'Arial Black',sans-serif;font-size:1.9vh;color:#fff;-webkit-text-stroke:.1vh #2A1A55;text-shadow:0 .3vh 0 #2A1A55;box-shadow:0 .5vh 0 #95330B;transition:transform .15s}
#dxBar .bt:hover{transform:translateY(-.3vh) scale(1.04)}#dxBar .bt.b2{background:linear-gradient(180deg,#9B6BFF,#5B2A9A);border-color:#D9B8FF;box-shadow:0 .5vh 0 #2A1460}#dxBar .bt.b3{background:linear-gradient(180deg,#5FE08A,#11A86B);border-color:#C8FFD8;box-shadow:0 .5vh 0 #0B6A42}
#dxBar .bt em{position:absolute;right:-.6vh;top:-.9vh;min-width:2.4vh;height:2.4vh;border-radius:99px;background:#FF3B30;color:#fff;font-style:normal;font-family:Oxanium,sans-serif;font-size:1.3vh;display:flex;align-items:center;justify-content:center;-webkit-text-stroke:0;text-shadow:none;padding:0 .4vh;border:.2vh solid #fff}
#dxBar kbd{font-size:1.1vh;min-width:2.2vh;height:2.2vh;margin-left:.4vw;vertical-align:middle}
#dxLoja{position:fixed;inset:0;z-index:60;display:none;font-family:Inter,'Segoe UI',sans-serif;color:#fff}
#dxLoja.on{display:block;animation:ljIn .25s ease}@keyframes ljIn{from{opacity:0;transform:scale(1.03)}}
#dxLoja .top{position:absolute;left:0;right:0;top:0;height:11vh;display:flex;align-items:center;gap:1.6vw;padding:0 2.4vw;background:linear-gradient(180deg,rgba(26,16,70,.98),rgba(26,16,70,.9));border-bottom:.35vh solid #FF6B22}
#dxLoja h1{font-family:Bungee,'Arial Black',sans-serif;font-weight:400;font-size:4vh;-webkit-text-stroke:.15vh #2A1A55;text-shadow:0 .4vh 0 #2A1A55;color:#FFD43B;white-space:nowrap}
#dxLoja .tabs{display:flex;gap:.5vw;flex:1}
#dxLoja .tab{cursor:pointer;padding:.9vh 1.1vw;border-radius:1.2vh;font-family:Oxanium,sans-serif;font-weight:800;font-size:1.8vh;letter-spacing:.06em;background:rgba(255,255,255,.07);border:.25vh solid transparent;white-space:nowrap;position:relative}
#dxLoja .tab.on{background:#FF6B22;border-color:#FFD43B;box-shadow:0 .4vh 0 #95330B}#dxLoja .tab em{position:absolute;right:-.5vh;top:-.7vh;background:#FF3B30;border-radius:99px;font-style:normal;font-size:1.1vh;padding:0 .5vh;border:.2vh solid #fff}
#dxLoja .bal{display:flex;gap:.8vw;font-family:Oxanium,sans-serif;font-weight:800;font-size:2.2vh}#dxLoja .bal span{background:rgba(0,0,0,.35);padding:.5vh 1vw;border-radius:99px}
#dxLoja .bal .g{cursor:pointer}#dxLoja .bal .g:hover{background:rgba(124,232,255,.25)}
#dxLoja .x{cursor:pointer;font-family:Oxanium,sans-serif;font-weight:800;font-size:1.7vh;padding:.8vh 1vw;border-radius:1vh;background:rgba(255,255,255,.1)}
#dxLoja .body{position:absolute;left:0;right:0;top:11vh;bottom:0;display:flex}
#dxLoja .main{flex:1;min-width:0;overflow-y:auto;padding:2vh 2vw 4vh;background:linear-gradient(180deg,rgba(14,10,44,.97),rgba(20,14,60,.97))}
#dxLoja .side{width:34vw;flex:none;display:flex;flex-direction:column;background:linear-gradient(180deg,rgba(30,20,80,.25),rgba(10,8,30,.7));border-left:.3vh solid rgba(255,255,255,.12)}
#dxLoja #ljPrev{flex:1;min-height:0}
#dxLoja .info{padding:1.6vh 1.6vw 2.4vh;background:rgba(14,10,44,.95)}#dxLoja .info h2{font-family:Bungee,'Arial Black',sans-serif;font-weight:400;font-size:2.8vh;color:#fff;margin:0;letter-spacing:.02em}#dxLoja .info p{color:#C9D3F5;font-size:1.7vh;margin:.6vh 0 1.2vh}
#dxLoja .rar{display:inline-block;font-family:Oxanium,sans-serif;font-weight:800;font-size:1.3vh;letter-spacing:.14em;padding:.2vh .7vw;border-radius:.5vh;background:var(--rc);color:#10182E;margin-bottom:.6vh}
#dxLoja .slots{display:flex;gap:.5vw;align-items:center;margin-bottom:1.6vh;font-family:Oxanium,sans-serif;font-weight:800;font-size:1.6vh;color:#C9D3F5;flex-wrap:wrap}
#dxLoja .slots b{cursor:pointer;padding:.5vh 1vw;border-radius:99px;border:.25vh solid var(--c);color:#fff}#dxLoja .slots b.on{background:var(--c)}
#dxLoja .cats{display:flex;gap:.6vw;margin-bottom:1.6vh}#dxLoja .cat{cursor:pointer;padding:.7vh 1vw;border-radius:99px;background:rgba(255,255,255,.08);font-family:Oxanium,sans-serif;font-weight:800;font-size:1.6vh}#dxLoja .cat.on{background:#2E9BFF}
#dxLoja .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(15vh,1fr));gap:1.2vh}
#dxLoja .ljc{position:relative;cursor:pointer;border-radius:1.6vh;padding:1.2vh .8vw 1vh;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03));border:.3vh solid rgba(255,255,255,.12);display:flex;flex-direction:column;align-items:center;gap:.6vh;transition:transform .12s,border-color .12s}
#dxLoja .ljc:hover,#dxLoja .ljc.f{transform:translateY(-.4vh);border-color:#FFD43B}#dxLoja .ljc.sel{border-color:#FFD43B;box-shadow:0 0 2.4vh rgba(255,212,59,.45)}
#dxLoja .ljc::before{content:'';position:absolute;left:0;right:0;top:0;height:.6vh;border-radius:1.6vh 1.6vh 0 0;background:var(--rc)}
#dxLoja .ljc .ic{width:8vh;height:8vh;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:4.4vh;background:radial-gradient(circle,rgba(255,255,255,.15),transparent 70%)}
#dxLoja .ljc .sw{width:7.4vh;height:7.4vh;border-radius:1.6vh;box-shadow:inset 0 -.8vh 1.4vh rgba(0,0,0,.35),0 .5vh 1.2vh rgba(0,0,0,.4)}
#dxLoja .ljc .nm{font-family:Oxanium,sans-serif;font-weight:800;font-size:1.55vh;text-align:center;line-height:1.15}
#dxLoja .ljc .pr{font-family:Oxanium,sans-serif;font-weight:800;font-size:1.4vh;color:#FFD43B;text-align:center}#dxLoja .ljc .pr u{text-decoration:none;color:#7CE8FF}
#dxLoja .ljc .st{font-family:Oxanium,sans-serif;font-weight:800;font-size:1.3vh;padding:.2vh .7vw;border-radius:99px;background:#11A86B}#dxLoja .ljc .st.eq{background:#FF6B22}#dxLoja .ljc .st.lk{background:#5B2A9A}
#dxLoja .acts{display:flex;gap:.6vw;flex-wrap:wrap}
#dxLoja .btn{cursor:pointer;flex:1;min-width:10vw;text-align:center;padding:1.2vh 1vw;border-radius:1.2vh;font-family:Oxanium,sans-serif;font-weight:800;font-size:1.9vh;background:#11A86B;box-shadow:0 .5vh 0 #0B6A42;border:.25vh solid rgba(255,255,255,.35)}
#dxLoja .btn.co{background:linear-gradient(180deg,#FFD43B,#E0A800);color:#3A2A00;box-shadow:0 .5vh 0 #8A6A00}#dxLoja .btn.ge{background:linear-gradient(180deg,#7CE8FF,#2E9BFF);color:#062A50;box-shadow:0 .5vh 0 #0D3A86}
#dxLoja .btn.no{opacity:.4;cursor:not-allowed}#dxLoja .btn.big{font-size:2.3vh;padding:1.6vh 1vw}#dxLoja .btn.f{outline:.4vh solid #FFD43B;outline-offset:.3vh}
#dxLoja .sec{font-family:Bungee,'Arial Black',sans-serif;font-weight:400;font-size:2.4vh;margin:1vh 0 1.4vh;color:#FFD43B}
#dxLoja .pass-h{display:flex;align-items:center;gap:2vw;margin-bottom:2vh;flex-wrap:wrap}
#dxLoja .lvl{font-family:Bungee,'Arial Black',sans-serif;font-size:6vh;line-height:1;color:#fff;-webkit-text-stroke:.2vh #2A1A55;text-shadow:0 .5vh 0 #2A1A55}
#dxLoja .pbar{flex:1;min-width:20vw}#dxLoja .pbar .b{height:2vh;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden}#dxLoja .pbar .b i{display:block;height:100%;background:linear-gradient(90deg,#FFD43B,#FF6B22)}
#dxLoja .pbar small{display:block;font-family:Oxanium,sans-serif;font-weight:800;font-size:1.5vh;color:#C9D3F5;margin-top:.6vh}
#dxLoja .trk{display:flex;gap:.8vw;overflow-x:auto;padding:1vh .2vw 2vh}
#dxLoja .tier{flex:none;width:12vh;display:flex;flex-direction:column;gap:.8vh;align-items:stretch}
#dxLoja .tier .n{text-align:center;font-family:Bungee,'Arial Black',sans-serif;font-size:1.8vh;color:#C9D3F5}#dxLoja .tier.ok .n{color:#FFD43B}
#dxLoja .rw{position:relative;height:13vh;border-radius:1.4vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4vh;background:rgba(255,255,255,.06);border:.25vh solid rgba(255,255,255,.14);font-family:Oxanium,sans-serif;font-weight:800;font-size:1.3vh;text-align:center;padding:.4vh}
#dxLoja .rw.prem{background:linear-gradient(180deg,rgba(255,176,32,.2),rgba(180,107,255,.18));border-color:rgba(255,212,59,.4)}#dxLoja .rw .e{font-size:3.6vh}#dxLoja .rw .sw{width:4.4vh;height:4.4vh;border-radius:1vh}
#dxLoja .rw.lk::after{content:'🔒';position:absolute;right:.4vh;top:.2vh;font-size:1.6vh}#dxLoja .rw.got{opacity:.45}#dxLoja .rw.got::after{content:'✔';position:absolute;right:.5vh;top:.2vh;color:#47D7A0;font-size:1.8vh}
#dxLoja .rw.can{border-color:#47D7A0;box-shadow:0 0 1.8vh rgba(71,215,160,.6);cursor:pointer;animation:ljP .8s infinite alternate}@keyframes ljP{to{box-shadow:0 0 3vh rgba(71,215,160,.9)}}
#dxLoja .lst{display:flex;flex-direction:column;gap:1.2vh}
#dxLoja .row{display:flex;align-items:center;gap:1.4vw;padding:1.4vh 1.4vw;border-radius:1.4vh;background:rgba(255,255,255,.06);border:.25vh solid rgba(255,255,255,.12)}
#dxLoja .row .e{font-size:4vh;flex:none;width:6vh;text-align:center}#dxLoja .row .tx{flex:1;min-width:0}#dxLoja .row .tx b{display:block;font-family:Oxanium,sans-serif;font-weight:800;font-size:2vh}
#dxLoja .row .tx small{color:#C9D3F5;font-size:1.5vh}#dxLoja .row .pb{height:1.2vh;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden;margin-top:.7vh}#dxLoja .row .pb i{display:block;height:100%;background:#47D7A0}
#dxLoja .row .rw2{font-family:Oxanium,sans-serif;font-weight:800;font-size:1.6vh;color:#FFD43B;text-align:right;white-space:nowrap}
#dxLoja .row.ok{border-color:#47D7A0}#dxLoja .row.done{opacity:.5}#dxLoja .row .btn{flex:none;min-width:8vw}
#dxLoja .tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(32vh,1fr));gap:1.2vh}
#dxLoja .packs{display:grid;grid-template-columns:repeat(auto-fill,minmax(22vh,1fr));gap:1.6vh}
#dxLoja .pack{position:relative;border-radius:1.8vh;padding:2vh 1vw;text-align:center;background:linear-gradient(180deg,rgba(124,232,255,.18),rgba(46,155,255,.08));border:.3vh solid rgba(124,232,255,.4);display:flex;flex-direction:column;gap:.8vh;align-items:center}
#dxLoja .pack .e{font-size:6vh}#dxLoja .pack b{font-family:Bungee,'Arial Black',sans-serif;font-weight:400;font-size:2.8vh;color:#7CE8FF}#dxLoja .pack small{font-size:1.5vh;color:#C9D3F5}
#dxLoja .pack .top{position:absolute;top:-1.4vh;left:50%;transform:translateX(-50%);background:#FF3B30;padding:.2vh .8vw;border-radius:99px;font-family:Oxanium,sans-serif;font-weight:800;font-size:1.2vh;height:auto;border:0}
#dxLoja .note{margin-top:2vh;padding:1.4vh 1.4vw;border-radius:1.2vh;background:rgba(255,212,59,.1);border:.2vh dashed rgba(255,212,59,.5);color:#FFE7A0;font-size:1.6vh;line-height:1.4}
#dxLoja .toast{position:absolute;left:50%;bottom:4vh;transform:translateX(-50%) translateY(2vh);opacity:0;transition:all .25s;background:rgba(16,10,50,.95);border:.3vh solid #FFD43B;border-radius:99px;padding:1.2vh 2.2vw;font-family:Oxanium,sans-serif;font-weight:800;font-size:2vh;pointer-events:none;white-space:nowrap}
#dxLoja .toast.on{opacity:1;transform:translateX(-50%)}
#dxLoja .mod{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(5,4,20,.7)}#dxLoja .mod.on{display:flex}
#dxLoja .mod>div{width:min(560px,86vw);background:#1B1550;border:.35vh solid #FFD43B;border-radius:2vh;padding:3vh 2.4vw;text-align:center}#dxLoja .mod h3{font-family:Bungee,'Arial Black',sans-serif;font-weight:400;font-size:3vh;margin-bottom:1.4vh}
#dxLoja .mod p{color:#C9D3F5;font-size:1.8vh;line-height:1.45;margin-bottom:2vh}
#dxLoja .kh{position:absolute;left:2vw;bottom:1.2vh;font-family:Oxanium,sans-serif;font-weight:800;font-size:1.4vh;color:#93A3D1;letter-spacing:.08em}
body.dxLoja #sMenu,body.dxLoja #sEnd,body.dxLoja #sLobby,body.dxLoja #rmTv{opacity:0!important;pointer-events:none!important}
/* recompensas no fim da corrida */
#dxRew{margin-top:1.6vh;padding:1.4vh 1.2vw;border-radius:1.6vh;background:rgba(16,10,50,.88);border:.3vh solid #FFD43B;font-family:Oxanium,sans-serif;max-width:100%}
#dxRew .h{display:flex;align-items:center;gap:1.4vw;flex-wrap:wrap}#dxRew .h b{font-family:Bungee,'Arial Black',sans-serif;font-weight:400;font-size:3vh;color:#FFD43B}#dxRew .h b.x{color:#7CE8FF}
#dxRew ul{list-style:none;margin:.8vh 0;columns:2;font-size:1.45vh;color:#C9D3F5}#dxRew li{display:flex;justify-content:space-between;gap:1vw;padding:.15vh 0;break-inside:avoid}#dxRew li span{color:#FFD43B}
#dxRew .t{display:flex;gap:.6vw;flex-wrap:wrap}#dxRew .t i{font-style:normal;font-weight:800;font-size:1.5vh;background:rgba(255,212,59,.18);border:.2vh solid #FFD43B;border-radius:99px;padding:.3vh .8vw;animation:ljIn .4s ease backwards}
#dxRew .pb{height:1.2vh;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden;margin-top:.6vh}#dxRew .pb i{display:block;height:100%;background:linear-gradient(90deg,#FFD43B,#FF6B22);transition:width 1.2s ease}
#dxRew .lo{margin-top:.8vh;font-size:1.4vh;color:#93A3D1}`;document.head.appendChild(css);

const el=document.createElement('div');el.id='dxLoja';el.className='rm';el.innerHTML=`<div class="top"><h1>🛒 LOJA</h1><div class="tabs" id="ljTabs"></div><div class="bal"><span>🪙 <b id="ljCo"></b></span><span class="g" id="ljGe">💎 <b></b> ➕</span></div><div class="x" id="ljX">ESC ✕</div></div>
<div class="body"><div class="main" id="ljMain"></div><div class="side" id="ljSide"><div id="ljPrev"></div><div class="info" id="ljInfo"></div></div></div>
<div class="kh" id="ljKh"></div><div class="toast" id="ljToast"></div><div class="mod" id="ljMod"><div></div></div>`;document.body.appendChild(el);
const bar=document.createElement('div');bar.id='dxBar';const home=document.getElementById('rmHome');if(home)home.appendChild(bar);
const $L=id=>document.getElementById(id);
const ABAS=[['loja','🛒 LOJA'],['passe','🎫 PASSE'],['miss','🎯 MISSÕES'],['trof','🏆 TROFÉUS'],['gemas','💎 GEMAS']];
L.aba='loja';L.cat='pintura';L.slot=0;L.sel=null;
const pend=()=>{diaNovo();const ms=C.miss.l.filter(m=>m.ok&&!m.pego).length+(C.login.pend?1:0),tr=Object.values(C.trof).filter(t=>t.ok&&!t.pego).length,t=tierOf(C.passe.xp);let ps=0;for(let i=0;i<t;i++){if(PASSE[i].f&&!C.passe.f[i])ps++;if(C.passe.prem&&!C.passe.p[i])ps++}return{ms,tr,ps}};
function barra(){const p=pend();bar.innerHTML=`<div class="w">🪙 <b>${fmt(C.co)}</b> 💎 <b class="g">${fmt(C.ge)}</b></div>
 <div class="bt" data-a="loja">🛒 LOJA<kbd>L</kbd></div><div class="bt b2" data-a="passe">🎫 PASSE${p.ps?`<em>${p.ps}</em>`:''}</div><div class="bt b3" data-a="miss">🎯 MISSÕES${p.ms?`<em>${p.ms}</em>`:''}</div><div class="bt b3" data-a="trof">🏆${p.tr?`<em>${p.tr}</em>`:''}</div>`}
bar.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b)abrir(b.dataset.a)});
const toast=t=>{const e=$L('ljToast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),1800);try{sfx(880,.12,'triangle',.06);setTimeout(()=>sfx(1320,.12,'triangle',.05),90)}catch(x){}};
const visRw=r=>{if(!r)return'<span class="e">—</span>';if(r.it){const i=ITH[r.it];return(i.sw?`<span class="sw" style="background:${i.sw}"></span>`:`<span class="e">${i.ico}</span>`)+i.nm}return r.ge?`<span class="e">💎</span>${r.ge}`:`<span class="e">🪙</span>${fmt(r.co)}`};
function ganha(r){if(!r)return;if(r.it)C.own[r.it]=1;if(r.co)C.co+=r.co;if(r.ge)C.ge+=r.ge}
function render(){$L('ljCo').textContent=fmt(C.co);$L('ljGe').querySelector('b').textContent=fmt(C.ge);const p=pend();
 $L('ljTabs').innerHTML=ABAS.map(([id,n])=>`<div class="tab${L.aba===id?' on':''}" data-t="${id}">${n}${id==='passe'&&p.ps?`<em>${p.ps}</em>`:id==='miss'&&p.ms?`<em>${p.ms}</em>`:id==='trof'&&p.tr?`<em>${p.tr}</em>`:''}</div>`).join('');
 const M=$L('ljMain');$L('ljSide').style.display=L.aba==='loja'||L.aba==='passe'?'flex':'none';
 if(L.aba==='loja'){const sl=[0,1,2,3].map(i=>`<b class="${L.slot===i?'on':''}" data-s="${i}" style="--c:${hexc(i)}">P${i+1}</b>`).join('');
  M.innerHTML=`<div class="slots">EQUIPAR EM: ${sl}<span style="margin-left:1vw;font-weight:600">(cada jogador da TV tem o seu visual)</span></div><div class="cats">${Object.entries(TIPOS).map(([t,o])=>`<div class="cat${L.cat===t?' on':''}" data-c="${t}">${o.ico} ${o.n}</div>`).join('')}</div>
  <div class="grid">${IT.filter(i=>i.t===L.cat).map(i=>{const R0=RAR[i.rar],ow=tem(i.id),eq=eqOf(L.slot)[i.t]===i.id;
   return`<div class="ljc lj-f${L.sel===i.id?' sel':''}" data-i="${i.id}" style="--rc:${R0.c}">${i.sw?`<div class="sw" style="background:${i.sw}"></div>`:`<div class="ic">${i.ico}</div>`}<div class="nm">${i.nm}</div>
    ${eq?'<div class="st eq">EQUIPADO</div>':ow?'<div class="st">SEU</div>':i.so==='passe'?'<div class="st lk">🎫 PASSE</div>':`<div class="pr">🪙 ${fmt(R0.co)} · <u>💎 ${R0.ge}</u></div>`}</div>`}).join('')}</div>`;info()}
 else if(L.aba==='passe'){const t=tierOf(C.passe.xp),rest=C.passe.xp-t*SEASON.tier,dias=Math.max(0,Math.ceil((new Date(SEASON.fim)-new Date())/864e5));
  M.innerHTML=`<div class="pass-h"><div class="lvl">${t}<small style="font-size:2vh">/30</small></div><div class="pbar"><div class="b"><i style="width:${t>=30?100:rest/SEASON.tier*100}%"></i></div><small>${SEASON.nm} · ${t>=30?'PASSE COMPLETO!':fmt(rest)+' / '+SEASON.tier+' XP para o nível '+(t+1)} · termina em ${dias} dias</small></div></div>
  <div class="acts" style="margin-bottom:2vh">${C.passe.prem?'<div class="btn" style="flex:none">⭐ PASSE PREMIUM ATIVO</div>':`<div class="btn ge big lj-f" data-x="prem">⭐ ATIVAR PREMIUM · 💎 ${SEASON.prem}</div>`}${t<30?`<div class="btn ge lj-f" data-x="nivel" style="flex:none">+1 NÍVEL · 💎 ${SEASON.nivel}</div>`:''}<div class="btn co lj-f" data-x="pegatudo" style="flex:none">PEGAR TUDO</div></div>
  <div class="sec">GRÁTIS (em cima) · PREMIUM ⭐ (embaixo)</div><div class="trk" id="ljTrk">${PASSE.map((r,i)=>{const ok=i<t;
   const f=r.f?`<div class="rw${C.passe.f[i]?' got':ok?' can lj-f':''}" data-pf="${i}">${visRw(r.f)}</div>`:'<div class="rw" style="opacity:.25"></div>';
   const pm=`<div class="rw prem${C.passe.p[i]?' got':!C.passe.prem?' lk':ok?' can lj-f':''}" data-pp="${i}">${visRw(r.p)}</div>`;return`<div class="tier${ok?' ok':''}"><div class="n">${i+1}</div>${f}${pm}</div>`}).join('')}</div>
  <div class="note">Como ganhar XP do passe: corridas (até ~110 XP cada), acertos e turbos roxos, missões do dia (150 XP cada) e a 1ª vitória do dia (+100). O premium devolve 💎 nos níveis — dá para pagar o próximo passe só jogando.</div>`;
  info();setTimeout(()=>{const k=$L('ljTrk');if(k)k.scrollLeft=Math.max(0,(t-2)*k.firstChild.offsetWidth*1.08)},0)}
 else if(L.aba==='miss'){const lg=C.login,pr=lg.pend;
  M.innerHTML=`<div class="sec">📅 DIAS SEGUIDOS: ${lg.seq}</div><div class="lst"><div class="row${pr?' ok':' done'}"><div class="e">🎁</div><div class="tx"><b>Prêmio de hoje</b><small>Volte todo dia: o prêmio cresce, e no 7º dia vem 💎 20</small></div><div class="rw2">${pr?(pr.ge?'💎 '+pr.ge:'🪙 '+pr.co):'PEGO ✔'}</div>${pr?'<div class="btn lj-f" data-x="login">PEGAR</div>':''}</div></div>
  <div class="sec" style="margin-top:2.4vh">🎯 MISSÕES DE HOJE <small style="font-family:Oxanium;font-size:1.5vh;color:#C9D3F5">· trocam à meia-noite</small></div><div class="lst">${C.miss.l.map((m,j)=>{const M2=MISS.find(x=>x.id===m.id)||{nm:'?',g:1};
   return`<div class="row${m.pego?' done':m.ok?' ok':''}"><div class="e">${m.pego?'✅':m.ok?'🎉':'🎯'}</div><div class="tx"><b>${M2.nm}</b><div class="pb"><i style="width:${m.n/M2.g*100}%"></i></div><small>${m.n} / ${M2.g}</small></div><div class="rw2">🪙 80<br>+150 XP</div>${m.ok&&!m.pego?`<div class="btn lj-f" data-x="m${j}">PEGAR</div>`:''}</div>`}).join('')}
   <div class="row${C.miss.bonus?' done':''}"><div class="e">💎</div><div class="tx"><b>Bônus: complete as 3 missões</b><small>${C.miss.l.filter(m=>m.pego).length} / 3 pegas</small></div><div class="rw2">💎 10</div>${!C.miss.bonus&&C.miss.l.every(m=>m.pego)?'<div class="btn lj-f" data-x="mb">PEGAR</div>':''}</div></div>`}
 else if(L.aba==='trof'){const n=Object.keys(C.trof).length;
  M.innerHTML=`<div class="sec">🏆 TROFÉUS ${n} / ${TROF.length}</div><div class="tgrid">${TROF.map(t=>{const s=C.trof[t.id],v=Math.min(t.g,C.st[t.k]||0);
   return`<div class="row${s&&s.pego?' done':s?' ok':''}"><div class="e" style="${s?'':'filter:grayscale(1);opacity:.5'}">${t.ico}</div><div class="tx"><b>${t.nm}</b><small>${t.d}</small><div class="pb"><i style="width:${v/t.g*100}%"></i></div><small>${fmt(v)} / ${fmt(t.g)}</small></div>
    <div class="rw2">🪙 ${t.co}${t.ge?'<br>💎 '+t.ge:''}</div>${s&&!s.pego?`<div class="btn lj-f" data-x="t_${t.id}">PEGAR</div>`:''}</div>`}).join('')}</div>`}
 else{M.innerHTML=`<div class="sec">💎 GEMAS</div><div class="packs">${PACOTES.map(p=>`<div class="pack">${p.top?'<div class="top">MAIS VENDIDO</div>':''}<div class="e">💎</div><b>${fmt(p.ge)}${p.bonus?' +'+p.bonus:''}</b><small>${p.nm}</small><div class="btn ge lj-f" data-x="pk_${p.id}">${p.rs}</div></div>`).join('')}</div>
  <div class="note">💡 Gemas também saem de graça: troféus, bônus das missões, prêmio do 7º dia e trilha grátis do passe. Com gemas você pega qualquer item na hora — ou junta 🪙 jogando e pega do mesmo jeito.</div>`}
 $L('ljKh').textContent=pads().length?'LB/RB ABAS · ✚ ESCOLHER · A CONFIRMAR · B VOLTAR':'Q/E ABAS · SETAS ESCOLHER · ENTER CONFIRMAR · ESC VOLTAR';L.prevKey='';barra()}
function info(){const I=$L('ljInfo');if(L.aba==='passe'){I.innerHTML=`<h2>🎫 PASSE DA TEMPORADA</h2><p>30 níveis. A trilha premium tem itens exclusivos (Pintura Galáxia, Cartola de Ouro, Chuva de Ouro e a Rede de Pesca) e devolve gemas.</p>`;return}
 const i=ITH[L.sel]||IT.find(x=>x.t===L.cat);if(!i){I.innerHTML='';return}L.sel=i.id;const R0=RAR[i.rar],ow=tem(i.id),eq=eqOf(L.slot)[i.t]===i.id;
 I.innerHTML=`<div class="rar" style="--rc:${R0.c}">${R0.n}${i.so==='passe'?' · PASSE':''}</div><h2>${i.nm}</h2><p>${i.d}${i.t==='gadget'?' <b>1 uso por volta</b> · tecla Q (P1), Ctrl direito (P2) ou Y no controle.':''}</p><div class="acts">${
  ow?(eq&&i.t!=='gadget'?'<div class="btn lj-f" data-x="tira">TIRAR</div>':eq?'<div class="btn no">EQUIPADO</div>':`<div class="btn lj-f" data-x="eq">EQUIPAR EM P${L.slot+1}</div>`)
  :i.so==='passe'?'<div class="btn ge lj-f" data-x="irpasse">VER NO PASSE</div>'
  :`<div class="btn co lj-f${C.co<R0.co?' no':''}" data-x="bco">🪙 ${fmt(R0.co)}</div><div class="btn ge lj-f${C.ge<R0.ge?' no':''}" data-x="bge">💎 ${R0.ge}</div>`}</div>${!ow&&i.so!=='passe'&&C.co<R0.co?`<p style="margin-top:1vh;font-size:1.45vh">Faltam 🪙 ${fmt(R0.co-C.co)} — umas ${Math.ceil((R0.co-C.co)/90)} corridas.</p>`:''}`}
function modal(h,p,bts){const m=$L('ljMod');m.firstChild.innerHTML=`<h3>${h}</h3><p>${p}</p><div class="acts">${bts||'<div class="btn lj-f" data-x="fecha">ENTENDI</div>'}</div>`;m.classList.add('on')}
L.checkout=function(pk){/* aqui entra o pagamento de verdade (servidor + Mercado Pago/Stripe); só depois da confirmação do servidor creditar C.ge */
 modal('💳 PAGAMENTO EM BREVE',`O pacote <b>${pk.nm}</b> (💎 ${fmt(pk.ge+(pk.bonus||0))}) custará <b>${pk.rs}</b>.<br><br>O pagamento com dinheiro ainda não está ligado: precisa de um servidor que confirme a compra (Pix/cartão pelo Mercado Pago ou Stripe). Enquanto isso, ganhe 💎 de graça com troféus, missões e o passe.`)};
function acao(x){const i=ITH[L.sel],R0=i&&RAR[i.rar];
 if(x==='fecha'){$L('ljMod').classList.remove('on');return}
 if(x==='bco'||x==='bge'){if(!i||tem(i.id))return;const ge=x==='bge',pr=ge?R0.ge:R0.co;if((ge?C.ge:C.co)<pr){if(ge){L.aba='gemas';render()}else toast('🪙 Moedas insuficientes — corra mais um pouco!');return}
  if(ge)C.ge-=pr;else C.co-=pr;C.own[i.id]=1;eqOf(L.slot)[i.t]=i.id;salva();toast('🎉 '+i.nm+' é seu! (equipado em P'+(L.slot+1)+')');render();return}
 if(x==='eq'){eqOf(L.slot)[i.t]=i.id;salva();toast('✔ Equipado em P'+(L.slot+1));render();return}
 if(x==='tira'){delete eqOf(L.slot)[i.t];salva();render();return}
 if(x==='irpasse'){L.aba='passe';render();return}
 if(x==='prem'){if(C.passe.prem)return;if(C.ge<SEASON.prem){modal('⭐ PASSE PREMIUM',`Custa 💎 ${SEASON.prem}. Você tem 💎 ${fmt(C.ge)}.`,'<div class="btn ge lj-f" data-x="vergemas">VER GEMAS</div><div class="btn lj-f" data-x="fecha">VOLTAR</div>');return}
  C.ge-=SEASON.prem;C.passe.prem=true;salva();toast('⭐ PASSE PREMIUM ATIVADO!');render();return}
 if(x==='vergemas'){$L('ljMod').classList.remove('on');L.aba='gemas';render();return}
 if(x==='nivel'){if(C.ge<SEASON.nivel){L.aba='gemas';render();return}C.ge-=SEASON.nivel;C.passe.xp=(tierOf(C.passe.xp)+1)*SEASON.tier;salva();toast('🎫 +1 nível!');render();return}
 if(x==='pegatudo'){const t=tierOf(C.passe.xp);let n=0;for(let j=0;j<t;j++){if(PASSE[j].f&&!C.passe.f[j]){C.passe.f[j]=1;ganha(PASSE[j].f);n++}if(C.passe.prem&&!C.passe.p[j]){C.passe.p[j]=1;ganha(PASSE[j].p);n++}}salva();toast(n?'🎁 '+n+' prêmio'+(n>1?'s':'')+' pego'+(n>1?'s':'')+'!':'Nada para pegar ainda');render();return}
 if(x==='login'){const pr=C.login.pend;if(!pr)return;ganha(pr);C.login.pend=null;salva();toast('🎁 Prêmio do dia pego!');render();return}
 if(/^m\d$/.test(x)){const m=C.miss.l[+x[1]];if(!m||!m.ok||m.pego)return;m.pego=true;C.co+=80;C.passe.xp+=150;salva();toast('🎯 +80 🪙 · +150 XP');render();return}
 if(x==='mb'){if(C.miss.bonus)return;C.miss.bonus=true;C.ge+=10;salva();toast('💎 +10');render();return}
 if(x.startsWith('t_')){const t=TROF.find(q=>q.id===x.slice(2)),s=C.trof[t.id];if(!s||s.pego)return;s.pego=true;C.co+=t.co;C.ge+=t.ge||0;salva();toast('🏆 '+t.nm+'!');render();return}
 if(x.startsWith('pk_')){L.checkout(PACOTES.find(p=>p.id===x.slice(3)));return}}
el.addEventListener('click',e=>{const q=e.target.closest('[data-t],[data-s],[data-c],[data-i],[data-x],[data-pf],[data-pp]');if(e.target.closest('#ljX')){fechar();return}if(e.target.closest('#ljGe')){L.aba='gemas';render();return}if(!q)return;const d=q.dataset;
 if(d.t){L.aba=d.t;render()}else if(d.s){L.slot=+d.s;render()}else if(d.c){L.cat=d.c;L.sel=null;render()}else if(d.i){L.sel=d.i;render()}else if(d.x){if(!q.classList.contains('no'))acao(d.x)}
 else if(d.pf!=null||d.pp!=null){const j=+(d.pf!=null?d.pf:d.pp),pr=d.pp!=null,t=tierOf(C.passe.xp);if(j>=t)return;if(pr&&!C.passe.prem){acao('prem');return}const S=pr?C.passe.p:C.passe.f;if(S[j])return;S[j]=1;ganha(pr?PASSE[j].p:PASSE[j].f);salva();toast('🎁 Prêmio do nível '+(j+1)+'!');render()}});
/* teclado e controle dentro da loja */
const foco=()=>[...el.querySelectorAll('.mod.on .lj-f').length?el.querySelectorAll('.mod.on .lj-f'):el.querySelectorAll('.lj-f')];
function mover(dx,dy){const F=foco();if(!F.length)return;let c=el.querySelector('.lj-f.f');if(!c||!F.includes(c)){F[0].classList.add('f');return}
 const a=c.getBoundingClientRect(),ax=a.left+a.width/2,ay=a.top+a.height/2;let best=null,bd=1e9;for(const f of F){if(f===c)continue;const b=f.getBoundingClientRect(),bx=b.left+b.width/2,by=b.top+b.height/2,ddx=bx-ax,ddy=by-ay;
  if(dx&&Math.sign(ddx)!==dx||dy&&Math.sign(ddy)!==dy)continue;if(dx&&Math.abs(ddx)<4||dy&&Math.abs(ddy)<4)continue;const s=dx?Math.abs(ddx)+Math.abs(ddy)*2.5:Math.abs(ddy)+Math.abs(ddx)*2.5;if(s<bd){bd=s;best=f}}
 if(best){c.classList.remove('f');best.classList.add('f');best.scrollIntoView({block:'nearest',inline:'nearest'});if(best.dataset.i){L.sel=best.dataset.i;const k=best.dataset.i;info();el.querySelectorAll('.ljc').forEach(e=>e.classList.toggle('sel',e.dataset.i===k));best.classList.add('f')}}}
function confirma(){const c=el.querySelector('.lj-f.f');if(c)c.click()}
const aba=d=>{const i=ABAS.findIndex(a=>a[0]===L.aba);L.aba=ABAS[(i+d+ABAS.length)%ABAS.length][0];render()};
addEventListener('keydown',e=>{if(!L.on){if(e.code==='KeyL'&&state==='menu'&&window.RMENU&&RMENU.scr==='home'&&!(window.TUT&&TUT.on)){abrir('loja');e.preventDefault()}return}
 e.stopImmediatePropagation();e.preventDefault();const c=e.code;if(c==='Escape'||c==='Backspace'){if($L('ljMod').classList.contains('on'))$L('ljMod').classList.remove('on');else fechar()}
 else if(c==='KeyQ')aba(-1);else if(c==='KeyE'||c==='Tab')aba(1);else if(c==='ArrowLeft'||c==='KeyA')mover(-1,0);else if(c==='ArrowRight'||c==='KeyD')mover(1,0);else if(c==='ArrowUp'||c==='KeyW')mover(0,-1);else if(c==='ArrowDown'||c==='KeyS')mover(0,1);
 else if(c==='Enter'||c==='Space'||c==='NumpadEnter')confirma();else if(/^Digit[1-4]$/.test(c)){L.slot=+c.slice(-1)-1;render()}},true);
const pb={};
{const _pm=padMenu;padMenu=function(){if(!L.on){const p=pads()[0];if(p&&(state==='end'||state==='menu'&&window.RMENU&&RMENU.scr==='home')){const v=!!(p.buttons[2]&&p.buttons[2].pressed);if(v&&!pb.home)abrir('loja');pb.home=v}return _pm()}
 for(const p of pads()){const s=pb[p.index]||(pb[p.index]={}),ed=i=>{const v=!!(p.buttons[i]&&p.buttons[i].pressed),r=v&&!s[i];s[i]=v;return r};
  if(ed(1)){if($L('ljMod').classList.contains('on'))$L('ljMod').classList.remove('on');else fechar()}if(ed(0))confirma();if(ed(4))aba(-1);if(ed(5))aba(1);if(ed(12))mover(0,-1);if(ed(13))mover(0,1);if(ed(14))mover(-1,0);if(ed(15))mover(1,0)}}}
function abrir(a){diaNovo();L.aba=a||'loja';L.on=true;el.classList.add('on');document.body.classList.add('dxLoja');for(const p of pads()){const s=pb[p.index]||(pb[p.index]={});[0,1,4,5,12,13,14,15].forEach(i=>s[i]=!!(p.buttons[i]&&p.buttons[i].pressed))}render()}
function fechar(){L.on=false;el.classList.remove('on');document.body.classList.remove('dxLoja');barra();if(window.RMENU)RMENU.seed=true}
L.abrir=abrir;L.fechar=fechar;L.conta=()=>C;

/* ---------- prévia 3D (kart + piloto do jogador escolhido, com o item experimentado) ---------- */
const PS=new THREE.Scene();PS.environment=DX.env;PS.add(new THREE.HemisphereLight(0xE4ECFF,0x3A2C60,1.25));{const l=new THREE.DirectionalLight(0xFFFFFF,1.2);l.position.set(6,12,10);PS.add(l);const l2=new THREE.DirectionalLight(0x9CC2FF,.6);l2.position.set(-8,6,-10);PS.add(l2)}
const disc=new THREE.Mesh(new THREE.CylinderGeometry(6.5,7,.6,48),new THREE.MeshStandardMaterial({color:0x2A1C68,metalness:.4,roughness:.4}));disc.position.y=-.3;PS.add(disc);
const ring=new THREE.Mesh(new THREE.TorusGeometry(6.6,.12,8,64),new THREE.MeshBasicMaterial({color:0xFFD43B}));ring.rotation.x=PI/2;PS.add(ring);
const PG=new THREE.Group();PS.add(PG);L.PG=PG;const PC=new THREE.PerspectiveCamera(30,1,.5,200);let pTrail=null,pt=0;
function prevBuild(){const s=L.slot,base=Object.assign({},eqOf(s)),i=ITH[L.sel];if(L.aba==='loja'&&i)base[i.t]=i.id;const veh=(typeof LVEH!=='undefined'&&LVEH[s])||VDEF,ch=(typeof LCH!=='undefined'&&LCH[s])||'capy';
 const key=[s,veh,ch,base.pintura,base.chapeu,base.rastro,base.gadget].join('|');pTrail=base.rastro||null;L.gad=base.gadget;if(key===L.prevKey)return;L.prevKey=key;
 while(PG.children.length)PG.remove(PG.children[0]);DX.prevLoad=base;const g=new THREE.Group(),body=vehBody(g,cols[s],veh),pil=buildChar(ch,veh);body.add(pil);DX.prevLoad=null;
 if(base.chapeu){const h=poeChapeu(pil.userData.rig,base.chapeu,HELICES);}
 const bb=new THREE.Box3().setFromObject(g),c=bb.getCenter(new THREE.Vector3()),L2=Math.max(bb.max.z-bb.min.z,bb.max.x-bb.min.x,1),sc=Math.min(1.2,9.5/L2);g.position.set(-c.x*sc,-bb.min.y*sc,-c.z*sc);g.scale.setScalar(sc);PG.add(g)}
const _sd=srDraw;srDraw=function(w,h){if(!L.on)return _sd(w,h);const dt=Math.min(.05,DX.t-(L.t||0));L.t=DX.t;R.setScissorTest(true);R.setViewport(0,0,w,h);R.setScissor(0,0,w,h);R.setClearColor(0x0B0820);R.clear();
 const pv=$L('ljPrev');if(!pv||$L('ljSide').style.display==='none')return true;const r=pv.getBoundingClientRect();if(r.width<10||r.height<10)return true;prevBuild();PG.rotation.y+=dt*.6;
 if(pTrail&&TR[pTrail]){pt+=dt*20;/* rastro na prévia: o kart "corre" no lugar */}
 const vy=h-r.bottom;R.setViewport(r.left,vy,r.width,r.height);R.setScissor(r.left,vy,r.width,r.height);PC.aspect=r.width/r.height;PC.position.set(0,8.5,27);PC.lookAt(0,3,0);PC.updateProjectionMatrix();R.render(PS,PC);return true};

/* ---------- tela de resultado: recompensas ---------- */
function mostraRecompensa(r){let d=$L('dxRew');const w=document.querySelector('#sEnd .ewrap');if(!w)return;if(!d){d=document.createElement('div');d.id='dxRew';w.appendChild(d)}
 const t=tierOf(C.passe.xp),rest=C.passe.xp-t*SEASON.tier;
 d.innerHTML=`<div class="h"><b>+${fmt(r.co)} 🪙</b><b class="x">+${fmt(r.xp)} XP</b><span style="font-weight:800;font-size:1.6vh;color:#C9D3F5">PASSE NÍVEL ${t}${r.tier[1]>r.tier[0]?' ⬆ SUBIU!':''}</span></div><div class="pb"><i style="width:0%"></i></div>
 <ul>${r.lin.map(l=>`<li>${l[0]}<span>${l[1]?'+'+l[1]+' 🪙':''}${l[2]?' +'+l[2]+' XP':''}</span></li>`).join('')}</ul>${r.trof.length?`<div class="t">${r.trof.map((t2,i)=>`<i style="animation-delay:${.3+i*.15}s">🏆 ${t2.nm}</i>`).join('')}</div>`:''}
 <div class="lo">Saldo: 🪙 ${fmt(C.co)} · 💎 ${fmt(C.ge)} · aperte <b>L</b> (ou X no controle) para abrir a loja</div>`;
 setTimeout(()=>{const i=d.querySelector('.pb i');if(i)i.style.width=(t>=30?100:rest/SEASON.tier*100)+'%'},60)}
addEventListener('keydown',e=>{if(!L.on&&state==='end'&&e.code==='KeyL'){abrir('loja');e.stopImmediatePropagation()}},true);
on('start',()=>{const d=$L('dxRew');if(d)d.remove()});

/* ---------- estado inicial ---------- */
diaNovo();barra();
on('menu',()=>barra());setInterval(()=>{if(state==='menu'&&!L.on)barra()},4000);
})();
