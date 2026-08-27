import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { UsersIcon, SearchIcon, CheckIcon, PlusIcon } from "../components/Icons";

export default function Friends() {
  const { currentUser, profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [sent, setSent] = useState(new Set());

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), s => setUsers(s.docs.map(d => ({ id:d.id, ...d.data() })).filter(u => u.id !== currentUser.uid)));
    const unsubReq = onSnapshot(query(collection(db,"friendRequests"), where("toId","==",currentUser.uid)), s => setRequests(s.docs.map(d=>({id:d.id,...d.data()})).filter(r=>r.status==="pending")));
    const unsubSent = onSnapshot(query(collection(db,"friendRequests"), where("fromId","==",currentUser.uid)), s => setSent(new Set(s.docs.map(d=>d.data()).filter(r=>r.status==="pending").map(r=>r.toId))));
    return () => { unsubUsers(); unsubReq(); unsubSent(); };
  }, [currentUser.uid]);

  async function sendRequest(u) {
    const id = `${currentUser.uid}_${u.id}`;
    await setDoc(doc(db,"friendRequests",id), { fromId:currentUser.uid, fromName:profile?.fullName || currentUser.displayName || "Member", fromPhoto:profile?.photoURL || "", toId:u.id, toName:u.fullName || "Member", status:"pending", createdAt:serverTimestamp() });
  }
  async function respond(r, status) {
    await updateDoc(doc(db,"friendRequests",r.id), { status, respondedAt:serverTimestamp() });
    if (status === "accepted") {
      await setDoc(doc(db,"friendships",`${r.fromId}_${r.toId}`), { users:[r.fromId,r.toId], createdAt:serverTimestamp() });
      await setDoc(doc(db,"friendships",`${r.toId}_${r.fromId}`), { users:[r.fromId,r.toId], createdAt:serverTimestamp() });
    }
  }
  const filtered = users.filter(u => (u.fullName||"").toLowerCase().includes(search.toLowerCase()) || (u.email||"").toLowerCase().includes(search.toLowerCase()));
  return <div className="page social-page">
    <div className="social-heading"><div><span className="eyebrow">Community</span><h1>Friends</h1><p>Connect with people in your church community.</p></div><div className="heading-icon"><UsersIcon/></div></div>
    {requests.length > 0 && <section className="panel"><h3>Friend requests <span className="count-pill">{requests.length}</span></h3><div className="people-grid">{requests.map(r=><div className="person-card" key={r.id}><Avatar name={r.fromName} photo={r.fromPhoto}/><div className="person-main"><strong>{r.fromName}</strong><span>Wants to connect with you</span><div className="person-actions"><button className="btn-primary btn-small" onClick={()=>respond(r,"accepted")}><CheckIcon/> Accept</button><button className="btn-secondary btn-small" onClick={()=>respond(r,"declined")}>Decline</button></div></div></div>)}</div></section>}
    <section className="panel"><div className="section-title"><h3>Find people</h3><div className="mini-search"><SearchIcon/><input placeholder="Search members..." value={search} onChange={e=>setSearch(e.target.value)}/></div></div><div className="people-grid">{filtered.map(u=><div className="person-card" key={u.id}><Avatar name={u.fullName} photo={u.photoURL}/><div className="person-main"><strong>{u.fullName || "Member"}</strong><span>{u.work || u.school || "ChurchConnect member"}</span><button className="btn-secondary btn-small" disabled={sent.has(u.id)} onClick={()=>sendRequest(u)}>{sent.has(u.id)?<><CheckIcon/> Request sent</>:<><PlusIcon/> Add friend</>}</button></div></div>)}</div></section>
  </div>
}
function Avatar({name,photo}) { return photo ? <img className="avatar-md" src={photo} alt=""/> : <span className="avatar-md avatar-placeholder">{name?.[0]||"U"}</span>; }
