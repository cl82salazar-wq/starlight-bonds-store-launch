import { IAP_PRODUCTS, type BillingInitState, type IapProductDef, type NativePurchaseResult, type StorePlatform } from "./billing.types";

let initState: BillingInitState = { ready: false, platform: "web" };
let storeRef: any = null;

function detectPlatform(): StorePlatform {
  try {
    const p = (globalThis as any).Capacitor?.getPlatform?.();
    if (p === "ios" || p === "android") return p;
  } catch {}
  return "web";
}

export async function ensureBillingInitialized(
  products: IapProductDef[] = IAP_PRODUCTS,
): Promise<BillingInitState> {
  const platform = detectPlatform();
  if (initState.ready && initState.platform === platform) return initState;
  if (platform === "web") {
    initState = { ready: true, platform };
    return initState;
  }
  try {
    const CdvPurchase = (globalThis as any).CdvPurchase;
    if (!CdvPurchase?.store) {
      initState = { ready: false, platform, error: "cordova-plugin-purchase not available" };
      return initState;
    }
    const store = CdvPurchase.store;
    storeRef = store;
    for (const p of products) {
      store.register({
        id: p.id,
        type:
          p.kind === "non_consumable"
            ? CdvPurchase.ProductType.NON_CONSUMABLE
            : CdvPurchase.ProductType.CONSUMABLE,
        platform:
          platform === "ios"
            ? CdvPurchase.Platform.APPLE_APPSTORE
            : CdvPurchase.Platform.GOOGLE_PLAY,
      });
    }
    await new Promise<void>((resolve) => {
      store.ready(() => resolve());
      store.initialize([
        platform === "ios"
          ? CdvPurchase.Platform.APPLE_APPSTORE
          : CdvPurchase.Platform.GOOGLE_PLAY,
      ]);
      setTimeout(() => resolve(), 8000);
    });
    initState = { ready: true, platform };
    return initState;
  } catch (e: any) {
    initState = { ready: false, platform, error: e?.message || String(e) };
    return initState;
  }
}

function mockPurchase(productId: string): NativePurchaseResult {
  return {
    productId,
    platform: "web",
    transactionId: "mock_" + Date.now(),
    purchaseToken: "",
    mock: true,
  };
}

export async function purchaseWithStoreFallback(
  productId: string,
  opts?: { allowMock?: boolean },
): Promise<NativePurchaseResult> {
  const allowMock = opts?.allowMock !== false;
  const state = await ensureBillingInitialized();
  if (state.platform === "web" || !storeRef) {
    if (!allowMock) throw new Error(state.error || "Native billing unavailable");
    return mockPurchase(productId);
  }
  const product = storeRef.get(productId);
  if (!product) {
    if (!allowMock) throw new Error("Unknown product " + productId);
    return mockPurchase(productId);
  }
  return new Promise((resolve, reject) => {
    const offer = product.getOffer?.() || product.offers?.[0];
    if (!offer) return reject(new Error("No offer for " + productId));
    storeRef
      .when()
      .approved((txn: any) => {
        const result: NativePurchaseResult = {
          productId,
          platform: state.platform,
          transactionId: String(txn?.transactionId || txn?.id || ""),
          purchaseToken: String(
            txn?.purchaseToken || txn?.nativePurchase?.purchaseToken || "",
          ),
          receipt: txn?.nativePurchase?.appStoreReceipt || txn?.transactionReceipt,
        };
        txn.verify?.();
        txn.finish?.();
        resolve(result);
      })
      .cancelled(() => reject(new Error("Purchase cancelled")));
    offer.order();
  });
}

export async function restoreWithNative(): Promise<NativePurchaseResult[]> {
  const state = await ensureBillingInitialized();
  if (state.platform === "web" || !storeRef) return [];
  await storeRef.restorePurchases?.();
  const owned: NativePurchaseResult[] = [];
  for (const p of IAP_PRODUCTS) {
    if (p.kind !== "non_consumable") continue;
    const product = storeRef.get(p.id);
    if (product?.owned) {
      owned.push({
        productId: p.id,
        platform: state.platform,
        transactionId: "restore_" + p.id,
        purchaseToken: "",
      });
    }
  }
  return owned;
}

export function getBillingInitState(): BillingInitState {
  return initState;
}
