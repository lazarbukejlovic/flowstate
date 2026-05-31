export type DemoTask = {
  id: string;
  title: string;
  description: string;
  ownerName: string;
  ownerInitials: string;
  ownerColor: string;
  deadline: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
  sourceQuote: string;
  aiConfidence: number;
  aiReason: string;
  relatedDecision?: string;
};

export type DemoDecision = {
  id: string;
  title: string;
  context: string;
  ownerName: string;
  createdAt: string;
};

export type DemoRisk = {
  id: string;
  title: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  mitigation: string;
};

export type DemoFollowUp = {
  id: string;
  title: string;
  ownerName: string;
  completed: boolean;
};

export type DemoActivity = {
  id: string;
  actorName: string;
  actorInitials: string;
  actorColor: string;
  action: string;
  detail: string;
  time: string;
};

export type DemoTeamMember = {
  name: string;
  role: string;
  initials: string;
  color: string;
  online: boolean;
};

export const DEMO_TEAM: DemoTeamMember[] = [
  { name: "Maya Chen", role: "Product", initials: "MC", color: "violet", online: true },
  { name: "Daniel Brooks", role: "Engineering", initials: "DB", color: "blue", online: true },
  { name: "Sofia Ramirez", role: "Growth", initials: "SR", color: "emerald", online: false },
  { name: "Ethan Cole", role: "Design", initials: "EC", color: "amber", online: true },
];

export const DEMO_TASKS: DemoTask[] = [
  {
    id: "t1",
    title: "Finalize hero copy and messaging framework",
    description: "Lock all headline, subheadline, and CTA copy for the landing page. Get legal sign-off on any data claims. Coordinate with SEO team on keyword density before freeze.",
    ownerName: "Sofia Ramirez",
    ownerInitials: "SR",
    ownerColor: "emerald",
    deadline: "May 30",
    priority: "HIGH",
    status: "IN_PROGRESS",
    sourceQuote: "Marketing needs at least 2 weeks for SEO indexing. Any further copy changes after Friday will delay the launch.",
    aiConfidence: 96,
    aiReason: "Sofia was explicitly assigned by Maya with a hard Friday deadline confirmed by two participants. Priority inferred from 'non-negotiable' language.",
    relatedDecision: "Freeze landing page messaging by Friday",
  },
  {
    id: "t2",
    title: "Build and test beta invite flow end-to-end",
    description: "Implement invite code redemption, onboarding checklist, and confirmation emails. Must handle 500 concurrent users. Load test with realistic cohort.",
    ownerName: "Daniel Brooks",
    ownerInitials: "DB",
    ownerColor: "blue",
    deadline: "Jun 5",
    priority: "HIGH",
    status: "IN_PROGRESS",
    sourceQuote: "If Sofia gives me the invite copy by end of this week, I can have the invite redemption and onboarding checklist done by June 5th.",
    aiConfidence: 98,
    aiReason: "Daniel committed to this explicitly with a specific date. Task scope confirmed by follow-up question from Maya.",
    relatedDecision: "Ship beta invite flow before full launch",
  },
  {
    id: "t3",
    title: "Integrate beta invite codes into auth flow",
    description: "Add invite code validation on signup. Expired/invalid codes should show friendly error. Block sign-up for non-invite users during beta period.",
    ownerName: "Daniel Brooks",
    ownerInitials: "DB",
    ownerColor: "blue",
    deadline: "Jun 2",
    priority: "HIGH",
    status: "TODO",
    sourceQuote: "We should test with the full 500-user load too.",
    aiConfidence: 88,
    aiReason: "Implied prerequisite for the beta invite flow. Daniel is the natural owner given the broader invite system ownership.",
    relatedDecision: "Ship beta invite flow before full launch",
  },
  {
    id: "t4",
    title: "Set up launch monitoring and alerting",
    description: "Configure error rate, latency, and user activation alerts in Datadog. Define SLOs for launch day. Create runbook for on-call team.",
    ownerName: "Ethan Cole",
    ownerInitials: "EC",
    ownerColor: "amber",
    deadline: "Jun 10",
    priority: "MEDIUM",
    status: "TODO",
    sourceQuote: "Ethan, can you own that? Set up launch monitoring — error rates and latency alerts in Datadog — by June 10th.",
    aiConfidence: 97,
    aiReason: "Direct assignment by Maya with explicit deadline. Ethan confirmed verbally.",
    relatedDecision: undefined,
  },
  {
    id: "t5",
    title: "Create launch announcement social assets",
    description: "Design Twitter/LinkedIn launch post graphics, Product Hunt thumbnail, and press kit images. Align with messaging freeze on Friday.",
    ownerName: "Maya Chen",
    ownerInitials: "MC",
    ownerColor: "violet",
    deadline: "Jun 8",
    priority: "MEDIUM",
    status: "TODO",
    sourceQuote: "Maya Chen on comms will handle the social assets — target June 8th.",
    aiConfidence: 91,
    aiReason: "Task self-assigned by Maya with explicit date. Linked to the social launch sequence.",
    relatedDecision: undefined,
  },
  {
    id: "t6",
    title: "Run mobile Lighthouse audit and optimize LCP",
    description: "Compress hero images, defer non-critical JS, target LCP < 2.5s on mobile. Current LCP flagged as risk by Ethan.",
    ownerName: "Ethan Cole",
    ownerInitials: "EC",
    ownerColor: "amber",
    deadline: "May 29",
    priority: "HIGH",
    status: "DONE",
    sourceQuote: "Landing page performance on mobile is something I want to keep an eye on. Our current hero image is not optimized.",
    aiConfidence: 85,
    aiReason: "Ethan raised this as a concern and the team agreed it needed immediate attention before copy freeze.",
    relatedDecision: undefined,
  },
  {
    id: "t7",
    title: "Prepare Product Hunt launch post and media",
    description: "Write PH tagline, description, first comment strategy, gather maker photos and product GIFs. Schedule for launch day 00:01 PST.",
    ownerName: "Maya Chen",
    ownerInitials: "MC",
    ownerColor: "violet",
    deadline: "Jun 12",
    priority: "MEDIUM",
    status: "BLOCKED",
    sourceQuote: "We need assets before we can finalize the Product Hunt strategy.",
    aiConfidence: 78,
    aiReason: "Dependency on social assets from Ethan's design work. Blocked until brand assets are delivered.",
    relatedDecision: undefined,
  },
  {
    id: "t8",
    title: "Coordinate beta user outreach email sequence",
    description: "Draft and schedule 3-email onboarding sequence for beta cohort. Personalize first email with user name and stated use case. A/B test subject lines.",
    ownerName: "Sofia Ramirez",
    ownerInitials: "SR",
    ownerColor: "emerald",
    deadline: "Jun 3",
    priority: "HIGH",
    status: "TODO",
    sourceQuote: "I'll run the beta user outreach email sequence. Three-email onboarding, personalized first touch.",
    aiConfidence: 99,
    aiReason: "Sofia volunteered for this explicitly. Date confirmed with cross-reference to Daniel's invite list delivery promise.",
    relatedDecision: "Ship beta invite flow before full launch",
  },
];

