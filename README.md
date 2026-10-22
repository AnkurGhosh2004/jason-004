# LIELOOP (Lie Loop) 👀
> *"How well do you really know your friend's lies?"*

A viral, mobile-first social party web game where creators answer questions secretly about their everyday habits, excuses, and harmless white lies—and friends attempt to predict what they answered.

---

## ⚡ The Core Game Mechanic

1. **Creator creates a test**: Answers 12 questions secretly about their own behavior (e.g., *"When you say 'I'm 5 minutes away', how often are you actually 5 minutes away?"* -> secretly picks *"Rarely"*).
2. **Shareable Link Generated**: Creator receives a unique private link (e.g. `/test/7xK92LmQ`).
3. **Friend opens link**: No account or signup required.
4. **Friend guesses**: The UI clearly prompts: `GUESS WHAT THEY ANSWERED 👀`.
5. **Instant Dramatic Reveal**:
   - **Correct**: *"YOU GOT THEM! 🔥"*, neon green glow, checkmark, confetti burst.
   - **Wrong**: *"NOPE 💀"*, shake animation, red/magenta glow, shows their guess vs the creator's real answer.
6. **Result & Score**: Calculates lie loop score (e.g. `82%`), awards a hilarious tier (e.g. *"YOU CAN READ THEM LIKE A BOOK 📖"* or *"FBI AGENT TIER 🕵️"*), and highlights **"YOUR BIGGEST MISS"**.
7. **Viral Loop**: Friend downloads their result card, shares on WhatsApp/Instagram, and taps **"CREATE MY LIE LOOP"** to challenge the creator back!

---

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS, Vanilla CSS glassmorphism, glowing micro-animations
- **Animation**: Framer Motion
- **Confetti**: canvas-confetti
- **Card Export**: html-to-image
- **Icons**: Lucide React
- **Audio**: Web Audio API Synthesizer (User-controlled toggle, Default: OFF)
- **Database**: Dual-mode Supabase PostgreSQL & High-performance Local In-Memory Fallback

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy the example file:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase PostgreSQL Setup (Optional)

LIELOOP is built with a dual-mode database repository:
- **Out of the box**: Runs immediately with server-state in-memory storage.
- **With Supabase**: Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local`.

Run the SQL migration in your Supabase SQL editor:
```sql
-- See supabase/schema.sql for the full migration
```

### Anti-Cheating & Row Level Security (RLS)
- Creator answers are **never** directly queryable by anonymous public users.
- Server-side verification compares guesses and reveals only the answered question.
- Answers are locked upon submission; previous answers cannot be re-submitted.

---

## 📱 Mobile-First Responsive Design
Tested and optimized for:
- 375px (iPhone SE)
- 390px (iPhone 13/14/15)
- 430px (iPhone 15 Pro Max)
- 768px (iPad / Tablets)
- 1440px+ (Desktop)

---

## 🔒 Privacy & Safety
- **No Required Accounts**: No emails, passwords, phone numbers, or social logins required.
- **Auto-Expiration**: Tests automatically expire after 30 days.
- **Safe URLs**: Uses cryptographically unguessable random slugs (`7xK92LmQ`).
