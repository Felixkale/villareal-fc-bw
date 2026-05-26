import React, { useState, useEffect, useRef } from "react"
import { supabase } from "./supabaseClient"
import DonateModal from "./DonateModal"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, LGRAY, Logo } from "./constants"

// Keep your existing image imports exactly as they are
// (STARS_LOGO, GB_LOGO, PHOTO_GK, etc. — don't remove them)

const ForYouScreen = ({ session, openMembership, setActiveTab }) => {
  const [news,       setNews]       = useState([])
  const [nextMatch,  setNextMatch]  = useState(null)   // live from fixtures
  const [results,    setResults]    = useState([])     // live from results
  const [countdown,  setCountdown]  = useState(null)
  const [showDonate, setShowDonate] = useState(false)
  const [storyIdx,   setStoryIdx]   = useState(null)
  const [storyProg,  setStoryProg]  = useState(0)
  const storyTimer = useRef(null)

  // ── Fetch all live data ─────────────────────────────────────
  useEffect(() => {
    // Next match — soonest upcoming fixture
    supabase.from("fixtures").select("*")
      .order("match_date", { ascending: true })
      .limit(1)
      .single()
      .then(({ data }) => { if (data) setNextMatch(data) })

    // Recent results — last 6 for story bubbles
    supabase.from("results").select("*")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => { if (data) setResults(data) })

    // News feed
    supabase.from("news").select("*")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => { if (data) setNews(data) })
  }, [])

  // ── Countdown timer ────────────────────────────────────────
  useEffect(() => {
    if (!nextMatch) return
    const tick = () => {
      try {
        const matchTime = new Date(`${nextMatch.match_date}T${nextMatch.match_time || "13:00"}`)
        const diff = matchTime - new Date()
        if (diff <= 0) { setCountdown(null); return }
        setCountdown({
          d: Math.floor(diff / 86400000),
          h: Math.floor((diff % 86400000) / 3600000),
          m: Math.floor((diff % 3600000) / 60000),
          s: Math.floor((diff % 60000) / 1000),
        })
      } catch { setCountdown(null) }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextMatch])

  // ── Story logic ────────────────────────────────────────────
  const stories = results
    .filter(r => r.home_team && r.away_team) // skip rows with missing team names
    .map(r => {
      const isHome     = r.home_team === "90 Stars Academy"
      const ourScore   = isHome ? (r.home_score ?? 0) : (r.away_score ?? 0)
      const theirScore = isHome ? (r.away_score ?? 0) : (r.home_score ?? 0)
      const opponent   = (isHome ? r.away_team : r.home_team) || "Unknown"
      const won  = ourScore > theirScore
      const lost = ourScore < theirScore
      return {
        id: r.id,
        opp: opponent,
        score: `${ourScore}-${theirScore}`,
        result: won ? "W" : lost ? "L" : "D",
        caption: r.gk_note
          ? `${r.scorers || ""} — ${r.gk_note} 🙌 #HoneyBadgers`
          : r.scorers
          ? `${r.scorers} ⚽ #HoneyBadgers`
          : `${opponent} · ${ourScore}-${theirScore} #90Stars`,
      }
    })

  // Add next match as last bubble if exists
  if (nextMatch) {
    stories.push({
      id: "next",
      opp: nextMatch.away_team || nextMatch.home_team,
      score: null,
      result: null,
      caption: `NEXT UP: ${nextMatch.away_team || nextMatch.home_team} at ${nextMatch.venue || "TBA"}! 🦡💛`,
    })
  }

  const openStory = (idx) => {
    setStoryIdx(idx); setStoryProg(0)
    clearInterval(storyTimer.current)
    storyTimer.current = setInterval(() => {
      setStoryProg(p => {
        if (p >= 100) {
          clearInterval(storyTimer.current)
          const next = idx + 1
          if (next < stories.length) setTimeout(() => openStory(next), 0)
          else setStoryIdx(null)
          return 100
        }
        return p + 2
      })
    }, 100)
  }
  const closeStory = () => { clearInterval(storyTimer.current); setStoryIdx(null); setStoryProg(0) }
  useEffect(() => () => clearInterval(storyTimer.current), [])

  const Box = ({ val, label }) => (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
        fontSize: "clamp(22px,6vw,30px)", color: GOLD, lineHeight: 1,
        background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "4px 8px", minWidth: 44 }}>
        {String(val).padStart(2, "0")}
      </div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 3,
        fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, letterSpacing: "0.08em" }}>
        {label}
      </div>
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", background: "#f5f6fa" }}>
      {showDonate && <DonateModal onClose={() => setShowDonate(false)} session={session} />}

      {/* ══ STORY OVERLAY ══════════════════════════════════════ */}
      {storyIdx !== null && storyIdx < stories.length && (() => {
        const s   = stories[storyIdx]
        const win = s.result === "W"
        const los = s.result === "L"
        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "#000",
            display: "flex", flexDirection: "column" }} onClick={closeStory}>
            {/* Progress bars */}
            <div style={{ display: "flex", gap: 3, padding: "10px 10px 6px", flexShrink: 0 }}>
              {stories.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2,
                  background: "rgba(255,255,255,0.3)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 2, background: WHITE,
                    width: i < storyIdx ? "100%" : i === storyIdx ? `${storyProg}%` : "0%" }} />
                </div>
              ))}
            </div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10,
              padding: "6px 12px 8px", flexShrink: 0 }}>
              <Logo size={36} />
              <div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
                  fontSize: 14, color: WHITE }}>90 STARS ACADEMY</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>vs {s.opp}</div>
              </div>
              <button onClick={closeStory} style={{ marginLeft: "auto", background: "none",
                border: "none", color: WHITE, fontSize: 22, cursor: "pointer" }}>✕</button>
            </div>
            {/* Body */}
            <div style={{ flex: 1, position: "relative", background: "#111",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* Score badge */}
              {s.score && (
                <div style={{ position: "absolute", top: 16, right: 16,
                  background: win ? "rgba(245,197,24,0.9)" : los ? "rgba(192,57,43,0.9)" : "rgba(80,80,80,0.9)",
                  borderRadius: 12, padding: "6px 14px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
                    fontSize: 26, color: win ? NAVY : WHITE }}>{s.score}</div>
                  <div style={{ fontSize: 9, color: win ? NAVY : WHITE, fontWeight: 700 }}>
                    {win ? "WIN" : los ? "LOSS" : "DRAW"}
                  </div>
                </div>
              )}
              {!s.score && (
                <div style={{ position: "absolute", top: 16, right: 16,
                  background: "rgba(245,197,24,0.9)", borderRadius: 12, padding: "6px 14px" }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif",
                    fontWeight: 900, fontSize: 14, color: NAVY }}>NEXT UP ⚽</div>
                </div>
              )}
              {/* Opponent name big */}
              <div style={{ textAlign: "center", padding: 24 }}>
                <div style={{ fontSize: 60, marginBottom: 12 }}>⚽</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
                  fontSize: 28, color: WHITE }}>{s.opp}</div>
              </div>
              {/* Caption */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "16px 14px",
                background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                <div style={{ fontSize: 14, color: WHITE, lineHeight: 1.5,
                  fontWeight: 600, textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
                  {s.caption}
                </div>
              </div>
            </div>
            {/* Nav */}
            <div style={{ display: "flex", padding: "12px 14px", gap: 10, flexShrink: 0 }}
              onClick={e => e.stopPropagation()}>
              <button onClick={() => storyIdx > 0 && openStory(storyIdx - 1)}
                style={{ flex: 1, padding: 10, background: "rgba(255,255,255,0.15)",
                  border: "none", borderRadius: 10, color: WHITE, fontSize: 13,
                  fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
                  cursor: "pointer", opacity: storyIdx > 0 ? 1 : 0.3 }}>← PREV</button>
              <button onClick={() => storyIdx < stories.length - 1 ? openStory(storyIdx + 1) : closeStory()}
                style={{ flex: 1, padding: 10, background: "rgba(245,197,24,0.9)",
                  border: "none", borderRadius: 10, color: NAVY, fontSize: 13,
                  fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, cursor: "pointer" }}>
                {storyIdx < stories.length - 1 ? "NEXT →" : "CLOSE ✕"}
              </button>
            </div>
          </div>
        )
      })()}

      {/* ══ NEXT MATCH ══════════════════════════════════════════ */}
      <div style={{ background: `linear-gradient(160deg,${NAVY},#1a3060)`,
        padding: "clamp(14px,4vw,20px) clamp(14px,4vw,18px)", position: "relative", overflow: "hidden" }}>
        <div style={{ opacity: 0.06, position: "absolute", right: -20, top: -20, pointerEvents: "none" }}>
          <Logo size={180} />
        </div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800,
          fontSize: 10, color: GOLD, letterSpacing: "0.14em", marginBottom: 8 }}>NEXT MATCH</div>

        {nextMatch ? (<>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 10, gap: 8 }}>
            {/* Home */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flex: 1 }}>
              <Logo size={52} />
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
                fontSize: "clamp(9px,2.5vw,11px)", color: WHITE, textAlign: "center" }}>
                {nextMatch.home_team}
              </span>
            </div>
            {/* VS */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
                fontSize: "clamp(14px,4vw,20px)", color: GOLD }}>VS</span>
              {nextMatch.week && (
                <span style={{ fontSize: 8, color: "rgba(255,255,255,0.45)",
                  fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>
                  WEEK {nextMatch.week}
                </span>
              )}
            </div>
            {/* Away */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flex: 1 }}>
              <div style={{ width: "clamp(44px,12vw,58px)", height: "clamp(44px,12vw,58px)",
                borderRadius: "50%", background: "rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>⚽</div>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
                fontSize: "clamp(9px,2.5vw,11px)", color: WHITE, textAlign: "center" }}>
                {nextMatch.away_team}
              </span>
            </div>
          </div>

          {/* Date / time / venue */}
          <div style={{ fontSize: "clamp(10px,2.5vw,11px)", color: "rgba(255,255,255,0.6)",
            marginBottom: 10, display: "flex", gap: 8, flexWrap: "wrap",
            alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <span>📅 {nextMatch.match_date}</span>
            <span>⏰ {nextMatch.match_time}</span>
            {nextMatch.venue && <span>📍 {nextMatch.venue}</span>}
            <span style={{ background: GREEN, color: WHITE, padding: "1px 6px",
              borderRadius: 3, fontSize: 9, fontWeight: 800,
              fontFamily: "'Barlow Condensed',sans-serif" }}>
              {nextMatch.competition || "HOME"}
            </span>
          </div>

          {/* Countdown or kickoff */}
          {countdown ? (
            <div style={{ display: "flex", gap: "clamp(6px,2vw,10px)",
              alignItems: "center", justifyContent: "center" }}>
              <Box val={countdown.d} label="DAYS" />
              <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 900, fontSize: 22, marginBottom: 14 }}>:</span>
              <Box val={countdown.h} label="HRS" />
              <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 900, fontSize: 22, marginBottom: 14 }}>:</span>
              <Box val={countdown.m} label="MINS" />
              <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 900, fontSize: 22, marginBottom: 14 }}>:</span>
              <Box val={countdown.s} label="SECS" />
            </div>
          ) : (
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
              fontSize: 16, color: GOLD, textAlign: "center", padding: "8px 0" }}>
              🕐 KICK OFF TODAY AT {nextMatch.match_time}
            </div>
          )}
        </>) : (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)",
            fontFamily: "'Barlow Condensed',sans-serif", padding: "20px 0" }}>
            No upcoming fixture — add one in Admin Panel
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
          <div onClick={() => setActiveTab && setActiveTab("calendar")}
            style={{ background: GOLD, color: NAVY, borderRadius: 8, padding: "8px 24px",
              fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
              fontSize: 12, letterSpacing: "0.08em", cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
              boxShadow: "0 2px 8px rgba(245,197,24,0.4)" }}>
            MATCH CENTER
          </div>
        </div>
      </div>

      {/* ══ STORY BUBBLES (live from results) ══════════════════ */}
      <div style={{ background: WHITE, padding: "12px 0 8px", borderBottom: "1px solid #eee" }}>
        <div style={{ display: "flex", gap: 12, overflowX: "auto",
          padding: "0 12px", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {stories.length === 0 && (
            <div style={{ fontSize: 12, color: MGRAY, padding: "10px 0",
              fontFamily: "'Barlow Condensed',sans-serif" }}>
              No results yet — post results in Admin Panel
            </div>
          )}
          {stories.map((s, i) => {
            const win  = s.result === "W"
            const loss = s.result === "L"
            return (
              <div key={s.id} onClick={() => openStory(i)}
                style={{ flexShrink: 0, display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 5, cursor: "pointer",
                  WebkitTapHighlightColor: "transparent" }}>
                <div style={{
                  width: 62, height: 62, borderRadius: "50%", padding: 3,
                  background: s.result === null
                    ? `linear-gradient(135deg,${GOLD},${GOLD2})`
                    : win ? `linear-gradient(135deg,${GREEN},#16a34a)`
                    : loss ? `linear-gradient(135deg,${RED},#9b1c1c)`
                    : `linear-gradient(135deg,#888,#555)`,
                }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%",
                    border: "2px solid white", overflow: "hidden", background: NAVY,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22 }}>⚽</div>
                </div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
                  fontSize: "clamp(8px,2vw,10px)", color: NAVY, textAlign: "center",
                  maxWidth: 64, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {(s.opp || "OPP").split(" ")[0]}
                </div>
                {s.score ? (
                  <div style={{ fontSize: 9, fontWeight: 900, marginTop: -2,
                    color: win ? GREEN : loss ? RED : "#888",
                    fontFamily: "'Barlow Condensed',sans-serif" }}>
                    {s.score} {win ? "✓" : loss ? "✗" : "="}
                  </div>
                ) : (
                  <div style={{ fontSize: 9, fontWeight: 900, color: GOLD2,
                    fontFamily: "'Barlow Condensed',sans-serif", marginTop: -2 }}>NEXT ⚽</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ══ QUICK ACTIONS ══════════════════════════════════════ */}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none", padding: "10px 12px 0" }}>
        <div style={{ display: "flex", gap: 8, width: "max-content" }}>
          {[
            { icon: "🎟", label: "TICKETS", fn: () => setActiveTab && setActiveTab("store") },
            { icon: "👕", label: "SHOP",    fn: () => setActiveTab && setActiveTab("store") },
            { icon: "❤️", label: "DONATE",  fn: () => setShowDonate(true) },
            { icon: "📰", label: "NEWS",    fn: null },
            { icon: "🦡", label: "MEMBERS", fn: openMembership },
          ].map(item => (
            <button key={item.label} onClick={item.fn || undefined}
              style={{ flexShrink: 0, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 3, padding: "7px 10px", minWidth: 54,
                background: WHITE, border: "1.5px solid #eee", borderRadius: 10,
                cursor: item.fn ? "pointer" : "default",
                WebkitTapHighlightColor: "transparent",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800,
                fontSize: 8, color: NAVY, letterSpacing: "0.05em",
                whiteSpace: "nowrap" }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ══ NEWS FEED ══════════════════════════════════════════ */}
      <div style={{ padding: "14px 12px 0" }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
          fontSize: "clamp(14px,4vw,17px)", color: NAVY, marginBottom: 10 }}>
          📰 LATEST NEWS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {news.length === 0 && (
            <div style={{ fontSize: 12, color: MGRAY, padding: 16, textAlign: "center",
              fontFamily: "'Barlow Condensed',sans-serif" }}>
              No news yet — publish articles in Admin Panel
            </div>
          )}
          {news.map((n, i) => (
            <div key={n.id} style={{ background: WHITE, borderRadius: 14, overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
              <div style={{ height: 4, background: i === 0 ? GOLD : i % 2 === 0 ? GREEN : NAVY }} />
              <div style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ background: NAVY, color: GOLD, fontSize: 9, fontWeight: 900,
                    padding: "2px 7px", borderRadius: 4,
                    fontFamily: "'Barlow Condensed',sans-serif" }}>{n.tag}</span>
                  <span style={{ fontSize: 11, color: MGRAY }}>
                    {new Date(n.created_at).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </span>
                  {n.pinned && <span style={{ fontSize: 10 }}>📌</span>}
                </div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
                  fontSize: "clamp(14px,4vw,17px)", color: NAVY, lineHeight: 1.2, marginBottom: 6 }}>
                  {n.title}
                </div>
                <div style={{ fontSize: "clamp(12px,3vw,13px)", color: MGRAY, lineHeight: 1.6 }}>
                  {n.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ DONATE BANNER ══════════════════════════════════════ */}
      <div style={{ margin: "16px 12px 24px" }}>
        <div onClick={() => setShowDonate(true)}
          style={{ background: `linear-gradient(135deg,${RED},#922b21)`,
            borderRadius: 14, padding: "14px 16px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            WebkitTapHighlightColor: "transparent",
            boxShadow: "0 4px 14px rgba(192,57,43,0.3)" }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
              fontSize: "clamp(14px,4vw,18px)", color: WHITE }}>
              ❤️ SUPPORT THE HONEY BADGERS
            </div>
            <div style={{ fontSize: "clamp(11px,3vw,13px)", color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
              Every pula helps the team grow
            </div>
          </div>
          <div style={{ background: WHITE, color: RED, borderRadius: 8, padding: "8px 14px",
            fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
            fontSize: "clamp(11px,3vw,13px)", flexShrink: 0 }}>DONATE →</div>
        </div>
      </div>
    </div>
  )
}

export default ForYouScreen