export const DEMO_DECISIONS: DemoDecision[] = [
  {
    id: "d1",
    title: "Freeze landing page messaging by Friday, May 30th",
    context: "Marketing needs at least 2 weeks for SEO indexing. Any copy changes after Friday will directly delay the June 15th launch. Sofia owns the freeze gate.",
    ownerName: "Sofia Ramirez",
    createdAt: "Today, 10:42 AM",
  },
  {
    id: "d2",
    title: "Ship beta invite flow before public launch",
    context: "Beta cohort of 500 users must be in-product at least 1 week before launch to generate social proof and testimonials. Daniel owns delivery by June 5th.",
    ownerName: "Daniel Brooks",
    createdAt: "Today, 10:38 AM",
  },
  {
    id: "d3",
    title: "Move analytics dashboard to post-launch sprint",
    context: "Dashboard adds 3 weeks of scope that the team doesn't have. A stripped metrics view (DAU, retention, activation) will suffice for beta. Full dashboard ships in the first post-launch sprint.",
    ownerName: "Ethan Cole",
    createdAt: "Today, 10:45 AM",
  },
  {
    id: "d4",
    title: "Launch date is non-negotiable: June 15th",
    context: "Board presentation is June 16th. Marketing campaigns are pre-booked. Any scope that cannot ship by June 15th is cut, not delayed. No exceptions.",
    ownerName: "Maya Chen",
    createdAt: "Today, 10:30 AM",
  },
];

export const DEMO_RISKS: DemoRisk[] = [
  {
    id: "r1",
    title: "Email provider rate limits during beta cohort send",
    severity: "HIGH",
    mitigation: "Stagger beta invites over 48 hours. Pre-warm sending domain starting next Monday. Coordinate with email provider on burst limits.",
  },
  {
    id: "r2",
    title: "Landing page mobile performance (LCP > 3s risk)",
    severity: "MEDIUM",
    mitigation: "Lighthouse audit in progress. Hero image compression and JS deferral scheduled before messaging freeze.",
  },
  {
    id: "r3",
    title: "Beta user churn before public launch announcement",
    severity: "LOW",
    mitigation: "Send activation check-in at day 3 and day 7 with concierge support offer. Track activation rate daily.",
  },
];

export const DEMO_FOLLOWUPS: DemoFollowUp[] = [
  { id: "f1", title: "Schedule pre-launch war room for June 13th", ownerName: "Maya Chen", completed: false },
  { id: "f2", title: "Get legal approval on pricing page data claims", ownerName: "Sofia Ramirez", completed: false },
  { id: "f3", title: "Review beta segment list with Sales before sending", ownerName: "Daniel Brooks", completed: true },
];

export const DEMO_ACTIVITY: DemoActivity[] = [
  {
    id: "a1",
    actorName: "Flowstate AI",
    actorInitials: "AI",
    actorColor: "violet",
    action: "created_workspace",
    detail: "Extracted 8 tasks, 4 decisions, 3 risks from 1,240-word transcript in 3.2s",
    time: "2 min ago",
  },
  {
    id: "a2",
    actorName: "Maya Chen",
    actorInitials: "MC",
    actorColor: "violet",
    action: "updated_task",
    detail: "Moved \"Finalize hero copy\" to In Progress",
    time: "4 min ago",
  },
  {
    id: "a3",
    actorName: "Ethan Cole",
    actorInitials: "EC",
    actorColor: "amber",
    action: "completed_task",
    detail: "Completed \"Run mobile Lighthouse audit\" — LCP improved from 4.1s to 2.3s",
    time: "14 min ago",
  },
  {
    id: "a4",
    actorName: "Daniel Brooks",
    actorInitials: "DB",
    actorColor: "blue",
    action: "updated_task",
    detail: "Started \"Integrate beta invite codes into auth flow\"",
    time: "22 min ago",
  },
  {
    id: "a5",
    actorName: "Sofia Ramirez",
    actorInitials: "SR",
    actorColor: "emerald",
    action: "added_decision",
    detail: "Confirmed messaging freeze deadline with marketing team",
    time: "Today, 10:55",
  },
  {
    id: "a6",
    actorName: "Maya Chen",
    actorInitials: "MC",
    actorColor: "violet",
    action: "blocked_task",
    detail: "Blocked \"Prepare Product Hunt post\" — waiting on brand assets from Ethan",
    time: "Yesterday, 4:30",
  },
];
