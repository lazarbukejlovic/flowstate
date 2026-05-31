# Flowstate

> AI Meeting-to-Execution OS

Paste any meeting transcript. Flowstate AI extracts every decision, task, owner, deadline, and risk — and builds a live execution workspace in under 30 seconds.

**Public (no login):** https://flowstate-zeta-henna.vercel.app/ — Q2 Product Launch Sync

---

## The Problem

Every meeting ends with action items scattered across someone's notes, Slack messages, and calendar descriptions. Teams spend 30–60 minutes per meeting translating discussion into structure. Most decisions never reach a shared source of truth. Follow-ups get lost. Owners forget. Deadlines slip.

## What Flowstate Does

Bring a meeting in via any supported source → Flowstate AI (claude-opus-4-7) extracts tasks with owners and deadlines, key decisions with context, risks with severity and mitigation, and follow-up items. A live kanban workspace appears instantly — nothing to set up, nothing to fill in.

---

## Implemented Source Inputs

Flowstate supports multiple ways to create a workspace from `/dashboard/new`:

- **Paste a meeting transcript manually** — works with any text format (Zoom, Teams, Loom, Otter.ai, manual notes).
- **Record a voice note** — capture audio directly in the browser via `MediaRecorder`, then transcribe it to meeting text using the OpenAI Whisper API (server-side `/api/transcribe`, key never leaves the server).
- **Import a Zoom transcript file** — upload a `.vtt`, `.srt`, or `.txt` file exported from a recorded Zoom meeting. Timestamps, cue numbers, and WEBVTT/SRT metadata are parsed out client-side; speaker tags (`<v Name>`) become readable `Name:` prefixes.

All three inputs feed the same transcript-to-workspace pipeline, which generates decisions, owners, action items, risks, follow-ups, and the delivery board.

> **Honest note:** the Zoom flow is a transcript-file import, not a live Zoom OAuth or Cloud Recording API integration. The voice flow uses OpenAI Whisper for transcription, not a custom speech model. Both are deliberately scoped portfolio features.

---

## Core Features

