import React, { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY } from "./constants"

// ─── SHARED MINI COMPONENTS ──────────────────────────────────────────────────
const S = {
  overlay: {
    position:"absolute", inset:0, zIndex:300,
    background: NAVY,
    display:"flex", flexDirection:"column",
    overflowY:"auto",
  },
  header: {
    background: NAVY,
    borderBottom:`2px solid ${GOLD}`,
    padding:"14px 16px",
    display:"flex", alignItems:"center", justifyContent:"space-between",
    position:"sticky", top:0, zIndex:10, flexShrink:0,
  },
  tabBar: {
    display:"flex", overflowX:"auto", background:"#0a1020",
    borderBottom:`1px solid rgba(255,255,255,0.08)`,
    position:"sticky", top:57, zIndex:9, flexShrink:0,
  },
  section: { padding:16, paddingBottom:32 },
  label: {
    fontSize:10, fontFamily:"'Barlow Condensed',sans-serif",
    fontWeight:700, letterSpacing:1.5, color: GOLD,
    textTransform:"uppercase", marginBottom:4, display:"block",
  },
  input: (extra={}) => ({
    width:"100%", background:"rgba(255,255,255,0.07)",
    border:`1px solid rgba(255,255,255,0.15)`,
    borderRadius:6, color: WHITE, padding:"10px 12px",
    fontSize:13, fontFamily:"inherit", boxSizing:"border-box",
    outline:"none", marginBottom:10, ...extra,
  }),
  select: {
    width:"100%", background:"#0d1b3e",
    border:`1px solid rgba(255,255,255,0.15)`,
    borderRadius:6, color: WHITE, padding:"10px 12px",
    fontSize:13, fontFamily:"inherit", boxSizing:"border-box",
    outline:"none", marginBottom:10,
  },
  saveBtn: {
    background: GOLD, color: NAVY,
    border:"none", borderRadius:6, padding:"11px 22px",
    fontSize:13, fontFamily:"'Barlow Condensed',sans-serif",
    fontWeight:800, letterSpacing:1, cursor:"pointer",
  },
  delBtn: {
    background:"transparent", border:`1px solid ${RED}`,
    color: RED, borderRadius:4, padding:"5px 10px",
    fontSize:11, fontFamily:"'Barlow Condensed',sans-serif",
    fontWeight:700, cursor:"pointer", flexShrink:0,
  },
  sectionTitle: {
    fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900,
    fontSize:16, color: GOLD, letterSpacing:2,
    textTransform:"uppercase", marginBottom:14,
  },
  row: {
    background:"rgba(255,255,255,0.05)",
    border:`1px solid rgba(255,255,255,0.08)`,
    borderRadius:7, padding:"10px 12px", marginBottom:8,
    display:"flex", alignItems:"center", justifyContent:"space-between", gap:10,
  },
  rowLabel: { fontSize:13, color: WHITE, fontFamily:"inherit" },
  rowSub: { fontSize:11, color: MGRAY, marginTop:2 },
  divider: { borderTop:`1px solid rgba(255,255,255,0.08)`, margin:"20px 0 16px" },
}

const Inp = ({ label, textarea, ...p }) => (
  <div>
    {label && <span style={S.label}>{label}</span>}
    {textarea
      ? <textarea {...p} style={S.input({ minHeight:80, resize:"vertical" })} />
      : <input {...p} style={S.input()} />}
  </div>
)

const Sel = ({ label, options, ...p }) => (
  <div>
    {label && <span style={S.label}>{label}</span>}
    <select {...p} style={S.select}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
)

