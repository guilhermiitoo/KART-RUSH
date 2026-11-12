/* ===== KART RUSH DELUXE · HUD =====
 1 JOGADOR: velocímetro em arco (com moedas e barra de embalo dentro) no canto de baixo à esquerda, casa do item grande ao lado
  com a tecla de usar, minimapa no canto de baixo à direita, posição e volta em cima à esquerda.
 TELA DIVIDIDA (2 a 6): tela limpa — só a velocidade; a casa do item só aparece quando há item (ou a roleta girando).
 AVISOS ("ÚLTIMA VOLTA!", itens…) e a CONTAGEM da largada aparecem dentro da tela de cada jogador, pequenos e acima do kart,
 sem cobrir a pista nem a tela dos outros. */
if(window.PHONE)throw new Error('PHONEMODE');
(()=>{
const css=document.createElement('style');css.textContent=`
html body #big{visibility:hidden!important}
/* velocímetro */
.dxs{position:relative;flex:none;width:17vh;height:15vh;font-family:Oxanium,sans-serif;color:#fff;pointer-events:none}
.dxs svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 .5vh 1vh rgba(0,0,0,.45))}
.dxs .bg{fill:rgba(16,24,46,.82)}.dxs .tk{fill:none;stroke:rgba(255,255,255,.14);stroke-width:7;stroke-linecap:round}
.dxs .fl{fill:none;stroke:url(#dxsg);stroke-width:7;stroke-linecap:round;transition:stroke-dasharray .08s linear}
.dxs.boost .fl{stroke:#FFD43B;filter:drop-shadow(0 0 4px #FF8A2A)}
.dxs b{position:absolute;left:0;right:0;top:3.4vh;text-align:center;font-weight:800;font-size:5.6vh;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.dxs i{position:absolute;left:0;right:0;top:9.1vh;text-align:center;font-style:normal;font-weight:800;font-size:1.35vh;letter-spacing:.2em;color:#FFD43B}
.dxs .co{position:absolute;left:0;right:0;bottom:-.6vh;display:flex;align-items:center;justify-content:center;gap:.5vw;font-weight:800;font-size:1.6vh}
.dxs .co em{font-style:normal}.dxs .eb{width:6vh;height:.8vh;border-radius:1vh;background:rgba(255,255,255,.18);overflow:hidden}.dxs .eb u{display:block;height:100%;width:0;background:linear-gradient(90deg,#47D7A0,#FFD43B,#FF6B22)}
/* casa do item */
html body .pv .bl{align-items:flex-end;gap:1vw}
html body .pv .spd,html body .pv .pvx{display:none!important}
html body .i2it{width:12vh;height:12vh;border-radius:2.6vh;margin-bottom:1vh}
.i2it .dxk{position:absolute;left:50%;bottom:-1.3vh;transform:translateX(-50%);white-space:nowrap;font-family:Oxanium,sans-serif;font-weight:800;font-size:1.3vh;letter-spacing:.1em;color:#2A1A55;background:#FFD43B;padding:.15vh .7vw;border-radius:.6vh;box-shadow:0 .3vh 0 #B8420C;display:none}
.i2it.has .dxk{display:block;animation:dxk .6s ease-in-out infinite alternate}@keyframes dxk{to{transform:translateX(-50%) translateY(-.4vh)}}
html body .i2it.has{animation:dxIt .7s ease-in-out infinite alternate}@keyframes dxIt{from{box-shadow:0 0 1.6vh rgba(255,212,59,.6)}to{box-shadow:0 0 4.6vh rgba(255,212,59,1),0 0 0 .5vh rgba(255,212,59,.35)}}
html body .i2it.got{animation:dxGot .45s cubic-bezier(.2,1.8,.4,1)}@keyframes dxGot{from{transform:scale(1.6) rotate(-12deg)}}
/* minimapa: canto de baixo à direita com 1 jogador */
html body.dx1 .pv .bl{bottom:4.4vh}html body.dx1 .sig{display:none}
html body.dx1 #mini{left:auto;right:2vw;bottom:2.6vh;transform:none;width:26vh;height:18.2vh;opacity:.94}
/* avisos e contagem dentro de cada tela */
html body .pv .msg{top:15%;left:50%;right:auto;transform:translate(-50%,-.6vh) scale(.92);width:max-content;max-width:92%;font-size:2.9vh;padding:.7vh 1.6vw;border-radius:99px;background:rgba(16,24,46,.72);-webkit-text-stroke:0;text-shadow:0 .25vh 0 rgba(0,0,0,.55);transition:opacity .2s,transform .2s}
html body .pv .msg.on{transform:translate(-50%,0) scale(1)}
.dxcd{position:absolute;left:0;right:0;top:18%;text-align:center;font-family:Bungee,'Arial Black',sans-serif;font-size:13vh;line-height:1;color:#FFD43B;-webkit-text-stroke:.45vh #2A1A55;text-shadow:0 .8vh 0 #2A1A55;opacity:0;transform:scale(.6);pointer-events:none}
.dxcd.on{opacity:1;transform:scale(1);transition:transform .25s cubic-bezier(.2,1.8,.4,1)}.dxcd.go{color:#47D7A0}
/* tela dividida: só o essencial */
body.dxN .pv .tl,body.dxN .pv .tr,body.dxN .pv .i2fx{display:none!important}
body.dxN .pv .bl{left:1.4vw!important;right:auto!important;bottom:1.6vh!important}
body.dxN .pv.dxR .bl{left:auto!important;right:1.4vw!important;flex-direction:row-reverse}
body.dxN .dxs{width:auto;height:auto;padding:.5vh 1vw;border-radius:1.2vh;background:rgba(16,24,46,.78);display:flex;align-items:baseline;gap:.4vw;box-shadow:0 .4vh 1.2vh rgba(0,0,0,.35)}
body.dxN .dxs svg,body.dxN .dxs .co{display:none}
body.dxN .dxs b{position:static;font-size:3.2vh}body.dxN .dxs i{position:static;font-size:1vh}
body.dxN .dxs.boost{box-shadow:0 0 1.6vh rgba(255,170,40,.9)}
body.dxN .i2it{display:none;width:7.4vh;height:7.4vh;border-radius:1.6vh;margin:0}
body.dxN .i2it.has,body.dxN .i2it.roll{display:flex}
body.dxN .i2it b{display:none}body.dxN .i2it .dxk{font-size:1vh;bottom:-1vh}
body.dxN .pv .msg{font-size:1.75vh;top:12%;padding:.45vh 1vw}
body.dxN .dxcd{font-size:7vh;top:16%;-webkit-text-stroke:.3vh #2A1A55;text-shadow:0 .5vh 0 #2A1A55}
body.dxN .pv .fcard{font-size:2.6vh;padding:1vh 2vw;top:22%}
body.dxN #mini{opacity:.85}
`;document.head.appendChild(css);
const ARC=2*Math.PI*48*(240/360),C=2*Math.PI*48;
const dial=()=>`<svg viewBox="0 0 120 104"><defs><linearGradient id="dxsg" x1="0" x2="1"><stop offset="0" stop-color="#47D7A0"/><stop offset=".6" stop-color="#FFD43B"/><stop offset="1" stop-color="#FF6B22"/></linearGradient></defs>
 <circle class="bg" cx="60" cy="58" r="56"/><circle class="tk" cx="60" cy="58" r="48" stroke-dasharray="${ARC} ${C}" transform="rotate(150 60 58)"/><circle class="fl" cx="60" cy="58" r="48" stroke-dasharray="0 ${C}" transform="rotate(150 60 58)"/></svg>
 <b>0</b><i>KM/H</i><div class="co"><em>🪙 0/10</em><span class="eb"><u></u></span></div>`;
const tecla=k=>{if(k.ctrl==='phone')return'';const hi=humans.indexOf(k),np=pads().length;if(np&&(humans.length===1||hi<np))return'X';return humans.length===1||hi===0?'ESPAÇO':hi===1?'ENTER':''};
on('start',()=>{const n=humans.length;document.body.classList.toggle('dx1',n===1);document.body.classList.toggle('dxN',n>1)});
on('hudbuild',(k,el)=>{const bl=el.querySelector('.bl'),d=document.createElement('div');d.className='dxs';d.innerHTML=dial();bl.insertBefore(d,bl.firstChild);
 const cd=document.createElement('div');cd.className='dxcd';el.appendChild(cd);if(parseFloat(el.style.left)>1)el.classList.add('dxR');
 k.dxH={d,b:d.querySelector('b'),fl:d.querySelector('.fl'),co:d.querySelector('em'),eb:d.querySelector('.eb u'),cd,lv:-1,it:'',k:tecla(k),cdt:''}});
on('hud',()=>{const big=$('big'),cdOn=big&&big.style.display==='block',cdT=cdOn?big.textContent:'';
 for(const k of humans){const H=k.dxH;if(!H)continue;const kmh=Math.round(Math.abs(k.v)*2.1);if(kmh!==H.lv){H.lv=kmh;H.b.textContent=kmh;H.fl.setAttribute('stroke-dasharray',(ARC*Math.min(1,kmh/240)).toFixed(1)+' '+C)}
  H.d.classList.toggle('boost',k.boost>0);const co='🪙 '+(k.coins||0)+'/10';if(H.co.textContent!==co)H.co.textContent=co;H.eb.style.width=Math.round((k.emb||0)*100)+'%';
  /* item: pulinho ao chegar e a tecla de usar */
  const it=k.i2H&&k.i2H.it;if(it){if(!it.querySelector('.dxk')&&H.k){const s=document.createElement('span');s.className='dxk';s.textContent=H.k;it.appendChild(s)}
   const key=k.item||'';if(key!==H.it){if(key&&key!=='roleta'&&H.it!==key){it.classList.remove('got');void it.offsetWidth;it.classList.add('got')}H.it=key}}
  if(cdT!==H.cdt){H.cdt=cdT;H.cd.textContent=cdT;H.cd.classList.toggle('on',!!cdT);H.cd.classList.toggle('go',cdT==='JÁ!');if(cdT){H.cd.classList.remove('on');void H.cd.offsetWidth;H.cd.classList.add('on')}}}});
/* o "JÁ!" some sozinho depois de um instante */
on('update',()=>{if(state==='go'&&raceT>.8)humans.forEach(k=>{if(k.dxH&&k.dxH.cdt){k.dxH.cdt='';k.dxH.cd.classList.remove('on')}})});
/* a casa do item recria o conteúdo quando muda: devolve a tecla */
{const _say=say;say=function(k,t,c){_say(k,t,c);if(k&&k.hud)k.msgT=Math.min(k.msgT,1.3)}}
})();
