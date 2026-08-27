# ChurchConnect

A Facebook-style multi-user church app: news feed of posts, live service streaming,
and a member business directory — built with React (Vite) + Firebase.

## Features
- Email/password auth, Facebook-style profile (cover photo, avatar, bio, Posts/About tabs)
- Real image uploads (profile picture, cover photo, post photos, business logos) via Firebase Storage
- Facebook-style navbar with mobile hamburger menu
- All Posts feed (everyone's posts, newest first), paginated 5 at a time via "Load More"
- Search posts by title, content, or author
- My Posts (edit/delete only your own)
- Bookmarks (per-user, private)
- Likes on posts
- Comments on posts (add/delete your own, live-updating)
- Dark mode toggle (persisted per-device)
- Responsive mobile layout
- Business Ads: members list their business/services with an uploadable, changeable logo — visible to everyone, editable only by the owner
- Live Stream: admin pastes a YouTube Live link, it's embedded for the whole congregation, worldwide

### Notes on Search & Pagination
The main feed uses paged queries (`limit`/`startAfter`) instead of a live listener, so pagination
works correctly — this means new posts from other users appear after a refresh or "Load More,"
not instantly. Search does a case-insensitive scan across your 200 most recent posts (Firestore
doesn't support full-text search natively); for a large congregation, swap this for a dedicated
search service like Algolia or Typesense down the line.

## Setup

### 1. Install dependencies
```
npm install
```

### 2. Create a Firebase project
1. Go to https://console.firebase.google.com and create a project (free Spark plan is enough to start).
2. Enable **Authentication > Sign-in method > Email/Password**.
3. Enable **Firestore Database** (start in production mode).
4. Enable **Storage** (needed for profile pictures, cover photos, post photos, and business logos).
5. In Project Settings > General, add a Web App and copy the config values.

### 3. Configure environment
Copy `.env.example` to `.env` and paste in your Firebase config values.

### 4. Deploy security rules
Install the Firebase CLI (`npm i -g firebase-tools`), then:
```
firebase login
firebase init firestore storage   # point it at this project, use the existing .rules files
firebase deploy --only firestore:rules,storage:rules
```

### 5. Run locally
```
npm run dev
```

### 6. Make yourself an admin (needed for Live Stream controls)
Sign up normally in the app, then in the Firebase Console > Firestore, open your document
under `users/{yourUid}` and change `role` from `"member"` to `"admin"`.

## How live streaming actually works here
There's no way to build custom broadcast (WebRTC/RTMP) infrastructure without a dedicated
video service — so this app uses the same proven approach most churches use:
1. On Sunday, the church broadcasts via free software (OBS Studio) or a phone, straight to
   **YouTube Live** (Church → YouTube Studio → Go Live).
2. An admin opens `/live` in ChurchConnect, pastes the YouTube Live URL, and clicks "Go Live."
3. The app embeds that stream — anyone in the world with the app open can watch in real time.

**Want native in-app streaming later** (no YouTube branding, lower latency)? Swap the
`<iframe>` in `src/pages/LiveStream.jsx` for a provider like **Mux**, **Agora**, or **LiveKit** —
they handle the actual video infrastructure and give you an SDK to embed instead.

## Deploying
Once built (`npm run build`), the `dist/` folder can be deployed for free on
**Firebase Hosting**, Vercel, or Netlify.

## Data model (Firestore)
- `users/{uid}` — fullName, email, age, photoURL, coverPhoto, work, school, relationshipStatus, bio (100-word soft limit), role ("member" | "admin")
- `posts/{id}` — title, content, authorId, authorName, authorPhoto, createdAt, imageURL, likedBy[], bookmarkedBy[]
- `posts/{id}/comments/{id}` — text, authorId, authorName, authorPhoto, createdAt
- `businessAds/{id}` — businessName, description, category, phone, website, imageURL, ownerId, ownerName, createdAt
- `liveStream/current` — isLive, sourceUrl, title, startedAt

## Storage layout (Firebase Storage)
- `avatars/{uid}/...` — profile pictures
- `covers/{uid}/...` — profile cover photos
- `posts/{uid}/...` — post photos
- `businessAds/{uid}/...` — business logos
