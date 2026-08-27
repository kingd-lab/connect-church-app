import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { XIcon } from "./Icons";

export default function CommentSection({ postId }) {
  const { currentUser, profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [postId]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    await addDoc(collection(db, "posts", postId, "comments"), {
      text: text.trim(),
      authorId: currentUser.uid,
      authorName: profile?.fullName || currentUser.email,
      authorPhoto: profile?.photoURL || "",
      createdAt: serverTimestamp(),
    });
    setText("");
    setPosting(false);
  }

  async function handleDelete(commentId) {
    await deleteDoc(doc(db, "posts", postId, "comments", commentId));
  }

  return (
    <div className="comment-section">
      {comments.map((c) => (
        <div key={c.id} className="comment-row">
          {c.authorPhoto ? (
            <img src={c.authorPhoto} alt="" className="avatar-xs" />
          ) : (
            <span className="avatar-xs avatar-placeholder">{c.authorName?.[0] || "U"}</span>
          )}
          <div className="comment-bubble">
            <span className="comment-author">{c.authorName}</span>
            <span className="comment-text">{c.text}</span>
          </div>
          {c.authorId === currentUser.uid && (
            <button className="comment-delete" onClick={() => handleDelete(c.id)} aria-label="Delete comment">
              <XIcon width={14} height={14} />
            </button>
          )}
        </div>
      ))}
      <form className="comment-form" onSubmit={handleAdd}>
        <input
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn-small btn-primary" disabled={posting || !text.trim()}>
          Post
        </button>
      </form>
    </div>
  );
}
