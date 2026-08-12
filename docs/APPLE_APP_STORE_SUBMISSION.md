# Apple App Store submission — Starlight Bonds

Bundle ID: `com.starlightbonds.app`  
Support: cl82salazar@gmail.com  
Age: 13+  

Companion: `STORE_LAUNCH_CHECKLIST.md`, `ios-snippets/storekit-setup.md`.

The **Capacitor / Xcode project is not in this repo**. Archive from the main
game app after copying `src/**`.

## Phase 0 — Account (Chris)

1. Enroll in the [Apple Developer Program](https://developer.apple.com/programs/) — **$99 USD / year**.
2. Complete identity verification.
3. Sign the Paid Applications Agreement in App Store Connect.
4. Add banking and tax. IAP stays incomplete until this is **Active**.
5. Register App ID `com.starlightbonds.app` with In-App Purchase enabled.

Status: `PROGRESS.md`.

## App Store Connect record

1. New app → iOS → **Starlight Bonds** → English (U.S.) → bundle ID `com.starlightbonds.app` → SKU `starlight-bonds-ios`.
2. User Access: account holder (Chris) at minimum.

## Listing metadata

| Field | Guidance |
| --- | --- |
| Name | Starlight Bonds (30 character max) |
| Subtitle | Collect celestial Bonds |
| Description | Free to play. Optional IAP. Randomized Bond pulls; odds disclosed in-app and at the hosted odds URL. 13+. Virtual items have no real-world cash value and cannot be cashed out. Support: cl82salazar@gmail.com |
| Keywords | gacha,rpg,anime,bonds,stars (100-character limit; research collisions) |
| Support URL | GitHub Pages for this repo, or a page that shows the support email |
| Privacy Policy URL | Hosted `legal/privacy-policy.html` |
| Category | Games → Role Playing (or Adventure) |
| Age rating | Questionnaire honest. Expect 12+ from infrequent mature themes + simulated gambling (loot boxes). **Not Kids Category.** |
| Copyright | 2026 Chris Salazar |

Screenshots: 6.7" and 6.1" iPhone required for current submissions; iPad if the binary supports iPad. Show real gameplay, the shop with **Restore Purchases**, and the odds disclosure — not a blank splash.

## Privacy

- Privacy policy must be live HTTPS before submit.
- Fill **App Privacy** nutrition labels: purchases; identifiers if you show ads or use ATT; crash data if a reporter is shipped. Do not claim “Data Not Collected” if StoreKit or ads collect anything.
- Add `PrivacyInfo.xcprivacy` for Required Reason APIs.
- If a later version adds accounts, ship in-app account deletion (Guideline 5.1.1(v)).

## In-app purchases

Create and **attach to the app version** (first IAP must ship with the binary):

| Product ID | Type | Price hint |
| --- | --- | --- |
| `com.starlightbonds.starter_pack` | Consumable | $2.99 |
| `com.starlightbonds.gems_480` | Consumable | $4.99 |
| `com.starlightbonds.gems_1200` | Consumable | $9.99 |
| `com.starlightbonds.gems_2500` | Consumable | $19.99 |
| `com.starlightbonds.pass_premium` | Consumable | $4.99 |
| `com.starlightbonds.energy_refill` | Consumable | $1.99 |
| `com.starlightbonds.remove_ads` | Non-Consumable | $2.99 |

Each product: reference name, review screenshot, English localization, price.

`pass_premium` is catalogued as a **consumable** in `billing.types.ts`, not an
auto-renewing subscription. Do not create it as a subscription unless you also
change the TypeScript kind and paywall disclosures.

**Restore Purchases** must be visible (Guideline 3.1.1). Call
`restorePurchasesNative()` from `src/game/purchaseNative.ts`.

**Loot boxes:** disclose odds before the player spends gems or tickets
(Guideline 3.1.1). Host `legal/gacha-odds.html` and keep EXAMPLE RATES until
live rates match the binary.

## Build and TestFlight

1. In the game repo: `npx cap sync ios`.
2. Xcode: In-App Purchase capability, paid team, version/build numbers.
3. Archive → Upload to App Store Connect.
4. Internal TestFlight, then external if you want Beta Review.
5. Sandbox-buy every SKU; restore `com.starlightbonds.remove_ads`.

## Review notes (App Review Information)

```
Contact: Chris Salazar
Email: cl82salazar@gmail.com
Phone: <Chris to fill>

Starlight Bonds is 13+. Optional IAP via StoreKit.
Privacy: <HOSTED_PRIVACY_URL>
Gacha odds (EXAMPLE until live lock): <HOSTED_ODDS_URL>
Product IDs:
  com.starlightbonds.starter_pack
  com.starlightbonds.gems_480
  com.starlightbonds.gems_1200
  com.starlightbonds.gems_2500
  com.starlightbonds.pass_premium
  com.starlightbonds.energy_refill
  com.starlightbonds.remove_ads
Restore Purchases is on the shop screen (restores remove_ads).
Virtual items have no real-world cash value and cannot be cashed out.
No login required. Complete a few story nodes, open Shop, open Bond Pull to see odds.
```

## Common rejection checks

- Missing Restore control (non-consumable `remove_ads`)
- Odds not visible before a pull
- Privacy URL 404
- IAP still Missing Metadata (unsigned paid agreement)
- Age rating / Kids mismatch
- Non-IAP payment sheet for gems
- EXAMPLE odds promised as live in review notes — either lock rates or say they are examples

## Submit

Select the processed build, attach all IAP, set release to **Manual** for the
first dual-store launch, Submit for Review. Typical first review is 24–48 hours;
budget extra for IAP + gacha.
