import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * The web half of the design system. These mirror src/components/design/primitives.tsx in the
 * mobile app — same tones, same radii, same weights — so a screen and a page look related.
 */

export type Tone = "verified" | "pending" | "unverified" | "danger" | "neutral";

const CHIP: Record<Tone, string> = {
  verified: "bg-primary-soft text-primary",
  pending: "bg-warn-soft text-warn",
  unverified: "bg-neutral-soft text-muted",
  danger: "bg-danger-soft text-danger",
  neutral: "bg-fill text-ink",
};

export function Chip({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium ${CHIP[tone]}`}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  return (
    <As className={`rounded-2xl border border-line bg-surface ${className}`}>{children}</As>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] text-primary ${className}`}>
      {children}
    </p>
  );
}

export function Meta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[13px] leading-[19px] text-muted ${className}`}>{children}</p>;
}

/** Hero-scale heading. Clamped so it reads well from a 360px phone to a projector. */
export function Display({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={`font-display text-[clamp(2.1rem,5.4vw,3.4rem)] font-extrabold leading-[1.06] ${className}`}
    >
      {children}
    </h1>
  );
}

export function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`font-display text-[clamp(1.4rem,2.8vw,1.95rem)] font-bold leading-tight ${className}`}>
      {children}
    </h2>
  );
}

/** Body copy at a readable measure. 68 characters is about where a line stops being work. */
export function Lead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`max-w-[62ch] text-[17px] leading-[1.6] text-muted ${className}`}>{children}</p>
  );
}

export function Body({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`max-w-[68ch] text-[15px] leading-[1.68] text-muted ${className}`}>{children}</p>
  );
}

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-deep",
  secondary: "border border-line bg-surface text-ink hover:bg-fill",
  danger: "bg-danger text-white hover:brightness-[0.92]",
  ghost: "text-ink hover:bg-fill",
};

const SIZE: Record<Size, string> = {
  md: "h-11 px-4 text-[15px]",
  lg: "h-[52px] px-6 text-base",
};

/**
 * A disabled button is track with muted text, never dim with a white label: white on dim was
 * 1.48:1, which is no label at all for anybody who needed to read it.
 */
export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = ""): string {
  return [
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors",
    "disabled:pointer-events-none disabled:border-transparent disabled:bg-track disabled:text-muted",
    VARIANT[variant],
    SIZE[size],
    extra,
  ].join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...rest} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...rest} />;
}

/** A labelled input. The label is always rendered, never replaced by a placeholder. */
export function Field({
  label,
  hint,
  id,
  className = "",
  ...rest
}: ComponentProps<"input"> & { label: string; hint?: string; id: string }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        className={`h-12 rounded-xl border border-line bg-surface px-3.5 text-[15px] text-ink placeholder:text-muted/70 ${className}`}
        aria-describedby={hint ? `${id}-hint` : undefined}
        {...rest}
      />
      {hint ? (
        <p id={`${id}-hint`} className="text-xs leading-[17px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** A short aside. Tone carries the meaning, and an icon slot keeps it from being a wall of text. */
export function Notice({
  tone = "neutral",
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}) {
  const skin: Record<Tone, string> = {
    verified: "bg-primary-soft/60 border-primary-soft",
    pending: "bg-warn-soft border-warn-soft",
    unverified: "bg-neutral-soft border-line",
    danger: "bg-danger-soft border-danger-soft",
    neutral: "bg-fill border-line",
  };
  return (
    <div className={`rounded-xl border p-4 ${skin[tone]}`}>
      {title ? <p className="text-[15px] font-semibold text-ink">{title}</p> : null}
      <div className={`text-[14px] leading-[21px] text-muted ${title ? "mt-1" : ""}`}>{children}</div>
    </div>
  );
}

/** The page shell. One max width everywhere, so nothing drifts page to page. */
export function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1120px] px-6 ${className}`}>{children}</div>;
}
