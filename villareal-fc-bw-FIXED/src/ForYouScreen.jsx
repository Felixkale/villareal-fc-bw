import React, { useState, useEffect, useRef } from "react"
import { supabase } from "./supabaseClient"
import DonateModal from "./DonateModal"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY, Logo, Btn, Pill } from "./constants"

const ForYouScreen = ({ session, openMembership, setActiveTab }) => {
  const [news,        setNews]        = useState([])
  const [fixtures,    setFixtures]    = useState([])
  const [showDonate,  setShowDonate]  = useState(false)
  const [countdown,   setCountdown]   = useState(null)
  const [activeStory, setActiveStory] = useState(0)

  // Road to Top 8 — season results
  const ROAD = [
    { opp:"STONE BREAKERS", score:"2-0", win:true  },
    { opp:"MIGHTY BIRDS",   score:"1-1", win:false },
    { opp:"DESERT BUFFALOS",score:"0-2", win:false },
    { opp:"ZOWA UNITED",    score:"3-1", win:true  },
    { opp:"GOLDEN BIRDS",   score:"2-1", win:true  },
  ]

  useEffect(()=>{
    supabase.from("news").select("*").eq("published",true)
      .order("created_at",{ascending:false}).limit(10)
      .then(({data})=>{ if(data) setNews(data) })
    supabase.from("fixtures").select("*").order("match_date",{ascending:true})
      .then(({data})=>{ if(data) setFixtures(data) })
  },[])

  // Countdown to next fixture
  const nextFixture = fixtures.find(f=>!f.result && new Date(f.match_date) >= new Date())
  useEffect(()=>{
    if(!nextFixture) return
    const tick = () => {
      const matchTime = new Date(`${nextFixture.match_date}T${nextFixture.kick_off||"15:00"}:00`)
      const diff = matchTime - new Date()
      if(diff <= 0){ setCountdown(null); return }
      const d = Math.floor(diff/86400000)
      const h = Math.floor((diff%86400000)/3600000)
      const m = Math.floor((diff%3600000)/60000)
      const s = Math.floor((diff%60000)/1000)
      setCountdown({d,h,m,s})
    }
    tick()
    const id = setInterval(tick, 1000)
    return ()=>clearInterval(id)
  },[nextFixture])

  const CountdownBox = ({val,label}) => (
    <div style={{textAlign:"center",minWidth:"clamp(44px,11vw,56px)"}}>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
        fontSize:"clamp(22px,6vw,30px)",color:GOLD,lineHeight:1,
        background:"rgba(255,255,255,0.1)",borderRadius:8,
        padding:"4px 6px",minWidth:44}}>
        {String(val).padStart(2,"0")}
      </div>
      <div style={{fontSize:"clamp(8px,2vw,9px)",color:"rgba(255,255,255,0.6)",
        marginTop:3,letterSpacing:"0.08em",fontFamily:"'Barlow Condensed',sans-serif",
        fontWeight:700}}>{label}</div>
    </div>
  )

  const recentResults = fixtures.filter(f=>f.result).slice(-5)

  return (
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",
      background:"#f5f6fa"}}>

      {showDonate&&<DonateModal onClose={()=>setShowDonate(false)} session={session}/>}

      {/* ── NEXT MATCH COUNTDOWN ── */}
      {nextFixture&&countdown&&(
        <div style={{background:`linear-gradient(160deg,${NAVY} 0%,#1a3060 100%)`,
          padding:"clamp(14px,4vw,20px) clamp(14px,4vw,18px)",
          position:"relative",overflow:"hidden"}}>
          <div style={{opacity:0.06,position:"absolute",right:-20,top:-20,pointerEvents:"none"}}>
            <Logo size={180}/>
          </div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:"clamp(9px,2.5vw,11px)",color:GOLD,letterSpacing:"0.12em",marginBottom:8}}>
            NEXT MATCH
          </div>
          {/* Teams row */}
          {(() => {
            // Map opponent names to their logos
            const OPP_LOGOS = {
              "Golden Birds":        "/logo_golden_birds.png",
              "GOLDEN BIRDS":        "/logo_golden_birds.png",
            }
            const oppLogo = OPP_LOGOS[nextFixture.opponent]
            return (
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
              marginBottom:12,gap:8}}>
              {/* Our team */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",
                gap:6,flex:1,minWidth:0}}>
                <img src="/logo_90stars.png" alt="Villareal FC"
                  style={{width:"clamp(44px,12vw,56px)",height:"clamp(44px,12vw,56px)",
                    objectFit:"contain",borderRadius:"50%",
                    background:"rgba(255,255,255,0.1)",padding:2}}/>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:"clamp(10px,3vw,13px)",color:WHITE,lineHeight:1,
                  textAlign:"center"}}>VILLAREAL FC</div>
              </div>
              {/* VS */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:"clamp(14px,4vw,20px)",color:GOLD}}>VS</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",
                  fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                  letterSpacing:"0.06em"}}>WEEK 24</div>
              </div>
              {/* Opponent */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",
                gap:6,flex:1,minWidth:0}}>
                <div style={{width:"clamp(44px,12vw,56px)",height:"clamp(44px,12vw,56px)",
                  borderRadius:"50%",background:"rgba(255,255,255,0.1)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  overflow:"hidden",padding:2}}>
                  {oppLogo
                    ? <img src={oppLogo} alt={nextFixture.opponent}
                        style={{width:"100%",height:"100%",objectFit:"contain"}}/>
                    : <span style={{fontSize:24}}>⚽</span>
                  }
                </div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:"clamp(10px,3vw,13px)",color:WHITE,lineHeight:1,
                  textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",
                  whiteSpace:"nowrap",maxWidth:"clamp(70px,20vw,100px)"}}>
                  {nextFixture.opponent.toUpperCase()}
                </div>
              </div>
            </div>
            )
          })()}
          {/* Match info */}
          <div style={{fontSize:"clamp(10px,2.8vw,12px)",color:"rgba(255,255,255,0.6)",
            marginBottom:12,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <span>📅 {new Date(nextFixture.match_date).toLocaleDateString("en-GB",
              {weekday:"short",day:"numeric",month:"short"})}</span>
            <span>⏰ {nextFixture.kick_off||"15:00"}</span>
            <span>📍 Falcon Ground</span>
            <span style={{background:GREEN,
              color:WHITE,padding:"1px 6px",borderRadius:3,fontSize:9,fontWeight:800,
              fontFamily:"'Barlow Condensed',sans-serif"}}>HOME</span>
          </div>
          {/* Countdown */}
          <div style={{display:"flex",gap:"clamp(6px,2vw,10px)",alignItems:"center"}}>
            <CountdownBox val={countdown.d} label="DAYS"/>
            <div style={{color:"rgba(255,255,255,0.4)",fontWeight:900,fontSize:20,
              marginBottom:14}}>:</div>
            <CountdownBox val={countdown.h} label="HRS"/>
            <div style={{color:"rgba(255,255,255,0.4)",fontWeight:900,fontSize:20,
              marginBottom:14}}>:</div>
            <CountdownBox val={countdown.m} label="MINS"/>
            <div style={{color:"rgba(255,255,255,0.4)",fontWeight:900,fontSize:20,
              marginBottom:14}}>:</div>
            <CountdownBox val={countdown.s} label="SECS"/>
            <div style={{marginLeft:"auto"}}>
              <div style={{background:GOLD,color:NAVY,borderRadius:8,
                padding:"8px 12px",fontFamily:"'Barlow Condensed',sans-serif",
                fontWeight:900,fontSize:"clamp(10px,2.8vw,12px)",
                letterSpacing:"0.06em",textAlign:"center",cursor:"pointer"}}
                onClick={()=>setActiveTab&&setActiveTab("calendar")}>
                MATCH<br/>CENTER
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── QUICK ACTIONS ── */}
      <div style={{padding:"10px 12px 0",display:"flex",gap:8,overflowX:"auto",
        WebkitOverflowScrolling:"touch"}}>
        {[
          {icon:"🎟",label:"TICKETS",  action:()=>setActiveTab&&setActiveTab("store")},
          {icon:"👕",label:"SHOP",     action:()=>setActiveTab&&setActiveTab("store")},
          {icon:"❤️",label:"DONATE",   action:()=>setShowDonate(true)},
          {icon:"📰",label:"NEWS",     action:null},
          {icon:"🦡",label:"MEMBERS",  action:openMembership},
        ].map(item=>(
          <button key={item.label} onClick={item.action||undefined}
            style={{flexShrink:0,display:"flex",flexDirection:"column",
              alignItems:"center",gap:4,padding:"8px 12px",
              background:WHITE,border:"1.5px solid #eee",borderRadius:12,
              cursor:item.action?"pointer":"default",minWidth:60,
              WebkitTapHighlightColor:"transparent",
              boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            <span style={{fontSize:20}}>{item.icon}</span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:9,color:NAVY,letterSpacing:"0.06em"}}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* ── ROAD TO TOP 8 ── */}
      {recentResults.length>0&&(
        <div style={{padding:"14px 12px 0"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:"clamp(14px,4vw,17px)",color:NAVY,marginBottom:10,
            display:"flex",alignItems:"center",gap:8}}>
            🏆 ROAD TO TOP 8
            <span style={{fontSize:11,color:MGRAY,fontWeight:600}}>
              · Season 2026/27
            </span>
          </div>
          <div style={{display:"flex",gap:8,overflowX:"auto",
            WebkitOverflowScrolling:"touch",paddingBottom:4}}>
            {recentResults.map((f,i)=>{
              const win  = f.result==="W"
              const draw = f.result==="D"
              return (
                <div key={i} style={{flexShrink:0,display:"flex",flexDirection:"column",
                  alignItems:"center",gap:5}}>
                  <div style={{
                    width:"clamp(52px,14vw,64px)",
                    height:"clamp(52px,14vw,64px)",
                    borderRadius:"50%",
                    border:`3px solid ${win?GOLD:draw?"#888":RED}`,
                    background:win?`${GOLD}18`:draw?"#f5f5f5":"#fef2f2",
                    display:"flex",flexDirection:"column",
                    alignItems:"center",justifyContent:"center",
                  }}>
                    <span style={{fontSize:14}}>⚽</span>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                      fontWeight:900,fontSize:"clamp(9px,2.5vw,11px)",
                      color:win?GOLD2:draw?MGRAY:RED,lineHeight:1}}>
                      {f.score_us}-{f.score_them}
                    </span>
                  </div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",
                    fontWeight:700,fontSize:"clamp(8px,2vw,9px)",color:MGRAY,
                    textAlign:"center",maxWidth:64,
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {f.opponent}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── DONATE BANNER ── */}
      <div style={{margin:"12px 12px 0"}}>
        <div onClick={()=>setShowDonate(true)}
          style={{background:`linear-gradient(135deg,${RED},#922b21)`,
            borderRadius:14,padding:"14px 16px",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"space-between",
            WebkitTapHighlightColor:"transparent",
            boxShadow:"0 4px 14px rgba(192,57,43,0.3)"}}>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:"clamp(14px,4vw,18px)",color:WHITE,lineHeight:1}}>
              ❤️ SUPPORT THE HONEY BADGERS
            </div>
            <div style={{fontSize:"clamp(11px,3vw,13px)",color:"rgba(255,255,255,0.75)",
              marginTop:4}}>
              Every pula helps the team grow
            </div>
          </div>
          <div style={{background:WHITE,color:RED,borderRadius:8,
            padding:"8px 14px",fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:900,fontSize:"clamp(11px,3vw,13px)",flexShrink:0,
            letterSpacing:"0.04em"}}>
            DONATE →
          </div>
        </div>
      </div>

      {/* ── NEWS FEED ── */}
      <div style={{padding:"14px 12px 20px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:"clamp(14px,4vw,17px)",color:NAVY,marginBottom:10}}>
          📰 LATEST NEWS
        </div>
        {news.length===0?(
          <div style={{textAlign:"center",padding:"24px",color:MGRAY,fontSize:13,
            background:WHITE,borderRadius:12}}>
            No news yet. Check back soon!
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {news.map((n,i)=>(
              <div key={n.id} style={{background:WHITE,borderRadius:14,
                overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
                {/* Coloured top strip */}
                <div style={{height:4,background:i===0?GOLD:i===1?GREEN:NAVY}}/>
                <div style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                    <span style={{background:NAVY,color:GOLD,fontSize:9,fontWeight:900,
                      padding:"2px 7px",borderRadius:4,
                      fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em"}}>
                      {n.tag||"NEWS"}
                    </span>
                    <span style={{fontSize:11,color:MGRAY}}>
                      {new Date(n.created_at).toLocaleDateString("en-GB",
                        {day:"numeric",month:"short"})}
                    </span>
                  </div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                    fontSize:"clamp(14px,4vw,17px)",color:NAVY,lineHeight:1.2,
                    marginBottom:6}}>{n.title}</div>
                  {n.summary&&(
                    <div style={{fontSize:"clamp(12px,3vw,13px)",color:MGRAY,
                      lineHeight:1.6,display:"-webkit-box",
                      WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                      {n.summary}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ForYouScreen
