# Next.js ISR Demo

## 🚀 Introduction
This project demonstrates **Incremental Static Regeneration (ISR)** in **Next.js App Router**. ISR allows us to regenerate static pages **without requiring a full rebuild**, ensuring fresh content with high performance.

## 📌 Features
- Uses **ISR** with `next: { revalidate: 10 }` to refresh data every 10 seconds.
- Fetches posts from a mock API (`jsonplaceholder.typicode.com`).
- Implements **stale-while-revalidate (SWR)** caching strategy.
- Uses **TypeScript** and **Tailwind CSS** for styling.

## 🏗️ Project Structure
```
📂 app/
 ├── 📂 posts/
 │   ├── 📂 [id]/
 │   │   ├── page.tsx   # ISR-enabled post details page
 │   ├── page.tsx       # Homepage listing posts
 ├── layout.tsx         # Global layout with fonts & styles
 ├── page.tsx           # Main landing page
📂 public/               # Static assets
📂 styles/               # Global styles
📂 types/                # TypeScript types
📜 README.md             # This file
```

## ⚡ Getting Started

### 1️⃣ Install Dependencies
```sh
npm install
# or
yarn install
```

### 2️⃣ Run the Development Server
```sh
npm run dev
```
Then, open [http://localhost:3000](http://localhost:3000) in your browser.

### 3️⃣ Build and Run in Production
```sh
npm run build && npm start
```

## 🛠️ How ISR Works in This Project

### **Home Page (`app/page.tsx`)**
- Fetches the latest posts from an API with **ISR (10s revalidate time)**:
```tsx
const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5', {
    next: { revalidate: 10 }, // ISR: Regenerates every 10 seconds
});
```
- Serves a **stale version instantly** while regenerating a fresh version in the background.

### **Post Page (`app/posts/[id]/page.tsx`)**
- Uses `generateStaticParams()` to define static routes:
```tsx
export async function generateStaticParams() {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const posts = await res.json();
    return posts.map((post) => ({ id: post.id.toString() }));
}
```
- Adds **`dynamicParams = false`** to prevent runtime errors:
```tsx
export const dynamicParams = false;
```

## 📖 Understanding ISR & Stale-While-Revalidate (SWR)
- ISR **serves cached content instantly**.
- Next.js **fetches fresh data in the background** after `revalidate` time.
- If a new request comes **after regeneration**, the user gets the updated version.

```
User Requests Page  →  Old Cached Version Served Instantly
(Meanwhile, Next.js fetches new data in the background)
New Data Available  →  Next Request Gets Updated Page
```

## 🧐 FAQs
### **What happens if the API fails during ISR?**
The old static page remains **until a successful regeneration happens**.

### **How does ISR differ from SSR?**
ISR serves **stale but fast** content and updates it **periodically**, whereas SSR fetches fresh data **on every request**, making it slower.

### **What if I want real-time updates?**
Use **SSR (`fetch()` without `revalidate`)** or **Client-Side Fetching (useSWR, React Query)** instead.

## 🎉 Conclusion
This Next.js demo showcases how **ISR enables static sites to stay dynamic** without losing performance. It blends **speed and freshness** seamlessly!

🚀 **Now, go build something awesome with ISR!**