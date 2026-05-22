import React, { useState, useEffect, useRef } from "react"
import { supabase } from "./supabaseClient"
import DonateModal from "./DonateModal"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY, Logo, Pill, Btn, SQUAD } from "./constants"

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



export default ForYouScreen
