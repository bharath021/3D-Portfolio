import { useState, useEffect, useRef } from "react";

const A="#00d9ff",A2="#7c3aed",A3="#10b981",BG="#080c10",SU="#0d1117",PN="#111820",BD="#1e2d3d",TX="#e2e8f0",MU="#64748b",GL="#f59e0b",PK="#e879f9";

// ── Neural BG ──
function NeuralBg(){
  const r=useRef(null);
  useEffect(()=>{
    const cv=r.current; if(!cv)return;
    const cx=cv.getContext("2d"); let W=0,H=0,id;
    const resize=()=>{W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;};
    resize(); window.addEventListener("resize",resize);
    const pts=Array.from({length:80},()=>({x:Math.random()*1600-200,y:Math.random()*1200-100,z:.3+Math.random()*.7,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,hue:Math.random()<.6?192:270}));
    let hs=0,mx=800,my=400,sy=0;
    const m=e=>{mx=e.clientX;my=e.clientY;};
    const s=()=>{sy=window.scrollY;};
    window.addEventListener("mousemove",m); window.addEventListener("scroll",s);
    const draw=()=>{
      cx.clearRect(0,0,W,H); hs+=.07;
      pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<-200)p.x=W+100;if(p.x>W+200)p.x=-100;if(p.y<-100)p.y=H+100;if(p.y>H+100)p.y=-100;});
      const pj=pts.map(p=>({...p,px:p.x+(mx-W/2)*.03*(1-p.z),py:p.y+(my-H/2)*.02*(1-p.z)-sy*.06}));
      for(let i=0;i<pj.length;i++)for(let j=i+1;j<pj.length;j++){
        const a=pj[i],b=pj[j],dx=a.px-b.px,dy=a.py-b.py,d=Math.sqrt(dx*dx+dy*dy);
        if(d<140){const al=(1-d/140)*.16*a.z*b.z;const g=cx.createLinearGradient(a.px,a.py,b.px,b.py);g.addColorStop(0,`hsla(${a.hue+hs*.2},100%,65%,${al})`);g.addColorStop(1,`hsla(${b.hue+hs*.2},100%,65%,${al})`);cx.beginPath();cx.moveTo(a.px,a.py);cx.lineTo(b.px,b.py);cx.strokeStyle=g;cx.lineWidth=a.z*.6;cx.stroke();}
      }
      pj.forEach(p=>{const rv=2*p.z,al=.4+.6*p.z,h=p.hue+hs*.3;const gw=cx.createRadialGradient(p.px,p.py,0,p.px,p.py,rv*5);gw.addColorStop(0,`hsla(${h},100%,70%,${al*.3})`);gw.addColorStop(1,`hsla(${h},100%,70%,0)`);cx.beginPath();cx.arc(p.px,p.py,rv*5,0,Math.PI*2);cx.fillStyle=gw;cx.fill();cx.beginPath();cx.arc(p.px,p.py,rv,0,Math.PI*2);cx.fillStyle=`hsla(${h},100%,80%,${al})`;cx.fill();});
      id=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",resize);window.removeEventListener("mousemove",m);window.removeEventListener("scroll",s);};
  },[]);
  return <canvas ref={r} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",width:"100%",height:"100%"}}/>;
}

// ── 3D Skill Globe ──
function SkillGlobe(){
  const r=useRef(null);
  useEffect(()=>{
    const cv=r.current; if(!cv)return;
    const S=460; cv.width=S; cv.height=S;
    const cx=cv.getContext("2d"); const CX=S/2,CY=S/2,R=145;
    const skills=[{l:"Java",c:A},{l:"React",c:A2},{l:"Spring Boot",c:A3},{l:"AWS",c:GL},{l:"Docker",c:A},{l:"Python",c:PK},{l:"Kubernetes",c:A2},{l:"Node.js",c:A3},{l:"TypeScript",c:A},{l:"MongoDB",c:GL},{l:"PostgreSQL",c:A3},{l:"TensorFlow",c:PK},{l:"Azure",c:A2},{l:"Jenkins",c:A},{l:"Redis",c:GL},{l:"GraphQL",c:PK}];
    const nodes=skills.map((s,i)=>{const phi=Math.acos(1-2*(i+.5)/skills.length),theta=Math.PI*(1+Math.sqrt(5))*i;return{l:s.l,c:s.c,ox:Math.sin(phi)*Math.cos(theta),oy:Math.cos(phi),oz:Math.sin(phi)*Math.sin(theta)};});
    const lats=[.5,1,1.6,2.2,2.7],lons=Array.from({length:8},(_,i)=>i*Math.PI/4);
    const rY=(x,y,z,a)=>({x:x*Math.cos(a)+z*Math.sin(a),y,z:-x*Math.sin(a)+z*Math.cos(a)});
    const rX=(x,y,z,a)=>({x,y:y*Math.cos(a)-z*Math.sin(a),z:y*Math.sin(a)+z*Math.cos(a)});
    const rZ=(x,y,z,a)=>({x:x*Math.cos(a)-y*Math.sin(a),y:x*Math.sin(a)+y*Math.cos(a),z});
    const pr=(x,y,z,ry,rx)=>{let v=rY(x,y,z,ry);v=rX(v.x,v.y,v.z,rx);const p=580/(580+v.z*R);return{sx:CX+v.x*R*p,sy:CY-v.y*R*p,z:v.z,sc:p};};
    const hx=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
    const rings=[{tx:.4,tz:0,sp:.013,r:R*1.28,c:A},{tx:1.1,tz:.5,sp:-.01,r:R*1.42,c:A2},{tx:.7,tz:1.2,sp:.008,r:R*1.58,c:A3}];
    let oa=[0,2.1,4.2],ry=0,id;
    const frame=()=>{
      cx.clearRect(0,0,S,S); ry+=.005; oa=oa.map((a,i)=>a+rings[i].sp);
      const rx2=.22+Math.sin(ry*.22)*.16;
      const bg=cx.createRadialGradient(CX,CY,0,CX,CY,R*2);bg.addColorStop(0,"rgba(0,217,255,0.06)");bg.addColorStop(.5,"rgba(124,58,237,0.03)");bg.addColorStop(1,"rgba(0,0,0,0)");cx.fillStyle=bg;cx.fillRect(0,0,S,S);
      rings.forEach((ring,ri)=>{
        const[r2,g2,b2]=hx(ring.c);
        cx.save();cx.translate(CX,CY);cx.rotate(ring.tz);cx.scale(1,Math.cos(ring.tx));cx.beginPath();cx.ellipse(0,0,ring.r,ring.r,0,0,Math.PI*2);cx.strokeStyle=`rgba(${r2},${g2},${b2},0.18)`;cx.lineWidth=1;cx.setLineDash([4,8]);cx.stroke();cx.setLineDash([]);cx.restore();
        const sa=oa[ri];let v=rZ(ring.r/R*Math.cos(sa),0,ring.r/R*Math.sin(sa),ring.tz);v=rX(v.x,v.y,v.z,ring.tx);
        const ps=580/(580+v.z*R),scx=CX+v.x*R*ps,scy=CY-v.y*R*ps,sal=Math.max(0,.3+v.z*.6);
        const tr=cx.createRadialGradient(scx,scy,0,scx,scy,16);tr.addColorStop(0,`rgba(${r2},${g2},${b2},${sal*.8})`);tr.addColorStop(1,`rgba(${r2},${g2},${b2},0)`);cx.beginPath();cx.arc(scx,scy,16,0,Math.PI*2);cx.fillStyle=tr;cx.fill();cx.beginPath();cx.arc(scx,scy,3.5*ps,0,Math.PI*2);cx.fillStyle=`rgba(${r2},${g2},${b2},${Math.min(sal,1)})`;cx.fill();
      });
      cx.strokeStyle="rgba(0,217,255,0.09)";cx.lineWidth=.8;
      lats.forEach(lat=>{const ry2=Math.sin(lat),yo=Math.cos(lat);cx.beginPath();for(let i=0;i<=44;i++){const ang=(i/44)*Math.PI*2,p=pr(ry2*Math.cos(ang),yo,ry2*Math.sin(ang),ry,rx2);i===0?cx.moveTo(p.sx,p.sy):cx.lineTo(p.sx,p.sy);}cx.stroke();});
      lons.forEach(lon=>{cx.beginPath();for(let i=0;i<=44;i++){const l=(i/44)*Math.PI,p=pr(Math.sin(l)*Math.cos(lon),Math.cos(l),Math.sin(l)*Math.sin(lon),ry,rx2);i===0?cx.moveTo(p.sx,p.sy):cx.lineTo(p.sx,p.sy);}cx.stroke();});
      const projected=nodes.map(n=>({...n,...pr(n.ox,n.oy,n.oz,ry,rx2)})).sort((a,b)=>a.z-b.z);
      projected.forEach(n=>{
        const al=Math.max(0,.2+(n.z+1)*.4);const[r2,g2,b2]=hx(n.c);const dr=Math.max(2.5,4.5*n.sc);
        const dg=cx.createRadialGradient(n.sx,n.sy,0,n.sx,n.sy,dr*7);dg.addColorStop(0,`rgba(${r2},${g2},${b2},${al*.5})`);dg.addColorStop(1,`rgba(${r2},${g2},${b2},0)`);cx.beginPath();cx.arc(n.sx,n.sy,dr*7,0,Math.PI*2);cx.fillStyle=dg;cx.fill();
        cx.beginPath();cx.arc(n.sx,n.sy,dr,0,Math.PI*2);cx.fillStyle=`rgba(${r2},${g2},${b2},${Math.min(al*1.3,1)})`;cx.fill();
        if(n.z>-.05){const fs=Math.max(9,Math.round(11*n.sc));cx.font=`bold ${fs}px monospace`;const tw=cx.measureText(n.l).width,pad=5,th=fs+8,lx=n.sx-tw/2-pad,ly=n.sy+dr+5;cx.fillStyle=`rgba(8,12,16,${al*.92})`;cx.strokeStyle=`rgba(${r2},${g2},${b2},${al*.9})`;cx.lineWidth=1;cx.beginPath();cx.roundRect(lx,ly,tw+pad*2,th,4);cx.fill();cx.stroke();cx.fillStyle=`rgba(${r2},${g2},${b2},${Math.min(al*1.6,1)})`;cx.textAlign="center";cx.textBaseline="middle";cx.fillText(n.l,n.sx,ly+th/2);}
      });
      const pulse=.7+.3*Math.sin(ry*3);const cg=cx.createRadialGradient(CX,CY,0,CX,CY,22*pulse);cg.addColorStop(0,"rgba(0,217,255,0.9)");cg.addColorStop(.4,"rgba(0,217,255,0.3)");cg.addColorStop(1,"rgba(0,217,255,0)");cx.beginPath();cx.arc(CX,CY,22*pulse,0,Math.PI*2);cx.fillStyle=cg;cx.fill();
      id=requestAnimationFrame(frame);
    };
    frame();
    return()=>cancelAnimationFrame(id);
  },[]);
  return <canvas ref={r} style={{width:460,height:460,pointerEvents:"none",display:"block"}}/>;
}

