import React, { useState, useEffect, useRef } from "react"
import { supabase } from "./supabaseClient"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY, Logo, Btn } from "./constants"

/* ══════════════════════════════════════════════════════════════════════════════
   STORE
══════════════════════════════════════════════════════════════════════════════ */
const StoreScreen=({goToAuth,fixtures,openMembership,session,profile})=>{
  const [subTab,      setSubTab]      = useState("shop")
  const [shopView,    setShopView]    = useState("home")   // home|collection|product|cart|checkout
  const [activeCol,   setActiveCol]   = useState(null)
  const [selProduct,  setSelProduct]  = useState(null)
  const [selSize,     setSelSize]     = useState("")
  const [selVariant,  setSelVariant]  = useState("Men")
  const [selQuality,  setSelQuality]  = useState("Stadium")
  const [customName,  setCustomName]  = useState("")
  const [customMode,  setCustomMode]  = useState("player")  // player|name
  const [selPlayer,   setSelPlayer]   = useState("")
  const [cart,        setCart]        = useState([])
  const [promoCode,   setPromoCode]   = useState("")
  const [promoInput,  setPromoInput]  = useState("")
  const [promoMsg,    setPromoMsg]    = useState(null)  // {ok,text,pct}
  const [checkStep,   setCheckStep]   = useState(1)     // 1=review,2=payment,3=done
  const [payMethod,   setPayMethod]   = useState("")
  const [payRef,      setPayRef]      = useState("")
  const isMember = !!profile?.is_member

  /* ─── PROMO CODES ─── */
  const PROMOS = {
    "HONEYBADGER10": { pct:10, label:"10% off — Honey Badger exclusive!", memberOnly:false },
    "FARMERSDAY":    { pct:15, label:"15% off — Boteti West Farmers Day!", memberOnly:false },
    "MEMBER20":      { pct:20, label:"20% off — Member loyalty reward!",  memberOnly:true  },
    "SEASON2627":    { pct:5,  label:"5% off — 2026/27 season launch!",   memberOnly:false },
  }

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if(!code){ setPromoMsg({ok:false,text:"Please enter a code."}); return }
    const promo = PROMOS[code]
    if(!promo){ setPromoMsg({ok:false,text:"Invalid promo code."}); return }
    if(promo.memberOnly&&!isMember){
      setPromoMsg({ok:false,text:"This code is for Honey Badger members only."}); return
    }
    setPromoCode(code)
    setPromoMsg({ok:true,text:promo.label,pct:promo.pct})
  }

  /* ─── PRICING HELPERS ─── */
  const memberDisc   = isMember ? 5 : 0
  const promoDisc    = promoMsg?.ok ? promoMsg.pct : 0
  const totalDisc    = Math.min(memberDisc + promoDisc, 40)  // cap 40%

  const discPrice = (p) => Math.round(p * (1 - totalDisc/100))
  const cartSubtotal = cart.reduce((s,i)=>s + discPrice(i.price) * i.qty, 0)
  const cartQty      = cart.reduce((s,i)=>s+i.qty, 0)
  const savedTotal   = cart.reduce((s,i)=>s+(i.price - discPrice(i.price))*i.qty, 0)

  /* ─── SQUAD PLAYERS ─── */
  const PLAYERS = [
    {name:"BUZWANI BATSHOLENG",       num:"#1",  id:"007100M97"},
    {name:"PIWANE BATSHOLENG",        num:"#2",  id:"007357M87"},
    {name:"BOINEELO BOFEDILE",        num:"#3",  id:"031712M00"},
    {name:"MACDONALD BOIKANYO",       num:"#4",  id:"014130M02"},
    {name:"KOKETSO BONTSHENG",        num:"#5",  id:"036247M01"},
    {name:"GOMOLEMO DINGANGANO",      num:"#6",  id:"038579M01"},
    {name:"ENERST GABAITUMELE",       num:"#7",  id:"031673M01"},
    {name:"MODIREDI GABOEDIWE",       num:"#8",  id:"026788M01"},
    {name:"DITSAONE GAEIMELWE",       num:"#9",  id:"031716M03"},
    {name:"KAGISO GEORGE",            num:"#10", id:"024975M03"},
    {name:"BATHOBAKAE GOSETSEMANG",   num:"#11", id:"038598M02"},
    {name:"AMOLEMO KADIMO",           num:"#12", id:"031670M02"},
    {name:"HUPAIVANDA KEFAS",         num:"#13", id:"005427M01"},
    {name:"ODIRELWE KEREEDITSE",      num:"#14", id:"021333M02"},
    {name:"MAATLA KERETELETSWE",      num:"#15", id:"038765M99"},
    {name:"ALSON KGOPE",              num:"#16", id:"029136M99"},
    {name:"ONNEILE LEFETAMANG",       num:"#17", id:"007224M99"},
    {name:"BOSENAKITSO LENYATSO",     num:"#18", id:"025845M98"},
    {name:"KGOSI LULANE",             num:"#19", id:"035314M02"},
    {name:"GOFAMODIMO MACHANGANE",    num:"#20", id:"021607M90"},
    {name:"KEFILWE MAGONO",           num:"#21", id:"040402M97"},
    {name:"TEFHO MAKOBELA",           num:"#22", id:"040392M01"},
    {name:"KEOAGILE MALEBOGO",        num:"#23", id:"040403M99"},
    {name:"MATLHATSA MATLHATSA",      num:"#24", id:"006990M95"},
    {name:"PAKO MOITLHOBOGI",         num:"#25", id:"039042M03"},
    {name:"KEALEBOGA NKINOGANG",      num:"#26", id:"035846M00"},
    {name:"MORT PAGIWA",              num:"#27", id:"013430M98"},
    {name:"KOKETSO SAKAIO",           num:"#28", id:"025831M00"},
    {name:"PATRICK XHABEE",           num:"#29", id:"028470M93"},
  ]


  /* ─── CATALOGUE ─── */
  const ADULT_SIZES = ["XS","S","M","L","XL","XXL","XXXL","XXXXL"]
  const KIDS_SIZES  = ["2Y","3Y","4Y","5Y","6Y","7Y","8Y","9Y","10Y","11Y","12Y","13Y","14Y","15Y","16Y"]
  const VARIANTS    = ["Men","Women","Junior"]
  const QUALITIES   = ["Stadium","Match"]

  const COLLECTIONS = [
    {
      id:"home2627", label:"HOME KIT", sublabel:"2026/27 Season", emoji:"🟡",
      bg:`linear-gradient(135deg,${NAVY} 0%,#1a3060 100%)`,
      accent:GOLD, textColor:WHITE, new:true,
      desc:"The official 2026/27 Villareal FC home kit. Navy & gold. Full sublimation.",
      products:[
        {id:"hk2627_st",name:"Home Kit 2026/27",quality:"Stadium",price:280,variants:VARIANTS,sizes:ADULT_SIZES,season:"2026/27",tag:"NEW",tagC:GREEN},
        {id:"hk2627_mt",name:"Home Kit 2026/27 Match",quality:"Match",price:380,variants:["Men","Women"],sizes:["S","M","L","XL","XXL"],season:"2026/27",tag:"MATCH",tagC:"#7c3aed"},
        {id:"hk2627_jr",name:"Home Kit 2026/27 Junior",quality:"Stadium",price:220,variants:["Junior"],sizes:KIDS_SIZES,season:"2026/27",tag:"KIDS",tagC:"#0891b2"},
      ]
    },
    {
      id:"away2627", label:"AWAY KIT", sublabel:"2026/27 Season", emoji:"⬜",
      bg:`linear-gradient(135deg,#1a1a2e 0%,#2a2a4e 100%)`,
      accent:"#e0e0e0", textColor:WHITE, new:true,
      desc:"Official away kit. White & gold trim. Premium polyester.",
      products:[
        {id:"ak2627_st",name:"Away Kit 2026/27",quality:"Stadium",price:260,variants:VARIANTS,sizes:ADULT_SIZES,season:"2026/27",tag:"NEW",tagC:GREEN},
        {id:"ak2627_jr",name:"Away Kit 2026/27 Junior",quality:"Stadium",price:200,variants:["Junior"],sizes:KIDS_SIZES,season:"2026/27",tag:"KIDS",tagC:"#0891b2"},
      ]
    },
    {
      id:"retro",label:"RETRO COLLECTION",sublabel:"Classic Seasons",emoji:"🏆",
      bg:`linear-gradient(135deg,#2d1b00 0%,#4a2e00 100%)`,
      accent:GOLD,textColor:WHITE,new:false,
      desc:"Iconic kits from past seasons. Limited stock.",
      products:[
        {id:"ret_2526",name:"Home Kit 2025/26",quality:"Stadium",price:220,variants:VARIANTS,sizes:["S","M","L","XL","XXL"],season:"2025/26",tag:"RETRO",tagC:GOLD2},
        {id:"ret_2425",name:"Home Kit 2024/25",quality:"Stadium",price:180,variants:VARIANTS,sizes:["M","L","XL"],season:"2024/25",tag:"SALE",tagC:RED},
        {id:"ret_2324",name:"Home Kit 2023/24",quality:"Stadium",price:160,variants:VARIANTS,sizes:["L","XL"],season:"2023/24",tag:"SALE",tagC:RED},
      ]
    },
    {
      id:"training",label:"TRAINING",sublabel:"Match-Day Ready",emoji:"💪",
      bg:`linear-gradient(135deg,#0a2a0a 0%,#1a4a1a 100%)`,
      accent:"#4ade80",textColor:WHITE,new:false,
      desc:"Performance training wear. Moisture-wicking. All sizes.",
      products:[
        {id:"tr_top",name:"Training Top 2026/27",quality:"Stadium",price:180,variants:VARIANTS,sizes:ADULT_SIZES,season:"2026/27",tag:"TRAINING",tagC:GREEN},
        {id:"tr_short",name:"Training Shorts",quality:"Stadium",price:120,variants:VARIANTS,sizes:ADULT_SIZES,season:"2026/27",tag:"TRAINING",tagC:GREEN},
        {id:"tr_track",name:"Tracksuit 2026/27",quality:"Stadium",price:320,variants:VARIANTS,sizes:ADULT_SIZES,season:"2026/27",tag:"NEW",tagC:GREEN},
      ]
    },
    {
      id:"fanwear",label:"FAN GEAR",sublabel:"Show Your Colours",emoji:"🦡",
      bg:`linear-gradient(135deg,${NAVY} 0%,#D4A800 100%)`,
      accent:GOLD,textColor:WHITE,new:false,
      desc:"Official fan merchandise. Scarves, caps, tees and more.",
      products:[
        {id:"fan_tee",name:"Honey Badger Fan Tee",quality:"Stadium",price:120,variants:VARIANTS,sizes:ADULT_SIZES,season:"2026/27",tag:"FAN",tagC:GOLD2},
        {id:"fan_tee_k",name:"Kids Fan Tee",quality:"Stadium",price:90,variants:["Junior"],sizes:KIDS_SIZES,season:"2026/27",tag:"KIDS",tagC:"#0891b2"},
        {id:"fan_scarf",name:"Yellow Submarine Scarf",quality:"Stadium",price:85,variants:["Men","Women"],sizes:["ONE SIZE"],season:"2026/27",tag:"FAN",tagC:GOLD2},
        {id:"fan_cap",name:"Honey Badger Cap",quality:"Stadium",price:70,variants:["Men","Women"],sizes:["ONE SIZE"],season:"2026/27",tag:"FAN",tagC:GOLD2},
        {id:"fan_hoodie",name:"Club Hoodie 2026/27",quality:"Stadium",price:250,variants:VARIANTS,sizes:ADULT_SIZES,season:"2026/27",tag:"NEW",tagC:GREEN},
      ]
    },
    {
      id:"gk",label:"GOALKEEPER",sublabel:"Between the Sticks",emoji:"🧤",
      bg:`linear-gradient(135deg,#1a0050 0%,#3a0090 100%)`,
      accent:"#a78bfa",textColor:WHITE,new:true,
      desc:"Official goalkeeper kit. High-vis. Limited edition.",
      products:[
        {id:"gk_kit",name:"GK Kit 2026/27",quality:"Stadium",price:300,variants:["Men"],sizes:["M","L","XL","XXL","XXXL"],season:"2026/27",tag:"LIMITED",tagC:"#7c3aed"},
      ]
    },
    {
      id:"customize",label:"CUSTOMISE YOUR KIT",sublabel:"Name · Number · Player",emoji:"✏️",
      bg:`linear-gradient(135deg,#7c3aed 0%,#4c1d95 100%)`,
      accent:"#e9d5ff",textColor:WHITE,new:false,isCustomize:true,
      desc:"Personalise any Villareal FC kit with your name, squad number or a player name.",
      products:[]
    },
  ]

  const ALL_PRODUCTS = COLLECTIONS.flatMap(c=>c.products.map(p=>({...p,collection:c.id,collLabel:c.label})))

  /* ─── ADD TO CART ─── */
  const handleAddToCart = (product, size, variant, quality, customization={}) => {
    const item = {
      ...product, size, variant, quality,
      customName:customization.name||"",
      player:customization.player||"",
      cartId: `${product.id}_${size}_${variant}_${Date.now()}`,
    }
    setCart(prev=>[...prev,{...item,qty:1}])
    setShopView("home")
    setSelProduct(null)
    setSelSize("")
  }

  /* ─── SIZE GUIDE ─── */
  const SIZE_GUIDE = [
    {s:"XS",chest:"80–84",waist:"70–74",hip:"86–90"},
    {s:"S", chest:"88–92",waist:"78–82",hip:"94–98"},
    {s:"M", chest:"96–100",waist:"86–90",hip:"102–106"},
    {s:"L", chest:"104–108",waist:"94–98",hip:"110–114"},
    {s:"XL",chest:"112–116",waist:"102–106",hip:"118–122"},
    {s:"XXL",chest:"120–124",waist:"110–114",hip:"126–130"},
    {s:"XXXL",chest:"128–132",waist:"118–122",hip:"134–138"},
    {s:"XXXXL",chest:"136–140",waist:"126–130",hip:"142–146"},
  ]
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  /* ─── HERO BANNERS for auto-scroll ─── */
  const [heroBanner, setHeroBanner] = useState(0)
  const heroBannerRef = useRef(0)
  const BANNERS = [
    {title:"2026/27 KITS",sub:"Home & Away now available",emoji:"⚽",bg:`linear-gradient(135deg,${NAVY},#1a3060)`,accent:GOLD,cta:"SHOP KITS →",col:"home2627"},
    {title:"THE HONEY BADGER",sub:"Fan gear — show your colours",emoji:"🦡",bg:`linear-gradient(135deg,#D4A800,#0D1B3E)`,accent:WHITE,cta:"SHOP FAN GEAR →",col:"fanwear"},
    {title:"RETRO COLLECTION",sub:"Iconic kits from past seasons",emoji:"🏆",bg:`linear-gradient(135deg,#2d1b00,#4a2e00)`,accent:GOLD,cta:"SHOP RETRO →",col:"retro"},
  ]
  // Use a DOM-based approach to update banner without triggering scroll reset


  /* ══════════════════════════════════════════════════════════
     VIEWS
  ══════════════════════════════════════════════════════════ */

  /* ── STORE HOME ── */
  const homeScrollRef = useRef(null)
  // Standalone banner component — prevents HomeView scroll reset on banner change
  const HeroBannerBlock = React.memo(() => {
    const [idx, setIdx] = useState(0)
    useEffect(()=>{
      const id = setInterval(()=>setIdx(i=>(i+1)%BANNERS.length), 4000)
      return ()=>clearInterval(id)
    },[])
    const b = BANNERS[idx]
    return (
      <div style={{position:"relative",overflow:"hidden",flexShrink:0}}>
        <div style={{background:b.bg,
          padding:"clamp(24px,6vw,36px) clamp(16px,4vw,20px) clamp(20px,5vw,28px)",
          transition:"background 0.6s",position:"relative",overflow:"hidden",
          minHeight:"clamp(160px,40vw,200px)",display:"flex",flexDirection:"column",
          justifyContent:"center"}}>
          <div style={{position:"absolute",right:-20,top:-20,opacity:0.06}}><Logo size={200}/></div>
          <div style={{fontSize:"clamp(36px,10vw,52px)",marginBottom:8}}>{b.emoji}</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:"clamp(22px,7vw,32px)",color:b.accent,lineHeight:1,
            letterSpacing:"0.04em"}}>{b.title}</div>
          <div style={{fontSize:"clamp(11px,3vw,13px)",color:"rgba(255,255,255,0.7)",
            marginTop:4,marginBottom:14}}>{b.sub}</div>
          <button onClick={()=>{setActiveCol(b.col);setShopView("collection")}}
            style={{alignSelf:"flex-start",background:b.accent,border:"none",
              borderRadius:8,padding:"8px 18px",minHeight:38,
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:"clamp(11px,3vw,13px)",color:NAVY,
              cursor:"pointer",WebkitTapHighlightColor:"transparent",
              letterSpacing:"0.06em"}}>{b.cta}</button>
        </div>
        <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",
          display:"flex",gap:5}}>
          {BANNERS.map((_,i)=>(
            <div key={i} onClick={()=>setIdx(i)}
              style={{width:i===idx?20:6,height:6,borderRadius:3,
                background:i===idx?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.35)",
                cursor:"pointer",transition:"width 0.3s"}}/>
          ))}
        </div>
      </div>
    )
  })

  const HomeView = () => (
    <div ref={homeScrollRef} style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",background:"#f5f6fa"}}>

      {/* ── HERO BANNER (isolated component — no scroll reset) ── */}
      <HeroBannerBlock/>

      {/* ── MEMBER BANNER ── */}
      {!isMember&&(
        <div onClick={openMembership}
          style={{margin:"12px 12px 0",background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
            borderRadius:12,padding:"12px 16px",
            display:"flex",alignItems:"center",justifyContent:"space-between",
            cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:14,color:NAVY}}>🦡 JOIN HONEY BADGER — SAVE 5% ON ALL ORDERS</div>
            <div style={{fontSize:11,color:"rgba(13,27,62,0.7)",marginTop:2}}>
              Plus exclusive promo codes & early access
            </div>
          </div>
          <div style={{background:NAVY,color:GOLD,fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:900,fontSize:11,padding:"5px 10px",borderRadius:6,flexShrink:0}}>
            JOIN →
          </div>
        </div>
      )}
      {isMember&&(
        <div style={{margin:"12px 12px 0",background:`${GREEN}18`,
          border:`1px solid ${GREEN}44`,borderRadius:12,padding:"10px 14px",
          display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>🦡</span>
          <div style={{fontSize:12,color:GREEN,fontWeight:700}}>
            Honey Badger member — you save 5% on all purchases!
          </div>
        </div>
      )}

      {/* ── COLLECTIONS GRID ── */}
      <div style={{padding:"16px 12px 8px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:"clamp(16px,5vw,20px)",color:NAVY,marginBottom:12,
          letterSpacing:"0.04em"}}>COLLECTIONS</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:4}}>
          {COLLECTIONS.map((col,i)=>(
            <div key={col.id}
              onClick={()=>{
                if(col.isCustomize){setShopView("customize");return}
                setActiveCol(col.id);setShopView("collection")
              }}
              style={{
                borderRadius:14,overflow:"hidden",cursor:"pointer",
                background:col.bg,minHeight:"clamp(100px,28vw,130px)",
                display:"flex",flexDirection:"column",justifyContent:"flex-end",
                padding:"10px 12px",position:"relative",
                boxShadow:"0 4px 14px rgba(0,0,0,0.15)",
                WebkitTapHighlightColor:"transparent",
                gridColumn: i===0?"1/3":undefined,  // first card full width
              }}>
              <div style={{position:"absolute",top:-10,right:-10,opacity:0.08,fontSize:80,
                lineHeight:1}}>{col.emoji}</div>
              {col.new&&(
                <div style={{position:"absolute",top:10,right:10,
                  background:GREEN,color:WHITE,fontSize:9,fontWeight:900,
                  padding:"2px 7px",borderRadius:4,
                  fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em"}}>
                  NEW
                </div>
              )}
              <div style={{fontSize:"clamp(20px,5vw,26px)",marginBottom:4}}>{col.emoji}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:"clamp(14px,4vw,18px)",color:col.accent||WHITE,lineHeight:1}}>
                {col.label}
              </div>
              <div style={{fontSize:"clamp(9px,2.5vw,11px)",color:"rgba(255,255,255,0.6)",
                marginTop:2}}>{col.sublabel}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CUSTOMIZE YOUR JERSEY — dedicated section ── */}
      <div style={{padding:"16px 12px 0"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:"clamp(16px,5vw,20px)",color:NAVY,marginBottom:12,
          letterSpacing:"0.04em"}}>CUSTOMIZE YOUR JERSEY</div>
        <div onClick={()=>{
            setSelProduct(COLLECTIONS[0].products[0])
            setSelSize("")
            setSelVariant("Men")
            setSelQuality("Stadium")
            setShopView("customize")
          }}
          style={{borderRadius:16,overflow:"hidden",cursor:"pointer",
            boxShadow:"0 4px 20px rgba(13,27,62,0.15)",
            WebkitTapHighlightColor:"transparent",
            background:`linear-gradient(160deg,${NAVY} 0%,#1a3060 60%,#0a0a20 100%)`,
            padding:"0",position:"relative",minHeight:"clamp(160px,42vw,200px)",
            display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
          {/* Background logo watermark */}
          <div style={{position:"absolute",inset:0,display:"flex",
            alignItems:"center",justifyContent:"center",opacity:0.06}}>
            <Logo size={"clamp(160px,50vw,220px)"}/>
          </div>
          {/* Large jersey emoji centred */}
          <div style={{position:"absolute",top:"50%",left:"50%",
            transform:"translate(-50%,-58%)",fontSize:"clamp(70px,20vw,100px)",
            filter:"drop-shadow(0 8px 24px rgba(0,0,0,0.5))"}}>
            ⚽
          </div>
          {/* Gold stripe across top */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:GOLD}}/>
          {/* Bottom info strip */}
          <div style={{background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)",
            padding:"14px 16px",display:"flex",
            alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:"clamp(16px,5vw,22px)",color:WHITE,lineHeight:1,
                letterSpacing:"0.04em"}}>
                CUSTOMIZE YOUR JERSEY
              </div>
              <div style={{fontSize:"clamp(10px,2.8vw,12px)",
                color:"rgba(255,255,255,0.65)",marginTop:4}}>
                Choose kit · quality · size · add player name or your own name
              </div>
            </div>
            <div style={{background:GOLD,color:NAVY,
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:"clamp(10px,3vw,12px)",padding:"8px 14px",borderRadius:8,
              flexShrink:0,letterSpacing:"0.04em"}}>
              BUILD →
            </div>
          </div>
        </div>
      </div>

      {/* ── BEST SELLERS ── */}
      <div style={{padding:"4px 12px 20px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:"clamp(16px,5vw,20px)",color:NAVY,marginBottom:12,
          letterSpacing:"0.04em"}}>BEST SELLERS</div>
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,
          WebkitOverflowScrolling:"touch"}}>
          {ALL_PRODUCTS.filter((_,i)=>[0,3,6,10,12].includes(i)).map(p=>(
            <div key={p.id}
              onClick={()=>{setSelProduct(p);setSelSize("");setSelVariant("Men");setSelQuality(p.quality||"Stadium");setShopView("product")}}
              style={{flexShrink:0,width:"clamp(130px,36vw,160px)",borderRadius:14,
                overflow:"hidden",background:WHITE,
                boxShadow:"0 2px 10px rgba(0,0,0,0.08)",border:"1.5px solid #eee",
                cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
              <div style={{height:100,background:`linear-gradient(160deg,${NAVY},#1a3060)`,
                position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{opacity:0.07,position:"absolute"}}><Logo size={80}/></div>
                <span style={{fontSize:44,zIndex:1}}>{COLLECTIONS.find(c=>c.id===p.collection)?.emoji||"⚽"}</span>
                <div style={{position:"absolute",top:7,left:7,
                  background:p.tagC,color:WHITE,fontSize:8,fontWeight:900,
                  padding:"2px 6px",borderRadius:3,
                  fontFamily:"'Barlow Condensed',sans-serif"}}>{p.tag}</div>
              </div>
              <div style={{padding:"8px 10px 10px"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:"clamp(11px,3vw,13px)",color:NAVY,lineHeight:1.2,marginBottom:4,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:"clamp(14px,4vw,17px)",color:NAVY}}>
                  P{discPrice(p.price)}
                  {totalDisc>0&&<span style={{fontSize:10,color:MGRAY,textDecoration:"line-through",marginLeft:4}}>P{p.price}</span>}
                </div>
                {isMember&&<div style={{fontSize:9,color:GREEN,fontWeight:700,marginTop:1}}>🦡 Member price</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  /* ── COLLECTION VIEW ── */
  const CollectionView = () => {
    const col = COLLECTIONS.find(c=>c.id===activeCol)
    if(!col) return null
    return (
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Header */}
        <div style={{background:col.bg,padding:"16px 14px 14px",flexShrink:0}}>
          <button onClick={()=>setShopView("home")}
            style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,
              padding:"6px 12px",color:WHITE,fontSize:13,cursor:"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,marginBottom:10,
              WebkitTapHighlightColor:"transparent"}}>
            ← BACK
          </button>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:32}}>{col.emoji}</span>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:22,color:col.accent||WHITE,lineHeight:1}}>{col.label}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>{col.sublabel}</div>
            </div>
          </div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.65)",marginTop:8,lineHeight:1.5}}>
            {col.desc}
          </div>
        </div>
        {/* Products */}
        <div style={{flex:1,overflowY:"auto",padding:"12px",
          background:"#f5f6fa",WebkitOverflowScrolling:"touch"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {col.products.map(p=>(
              <div key={p.id}
                onClick={()=>{setSelProduct(p);setSelSize("");setSelVariant(p.variants[0]);setSelQuality(p.quality||"Stadium");setShopView("product")}}
                style={{borderRadius:14,overflow:"hidden",background:WHITE,
                  boxShadow:"0 2px 10px rgba(0,0,0,0.08)",border:"1.5px solid #eee",
                  cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                <div style={{height:110,background:`linear-gradient(160deg,${NAVY},#1a3060)`,
                  position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{opacity:0.07,position:"absolute"}}><Logo size={80}/></div>
                  <span style={{fontSize:50,zIndex:1}}>{col.emoji}</span>
                  <div style={{position:"absolute",top:8,left:8,
                    background:p.tagC,color:WHITE,fontSize:8,fontWeight:900,
                    padding:"2px 6px",borderRadius:3,
                    fontFamily:"'Barlow Condensed',sans-serif"}}>{p.tag}</div>
                  {(totalDisc>0)&&(
                    <div style={{position:"absolute",bottom:8,right:8,
                      background:RED,color:WHITE,fontSize:8,fontWeight:900,
                      padding:"2px 6px",borderRadius:3,
                      fontFamily:"'Barlow Condensed',sans-serif"}}>
                      -{totalDisc}%
                    </div>
                  )}
                </div>
                <div style={{padding:"10px 10px 12px"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                    fontSize:"clamp(11px,3vw,13px)",color:NAVY,lineHeight:1.2,marginBottom:6,
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                    fontSize:"clamp(14px,4vw,17px)",color:NAVY}}>
                    P{discPrice(p.price)}
                  </div>
                  {p.price!==discPrice(p.price)&&(
                    <div style={{fontSize:10,color:MGRAY,textDecoration:"line-through"}}>P{p.price}</div>
                  )}
                  {isMember&&<div style={{fontSize:9,color:GREEN,fontWeight:700,marginTop:2}}>🦡 Member price applied</div>}
                  <div style={{fontSize:10,color:MGRAY,marginTop:2}}>{p.quality} · {p.variants.join(" / ")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ── PRODUCT DETAIL ── */
  const ProductView = () => {
    if(!selProduct) return null
    const p = selProduct
    const col = COLLECTIONS.find(c=>c.id===p.collection)
    const finalPrice = discPrice(p.price)
    const [showGuide, setShowGuide] = useState(false)

    return (
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:WHITE}}>
        {/* Header */}
        <div style={{background:`linear-gradient(135deg,${NAVY},#1a3060)`,
          padding:"14px 16px",flexShrink:0,
          display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setShopView(activeCol?"collection":"home")}
            style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,
              padding:"6px 12px",color:WHITE,fontSize:13,cursor:"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,flexShrink:0,
              WebkitTapHighlightColor:"transparent"}}>← BACK</button>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:16,color:WHITE,overflow:"hidden",textOverflow:"ellipsis",
            whiteSpace:"nowrap"}}>{p.name}</div>
        </div>

        <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
          {/* Product hero */}
          <div style={{background:`linear-gradient(160deg,${NAVY},#1a3060)`,
            height:"clamp(160px,40vw,200px)",position:"relative",
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{opacity:0.06,position:"absolute"}}><Logo size={160}/></div>
            <span style={{fontSize:"clamp(60px,18vw,90px)",zIndex:1}}>{col?.emoji||"⚽"}</span>
            <div style={{position:"absolute",top:12,left:12,
              background:p.tagC,color:WHITE,fontSize:10,fontWeight:900,
              padding:"3px 9px",borderRadius:4,
              fontFamily:"'Barlow Condensed',sans-serif"}}>{p.tag}</div>
            {totalDisc>0&&(
              <div style={{position:"absolute",top:12,right:12,
                background:RED,color:WHITE,fontSize:10,fontWeight:900,
                padding:"3px 9px",borderRadius:4,
                fontFamily:"'Barlow Condensed',sans-serif"}}>-{totalDisc}% OFF</div>
            )}
          </div>

          <div style={{padding:"16px 14px"}}>
            {/* Name & price */}
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:"clamp(18px,5vw,22px)",color:NAVY,lineHeight:1,marginBottom:8}}>
              {p.name}
            </div>
            <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:4}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:"clamp(26px,8vw,34px)",color:NAVY}}>P{finalPrice}</span>
              {p.price!==finalPrice&&(
                <span style={{fontSize:14,color:MGRAY,textDecoration:"line-through"}}>P{p.price}</span>
              )}
            </div>
            {/* Discount badges */}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {isMember&&(
                <div style={{background:`${GREEN}18`,border:`1px solid ${GREEN}44`,
                  borderRadius:6,padding:"3px 9px",fontSize:11,color:GREEN,fontWeight:700}}>
                  🦡 Member -5%
                </div>
              )}
              {promoMsg?.ok&&(
                <div style={{background:`${GOLD}22`,border:`1px solid ${GOLD}`,
                  borderRadius:6,padding:"3px 9px",fontSize:11,color:GOLD2,fontWeight:700}}>
                  🎟 Promo -{promoDisc}%
                </div>
              )}
              {totalDisc>0&&(
                <div style={{background:`${RED}18`,border:`1px solid ${RED}44`,
                  borderRadius:6,padding:"3px 9px",fontSize:11,color:RED,fontWeight:700}}>
                  Save P{p.price-finalPrice}
                </div>
              )}
            </div>

            {/* Quality selector */}
            {QUALITIES.length>0&&p.variants[0]!=="Junior"&&(
              <>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>
                  QUALITY
                </div>
                <div style={{display:"flex",gap:8,marginBottom:14}}>
                  {QUALITIES.map(q=>(
                    <button key={q} onClick={()=>setSelQuality(q)} style={{
                      flex:1,padding:"9px 0",borderRadius:10,minHeight:42,
                      border:`2px solid ${selQuality===q?NAVY:"#e5e7eb"}`,
                      background:selQuality===q?NAVY:WHITE,
                      color:selQuality===q?WHITE:NAVY,
                      fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                      fontSize:13,cursor:"pointer",WebkitTapHighlightColor:"transparent",
                    }}>
                      {q}{q==="Match"?" +P100":""}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Variant selector */}
            {p.variants.length>1&&(
              <>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>VARIANT</div>
                <div style={{display:"flex",gap:8,marginBottom:14}}>
                  {p.variants.map(v=>(
                    <button key={v} onClick={()=>setSelVariant(v)} style={{
                      flex:1,padding:"9px 0",borderRadius:10,minHeight:42,
                      border:`2px solid ${selVariant===v?NAVY:"#e5e7eb"}`,
                      background:selVariant===v?NAVY:WHITE,
                      color:selVariant===v?WHITE:NAVY,
                      fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                      fontSize:13,cursor:"pointer",WebkitTapHighlightColor:"transparent",
                    }}>{v}</button>
                  ))}
                </div>
              </>
            )}

            {/* Size selector */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
              marginBottom:8}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:11,color:MGRAY,letterSpacing:"0.08em"}}>SIZE</div>
              <button onClick={()=>setShowGuide(s=>!s)}
                style={{background:"none",border:"none",cursor:"pointer",
                  fontSize:11,color:NAVY,fontWeight:700,textDecoration:"underline"}}>
                Size Guide
              </button>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              {p.sizes.map(sz=>(
                <button key={sz} onClick={()=>setSelSize(sz)} style={{
                  minWidth:"clamp(38px,10vw,48px)",height:"clamp(38px,10vw,48px)",
                  borderRadius:9,
                  border:`2px solid ${selSize===sz?NAVY:"#e5e7eb"}`,
                  background:selSize===sz?NAVY:WHITE,
                  color:selSize===sz?WHITE:NAVY,
                  fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:"clamp(10px,3vw,13px)",cursor:"pointer",padding:"0 6px",
                  WebkitTapHighlightColor:"transparent",
                }}>{sz}</button>
              ))}
            </div>

            {/* Size guide */}
            {showGuide&&(
              <div style={{background:LGRAY,borderRadius:10,padding:"10px",
                marginBottom:12,overflowX:"auto"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:11,color:NAVY,marginBottom:8}}>SIZE GUIDE (cm)</div>
                <table style={{borderCollapse:"collapse",fontSize:10,minWidth:280,width:"100%"}}>
                  <thead>
                    <tr style={{background:NAVY}}>
                      {["SIZE","CHEST","WAIST","HIP"].map(h=>(
                        <th key={h} style={{padding:"4px 8px",color:WHITE,
                          fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                          fontSize:9,textAlign:"left"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_GUIDE.map((r,i)=>(
                      <tr key={r.s} style={{background:selSize===r.s?`${GOLD}33`:i%2===0?WHITE:LGRAY}}>
                        <td style={{padding:"4px 8px",fontWeight:800,color:NAVY}}>{r.s}</td>
                        <td style={{padding:"4px 8px",color:MGRAY}}>{r.chest}</td>
                        <td style={{padding:"4px 8px",color:MGRAY}}>{r.waist}</td>
                        <td style={{padding:"4px 8px",color:MGRAY}}>{r.hip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Customizer link — instead of inline customizer */}
            {p.tag!=="KIDS"&&p.tag!=="FAN"&&(
              <div onClick={()=>setShopView("customize")}
                style={{background:LGRAY,borderRadius:12,padding:"12px 14px",
                  marginBottom:14,cursor:"pointer",display:"flex",
                  alignItems:"center",justifyContent:"space-between",
                  border:`1.5px solid #e5e7eb`,WebkitTapHighlightColor:"transparent"}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                    fontSize:13,color:NAVY}}>🎽 Customize this item</div>
                  <div style={{fontSize:11,color:MGRAY,marginTop:2}}>
                    Add player name, your name, or squad number
                  </div>
                </div>
                <span style={{fontSize:18,color:MGRAY}}>›</span>
              </div>
            )}

            {/* Description */}
            <div style={{fontSize:12,color:MGRAY,lineHeight:1.6,marginBottom:16}}>
              {COLLECTIONS.find(c=>c.id===p.collection)?.desc}
              {" "}Season: {p.season}.
            </div>

            {/* Add to cart button */}
            <button
              onClick={()=>{
                if(!selSize){ return }
                const q = selQuality==="Match"?p.price+100:p.price
                handleAddToCart({...p,price:q},selSize,selVariant,selQuality,
                  {name:customMode==="name"?customName:"",
                   player:customMode==="player"?selPlayer:""})
              }}
              disabled={!selSize}
              style={{width:"100%",padding:"16px",minHeight:54,
                background:selSize?NAVY:"#e5e7eb",border:"none",borderRadius:12,
                fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:17,
                color:selSize?WHITE:"#aaa",cursor:selSize?"pointer":"not-allowed",
                WebkitTapHighlightColor:"transparent",
                boxShadow:selSize?"0 4px 14px rgba(13,27,62,0.3)":"none",
                transition:"all 0.15s",letterSpacing:"0.04em"}}>
              {selSize
                ? `ADD TO CART — P${discPrice(selQuality==="Match"?p.price+100:p.price)}`
                : "SELECT A SIZE TO CONTINUE"}
            </button>

            {!selSize&&(
              <div style={{textAlign:"center",fontSize:11,color:MGRAY,marginTop:6}}>
                ↑ Select your size above
              </div>
            )}

            {/* Promo code entry */}
            <div style={{marginTop:16,background:LGRAY,borderRadius:10,
              padding:"12px 14px"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:11,color:NAVY,letterSpacing:"0.08em",marginBottom:8}}>
                🎟 PROMO CODE
              </div>
              <div style={{display:"flex",gap:8}}>
                <input placeholder="Enter promo code" value={promoInput}
                  onChange={e=>setPromoInput(e.target.value.toUpperCase())}
                  style={{flex:1,padding:"9px 12px",borderRadius:8,
                    border:`1.5px solid ${promoMsg?.ok?GREEN:promoMsg?.ok===false?RED:"#ddd"}`,
                    fontSize:13,outline:"none",fontFamily:"'Barlow Condensed',sans-serif",
                    fontWeight:700,letterSpacing:"0.06em"}}/>
                <button onClick={applyPromo}
                  style={{background:NAVY,border:"none",borderRadius:8,
                    padding:"9px 14px",color:WHITE,fontFamily:"'Barlow Condensed',sans-serif",
                    fontWeight:800,fontSize:12,cursor:"pointer",flexShrink:0,
                    WebkitTapHighlightColor:"transparent"}}>
                  APPLY
                </button>
              </div>
              {promoMsg&&(
                <div style={{marginTop:6,fontSize:11,fontWeight:700,
                  color:promoMsg.ok?GREEN:RED}}>
                  {promoMsg.ok?"✓":"✗"} {promoMsg.text}
                </div>
              )}
              {!isMember&&(
                <div style={{marginTop:6,fontSize:10,color:MGRAY,lineHeight:1.5}}>
                  🦡 Join Honey Badger membership for exclusive promo codes + 5% discount
                </div>
              )}
            </div>

            <div style={{height:20}}/>
          </div>
        </div>
      </div>
    )
  }

  /* ── CUSTOMIZE VIEW ── */
  const CustomizeView = () => {
    const KITS = [
      {id:"hk2627",label:"Home Kit 2026/27",emoji:"🟡",price:280,season:"2026/27"},
      {id:"ak2627",label:"Away Kit 2026/27",emoji:"⬜",price:260,season:"2026/27"},
      {id:"hk2526",label:"Home Kit 2025/26",emoji:"🏆",price:220,season:"2025/26"},
      {id:"tr_top", label:"Training Top",   emoji:"💪",price:180,season:"2026/27"},
    ]
    const [cKit,     setCKit]     = useState(null)
    const [cSize,    setCSize]    = useState("")
    const [cVariant, setCVariant] = useState("Men")
    const [cMode,    setCMode]    = useState("player")   // player | name
    const [cPlayer,  setCPlayer]  = useState("")
    const [cName,    setCName]    = useState("")
    const [cNum,     setCNum]     = useState("")
    const [added,    setAdded]    = useState(false)

    const kit = KITS.find(k=>k.id===cKit)
    const finalPrice = kit ? discPrice(kit.price + 100) : 0  // +P100 for customization

    const doAdd = () => {
      if(!cKit||!cSize) return
      handleAddToCart(
        {id:cKit,name:kit.label+" (Custom)",price:kit.price+100,
         collection:"customize",collLabel:"Customise",tag:"CUSTOM",tagC:"#7c3aed",
         variants:[cVariant],sizes:[cSize],season:kit.season,quality:"Stadium"},
        cSize, cVariant, "Stadium",
        {name:cMode==="name"?`${cName} ${cNum}`.trim():"",
         player:cMode==="player"?cPlayer:""}
      )
      setAdded(true)
      setTimeout(()=>setAdded(false),2000)
    }

    return (
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#7c3aed,#4c1d95)",
          padding:"14px 16px",flexShrink:0}}>
          <button onClick={()=>setShopView("home")}
            style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,
              padding:"6px 12px",color:WHITE,fontSize:13,cursor:"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,marginBottom:10,
              WebkitTapHighlightColor:"transparent"}}>← BACK</button>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:30}}>✏️</span>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:20,color:"#e9d5ff",lineHeight:1}}>CUSTOMISE YOUR KIT</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>
                Name · Number · Player · +P100
              </div>
            </div>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",
          padding:"14px",background:"#f5f6fa"}}>

          {/* Live preview */}
          <div style={{background:"linear-gradient(135deg,#7c3aed,#4c1d95)",
            borderRadius:16,padding:"20px",marginBottom:16,textAlign:"center",
            position:"relative",overflow:"hidden"}}>
            <div style={{opacity:0.08,position:"absolute",top:-20,right:-20}}><Logo size={160}/></div>
            <div style={{fontSize:64,marginBottom:8}}>{kit?.emoji||"⚽"}</div>
            {(cPlayer||cName)&&(
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:"clamp(20px,6vw,28px)",color:"#fde68a",letterSpacing:"0.1em",
                lineHeight:1,marginBottom:4}}>
                {cMode==="player"?cPlayer:(cName||"YOUR NAME").toUpperCase()}
              </div>
            )}
            {(cNum||cMode==="player"&&cPlayer)&&(
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:"clamp(36px,10vw,52px)",color:WHITE,lineHeight:1}}>
                {cMode==="player"
                  ? (PLAYERS.find(p=>p.name===cPlayer)?.num||"#?")
                  : (cNum||"#?")}
              </div>
            )}
            {(!cPlayer&&!cName)&&(
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:4}}>
                Customisation preview will appear here
              </div>
            )}
            {kit&&<div style={{marginTop:8,fontSize:11,color:"rgba(255,255,255,0.7)"}}>
              {kit.label}
            </div>}
          </div>

          {/* Step 1: Choose kit */}
          <div style={{background:WHITE,borderRadius:12,padding:"14px",
            marginBottom:12,boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:10}}>
              1 · CHOOSE KIT
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {KITS.map(k=>(
                <div key={k.id} onClick={()=>setCKit(k.id)}
                  style={{padding:"10px",borderRadius:10,cursor:"pointer",
                    border:`2px solid ${cKit===k.id?"#7c3aed":"#e5e7eb"}`,
                    background:cKit===k.id?"#f5f3ff":WHITE,
                    display:"flex",alignItems:"center",gap:8,
                    WebkitTapHighlightColor:"transparent"}}>
                  <span style={{fontSize:22}}>{k.emoji}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                      fontSize:12,color:NAVY,overflow:"hidden",textOverflow:"ellipsis",
                      whiteSpace:"nowrap"}}>{k.label}</div>
                    <div style={{fontSize:10,color:MGRAY}}>P{discPrice(k.price+100)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Variant + Size */}
          <div style={{background:WHITE,borderRadius:12,padding:"14px",
            marginBottom:12,boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:10}}>
              2 · VARIANT & SIZE
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:10,color:MGRAY,fontWeight:700,marginBottom:6,
                fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em"}}>
                VARIANT</div>
              <div style={{display:"flex",gap:8}}>
                {["Men","Women","Junior"].map(v=>(
                  <button key={v} onClick={()=>setCVariant(v)} style={{
                    flex:1,padding:"8px 0",borderRadius:8,minHeight:38,
                    border:`2px solid ${cVariant===v?NAVY:"#e5e7eb"}`,
                    background:cVariant===v?NAVY:WHITE,
                    color:cVariant===v?WHITE:NAVY,
                    fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                    fontSize:12,cursor:"pointer",WebkitTapHighlightColor:"transparent",
                  }}>{v}</button>
                ))}
              </div>
            </div>
            <div style={{fontSize:10,color:MGRAY,fontWeight:700,marginBottom:6,
              fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em"}}>
              SIZE</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {(cVariant==="Junior"
                ? ["2Y","4Y","6Y","8Y","10Y","12Y","14Y","16Y"]
                : ["XS","S","M","L","XL","XXL","XXXL","XXXXL"]
              ).map(sz=>(
                <button key={sz} onClick={()=>setCSize(sz)} style={{
                  minWidth:42,height:42,borderRadius:9,padding:"0 6px",
                  border:`2px solid ${cSize===sz?"#7c3aed":"#e5e7eb"}`,
                  background:cSize===sz?"#7c3aed":WHITE,
                  color:cSize===sz?WHITE:NAVY,
                  fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:12,cursor:"pointer",WebkitTapHighlightColor:"transparent",
                }}>{sz}</button>
              ))}
            </div>
          </div>

          {/* Step 3: Customisation */}
          <div style={{background:WHITE,borderRadius:12,padding:"14px",
            marginBottom:12,boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:10}}>
              3 · PERSONALISE
            </div>
            {/* Mode toggle */}
            <div style={{display:"flex",gap:6,marginBottom:12,
              background:LGRAY,borderRadius:10,padding:4}}>
              {[{id:"player",label:"Choose Player"},{id:"name",label:"Add Your Name"}].map(m=>(
                <button key={m.id} onClick={()=>setCMode(m.id)} style={{
                  flex:1,padding:"9px 0",borderRadius:8,minHeight:40,
                  background:cMode===m.id?WHITE:"transparent",
                  border:cMode===m.id?"1.5px solid #ddd":"1.5px solid transparent",
                  color:cMode===m.id?NAVY:MGRAY,
                  fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:12,cursor:"pointer",WebkitTapHighlightColor:"transparent",
                  boxShadow:cMode===m.id?"0 1px 4px rgba(0,0,0,0.1)":"none",
                }}>{m.label}</button>
              ))}
            </div>

            {cMode==="player"?(
              <>
                <div style={{fontSize:10,color:MGRAY,fontWeight:700,marginBottom:6,
                  fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em"}}>
                  SELECT PLAYER
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,
                  maxHeight:200,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
                  {PLAYERS.map(p=>(
                    <div key={p.id} onClick={()=>setCPlayer(p.name)}
                      style={{display:"flex",alignItems:"center",gap:12,
                        padding:"8px 10px",borderRadius:8,cursor:"pointer",
                        border:`1.5px solid ${cPlayer===p.name?"#7c3aed":"#f0f0f0"}`,
                        background:cPlayer===p.name?"#f5f3ff":WHITE,
                        WebkitTapHighlightColor:"transparent"}}>
                      <div style={{width:32,height:32,borderRadius:8,
                        background:`linear-gradient(135deg,${NAVY},#1a3060)`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        flexShrink:0}}>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                          fontWeight:900,fontSize:11,color:GOLD}}>{p.num}</span>
                      </div>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                        fontWeight:700,fontSize:13,color:NAVY,flex:1}}>{p.name}</span>
                      {cPlayer===p.name&&<span style={{color:"#7c3aed",fontWeight:900}}>✓</span>}
                    </div>
                  ))}
                </div>
              </>
            ):(
              <>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:MGRAY,fontWeight:700,marginBottom:6,
                    fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em"}}>
                    YOUR NAME (max 12 chars)
                  </div>
                  <input placeholder="e.g. MOSWEU" value={cName}
                    onChange={e=>setCName(e.target.value.toUpperCase().slice(0,12))}
                    style={{width:"100%",padding:"11px 12px",borderRadius:8,
                      border:`1.5px solid ${cName?"#7c3aed":"#e5e7eb"}`,fontSize:15,
                      fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                      letterSpacing:"0.1em",outline:"none",boxSizing:"border-box"}}/>
                </div>
                <div>
                  <div style={{fontSize:10,color:MGRAY,fontWeight:700,marginBottom:6,
                    fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em"}}>
                    SQUAD NUMBER
                  </div>
                  <input placeholder="e.g. #9" value={cNum}
                    onChange={e=>setCNum(e.target.value.slice(0,4))}
                    style={{width:"100%",padding:"11px 12px",borderRadius:8,
                      border:`1.5px solid ${cNum?"#7c3aed":"#e5e7eb"}`,fontSize:20,
                      fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                      letterSpacing:"0.1em",outline:"none",boxSizing:"border-box",
                      textAlign:"center"}}/>
                </div>
              </>
            )}
          </div>

          {/* Price summary */}
          {kit&&(
            <div style={{background:LGRAY,borderRadius:10,padding:"12px 14px",
              marginBottom:14,display:"flex",justifyContent:"space-between",
              alignItems:"center"}}>
              <div>
                <div style={{fontSize:12,color:MGRAY}}>{kit.label} + personalisation</div>
                {totalDisc>0&&(
                  <div style={{fontSize:11,color:GREEN,fontWeight:700}}>
                    {totalDisc}% discount applied
                  </div>
                )}
              </div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:22,color:NAVY}}>P{finalPrice}</div>
            </div>
          )}

          {/* Add to cart */}
          <button onClick={doAdd}
            disabled={!cKit||!cSize}
            style={{width:"100%",padding:"16px",minHeight:54,
              background:!cKit||!cSize?"#e5e7eb":"#7c3aed",
              border:"none",borderRadius:12,
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,
              color:!cKit||!cSize?"#aaa":WHITE,
              cursor:!cKit||!cSize?"not-allowed":"pointer",
              WebkitTapHighlightColor:"transparent",
              boxShadow:!cKit||!cSize?"none":"0 4px 14px rgba(124,58,237,0.4)",
              transition:"all 0.15s",letterSpacing:"0.04em"}}>
            {added?"✓ ADDED TO CART!"
              :!cKit?"SELECT A KIT FIRST"
              :!cSize?"SELECT A SIZE"
              :`ADD TO CART — P${finalPrice}`}
          </button>
          <div style={{height:20}}/>
        </div>
      </div>
    )
  }

  /* ── CART VIEW ── */
  const CartView = () => (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:WHITE}}>
      {/* Header */}
      <div style={{background:NAVY,padding:"14px 16px",flexShrink:0,
        display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>setShopView("home")}
          style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,
            padding:"6px 12px",color:WHITE,fontSize:13,cursor:"pointer",
            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
            WebkitTapHighlightColor:"transparent"}}>← CONTINUE SHOPPING</button>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:16,color:WHITE}}>CART ({cartQty})</div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"12px 14px",
        WebkitOverflowScrolling:"touch",background:"#f5f6fa"}}>
        {cart.length===0?(
          <div style={{textAlign:"center",padding:"48px 20px"}}>
            <div style={{fontSize:52,marginBottom:12}}>🛒</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:20,color:NAVY,marginBottom:6}}>YOUR CART IS EMPTY</div>
            <div style={{fontSize:13,color:MGRAY,marginBottom:20}}>
              Add some items to get started
            </div>
            <button onClick={()=>setShopView("home")}
              style={{background:NAVY,border:"none",borderRadius:10,padding:"12px 24px",
                fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:14,
                color:WHITE,cursor:"pointer"}}>BROWSE STORE</button>
          </div>
        ):(
          <>
            {/* Member/promo savings banner */}
            {totalDisc>0&&(
              <div style={{background:`${GREEN}18`,border:`1px solid ${GREEN}44`,
                borderRadius:10,padding:"10px 14px",marginBottom:12,
                display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>🎉</span>
                <div style={{fontSize:12,color:GREEN,fontWeight:700}}>
                  You're saving P{savedTotal} on this order! ({totalDisc}% off)
                </div>
              </div>
            )}

            {/* Cart items */}
            {cart.map((item,i)=>(
              <div key={item.cartId} style={{background:WHITE,borderRadius:12,
                marginBottom:10,overflow:"hidden",
                boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
                <div style={{display:"flex",gap:12,padding:"12px 14px"}}>
                  <div style={{width:60,height:60,borderRadius:10,
                    background:`linear-gradient(135deg,${NAVY},#1a3060)`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:28,flexShrink:0}}>
                    {COLLECTIONS.find(c=>c.id===item.collection)?.emoji||"⚽"}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                      fontSize:14,color:NAVY,overflow:"hidden",textOverflow:"ellipsis",
                      whiteSpace:"nowrap"}}>{item.name}</div>
                    <div style={{fontSize:11,color:MGRAY,marginTop:2}}>
                      {item.variant} · {item.size} · {item.quality}
                      {item.player&&` · ${item.player}`}
                      {item.customName&&` · "${item.customName}"`}
                    </div>
                    <div style={{display:"flex",alignItems:"center",
                      justifyContent:"space-between",marginTop:6}}>
                      <div>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                          fontWeight:900,fontSize:16,color:NAVY}}>
                          P{discPrice(item.price)}
                        </span>
                        {item.price!==discPrice(item.price)&&(
                          <span style={{fontSize:10,color:MGRAY,
                            textDecoration:"line-through",marginLeft:5}}>
                            P{item.price}
                          </span>
                        )}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <button onClick={()=>setCart(prev=>prev.map((c,j)=>j===i?{...c,qty:Math.max(1,c.qty-1)}:c))}
                          style={{width:28,height:28,borderRadius:"50%",background:LGRAY,
                            border:"none",cursor:"pointer",fontSize:16,fontWeight:700,
                            display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
                        <span style={{fontWeight:700,fontSize:14,minWidth:16,textAlign:"center"}}>
                          {item.qty}
                        </span>
                        <button onClick={()=>setCart(prev=>prev.map((c,j)=>j===i?{...c,qty:c.qty+1}:c))}
                          style={{width:28,height:28,borderRadius:"50%",background:LGRAY,
                            border:"none",cursor:"pointer",fontSize:16,fontWeight:700,
                            display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                        <button onClick={()=>setCart(prev=>prev.filter((_,j)=>j!==i))}
                          style={{background:"#fef2f2",border:"none",borderRadius:6,
                            padding:"4px 8px",fontSize:11,color:RED,fontWeight:700,cursor:"pointer"}}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo code in cart */}
            <div style={{background:WHITE,borderRadius:12,padding:"12px 14px",
              marginBottom:10,boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:11,color:NAVY,letterSpacing:"0.08em",marginBottom:8}}>
                🎟 PROMO CODE
              </div>
              <div style={{display:"flex",gap:8}}>
                <input placeholder="Enter code" value={promoInput}
                  onChange={e=>setPromoInput(e.target.value.toUpperCase())}
                  style={{flex:1,padding:"9px 12px",borderRadius:8,
                    border:`1.5px solid ${promoMsg?.ok?GREEN:promoMsg?.ok===false?RED:"#ddd"}`,
                    fontSize:13,outline:"none",fontFamily:"'Barlow Condensed',sans-serif",
                    fontWeight:700,letterSpacing:"0.06em"}}/>
                <button onClick={applyPromo}
                  style={{background:NAVY,border:"none",borderRadius:8,padding:"9px 14px",
                    color:WHITE,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                    fontSize:12,cursor:"pointer",flexShrink:0}}>APPLY</button>
              </div>
              {promoMsg&&(
                <div style={{marginTop:6,fontSize:11,fontWeight:700,
                  color:promoMsg.ok?GREEN:RED}}>
                  {promoMsg.ok?"✓":"✗"} {promoMsg.text}
                </div>
              )}
            </div>

            {/* Order summary */}
            <div style={{background:WHITE,borderRadius:12,padding:"14px",
              boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:13,color:NAVY,marginBottom:10}}>ORDER SUMMARY</div>
              {[
                ["Subtotal",`P${cart.reduce((s,i)=>s+i.price*i.qty,0)}`],
                isMember?[`Member discount (-${memberDisc}%)`,`-P${Math.round(cart.reduce((s,i)=>s+i.price*memberDisc/100*i.qty,0))}`]:null,
                promoMsg?.ok?[`Promo ${promoCode} (-${promoDisc}%)`,`-P${Math.round(cart.reduce((s,i)=>s+i.price*promoDisc/100*i.qty,0))}`]:null,
                ["Delivery","To be confirmed"],
              ].filter(Boolean).map(([label,val],i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",
                  padding:"5px 0",borderBottom:"1px solid #f0f0f0",
                  fontSize:13,color:label.includes("discount")||label.includes("Promo")?GREEN:NAVY}}>
                  <span>{label}</span>
                  <span style={{fontWeight:label==="Delivery"?400:600}}>{val}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",
                padding:"10px 0 0",fontSize:16,fontWeight:900,color:NAVY,
                fontFamily:"'Barlow Condensed',sans-serif"}}>
                <span>TOTAL</span>
                <span>P{cartSubtotal}</span>
              </div>
              {savedTotal>0&&(
                <div style={{background:`${GREEN}18`,borderRadius:6,padding:"6px 10px",
                  marginTop:8,fontSize:11,color:GREEN,fontWeight:700,textAlign:"center"}}>
                  🎉 You saved P{savedTotal} on this order!
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {cart.length>0&&(
        <div style={{padding:"12px 14px",background:WHITE,
          borderTop:"1px solid #eee",flexShrink:0}}>
          <button onClick={()=>setShopView("checkout")}
            style={{width:"100%",padding:"16px",background:NAVY,border:"none",
              borderRadius:12,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:17,color:WHITE,cursor:"pointer",minHeight:54,
              boxShadow:"0 4px 14px rgba(13,27,62,0.3)",letterSpacing:"0.04em",
              WebkitTapHighlightColor:"transparent"}}>
            CHECKOUT — P{cartSubtotal} →
          </button>
          {!isMember&&(
            <div style={{textAlign:"center",fontSize:11,color:MGRAY,marginTop:8}}>
              🦡 <span onClick={openMembership}
                style={{color:NAVY,fontWeight:700,cursor:"pointer",textDecoration:"underline"}}>
                Join Honey Badger</span> to save 5% on this order
            </div>
          )}
        </div>
      )}
    </div>
  )

  /* ── CHECKOUT VIEW ── */
  const CheckoutView = () => {
    const [name,    setName]    = useState(profile?.full_name||"")
    const [email,   setEmail]   = useState(session?.user?.email||"")
    const [phone,   setPhone]   = useState("")
    const [address, setAddress] = useState("")
    const [err,     setErr]     = useState("")
    const [loading, setLoading] = useState(false)

    const PAY_METHODS = [
      {id:"orange",label:"Orange Money",icon:"🟠",desc:"Dial *145#"},
      {id:"myzaka", label:"MyZaka",      icon:"🔵",desc:"Dial *167#"},
      {id:"eft",    label:"Bank Transfer",icon:"🏦",desc:"FNB / BancABC"},
    ]

    const confirmOrder = async () => {
      if(!name||!email||!phone){setErr("Please fill in all fields.");return}
      if(!payMethod){setErr("Please select a payment method.");return}
      if(!payRef.trim()){setErr("Please enter your payment reference.");return}
      setLoading(true)
      try {
        await supabase.from("orders").insert({
          user_id:    session?.user?.id||null,
          email,
          full_name:  name,
          phone,
          address,
          items:      JSON.stringify(cart),
          subtotal:   cartSubtotal,
          discount:   savedTotal,
          total:      cartSubtotal,
          promo_code: promoCode||null,
          is_member:  isMember,
          pay_method: payMethod,
          pay_ref:    payRef,
          status:     "pending",
        })
        setCheckStep(3)
        setCart([])
      } catch(e){ setErr("Order failed. Please try again.") }
      setLoading(false)
    }

    if(checkStep===3) return (
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",padding:"32px 20px",textAlign:"center",background:WHITE}}>
        <div style={{fontSize:60,marginBottom:12}}>🎉</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:26,color:NAVY,marginBottom:8}}>ORDER PLACED!</div>
        <div style={{fontSize:13,color:MGRAY,lineHeight:1.7,marginBottom:24,maxWidth:300}}>
          Thank you! Your order has been received. We'll confirm once payment is verified.
          Delivery: 3–7 working days.
        </div>
        <div style={{background:LGRAY,borderRadius:12,padding:"14px 16px",
          marginBottom:20,width:"100%",maxWidth:320,textAlign:"left"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:12,color:NAVY,marginBottom:8}}>ORDER REFERENCE</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:18,color:GOLD2}}>{payRef.toUpperCase()}</div>
          <div style={{fontSize:11,color:MGRAY,marginTop:4}}>
            Keep this reference for tracking
          </div>
        </div>
        <button onClick={()=>{setShopView("home");setCheckStep(1);setPayMethod("");setPayRef("")}}
          style={{background:NAVY,border:"none",borderRadius:12,padding:"14px 32px",
            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,
            color:WHITE,cursor:"pointer"}}>BACK TO STORE</button>
      </div>
    )

    return (
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:NAVY,padding:"14px 16px",flexShrink:0,
          display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setShopView("cart")}
            style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,
              padding:"6px 12px",color:WHITE,fontSize:13,cursor:"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,flexShrink:0}}>
            ← BACK
          </button>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:16,color:WHITE}}>CHECKOUT</div>
          <div style={{marginLeft:"auto",fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:900,fontSize:16,color:GOLD}}>P{cartSubtotal}</div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"14px",
          background:"#f5f6fa",WebkitOverflowScrolling:"touch"}}>

          {/* Step indicators */}
          <div style={{display:"flex",gap:6,marginBottom:16,alignItems:"center",
            justifyContent:"center"}}>
            {["Details","Payment","Confirm"].map((s,i)=>(
              <div key={s} style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:24,height:24,borderRadius:"50%",
                  background:checkStep>i+1?GREEN:checkStep===i+1?NAVY:"#ddd",
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:10,fontWeight:900,color:WHITE}}>
                    {checkStep>i+1?"✓":i+1}
                  </span>
                </div>
                <span style={{fontSize:10,color:checkStep===i+1?NAVY:MGRAY,fontWeight:checkStep===i+1?700:400}}>
                  {s}
                </span>
                {i<2&&<div style={{width:16,height:2,background:checkStep>i+1?GREEN:"#ddd",borderRadius:1}}/>}
              </div>
            ))}
          </div>

          {/* Step 1 — Details */}
          {checkStep===1&&(
            <div style={{background:WHITE,borderRadius:12,padding:"14px",
              boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:13,color:NAVY,marginBottom:12}}>DELIVERY DETAILS</div>
              {[
                {label:"FULL NAME",val:name,set:setName,type:"text",ph:"Your full name"},
                {label:"EMAIL",val:email,set:setEmail,type:"email",ph:"your@email.com"},
                {label:"PHONE",val:phone,set:setPhone,type:"tel",ph:"+267 7X XXX XXX"},
                {label:"DELIVERY ADDRESS",val:address,set:setAddress,type:"text",ph:"Village / Town / Street"},
              ].map(f=>(
                <div key={f.label} style={{marginBottom:12}}>
                  <label style={{fontSize:10,fontWeight:700,color:MGRAY,
                    fontFamily:"'Barlow Condensed',sans-serif",display:"block",
                    marginBottom:4,letterSpacing:"0.06em"}}>{f.label}</label>
                  <input type={f.type} value={f.val} placeholder={f.ph}
                    onChange={e=>f.set(e.target.value)}
                    style={{width:"100%",padding:"11px 12px",borderRadius:8,
                      border:"1.5px solid #e5e7eb",fontSize:14,outline:"none",
                      boxSizing:"border-box",fontFamily:"inherit"}}
                    onFocus={e=>e.target.style.borderColor=GOLD}
                    onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
                </div>
              ))}

              {/* Order summary mini */}
              <div style={{background:LGRAY,borderRadius:8,padding:"10px 12px",marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",
                  fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,color:NAVY}}>
                  <span>{cartQty} item{cartQty!==1?"s":""}</span>
                  <span>P{cartSubtotal}</span>
                </div>
                {savedTotal>0&&(
                  <div style={{fontSize:11,color:GREEN,fontWeight:700,marginTop:4}}>
                    You save P{savedTotal}!
                  </div>
                )}
              </div>

              {err&&<div style={{color:RED,fontSize:12,marginBottom:10,fontWeight:600}}>{err}</div>}
              <button onClick={()=>{
                if(!name||!email||!phone){setErr("Please fill in all required fields.");return}
                setErr("");setCheckStep(2)
              }}
                style={{width:"100%",padding:"14px",background:NAVY,border:"none",
                  borderRadius:10,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:15,color:WHITE,cursor:"pointer",minHeight:50}}>
                CONTINUE TO PAYMENT →
              </button>
            </div>
          )}

          {/* Step 2 — Payment */}
          {checkStep===2&&(
            <div>
              <div style={{background:WHITE,borderRadius:12,padding:"14px",
                marginBottom:10,boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:13,color:NAVY,marginBottom:12}}>PAYMENT METHOD</div>
                {PAY_METHODS.map(m=>(
                  <div key={m.id} onClick={()=>setPayMethod(m.id)}
                    style={{padding:"12px 14px",borderRadius:10,cursor:"pointer",
                      border:`2px solid ${payMethod===m.id?NAVY:"#e5e7eb"}`,
                      background:payMethod===m.id?"#eef1f8":WHITE,
                      display:"flex",alignItems:"center",gap:12,marginBottom:8,
                      WebkitTapHighlightColor:"transparent"}}>
                    <span style={{fontSize:22}}>{m.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                        fontSize:15,color:NAVY}}>{m.label}</div>
                      <div style={{fontSize:11,color:MGRAY}}>{m.desc}</div>
                    </div>
                    <div style={{width:20,height:20,borderRadius:"50%",
                      border:`2px solid ${payMethod===m.id?NAVY:"#ddd"}`,
                      background:payMethod===m.id?NAVY:"none",
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {payMethod===m.id&&<span style={{color:WHITE,fontSize:10}}>✓</span>}
                    </div>
                  </div>
                ))}
              </div>

              {payMethod&&(
                <div style={{background:WHITE,borderRadius:12,padding:"14px",
                  marginBottom:10,boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
                  {/* Amount box */}
                  <div style={{background:NAVY,borderRadius:10,padding:"14px",
                    textAlign:"center",marginBottom:14}}>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",
                      fontFamily:"'Barlow Condensed',sans-serif",marginBottom:4}}>
                      AMOUNT DUE
                    </div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                      fontSize:36,color:GOLD}}>P{cartSubtotal}</div>
                    {savedTotal>0&&<div style={{fontSize:11,color:GREEN,marginTop:4}}>
                      Saved P{savedTotal}
                    </div>}
                  </div>

                  {/* Instructions */}
                  <div style={{background:`${GOLD}18`,border:`1px solid ${GOLD}44`,
                    borderRadius:8,padding:"10px 12px",marginBottom:12}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                      fontSize:11,color:GOLD2,marginBottom:6}}>HOW TO PAY</div>
                    {payMethod==="orange"&&<div style={{fontSize:12,color:NAVY,lineHeight:1.7}}>
                      1. Dial <strong>*145#</strong> on your phone<br/>
                      2. Send <strong>P{cartSubtotal}</strong> to <strong>74000001</strong><br/>
                      3. Reference: <strong>VILLAREAL-ORDER</strong>
                    </div>}
                    {payMethod==="myzaka"&&<div style={{fontSize:12,color:NAVY,lineHeight:1.7}}>
                      1. Open MyZaka or dial <strong>*167#</strong><br/>
                      2. Send <strong>P{cartSubtotal}</strong> to <strong>74000001</strong><br/>
                      3. Reference: <strong>VILLAREAL-ORDER</strong>
                    </div>}
                    {payMethod==="eft"&&<div style={{fontSize:12,color:NAVY,lineHeight:1.7}}>
                      Bank: <strong>FNB Botswana</strong><br/>
                      Account: <strong>62012345678</strong><br/>
                      Branch: <strong>282672</strong><br/>
                      Amount: <strong>P{cartSubtotal}</strong><br/>
                      Reference: <strong>your email address</strong>
                    </div>}
                  </div>

                  <label style={{fontSize:10,fontWeight:700,color:MGRAY,
                    fontFamily:"'Barlow Condensed',sans-serif",display:"block",
                    marginBottom:4,letterSpacing:"0.06em"}}>
                    PAYMENT REFERENCE / CONFIRMATION NUMBER
                  </label>
                  <input placeholder="e.g. TXN123456789" value={payRef}
                    onChange={e=>setPayRef(e.target.value)}
                    style={{width:"100%",padding:"12px",borderRadius:8,
                      border:`1.5px solid ${payRef?GOLD:"#e5e7eb"}`,fontSize:14,
                      outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
                  <div style={{fontSize:10,color:MGRAY,marginTop:4}}>
                    Enter the transaction reference from your payment confirmation
                  </div>
                </div>
              )}

              {err&&<div style={{color:RED,fontSize:12,marginBottom:10,fontWeight:600}}>{err}</div>}

              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>{setErr("");setCheckStep(1)}}
                  style={{flex:1,padding:"13px",background:"#f0f0f0",border:"none",
                    borderRadius:10,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                    fontSize:14,color:NAVY,cursor:"pointer",minHeight:48}}>
                  ← BACK
                </button>
                <button onClick={confirmOrder} disabled={loading||!payMethod||!payRef}
                  style={{flex:2,padding:"13px",
                    background:loading||!payMethod||!payRef?"#e5e7eb":GREEN,
                    border:"none",borderRadius:10,
                    fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                    fontSize:14,color:loading||!payMethod||!payRef?"#aaa":WHITE,
                    cursor:loading||!payMethod||!payRef?"not-allowed":"pointer",
                    minHeight:48}}>
                  {loading?"PROCESSING...":"CONFIRM ORDER ✓"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ── TICKETS TAB ── */
  const TicketsTab=()=>(
    <div style={{overflowY:"auto",flex:1,padding:12,WebkitOverflowScrolling:"touch",
      background:"#f5f6fa"}}>
      {fixtures.filter(f=>!f.result).length===0&&(
        <div style={{textAlign:"center",padding:"40px 20px",color:MGRAY,fontSize:13}}>
          No upcoming fixtures.
        </div>
      )}
      {fixtures.filter(f=>!f.result).map(fx=>(
        <div key={fx.id} style={{borderRadius:12,overflow:"hidden",marginBottom:10,
          boxShadow:"0 1px 6px rgba(0,0,0,0.08)",background:WHITE}}>
          <div style={{background:NAVY,padding:"8px 14px",display:"flex",
            justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
              fontSize:13,color:GOLD}}>
              {new Date(fx.match_date).toLocaleDateString("en-GB",
                {day:"numeric",month:"short",year:"numeric"}).toUpperCase()}
            </span>
            <span style={{background:fx.venue==="HOME"?GREEN:RED,color:WHITE,
              fontSize:9,fontWeight:900,padding:"2px 7px",borderRadius:4,
              fontFamily:"'Barlow Condensed',sans-serif"}}>{fx.venue}</span>
          </div>
          <div style={{padding:"12px 14px",display:"flex",
            alignItems:"center",justifyContent:"space-between",gap:8}}>
            <div style={{minWidth:0}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:15,color:NAVY,overflow:"hidden",textOverflow:"ellipsis",
                whiteSpace:"nowrap"}}>VILLAREAL FC vs {fx.opponent}</div>
              <div style={{fontSize:11,color:MGRAY,marginTop:2}}>{fx.competition}</div>
            </div>
            <button style={{background:GOLD,border:"none",borderRadius:8,
              padding:"9px 16px",fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:800,fontSize:13,color:NAVY,cursor:"pointer",
              flexShrink:0,minHeight:40}}>
              {fx.venue==="HOME"?`BUY P25${isMember?" (P24)":""}`:  "AWAY"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  /* ── MEMBERSHIP TAB ── */
  const MembershipTab=()=>{
    const [billing,setBilling]=useState("yearly")
    const isYearly=billing==="yearly"
    return (
      <div style={{overflowY:"auto",flex:1,WebkitOverflowScrolling:"touch"}}>
        <div style={{background:`linear-gradient(160deg,${NAVY},#0a1428)`,
          padding:"clamp(18px,5vw,28px) clamp(14px,4vw,20px)",position:"relative",overflow:"hidden"}}>
          <div style={{opacity:0.07,position:"absolute",right:-20,top:-20}}><Logo size={180}/></div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:"clamp(26px,8vw,40px)",color:WHITE,lineHeight:1}}>THE HONEY BADGER</div>
          <div style={{fontSize:12,color:"#aaa",marginBottom:16,marginTop:4}}>
            Villareal FC Premium Membership
          </div>
          <div style={{display:"flex",background:"rgba(255,255,255,0.1)",borderRadius:10,
            padding:3,marginBottom:16}}>
            {["monthly","yearly"].map(b=>(
              <button key={b} onClick={()=>setBilling(b)} style={{
                flex:1,padding:"9px 0",minHeight:42,
                background:billing===b?WHITE:"none",border:"none",borderRadius:8,
                cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:"clamp(11px,3vw,13px)",color:billing===b?NAVY:"#aaa",
                display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                WebkitTapHighlightColor:"transparent"}}>
                {b.toUpperCase()}
                {b==="yearly"&&<span style={{background:GREEN,color:WHITE,fontSize:9,
                  fontWeight:900,padding:"1px 5px",borderRadius:3}}>SAVE 17%</span>}
              </button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:"clamp(36px,10vw,48px)",color:GOLD}}>P{isYearly?200:20}</span>
            <span style={{color:"#aaa",fontSize:14}}>{isYearly?"/ Year":"/ Month"}</span>
          </div>
          <div style={{fontSize:12,color:"#888",marginBottom:18}}>
            {isYearly?"P20/month equivalent · Save P40 vs monthly":"Or P200/year and save 17%"}
          </div>
          {["Early access to match tickets","10% off match-day tickets",
            "5% off official store","Exclusive member kit number",
            "Priority squad updates","Exclusive promo codes"].map((b,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
              <span style={{color:GOLD,fontSize:16,flexShrink:0}}>✔</span>
              <span style={{color:WHITE,fontSize:"clamp(12px,3.5vw,14px)",
                fontFamily:"'Barlow Condensed',sans-serif",fontWeight:600}}>{b}</span>
            </div>
          ))}
          <div style={{marginTop:22}}>
            <button onClick={openMembership}
              style={{width:"100%",padding:"14px",background:GOLD,border:"none",
                borderRadius:8,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:16,color:NAVY,cursor:"pointer",minHeight:50,
                WebkitTapHighlightColor:"transparent"}}>
              JOIN THE HONEY BADGERS →
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── CUSTOMIZE VIEW — dedicated jersey customizer ── */
  /* ── ROOT RENDER ── */
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:WHITE,
      overflow:"hidden",position:"relative"}}>

      {/* Tab bar */}
      {(["home","collection","product","customize","tickets","membership"].includes(shopView))&&(
        <div style={{display:"flex",borderBottom:`1px solid #eee`,
          padding:"0 14px",gap:14,overflowX:"auto",flexShrink:0,
          alignItems:"center",background:WHITE,zIndex:10}}>
          {["shop","tickets","membership"].map(t=>(
            <button key={t} onClick={()=>{setSubTab(t);if(t==="shop")setShopView("home");else setShopView(t)}} style={{
              background:"none",border:"none",cursor:"pointer",padding:"12px 0 10px",
              fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(11px,3vw,13px)",
              fontWeight:700,color:subTab===t?NAVY:MGRAY,letterSpacing:"0.05em",
              borderBottom:subTab===t?`2.5px solid ${NAVY}`:"2.5px solid transparent",
              textTransform:"uppercase",WebkitTapHighlightColor:"transparent",
              whiteSpace:"nowrap",
            }}>{t}</button>
          ))}
          {/* Cart icon */}
          <button onClick={()=>setShopView("cart")}
            style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",
              position:"relative",padding:"8px 0",flexShrink:0,
              WebkitTapHighlightColor:"transparent"}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartQty>0&&(
              <div style={{position:"absolute",top:2,right:-4,background:RED,color:WHITE,
                borderRadius:"50%",width:17,height:17,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:9,fontWeight:900}}>{cartQty}</div>
            )}
          </button>
        </div>
      )}

      {/* Views — HomeView always mounted to preserve scroll position */}
      <div style={{flex:1,display:shopView==="home"?"flex":"none",flexDirection:"column",overflow:"hidden"}}>
        <HomeView/>
      </div>
      {shopView==="collection"  && <CollectionView/>}
      {shopView==="product"     && <ProductView/>}
      {shopView==="customize"   && <CustomizeView/>}
      {shopView==="cart"        && <CartView/>}
      {shopView==="checkout"    && <CheckoutView/>}
      {subTab==="tickets"    && shopView==="tickets"    && <TicketsTab/>}
      {subTab==="membership" && shopView==="membership" && <MembershipTab/>}
    </div>
  )
}




export default StoreScreen
