# Android — Play Billing Library 8.0.0

Starlight Bonds (`com.starlightbonds.app`) bills through
`cordova-plugin-purchase` / `capacitor-plugin-cdv-purchase` (`CdvPurchase.store`).

Pin **Play Billing Library 8.0.0** on the app module so Play Console does not
reject the AAB for an outdated Billing Library. If the Capacitor/Cordova plugin
already pulls a Billing Client version, either:

- leave the plugin’s version if it is **8.0.0 or newer** in the 8.x line, or
- force 8.0.0 as shown below so resolution is explicit.

Do not mix 6.x/7.x with 8.x in the same APK.

## 1. Repositories

Root `android/build.gradle` (or `dependencyResolutionManagement` in
`android/settings.gradle`):

```gradle
allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
```

```gradle
// android/settings.gradle (Capacitor 6/7 typical)
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
```

## 2. App module (`android/app/build.gradle`)

```gradle
android {
    namespace "com.starlightbonds.app"

    defaultConfig {
        applicationId "com.starlightbonds.app"
        minSdkVersion 23          // Billing Library 8.x floor
        targetSdkVersion 35       // API 36 required for updates after 31 Aug 2026
        versionCode 1
        versionName "1.0.0"
    }
}

dependencies {
    def billing_version = "8.0.0"
    implementation "com.android.billingclient:billing:$billing_version"
}
```

Kotlin DSL equivalent:

```kotlin
dependencies {
    val billingVersion = "8.0.0"
    implementation("com.android.billingclient:billing:$billingVersion")
}
```

After `npx cap sync`:

```bash
cd android
./gradlew :app:dependencies --configuration releaseRuntimeClasspath | grep billingclient
```

You want `com.android.billingclient:billing:8.0.0` (or a single 8.x version if
the plugin upgrades it). Duplicate major versions are a red flag.

### Resolution conflict

If the purchase plugin requests another 8.x patch, prefer one line:

```gradle
configurations.all {
    resolutionStrategy {
        force "com.android.billingclient:billing:8.0.0"
    }
}
```

Remove `force` once you have standardized on the plugin’s own 8.x version.

## 3. BILLING permission

Do **not** add `com.android.vending.BILLING` by hand. Library 8.x embeds it.

After a release assemble, confirm the merged manifest contains:

- `com.android.vending.BILLING`
- `com.google.android.play.billingclient.version` = `8.0.0`

```bash
cd android
./gradlew :app:processReleaseManifest
# inspect android/app/build/intermediates/merged_manifests/**/AndroidManifest.xml
```

If the version meta-data is stripped, Play treats the upload as an old Billing
Library. Check `tools:node="remove"` merge rules.

## 4. ProGuard / R8

```proguard
# android/app/proguard-rules.pro
-keep class com.android.billingclient.** { *; }
-keep class com.android.vending.billing.** { *; }
-keep class cc.fovea.purchase.** { *; }
-dontwarn com.android.billingclient.**
```

## 5. First AAB (required before Play IAP activate)

Play only lets you create in-app products after an upload that includes the
Billing Library. Use the **internal testing** track.

Package name must already be `com.starlightbonds.app` — it cannot change later.

## 6. Product IDs (match `src/native/billing.types.ts`)

| Play product ID | Play product type |
| --- | --- |
| `com.starlightbonds.starter_pack` | Consumable |
| `com.starlightbonds.gems_480` | Consumable |
| `com.starlightbonds.gems_1200` | Consumable |
| `com.starlightbonds.gems_2500` | Consumable |
| `com.starlightbonds.pass_premium` | Consumable |
| `com.starlightbonds.energy_refill` | Consumable |
| `com.starlightbonds.remove_ads` | Unmanaged / one-time (non-consumable) |

`remove_ads` must **not** be consumable or Restore will not return it.

License testing: Play Console → Settings → License testing → add Gmail accounts
that should get purchases without a real charge.

## 7. Capacitor install reminder

In the **game** repo (not this kit):

```bash
npm install cordova-plugin-purchase
npx cap sync android
```

Then apply the Gradle pin above if `billingclient` is older than 8.0.0.
