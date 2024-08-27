import optimizely from "@optimizely/optimizely-sdk";
import { unstable_flag as flag } from "@vercel/flags/next";
import { getShopperFromHeaders } from "./utils";

export const showBuyNowFlag = flag<{ enabled: boolean; text?: string }>({
  key: "buynow",
  description: "Flag for showing the Buy Now button on the product detail page",
  options: [
    { label: "Hide", value: { enabled: false } },
    { label: "Show", value: { enabled: true } },
  ],
  async decide({ headers }) {
    const client = optimizely.createInstance({
      sdkKey: process.env.OPTIMIZELY_SDK_KEY!,
    });
    if (!client) {
      throw new Error("Failed to create client");
    }
    await client.onReady();

    const shopper = getShopperFromHeaders(headers);

    const context = client.createUserContext(shopper);

    if (!context) {
      throw new Error("Failed to create user context");
    }
    const decision = context.decide("buynow");

    return {
      enabled: decision.enabled,
      text: decision.variables.buynow_text as string,
    };
  },
});

export const showPromoBannerFlag = flag<boolean>({
  key: "showPromoBanner",
  defaultValue: false,
  description: "Flag for showing promo banner on homepage",
  options: [
    { value: false, label: "Hide" },
    { value: true, label: "Show" },
  ],
  async decide() {
    return false;
  },
});

export const precomputeFlags = [showPromoBannerFlag] as const;
