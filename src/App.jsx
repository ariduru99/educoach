import { useState, useRef, useEffect } from "react";

/* ─── VERİ ─── */
const USERS = [
  { id:"t1", role:"teacher", name:"Ahmet Yılmaz", email:"ahmet@demo.com", pass:"123", subject:"Matematik" },
  { id:"t2", role:"teacher", name:"Selin Çelik",  email:"selin@demo.com",  pass:"123", subject:"İngilizce" },
  { id:"s1", role:"student", name:"Ayşe Kaya",    email:"ayse@demo.com",   pass:"123", grade:"11. Sınıf" },
  { id:"s2", role:"student", name:"Mehmet Demir", email:"mehmet@demo.com", pass:"123", grade:"10. Sınıf" },
  { id:"s3", role:"student", name:"Zeynep Arslan",email:"zeynep@demo.com", pass:"123", grade:"12. Sınıf" },
  { id:"p1", role:"parent",  name:"Fatma Kaya",   email:"fatma@demo.com",  pass:"123", childIds:["s1"] },
  { id:"p2", role:"parent",  name:"Ali Demir",    email:"ali@demo.com",    pass:"123", childIds:["s2"] },
  { id:"a1", role:"admin",   name:"Admin",        email:"admin@demo.com",  pass:"admin" },
];

const INIT_ROOMS = [
  {
    id:"r1", name:"Matematik 11.", subject:"Matematik", teacherId:"t1",
    code:"MAT11X", color:"#2563eb", emoji:"📐",
    members:[
      {userId:"s1",role:"student",forStudent:null},
      {userId:"s2",role:"student",forStudent:null},
      {userId:"p1",role:"parent",forStudent:"s1"},
      {userId:"p2",role:"parent",forStudent:"s2"},
    ],
    announcements:[
      {id:"an1",text:"Hoş geldiniz! Haftalık ödevler burada paylaşılacak.",date:"10 Oca",pinned:true},
      {id:"an2",text:"Sınav tarihi 25 Mart — Türev, İntegral, Limit.",date:"15 Mar",pinned:true},
      {id:"an3",text:"Bu hafta Türev konusu tamamlandı.",date:"11 Mar",pinned:false},
    ],
    schedule:[
      {id:"sc1",day:"Pazartesi",time:"15:00",duration:2,topic:"Türev & İntegral",studentIds:["s1","s2"]},
      {id:"sc2",day:"Çarşamba",time:"16:00",duration:1.5,topic:"Limit Problemleri",studentIds:["s1"]},
      {id:"sc3",day:"Cuma",   time:"14:00",duration:2,topic:"Olasılık",studentIds:["s2"]},
    ],
  },
  {
    id:"r2", name:"İngilizce YDT", subject:"İngilizce", teacherId:"t2",
    code:"ENG2YD", color:"#7c3aed", emoji:"🌍",
    members:[
      {userId:"s1",role:"student",forStudent:null},
      {userId:"s3",role:"student",forStudent:null},
      {userId:"p1",role:"parent",forStudent:"s1"},
    ],
    announcements:[
      {id:"an4",text:"Haftaya Writing Workshop — hazırlıklı gelin!",date:"14 Mar",pinned:true},
    ],
    schedule:[
      {id:"sc4",day:"Salı",   time:"15:30",duration:1.5,topic:"Grammar & Writing",studentIds:["s1","s3"]},
      {id:"sc5",day:"Perşembe",time:"16:00",duration:2,topic:"Reading & Speaking",studentIds:["s1"]},
    ],
  },
];

const INIT_RD = {
  "r1-s1":{
    grades:[
      {id:"g1",date:"2026-02-10",topic:"Türev",score:62},
      {id:"g2",date:"2026-02-24",topic:"İntegral",score:70},
      {id:"g3",date:"2026-03-10",topic:"Limit",score:74},
      {id:"g4",date:"2026-03-17",topic:"Olasılık",score:80},
    ],
    lessons:[
      {id:"l1",date:"2026-03-18",topic:"Olasılık Tekrar",hours:2,attended:true,paid:true,amount:700},
      {id:"l2",date:"2026-03-11",topic:"Türev Alıştırmaları",hours:2,attended:true,paid:true,amount:700},
      {id:"l3",date:"2026-03-04",topic:"Limit",hours:2,attended:false,paid:false,amount:700},
    ],
    homework:[
      {id:"h1",title:"Türev Alıştırmaları sf.45",due:"2026-03-18",status:"graded",grade:90,feedback:"Harika!",subject:"Matematik"},
      {id:"h2",title:"Olasılık Problem Seti",due:"2026-03-25",status:"pending",grade:null,feedback:"",subject:"Matematik"},
      {id:"h3",title:"Limit Soruları",due:"2026-03-28",status:"pending",grade:null,feedback:"",subject:"Matematik"},
    ],
    messages:[
      {id:"m1",from:"t1",to:"p1",text:"Ayşe çok iyi çalıştı!",date:"15 Mar 14:32"},
      {id:"m2",from:"p1",to:"t1",text:"Teşekkür ederim hocam.",date:"15 Mar 16:10"},
    ],
  },
  "r1-s2":{
    grades:[
      {id:"g5",date:"2026-02-15",topic:"Fonksiyonlar",score:55},
      {id:"g6",date:"2026-03-01",topic:"Trigonometri",score:62},
      {id:"g7",date:"2026-03-15",topic:"Logaritma",score:70},
    ],
    lessons:[
      {id:"l4",date:"2026-03-17",topic:"Logaritma Tekrar",hours:2,attended:true,paid:true,amount:800},
      {id:"l5",date:"2026-03-10",topic:"Trigonometri",hours:2,attended:true,paid:false,amount:800},
    ],
    homework:[
      {id:"h3",title:"Logaritma Problem Seti",due:"2026-03-24",status:"pending",grade:null,feedback:"",subject:"Matematik"},
    ],
    messages:[],
  },
  "r2-s1":{
    grades:[
      {id:"g8",date:"2026-02-10",topic:"Grammar",score:78},
      {id:"g9",date:"2026-03-05",topic:"Writing",score:85},
      {id:"g10",date:"2026-03-15",topic:"Speaking",score:88},
    ],
    lessons:[
      {id:"l6",date:"2026-03-16",topic:"Essay Writing",hours:1.5,attended:true,paid:true,amount:525},
      {id:"l7",date:"2026-03-09",topic:"Grammar Review",hours:1.5,attended:true,paid:false,amount:525},
    ],
    homework:[
      {id:"h4",title:"Grammar Worksheet B",due:"2026-03-16",status:"graded",grade:85,feedback:"Article kullanımına dikkat.",subject:"İngilizce"},
      {id:"h5",title:"Essay: My Future",due:"2026-03-30",status:"pending",grade:null,feedback:"",subject:"İngilizce"},
    ],
    messages:[
      {id:"m3",from:"t2",to:"p1",text:"Ayşe harika ilerleme!",date:"16 Mar 09:15"},
    ],
  },
  "r2-s3":{
    grades:[
      {id:"g11",date:"2026-02-15",topic:"Reading",score:72},
      {id:"g12",date:"2026-03-01",topic:"Writing",score:82},
      {id:"g13",date:"2026-03-15",topic:"Speaking",score:88},
    ],
    lessons:[{id:"l8",date:"2026-03-16",topic:"Advanced Writing",hours:1.5,attended:true,paid:true,amount:450}],
    homework:[],
    messages:[],
  },
};

/* ─── YARDIMCILAR ─── */
const nid = () => `${Date.now()}${Math.floor(Math.random()*999)}`;
const scC = s => s>=85?"#16a34a":s>=70?"#2563eb":s>=55?"#d97706":"#dc2626";
const scB = s => s>=85?"#f0fdf4":s>=70?"#eff6ff":s>=55?"#fffbeb":"#fef2f2";
const scL = s => s>=85?"Çok İyi":s>=70?"İyi":s>=55?"Orta":"Gelişmeli";
const rC  = r => ({teacher:"#2563eb",student:"#7c3aed",parent:"#d97706",admin:"#0891b2"}[r]||"#374151");
const rB  = r => ({teacher:"#eff6ff",student:"#f5f3ff",parent:"#fffbeb",admin:"#ecfeff"}[r]||"#f9fafb");
const rN  = r => ({teacher:"Öğretmen",student:"Öğrenci",parent:"Veli",admin:"Admin"}[r]||r);
const DAYS = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];
const fmt = d => { try { return new Date(d).toLocaleDateString("tr-TR",{day:"2-digit",month:"short"}); } catch { return d; } };

/* ─── STİLLER ─── */
const c = {
  bg:"#f8fafc", white:"#ffffff", border:"#e2e8f0", muted:"#94a3b8",
  dark:"#0f172a", mid:"#475569", light:"#f1f5f9",
};

