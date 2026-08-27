import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

export default function MyPosts() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "posts"), where("authorId", "==", currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setPosts(list);
    });
    return unsub;
  }, [currentUser.uid]);

  function handleAction(action, post) {
    if (action === "edit") navigate(`/create?edit=${post.id}`);
  }

  return (
    <div className="page">
      <h2 className="page-title">My Posts</h2>
      {posts.length === 0 && <p className="muted">You haven't posted anything yet.</p>}
      <div className="feed">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            showControls
            onDeleted={(idOrAction, maybePost) => handleAction(idOrAction, maybePost)}
          />
        ))}
      </div>
    </div>
  );
}
