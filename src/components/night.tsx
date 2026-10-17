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
type Size = "md" | "lg";

/**
 * The accent button carries dark type on bright green. White on this green measures 2.36:1
 * and would be unreadable; ink on it is 7.56:1.
 */
function buttonSkin(variant: Variant, size: Size, extra: string): string {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[transform,background-color,border-color] duration-150 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100";
  const box = size === "lg" ? "h-[52px] px-6 text-base" : "h-11 px-5 text-[15px]";
  const skin =
    variant === "accent"
      ? "bg-glow text-glow-ink hover:bg-[#3ad3a0]"
      : "border border-white/12 bg-white/[0.04] text-mist hover:bg-white/[0.08]";
  return `${base} ${box} ${skin} ${extra}`;
}

export function NightButton({
  variant = "accent",
  size = "md",
  className = "",
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={buttonSkin(variant, size, className)} {...rest} />;
}

export function NightLink({
  variant = "accent",
  size = "md",
  className = "",
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonSkin(variant, size, className)} {...rest} />;
}

/** A labelled input on the night surface. The label is always rendered, never a placeholder. */
export function NightField({
  label,
  hint,
  id,
  className = "",
  ...rest
}: ComponentProps<"input"> & { label: string; hint?: string; id: string }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-mist">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={`h-12 rounded-xl border border-white/[0.1] bg-white/[0.04] px-3.5 text-[15px] text-mist outline-none transition-colors placeholder:text-mist-faint/70 focus:border-glow/50 focus:bg-white/[0.06] ${className}`}
        {...rest}
      />
      {hint ? (
        <p id={`${id}-hint`} className="text-xs leading-[17px] text-mist-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function NightNotice({
  tone = "neutral",
  title,
  children,
}: {
  tone?: "neutral" | "pending" | "danger";
  title?: string;
  children: ReactNode;
}) {
  const skin = {
    neutral: "border-white/[0.08] bg-white/[0.03]",
    pending: "border-amber-400/20 bg-amber-400/[0.07]",
    danger: "border-rose-400/25 bg-rose-400/[0.08]",
  }[tone];
  return (
    <div className={`rounded-xl border p-4 ${skin}`}>
      {title ? <p className="text-[15px] font-semibold text-mist">{title}</p> : null}
      <div className={`text-[14px] leading-[1.6] text-mist-dim ${title ? "mt-1.5" : ""}`}>
        {children}
      </div>
    </div>
  );
}
