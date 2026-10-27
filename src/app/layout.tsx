import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

/**
 * The two faces the mobile app uses, so a patient who has seen the app recognises the site.
 * Loaded as variables and wired to --font-sans / --font-display in globals.css.
 *
 * The file this replaced loaded Geist and then threw it away: body carried
 * `font-family: Arial, Helvetica, sans-serif`, which overrode it on every page.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

/**
 * Where relative URLs in this metadata resolve from.
 *
 * Without it Next cannot turn opengraph-image.png into the absolute URL that WhatsApp, Slack and
 * every other unfurler require, and the preview silently falls back to a bare link. Taken from
 * the environment so a preview deployment advertises itself rather than production.
 */
const SITE = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://medrekk-web.rumptycloud.app",
);

const DESCRIPTION =
  "A patient-owned medical record that works with no network. A health worker sees only what the patient approves, for only as long as they allow, and every look is written down. Reachable from any phone — even without the app.";

export const metadata: Metadata = {
  metadataBase: SITE,
  title: {
    default: "MedRekk — your medical record, owned by you",
    template: "%s · MedRekk",
  },
  description: DESCRIPTION,
  applicationName: "MedRekk",
  authors: [{ name: "MedRekk" }],
  creator: "MedRekk",
  publisher: "MedRekk",
  keywords: [
    "patient-owned medical record",
    "offline health record",
    "emergency medical card",
    "USSD health record",
    "Nigeria",
  ],
  // Phone numbers on this site are emergency contacts a responder should be able to tap, so the
  // automatic detection stays on; dates and addresses are not linkified because the browser's
  // guesses inside a clinical note are usually wrong.
  formatDetection: { telephone: true, date: false, address: false },
  openGraph: {
    title: "MedRekk — your medical record, owned by you",
    description: DESCRIPTION,
    siteName: "MedRekk",
    type: "website",
    locale: "en_NG",
    url: SITE,
  },
  twitter: {
    card: "summary_large_image",
    title: "MedRekk — your medical record, owned by you",
    description: DESCRIPTION,
  },
  // Added to a home screen, the name has to fit under an icon.
  appleWebApp: { capable: true, title: "MedRekk", statusBarStyle: "black-translucent" },
  // A record-access tool has no business in search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  // The night surface the site actually opens on, so the phone's own chrome matches the page
  // rather than banding against it.
  themeColor: "#0B1A17",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink">{children}</body>
    </html>
  );
}