// ── 3D Floating Cubes ──
function FloatingCubes(){
  const r=useRef(null);
  useEffect(()=>{
    const cv=r.current; if(!cv)return;
    const cx=cv.getContext("2d"); let W=0,H=0,id;
    const resize=()=>{W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const cubes=[
      {x:.10,y:.20,z:.3,rx:.3,ry:.5,rz:.1,vrx:.007,vry:.011,vrz:.005,vx:.0005,vy:.0004,s:26,c:A,a:.55},
      {x:.85,y:.20,z:.7,rx:1,ry:.2,rz:.8,vrx:.009,vry:-.007,vrz:.006,vx:-.0004,vy:.0005,s:20,c:A2,a:.5},
      {x:.90,y:.68,z:.5,rx:.5,ry:1.1,rz:.3,vrx:-.006,vry:.008,vrz:.009,vx:-.0003,vy:-.0005,s:17,c:A3,a:.45},
      {x:.06,y:.75,z:.4,rx:.2,ry:.7,rz:1.2,vrx:.008,vry:.006,vrz:-.007,vx:.0006,vy:-.0004,s:22,c:GL,a:.5},
      {x:.50,y:.07,z:.6,rx:.9,ry:.4,rz:.6,vrx:-.007,vry:.009,vrz:.005,vx:.0003,vy:.0006,s:15,c:PK,a:.4},
      {x:.42,y:.90,z:.3,rx:.4,ry:1.3,rz:.2,vrx:.006,vry:-.008,vrz:.007,vx:-.0005,vy:.0003,s:19,c:A,a:.38},
      {x:.75,y:.45,z:.8,rx:1.2,ry:.6,rz:.9,vrx:.005,vry:.007,vrz:-.008,vx:.0004,vy:.0005,s:13,c:A2,a:.42},
      {x:.20,y:.50,z:.2,rx:.7,ry:1,rz:.4,vrx:-.009,vry:.005,vrz:.006,vx:-.0003,vy:-.0003,s:11,c:A3,a:.35},
    ];
    const p2=(x,y,z)=>{const f=480/(480+z*180);return{x:x*f,y:y*f,sc:f};};
    const drawCube=(ccx,ccy,sz,rx,ry,rz,col,al)=>{
      const h=sz/2,c=Math.cos,s=Math.sin;
      const verts=[[-h,-h,-h],[h,-h,-h],[h,h,-h],[-h,h,-h],[-h,-h,h],[h,-h,h],[h,h,h],[-h,h,h]];
      const rot=verts.map(([x,y,z])=>{let ny=y*c(rx)-z*s(rx),nz=y*s(rx)+z*c(rx);y=ny;z=nz;let nx=x*c(ry)+z*s(ry);nz=-x*s(ry)+z*c(ry);x=nx;z=nz;nx=x*c(rz)-y*s(rz);ny=x*s(rz)+y*c(rz);x=nx;y=ny;return[x,y,z];});
      const pts=rot.map(([x,y,z])=>{const p=p2(x,y,z);return{px:ccx+p.x,py:ccy+p.y,z};});
      const faces=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[0,3,7,4],[1,2,6,5]];
      const bright=[1,.3,.7,.5,.6,.8];
      const fd=faces.map((vi,fi)=>({vi,fi,avgZ:vi.reduce((sum,i)=>sum+rot[i][2],0)/4})).sort((a,b)=>a.avgZ-b.avgZ);
      const[r2,g2,b2]=[parseInt(col.slice(1,3),16),parseInt(col.slice(3,5),16),parseInt(col.slice(5,7),16)];
      fd.forEach(({vi,fi})=>{const v2=vi.map(i=>pts[i]);const br=bright[fi];cx.beginPath();cx.moveTo(v2[0].px,v2[0].py);v2.forEach((v,i)=>i>0&&cx.lineTo(v.px,v.py));cx.closePath();cx.fillStyle=`rgba(${r2},${g2},${b2},${al*br*.32})`;cx.strokeStyle=`rgba(${r2},${g2},${b2},${al*br*.75})`;cx.lineWidth=.8;cx.fill();cx.stroke();});
    };
    const draw=()=>{
      cx.clearRect(0,0,W,H);
      cubes.forEach(cube=>{
        cube.x+=cube.vx;cube.y+=cube.vy;
        if(cube.x<-.05)cube.x=1.05;if(cube.x>1.05)cube.x=-.05;if(cube.y<-.05)cube.y=1.05;if(cube.y>1.05)cube.y=-.05;
        cube.rx+=cube.vrx;cube.ry+=cube.vry;cube.rz+=cube.vrz;
        const sc=.5+cube.z*.7,ccx=cube.x*W,ccy=cube.y*H;
        const[r2,g2,b2]=[parseInt(cube.c.slice(1,3),16),parseInt(cube.c.slice(3,5),16),parseInt(cube.c.slice(5,7),16)];
        const g=cx.createRadialGradient(ccx,ccy,0,ccx,ccy,cube.s*sc*2.5);g.addColorStop(0,`rgba(${r2},${g2},${b2},${cube.a*sc*.4})`);g.addColorStop(1,`rgba(${r2},${g2},${b2},0)`);cx.beginPath();cx.arc(ccx,ccy,cube.s*sc*2.5,0,Math.PI*2);cx.fillStyle=g;cx.fill();
        drawCube(ccx,ccy,cube.s*sc,cube.rx,cube.ry,cube.rz,cube.c,cube.a*sc);
      });
      id=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={r} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:1}}/>;
}

// ── Shared ──
function Btn({children,primary,href}){
  const[h,sH]=useState(false);
  const base={display:"inline-flex",alignItems:"center",gap:8,padding:"13px 26px",fontFamily:"monospace",fontSize:"0.78rem",letterSpacing:"0.05em",textDecoration:"none",borderRadius:2,transition:"all 0.2s",cursor:"pointer"};
  const st=primary?{...base,background:h?"#fff":A,color:BG,fontWeight:700,transform:h?"translateY(-2px)":"none",boxShadow:h?"0 8px 32px rgba(0,217,255,0.3)":"none",border:"none"}:{...base,background:"transparent",color:h?A:TX,border:`1px solid ${h?A:BD}`,transform:h?"translateY(-2px)":"none"};
  return <a href={href} style={st} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}>{children}</a>;
}
function FadeIn({children,delay=0}){
  const ref=useRef(null);const[v,sV]=useState(false);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)sV(true);},{threshold:.07});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);
  return <div ref={ref} style={{opacity:v?1:0,transform:v?"none":"translateY(20px)",transition:`opacity 0.6s ${delay}s ease,transform 0.6s ${delay}s ease`}}>{children}</div>;
}
function Sec({id,children}){return <section id={id} style={{position:"relative",zIndex:1,padding:"88px 56px",maxWidth:1100,margin:"0 auto"}}>{children}</section>;}
function SL({label}){return <div style={{fontSize:"0.67rem",color:A,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:10}}>{label}<span style={{flex:1,maxWidth:60,height:1,background:A,opacity:.5}}/></div>;}
function ST({children}){return <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(1.8rem,4vw,2.8rem)",letterSpacing:"-0.02em",marginBottom:46,lineHeight:1.1}}>{children}</h2>;}
function Divider(){return <div style={{height:1,background:`linear-gradient(90deg,transparent,${BD},transparent)`,margin:"0 56px"}}/>;}
const glass=(ex={})=>({background:"rgba(13,17,23,0.78)",border:"1px solid rgba(0,217,255,0.18)",borderRadius:12,backdropFilter:"blur(14px)",boxShadow:"0 8px 32px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.05)",...ex});

// ── Hero ──
const HERO_PROJS=[{icon:"🎓",title:"Capstone Hub",stack:"React · Firebase",live:"https://creative-expression-production.up.railway.app/",github:"https://github.com/bharath021/capstone-hub"},{icon:"🛒",title:"E-Commerce Microservices",stack:"Spring Boot · K8s",github:"https://github.com/bharath021/ecommerce-microservices"},{icon:"🤖",title:"AI Job Recommender",stack:"Python · TensorFlow",github:"https://github.com/bharath021/ai-job-recommender"}];
const HERO_EXP=[{role:"Software Engineer",co:"American Express",period:"2025–Present",color:A},{role:"Full Stack Engineer",co:"TCS",period:"2022–2023",color:A2},{role:"Teaching Assistant",co:"UMass Boston",period:"2025",color:A3}];

function Hero(){
  const[tick,sT]=useState(0);const[hovP,sHP]=useState(null);const[hovE,sHE]=useState(null);const[mouse,sM]=useState({x:0,y:0});const heroRef=useRef(null);
  useEffect(()=>{const t=setInterval(()=>sT(x=>x+1),600);return()=>clearInterval(t);},[]);
  const onMM=e=>{if(!heroRef.current)return;const rv=heroRef.current.getBoundingClientRect();sM({x:(e.clientX-rv.left)/rv.width-.5,y:(e.clientY-rv.top)/rv.height-.5});};
  return(
    <section id="about" ref={heroRef} onMouseMove={onMM} style={{minHeight:"100vh",position:"relative",zIndex:1,overflow:"hidden"}}>
      <FloatingCubes/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 90% 70% at 60% 45%,rgba(60,20,120,0.25) 0%,rgba(0,30,60,0.12) 55%,transparent 80%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"absolute",top:"20%",left:"8%",width:380,height:380,background:"radial-gradient(circle,rgba(124,58,237,0.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"absolute",top:"35%",right:"28%",width:500,height:500,background:"radial-gradient(circle,rgba(0,217,255,0.05) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"relative",zIndex:2,minHeight:"100vh",display:"flex",alignItems:"stretch",padding:"0 44px"}}>
        {/* LEFT */}
        <div style={{flex:"0 0 44%",display:"flex",flexDirection:"column",justifyContent:"center",paddingTop:80,paddingBottom:60,paddingRight:40}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(0,217,255,0.08)",border:"1px solid rgba(0,217,255,0.2)",borderRadius:20,padding:"6px 16px",fontSize:"0.64rem",color:A,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:26,width:"fit-content"}}>
            <span style={{width:7,height:7,background:A,borderRadius:"50%",opacity:tick%2===0?1:.25,transition:"opacity 0.4s",display:"inline-block"}}/>
            Available · Boston, MA
          </div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(3rem,5.5vw,5.5rem)",lineHeight:.95,letterSpacing:"-0.03em",marginBottom:18}}>
            Bharath
            <span style={{display:"block",background:`linear-gradient(135deg,${A} 0%,${A2} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Karumanchi</span>
          </h1>
          <div style={{fontSize:"0.95rem",marginBottom:8}}>
            <strong style={{color:TX}}>Full-Stack Engineer</strong><span style={{color:MU}}> &amp; </span><strong style={{color:TX}}>AI-Augmented Builder</strong>
          </div>
          <div style={{fontSize:"0.78rem",color:MU,marginBottom:10,lineHeight:1.7}}>
            Software Engineer @ <span style={{color:A}}>American Express</span><br/>MS Computer Science · UMass Boston · <span style={{color:GL}}>GPA 4.0</span>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:34}}>
            {["Java","React","Spring Boot","AWS","Docker","Python"].map(s=><span key={s} style={{fontSize:"0.6rem",padding:"4px 10px",background:"rgba(0,217,255,0.07)",border:"1px solid rgba(0,217,255,0.18)",borderRadius:4,color:A}}>{s}</span>)}
          </div>
          <div style={{display:"flex",gap:13,flexWrap:"wrap",marginBottom:44}}>
            <Btn primary href="#contact">Get in touch →</Btn>
            <Btn href="#projects">View projects</Btn>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <div style={{...glass({flex:1,minWidth:195,padding:"13px 15px",transform:`translate(${mouse.x*-6}px,${mouse.y*-9}px)`,transition:"transform 0.5s ease-out"})}}>
              <div style={{fontSize:"0.56rem",color:A3,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:9}}>Experience</div>
              {HERO_EXP.map((e,i)=>(
                <div key={i} onMouseEnter={()=>sHE(i)} onMouseLeave={()=>sHE(null)}
                  onClick={()=>document.getElementById("experience")?.scrollIntoView({behavior:"smooth"})}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",cursor:"pointer"}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:e.color,boxShadow:`0 0 5px ${e.color}`,flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:"0.63rem",fontWeight:700,color:hovE===i?e.color:TX,transition:"color 0.2s"}}>{e.role}</div>
                    <div style={{fontSize:"0.54rem",color:MU}}>{e.co} · {e.period}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{...glass({flex:"0 0 auto",width:148,padding:"13px 15px",transform:`translate(${mouse.x*8}px,${mouse.y*-7}px)`,transition:"transform 0.5s ease-out"})}}>
              <div style={{fontSize:"0.56rem",color:GL,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:9}}>Impact</div>
              {[["75%","APIs",A],["$85K","Savings",A3],["4.0","GPA",GL],["10+","Mentored",A2]].map(([n,l,col])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                  <span style={{fontSize:"0.6rem",color:MU}}>{l}</span>
                  <span style={{fontSize:"0.82rem",fontWeight:800,fontFamily:"'Syne',sans-serif",color:col}}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <div style={{flex:1,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{position:"relative",zIndex:2,transform:`translate(${mouse.x*-10}px,${mouse.y*-8}px)`,transition:"transform 0.35s ease-out",filter:"drop-shadow(0 0 55px rgba(0,217,255,0.22))"}}>
            <SkillGlobe/>
          </div>
          <div style={{...glass({position:"absolute",top:82,right:0,width:248,padding:"13px 15px",zIndex:3,animation:"fB 7s ease-in-out infinite",transform:`translate(${mouse.x*13}px,${mouse.y*7}px)`,transition:"transform 0.4s ease-out"})}}>
            <div style={{fontSize:"0.56rem",color:A,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>My Projects</div>
            {HERO_PROJS.map((p,i)=>(
              <div key={i} onMouseEnter={()=>sHP(i)} onMouseLeave={()=>sHP(null)}
                onClick={()=>window.open(p.live||p.github,"_blank")}
                style={{display:"flex",alignItems:"center",gap:9,padding:"7px 8px",background:hovP===i?"rgba(0,217,255,0.08)":"rgba(255,255,255,0.02)",borderRadius:7,cursor:"pointer",border:`1px solid ${hovP===i?"rgba(0,217,255,0.28)":"transparent"}`,transition:"all 0.2s",marginBottom:3}}>
                <span style={{fontSize:"1rem"}}>{p.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:"0.64rem",fontWeight:700,color:hovP===i?A:TX}}>{p.title}</div>
                  <div style={{fontSize:"0.55rem",color:MU}}>{p.stack}</div>
                </div>
                {hovP===i&&<span style={{fontSize:"0.6rem",color:A}}>↗</span>}
              </div>
            ))}
            <a href="#projects" style={{display:"block",marginTop:8,textAlign:"center",fontSize:"0.57rem",color:A,textDecoration:"none",padding:"5px",background:"rgba(0,217,255,0.06)",borderRadius:5,border:"1px solid rgba(0,217,255,0.15)"}}>View All Projects →</a>
          </div>
          <div style={{...glass({position:"absolute",top:92,left:0,width:195,padding:"11px 13px",zIndex:3,animation:"fA 6s ease-in-out infinite",transform:`translate(${mouse.x*-11}px,${mouse.y*5}px)`,transition:"transform 0.4s ease-out"})}}>
            <div style={{fontSize:"0.56rem",color:A,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:7}}>Currently</div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:A,boxShadow:`0 0 8px ${A}`,flexShrink:0,animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:"0.7rem",fontWeight:700,color:TX}}>American Express</span>
            </div>
            <div style={{fontSize:"0.61rem",color:MU,lineHeight:1.5}}>Software Engineer<br/><span style={{color:A3}}>Building production systems</span></div>
          </div>
          <div style={{position:"absolute",bottom:36,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:4,opacity:.35,zIndex:3}}>
            <div style={{width:1,height:28,background:`linear-gradient(to bottom,transparent,${A})`}}/>
            <div style={{fontSize:"0.57rem",color:A,letterSpacing:"0.18em",textTransform:"uppercase"}}>Scroll</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fA{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes fB{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </section>
  );
}

// ── Value Props ──
function VPCard({num,title,desc}){
  const[h,sH]=useState(false);
  return(
    <div onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)} style={{background:h?PN:SU,padding:"36px 32px",position:"relative",overflow:"hidden",transition:"background 0.2s"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${A},${A2})`,transform:h?"scaleX(1)":"scaleX(0)",transformOrigin:"left",transition:"transform 0.3s"}}/>
      <div style={{fontSize:"2.8rem",fontFamily:"'Syne',sans-serif",fontWeight:700,color:"rgba(0,217,255,0.08)",lineHeight:1,marginBottom:16}}>{num}</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.02rem",fontWeight:700,marginBottom:11}}>{title}</div>
      <p style={{fontSize:"0.75rem",color:MU,lineHeight:1.8}}>{desc}</p>
    </div>
  );
}
function ValueProps(){
  return(
    <Sec>
      <FadeIn><SL label="What I bring"/></FadeIn>
      <FadeIn delay={.1}><ST>My 3 Core Value Propositions</ST></FadeIn>
      <FadeIn delay={.2}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:2,background:BD,border:`1px solid ${BD}`}}>
          <VPCard num="01" title="Enterprise Full-Stack Depth" desc="Built and shipped production systems at TCS — IAM microservices, CI/CD pipelines, and L3 incident response. I own the full lifecycle: design, build, deploy, maintain."/>
          <VPCard num="02" title="AI-Augmented Developer" desc="Certified in Generative AI, ChatGPT API, and AWS architecture. Built AI chatbots and data pipelines positioned at the intersection of traditional engineering and emerging AI."/>
          <VPCard num="03" title="Collaborative Team Multiplier" desc="Across TCS, Codec, OctaNet, and UMass, I've led code reviews, mentored students, and delivered under Agile sprint pressure. I make teams better, not just codebases."/>
        </div>
      </FadeIn>
    </Sec>
  );
}

