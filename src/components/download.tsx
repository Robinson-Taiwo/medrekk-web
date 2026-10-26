import QRCode from "qrcode";

import { Body, NightAnchor, Panel } from "@/components/night";

/**
 * Where somebody gets the app.
 *
 * The link is an environment variable rather than a constant, because EAS gives every build its
 * own URL — there is no permanent "latest" address to hardcode. Keeping it in the environment
 * means publishing a new build is pasting a link into the host and redeploying, instead of a
 * commit and a review for a string that changes every single time.
 *
 * NEXT_PUBLIC_ so it is inlined at build time, which is also what lets the QR below be drawn on
 * the server rather than shipping an encoder to every browser.
 */
const APK_URL = process.env.NEXT_PUBLIC_APK_URL ?? "";

/** Shown beside the button so somebody can tell whether they already have this one. */
const APK_VERSION = process.env.NEXT_PUBLIC_APK_VERSION ?? "";

/**
 * The install link as a QR, drawn at build time.
 *
 * Most people read this page on a laptop and install on a phone, and nobody is going to retype a
 * URL with a 32-character build id in it. Inline SVG: no image to host, no call to a QR service
 * that would hand a third party the address of every build, and it stays sharp at any size.
 */
async function InstallQr({ url }: { url: string }) {
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#0B1A17", light: "#FFFFFF" },
  });

  return (
    <div
      aria-hidden
      className="h-[132px] w-[132px] shrink-0 rounded-xl bg-white p-2.5 [&>svg]:h-full [&>svg]:w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

/**
 * Deliberately says up front that Android will warn about installing this.
 *
 * That warning is alarming when it arrives unexplained, and somebody who was not told to expect
 * it reasonably stops — so the page says it first, in roughly the words Android uses, rather
 * than leaving people to decide on their own whether they are being attacked.
 */
export async function DownloadCard() {
  if (APK_URL.length === 0) {
    return (
      <Panel className="p-6">
        <p className="text-[15px] font-medium text-mist">The Android app is not published yet.</p>
        <Body className="mt-2">
          A download will appear here once the first build is out. Until then a record can be read
          in this browser through an approved access link.
        </Body>
      </Panel>
    );
  }

  return (
    <Panel className="p-6 sm:p-7">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-7">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-[17px] font-semibold text-mist">MedRekk for Android</h3>
            {APK_VERSION.length > 0 ? (
              <span className="rounded-md bg-white/[0.07] px-2 py-0.5 text-[11.5px] font-medium text-mist-dim">
                {APK_VERSION}
              </span>
            ) : null}
          </div>

          <Body className="mt-2.5">
            Your record lives on your phone and works with no connection. Install it, make an
            account once, and it keeps working wherever you are.
          </Body>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <NightAnchor href={APK_URL} rel="noopener">
              Download for Android
            </NightAnchor>
            <span className="text-[12.5px] text-mist-faint">Free · no Play Store needed</span>
          </div>

          <ol className="mt-6 space-y-2 border-t border-white/[0.07] pt-5">
            {[
              "Open this page on the Android phone you want it on, and tap Download.",
              "Android will ask whether to allow installs from this source. That is normal for an app that does not come from the Play Store — allow it, then open the file.",
              "Make an account, or sign in if you already have one.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-[11px] font-semibold text-mist-dim">
                  {i + 1}
                </span>
                <span className="text-[13.5px] leading-[21px] text-mist-dim">{step}</span>
              </li>
            ))}
          </ol>

          <p className="mt-5 text-[12.5px] leading-[18px] text-mist-faint">
            There is no iPhone version yet. On any phone an emergency card can still be looked up
            in a browser, and a record can be read by dialling — no app, no internet.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2.5">
          <InstallQr url={APK_URL} />
          <span className="text-center text-[11.5px] leading-[16px] text-mist-faint">
            Scan with the
            <br />
            phone you want it on
          </span>
        </div>
      </div>
    </Panel>
  );
}
