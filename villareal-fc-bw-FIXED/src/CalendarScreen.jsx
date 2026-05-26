import React, { useState, useEffect, useRef } from "react"
import { supabase } from "./supabaseClient"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY, Logo, Pill, Btn, SQUAD, STANDINGS } from "./constants"

const CalendarScreen = () => {
  const [subTab,setSubTab]=useState("calendar")
  const [fixtures,setFixtures]=useState([])
  const [players,setPlayers]=useState([])
  const [playerPhotos,setPlayerPhotos]=useState({})

  useEffect(()=>{
    supabase.from("fixtures").select("*").order("match_date")
      .then(({data})=>{ if(data) setFixtures(data) })
    supabase.from("players").select("*")
      .then(({data})=>{ if(data) setPlayers(data) })
  },[])

  useEffect(()=>{
    const map = {}
    SQUAD.forEach(p => { map[p.id] = `/players/${p.id}.jpg` })
    setPlayerPhotos(map)
  },[])

  const fixtureMap={}
  fixtures.forEach(f=>{
    const d=new Date(f.match_date)
    if(d.getMonth()===4&&d.getFullYear()===2026) fixtureMap[d.getDate()]=f
  })

  // ── Top Scorers / Assists from Supabase players table ──────────
  const topScorers  = [...players].filter(p=>p.goals>0).sort((a,b)=>b.goals-a.goals).slice(0,10)
  const topAssists  = [...players].filter(p=>p.assists>0).sort((a,b)=>b.assists-a.assists).slice(0,10)

  const posColor = { GK:"#d4a017", DF:"#4a9fd4", MF:"#34c274", FW:RED }

  // ── STAT ROW ───────────────────────────────────────────────────
  const StatRow = ({ rank, player, value, label, color }) => (
    <div style={{
      display:"flex", alignItems:"center", gap:12,
      padding:"10px 14px",
      background: rank===1 ? `${GOLD}18` : rank%2===0 ? WHITE : "#fafafa",
      borderBottom:`1px solid #f0f0f0`,
      borderLeft: rank===1 ? `3px solid ${GOLD}` : "3px solid transparent",
    }}>
      {/* Rank */}
      <div style={{
        width:26, height:26, borderRadius:"50%", flexShrink:0,
        background: rank===1?GOLD : rank===2?"#C0C0C0" : rank===3?"#CD7F32" : LGRAY,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <span style={{
          fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900,
          fontSize:11, color: rank<=3 ? NAVY : MGRAY,
        }}>{rank}</span>
      </div>

      {/* Avatar initials */}
      <div style={{
        width:36, height:36, borderRadius:"50%", flexShrink:0,
        background: NAVY, border:`2px solid ${posColor[player.position]||GOLD}`,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <span style={{
          fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900,
          fontSize:11, color:GOLD,
        }}>
          {(player.name||"??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
        </span>
      </div>

      {/* Name + position */}
      <div style={{flex:1, minWidth:0}}>
        <div style={{
          fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800,
          fontSize:"clamp(12px,3.5vw,14px)", color:NAVY,
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
        }}>{player.name}</div>
        <div style={{
          fontSize:10, color: posColor[player.position]||MGRAY,
          fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700,
        }}>{player.position}</div>
      </div>

      {/* Value */}
      <div style={{textAlign:"center", flexShrink:0}}>
        <div style={{
          fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900,
          fontSize:26, color: color, lineHeight:1,
        }}>{value}</div>
        <div style={{fontSize:9, color:MGRAY, fontFamily:"'Barlow Condensed',sans-serif",
          fontWeight:700, letterSpacing:0.5}}>{label}</div>
      </div>
    </div>
  )

  // ── STATS TAB ──────────────────────────────────────────────────
  const StatsTab = () => {
    const [statsView, setStatsView] = useState("scorers")
    return (
      <div style={{flex:1, overflowY:"auto", WebkitOverflowScrolling:"touch", background:"#f5f6fa"}}>

        {/* Toggle */}
        <div style={{
          display:"flex", background:WHITE,
          borderBottom:`1px solid #eee`, padding:"0 14px", gap:0,
        }}>
          {[
            { id:"scorers", icon:"⚽", label:"TOP SCORERS"  },
            { id:"assists", icon:"🎯", label:"TOP ASSISTS"  },
          ].map(v=>(
            <button key={v.id} onClick={()=>setStatsView(v.id)} style={{
              flex:1, background:"none", border:"none", cursor:"pointer",
              padding:"11px 0 9px",
              fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800,
              fontSize:"clamp(11px,3vw,13px)",
              color: statsView===v.id ? NAVY : MGRAY,
              borderBottom: statsView===v.id ? `2.5px solid ${GOLD}` : "2.5px solid transparent",
              WebkitTapHighlightColor:"transparent",
            }}>{v.icon} {v.label}</button>
          ))}
        </div>

        {/* Header row */}
        <div style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"10px 14px 6px",
          background:"#f0f0f0", borderBottom:`1px solid #ddd`,
        }}>
          <span style={{
            fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800,
            fontSize:11, color:NAVY, letterSpacing:"0.06em",
          }}>
            {statsView==="scorers" ? "⚽ GOAL SCORERS" : "🎯 ASSIST PROVIDERS"}
          </span>
          <span style={{
            fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700,
            fontSize:10, color:MGRAY,
          }}>
            {statsView==="scorers" ? "GOALS" : "ASSISTS"}
          </span>
        </div>

        {/* List */}
        {(statsView==="scorers" ? topScorers : topAssists).length === 0 ? (
          <div style={{padding:40, textAlign:"center", color:MGRAY, fontSize:13,
            fontFamily:"'Barlow Condensed',sans-serif"}}>
            No stats yet — add players in Admin Panel
          </div>
        ) : (
          (statsView==="scorers" ? topScorers : topAssists).map((p,i)=>(
            <StatRow
              key={p.id}
              rank={i+1}
              player={p}
              value={statsView==="scorers" ? p.goals : p.assists}
              label={statsView==="scorers" ? "GOALS" : "ASSISTS"}
              color={statsView==="scorers" ? RED : GREEN}
            />
          ))
        )}

        {/* GK clean sheets bonus section */}
        {statsView==="scorers" && players.filter(p=>p.position==="GK"&&p.clean_sheets>0).length>0 && (
          <>
            <div style={{
              padding:"8px 14px", background:"#f0f0f0",
              borderTop:`1px solid #ddd`, borderBottom:`1px solid #ddd`,
              marginTop:8,
            }}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                fontWeight:800, fontSize:11, color:NAVY, letterSpacing:"0.06em"}}>
                🧤 CLEAN SHEETS
              </span>
            </div>
            {[...players].filter(p=>p.position==="GK"&&p.clean_sheets>0)
              .sort((a,b)=>b.clean_sheets-a.clean_sheets)
              .map((p,i)=>(
                <StatRow key={p.id} rank={i+1} player={p}
                  value={p.clean_sheets} label="CLEAN SH." color={NAVY} />
              ))
            }
          </>
        )}

        <div style={{height:24}}/>
      </div>
    )
  }

  // ── CALENDAR GRID ──────────────────────────────────────────────
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
                            {(fx.opponent||fx.away_team||"OPP").split(" ").map(w=>w[0]).join("").slice(0,3)}
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
                  {(fx.opponent||fx.away_team||"OPP").split(" ").map(w=>w[0]).join("").slice(0,3)}
                </span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:"clamp(12px,3.5vw,14px)",color:NAVY,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  vs {fx.opponent||fx.away_team}
                </div>
                <div style={{fontSize:11,color:MGRAY}}>
                  {new Date(fx.match_date).toLocaleDateString("en-GB",
                    {weekday:"short",day:"numeric",month:"short"})}
                  {fx.kick_off||fx.match_time?` · ${(fx.kick_off||fx.match_time||"").slice(0,5)}`:""}
                </div>
              </div>
              <Pill label={fx.venue||"HOME"} bg={fx.venue==="AWAY"?RED:NAVY} color={WHITE} small/>
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

  // ── STANDINGS TAB ──────────────────────────────────────────────
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

  // ── PLAYERS TAB ────────────────────────────────────────────────
  const [teamFilter,setTeamFilter]=useState("FIRST TEAM")
  const [showDropdown,setShowDropdown]=useState(false)
  const TEAMS=["FIRST TEAM","U21","U17"]

  const getAge=(dob)=>{
    const today=new Date(), b=new Date(dob)
    let age=today.getFullYear()-b.getFullYear()
    const m=today.getMonth()-b.getMonth()
    if(m<0||(m===0&&today.getDate()<b.getDate())) age--
    return age
  }

  const filteredPlayers=SQUAD.filter(p=>p.team===teamFilter)

  const PlayersTab=()=>{
    const [selPlayer,setSelPlayer]=useState(null)
    return (
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",background:"#f5f6fa",position:"relative"}}>
        {selPlayer&&(
          <div onClick={()=>setSelPlayer(null)}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",
              zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
            <div onClick={e=>e.stopPropagation()}
              style={{background:WHITE,borderRadius:20,overflow:"hidden",
                width:"100%",maxWidth:340,boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
              <div style={{height:300,background:`linear-gradient(180deg,#0a1428,${NAVY})`,
                position:"relative",overflow:"hidden"}}>
                {playerPhotos[selPlayer.id]?(
                  <img src={playerPhotos[selPlayer.id]} alt={selPlayer.name}
                    style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 20%"}}
                    onError={e=>{e.target.style.display="none"}}/>
                ):(
                  <div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                      fontWeight:900,fontSize:72,color:GOLD,opacity:0.5}}>
                      {(selPlayer.name||"??").split(" ").map(w=>w[0]).join("").slice(0,2)}
                    </span>
                  </div>
                )}
                <div style={{position:"absolute",bottom:0,left:0,right:0,height:"40%",
                  background:"linear-gradient(to top,rgba(0,0,0,0.8),transparent)"}}/>
                <button onClick={()=>setSelPlayer(null)}
                  style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.5)",
                    border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",
                    color:WHITE,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
              <div style={{padding:"16px"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:26,color:NAVY,lineHeight:1.1,marginBottom:10}}>
                  {selPlayer.name.toUpperCase()}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[
                    ["TEAM",  selPlayer.team==="FIRST TEAM"?"1ST TEAM":selPlayer.team],
                    ["AGE",   getAge(selPlayer.dob)+" yrs"],
                    ["BFA ID",selPlayer.id],
                  ].map(([label,val])=>(
                    <div key={label} style={{background:LGRAY,borderRadius:8,padding:"8px",textAlign:"center"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                        fontSize:9,color:MGRAY,letterSpacing:"0.06em",marginBottom:3}}>{label}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                        fontSize:13,color:NAVY,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,padding:"10px"}}>
          {filteredPlayers.map((p)=>{
            const age=getAge(p.dob)
            const initials=(p.name||"??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()
            const hasPhoto=!!playerPhotos[p.id]
            const nameParts=(p.name||"Unknown").split(" ")
            const firstName=nameParts.slice(0,-1).join(" ")||nameParts[0]
            const lastName=nameParts.slice(-1)[0]
            return (
              <div key={p.id} onClick={()=>setSelPlayer(p)}
                style={{borderRadius:14,overflow:"hidden",background:WHITE,cursor:"pointer",
                  boxShadow:"0 2px 10px rgba(0,0,0,0.09)",border:`1.5px solid #e5e7eb`,
                  WebkitTapHighlightColor:"transparent"}}>
                <div style={{height:"clamp(130px,38vw,160px)",
                  background:`linear-gradient(180deg,#0a1428 0%,${NAVY} 100%)`,
                  position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                      fontWeight:900,fontSize:"clamp(28px,8vw,36px)",color:GOLD,opacity:0.5}}>{initials}</span>
                  </div>
                  {hasPhoto&&(
                    <img src={playerPhotos[p.id]} alt={p.name}
                      style={{position:"absolute",inset:0,width:"100%",height:"100%",
                        objectFit:"cover",objectPosition:"center 15%"}}
                      onError={e=>{e.target.style.display="none"}}/>
                  )}
                  <div style={{position:"absolute",bottom:0,left:0,right:0,height:"45%",
                    background:"linear-gradient(to top,rgba(0,0,0,0.75),transparent)"}}/>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"6px 8px"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                      fontSize:"clamp(11px,3.2vw,14px)",color:WHITE,lineHeight:1,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                      textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>
                      {firstName&&<span style={{fontWeight:400,opacity:0.8,marginRight:3,
                        fontSize:"clamp(9px,2.5vw,11px)"}}>{firstName}</span>}
                      <span>{lastName.toUpperCase()}</span>
                    </div>
                  </div>
                  <div style={{position:"absolute",top:7,right:7,
                    background:p.team==="FIRST TEAM"?GOLD:p.team==="U21"?GREEN:"#e67e22",
                    color:p.team==="FIRST TEAM"?NAVY:WHITE,
                    borderRadius:5,padding:"2px 6px",fontSize:8,fontWeight:900,
                    fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.05em"}}>
                    {p.team==="FIRST TEAM"?"1ST":p.team}
                  </div>
                </div>
                <div style={{padding:"7px 10px 9px",background:WHITE,borderTop:`2px solid ${GOLD}22`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:"clamp(9px,2.5vw,10px)",color:GOLD2,
                      fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif"}}>{p.id}</div>
                    <div style={{fontSize:"clamp(9px,2.5vw,10px)",color:MGRAY,fontWeight:600}}>Age {age}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{padding:"12px 14px",background:"#f8f9fb",borderTop:`1px solid #eee`,textAlign:"center"}}>
          <span style={{fontSize:11,color:MGRAY}}>
            {Object.keys(playerPhotos).filter(k=>playerPhotos[k]).length} of {SQUAD.length} players have photos · Managed via Admin Panel
          </span>
        </div>
      </div>
    )
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:WHITE,overflow:"hidden"}}>
      {/* Sub-tab bar */}
      <div style={{display:"flex",alignItems:"center",borderBottom:`1px solid #eee`,
        padding:"0 14px",gap:0,flexShrink:0}}>
        <div style={{display:"flex",flex:1,gap:14,overflowX:"auto"}}>
          {["calendar","standings","stats","players"].map(t=>(
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
            <button onClick={()=>setShowDropdown(d=>!d)}
              style={{background:NAVY,border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",
                display:"flex",alignItems:"center",gap:5,
                fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:11,color:WHITE,
                WebkitTapHighlightColor:"transparent",minHeight:34}}>
              {teamFilter} <span style={{fontSize:9}}>{showDropdown?"▲":"▼"}</span>
            </button>
            {showDropdown&&(
              <div style={{position:"absolute",top:"calc(100% + 4px)",right:0,
                background:WHITE,borderRadius:10,boxShadow:"0 8px 24px rgba(0,0,0,0.15)",
                border:`1px solid #eee`,zIndex:100,minWidth:130,overflow:"hidden"}}>
                {TEAMS.map(t=>(
                  <button key={t} onClick={()=>{setTeamFilter(t);setShowDropdown(false)}}
                    style={{display:"block",width:"100%",padding:"12px 16px",
                      background:teamFilter===t?`${GOLD}22`:WHITE,
                      border:"none",borderBottom:`1px solid #f0f0f0`,cursor:"pointer",textAlign:"left",
                      fontFamily:"'Barlow Condensed',sans-serif",
                      fontWeight:teamFilter===t?900:600,fontSize:13,
                      color:teamFilter===t?NAVY:MGRAY,WebkitTapHighlightColor:"transparent"}}>
                    <span style={{marginRight:6}}>{t==="FIRST TEAM"?"⚽":t==="U21"?"🌟":"🔥"}</span>
                    {t}
                    <span style={{fontSize:10,color:MGRAY,marginLeft:4}}>({SQUAD.filter(p=>p.team===t).length})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {subTab==="calendar"  && <CalGrid/>}
      {subTab==="standings" && <StandingsTab/>}
      {subTab==="stats"     && <StatsTab/>}
      {subTab==="players"   && <PlayersTab/>}
    </div>
  )
}

export default CalendarScreen
