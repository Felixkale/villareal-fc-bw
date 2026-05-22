import React, { useState, useEffect, useRef } from "react"
import { supabase } from "./supabaseClient"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY, Logo, Btn } from "./constants"

/* ══════════════════════════════════════════════════════════════════════════════
   STATUS BAR — real time, network, battery
══════════════════════════════════════════════════════════════════════════════ */
const StatusBar = ({ dark }) => {
  const [time,    setTime]    = useState("")
  const [battery, setBattery] = useState(null)   // { level, charging }
  const [network, setNetwork] = useState("WIFI")  // WIFI | 4G | 3G | 2G | offline

  // Real clock
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const h = now.getHours().toString().padStart(2,"0")
      const m = now.getMinutes().toString().padStart(2,"0")
      setTime(`${h}:${m}`)
    }
    tick()
    const id = setInterval(tick, 10000) // update every 10s
    return () => clearInterval(id)
  }, [])

  // Real battery (supported in Chrome/Android)
  useEffect(() => {
    if (navigator.getBattery) {
      navigator.getBattery().then(bat => {
        const update = () => setBattery({
          level: Math.round(bat.level * 100),
          charging: bat.charging,
        })
        update()
        bat.addEventListener("levelchange",   update)
        bat.addEventListener("chargingchange", update)
        return () => {
          bat.removeEventListener("levelchange",   update)
          bat.removeEventListener("chargingchange", update)
        }
      }).catch(() => setBattery(null))
    }
  }, [])

  // Real network type
  useEffect(() => {
    const detect = () => {
      if (!navigator.onLine) { setNetwork("OFFLINE"); return }
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (!conn) {
        // Fallback — check if page loaded via localhost or https (likely wifi)
        setNetwork("WIFI")
        return
      }
      const type = conn.type || ""
      const eff  = conn.effectiveType || ""
      if (type === "wifi" || type === "ethernet") {
        setNetwork("WIFI")
      } else if (eff === "4g") {
        setNetwork("4G")
      } else if (eff === "3g") {
        setNetwork("3G")
      } else if (eff === "2g" || eff === "slow-2g") {
        setNetwork("2G")
      } else {
        setNetwork("WIFI")
      }
    }
    detect()
    window.addEventListener("online",  detect)
    window.addEventListener("offline", detect)
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (conn) conn.addEventListener("change", detect)
    return () => {
      window.removeEventListener("online",  detect)
      window.removeEventListener("offline", detect)
      if (conn) conn.removeEventListener("change", detect)
    }
  }, [])

  const textColor = dark ? WHITE : NAVY
  const bgColor   = dark ? "#000" : WHITE

  // Battery icon
  const BatteryIcon = () => {
    if (!battery) return null
    const pct   = battery.level
    const color = pct <= 20 ? RED : pct <= 50 ? "#f39c12" : GREEN
    const width = Math.max(2, Math.round(pct / 100 * 16))
    return (
      <div style={{display:"flex",alignItems:"center",gap:2}}>
        {battery.charging && (
          <span style={{fontSize:9,color:GREEN}}>⚡</span>
        )}
        <div style={{width:20,height:10,borderRadius:2,
          border:`1.5px solid ${textColor}`,position:"relative",
          display:"flex",alignItems:"center",paddingLeft:1}}>
          <div style={{width:width,height:6,borderRadius:1,background:color}}/>
          {/* Battery tip */}
          <div style={{position:"absolute",right:-3,top:"50%",
            transform:"translateY(-50%)",width:2,height:5,
            background:textColor,borderRadius:"0 1px 1px 0"}}/>
        </div>
        <span style={{fontSize:9,fontWeight:700,color:textColor}}>{pct}%</span>
      </div>
    )
  }

  // Network icon
  const NetworkIcon = () => {
    if (network === "WIFI") return (
      <svg width="14" height="12" viewBox="0 0 24 20" fill={textColor}>
        <path d="M1 7.5C5.5 3 10.5 1 12 1s6.5 2 11 6.5" stroke={textColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M4.5 11.5C7 9 10 8 12 8s5 1 7.5 3.5" stroke={textColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M8 15.5C9.5 14 11 13.5 12 13.5s2.5.5 4 2" stroke={textColor} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="12" cy="19" r="1.5" fill={textColor}/>
      </svg>
    )
    if (network === "OFFLINE") return (
      <span style={{fontSize:10,color:RED,fontWeight:700}}>✕</span>
    )
    // 4G / 3G / 2G bars
    const bars = network === "4G" ? 4 : network === "3G" ? 3 : 2
    return (
      <div style={{display:"flex",alignItems:"flex-end",gap:1.5}}>
        {[1,2,3,4].map(b=>(
          <div key={b} style={{
            width:3,borderRadius:1,
            height:3+b*2,
            background:b<=bars?textColor:`${textColor}40`,
          }}/>
        ))}
        <span style={{fontSize:9,fontWeight:700,color:textColor,marginLeft:2}}>{network}</span>
      </div>
    )
  }

  return (
    <div style={{
      background:bgColor,
      padding:"8px 16px 6px",
      display:"flex",justifyContent:"space-between",alignItems:"center",
      flexShrink:0,
    }}>
      <span style={{fontSize:13,fontWeight:700,color:textColor,
        fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.02em"}}>
        {time}
      </span>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <NetworkIcon/>
        <BatteryIcon/>
      </div>
    </div>
  )
}




export default StatusBar
