import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";
import type { SerializableFeature } from "@/components/auth/operator-auth-panel";

const FEATURES: SerializableFeature[] = [
  { icon: "brain",       label: "Decision register",   desc: "Context + owner" },
  { icon: "listChecks",  label: "Source-linked tasks", desc: "Owners + dates" },
  { icon: "shieldAlert", label: "Risk flags",          desc: "Severity scored" },
  { icon: "activity",    label: "Delivery log",        desc: "Nothing lost" },
];

const CLERK_APPEARANCE = {
  elements: {
    rootBox: "w-full",
    card: "bg-transparent border-0 shadow-none p-0",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "bg-white/[0.05] border-white/[0.10] text-white hover:bg-white/[0.09] transition-colors rounded-xl py-2.5",
    socialButtonsBlockButtonText: "text-white/85 font-medium",
    formFieldLabel: "text-white/55 text-xs font-medium",
    formFieldInput:
      "bg-white/[0.04] border-white/[0.10] text-white placeholder:text-white/25 focus:border-violet-500/60 focus:ring-violet-500/20 rounded-xl py-2.5",
    formButtonPrimary:
      "bg-gradient-to-b from-violet-500 to-violet-700 hover:from-violet-400 hover:to-violet-600 transition-all shadow-xl shadow-violet-600/40 rounded-xl font-semibold py-2.5",
    footerActionLink: "text-violet-300 hover:text-violet-200 transition-colors",
    footerActionText: "text-white/45",
    dividerLine: "bg-white/[0.08]",
    dividerText: "text-white/30 text-[11px]",
    identityPreviewText: "text-white/75",
    identityPreviewEditButtonIcon: "text-white/50",
    formFieldInputShowPasswordButton: "text-white/35 hover:text-white/65",
    otpCodeFieldInput: "bg-white/[0.05] border-white/[0.10] text-white rounded-xl",
    formResendCodeLink: "text-violet-300 hover:text-violet-200",
    alertText: "text-red-400",
    footer: "bg-transparent",
    footerAction: "bg-transparent",
  },
  layout: { socialButtonsPlacement: "bottom" as const },
  variables: { colorPrimary: "#7C3AED" },
};

export default function SignInPage() {
  return (
    <AuthShell
      features={FEATURES}
      activeTab="signin"
      title="Welcome back"
      subtitle="Sign in to your delivery workspace."
    >
      <SignIn appearance={CLERK_APPEARANCE} forceRedirectUrl="/dashboard" />
    </AuthShell>
  );
}
