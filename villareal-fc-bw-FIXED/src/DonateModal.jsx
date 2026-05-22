import React, { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY, Logo } from "./constants"

const DonateModal = ({ onClose, session }) => {
  const [step,      setStep]      = useState(1)  // 1=amount, 2=payment, 3=done
  const [amount,    setAmount]    = useState("")
  const [custom,    setCustom]    = useState("")
  const [method,    setMethod]    = useState("")
  const [ref,       setRef]       = useState("")
  const [name,      setName]      = useState(session?.user?.user_metadata?.full_name||"")
  const [email,     setEmail]     = useState(session?.user?.email||"")
  const [loading,   setLoading]   = useState(false)
  const [err,       setErr]       = useState("")
  const [totalRaised, setTotalRaised] = useState(0)
  const [donorCount,  setDonorCount]  = useState(0)

  const PRESETS = [20, 50, 100, 200, 500]
  const finalAmount = Number(custom || amount)

  const GOAL = 5000  // fundraising goal in BWP

  useEffect(()=>{
    supabase.from("donations").select("amount")
      .then(({data})=>{
        if(data){
          const total = data.reduce((s,d)=>s+Number(d.amount),0)
          setTotalRaised(total)
          setDonorCount(data.length)
        }
      })
  },[])

  const progressPct = Math.min(100, Math.round((totalRaised/GOAL)*100))

  const PAY_METHODS = [
    {id:"orange", label:"Orange Money", icon:"🟠", num:"Dial *145#", account:"74000001"},
    {id:"myzaka",  label:"MyZaka",      icon:"🔵", num:"Dial *167#", account:"74000001"},
    {id:"eft",     label:"Bank Transfer",icon:"🏦", num:"FNB Botswana",account:"62012345678"},
  ]

  const submit = async () => {
    if(!finalAmount||finalAmount<5){setErr("Minimum donation is P5.");return}
    if(!method){setErr("Please select a payment method.");return}
    if(!ref.trim()){setErr("Please enter your payment reference.");return}
    if(!name.trim()){setErr("Please enter your name.");return}
    setLoading(true); setErr("")
    try {
      await supabase.from("donations").insert({
        donor_name: name,
        email:      email||null,
        amount:     finalAmount,
        currency:   "BWP",
        pay_method: method,
        pay_ref:    ref,
        user_id:    session?.user?.id||null,
        status:     "pending",
        created_at: new Date().toISOString(),
      })
      setStep(3)
    } catch(e){
      setErr("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.75)",
      zIndex:300,display:"flex",alignItems:"flex-end"}}>
      <div style={{background:WHITE,width:"100%",borderRadius:"22px 22px 0 0",
        maxHeight:"92%",display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* Header */}
        <div style={{background:`linear-gradient(135deg,${RED},#922b21)`,
          padding:"16px 16px 14px",flexShrink:0}}>
          <div style={{width:40,height:4,background:"rgba(255,255,255,0.3)",
            borderRadius:2,margin:"0 auto 12px"}}/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:22,color:WHITE,lineHeight:1}}>❤️ SUPPORT THE HONEY BADGERS</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.75)",marginTop:3}}>
                {donorCount} fans have donated · P{totalRaised.toLocaleString()} raised
              </div>
            </div>
            <button onClick={onClose}
              style={{background:"rgba(255,255,255,0.2)",border:"none",
                borderRadius:"50%",width:30,height:30,cursor:"pointer",
                color:WHITE,fontSize:14,display:"flex",alignItems:"center",
                justifyContent:"center"}}>✕</button>
          </div>

          {/* Progress bar */}
          <div style={{marginTop:12}}>
            <div style={{display:"flex",justifyContent:"space-between",
              fontSize:10,color:"rgba(255,255,255,0.7)",marginBottom:4,
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>
              <span>FUNDRAISING GOAL</span>
              <span>{progressPct}% · P{GOAL.toLocaleString()} target</span>
            </div>
            <div style={{background:"rgba(255,255,255,0.2)",borderRadius:4,height:8}}>
              <div style={{width:`${progressPct}%`,height:"100%",
                background:GOLD,borderRadius:4,
                transition:"width 0.5s",minWidth:progressPct>0?8:0}}/>
            </div>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",
          padding:"16px 16px 24px"}}>

          {/* STEP 3 — SUCCESS */}
          {step===3&&(
            <div style={{textAlign:"center",padding:"24px 0"}}>
              <div style={{fontSize:52,marginBottom:12}}>🎉</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:24,color:NAVY,marginBottom:8}}>THANK YOU!</div>
              <div style={{fontSize:14,color:MGRAY,lineHeight:1.7,marginBottom:6}}>
                Your donation of <strong style={{color:NAVY}}>P{finalAmount}</strong> has been recorded.
              </div>
              <div style={{fontSize:13,color:MGRAY,lineHeight:1.7,marginBottom:20}}>
                Payment reference: <strong>{ref}</strong><br/>
                Our team will verify your payment within 24 hours.
              </div>
              <div style={{background:`${GREEN}18`,border:`1px solid ${GREEN}44`,
                borderRadius:10,padding:"12px",marginBottom:20,fontSize:12,color:GREEN,
                fontWeight:600}}>
                🔒 Funds go directly to the club escrow account,<br/>
                managed by Villareal FC admin only.
              </div>
              <button onClick={onClose}
                style={{background:NAVY,border:"none",borderRadius:12,padding:"14px 32px",
                  fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,
                  color:WHITE,cursor:"pointer"}}>CLOSE</button>
            </div>
          )}

          {/* STEP 1 — AMOUNT */}
          {step===1&&(
            <>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:10}}>
                SELECT AMOUNT (BWP)
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,
                marginBottom:14}}>
                {PRESETS.map(p=>(
                  <button key={p} onClick={()=>{setAmount(String(p));setCustom("")}}
                    style={{padding:"12px 0",borderRadius:10,minHeight:48,
                      border:`2px solid ${amount===String(p)?RED:"#e5e7eb"}`,
                      background:amount===String(p)?`${RED}12`:WHITE,
                      fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                      fontSize:16,color:amount===String(p)?RED:NAVY,
                      cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                    P{p}
                  </button>
                ))}
              </div>

              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:700,color:MGRAY,display:"block",
                  marginBottom:6,letterSpacing:"0.06em",
                  fontFamily:"'Barlow Condensed',sans-serif"}}>
                  OR ENTER CUSTOM AMOUNT
                </label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:12,top:"50%",
                    transform:"translateY(-50%)",fontFamily:"'Barlow Condensed',sans-serif",
                    fontWeight:900,fontSize:16,color:NAVY}}>P</span>
                  <input type="number" min="5" placeholder="0.00"
                    value={custom}
                    onChange={e=>{setCustom(e.target.value);setAmount("")}}
                    style={{width:"100%",padding:"12px 12px 12px 28px",borderRadius:10,
                      border:`2px solid ${custom?RED:"#e5e7eb"}`,fontSize:16,
                      outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
                </div>
              </div>

              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:700,color:MGRAY,display:"block",
                  marginBottom:6,letterSpacing:"0.06em",
                  fontFamily:"'Barlow Condensed',sans-serif"}}>YOUR NAME</label>
                <input placeholder="Full name" value={name}
                  onChange={e=>setName(e.target.value)}
                  style={{width:"100%",padding:"11px 12px",borderRadius:10,
                    border:"1.5px solid #e5e7eb",fontSize:14,outline:"none",
                    boxSizing:"border-box",fontFamily:"inherit"}}/>
              </div>

              {!session&&(
                <div style={{marginBottom:14}}>
                  <label style={{fontSize:11,fontWeight:700,color:MGRAY,display:"block",
                    marginBottom:6,letterSpacing:"0.06em",
                    fontFamily:"'Barlow Condensed',sans-serif"}}>EMAIL (optional)</label>
                  <input type="email" placeholder="for receipt"
                    value={email} onChange={e=>setEmail(e.target.value)}
                    style={{width:"100%",padding:"11px 12px",borderRadius:10,
                      border:"1.5px solid #e5e7eb",fontSize:14,outline:"none",
                      boxSizing:"border-box",fontFamily:"inherit"}}/>
                </div>
              )}

              {/* What your donation does */}
              <div style={{background:LGRAY,borderRadius:10,padding:"12px 14px",
                marginBottom:16}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:11,color:NAVY,marginBottom:8}}>YOUR DONATION HELPS:</div>
                {[
                  ["P20","Buy match balls"],
                  ["P50","Cover kit repairs"],
                  ["P100","Transport to away games"],
                  ["P200","Player registration fees"],
                  ["P500","Full kit set for one player"],
                ].map(([amt,use])=>(
                  <div key={amt} style={{display:"flex",gap:8,marginBottom:5,
                    alignItems:"center"}}>
                    <span style={{background:RED,color:WHITE,fontSize:9,fontWeight:900,
                      padding:"1px 6px",borderRadius:4,flexShrink:0,
                      fontFamily:"'Barlow Condensed',sans-serif"}}>{amt}</span>
                    <span style={{fontSize:12,color:MGRAY}}>{use}</span>
                  </div>
                ))}
              </div>

              <div style={{background:`${GREEN}18`,border:`1px solid ${GREEN}44`,
                borderRadius:10,padding:"10px 12px",marginBottom:16,
                fontSize:11,color:GREEN,fontWeight:600}}>
                🔒 All funds held in club escrow · Managed by admin only · Full transparency
              </div>

              <button onClick={()=>{
                if(!finalAmount||finalAmount<5){setErr("Minimum P5.");return}
                if(!name.trim()){setErr("Please enter your name.");return}
                setErr(""); setStep(2)
              }}
                style={{width:"100%",padding:"15px",background:finalAmount>=5?RED:"#e5e7eb",
                  border:"none",borderRadius:12,fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:900,fontSize:16,color:finalAmount>=5?WHITE:"#aaa",
                  cursor:finalAmount>=5?"pointer":"not-allowed",minHeight:52}}>
                {finalAmount>=5?`DONATE P${finalAmount} →`:"SELECT AN AMOUNT"}
              </button>
              {err&&<div style={{color:RED,fontSize:12,marginTop:8,fontWeight:600}}>{err}</div>}
            </>
          )}

          {/* STEP 2 — PAYMENT */}
          {step===2&&(
            <>
              {/* Amount box */}
              <div style={{background:NAVY,borderRadius:12,padding:"16px",
                textAlign:"center",marginBottom:16}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",
                  fontFamily:"'Barlow Condensed',sans-serif",marginBottom:4}}>
                  DONATING
                </div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:40,color:GOLD,lineHeight:1}}>P{finalAmount}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:4}}>
                  Thank you, {name}!
                </div>
              </div>

              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:10}}>
                PAYMENT METHOD
              </div>
              {PAY_METHODS.map(m=>(
                <div key={m.id} onClick={()=>setMethod(m.id)}
                  style={{padding:"12px 14px",borderRadius:12,cursor:"pointer",
                    border:`2px solid ${method===m.id?RED:"#e5e7eb"}`,
                    background:method===m.id?`${RED}08`:WHITE,
                    display:"flex",alignItems:"center",gap:12,marginBottom:8,
                    WebkitTapHighlightColor:"transparent"}}>
                  <span style={{fontSize:24}}>{m.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                      fontSize:15,color:NAVY}}>{m.label}</div>
                    <div style={{fontSize:11,color:MGRAY}}>{m.num}</div>
                  </div>
                  <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,
                    border:`2px solid ${method===m.id?RED:"#ddd"}`,
                    background:method===m.id?RED:"none",
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {method===m.id&&<span style={{color:WHITE,fontSize:10}}>✓</span>}
                  </div>
                </div>
              ))}

              {method&&(
                <div style={{background:`${GOLD}18`,border:`1px solid ${GOLD}`,
                  borderRadius:10,padding:"12px 14px",marginBottom:14}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                    fontSize:11,color:GOLD2,marginBottom:6}}>HOW TO PAY</div>
                  {method==="orange"&&<div style={{fontSize:12,color:NAVY,lineHeight:1.7}}>
                    1. Dial <strong>*145#</strong><br/>
                    2. Send <strong>P{finalAmount}</strong> to <strong>74000001</strong><br/>
                    3. Reference: <strong>VFC-DONATE</strong>
                  </div>}
                  {method==="myzaka"&&<div style={{fontSize:12,color:NAVY,lineHeight:1.7}}>
                    1. Dial <strong>*167#</strong><br/>
                    2. Send <strong>P{finalAmount}</strong> to <strong>74000001</strong><br/>
                    3. Reference: <strong>VFC-DONATE</strong>
                  </div>}
                  {method==="eft"&&<div style={{fontSize:12,color:NAVY,lineHeight:1.7}}>
                    Bank: <strong>FNB Botswana</strong><br/>
                    Account: <strong>62012345678</strong><br/>
                    Branch: <strong>282672</strong><br/>
                    Amount: <strong>P{finalAmount}</strong><br/>
                    Reference: <strong>VFC-DONATE</strong>
                  </div>}
                </div>
              )}

              <div style={{marginBottom:16}}>
                <label style={{fontSize:11,fontWeight:700,color:MGRAY,display:"block",
                  marginBottom:6,letterSpacing:"0.06em",
                  fontFamily:"'Barlow Condensed',sans-serif"}}>
                  PAYMENT REFERENCE NUMBER
                </label>
                <input placeholder="e.g. TXN123456789" value={ref}
                  onChange={e=>setRef(e.target.value)}
                  style={{width:"100%",padding:"12px",borderRadius:10,
                    border:`1.5px solid ${ref?RED:"#e5e7eb"}`,fontSize:15,
                    outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
              </div>

              {err&&<div style={{color:RED,fontSize:12,marginBottom:10,fontWeight:600}}>{err}</div>}

              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setStep(1)}
                  style={{flex:1,padding:"13px",background:"#f0f0f0",border:"none",
                    borderRadius:10,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                    fontSize:14,color:NAVY,cursor:"pointer",minHeight:48}}>
                  ← BACK
                </button>
                <button onClick={submit} disabled={loading||!method||!ref}
                  style={{flex:2,padding:"13px",
                    background:loading||!method||!ref?"#e5e7eb":RED,
                    border:"none",borderRadius:10,
                    fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:14,
                    color:loading||!method||!ref?"#aaa":WHITE,
                    cursor:loading||!method||!ref?"not-allowed":"pointer",minHeight:48}}>
                  {loading?"SUBMITTING...":"CONFIRM DONATION ✓"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DonateModal
