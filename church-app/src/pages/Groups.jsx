import { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, updateDoc, doc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { GroupIcon, PlusIcon, UsersIcon } from "../components/Icons";

const presets=["Youth & Young Adults","Bible Study","Choir & Music","Men's Fellowship","Women's Fellowship","Media & Technical"];
export default function Groups(){
 const {currentUser,profile}=useAuth(); const [groups,setGroups]=useState([]); const [show,setShow]=useState(false); const [name,setName]=useState(""); const [description,setDescription]=useState("");
 useEffect(()=>onSnapshot(collection(db,"groups"),s=>setGroups(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
 async function create(e){e.preventDefault();if(!name.trim())return;await addDoc(collection(db,"groups"),{name:name.trim(),description:description.trim(),ownerId:currentUser.uid,ownerName:profile?.fullName||"Member",members:[currentUser.uid],createdAt:serverTimestamp()});setName("");setDescription("");setShow(false)}
 async function join(g){await updateDoc(doc(db,"groups",g.id),{members:arrayUnion(currentUser.uid)})}
 return <div className="page social-page"><div className="social-heading"><div><span className="eyebrow">Community spaces</span><h1>Groups</h1><p>Find your people, grow together and keep church communities connected.</p></div><button className="btn-primary" onClick={()=>setShow(!show)}><PlusIcon/> Create group</button></div>
 {show&&<form className="panel form-card-wide" onSubmit={create}><h3>Create a group</h3><input value={name} onChange={e=>setName(e.target.value)} placeholder="Group name" required/><textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="What is this group about?" rows="3"/><div className="form-actions"><button type="button" className="btn-secondary" onClick={()=>setShow(false)}>Cancel</button><button className="btn-primary">Create group</button></div></form>}
 <div className="group-suggestions"><div><h3>Popular communities</h3><div className="chips">{presets.map(x=><span key={x}>{x}</span>)}</div></div></div>
 <div className="groups-grid">{groups.map(g=>{const joined=g.members?.includes(currentUser.uid);return <article className="group-card" key={g.id}><div className="group-cover"><GroupIcon/></div><div className="group-body"><h3>{g.name}</h3><p>{g.description||"A ChurchConnect community."}</p><span className="group-meta"><UsersIcon/> {g.members?.length||0} member{(g.members?.length||0)===1?"":"s"}</span><button className={joined?"btn-secondary":"btn-primary"} disabled={joined} onClick={()=>join(g)}>{joined?"Joined":"Join group"}</button></div></article>})}</div>{groups.length===0&&<div className="empty-state"><GroupIcon/><h3>No groups yet</h3><p>Create the first community for your church.</p></div>}</div>
}
