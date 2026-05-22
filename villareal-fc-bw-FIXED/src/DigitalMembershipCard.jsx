import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase client ──────────────────────────────────────────────────────────
// Replace with your actual project URL and anon key
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─── Tier config ─────────────────────────────────────────────────────────────
// Exact benefits from villareal-fc-bw.onrender.com membership page
const TIER_CONFIG = {
  // ── Tier 1: Premium Free ──────────────────────────────────────────────────
  premium_free: {
    label: "PREMIUM FREE",
    sublabel: "Get started for free",
    price: "FREE",
    youthPrice: "P0/yr",
    saveBadge: null,
    ageRestriction: null,
    popularBadge: false,
    cardBg: "#1e2a3a",
    cardBorder: "#2e3f55",
    accent: "#22c55e",
    badgeColor: "#22c55e",
    perks: [
      { icon: "📰", text: "CLUB NEWS & MATCH UPDATES" },
      { icon: "📅", text: "FIXTURES & STANDINGS" },
      { icon: "🎬", text: "CLIPS & HIGHLIGHTS" },
      { icon: "🛒", text: "EARLY STORE NOTIFICATIONS" },
    ],
  },

  // ── Tier 2: Global Fan ────────────────────────────────────────────────────
  global_fan: {
    label: "GLOBAL FAN",
    sublabel: "For dedicated fans",
    price: "P200/yr",
    youthPrice: "P153/yr",
    saveBadge: "Save P40",
    ageRestriction: null,
    popularBadge: true,
    cardBg: "#0f172a",
    cardBorder: "#1d4ed8",
    accent: "#facc15",
    badgeColor: "#facc15",
    perks: [
      { icon: "✅", text: "EVERYTHING IN FREE" },
      { icon: "🏷️", text: "5% OFF OFFICIAL STORE" },
      { icon: "🎟️", text: "10% OFF MATCH-DAY TICKETS" },
      { icon: "🎫", text: "EARLY TICKET ACCESS (48HR)" },
      { icon: "🔢", text: "EXCLUSIVE MEMBER KIT NUMBER" },
      { icon: "📊", text: "PRIORITY SQUAD UPDATES" },
    ],
  },

  // ── Tier 3: Honey Badger ──────────────────────────────────────────────────
  honey_badger: {
    label: "HONEY BADGER",
    sublabel: "The ultimate membership",
    price: "P500/yr",
    youthPrice: null,
    saveBadge: "Save P100",
    ageRestriction: "18+ ONLY",
    popularBadge: false,
    cardBg: "#d4a800",
    cardBorder: "#f5c518",
    accent: "#f5c518",
    badgeColor: "#f5c518",
    perks: [
      { icon: "✅", text: "EVERYTHING IN GLOBAL FAN" },
      { icon: "🎟️", text: "20% OFF MATCH-DAY TICKETS" },
      { icon: "🏷️", text: "10% OFF OFFICIAL STORE" },
      { icon: "🏟️", text: "FREE ENTRY TO HOME MATCHES" },
      { icon: "💳", text: "DIGITAL MEMBERSHIP CARD" },
      { icon: "🎉", text: "EXCLUSIVE MEMBER EVENTS" },
      { icon: "📢", text: "VOTE IN CLUB DECISIONS" },
      { icon: "👑", text: "VIP MATCH-DAY EXPERIENCE" },
    ],
  },
};

// ─── Hex SVG background ───────────────────────────────────────────────────────
function HexBg() {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="hxp" x="0" y="0" width="36" height="41.6" patternUnits="userSpaceOnUse">
          <polygon
            points="18,2 34,11 34,29 18,38 2,29 2,11"
            fill="none"
            stroke="rgba(255,255,255,0.09)"
            strokeWidth="0.7"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hxp)" />
      <circle cx="85%" cy="20%" r="80" fill="rgba(255,255,255,0.04)" />
      <circle cx="60%" cy="110%" r="100" fill="rgba(11,17,32,0.06)" />
    </svg>
  );
}

