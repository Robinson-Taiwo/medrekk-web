"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Logo, Mark } from "./brand";
import { KeyChip, NightLink, Wrap } from "./night";

/** Where the technical documentation lives. Off-site, so every link to it is a plain anchor. */
export const DOCS_URL = "https://medrekk.mintlify.site";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-providers", label: "For providers" },
  { href: "/ussd", label: "Dial-in" },
  { href: "/download", label: "Get the app" },
  { href: DOCS_URL, label: "Docs", external: true },
] as const;

/**
 * A floating bar rather than a strip across the top.
 *
 * Full-bleed, a header is a lid: it belongs to the browser chrome and the page starts beneath
 * it. Detached — inset from every edge, with its own border and the page visible running
 * underneath — it becomes an object sitting on the page, and the page reads as continuous
 * behind it. That is the whole difference, and it is mostly margin and a radius.
 *
 * The code field stays because it is the one thing this site is for: "access a record" is a
 * verb with an argument, not a page to browse to. It is the quieter of the two right-hand
 * controls so there is still a single obvious action.
 */
export function NightHeader() {
  const [code, setCode] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const go = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    const clean = code.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 20);
    router.push(clean ? `/access?code=${encodeURIComponent(clean)}` : "/access");
  };

  return (
    <header className="sticky top-0 z-50">
      {/*
        A fade behind the floating bar.
        
        The capsule is inset, so there is clear space above and beside it — and the page was
        scrolling straight through that gap, leaving headings legible behind the bar and
        colliding with it. This layer sits under the capsule and over the page, fading the
        content out before it reaches the top edge, so the bar floats on the page rather than
        in a hole cut through it.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[104px] bg-gradient-to-b from-night via-night/90 to-transparent"
      />
      <div className="relative px-4 pt-4 sm:px-6">
      <Wrap className="!px-0">
        <div className="flex h-[60px] items-center gap-3 rounded-[18px] border border-white/[0.08] bg-night/80 px-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:px-4">
          <Link href="/" className="shrink-0 rounded-md text-mist" aria-label="MedRekk home">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {NAV.map((item) =>
              "external" in item && item.external ? (
                // next/link exists to move between pages of this app without a page load. The
                // documentation is a different site, so there is nothing for a router to route.
                <a
                  key={item.href}
                  href={item.href}
                  rel="noopener"
                  className="rounded-lg px-3 py-2 text-[14px] font-medium text-mist-dim transition-colors hover:text-mist"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-[14px] font-medium text-mist-dim transition-colors hover:text-mist"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <form
              onSubmit={go}
              className="hidden items-center rounded-lg border border-white/[0.09] bg-white/[0.04] pl-3 pr-1 transition-colors focus-within:border-glow/40 xl:flex"
            >
              <label htmlFor="header-code" className="sr-only">
                MedRekk code
              </label>
              <input
                id="header-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="MRK-82941"
                autoCapitalize="characters"
                spellCheck={false}
                className="w-[104px] bg-transparent py-1.5 font-mono text-[12.5px] tracking-[0.12em] text-mist placeholder:text-mist-faint/70 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Find this record"
                className="grid h-6 w-6 place-items-center rounded-md text-mist-dim transition-colors hover:bg-white/[0.08] hover:text-mist"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8h9M8.5 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>

            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-[14px] font-medium text-mist-dim transition-colors hover:text-mist sm:block"
            >
              Sign in
            </Link>

            {/*
              The bar's one button is the app, not the record reader.
              
              "Access a record" was here because it is what a clinician does — but a clinician
              arrives with a code in hand and goes straight there, while everybody else landing
              on this page is a patient who needs the app first. A header has room for one
              action, and it should be the one most visitors need.
            */}
            <NightLink href="/download" className="hidden shrink-0 !h-10 !px-4 !text-[14px] sm:inline-flex">
              Get the app
            </NightLink>

            {/*
              Below lg the centre nav is hidden, and until now nothing replaced it: every link
              except the one button was simply unreachable on a phone — on a site whose whole
              subject is phones.
            */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/[0.09] bg-white/[0.04] text-mist transition-colors hover:bg-white/[0.08] lg:hidden"
            >
              <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {menuOpen ? (
                  <path d="M5 5l10 10M15 5L5 15" />
                ) : (
                  <>
                    <path d="M3 6h14" />
                    <path d="M3 10h14" />
                    <path d="M3 14h14" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav
            id="mobile-nav"
            aria-label="Main"
            className="mt-2 overflow-hidden rounded-[18px] border border-white/[0.08] bg-night/95 p-2 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.95)] backdrop-blur-xl lg:hidden"
          >
            {NAV.map((item) =>
              "external" in item && item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  rel="noopener"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-3 text-[15px] font-medium text-mist-dim transition-colors hover:bg-white/[0.05] hover:text-mist"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-3 text-[15px] font-medium text-mist-dim transition-colors hover:bg-white/[0.05] hover:text-mist"
                >
                  {item.label}
                </Link>
              ),
            )}
            <div className="my-1.5 h-px bg-white/[0.07]" />
            <Link
              href="/access"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-3 py-3 text-[15px] font-medium text-mist-dim transition-colors hover:bg-white/[0.05] hover:text-mist"
            >
              Access a record
            </Link>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-3 py-3 text-[15px] font-medium text-mist-dim transition-colors hover:bg-white/[0.05] hover:text-mist"
            >
              Sign in
            </Link>
            <NightLink
              href="/download"
              onClick={() => setMenuOpen(false)}
              className="mt-1.5 !flex w-full justify-center"
            >
              Get the app
            </NightLink>
          </nav>
        ) : null}
      </Wrap>
      </div>
    </header>
  );
}

