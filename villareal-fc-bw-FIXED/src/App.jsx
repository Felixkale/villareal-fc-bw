import { useState, useEffect, useRef } from "react"
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
  {name:"Aniesta Lefa Kgagamedi",  dob:"2008-10-18",id:"036718M08",team:"U17"},
  {name:"Theo Motlhodi",           dob:"2009-08-07",id:"036662M09",team:"U17"},
]

/* Real player surnames from squad for jersey customization */
const REAL_PLAYER_NAMES = SQUAD
  .filter(p => p.team === "FIRST TEAM")
  .map(p => {
    const parts = p.name.trim().split(" ")
    return parts[parts.length - 1].toUpperCase()
  })

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
        <Btn onClick={handleDonate} disabled={loading} style={{marginBottom:8}}>
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

      <div style={{padding:"10px 12px",display:"flex",gap:8,overflowX:"auto",borderBottom:`1px solid #eee`}}>
        {["🔥 LAST GAME","👕 SHOP","🤝 MEMBERSHIP"].map(l=>(
          <button key={l} style={{background:"none",border:`1.5px solid #ddd`,borderRadius:20,
            padding:"6px 14px",fontSize:"clamp(10px,2.5vw,12px)",fontWeight:700,whiteSpace:"nowrap",
            fontFamily:"'Barlow Condensed',sans-serif",color:NAVY,cursor:"pointer",
            WebkitTapHighlightColor:"transparent",minHeight:36}}>{l}</button>
        ))}
      </div>

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
  const [uploading, setUploading]=useState(null)
  useEffect(()=>{
    supabase.from("fixtures").select("*").order("match_date")
      .then(({data})=>{ if(data) setFixtures(data) })
  },[])

  useEffect(()=>{
    const loadPhotos = async () => {
      const { data } = await supabase.storage.from("player-photos").list("", { limit: 100, offset: 0 })
      if (!data) return
      const photoMap = {}
      data.forEach(file => {
        const bfaId = file.name.replace(/\.(jpg|jpeg|png|webp)$/i, "")
        const { data: urlData } = supabase.storage.from("player-photos").getPublicUrl(file.name)
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

  const filteredPlayers = SQUAD.filter(p => p.team === teamFilter)

  const PlayersTab=()=>(
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(3,1fr)",
        gap:8,padding:"10px 10px 0",
      }}>
        {filteredPlayers.map((p,i)=>{
          const age = getAge(p.dob)
          const initials = p.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()
          const hasPhoto = !!playerPhotos[p.id]
          const isUploading = uploading === p.id
          const firstName = p.name.split(" ")[0]
          const lastName  = p.name.split(" ").slice(1).join(" ") || p.name.split(" ")[0]

          return (
            <div key={p.id}
              style={{
                borderRadius:12,overflow:"hidden",
                background:WHITE,cursor:"pointer",
                boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
                border:`1.5px solid ${hasPhoto?GREEN:"#e5e7eb"}`,
                WebkitTapHighlightColor:"transparent",
                opacity:isUploading?0.7:1,
                transition:"opacity 0.15s",
              }}>
              <div style={{
                height:90,
                background:`linear-gradient(160deg,${NAVY},#1a3060)`,
                position:"relative",overflow:"hidden",
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>
                {hasPhoto ? (
                  <img
                    src={playerPhotos[p.id]}
                    alt={p.name}
                    style={{width:"100%",height:"100%",
                      objectFit:"cover",objectPosition:"center top",display:"block"}}
                    onError={e=>{
                      e.target.style.display="none"
                      setPlayerPhotos(prev=>({...prev,[p.id]:null}))
                    }}
                  />
                ) : (
                  <div style={{display:"flex",flexDirection:"column",
                    alignItems:"center",gap:4}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                      fontWeight:900,fontSize:26,color:GOLD,lineHeight:1}}>{initials}</span>
                    <span style={{fontSize:14,opacity:0.6}}>📷</span>
                  </div>
                )}
                <div style={{position:"absolute",top:5,left:5,
                  background:hasPhoto?GREEN:"rgba(0,0,0,0.45)",
                  borderRadius:4,padding:"2px 5px",
                  fontSize:8,color:WHITE,fontWeight:700,
                  fontFamily:"'Barlow Condensed',sans-serif"}}>
                  {isUploading?"⏳":hasPhoto?"✓ PHOTO":"📷 ADD"}
                </div>
                <div style={{position:"absolute",top:5,right:5,
                  background:p.team==="FIRST TEAM"?NAVY:p.team==="U21"?GREEN:"#e67e22",
                  borderRadius:4,padding:"2px 5px",
                  fontSize:7,color:WHITE,fontWeight:800,
                  fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.04em"}}>
                  {p.team==="FIRST TEAM"?"1ST":p.team}
                </div>
              </div>
              <div style={{padding:"7px 8px 8px",background:WHITE}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",
                  fontSize:9,color:MGRAY,fontWeight:600,lineHeight:1,marginBottom:1,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {firstName}
                </div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:900,fontSize:"clamp(11px,3vw,13px)",color:NAVY,
                  lineHeight:1.1,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {lastName.toUpperCase()}
                </div>
                <div style={{fontSize:9,color:GOLD2,fontWeight:700,
                  fontFamily:"'Barlow Condensed',sans-serif",
                  marginTop:3,letterSpacing:"0.02em",
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {p.id}
                </div>
                <div style={{fontSize:9,color:MGRAY,marginTop:1}}>Age {age}</div>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{padding:"12px 14px",background:"#f8f9fb",
        borderTop:`1px solid #eee`,textAlign:"center"}}>
        <span style={{fontSize:11,color:MGRAY}}>
          {Object.keys(playerPhotos).filter(k=>playerPhotos[k]).length} of {SQUAD.length} players have photos
        </span>
      </div>
    </div>
  )

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:WHITE,overflow:"hidden"}}>
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
const CLIPS_DATA = [
  {
    id:1, player:"KGOSI LULANE", num:"#19",
    tag:"GOAL ⚽", desc:"Stunning header vs Stone Breakers! 🦡🔥 #BRFA #TheHoneyBadgers #Villareal",
    likes:4300, comments:187, shares:1200,
    bg:"linear-gradient(180deg,#0a1428 0%,#0D1B3E 40%,#1a3060 100%)",
    accent:"#F5C518",
  },
  {
    id:2, player:"TEFHO MAKOBELA", num:"#22",
    tag:"ASSIST 🎯", desc:"Vision of a true playmaker 👏 #MidfielderOfTheSeason #HoneyBadgers",
    likes:3100, comments:94, shares:890,
    bg:"linear-gradient(180deg,#0a1a0a 0%,#0d2a18 40%,#1a4a2a 100%)",
    accent:"#27AE60",
  },
  {
    id:3, player:"MAATLA KERETELETSWE", num:"#15",
    tag:"SKILL 🔥", desc:"No one can stop him on the wing 💨 #Speedy #Villareal #BRFA",
    likes:2700, comments:63, shares:650,
    bg:"linear-gradient(180deg,#1a0a00 0%,#2a1200 40%,#3a1a00 100%)",
    accent:"#F5C518",
  },
  {
    id:4, player:"PATRICK XHABEE", num:"#29",
    tag:"GOAL ⚽", desc:"Long range rocket! The crowd goes wild 🚀 #TopBin #HoneyBadgers",
    likes:1900, comments:41, shares:430,
    bg:"linear-gradient(180deg,#1a001a 0%,#2a0a2a 40%,#1a0830 100%)",
    accent:"#a78bfa",
  },
]

const ClipsScreen = () => {
  const [liked,      setLiked]      = useState({})
  const [clipsTab,   setClipsTab]   = useState("foryou")
  const [visibleIdx, setVisibleIdx] = useState(0)
  const containerRef = useRef(null)
  const clipRefs     = useRef([])

  useEffect(() => {
    const observers = []
    clipRefs.current.forEach((el, i) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setVisibleIdx(i) },
        { threshold: 0.6 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const toggleLike = (id) =>
    setLiked(prev => ({ ...prev, [id]: !prev[id] }))

  const fmtNum = (n) =>
    n >= 1000 ? (n/1000).toFixed(1).replace(/\.0$/,"") + "k" : n

  return (
    <div style={{
      flex:1, display:"flex", flexDirection:"column",
      background:"#000", overflow:"hidden", position:"relative",
    }}>
      <div style={{
        position:"absolute", top:0, left:0, right:0, zIndex:30,
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"10px 0 8px",
        background:"linear-gradient(to bottom,rgba(0,0,0,0.7) 0%,transparent 100%)",
        pointerEvents:"none",
      }}>
        <div style={{display:"flex",gap:24,pointerEvents:"auto"}}>
          {["following","foryou"].map(tab => (
            <button key={tab} onClick={() => setClipsTab(tab)}
              style={{
                background:"none", border:"none", cursor:"pointer",
                fontFamily:"'Barlow Condensed',sans-serif",
                fontWeight:900, fontSize:"clamp(13px,4vw,16px)",
                color: clipsTab===tab ? WHITE : "rgba(255,255,255,0.45)",
                letterSpacing:"0.06em", textTransform:"uppercase",
                padding:"4px 0",
                borderBottom: clipsTab===tab ? `2.5px solid ${GOLD}` : "2.5px solid transparent",
                WebkitTapHighlightColor:"transparent",
              }}>
              {tab === "foryou" ? "FOR YOU" : "FOLLOWING"}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          flex:1,
          overflowY:"scroll",
          scrollSnapType:"y mandatory",
          WebkitOverflowScrolling:"touch",
          scrollbarWidth:"none",
          msOverflowStyle:"none",
          display:"flex",
          flexDirection:"column",
        }}>

        {CLIPS_DATA.map((clip, i) => {
          const isLiked  = !!liked[clip.id]
          const likesCnt = fmtNum(clip.likes + (isLiked ? 1 : 0))
          const initials = clip.player.split(" ").map(w=>w[0]).join("").slice(0,2)

          return (
            <div
              key={clip.id}
              ref={el => clipRefs.current[i] = el}
              style={{
                height:"var(--clip-h,100vh)",
                minHeight:"var(--clip-h,100vh)",
                flexShrink:0,
                scrollSnapAlign:"start",
                scrollSnapStop:"always",
                position:"relative",
                background: clip.bg,
                display:"flex",
                flexDirection:"column",
                overflow:"hidden",
              }}>

              <div style={{
                position:"absolute", inset:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                opacity:0.04, pointerEvents:"none",
              }}>
                <Logo size={"clamp(220px,65vw,320px)"}/>
              </div>

              <div style={{
                flex:1,
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                justifyContent:"center",
                padding:"clamp(60px,15vw,80px) clamp(60px,18vw,90px) clamp(100px,20vw,130px)",
              }}>
                <div style={{
                  background: clip.accent, color:NAVY,
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:900, fontSize:"clamp(11px,3vw,14px)",
                  letterSpacing:"0.12em", padding:"5px 16px",
                  borderRadius:20, marginBottom:"clamp(14px,4vw,20px)",
                }}>
                  {clip.tag}
                </div>

                <Logo size={"clamp(72px,20vw,100px)"}/>

                <div style={{
                  marginTop:"clamp(12px,3vw,18px)",
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:900,
                  fontSize:"clamp(26px,8vw,40px)",
                  color: clip.accent,
                  letterSpacing:"0.06em",
                  textAlign:"center",
                  lineHeight:1,
                  textShadow:"0 2px 24px rgba(0,0,0,0.7)",
                }}>
                  {clip.player.split(" ").map((w,wi) => (
                    <div key={wi}>{w}</div>
                  ))}
                </div>

                <div style={{
                  color:"rgba(255,255,255,0.7)",
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:700,
                  fontSize:"clamp(15px,4.5vw,20px)",
                  marginTop:4, letterSpacing:"0.04em",
                }}>
                  {clip.num}
                </div>

                <div style={{display:"flex",gap:6,marginTop:"clamp(16px,4vw,24px)"}}>
                  {CLIPS_DATA.map((_,di) => (
                    <div key={di} style={{
                      width: di===i ? "clamp(16px,5vw,22px)" : "clamp(5px,1.5vw,7px)",
                      height:"clamp(5px,1.5vw,7px)",
                      borderRadius:4,
                      background: di===i ? clip.accent : "rgba(255,255,255,0.25)",
                      transition:"width 0.25s",
                    }}/>
                  ))}
                </div>
              </div>

              <div style={{
                position:"absolute", bottom:0, left:0, right:0,
                background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.3) 60%,transparent 100%)",
                padding:"clamp(14px,4vw,20px) clamp(12px,4vw,16px)",
                display:"flex", alignItems:"flex-end", justifyContent:"space-between",
                gap:12,
              }}>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <div style={{
                      width:"clamp(32px,8vw,40px)", height:"clamp(32px,8vw,40px)",
                      borderRadius:"50%", border:`2px solid ${clip.accent}`,
                      background:NAVY, flexShrink:0,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      overflow:"hidden",
                    }}>
                      <span style={{
                        fontFamily:"'Barlow Condensed',sans-serif",
                        fontWeight:900,
                        fontSize:"clamp(10px,3vw,13px)",
                        color:clip.accent,
                      }}>{initials}</span>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{
                        fontFamily:"'Barlow Condensed',sans-serif",
                        fontWeight:800,
                        fontSize:"clamp(12px,3.5vw,15px)",
                        color:WHITE,lineHeight:1,
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                      }}>
                        @{clip.player.replace(/ /g,"_").toLowerCase()}
                      </div>
                      <div style={{
                        fontSize:"clamp(9px,2.5vw,11px)",
                        color:"rgba(255,255,255,0.55)",marginTop:2,
                      }}>
                        Villareal FC · {clip.num}
                      </div>
                    </div>
                    <button style={{
                      background:clip.accent, border:"none",
                      borderRadius:6, padding:"5px 10px",
                      fontFamily:"'Barlow Condensed',sans-serif",
                      fontWeight:900, fontSize:"clamp(9px,2.5vw,11px)",
                      color:NAVY, cursor:"pointer", flexShrink:0,
                      WebkitTapHighlightColor:"transparent",
                    }}>
                      + FOLLOW
                    </button>
                  </div>

                  <div style={{
                    fontSize:"clamp(11px,3vw,13px)",
                    color:"rgba(255,255,255,0.8)",
                    lineHeight:1.5,
                    display:"-webkit-box",
                    WebkitLineClamp:2,
                    WebkitBoxOrient:"vertical",
                    overflow:"hidden",
                  }}>
                    {clip.desc}
                  </div>

                  <div style={{
                    display:"flex", alignItems:"center", gap:6, marginTop:8,
                  }}>
                    <span style={{fontSize:"clamp(10px,2.5vw,12px)"}}>🎵</span>
                    <div style={{
                      fontSize:"clamp(9px,2.5vw,11px)",
                      color:"rgba(255,255,255,0.55)",
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                    }}>
                      Villareal FC Official · Match Highlights
                    </div>
                  </div>
                </div>

                <div style={{
                  display:"flex", flexDirection:"column",
                  alignItems:"center", gap:"clamp(14px,4vw,20px)",
                  flexShrink:0, paddingBottom:"clamp(4px,1vw,8px)",
                }}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                    <button
                      onClick={() => toggleLike(clip.id)}
                      style={{
                        background:"rgba(255,255,255,0.12)",
                        border:"none", borderRadius:"50%",
                        width:"clamp(44px,11vw,54px)",
                        height:"clamp(44px,11vw,54px)",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        cursor:"pointer", WebkitTapHighlightColor:"transparent",
                        transition:"transform 0.15s",
                        transform: isLiked ? "scale(1.15)" : "scale(1)",
                      }}>
                      <span style={{
                        fontSize:"clamp(20px,5.5vw,26px)",
                        filter: isLiked ? "drop-shadow(0 0 8px rgba(255,60,60,0.9))" : "none",
                      }}>
                        {isLiked ? "❤️" : "🤍"}
                      </span>
                    </button>
                    <span style={{color:WHITE,fontSize:"clamp(10px,2.5vw,12px)",fontWeight:700}}>{likesCnt}</span>
                  </div>

                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                    <button style={{
                      background:"rgba(255,255,255,0.12)",
                      border:"none", borderRadius:"50%",
                      width:"clamp(44px,11vw,54px)",
                      height:"clamp(44px,11vw,54px)",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      cursor:"pointer", WebkitTapHighlightColor:"transparent",
                    }}>
                      <span style={{fontSize:"clamp(18px,5vw,24px)"}}>💬</span>
                    </button>
                    <span style={{color:WHITE,fontSize:"clamp(10px,2.5vw,12px)",fontWeight:700}}>{fmtNum(clip.comments)}</span>
                  </div>

                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                    <button style={{
                      background:"rgba(255,255,255,0.12)",
                      border:"none", borderRadius:"50%",
                      width:"clamp(44px,11vw,54px)",
                      height:"clamp(44px,11vw,54px)",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      cursor:"pointer", WebkitTapHighlightColor:"transparent",
                    }}>
                      <span style={{fontSize:"clamp(18px,5vw,24px)"}}>↗</span>
                    </button>
                    <span style={{color:WHITE,fontSize:"clamp(10px,2.5vw,12px)",fontWeight:700}}>{fmtNum(clip.shares)}</span>
                  </div>

                  <div style={{
                    width:"clamp(36px,9vw,44px)",
                    height:"clamp(36px,9vw,44px)",
                    borderRadius:"50%",
                    background:`conic-gradient(${clip.accent},${NAVY},${clip.accent})`,
                    border:`2px solid rgba(255,255,255,0.3)`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    animation:"spin 4s linear infinite",
                  }}>
                    <div style={{width:"40%",height:"40%",borderRadius:"50%",background:"#111"}}/>
                  </div>
                </div>
              </div>

              {i===0&&(
                <div style={{
                  position:"absolute",bottom:"clamp(100px,22vw,130px)",
                  left:"50%",transform:"translateX(-50%)",
                  display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                  opacity:0.5, pointerEvents:"none",
                }}>
                  <span style={{color:WHITE,fontSize:"clamp(9px,2.5vw,11px)"}}>scroll for next</span>
                  <span style={{color:WHITE,fontSize:16}}>↕</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        div::-webkit-scrollbar { display:none }
      `}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   CUSTOMIZE JERSEY SCREEN  (dedicated standalone section)
══════════════════════════════════════════════════════════════════════════════ */
const ADULT_SIZES  = ["XS","S","M","L","XL","XXL","XXXL","XXXXL"]
const KIDS_SIZES   = ["2Y","3Y","4Y","5Y","6Y","7Y","8Y","9Y","10Y","11Y","12Y","13Y","14Y","15Y","16Y"]
const KIT_OPTIONS  = [
  { id:"home",  label:"Home Kit 2026/27",  emoji:"🟡", desc:"Navy & Gold",   price:280 },
  { id:"away",  label:"Away Kit 2026/27",  emoji:"⬜", desc:"White & Gold",  price:260 },
  { id:"third", label:"Training Kit",      emoji:"💪", desc:"Performance",   price:180 },
  { id:"gk",    label:"GK Kit 2026/27",    emoji:"🧤", desc:"Limited Ed.",   price:300 },
]

const CustomizeScreen = ({ cart, setCart, openMembership, profile }) => {
  const isMember = !!profile?.is_member
  const memberDisc = isMember ? 5 : 0

  const [kit,        setKit]        = useState("home")
  const [variant,    setVariant]    = useState("Men")
  const [sizeGroup,  setSizeGroup]  = useState("adult")
  const [size,       setSize]       = useState("")
  const [nameMode,   setNameMode]   = useState("player") // player | custom
  const [selPlayer,  setSelPlayer]  = useState("")
  const [customName, setCustomName] = useState("")
  const [number,     setNumber]     = useState("")
  const [addedMsg,   setAddedMsg]   = useState(false)

  const selectedKit = KIT_OPTIONS.find(k => k.id === kit)
  const finalPrice  = Math.round((selectedKit?.price || 280) * (1 - memberDisc/100))
  const displayName = nameMode === "player" ? selPlayer : customName
  const displayNum  = number || "10"
  const sizes       = sizeGroup === "adult" ? ADULT_SIZES : KIDS_SIZES

  const handleAddToCart = () => {
    if (!size) return
    const item = {
      id: `custom_${kit}_${size}_${Date.now()}`,
      cartId: `custom_${kit}_${size}_${Date.now()}`,
      name: `${selectedKit.label} (Custom)`,
      collection: kit,
      quality: "Stadium",
      price: selectedKit.price,
      variant,
      size,
      customName: nameMode === "custom" ? customName : "",
      player: nameMode === "player" ? selPlayer : "",
      number,
      qty: 1,
    }
    setCart(prev => [...prev, item])
    setAddedMsg(true)
    setTimeout(() => setAddedMsg(false), 2000)
  }

  /* Jersey preview SVG */
  const JerseyPreview = () => {
    const kitColors = {
      home:  { body: NAVY,    accent: GOLD,    text: GOLD },
      away:  { body: "#f5f5f5", accent: GOLD,  text: NAVY },
      third: { body: "#1a4a1a", accent: "#4ade80", text: "#4ade80" },
      gk:    { body: "#3a0090", accent: "#a78bfa", text: "#a78bfa" },
    }
    const c = kitColors[kit] || kitColors.home
    return (
      <svg viewBox="0 0 200 220" width="100%" style={{maxHeight:200,display:"block",margin:"0 auto"}}>
        {/* Body */}
        <path d="M50 50 L20 80 L35 90 L35 190 L165 190 L165 90 L180 80 L150 50 L130 65 Q100 75 70 65 Z"
          fill={c.body} stroke={c.accent} strokeWidth="3"/>
        {/* Collar */}
        <path d="M85 52 Q100 65 115 52" fill="none" stroke={c.accent} strokeWidth="3"/>
        {/* Left sleeve */}
        <path d="M50 50 L20 80 L35 90 L55 75 Z" fill={c.accent} stroke={c.accent} strokeWidth="1"/>
        {/* Right sleeve */}
        <path d="M150 50 L180 80 L165 90 L145 75 Z" fill={c.accent} stroke={c.accent} strokeWidth="1"/>
        {/* Stripe */}
        <path d="M35 110 L165 110" stroke={c.accent} strokeWidth="2" opacity="0.5"/>
        {/* Name */}
        {displayName && (
          <text x="100" y="150" textAnchor="middle" fontFamily="'Barlow Condensed',sans-serif"
            fontWeight="900" fontSize="16" fill={c.text} letterSpacing="2">
            {displayName.slice(0,12).toUpperCase()}
          </text>
        )}
        {/* Number */}
        <text x="100" y="180" textAnchor="middle" fontFamily="'Barlow Condensed',sans-serif"
          fontWeight="900" fontSize="28" fill={c.text}>
          {displayNum}
        </text>
      </svg>
    )
  }

  return (
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",background:"#f5f6fa"}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${NAVY},#1a3060)`,
        padding:"16px 16px 14px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:26,color:WHITE,lineHeight:1}}>CUSTOMIZE YOUR JERSEY</div>
        <div style={{fontSize:12,color:"#aab4cc",marginTop:3}}>
          Real Villareal FC players · Your name · Your number
        </div>
        {isMember && (
          <div style={{marginTop:8,display:"inline-flex",alignItems:"center",gap:5,
            background:`${GREEN}33`,border:`1px solid ${GREEN}66`,
            borderRadius:6,padding:"3px 10px",fontSize:11,color:GREEN,fontWeight:700}}>
            🦡 Member discount: 5% off
          </div>
        )}
      </div>

      <div style={{padding:"14px 14px 20px",display:"flex",flexDirection:"column",gap:16}}>

        {/* Jersey Live Preview */}
        <div style={{background:WHITE,borderRadius:16,padding:"16px",
          boxShadow:"0 2px 12px rgba(0,0,0,0.08)",overflow:"hidden"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.1em",marginBottom:12}}>
            LIVE PREVIEW
          </div>
          <JerseyPreview/>
          <div style={{textAlign:"center",marginTop:8}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:22,color:NAVY}}>
              P{finalPrice}
              {isMember && <span style={{fontSize:12,color:MGRAY,textDecoration:"line-through",
                marginLeft:6}}>P{selectedKit?.price}</span>}
            </div>
            {isMember && <div style={{fontSize:11,color:GREEN,fontWeight:700}}>🦡 Member price</div>}
          </div>
        </div>

        {/* Kit selection */}
        <div style={{background:WHITE,borderRadius:14,padding:"14px",
          boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.1em",marginBottom:10}}>
            1. SELECT KIT
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {KIT_OPTIONS.map(k=>(
              <button key={k.id} onClick={()=>setKit(k.id)} style={{
                padding:"10px 12px",borderRadius:10,
                border:`2px solid ${kit===k.id?NAVY:"#e5e7eb"}`,
                background:kit===k.id?"#eef1f8":WHITE,
                cursor:"pointer",textAlign:"left",
                WebkitTapHighlightColor:"transparent",minHeight:54,
              }}>
                <div style={{fontSize:20,marginBottom:2}}>{k.emoji}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:12,color:NAVY,lineHeight:1.2}}>{k.label}</div>
                <div style={{fontSize:10,color:MGRAY}}>{k.desc} · P{k.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Variant & size group */}
        <div style={{background:WHITE,borderRadius:14,padding:"14px",
          boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.1em",marginBottom:10}}>
            2. CUT & SIZE
          </div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            {["Men","Women","Junior"].map(v=>(
              <button key={v} onClick={()=>{setVariant(v);setSizeGroup(v==="Junior"?"kids":"adult");setSize("")}}
                style={{
                  flex:1,padding:"9px 0",borderRadius:9,
                  border:`2px solid ${variant===v?NAVY:"#e5e7eb"}`,
                  background:variant===v?NAVY:WHITE,
                  color:variant===v?WHITE:NAVY,
                  fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,
                  cursor:"pointer",WebkitTapHighlightColor:"transparent",
                }}>
                {v}
              </button>
            ))}
          </div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
            fontSize:10,color:MGRAY,marginBottom:8,letterSpacing:"0.06em"}}>SIZE</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {sizes.map(sz=>(
              <button key={sz} onClick={()=>setSize(sz)} style={{
                minWidth:42,height:42,borderRadius:8,
                border:`2px solid ${size===sz?NAVY:"#e5e7eb"}`,
                background:size===sz?NAVY:WHITE,
                color:size===sz?WHITE:NAVY,
                fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:12,cursor:"pointer",padding:"0 6px",
                WebkitTapHighlightColor:"transparent",
              }}>{sz}</button>
            ))}
          </div>
        </div>

        {/* Name & Number */}
        <div style={{background:WHITE,borderRadius:14,padding:"14px",
          boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.1em",marginBottom:10}}>
            3. NAME & NUMBER
          </div>

          {/* Toggle: player name or custom */}
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <button onClick={()=>setNameMode("player")} style={{
              flex:1,padding:"10px 0",borderRadius:9,
              border:`2px solid ${nameMode==="player"?GOLD:"#e5e7eb"}`,
              background:nameMode==="player"?`${GOLD}22`:WHITE,
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,
              color:nameMode==="player"?NAVY:MGRAY,cursor:"pointer",
              WebkitTapHighlightColor:"transparent",
            }}>
              ⚽ Player Name
            </button>
            <button onClick={()=>setNameMode("custom")} style={{
              flex:1,padding:"10px 0",borderRadius:9,
              border:`2px solid ${nameMode==="custom"?GOLD:"#e5e7eb"}`,
              background:nameMode==="custom"?`${GOLD}22`:WHITE,
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,
              color:nameMode==="custom"?NAVY:MGRAY,cursor:"pointer",
              WebkitTapHighlightColor:"transparent",
            }}>
              ✏️ Your Name
            </button>
          </div>

          {nameMode === "player" ? (
            <>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                fontSize:10,color:MGRAY,marginBottom:8,letterSpacing:"0.06em"}}>
                SELECT VILLAREAL FC PLAYER
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {REAL_PLAYER_NAMES.map(pn=>(
                  <button key={pn} onClick={()=>setSelPlayer(pn)} style={{
                    padding:"6px 12px",borderRadius:8,
                    border:`2px solid ${selPlayer===pn?NAVY:"#e5e7eb"}`,
                    background:selPlayer===pn?NAVY:WHITE,
                    color:selPlayer===pn?WHITE:NAVY,
                    fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,
                    cursor:"pointer",WebkitTapHighlightColor:"transparent",
                  }}>{pn}</button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                fontSize:10,color:MGRAY,marginBottom:6,letterSpacing:"0.06em"}}>
                YOUR NAME (MAX 12 CHARS)
              </div>
              <input
                placeholder="e.g. MOTSWEDI"
                value={customName}
                onChange={e=>setCustomName(e.target.value.toUpperCase().slice(0,12))}
                style={{width:"100%",padding:"11px 12px",borderRadius:9,
                  border:`2px solid ${customName?GOLD:"#e5e7eb"}`,fontSize:15,
                  fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  letterSpacing:"0.08em",outline:"none",boxSizing:"border-box",
                  marginBottom:4}}/>
            </>
          )}

          <div style={{marginTop:12}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
              fontSize:10,color:MGRAY,marginBottom:6,letterSpacing:"0.06em"}}>
              SQUAD NUMBER (1–99)
            </div>
            <input
              type="number"
              placeholder="e.g. 10"
              value={number}
              min={1} max={99}
              onChange={e=>setNumber(e.target.value.slice(0,2))}
              style={{width:"100%",padding:"11px 12px",borderRadius:9,
                border:`2px solid ${number?GOLD:"#e5e7eb"}`,fontSize:20,
                fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                textAlign:"center",outline:"none",boxSizing:"border-box",
                WebkitAppearance:"none"}}/>
          </div>
        </div>

        {/* Member upsell */}
        {!isMember && (
          <div onClick={openMembership}
            style={{background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
              borderRadius:12,padding:"12px 16px",
              display:"flex",alignItems:"center",justifyContent:"space-between",
              cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:13,color:NAVY}}>🦡 JOIN HONEY BADGER — SAVE 5% ON JERSEYS</div>
              <div style={{fontSize:11,color:"rgba(13,27,62,0.7)",marginTop:2}}>
                Plus exclusive promo codes & early access
              </div>
            </div>
            <div style={{background:NAVY,color:GOLD,fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:900,fontSize:11,padding:"5px 10px",borderRadius:6,flexShrink:0}}>
              JOIN →
            </div>
          </div>
        )}

        {/* Add to cart */}
        <div>
          <button
            onClick={handleAddToCart}
            disabled={!size || (nameMode==="player"&&!selPlayer) || (nameMode==="custom"&&!customName.trim())}
            style={{
              width:"100%",padding:"16px",
              background:(!size||(nameMode==="player"&&!selPlayer)||(nameMode==="custom"&&!customName.trim()))
                ?"#e5e7eb":NAVY,
              border:"none",borderRadius:12,
              cursor:(!size||(nameMode==="player"&&!selPlayer)||(nameMode==="custom"&&!customName.trim()))
                ?"not-allowed":"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:17,
              color:(!size||(nameMode==="player"&&!selPlayer)||(nameMode==="custom"&&!customName.trim()))
                ?"#aaa":WHITE,
              minHeight:54,WebkitTapHighlightColor:"transparent",
              boxShadow:size?"0 4px 14px rgba(13,27,62,0.3)":"none",
              transition:"all 0.15s",letterSpacing:"0.04em",
              position:"relative",
            }}>
            {addedMsg
              ? "✓ ADDED TO CART!"
              : !size
                ? "SELECT A SIZE TO CONTINUE"
                : (nameMode==="player"&&!selPlayer)
                  ? "SELECT A PLAYER NAME"
                  : (nameMode==="custom"&&!customName.trim())
                    ? "ENTER YOUR NAME"
                    : `ADD CUSTOM JERSEY — P${finalPrice}`}
          </button>
          {addedMsg && (
            <div style={{textAlign:"center",fontSize:12,color:GREEN,marginTop:6,fontWeight:700}}>
              ✓ Check your cart to complete your order!
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   STORE
══════════════════════════════════════════════════════════════════════════════ */
const StoreScreen=({goToAuth,fixtures,openMembership,session,profile})=>{
  const [subTab, setSubTab] = useState("shop")
  // FIX: each view tracks its own scroll with a ref, reset on view change
  const [shopView, setShopView] = useState("home")
  const scrollAreaRef = useRef(null)
  const [activeCol,   setActiveCol]   = useState(null)
  const [selProduct,  setSelProduct]  = useState(null)
  const [selSize,     setSelSize]     = useState("")
  const [selVariant,  setSelVariant]  = useState("Men")
  const [selQuality,  setSelQuality]  = useState("Stadium")
  const [customName,  setCustomName]  = useState("")
  const [customMode,  setCustomMode]  = useState("player")
  const [selPlayer,   setSelPlayer]   = useState("")
  const [cart,        setCart]        = useState([])
  const [promoCode,   setPromoCode]   = useState("")
  const [promoInput,  setPromoInput]  = useState("")
  const [promoMsg,    setPromoMsg]    = useState(null)
  const [checkStep,   setCheckStep]   = useState(1)
  const [payMethod,   setPayMethod]   = useState("")
  const [payRef,      setPayRef]      = useState("")
  const isMember = !!profile?.is_member

  // FIX: scroll to top whenever view or tab changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0
    }
  }, [shopView, subTab])

  const PROMOS = {
    "HONEYBADGER10": { pct:10, label:"10% off — Honey Badger exclusive!", memberOnly:false },
    "FARMERSDAY":    { pct:15, label:"15% off — Boteti West Farmers Day!", memberOnly:false },
    "MEMBER20":      { pct:20, label:"20% off — Member loyalty reward!",  memberOnly:true  },
    "SEASON2627":    { pct:5,  label:"5% off — 2026/27 season launch!",   memberOnly:false },
  }

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if(!code){ setPromoMsg({ok:false,text:"Please enter a code."}); return }
    const promo = PROMOS[code]
    if(!promo){ setPromoMsg({ok:false,text:"Invalid promo code."}); return }
    if(promo.memberOnly&&!isMember){
      setPromoMsg({ok:false,text:"This code is for Honey Badger members only."}); return
    }
    setPromoCode(code)
    setPromoMsg({ok:true,text:promo.label,pct:promo.pct})
  }

  const memberDisc   = isMember ? 5 : 0
  const promoDisc    = promoMsg?.ok ? promoMsg.pct : 0
  const totalDisc    = Math.min(memberDisc + promoDisc, 40)

  const discPrice = (p) => Math.round(p * (1 - totalDisc/100))
  const cartSubtotal = cart.reduce((s,i)=>s + discPrice(i.price) * i.qty, 0)
  const cartQty      = cart.reduce((s,i)=>s+i.qty, 0)
  const savedTotal   = cart.reduce((s,i)=>s+(i.price - discPrice(i.price))*i.qty, 0)

  const VARIANTS    = ["Men","Women","Junior"]
  const QUALITIES   = ["Stadium","Match"]

  const COLLECTIONS = [
    {
      id:"home2627", label:"HOME KIT", sublabel:"2026/27 Season", emoji:"🟡",
      bg:`linear-gradient(135deg,${NAVY} 0%,#1a3060 100%)`,
      accent:GOLD, textColor:WHITE, new:true,
      desc:"The official 2026/27 Villareal FC home kit. Navy & gold. Full sublimation.",
      products:[
        {id:"hk2627_st",name:"Home Kit 2026/27",quality:"Stadium",price:280,variants:VARIANTS,sizes:ADULT_SIZES,season:"2026/27",tag:"NEW",tagC:GREEN},
        {id:"hk2627_mt",name:"Home Kit 2026/27 Match",quality:"Match",price:380,variants:["Men","Women"],sizes:["S","M","L","XL","XXL"],season:"2026/27",tag:"MATCH",tagC:"#7c3aed"},
        {id:"hk2627_jr",name:"Home Kit 2026/27 Junior",quality:"Stadium",price:220,variants:["Junior"],sizes:KIDS_SIZES,season:"2026/27",tag:"KIDS",tagC:"#0891b2"},
      ]
    },
    {
      id:"away2627", label:"AWAY KIT", sublabel:"2026/27 Season", emoji:"⬜",
      bg:`linear-gradient(135deg,#1a1a2e 0%,#2a2a4e 100%)`,
      accent:"#e0e0e0", textColor:WHITE, new:true,
      desc:"Official away kit. White & gold trim. Premium polyester.",
      products:[
        {id:"ak2627_st",name:"Away Kit 2026/27",quality:"Stadium",price:260,variants:VARIANTS,sizes:ADULT_SIZES,season:"2026/27",tag:"NEW",tagC:GREEN},
        {id:"ak2627_jr",name:"Away Kit 2026/27 Junior",quality:"Stadium",price:200,variants:["Junior"],sizes:KIDS_SIZES,season:"2026/27",tag:"KIDS",tagC:"#0891b2"},
      ]
    },
    {
      id:"retro",label:"RETRO COLLECTION",sublabel:"Classic Seasons",emoji:"🏆",
      bg:`linear-gradient(135deg,#2d1b00 0%,#4a2e00 100%)`,
      accent:GOLD,textColor:WHITE,new:false,
      desc:"Iconic kits from past seasons. Limited stock.",
      products:[
        {id:"ret_2526",name:"Home Kit 2025/26",quality:"Stadium",price:220,variants:VARIANTS,sizes:["S","M","L","XL","XXL"],season:"2025/26",tag:"RETRO",tagC:GOLD2},
        {id:"ret_2425",name:"Home Kit 2024/25",quality:"Stadium",price:180,variants:VARIANTS,sizes:["M","L","XL"],season:"2024/25",tag:"SALE",tagC:RED},
        {id:"ret_2324",name:"Home Kit 2023/24",quality:"Stadium",price:160,variants:VARIANTS,sizes:["L","XL"],season:"2023/24",tag:"SALE",tagC:RED},
      ]
    },
    {
      id:"training",label:"TRAINING",sublabel:"Match-Day Ready",emoji:"💪",
      bg:`linear-gradient(135deg,#0a2a0a 0%,#1a4a1a 100%)`,
      accent:"#4ade80",textColor:WHITE,new:false,
      desc:"Performance training wear. Moisture-wicking. All sizes.",
      products:[
        {id:"tr_top",name:"Training Top 2026/27",quality:"Stadium",price:180,variants:VARIANTS,sizes:ADULT_SIZES,season:"2026/27",tag:"TRAINING",tagC:GREEN},
        {id:"tr_short",name:"Training Shorts",quality:"Stadium",price:120,variants:VARIANTS,sizes:ADULT_SIZES,season:"2026/27",tag:"TRAINING",tagC:GREEN},
        {id:"tr_track",name:"Tracksuit 2026/27",quality:"Stadium",price:320,variants:VARIANTS,sizes:ADULT_SIZES,season:"2026/27",tag:"NEW",tagC:GREEN},
      ]
    },
    {
      id:"fanwear",label:"FAN GEAR",sublabel:"Show Your Colours",emoji:"🦡",
      bg:`linear-gradient(135deg,${NAVY} 0%,#D4A800 100%)`,
      accent:GOLD,textColor:WHITE,new:false,
      desc:"Official fan merchandise. Scarves, caps, tees and more.",
      products:[
        {id:"fan_tee",name:"Honey Badger Fan Tee",quality:"Stadium",price:120,variants:VARIANTS,sizes:ADULT_SIZES,season:"2026/27",tag:"FAN",tagC:GOLD2},
        {id:"fan_tee_k",name:"Kids Fan Tee",quality:"Stadium",price:90,variants:["Junior"],sizes:KIDS_SIZES,season:"2026/27",tag:"KIDS",tagC:"#0891b2"},
        {id:"fan_scarf",name:"Yellow Submarine Scarf",quality:"Stadium",price:85,variants:["Men","Women"],sizes:["ONE SIZE"],season:"2026/27",tag:"FAN",tagC:GOLD2},
        {id:"fan_cap",name:"Honey Badger Cap",quality:"Stadium",price:70,variants:["Men","Women"],sizes:["ONE SIZE"],season:"2026/27",tag:"FAN",tagC:GOLD2},
        {id:"fan_hoodie",name:"Club Hoodie 2026/27",quality:"Stadium",price:250,variants:VARIANTS,sizes:ADULT_SIZES,season:"2026/27",tag:"NEW",tagC:GREEN},
      ]
    },
    {
      id:"gk",label:"GOALKEEPER",sublabel:"Between the Sticks",emoji:"🧤",
      bg:`linear-gradient(135deg,#1a0050 0%,#3a0090 100%)`,
      accent:"#a78bfa",textColor:WHITE,new:true,
      desc:"Official goalkeeper kit. High-vis. Limited edition.",
      products:[
        {id:"gk_kit",name:"GK Kit 2026/27",quality:"Stadium",price:300,variants:["Men"],sizes:["M","L","XL","XXL","XXXL"],season:"2026/27",tag:"LIMITED",tagC:"#7c3aed"},
      ]
    },
  ]

  const ALL_PRODUCTS = COLLECTIONS.flatMap(c=>c.products.map(p=>({...p,collection:c.id,collLabel:c.label})))

  const handleAddToCart = (product, size, variant, quality, customization={}) => {
    const item = {
      ...product, size, variant, quality,
      customName:customization.name||"",
      player:customization.player||"",
      cartId: `${product.id}_${size}_${variant}_${Date.now()}`,
    }
    setCart(prev=>[...prev,{...item,qty:1}])
    setShopView("home")
    setSelProduct(null)
    setSelSize("")
  }

  const SIZE_GUIDE = [
    {s:"XS",chest:"80–84",waist:"70–74",hip:"86–90"},
    {s:"S", chest:"88–92",waist:"78–82",hip:"94–98"},
    {s:"M", chest:"96–100",waist:"86–90",hip:"102–106"},
    {s:"L", chest:"104–108",waist:"94–98",hip:"110–114"},
    {s:"XL",chest:"112–116",waist:"102–106",hip:"118–122"},
    {s:"XXL",chest:"120–124",waist:"110–114",hip:"126–130"},
    {s:"XXXL",chest:"128–132",waist:"118–122",hip:"134–138"},
    {s:"XXXXL",chest:"136–140",waist:"126–130",hip:"142–146"},
  ]

  const [heroBanner, setHeroBanner] = useState(0)
  const BANNERS = [
    {title:"2026/27 KITS",sub:"Home & Away now available",emoji:"⚽",bg:`linear-gradient(135deg,${NAVY},#1a3060)`,accent:GOLD,cta:"SHOP KITS →",col:"home2627"},
    {title:"THE HONEY BADGER",sub:"Fan gear — show your colours",emoji:"🦡",bg:`linear-gradient(135deg,#D4A800,#0D1B3E)`,accent:WHITE,cta:"SHOP FAN GEAR →",col:"fanwear"},
    {title:"RETRO COLLECTION",sub:"Iconic kits from past seasons",emoji:"🏆",bg:`linear-gradient(135deg,#2d1b00,#4a2e00)`,accent:GOLD,cta:"SHOP RETRO →",col:"retro"},
  ]
  useEffect(()=>{
    const id = setInterval(()=>setHeroBanner(b=>(b+1)%BANNERS.length), 4000)
    return ()=>clearInterval(id)
  },[])

  /* ── STORE HOME ── */
  const HomeView = () => (
    <div ref={scrollAreaRef} style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",background:"#f5f6fa"}}>

      <div style={{position:"relative",overflow:"hidden",flexShrink:0}}>
        <div style={{background:BANNERS[heroBanner].bg,
          padding:"clamp(24px,6vw,36px) clamp(16px,4vw,20px) clamp(20px,5vw,28px)",
          transition:"background 0.6s",position:"relative",overflow:"hidden",
          minHeight:"clamp(160px,40vw,200px)",display:"flex",flexDirection:"column",
          justifyContent:"center"}}>
          <div style={{position:"absolute",right:-20,top:-20,opacity:0.06}}><Logo size={200}/></div>
          <div style={{fontSize:"clamp(36px,10vw,52px)",marginBottom:8}}>{BANNERS[heroBanner].emoji}</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:"clamp(22px,7vw,32px)",color:BANNERS[heroBanner].accent,
            lineHeight:1,letterSpacing:"0.04em"}}>{BANNERS[heroBanner].title}</div>
          <div style={{fontSize:"clamp(11px,3vw,13px)",color:"rgba(255,255,255,0.7)",
            marginTop:4,marginBottom:14}}>{BANNERS[heroBanner].sub}</div>
          <button onClick={()=>{setActiveCol(BANNERS[heroBanner].col);setShopView("collection")}}
            style={{alignSelf:"flex-start",background:BANNERS[heroBanner].accent,
              border:"none",borderRadius:8,padding:"8px 18px",minHeight:38,
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:"clamp(11px,3vw,13px)",color:NAVY,
              cursor:"pointer",WebkitTapHighlightColor:"transparent",
              letterSpacing:"0.06em"}}>
            {BANNERS[heroBanner].cta}
          </button>
        </div>
        <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",
          display:"flex",gap:5}}>
          {BANNERS.map((_,i)=>(
            <div key={i} onClick={()=>setHeroBanner(i)}
              style={{width:i===heroBanner?20:6,height:6,borderRadius:3,
                background:i===heroBanner?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.35)",
                cursor:"pointer",transition:"width 0.3s"}}/>
          ))}
        </div>
      </div>

      {/* Customize Jersey CTA — prominent banner */}
      <div style={{margin:"12px 12px 0"}}>
        <button onClick={()=>{setSubTab("customize");setShopView("home")}} style={{
          width:"100%",padding:"14px 16px",
          background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
          border:"none",borderRadius:14,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          cursor:"pointer",WebkitTapHighlightColor:"transparent",
          boxShadow:"0 4px 14px rgba(245,197,24,0.35)",minHeight:60,
        }}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:28}}>👕</span>
            <div style={{textAlign:"left"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:16,color:NAVY}}>CUSTOMIZE YOUR JERSEY</div>
              <div style={{fontSize:12,color:"rgba(13,27,62,0.7)",marginTop:1}}>
                Pick a player name · your number · your kit
              </div>
            </div>
          </div>
          <div style={{background:NAVY,color:GOLD,fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:900,fontSize:12,padding:"6px 12px",borderRadius:8,flexShrink:0}}>
            BUILD →
          </div>
        </button>
      </div>

      {!isMember&&(
        <div onClick={openMembership}
          style={{margin:"10px 12px 0",background:`linear-gradient(135deg,${NAVY},#1a3060)`,
            borderRadius:12,padding:"12px 16px",
            display:"flex",alignItems:"center",justifyContent:"space-between",
            cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:13,color:GOLD}}>🦡 JOIN HONEY BADGER — SAVE 5% ON ALL ORDERS</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>
              Plus exclusive promo codes & early access
            </div>
          </div>
          <div style={{background:GOLD,color:NAVY,fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:900,fontSize:11,padding:"5px 10px",borderRadius:6,flexShrink:0}}>
            JOIN →
          </div>
        </div>
      )}

      <div style={{padding:"16px 12px 8px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:"clamp(16px,5vw,20px)",color:NAVY,marginBottom:12,
          letterSpacing:"0.04em"}}>COLLECTIONS</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:4}}>
          {COLLECTIONS.map((col,i)=>(
            <div key={col.id}
              onClick={()=>{setActiveCol(col.id);setShopView("collection")}}
              style={{
                borderRadius:14,overflow:"hidden",cursor:"pointer",
                background:col.bg,minHeight:"clamp(100px,28vw,130px)",
                display:"flex",flexDirection:"column",justifyContent:"flex-end",
                padding:"10px 12px",position:"relative",
                boxShadow:"0 4px 14px rgba(0,0,0,0.15)",
                WebkitTapHighlightColor:"transparent",
                gridColumn: i===0?"1/3":undefined,
              }}>
              <div style={{position:"absolute",top:-10,right:-10,opacity:0.08,fontSize:80,lineHeight:1}}>{col.emoji}</div>
              {col.new&&(
                <div style={{position:"absolute",top:10,right:10,
                  background:GREEN,color:WHITE,fontSize:9,fontWeight:900,
                  padding:"2px 7px",borderRadius:4,
                  fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em"}}>NEW</div>
              )}
              <div style={{fontSize:"clamp(20px,5vw,26px)",marginBottom:4}}>{col.emoji}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:"clamp(14px,4vw,18px)",color:col.accent||WHITE,lineHeight:1}}>{col.label}</div>
              <div style={{fontSize:"clamp(9px,2.5vw,11px)",color:"rgba(255,255,255,0.6)",marginTop:2}}>{col.sublabel}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"4px 12px 20px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:"clamp(16px,5vw,20px)",color:NAVY,marginBottom:12,
          letterSpacing:"0.04em"}}>BEST SELLERS</div>
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,
          WebkitOverflowScrolling:"touch"}}>
          {ALL_PRODUCTS.filter((_,i)=>[0,3,6,10,12].includes(i)).map(p=>(
            <div key={p.id}
              onClick={()=>{setSelProduct(p);setSelSize("");setSelVariant("Men");setSelQuality(p.quality||"Stadium");setShopView("product")}}
              style={{flexShrink:0,width:"clamp(130px,36vw,160px)",borderRadius:14,
                overflow:"hidden",background:WHITE,
                boxShadow:"0 2px 10px rgba(0,0,0,0.08)",border:"1.5px solid #eee",
                cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
              <div style={{height:100,background:`linear-gradient(160deg,${NAVY},#1a3060)`,
                position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{opacity:0.07,position:"absolute"}}><Logo size={80}/></div>
                <span style={{fontSize:44,zIndex:1}}>{COLLECTIONS.find(c=>c.id===p.collection)?.emoji||"⚽"}</span>
                <div style={{position:"absolute",top:7,left:7,
                  background:p.tagC,color:WHITE,fontSize:8,fontWeight:900,
                  padding:"2px 6px",borderRadius:3,
                  fontFamily:"'Barlow Condensed',sans-serif"}}>{p.tag}</div>
              </div>
              <div style={{padding:"8px 10px 10px"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:"clamp(11px,3vw,13px)",color:NAVY,lineHeight:1.2,marginBottom:4,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:"clamp(14px,4vw,17px)",color:NAVY}}>
                  P{discPrice(p.price)}
                  {totalDisc>0&&<span style={{fontSize:10,color:MGRAY,textDecoration:"line-through",marginLeft:4}}>P{p.price}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  /* ── COLLECTION VIEW ── */
  const CollectionView = () => {
    const col = COLLECTIONS.find(c=>c.id===activeCol)
    if(!col) return null
    return (
      <div ref={scrollAreaRef} style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:col.bg,padding:"16px 14px 14px",flexShrink:0}}>
          <button onClick={()=>setShopView("home")}
            style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,
              padding:"6px 12px",color:WHITE,fontSize:13,cursor:"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,marginBottom:10,
              WebkitTapHighlightColor:"transparent"}}>
            ← BACK
          </button>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:32}}>{col.emoji}</span>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:22,color:col.accent||WHITE,lineHeight:1}}>{col.label}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>{col.sublabel}</div>
            </div>
          </div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.65)",marginTop:8,lineHeight:1.5}}>
            {col.desc}
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"12px",
          background:"#f5f6fa",WebkitOverflowScrolling:"touch"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {col.products.map(p=>(
              <div key={p.id}
                onClick={()=>{setSelProduct(p);setSelSize("");setSelVariant(p.variants[0]);setSelQuality(p.quality||"Stadium");setShopView("product")}}
                style={{borderRadius:14,overflow:"hidden",background:WHITE,
                  boxShadow:"0 2px 10px rgba(0,0,0,0.08)",border:"1.5px solid #eee",
                  cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                <div style={{height:110,background:`linear-gradient(160deg,${NAVY},#1a3060)`,
                  position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{opacity:0.07,position:"absolute"}}><Logo size={80}/></div>
                  <span style={{fontSize:50,zIndex:1}}>{col.emoji}</span>
                  <div style={{position:"absolute",top:8,left:8,
                    background:p.tagC,color:WHITE,fontSize:8,fontWeight:900,
                    padding:"2px 6px",borderRadius:3,
                    fontFamily:"'Barlow Condensed',sans-serif"}}>{p.tag}</div>
                  {(totalDisc>0)&&(
                    <div style={{position:"absolute",bottom:8,right:8,
                      background:RED,color:WHITE,fontSize:8,fontWeight:900,
                      padding:"2px 6px",borderRadius:3,
                      fontFamily:"'Barlow Condensed',sans-serif"}}>-{totalDisc}%</div>
                  )}
                </div>
                <div style={{padding:"10px 10px 12px"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                    fontSize:"clamp(11px,3vw,13px)",color:NAVY,lineHeight:1.2,marginBottom:6,
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                    fontSize:"clamp(14px,4vw,17px)",color:NAVY}}>P{discPrice(p.price)}</div>
                  {p.price!==discPrice(p.price)&&(
                    <div style={{fontSize:10,color:MGRAY,textDecoration:"line-through"}}>P{p.price}</div>
                  )}
                  <div style={{fontSize:10,color:MGRAY,marginTop:2}}>{p.quality} · {p.variants.join(" / ")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ── PRODUCT DETAIL ── */
  const ProductView = () => {
    if(!selProduct) return null
    const p = selProduct
    const col = COLLECTIONS.find(c=>c.id===p.collection)
    const finalPrice = discPrice(p.price)
    const [showGuide, setShowGuide] = useState(false)

    return (
      <div ref={scrollAreaRef} style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:WHITE}}>
        <div style={{background:`linear-gradient(135deg,${NAVY},#1a3060)`,
          padding:"14px 16px",flexShrink:0,
          display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setShopView(activeCol?"collection":"home")}
            style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,
              padding:"6px 12px",color:WHITE,fontSize:13,cursor:"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,flexShrink:0,
              WebkitTapHighlightColor:"transparent"}}>← BACK</button>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:16,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",
            whiteSpace:"nowrap"}}>{p.name}</div>
        </div>

        <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
          <div style={{background:`linear-gradient(160deg,${NAVY},#1a3060)`,
            height:"clamp(160px,40vw,200px)",position:"relative",
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{opacity:0.06,position:"absolute"}}><Logo size={160}/></div>
            <span style={{fontSize:"clamp(60px,18vw,90px)",zIndex:1}}>{col?.emoji||"⚽"}</span>
            <div style={{position:"absolute",top:12,left:12,
              background:p.tagC,color:WHITE,fontSize:10,fontWeight:900,
              padding:"3px 9px",borderRadius:4,
              fontFamily:"'Barlow Condensed',sans-serif"}}>{p.tag}</div>
            {totalDisc>0&&(
              <div style={{position:"absolute",top:12,right:12,
                background:RED,color:WHITE,fontSize:10,fontWeight:900,
                padding:"3px 9px",borderRadius:4,
                fontFamily:"'Barlow Condensed',sans-serif"}}>-{totalDisc}% OFF</div>
            )}
          </div>

          <div style={{padding:"16px 14px"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:"clamp(18px,5vw,22px)",color:NAVY,lineHeight:1,marginBottom:8}}>
              {p.name}
            </div>
            <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:14}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:"clamp(26px,8vw,34px)",color:NAVY}}>P{finalPrice}</span>
              {p.price!==finalPrice&&(
                <span style={{fontSize:14,color:MGRAY,textDecoration:"line-through"}}>P{p.price}</span>
              )}
            </div>

            {/* Quality selector */}
            {p.variants[0]!=="Junior"&&(
              <>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>QUALITY</div>
                <div style={{display:"flex",gap:8,marginBottom:14}}>
                  {QUALITIES.map(q=>(
                    <button key={q} onClick={()=>setSelQuality(q)} style={{
                      flex:1,padding:"9px 0",borderRadius:10,minHeight:42,
                      border:`2px solid ${selQuality===q?NAVY:"#e5e7eb"}`,
                      background:selQuality===q?NAVY:WHITE,
                      color:selQuality===q?WHITE:NAVY,
                      fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                      fontSize:13,cursor:"pointer",WebkitTapHighlightColor:"transparent",
                    }}>
                      {q}{q==="Match"?" +P100":""}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Variant */}
            {p.variants.length>1&&(
              <>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>VARIANT</div>
                <div style={{display:"flex",gap:8,marginBottom:14}}>
                  {p.variants.map(v=>(
                    <button key={v} onClick={()=>setSelVariant(v)} style={{
                      flex:1,padding:"9px 0",borderRadius:10,minHeight:42,
                      border:`2px solid ${selVariant===v?NAVY:"#e5e7eb"}`,
                      background:selVariant===v?NAVY:WHITE,
                      color:selVariant===v?WHITE:NAVY,
                      fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                      fontSize:13,cursor:"pointer",WebkitTapHighlightColor:"transparent",
                    }}>{v}</button>
                  ))}
                </div>
              </>
            )}

            {/* Size */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:11,color:MGRAY,letterSpacing:"0.08em"}}>SIZE</div>
              <button onClick={()=>setShowGuide(s=>!s)}
                style={{background:"none",border:"none",cursor:"pointer",
                  fontSize:11,color:NAVY,fontWeight:700,textDecoration:"underline"}}>
                Size Guide
              </button>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              {p.sizes.map(sz=>(
                <button key={sz} onClick={()=>setSelSize(sz)} style={{
                  minWidth:"clamp(38px,10vw,48px)",height:"clamp(38px,10vw,48px)",
                  borderRadius:9,
                  border:`2px solid ${selSize===sz?NAVY:"#e5e7eb"}`,
                  background:selSize===sz?NAVY:WHITE,
                  color:selSize===sz?WHITE:NAVY,
                  fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:"clamp(10px,3vw,13px)",cursor:"pointer",padding:"0 6px",
                  WebkitTapHighlightColor:"transparent",
                }}>{sz}</button>
              ))}
            </div>

            {showGuide&&(
              <div style={{background:LGRAY,borderRadius:10,padding:"10px",marginBottom:12,overflowX:"auto"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:11,color:NAVY,marginBottom:8}}>SIZE GUIDE (cm)</div>
                <table style={{borderCollapse:"collapse",fontSize:10,minWidth:280,width:"100%"}}>
                  <thead>
                    <tr style={{background:NAVY}}>
                      {["SIZE","CHEST","WAIST","HIP"].map(h=>(
                        <th key={h} style={{padding:"4px 8px",color:WHITE,
                          fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                          fontSize:9,textAlign:"left"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_GUIDE.map((r,i)=>(
                      <tr key={r.s} style={{background:selSize===r.s?`${GOLD}33`:i%2===0?WHITE:LGRAY}}>
                        <td style={{padding:"4px 8px",fontWeight:800,color:NAVY}}>{r.s}</td>
                        <td style={{padding:"4px 8px",color:MGRAY}}>{r.chest}</td>
                        <td style={{padding:"4px 8px",color:MGRAY}}>{r.waist}</td>
                        <td style={{padding:"4px 8px",color:MGRAY}}>{r.hip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Want to customise? Redirect to dedicated section */}
            <div style={{background:`${GOLD}18`,border:`1.5px solid ${GOLD}`,borderRadius:12,
              padding:"12px 14px",marginBottom:14,
              display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
              <div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:13,color:NAVY}}>👕 Want your name & number?</div>
                <div style={{fontSize:11,color:MGRAY,marginTop:2}}>
                  Use our dedicated Customize section
                </div>
              </div>
              <button onClick={()=>{setSubTab("customize");setShopView("home")}}
                style={{background:NAVY,border:"none",borderRadius:8,padding:"7px 12px",
                  fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:11,
                  color:GOLD,cursor:"pointer",flexShrink:0,
                  WebkitTapHighlightColor:"transparent"}}>
                CUSTOMIZE →
              </button>
            </div>

            <button
              onClick={()=>{
                if(!selSize){ return }
                const q = selQuality==="Match"?p.price+100:p.price
                handleAddToCart({...p,price:q},selSize,selVariant,selQuality,{})
              }}
              disabled={!selSize}
              style={{width:"100%",padding:"16px",minHeight:54,
                background:selSize?NAVY:"#e5e7eb",border:"none",borderRadius:12,
                fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:17,
                color:selSize?WHITE:"#aaa",cursor:selSize?"pointer":"not-allowed",
                WebkitTapHighlightColor:"transparent",
                boxShadow:selSize?"0 4px 14px rgba(13,27,62,0.3)":"none",
                transition:"all 0.15s",letterSpacing:"0.04em"}}>
              {selSize
                ? `ADD TO CART — P${discPrice(selQuality==="Match"?p.price+100:p.price)}`
                : "SELECT A SIZE TO CONTINUE"}
            </button>
            <div style={{height:20}}/>
          </div>
        </div>
      </div>
    )
  }

  /* ── CART VIEW ── */
  const CartView = () => (
    <div ref={scrollAreaRef} style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:WHITE}}>
      <div style={{background:NAVY,padding:"14px 16px",flexShrink:0,
        display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>setShopView("home")}
          style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,
            padding:"6px 12px",color:WHITE,fontSize:13,cursor:"pointer",
            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
            WebkitTapHighlightColor:"transparent"}}>← CONTINUE SHOPPING</button>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:16,color:WHITE}}>CART ({cartQty})</div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"12px 14px",
        WebkitOverflowScrolling:"touch",background:"#f5f6fa"}}>
        {cart.length===0?(
          <div style={{textAlign:"center",padding:"48px 20px"}}>
            <div style={{fontSize:52,marginBottom:12}}>🛒</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:20,color:NAVY,marginBottom:6}}>YOUR CART IS EMPTY</div>
            <div style={{fontSize:13,color:MGRAY,marginBottom:20}}>Add some items to get started</div>
            <button onClick={()=>setShopView("home")}
              style={{background:NAVY,border:"none",borderRadius:10,padding:"12px 24px",
                fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:14,
                color:WHITE,cursor:"pointer"}}>BROWSE STORE</button>
          </div>
        ):(
          <>
            {totalDisc>0&&(
              <div style={{background:`${GREEN}18`,border:`1px solid ${GREEN}44`,
                borderRadius:10,padding:"10px 14px",marginBottom:12,
                display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>🎉</span>
                <div style={{fontSize:12,color:GREEN,fontWeight:700}}>
                  You're saving P{savedTotal} on this order! ({totalDisc}% off)
                </div>
              </div>
            )}

            {cart.map((item,i)=>(
              <div key={item.cartId} style={{background:WHITE,borderRadius:12,
                marginBottom:10,overflow:"hidden",
                boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
                <div style={{display:"flex",gap:12,padding:"12px 14px"}}>
                  <div style={{width:60,height:60,borderRadius:10,
                    background:`linear-gradient(135deg,${NAVY},#1a3060)`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:28,flexShrink:0}}>
                    {COLLECTIONS.find(c=>c.id===item.collection)?.emoji||"⚽"}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                      fontSize:14,color:NAVY,overflow:"hidden",textOverflow:"ellipsis",
                      whiteSpace:"nowrap"}}>{item.name}</div>
                    <div style={{fontSize:11,color:MGRAY,marginTop:2}}>
                      {item.variant} · {item.size} · {item.quality}
                      {item.player&&` · ${item.player}`}
                      {item.customName&&` · "${item.customName}"`}
                      {item.number&&` · #${item.number}`}
                    </div>
                    <div style={{display:"flex",alignItems:"center",
                      justifyContent:"space-between",marginTop:6}}>
                      <div>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                          fontWeight:900,fontSize:16,color:NAVY}}>
                          P{discPrice(item.price)}
                        </span>
                        {item.price!==discPrice(item.price)&&(
                          <span style={{fontSize:10,color:MGRAY,
                            textDecoration:"line-through",marginLeft:5}}>
                            P{item.price}
                          </span>
                        )}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <button onClick={()=>setCart(prev=>prev.map((c,j)=>j===i?{...c,qty:Math.max(1,c.qty-1)}:c))}
                          style={{width:28,height:28,borderRadius:"50%",background:LGRAY,
                            border:"none",cursor:"pointer",fontSize:16,fontWeight:700,
                            display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
                        <span style={{fontWeight:700,fontSize:14,minWidth:16,textAlign:"center"}}>
                          {item.qty}
                        </span>
                        <button onClick={()=>setCart(prev=>prev.map((c,j)=>j===i?{...c,qty:c.qty+1}:c))}
                          style={{width:28,height:28,borderRadius:"50%",background:LGRAY,
                            border:"none",cursor:"pointer",fontSize:16,fontWeight:700,
                            display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                        <button onClick={()=>setCart(prev=>prev.filter((_,j)=>j!==i))}
                          style={{background:"#fef2f2",border:"none",borderRadius:6,
                            padding:"4px 8px",fontSize:11,color:RED,fontWeight:700,cursor:"pointer"}}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{background:WHITE,borderRadius:12,padding:"12px 14px",
              marginBottom:10,boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:11,color:NAVY,letterSpacing:"0.08em",marginBottom:8}}>🎟 PROMO CODE</div>
              <div style={{display:"flex",gap:8}}>
                <input placeholder="Enter code" value={promoInput}
                  onChange={e=>setPromoInput(e.target.value.toUpperCase())}
                  style={{flex:1,padding:"9px 12px",borderRadius:8,
                    border:`1.5px solid ${promoMsg?.ok?GREEN:promoMsg?.ok===false?RED:"#ddd"}`,
                    fontSize:13,outline:"none",fontFamily:"'Barlow Condensed',sans-serif",
                    fontWeight:700,letterSpacing:"0.06em"}}/>
                <button onClick={applyPromo}
                  style={{background:NAVY,border:"none",borderRadius:8,padding:"9px 14px",
                    color:WHITE,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                    fontSize:12,cursor:"pointer",flexShrink:0}}>APPLY</button>
              </div>
              {promoMsg&&(
                <div style={{marginTop:6,fontSize:11,fontWeight:700,color:promoMsg.ok?GREEN:RED}}>
                  {promoMsg.ok?"✓":"✗"} {promoMsg.text}
                </div>
              )}
            </div>

            <div style={{background:WHITE,borderRadius:12,padding:"14px",
              boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:13,color:NAVY,marginBottom:10}}>ORDER SUMMARY</div>
              {[
                ["Subtotal",`P${cart.reduce((s,i)=>s+i.price*i.qty,0)}`],
                isMember?[`Member discount (-${memberDisc}%)`,`-P${Math.round(cart.reduce((s,i)=>s+i.price*memberDisc/100*i.qty,0))}`]:null,
                promoMsg?.ok?[`Promo ${promoCode} (-${promoDisc}%)`,`-P${Math.round(cart.reduce((s,i)=>s+i.price*promoDisc/100*i.qty,0))}`]:null,
                ["Delivery","To be confirmed"],
              ].filter(Boolean).map(([label,val],i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",
                  padding:"5px 0",borderBottom:"1px solid #f0f0f0",
                  fontSize:13,color:label.includes("discount")||label.includes("Promo")?GREEN:NAVY}}>
                  <span>{label}</span>
                  <span style={{fontWeight:label==="Delivery"?400:600}}>{val}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",
                padding:"10px 0 0",fontSize:16,fontWeight:900,color:NAVY,
                fontFamily:"'Barlow Condensed',sans-serif"}}>
                <span>TOTAL</span><span>P{cartSubtotal}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {cart.length>0&&(
        <div style={{padding:"12px 14px",background:WHITE,borderTop:"1px solid #eee",flexShrink:0}}>
          <button onClick={()=>setShopView("checkout")}
            style={{width:"100%",padding:"16px",background:NAVY,border:"none",
              borderRadius:12,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:17,color:WHITE,cursor:"pointer",minHeight:54,
              boxShadow:"0 4px 14px rgba(13,27,62,0.3)",letterSpacing:"0.04em",
              WebkitTapHighlightColor:"transparent"}}>
            CHECKOUT — P{cartSubtotal} →
          </button>
        </div>
      )}
    </div>
  )

  /* ── CHECKOUT VIEW ── */
  const CheckoutView = () => {
    const [name,    setName]    = useState(profile?.full_name||"")
    const [email,   setEmail]   = useState(session?.user?.email||"")
    const [phone,   setPhone]   = useState("")
    const [address, setAddress] = useState("")
    const [err,     setErr]     = useState("")
    const [loading, setLoading] = useState(false)

    const PAY_METHODS = [
      {id:"orange",label:"Orange Money",icon:"🟠",desc:"Dial *145#"},
      {id:"myzaka", label:"MyZaka",      icon:"🔵",desc:"Dial *167#"},
      {id:"eft",    label:"Bank Transfer",icon:"🏦",desc:"FNB / BancABC"},
    ]

    const confirmOrder = async () => {
      if(!name||!email||!phone){setErr("Please fill in all fields.");return}
      if(!payMethod){setErr("Please select a payment method.");return}
      if(!payRef.trim()){setErr("Please enter your payment reference.");return}
      setLoading(true)
      try {
        await supabase.from("orders").insert({
          user_id:session?.user?.id||null,email,full_name:name,phone,address,
          items:JSON.stringify(cart),subtotal:cartSubtotal,discount:savedTotal,
          total:cartSubtotal,promo_code:promoCode||null,is_member:isMember,
          pay_method:payMethod,pay_ref:payRef,status:"pending",
        })
        setCheckStep(3); setCart([])
      } catch(e){ setErr("Order failed. Please try again.") }
      setLoading(false)
    }

    if(checkStep===3) return (
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",padding:"32px 20px",textAlign:"center",background:WHITE}}>
        <div style={{fontSize:60,marginBottom:12}}>🎉</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:26,color:NAVY,marginBottom:8}}>ORDER PLACED!</div>
        <div style={{fontSize:13,color:MGRAY,lineHeight:1.7,marginBottom:24,maxWidth:300}}>
          Thank you! Your order has been received. We'll confirm once payment is verified.
          Delivery: 3–7 working days.
        </div>
        <button onClick={()=>{setShopView("home");setCheckStep(1);setPayMethod("");setPayRef("")}}
          style={{background:NAVY,border:"none",borderRadius:12,padding:"14px 32px",
            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,
            color:WHITE,cursor:"pointer"}}>BACK TO STORE</button>
      </div>
    )

    return (
      <div ref={scrollAreaRef} style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:NAVY,padding:"14px 16px",flexShrink:0,
          display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setShopView("cart")}
            style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,
              padding:"6px 12px",color:WHITE,fontSize:13,cursor:"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,flexShrink:0}}>
            ← BACK
          </button>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,color:WHITE}}>CHECKOUT</div>
          <div style={{marginLeft:"auto",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,color:GOLD}}>P{cartSubtotal}</div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"14px",background:"#f5f6fa",WebkitOverflowScrolling:"touch"}}>
          {checkStep===1&&(
            <div style={{background:WHITE,borderRadius:12,padding:"14px",boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,color:NAVY,marginBottom:12}}>DELIVERY DETAILS</div>
              {[
                {label:"FULL NAME",val:name,set:setName,type:"text",ph:"Your full name"},
                {label:"EMAIL",val:email,set:setEmail,type:"email",ph:"your@email.com"},
                {label:"PHONE",val:phone,set:setPhone,type:"tel",ph:"+267 7X XXX XXX"},
                {label:"DELIVERY ADDRESS",val:address,set:setAddress,type:"text",ph:"Village / Town / Street"},
              ].map(f=>(
                <div key={f.label} style={{marginBottom:12}}>
                  <label style={{fontSize:10,fontWeight:700,color:MGRAY,
                    fontFamily:"'Barlow Condensed',sans-serif",display:"block",
                    marginBottom:4,letterSpacing:"0.06em"}}>{f.label}</label>
                  <input type={f.type} value={f.val} placeholder={f.ph}
                    onChange={e=>f.set(e.target.value)}
                    style={{width:"100%",padding:"11px 12px",borderRadius:8,
                      border:"1.5px solid #e5e7eb",fontSize:14,outline:"none",
                      boxSizing:"border-box",fontFamily:"inherit"}}
                    onFocus={e=>e.target.style.borderColor=GOLD}
                    onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
                </div>
              ))}
              {err&&<div style={{color:RED,fontSize:12,marginBottom:10,fontWeight:600}}>{err}</div>}
              <button onClick={()=>{
                if(!name||!email||!phone){setErr("Please fill in all required fields.");return}
                setErr("");setCheckStep(2)
              }}
                style={{width:"100%",padding:"14px",background:NAVY,border:"none",
                  borderRadius:10,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:15,color:WHITE,cursor:"pointer",minHeight:50}}>
                CONTINUE TO PAYMENT →
              </button>
            </div>
          )}

          {checkStep===2&&(
            <div>
              <div style={{background:WHITE,borderRadius:12,padding:"14px",marginBottom:10,boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,color:NAVY,marginBottom:12}}>PAYMENT METHOD</div>
                {PAY_METHODS.map(m=>(
                  <div key={m.id} onClick={()=>setPayMethod(m.id)}
                    style={{padding:"12px 14px",borderRadius:10,cursor:"pointer",
                      border:`2px solid ${payMethod===m.id?NAVY:"#e5e7eb"}`,
                      background:payMethod===m.id?"#eef1f8":WHITE,
                      display:"flex",alignItems:"center",gap:12,marginBottom:8,
                      WebkitTapHighlightColor:"transparent"}}>
                    <span style={{fontSize:22}}>{m.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:NAVY}}>{m.label}</div>
                      <div style={{fontSize:11,color:MGRAY}}>{m.desc}</div>
                    </div>
                    <div style={{width:20,height:20,borderRadius:"50%",
                      border:`2px solid ${payMethod===m.id?NAVY:"#ddd"}`,
                      background:payMethod===m.id?NAVY:"none",
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {payMethod===m.id&&<span style={{color:WHITE,fontSize:10}}>✓</span>}
                    </div>
                  </div>
                ))}
              </div>

              {payMethod&&(
                <div style={{background:WHITE,borderRadius:12,padding:"14px",marginBottom:10,boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
                  <div style={{background:NAVY,borderRadius:10,padding:"14px",textAlign:"center",marginBottom:14}}>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontFamily:"'Barlow Condensed',sans-serif",marginBottom:4}}>AMOUNT DUE</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:36,color:GOLD}}>P{cartSubtotal}</div>
                  </div>
                  <div style={{background:`${GOLD}18`,border:`1px solid ${GOLD}44`,borderRadius:8,padding:"10px 12px",marginBottom:12}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:11,color:GOLD2,marginBottom:6}}>HOW TO PAY</div>
                    {payMethod==="orange"&&<div style={{fontSize:12,color:NAVY,lineHeight:1.7}}>1. Dial <strong>*145#</strong><br/>2. Send <strong>P{cartSubtotal}</strong> to <strong>74000001</strong><br/>3. Reference: <strong>VILLAREAL-ORDER</strong></div>}
                    {payMethod==="myzaka"&&<div style={{fontSize:12,color:NAVY,lineHeight:1.7}}>1. Dial <strong>*167#</strong><br/>2. Send <strong>P{cartSubtotal}</strong> to <strong>74000001</strong><br/>3. Reference: <strong>VILLAREAL-ORDER</strong></div>}
                    {payMethod==="eft"&&<div style={{fontSize:12,color:NAVY,lineHeight:1.7}}>Bank: <strong>FNB Botswana</strong><br/>Account: <strong>62012345678</strong><br/>Branch: <strong>282672</strong><br/>Amount: <strong>P{cartSubtotal}</strong></div>}
                  </div>
                  <label style={{fontSize:10,fontWeight:700,color:MGRAY,fontFamily:"'Barlow Condensed',sans-serif",display:"block",marginBottom:4,letterSpacing:"0.06em"}}>PAYMENT REFERENCE</label>
                  <input placeholder="e.g. TXN123456789" value={payRef}
                    onChange={e=>setPayRef(e.target.value)}
                    style={{width:"100%",padding:"12px",borderRadius:8,
                      border:`1.5px solid ${payRef?GOLD:"#e5e7eb"}`,fontSize:14,
                      outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
                </div>
              )}

              {err&&<div style={{color:RED,fontSize:12,marginBottom:10,fontWeight:600}}>{err}</div>}
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>{setErr("");setCheckStep(1)}}
                  style={{flex:1,padding:"13px",background:"#f0f0f0",border:"none",borderRadius:10,
                    fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:14,color:NAVY,cursor:"pointer",minHeight:48}}>
                  ← BACK
                </button>
                <button onClick={confirmOrder} disabled={loading||!payMethod||!payRef}
                  style={{flex:2,padding:"13px",
                    background:loading||!payMethod||!payRef?"#e5e7eb":GREEN,
                    border:"none",borderRadius:10,
                    fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:14,
                    color:loading||!payMethod||!payRef?"#aaa":WHITE,
                    cursor:loading||!payMethod||!payRef?"not-allowed":"pointer",minHeight:48}}>
                  {loading?"PROCESSING...":"CONFIRM ORDER ✓"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ── TICKETS TAB ── */
  const TicketsTab=()=>(
    <div ref={scrollAreaRef} style={{overflowY:"auto",flex:1,padding:12,WebkitOverflowScrolling:"touch",background:"#f5f6fa"}}>
      {fixtures.filter(f=>!f.result).length===0&&(
        <div style={{textAlign:"center",padding:"40px 20px",color:MGRAY,fontSize:13}}>No upcoming fixtures.</div>
      )}
      {fixtures.filter(f=>!f.result).map(fx=>(
        <div key={fx.id} style={{borderRadius:12,overflow:"hidden",marginBottom:10,
          boxShadow:"0 1px 6px rgba(0,0,0,0.08)",background:WHITE}}>
          <div style={{background:NAVY,padding:"8px 14px",display:"flex",
            justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:GOLD}}>
              {new Date(fx.match_date).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}).toUpperCase()}
            </span>
            <span style={{background:fx.venue==="HOME"?GREEN:RED,color:WHITE,
              fontSize:9,fontWeight:900,padding:"2px 7px",borderRadius:4,
              fontFamily:"'Barlow Condensed',sans-serif"}}>{fx.venue}</span>
          </div>
          <div style={{padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
            <div style={{minWidth:0}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:NAVY,
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>VILLAREAL FC vs {fx.opponent}</div>
              <div style={{fontSize:11,color:MGRAY,marginTop:2}}>{fx.competition}</div>
            </div>
            <button style={{background:GOLD,border:"none",borderRadius:8,padding:"9px 16px",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,color:NAVY,
              cursor:"pointer",flexShrink:0,minHeight:40}}>
              {fx.venue==="HOME"?`BUY P25`:"AWAY"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  /* ── MEMBERSHIP TAB ── */
  const MembershipTab=()=>{
    const [billing,setBilling]=useState("yearly")
    const isYearly=billing==="yearly"
    return (
      <div ref={scrollAreaRef} style={{overflowY:"auto",flex:1,WebkitOverflowScrolling:"touch"}}>
        <div style={{background:`linear-gradient(160deg,${NAVY},#0a1428)`,
          padding:"clamp(18px,5vw,28px) clamp(14px,4vw,20px)",position:"relative",overflow:"hidden"}}>
          <div style={{opacity:0.07,position:"absolute",right:-20,top:-20}}><Logo size={180}/></div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:"clamp(26px,8vw,40px)",color:WHITE,lineHeight:1}}>THE HONEY BADGER</div>
          <div style={{fontSize:12,color:"#aaa",marginBottom:16,marginTop:4}}>Villareal FC Premium Membership</div>
          <div style={{display:"flex",background:"rgba(255,255,255,0.1)",borderRadius:10,padding:3,marginBottom:16}}>
            {["monthly","yearly"].map(b=>(
              <button key={b} onClick={()=>setBilling(b)} style={{
                flex:1,padding:"9px 0",minHeight:42,
                background:billing===b?WHITE:"none",border:"none",borderRadius:8,
                cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:"clamp(11px,3vw,13px)",color:billing===b?NAVY:"#aaa",
                display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                WebkitTapHighlightColor:"transparent"}}>
                {b.toUpperCase()}
                {b==="yearly"&&<span style={{background:GREEN,color:WHITE,fontSize:9,fontWeight:900,padding:"1px 5px",borderRadius:3}}>SAVE 17%</span>}
              </button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:"clamp(36px,10vw,48px)",color:GOLD}}>P{isYearly?200:20}</span>
            <span style={{color:"#aaa",fontSize:14}}>{isYearly?"/ Year":"/ Month"}</span>
          </div>
          <div style={{fontSize:12,color:"#888",marginBottom:18}}>
            {isYearly?"P20/month equivalent · Save P40 vs monthly":"Or P200/year and save 17%"}
          </div>
          {["Early access to match tickets","10% off match-day tickets",
            "5% off official store","Exclusive member kit number",
            "Priority squad updates","Exclusive promo codes"].map((b,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
              <span style={{color:GOLD,fontSize:16,flexShrink:0}}>✔</span>
              <span style={{color:WHITE,fontSize:"clamp(12px,3.5vw,14px)",
                fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600}}>{b}</span>
            </div>
          ))}
          <div style={{marginTop:22}}>
            <button onClick={openMembership}
              style={{width:"100%",padding:"14px",background:GOLD,border:"none",
                borderRadius:8,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:16,color:NAVY,cursor:"pointer",minHeight:50,
                WebkitTapHighlightColor:"transparent"}}>
              JOIN THE HONEY BADGERS →
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── ROOT RENDER ── */
  const showTabBar = ["home","tickets","membership","customize"].includes(shopView) ||
    ["shop","tickets","membership","customize"].includes(subTab)

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:WHITE,
      overflow:"hidden",position:"relative"}}>

      {showTabBar&&(
        <div style={{display:"flex",borderBottom:`1px solid #eee`,
          padding:"0 14px",gap:0,overflowX:"auto",flexShrink:0,
          alignItems:"center",background:WHITE,zIndex:10}}>
          {["shop","customize","tickets","membership"].map(t=>(
            <button key={t} onClick={()=>{
              setSubTab(t)
              if(t==="shop") setShopView("home")
              else setShopView(t)
            }} style={{
              background:"none",border:"none",cursor:"pointer",padding:"12px 0 10px",
              fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(10px,2.8vw,12px)",
              fontWeight:700,color:subTab===t?NAVY:MGRAY,letterSpacing:"0.04em",
              borderBottom:subTab===t?`2.5px solid ${NAVY}`:"2.5px solid transparent",
              textTransform:"uppercase",WebkitTapHighlightColor:"transparent",
              whiteSpace:"nowrap",marginRight:t!=="membership"?10:0,
            }}>
              {t==="customize"?"✂️ CUSTOMIZE":t.toUpperCase()}
            </button>
          ))}
          <button onClick={()=>setShopView("cart")}
            style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",
              position:"relative",padding:"8px 0",flexShrink:0,
              WebkitTapHighlightColor:"transparent"}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartQty>0&&(
              <div style={{position:"absolute",top:2,right:-4,background:RED,color:WHITE,
                borderRadius:"50%",width:17,height:17,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:9,fontWeight:900}}>{cartQty}</div>
            )}
          </button>
        </div>
      )}

      {shopView==="home"&&subTab==="shop"         && <HomeView/>}
      {shopView==="collection"                     && <CollectionView/>}
      {shopView==="product"                        && <ProductView/>}
      {shopView==="cart"                           && <CartView/>}
      {shopView==="checkout"                       && <CheckoutView/>}
      {subTab==="customize"&&shopView!=="cart"&&shopView!=="checkout" &&
        <CustomizeScreen cart={cart} setCart={setCart} openMembership={openMembership} profile={profile}/>}
      {subTab==="tickets"&&shopView!=="cart"&&shopView!=="checkout"   && <TicketsTab/>}
      {subTab==="membership"&&shopView!=="cart"&&shopView!=="checkout" && <MembershipTab/>}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   AUTH
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
          <Btn onClick={onGuest} bg={WHITE} color={MGRAY} style={{border:`1.5px solid #ddd`}}>
            Continue as Guest
          </Btn>
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
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   PROFILE
══════════════════════════════════════════════════════════════════════════════ */
const ProfileScreen=({session,profile,onLogout,goToAuth,openMembership})=>{
  const benefits=[
    {title:"EARLY ACCESS TO TICKETS",sub:"Exclusive 48hr pre-sale",emoji:"🎟️",bg:"linear-gradient(135deg,#1a3a6e,#0d2244)"},
    {title:"MATCH DAY TICKETS",sub:"10% off every match",emoji:"⚽",bg:"linear-gradient(135deg,#1e4d2b,#0d2a18)"},
    {title:"OFFICIAL STORE",sub:"5% off all merch",emoji:"👕",bg:"linear-gradient(135deg,#4a2000,#2a1200)"},
    {title:"LIVE MATCH STREAMS",sub:"Exclusive access",emoji:"📺",bg:"linear-gradient(135deg,#2a0d4a,#180830)"},
    {title:"MEMBER KIT NUMBER",sub:"Your exclusive squad number",emoji:"🏆",bg:"linear-gradient(135deg,#3a1a00,#1a0d00)"},
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

  const displayName=(profile?.full_name||session.user.email?.split("@")[0]||"FAN").toUpperCase()
  const initials=displayName.split(" ").map(w=>w[0]).join("").slice(0,2)
  const isMember=profile?.is_member

  return (
    <div style={{flex:1,overflowY:"auto",background:"#f5f6fa",WebkitOverflowScrolling:"touch"}}>
      <div style={{background:`linear-gradient(160deg,${NAVY} 0%,#1a3060 60%,#0d2244 100%)`,
        padding:"28px 20px 0",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-30,top:-30,opacity:0.06}}><Logo size={200}/></div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:16}}>
          <div style={{width:88,height:88,borderRadius:"50%",
            background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
            border:`3px solid ${GOLD}`,
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 8px 24px rgba(0,0,0,0.4)",marginBottom:12,position:"relative"}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:32,color:NAVY}}>{initials}</span>
            <div style={{position:"absolute",bottom:4,right:4,width:14,height:14,
              borderRadius:"50%",background:"#27AE60",border:`2px solid ${NAVY}`}}/>
          </div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:"clamp(22px,6vw,28px)",color:WHITE,letterSpacing:"0.04em",
            textAlign:"center",lineHeight:1}}>{displayName}</div>
          <div style={{marginTop:8,display:"inline-flex",alignItems:"center",gap:6,
            background:isMember?GOLD:"rgba(255,255,255,0.15)",
            color:isMember?NAVY:WHITE,padding:"5px 16px",borderRadius:20,
            fontSize:11,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",
            letterSpacing:"0.12em"}}>
            {isMember?"🦡 HONEY BADGER MEMBER":"FREE FAN"}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",
          background:"rgba(255,255,255,0.07)",borderRadius:"12px 12px 0 0",
          padding:"14px 0",marginTop:4}}>
          {[{label:"SEASON",value:"2026/27"},{label:"STATUS",value:isMember?"MEMBER":"FAN"},{label:"DIVISION",value:"BRFA D1"}].map((s,i)=>(
            <div key={i} style={{textAlign:"center",borderRight:i<2?`1px solid rgba(255,255,255,0.1)`:"none",padding:"0 8px"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(13px,4vw,16px)",color:GOLD,lineHeight:1}}>{s.value}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",marginTop:3}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {!isMember&&(
        <div style={{margin:"12px 14px 0"}}>
          <button onClick={openMembership} style={{
            width:"100%",padding:"14px 16px",
            background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
            border:"none",borderRadius:12,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"space-between",
            WebkitTapHighlightColor:"transparent",
            boxShadow:"0 4px 14px rgba(245,197,24,0.3)"}}>
            <div style={{textAlign:"left"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,color:NAVY}}>UPGRADE TO HONEY BADGER</div>
              <div style={{fontSize:12,color:"rgba(13,27,62,0.7)",marginTop:1}}>P20/month or P200/year · Save 17%</div>
            </div>
            <div style={{background:NAVY,borderRadius:8,padding:"6px 14px",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,color:GOLD,flexShrink:0}}>JOIN →</div>
          </button>
        </div>
      )}

      {isMember&&(
        <div style={{padding:"16px 14px 4px"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.1em",marginBottom:10}}>BENEFITS</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {benefits.map((b,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,
                background:WHITE,borderRadius:14,overflow:"hidden",
                boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
                <div style={{width:60,height:60,flexShrink:0,background:b.bg,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>
                  {b.emoji}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:"clamp(12px,3.5vw,14px)",color:NAVY}}>{b.title}</div>
                  <div style={{fontSize:12,color:MGRAY,marginTop:2}}>{b.sub}</div>
                </div>
                <div style={{paddingRight:14,color:"#ccc",fontSize:20,fontWeight:300,flexShrink:0}}>···</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{margin:"16px 14px 0",background:WHITE,borderRadius:14,
        overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
        <div style={{padding:"10px 14px 6px",borderBottom:`1px solid #f0f0f0`}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:11,color:MGRAY,letterSpacing:"0.1em"}}>ACCOUNT</div>
        </div>
        <div style={{padding:"12px 14px",borderBottom:`1px solid #f0f0f0`}}>
          <div style={{fontSize:11,color:MGRAY,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600,letterSpacing:"0.06em"}}>EMAIL</div>
          <div style={{fontSize:14,color:NAVY,marginTop:3,fontWeight:600}}>{session.user.email}</div>
        </div>
        <div style={{padding:"12px 14px"}}>
          <div style={{fontSize:11,color:MGRAY,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600,letterSpacing:"0.06em"}}>MEMBERSHIP</div>
          <div style={{fontSize:14,color:isMember?GREEN:MGRAY,marginTop:3,fontWeight:600}}>
            {isMember?"🦡 Honey Badger Premium — Active":"Free Fan · Upgrade to Honey Badger"}
          </div>
        </div>
      </div>

      <div style={{padding:"24px 0 16px",textAlign:"center"}}>
        <span onClick={onLogout} style={{color:RED,fontWeight:700,fontSize:15,
          fontFamily:"'Barlow Condensed',sans-serif",cursor:"pointer",display:"block",marginBottom:8}}>
          Log Out
        </span>
        <div style={{fontSize:11,color:"#ccc",marginTop:4}}>Villareal FC · Season 2026/27</div>
        <div style={{fontSize:10,color:"#ddd",marginTop:2}}>APP VERSION 1.0.0</div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   MEMBERSHIP PAGE
══════════════════════════════════════════════════════════════════════════════ */
const PLANS = [
  {
    id:"free",name:"PREMIUM FREE",tagline:"Get started for free",emoji:"🆓",
    headerBg:"linear-gradient(135deg,#4a5568,#2d3748)",
    prices:{adult_monthly:0,adult_yearly:0,youth_monthly:0,youth_yearly:0},
    ageGroups:["infant","youth","adult"],
    benefits:["Club news & match updates","Fixtures & standings","Clips & highlights","Early store notifications"],
    cta:"JOIN FREE",popular:false,adultsOnly:false,
  },
  {
    id:"global_fan",name:"GLOBAL FAN",tagline:"For dedicated fans",emoji:"🌍",
    headerBg:`linear-gradient(135deg,${NAVY},#1a3060)`,
    prices:{adult_monthly:20,adult_yearly:200,youth_monthly:15,youth_yearly:153},
    ageGroups:["youth","adult"],
    benefits:["Everything in Free","10% off match-day tickets","5% off official store","Early ticket access (48hr)","Exclusive member kit number","Priority squad updates"],
    cta:"JOIN GLOBAL FAN",popular:true,adultsOnly:false,
  },
  {
    id:"honey_badger",name:"HONEY BADGER",tagline:"The ultimate membership",emoji:"🦡",
    headerBg:`linear-gradient(135deg,#D4A800,#F5C518)`,
    prices:{adult_monthly:50,adult_yearly:500,youth_monthly:null,youth_yearly:null},
    ageGroups:["adult"],
    benefits:["Everything in Global Fan","20% off match-day tickets","10% off official store","Free entry to home matches","Digital membership card","Vote in club decisions","Exclusive member events","VIP match-day experience"],
    cta:"JOIN HONEY BADGER",popular:false,adultsOnly:true,
  },
]

const ID_TYPES = [
  {id:"omang",label:"Omang (National ID)",sides:1,icon:"🪪"},
  {id:"passport",label:"Passport",sides:1,icon:"📗"},
  {id:"license",label:"Driver's License",sides:2,icon:"🚗"},
]

const MembershipPage = ({ session, onClose, onSuccess }) => {
  const [step,setStep]=useState(1)
  const [plan,setPlan]=useState(null)
  const [billing,setBilling]=useState("yearly")
  const [dob,setDob]=useState("")
  const [ageGroup,setAgeGroup]=useState(null)
  const [nameVal,setNameVal]=useState(session?.user?.user_metadata?.full_name||"")
  const [idType,setIdType]=useState(null)
  const [idFront,setIdFront]=useState(null)
  const [idBack,setIdBack]=useState(null)
  const [selfie,setSelfie]=useState(null)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState("")

  const selectedPlan = PLANS.find(p=>p.id===plan)
  const needsVerify  = ageGroup==="adult"

  const getPrice = (p,ag) => {
    if(!p||!ag) return null
    return p.prices[`${ag}_${billing}`]
  }
  const getSaving = (p,ag) => {
    if(!p||!ag) return 0
    const m=p.prices[`${ag}_monthly`]; const y=p.prices[`${ag}_yearly`]
    if(!m||!y) return 0
    return (m*12)-y
  }
  const getAgeFromDob = (dobStr) => {
    if(!dobStr) return null
    const today=new Date(); const birth=new Date(dobStr)
    let age=today.getFullYear()-birth.getFullYear()
    const m=today.getMonth()-birth.getMonth()
    if(m<0||(m===0&&today.getDate()<birth.getDate())) age--
    return age
  }
  const getAgeGroupFromAge = (age) => {
    if(age===null) return null
    if(age<=5) return "infant"
    if(age<=17) return "youth"
    return "adult"
  }

  const capturePhoto = (setter) => {
    const inp=document.createElement("input"); inp.type="file"; inp.accept="image/*"; inp.capture="environment"
    inp.onchange=e=>{ const file=e.target.files[0]; if(!file) return; const r=new FileReader(); r.onload=ev=>setter(ev.target.result); r.readAsDataURL(file) }
    inp.click()
  }
  const captureSelfie = (setter) => {
    const inp=document.createElement("input"); inp.type="file"; inp.accept="image/*"; inp.capture="user"
    inp.onchange=e=>{ const file=e.target.files[0]; if(!file) return; const r=new FileReader(); r.onload=ev=>setter(ev.target.result); r.readAsDataURL(file) }
    inp.click()
  }

  const isPaid = (getPrice(selectedPlan,ageGroup)||0) > 0
  const totalSteps = needsVerify ? (isPaid?5:4) : (isPaid?4:3)

  const handleSubmit = async () => {
    if(!session){ onClose(); return }
    setLoading(true); setError("")
    try {
      await supabase.from("membership_applications").insert({
        user_id:session.user.id, email:session.user.email, full_name:nameVal,
        plan_id:plan, billing_cycle:billing, age_group:ageGroup, dob:dob||null,
        id_type:idType, id_front_url:idFront?"uploaded":null,
        id_back_url:idBack?"uploaded":null, selfie_url:selfie?"uploaded":null,
        status:needsVerify?"pending":"active", created_at:new Date().toISOString(),
      })
      await supabase.from("profiles").update({
        is_member:plan!=="free", billing_cycle:billing, member_since:new Date().toISOString(),
      }).eq("id",session.user.id)
      setStep(totalSteps+1)
      if(onSuccess) onSuccess()
    } catch(e){ setError(e.message||"Something went wrong.") }
    setLoading(false)
  }

  const StepBar = () => {
    const steps = needsVerify
      ? (isPaid?["Plan","Age","Details","Payment","Verify ID"]:["Plan","Age","Details","Verify ID"])
      : (isPaid?["Plan","Age","Details","Payment"]:["Plan","Age","Details"])
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",
        gap:0,padding:"10px 16px",background:"#f8f9fb",borderBottom:`1px solid #eee`,flexShrink:0}}>
        {steps.map((label,i)=>{
          const s=i+1; const done=step>s; const active=step===s
          return (
            <div key={s} style={{display:"flex",alignItems:"center"}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <div style={{width:26,height:26,borderRadius:"50%",
                  background:done?"#27AE60":active?NAVY:"#e5e7eb",
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:11,fontWeight:900,color:done||active?WHITE:MGRAY,
                    fontFamily:"'Barlow Condensed',sans-serif"}}>{done?"✓":s}</span>
                </div>
                <span style={{fontSize:9,fontWeight:active?700:500,color:active?NAVY:MGRAY,
                  fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.04em",whiteSpace:"nowrap"}}>{label}</span>
              </div>
              {i<steps.length-1&&(
                <div style={{width:"clamp(16px,5vw,32px)",height:2,
                  background:done?"#27AE60":"#e5e7eb",margin:"0 2px 14px"}}/>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const Step1 = () => (
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{background:`linear-gradient(160deg,${NAVY},#1a3060)`,padding:"16px 16px 14px",textAlign:"center"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:24,color:WHITE,lineHeight:1}}>CHOOSE YOUR PLAN</div>
        <div style={{fontSize:11,color:"#aab4cc",marginTop:4}}>Villareal FC · Season 2026/27</div>
        <div style={{display:"inline-flex",background:"rgba(255,255,255,0.1)",borderRadius:8,padding:3,marginTop:12,gap:2}}>
          {["monthly","yearly"].map(b=>(
            <button key={b} onClick={()=>setBilling(b)} style={{
              padding:"7px 16px",minHeight:34,background:billing===b?WHITE:"none",
              border:"none",borderRadius:6,cursor:"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,
              color:billing===b?NAVY:"rgba(255,255,255,0.7)",WebkitTapHighlightColor:"transparent",
              display:"flex",alignItems:"center",gap:5}}>
              {b==="monthly"?"MONTHLY":"YEARLY"}
              {b==="yearly"&&<span style={{background:GREEN,color:WHITE,fontSize:8,fontWeight:900,padding:"1px 4px",borderRadius:3}}>SAVE 17%</span>}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"12px 12px 20px",display:"flex",flexDirection:"column",gap:10}}>
        {PLANS.map(p=>{
          const adultPrice=getPrice(p,"adult"); const isSelected=plan===p.id
          return (
            <div key={p.id} onClick={()=>setPlan(p.id)} style={{
              borderRadius:14,overflow:"hidden",cursor:"pointer",
              border:`2.5px solid ${isSelected?(p.adultsOnly?GOLD:NAVY):"#e5e7eb"}`,
              boxShadow:isSelected?"0 4px 20px rgba(0,0,0,0.15)":"0 1px 4px rgba(0,0,0,0.06)",
              WebkitTapHighlightColor:"transparent",background:WHITE,position:"relative"}}>
              {p.popular&&(
                <div style={{position:"absolute",top:0,right:0,background:GOLD,color:NAVY,
                  fontSize:9,fontWeight:900,padding:"3px 10px",borderRadius:"0 11px 0 8px",
                  fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",zIndex:1}}>
                  MOST POPULAR
                </div>
              )}
              <div style={{background:p.headerBg,padding:"14px 16px 12px",display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:28}}>{p.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:p.adultsOnly?NAVY:WHITE,lineHeight:1}}>{p.name}</div>
                  <div style={{fontSize:11,color:p.adultsOnly?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.75)",marginTop:2}}>{p.tagline}</div>
                </div>
                {isSelected&&(
                  <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(255,255,255,0.9)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{color:p.adultsOnly?GOLD:NAVY,fontSize:14,fontWeight:900}}>✓</span>
                  </div>
                )}
              </div>
              <div style={{padding:"10px 16px",borderBottom:`1px solid #f0f0f0`,display:"flex",alignItems:"center",flexWrap:"wrap",gap:8}}>
                {adultPrice===0?(
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:26,color:GREEN}}>FREE</span>
                ):(
                  <>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:26,color:NAVY}}>P{adultPrice}</span>
                    <span style={{fontSize:12,color:MGRAY}}>/{billing==="monthly"?"mo":"yr"}</span>
                  </>
                )}
                {billing==="yearly"&&getSaving(p,"adult")>0&&(
                  <span style={{background:"#dcfce7",color:GREEN,fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4}}>Save P{getSaving(p,"adult")}</span>
                )}
                {p.adultsOnly&&<span style={{background:"#fef2f2",color:RED,fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4,marginLeft:"auto"}}>18+ ONLY</span>}
              </div>
              <div style={{padding:"10px 16px 12px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 8px"}}>
                  {p.benefits.map((b,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"flex-start",gap:5}}>
                      <span style={{color:p.adultsOnly?GOLD2:NAVY,fontSize:11,flexShrink:0,marginTop:1}}>✔</span>
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
        <button onClick={()=>{if(plan) setStep(2)}} disabled={!plan}
          style={{width:"100%",padding:"15px",background:plan?NAVY:"#e5e7eb",
            border:"none",borderRadius:12,cursor:plan?"pointer":"not-allowed",
            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,
            color:plan?WHITE:"#aaa",WebkitTapHighlightColor:"transparent",minHeight:50}}>
          CONTINUE →
        </button>
      </div>
    </div>
  )

  const isDone = step > totalSteps

  return (
    <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",height:"100%",width:"100%"}}>
      <div style={{background:WHITE,width:"100%",height:"92%",borderRadius:"22px 22px 0 0",
        display:"flex",flexDirection:"column",overflow:"hidden",
        boxShadow:"0 -8px 32px rgba(0,0,0,0.3)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"14px 16px 12px",borderBottom:`1px solid #eee`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Logo size={26}/>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,color:NAVY,letterSpacing:"0.04em"}}>MEMBERSHIP</div>
          </div>
          <button onClick={onClose} style={{background:"#f0f0f0",border:"none",width:30,height:30,
            borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:14,color:MGRAY,WebkitTapHighlightColor:"transparent"}}>✕</button>
        </div>

        {!isDone && <StepBar/>}

        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
          {step===1 && <Step1/>}
          {step===2 && (
            <div style={{flex:1,overflowY:"auto",padding:"20px 14px",WebkitOverflowScrolling:"touch"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:NAVY,marginBottom:4}}>DATE OF BIRTH</div>
              <div style={{fontSize:13,color:MGRAY,marginBottom:18,lineHeight:1.6}}>Your age determines pricing and verification requirements.</div>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:11,fontWeight:700,color:MGRAY,fontFamily:"'Barlow Condensed',sans-serif",display:"block",marginBottom:6,letterSpacing:"0.06em"}}>DATE OF BIRTH</label>
                <input type="date" value={dob}
                  onChange={e=>{
                    setDob(e.target.value)
                    const a=getAgeFromDob(e.target.value)
                    const grp=getAgeGroupFromAge(a)
                    if(grp) setAgeGroup(grp)
                  }}
                  max={new Date().toISOString().split("T")[0]}
                  style={{width:"100%",padding:"13px 14px",borderRadius:10,
                    border:"2px solid #e5e7eb",fontSize:16,outline:"none",
                    boxSizing:"border-box",fontFamily:"inherit",WebkitAppearance:"none",minHeight:50}}/>
              </div>
              {dob && ageGroup && (
                <div style={{borderRadius:10,padding:"12px 14px",marginBottom:14,
                  background:ageGroup==="adult"?"#eef1f8":"#f0fdf4",
                  border:`1px solid ${ageGroup==="adult"?"#c7d2fe":"#bbf7d0"}`}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,color:ageGroup==="adult"?NAVY:GREEN,marginBottom:4}}>
                    ✓ Age: {getAgeFromDob(dob)} years
                  </div>
                  <div style={{fontSize:12,color:MGRAY}}>
                    {ageGroup==="infant"&&"Infant (0–5) · Free on all plans"}
                    {ageGroup==="youth"&&`Youth (6–17) · P${getPrice(selectedPlan,"youth")||0}/${billing==="monthly"?"mo":"yr"}`}
                    {ageGroup==="adult"&&`Adult (18+) · P${getPrice(selectedPlan,"adult")||0}/${billing==="monthly"?"mo":"yr"} · ID required`}
                  </div>
                </div>
              )}
              <div style={{display:"flex",gap:10,marginTop:8}}>
                <button onClick={()=>setStep(1)} style={{flex:1,padding:"14px",background:"#f0f0f0",border:"none",borderRadius:12,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,color:NAVY,minHeight:50,WebkitTapHighlightColor:"transparent"}}>← BACK</button>
                <button onClick={()=>{if(!dob){setError("Enter DOB.");return}setError("");setStep(3)}} disabled={!dob}
                  style={{flex:2,padding:"14px",background:!dob?"#e5e7eb":NAVY,border:"none",borderRadius:12,cursor:!dob?"not-allowed":"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,color:!dob?"#aaa":WHITE,minHeight:50,WebkitTapHighlightColor:"transparent"}}>
                  CONTINUE →
                </button>
              </div>
              {error&&<div style={{color:RED,fontSize:13,marginTop:10,fontWeight:600,textAlign:"center"}}>{error}</div>}
            </div>
          )}
          {step===3 && (
            <div style={{flex:1,overflowY:"auto",padding:"20px 14px",WebkitOverflowScrolling:"touch"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:NAVY,marginBottom:4}}>YOUR DETAILS</div>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:700,color:MGRAY,fontFamily:"'Barlow Condensed',sans-serif",display:"block",marginBottom:6,letterSpacing:"0.06em"}}>FULL NAME</label>
                <input type="text" placeholder="As on your ID" value={nameVal} onChange={e=>setNameVal(e.target.value)}
                  style={{width:"100%",padding:"13px 14px",borderRadius:10,border:"2px solid #e5e7eb",fontSize:16,outline:"none",boxSizing:"border-box",fontFamily:"inherit",WebkitAppearance:"none",minHeight:50}}/>
              </div>
              {needsVerify&&(
                <>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>ID DOCUMENT TYPE</div>
                  {ID_TYPES.map(t=>(
                    <div key={t.id} onClick={()=>setIdType(t.id)} style={{
                      padding:"13px 14px",borderRadius:12,cursor:"pointer",
                      border:`2px solid ${idType===t.id?NAVY:"#e5e7eb"}`,
                      background:idType===t.id?"#eef1f8":WHITE,
                      display:"flex",alignItems:"center",gap:12,marginBottom:8,
                      WebkitTapHighlightColor:"transparent",minHeight:50}}>
                      <span style={{fontSize:22}}>{t.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:NAVY}}>{t.label}</div>
                        <div style={{fontSize:11,color:MGRAY,marginTop:1}}>{t.sides===2?"Front & back":"Front only"}</div>
                      </div>
                      <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,border:`2px solid ${idType===t.id?NAVY:"#ddd"}`,background:idType===t.id?NAVY:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {idType===t.id&&<span style={{color:WHITE,fontSize:12}}>✓</span>}
                      </div>
                    </div>
                  ))}
                </>
              )}
              {error&&<div style={{background:"#fef2f2",border:`1px solid #fecaca`,borderRadius:8,padding:"10px 14px",color:RED,fontSize:13,marginBottom:14,fontWeight:600}}>{error}</div>}
              <div style={{display:"flex",gap:10,marginTop:8}}>
                <button onClick={()=>setStep(2)} style={{flex:1,padding:"14px",background:"#f0f0f0",border:"none",borderRadius:12,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,color:NAVY,minHeight:50,WebkitTapHighlightColor:"transparent"}}>← BACK</button>
                <button onClick={()=>{
                  if(!nameVal.trim()){setError("Please enter your name.");return}
                  if(needsVerify&&!idType){setError("Select ID type.");return}
                  setError("")
                  if(needsVerify) setStep(isPaid?3.5:4)
                  else if(isPaid) setStep(3.5)
                  else handleSubmit()
                }} disabled={loading}
                  style={{flex:2,padding:"14px",background:loading?"#ccc":NAVY,border:"none",borderRadius:12,cursor:loading?"not-allowed":"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,color:loading?"#888":WHITE,minHeight:50,WebkitTapHighlightColor:"transparent"}}>
                  {loading?"PLEASE WAIT...":"CONTINUE →"}
                </button>
              </div>
            </div>
          )}
          {step===3.5 && (
            <div style={{flex:1,overflowY:"auto",padding:"20px 14px",WebkitOverflowScrolling:"touch",textAlign:"center"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:NAVY,marginBottom:16}}>PAYMENT</div>
              <div style={{background:`linear-gradient(135deg,${NAVY},#1a3060)`,borderRadius:14,padding:"18px 20px",marginBottom:18}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontFamily:"'Barlow Condensed',sans-serif",marginBottom:4}}>{selectedPlan?.name} · {billing.toUpperCase()}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:42,color:GOLD}}>P{getPrice(selectedPlan,ageGroup)}</div>
              </div>
              <div style={{background:`${GOLD}18`,border:`1px solid ${GOLD}44`,borderRadius:8,padding:"12px",marginBottom:16,textAlign:"left"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:11,color:GOLD2,marginBottom:6}}>HOW TO PAY</div>
                <div style={{fontSize:12,color:NAVY,lineHeight:1.7}}>
                  Dial <strong>*145#</strong> or <strong>*167#</strong><br/>
                  Send <strong>P{getPrice(selectedPlan,ageGroup)}</strong> to <strong>74000001</strong><br/>
                  Reference: <strong>VILLAREAL-MEMBER</strong>
                </div>
              </div>
              <button onClick={()=>needsVerify?setStep(4):handleSubmit()} disabled={loading}
                style={{width:"100%",padding:"14px",background:loading?"#ccc":GREEN,border:"none",borderRadius:12,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,color:WHITE,minHeight:50}}>
                {loading?"PROCESSING...":needsVerify?"NEXT: VERIFY ID →":"COMPLETE →"}
              </button>
            </div>
          )}
          {step===4 && (
            <div style={{flex:1,overflowY:"auto",padding:"20px 14px",WebkitOverflowScrolling:"touch"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:NAVY,marginBottom:14}}>VERIFY YOUR IDENTITY</div>
              <div style={{fontSize:13,color:MGRAY,marginBottom:14,lineHeight:1.6}}>Documents are encrypted and used only for verification.</div>
              {/* ID Front */}
              <div style={{marginBottom:12}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>ID FRONT</div>
                {idFront?(
                  <div style={{position:"relative",borderRadius:12,overflow:"hidden",border:`2px solid ${GREEN}`}}>
                    <img src={idFront} alt="ID Front" style={{width:"100%",height:140,objectFit:"cover",display:"block"}}/>
                    <button onClick={()=>setIdFront(null)} style={{position:"absolute",top:6,left:6,background:"rgba(0,0,0,0.6)",border:"none",borderRadius:20,padding:"2px 8px",fontSize:10,color:WHITE,cursor:"pointer"}}>Retake</button>
                  </div>
                ):(
                  <button onClick={()=>capturePhoto(setIdFront)} style={{width:"100%",height:110,borderRadius:12,border:`2px dashed ${NAVY}`,background:"#f8f9fb",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                    <span style={{fontSize:28}}>📷</span>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:NAVY}}>TAP TO CAPTURE FRONT</span>
                  </button>
                )}
              </div>
              {/* Selfie */}
              <div style={{marginBottom:16}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>🤳 SELFIE</div>
                {selfie?(
                  <div style={{position:"relative",borderRadius:12,overflow:"hidden",border:`2px solid ${GREEN}`}}>
                    <img src={selfie} alt="Selfie" style={{width:"100%",height:160,objectFit:"cover",display:"block"}}/>
                    <button onClick={()=>setSelfie(null)} style={{position:"absolute",top:6,left:6,background:"rgba(0,0,0,0.6)",border:"none",borderRadius:20,padding:"2px 8px",fontSize:10,color:WHITE,cursor:"pointer"}}>Retake</button>
                  </div>
                ):(
                  <button onClick={()=>captureSelfie(setSelfie)} style={{width:"100%",height:130,borderRadius:12,border:`2px dashed ${GOLD2}`,background:"#fffbea",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                    <span style={{fontSize:32}}>🤳</span>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:NAVY}}>TAP TO TAKE SELFIE</span>
                  </button>
                )}
              </div>
              {error&&<div style={{background:"#fef2f2",border:`1px solid #fecaca`,borderRadius:8,padding:"10px 14px",color:RED,fontSize:13,marginBottom:12,fontWeight:600}}>{error}</div>}
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setStep(3)} style={{flex:1,padding:"14px",background:"#f0f0f0",border:"none",borderRadius:12,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,color:NAVY,minHeight:50,WebkitTapHighlightColor:"transparent"}}>← BACK</button>
                <button onClick={()=>{
                  if(!idFront){setError("Capture ID front.");return}
                  if(!selfie){setError("Take a selfie.");return}
                  setError(""); handleSubmit()
                }} disabled={loading||!idFront||!selfie}
                  style={{flex:2,padding:"14px",background:loading||!idFront||!selfie?"#e5e7eb":NAVY,border:"none",borderRadius:12,cursor:loading||!idFront||!selfie?"not-allowed":"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,color:loading||!idFront||!selfie?"#aaa":WHITE,minHeight:50,WebkitTapHighlightColor:"transparent"}}>
                  {loading?"SUBMITTING...":"SUBMIT →"}
                </button>
              </div>
            </div>
          )}
          {isDone && (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",textAlign:"center"}}>
              <div style={{fontSize:60,marginBottom:12}}>🎉</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:24,color:NAVY,marginBottom:8}}>
                {needsVerify?"APPLICATION SUBMITTED!":"WELCOME TO THE FAMILY!"}
              </div>
              <div style={{fontSize:14,color:MGRAY,lineHeight:1.7,marginBottom:24,maxWidth:300}}>
                {needsVerify?"Your identity is under review. You'll get an email within 24–48 hours once approved.":`You're now a ${selectedPlan?.name} member! Welcome 🦡⚽`}
              </div>
              <button onClick={onClose} style={{width:"100%",maxWidth:320,padding:"15px",background:NAVY,border:"none",borderRadius:12,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,color:WHITE,WebkitTapHighlightColor:"transparent",minHeight:50}}>
                {needsVerify?"GO TO MY PROFILE →":"START EXPLORING 🟡"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   STATUS BAR
══════════════════════════════════════════════════════════════════════════════ */
const StatusBar = ({ dark }) => {
  const [time,    setTime]    = useState("")
  const [battery, setBattery] = useState(null)
  const [network, setNetwork] = useState("WIFI")

  useEffect(() => {
    const tick = () => {
      const now=new Date()
      setTime(`${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`)
    }
    tick(); const id=setInterval(tick,10000); return()=>clearInterval(id)
  },[])

  useEffect(()=>{
    if(navigator.getBattery){
      navigator.getBattery().then(bat=>{
        const update=()=>setBattery({level:Math.round(bat.level*100),charging:bat.charging})
        update()
        bat.addEventListener("levelchange",update); bat.addEventListener("chargingchange",update)
        return()=>{ bat.removeEventListener("levelchange",update); bat.removeEventListener("chargingchange",update) }
      }).catch(()=>setBattery(null))
    }
  },[])

  useEffect(()=>{
    const detect=()=>{
      if(!navigator.onLine){setNetwork("OFFLINE");return}
      const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection
      if(!conn){setNetwork("WIFI");return}
      const type=conn.type||""; const eff=conn.effectiveType||""
      if(type==="wifi"||type==="ethernet") setNetwork("WIFI")
      else if(eff==="4g") setNetwork("4G")
      else if(eff==="3g") setNetwork("3G")
      else if(eff==="2g"||eff==="slow-2g") setNetwork("2G")
      else setNetwork("WIFI")
    }
    detect()
    window.addEventListener("online",detect); window.addEventListener("offline",detect)
    const conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection
    if(conn) conn.addEventListener("change",detect)
    return()=>{ window.removeEventListener("online",detect); window.removeEventListener("offline",detect); if(conn) conn.removeEventListener("change",detect) }
  },[])

  const textColor=dark?WHITE:NAVY
  const bgColor=dark?"#000":WHITE

  const BatteryIcon=()=>{
    if(!battery) return null
    const pct=battery.level
    const color=pct<=20?RED:pct<=50?"#f39c12":GREEN
    const width=Math.max(2,Math.round(pct/100*16))
    return (
      <div style={{display:"flex",alignItems:"center",gap:2}}>
        {battery.charging&&<span style={{fontSize:9,color:GREEN}}>⚡</span>}
        <div style={{width:20,height:10,borderRadius:2,border:`1.5px solid ${textColor}`,position:"relative",display:"flex",alignItems:"center",paddingLeft:1}}>
          <div style={{width,height:6,borderRadius:1,background:color}}/>
          <div style={{position:"absolute",right:-3,top:"50%",transform:"translateY(-50%)",width:2,height:5,background:textColor,borderRadius:"0 1px 1px 0"}}/>
        </div>
        <span style={{fontSize:9,fontWeight:700,color:textColor}}>{pct}%</span>
      </div>
    )
  }

  const NetworkIcon=()=>{
    if(network==="WIFI") return (
      <svg width="14" height="12" viewBox="0 0 24 20" fill={textColor}>
        <path d="M1 7.5C5.5 3 10.5 1 12 1s6.5 2 11 6.5" stroke={textColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M4.5 11.5C7 9 10 8 12 8s5 1 7.5 3.5" stroke={textColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M8 15.5C9.5 14 11 13.5 12 13.5s2.5.5 4 2" stroke={textColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="12" cy="19" r="1.5" fill={textColor}/>
      </svg>
    )
    if(network==="OFFLINE") return <span style={{fontSize:10,color:RED,fontWeight:700}}>✕</span>
    const bars=network==="4G"?4:network==="3G"?3:2
    return (
      <div style={{display:"flex",alignItems:"flex-end",gap:1.5}}>
        {[1,2,3,4].map(b=>(
          <div key={b} style={{width:3,borderRadius:1,height:3+b*2,background:b<=bars?textColor:`${textColor}40`}}/>
        ))}
        <span style={{fontSize:9,fontWeight:700,color:textColor,marginLeft:2}}>{network}</span>
      </div>
    )
  }

  return (
    <div style={{background:bgColor,padding:"8px 16px 6px",
      display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
      <span style={{fontSize:13,fontWeight:700,color:textColor,
        fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.02em"}}>{time}</span>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <NetworkIcon/><BatteryIcon/>
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
    supabase.auth.getSession().then(({data:{session}})=>{ setSession(session); setBooting(false) })
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      setSession(session)
      if(event==="SIGNED_IN"&&session){ setActiveTab("profile"); setShowAuth(false) }
    })
    return()=>subscription.unsubscribe()
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

  const renderScreen=()=>{
    if(showMembership) return null
    if(showAuth) return <AuthScreen onSuccess={()=>{setShowAuth(false);setActiveTab("profile")}} onGuest={()=>setShowAuth(false)}/>
    switch(activeTab){
      case "foryou":   return <ForYouScreen userEmail={session?.user?.email} goToAuth={goToAuth} session={session} openMembership={()=>setShowMembership(true)}/>
      case "calendar": return <CalendarScreen/>
      case "clips":    return <ClipsScreen/>
      case "store":    return <StoreScreen goToAuth={goToAuth} fixtures={fixtures} openMembership={()=>setShowMembership(true)} session={session} profile={profile}/>
      case "profile":  return <ProfileScreen session={session} profile={profile} onLogout={handleLogout} goToAuth={goToAuth} openMembership={()=>setShowMembership(true)}/>
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
          min-height:100vh; min-height:100dvh;
          -webkit-font-smoothing:antialiased;
        }
        .phone-frame { --clip-h: calc(680px - 180px); }
        @media(max-width:519px){ .phone-frame { --clip-h: calc(100dvh - 130px); } }
        input,button{font-family:inherit}
        input{-webkit-appearance:none;appearance:none}
        .app-root{
          display:flex; flex-direction:column;
          min-height:100vh; min-height:100dvh;
          background:linear-gradient(160deg,${NAVY} 0%,#0a1020 100%);
        }
        .app-strip{padding:14px 16px 8px;display:flex;align-items:center;gap:12px;}
        .phone-frame{
          flex:1;display:flex;flex-direction:column;
          background:#fff;overflow:hidden;position:relative;min-height:0;
        }
        @media(min-width:520px){
          .app-root{align-items:center;padding:16px 0 24px;}
          .app-strip,.phone-frame{width:100%;max-width:430px;}
          .phone-frame{
            flex:none;height:760px;border-radius:38px;
            border:7px solid #1c1c1c;
            box-shadow:0 28px 70px rgba(0,0,0,0.75),inset 0 0 0 1px rgba(255,255,255,0.07);
          }
        }
        @media(max-width:519px){
          .app-root{min-height:100vh;min-height:100dvh;}
          .phone-frame{flex:1;min-height:0;border-radius:0;}
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
          <StatusBar dark={activeTab==="clips"||showAuth}/>

          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
            {renderScreen()}
          </div>

          {!showAuth&&<BottomNav active={activeTab} setActive={setActiveTab}/>}

          <div style={{background:activeTab==="clips"?"#000":WHITE,
            paddingBottom:4,paddingTop:3,display:"flex",justifyContent:"center",flexShrink:0}}>
            <div style={{width:110,height:4,background:"#ddd",borderRadius:2}}/>
          </div>

          {showMembership&&(
            <div style={{position:"absolute",inset:0,zIndex:200,
              display:"flex",flexDirection:"column",
              background:"rgba(0,0,0,0.6)",borderRadius:"inherit"}}>
              <MembershipPage
                session={session}
                onClose={()=>setShowMembership(false)}
                onSuccess={()=>{ setShowMembership(false); setActiveTab("profile") }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