// ─── QR placeholder ───────────────────────────────────────────────────────────
function QRPlaceholder({ accent }) {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" fill="#0b1120" />
      <rect x="3" y="3" width="14" height="14" rx="1.5" fill="none" stroke={accent} strokeWidth="1.4" />
      <rect x="6" y="6" width="8" height="8" rx="0.5" fill={accent} />
      <rect x="27" y="3" width="14" height="14" rx="1.5" fill="none" stroke={accent} strokeWidth="1.4" />
      <rect x="30" y="6" width="8" height="8" rx="0.5" fill={accent} />
      <rect x="3" y="27" width="14" height="14" rx="1.5" fill="none" stroke={accent} strokeWidth="1.4" />
      <rect x="6" y="30" width="8" height="8" rx="0.5" fill={accent} />
      <rect x="27" y="27" width="4" height="4" fill={accent} />
      <rect x="33" y="27" width="4" height="4" fill={accent} />
      <rect x="39" y="27" width="4" height="4" fill={accent} />
      <rect x="27" y="33" width="4" height="4" fill={accent} />
      <rect x="39" y="33" width="4" height="4" fill={accent} />
      <rect x="27" y="39" width="4" height="4" fill={accent} />
      <rect x="33" y="39" width="4" height="4" fill={accent} />
      <rect x="39" y="39" width="4" height="4" fill={accent} />
      <rect x="20" y="3" width="4" height="4" fill={accent} />
      <rect x="20" y="9" width="4" height="4" fill={accent} />
      <rect x="20" y="15" width="4" height="4" fill={accent} />
      <rect x="3" y="20" width="4" height="4" fill={accent} />
      <rect x="9" y="20" width="4" height="4" fill={accent} />
      <rect x="15" y="20" width="4" height="4" fill={accent} />
      <rect x="20" y="20" width="4" height="4" fill={accent} />
    </svg>
  );
}

// ─── Styles (defined OUTSIDE component to prevent focus loss on re-render) ────
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    padding: "28px 16px 20px",
    fontFamily: "'Barlow Condensed', sans-serif",
  },
  previewLbl: {
    fontSize: 12,
    color: "#94a3b8",
    letterSpacing: "0.03em",
    fontFamily: "Barlow, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 620,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  inner: {
    display: "flex",
    flexDirection: "row",
    minHeight: 196,
    position: "relative",
  },
  left: {
    background: "#0b1120",
    width: 160,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 12px 20px 16px",
    gap: 10,
    position: "relative",
    zIndex: 1,
  },
  leftTail: {
    content: "''",
    position: "absolute",
    top: 0,
    right: -18,
    bottom: 0,
    width: 36,
    background: "#0b1120",
    clipPath: "polygon(0 0, 55% 8%, 55% 92%, 0 100%)",
    zIndex: 1,
  },
  photo: {
    width: 78,
    height: 78,
    borderRadius: "50%",
    border: "2.5px solid #d4a800",
    background: "#1a2240",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    zIndex: 2,
  },
  photoImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    background: "#1e2b4a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  idBlock: {
    textAlign: "center",
    position: "relative",
    zIndex: 2,
  },
  idLbl: {
    fontSize: 8,
    fontWeight: 700,
    color: "rgba(212,168,0,0.55)",
    letterSpacing: "0.14em",
    marginBottom: 3,
  },
  idVal: {
    fontSize: 12,
    fontWeight: 900,
    color: "#f5c518",
    letterSpacing: "0.06em",
  },
  right: {
    flex: 1,
    padding: "16px 18px 14px 26px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 1,
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  clubName: {
    fontSize: 10,
    fontWeight: 900,
    color: "#0b1120",
    letterSpacing: "0.18em",
    lineHeight: 1,
  },
  official: {
    fontSize: 8,
    fontWeight: 400,
    color: "rgba(11,17,32,0.5)",
    letterSpacing: "0.1em",
    marginTop: 2,
  },
  badge: {
    background: "#0b1120",
    borderRadius: 6,
    padding: "5px 9px",
    display: "flex",
    alignItems: "center",
    gap: 5,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.12em",
  },
  memberName: {
    fontSize: 26,
    fontWeight: 900,
    color: "#0b1120",
    lineHeight: 1,
    letterSpacing: "0.01em",
    marginTop: 6,
  },
  since: {
    fontSize: 10,
    fontWeight: 400,
    color: "rgba(11,17,32,0.52)",
    letterSpacing: "0.08em",
    marginTop: 3,
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    background: "rgba(11,17,32,0.16)",
    margin: "8px 0",
  },
  metaQr: {
    display: "flex",
    alignItems: "flex-end",
    gap: 0,
  },
  meta: {
    flex: 1,
    display: "flex",
    gap: 0,
  },
  detail: {
    flex: 1,
  },
  detailLbl: {
    fontSize: 8,
    fontWeight: 700,
    color: "rgba(11,17,32,0.48)",
    letterSpacing: "0.14em",
    marginBottom: 3,
  },
  detailVal: {
    fontSize: 14,
    fontWeight: 900,
    color: "#0b1120",
    letterSpacing: "0.02em",
    lineHeight: 1,
  },
  detailValExp: {
    fontSize: 14,
    fontWeight: 900,
    color: "#3a1f00",
    letterSpacing: "0.02em",
    lineHeight: 1,
  },
  qrWrap: {
    flexShrink: 0,
    paddingLeft: 12,
    borderLeft: "1px solid rgba(11,17,32,0.16)",
    marginLeft: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
  },
  qrBox: {
    width: 52,
    height: 52,
    background: "#0b1120",
    borderRadius: 6,
    padding: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qrLbl: {
    fontSize: 7,
    fontWeight: 700,
    color: "rgba(11,17,32,0.48)",
    letterSpacing: "0.1em",
    textAlign: "center",
  },
  perksBand: {
    background: "#0b1120",
    padding: "9px 26px 9px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    flexWrap: "wrap",
  },
  perksGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px 18px",
    flex: 1,
  },
  perk: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 9,
    fontWeight: 700,
    color: "rgba(245,197,24,0.8)",
    letterSpacing: "0.08em",
    whiteSpace: "nowrap",
  },
  season: {
    fontSize: 9,
    fontWeight: 400,
    color: "rgba(245,197,24,0.35)",
    letterSpacing: "0.1em",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  chips: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 620,
    width: "100%",
  },
  chip: {
    background: "#1e293b",
    border: "0.5px solid #334155",
    borderRadius: 8,
    padding: "5px 11px",
    fontSize: 12,
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontFamily: "Barlow, sans-serif",
  },
  // Loading / error states
  stateBox: {
    width: "100%",
    maxWidth: 620,
    minHeight: 196,
    background: "#0b1120",
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 12,
    color: "#f5c518",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.1em",
  },
};

