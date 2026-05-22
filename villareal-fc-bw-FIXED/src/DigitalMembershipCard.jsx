import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─── Tier config ──────────────────────────────────────────────────────────────
const TIER_CONFIG = {
  premium_free: {
    label: "PREMIUM FREE", sublabel: "Get started for free",
    ageRestriction: null, popularBadge: false,
    cardBg: "#1e2a3a", cardBorder: "#2e3f55", accent: "#22c55e",
    perks: [
      { icon: "📰", text: "CLUB NEWS & MATCH UPDATES" },
      { icon: "📅", text: "FIXTURES & STANDINGS" },
      { icon: "🎬", text: "CLIPS & HIGHLIGHTS" },
      { icon: "🛒", text: "EARLY STORE NOTIFICATIONS" },
    ],
  },
  global_fan: {
    label: "GLOBAL FAN", sublabel: "For dedicated fans",
    ageRestriction: null, popularBadge: true,
    cardBg: "#0f172a", cardBorder: "#1d4ed8", accent: "#facc15",
    perks: [
      { icon: "✅", text: "EVERYTHING IN FREE" },
      { icon: "🏷️", text: "5% OFF OFFICIAL STORE" },
      { icon: "🎟️", text: "10% OFF MATCH-DAY TICKETS" },
      { icon: "🎫", text: "EARLY TICKET ACCESS (48HR)" },
      { icon: "🔢", text: "EXCLUSIVE MEMBER KIT NUMBER" },
      { icon: "📊", text: "PRIORITY SQUAD UPDATES" },
    ],
  },
  honey_badger: {
    label: "HONEY BADGER", sublabel: "The ultimate membership",
    ageRestriction: "18+ ONLY", popularBadge: false,
    cardBg: "#d4a800", cardBorder: "#f5c518", accent: "#f5c518",
    perks: [
      { icon: "✅", text: "EVERYTHING IN GLOBAL FAN" },
      { icon: "🎟️", text: "20% OFF MATCH-DAY TICKETS" },
      { icon: "🏷️", text: "10% OFF OFFICIAL STORE" },
      { icon: "💳", text: "DIGITAL MEMBERSHIP CARD" },
      { icon: "🎉", text: "EXCLUSIVE MEMBER EVENTS" },
      { icon: "📢", text: "VOTE IN CLUB DECISIONS" },
      { icon: "👑", text: "VIP MATCH-DAY EXPERIENCE" },
    ],
  },
};

// ─── Hex background ───────────────────────────────────────────────────────────
function HexBg() {
  return (
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}
      xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="hxp2" x="0" y="0" width="28" height="32" patternUnits="userSpaceOnUse">
          <polygon points="14,2 26,8 26,22 14,28 2,22 2,8"
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hxp2)"/>
      <circle cx="85%" cy="15%" r="60" fill="rgba(255,255,255,0.03)"/>
    </svg>
  );
}

