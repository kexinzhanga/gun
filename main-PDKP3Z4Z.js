import{O as i,v as I,c as C,g as L,b as D,N as M,r as b,S as y,C as j,M as w,T as u,f as A}from"./api-CV9-bY2L.js";const F=`
uniform vec2 size;
uniform float elapsed;
uniform float rangePx;
uniform float pad;
uniform float spread;
uniform float miss;
uniform float radius;
uniform float speed;
uniform float burst;
uniform float pellets;
uniform float thickness;
uniform float shield;
uniform float kind;
uniform float seed;
uniform float smokeStrength;
uniform vec3 tint;
float hash11(float n){return fract(sin(n*12.9898+seed*0.071)*43758.5453);}
float lineDistance(vec2 p,vec2 a,vec2 b){
 vec2 v=b-a;float f=clamp(dot(p-a,v)/max(dot(v,v),0.001),0.0,1.0);
 return length(p-a-v*f);
}
half4 main(float2 coord){
 vec2 p=coord-vec2(pad,size.y*0.5);
 float hot=0.0;float blue=0.0;float smoke=0.0;float rocketFire=0.0;
 // Ballistic weapons: randomized but seed-stable paths and muzzle smoke.
 if(kind<0.5){
  for(int i=0;i<6;i++){
   if(float(i)>=burst)break;
   float t=elapsed-float(i)*0.13;
   if(t<0.0)continue;
   float flash=max(0.0,1.0-t/0.11);
   float muzzle=length(vec2(p.x/1.7,p.y));
   float rays=0.4+0.6*pow(abs(cos(atan(p.y,p.x)*4.0+hash11(float(i))*2.0)),6.0);
   hot+=exp(-muzzle/max(radius*0.32,5.0))*flash*rays*3.2;
   for(int s=0;s<5;s++){
    float age=t-float(s)*0.035;
    if(age>=0.0&&age<0.8){
     float side=(hash11(float(i*17+s))-0.5)*radius*0.7;
     vec2 puff=vec2(-age*radius*0.3,side-age*radius*0.32);
     float puffSize=max(5.0,radius*(0.12+age*0.5));
     smoke+=exp(-length(p-puff)/puffSize)*(1.0-age/0.8)*smokeStrength*0.24;
    }
   }
   for(int j=0;j<7;j++){
    if(float(j)>=pellets)break;
    float n=float(i*11+j);
    float fan=pellets>1.0?(float(j)-3.0)/3.0:0.0;
    float randomScatter=(hash11(n+2.1)-0.5)*spread*1.25;
    float missSide=miss>0.0?miss*(hash11(n+8.7)>0.5?1.0:-1.0):0.0;
    vec2 impact=vec2(rangePx,missSide+spread*fan+randomScatter);
    float rayLength=length(impact);vec2 dir=impact/rayLength;
    float arrival=rayLength/speed;float head=min(t*speed,rayLength);
    if(t<arrival){
     float tail=max(0.0,head-min(145.0,rayLength*0.28));
     float d=lineDistance(p,dir*tail,dir*head);
     hot+=exp(-d/max(0.8,thickness))*0.9;
     hot+=exp(-length(p-dir*head)/max(1.5,thickness*2.2));
    }
    float age=t-arrival;
    if(age>=0.0&&age<0.65){
     vec2 hit=p-impact;float fade=1.0-age/0.65;
     if(shield>0.5){
      float ring=abs(length(hit)-(radius*0.35+age*radius*1.45));
      blue+=exp(-ring/2.8)*fade;
     }else{
      hot+=exp(-length(hit)/max(3.0,11.0-age*15.0))*fade*1.7;
      for(int k=0;k<5;k++){
       float a=float(k)*2.39+hash11(n+float(k))*1.5;
       vec2 spark=vec2(cos(a),sin(a))*age*radius*(1.3+hash11(n+float(k)+4.0));
       hot+=exp(-lineDistance(hit,spark*0.55,spark)/1.3)*fade*0.8;
      }
     }
    }
   }
  }
 }
 // Energy weapon: a charging pulse and persistent luminous beam, no smoke.
 if(kind>0.5&&kind<1.5){
  for(int i=0;i<6;i++){
   if(float(i)>=burst)break;
   float t=elapsed-float(i)*0.18;float arrival=rangePx/speed;
   if(t<0.0)continue;
   float charge=max(0.0,1.0-t/0.14);
   blue+=exp(-length(p)/max(5.0,radius*0.24))*charge*2.2;
   float grow=clamp(t/max(arrival,0.04),0.0,1.0);
   float beamFade=(1.0-smoothstep(arrival+0.12,arrival+0.38,t));
   float jitter=(hash11(float(i)+3.0)-0.5)*spread*0.3;
   vec2 impact=vec2(rangePx,jitter);
   float d=lineDistance(p,vec2(0.0,0.0),impact*grow);
   blue+=exp(-d/max(1.0,thickness*1.15))*beamFade*1.3;
   blue+=exp(-d/max(2.0,thickness*3.5))*beamFade*0.35;
   float age=t-arrival;
   if(age>=0.0&&age<0.65){
    vec2 hit=p-impact;float fade=1.0-age/0.65;
    float ring=abs(length(hit)-(radius*0.2+age*radius*1.5));
    blue+=exp(-ring/2.8)*fade*(shield>0.5?1.5:0.9);
    hot+=shield<0.5?exp(-length(hit)/max(4.0,radius*0.18))*fade:0.0;
   }
  }
 }
 // RPG: visible projectile, turbulent exhaust/smoke trail and large explosion.
 if(kind>1.5){
  float t=elapsed;float arrival=rangePx/speed;
  float missSide=miss>0.0?miss*(hash11(6.0)>0.5?1.0:-1.0):0.0;
  vec2 impact=vec2(rangePx,missSide+(hash11(3.0)-0.5)*spread);
  float rayLength=length(impact);vec2 dir=impact/rayLength;
  float head=min(t*speed,rayLength);
  if(t<arrival){
   vec2 rocket=dir*head;
   hot+=exp(-length(p-rocket)/max(3.0,thickness*2.1))*1.8;
   rocketFire+=exp(-lineDistance(p,dir*max(0.0,head-radius*0.55),rocket)/max(2.0,thickness*2.0))*1.4;
   for(int s=0;s<10;s++){
    float lag=float(s)*radius*0.18;float wobble=(hash11(float(s))-0.5)*radius*0.35;
    vec2 puff=dir*max(0.0,head-lag)+vec2(-dir.y,dir.x)*wobble;
    float age=lag/max(speed,1.0);
    smoke+=exp(-length(p-puff)/max(5.0,radius*(0.1+age*1.4)))*0.2*smokeStrength;
   }
  }
  float age=t-arrival;
  if(age>=0.0&&age<1.15){
   vec2 hit=p-impact;float fade=1.0-age/1.15;
   if(shield>0.5){
    float ring=abs(length(hit)-(radius*0.45+age*radius*2.1));blue+=exp(-ring/3.2)*fade*1.7;
   }else{
    float blastRadius=radius*(0.18+age*2.4);
    hot+=exp(-length(hit)/max(5.0,blastRadius))*fade*2.2;
    hot+=exp(-abs(length(hit)-blastRadius)/max(2.0,radius*0.06))*fade*1.4;
    for(int k=0;k<8;k++){
     float a=float(k)*0.785+hash11(float(k)+9.0)*0.5;
     vec2 spark=vec2(cos(a),sin(a))*age*radius*(1.5+hash11(float(k))*2.0);
     hot+=exp(-lineDistance(hit,spark*0.45,spark)/1.7)*fade;
    }
    smoke+=exp(-length(hit-vec2(0.0,-age*radius*0.55))/max(8.0,blastRadius*0.8))*fade*0.45*smokeStrength;
   }
  }
 }
 float alpha=clamp(hot+blue+smoke+rocketFire,0.0,1.0);
 vec3 smokeColor=vec3(0.31,0.33,0.36);
 vec3 c=(tint*(hot+rocketFire)+vec3(0.36,0.88,1.0)*blue+smokeColor*smoke)/max(hot+blue+smoke+rocketFire,0.001);
 c=mix(c,vec3(1.0,0.96,0.82),smoothstep(1.0,3.2,hot)*0.55);
 return half4(c*alpha,alpha);
}`,r=new Map,h=new Set;let k=!1,g=0,x=!0;function S(o){x=o,o||R()}async function R(){g++;const o=Array.from(r.keys());r.clear(),o.length&&await i.scene.isReady()&&await i.scene.local.deleteItems(o)}async function P(o){if(!x||!I(o)||h.has(o.id)||r.size>=4||!await i.scene.isReady())return;const t=o,f=g;h.add(t.id),h.size>200&&h.delete(h.values().next().value);const a=await i.scene.items.getItems([t.shooter,...t.target?[t.target]:[]]),e=a.find(c=>c.id===t.shooter),n=a.find(c=>c.id===t.target);if(!e||!e.visible||t.target&&(!n||!n.visible))return;const m=await i.scene.items.getItemBounds([e.id]),p=n?(await i.scene.items.getItemBounds([n.id])).center:t.point,s=C(t.settings),l=L(m.center,p,Math.max(m.width,m.height),s);if(f!==g||!x||r.size>=4)return;const v=[1,3,5].map(c=>parseInt(s.color.slice(c,c+2),16)/255),z=s.weapon==="energy"?1:s.weapon==="rpg"?2:0,E=s.weapon==="energy"?0:s.weapon==="pistol"?.55:s.weapon==="rifle"?.78:1,d=D().name("枪火演出").effectType("STANDALONE").width(l.width).height(l.height).position(l.position).rotation(l.rotation).layer("ATTACHMENT").locked(!0).disableHit(!0).sksl(F).uniforms([{name:"elapsed",value:0},{name:"rangePx",value:l.distance},{name:"pad",value:l.pad},{name:"spread",value:l.spread},{name:"miss",value:l.miss},{name:"radius",value:l.radius},{name:"speed",value:l.projectileSpeed},{name:"burst",value:s.burst},{name:"pellets",value:s.weapon==="shotgun"?7:1},{name:"thickness",value:s.thickness},{name:"shield",value:s.result==="shield"?1:0},{name:"kind",value:z},{name:"seed",value:t.seed},{name:"smokeStrength",value:E},{name:"tint",value:{x:v[0],y:v[1],z:v[2]}}]).metadata({[M]:!0}).build();r.set(d.id,{started:performance.now(),duration:l.duration});try{await i.scene.local.addItems([d]),f!==g&&(await i.scene.local.deleteItems([d.id]),r.delete(d.id))}catch(c){throw r.delete(d.id),c}}function N(){setInterval(()=>{O().catch(console.error)},33),i.scene.onReadyChange(()=>{R().catch(console.error)})}async function O(){if(!(k||!r.size)){k=!0;try{if(!await i.scene.isReady()){r.clear();return}const o=performance.now(),t=[],f=[];for(const[a,e]of r)(o-e.started)/1e3>e.duration?(t.push(a),r.delete(a)):f.push(a);t.length&&await i.scene.local.deleteItems(t),f.length&&await i.scene.local.updateItems(f,a=>{for(const e of a){const n=r.get(e.id);if(e.type==="EFFECT"&&n){const p=e.uniforms.find(s=>s.name==="elapsed");p&&(p.value=(o-n.started)/1e3)}}})}finally{k=!1}}}const T=new URL("./icon.svg",location.href).href;i.onReady(async()=>{N(),S(b().enabled),window.addEventListener("storage",a=>{a.key===y&&S(b().enabled)});const o=new Map;i.broadcast.onMessage(j,a=>{const e=performance.now();e-(o.get(a.connectionId)??-1e3)<250||(o.set(a.connectionId,e),o.size>100&&o.delete(o.keys().next().value),P(a.data).catch(console.error))});let t;await i.tool.create({id:u,icons:[{icon:T,label:"枪火：点击目标开火"}],defaultMode:w,onClick:async a=>{a.activeTool!==u&&(t=a.activeTool)}}),await i.tool.createMode({id:w,icons:[{icon:T,label:"点击目标开火",filter:{activeTools:[u]}}],cursors:[{cursor:"crosshair"}],preventDrag:{},onToolClick:async(a,e)=>{try{const n=e.target?.type==="IMAGE"&&e.target.layer==="CHARACTER"?e.target.id:void 0;await A(e.pointerPosition,n)}catch(n){await i.notification.show(n instanceof Error?n.message:"开火失败","ERROR")}return!0},onKeyDown:(a,e)=>{e.key==="Escape"&&t&&i.tool.activateTool(t)}});const f=await i.player.getConnectionId();i.broadcast.onMessage(y,a=>{if(a.connectionId!==f)return;const e=a.data;e?.previousTool&&e.previousTool!==u&&(t=e.previousTool),e?.cancel&&t&&i.tool.activateTool(t)})});
