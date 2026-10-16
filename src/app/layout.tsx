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

export const metadata: Metadata = {
  title: {
    default: "MedRekk — your medical record, owned by you",
    template: "%s · MedRekk",
  },
  description:
    "A patient-owned medical record that works offline. Providers see only what the patient approves, for as long as the patient allows — and it can be reached from any phone, without an app.",
  applicationName: "MedRekk",
  openGraph: {
    title: "MedRekk — your medical record, owned by you",
    description:
      "A patient-owned medical record that works offline, and can be reached from any phone without an app.",
    siteName: "MedRekk",
    type: "website",
  },
  // A record-access tool has no business in search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#142D2A",
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
