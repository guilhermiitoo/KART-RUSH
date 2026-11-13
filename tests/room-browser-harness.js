function qaRun(){const out=document.getElementById('qaout');out.textContent='';const log=x=>out.textContent+=x+'\n';const check=(ok,msg)=>{if(!ok)throw new Error(msg)};try{
 SEL='quarto';mode=1;start();state='go';log('Mapa construído: '+ST.id+' / '+ST.world.children.length+' objetos');
 let bad=0;ST.world.traverse(o=>{if(o.geometry){const a=o.geometry.attributes.position;for(let i=0;i<a.array.length;i++)if(!Number.isFinite(a.array[i]))bad++}});log('Vértices não finitos: '+bad);check(bad===0,'Geometria inválida');
 const k=karts[0];k.human=false;
 for(let i=0;i<280*60;i++){for(const kart of karts)stepKart(kart,botInput(kart,1/60),1/60);emit('update',1/60)}
 log('Após 280s simulados: '+JSON.stringify(karts.map(k=>({name:k.name,prog:Math.round(k.prog),fin:k.fin,fall:k.fallT,x:Math.round(k.x),v:Math.round(k.v)}))));
 check(karts.every(k=>k.fin),'Um bot não terminou');const u=ST.uk[7]+(ST.uk[8]-ST.uk[7])*.45,gate=Math.round(u*N);
 for(let test=0;test<6;test++){const wrong=(test+1)%3,lane=test<3?wrong:(wrong+1)%3;
  const p=ptAt((gate-1)/N,(lane-1)*W/3);Object.assign(k,{x:p.x,z:p.z,y:p.y,gy:p.y,prevGy:p.y,idx:gate-1,fi:gate-1,prog:gate-1,lat:(lane-1)*W/3,h:p.h,mh:p.h,v:70,fallT:0,fin:false,air:false,ghost:0});emit('start');state='go';
  let trapped=false,recovered=false;for(let i=0;i<180;i++){stepKart(k,{st:0,thr:1},1/60);if(k.fallT===2)trapped=true;if(trapped&&k.fallT===0)recovered=true;emit('update',1/60)}check(trapped===(test<3),'Captura incorreta no tubo '+lane);check(!trapped||recovered,'Kart não retornou');log('Tubo '+lane+' (perigo '+wrong+'): capturado='+trapped+', retornou='+recovered+', progresso='+Math.round(k.prog));
 }
 log('PASSOU — geometria, corrida completa, três tubos perigosos e três passagens seguras');}catch(e){log(e.stack)}}
