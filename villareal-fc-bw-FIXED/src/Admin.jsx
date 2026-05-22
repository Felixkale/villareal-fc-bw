import { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"

/* ── BRAND ── */
const NAVY  = "#0D1B3E"
const GOLD  = "#F5C518"
const GOLD2 = "#D4A800"
const WHITE = "#FFFFFF"
const MGRAY = "#888"
const RED   = "#C0392B"
const GREEN = "#27AE60"
const LGRAY = "#F4F6FA"

/* ── ROLES ── */
const ROLES = {
  super_admin: { label:"Super Admin", color:"#7c3aed", can:["all"] },
  editor:      { label:"Editor",      color:NAVY,      can:["news","fixtures","clips","store","players"] },
  moderator:   { label:"Moderator",   color:"#0891b2", can:["members","verification","donations"] },
}

/* ── HELPERS ── */
const Logo = () => (
  <img src="/logo.png" alt="Villareal FC"
    style={{width:36,height:36,borderRadius:"50%",border:`2px solid ${GOLD}`,objectFit:"cover"}}/>
)

const Badge = ({ label, color="#888" }) => (
  <span style={{display:"inline-block",background:color+"22",color,
    border:`1px solid ${color}44`,borderRadius:6,padding:"2px 8px",
    fontSize:11,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",
    letterSpacing:"0.06em",whiteSpace:"nowrap"}}>
    {label}
  </span>
)

const Btn = ({ children, onClick, color=NAVY, small, danger, outline, disabled, style:sx={} }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: small ? "6px 12px" : "10px 20px",
    background: disabled ? "#e5e7eb" : danger ? RED : outline ? "transparent" : color,
    color: disabled ? "#aaa" : outline ? color : WHITE,
    border: outline ? `2px solid ${color}` : "none",
    borderRadius:8, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800,
    fontSize: small ? 12 : 14, letterSpacing:"0.05em",
    WebkitTapHighlightColor:"transparent",
    whiteSpace:"nowrap", ...sx,
  }}>{children}</button>
)

const Card = ({ children, style:sx={} }) => (
  <div style={{background:WHITE,borderRadius:14,padding:"20px",
    boxShadow:"0 1px 8px rgba(0,0,0,0.07)",border:"1px solid #eee",...sx}}>
    {children}
  </div>
)

const SectionTitle = ({ children, action }) => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
      fontSize:22,color:NAVY,margin:0}}>{children}</h2>
    {action}
  </div>
)

const StatBox = ({ label, value, icon, color=NAVY }) => (
  <div style={{background:WHITE,borderRadius:12,padding:"16px",
    boxShadow:"0 1px 6px rgba(0,0,0,0.07)",border:"1px solid #eee",
    display:"flex",alignItems:"center",gap:12}}>
    <div style={{width:44,height:44,borderRadius:10,background:color+"18",
      display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
      {icon}
    </div>
    <div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
        fontSize:26,color,lineHeight:1}}>{value}</div>
      <div style={{fontSize:11,color:MGRAY,marginTop:2,fontWeight:600}}>{label}</div>
    </div>
  </div>
)

const Input = ({ label, ...props }) => (
  <div style={{marginBottom:14}}>
    {label && <label style={{fontSize:11,fontWeight:700,color:MGRAY,
      display:"block",marginBottom:4,letterSpacing:"0.06em",
      fontFamily:"'Barlow Condensed',sans-serif"}}>{label}</label>}
    <input {...props} style={{width:"100%",padding:"10px 12px",borderRadius:8,
      border:"1.5px solid #e5e7eb",fontSize:14,outline:"none",
      boxSizing:"border-box",fontFamily:"inherit",...(props.style||{})}}
      onFocus={e=>e.target.style.borderColor=GOLD}
      onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
  </div>
)

const Textarea = ({ label, ...props }) => (
  <div style={{marginBottom:14}}>
    {label && <label style={{fontSize:11,fontWeight:700,color:MGRAY,
      display:"block",marginBottom:4,letterSpacing:"0.06em",
      fontFamily:"'Barlow Condensed',sans-serif"}}>{label}</label>}
    <textarea {...props} style={{width:"100%",padding:"10px 12px",borderRadius:8,
      border:"1.5px solid #e5e7eb",fontSize:14,outline:"none",resize:"vertical",
      boxSizing:"border-box",fontFamily:"inherit",minHeight:80,...(props.style||{})}}
      onFocus={e=>e.target.style.borderColor=GOLD}
      onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
  </div>
)

const Select = ({ label, children, ...props }) => (
  <div style={{marginBottom:14}}>
    {label && <label style={{fontSize:11,fontWeight:700,color:MGRAY,
      display:"block",marginBottom:4,letterSpacing:"0.06em",
      fontFamily:"'Barlow Condensed',sans-serif"}}>{label}</label>}
    <select {...props} style={{width:"100%",padding:"10px 12px",borderRadius:8,
      border:"1.5px solid #e5e7eb",fontSize:14,outline:"none",background:WHITE,
      boxSizing:"border-box",fontFamily:"inherit",...(props.style||{})}}>
      {children}
    </select>
  </div>
)