// ── Project Animated Previews ──
// Shared isometric engine – all 6 previews use same quality 3D

// ── ISO ENGINE (shared by all previews) ──
// Each canvas sets its own W,H,cx; call makeIso(W,H) to get projection helpers

function makeIso(W,H,ox=0.5,oy=0.32,tileW=24,tileH=12,tileZ=18){
  const iso=(x,y,z=0)=>({x:W*ox+(x-y)*tileW, y:H*oy+(x+y)*tileH-z*tileZ});
  // draw full iso box with top + left + right faces
  const box=(cx,gx,gy,gz,bw,bd,bh,cols)=>{
    const[top,sl,sr,str=`rgba(0,0,0,0.55)`]=cols;
    const tl=iso(gx,gy,gz+bh),tr=iso(gx+bw,gy,gz+bh);
    const br=iso(gx+bw,gy+bd,gz+bh),bl=iso(gx,gy+bd,gz+bh);
    const ftl=iso(gx,gy,gz),fbl=iso(gx,gy+bd,gz),fbr=iso(gx+bw,gy+bd,gz);
    cx.lineWidth=0.75;
    // top
    cx.beginPath();cx.moveTo(tl.x,tl.y);cx.lineTo(tr.x,tr.y);cx.lineTo(br.x,br.y);cx.lineTo(bl.x,bl.y);cx.closePath();cx.fillStyle=top;cx.strokeStyle=str;cx.fill();cx.stroke();
    // left
    cx.beginPath();cx.moveTo(tl.x,tl.y);cx.lineTo(bl.x,bl.y);cx.lineTo(fbl.x,fbl.y);cx.lineTo(ftl.x,ftl.y);cx.closePath();cx.fillStyle=sl;cx.fill();cx.stroke();
    // right
    cx.beginPath();cx.moveTo(bl.x,bl.y);cx.lineTo(br.x,br.y);cx.lineTo(fbr.x,fbr.y);cx.lineTo(fbl.x,fbl.y);cx.closePath();cx.fillStyle=sr;cx.fill();cx.stroke();
  };
  const ground=(cx,x0,y0,x1,y1,col)=>{
    const a=iso(x0,y0),b=iso(x1,y0),c=iso(x1,y1),d=iso(x0,y1);
    cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.lineTo(c.x,c.y);cx.lineTo(d.x,d.y);cx.closePath();cx.fillStyle=col;cx.fill();
  };
  const grid=(cx,x0,y0,x1,y1,col)=>{
    cx.strokeStyle=col;cx.lineWidth=0.5;
    for(let x=x0;x<=x1;x++){const a=iso(x,y0),b=iso(x,y1);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke();}
    for(let y=y0;y<=y1;y++){const a=iso(x0,y),b=iso(x1,y);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke();}
  };
  const glow=(cx,x,y,z,r,col)=>{
    const p=iso(x,y,z);const g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
    g.addColorStop(0,col.replace('1)','0.6)'));g.addColorStop(1,col.replace('1)','0)'));
    cx.beginPath();cx.arc(p.x,p.y,r,0,Math.PI*2);cx.fillStyle=g;cx.fill();
  };
  const dot=(cx,x,y,z,r,col)=>{const p=iso(x,y,z);cx.beginPath();cx.arc(p.x,p.y,r,0,Math.PI*2);cx.fillStyle=col;cx.fill();};
  const label=(cx,x,y,z,txt,col,size=7)=>{const p=iso(x,y,z);cx.font=`bold ${size}px monospace`;cx.fillStyle=col;cx.textAlign="center";cx.textBaseline="middle";cx.fillText(txt,p.x,p.y);};
  return{iso,box,ground,grid,glow,dot,label};
}

// colour helper
const rgb=(hex)=>{const n=parseInt(hex.replace('#',''),16);return[(n>>16)&255,(n>>8)&255,n&255];};
const rgba=(hex,a)=>{const[r,g,b]=rgb(hex);return `rgba(${r},${g},${b},${a})`;};
const shade=(hex,f)=>{const[r,g,b]=rgb(hex);return `rgba(${Math.round(r*f)},${Math.round(g*f)},${Math.round(b*f)},1)`;};

// ─────────────────────────────────────────────────────────────
// 1. CAPSTONE HUB – 3D campus, glowing role towers, flying packets
// ─────────────────────────────────────────────────────────────
function PreviewCapstone(){
  const ref=useRef(null);
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    cv.width=cv.offsetWidth;cv.height=cv.offsetHeight;
    const W=cv.width,H=cv.height;
    const cx=cv.getContext('2d');let id,t=0;
    const{iso,box,ground,grid,glow,dot,label}=makeIso(W,H,0.50,0.28,22,11,17);

    const ROLES=[
      {gx:0.3,gy:0.3,label:'Student',c:'#00d9ff',h:0.7},
      {gx:3.8,gy:0.3,label:'Client',c:'#7c3aed',h:0.6},
      {gx:0.3,gy:3.2,label:'Instructor',c:'#10b981',h:0.65},
      {gx:3.8,gy:3.2,label:'Team A',c:'#f59e0b',h:0.55},
      {gx:1.8,gy:1.5,label:'HUB',c:'#00d9ff',h:1.1,hub:true},
    ];
    const pkts=ROLES.slice(0,4).map((r,i)=>({i,t:i*0.25,sp:0.006+i*0.001}));

    const drawTower=(r,t2)=>{
      const act=0.6+0.4*Math.sin(t2*2+r.gx);
      const h=r.h*(0.85+0.18*act);
      box(cx,r.gx,r.gy,0,0.55,0.55,h,[
        rgba(r.c,0.28+act*0.15),shade(r.c,0.55),shade(r.c,0.42),rgba(r.c,0.7)
      ]);
      // glowing top platform
      box(cx,r.gx-0.05,r.gy-0.05,h,0.65,0.65,0.07,[
        rgba(r.c,0.7),shade(r.c,0.5),shade(r.c,0.4),rgba(r.c,0.9)
      ]);
      glow(cx,r.gx+0.27,r.gy+0.27,h+0.07,16,rgba(r.c,1));
      label(cx,r.gx+0.27,r.gy+0.27,h+0.22,r.label,rgba(r.c,0.95),7);
    };

    const draw=()=>{
      cx.clearRect(0,0,W,H);t+=0.016;
      ground(cx,-0.5,-0.5,5.2,4.2,'rgba(6,10,18,0.92)');
      grid(cx,-0.5,-0.5,5,4,'rgba(0,217,255,0.055)');

      // connection beams
      ROLES.slice(0,4).forEach(r=>{
        const hub=ROLES[4];
        const a=iso(r.gx+0.27,r.gy+0.27,r.h*0.5),b=iso(hub.gx+0.27,hub.gy+0.27,hub.h*0.6);
        const g=cx.createLinearGradient(a.x,a.y,b.x,b.y);
        g.addColorStop(0,rgba(r.c,0.45));g.addColorStop(1,'rgba(0,217,255,0.15)');
        cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.strokeStyle=g;cx.lineWidth=1.2;cx.stroke();
      });

      ROLES.forEach(r=>drawTower(r,t));

      // flying data packets
      pkts.forEach(pk=>{
        pk.t=(pk.t+pk.sp)%1;
        const r=ROLES[pk.i],hub=ROLES[4];
        const sx=r.gx+0.27+(hub.gx+0.27-(r.gx+0.27))*pk.t;
        const sy=r.gy+0.27+(hub.gy+0.27-(r.gy+0.27))*pk.t;
        const sz=r.h*0.5+(hub.h*0.6-r.h*0.5)*pk.t+0.5*Math.sin(pk.t*Math.PI);
        glow(cx,sx,sy,sz,10,rgba(r.c,1));
        dot(cx,sx,sy,sz,3,rgba(r.c,1));
      });

      // hub pulse rings
      const hub=ROLES[4];const pulse=10+6*Math.sin(t*3);
      const hp=iso(hub.gx+0.27,hub.gy+0.27,hub.h+0.1);
      for(let i=0;i<3;i++){
        const rr=pulse*(i+1)*0.5;
        const g=cx.createRadialGradient(hp.x,hp.y,0,hp.x,hp.y,rr);
        g.addColorStop(0,'rgba(0,217,255,0)');g.addColorStop(0.7,`rgba(0,217,255,${0.12-i*0.04})`);g.addColorStop(1,'rgba(0,217,255,0)');
        cx.beginPath();cx.arc(hp.x,hp.y,rr,0,Math.PI*2);cx.fillStyle=g;cx.fill();
      }
      id=requestAnimationFrame(draw);
    };
    draw();return()=>cancelAnimationFrame(id);
  },[]);
  return <canvas ref={ref} style={{width:'100%',height:200,display:'block'}}/>;
}