// ─── QR ───────────────────────────────────────────────────────────────────────
function QR({ accent }) {
  return (
    <svg width="36" height="36" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" fill="#0b1120"/>
      <rect x="3" y="3" width="14" height="14" rx="1.5" fill="none" stroke={accent} strokeWidth="1.4"/>
      <rect x="6" y="6" width="8" height="8" rx="0.5" fill={accent}/>
      <rect x="27" y="3" width="14" height="14" rx="1.5" fill="none" stroke={accent} strokeWidth="1.4"/>
      <rect x="30" y="6" width="8" height="8" rx="0.5" fill={accent}/>
      <rect x="3" y="27" width="14" height="14" rx="1.5" fill="none" stroke={accent} strokeWidth="1.4"/>
      <rect x="6" y="30" width="8" height="8" rx="0.5" fill={accent}/>
      <rect x="27" y="27" width="4" height="4" fill={accent}/>
      <rect x="33" y="27" width="4" height="4" fill={accent}/>
      <rect x="39" y="27" width="4" height="4" fill={accent}/>
      <rect x="27" y="33" width="4" height="4" fill={accent}/>
      <rect x="39" y="33" width="4" height="4" fill={accent}/>
      <rect x="27" y="39" width="4" height="4" fill={accent}/>
      <rect x="33" y="39" width="4" height="4" fill={accent}/>
      <rect x="39" y="39" width="4" height="4" fill={accent}/>
      <rect x="20" y="3" width="4" height="4" fill={accent}/>
      <rect x="20" y="9" width="4" height="4" fill={accent}/>
      <rect x="20" y="15" width="4" height="4" fill={accent}/>
      <rect x="3" y="20" width="4" height="4" fill={accent}/>
      <rect x="9" y="20" width="4" height="4" fill={accent}/>
      <rect x="15" y="20" width="4" height="4" fill={accent}/>
      <rect x="20" y="20" width="4" height="4" fill={accent}/>
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function shortId(id) {
  if (!id) return "VFC-000000";
  const clean = id.toString().replace(/-/g, "").toUpperCase().slice(0, 8);
  return `VFC-${clean}`;
}

// ─── Styles (outside component) ───────────────────────────────────────────────
const S = {
  wrapper: {
    display:"flex", flexDirection:"column", alignItems:"center",
    gap:10, padding:"4px 0 8px",
    fontFamily:"'Barlow Condensed',sans-serif",
  },
  previewLbl: {
    fontSize:10, color:"#94a3b8", letterSpacing:"0.06em",
    fontFamily:"Barlow,sans-serif", textTransform:"uppercase",
  },
  card: {
    width:"100%",
    borderRadius:14,
    overflow:"hidden",
    position:"relative",
    boxShadow:"0 8px 32px rgba(0,0,0,0.28)",
  },
  inner: {
    display:"flex", flexDirection:"row",
    minHeight:0, position:"relative",
  },
  left: {
    background:"#0b1120",
    width:"30%", minWidth:90, maxWidth:120,
    flexShrink:0,
    display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center",
    padding:"12px 8px 12px 10px",
    gap:7, position:"relative", zIndex:1,
  },
  leftTail: {
    position:"absolute", top:0, right:-14, bottom:0, width:28,
    background:"#0b1120",
    clipPath:"polygon(0 0, 55% 8%, 55% 92%, 0 100%)",
    zIndex:1,
  },
  photo: {
    width:54, height:54, borderRadius:"50%",
    background:"#1a2240",
    display:"flex", alignItems:"center", justifyContent:"center",
    overflow:"hidden", position:"relative", zIndex:2,
    flexShrink:0,
  },
  photoImg: { width:"100%", height:"100%", objectFit:"cover" },
  photoPlaceholder: {
    width:"100%", height:"100%", background:"#1e2b4a",
    display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center", gap:2,
  },
  idBlock: { textAlign:"center", position:"relative", zIndex:2 },
  idLbl: {
    fontSize:6, fontWeight:700,
    color:"rgba(212,168,0,0.55)", letterSpacing:"0.12em", marginBottom:2,
  },
  idVal: {
    fontSize:8, fontWeight:900,
    color:"#f5c518", letterSpacing:"0.04em", wordBreak:"break-all",
    lineHeight:1.3,
  },
  right: {
    flex:1, padding:"10px 10px 8px 18px",
    display:"flex", flexDirection:"column",
    justifyContent:"space-between",
    position:"relative", zIndex:1, minWidth:0,
  },
  topRow: {
    display:"flex", justifyContent:"space-between",
    alignItems:"flex-start", gap:4,
  },
  clubName: {
    fontSize:8, fontWeight:900, color:"#0b1120",
    letterSpacing:"0.16em", lineHeight:1,
  },
  official: {
    fontSize:6, color:"rgba(11,17,32,0.5)",
    letterSpacing:"0.08em", marginTop:1,
  },
  badge: {
    background:"#0b1120", borderRadius:5,
    padding:"3px 7px",
    display:"flex", alignItems:"center", gap:3, flexShrink:0,
  },
  badgeText: {
    fontSize:7, fontWeight:900, letterSpacing:"0.1em",
  },
  memberName: {
    fontSize:18, fontWeight:900, color:"#0b1120",
    lineHeight:1, letterSpacing:"0.01em",
    marginTop:4, wordBreak:"break-word",
  },
  since: {
    fontSize:8, color:"rgba(11,17,32,0.52)",
    letterSpacing:"0.06em", marginTop:2, fontStyle:"italic",
  },
  divider: { height:1, background:"rgba(11,17,32,0.16)", margin:"6px 0" },
  metaQr: { display:"flex", alignItems:"flex-end", gap:0 },
  meta: { flex:1, display:"flex", gap:0 },
  detail: { flex:1, minWidth:0 },
  detailLbl: {
    fontSize:6, fontWeight:700,
    color:"rgba(11,17,32,0.48)", letterSpacing:"0.12em", marginBottom:2,
  },
  detailVal: {
    fontSize:11, fontWeight:900, color:"#0b1120",
    letterSpacing:"0.02em", lineHeight:1,
  },
  detailValExp: {
    fontSize:11, fontWeight:900, color:"#3a1f00",
    letterSpacing:"0.02em", lineHeight:1,
  },
  qrWrap: {
    flexShrink:0, paddingLeft:8,
    borderLeft:"1px solid rgba(11,17,32,0.16)", marginLeft:8,
    display:"flex", flexDirection:"column", alignItems:"center", gap:2,
  },
  qrLbl: {
    fontSize:6, fontWeight:700,
    color:"rgba(11,17,32,0.48)", letterSpacing:"0.08em", textAlign:"center",
  },
  perksBand: {
    background:"#0b1120",
    padding:"7px 10px 7px 12px",
    display:"flex", alignItems:"center",
    justifyContent:"space-between", gap:6, flexWrap:"wrap",
  },
  perksGrid: {
    display:"flex", flexWrap:"wrap", gap:"4px 12px", flex:1,
  },
  perk: {
    display:"flex", alignItems:"center", gap:4,
    fontSize:7, fontWeight:700,
    color:"rgba(245,197,24,0.85)", letterSpacing:"0.06em",
    whiteSpace:"nowrap",
  },
  season: {
    fontSize:7, color:"rgba(245,197,24,0.35)",
    letterSpacing:"0.08em", whiteSpace:"nowrap", flexShrink:0,
  },
  chips: {
    display:"flex", gap:6, flexWrap:"wrap",
    justifyContent:"center", width:"100%",
  },
  chip: {
    background:"#1e293b", border:"0.5px solid #334155",
    borderRadius:20, padding:"3px 9px",
    fontSize:9, color:"#94a3b8",
    display:"flex", alignItems:"center", gap:4,
    fontFamily:"Barlow,sans-serif",
  },
  stateBox: {
    width:"100%", minHeight:120,
    background:"#0b1120", borderRadius:14,
    display:"flex", alignItems:"center", justifyContent:"center",
    flexDirection:"column", gap:10,
    color:"#f5c518", fontSize:12, fontWeight:700, letterSpacing:"0.1em",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function DigitalMembershipCard({
  memberId,
  clubName = "VILLAREAL FC",
  season = "2026/27",
}) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!memberId) { setError("No memberId provided."); setLoading(false); return; }

    async function fetchMember() {
      setLoading(true); setError(null);
      const { data, error: sbErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", memberId)
        .single();
      if (sbErr) setError(sbErr.message);
      else setMember(data);
      setLoading(false);
    }
    fetchMember();
  }, [memberId]);

  if (loading) return (
    <div style={S.stateBox}>
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#f5c518" strokeWidth="2"
          strokeDasharray="60" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate"
            from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite"/>
        </circle>
      </svg>
      LOADING…
    </div>
  );

  if (error || !member) return (
    <div style={{ ...S.stateBox, color:"#f87171" }}>
      ⚠ {error || "Member not found"}
    </div>
  );

  const tier = TIER_CONFIG[member.tier] || TIER_CONFIG.honey_badger;
  const photoSrc = member.avatar_url || member.photo_url || null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@400;600&display=swap');
        @keyframes hbFadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .hb-fade { animation: hbFadeUp 0.35s ease both; }
      `}</style>

      <div style={S.wrapper}>
        <p style={S.previewLbl}>{tier.label} · {tier.sublabel}</p>

        {/* Card */}
        <div className="hb-fade" style={{
          ...S.card,
          background: tier.cardBg,
          border: `2px solid ${tier.cardBorder}`,
        }}>
          <HexBg/>

          <div style={S.inner}>
            {/* LEFT */}
            <div style={S.left}>
              <div style={S.leftTail}/>
              <div style={{position:"absolute",width:70,height:70,
                background:"rgba(212,168,0,0.08)",borderRadius:"50%",
                top:-20,left:-20,pointerEvents:"none"}}/>

              {/* Photo */}
              <div style={{...S.photo, border:`2px solid ${tier.cardBg}`}}>
                {photoSrc ? (
                  <img src={photoSrc} alt={member.full_name} style={S.photoImg}/>
                ) : (
                  <div style={S.photoPlaceholder}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(212,168,0,0.45)" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                    <span style={{fontSize:6,fontWeight:700,
                      color:"rgba(212,168,0,0.4)",letterSpacing:"0.1em"}}>PHOTO</span>
                  </div>
                )}
              </div>

              {/* ID */}
              <div style={S.idBlock}>
                <div style={S.idLbl}>MEMBER ID</div>
                <div style={S.idVal}>{shortId(member.id)}</div>
              </div>
            </div>

            {/* RIGHT */}
            <div style={S.right}>
              <div style={S.topRow}>
                <div>
                  <div style={S.clubName}>{clubName}</div>
                  <div style={S.official}>OFFICIAL MEMBERSHIP CARD</div>
                </div>
                <div style={S.badge}>
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                    <ellipse cx="7" cy="9" rx="5" ry="3.5" fill={tier.accent}/>
                    <ellipse cx="7" cy="6.5" rx="3" ry="2.8" fill={tier.accent}/>
                    <ellipse cx="4.8" cy="4.5" rx="1.8" ry="1.4" fill={tier.accent}/>
                    <ellipse cx="9.2" cy="4.5" rx="1.8" ry="1.4" fill={tier.accent}/>
                    <ellipse cx="5.8" cy="7" rx="0.65" ry="0.65" fill="#0b1120"/>
                    <ellipse cx="8.2" cy="7" rx="0.65" ry="0.65" fill="#0b1120"/>
                    <path d="M5.8 8.8 Q7 9.8 8.2 8.8" stroke="#0b1120"
                      strokeWidth="0.5" fill="none" strokeLinecap="round"/>
                  </svg>
                  <span style={{...S.badgeText, color:tier.accent}}>{tier.label}</span>
                </div>
              </div>

              <div style={S.memberName}>
                {member.full_name?.toUpperCase() || "—"}
              </div>
              <div style={S.since}>Member since {fmtDate(member.join_date || member.created_at)}</div>

              <div style={S.divider}/>

              <div style={S.metaQr}>
                <div style={S.meta}>
                  <div style={S.detail}>
                    <div style={S.detailLbl}>JOINED</div>
                    <div style={S.detailVal}>{fmtDate(member.join_date || member.created_at)}</div>
                  </div>
                  <div style={S.detail}>
                    <div style={S.detailLbl}>BILLING</div>
                    <div style={S.detailVal}>{member.billing_cycle || "Annual"}</div>
                  </div>
                  <div style={S.detail}>
                    <div style={S.detailLbl}>EXPIRES</div>
                    <div style={S.detailValExp}>{fmtDate(member.expiry_date)}</div>
                  </div>
                </div>
                <div style={S.qrWrap}>
                  <QR accent={tier.accent}/>
                  <div style={S.qrLbl}>SCAN<br/>VERIFY</div>
                </div>
              </div>
            </div>
          </div>

          {/* Perks band */}
          <div style={S.perksBand}>
            <div style={S.perksGrid}>
              {tier.perks.map((p,i) => (
                <div key={i} style={S.perk}>
                  <span style={{fontSize:9}}>{p.icon}</span>{p.text}
                </div>
              ))}
            </div>
            <div style={S.season}>{season}</div>
          </div>
        </div>

        {/* Chips */}
        <div style={S.chips}>
          {member.is_verified && <div style={S.chip}>✅ Verified</div>}
          <div style={S.chip}>📱 Wallet-ready</div>
          {member.expiry_date && (
            <div style={S.chip}>🔄 Renews {fmtDate(member.expiry_date)}</div>
          )}
          {tier.ageRestriction && (
            <div style={S.chip}>🔒 {tier.ageRestriction}</div>
          )}
        </div>
      </div>
    </>
  );
}
