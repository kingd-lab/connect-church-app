import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { uploadImage } from "../utils/uploadImage";
import PostCard from "../components/PostCard";
import { CameraIcon, CheckIcon, BriefcaseIcon, GraduationCapIcon, UsersIcon } from "../components/Icons";

const BIO_WORD_LIMIT = 100;
const RELATIONSHIP_OPTIONS = ["", "Single", "In a relationship", "Engaged", "Married", "It's complicated", "Prefer not to say"];

function wordCount(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export default function Profile() {
  const { currentUser, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("posts");
  const [posts, setPosts] = useState([]);

  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [age, setAge] = useState(profile?.age || "");
  const [work, setWork] = useState(profile?.work || "");
  const [school, setSchool] = useState(profile?.school || "");
  const [relationshipStatus, setRelationshipStatus] = useState(profile?.relationshipStatus || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "posts"), where("authorId", "==", currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setPosts(list);
    });
    return unsub;
  }, [currentUser.uid]);

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    const url = await uploadImage(file, `avatars/${currentUser.uid}`);
    await updateDoc(doc(db, "users", currentUser.uid), { photoURL: url });
    await refreshProfile();
    setAvatarUploading(false);
  }

  async function handleCoverChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setCoverUploading(true);
    const url = await uploadImage(file, `covers/${currentUser.uid}`);
    await updateDoc(doc(db, "users", currentUser.uid), { coverPhoto: url });
    await refreshProfile();
    setCoverUploading(false);
  }

  function handleBioChange(e) {
    const text = e.target.value;
    if (wordCount(text) <= BIO_WORD_LIMIT) setBio(text);
  }

  async function handleSaveAbout(e) {
    e.preventDefault();
    setSaving(true);
    await updateDoc(doc(db, "users", currentUser.uid), {
      fullName,
      age: age ? Number(age) : null,
      work,
      school,
      relationshipStatus,
      bio,
    });
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handlePostAction(idOrAction, post) {
    if (idOrAction === "edit") navigate(`/create?edit=${post.id}`);
  }

  const hasQuickFacts = profile?.work || profile?.school || profile?.relationshipStatus;

  return (
    <div className="profile-page">
      <div
        className="cover-photo"
        style={{ backgroundImage: profile?.coverPhoto ? `url(${profile.coverPhoto})` : undefined }}
      >
        <label className="cover-edit-btn">
          <CameraIcon width={15} height={15} /> {coverUploading ? "Uploading..." : "Edit Cover Photo"}
          <input type="file" accept="image/*" hidden onChange={handleCoverChange} />
        </label>
      </div>

      <div className="profile-header">
        <div className="profile-avatar-wrap">
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="" className="profile-avatar" />
          ) : (
            <span className="profile-avatar avatar-placeholder">{profile?.fullName?.[0] || "U"}</span>
          )}
          <label className="avatar-edit-btn" title="Change profile picture">
            {avatarUploading ? "…" : <CameraIcon width={14} height={14} />}
            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          </label>
        </div>
        <div className="profile-info">
          <h2>{profile?.fullName}</h2>
          <p className="muted small">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {(profile?.bio || hasQuickFacts) && (
        <div className="profile-summary">
          {profile?.bio && <p className="profile-bio">{profile.bio}</p>}
          {hasQuickFacts && (
            <ul className="profile-facts">
              {profile.work && <li><BriefcaseIcon width={16} height={16} /> Works at {profile.work}</li>}
              {profile.school && <li><GraduationCapIcon width={16} height={16} /> Studied at {profile.school}</li>}
              {profile.relationshipStatus && <li><UsersIcon width={16} height={16} /> {profile.relationshipStatus}</li>}
            </ul>
          )}
        </div>
      )}

      <div className="profile-tabs">
        <button className={tab === "posts" ? "tab active" : "tab"} onClick={() => setTab("posts")}>Posts</button>
        <button className={tab === "about" ? "tab active" : "tab"} onClick={() => setTab("about")}>About</button>
      </div>

      <div className="page">
        {tab === "posts" && (
          <div className="feed">
            {posts.length === 0 && <p className="muted">No posts yet.</p>}
            {posts.map((post) => (
              <PostCard key={post.id} post={post} showControls onDeleted={handlePostAction} />
            ))}
          </div>
        )}

        {tab === "about" && (
          <form className="form-card" onSubmit={handleSaveAbout}>
            <label>Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} />

            <label>Email</label>
            <input value={currentUser.email} disabled />

            <label>Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />

            <label>Workplace</label>
            <input
              value={work}
              onChange={(e) => setWork(e.target.value)}
              placeholder="e.g. Grace Community Church, or your employer"
            />

            <label>School</label>
            <input
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g. Your school or university"
            />

            <label>Relationship Status</label>
            <select value={relationshipStatus} onChange={(e) => setRelationshipStatus(e.target.value)}>
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt || "Prefer not to say"}</option>
              ))}
            </select>

            <label>Bio</label>
            <textarea
              rows={5}
              placeholder="Tell the church about yourself — your story, your family, what you're passionate about..."
              value={bio}
              onChange={handleBioChange}
            />
            <p className="muted small word-counter">{wordCount(bio)}/{BIO_WORD_LIMIT} words</p>

            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && <p className="success-text"><CheckIcon width={15} height={15} /> Profile updated</p>}
          </form>
        )}
      </div>
    </div>
  );
}