const inp = {background:c.light,border:`1px solid ${c.border}`,borderRadius:8,padding:"8px 12px",fontSize:13,color:c.dark,outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box"};

/* ─── UI BİLEŞENLERİ ─── */
function Av({name,role,sz=34}){
  const ini=(name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return <div style={{width:sz,height:sz,borderRadius:"50%",flexShrink:0,background:rB(role),color:rC(role),border:`2px solid ${rC(role)}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:sz*.33,fontWeight:700}}>{ini}</div>;
}

function Tag({label,color,bg,sm}){
  return <span style={{background:bg||c.light,color:color||c.mid,borderRadius:99,padding:sm?"1px 7px":"2px 9px",fontSize:sm?10:11,fontWeight:600,whiteSpace:"nowrap"}}>{label}</span>;
}

function Btn({children,onClick,color="#2563eb",outline,ghost,danger,sm,full,disabled}){
  let bg=color,fg="#fff",border="none",pad=sm?"5px 12px":"9px 18px";
  if(outline){bg="transparent";fg=color;border=`1.5px solid ${color}`;}
  if(ghost){bg="transparent";fg=c.mid;border="none";}
  if(danger){bg="#fef2f2";fg="#dc2626";border="none";}
  return <button onClick={disabled?undefined:onClick} style={{background:bg,color:fg,border,borderRadius:8,fontWeight:600,cursor:disabled?"not-allowed":"pointer",padding:pad,fontSize:sm?12:13,opacity:disabled?.5:1,display:"inline-flex",alignItems:"center",gap:5,width:full?"100%":undefined,justifyContent:full?"center":undefined,fontFamily:"inherit",transition:"opacity .15s"}}>{children}</button>;
}

function Card({children,style:sx}){
  return <div style={{background:c.white,border:`1px solid ${c.border}`,borderRadius:12,padding:18,...sx}}>{children}</div>;
}

function Modal({title,onClose,children,w=500}){
  return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div onClick={e=>e.stopPropagation()} style={{background:c.white,borderRadius:14,width:"100%",maxWidth:w,maxHeight:"90vh",overflowY:"auto",padding:24,boxShadow:"0 24px 60px rgba(0,0,0,.2)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <strong style={{fontSize:16}}>{title}</strong>
        <button onClick={onClose} style={{background:c.light,border:"none",borderRadius:7,width:28,height:28,cursor:"pointer",fontSize:14,color:c.mid,fontFamily:"inherit"}}>✕</button>
      </div>
      {children}
    </div>
  </div>;
}

function TabBar({tabs,active,onSelect,color}){
  return <div style={{display:"flex",gap:2,background:c.light,padding:3,borderRadius:10,flexWrap:"wrap"}}>
    {tabs.map(t=><button key={t.id} onClick={()=>onSelect(t.id)} style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",background:active===t.id?(color||"#2563eb"):"transparent",color:active===t.id?"#fff":c.mid,display:"flex",alignItems:"center",gap:4,whiteSpace:"nowrap"}}>
      {t.ic} {t.lb}
      {t.badge>0&&<span style={{background:"#dc2626",color:"#fff",borderRadius:99,fontSize:9,fontWeight:700,padding:"0 4px"}}>{t.badge}</span>}
    </button>)}
  </div>;
}

function Row({children,gap=10,align="center",justify,wrap,style:sx}){
  return <div style={{display:"flex",alignItems:align,gap,justifyContent:justify||undefined,flexWrap:wrap?"wrap":undefined,...sx}}>{children}</div>;
}

function Col({children,gap=8,style:sx}){
  return <div style={{display:"flex",flexDirection:"column",gap,...sx}}>{children}</div>;
}

function Label({children}){
  return <p style={{fontSize:11,fontWeight:700,color:c.mid,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>{children}</p>;
}

/* ─── MİNİ GRAFİK ─── */
function Sparkline({scores,color,w=120,h=36}){
  if(!scores||scores.length<2)return null;
  const mn=Math.min(...scores)-5,mx=Math.max(...scores)+5;
  const xs=scores.map((_,i)=>2+(i/(scores.length-1))*(w-4));
  const ys=scores.map(v=>h-2-((v-mn)/(mx-mn))*(h-4));
  const path=xs.map((x,i)=>`${i===0?"M":"L"}${x},${ys[i]}`).join(" ");
  return <svg width={w} height={h}>
    <path d={`${path} L${xs[xs.length-1]},${h} L${xs[0]},${h} Z`} fill={`${color}25`}/>
    <path d={path} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>
    {xs.map((x,i)=><circle key={i} cx={x} cy={ys[i]} r="3" fill={color}/>)}
  </svg>;
}

/* ─── BÜYÜK GRAFİK ─── */
function LineChart({grades,color,h=140}){
  if(!grades||grades.length<2)return <p style={{color:c.muted,fontSize:13,padding:"20px 0",textAlign:"center"}}>Yeterli veri yok.</p>;
  const scores=grades.map(g=>g.score);
  const W=460,px=36,py=14;
  const mn=Math.min(...scores)-10,mx=100;
  const xs=scores.map((_,i)=>px+(i/(scores.length-1))*(W-px-10));
  const ys=scores.map(v=>h-py-((v-mn)/(mx-mn))*(h-py*2));
  const path=xs.map((x,i)=>`${i===0?"M":"L"}${x},${ys[i]}`).join(" ");
  const id=`lc${color.replace("#","")}`;
  return <svg width="100%" viewBox={`0 0 ${W} ${h}`} style={{overflow:"visible"}}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity=".18"/>
      <stop offset="100%" stopColor={color} stopOpacity="0"/>
    </linearGradient></defs>
    {[50,70,85,100].map(g=>{const y=h-py-((g-mn)/(mx-mn))*(h-py*2);return y>=0&&y<=h?<g key={g}><line x1={px} y1={y} x2={W-8} y2={y} stroke={c.border} strokeWidth="1"/><text x={px-6} y={y+4} fill={c.muted} fontSize="10" textAnchor="end">{g}</text></g>:null;})}
    <path d={`${path} L${xs[xs.length-1]},${h-py} L${px},${h-py} Z`} fill={`url(#${id})`}/>
    <path d={path} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {xs.map((x,i)=><g key={i}>
      <circle cx={x} cy={ys[i]} r="5" fill={color}/>
      <text x={x} y={ys[i]-10} fill={color} fontSize="11" textAnchor="middle" fontWeight="700">{scores[i]}</text>
      <text x={x} y={h-2} fill={c.muted} fontSize="9" textAnchor="middle">{grades[i].date.slice(5)}</text>
    </g>)}
  </svg>;
}

/* ─── BAR GRAFİK ─── */
function BarChart({data,color}){
  if(!data||data.length===0)return null;
  const max=Math.max(...data.map(d=>d.value));
  return <div style={{display:"flex",alignItems:"flex-end",gap:6,height:80}}>
    {data.map((d,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
      <p style={{fontSize:10,fontWeight:700,color}}>{d.value}</p>
      <div style={{width:"100%",background:c.light,borderRadius:4,overflow:"hidden",height:56}}>
        <div style={{height:`${(d.value/max)*100}%`,background:color,borderRadius:4,marginTop:`${100-(d.value/max)*100}%`,transition:"height .4s"}}/>
      </div>
      <p style={{fontSize:9,color:c.muted,textAlign:"center",lineHeight:1.2}}>{d.label}</p>
    </div>)}
  </div>;
}

/* ─── HAFTALIK PROGRAM ─── */
function WeeklySchedule({schedule,rooms,userId,role}){
  const allSlots = schedule.map(slot=>{
    const room=rooms.find(r=>r.schedule?.find(s=>s.id===slot.id));
    return {...slot,room};
  });

  const bgColors=["#eff6ff","#f5f3ff","#f0fdf4","#fffbeb","#fef2f2","#ecfeff","#fdf4ff"];
  const bdColors=["#2563eb","#7c3aed","#16a34a","#d97706","#dc2626","#0891b2","#9333ea"];

  return <div style={{overflowX:"auto"}}>
    <div style={{display:"grid",gridTemplateColumns:"80px repeat(7,1fr)",gap:4,minWidth:600}}>
      <div style={{background:c.light,borderRadius:8,padding:"8px 4px",textAlign:"center",fontSize:11,fontWeight:700,color:c.mid}}>Saat</div>
      {DAYS.map((d,i)=><div key={i} style={{background:c.light,borderRadius:8,padding:"8px 4px",textAlign:"center",fontSize:11,fontWeight:700,color:c.mid}}>{d.slice(0,3)}</div>)}
      {["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"].map(time=>[
        <div key={`t-${time}`} style={{padding:"10px 4px",textAlign:"center",fontSize:11,color:c.muted,fontWeight:600}}>{time}</div>,
        ...DAYS.map((day,di)=>{
          const slot=allSlots.find(s=>s.day===day&&s.time===time);
          if(slot){
            const idx=rooms.findIndex(r=>r.id===slot.room?.id)%bgColors.length;
            return <div key={`${time}-${di}`} style={{background:bgColors[idx],border:`1.5px solid ${bdColors[idx]}`,borderRadius:8,padding:"6px 8px",fontSize:11}}>
              <p style={{fontWeight:700,color:bdColors[idx]}}>{slot.room?.emoji} {slot.room?.subject}</p>
              <p style={{color:c.mid,marginTop:2}}>{slot.topic}</p>
              <p style={{color:c.muted,marginTop:1}}>{slot.duration}s</p>
            </div>;
          }
          return <div key={`${time}-${di}`} style={{background:"transparent",borderRadius:8,minHeight:54}}/>;
        })
      ])}
    </div>
  </div>;
}

/* ─── ÖDEV TAKVİMİ ─── */
function HomeworkCalendar({allHomework}){
  const [month,setMonth]=useState(new Date(2026,2,1));
  const year=month.getFullYear();
  const mon=month.getMonth();
  const firstDay=new Date(year,mon,1).getDay();
  const daysInMonth=new Date(year,mon+1,0).getDate();
  const start=firstDay===0?6:firstDay-1;
  const cells=[];
  for(let i=0;i<start;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(d);
  while(cells.length%7!==0) cells.push(null);

  const hwByDay={};
  allHomework.forEach(h=>{
    try{
      const dt=new Date(h.due);
      if(dt.getFullYear()===year&&dt.getMonth()===mon){
        const d=dt.getDate();
        if(!hwByDay[d]) hwByDay[d]=[];
        hwByDay[d].push(h);
      }
    }catch{}
  });

  const today=new Date();
  const weeks=[];
  for(let i=0;i<cells.length;i+=7) weeks.push(cells.slice(i,i+7));

  return <div>
    <Row justify="space-between" style={{marginBottom:14}}>
      <Btn ghost sm onClick={()=>setMonth(new Date(year,mon-1,1))}>←</Btn>
      <strong style={{fontSize:14}}>{month.toLocaleDateString("tr-TR",{month:"long",year:"numeric"})}</strong>
      <Btn ghost sm onClick={()=>setMonth(new Date(year,mon+1,1))}>→</Btn>
    </Row>
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
      {["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"].map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:c.muted,padding:"4px 0"}}>{d}</div>)}
    </div>
    {weeks.map((week,wi)=><div key={wi} style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:2}}>
      {week.map((day,di)=>{
        const isToday=day&&today.getDate()===day&&today.getMonth()===mon&&today.getFullYear()===year;
        const hw=day?hwByDay[day]||[]:[];
        return <div key={di} style={{minHeight:52,borderRadius:8,padding:4,background:isToday?"#eff6ff":day?"#fff":c.light,border:isToday?"1.5px solid #2563eb":`1px solid ${c.border}`}}>
          {day&&<>
            <p style={{fontSize:11,fontWeight:isToday?700:500,color:isToday?"#2563eb":c.mid,marginBottom:2}}>{day}</p>
            {hw.slice(0,2).map((h,i)=><div key={i} style={{background:h.status==="graded"?"#f0fdf4":h.status==="pending"?"#fffbeb":"#f5f3ff",borderRadius:4,padding:"1px 5px",marginBottom:1}}>
              <p style={{fontSize:9,fontWeight:600,color:h.status==="graded"?"#16a34a":"#d97706",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.title.slice(0,12)}</p>
            </div>)}
            {hw.length>2&&<p style={{fontSize:9,color:c.muted}}>+{hw.length-2}</p>}
          </>}
        </div>;
      })}
    </div>)}
    <Row gap={8} style={{marginTop:10}}>
      {[{l:"Bekliyor",bg:"#fffbeb",c:"#d97706"},{l:"Teslim",bg:"#eff6ff",c:"#2563eb"},{l:"Notlandı",bg:"#f0fdf4",c:"#16a34a"}].map(x=><Row key={x.l} gap={4}><div style={{width:10,height:10,borderRadius:3,background:x.bg,border:`1px solid ${x.c}`}}/><span style={{fontSize:10,color:c.mid}}>{x.l}</span></Row>)}
    </Row>
  </div>;
}

/* ─── ÖĞRENCİ ANALİZ PANELİ ─── */
function StudentAnalytics({stu,allRooms,rdMap}){
  const [aiOpen,setAiOpen]=useState(false);
  const [aiText,setAiText]=useState("");
  const [aiLoad,setAiLoad]=useState(false);

  const myRooms=allRooms.filter(r=>r.members.find(m=>m.userId===stu.id));
  const allGrades=myRooms.flatMap(r=>(rdMap[`${r.id}-${stu.id}`]?.grades||[]).map(g=>({...g,subject:r.subject,roomColor:r.color})));
  const allLessons=myRooms.flatMap(r=>rdMap[`${r.id}-${stu.id}`]?.lessons||[]);
  const allHw=myRooms.flatMap(r=>rdMap[`${r.id}-${stu.id}`]?.homework||[]);

  const avgScore=allGrades.length?Math.round(allGrades.reduce((a,g)=>a+g.score,0)/allGrades.length):null;
  const attendRate=allLessons.length?Math.round(allLessons.filter(l=>l.attended).length/allLessons.length*100):null;
  const hwDone=allHw.filter(h=>h.status==="graded").length;
  const hwTotal=allHw.length;

  const subjectMap={};
  allGrades.forEach(g=>{if(!subjectMap[g.subject])subjectMap[g.subject]=[];subjectMap[g.subject].push(g.score);});
  const subjectAvgs=Object.entries(subjectMap).map(([sub,scores])=>({label:sub,value:Math.round(scores.reduce((a,b)=>a+b,0)/scores.length)}));

  const trend=allGrades.length>1?allGrades[allGrades.length-1].score-allGrades[0].score:null;

  async function loadAI(){
    setAiOpen(true);setAiLoad(true);setAiText("");
    const g=allGrades.map(x=>`${x.date} ${x.subject} ${x.topic} ${x.score}/100`).join(", ")||"Yok";
    const h=allHw.map(x=>`${x.title}:${x.status==="graded"?x.grade+"/100":"Bekliyor"}`).join(", ")||"Yok";
    const prompt=`Eğitim koçu olarak kısa Türkçe analiz yaz.\nÖğrenci: ${stu.name} | ${stu.grade}\nTüm Notlar: ${g}\nÖdevler: ${h}\nDevamsızlık: ${allLessons.filter(l=>!l.attended).length} ders\nBaşlıklar bold: **📈 Genel Analiz** **💪 Güçlü** **⚠️ Zayıf** **🎯 Plan** **👨‍👩‍👧 Veliye**\nMax 300 kelime.`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:prompt}]})});
      const d=await res.json();setAiText(d.content?.[0]?.text||"Alınamadı.");
    }catch{setAiText("❌ Bağlantı hatası.");}
    setAiLoad(false);
  }

  return <div>
    {aiOpen&&<Modal title={`✦ AI Analiz — ${stu.name}`} onClose={()=>setAiOpen(false)} w={580}>
      {aiLoad?<div style={{textAlign:"center",padding:"36px 0"}}><div style={{width:32,height:32,border:`3px solid ${c.border}`,borderTop:"3px solid #2563eb",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 12px"}}/><p style={{color:c.muted,fontSize:13}}>Analiz yapılıyor...</p></div>
        :<div style={{fontSize:13.5,lineHeight:1.9,color:c.mid}}>{aiText.split(/(\*\*.*?\*\*)/).map((p,i)=>p.startsWith("**")&&p.endsWith("**")?<strong key={i} style={{color:c.dark,display:"block",marginTop:12,marginBottom:2}}>{p.slice(2,-2)}</strong>:<span key={i}>{p}</span>)}</div>}
    </Modal>}

    {/* Stat kartları */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
      {[
        {l:"Genel Ort.",v:avgScore?`${avgScore}/100`:"—",c:avgScore?scC(avgScore):"#94a3b8",ic:"📊"},
        {l:"Devam",v:attendRate?`%${attendRate}`:"—",c:attendRate>80?"#16a34a":attendRate>60?"#d97706":"#dc2626",ic:"📅"},
        {l:"Ödev",v:`${hwDone}/${hwTotal}`,c:"#7c3aed",ic:"📋"},
        {l:"Trend",v:trend!==null?(trend>=0?`+${trend}`:trend):"—",c:trend>0?"#16a34a":trend<0?"#dc2626":"#94a3b8",ic:"📈"},
      ].map(x=><Card key={x.l} style={{padding:"12px 14px"}}>
        <Row gap={8}>
          <span style={{fontSize:20}}>{x.ic}</span>
          <Col gap={2}>
            <p style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:.7,fontWeight:600}}>{x.l}</p>
            <p style={{fontSize:18,fontWeight:700,color:x.c}}>{x.v}</p>
          </Col>
        </Row>
      </Card>)}
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:14,marginBottom:14}}>
      {/* Not trendi */}
      <Card>
        <Row justify="space-between" style={{marginBottom:12}}>
          <strong style={{fontSize:13}}>Not Gelişimi</strong>
          <Btn sm color="#2563eb" onClick={loadAI}>✦ AI Analiz</Btn>
        </Row>
        {allGrades.length>=2
          ?<LineChart grades={allGrades} color="#2563eb"/>
          :<p style={{color:c.muted,fontSize:13,textAlign:"center",padding:"20px 0"}}>Yeterli not yok.</p>}
      </Card>

      {/* Ders bazlı ortalama */}
      <Card>
        <strong style={{fontSize:13,display:"block",marginBottom:12}}>Ders Bazlı Ortalama</strong>
        {subjectAvgs.length>0
          ?<BarChart data={subjectAvgs} color="#7c3aed"/>
          :<p style={{color:c.muted,fontSize:13,textAlign:"center",padding:"20px 0"}}>Veri yok.</p>}
      </Card>
    </div>

    {/* Son notlar */}
    <Card>
      <strong style={{fontSize:13,display:"block",marginBottom:12}}>Son Sınavlar</strong>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8}}>
        {[...allGrades].reverse().slice(0,8).map(g=><div key={g.id} style={{background:scB(g.score),borderRadius:10,padding:"10px 12px",border:`1px solid ${scC(g.score)}25`}}>
          <Row justify="space-between">
            <Col gap={2}>
              <p style={{fontSize:13,fontWeight:700,color:c.dark}}>{g.topic}</p>
              <p style={{fontSize:11,color:c.muted}}>{g.subject} · {fmt(g.date)}</p>
            </Col>
            <p style={{fontSize:22,fontWeight:800,color:scC(g.score)}}>{g.score}</p>
          </Row>
        </div>)}
      </div>
    </Card>
  </div>;
}

