import React, { useState, useEffect, useRef } from "react"
import { supabase } from "./supabaseClient"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY, Logo, Btn } from "./constants"

/* ══════════════════════════════════════════════════════════════════════════════
   MEMBERSHIP PAGE — 3 tiers, age pricing, ID verification
══════════════════════════════════════════════════════════════════════════════ */

const PLANS = [
  {
    id: "free",
    name: "PREMIUM FREE",
    tagline: "Get started for free",
    emoji: "🆓",
    headerBg: "linear-gradient(135deg,#4a5568,#2d3748)",
    prices: { adult_monthly:0, adult_yearly:0, youth_monthly:0, youth_yearly:0 },
    ageGroups: ["infant","youth","adult"],
    benefits: [
      "Club news & match updates",
      "Fixtures & standings",
      "Clips & highlights",
      "Early store notifications",
    ],
    cta: "JOIN FREE",
    popular: false,
    adultsOnly: false,
  },
  {
    id: "global_fan",
    name: "GLOBAL FAN",
    tagline: "For dedicated fans",
    emoji: "🌍",
    headerBg: `linear-gradient(135deg,#0D1B3E,#1a3060)`,
    prices: { adult_monthly:20, adult_yearly:200, youth_monthly:15, youth_yearly:153 },
    ageGroups: ["youth","adult"],
    benefits: [
      "Everything in Free",
      "10% off match-day tickets",
      "5% off official store",
      "Early ticket access (48hr)",
      "Exclusive member kit number",
      "Priority squad updates",
    ],
    cta: "JOIN GLOBAL FAN",
    popular: true,
    adultsOnly: false,
  },
  {
    id: "honey_badger",
    name: "HONEY BADGER",
    tagline: "The ultimate membership",
    emoji: "🦡",
    headerBg: `linear-gradient(135deg,#D4A800,#F5C518)`,
    prices: { adult_monthly:50, adult_yearly:500, youth_monthly:null, youth_yearly:null },
    ageGroups: ["adult"],
    benefits: [
      "Everything in Global Fan",
      "20% off match-day tickets",
      "10% off official store",
      "Free entry to home matches",
      "Digital membership card",
      "Vote in club decisions",
      "Exclusive member events",
      "VIP match-day experience",
    ],
    cta: "JOIN HONEY BADGER",
    popular: false,
    adultsOnly: true,
  },
]

const ID_TYPES = [
  { id:"omang",    label:"Omang (National ID)", sides:1, icon:"🪪" },
  { id:"passport", label:"Passport",            sides:1, icon:"📗" },
  { id:"license",  label:"Driver's License",   sides:2, icon:"🚗" },
]

