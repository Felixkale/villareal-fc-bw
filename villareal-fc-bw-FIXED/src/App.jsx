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

const Btn = ({ children, onClick, bg=GOLD, color=NAVY, disabled, style:sx={}, sx:sxExtra={} }) => (
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
    paddingBottom:"env(safe-area-inset-bottom, 8px)", paddingTop:6,
    flexShrink:0, position:"sticky", bottom:0, zIndex:50,
    boxShadow:"0 -2px 12px rgba(0,0,0,0.08)" }}>
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
const ForYouScreen = ({ userEmail, goToAuth, session, openMembership }) => {
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
        <button onClick={session?undefined:goToAuth} style={{width:42,height:42,borderRadius:"50%",flexShrink:0,
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
const StoreScreen=({goToAuth,fixtures,openMembership})=>{
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
            <Btn onClick={()=>{
              // If logged in open membership page directly, else go to auth
              if(typeof openMembership === 'function') openMembership()
              else goToAuth()
            }} bg={GOLD} color={NAVY}>
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
const ProfileScreen=({session,profile,onLogout,goToAuth,openMembership})=>{
  const benefits=[
    {
      title:"EARLY ACCESS TO TICKETS",
      sub:"Exclusive 48hr pre-sale",
      emoji:"🎟️",
      bg:"linear-gradient(135deg,#1a3a6e,#0d2244)",
    },
    {
      title:"MATCH DAY TICKETS",
      sub:"10% off every match",
      emoji:"⚽",
      bg:"linear-gradient(135deg,#1e4d2b,#0d2a18)",
    },
    {
      title:"OFFICIAL STORE",
      sub:"5% off all merch",
      emoji:"👕",
      bg:"linear-gradient(135deg,#4a2000,#2a1200)",
    },
    {
      title:"LIVE MATCH STREAMS",
      sub:"Exclusive access",
      emoji:"📺",
      bg:"linear-gradient(135deg,#2a0d4a,#180830)",
    },
    {
      title:"MEMBER KIT NUMBER",
      sub:"Your exclusive squad number",
      emoji:"🏆",
      bg:"linear-gradient(135deg,#3a1a00,#1a0d00)",
    },
  ]

  const settings=[
    {icon:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z", label:"Personal Information"},
    {icon:"M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0", label:"Notification Settings"},
    {icon:"M12 2a10 10 0 100 20A10 10 0 0012 2z M8 12h8 M12 8v8", label:"Cookie Settings"},
    {icon:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", label:"Are you a member?"},
  ]

  /* ── NOT LOGGED IN ── */
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

  const displayName=(profile?.full_name||session.user.email?.split("@")[0]||"FAN").toUpperCase()
  const initials=displayName.split(" ").map(w=>w[0]).join("").slice(0,2)
  const isMember=profile?.is_member

  return (
    <div style={{flex:1,overflowY:"auto",background:"#f5f6fa",WebkitOverflowScrolling:"touch",
      scrollBehavior:"smooth"}}>

      {/* ── HERO CARD ── */}
      <div style={{
        background:`linear-gradient(160deg,${NAVY} 0%,#1a3060 60%,#0d2244 100%)`,
        padding:"28px 20px 0",position:"relative",overflow:"hidden",
      }}>
        {/* Watermark */}
        <div style={{position:"absolute",right:-30,top:-30,opacity:0.06}}>
          <Logo size={200}/>
        </div>

        {/* Avatar */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:16}}>
          <div style={{
            width:88,height:88,borderRadius:"50%",
            background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
            border:`3px solid ${GOLD}`,
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 8px 24px rgba(0,0,0,0.4)",
            marginBottom:12,position:"relative",
          }}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:32,color:NAVY}}>{initials}</span>
            {/* Online dot */}
            <div style={{position:"absolute",bottom:4,right:4,width:14,height:14,
              borderRadius:"50%",background:"#27AE60",border:`2px solid ${NAVY}`}}/>
          </div>

          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:"clamp(22px,6vw,28px)",color:WHITE,letterSpacing:"0.04em",
            textAlign:"center",lineHeight:1}}>
            {displayName}
          </div>

          {/* Member badge */}
          <div style={{
            marginTop:8,
            display:"inline-flex",alignItems:"center",gap:6,
            background:isMember?GOLD:"rgba(255,255,255,0.15)",
            color:isMember?NAVY:WHITE,
            padding:"5px 16px",borderRadius:20,
            fontSize:11,fontWeight:900,
            fontFamily:"'Barlow Condensed',sans-serif",
            letterSpacing:"0.12em",
          }}>
            {isMember?"🦡 HONEY BADGER MEMBER":"FREE FAN"}
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display:"grid",gridTemplateColumns:"1fr 1fr 1fr",
          background:"rgba(255,255,255,0.07)",
          borderRadius:"12px 12px 0 0",
          padding:"14px 0",marginTop:4,
        }}>
          {[
            {label:"SEASON",    value:"2026/27"},
            {label:"STATUS",    value:isMember?"MEMBER":"FAN"},
            {label:"DIVISION",  value:"BRFA D1"},
          ].map((s,i)=>(
            <div key={i} style={{textAlign:"center",
              borderRight:i<2?`1px solid rgba(255,255,255,0.1)`:"none",
              padding:"0 8px"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:"clamp(13px,4vw,16px)",color:GOLD,lineHeight:1}}>{s.value}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",
                fontFamily:"'Barlow Condensed',sans-serif",
                letterSpacing:"0.08em",marginTop:3}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── UPGRADE BANNER (non-members only) ── */}
      {!isMember&&(
        <div style={{margin:"12px 14px 0"}}>
          <button onClick={openMembership} style={{
            width:"100%",padding:"14px 16px",
            background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
            border:"none",borderRadius:12,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"space-between",
            WebkitTapHighlightColor:"transparent",
            boxShadow:"0 4px 14px rgba(245,197,24,0.3)",
          }}>
            <div style={{textAlign:"left"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:16,color:NAVY}}>UPGRADE TO HONEY BADGER</div>
              <div style={{fontSize:12,color:"rgba(13,27,62,0.7)",marginTop:1}}>
                P20/month or P200/year · Save 17%
              </div>
            </div>
            <div style={{background:NAVY,borderRadius:8,padding:"6px 14px",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:13,color:GOLD,flexShrink:0}}>JOIN →</div>
          </button>
        </div>
      )}

      {/* ── BENEFITS (members only) ── */}
      {isMember&&(
        <div style={{padding:"16px 14px 4px"}}>
          <div style={{display:"flex",justifyContent:"space-between",
            alignItems:"center",marginBottom:10}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:11,color:MGRAY,letterSpacing:"0.1em"}}>BENEFITS</div>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
              fontSize:12,color:NAVY,cursor:"pointer"}}>See all</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {benefits.map((b,i)=>(
              <div key={i} style={{
                display:"flex",alignItems:"center",gap:12,
                background:WHITE,borderRadius:14,overflow:"hidden",
                boxShadow:"0 1px 6px rgba(0,0,0,0.06)",
              }}>
                {/* Coloured icon tile */}
                <div style={{
                  width:60,height:60,flexShrink:0,
                  background:b.bg,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:24,
                }}>
                  {b.emoji}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                    fontSize:"clamp(12px,3.5vw,14px)",color:NAVY}}>{b.title}</div>
                  <div style={{fontSize:12,color:MGRAY,marginTop:2}}>{b.sub}</div>
                </div>
                <div style={{paddingRight:14,color:"#ccc",fontSize:20,
                  fontWeight:300,flexShrink:0}}>···</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ACCOUNT INFO ── */}
      <div style={{margin:"16px 14px 0",background:WHITE,borderRadius:14,
        overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
        <div style={{padding:"10px 14px 6px",
          borderBottom:`1px solid #f0f0f0`}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.1em"}}>ACCOUNT</div>
        </div>
        <div style={{padding:"12px 14px",borderBottom:`1px solid #f0f0f0`}}>
          <div style={{fontSize:11,color:MGRAY,fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:600,letterSpacing:"0.06em"}}>EMAIL</div>
          <div style={{fontSize:14,color:NAVY,marginTop:3,fontWeight:600}}>
            {session.user.email}
          </div>
        </div>
        <div style={{padding:"12px 14px"}}>
          <div style={{fontSize:11,color:MGRAY,fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:600,letterSpacing:"0.06em"}}>MEMBERSHIP</div>
          <div style={{fontSize:14,color:isMember?GREEN:MGRAY,marginTop:3,fontWeight:600}}>
            {isMember?"🦡 Honey Badger Premium — Active":"Free Fan · Upgrade to Honey Badger"}
          </div>
        </div>
      </div>

      {/* ── SETTINGS ── */}
      <div style={{margin:"14px 14px 0",background:WHITE,borderRadius:14,
        overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
        <div style={{padding:"10px 14px 6px",borderBottom:`1px solid #f0f0f0`}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.1em"}}>SETTINGS</div>
        </div>
        {settings.map((s,i)=>(
          <div key={i} onClick={s.action||undefined} style={{display:"flex",alignItems:"center",gap:14,
            padding:"14px 14px",minHeight:52,
            borderBottom:i<settings.length-1?`1px solid #f0f0f0`:"none",
            cursor:s.action?"pointer":"default"}}>
            <div style={{width:34,height:34,borderRadius:9,flexShrink:0,
              background:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ico d={s.icon} stroke={NAVY} sw={1.6} size={18}/>
            </div>
            <span style={{flex:1,fontSize:14,color:NAVY,fontWeight:500}}>{s.label}</span>
            <span style={{color:"#ccc",fontSize:18}}>›</span>
          </div>
        ))}
      </div>

      {/* ── LEGAL ── */}
      <div style={{margin:"14px 14px 0",background:WHITE,borderRadius:14,
        overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
        <div style={{padding:"10px 14px 6px",borderBottom:`1px solid #f0f0f0`}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.1em"}}>LEGAL</div>
        </div>
        {["Privacy Policy","Legal Terms"].map((l,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:14,
            padding:"14px 14px",minHeight:52,cursor:"pointer",
            borderBottom:i===0?`1px solid #f0f0f0`:"none"}}>
            <div style={{width:34,height:34,borderRadius:9,flexShrink:0,
              background:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={NAVY} sw={1.6} size={18}/>
            </div>
            <span style={{flex:1,fontSize:14,color:NAVY,fontWeight:500}}>{l}</span>
            <span style={{color:"#ccc",fontSize:18}}>›</span>
          </div>
        ))}
      </div>

      {/* ── APP VERSION + LOGOUT ── */}
      <div style={{padding:"24px 0 16px",textAlign:"center"}}>
        <span onClick={onLogout} style={{color:RED,fontWeight:700,fontSize:15,
          fontFamily:"'Barlow Condensed',sans-serif",cursor:"pointer",
          display:"block",marginBottom:8}}>Log Out</span>
        <div style={{fontSize:11,color:"#ccc",marginTop:4}}>
          Villareal FC · Season 2026/27
        </div>
        <div style={{fontSize:10,color:"#ddd",marginTop:2}}>
          APP VERSION 1.0.0
        </div>
      </div>

    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   MEMBERSHIP PAGE — 3 tiers, age pricing, ID verification
══════════════════════════════════════════════════════════════════════════════ */

const PLANS = [
  {
    id: "free",
    name: "PREMIUM FREE",
    emoji: "🆓",
    color: "#4a5568",
    colorLight: "#f7f8fa",
    border: "#e2e8f0",
    prices: { adult_monthly:0, adult_yearly:0, youth_monthly:0, youth_yearly:0, infant:0 },
    benefits: [
      "Club news & match updates",
      "Access to fixtures & standings",
      "Clips & highlights",
      "Early store notifications",
    ],
    cta: "JOIN FREE",
    popular: false,
  },
  {
    id: "global_fan",
    name: "GLOBAL FAN",
    emoji: "🌍",
    color: NAVY,
    colorLight: "#eef1f8",
    border: NAVY,
    prices: { adult_monthly:20, adult_yearly:200, youth_monthly:15, youth_yearly:150, infant:0 },
    benefits: [
      "Everything in Free",
      "10% off match-day tickets",
      "5% off official store",
      "Early ticket access",
      "Exclusive kit number",
      "Priority squad updates",
    ],
    cta: "JOIN GLOBAL FAN",
    popular: true,
  },
  {
    id: "honey_badger",
    name: "HONEY BADGER",
    emoji: "🦡",
    color: GOLD2,
    colorLight: "#fffbea",
    border: GOLD,
    prices: { adult_monthly:50, adult_yearly:500, youth_monthly:null, youth_yearly:null, infant:null },
    adultsOnly: true,
    benefits: [
      "Everything in Global Fan",
      "20% off match-day tickets",
      "10% off official store",
      "Exclusive 48hr pre-sale",
      "Digital membership card",
      "Vote in club decisions",
      "Exclusive member events",
      "Free entry to home matches",
    ],
    cta: "JOIN HONEY BADGER",
    popular: false,
  },
]

const AGE_GROUPS = [
  { id:"infant",  label:"Infant (0–5)",   desc:"Free on all plans" },
  { id:"youth",   label:"Youth (6–17)",   desc:"P15/month on paid plans" },
  { id:"adult",   label:"Adult (18+)",    desc:"Standard pricing" },
]

const ID_TYPES = [
  { id:"omang",    label:"Omang (National ID)", sides:1, icon:"🪪" },
  { id:"passport", label:"Passport",            sides:1, icon:"📗" },
  { id:"license",  label:"Driver's License",    sides:2, icon:"🚗" },
]

const MembershipPage = ({ session, onClose, onSuccess }) => {
  const [step,      setStep]      = useState(1)  // 1=plans, 2=age, 3=details, 4=verify, 5=done
  const [plan,      setPlan]      = useState(null)
  const [billing,   setBilling]   = useState("monthly")
  const [ageGroup,  setAgeGroup]  = useState(null)
  const [dob,       setDob]       = useState("")
  const [fullName,  setFullName]  = useState("")
  const [idType,    setIdType]    = useState(null)
  const [idFront,   setIdFront]   = useState(null)
  const [idBack,    setIdBack]    = useState(null)
  const [selfie,    setSelfie]    = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState("")

  const needsVerification = ageGroup === "adult"
  const selectedPlan = PLANS.find(p => p.id === plan)

  const getPrice = (p) => {
    if (!p) return 0
    if (ageGroup === "infant") return 0
    const key = `${ageGroup||"adult"}_${billing}`
    return p.prices[key] || 0
  }

  const getYearlySavings = (p) => {
    if (!p || ageGroup === "infant") return 0
    const monthly = p.prices[`${ageGroup||"adult"}_monthly`]
    const yearly  = p.prices[`${ageGroup||"adult"}_yearly`]
    return monthly * 12 - yearly
  }

  // Camera capture helper
  const capturePhoto = (setter) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.capture = "environment"
    input.onchange = e => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = ev => setter(ev.target.result)
      reader.readAsDataURL(file)
    }
    input.click()
  }

  const captureSelfie = (setter) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.capture = "user"
    input.onchange = e => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = ev => setter(ev.target.result)
      reader.readAsDataURL(file)
    }
    input.click()
  }

  const handleSubmit = async () => {
    if (!session) {
      // Should never happen since we check session before opening, but just in case
      onClose()
      return
    }
    setLoading(true); setError("")
    try {
      // Save membership application to Supabase
      const { error: err } = await supabase.from("membership_applications").insert({
        user_id:        session.user.id,
        email:          session.user.email,
        full_name:      fullName || session.user.email,
        plan_id:        plan,
        billing_cycle:  billing,
        age_group:      ageGroup,
        dob:            dob || null,
        id_type:        idType,
        id_front_url:   idFront ? "uploaded" : null,
        id_back_url:    idBack  ? "uploaded" : null,
        selfie_url:     selfie  ? "uploaded" : null,
        status:         needsVerification ? "pending" : "active",
        created_at:     new Date().toISOString(),
      })
      if (err) throw err

      // Update profile membership status
      await supabase.from("profiles").update({
        is_member:     plan !== "free",
        billing_cycle: billing,
        member_since:  new Date().toISOString(),
      }).eq("id", session.user.id)

      setStep(5)
      if (onSuccess) onSuccess()
    } catch(e) {
      setError(e.message || "Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  /* ── STEP INDICATOR ── */
  const StepBar = () => (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",
      gap:6,padding:"12px 20px",background:"#f8f9fb",borderBottom:`1px solid #eee`}}>
      {[1,2,3,needsVerification?4:null,needsVerification?5:4].filter(Boolean).map((s,i,arr)=>(
        <div key={s} style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{
            width:28,height:28,borderRadius:"50%",
            background:step>=s?NAVY:"#e5e7eb",
            display:"flex",alignItems:"center",justifyContent:"center",
            transition:"background 0.2s",
          }}>
            <span style={{fontSize:12,fontWeight:800,
              color:step>=s?WHITE:MGRAY,
              fontFamily:"'Barlow Condensed',sans-serif"}}>
              {step>s?"✓":s}
            </span>
          </div>
          {i<arr.length-1&&(
            <div style={{width:20,height:2,
              background:step>s?NAVY:"#e5e7eb",
              borderRadius:1,transition:"background 0.2s"}}/>
          )}
        </div>
      ))}
    </div>
  )

  /* ── STEP 1: CHOOSE PLAN ── */
  const Step1 = () => (
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",minHeight:0}}>
      <div style={{background:`linear-gradient(160deg,${NAVY},#1a3060)`,
        padding:"20px 20px 16px",textAlign:"center"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:26,color:WHITE}}>CHOOSE YOUR PLAN</div>
        <div style={{fontSize:12,color:"#aab4cc",marginTop:4}}>
          Villareal FC "The Yellow Submarine" · Season 2026/27
        </div>
        {/* Billing toggle */}
        <div style={{display:"flex",background:"rgba(255,255,255,0.1)",
          borderRadius:10,padding:3,marginTop:14,maxWidth:280,margin:"14px auto 0"}}>
          {["monthly","yearly"].map(b=>(
            <button key={b} onClick={()=>setBilling(b)} style={{
              flex:1,padding:"8px 0",minHeight:38,
              background:billing===b?WHITE:"none",
              border:"none",borderRadius:8,cursor:"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:12,color:billing===b?NAVY:"#aaa",
              WebkitTapHighlightColor:"transparent",
              display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
              {b.toUpperCase()}
              {b==="yearly"&&<span style={{background:GREEN,color:WHITE,fontSize:8,
                fontWeight:900,padding:"1px 4px",borderRadius:3}}>-17%</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:"16px 14px 24px",display:"flex",flexDirection:"column",gap:12}}>
        {PLANS.map(p=>(
          <div key={p.id} onClick={()=>setPlan(p.id)} style={{
            borderRadius:16,overflow:"hidden",
            border:`2px solid ${plan===p.id?p.border:"#e5e7eb"}`,
            background:plan===p.id?p.colorLight:WHITE,
            cursor:"pointer",WebkitTapHighlightColor:"transparent",
            boxShadow:plan===p.id?`0 4px 20px rgba(0,0,0,0.12)`:"0 1px 4px rgba(0,0,0,0.06)",
            transition:"all 0.2s",position:"relative",
          }}>
            {p.popular&&(
              <div style={{position:"absolute",top:12,right:12,
                background:GOLD,color:NAVY,fontSize:9,fontWeight:900,
                padding:"2px 8px",borderRadius:20,
                fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em"}}>
                MOST POPULAR
              </div>
            )}
            {/* Plan header */}
            <div style={{padding:"16px 16px 12px",
              borderBottom:`1px solid ${plan===p.id?p.border+"44":"#f0f0f0"}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:24}}>{p.emoji}</span>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:900,fontSize:18,color:plan===p.id?p.color:NAVY}}>
                  {p.name}
                </div>
                {plan===p.id&&(
                  <div style={{marginLeft:"auto",width:22,height:22,borderRadius:"50%",
                    background:p.color,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{color:WHITE,fontSize:12}}>✓</span>
                  </div>
                )}
              </div>
              {/* Price */}
              <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                {p.prices.adult_monthly===0?(
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                    fontWeight:900,fontSize:28,color:GREEN}}>FREE</span>
                ):(
                  <>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                      fontWeight:900,fontSize:28,color:p.color}}>
                      P{billing==="monthly"?p.prices.adult_monthly:p.prices.adult_yearly}
                    </span>
                    <span style={{fontSize:12,color:MGRAY}}>
                      /{billing==="monthly"?"mo":"yr"}
                    </span>
                    {billing==="yearly"&&getYearlySavings(p)>0&&(
                      <span style={{background:"#dcfce7",color:GREEN,fontSize:10,
                        fontWeight:700,padding:"1px 6px",borderRadius:4,marginLeft:4}}>
                        Save P{getYearlySavings(p)}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div style={{fontSize:11,color:MGRAY,marginTop:2}}>
                {p.adultsOnly
                  ? <span style={{color:RED,fontWeight:700}}>⚠ Adults 18+ only · ID verification required</span>
                  : <>Youth (6-17): {p.prices.youth_monthly===0?"Free":`P${billing==="monthly"?p.prices.youth_monthly:p.prices.youth_yearly}/${billing==="monthly"?"mo":"yr"}`}{" · "}Infant (0-5): Free</>
                }
              </div>
            </div>
            {/* Benefits */}
            <div style={{padding:"10px 16px 14px"}}>
              {p.benefits.map((b,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,
                  padding:"4px 0",borderBottom:i<p.benefits.length-1?`1px solid #f8f8f8`:"none"}}>
                  <span style={{color:p.color,fontSize:13,flexShrink:0}}>✔</span>
                  <span style={{fontSize:13,color:"#444",lineHeight:1.3}}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{padding:"0 14px 24px"}}>
        <Btn onClick={()=>{ if(plan) setStep(2) }}
          disabled={!plan} bg={plan?NAVY:null}>
          CONTINUE →
        </Btn>
      </div>
    </div>
  )

  /* ── STEP 2: AGE GROUP ── */
  const Step2 = () => {
    // Auto-select adult if Honey Badger (adults only plan)
    useEffect(()=>{
      if(selectedPlan?.adultsOnly && ageGroup !== "adult") {
        setAgeGroup("adult")
      }
    },[])

    return (
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",
      padding:"20px 14px"}}>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
        fontSize:22,color:NAVY,marginBottom:4}}>SELECT AGE GROUP</div>
      <div style={{fontSize:13,color:MGRAY,marginBottom:selectedPlan?.adultsOnly?12:20,lineHeight:1.6}}>
        Pricing is based on the member's age. Under 16s don't need ID verification.
      </div>
      {selectedPlan?.adultsOnly&&(
        <div style={{background:"#fef2f2",border:`1px solid #fecaca`,borderRadius:10,
          padding:"12px 14px",marginBottom:16,
          display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20,flexShrink:0}}>🦡</span>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:13,color:RED,marginBottom:2}}>HONEY BADGER — ADULTS ONLY</div>
            <div style={{fontSize:12,color:"#7f1d1d",lineHeight:1.5}}>
              This plan is exclusively for members aged 18 and above.
              ID verification is mandatory.
            </div>
          </div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
        {AGE_GROUPS.map(ag=>{
          const isHB = selectedPlan?.adultsOnly
          const locked = isHB && ag.id !== "adult"
          return (
          <div key={ag.id} onClick={()=>{ if(!locked) setAgeGroup(ag.id) }} style={{
            padding:"16px",borderRadius:14,
            cursor:locked?"not-allowed":"pointer",
            border:`2px solid ${ageGroup===ag.id?NAVY:locked?"#f0f0f0":"#e5e7eb"}`,
            background:ageGroup===ag.id?"#eef1f8":locked?"#fafafa":WHITE,
            display:"flex",alignItems:"center",justifyContent:"space-between",
            WebkitTapHighlightColor:"transparent",
            opacity:locked?0.45:1,
          }}>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:16,color:locked?MGRAY:NAVY}}>
                {ag.label}
                {locked&&<span style={{fontSize:11,color:RED,marginLeft:6,fontWeight:700}}>
                  NOT AVAILABLE
                </span>}
              </div>
              <div style={{fontSize:12,color:MGRAY,marginTop:2}}>
                {locked?"Honey Badger is for Adults 18+ only":ag.desc}
              </div>
            </div>
            <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,
              border:`2px solid ${ageGroup===ag.id?NAVY:"#ddd"}`,
              background:ageGroup===ag.id?NAVY:"none",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              {ageGroup===ag.id&&<span style={{color:WHITE,fontSize:12}}>✓</span>}
              {locked&&<span style={{color:"#ddd",fontSize:14}}>✕</span>}
            </div>
          </div>
          )
        })}
      </div>
      {/* Price summary */}
      {ageGroup&&selectedPlan&&(
        <div style={{background:"#f8f9fb",borderRadius:12,padding:"14px 16px",
          marginBottom:20,border:`1px solid #e5e7eb`}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:12,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>
            YOUR PRICE SUMMARY
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:14,color:NAVY,fontWeight:600}}>
              {selectedPlan.name} · {AGE_GROUPS.find(a=>a.id===ageGroup)?.label}
            </span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:20,color:getPrice(selectedPlan)===0?GREEN:NAVY}}>
              {getPrice(selectedPlan)===0?"FREE":`P${getPrice(selectedPlan)}/${billing==="monthly"?"mo":"yr"}`}
            </span>
          </div>
          {billing==="yearly"&&getYearlySavings(selectedPlan)>0&&(
            <div style={{fontSize:12,color:GREEN,marginTop:4,fontWeight:600}}>
              You save P{getYearlySavings(selectedPlan)} vs monthly billing
            </div>
          )}
        </div>
      )}
      <div style={{display:"flex",gap:10}}>
        <Btn onClick={()=>setStep(1)} bg={"#f0f0f0"} color={NAVY}
          sx={{flex:1}}>← BACK</Btn>
        <Btn onClick={()=>{ if(ageGroup) setStep(3) }}
          disabled={!ageGroup} bg={ageGroup?NAVY:null}
          sx={{flex:2}}>CONTINUE →</Btn>
      </div>
    </div>
    )
  }

  /* ── STEP 3: PERSONAL DETAILS ── */
  const Step3 = () => (
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",
      padding:"20px 14px"}}>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
        fontSize:22,color:NAVY,marginBottom:4}}>YOUR DETAILS</div>
      <div style={{fontSize:13,color:MGRAY,marginBottom:20,lineHeight:1.6}}>
        {needsVerification
          ? "Adults (18+) must verify their identity. Fill in your details below."
          : "Almost done! Confirm your details to complete registration."}
      </div>

      <Field label="FULL NAME" placeholder="As it appears on your ID"
        value={fullName} onChange={e=>setFullName(e.target.value)}/>
      <Field label="DATE OF BIRTH" type="date"
        value={dob} onChange={e=>setDob(e.target.value)}/>
      <Field label="EMAIL" type="email"
        value={session?.user?.email||""} disabled
        style={{background:"#f8f9fb",color:MGRAY}}/>

      {needsVerification&&(
        <>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8,marginTop:4}}>
            ID DOCUMENT TYPE
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
            {ID_TYPES.map(t=>(
              <div key={t.id} onClick={()=>setIdType(t.id)} style={{
                padding:"14px 16px",borderRadius:12,cursor:"pointer",
                border:`2px solid ${idType===t.id?NAVY:"#e5e7eb"}`,
                background:idType===t.id?"#eef1f8":WHITE,
                display:"flex",alignItems:"center",gap:12,
                WebkitTapHighlightColor:"transparent",
              }}>
                <span style={{fontSize:22}}>{t.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",
                    fontWeight:800,fontSize:15,color:NAVY}}>{t.label}</div>
                  <div style={{fontSize:11,color:MGRAY,marginTop:1}}>
                    {t.sides===2?"Requires front & back photos":"Requires front photo only"}
                  </div>
                </div>
                <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,
                  border:`2px solid ${idType===t.id?NAVY:"#ddd"}`,
                  background:idType===t.id?NAVY:"none",
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {idType===t.id&&<span style={{color:WHITE,fontSize:12}}>✓</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {error&&(
        <div style={{background:"#fef2f2",border:`1px solid #fecaca`,borderRadius:8,
          padding:"10px 14px",color:RED,fontSize:13,marginBottom:14,fontWeight:600}}>
          {error}
        </div>
      )}

      <div style={{display:"flex",gap:10}}>
        <Btn onClick={()=>setStep(2)} bg={"#f0f0f0"} color={NAVY} sx={{flex:1}}>← BACK</Btn>
        <Btn onClick={()=>{
          if(!fullName.trim()) { setError("Please enter your full name."); return }
          if(!dob) { setError("Please enter your date of birth."); return }
          if(needsVerification&&!idType) { setError("Please select an ID type."); return }
          setError("")
          needsVerification ? setStep(4) : handleSubmit()
        }} bg={NAVY} sx={{flex:2}} disabled={loading}>
          {needsVerification?"NEXT: VERIFY ID →":"COMPLETE →"}
        </Btn>
      </div>
    </div>
  )

  /* ── STEP 4: ID VERIFICATION ── */
  const Step4 = () => {
    const selectedId = ID_TYPES.find(t=>t.id===idType)
    const isComplete = idFront && selfie && (selectedId?.sides===1 || idBack)

    return (
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",
        padding:"20px 14px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:22,color:NAVY,marginBottom:4}}>VERIFY YOUR IDENTITY</div>
        <div style={{fontSize:13,color:MGRAY,marginBottom:20,lineHeight:1.6}}>
          Your documents are encrypted and only used for membership verification.
          An admin will review and approve within 24–48 hours.
        </div>

        {/* Security badge */}
        <div style={{background:"#eef1f8",borderRadius:10,padding:"10px 14px",
          marginBottom:18,display:"flex",alignItems:"center",gap:10,
          border:`1px solid #d0d8f0`}}>
          <span style={{fontSize:20}}>🔒</span>
          <div style={{fontSize:12,color:NAVY,lineHeight:1.5}}>
            <strong>Secure & Private</strong> — Documents are reviewed by Villareal FC admin only.
            Never shared with third parties.
          </div>
        </div>

        {/* ID Front */}
        <div style={{marginBottom:14}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>
            {selectedId?.emoji} {selectedId?.label?.toUpperCase()} — FRONT
          </div>
          {idFront?(
            <div style={{position:"relative",borderRadius:12,overflow:"hidden",
              border:`2px solid ${GREEN}`}}>
              <img src={idFront} alt="ID Front"
                style={{width:"100%",height:160,objectFit:"cover",display:"block"}}/>
              <div style={{position:"absolute",top:8,right:8,background:GREEN,
                borderRadius:20,padding:"3px 10px",fontSize:11,color:WHITE,fontWeight:700}}>
                ✓ Captured
              </div>
              <button onClick={()=>setIdFront(null)}
                style={{position:"absolute",top:8,left:8,background:"rgba(0,0,0,0.6)",
                  border:"none",borderRadius:20,padding:"3px 10px",fontSize:11,
                  color:WHITE,cursor:"pointer"}}>Retake</button>
            </div>
          ):(
            <button onClick={()=>capturePhoto(setIdFront)} style={{
              width:"100%",height:120,borderRadius:12,
              border:`2px dashed ${NAVY}`,background:"#f8f9fb",
              display:"flex",flexDirection:"column",alignItems:"center",
              justifyContent:"center",gap:8,cursor:"pointer",
              WebkitTapHighlightColor:"transparent"}}>
              <span style={{fontSize:32}}>📷</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                fontSize:13,color:NAVY}}>TAP TO CAPTURE FRONT</span>
              <span style={{fontSize:11,color:MGRAY}}>
                Make sure all text is clearly visible
              </span>
            </button>
          )}
        </div>

        {/* ID Back (Driver's License only) */}
        {selectedId?.sides===2&&(
          <div style={{marginBottom:14}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>
              {selectedId?.emoji} {selectedId?.label?.toUpperCase()} — BACK
            </div>
            {idBack?(
              <div style={{position:"relative",borderRadius:12,overflow:"hidden",
                border:`2px solid ${GREEN}`}}>
                <img src={idBack} alt="ID Back"
                  style={{width:"100%",height:160,objectFit:"cover",display:"block"}}/>
                <div style={{position:"absolute",top:8,right:8,background:GREEN,
                  borderRadius:20,padding:"3px 10px",fontSize:11,color:WHITE,fontWeight:700}}>
                  ✓ Captured
                </div>
                <button onClick={()=>setIdBack(null)}
                  style={{position:"absolute",top:8,left:8,background:"rgba(0,0,0,0.6)",
                    border:"none",borderRadius:20,padding:"3px 10px",fontSize:11,
                    color:WHITE,cursor:"pointer"}}>Retake</button>
              </div>
            ):(
              <button onClick={()=>capturePhoto(setIdBack)} style={{
                width:"100%",height:120,borderRadius:12,
                border:`2px dashed ${NAVY}`,background:"#f8f9fb",
                display:"flex",flexDirection:"column",alignItems:"center",
                justifyContent:"center",gap:8,cursor:"pointer",
                WebkitTapHighlightColor:"transparent"}}>
                <span style={{fontSize:32}}>📷</span>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                  fontSize:13,color:NAVY}}>TAP TO CAPTURE BACK</span>
              </button>
            )}
          </div>
        )}

        {/* Selfie */}
        <div style={{marginBottom:20}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>
            🤳 SELFIE — FACE VERIFICATION
          </div>
          <div style={{background:"#fffbea",borderRadius:10,padding:"10px 14px",
            marginBottom:8,border:`1px solid #fde68a`,fontSize:12,color:"#92400e",
            lineHeight:1.5}}>
            📌 Remove glasses, face camera directly, ensure good lighting.
          </div>
          {selfie?(
            <div style={{position:"relative",borderRadius:12,overflow:"hidden",
              border:`2px solid ${GREEN}`}}>
              <img src={selfie} alt="Selfie"
                style={{width:"100%",height:200,objectFit:"cover",display:"block"}}/>
              <div style={{position:"absolute",top:8,right:8,background:GREEN,
                borderRadius:20,padding:"3px 10px",fontSize:11,color:WHITE,fontWeight:700}}>
                ✓ Captured
              </div>
              <button onClick={()=>setSelfie(null)}
                style={{position:"absolute",top:8,left:8,background:"rgba(0,0,0,0.6)",
                  border:"none",borderRadius:20,padding:"3px 10px",fontSize:11,
                  color:WHITE,cursor:"pointer"}}>Retake</button>
            </div>
          ):(
            <button onClick={()=>captureSelfie(setSelfie)} style={{
              width:"100%",height:150,borderRadius:12,
              border:`2px dashed ${GOLD2}`,background:"#fffbea",
              display:"flex",flexDirection:"column",alignItems:"center",
              justifyContent:"center",gap:8,cursor:"pointer",
              WebkitTapHighlightColor:"transparent"}}>
              <span style={{fontSize:36}}>🤳</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                fontSize:13,color:NAVY}}>TAP TO TAKE SELFIE</span>
              <span style={{fontSize:11,color:MGRAY}}>Use front camera</span>
            </button>
          )}
        </div>

        {error&&(
          <div style={{background:"#fef2f2",border:`1px solid #fecaca`,borderRadius:8,
            padding:"10px 14px",color:RED,fontSize:13,marginBottom:14,fontWeight:600}}>
            {error}
          </div>
        )}

        <div style={{display:"flex",gap:10}}>
          <Btn onClick={()=>setStep(3)} bg={"#f0f0f0"} color={NAVY} sx={{flex:1}}>← BACK</Btn>
          <Btn onClick={()=>{
            if(!idFront) { setError("Please capture your ID front photo."); return }
            if(selectedId?.sides===2&&!idBack) { setError("Please capture your ID back photo."); return }
            if(!selfie) { setError("Please take a selfie for verification."); return }
            setError("")
            handleSubmit()
          }} bg={isComplete?NAVY:"#ccc"} disabled={loading||!isComplete} sx={{flex:2}}>
            {loading?"SUBMITTING...":"SUBMIT FOR REVIEW →"}
          </Btn>
        </div>
      </div>
    )
  }

  /* ── STEP 5: SUCCESS ── */
  const Step5 = () => (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",padding:"32px 24px",textAlign:"center",
      background:WHITE}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:"#dcfce7",
        display:"flex",alignItems:"center",justifyContent:"center",
        marginBottom:16,fontSize:40}}>
        {needsVerification?"⏳":"🎉"}
      </div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
        fontSize:26,color:NAVY,marginBottom:8}}>
        {needsVerification?"APPLICATION SUBMITTED!":"WELCOME TO THE FAMILY!"}
      </div>
      <div style={{fontSize:14,color:MGRAY,lineHeight:1.7,marginBottom:28,maxWidth:300}}>
        {needsVerification
          ? "Your identity verification is under review. You'll receive an email within 24–48 hours once approved. Some features are available immediately."
          : `You're now a ${selectedPlan?.name} member! Welcome to Villareal FC 🦡⚽`}
      </div>
      {needsVerification&&(
        <div style={{background:"#fffbea",border:`1px solid #fde68a`,borderRadius:12,
          padding:"14px 16px",marginBottom:24,textAlign:"left",width:"100%",maxWidth:320}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:12,color:"#92400e",marginBottom:8}}>WHAT HAPPENS NEXT</div>
          {["Admin reviews your documents (24–48hrs)",
            "You receive an approval email",
            "Full membership benefits unlock",
            "Your digital membership card is issued"].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
              <span style={{color:GOLD2,fontWeight:800,flexShrink:0}}>{i+1}.</span>
              <span style={{fontSize:12,color:"#78350f"}}>{s}</span>
            </div>
          ))}
        </div>
      )}
      <Btn onClick={onClose}>
        {needsVerification?"GO TO MY PROFILE":"START EXPLORING 🟡"}
      </Btn>
    </div>
  )

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",
      zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{
        background:WHITE,
        width:"100%",maxWidth:480,
        height:"92vh",
        borderRadius:"22px 22px 0 0",
        display:"flex",flexDirection:"column",
        overflow:"hidden",
      }}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"16px 18px 12px",borderBottom:`1px solid #eee`,flexShrink:0,
          background:WHITE}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Logo size={28}/>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:16,color:NAVY}}>MEMBERSHIP</div>
          </div>
          <button onClick={onClose} style={{background:"#f0f0f0",border:"none",
            width:32,height:32,borderRadius:"50%",cursor:"pointer",
            fontSize:16,color:MGRAY,WebkitTapHighlightColor:"transparent",
            display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        {step<5&&<StepBar/>}

        {/* Content */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
          {step===1&&<Step1/>}
          {step===2&&<Step2/>}
          {step===3&&<Step3/>}
          {step===4&&<Step4/>}
          {step===5&&<Step5/>}
        </div>
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
  const [showMembership,setShowMembership]=useState(false)

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
    if(showMembership) return null // rendered as overlay
    if(showAuth) return <AuthScreen
      onSuccess={()=>{setShowAuth(false);setActiveTab("profile")}}
      onGuest={()=>setShowAuth(false)}/>
    switch(activeTab){
      case "foryou":   return <ForYouScreen userEmail={session?.user?.email} goToAuth={goToAuth} session={session} openMembership={()=>setShowMembership(true)}/>
      case "calendar": return <CalendarScreen/>
      case "clips":    return <ClipsScreen/>
      case "store":    return <StoreScreen goToAuth={goToAuth} fixtures={fixtures} openMembership={()=>setShowMembership(true)}/>
      case "profile":  return <ProfileScreen session={session} profile={profile}
                         onLogout={handleLogout} goToAuth={goToAuth}
                         openMembership={()=>setShowMembership(true)}/>
      default:         return <ForYouScreen goToAuth={goToAuth} session={session} openMembership={()=>setShowMembership(true)}/>
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
          /* Critical: prevents content from pushing nav off screen */
          min-height:0;
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
        /* On real mobile, full height with nav always visible */
        @media(max-width:519px){
          .app-root{
            min-height:100vh;
            min-height:100dvh;
          }
          .phone-frame{
            flex:1;
            min-height:0;
            border-radius:0;
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

          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
            {renderScreen()}
          </div>

          {!showAuth&&<BottomNav active={activeTab} setActive={setActiveTab}/>}

          <div style={{background:activeTab==="clips"?"#000":WHITE,
            paddingBottom:4,paddingTop:3,display:"flex",justifyContent:"center",flexShrink:0}}>
            <div style={{width:110,height:4,background:"#ddd",borderRadius:2}}/>
          </div>
        </div>

        {showMembership&&(
          <MembershipPage
            session={session}
            onClose={()=>setShowMembership(false)}
            onSuccess={()=>{
              setShowMembership(false)
              setActiveTab("profile")
            }}
          />
        )}

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
