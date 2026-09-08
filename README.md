# AI Receipt Tracker

An **event-driven, AI-powered receipt scanning and expense tracking application** built with Next.js 15, Convex, Inngest, and Claude AI. It automates PDF document parsing, structured data extraction, and real-time state synchronization.

---

## ⚡ Key Architectural Highlights (For Employers & Engineering Teams)

- **Real-Time Reactive UI**: Leverages **Convex WebSocket subscriptions** (`useQuery`) for instant UI updates when background AI processing completes — eliminating manual polling or custom SSE overhead.
- **Asynchronous AI Pipeline**: Uses **Inngest Agent Kit** and **Anthropic (Claude)** for multi-agent PDF OCR and structured JSON data extraction (merchant, total, tax, line items).
- **Decoupled Event Architecture**: PDF uploads trigger background workers asynchronously, maintaining low latency and zero request-blocking on the main HTTP thread.
- **Authentication & Subscription Control**: Enterprise authentication with **Clerk** (JWT integration) and usage-based feature gating powered by **Schematic**.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Backend & Real-time Database**: Convex Serverless DB (WebSockets)
- **Background Jobs & AI Orchestration**: Inngest + Anthropic API (Claude)
- **Authentication**: Clerk
- **Feature Management**: Schematic
- **Styling**: Tailwind CSS, Radix UI primitives, Lucide Icons

---

## 🚀 Quick Start

### 1. Prerequisites & Environment Setup
Clone the repository and copy environment variables:

```bash
cp .env.example .env.local
```

Ensure the following keys are populated in `.env.local`:
- `NEXT_PUBLIC_CONVEX_URL` & `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY` & `CLERK_JWT_ISSUER_DOMAIN`
- `ANTHROPIC_API_KEY`
- `INNGEST_EVENT_KEY` / `INNGEST_SIGNING_KEY`

### 2. Configure Backend Credentials
Set the Clerk JWT domain on your Convex Cloud deployment:

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN <your-clerk-issuer-url>
```

### 3. Install & Launch
Run frontend and backend services concurrently:

```bash
pnpm install
pnpm dev
```

The application will be available at `http://localhost:3000`.
