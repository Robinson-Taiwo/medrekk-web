import Link from "next/link";

import { Logo, Mark } from "./brand";
import { KeyChip, NightLink, Wrap } from "./night";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-providers", label: "For providers" },
  { href: "/ussd", label: "Dial-in" },
] as const;

/**
 * Slim, sticky and barely there. The page scrolls under a blurred strip with a hairline that
 * only appears where there is content behind it, so the header reads as a layer of the page
 * rather than a bar bolted to the top of it.
 */
export function NightHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-night/70 backdrop-blur-xl">
      <Wrap className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="rounded-md text-mist" aria-label="MedRekk home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-mist-dim transition-colors hover:bg-white/[0.06] hover:text-mist"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-[14px] font-medium text-mist-dim transition-colors hover:text-mist sm:block"
          >
            Sign in
          </Link>
          <NightLink href="/access" className="shrink-0">
            Access a record
          </NightLink>
        </div>
      </Wrap>
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
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] text-mist-faint transition-colors hover:text-mist"
                >
                  {link.label}
                </Link>
              ))}
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