| Feature | Description |
|---|---|
| AI extraction | claude-opus-4-7 extracts tasks, decisions, risks, follow-ups with confidence scores and source quotes |
| Action board | Tabbed workspace: Board (drag-and-drop kanban) · Decisions · Risks · Follow-ups · Activity |
| Task drawer | Slide-in detail view: source quote, AI confidence bar, AI reason, linked decision |
| AI Processing Theater | Step-by-step extraction visualization with live progress (not just a spinner) |
| Public demo | `/demo` — fully interactive workspace with rich data, no login required |
| Flowstate Operator | Animated SVG AI character with orbiting particles, pulse rings, and data fragments |
| Scroll-driven landing | 8-section storytelling page: hero → kinetic words → sticky demo → bento → metrics → team → trust → CTA |
| Kinetic word sequence | 300vh scroll section: capture / extract / execute with animated sub-panels |
| Sticky product demo | 400vh sticky split: Meeting source → AI extraction → Action board → Activity log |
| Metrics section | Count-up numbers: 14s extraction, 6 tasks, 4 decisions, 3 risks, 100% source-linked |
| Team section | 5 role cards: Product Lead, Engineer, Designer, Growth Lead, Client Partner |
| Trust section | 4 trust cards: source links, AI confidence, human-in-the-loop, RBAC |
| Cmd+K palette | Global keyboard command palette (⌘K / Ctrl+K) |
| Copy workspace brief | One-click markdown summary copy for async updates |
| Dashboard | Execution command center — metrics, workspace cards, alerts for high risks |
| Auth | Clerk v7 split-screen sign-in/sign-up |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Auth | Clerk v7 |
| Database | Neon Postgres (serverless) |
| ORM | Prisma v7 with `@prisma/adapter-pg` |
| AI | Anthropic Claude API (`claude-opus-4-7`) |
| Animation | Framer Motion |
| Drag and drop | dnd-kit |
| Deployment | Vercel |

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                         # Landing page (Hero, BentoGrid, ProductStory)
│   ├── layout.tsx                       # Root layout + ClerkProvider + CommandPalette
│   ├── proxy.ts                         # Auth protection (Next.js 16 proxy convention)
│   ├── demo/page.tsx                    # Public demo workspace (no auth required)
│   ├── dashboard/
│   │   ├── page.tsx                     # Execution command center
│   │   └── new/page.tsx                 # Workspace creation + AI Processing Theater
│   ├── workspaces/[id]/page.tsx         # Workspace with tabbed interface
│   ├── sign-in/[[...sign-in]]/page.tsx  # Split-screen + Flowstate Operator
│   ├── sign-up/[[...sign-up]]/page.tsx  # Split-screen + Flowstate Operator
│   └── api/
│       ├── ai/extract/route.ts          # POST: extract meeting data with Claude
│       ├── workspaces/route.ts          # GET/POST workspaces
│       ├── workspaces/[id]/route.ts     # GET single workspace
│       └── tasks/[id]/route.ts          # PATCH task status
├── components/
│   ├── layout/liquid-nav.tsx            # Glass nav + Cmd+K hint + mobile menu
│   ├── landing/
│   │   ├── hero.tsx                     # Multi-phase animated product demo hero
│   │   ├── kinetic-words.tsx            # 300vh scroll section: capture/extract/execute
│   │   ├── sticky-demo.tsx              # 400vh sticky 4-step product demo
│   │   ├── bento-grid.tsx               # 3×2 feature bento grid with hover glow
│   │   ├── metrics.tsx                  # Count-up stats section
│   │   ├── team-section.tsx             # 5 role cards with quotes
│   │   ├── trust-section.tsx            # 4 trust/transparency cards
│   │   └── product-story.tsx            # Stepper, extractions, use-cases, before/after
│   ├── auth/
│   │   └── flowstate-operator.tsx       # Animated SVG AI character
│   ├── dashboard/metric-card.tsx
│   ├── ui/
│   │   └── command-palette.tsx          # Cmd+K global command palette
│   └── workspace/
│       ├── action-board.tsx             # dnd-kit kanban board
│       ├── task-card.tsx                # Draggable task card
│       ├── demo-board.tsx               # Demo-specific board (DemoTask type)
│       ├── task-drawer.tsx              # Demo task detail drawer
│       ├── workspace-task-drawer.tsx    # Real task detail drawer (Prisma Task)
│       ├── workspace-client.tsx         # Tabbed client shell for workspace page
│       ├── team-presence.tsx            # Team avatar strip with online indicators
│       ├── copy-brief.tsx               # Copy workspace markdown brief
│       ├── decision-panel.tsx           # Decision log panel
│       ├── activity-log.tsx             # Activity feed panel
│       └── transcript-generator.tsx     # Transcript form + AI Processing Theater
└── lib/
    ├── prisma.ts                        # PrismaClient singleton (pg adapter)
    ├── ai/extract-meeting.ts            # Claude extraction + DEMO_EXTRACTION fallback
    ├── supabase/client.ts               # Supabase client (presence layer)
    └── demo/
        ├── demo-data.ts                 # Rich static data for /demo (no DB needed)
        └── transcript.ts               # Demo meeting transcript
```

---

## AI Extraction Flow

```
User pastes transcript
        ↓
POST /api/workspaces
        ↓
lib/ai/extract-meeting.ts
        ↓
Claude API (claude-opus-4-7)
        ↓
Strict JSON response:
  workspaceTitle, summary
  decisions[], tasks[], risks[], followUps[]
        ↓
[fallback to DEMO_EXTRACTION if Claude fails]
        ↓
Prisma creates Workspace + Tasks + Decisions + MeetingSource + Risks + FollowUps
        ↓
