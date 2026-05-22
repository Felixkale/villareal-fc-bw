import React, { useState, useEffect, useRef } from "react"
import { supabase } from "./supabaseClient"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY, Logo, Btn, BottomNav } from "./constants"
import DonateModal    from "./DonateModal"
import ForYouScreen   from "./ForYouScreen"
import CalendarScreen from "./CalendarScreen"
import ClipsScreen    from "./ClipsScreen"
import StoreScreen    from "./StoreScreen"
import AuthScreen     from "./AuthScreen"
import ProfileScreen  from "./ProfileScreen"
import MembershipPage from "./MembershipPage"
import StatusBar      from "./StatusBar"

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
    // Handle email confirmation redirect — Supabase puts token in URL hash
    supabase.auth.getSession().then(({data:{session}})=>{
      setSession(session)
      setBooting(false)
    })
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      setSession(session)
      // SIGNED_IN fires when email link is clicked and user lands on site
      if(event==="SIGNED_IN"&&session){
        setActiveTab("profile")
        setShowAuth(false)
      }
    })
    return ()=>subscription.unsubscribe()
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
    <div style={{minHeight:"100dvh",
      background:`linear-gradient(160deg,${NAVY},#0a1020)`,
      display:"flex",alignItems:"center",justifyContent:"center"}}>
      <Logo size={60}/>
    </div>
  )

  const HEADER_LABELS={foryou:null,calendar:"CALENDAR",clips:null,store:"STORE",profile:null}
  const hdr=HEADER_LABELS[activeTab]

  const renderScreen=()=>{
    if(showMembership) return null // rendered as overlay
    if(showAuth) return <AuthScreen
      onSuccess={()=>{setShowAuth(false);setActiveTab("profile")}}
      onGuest={()=>setShowAuth(false)}/>
    switch(activeTab){
      case "foryou":   return <ForYouScreen userEmail={session?.user?.email} goToAuth={goToAuth} session={session} openMembership={()=>setShowMembership(true)} setActiveTab={setActiveTab}/>
      case "calendar": return <CalendarScreen/>
      case "clips":    return <ClipsScreen/>
      case "store":    return <StoreScreen goToAuth={goToAuth} fixtures={fixtures} openMembership={()=>setShowMembership(true)} session={session} profile={profile}/>
      case "profile":  return <ProfileScreen session={session} profile={profile}
                         onLogout={handleLogout} goToAuth={goToAuth}
                         openMembership={()=>setShowMembership(true)}/>
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
          min-height:100vh;
          min-height:100dvh;
          -webkit-font-smoothing:antialiased;
        }
        .phone-frame { --clip-h: calc(680px - 180px); }
        @media(max-width:519px){ .phone-frame { --clip-h: calc(100dvh - 130px); } }
        input,button{font-family:inherit}
        input{-webkit-appearance:none;appearance:none}

        .app-root{
          display:flex;
          flex-direction:column;
          min-height:100vh;
          min-height:100dvh;
          background:linear-gradient(160deg,${NAVY} 0%,#0a1020 100%);
        }
        .app-strip{
          padding:14px 16px 8px;
          display:flex;
          align-items:center;
          gap:12px;
        }
        .phone-frame{
          flex:1;
          display:flex;
          flex-direction:column;
          background:#fff;
          overflow:hidden;
          position:relative;
          /* Critical: prevents content from pushing nav off screen */
          min-height:0;
        }
        @media(min-width:520px){
          .app-root{
            align-items:center;
            padding:16px 0 24px;
          }
          .app-strip,.phone-frame{
            width:100%;
            max-width:430px;
          }
          .phone-frame{
            flex:none;
            height:760px;
            border-radius:38px;
            border:7px solid #1c1c1c;
            box-shadow:0 28px 70px rgba(0,0,0,0.75),inset 0 0 0 1px rgba(255,255,255,0.07);
          }
        }
        /* On real mobile, full height with nav always visible */
        @media(max-width:519px){
          .app-root{
            min-height:100vh;
            min-height:100dvh;
          }
          .phone-frame{
            flex:1;
            min-height:0;
            border-radius:0;
          }
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
          {/* Status bar — real time, network, battery */}
          <StatusBar dark={activeTab==="clips"||showAuth}/>

          {/* Section header */}
          {hdr&&!showAuth&&(
            <div style={{padding:"8px 16px",background:WHITE,display:"flex",
              alignItems:"center",justifyContent:"space-between",
              borderBottom:`1px solid #eee`,flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                {activeTab==="foryou"
                  ? <img src="/logo_90stars.png" alt="90 Stars"
                      style={{width:32,height:32,borderRadius:"50%",objectFit:"contain",
                        background:NAVY,padding:2}}
                      onError={e=>{e.target.style.display="none"}}/>
                  : <Logo size={28}/>
                }
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:"clamp(16px,5vw,20px)",color:NAVY}}>
                  {activeTab==="foryou"?"90 STARS ACADEMY":hdr}
                </span>
              </div>

            </div>
          )}

          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
            {renderScreen()}
          </div>

          {!showAuth&&<BottomNav active={activeTab} setActive={setActiveTab}/>}

          <div style={{background:activeTab==="clips"?"#000":WHITE,
            paddingBottom:4,paddingTop:3,display:"flex",justifyContent:"center",flexShrink:0}}>
            <div style={{width:110,height:4,background:"#ddd",borderRadius:2}}/>
          </div>

          {/* Membership modal — inside phone frame, slides over content, nav stays visible */}
          {showMembership&&(
            <div style={{position:"absolute",inset:0,zIndex:200,
              display:"flex",flexDirection:"column",
              background:"rgba(0,0,0,0.6)",
              borderRadius:"inherit"}}>
              <MembershipPage
                session={session}
                onClose={()=>setShowMembership(false)}
                onSuccess={()=>{
                  setShowMembership(false)
                  setActiveTab("profile")
                }}
              />
            </div>
          )}
        </div>

        <div style={{textAlign:"center",padding:"10px 0 0",display:"none"}}
          className="desktop-footer">
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",color:"#444",
            fontSize:11,letterSpacing:"0.06em"}}>
            BOTETI REGIONAL FA · DIVISION ONE 2026/27
          </span>
        </div>
      </div>
    </>
  )
}
