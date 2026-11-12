/* ===== KART RUSH DELUXE · TELA DE ABERTURA =====
 A tela inicial usa a arte de abertura (deluxe/abertura.webp) no lugar da vitrine 3D girando: o logo é o da própria arte e
 as 5 opções (1 a 4 jogadores e online) ficam numa faixa embaixo, sem cobrir os personagens. Enquanto ela está aberta,
 a cena 3D do menu não é desenhada (economiza a placa de vídeo). As outras telas (mapa, garagem, sala, resultado) continuam iguais. */
if(window.PHONE)throw new Error('PHONEMODE');
(()=>{
const css=document.createElement('style');css.textContent=`
#rmHome{background:#1B1550 url(deluxe/abertura.webp) center 35%/cover no-repeat}
#rmHome::before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(16,10,50,0) 52%,rgba(16,10,50,.55) 72%,rgba(12,8,40,.92) 100%)}
#rmHome .rm-hw{left:3vw;right:3vw;top:auto;bottom:9vh;width:auto;display:block}
#rmHome .rm-hw .logo{display:none}
#rmHome .rm-modes{flex-direction:row;gap:1.2vw;align-items:flex-end}
#rmHome .rm-mb{flex:1 1 0;width:auto!important;min-width:0;height:13.5vh;flex-direction:column;align-items:center;justify-content:center;gap:.7vh;padding:1vh .8vw;
 background:linear-gradient(180deg,rgba(42,26,85,.92),rgba(20,14,60,.92));border:.3vh solid rgba(255,255,255,.28);border-radius:1.6vh;box-shadow:0 .7vh 0 rgba(10,6,30,.75),0 1.4vh 3vh rgba(0,0,0,.35)}
#rmHome .rm-mb .n{display:none}#rmHome .rm-mb .pc{display:none}
#rmHome .rm-mb .t{flex:none;text-align:center;width:100%}
#rmHome .rm-mb .t b{font-family:Bungee,'Arial Black',sans-serif;font-weight:400;font-size:2.7vh;letter-spacing:.02em;-webkit-text-stroke:.12vh #2A1A55;text-shadow:0 .35vh 0 #2A1A55}
#rmHome .rm-mb .t small{justify-content:center;font-size:1.2vh;white-space:normal;line-height:1.25;margin-top:.35vh}
#rmHome .rm-mb .who{gap:.3vw}#rmHome .rm-mb .who i{width:2.6vh;height:2.6vh;font-size:.95vh}#rmHome .rm-mb .who .o6{width:auto;font-size:1.1vh;white-space:nowrap;padding:0 .9vw}
#rmHome .rm-mb .ar{display:none}
#rmHome .rm-mb.on{transform:skewX(-11deg) translateY(-1.4vh);background:linear-gradient(180deg,#FFB052 0%,#FF6B22 60%,#E4501B 100%);border-color:#FFD43B;box-shadow:0 .8vh 0 #95330B,0 0 4.5vh rgba(255,140,40,.75)}
#rmHome .rm-mb.ol.on{background:linear-gradient(180deg,#7CC8FF 0%,#2E9BFF 60%,#1C64D8 100%);box-shadow:0 .8vh 0 #0D3A86,0 0 4.5vh rgba(46,155,255,.7)}
#rmHome .rm-mb.go{animation:dxGo .3s ease}@keyframes dxGo{50%{transform:skewX(-11deg) translateY(-2.2vh) scale(1.05);filter:brightness(1.3)}}
@keyframes rmIn{from{opacity:0;transform:skewX(-11deg) translateY(6vh)}}
#rmHome .rm-hf{bottom:2.2vh}
body.dxHome #vcard,body.dxHome .sig{display:none!important}
`;document.head.appendChild(css);
/* imagem pronta antes de abrir */
const pre=new Image();pre.src='deluxe/abertura.webp';
/* na tela inicial não desenha a vitrine 3D */
const _sd=srDraw;srDraw=function(w,h){const home=state==='menu'&&window.RMENU&&RMENU.scr==='home';document.body.classList.toggle('dxHome',!!home);if(home)return true;return _sd(w,h)};
})();