redirect → /workspaces/[id]
```

---

## Database Model Summary

```
Workspace
  ├── MeetingSource (1:1) → transcript, risks[], followUps[]
  ├── Task[] → title, owner, deadline, priority, status
  ├── Decision[] → title, context, owner
  └── ActivityLog[] → actor, action, detail, timestamp

User (synced from Clerk on first login)
  ├── Membership[] → org + role (OWNER/EDITOR/VIEWER)
  └── Task[] (owned)

Organization (Clerk org support, scaffolded)
  ├── Membership[]
  └── Workspace[]
```

---

## Realtime & Presence

Supabase client is installed and configured. Full realtime subscriptions (live cursor presence, task updates broadcast to collaborators) were designed and scaffolded but deferred for post-MVP to meet the one-day build constraint. The current activity log provides a manual refresh approximation.

---

## Tradeoffs for 1-Day MVP

| Decision | Rationale |
|---|---|
| No full Supabase realtime | Complexity vs. time — activity log provides the "alive" feeling |
| Basic RBAC enforcement | Roles are modeled in DB; deep permission checks deferred to V2 |
| Demo workspace, not live collab | Fastest path to a convincing demo without WebSocket complexity |
| Zoom file import, not Zoom OAuth | Users export a transcript file; live OAuth/Cloud-Recording is a roadmap item |

---

## Future Roadmap

The following are deliberately scoped as future production upgrades — none of these are claimed to exist in the current codebase:

1. **Direct Zoom OAuth / Cloud Recording API** — pull transcripts straight from Zoom without the manual file export step.
2. **Real-time team presence** — Supabase broadcast channels for live cursors and task updates across collaborators.
3. **Slack and Notion exports** — push decisions, tasks, and execution briefs to connected tools.
4. **Context-aware AI assistant inside each workspace** — ask questions about a specific meeting and get answers grounded in its transcript.
5. **Team invites and RBAC** — full permission enforcement with a workspace invite flow on top of the modelled roles.
6. **Mobile meeting capture flow** — record meetings directly from a phone and process them in-app.

---

## Local Setup

```bash
# 1. Clone and install
git clone <repo>
cd flowstate
npm install

# 2. Set environment variables
cp .env.example .env.local
# Fill in: DATABASE_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY,
#          ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Push database schema
npx prisma db push

# 4. Seed demo data
npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed.ts

# 5. Run dev server
npm run dev
```

Open [https://flowstate-zeta-henna.vercel.app/](https://flowstate-zeta-henna.vercel.app/)

---

## Demo Flow

1. Open [https://flowstate-zeta-henna.vercel.app/](https://flowstate-zeta-henna.vercel.app/) — see the landing page with animated hero
2. Click **Try interactive demo** → `/demo` — no login, full workspace with 8 tasks · 4 decisions · 3 risks
3. Click any task card → task detail drawer slides in (source quote, AI confidence, AI reason)
4. Switch tabs: Board · Decisions · Risks · Follow-ups · Activity
5. Press **⌘K** (or Ctrl+K) for command palette
6. Click **Copy workspace brief** → markdown summary copied to clipboard
7. Sign up → Dashboard → **New workspace** → paste transcript or "Load demo transcript →"
8. Watch the AI Processing Theater extract your meeting step by step
9. Workspace appears with all data in tabbed kanban interface

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| `/demo` is fully public | Recruiter-friendly showcase — zero friction to see the product working |
| Static demo data (`demo-data.ts`) | `/demo` never depends on DB availability — always works |
| `proxy.ts` not `middleware.ts` | Next.js 16 breaking change: middleware file convention deprecated |
| `prisma.config.ts` with `defineConfig` | Prisma v7 breaking change: `url` removed from schema datasource |
| `PrismaPg` adapter in `prisma.ts` | Prisma v7 requires explicit adapter for pg connection |
| `forceRedirectUrl` in Clerk | Clerk v7 breaking change: `redirectUrl` deprecated |
| Client shell for workspace tabs | Server fetches data, client handles tab/drawer state — best of both |

---

Built as a portfolio MVP by Lazar Bukejlovic.