const Row = ({ label, sub, onDelete }) => (
  <div style={S.row}>
    <div style={{flex:1, minWidth:0}}>
      <div style={{...S.rowLabel, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{label}</div>
      {sub && <div style={S.rowSub}>{sub}</div>}
    </div>
    <button style={S.delBtn} onClick={onDelete}>✕ DEL</button>
  </div>
)

const SecTitle = ({ children }) => (
  <div style={S.sectionTitle}>{children}</div>
)

const SaveBtn = ({ onClick, children="+ SAVE" }) => (
  <button style={S.saveBtn} onClick={onClick}>{children}</button>
)

const toast = (msg, setMsg) => {
  setMsg(msg)
  setTimeout(() => setMsg(""), 2500)
}

// ─── ADMIN PANEL ─────────────────────────────────────────────────────────────
export default function AdminPanel({ onClose, session }) {
  const [tab, setTab]     = useState("news")
  const [toastMsg, setToastMsg] = useState("")
  const [loading, setLoading]   = useState(false)

  // Data state
  const [newsList,   setNewsList]   = useState([])
  const [results,    setResults]    = useState([])
  const [halftime,   setHalftime]   = useState([])
  const [players,    setPlayers]    = useState([])
  const [tableRows,  setTableRows]  = useState([])
  const [fixtures,   setFixtures]   = useState([])
  const [storeItems, setStoreItems] = useState([])

  // ── News form
  const [nTag,   setNTag]   = useState("MATCH REPORT")
  const [nTitle, setNTitle] = useState("")
  const [nBody,  setNBody]  = useState("")
  const [nPin,   setNPin]   = useState(false)

  // ── Result form
  const [rHome,    setRHome]    = useState("90 Stars Academy")
  const [rAway,    setRAway]    = useState("")
  const [rHS,      setRHS]      = useState("")
  const [rAS,      setRAS]      = useState("")
  const [rScorers, setRScorers] = useState("")
  const [rGK,      setRGK]      = useState("")
  const [rVenue,   setRVenue]   = useState("")
  const [rDate,    setRDate]    = useState("")
  const [rComp,    setRComp]    = useState("League")

  // ── Halftime form
  const [htMatch,   setHtMatch]   = useState("")
  const [htCaption, setHtCaption] = useState("")

  // ── Player form
  const [plName, setPlName] = useState("")
  const [plPos,  setPlPos]  = useState("FW")
  const [plNo,   setPlNo]   = useState("")
  const [plApps, setPlApps] = useState("")
  const [plGls,  setPlGls]  = useState("")
  const [plAst,  setPlAst]  = useState("")
  const [plSvs,  setPlSvs]  = useState("")
  const [plCS,   setPlCS]   = useState("")
  const [plY,    setPlY]    = useState("")
  const [plR,    setPlR]    = useState("")

  // ── Table form
  const [tClub, setTClub] = useState("")
  const [tP,setTP]=useState("") const [tW,setTW]=useState("") const [tD,setTD]=useState("")
  const [tL,setTL]=useState("") const [tGF,setTGF]=useState("") const [tGA,setTGA]=useState("")
  const [tPts,setTPts]=useState("")

  // ── Fixture form
  const [fxHome,  setFxHome]  = useState("90 Stars Academy")
  const [fxAway,  setFxAway]  = useState("")
  const [fxDate,  setFxDate]  = useState("")
  const [fxTime,  setFxTime]  = useState("")
  const [fxVenue, setFxVenue] = useState("")
  const [fxComp,  setFxComp]  = useState("League")

  // ── Store form
  const [stName,  setStName]  = useState("")
  const [stDesc,  setStDesc]  = useState("")
  const [stPrice, setStPrice] = useState("")
  const [stStock, setStStock] = useState("")
  const [stCat,   setStCat]   = useState("Kits")

  // ── Fetch all data on mount ──────────────────────────────────
  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const [n, r, h, p, lt, f, s] = await Promise.all([
      supabase.from("news").select("*").order("created_at", { ascending: false }),
      supabase.from("results").select("*").order("created_at", { ascending: false }),
      supabase.from("halftime_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("players").select("*").order("goals", { ascending: false }),
      supabase.from("league_table").select("*").order("points", { ascending: false }),
      supabase.from("fixtures").select("*").order("match_date"),
      supabase.from("store_items").select("*").order("created_at"),
    ])
    if (n.data) setNewsList(n.data)
    if (r.data) setResults(r.data)
    if (h.data) setHalftime(h.data)
    if (p.data) setPlayers(p.data)
    if (lt.data) setTableRows(lt.data)
    if (f.data) setFixtures(f.data)
    if (s.data) setStoreItems(s.data)
  }

  const del = async (table, id, refresh) => {
    await supabase.from(table).delete().eq("id", id)
    refresh()
    toast("Deleted", setToastMsg)
  }

  const refetch = (table, setter, order="created_at", asc=false) => async () => {
    const { data } = await supabase.from(table).select("*").order(order, { ascending: asc })
    if (data) setter(data)
  }

  // ── TABS ─────────────────────────────────────────────────────
  const tabs = [
    { id:"news",     icon:"📰", label:"News"     },
    { id:"results",  icon:"⚽", label:"Results"  },
    { id:"halftime", icon:"📸", label:"Halftime" },
    { id:"players",  icon:"👤", label:"Players"  },
    { id:"table",    icon:"📊", label:"Table"    },
    { id:"fixtures", icon:"📅", label:"Fixtures" },
    { id:"store",    icon:"🛍", label:"Store"    },
  ]

  return (
    <div style={S.overlay}>

      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900,
            fontSize:20, color:GOLD, letterSpacing:2}}>ADMIN PANEL</div>
          <div style={{fontSize:10, color:MGRAY, letterSpacing:2,
            fontFamily:"'Barlow Condensed',sans-serif"}}>
            VILLAREAL FC · FULL CONTROL
          </div>
        </div>
        <button onClick={onClose} style={{
          background:"transparent", border:`1px solid ${GOLD}`, color:GOLD,
          padding:"7px 14px", borderRadius:5, fontSize:12,
          fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700,
          letterSpacing:1, cursor:"pointer",
        }}>✕ CLOSE</button>
      </div>

      {/* Tab bar */}
      <div style={S.tabBar}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex:"0 0 auto", padding:"9px 14px",
            background:"transparent", border:"none",
            borderBottom:`2px solid ${tab===t.id ? GOLD : "transparent"}`,
            color: tab===t.id ? GOLD : MGRAY,
            fontSize:11, fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:700, cursor:"pointer", letterSpacing:0.5,
            WebkitTapHighlightColor:"transparent",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      <div style={S.section}>

        {/* ══ NEWS ══════════════════════════════════════════════ */}
        {tab === "news" && <>
          <SecTitle>📰 Post News Article</SecTitle>
          <Sel label="Tag" value={nTag} onChange={e=>setNTag(e.target.value)}
            options={["MATCH REPORT","CLUB NEWS","ANNOUNCEMENT","COMMUNITY","TRANSFER"]} />
          <Inp label="Headline" value={nTitle} onChange={e=>setNTitle(e.target.value)} placeholder="Article headline..." />
          <Inp label="Body" textarea value={nBody} onChange={e=>setNBody(e.target.value)} placeholder="Full article..." />
          <label style={{display:"flex", alignItems:"center", gap:8,
            color:MGRAY, fontSize:13, marginBottom:14, cursor:"pointer"}}>
            <input type="checkbox" checked={nPin} onChange={e=>setNPin(e.target.checked)}
              style={{accentColor:GOLD, width:16, height:16}} />
            Pin as featured story
          </label>
          <SaveBtn onClick={async () => {
            if (!nTitle || !nBody) return
            await supabase.from("news").insert({ tag:nTag, title:nTitle, body:nBody, pinned:nPin })
            setNTitle(""); setNBody(""); setNPin(false)
            refetch("news", setNewsList)()
            toast("Article published!", setToastMsg)
          }}>+ PUBLISH</SaveBtn>

          <div style={S.divider} />
          <SecTitle>Existing Articles ({newsList.length})</SecTitle>
          {newsList.map(n => (
            <Row key={n.id} label={n.title}
              sub={`${n.tag} · ${new Date(n.created_at).toLocaleDateString()}${n.pinned?" · 📌":""}`}
              onDelete={() => del("news", n.id, refetch("news", setNewsList))} />
          ))}
        </>}

        {/* ══ RESULTS ═══════════════════════════════════════════ */}
        {tab === "results" && <>
          <SecTitle>⚽ Post Match Result</SecTitle>
          <Inp label="Home Team" value={rHome} onChange={e=>setRHome(e.target.value)} />
          <Inp label="Away Team" value={rAway} onChange={e=>setRAway(e.target.value)} placeholder="Opponent..." />
          <div style={{display:"flex", gap:10}}>
            <div style={{flex:1}}><Inp label="Home Score" type="number" value={rHS} onChange={e=>setRHS(e.target.value)} placeholder="0" /></div>
            <div style={{flex:1}}><Inp label="Away Score" type="number" value={rAS} onChange={e=>setRAS(e.target.value)} placeholder="0" /></div>
          </div>
          <Inp label="Goalscorers (e.g. Casemiro 67')" value={rScorers} onChange={e=>setRScorers(e.target.value)} placeholder="Player 55', Player 78'" />
          <Inp label="GK / Notable Note" value={rGK} onChange={e=>setRGK(e.target.value)} placeholder="Bosena — brilliant saves..." />
          <Inp label="Venue" value={rVenue} onChange={e=>setRVenue(e.target.value)} placeholder="Stadium name..." />
          <Inp label="Date" value={rDate} onChange={e=>setRDate(e.target.value)} placeholder="23 May 2026" />
          <Sel label="Competition" value={rComp} onChange={e=>setRComp(e.target.value)}
            options={["League","Cup","Friendly","Playoff"]} />
          <SaveBtn onClick={async () => {
            if (!rAway) return
            await supabase.from("results").insert({
              home_team:rHome, away_team:rAway,
              home_score:+rHS||0, away_score:+rAS||0,
              scorers:rScorers, gk_note:rGK, venue:rVenue,
              match_date:rDate, competition:rComp,
            })
            setRAway(""); setRHS(""); setRAS(""); setRScorers(""); setRGK(""); setRVenue(""); setRDate("")
            refetch("results", setResults)()
            toast("Result posted!", setToastMsg)
          }}>+ POST RESULT</SaveBtn>

          <div style={S.divider} />
          <SecTitle>Posted Results ({results.length})</SecTitle>
          {results.map(r => (
            <Row key={r.id}
              label={`${r.home_team} ${r.home_score}–${r.away_score} ${r.away_team}`}
              sub={`${r.competition} · ${r.match_date}`}
              onDelete={() => del("results", r.id, refetch("results", setResults))} />
          ))}
        </>}

        {/* ══ HALFTIME ══════════════════════════════════════════ */}
        {tab === "halftime" && <>
          <SecTitle>📸 Post Halftime Update</SecTitle>
          <Inp label="Match (e.g. vs Golden Birds)" value={htMatch} onChange={e=>setHtMatch(e.target.value)} placeholder="vs Team Name" />
          <Inp label="Caption / Post Text" textarea value={htCaption} onChange={e=>setHtCaption(e.target.value)} placeholder="What's happening at halftime..." />
          <div style={{
            background:"rgba(255,255,255,0.04)", border:`1px dashed rgba(255,255,255,0.1)`,
            borderRadius:7, padding:16, textAlign:"center", marginBottom:14,
          }}>
            <div style={{fontSize:28, marginBottom:6}}>📷</div>
            <div style={{fontSize:12, color:MGRAY}}>Image upload — wire to Supabase Storage bucket</div>
            <div style={{fontSize:11, color:"rgba(255,255,255,0.2)", marginTop:4}}>Caption posts work now</div>
          </div>
          <SaveBtn onClick={async () => {
            if (!htCaption) return
            await supabase.from("halftime_posts").insert({ match_ref:htMatch, caption:htCaption })
            setHtMatch(""); setHtCaption("")
            refetch("halftime_posts", setHalftime)()
            toast("Halftime post published!", setToastMsg)
          }}>+ POST HALFTIME</SaveBtn>

          <div style={S.divider} />
          <SecTitle>Halftime Posts ({halftime.length})</SecTitle>
          {halftime.map(h => (
            <Row key={h.id}
              label={h.caption.substring(0,55) + (h.caption.length > 55 ? "..." : "")}
              sub={`${h.match_ref || ""} · ${new Date(h.created_at).toLocaleDateString()}`}
              onDelete={() => del("halftime_posts", h.id, refetch("halftime_posts", setHalftime))} />
          ))}
        </>}

        {/* ══ PLAYERS ═══════════════════════════════════════════ */}
        {tab === "players" && <>
          <SecTitle>👤 Add Player</SecTitle>
          <div style={{display:"flex", gap:10}}>
            <div style={{flex:2}}><Inp label="Full Name" value={plName} onChange={e=>setPlName(e.target.value)} placeholder="Player name..." /></div>
            <div style={{flex:1}}><Inp label="No." type="number" value={plNo} onChange={e=>setPlNo(e.target.value)} placeholder="#" /></div>
          </div>
          <Sel label="Position" value={plPos} onChange={e=>setPlPos(e.target.value)} options={["GK","DF","MF","FW"]} />
          <div style={{display:"flex", gap:8}}>
            <div style={{flex:1}}><Inp label="Apps"    type="number" value={plApps} onChange={e=>setPlApps(e.target.value)} placeholder="0" /></div>
            <div style={{flex:1}}><Inp label="Goals"   type="number" value={plGls}  onChange={e=>setPlGls(e.target.value)}  placeholder="0" /></div>
            <div style={{flex:1}}><Inp label="Assists" type="number" value={plAst}  onChange={e=>setPlAst(e.target.value)}  placeholder="0" /></div>
          </div>
          <div style={{display:"flex", gap:8}}>
            <div style={{flex:1}}><Inp label="Saves"   type="number" value={plSvs} onChange={e=>setPlSvs(e.target.value)} placeholder="0" /></div>
            <div style={{flex:1}}><Inp label="CS"      type="number" value={plCS}  onChange={e=>setPlCS(e.target.value)}  placeholder="0" /></div>
            <div style={{flex:1}}><Inp label="🟨"      type="number" value={plY}   onChange={e=>setPlY(e.target.value)}   placeholder="0" /></div>
            <div style={{flex:1}}><Inp label="🟥"      type="number" value={plR}   onChange={e=>setPlR(e.target.value)}   placeholder="0" /></div>
          </div>
          <SaveBtn onClick={async () => {
            if (!plName) return
            await supabase.from("players").insert({
              name:plName, position:plPos, jersey_no:+plNo||0,
              appearances:+plApps||0, goals:+plGls||0, assists:+plAst||0,
              saves:+plSvs||0, clean_sheets:+plCS||0,
              yellow_cards:+plY||0, red_cards:+plR||0,
            })
            setPlName(""); setPlNo(""); setPlApps(""); setPlGls(""); setPlAst("")
            setPlSvs(""); setPlCS(""); setPlY(""); setPlR("")
            refetch("players", setPlayers, "goals")()
            toast("Player added!", setToastMsg)
          }}>+ ADD PLAYER</SaveBtn>

          <div style={S.divider} />
          <SecTitle>Squad ({players.length})</SecTitle>
          {players.map(p => (
            <Row key={p.id}
              label={`#${p.jersey_no} ${p.name} — ${p.position}`}
              sub={`Apps: ${p.appearances} · Goals: ${p.goals} · Assists: ${p.assists}`}
              onDelete={() => del("players", p.id, refetch("players", setPlayers, "goals"))} />
          ))}
        </>}

        {/* ══ TABLE ═════════════════════════════════════════════ */}
        {tab === "table" && <>
          <SecTitle>📊 Update League Table</SecTitle>
          <Inp label="Club Name" value={tClub} onChange={e=>setTClub(e.target.value)} placeholder="Club name..." />
          <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
            {[["P",tP,setTP],["W",tW,setTW],["D",tD,setTD],["L",tL,setTL],["GF",tGF,setTGF],["GA",tGA,setTGA],["Pts",tPts,setTPts]].map(([l,v,s])=>(
              <div key={l} style={{flex:"1 0 55px"}}>
                <Inp label={l} type="number" value={v} onChange={e=>s(e.target.value)} placeholder="0" />
              </div>
            ))}
          </div>
          <SaveBtn onClick={async () => {
            if (!tClub) return
            await supabase.from("league_table").insert({
              club:tClub, played:+tP||0, won:+tW||0, drawn:+tD||0,
              lost:+tL||0, goals_for:+tGF||0, goals_against:+tGA||0, points:+tPts||0,
            })
            setTClub(""); setTP(""); setTW(""); setTD(""); setTL(""); setTGF(""); setTGA(""); setTPts("")
            refetch("league_table", setTableRows, "points")()
            toast("Table updated!", setToastMsg)
          }}>+ ADD ROW</SaveBtn>

          <div style={S.divider} />
          <SecTitle>Table ({tableRows.length} clubs)</SecTitle>
          {tableRows.map(t => (
            <Row key={t.id}
              label={t.club}
              sub={`P${t.played} W${t.won} D${t.drawn} L${t.lost} GF${t.goals_for} GA${t.goals_against} · ${t.points} pts`}
              onDelete={() => del("league_table", t.id, refetch("league_table", setTableRows, "points"))} />
          ))}
        </>}

        {/* ══ FIXTURES ══════════════════════════════════════════ */}
        {tab === "fixtures" && <>
          <SecTitle>📅 Add Fixture</SecTitle>
          <Inp label="Home Team" value={fxHome} onChange={e=>setFxHome(e.target.value)} />
          <Inp label="Away Team" value={fxAway} onChange={e=>setFxAway(e.target.value)} placeholder="Opponent..." />
          <div style={{display:"flex", gap:10}}>
            <div style={{flex:2}}><Inp label="Date" value={fxDate} onChange={e=>setFxDate(e.target.value)} placeholder="30 May 2026" /></div>
            <div style={{flex:1}}><Inp label="Time" value={fxTime} onChange={e=>setFxTime(e.target.value)} placeholder="15:00" /></div>
          </div>
          <Inp label="Venue" value={fxVenue} onChange={e=>setFxVenue(e.target.value)} placeholder="Stadium..." />
          <Sel label="Competition" value={fxComp} onChange={e=>setFxComp(e.target.value)}
            options={["League","Cup","Friendly","Playoff"]} />
          <SaveBtn onClick={async () => {
            if (!fxAway) return
            await supabase.from("fixtures").insert({
              home_team:fxHome, away_team:fxAway, match_date:fxDate,
              match_time:fxTime, venue:fxVenue, competition:fxComp,
            })
            setFxAway(""); setFxDate(""); setFxTime(""); setFxVenue("")
            refetch("fixtures", setFixtures, "match_date", true)()
            toast("Fixture added!", setToastMsg)
          }}>+ ADD FIXTURE</SaveBtn>

          <div style={S.divider} />
          <SecTitle>Fixtures ({fixtures.length})</SecTitle>
          {fixtures.map(f => (
            <Row key={f.id}
              label={`${f.home_team} vs ${f.away_team}`}
              sub={`${f.match_date} · ${f.match_time} · ${f.competition}`}
              onDelete={() => del("fixtures", f.id, refetch("fixtures", setFixtures, "match_date", true))} />
          ))}
        </>}

        {/* ══ STORE ═════════════════════════════════════════════ */}
        {tab === "store" && <>
          <SecTitle>🛍 Add Store Item</SecTitle>
          <Inp label="Product Name" value={stName} onChange={e=>setStName(e.target.value)} placeholder="Item name..." />
          <Inp label="Description" textarea value={stDesc} onChange={e=>setStDesc(e.target.value)} placeholder="Short description..." />
          <div style={{display:"flex", gap:10}}>
            <div style={{flex:1}}><Inp label="Price (BWP)" type="number" value={stPrice} onChange={e=>setStPrice(e.target.value)} placeholder="0" /></div>
            <div style={{flex:1}}><Inp label="Stock" type="number" value={stStock} onChange={e=>setStStock(e.target.value)} placeholder="0" /></div>
          </div>
          <Sel label="Category" value={stCat} onChange={e=>setStCat(e.target.value)}
            options={["Kits","Accessories","Training","Merchandise"]} />
          <SaveBtn onClick={async () => {
            if (!stName || !stPrice) return
            await supabase.from("store_items").insert({
              name:stName, description:stDesc, price:+stPrice,
              stock:+stStock||0, category:stCat,
            })
            setStName(""); setStDesc(""); setStPrice(""); setStStock("")
            refetch("store_items", setStoreItems)()
            toast("Item added!", setToastMsg)
          }}>+ ADD ITEM</SaveBtn>

          <div style={S.divider} />
          <SecTitle>Store Items ({storeItems.length})</SecTitle>
          {storeItems.map(s => (
            <Row key={s.id}
              label={s.name}
              sub={`P${s.price} · Stock: ${s.stock} · ${s.category}`}
              onDelete={() => del("store_items", s.id, refetch("store_items", setStoreItems))} />
          ))}
        </>}

      </div>

      {/* Toast */}
      {toastMsg && (
        <div style={{
          position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)",
          background: GREEN, color: WHITE, padding:"10px 20px",
          borderRadius:7, fontSize:13, fontFamily:"'Barlow Condensed',sans-serif",
          fontWeight:700, letterSpacing:1, zIndex:999, whiteSpace:"nowrap",
          boxShadow:"0 4px 20px rgba(0,0,0,0.4)",
        }}>✓ {toastMsg}</div>
      )}

    </div>
  )
}
