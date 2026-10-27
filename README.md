# medrekk-web

The web half of **MedRekk**, an offline-first, patient-owned medical record.

This is where everyone without the app arrives: a clinician reading a record the patient approved,
a responder looking up an emergency card from a scanned QR, a patient trying the dial-in flow, and
an administrator approving health-worker credentials.

**Live:** https://medrekk-web.rumptycloud.app
**Documentation:** [the MedRekk docs](https://github.com/Robinson-Taiwo/medrekk/tree/main/docs)

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

Set `NEXT_PUBLIC_API_URL` to a running [`medrekk-backend`](https://github.com/Robinson-Taiwo/medrekk-backend).

## Routes

| Route | For |
| --- | --- |
| `/` | What MedRekk is |
| `/download` | Install the Android app |
| `/access`, `/access/[session]/record` | A clinician requesting and reading an approved record |
| `/emergency`, `/emergency/[identifier]` | Emergency card lookup — no account needed |
| `/ussd` | A working simulator of the dial-in flow |
| `/referral/[shareId]` | A shared referral |
| `/admin` | Health-worker credential approval |

## Environment

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | The backend |
| `NEXT_PUBLIC_SITE_URL` | This deployment. Without it, link previews fall back to a bare URL |
| `NEXT_PUBLIC_APK_URL` | The EAS install link. Absent, the download card says "not published yet" |
| `NEXT_PUBLIC_APK_VERSION` | Optional, e.g. `v1.0.0` |
| `NEXT_PUBLIC_USSD_CODE` | Shown in the dial-in simulator |

## Stack

Next.js 16 (App Router), React 19, Tailwind v4. Server components unless a page needs state.
`src/components/night.tsx` holds the primitives; `phone.tsx` renders the app mockups in the same
tokens the app uses, so they cannot drift out of step with it.

## The other repositories

- [`medrekk`](https://github.com/Robinson-Taiwo/medrekk) — the mobile app, and the documentation
- [`medrekk-backend`](https://github.com/Robinson-Taiwo/medrekk-backend) — API, consent, audit trail