const MembershipPage = ({ session, onClose, onSuccess }) => {
  const [step,     setStep]    = useState(1)
  const [plan,     setPlan]    = useState(null)
  const [billing,  setBilling] = useState("yearly")
  const [dob,      setDob]     = useState("")
  const [ageGroup, setAgeGroup]= useState(null)
  const [fullName, setFullName]= useState(session?.user?.user_metadata?.full_name || "")
  const [idType,   setIdType]  = useState(null)
  const [idFront,  setIdFront] = useState(null)
  const [idBack,   setIdBack]  = useState(null)
  const [selfie,   setSelfie]  = useState(null)
  const [loading,  setLoading] = useState(false)
  const [error,    setError]   = useState("")
  const [nameVal,  setNameVal] = useState(session?.user?.user_metadata?.full_name || "")

  const selectedPlan   = PLANS.find(p => p.id === plan)
  const needsVerify    = ageGroup === "adult"
  const price          = getPrice(selectedPlan, ageGroup) || 0
  const isPaid         = price > 0
  const totalSteps     = needsVerify ? 5 : isPaid ? 4 : 3

  const getPrice = (p, ag) => {
    if (!p || !ag) return null
    const key = `${ag}_${billing}`
    return p.prices[key]
  }

  const getSaving = (p, ag) => {
    if (!p || !ag) return 0
    const m = p.prices[`${ag}_monthly`]
    const y = p.prices[`${ag}_yearly`]
    if (!m || !y) return 0
    return (m * 12) - y
  }

  // Detect age from DOB
  const getAgeFromDob = (dobStr) => {
    if (!dobStr) return null
    const today = new Date()
    const birth = new Date(dobStr)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  const getAgeGroupFromAge = (age) => {
    if (age === null) return null
    if (age <= 5)  return "infant"
    if (age <= 17) return "youth"
    return "adult"
  }

  // Camera helpers
  const capturePhoto = (setter) => {
    const inp = document.createElement("input")
    inp.type = "file"; inp.accept = "image/*"; inp.capture = "environment"
    inp.onchange = e => {
      const file = e.target.files[0]; if (!file) return
      const r = new FileReader()
      r.onload = ev => setter(ev.target.result)
      r.readAsDataURL(file)
    }
    inp.click()
  }

  const captureSelfie = (setter) => {
    const inp = document.createElement("input")
    inp.type = "file"; inp.accept = "image/*"; inp.capture = "user"
    inp.onchange = e => {
      const file = e.target.files[0]; if (!file) return
      const r = new FileReader()
      r.onload = ev => setter(ev.target.result)
      r.readAsDataURL(file)
    }
    inp.click()
  }

  const handleSubmit = async () => {
    if (!session) { onClose(); return }
    setLoading(true); setError("")
    try {
      await supabase.from("membership_applications").insert({
        user_id: session.user.id,
        email: session.user.email,
        full_name: nameVal,
        plan_id: plan,
        billing_cycle: billing,
        age_group: ageGroup,
        dob: dob || null,
        id_type: idType,
        id_front_url: idFront ? "uploaded" : null,
        id_back_url: idBack ? "uploaded" : null,
        selfie_url: selfie ? "uploaded" : null,
        status: needsVerify ? "pending" : "active",
        created_at: new Date().toISOString(),
      })
      await supabase.from("profiles").update({
        is_member: plan !== "free",
        billing_cycle: billing,
        member_since: new Date().toISOString(),
      }).eq("id", session.user.id)
      setStep(totalSteps + 1)
      if (onSuccess) onSuccess()
    } catch(e) {
      setError(e.message || "Something went wrong.")
    }
    setLoading(false)
  }

  /* ── STEP BAR ── */
  const StepBar = () => {
    const steps = needsVerify
      ? (isPaid ? ["Plan","Age","Details","Payment","Verify ID"] : ["Plan","Age","Details","Verify ID"])
      : (isPaid ? ["Plan","Age","Details","Payment"] : ["Plan","Age","Details"])
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",
        gap:0,padding:"10px 16px",background:"#f8f9fb",
        borderBottom:`1px solid #eee`,flexShrink:0}}>
        {steps.map((label,i)=>{
          const s = i+1
          const done = step > s
          const active = step === s
          return (
            <div key={s} style={{display:"flex",alignItems:"center"}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <div style={{
                  width:26,height:26,borderRadius:"50%",
                  background:done?"#27AE60":active?NAVY:"#e5e7eb",
                  display:"flex",alignItems:"center",justifyContent:"center",
                }}>
                  <span style={{fontSize:11,fontWeight:900,
                    color:done||active?WHITE:MGRAY,
                    fontFamily:"'Barlow Condensed',sans-serif"}}>
                    {done?"✓":s}
                  </span>
                </div>
                <span style={{fontSize:9,fontWeight:active?700:500,
                  color:active?NAVY:MGRAY,
                  fontFamily:"'Barlow Condensed',sans-serif",
                  letterSpacing:"0.04em",whiteSpace:"nowrap"}}>{label}</span>
              </div>
              {i < steps.length-1 && (
                <div style={{width:"clamp(16px,5vw,32px)",height:2,
                  background:done?"#27AE60":"#e5e7eb",margin:"0 2px 14px"}}/>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  /* ── STEP 1: PLANS ── */
  const Step1 = () => (
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
      {/* Header */}
      <div style={{background:`linear-gradient(160deg,${NAVY},#1a3060)`,
        padding:"16px 16px 14px",textAlign:"center"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:24,color:WHITE,lineHeight:1}}>CHOOSE YOUR PLAN</div>
        <div style={{fontSize:11,color:"#aab4cc",marginTop:4}}>
          Villareal FC · Season 2026/27
        </div>
        {/* Billing toggle */}
        <div style={{display:"inline-flex",background:"rgba(255,255,255,0.1)",
          borderRadius:8,padding:3,marginTop:12,gap:2}}>
          {["monthly","yearly"].map(b=>(
            <button key={b} onClick={()=>setBilling(b)} style={{
              padding:"7px 16px",minHeight:34,
              background:billing===b?WHITE:"none",
              border:"none",borderRadius:6,cursor:"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:12,color:billing===b?NAVY:"rgba(255,255,255,0.7)",
              WebkitTapHighlightColor:"transparent",
              display:"flex",alignItems:"center",gap:5}}>
              {b==="monthly"?"MONTHLY":"YEARLY"}
              {b==="yearly"&&<span style={{background:GREEN,color:WHITE,
                fontSize:8,fontWeight:900,padding:"1px 4px",borderRadius:3}}>
                SAVE 17%</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:"12px 12px 20px",display:"flex",flexDirection:"column",gap:10}}>
        {PLANS.map(p => {
          const adultPrice = getPrice(p, "adult")
          const youthPrice = getPrice(p, "youth")
          const isSelected = plan === p.id
          return (
            <div key={p.id} onClick={()=>setPlan(p.id)} style={{
              borderRadius:14,overflow:"hidden",cursor:"pointer",
              border:`2.5px solid ${isSelected?(p.adultsOnly?GOLD:NAVY):"#e5e7eb"}`,
              boxShadow:isSelected?"0 4px 20px rgba(0,0,0,0.15)":"0 1px 4px rgba(0,0,0,0.06)",
              WebkitTapHighlightColor:"transparent",
              transition:"border-color 0.15s,box-shadow 0.15s",
              background:WHITE,position:"relative",
            }}>
              {p.popular&&(
                <div style={{position:"absolute",top:0,right:0,
                  background:GOLD,color:NAVY,fontSize:9,fontWeight:900,
                  padding:"3px 10px",borderRadius:"0 11px 0 8px",
                  fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",zIndex:1}}>
                  MOST POPULAR
                </div>
              )}
              {/* Coloured header */}
              <div style={{background:p.headerBg,padding:"14px 16px 12px",
                display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:28}}>{p.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                    fontSize:18,color:p.adultsOnly?NAVY:WHITE,lineHeight:1}}>{p.name}</div>
                  <div style={{fontSize:11,color:p.adultsOnly?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.75)",
                    marginTop:2}}>{p.tagline}</div>
                </div>
                {isSelected&&(
                  <div style={{width:24,height:24,borderRadius:"50%",
                    background:"rgba(255,255,255,0.9)",flexShrink:0,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{color:p.adultsOnly?GOLD:NAVY,fontSize:14,fontWeight:900}}>✓</span>
                  </div>
                )}
              </div>

              {/* Price row */}
              <div style={{padding:"10px 16px",borderBottom:`1px solid #f0f0f0`,
                display:"flex",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <div style={{display:"flex",alignItems:"baseline",gap:3}}>
                  {adultPrice === 0 ? (
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                      fontWeight:900,fontSize:26,color:GREEN}}>FREE</span>
                  ) : (
                    <>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                        fontWeight:900,fontSize:26,color:NAVY}}>
                        P{adultPrice}
                      </span>
                      <span style={{fontSize:12,color:MGRAY}}>
                        /{billing==="monthly"?"mo":"yr"}
                      </span>
                    </>
                  )}
                </div>
                {billing==="yearly"&&getSaving(p,"adult")>0&&(
                  <span style={{background:"#dcfce7",color:GREEN,fontSize:10,
                    fontWeight:700,padding:"2px 7px",borderRadius:4}}>
                    Save P{getSaving(p,"adult")}
                  </span>
                )}
                {p.adultsOnly ? (
                  <span style={{background:"#fef2f2",color:RED,fontSize:10,
                    fontWeight:700,padding:"2px 7px",borderRadius:4,
                    marginLeft:"auto"}}>
                    18+ ONLY
                  </span>
                ) : youthPrice !== null && youthPrice !== undefined ? (
                  <span style={{fontSize:11,color:MGRAY,marginLeft:"auto"}}>
                    Youth: P{youthPrice}/{billing==="monthly"?"mo":"yr"}
                  </span>
                ) : null}
              </div>

              {/* Benefits */}
              <div style={{padding:"10px 16px 12px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 8px"}}>
                  {p.benefits.map((b,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"flex-start",gap:5}}>
                      <span style={{color:p.adultsOnly?GOLD2:NAVY,fontSize:11,
                        flexShrink:0,marginTop:1}}>✔</span>
                      <span style={{fontSize:11,color:"#444",lineHeight:1.3}}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{padding:"0 12px 20px"}}>
        <button onClick={()=>{ if(plan) setStep(2) }}
          disabled={!plan}
          style={{
            width:"100%",padding:"15px",
            background:plan?NAVY:"#e5e7eb",
            border:"none",borderRadius:12,cursor:plan?"pointer":"not-allowed",
            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,
            color:plan?WHITE:"#aaa",WebkitTapHighlightColor:"transparent",minHeight:50,
          }}>
          CONTINUE →
        </button>
      </div>
    </div>
  )

  /* ── STEP 2: AGE & DOB ── */
  const Step2 = () => {
    const age = getAgeFromDob(dob)
    const detectedGroup = getAgeGroupFromAge(age)

    // Honey Badger must be adult — reject under 18
    const isDobValid = dob && age !== null
    const isBlocked = selectedPlan?.adultsOnly && isDobValid && age < 18
    const isFraud = isDobValid && age <= 5 && plan !== "free"

    const handleDobChange = (val) => {
      setDob(val)
      const a = getAgeFromDob(val)
      const grp = getAgeGroupFromAge(a)
      if (grp) setAgeGroup(grp)
    }

    return (
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"20px 14px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:22,color:NAVY,marginBottom:4}}>DATE OF BIRTH</div>
        <div style={{fontSize:13,color:MGRAY,marginBottom:18,lineHeight:1.6}}>
          Your age determines your pricing tier and verification requirements.
          Enter your real date of birth — we verify identity for paid plans.
        </div>

        {/* DOB input */}
        <div style={{marginBottom:16}}>
          <label style={{fontSize:11,fontWeight:700,color:MGRAY,
            fontFamily:"'Barlow Condensed',sans-serif",display:"block",
            marginBottom:6,letterSpacing:"0.06em"}}>DATE OF BIRTH</label>
          <input type="date" value={dob}
            onChange={e=>handleDobChange(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            style={{width:"100%",padding:"13px 14px",borderRadius:10,
              border:`2px solid ${isDobValid&&!isBlocked&&!isFraud?GREEN:isBlocked||isFraud?RED:"#e5e7eb"}`,
              fontSize:16,outline:"none",boxSizing:"border-box",
              fontFamily:"inherit",WebkitAppearance:"none",minHeight:50,
              background:WHITE}}/>
        </div>

        {/* Age detection result */}
        {isDobValid && (
          <div style={{
            borderRadius:10,padding:"12px 14px",marginBottom:14,
            background:isBlocked||isFraud?"#fef2f2":detectedGroup==="adult"?"#eef1f8":"#f0fdf4",
            border:`1px solid ${isBlocked||isFraud?"#fecaca":detectedGroup==="adult"?"#c7d2fe":"#bbf7d0"}`,
          }}>
            {isFraud ? (
              <>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:13,color:RED,marginBottom:4}}>⚠ INVALID AGE FOR THIS PLAN</div>
                <div style={{fontSize:12,color:"#7f1d1d",lineHeight:1.5}}>
                  Paid plans require members aged 6 and above. Infants (0–5) are only eligible for the free plan.
                  Please select Premium Free or enter a valid date of birth.
                </div>
              </>
            ) : isBlocked ? (
              <>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:13,color:RED,marginBottom:4}}>⚠ AGE RESTRICTION</div>
                <div style={{fontSize:12,color:"#7f1d1d",lineHeight:1.5}}>
                  🦡 Honey Badger membership is for adults aged 18+ only.
                  You are {age} years old. Please select Global Fan or Premium Free instead.
                </div>
              </>
            ) : (
              <>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:13,color:detectedGroup==="adult"?NAVY:GREEN,marginBottom:4}}>
                  ✓ Age detected: {age} years old
                </div>
                <div style={{fontSize:12,color:MGRAY,lineHeight:1.5}}>
                  {detectedGroup==="infant"&&"Infant (0–5) · Free on all plans"}
                  {detectedGroup==="youth"&&`Youth (6–17) · P${getPrice(selectedPlan,"youth")||0}/${billing==="monthly"?"mo":"yr"} on ${selectedPlan?.name}`}
                  {detectedGroup==="adult"&&`Adult (18+) · P${getPrice(selectedPlan,"adult")||0}/${billing==="monthly"?"mo":"yr"} on ${selectedPlan?.name} · ID verification required`}
                </div>
              </>
            )}
          </div>
        )}

        {/* Anti-fraud notice */}
        <div style={{background:"#fffbea",border:`1px solid #fde68a`,borderRadius:10,
          padding:"10px 14px",marginBottom:20}}>
          <div style={{fontSize:11,color:"#78350f",lineHeight:1.6}}>
            🔒 <strong>Fraud prevention:</strong> Entering a false date of birth to avoid payment
            is a violation of our Terms. Identity documents are verified against your DOB for all paid plans.
            Fraudulent accounts will be permanently banned.
          </div>
        </div>

        {/* Price summary */}
        {isDobValid&&!isBlocked&&!isFraud&&ageGroup&&(
          <div style={{background:"#f8f9fb",borderRadius:12,padding:"12px 14px",
            marginBottom:18,border:`1px solid #e5e7eb`}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:6}}>
              YOUR PRICE
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:14,color:NAVY,fontWeight:600}}>
                {selectedPlan?.name} · {age} yrs
              </span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:22,color:getPrice(selectedPlan,ageGroup)===0?GREEN:NAVY}}>
                {getPrice(selectedPlan,ageGroup)===0
                  ? "FREE"
                  : `P${getPrice(selectedPlan,ageGroup)}/${billing==="monthly"?"mo":"yr"}`}
              </span>
            </div>
            {billing==="yearly"&&getSaving(selectedPlan,ageGroup)>0&&(
              <div style={{fontSize:12,color:GREEN,marginTop:3,fontWeight:600}}>
                Saves P{getSaving(selectedPlan,ageGroup)} vs monthly billing
              </div>
            )}
          </div>
        )}

        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setStep(1)}
            style={{flex:1,padding:"14px",background:"#f0f0f0",border:"none",
              borderRadius:12,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:900,fontSize:15,color:NAVY,minHeight:50,
              WebkitTapHighlightColor:"transparent"}}>
            ← BACK
          </button>
          <button
            onClick={()=>{
              if(!dob) { setError("Please enter your date of birth."); return }
              if(isBlocked||isFraud) { setError("Please go back and choose a suitable plan for your age."); return }
              setError("")
              setStep(3)
            }}
            disabled={!dob||isBlocked||isFraud}
            style={{flex:2,padding:"14px",
              background:!dob||isBlocked||isFraud?"#e5e7eb":NAVY,
              border:"none",borderRadius:12,
              cursor:!dob||isBlocked||isFraud?"not-allowed":"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:900,fontSize:15,
              color:!dob||isBlocked||isFraud?"#aaa":WHITE,
              minHeight:50,WebkitTapHighlightColor:"transparent"}}>
            CONTINUE →
          </button>
        </div>
        {error&&<div style={{color:RED,fontSize:13,marginTop:10,fontWeight:600,textAlign:"center"}}>{error}</div>}
      </div>
    )
  }

  /* ── STEP 3: PERSONAL DETAILS ── */
  const Step3 = () => {
    const [localName, setLocalName] = useState(nameVal)
    const [localIdType, setLocalIdType] = useState(idType)

    const handleNext = () => {
      if (!localName.trim()) { setError("Please enter your full name."); return }
      if (needsVerify && !localIdType) { setError("Please select an ID type."); return }
      setNameVal(localName)
      setIdType(localIdType)
      setError("")
      if (needsVerify)     { setStep(4) }
      else if (isPaid)     { setStep(3.5) }
      else                 { handleSubmit() }
    }

    return (
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"20px 14px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:22,color:NAVY,marginBottom:4}}>YOUR DETAILS</div>
        <div style={{fontSize:13,color:MGRAY,marginBottom:18,lineHeight:1.6}}>
          {needsVerify
            ? "Adults must verify their identity. Your name must match your ID document exactly."
            : "Almost done — confirm your details to complete registration."}
        </div>

        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,fontWeight:700,color:MGRAY,
            fontFamily:"'Barlow Condensed',sans-serif",display:"block",
            marginBottom:6,letterSpacing:"0.06em"}}>FULL NAME</label>
          <input
            type="text"
            placeholder="As it appears on your ID"
            defaultValue={localName}
            onBlur={e => setLocalName(e.target.value)}
            style={{width:"100%",padding:"13px 14px",borderRadius:10,
              border:"2px solid #e5e7eb",fontSize:16,outline:"none",
              boxSizing:"border-box",fontFamily:"inherit",
              WebkitAppearance:"none",minHeight:50}}
            onFocus={e=>e.target.style.borderColor=GOLD}
          />
        </div>

        <div style={{marginBottom:18}}>
          <label style={{fontSize:11,fontWeight:700,color:MGRAY,
            fontFamily:"'Barlow Condensed',sans-serif",display:"block",
            marginBottom:6,letterSpacing:"0.06em"}}>EMAIL</label>
          <input type="email" value={session?.user?.email||""} disabled
            style={{width:"100%",padding:"13px 14px",borderRadius:10,
              border:"2px solid #f0f0f0",fontSize:16,outline:"none",
              boxSizing:"border-box",fontFamily:"inherit",
              background:"#f8f9fb",color:MGRAY,minHeight:50}}/>
        </div>

        {needsVerify&&(
          <>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>
              ID DOCUMENT TYPE
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
              {ID_TYPES.map(t=>(
                <div key={t.id} onClick={()=>setLocalIdType(t.id)} style={{
                  padding:"13px 14px",borderRadius:12,cursor:"pointer",
                  border:`2px solid ${localIdType===t.id?NAVY:"#e5e7eb"}`,
                  background:localIdType===t.id?"#eef1f8":WHITE,
                  display:"flex",alignItems:"center",gap:12,
                  WebkitTapHighlightColor:"transparent",minHeight:50,
                }}>
                  <span style={{fontSize:22}}>{t.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                      fontSize:15,color:NAVY}}>{t.label}</div>
                    <div style={{fontSize:11,color:MGRAY,marginTop:1}}>
                      {t.sides===2?"Front & back photos required":"Front photo only"}
                    </div>
                  </div>
                  <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,
                    border:`2px solid ${localIdType===t.id?NAVY:"#ddd"}`,
                    background:localIdType===t.id?NAVY:"none",
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {localIdType===t.id&&<span style={{color:WHITE,fontSize:12}}>✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {error&&(
          <div style={{background:"#fef2f2",border:`1px solid #fecaca`,borderRadius:8,
            padding:"10px 14px",color:RED,fontSize:13,marginBottom:14,fontWeight:600}}>
            {error}
          </div>
        )}

        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setStep(2)}
            style={{flex:1,padding:"14px",background:"#f0f0f0",border:"none",
              borderRadius:12,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:900,fontSize:15,color:NAVY,minHeight:50,
              WebkitTapHighlightColor:"transparent"}}>
            ← BACK
          </button>
          <button onClick={handleNext} disabled={loading}
            style={{flex:2,padding:"14px",background:loading?"#ccc":NAVY,
              border:"none",borderRadius:12,cursor:loading?"not-allowed":"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,
              color:loading?"#888":WHITE,minHeight:50,
              WebkitTapHighlightColor:"transparent"}}>
            {loading?"PLEASE WAIT...":needsVerify?"NEXT: VERIFY ID →":"COMPLETE ✓"}
          </button>
        </div>
      </div>
    )
  }

  /* ── STEP 4: ID VERIFICATION ── */
  const Step4 = () => {
    const selId = ID_TYPES.find(t=>t.id===idType)
    const done = idFront && selfie && (selId?.sides===1 || idBack)

    return (
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"20px 14px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:22,color:NAVY,marginBottom:4}}>VERIFY YOUR IDENTITY</div>
        <div style={{fontSize:13,color:MGRAY,marginBottom:14,lineHeight:1.6}}>
          Documents are encrypted and used only for verification. Admin reviews within 24–48hrs.
        </div>

        <div style={{background:"#eef1f8",borderRadius:10,padding:"10px 14px",
          marginBottom:16,display:"flex",gap:10,border:`1px solid #c7d2fe`}}>
          <span style={{fontSize:18,flexShrink:0}}>🔒</span>
          <div style={{fontSize:12,color:NAVY,lineHeight:1.5}}>
            <strong>Secure & Private</strong> — Reviewed by Villareal FC admin only. Never shared with third parties.
          </div>
        </div>

        {/* ID Front */}
        <div style={{marginBottom:12}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>
            {selId?.emoji} {selId?.label?.toUpperCase()} — FRONT
          </div>
          {idFront ? (
            <div style={{position:"relative",borderRadius:12,overflow:"hidden",
              border:`2px solid ${GREEN}`}}>
              <img src={idFront} alt="ID Front"
                style={{width:"100%",height:140,objectFit:"cover",display:"block"}}/>
              <div style={{position:"absolute",top:6,right:6,background:GREEN,
                borderRadius:20,padding:"2px 8px",fontSize:10,color:WHITE,fontWeight:700}}>
                ✓ Captured</div>
              <button onClick={()=>setIdFront(null)}
                style={{position:"absolute",top:6,left:6,background:"rgba(0,0,0,0.6)",
                  border:"none",borderRadius:20,padding:"2px 8px",fontSize:10,
                  color:WHITE,cursor:"pointer"}}>Retake</button>
            </div>
          ) : (
            <button onClick={()=>capturePhoto(setIdFront)} style={{
              width:"100%",height:110,borderRadius:12,
              border:`2px dashed ${NAVY}`,background:"#f8f9fb",
              display:"flex",flexDirection:"column",alignItems:"center",
              justifyContent:"center",gap:6,cursor:"pointer",
              WebkitTapHighlightColor:"transparent"}}>
              <span style={{fontSize:28}}>📷</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                fontSize:13,color:NAVY}}>TAP TO CAPTURE FRONT</span>
              <span style={{fontSize:11,color:MGRAY}}>All text must be clearly visible</span>
            </button>
          )}
        </div>

        {/* ID Back (license only) */}
        {selId?.sides===2&&(
          <div style={{marginBottom:12}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>
              {selId?.emoji} {selId?.label?.toUpperCase()} — BACK
            </div>
            {idBack ? (
              <div style={{position:"relative",borderRadius:12,overflow:"hidden",
                border:`2px solid ${GREEN}`}}>
                <img src={idBack} alt="ID Back"
                  style={{width:"100%",height:140,objectFit:"cover",display:"block"}}/>
                <div style={{position:"absolute",top:6,right:6,background:GREEN,
                  borderRadius:20,padding:"2px 8px",fontSize:10,color:WHITE,fontWeight:700}}>
                  ✓ Captured</div>
                <button onClick={()=>setIdBack(null)}
                  style={{position:"absolute",top:6,left:6,background:"rgba(0,0,0,0.6)",
                    border:"none",borderRadius:20,padding:"2px 8px",fontSize:10,
                    color:WHITE,cursor:"pointer"}}>Retake</button>
              </div>
            ) : (
              <button onClick={()=>capturePhoto(setIdBack)} style={{
                width:"100%",height:110,borderRadius:12,
                border:`2px dashed ${NAVY}`,background:"#f8f9fb",
                display:"flex",flexDirection:"column",alignItems:"center",
                justifyContent:"center",gap:6,cursor:"pointer",
                WebkitTapHighlightColor:"transparent"}}>
                <span style={{fontSize:28}}>📷</span>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                  fontSize:13,color:NAVY}}>TAP TO CAPTURE BACK</span>
              </button>
            )}
          </div>
        )}

        {/* Selfie */}
        <div style={{marginBottom:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>
            🤳 SELFIE — FACE VERIFICATION
          </div>
          <div style={{background:"#fffbea",borderRadius:8,padding:"8px 12px",
            marginBottom:8,border:`1px solid #fde68a`,fontSize:11,color:"#92400e"}}>
            📌 Face camera directly · Remove glasses · Good lighting · No hats
          </div>
          {selfie ? (
            <div style={{position:"relative",borderRadius:12,overflow:"hidden",
              border:`2px solid ${GREEN}`}}>
              <img src={selfie} alt="Selfie"
                style={{width:"100%",height:160,objectFit:"cover",display:"block"}}/>
              <div style={{position:"absolute",top:6,right:6,background:GREEN,
                borderRadius:20,padding:"2px 8px",fontSize:10,color:WHITE,fontWeight:700}}>
                ✓ Captured</div>
              <button onClick={()=>setSelfie(null)}
                style={{position:"absolute",top:6,left:6,background:"rgba(0,0,0,0.6)",
                  border:"none",borderRadius:20,padding:"2px 8px",fontSize:10,
                  color:WHITE,cursor:"pointer"}}>Retake</button>
            </div>
          ) : (
            <button onClick={()=>captureSelfie(setSelfie)} style={{
              width:"100%",height:130,borderRadius:12,
              border:`2px dashed ${GOLD2}`,background:"#fffbea",
              display:"flex",flexDirection:"column",alignItems:"center",
              justifyContent:"center",gap:6,cursor:"pointer",
              WebkitTapHighlightColor:"transparent"}}>
              <span style={{fontSize:32}}>🤳</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                fontSize:13,color:NAVY}}>TAP TO TAKE SELFIE</span>
              <span style={{fontSize:11,color:MGRAY}}>Use your front camera</span>
            </button>
          )}
        </div>

        {error&&(
          <div style={{background:"#fef2f2",border:`1px solid #fecaca`,borderRadius:8,
            padding:"10px 14px",color:RED,fontSize:13,marginBottom:12,fontWeight:600}}>
            {error}
          </div>
        )}

        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setStep(3)}
            style={{flex:1,padding:"14px",background:"#f0f0f0",border:"none",
              borderRadius:12,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:900,fontSize:15,color:NAVY,minHeight:50,
              WebkitTapHighlightColor:"transparent"}}>
            ← BACK
          </button>
          <button
            onClick={()=>{
              if(!idFront) { setError("Please capture your ID front."); return }
              if(selId?.sides===2&&!idBack) { setError("Please capture your ID back."); return }
              if(!selfie) { setError("Please take a selfie."); return }
              setError(""); handleSubmit()
            }}
            disabled={loading||!done}
            style={{flex:2,padding:"14px",
              background:loading||!done?"#e5e7eb":NAVY,
              border:"none",borderRadius:12,
              cursor:loading||!done?"not-allowed":"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,
              color:loading||!done?"#aaa":WHITE,minHeight:50,
              WebkitTapHighlightColor:"transparent"}}>
            {loading?"SUBMITTING...":"SUBMIT FOR REVIEW →"}
          </button>
        </div>
      </div>
    )
  }

  /* ── STEP PAYMENT ── */
  const StepPayment = () => {
    const [method, setMethod] = useState("")
    const [ref,    setRef]    = useState("")
    const [done,   setDone]   = useState(false)
    const price = getPrice(selectedPlan, ageGroup)
    const METHODS = [
      { id:"orange",  label:"Orange Money",  icon:"🟠", num:"*145#" },
      { id:"myzaka",  label:"MyZaka",        icon:"🔵", num:"*167#" },
      { id:"eft",     label:"Bank Transfer", icon:"🏦", num:"FNB / BancABC" },
    ]

    if(done) return (
      <div style={{flex:1,overflowY:"auto",padding:"24px 16px"}}>
        <div style={{background:"#f0fdf4",border:`1px solid #bbf7d0`,borderRadius:14,
          padding:"20px",textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:40,marginBottom:8}}>✅</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:20,color:GREEN,marginBottom:6}}>PAYMENT SUBMITTED</div>
          <div style={{fontSize:13,color:"#166534",lineHeight:1.6}}>
            Your payment reference <strong>{ref}</strong> has been recorded.
            Our team will verify your payment within 24 hours.
          </div>
        </div>
        <button onClick={()=>needsVerify?setStep(4):handleSubmit()}
          style={{width:"100%",padding:"14px",background:NAVY,border:"none",
            borderRadius:12,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:900,fontSize:15,color:WHITE,minHeight:50}}>
          {needsVerify?"NEXT: VERIFY ID →":"COMPLETE REGISTRATION →"}
        </button>
      </div>
    )

    return (
      <div style={{flex:1,overflowY:"auto",padding:"20px 14px",WebkitOverflowScrolling:"touch"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:22,color:NAVY,marginBottom:4}}>PAYMENT</div>
        <div style={{fontSize:13,color:MGRAY,marginBottom:18,lineHeight:1.6}}>
          Complete your payment to activate your membership.
        </div>

        {/* Amount box */}
        <div style={{background:`linear-gradient(135deg,${NAVY},#1a3060)`,
          borderRadius:14,padding:"18px 20px",marginBottom:18,textAlign:"center"}}>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginBottom:4,
            fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em"}}>
            {selectedPlan?.name} · {billing==="monthly"?"MONTHLY":"YEARLY"}
          </div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:42,color:GOLD,lineHeight:1}}>
            P{price}
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:4}}>
            /{billing==="monthly"?"month":"year"}
          </div>
        </div>

        {/* Payment methods */}
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
          fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:10}}>
          SELECT PAYMENT METHOD
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          {METHODS.map(m=>(
            <div key={m.id} onClick={()=>setMethod(m.id)} style={{
              padding:"13px 14px",borderRadius:12,cursor:"pointer",
              border:`2px solid ${method===m.id?NAVY:"#e5e7eb"}`,
              background:method===m.id?"#eef1f8":WHITE,
              display:"flex",alignItems:"center",gap:12,
              WebkitTapHighlightColor:"transparent",minHeight:54,
            }}>
              <span style={{fontSize:24}}>{m.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:800,fontSize:15,color:NAVY}}>{m.label}</div>
                <div style={{fontSize:11,color:MGRAY,marginTop:1}}>{m.num}</div>
              </div>
              <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,
                border:`2px solid ${method===m.id?NAVY:"#ddd"}`,
                background:method===m.id?NAVY:"none",
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                {method===m.id&&<span style={{color:WHITE,fontSize:12}}>✓</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        {method&&(
          <div style={{background:"#fffbea",border:`1px solid #fde68a`,
            borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:11,color:"#92400e",marginBottom:6,letterSpacing:"0.06em"}}>
              HOW TO PAY
            </div>
            {method==="orange"&&(
              <div style={{fontSize:12,color:"#78350f",lineHeight:1.7}}>
                1. Dial <strong>*145#</strong> on your phone<br/>
                2. Select <strong>Send Money</strong><br/>
                3. Send <strong>P{price}</strong> to <strong>74123456</strong><br/>
                4. Enter your reference code below
              </div>
            )}
            {method==="myzaka"&&(
              <div style={{fontSize:12,color:"#78350f",lineHeight:1.7}}>
                1. Open MyZaka app or dial <strong>*167#</strong><br/>
                2. Select <strong>Send Money</strong><br/>
                3. Send <strong>P{price}</strong> to <strong>74123456</strong><br/>
                4. Enter your reference code below
              </div>
            )}
            {method==="eft"&&(
              <div style={{fontSize:12,color:"#78350f",lineHeight:1.7}}>
                Bank: <strong>FNB Botswana</strong><br/>
                Account: <strong>62012345678</strong><br/>
                Branch: <strong>282672</strong><br/>
                Reference: <strong>Your email address</strong><br/>
                Amount: <strong>P{price}</strong>
              </div>
            )}
          </div>
        )}

        {/* Reference input */}
        {method&&(
          <div style={{marginBottom:16}}>
            <label style={{fontSize:11,fontWeight:700,color:MGRAY,display:"block",
              marginBottom:6,letterSpacing:"0.06em",
              fontFamily:"'Barlow Condensed',sans-serif"}}>
              PAYMENT REFERENCE / CONFIRMATION NUMBER
            </label>
            <input placeholder="e.g. TXN123456789" value={ref}
              onChange={e=>setRef(e.target.value)}
              style={{width:"100%",padding:"13px 14px",borderRadius:10,
                border:`2px solid ${ref?GOLD:"#e5e7eb"}`,fontSize:15,outline:"none",
                boxSizing:"border-box",fontFamily:"inherit",minHeight:50}}/>
            <div style={{fontSize:11,color:MGRAY,marginTop:4}}>
              Enter the transaction reference from your payment confirmation
            </div>
          </div>
        )}

        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setStep(3)}
            style={{flex:1,padding:"14px",background:"#f0f0f0",border:"none",
              borderRadius:12,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:900,fontSize:15,color:NAVY,minHeight:50,
              WebkitTapHighlightColor:"transparent"}}>
            ← BACK
          </button>
          <button
            onClick={()=>{
              if(!method){setError("Please select a payment method.");return}
              if(!ref.trim()){setError("Please enter your payment reference.");return}
              setError("")
              setDone(true)
            }}
            disabled={!method||!ref.trim()}
            style={{flex:2,padding:"14px",
              background:!method||!ref.trim()?"#e5e7eb":GREEN,
              border:"none",borderRadius:12,
              cursor:!method||!ref.trim()?"not-allowed":"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,
              color:!method||!ref.trim()?"#aaa":WHITE,minHeight:50,
              WebkitTapHighlightColor:"transparent"}}>
            CONFIRM PAYMENT →
          </button>
        </div>
        {error&&<div style={{color:RED,fontSize:13,marginTop:10,
          fontWeight:600,textAlign:"center"}}>{error}</div>}
      </div>
    )
  }

  /* ── SUCCESS ── */
  const StepDone = () => (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",padding:"32px 24px",textAlign:"center"}}>
      <div style={{width:76,height:76,borderRadius:"50%",
        background:needsVerify?"#fffbea":"#dcfce7",
        display:"flex",alignItems:"center",justifyContent:"center",
        marginBottom:14,fontSize:38}}>
        {needsVerify?"⏳":"🎉"}
      </div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
        fontSize:24,color:NAVY,marginBottom:8}}>
        {needsVerify?"APPLICATION SUBMITTED!":"WELCOME TO THE FAMILY!"}
      </div>
      <div style={{fontSize:14,color:MGRAY,lineHeight:1.7,marginBottom:24,maxWidth:300}}>
        {needsVerify
          ? "Your identity is under review. You'll receive an email within 24–48 hours once approved."
          : `You're now a ${selectedPlan?.name} member! Welcome to Villareal FC 🦡⚽`}
      </div>
      {needsVerify&&(
        <div style={{background:"#fffbea",border:`1px solid #fde68a`,borderRadius:12,
          padding:"14px 16px",marginBottom:20,textAlign:"left",width:"100%",maxWidth:320}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:11,color:"#92400e",marginBottom:8,letterSpacing:"0.06em"}}>
            WHAT HAPPENS NEXT
          </div>
          {["Admin reviews your documents (24–48hrs)",
            "You receive an approval email",
            "Full membership benefits unlock",
            "Digital membership card issued"].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:5}}>
              <span style={{color:GOLD2,fontWeight:800,flexShrink:0}}>{i+1}.</span>
              <span style={{fontSize:12,color:"#78350f"}}>{s}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={onClose}
        style={{width:"100%",maxWidth:320,padding:"15px",background:NAVY,
          border:"none",borderRadius:12,cursor:"pointer",
          fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,
          color:WHITE,WebkitTapHighlightColor:"transparent",minHeight:50}}>
        {needsVerify?"GO TO MY PROFILE →":"START EXPLORING 🟡"}
      </button>
    </div>
  )

  const isDone = step > totalSteps

  return (
    <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",
      height:"100%",width:"100%"}}>
      <div style={{
        background:WHITE,width:"100%",
        height:"92%",
        borderRadius:"22px 22px 0 0",
        display:"flex",flexDirection:"column",
        overflow:"hidden",
        boxShadow:"0 -8px 32px rgba(0,0,0,0.3)",
      }}>
        {/* Modal header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"14px 16px 12px",borderBottom:`1px solid #eee`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Logo size={26}/>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:15,color:NAVY,letterSpacing:"0.04em"}}>MEMBERSHIP</div>
          </div>
          <button onClick={onClose} style={{background:"#f0f0f0",border:"none",
            width:30,height:30,borderRadius:"50%",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:14,color:MGRAY,WebkitTapHighlightColor:"transparent"}}>✕</button>
        </div>

        {!isDone && <StepBar/>}

        <div style={{flex:1,display:"flex",flexDirection:"column",
          overflow:"hidden",minHeight:0}}>
          {step===1   && <Step1/>}
          {step===2   && <Step2/>}
          {step===3   && <Step3/>}
          {step===3.5 && <StepPayment/>}
          {step===4   && <Step4/>}
          {isDone     && <StepDone/>}
        </div>
      </div>
    </div>
  )
}




export default MembershipPage