// ─────────────────────────────────────────────────────────────
// 2. E-COMMERCE – Docker container city with K8s pods & live packets
// ─────────────────────────────────────────────────────────────
function PreviewEcom(){
  const ref=useRef(null);
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    cv.width=cv.offsetWidth;cv.height=cv.offsetHeight;
    const W=cv.width,H=cv.height;
    const cx=cv.getContext('2d');let id,t=0;
    const{iso,box,ground,grid,glow,dot,label}=makeIso(W,H,0.50,0.25,20,10,15);

    const SVCS=[
      {gx:2.0,gy:0.0,w:1.2,d:0.8,h:0.9,c:'#00d9ff',lbl:'Gateway'},
      {gx:0.0,gy:1.6,w:0.9,d:0.7,h:0.7,c:'#7c3aed',lbl:'Products'},
      {gx:2.0,gy:1.8,w:0.9,d:0.7,h:0.7,c:'#10b981',lbl:'Orders'},
      {gx:4.0,gy:1.6,w:1.0,d:0.7,h:0.8,c:'#f59e0b',lbl:'Payments'},
      {gx:0.2,gy:3.2,w:0.8,d:0.6,h:0.5,c:'#e879f9',lbl:'Inventory'},
      {gx:2.1,gy:3.2,w:0.8,d:0.6,h:0.5,c:'#00d9ff',lbl:'AWS S3'},
      {gx:4.0,gy:3.2,w:0.9,d:0.6,h:0.5,c:'#10b981',lbl:'Postgres'},
    ];
    const ROUTES=[[0,1],[0,2],[0,3],[1,4],[2,5],[3,6],[2,3]];
    const pkts=ROUTES.map(([s,e])=>({s,e,t:Math.random(),sp:0.007+Math.random()*0.004}));

    const drawSvc=(s,t2)=>{
      const act=0.5+0.5*Math.sin(t2*1.8+s.gx);
      // base container body
      box(cx,s.gx,s.gy,0,s.w,s.d,s.h,[
        rgba(s.c,0.22+act*0.1),shade(s.c,0.45+act*0.1),shade(s.c,0.35+act*0.1),rgba(s.c,0.7)
      ]);
      // glowing lid
      box(cx,s.gx,s.gy,s.h,s.w,s.d,0.06,[
        rgba(s.c,0.6+act*0.3),shade(s.c,0.5),shade(s.c,0.4),rgba(s.c,0.9)
      ]);
      glow(cx,s.gx+s.w/2,s.gy+s.d/2,s.h+0.06,14,rgba(s.c,1));
      label(cx,s.gx+s.w/2,s.gy+s.d/2,s.h+0.18,s.lbl,rgba(s.c,0.95),7);
      // docker whale icon (simplified)
      const tp=iso(s.gx+0.12,s.gy+0.12,s.h);
      cx.font='8px monospace';cx.fillStyle=rgba(s.c,0.5);cx.textAlign='left';cx.textBaseline='middle';cx.fillText('▣',tp.x,tp.y);
    };

    const draw=()=>{
      cx.clearRect(0,0,W,H);t+=0.016;
      ground(cx,-0.3,-0.3,5.8,4.2,'rgba(6,10,18,0.93)');
      grid(cx,-0.3,-0.3,5.5,4,'rgba(0,217,255,0.05)');

      // k8s orbit ring
      cx.save();cx.translate(W*0.5,H*0.38);
      for(let i=0;i<2;i++){
        cx.beginPath();cx.ellipse(0,0,W*0.4-i*15,H*0.38-i*8,0,0,Math.PI*2);
        cx.strokeStyle=`rgba(0,217,255,${0.04-i*0.015})`;cx.lineWidth=1;cx.setLineDash([4,10]);cx.stroke();cx.setLineDash([]);
      }
      cx.restore();

      // edge beams
      ROUTES.forEach(([si,ei])=>{
        const a=SVCS[si],b=SVCS[ei];
        const pa=iso(a.gx+a.w/2,a.gy+a.d/2,a.h),pb=iso(b.gx+b.w/2,b.gy+b.d/2,b.h);
        const g=cx.createLinearGradient(pa.x,pa.y,pb.x,pb.y);
        g.addColorStop(0,rgba(a.c,0.5));g.addColorStop(1,rgba(b.c,0.3));
        cx.beginPath();cx.moveTo(pa.x,pa.y);cx.lineTo(pb.x,pb.y);cx.strokeStyle=g;cx.lineWidth=1.1;cx.stroke();
      });

      SVCS.forEach(s=>drawSvc(s,t));

      // live packets
      pkts.forEach(pk=>{
        pk.t=(pk.t+pk.sp)%1;
        const a=SVCS[pk.s],b=SVCS[pk.e];
        const sx=a.gx+a.w/2+(b.gx+b.w/2-a.gx-a.w/2)*pk.t;
        const sy=a.gy+a.d/2+(b.gy+b.d/2-a.gy-a.d/2)*pk.t;
        const sz=a.h+(b.h-a.h)*pk.t+0.35*Math.sin(pk.t*Math.PI);
        glow(cx,sx,sy,sz,11,rgba(a.c,1));
        dot(cx,sx,sy,sz,3.5,'rgba(255,255,255,0.9)');
      });
      id=requestAnimationFrame(draw);
    };
    draw();return()=>cancelAnimationFrame(id);
  },[]);
  return <canvas ref={ref} style={{width:'100%',height:200,display:'block'}}/>;
}

// ─────────────────────────────────────────────────────────────
// 3. REAL-TIME COLLAB – 3D office desks, floating cursors, typing bubbles
// ─────────────────────────────────────────────────────────────
function PreviewCollab(){
  const ref=useRef(null);
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    cv.width=cv.offsetWidth;cv.height=cv.offsetHeight;
    const W=cv.width,H=cv.height;
    const cx=cv.getContext('2d');let id,t=0;
    const{iso,box,ground,grid,glow,dot,label}=makeIso(W,H,0.50,0.30,22,11,17);

    const USERS=[
      {gx:0.3,gy:0.3,name:'Alice',c:'#00d9ff',msg:'Editing intro...',phase:0},
      {gx:3.5,gy:0.5,name:'Bob',c:'#7c3aed',msg:'Fixed the API',phase:2.1},
      {gx:1.5,gy:2.8,name:'Carol',c:'#10b981',msg:'Reviewing PR',phase:4.2},
    ];

    const drawDesk=(u,t2)=>{
      const act=0.5+0.5*Math.sin(t2*1.5+u.phase);
      // desk surface
      box(cx,u.gx,u.gy,0,0.7,0.55,0.3,[rgba(u.c,0.18),shade(u.c,0.4),shade(u.c,0.3),rgba(u.c,0.6)]);
      // monitor
      box(cx,u.gx+0.1,u.gy+0.05,0.3,0.45,0.07,0.35,[rgba(u.c,0.35+act*0.1),shade(u.c,0.3),shade(u.c,0.25),rgba(u.c,0.7)]);
      // screen glow
      glow(cx,u.gx+0.32,u.gy+0.09,0.65,14,rgba(u.c,1));
      // cursor floating above desk
      const cz=0.75+0.2*Math.sin(t2*2+u.phase);
      const cp=iso(u.gx+0.35,u.gy+0.27,cz);
      // draw cursor arrow
      cx.save();cx.translate(cp.x,cp.y);
      cx.fillStyle=u.c;cx.beginPath();cx.moveTo(0,0);cx.lineTo(8,11);cx.lineTo(3,11);cx.lineTo(5,16);cx.lineTo(3,16);cx.lineTo(0,8);cx.closePath();cx.fill();
      cx.strokeStyle='rgba(0,0,0,0.5)';cx.lineWidth=0.8;cx.stroke();
      cx.restore();
      // name badge
      const np=iso(u.gx+0.35,u.gy+0.27,cz+0.18);
      const bw=cx.measureText(u.name).width+10;
      cx.fillStyle=rgba(u.c,0.88);cx.strokeStyle='rgba(0,0,0,0.4)';cx.lineWidth=0.6;
      cx.beginPath();cx.roundRect(np.x-bw/2,np.y-16,bw,13,2);cx.fill();cx.stroke();
      cx.font='bold 7px monospace';cx.fillStyle='#050810';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(u.name,np.x,np.y-10);
      // typing bubble
      const prog=(t2*0.38+u.phase*0.5)%2.8;
      if(prog<1.6){
        const chars=Math.min(u.msg.length,Math.floor(u.msg.length*prog/1.6));
        const snippet=u.msg.slice(0,chars)+(t2%0.55<0.27?'|':'');
        const bp=iso(u.gx+0.35,u.gy+0.27,cz+0.38);
        const mw=Math.max(38,cx.measureText(snippet).width+12);
        cx.fillStyle=rgba(u.c,0.14);cx.strokeStyle=rgba(u.c,0.7);cx.lineWidth=0.8;
        cx.beginPath();cx.roundRect(bp.x-mw/2,bp.y-15,mw,13,3);cx.fill();cx.stroke();
        cx.font='7px monospace';cx.fillStyle=u.c;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(snippet,bp.x,bp.y-8);
      }
    };

    const draw=()=>{
      cx.clearRect(0,0,W,H);t+=0.016;
      ground(cx,-0.3,-0.3,5.0,4.0,'rgba(6,10,18,0.93)');
      grid(cx,-0.3,-0.3,5,4,'rgba(0,217,255,0.05)');

      // shared doc (big flat screen in center)
      box(cx,1.8,1.1,0,2.0,1.3,0.07,['rgba(13,17,40,0.97)','rgba(8,12,30,0.8)','rgba(6,9,25,0.7)','rgba(0,217,255,0.5)']);
      // doc content lines
      for(let i=0;i<5;i++){
        const lp=iso(2.0+i*0.06,1.3+i*0.22,0.1),rp=iso(2.0+0.7+i*0.04,1.3+i*0.22,0.1);
        const al=0.25+0.18*Math.sin(t+i*0.8);
        cx.beginPath();cx.moveTo(lp.x,lp.y);cx.lineTo(rp.x,rp.y);
        cx.strokeStyle=i===0?`rgba(0,217,255,${al+0.4})`:`rgba(200,215,230,${al})`;cx.lineWidth=i===0?2:1.2;cx.stroke();
      }
      // doc label
      const dl=iso(2.8,1.75,0.12);cx.font='bold 8px monospace';cx.fillStyle='rgba(0,217,255,0.6)';cx.textAlign='center';cx.fillText('LIVE DOC',dl.x,dl.y);

      // connection lines desk→doc
      USERS.forEach(u=>{
        const up=iso(u.gx+0.35,u.gy+0.27,0.65),dp=iso(2.8,1.75,0.1);
        cx.beginPath();cx.moveTo(up.x,up.y);cx.lineTo(dp.x,dp.y);
        cx.strokeStyle=rgba(u.c,0.18);cx.lineWidth=0.8;cx.setLineDash([3,6]);cx.stroke();cx.setLineDash([]);
      });

      USERS.forEach(u=>drawDesk(u,t));
      id=requestAnimationFrame(draw);
    };
    draw();return()=>cancelAnimationFrame(id);
  },[]);
  return <canvas ref={ref} style={{width:'100%',height:200,display:'block'}}/>;
}