const Table = ({ cols, rows, emptyMsg="No data found." }) => (
  <div style={{overflowX:"auto",borderRadius:10,border:"1px solid #eee"}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
      <thead>
        <tr style={{background:LGRAY}}>
          {cols.map((c,i) => (
            <th key={i} style={{padding:"10px 14px",textAlign:"left",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:11,color:MGRAY,letterSpacing:"0.08em",
              whiteSpace:"nowrap",borderBottom:"1px solid #eee"}}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={cols.length}
            style={{padding:"32px",textAlign:"center",color:MGRAY,fontSize:13}}>
            {emptyMsg}
          </td></tr>
        ) : rows.map((row, i) => (
          <tr key={i} style={{borderBottom:"1px solid #f0f0f0",
            background:i%2===0?WHITE:"#fafafa"}}>
            {row.map((cell, j) => (
              <td key={j} style={{padding:"10px 14px",verticalAlign:"middle"}}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

/* ══════════════════════════════════════════════════════════
   SECTIONS
══════════════════════════════════════════════════════════ */

/* DASHBOARD */
const Dashboard = ({ adminUser }) => {
  const [stats, setStats] = useState({ members:0, pending:0, donations:0, news:0 })

  useEffect(() => {
    Promise.all([
      supabase.from("profiles").select("id",{count:"exact"}).eq("is_member",true),
      supabase.from("membership_applications").select("id",{count:"exact"}).eq("status","pending"),
      supabase.from("donations").select("amount"),
      supabase.from("news").select("id",{count:"exact"}),
    ]).then(([m, p, d, n]) => {
      const total = d.data?.reduce((sum,r)=>sum+Number(r.amount),0) || 0
      setStats({
        members: m.count || 0,
        pending: p.count || 0,
        donations: `P${total.toLocaleString()}`,
        news: n.count || 0,
      })
    })
  }, [])

  return (
    <div>
      <SectionTitle>DASHBOARD</SectionTitle>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12,marginBottom:24}}>
        <StatBox label="TOTAL MEMBERS"    value={stats.members}   icon="🦡" color={NAVY}/>
        <StatBox label="PENDING VERIFY"   value={stats.pending}   icon="⏳" color="#f59e0b"/>
        <StatBox label="TOTAL DONATIONS"  value={stats.donations} icon="❤️" color={RED}/>
        <StatBox label="NEWS ARTICLES"    value={stats.news}      icon="📰" color={GREEN}/>
      </div>
      <Card>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:NAVY,marginBottom:12}}>
          QUICK ACTIONS
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
          <Btn color={NAVY} small>+ Add News</Btn>
          <Btn color={GREEN} small>+ Add Fixture</Btn>
          <Btn color="#7c3aed" small>+ Add Clip</Btn>
          <Btn color="#0891b2" small>+ Add Store Item</Btn>
        </div>
      </Card>
    </div>
  )
}

/* MEMBERS */
const Members = () => {
  const [members,  setMembers]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState("all")
  const [search,   setSearch]   = useState("")

  useEffect(() => {
    supabase.from("membership_applications")
      .select("*").order("created_at",{ascending:false})
      .then(({data})=>{ setMembers(data||[]); setLoading(false) })
  },[])

  const filtered = members.filter(m => {
    const matchFilter = filter === "all" || m.status === filter
    const matchSearch = !search || m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const updateStatus = async (id, status) => {
    await supabase.from("membership_applications").update({status}).eq("id",id)
    setMembers(prev => prev.map(m => m.id===id ? {...m,status} : m))
  }

  return (
    <div>
      <SectionTitle>MEMBERS ({members.length})</SectionTitle>
      <Card sx={{marginBottom:16}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <input placeholder="Search name or email..." value={search}
            onChange={e=>setSearch(e.target.value)}
            style={{flex:1,minWidth:200,padding:"8px 12px",borderRadius:8,
              border:"1.5px solid #e5e7eb",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
          {["all","active","pending","rejected"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{
              padding:"7px 14px",borderRadius:8,border:"1.5px solid",
              borderColor:filter===f?NAVY:"#e5e7eb",
              background:filter===f?NAVY:WHITE,
              color:filter===f?WHITE:MGRAY,
              fontSize:12,fontWeight:700,cursor:"pointer",
              fontFamily:"'Barlow Condensed',sans-serif",
              WebkitTapHighlightColor:"transparent",
            }}>{f.toUpperCase()}</button>
          ))}
        </div>
      </Card>
      {loading ? <div style={{textAlign:"center",padding:40,color:MGRAY}}>Loading...</div> : (
        <Table
          cols={["NAME","EMAIL","PLAN","AGE GROUP","STATUS","ACTIONS"]}
          emptyMsg="No members found."
          rows={filtered.map(m=>[
            <span style={{fontWeight:700,color:NAVY}}>{m.full_name||"—"}</span>,
            <span style={{color:MGRAY,fontSize:12}}>{m.email}</span>,
            <Badge label={(m.plan_id||"free").replace("_"," ").toUpperCase()}
              color={m.plan_id==="honey_badger"?GOLD2:m.plan_id==="global_fan"?NAVY:MGRAY}/>,
            <span style={{fontSize:12,color:MGRAY}}>{m.age_group||"—"}</span>,
            <Badge label={m.status?.toUpperCase()||"PENDING"}
              color={m.status==="active"?GREEN:m.status==="rejected"?RED:"#f59e0b"}/>,
            <div style={{display:"flex",gap:6}}>
              {m.status!=="active"&&(
                <Btn small color={GREEN} onClick={()=>updateStatus(m.id,"active")}>Approve</Btn>
              )}
              {m.status!=="rejected"&&(
                <Btn small danger onClick={()=>updateStatus(m.id,"rejected")}>Reject</Btn>
              )}
            </div>,
          ])}
        />
      )}
    </div>
  )
}

/* VERIFICATION */
const Verification = () => {
  const [apps, setApps] = useState([])
  const [sel,  setSel]  = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    supabase.from("membership_applications")
      .select("*").eq("status","pending")
      .not("id_type","is",null)
      .order("created_at",{ascending:true})
      .then(({data})=>{ setApps(data||[]); setLoading(false) })
  },[])

  const decide = async (id, status) => {
    await supabase.from("membership_applications").update({
      status, reviewed_at:new Date().toISOString()
    }).eq("id",id)
    setApps(prev=>prev.filter(a=>a.id!==id))
    setSel(null)
  }

  return (
    <div>
      <SectionTitle>ID VERIFICATION ({apps.length} pending)</SectionTitle>
      {loading ? <div style={{textAlign:"center",padding:40,color:MGRAY}}>Loading...</div> :
      apps.length===0 ? (
        <Card>
          <div style={{textAlign:"center",padding:32}}>
            <div style={{fontSize:40,marginBottom:8}}>✅</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:NAVY}}>
              ALL CLEAR
            </div>
            <div style={{fontSize:13,color:MGRAY,marginTop:4}}>No pending verifications</div>
          </div>
        </Card>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:sel?"1fr 1fr":"1fr",gap:16}}>
          {/* List */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {apps.map(a=>(
              <div key={a.id} onClick={()=>setSel(a)}
                style={{background:WHITE,borderRadius:12,padding:"14px 16px",
                  border:`2px solid ${sel?.id===a.id?NAVY:"#eee"}`,
                  cursor:"pointer",WebkitTapHighlightColor:"transparent",
                  boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontWeight:700,color:NAVY,fontSize:14}}>{a.full_name}</div>
                    <div style={{fontSize:12,color:MGRAY,marginTop:2}}>{a.email}</div>
                    <div style={{fontSize:11,color:MGRAY,marginTop:2}}>
                      {a.id_type?.toUpperCase()} · {a.plan_id?.replace("_"," ").toUpperCase()}
                      · {a.age_group}
                    </div>
                  </div>
                  <Badge label="PENDING" color="#f59e0b"/>
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {sel&&(
            <Card>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:18,color:NAVY,marginBottom:14}}>
                {sel.full_name}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                {[
                  ["Email",    sel.email],
                  ["Plan",     sel.plan_id?.replace("_"," ")],
                  ["Age Group",sel.age_group],
                  ["DOB",      sel.dob],
                  ["ID Type",  sel.id_type],
                  ["Applied",  new Date(sel.created_at).toLocaleDateString()],
                ].map(([label,value])=>(
                  <div key={label} style={{background:LGRAY,borderRadius:8,padding:"8px 10px"}}>
                    <div style={{fontSize:10,color:MGRAY,fontWeight:700,
                      letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{label}</div>
                    <div style={{fontSize:13,color:NAVY,fontWeight:600,marginTop:2}}>{value||"—"}</div>
                  </div>
                ))}
              </div>

              {/* Doc placeholders */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                <div style={{borderRadius:8,border:"1.5px solid #e5e7eb",
                  height:100,display:"flex",alignItems:"center",justifyContent:"center",
                  flexDirection:"column",gap:4,background:LGRAY}}>
                  <span style={{fontSize:24}}>🪪</span>
                  <span style={{fontSize:11,color:MGRAY,fontWeight:600}}>ID FRONT</span>
                  {sel.id_front_url&&<Badge label="UPLOADED" color={GREEN}/>}
                </div>
                {sel.id_type==="license"&&(
                  <div style={{borderRadius:8,border:"1.5px solid #e5e7eb",
                    height:100,display:"flex",alignItems:"center",justifyContent:"center",
                    flexDirection:"column",gap:4,background:LGRAY}}>
                    <span style={{fontSize:24}}>🚗</span>
                    <span style={{fontSize:11,color:MGRAY,fontWeight:600}}>ID BACK</span>
                    {sel.id_back_url&&<Badge label="UPLOADED" color={GREEN}/>}
                  </div>
                )}
                <div style={{borderRadius:8,border:"1.5px solid #e5e7eb",
                  height:100,display:"flex",alignItems:"center",justifyContent:"center",
                  flexDirection:"column",gap:4,background:LGRAY}}>
                  <span style={{fontSize:24}}>🤳</span>
                  <span style={{fontSize:11,color:MGRAY,fontWeight:600}}>SELFIE</span>
                  {sel.selfie_url&&<Badge label="UPLOADED" color={GREEN}/>}
                </div>
              </div>

              <div style={{display:"flex",gap:10}}>
                <Btn color={GREEN} onClick={()=>decide(sel.id,"active")}
                  style={{flex:1}}>✓ APPROVE</Btn>
                <Btn danger onClick={()=>decide(sel.id,"rejected")}
                  style={{flex:1}}>✕ REJECT</Btn>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

/* NEWS */
const News = () => {
  const [articles, setArticles] = useState([])
  const [form,     setForm]     = useState(null) // null=list, {}=new/edit
  const [loading,  setLoading]  = useState(true)

  useEffect(()=>{
    supabase.from("news").select("*").order("created_at",{ascending:false})
      .then(({data})=>{ setArticles(data||[]); setLoading(false) })
  },[])

  const save = async () => {
    if(!form.title?.trim()) return
    if(form.id){
      const {data} = await supabase.from("news").update({
        title:form.title, summary:form.summary,
        body:form.body, tag:form.tag, published:form.published
      }).eq("id",form.id).select()
      setArticles(prev=>prev.map(a=>a.id===form.id?data[0]:a))
    } else {
      const {data} = await supabase.from("news").insert({
        title:form.title, summary:form.summary,
        body:form.body, tag:form.tag||"NEWS", published:form.published||false
      }).select()
      setArticles(prev=>[data[0],...prev])
    }
    setForm(null)
  }

  const del = async (id) => {
    if(!confirm("Delete this article?")) return
    await supabase.from("news").delete().eq("id",id)
    setArticles(prev=>prev.filter(a=>a.id!==id))
  }

  const toggle = async (id, published) => {
    await supabase.from("news").update({published}).eq("id",id)
    setArticles(prev=>prev.map(a=>a.id===id?{...a,published}:a))
  }

  if(form!==null) return (
    <div>
      <SectionTitle>{form.id?"EDIT ARTICLE":"NEW ARTICLE"}</SectionTitle>
      <Card>
        <Input label="TITLE" placeholder="Article title..." value={form.title||""}
          onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
        <Input label="SUMMARY" placeholder="Short summary..." value={form.summary||""}
          onChange={e=>setForm(f=>({...f,summary:e.target.value}))}/>
        <Textarea label="BODY" placeholder="Full article content..."
          value={form.body||""} rows={6}
          onChange={e=>setForm(f=>({...f,body:e.target.value}))}/>
        <Select label="TAG" value={form.tag||"NEWS"}
          onChange={e=>setForm(f=>({...f,tag:e.target.value}))}>
          {["NEWS","MATCH","NEW","SQUAD","TRANSFER","OFFICIAL"].map(t=>(
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <input type="checkbox" id="pub" checked={form.published||false}
            onChange={e=>setForm(f=>({...f,published:e.target.checked}))}/>
          <label htmlFor="pub" style={{fontSize:13,color:NAVY,fontWeight:600}}>
            Publish immediately
          </label>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn onClick={save} style={{flex:1}}>SAVE ARTICLE</Btn>
          <Btn outline color={MGRAY} onClick={()=>setForm(null)} style={{flex:1}}>CANCEL</Btn>
        </div>
      </Card>
    </div>
  )

  return (
    <div>
      <SectionTitle action={<Btn small onClick={()=>setForm({})}>+ NEW ARTICLE</Btn>}>
        NEWS ({articles.length})
      </SectionTitle>
      {loading ? <div style={{textAlign:"center",padding:40,color:MGRAY}}>Loading...</div> : (
        <Table
          cols={["TITLE","TAG","STATUS","DATE","ACTIONS"]}
          emptyMsg="No articles yet."
          rows={articles.map(a=>[
            <span style={{fontWeight:700,color:NAVY,maxWidth:200,display:"block",
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.title}</span>,
            <Badge label={a.tag} color={NAVY}/>,
            <button onClick={()=>toggle(a.id,!a.published)} style={{
              background:a.published?GREEN+"22":RED+"22",
              color:a.published?GREEN:RED,
              border:`1px solid ${a.published?GREEN:RED}44`,
              borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,
              cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>
              {a.published?"LIVE":"DRAFT"}
            </button>,
            <span style={{fontSize:12,color:MGRAY}}>{new Date(a.created_at).toLocaleDateString()}</span>,
            <div style={{display:"flex",gap:6}}>
              <Btn small outline color={NAVY} onClick={()=>setForm(a)}>Edit</Btn>
              <Btn small danger onClick={()=>del(a.id)}>Del</Btn>
            </div>,
          ])}
        />
      )}
    </div>
  )
}

/* FIXTURES */
const Fixtures = () => {
  const [fixtures, setFixtures] = useState([])
  const [form,     setForm]     = useState(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(()=>{
    supabase.from("fixtures").select("*").order("match_date",{ascending:false})
      .then(({data})=>{ setFixtures(data||[]); setLoading(false) })
  },[])

  const save = async () => {
    if(!form.opponent?.trim()||!form.match_date) return
    if(form.id){
      const {data} = await supabase.from("fixtures").update({
        opponent:form.opponent, match_date:form.match_date,
        kick_off:form.kick_off, venue:form.venue,
        competition:form.competition,
        result:form.result||null,
        score_us:form.score_us!==""?Number(form.score_us):null,
        score_them:form.score_them!==""?Number(form.score_them):null,
      }).eq("id",form.id).select()
      setFixtures(prev=>prev.map(f=>f.id===form.id?data[0]:f))
    } else {
      const {data} = await supabase.from("fixtures").insert({
        opponent:form.opponent, match_date:form.match_date,
        kick_off:form.kick_off||"15:00",
        venue:form.venue||"HOME",
        competition:form.competition||"BRFA Division One",
      }).select()
      setFixtures(prev=>[data[0],...prev])
    }
    setForm(null)
  }

  const del = async (id) => {
    if(!confirm("Delete fixture?")) return
    await supabase.from("fixtures").delete().eq("id",id)
    setFixtures(prev=>prev.filter(f=>f.id!==id))
  }

  if(form!==null) return (
    <div>
      <SectionTitle>{form.id?"EDIT FIXTURE":"NEW FIXTURE"}</SectionTitle>
      <Card>
        <Input label="OPPONENT" placeholder="e.g. STONE BREAKERS" value={form.opponent||""}
          onChange={e=>setForm(f=>({...f,opponent:e.target.value}))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Input label="MATCH DATE" type="date" value={form.match_date||""}
            onChange={e=>setForm(f=>({...f,match_date:e.target.value}))}/>
          <Input label="KICK OFF" type="time" value={form.kick_off||"15:00"}
            onChange={e=>setForm(f=>({...f,kick_off:e.target.value}))}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Select label="VENUE" value={form.venue||"HOME"}
            onChange={e=>setForm(f=>({...f,venue:e.target.value}))}>
            <option value="HOME">HOME</option>
            <option value="AWAY">AWAY</option>
          </Select>
          <Input label="COMPETITION" value={form.competition||"BRFA Division One"}
            onChange={e=>setForm(f=>({...f,competition:e.target.value}))}/>
        </div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
          fontSize:11,color:MGRAY,letterSpacing:"0.08em",marginBottom:8}}>
          RESULT (leave blank if upcoming)
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
          <Select label="RESULT" value={form.result||""}
            onChange={e=>setForm(f=>({...f,result:e.target.value}))}>
            <option value="">—</option>
            <option value="W">WIN</option>
            <option value="D">DRAW</option>
            <option value="L">LOSS</option>
          </Select>
          <Input label="OUR SCORE" type="number" min="0" value={form.score_us??""}
            onChange={e=>setForm(f=>({...f,score_us:e.target.value}))}/>
          <Input label="THEIR SCORE" type="number" min="0" value={form.score_them??""}
            onChange={e=>setForm(f=>({...f,score_them:e.target.value}))}/>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn onClick={save} style={{flex:1}}>SAVE FIXTURE</Btn>
          <Btn outline color={MGRAY} onClick={()=>setForm(null)} style={{flex:1}}>CANCEL</Btn>
        </div>
      </Card>
    </div>
  )

  return (
    <div>
      <SectionTitle action={<Btn small onClick={()=>setForm({})}>+ ADD FIXTURE</Btn>}>
        FIXTURES ({fixtures.length})
      </SectionTitle>
      {loading ? <div style={{textAlign:"center",padding:40,color:MGRAY}}>Loading...</div> : (
        <Table
          cols={["DATE","OPPONENT","VENUE","RESULT","COMPETITION","ACTIONS"]}
          emptyMsg="No fixtures yet."
          rows={fixtures.map(f=>[
            <span style={{fontSize:12,color:MGRAY,whiteSpace:"nowrap"}}>
              {new Date(f.match_date).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
            </span>,
            <span style={{fontWeight:700,color:NAVY}}>{f.opponent}</span>,
            <Badge label={f.venue} color={f.venue==="HOME"?GREEN:RED}/>,
            f.result ? (
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <Badge label={f.result==="W"?"WIN":f.result==="D"?"DRAW":"LOSS"}
                  color={f.result==="W"?GREEN:f.result==="D"?"#f59e0b":RED}/>
                <span style={{fontSize:12,color:MGRAY}}>{f.score_us}–{f.score_them}</span>
              </div>
            ) : <Badge label="UPCOMING" color={MGRAY}/>,
            <span style={{fontSize:12,color:MGRAY}}>{f.competition}</span>,
            <div style={{display:"flex",gap:6}}>
              <Btn small outline color={NAVY} onClick={()=>setForm(f)}>Edit</Btn>
              <Btn small danger onClick={()=>del(f.id)}>Del</Btn>
            </div>,
          ])}
        />
      )}
    </div>
  )
}

/* PLAYERS — photo management */
const Players = () => {
  const [photos,    setPhotos]    = useState({})
  const [uploading, setUploading] = useState(null)
  const [filter,    setFilter]    = useState("FIRST TEAM")
  const [err,       setErr]       = useState("")

  const SQUAD = [
    {name:"Buzwani Batsholeng",      id:"007100M97",team:"FIRST TEAM"},
    {name:"Piwane Batsholeng",       id:"007357M87",team:"FIRST TEAM"},
    {name:"Boineelo Better Bofedile",id:"031712M00",team:"FIRST TEAM"},
    {name:"Macdonald Boikanyo",      id:"014130M02",team:"FIRST TEAM"},
    {name:"Koketso Bontsheng",       id:"036247M01",team:"FIRST TEAM"},
    {name:"Gomolemo Dingangano",     id:"038579M01",team:"FIRST TEAM"},
    {name:"Enerst Gabaitumele",      id:"031673M01",team:"FIRST TEAM"},
    {name:"Modiredi Gaboediwe",      id:"026788M01",team:"FIRST TEAM"},
    {name:"Ditsaone Gaeimelwe",      id:"031716M03",team:"FIRST TEAM"},
    {name:"Kagiso George",           id:"024975M03",team:"FIRST TEAM"},
    {name:"Bathobakae Gosetsemang",  id:"038598M02",team:"FIRST TEAM"},
    {name:"Amolemo Kadimo",          id:"031670M02",team:"FIRST TEAM"},
    {name:"Hupaivanda Dennis Kefas", id:"005427M01",team:"FIRST TEAM"},
    {name:"Odirelwe Kereeditse",     id:"021333M02",team:"FIRST TEAM"},
    {name:"Maatla Kereteletswe",     id:"038765M99",team:"FIRST TEAM"},
    {name:"Alson Kgope",             id:"029136M99",team:"FIRST TEAM"},
    {name:"Onneile Lefetamang",      id:"007224M99",team:"FIRST TEAM"},
    {name:"Bosenakitso Lenyatso",    id:"025845M98",team:"FIRST TEAM"},
    {name:"Kgosi Lulane",            id:"035314M02",team:"FIRST TEAM"},
    {name:"Gofamodimo Machangane",   id:"021607M90",team:"FIRST TEAM"},
    {name:"Kefilwe Magono",          id:"040402M97",team:"FIRST TEAM"},
    {name:"Tefho Makobela",          id:"040392M01",team:"FIRST TEAM"},
    {name:"Keoagile Malebogo",       id:"040403M99",team:"FIRST TEAM"},
    {name:"Matlhatsa Matlhatsa",     id:"006990M95",team:"FIRST TEAM"},
    {name:"Pako Moitlhobogi",        id:"039042M03",team:"FIRST TEAM"},
    {name:"Kealeboga Nkinogang",     id:"035846M00",team:"FIRST TEAM"},
    {name:"Mort Pagiwa",             id:"013430M98",team:"FIRST TEAM"},
    {name:"Koketso Sakaio",          id:"025831M00",team:"FIRST TEAM"},
    {name:"Patrick Xhabee",          id:"028470M93",team:"FIRST TEAM"},
    {name:"Ngatangue Daniel",        id:"031714M05",team:"U21"},
    {name:"Kaone Kabelo",            id:"036663M06",team:"U21"},
    {name:"Karabo Michaelson Keikabile",id:"018202M07",team:"U21"},
    {name:"Thabang Kenyaditswe",     id:"018828M06",team:"U21"},
    {name:"Bright Kemo Kesaletseng", id:"036661M06",team:"U21"},
    {name:"Jayson Kgagamedi",        id:"033599M06",team:"U21"},
    {name:"Comfort Moopi Lusha",     id:"031715M04",team:"U21"},
    {name:"Letso Mokwatso",          id:"008702M07",team:"U21"},
    {name:"Mombadi Colin Nengu",     id:"033709M04",team:"U21"},
    {name:"Rankhubu Rankhubu",       id:"033707M06",team:"U21"},
    {name:"Mac Fred Senyashuba",     id:"033703M07",team:"U21"},
    {name:"Emmanuel Virore",         id:"034354M07",team:"U21"},
    {name:"Aniesta Lefa Kgagamedi",  id:"036718M08",team:"U17"},
    {name:"Theo Motlhodi",           id:"036662M09",team:"U17"},
  ]

  useEffect(()=>{
    const load = async () => {
      const {data} = await supabase.storage.from("player-photos").list("",{limit:100})
      if(!data) return
      const map = {}
      data.forEach(f=>{
        const id = f.name.replace(/\.(jpg|jpeg|png|webp)$/i,"")
        const {data:u} = supabase.storage.from("player-photos").getPublicUrl(f.name)
        if(u?.publicUrl) map[id] = u.publicUrl+"?t="+Date.now()
      })
      setPhotos(map)
    }
    load()
  },[])

  const upload = async (player, file) => {
    setUploading(player.id); setErr("")
    try {
      const ext = file.name.split(".").pop().toLowerCase()
      const filename = `${player.id}.${ext}`
      const {error} = await supabase.storage.from("player-photos")
        .upload(filename, file, {upsert:true, contentType:file.type})
      if(error) throw error
      const {data:u} = supabase.storage.from("player-photos").getPublicUrl(filename)
      if(u?.publicUrl) setPhotos(prev=>({...prev,[player.id]:u.publicUrl+"?t="+Date.now()}))
    } catch(e){ setErr(`${player.name}: ${e.message}`) }
    setUploading(null)
  }

  const deletePhoto = async (player) => {
    if(!confirm(`Delete photo for ${player.name}?`)) return
    const ext = photos[player.id]?.split(".").pop()?.split("?")[0]||"jpg"
    await supabase.storage.from("player-photos").remove([`${player.id}.${ext}`])
    setPhotos(prev=>({...prev,[player.id]:null}))
  }

  const triggerUpload = (player) => {
    const inp = document.createElement("input")
    inp.type="file"; inp.accept="image/jpeg,image/png,image/webp"
    inp.onchange=e=>{ if(e.target.files[0]) upload(player,e.target.files[0]) }
    inp.click()
  }

  const filtered = SQUAD.filter(p=>p.team===filter)
  const uploaded = Object.values(photos).filter(Boolean).length

  return (
    <div>
      <SectionTitle>PLAYERS — PHOTO MANAGEMENT</SectionTitle>

      {err&&(
        <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,
          padding:"10px 14px",marginBottom:12,fontSize:13,color:RED,fontWeight:600,
          display:"flex",justifyContent:"space-between"}}>
          ⚠ {err}
          <span onClick={()=>setErr("")} style={{cursor:"pointer",fontWeight:900}}>✕</span>
        </div>
      )}

      <Card sx={{marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          flexWrap:"wrap",gap:10}}>
          <div style={{fontSize:13,color:MGRAY}}>
            <strong style={{color:GREEN}}>{uploaded}</strong> of <strong>{SQUAD.length}</strong> players have photos
          </div>
          <div style={{display:"flex",gap:8}}>
            {["FIRST TEAM","U21","U17"].map(t=>(
              <button key={t} onClick={()=>setFilter(t)} style={{
                padding:"6px 14px",borderRadius:8,border:"1.5px solid",
                borderColor:filter===t?NAVY:"#e5e7eb",
                background:filter===t?NAVY:WHITE,
                color:filter===t?WHITE:MGRAY,
                fontSize:12,fontWeight:700,cursor:"pointer",
                fontFamily:"'Barlow Condensed',sans-serif",
              }}>
                {t} ({SQUAD.filter(p=>p.team===t).length})
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
        {filtered.map(p=>{
          const hasPhoto = !!photos[p.id]
          const isUp     = uploading===p.id
          const initials = p.name.split(" ").map(w=>w[0]).join("").slice(0,2)
          return (
            <div key={p.id} style={{background:WHITE,borderRadius:12,overflow:"hidden",
              border:`2px solid ${hasPhoto?GREEN:"#e5e7eb"}`,
              boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>

              {/* Photo */}
              <div style={{height:130,background:`linear-gradient(135deg,${NAVY},#1a3060)`,
                position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {isUp ? (
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:28,marginBottom:4}}>⏳</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>Uploading...</div>
                  </div>
                ) : hasPhoto ? (
                  <img src={photos[p.id]} alt={p.name}
                    style={{width:"100%",height:"100%",objectFit:"cover",
                      objectPosition:"center top",display:"block"}}
                    onError={e=>{e.target.style.display="none"}}/>
                ) : (
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",
                      fontWeight:900,fontSize:28,color:GOLD}}>{initials}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:4}}>
                      No photo
                    </div>
                  </div>
                )}
                {hasPhoto&&(
                  <div style={{position:"absolute",top:6,right:6,
                    background:GREEN,borderRadius:4,padding:"2px 6px",
                    fontSize:9,color:WHITE,fontWeight:800}}>✓ PHOTO</div>
                )}
              </div>

              {/* Info */}
              <div style={{padding:"10px 10px 8px"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:13,color:NAVY,lineHeight:1.2,marginBottom:4,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {p.name}
                </div>
                <div style={{fontSize:10,color:GOLD2,fontWeight:700,marginBottom:8,
                  fontFamily:"'Barlow Condensed',sans-serif"}}>
                  {p.id}
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>triggerUpload(p)} disabled={isUp}
                    style={{flex:1,padding:"6px 0",background:hasPhoto?"#eef1f8":NAVY,
                      border:"none",borderRadius:6,cursor:isUp?"not-allowed":"pointer",
                      fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                      fontSize:11,color:hasPhoto?NAVY:WHITE}}>
                    {hasPhoto?"Replace":"📷 Upload"}
                  </button>
                  {hasPhoto&&(
                    <button onClick={()=>deletePhoto(p)}
                      style={{padding:"6px 8px",background:"#fef2f2",border:"none",
                        borderRadius:6,cursor:"pointer",fontSize:11,color:RED,
                        fontWeight:700}}>✕</button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* CLIPS */
const Clips = () => {
  const [clips,   setClips]   = useState([])
  const [form,    setForm]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    supabase.from("clips").select("*").order("created_at",{ascending:false})
      .then(({data})=>{ setClips(data||[]); setLoading(false) })
      .catch(()=>setLoading(false))
  },[])

  const save = async () => {
    if(!form.title?.trim()) return
    if(form.id){
      const {data} = await supabase.from("clips").update({
        title:form.title, player_name:form.player_name,
        player_number:form.player_number, tag:form.tag,
        description:form.description, published:form.published,
        video_url:form.video_url,
      }).eq("id",form.id).select()
      setClips(prev=>prev.map(c=>c.id===form.id?data[0]:c))
    } else {
      const {data} = await supabase.from("clips").insert({
        title:form.title, player_name:form.player_name,
        player_number:form.player_number, tag:form.tag||"GOAL ⚽",
        description:form.description, published:form.published||false,
        video_url:form.video_url,
      }).select()
      setClips(prev=>[data[0],...prev])
    }
    setForm(null)
  }

  const del = async (id) => {
    if(!confirm("Delete clip?")) return
    await supabase.from("clips").delete().eq("id",id)
    setClips(prev=>prev.filter(c=>c.id!==id))
  }

  if(form!==null) return (
    <div>
      <SectionTitle>{form.id?"EDIT CLIP":"NEW CLIP"}</SectionTitle>
      <Card>
        <Input label="TITLE" placeholder="e.g. Stunning header vs Stone Breakers"
          value={form.title||""} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Input label="PLAYER NAME" placeholder="e.g. KGOPOTSO NTSHELE"
            value={form.player_name||""} onChange={e=>setForm(f=>({...f,player_name:e.target.value}))}/>
          <Input label="SQUAD NUMBER" placeholder="e.g. #9"
            value={form.player_number||""} onChange={e=>setForm(f=>({...f,player_number:e.target.value}))}/>
        </div>
        <Select label="TAG" value={form.tag||"GOAL ⚽"}
          onChange={e=>setForm(f=>({...f,tag:e.target.value}))}>
          {["GOAL ⚽","ASSIST 🎯","SKILL 🔥","SAVE 🧤","INTERVIEW 🎙️","TRAINING 💪","HIGHLIGHT 🌟"].map(t=>(
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
        <Input label="VIDEO URL (YouTube/Cloudflare/Backblaze)" placeholder="https://..."
          value={form.video_url||""} onChange={e=>setForm(f=>({...f,video_url:e.target.value}))}/>
        <Textarea label="DESCRIPTION / CAPTION"
          value={form.description||""} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <input type="checkbox" id="cpub" checked={form.published||false}
            onChange={e=>setForm(f=>({...f,published:e.target.checked}))}/>
          <label htmlFor="cpub" style={{fontSize:13,color:NAVY,fontWeight:600}}>Publish immediately</label>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn onClick={save} style={{flex:1}}>SAVE CLIP</Btn>
          <Btn outline color={MGRAY} onClick={()=>setForm(null)} style={{flex:1}}>CANCEL</Btn>
        </div>
      </Card>
    </div>
  )

  return (
    <div>
      <SectionTitle action={<Btn small onClick={()=>setForm({})}>+ ADD CLIP</Btn>}>
        CLIPS ({clips.length})
      </SectionTitle>
      {loading ? <div style={{textAlign:"center",padding:40,color:MGRAY}}>Loading...</div> : (
        <Table
          cols={["TITLE","PLAYER","TAG","STATUS","ACTIONS"]}
          emptyMsg="No clips yet. Add your first clip!"
          rows={clips.map(c=>[
            <span style={{fontWeight:700,color:NAVY,maxWidth:200,display:"block",
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.title}</span>,
            <span style={{fontSize:12}}>{c.player_name} {c.player_number}</span>,
            <Badge label={c.tag} color="#7c3aed"/>,
            <Badge label={c.published?"LIVE":"DRAFT"} color={c.published?GREEN:MGRAY}/>,
            <div style={{display:"flex",gap:6}}>
              <Btn small outline color={NAVY} onClick={()=>setForm(c)}>Edit</Btn>
              <Btn small danger onClick={()=>del(c.id)}>Del</Btn>
            </div>,
          ])}
        />
      )}
    </div>
  )
}

/* STORE */
const Store = () => {
  const [items,   setItems]   = useState([])
  const [form,    setForm]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    supabase.from("store_items").select("*").order("created_at",{ascending:false})
      .then(({data})=>{ setItems(data||[]); setLoading(false) })
      .catch(()=>setLoading(false))
  },[])

  const save = async () => {
    if(!form.name?.trim()||!form.price) return
    if(form.id){
      const {data} = await supabase.from("store_items").update({
        name:form.name, price:Number(form.price),
        category:form.category, description:form.description,
        in_stock:form.in_stock, member_discount:form.member_discount||5,
      }).eq("id",form.id).select()
      setItems(prev=>prev.map(i=>i.id===form.id?data[0]:i))
    } else {
      const {data} = await supabase.from("store_items").insert({
        name:form.name, price:Number(form.price),
        category:form.category||"Kit",
        description:form.description,
        in_stock:form.in_stock!==false,
        member_discount:form.member_discount||5,
      }).select()
      setItems(prev=>[data[0],...prev])
    }
    setForm(null)
  }

  if(form!==null) return (
    <div>
      <SectionTitle>{form.id?"EDIT ITEM":"NEW STORE ITEM"}</SectionTitle>
      <Card>
        <Input label="PRODUCT NAME" value={form.name||""}
          onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Input label="PRICE (BWP)" type="number" min="0" value={form.price||""}
            onChange={e=>setForm(f=>({...f,price:e.target.value}))}/>
          <Input label="MEMBER DISCOUNT %" type="number" min="0" max="100"
            value={form.member_discount||5}
            onChange={e=>setForm(f=>({...f,member_discount:e.target.value}))}/>
        </div>
        <Select label="CATEGORY" value={form.category||"Kit"}
          onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
          {["Kit","Training","Accessories","Tickets","Merchandise"].map(c=>(
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <Textarea label="DESCRIPTION" value={form.description||""}
          onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <input type="checkbox" id="instock" checked={form.in_stock!==false}
            onChange={e=>setForm(f=>({...f,in_stock:e.target.checked}))}/>
          <label htmlFor="instock" style={{fontSize:13,color:NAVY,fontWeight:600}}>In Stock</label>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn onClick={save} style={{flex:1}}>SAVE ITEM</Btn>
          <Btn outline color={MGRAY} onClick={()=>setForm(null)} style={{flex:1}}>CANCEL</Btn>
        </div>
      </Card>
    </div>
  )

  return (
    <div>
      <SectionTitle action={<Btn small onClick={()=>setForm({})}>+ ADD ITEM</Btn>}>
        STORE ({items.length} items)
      </SectionTitle>
      {loading ? <div style={{textAlign:"center",padding:40,color:MGRAY}}>Loading...</div> : (
        <Table
          cols={["NAME","PRICE","CATEGORY","DISCOUNT","STOCK","ACTIONS"]}
          emptyMsg="No store items yet."
          rows={items.map(i=>[
            <span style={{fontWeight:700,color:NAVY}}>{i.name}</span>,
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:NAVY}}>
              P{i.price}
            </span>,
            <Badge label={i.category} color={NAVY}/>,
            <span style={{fontSize:12,color:MGRAY}}>{i.member_discount}% off members</span>,
            <Badge label={i.in_stock?"IN STOCK":"OUT"} color={i.in_stock?GREEN:RED}/>,
            <div style={{display:"flex",gap:6}}>
              <Btn small outline color={NAVY} onClick={()=>setForm(i)}>Edit</Btn>
            </div>,
          ])}
        />
      )}
    </div>
  )
}

/* DONATIONS */
const Donations = () => {
  const [donations, setDonations] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [total,     setTotal]     = useState(0)

  useEffect(()=>{
    supabase.from("donations").select("*").order("created_at",{ascending:false})
      .then(({data})=>{
        setDonations(data||[])
        setTotal(data?.reduce((s,d)=>s+Number(d.amount),0)||0)
        setLoading(false)
      })
  },[])

  return (
    <div>
      <SectionTitle>DONATIONS</SectionTitle>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",
        gap:12,marginBottom:20}}>
        <StatBox label="TOTAL RECEIVED"  value={`P${total.toLocaleString()}`} icon="💰" color={GREEN}/>
        <StatBox label="NO. OF DONORS"   value={donations.length}             icon="❤️" color={RED}/>
        <StatBox label="AVG DONATION"    value={donations.length?`P${Math.round(total/donations.length)}`:"—"}
          icon="📊" color={NAVY}/>
      </div>
      {loading ? <div style={{textAlign:"center",padding:40,color:MGRAY}}>Loading...</div> : (
        <Table
          cols={["DONOR","EMAIL","AMOUNT","DATE"]}
          emptyMsg="No donations yet."
          rows={donations.map(d=>[
            <span style={{fontWeight:700,color:NAVY}}>{d.donor_name||"Anonymous"}</span>,
            <span style={{fontSize:12,color:MGRAY}}>{d.email||"—"}</span>,
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:15,color:GREEN}}>P{d.amount}</span>,
            <span style={{fontSize:12,color:MGRAY}}>
              {new Date(d.created_at).toLocaleDateString("en-GB")}
            </span>,
          ])}
        />
      )}
    </div>
  )
}

/* ADMIN USERS */
const AdminUsers = ({ currentAdmin }) => {
  const [admins,  setAdmins]  = useState([])
  const [form,    setForm]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [err,     setErr]     = useState("")

  useEffect(()=>{
    supabase.from("admin_users").select("*").order("created_at")
      .then(({data})=>{ setAdmins(data||[]); setLoading(false) })
  },[])

  const invite = async () => {
    if(!form.email?.trim()||!form.role) return
    setErr("")
    const {error} = await supabase.from("admin_users").insert({
      email:form.email.trim(), role:form.role, invited_by:currentAdmin?.email,
    })
    if(error){ setErr(error.message); return }
    const {data} = await supabase.from("admin_users").select("*").order("created_at")
    setAdmins(data||[])
    setForm(null)
  }

  const remove = async (id) => {
    if(!confirm("Remove this admin?")) return
    await supabase.from("admin_users").delete().eq("id",id)
    setAdmins(prev=>prev.filter(a=>a.id!==id))
  }

  return (
    <div>
      <SectionTitle action={
        currentAdmin?.role==="super_admin"
          ? <Btn small onClick={()=>setForm({role:"editor"})}>+ INVITE ADMIN</Btn>
          : null
      }>
        ADMIN USERS ({admins.length})
      </SectionTitle>

      {form!==null&&(
        <Card sx={{marginBottom:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:16,color:NAVY,marginBottom:14}}>INVITE NEW ADMIN</div>
          <Input label="EMAIL ADDRESS" type="email" placeholder="admin@example.com"
            value={form.email||""} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
          <Select label="ROLE" value={form.role||"editor"}
            onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
            <option value="editor">Editor — manage content</option>
            <option value="moderator">Moderator — manage members</option>
            {currentAdmin?.role==="super_admin"&&(
              <option value="super_admin">Super Admin — full access</option>
            )}
          </Select>
          {err&&<div style={{color:RED,fontSize:12,marginBottom:12,fontWeight:600}}>{err}</div>}
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={invite} style={{flex:1}}>SEND INVITE</Btn>
            <Btn outline color={MGRAY} onClick={()=>setForm(null)} style={{flex:1}}>CANCEL</Btn>
          </div>
        </Card>
      )}

      {loading ? <div style={{textAlign:"center",padding:40,color:MGRAY}}>Loading...</div> : (
        <Table
          cols={["EMAIL","ROLE","INVITED BY","DATE","ACTIONS"]}
          emptyMsg="No admins found."
          rows={admins.map(a=>[
            <span style={{fontWeight:700,color:NAVY}}>{a.email}</span>,
            <Badge label={ROLES[a.role]?.label||a.role}
              color={ROLES[a.role]?.color||MGRAY}/>,
            <span style={{fontSize:12,color:MGRAY}}>{a.invited_by||"—"}</span>,
            <span style={{fontSize:12,color:MGRAY}}>
              {new Date(a.created_at).toLocaleDateString()}
            </span>,
            <div style={{display:"flex",gap:6}}>
              {currentAdmin?.role==="super_admin"&&a.email!==currentAdmin.email&&(
                <Btn small danger onClick={()=>remove(a.id)}>Remove</Btn>
              )}
            </div>,
          ])}
        />
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   ADMIN LOGIN
══════════════════════════════════════════════════════════ */
const AdminLogin = ({ onLogin }) => {
  const [email,   setEmail]   = useState("")
  const [pass,    setPass]    = useState("")
  const [loading, setLoading] = useState(false)
  const [err,     setErr]     = useState("")

  const login = async () => {
    if(!email||!pass){ setErr("Please fill in both fields."); return }
    setLoading(true); setErr("")
    const { error } = await supabase.auth.signInWithPassword({ email, password:pass })
    if(error){ setErr(error.message); setLoading(false); return }
    // Check admin_users table
    const { data } = await supabase.from("admin_users").select("*").eq("email",email.trim()).single()
    if(!data){ await supabase.auth.signOut(); setErr("You are not an admin."); setLoading(false); return }
    onLogin(data)
    setLoading(false)
  }

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${NAVY},#0a1020)`,
      display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{background:WHITE,borderRadius:20,padding:"36px 32px",
        width:"100%",maxWidth:380,boxShadow:"0 24px 64px rgba(0,0,0,0.4)"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <Logo/>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:28,color:NAVY,marginTop:12,letterSpacing:"0.04em"}}>
            ADMIN PANEL
          </div>
          <div style={{fontSize:13,color:MGRAY,marginTop:4}}>Villareal FC · The Honey Badgers</div>
        </div>
        <Input label="EMAIL" type="email" placeholder="admin@villareal.bw"
          value={email} onChange={e=>setEmail(e.target.value)}/>
        <Input label="PASSWORD" type="password" placeholder="••••••••"
          value={pass} onChange={e=>setPass(e.target.value)}/>
        {err&&<div style={{color:RED,fontSize:13,marginBottom:12,fontWeight:600}}>{err}</div>}
        <button onClick={login} disabled={loading}
          style={{width:"100%",padding:"14px",background:loading?"#ccc":NAVY,
            border:"none",borderRadius:10,cursor:loading?"not-allowed":"pointer",
            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,
            color:WHITE,letterSpacing:"0.06em"}}>
          {loading?"SIGNING IN...":"SIGN IN →"}
        </button>
        <div style={{textAlign:"center",marginTop:16,fontSize:12,color:MGRAY}}>
          <a href="/" style={{color:NAVY,fontWeight:700,textDecoration:"none"}}>← Back to app</a>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN ADMIN APP
══════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id:"dashboard",    label:"Dashboard",    icon:"📊", roles:["super_admin","editor","moderator"] },
  { id:"members",      label:"Members",      icon:"🦡", roles:["super_admin","moderator"] },
  { id:"verification", label:"Verification", icon:"🪪", roles:["super_admin","moderator"] },
  { id:"news",         label:"News",         icon:"📰", roles:["super_admin","editor"] },
  { id:"fixtures",     label:"Fixtures",     icon:"⚽", roles:["super_admin","editor"] },
  { id:"players",      label:"Players",      icon:"👤", roles:["super_admin","editor"] },
  { id:"clips",        label:"Clips",        icon:"🎬", roles:["super_admin","editor"] },
  { id:"store",        label:"Store",        icon:"👕", roles:["super_admin","editor"] },
  { id:"donations",    label:"Donations",    icon:"❤️", roles:["super_admin","moderator"] },
  { id:"admins",       label:"Admin Users",  icon:"🔐", roles:["super_admin"] },
]

export default function Admin() {
  const [adminUser,  setAdminUser]  = useState(null)
  const [activeSection, setSection] = useState("dashboard")
  const [sidebarOpen,   setSidebar] = useState(true)
  const [booting,       setBooting] = useState(true)

  useEffect(()=>{
    supabase.auth.getSession().then(async ({data:{session}})=>{
      if(session){
        const {data} = await supabase.from("admin_users")
          .select("*").eq("email",session.user.email).single()
        if(data) setAdminUser(data)
      }
      setBooting(false)
    })
  },[])

  const logout = async () => {
    await supabase.auth.signOut()
    setAdminUser(null)
  }

  if(booting) return (
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${NAVY},#0a1020)`,
      display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{fontSize:40}}>⏳</div>
    </div>
  )

  if(!adminUser) return <AdminLogin onLogin={setAdminUser}/>

  const allowedNav = NAV_ITEMS.filter(n=>n.roles.includes(adminUser.role))

  const renderSection = () => {
    switch(activeSection){
      case "dashboard":    return <Dashboard adminUser={adminUser}/>
      case "members":      return <Members/>
      case "verification": return <Verification/>
      case "news":         return <News/>
      case "fixtures":     return <Fixtures/>
      case "players":      return <Players/>
      case "clips":        return <Clips/>
      case "store":        return <Store/>
      case "donations":    return <Donations/>
      case "admins":       return <AdminUsers currentAdmin={adminUser}/>
      default:             return <Dashboard adminUser={adminUser}/>
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:${LGRAY}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#f0f0f0}
        ::-webkit-scrollbar-thumb{background:#ccc;border-radius:2px}
      `}</style>

      <div style={{display:"flex",minHeight:"100vh"}}>

        {/* ── SIDEBAR ── */}
        <div style={{
          width: sidebarOpen ? 220 : 60,
          background: NAVY,
          display:"flex", flexDirection:"column",
          flexShrink:0, transition:"width 0.2s",
          overflow:"hidden",
        }}>
          {/* Logo */}
          <div style={{padding:"16px 14px",display:"flex",alignItems:"center",
            gap:10,borderBottom:"1px solid rgba(255,255,255,0.1)",flexShrink:0}}>
            <Logo/>
            {sidebarOpen&&(
              <div style={{minWidth:0}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                  fontSize:14,color:WHITE,lineHeight:1,whiteSpace:"nowrap"}}>VILLAREAL FC</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",marginTop:2,whiteSpace:"nowrap"}}>
                  ADMIN PANEL
                </div>
              </div>
            )}
            <button onClick={()=>setSidebar(s=>!s)}
              style={{marginLeft:"auto",background:"none",border:"none",
                color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:16,
                flexShrink:0,WebkitTapHighlightColor:"transparent"}}>
              {sidebarOpen?"◀":"▶"}
            </button>
          </div>

          {/* Nav items */}
          <nav style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
            {allowedNav.map(item=>(
              <button key={item.id} onClick={()=>setSection(item.id)}
                style={{
                  display:"flex", alignItems:"center", gap:10,
                  width:"100%", padding:"11px 14px",
                  background: activeSection===item.id ? "rgba(245,197,24,0.15)" : "none",
                  border:"none", borderLeft: activeSection===item.id ? `3px solid ${GOLD}` : "3px solid transparent",
                  cursor:"pointer", WebkitTapHighlightColor:"transparent",
                  transition:"background 0.15s",
                }}>
                <span style={{fontSize:16,flexShrink:0}}>{item.icon}</span>
                {sidebarOpen&&(
                  <span style={{
                    fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                    fontSize:13,letterSpacing:"0.04em",whiteSpace:"nowrap",
                    color: activeSection===item.id ? GOLD : "rgba(255,255,255,0.7)",
                  }}>{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Admin user + logout */}
          <div style={{borderTop:"1px solid rgba(255,255,255,0.1)",padding:"12px 14px",flexShrink:0}}>
            {sidebarOpen&&(
              <div style={{marginBottom:8}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.8)",fontWeight:600,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {adminUser.email}
                </div>
                <Badge label={ROLES[adminUser.role]?.label||adminUser.role}
                  color={ROLES[adminUser.role]?.color||MGRAY}/>
              </div>
            )}
            <button onClick={logout}
              style={{display:"flex",alignItems:"center",gap:6,background:"none",
                border:"none",cursor:"pointer",color:"rgba(255,255,255,0.5)",
                fontSize:12,WebkitTapHighlightColor:"transparent"}}>
              <span>🚪</span>
              {sidebarOpen&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>
                Sign Out
              </span>}
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Top bar */}
          <div style={{background:WHITE,borderBottom:"1px solid #eee",
            padding:"12px 24px",display:"flex",alignItems:"center",
            justifyContent:"space-between",flexShrink:0}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:18,color:NAVY,letterSpacing:"0.04em"}}>
              {NAV_ITEMS.find(n=>n.id===activeSection)?.icon}{" "}
              {NAV_ITEMS.find(n=>n.id===activeSection)?.label?.toUpperCase()}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <a href="/" target="_blank" rel="noreferrer"
                style={{fontSize:12,color:NAVY,fontWeight:700,textDecoration:"none",
                  padding:"6px 12px",border:`1.5px solid ${NAVY}`,borderRadius:6}}>
                View App ↗
              </a>
              <div style={{width:32,height:32,borderRadius:"50%",
                background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,color:NAVY}}>
                {adminUser.email[0].toUpperCase()}
              </div>
            </div>
          </div>

          {/* Page content */}
          <div style={{flex:1,overflowY:"auto",padding:"24px"}}>
            {renderSection()}
          </div>
        </div>
      </div>
    </>
  )
}
