import { useEffect, useState } from "react";
import { doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import CommentSection from "./CommentSection";
import { HeartIcon, CommentIcon, BookmarkIcon, EditIcon, TrashIcon } from "./Icons";

export default function PostCard({ post, onDeleted, showControls }) {
  const { currentUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const isBookmarked = post.bookmarkedBy?.includes(currentUser?.uid);
  const isLiked = post.likedBy?.includes(currentUser?.uid);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "posts", post.id, "comments"), (snap) => {
      setCommentCount(snap.size);
    });
    return unsub;
  }, [post.id]);

  async function toggleBookmark() {
    setBusy(true);
    const ref = doc(db, "posts", post.id);
    await updateDoc(ref, {
      bookmarkedBy: isBookmarked
        ? arrayRemove(currentUser.uid)
        : arrayUnion(currentUser.uid),
    });
    setBusy(false);
  }

  async function toggleLike() {
    const ref = doc(db, "posts", post.id);
    await updateDoc(ref, {
      likedBy: isLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
    });
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    await deleteDoc(doc(db, "posts", post.id));
    onDeleted?.(post.id);
  }

  return (
    <article className="post-card">
      <header className="post-card-header">
        {post.authorPhoto ? (
          <img src={post.authorPhoto} alt="" className="avatar-sm" />
        ) : (
          <span className="avatar-sm avatar-placeholder">{post.authorName?.[0] || "U"}</span>
        )}
        <div>
          <div className="post-author">{post.authorName}</div>
          <div className="post-date">
            {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : ""}
          </div>
        </div>
      </header>
      <h3 className="post-title">{post.title}</h3>
      {post.imageURL && <img src={post.imageURL} alt="" className="post-image" loading="lazy" />}
      <p className="post-content">{post.content}</p>
      <div className="post-actions">
        <button onClick={toggleLike} className={isLiked ? "action active" : "action"}>
          <HeartIcon filled={isLiked} /> <span>Like{post.likedBy?.length ? ` (${post.likedBy.length})` : ""}</span>
        </button>
        <button className="action" onClick={() => setShowComments((s) => !s)}>
          <CommentIcon /> <span>Comments{commentCount ? ` (${commentCount})` : ""}</span>
        </button>
        <button onClick={toggleBookmark} disabled={busy} className={isBookmarked ? "action active" : "action"}>
          <BookmarkIcon filled={isBookmarked} /> <span>{isBookmarked ? "Saved" : "Save"}</span>
        </button>
        {showControls && (
          <>
            <button className="action" onClick={() => onDeleted?.("edit", post)}><EditIcon /> <span>Edit</span></button>
            <button className="action danger" onClick={handleDelete}><TrashIcon /> <span>Delete</span></button>
          </>
        )}
      </div>
      {showComments && <CommentSection postId={post.id} />}
    </article>
  );
}
