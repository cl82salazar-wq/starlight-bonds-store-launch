# Starlight Bonds — Dual-Store Launch Package

Drop-in legal pages, IAP catalog, native billing helpers, and Play / App Store
submission docs for **Starlight Bonds**.

| | |
| --- | --- |
| App | Starlight Bonds |
| Bundle ID / applicationId | `com.starlightbonds.app` |
| Support | [cl82salazar@gmail.com](mailto:cl82salazar@gmail.com) |
| Age | 13+ |
| This repo | Launch kit only — **not** the Capacitor game binary |

The main game lives in a separate Capacitor repo (not included here). Copy
`src/**` into that app when it exists. See `PROGRESS.md`.

## What’s in this package

```
README.md
PROGRESS.md
STORE_LAUNCH_CHECKLIST.md
legal/privacy-policy.html      # host on public HTTPS
legal/gacha-odds.html          # EXAMPLE rates; host next to privacy
src/native/billing.types.ts    # IAP_PRODUCTS + types
src/native/billing.ts          # ensureBillingInitialized, purchaseWithStoreFallback, restoreWithNative
src/game/purchaseNative.ts     # thin game-layer wrappers
android-snippets/play-billing-gradle.md
ios-snippets/storekit-setup.md
docs/GOOGLE_PLAY_SUBMISSION.md
docs/APPLE_APP_STORE_SUBMISSION.md
```

## Copy `src/**` into the game app

From the Capacitor game repo (adjust the destination if your tree differs):

```bash
LAUNCH_KIT=/path/to/starlight-bonds-store-launch
GAME=/path/to/starlight-bonds   # main Capacitor app — not this repo

mkdir -p "$GAME/src/native" "$GAME/src/game"
cp "$LAUNCH_KIT/src/native/billing.types.ts" "$GAME/src/native/"
cp "$LAUNCH_KIT/src/native/billing.ts"       "$GAME/src/native/"
cp "$LAUNCH_KIT/src/game/purchaseNative.ts"  "$GAME/src/game/"
```

Then in the game app:

```bash
npm install cordova-plugin-purchase
# Capacitor 6+ alternative (same CdvPurchase.store API):
# npm install capacitor-plugin-cdv-purchase
npx cap sync
```

If you use the Capacitor-native package, expose the store on `globalThis` once
at boot so `billing.ts` can find `CdvPurchase.store`:

```ts
import { store, ProductType, Platform } from "capacitor-plugin-cdv-purchase";

(globalThis as any).CdvPurchase = { store, ProductType, Platform };
```

Wire shop UI to the thin helpers:

```ts
import {
  initNativeBilling,
  purchaseIapNative,
  restorePurchasesNative,
  IAP_PRODUCTS,
} from "./game/purchaseNative";

await initNativeBilling();
const result = await purchaseIapNative("com.starlightbonds.gems_480");
if (result.mock) {
  // Browser / missing plugin — do not treat as a paid store charge
}
const restored = await restorePurchasesNative();
```

`purchaseWithStoreFallback` uses a **web mock** when the platform is `web` or
the plugin is missing (`allowMock` defaults to true via `purchaseIapNative`).
Store builds should still ship the plugin; the mock is for local UI work only.

### IAP product IDs (must match both consoles)

Defined in `src/native/billing.types.ts`:

| Product ID | Kind | Price hint (USD) |
| --- | --- | --- |
| `com.starlightbonds.starter_pack` | consumable | 2.99 |
| `com.starlightbonds.gems_480` | consumable | 4.99 |
| `com.starlightbonds.gems_1200` | consumable | 9.99 |
| `com.starlightbonds.gems_2500` | consumable | 19.99 |
| `com.starlightbonds.pass_premium` | consumable | 4.99 |
| `com.starlightbonds.energy_refill` | consumable | 1.99 |
| `com.starlightbonds.remove_ads` | non_consumable | 2.99 |

Create these IDs **exactly** in Google Play Console and App Store Connect.
`remove_ads` is the restorable non-consumable; Restore Purchases must be visible
on iOS (see `ios-snippets/storekit-setup.md`).

## Host the legal pages

Play and App Store Connect need a **public HTTPS** privacy URL. Host the two
HTML files as static pages (do not leave them only in this git repo).

### GitHub Pages (this repo)

1. Settings → Pages → Deploy from branch **main** → folder `/ (root)` or `/docs`.
2. If you deploy from repo root, the URLs are:

```
https://cl82salazar-wq.github.io/starlight-bonds-store-launch/legal/privacy-policy.html
https://cl82salazar-wq.github.io/starlight-bonds-store-launch/legal/gacha-odds.html
```

3. Confirm both load without login and over HTTPS.
4. Paste the privacy URL into Play Console (App content) and App Store Connect
   (App Information → Privacy Policy URL).
5. Link the odds page from the in-game pull confirmation UI **and** from both
   store listings. The odds page is marked **EXAMPLE RATES** — replace numbers
   with live rates before production submit.

### Any other static host

Upload `legal/privacy-policy.html` and `legal/gacha-odds.html` to Netlify,
Cloudflare Pages, S3+CloudFront, etc. Keep the filenames and keep them
side-by-side so relative links still work.

## Native store setup

- Android Gradle / Play Billing Library **8.0.0**: `android-snippets/play-billing-gradle.md`
- iOS StoreKit capability + sandbox: `ios-snippets/storekit-setup.md`
- Full Play Console walkthrough: `docs/GOOGLE_PLAY_SUBMISSION.md`
- Full App Store Connect walkthrough: `docs/APPLE_APP_STORE_SUBMISSION.md`
- Phase checklist: `STORE_LAUNCH_CHECKLIST.md`

## Status

Legal drafts and billing drop-ins are **ready**. Phase 0 developer accounts
(Play **$25**, Apple **$99/year**) need Chris. The Capacitor game repo is
**not** in this package — copy `src/**` when it exists. Details: `PROGRESS.md`.

This package is documentation + TypeScript drop-ins. Typecheck is not required
here; the game app owns `tsconfig` once the files are copied in.
