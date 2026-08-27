import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db } from "../firebase";

export default function CommunityHub(){
 const [announcements,setAnnouncements]=useState([]),[events,setEvents]=useState([]),[prayers,setPrayers]=useState([]),[studies,setStudies]=useState([]);
 useEffect(()=>onSnapshot(query(collection(db,"announcements"),orderBy("createdAt","desc"),limit(5)),s=>setAnnouncements(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
 useEffect(()=>onSnapshot(query(collection(db,"events"),orderBy("date","asc"),limit(8)),s=>setEvents(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
 useEffect(()=>onSnapshot(query(collection(db,"prayerCalls"),orderBy("date","asc"),limit(5)),s=>setPrayers(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
 useEffect(()=>onSnapshot(query(collection(db,"bibleStudies"),orderBy("date","asc"),limit(5)),s=>setStudies(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
 const card=(icon,title,text,to)=><Link className="hub-card" to={to}><span className="hub-icon">{icon}</span><span><strong>{title}</strong><small>{text}</small></span><b>›</b></Link>;
 return <div className="page hub-page"><div className="hero-card"><span className="eyebrow">Youth community</span><h1>Grow. Connect. Serve.</h1><p>A dedicated space for worship, fellowship, prayer, Bible study and sharing the moments that matter.</p><div className="hero-actions"><Link to="/live" className="btn-primary">🔴 Watch Live</Link><Link to="/create" className="btn-secondary">＋ Share something</Link></div></div>
 <div className="hub-grid">{card("🙏","Prayer Calls","Join the next prayer gathering","/prayer")}{card("📖","Bible Study","Study together and grow","/bible-study")}{card("📅","Events","Youth programs and meetings","/events")}{card("🎞️","Community Feed","Photos, videos and updates","/")}</div>
 <div className="hub-columns"><section className="panel"><div className="section-title"><h3>Announcements</h3><Link to="/events">View all</Link></div>{announcements.length?announcements.map(a=><div className="announcement" key={a.id}><strong>{a.title}</strong><p>{a.body}</p></div>):<p className="muted">No announcements yet.</p>}</section>
 <section className="panel"><div className="section-title"><h3>Coming up</h3><Link to="/events">All events</Link></div>{events.length?events.map(e=><div className="schedule-row" key={e.id}><span className="date-chip">{e.date?.toDate?e.date.toDate().toLocaleDateString(undefined,{month:'short',day:'numeric'}):e.dateText||'Soon'}</span><div><strong>{e.title}</strong><small>{e.time||''} {e.location?`• ${e.location}`:''}</small></div></div>):<p className="muted">No events scheduled.</p>}</section></div>
 <div className="hub-columns"><section className="panel"><div className="section-title"><h3>Prayer this week</h3><Link to="/prayer">Open prayer</Link></div>{prayers.length?prayers.map(p=><div className="schedule-row" key={p.id}><span className="round-icon">🙏</span><div><strong>{p.title}</strong><small>{p.date?.toDate?p.date.toDate().toLocaleString():p.dateText} {p.time?`• ${p.time}`:''}</small></div></div>):<p className="muted">No prayer calls scheduled.</p>}</section>
 <section className="panel"><div className="section-title"><h3>Bible study</h3><Link to="/bible-study">Open study</Link></div>{studies.length?studies.map(s=><div className="schedule-row" key={s.id}><span className="round-icon">📖</span><div><strong>{s.title}</strong><small>{s.date?.toDate?s.date.toDate().toLocaleString():s.dateText} {s.topic?`• ${s.topic}`:''}</small></div></div>):<p className="muted">No studies scheduled.</p>}</section></div></div>
}