// ─────────────────────────────────────────────────────────────
// 4. AI JOB RECOMMENDER – 3D neural city: pillar layers, flowing data, match explosion
// ─────────────────────────────────────────────────────────────
function PreviewAI(){
  const ref=useRef(null);
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    cv.width=cv.offsetWidth;cv.height=cv.offsetHeight;
    const W=cv.width,H=cv.height;
    const cx=cv.getContext('2d');let id,t=0;
    const{iso,box,ground,grid,glow,dot,label}=makeIso(W,H,0.50,0.28,20,10,18);

    const LAYERS=[
      {x:0.3,nodes:[{y:0.2,lbl:'Skills'},{y:1.3,lbl:'Exp.'},{y:2.4,lbl:'Pref'}],c:'#00d9ff'},
      {x:1.7,nodes:[{y:-0.1},{y:0.7},{y:1.5},{y:2.3}],c:'#7c3aed'},
      {x:3.1,nodes:[{y:0.2},{y:1.3},{y:2.4}],c:'#10b981'},
      {x:4.3,nodes:[{y:1.1,lbl:'Match!'}],c:'#f59e0b'},
    ];

    // build packet pool
    const pkts=[];
    LAYERS.forEach((L,li)=>{
      if(li===LAYERS.length-1)return;
      L.nodes.forEach(n=>{
        LAYERS[li+1].nodes.forEach(m=>{
          pkts.push({lx:L.x+0.25,ly:n.y+0.25,ex:LAYERS[li+1].x+0.25,ey:m.y+0.25,t:Math.random(),sp:0.005+Math.random()*0.004,c:L.c});
        });
      });
    });

    const draw=()=>{
      cx.clearRect(0,0,W,H);t+=0.016;
      ground(cx,-0.2,-0.4,5.5,3.5,'rgba(6,10,18,0.93)');
      grid(cx,-0.2,-0.4,5.3,3.3,'rgba(0,217,255,0.05)');

      // inter-layer connections
      LAYERS.forEach((L,li)=>{
        if(li===LAYERS.length-1)return;
        L.nodes.forEach(n=>{
          LAYERS[li+1].nodes.forEach(m=>{
            const a=iso(L.x+0.25,n.y+0.25,0.5),b=iso(LAYERS[li+1].x+0.25,m.y+0.25,0.5);
            const g=cx.createLinearGradient(a.x,a.y,b.x,b.y);
            g.addColorStop(0,rgba(L.c,0.28));g.addColorStop(1,rgba(LAYERS[li+1].c,0.15));
            cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.strokeStyle=g;cx.lineWidth=0.7;cx.stroke();
          });
        });
      });

      // node pillars
      LAYERS.forEach(L=>{
        const act=0.5+0.5*Math.sin(t*1.6+L.x);
        L.nodes.forEach((n,ni)=>{
          const pact=0.4+0.6*Math.sin(t*2+L.x+ni*1.3);
          const ph=0.45+pact*0.55;
          box(cx,L.x,n.y,0,0.5,0.5,ph,[rgba(L.c,0.22+pact*0.12),shade(L.c,0.5),shade(L.c,0.38),rgba(L.c,0.75)]);
          box(cx,L.x-0.04,n.y-0.04,ph,0.58,0.58,0.07,[rgba(L.c,0.65),shade(L.c,0.5),shade(L.c,0.4),rgba(L.c,0.9)]);
          glow(cx,L.x+0.25,n.y+0.25,ph+0.07,13,rgba(L.c,1));
          if(n.lbl)label(cx,L.x+0.25,n.y+0.25,ph+0.22,n.lbl,rgba(L.c,0.95),7);
        });
      });

      // packets
      pkts.forEach(pk=>{
        pk.t=(pk.t+pk.sp)%1;
        const sx=pk.lx+(pk.ex-pk.lx)*pk.t,sy=pk.ly+(pk.ey-pk.ly)*pk.t;
        const sz=0.5+0.45*Math.sin(pk.t*Math.PI);
        glow(cx,sx,sy,sz,9,rgba(pk.c,1));
        dot(cx,sx,sy,sz,3,rgba(pk.c,1));
      });

      // match explosion
      const matchNode=LAYERS[3].nodes[0];
      const mp=iso(LAYERS[3].x+0.25,matchNode.y+0.25,1.1);
      const er=10+8*Math.sin(t*3.5);
      for(let i=0;i<4;i++){
        const g=cx.createRadialGradient(mp.x,mp.y,er*i*0.22,mp.x,mp.y,er*(i+1)*0.26);
        g.addColorStop(0,`rgba(245,158,11,${0.22-i*0.05})`);g.addColorStop(1,'rgba(245,158,11,0)');
        cx.beginPath();cx.arc(mp.x,mp.y,er*(i+1)*0.26,0,Math.PI*2);cx.fillStyle=g;cx.fill();
      }
      id=requestAnimationFrame(draw);
    };
    draw();return()=>cancelAnimationFrame(id);
  },[]);
  return <canvas ref={ref} style={{width:'100%',height:200,display:'block'}}/>;
}

