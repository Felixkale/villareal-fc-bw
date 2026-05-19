import { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"

/* ── BRAND ─────────────────────────────────────────────────────────────────── */
const NAVY  = "#0D1B3E"
const GOLD  = "#F5C518"
const GOLD2 = "#D4A800"
const WHITE = "#FFFFFF"
const LGRAY = "#F4F4F4"
const MGRAY = "#888"
const RED   = "#C0392B"
const GREEN = "#27AE60"

/* ── STANDINGS ──────────────────────────────────────────────────────────────── */
const STANDINGS = [
  { pos:1,  team:"MOPIPI ALL STARS",    p:27,w:19,d:5,l:3,  pts:62 },
  { pos:2,  team:"DESERT BUFFALOS",     p:25,w:19,d:4,l:2,  pts:61 },
  { pos:3,  team:"GREEN STARS",         p:27,w:17,d:8,l:2,  pts:59 },
  { pos:4,  team:"WHITE STAFF",         p:26,w:14,d:7,l:5,  pts:49 },
  { pos:5,  team:"BOTETI RIVER GIANTS", p:27,w:12,d:9,l:6,  pts:45 },
  { pos:6,  team:"MIGHTY BIRDS",        p:26,w:13,d:4,l:9,  pts:43 },
  { pos:7,  team:"ZOWA UNITED",         p:26,w:11,d:8,l:7,  pts:41 },
  { pos:8,  team:"STONE BREAKERS",      p:27,w:11,d:5,l:11, pts:38 },
  { pos:9,  team:"GOLDEN BIRDS",        p:27,w:9, d:8,l:10, pts:35 },
  { pos:10, team:"VILLAREAL FC ★",      p:26,w:11,d:2,l:13, pts:35, isUs:true },
  { pos:11, team:"MMATSHUMO CLASSIC",   p:27,w:9, d:5,l:13, pts:32 },
  { pos:12, team:"WHITE DIAMOND",       p:27,w:7, d:4,l:16, pts:25 },
  { pos:13, team:"STALLIONS",           p:26,w:6, d:5,l:15, pts:23 },
  { pos:14, team:"LETLHAKANE UNITED",   p:26,w:5, d:5,l:16, pts:20 },
  { pos:15, team:"DIAMOND CHIEFS",      p:26,w:5, d:4,l:17, pts:19 },
  { pos:16, team:"BUNGU STARS",         p:26,w:1, d:1,l:24, pts:4  },
]

const SQUAD = {
  goalkeepers: [
    { no:1,  first:"ORATILE",      last:"MOSWEU"   },
    { no:16, first:"TSHEGOFATSO",  last:"GAOLAPE"  },
  ],
  defenders: [
    { no:2,  first:"KEABETSWE",    last:"PULE"     },
    { no:3,  first:"LEBOGANG",     last:"SERETSE"  },
    { no:4,  first:"ONKABETSE",    last:"MOGAPI"   },
    { no:5,  first:"PHENYO",       last:"RADIBE"   },
  ],
  midfielders: [
    { no:6,  first:"TSHEPO",       last:"KGOSI"    },
    { no:7,  first:"BALESENG",     last:"MOTLHABI" },
    { no:8,  first:"GOITSEMODIMO", last:"MOAGI"    },
    { no:10, first:"OABILE",       last:"TSHOSA"   },
  ],
  forwards: [
    { no:9,  first:"KGOPOTSO",     last:"NTSHELE"  },
    { no:11, first:"NEO",          last:"MOSEKI"   },
    { no:17, first:"LEFIKA",       last:"DITLHARE" },
  ],
}

const MONTHLY_PRICE = 20
const YEARLY_PRICE  = 200
const YEARLY_PCT    = 17

/* ── SVG LOGO ───────────────────────────────────────────────────────────────── */
const Logo = ({ size = 40 }) => (
  <img
    src="/logo.png"
    alt="Villareal FC"
    width={size}
    height={size}
    style={{ flexShrink:0, borderRadius:"50%", objectFit:"cover", display:"block" }}
  />
)

const Ico = ({ d, size = 22, stroke = "#888", sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
)

const Pill = ({ label, bg = GOLD, color = NAVY, small }) => (
  <span style={{
    display:"inline-block", background:bg, color, borderRadius:4,
    fontSize:small?8:9, fontWeight:800, padding:small?"1px 5px":"2px 7px",
    fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.06em", whiteSpace:"nowrap",
  }}>{label}</span>
)

const Btn = ({ children, onClick, bg=GOLD, color=NAVY, disabled, style:sx={} }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width:"100%", padding:"14px", background:disabled?"#ccc":bg,
    border:"none", borderRadius:12, cursor:disabled?"not-allowed":"pointer",
    fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16,
    color:disabled?"#999":color, WebkitTapHighlightColor:"transparent",
    minHeight:50, lineHeight:1, ...sx,
  }}>{children}</button>
)

const Field = ({ label, ...props }) => (
  <div style={{ marginBottom:14 }}>
    {label && <label style={{ fontSize:11, fontWeight:700, color:MGRAY,
      fontFamily:"'Barlow Condensed',sans-serif", display:"block", marginBottom:4,
      letterSpacing:"0.06em" }}>{label}</label>}
    <input {...props} style={{
      width:"100%", padding:"13px 14px", borderRadius:10,
      border:`2px solid #e5e5e5`, fontSize:16, outline:"none",
      boxSizing:"border-box", fontFamily:"inherit",
      WebkitAppearance:"none", minHeight:50,
    }}
    onFocus={e => e.target.style.borderColor=GOLD}
    onBlur={e => e.target.style.borderColor="#e5e5e5"}
    />
  </div>
)

