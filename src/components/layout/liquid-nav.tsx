"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { Zap, Menu, X } from "lucide-react";

export function LiquidNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const isLanding = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
        scrolled || !isLanding ? "glass-nav py-3" : "bg-transparent py-5"
      }`}
      style={{ zIndex: 100 }}
    >
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-600/35 group-hover:shadow-violet-600/55 transition-shadow">
            <Zap size={13} className="text-white fill-white" />
          </div>
          <span className="font-bold text-[15px] tracking-tight text-white">
            Flowstate
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Product",      href: "/#features" },
            { label: "How it works", href: "/#workflow" },
            { label: "Demo",         href: "/demo" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-3 py-2 text-sm text-white/55 hover:text-white transition-colors rounded-lg hover:bg-white/[0.06]"
            >
              {item.label}
            </Link>
          ))}
          {isSignedIn && (
            <Link
              href="/dashboard"
              className="px-3 py-2 text-sm text-white/55 hover:text-white transition-colors rounded-lg hover:bg-white/[0.06]"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hidden md:inline-flex text-sm px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:-translate-y-px"
              >
                Dashboard
              </Link>
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="text-sm text-white/55 hover:text-white transition-colors px-3 py-2">
                  Sign in
                </button>
              </SignInButton>
              <Link
                href="/sign-up"
                className="text-sm px-4 py-2 rounded-lg text-white font-semibold transition-all hover:-translate-y-px"
                style={{
                  background: "linear-gradient(135deg, #7C3AED 0%, #5B2BD6 100%)",
                  boxShadow: "0 8px 24px rgba(124,58,237,0.30), 0 0 16px rgba(124,58,237,0.20)",
                }}
              >
                Try Flowstate free
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-white/55 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-nav border-t border-white/[0.06] px-5 py-4 space-y-1">
          {[
            { label: "Demo",        href: "/demo" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-3 py-2.5 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.06]"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {isSignedIn && (
            <Link
              href="/dashboard"
              className="block px-3 py-2.5 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.06]"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {!isSignedIn && (
            <div className="pt-2 border-t border-white/[0.06]">
              <SignInButton mode="modal">
                <button className="block w-full text-left px-3 py-2.5 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.06]">
                  Sign in
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
