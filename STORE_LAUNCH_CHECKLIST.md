# Starlight Bonds — Store Launch Checklist

App: **Starlight Bonds** · Bundle ID: `com.starlightbonds.app` · Support: `cl82salazar@gmail.com`  
Track live status in `PROGRESS.md`. This checklist is the dual-store work order.

Legend: `[x]` done in this package · `[ ]` still open · **Chris** = needs the publisher account holder.

---

## Phase 0 — Developer accounts (needs Chris)

Play and Apple will not accept uploads until these are paid and verified.

### Google Play — $25 one-time

- [ ] **Chris:** Create / confirm Play Console account and pay the **$25** registration fee
- [ ] **Chris:** Complete identity verification (government ID)
- [ ] Accept Play Developer Distribution Agreement
- [ ] Payments profile + tax (required before paid IAP can go live)
- [ ] Create the app record named **Starlight Bonds** (application ID will be `com.starlightbonds.app` on first AAB)

### Apple — $99 / year

- [ ] **Chris:** Enroll in the Apple Developer Program (**$99 USD/year**)
- [ ] **Chris:** Identity verification
- [ ] Sign Paid Applications Agreement in App Store Connect
- [ ] Banking + tax forms Active (IAP stays “Missing Metadata” until this is done)
- [ ] Register App ID `com.starlightbonds.app` with In-App Purchase enabled
- [ ] Create the iOS app record (SKU e.g. `starlight-bonds-ios`)

### Shared

- [ ] Confirm `cl82salazar@gmail.com` is monitored for store + player mail
- [ ] Decide listing locale: English (United States) first

**Exit:** Both consoles exist, agreements signed, bundle ID reserved.

---

## Phase 1 — Legal, IAP catalog, billing drop-in

### Legal (drafts are in this repo)

- [x] Privacy policy HTML (`legal/privacy-policy.html`) — 13+, IAP, gacha non-cash-out
- [x] Gacha odds HTML (`legal/gacha-odds.html`) — EXAMPLE rates banner + SKU list
- [ ] **Chris:** Host both files on public HTTPS (see README → GitHub Pages)
- [ ] Verify privacy URL loads logged-out, no 404, `https://`
- [ ] Link odds URL from shop / pull UI in the game (when the game repo exists)

### Billing drop-ins (copy into the Capacitor game)

- [x] `src/native/billing.types.ts` — `IAP_PRODUCTS`
- [x] `src/native/billing.ts` — `ensureBillingInitialized`, `purchaseWithStoreFallback`, `restoreWithNative`
- [x] `src/game/purchaseNative.ts` — thin helpers
- [ ] Copy `src/**` into the main game app (blocked until that repo exists)
- [ ] `npm install cordova-plugin-purchase` (or `capacitor-plugin-cdv-purchase`) + `npx cap sync`
- [ ] Shop UI: buy buttons use `purchaseIapNative(id)`; Restore uses `restorePurchasesNative()`
- [ ] Odds shown **before** gem/ticket spend (Play + Apple loot-box rules)

### Create the seven products on both stores

IDs must match `IAP_PRODUCTS` exactly:

| Product ID | Play type | App Store type | Price hint |
| --- | --- | --- | --- |
| `com.starlightbonds.starter_pack` | Consumable | Consumable | $2.99 |
| `com.starlightbonds.gems_480` | Consumable | Consumable | $4.99 |
| `com.starlightbonds.gems_1200` | Consumable | Consumable | $9.99 |
| `com.starlightbonds.gems_2500` | Consumable | Consumable | $19.99 |
| `com.starlightbonds.pass_premium` | Consumable | Consumable | $4.99 |
| `com.starlightbonds.energy_refill` | Consumable | Consumable | $1.99 |
| `com.starlightbonds.remove_ads` | One-time / non-consumable | Non-Consumable | $2.99 |

- [ ] Play: products created + activated (needs an AAB that includes Billing Library first)
- [ ] App Store Connect: products Ready to Submit, English localization, review screenshots
- [ ] License testers (Play) and Sandbox Apple IDs (App Store Connect)

**Exit:** HTTPS legal URLs live; SKUs exist in both consoles; `src/**` copied and compiling in the game app.

---

## Phase 2 — Native builds and sandbox IAP

Blocked on the main Capacitor game repo.

### Android

- [ ] `applicationId` / namespace `com.starlightbonds.app`
- [ ] Play Billing Library **8.0.0** present (plugin or explicit Gradle — `android-snippets/play-billing-gradle.md`)
- [ ] `minSdk` 23+, `targetSdk` 35 (plan 36 before 31 Aug 2026)
- [ ] Internal-test AAB uploaded; license tester can buy each SKU
- [ ] Consumables grant once; `remove_ads` restores

### iOS

- [ ] Xcode In-App Purchase capability (`ios-snippets/storekit-setup.md`)
- [ ] Signing team = paid Apple Developer account
- [ ] Restore Purchases control visible on shop/settings
- [ ] Sandbox purchase of every SKU; restore `remove_ads`
- [ ] TestFlight internal build installed on a device

### Both

- [ ] Web mock path still works in browser (`result.mock === true`)
- [ ] Store builds do not present a non-store payment sheet for gems
- [ ] Crash-free boot; pull UI shows EXAMPLE odds until live rates lock
- [ ] Privacy + odds URLs open from in-app links

**Exit:** Paid test purchases succeed on a Play license account and an Apple sandbox account.

---

## Phase 3 — Store listing, policy forms, submit

### Google Play (`docs/GOOGLE_PLAY_SUBMISSION.md`)

- [ ] Store listing: name, short/full description, icon 512, feature graphic 1024×500, phone screenshots
- [ ] Contact email `cl82salazar@gmail.com` + privacy policy URL
- [ ] Ads declaration matches the binary
- [ ] Target audience **13+ only** (do not select under 13)
- [ ] Data safety form submitted
- [ ] IARC content rating (answer gacha / simulated gambling honestly)
- [ ] Closed testing: **12 opted-in testers × 14 continuous days** (new personal accounts)
- [ ] Production-access questionnaire (after the 14 days)
- [ ] Review notes include odds URL, SKU list, no cash-out
- [ ] Promote to production (manual / staged 20% recommended)

### Apple (`docs/APPLE_APP_STORE_SUBMISSION.md`)

- [ ] Metadata: name, subtitle, description, keywords, category Games
- [ ] Screenshots (6.7" and 6.1" iPhone; iPad if the binary supports it)
- [ ] Privacy Policy URL + App Privacy nutrition labels
- [ ] `PrivacyInfo.xcprivacy` if Required Reason APIs are used
- [ ] Age rating questionnaire — not Kids Category
- [ ] All IAP attached to the version
- [ ] App Review notes: support email, odds URL, how to find Restore, no login required
- [ ] Submit for Review (manual release recommended for first dual-store ship)

**Exit:** Both listings in review or live.

---

## Phase 4 — Launch watch (after approve)

- [ ] Replace EXAMPLE gacha rates with live rates on the hosted page **and** in the binary if they still differ
- [ ] Monitor Play ANRs / billing errors and App Store crash reports for 48 hours
- [ ] Confirm Restore and `remove_ads` on a real (non-sandbox) purchase
- [ ] Answer player mail at `cl82salazar@gmail.com` within a reasonable window
- [ ] Cancel path for any future subscription SKU documented (current catalog treats `pass_premium` as consumable)

---

## Blockers (from `PROGRESS.md`)

1. **Chris** — Play $25 + Apple $99  
2. Host legal HTML on public HTTPS  
3. Main Starlight Bonds **Capacitor game repo** — this package does not contain it
