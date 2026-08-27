import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addDoc, collection, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { uploadImage } from "../utils/uploadImage";
import { CameraIcon } from "../components/Icons";

export default function CreatePost() {
  const { currentUser, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editId) return;
    (async () => {
      const snap = await getDoc(doc(db, "posts", editId));
      if (snap.exists()) {
        const d = snap.data();
        setTitle(d.title);
        setContent(d.content);
        setImagePreview(d.imageURL || "");
      }
    })();
  }, [editId]);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    let imageURL = imageFile ? "" : imagePreview; // keep existing URL if no new file chosen
    if (imageFile) {
      imageURL = await uploadImage(imageFile, `posts/${currentUser.uid}`);
    }
    if (editId) {
      await updateDoc(doc(db, "posts", editId), { title, content, imageURL });
    } else {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        imageURL,
        authorId: currentUser.uid,
        authorName: profile?.fullName || currentUser.email,
        authorPhoto: profile?.photoURL || "",
        createdAt: serverTimestamp(),
        likedBy: [],
        bookmarkedBy: [],
      });
    }
    setSaving(false);
    navigate("/my-posts");
  }

  return (
    <div className="page">
      <h2 className="page-title">{editId ? "Edit Post" : "Create Post"}</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="What's on your heart today?" rows={6} value={content} onChange={(e) => setContent(e.target.value)} required />
        <label className="upload-label">
          <CameraIcon /> <span>{imagePreview ? "Change Photo" : "Add Photo (optional)"}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} hidden />
        </label>
        {imagePreview && <img src={imagePreview} alt="Preview" className="upload-preview" />}
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Uploading..." : editId ? "Update Post" : "Publish Post"}
        </button>
      </form>
    </div>
  );
}