/* ─── GİRİŞ ─── */
function Login({onLogin}){
  const [em,setEm]=useState("");
  const [pw,setPw]=useState("");
  const [err,setErr]=useState("");
  function attempt(e,p){
    const u=USERS.find(x=>x.email===(e||em)&&x.pass===(p||pw));
    if(u)onLogin(u); else setErr("Hatalı e-posta veya şifre.");
  }
  const demos=[{lb:"Öğretmen",ic:"👨‍🏫",role:"teacher",u:USERS[0]},{lb:"Öğrenci",ic:"👨‍🎓",role:"student",u:USERS[2]},{lb:"Veli",ic:"👨‍👩‍👧",role:"parent",u:USERS[5]},{lb:"Admin",ic:"⚙️",role:"admin",u:USERS[7]}];
  return <div style={{minHeight:"100vh",background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{width:"100%",maxWidth:380}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{width:52,height:52,background:"#2563eb",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 12px"}}>📚</div>
        <h1 style={{fontSize:28,fontWeight:800,marginBottom:4,color:c.dark}}>EduCoach</h1>
        <p style={{color:c.muted,fontSize:14}}>Koçluk & Ders Odası Platformu</p>
      </div>
      <Card style={{marginBottom:12}}>
        <Col>
          <div><Label>E-posta</Label><input style={inp} type="email" value={em} onChange={e=>setEm(e.target.value)} placeholder="ad@demo.com"/></div>
          <div><Label>Şifre</Label><input style={inp} type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••" onKeyDown={e=>e.key==="Enter"&&attempt()}/></div>
          {err&&<div style={{background:"#fef2f2",color:"#dc2626",borderRadius:8,padding:"8px 12px",fontSize:13}}>⚠️ {err}</div>}
          <Btn full onClick={()=>attempt()}>Giriş Yap →</Btn>
        </Col>
      </Card>
      <Card>
        <p style={{fontSize:11,fontWeight:700,color:c.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:12,textAlign:"center"}}>Demo Hesaplar</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {demos.map(d=><button key={d.lb} onClick={()=>attempt(d.u.email,d.u.pass)} style={{background:rB(d.role),border:`1px solid ${rC(d.role)}25`,borderRadius:10,padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit"}}>
            <span style={{fontSize:20}}>{d.ic}</span>
            <div style={{textAlign:"left"}}><p style={{fontSize:12,fontWeight:700,color:rC(d.role)}}>{d.lb}</p><p style={{fontSize:10,color:c.muted}}>{d.u.name}</p></div>
          </button>)}
        </div>
      </Card>
    </div>
  </div>;
}

/* ─── SIDEBAR ─── */
function Sidebar({user,nav,active,onSelect,onLogout,collapsed,onToggle}){
  const clr=rC(user.role);
  const W=collapsed?60:210;
  return <div style={{width:W,background:c.white,borderRight:`1px solid ${c.border}`,display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,flexShrink:0,transition:"width .22s ease",overflow:"hidden"}}>
    {/* Header */}
    <div style={{display:"flex",alignItems:"center",padding:"14px 12px",borderBottom:`1px solid ${c.border}`,minHeight:54,gap:8}}>
      {!collapsed&&<div style={{width:28,height:28,background:"#2563eb",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>📚</div>}
      {!collapsed&&<strong style={{fontSize:14,flex:1,whiteSpace:"nowrap"}}>EduCoach</strong>}
      <button onClick={onToggle} style={{background:c.light,border:"none",borderRadius:7,width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:c.mid,flexShrink:0,fontFamily:"inherit"}}>{collapsed?"→":"←"}</button>
    </div>

    {/* User */}
    <div style={{display:"flex",alignItems:"center",padding:"10px 12px",borderBottom:`1px solid ${c.border}`,gap:8,minHeight:52}}>
      <Av name={user.name} role={user.role} sz={30}/>
      {!collapsed&&<div style={{overflow:"hidden",flex:1}}>
        <p style={{fontSize:12,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</p>
        <Tag label={rN(user.role)} color={clr} bg={rB(user.role)} sm/>
      </div>}
    </div>

    {/* Nav */}
    <nav style={{flex:1,padding:"8px 8px",overflowY:"auto",overflowX:"hidden"}}>
      {nav.map(item=><button key={item.id} onClick={()=>onSelect(item.id)} title={collapsed?item.lb:undefined} style={{width:"100%",display:"flex",alignItems:"center",gap:collapsed?0:8,padding:"8px",borderRadius:9,border:"none",cursor:"pointer",background:active===item.id?clr+"14":"transparent",color:active===item.id?clr:c.mid,marginBottom:2,textAlign:"left",fontSize:13,fontWeight:active===item.id?700:500,fontFamily:"inherit",justifyContent:collapsed?"center":"flex-start",whiteSpace:"nowrap"}}>
        <span style={{fontSize:16,flexShrink:0}}>{item.ic}</span>
        {!collapsed&&<span style={{flex:1}}>{item.lb}</span>}
        {!collapsed&&item.badge>0&&<span style={{background:"#dc2626",color:"#fff",borderRadius:99,fontSize:9,fontWeight:700,padding:"0 5px"}}>{item.badge}</span>}
        {collapsed&&item.badge>0&&<span style={{position:"absolute",background:"#dc2626",color:"#fff",borderRadius:99,fontSize:8,fontWeight:700,padding:"0 4px",marginLeft:14,marginTop:-10}}>{item.badge}</span>}
      </button>)}
    </nav>

    {/* Logout */}
    <div style={{padding:"10px 8px",borderTop:`1px solid ${c.border}`}}>
      <button onClick={onLogout} title={collapsed?"Çıkış":undefined} style={{width:"100%",padding:"8px",border:"none",borderRadius:9,background:"transparent",color:c.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontSize:12,fontFamily:"inherit",justifyContent:collapsed?"center":"flex-start"}}>
        <span>🚪</span>{!collapsed&&"Çıkış Yap"}
      </button>
    </div>
  </div>;
}

/* ─── DASHBOARD ─── */
function Dashboard({user,rooms,rdMap,goRooms}){
  const myRooms=user.role==="teacher"?rooms.filter(r=>r.teacherId===user.id):user.role==="admin"?rooms:rooms.filter(r=>r.members.find(m=>m.userId===user.id));
  const stuIds=[...new Set(myRooms.flatMap(r=>r.members.filter(m=>m.role==="student").map(m=>m.userId)))];
  const allLessons=myRooms.flatMap(r=>stuIds.flatMap(sid=>rdMap[`${r.id}-${sid}`]?.lessons||[]));
  const pendPay=allLessons.filter(l=>!l.paid).reduce((a,l)=>a+l.amount,0);
  const allHw=myRooms.flatMap(r=>stuIds.flatMap(sid=>(rdMap[`${r.id}-${sid}`]?.homework||[]).filter(h=>h.status==="pending")));
  const unreadMsgs=myRooms.flatMap(r=>stuIds.flatMap(sid=>(rdMap[`${r.id}-${sid}`]?.messages||[]).filter(m=>m.to===user.id)));
  const pinned=myRooms.flatMap(r=>r.announcements.filter(a=>a.pinned).map(a=>({...a,rName:r.name,rColor:r.color,rEmoji:r.emoji})));

  const allSchedule=myRooms.flatMap(r=>(r.schedule||[]).map(s=>({...s,room:r})));

  const stats=user.role==="teacher"
    ?[{l:"Oda",v:myRooms.length,c:"#0891b2",ic:"🏫"},{l:"Öğrenci",v:stuIds.length,c:"#7c3aed",ic:"👨‍🎓"},{l:"Tahsilat Bekleyen",v:`₺${pendPay.toLocaleString()}`,c:"#d97706",ic:"💰"},{l:"Mesaj",v:unreadMsgs.length,c:"#dc2626",ic:"💬"}]
    :[{l:"Oda",v:myRooms.length,c:"#0891b2",ic:"🏫"},{l:"Bekleyen Ödev",v:allHw.length,c:allHw.length>0?"#d97706":"#16a34a",ic:"📋"},{l:"Bekleyen Ödeme",v:`₺${pendPay.toLocaleString()}`,c:pendPay>0?"#d97706":"#16a34a",ic:"💰"},{l:"Öğretmen",v:[...new Set(myRooms.map(r=>r.teacherId))].length,c:"#2563eb",ic:"👨‍🏫"}];

  const todayName=DAYS[new Date().getDay()===0?6:new Date().getDay()-1];
  const todaySlots=allSchedule.filter(s=>s.day===todayName);

  return <div style={{padding:"24px 28px"}}>
    <h2 style={{fontSize:22,fontWeight:700,marginBottom:4,color:c.dark}}>Hoş geldin, {user.name.split(" ")[0]} 👋</h2>
    <p style={{color:c.muted,fontSize:13,marginBottom:20}}>{new Date().toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})}</p>

    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22}}>
      {stats.map(x=><Card key={x.l} style={{padding:"14px 16px"}}>
        <Row gap={10}>
          <div style={{width:36,height:36,borderRadius:9,background:x.c+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{x.ic}</div>
          <Col gap={1}>
            <p style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:.7,fontWeight:600}}>{x.l}</p>
            <p style={{fontSize:19,fontWeight:700,color:x.c}}>{x.v}</p>
          </Col>
        </Row>
      </Card>)}
    </div>

    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,marginBottom:22}}>
      {/* Bugünkü dersler */}
      <Card>
        <Row justify="space-between" style={{marginBottom:12}}>
          <strong style={{fontSize:14}}>📅 Bugünkü Dersler <Tag label={todayName} sm/></strong>
        </Row>
        {todaySlots.length===0
          ?<p style={{color:c.muted,fontSize:13,textAlign:"center",padding:"16px 0"}}>Bugün ders yok.</p>
          :todaySlots.map(s=><div key={s.id} style={{background:s.room.color+"10",border:`1px solid ${s.room.color}30`,borderRadius:10,padding:"10px 14px",marginBottom:8}}>
            <Row justify="space-between">
              <Row gap={8}>
                <span style={{fontSize:18}}>{s.room.emoji}</span>
                <Col gap={1}>
                  <p style={{fontWeight:700,fontSize:13,color:c.dark}}>{s.room.name}</p>
                  <p style={{fontSize:12,color:c.mid}}>{s.topic}</p>
                </Col>
              </Row>
              <Col gap={1} style={{textAlign:"right"}}>
                <p style={{fontWeight:700,fontSize:13,color:s.room.color}}>{s.time}</p>
                <p style={{fontSize:11,color:c.muted}}>{s.duration} saat</p>
              </Col>
            </Row>
          </div>)}
      </Card>

      {/* Yaklaşan ödevler */}
      <Card>
        <strong style={{fontSize:14,display:"block",marginBottom:12}}>📋 Yaklaşan Ödevler</strong>
        {allHw.length===0
          ?<p style={{color:c.muted,fontSize:13,textAlign:"center",padding:"16px 0"}}>Bekleyen ödev yok 🎉</p>
          :allHw.slice(0,4).map((h,i)=><div key={i} style={{padding:"8px 0",borderBottom:i<allHw.length-1?`1px solid ${c.border}`:"none"}}>
            <p style={{fontSize:12,fontWeight:600,color:c.dark}}>{h.title}</p>
            <p style={{fontSize:11,color:c.muted}}>Son: {fmt(h.due)}</p>
          </div>)}
      </Card>
    </div>

    {/* Odalar */}
    <Row justify="space-between" style={{marginBottom:12}}>
      <strong style={{fontSize:14}}>Odalar</strong>
      <button onClick={goRooms} style={{background:"none",border:"none",cursor:"pointer",color:"#2563eb",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>Tümünü Gör →</button>
    </Row>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10,marginBottom:20}}>
      {myRooms.slice(0,4).map(r=><div key={r.id} onClick={goRooms} style={{...{background:c.white,border:`1px solid ${c.border}`,borderRadius:12,padding:14,cursor:"pointer",position:"relative",overflow:"hidden",transition:"all .15s"}}
} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:r.color}}/>
        <Row gap={9}>
          <div style={{width:34,height:34,borderRadius:9,background:r.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{r.emoji}</div>
          <div><p style={{fontWeight:700,fontSize:13}}>{r.name}</p><p style={{color:c.muted,fontSize:11}}>{r.subject} · {r.members.length} üye</p></div>
        </Row>
      </div>)}
    </div>

    {/* Sabit duyurular */}
    {pinned.length>0&&<>
      <strong style={{fontSize:14,display:"block",marginBottom:10}}>📌 Sabit Duyurular</strong>
      <Col gap={8}>
        {pinned.map(a=><div key={a.id} style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"10px 14px",borderLeft:`3px solid ${a.rColor}`}}>
          <Row gap={8} style={{marginBottom:4}}><span>{a.rEmoji}</span><Tag label={a.rName} color={a.rColor} bg={a.rColor+"15"} sm/></Row>
          <p style={{fontSize:13,lineHeight:1.6,color:c.dark}}>{a.text}</p>
          <p style={{fontSize:10,color:c.muted,marginTop:4}}>{a.date}</p>
        </div>)}
      </Col>
    </>}
  </div>;
}

/* ─── ODA KARTI ─── */
function RoomCard({room,user,onOpen}){
  const teacher=USERS.find(u=>u.id===room.teacherId);
  const sc=room.members.filter(m=>m.role==="student").length;
  const last=[...room.announcements].reverse()[0];
  return <div onClick={onOpen} style={{background:c.white,border:`1px solid ${c.border}`,borderRadius:12,padding:16,cursor:"pointer",position:"relative",overflow:"hidden",transition:"all .18s"}}
    onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.08)";e.currentTarget.style.transform="translateY(-2px)";}}
    onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="translateY(0)";}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:room.color,borderRadius:"12px 12px 0 0"}}/>
    <Row style={{marginBottom:10,marginTop:4}}>
      <div style={{width:40,height:40,borderRadius:10,background:room.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{room.emoji}</div>
      <div style={{flex:1}}>
        <p style={{fontWeight:700,fontSize:14,color:c.dark}}>{room.name}</p>
        <p style={{color:c.muted,fontSize:12}}>{room.subject}{user.role!=="teacher"&&` · ${teacher?.name}`}</p>
      </div>
      <div style={{textAlign:"right"}}>
        <Tag label={`${sc} öğrenci`} color={room.color} bg={room.color+"15"}/>
        <p style={{fontFamily:"monospace",fontSize:10,color:c.muted,marginTop:4}}>{room.code}</p>
      </div>
    </Row>
    {last&&<div style={{background:c.light,borderRadius:8,padding:"6px 10px",fontSize:12,color:c.mid}}>📢 {last.text.slice(0,55)}{last.text.length>55?"…":""}</div>}
    <Row gap={6} style={{marginTop:10,paddingTop:8,borderTop:`1px solid ${c.border}`}}>
      <Tag label={`${room.members.length} üye`} sm/>
      {room.announcements.filter(a=>a.pinned).length>0&&<Tag label={`${room.announcements.filter(a=>a.pinned).length} sabit`} color="#d97706" bg="#fffbeb" sm/>}
      {room.schedule?.length>0&&<Tag label={`${room.schedule.length} ders/hafta`} color="#7c3aed" bg="#f5f3ff" sm/>}
    </Row>
  </div>;
}

/* ─── ÖĞRENCİ PROFİLİ (ÖĞRETMEN GÖRÜNÜMÜ) ─── */
function StuProfile({room,stu,rd,onRd,onBack,teacherId,allRooms,rdMap}){
  const [tab,setTab]=useState("analytics");
  const [aiOpen,setAiOpen]=useState(false);
  const [aiText,setAiText]=useState("");
  const [aiLoad,setAiLoad]=useState(false);
  const [addingGrade,setAddingGrade]=useState(false);
  const [addingLesson,setAddingLesson]=useState(false);
  const [addingHw,setAddingHw]=useState(false);
  const [gradeId,setGradeId]=useState(null);
  const [gradeVal,setGradeVal]=useState("");
  const [gradeFb,setGradeFb]=useState("");
  const [msgTxt,setMsgTxt]=useState("");
  const [gDate,setGDate]=useState(""); const [gTopic,setGTopic]=useState(""); const [gScore,setGScore]=useState("");
  const [lDate,setLDate]=useState(""); const [lTopic,setLTopic]=useState(""); const [lHours,setLHours]=useState(""); const [lAmt,setLAmt]=useState(""); const [lAtt,setLAtt]=useState("yes");
  const [hTitle,setHTitle]=useState(""); const [hDue,setHDue]=useState(""); const [hSub,setHSub]=useState("");

  const scores=rd.grades.map(g=>g.score);
  const last=scores[scores.length-1];
  const paid=rd.lessons.filter(l=>l.paid).reduce((a,l)=>a+l.amount,0);
  const pend=rd.lessons.filter(l=>!l.paid).reduce((a,l)=>a+l.amount,0);
  const pm=room.members.find(m=>m.role==="parent"&&m.forStudent===stu.id);
  const parent=pm?USERS.find(u=>u.id===pm.userId):null;

  function addGrade(){if(!gDate||!gScore)return;onRd({...rd,grades:[...rd.grades,{id:nid(),date:gDate,topic:gTopic,score:Number(gScore)}]});setGDate("");setGTopic("");setGScore("");setAddingGrade(false);}
  function addLesson(){if(!lDate||!lHours)return;const amt=Number(lAmt)||Number(lHours)*400;onRd({...rd,lessons:[{id:nid(),date:lDate,topic:lTopic,hours:Number(lHours),attended:lAtt==="yes",paid:false,amount:amt},...rd.lessons]});setLDate("");setLTopic("");setLHours("");setLAmt("");setAddingLesson(false);}
  function addHw(){if(!hTitle||!hDue)return;onRd({...rd,homework:[...rd.homework,{id:nid(),title:hTitle,due:hDue,subject:hSub,status:"pending",grade:null,feedback:""}]});setHTitle("");setHDue("");setHSub("");setAddingHw(false);}
  function togglePaid(id){onRd({...rd,lessons:rd.lessons.map(l=>l.id===id?{...l,paid:!l.paid}:l)});}
  function doGrade(id){onRd({...rd,homework:rd.homework.map(h=>h.id===id?{...h,grade:Number(gradeVal),feedback:gradeFb,status:"graded"}:h)});setGradeId(null);}
  function sendMsg(){if(!msgTxt.trim()||!parent)return;const m={id:nid(),from:teacherId,to:parent.id,text:msgTxt,date:new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})};onRd({...rd,messages:[...rd.messages,m]});setMsgTxt("");}

  async function loadAI(){
    setAiOpen(true);setAiLoad(true);setAiText("");
    const g=rd.grades.map(x=>`${x.date} ${x.topic} ${x.score}/100`).join(", ")||"Yok";
    const h=rd.homework.map(x=>`${x.title}:${x.status==="graded"?x.grade+"/100":"Bekliyor"}`).join(", ")||"Yok";
    const prompt=`Eğitim koçu olarak kısa Türkçe rapor yaz.\nÖğrenci: ${stu.name} | ${stu.grade} | ${room.subject}\nNotlar: ${g}\nÖdevler: ${h}\nDevamsızlık: ${rd.lessons.filter(l=>!l.attended).length}\nBaşlıklar bold: **📈 Performans** **💪 Güçlü** **⚠️ Dikkat** **🎯 Öneri** **👨‍👩‍👧 Veliye**\nMax 300 kelime.`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:prompt}]})});
      const d=await res.json();setAiText(d.content?.[0]?.text||"Alınamadı.");
    }catch{setAiText("❌ Bağlantı hatası.");}
    setAiLoad(false);
  }

  const TABS=[
    {id:"analytics",lb:"Analitik",ic:"📊"},
    {id:"grades",lb:"Notlar",ic:"📝"},
    {id:"lessons",lb:"Dersler",ic:"📅"},
    {id:"homework",lb:"Ödevler",ic:"📋"},
    {id:"messages",lb:"Mesaj",ic:"💬"},
    {id:"payment",lb:"Ödeme",ic:"💰"},
  ];

  return <div style={{padding:"20px 24px"}}>
    {aiOpen&&<Modal title={`✦ AI Raporu — ${stu.name}`} onClose={()=>setAiOpen(false)} w={580}>
      {aiLoad?<div style={{textAlign:"center",padding:"36px 0"}}><div style={{width:32,height:32,border:`3px solid ${c.border}`,borderTop:"3px solid #2563eb",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 12px"}}/><p style={{color:c.muted,fontSize:13}}>Analiz yapılıyor...</p></div>
        :<div style={{fontSize:13.5,lineHeight:1.9,color:c.mid}}>{aiText.split(/(\*\*.*?\*\*)/).map((p,i)=>p.startsWith("**")&&p.endsWith("**")?<strong key={i} style={{color:c.dark,display:"block",marginTop:12,marginBottom:2}}>{p.slice(2,-2)}</strong>:<span key={i}>{p}</span>)}</div>}
    </Modal>}

    <Row style={{marginBottom:16}}>
      <Btn outline sm onClick={onBack}>← Geri</Btn>
      <Av name={stu.name} role="student" sz={40}/>
      <div style={{flex:1}}>
        <h3 style={{fontSize:17,fontWeight:700,color:c.dark}}>{stu.name}</h3>
        <Tag label={stu.grade} color="#7c3aed" bg="#f5f3ff"/>
      </div>
      <Btn color={room.color} onClick={loadAI}>✦ AI Raporu</Btn>
    </Row>

    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
      {[{l:"Son Not",v:last||"—",c:last?scC(last):c.muted},{l:"Dersler",v:rd.lessons.length,c:"#0891b2"},{l:"Tahsil",v:`₺${paid.toLocaleString()}`,c:"#16a34a"},{l:"Bekleyen",v:`₺${pend.toLocaleString()}`,c:pend>0?"#d97706":"#16a34a"}].map(x=><Card key={x.l} style={{padding:"11px 13px"}}>
        <p style={{color:c.muted,fontSize:10,textTransform:"uppercase",letterSpacing:.7,marginBottom:2}}>{x.l}</p>
        <p style={{color:x.c,fontSize:19,fontWeight:700}}>{x.v}</p>
      </Card>)}
    </div>

    <TabBar tabs={TABS} active={tab} onSelect={setTab} color={room.color}/>
    <div style={{marginTop:14}}>

      {tab==="analytics"&&<StudentAnalytics stu={stu} allRooms={allRooms} rdMap={rdMap}/>}

      {tab==="grades"&&<div>
        <Row justify="flex-end" style={{marginBottom:10}}>
          <Btn sm color={room.color} onClick={()=>setAddingGrade(!addingGrade)}>{addingGrade?"İptal":"+ Not Ekle"}</Btn>
        </Row>
        {addingGrade&&<Card style={{marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div><Label>Tarih (YYYY-MM-DD)</Label><input style={inp} value={gDate} onChange={e=>setGDate(e.target.value)} placeholder="2026-03-18"/></div>
            <div><Label>Puan</Label><input style={inp} type="number" value={gScore} onChange={e=>setGScore(e.target.value)} placeholder="75"/></div>
            <div><Label>Konu</Label><input style={inp} value={gTopic} onChange={e=>setGTopic(e.target.value)} placeholder="Türev"/></div>
          </div>
          <Btn color={room.color} onClick={addGrade}>Kaydet</Btn>
        </Card>}
        {[...rd.grades].reverse().map(g=><Row key={g.id} style={{padding:"11px 14px",background:c.white,border:`1px solid ${c.border}`,borderRadius:12,marginBottom:7}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:scB(g.score),border:`2px solid ${scC(g.score)}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color:scC(g.score),fontWeight:800,fontSize:14}}>{g.score}</span>
          </div>
          <div style={{flex:1}}><p style={{fontWeight:700,fontSize:13}}>{g.topic}</p><p style={{color:c.muted,fontSize:11}}>{fmt(g.date)}</p></div>
          <Tag label={scL(g.score)} color={scC(g.score)} bg={scB(g.score)}/>
        </Row>)}
      </div>}

      {tab==="lessons"&&<div>
        <Row justify="flex-end" style={{marginBottom:10}}>
          <Btn sm color={room.color} onClick={()=>setAddingLesson(!addingLesson)}>{addingLesson?"İptal":"+ Ders Ekle"}</Btn>
        </Row>
        {addingLesson&&<Card style={{marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div><Label>Tarih</Label><input style={inp} value={lDate} onChange={e=>setLDate(e.target.value)} placeholder="2026-03-18"/></div>
            <div><Label>Süre (saat)</Label><input style={inp} type="number" value={lHours} onChange={e=>setLHours(e.target.value)} placeholder="2"/></div>
            <div><Label>Konu</Label><input style={inp} value={lTopic} onChange={e=>setLTopic(e.target.value)} placeholder="İntegral"/></div>
            <div><Label>Tutar ₺</Label><input style={inp} type="number" value={lAmt} onChange={e=>setLAmt(e.target.value)} placeholder="800"/></div>
            <div><Label>Katılım</Label><select style={inp} value={lAtt} onChange={e=>setLAtt(e.target.value)}><option value="yes">Katıldı</option><option value="no">Katılmadı</option></select></div>
          </div>
          <Btn color={room.color} onClick={addLesson}>Kaydet</Btn>
        </Card>}
        {rd.lessons.map(l=><Row key={l.id} style={{padding:"11px 14px",background:c.white,border:`1px solid ${l.attended?c.border:"#fecaca"}`,borderRadius:12,marginBottom:7}}>
          <span style={{fontSize:16}}>{l.attended?"✅":"❌"}</span>
          <div style={{flex:1}}><p style={{fontWeight:700,fontSize:13}}>{l.topic}</p><p style={{color:c.muted,fontSize:11}}>{fmt(l.date)} · {l.hours} saat</p></div>
          <p style={{fontWeight:700}}>₺{l.amount}</p>
          <button onClick={()=>togglePaid(l.id)} style={{padding:"3px 10px",borderRadius:99,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit",background:l.paid?"#f0fdf4":"#fffbeb",color:l.paid?"#16a34a":"#d97706"}}>{l.paid?"✓ Ödendi":"Bekliyor"}</button>
        </Row>)}
      </div>}

      {tab==="homework"&&<div>
        <Row justify="flex-end" style={{marginBottom:10}}>
          <Btn sm color={room.color} onClick={()=>setAddingHw(!addingHw)}>{addingHw?"İptal":"+ Ödev Ver"}</Btn>
        </Row>
        {addingHw&&<Card style={{marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div><Label>Başlık</Label><input style={inp} value={hTitle} onChange={e=>setHTitle(e.target.value)} placeholder="Türev Alıştırmaları"/></div>
            <div><Label>Son Teslim (YYYY-MM-DD)</Label><input style={inp} value={hDue} onChange={e=>setHDue(e.target.value)} placeholder="2026-03-25"/></div>
            <div><Label>Ders</Label><input style={inp} value={hSub} onChange={e=>setHSub(e.target.value)} placeholder="Matematik"/></div>
          </div>
          <Btn color={room.color} onClick={addHw}>Kaydet</Btn>
        </Card>}
        {rd.homework.map(h=><div key={h.id} style={{background:c.white,border:`1px solid ${c.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8}}>
          <Row justify="space-between" align="flex-start">
            <div>
              <p style={{fontWeight:700,fontSize:13}}>{h.title}</p>
              <p style={{color:c.muted,fontSize:11}}>{h.subject} · Son: {fmt(h.due)}</p>
              {h.feedback&&<p style={{color:"#16a34a",fontSize:12,marginTop:3,fontStyle:"italic"}}>"{h.feedback}"</p>}
            </div>
            <Col align="flex-end" gap={6}>
              <Tag label={h.status==="graded"?`${h.grade}/100`:h.status==="submitted"?"Teslim":"Bekliyor"} color={h.status==="graded"?"#16a34a":h.status==="submitted"?"#2563eb":"#d97706"} bg={h.status==="graded"?"#f0fdf4":h.status==="submitted"?"#eff6ff":"#fffbeb"}/>
              {h.status==="submitted"&&gradeId!==h.id&&<Btn sm color={room.color} onClick={()=>{setGradeId(h.id);setGradeVal("");setGradeFb("");}}>Notlandır</Btn>}
            </Col>
          </Row>
          {gradeId===h.id&&<Row style={{marginTop:10,padding:10,background:c.light,borderRadius:9}} gap={8}>
            <div style={{width:80}}><Label>Not</Label><input style={inp} type="number" value={gradeVal} onChange={e=>setGradeVal(e.target.value)} placeholder="85"/></div>
            <div style={{flex:1}}><Label>Geri Bildirim</Label><input style={inp} value={gradeFb} onChange={e=>setGradeFb(e.target.value)} placeholder="Harika!"/></div>
            <div style={{marginTop:16}}><Btn color={room.color} onClick={()=>doGrade(h.id)}>Kaydet</Btn></div>
          </Row>}
        </div>)}
      </div>}

      {tab==="messages"&&<Card>
        <p style={{fontWeight:700,fontSize:13,marginBottom:4}}>Veli ile Mesajlaşma</p>
        {parent?<p style={{color:c.muted,fontSize:12,marginBottom:12}}>Veli: {parent.name}</p>:<p style={{color:"#d97706",fontSize:12,marginBottom:12}}>Bu odada kayıtlı veli yok.</p>}
        <div style={{maxHeight:260,overflowY:"auto",marginBottom:10,display:"flex",flexDirection:"column",gap:8}}>
          {rd.messages.length===0&&<p style={{color:c.muted,fontSize:13,textAlign:"center",paddingTop:20}}>Henüz mesaj yok.</p>}
          {rd.messages.map(m=>{const mine=m.from===teacherId;const sender=USERS.find(u=>u.id===m.from);return <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:mine?"flex-end":"flex-start"}}>
            <p style={{fontSize:10,color:c.muted,marginBottom:2}}>{sender?.name} · {m.date}</p>
            <div style={{maxWidth:"68%",padding:"8px 12px",borderRadius:mine?"12px 12px 4px 12px":"12px 12px 12px 4px",background:mine?rC(sender?.role||"teacher")+"15":c.light,color:mine?rC(sender?.role||"teacher"):c.dark,fontSize:13}}>{m.text}</div>
          </div>;})}
        </div>
        <Row>
          <input style={{...inp,flex:1}} value={msgTxt} onChange={e=>setMsgTxt(e.target.value)} placeholder="Mesaj yaz..." onKeyDown={e=>e.key==="Enter"&&sendMsg()}/>
          <Btn sm onClick={sendMsg} disabled={!msgTxt.trim()||!parent}>Gönder</Btn>
        </Row>
      </Card>}

      {tab==="payment"&&<div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
          {[{l:"Toplam",v:rd.lessons.reduce((a,l)=>a+l.amount,0),clr:"#d97706"},{l:"Tahsil",v:paid,clr:"#16a34a"},{l:"Bekleyen",v:pend,clr:pend>0?"#d97706":"#16a34a"}].map(x=><Card key={x.l} style={{padding:"12px 14px"}}>
            <p style={{color:c.muted,fontSize:10,textTransform:"uppercase",letterSpacing:.7}}>{x.l}</p>
            <p style={{color:x.clr,fontSize:20,fontWeight:700}}>₺{x.v.toLocaleString()}</p>
          </Card>)}
        </div>
        {rd.lessons.map(l=><Row key={l.id} style={{padding:"11px 14px",background:c.white,border:`1px solid ${c.border}`,borderRadius:12,marginBottom:7}}>
          <div style={{flex:1}}><p style={{fontWeight:600,fontSize:13}}>{l.topic}</p><p style={{color:c.muted,fontSize:11}}>{fmt(l.date)} · {l.hours} saat</p></div>
          <p style={{fontWeight:700}}>₺{l.amount}</p>
          <button onClick={()=>togglePaid(l.id)} style={{padding:"3px 10px",borderRadius:99,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit",background:l.paid?"#f0fdf4":"#fffbeb",color:l.paid?"#16a34a":"#d97706"}}>{l.paid?"✓ Ödendi":"Bekliyor"}</button>
        </Row>)}
      </div>}
    </div>
  </div>;
}

/* ─── ODA — ÖĞRETMEN ─── */
function RoomTeacher({room,rdMap,onBack,onUpdateRoom,onUpdateRd,allRooms}){
  const [tab,setTab]=useState("ann");
  const [selStu,setSelStu]=useState(null);
  const [invOpen,setInvOpen]=useState(false);
  const [addOpen,setAddOpen]=useState(false);
  const [srch,setSrch]=useState("");
  const [annTxt,setAnnTxt]=useState("");
  const [annPin,setAnnPin]=useState(false);
  const [copied,setCopied]=useState(false);
  // Schedule form
  const [addSched,setAddSched]=useState(false);
  const [scDay,setScDay]=useState("Pazartesi");
  const [scTime,setScTime]=useState("15:00");
  const [scDur,setScDur]=useState("2");
  const [scTopic,setScTopic]=useState("");

  const students=room.members.filter(m=>m.role==="student").map(m=>USERS.find(u=>u.id===m.userId)).filter(Boolean);
  const parents=room.members.filter(m=>m.role==="parent").map(m=>{const u=USERS.find(x=>x.id===m.userId);return u?{...u,forStudent:m.forStudent}:null;}).filter(Boolean);
  const getRd=sid=>rdMap[`${room.id}-${sid}`]||{grades:[],lessons:[],homework:[],messages:[]};

  function postAnn(){if(!annTxt.trim())return;onUpdateRoom({...room,announcements:[...room.announcements,{id:nid(),text:annTxt,date:new Date().toLocaleDateString("tr-TR",{day:"2-digit",month:"short"}),pinned:annPin}]});setAnnTxt("");setAnnPin(false);}
  function addMember(u){if(room.members.find(m=>m.userId===u.id))return;const m={userId:u.id,role:u.role,forStudent:null};if(u.role==="parent"&&u.childIds){const ch=room.members.find(x=>x.role==="student"&&u.childIds.includes(x.userId));m.forStudent=ch?.userId||null;}onUpdateRoom({...room,members:[...room.members,m]});setAddOpen(false);setSrch("");}
  function removeMember(uid){onUpdateRoom({...room,members:room.members.filter(m=>m.userId!==uid)});}
  function addSchedule(){if(!scTopic)return;const newSlot={id:nid(),day:scDay,time:scTime,duration:Number(scDur),topic:scTopic,studentIds:students.map(s=>s.id)};onUpdateRoom({...room,schedule:[...(room.schedule||[]),newSlot]});setAddSched(false);setScTopic("");}
  function removeSchedule(id){onUpdateRoom({...room,schedule:(room.schedule||[]).filter(s=>s.id!==id)});}

  if(selStu){
    const stu=students.find(x=>x.id===selStu);
    if(!stu){setSelStu(null);return null;}
    return <StuProfile room={room} stu={stu} rd={getRd(selStu)} onRd={d=>onUpdateRd(`${room.id}-${selStu}`,d)} onBack={()=>setSelStu(null)} teacherId={room.teacherId} allRooms={allRooms} rdMap={rdMap}/>;
  }

  const TABS=[{id:"ann",lb:"Duyurular",ic:"📢"},{id:"schedule",lb:"Program",ic:"📅"},{id:"stu",lb:"Öğrenciler",ic:"👨‍🎓"},{id:"hw",lb:"Ödev Takvimi",ic:"📋"},{id:"mbr",lb:"Üyeler",ic:"👥"}];
  const allHw=students.flatMap(s=>getRd(s.id).homework||[]);

  return <div style={{padding:"20px 24px"}}>
    {invOpen&&<Modal title="Davet Kodu" onClose={()=>setInvOpen(false)} w={360}>
      <p style={{color:c.muted,textAlign:"center",marginBottom:14,fontSize:13}}>Bu kodu paylaşarak odaya davet edin.</p>
      <div style={{background:c.light,border:`2px dashed ${c.border}`,borderRadius:12,padding:"18px 0",textAlign:"center",marginBottom:14}}>
        <p style={{fontFamily:"monospace",fontSize:36,fontWeight:800,letterSpacing:10,color:room.color}}>{room.code}</p>
      </div>
      <Btn full color={room.color} onClick={()=>{navigator.clipboard.writeText(room.code).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2000);}}>{copied?"✓ Kopyalandı!":"Kodu Kopyala"}</Btn>
    </Modal>}
    {addOpen&&<Modal title="Üye Ekle" onClose={()=>setAddOpen(false)}>
      <div style={{marginBottom:12}}><Label>Ara</Label><input style={inp} value={srch} onChange={e=>setSrch(e.target.value)} placeholder="İsim veya e-posta..."/></div>
      <div style={{display:"flex",flexDirection:"column",gap:7,maxHeight:260,overflowY:"auto"}}>
        {USERS.filter(u=>u.id!==room.teacherId&&!room.members.find(m=>m.userId===u.id)&&(u.name.toLowerCase().includes(srch.toLowerCase())||u.email.toLowerCase().includes(srch.toLowerCase()))).map(u=><Row key={u.id} style={{padding:"9px 12px",background:c.light,borderRadius:10,border:`1px solid ${c.border}`}}>
          <Av name={u.name} role={u.role} sz={32}/>
          <div style={{flex:1}}><p style={{fontWeight:700,fontSize:13}}>{u.name}</p><p style={{color:c.muted,fontSize:11}}>{u.email}</p></div>
          <Tag label={rN(u.role)} color={rC(u.role)} bg={rB(u.role)}/>
          <Btn sm color={room.color} onClick={()=>addMember(u)}>Ekle</Btn>
        </Row>)}
      </div>
    </Modal>}

    <Row style={{marginBottom:18}}>
      <Btn outline sm onClick={onBack}>← Odalar</Btn>
      <div style={{width:40,height:40,borderRadius:10,background:room.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{room.emoji}</div>
      <div style={{flex:1}}>
        <h2 style={{fontSize:18,fontWeight:700,marginBottom:2,color:c.dark}}>{room.name}</h2>
        <Row gap={6}><Tag label={room.subject} color={room.color} bg={room.color+"15"}/><Tag label={`${room.members.length} üye`}/><Tag label={room.code}/></Row>
      </div>
      <Btn outline color={room.color} sm onClick={()=>setInvOpen(true)}>🔗 Davet</Btn>
      <Btn color={room.color} sm onClick={()=>setAddOpen(true)}>+ Üye Ekle</Btn>
    </Row>

    <TabBar tabs={TABS} active={tab} onSelect={setTab} color={room.color}/>
    <div style={{marginTop:14}}>

      {tab==="ann"&&<div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:16}}>
        <div>
          {room.announcements.filter(a=>a.pinned).length>0&&<>
            <p style={{fontSize:11,fontWeight:700,color:"#d97706",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>📌 Sabitlenmiş</p>
            {room.announcements.filter(a=>a.pinned).map(a=><div key={a.id} style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"11px 13px",marginBottom:7,borderLeft:"3px solid #f59e0b"}}>
              <Row justify="space-between"><p style={{fontSize:13,lineHeight:1.6,flex:1}}>{a.text}</p>
                <Row gap={4} style={{flexShrink:0,marginLeft:8}}>
                  <button onClick={()=>onUpdateRoom({...room,announcements:room.announcements.map(x=>x.id===a.id?{...x,pinned:!x.pinned}:x)})} style={{background:"none",border:"none",cursor:"pointer",fontSize:12}}>📍</button>
                  <button onClick={()=>onUpdateRoom({...room,announcements:room.announcements.filter(x=>x.id!==a.id)})} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#dc2626"}}>🗑</button>
                </Row>
              </Row>
              <p style={{fontSize:10,color:c.muted,marginTop:4}}>{a.date}</p>
            </div>)}
          </>}
          <p style={{fontSize:11,fontWeight:700,color:c.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8,marginTop:8}}>Tüm Duyurular</p>
          {[...room.announcements].reverse().map(a=><div key={a.id} style={{background:c.white,border:`1px solid ${c.border}`,borderRadius:10,padding:"11px 13px",marginBottom:7}}>
            <Row justify="space-between"><p style={{fontSize:13,lineHeight:1.6,flex:1}}>{a.text}</p>
              <Row gap={4} style={{flexShrink:0,marginLeft:8}}>
                <button onClick={()=>onUpdateRoom({...room,announcements:room.announcements.map(x=>x.id===a.id?{...x,pinned:!x.pinned}:x)})} style={{background:"none",border:"none",cursor:"pointer",fontSize:11}}>{a.pinned?"📍":"📌"}</button>
                <button onClick={()=>onUpdateRoom({...room,announcements:room.announcements.filter(x=>x.id!==a.id)})} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:"#dc2626"}}>🗑</button>
              </Row>
            </Row>
            <p style={{fontSize:10,color:c.muted,marginTop:4}}>{a.date}</p>
          </div>)}
        </div>
        <Card>
          <p style={{fontWeight:700,fontSize:13,marginBottom:12}}>📢 Yeni Duyuru</p>
          <textarea value={annTxt} onChange={e=>setAnnTxt(e.target.value)} rows={5} placeholder="Duyuru..." style={{...inp,resize:"vertical",marginBottom:10}}/>
          <Row gap={8} style={{marginBottom:12}}>
            <input type="checkbox" id="pin" checked={annPin} onChange={e=>setAnnPin(e.target.checked)}/>
            <label htmlFor="pin" style={{fontSize:13,cursor:"pointer",color:c.mid}}>Sabitle</label>
          </Row>
          <Btn full color={room.color} onClick={postAnn} disabled={!annTxt.trim()}>Paylaş</Btn>
        </Card>
      </div>}

      {tab==="schedule"&&<div>
        <Row justify="flex-end" style={{marginBottom:12}}>
          <Btn sm color={room.color} onClick={()=>setAddSched(!addSched)}>{addSched?"İptal":"+ Ders Ekle"}</Btn>
        </Row>
        {addSched&&<Card style={{marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div><Label>Gün</Label><select style={inp} value={scDay} onChange={e=>setScDay(e.target.value)}>{DAYS.map(d=><option key={d}>{d}</option>)}</select></div>
            <div><Label>Saat</Label><input style={inp} value={scTime} onChange={e=>setScTime(e.target.value)} placeholder="15:00"/></div>
            <div><Label>Süre (saat)</Label><input style={inp} type="number" value={scDur} onChange={e=>setScDur(e.target.value)} placeholder="2"/></div>
            <div><Label>Konu</Label><input style={inp} value={scTopic} onChange={e=>setScTopic(e.target.value)} placeholder="Türev & İntegral"/></div>
          </div>
          <Btn color={room.color} onClick={addSchedule}>Kaydet</Btn>
        </Card>}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {(room.schedule||[]).map(s=><Row key={s.id} style={{padding:"12px 16px",background:c.white,border:`1px solid ${c.border}`,borderRadius:12}}>
            <div style={{width:36,height:36,borderRadius:9,background:room.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:room.color,flexShrink:0}}>{s.day.slice(0,3)}</div>
            <div style={{flex:1}}>
              <p style={{fontWeight:700,fontSize:13,color:c.dark}}>{s.topic}</p>
              <Row gap={8} style={{marginTop:2}}>
                <Tag label={s.day} color={room.color} bg={room.color+"12"} sm/>
                <Tag label={s.time} sm/>
                <Tag label={`${s.duration} saat`} sm/>
                <Tag label={`${s.studentIds?.length||0} öğrenci`} color="#7c3aed" bg="#f5f3ff" sm/>
              </Row>
            </div>
            <button onClick={()=>removeSchedule(s.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#dc2626",fontSize:16}}>🗑</button>
          </Row>)}
          {(room.schedule||[]).length===0&&<p style={{color:c.muted,fontSize:13,textAlign:"center",padding:"24px 0"}}>Henüz ders programı eklenmedi.</p>}
        </div>
      </div>}

      {tab==="stu"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {students.map(stu=>{
          const rd=getRd(stu.id);
          const sc=rd.grades.map(g=>g.score);
          const last=sc[sc.length-1];
          const pend=rd.lessons.filter(l=>!l.paid).reduce((a,l)=>a+l.amount,0);
          return <div key={stu.id} onClick={()=>setSelStu(stu.id)} style={{background:c.white,border:`1px solid ${c.border}`,borderRadius:12,padding:16,cursor:"pointer",transition:"all .18s"}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,.07)";e.currentTarget.style.transform="translateY(-1px)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="translateY(0)";}}>
            <Row style={{marginBottom:10}}>
              <Av name={stu.name} role="student" sz={36}/>
              <div style={{flex:1}}><p style={{fontWeight:700,fontSize:14}}>{stu.name}</p><p style={{color:c.muted,fontSize:11}}>{stu.grade}</p></div>
              {last&&<p style={{color:scC(last),fontWeight:800,fontSize:22}}>{last}</p>}
            </Row>
            <Sparkline scores={sc} color={last?scC(last):c.border}/>
            <Row justify="space-between" style={{marginTop:10,paddingTop:8,borderTop:`1px solid ${c.border}`}}>
              <span style={{fontSize:11,color:c.muted}}>{rd.lessons.length} ders</span>
              {pend>0&&<span style={{fontSize:11,color:"#d97706",fontWeight:600}}>₺{pend} bekliyor</span>}
            </Row>
          </div>;
        })}
      </div>}

      {tab==="hw"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <strong style={{fontSize:14,display:"block",marginBottom:14}}>Ödev Takvimi</strong>
          <HomeworkCalendar allHomework={allHw}/>
        </Card>
        <Card>
          <strong style={{fontSize:14,display:"block",marginBottom:14}}>Ödev Listesi</strong>
          <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:420,overflowY:"auto"}}>
            {allHw.length===0&&<p style={{color:c.muted,fontSize:13,textAlign:"center",padding:"20px 0"}}>Henüz ödev yok.</p>}
            {[...allHw].sort((a,b)=>a.due.localeCompare(b.due)).map(h=>{
              const stuForHw=students.find(s=>getRd(s.id).homework.find(x=>x.id===h.id));
              return <div key={h.id} style={{background:h.status==="graded"?"#f0fdf4":h.status==="pending"?"#fffbeb":c.light,borderRadius:10,padding:"10px 12px",border:`1px solid ${h.status==="graded"?"#bbf7d0":h.status==="pending"?"#fde68a":c.border}`}}>
                <Row justify="space-between">
                  <div>
                    <p style={{fontWeight:700,fontSize:12,color:c.dark}}>{h.title}</p>
                    <Row gap={6} style={{marginTop:3}}>
                      <Tag label={stuForHw?.name||"?"} sm/>
                      <Tag label={fmt(h.due)} sm color={h.status==="pending"?"#d97706":c.mid}/>
                    </Row>
                  </div>
                  <Tag label={h.status==="graded"?`${h.grade}/100`:h.status==="submitted"?"Teslim":"Bekliyor"} color={h.status==="graded"?"#16a34a":h.status==="submitted"?"#2563eb":"#d97706"} bg={h.status==="graded"?"#f0fdf4":h.status==="submitted"?"#eff6ff":"#fffbeb"} sm/>
                </Row>
              </div>;
            })}
          </div>
        </Card>
      </div>}

      {tab==="mbr"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card>
          <p style={{fontWeight:700,fontSize:13,marginBottom:12}}>Öğrenciler ({students.length})</p>
          {students.map(stu=><Row key={stu.id} style={{padding:"8px 0",borderBottom:`1px solid ${c.border}`}}>
            <Av name={stu.name} role="student" sz={30}/>
            <div style={{flex:1}}><p style={{fontWeight:600,fontSize:13}}>{stu.name}</p><p style={{color:c.muted,fontSize:11}}>{stu.grade}</p></div>
            <Btn danger sm onClick={()=>removeMember(stu.id)}>Çıkar</Btn>
          </Row>)}
        </Card>
        <Card>
          <p style={{fontWeight:700,fontSize:13,marginBottom:12}}>Veliler ({parents.length})</p>
          {parents.map(p=>{const ch=USERS.find(u=>u.id===p.forStudent);return <Row key={p.id} style={{padding:"8px 0",borderBottom:`1px solid ${c.border}`}}>
            <Av name={p.name} role="parent" sz={30}/>
            <div style={{flex:1}}><p style={{fontWeight:600,fontSize:13}}>{p.name}</p><p style={{color:c.muted,fontSize:11}}>Çocuğu: {ch?.name||"—"}</p></div>
            <Btn danger sm onClick={()=>removeMember(p.id)}>Çıkar</Btn>
          </Row>;})}
        </Card>
      </div>}
    </div>
  </div>;
}

