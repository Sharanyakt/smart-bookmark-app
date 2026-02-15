# Smart Bookmark App 🔖

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

This application allows users to sign in with Google, save bookmarks, and see updates instantly across multiple tabs.

---

## 🚀 Live Demo
Deployed on Vercel.

---

## ✨ Features

- Google OAuth login (no email/password)
- Add bookmarks (title + URL)
- Delete bookmarks
- Data is private to each user
- Real-time updates across tabs
- Responsive UI using Tailwind CSS

---

## 🛠️ Tech Stack

- Next.js
- Supabase (Database + Auth + Realtime)
- Tailwind CSS
- Vercel (Deployment)

---

## 🧠 Architecture Overview

1. User logs in using Google via Supabase Auth.
2. Bookmarks are stored in Supabase Postgres.
3. Row Level Security ensures users only see their own data.
4. Real-time subscriptions update the UI instantly.
5. Hosted on Vercel.

---

## ⚠️ Challenges I Faced

### 1. Google OAuth redirect mismatch  
Login was failing after deployment.

**Solution:**  
Updated the correct Site URL and Redirect URL in Supabase settings.

---

### 2. Environment variables not available in production  
App worked locally but failed on Vercel.

**Solution:**  
Added the Supabase URL and anon key inside Vercel Environment Variables and redeployed.

---

### 3. Understanding real-time listeners  
Initially bookmarks did not refresh automatically.

**Solution:**  
Used Supabase channel subscriptions to listen for INSERT and DELETE events.

---

## 📚 What I Learned

- End-to-end authentication flow.
- Secure database access using RLS.
- Real-time data handling.
- Production deployment process.
- Debugging environment issues.

---

## 🧪 How to Run Locally

```bash
git clone <repo-url>
cd project
npm install
npm run dev
```

Add `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

## 🎯 Future Improvements

- Edit bookmarks
- Tags & filtering
- Search functionality
- Pagination
- Better animations

---

## 👩‍💻 Author

Sharanya KT