// ─────────────────────────────────────────────────────────────
// 5. 3D SMART PARKING – pixel-perfect reference: teal car routing, bollards,
//    barrier arm, surveillance camera, P sign, license plate display, ticket machine
// ─────────────────────────────────────────────────────────────
function PreviewParking(){
  const ref=useRef(null);
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    cv.width=cv.offsetWidth;cv.height=cv.offsetHeight;
    const W=cv.width,H=cv.height;
    const cx=cv.getContext('2d');let id,t=0;
    // slightly wider isometric to match reference perspective
    const TW=26,TH=13,TZ=20;
    const iso=(x,y,z=0)=>({x:W*0.46+(x-y)*TW, y:H*0.26+(x+y)*TH-z*TZ});
    const box=(gx,gy,gz,bw,bd,bh,cols)=>{
      const[top,sl,sr,str='rgba(0,0,0,0.55)']=cols;
      const tl=iso(gx,gy,gz+bh),tr=iso(gx+bw,gy,gz+bh),br=iso(gx+bw,gy+bd,gz+bh),bl=iso(gx,gy+bd,gz+bh);
      const ftl=iso(gx,gy,gz),fbl=iso(gx,gy+bd,gz),fbr=iso(gx+bw,gy+bd,gz);
      cx.lineWidth=0.7;
      cx.beginPath();cx.moveTo(tl.x,tl.y);cx.lineTo(tr.x,tr.y);cx.lineTo(br.x,br.y);cx.lineTo(bl.x,bl.y);cx.closePath();cx.fillStyle=top;cx.strokeStyle=str;cx.fill();cx.stroke();
      cx.beginPath();cx.moveTo(tl.x,tl.y);cx.lineTo(bl.x,bl.y);cx.lineTo(fbl.x,fbl.y);cx.lineTo(ftl.x,ftl.y);cx.closePath();cx.fillStyle=sl;cx.fill();cx.stroke();
      cx.beginPath();cx.moveTo(bl.x,bl.y);cx.lineTo(br.x,br.y);cx.lineTo(fbr.x,fbr.y);cx.lineTo(fbl.x,fbl.y);cx.closePath();cx.fillStyle=sr;cx.fill();cx.stroke();
    };

    // ── BOLLARD (teal cylinder-like iso box) ──
    const bollard=(gx,gy)=>{
      box(gx-0.055,gy-0.055,0,0.11,0.11,0.3,['#00bcd4','#0097a7','#00838f','rgba(0,0,0,0.5)']);
      box(gx-0.055,gy-0.055,0.13,0.11,0.11,0.05,['rgba(255,255,255,0.85)','rgba(255,255,255,0.6)','rgba(255,255,255,0.5)','rgba(0,0,0,0.3)']);
    };

    // ── 3D CAR (teal or white mini-car) ──
    const drawCar=(gx,gy,bodyCol,roofCol)=>{
      const CW=0.72,CD=0.46,CH=0.26,RH=0.22;
      // shadow
      const sc=iso(gx+CW/2,gy+CD/2,0);
      const sg=cx.createRadialGradient(sc.x,sc.y+4,0,sc.x,sc.y+4,22);
      sg.addColorStop(0,'rgba(0,188,212,0.18)');sg.addColorStop(1,'rgba(0,188,212,0)');
      cx.beginPath();cx.ellipse(sc.x,sc.y+4,22,10,0,0,Math.PI*2);cx.fillStyle=sg;cx.fill();
      // body
      box(gx,gy,0,CW,CD,CH,[bodyCol,shade(bodyCol,0.7),shade(bodyCol,0.55),'rgba(0,0,0,0.55)']);
      // roof/cabin
      box(gx+CW*0.18,gy+CD*0.1,CH,CW*0.56,CD*0.8,RH,[roofCol,shade(roofCol,0.72),shade(roofCol,0.58),'rgba(0,0,0,0.5)']);
      // windscreen glass tint
      box(gx+CW*0.62,gy+CD*0.12,CH,CW*0.12,CD*0.76,RH,['rgba(100,210,255,0.22)','rgba(70,170,220,0.28)','rgba(50,130,190,0.28)','rgba(0,0,0,0.35)']);
      // headlights
      const hl1=iso(gx+CW,gy+CD*0.18,CH*0.45),hl2=iso(gx+CW,gy+CD*0.72,CH*0.45);
      cx.beginPath();cx.arc(hl1.x,hl1.y,3,0,Math.PI*2);cx.fillStyle='#fffde7';cx.fill();
      cx.beginPath();cx.arc(hl2.x,hl2.y,3,0,Math.PI*2);cx.fillStyle='#fffde7';cx.fill();
      // tail lights
      const tl1=iso(gx,gy+CD*0.18,CH*0.4),tl2=iso(gx,gy+CD*0.72,CH*0.4);
      cx.beginPath();cx.arc(tl1.x,tl1.y,2.5,0,Math.PI*2);cx.fillStyle='#ef5350';cx.fill();
      cx.beginPath();cx.arc(tl2.x,tl2.y,2.5,0,Math.PI*2);cx.fillStyle='#ef5350';cx.fill();
      // wheels (4 dark circles)
      [[gx+0.1,gy+0.06],[gx+0.1,gy+CD-0.1],[gx+CW-0.12,gy+0.06],[gx+CW-0.12,gy+CD-0.1]].forEach(([wx,wy])=>{
        const wp=iso(wx,wy,0.03);
        cx.beginPath();cx.arc(wp.x,wp.y,4.5,0,Math.PI*2);cx.fillStyle='#1a1a2e';cx.fill();
        cx.strokeStyle='rgba(80,80,100,0.5)';cx.lineWidth=0.8;cx.stroke();
      });
    };

    // ── TICKET MACHINE + BARRIER ──
    const drawGate=(gx,gy,barrierOpen)=>{
      // machine body
      box(gx-0.16,gy-0.16,0,0.32,0.32,0.52,['#00bcd4','#0097a7','#00838f','rgba(0,0,0,0.5)']);
      // red button
      const bp=iso(gx,gy,0.56);
      cx.beginPath();cx.arc(bp.x,bp.y,6,0,Math.PI*2);cx.fillStyle='#f44336';cx.fill();
      cx.strokeStyle='rgba(0,0,0,0.5)';cx.lineWidth=1;cx.stroke();
      cx.beginPath();cx.arc(bp.x,bp.y,3,0,Math.PI*2);cx.fillStyle='#ef9a9a';cx.fill();
      // ticket slot
      const ts=iso(gx+0.18,gy,0.48),te=iso(gx+0.18,gy,0.38);
      cx.beginPath();cx.moveTo(ts.x,ts.y);cx.lineTo(te.x,te.y);cx.strokeStyle='rgba(255,255,255,0.7)';cx.lineWidth=2.5;cx.stroke();
      // barrier arm
      const armAngle=barrierOpen?0.55:0;
      const armLen=1.15;
      const bs=iso(gx+0.16,gy,0.52);
      const ex=gx+0.16+armLen*Math.cos(armAngle*0.25);
      const ey=gy+armLen*0.08;
      const ez=0.52+armLen*Math.sin(armAngle);
      const be=iso(ex,ey,ez);
      // arm gradient teal→red striped
      const ag=cx.createLinearGradient(bs.x,bs.y,be.x,be.y);
      ag.addColorStop(0,'#00bcd4');ag.addColorStop(0.48,'#00bcd4');ag.addColorStop(0.52,'#e53935');ag.addColorStop(1,'#e53935');
      cx.beginPath();cx.moveTo(bs.x,bs.y);cx.lineTo(be.x,be.y);cx.strokeStyle=ag;cx.lineWidth=5.5;cx.lineCap='round';cx.stroke();cx.lineCap='butt';
      // white stripe dots on arm
      for(let f=0.15;f<0.92;f+=0.18){
        const sp=iso(gx+0.16+armLen*f*Math.cos(armAngle*0.25),gy+armLen*f*0.08,0.52+armLen*f*Math.sin(armAngle));
        cx.beginPath();cx.arc(sp.x,sp.y,1.8,0,Math.PI*2);cx.fillStyle='rgba(255,255,255,0.8)';cx.fill();
      }
    };

    // ── SURVEILLANCE CAMERA on pole ──
    const drawCamera=(gx,gy,t2)=>{
      // pole
      box(gx-0.04,gy-0.04,0,0.08,0.08,0.75,['#e0e0e0','#bdbdbd','#9e9e9e','rgba(0,0,0,0.4)']);
      // camera mount pivot
      const cp=iso(gx,gy,0.78);
      cx.save();cx.translate(cp.x,cp.y);
      // camera body
      cx.fillStyle='#f5f5f5';cx.strokeStyle='rgba(0,0,0,0.3)';cx.lineWidth=0.8;
      cx.beginPath();cx.ellipse(0,0,11,7,0,0,Math.PI*2);cx.fill();cx.stroke();
      // lens housing
      cx.fillStyle='#263238';cx.beginPath();cx.arc(0,0,4.5,0,Math.PI*2);cx.fill();
      cx.fillStyle='#00bcd4';cx.beginPath();cx.arc(0,0,2.5,0,Math.PI*2);cx.fill();
      cx.fillStyle='rgba(180,240,255,0.7)';cx.beginPath();cx.arc(-0.8,-0.8,1,0,Math.PI*2);cx.fill();
      // scan ring
      const sr=13+5*Math.sin(t2*2.5);
      const sg2=cx.createRadialGradient(0,0,0,0,0,sr);
      sg2.addColorStop(0,'rgba(0,188,212,0.18)');sg2.addColorStop(1,'rgba(0,188,212,0)');
      cx.beginPath();cx.arc(0,0,sr,0,Math.PI*2);cx.fillStyle=sg2;cx.fill();
      // wifi waves
      for(let i=1;i<=2;i++){
        cx.beginPath();cx.arc(-11,0,i*5,Math.PI*0.75,Math.PI*1.25,false);
        cx.strokeStyle=`rgba(0,188,212,${0.5-i*0.15})`;cx.lineWidth=1.2;cx.stroke();
      }
      cx.restore();
    };

    // ── P SIGN ──
    const drawPSign=(gx,gy)=>{
      // pole
      box(gx-0.04,gy-0.04,0,0.08,0.08,1.2,['#00bcd4','#0097a7','#00838f','rgba(0,0,0,0.5)']);
      // sign face
      box(gx-0.28,gy-0.28,1.0,0.56,0.56,0.4,['#00bcd4','#0097a7','#00838f','rgba(0,0,0,0.5)']);
      const sp=iso(gx,gy,1.26);
      cx.font='bold 13px sans-serif';cx.fillStyle='#fff';cx.textAlign='center';cx.textBaseline='middle';cx.fillText('P',sp.x,sp.y);
    };

    // ── LICENSE PLATE DISPLAY ──
    const drawDisplay=(gx,gy,plateText,timer,t2)=>{
      // pole
      box(gx-0.04,gy-0.04,0,0.08,0.08,1.1,['#00bcd4','#0097a7','#00838f','rgba(0,0,0,0.5)']);
      // display box
      box(gx-0.45,gy-0.3,0.95,0.9,0.6,0.3,['#0d1440','#070c2a','#050920','rgba(0,217,255,0.55)']);
      // plate number
      const pp=iso(gx,gy,1.14);
      cx.font='bold 9px monospace';cx.fillStyle=`rgba(0,217,255,${0.75+0.25*Math.sin(t2*2)})`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(plateText,pp.x,pp.y-4);
      // timer
      cx.font='7px monospace';cx.fillStyle='rgba(0,217,255,0.6)';cx.fillText(timer,pp.x,pp.y+6);
    };

    // ── PARKING SPOTS (floor markings) ──
    const SPOTS=[
      {gx:2.2,gy:0.1,occupied:true,carCol:'#ffffff',roofCol:'#e0e0e0'},
      {gx:3.2,gy:0.1,occupied:true,carCol:'#ffffff',roofCol:'#e8e8e8'},
      {gx:2.2,gy:1.25,occupied:false},
      {gx:3.2,gy:1.25,occupied:false},
    ];
    const drawSpotLines=(s,highlight)=>{
      const tl=iso(s.gx,s.gy,0.01),tr=iso(s.gx+0.88,s.gy,0.01);
      const br=iso(s.gx+0.88,s.gy+1.05,0.01),bl=iso(s.gx,s.gy+1.05,0.01);
      cx.beginPath();cx.moveTo(tl.x,tl.y);cx.lineTo(tr.x,tr.y);cx.lineTo(br.x,br.y);cx.lineTo(bl.x,bl.y);cx.closePath();
      if(!s.occupied){cx.fillStyle=highlight?'rgba(0,217,255,0.08)':'rgba(0,217,255,0.03)';cx.fill();}
      cx.strokeStyle=s.occupied?'rgba(124,58,237,0.5)':highlight?'rgba(0,217,255,0.85)':'rgba(0,217,255,0.28)';
      cx.lineWidth=highlight?1.5:1;cx.stroke();
      // spot number
      const mc=iso(s.gx+0.44,s.gy+0.52,0.02);
      cx.font='8px monospace';cx.fillStyle=s.occupied?'rgba(124,58,237,0.6)':'rgba(0,217,255,0.4)';cx.textAlign='center';cx.textBaseline='middle';
      cx.fillText(s.occupied?'●':'○',mc.x,mc.y);
    };

    // ── MOVING CAR STATE MACHINE ──
    const WPS=[{gx:-1.0,gy:2.2},{gx:0.3,gy:2.2},{gx:1.2,gy:2.2},{gx:2.2,gy:2.0},{gx:2.2,gy:1.3}];
    let wpIdx=0,cGx=WPS[0].gx,cGy=WPS[0].gy,parked=false,parkT=0,gateOpen=false;
    let seconds=0,secTimer=0;
    const plateNums=['KA6919EN','KA2637','KA5521MX','KA8830EN'];
    let plateIdx=0;

    const draw=()=>{
      cx.clearRect(0,0,W,H);t+=0.016;
      secTimer+=0.016;if(secTimer>1){secTimer=0;seconds++;}

      // ── GROUND (light grey like reference) ──
      const g0=iso(-1.2,-0.5),g1=iso(4.8,-0.5),g2=iso(4.8,3.6),g3=iso(-1.2,3.6);
      cx.beginPath();cx.moveTo(g0.x,g0.y);cx.lineTo(g1.x,g1.y);cx.lineTo(g2.x,g2.y);cx.lineTo(g3.x,g3.y);cx.closePath();cx.fillStyle='rgba(22,28,38,0.94)';cx.fill();

      // grid
      cx.strokeStyle='rgba(0,217,255,0.05)';cx.lineWidth=0.5;
      for(let i=-1;i<=5;i++){const a=iso(i,-0.5),b=iso(i,3.6);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke();}
      for(let j=-0;j<=4;j++){const a=iso(-1.2,j),b=iso(4.8,j);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke();}

      // road lane
      for(let i=-0.9;i<4.5;i+=0.45){
        const m1=iso(i,2.2,0.01),m2=iso(i+0.22,2.2,0.01);
        cx.beginPath();cx.moveTo(m1.x,m1.y);cx.lineTo(m2.x,m2.y);cx.strokeStyle='rgba(0,217,255,0.14)';cx.lineWidth=2;cx.stroke();
      }

      // bollard ring around lot
      const bollardRing=[
        [-0.8,0.0],[-0.8,0.7],[-0.8,1.4],[-0.8,2.1],[-0.8,2.8],
        [0.0,3.0],[0.6,3.0],[1.2,3.0],[1.8,3.0],[2.4,3.0],[3.0,3.0],[3.6,3.0],
        [4.2,3.0],[4.2,2.3],[4.2,1.5],[4.2,0.7],[4.2,-0.1],
        [3.5,-0.1],[2.8,-0.1],[2.1,-0.1],[1.4,-0.1],[0.7,-0.1],[0.0,-0.1],[-0.8,-0.1],
      ];
      bollardRing.forEach(([bx,by])=>bollard(bx,by));

      // parking spot markings
      SPOTS.forEach(s=>drawSpotLines(s, !parked && cGx>2.0 && cGy<1.6 && s.gx===2.2 && s.gy===1.25));

      // infrastructure (back to front)
      drawCamera(-0.8,0.5,t);
      drawGate(-0.3,2.4,gateOpen);
      drawPSign(4.0,0.1);
      const pd=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
      drawDisplay(3.3,-0.2,plateNums[plateIdx],`00:${pd}`,t);

      // static parked cars
      SPOTS.filter(s=>s.occupied).forEach(s=>drawCar(s.gx+0.05,s.gy+0.08,s.carCol,s.roofCol));

      // ── MOVE TEAL CAR ──
      if(!parked){
        const wt=WPS[wpIdx];
        const dx=wt.gx-cGx,dy=wt.gy-cGy,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<0.07){
          wpIdx++;
          if(wpIdx>=WPS.length){parked=true;parkT=0;}
          else if(wpIdx===2){gateOpen=true;}
        } else {cGx+=dx/dist*0.022;cGy+=dy/dist*0.016;}
      } else {
        parkT+=0.016;
        if(parkT>2.5){wpIdx=0;cGx=WPS[0].gx;cGy=WPS[0].gy;parked=false;gateOpen=false;seconds=0;plateIdx=(plateIdx+1)%plateNums.length;}
      }
      drawCar(cGx,cGy,'#00bcd4','#00acc1');

      // ── HUD ──
      cx.font='bold 8px monospace';cx.textAlign='left';cx.textBaseline='top';
      cx.fillStyle='rgba(0,0,0,0.55)';cx.fillRect(4,4,130,26);
      cx.strokeStyle='rgba(0,217,255,0.25)';cx.lineWidth=0.8;cx.strokeRect(4,4,130,26);
      cx.fillStyle='rgba(0,217,255,0.85)';cx.fillText(`${plateNums[plateIdx]}  ${pd}`,9,8);
      const stCol=parked?'rgba(0,255,128,0.85)':gateOpen?'rgba(0,217,255,0.85)':'rgba(245,158,11,0.85)';
      cx.fillStyle=stCol;cx.fillText(parked?'● PARKED':gateOpen?'● ENTERING':'● ROUTING...',9,20);

      id=requestAnimationFrame(draw);
    };
    draw();return()=>cancelAnimationFrame(id);
  },[]);
  return <canvas ref={ref} style={{width:'100%',height:200,display:'block'}}/>;
}

