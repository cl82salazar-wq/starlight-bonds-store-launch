# iOS — StoreKit setup

Bundle ID: `com.starlightbonds.app`  
Billing JS: `src/native/billing.ts` (`CdvPurchase.store` from
`cordova-plugin-purchase` or `capacitor-plugin-cdv-purchase`, StoreKit 2 on
iOS 15+).

The Xcode project lives in the **Capacitor game repo**, not this kit.

## 1. Capability and signing

```bash
npx cap sync ios
npx cap open ios
```

1. Select the **App** target.
2. **Signing & Capabilities** → **+ Capability** → **In-App Purchase**.
3. Team = paid Apple Developer Program account (**Chris, $99/year** — `PROGRESS.md`).
4. Bundle Identifier = `com.starlightbonds.app` (must match App Store Connect).

## 2. App Store Connect products

Create IAP on the Starlight Bonds app with these IDs (exact match to
`IAP_PRODUCTS` in `src/native/billing.types.ts`):

| Product ID | App Store type | Price hint |
| --- | --- | --- |
| `com.starlightbonds.starter_pack` | Consumable | USD 2.99 |
| `com.starlightbonds.gems_480` | Consumable | USD 4.99 |
| `com.starlightbonds.gems_1200` | Consumable | USD 9.99 |
| `com.starlightbonds.gems_2500` | Consumable | USD 19.99 |
| `com.starlightbonds.pass_premium` | Consumable | USD 4.99 |
| `com.starlightbonds.energy_refill` | Consumable | USD 1.99 |
| `com.starlightbonds.remove_ads` | Non-Consumable | USD 2.99 |

Each product needs: reference name, English (U.S.) localization, price, review
screenshot (shop screen is enough). Paid Apps Agreement + banking/tax must be
**Active** or status stays Missing Metadata.

`pass_premium` is a **consumable** in this catalog (not an auto-renewing
subscription). If you later convert it to a subscription, create a new
subscription group and update `ProductKind` in `billing.types.ts`.

## 3. Restore Purchases (Guideline 3.1.1)

Show a **Restore Purchases** control on the shop or settings screen. Wire it to:

```ts
import { restorePurchasesNative } from "./game/purchaseNative";

const owned = await restorePurchasesNative();
// Grant remove_ads (and any future non-consumables) from owned[].productId
```

`restoreWithNative` only returns `kind === "non_consumable"` rows. Today that is
`com.starlightbonds.remove_ads`. Consumable gem packs are not restorable after
grant.

Apple rejects binaries that sell non-consumables without a visible restore path.

## 4. Local StoreKit configuration (optional)

Useful before sandbox accounts exist:

1. Xcode → File → New → **StoreKit Configuration File** → `StarlightBonds.storekit`
2. Add the seven product IDs with the types/prices above.
3. Scheme → Run → Options → StoreKit Configuration → that file.

## 5. Sandbox Apple ID

1. App Store Connect → Users and Access → Sandbox → Testers.
2. Create a sandbox Apple ID (not Chris’s personal Apple ID).
3. Device: Settings → App Store → Sandbox Account.
4. Install a TestFlight or Xcode build and buy each SKU once.
5. Delete/reinstall (or clear app data) and tap Restore — `remove_ads` should return.

## 6. Privacy manifest

If the game or plugins use Required Reason APIs (UserDefaults, file timestamps,
disk space, etc.), add `PrivacyInfo.xcprivacy` to the iOS target. Missing
manifests are a common 2026 rejection.

## 7. Odds disclosure

Link hosted `legal/gacha-odds.html` from the pull confirmation UI **before**
gems or tickets are spent (Guideline 3.1.1 loot boxes). Keep the
**EXAMPLE RATES** banner until live rates match the shipped binary.

## 8. Plugin install (game repo)

```bash
npm install cordova-plugin-purchase
npx cap sync ios
```

Capacitor 6+ native package (same JS API):

```bash
npm install capacitor-plugin-cdv-purchase
npx cap sync ios
```

If using the Capacitor package, assign `globalThis.CdvPurchase` at boot so
`billing.ts` can see `CdvPurchase.store` (see `README.md`).