export function NightFooter() {
  const columns = [
    {
      heading: "Product",
      links: [
        { href: "/how-it-works", label: "How it works" },
        { href: "/for-providers", label: "For providers" },
        { href: "/ussd", label: "Dial-in simulator" },
        { href: "/download", label: "Get the app" },
      ],
    },
    {
      heading: "Reach a record",
      links: [
        { href: "/access", label: "Request access" },
        { href: "/emergency", label: "Emergency lookup" },
      ],
    },
    {
      heading: "Clinicians",
      links: [
        { href: "/login", label: "Sign in" },
        { href: "/signup", label: "Create an account" },
      ],
    },
    {
      heading: "Developers",
      links: [
        { href: DOCS_URL, label: "Documentation", external: true },
        { href: "https://github.com/Robinson-Taiwo/medrekk", label: "GitHub", external: true },
      ],
    },
    {
      heading: "Legal",
      links: [{ href: "/privacy", label: "Privacy" }],
    },
  ];

  return (
    <footer className="mt-auto border-t border-white/[0.07]">
      <Wrap className="flex flex-col gap-12 py-14 md:flex-row md:justify-between">
        <div className="max-w-[32ch]">
          <Logo />
          <p className="mt-4 text-[14px] leading-[1.6] text-mist-faint">
            A medical record the patient owns, that works without a connection and can be reached
            from any phone.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <KeyChip>MR-4K7Q</KeyChip>
            <KeyChip>*384*74161#</KeyChip>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-9 sm:grid-cols-3">
          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading} className="grid content-start gap-3">
              <p className="text-[13px] font-semibold text-mist">{column.heading}</p>
              {column.links.map((link) =>
                "external" in link && link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    rel="noopener"
                    className="text-[13px] text-mist-faint transition-colors hover:text-mist"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] text-mist-faint transition-colors hover:text-mist"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>
          ))}
        </div>
      </Wrap>

      <Wrap className="flex flex-col gap-3 border-t border-white/[0.07] py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-mist-faint">
          MedRekk is a prototype. It is not a certified medical device and does not replace a
          clinical record system.
        </p>
        <Mark className="h-4 w-4 shrink-0 text-white/20" />
      </Wrap>
    </footer>
  );
}