// ─────────────────────────────────────────────────────────────
// 6. SALESFORCE – 3D isometric CRM city: bar towers, funnel stack, live KPI panels
// ─────────────────────────────────────────────────────────────
function PreviewSalesforce(){
  const ref=useRef(null);
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    cv.width=cv.offsetWidth;cv.height=cv.offsetHeight;
    const W=cv.width,H=cv.height;
    const cx=cv.getContext('2d');let id,t=0;
    const{iso,box,ground,grid,glow,dot,label}=makeIso(W,H,0.50,0.26,20,10,16);

    const MONTHS=['Jan','Feb','Mar','Apr','May','Jun'];
    const BASE=[0.55,0.78,0.62,0.98,0.82,1.12];
    const FUNNEL=[
      {lbl:'Leads',val:'1,847',c:'#00d9ff',w:1.1},
      {lbl:'Qualified',val:'892',c:'#7c3aed',w:0.88},
      {lbl:'Proposals',val:'341',c:'#10b981',w:0.66},
      {lbl:'Closed',val:'127',c:'#f59e0b',w:0.44},
    ];
    // particles flowing through funnel
    const fPkts=Array.from({length:12},(_,i)=>({y:-0.3+i*0.4,sp:0.012+Math.random()*0.008,stage:0}));

    const draw=()=>{
      cx.clearRect(0,0,W,H);t+=0.016;
      ground(cx,-0.3,-0.3,5.8,4.2,'rgba(6,10,18,0.94)');
      grid(cx,-0.3,-0.3,5.5,4,'rgba(0,217,255,0.045)');

      // ── REVENUE BAR TOWERS ──
      MONTHS.forEach((m,i)=>{
        const bh=BASE[i]*(0.88+0.15*Math.sin(t*1.6+i*0.9));
        const gx2=0.2+i*0.86,gy2=2.3;
        box(cx,gx2,gy2,0,0.62,0.52,bh,[
          rgba('#00d9ff',0.24+bh*0.08),rgba('#00d9ff',0.38),rgba('#7c3aed',0.32),rgba('#00d9ff',0.75)
        ]);
        // glow on top
        glow(cx,gx2+0.31,gy2+0.26,bh+0.06,13,'rgba(0,217,255,1)');
        // value label
        label(cx,gx2+0.31,gy2+0.26,bh+0.2,`$${Math.round(38+bh*42)}k`,'rgba(0,217,255,0.9)',7);
        // month label below
        const ml=iso(gx2+0.31,gy2+0.26,-0.08);
        cx.font='6px monospace';cx.fillStyle='rgba(100,116,139,0.8)';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(m,ml.x,ml.y);
      });

      // ── SALES FUNNEL (stacked iso blocks right side) ──
      FUNNEL.forEach((stage,i)=>{
        const fw=stage.w,fd=0.38,fh=0.32;
        const gx2=4.3+(1.1-fw)/2,gy2=0.2+i*0.8;
        box(cx,gx2,gy2,0,fw,fd,fh,[rgba(stage.c,0.28),rgba(stage.c,0.42),rgba(stage.c,0.52),rgba(stage.c,0.85)]);
        glow(cx,gx2+fw/2,gy2+fd/2,fh+0.04,11,rgba(stage.c,1));
        label(cx,gx2+fw/2,gy2+fd/2,fh+0.18,`${stage.lbl}: ${stage.val}`,rgba(stage.c,0.95),7);
        // funnel connection arrow to next
        if(i<FUNNEL.length-1){
          const ap=iso(gx2+fw/2,gy2+fd/2+0.2,0),bp=iso(gx2+fw/2,gy2+fd/2+0.8,0);
          cx.beginPath();cx.moveTo(ap.x,ap.y);cx.lineTo(bp.x,bp.y);cx.strokeStyle=rgba(stage.c,0.4);cx.lineWidth=0.8;cx.setLineDash([2,4]);cx.stroke();cx.setLineDash([]);
        }
        // flow particles
        fPkts.forEach(pk=>{
          if(Math.floor(pk.y/0.8)===i){
            const pp=iso(gx2+fw/2,gy2+0.05+pk.y%0.8,fh/2);
            dot(cx,gx2+fw/2,gy2+0.05+(pk.y%0.8),fh/2,2.5,rgba(stage.c,0.8));
          }
        });
      });
      fPkts.forEach(pk=>{pk.y+=pk.sp;if(pk.y>3.3){pk.y=-0.3+Math.random()*0.3;}});

      // ── LIVE KPI PANEL (3D flat screen bottom-left area) ──
      box(cx,0.1,0.1,0,2.0,1.0,0.06,['rgba(13,17,40,0.97)','rgba(8,12,28,0.75)','rgba(5,9,20,0.65)','rgba(0,217,255,0.45)']);
      // kpi values on screen
      const kpis=[['$2.4M','Revenue','#00d9ff',0.3,0.3],['94%','CSAT','#10b981',0.3,0.65],['Active','CRM','#7c3aed',1.2,0.3],['127','Closed','#f59e0b',1.2,0.65]];
      kpis.forEach(([val,lbl,col,ox2,oy2])=>{
        const kp=iso(0.1+ox2,0.1+oy2,0.1);
        cx.font=`bold 9px monospace`;cx.fillStyle=rgba(col,0.92);cx.textAlign='center';cx.textBaseline='middle';cx.fillText(val,kp.x,kp.y-4);
        cx.font='6px monospace';cx.fillStyle='rgba(100,116,139,0.8)';cx.fillText(lbl,kp.x,kp.y+5);
      });
      // live blink
      const bl=Math.sin(t*4)>0;
      const blp=iso(1.85,0.1,0.1);
      cx.beginPath();cx.arc(blp.x,blp.y,3.5,0,Math.PI*2);cx.fillStyle=bl?'#10b981':'rgba(16,185,129,0.2)';cx.fill();
      cx.font='6px monospace';cx.fillStyle='rgba(16,185,129,0.8)';cx.textAlign='right';cx.textBaseline='middle';cx.fillText('LIVE',blp.x-6,blp.y);

      id=requestAnimationFrame(draw);
    };
    draw();return()=>cancelAnimationFrame(id);
  },[]);
  return <canvas ref={ref} style={{width:'100%',height:200,display:'block'}}/>;
}
// ── Project data ──
const PROJECTS=[
  {title:"Capstone Hub",Preview:PreviewCapstone,desc:"Unified platform connecting students, clients & instructors with algorithmic team assignments.",stack:["React","Node.js","Firebase","JWT","MongoDB"],features:["Auto-assign algorithm","Multi-role auth","Real-time tracking","Layered security"],github:"https://github.com/bharath021/capstone-hub",live:"https://creative-expression-production.up.railway.app/"},
  {title:"Distributed E-Commerce",Preview:PreviewEcom,desc:"Scalable microservices with independent services for products, orders and payments.",stack:["Spring Boot","React","Docker","Kubernetes","AWS"],features:["Microservices arch","Kubernetes orchestration","AWS EC2/RDS/S3","Event-driven comms"],github:"https://github.com/bharath021/ecommerce-microservices"},
  {title:"Real-Time Collaboration",Preview:PreviewCollab,desc:"Collaborative workspace with live editing, chat and presence indicators.",stack:["React","Node.js","Socket.io","MongoDB","Redis"],features:["WebSocket comms","Redis sessions","MongoDB persistence","Collaborative editing"],github:"https://github.com/bharath021/realtime-collab"},
  {title:"AI Job Recommender",Preview:PreviewAI,desc:"ML system analyzing profiles and job descriptions for personalized recommendations.",stack:["Python","TensorFlow","Flask","PostgreSQL"],features:["TensorFlow ML models","NLP","RESTful Flask API","PostgreSQL storage"],github:"https://github.com/bharath021/ai-job-recommender"},
  {title:"3D Smart Parking",Preview:PreviewParking,desc:"Full 3D parking system with multi-level layout, animated routing and real-time visualization.",stack:["React","Three.js","JavaScript"],features:["3D visualization","Animated car routing","QR tracking","Real-time monitor"],github:"https://github.com/bharath021/3d-parking-automation-"},
  {title:"Salesforce Retail App",Preview:PreviewSalesforce,desc:"Custom Salesforce app for retail operations, inventory and CRM.",stack:["Salesforce","Apex","LWC"],features:["Custom objects","Apex triggers","Lightning components","Automated workflows"],github:"https://github.com/bharath021/salesforce-retail"},
];

