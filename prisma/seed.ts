import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Load .env.local for seed script
const fs = require("fs");
const path = require("path");
try {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  }
} catch {}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean up existing demo data
  await prisma.workspace.deleteMany({ where: { isDemo: true } });

  const demoWorkspace = await prisma.workspace.create({
    data: {
      title: "Q2 Product Launch Sync",
      summary:
        "The team aligned on the Q2 launch timeline with a target date of June 15th. Key decisions were made around feature scope, messaging freeze, and analytics deferral. Engineering will prioritize the beta invite flow while Design finalizes the landing page.",
      isDemo: true,
      meetingSource: {
        create: {
          meetingTitle: "Q2 Product Launch Sync",
          transcript: `
Meeting: Q2 Product Launch Sync
Date: May 26, 2026
Attendees: Maya Chen (Product), Daniel Brooks (Engineering), Sofia Ramirez (Growth), Ethan Cole (Design)

Maya: Let's lock scope today. June 15th is non-negotiable.
Sofia: Landing page messaging freezes Friday — marketing needs two weeks for SEO.
Daniel: Beta invite flow is my top priority. 500 users in-product by June 5th.
Ethan: Analytics dashboard is three weeks of scope we don't have. Move it post-launch.
Maya: Agreed. Sofia owns messaging, Daniel owns beta flow, Ethan owns stripped metrics view.
          `.trim(),
          risks: {
            create: [
              {
                title: "Third-party email provider rate limits during beta send",
                severity: "HIGH",
                mitigation:
                  "Stagger beta invites over 48 hours. Pre-warm sending domain 1 week before launch.",
              },
              {
                title: "Landing page performance on mobile (LCP > 3s)",
                severity: "MEDIUM",
                mitigation:
                  "Run Lighthouse audit this week. Compress hero images and defer non-critical JS.",
              },
              {
                title: "Beta user churn before public launch announcement",
                severity: "LOW",
                mitigation:
                  "Send activation check-in at day 3 and day 7 with concierge support offer.",
              },
            ],
          },
          followUps: {
            create: [
              {
                title: "Schedule pre-launch war room for June 13th",
                ownerName: "Maya Chen",
                completed: false,
              },
              {
                title: "Get legal approval on pricing page claims",
                ownerName: "Sofia Ramirez",
                completed: false,
              },
              {
                title: "Review beta user segment list with Sales",
                ownerName: "Daniel Brooks",
                completed: false,
              },
            ],
          },
        },
      },
      tasks: {
        create: [
          {
            title: "Finalize hero copy and messaging framework",
            description:
              "Lock all headline, subheadline, and CTA copy for the landing page. Get legal sign-off on any data claims.",
            ownerName: "Sofia Ramirez",
            deadline: new Date("2026-05-30"),
            priority: "HIGH",
            status: "IN_PROGRESS",
          },
          {
            title: "Build and test beta invite flow end-to-end",
            description:
              "Implement invite code redemption, onboarding checklist, and confirmation emails. Must handle 500 concurrent users.",
            ownerName: "Daniel Brooks",
            deadline: new Date("2026-06-05"),
            priority: "HIGH",
            status: "TODO",
          },
          {
            title: "Set up launch monitoring and alerting",
            description:
              "Configure error rate, latency, and user activation alerts in Datadog. Define SLOs for launch day.",
            ownerName: "Ethan Cole",
            deadline: new Date("2026-06-10"),
            priority: "MEDIUM",
            status: "TODO",
          },
          {
            title: "Create launch announcement social assets",
            description:
              "Design Twitter/LinkedIn launch post graphics, Product Hunt thumbnail, and press kit images.",
            ownerName: "Maya Chen",
            deadline: new Date("2026-06-08"),
            priority: "MEDIUM",
            status: "TODO",
          },
          {
            title: "Coordinate beta user outreach email sequence",
            description:
              "Draft and schedule 3-email onboarding sequence for beta cohort. Personalize first email.",
            ownerName: "Sofia Ramirez",
            deadline: new Date("2026-06-03"),
            priority: "HIGH",
            status: "TODO",
          },
          {
            title: "Run mobile Lighthouse audit and optimize LCP",
            description:
              "Compress hero images, defer non-critical JS, target LCP < 2.5s on mobile.",
            ownerName: "Ethan Cole",
            deadline: new Date("2026-05-29"),
            priority: "HIGH",
            status: "DONE",
          },
          {
            title: "Integrate beta invite codes into auth flow",
            description:
              "Add invite code validation on signup. Expired/invalid codes should show friendly error.",
            ownerName: "Daniel Brooks",
            deadline: new Date("2026-06-02"),
            priority: "HIGH",
            status: "IN_PROGRESS",
          },
          {
            title: "Prepare Product Hunt launch post and media",
            description:
              "Write PH tagline, description, first comment, and gather maker photos and product GIFs.",
            ownerName: "Maya Chen",
            deadline: new Date("2026-06-12"),
            priority: "MEDIUM",
            status: "BLOCKED",
          },
        ],
      },
      decisions: {
        create: [
          {
            title: "Freeze landing page messaging by Friday, May 30th",
            context:
              "Marketing needs at least 2 weeks for SEO indexing. Any further copy changes after Friday will delay the launch.",
            ownerName: "Sofia Ramirez",
          },
          {
            title: "Ship beta invite flow before full public launch",
            context:
              "Beta cohort of 500 users needs to be in-product at least 1 week before public launch to generate social proof and testimonials.",
            ownerName: "Daniel Brooks",
          },
          {
            title: "Move analytics dashboard to post-launch sprint",
            context:
              "Dashboard adds 3 weeks of scope. The launch can proceed without it; a stripped metrics view will suffice for the beta period.",
            ownerName: "Ethan Cole",
          },
          {
            title: "Launch date is non-negotiable: June 15th",
            context:
              "Board presentation is scheduled June 16th. Marketing campaigns are pre-booked. Any scope that can't ship by June 15th is cut, not delayed.",
            ownerName: "Maya Chen",
          },
        ],
      },
      activityLogs: {
        create: [
          {
            actorName: "Flowstate AI",
            action: "created_workspace",
            detail:
              'Workspace created from meeting: "Q2 Product Launch Sync"',
            createdAt: new Date(Date.now() - 1000 * 60 * 120),
          },
          {
            actorName: "Maya Chen",
            action: "updated_task",
            detail: "Moved \"Finalize hero copy\" to in progress",
            createdAt: new Date(Date.now() - 1000 * 60 * 90),
          },
          {
            actorName: "Ethan Cole",
            action: "completed_task",
            detail: "Completed \"Run mobile Lighthouse audit\"",
            createdAt: new Date(Date.now() - 1000 * 60 * 60),
          },
          {
            actorName: "Daniel Brooks",
            action: "updated_task",
            detail: "Started \"Integrate beta invite codes into auth flow\"",
            createdAt: new Date(Date.now() - 1000 * 60 * 45),
          },
          {
            actorName: "Sofia Ramirez",
            action: "added_decision",
            detail: "Confirmed messaging freeze deadline with marketing team",
            createdAt: new Date(Date.now() - 1000 * 60 * 20),
          },
          {
            actorName: "Maya Chen",
            action: "updated_task",
            detail: 'Blocked "Prepare Product Hunt launch post" — waiting on brand assets',
            createdAt: new Date(Date.now() - 1000 * 60 * 10),
          },
        ],
      },
    },
  });

  console.log(`✓ Created demo workspace: "${demoWorkspace.title}" (${demoWorkspace.id})`);
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
