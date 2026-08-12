# Google Play submission — Starlight Bonds

Package name: `com.starlightbonds.app`  
Support: cl82salazar@gmail.com  
Age: 13+  

Companion: `STORE_LAUNCH_CHECKLIST.md`, `android-snippets/play-billing-gradle.md`.

The **Capacitor game AAB is not in this repo**. Build from the main game app
after copying `src/**` (see `README.md`).

## Phase 0 — Account (Chris)

1. [Play Console](https://play.google.com/console) on the publisher Google account.
2. Pay the **one-time $25** registration fee.
3. Finish identity verification. A personal account shows the developer’s legal name on the listing.
4. Accept the Play Developer Distribution Agreement.
5. Payments profile + tax if IAP will be charged (needed before paid products are live).

Until this is done you cannot create the app or upload an AAB. Status: `PROGRESS.md`.

## Create the app

1. Create app → **Starlight Bonds** → English (United States) → Free → Game.
2. Category: Role Playing or Casual — match the actual build.
3. Set `applicationId` / namespace to `com.starlightbonds.app` **before the first upload**. It cannot be changed.

## Store listing

| Field | Value |
| --- | --- |
| App name | Starlight Bonds |
| Short description | Collect celestial Bonds, pull on featured banners, and grow your starlit party. |
| Full description | Free to play with optional in-app purchases. Randomized Bond pulls (gacha) with published odds. Ages 13+. Virtual items have no cash-out value. Support: cl82salazar@gmail.com. Link hosted privacy + odds URLs. |
| Icon | 512 × 512 PNG |
| Feature graphic | 1024 × 500 |
| Screenshots | At least 2 phone; 7" / 10" tablet only if you claim tablet support |
| Contact email | cl82salazar@gmail.com |
| Privacy policy URL | Hosted `legal/privacy-policy.html` (GitHub Pages or any HTTPS host) |

**Contains ads:** Yes if the binary shows ads until `com.starlightbonds.remove_ads` is owned. Keep the declaration honest.

## App content

Complete before closed testing (internal-only can skip some forms; closed/production cannot):

- Privacy policy — live HTTPS URL
- Ads — matches the build
- **Target audience — 13–15 / 16–17 / 18+ only. Do not select under 13.**
- Data safety — declare purchase history; device IDs if ads or crash SDKs collect them; we do not sell data. Apps that collect nothing still submit the form.
- IARC content rating — answer loot box / simulated gambling questions truthfully (expect Teen / 13+ equivalent)
- News / COVID / government / health — no
- Financial features — no (virtual currency is not redeemable)

## In-app products

Upload an AAB that includes **Play Billing Library 8.0.0** first (internal testing is enough), then create:

| Product ID | Type | Default price |
| --- | --- | --- |
| `com.starlightbonds.starter_pack` | Consumable | $2.99 |
| `com.starlightbonds.gems_480` | Consumable | $4.99 |
| `com.starlightbonds.gems_1200` | Consumable | $9.99 |
| `com.starlightbonds.gems_2500` | Consumable | $19.99 |
| `com.starlightbonds.pass_premium` | Consumable | $4.99 |
| `com.starlightbonds.energy_refill` | Consumable | $1.99 |
| `com.starlightbonds.remove_ads` | One-time (non-consumable) | $2.99 |

Activate products. Add license testers.

Play policy: randomized virtual items must disclose odds **in advance of, and close to**, the purchase. Host `legal/gacha-odds.html` (EXAMPLE banner until live rates) and show the same table in the pull UI.

## Testing tracks

1. **Internal testing** — prove boot, IAP, restore `remove_ads`.
2. **Closed testing** — new personal accounts (after 13 Nov 2023) need **at least 12 testers opted in for 14 continuous days**, then apply for production access from the Dashboard questionnaire.
3. Testers must use the Play Console opt-in link and install from Play. Recruit 14–16 so dropouts do not reset the clock.

## Technical upload

- Android App Bundle (`.aab`)
- `applicationId` `com.starlightbonds.app`
- `minSdk` 23+
- `targetSdk` 35 now; **API 36 from 31 Aug 2026** for new apps/updates
- Billing Library **8.0.0** (see `android-snippets/play-billing-gradle.md`)
- Play App Signing recommended

## Review notes (paste into Play Console)

```
Starlight Bonds is a 13+ collection game with optional IAP.
Support: cl82salazar@gmail.com
Privacy: <HOSTED_PRIVACY_URL>
Gacha odds (EXAMPLE rates until live lock): <HOSTED_ODDS_URL>
IAP IDs:
  com.starlightbonds.starter_pack
  com.starlightbonds.gems_480
  com.starlightbonds.gems_1200
  com.starlightbonds.gems_2500
  com.starlightbonds.pass_premium
  com.starlightbonds.energy_refill
  com.starlightbonds.remove_ads
Virtual items cannot be cashed out for real money.
Restore is implemented for the non-consumable remove_ads product.
No under-13 audience. No real-money gambling.
```

## Production

After closed testing + production-access approval, promote the AAB to Production.
Staged 20% rollout is safer for a first IAP game. Watch ANRs and billing errors
for 48 hours.