function PCard({title,Preview,desc,stack,features,github,live,delay}){
  const[h,sH]=useState(false);const ref=useRef(null);const[v,sV]=useState(false);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)sV(true);},{threshold:.08});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);
  return(
    <div ref={ref} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
      style={{background:SU,border:`1px solid ${h?A:BD}`,borderRadius:6,overflow:"hidden",transition:"all 0.3s",transform:v?(h?"translateY(-6px)":"none"):"translateY(28px)",opacity:v?1:0,transitionDelay:`${delay}s`,boxShadow:h?"0 20px 60px rgba(0,217,255,0.12)":"none",display:"flex",flexDirection:"column"}}>
      {/* Live animated preview */}
      <div style={{position:"relative",background:BG,borderBottom:`1px solid ${h?A:BD}`,height:200,overflow:"hidden",transition:"border-color 0.3s"}}>
        <Preview/>
        {/* scanline overlay */}
        <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)",pointerEvents:"none"}}/>
        {/* top bar */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${A},${A2})`,transform:h?"scaleX(1)":"scaleX(0)",transformOrigin:"left",transition:"transform 0.4s"}}/>
      </div>
      {/* card body */}
      <div style={{padding:"14px 18px 18px",flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:"0.9rem",fontWeight:700}}>{title}</div>
          <div style={{display:"flex",gap:5}}>
            {github&&<a href={github} target="_blank" rel="noreferrer" style={{fontSize:"0.58rem",padding:"3px 8px",border:`1px solid ${BD}`,borderRadius:2,color:MU,textDecoration:"none",transition:"all 0.2s"}}>GitHub</a>}
            {live&&<a href={live} target="_blank" rel="noreferrer" style={{fontSize:"0.58rem",padding:"3px 8px",border:"1px solid rgba(16,185,129,0.35)",borderRadius:2,color:A3,textDecoration:"none"}}>Live ↗</a>}
          </div>
        </div>
        <p style={{fontSize:"0.7rem",color:MU,lineHeight:1.7,marginBottom:11}}>{desc}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:11}}>
          {stack.map(s=><span key={s} style={{fontSize:"0.58rem",padding:"2px 7px",background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.22)",borderRadius:2,color:"#a78bfa"}}>{s}</span>)}
        </div>
        <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:4,marginTop:"auto"}}>
          {features.map(f=><li key={f} style={{fontSize:"0.67rem",color:MU,paddingLeft:13,position:"relative",lineHeight:1.5}}><span style={{position:"absolute",left:0,color:A3,fontSize:"0.44rem",top:5}}>◆</span>{f}</li>)}
        </ul>
      </div>
    </div>
  );
}
function Projects(){
  return(
    <Sec id="projects">
      <FadeIn><SL label="Work"/></FadeIn>
      <FadeIn delay={.1}><ST>Featured Projects</ST></FadeIn>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(310px,1fr))",gap:18}}>
        {PROJECTS.map((p,i)=><PCard key={i} {...p} delay={i*.08}/>)}
      </div>
    </Sec>
  );
}

// ── Experience ──
const EXP=[
  {period:"May 2025–Present",role:"Software Engineer",company:"American Express",pts:["Building production-grade software at one of the world's leading financial services companies."]},
  {period:"May–Dec 2025",role:"Teaching Assistant",company:"UMass Boston",pts:["TA for Advanced Data Structures, Computer Architecture, Database Application Development.","Weekly lab sessions, office hours, rigorous graded feedback."]},
  {period:"May–Oct 2025",role:"Full Stack Developer Intern",company:"Codec Technologies India",pts:["Built responsive UIs with HTML5, CSS3, AngularJS and Java Spring MVC backends.","RESTful & SOAP APIs, AWS EC2/S3, Agile sprints via Jira."]},
  {period:"Jul 2022–Dec 2023",role:"Full Stack Engineer",company:"Tata Consultancy Services",pts:["Spring Boot microservices for IAM: RBAC, secure service-to-service comms.","CI/CD via Jenkins, Docker, Helm, Terraform, Kubernetes on Azure DevOps.","Code reviews, design docs, L3 production incident response."]},
];
function ExpItem({period,role,company,pts,delay}){
  const ref=useRef(null);const[v,sV]=useState(false);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)sV(true);},{threshold:.1});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);
  return(
    <div ref={ref} style={{position:"relative",marginBottom:40,opacity:v?1:0,transform:v?"none":"translateX(-16px)",transition:`all 0.5s ${delay}s ease`}}>
      <div style={{position:"absolute",left:-30,top:6,width:8,height:8,background:A,borderRadius:"50%",boxShadow:`0 0 10px ${A}`}}/>
      <div style={{fontSize:"0.64rem",color:A,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5}}>{period}</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.02rem",fontWeight:700,marginBottom:3}}>{role}</div>
      <div style={{fontSize:"0.74rem",color:MU,marginBottom:11}}>{company}</div>
      <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:7}}>
        {pts.map((p,i)=><li key={i} style={{fontSize:"0.74rem",color:MU,paddingLeft:15,position:"relative",lineHeight:1.6}}><span style={{position:"absolute",left:0,color:A3}}>▸</span>{p}</li>)}
      </ul>
    </div>
  );
}
function Experience(){
  return(
    <Sec id="experience">
      <FadeIn><SL label="Career"/></FadeIn>
      <FadeIn delay={.1}><ST>Experience</ST></FadeIn>
      <div style={{position:"relative",paddingLeft:26}}>
        <div style={{position:"absolute",left:0,top:8,bottom:8,width:1,background:`linear-gradient(to bottom,${A},transparent)`}}/>
        {EXP.map((e,i)=><ExpItem key={i} {...e} delay={i*.1}/>)}
      </div>
    </Sec>
  );
}

// ── Skills ──
const SKILLS={Languages:["Java","Python","JavaScript","C++","C#","SQL","Kotlin"],Frontend:["React.js","AngularJS","HTML5","CSS3","Bootstrap","jQuery"],"Backend & APIs":["Spring Boot","Spring MVC","Node.js","RESTful APIs","SOAP","Hibernate",".NET"],"Cloud & DevOps":["AWS","Azure","Docker","Kubernetes","Jenkins","Terraform","Helm"],Databases:["PostgreSQL","MySQL","Snowflake","SQL Server"],"AI & Data":["TensorFlow","Flask","Power BI","ChatGPT API","Gen AI"]};
function SkillGroup({title,tags}){
  const[h,sH]=useState(false);
  return(
    <div onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)} style={{background:SU,border:`1px solid ${h?A:BD}`,padding:20,borderRadius:2,transition:"border-color 0.2s"}}>
      <div style={{fontSize:"0.63rem",color:A,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:13,paddingBottom:9,borderBottom:`1px solid ${BD}`}}>{title}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
        {tags.map(t=><span key={t} style={{fontSize:"0.63rem",padding:"3px 9px",background:"rgba(0,217,255,0.06)",border:"1px solid rgba(0,217,255,0.13)",borderRadius:2,color:TX}}>{t}</span>)}
      </div>
    </div>
  );
}
function Skills(){
  return(
    <Sec id="skills">
      <FadeIn><SL label="Technical"/></FadeIn>
      <FadeIn delay={.1}><ST>Skills</ST></FadeIn>
      <FadeIn delay={.2}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(195px,1fr))",gap:17}}>
          {Object.entries(SKILLS).map(([k,v])=><SkillGroup key={k} title={k} tags={v}/>)}
        </div>
      </FadeIn>
    </Sec>
  );
}

// ── Achievements ──
function AchCell({cat,items}){
  const[h,sH]=useState(false);
  return(
    <div onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)} style={{background:h?PN:SU,padding:"28px 24px",position:"relative",overflow:"hidden",transition:"background 0.2s"}}>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${A3},${A})`,transform:h?"scaleX(1)":"scaleX(0)",transformOrigin:"left",transition:"transform 0.4s"}}/>
      <div style={{fontSize:"0.6rem",color:A,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:16}}>{cat}</div>
      <div style={{display:"flex",flexDirection:"column",gap:11}}>
        {items.map(([n,l,c])=>(
          <div key={l} style={{display:"flex",alignItems:"baseline",gap:9}}>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:"1.2rem",fontWeight:800,color:c,lineHeight:1,whiteSpace:"nowrap"}}>{n}</span>
            <span style={{fontSize:"0.69rem",color:MU,lineHeight:1.4}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function Achievements(){
  const g=[
    {cat:"⚡ Performance",items:[["75%","faster APIs",A],["55%","reduced load",A],["99.8%","uptime",A],["50%","faster DB queries",A]]},
    {cat:"💰 Cost & Efficiency",items:[["$85K","annual AWS savings",A3],["35%","reduced maintenance",A3],["75%","faster deployments",A3],["40h/wk","saved via automation",A3]]},
    {cat:"🏅 Leadership",items:[["42%","fewer defects","#a78bfa"],["88%","code coverage","#a78bfa"],["10+","developers mentored","#a78bfa"],["8","engineers led","#a78bfa"]]},
  ];
  return(
    <Sec>
      <FadeIn><SL label="Impact"/></FadeIn>
      <FadeIn delay={.1}><ST>Key Achievements</ST></FadeIn>
      <FadeIn delay={.2}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(215px,1fr))",gap:2,background:BD,border:`1px solid ${BD}`}}>
          {g.map(x=><AchCell key={x.cat} {...x}/>)}
        </div>
      </FadeIn>
    </Sec>
  );
}

// ── Education ──
const COURSES={"AI & ML":[{code:"CS 670",name:"Artificial Intelligence",topics:"Search, Knowledge, Neural networks"},{code:"CS 671",name:"Machine Learning",topics:"Supervised/Unsupervised, Deep learning"},{code:"CS 638",name:"Applied Machine Learning",topics:"Production ML, Preprocessing, Deployment"}],"Software Eng.":[{code:"CS 680",name:"OO Design & Programming",topics:"Design patterns, SOLID, UML"},{code:"CS 681",name:"OO Software Development",topics:"Architecture, Agile, Refactoring"},{code:"CS 682",name:"Software Development Lab",topics:"CI/CD, Version control, Teamwork"}],"Databases":[{code:"CS 630",name:"Database Management",topics:"SQL, Normalization, Query optimization"},{code:"CS 636",name:"Database App Dev.",topics:"Stored procedures, Triggers"},{code:"CS 637",name:"Database-Backed Websites",topics:"ORMs, REST APIs, Full-stack"}],"Theory":[{code:"CS 620",name:"Theory of Computation",topics:"Automata, Turing machines"},{code:"CS 622",name:"Formal Languages",topics:"CFGs, Regular expressions"},{code:"CS 624",name:"Analysis of Algorithms",topics:"DP, Graph algorithms"},{code:"CS 651",name:"Compiler Design",topics:"Lexing, Parsing, Codegen"}],"Security":[{code:"CS 613",name:"Applied Cryptography",topics:"Encryption, Public-key, Blockchain"},{code:"CS 642",name:"Cybersecurity in IoT",topics:"IoT security, Threat modeling"}],"Design":[{code:"CS 615",name:"UI Design",topics:"UX principles, HCI, Prototyping"}]};
function CourseRow({code,name,topics}){
  const[h,sH]=useState(false);
  return(
    <tr onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)} style={{background:h?"rgba(0,217,255,0.02)":"transparent",transition:"background 0.15s"}}>
      <td style={{padding:"12px 13px",borderBottom:"1px solid rgba(30,45,61,0.5)",color:A2,fontWeight:700,whiteSpace:"nowrap"}}>{code}</td>
      <td style={{padding:"12px 13px",borderBottom:"1px solid rgba(30,45,61,0.5)",color:TX}}>{name}</td>
      <td style={{padding:"12px 13px",borderBottom:"1px solid rgba(30,45,61,0.5)"}}><span style={{background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.25)",color:A3,padding:"2px 8px",borderRadius:2,fontSize:"0.6rem"}}>A</span></td>
      <td style={{padding:"12px 13px",borderBottom:"1px solid rgba(30,45,61,0.5)",color:MU,fontSize:"0.69rem"}}>{topics}</td>
    </tr>
  );
}
function Education(){
  const[tab,sTab]=useState("AI & ML");
  return(
    <Sec id="education">
      <FadeIn><SL label="Academia"/></FadeIn>
      <FadeIn delay={.1}><ST>Education & Coursework</ST></FadeIn>
      <FadeIn delay={.2}>
        <div style={{display:"flex",gap:18,flexWrap:"wrap",marginBottom:44}}>
          {[{deg:"Master's",field:"Computer Science",inst:"UMass Boston · Dec 2025",badge:"GPA 4.0",ac:A},{deg:"Bachelor's",field:"CS Engineering",inst:"JNTUA · 2022 · India",badge:"DS & Algorithms",ac:A2}].map(d=>(
            <div key={d.deg} style={{flex:1,minWidth:235,background:SU,border:`1px solid ${BD}`,padding:24,borderRadius:4,borderTop:`2px solid ${d.ac}`}}>
              <div style={{fontSize:"0.58rem",color:d.ac,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:9}}>{d.deg}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:"0.97rem",fontWeight:700,marginBottom:5}}>{d.field}</div>
              <div style={{fontSize:"0.72rem",color:MU,marginBottom:11}}>{d.inst}</div>
              <span style={{fontSize:"0.6rem",padding:"3px 9px",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.2)",color:A3,borderRadius:2}}>{d.badge}</span>
            </div>
          ))}
        </div>
        <div style={{fontSize:"0.67rem",color:MU,marginBottom:14}}>Graduate Coursework — 16 courses · All grades: A</div>
        <div style={{display:"flex",flexWrap:"wrap",borderBottom:`1px solid ${BD}`,marginBottom:24}}>
          {Object.keys(COURSES).map(t=>(
            <button key={t} onClick={()=>sTab(t)} style={{padding:"10px 17px",fontSize:"0.64rem",color:tab===t?A:MU,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",background:"none",border:"none",borderBottom:`2px solid ${tab===t?A:"transparent"}`,fontFamily:"monospace",transition:"color 0.2s",outline:"none"}}>{t}</button>
          ))}
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.73rem"}}>
            <thead><tr>{["Code","Course","Grade","Key Topics"].map(h=><th key={h} style={{textAlign:"left",padding:"9px 13px",background:PN,color:A,fontSize:"0.58rem",letterSpacing:"0.1em",textTransform:"uppercase",borderBottom:`1px solid ${BD}`}}>{h}</th>)}</tr></thead>
            <tbody>{COURSES[tab].map(c=><CourseRow key={c.code} {...c}/>)}</tbody>
          </table>
        </div>
        <div style={{display:"flex",gap:14,flexWrap:"wrap",marginTop:22}}>
          {[["Total Courses","16"],["GPA","4.0 / 4.0"],["Specialization","Software Engineering"]].map(([k,v])=>(
            <div key={k} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"7px 13px",background:SU,border:`1px solid ${BD}`,borderRadius:2,fontSize:"0.67rem",color:MU}}>{k}: <strong style={{color:A3}}>{v}</strong></div>
          ))}
        </div>
      </FadeIn>
    </Sec>
  );
}

// ── Certs ──
function CertCard({icon,name}){
  const[h,sH]=useState(false);
  return(
    <div onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)} style={{background:SU,border:`1px solid ${h?A2:BD}`,padding:"17px 20px",display:"flex",alignItems:"center",gap:13,borderRadius:2,transition:"all 0.2s",transform:h?"translateY(-2px)":"none"}}>
      <div style={{width:34,height:34,background:"rgba(124,58,237,0.12)",border:"1px solid rgba(124,58,237,0.28)",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.95rem",flexShrink:0}}>{icon}</div>
      <div style={{fontSize:"0.72rem",lineHeight:1.5}}>{name}</div>
    </div>
  );
}
function Certs(){
  const certs=[{i:"🤖",n:"Generative AI Fundamentals — Academy Accreditation"},{i:"💬",n:"Building Systems with the ChatGPT API"},{i:"☁️",n:"AWS Solutions Architecture Job Simulation"},{i:"🧠",n:"Introduction to Artificial Intelligence (AI)"},{i:"⚙️",n:"Accenture Developer & Technology Job Simulation"}];
  return(
    <Sec>
      <FadeIn><SL label="Learning"/></FadeIn>
      <FadeIn delay={.1}><ST>Certifications</ST></FadeIn>
      <FadeIn delay={.2}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(255px,1fr))",gap:13}}>
          {certs.map(c=><CertCard key={c.n} icon={c.i} name={c.n}/>)}
        </div>
      </FadeIn>
    </Sec>
  );
}

// ── Contact ──
function Contact(){
  return(
    <Sec id="contact">
      <FadeIn>
        <div style={{background:SU,border:`1px solid ${BD}`,padding:"52px 44px",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(0,217,255,0.05) 0%,transparent 70%)",pointerEvents:"none"}}/>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.7rem,4vw,2.5rem)",fontWeight:800,marginBottom:13,letterSpacing:"-0.02em"}}>Let's build something remarkable.</h2>
          <p style={{color:MU,fontSize:"0.77rem",marginBottom:36}}>Open to full-time software engineering roles, internships, and collaborations.</p>
          <div style={{display:"flex",gap:13,justifyContent:"center",flexWrap:"wrap"}}>
            <Btn primary href="mailto:bharathkarumanchi4@gmail.com">bharathkarumanchi4@gmail.com</Btn>
            <Btn href="https://www.linkedin.com/in/bharathkarumanchi-ai">LinkedIn ↗</Btn>
            <Btn href="https://github.com/bharath021">GitHub ↗</Btn>
          </div>
        </div>
      </FadeIn>
    </Sec>
  );
}

// ── Nav ──
function NavLink({href,children}){
  const[h,sH]=useState(false);
  return <li><a href={href} style={{color:h?A:MU,textDecoration:"none",fontSize:"0.7rem",letterSpacing:"0.1em",textTransform:"uppercase",transition:"color 0.2s"}} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}>{children}</a></li>;
}

// ── App ──
export default function App(){
  return(
    <div style={{background:BG,color:TX,fontFamily:"'Space Mono',monospace",minHeight:"100vh",overflowX:"hidden",position:"relative"}}>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",backgroundImage:`linear-gradient(rgba(0,217,255,0.016) 1px,transparent 1px),linear-gradient(90deg,rgba(0,217,255,0.016) 1px,transparent 1px)`,backgroundSize:"60px 60px"}}/>
      <NeuralBg/>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"17px 48px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"linear-gradient(to bottom,rgba(8,12,16,0.96),transparent)",backdropFilter:"blur(8px)"}}>
        <a href="#about" style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.05rem",color:A,textDecoration:"none"}}>BK.</a>
        <ul style={{display:"flex",gap:26,listStyle:"none"}}>
          {[["About","#about"],["Projects","#projects"],["Experience","#experience"],["Skills","#skills"],["Education","#education"],["Contact","#contact"]].map(([l,h])=><NavLink key={l} href={h}>{l}</NavLink>)}
        </ul>
      </nav>
      <Hero/>
      <Divider/><ValueProps/>
      <Divider/><Projects/>
      <Divider/><Experience/>
      <Divider/><Skills/>
      <Divider/><Achievements/>
      <Divider/><Education/>
      <Divider/><Certs/>
      <Divider/><Contact/>
      <footer style={{borderTop:`1px solid ${BD}`,padding:"20px 56px",display:"flex",justifyContent:"space-between",position:"relative",zIndex:1}}>
        <p style={{fontSize:"0.64rem",color:MU}}>© 2026 Bharath Karumanchi</p>
        <p style={{fontSize:"0.64rem",color:MU}}>Greater Boston, MA</p>
      </footer>
    </div>
  );
}
