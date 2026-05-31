import Anthropic from "@anthropic-ai/sdk";

export interface ExtractedMeeting {
  workspaceTitle: string;
  summary: string;
  decisions: Array<{
    title: string;
    context: string;
    owner: string | null;
  }>;
  tasks: Array<{
    title: string;
    description: string;
    owner: string | null;
    deadline: string | null;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "TODO";
  }>;
  risks: Array<{
    title: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
    mitigation: string;
  }>;
  followUps: Array<{
    title: string;
    owner: string | null;
  }>;
}

const SYSTEM_PROMPT = `You are an expert meeting analyst. Extract structured information from meeting transcripts.
Return ONLY valid JSON matching the exact schema provided. No extra text, no markdown, just JSON.`;

const USER_PROMPT = (transcript: string, title?: string) => `
Extract key information from this meeting transcript${title ? ` titled "${title}"` : ""}.

Return a JSON object with this exact structure:
{
  "workspaceTitle": "A concise, action-oriented workspace title (e.g., 'Q2 Product Launch Sync')",
  "summary": "2-3 sentence executive summary of what was discussed and decided",
  "decisions": [
    {
      "title": "The decision made",
      "context": "Why this decision was made and what it affects",
      "owner": "Name of person responsible or null"
    }
  ],
  "tasks": [
    {
      "title": "Specific action item title",
      "description": "Detailed description of what needs to be done",
      "owner": "Name of assignee or null",
      "deadline": "ISO date string (YYYY-MM-DD) or null",
      "priority": "LOW | MEDIUM | HIGH",
      "status": "TODO"
    }
  ],
  "risks": [
    {
      "title": "Risk description",
      "severity": "LOW | MEDIUM | HIGH",
      "mitigation": "Proposed mitigation strategy"
    }
  ],
  "followUps": [
    {
      "title": "Follow-up item",
      "owner": "Name or null"
    }
  ]
}

Transcript:
${transcript}
`;

export const DEMO_EXTRACTION: ExtractedMeeting = {
  workspaceTitle: "Q2 Product Launch Sync",
  summary:
    "The team aligned on the Q2 launch timeline with a target date of June 15th. Key decisions were made around feature scope, messaging freeze, and analytics deferral. Engineering will prioritize the beta invite flow while Design finalizes the landing page.",
  decisions: [
    {
      title: "Freeze landing page messaging by Friday",
      context:
        "Marketing needs at least 2 weeks for SEO indexing. Any further copy changes after Friday will delay the launch.",
      owner: "Sofia Ramirez",
    },
    {
      title: "Ship beta invite flow before full launch",
      context:
        "Beta cohort of 500 users needs to be in-product at least 1 week before public launch to generate social proof and testimonials.",
      owner: "Daniel Brooks",
    },
    {
      title: "Move analytics dashboard to post-launch",
      context:
        "Dashboard adds 3 weeks of scope. The launch can proceed without it; a stripped metrics view will suffice for the beta period.",
      owner: "Ethan Cole",
    },
  ],
  tasks: [
    {
      title: "Finalize hero copy and messaging framework",
      description:
        "Lock all headline, subheadline, and CTA copy for the landing page. Get legal sign-off on any data claims.",
      owner: "Sofia Ramirez",
      deadline: "2026-05-30",
      priority: "HIGH",
      status: "TODO",
    },
    {
      title: "Build and test beta invite flow end-to-end",
      description:
        "Implement invite code redemption, onboarding checklist, and confirmation emails. Must handle 500 concurrent users.",
      owner: "Daniel Brooks",
      deadline: "2026-06-05",
      priority: "HIGH",
      status: "TODO",
    },
    {
      title: "Set up launch monitoring dashboard",
      description:
        "Configure error rate, latency, and user activation alerts in Datadog. Define SLOs for launch day.",
      owner: "Ethan Cole",
      deadline: "2026-06-10",
      priority: "MEDIUM",
      status: "TODO",
    },
    {
      title: "Create launch announcement social assets",
      description:
        "Design Twitter/LinkedIn launch post graphics, Product Hunt thumbnail, and press kit images.",
      owner: "Maya Chen",
      deadline: "2026-06-08",
      priority: "MEDIUM",
      status: "TODO",
    },
    {
      title: "Coordinate beta user outreach sequence",
      description:
        "Draft and schedule 3-email onboarding sequence for beta cohort. Personalize first email with user name and use case.",
      owner: "Sofia Ramirez",
      deadline: "2026-06-03",
      priority: "HIGH",
      status: "TODO",
    },
  ],
  risks: [
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
  ],
  followUps: [
    {
      title: "Schedule pre-launch war room for June 13th",
      owner: "Maya Chen",
    },
    {
      title: "Get legal approval on pricing page claims",
      owner: "Sofia Ramirez",
    },
    {
      title: "Review beta user segment list with Sales",
      owner: "Daniel Brooks",
    },
  ],
};

export async function extractMeeting(
  transcript: string,
  meetingTitle?: string
): Promise<ExtractedMeeting> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: USER_PROMPT(transcript, meetingTitle),
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const raw = content.text.trim();
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON found");

    const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
    return parsed as ExtractedMeeting;
  } catch (err) {
    console.error("AI extraction failed, using demo fallback:", err);
    return DEMO_EXTRACTION;
  }
}
