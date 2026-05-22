import React, { useState } from "react"
import { supabase } from "./supabaseClient"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY, Logo, Ico, Btn } from "./constants"
import DigitalMembershipCard from "./DigitalMembershipCard"
import AdminPanel from "./AdminPanel"

/* ══════════════════════════════════════════════════════════════════════════════
   PROFILE SCREEN
══════════════════════════════════════════════════════════════════════════════ */
const ProfileScreen=({session,profile,onLogout,goToAuth,openMembership})=>{

  const [showAdmin, setShowAdmin] = useState(false)

  // ── Benefits by tier ───────────────────────────────────────────────────────
  const honeyBadgerBenefits=[
    { title:"FREE ENTRY TO HOME MATCHES",  sub:"Walk in free every home game",          emoji:"🏟️", bg:"linear-gradient(135deg,#1a3a6e,#0d2244)" },
    { title:"20% OFF MATCH-DAY TICKETS",   sub:"Biggest discount on all match tickets", emoji:"🎟️", bg:"linear-gradient(135deg,#1e4d2b,#0d2a18)" },
    { title:"10% OFF OFFICIAL STORE",      sub:"Save on all merch & kits",              emoji:"👕", bg:"linear-gradient(135deg,#4a2000,#2a1200)" },
    { title:"DIGITAL MEMBERSHIP CARD",     sub:"Your official Honey Badger card",       emoji:"💳", bg:"linear-gradient(135deg,#7a6000,#3a2e00)" },
    { title:"EXCLUSIVE MEMBER EVENTS",     sub:"Invites to member-only events",         emoji:"🎉", bg:"linear-gradient(135deg,#2a0d4a,#180830)" },
    { title:"VOTE IN CLUB DECISIONS",      sub:"Have your say in club matters",         emoji:"📢", bg:"linear-gradient(135deg,#1a3a6e,#0d2244)" },
    { title:"VIP MATCH-DAY EXPERIENCE",    sub:"Premium hospitality access",            emoji:"👑", bg:"linear-gradient(135deg,#3a1a00,#1a0d00)" },
  ]

  const globalFanBenefits=[
    { title:"5% OFF OFFICIAL STORE",        sub:"Save on all merch & kits",             emoji:"🏷️", bg:"linear-gradient(135deg,#4a2000,#2a1200)" },
    { title:"10% OFF MATCH-DAY TICKETS",    sub:"Discount on every match",              emoji:"🎟️", bg:"linear-gradient(135deg,#1e4d2b,#0d2a18)" },
    { title:"EARLY TICKET ACCESS (48HR)",   sub:"Exclusive 48hr pre-sale window",       emoji:"⚡", bg:"linear-gradient(135deg,#1a3a6e,#0d2244)" },
    { title:"EXCLUSIVE MEMBER KIT NUMBER",  sub:"Your personal squad number",           emoji:"🔢", bg:"linear-gradient(135deg,#3a1a00,#1a0d00)" },
    { title:"PRIORITY SQUAD UPDATES",       sub:"News before anyone else",              emoji:"📊", bg:"linear-gradient(135deg,#2a0d4a,#180830)" },
  ]

  const freeBenefits=[
    { title:"CLUB NEWS & MATCH UPDATES",    sub:"Stay up to date",                      emoji:"📰", bg:"linear-gradient(135deg,#1a3a6e,#0d2244)" },
    { title:"FIXTURES & STANDINGS",         sub:"Full schedule & league table",         emoji:"📅", bg:"linear-gradient(135deg,#1e4d2b,#0d2a18)" },
    { title:"CLIPS & HIGHLIGHTS",           sub:"Watch match highlights",               emoji:"🎬", bg:"linear-gradient(135deg,#2a0d4a,#180830)" },
    { title:"EARLY STORE NOTIFICATIONS",    sub:"First to know about new drops",        emoji:"🛒", bg:"linear-gradient(135deg,#4a2000,#2a1200)" },
  ]

  const tier     = profile?.tier
  const benefits =
    tier === "honey_badger" ? honeyBadgerBenefits :
    tier === "global_fan"   ? globalFanBenefits   :
    freeBenefits

  const settings=[
    { icon:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",  label:"Personal Information",   action:null },
    { icon:"M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",       label:"Notification Settings",  action:null },
    { icon:"M12 2a10 10 0 100 20A10 10 0 0012 2z M8 12h8 M12 8v8",                        label:"Cookie Settings",        action:null },
    { icon:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",                               label:"Are you a member? →",    action:openMembership },
    ...(profile?.role==="admin" ? [{
      icon:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      label:"⚙️ Admin Panel",
      action:()=>setShowAdmin(true),
    }] : []),
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
  const isMember    = tier==="honey_badger"||tier==="global_fan"
  const isHoneyBadger = tier==="honey_badger"
  const tierLabel   =
    tier==="honey_badger" ? "🦡 HONEY BADGER MEMBER" :
    tier==="global_fan"   ? "🌍 GLOBAL FAN MEMBER"   :
    "FREE FAN"

  return (
    <div style={{flex:1,overflowY:"auto",background:"#f5f6fa",
      WebkitOverflowScrolling:"touch",scrollBehavior:"smooth"}}>

      {/* ── HERO ── */}
      <div style={{
        background:`linear-gradient(160deg,${NAVY} 0%,#1a3060 60%,#0d2244 100%)`,
        padding:"28px 20px 0",position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",right:-30,top:-30,opacity:0.06}}>
          <Logo size={200}/>
        </div>
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
            <div style={{position:"absolute",bottom:4,right:4,width:14,height:14,
              borderRadius:"50%",background:"#27AE60",border:`2px solid ${NAVY}`}}/>
          </div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:"clamp(22px,6vw,28px)",color:WHITE,letterSpacing:"0.04em",
            textAlign:"center",lineHeight:1}}>
            {displayName}
          </div>
          <div style={{
            marginTop:8,display:"inline-flex",alignItems:"center",gap:6,
            background:isMember?GOLD:"rgba(255,255,255,0.15)",
            color:isMember?NAVY:WHITE,
            padding:"5px 16px",borderRadius:20,
            fontSize:11,fontWeight:900,
            fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.12em",
          }}>
            {tierLabel}
          </div>
        </div>
        <div style={{
          display:"grid",gridTemplateColumns:"1fr 1fr 1fr",
          background:"rgba(255,255,255,0.07)",
          borderRadius:"12px 12px 0 0",padding:"14px 0",marginTop:4,
        }}>
          {[
            {label:"SEASON",   value:"2026/27"},
            {label:"STATUS",   value:isMember?"MEMBER":"FAN"},
            {label:"DIVISION", value:"BRFA D1"},
          ].map((s,i)=>(
            <div key={i} style={{textAlign:"center",
              borderRight:i<2?`1px solid rgba(255,255,255,0.1)`:"none",padding:"0 8px"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:"clamp(13px,4vw,16px)",color:GOLD,lineHeight:1}}>{s.value}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",
                fontFamily:"'Barlow Condensed',sans-serif",
                letterSpacing:"0.08em",marginTop:3}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── UPGRADE BANNER (free only) ── */}
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
                P500/year · Save P100
              </div>
            </div>
            <div style={{background:NAVY,borderRadius:8,padding:"6px 14px",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:13,color:GOLD,flexShrink:0}}>JOIN →</div>
          </button>
        </div>
      )}

      {/* ── DIGITAL MEMBERSHIP CARD (members only) ── */}
      {isMember&&(
        <div style={{margin:"16px 14px 0"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.1em",marginBottom:10}}>
            MEMBERSHIP CARD
          </div>
          <DigitalMembershipCard
            memberId={session.user.id}
            clubName="VILLAREAL FC"
            season="2026/27"
          />
        </div>
      )}

      {/* ── BENEFITS ── */}
      <div style={{padding:"16px 14px 4px"}}>
        <div style={{display:"flex",justifyContent:"space-between",
          alignItems:"center",marginBottom:10}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.1em"}}>BENEFITS</div>
          {isMember&&(
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
              fontSize:12,color:NAVY,cursor:"pointer"}}>See all</span>
          )}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {benefits.map((b,i)=>(
            <div key={i} style={{
              display:"flex",alignItems:"center",gap:12,
              background:WHITE,borderRadius:14,overflow:"hidden",
              boxShadow:"0 1px 6px rgba(0,0,0,0.06)",
            }}>
              <div style={{
                width:60,height:60,flexShrink:0,background:b.bg,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,
              }}>
                {b.emoji}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:"clamp(12px,3.5vw,14px)",color:NAVY}}>{b.title}</div>
                <div style={{fontSize:12,color:MGRAY,marginTop:2}}>{b.sub}</div>
              </div>
              <div style={{paddingRight:14,color:"#ccc",fontSize:20,fontWeight:300,flexShrink:0}}>···</div>
            </div>
          ))}
        </div>
        {!isMember&&(
          <button onClick={openMembership} style={{
            width:"100%",marginTop:12,padding:"12px 16px",
            background:"transparent",border:`1.5px dashed ${GOLD}`,
            borderRadius:14,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            WebkitTapHighlightColor:"transparent",
          }}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:13,color:GOLD,letterSpacing:"0.08em"}}>
              🔒 UNLOCK MORE BENEFITS — JOIN NOW
            </span>
          </button>
        )}
      </div>

      {/* ── ACCOUNT ── */}
      <div style={{margin:"16px 14px 0",background:WHITE,borderRadius:14,
        overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
        <div style={{padding:"10px 14px 6px",borderBottom:`1px solid #f0f0f0`}}>
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
            {isHoneyBadger
              ? "🦡 Honey Badger — Active"
              : isMember
              ? "🌍 Global Fan — Active"
              : "Free Fan · Upgrade to unlock more"}
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
              WebkitTapHighlightColor:"transparent"}}>
            <div style={{width:34,height:34,borderRadius:9,flexShrink:0,
              background:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ico d={s.icon} stroke={NAVY} sw={1.6} size={18}/>
            </div>
            <span style={{flex:1,fontSize:14,color:NAVY,
              fontWeight:s.action?700:500}}>{s.label}</span>
            <span style={{color:s.action?GOLD2:"#ccc",fontSize:18,
              fontWeight:s.action?700:400}}>›</span>
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

      {/* ── LOGOUT ── */}
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

      {/* ── ADMIN PANEL (admin only) ── */}
      {showAdmin && <AdminPanel onClose={()=>setShowAdmin(false)} />}

    </div>
  )
}

export default ProfileScreen
