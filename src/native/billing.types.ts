export type StorePlatform = "ios" | "android" | "web";
export type ProductKind = "consumable" | "non_consumable";
export type IapProductDef = { id: string; kind: ProductKind; priceHintUsd?: number };
export type NativePurchaseResult = {
  productId: string; platform: StorePlatform; transactionId: string;
  purchaseToken: string; receipt?: string; mock?: boolean;
};
export type BillingInitState = { ready: boolean; platform: StorePlatform; error?: string };
export const IAP_PRODUCTS: IapProductDef[] = [
  { id: "com.starlightbonds.starter_pack", kind: "consumable", priceHintUsd: 2.99 },
  { id: "com.starlightbonds.gems_480", kind: "consumable", priceHintUsd: 4.99 },
  { id: "com.starlightbonds.gems_1200", kind: "consumable", priceHintUsd: 9.99 },
  { id: "com.starlightbonds.gems_2500", kind: "consumable", priceHintUsd: 19.99 },
  { id: "com.starlightbonds.pass_premium", kind: "consumable", priceHintUsd: 4.99 },
  { id: "com.starlightbonds.energy_refill", kind: "consumable", priceHintUsd: 1.99 },
  { id: "com.starlightbonds.remove_ads", kind: "non_consumable", priceHintUsd: 2.99 },
];
