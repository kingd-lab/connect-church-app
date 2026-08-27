import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { PlusIcon, PhoneIcon, GlobeIcon, EditIcon, TrashIcon } from "../components/Icons";

export default function BusinessAds() {
  const { currentUser } = useAuth();
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "businessAds"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setAds(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  async function handleDelete(id) {
    if (!confirm("Remove this business listing?")) return;
    await deleteDoc(doc(db, "businessAds", id));
  }

  return (
    <div className="page">
      <div className="page-header-row">
        <h2 className="page-title">Member Business Directory</h2>
        <Link to="/business/new" className="btn-primary btn-small">
          <PlusIcon width={16} height={16} /> List Your Business
        </Link>
      </div>
      <p className="muted">Support fellow members — browse businesses and services offered by our church family.</p>
      {ads.length === 0 && <p className="muted">No businesses listed yet.</p>}
      <div className="ads-grid">
        {ads.map((ad) => (
          <div key={ad.id} className="ad-card">
            {ad.imageURL && <img src={ad.imageURL} alt="" className="ad-image" />}
            <div className="ad-body">
              <h3>{ad.businessName}</h3>
              <p className="muted small">by {ad.ownerName}</p>
              <p>{ad.description}</p>
              {ad.category && <span className="post-tag">{ad.category}</span>}
              <div className="ad-contact">
                {ad.phone && <div><PhoneIcon width={15} height={15} /> {ad.phone}</div>}
                {ad.website && <div><GlobeIcon width={15} height={15} /> <a href={ad.website} target="_blank" rel="noreferrer">{ad.website}</a></div>}
              </div>
              {ad.ownerId === currentUser.uid && (
                <div className="ad-owner-actions">
                  <Link to={`/business/new?edit=${ad.id}`} className="action"><EditIcon /> <span>Edit / Change Logo</span></Link>
                  <button className="action danger" onClick={() => handleDelete(ad.id)}><TrashIcon /> <span>Remove</span></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