/* ── BOTTOM NAV ─────────────────────────────────────────────────────────────── */
const NAV_TABS = [
  { id:"foryou",   label:"For You",  icon:"M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" },
  { id:"calendar", label:"Calendar", icon:"M3 5h18v16H3zM3 10h18M8 3v4M16 3v4" },
  { id:"clips",    label:"Clips",    icon:"M12 21a9 9 0 100-18 9 9 0 000 18z M10 8l6 4-6 4V8z" },
  { id:"store",    label:"Store",    icon:"M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0" },
  { id:"profile",  label:"Profile",  icon:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z" },
]

const BottomNav = ({ active, setActive }) => (
  <div style={{ display:"flex", borderTop:`1px solid #e5e5e5`, background:WHITE,
    paddingBottom:"env(safe-area-inset-bottom, 8px)", paddingTop:6, flexShrink:0 }}>
    {NAV_TABS.map(t => (
      <button key={t.id} onClick={() => setActive(t.id)} style={{
        flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2,
        background:"none", border:"none", cursor:"pointer", padding:"4px 0",
        WebkitTapHighlightColor:"transparent", minHeight:44,
      }}>
        <Ico d={t.icon} stroke={active===t.id?NAVY:MGRAY} sw={active===t.id?2.2:1.6}/>
        <span style={{ fontSize:"clamp(9px,2.2vw,10px)", fontWeight:active===t.id?700:400,
          color:active===t.id?NAVY:MGRAY, fontFamily:"'Barlow Condensed',sans-serif" }}>
          {t.label}
        </span>
      </button>
    ))}
  </div>
)

/* ══════════════════════════════════════════════════════════════════════════════
   DONATE MODAL
══════════════════════════════════════════════════════════════════════════════ */
const DonateModal = ({ onClose, userEmail }) => {
  const [amount,  setAmount]  = useState("50")
  const [custom,  setCustom]  = useState("")
  const [name,    setName]    = useState("")
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState("")
  const presets  = ["20","50","100","200"]
  const finalAmt = custom || amount

  const handleDonate = async () => {
    if (!finalAmt || isNaN(finalAmt) || Number(finalAmt)<=0) {
      setError("Please enter a valid amount."); return
    }
    setLoading(true); setError("")
    const { error: err } = await supabase.from("donations").insert({
      donor_name: name||"Anonymous", email:userEmail||null, amount:Number(finalAmt),
    })
    setLoading(false)
    if (err) { setError("Something went wrong. Please try again."); return }
    setDone(true)
  }

  if (done) return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:999,
      display:"flex", alignItems:"center", justifyContent:"center", padding:"0 20px" }}>
      <div style={{ background:WHITE, borderRadius:20, padding:"32px 24px",
        textAlign:"center", width:"100%", maxWidth:340 }}>
        <div style={{ fontSize:52, marginBottom:10 }}>🎉</div>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900,
          fontSize:24, color:NAVY }}>THANK YOU, HONEY BADGER!</div>
        <div style={{ fontSize:14, color:MGRAY, margin:"10px 0 24px", lineHeight:1.6 }}>
          Your P{finalAmt} donation fuels the dream.<br/>See you at the pitch!
        </div>
        <Btn onClick={onClose}>CLOSE</Btn>
      </div>
    </div>
  )

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:999,
      display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ background:WHITE, borderRadius:"22px 22px 0 0", width:"100%",
        maxWidth:480, padding:"20px 20px",
        paddingBottom:"calc(24px + env(safe-area-inset-bottom,0px))" }}>
        <div style={{ width:40, height:4, background:"#ddd", borderRadius:2, margin:"0 auto 18px" }}/>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
          <Logo size={34}/>
          <div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:17, color:NAVY }}>
              SUPPORT THE HONEY BADGERS
            </div>
            <div style={{ fontSize:12, color:MGRAY }}>Every Pula counts!</div>
          </div>
        </div>
        <Field label="YOUR NAME (optional)" placeholder="e.g. Kgopotso"
          value={name} onChange={e=>setName(e.target.value)}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:12 }}>
          {presets.map(p=>(
            <button key={p} onClick={()=>{setAmount(p);setCustom("")}} style={{
              padding:"12px 0", borderRadius:10, minHeight:48,
              border:`2px solid ${amount===p&&!custom?GOLD:"#ddd"}`,
              background:amount===p&&!custom?`${GOLD}22`:WHITE,
              fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:15,
              color:NAVY, cursor:"pointer", WebkitTapHighlightColor:"transparent",
            }}>P{p}</button>
          ))}
        </div>
        <div style={{ position:"relative", marginBottom:14 }}>
          <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
            fontWeight:700, color:MGRAY, fontSize:15 }}>P</span>
          <input type="number" placeholder="Custom amount" value={custom}
            onChange={e=>{setCustom(e.target.value);setAmount("")}}
            style={{ width:"100%", padding:"13px 13px 13px 28px", borderRadius:10,
              border:`2px solid ${custom?GOLD:"#ddd"}`, fontSize:16, minHeight:50,
              fontFamily:"inherit", outline:"none", boxSizing:"border-box",
              WebkitAppearance:"none" }}/>
        </div>
        {error && <div style={{color:RED,fontSize:13,marginBottom:12,fontWeight:600}}>{error}</div>}
        <Btn onClick={handleDonate} disabled={loading} sx={{marginBottom:8}}>
          {loading?"PROCESSING...":`DONATE P${finalAmt||"—"} NOW ❤️`}
        </Btn>
        <button onClick={onClose} style={{ width:"100%", padding:"12px", background:"none",
          border:"none", fontSize:14, color:MGRAY, cursor:"pointer" }}>Cancel</button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   FOR YOU
