import { ensureBillingInitialized, purchaseWithStoreFallback, restoreWithNative } from "../native/billing";
import { IAP_PRODUCTS, type NativePurchaseResult } from "../native/billing.types";
export { IAP_PRODUCTS };
export async function initNativeBilling(): Promise<void> {
  await ensureBillingInitialized(IAP_PRODUCTS);
}
export async function purchaseIapNative(productId: string): Promise<NativePurchaseResult> {
  return purchaseWithStoreFallback(productId, { allowMock: true });
}
export async function restorePurchasesNative(): Promise<NativePurchaseResult[]> {
  return restoreWithNative();
}