/* ─── ODA — VELİ/ÖĞRENCİ ─── */
function RoomUser({room,user,rdMap,onBack,onUpdateRd}){
  const [tab,setTab]=useState("ann");
  const [msgTxt,setMsgTxt]=useState("");
  const childId=user.role==="parent"?(user.childIds||[]).find(cid=>room.members.find(m=>m.userId===cid)):user.id;
  const child=USERS.find(u=>u.id===childId);
  const teacher=USERS.find(u=>u.id===room.teacherId);
  const key=`${room.id}-${childId}`;
  const rd=rdMap[key]||{grades:[],lessons:[],homework:[],messages:[]};
  const scores=rd.grades.map(g=>g.score);
  const last=scores[scores.length-1];
  const pendHw=rd.homework.filter(h=>h.status==="pending").length;

  function sendMsg(){if(!msgTxt.trim())return;const m={id:nid(),from:user.id,to:room.teacherId,text:msgTxt,date:new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})};onUpdateRd(key,{...rd,messages:[...rd.messages,m]});setMsgTxt("");}

  const TABS_P=[{id:"ann",lb:"Duyurular",ic:"📢"},{id:"schedule",lb:"Program",ic:"📅"},{id:"grades",lb:"Notlar",ic:"📝"},{id:"hw",lb:"Ödevler",ic:"📋",badge:pendHw},{id:"msg",lb:"Mesajlar",ic:"💬"},{id:"pay",lb:"Ödemeler",ic:"💰"}];
  const TABS_S=[{id:"ann",lb:"Duyurular",ic:"📢"},{id:"schedule",lb:"Program",ic:"📅"},{id:"grades",lb:"Notlarım",ic:"📝"},{id:"hw",lb:"Ödevlerim",ic:"📋",badge:pendHw}];
  const TABS=user.role==="parent"?TABS_P:TABS_S;

  return <div style={{padding:"20px 24px"}}>
    <Row style={{marginBottom:18}}>
      <Btn outline sm onClick={onBack}>← Odalar</Btn>
      <div style={{width:40,height:40,borderRadius:10,background:room.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{room.emoji}</div>
      <div style={{flex:1}}>
        <h2 style={{fontSize:18,fontWeight:700,marginBottom:2,color:c.dark}}>{room.name}</h2>
        <Row gap={6}>
          <Tag label={room.subject} color={room.color} bg={room.color+"15"}/>
          <Tag label={`Öğretmen: ${teacher?.name}`}/>
          {user.role==="parent"&&child&&<Tag label={`Çocuğunuz: ${child.name}`} color="#d97706" bg="#fffbeb"/>}
        </Row>
      </div>
      {last&&<div style={{textAlign:"center",background:scB(last),borderRadius:10,padding:"6px 14px"}}>
        <p style={{color:scC(last),fontWeight:800,fontSize:22,lineHeight:1}}>{last}</p>
        <p style={{color:c.muted,fontSize:10}}>son not</p>
      </div>}
    </Row>
    <TabBar tabs={TABS} active={tab} onSelect={setTab} color={room.color}/>
    <div style={{marginTop:14}}>

      {tab==="ann"&&<Col gap={8}>
        {room.announcements.filter(a=>a.pinned).map(a=><div key={a.id} style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"11px 14px",borderLeft:`3px solid ${room.color}`}}>
          <Row gap={8}><span>📌</span><div><p style={{fontSize:13,lineHeight:1.6}}>{a.text}</p><p style={{color:c.muted,fontSize:10,marginTop:4}}>{a.date}</p></div></div>
        </div>)}
        {[...room.announcements].filter(a=>!a.pinned).reverse().map(a=><Card key={a.id}>
          <p style={{fontSize:13,lineHeight:1.6}}>{a.text}</p><p style={{color:c.muted,fontSize:10,marginTop:4}}>{a.date}</p>
        </Card>)}
      </Col>}

      {tab==="schedule"&&<Card>
        <strong style={{fontSize:14,display:"block",marginBottom:14}}>Haftalık Ders Programı</strong>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {(room.schedule||[]).map(s=><Row key={s.id} style={{padding:"12px 14px",background:room.color+"08",border:`1px solid ${room.color}25`,borderRadius:10}}>
            <div style={{width:32,height:32,borderRadius:8,background:room.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:room.color}}>{s.day.slice(0,3)}</div>
            <div style={{flex:1}}>
              <p style={{fontWeight:700,fontSize:13}}>{s.topic}</p>
              <Row gap={8} style={{marginTop:2}}><Tag label={s.day} sm color={room.color} bg={room.color+"12"}/><Tag label={s.time} sm/><Tag label={`${s.duration} saat`} sm/></Row>
            </div>
          </Row>)}
          {(room.schedule||[]).length===0&&<p style={{color:c.muted,fontSize:13,textAlign:"center",padding:"20px 0"}}>Program henüz eklenmedi.</p>}
        </div>
      </Card>}

      {tab==="grades"&&<div>
        {scores.length>=2&&<Card style={{marginBottom:14}}>
          <p style={{fontWeight:700,fontSize:13,marginBottom:12}}>Gelişim</p>
          <LineChart grades={rd.grades} color={room.color}/>
        </Card>}
        {[...rd.grades].reverse().map(g=><Row key={g.id} style={{padding:"11px 14px",background:c.white,border:`1px solid ${c.border}`,borderRadius:12,marginBottom:7}}>
          <div style={{width:42,height:42,borderRadius:"50%",background:scB(g.score),border:`2px solid ${scC(g.score)}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color:scC(g.score),fontWeight:800,fontSize:14}}>{g.score}</span>
          </div>
          <div style={{flex:1}}><p style={{fontWeight:700,fontSize:13}}>{g.topic}</p><p style={{color:c.muted,fontSize:11}}>{fmt(g.date)}</p></div>
          <Tag label={scL(g.score)} color={scC(g.score)} bg={scB(g.score)}/>
        </Row>)}
      </div>}

      {tab==="hw"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card>
          <strong style={{fontSize:13,display:"block",marginBottom:12}}>Takvim</strong>
          <HomeworkCalendar allHomework={rd.homework}/>
        </Card>
        <Col gap={8}>
          {rd.homework.map(h=><div key={h.id} style={{background:c.white,border:`1px solid ${h.status==="pending"?"#fde68a":c.border}`,borderRadius:10,padding:"12px 14px"}}>
            <Row justify="space-between" align="flex-start">
              <div>
                <p style={{fontWeight:700,fontSize:13}}>{h.title}</p>
                <p style={{color:c.muted,fontSize:11}}>{h.subject} · Son: {fmt(h.due)}</p>
                {h.feedback&&<div style={{marginTop:6,padding:"5px 9px",background:"#f0fdf4",borderRadius:7,fontSize:12,color:"#16a34a"}}>💬 "{h.feedback}"</div>}
              </div>
              <Tag label={h.status==="graded"?`${h.grade}/100`:h.status==="submitted"?"Teslim":"Bekliyor"} color={h.status==="graded"?"#16a34a":h.status==="submitted"?"#2563eb":"#d97706"} bg={h.status==="graded"?"#f0fdf4":h.status==="submitted"?"#eff6ff":"#fffbeb"}/>
            </Row>
          </div>)}
        </Col>
      </div>}

      {tab==="msg"&&user.role==="parent"&&<Card>
        <Row style={{marginBottom:14,paddingBottom:12,borderBottom:`1px solid ${c.border}`}}>
          <Av name={teacher?.name} role="teacher" sz={32}/>
          <div><p style={{fontWeight:700,fontSize:13}}>{teacher?.name}</p><p style={{color:c.muted,fontSize:11}}>{room.subject}</p></div>
        </Row>
        <div style={{maxHeight:260,overflowY:"auto",marginBottom:10,display:"flex",flexDirection:"column",gap:8}}>
          {rd.messages.length===0&&<p style={{color:c.muted,fontSize:13,textAlign:"center",paddingTop:20}}>Henüz mesaj yok.</p>}
          {rd.messages.map(m=>{const mine=m.from===user.id;const sender=USERS.find(u=>u.id===m.from);return <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:mine?"flex-end":"flex-start"}}>
            <p style={{fontSize:10,color:c.muted,marginBottom:2}}>{sender?.name} · {m.date}</p>
            <div style={{maxWidth:"68%",padding:"8px 12px",borderRadius:mine?"12px 12px 4px 12px":"12px 12px 12px 4px",background:mine?"#eff6ff":"#f1f5f9",color:mine?"#2563eb":c.dark,fontSize:13}}>{m.text}</div>
          </div>;})}
        </div>
        <Row>
          <input style={{...inp,flex:1}} value={msgTxt} onChange={e=>setMsgTxt(e.target.value)} placeholder={`${teacher?.name}'a mesaj yaz...`} onKeyDown={e=>e.key==="Enter"&&sendMsg()}/>
          <Btn sm onClick={sendMsg} disabled={!msgTxt.trim()}>Gönder</Btn>
        </Row>
      </Card>}

      {tab==="pay"&&user.role==="parent"&&<div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
          {[{l:"Toplam",v:rd.lessons.reduce((a,l)=>a+l.amount,0),clr:"#d97706"},{l:"Ödendi",v:rd.lessons.filter(l=>l.paid).reduce((a,l)=>a+l.amount,0),clr:"#16a34a"},{l:"Bekliyor",v:rd.lessons.filter(l=>!l.paid).reduce((a,l)=>a+l.amount,0),clr:"#dc2626"}].map(x=><Card key={x.l} style={{padding:"12px 14px"}}>
            <p style={{color:c.muted,fontSize:10,textTransform:"uppercase",letterSpacing:.7}}>{x.l}</p>
            <p style={{color:x.clr,fontSize:20,fontWeight:700}}>₺{x.v.toLocaleString()}</p>
          </Card>)}
        </div>
        {rd.lessons.map(l=><Row key={l.id} style={{padding:"11px 14px",background:c.white,border:`1px solid ${c.border}`,borderRadius:12,marginBottom:7}}>
          <div style={{flex:1}}><p style={{fontWeight:600,fontSize:13}}>{l.topic}</p><p style={{color:c.muted,fontSize:11}}>{fmt(l.date)} · {l.hours} saat</p></div>
          <p style={{fontWeight:700}}>₺{l.amount}</p>
          <Tag label={l.paid?"Ödendi":"Bekliyor"} color={l.paid?"#16a34a":"#d97706"} bg={l.paid?"#f0fdf4":"#fffbeb"}/>
        </Row>)}
      </div>}
    </div>
  </div>;
}

/* ─── ODALAR SAYFASI ─── */
function Rooms({user,rooms,rdMap,onUpdateRoom,onUpdateRd,onAddRoom}){
  const [openId,setOpenId]=useState(null);
  const [createOpen,setCreateOpen]=useState(false);
  const [joinOpen,setJoinOpen]=useState(false);
  const [joinCode,setJoinCode]=useState("");
  const [joinErr,setJoinErr]=useState("");
  const [cfName,setCfName]=useState("");
  const [cfSub,setCfSub]=useState("");
  const [cfEmoji,setCfEmoji]=useState("📚");
  const [cfColor,setCfColor]=useState("#2563eb");

  const myRooms=user.role==="teacher"?rooms.filter(r=>r.teacherId===user.id):user.role==="admin"?rooms:rooms.filter(r=>r.members.find(m=>m.userId===user.id));

  function handleJoin(){
    const r=rooms.find(x=>x.code.toUpperCase()===joinCode.toUpperCase());
    if(!r){setJoinErr("Geçersiz kod.");return;}
    if(r.members.find(m=>m.userId===user.id)){setJoinErr("Zaten bu odadasın.");return;}
    const m={userId:user.id,role:user.role,forStudent:null};
    if(user.role==="parent"&&user.childIds){const ch=r.members.find(x=>x.role==="student"&&user.childIds.includes(x.userId));m.forStudent=ch?.userId||null;}
    onUpdateRoom({...r,members:[...r.members,m]});setJoinOpen(false);setJoinCode("");setJoinErr("");
  }
  function handleCreate(){
    if(!cfName.trim())return;
    onAddRoom({id:nid(),name:cfName,subject:cfSub,teacherId:user.id,code:Math.random().toString(36).slice(2,8).toUpperCase(),color:cfColor,emoji:cfEmoji,members:[],announcements:[],schedule:[]});
    setCreateOpen(false);setCfName("");setCfSub("");
  }

  if(openId){
    const r=rooms.find(x=>x.id===openId);if(!r)return null;
    if(user.role==="teacher") return <RoomTeacher room={r} rdMap={rdMap} onBack={()=>setOpenId(null)} onUpdateRoom={onUpdateRoom} onUpdateRd={onUpdateRd} allRooms={rooms}/>;
    return <RoomUser room={r} user={user} rdMap={rdMap} onBack={()=>setOpenId(null)} onUpdateRd={onUpdateRd}/>;
  }

  const EMOJIS=["📚","📐","🔬","🌍","🎨","🎵","💡","⚛️","📖","✏️","🧮","🏃"];
  const COLORS=["#2563eb","#7c3aed","#16a34a","#d97706","#dc2626","#0891b2","#0f172a"];

  return <div style={{padding:"24px 28px"}}>
    {createOpen&&<Modal title="Yeni Ders Odası" onClose={()=>setCreateOpen(false)}>
      <Col gap={12}>
        <div><Label>Oda Adı</Label><input style={inp} value={cfName} onChange={e=>setCfName(e.target.value)} placeholder="Matematik 11. Sınıf"/></div>
        <div><Label>Ders</Label><input style={inp} value={cfSub} onChange={e=>setCfSub(e.target.value)} placeholder="Matematik"/></div>
        <div><Label>Emoji</Label><Row gap={6} wrap style={{marginTop:4}}>{EMOJIS.map(e=><button key={e} onClick={()=>setCfEmoji(e)} style={{width:34,height:34,borderRadius:8,border:`2px solid ${cfEmoji===e?"#2563eb":c.border}`,background:cfEmoji===e?"#eff6ff":c.light,cursor:"pointer",fontSize:17}}>{e}</button>)}</Row></div>
        <div><Label>Renk</Label><Row gap={6} style={{marginTop:4}}>{COLORS.map(col=><button key={col} onClick={()=>setCfColor(col)} style={{width:26,height:26,borderRadius:"50%",background:col,border:`3px solid ${cfColor===col?"#fff":"transparent"}`,outline:`2px solid ${cfColor===col?col:"transparent"}`,cursor:"pointer"}}/> )}</Row></div>
      </Col>
      <Row justify="flex-end" gap={10} style={{marginTop:20}}>
        <Btn outline onClick={()=>setCreateOpen(false)}>İptal</Btn>
        <Btn color={cfColor} onClick={handleCreate}>Oluştur</Btn>
      </Row>
    </Modal>}
    {joinOpen&&<Modal title="Odaya Katıl" onClose={()=>{setJoinOpen(false);setJoinErr("");setJoinCode("");}} w={360}>
      <p style={{color:c.muted,marginBottom:12,fontSize:13}}>Öğretmenin verdiği 6 haneli kodu gir.</p>
      <div style={{marginBottom:10}}><Label>Davet Kodu</Label><input style={inp} value={joinCode} onChange={e=>{setJoinCode(e.target.value);setJoinErr("");}} placeholder="MAT11X"/></div>
      {joinErr&&<p style={{color:"#dc2626",fontSize:12,marginBottom:8}}>⚠️ {joinErr}</p>}
      <Row justify="flex-end" gap={10}>
        <Btn outline onClick={()=>setJoinOpen(false)}>İptal</Btn>
        <Btn color="#0891b2" onClick={handleJoin} disabled={joinCode.length<3}>Katıl →</Btn>
      </Row>
    </Modal>}

    <Row justify="space-between" style={{marginBottom:20}}>
      <div>
        <h2 style={{fontSize:22,fontWeight:700,marginBottom:4,color:c.dark}}>{user.role==="teacher"?"Ders Odalarım 🏫":"Odalarım 🏫"}</h2>
        <p style={{color:c.muted,fontSize:13}}>{myRooms.length} oda{user.role!=="teacher"&&" · birden fazla öğretmenin odasına katılabilirsin"}</p>
      </div>
      <Row gap={8}>
        {(user.role==="student"||user.role==="parent")&&<Btn outline color="#0891b2" onClick={()=>setJoinOpen(true)}>🔑 Koda ile Katıl</Btn>}
        {user.role==="teacher"&&<Btn color="#0891b2" onClick={()=>setCreateOpen(true)}>+ Yeni Oda</Btn>}
      </Row>
    </Row>

    {myRooms.length===0
      ?<div style={{textAlign:"center",padding:"60px 0"}}><p style={{fontSize:44,marginBottom:12}}>🏫</p><p style={{fontWeight:700,fontSize:16,marginBottom:6,color:c.dark}}>Henüz oda yok</p><p style={{color:c.muted,fontSize:13}}>{user.role==="teacher"?"Yeni oda oluşturun.":"Öğretmeninizden kod alın."}</p></div>
      :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
        {myRooms.map(r=><RoomCard key={r.id} room={r} user={user} onOpen={()=>setOpenId(r.id)}/>)}
      </div>}
  </div>;
}

/* ─── HAFTALIK PROGRAM SAYFASI ─── */
function SchedulePage({user,rooms,rdMap}){
  const myRooms=user.role==="teacher"?rooms.filter(r=>r.teacherId===user.id):rooms.filter(r=>r.members.find(m=>m.userId===user.id));
  const allSchedule=myRooms.flatMap(r=>(r.schedule||[]).map(s=>({...s,room:r})));
  return <div style={{padding:"24px 28px"}}>
    <h2 style={{fontSize:22,fontWeight:700,marginBottom:4,color:c.dark}}>Haftalık Program 📅</h2>
    <p style={{color:c.muted,fontSize:13,marginBottom:20}}>Tüm odalarından dersler</p>
    {allSchedule.length===0
      ?<div style={{textAlign:"center",padding:"60px 0"}}><p style={{fontSize:44,marginBottom:12}}>📅</p><p style={{fontWeight:700,fontSize:16,color:c.dark}}>Henüz ders programı yok</p></div>
      :<Card><WeeklySchedule schedule={allSchedule} rooms={myRooms} userId={user.id} role={user.role}/></Card>}
  </div>;
}

/* ─── ÖDEMELer SAYFASI ─── */
function PaymentsPage({rooms,rdMap}){
  const myRooms=rooms;
  const stuIds=[...new Set(myRooms.flatMap(r=>r.members.filter(m=>m.role==="student").map(m=>m.userId)))];
  const all=myRooms.flatMap(r=>stuIds.flatMap(sid=>{const stu=USERS.find(u=>u.id===sid);return (rdMap[`${r.id}-${sid}`]?.lessons||[]).map(l=>({...l,sName:stu?.name,rName:r.name,rColor:r.color}));}));
  const total=all.reduce((a,l)=>a+l.amount,0);
  const paid=all.filter(l=>l.paid).reduce((a,l)=>a+l.amount,0);
  return <div style={{padding:"24px 28px"}}>
    <h2 style={{fontSize:22,fontWeight:700,marginBottom:16,color:c.dark}}>Ödemeler 💰</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
      {[{l:"Toplam Gelir",v:total,clr:"#d97706",ic:"💰"},{l:"Tahsil Edildi",v:paid,clr:"#16a34a",ic:"✅"},{l:"Bekleyen",v:total-paid,clr:total-paid>0?"#dc2626":"#16a34a",ic:"⏳"}].map(x=><Card key={x.l} style={{padding:"16px 18px"}}>
        <Row gap={10}><span style={{fontSize:22}}>{x.ic}</span><div><p style={{color:c.muted,fontSize:10,textTransform:"uppercase",letterSpacing:.7}}>{x.l}</p><p style={{color:x.clr,fontSize:22,fontWeight:700}}>₺{x.v.toLocaleString()}</p></div></Row>
      </Card>)}
    </div>
    {all.sort((a,b)=>b.date.localeCompare(a.date)).map(l=><Row key={l.id} style={{padding:"11px 14px",background:c.white,border:`1px solid ${c.border}`,borderRadius:12,marginBottom:7}}>
      <div style={{width:6,height:6,borderRadius:"50%",background:l.rColor,flexShrink:0}}/>
      <div style={{flex:1}}><p style={{fontWeight:600,fontSize:13}}>{l.sName} — {l.topic}</p><p style={{color:c.muted,fontSize:11}}>{l.rName} · {fmt(l.date)} · {l.hours} saat</p></div>
      <p style={{fontWeight:700}}>₺{l.amount}</p>
      <Tag label={l.paid?"Ödendi":"Bekliyor"} color={l.paid?"#16a34a":"#d97706"} bg={l.paid?"#f0fdf4":"#fffbeb"}/>
    </Row>)}
  </div>;
}

/* ─── MESAJLAR SAYFASI ─── */
function MessagesPage({user,rooms,rdMap,onUpdateRd}){
  const myRooms=rooms.filter(r=>r.teacherId===user.id);
  const stuIds=[...new Set(myRooms.flatMap(r=>r.members.filter(m=>m.role==="student").map(m=>m.userId)))];
  return <div style={{padding:"24px 28px"}}>
    <h2 style={{fontSize:22,fontWeight:700,marginBottom:16,color:c.dark}}>Mesajlar 💬</h2>
    {myRooms.map(r=>r.members.filter(m=>m.role==="student").map(sm=>{
      const stu=USERS.find(u=>u.id===sm.userId);
      const pm=r.members.find(m=>m.role==="parent"&&m.forStudent===sm.userId);
      const par=pm?USERS.find(u=>u.id===pm.userId):null;
      const key=`${r.id}-${sm.userId}`;
      const d=rdMap[key]||{messages:[]};
      const msgs=(d.messages||[]).filter(m=>m.from===user.id||m.to===user.id);
      return <MsgThread key={key} room={r} stu={stu} par={par} msgs={msgs} myId={user.id} onSend={text=>{const m={id:nid(),from:user.id,to:pm?.userId||"",text,date:new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})};onUpdateRd(key,{...d,messages:[...(d.messages||[]),m]});}}/>;
    }))}
  </div>;
}

function MsgThread({room,stu,par,msgs,myId,onSend}){
  const [txt,setTxt]=useState("");
  function send(){if(!txt.trim())return;onSend(txt);setTxt("");}
  return <div style={{marginBottom:20}}>
    <Row gap={8} style={{marginBottom:8}}>
      <span style={{fontSize:18}}>{room.emoji}</span><strong style={{fontSize:14}}>{room.name}</strong>
      <span style={{color:c.muted}}>·</span>
      <Av name={stu?.name} role="student" sz={22}/>
      <p style={{fontSize:13,fontWeight:600}}>{stu?.name}</p>
      {par&&<><span style={{color:c.muted,fontSize:12}}>· Veli:</span><p style={{fontSize:12,color:c.mid}}>{par.name}</p></>}
    </Row>
    <Card style={{padding:14}}>
      <div style={{maxHeight:200,overflowY:"auto",marginBottom:10,display:"flex",flexDirection:"column",gap:7}}>
        {msgs.length===0&&<p style={{color:c.muted,fontSize:13,textAlign:"center",paddingTop:16}}>Henüz mesaj yok.</p>}
        {msgs.map(m=>{const mine=m.from===myId;const sender=USERS.find(u=>u.id===m.from);return <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:mine?"flex-end":"flex-start"}}>
          <p style={{fontSize:10,color:c.muted,marginBottom:2}}>{sender?.name} · {m.date}</p>
          <div style={{maxWidth:"68%",padding:"7px 11px",borderRadius:mine?"11px 11px 3px 11px":"11px 11px 11px 3px",background:mine?"#eff6ff":"#f1f5f9",color:mine?"#2563eb":c.dark,fontSize:13}}>{m.text}</div>
        </div>;})}
      </div>
      <Row>
        <input style={{...inp,flex:1}} value={txt} onChange={e=>setTxt(e.target.value)} placeholder={`${par?.name||stu?.name}'a mesaj yaz...`} onKeyDown={e=>e.key==="Enter"&&send()}/>
        <Btn sm onClick={send} disabled={!txt.trim()}>Gönder</Btn>
      </Row>
    </Card>
  </div>;
}

