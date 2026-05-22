import React, { useState, useEffect, useRef } from "react"
import { supabase } from "./supabaseClient"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY, Logo, Pill, Btn, SQUAD, STANDINGS } from "./constants"



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

  // Load player photos from /players/ public folder
  useEffect(()=>{
    const map = {}
    SQUAD.forEach(p => { map[p.id] = `/${p.id}.jpg` })
    setPlayerPhotos(map)
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

  // Photos loaded from Supabase Storage (uploaded via admin panel)

  const PlayersTab=()=>(
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",background:"#f5f6fa"}}>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(2,1fr)",
        gap:10,padding:"10px",
      }}>
        {filteredPlayers.map((p,i)=>{
          const age = getAge(p.dob)
          const initials = p.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()
          const hasPhoto = !!playerPhotos[p.id]
          const nameParts = p.name.split(" ")
          const firstName = nameParts.slice(0,-1).join(" ") || nameParts[0]
          const lastName  = nameParts.slice(-1)[0]

          return (
            <div key={p.id} style={{
              borderRadius:14,overflow:"hidden",
              background:WHITE,
              boxShadow:"0 2px 10px rgba(0,0,0,0.09)",
              border:`1.5px solid ${hasPhoto?"#e5e7eb":"#e5e7eb"}`,
              WebkitTapHighlightColor:"transparent",
            }}>

              {/* ── PHOTO AREA — taller, face-centred ── */}
              <div style={{
                height:"clamp(130px,38vw,160px)",
                background:`linear-gradient(180deg,#0a1428 0%,${NAVY} 100%)`,
                position:"relative",overflow:"hidden",
              }}>
                {/* Initials fallback */}
                <div style={{position:"absolute",inset:0,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                    fontWeight:900,fontSize:"clamp(28px,8vw,36px)",
                    color:GOLD,opacity:0.5}}>{initials}</span>
                </div>

                {/* Real photo — show full face */}
                {hasPhoto&&(
                  <img src={playerPhotos[p.id]} alt={p.name}
                    style={{
                      position:"absolute",inset:0,
                      width:"100%",height:"100%",
                      objectFit:"cover",
                      objectPosition:"center 15%",  // show face not top of head
                    }}
                    onError={e=>{ e.target.style.display="none" }}
                  />
                )}

                {/* Gradient fade at bottom for name overlay readability */}
                <div style={{position:"absolute",bottom:0,left:0,right:0,
                  height:"45%",
                  background:"linear-gradient(to top,rgba(0,0,0,0.75),transparent)"}}/>

                {/* Name overlay on photo */}
                <div style={{position:"absolute",bottom:0,left:0,right:0,
                  padding:"6px 8px"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",
                    fontWeight:900,fontSize:"clamp(11px,3.2vw,14px)",
                    color:WHITE,lineHeight:1,letterSpacing:"0.02em",
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                    textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>
                    {firstName&&<span style={{fontWeight:400,opacity:0.8,marginRight:3,
                      fontSize:"clamp(9px,2.5vw,11px)"}}>{firstName}</span>}
                    <span>{lastName.toUpperCase()}</span>
                  </div>
                </div>

                {/* Team badge — top right */}
                <div style={{position:"absolute",top:7,right:7,
                  background:p.team==="FIRST TEAM"?GOLD:p.team==="U21"?GREEN:"#e67e22",
                  color:p.team==="FIRST TEAM"?NAVY:WHITE,
                  borderRadius:5,padding:"2px 6px",
                  fontSize:8,fontWeight:900,
                  fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.05em"}}>
                  {p.team==="FIRST TEAM"?"1ST":p.team}
                </div>
              </div>

              {/* ── INFO STRIP below photo ── */}
              <div style={{
                padding:"7px 10px 9px",
                background:WHITE,
                borderTop:`2px solid ${GOLD}22`,
              }}>
                <div style={{display:"flex",justifyContent:"space-between",
                  alignItems:"center"}}>
                  <div style={{fontSize:"clamp(9px,2.5vw,10px)",color:GOLD2,
                    fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",
                    letterSpacing:"0.03em"}}>
                    {p.id}
                  </div>
                  <div style={{fontSize:"clamp(9px,2.5vw,10px)",color:MGRAY,
                    fontWeight:600}}>
                    Age {age}
                  </div>
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
          {Object.keys(playerPhotos).filter(k=>playerPhotos[k]).length} of {SQUAD.length} players have photos · Managed via Admin Panel
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



export default CalendarScreen
