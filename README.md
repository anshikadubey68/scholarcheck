# ScholarCheck

**AI-powered scholarship scam detection & discovery platform.**

> Live: https://scholarcheck-gray.vercel.app/

ScholarCheck helps students identify fraudulent scholarship offers, discover verified government and private scholarships, match their profile against eligibility criteria, and save opportunities — all in one place.

---

## Features

| Feature | Description |
|---|---|
| 🔍 Scam Detector | Paste any scholarship URL, org name, email or offer text and get an instant risk report (0–100 score) |
| 📋 Verification Report | Detailed PDF-printable report with warning signs, trust indicators and recommended actions |
| 📚 Scholarship Directory | Database-driven directory with multi-filter search (type, level, stream, state, deadline, amount) |
| 🎯 Eligibility Matcher | Fill your student profile and find scholarships you qualify for with match explanations |
| 🔐 Authentication | Register / login / logout with bcrypt-hashed passwords and JWT session cookies |
| 📊 Student Dashboard | Personal dashboard with verification history, saved scholarships and upcoming deadlines |
| 🔖 Bookmarks | Save and manage scholarship bookmarks, persisted per user in the database |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL via [Neon](https://neon.tech) + Prisma ORM
- **Auth:** bcryptjs + jose (JWT), HTTP-only cookies
- **AI:** Google Gemini API (optional, heuristic fallback built-in)
- **Testing:** Vitest

---

## Getting Started (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/anshikadubey68/scholarcheck.git
cd scholarcheck
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Pooled PostgreSQL connection string |
| `DIRECT_URL` | ✅ | Direct (non-pooled) PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Random 32+ character secret string |
| `GEMINI_API_KEY` | Optional | Google Gemini API key for enhanced AI analysis |

### 4. Push database schema and seed data

```bash
npx prisma db push
npx prisma db seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo account:** `student@scholarcheck.org` / `Password123!`

---

## Running Tests

```bash
npm test
```

---

## Deployment (Vercel)

1. Push code to GitHub.
2. Import the repository on [Vercel](https://vercel.com).
3. Add the following **Environment Variables** in Vercel project settings:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `JWT_SECRET`
   - `GEMINI_API_KEY` *(optional)*
4. Set the **Build Command** to:
   ```bash
   npx prisma generate && npx prisma db push && next build
   ```
5. Deploy.

After the first deployment, seed the production database once:
```bash
DATABASE_URL="<your-pooled-url>" DIRECT_URL="<your-direct-url>" npx prisma db seed
```

---

## Project Structure

```
scholarcheck/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/                # API endpoints (analyze, auth, bookmarks, profile)
│   ├── dashboard/          # Protected student dashboard
│   ├── directory/          # Scholarship directory
│   ├── find-scholarships/  # Eligibility matcher
│   ├── login/ register/    # Auth pages
│   └── scholarship/[id]/   # Scholarship detail page
├── components/             # Reusable React components
├── lib/                    # Core logic (detector, auth, prisma, matcher)
│   └── detector/           # Scam detection engine
├── prisma/                 # Prisma schema & seed
├── data/                   # Static reference data (verified orgs, descriptions)
└── hooks/                  # Custom React hooks
```

---

## Security

- All secrets are stored in environment variables — never in code.
- SSRF protection on URL analysis (blocks private IPs, localhost, cloud metadata).
- Rate limiting on the `/api/analyze` endpoint (40 req/min per IP).
- Password hashing with bcryptjs (12 salt rounds).
- JWT sessions via HTTP-only cookies (7-day expiry).
- Input validation and sanitization on all API routes.
- User data is strictly scoped — no cross-user data leakage.
