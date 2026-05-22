import React, { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"
import { NAVY, GOLD, GOLD2, WHITE, MGRAY, RED, GREEN, Logo, Ico, Btn } from "./constants"

/* ══════════════════════════════════════════════════════════════════════════════
   ADMIN PANEL
   Only renders if profile.role === 'admin'
══════════════════════════════════════════════════════════════════════════════ */

const TIERS = ["premium_free", "global_fan", "honey_badger"]
const TIER_LABELS = {
  premium_free: "🆓 Premium Free",
  global_fan:   "🌍 Global Fan",
  honey_badger: "🦡 Honey Badger",
}
const TIER_COLORS = {
  premium_free: "#22c55e",
  global_fan:   "#facc15",
  honey_badger: "#f5c518",
}

const ROLES = ["user", "admin"]

// ── Styles outside component to prevent re-render focus loss ─────────────────
const S = {
  overlay: {
    position:"fixed", inset:0, zIndex:1000,
    background:"rgba(0,0,0,0.55)",
    display:"flex", alignItems:"flex-end",
    WebkitTapHighlightColor:"transparent",
  },
  sheet: {
    width:"100%", maxHeight:"92vh",
    background:"#f5f6fa",
    borderRadius:"20px 20px 0 0",
    overflow:"hidden",
    display:"flex", flexDirection:"column",
  },
  header: {
    background:`linear-gradient(135deg,${NAVY},#1a3060)`,
    padding:"18px 20px 14px",
    display:"flex", alignItems:"center", justifyContent:"space-between",
    flexShrink:0,
  },
  headerTitle: {
    fontFamily:"'Barlow Condensed',sans-serif",
    fontWeight:900, fontSize:20, color:GOLD, letterSpacing:"0.08em",
  },
  headerSub: {
    fontSize:11, color:"rgba(255,255,255,0.5)",
    fontFamily:"'Barlow Condensed',sans-serif",
    letterSpacing:"0.06em", marginTop:2,
  },
  closeBtn: {
    width:36, height:36, borderRadius:"50%",
    background:"rgba(255,255,255,0.1)",
    border:"none", cursor:"pointer", color:WHITE,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:20, fontWeight:300,
    WebkitTapHighlightColor:"transparent",
  },
  body: {
    flex:1, overflowY:"auto",
    WebkitOverflowScrolling:"touch",
    padding:"14px 14px 32px",
  },
  sectionLbl: {
    fontFamily:"'Barlow Condensed',sans-serif",
    fontWeight:800, fontSize:11, color:MGRAY,
    letterSpacing:"0.1em", marginBottom:10, marginTop:16,
  },
  statsRow: {
    display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
    gap:10, marginBottom:4,
  },
  statCard: {
    background:WHITE, borderRadius:12,
    padding:"12px 10px", textAlign:"center",
    boxShadow:"0 1px 6px rgba(0,0,0,0.06)",
  },
  statVal: {
    fontFamily:"'Barlow Condensed',sans-serif",
    fontWeight:900, fontSize:22, color:NAVY, lineHeight:1,
  },
  statLbl: {
    fontSize:9, color:MGRAY,
    fontFamily:"'Barlow Condensed',sans-serif",
    letterSpacing:"0.08em", marginTop:4,
  },
  searchBox: {
    width:"100%", padding:"10px 14px",
    border:"1.5px solid #e2e8f0",
    borderRadius:10, fontSize:14,
    fontFamily:"'Barlow Condensed',sans-serif",
    color:NAVY, background:WHITE,
    boxSizing:"border-box", outline:"none",
    marginBottom:10,
  },
  memberRow: {
    background:WHITE, borderRadius:14,
    padding:"12px 14px", marginBottom:8,
    boxShadow:"0 1px 6px rgba(0,0,0,0.06)",
    display:"flex", alignItems:"center", gap:12,
  },
  avatar: {
    width:42, height:42, borderRadius:"50%",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontFamily:"'Barlow Condensed',sans-serif",
    fontWeight:900, fontSize:16, flexShrink:0,
    background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
    color:NAVY,
  },
  memberInfo: { flex:1, minWidth:0 },
  memberName: {
    fontFamily:"'Barlow Condensed',sans-serif",
    fontWeight:800, fontSize:14, color:NAVY,
    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
  },
  memberEmail: {
    fontSize:11, color:MGRAY, marginTop:1,
    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
  },
  tierPill: {
    borderRadius:20, padding:"3px 10px",
    fontSize:10, fontWeight:800,
    fontFamily:"'Barlow Condensed',sans-serif",
    letterSpacing:"0.08em", border:"none", cursor:"pointer",
    WebkitTapHighlightColor:"transparent",
    flexShrink:0,
  },
  // Edit modal
  modalOverlay: {
    position:"fixed", inset:0, zIndex:2000,
    background:"rgba(0,0,0,0.6)",
    display:"flex", alignItems:"center", justifyContent:"center",
    padding:"20px",
  },
  modal: {
    background:WHITE, borderRadius:18,
    width:"100%", maxWidth:360,
    padding:"24px 20px",
    boxShadow:"0 20px 60px rgba(0,0,0,0.3)",
  },
  modalTitle: {
    fontFamily:"'Barlow Condensed',sans-serif",
    fontWeight:900, fontSize:18, color:NAVY,
    marginBottom:4,
  },
  modalSub: { fontSize:12, color:MGRAY, marginBottom:20 },
  optionBtn: {
    width:"100%", padding:"12px 16px", marginBottom:8,
    borderRadius:10, border:"2px solid transparent",
    cursor:"pointer", textAlign:"left",
    fontFamily:"'Barlow Condensed',sans-serif",
    fontWeight:800, fontSize:14,
    display:"flex", alignItems:"center", justifyContent:"space-between",
    WebkitTapHighlightColor:"transparent",
  },
  cancelBtn: {
    width:"100%", padding:"11px",
    background:"transparent", border:`1.5px solid #e2e8f0`,
    borderRadius:10, cursor:"pointer", marginTop:4,
    fontFamily:"'Barlow Condensed',sans-serif",
    fontWeight:700, fontSize:14, color:MGRAY,
    WebkitTapHighlightColor:"transparent",
  },
  toast: {
    position:"fixed", bottom:90, left:"50%",
    transform:"translateX(-50%)",
    background:NAVY, color:GOLD,
    padding:"10px 20px", borderRadius:20,
    fontFamily:"'Barlow Condensed',sans-serif",
    fontWeight:800, fontSize:13, letterSpacing:"0.08em",
    zIndex:3000, whiteSpace:"nowrap",
    boxShadow:"0 4px 20px rgba(0,0,0,0.3)",
  },
}

export default function AdminPanel({ onClose }) {
  const [members, setMembers]         = useState([])
  const [filtered, setFiltered]       = useState([])
  const [search, setSearch]           = useState("")
  const [loading, setLoading]         = useState(true)
  const [editing, setEditing]         = useState(null)   // member being edited
  const [saving, setSaving]           = useState(false)
  const [toast, setToast]             = useState("")

  // ── Fetch all members ──────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, tier, role")
        .order("full_name", { ascending: true })
      if (!error) {
        setMembers(data || [])
        setFiltered(data || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  // ── Search filter ──────────────────────────────────────────────────────────
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      q
        ? members.filter(m =>
            (m.full_name||"").toLowerCase().includes(q) ||
            (m.email||"").toLowerCase().includes(q)
          )
        : members
    )
  }, [search, members])

  // ── Stats ─────────────────────────────────────────────────────────────────
  const total      = members.length
  const badgers    = members.filter(m => m.tier === "honey_badger").length
  const globalFans = members.filter(m => m.tier === "global_fan").length

  // ── Show toast ─────────────────────────────────────────────────────────────
  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  // ── Save tier / role change ────────────────────────────────────────────────
  async function saveMember(id, field, value) {
    setSaving(true)
    const { error } = await supabase
      .from("profiles")
      .update({ [field]: value })
      .eq("id", id)
    if (!error) {
      setMembers(prev =>
        prev.map(m => m.id === id ? { ...m, [field]: value } : m)
      )
      showToast("✅ Updated successfully")
    } else {
      showToast("❌ Update failed")
    }
    setSaving(false)
    setEditing(null)
  }

  // ── Initials helper ────────────────────────────────────────────────────────
  function initials(name) {
    if (!name) return "?"
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  }

  return (
    <>
      <div style={S.overlay} onClick={onClose}>
        <div style={S.sheet} onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div style={S.header}>
            <div>
              <div style={S.headerTitle}>⚙️ ADMIN PANEL</div>
              <div style={S.headerSub}>VILLAREAL FC · MEMBER MANAGEMENT</div>
            </div>
            <button style={S.closeBtn} onClick={onClose}>×</button>
          </div>

          <div style={S.body}>

            {/* Stats */}
            <div style={S.sectionLbl}>OVERVIEW</div>
            <div style={S.statsRow}>
              <div style={S.statCard}>
                <div style={S.statVal}>{total}</div>
                <div style={S.statLbl}>TOTAL USERS</div>
              </div>
              <div style={S.statCard}>
                <div style={{ ...S.statVal, color:"#f5c518" }}>{badgers}</div>
                <div style={S.statLbl}>HONEY BADGER</div>
              </div>
              <div style={S.statCard}>
                <div style={{ ...S.statVal, color:"#facc15" }}>{globalFans}</div>
                <div style={S.statLbl}>GLOBAL FAN</div>
              </div>
            </div>

            {/* Search */}
            <div style={S.sectionLbl}>MEMBERS</div>
            <input
              style={S.searchBox}
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            {/* Member list */}
            {loading ? (
              <div style={{ textAlign:"center", padding:"30px 0",
                fontFamily:"'Barlow Condensed',sans-serif",
                color:MGRAY, fontSize:13, letterSpacing:"0.08em" }}>
                LOADING MEMBERS…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign:"center", padding:"30px 0",
                fontFamily:"'Barlow Condensed',sans-serif",
                color:MGRAY, fontSize:13 }}>
                No members found
              </div>
            ) : (
              filtered.map(m => (
                <div key={m.id} style={S.memberRow}>
                  <div style={S.avatar}>{initials(m.full_name)}</div>
                  <div style={S.memberInfo}>
                    <div style={S.memberName}>{m.full_name || "Unnamed"}</div>
                    <div style={S.memberEmail}>{m.email}</div>
                    {m.role === "admin" && (
                      <div style={{ fontSize:9, color:"#f5c518",
                        fontFamily:"'Barlow Condensed',sans-serif",
                        fontWeight:800, letterSpacing:"0.1em", marginTop:2 }}>
                        ADMIN
                      </div>
                    )}
                  </div>
                  {/* Tier pill — tap to edit */}
                  <button
                    style={{
                      ...S.tierPill,
                      background: TIER_COLORS[m.tier] || "#e2e8f0",
                      color: NAVY,
                    }}
                    onClick={() => setEditing(m)}
                  >
                    {TIER_LABELS[m.tier] || m.tier}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editing && (
        <div style={S.modalOverlay} onClick={() => setEditing(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.modalTitle}>{editing.full_name || "Unnamed"}</div>
            <div style={S.modalSub}>{editing.email}</div>

            {/* Tier options */}
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:800, fontSize:10, color:MGRAY,
              letterSpacing:"0.1em", marginBottom:8 }}>
              SET TIER
            </div>
            {TIERS.map(t => (
              <button
                key={t}
                disabled={saving}
                onClick={() => saveMember(editing.id, "tier", t)}
                style={{
                  ...S.optionBtn,
                  background: editing.tier === t
                    ? `${TIER_COLORS[t]}22`
                    : "#f8fafc",
                  borderColor: editing.tier === t
                    ? TIER_COLORS[t]
                    : "#e2e8f0",
                  color: NAVY,
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {TIER_LABELS[t]}
                {editing.tier === t && (
                  <span style={{ fontSize:12, color:TIER_COLORS[t] }}>✓ Current</span>
                )}
              </button>
            ))}

            {/* Role toggle */}
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:800, fontSize:10, color:MGRAY,
              letterSpacing:"0.1em", margin:"16px 0 8px" }}>
              SET ROLE
            </div>
            {ROLES.map(r => (
              <button
                key={r}
                disabled={saving}
                onClick={() => saveMember(editing.id, "role", r)}
                style={{
                  ...S.optionBtn,
                  background: editing.role === r ? "#0f172a11" : "#f8fafc",
                  borderColor: editing.role === r ? NAVY : "#e2e8f0",
                  color: NAVY,
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {r === "admin" ? "⚙️ Admin" : "👤 User"}
                {editing.role === r && (
                  <span style={{ fontSize:12, color:NAVY }}>✓ Current</span>
                )}
              </button>
            ))}

            <button style={S.cancelBtn} onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && <div style={S.toast}>{toast}</div>}
    </>
  )
}
