from pathlib import Path
h=Path('index.html').read_text()
stub='''<script>THREE.WebGLRenderer=function(o){return new Proxy({domElement:o.canvas,shadowMap:{},capabilities:{isWebGL2:false,getMaxAnisotropy:()=>1},info:{render:{calls:0}},getSize:v=>v.set(1280,720),getPixelRatio:()=>1,getRenderTarget:()=>null,getViewport:v=>v.set(0,0,1280,720)}, {get:(t,k)=>k in t?t[k]:(()=>{})})};window.requestAnimationFrame=()=>0;</script>'''
h=h.replace('const R=new THREE.WebGLRenderer', 'const R=new THREE.WebGLRenderer')
# Insert between bundled Three and the first application script.
pos=h.index('const R=new THREE.WebGLRenderer')
start=h.rfind('<script',0,pos)
h=h[:start]+stub+h[start:]
h=h.replace('</body>','''<div style="position:fixed;z-index:999999;inset:20px;background:#15202b;color:white;padding:20px;overflow:auto"><h1>Validação lógica — renderização desativada apenas neste teste</h1><button onclick="qaRun()">Executar testes</button><pre id="qaout">Pronto</pre></div><script src="tests/room-browser-harness.js"></script></body>''')
Path('qa.html').write_text(h)
