export const DEMO_TRANSCRIPT = `
Meeting: Q2 Product Launch Sync
Date: May 26, 2026
Attendees: Maya Chen (Product), Daniel Brooks (Engineering), Sofia Ramirez (Growth), Ethan Cole (Design)

---

Maya: Alright, let's get started. We have exactly three weeks until the June 15th launch date and I want to make sure we're all locked in on scope and owners today.

Sofia: Before we dive in — I need to flag that the landing page messaging needs to freeze by Friday. Marketing needs at least two weeks for SEO indexing to kick in before we launch, and any last-minute copy changes after Friday will cause real delays.

Maya: Agreed. Sofia, you own that. Let's make that a formal decision — landing page messaging freezes Friday, and Sofia is accountable.

Daniel: On my end, the beta invite flow is the top priority. We're targeting 500 beta users in-product at least a week before public launch. That gives us real testimonials and social proof for the launch post.

Maya: What's the ETA on that?

Daniel: If Sofia gives me the invite copy by end of this week, I can have the invite redemption and onboarding checklist done by June 5th. We should test with the full 500-user load too.

Maya: Done. Daniel owns beta invite flow, target June 5th.

Ethan: I want to raise the analytics dashboard. We initially scoped it for launch but it's adding about three weeks of work. Can we cut it?

Maya: What's the minimum viable version for launch?

Ethan: Honestly a simple metrics view — DAU, retention, activation rate — would be fine for the beta period. The full dashboard can ship in the sprint after launch.

Maya: Let's make that call now. Analytics dashboard moves to post-launch. Ethan, you own a stripped metrics view for beta. That's decision two.

Ethan: Works for me. I'll also set up launch monitoring — error rates and latency alerts in Datadog — by June 10th.

Sofia: I'll need social assets for the launch announcement. Twitter, LinkedIn, Product Hunt. Maya, can Design handle that?

Maya: Maya Chen on comms will handle the social assets — target June 8th. Let's call that a task.

Sofia: And I'll run the beta user outreach email sequence. Three-email onboarding, personalized first touch. I'll need the final invite list from Daniel by June 1st.

Daniel: I'll have the list to you by June 1st.

Maya: Good. What are we worried about? Risks?

Daniel: The main one for me is email deliverability. If we blast 500 invites at once we could hit rate limits or spam filters. We should stagger invites over 48 hours and pre-warm the sending domain starting next week.

Sofia: Noted. I'll flag that to our email provider.

Ethan: Landing page performance on mobile is something I want to keep an eye on. Our current hero image is not optimized. If LCP is over 3 seconds we'll tank the Product Hunt ranking.

Maya: Let's run a Lighthouse audit this week. Compress images, defer non-critical JS. Ethan, can you own that?

Ethan: Yes, I'll have a report by Wednesday.

Maya: Follow-ups before we close: I'll schedule a pre-launch war room for June 13th — everyone needs to block that day. Sofia, can you get legal approval on our pricing page claims this week?

Sofia: On it.

Daniel: I should also review the beta segment list with Sales before we send. Some of those accounts might be mid-deal.

Maya: Good call. Action on you. Okay — we're good. Final summary: messaging freeze Friday, beta flow by June 5th, analytics dashboard post-launch, launch day June 15th. Let's ship it.

---
Meeting ended at 10:47 AM.
`;
