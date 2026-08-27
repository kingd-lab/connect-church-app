import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

// Accepts a normal YouTube watch/live URL and converts it to an embeddable URL.
function toEmbedUrl(url) {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1`;
    }
    if (u.hostname.includes("youtube.com")) {
      const videoId = u.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      // channel live URL fallback e.g. youtube.com/@church/live
      if (u.pathname.includes("/live")) {
        const handle = u.pathname.split("/")[1];
        return `https://www.youtube.com/embed/live_stream?channel=${handle}&autoplay=1`;
      }
    }
    return url; // assume already an embed URL (e.g. Facebook plugin, Vimeo)
  } catch {
    return "";
  }
}

export default function LiveStream() {
  const { isAdmin } = useAuth();
  const [stream, setStream] = useState(null);
  const [formUrl, setFormUrl] = useState("");
  const [formTitle, setFormTitle] = useState("");

  useEffect(() => {
    const ref = doc(db, "liveStream", "current");
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setStream(d);
        setFormUrl(d.sourceUrl || "");
        setFormTitle(d.title || "");
      }
    });
    return unsub;
  }, []);

  async function goLive(e) {
    e.preventDefault();
    await setDoc(doc(db, "liveStream", "current"), {
      isLive: true,
      sourceUrl: formUrl,
      title: formTitle,
      startedAt: serverTimestamp(),
    });
  }

  async function endStream() {
    await setDoc(doc(db, "liveStream", "current"), {
      isLive: false,
      sourceUrl: formUrl,
      title: formTitle,
    }, { merge: true });
  }

  const embedUrl = toEmbedUrl(stream?.sourceUrl);

  return (
    <div className="page">
      <h2 className="page-title">Live Service</h2>

      {stream?.isLive ? (
        <div className="live-wrap">
          <div className="live-badge"><span className="live-dot" /> LIVE NOW</div>
          <h3>{stream.title || "Sunday Service"}</h3>
          <div className="video-frame">
            <iframe
              src={embedUrl}
              title="Church Live Stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="muted">Watching worldwide — invite others to join.</p>
        </div>
      ) : (
        <p className="muted">We're not live right now. Check back during service times!</p>
      )}

      {isAdmin && (
        <div className="form-card admin-panel">
          <h3>Admin: Stream Controls</h3>
          <p className="muted small">
            Broadcast from OBS (or your phone) to YouTube Live, then paste the YouTube link here.
            This lets the whole church watch worldwide without any special hardware.
          </p>
          <form onSubmit={goLive}>
            <input
              placeholder="Service title (e.g. Sunday Worship)"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
            <input
              placeholder="YouTube Live URL"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
            />
            <div className="admin-buttons">
              <button type="submit" className="btn-primary">Go Live</button>
              <button type="button" className="btn-secondary" onClick={endStream}>End Stream</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
