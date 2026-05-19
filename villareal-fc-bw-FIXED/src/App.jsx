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

const SQUAD = [
  // FIRST TEAM (22+)
  {name:"Buzwani Batsholeng",      dob:"1987-11-11",id:"007100M97",team:"FIRST TEAM"},
  {name:"Piwane Batsholeng",       dob:"1987-04-05",id:"007357M87",team:"FIRST TEAM"},
  {name:"Boineelo Better Bofedile",dob:"2000-12-05",id:"031712M00",team:"FIRST TEAM"},
  {name:"Macdonald Boikanyo",      dob:"2002-01-09",id:"014130M02",team:"FIRST TEAM"},
  {name:"Koketso Bontsheng",       dob:"2001-12-30",id:"036247M01",team:"FIRST TEAM"},
  {name:"Gomolemo Dingangano",     dob:"2001-09-22",id:"038579M01",team:"FIRST TEAM"},
  {name:"Enerst Gabaitumele",      dob:"2001-09-14",id:"031673M01",team:"FIRST TEAM"},
  {name:"Modiredi Gaboediwe",      dob:"2001-09-18",id:"026788M01",team:"FIRST TEAM"},
  {name:"Ditsaone Gaeimelwe",      dob:"2003-08-24",id:"031716M03",team:"FIRST TEAM"},
  {name:"Kagiso George",           dob:"2003-05-20",id:"024975M03",team:"FIRST TEAM"},
  {name:"Bathobakae Gosetsemang",  dob:"2002-02-19",id:"038598M02",team:"FIRST TEAM"},
  {name:"Amolemo Kadimo",          dob:"2002-01-06",id:"031670M02",team:"FIRST TEAM"},
  {name:"Hupaivanda Dennis Kefas", dob:"2001-01-04",id:"005427M01",team:"FIRST TEAM"},
  {name:"Odirelwe Kereeditse",     dob:"2002-05-02",id:"021333M02",team:"FIRST TEAM"},
  {name:"Maatla Kereteletswe",     dob:"1999-04-22",id:"038765M99",team:"FIRST TEAM"},
  {name:"Alson Kgope",             dob:"1999-12-09",id:"029136M99",team:"FIRST TEAM"},
  {name:"Onneile Lefetamang",      dob:"1999-10-11",id:"007224M99",team:"FIRST TEAM"},
  {name:"Bosenakitso Lenyatso",    dob:"1998-02-26",id:"025845M98",team:"FIRST TEAM"},
  {name:"Kgosi Lulane",            dob:"2002-05-29",id:"035314M02",team:"FIRST TEAM"},
  {name:"Gofamodimo Machangane",   dob:"1990-11-30",id:"021607M90",team:"FIRST TEAM"},
  {name:"Kefilwe Magono",          dob:"1997-07-27",id:"040402M97",team:"FIRST TEAM"},
  {name:"Tefho Makobela",          dob:"2001-06-11",id:"040392M01",team:"FIRST TEAM"},
  {name:"Keoagile Malebogo",       dob:"1999-01-20",id:"040403M99",team:"FIRST TEAM"},
  {name:"Matlhatsa Matlhatsa",     dob:"1995-01-17",id:"006990M95",team:"FIRST TEAM"},
  {name:"Pako Moitlhobogi",        dob:"2003-08-07",id:"039042M03",team:"FIRST TEAM"},
  {name:"Kealeboga Nkinogang",     dob:"2000-04-17",id:"035846M00",team:"FIRST TEAM"},
  {name:"Mort Pagiwa",             dob:"1998-11-11",id:"013430M98",team:"FIRST TEAM"},
  {name:"Koketso Sakaio",          dob:"2000-04-12",id:"025831M00",team:"FIRST TEAM"},
  {name:"Patrick Xhabee",          dob:"1993-05-02",id:"028470M93",team:"FIRST TEAM"},
  // U21 (18-21)
  {name:"Ngatangue Daniel",        dob:"2005-08-26",id:"031714M05",team:"U21"},
  {name:"Kaone Kabelo",            dob:"2006-01-04",id:"036663M06",team:"U21"},
  {name:"Karabo Michaelson Keikabile",dob:"2007-01-12",id:"018202M07",team:"U21"},
  {name:"Thabang Kenyaditswe",     dob:"2006-01-05",id:"018828M06",team:"U21"},
  {name:"Bright Kemo Kesaletseng", dob:"2006-01-07",id:"036661M06",team:"U21"},
  {name:"Jayson Kgagamedi",        dob:"2006-01-02",id:"033599M06",team:"U21"},
  {name:"Comfort Moopi Lusha",     dob:"2004-12-23",id:"031715M04",team:"U21"},
  {name:"Letso Mokwatso",          dob:"2007-01-29",id:"008702M07",team:"U21"},
  {name:"Mombadi Colin Nengu",     dob:"2004-06-28",id:"033709M04",team:"U21"},
  {name:"Rankhubu Rankhubu",       dob:"2006-05-21",id:"033707M06",team:"U21"},
  {name:"Mac Fred Senyashuba",     dob:"2007-03-10",id:"033703M07",team:"U21"},
  {name:"Emmanuel Virore",         dob:"2007-03-01",id:"034354M07",team:"U21"},
  // U17 (under 18)
  {name:"Aniesta Lefa Kgagamedi",  dob:"2008-10-18",id:"036718M08",team:"U17"},
  {name:"Theo Motlhodi",           dob:"2009-08-07",id:"036662M09",team:"U17"},
]


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
  const [playerPhotos,setPlayerPhotos]=useState({})
  useEffect(()=>{
    supabase.from("fixtures").select("*").order("match_date")
      .then(({data})=>{ if(data) setFixtures(data) })
  },[])

  // Load player photos from Supabase Storage
  useEffect(()=>{
    const loadPhotos = async () => {
      const { data } = await supabase.storage.from("player-photos").list("", {
        limit: 100, offset: 0
      })
      if (!data) return
      const photoMap = {}
      data.forEach(file => {
        // File names are BFA IDs e.g. "007100M97.jpg"
        const bfaId = file.name.replace(/\.(jpg|jpeg|png|webp)$/i, "")
        const { data: urlData } = supabase.storage
          .from("player-photos")
          .getPublicUrl(file.name)
        if (urlData?.publicUrl) photoMap[bfaId] = urlData.publicUrl
      })
      setPlayerPhotos(photoMap)
    }
    loadPhotos()
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

  const [teamFilter, setTeamFilter] = useState("FIRST TEAM")
  const [showDropdown, setShowDropdown] = useState(false)
  const TEAMS = ["FIRST TEAM","U21","U17"]

  const getAge = (dob) => {
    const today = new Date()
    const b = new Date(dob)
    let age = today.getFullYear() - b.getFullYear()
    const m = today.getMonth() - b.getMonth()
    if(m < 0 || (m === 0 && today.getDate() < b.getDate())) age--
    return age
  }

  const formatDob = (dob) => {
    const d = new Date(dob)
    return d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})
  }

  const filteredPlayers = SQUAD.filter(p => p.team === teamFilter)

  const [uploading, setUploading] = useState(null)  // bfaId currently uploading
  const [uploadErr, setUploadErr] = useState("")

  const handlePhotoUpload = async (player, e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(player.id)
    setUploadErr("")
    try {
      // Upload to Supabase Storage — filename = BFA ID + extension
      const ext = file.name.split(".").pop().toLowerCase()
      const filename = `${player.id}.${ext}`
      const { error: upErr } = await supabase.storage
        .from("player-photos")
        .upload(filename, file, { upsert: true, contentType: file.type })
      if (upErr) throw upErr
      // Get public URL and update local state immediately
      const { data: urlData } = supabase.storage
        .from("player-photos")
        .getPublicUrl(filename)
      if (urlData?.publicUrl) {
        setPlayerPhotos(prev => ({ ...prev, [player.id]: urlData.publicUrl + "?t=" + Date.now() }))
      }
    } catch(err) {
      setUploadErr(`${player.name}: ${err.message}`)
    }
    setUploading(null)
  }

  const triggerUpload = (player) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/jpeg,image/jpg,image/png,image/webp"
    input.onchange = (e) => handlePhotoUpload(player, e)
    input.click()
  }

  const PlayersTab=()=>(
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>

      {/* Upload error banner */}
      {uploadErr&&(
        <div style={{background:"#fef2f2",border:`1px solid #fecaca`,
          padding:"10px 14px",margin:"8px 12px",borderRadius:8,
          fontSize:12,color:RED,fontWeight:600}}>
          ⚠ {uploadErr}
          <span onClick={()=>setUploadErr("")}
            style={{float:"right",cursor:"pointer",fontWeight:900}}>✕</span>
        </div>
      )}

      {/* Upload hint */}
      <div style={{padding:"8px 14px 6px",
        display:"flex",alignItems:"center",gap:8,
        borderBottom:`1px solid #eee`}}>
        <span style={{fontSize:16}}>📸</span>
        <span style={{fontSize:11,color:MGRAY,lineHeight:1.4}}>
          Tap any player card to upload their photo directly to storage
        </span>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:0}}>
        {filteredPlayers.map((p,i)=>{
          const age = getAge(p.dob)
          const initials = p.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()
          const hasPhoto = !!playerPhotos[p.id]
          const isUploading = uploading === p.id

          return (
            <div key={p.id}
              onClick={()=>triggerUpload(p)}
              style={{
                display:"flex",alignItems:"center",gap:12,
                padding:"10px 14px",
                borderBottom:`1px solid #f0f0f0`,
                background:i%2===0?WHITE:"#fafafa",
                cursor:"pointer",
                WebkitTapHighlightColor:"transparent",
                opacity:isUploading?0.6:1,
                transition:"opacity 0.2s",
              }}>

              {/* Avatar — photo or initials */}
              <div style={{
                width:56,height:56,borderRadius:10,flexShrink:0,
                background:`linear-gradient(135deg,${NAVY},#1a3060)`,
                border:`2px solid ${hasPhoto?GREEN:GOLD}`,
                position:"relative",overflow:"hidden",
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>
                {isUploading ? (
                  <div style={{fontSize:20,animation:"spin 1s linear infinite"}}>⏳</div>
                ) : hasPhoto ? (
                  <>
                    <img
                      src={playerPhotos[p.id]}
                      alt={p.name}
                      style={{width:"100%",height:"100%",objectFit:"cover",
                        objectPosition:"center top",display:"block"}}
                      onError={e=>{
                        e.target.style.display="none"
                        setPlayerPhotos(prev=>({...prev,[p.id]:null}))
                      }}
                    />
                    {/* Green tick overlay */}
                    <div style={{position:"absolute",bottom:2,right:2,
                      background:GREEN,borderRadius:"50%",width:16,height:16,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:9,color:WHITE,fontWeight:900,border:`1.5px solid ${WHITE}`}}>
                      ✓
                    </div>
                  </>
                ) : (
                  <>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                      fontWeight:900,fontSize:18,color:GOLD}}>{initials}</span>
                    {/* Camera icon overlay */}
                    <div style={{position:"absolute",bottom:2,right:2,
                      background:GOLD,borderRadius:"50%",width:16,height:16,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:9,border:`1.5px solid ${WHITE}`}}>
                      📷
                    </div>
                  </>
                )}
              </div>

              {/* Player info */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:900,fontSize:"clamp(13px,3.5vw,15px)",
                  color:NAVY,lineHeight:1.1,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {p.name}
                </div>
                <div style={{fontSize:11,color:MGRAY,marginTop:2}}>
                  {formatDob(p.dob)} · Age {age}
                </div>
                <div style={{fontSize:10,color:GOLD2,fontWeight:700,
                  fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.04em",
                  marginTop:1}}>
                  BFA ID: {p.id}
                </div>
              </div>

              {/* Right side — status + team badge */}
              <div style={{display:"flex",flexDirection:"column",
                alignItems:"flex-end",gap:5,flexShrink:0}}>
                <div style={{
                  background:p.team==="FIRST TEAM"?NAVY:p.team==="U21"?GREEN:"#e67e22",
                  color:WHITE,fontSize:9,fontWeight:800,
                  padding:"3px 7px",borderRadius:4,
                  fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em",
                }}>{p.team}</div>
                <div style={{fontSize:10,color:hasPhoto?GREEN:MGRAY,fontWeight:600}}>
                  {isUploading?"uploading...":hasPhoto?"photo ✓":"tap to add"}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary footer */}
      <div style={{padding:"12px 14px",background:"#f8f9fb",
        borderTop:`1px solid #eee`,textAlign:"center"}}>
        <span style={{fontSize:11,color:MGRAY}}>
          {Object.keys(playerPhotos).length} of {SQUAD.length} players have photos
        </span>
      </div>
    </div>
  )


  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:WHITE,overflow:"hidden"}}>
      {/* Sub-tab bar + team dropdown */}
      <div style={{display:"flex",alignItems:"center",borderBottom:`1px solid #eee`,
        padding:"0 14px",gap:0,flexShrink:0}}>
        <div style={{display:"flex",flex:1,gap:14,overflowX:"auto"}}>
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
        {/* Team dropdown — only show on Players tab */}
        {subTab==="players"&&(
          <div style={{position:"relative",flexShrink:0,marginLeft:8}}>
            <button
              onClick={()=>setShowDropdown(d=>!d)}
              style={{
                background:NAVY,border:"none",borderRadius:8,
                padding:"6px 10px",cursor:"pointer",
                display:"flex",alignItems:"center",gap:5,
                fontFamily:"'Barlow Condensed',sans-serif",
                fontWeight:800,fontSize:11,color:WHITE,
                WebkitTapHighlightColor:"transparent",minHeight:34,
              }}>
              {teamFilter} <span style={{fontSize:9}}>{showDropdown?"▲":"▼"}</span>
            </button>
            {showDropdown&&(
              <div style={{
                position:"absolute",top:"calc(100% + 4px)",right:0,
                background:WHITE,borderRadius:10,
                boxShadow:"0 8px 24px rgba(0,0,0,0.15)",
                border:`1px solid #eee`,
                zIndex:100,minWidth:130,overflow:"hidden",
              }}>
                {TEAMS.map(t=>(
                  <button key={t} onClick={()=>{setTeamFilter(t);setShowDropdown(false)}}
                    style={{
                      display:"block",width:"100%",padding:"12px 16px",
                      background:teamFilter===t?`${GOLD}22`:WHITE,
                      border:"none",borderBottom:`1px solid #f0f0f0`,
                      cursor:"pointer",textAlign:"left",
                      fontFamily:"'Barlow Condensed',sans-serif",
                      fontWeight:teamFilter===t?900:600,fontSize:13,
                      color:teamFilter===t?NAVY:MGRAY,
                      WebkitTapHighlightColor:"transparent",
                    }}>
                    <span style={{marginRight:6}}>
                      {t==="FIRST TEAM"?"⚽":t==="U21"?"🌟":"🔥"}
                    </span>
                    {t}
                    <span style={{fontSize:10,color:MGRAY,marginLeft:4}}>
                      ({SQUAD.filter(p=>p.team===t).length})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
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
    {icon:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z", label:"Personal Information", action:null},
    {icon:"M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0", label:"Notification Settings", action:null},
    {icon:"M12 2a10 10 0 100 20A10 10 0 0012 2z M8 12h8 M12 8v8", label:"Cookie Settings", action:null},
    {icon:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", label:"Are you a member? →", action:openMembership},
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
          <div key={i}
            onClick={()=>{ if(s.action) s.action() }}
            style={{display:"flex",alignItems:"center",gap:14,
            padding:"14px 14px",minHeight:52,
            borderBottom:i<settings.length-1?`1px solid #f0f0f0`:"none",
            cursor:s.action?"pointer":"default",
            background:s.action?"transparent":"transparent",
            WebkitTapHighlightColor:"transparent"}}>
            <div style={{width:34,height:34,borderRadius:9,flexShrink:0,
              background:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ico d={s.icon} stroke={NAVY} sw={1.6} size={18}/>
            </div>
            <span style={{flex:1,fontSize:14,
              color:s.action?NAVY:NAVY,
              fontWeight:s.action?700:500}}>{s.label}</span>
            <span style={{color:s.action?GOLD2:"#ccc",fontSize:18,fontWeight:s.action?700:400}}>›</span>
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
    tagline: "Get started for free",
    emoji: "🆓",
    headerBg: "linear-gradient(135deg,#4a5568,#2d3748)",
    prices: { adult_monthly:0, adult_yearly:0, youth_monthly:0, youth_yearly:0 },
    ageGroups: ["infant","youth","adult"],
    benefits: [
      "Club news & match updates",
      "Fixtures & standings",
      "Clips & highlights",
      "Early store notifications",
    ],
    cta: "JOIN FREE",
    popular: false,
    adultsOnly: false,
  },
  {
    id: "global_fan",
    name: "GLOBAL FAN",
    tagline: "For dedicated fans",
    emoji: "🌍",
    headerBg: `linear-gradient(135deg,#0D1B3E,#1a3060)`,
    prices: { adult_monthly:20, adult_yearly:200, youth_monthly:15, youth_yearly:153 },
    ageGroups: ["youth","adult"],
    benefits: [
      "Everything in Free",
      "10% off match-day tickets",
      "5% off official store",
      "Early ticket access (48hr)",
      "Exclusive member kit number",
      "Priority squad updates",
    ],
    cta: "JOIN GLOBAL FAN",
    popular: true,
    adultsOnly: false,
  },
  {
    id: "honey_badger",
    name: "HONEY BADGER",
    tagline: "The ultimate membership",
    emoji: "🦡",
    headerBg: `linear-gradient(135deg,#D4A800,#F5C518)`,
    prices: { adult_monthly:50, adult_yearly:500, youth_monthly:null, youth_yearly:null },
    ageGroups: ["adult"],
    benefits: [
      "Everything in Global Fan",
      "20% off match-day tickets",
      "10% off official store",
      "Free entry to home matches",
      "Digital membership card",
      "Vote in club decisions",
      "Exclusive member events",
      "VIP match-day experience",
    ],
    cta: "JOIN HONEY BADGER",
    popular: false,
    adultsOnly: true,
  },
]

const ID_TYPES = [
  { id:"omang",    label:"Omang (National ID)", sides:1, icon:"🪪" },
  { id:"passport", label:"Passport",            sides:1, icon:"📗" },
  { id:"license",  label:"Driver's License",   sides:2, icon:"🚗" },
]

const MembershipPage = ({ session, onClose, onSuccess }) => {
  const [step,     setStep]    = useState(1)
  const [plan,     setPlan]    = useState(null)
  const [billing,  setBilling] = useState("yearly")
  const [dob,      setDob]     = useState("")
  const [ageGroup, setAgeGroup]= useState(null)
  const [fullName, setFullName]= useState(session?.user?.user_metadata?.full_name || "")
  const [idType,   setIdType]  = useState(null)
  const [idFront,  setIdFront] = useState(null)
  const [idBack,   setIdBack]  = useState(null)
  const [selfie,   setSelfie]  = useState(null)
  const [loading,  setLoading] = useState(false)
  const [error,    setError]   = useState("")
  const [nameVal,  setNameVal] = useState(session?.user?.user_metadata?.full_name || "")

  const selectedPlan   = PLANS.find(p => p.id === plan)
  const needsVerify    = ageGroup === "adult"
  const totalSteps     = needsVerify ? 5 : 4

  const getPrice = (p, ag) => {
    if (!p || !ag) return null
    const key = `${ag}_${billing}`
    return p.prices[key]
  }

  const getSaving = (p, ag) => {
    if (!p || !ag) return 0
    const m = p.prices[`${ag}_monthly`]
    const y = p.prices[`${ag}_yearly`]
    if (!m || !y) return 0
    return (m * 12) - y
  }

  // Detect age from DOB
  const getAgeFromDob = (dobStr) => {
    if (!dobStr) return null
    const today = new Date()
    const birth = new Date(dobStr)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  const getAgeGroupFromAge = (age) => {
    if (age === null) return null
    if (age <= 5)  return "infant"
    if (age <= 17) return "youth"
    return "adult"
  }

  // Camera helpers
  const capturePhoto = (setter) => {
    const inp = document.createElement("input")
    inp.type = "file"; inp.accept = "image/*"; inp.capture = "environment"
    inp.onchange = e => {
      const file = e.target.files[0]; if (!file) return
      const r = new FileReader()
      r.onload = ev => setter(ev.target.result)
      r.readAsDataURL(file)
    }
    inp.click()
  }

  const captureSelfie = (setter) => {
    const inp = document.createElement("input")
    inp.type = "file"; inp.accept = "image/*"; inp.capture = "user"
    inp.onchange = e => {
      const file = e.target.files[0]; if (!file) return
      const r = new FileReader()
      r.onload = ev => setter(ev.target.result)
      r.readAsDataURL(file)
    }
    inp.click()
  }

  const handleSubmit = async () => {
    if (!session) { onClose(); return }
    setLoading(true); setError("")
    try {
      await supabase.from("membership_applications").insert({
        user_id: session.user.id,
        email: session.user.email,
        full_name: nameVal,
        plan_id: plan,
        billing_cycle: billing,
        age_group: ageGroup,
        dob: dob || null,
        id_type: idType,
        id_front_url: idFront ? "uploaded" : null,
        id_back_url: idBack ? "uploaded" : null,
        selfie_url: selfie ? "uploaded" : null,
        status: needsVerify ? "pending" : "active",
        created_at: new Date().toISOString(),
      })
      await supabase.from("profiles").update({
        is_member: plan !== "free",
        billing_cycle: billing,
        member_since: new Date().toISOString(),
      }).eq("id", session.user.id)
      setStep(totalSteps + 1)
      if (onSuccess) onSuccess()
    } catch(e) {
      setError(e.message || "Something went wrong.")
    }
    setLoading(false)
  }

  /* ── STEP BAR ── */
  const StepBar = () => {
    const steps = needsVerify
      ? ["Plan","Age","Details","Verify ID"]
      : ["Plan","Age","Details"]
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",
        gap:0,padding:"10px 16px",background:"#f8f9fb",
        borderBottom:`1px solid #eee`,flexShrink:0}}>
        {steps.map((label,i)=>{
          const s = i+1
          const done = step > s
          const active = step === s
          return (
            <div key={s} style={{display:"flex",alignItems:"center"}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <div style={{
                  width:26,height:26,borderRadius:"50%",
                  background:done?"#27AE60":active?NAVY:"#e5e7eb",
                  display:"flex",alignItems:"center",justifyContent:"center",
                }}>
                  <span style={{fontSize:11,fontWeight:900,
                    color:done||active?WHITE:MGRAY,
                    fontFamily:"'Barlow Condensed',sans-serif"}}>
                    {done?"✓":s}
                  </span>
                </div>
                <span style={{fontSize:9,fontWeight:active?700:500,
                  color:active?NAVY:MGRAY,
                  fontFamily:"'Barlow Condensed',sans-serif",
                  letterSpacing:"0.04em",whiteSpace:"nowrap"}}>{label}</span>
              </div>
              {i < steps.length-1 && (
                <div style={{width:"clamp(16px,5vw,32px)",height:2,
                  background:done?"#27AE60":"#e5e7eb",margin:"0 2px 14px"}}/>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  /* ── STEP 1: PLANS ── */
  const Step1 = () => (
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
      {/* Header */}
      <div style={{background:`linear-gradient(160deg,${NAVY},#1a3060)`,
        padding:"16px 16px 14px",textAlign:"center"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:24,color:WHITE,lineHeight:1}}>CHOOSE YOUR PLAN</div>
        <div style={{fontSize:11,color:"#aab4cc",marginTop:4}}>
          Villareal FC · Season 2026/27
        </div>
        {/* Billing toggle */}
        <div style={{display:"inline-flex",background:"rgba(255,255,255,0.1)",
          borderRadius:8,padding:3,marginTop:12,gap:2}}>
          {["monthly","yearly"].map(b=>(
            <button key={b} onClick={()=>setBilling(b)} style={{
              padding:"7px 16px",minHeight:34,
              background:billing===b?WHITE:"none",
              border:"none",borderRadius:6,cursor:"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:12,color:billing===b?NAVY:"rgba(255,255,255,0.7)",
              WebkitTapHighlightColor:"transparent",
              display:"flex",alignItems:"center",gap:5}}>
              {b==="monthly"?"MONTHLY":"YEARLY"}
              {b==="yearly"&&<span style={{background:GREEN,color:WHITE,
                fontSize:8,fontWeight:900,padding:"1px 4px",borderRadius:3}}>
                SAVE 17%</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:"12px 12px 20px",display:"flex",flexDirection:"column",gap:10}}>
        {PLANS.map(p => {
          const adultPrice = getPrice(p, "adult")
          const youthPrice = getPrice(p, "youth")
          const isSelected = plan === p.id
          return (
            <div key={p.id} onClick={()=>setPlan(p.id)} style={{
              borderRadius:14,overflow:"hidden",cursor:"pointer",
              border:`2.5px solid ${isSelected?(p.adultsOnly?GOLD:NAVY):"#e5e7eb"}`,
              boxShadow:isSelected?"0 4px 20px rgba(0,0,0,0.15)":"0 1px 4px rgba(0,0,0,0.06)",
              WebkitTapHighlightColor:"transparent",
              transition:"border-color 0.15s,box-shadow 0.15s",
              background:WHITE,position:"relative",
            }}>
              {p.popular&&(
                <div style={{position:"absolute",top:0,right:0,
                  background:GOLD,color:NAVY,fontSize:9,fontWeight:900,
                  padding:"3px 10px",borderRadius:"0 11px 0 8px",
                  fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",zIndex:1}}>
                  MOST POPULAR
                </div>
              )}
              {/* Coloured header */}
              <div style={{background:p.headerBg,padding:"14px 16px 12px",
                display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:28}}>{p.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                    fontSize:18,color:p.adultsOnly?NAVY:WHITE,lineHeight:1}}>{p.name}</div>
                  <div style={{fontSize:11,color:p.adultsOnly?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.75)",
                    marginTop:2}}>{p.tagline}</div>
                </div>
                {isSelected&&(
                  <div style={{width:24,height:24,borderRadius:"50%",
                    background:"rgba(255,255,255,0.9)",flexShrink:0,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{color:p.adultsOnly?GOLD:NAVY,fontSize:14,fontWeight:900}}>✓</span>
                  </div>
                )}
              </div>

              {/* Price row */}
              <div style={{padding:"10px 16px",borderBottom:`1px solid #f0f0f0`,
                display:"flex",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <div style={{display:"flex",alignItems:"baseline",gap:3}}>
                  {adultPrice === 0 ? (
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                      fontWeight:900,fontSize:26,color:GREEN}}>FREE</span>
                  ) : (
                    <>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                        fontWeight:900,fontSize:26,color:NAVY}}>
                        P{adultPrice}
                      </span>
                      <span style={{fontSize:12,color:MGRAY}}>
                        /{billing==="monthly"?"mo":"yr"}
                      </span>
                    </>
                  )}
                </div>
                {billing==="yearly"&&getSaving(p,"adult")>0&&(
                  <span style={{background:"#dcfce7",color:GREEN,fontSize:10,
                    fontWeight:700,padding:"2px 7px",borderRadius:4}}>
                    Save P{getSaving(p,"adult")}
                  </span>
                )}
                {p.adultsOnly ? (
                  <span style={{background:"#fef2f2",color:RED,fontSize:10,
                    fontWeight:700,padding:"2px 7px",borderRadius:4,
                    marginLeft:"auto"}}>
                    18+ ONLY
                  </span>
                ) : youthPrice !== null && youthPrice !== undefined ? (
                  <span style={{fontSize:11,color:MGRAY,marginLeft:"auto"}}>
                    Youth: P{youthPrice}/{billing==="monthly"?"mo":"yr"}
                  </span>
                ) : null}
              </div>

              {/* Benefits */}
              <div style={{padding:"10px 16px 12px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 8px"}}>
                  {p.benefits.map((b,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"flex-start",gap:5}}>
                      <span style={{color:p.adultsOnly?GOLD2:NAVY,fontSize:11,
                        flexShrink:0,marginTop:1}}>✔</span>
                      <span style={{fontSize:11,color:"#444",lineHeight:1.3}}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{padding:"0 12px 20px"}}>
        <button onClick={()=>{ if(plan) setStep(2) }}
          disabled={!plan}
          style={{
            width:"100%",padding:"15px",
            background:plan?NAVY:"#e5e7eb",
            border:"none",borderRadius:12,cursor:plan?"pointer":"not-allowed",
            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,
            color:plan?WHITE:"#aaa",WebkitTapHighlightColor:"transparent",minHeight:50,
          }}>
          CONTINUE →
        </button>
      </div>
    </div>
  )

  /* ── STEP 2: AGE & DOB ── */
  const Step2 = () => {
    const age = getAgeFromDob(dob)
    const detectedGroup = getAgeGroupFromAge(age)

    // Honey Badger must be adult — reject under 18
    const isDobValid = dob && age !== null
    const isBlocked = selectedPlan?.adultsOnly && isDobValid && age < 18
    const isFraud = isDobValid && age <= 5 && plan !== "free"

    const handleDobChange = (val) => {
      setDob(val)
      const a = getAgeFromDob(val)
      const grp = getAgeGroupFromAge(a)
      if (grp) setAgeGroup(grp)
    }

    return (
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"20px 14px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:22,color:NAVY,marginBottom:4}}>DATE OF BIRTH</div>
        <div style={{fontSize:13,color:MGRAY,marginBottom:18,lineHeight:1.6}}>
          Your age determines your pricing tier and verification requirements.
          Enter your real date of birth — we verify identity for paid plans.
        </div>

        {/* DOB input */}
        <div style={{marginBottom:16}}>
          <label style={{fontSize:11,fontWeight:700,color:MGRAY,
            fontFamily:"'Barlow Condensed',sans-serif",display:"block",
            marginBottom:6,letterSpacing:"0.06em"}}>DATE OF BIRTH</label>
          <input type="date" value={dob}
            onChange={e=>handleDobChange(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            style={{width:"100%",padding:"13px 14px",borderRadius:10,
              border:`2px solid ${isDobValid&&!isBlocked&&!isFraud?GREEN:isBlocked||isFraud?RED:"#e5e7eb"}`,
              fontSize:16,outline:"none",boxSizing:"border-box",
              fontFamily:"inherit",WebkitAppearance:"none",minHeight:50,
              background:WHITE}}/>
        </div>

        {/* Age detection result */}
        {isDobValid && (
          <div style={{
            borderRadius:10,padding:"12px 14px",marginBottom:14,
            background:isBlocked||isFraud?"#fef2f2":detectedGroup==="adult"?"#eef1f8":"#f0fdf4",
            border:`1px solid ${isBlocked||isFraud?"#fecaca":detectedGroup==="adult"?"#c7d2fe":"#bbf7d0"}`,
          }}>
            {isFraud ? (
              <>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:13,color:RED,marginBottom:4}}>⚠ INVALID AGE FOR THIS PLAN</div>
                <div style={{fontSize:12,color:"#7f1d1d",lineHeight:1.5}}>
                  Paid plans require members aged 6 and above. Infants (0–5) are only eligible for the free plan.
                  Please select Premium Free or enter a valid date of birth.
                </div>
              </>
            ) : isBlocked ? (
              <>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:13,color:RED,marginBottom:4}}>⚠ AGE RESTRICTION</div>
                <div style={{fontSize:12,color:"#7f1d1d",lineHeight:1.5}}>
                  🦡 Honey Badger membership is for adults aged 18+ only.
                  You are {age} years old. Please select Global Fan or Premium Free instead.
                </div>
              </>
            ) : (
              <>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:13,color:detectedGroup==="adult"?NAVY:GREEN,marginBottom:4}}>
                  ✓ Age detected: {age} years old
                </div>
                <div style={{fontSize:12,color:MGRAY,lineHeight:1.5}}>
                  {detectedGroup==="infant"&&"Infant (0–5) · Free on all plans"}
                  {detectedGroup==="youth"&&`Youth (6–17) · P${getPrice(selectedPlan,"youth")||0}/${billing==="monthly"?"mo":"yr"} on ${selectedPlan?.name}`}
                  {detectedGroup==="adult"&&`Adult (18+) · P${getPrice(selectedPlan,"adult")||0}/${billing==="monthly"?"mo":"yr"} on ${selectedPlan?.name} · ID verification required`}
                </div>
              </>
            )}
          </div>
        )}

        {/* Anti-fraud notice */}
        <div style={{background:"#fffbea",border:`1px solid #fde68a`,borderRadius:10,
          padding:"10px 14px",marginBottom:20}}>
          <div style={{fontSize:11,color:"#78350f",lineHeight:1.6}}>
            🔒 <strong>Fraud prevention:</strong> Entering a false date of birth to avoid payment
            is a violation of our Terms. Identity documents are verified against your DOB for all paid plans.
            Fraudulent accounts will be permanently banned.
          </div>
        </div>

        {/* Price summary */}
        {isDobValid&&!isBlocked&&!isFraud&&ageGroup&&(
          <div style={{background:"#f8f9fb",borderRadius:12,padding:"12px 14px",
            marginBottom:18,border:`1px solid #e5e7eb`}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:6}}>
              YOUR PRICE
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:14,color:NAVY,fontWeight:600}}>
                {selectedPlan?.name} · {age} yrs
              </span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:22,color:getPrice(selectedPlan,ageGroup)===0?GREEN:NAVY}}>
                {getPrice(selectedPlan,ageGroup)===0
                  ? "FREE"
                  : `P${getPrice(selectedPlan,ageGroup)}/${billing==="monthly"?"mo":"yr"}`}
              </span>
            </div>
            {billing==="yearly"&&getSaving(selectedPlan,ageGroup)>0&&(
              <div style={{fontSize:12,color:GREEN,marginTop:3,fontWeight:600}}>
                Saves P{getSaving(selectedPlan,ageGroup)} vs monthly billing
              </div>
            )}
          </div>
        )}

        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setStep(1)}
            style={{flex:1,padding:"14px",background:"#f0f0f0",border:"none",
              borderRadius:12,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:900,fontSize:15,color:NAVY,minHeight:50,
              WebkitTapHighlightColor:"transparent"}}>
            ← BACK
          </button>
          <button
            onClick={()=>{
              if(!dob) { setError("Please enter your date of birth."); return }
              if(isBlocked||isFraud) { setError("Please go back and choose a suitable plan for your age."); return }
              setError("")
              setStep(3)
            }}
            disabled={!dob||isBlocked||isFraud}
            style={{flex:2,padding:"14px",
              background:!dob||isBlocked||isFraud?"#e5e7eb":NAVY,
              border:"none",borderRadius:12,
              cursor:!dob||isBlocked||isFraud?"not-allowed":"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:900,fontSize:15,
              color:!dob||isBlocked||isFraud?"#aaa":WHITE,
              minHeight:50,WebkitTapHighlightColor:"transparent"}}>
            CONTINUE →
          </button>
        </div>
        {error&&<div style={{color:RED,fontSize:13,marginTop:10,fontWeight:600,textAlign:"center"}}>{error}</div>}
      </div>
    )
  }

  /* ── STEP 3: PERSONAL DETAILS ── */
  const Step3 = () => {
    const [localName, setLocalName] = useState(nameVal)
    const [localIdType, setLocalIdType] = useState(idType)

    const handleNext = () => {
      if (!localName.trim()) { setError("Please enter your full name."); return }
      if (needsVerify && !localIdType) { setError("Please select an ID type."); return }
      setNameVal(localName)
      setIdType(localIdType)
      setError("")
      needsVerify ? setStep(4) : handleSubmit()
    }

    return (
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"20px 14px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:22,color:NAVY,marginBottom:4}}>YOUR DETAILS</div>
        <div style={{fontSize:13,color:MGRAY,marginBottom:18,lineHeight:1.6}}>
          {needsVerify
            ? "Adults must verify their identity. Your name must match your ID document exactly."
            : "Almost done — confirm your details to complete registration."}
        </div>

        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,fontWeight:700,color:MGRAY,
            fontFamily:"'Barlow Condensed',sans-serif",display:"block",
            marginBottom:6,letterSpacing:"0.06em"}}>FULL NAME</label>
          <input
            type="text"
            placeholder="As it appears on your ID"
            defaultValue={localName}
            onBlur={e => setLocalName(e.target.value)}
            style={{width:"100%",padding:"13px 14px",borderRadius:10,
              border:"2px solid #e5e7eb",fontSize:16,outline:"none",
              boxSizing:"border-box",fontFamily:"inherit",
              WebkitAppearance:"none",minHeight:50}}
            onFocus={e=>e.target.style.borderColor=GOLD}
          />
        </div>

        <div style={{marginBottom:18}}>
          <label style={{fontSize:11,fontWeight:700,color:MGRAY,
            fontFamily:"'Barlow Condensed',sans-serif",display:"block",
            marginBottom:6,letterSpacing:"0.06em"}}>EMAIL</label>
          <input type="email" value={session?.user?.email||""} disabled
            style={{width:"100%",padding:"13px 14px",borderRadius:10,
              border:"2px solid #f0f0f0",fontSize:16,outline:"none",
              boxSizing:"border-box",fontFamily:"inherit",
              background:"#f8f9fb",color:MGRAY,minHeight:50}}/>
        </div>

        {needsVerify&&(
          <>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>
              ID DOCUMENT TYPE
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
              {ID_TYPES.map(t=>(
                <div key={t.id} onClick={()=>setLocalIdType(t.id)} style={{
                  padding:"13px 14px",borderRadius:12,cursor:"pointer",
                  border:`2px solid ${localIdType===t.id?NAVY:"#e5e7eb"}`,
                  background:localIdType===t.id?"#eef1f8":WHITE,
                  display:"flex",alignItems:"center",gap:12,
                  WebkitTapHighlightColor:"transparent",minHeight:50,
                }}>
                  <span style={{fontSize:22}}>{t.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                      fontSize:15,color:NAVY}}>{t.label}</div>
                    <div style={{fontSize:11,color:MGRAY,marginTop:1}}>
                      {t.sides===2?"Front & back photos required":"Front photo only"}
                    </div>
                  </div>
                  <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,
                    border:`2px solid ${localIdType===t.id?NAVY:"#ddd"}`,
                    background:localIdType===t.id?NAVY:"none",
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {localIdType===t.id&&<span style={{color:WHITE,fontSize:12}}>✓</span>}
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
          <button onClick={()=>setStep(2)}
            style={{flex:1,padding:"14px",background:"#f0f0f0",border:"none",
              borderRadius:12,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:900,fontSize:15,color:NAVY,minHeight:50,
              WebkitTapHighlightColor:"transparent"}}>
            ← BACK
          </button>
          <button onClick={handleNext} disabled={loading}
            style={{flex:2,padding:"14px",background:loading?"#ccc":NAVY,
              border:"none",borderRadius:12,cursor:loading?"not-allowed":"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,
              color:loading?"#888":WHITE,minHeight:50,
              WebkitTapHighlightColor:"transparent"}}>
            {loading?"PLEASE WAIT...":needsVerify?"NEXT: VERIFY ID →":"COMPLETE ✓"}
          </button>
        </div>
      </div>
    )
  }

  /* ── STEP 4: ID VERIFICATION ── */
  const Step4 = () => {
    const selId = ID_TYPES.find(t=>t.id===idType)
    const done = idFront && selfie && (selId?.sides===1 || idBack)

    return (
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"20px 14px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:22,color:NAVY,marginBottom:4}}>VERIFY YOUR IDENTITY</div>
        <div style={{fontSize:13,color:MGRAY,marginBottom:14,lineHeight:1.6}}>
          Documents are encrypted and used only for verification. Admin reviews within 24–48hrs.
        </div>

        <div style={{background:"#eef1f8",borderRadius:10,padding:"10px 14px",
          marginBottom:16,display:"flex",gap:10,border:`1px solid #c7d2fe`}}>
          <span style={{fontSize:18,flexShrink:0}}>🔒</span>
          <div style={{fontSize:12,color:NAVY,lineHeight:1.5}}>
            <strong>Secure & Private</strong> — Reviewed by Villareal FC admin only. Never shared with third parties.
          </div>
        </div>

        {/* ID Front */}
        <div style={{marginBottom:12}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>
            {selId?.emoji} {selId?.label?.toUpperCase()} — FRONT
          </div>
          {idFront ? (
            <div style={{position:"relative",borderRadius:12,overflow:"hidden",
              border:`2px solid ${GREEN}`}}>
              <img src={idFront} alt="ID Front"
                style={{width:"100%",height:140,objectFit:"cover",display:"block"}}/>
              <div style={{position:"absolute",top:6,right:6,background:GREEN,
                borderRadius:20,padding:"2px 8px",fontSize:10,color:WHITE,fontWeight:700}}>
                ✓ Captured</div>
              <button onClick={()=>setIdFront(null)}
                style={{position:"absolute",top:6,left:6,background:"rgba(0,0,0,0.6)",
                  border:"none",borderRadius:20,padding:"2px 8px",fontSize:10,
                  color:WHITE,cursor:"pointer"}}>Retake</button>
            </div>
          ) : (
            <button onClick={()=>capturePhoto(setIdFront)} style={{
              width:"100%",height:110,borderRadius:12,
              border:`2px dashed ${NAVY}`,background:"#f8f9fb",
              display:"flex",flexDirection:"column",alignItems:"center",
              justifyContent:"center",gap:6,cursor:"pointer",
              WebkitTapHighlightColor:"transparent"}}>
              <span style={{fontSize:28}}>📷</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                fontSize:13,color:NAVY}}>TAP TO CAPTURE FRONT</span>
              <span style={{fontSize:11,color:MGRAY}}>All text must be clearly visible</span>
            </button>
          )}
        </div>

        {/* ID Back (license only) */}
        {selId?.sides===2&&(
          <div style={{marginBottom:12}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>
              {selId?.emoji} {selId?.label?.toUpperCase()} — BACK
            </div>
            {idBack ? (
              <div style={{position:"relative",borderRadius:12,overflow:"hidden",
                border:`2px solid ${GREEN}`}}>
                <img src={idBack} alt="ID Back"
                  style={{width:"100%",height:140,objectFit:"cover",display:"block"}}/>
                <div style={{position:"absolute",top:6,right:6,background:GREEN,
                  borderRadius:20,padding:"2px 8px",fontSize:10,color:WHITE,fontWeight:700}}>
                  ✓ Captured</div>
                <button onClick={()=>setIdBack(null)}
                  style={{position:"absolute",top:6,left:6,background:"rgba(0,0,0,0.6)",
                    border:"none",borderRadius:20,padding:"2px 8px",fontSize:10,
                    color:WHITE,cursor:"pointer"}}>Retake</button>
              </div>
            ) : (
              <button onClick={()=>capturePhoto(setIdBack)} style={{
                width:"100%",height:110,borderRadius:12,
                border:`2px dashed ${NAVY}`,background:"#f8f9fb",
                display:"flex",flexDirection:"column",alignItems:"center",
                justifyContent:"center",gap:6,cursor:"pointer",
                WebkitTapHighlightColor:"transparent"}}>
                <span style={{fontSize:28}}>📷</span>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                  fontSize:13,color:NAVY}}>TAP TO CAPTURE BACK</span>
              </button>
            )}
          </div>
        )}

        {/* Selfie */}
        <div style={{marginBottom:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>
            🤳 SELFIE — FACE VERIFICATION
          </div>
          <div style={{background:"#fffbea",borderRadius:8,padding:"8px 12px",
            marginBottom:8,border:`1px solid #fde68a`,fontSize:11,color:"#92400e"}}>
            📌 Face camera directly · Remove glasses · Good lighting · No hats
          </div>
          {selfie ? (
            <div style={{position:"relative",borderRadius:12,overflow:"hidden",
              border:`2px solid ${GREEN}`}}>
              <img src={selfie} alt="Selfie"
                style={{width:"100%",height:160,objectFit:"cover",display:"block"}}/>
              <div style={{position:"absolute",top:6,right:6,background:GREEN,
                borderRadius:20,padding:"2px 8px",fontSize:10,color:WHITE,fontWeight:700}}>
                ✓ Captured</div>
              <button onClick={()=>setSelfie(null)}
                style={{position:"absolute",top:6,left:6,background:"rgba(0,0,0,0.6)",
                  border:"none",borderRadius:20,padding:"2px 8px",fontSize:10,
                  color:WHITE,cursor:"pointer"}}>Retake</button>
            </div>
          ) : (
            <button onClick={()=>captureSelfie(setSelfie)} style={{
              width:"100%",height:130,borderRadius:12,
              border:`2px dashed ${GOLD2}`,background:"#fffbea",
              display:"flex",flexDirection:"column",alignItems:"center",
              justifyContent:"center",gap:6,cursor:"pointer",
              WebkitTapHighlightColor:"transparent"}}>
              <span style={{fontSize:32}}>🤳</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                fontSize:13,color:NAVY}}>TAP TO TAKE SELFIE</span>
              <span style={{fontSize:11,color:MGRAY}}>Use your front camera</span>
            </button>
          )}
        </div>

        {error&&(
          <div style={{background:"#fef2f2",border:`1px solid #fecaca`,borderRadius:8,
            padding:"10px 14px",color:RED,fontSize:13,marginBottom:12,fontWeight:600}}>
            {error}
          </div>
        )}

        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setStep(3)}
            style={{flex:1,padding:"14px",background:"#f0f0f0",border:"none",
              borderRadius:12,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:900,fontSize:15,color:NAVY,minHeight:50,
              WebkitTapHighlightColor:"transparent"}}>
            ← BACK
          </button>
          <button
            onClick={()=>{
              if(!idFront) { setError("Please capture your ID front."); return }
              if(selId?.sides===2&&!idBack) { setError("Please capture your ID back."); return }
              if(!selfie) { setError("Please take a selfie."); return }
              setError(""); handleSubmit()
            }}
            disabled={loading||!done}
            style={{flex:2,padding:"14px",
              background:loading||!done?"#e5e7eb":NAVY,
              border:"none",borderRadius:12,
              cursor:loading||!done?"not-allowed":"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,
              color:loading||!done?"#aaa":WHITE,minHeight:50,
              WebkitTapHighlightColor:"transparent"}}>
            {loading?"SUBMITTING...":"SUBMIT FOR REVIEW →"}
          </button>
        </div>
      </div>
    )
  }

  /* ── SUCCESS ── */
  const StepDone = () => (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",padding:"32px 24px",textAlign:"center"}}>
      <div style={{width:76,height:76,borderRadius:"50%",
        background:needsVerify?"#fffbea":"#dcfce7",
        display:"flex",alignItems:"center",justifyContent:"center",
        marginBottom:14,fontSize:38}}>
        {needsVerify?"⏳":"🎉"}
      </div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
        fontSize:24,color:NAVY,marginBottom:8}}>
        {needsVerify?"APPLICATION SUBMITTED!":"WELCOME TO THE FAMILY!"}
      </div>
      <div style={{fontSize:14,color:MGRAY,lineHeight:1.7,marginBottom:24,maxWidth:300}}>
        {needsVerify
          ? "Your identity is under review. You'll receive an email within 24–48 hours once approved."
          : `You're now a ${selectedPlan?.name} member! Welcome to Villareal FC 🦡⚽`}
      </div>
      {needsVerify&&(
        <div style={{background:"#fffbea",border:`1px solid #fde68a`,borderRadius:12,
          padding:"14px 16px",marginBottom:20,textAlign:"left",width:"100%",maxWidth:320}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:"#92400e",marginBottom:8,letterSpacing:"0.06em"}}>
            WHAT HAPPENS NEXT
          </div>
          {["Admin reviews your documents (24–48hrs)",
            "You receive an approval email",
            "Full membership benefits unlock",
            "Digital membership card issued"].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:5}}>
              <span style={{color:GOLD2,fontWeight:800,flexShrink:0}}>{i+1}.</span>
              <span style={{fontSize:12,color:"#78350f"}}>{s}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={onClose}
        style={{width:"100%",maxWidth:320,padding:"15px",background:NAVY,
          border:"none",borderRadius:12,cursor:"pointer",
          fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,
          color:WHITE,WebkitTapHighlightColor:"transparent",minHeight:50}}>
        {needsVerify?"GO TO MY PROFILE →":"START EXPLORING 🟡"}
      </button>
    </div>
  )

  const isDone = step === totalSteps + 1

  return (
    <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",
      height:"100%",width:"100%"}}>
      <div style={{
        background:WHITE,width:"100%",
        height:"92%",
        borderRadius:"22px 22px 0 0",
        display:"flex",flexDirection:"column",
        overflow:"hidden",
        boxShadow:"0 -8px 32px rgba(0,0,0,0.3)",
      }}>
        {/* Modal header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"14px 16px 12px",borderBottom:`1px solid #eee`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Logo size={26}/>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:15,color:NAVY,letterSpacing:"0.04em"}}>MEMBERSHIP</div>
          </div>
          <button onClick={onClose} style={{background:"#f0f0f0",border:"none",
            width:30,height:30,borderRadius:"50%",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:14,color:MGRAY,WebkitTapHighlightColor:"transparent"}}>✕</button>
        </div>

        {!isDone && <StepBar/>}

        <div style={{flex:1,display:"flex",flexDirection:"column",
          overflow:"hidden",minHeight:0}}>
          {step===1 && <Step1/>}
          {step===2 && <Step2/>}
          {step===3 && <Step3/>}
          {step===4 && <Step4/>}
          {isDone   && <StepDone/>}
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

        <div className="phone-frame" style={{position:"relative"}}>
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

          {/* Membership modal — inside phone frame, slides over content, nav stays visible */}
          {showMembership&&(
            <div style={{position:"absolute",inset:0,zIndex:200,
              display:"flex",flexDirection:"column",
              background:"rgba(0,0,0,0.6)",
              borderRadius:"inherit"}}>
              <MembershipPage
                session={session}
                onClose={()=>setShowMembership(false)}
                onSuccess={()=>{
                  setShowMembership(false)
                  setActiveTab("profile")
                }}
              />
            </div>
          )}
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
