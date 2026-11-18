/* KART RUSH · QUARTO DOS GIGANTES
   Map-local mechanics: three tubes/vacuum, falling dominoes, toy train,
   mattress jump. All clocks advance in simulation time, never wall time.
   No external assets or dependencies. */
if(window.PHONE)throw new Error('PHONEMODE');
(()=>{'use strict';
 const Q=KRRoomRules,{P,Sf,Gl,Gw,Mt}=DX,PI=Math.PI;
 const COLORS=[0xF35C62,0x44BCE2,0xF4CD4A];
 let room=null,round=0,clock=0,mem=new WeakMap();
 const active=()=>ST&&ST.id==='quarto'&&room;
 const memory=k=>{let m=mem.get(k);if(!m){m={prev:k.prog,cool:0,trip:null};mem.set(k,m)}return m};
 const d=DX.addMap({id:'quarto',nome:'QUARTO DOS GIGANTES',ico:'🧸',tema:'gelo',dif:3,
  sub:'Você virou um brinquedo! Escrivaninha gigante, três tubos, aspirador, dominós e trem.',
  menu:'3 tubos · aspirador · dominó · trem · colchão',
  pts:[[-260,240,4],[-80,240,4],[100,240,4],[280,200,6],[330,90,30],[330,-50,72],[270,-160,72],[140,-190,72],[0,-190,72],[-130,-190,48],[-260,-150,34],[-310,-30,34],[-280,100,34],[-180,120,34],[-120,40,18],[-80,-40,4],[40,-50,4],[150,10,4],[110,100,4],[-80,160,4]],
  fog:[0xF0D5BA,650,1900],hemi:[0xFFF3D8,0x887090,.86],sun:[0xFFE3AF,.95],sunDir:[-.6,.9,-.4],dust:0xEAD2B5,
  sky:{top:0xA7CFE6,mid:0xF0DAC0,hor:0xF6DDAC,sunC:0xFFF3C6,sunD:[-.6,.9,-.4],cloud:0},
  road:['#ED9952','#FFF0C5','rgba(255,255,255,.8)'],bar:[0x5DBFCC,0xFFF0C5],cone:0xE26354,mm:'#E8A75E',pit:'quarto',pitCor:'#B78F6D',saia:0xC99567,
  fallMsg:'🧸 OPS! DE VOLTA AO QUARTO!',
  ter:{cell:26,margin:160,fall:18,bed:0,nat(){return 0},col(){return 0xCEAC86}},
  placas(B){return[[.014,'QUARTO DOS GIGANTES','#FF9A40','Pequenos pilotos. Grande bagunça!'],[B.uOf(.5),'DOMINÓ DESABANDO','#ED5868','A luz avisa o lado que vai cair'],[B.uOf(4),'SUBIDA DA RÉGUA','#46B6CC','A escrivaninha é logo ali'],[B.uOf(6.2),'ESCOLHA SEU TUBO','#7D65C9','Evite o X: o aspirador está ligado!'],[B.uOf(10.8),'COLCHÃO ELÁSTICO','#8A70D1','A faixa central dá um salto'],[B.uOf(16.8),'EXPRESSO DE BRINQUEDO','#46B6CC','Luz vermelha: cuidado com o trem!']]},
  cena(B,d){
   const K=DX.kit();K.def='matte';
   const T=d.dx.T,minX=T.x0+35,maxX=T.x1-35,minZ=T.z0+35,maxZ=T.z1-35;
   d.dx.T.mesh.visible=false;
   // Room shell, floorboards and window: one baked model per material.
   K.box(maxX-minX+140,5,maxZ-minZ+140,Sf(0xD6B58D),(minX+maxX)/2,-3,(minZ+maxZ)/2);
   for(let x=minX-50;x<maxX+70;x+=55)K.box(1,.12,maxZ-minZ+140,0xB99372,x,-.43,(minZ+maxZ)/2);
   K.box(maxX-minX+140,290,8,Sf(0x9DC7CF),(minX+maxX)/2,140,minZ-65);
   K.box(8,290,maxZ-minZ+140,Sf(0xD5B0BA),minX-65,140,(minZ+maxZ)/2);
   K.box(maxX-minX+140,14,12,0xFFF0DA,(minX+maxX)/2,7,minZ-58);
   K.box(12,14,maxZ-minZ+140,0xFFF0DA,minX-58,7,(minZ+maxZ)/2);
   const winX=80,winZ=minZ-58;
   K.box(250,156,6,0xFFF4E0,winX,176,winZ);K.box(231,138,7,Gw(0xBCE5F5),winX,176,winZ+4);
   K.box(8,140,10,0xFFF4E0,winX,176,winZ+9);K.box(240,8,10,0xFFF4E0,winX,176,winZ+9);
   for(const s of[-1,1])for(let j=0;j<5;j++)K.cyl(6,6,186,Sf(0xE99B77),winX+s*(130+j*10),165,winZ+15,null,null,8);
   // Gravura infantil na parede: foguete de papel, chama, lua e estrelas.
   const mural=K.at(minX+155,175,minZ-57);
   mural.rbox(152,140,5,2,0xD89960,0,0,0);
   mural.box(144,132,2,0x263B62,0,0,3);
   mural.cyl(16,16,1,0xF6C263,38,37,5,[PI/2,0,0],null,32);
   const rocket=mural.at(-8,-3,6,[0,0,-.53]);
   rocket.ext([[0,44],[13,20],[10,-20],[-10,-20],[-13,20]],1,0xFFF0CE,0,0,0);
   rocket.ext([[-10,-12],[-25,-29],[-24,-7],[-12,10]],1,0xDE685A,0,0,0);
   rocket.ext([[10,-12],[25,-29],[24,-7],[12,10]],1,0xDE685A,0,0,0);
   rocket.ext([[-8,-21],[0,-48],[8,-21]],1,0xF5B54A,0,0,0);
   rocket.cyl(7,7,2,0x497BA0,0,13,2,[PI/2,0,0],null,20);
   for(const [x,y] of [[-54,40],[-44,10],[11,49],[46,-30],[22,-48],[-55,-29]]){
    mural.box(8,2,1,0xFFE6B1,x,y,5);mural.box(2,8,1,0xFFE6B1,x,y,5);
   }
   // Desk placed under the elevated road, deliberately below the collision surface.
   K.rbox(490,9,260,3,0xDEBB88,245,65,-220);
   for(const x of[30,460])for(const z of[-315,-120])K.box(15,64,15,0xC39765,x,31,z);
   K.box(110,58,94,0xD9A67C,425,30,-238);
   for(let y=15;y<60;y+=19){K.box(112,1.5,96,0xAB7C5A,425,y,-238);K.box(16,3,4,0x7E9BA1,425,y+7,-188)}
   const lamp=K.at(436,70,-295);
   lamp.cyl(23,27,6,P(0x287F83),0,3,0,null,null,24);
   lamp.limb([0,5,0],[9,61,0],3.2,Mt(0xBEC7B4));
   lamp.limb([9,61,0],[-22,85,0],3.2,Mt(0xBEC7B4));
   lamp.ball(6,P(0x247C83),9,61,0);
   const shade=lamp.at(-23,73,0,[0,0,-.32]);
   shade.cyl(7,23,23,P(0x238B8D),0,0,0,null,null,28);
   shade.cyl(21,21,1.3,Gw(0xFFF1BE),0,-12,0,null,null,28);
   // Bed under the elevated left turn, pillow and quilt.
   K.rbox(244,21,404,9,0xD7C4A8,-375,13,0);
   K.rbox(242,12,400,5,Sf(0xA7C6DB),-375,27,0);
   K.rbox(210,22,58,10,Sf(0xFFF3DB),-375,46,-169);
   K.box(245,84,10,0xD5B58E,-375,36,-207);
   const quilt=[0x526B9B,0x80A8BF,0xC2D6D0,0xD98B76];
   for(let row=0;row<7;row++)for(let col=0;col<5;col++){
    const x=-375+(col-2)*47,z=-105+row*43;
    K.box(46,.42,42,Sf(quilt[(row+col*3)%4]),x,33.32,z);
   }
   // Ruler climb: tick marks follow the actual track instead of a flat fake ramp.
   for(let j=0;j<24;j++){const p=B.at(B.uOf(3.3+j*.075),0);K.at(p.x,p.y+.11,p.z,[0,p.h,0]).box(j%5?5:12,.2,1,0x665136,-W/2+10,0,0)}
   // Central rug and toy building blocks (kept clear of the route).
   K.rbox(280,.5,160,10,Sf(0x647CAB),-100,.1,105);
   const rng=DX.rng(5804);
   for(let i=0;i<80;i++){const x=minX+rng()*(maxX-minX),z=minZ+rng()*(maxZ-minZ);if(B.dist(x,z)<W/2+26)continue;
    const c=COLORS[i%3],sz=10+rng()*10,k=K.at(x,0,z,[0,rng()*PI,0]);k.rbox(sz,sz,sz,1.3,P(c),0,sz/2,0);for(const a of[-1,1])for(const b of[-1,1])k.cyl(sz*.13,sz*.13,2,P(c),a*sz*.24,sz+1,b*sz*.24,null,null,8);
   }
   // Casinhas de madeira junto à reta, afastadas do asfalto e do trem.
   for(let i=0;i<7;i++){
    const x=-220+i*60,z=305+(i%2)*46;
    if(B.dist(x,z)<W/2+35)continue;
    const h=24+(i%3)*5,house=K.at(x,0,z,[0,.12*(i%3-1),0]);
    house.box(35,h,27,0xF4D5A6,0,h/2,0);
    house.ext([[-21,0],[0,17],[21,0]],32,P(COLORS[i%3]),0,h,0);
    for(const face of[-1,1]){
     house.box(8,17,1,0x437D86,0,8.5,face*13.7);
     for(const side of[-1,1])house.box(6,7,1,0x52758A,side*11,h*.62,face*13.7);
    }
   }
   // A huge teddy bear watching the race from the far side of the room.
   const bear=K.at(220,0,-15,[0,-.5,0]);bear.ball(38,Sf(0xBA8255),0,42,0,[1,1.15,.8]);bear.ball(31,Sf(0xC38B59),0,101,0);
   for(const s of[-1,1]){bear.ball(13,Sf(0xC38B59),s*23,125,0);bear.ball(7,Sf(0xE9B98A),s*23,127,7);bear.ball(18,Sf(0xBA8255),s*31,17,12,[1,.8,1.3]);bear.ball(15,Sf(0xBA8255),s*37,57,0);bear.ball(3,0x36292B,s*11,107,27)}
   bear.ball(15,Sf(0xE9B98A),0,91,24,[1,.7,.7]);bear.ball(5,0x493239,0,97,35);bear.box(20,9,8,P(0xD75768),0,72,28);
   // Giant pencils and books at the room edge.
   for(let i=0;i<6;i++){const bk=K.at(minX+55,0,minZ+70,[0,.08*i,0]);bk.box(120,12,76,P(COLORS[i%3]),0,7+i*15,0);bk.box(114,8,74,0xFFF0CE,0,7+i*15,1)}
   for(let i=0;i<4;i++){const p=B.at(.92+i*.008,W/2+28);K.at(p.x,0,p.z,[0,p.h+.5,PI/2]).cyl(5,5,72,P(COLORS[i%3]),0,40,0,null,null,6)}
   const shell=K.build({receive:true});B.add(shell);
   room={B,d,wrong:Q.wrongLane(round),tubeU:B.uOf(7.45),tubeExit:B.uOf(7.9),dom:[],trainU:B.uOf(17.8),bounceU:B.uOf(11.85),lamps:[],labels:[],dust:[]};
   const tube=B.at(room.tubeU,0),tubeGroup=new THREE.Group();tubeGroup.position.set(tube.x,tube.y,tube.z);tubeGroup.rotation.y=tube.h;B.add(tubeGroup);room.tube=tube;room.tubeGroup=tubeGroup;
   // Three walk-through half-pipe tunnels. Arches leave the roadway unobstructed.
   for(let lane=0;lane<3;lane++){
    const x=(lane-1)*W/3,C=COLORS[lane],kit=DX.kit();
    for(let z=0;z<=24;z+=4)kit.tor(10,1.3,P(C),x,0,z,null,PI,null,18);
    for(const side of[-1,1])kit.box(1.1,2.5,24,P(C),x+side*10,1.2,12);
    const g=kit.build();tubeGroup.add(g);
    const mat=new THREE.MeshBasicMaterial({color:0x73E3AB}),lamp=new THREE.Mesh(new THREE.SphereGeometry(1.7,10,8),mat);lamp.position.set(x,13,-2);tubeGroup.add(lamp);room.lamps.push(lamp);
    const cvs=cv(256,128,()=>{}),tex=new THREE.CanvasTexture(cvs);tex.encoding=THREE.sRGBEncoding;
    const sign=new THREE.Mesh(new THREE.PlaneGeometry(18,9),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));sign.position.set(x,20,-1);sign.rotation.y=PI;tubeGroup.add(sign);room.labels.push({cvs,tex});
   }
   // Transparent vacuum canister alongside the tubes, connected by a visible hose.
   const vac=DX.kit(),vx=W/2+24;
   vac.cyl(13,13,26,Gl(0xC8EFF4),vx,18,16,null,null,18);vac.cyl(14,14,5,P(0xE35966),vx,4,16);vac.half(14,P(0xE35966),vx,32,16,[1,.5,1]);
   for(const s of[-1,1])vac.cyl(5,5,3,0x343A49,vx+s*12,4,16,[0,0,PI/2]);
   vac.box(12,4,7,P(0xFFD76F),vx,38,16);const vg=vac.build();tubeGroup.add(vg);room.vacLocal={x:vx,y:18,z:16};
   const hose=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0,10,22),new THREE.Vector3(0,25,28),new THREE.Vector3(vx,35,28),new THREE.Vector3(vx,28,16)]),24,3.5,8,false),new THREE.MeshStandardMaterial({color:DX.lin(0x596376),roughness:.6}));tubeGroup.add(hose);room.hose=hose;
   for(let i=0;i<9;i++){const puff=new THREE.Mesh(new THREE.IcosahedronGeometry(.6+i%3*.3),new THREE.MeshBasicMaterial({color:0xEADBC2}));tubeGroup.add(puff);room.dust.push(puff)}
   function paintSigns(){for(let l=0;l<3;l++){const {cvs,tex}=room.labels[l],c=cvs.getContext('2d'),bad=l===room.wrong;c.fillStyle=bad?'#A02B41':'#126052';c.fillRect(0,0,256,128);c.strokeStyle='#FFFFFF';c.lineWidth=5;c.strokeRect(3,3,250,122);c.textAlign='center';c.font='bold 52px Arial';c.fillStyle='#FFFFFF';c.fillText(bad?'X':'OK',128,59);c.font='bold 22px Arial';c.fillText(bad?'ASPIRADOR':'PASSAGEM',128,96);tex.needsUpdate=true;room.lamps[l].material.color.set(bad?0xFF3E59:0x72E6B2)}
    const inlet=(room.wrong-1)*W/3,v=room.vacLocal;room.hose.geometry.dispose();room.hose.geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(inlet,10,22),new THREE.Vector3(inlet,25,28),new THREE.Vector3(v.x,35,28),new THREE.Vector3(v.x,28,16)]),24,3.5,8,false);
   }room.paintSigns=paintSigns;paintSigns();
   // Six pivoting dominoes, alternating sides; always leave half the road free.
   for(let i=0;i<6;i++){const u=B.uOf(.85+i*.16),p=B.at(u,0),side=i%2?1:-1,base=new THREE.Group();base.position.set(p.x,p.y,p.z);base.rotation.y=p.h;B.add(base);
    const pivot=new THREE.Group();pivot.position.x=side*(W/2-5);base.add(pivot);
    const dk=DX.kit();dk.rbox(9,25,3,1,P(i%2?0x505B86:0xFFF0D3),0,12.5,0);
    for(const yy of[6,18])for(const xx of[-2,2])dk.ball(.7,i%2?0xFFF0D3:0x505B86,xx,yy,-1.7,[1,1,.2]);dk.box(7,.5,.3,0xD3935A,0,12.5,-1.7);pivot.add(dk.build());
    const mat=new THREE.MeshBasicMaterial({color:0xFFD75F,transparent:true,opacity:0,depthWrite:false}),warn=new THREE.Mesh(new THREE.PlaneGeometry(W/2-5,14),mat);warn.rotation.x=-PI/2;warn.position.set(side*W/4,.17,0);base.add(warn);room.dom.push({u,p,pivot,warn,index:i,side});
   }
   // Train crossing. The middle wagon is a real open arch: collision only at its posts.
   const trainP=B.at(room.trainU,0),rail=DX.kit();for(const z of[-5,5])rail.box(244,.25,.7,Mt(0xA3A5AA),0,.18,z);for(let x=-120;x<=120;x+=9)rail.box(3,.4,15,0x805E49,x,0,0);
   // Plataforma e relógio vistos da aproximação. O vagão vazado mantém a passagem.
   const station=rail.at(-W/2-52,0,20);
   station.rbox(72,3,25,1.4,0xAF7A51,0,1.5,0);
   for(const x of[-27,27])station.box(3,23,3,0x327F85,x,14,0);
   station.ext([[-38,0],[0,11],[38,0]],29,0xBF5254,0,25,0);
   station.box(70,2,29,0xF8DC9A,0,25,0);
   station.cyl(6,6,2,0xFFF2CF,0,27,-16,[PI/2,0,0],null,24);
   station.box(1,4,.6,0x273954,0,28.5,-17.3);station.box(3.5,1,.6,0x273954,1.4,27,-17.3);
   rail.box(2,14,2,0x36435C,-W/2-7,7,-12);
   room.rail=B.put(rail,trainP.x,trainP.y+.2,trainP.z,trainP.h);const train=new THREE.Group();room.rail.add(train);room.train=train;room.trainP=trainP;
   for(let car=0;car<3;car++){const tk=DX.kit(),x=car*27-27,c=COLORS[car];
    if(car===1){tk.box(24,2,16,P(c),x,18,0);for(const s of[-1,1])tk.box(2,18,16,P(c),x+s*11,9,0)}
    else{tk.rbox(22,12,16,2,P(c),x,8,0);if(car===0){tk.box(9,7,14,P(0xF6D65D),x+4,17,0);tk.cyl(3,3,10,P(0xE35459),x-6,20,0)}}
    for(const xx of[-7,7])for(const s of[-1,1])tk.cyl(3,3,2,0x34384D,x+xx,3,s*8,[PI/2,0,0]);train.add(tk.build());
   }
   const signal=new THREE.Mesh(new THREE.SphereGeometry(2.5,12,8),new THREE.MeshBasicMaterial({color:0x63DDAB}));signal.position.set(-W/2-7,14,-12);room.rail.add(signal);room.signal=signal;
   // Mattress jump stripe and playful rubber ducks as knockable objects.
   const bp=B.at(room.bounceU,0),pad=DX.kit();pad.rbox(22,1.2,18,2,Sf(0xB396DF),0,.2,0);for(const x of[-6,0,6])pad.box(2,.2,12,Gw(0xFFF0CE),x,.9,0);room.pad=B.put(pad,bp.x,bp.y,bp.z,bp.h);
   const duck=DX.kit();duck.ball(2,P(0xFFD65C),0,2,0,[1,1,1.3]);duck.ball(1.4,P(0xFFD65C),0,4,1);duck.box(1.5,.5,1.7,P(0xEF8E3F),0,3.7,2.5);duck.ball(.2,0x333545,-.6,4.4,2.1);duck.ball(.2,0x333545,.6,4.4,2.1);
   B.knock(duck,[.07,.17,.48,.71,.91].map((u,i)=>{const p=B.at(u,(i%2?1:-1)*(W/2-6));return{x:p.x,y:p.y,z:p.z,s:1,r:p.h}}),{rad:2.5,cor:0xFFD65C,som:390});
   B.anim(()=>{if(!active())return;for(const dom of room.dom){const a=Q.domino(clock,dom.index);dom.pivot.rotation.z=dom.side*a.angle;dom.warn.material.opacity=a.warning?.25+.35*Math.abs(Math.sin(clock*12)):a.danger?.18:0}
    const t=Q.train(clock);room.train.visible=t.active;room.train.position.x=t.x;room.signal.material.color.set(t.warning||t.active?0xFF4659:0x63DDAB);
    room.dust.forEach((p,i)=>{const a=clock*5+i;p.position.set(room.vacLocal.x+Math.cos(a)*6,room.vacLocal.y+Math.sin(a*1.3)*6,room.vacLocal.z+Math.sin(a)*6)});
   });
  }
 });
 // Keep the map available in single races and championship with truthful count.
 if(!CAMP.includes('quarto'))CAMP.push('quarto');MODES.camp.sub=CAMP.length+' mapas · soma pontos';
 const oldStep=stepKart;
 function resetMotion(k){k.vy=0;k.gvy=0;k.air=false;k.pit=false;k.prevRamp=false;k.dOn=false;k.drift=0;k.boost=0;k.spin=0;k.bx=0;k.bz=0}
 function returnFromTube(k,m){const exit=ptAt(room.tubeExit,0),offset=Q.mod(exit.i-k.idx,N);k.prog+=offset;k.idx=k.fi=exit.i;k.x=exit.x;k.z=exit.z;k.y=k.gy=k.prevGy=exit.y;k.lat=0;k.h=k.mh=k.camH=exit.h;resetMotion(k);k.v=28;k.fallT=0;k.ghost=1.3;m.trip=null;m.cool=1.5;m.prev=k.prog;emit('respawn',k);say(k,'💨 CUSPIDO DE VOLTA! ACELERA!','#159B8B')}
 stepKart=function(k,inp,dt){
  if(!active())return oldStep(k,inp,dt);
  const m=memory(k);if(m.trip){const q=m.trip;q.t+=dt;k.fallT=2;k.v=0;const t=Math.min(1,q.t/.45),a=q.t*12,local=new THREE.Vector3(room.vacLocal.x+Math.cos(a)*4,room.vacLocal.y+Math.sin(a)*3,room.vacLocal.z+Math.sin(a)*4);room.tubeGroup.localToWorld(local);
   k.x=q.x+(local.x-q.x)*t;k.z=q.z+(local.z-q.z)*t;k.y=q.y+(local.y-q.y)*t;k.h+=dt*10;
   if(q.t>=1.8)returnFromTube(k,m);return;
  }
  m.cool=Math.max(0,m.cool-dt);const prev=k.prog;oldStep(k,inp,dt);
  if(state!=='go'||k.fin||k.fallT>0)return;
  if(m.cool<=0&&Q.crossed(prev,k.prog,Math.round(room.tubeU*N),N)&&Q.lane(k.lat,W)===room.wrong){resetMotion(k);k.fallT=2;m.trip={t:0,x:k.x,y:k.y,z:k.z};say(k,'🌀 ASPIRADOR! VOLTANDO EM 1,8s','#EA5268');if(k.human)sfx(130,.35,'sawtooth',.06);return}
  if(m.cool<=0&&!k.air){for(const dom of room.dom){const a=Q.domino(clock,dom.index);if(!a.danger)continue;const dx=k.x-dom.p.x,dz=k.z-dom.p.z,long=dx*Math.sin(dom.p.h)+dz*Math.cos(dom.p.h);const lateral=dx*Math.cos(dom.p.h)-dz*Math.sin(dom.p.h);if(Math.abs(lateral)<=W/2&&Q.dominoCollision(clock,dom.index,lateral,long,k.y-dom.p.y)){if(hitKart(k,{spin:.5,vmul:.45,msg:'🁢 DOMINÓ! OLHE A LUZ NO CHÃO.'}))m.cool=1.4;break}}
   const tr=Q.train(clock),p=room.trainP,dx=k.x-p.x,dz=k.z-p.z,lat=dx*Math.cos(p.h)-dz*Math.sin(p.h),long=dx*Math.sin(p.h)+dz*Math.cos(p.h),rel=lat-tr.x;
   if(Q.trainCollision(clock,lat,long,k.y-p.y)){if(hitKart(k,{spin:.6,vmul:.3,msg:'🚂 OLHE O SINAL DO TREM!'}))m.cool=1.4}
  }
  if(Q.crossed(prev,k.prog,Math.round(room.bounceU*N),N)&&Math.abs(k.lat)<11&&!k.air){k.air=true;k.vy=22;k.y+=.5;emit('jump',k);say(k,'🛏️ BOING! SALTO DO COLCHÃO!','#9362CD')}
  m.prev=k.prog;
 };
 // Bots aim for a safe tube and the open side of each domino. Same hazards as humans.
 const oldBot=botInput;
 botInput=function(k,dt){if(!active())return oldBot(k,dt);let desired=null;const ahead=u=>Q.mod(u*N-k.idx,N)*SEG;
  if(ahead(room.tubeU)<120){const chosen=room.wrong===1?0:1;desired=(chosen-1)*W/3}
  for(const dom of room.dom){if(ahead(dom.u)<75&&(Q.domino(clock,dom.index).warning||Q.domino(clock,dom.index).danger))desired=-dom.side*W*.23}
  if(desired!==null){k.botLat=desired;k.botT=1}const input=oldBot(k,dt);
  const tr=Q.train(clock);if(ahead(room.trainU)<55&&(tr.warning||tr.active)){input.thr=k.v>10?-1:0}
  return input;
 };
 on('start',()=>{mem=new WeakMap();clock=0;if(active()){room.wrong=Q.wrongLane(round++);room.lastBell=-1;room.paintSigns()}});
 on('update',dt=>{if(!active()||state!=='go')return;clock+=dt;const beat=Math.floor(clock*3);if(Q.train(clock).warning&&beat!==room.lastBell&&karts.some(k=>k.human&&Math.hypot(k.x-room.trainP.x,k.z-room.trainP.z)<160)){room.lastBell=beat;sfx(880,.12,'sine',.04)}});
})();
