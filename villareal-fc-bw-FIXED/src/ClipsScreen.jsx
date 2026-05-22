import React, { useState, useEffect, useRef } from "react"
import { supabase } from "./supabaseClient"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY, Logo, Btn } from "./constants"

/* ══════════════════════════════════════════════════════════════════════════════
   CLIPS
══════════════════════════════════════════════════════════════════════════════ */
const CLIPS_DATA = [
  {
    id:1, player:"KGOPOTSO NTSHELE", num:"#9",
    tag:"GOAL ⚽", desc:"Stunning header vs Stone Breakers! 🦡🔥 #BRFA #TheHoneyBadgers #Villareal",
    likes:4300, comments:187, shares:1200,
    bg:"linear-gradient(180deg,#0a1428 0%,#0D1B3E 40%,#1a3060 100%)",
    accent:"#F5C518",
  },
  {
    id:2, player:"OABILE TSHOSA", num:"#10",
    tag:"ASSIST 🎯", desc:"Vision of a true playmaker 👏 #MidfielderOfTheSeason #HoneyBadgers",
    likes:3100, comments:94, shares:890,
    bg:"linear-gradient(180deg,#0a1a0a 0%,#0d2a18 40%,#1a4a2a 100%)",
    accent:"#27AE60",
  },
  {
    id:3, player:"NEO MOSEKI", num:"#11",
    tag:"SKILL 🔥", desc:"No one can stop him on the wing 💨 #Speedy #Villareal #BRFA",
    likes:2700, comments:63, shares:650,
    bg:"linear-gradient(180deg,#1a0a00 0%,#2a1200 40%,#3a1a00 100%)",
    accent:"#F5C518",
  },
  {
    id:4, player:"LEFIKA DITLHARE", num:"#17",
    tag:"GOAL ⚽", desc:"Long range rocket! The crowd goes wild 🚀 #TopBin #HoneyBadgers",
    likes:1900, comments:41, shares:430,
    bg:"linear-gradient(180deg,#1a001a 0%,#2a0a2a 40%,#1a0830 100%)",
    accent:"#a78bfa",
  },
]

