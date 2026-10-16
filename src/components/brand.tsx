/**
 * The MedRekk mark, inlined from assets/android/symbols/medrekk_symbol_green_128.svg.
 *
 * Inlined rather than served as a file so it inherits currentColor: the same component is the
 * green mark on a light header and the white mark on an ink panel, with no second asset and no
 * flash while an image loads.
 */
export function Mark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.7998 102.4V25.6L36.7998 12.8L63.9998 51.2001L91.1998 12.8L115.2 25.6V102.4H92.7998V52.8L63.9998 92.8L35.1998 52.8V102.4H12.7998Z"
      />
      <path fillRule="evenodd" clipRule="evenodd" d="M48 105.6H80V115.2H48V105.6Z" />
    </svg>
  );
}

/** Mark plus wordmark. The mark is decorative here; this carries the accessible name. */
export function Logo({
  className = "",
  markClassName = "h-[26px] w-[26px] text-primary",
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Mark className={markClassName} />
      <span className="font-display text-[17px] font-bold tracking-[-0.02em]">MedRekk</span>
    </span>
  );
}