══════════════════════════════════════════════════════════════════════════════ */
const ForYouScreen = ({ userEmail, goToAuth }) => {
  const [showDonate, setShowDonate] = useState(false)
  const [news, setNews] = useState([])
  useEffect(()=>{
    supabase.from("news").select("*").eq("published",true)
      .order("created_at",{ascending:false})
      .then(({data})=>{ if(data) setNews(data) })
  },[])
  return (
    <div style={{flex:1,overflowY:"auto",background:WHITE,WebkitOverflowScrolling:"touch"}}>
      {showDonate && <DonateModal onClose={()=>setShowDonate(false)} userEmail={userEmail}/>}

      {/* Header */}
      <div style={{padding:"12px 14px 10px",display:"flex",alignItems:"center",
        justifyContent:"space-between",borderBottom:`1px solid #eee`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
          <Logo size={36}/>
          <div style={{minWidth:0}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:"clamp(15px,4.5vw,19px)",color:NAVY,lineHeight:1}}>
              VILLAREAL FC 🏆
            </div>
            <div style={{fontSize:"clamp(9px,2.5vw,11px)",color:MGRAY}}>BRFA Div 1 · Season 2026/27</div>
          </div>
        </div>
        <button onClick={goToAuth} style={{width:42,height:42,borderRadius:"50%",flexShrink:0,
          background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
          border:`2.5px solid ${NAVY}`,display:"flex",alignItems:"center",justifyContent:"center",
          cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="8" r="4"/>
          </svg>
        </button>
      </div>

      {/* Quick links */}
      <div style={{padding:"10px 12px",display:"flex",gap:8,overflowX:"auto",borderBottom:`1px solid #eee`}}>
        {["🔥 LAST GAME","👕 SHOP","🤝 MEMBERSHIP"].map(l=>(
          <button key={l} style={{background:"none",border:`1.5px solid #ddd`,borderRadius:20,
            padding:"6px 14px",fontSize:"clamp(10px,2.5vw,12px)",fontWeight:700,whiteSpace:"nowrap",
            fontFamily:"'Barlow Condensed',sans-serif",color:NAVY,cursor:"pointer",
            WebkitTapHighlightColor:"transparent",minHeight:36}}>{l}</button>
        ))}
      </div>

      {/* Hero card */}
      <div style={{margin:"12px 12px 10px",borderRadius:14,overflow:"hidden",
        boxShadow:"0 4px 20px rgba(0,0,0,0.13)"}}>
        <div style={{background:`linear-gradient(160deg,${NAVY},#1a3060)`,
          padding:"clamp(14px,4vw,20px)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-16,bottom:-16,opacity:0.07}}><Logo size={130}/></div>
          <Pill label="MATCH" bg={GOLD} color={NAVY}/>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:"clamp(22px,6vw,30px)",color:WHITE,marginTop:8,lineHeight:1.05}}>
            VILLAREAL HOLD<br/>STONE BREAKERS 1–1
          </div>
          <div style={{fontSize:"clamp(11px,3vw,13px)",color:"#aaa",marginTop:6}}>
            A crucial point in the BRFA survival race
          </div>
        </div>
        <div style={{background:GOLD,padding:"9px 16px",display:"flex",
          justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:"clamp(10px,3vw,12px)",color:NAVY}}>READ MATCH REPORT →</span>
          <span style={{fontSize:11,color:NAVY,fontWeight:600}}>FT</span>
        </div>
      </div>

      {/* Donate */}
      <div style={{margin:"0 12px 12px"}}>
        <button onClick={()=>setShowDonate(true)} style={{
          width:"100%",padding:"clamp(12px,3.5vw,15px) 16px",
          background:`linear-gradient(135deg,${RED},#a93226)`,
          border:"none",borderRadius:14,minHeight:60,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          cursor:"pointer",WebkitTapHighlightColor:"transparent",
          boxShadow:"0 4px 14px rgba(192,57,43,0.3)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:"clamp(20px,5vw,26px)"}}>❤️</span>
            <div style={{textAlign:"left"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:"clamp(13px,4vw,16px)",color:WHITE}}>
                SUPPORT THE HONEY BADGERS
              </div>
              <div style={{fontSize:"clamp(10px,2.5vw,12px)",color:"rgba(255,255,255,0.8)",marginTop:1}}>
                Help us fight for promotion
              </div>
            </div>
          </div>
          <div style={{background:WHITE,borderRadius:8,padding:"6px 12px",flexShrink:0,
            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:"clamp(11px,3vw,13px)",color:RED}}>DONATE</div>
        </button>
      </div>

      {/* News */}
      <div style={{padding:"0 12px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:"clamp(13px,3.5vw,15px)",color:NAVY}}>LATEST NEWS</span>
          <span style={{fontSize:13,color:GOLD,fontWeight:700,
            fontFamily:"'Barlow Condensed',sans-serif"}}>More ›</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10}}>
          {(news.length?news:[
            {id:1,title:"SQUAD ANNOUNCEMENT",tag:"NEW"},
            {id:2,title:"HOME KIT REVEAL 2026/27",tag:"NEW"},
            {id:3,title:"MATCH REPORT: 1-1 DRAW",tag:"MATCH"},
          ]).slice(0,4).map((n,i)=>(
            <div key={n.id||i} style={{
              borderRadius:12,overflow:"hidden",position:"relative",
              background:`linear-gradient(160deg,${NAVY},#1a3060)`,
              minHeight:110,display:"flex",flexDirection:"column",
              justifyContent:"flex-end",padding:10}}>
              <div style={{position:"absolute",top:8,left:8}}>
                <Pill label={n.tag||"NEW"} bg={GOLD} color={NAVY}/>
              </div>
              <div style={{opacity:0.08,position:"absolute",right:-8,top:-8}}><Logo size={80}/></div>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:"clamp(11px,3vw,13px)",color:WHITE,lineHeight:1.2}}>
                {n.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   CALENDAR
══════════════════════════════════════════════════════════════════════════════ */
const CalendarScreen = () => {
  const [subTab,setSubTab]=useState("calendar")
  const [fixtures,setFixtures]=useState([])
  useEffect(()=>{
    supabase.from("fixtures").select("*").order("match_date")
      .then(({data})=>{ if(data) setFixtures(data) })
  },[])
  const fixtureMap={}
  fixtures.forEach(f=>{
    const d=new Date(f.match_date)
    if(d.getMonth()===4&&d.getFullYear()===2026) fixtureMap[d.getDate()]=f
  })

  const CalGrid=()=>{
    const DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
    const cells=[]
    for(let i=0;i<4;i++) cells.push(null)
    for(let d=1;d<=31;d++) cells.push(d)
    return (
      <div style={{overflowY:"auto",flex:1,WebkitOverflowScrolling:"touch"}}>
        <div style={{padding:"12px 14px 6px",display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:NAVY}}>May 2026</span>
          <span style={{color:MGRAY}}>▾</span>
        </div>
        <div style={{borderTop:`1px solid #eee`,margin:"0 12px"}}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",padding:"8px 8px 0"}}>
          {DAYS.map(d=>(
            <div key={d} style={{textAlign:"center",fontSize:"clamp(9px,2.2vw,11px)",
              color:MGRAY,fontWeight:600,paddingBottom:4}}>{d}</div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",padding:"0 6px 10px"}}>
          {cells.map((d,i)=>{
            const fx=d?fixtureMap[d]:null
            const today=d===19
            return (
              <div key={i} style={{minHeight:"clamp(46px,12vw,58px)",display:"flex",
                flexDirection:"column",alignItems:"center",paddingTop:3}}>
                {d&&(
                  <>
                    <div style={{width:"clamp(24px,6.5vw,30px)",height:"clamp(24px,6.5vw,30px)",
                      borderRadius:"50%",background:today?NAVY:"none",
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:"clamp(11px,3vw,13px)",fontWeight:today?700:400,
                        color:today?WHITE:NAVY}}>{d}</span>
                    </div>
                    {fx&&(
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1,marginTop:2}}>
                        <div style={{width:"clamp(20px,5.5vw,26px)",height:"clamp(20px,5.5vw,26px)",
                          borderRadius:"50%",background:NAVY,border:`1.5px solid ${GOLD}`,
                          display:"flex",alignItems:"center",justifyContent:"center"}}>
                          <span style={{fontSize:6,color:GOLD,fontWeight:800,
                            fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1}}>
                            {fx.opponent.split(" ").map(w=>w[0]).join("").slice(0,3)}
                          </span>
                        </div>
                        <Pill label={fx.venue==="AWAY"?"✈":"🏠"}
                          bg={fx.venue==="AWAY"?RED:NAVY} color={WHITE} small/>
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
        {/* Fixture list */}
        <div style={{padding:"4px 12px 16px"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,
            color:MGRAY,letterSpacing:"0.06em",marginBottom:8}}>UPCOMING FIXTURES</div>
          {fixtures.filter(f=>!f.result).map(fx=>(
            <div key={fx.id} style={{display:"flex",alignItems:"center",gap:10,
              padding:"10px 12px",borderRadius:10,background:LGRAY,marginBottom:8}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:NAVY,flexShrink:0,
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:7,color:GOLD,fontWeight:800,
                  fontFamily:"'Barlow Condensed',sans-serif",textAlign:"center",lineHeight:1.2}}>
                  {fx.opponent.split(" ").map(w=>w[0]).join("").slice(0,3)}
                </span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:"clamp(12px,3.5vw,14px)",color:NAVY,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  vs {fx.opponent}
                </div>
                <div style={{fontSize:11,color:MGRAY}}>
                  {new Date(fx.match_date).toLocaleDateString("en-GB",
                    {weekday:"short",day:"numeric",month:"short"})}
                  {fx.kick_off?` · ${fx.kick_off.slice(0,5)}`:""}
                </div>
              </div>
              <Pill label={fx.venue} bg={fx.venue==="AWAY"?RED:NAVY} color={WHITE} small/>
            </div>
          ))}
          {fixtures.filter(f=>!f.result).length===0&&(
            <div style={{textAlign:"center",padding:"20px",color:MGRAY,fontSize:13}}>
              No upcoming fixtures.
            </div>
          )}
        </div>
      </div>
    )
  }

  const StandingsTab=()=>(
    <div style={{overflowY:"auto",flex:1,WebkitOverflowScrolling:"touch"}}>
      <div style={{padding:"8px 12px 6px",background:"#f9f9f9",borderBottom:`1px solid #eee`}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
          fontSize:"clamp(11px,3vw,13px)",color:NAVY}}>BRFA DIVISION ONE 2026/27</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"22px 1fr 20px 20px 20px 20px 26px",
        gap:2,padding:"5px 10px",background:"#f0f0f0",borderBottom:`1px solid #ddd`}}>
        {["#","TEAM","P","W","D","L","PTS"].map(h=>(
          <span key={h} style={{fontSize:9,fontWeight:700,color:MGRAY,
            fontFamily:"'Barlow Condensed',sans-serif",textAlign:h==="TEAM"?"left":"center"}}>{h}</span>
        ))}
      </div>
      {STANDINGS.map((r,i)=>(
        <div key={i} style={{
          display:"grid",gridTemplateColumns:"22px 1fr 20px 20px 20px 20px 26px",
          gap:2,padding:"7px 10px",
          background:r.isUs?`${GOLD}22`:i%2===0?WHITE:"#fafafa",
          borderBottom:`1px solid #f0f0f0`,
          borderLeft:r.isUs?`3px solid ${GOLD}`:"3px solid transparent"}}>
          <span style={{fontSize:10,color:MGRAY,textAlign:"center",fontWeight:600}}>{r.pos}</span>
          <span style={{fontSize:"clamp(10px,3vw,12px)",fontWeight:r.isUs?900:600,
            color:r.isUs?NAVY:"#333",fontFamily:"'Barlow Condensed',sans-serif",
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.team}</span>
          {[r.p,r.w,r.d,r.l].map((v,j)=>(
            <span key={j} style={{fontSize:10,textAlign:"center",color:"#444"}}>{v}</span>
          ))}
          <span style={{fontSize:11,textAlign:"center",fontWeight:800,color:NAVY,
            fontFamily:"'Barlow Condensed',sans-serif"}}>{r.pts}</span>
        </div>
      ))}
      <div style={{padding:"8px 12px"}}>
        <span style={{fontSize:10,color:MGRAY}}>★ = Villareal FC "The Honey Badgers"</span>
      </div>
    </div>
  )

  const PlayersTab=()=>{
    const sections=[
      {label:"GOALKEEPERS",players:SQUAD.goalkeepers},
      {label:"DEFENDERS",  players:SQUAD.defenders},
      {label:"MIDFIELDERS",players:SQUAD.midfielders},
      {label:"FORWARDS",   players:SQUAD.forwards},
    ]
    return (
      <div style={{overflowY:"auto",flex:1,padding:"8px 12px",WebkitOverflowScrolling:"touch"}}>
        {sections.map(s=>(
          <div key={s.label} style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:800,color:MGRAY,
              fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",marginBottom:8}}>
              {s.label}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10}}>
              {s.players.map(p=>(
                <div key={p.no} style={{borderRadius:12,overflow:"hidden",
                  background:`linear-gradient(160deg,${NAVY},#1a3060)`}}>
                  <div style={{height:86,display:"flex",alignItems:"center",
                    justifyContent:"center",position:"relative"}}>
                    <div style={{opacity:0.12,position:"absolute"}}><Logo size={68}/></div>
                    <svg width="50" height="50" viewBox="0 0 56 56">
                      <path d="M8 14 L4 24 L16 28 L16 48 L40 48 L40 28 L52 24 L48 14 L36 18 C34 22 22 22 20 18 Z"
                        fill={GOLD} stroke={NAVY} strokeWidth="1.5"/>
                    </svg>
                    <span style={{position:"absolute",fontSize:20,fontWeight:900,
                      fontFamily:"'Barlow Condensed',sans-serif",color:WHITE,
                      textShadow:"0 2px 6px rgba(0,0,0,0.5)"}}>{p.no}</span>
                  </div>
                  <div style={{background:WHITE,padding:"8px 10px 10px"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:MGRAY}}>{p.first}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,
                      fontWeight:900,color:NAVY,lineHeight:1}}>{p.last}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:WHITE,overflow:"hidden"}}>
      <div style={{display:"flex",borderBottom:`1px solid #eee`,padding:"0 14px",gap:14,overflowX:"auto"}}>
        {["calendar","standings","players"].map(t=>(
          <button key={t} onClick={()=>setSubTab(t)} style={{
            background:"none",border:"none",cursor:"pointer",padding:"12px 0 10px",
            fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(11px,3vw,13px)",fontWeight:700,
            color:subTab===t?NAVY:MGRAY,letterSpacing:"0.05em",
            borderBottom:subTab===t?`2.5px solid ${NAVY}`:"2.5px solid transparent",
            textTransform:"uppercase",WebkitTapHighlightColor:"transparent",whiteSpace:"nowrap",
          }}>{t}</button>
        ))}
      </div>
      {subTab==="calendar"  && <CalGrid/>}
      {subTab==="standings" && <StandingsTab/>}
      {subTab==="players"   && <PlayersTab/>}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   CLIPS
══════════════════════════════════════════════════════════════════════════════ */
const ClipsScreen=()=>{
  const [liked,setLiked]=useState(false)
  return (
    <div style={{flex:1,background:"#000",display:"flex",flexDirection:"column",
      position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:12,left:0,right:0,zIndex:10,textAlign:"center"}}>
        <span style={{color:WHITE,fontWeight:700,fontSize:16}}>Clips</span>
      </div>
      <div style={{flex:1,background:`linear-gradient(160deg,${NAVY},#1a3060,#0a1020)`,
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <div style={{opacity:0.1,position:"absolute"}}><Logo size={220}/></div>
        <Logo size={90}/>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:"clamp(22px,6vw,28px)",color:GOLD,letterSpacing:"0.06em",
          marginTop:16,textAlign:"center"}}>
          KGOPOTSO<br/>NTSHELE
        </div>
        <div style={{color:WHITE,fontWeight:700,fontSize:20,marginTop:2}}>#9</div>
      </div>
      <div style={{position:"absolute",right:16,bottom:80,display:"flex",
        flexDirection:"column",gap:18,alignItems:"center"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <button onClick={()=>setLiked(l=>!l)} style={{background:"none",border:"none",
            cursor:"pointer",fontSize:28,WebkitTapHighlightColor:"transparent",minHeight:44}}>
            {liked?"❤️":"🤍"}
          </button>
          <span style={{color:WHITE,fontSize:11}}>{liked?"4.4k":"4.3k"}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <span style={{fontSize:24,color:WHITE}}>↗</span>
          <span style={{color:WHITE,fontSize:11}}>1.2k</span>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   STORE
══════════════════════════════════════════════════════════════════════════════ */
const StoreScreen=({goToAuth,fixtures})=>{
  const [subTab,setSubTab]=useState("membership")

  const ShopTab=()=>(
    <div style={{overflowY:"auto",flex:1,padding:12,WebkitOverflowScrolling:"touch"}}>
      <div style={{borderRadius:14,background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
        padding:"18px 16px",marginBottom:12,textAlign:"center"}}>
        <Logo size={54}/>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:"clamp(16px,5vw,20px)",color:NAVY,marginTop:8}}>2026/27 KIT PRE-ORDER</div>
        <div style={{fontSize:12,color:NAVY,marginTop:4}}>Members get 5% off · Pula prices</div>
        <button style={{marginTop:12,background:NAVY,border:"none",borderRadius:8,
          padding:"10px 24px",color:GOLD,fontWeight:800,minHeight:44,
          fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,cursor:"pointer"}}>
          PRE-ORDER NOW
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10}}>
        {[
          {name:"Home Kit 2026/27",price:"P 280"},
          {name:"Away Kit 2026/27",price:"P 260"},
          {name:"Training Top",    price:"P 180"},
          {name:"Scarf",           price:"P 85"},
          {name:"Cap",             price:"P 70"},
          {name:"Water Bottle",    price:"P 55"},
        ].map((p,i)=>(
          <div key={i} style={{borderRadius:12,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.09)"}}>
            <div style={{height:78,background:i%2===0?NAVY:`linear-gradient(135deg,${NAVY},#1a3060)`,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Logo size={46}/>
            </div>
            <div style={{padding:"8px 10px 10px",background:WHITE}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                fontSize:"clamp(11px,3vw,13px)",color:NAVY}}>{p.name}</div>
              <div style={{fontSize:13,color:GOLD,fontWeight:800,
                fontFamily:"'Barlow Condensed',sans-serif"}}>{p.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const TicketsTab=()=>(
    <div style={{overflowY:"auto",flex:1,padding:12,WebkitOverflowScrolling:"touch"}}>
      {fixtures.filter(f=>!f.result).map(fx=>(
        <div key={fx.id} style={{borderRadius:12,overflow:"hidden",marginBottom:10,
          boxShadow:"0 1px 6px rgba(0,0,0,0.08)"}}>
          <div style={{background:NAVY,padding:"8px 14px",display:"flex",
            justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
              fontSize:"clamp(11px,3vw,13px)",color:GOLD}}>
              {new Date(fx.match_date).toLocaleDateString("en-GB",
                {day:"numeric",month:"short",year:"numeric"}).toUpperCase()}
            </span>
            <Pill label={fx.venue} bg={fx.venue==="AWAY"?RED:GOLD}
              color={fx.venue==="AWAY"?WHITE:NAVY} small/>
          </div>
          <div style={{background:WHITE,padding:"12px 14px",display:"flex",
            alignItems:"center",justifyContent:"space-between",gap:8}}>
            <div style={{minWidth:0}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:"clamp(12px,4vw,15px)",color:NAVY,
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                VILLAREAL FC vs {fx.opponent}
              </div>
              <div style={{fontSize:11,color:MGRAY,marginTop:2}}>{fx.competition}</div>
            </div>
            <button style={{background:GOLD,border:"none",borderRadius:8,
              padding:"8px 14px",fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:800,fontSize:13,color:NAVY,cursor:"pointer",flexShrink:0,minHeight:40}}>
              {fx.venue==="HOME"?"BUY P25":"AWAY"}
            </button>
          </div>
        </div>
      ))}
      {fixtures.filter(f=>!f.result).length===0&&(
        <div style={{textAlign:"center",padding:"40px 20px",color:MGRAY,fontSize:13}}>
          No upcoming fixtures yet.
        </div>
      )}
    </div>
  )

  const MembershipTab=()=>{
    const [billing,setBilling]=useState("yearly")
    const isYearly=billing==="yearly"
    return (
      <div style={{overflowY:"auto",flex:1,WebkitOverflowScrolling:"touch"}}>
        <div style={{background:`linear-gradient(160deg,${NAVY},#0a1428)`,
          padding:"clamp(18px,5vw,28px) clamp(14px,4vw,20px)",position:"relative",overflow:"hidden"}}>
          <div style={{opacity:0.07,position:"absolute",right:-20,top:-20}}><Logo size={180}/></div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:"clamp(26px,8vw,40px)",color:WHITE,lineHeight:1}}>
            THE HONEY BADGER
          </div>
          <div style={{fontSize:12,color:"#aaa",marginBottom:16,marginTop:4}}>
            Villareal FC Premium Membership
          </div>

          <div style={{display:"flex",background:"rgba(255,255,255,0.1)",borderRadius:10,
            padding:3,marginBottom:16}}>
            {["monthly","yearly"].map(b=>(
              <button key={b} onClick={()=>setBilling(b)} style={{
                flex:1,padding:"10px 0",minHeight:44,
                background:billing===b?WHITE:"none",
                border:"none",borderRadius:8,cursor:"pointer",
                fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:"clamp(11px,3vw,13px)",
                color:billing===b?NAVY:"#aaa",WebkitTapHighlightColor:"transparent",
                display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                {b.toUpperCase()}
                {b==="yearly"&&(
                  <span style={{background:GREEN,color:WHITE,fontSize:9,fontWeight:900,
                    padding:"1px 5px",borderRadius:3}}>SAVE {YEARLY_PCT}%</span>
                )}
              </button>
            ))}
          </div>

          <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:"clamp(36px,10vw,48px)",color:GOLD}}>
              P{isYearly?YEARLY_PRICE:MONTHLY_PRICE}
            </span>
            <span style={{color:"#aaa",fontSize:14}}>{isYearly?"/ Year":"/ Month"}</span>
          </div>
          <div style={{fontSize:12,color:"#888",marginBottom:18}}>
            {isYearly
              ?`P${MONTHLY_PRICE}/month equivalent · Save P40 vs monthly`
              :`Or P${YEARLY_PRICE}/year and save ${YEARLY_PCT}%`}
          </div>

          {["Early access to match tickets","10% off match-day tickets","5% off online store",
            "Exclusive member kit number","Priority squad updates"].map((b,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
              <span style={{color:GOLD,fontSize:16,flexShrink:0}}>✔</span>
              <span style={{color:WHITE,fontSize:"clamp(12px,3.5vw,14px)",
                fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600}}>{b}</span>
            </div>
          ))}

          <div style={{marginTop:22}}>
            <Btn onClick={goToAuth} bg={GOLD} color={NAVY}>
              JOIN THE HONEY BADGERS →
            </Btn>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:WHITE,overflow:"hidden"}}>
      <div style={{display:"flex",borderBottom:`1px solid #eee`,padding:"0 14px",gap:14,overflowX:"auto"}}>
        {["shop","tickets","membership"].map(t=>(
          <button key={t} onClick={()=>setSubTab(t)} style={{
            background:"none",border:"none",cursor:"pointer",padding:"12px 0 10px",
            fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(11px,3vw,13px)",fontWeight:700,
            color:subTab===t?NAVY:MGRAY,letterSpacing:"0.05em",
            borderBottom:subTab===t?`2.5px solid ${NAVY}`:"2.5px solid transparent",
            textTransform:"uppercase",WebkitTapHighlightColor:"transparent",whiteSpace:"nowrap",
          }}>{t}</button>
        ))}
      </div>
      {subTab==="shop"       && <ShopTab/>}
      {subTab==="tickets"    && <TicketsTab/>}
      {subTab==="membership" && <MembershipTab/>}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   AUTH — real Supabase auth, secure
══════════════════════════════════════════════════════════════════════════════ */
const AuthScreen=({onSuccess,onGuest})=>{
  const [mode,setMode]=useState("ask")
  const [email,setEmail]=useState("")
  const [password,setPass]=useState("")
  const [name,setName]=useState("")
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState("")
  const [done,setDone]=useState(false)

  const reset=()=>{ setError(""); setEmail(""); setPass(""); setName("") }

  const handleAuth=async()=>{
    setError("")
    if(!email.trim())        { setError("Please enter your email."); return }
    if(password.length<6)    { setError("Password must be at least 6 characters."); return }
    if(mode==="signup"&&!name.trim()) { setError("Please enter your full name."); return }
    setLoading(true)
    if(mode==="login"){
      const {error:err}=await supabase.auth.signInWithPassword({email:email.trim(),password})
      if(err){ setError(err.message); setLoading(false); return }
      onSuccess()
    } else {
      const {error:err}=await supabase.auth.signUp({
        email:email.trim(), password,
        options:{data:{full_name:name.trim()}}
      })
      if(err){ setError(err.message); setLoading(false); return }
      setDone(true)
    }
    setLoading(false)
  }

  if(done) return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",background:WHITE,padding:"24px 20px",textAlign:"center"}}>
      <div style={{fontSize:54,marginBottom:12}}>📧</div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
        fontSize:"clamp(20px,6vw,26px)",color:NAVY,marginBottom:8}}>CHECK YOUR EMAIL</div>
      <div style={{fontSize:14,color:MGRAY,lineHeight:1.7,marginBottom:28,maxWidth:300}}>
        We sent a confirmation link to<br/><strong>{email}</strong>.<br/>
        Click it to activate your account, then log in.
      </div>
      <div style={{width:"100%",maxWidth:320}}>
        <Btn onClick={()=>{setDone(false);setMode("login");reset()}}>GO TO LOGIN</Btn>
      </div>
    </div>
  )

  if(mode==="ask") return (
    <div style={{flex:1,overflowY:"auto",background:WHITE,WebkitOverflowScrolling:"touch"}}>
      <div style={{background:`linear-gradient(160deg,${NAVY},#0a1428)`,
        padding:"clamp(28px,8vw,44px) clamp(16px,5vw,24px)",
        textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{opacity:0.07,position:"absolute",right:-20,bottom:-20}}><Logo size={200}/></div>
        <Logo size={66}/>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:"clamp(26px,8vw,36px)",color:WHITE,marginTop:12}}>VILLAREAL FC</div>
        <div style={{fontSize:"clamp(11px,3vw,13px)",color:GOLD,fontWeight:700,
          fontFamily:"'Barlow Condensed',sans-serif",marginTop:4}}>
          "THE HONEY BADGERS" · BRFA DIV 1
        </div>
      </div>

      <div style={{padding:"clamp(18px,5vw,28px) clamp(16px,4vw,20px)"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:"clamp(20px,6vw,26px)",color:NAVY,marginBottom:6}}>
          ARE YOU A MEMBER?
        </div>
        <div style={{fontSize:14,color:MGRAY,marginBottom:22,lineHeight:1.6}}>
          The Honey Badger members get early ticket access, exclusive discounts, and more.
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Btn onClick={()=>{reset();setMode("login")}}
            bg={`linear-gradient(135deg,${GOLD},${GOLD2})`} color={NAVY}>
            ✔ YES — LOG IN TO MY ACCOUNT
          </Btn>
          <Btn onClick={()=>{reset();setMode("signup")}} bg={NAVY} color={WHITE}>
            🆕 NO — JOIN THE HONEY BADGERS
          </Btn>
          <Btn onClick={onGuest} bg={WHITE} color={MGRAY} sx={{border:`1.5px solid #ddd`}}>
            Continue as Guest
          </Btn>
        </div>

        <div style={{marginTop:22,borderRadius:14,background:LGRAY,padding:"16px 16px"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:13,color:NAVY,marginBottom:10}}>HONEY BADGER BENEFITS</div>
          {["10% off match-day tickets","5% off online store",
            "Early ticket access","Exclusive kit number"].map((b,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
              <span style={{color:GOLD,fontWeight:800,fontSize:15}}>✔</span>
              <span style={{fontSize:13,color:"#444"}}>{b}</span>
            </div>
          ))}
          <div style={{marginTop:14,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:20,color:NAVY}}>P20<span style={{fontSize:12,fontWeight:600}}>/mo</span></span>
            <span style={{color:MGRAY,fontSize:11}}>or</span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:20,color:NAVY}}>P200<span style={{fontSize:12,fontWeight:600}}>/yr</span></span>
            <span style={{background:GREEN,color:WHITE,fontSize:9,fontWeight:900,
              padding:"2px 7px",borderRadius:3}}>SAVE 17%</span>
          </div>
        </div>
      </div>
    </div>
  )

  const isLogin=mode==="login"
  return (
    <div style={{flex:1,overflowY:"auto",background:WHITE,WebkitOverflowScrolling:"touch"}}>
      <div style={{background:`linear-gradient(160deg,${NAVY},#0a1428)`,
        padding:"clamp(14px,4vw,20px)",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>{reset();setMode("ask")}} style={{
          background:"none",border:"none",color:GOLD,fontSize:28,
          cursor:"pointer",lineHeight:1,padding:"0 4px",minHeight:44,
          WebkitTapHighlightColor:"transparent"}}>‹</button>
        <Logo size={32}/>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:"clamp(14px,4.5vw,18px)",color:WHITE}}>
            {isLogin?"WELCOME BACK":"JOIN THE HONEY BADGERS"}
          </div>
          <div style={{fontSize:11,color:"#aaa"}}>
            {isLogin?"Log in to your account":"Create your membership account"}
          </div>
        </div>
      </div>

      <div style={{padding:"clamp(18px,5vw,24px) clamp(16px,4vw,20px)"}}>
        {!isLogin&&(
          <Field label="FULL NAME" placeholder="e.g. Kgopotso Ntshele"
            value={name} onChange={e=>setName(e.target.value)} autoComplete="name"/>
        )}
        <Field label="EMAIL" type="email" placeholder="you@email.com"
          value={email} onChange={e=>setEmail(e.target.value)}
          autoComplete={isLogin?"email":"username"}/>
        <Field label="PASSWORD" type="password"
          placeholder={isLogin?"Enter your password":"Min. 6 characters"}
          value={password} onChange={e=>setPass(e.target.value)}
          autoComplete={isLogin?"current-password":"new-password"}/>

        {error&&(
          <div style={{background:"#fef2f2",border:`1px solid #fecaca`,borderRadius:8,
            padding:"10px 14px",color:RED,fontSize:13,marginBottom:16,fontWeight:600,lineHeight:1.5}}>
            {error}
          </div>
        )}

        <Btn onClick={handleAuth} disabled={loading}>
          {loading?"PLEASE WAIT...":isLogin?"LOG IN →":"CREATE ACCOUNT →"}
        </Btn>

        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:MGRAY}}>
          {isLogin?"Not a member? ":"Already have an account? "}
          <span onClick={()=>{reset();setMode(isLogin?"signup":"login")}}
            style={{color:NAVY,fontWeight:700,cursor:"pointer"}}>
            {isLogin?"Join The Honey Badgers":"Log in"}
          </span>
        </div>

        {!isLogin&&(
          <div style={{marginTop:16,fontSize:11,color:MGRAY,textAlign:"center",lineHeight:1.7}}>
            By creating an account you agree to our Terms & Privacy Policy.<br/>
            Membership: P20/month or P200/year.
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   PROFILE
══════════════════════════════════════════════════════════════════════════════ */
const ProfileScreen=({session,profile,onLogout,goToAuth})=>{
  const benefits=[
    {title:"EARLY ACCESS TO TICKETS",sub:"Exclusive 48hr pre-sale"},
    {title:"MATCH TICKETS",          sub:"10% off"},
    {title:"ONLINE STORE",           sub:"5% off merch"},
    {title:"LIVE MATCH STREAMS",     sub:"Exclusive access"},
  ]

  if(!session) return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",background:WHITE,padding:"clamp(20px,5vw,32px)"}}>
      <Logo size={70}/>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
        fontSize:"clamp(18px,5vw,22px)",color:NAVY,marginTop:14,textAlign:"center"}}>
        YOUR HONEY BADGER PROFILE
      </div>
      <div style={{fontSize:13,color:MGRAY,textAlign:"center",margin:"8px 0 28px",
        lineHeight:1.6,maxWidth:280}}>
        Log in or join to access your membership, benefits, and exclusive content.
      </div>
      <div style={{width:"100%",maxWidth:320}}>
        <Btn onClick={goToAuth}>LOG IN / JOIN →</Btn>
      </div>
    </div>
  )

  const displayName=profile?.full_name||
    session.user.email?.split("@")[0].toUpperCase()||"FAN"

  return (
    <div style={{flex:1,overflowY:"auto",background:WHITE,WebkitOverflowScrolling:"touch"}}>
      <div style={{textAlign:"center",padding:"clamp(18px,5vw,24px) 20px 14px"}}>
        <div style={{width:80,height:80,borderRadius:"50%",margin:"0 auto 12px",
          background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
          border:`3px solid ${NAVY}`,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="8" r="4"/>
          </svg>
        </div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",
          fontSize:"clamp(20px,6vw,26px)",fontWeight:900,color:NAVY}}>{displayName}</div>
        <div style={{display:"inline-block",
          background:profile?.is_member?NAVY:"#ddd",
          color:profile?.is_member?GOLD:MGRAY,
          padding:"4px 18px",borderRadius:20,marginTop:8,
          fontSize:12,fontWeight:800,
          fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.1em"}}>
          {profile?.is_member?"🦡 HONEY BADGER MEMBER":"FREE FAN"}
        </div>
      </div>

      {profile?.is_member&&(
        <div style={{padding:"0 14px 8px"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
            color:MGRAY,fontSize:11,letterSpacing:"0.08em",marginBottom:10}}>YOUR BENEFITS</div>
          {benefits.map((b,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:8,
              padding:"10px 12px",borderRadius:12,background:LGRAY}}>
              <div style={{width:48,height:48,borderRadius:10,flexShrink:0,
                background:`linear-gradient(135deg,${NAVY},#1a3060)`,
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Logo size={34}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:"clamp(11px,3.5vw,13px)",color:NAVY}}>{b.title}</div>
                <div style={{fontSize:12,color:MGRAY,marginTop:1}}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{padding:"8px 14px 0"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
          color:MGRAY,fontSize:11,letterSpacing:"0.08em",marginBottom:8}}>ACCOUNT</div>
        <div style={{padding:"12px 4px",borderBottom:`1px solid #eee`}}>
          <div style={{fontSize:11,color:MGRAY}}>EMAIL</div>
          <div style={{fontSize:14,color:NAVY,marginTop:2}}>{session.user.email}</div>
        </div>
        <div style={{padding:"12px 4px",borderBottom:`1px solid #eee`}}>
          <div style={{fontSize:11,color:MGRAY}}>MEMBERSHIP</div>
          <div style={{fontSize:14,color:NAVY,marginTop:2}}>
            {profile?.is_member?"🦡 Honey Badger Premium":"Free Fan · Upgrade to Honey Badger"}
          </div>
        </div>
      </div>

      <div style={{padding:"12px 14px 0"}}>
        {["Notification Settings","Privacy Policy","Legal Terms"].map((l,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:14,
            padding:"14px 4px",borderBottom:`1px solid #eee`,minHeight:50}}>
            <span style={{flex:1,fontSize:14,color:NAVY}}>{l}</span>
            <span style={{color:MGRAY,fontSize:18}}>›</span>
          </div>
        ))}
      </div>

      <div style={{padding:"24px 0",textAlign:"center"}}>
        <span onClick={onLogout} style={{color:RED,fontWeight:700,fontSize:15,
          fontFamily:"'Barlow Condensed',sans-serif",cursor:"pointer"}}>Log Out</span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════════════════ */
export default function App(){
  const [activeTab,setActiveTab]=useState("foryou")
  const [session,  setSession]  =useState(null)
  const [profile,  setProfile]  =useState(null)
  const [showAuth, setShowAuth] =useState(false)
  const [fixtures, setFixtures] =useState([])
  const [booting,  setBooting]  =useState(true)

  useEffect(()=>{
    // Handle email confirmation redirect — Supabase puts token in URL hash
    supabase.auth.getSession().then(({data:{session}})=>{
      setSession(session)
      setBooting(false)
    })
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      setSession(session)
      // SIGNED_IN fires when email link is clicked and user lands on site
      if(event==="SIGNED_IN"&&session){
        setActiveTab("profile")
        setShowAuth(false)
      }
    })
    return ()=>subscription.unsubscribe()
  },[])

  useEffect(()=>{
    if(session){
      supabase.from("profiles").select("*").eq("id",session.user.id).single()
        .then(({data})=>{ if(data) setProfile(data) })
    } else { setProfile(null) }
  },[session])

  useEffect(()=>{
    supabase.from("fixtures").select("*").order("match_date")
      .then(({data})=>{ if(data) setFixtures(data) })
  },[])

  const handleLogout=async()=>{
    await supabase.auth.signOut()
    setSession(null); setProfile(null); setActiveTab("foryou")
  }

  const goToAuth=()=>setShowAuth(true)

  if(booting) return (
    <div style={{minHeight:"100vh",minHeight:"100dvh",
      background:`linear-gradient(160deg,${NAVY},#0a1020)`,
      display:"flex",alignItems:"center",justifyContent:"center"}}>
      <Logo size={60}/>
    </div>
  )

  const HEADER_LABELS={foryou:null,calendar:"CALENDAR",clips:null,store:"STORE",profile:null}
  const hdr=HEADER_LABELS[activeTab]

  const renderScreen=()=>{
    if(showAuth) return <AuthScreen
      onSuccess={()=>{setShowAuth(false);setActiveTab("profile")}}
      onGuest={()=>setShowAuth(false)}/>
    switch(activeTab){
      case "foryou":   return <ForYouScreen userEmail={session?.user?.email} goToAuth={goToAuth}/>
      case "calendar": return <CalendarScreen/>
      case "clips":    return <ClipsScreen/>
      case "store":    return <StoreScreen goToAuth={goToAuth} fixtures={fixtures}/>
      case "profile":  return <ProfileScreen session={session} profile={profile}
                         onLogout={handleLogout} goToAuth={goToAuth}/>
      default:         return <ForYouScreen goToAuth={goToAuth}/>
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{display:none}
        html{-webkit-text-size-adjust:100%}
        body{
          background:#0D1B3E;
          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
          min-height:100vh;
          min-height:100dvh;
          -webkit-font-smoothing:antialiased;
        }
        input,button{font-family:inherit}
        input{-webkit-appearance:none;appearance:none}

        .app-root{
          display:flex;
          flex-direction:column;
          min-height:100vh;
          min-height:100dvh;
          background:linear-gradient(160deg,${NAVY} 0%,#0a1020 100%);
        }
        .app-strip{
          padding:14px 16px 8px;
          display:flex;
          align-items:center;
          gap:12px;
        }
        .phone-frame{
          flex:1;
          display:flex;
          flex-direction:column;
          background:#fff;
          overflow:hidden;
          position:relative;
        }
        @media(min-width:520px){
          .app-root{
            align-items:center;
            padding:16px 0 24px;
          }
          .app-strip,.phone-frame{
            width:100%;
            max-width:430px;
          }
          .phone-frame{
            flex:none;
            height:760px;
            border-radius:38px;
            border:7px solid #1c1c1c;
            box-shadow:0 28px 70px rgba(0,0,0,0.75),inset 0 0 0 1px rgba(255,255,255,0.07);
          }
        }
      `}</style>

      <div className="app-root">
        <div className="app-strip">
          <Logo size={38}/>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:"clamp(15px,4.5vw,18px)",color:WHITE,letterSpacing:"0.05em"}}>
              VILLAREAL FC
            </div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:"clamp(9px,2.5vw,11px)",color:GOLD,fontWeight:700,letterSpacing:"0.05em"}}>
              "THE HONEY BADGERS" · BRFA DIVISION ONE
            </div>
          </div>
        </div>

        <div className="phone-frame">
          {/* Status bar */}
          <div style={{
            background:activeTab==="clips"||showAuth?"#000":WHITE,
            padding:"9px 18px 6px",display:"flex",justifyContent:"space-between",
            alignItems:"center",flexShrink:0}}>
            <span style={{fontSize:12,fontWeight:700,
              color:activeTab==="clips"||showAuth?WHITE:NAVY}}>11:03</span>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <span style={{fontSize:11,color:activeTab==="clips"||showAuth?WHITE:NAVY}}>4G ▪▪▪</span>
              <span style={{fontSize:10,background:GOLD,color:NAVY,
                padding:"1px 5px",borderRadius:3,fontWeight:800}}>34</span>
            </div>
          </div>

          {/* Section header */}
          {hdr&&!showAuth&&(
            <div style={{padding:"8px 16px",background:WHITE,display:"flex",
              alignItems:"center",justifyContent:"space-between",
              borderBottom:`1px solid #eee`,flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Logo size={28}/>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:"clamp(16px,5vw,20px)",color:NAVY}}>{hdr}</span>
              </div>
              {activeTab==="calendar"&&(
                <button style={{background:LGRAY,border:`1px solid #ddd`,borderRadius:20,
                  padding:"6px 14px",fontSize:12,fontWeight:700,color:NAVY,cursor:"pointer",
                  fontFamily:"'Barlow Condensed',sans-serif",minHeight:36}}>
                  FIRST TEAM ▾
                </button>
              )}
            </div>
          )}

          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            {renderScreen()}
          </div>

          {!showAuth&&<BottomNav active={activeTab} setActive={setActiveTab}/>}

          <div style={{background:activeTab==="clips"?"#000":WHITE,
            paddingBottom:4,paddingTop:3,display:"flex",justifyContent:"center",flexShrink:0}}>
            <div style={{width:110,height:4,background:"#ddd",borderRadius:2}}/>
          </div>
        </div>

        <div style={{textAlign:"center",padding:"10px 0 0",display:"none"}}
          className="desktop-footer">
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",color:"#444",
            fontSize:11,letterSpacing:"0.06em"}}>
            BOTETI REGIONAL FA · DIVISION ONE 2026/27
          </span>
        </div>
      </div>
    </>
  )
}
