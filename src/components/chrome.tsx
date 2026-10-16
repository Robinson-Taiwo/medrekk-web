import Link from "next/link";

import { Logo, Mark } from "./brand";
import { ButtonLink, Display, Eyebrow, Lead, Shell } from "./ui";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-providers", label: "For providers" },
  { href: "/privacy", label: "Privacy" },
] as const;

/**
 * No hamburger. On a narrow screen the links move to the footer rather than hiding behind a
 * button that needs JavaScript to open — every link stays reachable, and the header keeps the
 * one action a visitor actually came for.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/85 backdrop-blur-md">
      <Shell className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="rounded-md text-ink" aria-label="MedRekk home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-muted transition-colors hover:bg-fill hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/access" variant="primary" className="shrink-0">
            Access a record
          </ButtonLink>
        </div>
      </Shell>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <Shell className="flex flex-col gap-10 py-12 md:flex-row md:justify-between">
        <div className="max-w-[34ch]">
          <Logo />
          <p className="mt-3 text-[13px] leading-[19px] text-muted">
            A patient-owned medical record that works without a connection, and can be reached from
            any phone.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3">
          <nav aria-label="About MedRekk" className="grid gap-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">About</p>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] text-muted hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Reach a record" className="grid gap-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">Reach a record</p>
            <Link href="/access" className="text-[13px] text-muted hover:text-ink">
              Request access
            </Link>
            <Link href="/emergency" className="text-[13px] text-muted hover:text-ink">
              Emergency lookup
            </Link>
            <Link href="/ussd" className="text-[13px] text-muted hover:text-ink">
              Dial-in simulator
            </Link>
          </nav>

          <nav aria-label="For clinicians" className="grid gap-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">Clinicians</p>
            <Link href="/login" className="text-[13px] text-muted hover:text-ink">
              Sign in
            </Link>
          </nav>
        </div>
      </Shell>

      <Shell className="flex flex-col gap-3 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          MedRekk is a prototype. It is not a certified medical device and does not replace a
          clinical record system.
        </p>
        <Mark className="h-4 w-4 shrink-0 text-dim" />
      </Shell>
    </footer>
  );
}

/** The top of every page that is not the landing page, so they all start the same way. */
export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <section className="border-b border-line bg-surface py-14 lg:py-20">
      <Shell>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Display className="mt-4 max-w-[22ch] text-ink">{title}</Display>
        <Lead className="mt-5">{lead}</Lead>
      </Shell>
    </section>
  );
}
