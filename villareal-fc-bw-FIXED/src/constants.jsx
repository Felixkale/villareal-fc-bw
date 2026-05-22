import React from "react"



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

export {
  NAVY, GOLD, GOLD2, WHITE, LGRAY, MGRAY, RED, GREEN,
  STANDINGS, SQUAD, MONTHLY_PRICE, YEARLY_PRICE, YEARLY_PCT,
  Logo, Ico, Pill, Btn, Field, NAV_TABS, BottomNav,
}
