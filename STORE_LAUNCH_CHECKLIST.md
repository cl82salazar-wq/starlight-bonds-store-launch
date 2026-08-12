# Starlight Bonds Launch Checklist

## Phase 0 Accounts
- [ ] Play Console + Starlight Bonds app
- [ ] Apple Developer + Bundle ID com.starlightbonds.app
- [x] Privacy draft legal/privacy-policy.html
- [x] Odds draft legal/gacha-odds.html (EXAMPLE)
- [ ] Host legal pages on HTTPS
- [ ] Monitor cl82salazar@gmail.com

## Phase 1 Native
- [ ] capacitor appId com.starlightbonds.app
- [ ] cap sync android/ios, signing, icons, targetSdk 36

## Phase 2 Billing
- [ ] Install cordova-plugin-purchase, copy src/**, wire helpers
- [ ] PBL 8+ and iOS IAP capability

## Phase 3 SKUs
See src/native/billing.types.ts IAP_PRODUCTS
