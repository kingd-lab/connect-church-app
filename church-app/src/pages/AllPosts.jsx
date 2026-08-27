import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import PostCard from "../components/PostCard";

const PAGE_SIZE = 5;

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [postsShown, setPostsShown] = useState(PAGE_SIZE);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null); // null = not searching

  // Live-updating feed: listens for changes so new/edited/deleted posts show
  // up immediately, without needing to leave and revisit the page.
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(postsShown));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(docs);
      setHasMore(docs.length === postsShown);
      setLoading(false);
    });
    return unsub;
  }, [postsShown]);

  function loadMore() {
    setPostsShown((n) => n + PAGE_SIZE);
  }

  // Simple client-side search across recent posts (title, content, author).
  async function handleSearch(e) {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setSearchResults(null);
      return;
    }
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(200));
    const snap = await getDocs(q);
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const filtered = all.filter((p) =>
      [p.title, p.content, p.authorName]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
    setSearchResults(filtered);
  }

  function clearSearch() {
    setSearchTerm("");
    setSearchResults(null);
  }

  const displayed = searchResults !== null ? searchResults : posts;

  return (
    <div className="page">
      <h2 className="page-title">All Posts</h2>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search posts by title, content, or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn-primary btn-small">Search</button>
        {searchResults !== null && (
          <button type="button" className="btn-secondary btn-small" onClick={clearSearch}>Clear</button>
        )}
      </form>

      {loading && searchResults === null && <p className="muted">Loading...</p>}
      {!loading && displayed.length === 0 && (
        <p className="muted">
          {searchResults !== null ? "No posts match your search." : "No posts yet. Be the first to share!"}
        </p>
      )}

      <div className="feed">
        {displayed.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {searchResults === null && hasMore && (
        <div className="load-more-row">
          <button className="btn-secondary" onClick={loadMore}>Load More</button>
        </div>
      )}
    </div>
  );
}
