import React, { useState, useEffect, useRef } from "react"
import { supabase } from "./supabaseClient"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY, Logo, Ico, Btn } from "./constants"

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



export default ProfileScreen