// ─── Format helpers ───────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function padId(id) {
  if (!id) return "VFC-??-000000";
  return `VFC-HB-${String(id).padStart(6, "0")}`;
}

// ─── Main component ───────────────────────────────────────────────────────────
/**
 * DigitalMembershipCard
 *
 * Props:
 *   memberId  {string|number}  – Supabase members table row id (required)
 *   clubName  {string}         – Club display name (default: "VILLAREAL FC")
 *   season    {string}         – Season label (default: "2026/27")
 *
 * Supabase table expected schema (table: "members"):
 *   id            integer / uuid
 *   full_name     text
 *   photo_url     text (nullable)
 *   tier          text  ('premium_free' | 'global_fan' | 'honey_badger')
 *   join_date     date
 *   expiry_date   date
 *   billing_cycle text  ('Annual' | 'Monthly')
 *   is_verified   boolean
 */
export default function DigitalMembershipCard({
  memberId,
  clubName = "VILLAREAL FC",
  season = "2026/27",
}) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!memberId) {
      setError("No memberId provided.");
      setLoading(false);
      return;
    }

    async function fetchMember() {
      setLoading(true);
      setError(null);
      const { data, error: sbErr } = await supabase
        .from("members")
        .select("*")
        .eq("id", memberId)
        .single();

      if (sbErr) {
        setError(sbErr.message);
      } else {
        setMember(data);
      }
      setLoading(false);
    }

    fetchMember();
  }, [memberId]);

  // ── Loading state ──
  if (loading) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.stateBox}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" stroke="#f5c518" strokeWidth="2" strokeDasharray="60" strokeLinecap="round">
              <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite" />
            </circle>
          </svg>
          LOADING CARD…
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error || !member) {
    return (
      <div style={styles.wrapper}>
        <div style={{ ...styles.stateBox, color: "#f87171" }}>
          ⚠ {error || "Member not found"}
        </div>
      </div>
    );
  }

  // ── Resolve tier ──
  const tier = TIER_CONFIG[member.tier] || TIER_CONFIG.global_fan;

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@400;600&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hb-card-anim { animation: fadeUp 0.4s ease both; }
      `}</style>

      <div style={styles.wrapper}>
        <p style={styles.previewLbl}>{tier.label} · The ultimate membership</p>

        {/* ── Card ── */}
        <div
          className="hb-card-anim"
          style={{
            ...styles.card,
            background: tier.cardBg,
            border: `2px solid ${tier.cardBorder}`,
          }}
        >
          {/* Hex pattern background */}
          <HexBg />

          {/* Inner row */}
          <div style={styles.inner}>

            {/* LEFT — dark panel */}
            <div style={styles.left}>
              {/* Angled tail */}
              <div style={styles.leftTail} />

              {/* Deco circle */}
              <div style={{
                position: "absolute", width: 90, height: 90,
                background: "rgba(212,168,0,0.1)",
                borderRadius: "50%", top: -25, left: -25,
                pointerEvents: "none",
              }} />

              {/* Photo */}
              <div style={{ ...styles.photo, border: `2.5px solid ${tier.cardBg}` }}>
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.full_name} style={styles.photoImg} />
                ) : (
                  <div style={styles.photoPlaceholder}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(212,168,0,0.45)" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                    <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(212,168,0,0.4)", letterSpacing: "0.1em" }}>PHOTO</span>
                  </div>
                )}
              </div>

              {/* Member ID */}
              <div style={styles.idBlock}>
                <div style={styles.idLbl}>MEMBER ID</div>
                <div style={styles.idVal}>{padId(member.id)}</div>
              </div>
            </div>

            {/* RIGHT — gold panel */}
            <div style={styles.right}>
              {/* Club name + badge */}
              <div style={styles.topRow}>
                <div>
                  <div style={styles.clubName}>{clubName}</div>
                  <div style={styles.official}>OFFICIAL MEMBERSHIP CARD</div>
                </div>
                <div style={styles.badge}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <ellipse cx="7" cy="9" rx="5" ry="3.5" fill={tier.accent} />
                    <ellipse cx="7" cy="6.5" rx="3" ry="2.8" fill={tier.accent} />
                    <ellipse cx="4.8" cy="4.5" rx="1.8" ry="1.4" fill={tier.accent} />
                    <ellipse cx="9.2" cy="4.5" rx="1.8" ry="1.4" fill={tier.accent} />
                    <ellipse cx="5.8" cy="7" rx="0.65" ry="0.65" fill="#0b1120" />
                    <ellipse cx="8.2" cy="7" rx="0.65" ry="0.65" fill="#0b1120" />
                    <path d="M5.8 8.8 Q7 9.8 8.2 8.8" stroke="#0b1120" strokeWidth="0.5" fill="none" strokeLinecap="round" />
                  </svg>
                  <span style={{ ...styles.badgeText, color: tier.accent }}>{tier.label}</span>
                </div>
              </div>

              {/* Name */}
              <div style={styles.memberName}>
                {member.full_name?.toUpperCase() || "—"}
              </div>
              <div style={styles.since}>
                Member since {fmtDate(member.join_date)}
              </div>

              <div style={styles.divider} />

              {/* Meta + QR */}
              <div style={styles.metaQr}>
                <div style={styles.meta}>
                  <div style={styles.detail}>
                    <div style={styles.detailLbl}>JOIN DATE</div>
                    <div style={styles.detailVal}>{fmtDate(member.join_date)}</div>
                  </div>
                  <div style={styles.detail}>
                    <div style={styles.detailLbl}>BILLING</div>
                    <div style={styles.detailVal}>{member.billing_cycle || "Annual"}</div>
                  </div>
                  <div style={styles.detail}>
                    <div style={styles.detailLbl}>EXPIRES</div>
                    <div style={styles.detailValExp}>{fmtDate(member.expiry_date)}</div>
                  </div>
                </div>
                <div style={styles.qrWrap}>
                  <div style={styles.qrBox}>
                    <QRPlaceholder accent={tier.accent} />
                  </div>
                  <div style={styles.qrLbl}>SCAN TO<br />VERIFY</div>
                </div>
              </div>
            </div>
          </div>

          {/* Perks band */}
          <div style={styles.perksBand}>
            <div style={styles.perksGrid}>
              {tier.perks.map((p, i) => (
                <div key={i} style={styles.perk}>
                  <span>{p.icon}</span>
                  {p.text}
                </div>
              ))}
            </div>
            <div style={styles.season}>{season}</div>
          </div>
        </div>

        {/* Chips */}
        <div style={styles.chips}>
          {member.is_verified && (
            <div style={styles.chip}>✅ ID-verified</div>
          )}
          <div style={styles.chip}>📱 Wallet-ready</div>
          <div style={styles.chip}>🔄 Renews {fmtDate(member.expiry_date)}</div>
          {tier.ageRestriction && (
            <div style={styles.chip}>🔒 {tier.ageRestriction}</div>
          )}
          {tier.popularBadge && (
            <div style={{ ...styles.chip, color: "#facc15", borderColor: "#facc15" }}>⭐ MOST POPULAR TIER</div>
          )}
        </div>
      </div>
    </>
  );
}
