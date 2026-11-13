/* Deterministic rules shared by room scenery, bots and collision checks. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.KRRoomRules=api})(typeof window==='undefined'?this:window,function(){
 'use strict';
 const mod=(x,n)=>(x%n+n)%n;
 const lane=(lat,width)=>Math.max(0,Math.min(2,Math.floor((lat+width/2)/(width/3))));
 const wrongLane=round=>mod(round,3);
 function domino(time,index){const phase=mod(time,10),begin=2+index*.42,age=phase-begin;
  return{warning:age>=-1.4&&age<0,angle:age<0?0:age<.55?age/.55*1.48:age<2?1.48:age<3?1.48*(3-age):0,danger:age>=0&&age<2.7,side:index%2?1:-1};}
 function train(time){const phase=mod(time,12);return{warning:phase<2,active:phase>=2&&phase<6,x:-115+(phase-2)*57.5,phase};}
 function crossed(prev,next,gate,n){return next>prev&&next-prev<n/2&&Math.floor((prev-gate)/n)!==Math.floor((next-gate)/n);}
 function trainCollision(time,lat,long,height){const t=train(time),rel=lat-t.x;return t.active&&Math.abs(long)<11&&Math.abs(height)<12&&(Math.abs(rel+27)<13||Math.abs(rel-27)<13||Math.abs(Math.abs(rel)-11)<3)}
 function dominoCollision(time,index,lat,long,height){const d=domino(time,index);return d.danger&&Math.abs(long)<6&&Math.abs(height)<8&&lat*d.side>4}
 return{lane,wrongLane,domino,train,crossed,mod,trainCollision,dominoCollision};
});
