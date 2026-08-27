import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addDoc, collection, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { uploadImage } from "../utils/uploadImage";
import { CameraIcon } from "../components/Icons";

export default function CreateAd() {
  const { currentUser, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editId) return;
    (async () => {
      const snap = await getDoc(doc(db, "businessAds", editId));
      if (snap.exists()) {
        const d = snap.data();
        setBusinessName(d.businessName);
        setDescription(d.description);
        setCategory(d.category || "");
        setPhone(d.phone || "");
        setWebsite(d.website || "");
        setLogoPreview(d.imageURL || "");
      }
    })();
  }, [editId]);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    let imageURL = logoFile ? "" : logoPreview; // keep existing logo if no new file chosen
    if (logoFile) {
      imageURL = await uploadImage(logoFile, `businessAds/${currentUser.uid}`);
    }
    if (editId) {
      await updateDoc(doc(db, "businessAds", editId), {
        businessName, description, category, phone, website, imageURL,
      });
    } else {
      await addDoc(collection(db, "businessAds"), {
        businessName, description, category, phone, website, imageURL,
        ownerId: currentUser.uid,
        ownerName: profile?.fullName || currentUser.email,
        createdAt: serverTimestamp(),
      });
    }
    setSaving(false);
    navigate("/business");
  }

  return (
    <div className="page">
      <h2 className="page-title">{editId ? "Edit Business Listing" : "List Your Business"}</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <input placeholder="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
        <textarea placeholder="Describe what you offer" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input placeholder="Category (e.g. Catering, Plumbing, Design)" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input placeholder="Website (optional)" value={website} onChange={(e) => setWebsite(e.target.value)} />
        <label className="upload-label">
          <CameraIcon /> <span>{logoPreview ? "Change Logo" : "Add Logo / Photo"}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} hidden />
        </label>
        {logoPreview && <img src={logoPreview} alt="Logo preview" className="upload-preview" />}
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Uploading..." : editId ? "Update Listing" : "List Business"}
        </button>
      </form>
    </div>
  );
}
