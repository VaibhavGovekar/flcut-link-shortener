# FLCut - High-Performance Event Link Shortener 🚀

A blazing-fast, robust, and production-ready link shortening platform custom-built for the **Finite Loop Club** recruitments. This application handles custom alias allocation, route hijacking mitigation, and dynamic low-latency redirects utilizing a modern edge-ready full-stack architecture.

# Required quedtions that were asked 
1.I kept the database table incredibly simple because a link shortener doesn't need a heavy structure. I just created a single Link table with a few basic columns:

-A random text id for the primary key,
-A longUrl string to hold the original messy link.
-A shortCode string for the custom alias.
-A standard created At timestamp.

The most important design choice here was putting a @unique constraint on the shortCode column in Prisma. I did this so the database acts as the safety net. If two users try to use the exact same alias at the exact same time like during a busy club event the database will instantly block the second request, completely preventing duplicate link problkem.

2.If i had had a strict 4 hour time limit i would have foucused on getting the long url as in the originial url which we have saved in the database which we ahve have then with a random 6 letter code using nanoid so that whenever someone enters the code in the browser the user is redirected to the website from the long url theni would ahve cut the custom alias box,the reserved word blocklist part and the cuastom css styling part because a link shortener without styling is still a link shortener but a beautiful layout that doesn't actually redirect anyone is useless.

3.The tradeoff i made was accuracy for speed so basically Every single time someone clicks a shortened link, my app goes all the way to my cloud Neon database to fetch the original link or URL,doing a database check every time adds a tiny bit of latency compared to using a fast temporary cache memory.But I gave up that extra speed because I wanted data accuracy.If a club organizer creates a link live during a workshop or an event, I want it to work instantly without waiting for a cache to refresh.

4.OKay the thing that i assumed that the PRD didn't specify was in the custom alsias part using word like admin or api or somthing like that i made it such that whnever someome uses the blocked words the page immediately shows an error message on the the page and does not perform the request  
---

## 🛠️ Tech Stack & Architecture Decisions

* **Framework:** Next.js 15 (App Router) utilizing Server Components for optimal server-side rendering (SSR), minimizing client-side hydration overhead.
* **Database ORM:** Prisma 7 with a tailored PostgreSQL driver adapter setup to optimize connection pooling natively within serverless execution environments.
* **Database Cloud Platform:** Neon Serverless PostgreSQL, providing auto-scaling compute and robust relational persistence.
* **Deployment Host:** Vercel Global Edge Network, ensuring static assets and serverless execution contexts reside as close to the end-user as possible.

---

## System Design & Structural Decisions

### 1. Database Schema Constraints
The relational layout utilizes a strict, minimal footprint to maximize throughput:
* `id`: `String (CUID)` as the primary index key to ensure safe, collision-free cluster scaling without exposing auto-incrementing sequential integers.
* `longUrl`: `String` text field storing the target destination endpoint.
* `shortCode`: `String` indexed with a strict `@unique` database constraint. This forces transactional integrity at the engine level, guaranteeing that data racing or heavy traffic concurrent operations can never generate duplicate shortcut routing blocks.

### 2. High-Performance Redirect Handling
Dynamic parameters are processed via Next.js folder-level catch-all routing (`app/[shortCode]/page.tsx`). 
* **Why Server Components?** Lookups execute entirely on the server side during the initial handshake. 
* **The Workflow:** The system catches the path parameter, directly queries the database via Prisma using a selective `findUnique` execution filter, and issues an instantaneous `redirect()` header response before the browser ever paints a blank document grid.

---

## Engineering Trade-offs & Compromises

### 1. In-Memory System Caching vs. High-Consistency Real-time State
* *The Problem:* Querying the Neon cloud database on every single traversal adds a small network latency hop (roughly 30-50ms).
* *The Trade-off:* We prioritized **Absolute State Consistency** over microsecond edge caching. For high-stakes club events (like recruitment links or immediate form handoffs), organizers frequently modify or create links live. Utilizing real-time database lookups ensures that a newly generated custom alias works instantly worldwide without waiting for an edge cache invalidation window.

### 2. Form Actions vs. Client-Side API Route Frameworks
* *The Decision:* The submission pipeline relies completely on **Next.js Server Actions** (`app/actions.ts`) bound natively to HTML `<form>` nodes.
* *The Advantage:* This eliminates the engineering overhead of building, securing, and maintaining custom REST API endpoints (`/api/shorten`). It ensures progressive enhancement—the form functions completely securely without relying on heavy client-side JavaScript execution, significantly boosting web vitals score metrics.

---

## Edge-Case Implementations & Route Protection

### 1. System Keyword Blocklist
To prevent malicious actors or accidental configurations from hijacking vital application navigation structures, a defensive system blocklist was integrated into the action layer. Keywords such as `admin`, `api`, `dashboard`, and `static` are checked using an $O(1)$ array inclusion scan before database transactions trigger, guaranteeing core routing frameworks remain untouchable.

---

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/VaibhavGovekar/flcut-link-shortener.git](https://github.com/VaibhavGovekar/flcut-link-shortener.git)
   cd flcut-link-shortener

2. **Install core packages:**
   ```Bash
   npm install
   Configure Environment Variables:
   Create a .env file in the root folder and establish your cloud connection string:

3. **Code snippet**
   DATABASE_URL="postgresql://..."
   Sync the Cloud Database Layout:

   ```Bash
   npx prisma db push

**Fire up the local engine:**
   ```Bash
   npm run dev

---

** Step 2: Push Your Final 100% Build To GitHub!**

Save your fresh new file (**Ctrl + S**). Now open your VS Code terminal and run the final push commands to update your repository landing page:

```bash
git add .
git commit -m "docs: compile comprehensive system layout readme and architectural tradeoffs"
git push origin main

----