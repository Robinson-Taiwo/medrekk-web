import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * The night surface: the shared pieces every dark page is built from.
 *
 * The rule throughout is that light comes from behind the content rather than being painted
 * onto it. Panels are nearly transparent and catch an edge highlight, the accent appears as
 * a glow before it appears as a fill, and nothing uses a drop shadow to fake depth.
 */

export function NightShell({ children }: { children: ReactNode }) {
  return <div className="night flex min-h-screen flex-1 flex-col">{children}</div>;
}

/** One max width everywhere, so nothing drifts page to page. */
export function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1120px] px-6 ${className}`}>{children}</div>;
}

export function Aura({ className = "" }: { className?: string }) {
  return <div className={`aura ${className}`} aria-hidden="true" />;
}

export function Hairline({ className = "" }: { className?: string }) {
  return <hr className={`hairline ${className}`} />;
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-2xl ${className}`}>{children}</div>;
}

/**
 * The product's own shortcut, borrowed from the way a launcher shows a key combination. A
 * MedRekk Code and a short code are exactly that kind of thing: short, typed, and the whole
 * point of the product. Using the real strings rather than ⌘K keeps the motif from being
 * someone else's.
 */
export function KeyChip({ children, tone = "quiet" }: { children: ReactNode; tone?: "quiet" | "accent" }) {
  const skin =
    tone === "accent"
      ? "border-glow/30 bg-glow/10 text-glow"
      : "border-white/12 bg-white/[0.05] text-mist-dim";
  return (
    <kbd
      className={`inline-flex items-center rounded-[7px] border px-2 py-1 font-mono text-[12px] font-medium tracking-[0.06em] ${skin}`}
    >
      {children}
    </kbd>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-mist-dim">
      <span className="h-1.5 w-1.5 rounded-full bg-glow" />
      {children}
    </span>
  );
}

export function Display({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={`font-display text-[clamp(2.3rem,5.6vw,4.1rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-mist ${className}`}
    >
      {children}
    </h1>
  );
}

export function Heading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`font-display text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold leading-[1.12] tracking-[-0.028em] text-mist ${className}`}
    >
      {children}
    </h2>
  );
}

export function Lead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`max-w-[58ch] text-[17px] leading-[1.6] text-mist-dim ${className}`}>{children}</p>
  );
}

export function Body({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`max-w-[62ch] text-[15px] leading-[1.65] text-mist-dim ${className}`}>{children}</p>
  );
}

type Variant = "accent" | "ghost";

/**
 * The accent button carries dark type on bright green. White on this green measures 2.36:1
 * and would be unreadable; ink on it is 7.56:1.
 */
function buttonSkin(variant: Variant, extra: string): string {
  const base =
    "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-medium transition-[transform,background-color,border-color] duration-150 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100";
  const skin =
    variant === "accent"
      ? "bg-glow text-glow-ink hover:bg-[#3ad3a0]"
      : "border border-white/12 bg-white/[0.04] text-mist hover:bg-white/[0.08]";
  return `${base} ${skin} ${extra}`;
}

export function NightButton({
  variant = "accent",
  className = "",
  ...rest
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={buttonSkin(variant, className)} {...rest} />;
}

export function NightLink({
  variant = "accent",
  className = "",
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonSkin(variant, className)} {...rest} />;
}
