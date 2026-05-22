import React, { useState, useEffect, useRef } from "react"
import { supabase } from "./supabaseClient"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY, Logo, Btn } from "./constants"

/* ══════════════════════════════════════════════════════════════════════════════
   AUTH — real Supabase auth, secure
══════════════════════════════════════════════════════════════════════════════ */
const AuthScreen=({onSuccess,onGuest})=>{
  const [mode,setMode]=useState("ask")
  const [email,setEmail]=useState("")
  const [password,setPass]=useState("")
  const [name,setName]=useState("")
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState("")
  const [done,setDone]=useState(false)

  const reset=()=>{ setError(""); setEmail(""); setPass(""); setName("") }

  const handleAuth=async()=>{
    setError("")
    if(!email.trim())        { setError("Please enter your email."); return }
    if(password.length<6)    { setError("Password must be at least 6 characters."); return }
    if(mode==="signup"&&!name.trim()) { setError("Please enter your full name."); return }
    setLoading(true)
    if(mode==="login"){
      const {error:err}=await supabase.auth.signInWithPassword({email:email.trim(),password})
      if(err){ setError(err.message); setLoading(false); return }
      onSuccess()
    } else {
      const {error:err}=await supabase.auth.signUp({
        email:email.trim(), password,
        options:{data:{full_name:name.trim()}}
      })
      if(err){ setError(err.message); setLoading(false); return }
      setDone(true)
    }
    setLoading(false)
  }

  if(done) return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",background:WHITE,padding:"24px 20px",textAlign:"center"}}>
      <div style={{fontSize:54,marginBottom:12}}>📧</div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
        fontSize:"clamp(20px,6vw,26px)",color:NAVY,marginBottom:8}}>CHECK YOUR EMAIL</div>
      <div style={{fontSize:14,color:MGRAY,lineHeight:1.7,marginBottom:28,maxWidth:300}}>
        We sent a confirmation link to<br/><strong>{email}</strong>.<br/>
        Click it to activate your account, then log in.
      </div>
      <div style={{width:"100%",maxWidth:320}}>
        <Btn onClick={()=>{setDone(false);setMode("login");reset()}}>GO TO LOGIN</Btn>
      </div>
    </div>
  )

  if(mode==="ask") return (
    <div style={{flex:1,overflowY:"auto",background:WHITE,WebkitOverflowScrolling:"touch"}}>
      <div style={{background:`linear-gradient(160deg,${NAVY},#0a1428)`,
        padding:"clamp(28px,8vw,44px) clamp(16px,5vw,24px)",
        textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{opacity:0.07,position:"absolute",right:-20,bottom:-20}}><Logo size={200}/></div>
        <Logo size={66}/>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:"clamp(26px,8vw,36px)",color:WHITE,marginTop:12}}>VILLAREAL FC</div>
        <div style={{fontSize:"clamp(11px,3vw,13px)",color:GOLD,fontWeight:700,
          fontFamily:"'Barlow Condensed',sans-serif",marginTop:4}}>
          "THE HONEY BADGERS" · BRFA DIV 1
        </div>
      </div>

      <div style={{padding:"clamp(18px,5vw,28px) clamp(16px,4vw,20px)"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:"clamp(20px,6vw,26px)",color:NAVY,marginBottom:6}}>
          ARE YOU A MEMBER?
        </div>
        <div style={{fontSize:14,color:MGRAY,marginBottom:22,lineHeight:1.6}}>
          The Honey Badger members get early ticket access, exclusive discounts, and more.
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Btn onClick={()=>{reset();setMode("login")}}
            bg={`linear-gradient(135deg,${GOLD},${GOLD2})`} color={NAVY}>
            ✔ YES — LOG IN TO MY ACCOUNT
          </Btn>
          <Btn onClick={()=>{reset();setMode("signup")}} bg={NAVY} color={WHITE}>
            🆕 NO — JOIN THE HONEY BADGERS
          </Btn>
          <Btn onClick={onGuest} bg={WHITE} color={MGRAY} sx={{border:`1.5px solid #ddd`}}>
            Continue as Guest
          </Btn>
        </div>

        <div style={{marginTop:22,borderRadius:14,background:LGRAY,padding:"16px 16px"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:13,color:NAVY,marginBottom:10}}>HONEY BADGER BENEFITS</div>
          {["10% off match-day tickets","5% off online store",
            "Early ticket access","Exclusive kit number"].map((b,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
              <span style={{color:GOLD,fontWeight:800,fontSize:15}}>✔</span>
              <span style={{fontSize:13,color:"#444"}}>{b}</span>
            </div>
          ))}
          <div style={{marginTop:14,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:20,color:NAVY}}>P20<span style={{fontSize:12,fontWeight:600}}>/mo</span></span>
            <span style={{color:MGRAY,fontSize:11}}>or</span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:20,color:NAVY}}>P200<span style={{fontSize:12,fontWeight:600}}>/yr</span></span>
            <span style={{background:GREEN,color:WHITE,fontSize:9,fontWeight:900,
              padding:"2px 7px",borderRadius:3}}>SAVE 17%</span>
          </div>
        </div>
      </div>
    </div>
  )

  const isLogin=mode==="login"
  return (
    <div style={{flex:1,overflowY:"auto",background:WHITE,WebkitOverflowScrolling:"touch"}}>
      <div style={{background:`linear-gradient(160deg,${NAVY},#0a1428)`,
        padding:"clamp(14px,4vw,20px)",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>{reset();setMode("ask")}} style={{
          background:"none",border:"none",color:GOLD,fontSize:28,
          cursor:"pointer",lineHeight:1,padding:"0 4px",minHeight:44,
          WebkitTapHighlightColor:"transparent"}}>‹</button>
        <Logo size={32}/>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:"clamp(14px,4.5vw,18px)",color:WHITE}}>
            {isLogin?"WELCOME BACK":"JOIN THE HONEY BADGERS"}
          </div>
          <div style={{fontSize:11,color:"#aaa"}}>
            {isLogin?"Log in to your account":"Create your membership account"}
          </div>
        </div>
      </div>

      <div style={{padding:"clamp(18px,5vw,24px) clamp(16px,4vw,20px)"}}>
        {!isLogin&&(
          <Field label="FULL NAME" placeholder="e.g. Kgopotso Ntshele"
            value={name} onChange={e=>setName(e.target.value)} autoComplete="name"/>
        )}
        <Field label="EMAIL" type="email" placeholder="you@email.com"
          value={email} onChange={e=>setEmail(e.target.value)}
          autoComplete={isLogin?"email":"username"}/>
        <Field label="PASSWORD" type="password"
          placeholder={isLogin?"Enter your password":"Min. 6 characters"}
          value={password} onChange={e=>setPass(e.target.value)}
          autoComplete={isLogin?"current-password":"new-password"}/>

        {error&&(
          <div style={{background:"#fef2f2",border:`1px solid #fecaca`,borderRadius:8,
            padding:"10px 14px",color:RED,fontSize:13,marginBottom:16,fontWeight:600,lineHeight:1.5}}>
            {error}
          </div>
        )}

        <Btn onClick={handleAuth} disabled={loading}>
          {loading?"PLEASE WAIT...":isLogin?"LOG IN →":"CREATE ACCOUNT →"}
        </Btn>

        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:MGRAY}}>
          {isLogin?"Not a member? ":"Already have an account? "}
          <span onClick={()=>{reset();setMode(isLogin?"signup":"login")}}
            style={{color:NAVY,fontWeight:700,cursor:"pointer"}}>
            {isLogin?"Join The Honey Badgers":"Log in"}
          </span>
        </div>

        {!isLogin&&(
          <div style={{marginTop:16,fontSize:11,color:MGRAY,textAlign:"center",lineHeight:1.7}}>
            By creating an account you agree to our Terms & Privacy Policy.<br/>
            Membership: P20/month or P200/year.
          </div>
        )}
      </div>
    </div>
  )
}



export default AuthScreen
