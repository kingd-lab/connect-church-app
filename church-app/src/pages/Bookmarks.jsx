import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";

export default function Bookmarks() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), where("bookmarkedBy", "array-contains", currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [currentUser.uid]);

  return (
    <div className="page">
      <h2 className="page-title">Bookmarks</h2>
      {posts.length === 0 && <p className="muted">No bookmarked posts yet.</p>}
      <div className="feed">
        {posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}
