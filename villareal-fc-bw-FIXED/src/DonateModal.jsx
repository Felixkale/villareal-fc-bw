import React, { useState, useEffect, useRef } from "react"
import { supabase } from "./supabaseClient"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY, Logo, Btn, Field } from "./constants"

/* ══════════════════════════════════════════════════════════════════════════════
   DONATE MODAL
══════════════════════════════════════════════════════════════════════════════ */
const DonateModal = ({ onClose, userEmail }) => {
  const [amount,  setAmount]  = useState("50")
  const [custom,  setCustom]  = useState("")
  const [name,    setName]    = useState("")
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState("")
  const presets  = ["20","50","100","200"]
  const finalAmt = custom || amount

  const handleDonate = async () => {
    if (!finalAmt || isNaN(finalAmt) || Number(finalAmt)<=0) {
      setError("Please enter a valid amount."); return
    }
    setLoading(true); setError("")
    const { error: err } = await supabase.from("donations").insert({
      donor_name: name||"Anonymous", email:userEmail||null, amount:Number(finalAmt),
    })
    setLoading(false)
    if (err) { setError("Something went wrong. Please try again."); return }
    setDone(true)
  }

  if (done) return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:999,
      display:"flex", alignItems:"center", justifyContent:"center", padding:"0 20px" }}>
      <div style={{ background:WHITE, borderRadius:20, padding:"32px 24px",
        textAlign:"center", width:"100%", maxWidth:340 }}>
        <div style={{ fontSize:52, marginBottom:10 }}>🎉</div>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900,
          fontSize:24, color:NAVY }}>THANK YOU, HONEY BADGER!</div>
        <div style={{ fontSize:14, color:MGRAY, margin:"10px 0 24px", lineHeight:1.6 }}>
          Your P{finalAmt} donation fuels the dream.<br/>See you at the pitch!
        </div>
        <Btn onClick={onClose}>CLOSE</Btn>
      </div>
    </div>
  )

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:999,
      display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ background:WHITE, borderRadius:"22px 22px 0 0", width:"100%",
        maxWidth:480, padding:"20px 20px",
        paddingBottom:"calc(24px + env(safe-area-inset-bottom,0px))" }}>
        <div style={{ width:40, height:4, background:"#ddd", borderRadius:2, margin:"0 auto 18px" }}/>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
          <Logo size={34}/>
          <div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:17, color:NAVY }}>
              SUPPORT THE HONEY BADGERS
            </div>
            <div style={{ fontSize:12, color:MGRAY }}>Every Pula counts!</div>
          </div>
        </div>
        <Field label="YOUR NAME (optional)" placeholder="e.g. Kgopotso"
          value={name} onChange={e=>setName(e.target.value)}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:12 }}>
          {presets.map(p=>(
            <button key={p} onClick={()=>{setAmount(p);setCustom("")}} style={{
              padding:"12px 0", borderRadius:10, minHeight:48,
              border:`2px solid ${amount===p&&!custom?GOLD:"#ddd"}`,
              background:amount===p&&!custom?`${GOLD}22`:WHITE,
              fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:15,
              color:NAVY, cursor:"pointer", WebkitTapHighlightColor:"transparent",
            }}>P{p}</button>
          ))}
        </div>
        <div style={{ position:"relative", marginBottom:14 }}>
          <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
            fontWeight:700, color:MGRAY, fontSize:15 }}>P</span>
          <input type="number" placeholder="Custom amount" value={custom}
            onChange={e=>{setCustom(e.target.value);setAmount("")}}
            style={{ width:"100%", padding:"13px 13px 13px 28px", borderRadius:10,
              border:`2px solid ${custom?GOLD:"#ddd"}`, fontSize:16, minHeight:50,
              fontFamily:"inherit", outline:"none", boxSizing:"border-box",
              WebkitAppearance:"none" }}/>
        </div>
        {error && <div style={{color:RED,fontSize:13,marginBottom:12,fontWeight:600}}>{error}</div>}
        <Btn onClick={handleDonate} disabled={loading} sx={{marginBottom:8}}>
          {loading?"PROCESSING...":`DONATE P${finalAmt||"—"} NOW ❤️`}
        </Btn>
        <button onClick={onClose} style={{ width:"100%", padding:"12px", background:"none",
          border:"none", fontSize:14, color:MGRAY, cursor:"pointer" }}>Cancel</button>
      </div>
    </div>
  )
}



export default DonateModal
