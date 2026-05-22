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

  // Photos loaded from Supabase Storage (uploaded via admin panel)

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
                opacity:1,
                transition:"opacity 0.15s",
              }}>

              {/* Photo area */}
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
                  </div>
                )}

                {/* Status badge top-left — only show if has photo */}
                {hasPhoto&&(
                  <div style={{position:"absolute",top:5,left:5,
                    background:GREEN,borderRadius:4,padding:"2px 5px",
                    fontSize:8,color:WHITE,fontWeight:700,
                    fontFamily:"'Barlow Condensed',sans-serif"}}>✓</div>
                )}

                {/* Team badge top-right */}
                <div style={{position:"absolute",top:5,right:5,
                  background:p.team==="FIRST TEAM"?NAVY:p.team==="U21"?GREEN:"#e67e22",
                  borderRadius:4,padding:"2px 5px",
                  fontSize:7,color:WHITE,fontWeight:800,
                  fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.04em"}}>
                  {p.team==="FIRST TEAM"?"1ST":p.team}
                </div>
              </div>

              {/* Name & info */}
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