/* ─── ANA UYGULAMA ─── */
export default function App(){
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [rooms,setRooms]=useState(INIT_ROOMS);
  const [rdMap,setRdMap]=useState(INIT_RD);
  const [collapsed,setCollapsed]=useState(false);

  function updateRoom(r){setRooms(prev=>prev.map(x=>x.id===r.id?r:x));}
  function addRoom(r){setRooms(prev=>[...prev,r]);}
  function updateRd(key,data){setRdMap(prev=>({...prev,[key]:data}));}

  if(!user) return <Login onLogin={u=>{setUser(u);setPage("dashboard");}}/>;

  const myRooms=user.role==="teacher"?rooms.filter(r=>r.teacherId===user.id):user.role==="admin"?rooms:rooms.filter(r=>r.members.find(m=>m.userId===user.id));
  const stuIds=[...new Set(myRooms.flatMap(r=>r.members.filter(m=>m.role==="student").map(m=>m.userId)))];
  const unread=user.role==="teacher"?myRooms.flatMap(r=>stuIds.flatMap(sid=>(rdMap[`${r.id}-${sid}`]?.messages||[]).filter(m=>m.to===user.id))).length:0;

  const NAV={
    teacher:[{id:"dashboard",lb:"Dashboard",ic:"🏠"},{id:"rooms",lb:"Ders Odaları",ic:"🏫"},{id:"schedule",lb:"Program",ic:"📅"},{id:"payments",lb:"Ödemeler",ic:"💰"},{id:"messages",lb:"Mesajlar",ic:"💬",badge:unread}],
    student:[{id:"dashboard",lb:"Dashboard",ic:"🏠"},{id:"rooms",lb:"Odalarım",ic:"🏫"},{id:"schedule",lb:"Program",ic:"📅"}],
    parent: [{id:"dashboard",lb:"Dashboard",ic:"🏠"},{id:"rooms",lb:"Odalarım",ic:"🏫"},{id:"schedule",lb:"Program",ic:"📅"}],
    admin:  [{id:"dashboard",lb:"Dashboard",ic:"🏠"},{id:"rooms",lb:"Tüm Odalar",ic:"🏫"},{id:"users",lb:"Kullanıcılar",ic:"👥"}],
  };
  const nav=NAV[user.role]||[];

  function renderPage(){
    if(page==="rooms")    return <Rooms user={user} rooms={rooms} rdMap={rdMap} onUpdateRoom={updateRoom} onUpdateRd={updateRd} onAddRoom={addRoom}/>;
    if(page==="schedule") return <SchedulePage user={user} rooms={rooms} rdMap={rdMap}/>;
    if(page==="payments"&&user.role==="teacher") return <PaymentsPage rooms={myRooms} rdMap={rdMap}/>;
    if(page==="messages"&&user.role==="teacher") return <MessagesPage user={user} rooms={myRooms} rdMap={rdMap} onUpdateRd={updateRd}/>;
    if(page==="users"&&user.role==="admin") return <div style={{padding:"24px 28px"}}>
      <h2 style={{fontSize:22,fontWeight:700,marginBottom:16,color:c.dark}}>Kullanıcılar 👥</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {["teacher","student","parent","admin"].map(r=><Card key={r} style={{padding:"14px 16px"}}>
          <p style={{color:c.muted,fontSize:10,textTransform:"uppercase",letterSpacing:.7}}>{rN(r)}</p>
          <p style={{color:rC(r),fontSize:22,fontWeight:700}}>{USERS.filter(u=>u.role===r).length}</p>
        </Card>)}
      </div>
      {USERS.map(u=><Row key={u.id} style={{padding:"11px 14px",background:c.white,border:`1px solid ${c.border}`,borderRadius:12,marginBottom:7}}>
        <Av name={u.name} role={u.role} sz={36}/>
        <div style={{flex:1}}><p style={{fontWeight:700,fontSize:13}}>{u.name}</p><p style={{color:c.muted,fontSize:11}}>{u.email}</p></div>
        <Tag label={rN(u.role)} color={rC(u.role)} bg={rB(u.role)}/>
      </Row>)}
    </div>;
    return <Dashboard user={user} rooms={rooms} rdMap={rdMap} goRooms={()=>setPage("rooms")}/>;
  }

  return <div style={{display:"flex",minHeight:"100vh",background:c.bg,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box;margin:0;padding:0} ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:9px}`}</style>
    <Sidebar user={user} nav={nav} active={page} onSelect={setPage} onLogout={()=>{setUser(null);setPage("dashboard");}} collapsed={collapsed} onToggle={()=>setCollapsed(v=>!v)}/>
    <main style={{flex:1,overflowY:"auto",minHeight:"100vh"}}>{renderPage()}</main>
  </div>;
}
