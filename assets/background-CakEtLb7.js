import{O as t,v as I,c as z,g as C,b as M,N as A,r as b,S as x,C as S,M as k,T as g,f as D}from"./api-llOxmmPe.js";const N=`
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
uniform vec3 tint;
float lineDistance(vec2 p,vec2 a,vec2 b) {
 vec2 v=b-a;float f=clamp(dot(p-a,v)/max(dot(v,v),0.001),0.0,1.0);
 return length(p-a-v*f);
}
half4 main(float2 coord) {
 vec2 p=coord-vec2(pad,size.y*0.5);
 float glow=0.0;float blue=0.0;float smoke=0.0;
 for(int i=0;i<6;i++) {
  if(float(i)>=burst)break;
  float t=elapsed-float(i)*0.13;
  if(t<0.0)continue;
  float flash=max(0.0,1.0-t/0.105);
  float muzzle=length(vec2(p.x/1.6,p.y));
  float rays=0.45+0.55*pow(abs(cos(atan(p.y,p.x)*4.0)),5.0);
  glow+=exp(-muzzle/max(radius*0.3,5.0))*flash*rays*2.8;
  for(int j=0;j<7;j++) {
   if(float(j)>=pellets)break;
   float fan=pellets>1.0?(float(j)-3.0)/3.0:sin(float(i)*7.1)*0.5;
   vec2 end=vec2(rangePx,miss+spread*fan);
   float lengthRay=length(end);vec2 dir=end/lengthRay;
   float arrival=lengthRay/speed;
   float head=min(t*speed,lengthRay);
   if(t<arrival) {
    float tail=max(0.0,head-min(120.0,lengthRay*0.25));
    float d=lineDistance(p,dir*tail,dir*head);
    glow+=exp(-d/max(0.8,thickness))*0.95;
    glow+=exp(-length(p-dir*head)/max(1.5,thickness*2.0));
   }
   float age=t-arrival;
   if(age>=0.0&&age<0.55) {
    vec2 hit=p-end;float fade=1.0-age/0.55;
    if(shield>0.5) {
     float ring=abs(length(hit)-(radius*0.4+age*radius*1.4));
     blue+=exp(-ring/2.5)*fade;
     blue+=exp(-length(hit)/max(radius*0.4,8.0))*fade*0.3;
    } else {
     glow+=exp(-length(hit)/max(3.0,10.0-age*18.0))*fade*1.6;
     for(int k=0;k<5;k++) {
      float a=float(k)*2.4+float(j)*0.7+float(i);
      vec2 spark=vec2(cos(a),sin(a))*age*radius*2.2;
      glow+=exp(-lineDistance(hit,spark*0.65,spark)/1.2)*fade*0.75;
     }
     smoke+=exp(-length(hit-vec2(0.0,-age*radius*0.6))/max(5.0,age*radius*0.7))*fade*0.12;
    }
   }
  }
 }
 float alpha=clamp(glow+blue+smoke,0.0,1.0);
 vec3 c=(tint*glow+vec3(0.25,0.8,1.0)*blue+vec3(0.5)*smoke)/max(glow+blue+smoke,0.001);
 c=mix(c,vec3(1.0,0.95,0.8),smoothstep(1.0,3.5,glow)*0.5);
 return half4(c*alpha,alpha);
}`,s=new Map,u=new Set;let w=!1,h=0,y=!0;function T(i){y=i,i||E()}async function E(){h++;const i=Array.from(s.keys());s.clear(),i.length&&await t.scene.isReady()&&await t.scene.local.deleteItems(i)}async function O(i){if(!y||!I(i)||u.has(i.id)||s.size>=4||!await t.scene.isReady())return;const o=i,c=h;u.add(o.id),u.size>200&&u.delete(u.values().next().value);const a=await t.scene.items.getItems([o.shooter,...o.target?[o.target]:[]]),e=a.find(d=>d.id===o.shooter),n=a.find(d=>d.id===o.target);if(!e||!e.visible||o.target&&(!n||!n.visible))return;const m=await t.scene.items.getItemBounds([e.id]),p=n?(await t.scene.items.getItemBounds([n.id])).center:o.point,r=z(o.settings),l=C(m.center,p,Math.max(m.width,m.height),r);if(c!==h||!y||s.size>=4)return;const v=[1,3,5].map(d=>parseInt(r.color.slice(d,d+2),16)/255),f=M().name("枪火演出").effectType("STANDALONE").width(l.width).height(l.height).position(l.position).rotation(l.rotation).layer("ATTACHMENT").locked(!0).disableHit(!0).sksl(N).uniforms([{name:"elapsed",value:0},{name:"rangePx",value:l.distance},{name:"pad",value:l.pad},{name:"spread",value:l.spread},{name:"miss",value:l.miss},{name:"radius",value:l.radius},{name:"speed",value:r.speed},{name:"burst",value:r.burst},{name:"pellets",value:r.weapon==="shotgun"?7:1},{name:"thickness",value:r.thickness},{name:"shield",value:r.result==="shield"?1:0},{name:"tint",value:{x:v[0],y:v[1],z:v[2]}}]).metadata({[A]:!0}).build();s.set(f.id,{started:performance.now(),duration:l.duration});try{await t.scene.local.addItems([f]),c!==h&&(await t.scene.local.deleteItems([f.id]),s.delete(f.id))}catch(d){throw s.delete(f.id),d}}function j(){setInterval(()=>{H().catch(console.error)},33),t.scene.onReadyChange(()=>{E().catch(console.error)})}async function H(){if(!(w||!s.size)){w=!0;try{if(!await t.scene.isReady()){s.clear();return}const i=performance.now(),o=[],c=[];for(const[a,e]of s)(i-e.started)/1e3>e.duration?(o.push(a),s.delete(a)):c.push(a);o.length&&await t.scene.local.deleteItems(o),c.length&&await t.scene.local.updateItems(c,a=>{for(const e of a){const n=s.get(e.id);if(e.type==="EFFECT"&&n){const p=e.uniforms.find(r=>r.name==="elapsed");p&&(p.value=(i-n.started)/1e3)}}})}finally{w=!1}}}const R=new URL("./icon.svg",location.href).href;t.onReady(async()=>{j(),T(b().enabled),window.addEventListener("storage",a=>{a.key===x&&T(b().enabled)});const i=new Map;t.broadcast.onMessage(S,a=>{const e=performance.now();e-(i.get(a.connectionId)??-1e3)<250||(i.set(a.connectionId,e),i.size>100&&i.delete(i.keys().next().value),O(a.data).catch(console.error))});let o;await t.tool.create({id:g,icons:[{icon:R,label:"枪火：点击目标开火"}],defaultMode:k,onClick:async a=>{a.activeTool!==g&&(o=a.activeTool)}}),await t.tool.createMode({id:k,icons:[{icon:R,label:"点击目标开火",filter:{activeTools:[g]}}],cursors:[{cursor:"crosshair"}],preventDrag:{},onToolClick:async(a,e)=>{try{const n=e.target?.type==="IMAGE"&&e.target.layer==="CHARACTER"?e.target.id:void 0;await D(e.pointerPosition,n)}catch(n){await t.notification.show(n instanceof Error?n.message:"开火失败","ERROR")}return!0},onKeyDown:(a,e)=>{e.key==="Escape"&&o&&t.tool.activateTool(o)}});const c=await t.player.getConnectionId();t.broadcast.onMessage(x,a=>{if(a.connectionId!==c)return;const e=a.data;e?.previousTool&&e.previousTool!==g&&(o=e.previousTool),e?.cancel&&o&&t.tool.activateTool(o)})});