const ClipsScreen = () => {
  const [liked,      setLiked]      = useState({})
  const [clipsTab,   setClipsTab]   = useState("foryou")
  const [visibleIdx, setVisibleIdx] = useState(0)
  const containerRef = useRef(null)
  const clipRefs     = useRef([])

  // Track which clip is visible using IntersectionObserver
  useEffect(() => {
    const observers = []
    clipRefs.current.forEach((el, i) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setVisibleIdx(i) },
        { threshold: 0.6 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const toggleLike = (id) =>
    setLiked(prev => ({ ...prev, [id]: !prev[id] }))

  const fmtNum = (n) =>
    n >= 1000 ? (n/1000).toFixed(1).replace(/\.0$/,"") + "k" : n

  return (
    <div style={{
      flex:1, display:"flex", flexDirection:"column",
      background:"#000", overflow:"hidden", position:"relative",
    }}>
      {/* ── TOP NAV ── */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, zIndex:30,
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"10px 0 8px",
        background:"linear-gradient(to bottom,rgba(0,0,0,0.7) 0%,transparent 100%)",
        pointerEvents:"none",
      }}>
        <div style={{display:"flex",gap:24,pointerEvents:"auto"}}>
          {["following","foryou"].map(tab => (
            <button key={tab} onClick={() => setClipsTab(tab)}
              style={{
                background:"none", border:"none", cursor:"pointer",
                fontFamily:"'Barlow Condensed',sans-serif",
                fontWeight:900, fontSize:"clamp(13px,4vw,16px)",
                color: clipsTab===tab ? WHITE : "rgba(255,255,255,0.45)",
                letterSpacing:"0.06em", textTransform:"uppercase",
                padding:"4px 0",
                borderBottom: clipsTab===tab ? `2.5px solid ${GOLD}` : "2.5px solid transparent",
                WebkitTapHighlightColor:"transparent",
              }}>
              {tab === "foryou" ? "FOR YOU" : "FOLLOWING"}
            </button>
          ))}
        </div>
      </div>

      {/* ── SCROLL CONTAINER ── */}
      <div
        ref={containerRef}
        style={{
          flex:1,
          overflowY:"scroll",
          scrollSnapType:"y mandatory",
          WebkitOverflowScrolling:"touch",
          scrollbarWidth:"none",
          msOverflowStyle:"none",
          display:"flex",
          flexDirection:"column",
        }}>

        {CLIPS_DATA.map((clip, i) => {
          const isLiked  = !!liked[clip.id]
          const likesCnt = fmtNum(clip.likes + (isLiked ? 1 : 0))
          const initials = clip.player.split(" ").map(w=>w[0]).join("").slice(0,2)

          return (
            <div
              key={clip.id}
              ref={el => clipRefs.current[i] = el}
              style={{
                height:"var(--clip-h,100vh)",
                minHeight:"var(--clip-h,100vh)",
                flexShrink:0,
                scrollSnapAlign:"start",
                scrollSnapStop:"always",
                position:"relative",
                background: clip.bg,
                display:"flex",
                flexDirection:"column",
                overflow:"hidden",
              }}>

              {/* BG watermark */}
              <div style={{
                position:"absolute", inset:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                opacity:0.04, pointerEvents:"none",
              }}>
                <Logo size={"clamp(220px,65vw,320px)"}/>
              </div>

              {/* Centre content */}
              <div style={{
                flex:1,
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                justifyContent:"center",
                padding:"clamp(60px,15vw,80px) clamp(60px,18vw,90px) clamp(100px,20vw,130px)",
              }}>
                {/* Tag */}
                <div style={{
                  background: clip.accent, color:NAVY,
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:900, fontSize:"clamp(11px,3vw,14px)",
                  letterSpacing:"0.12em", padding:"5px 16px",
                  borderRadius:20, marginBottom:"clamp(14px,4vw,20px)",
                }}>
                  {clip.tag}
                </div>

                {/* Logo */}
                <Logo size={"clamp(72px,20vw,100px)"}/>

                {/* Player name */}
                <div style={{
                  marginTop:"clamp(12px,3vw,18px)",
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:900,
                  fontSize:"clamp(26px,8vw,40px)",
                  color: clip.accent,
                  letterSpacing:"0.06em",
                  textAlign:"center",
                  lineHeight:1,
                  textShadow:"0 2px 24px rgba(0,0,0,0.7)",
                }}>
                  {clip.player.split(" ").map((w,wi) => (
                    <div key={wi}>{w}</div>
                  ))}
                </div>

                <div style={{
                  color:"rgba(255,255,255,0.7)",
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:700,
                  fontSize:"clamp(15px,4.5vw,20px)",
                  marginTop:4, letterSpacing:"0.04em",
                }}>
                  {clip.num}
                </div>

                {/* Progress dots */}
                <div style={{display:"flex",gap:6,marginTop:"clamp(16px,4vw,24px)"}}>
                  {CLIPS_DATA.map((_,di) => (
                    <div key={di} style={{
                      width: di===i ? "clamp(16px,5vw,22px)" : "clamp(5px,1.5vw,7px)",
                      height:"clamp(5px,1.5vw,7px)",
                      borderRadius:4,
                      background: di===i ? clip.accent : "rgba(255,255,255,0.25)",
                      transition:"width 0.25s",
                    }}/>
                  ))}
                </div>
              </div>

              {/* ── BOTTOM OVERLAY ── */}
              <div style={{
                position:"absolute", bottom:0, left:0, right:0,
                background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.3) 60%,transparent 100%)",
                padding:"clamp(14px,4vw,20px) clamp(12px,4vw,16px)",
                display:"flex", alignItems:"flex-end", justifyContent:"space-between",
                gap:12,
              }}>

                {/* Left — user info + caption */}
                <div style={{flex:1, minWidth:0}}>
                  {/* User row */}
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <div style={{
                      width:"clamp(32px,8vw,40px)", height:"clamp(32px,8vw,40px)",
                      borderRadius:"50%", border:`2px solid ${clip.accent}`,
                      background:NAVY, flexShrink:0,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      overflow:"hidden",
                    }}>
                      <span style={{
                        fontFamily:"'Barlow Condensed',sans-serif",
                        fontWeight:900,
                        fontSize:"clamp(10px,3vw,13px)",
                        color:clip.accent,
                      }}>{initials}</span>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{
                        fontFamily:"'Barlow Condensed',sans-serif",
                        fontWeight:800,
                        fontSize:"clamp(12px,3.5vw,15px)",
                        color:WHITE,lineHeight:1,
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                      }}>
                        @{clip.player.replace(/ /g,"_").toLowerCase()}
                      </div>
                      <div style={{
                        fontSize:"clamp(9px,2.5vw,11px)",
                        color:"rgba(255,255,255,0.55)",marginTop:2,
                      }}>
                        Villareal FC · {clip.num}
                      </div>
                    </div>
                    <button style={{
                      background:clip.accent, border:"none",
                      borderRadius:6, padding:"5px 10px",
                      fontFamily:"'Barlow Condensed',sans-serif",
                      fontWeight:900, fontSize:"clamp(9px,2.5vw,11px)",
                      color:NAVY, cursor:"pointer", flexShrink:0,
                      WebkitTapHighlightColor:"transparent",
                    }}>
                      + FOLLOW
                    </button>
                  </div>

                  {/* Caption */}
                  <div style={{
                    fontSize:"clamp(11px,3vw,13px)",
                    color:"rgba(255,255,255,0.8)",
                    lineHeight:1.5,
                    display:"-webkit-box",
                    WebkitLineClamp:2,
                    WebkitBoxOrient:"vertical",
                    overflow:"hidden",
                  }}>
                    {clip.desc}
                  </div>

                  {/* Music bar */}
                  <div style={{
                    display:"flex", alignItems:"center", gap:6, marginTop:8,
                  }}>
                    <span style={{fontSize:"clamp(10px,2.5vw,12px)"}}>🎵</span>
                    <div style={{
                      fontSize:"clamp(9px,2.5vw,11px)",
                      color:"rgba(255,255,255,0.55)",
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                    }}>
                      Villareal FC Official · Match Highlights
                    </div>
                  </div>
                </div>

                {/* Right — action buttons */}
                <div style={{
                  display:"flex", flexDirection:"column",
                  alignItems:"center", gap:"clamp(14px,4vw,20px)",
                  flexShrink:0, paddingBottom:"clamp(4px,1vw,8px)",
                }}>
                  {/* Like */}
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                    <button
                      onClick={() => toggleLike(clip.id)}
                      style={{
                        background:"rgba(255,255,255,0.12)",
                        border:"none", borderRadius:"50%",
                        width:"clamp(44px,11vw,54px)",
                        height:"clamp(44px,11vw,54px)",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        cursor:"pointer", WebkitTapHighlightColor:"transparent",
                        transition:"transform 0.15s",
                        transform: isLiked ? "scale(1.15)" : "scale(1)",
                      }}>
                      <span style={{
                        fontSize:"clamp(20px,5.5vw,26px)",
                        filter: isLiked ? "drop-shadow(0 0 8px rgba(255,60,60,0.9))" : "none",
                      }}>
                        {isLiked ? "❤️" : "🤍"}
                      </span>
                    </button>
                    <span style={{
                      color:WHITE,
                      fontSize:"clamp(10px,2.5vw,12px)",
                      fontWeight:700,
                    }}>{likesCnt}</span>
                  </div>

                  {/* Comment */}
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                    <button style={{
                      background:"rgba(255,255,255,0.12)",
                      border:"none", borderRadius:"50%",
                      width:"clamp(44px,11vw,54px)",
                      height:"clamp(44px,11vw,54px)",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      cursor:"pointer", WebkitTapHighlightColor:"transparent",
                    }}>
                      <span style={{fontSize:"clamp(18px,5vw,24px)"}}>💬</span>
                    </button>
                    <span style={{
                      color:WHITE,
                      fontSize:"clamp(10px,2.5vw,12px)",
                      fontWeight:700,
                    }}>{fmtNum(clip.comments)}</span>
                  </div>

                  {/* Share */}
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                    <button style={{
                      background:"rgba(255,255,255,0.12)",
                      border:"none", borderRadius:"50%",
                      width:"clamp(44px,11vw,54px)",
                      height:"clamp(44px,11vw,54px)",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      cursor:"pointer", WebkitTapHighlightColor:"transparent",
                    }}>
                      <span style={{fontSize:"clamp(18px,5vw,24px)"}}>↗</span>
                    </button>
                    <span style={{
                      color:WHITE,
                      fontSize:"clamp(10px,2.5vw,12px)",
                      fontWeight:700,
                    }}>{fmtNum(clip.shares)}</span>
                  </div>

                  {/* Spinning record */}
                  <div style={{
                    width:"clamp(36px,9vw,44px)",
                    height:"clamp(36px,9vw,44px)",
                    borderRadius:"50%",
                    background:`conic-gradient(${clip.accent},${NAVY},${clip.accent})`,
                    border:`2px solid rgba(255,255,255,0.3)`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    animation:"spin 4s linear infinite",
                  }}>
                    <div style={{
                      width:"40%",height:"40%",borderRadius:"50%",
                      background:"#111",
                    }}/>
                  </div>
                </div>
              </div>

              {/* Scroll hint — only on first clip */}
              {i===0&&(
                <div style={{
                  position:"absolute",bottom:"clamp(100px,22vw,130px)",
                  left:"50%",transform:"translateX(-50%)",
                  display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                  opacity:0.5, pointerEvents:"none",
                }}>
                  <span style={{color:WHITE,fontSize:"clamp(9px,2.5vw,11px)"}}>scroll for next</span>
                  <span style={{color:WHITE,fontSize:16}}>↕</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CSS for spin animation */}
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        div::-webkit-scrollbar { display:none }
      `}</style>
    </div>
  )
}




export default ClipsScreen
